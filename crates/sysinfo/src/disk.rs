// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Physical disk detection (model, size, type) and logical disk space reporting.

/// Returns formatted disk space strings for real mounted filesystems.
///
/// Skips pseudo-filesystems unconditionally. Skips `fuse.*` mounts unless
/// `include_fuse` is true — FUSE mounts can block indefinitely on `statvfs`
/// (e.g. cryfs/EncFS vaults), so they are only enabled in `--full` mode.
///
/// On Linux, reads /proc/mounts and calls statvfs ourselves so we can filter
/// before the blocking call. On other platforms, delegates to sysinfo::Disks.
pub fn detect_logical_disks(include_fuse: bool) -> Vec<(String, u64, u64, String)> {
    #[cfg(target_os = "linux")]
    {
        detect_logical_linux(include_fuse)
    }

    #[cfg(not(target_os = "linux"))]
    {
        let _ = include_fuse;
        detect_logical_sysinfo()
    }
}

/// Filesystem types that are virtual/pseudo and should never appear in disk output.
#[cfg(target_os = "linux")]
fn is_skip_fs(fs_type: &str, include_fuse: bool) -> bool {
    const SKIP: &[&str] = &[
        "sysfs",
        "proc",
        "devtmpfs",
        "tmpfs",
        "devpts",
        "cgroup",
        "cgroup2",
        "pstore",
        "bpf",
        "tracefs",
        "debugfs",
        "securityfs",
        "hugetlbfs",
        "mqueue",
        "fusectl",
        "rpc_pipefs",
        "configfs",
        "autofs",
        "efivarfs",
        "binfmt_misc",
        "squashfs",
        "overlay",
        "ramfs",
        "rootfs",
        "nsfs",
        "pipefs",
        "sockfs",
        "anon_inodefs",
        "cpuset",
    ];
    // fuse.* covers gvfsd-fuse, cryfs, gocryptfs, encfs, etc.
    SKIP.contains(&fs_type) || (fs_type.starts_with("fuse.") && !include_fuse)
}

#[cfg(target_os = "linux")]
fn detect_logical_linux(include_fuse: bool) -> Vec<(String, u64, u64, String)> {
    use std::collections::HashSet;
    use std::ffi::CString;

    let mounts = std::fs::read_to_string("/proc/mounts").unwrap_or_default();
    let mut results = Vec::new();
    let mut seen_devs: HashSet<String> = HashSet::new();

    for line in mounts.lines() {
        let parts: Vec<&str> = line.splitn(4, ' ').collect();
        if parts.len() < 3 {
            continue;
        }
        let device = parts[0];
        let mount_point = parts[1];
        let fs_type = parts[2];

        if is_skip_fs(fs_type, include_fuse) {
            continue;
        }

        // Deduplicate bind mounts / multiple mounts of the same device.
        if device.starts_with('/') && !seen_devs.insert(device.to_string()) {
            continue;
        }

        let Ok(mp_c) = CString::new(mount_point) else {
            continue;
        };

        let mut stat: libc::statvfs = unsafe { std::mem::zeroed() };
        if unsafe { libc::statvfs(mp_c.as_ptr(), &mut stat) } != 0 {
            continue;
        }

        let total = (stat.f_blocks as u64).saturating_mul(stat.f_frsize as u64);
        let avail = (stat.f_bavail as u64).saturating_mul(stat.f_frsize as u64);

        if total == 0 {
            continue;
        }

        results.push((mount_point.to_string(), total, avail, fs_type.to_string()));
    }

    results
}

#[cfg(not(target_os = "linux"))]
fn detect_logical_sysinfo() -> Vec<(String, u64, u64, String)> {
    use sysinfo::Disks;
    Disks::new_with_refreshed_list()
        .iter()
        .filter(|d| d.total_space() > 0)
        .map(|d| {
            (
                d.mount_point().to_string_lossy().to_string(),
                d.total_space(),
                d.available_space(),
                d.file_system().to_string_lossy().to_string(),
            )
        })
        .collect()
}

