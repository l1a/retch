// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Formatting and display logic for terminal output.
//!
//! Handles text rendering, layout, and image/ASCII logo rendering.

use crate::cli::Cli;
use crate::config::Config;
use crate::fetch::SystemInfo;
use crate::fields::{self, Mode};
use crate::logo;
use crate::theme::{colorize_nested, Theme, ACTIVE_IFACE_PREFIX};

/// Decide whether to render a logo at all.
///
/// In *auto* mode the logo is shown only when stdout is a TTY: the graphical and
/// Chafa heuristics (and the side-by-side layout) are meaningless when output is
/// piped or redirected, so we suppress the logo there. Two explicit overrides break
/// that rule:
/// - `no_logo` (from `--no-logo` or config) always wins → no logo.
/// - `ascii_logo` (from `--ascii-logo`) forces the logo on **even without a TTY**:
///   ASCII art is plain, pipe-safe text, so a caller (e.g. `retch --ascii-logo | cat`,
///   or CI's `full-test` dry run) that explicitly asks for it should get it — mirroring
///   how `--no-logo` is honored regardless of TTY. `--chafa-logo`/graphical modes are
///   deliberately NOT forced here, since they emit terminal-specific control sequences
///   that are only meaningful on a real terminal.
fn should_show_logo(
    config_show_logo: Option<bool>,
    no_logo: bool,
    ascii_logo: bool,
    stdout_is_tty: bool,
) -> bool {
    if no_logo {
        return false; // explicit suppression always wins
    }
    if ascii_logo {
        return true; // explicit ASCII request forces the logo on, TTY or not, config or not
    }
    config_show_logo.unwrap_or(true) && stdout_is_tty // auto mode: default-on, but TTY-gated
}

/// Result of [`plan_layout`]: whether the logo sits beside the text, and the column the text
/// is padded to (where the logo begins).
struct LayoutPlan {
    side_by_side: bool,
    text_column_width: usize,
}

/// Decide side-by-side vs. stacked layout, and the text-column width, from the geometry of
/// the info block and the currently-selected logo.
///
/// Only the info lines that actually sit **beside** the logo — the first `logo_height` rows —
/// constrain the layout. In `--long`/`--full` the widest lines (Wi-Fi, Network, Battery) fall
/// *below* the logo, where nothing overlaps them, so they must neither widen the text column
/// nor force a stacked layout. Basing the decision on every line (the previous behaviour) let
/// a single 150+ char Wi-Fi line push the logo above the text on any normal-width terminal.
///
/// This is logo-type-agnostic: `logo_height`/`logo_width` are supplied by the caller from the
/// active logo, so it works identically for ASCII art, Chafa (both rendered as text lines),
/// and the graphical image protocols (Kitty/iTerm2/Sixel, whose cell footprint comes from
/// [`logo::fit_logo_cells`] — the *same* call the emitters use to size the image, so the
/// reserved area and the drawn area cannot disagree).
///
/// `info_widths` are the ANSI-stripped visible widths of the info lines, in render order.
fn plan_layout(
    info_widths: &[usize],
    logo_height: usize,
    logo_width: usize,
    term_width: usize,
    show_logo: bool,
) -> LayoutPlan {
    let beside_count = info_widths.len().min(logo_height);
    let max_beside_width = info_widths[..beside_count]
        .iter()
        .copied()
        .max()
        .unwrap_or(0);
    let text_column_width = if term_width >= 95 {
        (term_width.saturating_sub(logo_width + 4))
            .min(std::cmp::max(max_beside_width + 4, 45))
            .clamp(45, 65)
    } else {
        std::cmp::max(max_beside_width + 4, 45)
    };
    let side_by_side =
        show_logo && term_width >= 95 && term_width >= text_column_width + logo_width;
    LayoutPlan {
        side_by_side,
        text_column_width,
    }
}

/// Helper to strip ANSI escape sequences and calculate visible string length.
pub fn visible_len(s: &str) -> usize {
    let mut count = 0;
    let mut in_esc = false;
    for c in s.chars() {
        if c == '\x1b' {
            in_esc = true;
        } else if in_esc {
            if c.is_ascii_alphabetic() {
                in_esc = false;
            }
        } else {
            count += 1;
        }
    }
    count
}

