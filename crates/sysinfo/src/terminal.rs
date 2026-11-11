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

/// How many processes the terminal lookup examines: retch itself and up to 11 ancestors.
const MAX_ANCESTORS: usize = 12;

/// The name retch reports for Windows Terminal, before any version is appended.
const WINDOWS_TERMINAL: &str = "Windows Terminal";

/// Process-name patterns of known terminal emulators, paired with the name retch reports.
///
/// Matched against the *lowercased* process name, so every pattern must be lowercase: an
/// uppercase pattern can never match anything, which is how a `"Terminal"` entry sat in
/// this list unmatched until v0.17.7. Apple's Terminal is handled separately, in
/// [`terminal_from_process_name`].
const KNOWN_TERMINALS: &[(&str, &str)] = &[
    ("kitty", "kitty"),
    ("alacritty", "alacritty"),
    ("wezterm", "wezterm"),
    ("ghostty", "Ghostty"),
    ("warp", "Warp"),
    ("antigravity", "Antigravity"),
    ("cursor", "Cursor"),
    ("zed", "Zed"),
    ("hyper", "Hyper"),
    ("tabby", "Tabby"),
    ("wave", "Wave"),
    ("gnome-terminal", "gnome-terminal"),
    ("konsole", "konsole"),
    ("iterm2", "iterm2"),
    ("windowsterminal", WINDOWS_TERMINAL),
    ("rio", "rio"),
    ("foot", "foot"),
    ("tilix", "tilix"),
    ("xfce4-terminal", "xfce4-terminal"),
    ("terminator", "terminator"),
    ("st", "st"),
    ("urxvt", "urxvt"),
    ("ptyxis", "ptyxis"),
];

/// Maps a process name to the terminal emulator it identifies, if any.
///
/// Case-insensitive, and tolerant of a `.exe` suffix. Apple's Terminal runs as a process
/// named exactly `Terminal`, so it is matched exactly rather than by substring: a substring
/// `terminal` would also claim `xfce4-terminal` and `WindowsTerminal.exe`, ahead of their
/// own entries.
fn terminal_from_process_name(name: &str) -> Option<&'static str> {
    let name = name.to_lowercase();
    if name == "terminal" {
        return Some("Terminal");
    }
    KNOWN_TERMINALS
        .iter()
        .find(|(pattern, _)| {
            name == *pattern
                || name.ends_with(pattern)
                || (name.contains(pattern) && pattern.len() > 3)
        })
        .map(|(_, label)| *label)
}

/// Decides which terminal emulator is running retch.
///
/// `env` reads an environment variable and `ancestors` holds process names from retch
/// upward, nearest first. Both are parameters so the order of precedence is unit-tested
/// without touching the real environment or process table:
///
/// 1. Variables a terminal sets for itself: `TERM_PROGRAM`, `TERMINAL_EMULATOR`, Alacritty's.
/// 2. A known terminal among the ancestors.
/// 3. `WT_SESSION`, which Windows Terminal sets. It comes after the tree walk because child
///    processes inherit it — a terminal launched *from* a Windows Terminal tab still carries
///    it — and an ancestor that really is a terminal is the stronger evidence. It is still
///    needed because the walk is bounded: from an agent or a nested shell, Windows Terminal
///    can sit above the walk's reach (six levels up, measured on arrakis). It is deliberately
///    not Windows-only: Windows Terminal forwards it into WSL through `WSLENV`, where no
///    process walk can see the Windows side at all.
/// 4. `TERM`, when it names something more specific than a generic xterm.
fn resolve_terminal(env: impl Fn(&str) -> Option<String>, ancestors: &[String]) -> Option<String> {
    let set = |key: &str| env(key).filter(|value| !value.is_empty());

    if let Some(prog) = set("TERM_PROGRAM") {
        return Some(prog);
    }
    if let Some(prog) = set("TERMINAL_EMULATOR") {
        return Some(prog);
    }
    if env("ALACRITTY_LOG").is_some() || env("ALACRITTY_WINDOW_ID").is_some() {
        return Some("alacritty".to_string());
    }
    if set("KITTY_PID").is_some() || set("KITTY_WINDOW_ID").is_some() {
        return Some("kitty".to_string());
    }
    if set("GHOSTTY_RESOURCES_DIR").is_some() {
        return Some("Ghostty".to_string());
    }
    if set("WEZTERM_EXECUTABLE").is_some() {
        return Some("wezterm".to_string());
    }

    if let Some(term) = ancestors
        .iter()
        .find_map(|name| terminal_from_process_name(name))
    {
        return Some(term.to_string());
    }

    if set("WT_SESSION").is_some() {
        return Some(WINDOWS_TERMINAL.to_string());
    }

    if let Some(term) = env("TERM") {
        let lower = term.trim().to_ascii_lowercase();
        if !matches!(
            lower.as_str(),
            "" | "xterm-256color"
                | "xterm"
                | "linux"
                | "cygwin"
                | "dumb"
                | "vt100"
                | "ansi"
                | "unknown"
                | "screen"
                | "screen-256color"
                | "tmux"
                | "tmux-256color"
        ) {
            if let Some(stripped) = term.strip_prefix("xterm-") {
                return Some(stripped.to_string());
            }
            return Some(term);
        }
    }

    // Detached terminal multiplexer servers (zellij, tmux, screen) reparent under
    // systemd/init, so when no outer terminal emulator variable was forwarded into the
    // session, report the multiplexer hosting the PTY rather than None.
    if set("ZELLIJ").is_some()
        || set("ZELLIJ_SESSION_NAME").is_some()
        || ancestors.iter().any(|n| n.eq_ignore_ascii_case("zellij"))
    {
        return Some("zellij".to_string());
    }
    if set("TMUX").is_some()
        || ancestors
            .iter()
            .any(|n| n.eq_ignore_ascii_case("tmux") || n.starts_with("tmux:"))
        || set("TERM")
            .map(|t| {
                let l = t.trim().to_ascii_lowercase();
                l == "tmux" || l == "tmux-256color"
            })
            .unwrap_or(false)
    {
        return Some("tmux".to_string());
    }
    if set("STY").is_some()
        || ancestors.iter().any(|n| n.eq_ignore_ascii_case("screen"))
        || set("TERM")
            .map(|t| {
                let l = t.trim().to_ascii_lowercase();
                l == "screen" || l == "screen-256color"
            })
            .unwrap_or(false)
    {
        return Some("screen".to_string());
    }

    None
}

/// Reads Windows Terminal's package version from the path of its executable.
///
/// A Store (MSIX) install runs from
/// `…\WindowsApps\<Name>_<Version>_<Arch>_<ResourceId>_<PublisherId>\WindowsTerminal.exe`,
/// and `<Version>` is the version Windows Terminal reports for itself — `1.24.11911.0` on
/// arrakis, matching fastfetch. The executable's own file-version resource says
/// `1.24.2607.10001` for that same install, an internal build number that matches neither,
/// so it is deliberately not used. An unpackaged install has no such folder: `None`.
#[cfg(any(target_os = "windows", test))]
fn windows_terminal_package_version(image_path: &str) -> Option<String> {
    let mut components = image_path.rsplit(['\\', '/']);
    let _exe = components.next()?;
    let mut fields = components.next()?.split('_');
    let package_name = fields.next()?;
    if !package_name
        .to_ascii_lowercase()
        .starts_with("microsoft.windowsterminal")
    {
        return None;
    }
    let version = fields.next()?;
    let parts: Vec<&str> = version.split('.').collect();
    let well_formed = parts.len() == 4
        && parts
            .iter()
            .all(|p| !p.is_empty() && p.bytes().all(|b| b.is_ascii_digit()));
    well_formed.then(|| version.to_string())
}

/// The version every instance agrees on, or `None`.
///
/// Used when the process walk did not reach Windows Terminal, so nothing says *which*
/// running instance hosts retch. Stable beside Preview, an instance mid-update, or an
/// unpackaged instance (`None`) all leave that open, and the name alone beats a guess.
#[cfg(any(target_os = "windows", test))]
fn unanimous_version(versions: &[Option<String>]) -> Option<String> {
    let first = versions.first()?.as_ref()?;
    versions
        .iter()
        .all(|v| v.as_ref() == Some(first))
        .then(|| first.clone())
}

