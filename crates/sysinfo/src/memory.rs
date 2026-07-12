// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Physical memory (RAM) slot detection — type, speed, and capacity.

pub fn detect_physical_memory() -> Option<String> {
    #[cfg(target_os = "linux")]
    return detect_linux();

    #[cfg(target_os = "macos")]
    return detect_macos();

    #[cfg(target_os = "windows")]
    return detect_windows();

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    return None;
}

/// Represents one DIMM slot as parsed from DMI type-17 output.
#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
#[derive(Debug, PartialEq)]
pub struct DimmSlot {
    pub size_mb: u64,
    pub mem_type: String,
    /// Rated/maximum speed the module supports.
    pub speed_mt: Option<u64>,
    /// Speed the module is actually clocked at, when the source distinguishes
    /// it from the rated speed (currently: Linux dmidecode's "Configured
    /// Memory Speed"). `None` if unknown or not reported separately.
    pub configured_speed_mt: Option<u64>,
}

/// Parses `dmidecode --type 17` text output into a list of populated DIMM slots.
#[cfg(target_os = "linux")]
pub fn parse_dmidecode_type17(output: &str) -> Vec<DimmSlot> {
    let mut slots = Vec::new();
    let mut size_mb: Option<u64> = None;
    let mut mem_type = String::new();
    let mut speed_mt: Option<u64> = None;
    let mut configured_speed_mt: Option<u64> = None;

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
                        configured_speed_mt,
                    });
                }
            }
            mem_type.clear();
            speed_mt = None;
            configured_speed_mt = None;
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
        } else if let Some(rest) = trimmed.strip_prefix("Configured Memory Speed:") {
            // e.g. "4000 MT/s" or "Unknown" — the speed the module is actually
            // running at, which can be lower than "Speed:" (its rated max).
            let rest = rest.trim();
            if let Some(mt_str) = rest.strip_suffix(" MT/s") {
                configured_speed_mt = mt_str.trim().parse::<u64>().ok();
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
                configured_speed_mt,
            });
        }
    }

    slots
}

/// Formats a list of DIMM slots into a human-readable summary string.
#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
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
        configured_speed_mt: Option<u64>,
    }

    let mut groups: Vec<(Key, usize)> = Vec::new();
    for slot in slots {
        let key = Key {
            size_mb: slot.size_mb,
            mem_type: slot.mem_type.clone(),
            speed_mt: slot.speed_mt,
            configured_speed_mt: slot.configured_speed_mt,
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

            match (key.speed_mt, key.configured_speed_mt) {
                (Some(rated), Some(running)) if running != rated => {
                    s.push_str(&format!(" {} MT/s (rated {} MT/s)", running, rated));
                }
                (Some(mt), _) => {
                    s.push_str(&format!(" {} MT/s", mt));
                }
                (None, Some(running)) => {
                    s.push_str(&format!(" {} MT/s", running));
                }
                (None, None) => {}
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
                            configured_speed_mt: None,
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
                configured_speed_mt: None,
            });
        }
    }

    // Apple Silicon unified memory: system_profiler often reports a single "Size" at the top level
    // without slot headers — we'll have one slot from the flush above.

    format_dimm_slots(&slots)
}

/// Detects physical memory on Windows via the raw SMBIOS table.
///
/// Replaces the previous `Get-CimInstance Win32_PhysicalMemory` PowerShell spawns
/// (~600 ms, ×2) with `GetSystemFirmwareTable('RSMB')`, parsing SMBIOS type-17 (Memory
/// Device) structures directly. This also picks up the *Configured Memory Speed* field
/// (the actual running speed) that the WMI path did not expose, so Windows now matches
/// the Linux dmidecode output (e.g. "4800 MT/s (rated 6000 MT/s)").
#[cfg(target_os = "windows")]
fn detect_windows() -> Option<String> {
    if let Some(table) = win_ffi::read_smbios_table() {
        let slots = parse_smbios_type17(&table);
        if let Some(result) = format_dimm_slots(&slots) {
            return Some(result);
        }
    }

    // Hyper-V and other VMs expose no DIMM structures in SMBIOS. Fall back to the total
    // physical memory (via GlobalMemoryStatusEx) so the field still appears.
    let total_bytes = win_ffi::total_physical_memory()?;
    if total_bytes == 0 {
        return None;
    }
    let gb = total_bytes as f64 / (1024.0 * 1024.0 * 1024.0);
    Some(format!("{:.0} GB (VM — DIMM info unavailable)", gb))
}

