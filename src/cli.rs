use clap::{Parser, ValueEnum};

#[derive(ValueEnum, Clone, Debug, PartialEq)]
pub enum CompletionShell {
    Bash,
    Elvish,
    Fish,
    PowerShell,
    Zsh,
    Nushell,
}

#[derive(Parser, Debug)]
#[command(
    name = "retch",
    version,
    about = "A fast, feature-rich system information fetcher"
)]
pub struct Cli {
    /// Output mode: short, long, or custom
    #[arg(short, long, value_enum, default_value = "long")]
    pub mode: OutputMode,

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
    #[arg(long, value_name = "PATH")]
    pub write_config: Option<Option<String>>,

    /// Merge default settings (as comments) into existing config
    #[arg(long)]
    pub merge_config: bool,

    /// Fields to display (comma separated). Overrides config.
    #[arg(long, value_delimiter = ',')]
    pub fields: Option<Vec<String>>,

    /// Generate shell completions
    #[arg(long, value_enum)]
    pub completions: Option<CompletionShell>,
}

#[derive(ValueEnum, Clone, Debug, PartialEq)]
pub enum OutputMode {
    Short,
    Long,
    Custom,
}