pub fn detect_physical_disks() -> Vec<String> {
    #[cfg(target_os = "linux")]
    return detect_linux();

    #[cfg(target_os = "macos")]
    return detect_macos();

    #[cfg(target_os = "windows")]
    return detect_windows();

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    return Vec::new();
}

#[cfg(target_os = "linux")]
fn detect_linux() -> Vec<String> {
    use std::fs;

    let Ok(entries) = fs::read_dir("/sys/class/block") else {
        return Vec::new();
    };

    let mut disks = Vec::new();

    for entry in entries.flatten() {
        let name = entry.file_name();
        let name = name.to_string_lossy();

        // Skip partitions, virtual, and loop devices
        if name.starts_with("loop")
            || name.starts_with("ram")
            || name.starts_with("zram")
            || name.starts_with("dm-")
            || name.starts_with("md")
        {
            continue;
        }

        let dev_path = entry.path();

        // Skip partitions (they have a "partition" file)
        if dev_path.join("partition").exists() {
            continue;
        }

        // Skip devices with no queue (not a real block device)
        if !dev_path.join("queue").exists() {
            continue;
        }

        let model = fs::read_to_string(dev_path.join("device/model"))
            .map(|s| strip_embedded_size(s.trim()).to_string())
            .unwrap_or_default();

        // Size in 512-byte sectors
        let size_bytes = fs::read_to_string(dev_path.join("size"))
            .ok()
            .and_then(|s| s.trim().parse::<u64>().ok())
            .map(|sectors| sectors * 512);

        let rotational = fs::read_to_string(dev_path.join("queue/rotational"))
            .map(|s| s.trim() == "1")
            .unwrap_or(false);

        let is_nvme = name.starts_with("nvme");

        let kind = if is_nvme {
            "NVMe SSD"
        } else if rotational {
            "HDD"
        } else {
            "SSD"
        };

        let size_str = size_bytes.map(format_size).unwrap_or_default();

        let label = if model.is_empty() {
            format!("{} [{}]", size_str, kind)
        } else {
            format!("{} {} [{}]", model.trim(), size_str, kind)
        };

        let label = label.trim().to_string();
        if !label.is_empty() {
            disks.push(label);
        }
    }

    disks.sort();
    disks
}

#[cfg(target_os = "macos")]
fn detect_macos() -> Vec<String> {
    // `diskutil list -plist` lists all disks; parse the XML property list.
    // We only want whole disks (not partitions), so we look at top-level entries.
    let output = std::process::Command::new("diskutil")
        .args(["list", "-plist"])
        .output();

    let Ok(out) = output else {
        return Vec::new();
    };
    if !out.status.success() {
        return Vec::new();
    }

    // Use simple text parsing of the plist XML to avoid a plist dependency.
    let text = String::from_utf8_lossy(&out.stdout);

    // Parse the WholeDisks array — macOS pre-filters this to whole-disk identifiers
    // (e.g. "disk0", "disk1"), excluding partitions like "disk0s1".
    let mut disk_ids: Vec<String> = Vec::new();
    let mut in_whole_disks = false;
    for line in text.lines() {
        let trimmed = line.trim();
        if trimmed == "<key>WholeDisks</key>" {
            in_whole_disks = true;
            continue;
        }
        if in_whole_disks {
            if trimmed == "</array>" {
                break;
            }
            if let Some(inner) = trimmed
                .strip_prefix("<string>")
                .and_then(|s| s.strip_suffix("</string>"))
            {
                disk_ids.push(inner.to_string());
            }
        }
    }

    let mut disks = Vec::new();
    for id in disk_ids {
        if let Some(entry) = diskutil_info(&id) {
            disks.push(entry);
        }
    }
    disks
}

#[cfg(target_os = "macos")]
fn diskutil_info(disk_id: &str) -> Option<String> {
    let output = std::process::Command::new("diskutil")
        .args(["info", "-plist", disk_id])
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let text = String::from_utf8_lossy(&output.stdout);
    parse_diskutil_info_plist(&text)
}

