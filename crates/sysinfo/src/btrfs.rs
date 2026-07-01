// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Btrfs filesystem detection — label, subvolume, and space allocation for
//! mounted btrfs volumes.
//!
//! Linux only: btrfs is not a supported filesystem on macOS or Windows.

/// Detects mounted btrfs filesystems and reports label + subvolume + allocation
/// for each mount point.
///
/// One entry is reported per mount point (not per underlying device), since a
/// single btrfs filesystem is commonly mounted at multiple points via distinct
/// subvolumes (e.g. `/` and `/home` on the same device). Snapshot counts are
/// best-effort: `btrfs subvolume list` requires root, so the count is omitted
/// (rather than shown as zero) when it can't be read.
///
/// Shells out to `btrfs filesystem show`/`usage`, so this is gated behind
/// `--long` and above like other subprocess-based fields (bios, wifi, ...).
pub fn detect_btrfs() -> Vec<String> {
    #[cfg(target_os = "linux")]
    {
        detect_linux()
    }

    #[cfg(not(target_os = "linux"))]
    {
        Vec::new()
    }
}

#[cfg(target_os = "linux")]
fn detect_linux() -> Vec<String> {
    let mounts = std::fs::read_to_string("/proc/mounts").unwrap_or_default();
    let mut results = Vec::new();

    for line in mounts.lines() {
        let Some(entry) = parse_mount_line(line) else {
            continue;
        };
        if entry.fs_type != "btrfs" {
            continue;
        }

        if let Some(formatted) = format_btrfs_volume(entry.mount_point, entry.subvol) {
            results.push(formatted);
        }
    }

    results
}

#[cfg(target_os = "linux")]
struct MountEntry<'a> {
    mount_point: &'a str,
    fs_type: &'a str,
    subvol: Option<&'a str>,
}

/// Parses one `/proc/mounts` line into device/mountpoint/fstype/subvol-option.
#[cfg(target_os = "linux")]
fn parse_mount_line(line: &str) -> Option<MountEntry<'_>> {
    let parts: Vec<&str> = line.splitn(4, ' ').collect();
    if parts.len() < 4 {
        return None;
    }
    let mount_point = parts[1];
    let fs_type = parts[2];
    // parts[3] is "options dump pass"; options is the first whitespace-separated token.
    let options = parts[3].split(' ').next().unwrap_or("");
    let subvol = options
        .split(',')
        .find_map(|opt| opt.strip_prefix("subvol="));

    Some(MountEntry {
        mount_point,
        fs_type,
        subvol,
    })
}

/// Runs `btrfs filesystem show`/`usage --raw` for a mountpoint and formats the result.
#[cfg(target_os = "linux")]
fn format_btrfs_volume(mount_point: &str, subvol: Option<&str>) -> Option<String> {
    let label = std::process::Command::new("btrfs")
        .args(["filesystem", "show", mount_point])
        .output()
        .ok()
        .filter(|o| o.status.success())
        .and_then(|o| parse_btrfs_label(&String::from_utf8_lossy(&o.stdout)));

    let usage = std::process::Command::new("btrfs")
        .args(["filesystem", "usage", "--raw", mount_point])
        .output()
        .ok()
        .filter(|o| o.status.success())
        .and_then(|o| parse_btrfs_usage(&String::from_utf8_lossy(&o.stdout)))?;

    let (used, size) = usage;
    let used_gb = used as f64 / 1_073_741_824.0;
    let size_gb = size as f64 / 1_073_741_824.0;

    let snapshots = count_snapshots(mount_point);

    let name = match (label, subvol) {
        (Some(label), Some(subvol)) => format!("{} ({}, subvol={})", label, mount_point, subvol),
        (Some(label), None) => format!("{} ({})", label, mount_point),
        (None, Some(subvol)) => format!("{} (subvol={})", mount_point, subvol),
        (None, None) => mount_point.to_string(),
    };

    Some(match snapshots {
        Some(n) => format!(
            "{}: {:.1} / {:.1} GB used, {} snapshot{}",
            name,
            used_gb,
            size_gb,
            n,
            if n == 1 { "" } else { "s" }
        ),
        None => format!("{}: {:.1} / {:.1} GB used", name, used_gb, size_gb),
    })
}

