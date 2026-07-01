// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! ZFS storage pool detection via `zpool list`.
//!
//! Supported wherever the `zpool` binary is present (Linux with ZFS-on-Linux,
//! macOS with OpenZFS). Returns an empty list if `zpool` is not installed —
//! most systems don't have ZFS, so a missing binary is not an error.

/// Detects imported ZFS pools and reports name, allocation, and health for each.
///
/// Shells out to `zpool list`, so this is gated behind `--long` and above
/// like other subprocess-based fields (bios, wifi, ...).
pub fn detect_zpool() -> Vec<String> {
    let output = std::process::Command::new("zpool")
        .args(["list", "-H", "-p", "-o", "name,size,alloc,health"])
        .output();

    let Ok(output) = output else {
        return Vec::new();
    };
    if !output.status.success() {
        return Vec::new();
    }

    parse_zpool_list(&String::from_utf8_lossy(&output.stdout))
}

/// Parses `zpool list -H -p -o name,size,alloc,health` (tab-separated, byte-exact sizes).
pub fn parse_zpool_list(text: &str) -> Vec<String> {
    let mut pools = Vec::new();

    for line in text.lines() {
        let fields: Vec<&str> = line.split('\t').collect();
        if fields.len() < 4 {
            continue;
        }
        let name = fields[0];
        let Ok(size) = fields[1].parse::<u64>() else {
            continue;
        };
        let Ok(alloc) = fields[2].parse::<u64>() else {
            continue;
        };
        let health = fields[3];

        let size_gb = size as f64 / 1_073_741_824.0;
        let alloc_gb = alloc as f64 / 1_073_741_824.0;

        pools.push(format!(
            "{}: {:.1} / {:.1} GB ({})",
            name, alloc_gb, size_gb, health
        ));
    }

    pools
}

#[cfg(test)]
mod tests {
    use super::parse_zpool_list;

    #[test]
    fn test_parse_zpool_list_single() {
        let text = "tank\t1073741824000\t536870912000\tONLINE\n";
        let pools = parse_zpool_list(text);
        assert_eq!(pools, vec!["tank: 500.0 / 1000.0 GB (ONLINE)"]);
    }

    #[test]
    fn test_parse_zpool_list_multi() {
        let text = "tank\t1073741824000\t536870912000\tONLINE\nbackup\t2147483648000\t107374182400\tDEGRADED\n";
        let pools = parse_zpool_list(text);
        assert_eq!(pools.len(), 2);
        assert_eq!(pools[0], "tank: 500.0 / 1000.0 GB (ONLINE)");
        assert_eq!(pools[1], "backup: 100.0 / 2000.0 GB (DEGRADED)");
    }

    #[test]
    fn test_parse_zpool_list_empty() {
        assert!(parse_zpool_list("").is_empty());
    }

    #[test]
    fn test_parse_zpool_list_malformed_line_skipped() {
        let text = "tank\tnot-a-number\t536870912000\tONLINE\n";
        assert!(parse_zpool_list(text).is_empty());
    }
}
