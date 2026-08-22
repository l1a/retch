// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Terminal emulator detection and font configuration reading.

use sysinfo::System;

/// Returns the current terminal dimensions as `"COLSxROWS"`, or `None` if unavailable.
///
/// Uses `TIOCGWINSZ` ioctl on Linux/macOS and `GetConsoleScreenBufferInfo` on
/// Windows. Falls back to `$COLUMNS`/`$LINES` env vars. Returns `None` when
/// stdout is not a console (e.g. piped output) and no fallback is set.
pub(crate) fn detect_terminal_size() -> Option<String> {
    #[cfg(any(target_os = "linux", target_os = "macos"))]
    {
        use libc::{ioctl, winsize, STDOUT_FILENO, TIOCGWINSZ};
        let mut ws = winsize {
            ws_row: 0,
            ws_col: 0,
            ws_xpixel: 0,
            ws_ypixel: 0,
        };
        let ret = unsafe { ioctl(STDOUT_FILENO, TIOCGWINSZ, &mut ws) };
        if ret == 0 && ws.ws_col > 0 && ws.ws_row > 0 {
            return Some(format!("{}x{}", ws.ws_col, ws.ws_row));
        }
    }
    #[cfg(target_os = "windows")]
    {
        if let Some(size) = terminal_size_windows() {
            return Some(size);
        }
    }
    // Fallback: env vars set by some shells
    if let (Ok(cols), Ok(rows)) = (std::env::var("COLUMNS"), std::env::var("LINES")) {
        if let (Ok(c), Ok(r)) = (cols.trim().parse::<u16>(), rows.trim().parse::<u16>()) {
            if c > 0 && r > 0 {
                return Some(format!("{}x{}", c, r));
            }
        }
    }
    None
}

/// `COORD` — a console screen coordinate pair.
#[cfg(target_os = "windows")]
#[repr(C)]
struct Coord {
    x: i16,
    y: i16,
}

/// `SMALL_RECT` — an inclusive console rectangle.
#[cfg(target_os = "windows")]
#[repr(C)]
struct SmallRect {
    left: i16,
    top: i16,
    right: i16,
    bottom: i16,
}

/// `CONSOLE_SCREEN_BUFFER_INFO` — layout the OS fills by offset, so field
/// order and `#[repr(C)]` are load-bearing (see the `size_of` guard test).
#[cfg(target_os = "windows")]
#[repr(C)]
struct ConsoleScreenBufferInfo {
    size: Coord,
    cursor_position: Coord,
    attributes: u16,
    window: SmallRect,
    maximum_window_size: Coord,
}

