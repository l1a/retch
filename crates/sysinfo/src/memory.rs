// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Physical memory (RAM) slot detection — type, speed, and capacity.

pub fn detect_physical_memory() -> Option<String> {
    #[cfg(target_os = "linux")]
    return detect_linux();

    #[cfg(target_os = "macos")]
    return detect_macos();

    #[cfg(not(any(target_os = "linux", target_os = "macos")))]
    return None;
}

/// Represents one DIMM slot as parsed from DMI type-17 output.
#[cfg(any(target_os = "linux", target_os = "macos"))]
#[derive(Debug, PartialEq)]
pub struct DimmSlot {
    pub size_mb: u64,
    pub mem_type: String,
    pub speed_mt: Option<u64>,
}

/// Parses `dmidecode --type 17` text output into a list of populated DIMM slots.
#[cfg(target_os = "linux")]
pub fn parse_dmidecode_type17(output: &str) -> Vec<DimmSlot> {
    let mut slots = Vec::new();
    let mut size_mb: Option<u64> = None;
    let mut mem_type = String::new();
    let mut speed_mt: Option<u64> = None;

    for line in output.lines() {
        let trimmed = line.trim();

        if trimmed == "Memory Device" {
            // Flush previous slot
            if let Some(mb) = size_mb.take() {
                if mb > 0 {
                    slots.push(DimmSlot {
                        size_mb: mb,
                        mem_type: mem_type.clone(),
                        speed_mt,
                    });
                }
            }
            mem_type.clear();
            speed_mt = None;
        } else if let Some(rest) = trimmed.strip_prefix("Size:") {
            let rest = rest.trim();
            if rest.contains("No Module") || rest == "Unknown" {
                size_mb = Some(0);
            } else if let Some(n) = rest
                .strip_suffix(" GiB")
                .or_else(|| rest.strip_suffix(" GB"))
            {
                size_mb = n.trim().parse::<u64>().ok().map(|g| g * 1024);
            } else if let Some(n) = rest
                .strip_suffix(" MiB")
                .or_else(|| rest.strip_suffix(" MB"))
            {
                size_mb = n.trim().parse::<u64>().ok();
            }
        } else if let Some(rest) = trimmed.strip_prefix("Type:") {
            let t = rest.trim();
            if t != "Unknown" && !t.is_empty() {
                mem_type = t.to_string();
            }
        } else if let Some(rest) = trimmed.strip_prefix("Speed:") {
            // e.g. "4800 MT/s" or "Unknown"
            let rest = rest.trim();
            if let Some(mt_str) = rest.strip_suffix(" MT/s") {
                speed_mt = mt_str.trim().parse::<u64>().ok();
            }
        }
    }

    // Flush last slot
    if let Some(mb) = size_mb {
        if mb > 0 {
            slots.push(DimmSlot {
                size_mb: mb,
                mem_type,
                speed_mt,
            });
        }
    }

    slots
}

/// Formats a list of DIMM slots into a human-readable summary string.
#[cfg(any(target_os = "linux", target_os = "macos"))]
pub fn format_dimm_slots(slots: &[DimmSlot]) -> Option<String> {
    if slots.is_empty() {
        return None;
    }

    // Group identical slots (same size + type + speed)
    #[derive(PartialEq, Eq, Hash)]
    struct Key {
        size_mb: u64,
        mem_type: String,
        speed_mt: Option<u64>,
    }

    let mut groups: Vec<(Key, usize)> = Vec::new();
    for slot in slots {
        let key = Key {
            size_mb: slot.size_mb,
            mem_type: slot.mem_type.clone(),
            speed_mt: slot.speed_mt,
        };
        if let Some(entry) = groups.iter_mut().find(|(k, _)| k == &key) {
            entry.1 += 1;
        } else {
            groups.push((key, 1));
        }
    }

    let parts: Vec<String> = groups
        .iter()
        .map(|(key, count)| {
            let size_str = if key.size_mb >= 1024 {
                format!("{} GB", key.size_mb / 1024)
            } else {
                format!("{} MB", key.size_mb)
            };

            let mut s = if *count > 1 {
                format!("{}× {}", count, size_str)
            } else {
                size_str
            };

            if !key.mem_type.is_empty() {
                s.push(' ');
                s.push_str(&key.mem_type);
            }

            if let Some(mt) = key.speed_mt {
                s.push_str(&format!(" {} MT/s", mt));
            }

            s
        })
        .collect();

    Some(parts.join(", "))
}

