// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! UI theme, icon, cursor, and font detection.

fn parse_ini_key(content: &str, key: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.starts_with(';') {
            continue;
        }
        if let Some(pos) = line.find('=') {
            let k = line[..pos].trim();
            if k == key {
                let v = line[pos + 1..].trim();
                let v = if (v.starts_with('"') && v.ends_with('"'))
                    || (v.starts_with('\'') && v.ends_with('\''))
                {
                    if v.len() >= 2 {
                        v[1..v.len() - 1].to_string()
                    } else {
                        v.to_string()
                    }
                } else {
                    v.to_string()
                };
                if !v.is_empty() {
                    return Some(v);
                }
            }
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn get_gtk_setting(key: &str) -> Option<String> {
    let home = dirs::home_dir()?;
    let paths = [
        home.join(".config/gtk-4.0/settings.ini"),
        home.join(".config/gtk-3.0/settings.ini"),
        home.join(".config/gtk-2.0/settings.ini"),
        home.join(".gtkrc-2.0"),
    ];
    for path in &paths {
        if path.exists() {
            if let Ok(contents) = std::fs::read_to_string(path) {
                if let Some(val) = parse_ini_key(&contents, key) {
                    return Some(val);
                }
            }
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn query_gsettings(schema: &str, key: &str) -> Option<String> {
    let output = std::process::Command::new("gsettings")
        .args(["get", schema, key])
        .output()
        .ok()?;
    if output.status.success() {
        let val = String::from_utf8_lossy(&output.stdout).trim().to_string();
        let val = val.trim_matches('\'').trim_matches('"').to_string();
        if !val.is_empty() && val != "''" && val != "\"\"" {
            return Some(val);
        }
    }
    None
}

#[cfg(target_os = "linux")]
fn get_kde_setting(key: &str) -> Option<String> {
    let home = dirs::home_dir()?;
    let path = home.join(".config/kdeglobals");
    if path.exists() {
        if let Ok(contents) = std::fs::read_to_string(path) {
            return parse_ini_key(&contents, key);
        }
    }
    None
}

pub(crate) fn get_default_monospace_font() -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        if let Ok(output) = std::process::Command::new("fc-match")
            .arg("monospace")
            .output()
        {
            if output.status.success() {
                let s = String::from_utf8_lossy(&output.stdout);
                if let Some(start) = s.find('"') {
                    if let Some(end) = s[start + 1..].find('"') {
                        return Some(s[start + 1..start + 1 + end].to_string());
                    }
                }
            }
        }
        return None;
    }

    #[cfg(target_os = "macos")]
    {
        return Some("SF Mono".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        return Some("Consolas".to_string());
    }

    #[allow(unreachable_code)]
    None
}

#[cfg(target_os = "linux")]
pub(crate) fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    let gtk_theme = get_gtk_setting("gtk-theme-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "gtk-theme"));
    let gtk_icons = get_gtk_setting("gtk-icon-theme-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "icon-theme"));
    let gtk_cursor = get_gtk_setting("gtk-cursor-theme-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "cursor-theme"));
    let gtk_font = get_gtk_setting("gtk-font-name")
        .or_else(|| query_gsettings("org.gnome.desktop.interface", "font-name"));

    let qt_theme = get_kde_setting("widgetStyle").or_else(|| get_kde_setting("ColorScheme"));
    let qt_icons = get_kde_setting("iconTheme");
    let qt_cursor = {
        let home = dirs::home_dir();
        home.and_then(|h| {
            let path = h.join(".config/kcminputrc");
            if path.exists() {
                std::fs::read_to_string(path)
                    .ok()
                    .and_then(|contents| parse_ini_key(&contents, "theme"))
            } else {
                None
            }
        })
    };
    let qt_font = get_kde_setting("font").map(|f| {
        let parts: Vec<&str> = f.split(',').collect();
        if parts.len() >= 2 {
            let name = parts[0].trim();
            let size = parts[1].trim();
            format!("{} ({}pt)", name, size)
        } else {
            f
        }
    });

    let de = std::env::var("XDG_CURRENT_DESKTOP")
        .or_else(|_| std::env::var("DESKTOP_SESSION"))
        .unwrap_or_default()
        .to_lowercase();
    let is_kde = de.contains("kde") || de.contains("plasma");

    let theme = if is_kde {
        match (qt_theme, gtk_theme) {
            (Some(qt), Some(gt)) => Some(format!("{} [Qt], {} [GTK]", qt, gt)),
            (Some(qt), None) => Some(format!("{} [Qt]", qt)),
            (None, Some(gt)) => Some(format!("{} [GTK]", gt)),
            (None, None) => None,
        }
    } else {
        match (gtk_theme, qt_theme) {
            (Some(gt), Some(qt)) => Some(format!("{} [GTK], {} [Qt]", gt, qt)),
            (Some(gt), None) => Some(format!("{} [GTK]", gt)),
            (None, Some(qt)) => Some(format!("{} [Qt]", qt)),
            (None, None) => None,
        }
    };

    let icons = if is_kde {
        match (qt_icons, gtk_icons) {
            (Some(qi), Some(gi)) => Some(format!("{} [Qt], {} [GTK]", qi, gi)),
            (Some(qi), None) => Some(format!("{} [Qt]", qi)),
            (None, Some(gi)) => Some(format!("{} [GTK]", gi)),
            (None, None) => None,
        }
    } else {
        match (gtk_icons, qt_icons) {
            (Some(gi), Some(qi)) => Some(format!("{} [GTK], {} [Qt]", gi, qi)),
            (Some(gi), None) => Some(format!("{} [GTK]", gi)),
            (None, Some(qi)) => Some(format!("{} [Qt]", qi)),
            (None, None) => None,
        }
    };

    let cursor = if is_kde {
        match (qt_cursor, gtk_cursor) {
            (Some(qc), Some(gc)) => Some(format!("{} [Qt], {} [GTK]", qc, gc)),
            (Some(qc), None) => Some(format!("{} [Qt]", qc)),
            (None, Some(gc)) => Some(format!("{} [GTK]", gc)),
            (None, None) => None,
        }
    } else {
        match (gtk_cursor, qt_cursor) {
            (Some(gc), Some(qc)) => Some(format!("{} [GTK], {} [Qt]", gc, qc)),
            (Some(gc), None) => Some(format!("{} [GTK]", gc)),
            (None, Some(qc)) => Some(format!("{} [Qt]", qc)),
            (None, None) => None,
        }
    };

    let font = if is_kde {
        match (qt_font, gtk_font) {
            (Some(qf), Some(gf)) => Some(format!("{} [Qt], {} [GTK]", qf, gf)),
            (Some(qf), None) => Some(format!("{} [Qt]", qf)),
            (None, Some(gf)) => Some(format!("{} [GTK]", gf)),
            (None, None) => None,
        }
    } else {
        match (gtk_font, qt_font) {
            (Some(gf), Some(qf)) => Some(format!("{} [GTK], {} [Qt]", gf, qf)),
            (Some(gf), None) => Some(format!("{} [GTK]", gf)),
            (None, Some(qf)) => Some(format!("{} [Qt]", qf)),
            (None, None) => None,
        }
    };

    (theme, icons, cursor, font)
}

#[cfg(target_os = "macos")]
pub(crate) fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    let interface_style = std::process::Command::new("defaults")
        .args(["read", "-g", "AppleInterfaceStyle"])
        .output()
        .ok()
        .and_then(|o| {
            if o.status.success() {
                Some(String::from_utf8_lossy(&o.stdout).trim().to_string())
            } else {
                None
            }
        });

    let theme = match interface_style {
        Some(style) => Some(format!("Aqua ({})", style)),
        None => Some("Aqua (Light)".to_string()),
    };

    (theme, None, None, Some("San Francisco".to_string()))
}

#[cfg(target_os = "windows")]
pub(crate) fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    use crate::win_reg;
    let theme = {
        let apps_light = win_reg::get_reg_u32(
            win_reg::HKEY_CURRENT_USER,
            "Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
            "AppsUseLightTheme",
        );

        let apps_dark = apps_light.map(|val| val == 0);

        match apps_dark {
            Some(true) => Some("Dark".to_string()),
            Some(false) => Some("Light".to_string()),
            None => {
                let output = std::process::Command::new("reg")
                    .args([
                        "query",
                        r"HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
                        "/v",
                        "AppsUseLightTheme",
                    ])
                    .output()
                    .ok();

                let cmd_dark = output.and_then(|o| {
                    if o.status.success() {
                        let s = String::from_utf8_lossy(&o.stdout);
                        if s.contains("0x0") {
                            Some(true)
                        } else if s.contains("0x1") {
                            Some(false)
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                });

                match cmd_dark {
                    Some(true) => Some("Dark".to_string()),
                    Some(false) => Some("Light".to_string()),
                    None => Some("Unknown".to_string()),
                }
            }
        }
    };

    (theme, None, None, Some("Segoe UI".to_string()))
}

#[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
pub(crate) fn detect_ui_theme_and_fonts() -> (
    Option<String>,
    Option<String>,
    Option<String>,
    Option<String>,
) {
    (None, None, None, None)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_ini_key() {
        let ini = "[Settings]\ngtk-theme-name=Adwaita-dark\ngtk-icon-theme-name=Papirus\n";
        assert_eq!(
            parse_ini_key(ini, "gtk-theme-name"),
            Some("Adwaita-dark".to_string())
        );
        assert_eq!(
            parse_ini_key(ini, "gtk-icon-theme-name"),
            Some("Papirus".to_string())
        );
        assert_eq!(parse_ini_key(ini, "missing-key"), None);

        // Quoted values
        let ini_quoted = "font=\"DejaVu Sans 11\"\ncursor='Adwaita'\n";
        assert_eq!(
            parse_ini_key(ini_quoted, "font"),
            Some("DejaVu Sans 11".to_string())
        );
        assert_eq!(
            parse_ini_key(ini_quoted, "cursor"),
            Some("Adwaita".to_string())
        );

        // Comments are skipped
        let ini_comments = "# this is a comment\n; also a comment\nkey=value\n";
        assert_eq!(parse_ini_key(ini_comments, "key"), Some("value".to_string()));
        assert_eq!(parse_ini_key(ini_comments, "#"), None);
    }
}