/// Full path of a process's executable, via `QueryFullProcessImageNameW`.
///
/// `PROCESS_QUERY_LIMITED_INFORMATION` is the least access that answers, and it is granted
/// for the user's own processes without elevation — including a Store app under
/// `WindowsApps`, a directory the user cannot even list. The process list retch loads does
/// not carry executable paths, and asking sysinfo for them would open every process on the
/// machine; this opens only the Windows Terminal ones.
#[cfg(target_os = "windows")]
fn process_image_path(pid: u32) -> Option<String> {
    use std::ffi::c_void;
    const PROCESS_QUERY_LIMITED_INFORMATION: u32 = 0x1000;
    // Room for the longest NT path (32 767 UTF-16 units) plus the terminator.
    const MAX_NT_PATH: usize = 32_768;

    // kernel32 is linked by default on the MSVC target.
    extern "system" {
        fn OpenProcess(desired_access: u32, inherit_handle: i32, process_id: u32) -> *mut c_void;
        fn QueryFullProcessImageNameW(
            process: *mut c_void,
            flags: u32,
            exe_name: *mut u16,
            size: *mut u32,
        ) -> i32;
        fn CloseHandle(object: *mut c_void) -> i32;
    }

    // SAFETY: OpenProcess takes plain values and returns a handle or null.
    let handle = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid) };
    if handle.is_null() {
        return None;
    }
    let mut buf = vec![0u16; MAX_NT_PATH];
    let mut len = buf.len() as u32;
    // SAFETY: `handle` is a live process handle; `buf` holds `len` UTF-16 units, the call
    // writes at most that many and stores the count written (excluding the NUL) in `len`.
    let ok = unsafe { QueryFullProcessImageNameW(handle, 0, buf.as_mut_ptr(), &mut len) };
    // SAFETY: `handle` came from OpenProcess above and is closed exactly once.
    unsafe { CloseHandle(handle) };
    (ok != 0).then(|| String::from_utf16_lossy(&buf[..len as usize]))
}

/// Windows Terminal's package version for the instance hosting retch, if it can be known.
///
/// An ancestor that is Windows Terminal is authoritative — its version or none. Without one
/// (the walk stopped short, or only `WT_SESSION` identified it) every running instance is
/// consulted, and a version is reported only if they all agree.
#[cfg(target_os = "windows")]
fn windows_terminal_version(sys: &System, chain: &[(u32, String)]) -> Option<String> {
    let is_windows_terminal = |name: &str| {
        let name = name.to_ascii_lowercase();
        name.strip_suffix(".exe").unwrap_or(&name) == "windowsterminal"
    };
    let version_of =
        |pid: u32| process_image_path(pid).and_then(|p| windows_terminal_package_version(&p));

    if let Some((pid, _)) = chain.iter().find(|(_, name)| is_windows_terminal(name)) {
        return version_of(*pid);
    }
    let running: Vec<Option<String>> = sys
        .processes()
        .values()
        .filter(|p| is_windows_terminal(&p.name().to_string_lossy()))
        .map(|p| version_of(p.pid().as_u32()))
        .collect();
    unanimous_version(&running)
}

/// Extracts the application name and version from an executable path inside a macOS `.app`
/// bundle and its `Contents/Info.plist` XML.
#[cfg(any(target_os = "macos", test))]
pub fn parse_macos_app_bundle_terminal(
    exe_path: &str,
    info_plist_xml: Option<&str>,
) -> Option<String> {
    let idx = exe_path.find(".app/")?;
    let before_app = &exe_path[..idx];
    // Ignore macOS system core services (e.g. loginwindow.app) that are not terminals/IDEs.
    if exe_path.starts_with("/System/Library/CoreServices/") {
        return None;
    }
    let bundle_stem = before_app.rsplit('/').next().filter(|s| !s.is_empty())?;
    let name = info_plist_xml
        .and_then(|xml| {
            crate::wm::parse_plist_key_string(xml, "CFBundleDisplayName")
                .or_else(|| crate::wm::parse_plist_key_string(xml, "CFBundleName"))
        })
        .unwrap_or_else(|| bundle_stem.to_string());
    let ver = info_plist_xml.and_then(crate::wm::parse_plist_bundle_version);
    Some(match ver {
        Some(v) => format!("{} {}", name, v),
        None => name,
    })
}

/// Walks the ancestor PID chain on macOS to find the nearest enclosing `.app` bundle and
/// reads its `Contents/Info.plist` name + version.
#[cfg(target_os = "macos")]
fn macos_terminal_from_ancestors(chain: &[(u32, String)]) -> Option<String> {
    for (pid, _) in chain {
        if let Some(exe_path) = crate::macos_ffi::get_proc_pidpath(*pid as i32) {
            if let Some(plist_path) = crate::wm::app_bundle_info_plist_path(&exe_path) {
                let xml = std::fs::read_to_string(&plist_path).ok();
                if let Some(app_term) = parse_macos_app_bundle_terminal(&exe_path, xml.as_deref()) {
                    return Some(app_term);
                }
            }
        }
    }
    None
}

/// Names the terminal emulator running retch, or `None` when nothing identifies it.
///
/// See [`resolve_terminal`] for the order of precedence. On Windows, Windows Terminal's
/// package version is appended when [`windows_terminal_version`] can establish it. On
/// macOS, `.app` bundle ancestors and `TERM_PROGRAM_VERSION` provide the bundle name and
/// version when available.
pub(crate) fn detect_terminal(sys: &System) -> Option<String> {
    let chain = crate::proc_tree::ancestors(sys, MAX_ANCESTORS);
    let names: Vec<String> = chain.iter().map(|(_, name)| name.clone()).collect();
    let resolved = resolve_terminal(|key| std::env::var(key).ok(), &names);

    #[cfg(target_os = "macos")]
    {
        if let Some(ref term) = resolved {
            if let Ok(ver) = std::env::var("TERM_PROGRAM_VERSION") {
                let ver = ver.trim();
                if !ver.is_empty() && !term.contains(ver) {
                    return Some(format!("{term} {ver}"));
                }
            }
            if let Some(app_term) = macos_terminal_from_ancestors(&chain) {
                if app_term
                    .to_ascii_lowercase()
                    .starts_with(&term.to_ascii_lowercase())
                {
                    return Some(app_term);
                }
            }
        } else if let Some(app_term) = macos_terminal_from_ancestors(&chain) {
            return Some(app_term);
        }
    }

    let terminal = resolved?;

    #[cfg(target_os = "windows")]
    if terminal == WINDOWS_TERMINAL {
        if let Some(version) = windows_terminal_version(sys, &chain) {
            return Some(format!("{terminal} {version}"));
        }
    }
    Some(terminal)
}