/// Parses a `diskutil info -plist` XML text into a formatted disk label string.
/// Returns `None` for virtual disks or unparseable output.
#[cfg(target_os = "macos")]
pub fn parse_diskutil_info_plist(text: &str) -> Option<String> {
    let mut model = String::new();
    let mut size_bytes: Option<u64> = None;
    let mut is_ssd = false;
    let mut protocol = String::new();
    let mut virtual_or_physical = String::new();

    let mut last_key = String::new();
    for line in text.lines() {
        let trimmed = line.trim();
        if let Some(key) = trimmed
            .strip_prefix("<key>")
            .and_then(|s| s.strip_suffix("</key>"))
        {
            last_key = key.to_string();
            continue;
        }
        if let Some(val) = trimmed
            .strip_prefix("<string>")
            .and_then(|s| s.strip_suffix("</string>"))
        {
            match last_key.as_str() {
                // MediaName gives the clean model string (e.g. "APPLE SSD AP1024Z");
                // IORegistryEntryName appends " Media" and is used only as a fallback.
                "MediaName" => {
                    if !val.is_empty() {
                        model = val.to_string();
                    }
                }
                "IORegistryEntryName" => {
                    if model.is_empty() && !val.is_empty() {
                        model = val.to_string();
                    }
                }
                "BusProtocol" => protocol = val.to_string(),
                "VirtualOrPhysical" => virtual_or_physical = val.to_string(),
                _ => {}
            }
        }
        if let Some(val) = trimmed
            .strip_prefix("<integer>")
            .and_then(|s| s.strip_suffix("</integer>"))
        {
            if last_key == "TotalSize" {
                size_bytes = val.parse().ok();
            }
        }
        if trimmed == "<true/>" && last_key == "SolidState" {
            is_ssd = true;
        }
    }

    // Skip APFS synthesized and other virtual disk objects
    if virtual_or_physical == "Virtual" {
        return None;
    }

    let kind =
        if protocol.to_lowercase().contains("pcie") || protocol.to_lowercase().contains("nvme") {
            "NVMe SSD"
        } else if is_ssd {
            "SSD"
        } else {
            "HDD"
        };

    let size_str = size_bytes.map(format_size).unwrap_or_default();

    let label = if model.is_empty() {
        format!("{} [{}]", size_str, kind)
    } else {
        format!("{} {} [{}]", model.trim(), size_str, kind)
    };

    Some(label.trim().to_string())
}

/// Strips a trailing size token (e.g. "1024GB", "512GB", "2TB") from a model string.
/// Many NVMe vendors embed the capacity in the model name; we compute it separately.
#[cfg(target_os = "linux")]
fn strip_embedded_size(model: &str) -> &str {
    let bytes = model.as_bytes();
    // Walk backwards over digits, then a unit suffix (GB/TB/MB), then optional space
    let mut i = bytes.len();
    // Strip trailing whitespace
    while i > 0 && bytes[i - 1] == b' ' {
        i -= 1;
    }
    // Must end with "GB" or "TB" or "MB"
    if i >= 2 {
        let suffix = &bytes[i - 2..i];
        if matches!(suffix, b"GB" | b"TB" | b"MB") {
            i -= 2;
            // Strip the digits before the unit
            let digits_end = i;
            while i > 0 && bytes[i - 1].is_ascii_digit() {
                i -= 1;
            }
            if i < digits_end {
                // Strip one optional space between model name and size token
                if i > 0 && bytes[i - 1] == b' ' {
                    i -= 1;
                }
                return model[..i].trim_end();
            }
        }
    }
    model
}

#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
fn format_size(bytes: u64) -> String {
    const TB: u64 = 1_000_000_000_000;
    const GB: u64 = 1_000_000_000;
    if bytes >= TB {
        format!("{:.1} TB", bytes as f64 / TB as f64)
    } else {
        format!("{:.0} GB", bytes as f64 / GB as f64)
    }
}

