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

/// Result of [`plan_layout`]: whether the logo sits beside the text, the width the info
/// lines beside the logo wrap to, and the column the logo itself is drawn at.
///
/// `text_column_width` and `logo_column` are deliberately **separate**. The first bounds how
/// wide a beside-logo info line may grow; the second is where the logo block starts. Folding
/// them into one value is what let the logo drift inward: the text column is clamped to 65
/// columns, so on a wide terminal the logo was drawn at column 65 with the rest of the
/// terminal left empty.
struct LayoutPlan {
    side_by_side: bool,
    text_column_width: usize,
    logo_column: usize,
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
/// In side-by-side mode the logo is **flush against the right margin** (`logo_column =
/// term_width - logo_width`), not butted up against the end of the text column. The two used
/// to be the same number, which was only ever right by accident: before the text column was
/// narrowed to the beside-logo lines (v0.6.8) and then clamped to 65 (v0.6.16), a long
/// `Wi-Fi`/`Net` line inflated it far enough that the logo happened to land near the edge.
/// Afterwards it sat at column 65 on every wide terminal, stranding the remainder.
///
/// Right-anchoring can never push the logo *left* of the text: `side_by_side` already
/// requires `term_width >= text_column_width + logo_width`, so `term_width - logo_width` is
/// at least `text_column_width`.
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
    // Flush right. The `max(text_column_width)` floor is belt-and-braces: the `side_by_side`
    // condition above already guarantees it, and the value is unused when stacked.
    let logo_column = term_width.saturating_sub(logo_width).max(text_column_width);
    LayoutPlan {
        side_by_side,
        text_column_width,
        logo_column,
    }
}

/// Strip ANSI escape sequences and return the string's width in **terminal columns**.
///
/// Not a character count. A CJK ideograph or a Hangul syllable occupies two columns, a
/// combining mark occupies none, and an emoji followed by the variation selector U+FE0F
/// (`☀️`) is two columns even though its base character alone would be one — none of which a
/// `chars().count()` can express.
///
/// This matters because every layout decision in this module is denominated in columns: the
/// padding that positions the logo, the wrap width for beside-logo lines, and the logo's own
/// measured width. Counting characters undercounted `Media: 宇多田ヒカル - 花束を君に` by 11
/// columns, so the line overran its column and pushed the logo out of alignment on that row.
/// `media`/`player` (v0.8.0) read arbitrary track metadata, so non-Latin text is an ordinary
/// input here, not an exotic one.
///
/// Escape handling is unchanged: `\x1b` opens a sequence that ends at the first ASCII letter,
/// which covers the CSI (`\x1b[…m`), charset (`\x1b(B`) and private (`\x1b[?25l`) forms that
/// `owo_colors` and `chafa` emit.
///
/// The visible characters are measured as one run rather than summed per character, because
/// width is not a per-character property: variation-selector and zero-width-joiner sequences
/// are only correct when the whole grapheme is measured together.
pub fn visible_len(s: &str) -> usize {
    use unicode_width::UnicodeWidthStr;

    let mut visible = String::with_capacity(s.len());
    let mut in_esc = false;
    for c in s.chars() {
        if c == '\x1b' {
            in_esc = true;
        } else if in_esc {
            if c.is_ascii_alphabetic() {
                in_esc = false;
            }
        } else {
            visible.push(c);
        }
    }
    visible.width()
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
                // Keep the separator we split on. Dropping it changed the *data*, not just
                // its appearance: `American Megatrends International, LLC.` wrapped to
                // `…International` / `LLC.`, which reads as two values rather than one
                // company name. The comma stays on the preceding line, as in prose.
                lines.push(format!("{current},"));
                current = format!("{}{}", indent, part);
            }
        }
        if !current.is_empty() {
            lines.push(current);
        }
        if lines.iter().all(|l| visible_len(l) <= max_width + 10) {
            return carry_sgr_across_lines(lines);
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
        // No separator to retain here — this branch breaks on whitespace, and a space at a
        // line break needs no visible marker the way a comma does.
        carry_sgr_across_lines(lines)
    }
}