pub(crate) fn detect_terminal_font(terminal: Option<&str>) -> Option<String> {
    let term = terminal?;
    let term_lower = term.to_lowercase();
    if term_lower.contains("zellij") {
        let home = dirs::home_dir();
        if let Some(content) = read_active_zellij_config(home.as_deref()) {
            return parse_zellij_font(&content);
        }
        return None;
    }
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
        if let Some(content) = read_bounded_regular_file(&rc_path) {
            for line in content.lines() {
                let line = line.trim();
                if let Some(val) = line.strip_prefix("DefaultProfile=") {
                    if let Some(clean) = sanitize_konsole_profile_name(val) {
                        profile_name = clean.to_string();
                    }
                    break;
                }
            }
        }
        let profile_path = home.join(".local/share/konsole").join(profile_name);
        if let Some(content) = read_bounded_regular_file(&profile_path) {
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
    } else if term_lower.contains("rio") {
        let conf_path = home.join(".config/rio/config.toml");
        if let Some(content) = read_bounded_regular_file(&conf_path) {
            if let Some(font) = parse_rio_font(&content) {
                return Some(font);
            }
        }
    } else if term_lower.contains("ghostty") {
        let conf_path = home.join(".config/ghostty/config");
        if let Some(content) = read_bounded_regular_file(&conf_path) {
            if let Some(font) = parse_ghostty_font(&content) {
                return Some(font);
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
                    if let Some(font) = parse_windows_terminal_font(&content) {
                        return Some(font);
                    }
                }
            }
        }
        return Some("Cascadia Mono (12)".to_string());
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

/// Maximum bytes read from a terminal configuration or theme file (1 MiB).
const MAX_TERMINAL_CONFIG_BYTES: u64 = 1024 * 1024;

/// Reads a regular file up to [`MAX_TERMINAL_CONFIG_BYTES`], rejecting FIFOs, device nodes,
/// and directories so a misconfigured or untrusted `include`/`DefaultProfile` path cannot
/// hang or exhaust memory.
pub(crate) fn read_bounded_regular_file(path: &std::path::Path) -> Option<String> {
    use std::io::Read;
    let meta = std::fs::metadata(path).ok()?;
    if !meta.is_file() || meta.len() > MAX_TERMINAL_CONFIG_BYTES {
        return None;
    }
    let file = std::fs::File::open(path).ok()?;
    let mut buf = String::new();
    file.take(MAX_TERMINAL_CONFIG_BYTES)
        .read_to_string(&mut buf)
        .ok()?;
    Some(buf)
}

/// Validates a `DefaultProfile=` value from `konsolerc` so it can only name a single file
/// within `~/.local/share/konsole` (rejecting absolute paths, `/` or `\` separators, and
/// `..` segments).
pub(crate) fn sanitize_konsole_profile_name(raw: &str) -> Option<&str> {
    let trimmed = raw.trim();
    if trimmed.is_empty()
        || trimmed == "."
        || trimmed == ".."
        || trimmed.contains('/')
        || trimmed.contains('\\')
        || trimmed.contains("..")
    {
        None
    } else {
        Some(trimmed)
    }
}

#[allow(dead_code)]
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
                    if let Some(theme_content) = read_bounded_regular_file(&full_p) {
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

#[allow(dead_code)]
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

#[allow(dead_code)]
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

#[allow(dead_code)]
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

#[allow(dead_code)]
pub(crate) fn parse_windows_terminal_font(settings_json: &str) -> Option<String> {
    let mut face: Option<String> = None;
    let mut size: Option<String> = None;
    let mut in_font_block = false;

    for line in settings_json.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("\"font\"") && trimmed.contains('{') {
            in_font_block = true;
            continue;
        }
        if in_font_block {
            if let Some(pos) = trimmed.find("\"face\"") {
                if let Some(colon) = trimmed[pos + 6..].find(':') {
                    let val = trimmed[pos + 6 + colon + 1..]
                        .trim()
                        .trim_end_matches(',')
                        .trim_matches('"')
                        .trim();
                    if !val.is_empty() && face.is_none() {
                        face = Some(val.to_string());
                    }
                }
            } else if let Some(pos) = trimmed.find("\"size\"") {
                if let Some(colon) = trimmed[pos + 6..].find(':') {
                    let val = trimmed[pos + 6 + colon + 1..]
                        .trim()
                        .trim_end_matches(',')
                        .trim_matches('"')
                        .trim();
                    if !val.is_empty() && size.is_none() {
                        size = Some(val.to_string());
                    }
                }
            }
            if trimmed.contains('}') {
                in_font_block = false;
            }
        } else if let Some(pos) = trimmed.find("\"fontFace\"") {
            if let Some(colon) = trimmed[pos + 10..].find(':') {
                let val = trimmed[pos + 10 + colon + 1..]
                    .trim()
                    .trim_end_matches(',')
                    .trim_matches('"')
                    .trim();
                if !val.is_empty() && face.is_none() {
                    face = Some(val.to_string());
                }
            }
        } else if let Some(pos) = trimmed.find("\"fontSize\"") {
            if let Some(colon) = trimmed[pos + 10..].find(':') {
                let val = trimmed[pos + 10 + colon + 1..]
                    .trim()
                    .trim_end_matches(',')
                    .trim_matches('"')
                    .trim();
                if !val.is_empty() && size.is_none() {
                    size = Some(val.to_string());
                }
            }
        }
    }

    match (face, size) {
        (Some(f), Some(s)) => Some(format!("{f} ({s})")),
        (Some(f), None) => Some(f),
        (None, Some(s)) => Some(format!("Cascadia Mono ({s})")),
        (None, None) => None,
    }
}

#[allow(dead_code)]
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

#[allow(dead_code)]
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

/// Extract a string or scalar value from the right-hand side of a TOML `key = value`
/// assignment, preserving `#` characters inside quoted strings (e.g. `"#0F0D0E"`) while
/// stripping trailing `#` comments on unquoted values.
#[allow(dead_code)]
fn extract_toml_value(raw_val: &str) -> &str {
    let trimmed = raw_val.trim();
    if let Some(rest) = trimmed.strip_prefix('"') {
        rest.split('"').next().unwrap_or("").trim()
    } else if let Some(rest) = trimmed.strip_prefix('\'') {
        rest.split('\'').next().unwrap_or("").trim()
    } else {
        trimmed.split('#').next().unwrap_or("").trim()
    }
}

/// Parse font family and size from a Rio terminal `~/.config/rio/config.toml` file.
#[allow(dead_code)]
pub(crate) fn parse_rio_font(content: &str) -> Option<String> {
    let mut in_fonts = false;
    let mut family: Option<String> = None;
    let mut size: Option<String> = None;

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.is_empty() {
            continue;
        }
        if line.starts_with("[fonts]") || line.starts_with("[fonts.") {
            in_fonts = true;
            continue;
        } else if line.starts_with('[') {
            in_fonts = false;
            continue;
        }
        if in_fonts {
            if let Some((key, raw_val)) = line.split_once('=') {
                let key = key.trim();
                let val = extract_toml_value(raw_val);
                if key == "family" && !val.is_empty() && family.is_none() {
                    family = Some(val.to_string());
                } else if key == "size" && !val.is_empty() && size.is_none() {
                    size = Some(val.to_string());
                }
            }
        }
    }

    match (family, size) {
        (Some(f), Some(s)) => Some(format!("{f} ({s})")),
        (Some(f), None) => Some(f),
        (None, Some(s)) => {
            let fallback =
                crate::theme::get_default_monospace_font().unwrap_or_else(|| "Default".to_string());
            Some(format!("{fallback} ({s})"))
        }
        (None, None) => None,
    }
}

/// Parse theme name or `[colors]` background/foreground from `~/.config/rio/config.toml`.
#[allow(dead_code)]
pub(crate) fn parse_rio_theme(content: &str) -> Option<String> {
    let mut in_section = false;
    let mut in_colors = false;
    let mut bg: Option<String> = None;
    let mut fg: Option<String> = None;

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.is_empty() {
            continue;
        }
        if line.starts_with("[colors]") {
            in_section = true;
            in_colors = true;
            continue;
        } else if line.starts_with('[') {
            in_section = true;
            in_colors = false;
            continue;
        }
        if let Some((key, raw_val)) = line.split_once('=') {
            let key = key.trim();
            let val = extract_toml_value(raw_val);
            if !in_section && key == "theme" && !val.is_empty() {
                return Some(val.to_string());
            } else if in_colors && key == "background" && !val.is_empty() {
                bg = Some(val.to_string());
            } else if in_colors && key == "foreground" && !val.is_empty() {
                fg = Some(val.to_string());
            }
        }
    }

    match (bg, fg) {
        (Some(b), Some(f)) => Some(format!("BG: {b}, FG: {f}")),
        (Some(b), None) => Some(format!("BG: {b}")),
        (None, Some(f)) => Some(format!("FG: {f}")),
        (None, None) => None,
    }
}

/// Parse `font-family` and `font-size` from a Ghostty `~/.config/ghostty/config` file.
#[allow(dead_code)]
pub(crate) fn parse_ghostty_font(content: &str) -> Option<String> {
    let mut family: Option<String> = None;
    let mut size: Option<String> = None;

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.is_empty() {
            continue;
        }
        if let Some((key, raw_val)) = line.split_once('=') {
            let key = key.trim();
            let val = raw_val.trim().trim_matches('"').trim_matches('\'');
            if key == "font-family" && !val.is_empty() && family.is_none() {
                family = Some(val.to_string());
            } else if key == "font-size" && !val.is_empty() && size.is_none() {
                size = Some(val.to_string());
            }
        }
    }

    match (family, size) {
        (Some(f), Some(s)) => Some(format!("{f} ({s})")),
        (Some(f), None) => Some(f),
        (None, Some(s)) => {
            let fallback =
                crate::theme::get_default_monospace_font().unwrap_or_else(|| "Default".to_string());
            Some(format!("{fallback} ({s})"))
        }
        (None, None) => None,
    }
}

/// Parse `theme = ...` from a Ghostty `~/.config/ghostty/config` file.
#[allow(dead_code)]
pub(crate) fn parse_ghostty_theme(content: &str) -> Option<String> {
    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') || line.is_empty() {
            continue;
        }
        if let Some((key, raw_val)) = line.split_once('=') {
            if key.trim() == "theme" {
                let val = raw_val.trim().trim_matches('"').trim_matches('\'');
                if !val.is_empty() {
                    return Some(val.to_string());
                }
            }
        }
    }
    None
}

/// Platform rules for Zellij's default config directory search order (`zellij_utils::home`).
/// Non-host OS variants are constructed by cross-platform unit tests.
#[allow(dead_code)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ZellijConfigPlatform {
    /// Linux, BSD, and other non-macOS Unix targets:
    /// `$HOME/.config/zellij` -> `$XDG_CONFIG_HOME/zellij` (`config_dir/zellij`) -> `/etc/zellij`.
    UnixOther,
    /// macOS (`target_os = "macos"`):
    /// `$HOME/.config/zellij` -> `~/Library/Application Support/org.Zellij-Contributors.Zellij` -> `/etc/zellij`.
    MacOs,
    /// Windows (`windows`):
    /// `%APPDATA%\Zellij\config` -> `C:\ProgramData\Zellij`.
    Windows,
}

impl ZellijConfigPlatform {
    const fn current() -> Self {
        #[cfg(target_os = "macos")]
        {
            Self::MacOs
        }
        #[cfg(windows)]
        {
            Self::Windows
        }
        #[cfg(all(not(target_os = "macos"), not(windows)))]
        {
            Self::UnixOther
        }
    }
}