/// Enumerates physical disks via native Win32 storage IOCTLs.
///
/// Replaces the previous `Get-PhysicalDisk` PowerShell spawn (~1.7 s of interpreter
/// startup) with direct `DeviceIoControl` queries against `\\.\PhysicalDriveN`. Each
/// drive is opened with **no** access rights (`dwDesiredAccess = 0`) and only
/// `FILE_ANY_ACCESS` query IOCTLs are used, so no elevation is required.
#[cfg(target_os = "windows")]
fn detect_windows() -> Vec<String> {
    // Physical drive numbers are contiguous from 0 in the common case, but a removed
    // disk can leave a gap; scan a fixed range and skip any drive that won't open.
    // A failed CreateFileW on a nonexistent device returns immediately, so this is
    // still orders of magnitude cheaper than spawning PowerShell.
    const MAX_DRIVES: u32 = 32;
    (0..MAX_DRIVES)
        .filter_map(win_ffi::query_physical_drive)
        .collect()
}

/// Classifies and formats a single physical disk into its display label, mirroring
/// the columns the old `Get-PhysicalDisk` parser used (model, size, media type, bus).
///
/// `bus_type` is a `STORAGE_BUS_TYPE` value; `incurs_seek_penalty` is `None` when the
/// seek-penalty IOCTL was unavailable (treated as SSD, matching the old "Unspecified"
/// fallback).
#[cfg(target_os = "windows")]
fn format_disk_label(
    model: &str,
    size_bytes: Option<u64>,
    bus_type: u32,
    incurs_seek_penalty: Option<bool>,
) -> String {
    let kind = if bus_type == win_ffi::BUS_TYPE_NVME {
        "NVMe SSD"
    } else {
        match incurs_seek_penalty {
            Some(true) => "HDD",
            // Non-rotational, or unknown (no NVMe bus, no seek-penalty info): treat as
            // SSD — matches the prior "MediaType Unspecified → SSD" behavior.
            Some(false) | None => "SSD",
        }
    };

    let name = model.trim();
    let size_str = size_bytes.map(format_size).unwrap_or_default();
    let label = if name.is_empty() {
        format!("{} [{}]", size_str, kind)
    } else {
        format!("{} {} [{}]", name, size_str, kind)
    };
    label.trim().to_string()
}

/// Builds the model/friendly-name string from a storage descriptor's vendor and
/// product id fields.
///
/// The product id is the model string Windows surfaces as `Get-PhysicalDisk`'s
/// `FriendlyName` (e.g. "Samsung SSD 980 Pro"). The vendor id is only prepended when
/// it adds information — SATA drives report a generic "ATA" vendor that the friendly
/// name never includes, and USB/NVMe often duplicate the vendor inside the product id.
#[cfg(target_os = "windows")]
fn combine_model(vendor: &str, product: &str) -> String {
    let v = vendor.trim();
    let p = product.trim();
    if p.is_empty() {
        return v.to_string();
    }
    if v.is_empty()
        || v.eq_ignore_ascii_case("ATA")
        || p.to_ascii_lowercase().contains(&v.to_ascii_lowercase())
    {
        p.to_string()
    } else {
        format!("{} {}", v, p)
    }
}

/// Native Win32 storage IOCTL bindings and per-drive query helpers.
///
/// Uses hand-written `extern "system"` declarations to match the crate's existing
/// Windows FFI style (see `win_reg.rs`) rather than pulling in a Win32 binding crate.
#[cfg(target_os = "windows")]
mod win_ffi {
    use super::{combine_model, format_disk_label};
    use std::ffi::{c_void, OsStr};
    use std::mem::size_of;
    use std::os::windows::ffi::OsStrExt;
    use std::ptr;

    #[allow(clippy::upper_case_acronyms)]
    type HANDLE = *mut c_void;
    const INVALID_HANDLE_VALUE: HANDLE = -1isize as HANDLE;
    const FILE_SHARE_READ: u32 = 0x0000_0001;
    const FILE_SHARE_WRITE: u32 = 0x0000_0002;
    const OPEN_EXISTING: u32 = 3;

