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
    return detect_logical_linux(include_fuse);

    #[cfg(not(target_os = "linux"))]
    {
        let _ = include_fuse;
        return detect_logical_sysinfo();
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

#[cfg(target_os = "windows")]
fn detect_windows() -> Vec<String> {
    let cmd = "Get-PhysicalDisk | \
               Select-Object FriendlyName,Size,MediaType,BusType | \
               ConvertTo-Csv -NoTypeInformation";
    let Ok(output) = std::process::Command::new("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", cmd])
        .output()
    else {
        return Vec::new();
    };
    if !output.status.success() {
        return Vec::new();
    }
    let text = String::from_utf8_lossy(&output.stdout);
    parse_get_physical_disk(&text)
}

/// Parses `Get-PhysicalDisk | ConvertTo-Csv` output into formatted disk labels.
///
/// Expected CSV header: `"FriendlyName","Size","MediaType","BusType"`
#[cfg(target_os = "windows")]
pub fn parse_get_physical_disk(csv: &str) -> Vec<String> {
    let mut lines = csv.lines();
    lines.next(); // skip header
    let mut disks = Vec::new();
    for line in lines {
        let fields = unquoted_csv_fields(line);
        if fields.len() < 4 {
            continue;
        }
        let name = fields[0].trim();
        let size_bytes: Option<u64> = fields[1].trim().parse().ok();
        let media_type = fields[2].trim();
        let bus_type = fields[3].trim();

        let kind = if bus_type.eq_ignore_ascii_case("NVMe") {
            "NVMe SSD"
        } else if media_type.eq_ignore_ascii_case("SSD") {
            "SSD"
        } else if media_type.eq_ignore_ascii_case("HDD") {
            "HDD"
        } else {
            // "Unspecified" with no NVMe bus — treat as SSD (e.g. eMMC, SD)
            "SSD"
        };

        let size_str = size_bytes.map(format_size).unwrap_or_default();
        let label = if name.is_empty() {
            format!("{} [{}]", size_str, kind)
        } else {
            format!("{} {} [{}]", name, size_str, kind)
        };
        disks.push(label.trim().to_string());
    }
    disks
}

/// Splits one PowerShell `ConvertTo-Csv` line into unquoted fields.
///
/// `ConvertTo-Csv` wraps every value in double quotes: `"val1","val2",...`
#[cfg(target_os = "windows")]
fn unquoted_csv_fields(line: &str) -> Vec<String> {
    let line = line.trim().trim_matches('"');
    line.split("\",\"").map(|s| s.to_string()).collect()
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
    #[test]
    fn test_parse_get_physical_disk_nvme() {
        let csv = r#""FriendlyName","Size","MediaType","BusType"
"Samsung SSD 980 Pro 1TB","1000204886016","SSD","NVMe"
"#;
        let disks = super::parse_get_physical_disk(csv);
        assert_eq!(disks, vec!["Samsung SSD 980 Pro 1TB 1.0 TB [NVMe SSD]"]);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_get_physical_disk_hdd() {
        let csv = r#""FriendlyName","Size","MediaType","BusType"
"WD Blue 2TB","2000398934016","HDD","SATA"
"#;
        let disks = super::parse_get_physical_disk(csv);
        assert_eq!(disks, vec!["WD Blue 2TB 2.0 TB [HDD]"]);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_get_physical_disk_unspecified_sata_ssd() {
        // Some SATA SSDs report MediaType as "Unspecified" but BusType as "SATA"
        let csv = r#""FriendlyName","Size","MediaType","BusType"
"Crucial CT500MX500SSD1","500107862016","Unspecified","SATA"
"#;
        let disks = super::parse_get_physical_disk(csv);
        assert_eq!(disks, vec!["Crucial CT500MX500SSD1 500 GB [SSD]"]);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_get_physical_disk_multi() {
        let csv = r#""FriendlyName","Size","MediaType","BusType"
"Samsung SSD 980 Pro","1000204886016","SSD","NVMe"
"WD Blue","2000398934016","HDD","SATA"
"#;
        let disks = super::parse_get_physical_disk(csv);
        assert_eq!(disks.len(), 2);
        assert_eq!(disks[0], "Samsung SSD 980 Pro 1.0 TB [NVMe SSD]");
        assert_eq!(disks[1], "WD Blue 2.0 TB [HDD]");
    }
}