#[cfg(target_os = "linux")]
fn detect_linux() -> Option<String> {
    // Try name-only first (works when /usr/bin is in PATH), then known absolute paths.
    let candidates = ["dmidecode", "/usr/bin/dmidecode", "/usr/sbin/dmidecode"];
    for cmd in candidates {
        let Ok(output) = std::process::Command::new(cmd)
            .args(["--type", "17"])
            .output()
        else {
            continue;
        };
        if !output.status.success() {
            continue;
        }
        let text = String::from_utf8_lossy(&output.stdout);
        let slots = parse_dmidecode_type17(&text);
        return format_dimm_slots(&slots);
    }
    None
}

#[cfg(target_os = "macos")]
fn detect_macos() -> Option<String> {
    let output = std::process::Command::new("system_profiler")
        .args(["SPMemoryDataType", "-detailLevel", "basic"])
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let text = String::from_utf8_lossy(&output.stdout);
    parse_system_profiler_memory(&text)
}

/// Parses `system_profiler SPMemoryDataType` text output into a summary string.
#[cfg(target_os = "macos")]
pub fn parse_system_profiler_memory(text: &str) -> Option<String> {
    // Example output:
    //   Memory:
    //     Type: LPDDR5
    //     Speed: 6400 MT/s
    //     Manufacturers: SK Hynix
    //     Size: 16 GB
    // Or for multi-slot Macs:
    //   BANK 0/DIMM0:
    //     Size: 16 GB
    //     Type: DDR5
    //     Speed: 4800 MT/s

    let mut slots: Vec<DimmSlot> = Vec::new();
    let mut current_size_mb: Option<u64> = None;
    let mut current_type = String::new();
    let mut current_speed: Option<u64> = None;
    let mut in_slot = false;

    for line in text.lines() {
        let trimmed = line.trim();

        // Slot/bank header (indented section headers ending with ':')
        if (trimmed.contains("DIMM") || trimmed.contains("BANK") || trimmed.contains("Slot"))
            && trimmed.ends_with(':')
        {
            if in_slot {
                if let Some(mb) = current_size_mb.take() {
                    if mb > 0 {
                        slots.push(DimmSlot {
                            size_mb: mb,
                            mem_type: current_type.clone(),
                            speed_mt: current_speed,
                        });
                    }
                }
                current_type.clear();
                current_speed = None;
            }
            in_slot = true;
            continue;
        }

        // "Size:" is used on physical Macs; VMs report the total as "Memory:" instead
        let size_rest = trimmed.strip_prefix("Size:").or_else(|| {
            trimmed
                .strip_prefix("Memory:")
                .filter(|s| !s.trim().is_empty())
        });
        if let Some(rest) = size_rest {
            let rest = rest.trim();
            if rest.contains("Empty") || rest == "Unknown" {
                current_size_mb = Some(0);
            } else if let Some(gb_str) = rest.strip_suffix(" GB") {
                current_size_mb = gb_str.trim().parse::<u64>().ok().map(|g| g * 1024);
            } else if let Some(mb_str) = rest.strip_suffix(" MB") {
                current_size_mb = mb_str.trim().parse::<u64>().ok();
            }
        } else if let Some(rest) = trimmed.strip_prefix("Type:") {
            let t = rest.trim();
            if t != "Unknown" && !t.is_empty() {
                current_type = t.to_string();
            }
        } else if let Some(rest) = trimmed.strip_prefix("Speed:") {
            let rest = rest.trim();
            if let Some(mt_str) = rest.strip_suffix(" MT/s") {
                current_speed = mt_str.trim().parse::<u64>().ok();
            } else if let Some(mhz_str) = rest.strip_suffix(" MHz") {
                // Older Macs report MHz
                current_speed = mhz_str.trim().parse::<u64>().ok().map(|mhz| mhz * 2);
            }
        }
    }

    // Flush last slot
    if let Some(mb) = current_size_mb {
        if mb > 0 {
            slots.push(DimmSlot {
                size_mb: mb,
                mem_type: current_type,
                speed_mt: current_speed,
            });
        }
    }

    // Apple Silicon unified memory: system_profiler often reports a single "Size" at the top level
    // without slot headers — we'll have one slot from the flush above.

    format_dimm_slots(&slots)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_dmidecode_two_slots() {
        let input = r#"
Memory Device
        Size: 8 GB
        Type: DDR5
        Speed: 4800 MT/s

Memory Device
        Size: 8 GB
        Type: DDR5
        Speed: 4800 MT/s
"#;
        let slots = parse_dmidecode_type17(input);
        assert_eq!(slots.len(), 2);
        assert_eq!(slots[0].size_mb, 8192);
        assert_eq!(slots[0].mem_type, "DDR5");
        assert_eq!(slots[0].speed_mt, Some(4800));

        let summary = format_dimm_slots(&slots).unwrap();
        assert_eq!(summary, "2× 8 GB DDR5 4800 MT/s");
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_dmidecode_gib_units() {
        // dmidecode reports GiB on some systems (e.g. LPDDR5 laptops)
        let input = r#"
Memory Device
    Size: 2 GiB
    Type: LPDDR5
    Speed: 6400 MT/s

Memory Device
    Size: 2 GiB
    Type: LPDDR5
    Speed: 6400 MT/s
"#;
        let slots = parse_dmidecode_type17(input);
        assert_eq!(slots.len(), 2);
        assert_eq!(slots[0].size_mb, 2048);
        assert_eq!(slots[0].mem_type, "LPDDR5");
        assert_eq!(slots[0].speed_mt, Some(6400));

        let summary = format_dimm_slots(&slots).unwrap();
        assert_eq!(summary, "2× 2 GB LPDDR5 6400 MT/s");
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_dmidecode_empty_slot() {
        let input = r#"
Memory Device
        Size: No Module Installed
        Type: Unknown

Memory Device
        Size: 16 GB
        Type: DDR4
        Speed: 3200 MT/s
"#;
        let slots = parse_dmidecode_type17(input);
        assert_eq!(slots.len(), 1);
        assert_eq!(slots[0].size_mb, 16384);
        let summary = format_dimm_slots(&slots).unwrap();
        assert_eq!(summary, "16 GB DDR4 3200 MT/s");
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_dmidecode_mixed_sizes() {
        let input = r#"
Memory Device
        Size: 16 GB
        Type: DDR5
        Speed: 5600 MT/s

Memory Device
        Size: 32 GB
        Type: DDR5
        Speed: 5600 MT/s
"#;
        let slots = parse_dmidecode_type17(input);
        assert_eq!(slots.len(), 2);
        let summary = format_dimm_slots(&slots).unwrap();
        // Two different sizes → two groups
        assert!(summary.contains("16 GB DDR5 5600 MT/s"));
        assert!(summary.contains("32 GB DDR5 5600 MT/s"));
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_system_profiler_apple_silicon() {
        let input = r#"
Memory:

      Type: LPDDR5
      Speed: 6400 MT/s
      Size: 16 GB
"#;
        let result = parse_system_profiler_memory(input);
        assert_eq!(result, Some("16 GB LPDDR5 6400 MT/s".to_string()));
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_system_profiler_multi_slot() {
        let input = r#"
Memory:

    BANK 0/DIMM0:

      Size: 16 GB
      Type: DDR5
      Speed: 4800 MT/s

    BANK 1/DIMM0:

      Size: 16 GB
      Type: DDR5
      Speed: 4800 MT/s
"#;
        let result = parse_system_profiler_memory(input);
        assert_eq!(result, Some("2× 16 GB DDR5 4800 MT/s".to_string()));
    }
}