    // Both IOCTLs below are FILE_ANY_ACCESS, so a handle opened with zero desired
    // access can issue them without administrator rights.
    const IOCTL_STORAGE_QUERY_PROPERTY: u32 = 0x002D_1400;
    const IOCTL_DISK_GET_DRIVE_GEOMETRY_EX: u32 = 0x0007_00A0;

    // STORAGE_PROPERTY_ID values.
    const STORAGE_DEVICE_PROPERTY: u32 = 0;
    const STORAGE_DEVICE_SEEK_PENALTY_PROPERTY: u32 = 7;
    // STORAGE_QUERY_TYPE value.
    const PROPERTY_STANDARD_QUERY: u32 = 0;

    /// `STORAGE_BUS_TYPE::BusTypeNvme`.
    pub const BUS_TYPE_NVME: u32 = 17;

    #[repr(C)]
    struct StoragePropertyQuery {
        property_id: u32,
        query_type: u32,
        additional_parameters: [u8; 1],
    }

    #[repr(C)]
    struct StorageDeviceDescriptor {
        version: u32,
        size: u32,
        device_type: u8,
        device_type_modifier: u8,
        removable_media: u8,
        command_queueing: u8,
        vendor_id_offset: u32,
        product_id_offset: u32,
        product_revision_offset: u32,
        serial_number_offset: u32,
        bus_type: u32,
        raw_properties_length: u32,
        raw_device_properties: [u8; 1],
    }

    #[repr(C)]
    struct DeviceSeekPenaltyDescriptor {
        version: u32,
        size: u32,
        incurs_seek_penalty: u8,
    }

    #[repr(C)]
    struct DiskGeometry {
        cylinders: i64,
        media_type: u32,
        tracks_per_cylinder: u32,
        sectors_per_track: u32,
        bytes_per_sector: u32,
    }

    #[repr(C)]
    struct DiskGeometryEx {
        geometry: DiskGeometry,
        disk_size: i64,
        data: [u8; 1],
    }

    extern "system" {
        fn CreateFileW(
            lp_file_name: *const u16,
            dw_desired_access: u32,
            dw_share_mode: u32,
            lp_security_attributes: *mut c_void,
            dw_creation_disposition: u32,
            dw_flags_and_attributes: u32,
            h_template_file: HANDLE,
        ) -> HANDLE;

        fn DeviceIoControl(
            h_device: HANDLE,
            dw_io_control_code: u32,
            lp_in_buffer: *const c_void,
            n_in_buffer_size: u32,
            lp_out_buffer: *mut c_void,
            n_out_buffer_size: u32,
            lp_bytes_returned: *mut u32,
            lp_overlapped: *mut c_void,
        ) -> i32;

        fn CloseHandle(h_object: HANDLE) -> i32;
    }

    /// Opens `\\.\PhysicalDrive{index}` and returns its formatted label, or `None` if
    /// the drive does not exist or its device descriptor cannot be read.
    pub fn query_physical_drive(index: u32) -> Option<String> {
        let path = format!(r"\\.\PhysicalDrive{index}");
        let path_w: Vec<u16> = OsStr::new(&path).encode_wide().chain(Some(0)).collect();

        // SAFETY: path_w is a valid null-terminated wide string; zero desired access is
        // sufficient for the FILE_ANY_ACCESS query IOCTLs used below.
        let handle = unsafe {
            CreateFileW(
                path_w.as_ptr(),
                0,
                FILE_SHARE_READ | FILE_SHARE_WRITE,
                ptr::null_mut(),
                OPEN_EXISTING,
                0,
                ptr::null_mut(),
            )
        };
        if handle == INVALID_HANDLE_VALUE || handle.is_null() {
            return None;
        }

        let descriptor = query_device_descriptor(handle);
        let result = descriptor.map(|(bus_type, model)| {
            let size = query_disk_size(handle);
            let seek = query_seek_penalty(handle);
            format_disk_label(&model, size, bus_type, seek)
        });

        // SAFETY: handle came from a successful CreateFileW and is closed exactly once.
        unsafe {
            CloseHandle(handle);
        }
        result
    }