/// The foreground-colour SGR sequence still in effect at the end of `s`, given the sequence
/// `entry` that was in effect when it started.
///
/// Only foreground colour is tracked, because that is all `Theme`/`owo_colors` emit here.
/// A reset — `\x1b[0m` or `\x1b[39m` — clears it; any other `…m` sequence becomes the new
/// state. Non-`m` sequences (cursor moves, chafa's `\x1b[?25l`) are ignored.
fn active_sgr_after(s: &str, entry: Option<String>) -> Option<String> {
    let mut active = entry;
    let bytes = s.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] != 0x1b {
            i += 1;
            continue;
        }
        let start = i;
        i += 1;
        while i < bytes.len() && !bytes[i].is_ascii_alphabetic() {
            i += 1;
        }
        if i < bytes.len() {
            let seq = &s[start..=i];
            if seq.ends_with('m') {
                active = if seq == "\x1b[0m" || seq == "\x1b[39m" {
                    None
                } else {
                    Some(seq.to_string())
                };
            }
            i += 1;
        }
    }
    active
}

/// Re-open the active colour on every continuation line, and close it at each line end.
///
/// Info lines are colourised **before** they are wrapped, so a value split across lines has
/// its opening SGR on the first line and its closing `\x1b[39m` on the last: every line in
/// between renders in the terminal's default colour. Reported against a wrapped `BIOS:` value,
/// whose second line came out uncoloured while the first was cyan.
///
/// Fixing it at the wrap step rather than by colourising after wrapping is deliberate — the
/// wrap points are chosen from *visible* width, so wrapping has to see the escapes anyway.
///
/// Only zero-width escape sequences are added, so [`visible_len`] of every line is unchanged
/// and the widths the layout already computed still hold.
fn carry_sgr_across_lines(lines: Vec<String>) -> Vec<String> {
    let mut active: Option<String> = None;
    let mut out = Vec::with_capacity(lines.len());
    for line in lines {
        let reopened = match &active {
            Some(sgr) => format!("{sgr}{line}"),
            None => line.clone(),
        };
        let end_state = active_sgr_after(&line, active.clone());
        active = end_state.clone();
        out.push(match end_state {
            // Close the colour at the line end so it cannot bleed into the logo column.
            Some(_) => format!("{reopened}\x1b[39m"),
            None => reopened,
        });
    }
    out
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

/// Compose one row of the side-by-side layout: the info line, padded out to `logo_column`,
/// followed by the logo line.
///
/// Padding goes to the **logo column** (the right margin), not merely to the end of the text
/// column. Rows with no logo content get none at all — otherwise every line below the logo
/// would carry ~90 trailing spaces.
///
/// Extracted from `display()`'s render loop deliberately. This arithmetic used to be inline
/// there, alongside a local `visible_len` closure that shadowed the module function for the
/// whole of `display()`; the shadow was a byte-for-byte copy of an older, character-counting
/// implementation, so the layout silently measured characters while the module function —
/// and its unit tests — measured columns. A free function cannot be shadowed by a local
/// binding in another function's body, so the two can no longer diverge, and this is now
/// directly testable without a pseudo-terminal.
fn compose_side_by_side_row(info_line: &str, logo_line: &str, logo_column: usize) -> String {
    let vis_len = visible_len(info_line);
    if logo_line.is_empty() || vis_len >= logo_column {
        return format!("{info_line}{logo_line}");
    }
    format!(
        "{info_line}{}{logo_line}",
        " ".repeat(logo_column - vis_len)
    )
}

/// Escape prelude for [`render_graphical_side_by_side`]: reserve `logo_rows` rows with
/// newlines, move back up to the image-top row, shift right to `logo_column`, and save the
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
fn graphical_side_by_side_prelude(logo_column: usize, logo_rows: usize) -> String {
    let mut prelude = String::new();
    if logo_rows > 0 {
        prelude.push_str(&"\n".repeat(logo_rows));
        prelude.push_str(&format!("\x1b[{}A", logo_rows));
    }
    prelude.push_str(&format!("\x1b[{}C\x1b7", logo_column));
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
    logo_column: usize,
    info_lines: &[String],
    logo_rows: usize,
    draw: impl FnOnce(),
) {
    use std::io::Write;
    // Reserve the logo rows (scroll now, if at all), return to the image-top row at the
    // logo column, save, draw the image, restore, return to column 0.
    print!("{}", graphical_side_by_side_prelude(logo_column, logo_rows));
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
    if let Some(tpm) = &info.tpm {
        print_line("TPM", tpm);
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
    if should_show("Keyboard") {
        for kb in &info.keyboard {
            print_line("Keyboard", kb);
        }
    }
    if should_show("Mouse") {
        for m in &info.mouse {
            print_line("Mouse", m);
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
    if let Some(wm_theme) = &info.wm_theme {
        print_line("WM Theme", wm_theme);
    }
    if let Some(wallpaper) = &info.wallpaper {
        print_line("Wallpaper", wallpaper);
    }
    if let Some(lm) = &info.login_manager {
        print_line("Login Manager", lm);
    }
    if let Some(player) = &info.player {
        print_line("Player", player);
    }
    if let Some(media) = &info.media {
        print_line("Media", media);
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
    if let Some(term_theme) = &info.terminal_theme {
        print_line("Terminal Theme", term_theme);
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

    // NOTE: `display()` previously defined a local `visible_len` closure here that was a
    // byte-for-byte copy of the module-level [`visible_len`] and shadowed it for this entire
    // function — which is where every layout decision is made. It has been removed so there
    // is one implementation. Do not reintroduce a local helper by this name: the shadow was
    // invisible at every call site (the calls below read identically either way), and it
    // silently reverted this module's width handling for the layout while the module
    // function's own unit tests kept passing.
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
        logo_column,
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
            // Beside-logo rows may use every column up to the logo, not just the text
            // column. Those were the same number until the logo was anchored to the right
            // margin; afterwards, wrapping at the text column left a wrapped line with the
            // whole gap to the logo unused — a 283-column terminal wrapped `BIOS:` at 55
            // columns with ~177 free to its right. Below-logo rows already use the full
            // terminal width, so this makes the two consistent.
            let max_w = if i < logo_height {
                logo_column.saturating_sub(2)
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
                    println!(
                        "{}",
                        compose_side_by_side_row(&info_line, &logo_line, logo_column)
                    );
                }
            }
            ActiveLogo::Kitty(bytes, _, logo_rows) => {
                render_graphical_side_by_side(
                    logo_column,
                    &formatted_info_lines,
                    logo_rows,
                    || logo::print_graphical_logo(&bytes),
                );
            }
            ActiveLogo::Iterm2(bytes, _, logo_rows) => {
                render_graphical_side_by_side(
                    logo_column,
                    &formatted_info_lines,
                    logo_rows,
                    || logo::print_iterm2_logo(&bytes),
                );
            }
            ActiveLogo::Sixel(bytes, _, logo_rows) => {
                render_graphical_side_by_side(
                    logo_column,
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

    // ── visible_len ───────────────────────────────────────────────────────────

    #[test]
    fn test_visible_len_strips_every_escape_form_retch_emits() {
        // owo_colors' SGR, its default-reset, chafa's private-mode cursor hide, and the
        // charset designator. `\x1b[?25l` is the one that bit a measurement harness during
        // this work: it is 6 characters and an SGR-only stripper leaves all of them.
        assert_eq!(visible_len("plain"), 5);
        assert_eq!(visible_len("\x1b[38;2;1;2;3mabc\x1b[39m"), 3);
        assert_eq!(visible_len("\x1b[?25labc"), 3);
        assert_eq!(visible_len("\x1b(Babc"), 3);
        assert_eq!(visible_len("\x1b[0m \x1b[38;2;0;0;0m\u{2582}"), 2);
    }

    #[test]
    fn test_visible_len_counts_columns_not_characters() {
        // Regression: this returned a char count, so every wide glyph was undercounted by
        // one column. `media`/`player` (v0.8.0) surface arbitrary track metadata, so CJK and
        // Hangul are ordinary inputs.
        assert_eq!(visible_len("宇多田ヒカル"), 12); // 6 ideographs, 2 columns each
        assert_eq!(visible_len("아이유"), 6); // 3 Hangul syllables
        assert_eq!(visible_len("Media: 宇多田ヒカル - 花束を君に"), 32);
        assert_eq!(visible_len("Media: 아이유 - 밤편지"), 22);

        // Combining marks add no width: "cafe" + U+0301 renders as four columns.
        assert_eq!(visible_len("cafe\u{301}"), 4);
        // Precomposed form measures the same, so the two spellings cannot disagree.
        assert_eq!(visible_len("café"), 4);

        // A colour-wrapped wide value must measure the same as the bare one — the layout
        // sees the wrapped form.
        assert_eq!(
            visible_len("\x1b[38;2;1;2;3m宇多田\x1b[39m"),
            visible_len("宇多田")
        );
    }

    #[test]
    fn test_visible_len_ascii_art_and_chafa_symbols_are_one_column_each() {
        // Every shipped logo is ASCII or narrow block-drawing, which is why the char-count
        // bug never showed on a logo. Pin that, so a future wide-glyph asset fails here
        // rather than silently overflowing the right margin.
        for line in logo::get_ascii_logo(Some("fedora")) {
            let stripped: String = strip_for_test(&line);
            assert_eq!(
                visible_len(&line),
                stripped.chars().count(),
                "fedora ASCII logo line is not one column per character: {stripped:?}"
            );
        }
        // Chafa's half-block/quadrant symbols are all narrow.
        for sym in [
            '\u{2580}', '\u{2584}', '\u{2588}', '\u{258c}', '\u{2596}', '\u{2582}',
        ] {
            assert_eq!(visible_len(&sym.to_string()), 1, "{sym:?} is not 1 column");
        }
    }

    /// Test-only escape stripper, deliberately independent of [`visible_len`] so the test
    /// above compares two different implementations rather than one against itself.
    fn strip_for_test(s: &str) -> String {
        let mut out = String::new();
        let mut in_esc = false;
        for c in s.chars() {
            if c == '\x1b' {
                in_esc = true;
            } else if in_esc {
                if c.is_ascii_alphabetic() {
                    in_esc = false;
                }
            } else {
                out.push(c);
            }
        }
        out
    }

    // ── wrap_info_line: separator retention and colour carry ──────────────────

    /// The shape `Theme::color_value` produces: `<SGR>value<reset>`.
    const CYAN: &str = "\x1b[38;2;0;255;255m";
    const RESET: &str = "\x1b[39m";

    #[test]
    fn test_wrap_keeps_the_comma_it_split_on() {
        // Regression: the comma was dropped at the break, so a wrapped
        // `American Megatrends International, LLC.` read as two separate values. That is a
        // change to the data, not to its presentation.
        let out = wrap_info_line(
            "BIOS: American Megatrends International, LLC. HN7306EAC.310 (8//20/07/0)",
            40,
        );
        assert!(out.len() > 1, "expected a wrap, got {out:?}");
        assert!(
            out[0].ends_with(','),
            "separator lost at the break: {:?}",
            out[0]
        );
        // And nothing is invented or dropped: rejoining recovers the original text.
        let rejoined: String = out
            .iter()
            .map(|l| l.trim_start().to_string())
            .collect::<Vec<_>>()
            .join(" ");
        assert_eq!(
            rejoined,
            "BIOS: American Megatrends International, LLC. HN7306EAC.310 (8//20/07/0)"
        );
    }

    #[test]
    fn test_wrap_reopens_the_colour_on_every_continuation_line() {
        // Reported symptom: a wrapped BIOS value rendered its second line in the terminal
        // default because the opening SGR stayed on line 1 and the closing reset landed on
        // the last line.
        let line =
            format!("BIOS: {CYAN}American Megatrends International, LLC. HN7306EAC.310{RESET}");
        let out = wrap_info_line(&line, 40);
        assert!(out.len() > 1, "expected a wrap, got {out:?}");
        for (i, l) in out.iter().enumerate().skip(1) {
            assert!(
                l.contains(CYAN),
                "continuation line {i} has no colour: {l:?}"
            );
        }
        // Every line that opens a colour also closes it, so none can bleed into the logo.
        for l in &out {
            if l.contains(CYAN) {
                assert!(l.ends_with(RESET), "colour left open on {l:?}");
            }
        }
    }

    #[test]
    fn test_wrap_colour_carry_does_not_change_visible_width() {
        // The escapes added must be zero-width, or every layout number computed from these
        // lines would be wrong.
        let plain = "BIOS: American Megatrends International, LLC. HN7306EAC.310";
        let coloured =
            format!("BIOS: {CYAN}American Megatrends International, LLC. HN7306EAC.310{RESET}");
        let a = wrap_info_line(plain, 40);
        let b = wrap_info_line(&coloured, 40);
        assert_eq!(a.len(), b.len());
        for (x, y) in a.iter().zip(b.iter()) {
            assert_eq!(visible_len(x), visible_len(y), "{x:?} vs {y:?}");
        }
    }

    #[test]
    fn test_wrap_uncoloured_line_is_untouched_by_the_carry() {
        let out = wrap_info_line("Disk: aaaa, bbbb, cccc, dddd, eeee, ffff, gggg, hhhh", 24);
        assert!(out.len() > 1);
        assert!(
            out.iter().all(|l| !l.contains('\x1b')),
            "carry injected escapes into an uncoloured line: {out:?}"
        );
    }

    #[test]
    fn test_active_sgr_after_tracks_open_and_reset() {
        assert_eq!(active_sgr_after("plain", None), None);
        assert_eq!(active_sgr_after(CYAN, None), Some(CYAN.to_string()));
        assert_eq!(active_sgr_after(&format!("{CYAN}x{RESET}"), None), None);
        assert_eq!(active_sgr_after("\x1b[0m", Some(CYAN.into())), None);
        // Carried in from the previous line and never reset here.
        assert_eq!(
            active_sgr_after("more text", Some(CYAN.into())),
            Some(CYAN.to_string())
        );
        // A non-`m` sequence (chafa's cursor hide) must not disturb the colour state.
        assert_eq!(
            active_sgr_after("\x1b[?25l", Some(CYAN.into())),
            Some(CYAN.to_string())
        );
    }

    #[test]
    fn test_active_sgr_after_takes_the_last_colour_when_nested() {
        // The `Net` line embeds a green Up inside the value colour (v0.5.1). Whatever the
        // nesting, the state at end-of-line is simply the last sequence seen.
        let green = "\x1b[32m";
        let s = format!("{CYAN}[{green}Up{RESET}] RX: 1 MB");
        assert_eq!(active_sgr_after(&s, None), None); // last was the reset
        let s2 = format!("{CYAN}[{green}Up{RESET}]{CYAN} RX: 1 MB");
        assert_eq!(active_sgr_after(&s2, None), Some(CYAN.to_string()));
    }

    // ── compose_side_by_side_row ──────────────────────────────────────────────

    #[test]
    fn test_row_places_the_logo_at_the_logo_column() {
        let row = compose_side_by_side_row("OS: Fedora", "###", 20);
        assert_eq!(row, format!("OS: Fedora{}###", " ".repeat(10)));
        assert_eq!(visible_len(&row), 23);
    }

    #[test]
    fn test_row_aligns_wide_characters_by_column_not_character_count() {
        // The regression that hid behind a shadowed `visible_len`: the layout measured
        // characters while the module function measured columns, so a CJK value pushed the
        // logo right by one column per wide glyph. Both rows below must put the logo at
        // exactly the same column.
        let latin = compose_side_by_side_row("Locale: en_US.UTF-8", "###", 40);
        let cjk = compose_side_by_side_row("Locale: ja_JP.宇多田ヒカル", "###", 40);
        assert_eq!(visible_len(&latin), 43);
        assert_eq!(
            visible_len(&cjk),
            43,
            "a wide-character info line must not shift the logo column"
        );
        // And the logo really is at column 40 in both, not merely the same total width.
        assert!(latin.ends_with("   ###") && cjk.ends_with("  ###"));
    }

    #[test]
    fn test_row_without_a_logo_gets_no_trailing_padding() {
        // Lines below the logo would otherwise carry ~90 trailing spaces each.
        assert_eq!(compose_side_by_side_row("Net: eth0", "", 40), "Net: eth0");
    }

    #[test]
    fn test_row_with_overlong_info_does_not_underflow() {
        // An info line wider than the logo column must not panic on the subtraction.
        let row = compose_side_by_side_row("x".repeat(50).as_str(), "###", 40);
        assert_eq!(row, format!("{}###", "x".repeat(50)));
    }

    #[test]
    fn test_row_ignores_ansi_colour_when_measuring() {
        let plain = compose_side_by_side_row("abc", "###", 10);
        let coloured = compose_side_by_side_row("\x1b[31mabc\x1b[39m", "###", 10);
        assert_eq!(visible_len(&plain), visible_len(&coloured));
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

    #[test]
    fn test_layout_logo_is_flush_with_the_right_margin() {
        // The drift this fixes: on a wide terminal the logo used to be drawn at
        // `text_column_width` (capped at 65), stranding everything to its right. Measured on
        // arrakis at 138 columns with the 49-wide Windows ASCII logo: output stopped at
        // column 103, leaving 35 dead columns.
        let p = plan_layout(&realistic_full_widths(), 20, 49, 138, true);
        assert!(p.side_by_side);
        assert_eq!(p.text_column_width, 58); // unchanged: still driven by the beside lines
        assert_eq!(p.logo_column, 138 - 49); // logo now ends exactly at the right margin
        assert!(
            p.logo_column > p.text_column_width,
            "the pre-fix behaviour was logo_column == text_column_width"
        );
    }

    #[test]
    fn test_layout_right_anchor_never_overlaps_the_text_column() {
        // At the 95-column threshold with a full-width logo the two columns meet exactly;
        // the logo must never be pulled left of where beside-logo text can reach.
        for term_width in 95..200 {
            let p = plan_layout(&[120; 25], 10, logo::LOGO_MAX_COLS, term_width, true);
            if p.side_by_side {
                assert!(
                    p.logo_column >= p.text_column_width,
                    "logo_column {} < text_column_width {} at {} cols",
                    p.logo_column,
                    p.text_column_width,
                    term_width
                );
                assert_eq!(p.logo_column + logo::LOGO_MAX_COLS, term_width);
            }
        }
    }

    #[test]
    fn test_layout_logo_column_does_not_underflow_on_an_oversized_logo() {
        // A logo wider than the terminal stacks, and the (unused) column must not underflow.
        let p = plan_layout(&[40; 10], 10, 200, 100, true);
        assert!(!p.side_by_side);
        assert_eq!(p.logo_column, p.text_column_width);
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
