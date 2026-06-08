// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Display detection and EDID parsing.
//!
//! This module provides cross-platform detection of connected displays,
//! including resolution, refresh rate, and monitor name/serial extraction
//! from raw EDID blobs.
//!
//! ## Platform Support
//!
//! - **Linux**: Reads natively from `/sys/class/drm` (status, modes, and raw EDID
//!   bytes). Falls back to `xrandr --current` when no sysfs displays are found.
//! - **macOS**: Parses `system_profiler SPDisplaysDataType` output.
//! - **Windows**: Queries `wmic path Win32_VideoController`.

/// Parse the monitor's human-readable name from a raw EDID binary blob.
///
/// Searches the four 18-byte descriptor blocks (at EDID offsets 54, 72, 90,
/// and 108) for a Monitor Name Descriptor (tag `0xFC`) and returns the name
/// string, or `None` if no such descriptor is found or the EDID is too short.
#[allow(dead_code)]
pub fn parse_monitor_name_from_edid(edid: &[u8]) -> Option<String> {
    if edid.len() < 128 {
        return None;
    }
    let offsets = [54, 72, 90, 108];
    for &offset in &offsets {
        if offset + 18 <= edid.len() {
            let block = &edid[offset..offset + 18];
            if block[0] == 0x00 && block[1] == 0x00 && block[2] == 0x00 && block[3] == 0xFC {
                let name_bytes = &block[4..17];
                let name = String::from_utf8_lossy(name_bytes);
                let cleaned = name.trim().replace('\0', "").to_string();
                if !cleaned.is_empty() {
                    return Some(cleaned);
                }
            }
        }
    }
    None
}

/// Parse the refresh rate (in Hz) from the first Detailed Timing Descriptor
/// (DTD) block in a raw EDID binary blob.
///
/// Reads the pixel clock, horizontal/vertical active and blanking values from
/// bytes 54–71 of the EDID and computes the refresh rate as:
/// `pixel_clock_hz / (h_total * v_total)`.
///
/// Returns `None` if the EDID is too short or the pixel clock is zero.
#[allow(dead_code)]
pub fn parse_refresh_rate_from_edid(edid: &[u8]) -> Option<f64> {
    if edid.len() < 72 {
        return None;
    }
    let block = &edid[54..72];
    let pixel_clock = ((block[1] as u32) << 8) | (block[0] as u32);
    if pixel_clock == 0 {
        return None;
    }
    let pixel_clock_hz = pixel_clock * 10_000;
    let h_active = (block[2] as u32) | (((block[4] as u32) & 0xF0) << 4);
    let h_blanking = (block[3] as u32) | (((block[4] as u32) & 0x0F) << 8);
    let v_active = (block[5] as u32) | (((block[7] as u32) & 0xF0) << 4);
    let v_blanking = (block[6] as u32) | (((block[7] as u32) & 0x0F) << 8);

    let h_total = h_active + h_blanking;
    let v_total = v_active + v_blanking;
    if h_total == 0 || v_total == 0 {
        return None;
    }

    let refresh = (pixel_clock_hz as f64) / ((h_total * v_total) as f64);
    Some((refresh * 100.0).round() / 100.0)
}

/// Format a refresh rate value for display.
///
/// Integers (e.g. 60.0) are rendered without decimals; non-integer values
/// (e.g. 59.94) are rounded to two decimal places.
#[allow(dead_code)]
pub fn format_refresh_rate(refresh: f64) -> String {
    if (refresh - refresh.round()).abs() < 0.01 {
        format!("{:.0}", refresh)
    } else {
        format!("{:.2}", refresh)
    }
}

/// Parse the serial number from a raw EDID binary blob.
///
/// First searches for an ASCII Serial Number Descriptor (tag `0xFF`) in the
/// four 18-byte descriptor blocks at offsets 54, 72, 90, and 108. If not
/// found, falls back to the 32-bit numeric serial number at EDID bytes 12–15.
///
/// Returns `None` if no serial number is found or the EDID is too short.
#[allow(dead_code)]
pub fn parse_serial_number_from_edid(edid: &[u8]) -> Option<String> {
    if edid.len() < 128 {
        return None;
    }
    // 1. Try finding ASCII Serial Number descriptor block (tag 0xFF)
    let offsets = [54, 72, 90, 108];
    for &offset in &offsets {
        if offset + 18 <= edid.len() {
            let block = &edid[offset..offset + 18];
            if block[0] == 0x00 && block[1] == 0x00 && block[2] == 0x00 && block[3] == 0xFF {
                let serial_bytes = &block[4..17];
                let serial = String::from_utf8_lossy(serial_bytes);
                let cleaned = serial.trim().replace('\0', "").to_string();
                if !cleaned.is_empty() {
                    return Some(cleaned);
                }
            }
        }
    }

    // 2. Fallback to the 32-bit numeric serial number at offset 12-15
    let serial_num = ((edid[15] as u32) << 24)
        | ((edid[14] as u32) << 16)
        | ((edid[13] as u32) << 8)
        | (edid[12] as u32);
    if serial_num != 0 && serial_num != 0xFFFFFFFF {
        return Some(serial_num.to_string());
    }

    None
}