/// Windows: reads the console viewport size via `GetConsoleScreenBufferInfo`.
///
/// Uses the *window* rectangle (visible viewport), not `dwSize` — the latter is
/// the scrollback buffer height, which is typically far larger than the visible
/// rows. Returns `None` when stdout is not attached to a console (redirected or
/// piped), letting the caller fall through to the env-var path.
#[cfg(target_os = "windows")]
fn terminal_size_windows() -> Option<String> {
    #[allow(clippy::upper_case_acronyms)]
    type HANDLE = *mut std::ffi::c_void;
    // (DWORD)-11 — STD_OUTPUT_HANDLE.
    const STD_OUTPUT_HANDLE: u32 = 0xFFFF_FFF5;

    // kernel32 is linked by default on the MSVC target.
    extern "system" {
        fn GetStdHandle(n_std_handle: u32) -> HANDLE;
        fn GetConsoleScreenBufferInfo(
            h_console_output: HANDLE,
            lp_info: *mut ConsoleScreenBufferInfo,
        ) -> i32;
    }

    // SAFETY: GetStdHandle returns a handle value without touching memory.
    let handle = unsafe { GetStdHandle(STD_OUTPUT_HANDLE) };
    // INVALID_HANDLE_VALUE is (HANDLE)-1; a null handle means "no such stream".
    if handle.is_null() || handle == (-1isize as HANDLE) {
        return None;
    }

    let mut info = ConsoleScreenBufferInfo {
        size: Coord { x: 0, y: 0 },
        cursor_position: Coord { x: 0, y: 0 },
        attributes: 0,
        window: SmallRect {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
        maximum_window_size: Coord { x: 0, y: 0 },
    };
    // SAFETY: `info` is a correctly-laid-out CONSOLE_SCREEN_BUFFER_INFO the OS
    // fills in full; `handle` is a valid console output handle checked above.
    let ok = unsafe { GetConsoleScreenBufferInfo(handle, &mut info) };
    if ok == 0 {
        return None;
    }
    window_rect_to_size(
        info.window.left,
        info.window.top,
        info.window.right,
        info.window.bottom,
    )
}

/// Converts an inclusive console window rect to a `"COLSxROWS"` string.
///
/// The visible size is `right - left + 1` columns by `bottom - top + 1` rows.
/// Returns `None` for a degenerate (empty or inverted) rect. Split out of
/// [`terminal_size_windows`] so the arithmetic is unit-tested without a console.
#[cfg(any(target_os = "windows", test))]
fn window_rect_to_size(left: i16, top: i16, right: i16, bottom: i16) -> Option<String> {
    let cols = right as i32 - left as i32 + 1;
    let rows = bottom as i32 - top as i32 + 1;
    if cols > 0 && rows > 0 {
        Some(format!("{}x{}", cols, rows))
    } else {
        None
    }
}

pub(crate) fn detect_terminal(sys: &System) -> Option<String> {
    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if !prog.is_empty() {
            return Some(prog);
        }
    }
    if let Ok(prog) = std::env::var("TERMINAL_EMULATOR") {
        if !prog.is_empty() {
            return Some(prog);
        }
    }
    if std::env::var("ALACRITTY_LOG").is_ok() || std::env::var("ALACRITTY_WINDOW_ID").is_ok() {
        return Some("alacritty".to_string());
    }

    let current_pid = sysinfo::Pid::from_u32(std::process::id());
    let mut current_proc = sys.process(current_pid);

    let known_terms = [
        "kitty",
        "alacritty",
        "wezterm",
        "gnome-terminal",
        "konsole",
        "iterm2",
        "Terminal",
        "rio",
        "foot",
        "tilix",
        "xfce4-terminal",
        "terminator",
        "st",
        "urxvt",
        "ptyxis",
    ];

    let mut depth = 0;
    while let Some(proc) = current_proc {
        if depth > 5 {
            break;
        }
        let name = proc.name().to_string_lossy().to_lowercase();
        for term in &known_terms {
            if name == *term || name.ends_with(term) || (name.contains(term) && term.len() > 3) {
                return Some(term.to_string());
            }
        }
        if let Some(parent_pid) = proc.parent() {
            current_proc = sys.process(parent_pid);
        } else {
            break;
        }
        depth += 1;
    }

    if let Ok(term) = std::env::var("TERM") {
        if term != "xterm-256color" && term != "xterm" && term != "linux" && term != "cygwin" {
            if let Some(stripped) = term.strip_prefix("xterm-") {
                return Some(stripped.to_string());
            }
            return Some(term);
        }
    }

    None
}

