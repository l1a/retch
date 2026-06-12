// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! BIOS / firmware version detection.

pub(crate) fn detect_bios() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("system_profiler")
            .arg("SPHardwareDataType")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("System Firmware Version:")
                        || line.starts_with("Boot ROM Version:")
                    {
                        if let Some(val) = line.split(':').nth(1) {
                            return Some(val.trim().to_string());
                        }
                    }
                }
            }
        }
        None
    }

    #[cfg(target_os = "windows")]
    {
        use crate::win_reg;
        let manufacturer = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BIOSVendor",
        )
        .unwrap_or_default();
        let version = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BIOSVersion",
        )
        .unwrap_or_default();
        let raw_date = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BIOSReleaseDate",
        )
        .unwrap_or_default();

        let manufacturer = manufacturer.trim();
        let version = version.trim();
        let raw_date = raw_date.trim();

        let date = if raw_date.len() >= 8 {
            let year = &raw_date[0..4];
            let month = &raw_date[4..6];
            let day = &raw_date[6..8];
            format!("{}/{}/{}", month, day, year)
        } else {
            raw_date.to_string()
        };

        let mut parts = Vec::new();
        if !manufacturer.is_empty() {
            parts.push(manufacturer.to_string());
        }
        if !version.is_empty() {
            parts.push(version.to_string());
        }
        let mut res = parts.join(" ");
        if !date.is_empty() {
            if res.is_empty() {
                res = date;
            } else {
                res = format!("{} ({})", res, date);
            }
        }
        if !res.is_empty() {
            return Some(res);
        }
        None
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let vendor = std::fs::read_to_string("/sys/class/dmi/id/bios_vendor")
            .map(|s| s.trim().to_string())
            .ok();
        let version = std::fs::read_to_string("/sys/class/dmi/id/bios_version")
            .map(|s| s.trim().to_string())
            .ok();
        let date = std::fs::read_to_string("/sys/class/dmi/id/bios_date")
            .map(|s| s.trim().to_string())
            .ok();

        let mut parts = Vec::new();
        if let Some(v) = vendor {
            if !v.is_empty() {
                parts.push(v);
            }
        }
        if let Some(ver) = version {
            let mut ver_cleaned = ver;
            while ver_cleaned.contains(" )") {
                ver_cleaned = ver_cleaned.replace(" )", ")");
            }
            let ver_cleaned = ver_cleaned.trim().to_string();
            if !ver_cleaned.is_empty() {
                parts.push(ver_cleaned);
            }
        }
        let mut res = parts.join(" ");
        if let Some(d) = date {
            if !d.is_empty() {
                if res.is_empty() {
                    res = d;
                } else {
                    res = format!("{} ({})", res, d);
                }
            }
        }
        if !res.is_empty() {
            Some(res)
        } else {
            None
        }
    }
}
