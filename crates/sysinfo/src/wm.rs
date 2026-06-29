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
        // macOS uses Quartz Compositor / Quartz Window Manager — no choice
        return Some("Quartz Compositor".to_string());
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_wm_does_not_panic() {
        // Just verify it doesn't panic; actual result depends on the environment.
        let _ = detect_wm();
    }
}