pub(crate) fn detect_terminal_font(terminal: Option<&str>) -> Option<String> {
    let term = terminal?;
    let term_lower = term.to_lowercase();
    let home = dirs::home_dir()?;

    if term_lower.contains("kitty") {
        let conf_path = home.join(".config/kitty/kitty.conf");
        if let Ok(content) = std::fs::read_to_string(&conf_path) {
            let mut family = None;
            let mut size = None;
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("font_family") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 {
                        family = Some(parts[1..].join(" "));
                    }
                } else if line.starts_with("font_size") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 {
                        size = Some(parts[1].to_string());
                    }
                }
            }
            match (family, size) {
                (Some(f), Some(s)) => return Some(format!("{} ({})", f, s)),
                (Some(f), None) => return Some(f),
                (None, Some(s)) => {
                    let fallback = crate::theme::get_default_monospace_font()
                        .unwrap_or_else(|| "Default".to_string());
                    return Some(format!("{} ({})", fallback, s));
                }
                (None, None) => {}
            }
        }
    } else if term_lower.contains("alacritty") {
        let paths = [
            home.join(".config/alacritty/alacritty.toml"),
            home.join(".config/alacritty/alacritty.yml"),
            home.join(".alacritty.toml"),
            home.join(".alacritty.yml"),
        ];
        for path in paths {
            if let Ok(content) = std::fs::read_to_string(&path) {
                let mut family = None;
                let mut size = None;
                for line in content.lines() {
                    let line = line.trim();
                    if line.starts_with("family") {
                        if let Some(idx) = line.find('=') {
                            let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                            family = Some(val.to_string());
                        } else if let Some(idx) = line.find(':') {
                            let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                            family = Some(val.to_string());
                        }
                    } else if line.starts_with("size") {
                        if let Some(idx) = line.find('=') {
                            size = Some(line[idx + 1..].trim().to_string());
                        } else if let Some(idx) = line.find(':') {
                            size = Some(line[idx + 1..].trim().to_string());
                        }
                    }
                }
                match (family, size) {
                    (Some(f), Some(s)) => return Some(format!("{} ({})", f, s)),
                    (Some(f), None) => return Some(f),
                    (None, Some(s)) => {
                        let fallback = crate::theme::get_default_monospace_font()
                            .unwrap_or_else(|| "Default".to_string());
                        return Some(format!("{} ({})", fallback, s));
                    }
                    (None, None) => {}
                }
            }
        }
    } else if term_lower.contains("wezterm") {
        let paths = [
            home.join(".wezterm.lua"),
            home.join(".config/wezterm/wezterm.lua"),
        ];
        for path in paths {
            if let Ok(content) = std::fs::read_to_string(&path) {
                let mut family = None;
                let mut size = None;
                for line in content.lines() {
                    if line.contains("wezterm.font") {
                        if let Some(start) = line.find("wezterm.font") {
                            let rest = &line[start..];
                            if let Some(quote1) = rest.find('\'').or(rest.find('"')) {
                                let quote_char = rest.chars().nth(quote1).unwrap();
                                if let Some(quote2) = rest[quote1 + 1..].find(quote_char) {
                                    family =
                                        Some(rest[quote1 + 1..quote1 + 1 + quote2].to_string());
                                }
                            }
                        }
                    }
                    if line.contains("font_size") {
                        if let Some(idx) = line.find('=') {
                            let val = line[idx + 1..].trim().trim_end_matches(',');
                            size = Some(val.to_string());
                        }
                    }
                }
                match (family, size) {
                    (Some(f), Some(s)) => return Some(format!("{} ({})", f, s)),
                    (Some(f), None) => return Some(f),
                    (None, Some(s)) => {
                        let fallback = crate::theme::get_default_monospace_font()
                            .unwrap_or_else(|| "Default".to_string());
                        return Some(format!("{} ({})", fallback, s));
                    }
                    (None, None) => {}
                }
            }
        }
    } else if term_lower.contains("foot") {
        let conf_path = home.join(".config/foot/foot.ini");
        if let Ok(content) = std::fs::read_to_string(&conf_path) {
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("font=") {
                    let val = line.trim_start_matches("font=");
                    let parts: Vec<&str> = val.split(':').collect();
                    let family = parts[0].trim();
                    let mut size = None;
                    for part in &parts[1..] {
                        if part.starts_with("size=") {
                            size = Some(part.trim_start_matches("size=").trim());
                        }
                    }
                    if let Some(s) = size {
                        return Some(format!("{} ({})", family, s));
                    } else {
                        return Some(family.to_string());
                    }
                }
            }
        }
    } else if term_lower.contains("ptyxis") {
        #[cfg(target_os = "linux")]
        if let Ok(output) = std::process::Command::new("gsettings")
            .args(["get", "org.gnome.Ptyxis", "use-system-font"])
            .output()
        {
            if output.status.success() {
                let s = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if s == "false" {
                    if let Ok(font_out) = std::process::Command::new("gsettings")
                        .args(["get", "org.gnome.Ptyxis", "font-name"])
                        .output()
                    {
                        if font_out.status.success() {
                            let mut font_str =
                                String::from_utf8_lossy(&font_out.stdout).trim().to_string();
                            font_str = font_str.trim_matches('\'').to_string();
                            if !font_str.is_empty() {
                                if let Some(last_space) = font_str.rfind(' ') {
                                    let family = &font_str[..last_space];
                                    let size = &font_str[last_space + 1..];
                                    if size.chars().all(|c| c.is_ascii_digit() || c == '.') {
                                        return Some(format!("{} ({})", family, size));
                                    }
                                }
                                return Some(font_str);
                            }
                        }
                    }
                } else {
                    if let Ok(font_out) = std::process::Command::new("gsettings")
                        .args(["get", "org.gnome.desktop.interface", "monospace-font-name"])
                        .output()
                    {
                        if font_out.status.success() {
                            let mut font_str =
                                String::from_utf8_lossy(&font_out.stdout).trim().to_string();
                            font_str = font_str.trim_matches('\'').to_string();
                            if !font_str.is_empty() {
                                if let Some(last_space) = font_str.rfind(' ') {
                                    let family = &font_str[..last_space];
                                    let size = &font_str[last_space + 1..];
                                    if size.chars().all(|c| c.is_ascii_digit() || c == '.') {
                                        return Some(format!("{} ({})", family, size));
                                    }
                                }
                                return Some(font_str);
                            }
                        }
                    }
                    return crate::theme::get_default_monospace_font();
                }
            }
        }
    } else if term_lower.contains("konsole") {
        let rc_path = home.join(".config/konsolerc");
        let mut profile_name = "Default.profile".to_string();
        if let Ok(content) = std::fs::read_to_string(&rc_path) {
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("DefaultProfile=") {
                    profile_name = line.trim_start_matches("DefaultProfile=").to_string();
                    break;
                }
            }
        }
        let profile_path = home.join(".local/share/konsole").join(profile_name);
        if let Ok(content) = std::fs::read_to_string(&profile_path) {
            for line in content.lines() {
                let line = line.trim();
                if line.starts_with("Font=") {
                    let val = line.trim_start_matches("Font=");
                    let parts: Vec<&str> = val.split(',').collect();
                    if !parts.is_empty() {
                        let family = parts[0];
                        if parts.len() > 1 {
                            let size = parts[1];
                            return Some(format!("{} ({})", family, size));
                        }
                        return Some(family.to_string());
                    }
                }
            }
        }
        return crate::theme::get_default_monospace_font();
    }

    #[cfg(target_os = "macos")]
    if term_lower == "iterm.app" || term_lower.contains("iterm2") {
        if let Ok(output) = std::process::Command::new("defaults")
            .args(["read", "com.googlecode.iterm2", "Normal Font"])
            .output()
        {
            if let Ok(s) = String::from_utf8(output.stdout) {
                let font = s.trim();
                if !font.is_empty() {
                    return Some(font.to_string());
                }
            }
        }
    }

    None
}