/// Builds Zellij's candidate default config directories in exact upstream priority order
/// (`zellij_utils::home::default_config_dirs`).
fn default_zellij_config_dirs<E>(
    platform: ZellijConfigPlatform,
    env: E,
    config_dir: Option<&std::path::Path>,
    home: Option<&std::path::Path>,
) -> Vec<std::path::PathBuf>
where
    E: Fn(&str) -> Option<String>,
{
    let mut dirs = Vec::with_capacity(3);
    let mut push_unique = |candidate: std::path::PathBuf| {
        if !dirs.contains(&candidate) {
            dirs.push(candidate);
        }
    };

    match platform {
        ZellijConfigPlatform::UnixOther => {
            // Zellij checks `home_config_dir()` (`$HOME/.config/zellij`) *before* `xdg_config_dir()`.
            if let Some(h) = home {
                push_unique(h.join(".config/zellij"));
            }
            if let Some(xdg) = env("XDG_CONFIG_HOME")
                .map(std::path::PathBuf::from)
                .filter(|p| p.is_absolute())
            {
                push_unique(xdg.join("zellij"));
            } else if let Some(cfg) = config_dir {
                push_unique(cfg.join("zellij"));
            }
            push_unique(std::path::PathBuf::from("/etc/zellij"));
        }
        ZellijConfigPlatform::MacOs => {
            // On macOS, Zellij checks `$HOME/.config/zellij` first, then `directories::ProjectDirs`
            // (`~/Library/Application Support/org.Zellij-Contributors.Zellij`), then `/etc/zellij`.
            if let Some(h) = home {
                push_unique(h.join(".config/zellij"));
            }
            if let Some(cfg) = config_dir {
                push_unique(cfg.join("org.Zellij-Contributors.Zellij"));
            } else if let Some(h) = home {
                push_unique(h.join("Library/Application Support/org.Zellij-Contributors.Zellij"));
            }
            push_unique(std::path::PathBuf::from("/etc/zellij"));
        }
        ZellijConfigPlatform::Windows => {
            // On Windows, `directories::ProjectDirs::from("", "", "Zellij").config_dir()` resolves
            // to `%APPDATA%\Zellij\config`, followed by `C:\ProgramData\Zellij`.
            if let Some(cfg) = config_dir {
                push_unique(cfg.join("Zellij").join("config"));
            }
            push_unique(std::path::PathBuf::from(r"C:\ProgramData\Zellij"));
        }
    }

    dirs
}

/// Resolves and reads the single active Zellij configuration file, matching Zellij's own startup
/// precedence without falling through across candidate files when the active file omits a key:
/// 1. `$ZELLIJ_CONFIG_FILE` (if set and non-empty)
/// 2. `$ZELLIJ_CONFIG_DIR/config.kdl` (if set and non-empty)
/// 3. `find_default_config_dir()` — stops at the **first existing candidate directory** for the
///    platform and reads `config.kdl` inside it (returning `None` if that directory has no
///    `config.kdl`, without consulting lower-priority directories).
fn read_active_zellij_config_with<E, D, R>(
    platform: ZellijConfigPlatform,
    env: E,
    config_dir: Option<&std::path::Path>,
    home: Option<&std::path::Path>,
    mut dir_exists: D,
    mut read_file: R,
) -> Option<String>
where
    E: Fn(&str) -> Option<String>,
    D: FnMut(&std::path::Path) -> bool,
    R: FnMut(&std::path::Path) -> Option<String>,
{
    if let Some(file) = env("ZELLIJ_CONFIG_FILE") {
        if !file.is_empty() {
            return read_file(std::path::Path::new(&file));
        }
    }
    if let Some(dir) = env("ZELLIJ_CONFIG_DIR") {
        if !dir.is_empty() {
            return read_file(&std::path::Path::new(&dir).join("config.kdl"));
        }
    }
    for dir in default_zellij_config_dirs(platform, &env, config_dir, home) {
        if dir_exists(&dir) {
            return read_file(&dir.join("config.kdl"));
        }
    }
    None
}

