// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Formatting and display logic for terminal output.
//!
//! Handles text rendering, layout, and image/ASCII logo rendering.

use crate::cli::Cli;
use crate::config::Config;
use crate::fetch::SystemInfo;
use crate::logo;
use crate::theme::Theme;
use owo_colors::OwoColorize;

impl SystemInfo {
    /// Renders the collected system information to the terminal.
    ///
    /// This method handles theme selection, logo rendering (including fallbacks
    /// between graphics, Chafa, and ASCII), and field filtering based on
    /// CLI flags and configuration.
    pub fn display(&self, cli: &Cli, _config: &Config) -> anyhow::Result<()> {
        println!();
        let theme_name = _config.theme.as_deref().or(cli.theme.as_deref());
        let mut theme = match theme_name {
            Some(name) => Theme::from_name(name),
            None => Theme::detect_system_theme(), // Default to system preference
        };

        // Apply custom theme overrides from config if present
        if let Some(custom) = &_config.custom_theme {
            theme = Theme::with_custom_overrides(theme, custom);
        }

        let show_logo = _config.show_logo.unwrap_or(true) && !cli.no_logo;
        if show_logo {
            let distro_hint = _config.logo.clone().or_else(logo::detect_distro);
            #[cfg(feature = "graphics")]
            let mut printed_logo = false;
            #[cfg(not(feature = "graphics"))]
            let printed_logo = false;

            if !cli.ascii_only {
                // 1. Try user-provided custom logo first (config override)
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

                // 2. Kitty mode
                #[cfg(feature = "graphics")]
                if !printed_logo && logo::supports_kitty() {
                    if let Some(path) = &user_logo {
                        logo::print_graphical_logo_from_path(path);
                        printed_logo = true;
                    } else if let Some(distro) = &distro_hint {
                        if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                            logo::print_graphical_logo(bytes);
                            printed_logo = true;
                        }
                    }
                }

                // 2.3 iTerm2 mode
                #[cfg(feature = "graphics")]
                if !printed_logo && logo::supports_iterm2() {
                    if let Some(path) = &user_logo {
                        logo::print_iterm2_logo_from_path(path);
                        printed_logo = true;
                    } else if let Some(distro) = &distro_hint {
                        if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                            logo::print_iterm2_logo(bytes);
                            printed_logo = true;
                        }
                    }
                }

                // 2.5 Sixel mode
                #[cfg(feature = "graphics")]
                if !printed_logo && logo::supports_sixel() {
                    if let Some(path) = &user_logo {
                        logo::print_sixel_logo_from_path(path);
                        printed_logo = true;
                    } else if let Some(distro) = &distro_hint {
                        if let Some(bytes) = logo::get_embedded_logo(Some(distro)) {
                            logo::print_sixel_logo(bytes);
                            printed_logo = true;
                        }
                    }
                }

                // 3. Chafa fallback (high-quality symbols)
                if !printed_logo && logo::chafa_available() {
                    if let Some(path) = &user_logo {
                        if logo::print_with_chafa(path) {
                            printed_logo = true;
                        }
                    } else if distro_hint.is_some() {
                        // For chafa we need a file, so we skip embedded for now
                        // (user can provide logo.png for chafa path)
                    }
                }
            }

