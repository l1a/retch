// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! UI theme, icon, cursor, and font detection.

#[allow(dead_code)]
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
    let theme = match crate::macos_ffi::get_macos_appearance() {
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

#[allow(dead_code)]
pub(crate) fn decode_percent_encoded(s: &str) -> String {
    let mut bytes = Vec::with_capacity(s.len());
    let raw = s.as_bytes();
    let mut i = 0;
    while i < raw.len() {
        if raw[i] == b'%' && i + 2 < raw.len() {
            if let (Ok(h1), Ok(h2)) = (
                std::str::from_utf8(&raw[i + 1..i + 2]).map(|h| u8::from_str_radix(h, 16)),
                std::str::from_utf8(&raw[i + 2..i + 3]).map(|h| u8::from_str_radix(h, 16)),
            ) {
                if let (Ok(h1), Ok(h2)) = (h1, h2) {
                    bytes.push((h1 << 4) | h2);
                    i += 3;
                    continue;
                }
            }
        }
        bytes.push(raw[i]);
        i += 1;
    }
    String::from_utf8_lossy(&bytes).to_string()
}

#[allow(dead_code)]
pub(crate) fn clean_wallpaper_uri(uri: &str) -> Option<String> {
    let trimmed = uri.trim().trim_matches('\'').trim_matches('"').trim();
    if trimmed.is_empty() || trimmed == "''" || trimmed == "\"\"" {
        return None;
    }
    let without_file = if let Some(rest) = trimmed.strip_prefix("file://") {
        rest
    } else {
        trimmed
    };
    let decoded = decode_percent_encoded(without_file);
    let cleaned = decoded.trim().to_string();
    if cleaned.is_empty() {
        None
    } else {
        Some(cleaned)
    }
}

#[allow(dead_code)]
pub(crate) fn parse_kwin_theme(content: &str) -> Option<String> {
    let mut in_kdec = false;
    let mut theme = None;
    let mut library_name = None;

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('[') && line.ends_with(']') {
            let section = &line[1..line.len() - 1];
            in_kdec = section == "org.kde.kdecoration2" || section.contains("kdecoration");
            continue;
        }
        if in_kdec {
            if let Some(pos) = line.find('=') {
                let k = line[..pos].trim();
                let v = line[pos + 1..].trim().trim_matches('"').trim_matches('\'');
                if k == "theme" && !v.is_empty() {
                    theme = Some(v.to_string());
                } else if k == "library" || k == "libraryName" {
                    library_name = Some(v.to_string());
                }
            }
        }
    }

    let raw = theme.or(library_name)?;
    let mut cleaned = raw.as_str();
    for prefix in &[
        "__aurorae__svg__",
        "__aurorae__qml__",
        "svg__",
        "qml_",
        "org.kde.",
    ] {
        if let Some(rest) = cleaned.strip_prefix(prefix) {
            cleaned = rest;
        }
    }
    if cleaned.is_empty() {
        None
    } else {
        Some(cleaned.to_string())
    }
}

