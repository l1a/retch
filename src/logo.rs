// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! ASCII and graphical logo definitions and rendering.
//!
//! Contains embedded distro logos and logic for rendering them
//! as text or images (e.g., Sixel, Kitty, iTerm).

// Exact Fastfetch ASCII logos (intact, unmodified)
// Source: https://github.com/fastfetch-cli/fastfetch/src/logo/ascii/

// Embedded distro logos (PNG)
// Place real logos in assets/logos/<distro>.png
// Example: assets/logos/arch.png, assets/logos/fedora.png, assets/logos/tux.png

/// Every distro logo retch ships, as `(id, display name)`, in the order `--print-logos` and
/// `--list-distros` show them. Any other id falls back to Tux.
///
/// Both flags read this one list. Until v0.20.11 each kept its own copy, and
/// `--list-distros` still lacked the five logos added after it was written. A test ties
/// this list to `assets/logos/*.txt`, so adding a logo without an entry here fails.
pub const KNOWN_LOGOS: &[(&str, &str)] = &[
    ("arch", "Arch Linux"),
    ("debian", "Debian"),
    ("endeavouros", "EndeavourOS"),
    ("fedora", "Fedora"),
    ("garuda", "Garuda Linux"),
    ("kali", "Kali Linux"),
    ("linuxmint", "Linux Mint"),
    ("manjaro", "Manjaro"),
    ("mx", "MX Linux"),
    ("nixos", "NixOS"),
    ("opensuse", "openSUSE"),
    ("pop", "Pop!_OS"),
    ("ubuntu", "Ubuntu"),
    ("zorin", "Zorin OS"),
    ("macos", "macOS"),
    ("windows", "Windows"),
];

/// Returns the raw PNG bytes for an embedded distro logo.
///
/// If the distro is not recognized, it falls back to the Tux (Linux) logo.
/// Only available when the `graphics` feature is enabled.
#[cfg(feature = "graphics")]
pub fn get_embedded_logo(distro: Option<&str>) -> Option<&'static [u8]> {
    let d = distro.map(|s| s.to_lowercase());
    match d.as_deref() {
        Some("arch") => Some(include_bytes!("../assets/logos/arch.png")),
        Some("debian") => Some(include_bytes!("../assets/logos/debian.png")),
        Some("fedora") => Some(include_bytes!("../assets/logos/fedora.png")),
        Some("nixos") => Some(include_bytes!("../assets/logos/nixos.png")),
        Some("ubuntu") => Some(include_bytes!("../assets/logos/ubuntu.png")),
        Some("pop") => Some(include_bytes!("../assets/logos/pop.png")),
        Some("manjaro") => Some(include_bytes!("../assets/logos/manjaro.png")),
        Some("endeavouros") => Some(include_bytes!("../assets/logos/endeavouros.png")),
        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => {
            Some(include_bytes!("../assets/logos/opensuse.png"))
        }
        Some("mx") => Some(include_bytes!("../assets/logos/mx.png")),
        Some("linuxmint") => Some(include_bytes!("../assets/logos/linuxmint.png")),
        Some("kali") => Some(include_bytes!("../assets/logos/kali.png")),
        Some("zorin") => Some(include_bytes!("../assets/logos/zorin.png")),
        Some("garuda") => Some(include_bytes!("../assets/logos/garuda.png")),
        Some("macos") => Some(include_bytes!("../assets/logos/macos.png")),
        Some("windows") => Some(include_bytes!("../assets/logos/windows.png")),
        _ => Some(include_bytes!("../assets/logos/tux.png")),
    }
}

/// Fallback for non-graphics build to provide Tux bytes for Chafa if needed.
#[cfg(not(feature = "graphics"))]
pub fn get_embedded_logo(_distro: Option<&str>) -> Option<&'static [u8]> {
    Some(include_bytes!("../assets/logos/tux.png"))
}

/// Attempts to detect the current operating system distribution.
pub fn detect_distro() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        Some("macos".to_string())
    }
    #[cfg(target_os = "windows")]
    {
        Some("windows".to_string())
    }
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
        if let Ok(content) = std::fs::read_to_string("/etc/os-release") {
            for line in content.lines() {
                if line.starts_with("ID=") {
                    let id = line.trim_start_matches("ID=").trim_matches('"');
                    return Some(id.to_string());
                }
            }
        }
        None
    }
}

