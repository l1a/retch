// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Disk and network I/O throughput sampling.
//!
//! Both fields report a **rate**, which a one-shot process cannot read directly: the
//! kernel exposes cumulative counters, so a rate needs two samples and a known interval.
//! fastfetch solves this with a dedicated ~1 s sleep (measured: `fastfetch -s NetIO`
//! takes 1.00 s against 0.00 s for a counter-only module). retch cannot afford that —
//! `--long` targets ~500 ms end to end, and being slower than fastfetch is treated as a
//! blocking regression (NOTES.md §3, "Performance Regression Vigilance").
//!
//! So this module follows the v0.3.49 `cpu-usage` pattern instead: [`fetch`] samples the
//! counters *before* the concurrent probe scope and diffs them *after*, making the
//! existing collection window the sampling interval. A floor is applied only when the
//! window came out too short to measure anything (an isolated `--fields disk-io`), which
//! is the sole case where these fields add any wall-clock at all.
//!
//! The consequence, stated plainly because it is the honest reading of the number: the
//! window varies by mode — roughly 0.4 s in `--long`, seconds in `--full` — so the value
//! is the *average* rate over the run, not an instantaneous one. That is the right
//! trade for a fetcher; a stable window would cost a sleep on every invocation.
//!
//! [`fetch`]: crate::fetch

/// Cumulative byte counters for one device at a point in time.
///
/// `read`/`write` are disk semantics; for network interfaces they carry RX/TX
/// respectively, since the rate arithmetic is identical and only the labels differ.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct IoCounters {
    /// Kernel device name (`nvme0n1`, `wlp0s20f3`).
    pub device: String,
    /// Bytes read (disk) or received (network) since boot.
    pub read: u64,
    /// Bytes written (disk) or transmitted (network) since boot.
    pub write: u64,
}

/// A device's throughput over the sampling window, in bytes per second.
#[derive(Debug, Clone, PartialEq)]
pub struct IoRate {
    /// Kernel device name.
    pub device: String,
    /// Read/RX rate in bytes per second.
    pub read: f64,
    /// Write/TX rate in bytes per second.
    pub write: f64,
}

/// Bytes per sector in `/proc/diskstats`.
///
/// **This is a fixed kernel convention, not the device's sector size.** diskstats reports
/// in 512-byte bio sectors regardless of what `/sys/block/<dev>/queue/hw_sector_size`
/// says, so keying this off the hardware value inflates every figure 8× on a 4 KiB-sector
/// drive. `disk.rs` already relies on the same convention for `/sys/block/<dev>/size`.
///
/// Confirmed here by writing a known 64 MiB of incompressible data and reading the delta:
/// 146808 sectors, i.e. 71 MiB at 512 B/sector (the excess is btrfs metadata and CoW)
/// against an impossible 573 MiB at 4096. **Verification limit, recorded rather than
/// papered over:** the host used for that check has `hw_sector_size` 512 itself, so the
/// result confirms the value without discriminating the two rules. A device with a 4 KiB
/// logical sector would separate them.
const DISKSTATS_SECTOR_BYTES: u64 = 512;

/// Field index of "sectors read" in a `/proc/diskstats` line (0-based, after splitting on
/// whitespace): major, minor, name, reads completed, reads merged, **sectors read**.
const DISKSTATS_SECTORS_READ: usize = 5;

/// Field index of "sectors written": … ms reading, writes completed, writes merged,
/// **sectors written**.
const DISKSTATS_SECTORS_WRITTEN: usize = 9;

/// Parses `/proc/diskstats` into per-device byte counters.
///
/// `keep` decides which device names survive; it is injected rather than hardcoded so the
/// tests can assert against a verbatim fixture without depending on the block devices of
/// whatever machine runs them — the #155/v0.6.2 lesson, where a "parse this fixture" test
/// silently consulted live hardware and failed on one developer's box.
///
/// Lines with too few fields or unparsable counters are skipped rather than defaulted to
/// zero: a zero would render as a confident `0 B/s` for a device that was never read.
pub fn parse_diskstats<F>(content: &str, keep: F) -> Vec<IoCounters>
where
    F: Fn(&str) -> bool,
{
    let mut out = Vec::new();
    for line in content.lines() {
        let fields: Vec<&str> = line.split_whitespace().collect();
        if fields.len() <= DISKSTATS_SECTORS_WRITTEN {
            continue;
        }
        let name = fields[2];
        if !keep(name) {
            continue;
        }
        let (Ok(read_sectors), Ok(written_sectors)) = (
            fields[DISKSTATS_SECTORS_READ].parse::<u64>(),
            fields[DISKSTATS_SECTORS_WRITTEN].parse::<u64>(),
        ) else {
            continue;
        };
        out.push(IoCounters {
            device: name.to_string(),
            read: read_sectors.saturating_mul(DISKSTATS_SECTOR_BYTES),
            write: written_sectors.saturating_mul(DISKSTATS_SECTOR_BYTES),
        });
    }
    out
}