/// Wrap a formatted info line (key: value) at logical boundaries to fit within `max_width`.
///
/// Continuation lines are indented to align with the start of the value portion.
/// Prefers splitting on logical delimiters (e.g. `, `, ` - `) over arbitrary space boundaries,
/// keeping atomic pairs (like `RX: ... TX: ...`) on the same line.
pub fn wrap_info_line(line: &str, max_width: usize) -> Vec<String> {
    let vis_len = visible_len(line);
    if vis_len <= max_width || max_width < 20 {
        return vec![line.to_string()];
    }

    let prefix_len = if let Some(idx) = line.find(':') {
        let prefix_sub = &line[..=idx];
        let extra_space = if line[idx + 1..].starts_with(' ') {
            1
        } else {
            0
        };
        visible_len(prefix_sub) + extra_space
    } else {
        4
    };

    let indent = " ".repeat(prefix_len.min(max_width / 2));

    // Try logical splitting by comma (", ") if present
    if line.contains(", ") {
        let parts: Vec<&str> = line.split(", ").collect();
        let mut lines = Vec::new();
        let mut current = String::new();

        for (i, part) in parts.iter().enumerate() {
            let item = if i == 0 {
                part.to_string()
            } else {
                format!(", {}", part)
            };
            let item_vis = visible_len(&item);

            if current.is_empty() || visible_len(&current) + item_vis <= max_width {
                current.push_str(&item);
            } else {
                lines.push(current);
                current = format!("{}{}", indent, part);
            }
        }
        if !current.is_empty() {
            lines.push(current);
        }
        if lines.iter().all(|l| visible_len(l) <= max_width + 10) {
            return lines;
        }
    }

    // Whitespace splitting fallback: group RX/TX headers with their values
    let raw_words: Vec<&str> = line.split_whitespace().collect();
    let mut words: Vec<String> = Vec::new();
    let mut idx = 0;
    while idx < raw_words.len() {
        if raw_words[idx] == "RX:"
            && idx + 3 < raw_words.len()
            && raw_words.iter().skip(idx).any(|&w| w == "TX:")
        {
            let rx_tx = format!(
                "{} {} {} {} {} {}",
                raw_words[idx],
                raw_words[idx + 1],
                raw_words[idx + 2],
                raw_words[idx + 3],
                raw_words.get(idx + 4).copied().unwrap_or(""),
                raw_words.get(idx + 5).copied().unwrap_or("")
            );
            words.push(rx_tx.trim().to_string());
            idx += if idx + 5 < raw_words.len() { 6 } else { 4 };
            continue;
        }
        words.push(raw_words[idx].to_string());
        idx += 1;
    }

    let mut lines = Vec::new();
    let mut current = String::new();

    for word in words {
        let word_vis = visible_len(&word);
        if current.is_empty() {
            current.push_str(&word);
        } else if visible_len(&current) + 1 + word_vis <= max_width {
            current.push(' ');
            current.push_str(&word);
        } else {
            lines.push(current);
            current = format!("{}{}", indent, word);
        }
    }
    if !current.is_empty() {
        lines.push(current);
    }

    if lines.is_empty() {
        vec![line.to_string()]
    } else {
        lines
    }
}

/// Split the Wi-Fi detail string into `(hardware, connection)` for two-line display.
///
/// The Linux `iw` path builds `"{adapter model} [{iface}] - {SSID} ({band/rate})"` — hardware
/// and connection joined by `" - "`. Splitting on the first `" - "` puts the adapter on one
/// line ("Wi-Fi") and the live connection on a second ("Wi-Fi Link"), so neither is the
/// 150+ char line that used to wrap and collide with the logo. The fallback detectors
/// (nmcli/iwgetid/macOS/Windows) return only the connection with no `" - "`, so those render
/// as a single line (`connection` is `None`).
fn split_wifi_line(wifi: &str) -> (&str, Option<&str>) {
    match wifi.split_once(" - ") {
        Some((hardware, connection)) => (hardware, Some(connection)),
        None => (wifi, None),
    }
}

/// Escape prelude for [`render_graphical_side_by_side`]: reserve `logo_rows` rows with
/// newlines, move back up to the image-top row, shift right to the logo column, and save the
/// cursor (`\x1b7`).
///
/// The reservation is the scroll-safety mechanism: printing the newlines *first* forces any
/// scrolling to happen before the cursor is saved, so nothing between the save and the
/// restore can scroll. Without it, drawing the image with the cursor near the bottom margin
/// scrolled the screen mid-draw, and `\x1b8` — which restores a *viewport-relative*
/// position — landed on the row below the image instead of beside its top (text rendered
/// under the logo; reproduced on Rio and kitty alike whenever the prompt sat near the
/// bottom of a used terminal).
///
/// `logo_rows == 0` emits no reservation and no cursor-up (`CSI 0 A` would still move one
/// row on real terminals).
fn graphical_side_by_side_prelude(text_column_width: usize, logo_rows: usize) -> String {
    let mut prelude = String::new();
    if logo_rows > 0 {
        prelude.push_str(&"\n".repeat(logo_rows));
        prelude.push_str(&format!("\x1b[{}A", logo_rows));
    }
    prelude.push_str(&format!("\x1b[{}C\x1b7", text_column_width));
    prelude
}

/// Render an image-protocol logo (Kitty/iTerm2/Sixel) beside the info text, scroll-safely.
///
/// The logo's rows are **reserved first** (newlines, then cursor-up — see
/// [`graphical_side_by_side_prelude`]) so any scrolling happens up front; the image is then
/// drawn at the top of the logo column bracketed by save/restore (`\x1b7`/`\x1b8`), which is
/// only valid because no scroll can occur between the two. The info lines are then printed
/// top-to-bottom at column 0, so the terminal scrolls naturally and carries the cell-anchored
/// image with it.
///
/// This replaces two broken predecessors: "print all text, then `\x1b[{n}A` back up and draw"
/// (clamped at the viewport top for tall `--long`/`--full` output, drawing the image
/// mid-text) and the v0.6.8 unreserved save/draw/restore (correct on a fresh screen, but with
/// the prompt near the bottom the draw scrolled the screen and the restore landed *below* the
/// image). Residual risk: the draw can still scroll only if the image's real row count
/// exceeds `logo_rows` — the same cell-height estimate the layout already trusts.
fn render_graphical_side_by_side(
    text_column_width: usize,
    info_lines: &[String],
    logo_rows: usize,
    draw: impl FnOnce(),
) {
    use std::io::Write;
    // Reserve the logo rows (scroll now, if at all), return to the image-top row at the
    // logo column, save, draw the image, restore, return to column 0.
    print!(
        "{}",
        graphical_side_by_side_prelude(text_column_width, logo_rows)
    );
    draw(); // emits the image escape (and may move the cursor / print a newline)
    print!("\x1b8\r");
    for line in info_lines {
        println!("{}", line);
    }
    // If the image is taller than the text block, advance past its bottom edge so a following
    // shell prompt doesn't overlap it.
    for _ in info_lines.len()..logo_rows {
        println!();
    }
    let _ = std::io::stdout().flush();
}