/// Reads the single active Zellij `config.kdl` from the process environment and filesystem.
pub(crate) fn read_active_zellij_config(home: Option<&std::path::Path>) -> Option<String> {
    let cfg_dir = dirs::config_dir();
    read_active_zellij_config_with(
        ZellijConfigPlatform::current(),
        |k| std::env::var(k).ok(),
        cfg_dir.as_deref(),
        home,
        |p| p.exists(),
        read_bounded_regular_file,
    )
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum KdlToken {
    Ident(String),
    Str(String),
    Slashdash,
    LBrace,
    RBrace,
    Semi,
    Newline,
    Equals,
}

/// Tokenize a KDL configuration document into structural tokens while stripping `//` line
/// comments, nestable `/* ... */` block comments, `\` line continuations, and `(type)`
/// annotations, and decoding `"..."` / `r#"..."#` / `#"..."#` strings.
fn tokenize_kdl(content: &str) -> Vec<KdlToken> {
    let bytes = content.as_bytes();
    let len = bytes.len();
    let mut tokens = Vec::new();
    let mut i = 0usize;

    let try_raw_string = |start: usize| -> Option<(String, usize)> {
        let mut p = start;
        if bytes.get(p) == Some(&b'r') {
            p += 1;
            let hash_start = p;
            while bytes.get(p) == Some(&b'#') {
                p += 1;
            }
            let hashes = p - hash_start;
            if bytes.get(p) != Some(&b'"') {
                return None;
            }
            p += 1;
            let body_start = p;
            while p < len {
                if bytes[p] == b'"'
                    && p + 1 + hashes <= len
                    && bytes[p + 1..p + 1 + hashes].iter().all(|&b| b == b'#')
                {
                    return Some((content[body_start..p].to_string(), p + 1 + hashes));
                }
                p += 1;
            }
            Some((content[body_start..].to_string(), len))
        } else if bytes.get(p) == Some(&b'#') {
            let hash_start = p;
            while bytes.get(p) == Some(&b'#') {
                p += 1;
            }
            let hashes = p - hash_start;
            if hashes == 0 || bytes.get(p) != Some(&b'"') {
                return None;
            }
            p += 1;
            let body_start = p;
            while p < len {
                if bytes[p] == b'"'
                    && p + 1 + hashes <= len
                    && bytes[p + 1..p + 1 + hashes].iter().all(|&b| b == b'#')
                {
                    return Some((content[body_start..p].to_string(), p + 1 + hashes));
                }
                p += 1;
            }
            Some((content[body_start..].to_string(), len))
        } else {
            None
        }
    };

    while i < len {
        match bytes[i] {
            b' ' | b'\t' => {
                i += 1;
            }
            b'\r' | b'\n' => {
                if bytes[i] == b'\r' && bytes.get(i + 1) == Some(&b'\n') {
                    i += 2;
                } else {
                    i += 1;
                }
                if !matches!(tokens.last(), Some(KdlToken::Newline)) {
                    tokens.push(KdlToken::Newline);
                }
            }
            b'\\' => {
                // KDL line continuation: skip horizontal whitespace, optional comment, and newline.
                let mut p = i + 1;
                while matches!(bytes.get(p), Some(b' ' | b'\t')) {
                    p += 1;
                }
                if bytes.get(p) == Some(&b'/') && bytes.get(p + 1) == Some(&b'/') {
                    p += 2;
                    while p < len && !matches!(bytes[p], b'\r' | b'\n') {
                        p += 1;
                    }
                } else if bytes.get(p) == Some(&b'/') && bytes.get(p + 1) == Some(&b'*') {
                    let mut depth = 1usize;
                    p += 2;
                    while p < len && depth > 0 {
                        if bytes[p] == b'/' && bytes.get(p + 1) == Some(&b'*') {
                            depth += 1;
                            p += 2;
                        } else if bytes[p] == b'*' && bytes.get(p + 1) == Some(&b'/') {
                            depth -= 1;
                            p += 2;
                        } else {
                            p += 1;
                        }
                    }
                    while matches!(bytes.get(p), Some(b' ' | b'\t')) {
                        p += 1;
                    }
                }
                if bytes.get(p) == Some(&b'\r') && bytes.get(p + 1) == Some(&b'\n') {
                    i = p + 2;
                } else if matches!(bytes.get(p), Some(b'\r' | b'\n')) {
                    i = p + 1;
                } else {
                    i += 1;
                }
            }
            b'/' if bytes.get(i + 1) == Some(&b'/') => {
                i += 2;
                while i < len && !matches!(bytes[i], b'\r' | b'\n') {
                    i += 1;
                }
            }
            b'/' if bytes.get(i + 1) == Some(&b'*') => {
                let mut depth = 1usize;
                i += 2;
                while i < len && depth > 0 {
                    if bytes[i] == b'/' && bytes.get(i + 1) == Some(&b'*') {
                        depth += 1;
                        i += 2;
                    } else if bytes[i] == b'*' && bytes.get(i + 1) == Some(&b'/') {
                        depth -= 1;
                        i += 2;
                    } else {
                        i += 1;
                    }
                }
            }
            b'/' if bytes.get(i + 1) == Some(&b'-') => {
                i += 2;
                tokens.push(KdlToken::Slashdash);
            }
            b'(' => {
                // Skip KDL `(type)` annotation.
                let mut depth = 1usize;
                i += 1;
                while i < len && depth > 0 {
                    if bytes[i] == b'(' {
                        depth += 1;
                    } else if bytes[i] == b')' {
                        depth -= 1;
                    }
                    i += 1;
                }
            }
            b'{' => {
                i += 1;
                tokens.push(KdlToken::LBrace);
            }
            b'}' => {
                i += 1;
                tokens.push(KdlToken::RBrace);
            }
            b';' => {
                i += 1;
                tokens.push(KdlToken::Semi);
            }
            b'=' => {
                i += 1;
                tokens.push(KdlToken::Equals);
            }
            b'"' => {
                i += 1;
                let mut out = String::new();
                let mut escaped = false;
                for ch in content[i..].chars() {
                    i += ch.len_utf8();
                    if escaped {
                        match ch {
                            'n' => out.push('\n'),
                            'r' => out.push('\r'),
                            't' => out.push('\t'),
                            '\\' => out.push('\\'),
                            '"' => out.push('"'),
                            '/' => out.push('/'),
                            other => out.push(other),
                        }
                        escaped = false;
                    } else if ch == '\\' {
                        escaped = true;
                    } else if ch == '"' {
                        break;
                    } else {
                        out.push(ch);
                    }
                }
                tokens.push(KdlToken::Str(out));
            }
            b'r' | b'#' => {
                if let Some((raw, next_i)) = try_raw_string(i) {
                    tokens.push(KdlToken::Str(raw));
                    i = next_i;
                    continue;
                }
                if bytes[i] == b'#'
                    && (tokens.is_empty() || matches!(tokens.last(), Some(KdlToken::Newline)))
                    && matches!(bytes.get(i + 1), None | Some(b' ' | b'\t' | b'\r' | b'\n'))
                {
                    while i < len && !matches!(bytes[i], b'\r' | b'\n') {
                        i += 1;
                    }
                    continue;
                }
                let start = i;
                while i < len
                    && !matches!(
                        bytes[i],
                        b' ' | b'\t'
                            | b'\r'
                            | b'\n'
                            | b'{'
                            | b'}'
                            | b';'
                            | b'='
                            | b'"'
                            | b'('
                            | b')'
                    )
                    && !(bytes[i] == b'/' && matches!(bytes.get(i + 1), Some(b'/' | b'*')))
                {
                    i += 1;
                }
                tokens.push(KdlToken::Ident(content[start..i].to_string()));
            }
            _ => {
                let start = i;
                while i < len
                    && !matches!(
                        bytes[i],
                        b' ' | b'\t'
                            | b'\r'
                            | b'\n'
                            | b'{'
                            | b'}'
                            | b';'
                            | b'='
                            | b'"'
                            | b'('
                            | b')'
                    )
                    && !(bytes[i] == b'/' && matches!(bytes.get(i + 1), Some(b'/' | b'*')))
                {
                    i += 1;
                }
                if i > start {
                    tokens.push(KdlToken::Ident(content[start..i].to_string()));
                } else {
                    i += 1;
                }
            }
        }
    }

    tokens
}

/// Skip a `{ ... }` block starting at `tokens[*pos] == KdlToken::LBrace`.
fn skip_kdl_brace_block(tokens: &[KdlToken], pos: &mut usize) {
    if !matches!(tokens.get(*pos), Some(KdlToken::LBrace)) {
        return;
    }
    *pos += 1;
    let mut depth = 1usize;
    while *pos < tokens.len() && depth > 0 {
        match tokens[*pos] {
            KdlToken::LBrace => depth += 1,
            KdlToken::RBrace => depth -= 1,
            _ => {}
        }
        *pos += 1;
    }
}

/// Returns true when `ident` looks like a bare KDL sibling node name rather than a numeric or
/// boolean/null literal argument.
fn is_bare_kdl_node_ident(ident: &str) -> bool {
    ident
        .bytes()
        .next()
        .is_some_and(|b| b.is_ascii_alphabetic() || b == b'_')
        && !matches!(ident, "true" | "false" | "null")
}

/// Walk active (non-slashdashed) KDL nodes iteratively, invoking `visit(stack, name, entries,
/// has_children)` where `stack` holds the enclosing block names from outermost to innermost.
fn visit_kdl_nodes<F>(content: &str, mut visit: F)
where
    F: FnMut(&[String], &str, &[(Option<String>, String)], bool),
{
    let tokens = tokenize_kdl(content);
    let mut stack: Vec<String> = Vec::new();
    let mut pos = 0usize;

    while pos < tokens.len() {
        match tokens[pos] {
            KdlToken::Newline | KdlToken::Semi => {
                pos += 1;
                continue;
            }
            KdlToken::RBrace => {
                stack.pop();
                pos += 1;
                continue;
            }
            _ => {}
        }

        let mut node_commented = false;
        while matches!(tokens.get(pos), Some(KdlToken::Slashdash)) {
            node_commented = true;
            pos += 1;
            while matches!(tokens.get(pos), Some(KdlToken::Newline)) {
                pos += 1;
            }
        }
        if pos >= tokens.len() {
            break;
        }

        if matches!(tokens[pos], KdlToken::LBrace) {
            if node_commented {
                skip_kdl_brace_block(&tokens, &mut pos);
            } else {
                stack.push(String::new());
                pos += 1;
            }
            continue;
        }
        if matches!(tokens[pos], KdlToken::RBrace | KdlToken::Semi) {
            continue;
        }

        let node_name = match &tokens[pos] {
            KdlToken::Ident(s) | KdlToken::Str(s) => s.clone(),
            _ => {
                pos += 1;
                continue;
            }
        };
        pos += 1;

        let mut entries: Vec<(Option<String>, String)> = Vec::new();
        let mut entries_seen = 0usize;
        let mut has_children = false;
        let mut enter_children = false;

        while pos < tokens.len() {
            match &tokens[pos] {
                KdlToken::Newline | KdlToken::Semi => {
                    pos += 1;
                    break;
                }
                KdlToken::RBrace => break,
                KdlToken::LBrace => {
                    has_children = true;
                    if node_commented {
                        skip_kdl_brace_block(&tokens, &mut pos);
                    } else {
                        enter_children = true;
                        pos += 1;
                    }
                    break;
                }
                KdlToken::Slashdash => {
                    pos += 1;
                    while matches!(tokens.get(pos), Some(KdlToken::Newline)) {
                        pos += 1;
                    }
                    if matches!(tokens.get(pos), Some(KdlToken::LBrace)) {
                        skip_kdl_brace_block(&tokens, &mut pos);
                    } else if matches!(tokens.get(pos), Some(KdlToken::Ident(_) | KdlToken::Str(_)))
                        && matches!(tokens.get(pos + 1), Some(KdlToken::Equals))
                    {
                        pos += 2;
                        if matches!(tokens.get(pos), Some(KdlToken::Ident(_) | KdlToken::Str(_))) {
                            pos += 1;
                        }
                    } else if matches!(tokens.get(pos), Some(KdlToken::Ident(_) | KdlToken::Str(_)))
                    {
                        pos += 1;
                    }
                }
                KdlToken::Ident(key) | KdlToken::Str(key)
                    if matches!(tokens.get(pos + 1), Some(KdlToken::Equals)) =>
                {
                    let key = key.clone();
                    pos += 2;
                    if let Some(KdlToken::Ident(val) | KdlToken::Str(val)) = tokens.get(pos) {
                        if !node_commented {
                            entries.push((Some(key), val.clone()));
                        }
                        entries_seen += 1;
                        pos += 1;
                    }
                }
                KdlToken::Ident(ident) if entries_seen >= 1 && is_bare_kdl_node_ident(ident) => {
                    // Same-line sibling KDL node without an intervening `;` (e.g.
                    // `terminal { font "JetBrains Mono" font_size 13 }`): finish the current
                    // node so the outer loop visits `ident` as the next sibling statement.
                    break;
                }
                KdlToken::Ident(val) | KdlToken::Str(val) => {
                    if !node_commented {
                        entries.push((None, val.clone()));
                    }
                    entries_seen += 1;
                    pos += 1;
                }
                KdlToken::Equals => {
                    pos += 1;
                }
            }
        }

        if !node_commented {
            visit(&stack, &node_name, &entries, has_children);
            if enter_children {
                stack.push(node_name);
            }
        }
    }
}

/// Validate a Zellij `font_size` value (positive finite integer or floating-point number).
fn clean_zellij_font_size(raw: &str) -> Option<String> {
    let trimmed = raw.trim();
    if trimmed
        .parse::<f32>()
        .is_ok_and(|n| n.is_finite() && n > 0.0)
    {
        Some(trimmed.to_string())
    } else {
        None
    }
}

/// Parse `font` and `font_size` from the top-level `terminal { ... }` section of a Zellij 0.46+
/// `config.kdl` file.
///
/// Tracks KDL brace depth and `/-` / `/* ... */` / `//` comments so `web_client { ... }`, nested
/// `terminal { theme { ... } }` blocks, and slashdashed nodes (including `/-` followed by a
/// newline) are ignored, while supporting both multi-line and single-line `terminal` blocks. When
/// only `font_size` is set inside `terminal { ... }`, falls back to Zellij's bundled
/// `Iosevka Term` family.
pub(crate) fn parse_zellij_font(content: &str) -> Option<String> {
    let mut family: Option<String> = None;
    let mut size: Option<String> = None;

    visit_kdl_nodes(content, |stack, name, entries, has_children| {
        if stack.is_empty() && name == "terminal" {
            for (prop, val) in entries {
                match prop.as_deref() {
                    Some("font") if family.is_none() => {
                        let clean = val.trim();
                        if !clean.is_empty() {
                            family = Some(clean.to_string());
                        }
                    }
                    Some("font_size") if size.is_none() => {
                        size = clean_zellij_font_size(val);
                    }
                    _ => {}
                }
            }
            return;
        }

        if stack.len() == 1 && stack[0] == "terminal" && !has_children {
            let first_arg = entries
                .iter()
                .find_map(|(k, v)| k.is_none().then_some(v.as_str()));
            if name == "font" && family.is_none() {
                if let Some(clean) = first_arg.map(str::trim).filter(|s| !s.is_empty()) {
                    family = Some(clean.to_string());
                }
            } else if name == "font_size" && size.is_none() {
                if let Some(arg) = first_arg {
                    size = clean_zellij_font_size(arg);
                }
            }
        }
    });

    match (family, size) {
        (Some(f), Some(s)) => Some(format!("{f} ({s})")),
        (Some(f), None) => Some(f),
        (None, Some(s)) => Some(format!("Iosevka Term ({s})")),
        (None, None) => None,
    }
}

/// Parse top-level `theme "<name>"` from a Zellij `config.kdl` file.
pub(crate) fn parse_zellij_theme(content: &str) -> Option<String> {
    let mut found: Option<String> = None;
    visit_kdl_nodes(content, |stack, name, entries, has_children| {
        if found.is_none() && stack.is_empty() && name == "theme" && !has_children {
            if let Some(val) = entries
                .iter()
                .find_map(|(k, v)| k.is_none().then_some(v.as_str()))
            {
                let clean = val.trim().trim_matches('\'');
                if !clean.is_empty() {
                    found = Some(clean.to_string());
                }
            }
        }
    });
    found
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
            if let Some(content) = read_bounded_regular_file(&rc_path) {
                for line in content.lines() {
                    let line = line.trim();
                    if let Some(val) = line.strip_prefix("DefaultProfile=") {
                        if let Some(clean) = sanitize_konsole_profile_name(val) {
                            profile_name = clean.to_string();
                        }
                        break;
                    }
                }
            }
            let profile_path = h.join(".local/share/konsole").join(profile_name);
            if let Some(content) = read_bounded_regular_file(&profile_path) {
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
    } else if term_lower.contains("rio") {
        if let Some(ref h) = home {
            let conf_path = h.join(".config/rio/config.toml");
            if let Some(content) = read_bounded_regular_file(&conf_path) {
                if let Some(theme) = parse_rio_theme(&content) {
                    return Some(theme);
                }
            }
        }
    } else if term_lower.contains("ghostty") {
        if let Some(ref h) = home {
            let conf_path = h.join(".config/ghostty/config");
            if let Some(content) = read_bounded_regular_file(&conf_path) {
                if let Some(theme) = parse_ghostty_theme(&content) {
                    return Some(theme);
                }
            }
        }
    } else if term_lower.contains("zellij") {
        if let Some(content) = read_active_zellij_config(home.as_deref()) {
            return parse_zellij_theme(&content);
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

    /// Stand-in for the environment in [`resolve_terminal`]: only `vars` are set.
    fn env_of(vars: &[(&str, &str)]) -> impl Fn(&str) -> Option<String> {
        let vars: Vec<(String, String)> = vars
            .iter()
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect();
        move |key: &str| vars.iter().find(|(k, _)| k == key).map(|(_, v)| v.clone())
    }

    fn names(list: &[&str]) -> Vec<String> {
        list.iter().map(|s| s.to_string()).collect()
    }

    /// The process chain above a `retch` launched from an agent session on arrakis,
    /// verbatim and nearest first, cut at 6 processes as `detect_terminal` originally cut it.
    /// `WindowsTerminal.exe` was the next process up — one past the 6-process reach.
    const ARRAKIS_AGENT_CHAIN: [&str; 6] = [
        "retch.exe",
        "pwsh.exe",
        "cmd.exe",
        "claude.exe",
        "cmd.exe",
        "nu.exe",
    ];

    #[test]
    fn test_terminal_from_process_name() {
        assert_eq!(
            terminal_from_process_name("WindowsTerminal.exe"),
            Some("Windows Terminal")
        );
        assert_eq!(terminal_from_process_name("kitty"), Some("kitty"));
        assert_eq!(
            terminal_from_process_name("wezterm-gui.exe"),
            Some("wezterm")
        );
        assert_eq!(
            terminal_from_process_name("gnome-terminal-server"),
            Some("gnome-terminal")
        );
        // Apple's Terminal is matched exactly...
        assert_eq!(terminal_from_process_name("Terminal"), Some("Terminal"));
        // ...because a substring `terminal` would claim this one ahead of its own entry.
        assert_eq!(
            terminal_from_process_name("xfce4-terminal"),
            Some("xfce4-terminal")
        );
        for name in ARRAKIS_AGENT_CHAIN.iter().chain(&["explorer.exe"]) {
            assert_eq!(terminal_from_process_name(name), None, "{name}");
        }
    }

    #[test]
    fn test_wt_session_names_windows_terminal_beyond_the_walk() {
        let chain = names(&ARRAKIS_AGENT_CHAIN);
        let session = ("WT_SESSION", "3251d862-ff01-4e19-8715-e442e1c9b9bd");
        assert_eq!(
            resolve_terminal(env_of(&[session]), &chain),
            Some("Windows Terminal".to_string())
        );
        // Without it that chain identifies nothing, which is what v0.17.6 reported.
        assert_eq!(resolve_terminal(env_of(&[]), &chain), None);
        // An empty value is not a session.
        assert_eq!(
            resolve_terminal(env_of(&[("WT_SESSION", "")]), &chain),
            None
        );
    }

    #[test]
    fn test_windows_terminal_found_in_the_process_tree() {
        // Typed straight into a Windows Terminal tab: no variable needed.
        let chain = names(&["retch.exe", "nu.exe", "WindowsTerminal.exe"]);
        assert_eq!(
            resolve_terminal(env_of(&[]), &chain),
            Some("Windows Terminal".to_string())
        );
    }

    #[test]
    fn test_terminal_precedence() {
        let inherited = ("WT_SESSION", "inherited");
        // A terminal's own variable wins over an inherited WT_SESSION...
        assert_eq!(
            resolve_terminal(env_of(&[("TERM_PROGRAM", "WezTerm"), inherited]), &[]),
            Some("WezTerm".to_string())
        );
        assert_eq!(
            resolve_terminal(env_of(&[("ALACRITTY_WINDOW_ID", "1"), inherited]), &[]),
            Some("alacritty".to_string())
        );
        // ...and so does a terminal that really is an ancestor.
        assert_eq!(
            resolve_terminal(env_of(&[inherited]), &names(&["retch", "zsh", "kitty"])),
            Some("kitty".to_string())
        );
        // TERM is the last resort, after WT_SESSION.
        assert_eq!(
            resolve_terminal(env_of(&[inherited, ("TERM", "xterm-kitty")]), &[]),
            Some("Windows Terminal".to_string())
        );
        assert_eq!(
            resolve_terminal(env_of(&[("TERM", "xterm-kitty")]), &[]),
            Some("kitty".to_string())
        );
        assert_eq!(
            resolve_terminal(env_of(&[("TERM", "xterm-256color")]), &[]),
            None
        );
        assert_eq!(resolve_terminal(env_of(&[("TERM", "dumb")]), &[]), None);
        assert_eq!(resolve_terminal(env_of(&[("TERM", "vt100")]), &[]), None);
    }

    #[test]
    fn test_parse_macos_app_bundle_terminal() {
        let plist = r#"<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>Antigravity</string>
    <key>CFBundleShortVersionString</key>
    <string>2.29.0</string>
</dict>
</plist>"#;
        assert_eq!(
            parse_macos_app_bundle_terminal(
                "/Applications/Antigravity.app/Contents/Resources/app/extensions/antigravity/bin/language_server_macos_arm",
                Some(plist),
            ),
            Some("Antigravity 2.29.0".to_string())
        );
        assert_eq!(
            parse_macos_app_bundle_terminal(
                "/Applications/Ghostty.app/Contents/MacOS/ghostty",
                None,
            ),
            Some("Ghostty".to_string())
        );
        assert_eq!(
            parse_macos_app_bundle_terminal(
                "/System/Library/CoreServices/loginwindow.app/Contents/MacOS/loginwindow",
                Some(plist),
            ),
            None
        );
    }

    #[test]
    fn test_windows_terminal_package_version() {
        // Verbatim from arrakis: the Store install fastfetch reports as 1.24.11911.0.
        assert_eq!(
            windows_terminal_package_version(
                r"C:\Program Files\WindowsApps\Microsoft.WindowsTerminal_1.24.11911.0_x64__8wekyb3d8bbwe\WindowsTerminal.exe"
            ),
            Some("1.24.11911.0".to_string())
        );
        // Synthetic, following the same package naming: Preview, and forward slashes.
        assert_eq!(
            windows_terminal_package_version(
                "C:/Program Files/WindowsApps/Microsoft.WindowsTerminalPreview_1.25.1234.0_arm64__8wekyb3d8bbwe/WindowsTerminal.exe"
            ),
            Some("1.25.1234.0".to_string())
        );
        // Unpackaged (e.g. scoop): no package folder, so no version — even though the
        // directory name happens to look like one.
        assert_eq!(
            windows_terminal_package_version(
                r"C:\Users\kento\scoop\apps\windows-terminal\1.24.11911.0\WindowsTerminal.exe"
            ),
            None
        );
        // Another package's folder is not Windows Terminal's.
        assert_eq!(
            windows_terminal_package_version(
                r"C:\Program Files\WindowsApps\Microsoft.PowerShell_7.6.6.0_x64__8wekyb3d8bbwe\pwsh.exe"
            ),
            None
        );
        // A version field that is not four numeric parts is rejected, not passed through.
        assert_eq!(
            windows_terminal_package_version(
                r"C:\Program Files\WindowsApps\Microsoft.WindowsTerminal_1.24_x64__8wekyb3d8bbwe\WindowsTerminal.exe"
            ),
            None
        );
        assert_eq!(
            windows_terminal_package_version("WindowsTerminal.exe"),
            None
        );
    }

    #[test]
    fn test_unanimous_version() {
        let v = |s: &str| Some(s.to_string());
        assert_eq!(unanimous_version(&[v("1.24.11911.0")]), v("1.24.11911.0"));
        assert_eq!(
            unanimous_version(&[v("1.24.11911.0"), v("1.24.11911.0")]),
            v("1.24.11911.0")
        );
        // Stable beside Preview: nothing says which one hosts retch.
        assert_eq!(
            unanimous_version(&[v("1.24.11911.0"), v("1.25.1234.0")]),
            None
        );
        // An unpackaged instance leaves it open too, in either position.
        assert_eq!(unanimous_version(&[v("1.24.11911.0"), None]), None);
        assert_eq!(unanimous_version(&[None, v("1.24.11911.0")]), None);
        assert_eq!(unanimous_version(&[]), None);
    }

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
    fn test_parse_windows_terminal_font() {
        let json_both = r#"{
    "profiles": {
        "defaults": {
            "font": {
                "face": "JetBrainsMono Nerd Font",
                "size": 13
            }
        }
    }
}"#;
        assert_eq!(
            parse_windows_terminal_font(json_both),
            Some("JetBrainsMono Nerd Font (13)".to_string())
        );

        let json_size_only = r#"{
    "profiles": {
        "list": [
            {
                "font": {
                    "size": 13
                }
            }
        ]
    }
}"#;
        assert_eq!(
            parse_windows_terminal_font(json_size_only),
            Some("Cascadia Mono (13)".to_string())
        );
    }

    #[test]
    fn test_parse_konsole_theme() {
        let profile = "[Appearance]\nColorScheme=Breeze\nFont=Hack,10,-1,5,50,0,0,0,0,0\n";
        assert_eq!(parse_konsole_theme(profile), Some("Breeze".to_string()));
    }

    #[test]
    fn test_sanitize_konsole_profile_name() {
        assert_eq!(
            sanitize_konsole_profile_name("Profile 1.profile"),
            Some("Profile 1.profile")
        );
        assert_eq!(sanitize_konsole_profile_name(""), None);
        assert_eq!(sanitize_konsole_profile_name(".."), None);
        assert_eq!(sanitize_konsole_profile_name("../etc/passwd"), None);
        assert_eq!(sanitize_konsole_profile_name("/dev/zero"), None);
        assert_eq!(sanitize_konsole_profile_name("sub\\evil.profile"), None);
    }

    #[test]
    fn test_parse_rio_ghostty_and_zellij_configs() {
        let rio_toml = r##"
theme = "Dracula"

[fonts]
size = 16
family = "JetBrainsMono Nerd Font"
"##;
        assert_eq!(
            parse_rio_font(rio_toml).as_deref(),
            Some("JetBrainsMono Nerd Font (16)")
        );
        assert_eq!(parse_rio_theme(rio_toml).as_deref(), Some("Dracula"));

        let rio_colors = r##"
[colors]
background = "#0F0D0E"
foreground = "#F9F4DA"
"##;
        assert_eq!(
            parse_rio_theme(rio_colors).as_deref(),
            Some("BG: #0F0D0E, FG: #F9F4DA")
        );

        let ghostty_conf = "\
font-family = \"JetBrainsMono Nerd Font\"
font-size = 14
theme = catppuccin-mocha
";
        assert_eq!(
            parse_ghostty_font(ghostty_conf).as_deref(),
            Some("JetBrainsMono Nerd Font (14)")
        );
        assert_eq!(
            parse_ghostty_theme(ghostty_conf).as_deref(),
            Some("catppuccin-mocha")
        );

        let zellij_kdl = "\
// Zellij configuration
theme \"catppuccin-mocha\"
default_layout \"compact\"
web_client {
    font \"monospace\"
    font_size 14
}
terminal {
    font \"JetBrainsMono Nerd Font\"
    font_bold \"JetBrainsMono Bold\"
    font_size 13
    theme {
        foreground \"#cdd6f4\"
        background \"#1e1e2e\"
    }
}
";
        assert_eq!(
            parse_zellij_theme(zellij_kdl).as_deref(),
            Some("catppuccin-mocha")
        );
        assert_eq!(
            parse_zellij_font(zellij_kdl).as_deref(),
            Some("JetBrainsMono Nerd Font (13)")
        );

        // `terminal { theme { ... } }` without a top-level `theme "<name>"` must not misreport `{`.
        let zellij_nested_theme_only = "\
terminal {
    theme {
        foreground \"#cdd6f4\"
    }
    /- font \"Ignored Slashdash\"
    font \"Fira Code\"; font_size 12.5
}
";
        assert_eq!(parse_zellij_theme(zellij_nested_theme_only), None);
        assert_eq!(
            parse_zellij_font(zellij_nested_theme_only).as_deref(),
            Some("Fira Code (12.5)")
        );

        // Only `font_size` configured -> Zellij's bundled `Iosevka Term` family.
        let zellij_size_only = "terminal {\n    font \"\"\n    font_size 15\n}\n";
        assert_eq!(
            parse_zellij_font(zellij_size_only).as_deref(),
            Some("Iosevka Term (15)")
        );

        // Commented-out default dump (`zellij setup --dump-config`), multi-line `/-` slashdash,
        // slashdashed `{ ... }` children blocks, nested `/* ... */` block comments, or
        // `web_client` alone -> None.
        let zellij_commented = "\
web_client {
    font \"monospace\"
    font_size 14
}
// terminal {
//     font \"Iosevka Term\"
//     font_size 12
// }
/- terminal {
    font \"Hack\"
    font_size 16
}
/-
terminal {
    font \"Cross-Line Slashdash\"
    font_size 17
}
terminal /- {
    font \"Slashdashed Children\"
    font_size 18
}
/* outer /* nested */ comment
terminal {
    font \"Block Commented\"
    font_size 19
}
*/
/-
theme \"commented-theme\"
";
        assert_eq!(parse_zellij_font(zellij_commented), None);
        assert_eq!(parse_zellij_theme(zellij_commented), None);

        // Regression for same-line KDL keys, argument-level `/-` slashdash, raw strings, and `\`
        // line continuations.
        assert_eq!(
            parse_zellij_font("terminal { font \"JetBrains Mono\" font_size 13 }\n").as_deref(),
            Some("JetBrains Mono (13)")
        );
        assert_eq!(
            parse_zellij_font("terminal { font \"JetBrains Mono\"; font_size 13; }\n").as_deref(),
            Some("JetBrains Mono (13)")
        );
        assert_eq!(
            parse_zellij_font(
                "terminal \\\n{\n    font /- \"Old\" r#\"Cascadia Code\"#\n    font_size 14\n}\n"
            )
            .as_deref(),
            Some("Cascadia Code (14)")
        );

        // Regression for Zellij config path order and inactive-config isolation across Linux,
        // macOS, and Windows (`zellij_utils::home::find_default_config_dir`):
        // - `$ZELLIJ_CONFIG_FILE` and `$ZELLIJ_CONFIG_DIR` never fall back.
        // - On both Linux and macOS, `$HOME/.config/zellij` beats `$XDG_CONFIG_HOME/zellij` and
        //   `~/Library/Application Support/org.Zellij-Contributors.Zellij`, followed by `/etc/zellij`.
        // - Stopping at the first existing directory means an existing `~/.config/zellij` with no
        //   `config.kdl` returns `None` instead of reading a lower-priority directory.
        let win_roaming = std::path::Path::new(r"C:\Users\u\AppData\Roaming");
        let win_appdata_zellij = win_roaming.join("Zellij").join("config");
        let win_programdata_zellij = std::path::PathBuf::from(r"C:\ProgramData\Zellij");
        let files = [
            (
                std::path::PathBuf::from("/custom/empty.kdl"),
                "// active override with no font or theme\ndefault_layout \"compact\"\n",
            ),
            (
                std::path::PathBuf::from("/home/u/.config/zellij/config.kdl"),
                "theme \"home-theme\"\nterminal { font \"Home Font\" font_size 11 }\n",
            ),
            (
                std::path::PathBuf::from("/Users/u/.config/zellij/config.kdl"),
                "theme \"mac-home\"\nterminal { font \"JetBrains Mono\" font_size 14 }\n",
            ),
            (
                std::path::PathBuf::from("/xdg/zellij/config.kdl"),
                "theme \"xdg-theme\"\nterminal { font \"XDG Font\" font_size 12 }\n",
            ),
            (
                std::path::PathBuf::from(
                    "/Users/u/Library/Application Support/org.Zellij-Contributors.Zellij/config.kdl",
                ),
                "theme \"mac-app-support\"\nterminal { font \"SF Mono\" font_size 13 }\n",
            ),
            (
                std::path::PathBuf::from("/etc/zellij/config.kdl"),
                "theme \"etc-theme\"\nterminal { font \"System Font\" font_size 10 }\n",
            ),
            (
                win_appdata_zellij.join("config.kdl"),
                "theme \"win-theme\"\nterminal { font \"Cascadia Mono\" font_size 12 }\n",
            ),
            (
                win_programdata_zellij.join("config.kdl"),
                "theme \"win-system\"\nterminal { font \"Consolas\" font_size 11 }\n",
            ),
        ];
        let reader = |p: &std::path::Path| -> Option<String> {
            files
                .iter()
                .find(|(k, _)| k == p)
                .map(|(_, v)| (*v).to_string())
        };
        let dirs_present = |dirs: &[&str]| {
            let owned: Vec<std::path::PathBuf> =
                dirs.iter().map(std::path::PathBuf::from).collect();
            move |p: &std::path::Path| owned.iter().any(|d| d == p)
        };

        let via_env_file = read_active_zellij_config_with(
            ZellijConfigPlatform::UnixOther,
            env_of(&[("ZELLIJ_CONFIG_FILE", "/custom/empty.kdl")]),
            Some(std::path::Path::new("/xdg")),
            Some(std::path::Path::new("/home/u")),
            dirs_present(&["/home/u/.config/zellij", "/xdg/zellij"]),
            reader,
        )
        .unwrap();
        assert_eq!(parse_zellij_font(&via_env_file), None);
        assert_eq!(parse_zellij_theme(&via_env_file), None);

        // Unreadable explicit `ZELLIJ_CONFIG_FILE` must not silently fall back to `~/.config`.
        assert_eq!(
            read_active_zellij_config_with(
                ZellijConfigPlatform::UnixOther,
                env_of(&[("ZELLIJ_CONFIG_FILE", "/custom/missing.kdl")]),
                Some(std::path::Path::new("/xdg")),
                Some(std::path::Path::new("/home/u")),
                dirs_present(&["/home/u/.config/zellij", "/xdg/zellij"]),
                reader,
            ),
            None
        );

        // Linux with `XDG_CONFIG_HOME=/xdg`: `$HOME/.config/zellij` still wins when it exists!
        let linux_home_wins = read_active_zellij_config_with(
            ZellijConfigPlatform::UnixOther,
            env_of(&[("XDG_CONFIG_HOME", "/xdg")]),
            Some(std::path::Path::new("/xdg")),
            Some(std::path::Path::new("/home/u")),
            dirs_present(&["/home/u/.config/zellij", "/xdg/zellij", "/etc/zellij"]),
            reader,
        )
        .unwrap();
        assert_eq!(
            parse_zellij_font(&linux_home_wins).as_deref(),
            Some("Home Font (11)")
        );

        // Linux when `$HOME/.config/zellij` does not exist -> `$XDG_CONFIG_HOME/zellij` is used.
        let linux_xdg_second = read_active_zellij_config_with(
            ZellijConfigPlatform::UnixOther,
            env_of(&[("XDG_CONFIG_HOME", "/xdg")]),
            Some(std::path::Path::new("/xdg")),
            Some(std::path::Path::new("/home/u")),
            dirs_present(&["/xdg/zellij", "/etc/zellij"]),
            reader,
        )
        .unwrap();
        assert_eq!(
            parse_zellij_font(&linux_xdg_second).as_deref(),
            Some("XDG Font (12)")
        );

        // Existing `~/.config/zellij` directory WITHOUT a `config.kdl` inside it stops directory
        // discovery (`None`) and must NOT fall through to `/xdg/zellij` or `/etc/zellij`.
        assert_eq!(
            read_active_zellij_config_with(
                ZellijConfigPlatform::UnixOther,
                env_of(&[("XDG_CONFIG_HOME", "/xdg")]),
                Some(std::path::Path::new("/xdg")),
                Some(std::path::Path::new("/home/NoFile")),
                dirs_present(&["/home/NoFile/.config/zellij", "/xdg/zellij", "/etc/zellij"]),
                reader,
            ),
            None
        );

        // macOS: `$HOME/.config/zellij` wins over `org.Zellij-Contributors.Zellij`, which wins
        // over `/etc/zellij`.
        let mac_home_wins = read_active_zellij_config_with(
            ZellijConfigPlatform::MacOs,
            env_of(&[]),
            Some(std::path::Path::new("/Users/u/Library/Application Support")),
            Some(std::path::Path::new("/Users/u")),
            dirs_present(&[
                "/Users/u/.config/zellij",
                "/Users/u/Library/Application Support/org.Zellij-Contributors.Zellij",
                "/etc/zellij",
            ]),
            reader,
        )
        .unwrap();
        assert_eq!(
            parse_zellij_font(&mac_home_wins).as_deref(),
            Some("JetBrains Mono (14)")
        );

        let mac_app_support = read_active_zellij_config_with(
            ZellijConfigPlatform::MacOs,
            env_of(&[]),
            Some(std::path::Path::new("/Users/u/Library/Application Support")),
            Some(std::path::Path::new("/Users/u")),
            dirs_present(&[
                "/Users/u/Library/Application Support/org.Zellij-Contributors.Zellij",
                "/etc/zellij",
            ]),
            reader,
        )
        .unwrap();
        assert_eq!(
            parse_zellij_font(&mac_app_support).as_deref(),
            Some("SF Mono (13)")
        );
        assert_eq!(
            parse_zellij_theme(&mac_app_support).as_deref(),
            Some("mac-app-support")
        );

        // Windows: `%APPDATA%\Zellij\config` first, then `C:\ProgramData\Zellij`.
        let win_cfg = read_active_zellij_config_with(
            ZellijConfigPlatform::Windows,
            env_of(&[]),
            Some(win_roaming),
            None,
            |p| p == win_appdata_zellij || p == win_programdata_zellij,
            reader,
        )
        .unwrap();
        assert_eq!(
            parse_zellij_font(&win_cfg).as_deref(),
            Some("Cascadia Mono (12)")
        );

        let win_sys = read_active_zellij_config_with(
            ZellijConfigPlatform::Windows,
            env_of(&[]),
            Some(win_roaming),
            None,
            |p| p == win_programdata_zellij,
            reader,
        )
        .unwrap();
        assert_eq!(
            parse_zellij_font(&win_sys).as_deref(),
            Some("Consolas (11)")
        );

        // Detached multiplexer fallback in resolve_terminal
        assert_eq!(
            resolve_terminal(
                env_of(&[("TERM", "xterm-256color"), ("ZELLIJ", "0")]),
                &names(&["retch", "zsh", "zellij", "systemd"])
            )
            .as_deref(),
            Some("zellij")
        );
        assert_eq!(
            resolve_terminal(
                env_of(&[
                    ("TERM", "tmux-256color"),
                    ("TMUX", "/tmp/tmux-1000/default,123,0")
                ]),
                &names(&["retch", "zsh", "tmux: server", "systemd"])
            )
            .as_deref(),
            Some("tmux")
        );
        assert_eq!(
            resolve_terminal(
                env_of(&[("TERM", "screen-256color"), ("STY", "1234.pts-0.host")]),
                &names(&["retch", "zsh", "SCREEN", "systemd"])
            )
            .as_deref(),
            Some("screen")
        );
        assert_eq!(
            resolve_terminal(
                env_of(&[("TERM", "screen-256color")]),
                &names(&["retch", "zsh", "systemd"])
            )
            .as_deref(),
            Some("screen")
        );
    }
}
