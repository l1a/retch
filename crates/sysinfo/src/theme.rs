// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! UI theme, icon, cursor, and font detection.

#[cfg(target_os = "linux")]
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

#[cfg(any(target_os = "linux", target_os = "windows", target_os = "macos", test))]
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

#[cfg(any(target_os = "linux", target_os = "windows", target_os = "macos", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
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

#[cfg(any(target_os = "linux", test))]
pub(crate) fn parse_nitrogen_wallpaper(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("file=") {
            return clean_wallpaper_uri(line.trim_start_matches("file="));
        }
    }
    None
}

#[cfg(any(target_os = "windows", test))]
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

        // 1. GNOME / Cinnamon / Budgie / Unity / Niri
        if de_name.contains("gnome")
            || de_name.contains("budgie")
            || de_name.contains("unity")
            || wm_name.contains("mutter")
            || wm_name.contains("niri")
        {
            if let Some(uri) = query_gsettings("org.gnome.desktop.background", "picture-uri-dark")
                .or_else(|| query_gsettings("org.gnome.desktop.background", "picture-uri"))
            {
                if let Some(cleaned) = clean_wallpaper_uri(&uri) {
                    if !cleaned.is_empty() {
                        return Some(cleaned);
                    }
                }
            }
        }
        if de_name.contains("cinnamon") {
            if let Some(uri) = query_gsettings("org.cinnamon.desktop.background", "picture-uri") {
                if let Some(cleaned) = clean_wallpaper_uri(&uri) {
                    if !cleaned.is_empty() {
                        return Some(cleaned);
                    }
                }
            }
        }

        // 2. MATE
        if de_name.contains("mate") || wm_name.contains("marco") {
            if let Some(file) = query_gsettings("org.mate.background", "picture-filename") {
                if let Some(cleaned) = clean_wallpaper_uri(&file) {
                    if !cleaned.is_empty() {
                        return Some(cleaned);
                    }
                }
            }
        }

        // 3. KDE Plasma
        if de_name.contains("kde") || de_name.contains("plasma") || wm_name.contains("kwin") {
            if let Some(ref h) = home {
                let appletsrc = h.join(".config/plasma-org.kde.plasma.desktop-appletsrc");
                if let Ok(content) = std::fs::read_to_string(&appletsrc) {
                    if let Some(wp) = parse_plasma_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }

        // 4. XFCE
        if de_name.contains("xfce") || wm_name.contains("xfwm") {
            if let Some(ref h) = home {
                let xfce_xml = h.join(".config/xfce4/xfconf/xfce-perchannel-xml/xfce4-desktop.xml");
                if let Ok(content) = std::fs::read_to_string(&xfce_xml) {
                    if let Some(wp) = parse_xfce_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }

        // 5. Hyprpaper
        if let Some(ref h) = home {
            let conf = h.join(".config/hypr/hyprpaper.conf");
            if let Ok(content) = std::fs::read_to_string(&conf) {
                if let Some(wp) = parse_hyprpaper_wallpaper(&content) {
                    return Some(wp);
                }
            }
        }

        // 6. Sway config
        if let Some(ref h) = home {
            for conf_path in &[h.join(".config/sway/config"), h.join(".sway/config")] {
                if let Ok(content) = std::fs::read_to_string(conf_path) {
                    if let Some(wp) = parse_sway_wallpaper(&content) {
                        return Some(wp);
                    }
                }
            }
        }

        // 7. Feh
        if let Some(ref h) = home {
            let fehbg = h.join(".fehbg");
            if let Ok(content) = std::fs::read_to_string(&fehbg) {
                if let Some(wp) = parse_feh_wallpaper(&content) {
                    return Some(wp);
                }
            }
        }

        // 8. Nitrogen
        if let Some(ref h) = home {
            let n_cfg = h.join(".config/nitrogen/bg-saved.cfg");
            if let Ok(content) = std::fs::read_to_string(&n_cfg) {
                if let Some(wp) = parse_nitrogen_wallpaper(&content) {
                    return Some(wp);
                }
            }
        }

        // 9. Generic gsettings fallback
        if let Some(uri) = query_gsettings("org.gnome.desktop.background", "picture-uri-dark")
            .or_else(|| query_gsettings("org.gnome.desktop.background", "picture-uri"))
        {
            if let Some(cleaned) = clean_wallpaper_uri(&uri) {
                if !cleaned.is_empty() {
                    return Some(cleaned);
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
}