///// Returns a list of strings representing the ASCII art for a given distro with color placeholders.
///
/// All ASCII logos are sourced from or compatible with Fastfetch.
pub fn get_ascii_logo(distro: Option<&str>) -> Vec<String> {
    let d = distro.map(|s| s.to_lowercase());

    match d.as_deref() {
        Some("arch") => {
            let logo = include_str!("../assets/logos/arch.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("debian") => {
            let logo = include_str!("../assets/logos/debian.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("fedora") => {
            let logo = include_str!("../assets/logos/fedora.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("nixos") => {
            let logo = include_str!("../assets/logos/nixos.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("ubuntu") => {
            let logo = include_str!("../assets/logos/ubuntu.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("pop") => {
            let logo = include_str!("../assets/logos/pop.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("manjaro") => {
            let logo = include_str!("../assets/logos/manjaro.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("endeavouros") => {
            let logo = include_str!("../assets/logos/endeavouros.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => {
            let logo = include_str!("../assets/logos/opensuse.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("mx") => {
            let logo = include_str!("../assets/logos/mx.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("linuxmint") => {
            let logo = include_str!("../assets/logos/linuxmint.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("kali") => {
            let logo = include_str!("../assets/logos/kali.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("zorin") => {
            let logo = include_str!("../assets/logos/zorin.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("garuda") => {
            let logo = include_str!("../assets/logos/garuda.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("macos") => {
            let logo = include_str!("../assets/logos/macos.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("windows") => {
            let logo = include_str!("../assets/logos/windows.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }

        // Fallback: Tux (Linux)
        _ => {
            let logo = include_str!("../assets/logos/tux.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
    }
}

/// Returns dynamic ANSI color arrays for a given distribution.
pub fn get_distro_colors(distro: Option<&str>) -> Vec<&'static str> {
    let d = distro.map(|s| s.to_lowercase());
    match d.as_deref() {
        Some("arch") => vec!["\x1b[36m", "\x1b[37m"],
        Some("debian") => vec!["\x1b[31m", "\x1b[37m"],
        Some("fedora") => vec!["\x1b[34m", "\x1b[37m"],
        Some("nixos") => vec![
            "\x1b[34m", "\x1b[36m", "\x1b[34m", "\x1b[36m", "\x1b[34m", "\x1b[36m",
        ],
        Some("ubuntu") => vec!["\x1b[33m", "\x1b[31m"],
        Some("pop") => vec!["\x1b[36m", "\x1b[37m"],
        Some("manjaro") => vec!["\x1b[32m"],
        Some("endeavouros") => vec!["\x1b[35m", "\x1b[31m", "\x1b[34m"],
        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => {
            vec!["\x1b[32m", "\x1b[37m"]
        }
        Some("mx") => vec!["\x1b[34m", "\x1b[37m"],
        Some("linuxmint") => vec!["\x1b[32m", "\x1b[37m"],
        Some("kali") => vec!["\x1b[34m", "\x1b[37m"],
        Some("zorin") => vec!["\x1b[36m", "\x1b[37m"],
        Some("garuda") => vec!["\x1b[35m", "\x1b[36m"],
        // Grayscale (silver) ramp, matching the modern monochrome Apple logo rather than the
        // legacy rainbow. 256-colour greys (light→medium) read on light and dark terminals.
        Some("macos") => vec![
            "\x1b[38;5;252m",
            "\x1b[38;5;250m",
            "\x1b[38;5;248m",
            "\x1b[38;5;246m",
            "\x1b[38;5;244m",
        ],
        Some("windows") => vec!["\x1b[36m"],
        _ => vec!["\x1b[30m", "\x1b[37m", "\x1b[33m"], // Tux
    }
}

/// Interpolates placeholders `${1}`...`${9}` or `$1`...`$9` with dynamic ANSI colors and appends a reset at the end.
pub fn get_distro_logo_lines(distro: Option<&str>) -> Vec<String> {
    let raw_lines = get_ascii_logo(distro);
    let colors = get_distro_colors(distro);
    let default_color = colors.first().copied().unwrap_or("\x1b[0m");

    raw_lines
        .into_iter()
        .map(|line| {
            let mut formatted = line;
            for i in 1..=9 {
                let color_val = colors.get(i - 1).copied().unwrap_or("\x1b[0m");
                let placeholder = format!("${{{}}}", i);
                formatted = formatted.replace(&placeholder, color_val);
                let placeholder_short = format!("${}", i);
                formatted = formatted.replace(&placeholder_short, color_val);
            }
            if !formatted.is_empty() {
                format!("{}{}\x1b[0m", default_color, formatted)
            } else {
                formatted
            }
        })
        .collect()
}

/// Returns true when the running terminal is Rio.
///
/// Checks `TERM` as well as `TERM_PROGRAM`. `TERM_PROGRAM` alone is not sufficient: it is not
/// in sudo's default `env_keep` list, so `sudo retch` lost Rio's graphics support entirely and
/// silently fell all the way back to Chafa. `TERM` **is** preserved by sudo (`xterm-rio` here),
/// and the same gap affects any launcher that starts retch with a trimmed environment.
fn is_rio_terminal() -> bool {
    if let Ok(term) = std::env::var("TERM") {
        if term == "rio" || term.starts_with("xterm-rio") {
            return true;
        }
    }
    std::env::var("TERM_PROGRAM")
        .map(|t| t == "rio")
        .unwrap_or(false)
}

/// Returns true when `ZELLIJ_DESKTOP_TERMINAL` explicitly advertises Zellij's native terminal.
fn is_zellij_desktop_env() -> bool {
    std::env::var("ZELLIJ_DESKTOP_TERMINAL")
        .map(|v| !v.is_empty() && v != "0")
        .unwrap_or(false)
}

/// Returns true when running inside a Zellij multiplexer or `zellij terminal` pane.
///
/// `zellij terminal` spawns `zellij --server` with `TERM=xterm-256color`, `ZELLIJ=0`,
/// `ZELLIJ_SESSION_NAME=<name>`, and `ZELLIJ_PANE_ID=<id>` in child panes, while sending
/// `KittyGraphicsSupport` over its internal client-to-server IPC rather than exporting a
/// terminal-specific environment variable into child shells.
fn in_zellij_session() -> bool {
    ["ZELLIJ", "ZELLIJ_SESSION_NAME", "ZELLIJ_PANE_ID"]
        .iter()
        .any(|var| std::env::var(var).map(|v| !v.is_empty()).unwrap_or(false))
}

/// Returns true when `buf` contains a complete Primary Device Attributes (`\x1b[?...c`) reply.
#[cfg(any(unix, test))]
fn has_primary_da1(buf: &[u8]) -> bool {
    let mut i = 0;
    while i + 3 < buf.len() {
        if buf[i] == 0x1b && buf[i + 1] == b'[' && buf[i + 2] == b'?' {
            let mut j = i + 3;
            while j < buf.len() && (0x30..=0x3f).contains(&buf[j]) {
                j += 1;
            }
            while j < buf.len() && (0x20..=0x2f).contains(&buf[j]) {
                j += 1;
            }
            if j < buf.len() && buf[j] == b'c' {
                return true;
            }
        }
        i += 1;
    }
    false
}

/// Scans `buf` for a complete Kitty graphics APC reply carrying `i=31` (matching our
/// `KITTY_GRAPHICS_QUERY`) and returns `(is_ok, reply_end)` for the last matching reply.
///
/// If an unterminated APC sequence is still streaming in at the tail of `buf`, returns `None`
/// until its terminator (`ESC \`, `ST`, or `BEL`) arrives.
#[cfg(any(unix, test))]
fn find_kitty_query_reply(buf: &[u8]) -> Option<(bool, usize)> {
    let mut found: Option<(bool, usize)> = None;
    let mut i = 0;
    while i + 2 < buf.len() {
        let apc_body_start =
            if i + 3 <= buf.len() && buf[i] == 0x1b && buf[i + 1] == b'_' && buf[i + 2] == b'G' {
                Some(i + 3)
            } else if buf[i] == 0x9f && buf[i + 1] == b'G' {
                Some(i + 2)
            } else {
                None
            };

        if let Some(start) = apc_body_start {
            let mut end = start;
            let mut term_len = 0usize;
            while end < buf.len() {
                if buf[end] == 0x1b && end + 1 < buf.len() && buf[end + 1] == b'\\' {
                    term_len = 2;
                    break;
                }
                if buf[end] == 0x9c || buf[end] == 0x07 {
                    term_len = 1;
                    break;
                }
                end += 1;
            }
            if term_len == 0 {
                return None;
            }
            let body = &buf[start..end];
            if let Some(semi) = body.iter().position(|&b| b == b';') {
                let has_our_id = body[..semi].split(|&b| b == b',').any(|kv| kv == b"i=31");
                if has_our_id {
                    let is_ok = &body[semi + 1..] == b"OK";
                    found = Some((is_ok, end + term_len));
                }
            }
            i = end + term_len;
        } else {
            i += 1;
        }
    }
    found
}

/// Evaluates accumulated bytes from a Kitty graphics query (`a=q,i=31`) followed by Primary DA1
/// (`\x1b[c`).
///
/// Returns `None` until the trailing Primary DA1 (`\x1b[?...c`) barrier has arrived *after* any
/// `i=31` Kitty APC reply, so the caller never stops reading early on an out-of-order/stale DA1
/// and never leaves unread reply bytes in the PTY input buffer.
#[cfg(any(unix, test))]
fn parse_kitty_query_response(buf: &[u8]) -> Option<bool> {
    if let Some((is_ok, reply_end)) = find_kitty_query_reply(buf) {
        if has_primary_da1(&buf[reply_end..]) {
            Some(is_ok)
        } else {
            None
        }
    } else if has_primary_da1(buf) {
        Some(false)
    } else {
        None
    }
}

/// Outcome of a single non-blocking poll + read iteration on `/dev/tty`.
#[cfg(any(unix, test))]
#[derive(Debug)]
enum TtyPollStep {
    Data(usize),
    TimedOut,
    Closed,
}

/// Collects terminal query reply bytes until Primary DA1 (`\x1b[?...c`) arrives or the timeout /
/// byte budget expires.
///
/// Uses `initial_timeout` while waiting for the first `ESC` (`0x1b`) byte so non-answering
/// terminals fail fast, then extends the deadline by `drain_timeout` from the moment `0x1b` is
/// observed so a Kitty `OK` arriving near `initial_timeout` still drains its trailing Primary DA1
/// response instead of leaving unread CSI bytes on the PTY. Returns `true` strictly when BOTH the
/// Kitty `OK` APC reply and the trailing Primary DA1 barrier were consumed.
#[cfg(any(unix, test))]
fn collect_kitty_query_reply<E, S>(
    initial_timeout: std::time::Duration,
    drain_timeout: std::time::Duration,
    max_bytes: usize,
    mut elapsed: E,
    mut step: S,
) -> bool
where
    E: FnMut() -> std::time::Duration,
    S: FnMut(std::time::Duration, &mut [u8]) -> TtyPollStep,
{
    let mut drain_deadline: Option<std::time::Duration> = None;
    let mut buf = Vec::with_capacity(128);
    let mut chunk = [0u8; 128];

    while buf.len() < max_bytes {
        let now = elapsed();
        let active_deadline = drain_deadline.unwrap_or(initial_timeout);
        let Some(remaining) = active_deadline.checked_sub(now) else {
            break;
        };
        if remaining.is_zero() {
            break;
        }

        let max_read = chunk.len().min(max_bytes - buf.len());
        match step(remaining, &mut chunk[..max_read]) {
            TtyPollStep::Data(0) | TtyPollStep::TimedOut | TtyPollStep::Closed => break,
            TtyPollStep::Data(n) => {
                buf.extend_from_slice(&chunk[..n]);
                if drain_deadline.is_none() && buf.contains(&0x1b) {
                    drain_deadline = Some(elapsed().saturating_add(drain_timeout));
                }
                if let Some(supported) = parse_kitty_query_response(&buf) {
                    return supported;
                }
            }
        }
    }

    parse_kitty_query_response(&buf).unwrap_or(false)
}

/// Probes the controlling terminal for Kitty graphics support via a non-displaying 1×1 query
/// (`a=q`) paired with Primary DA1 (`\x1b[c`).
///
/// Inside Zellij 0.45+ / `zellij terminal` 0.46+, `zellij-server` answers both sequences
/// synchronously from in-memory pane state (`\x1b_Gi=31;OK\x1b\` when backed by `zellij terminal`
/// or a Kitty-capable host terminal, `\x1b_Gi=31;ENOTSUPPORTED:...\x1b\` when backed by a
/// non-Kitty terminal, or DA1 alone when `support_kitty_graphics_protocol` is disabled).
fn probe_kitty_graphics_tty() -> bool {
    #[cfg(unix)]
    {
        use std::io::{Read, Write};
        use std::mem::MaybeUninit;
        use std::os::fd::AsRawFd;
        use std::os::unix::fs::OpenOptionsExt;
        use std::time::{Duration, Instant};

        const KITTY_GRAPHICS_QUERY: &[u8] = b"\x1b_Ga=q,i=31,s=1,v=1,t=d,f=24;AAAA\x1b\\\x1b[c";
        const QUERY_TIMEOUT: Duration = Duration::from_millis(100);
        const DRAIN_TIMEOUT: Duration = Duration::from_millis(150);
        const MAX_REPLY_BYTES: usize = 4096;

        struct TermiosGuard {
            fd: libc::c_int,
            orig: libc::termios,
        }

        impl Drop for TermiosGuard {
            fn drop(&mut self) {
                // SAFETY: `self.fd` remains open for the lifetime of `tty` below, and `self.orig`
                // was initialized by a successful `tcgetattr` on the same descriptor.
                unsafe {
                    let _ = libc::tcsetattr(self.fd, libc::TCSANOW, &self.orig);
                }
            }
        }

        let Ok(mut tty) = std::fs::OpenOptions::new()
            .read(true)
            .write(true)
            .custom_flags(libc::O_NOCTTY | libc::O_CLOEXEC)
            .open("/dev/tty")
        else {
            return false;
        };

        let fd = tty.as_raw_fd();

        // Do not touch termios or read from `/dev/tty` when running in a background process
        // group; otherwise the kernel would stop the process with SIGTTOU / SIGTTIN.
        // SAFETY: `tcgetpgrp` and `getpgrp` take an open fd / no args and have no memory hazards.
        let is_foreground = unsafe {
            let fg_pgid = libc::tcgetpgrp(fd);
            fg_pgid > 0 && fg_pgid == libc::getpgrp()
        };
        if !is_foreground {
            return false;
        }

        // SAFETY: `orig` is zero-initialized and populated by `tcgetattr` before any read of its fields.
        let mut orig: libc::termios = unsafe { MaybeUninit::zeroed().assume_init() };
        // SAFETY: `fd` is a valid open TTY descriptor and `orig` points to writable `termios` storage.
        if unsafe { libc::tcgetattr(fd, &mut orig) } != 0 {
            return false;
        }

        let mut raw = orig;
        raw.c_lflag &= !(libc::ICANON | libc::ECHO);
        raw.c_cc[libc::VMIN] = 0;
        raw.c_cc[libc::VTIME] = 0;

        // SAFETY: `fd` is valid and `raw` is derived from `tcgetattr` on `fd`.
        if unsafe { libc::tcsetattr(fd, libc::TCSANOW, &raw) } != 0 {
            return false;
        }
        let _guard = TermiosGuard { fd, orig };

        // Discard any unread bytes (such as a leftover DA1 reply or typeahead from an earlier
        // command) sitting in the kernel TTY input queue before sending our own Kitty + DA1 query.
        // Use `TCSANOW` + `TCIFLUSH` rather than `TCSAFLUSH` so unread slave output never blocks.
        // SAFETY: `fd` is a valid open TTY descriptor.
        unsafe {
            let _ = libc::tcflush(fd, libc::TCIFLUSH);
        }

        if tty.write_all(KITTY_GRAPHICS_QUERY).is_err() || tty.flush().is_err() {
            return false;
        }

        let start = Instant::now();
        collect_kitty_query_reply(
            QUERY_TIMEOUT,
            DRAIN_TIMEOUT,
            MAX_REPLY_BYTES,
            || start.elapsed(),
            |remaining, dst| loop {
                let timeout_ms =
                    (remaining.as_millis().min(libc::c_int::MAX as u128) as libc::c_int).max(1);
                let mut pfd = libc::pollfd {
                    fd,
                    events: libc::POLLIN,
                    revents: 0,
                };
                // SAFETY: `pfd` is a valid stack `pollfd` of length 1 referencing open `fd`.
                let ready = unsafe { libc::poll(&mut pfd, 1, timeout_ms) };
                if ready < 0 {
                    if std::io::Error::last_os_error().kind() == std::io::ErrorKind::Interrupted {
                        continue;
                    }
                    return TtyPollStep::Closed;
                }
                if ready == 0 || (pfd.revents & libc::POLLIN) == 0 {
                    return TtyPollStep::TimedOut;
                }
                match tty.read(dst) {
                    Ok(0) => return TtyPollStep::Closed,
                    Ok(n) => return TtyPollStep::Data(n),
                    Err(e)
                        if matches!(
                            e.kind(),
                            std::io::ErrorKind::Interrupted | std::io::ErrorKind::WouldBlock
                        ) =>
                    {
                        continue;
                    }
                    Err(_) => return TtyPollStep::Closed,
                }
            },
        )
    }

    #[cfg(not(unix))]
    {
        false
    }
}

static ZELLIJ_KITTY_SUPPORTED: std::sync::OnceLock<bool> = std::sync::OnceLock::new();

/// Cached Kitty graphics capability check for the active Zellij session.
fn zellij_supports_kitty() -> bool {
    *ZELLIJ_KITTY_SUPPORTED.get_or_init(probe_kitty_graphics_tty)
}

/// Checks if the terminal supports the Kitty inline image protocol.
pub fn supports_kitty() -> bool {
    if std::env::var("TERM")
        .map(|t| t == "xterm-kitty")
        .unwrap_or(false)
        || std::env::var("TERMINAL_EMULATOR")
            .map(|t| t == "iterm-kitty" || t == "iTerm.app")
            .unwrap_or(false)
        || is_rio_terminal()
        || is_zellij_desktop_env()
    {
        return true;
    }

    in_zellij_session()
        && std::io::IsTerminal::is_terminal(&std::io::stdout())
        && zellij_supports_kitty()
}

/// Checks if the terminal supports the iTerm2 inline image protocol.
pub fn supports_iterm2() -> bool {
    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if prog == "iTerm.app" || prog == "WezTerm" {
            return true;
        }
    }
    is_rio_terminal()
}

/// Checks if the terminal supports Sixel graphics (heuristic based on environment).
pub fn supports_sixel() -> bool {
    if let Ok(term) = std::env::var("TERM") {
        let term = term.to_lowercase();
        if term.contains("sixel") || term.contains("foot") || term.contains("mlterm") {
            return true;
        }
    }

    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if prog == "WezTerm" || prog == "iTerm.app" {
            return true;
        }
    }

    if std::env::var("WT_SESSION").is_ok() {
        return true;
    }

    is_rio_terminal()
}

/// Maximum width, in terminal columns, that a rendered logo may occupy.
///
/// Widened from 28 so that wide-aspect assets (the horizontal lockups — `fedora.png` is
/// 384×108, i.e. 3.56:1 — plus arch/nixos/ubuntu/tux) get enough rows to stay legible: a
/// logo is fitted *inside* this box preserving aspect, so a narrow box caps a wide image's
/// height long before [`LOGO_MAX_ROWS`] does. At 28 columns the Fedora logo collapsed to 4
/// rows of Chafa symbols and was unreadable.
pub const LOGO_MAX_COLS: usize = 45;

/// Maximum height, in terminal rows, that a rendered logo may occupy.
pub const LOGO_MAX_ROWS: usize = 10;

/// Fits an image into a cell box **preserving its aspect ratio**, returning a [`LogoFit`].
///
/// Both the image and the box are converted to pixels (via the terminal's cell dimensions)
/// so the terminal's non-square cells are accounted for — a 2:1 image in 1:2 cells is 4
/// columns per row, not 2. The result is the smallest cell rectangle that contains the
/// scaled image, clamped to `1..=max`.
///
/// This is the single source of truth for a graphical logo's footprint: the same values feed
/// the protocol escape (so the terminal does not stretch the image) and `plan_layout` (so the
/// text column is placed against the logo's real width). Previously the Kitty path hardcoded
/// `c=26,r=10` — which *forces* the image into that rectangle, ignoring aspect entirely, so
/// the 3.56:1 Fedora logo was squashed into a roughly 1:1 box and rendered ~3× too tall —
/// while the layout separately assumed a fixed 40-column width.
pub fn fit_logo_cells(
    img_w: u32,
    img_h: u32,
    cell_w: usize,
    cell_h: usize,
    max_cols: usize,
    max_rows: usize,
) -> LogoFit {
    let (max_cols, max_rows) = (max_cols.max(1), max_rows.max(1));

    // Degenerate inputs: fall back to the full box rather than dividing by zero.
    if img_w == 0 || img_h == 0 || cell_w == 0 || cell_h == 0 {
        return LogoFit {
            cols: max_cols,
            rows: max_rows,
            width_limited: true,
        };
    }

    let (img_w, img_h) = (u64::from(img_w), u64::from(img_h));
    let box_w = (max_cols * cell_w) as u64;
    let box_h = (max_rows * cell_h) as u64;

    // Compare box_w/img_w against box_h/img_h without floating point: whichever ratio is
    // smaller is the limiting dimension.
    let width_limited = box_w * img_h <= box_h * img_w;
    // `div_ceil` on the *pixel* division too, not just the cell division below. Truncating
    // here first could leave the reservation up to one pixel short of what the terminal
    // actually draws, because the truncated value can fall exactly on a cell boundary that
    // the true value sits just above: `mx.png` (256x232) scales to 220.69 px, truncated to
    // 220, which `div_ceil`s to 22 cells = 220 px — 0.69 px less than the image. Invisible
    // while the logo sat mid-screen with columns to spare; against the right margin it is
    // the difference between honouring the invariant below and merely nearly honouring it.
    let (disp_w, disp_h) = if width_limited {
        (box_w, (box_w * img_h).div_ceil(img_w)) // wide image: touches the sides first
    } else {
        ((box_h * img_w).div_ceil(img_h), box_h) // tall image: touches top and bottom first
    };

    LogoFit {
        // `div_ceil` so the reservation is never *smaller* than what gets drawn: an extra
        // blank row or column is harmless, an overlapping one corrupts the layout.
        cols: (disp_w as usize).div_ceil(cell_w).clamp(1, max_cols),
        rows: (disp_h as usize).div_ceil(cell_h).clamp(1, max_rows),
        width_limited,
    }
}

/// The cell footprint of a logo, plus which dimension of the box it touches first.
///
/// `width_limited` matters only to the Kitty emitter — see [`kitty_placement_spec`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct LogoFit {
    /// Width in terminal columns.
    pub cols: usize,
    /// Height in terminal rows.
    pub rows: usize,
    /// True when the image reaches the box's width before its height (a wide image).
    pub width_limited: bool,
}

/// Builds the Kitty graphics-protocol placement keys (`c=` / `r=`) for a fitted logo.
///
/// Deliberately emits **only the limiting dimension**. Kitty derives the other from the
/// image's real aspect ratio, whereas specifying both makes it scale each axis independently
/// to fill the rectangle exactly — and because cells are indivisible, the rounded rectangle is
/// never quite the image's aspect, so passing both leaves a residual stretch even when the
/// numbers are computed correctly (measured at 9% for the Fedora logo). Passing one leaves
/// none.
///
/// The reservation [`plan_layout`](crate::display) makes is `div_ceil`-rounded and therefore
/// always covers what Kitty then draws.
pub fn kitty_placement_spec(fit: LogoFit) -> String {
    if fit.width_limited {
        format!("c={}", fit.cols)
    } else {
        format!("r={}", fit.rows)
    }
}

/// Returns the terminal cell size in pixels as `(width, height)` via `TIOCGWINSZ`.
///
/// Falls back to a 10×20 cell — the conventional default — when the terminal does not report
/// pixel dimensions (tmux, many terminals, and any non-TTY stdout).
pub fn terminal_cell_size_px() -> (usize, usize) {
    #[cfg(unix)]
    {
        use std::mem::MaybeUninit;
        let mut ws: libc::winsize = unsafe { MaybeUninit::zeroed().assume_init() };
        // SAFETY: `ws` is a live, zeroed `winsize` and TIOCGWINSZ writes exactly that type.
        let ret = unsafe { libc::ioctl(libc::STDOUT_FILENO, libc::TIOCGWINSZ, &mut ws) };
        if ret == 0 && ws.ws_row > 0 && ws.ws_col > 0 && ws.ws_xpixel > 0 && ws.ws_ypixel > 0 {
            return (
                ws.ws_xpixel as usize / ws.ws_col as usize,
                ws.ws_ypixel as usize / ws.ws_row as usize,
            );
        }
    }
    (10, 20)
}

/// Returns the cell footprint an image will occupy on the current terminal.
///
/// Thin wrapper pairing [`terminal_cell_size_px`] with the pure [`fit_logo_cells`].
pub fn logo_cells_for(img_w: u32, img_h: u32) -> LogoFit {
    let (cell_w, cell_h) = terminal_cell_size_px();
    fit_logo_cells(img_w, img_h, cell_w, cell_h, LOGO_MAX_COLS, LOGO_MAX_ROWS)
}

/// The `--size WxH` argument passed to `chafa`, derived from the shared logo cell box.
///
/// Chafa fits the image *inside* this box preserving aspect ratio, so this is a maximum in
/// both dimensions rather than a target — a wide logo comes back short, a tall one narrow.
pub fn chafa_size_arg() -> String {
    format!("{LOGO_MAX_COLS}x{LOGO_MAX_ROWS}")
}

static CHAFA_SUPPORTS_PROBE: std::sync::OnceLock<bool> = std::sync::OnceLock::new();

/// Checks if the `chafa` command-line tool supports the `--probe` option.
pub fn chafa_supports_probe() -> bool {
    *CHAFA_SUPPORTS_PROBE.get_or_init(|| {
        std::process::Command::new("chafa")
            .args(["--probe", "off", "--version"])
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    })
}

/// Checks if the `chafa` command-line tool is available in the system path.
pub fn chafa_available() -> bool {
    std::process::Command::new("chafa")
        .arg("--version")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

/// Helper to build a `chafa` command with standard arguments.
fn build_chafa_command() -> std::process::Command {
    let mut cmd = std::process::Command::new("chafa");
    cmd.arg("--format")
        .arg("symbols")
        .arg("--size")
        .arg(chafa_size_arg());

    if chafa_supports_probe() {
        cmd.arg("--probe").arg("off");
    }
    cmd
}

/// Pipe raw image bytes to `chafa` over stdin and return its stdout if successful.
///
/// Piping bytes directly via stdin avoids creating predictable `/tmp/retch_logo_<pid>.png`
/// files in world-writable temporary directories (eliminating symlink/FIFO race conditions).
fn run_chafa_with_bytes(bytes: &[u8]) -> std::io::Result<std::process::Output> {
    use std::io::Write;
    use std::process::Stdio;

    let mut child = build_chafa_command()
        .arg("-")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    if let Some(mut stdin) = child.stdin.take() {
        // Ignore broken pipe errors here; wait_with_output() will report the exit status.
        let _ = stdin.write_all(bytes);
    }

    child.wait_with_output()
}

/// Attempts to render an image file using the `chafa` utility.
///
/// Chafa renders images using high-quality Unicode symbols, providing a
/// good graphical fallback for many terminal emulators.
pub fn print_with_chafa(path: &std::path::Path) -> bool {
    let output = build_chafa_command().arg(path).output();

    match output {
        Ok(out) if out.status.success() => {
            print!("{}", String::from_utf8_lossy(&out.stdout));
            true
        }
        Ok(out) => {
            eprintln!("warning: chafa failed with status: {}", out.status);
            false
        }
        Err(e) => {
            eprintln!("warning: failed to execute chafa: {}", e);
            false
        }
    }
}

/// Attempts to render in-memory image bytes using the `chafa` utility via stdin.
pub fn print_with_chafa_bytes(bytes: &[u8]) -> bool {
    match run_chafa_with_bytes(bytes) {
        Ok(out) if out.status.success() => {
            print!("{}", String::from_utf8_lossy(&out.stdout));
            true
        }
        Ok(out) => {
            eprintln!("warning: chafa failed with status: {}", out.status);
            false
        }
        Err(e) => {
            eprintln!("warning: failed to execute chafa: {}", e);
            false
        }
    }
}

/// Attempts to get Chafa output for an image file as a list of lines.
pub fn get_chafa_logo_lines(path: &std::path::Path) -> Option<Vec<String>> {
    let output = build_chafa_command().arg(path).output().ok()?;
    if output.status.success() {
        let content = String::from_utf8_lossy(&output.stdout);
        Some(content.lines().map(|s| s.to_string()).collect())
    } else {
        None
    }
}

/// Attempts to get Chafa output for in-memory image bytes as a list of lines via stdin.
pub fn get_chafa_logo_lines_from_bytes(bytes: &[u8]) -> Option<Vec<String>> {
    let output = run_chafa_with_bytes(bytes).ok()?;
    if output.status.success() {
        let content = String::from_utf8_lossy(&output.stdout);
        Some(content.lines().map(|s| s.to_string()).collect())
    } else {
        None
    }
}

/// Print logo for a distro following the strict priority:
/// 1. Real graphic logo (if terminal supports it and embedded logo exists)
/// 2. Chafa high-quality symbols (if chafa is available)
/// 3. Real Fastfetch ASCII logo (always available)
pub fn print_distro_logo(distro: Option<&str>) {
    print_distro_logo_with_ascii(distro, false, false);
}

/// Renders the distribution logo with options to force ASCII or Chafa mode.
///
/// This is the primary entry point for logo rendering, handling the entire
/// priority chain from high-res graphics down to text-based ASCII.
/// - `ascii_only`: skip all graphical protocols and render the ASCII art directly.
/// - `chafa_only`: skip Kitty/iTerm2/Sixel and go straight to Chafa (falls back
///   to ASCII if Chafa is unavailable). `ascii_only` takes precedence.
pub fn print_distro_logo_with_ascii(distro: Option<&str>, ascii_only: bool, chafa_only: bool) {
    if ascii_only {
        // Force ASCII path
        let art = get_distro_logo_lines(distro);
        for line in art {
            println!("{}", line);
        }
        return;
    }

    let has_chafa = chafa_available();

    if !chafa_only {
        // Only the image protocols below read these, and they exist only with `graphics`.
        #[cfg(feature = "graphics")]
        let supports_kitty = supports_kitty();
        #[cfg(feature = "graphics")]
        let supports_iterm2 = supports_iterm2();
        #[cfg(feature = "graphics")]
        let supports_sixel = supports_sixel();

        // 1. Try embedded graphical logo (Kitty)
        #[cfg(feature = "graphics")]
        if supports_kitty {
            if let Some(bytes) = get_embedded_logo(distro) {
                if !bytes.is_empty() {
                    print_graphical_logo(bytes);
                    return;
                }
            }
        }

        // 2. Try embedded graphical logo (iTerm2)
        #[cfg(feature = "graphics")]
        if supports_iterm2 {
            if let Some(bytes) = get_embedded_logo(distro) {
                if !bytes.is_empty() {
                    print_iterm2_logo(bytes);
                    return;
                }
            }
        }

        // 3. Try embedded graphical logo (Sixel)
        #[cfg(feature = "graphics")]
        if supports_sixel {
            if let Some(bytes) = get_embedded_logo(distro) {
                if !bytes.is_empty() {
                    print_sixel_logo(bytes);
                    return;
                }
            }
        }
    }

    // 4. Try chafa using embedded distro logo via stdin
    if has_chafa {
        if let Some(bytes) = get_embedded_logo(distro) {
            if bytes.len() > 100 && print_with_chafa_bytes(bytes) {
                return;
            }
        }
    }

    // 5. Final fallback: Real Fastfetch ASCII logo
    let art = get_distro_logo_lines(distro);
    for line in art {
        println!("{}", line);
    }
}

/// Renders a raw image buffer using the iTerm2 inline image protocol.
#[cfg(feature = "graphics")]
pub fn print_iterm2_logo(image_data: &[u8]) {
    use base64::Engine;

    let (width, height) = image::load_from_memory(image_data)
        .map(|img| (img.width(), img.height()))
        .unwrap_or((0, 0));

    let encoded = base64::engine::general_purpose::STANDARD.encode(image_data);

    // `width`/`height` are in character cells here; `preserveAspectRatio=1` makes them a
    // bounding box rather than a target, so the image is never distorted. Passing both (not
    // just `height`) keeps the drawn footprint inside the width `plan_layout` reserved.
    if width > 0 && height > 0 {
        let fit = logo_cells_for(width, height);
        print!(
            "\x1b]1337;File=inline=1;width={};height={};preserveAspectRatio=1:{}\x07",
            fit.cols, fit.rows, encoded
        );
    } else {
        print!(
            "\x1b]1337;File=inline=1;height={};preserveAspectRatio=1:{}\x07",
            LOGO_MAX_ROWS, encoded
        );
    }
    println!(); // iTerm2 typically needs a newline after the logo
}

/// Loads an image from a file and prints it using the iTerm2 protocol.
#[cfg(feature = "graphics")]
pub fn print_iterm2_logo_from_path(path: &std::path::Path) {
    if let Ok(bytes) = std::fs::read(path) {
        print_iterm2_logo(&bytes);
    } else {
        println!("[Could not read logo for iTerm2 from {}]", path.display());
    }
}

/// Placeholder for iTerm2 logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_iterm2_logo(_image_data: &[u8]) {
    println!("[iTerm2 logo support requires --features graphics]");
}

/// Maximum base64 payload bytes per Kitty graphics protocol APC chunk.
#[cfg_attr(not(feature = "graphics"), allow(dead_code))]
const KITTY_MAX_CHUNK_BYTES: usize = 4096;

/// Formats a base64-encoded Kitty graphics payload into one or more ST-terminated APC chunks.
///
/// Payloads up to [`KITTY_MAX_CHUNK_BYTES`] are emitted in a single escape sequence; larger
/// payloads use `m=1` continuation chunks terminated by a final `m=0` chunk, matching the Kitty
/// graphics protocol specification and Zellij's `KittyCommandParser`.
#[cfg_attr(not(feature = "graphics"), allow(dead_code))]
fn format_kitty_escape_chunks(encoded: &str, params: &str) -> String {
    if encoded.len() <= KITTY_MAX_CHUNK_BYTES {
        return format!("\x1b_G{params};{encoded}\x1b\\");
    }

    let chunks: Vec<&[u8]> = encoded.as_bytes().chunks(KITTY_MAX_CHUNK_BYTES).collect();
    let last_idx = chunks.len() - 1;
    let mut out = String::with_capacity(encoded.len() + params.len() + chunks.len() * 14);

    for (idx, chunk) in chunks.into_iter().enumerate() {
        // Base64 is strictly ASCII, so splitting at any byte offset is a valid UTF-8 boundary.
        let part = std::str::from_utf8(chunk).unwrap_or("");
        if idx == 0 {
            out.push_str("\x1b_G");
            out.push_str(params);
            out.push_str(",m=1;");
        } else if idx == last_idx {
            out.push_str("\x1b_Gm=0;");
        } else {
            out.push_str("\x1b_Gm=1;");
        }
        out.push_str(part);
        out.push_str("\x1b\\");
    }
    out
}

/// Builds the Kitty graphics protocol sequence for `image_data`.
///
/// Always includes `q=2` (`quiet=2`) so terminals and multiplexers such as Zellij suppress
/// `\x1b_Gi=...;OK\x1b\` replies on the PTY. When `suppress_cursor_movement` is true (`C=1`),
/// the terminal leaves the cursor where it started instead of advancing across the placement.
#[cfg(feature = "graphics")]
fn encode_kitty_logo(image_data: &[u8], suppress_cursor_movement: bool) -> String {
    use base64::Engine;

    let (width, height) = image::load_from_memory(image_data)
        .map(|img| (img.width(), img.height()))
        .unwrap_or((0, 0));

    let encoded = base64::engine::general_purpose::STANDARD.encode(image_data);
    let cursor_flag = if suppress_cursor_movement { ",C=1" } else { "" };

    let params = if width > 0 && height > 0 {
        // Kitty *forces* the image into whatever placement rectangle it is given, so the
        // spec carries only the limiting dimension and lets Kitty derive the other from the
        // image's aspect ratio. The old hardcoded `c=26,r=10` is what squashed the 3.56:1
        // Fedora logo into a roughly 1:1 box.
        let spec = kitty_placement_spec(logo_cells_for(width, height));
        format!("f=100,q=2{cursor_flag},s={width},v={height},{spec},a=T")
    } else {
        format!("f=100,q=2{cursor_flag},a=T")
    };

    format_kitty_escape_chunks(&encoded, &params)
}

/// Renders a raw image buffer using the Kitty graphics protocol and advances to the next line.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo(image_data: &[u8]) {
    println!("{}", encode_kitty_logo(image_data, false));
}

/// Renders a raw image buffer at the current cursor position using the Kitty graphics protocol
/// with cursor movement suppressed (`C=1`) and no trailing newline.
///
/// Used by side-by-side rendering inside `\x1b7`..`\x1b8` where the logo reaches the terminal's
/// right margin: without `C=1` and without suppressing `println!`, terminals such as Zellij
/// advance `rows + 1` lines and scroll the viewport by a row before `\x1b8` restores the cursor.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo_at_cursor(image_data: &[u8]) {
    use std::io::Write;
    print!("{}", encode_kitty_logo(image_data, true));
    let _ = std::io::stdout().flush();
}

/// Renders a raw image buffer (e.g. PNG bytes) using the Sixel graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_logo(image_data: &[u8]) {
    if let Ok(img) = image::load_from_memory(image_data) {
        // Size the sixel to the same cell box the layout reserved, in pixels. `resize` already
        // preserves aspect ratio (it fits within the box), so this only ever shrinks the image
        // to the footprint `plan_layout` was told about.
        let fit = logo_cells_for(img.width(), img.height());
        let (cell_w, cell_h) = terminal_cell_size_px();
        let resized = img.resize(
            (fit.cols * cell_w) as u32,
            (fit.rows * cell_h) as u32,
            image::imageops::FilterType::Triangle,
        );
        let rgba = resized.to_rgba8();
        let (width, height) = rgba.dimensions();
        print_sixel_rgba(rgba.as_raw(), width, height);
    }
}

/// Renders raw RGBA pixels using the Sixel graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_rgba(rgba: &[u8], width: u32, height: u32) {
    use icy_sixel::SixelImage;

    match SixelImage::try_from_rgba(rgba.to_vec(), width as usize, height as usize) {
        Ok(sixel_img) => match sixel_img.encode() {
            Ok(sixel_str) => {
                print!("{}", sixel_str);
            }
            Err(e) => eprintln!("[Sixel Encoding Error: {}]", e),
        },
        Err(e) => eprintln!("[Sixel Creation Error: {}]", e),
    }
}

/// Placeholder for graphical logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_graphical_logo(_image_data: &[u8]) {
    println!("[Graphical logo support requires --features graphics]");
}

/// Placeholder for cursor-preserving graphical logo rendering when `graphics` is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_graphical_logo_at_cursor(_image_data: &[u8]) {
    print!("[Graphical logo support requires --features graphics]");
}

/// Placeholder for sixel logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_sixel_logo(_image_data: &[u8]) {
    println!("[Sixel logo support requires --features graphics]");
}

/// Loads an image from a file, resizes it, and prints it using the graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo_from_path(path: &std::path::Path) {
    use image::ImageFormat;
    match image::open(path) {
        Ok(img) => {
            let resized = img.resize(128, 128, image::imageops::FilterType::Lanczos3);
            let mut png_data = Vec::new();
            if resized
                .write_to(&mut std::io::Cursor::new(&mut png_data), ImageFormat::Png)
                .is_ok()
            {
                print_graphical_logo(&png_data);
            } else {
                println!("[Failed to encode logo as PNG]");
            }
        }
        Err(_) => {
            println!("[Could not load graphical logo from {}]", path.display());
        }
    }
}

/// Loads an image from a file, resizes it, and prints it using the Sixel protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_logo_from_path(path: &std::path::Path) {
    match image::open(path) {
        Ok(img) => {
            let resized = img.resize(128, 128, image::imageops::FilterType::Lanczos3);
            let rgba = resized.to_rgba8();
            let (width, height) = rgba.dimensions();
            print_sixel_rgba(rgba.as_raw(), width, height);
        }
        Err(_) => {
            println!("[Could not load logo for Sixel from {}]", path.display());
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn known_logos_match_the_shipped_logo_files() {
        // Every logo file (except the Tux fallback) must be listed, and every listed id must
        // have a file. `--list-distros` drifted from the files once; this pins both directions.
        let dir = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("assets/logos");
        let mut shipped: Vec<String> = std::fs::read_dir(&dir)
            .expect("assets/logos exists")
            .filter_map(|e| {
                let name = e.ok()?.file_name().into_string().ok()?;
                name.strip_suffix(".txt").map(str::to_string)
            })
            .filter(|id| id != "tux")
            .collect();
        shipped.sort();
        let mut listed: Vec<String> = KNOWN_LOGOS.iter().map(|(id, _)| id.to_string()).collect();
        listed.sort();
        assert_eq!(listed, shipped, "KNOWN_LOGOS vs assets/logos/*.txt");
    }

    #[test]
    fn every_known_logo_renders_its_own_art_not_tux() {
        let tux = get_ascii_logo(None);
        for (id, _) in KNOWN_LOGOS {
            assert_ne!(get_ascii_logo(Some(id)), tux, "{id} falls back to Tux");
        }
    }

    #[test]
    fn test_get_ascii_logo_arch() {
        let logo = get_ascii_logo(Some("arch"));
        assert!(!logo.is_empty());
        assert!(logo[0].contains("`"));
    }

    #[test]
    fn test_get_ascii_logo_unknown() {
        let logo = get_ascii_logo(Some("unknown_distro"));
        assert!(!logo.is_empty());
        // Should fall back to Tux
        assert!(logo
            .iter()
            .any(|line| line.contains("o${2}_${3}o") || line.contains("o_o")));
    }

    #[test]
    fn test_get_ascii_logo_none() {
        let logo = get_ascii_logo(None);
        assert!(!logo.is_empty());
    }

    static ENV_LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());

    struct EnvGuard {
        _mutex_guard: std::sync::MutexGuard<'static, ()>,
        old_vars: std::collections::HashMap<&'static str, Option<String>>,
    }

    impl EnvGuard {
        fn new(vars_to_mock: &[&'static str]) -> Self {
            let guard = ENV_LOCK.lock().unwrap();
            let mut old_vars = std::collections::HashMap::new();
            for var in vars_to_mock {
                old_vars.insert(*var, std::env::var(var).ok());
            }
            EnvGuard {
                _mutex_guard: guard,
                old_vars,
            }
        }
    }

    impl Drop for EnvGuard {
        fn drop(&mut self) {
            for (var, value) in &self.old_vars {
                if let Some(val) = value {
                    std::env::set_var(var, val);
                } else {
                    std::env::remove_var(var);
                }
            }
        }
    }

    #[test]
    fn test_supports_kitty_heuristics() {
        // Guard and clear all Zellij session variables alongside TERM* so running `cargo test`
        // inside `zellij terminal` never leaks the host session or probes `/dev/tty`.
        let _guard = EnvGuard::new(&[
            "TERM",
            "TERMINAL_EMULATOR",
            "TERM_PROGRAM",
            "ZELLIJ",
            "ZELLIJ_SESSION_NAME",
            "ZELLIJ_PANE_ID",
            "ZELLIJ_DESKTOP_TERMINAL",
        ]);
        std::env::remove_var("ZELLIJ");
        std::env::remove_var("ZELLIJ_SESSION_NAME");
        std::env::remove_var("ZELLIJ_PANE_ID");
        std::env::remove_var("ZELLIJ_DESKTOP_TERMINAL");

        // Test TERM=xterm-kitty
        std::env::set_var("TERM", "xterm-kitty");
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::remove_var("TERM_PROGRAM");
        assert!(supports_kitty());

        // Test TERMINAL_EMULATOR=iterm-kitty
        std::env::remove_var("TERM");
        std::env::set_var("TERMINAL_EMULATOR", "iterm-kitty");
        assert!(supports_kitty());

        // Test TERMINAL_EMULATOR=iTerm.app
        std::env::set_var("TERMINAL_EMULATOR", "iTerm.app");
        assert!(supports_kitty());

        // Test TERM_PROGRAM=rio
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::set_var("TERM_PROGRAM", "rio");
        assert!(supports_kitty());

        // Test ZELLIJ_DESKTOP_TERMINAL=1 vs 0/empty
        std::env::remove_var("TERM_PROGRAM");
        std::env::set_var("ZELLIJ_DESKTOP_TERMINAL", "1");
        assert!(supports_kitty());
        std::env::set_var("ZELLIJ_DESKTOP_TERMINAL", "0");
        assert!(!supports_kitty());
        std::env::set_var("ZELLIJ_DESKTOP_TERMINAL", "");
        assert!(!supports_kitty());

        // Test clear env -> false
        std::env::remove_var("ZELLIJ_DESKTOP_TERMINAL");
        assert!(!supports_kitty());
    }

    #[test]
    fn test_in_zellij_session_env_detection() {
        let _guard = EnvGuard::new(&["ZELLIJ", "ZELLIJ_SESSION_NAME", "ZELLIJ_PANE_ID"]);
        std::env::remove_var("ZELLIJ");
        std::env::remove_var("ZELLIJ_SESSION_NAME");
        std::env::remove_var("ZELLIJ_PANE_ID");
        assert!(!in_zellij_session());

        // `zellij terminal` sets ZELLIJ_SESSION_NAME on server spawn and ZELLIJ=0 in panes.
        std::env::set_var("ZELLIJ", "0");
        assert!(in_zellij_session());

        std::env::remove_var("ZELLIJ");
        std::env::set_var("ZELLIJ_SESSION_NAME", "worthy-llama");
        assert!(in_zellij_session());

        std::env::remove_var("ZELLIJ_SESSION_NAME");
        std::env::set_var("ZELLIJ_PANE_ID", "0");
        assert!(in_zellij_session());
    }

    #[test]
    fn test_parse_kitty_query_response_waits_for_da1_barrier() {
        // Incomplete: Kitty OK arrived, but Primary DA1 `\x1b[?...c` has not yet arrived.
        // Returning `Some(true)` here would leak `62;4;52c` onto the shell prompt.
        let partial_ok = b"\x1b_Gi=31;OK\x1b\\";
        assert_eq!(parse_kitty_query_response(partial_ok), None);

        let partial_da1 = b"\x1b_Gi=31;OK\x1b\\\x1b[?62;4";
        assert_eq!(parse_kitty_query_response(partial_da1), None);

        // Complete: `zellij terminal` 0.46+ / Kitty-backed Zellij 0.45+ reply + DA1.
        let zellij_ok = b"\x1b_Gi=31;OK\x1b\\\x1b[?62;4;52c";
        assert_eq!(parse_kitty_query_response(zellij_ok), Some(true));

        // BEL-terminated APC reply + DA1.
        let bel_ok = b"\x1b_Gi=31;OK\x07\x1b[?62;52c";
        assert_eq!(parse_kitty_query_response(bel_ok), Some(true));

        // Zellij running inside a non-Kitty terminal (e.g. Foot / Alacritty).
        let not_supported =
            b"\x1b_Gi=31;ENOTSUPPORTED:kitty graphics not supported by host terminal\x1b\\\x1b[?62;4;52c";
        assert_eq!(parse_kitty_query_response(not_supported), Some(false));

        // Older Zellij or `support_kitty_graphics_protocol false`: APC ignored, DA1 answered.
        let da1_only = b"\x1b[?62;4c";
        assert_eq!(parse_kitty_query_response(da1_only), Some(false));

        // Foreign APC image id (`i=1;OK`) must not be mistaken for our `i=31` query reply.
        let foreign_apc = b"\x1b_Gi=1;OK\x1b\\\x1b[?62;4c";
        assert_eq!(parse_kitty_query_response(foreign_apc), Some(false));

        // A stale DA1 arriving *before* our `i=31;OK` reply must NOT satisfy the trailing barrier;
        // `parse_kitty_query_response` must keep waiting (`None`) until DA1 arrives *after* `i=31`.
        let stale_da1_then_ok = b"\x1b[?62;4c\x1b_Gi=31;OK\x1b\\";
        assert_eq!(parse_kitty_query_response(stale_da1_then_ok), None);
        let stale_da1_then_ok_and_real_da1 = b"\x1b[?62;4c\x1b_Gi=31;OK\x1b\\\x1b[?62;4;52c";
        assert_eq!(
            parse_kitty_query_response(stale_da1_then_ok_and_real_da1),
            Some(true)
        );
    }

    #[test]
    fn test_collect_kitty_query_reply_drains_da1_and_rejects_missing_barrier() {
        use std::cell::Cell;
        use std::time::Duration;

        let initial = Duration::from_millis(100);
        let drain = Duration::from_millis(150);

        // 1. Regression for `Timeout skips DA1 drain`: Kitty `OK` arrives at 98ms (right before
        // `initial` expires) and Primary DA1 arrives at 115ms. The collector must extend its
        // deadline by `drain` upon seeing `0x1b`, read through DA1, and return `true`.
        let clock = Cell::new(Duration::ZERO);
        let mut call = 0usize;
        let mut observed_timeouts = Vec::new();
        let ok_then_late_da1 = collect_kitty_query_reply(
            initial,
            drain,
            4096,
            || clock.get(),
            |remaining, dst| {
                observed_timeouts.push(remaining);
                call += 1;
                match call {
                    1 => {
                        clock.set(Duration::from_millis(98));
                        let bytes = b"\x1b_Gi=31;OK\x1b\\";
                        dst[..bytes.len()].copy_from_slice(bytes);
                        TtyPollStep::Data(bytes.len())
                    }
                    2 => {
                        clock.set(Duration::from_millis(115));
                        let bytes = b"\x1b[?62;4;52c";
                        dst[..bytes.len()].copy_from_slice(bytes);
                        TtyPollStep::Data(bytes.len())
                    }
                    _ => TtyPollStep::Closed,
                }
            },
        );
        assert!(ok_then_late_da1);
        assert_eq!(
            observed_timeouts,
            vec![Duration::from_millis(100), Duration::from_millis(150)]
        );

        // 2. If `OK` arrives without a trailing DA1 before timeout or EOF, the collector must
        // attempt to drain for the full `drain` window and still return `false`.
        let clock = Cell::new(Duration::ZERO);
        let mut call = 0usize;
        let mut drain_poll_seen = false;
        let ok_without_da1 = collect_kitty_query_reply(
            initial,
            drain,
            4096,
            || clock.get(),
            |remaining, dst| {
                call += 1;
                match call {
                    1 => {
                        clock.set(Duration::from_millis(40));
                        let bytes = b"\x1b_Gi=31;OK\x1b\\";
                        dst[..bytes.len()].copy_from_slice(bytes);
                        TtyPollStep::Data(bytes.len())
                    }
                    2 => {
                        drain_poll_seen = remaining == drain;
                        clock.set(Duration::from_millis(190));
                        TtyPollStep::TimedOut
                    }
                    _ => TtyPollStep::Closed,
                }
            },
        );
        assert!(drain_poll_seen, "expected extended drain poll after 0x1b");
        assert!(!ok_without_da1);

        // 3. Non-answering terminal (no `0x1b` received) stops after `initial` without extending.
        let clock = Cell::new(Duration::ZERO);
        let mut polls = 0usize;
        let silent = collect_kitty_query_reply(
            initial,
            drain,
            4096,
            || clock.get(),
            |remaining, _dst| {
                polls += 1;
                assert_eq!(remaining, initial);
                clock.set(initial);
                TtyPollStep::TimedOut
            },
        );
        assert!(!silent);
        assert_eq!(polls, 1);
    }

    #[test]
    fn test_format_kitty_escape_chunks() {
        // Small payload (<= 4096 bytes): single chunk, no `m=` key.
        let single = format_kitty_escape_chunks("QUJDRA==", "f=100,q=2,C=1,c=45,a=T");
        assert_eq!(single, "\x1b_Gf=100,q=2,C=1,c=45,a=T;QUJDRA==\x1b\\");

        // Exact 4096-byte boundary: still a single chunk.
        let exact = "A".repeat(KITTY_MAX_CHUNK_BYTES);
        let exact_out = format_kitty_escape_chunks(&exact, "f=100,q=2,a=T");
        assert_eq!(exact_out, format!("\x1b_Gf=100,q=2,a=T;{exact}\x1b\\"));

        // Multi-chunk payload (> 4096 bytes): `m=1` on first and middle chunks, `m=0` on last.
        let payload = format!(
            "{}{}{}",
            "A".repeat(KITTY_MAX_CHUNK_BYTES),
            "B".repeat(KITTY_MAX_CHUNK_BYTES),
            "CCCC"
        );
        let chunked = format_kitty_escape_chunks(&payload, "f=100,q=2,C=1,s=384,v=108,c=45,a=T");
        let expected = format!(
            "\x1b_Gf=100,q=2,C=1,s=384,v=108,c=45,a=T,m=1;{}\x1b\\\x1b_Gm=1;{}\x1b\\\x1b_Gm=0;CCCC\x1b\\",
            "A".repeat(KITTY_MAX_CHUNK_BYTES),
            "B".repeat(KITTY_MAX_CHUNK_BYTES),
        );
        assert_eq!(chunked, expected);
    }

    #[test]
    fn test_supports_iterm2_heuristics() {
        // TERM must be guarded and cleared as well as TERM_PROGRAM: `supports_iterm2` consults
        // it via `is_rio_terminal`, so without this the *host's* TERM leaks in and the negative
        // assertions below fail on a Rio box while passing everywhere else.
        let _guard = EnvGuard::new(&["TERM", "TERM_PROGRAM"]);
        std::env::remove_var("TERM");

        // Test TERM_PROGRAM=iTerm.app
        std::env::set_var("TERM_PROGRAM", "iTerm.app");
        assert!(supports_iterm2());

        // Test TERM_PROGRAM=WezTerm
        std::env::set_var("TERM_PROGRAM", "WezTerm");
        assert!(supports_iterm2());

        // Test TERM_PROGRAM=rio
        std::env::set_var("TERM_PROGRAM", "rio");
        assert!(supports_iterm2());

        // Test TERM_PROGRAM=Apple_Terminal
        std::env::set_var("TERM_PROGRAM", "Apple_Terminal");
        assert!(!supports_iterm2());

        // Test clear env -> false
        std::env::remove_var("TERM_PROGRAM");
        assert!(!supports_iterm2());
    }

    #[test]
    fn test_supports_sixel_heuristics() {
        let _guard = EnvGuard::new(&["TERM", "TERM_PROGRAM", "WT_SESSION"]);

        // Clear all to start fresh
        std::env::remove_var("TERM");
        std::env::remove_var("TERM_PROGRAM");
        std::env::remove_var("WT_SESSION");
        assert!(!supports_sixel());

        // Test TERM=xterm-sixel
        std::env::set_var("TERM", "xterm-sixel");
        assert!(supports_sixel());

        // Test TERM=foot
        std::env::set_var("TERM", "foot");
        assert!(supports_sixel());

        // Test TERM=mlterm (case variations)
        std::env::set_var("TERM", "MLTerm");
        assert!(supports_sixel());

        // Reset TERM, test TERM_PROGRAM=WezTerm
        std::env::remove_var("TERM");
        std::env::set_var("TERM_PROGRAM", "WezTerm");
        assert!(supports_sixel());

        // Test TERM_PROGRAM=iTerm.app
        std::env::set_var("TERM_PROGRAM", "iTerm.app");
        assert!(supports_sixel());

        // Test TERM_PROGRAM=rio
        std::env::set_var("TERM_PROGRAM", "rio");
        assert!(supports_sixel());

        // Reset TERM_PROGRAM, test WT_SESSION
        std::env::remove_var("TERM_PROGRAM");
        std::env::set_var("WT_SESSION", "active");
        assert!(supports_sixel());
    }

    #[test]
    fn test_get_embedded_logo() {
        let logo = get_embedded_logo(Some("arch"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("pop"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("manjaro"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("endeavouros"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("opensuse"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("opensuse-leap"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("opensuse-tumbleweed"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("mx"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("linuxmint"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("kali"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("zorin"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("garuda"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("macos"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("windows"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(None);
        assert!(logo.is_some());
    }

    #[cfg(feature = "graphics")]
    #[test]
    fn test_embedded_logos_decode_with_configured_image_features() {
        for (id, _) in KNOWN_LOGOS {
            let bytes = get_embedded_logo(Some(id)).expect("embedded logo bytes present");
            let img = image::load_from_memory(bytes)
                .unwrap_or_else(|e| panic!("failed to decode embedded logo for {id}: {e}"));
            assert!(img.width() > 0 && img.height() > 0, "{id} decoded to 0x0");
        }
        let tux = get_embedded_logo(None).expect("tux fallback bytes present");
        let img = image::load_from_memory(tux).expect("failed to decode tux fallback PNG");
        assert!(img.width() > 0 && img.height() > 0);
    }

    #[test]
    fn test_get_ascii_logo_new_distros() {
        let pop = get_ascii_logo(Some("pop"));
        assert!(!pop.is_empty());
        assert!(pop.iter().any(|line| line.contains("767")));

        let manjaro = get_ascii_logo(Some("manjaro"));
        assert!(!manjaro.is_empty());
        assert!(manjaro.iter().any(|line| line.contains("████████")));

        let endeavouros = get_ascii_logo(Some("endeavouros"));
        assert!(!endeavouros.is_empty());
        assert!(endeavouros.iter().any(|line| line.contains("ssso")));

        let opensuse = get_ascii_logo(Some("opensuse"));
        assert!(!opensuse.is_empty());
        assert!(opensuse.iter().any(|line| line.contains("O0000Ok")));

        let macos = get_ascii_logo(Some("macos"));
        assert!(!macos.is_empty());
        assert!(macos
            .iter()
            .any(|line| line.contains("cKMMMMMMMMMMNWMMMMMMMMMM0")));

        let windows = get_ascii_logo(Some("windows"));
        assert!(!windows.is_empty());
        assert!(windows
            .iter()
            .any(|line| line.contains("AEEEtttt::::ztF") || line.contains("tt:::tt333EE3")));

        let mx = get_ascii_logo(Some("mx"));
        assert!(!mx.is_empty());
        assert!(mx
            .iter()
            .any(|line| line.contains("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMMMMMMMM")));

        let linuxmint = get_ascii_logo(Some("linuxmint"));
        assert!(!linuxmint.is_empty());
        assert!(linuxmint.iter().any(|line| line.contains("oOOOOOOOOOOo")));

        let kali = get_ascii_logo(Some("kali"));
        assert!(!kali.is_empty());
        assert!(kali.iter().any(|line| line.contains(":ccc")));

        let zorin = get_ascii_logo(Some("zorin"));
        assert!(!zorin.is_empty());
        assert!(zorin
            .iter()
            .any(|line| line.contains("osssssssssssssssssssso")));

        let garuda = get_ascii_logo(Some("garuda"));
        assert!(!garuda.is_empty());
        assert!(garuda.iter().any(|line| line.contains("888:8898898")));
    }

    // ── Rio detection (TERM as well as TERM_PROGRAM) ──────────────────────────

    #[test]
    fn test_rio_detected_from_term_when_term_program_is_absent() {
        // The sudo case: `env_reset` keeps TERM but drops TERM_PROGRAM, which used to cost
        // Rio all graphics support and fall through to Chafa.
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);
        std::env::remove_var("TERM_PROGRAM");
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::set_var("TERM", "xterm-rio");

        assert!(is_rio_terminal());
        assert!(supports_kitty());
        assert!(supports_iterm2());
        assert!(supports_sixel());
    }

    #[test]
    fn test_rio_still_detected_from_term_program() {
        // The pre-existing path must keep working when TERM says nothing useful.
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::set_var("TERM", "xterm-256color");
        std::env::set_var("TERM_PROGRAM", "rio");

        assert!(is_rio_terminal());
        assert!(supports_kitty());
    }

    #[test]
    fn test_non_rio_term_is_not_matched() {
        // Guard against a loose substring match: these must not be taken for Rio.
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);
        std::env::remove_var("TERM_PROGRAM");
        std::env::remove_var("TERMINAL_EMULATOR");
        for term in ["xterm-256color", "screen", "linux", "rioja"] {
            std::env::set_var("TERM", term);
            assert!(!is_rio_terminal(), "{term} should not be detected as Rio");
        }
    }

    // ── fit_logo_cells ────────────────────────────────────────────────────────

    #[test]
    fn test_fit_logo_cells_preserves_aspect_for_wide_image() {
        // fedora.png is 384x108 (3.56:1). In 10x20px cells a 45x10 box is 450x200px, so the
        // image is width-limited: 450px wide -> 450*108/384 = 126px tall -> 7 rows.
        // The old hardcoded c=26,r=10 forced it into 260x200px, a ~3x vertical stretch.
        let fit = fit_logo_cells(384, 108, 10, 20, 45, 10);
        assert_eq!(fit.cols, 45);
        assert_eq!(fit.rows, 7);
        assert!(fit.width_limited);
        // A wide image is pinned by width, so Kitty is told the width and derives the height.
        assert_eq!(kitty_placement_spec(fit), "c=45");
    }

    #[test]
    fn test_fit_logo_cells_preserves_aspect_for_tall_image() {
        // debian.png is 291x384 (0.76:1) — height-limited, so it must not claim the full width.
        let fit = fit_logo_cells(291, 384, 10, 20, 45, 10);
        assert_eq!(fit.rows, 10);
        assert!(
            fit.cols < 45,
            "tall image should not fill the width, got {}",
            fit.cols
        );
        assert!(!fit.width_limited);
        assert_eq!(kitty_placement_spec(fit), "r=10");
    }

    #[test]
    fn test_fit_logo_cells_accounts_for_non_square_cells() {
        // A square image in 1:2 cells must come back twice as wide as it is tall, otherwise
        // it renders visibly squashed. Same image, square cells, stays square.
        let fit = fit_logo_cells(256, 256, 10, 20, 45, 10);
        assert_eq!((fit.cols, fit.rows), (20, 10));
        let sq = fit_logo_cells(256, 256, 10, 10, 45, 10);
        assert_eq!((sq.cols, sq.rows), (10, 10));
    }

    #[test]
    fn test_fit_logo_cells_never_exceeds_the_box() {
        // Whatever the aspect, the result must fit the budget plan_layout was given.
        for (w, h) in [(384, 108), (291, 384), (256, 256), (4000, 3), (3, 4000)] {
            let fit = fit_logo_cells(w, h, 10, 20, 45, 10);
            assert!((1..=45).contains(&fit.cols), "{w}x{h} -> {} cols", fit.cols);
            assert!((1..=10).contains(&fit.rows), "{w}x{h} -> {} rows", fit.rows);
        }
    }

    /// Every logo asset shipped in `assets/logos/`, as `(width, height)` pixels.
    ///
    /// Hardcoded rather than read from disk so the test is a pure function of the numbers —
    /// the aspect ratios are what matter, and a fixture that reads PNGs would fail for
    /// filesystem reasons rather than arithmetic ones.
    const SHIPPED_ASSET_DIMENSIONS: &[(u32, u32)] = &[
        (384, 117), // arch
        (291, 384), // debian
        (384, 384), // endeavouros, manjaro, opensuse, pop, windows
        (384, 108), // fedora
        (256, 256), // garuda, linuxmint
        (256, 150), // kali
        (313, 384), // macos
        (256, 232), // mx      <- 220.69 px wide: the truncation case
        (384, 121), // nixos
        (384, 163), // tux
        (384, 135), // ubuntu
        (256, 222), // zorin   <- 230.63 px wide: the other truncation case
    ];

    #[test]
    fn test_fit_logo_cells_reservation_is_never_smaller_than_the_drawn_image() {
        // The invariant `fit_logo_cells` documents, asserted exactly (cross-multiplied, so
        // there is no floating point and no rounding of our own).
        //
        // Regression for a sub-pixel breach: the display size was computed with truncating
        // integer division *before* the cell count was `div_ceil`ed, so a true size sitting
        // just above a cell boundary truncated onto it and reserved one pixel too few.
        // `mx.png` and `zorin.png` both did this (0.07 cells over). It was invisible while the
        // logo sat mid-screen; right-anchored, the overflow is at the terminal's edge.
        for &(w, h) in SHIPPED_ASSET_DIMENSIONS {
            for (cell_w, cell_h) in [(10usize, 20usize), (7, 15), (22, 51), (9, 18)] {
                let fit = fit_logo_cells(w, h, cell_w, cell_h, LOGO_MAX_COLS, LOGO_MAX_ROWS);
                let (box_w, box_h) = (
                    (LOGO_MAX_COLS * cell_w) as u64,
                    (LOGO_MAX_ROWS * cell_h) as u64,
                );
                let (w, h) = (u64::from(w), u64::from(h));
                let (res_w, res_h) = ((fit.cols * cell_w) as u64, (fit.rows * cell_h) as u64);
                if fit.width_limited {
                    // Drawn size is box_w x (box_w * h / w). Assert res_h >= that, exactly.
                    assert!(
                        res_w >= box_w,
                        "{w}x{h} cells {cell_w}x{cell_h}: width short"
                    );
                    // Print the drawn size as a real number — reporting it with the same
                    // truncating division the bug is about would render the message
                    // self-contradicting ("reserved 220px < drawn 220px").
                    assert!(
                        res_h * w >= box_w * h,
                        "{w}x{h} cells {cell_w}x{cell_h}: reserved {res_h}px < drawn {:.2}px",
                        (box_w * h) as f64 / w as f64
                    );
                } else {
                    // Drawn size is (box_h * w / h) x box_h.
                    assert!(
                        res_h >= box_h,
                        "{w}x{h} cells {cell_w}x{cell_h}: height short"
                    );
                    assert!(
                        res_w * h >= box_h * w,
                        "{w}x{h} cells {cell_w}x{cell_h}: reserved {res_w}px < drawn {:.2}px",
                        (box_h * w) as f64 / h as f64
                    );
                }
            }
        }
    }

    #[test]
    fn test_fit_logo_cells_handles_degenerate_input() {
        // Unreadable image dimensions or a terminal reporting zero-size cells must not panic
        // or divide by zero.
        for fit in [
            fit_logo_cells(0, 0, 10, 20, 45, 10),
            fit_logo_cells(384, 108, 0, 20, 45, 10),
            fit_logo_cells(384, 108, 10, 0, 45, 10),
        ] {
            assert_eq!((fit.cols, fit.rows), (45, 10));
        }
    }

    #[test]
    fn test_chafa_size_arg_matches_the_shared_box() {
        // Chafa and the graphical protocols must budget the same footprint.
        assert_eq!(chafa_size_arg(), format!("{LOGO_MAX_COLS}x{LOGO_MAX_ROWS}"));
        assert_eq!(chafa_size_arg(), "45x10");
    }
}
