// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Main entry point for the retch CLI.
//!
//! Handles CLI initialization, completion generation, and main execution flow.

use clap::{CommandFactory, Parser};
use clap_complete::generate;
use retch_cli::cli::{Cli, CompletionShell};
use retch_cli::config::Config;
use retch_cli::display;
use retch_cli::fetch::{CollectOptions, SystemInfo};

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    // Handle special CLI commands
    if let Some(shell) = cli.completions {
        let mut cmd = Cli::command();
        let bin_name = cmd.get_name().to_string();

        match shell {
            CompletionShell::Bash => generate(
                clap_complete::Shell::Bash,
                &mut cmd,
                bin_name,
                &mut std::io::stdout(),
            ),
            CompletionShell::Elvish => generate(
                clap_complete::Shell::Elvish,
                &mut cmd,
                bin_name,
                &mut std::io::stdout(),
            ),
            CompletionShell::Fish => generate(
                clap_complete::Shell::Fish,
                &mut cmd,
                bin_name,
                &mut std::io::stdout(),
            ),
            CompletionShell::PowerShell => generate(
                clap_complete::Shell::PowerShell,
                &mut cmd,
                bin_name,
                &mut std::io::stdout(),
            ),
            CompletionShell::Zsh => generate(
                clap_complete::Shell::Zsh,
                &mut cmd,
                bin_name,
                &mut std::io::stdout(),
            ),
            CompletionShell::Nushell => generate(
                clap_complete_nushell::Nushell,
                &mut cmd,
                bin_name,
                &mut std::io::stdout(),
            ),
        }
        return Ok(());
    }

    if cli.list_themes {
        println!("Built-in themes:");
        println!("  neutral (formerly default)");
        println!("  dark");
        println!("  light");
        println!("  catppuccin-latte");
        println!("  catppuccin-frappe");
        println!("  catppuccin-macchiato");
        println!("  catppuccin-mocha");
        println!("  solarized-light");
        println!("  solarized-dark");
        println!();
        println!(
            "You can also use 'custom' + [custom_theme] in config.toml for fully custom colors."
        );
        return Ok(());
    }

    if cli.print_theme_template {
        println!("# Example custom theme configuration");
        println!("# Add this to your config.toml (or use with theme = \"custom\")");
        println!();
        println!("[custom_theme]");
        println!("# label_color = \"bright_cyan\"");
        println!("# value_color = \"white\"");
        println!("# accent_color = \"bright_green\"");
        println!("# title_color = \"bright_yellow\"");
        println!("# separator_color = \"bright_black\"");
        println!();
        println!("# Available color names or hex values:");
        println!("#   Names: black, red, green, yellow, blue, magenta, cyan, white,");
        println!(
            "#          bright_black, bright_red, bright_green, bright_yellow, bright_blue, ..."
        );
        println!("#   Hex:   \"#ff6432\", \"89b4fa\", etc.");
        return Ok(());
    }

    if cli.list_distros {
        println!("Known distros:");
        println!("  arch");
        println!("  debian");
        println!("  fedora");
        println!("  nixos");
        println!("  ubuntu");
        println!("  pop (Pop!_OS)");
        println!("  manjaro");
        println!("  endeavouros");
        println!("  opensuse");
        println!("  macos (macOS / OS X)");
        println!("  windows (Windows 10 / 11)");
        println!("  (others fall back to Tux)");
        return Ok(());
    }

    if cli.print_logos {
        use retch_cli::logo;

        println!("Available logos:\n");

        let logos = [
            ("arch", "Arch Linux"),
            ("debian", "Debian"),
            ("fedora", "Fedora"),
            ("nixos", "NixOS"),
            ("ubuntu", "Ubuntu"),
            ("pop", "Pop!_OS"),
            ("manjaro", "Manjaro"),
            ("endeavouros", "EndeavourOS"),
            ("opensuse", "openSUSE"),
            ("macos", "macOS"),
            ("windows", "Windows"),
        ];

        for (id, name) in logos {
            println!("{}:", name);
            logo::print_distro_logo_with_ascii(Some(id), cli.ascii_logo, cli.chafa_logo);
            println!();
        }

        println!("(default fallback for unknown distros: Tux)");
        println!("Tux:");
        logo::print_distro_logo_with_ascii(None, cli.ascii_logo, cli.chafa_logo);
        println!();
        return Ok(());
    }

    if cli.generate_config {
        print_default_config();
        return Ok(());
    }

    if cli.write_config {
        let path = if !cli.write_config_path.is_empty() {
            std::path::PathBuf::from(&cli.write_config_path[0])
        } else {
            retch_cli::config::Config::config_path()
                .unwrap_or_else(|| std::path::PathBuf::from("retch-config.toml"))
        };
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let content = default_config_content();
        std::fs::write(&path, content)?;
        println!("Wrote default config to {}", path.display());
        return Ok(());
    }

    if cli.merge_config {
        merge_default_config()?;
        return Ok(());
    }

    // Load config and merge CLI overrides
    let config = Config::load(cli.config.as_deref())?;
    let config = config.merge_with_cli(&cli);

    // Collect system information
    let info = SystemInfo::collect(CollectOptions { long: cli.long })?;

    // Display output
    display::display(&info, &cli, &config)?;

    Ok(())
}