    /// Reads a null-terminated ANSI string embedded in `buf` at `offset` bytes from the
    /// start. An offset of 0 means the field is absent.
    fn read_ansi_at(buf: &[u8], offset: usize) -> String {
        if offset == 0 || offset >= buf.len() {
            return String::new();
        }
        let bytes = &buf[offset..];
        let end = bytes.iter().position(|&b| b == 0).unwrap_or(bytes.len());
        String::from_utf8_lossy(&bytes[..end]).trim().to_string()
    }

    /// Queries `IOCTL_STORAGE_QUERY_PROPERTY` for the device descriptor, returning the
    /// bus type and combined model string.
    fn query_device_descriptor(handle: HANDLE) -> Option<(u32, String)> {
        let query = StoragePropertyQuery {
            property_id: STORAGE_DEVICE_PROPERTY,
            query_type: PROPERTY_STANDARD_QUERY,
            additional_parameters: [0; 1],
        };
        // The descriptor is followed inline by its vendor/product/serial strings; a
        // fixed 1 KiB buffer comfortably holds the header plus those fields.
        let mut buf = [0u8; 1024];
        let mut returned: u32 = 0;
        // SAFETY: query is a valid input buffer of the declared size; buf is writable
        // and its length is passed as the output size.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_STORAGE_QUERY_PROPERTY,
                &query as *const _ as *const c_void,
                size_of::<StoragePropertyQuery>() as u32,
                buf.as_mut_ptr() as *mut c_void,
                buf.len() as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        if ok == 0 || (returned as usize) < size_of::<StorageDeviceDescriptor>() {
            return None;
        }
        // SAFETY: the IOCTL wrote at least a full StorageDeviceDescriptor into buf,
        // which is correctly aligned (a [u8; 1024] array plus the descriptor's u32
        // alignment is satisfied at offset 0).
        let desc = unsafe { &*(buf.as_ptr() as *const StorageDeviceDescriptor) };
        let bus_type = desc.bus_type;
        let vendor = read_ansi_at(&buf, desc.vendor_id_offset as usize);
        let product = read_ansi_at(&buf, desc.product_id_offset as usize);
        Some((bus_type, combine_model(&vendor, &product)))
    }

    /// Queries `IOCTL_DISK_GET_DRIVE_GEOMETRY_EX` for the total disk size in bytes.
    fn query_disk_size(handle: HANDLE) -> Option<u64> {
        let mut geo = DiskGeometryEx {
            geometry: DiskGeometry {
                cylinders: 0,
                media_type: 0,
                tracks_per_cylinder: 0,
                sectors_per_track: 0,
                bytes_per_sector: 0,
            },
            disk_size: 0,
            data: [0; 1],
        };
        let mut returned: u32 = 0;
        // SAFETY: geo is a writable DiskGeometryEx passed with its own size.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_DISK_GET_DRIVE_GEOMETRY_EX,
                ptr::null(),
                0,
                &mut geo as *mut _ as *mut c_void,
                size_of::<DiskGeometryEx>() as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        if ok == 0 || geo.disk_size <= 0 {
            None
        } else {
            Some(geo.disk_size as u64)
        }
    }

    /// Queries `IOCTL_STORAGE_QUERY_PROPERTY` seek-penalty info. `Some(true)` indicates
    /// a rotational (HDD) device, `Some(false)` a solid-state device, `None` if the
    /// property is unavailable.
    fn query_seek_penalty(handle: HANDLE) -> Option<bool> {
        let query = StoragePropertyQuery {
            property_id: STORAGE_DEVICE_SEEK_PENALTY_PROPERTY,
            query_type: PROPERTY_STANDARD_QUERY,
            additional_parameters: [0; 1],
        };
        let mut desc = DeviceSeekPenaltyDescriptor {
            version: 0,
            size: 0,
            incurs_seek_penalty: 0,
        };
        let mut returned: u32 = 0;
        // SAFETY: query is a valid input buffer; desc is a writable output buffer.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_STORAGE_QUERY_PROPERTY,
                &query as *const _ as *const c_void,
                size_of::<StoragePropertyQuery>() as u32,
                &mut desc as *mut _ as *mut c_void,
                size_of::<DeviceSeekPenaltyDescriptor>() as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        if ok == 0 || (returned as usize) < size_of::<DeviceSeekPenaltyDescriptor>() {
            None
        } else {
            Some(desc.incurs_seek_penalty != 0)
        }
    }
}

