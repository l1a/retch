// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Formatting and display logic for terminal output.
//!
//! Handles text rendering, layout, and image/ASCII logo rendering.

use crate::cli::Cli;
use crate::config::Config;
use crate::fetch::SystemInfo;
use crate::logo;
use crate::theme::Theme;
use owo_colors::OwoColorize;

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

    let show_logo = _config.show_logo.unwrap_or(true) && !cli.no_logo && stdout_is_tty;

    // Determine which fields to show
    let allowed_fields: Option<Vec<String>> = if cli.long {
        None // show everything
    } else if cli.short {
        Some(vec![
            "os".to_string(),
            "kernel".to_string(),
            "host".to_string(),
            "cpu".to_string(),
            "gpu".to_string(),
            "memory".to_string(),
            "disk".to_string(),
            "net".to_string(),
        ])
    } else if let Some(fields) = &_config.fields {
        Some(fields.iter().map(|s| s.to_lowercase()).collect())
    } else {
        // Default set
        Some(vec![
            "os".to_string(),
            "kernel".to_string(),
            "host".to_string(),
            "cpu".to_string(),
            "cpu-cache".to_string(),
            "cpu-usage".to_string(),
            "motherboard".to_string(),
            "bios".to_string(),
            "gpu".to_string(),
            "display".to_string(),
            "audio".to_string(),
            "camera".to_string(),
            "gamepad".to_string(),
            "memory".to_string(),
            "phys-mem".to_string(),
            "swap".to_string(),
            "load".to_string(),
            "disk".to_string(),
            "phys-disk".to_string(),
            "net".to_string(),
            "uptime".to_string(),
        ])
    };

    let should_show = |label: &str| -> bool {
        match &allowed_fields {
            Some(fields) => {
                let norm_label = label.to_lowercase().replace(['-', '_'], " ");
                let norm_label_no_spaces = norm_label.replace(' ', "");
                fields.iter().any(|f| {
                    let norm_f = f.to_lowercase().replace(['-', '_'], " ");
                    norm_f == norm_label || norm_f.replace(' ', "") == norm_label_no_spaces
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

    print_line("OS", &info.os);
    if let Some(kernel) = &info.kernel {
        print_line("Kernel", kernel);
    }
    if let Some(host) = &info.hostname {
        print_line("Host", host);
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
    if let Some(user) = &info.current_user {
        print_line("User", user);
    }
    print_line("Arch", &info.arch);
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
    print_line("Memory", &info.memory);
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

    if should_show("Temp") {
        for temp in &info.temps {
            print_line("Temp", temp);
        }
    }

    if should_show("Net") {
        if cli.long {
            for net in &info.networks {
                if let Some(ref active) = info.active_interface {
                    if net.contains(active) {
                        print_line("Net", &net.bright_blue().to_string());
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

    if let Some(wifi) = &info.wifi {
        print_line("Wi-Fi", wifi);
    }
    if !info.dns.is_empty() {
        print_line("DNS", &info.dns.join(", "));
    }

    if let Some(bt) = &info.bluetooth {
        print_line("Bluetooth", bt);
    }

    // Uptime: human duration first, then ISO boot time with timezone
    let uptime_str = format_uptime(&info.uptime);
    let boot_display = format!("{} since {}", uptime_str, info.boot_time);
    print_line("Uptime", &boot_display);

    if let Some(bat) = &info.battery {
        print_line("Battery", bat);
    }

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
    print_line("Users", &info.users.to_string());
    if let Some(pkgs) = info.packages {
        if pkgs > 0 {
            print_line("Packages", &pkgs.to_string());
        }
    }
    if let Some(weather) = &info.weather {
        print_line("Weather", weather);
    }

    // Setup logo representation
    enum ActiveLogo {
        Lines(Vec<String>),
        Kitty(Vec<u8>),
        Iterm2(Vec<u8>),
        Sixel(Vec<u8>),
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
                        active_logo = ActiveLogo::Kitty(bytes);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        active_logo = ActiveLogo::Kitty(bytes.to_vec());
                        resolved = true;
                    }
                }
            }

            // iTerm2
            #[cfg(feature = "graphics")]
            if !resolved && logo::supports_iterm2() {
                if let Some(path) = &user_logo {
                    if let Ok(bytes) = std::fs::read(path) {
                        active_logo = ActiveLogo::Iterm2(bytes);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        active_logo = ActiveLogo::Iterm2(bytes.to_vec());
                        resolved = true;
                    }
                }
            }

            // Sixel
            #[cfg(feature = "graphics")]
            if !resolved && logo::supports_sixel() {
                if let Some(path) = &user_logo {
                    if let Ok(bytes) = std::fs::read(path) {
                        active_logo = ActiveLogo::Sixel(bytes);
                        resolved = true;
                    }
                } else if let Some(distro) = &distro_hint {
                    if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                        active_logo = ActiveLogo::Sixel(bytes.to_vec());
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

    let max_text_width = info_lines
        .iter()
        .map(|line| visible_len(line))
        .max()
        .unwrap_or(0);
    let text_column_width = std::cmp::max(max_text_width + 4, 45);

    let max_logo_width = match &active_logo {
        ActiveLogo::Lines(logo_lines) => logo_lines
            .iter()
            .map(|line| visible_len(line))
            .max()
            .unwrap_or(0),
        ActiveLogo::Kitty(_) | ActiveLogo::Iterm2(_) | ActiveLogo::Sixel(_) => 40,
        ActiveLogo::None => 0,
    };

    let side_by_side =
        show_logo && term_width >= 95 && term_width >= (text_column_width + max_logo_width);

    println!(); // leading newline

    if side_by_side {
        match active_logo {
            ActiveLogo::Lines(logo_lines) => {
                let max_lines = std::cmp::max(info_lines.len(), logo_lines.len());
                for i in 0..max_lines {
                    let info_line = info_lines.get(i).cloned().unwrap_or_default();
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
            ActiveLogo::Kitty(bytes) => {
                // Print text lines
                for line in &info_lines {
                    println!("{}", line);
                }
                // Position and render
                let num_lines = info_lines.len();
                print!("\x1b7"); // DEC save cursor
                if num_lines > 0 {
                    print!("\x1b[{}A", num_lines); // Move up
                }
                print!("\x1b[{}C", text_column_width); // Move right
                logo::print_graphical_logo(&bytes);
                print!("\x1b8"); // DEC restore cursor
            }
            ActiveLogo::Iterm2(bytes) => {
                // Print text lines
                for line in &info_lines {
                    println!("{}", line);
                }
                // Position and render
                let num_lines = info_lines.len();
                print!("\x1b7"); // DEC save cursor
                if num_lines > 0 {
                    print!("\x1b[{}A", num_lines); // Move up
                }
                print!("\x1b[{}C", text_column_width); // Move right
                logo::print_iterm2_logo(&bytes);
                print!("\x1b8"); // DEC restore cursor
            }
            ActiveLogo::Sixel(bytes) => {
                // Print text lines
                for line in &info_lines {
                    println!("{}", line);
                }
                // Position and render
                let num_lines = info_lines.len();
                print!("\x1b7"); // DEC save cursor
                if num_lines > 0 {
                    print!("\x1b[{}A", num_lines); // Move up
                }
                print!("\x1b[{}C", text_column_width); // Move right
                logo::print_sixel_logo(&bytes);
                print!("\x1b8"); // DEC restore cursor
            }
            ActiveLogo::None => {
                for line in &info_lines {
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
            ActiveLogo::Kitty(bytes) => {
                logo::print_graphical_logo(&bytes);
                println!();
            }
            ActiveLogo::Iterm2(bytes) => {
                logo::print_iterm2_logo(&bytes);
                println!();
            }
            ActiveLogo::Sixel(bytes) => {
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

#[cfg(test)]
mod tests {
    use super::*;

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
}
