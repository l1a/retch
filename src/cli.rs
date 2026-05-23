// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! Command-line interface definitions.
//!
//! Defines the CLI arguments, flags, and options using the `clap` crate.

use clap::{Parser, ValueEnum};

/// Command-line arguments for retch.
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Cli {
    /// Output mode: short, long, or custom
    #[arg(short, long, default_value = "long")]
    pub mode: Option<String>,

    /// Use a specific theme
    #[arg(short, long)]
    pub theme: Option<String>,

    /// Path to custom config file
    #[arg(short, long)]
    pub config: Option<String>,

    /// Disable logo
    #[arg(long)]
    pub no_logo: bool,

    /// Show only ASCII logo (even if graphics are supported)
    #[arg(long)]
    pub ascii_only: bool,

    /// Short output mode (OS, Kernel, Host, CPU, GPU, Memory, Disk)
    #[arg(long)]
    pub short: bool,

    /// Long output mode (show all fields)
    #[arg(long)]
    pub long: bool,

    /// List available themes
    #[arg(long)]
    pub list_themes: bool,

    /// Print an example custom theme template
    #[arg(long)]
    pub print_theme_template: bool,

    /// List known distros
    #[arg(long)]
    pub list_distros: bool,

    /// Print logos for known distros
    #[arg(long)]
    pub print_logos: bool,

    /// Print default config (commented) to stdout
    #[arg(long)]
    pub generate_config: bool,

    /// Write default config to a file (uses default location if no path given)
    #[arg(long)]
    pub write_config: bool,

    /// Path(s) to write the config file to. Only the first value is used.
    #[arg(trailing_var_arg = true, num_args = 0..)]
    pub write_config_path: Vec<String>,

    /// Merge default settings (as comments) into existing config
    #[arg(long)]
    pub merge_config: bool,

    /// Fields to display (comma separated). Overrides config
    #[arg(long)]
    pub fields: Option<String>,

    /// Generate shell completions
    #[arg(long, value_enum)]
    pub completions: Option<CompletionShell>,
}

/// Supported shells for completion generation.
#[derive(ValueEnum, Clone, Debug)]
pub enum CompletionShell {
    Bash,
    Elvish,
    Fish,
    #[clap(name = "power-shell")]
    PowerShell,
    Zsh,
    Nushell,
}
