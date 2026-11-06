// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Window manager detection.

/// Returns the active window manager name, or `None` if it cannot be determined.
///
/// Detection order:
/// 1. `$WINDOW_MANAGER` env var (user-set override)
/// 2. Wayland compositors: check `$WAYLAND_DISPLAY` and `$XDG_SESSION_TYPE=wayland`,
///    then probe well-known compositor process names.
/// 3. X11: scan running processes for known WM names.
/// 4. `wmctrl -m` (X11 only, may not be installed).
pub fn detect_wm() -> Option<String> {
    // Explicit override
    if let Ok(wm) = std::env::var("WINDOW_MANAGER") {
        let wm = wm.trim().to_string();
        if !wm.is_empty() {
            return Some(wm);
        }
    }

    #[cfg(target_os = "linux")]
    {
        let is_wayland = std::env::var("WAYLAND_DISPLAY").is_ok()
            || std::env::var("XDG_SESSION_TYPE")
                .map(|v| v.to_lowercase() == "wayland")
                .unwrap_or(false);

        if is_wayland {
            if let Some(wm) = probe_wayland_compositor() {
                return Some(wm);
            }
        }

        // X11 process scan (also catches Wayland compositors running XWayland)
        if let Some(wm) = probe_wm_process() {
            return Some(wm);
        }

        // wmctrl fallback (X11 only)
        if let Ok(output) = std::process::Command::new("wmctrl").arg("-m").output() {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                for line in stdout.lines() {
                    if let Some(rest) = line.trim().strip_prefix("Name:") {
                        let name = rest.trim();
                        if !name.is_empty() && name != "N/A" {
                            return Some(name.to_string());
                        }
                    }
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        let sky_ver = std::fs::read_to_string(
            "/System/Library/PrivateFrameworks/SkyLight.framework/Resources/Info.plist",
        )
        .ok()
        .and_then(|xml| parse_plist_bundle_version(&xml));
        return Some(format_macos_wm(sky_ver.as_deref(), None));
    }

    #[cfg(target_os = "windows")]
    {
        return Some("Desktop Window Manager".to_string());
    }

    #[allow(unreachable_code)]
    None
}

#[cfg(target_os = "linux")]
fn probe_wayland_compositor() -> Option<String> {
    // Ordered by prevalence
    const COMPOSITORS: &[(&str, &str)] = &[
        ("sway", "Sway"),
        ("hyprland", "Hyprland"),
        ("kwin_wayland", "KWin"),
        ("mutter", "Mutter"),
        ("wayfire", "Wayfire"),
        ("river", "River"),
        ("niri", "Niri"),
        ("umbriel", "Umbriel"),
        ("cosmic-comp", "COSMIC"),
        ("mango", "Mango"),
        ("labwc", "labwc"),
        ("weston", "Weston"),
        ("cage", "Cage"),
        ("gamescope", "gamescope"),
        ("mir", "Mir"),
    ];
    probe_from_process_list(COMPOSITORS)
}

#[cfg(target_os = "linux")]
fn probe_wm_process() -> Option<String> {
    const WMS: &[(&str, &str)] = &[
        ("openbox", "Openbox"),
        ("i3", "i3"),
        ("bspwm", "bspwm"),
        ("xmonad", "XMonad"),
        ("awesome", "Awesome"),
        ("dwm", "dwm"),
        ("fluxbox", "Fluxbox"),
        ("icewm", "IceWM"),
        ("jwm", "JWM"),
        ("kwin_x11", "KWin"),
        ("mutter", "Mutter"),
        ("marco", "Marco"),
        ("xfwm4", "Xfwm4"),
        ("compiz", "Compiz"),
        ("metacity", "Metacity"),
        ("enlightenment", "Enlightenment"),
        ("herbstluftwm", "herbstluftwm"),
        ("qtile", "Qtile"),
        ("spectrwm", "spectrwm"),
        ("cwm", "cwm"),
        ("2bwm", "2bwm"),
        ("leftwm", "LeftWM"),
        ("wmderland", "wmderland"),
        ("penrose", "Penrose"),
    ];
    probe_from_process_list(WMS)
}

#[cfg(target_os = "linux")]
fn probe_from_process_list(candidates: &[(&str, &str)]) -> Option<String> {
    let Ok(entries) = std::fs::read_dir("/proc") else {
        return None;
    };
    for entry in entries.filter_map(|e| e.ok()) {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }
        let comm_path = path.join("comm");
        let Ok(comm) = std::fs::read_to_string(&comm_path) else {
            continue;
        };
        let comm = comm.trim().to_lowercase();
        for (proc_name, display_name) in candidates {
            if comm == *proc_name || comm.starts_with(proc_name) {
                return Some(display_name.to_string());
            }
        }
    }
    None
}

/// Extracts `CFBundleShortVersionString` (falling back to `CFBundleVersion`) from an XML
/// `Info.plist`.
#[cfg(any(target_os = "macos", test))]
pub fn parse_plist_bundle_version(xml: &str) -> Option<String> {
    parse_plist_key_string(xml, "CFBundleShortVersionString")
        .or_else(|| parse_plist_key_string(xml, "CFBundleVersion"))
}

/// Extracts the `<string>...</string>` value immediately following `<key>{key}</key>` in an
/// XML plist.
#[cfg(any(target_os = "macos", test))]
pub fn parse_plist_key_string(xml: &str, key: &str) -> Option<String> {
    let needle = format!("<key>{}</key>", key);
    let idx = xml.find(&needle)?;
    let after = &xml[idx + needle.len()..];
    let s_start = after.find("<string>")?;
    if let Some(next_key) = after.find("<key>") {
        if next_key < s_start {
            return None;
        }
    }
    let val_after = &after[s_start + "<string>".len()..];
    let s_end = val_after.find("</string>")?;
    let val = val_after[..s_end].trim();
    (!val.is_empty()).then(|| val.to_string())
}

/// Formats the macOS window manager string with optional SkyLight compositor version and
/// optional third-party tiling/window manager plugin (e.g. `"Quartz Compositor 1.600.0 (with Rectangle 2.0.4)"`).
#[cfg(any(target_os = "macos", test))]
pub fn format_macos_wm(sky_version: Option<&str>, plugin: Option<&str>) -> String {
    let base = match sky_version.map(str::trim).filter(|s| !s.is_empty()) {
        Some(v) => format!("Quartz Compositor {}", v),
        None => "Quartz Compositor".to_string(),
    };
    match plugin.map(str::trim).filter(|s| !s.is_empty()) {
        Some(p) => format!("{} (with {})", base, p),
        None => base,
    }
}

/// Enriches the base macOS WM string with any running third-party window/tiling manager
/// (`Rectangle`, `AeroSpace`, `yabai`, `Amethyst`, `Loop`, `Magnet`, `Swish`,
/// `BetterTouchTool`) and its bundle version when present.
#[cfg(target_os = "macos")]
pub fn enrich_macos_wm(base_wm: String, sys: &sysinfo::System) -> String {
    if base_wm.contains("(with ") {
        return base_wm;
    }
    const PLUGINS: &[(&str, &str)] = &[
        ("rectangle", "Rectangle"),
        ("aerospace", "AeroSpace"),
        ("yabai", "yabai"),
        ("amethyst", "Amethyst"),
        ("loop", "Loop"),
        ("magnet", "Magnet"),
        ("swish", "Swish"),
        ("bettertouchtool", "BetterTouchTool"),
    ];

    for (pid, proc_info) in sys.processes() {
        let name = proc_info.name().to_string_lossy().to_lowercase();
        let name_stem = name.strip_suffix(".app").unwrap_or(&name);
        for &(needle, display_name) in PLUGINS {
            if name_stem == needle {
                let exe_path = proc_info
                    .exe()
                    .and_then(|p| p.to_str().map(ToString::to_string))
                    .or_else(|| crate::macos_ffi::get_proc_pidpath(pid.as_u32() as i32));
                let ver = exe_path
                    .as_deref()
                    .and_then(app_bundle_info_plist_path)
                    .and_then(|plist| std::fs::read_to_string(plist).ok())
                    .and_then(|xml| parse_plist_bundle_version(&xml));
                let plugin_str = match ver {
                    Some(v) => format!("{} {}", display_name, v),
                    None => display_name.to_string(),
                };
                return format!("{} (with {})", base_wm, plugin_str);
            }
        }
    }
    base_wm
}

/// Given a binary path inside a macOS `.app` bundle (e.g.
/// `"/Applications/Rectangle.app/Contents/MacOS/Rectangle"`), returns the outermost
/// `.app/Contents/Info.plist` path.
#[cfg(any(target_os = "macos", test))]
pub fn app_bundle_info_plist_path(exe_path: &str) -> Option<String> {
    let idx = exe_path.find(".app/")?;
    let bundle_root = &exe_path[..idx + 4];
    Some(format!("{}/Contents/Info.plist", bundle_root))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_wm_does_not_panic() {
        // Just verify it doesn't panic; actual result depends on the environment.
        let _ = detect_wm();
    }

    #[test]
    fn test_macos_wm_plist_and_formatting() {
        let xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>SkyLight</string>
    <key>CFBundleShortVersionString</key>
    <string>1.600.0</string>
</dict>
</plist>"#;
        let ver = parse_plist_bundle_version(xml);
        assert_eq!(ver.as_deref(), Some("1.600.0"));
        assert_eq!(
            format_macos_wm(ver.as_deref(), Some("Rectangle 2.0.4")),
            "Quartz Compositor 1.600.0 (with Rectangle 2.0.4)"
        );
        assert_eq!(
            format_macos_wm(ver.as_deref(), None),
            "Quartz Compositor 1.600.0"
        );
        assert_eq!(format_macos_wm(None, None), "Quartz Compositor");
        assert_eq!(
            app_bundle_info_plist_path("/Applications/Rectangle.app/Contents/MacOS/Rectangle")
                .as_deref(),
            Some("/Applications/Rectangle.app/Contents/Info.plist")
        );
    }
}