/// Parses the SMBIOS structure table (the `SMBIOSTableData` portion of `RawSMBIOSData`,
/// i.e. after the 8-byte header) into a list of populated DIMM slots.
///
/// Walks each structure by its formatted length + the double-null-terminated string set,
/// extracting type-17 (Memory Device) fields. All field reads are bounded by the
/// structure's declared length, so shorter (older SMBIOS-version) structures are safe.
#[cfg(target_os = "windows")]
pub fn parse_smbios_type17(data: &[u8]) -> Vec<DimmSlot> {
    // Little-endian u16/u32 readers, bounds-checked against the formatted area `s`.
    fn u16_at(s: &[u8], off: usize) -> Option<u16> {
        s.get(off..off + 2)
            .map(|b| u16::from_le_bytes([b[0], b[1]]))
    }
    fn u32_at(s: &[u8], off: usize) -> Option<u32> {
        s.get(off..off + 4)
            .map(|b| u32::from_le_bytes([b[0], b[1], b[2], b[3]]))
    }

    let mut slots = Vec::new();
    let mut i = 0usize;
    while i + 4 <= data.len() {
        let typ = data[i];
        let slen = data[i + 1] as usize; // length of the formatted area
        if slen < 4 || i + slen > data.len() {
            break; // malformed / truncated
        }
        if typ == 127 {
            break; // end-of-table marker
        }
        if typ == 17 {
            let s = &data[i..i + slen];
            if let Some(slot) = parse_type17_struct(s) {
                slots.push(slot);
            }
        }
        // Advance past the formatted area, then the string set (terminated by 0x00 0x00).
        let mut j = i + slen;
        loop {
            if j + 1 >= data.len() {
                j = data.len();
                break;
            }
            if data[j] == 0 && data[j + 1] == 0 {
                j += 2;
                break;
            }
            j += 1;
        }
        i = j;
    }

    /// Parses a single type-17 formatted area into a `DimmSlot`, or `None` for an
    /// empty/unpopulated slot.
    fn parse_type17_struct(s: &[u8]) -> Option<DimmSlot> {
        // Size (WORD @ 0x0C): 0 = empty; 0x7FFF = use Extended Size (DWORD @ 0x1C, in MB);
        // otherwise bit15 selects unit (0=MB, 1=KB) and bits 0..14 are the value.
        let size_raw = u16_at(s, 0x0C)?;
        if size_raw == 0 {
            return None;
        }
        let size_mb = if size_raw == 0x7FFF {
            (u32_at(s, 0x1C)? & 0x7FFF_FFFF) as u64
        } else {
            let val = (size_raw & 0x7FFF) as u64;
            if size_raw & 0x8000 != 0 {
                val / 1024
            } else {
                val
            }
        };
        if size_mb == 0 {
            return None;
        }

        let mem_type = byte_at(s, 0x12)
            .map(|code| smbios_memory_type(u16::from(code)))
            .unwrap_or_default();

        // Speed (WORD @ 0x15 — 0x13 is the Type Detail WORD) and Configured Memory Speed
        // (WORD @ 0x20), both MT/s. 0 = unknown; 0xFFFF = use the extended DWORD (3.3+).
        let speed_mt = read_speed(s, 0x15, 0x54);
        let configured_speed_mt = read_speed(s, 0x20, 0x58);

        Some(DimmSlot {
            size_mb,
            mem_type,
            speed_mt,
            configured_speed_mt,
        })
    }

    /// Reads a byte field if present.
    fn byte_at(s: &[u8], off: usize) -> Option<u8> {
        s.get(off).copied()
    }

    /// Reads an MT/s speed at `word_off`, following the 0xFFFF -> extended DWORD indirection
    /// at `ext_off`. Returns `None` if unknown/absent.
    fn read_speed(s: &[u8], word_off: usize, ext_off: usize) -> Option<u64> {
        match u16_at(s, word_off) {
            None | Some(0) => None,
            Some(0xFFFF) => u32_at(s, ext_off).filter(|&v| v > 0).map(|v| v as u64),
            Some(v) => Some(v as u64),
        }
    }

    slots
}