/// Counts snapshot subvolumes under a mountpoint via `btrfs subvolume list -s`.
///
/// Requires root (`CAP_SYS_ADMIN`); returns `None` (not `Some(0)`) if the
/// query fails, so callers can distinguish "no snapshots" from "couldn't check".
#[cfg(target_os = "linux")]
fn count_snapshots(mount_point: &str) -> Option<usize> {
    let output = std::process::Command::new("btrfs")
        .args(["subvolume", "list", "-s", mount_point])
        .output()
        .ok()?;
    if !output.status.success() {
        return None;
    }
    let text = String::from_utf8_lossy(&output.stdout);
    Some(text.lines().filter(|l| !l.trim().is_empty()).count())
}

/// Parses the `Label: 'name'` line from `btrfs filesystem show` output.
#[cfg(target_os = "linux")]
fn parse_btrfs_label(text: &str) -> Option<String> {
    let line = text.lines().next()?;
    let start = line.find('\'')? + 1;
    let rest = &line[start..];
    let end = rest.find('\'')?;
    let label = &rest[..end];
    if label.is_empty() {
        None
    } else {
        Some(label.to_string())
    }
}

/// Parses `Device size` and `Used` (in bytes) from `btrfs filesystem usage --raw` output.
#[cfg(target_os = "linux")]
fn parse_btrfs_usage(text: &str) -> Option<(u64, u64)> {
    let mut size = None;
    let mut used = None;

    for line in text.lines() {
        let trimmed = line.trim();
        if let Some(rest) = trimmed.strip_prefix("Device size:") {
            size = rest.trim().parse::<u64>().ok();
        } else if let Some(rest) = trimmed.strip_prefix("Used:") {
            used = rest.trim().parse::<u64>().ok();
        }
    }

    Some((used?, size?))
}

#[cfg(test)]
mod tests {
    #[cfg(target_os = "linux")]
    use super::{parse_btrfs_label, parse_btrfs_usage, parse_mount_line};

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_mount_line_btrfs_with_subvol() {
        let line = "/dev/nvme0n1p3 /home btrfs rw,seclabel,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=257,subvol=/home 0 0";
        let entry = parse_mount_line(line).unwrap();
        assert_eq!(entry.mount_point, "/home");
        assert_eq!(entry.fs_type, "btrfs");
        assert_eq!(entry.subvol, Some("/home"));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_mount_line_two_subvols_same_device_both_kept() {
        // Regression: previously deduped by device, silently dropping /home
        // when / and /home share the same underlying btrfs filesystem.
        let root = "/dev/nvme0n1p3 / btrfs rw,subvolid=256,subvol=/root 0 0";
        let home = "/dev/nvme0n1p3 /home btrfs rw,subvolid=257,subvol=/home 0 0";
        let root_entry = parse_mount_line(root).unwrap();
        let home_entry = parse_mount_line(home).unwrap();
        assert_eq!(root_entry.mount_point, "/");
        assert_eq!(root_entry.subvol, Some("/root"));
        assert_eq!(home_entry.mount_point, "/home");
        assert_eq!(home_entry.subvol, Some("/home"));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_mount_line_non_btrfs() {
        let line = "/dev/nvme0n1p1 /boot ext4 rw,seclabel,relatime 0 0";
        let entry = parse_mount_line(line).unwrap();
        assert_eq!(entry.fs_type, "ext4");
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_mount_line_no_subvol_option() {
        let line = "/dev/sdb1 /mnt/data btrfs rw,relatime,space_cache=v2 0 0";
        let entry = parse_mount_line(line).unwrap();
        assert_eq!(entry.subvol, None);
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_btrfs_label() {
        let text = "Label: 'root'  uuid: 1234abcd-5678-90ef-1234-567890abcdef\n\tTotal devices 1 FS bytes used 5.02GiB\n";
        assert_eq!(parse_btrfs_label(text), Some("root".to_string()));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_btrfs_label_none() {
        let text = "Label: none  uuid: 1234abcd-5678-90ef-1234-567890abcdef\n";
        assert_eq!(parse_btrfs_label(text), None);
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_btrfs_usage() {
        let text = "Overall:\n    Device size:                  21474836480\n    Device allocated:              5390387200\n    Device unallocated:           16084449280\n    Device missing:                          0\n    Used:                          3576184832\n    Free (estimated):             17650311168      (min: 17650311168)\n";
        assert_eq!(
            parse_btrfs_usage(text),
            Some((3_576_184_832, 21_474_836_480))
        );
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_btrfs_usage_missing_fields() {
        let text = "Overall:\n    Device size:                  21474836480\n";
        assert_eq!(parse_btrfs_usage(text), None);
    }
}