#[allow(dead_code)]
pub(crate) fn parse_xfwm4_theme(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.contains("name=\"theme\"") || line.contains("name=\"/general/theme\"") {
            if let Some(start) = line.find("value=\"") {
                let rest = &line[start + 7..];
                if let Some(end) = rest.find('"') {
                    let val = &rest[..end];
                    if !val.is_empty() {
                        return Some(val.to_string());
                    }
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_openbox_theme(content: &str) -> Option<String> {
    let mut in_theme = false;
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("<theme>") {
            in_theme = true;
        }
        if line.ends_with("</theme>") {
            in_theme = false;
        }
        if in_theme || line.contains("<theme>") {
            if let Some(start) = line.find("<name>") {
                let rest = &line[start + 6..];
                if let Some(end) = rest.find("</name>") {
                    let val = rest[..end].trim();
                    if !val.is_empty() {
                        return Some(val.to_string());
                    }
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_fluxbox_theme(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if let Some(rest) = line.strip_prefix("session.styleFile:") {
            let path_str = rest.trim();
            let path = std::path::Path::new(path_str);
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if !name.is_empty() {
                    return Some(name.to_string());
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_icewm_theme(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if let Some(rest) = line.strip_prefix("Theme=") {
            let val = rest.trim().trim_matches('"').trim_matches('\'');
            if let Some(idx) = val.find('/') {
                let theme_name = &val[..idx];
                if !theme_name.is_empty() {
                    return Some(theme_name.to_string());
                }
            } else if !val.is_empty() {
                return Some(val.to_string());
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_plasma_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("Image=") {
            let val = line.trim_start_matches("Image=").trim();
            if let Some(cleaned) = clean_wallpaper_uri(val) {
                return Some(cleaned);
            }
        } else if line.starts_with("usersWallpapers=") {
            let val = line.trim_start_matches("usersWallpapers=").trim();
            if let Some(first) = val.split(',').next() {
                if let Some(cleaned) = clean_wallpaper_uri(first) {
                    return Some(cleaned);
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_xfce_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if (line.contains("last-image") || line.contains("image-path")) && line.contains("value=") {
            if let Some(start) = line.find("value=\"") {
                let rest = &line[start + 7..];
                if let Some(end) = rest.find('"') {
                    let val = &rest[..end];
                    if let Some(cleaned) = clean_wallpaper_uri(val) {
                        return Some(cleaned);
                    }
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_hyprpaper_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') {
            continue;
        }
        if line.starts_with("wallpaper") {
            if let Some(pos) = line.find('=') {
                let rest = line[pos + 1..].trim();
                if let Some(idx) = rest.rfind(',') {
                    let path = rest[idx + 1..].trim();
                    if let Some(cleaned) = clean_wallpaper_uri(path) {
                        return Some(cleaned);
                    }
                }
            }
        } else if line.starts_with("preload") {
            if let Some(pos) = line.find('=') {
                let path = line[pos + 1..].trim();
                if let Some(cleaned) = clean_wallpaper_uri(path) {
                    return Some(cleaned);
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_sway_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') {
            continue;
        }
        if line.starts_with("output ") && line.contains(" bg ") {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if let Some(bg_idx) = parts.iter().position(|&p| p == "bg") {
                if bg_idx + 1 < parts.len() {
                    return clean_wallpaper_uri(parts[bg_idx + 1]);
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_feh_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("feh ") {
            if let Some(start) = line.find('\'') {
                if let Some(end) = line[start + 1..].rfind('\'') {
                    return clean_wallpaper_uri(&line[start + 1..start + 1 + end]);
                }
            }
            if let Some(start) = line.find('"') {
                if let Some(end) = line[start + 1..].rfind('"') {
                    return clean_wallpaper_uri(&line[start + 1..start + 1 + end]);
                }
            }
            let parts: Vec<&str> = line.split_whitespace().collect();
            if let Some(last) = parts.last() {
                if !last.starts_with('-') {
                    return clean_wallpaper_uri(last);
                }
            }
        }
    }
    None
}

#[allow(dead_code)]
pub(crate) fn parse_nitrogen_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("file=") {
            return clean_wallpaper_uri(line.trim_start_matches("file="));
        }
    }
    None
}

/// Deduplicates non-empty wallpaper paths while preserving first-seen order and joins them
/// with `", "`.
#[allow(dead_code)]
pub(crate) fn dedup_join_wallpapers(paths: impl IntoIterator<Item = String>) -> Option<String> {
    let mut unique: Vec<String> = Vec::new();
    for p in paths {
        if !p.is_empty() && !unique.contains(&p) {
            unique.push(p);
        }
    }
    if unique.is_empty() {
        None
    } else {
        Some(unique.join(", "))
    }
}

/// Returns the sorted list of connected DRM connector names (e.g. `["DP-1", "eDP-1"]`) inside
/// `drm_dir` (typically `/sys/class/drm`) by checking `<card>-<connector>/status == "connected"`.
#[allow(dead_code)]
pub(crate) fn connected_drm_outputs_in(drm_dir: &std::path::Path) -> Vec<String> {
    let Ok(entries) = std::fs::read_dir(drm_dir) else {
        return Vec::new();
    };
    let mut outputs: Vec<String> = Vec::new();
    for entry in entries.flatten() {
        let file_name = entry.file_name();
        let Some(name) = file_name.to_str() else {
            continue;
        };
        let Some(rest) = name.strip_prefix("card") else {
            continue;
        };
        let Some(dash_idx) = rest.find('-') else {
            continue;
        };
        if dash_idx == 0 || !rest[..dash_idx].bytes().all(|b| b.is_ascii_digit()) {
            continue;
        }
        let connector = &rest[dash_idx + 1..];
        if connector.is_empty() {
            continue;
        }
        let status_path = entry.path().join("status");
        if let Ok(status) = std::fs::read_to_string(status_path) {
            if status.trim() == "connected" {
                outputs.push(connector.to_string());
            }
        }
    }
    outputs.sort();
    outputs.dedup();
    outputs
}

#[cfg(target_os = "linux")]
fn connected_drm_outputs() -> Vec<String> {
    connected_drm_outputs_in(std::path::Path::new("/sys/class/drm"))
}

/// Parses Noctalia Shell's state file (`$XDG_STATE_HOME/noctalia/settings.toml`).
///
/// Prefers `[wallpaper.monitors.<output>].path` for outputs present in `connected_outputs`
/// (deduplicated in monitor order), falling back to `[wallpaper.last].path` and then
/// `[wallpaper.default].path` when no connected monitor matches.
#[allow(dead_code)]
pub(crate) fn parse_noctalia_wallpaper(
    content: &str,
    connected_outputs: &[String],
) -> Option<String> {
    #[derive(Clone, Copy, PartialEq, Eq)]
    enum Section<'a> {
        Other,
        Default,
        Last,
        Monitor(&'a str),
    }

    let mut section = Section::Other;
    let mut default_path: Option<String> = None;
    let mut last_path: Option<String> = None;
    let mut monitors: Vec<(String, String)> = Vec::new();

    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if let Some(header) = line.strip_prefix('[').and_then(|s| s.strip_suffix(']')) {
            let header = header.trim();
            if header == "wallpaper.default" {
                section = Section::Default;
            } else if header == "wallpaper.last" {
                section = Section::Last;
            } else if let Some(mon) = header.strip_prefix("wallpaper.monitors.") {
                let mon = mon.trim().trim_matches('"').trim_matches('\'');
                section = if mon.is_empty() {
                    Section::Other
                } else {
                    Section::Monitor(mon)
                };
            } else {
                section = Section::Other;
            }
            continue;
        }

        if section == Section::Other {
            continue;
        }

        if let Some(rest) = line.strip_prefix("path") {
            let rest = rest.trim_start();
            if let Some(val) = rest.strip_prefix('=') {
                if let Some(cleaned) = clean_wallpaper_uri(val.trim()) {
                    match section {
                        Section::Default => default_path = Some(cleaned),
                        Section::Last => last_path = Some(cleaned),
                        Section::Monitor(mon) => monitors.push((mon.to_string(), cleaned)),
                        Section::Other => {}
                    }
                }
            }
        }
    }

    if !connected_outputs.is_empty() {
        let active_paths: Vec<String> = monitors
            .into_iter()
            .filter(|(mon, _)| {
                connected_outputs
                    .iter()
                    .any(|c| c.eq_ignore_ascii_case(mon))
            })
            .map(|(_, path)| path)
            .collect();
        if let Some(joined) = dedup_join_wallpapers(active_paths) {
            return Some(joined);
        }
    }

    last_path.or(default_path)
}

/// Parses a single `swww` / `awww` per-output cache file.
///
/// `swww` v0.8+ writes NUL-delimited fields (`<filter>\0<path>`); older versions wrote
/// newline-separated text.
#[allow(dead_code)]
pub(crate) fn parse_swww_cache_bytes(bytes: &[u8]) -> Option<String> {
    for segment in bytes.split(|&b| b == 0 || b == b'\n').rev() {
        let Ok(s) = std::str::from_utf8(segment) else {
            continue;
        };
        let s = s.trim();
        if s.starts_with('/') || s.starts_with("file://") {
            if let Some(cleaned) = clean_wallpaper_uri(s) {
                return Some(cleaned);
            }
        }
    }
    None
}

/// Collects active wallpaper paths from an `swww` or `awww` cache directory, filtering to
/// `connected_outputs` when any file matches a connected output.
#[allow(dead_code)]
pub(crate) fn collect_swww_wallpapers_in(
    cache_dir: &std::path::Path,
    connected_outputs: &[String],
) -> Option<String> {
    let Ok(entries) = std::fs::read_dir(cache_dir) else {
        return None;
    };
    let mut files: Vec<(String, std::path::PathBuf)> = entries
        .flatten()
        .filter_map(|e| {
            let path = e.path();
            if !path.is_file() {
                return None;
            }
            let name = e.file_name().to_str()?.to_string();
            Some((name, path))
        })
        .collect();
    files.sort_by(|a, b| a.0.cmp(&b.0));

    let read_paths = |subset: &[(String, std::path::PathBuf)]| -> Vec<String> {
        subset
            .iter()
            .filter_map(|(_, path)| {
                let bytes = std::fs::read(path).ok()?;
                parse_swww_cache_bytes(&bytes)
            })
            .collect()
    };

    if !connected_outputs.is_empty() {
        let connected_subset: Vec<(String, std::path::PathBuf)> = files
            .iter()
            .filter(|(name, _)| {
                connected_outputs
                    .iter()
                    .any(|c| c.eq_ignore_ascii_case(name))
            })
            .cloned()
            .collect();
        if let Some(joined) = dedup_join_wallpapers(read_paths(&connected_subset)) {
            return Some(joined);
        }
    }

    dedup_join_wallpapers(read_paths(&files))
}

/// Extracts wallpaper paths from a NUL-separated `/proc/<pid>/cmdline` buffer for
/// `swaybg`, `wbg`, or `mpvpaper`.
#[allow(dead_code)]
pub(crate) fn parse_wallpaper_paths_from_cmdline(comm: &str, cmdline_bytes: &[u8]) -> Vec<String> {
    let args: Vec<&str> = cmdline_bytes
        .split(|&b| b == 0)
        .filter_map(|s| std::str::from_utf8(s).ok())
        .filter(|s| !s.is_empty())
        .collect();
    if args.len() < 2 {
        return Vec::new();
    }

    match comm {
        "swaybg" => {
            let mut paths = Vec::new();
            let mut i = 1;
            while i < args.len() {
                let arg = args[i];
                if (arg == "-i" || arg == "--image") && i + 1 < args.len() {
                    if let Some(p) = clean_wallpaper_uri(args[i + 1]) {
                        paths.push(p);
                    }
                    i += 2;
                    continue;
                } else if let Some(rest) = arg.strip_prefix("--image=") {
                    if let Some(p) = clean_wallpaper_uri(rest) {
                        paths.push(p);
                    }
                } else if let Some(rest) = arg.strip_prefix("-i") {
                    if !rest.is_empty() {
                        if let Some(p) = clean_wallpaper_uri(rest) {
                            paths.push(p);
                        }
                    }
                }
                i += 1;
            }
            paths
        }
        "wbg" | "mpvpaper" => {
            for &arg in args[1..].iter().rev() {
                if !arg.starts_with('-') {
                    return clean_wallpaper_uri(arg).into_iter().collect();
                }
            }
            Vec::new()
        }
        _ => Vec::new(),
    }
}

/// Extracts wallpaper path(s) from a NUL-separated `/proc/<pid>/cmdline` buffer for
/// `swaybg`, `wbg`, or `mpvpaper`.
#[allow(dead_code)]
pub(crate) fn parse_wallpaper_from_cmdline(comm: &str, cmdline_bytes: &[u8]) -> Option<String> {
    dedup_join_wallpapers(parse_wallpaper_paths_from_cmdline(comm, cmdline_bytes))
}

/// Joins wallpaper paths parsed from one or more `swaybg` / `wbg` / `mpvpaper` cmdline
/// buffers, preserving first-seen order. Multi-monitor setups often launch one daemon
/// process per output; each process must contribute.
#[allow(dead_code)]
pub(crate) fn collect_cmdline_wallpapers<'a>(
    entries: impl IntoIterator<Item = (&'a str, &'a [u8])>,
) -> Option<String> {
    let mut paths = Vec::new();
    for (comm, cmdline) in entries {
        paths.extend(parse_wallpaper_paths_from_cmdline(comm, cmdline));
    }
    dedup_join_wallpapers(paths)
}

/// Parses COSMIC's background configuration (`~/.config/cosmic/com.system76.CosmicBackground/v1/all`).
#[allow(dead_code)]
pub(crate) fn parse_cosmic_wallpaper(content: &str) -> Option<String> {
    if let Some(idx) = content.find("Path(") {
        let rest = &content[idx + 5..];
        if let Some(end) = rest.find(')') {
            return clean_wallpaper_uri(&rest[..end]);
        }
    }
    for line in content.lines() {
        let line = line.trim();
        if let Some(rest) = line.strip_prefix("source:") {
            let val = rest.trim().trim_end_matches(',');
            if let Some(inner) = val.strip_prefix("Path(").and_then(|s| s.strip_suffix(')')) {
                return clean_wallpaper_uri(inner);
            }
        }
    }
    None
}

/// Parses `wpaperd` TOML configuration (`config.toml` / `wallpaper.toml`).
///
/// For each connected output, uses a matching named section when present, otherwise
/// `[default]` (then `[any]`). Named sections for disconnected outputs are ignored:
/// `wpaperd` applies those fallbacks to unmatched displays, so joining leftover
/// per-output `path`s would report stale wallpapers on an undocked machine.
#[allow(dead_code)]
pub(crate) fn parse_wpaperd_wallpaper(
    content: &str,
    connected_outputs: &[String],
) -> Option<String> {
    let mut section = String::new();
    let mut default_path: Option<String> = None;
    let mut any_path: Option<String> = None;
    let mut output_paths: Vec<(String, String)> = Vec::new();

    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if let Some(h) = line.strip_prefix('[').and_then(|s| s.strip_suffix(']')) {
            section = h.trim().trim_matches('"').trim_matches('\'').to_string();
            continue;
        }
        if let Some(rest) = line.strip_prefix("path") {
            let rest = rest.trim_start();
            if let Some(val) = rest.strip_prefix('=') {
                if let Some(cleaned) = clean_wallpaper_uri(val.trim()) {
                    if section == "default" {
                        if default_path.is_none() {
                            default_path = Some(cleaned);
                        }
                    } else if section == "any" {
                        if any_path.is_none() {
                            any_path = Some(cleaned);
                        }
                    } else if !section.is_empty() {
                        output_paths.push((section.clone(), cleaned));
                    }
                }
            }
        }
    }

    let fallback_path = default_path.or(any_path);

    if !connected_outputs.is_empty() {
        let mut paths = Vec::new();
        for connected in connected_outputs {
            if let Some((_, path)) = output_paths
                .iter()
                .find(|(out, _)| connected.eq_ignore_ascii_case(out))
            {
                paths.push(path.clone());
            } else if let Some(ref fallback) = fallback_path {
                paths.push(fallback.clone());
            }
        }
        if let Some(joined) = dedup_join_wallpapers(paths) {
            return Some(joined);
        }
    }

    fallback_path
}

/// `wpaperd` 1.0 reads `config.toml`; pre-1.0 used `wallpaper.toml`. Prefer the 1.0
/// file so a leftover pre-1.0 config cannot win after an upgrade when both exist.
const WPAPERD_CONFIG_FILES: &[&str] = &["wpaperd/config.toml", "wpaperd/wallpaper.toml"];

/// Reads `wpaperd` config from `config_dir`, preferring `config.toml` over `wallpaper.toml`.
#[allow(dead_code)]
pub(crate) fn parse_wpaperd_from_config_dir(
    config_dir: &std::path::Path,
    connected_outputs: &[String],
) -> Option<String> {
    for name in WPAPERD_CONFIG_FILES {
        let path = config_dir.join(name);
        if let Ok(content) = std::fs::read_to_string(&path) {
            if let Some(wp) = parse_wpaperd_wallpaper(&content, connected_outputs) {
                return Some(wp);
            }
        }
    }
    None
}

/// Parses LXQt's `pcmanfm-qt` settings (`~/.config/pcmanfm-qt/lxqt/settings.conf`).
#[allow(dead_code)]
pub(crate) fn parse_lxqt_wallpaper(content: &str) -> Option<String> {
    parse_ini_key(content, "Wallpaper").and_then(|v| clean_wallpaper_uri(&v))
}

/// Parses LXDE's `pcmanfm` settings (`~/.config/pcmanfm/LXDE/desktop-items-0.conf`).
#[allow(dead_code)]
pub(crate) fn parse_lxde_wallpaper(content: &str) -> Option<String> {
    parse_ini_key(content, "wallpaper").and_then(|v| clean_wallpaper_uri(&v))
}

#[cfg(target_os = "linux")]
#[derive(Default)]
struct RunningWallpaperDaemons {
    noctalia: bool,
    swww: bool,
    awww: bool,
    hyprpaper: bool,
    wpaperd: bool,
    cmdline_wallpaper: Option<String>,
}

#[cfg(target_os = "linux")]
fn scan_proc_wallpaper_daemons() -> RunningWallpaperDaemons {
    let mut state = RunningWallpaperDaemons::default();
    let mut cmdline_paths = Vec::new();
    let Ok(entries) = std::fs::read_dir("/proc") else {
        return state;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        let Some(name) = path.file_name().and_then(|n| n.to_str()) else {
            continue;
        };
        if !name.bytes().all(|b| b.is_ascii_digit()) {
            continue;
        }
        let Ok(comm) = std::fs::read_to_string(path.join("comm")) else {
            continue;
        };
        let comm = comm.trim().to_lowercase();
        match comm.as_str() {
            c if c == "noctalia" || c.starts_with("noctalia") => state.noctalia = true,
            "swww-daemon" | "swww" => state.swww = true,
            "awww-daemon" | "awww" => state.awww = true,
            "hyprpaper" => state.hyprpaper = true,
            "wpaperd" => state.wpaperd = true,
            "swaybg" | "wbg" | "mpvpaper" => {
                if let Ok(cmdline) = std::fs::read(path.join("cmdline")) {
                    cmdline_paths.extend(parse_wallpaper_paths_from_cmdline(&comm, &cmdline));
                }
            }
            _ => {}
        }
    }
    state.cmdline_wallpaper = dedup_join_wallpapers(cmdline_paths);
    state
}

#[cfg(target_os = "linux")]
fn detect_gnome_wallpaper() -> Option<String> {
    let prefer_dark = query_gsettings("org.gnome.desktop.interface", "color-scheme")
        .map(|s| s.contains("prefer-dark"))
        .unwrap_or(false);
    let (primary, secondary) = if prefer_dark {
        ("picture-uri-dark", "picture-uri")
    } else {
        ("picture-uri", "picture-uri-dark")
    };
    query_gsettings("org.gnome.desktop.background", primary)
        .and_then(|u| clean_wallpaper_uri(&u))
        .filter(|s| !s.is_empty())
        .or_else(|| {
            query_gsettings("org.gnome.desktop.background", secondary)
                .and_then(|u| clean_wallpaper_uri(&u))
                .filter(|s| !s.is_empty())
        })
}

#[allow(dead_code)]
pub(crate) fn parse_windows_theme_name(theme_path: &str) -> Option<String> {
    let clean = theme_path.trim().trim_matches('"').trim_matches('\'');
    let last_segment = clean.rsplit(['/', '\\']).next()?;
    let stem = if let Some(idx) = last_segment.rfind('.') {
        &last_segment[..idx]
    } else {
        last_segment
    };
    if stem.is_empty() {
        return None;
    }
    match stem.to_lowercase().as_str() {
        "aero" => Some("Aero".to_string()),
        "dark" => Some("Dark".to_string()),
        "light" => Some("Light".to_string()),
        "custom" => Some("Custom".to_string()),
        "windows" => Some("Windows".to_string()),
        _ => Some(stem.to_string()),
    }
}

pub(crate) fn detect_wm_theme(wm: Option<&str>, desktop: Option<&str>) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let wm_name = wm.map(|w| w.to_lowercase()).unwrap_or_default();
        let de_name = desktop.map(|d| d.to_lowercase()).unwrap_or_default();
        let home = dirs::home_dir();

        // 1. KWin (KDE Plasma)
        if wm_name.contains("kwin") || de_name.contains("kde") || de_name.contains("plasma") {
            if let Some(ref h) = home {
                let kwinrc = h.join(".config/kwinrc");
                if let Ok(content) = std::fs::read_to_string(&kwinrc) {
                    if let Some(theme) = parse_kwin_theme(&content) {
                        return Some(theme);
                    }
                }
            }
            if let Some(kde_theme) =
                get_kde_setting("widgetStyle").or_else(|| get_kde_setting("ColorScheme"))
            {
                return Some(kde_theme);
            }
        }

        // 2. Mutter / GNOME / Budgie / Cinnamon
        if wm_name.contains("mutter")
            || de_name.contains("gnome")
            || de_name.contains("budgie")
            || de_name.contains("cinnamon")
        {
            if let Some(user_theme) =
                query_gsettings("org.gnome.shell.extensions.user-theme", "name")
            {
                return Some(user_theme);
            }
            if let Some(wm_pref) = query_gsettings("org.gnome.desktop.wm.preferences", "theme") {
                if !wm_pref.is_empty() && wm_pref != "Adwaita" {
                    return Some(wm_pref);
                }
            }
            if let Some(cinna_theme) =
                query_gsettings("org.cinnamon.desktop.wm.preferences", "theme")
            {
                return Some(cinna_theme);
            }
            if let Some(gtk) = get_gtk_setting("gtk-theme-name")
                .or_else(|| query_gsettings("org.gnome.desktop.interface", "gtk-theme"))
            {
                return Some(gtk);
            }
        }

        // 3. Marco (MATE)
        if wm_name.contains("marco") || de_name.contains("mate") {
            if let Some(theme) = query_gsettings("org.mate.Marco.general", "theme") {
                return Some(theme);
            }
        }

        // 4. Xfwm4 (XFCE)
        if wm_name.contains("xfwm") || de_name.contains("xfce") {
            if let Some(ref h) = home {
                let xfwm4_xml = h.join(".config/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml");
                if let Ok(content) = std::fs::read_to_string(&xfwm4_xml) {
                    if let Some(theme) = parse_xfwm4_theme(&content) {
                        return Some(theme);
                    }
                }
            }
        }

        // 5. Openbox
        if wm_name.contains("openbox") {
            if let Some(ref h) = home {
                for path in &[
                    h.join(".config/openbox/rc.xml"),
                    h.join(".config/openbox/lxde-rc.xml"),
                    h.join(".config/openbox/lxqt-rc.xml"),
                ] {
                    if let Ok(content) = std::fs::read_to_string(path) {
                        if let Some(theme) = parse_openbox_theme(&content) {
                            return Some(theme);
                        }
                    }
                }
            }
        }

        // 6. Fluxbox
        if wm_name.contains("fluxbox") {
            if let Some(ref h) = home {
                let init = h.join(".fluxbox/init");
                if let Ok(content) = std::fs::read_to_string(&init) {
                    if let Some(theme) = parse_fluxbox_theme(&content) {
                        return Some(theme);
                    }
                }
            }
        }

        // 7. IceWM
        if wm_name.contains("icewm") {
            if let Some(ref h) = home {
                for path in &[h.join(".config/icewm/theme"), h.join(".icewm/theme")] {
                    if let Ok(content) = std::fs::read_to_string(path) {
                        if let Some(theme) = parse_icewm_theme(&content) {
                            return Some(theme);
                        }
                    }
                }
            }
        }

        // Generic fallback to GTK/Qt theme if available
        if let Some(gtk) = get_gtk_setting("gtk-theme-name")
            .or_else(|| query_gsettings("org.gnome.desktop.interface", "gtk-theme"))
        {
            return Some(gtk);
        }
        if let Some(qt) = get_kde_setting("widgetStyle").or_else(|| get_kde_setting("ColorScheme"))
        {
            return Some(qt);
        }

        return None;
    }

    #[cfg(target_os = "macos")]
    {
        let _ = (wm, desktop);
        return match crate::macos_ffi::get_macos_appearance() {
            Some(style) => Some(format!("Aqua ({})", style)),
            None => Some("Aqua (Light)".to_string()),
        };
    }

    #[cfg(target_os = "windows")]
    {
        let _ = (wm, desktop);
        use crate::win_reg;
        let theme_path = win_reg::get_reg_string(
            win_reg::HKEY_CURRENT_USER,
            "Software\\Microsoft\\Windows\\CurrentVersion\\Themes",
            "CurrentTheme",
        );
        let apps_light = win_reg::get_reg_u32(
            win_reg::HKEY_CURRENT_USER,
            "Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
            "AppsUseLightTheme",
        );
        let dark_suffix = match apps_light {
            Some(0) => " (Dark)",
            Some(_) => " (Light)",
            None => "",
        };

        if let Some(path) = theme_path {
            if let Some(name) = parse_windows_theme_name(&path) {
                return Some(format!("{}{}", name, dark_suffix));
            }
        }
        return Some(format!("Aero{}", dark_suffix));
    }

    #[allow(unreachable_code)]
    None
}

pub(crate) fn detect_wallpaper(desktop: Option<&str>, wm: Option<&str>) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let de_name = desktop.map(|d| d.to_lowercase()).unwrap_or_default();
        let wm_name = wm.map(|w| w.to_lowercase()).unwrap_or_default();
        let home = dirs::home_dir();
        let config_dir = std::env::var_os("XDG_CONFIG_HOME")
            .map(std::path::PathBuf::from)
            .or_else(|| home.as_ref().map(|h| h.join(".config")));
        let state_dir = std::env::var_os("XDG_STATE_HOME")
            .map(std::path::PathBuf::from)
            .or_else(|| home.as_ref().map(|h| h.join(".local/state")));
        let cache_dir = std::env::var_os("XDG_CACHE_HOME")
            .map(std::path::PathBuf::from)
            .or_else(|| home.as_ref().map(|h| h.join(".cache")));

        // 1. Major full-featured Desktop Environments when explicitly active
        if de_name.contains("gnome")
            || de_name.contains("budgie")
            || de_name.contains("unity")
            || wm_name.contains("mutter")
        {
            if let Some(wp) = detect_gnome_wallpaper() {
                return Some(wp);
            }
        }
        if de_name.contains("cinnamon") || wm_name.contains("muffin") {
            if let Some(uri) = query_gsettings("org.cinnamon.desktop.background", "picture-uri") {
                if let Some(cleaned) = clean_wallpaper_uri(&uri) {
                    if !cleaned.is_empty() {
                        return Some(cleaned);
                    }
                }
            }
        }
        if de_name.contains("mate") || wm_name.contains("marco") {
            if let Some(file) = query_gsettings("org.mate.background", "picture-filename") {
                if let Some(cleaned) = clean_wallpaper_uri(&file) {
                    if !cleaned.is_empty() {
                        return Some(cleaned);
                    }
                }
            }
        }
        if de_name.contains("kde") || de_name.contains("plasma") || wm_name.contains("kwin") {
            if let Some(ref cfg) = config_dir {
                let appletsrc = cfg.join("plasma-org.kde.plasma.desktop-appletsrc");
                if let Ok(content) = std::fs::read_to_string(&appletsrc) {
                    if let Some(wp) = parse_plasma_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }
        if de_name.contains("xfce") || wm_name.contains("xfwm") {
            if let Some(ref cfg) = config_dir {
                let xfce_xml = cfg.join("xfce4/xfconf/xfce-perchannel-xml/xfce4-desktop.xml");
                if let Ok(content) = std::fs::read_to_string(&xfce_xml) {
                    if let Some(wp) = parse_xfce_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }
        if de_name.contains("cosmic") || wm_name.contains("cosmic") {
            if let Some(ref cfg) = config_dir {
                let cosmic_all = cfg.join("cosmic/com.system76.CosmicBackground/v1/all");
                if let Ok(content) = std::fs::read_to_string(&cosmic_all) {
                    if let Some(wp) = parse_cosmic_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }
        if de_name.contains("lxqt") {
            if let Some(ref cfg) = config_dir {
                let lxqt_cfg = cfg.join("pcmanfm-qt/lxqt/settings.conf");
                if let Ok(content) = std::fs::read_to_string(&lxqt_cfg) {
                    if let Some(wp) = parse_lxqt_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }
        if de_name.contains("lxde") {
            if let Some(ref cfg) = config_dir {
                let lxde_cfg = cfg.join("pcmanfm/LXDE/desktop-items-0.conf");
                if let Ok(content) = std::fs::read_to_string(&lxde_cfg) {
                    if let Some(wp) = parse_lxde_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }

        // 2. Live Wayland / compositor wallpaper daemons & shells (via single /proc pass)
        let daemons = scan_proc_wallpaper_daemons();
        let connected = connected_drm_outputs();

        if daemons.noctalia
            || de_name.contains("umbriel")
            || wm_name.contains("umbriel")
            || de_name.contains("noctalia")
        {
            if let Some(ref st) = state_dir {
                let settings_path = st.join("noctalia/settings.toml");
                if let Ok(content) = std::fs::read_to_string(&settings_path) {
                    if let Some(wp) = parse_noctalia_wallpaper(&content, &connected) {
                        return Some(wp);
                    }
                }
            }
        }

        if daemons.swww {
            if let Some(ref cache) = cache_dir {
                if let Some(wp) = collect_swww_wallpapers_in(&cache.join("swww"), &connected) {
                    return Some(wp);
                }
            }
        }
        if daemons.awww {
            if let Some(ref cache) = cache_dir {
                if let Some(wp) = collect_swww_wallpapers_in(&cache.join("awww"), &connected) {
                    return Some(wp);
                }
            }
        }

        if let Some(wp) = daemons.cmdline_wallpaper {
            return Some(wp);
        }

        if daemons.hyprpaper || de_name.contains("hyprland") || wm_name.contains("hyprland") {
            if let Some(ref cfg) = config_dir {
                let conf = cfg.join("hypr/hyprpaper.conf");
                if let Ok(content) = std::fs::read_to_string(&conf) {
                    if let Some(wp) = parse_hyprpaper_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }

        if daemons.wpaperd {
            if let Some(ref cfg) = config_dir {
                if let Some(wp) = parse_wpaperd_from_config_dir(cfg, &connected) {
                    return Some(wp);
                }
            }
        }

        // 3. Sway config (only when Sway is the active DE/WM)
        if de_name.contains("sway") || wm_name.contains("sway") {
            if let Some(ref h) = home {
                for conf_path in &[h.join(".config/sway/config"), h.join(".sway/config")] {
                    if let Ok(content) = std::fs::read_to_string(conf_path) {
                        if let Some(wp) = parse_sway_wallpaper(&content) {
                            return Some(wp);
                        }
                    }
                }
            }
        }

        // 4. X11 standalone WM wallpaper tools (feh / nitrogen), only on non-Wayland sessions
        let is_wayland = std::env::var_os("WAYLAND_DISPLAY").is_some()
            || std::env::var("XDG_SESSION_TYPE")
                .map(|s| s.eq_ignore_ascii_case("wayland"))
                .unwrap_or(false);
        if !is_wayland {
            if let Some(ref h) = home {
                let fehbg = h.join(".fehbg");
                if let Ok(content) = std::fs::read_to_string(&fehbg) {
                    if let Some(wp) = parse_feh_wallpaper(&content) {
                        return Some(wp);
                    }
                }
                let n_cfg = h.join(".config/nitrogen/bg-saved.cfg");
                if let Ok(content) = std::fs::read_to_string(&n_cfg) {
                    if let Some(wp) = parse_nitrogen_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }

        return None;
    }

    #[cfg(target_os = "macos")]
    {
        let _ = (desktop, wm);
        return crate::macos_ffi::get_macos_wallpaper();
    }

    #[cfg(target_os = "windows")]
    {
        let _ = (desktop, wm);
        use crate::win_reg;
        let wp = win_reg::get_reg_string(
            win_reg::HKEY_CURRENT_USER,
            "Control Panel\\Desktop",
            "WallPaper",
        );
        return wp.and_then(|w| clean_wallpaper_uri(&w));
    }

    #[allow(unreachable_code)]
    None
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
        assert_eq!(
            parse_ini_key(ini_comments, "key"),
            Some("value".to_string())
        );
        assert_eq!(parse_ini_key(ini_comments, "#"), None);
    }

    #[test]
    fn test_decode_percent_encoded() {
        assert_eq!(decode_percent_encoded("hello%20world"), "hello world");
        assert_eq!(
            decode_percent_encoded("/usr/share/wallpapers/My%20Wallpaper.png"),
            "/usr/share/wallpapers/My Wallpaper.png"
        );
        assert_eq!(decode_percent_encoded("no_percent"), "no_percent");
    }

    #[test]
    fn test_clean_wallpaper_uri() {
        assert_eq!(
            clean_wallpaper_uri("'file:///usr/share/backgrounds/day.jpg'"),
            Some("/usr/share/backgrounds/day.jpg".to_string())
        );
        assert_eq!(
            clean_wallpaper_uri("\"file:///home/user/Pictures/My%20Wallpaper.png\""),
            Some("/home/user/Pictures/My Wallpaper.png".to_string())
        );
        assert_eq!(
            clean_wallpaper_uri("C:\\Users\\user\\Pictures\\Wallpaper.jpg"),
            Some("C:\\Users\\user\\Pictures\\Wallpaper.jpg".to_string())
        );
        assert_eq!(clean_wallpaper_uri(""), None);
        assert_eq!(clean_wallpaper_uri("''"), None);
        assert_eq!(clean_wallpaper_uri("\"\""), None);
    }

    #[test]
    fn test_parse_kwin_theme() {
        let kwinrc = r#"
[org.kde.kdecoration2]
BorderSize=Normal
BorderSizeAuto=true
ButtonsOnLeft=M
ButtonsOnRight=IAX
library=org.kde.kwin.aurorae
theme=__aurorae__svg__Nordic
"#;
        assert_eq!(parse_kwin_theme(kwinrc), Some("Nordic".to_string()));

        let kwinrc_breeze = r#"
[org.kde.kdecoration2]
library=org.kde.breeze
theme=Breeze
"#;
        assert_eq!(parse_kwin_theme(kwinrc_breeze), Some("Breeze".to_string()));

        let kwinrc_qml = r#"
[org.kde.kdecoration2]
theme=qml_Sweet-Dark
"#;
        assert_eq!(parse_kwin_theme(kwinrc_qml), Some("Sweet-Dark".to_string()));
    }

    #[test]
    fn test_parse_xfwm4_theme() {
        let xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfwm4" version="1.0">
  <property name="general" type="empty">
    <property name="theme" type="string" value="Greybird"/>
    <property name="title_font" type="string" value="Sans 9"/>
  </property>
</channel>
"#;
        assert_eq!(parse_xfwm4_theme(xml), Some("Greybird".to_string()));
    }

    #[test]
    fn test_parse_openbox_theme() {
        let xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<openbox_config xmlns="http://openbox.org/3.4/rc">
  <theme>
    <name>Clearlooks</name>
    <titleLayout>NLIMC</titleLayout>
  </theme>
</openbox_config>
"#;
        assert_eq!(parse_openbox_theme(xml), Some("Clearlooks".to_string()));
    }

    #[test]
    fn test_parse_fluxbox_theme() {
        let init = "session.styleFile: /usr/share/fluxbox/styles/bloody\nsession.screen0.toolbar.tools: prevworkspace, workspacename\n";
        assert_eq!(parse_fluxbox_theme(init), Some("bloody".to_string()));
    }

    #[test]
    fn test_parse_icewm_theme() {
        let cfg = "Theme=\"Adwaita/default.theme\"\n";
        assert_eq!(parse_icewm_theme(cfg), Some("Adwaita".to_string()));
    }

    #[test]
    fn test_parse_plasma_wallpaper() {
        let appletsrc = r#"
[Containments][1][Applets][2][Configuration][General]
Image=file:///usr/share/wallpapers/Next/contents/images/3840x2160.png
usersWallpapers=file:///usr/share/wallpapers/Next/contents/images/3840x2160.png
"#;
        assert_eq!(
            parse_plasma_wallpaper(appletsrc),
            Some("/usr/share/wallpapers/Next/contents/images/3840x2160.png".to_string())
        );
    }

    #[test]
    fn test_parse_xfce_wallpaper() {
        let xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<channel name="xfce4-desktop" version="1.0">
  <property name="backdrop" type="empty">
    <property name="screen0" type="empty">
      <property name="monitor0" type="empty">
        <property name="last-image" type="string" value="/usr/share/backgrounds/xfce/xfce-teal.jpg"/>
      </property>
    </property>
  </property>
</channel>
"#;
        assert_eq!(
            parse_xfce_wallpaper(xml),
            Some("/usr/share/backgrounds/xfce/xfce-teal.jpg".to_string())
        );
    }

    #[test]
    fn test_parse_hyprpaper_wallpaper() {
        let conf = r#"
preload = /home/user/Pictures/wall.png
wallpaper = DP-1,/home/user/Pictures/wall.png
"#;
        assert_eq!(
            parse_hyprpaper_wallpaper(conf),
            Some("/home/user/Pictures/wall.png".to_string())
        );
    }

    #[test]
    fn test_parse_sway_wallpaper() {
        let conf = r#"
output * bg /usr/share/backgrounds/sway/Sway_Wallpaper_Blue_1920x1080.png fill
"#;
        assert_eq!(
            parse_sway_wallpaper(conf),
            Some("/usr/share/backgrounds/sway/Sway_Wallpaper_Blue_1920x1080.png".to_string())
        );
    }

    #[test]
    fn test_parse_feh_wallpaper() {
        let feh = "feh --no-fehbg --bg-fill '/home/user/Pictures/nature.jpg'";
        assert_eq!(
            parse_feh_wallpaper(feh),
            Some("/home/user/Pictures/nature.jpg".to_string())
        );
    }

    #[test]
    fn test_parse_nitrogen_wallpaper() {
        let cfg = "[xin_0]\nfile=/home/user/wallpapers/sunset.png\nmode=4\n";
        assert_eq!(
            parse_nitrogen_wallpaper(cfg),
            Some("/home/user/wallpapers/sunset.png".to_string())
        );
    }

    #[test]
    fn test_parse_windows_theme_name() {
        assert_eq!(
            parse_windows_theme_name(r"C:\Windows\resources\Themes\aero.theme"),
            Some("Aero".to_string())
        );
        assert_eq!(
            parse_windows_theme_name(r"C:\Windows\resources\Themes\dark.theme"),
            Some("Dark".to_string())
        );
        assert_eq!(
            parse_windows_theme_name(
                r"C:\Users\User\AppData\Local\Microsoft\Windows\Themes\Custom.theme"
            ),
            Some("Custom".to_string())
        );
    }

    #[test]
    fn test_connected_drm_outputs_in() {
        let dir = std::env::temp_dir().join(format!("retch_test_drm_{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(dir.join("card1-eDP-1")).unwrap();
        std::fs::create_dir_all(dir.join("card1-DP-1")).unwrap();
        std::fs::create_dir_all(dir.join("card1-DP-2")).unwrap();
        std::fs::create_dir_all(dir.join("card1-HDMI-A-1")).unwrap();
        std::fs::create_dir_all(dir.join("card1")).unwrap();

        std::fs::write(dir.join("card1-eDP-1/status"), "connected\n").unwrap();
        std::fs::write(dir.join("card1-DP-1/status"), "disconnected\n").unwrap();
        std::fs::write(dir.join("card1-DP-2/status"), "connected\n").unwrap();
        std::fs::write(dir.join("card1-HDMI-A-1/status"), "disconnected\n").unwrap();

        let connected = connected_drm_outputs_in(&dir);
        let _ = std::fs::remove_dir_all(&dir);
        assert_eq!(connected, vec!["DP-2".to_string(), "eDP-1".to_string()]);
    }

    #[test]
    fn test_parse_noctalia_wallpaper() {
        // Verbatim [wallpaper] section from corrino's ~/.local/state/noctalia/settings.toml
        let settings = r#"
[theme]
builtin = "Noctalia"
source = "wallpaper"

[wallpaper]
directory = "/home/ktobias/Pictures/Wallpapers"
per_monitor_directories = true
transition = [ "fade" ]
transition_duration = 2000

    [wallpaper.automation]
    enabled = true
    interval_seconds = 300

    [wallpaper.default]
    path = "/home/ktobias/Pictures/Wallpapers/19808_en_1.jpg"

    [wallpaper.last]
    path = "/home/ktobias/Pictures/Wallpapers/wallhaven_0jjpw5.jpg"

    [wallpaper.monitors.DP-1]
    path = "/home/ktobias/Pictures/Wallpapers/wallhaven_497p6k.jpg"

    [wallpaper.monitors.DP-2]
    path = "/home/ktobias/Pictures/Wallpapers/pod-27-02-2021.jpg"

    [wallpaper.monitors.eDP-1]
    path = "/home/ktobias/Pictures/Wallpapers/wallhaven_0jjpw5.jpg"

[weather]
unit = "imperial"
"#;

        // Undocked: only eDP-1 is connected
        assert_eq!(
            parse_noctalia_wallpaper(settings, &["eDP-1".to_string()]),
            Some("/home/ktobias/Pictures/Wallpapers/wallhaven_0jjpw5.jpg".to_string())
        );

        // Docked: DP-1, DP-2, eDP-1 all connected -> deduplicated list in monitor order
        assert_eq!(
            parse_noctalia_wallpaper(
                settings,
                &[
                    "DP-1".to_string(),
                    "DP-2".to_string(),
                    "eDP-1".to_string()
                ]
            ),
            Some(
                "/home/ktobias/Pictures/Wallpapers/wallhaven_497p6k.jpg, /home/ktobias/Pictures/Wallpapers/pod-27-02-2021.jpg, /home/ktobias/Pictures/Wallpapers/wallhaven_0jjpw5.jpg".to_string()
            )
        );

        // No connected outputs match monitors -> falls back to [wallpaper.last]
        assert_eq!(
            parse_noctalia_wallpaper(settings, &["HDMI-A-1".to_string()]),
            Some("/home/ktobias/Pictures/Wallpapers/wallhaven_0jjpw5.jpg".to_string())
        );

        // Empty connected outputs -> falls back to [wallpaper.last]
        assert_eq!(
            parse_noctalia_wallpaper(settings, &[]),
            Some("/home/ktobias/Pictures/Wallpapers/wallhaven_0jjpw5.jpg".to_string())
        );

        // Without [wallpaper.last], falls back to [wallpaper.default]
        let default_only = r#"
[wallpaper.default]
path = "/home/ktobias/Pictures/Wallpapers/19808_en_1.jpg"
"#;
        assert_eq!(
            parse_noctalia_wallpaper(default_only, &["eDP-1".to_string()]),
            Some("/home/ktobias/Pictures/Wallpapers/19808_en_1.jpg".to_string())
        );
    }

    #[test]
    fn test_parse_swww_cache_bytes_and_dir() {
        // swww v0.8+ NUL-delimited cache file: "\0Lanczos3\0/home/user/wall.png\0"
        let bytes = b"\0Lanczos3\0/home/user/Pictures/swww_wall.png\0";
        assert_eq!(
            parse_swww_cache_bytes(bytes),
            Some("/home/user/Pictures/swww_wall.png".to_string())
        );

        let dir = std::env::temp_dir().join(format!("retch_test_swww_{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(
            dir.join("eDP-1"),
            b"Lanczos3\0/home/user/Pictures/edp.png\0",
        )
        .unwrap();
        std::fs::write(
            dir.join("DP-1"),
            b"Lanczos3\0/home/user/Pictures/stale_dp1.png\0",
        )
        .unwrap();

        assert_eq!(
            collect_swww_wallpapers_in(&dir, &["eDP-1".to_string()]),
            Some("/home/user/Pictures/edp.png".to_string())
        );
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_parse_wallpaper_from_cmdline() {
        let swaybg_cmd = b"swaybg\0-o\0*\0-i\0/home/user/Pictures/swaybg.png\0-m\0fill\0";
        assert_eq!(
            parse_wallpaper_from_cmdline("swaybg", swaybg_cmd),
            Some("/home/user/Pictures/swaybg.png".to_string())
        );

        let wbg_cmd = b"wbg\0-s\0/home/user/Pictures/wbg.jpg\0";
        assert_eq!(
            parse_wallpaper_from_cmdline("wbg", wbg_cmd),
            Some("/home/user/Pictures/wbg.jpg".to_string())
        );

        let mpvpaper_cmd = b"mpvpaper\0-o\0loop\0DP-1\0/home/user/Videos/live.mp4\0";
        assert_eq!(
            parse_wallpaper_from_cmdline("mpvpaper", mpvpaper_cmd),
            Some("/home/user/Videos/live.mp4".to_string())
        );

        // One daemon process per output: all parsed cmdlines contribute.
        let swaybg_edp = b"swaybg\0-o\0eDP-1\0-i\0/home/user/Pictures/laptop.jpg\0-m\0fill\0";
        let swaybg_dp = b"swaybg\0-o\0DP-1\0-i\0/home/user/Pictures/dock.jpg\0-m\0fill\0";
        let wbg_hdmi = b"wbg\0/home/user/Pictures/hdmi.jpg\0";
        assert_eq!(
            collect_cmdline_wallpapers([
                ("swaybg", swaybg_edp.as_slice()),
                ("swaybg", swaybg_dp.as_slice()),
                ("wbg", wbg_hdmi.as_slice()),
            ]),
            Some(
                "/home/user/Pictures/laptop.jpg, /home/user/Pictures/dock.jpg, /home/user/Pictures/hdmi.jpg"
                    .to_string()
            )
        );
        // Duplicate paths across processes are collapsed.
        assert_eq!(
            collect_cmdline_wallpapers([
                ("swaybg", swaybg_edp.as_slice()),
                ("swaybg", swaybg_edp.as_slice()),
            ]),
            Some("/home/user/Pictures/laptop.jpg".to_string())
        );
    }

    #[test]
    fn test_parse_cosmic_wpaperd_lxqt_lxde_wallpaper() {
        let cosmic_ron = r#"(
    output: "all",
    source: Path("/usr/share/backgrounds/cosmic/orion_nebula_nasa.jpg"),
    filter_by_theme: true,
)"#;
        assert_eq!(
            parse_cosmic_wallpaper(cosmic_ron),
            Some("/usr/share/backgrounds/cosmic/orion_nebula_nasa.jpg".to_string())
        );

        let wpaperd_toml = r#"
[default]
path = "/home/user/Pictures/default.jpg"

[DP-1]
path = "/home/user/Pictures/dock.jpg"

[eDP-1]
path = "/home/user/Pictures/laptop.jpg"
"#;
        assert_eq!(
            parse_wpaperd_wallpaper(wpaperd_toml, &["eDP-1".to_string()]),
            Some("/home/user/Pictures/laptop.jpg".to_string())
        );
        // Unmatched connected output uses [default], not leftover per-output paths.
        assert_eq!(
            parse_wpaperd_wallpaper(wpaperd_toml, &["HDMI-A-1".to_string()]),
            Some("/home/user/Pictures/default.jpg".to_string())
        );
        // Mixed: named match plus fallback for the unmatched display.
        assert_eq!(
            parse_wpaperd_wallpaper(wpaperd_toml, &["eDP-1".to_string(), "HDMI-A-1".to_string()]),
            Some("/home/user/Pictures/laptop.jpg, /home/user/Pictures/default.jpg".to_string())
        );
        // Empty connected list: fallback only (do not join stale named sections).
        assert_eq!(
            parse_wpaperd_wallpaper(wpaperd_toml, &[]),
            Some("/home/user/Pictures/default.jpg".to_string())
        );

        let any_only = r#"
[any]
path = "/home/user/Pictures/any.jpg"

[DP-1]
path = "/home/user/Pictures/dock.jpg"
"#;
        assert_eq!(
            parse_wpaperd_wallpaper(any_only, &["HDMI-A-1".to_string()]),
            Some("/home/user/Pictures/any.jpg".to_string())
        );

        let default_and_any = r#"
[any]
path = "/home/user/Pictures/any.jpg"

[default]
path = "/home/user/Pictures/default.jpg"
"#;
        assert_eq!(
            parse_wpaperd_wallpaper(default_and_any, &["HDMI-A-1".to_string()]),
            Some("/home/user/Pictures/default.jpg".to_string())
        );

        let no_fallback = r#"
[DP-1]
path = "/home/user/Pictures/dock.jpg"

[eDP-1]
path = "/home/user/Pictures/laptop.jpg"
"#;
        assert_eq!(
            parse_wpaperd_wallpaper(no_fallback, &["HDMI-A-1".to_string()]),
            None
        );

        let lxqt_ini = "[Desktop]\nWallpaper=/usr/share/lxqt/themes/frost/lxqt-origami-light.png\n";
        assert_eq!(
            parse_lxqt_wallpaper(lxqt_ini),
            Some("/usr/share/lxqt/themes/frost/lxqt-origami-light.png".to_string())
        );

        let lxde_ini = "[*]\nwallpaper=/usr/share/lxde/wallpapers/lxde_blue.jpg\n";
        assert_eq!(
            parse_lxde_wallpaper(lxde_ini),
            Some("/usr/share/lxde/wallpapers/lxde_blue.jpg".to_string())
        );

        // After a 1.0 upgrade both files can exist; leftover wallpaper.toml must not win.
        let dir = std::env::temp_dir().join(format!("retch_test_wpaperd_{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(dir.join("wpaperd")).unwrap();
        std::fs::write(
            dir.join("wpaperd/wallpaper.toml"),
            "[default]\npath = \"/home/user/Pictures/stale.jpg\"\n",
        )
        .unwrap();
        std::fs::write(
            dir.join("wpaperd/config.toml"),
            "[default]\npath = \"/home/user/Pictures/live.jpg\"\n",
        )
        .unwrap();
        assert_eq!(
            parse_wpaperd_from_config_dir(&dir, &["eDP-1".to_string()]),
            Some("/home/user/Pictures/live.jpg".to_string())
        );
        // Pre-1.0 only: wallpaper.toml is still used.
        std::fs::remove_file(dir.join("wpaperd/config.toml")).unwrap();
        assert_eq!(
            parse_wpaperd_from_config_dir(&dir, &["eDP-1".to_string()]),
            Some("/home/user/Pictures/stale.jpg".to_string())
        );
        let _ = std::fs::remove_dir_all(&dir);
    }
}