#[cfg(any(target_os = "linux", target_os = "macos", test))]
pub(crate) fn parse_kitty_theme(
    content: &str,
    kitty_dir: Option<&std::path::Path>,
) -> Option<String> {
    let mut bg = None;
    let mut fg = None;
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("include") {
            let path_str = line.trim_start_matches("include").trim();
            let p = std::path::Path::new(path_str);
            if let Some(stem) = p.file_stem().and_then(|s| s.to_str()) {
                if stem != "current-theme" && stem != "theme" && !stem.is_empty() {
                    return Some(stem.to_string());
                }
                if let Some(dir) = kitty_dir {
                    let full_p = if p.is_relative() {
                        dir.join(p)
                    } else {
                        p.to_path_buf()
                    };
                    if let Ok(theme_content) = std::fs::read_to_string(&full_p) {
                        for t_line in theme_content.lines() {
                            let t_line = t_line.trim();
                            if let Some(rest) = t_line
                                .strip_prefix("## name:")
                                .or_else(|| t_line.strip_prefix("# name:"))
                                .or_else(|| t_line.strip_prefix("## Name:"))
                                .or_else(|| t_line.strip_prefix("# Name:"))
                                .or_else(|| t_line.strip_prefix("# Theme:"))
                            {
                                let name = rest.trim();
                                if !name.is_empty() {
                                    return Some(name.to_string());
                                }
                            }
                        }
                    }
                }
            }
        } else if line.starts_with("background") && !line.starts_with("background_") {
            let val = line.trim_start_matches("background").trim();
            if !val.is_empty() {
                bg = Some(val.to_string());
            }
        } else if line.starts_with("foreground") && !line.starts_with("foreground_") {
            let val = line.trim_start_matches("foreground").trim();
            if !val.is_empty() {
                fg = Some(val.to_string());
            }
        }
    }
    match (bg, fg) {
        (Some(b), Some(f)) => Some(format!("BG: {}, FG: {}", b, f)),
        (Some(b), None) => Some(format!("BG: {}", b)),
        (None, Some(f)) => Some(format!("FG: {}", f)),
        (None, None) => None,
    }
}