/// Renders the collected system information to the terminal.
///
/// This function handles theme selection, logo rendering (including fallbacks
/// between graphics, Chafa, and ASCII), and field filtering based on
/// CLI flags and configuration.
pub fn display(info: &SystemInfo, cli: &Cli, config: &Config) -> anyhow::Result<()> {
    let _config = config;
    let theme_name = _config.theme.as_deref().or(cli.theme.as_deref());
    let mut theme = match theme_name {
        Some(name) => Theme::from_name(name),
        None => Theme::detect_system_theme(), // Default to system preference
    };

    // Apply custom theme overrides from config if present
    if let Some(custom) = &_config.custom_theme {
        theme = Theme::with_custom_overrides(theme, custom);
    }

    // Determine terminal width.
    let term_size = terminal_size::terminal_size();
    let term_width = if let Some((terminal_size::Width(w), _)) = term_size {
        w as usize
    } else {
        80
    };
    // Use isatty() directly — terminal_size() can return Some() when a pager
    // (e.g. bat) allocates a PTY, giving a false positive.
    let stdout_is_tty = std::io::IsTerminal::is_terminal(&std::io::stdout());

    let show_logo = should_show_logo(
        _config.show_logo,
        cli.no_logo,
        cli.ascii_logo,
        stdout_is_tty,
    );

    // Determine which fields to show. Strata allow-lists are derived from the
    // single field registry (src/fields.rs) — the same source `main.rs` uses for
    // collection, so display and collection can no longer drift apart. An explicit
    // `config.fields` list bypasses the strata.
    let allowed_fields: Option<Vec<String>> = if cli.full {
        Some(fields::fields_for(Mode::Full))
    } else if cli.long {
        Some(fields::fields_for(Mode::Long))
    } else if cli.short {
        Some(fields::fields_for(Mode::Short))
    } else if let Some(fields) = &_config.fields {
        Some(fields.iter().map(|s| s.to_lowercase()).collect())
    } else {
        Some(fields::fields_for(Mode::Standard))
    };

    let should_show = |label: &str| -> bool {
        match &allowed_fields {
            Some(fields) => {
                let norm_label = label.to_lowercase().replace(['-', '_'], " ");
                let norm_label_no_spaces = norm_label.replace(' ', "");
                fields.iter().any(|f| {
                    let norm_f = f.to_lowercase().replace(['-', '_'], " ");
                    norm_f == norm_label
                        || norm_f.replace(' ', "") == norm_label_no_spaces
                        // "dns" field key matches "DNS Server" display label
                        || (norm_label == "dns server" && norm_f == "dns")
                        // "memory" field key matches "Memory Usage" display label
                        || (norm_label == "memory usage" && norm_f == "memory")
                        // "Wi-Fi Link" (the connection line) maps to the "wifi" field key
                        || (norm_label == "wi fi link" && norm_f == "wifi")
                })
            }
            None => true,
        }
    };

    // Helper for right-aligned labels
    let label_width = 10;
    let mut info_lines = Vec::new();
    let mut print_line = |label: &str, value: &str| {
        if should_show(label) {
            info_lines.push(format!(
                "{:>width$}{} {}",
                theme.color_label(label),
                theme.color_separator(":"),
                theme.color_value(value),
                width = label_width
            ));
        }
    };

    // OS / system identity
    print_line("OS", &info.os);
    if let Some(kernel) = &info.kernel {
        print_line("Kernel", kernel);
    }
    if let Some(host) = &info.hostname {
        print_line("Host", host);
    }
    if let Some(domain) = &info.domain {
        print_line("Domain", domain);
    }
    if should_show("domain-search") {
        for entry in &info.domain_search {
            print_line("Domain Search", entry);
        }
    }
    if let Some(chassis) = &info.chassis {
        print_line("Chassis", chassis);
    }
    if let Some(init) = &info.init_system {
        print_line("Init", init);
    }
    if let Some(locale) = &info.locale {
        print_line("Locale", locale);
    }
    print_line("Arch", &info.arch);
    // Suppress "Users: 0" — a 0 means the count couldn't be determined (e.g. the Unix
    // uid>=1000 heuristic on a platform that keys users differently), not that nobody is
    // logged in. Mirrors the `packages` guard below.
    if info.users > 0 {
        print_line("Users", &info.users.to_string());
    }
    if let Some(pkgs) = info.packages {
        if pkgs > 0 {
            print_line("Packages", &pkgs.to_string());
        }
    }
    if let Some(user) = &info.current_user {
        print_line("User", user);
    }
    // Uptime belongs with system identity, not hardware
    let uptime_str = format_uptime(&info.uptime);
    let boot_display = format!("{} since {}", uptime_str, info.boot_time);
    print_line("Uptime", &boot_display);

    // Hardware
    print_line("CPU", &format!("{} ({})", info.cpu, info.cpu_core_info));
    if let Some(freq) = &info.cpu_freq {
        print_line("CPU Freq", freq);
    }
    if let Some(cache) = &info.cpu_cache {
        print_line("CPU Cache", cache);
    }
    if let Some(usage) = &info.cpu_usage {
        print_line("CPU Usage", usage);
    }
    if let Some(motherboard) = &info.motherboard {
        print_line("Motherboard", motherboard);
    }
    if let Some(bios) = &info.bios {
        print_line("BIOS", bios);
    }
    if let Some(bootmgr) = &info.bootmgr {
        print_line("Bootmgr", bootmgr);
    }
    if should_show("GPU") {
        for gpu in &info.gpu {
            print_line("GPU", gpu);
        }
    }
    if should_show("Display") {
        for display in &info.displays {
            print_line("Display", display);
        }
    }
    if let Some(brightness) = &info.brightness {
        print_line("Brightness", brightness);
    }
    if let Some(audio) = &info.audio {
        print_line("Audio", audio);
    }
    if should_show("Camera") {
        for cam in &info.camera {
            print_line("Camera", cam);
        }
    }
    if should_show("Gamepad") {
        for gp in &info.gamepad {
            print_line("Gamepad", gp);
        }
    }
    if let Some(wifi) = &info.wifi {
        // Split the (often 150+ char) Wi-Fi string into a hardware line and a connection line
        // so neither wraps and collides with the logo. See `split_wifi_line`.
        let (hardware, connection) = split_wifi_line(wifi);
        print_line("Wi-Fi", hardware);
        if let Some(conn) = connection {
            print_line("Wi-Fi Link", conn);
        }
    }
    if let Some(bt) = &info.bluetooth {
        print_line("Bluetooth", bt);
    }
    if let Some(bat) = &info.battery {
        print_line("Battery", bat);
    }
    if let Some(power) = &info.power_adapter {
        print_line("Power Adapter", power);
    }
    print_line("Memory Usage", &info.memory);
    if let Some(phys_mem) = &info.physical_memory {
        print_line("Phys Mem", phys_mem);
    }
    print_line("Swap", &info.swap);
    print_line("Procs", &info.processes.to_string());
    if let Some(load) = &info.load_avg {
        print_line("Load", load);
    }
    if should_show("Disk") {
        for disk in &info.disks {
            print_line("Disk", disk);
        }
    }
    if should_show("Phys Disk") {
        for disk in &info.physical_disks {
            print_line("Phys Disk", disk);
        }
    }
    if should_show("Btrfs") {
        for vol in &info.btrfs {
            print_line("Btrfs", vol);
        }
    }
    if should_show("Zpool") {
        for pool in &info.zpool {
            print_line("Zpool", pool);
        }
    }
    if should_show("Temp") {
        if cli.full {
            for temp in &info.temps {
                print_line("Temp", temp);
            }
        } else {
            for temp in consolidate_temps(&info.temps) {
                print_line("Temp", &temp);
            }
        }
    }

    // Network
    if should_show("Net") {
        if cli.long || cli.full {
            for net in &info.networks {
                if let Some(ref active) = info.active_interface {
                    if net.contains(active) {
                        // Re-assert bright blue after the nested green "Up" /
                        // red "Down" reset so the whole active line stays blue
                        // (brackets and RX/TX included), not just up to "[".
                        print_line("Net", &colorize_nested(net, ACTIVE_IFACE_PREFIX));
                    }
                }
            }
            for net in &info.networks {
                if let Some(ref active) = info.active_interface {
                    if net.contains(active) {
                        continue;
                    }
                }
                print_line("Net", net);
            }
        } else {
            let mut printed = false;
            if let Some(ref active) = info.active_interface {
                for net in &info.networks {
                    if net.contains(active) {
                        print_line("Net", net);
                        printed = true;
                        break;
                    }
                }
            }
            if !printed {
                for net in &info.networks {
                    if net.contains("[Up]") {
                        print_line("Net", net);
                        break;
                    }
                }
            }
        }
    }
    if let Some(ip) = &info.public_ip {
        print_line("Public IP", ip);
    }
    if !info.dns.is_empty() {
        print_line("DNS Server", &info.dns.join(", "));
    }

    // Environment
    if let Some(shell) = &info.shell {
        print_line("Shell", shell);
    }
    if let Some(editor) = &info.editor {
        print_line("Editor", editor);
    }
    if let Some(term) = &info.terminal {
        print_line("Terminal", term);
    }
    if let Some(ts) = &info.terminal_size {
        print_line("Terminal Size", ts);
    }
    if let Some(de) = &info.desktop {
        print_line("Desktop", de);
    }
    if let Some(wm) = &info.wm {
        let duplicate = info
            .desktop
            .as_deref()
            .map(|de| de.to_lowercase() == wm.to_lowercase())
            .unwrap_or(false);
        if !duplicate {
            print_line("WM", wm);
        }
    }
    if let Some(lm) = &info.login_manager {
        print_line("Login Manager", lm);
    }
    if let Some(ui_theme) = &info.ui_theme {
        print_line("Theme", ui_theme);
    }
    if let Some(icons) = &info.icons {
        print_line("Icons", icons);
    }
    if let Some(cursor) = &info.cursor {
        print_line("Cursor", cursor);
    }
    if let Some(font) = &info.font {
        print_line("Font", font);
    }
    if let Some(term_font) = &info.terminal_font {
        print_line("Terminal Font", term_font);
    }
    if let Some(weather) = &info.weather {
        print_line("Weather", weather);
    }

    // Setup logo representation
    enum ActiveLogo {
        Lines(Vec<String>),
        Kitty(Vec<u8>, usize, usize), // bytes, cols, rows
        Iterm2(Vec<u8>, usize, usize),
        Sixel(Vec<u8>, usize, usize),
        None,
    }

    let mut active_logo = ActiveLogo::None;

    if show_logo {
        let distro_hint = _config.logo.clone().or_else(logo::detect_distro);
        let user_logo = if let Some(config_dir) = dirs::config_dir() {
            let p = config_dir.join("retch").join("logo.png");
            if p.exists() {
                Some(p)
            } else {
                None
            }
        } else {
            None
        };

        if cli.ascii_logo {
            active_logo = ActiveLogo::Lines(logo::get_distro_logo_lines(distro_hint.as_deref()));
        } else if _config.chafa.unwrap_or(false) || cli.chafa_logo {
            let mut resolved = false;
            if logo::chafa_available() {
                if let Some(path) = &user_logo {
                    if let Some(lines) = logo::get_chafa_logo_lines(path) {
                        active_logo = ActiveLogo::Lines(lines);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        let temp_path = std::env::temp_dir()
                            .join(format!("retch_logo_{}.png", std::process::id()));
                        if std::fs::write(&temp_path, bytes).is_ok() {
                            if let Some(lines) = logo::get_chafa_logo_lines(&temp_path) {
                                active_logo = ActiveLogo::Lines(lines);
                                resolved = true;
                            }
                            let _ = std::fs::remove_file(&temp_path);
                        }
                    }
                }
            }
            if !resolved {
                active_logo =
                    ActiveLogo::Lines(logo::get_distro_logo_lines(distro_hint.as_deref()));
            }
        } else {
            let mut resolved = false;

            // Kitty
            #[cfg(feature = "graphics")]
            if !resolved && logo::supports_kitty() {
                if let Some(path) = &user_logo {
                    if let Ok(bytes) = std::fs::read(path) {
                        let (cols, rows) = graphical_logo_cells(&bytes);
                        active_logo = ActiveLogo::Kitty(bytes, cols, rows);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        let (cols, rows) = graphical_logo_cells(bytes);
                        active_logo = ActiveLogo::Kitty(bytes.to_vec(), cols, rows);
                        resolved = true;
                    }
                }
            }

            // iTerm2
            #[cfg(feature = "graphics")]
            if !resolved && logo::supports_iterm2() {
                if let Some(path) = &user_logo {
                    if let Ok(bytes) = std::fs::read(path) {
                        let (cols, rows) = graphical_logo_cells(&bytes);
                        active_logo = ActiveLogo::Iterm2(bytes, cols, rows);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        let (cols, rows) = graphical_logo_cells(bytes);
                        active_logo = ActiveLogo::Iterm2(bytes.to_vec(), cols, rows);
                        resolved = true;
                    }
                }
            }

            // Sixel
            #[cfg(feature = "graphics")]
            if !resolved && logo::supports_sixel() {
                if let Some(path) = &user_logo {
                    if let Ok(bytes) = std::fs::read(path) {
                        let (cols, rows) = graphical_logo_cells(&bytes);
                        active_logo = ActiveLogo::Sixel(bytes, cols, rows);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        let (cols, rows) = graphical_logo_cells(bytes);
                        active_logo = ActiveLogo::Sixel(bytes.to_vec(), cols, rows);
                        resolved = true;
                    }
                }
            }

            // Chafa
            if !resolved && logo::chafa_available() {
                if let Some(path) = &user_logo {
                    if let Some(lines) = logo::get_chafa_logo_lines(path) {
                        active_logo = ActiveLogo::Lines(lines);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        // Write temp logo and read lines via chafa
                        let temp_path = std::env::temp_dir()
                            .join(format!("retch_logo_{}.png", std::process::id()));
                        if std::fs::write(&temp_path, bytes).is_ok() {
                            if let Some(lines) = logo::get_chafa_logo_lines(&temp_path) {
                                active_logo = ActiveLogo::Lines(lines);
                                resolved = true;
                            }
                            let _ = std::fs::remove_file(&temp_path);
                        }
                    }
                }
            }

            // Fallback to ASCII lines
            if !resolved {
                active_logo =
                    ActiveLogo::Lines(logo::get_distro_logo_lines(distro_hint.as_deref()));
            }
        }
    }

    // Helper to strip ANSI codes and calculate visible length
    let visible_len = |s: &str| -> usize {
        let mut count = 0;
        let mut in_esc = false;
        for c in s.chars() {
            if c == '\x1b' {
                in_esc = true;
            } else if in_esc {
                if c.is_ascii_alphabetic() {
                    in_esc = false;
                }
            } else {
                count += 1;
            }
        }
        count
    };

    let info_widths: Vec<usize> = info_lines.iter().map(|line| visible_len(line)).collect();

    // Height (row count) and width of the active logo, whatever its kind. ASCII and Chafa are
    // both `Lines`; the graphical protocols carry their pixel-derived row count and use the
    // fixed image column width.
    let (logo_height, max_logo_width) = match &active_logo {
        ActiveLogo::Lines(logo_lines) => (
            logo_lines.len(),
            logo_lines
                .iter()
                .map(|line| visible_len(line))
                .max()
                .unwrap_or(0),
        ),
        ActiveLogo::Kitty(_, cols, rows)
        | ActiveLogo::Iterm2(_, cols, rows)
        | ActiveLogo::Sixel(_, cols, rows) => (*rows, *cols),
        ActiveLogo::None => (0, 0),
    };

    // Only the lines beside the logo constrain placement — a long Wi-Fi/Network line below it
    // must not force a stacked layout. See `plan_layout`.
    let LayoutPlan {
        side_by_side,
        text_column_width,
    } = plan_layout(
        &info_widths,
        logo_height,
        max_logo_width,
        term_width,
        show_logo,
    );

    println!(); // leading newline

    let formatted_info_lines: Vec<String> = if side_by_side && text_column_width > 15 {
        let mut result = Vec::new();
        for (i, line) in info_lines.iter().enumerate() {
            let max_w = if i < logo_height {
                text_column_width.saturating_sub(2)
            } else {
                term_width.saturating_sub(2)
            };
            result.extend(wrap_info_line(line, max_w));
        }
        result
    } else {
        info_lines.clone()
    };

    if side_by_side {
        match active_logo {
            ActiveLogo::Lines(logo_lines) => {
                let max_lines = std::cmp::max(formatted_info_lines.len(), logo_lines.len());
                for i in 0..max_lines {
                    let info_line = formatted_info_lines.get(i).cloned().unwrap_or_default();
                    let logo_line = logo_lines.get(i).cloned().unwrap_or_default();
                    let vis_len = visible_len(&info_line);
                    let padding = if vis_len < text_column_width {
                        " ".repeat(text_column_width - vis_len)
                    } else {
                        String::new()
                    };
                    println!("{}{}{}", info_line, padding, logo_line);
                }
            }
            ActiveLogo::Kitty(bytes, _, logo_rows) => {
                render_graphical_side_by_side(
                    text_column_width,
                    &formatted_info_lines,
                    logo_rows,
                    || logo::print_graphical_logo(&bytes),
                );
            }
            ActiveLogo::Iterm2(bytes, _, logo_rows) => {
                render_graphical_side_by_side(
                    text_column_width,
                    &formatted_info_lines,
                    logo_rows,
                    || logo::print_iterm2_logo(&bytes),
                );
            }
            ActiveLogo::Sixel(bytes, _, logo_rows) => {
                render_graphical_side_by_side(
                    text_column_width,
                    &formatted_info_lines,
                    logo_rows,
                    || logo::print_sixel_logo(&bytes),
                );
            }
            ActiveLogo::None => {
                for line in &formatted_info_lines {
                    println!("{}", line);
                }
            }
        }
    } else {
        // Narrow or no-logo fallback: print logo, then print data
        match active_logo {
            ActiveLogo::Lines(logo_lines) => {
                for line in logo_lines {
                    println!("{}", line);
                }
                println!();
            }
            ActiveLogo::Kitty(bytes, _, _) => {
                logo::print_graphical_logo(&bytes);
                println!();
            }
            ActiveLogo::Iterm2(bytes, _, _) => {
                logo::print_iterm2_logo(&bytes);
                println!();
            }
            ActiveLogo::Sixel(bytes, _, _) => {
                logo::print_sixel_logo(&bytes);
                println!();
            }
            ActiveLogo::None => {}
        }
        for line in &info_lines {
            println!("{}", line);
        }
    }

    Ok(())
}