#[cfg(test)]
mod tests {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    use super::format_size;
    #[cfg(target_os = "linux")]
    use super::{is_skip_fs, strip_embedded_size};

    #[cfg(target_os = "linux")]
    #[test]
    fn test_is_skip_fs_pseudo() {
        assert!(is_skip_fs("sysfs", false));
        assert!(is_skip_fs("proc", false));
        assert!(is_skip_fs("tmpfs", false));
        assert!(is_skip_fs("fusectl", false)); // fusectl is always skipped
        assert!(is_skip_fs("fusectl", true)); // even with include_fuse
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_is_skip_fs_fuse_excluded_by_default() {
        assert!(is_skip_fs("fuse.gvfsd-fuse", false));
        assert!(is_skip_fs("fuse.sshfs", false));
        assert!(is_skip_fs("fuse.cryfs", false));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_is_skip_fs_fuse_included_in_full() {
        assert!(!is_skip_fs("fuse.gvfsd-fuse", true));
        assert!(!is_skip_fs("fuse.sshfs", true));
        assert!(!is_skip_fs("fuse.cryfs", true));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_is_skip_fs_real_fs() {
        assert!(!is_skip_fs("ext4", false));
        assert!(!is_skip_fs("btrfs", false));
        assert!(!is_skip_fs("vfat", false));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_strip_embedded_size() {
        assert_eq!(
            strip_embedded_size("BC901 NVMe SK hynix 1024GB"),
            "BC901 NVMe SK hynix"
        );
        assert_eq!(
            strip_embedded_size("Samsung SSD 970 EVO 500GB"),
            "Samsung SSD 970 EVO"
        );
        assert_eq!(strip_embedded_size("WD Blue 2TB"), "WD Blue");
        assert_eq!(strip_embedded_size("CT500MX500SSD1"), "CT500MX500SSD1"); // Crucial model — no unit suffix
        assert_eq!(
            strip_embedded_size("SAMSUNG MZQL23T8HCLS"),
            "SAMSUNG MZQL23T8HCLS"
        ); // no unit
        assert_eq!(strip_embedded_size("Some Drive 256GB"), "Some Drive");
    }

    #[cfg(any(target_os = "linux", target_os = "macos"))]
    #[test]
    fn test_format_size_gb() {
        assert_eq!(format_size(512_110_190_592), "512 GB");
    }

    #[cfg(any(target_os = "linux", target_os = "macos"))]
    #[test]
    fn test_format_size_tb() {
        assert_eq!(format_size(1_000_204_886_016), "1.0 TB");
    }

    #[cfg(any(target_os = "linux", target_os = "macos"))]
    #[test]
    fn test_format_size_2tb() {
        assert_eq!(format_size(2_000_398_934_016), "2.0 TB");
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_diskutil_info_plist_apple_silicon() {
        // Matches real output from an Apple M-series Mac (disk0).
        // IORegistryEntryName comes before MediaName in the plist; MediaName must win.
        let plist = r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>BusProtocol</key>
	<string>Apple Fabric</string>
	<key>IORegistryEntryName</key>
	<string>APPLE SSD AP1024Z Media</string>
	<key>MediaName</key>
	<string>APPLE SSD AP1024Z</string>
	<key>SolidState</key>
	<true/>
	<key>TotalSize</key>
	<integer>1000555581440</integer>
	<key>VirtualOrPhysical</key>
	<string>Unknown</string>
</dict>
</plist>"#;
        let result = super::parse_diskutil_info_plist(plist);
        assert_eq!(result, Some("APPLE SSD AP1024Z 1.0 TB [SSD]".to_string()));
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_diskutil_info_plist_nvme() {
        let plist = r#"<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
	<key>BusProtocol</key>
	<string>PCIe</string>
	<key>MediaName</key>
	<string>Samsung SSD 990 Pro</string>
	<key>SolidState</key>
	<true/>
	<key>TotalSize</key>
	<integer>2000398934016</integer>
	<key>VirtualOrPhysical</key>
	<string>Physical</string>
</dict>
</plist>"#;
        let result = super::parse_diskutil_info_plist(plist);
        assert_eq!(
            result,
            Some("Samsung SSD 990 Pro 2.0 TB [NVMe SSD]".to_string())
        );
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_diskutil_info_plist_virtual_skipped() {
        let plist = r#"<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
	<key>MediaName</key>
	<string>APFS Container Disk</string>
	<key>TotalSize</key>
	<integer>500000000000</integer>
	<key>VirtualOrPhysical</key>
	<string>Virtual</string>
</dict>
</plist>"#;
        let result = super::parse_diskutil_info_plist(plist);
        assert_eq!(result, None);
    }

    #[cfg(target_os = "windows")]
    use super::win_ffi::BUS_TYPE_NVME;
    #[cfg(target_os = "windows")]
    use super::{combine_model, format_disk_label};

    #[cfg(target_os = "windows")]
    #[test]
    fn test_format_disk_label_nvme() {
        // NVMe bus type wins regardless of seek-penalty info.
        let label = format_disk_label(
            "Samsung SSD 980 Pro",
            Some(1_000_204_886_016),
            BUS_TYPE_NVME,
            Some(false),
        );
        assert_eq!(label, "Samsung SSD 980 Pro 1.0 TB [NVMe SSD]");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_format_disk_label_hdd() {
        // Non-NVMe bus (SATA = 11) with a seek penalty is an HDD.
        let label = format_disk_label("WD Blue", Some(2_000_398_934_016), 11, Some(true));
        assert_eq!(label, "WD Blue 2.0 TB [HDD]");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_format_disk_label_sata_ssd() {
        // SATA SSD: no seek penalty.
        let label = format_disk_label(
            "Crucial CT500MX500SSD1",
            Some(500_107_862_016),
            11,
            Some(false),
        );
        assert_eq!(label, "Crucial CT500MX500SSD1 500 GB [SSD]");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_format_disk_label_unknown_seek_penalty_defaults_to_ssd() {
        // No NVMe bus and no seek-penalty info (e.g. eMMC/SD) → SSD fallback.
        let label = format_disk_label("Some eMMC", Some(64_000_000_000), 13, None);
        assert_eq!(label, "Some eMMC 64 GB [SSD]");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_format_disk_label_empty_model() {
        let label = format_disk_label("", Some(500_107_862_016), 11, Some(false));
        assert_eq!(label, "500 GB [SSD]");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_combine_model_generic_ata_vendor_suppressed() {
        // SATA drives report a generic "ATA" vendor id that FriendlyName omits.
        assert_eq!(
            combine_model("ATA", "Samsung SSD 860 EVO"),
            "Samsung SSD 860 EVO"
        );
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_combine_model_empty_vendor() {
        assert_eq!(
            combine_model("", "Samsung SSD 980 Pro"),
            "Samsung SSD 980 Pro"
        );
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_combine_model_vendor_already_in_product() {
        // Avoid "Samsung Samsung SSD 980 Pro".
        assert_eq!(
            combine_model("Samsung", "Samsung SSD 980 Pro"),
            "Samsung SSD 980 Pro"
        );
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_combine_model_distinct_vendor_prepended() {
        assert_eq!(combine_model("Kingston", "A400 SSD"), "Kingston A400 SSD");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_combine_model_empty_product_falls_back_to_vendor() {
        assert_eq!(combine_model("SomeVendor", ""), "SomeVendor");
    }
}