#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows", test))]
pub(crate) fn parse_alacritty_theme(content: &str) -> Option<String> {
    let mut bg = None;
    let mut fg = None;
    let mut in_colors = false;
    let mut in_primary = false;
    let mut in_import = false;

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') {
            continue;
        }
        if line.contains("import") {
            in_import = true;
        }
        if in_import || line.contains(".toml") || line.contains(".yml") || line.contains(".yaml") {
            let path_start = line.find('"').or_else(|| line.find('\''));
            if let Some(start) = path_start {
                let quote = line.chars().nth(start).unwrap();
                let rest = &line[start + 1..];
                if let Some(end) = rest.find(quote) {
                    let imp_path = &rest[..end];
                    let last_segment = imp_path.rsplit(['/', '\\']).next().unwrap_or(imp_path);
                    let stem = if let Some(idx) = last_segment.rfind('.') {
                        &last_segment[..idx]
                    } else {
                        last_segment
                    };
                    if !stem.is_empty() && stem != "alacritty" {
                        return Some(stem.to_string());
                    }
                }
            }
        }
        if line.contains(']') && in_import {
            in_import = false;
        }
        if line.starts_with("[colors]") {
            in_colors = true;
            in_primary = false;
            continue;
        } else if line.starts_with("[colors.primary]") {
            in_colors = true;
            in_primary = true;
            continue;
        } else if line.starts_with('[') {
            in_colors = false;
            in_primary = false;
            continue;
        }
        if line.starts_with("scheme") || line.starts_with("colorscheme") {
            if let Some(idx) = line.find('=').or_else(|| line.find(':')) {
                let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                if !val.is_empty() {
                    return Some(val.to_string());
                }
            }
        }
        if (in_primary || in_colors) && line.starts_with("background") {
            if let Some(idx) = line.find('=').or_else(|| line.find(':')) {
                let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                if !val.is_empty() {
                    bg = Some(val.to_string());
                }
            }
        }
        if (in_primary || in_colors) && line.starts_with("foreground") {
            if let Some(idx) = line.find('=').or_else(|| line.find(':')) {
                let val = line[idx + 1..].trim().trim_matches('"').trim_matches('\'');
                if !val.is_empty() {
                    fg = Some(val.to_string());
                }
            }
        }
    }

    match (bg, fg) {
        (Some(b), Some(f)) => Some(format!("BG: {}, FG: {}", b, f)),
        (Some(b), None) => Some(format!("BG: {}", b)),
        (None, Some(f)) => Some(format!("FG: {}", f)),
        (None, None) => None,
    }
}

#[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows", test))]
pub(crate) fn parse_wezterm_theme(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("--") {
            continue;
        }
        if line.contains("color_scheme") {
            if let Some(idx) = line.find('=') {
                let rest = line[idx + 1..].trim().trim_end_matches(',');
                let val = rest.trim_matches('"').trim_matches('\'');
                if !val.is_empty() {
                    return Some(val.to_string());
                }
            }
        }
    }
    None
}

#[cfg(any(target_os = "linux", test))]
pub(crate) fn parse_foot_theme(content: &str) -> Option<String> {
    let mut bg = None;
    let mut fg = None;
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with("include") {
            let rest = line
                .trim_start_matches("include")
                .trim()
                .trim_start_matches('=')
                .trim();
            let p = std::path::Path::new(rest);
            if let Some(stem) = p.file_stem().and_then(|s| s.to_str()) {
                if !stem.is_empty() {
                    return Some(stem.to_string());
                }
            }
        } else if line.starts_with("background=") {
            let val = line.trim_start_matches("background=").trim();
            if !val.is_empty() {
                bg = Some(val.to_string());
            }
        } else if line.starts_with("foreground=") {
            let val = line.trim_start_matches("foreground=").trim();
            if !val.is_empty() {
                fg = Some(val.to_string());
            }
        }
    }
    match (bg, fg) {
        (Some(b), Some(f)) => Some(format!("BG: #{}, FG: #{}", b, f)),
        (Some(b), None) => Some(format!("BG: #{}", b)),
        (None, Some(f)) => Some(format!("FG: #{}", f)),
        (None, None) => None,
    }
}