/// Maps SMBIOS memory type codes (from `Win32_PhysicalMemory.SMBIOSMemoryType`) to strings.
#[cfg(target_os = "windows")]
fn smbios_memory_type(code: u16) -> String {
    match code {
        20 => "DDR".to_string(),
        21 => "DDR2".to_string(),
        24 => "DDR3".to_string(),
        26 => "DDR4".to_string(),
        27 => "LPDDR".to_string(),
        28 => "LPDDR2".to_string(),
        29 => "LPDDR3".to_string(),
        30 => "LPDDR4".to_string(),
        34 => "DDR5".to_string(),
        35 => "LPDDR5".to_string(),
        _ => String::new(),
    }
}

/// Native Win32 bindings for reading the raw SMBIOS table and total physical memory.
///
/// Hand-written `extern "system"` declarations matching the crate's Windows FFI style
/// (`win_reg.rs`) — no Win32 binding crate.
#[cfg(target_os = "windows")]
mod win_ffi {
    use std::ffi::c_void;
    use std::mem::size_of;

    // 'RSMB' provider signature, as the multi-char DWORD Windows expects.
    const RSMB: u32 = u32::from_be_bytes(*b"RSMB");
    // RawSMBIOSData header: Used20CallingMethod, Major, Minor, DmiRevision (4 bytes),
    // then a u32 Length, then the SMBIOS structure table.
    const RAW_SMBIOS_HEADER_LEN: usize = 8;

    #[repr(C)]
    struct MemoryStatusEx {
        length: u32,
        memory_load: u32,
        total_phys: u64,
        avail_phys: u64,
        total_page_file: u64,
        avail_page_file: u64,
        total_virtual: u64,
        avail_virtual: u64,
        avail_extended_virtual: u64,
    }

    extern "system" {
        fn GetSystemFirmwareTable(
            firmware_table_provider_signature: u32,
            firmware_table_id: u32,
            firmware_table_buffer: *mut c_void,
            buffer_size: u32,
        ) -> u32;

        fn GlobalMemoryStatusEx(buffer: *mut MemoryStatusEx) -> i32;
    }

    /// Reads the SMBIOS structure table (the `SMBIOSTableData` region, header stripped),
    /// or `None` if unavailable.
    pub fn read_smbios_table() -> Option<Vec<u8>> {
        // SAFETY: querying with a null buffer/zero size returns the required size.
        let needed = unsafe { GetSystemFirmwareTable(RSMB, 0, std::ptr::null_mut(), 0) };
        if needed == 0 {
            return None;
        }
        let mut buf = vec![0u8; needed as usize];
        // SAFETY: buf is `needed` bytes and its length is passed as the buffer size.
        let written =
            unsafe { GetSystemFirmwareTable(RSMB, 0, buf.as_mut_ptr() as *mut c_void, needed) };
        if written == 0 || (written as usize) > buf.len() {
            return None;
        }
        buf.truncate(written as usize);
        if buf.len() < RAW_SMBIOS_HEADER_LEN {
            return None;
        }
        // Length field (u32 LE) at offset 4 gives the table size after the 8-byte header.
        let table_len = u32::from_le_bytes([buf[4], buf[5], buf[6], buf[7]]) as usize;
        let end = RAW_SMBIOS_HEADER_LEN.checked_add(table_len)?;
        let end = end.min(buf.len());
        Some(buf[RAW_SMBIOS_HEADER_LEN..end].to_vec())
    }