/// Computes per-device rates between two samples taken `elapsed_secs` apart.
///
/// A device present in only one sample is **dropped**, not reported: an interface that
/// appeared mid-run (a VPN link coming up) has no baseline, and treating its lifetime
/// counter as a delta would render a spectacular fictional rate.
///
/// Counter decreases are clamped to zero via `saturating_sub`. Counters do reset in
/// practice — an interface going down and up, a module reload — and a wrapped subtraction
/// would produce an exabyte-scale rate from a perfectly ordinary event.
pub fn compute_rates(
    before: &[IoCounters],
    after: &[IoCounters],
    elapsed_secs: f64,
) -> Vec<IoRate> {
    // Written as an explicit finite check rather than `<= 0.0` because a NaN window must
    // also yield nothing: `NaN <= 0.0` is false, so the terse form would divide by it.
    if !elapsed_secs.is_finite() || elapsed_secs <= 0.0 {
        return Vec::new();
    }
    after
        .iter()
        .filter_map(|now| {
            let prev = before.iter().find(|p| p.device == now.device)?;
            Some(IoRate {
                device: now.device.clone(),
                read: now.read.saturating_sub(prev.read) as f64 / elapsed_secs,
                write: now.write.saturating_sub(prev.write) as f64 / elapsed_secs,
            })
        })
        .collect()
}

/// Formats a byte-per-second rate for display (`"1.2 MB/s"`).
///
/// Delegates to [`crate::network::format_bytes`] so the unit vocabulary matches the `Net`
/// field's existing `RX:`/`TX:` totals rather than introducing a second scheme alongside
/// it. Non-finite and negative inputs render as `0 B/s`; they cannot arise from
/// [`compute_rates`], but the formatter is public and should not print `NaN B/s`.
pub fn format_rate(bytes_per_sec: f64) -> String {
    let clamped = if bytes_per_sec.is_finite() && bytes_per_sec > 0.0 {
        bytes_per_sec.round() as u64
    } else {
        0
    };
    format!("{}/s", crate::network::format_bytes(clamped))
}

/// Renders one device's rates as a display line, e.g.
/// `"nvme0n1 R: 1.2 MB/s W: 0 B/s"`.
pub fn format_io_line(rate: &IoRate, read_label: &str, write_label: &str) -> String {
    format!(
        "{} {}: {} {}: {}",
        rate.device,
        read_label,
        format_rate(rate.read),
        write_label,
        format_rate(rate.write)
    )
}

/// Chooses which interfaces the `net-io` field reports.
///
/// The default-route interface when it is known — matching both fastfetch and the way the
/// `Net` field already singles that interface out. Otherwise (offline, or the active
/// interface could not be resolved) every interface that actually moved bytes during the
/// window, so an unusual routing setup still reports something rather than nothing.
///
/// Returning an empty list when the active interface is known but idle is deliberate: a
/// `0 B/s` line for the interface you are using is a real, informative reading.
pub fn select_net_rates(rates: Vec<IoRate>, active: Option<&str>) -> Vec<IoRate> {
    if let Some(active) = active {
        let selected: Vec<IoRate> = rates
            .iter()
            .filter(|r| r.device == active)
            .cloned()
            .collect();
        if !selected.is_empty() {
            return selected;
        }
    }
    rates
        .into_iter()
        .filter(|r| r.read > 0.0 || r.write > 0.0)
        .collect()
}