#[cfg(any(target_os = "windows", test))]
pub(crate) fn parse_windows_terminal_theme(settings_json: &str) -> Option<String> {
    for line in settings_json.lines() {
        let line = line.trim();
        if line.contains("\"colorScheme\"") {
            if let Some(pos) = line.find("\"colorScheme\"") {
                let rest = &line[pos + 13..];
                if let Some(colon) = rest.find(':') {
                    let val_part = rest[colon + 1..].trim().trim_end_matches(',');
                    let val = val_part.trim_matches('"').trim_matches('\'');
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
pub(crate) fn parse_konsole_theme(profile_content: &str) -> Option<String> {
    for line in profile_content.lines() {
        let line = line.trim();
        if line.starts_with("ColorScheme=") {
            let val = line.trim_start_matches("ColorScheme=").trim();
            if !val.is_empty() {
                return Some(val.to_string());
            }
        }
    }
    None
}

pub(crate) fn detect_terminal_theme(terminal: Option<&str>) -> Option<String> {
    let term = terminal?;
    let term_lower = term.to_lowercase();
    let home = dirs::home_dir();

    if term_lower.contains("kitty") {
        if let Some(ref h) = home {
            let kitty_dir = h.join(".config/kitty");
            let conf_path = kitty_dir.join("kitty.conf");
            if let Ok(content) = std::fs::read_to_string(&conf_path) {
                if let Some(theme) = parse_kitty_theme(&content, Some(&kitty_dir)) {
                    return Some(theme);
                }
            }
        }
    } else if term_lower.contains("alacritty") {
        if let Some(ref h) = home {
            for path in &[
                h.join(".config/alacritty/alacritty.toml"),
                h.join(".config/alacritty/alacritty.yml"),
                h.join(".alacritty.toml"),
                h.join(".alacritty.yml"),
            ] {
                if let Ok(content) = std::fs::read_to_string(path) {
                    if let Some(theme) = parse_alacritty_theme(&content) {
                        return Some(theme);
                    }
                }
            }
        }
    } else if term_lower.contains("wezterm") {
        if let Some(ref h) = home {
            for path in &[
                h.join(".wezterm.lua"),
                h.join(".config/wezterm/wezterm.lua"),
            ] {
                if let Ok(content) = std::fs::read_to_string(path) {
                    if let Some(theme) = parse_wezterm_theme(&content) {
                        return Some(theme);
                    }
                }
            }
        }
    } else if term_lower.contains("foot") {
        if let Some(ref h) = home {
            let conf_path = h.join(".config/foot/foot.ini");
            if let Ok(content) = std::fs::read_to_string(&conf_path) {
                if let Some(theme) = parse_foot_theme(&content) {
                    return Some(theme);
                }
            }
        }
    } else if term_lower.contains("konsole") {
        if let Some(ref h) = home {
            let rc_path = h.join(".config/konsolerc");
            let mut profile_name = "Default.profile".to_string();
            if let Ok(content) = std::fs::read_to_string(&rc_path) {
                for line in content.lines() {
                    let line = line.trim();
                    if line.starts_with("DefaultProfile=") {
                        profile_name = line.trim_start_matches("DefaultProfile=").to_string();
                        break;
                    }
                }
            }
            let profile_path = h.join(".local/share/konsole").join(profile_name);
            if let Ok(content) = std::fs::read_to_string(&profile_path) {
                if let Some(theme) = parse_konsole_theme(&content) {
                    return Some(theme);
                }
            }
        }
    } else if term_lower.contains("ptyxis") {
        #[cfg(target_os = "linux")]
        if let Ok(output) = std::process::Command::new("gsettings")
            .args(["get", "org.gnome.Ptyxis", "palette"])
            .output()
        {
            if output.status.success() {
                let val = String::from_utf8_lossy(&output.stdout)
                    .trim()
                    .trim_matches('\'')
                    .to_string();
                if !val.is_empty() && val != "''" {
                    return Some(val);
                }
            }
        }
    }

    #[cfg(target_os = "windows")]
    if term_lower.contains("windowsterminal")
        || term_lower.contains("windows terminal")
        || term_lower.contains("wt")
    {
        if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
            let pkg_dir = std::path::Path::new(&local_app_data)
                .join("Packages/Microsoft.WindowsTerminal_8wekyb3d8bbwe/LocalState/settings.json");
            let unpkg_dir = std::path::Path::new(&local_app_data)
                .join("Microsoft/Windows Terminal/settings.json");
            for path in &[pkg_dir, unpkg_dir] {
                if let Ok(content) = std::fs::read_to_string(path) {
                    if let Some(theme) = parse_windows_terminal_theme(&content) {
                        return Some(theme);
                    }
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    if term_lower == "iterm.app" || term_lower.contains("iterm2") {
        if let Ok(output) = std::process::Command::new("defaults")
            .args(["read", "com.googlecode.iterm2", "Custom Color Presets"])
            .output()
        {
            if let Ok(s) = String::from_utf8(output.stdout) {
                let theme = s.trim();
                if !theme.is_empty() && theme != "0" {
                    return Some(theme.to_string());
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    if term_lower == "terminal"
        || term_lower == "apple_terminal"
        || term_lower.contains("terminal.app")
    {
        if let Ok(output) = std::process::Command::new("defaults")
            .args(["read", "com.apple.Terminal", "Default Window Settings"])
            .output()
        {
            if let Ok(s) = String::from_utf8(output.stdout) {
                let theme = s.trim();
                if !theme.is_empty() {
                    return Some(theme.to_string());
                }
            }
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_window_rect_to_size() {
        // A typical 120x30 console: inclusive rect 0..=119 / 0..=29.
        assert_eq!(
            window_rect_to_size(0, 0, 119, 29),
            Some("120x30".to_string())
        );
        // A single cell.
        assert_eq!(window_rect_to_size(0, 0, 0, 0), Some("1x1".to_string()));
        // Non-zero origin still measures the span, not the offset.
        assert_eq!(window_rect_to_size(5, 2, 84, 26), Some("80x25".to_string()));
        // Inverted/degenerate rect -> None (guards against a bogus read).
        assert_eq!(window_rect_to_size(10, 0, 0, 10), None);
        assert_eq!(window_rect_to_size(0, 10, 10, 0), None);
    }

    /// The OS writes `CONSOLE_SCREEN_BUFFER_INFO` by offset, so its size must
    /// match the Win32 definition (5 `COORD`/`SMALL_RECT` shorts + one `WORD`).
    #[cfg(target_os = "windows")]
    #[test]
    fn test_console_screen_buffer_info_layout() {
        use std::mem::size_of;
        assert_eq!(size_of::<Coord>(), 4);
        assert_eq!(size_of::<SmallRect>(), 8);
        // 4 (size) + 4 (cursor) + 2 (attributes) + 8 (window) + 4 (max) = 22.
        assert_eq!(size_of::<ConsoleScreenBufferInfo>(), 22);
    }

    #[test]
    fn test_parse_kitty_theme() {
        let conf = "include themes/catppuccin-mocha.conf\nfont_size 12.0\n";
        assert_eq!(
            parse_kitty_theme(conf, None),
            Some("catppuccin-mocha".to_string())
        );

        let conf_colors = "background #1e1e2e\nforeground #cdd6f4\n";
        assert_eq!(
            parse_kitty_theme(conf_colors, None),
            Some("BG: #1e1e2e, FG: #cdd6f4".to_string())
        );
    }

    #[test]
    fn test_parse_alacritty_theme() {
        let conf = r#"
import = [
    "~/.config/alacritty/themes/dracula.toml"
]
"#;
        assert_eq!(parse_alacritty_theme(conf), Some("dracula".to_string()));

        let conf_colors = r##"
[colors.primary]
background = "#282a36"
foreground = "#f8f8f2"
"##;
        assert_eq!(
            parse_alacritty_theme(conf_colors),
            Some("BG: #282a36, FG: #f8f8f2".to_string())
        );
    }

    #[test]
    fn test_parse_wezterm_theme() {
        let conf = r#"
local wezterm = require 'wezterm'
local config = {}
config.color_scheme = 'Tokyo Night'
return config
"#;
        assert_eq!(parse_wezterm_theme(conf), Some("Tokyo Night".to_string()));
    }

    #[test]
    fn test_parse_foot_theme() {
        let conf = "include=/usr/share/foot/themes/nord\n";
        assert_eq!(parse_foot_theme(conf), Some("nord".to_string()));

        let conf_colors = "[colors]\nbackground=2e3440\nforeground=d8dee9\n";
        assert_eq!(
            parse_foot_theme(conf_colors),
            Some("BG: #2e3440, FG: #d8dee9".to_string())
        );
    }

    #[test]
    fn test_parse_windows_terminal_theme() {
        let json = r#"{
    "profiles": {
        "defaults": {
            "colorScheme": "Campbell"
        }
    }
}"#;
        assert_eq!(
            parse_windows_terminal_theme(json),
            Some("Campbell".to_string())
        );
    }

    #[test]
    fn test_parse_konsole_theme() {
        let profile = "[Appearance]\nColorScheme=Breeze\nFont=Hack,10,-1,5,50,0,0,0,0,0\n";
        assert_eq!(parse_konsole_theme(profile), Some("Breeze".to_string()));
    }
}