            // 3. Final fallback: Real Fastfetch ASCII logo
            if !printed_logo {
                // Use the unified priority logic (graphic -> chafa -> ASCII)
                logo::print_distro_logo_with_ascii(distro_hint.as_deref(), cli.ascii_only);
            }
            println!(); // spacing after logo
        }

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
                "motherboard".to_string(),
                "bios".to_string(),
                "gpu".to_string(),
                "display".to_string(),
                "audio".to_string(),
                "memory".to_string(),
                "swap".to_string(),
                "load".to_string(),
                "disk".to_string(),
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
        let print_line = |label: &str, value: &str| {
            if should_show(label) {
                println!(
                    "{:>width$}{} {}",
                    theme.color_label(label),
                    theme.color_separator(":"),
                    theme.color_value(value),
                    width = label_width
                );
            }
        };

        print_line("OS", &self.os);
        if let Some(kernel) = &self.kernel {
            print_line("Kernel", kernel);
        }
        if let Some(host) = &self.hostname {
            print_line("Host", host);
        }
        if let Some(user) = &self.current_user {
            print_line("User", user);
        }
        print_line("Arch", &self.arch);
        print_line("CPU", &format!("{} ({} cores)", self.cpu, self.cpu_cores));
        if let Some(freq) = &self.cpu_freq {
            print_line("CPU Freq", freq);
        }
        if let Some(motherboard) = &self.motherboard {
            print_line("Motherboard", motherboard);
        }
        if let Some(bios) = &self.bios {
            print_line("BIOS", bios);
        }
        if should_show("GPU") {
            for gpu in &self.gpu {
                print_line("GPU", gpu);
            }
        }
        if should_show("Display") {
            for display in &self.displays {
                print_line("Display", display);
            }
        }
        if let Some(audio) = &self.audio {
            print_line("Audio", audio);
        }
        print_line("Memory", &self.memory);
        print_line("Swap", &self.swap);
        print_line("Procs", &self.processes.to_string());
        if let Some(load) = &self.load_avg {
            print_line("Load", load);
        }

        if should_show("Disk") {
            for disk in &self.disks {
                print_line("Disk", disk);
            }
        }

        if should_show("Temp") {
            for temp in &self.temps {
                print_line("Temp", temp);
            }
        }

        if should_show("Net") {
            if cli.long {
                for net in &self.networks {
                    if let Some(ref active) = self.active_interface {
                        if net.contains(active) {
                            print_line("Net", &net.bright_blue().to_string());
                        }
                    }
                }
                for net in &self.networks {
                    if let Some(ref active) = self.active_interface {
                        if net.contains(active) {
                            continue;
                        }
                    }
                    print_line("Net", net);
                }
            } else {
                let mut printed = false;
                if let Some(ref active) = self.active_interface {
                    for net in &self.networks {
                        if net.contains(active) {
                            print_line("Net", net);
                            printed = true;
                            break;
                        }
                    }
                }
                if !printed {
                    for net in &self.networks {
                        if net.contains("[Up]") {
                            print_line("Net", net);
                            break;
                        }
                    }
                }
            }
        }

        if let Some(ip) = &self.public_ip {
            print_line("Public IP", ip);
        }

        if let Some(wifi) = &self.wifi {
            print_line("Wi-Fi", wifi);
        }

        if let Some(bt) = &self.bluetooth {
            print_line("Bluetooth", bt);
        }

        // Uptime: human duration first, then ISO boot time with timezone
        let uptime_str = format_uptime(&self.uptime);
        let boot_display = format!("{} since {}", uptime_str, self.boot_time);
        print_line("Uptime", &boot_display);

        if let Some(bat) = &self.battery {
            print_line("Battery", bat);
        }

        if let Some(shell) = &self.shell {
            print_line("Shell", shell);
        }
        if let Some(term) = &self.terminal {
            print_line("Terminal", term);
        }
        if let Some(de) = &self.desktop {
            print_line("Desktop", de);
        }
        if let Some(ui_theme) = &self.ui_theme {
            print_line("Theme", ui_theme);
        }
        if let Some(icons) = &self.icons {
            print_line("Icons", icons);
        }
        if let Some(cursor) = &self.cursor {
            print_line("Cursor", cursor);
        }
        if let Some(font) = &self.font {
            print_line("Font", font);
        }
        print_line("Users", &self.users.to_string());
        if let Some(pkgs) = self.packages {
            if pkgs > 0 {
                print_line("Packages", &pkgs.to_string());
            }
        }

        Ok(())
    }
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