/// Look up the monitor name for a given DRM connector port name by reading
/// the EDID from sysfs (`/sys/class/drm/<entry>/edid`).
///
/// Iterates `/sys/class/drm` for entries whose name ends with `port`, reads
/// the EDID bytes, and extracts the monitor name via [`parse_monitor_name_from_edid`].
/// Returns `None` if not found on Linux or not compiled for Linux.
#[allow(dead_code)]
pub fn get_monitor_name_for_port(port: &str) -> Option<String> {
    if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
        for entry in entries.filter_map(|e| e.ok()) {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.ends_with(port) {
                let edid_path = entry.path().join("edid");
                if edid_path.exists() {
                    if let Ok(edid_bytes) = std::fs::read(&edid_path) {
                        if let Some(monitor_name) = parse_monitor_name_from_edid(&edid_bytes) {
                            return Some(monitor_name);
                        }
                    }
                }
            }
        }
    }
    None
}

/// Detect connected displays and return a list of human-readable strings
/// describing each display (name, resolution, and refresh rate).
///
/// Platform-specific implementations:
/// - **Linux**: Reads `/sys/class/drm` natively; falls back to `xrandr --current`.
/// - **macOS**: Parses `system_profiler SPDisplaysDataType` output.
/// - **Windows**: Queries `wmic path Win32_VideoController`.
pub fn detect_displays() -> Vec<String> {
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPDisplaysDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                return parse_macos_displays(&stdout);
            }
        }
        Vec::new()
    }

    #[cfg(target_os = "windows")]
    {
        let mut displays = Vec::new();
        if let Ok(output) = std::process::Command::new("wmic")
            .args([
                "path",
                "Win32_VideoController",
                "get",
                "Name,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate",
                "/value",
            ])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut name = String::new();
                let mut width = String::new();
                let mut height = String::new();
                let mut refresh = String::new();
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Name=") {
                        name = line.strip_prefix("Name=").unwrap_or("").trim().to_string();
                    } else if line.starts_with("CurrentHorizontalResolution=") {
                        width = line
                            .strip_prefix("CurrentHorizontalResolution=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("CurrentVerticalResolution=") {
                        height = line
                            .strip_prefix("CurrentVerticalResolution=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("CurrentRefreshRate=") {
                        refresh = line
                            .strip_prefix("CurrentRefreshRate=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    }

                    if !name.is_empty()
                        && !width.is_empty()
                        && !height.is_empty()
                        && !refresh.is_empty()
                    {
                        displays.push(format!("{} ({}x{} @ {}Hz)", name, width, height, refresh));
                        name.clear();
                        width.clear();
                        height.clear();
                        refresh.clear();
                    }
                }
                if !name.is_empty() && !width.is_empty() && !height.is_empty() {
                    displays.push(format!("{} ({}x{})", name, width, height));
                }
            }
        }
        displays
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let mut displays = Vec::new();

        // Try reading directly from sysfs first for best performance
        if let Ok(entries) = std::fs::read_dir("/sys/class/drm") {
            for entry in entries.filter_map(|e| e.ok()) {
                let path = entry.path();
                let status_path = path.join("status");
                let modes_path = path.join("modes");
                let edid_path = path.join("edid");
                if status_path.exists() && modes_path.exists() {
                    if let Ok(status) = std::fs::read_to_string(&status_path) {
                        if status.trim() == "connected" {
                            if let Ok(modes) = std::fs::read_to_string(&modes_path) {
                                if let Some(first_mode) = modes.lines().next() {
                                    let res = first_mode.trim().to_string();
                                    let port = entry.file_name().to_string_lossy().to_string();
                                    let clean_port = if let Some(idx) = port.find('-') {
                                        port[idx + 1..].to_string()
                                    } else {
                                        port
                                    };

                                    let edid_bytes = if edid_path.exists() {
                                        std::fs::read(&edid_path).ok()
                                    } else {
                                        None
                                    };

                                    let name = edid_bytes
                                        .as_ref()
                                        .and_then(|bytes| parse_monitor_name_from_edid(bytes))
                                        .unwrap_or(clean_port);

                                    let refresh = edid_bytes
                                        .as_ref()
                                        .and_then(|bytes| parse_refresh_rate_from_edid(bytes));

                                    let serial = edid_bytes
                                        .as_ref()
                                        .and_then(|bytes| parse_serial_number_from_edid(bytes));

                                    let display_name = if let Some(ref s) = serial {
                                        format!("{} #{}", name, s)
                                    } else {
                                        name
                                    };

                                    if let Some(r) = refresh {
                                        displays.push(format!(
                                            "{} ({} @ {}Hz)",
                                            display_name,
                                            res,
                                            format_refresh_rate(r)
                                        ));
                                    } else {
                                        displays.push(format!("{} ({})", display_name, res));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Fallback to xrandr only if sysfs yielded no connected displays
        if displays.is_empty() {
            if let Ok(output) = std::process::Command::new("xrandr")
                .arg("--current")
                .output()
            {
                if let Ok(stdout) = String::from_utf8(output.stdout) {
                    displays = parse_xrandr_displays(&stdout);
                }
            }
        }

        displays
    }
}

/// Parse connected display information from `system_profiler SPDisplaysDataType` output.
///
/// Returns a list of strings in the form `"<Name> (<Resolution> @ <Rate>)"`.
#[cfg(target_os = "macos")]
pub fn parse_macos_displays(stdout: &str) -> Vec<String> {
    let mut displays = Vec::new();
    let mut current_name = None;
    let mut current_res = None;
    let mut in_displays = false;

    for line in stdout.lines() {
        let trimmed = line.trim();
        let indent = line.len() - line.trim_start().len();

        if trimmed.starts_with("Displays:") {
            in_displays = true;
            continue;
        }

        if in_displays {
            if indent < 8 && !trimmed.is_empty() && !trimmed.starts_with("Displays:") {
                in_displays = false;
                continue;
            }

            if trimmed.ends_with(':') && !trimmed.starts_with("UI Looks like:") {
                let name = trimmed.trim_end_matches(':').trim().to_string();
                current_name = Some(name);
            } else if trimmed.starts_with("Resolution:") {
                let res = trimmed.strip_prefix("Resolution:").unwrap_or("").trim();
                let cleaned = res.replace(" ", "");
                current_res = Some(cleaned);
            } else if trimmed.starts_with("UI Looks like:") {
                if let Some(res) = current_res.take() {
                    let name_str = current_name.take().unwrap_or_else(|| "Display".to_string());
                    if let Some(idx) = trimmed.find('@') {
                        let freq = trimmed[idx..].trim();
                        let freq_clean = freq.replace(" ", "").replace(".00", "");
                        displays.push(format!(
                            "{} ({} @ {})",
                            name_str,
                            res,
                            freq_clean.trim_start_matches('@')
                        ));
                    } else {
                        displays.push(format!("{} ({})", name_str, res));
                    }
                }
            }
        }
    }
    if let Some(res) = current_res {
        let name_str = current_name.unwrap_or_else(|| "Display".to_string());
        displays.push(format!("{} ({})", name_str, res));
    }
    displays
}

/// Parse connected display information from `xrandr --current` output.
///
/// Returns a list of strings in the form `"<Name> (<Resolution> @ <Rate>Hz)"`.
/// For each connected port, looks up the monitor name from EDID via
/// [`get_monitor_name_for_port`], falling back to the port name itself.
#[cfg(not(any(target_os = "macos", target_os = "windows")))]
pub fn parse_xrandr_displays(stdout: &str) -> Vec<String> {
    let mut displays = Vec::new();
    let mut current_display = None;
    let mut current_port = None;
    for line in stdout.lines() {
        let line = line.trim();
        if line.contains(" connected ") {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if let Some(&port) = parts.first() {
                current_port = Some(port.to_string());
            }
            for part in parts {
                if part.contains('x') && part.contains('+') {
                    if let Some(res) = part.split('+').next() {
                        current_display = Some(res.to_string());
                    }
                }
            }
        } else if line.contains('*') {
            if let Some(res) = current_display.take() {
                let port = current_port.take().unwrap_or_default();
                let name = get_monitor_name_for_port(&port).unwrap_or_else(|| port.clone());
                let parts: Vec<&str> = line.split_whitespace().collect();
                let mut added = false;
                for part in parts {
                    if part.contains('*') {
                        let freq = part.trim_end_matches(['*', '+']);
                        displays.push(format!("{} ({} @ {}Hz)", name, res, freq));
                        added = true;
                        break;
                    }
                }
                if !added {
                    displays.push(format!("{} ({})", name, res));
                }
            }
        }
    }
    displays
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── EDID helpers ─────────────────────────────────────────────────────────

    /// Build a 128-byte all-zero EDID with the 1080p60 DTD at offset 54.
    fn edid_1080p60() -> Vec<u8> {
        let mut edid = vec![0u8; 128];
        // Pixel clock 14850 (x 10 kHz = 148.5 MHz)
        edid[54] = 0x02;
        edid[55] = 0x3A;
        // H Active 1920, H Blanking 280
        edid[56] = 0x80;
        edid[57] = 0x18;
        edid[58] = 0x71;
        // V Active 1080, V Blanking 45
        edid[59] = 0x38;
        edid[60] = 0x2D;
        edid[61] = 0x40;
        edid
    }

    /// Inject a Monitor Name Descriptor (tag 0xFC) at EDID offset 72.
    fn inject_monitor_name(edid: &mut Vec<u8>, name: &[u8]) {
        edid[72] = 0x00;
        edid[73] = 0x00;
        edid[74] = 0x00;
        edid[75] = 0xFC;
        for (i, &b) in name.iter().enumerate().take(13) {
            edid[76 + i] = b;
        }
    }

    // ── parse_monitor_name_from_edid ──────────────────────────────────────────

    #[test]
    fn test_monitor_name_too_short_edid() {
        assert_eq!(parse_monitor_name_from_edid(&[0u8; 64]), None);
    }

    #[test]
    fn test_monitor_name_no_descriptor() {
        // 128-byte EDID with no 0xFC descriptor block -> None
        assert_eq!(parse_monitor_name_from_edid(&[0u8; 128]), None);
    }

    #[test]
    fn test_monitor_name_at_offset_72() {
        let mut edid = vec![0u8; 128];
        inject_monitor_name(&mut edid, b"DELL S3422DW\n");
        assert_eq!(
            parse_monitor_name_from_edid(&edid),
            Some("DELL S3422DW".to_string())
        );
    }

    #[test]
    fn test_monitor_name_at_offset_54() {
        let mut edid = vec![0u8; 128];
        edid[54] = 0x00;
        edid[55] = 0x00;
        edid[56] = 0x00;
        edid[57] = 0xFC;
        let name = b"LG 27UK850\n  ";
        for (i, &b) in name.iter().enumerate().take(13) {
            edid[58 + i] = b;
        }
        assert_eq!(
            parse_monitor_name_from_edid(&edid),
            Some("LG 27UK850".to_string())
        );
    }

    // ── parse_refresh_rate_from_edid ──────────────────────────────────────────

    #[test]
    fn test_parse_refresh_rate_from_edid() {
        let edid = edid_1080p60();
        let refresh = parse_refresh_rate_from_edid(&edid);
        assert!(refresh.is_some());
        // 148,500,000 / ((1920 + 280) * (1080 + 45)) = 60 Hz
        assert_eq!(refresh.unwrap(), 60.0);
    }

    #[test]
    fn test_refresh_rate_too_short_edid() {
        assert_eq!(parse_refresh_rate_from_edid(&[0u8; 71]), None);
    }

    #[test]
    fn test_refresh_rate_zero_pixel_clock() {
        // All-zero bytes -> pixel clock == 0 -> None
        let edid = vec![0u8; 128];
        assert_eq!(parse_refresh_rate_from_edid(&edid), None);
    }

    #[test]
    fn test_refresh_rate_zero_totals() {
        // Non-zero pixel clock but all dimension bytes zero -> h_total == 0 -> None
        let mut edid = vec![0u8; 128];
        edid[54] = 0x01; // pixel clock byte != 0
                         // all active/blanking bytes remain 0
        assert_eq!(parse_refresh_rate_from_edid(&edid), None);
    }

    // ── format_refresh_rate ───────────────────────────────────────────────────

    #[test]
    fn test_format_refresh_rate() {
        assert_eq!(format_refresh_rate(60.0), "60");
        assert_eq!(format_refresh_rate(59.94), "59.94");
        assert_eq!(format_refresh_rate(143.971), "143.97");
        assert_eq!(format_refresh_rate(120.0), "120");
        assert_eq!(format_refresh_rate(240.0), "240");
    }

    // ── parse_serial_number_from_edid ─────────────────────────────────────────

    #[test]
    fn test_serial_too_short_edid() {
        assert_eq!(parse_serial_number_from_edid(&[0u8; 64]), None);
    }

    #[test]
    fn test_parse_serial_number_from_edid() {
        let mut edid = vec![0u8; 128];
        // 1. Fallback 32-bit numeric serial
        edid[12] = 0x78;
        edid[13] = 0x56;
        edid[14] = 0x34;
        edid[15] = 0x12; // 0x12345678 = 305419896
        assert_eq!(
            parse_serial_number_from_edid(&edid),
            Some("305419896".to_string())
        );

        // 2. ASCII Monitor Serial Number descriptor block (tag 0xFF) at offset 72
        edid[72] = 0x00;
        edid[73] = 0x00;
        edid[74] = 0x00;
        edid[75] = 0xFF; // ASCII Serial Number descriptor tag
        let serial_str = b"CN0123456789\n";
        for i in 0..serial_str.len() {
            edid[76 + i] = serial_str[i];
        }
        assert_eq!(
            parse_serial_number_from_edid(&edid),
            Some("CN0123456789".to_string())
        );
    }

    #[test]
    fn test_serial_numeric_zero_is_none() {
        // All-zero EDID -> serial_num == 0 -> None
        let edid = vec![0u8; 128];
        assert_eq!(parse_serial_number_from_edid(&edid), None);
    }

    #[test]
    fn test_serial_numeric_all_ff_is_none() {
        let mut edid = vec![0u8; 128];
        edid[12] = 0xFF;
        edid[13] = 0xFF;
        edid[14] = 0xFF;
        edid[15] = 0xFF;
        assert_eq!(parse_serial_number_from_edid(&edid), None);
    }

    #[test]
    fn test_serial_ascii_takes_precedence_over_numeric() {
        let mut edid = vec![0u8; 128];
        // Non-zero numeric serial
        edid[12] = 0x01;
        edid[13] = 0x02;
        edid[14] = 0x03;
        edid[15] = 0x04;
        // ASCII serial descriptor at offset 54
        edid[54] = 0x00;
        edid[55] = 0x00;
        edid[56] = 0x00;
        edid[57] = 0xFF;
        let serial = b"ASCIIWIN0001\n";
        for (i, &b) in serial.iter().enumerate().take(13) {
            edid[58 + i] = b;
        }
        // ASCII descriptor should win over the numeric value
        assert_eq!(
            parse_serial_number_from_edid(&edid),
            Some("ASCIIWIN0001".to_string())
        );
    }

    // ── parse_xrandr_displays ─────────────────────────────────────────────────

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    #[test]
    fn test_parse_xrandr_displays() {
        let sample = "Screen 0: minimum 320 x 200, current 2560 x 1440\n\
                      DP-1 connected primary 2560x1440+0+0\n\
                         2560x1440     143.97*+\n\
                         1920x1080     60.00\n";
        let parsed = parse_xrandr_displays(sample);
        assert_eq!(parsed, vec!["DP-1 (2560x1440 @ 143.97Hz)".to_string()]);
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    #[test]
    fn test_parse_xrandr_multiple_displays() {
        let sample = "Screen 0: minimum 320 x 200, current 3840 x 1080\n\
                      HDMI-1 connected 1920x1080+0+0\n\
                         1920x1080     60.00*+\n\
                      DP-1 connected 1920x1080+1920+0\n\
                         1920x1080    144.00*+\n";
        let parsed = parse_xrandr_displays(sample);
        assert_eq!(
            parsed,
            vec![
                "HDMI-1 (1920x1080 @ 60.00Hz)".to_string(),
                "DP-1 (1920x1080 @ 144.00Hz)".to_string(),
            ]
        );
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    #[test]
    fn test_parse_xrandr_no_connected_displays() {
        let sample = "Screen 0: minimum 320 x 200, current 0 x 0\n\
                      HDMI-1 disconnected\n\
                      DP-1 disconnected\n";
        assert_eq!(parse_xrandr_displays(sample), Vec::<String>::new());
    }

    // ── parse_macos_displays ──────────────────────────────────────────────────

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_macos_displays() {
        let sample = "Graphics/Displays:\n\n    Apple M2:\n\n      Chipset Model: Apple M2\n      Displays:\n        Color LCD:\n          Resolution: 3024 x 1964\n          UI Looks like: 1512 x 982 @ 60.00Hz\n";
        let parsed = parse_macos_displays(sample);
        assert_eq!(parsed, vec!["Color LCD (3024x1964 @ 60Hz)".to_string()]);
    }

    #[cfg(target_os = "macos")]
    #[test]
    fn test_parse_macos_no_frequency() {
        let sample = "Graphics/Displays:\n      Displays:\n        ASUS PA329C:\n          Resolution: 3840 x 2160\n";
        let parsed = parse_macos_displays(sample);
        assert_eq!(parsed, vec!["ASUS PA329C (3840x2160)".to_string()]);
    }
}
