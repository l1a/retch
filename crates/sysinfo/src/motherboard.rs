// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Motherboard / system model detection.

pub(crate) fn detect_motherboard() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        let info = crate::macos_ffi::get_macos_platform_info();
        if let Some(formatted) = format_macos_motherboard(
            info.product_name.as_deref(),
            None,
            info.model.as_deref(),
            info.board_id.as_deref(),
        ) {
            return Some(formatted);
        }

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
        if let Some(name) = name_c {
            let mut size: usize = 0;
            // SAFETY: null oldp queries required buffer size for hw.model.
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
                // SAFETY: buf is `size` bytes long.
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
                            return Some(trimmed.to_string());
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
        None
    }

    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        let vendor = std::fs::read_to_string("/sys/class/dmi/id/board_vendor").ok();
        let name = std::fs::read_to_string("/sys/class/dmi/id/board_name").ok();
        let product = std::fs::read_to_string("/sys/class/dmi/id/product_name").ok();
        let version = std::fs::read_to_string("/sys/class/dmi/id/board_version")
            .or_else(|_| std::fs::read_to_string("/sys/class/dmi/id/product_version"))
            .ok();

        format_linux_motherboard(
            vendor.as_deref(),
            name.as_deref(),
            product.as_deref(),
            version.as_deref(),
        )
    }
}

/// Return `true` when a DMI string is a non-empty, non-placeholder value.
fn is_valid_dmi_field(s: &str) -> bool {
    let trimmed = s.trim();
    if trimmed.is_empty() {
        return false;
    }
    !matches!(
        trimmed.to_ascii_lowercase().as_str(),
        "default string"
            | "to be filled by o.e.m."
            | "system product name"
            | "system version"
            | "none"
            | "n/a"
            | "unknown"
            | "not specified"
            | "not applicable"
    )
}

/// Format Linux DMI motherboard/system identifiers into a human-readable string.
///
/// When `product_name` is a superset of `board_name` (e.g. `"ProArt PX13 HN7306EAC"` vs
/// `"HN7306EAC"`), prefers `product_name` so the laptop/system marketing name is preserved
/// alongside the board code, and appends `(board_version)` when present.
pub fn format_linux_motherboard(
    board_vendor: Option<&str>,
    board_name: Option<&str>,
    product_name: Option<&str>,
    board_version: Option<&str>,
) -> Option<String> {
    let vendor = board_vendor
        .map(str::trim)
        .filter(|s| is_valid_dmi_field(s));
    let board = board_name.map(str::trim).filter(|s| is_valid_dmi_field(s));
    let product = product_name
        .map(str::trim)
        .filter(|s| is_valid_dmi_field(s));
    let version = board_version
        .map(str::trim)
        .filter(|s| is_valid_dmi_field(s));

    let model = match (board, product) {
        (Some(b), Some(p)) if p.to_ascii_lowercase().contains(&b.to_ascii_lowercase()) => Some(p),
        (Some(b), _) => Some(b),
        (None, Some(p)) => Some(p),
        (None, None) => None,
    };

    let base = match (vendor, model) {
        (Some(v), Some(m)) => {
            if m.to_ascii_lowercase().starts_with(&v.to_ascii_lowercase()) {
                m.to_string()
            } else {
                format!("{v} {m}")
            }
        }
        (Some(v), None) => v.to_string(),
        (None, Some(m)) => m.to_string(),
        (None, None) => return None,
    };

    Some(match version {
        Some(ver) => format!("{base} ({ver})"),
        None => base,
    })
}

/// Formats macOS host/board properties from `IODeviceTree:/` and `IODeviceTree:/product`
/// into a human-readable string combining marketing description, model identifier, and
/// board target subtype (e.g. `"MacBook Pro (14-inch, Nov 2023) (Mac15,6 / J514sAP)"`).
#[cfg(any(target_os = "macos", test))]
pub fn format_macos_motherboard(
    product_description: Option<&str>,
    product_name: Option<&str>,
    model: Option<&str>,
    target_sub_type: Option<&str>,
) -> Option<String> {
    let marketing = product_description
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .or_else(|| product_name.map(str::trim).filter(|s| !s.is_empty()));

    let model = model.map(str::trim).filter(|s| !s.is_empty());
    let board = target_sub_type.map(str::trim).filter(|s| !s.is_empty());

    let id = match (model, board) {
        (Some(m), Some(b)) if m != b => Some(format!("{} / {}", m, b)),
        (Some(m), _) => Some(m.to_string()),
        (None, Some(b)) => Some(b.to_string()),
        (None, None) => None,
    };

    match (marketing, id) {
        (Some(mkt), Some(id_str)) if mkt != id_str => Some(format!("{} ({})", mkt, id_str)),
        (Some(mkt), _) => Some(mkt.to_string()),
        (None, Some(id_str)) => Some(id_str),
        (None, None) => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_macos_motherboard_full_apple_silicon() {
        assert_eq!(
            format_macos_motherboard(
                Some("MacBook Pro (14-inch, Nov 2023)"),
                Some("MacBook Pro"),
                Some("Mac15,6"),
                Some("J514sAP"),
            ),
            Some("MacBook Pro (14-inch, Nov 2023) (Mac15,6 / J514sAP)".to_string())
        );
    }

    #[test]
    fn test_format_macos_motherboard_partial_fallbacks() {
        assert_eq!(
            format_macos_motherboard(None, Some("MacBook Air"), Some("Mac14,2"), None),
            Some("MacBook Air (Mac14,2)".to_string())
        );
        assert_eq!(
            format_macos_motherboard(None, None, Some("MacBookPro18,3"), None),
            Some("MacBookPro18,3".to_string())
        );
        assert_eq!(
            format_macos_motherboard(Some("Mac mini"), None, None, Some("J473AP")),
            Some("Mac mini (J473AP)".to_string())
        );
        assert_eq!(format_macos_motherboard(None, None, None, None), None);
    }

    #[test]
    fn test_format_linux_motherboard() {
        assert_eq!(
            format_linux_motherboard(
                Some("ASUSTeK COMPUTER INC.\n"),
                Some("HN7306EAC\n"),
                Some("ProArt PX13 HN7306EAC\n"),
                Some("1.0\n"),
            ),
            Some("ASUSTeK COMPUTER INC. ProArt PX13 HN7306EAC (1.0)".to_string())
        );
        assert_eq!(
            format_linux_motherboard(
                Some("Micro-Star International Co., Ltd."),
                Some("MAG B650 TOMAHAWK WIFI"),
                Some("System Product Name"),
                Some("Default string"),
            ),
            Some("Micro-Star International Co., Ltd. MAG B650 TOMAHAWK WIFI".to_string())
        );
        assert_eq!(format_linux_motherboard(None, None, None, None), None);
    }
}