fn default_config_content() -> String {
    r##"# retch configuration file
# 
# This file uses TOML syntax.
# All settings below are commented out by default.
# Uncomment and modify as needed.

# Theme to use. Defaults to "auto" (follows system dark/light preference).
# Other options: "neutral", "dark", "light", "custom",
# or popular themes: "catppuccin-mocha", "solarized-dark", etc.
# theme = "auto"

# Custom theme color overrides (used when theme = "custom" or when partial overrides are provided)
# Colors can be named (e.g. "bright_cyan") or hex (e.g. "#89b4fa")
# [custom_theme]
# label_color = "bright_cyan"
# value_color = "white"
# accent_color = "bright_green"
# title_color = "bright_yellow"
# separator_color = "bright_black"

# Whether to show the ASCII logo
# show_logo = true

# Force ASCII-only output (even if graphical logos are supported)
# ascii_only = false

# Force Chafa symbols output (even if graphical logos are supported)
# chafa = false

# Output modes (CLI only, but documented here for reference)
# short = true     # OS, Kernel, Host, CPU, GPU, Memory, Disk
# long = true      # Show all fields

# List of fields to display (leave empty or omit to show all)
# fields = [
#     "os", "kernel", "host", "arch", "cpu", "cpu-freq", "gpu",
#     "motherboard", "bios", "display", "audio", "camera", "gamepad",
#     "memory", "swap", "uptime", "procs", "load",
#     "disk", "temp", "net", "wifi", "bluetooth", "battery",
#     "shell", "terminal", "desktop", "theme", "icons", "cursor", "font", "users", "packages"
# ]
"##
    .to_string()
}

fn print_default_config() {
    println!("{}", default_config_content());
}

fn merge_default_config() -> anyhow::Result<()> {
    use retch_cli::config::Config;
    use std::fs;

    if let Some(path) = Config::config_path() {
        let defaults = default_config_content();

        if path.exists() {
            let existing = fs::read_to_string(&path)?;
            let (new_content, additions) = Config::merge_defaults(&existing);

            if !additions.is_empty() {
                fs::write(&path, new_content)?;
                println!(
                    "Merged missing options ({}) into {}",
                    additions.join(", "),
                    path.display()
                );
            } else {
                println!("Config already contains all default options.");
            }
        } else {
            // No existing config, write full defaults
            if let Some(parent) = path.parent() {
                fs::create_dir_all(parent)?;
            }
            fs::write(&path, defaults)?;
            println!("Created config at {}", path.display());
        }
    }
    Ok(())
}