/// Samples cumulative disk byte counters for physical whole disks.
///
/// Linux reads `/proc/diskstats`; Windows queries `IOCTL_DISK_PERFORMANCE` per
/// `\\.\PhysicalDriveN`. Elsewhere this returns an empty vector, so the field is simply
/// absent rather than wrong (same shape as `brightness`, `keyboard`, `tpm`).
///
/// Partitions are excluded on both platforms because their traffic is already counted
/// against the parent device — reporting both would double every disk's apparent
/// throughput. On Windows that falls out of addressing whole drives directly; on Linux it
/// takes an explicit filter.
pub fn sample_disk_io() -> Vec<IoCounters> {
    #[cfg(target_os = "linux")]
    {
        let Ok(content) = std::fs::read_to_string("/proc/diskstats") else {
            return Vec::new();
        };
        parse_diskstats(&content, is_physical_disk)
    }

    #[cfg(target_os = "windows")]
    {
        win_ffi::sample_physical_drives()
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
    {
        Vec::new()
    }
}

/// True when `name` is a physical whole disk rather than a partition or virtual device.
///
/// Shares [`crate::disk::is_virtual_block_name`] with the `phys-disk` field so the two
/// cannot drift into disagreeing about what counts as a disk, then applies the same two
/// sysfs tests `disk::detect_linux` uses: partitions carry a `partition` file, and a real
/// block device has a `queue` directory.
#[cfg(target_os = "linux")]
fn is_physical_disk(name: &str) -> bool {
    if crate::disk::is_virtual_block_name(name) {
        return false;
    }
    let dev = std::path::Path::new("/sys/class/block").join(name);
    !dev.join("partition").exists() && dev.join("queue").exists()
}

/// Samples cumulative network byte counters per interface.
///
/// Linux reads `/sys/class/net/<iface>/statistics/{rx,tx}_bytes` directly rather than
/// going through sysinfo, so the two samples are guaranteed to come from the same source
/// and the same units as each other. Windows reads `InOctets`/`OutOctets` from
/// `GetIfTable2`, which is the same source `Get-NetAdapterStatistics` reports and needs no
/// subprocess. Empty on other platforms.
///
/// Loopback is excluded on both — its traffic is the machine talking to itself and says
/// nothing about network throughput.
///
/// **The interface names must stay in the same vocabulary as `active_interface`**, or
/// [`select_net_rates`] silently stops matching and falls through to its "everything that
/// moved" branch. On Windows both are the adapter's friendly name (`Wi-Fi`): sysinfo
/// reports it, and it is `MIB_IF_ROW2.Alias`.
pub fn sample_net_io() -> Vec<IoCounters> {
    #[cfg(target_os = "linux")]
    {
        let Ok(entries) = std::fs::read_dir("/sys/class/net") else {
            return Vec::new();
        };
        let mut out = Vec::new();
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            if name == "lo" || name.starts_with("lo:") {
                continue;
            }
            let stats = entry.path().join("statistics");
            let read = read_counter(&stats.join("rx_bytes"));
            let write = read_counter(&stats.join("tx_bytes"));
            if let (Some(read), Some(write)) = (read, write) {
                out.push(IoCounters {
                    device: name,
                    read,
                    write,
                });
            }
        }
        out.sort_by(|a, b| a.device.cmp(&b.device));
        out
    }

    #[cfg(target_os = "windows")]
    {
        win_ffi::sample_interfaces()
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
    {
        Vec::new()
    }
}

/// Reads a single unsigned counter from a sysfs file.
#[cfg(target_os = "linux")]
fn read_counter(path: &std::path::Path) -> Option<u64> {
    std::fs::read_to_string(path)
        .ok()?
        .trim()
        .parse::<u64>()
        .ok()
}

/// Names a physical drive after its `\\.\PhysicalDriveN` index.
///
/// The Linux arm reports kernel device names (`nvme0n1`), so Windows reports the closest
/// equivalent rather than the model string `phys-disk` shows — the two fields answer
/// different questions, and a drive index is what identifies the device here.
#[cfg(any(target_os = "windows", test))]
fn physical_drive_name(index: u32) -> String {
    format!("PhysicalDrive{index}")
}

/// Native Win32 bindings for the two counter sources.
///
/// Hand-written `extern "system"` declarations, matching the crate's Windows FFI house
/// style (`win_reg.rs`, `disk.rs`) rather than pulling in a binding crate. The
/// `CreateFileW`/`DeviceIoControl`/`CloseHandle` declarations duplicate `disk.rs`'s: they
/// are declarations of the same OS entry points, carrying no logic that could drift, and
/// sharing them would mean passing raw `HANDLE`s across module boundaries. The scan range
/// they are used over *is* shared — see [`crate::disk::MAX_PHYSICAL_DRIVES`].
#[cfg(target_os = "windows")]
mod win_ffi {
    use super::{physical_drive_name, IoCounters};
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

    /// `IOCTL_DISK_PERFORMANCE`, `CTL_CODE(IOCTL_DISK_BASE, 0x0008, METHOD_BUFFERED,
    /// FILE_ANY_ACCESS)`.
    ///
    /// The access bits are zero, so — like the two IOCTLs `disk.rs` uses — it can be
    /// issued on a handle opened with no access rights and needs no elevation. Confirmed
    /// on Windows 11 from an unelevated shell before this code was written.
    const IOCTL_DISK_PERFORMANCE: u32 = 0x0007_0020;

    /// `DISK_PERFORMANCE`. Only the two byte counters are read; the rest of the struct is
    /// declared so the layout — and therefore those two offsets — is right.
    #[repr(C)]
    #[derive(Default)]
    struct DiskPerformance {
        bytes_read: i64,
        bytes_written: i64,
        read_time: i64,
        write_time: i64,
        idle_time: i64,
        read_count: u32,
        write_count: u32,
        queue_depth: u32,
        split_count: u32,
        query_time: i64,
        storage_device_number: u32,
        storage_manager_name: [u16; 8],
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

    /// Reads cumulative byte counters for every physical drive that answers.
    ///
    /// A drive that will not open, or whose IOCTL fails, is **skipped rather than
    /// reported as zero**: `DISK_PERFORMANCE` counters can be turned off, and a confident
    /// `0 B/s` for a disk that was never measured is worse than no line at all — the
    /// `Users: 0` call (v0.6.1).
    pub fn sample_physical_drives() -> Vec<IoCounters> {
        (0..crate::disk::MAX_PHYSICAL_DRIVES)
            .filter_map(query_drive_counters)
            .collect()
    }

    /// Opens `\\.\PhysicalDrive{index}` with no access rights and queries its counters.
    fn query_drive_counters(index: u32) -> Option<IoCounters> {
        let path = format!(r"\\.\PhysicalDrive{index}");
        let path_w: Vec<u16> = OsStr::new(&path).encode_wide().chain(Some(0)).collect();

        // SAFETY: path_w is a valid null-terminated wide string. Zero desired access is
        // sufficient for IOCTL_DISK_PERFORMANCE, which is FILE_ANY_ACCESS.
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

        let mut perf = DiskPerformance::default();
        let mut returned: u32 = 0;
        // SAFETY: perf is a writable DiskPerformance passed with its own size; the IOCTL
        // takes no input buffer.
        let ok = unsafe {
            DeviceIoControl(
                handle,
                IOCTL_DISK_PERFORMANCE,
                ptr::null(),
                0,
                &mut perf as *mut _ as *mut c_void,
                size_of::<DiskPerformance>() as u32,
                &mut returned,
                ptr::null_mut(),
            )
        };
        // SAFETY: handle came from a successful CreateFileW and is closed exactly once.
        unsafe {
            CloseHandle(handle);
        }

        if ok == 0 || (returned as usize) < size_of::<DiskPerformance>() {
            return None;
        }
        // Negative counters are not reachable from a working driver, but the field is a
        // signed LARGE_INTEGER; clamp rather than wrap into an enormous u64.
        Some(IoCounters {
            device: physical_drive_name(index),
            read: perf.bytes_read.max(0) as u64,
            write: perf.bytes_written.max(0) as u64,
        })
    }

    /// Reads cumulative per-interface byte counters via the shared `GetIfTable2`
    /// enumeration, which has already excluded NDIS filter instances and loopback.
    pub fn sample_interfaces() -> Vec<IoCounters> {
        crate::win_iftable::interfaces()
            .into_iter()
            .map(|row| IoCounters {
                device: row.name,
                read: row.in_octets,
                write: row.out_octets,
            })
            .collect()
    }

    #[cfg(test)]
    mod layout {
        use std::mem::{offset_of, size_of};

        // These structs are read by fixed offset — MIB_IF_ROW2's counters sit past 1.2 KB
        // of preceding fields, so a reorder or a padding change would silently read some
        // other field's bytes as a byte count. The expected values were confirmed against
        // live data before being pinned here: reading in/out_octets at these offsets
        // reproduced `Get-NetAdapterStatistics`' per-adapter totals.
        #[test]
        fn ffi_struct_layout() {
            assert_eq!(size_of::<super::DiskPerformance>(), 88);
            assert_eq!(offset_of!(super::DiskPerformance, bytes_read), 0);
            assert_eq!(offset_of!(super::DiskPerformance, bytes_written), 8);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Verbatim `/proc/diskstats` excerpt from a Fedora 44 host (corrino): one NVMe whole
    /// disk, three of its partitions, and a zram device.
    const DISKSTATS: &str = "\
 259       0 nvme0n1 881658 6545 23259904 398678 110634 278 3327562 320368 0 53695 721779 6070 0 2002840 1798 2314 934
 259       1 nvme0n1p1 338 1067 10262 173 2 0 2 0 0 24 173 0 0 0 0 0 0
 259       2 nvme0n1p2 289 12 7954 45 22 17 288 6 0 42 51 0 0 0 0 0 0
 259       3 nvme0n1p3 880938 5466 23238992 398446 110607 261 3327272 320361 0 65541 720606 6070 0 2002840 1798 0 0
 251       0 zram0 46534 0 381008 231 252558 0 2769832 3263 0 5270 3494 0 0 0 0 0 0
";

    #[test]
    fn test_parse_diskstats_reads_the_sector_columns() {
        let parsed = parse_diskstats(DISKSTATS, |n| n == "nvme0n1");
        assert_eq!(parsed.len(), 1);
        // Columns 6 and 10 of the line, in 512-byte sectors.
        assert_eq!(parsed[0].read, 23_259_904 * 512);
        assert_eq!(parsed[0].write, 3_327_562 * 512);
    }

    #[test]
    fn test_parse_diskstats_honors_the_injected_filter() {
        // The filter is what keeps partitions out; without it their traffic is counted a
        // second time against the same physical device.
        let all = parse_diskstats(DISKSTATS, |_| true);
        assert_eq!(all.len(), 5);
        let whole = parse_diskstats(DISKSTATS, |n| !n.starts_with("zram") && !n.contains('p'));
        assert_eq!(
            whole.iter().map(|c| c.device.as_str()).collect::<Vec<_>>(),
            vec!["nvme0n1"]
        );
    }

    #[test]
    fn test_parse_diskstats_skips_malformed_lines() {
        let content = "259 0 nvme0n1 1 2\n259 0 sda 1 2 x 4 5 6 notanumber 8 9 10\n";
        assert!(parse_diskstats(content, |_| true).is_empty());
    }

    #[test]
    fn test_compute_rates_divides_the_delta_by_the_window() {
        let before = vec![IoCounters {
            device: "nvme0n1".into(),
            read: 1_000,
            write: 2_000,
        }];
        let after = vec![IoCounters {
            device: "nvme0n1".into(),
            read: 3_000,
            write: 2_000,
        }];
        let rates = compute_rates(&before, &after, 0.5);
        assert_eq!(rates.len(), 1);
        assert_eq!(rates[0].read, 4_000.0);
        assert_eq!(rates[0].write, 0.0);
    }

    #[test]
    fn test_compute_rates_drops_devices_missing_from_either_sample() {
        let before = vec![IoCounters {
            device: "eth0".into(),
            read: 10,
            write: 10,
        }];
        let after = vec![
            IoCounters {
                device: "eth0".into(),
                read: 20,
                write: 10,
            },
            // Appeared mid-run: its lifetime counter is not a delta.
            IoCounters {
                device: "wt0".into(),
                read: 9_999_999,
                write: 9_999_999,
            },
        ];
        let rates = compute_rates(&before, &after, 1.0);
        assert_eq!(rates.len(), 1);
        assert_eq!(rates[0].device, "eth0");
    }

    #[test]
    fn test_compute_rates_clamps_a_counter_reset_to_zero() {
        // An interface going down and up resets its counters; a wrapping subtraction here
        // renders an exabyte-per-second reading from an ordinary event.
        //
        // The clamp reports 0, NOT the post-reset counter. A decrease says the baseline is
        // void, not how many bytes flowed after it — and 1024 bytes into a window is a
        // guess that is wrong whenever the decrease had some other cause. Under-reporting
        // beats asserting something false, the same call as `Users: 0` (v0.6.1) and the
        // ambiguous input devices (v0.7.0).
        let before = vec![
            IoCounters {
                device: "wlan0".into(),
                read: 5_000_000,
                write: 5_000_000,
            },
            IoCounters {
                device: "eth0".into(),
                read: 1_000,
                write: 1_000,
            },
        ];
        let after = vec![
            IoCounters {
                device: "wlan0".into(),
                read: 1_024,
                write: 0,
            },
            IoCounters {
                device: "eth0".into(),
                read: 3_000,
                write: 1_000,
            },
        ];
        let rates = compute_rates(&before, &after, 1.0);
        assert_eq!(rates[0].device, "wlan0");
        assert_eq!(rates[0].read, 0.0);
        assert_eq!(rates[0].write, 0.0);
        // The unaffected device in the same pair must still report, so this test cannot
        // pass by every rate happening to be zero.
        assert_eq!(rates[1].device, "eth0");
        assert_eq!(rates[1].read, 2_000.0);
    }

    #[test]
    fn test_compute_rates_refuses_a_zero_or_negative_window() {
        let sample = vec![IoCounters {
            device: "nvme0n1".into(),
            read: 1,
            write: 1,
        }];
        assert!(compute_rates(&sample, &sample, 0.0).is_empty());
        assert!(compute_rates(&sample, &sample, -1.0).is_empty());
        assert!(compute_rates(&sample, &sample, f64::NAN).is_empty());
    }

    #[test]
    fn test_format_rate_matches_the_net_field_units() {
        assert_eq!(format_rate(0.0), "0 B/s");
        assert_eq!(format_rate(512.0), "512 B/s");
        assert_eq!(format_rate(1024.0), "1.0 KB/s");
        assert_eq!(format_rate(1024.0 * 1024.0 * 1.5), "1.5 MB/s");
        // Not reachable from compute_rates, but the formatter is public.
        assert_eq!(format_rate(f64::NAN), "0 B/s");
        assert_eq!(format_rate(-1.0), "0 B/s");
    }

    #[test]
    fn test_format_io_line() {
        let rate = IoRate {
            device: "nvme0n1".into(),
            read: 0.0,
            write: 1024.0 * 308.0,
        };
        assert_eq!(
            format_io_line(&rate, "R", "W"),
            "nvme0n1 R: 0 B/s W: 308.0 KB/s"
        );
    }

    #[test]
    fn test_select_net_rates_prefers_the_active_interface() {
        let rates = vec![
            IoRate {
                device: "wlp0s20f3".into(),
                read: 100.0,
                write: 50.0,
            },
            IoRate {
                device: "wt0".into(),
                read: 10.0,
                write: 10.0,
            },
        ];
        let selected = select_net_rates(rates, Some("wlp0s20f3"));
        assert_eq!(selected.len(), 1);
        assert_eq!(selected[0].device, "wlp0s20f3");
    }

    #[test]
    fn test_select_net_rates_keeps_an_idle_active_interface() {
        // 0 B/s on the interface you are actually using is a reading, not a miss.
        let rates = vec![IoRate {
            device: "eth0".into(),
            read: 0.0,
            write: 0.0,
        }];
        let selected = select_net_rates(rates, Some("eth0"));
        assert_eq!(selected.len(), 1);
        assert_eq!(selected[0].device, "eth0");
    }

    #[test]
    fn test_physical_drive_name_matches_the_device_path() {
        assert_eq!(physical_drive_name(0), "PhysicalDrive0");
        assert_eq!(physical_drive_name(31), "PhysicalDrive31");
    }

    #[test]
    fn test_select_net_rates_falls_back_to_busy_interfaces() {
        let rates = vec![
            IoRate {
                device: "eth0".into(),
                read: 0.0,
                write: 0.0,
            },
            IoRate {
                device: "wt0".into(),
                read: 1.0,
                write: 0.0,
            },
        ];
        // Unknown active interface: report what moved, not everything.
        let selected = select_net_rates(rates.clone(), None);
        assert_eq!(selected.len(), 1);
        assert_eq!(selected[0].device, "wt0");
        // An active interface that is not in the list at all falls back the same way.
        let selected = select_net_rates(rates, Some("ppp0"));
        assert_eq!(selected.len(), 1);
        assert_eq!(selected[0].device, "wt0");
    }
}
