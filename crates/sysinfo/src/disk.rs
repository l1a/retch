// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Physical disk detection (model, size, type).

pub fn detect_physical_disks() -> Vec<String> {
    #[cfg(target_os = "linux")]
    return detect_linux();

    #[cfg(target_os = "macos")]
    return detect_macos();

    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
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

#[cfg(any(target_os = "linux", target_os = "macos"))]
fn format_size(bytes: u64) -> String {
    const TB: u64 = 1_000_000_000_000;
    const GB: u64 = 1_000_000_000;
    if bytes >= TB {
        format!("{:.1} TB", bytes as f64 / TB as f64)
    } else {
        format!("{:.0} GB", bytes as f64 / GB as f64)
    }
}

#[cfg(test)]
mod tests {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    use super::format_size;
    #[cfg(target_os = "linux")]
    use super::strip_embedded_size;

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
}
