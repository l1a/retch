// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Motherboard / system model detection.

pub(crate) fn detect_motherboard() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        extern "C" {
            fn sysctlbyname(
                name: *const i8,
                oldp: *mut std::ffi::c_void,
                oldlenp: *mut usize,
                newp: *mut std::ffi::c_void,
                newlen: usize,
            ) -> i32;
        }

        let name_c = std::ffi::CString::new("hw.model").ok();
        let mut model_str = None;

        if let Some(name) = name_c {
            let mut size: usize = 0;
            unsafe {
                sysctlbyname(
                    name.as_ptr(),
                    std::ptr::null_mut(),
                    &mut size,
                    std::ptr::null_mut(),
                    0,
                );
            }
            if size > 0 {
                let mut buf = vec![0u8; size];
                let res = unsafe {
                    sysctlbyname(
                        name.as_ptr(),
                        buf.as_mut_ptr() as *mut std::ffi::c_void,
                        &mut size,
                        std::ptr::null_mut(),
                        0,
                    )
                };
                if res == 0 {
                    if let Some(pos) = buf.iter().position(|&x| x == 0) {
                        buf.truncate(pos);
                    }
                    if let Ok(model) = String::from_utf8(buf) {
                        let trimmed = model.trim();
                        if !trimmed.is_empty() {
                            model_str = Some(trimmed.to_string());
                        }
                    }
                }
            }
        }

        if model_str.is_some() {
            return model_str;
        }

        if let Ok(output) = std::process::Command::new("sysctl")
            .args(["-n", "hw.model"])
            .output()
        {
            if let Ok(model) = String::from_utf8(output.stdout) {
                let trimmed = model.trim();
                if !trimmed.is_empty() {
                    return Some(trimmed.to_string());
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
            "BaseBoardManufacturer",
        )
        .unwrap_or_default();
        let product = win_reg::get_reg_string(
            win_reg::HKEY_LOCAL_MACHINE,
            "HARDWARE\\DESCRIPTION\\System\\BIOS",
            "BaseBoardProduct",
        )
        .unwrap_or_default();

        let manufacturer = manufacturer.trim();
        let product = product.trim();

        if !manufacturer.is_empty() && !product.is_empty() {
            return Some(format!("{} {}", manufacturer, product));
        } else if !product.is_empty() {
            return Some(product.to_string());
        } else if !manufacturer.is_empty() {
            return Some(manufacturer.to_string());
        }

        if let Ok(output) = std::process::Command::new("wmic")
            .args(["baseboard", "get", "manufacturer,product", "/value"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let mut manufacturer = String::new();
                let mut product = String::new();
                for line in stdout.lines() {
                    let line = line.trim();
                    if line.starts_with("Manufacturer=") {
                        manufacturer = line
                            .strip_prefix("Manufacturer=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    } else if line.starts_with("Product=") {
                        product = line
                            .strip_prefix("Product=")
                            .unwrap_or("")
                            .trim()
                            .to_string();
                    }
                }
                if !manufacturer.is_empty() && !product.is_empty() {
                    return Some(format!("{} {}", manufacturer, product));
                } else if !product.is_empty() {
                    return Some(product);
                } else if !manufacturer.is_empty() {
                    return Some(manufacturer);
                }
            }
        }
        None
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let vendor = std::fs::read_to_string("/sys/class/dmi/id/board_vendor")
            .map(|s| s.trim().to_string())
            .ok();
        let name = std::fs::read_to_string("/sys/class/dmi/id/board_name")
            .map(|s| s.trim().to_string())
            .ok();

        match (vendor, name) {
            (Some(v), Some(n)) if !v.is_empty() && !n.is_empty() => {
                if n.starts_with(&v) {
                    Some(n)
                } else {
                    Some(format!("{} {}", v, n))
                }
            }
            (Some(v), _) if !v.is_empty() => Some(v),
            (_, Some(n)) if !n.is_empty() => Some(n),
            _ => None,
        }
    }
}