    /// Returns total installed physical memory in bytes via `GlobalMemoryStatusEx`.
    pub fn total_physical_memory() -> Option<u64> {
        let mut status = MemoryStatusEx {
            length: size_of::<MemoryStatusEx>() as u32,
            memory_load: 0,
            total_phys: 0,
            avail_phys: 0,
            total_page_file: 0,
            avail_page_file: 0,
            total_virtual: 0,
            avail_virtual: 0,
            avail_extended_virtual: 0,
        };
        // SAFETY: status is a valid MemoryStatusEx with `length` set to its own size.
        let ok = unsafe { GlobalMemoryStatusEx(&mut status) };
        if ok == 0 {
            None
        } else {
            Some(status.total_phys)
        }
    }

    #[cfg(test)]
    mod layout {
        use std::mem::size_of;

        // `MemoryStatusEx.length` must equal the OS's sizeof or GlobalMemoryStatusEx fails.
        #[test]
        fn ffi_struct_layout() {
            assert_eq!(size_of::<super::MemoryStatusEx>(), 64);
        }
    }
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
    fn test_parse_dmidecode_configured_speed_below_rated() {
        // XMP/EXPO not enabled — modules run below their rated speed.
        let input = r#"
Memory Device
        Size: 16 GB
        Type: DDR5
        Speed: 6000 MT/s
        Configured Memory Speed: 4800 MT/s

Memory Device
        Size: 16 GB
        Type: DDR5
        Speed: 6000 MT/s
        Configured Memory Speed: 4800 MT/s
"#;
        let slots = parse_dmidecode_type17(input);
        assert_eq!(slots[0].speed_mt, Some(6000));
        assert_eq!(slots[0].configured_speed_mt, Some(4800));

        let summary = format_dimm_slots(&slots).unwrap();
        assert_eq!(summary, "2× 16 GB DDR5 4800 MT/s (rated 6000 MT/s)");
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn test_parse_dmidecode_configured_speed_matches_rated() {
        // Configured speed equal to rated — no redundant "(rated ...)" suffix.
        let input = r#"
Memory Device
        Size: 8 GB
        Type: DDR5
        Speed: 4800 MT/s
        Configured Memory Speed: 4800 MT/s
"#;
        let slots = parse_dmidecode_type17(input);
        let summary = format_dimm_slots(&slots).unwrap();
        assert_eq!(summary, "8 GB DDR5 4800 MT/s");
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

    /// Builds one SMBIOS type-17 (Memory Device) structure: a 34-byte formatted area
    /// (SMBIOS 2.7, covering through Configured Memory Speed) plus a double-null-terminated
    /// string set. `size_word` is the raw Size field (MB when bit15 is clear).
    #[cfg(target_os = "windows")]
    fn make_type17(size_word: u16, type_code: u8, speed: u16, configured: u16) -> Vec<u8> {
        let mut s = vec![0u8; 0x22];
        s[0] = 17; // Type = Memory Device
        s[1] = 0x22; // Length = 34
        s[2] = 0x00; // Handle (arbitrary)
        s[3] = 0x11;
        s[0x0C..0x0E].copy_from_slice(&size_word.to_le_bytes());
        s[0x12] = type_code;
        s[0x15..0x17].copy_from_slice(&speed.to_le_bytes()); // Speed @ 0x15 (0x13 = Type Detail)
        s[0x20..0x22].copy_from_slice(&configured.to_le_bytes());
        // Empty string set: terminating double-null.
        s.push(0);
        s.push(0);
        s
    }

    /// Appends the end-of-table (type 127) structure.
    #[cfg(target_os = "windows")]
    fn end_marker() -> Vec<u8> {
        vec![127, 4, 0x00, 0x7F, 0, 0]
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_ddr4_two_slots() {
        // 8 GB = 8192 MB = 0x2000 (bit15 clear -> MB), DDR4 (26), 3200 MT/s, no configured.
        let mut data = make_type17(0x2000, 26, 3200, 0);
        data.extend(make_type17(0x2000, 26, 3200, 0));
        data.extend(end_marker());
        let slots = parse_smbios_type17(&data);
        assert_eq!(slots.len(), 2);
        assert_eq!(slots[0].size_mb, 8192);
        assert_eq!(slots[0].mem_type, "DDR4");
        assert_eq!(slots[0].speed_mt, Some(3200));
        assert_eq!(format_dimm_slots(&slots).unwrap(), "2× 8 GB DDR4 3200 MT/s");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_ddr5_configured_below_rated() {
        // 16 GB = 16384 MB = 0x4000, DDR5 (34), rated 6000, running 4800 (XMP/EXPO off).
        // This is the field the old WMI path could not read.
        let mut data = make_type17(0x4000, 34, 6000, 4800);
        data.extend(end_marker());
        let slots = parse_smbios_type17(&data);
        assert_eq!(slots.len(), 1);
        assert_eq!(slots[0].speed_mt, Some(6000));
        assert_eq!(slots[0].configured_speed_mt, Some(4800));
        assert_eq!(
            format_dimm_slots(&slots).unwrap(),
            "16 GB DDR5 4800 MT/s (rated 6000 MT/s)"
        );
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_skips_empty_slot() {
        // Size 0 = unpopulated slot -> skipped; one populated 16 GB DDR5 remains.
        // (16 GB = 0x4000 MB fits the 15-bit Size field with bit15 clear; ≥32 GB would
        // require the Extended Size path, covered separately.)
        let mut data = make_type17(0, 0, 0, 0);
        data.extend(make_type17(0x4000, 34, 4800, 4800));
        data.extend(end_marker());
        let slots = parse_smbios_type17(&data);
        assert_eq!(slots.len(), 1);
        assert_eq!(slots[0].size_mb, 16384);
        assert_eq!(format_dimm_slots(&slots).unwrap(), "16 GB DDR5 4800 MT/s");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_unknown_type_no_label() {
        // Memory type 0 -> no type label; speed 0 -> no speed suffix.
        let mut data = make_type17(0x4000, 0, 0, 0);
        data.extend(end_marker());
        let slots = parse_smbios_type17(&data);
        assert_eq!(format_dimm_slots(&slots).unwrap(), "16 GB");
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_size_in_kb() {
        // bit15 set -> value is in KB. 0x8000 | 0x0400 => 1024 KB = 1 MB.
        let mut data = make_type17(0x8000 | 0x0400, 26, 3200, 0);
        data.extend(end_marker());
        let slots = parse_smbios_type17(&data);
        assert_eq!(slots.len(), 1);
        assert_eq!(slots[0].size_mb, 1);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_extended_size() {
        // Size == 0x7FFF -> read Extended Size DWORD @ 0x1C (in MB). 65536 MB = 64 GB.
        let mut data = make_type17(0x7FFF, 34, 4800, 0);
        data[0x1C..0x20].copy_from_slice(&65536u32.to_le_bytes());
        data.extend(end_marker());
        let slots = parse_smbios_type17(&data);
        assert_eq!(slots.len(), 1);
        assert_eq!(slots[0].size_mb, 65536);
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn test_parse_smbios_type17_empty_table() {
        assert!(parse_smbios_type17(&end_marker()).is_empty());
        assert!(parse_smbios_type17(&[]).is_empty());
    }
}