/// Returns the highest temperature per physical category from a raw sensor list.
///
/// Input strings are formatted as `"label: 83°C"`. Output is one entry per
/// detected category (CPU / GPU / NVMe / WiFi / Battery / System), ordered
/// from most to least specific. Used by `--long` mode; `--full` shows the raw list.
fn consolidate_temps(temps: &[String]) -> Vec<String> {
    fn categorize(label: &str) -> &'static str {
        let l = label.to_lowercase();
        if l.contains("cpu")
            || l.contains("core")
            || l.contains("k10temp")
            || l.contains("k8temp")
            || l.contains("coretemp")
            || l.contains("tctl")
            || l.contains("tdie")
            || l.contains("tccd")
            || l.contains("package")
        {
            "CPU"
        } else if l.contains("gpu")
            || l.contains("nouveau")
            || l.contains("radeon")
            || l.contains("amdgpu")
        {
            "GPU"
        } else if l.contains("nvme") || l.contains("nand") {
            "NVMe"
        } else if l.contains("ath")
            || l.contains("wifi")
            || l.contains("wireless")
            || l.contains("wlan")
            || l.contains("iwl")
        {
            "WiFi"
        } else if l.contains("bat") {
            "Battery"
        } else {
            "System"
        }
    }

    let mut max: std::collections::HashMap<&str, f32> = std::collections::HashMap::new();
    for s in temps {
        // Parse "some label: 83°C"
        if let Some((label_part, val_part)) = s.rsplit_once(':') {
            let val_str = val_part.trim().trim_end_matches("°C");
            if let Ok(val) = val_str.parse::<f32>() {
                let cat = categorize(label_part.trim());
                let entry = max.entry(cat).or_insert(f32::NEG_INFINITY);
                if val > *entry {
                    *entry = val;
                }
            }
        }
    }

    const ORDER: &[&str] = &["CPU", "GPU", "NVMe", "WiFi", "Battery", "System"];
    ORDER
        .iter()
        .filter_map(|cat| max.get(cat).map(|v| format!("{}: {:.0}°C", cat, v)))
        .collect()
}

/// Formats a raw uptime string (in seconds) into a human-readable duration.
///
/// Example: "45224s" -> "12h 33m 44s"
fn format_uptime(uptime: &str) -> String {
    // Parse the uptime string (e.g. "45224s")
    let seconds: u64 = uptime.trim_end_matches('s').parse().unwrap_or(0);

    let years = seconds / (365 * 24 * 3600);
    let days = (seconds % (365 * 24 * 3600)) / (24 * 3600);
    let hours = (seconds % (24 * 3600)) / 3600;
    let minutes = (seconds % 3600) / 60;
    let secs = seconds % 60;

    let mut parts = Vec::new();
    if years > 0 {
        parts.push(format!("{}y", years));
    }
    if days > 0 {
        parts.push(format!("{}d", days));
    }
    if hours > 0 {
        parts.push(format!("{}h", hours));
    }
    if minutes > 0 {
        parts.push(format!("{}m", minutes));
    }
    if secs > 0 || parts.is_empty() {
        parts.push(format!("{}s", secs));
    }

    parts.join(" ")
}

/// Returns the `(columns, rows)` a graphical logo image will occupy on this terminal.
///
/// Delegates to [`logo::logo_cells_for`], which is also what the Kitty/iTerm2/Sixel emitters
/// use to size the image itself — so the footprint reserved by [`plan_layout`] and the
/// footprint actually drawn are the same numbers by construction. They used to be computed
/// independently (rows here from the pixel height, width hardcoded to 40, and the Kitty
/// escape hardcoding a third answer), which is how the logo ended up stretched *and*
/// mis-positioned.
#[cfg(feature = "graphics")]
fn graphical_logo_cells(bytes: &[u8]) -> (usize, usize) {
    let (img_w, img_h) = image::load_from_memory(bytes)
        .map(|img| (img.width(), img.height()))
        .unwrap_or((0, 0));
    let fit = logo::logo_cells_for(img_w, img_h);
    (fit.cols, fit.rows)
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── should_show_logo ──────────────────────────────────────────────────────

    #[test]
    fn test_show_logo_auto_requires_tty() {
        // Auto mode (no explicit flags): logo only on a TTY.
        assert!(should_show_logo(None, false, false, true));
        assert!(!should_show_logo(None, false, false, false));
    }

    #[test]
    fn test_show_logo_ascii_forces_without_tty() {
        // --ascii-logo forces the logo even when stdout is not a TTY (pipe / CI).
        assert!(should_show_logo(None, false, true, false));
        assert!(should_show_logo(None, false, true, true));
    }

    #[test]
    fn test_show_logo_no_logo_always_wins() {
        // --no-logo suppresses even when --ascii-logo is set or on a TTY.
        assert!(!should_show_logo(None, true, true, true));
        assert!(!should_show_logo(None, true, false, true));
    }

    #[test]
    fn test_show_logo_config_disable() {
        // config show_logo=false suppresses in auto mode...
        assert!(!should_show_logo(Some(false), false, false, true));
        // ...but an explicit --ascii-logo still forces it on (CLI overrides config default).
        assert!(should_show_logo(Some(false), false, true, false));
    }

    // ── plan_layout ───────────────────────────────────────────────────────────

    // A ~20-row logo with the widest beside-logo line = 54 (e.g. the CPU line), then a very
    // long Wi-Fi line (158) far below it — the real --full shape on this hardware.
    fn realistic_full_widths() -> Vec<usize> {
        let mut w = vec![40; 20]; // rows 0..20 sit beside the logo
        w[13] = 54; // CPU line, still beside the logo
        w.extend([158, 91, 79, 60, 45, 62]); // Wi-Fi/Net/Battery/etc., all BELOW the logo
        w
    }

    #[test]
    fn test_layout_long_line_below_logo_stays_side_by_side() {
        // The 158-wide Wi-Fi line is below the 20-row logo, so it must NOT force a stack.
        let p = plan_layout(&realistic_full_widths(), 20, 40, 120, true);
        assert!(p.side_by_side);
        // Text column is driven by the widest BESIDE-logo line (54), not the 158 below it.
        assert_eq!(p.text_column_width, 58); // 54 + 4
    }

    #[test]
    fn test_layout_old_behavior_would_have_stacked() {
        // Sanity: the pre-fix rule (widest of ALL lines) would need 158+4+40 = 202 cols and
        // stack at 120. Confirm the *new* rule does not, on the same inputs.
        let widths = realistic_full_widths();
        let old_text_col = std::cmp::max(widths.iter().copied().max().unwrap() + 4, 45);
        assert!(120 < old_text_col + 40); // old rule: stacked
        assert!(plan_layout(&widths, 20, 40, 120, true).side_by_side); // new rule: side-by-side
    }

    #[test]
    fn test_layout_long_line_within_logo_wraps_and_stays_side_by_side() {
        // A 158-wide line among the first `logo_height` rows no longer breaks side-by-side layout
        // because text_column_width is clamped and the line is wrapped.
        let mut w = vec![40; 20];
        w[5] = 158;
        let p = plan_layout(&w, 20, 40, 120, true);
        assert!(p.side_by_side);
        assert_eq!(p.text_column_width, 65);
    }

    #[test]
    fn test_layout_narrow_terminal_stacks() {
        assert!(!plan_layout(&[40; 30], 20, 40, 94, true).side_by_side); // < 95 hard floor
        assert!(!plan_layout(&[40; 30], 20, 40, 80, true).side_by_side);
    }

    #[test]
    fn test_layout_show_logo_false_stacks() {
        assert!(!plan_layout(&[40; 30], 20, 40, 200, false).side_by_side);
    }

    #[test]
    fn test_layout_column_floor_and_graphical_width() {
        // Tiny lines → text column floored at 45; graphical logo width (40) still applies.
        let p = plan_layout(&[10; 25], 20, 40, 100, true);
        assert!(p.side_by_side);
        assert_eq!(p.text_column_width, 45); // max(10+4, 45)
    }

    #[test]
    fn test_layout_widened_logo_box_still_fits_at_the_side_by_side_threshold() {
        // The logo cell box grew from 28 to `logo::LOGO_MAX_COLS` (45) so wide-aspect logos get
        // enough rows to stay legible. That must not cost the side-by-side layout at the 95-col
        // threshold: the text column floors at 45, and 45 + 45 = 90 <= 95.
        let p = plan_layout(&[10; 25], 10, logo::LOGO_MAX_COLS, 95, true);
        assert!(
            p.side_by_side,
            "a full-width logo must still sit beside the text at 95 columns"
        );
        assert!(p.text_column_width + logo::LOGO_MAX_COLS <= 95);

        // And a wide terminal is unaffected — the text column still reaches its 65 cap.
        let wide = plan_layout(&[120; 25], 10, logo::LOGO_MAX_COLS, 169, true);
        assert!(wide.side_by_side);
        assert_eq!(wide.text_column_width, 65);
    }

    #[test]
    fn test_layout_logo_taller_than_text() {
        // Fewer info lines than logo rows: all lines are beside the logo (no panic on slice).
        let p = plan_layout(&[50, 30, 54], 20, 40, 120, true);
        assert!(p.side_by_side);
        assert_eq!(p.text_column_width, 58); // widest of the 3 (54) + 4
    }

    // ── graphical_side_by_side_prelude ────────────────────────────────────────

    #[test]
    fn test_prelude_reserves_rows_before_saving_cursor() {
        // Regression for the below-the-logo bug (Rio/kitty, prompt at the bottom row): the
        // scroll-forcing reservation (newlines) and the cursor-up must both come BEFORE the
        // cursor save, so nothing between save and restore can scroll.
        let p = graphical_side_by_side_prelude(52, 3);
        assert_eq!(p, "\n\n\n\x1b[3A\x1b[52C\x1b7");
    }

    #[test]
    fn test_prelude_v068_shape_only_differs_by_reservation() {
        // With the reservation stripped, the prelude is exactly the v0.6.8 bytes — the fresh
        // top-of-screen rendering (where no scroll happens) is unchanged.
        let p = graphical_side_by_side_prelude(45, 20);
        assert_eq!(
            p.replace(&format!("{}\x1b[20A", "\n".repeat(20)), ""),
            "\x1b[45C\x1b7"
        );
    }

    #[test]
    fn test_prelude_zero_rows_skips_reservation_and_cursor_up() {
        // CSI 0 A still moves one row on real terminals, so logo_rows == 0 must emit
        // neither the reservation nor the cursor-up.
        let p = graphical_side_by_side_prelude(45, 0);
        assert_eq!(p, "\x1b[45C\x1b7");
    }

    // ── split_wifi_line ───────────────────────────────────────────────────────

    #[test]
    fn test_split_wifi_hardware_and_connection() {
        // The real `iw`-path shape: "{adapter} [{iface}] - {ssid} ({details})".
        let s = "MEDIATEK Corp. MT7925 802.11be [Filogic 360] [wlp194s0] - myssid (5.0 GHz ch36 [↓866 ↑866])";
        let (hw, conn) = split_wifi_line(s);
        assert_eq!(
            hw,
            "MEDIATEK Corp. MT7925 802.11be [Filogic 360] [wlp194s0]"
        );
        assert_eq!(conn, Some("myssid (5.0 GHz ch36 [↓866 ↑866])"));
    }

    #[test]
    fn test_split_wifi_splits_on_first_separator() {
        // Only the first " - " (the hardware|connection boundary) splits; a " - " inside the
        // SSID/details stays with the connection.
        let (hw, conn) = split_wifi_line("Card X [wlan0] - Guest - 5G (5 GHz)");
        assert_eq!(hw, "Card X [wlan0]");
        assert_eq!(conn, Some("Guest - 5G (5 GHz)"));
    }

    #[test]
    fn test_split_wifi_connection_only_fallback() {
        // Fallback detectors (nmcli/iwgetid/macOS/Windows) have no " - " → single line.
        let (hw, conn) = split_wifi_line("myssid (300 Mbps)");
        assert_eq!(hw, "myssid (300 Mbps)");
        assert_eq!(conn, None);
    }

    #[test]
    fn test_consolidate_temps_basic() {
        let raw = vec![
            "k10temp Tctl: 83°C".to_string(),
            "amdgpu edge: 65°C".to_string(),
            "nvme Composite: 62°C".to_string(),
            "ath11k_hwmon temp1: 58°C".to_string(),
            "acpitz temp1: 77°C".to_string(),
        ];
        let result = consolidate_temps(&raw);
        assert_eq!(
            result,
            vec![
                "CPU: 83°C",
                "GPU: 65°C",
                "NVMe: 62°C",
                "WiFi: 58°C",
                "System: 77°C"
            ]
        );
    }

    #[test]
    fn test_consolidate_temps_highest_wins() {
        let raw = vec![
            "thinkpad CPU: 83°C".to_string(),
            "k10temp Tctl: 79°C".to_string(),
            "nvme Composite: 62°C".to_string(),
            "nvme Sensor 1: 59°C".to_string(),
            "nvme Sensor 2: 56°C".to_string(),
        ];
        let result = consolidate_temps(&raw);
        assert!(result.contains(&"CPU: 83°C".to_string()));
        assert!(result.contains(&"NVMe: 62°C".to_string()));
        assert!(!result
            .iter()
            .any(|s| s.contains("79") || s.contains("59") || s.contains("56")));
    }

    #[test]
    fn test_consolidate_temps_order() {
        let raw = vec![
            "acpitz: 60°C".to_string(),
            "nvme: 55°C".to_string(),
            "amdgpu edge: 65°C".to_string(),
            "k10temp Tctl: 80°C".to_string(),
        ];
        let result = consolidate_temps(&raw);
        let cpu_pos = result.iter().position(|s| s.starts_with("CPU"));
        let gpu_pos = result.iter().position(|s| s.starts_with("GPU"));
        let nvme_pos = result.iter().position(|s| s.starts_with("NVMe"));
        let sys_pos = result.iter().position(|s| s.starts_with("System"));
        assert!(cpu_pos < gpu_pos);
        assert!(gpu_pos < nvme_pos);
        assert!(nvme_pos < sys_pos);
    }

    #[test]
    fn test_consolidate_temps_empty() {
        assert!(consolidate_temps(&[]).is_empty());
    }

    #[test]
    fn test_format_uptime() {
        assert_eq!(format_uptime("60s"), "1m");
        assert_eq!(format_uptime("3600s"), "1h");
        assert_eq!(format_uptime("3661s"), "1h 1m 1s");
        assert_eq!(format_uptime("86400s"), "1d");
        assert_eq!(format_uptime("90061s"), "1d 1h 1m 1s");
        assert_eq!(format_uptime("31536000s"), "1y");
        assert_eq!(format_uptime("31626061s"), "1y 1d 1h 1m 1s");
        assert_eq!(format_uptime("0s"), "0s");
    }

    #[test]
    fn test_wrap_info_line_short_line_unchanged() {
        let line = "Audio: Windows Audio (USB Audio Device)";
        let wrapped = wrap_info_line(line, 50);
        assert_eq!(wrapped, vec![line.to_string()]);
    }

    #[test]
    fn test_wrap_info_line_wraps_and_indents() {
        let line = "Audio: Windows Audio (USB Audio Device, AMD High Definition Audio Device, AMD SoundWire Device)";
        let wrapped = wrap_info_line(line, 45);
        assert!(wrapped.len() > 1);
        assert!(wrapped[0].starts_with("Audio: Windows Audio"));
        assert!(wrapped[1].starts_with("       "));
    }
}
