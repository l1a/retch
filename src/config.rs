// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Configuration management and parsing.
//!
//! This module handles loading, parsing, and merging of user-defined
//! TOML configurations with the default settings.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Configuration for the retch CLI.
///
/// This struct represents the options that can be set in the `config.toml` file.
#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct Config {
    /// The name of the theme to use (e.g., "dark", "catppuccin-mocha").
    pub theme: Option<String>,
    /// Whether to display the distro logo.
    pub show_logo: Option<bool>,
    /// Whether to force ASCII-only logo output.
    pub ascii_only: Option<bool>,
    /// Whether to force Chafa symbols output.
    pub chafa: Option<bool>,
    /// Force a specific distribution logo by name/ID.
    pub logo: Option<String>,
    /// List of fields to display, in order.
    pub fields: Option<Vec<String>>,
    /// Custom theme color overrides.
    pub custom_theme: Option<CustomTheme>,
    /// Location for weather lookup (city name, ZIP code, airport code, or coordinates).
    pub weather_location: Option<String>,
    /// Temperature unit for weather: "fahrenheit" or "celsius". Defaults to "fahrenheit".
    pub weather_unit: Option<String>,
}

/// Custom color overrides for themes.
///
/// Allows users to specify hex codes or color names for specific UI elements.
#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct CustomTheme {
    /// Color for field labels.
    pub label_color: Option<String>,
    /// Color for field values.
    pub value_color: Option<String>,
    /// Color for accent elements.
    pub accent_color: Option<String>,
    /// Color for the title/username line.
    pub title_color: Option<String>,
    /// Color for separators.
    pub separator_color: Option<String>,
}

impl Config {
    /// Loads the configuration from the default system path.
    ///
    /// Typically looks in `~/.config/retch/config.toml`.
    pub fn load(custom_path: Option<&str>) -> anyhow::Result<Self> {
        let path = if let Some(p) = custom_path {
            Some(PathBuf::from(p))
        } else {
            Self::config_path()
        };

        if let Some(path) = path {
            if path.exists() {
                let contents = fs::read_to_string(&path)?;
                let config: Config = toml::from_str(&contents)?;
                return Ok(config);
            }
        }
        Ok(Self::default())
    }

    /// Returns the expected path to the configuration file.
    pub fn config_path() -> Option<PathBuf> {
        dirs::config_dir().map(|mut p| {
            p.push("retch");
            p.push("config.toml");
            p
        })
    }

    /// Merges CLI options into the configuration.
    ///
    /// CLI arguments take precedence over values defined in the config file.
    pub fn merge_with_cli(&self, cli: &crate::cli::Cli) -> Self {
        let mut merged = self.clone();

        if let Some(theme) = &cli.theme {
            merged.theme = Some(theme.clone());
        }
        if cli.no_logo {
            merged.show_logo = Some(false);
        }
        if cli.ascii_logo {
            merged.ascii_only = Some(true);
        }
        if cli.chafa_logo {
            merged.chafa = Some(true);
        }
        if let Some(logo) = &cli.logo {
            merged.logo = Some(logo.clone());
        }
        if let Some(fields_str) = &cli.fields {
            // Split comma-separated string into Vec<String>
            let fields = fields_str
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect::<Vec<String>>();
            merged.fields = Some(fields);
        }
        if let Some(loc) = &cli.weather_location {
            merged.weather_location = Some(loc.clone());
        }
        if let Some(unit) = &cli.weather_unit {
            merged.weather_unit = Some(unit.clone());
        }

        merged
    }

    /// Merges missing default options as commented blocks into the existing configuration string.
    ///
    /// Returns the updated configuration content and a vector of the names of settings that were added.
    pub fn merge_defaults(existing: &str) -> (String, Vec<&'static str>) {
        let mut new_content = existing.trim_end().to_string();
        let mut additions = Vec::new();

        let checks = [
            ("theme", DEFAULT_THEME_BLOCK),
            ("show_logo", DEFAULT_SHOW_LOGO_BLOCK),
            ("ascii_only", DEFAULT_ASCII_ONLY_BLOCK),
            ("chafa", DEFAULT_CHAFA_BLOCK),
            ("logo", DEFAULT_LOGO_BLOCK),
            ("fields", DEFAULT_FIELDS_BLOCK),
            ("weather_location", DEFAULT_WEATHER_LOCATION_BLOCK),
            ("weather_unit", DEFAULT_WEATHER_UNIT_BLOCK),
        ];

        for &(key, block) in &checks {
            if !contains_key_line(existing, key) {
                if !new_content.is_empty() {
                    new_content.push_str("\n\n");
                }
                new_content.push_str(block);
                additions.push(key);
            }
        }

        if !contains_custom_theme(existing) {
            if !new_content.is_empty() {
                new_content.push_str("\n\n");
            }
            new_content.push_str(DEFAULT_CUSTOM_THEME_BLOCK);
            additions.push("custom_theme");
        }

        if !new_content.is_empty() && !new_content.ends_with('\n') {
            new_content.push('\n');
        }

        (new_content, additions)
    }
}

const DEFAULT_THEME_BLOCK: &str = r##"# Theme to use. Defaults to "auto" (follows system dark/light preference).
# Other options: "neutral", "dark", "light", "custom",
# or popular themes: "catppuccin-mocha", "solarized-dark", etc.
# theme = "auto""##;

const DEFAULT_CUSTOM_THEME_BLOCK: &str = r##"# Custom theme color overrides (used when theme = "custom" or when partial overrides are provided)
# Colors can be named (e.g. "bright_cyan") or hex (e.g. "#89b4fa")
# [custom_theme]
# label_color = "bright_cyan"
# value_color = "white"
# accent_color = "bright_green"
# title_color = "bright_yellow"
# separator_color = "bright_black""##;

const DEFAULT_SHOW_LOGO_BLOCK: &str = r##"# Whether to show the ASCII logo
# show_logo = true"##;

const DEFAULT_ASCII_ONLY_BLOCK: &str = r##"# Force ASCII-only output (even if graphical logos are supported)
# ascii_only = false"##;

const DEFAULT_CHAFA_BLOCK: &str = r##"# Force Chafa symbols output (even if graphical logos are supported)
# chafa = false"##;

const DEFAULT_LOGO_BLOCK: &str = r##"# Force a specific distribution logo by name/ID
# logo = "arch""##;

const DEFAULT_WEATHER_LOCATION_BLOCK: &str = r##"# Location for weather lookup (city name, ZIP code, or lat/lon coordinates).
# If unset, your location is auto-detected from your IP address.
# Examples: "London", "10001", "48.8566,2.3522"
# weather_location = """##;

const DEFAULT_WEATHER_UNIT_BLOCK: &str = r##"# Temperature unit for weather: "fahrenheit" or "celsius"
# weather_unit = "fahrenheit""##;

const DEFAULT_FIELDS_BLOCK: &str = r##"# List of fields to display (leave empty or omit to show all)
# Note: "phys-mem" requires running as root (sudo) on Linux to read DMI memory tables.
# Note: "weather" requires network access and is shown in long mode by default.
# fields = [
#     "os", "kernel", "host", "chassis", "init", "locale",
#     "arch", "cpu", "cpu-freq", "cpu-cache", "cpu-usage",
#     "gpu", "motherboard", "bios", "bootmgr", "display", "audio",
#     "camera", "gamepad", "memory", "phys-mem", "swap", "uptime", "procs", "load",
#     "disk", "phys-disk", "temp", "net", "public-ip", "wifi", "bluetooth", "battery",
#     "shell", "editor", "terminal", "terminal-font", "desktop",
#     "theme", "icons", "cursor", "font", "users", "packages", "weather"
# ]"##;

fn contains_key_line(content: &str, key: &str) -> bool {
    for line in content.lines() {
        let trimmed = line.trim();
        let without_comment = trimmed
            .strip_prefix('#')
            .map(|s| s.trim())
            .unwrap_or(trimmed);

        if let Some(rest) = without_comment.strip_prefix(key) {
            let rest = rest.trim();
            if rest.starts_with('=') {
                return true;
            }
        }
    }
    false
}

fn contains_custom_theme(content: &str) -> bool {
    for line in content.lines() {
        let trimmed = line.trim();
        let without_comment = trimmed
            .strip_prefix('#')
            .map(|s| s.trim())
            .unwrap_or(trimmed);

        let cleaned = without_comment.replace(' ', "");
        if cleaned.contains("[custom_theme]") {
            return true;
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cli::Cli;
    use clap::Parser;

    #[test]
    fn test_config_merge_with_cli() {
        let config = Config {
            theme: Some("dark".to_string()),
            show_logo: Some(true),
            ascii_only: Some(false),
            fields: Some(vec!["os".to_string(), "kernel".to_string()]),
            ..Default::default()
        };

        // Test theme override
        let cli = Cli::try_parse_from(["retch", "--theme", "light"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.theme, Some("light".to_string()));

        // Test no-logo override
        let cli = Cli::try_parse_from(["retch", "--no-logo"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.show_logo, Some(false));

        // Test ascii-logo override
        let cli = Cli::try_parse_from(["retch", "--ascii-logo"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.ascii_only, Some(true));

        // Test logo override
        let cli = Cli::try_parse_from(["retch", "--logo", "manjaro"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.logo, Some("manjaro".to_string()));

        // Test fields override
        let cli = Cli::try_parse_from(["retch", "--fields", "cpu,gpu,memory"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(
            merged.fields,
            Some(vec![
                "cpu".to_string(),
                "gpu".to_string(),
                "memory".to_string()
            ])
        );
        // Test fields edge case (spaces, empty values)
        let cli = Cli::try_parse_from(["retch", "--fields", "  cpu , , gpu "]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(
            merged.fields,
            Some(vec!["cpu".to_string(), "gpu".to_string()])
        );
    }

    #[test]
    fn test_config_load_valid() {
        let temp_dir = std::env::temp_dir();
        let file_path = temp_dir.join("valid_config.toml");
        std::fs::write(&file_path, "theme = \"dark\"\nshow_logo = true\n").unwrap();

        let config = Config::load(Some(file_path.to_str().unwrap())).unwrap();
        assert_eq!(config.theme, Some("dark".to_string()));
        assert_eq!(config.show_logo, Some(true));

        let _ = std::fs::remove_file(file_path);
    }

    #[test]
    fn test_config_load_invalid() {
        let temp_dir = std::env::temp_dir();
        let file_path = temp_dir.join("invalid_config.toml");
        std::fs::write(&file_path, "theme = dark\n").unwrap(); // Missing quotes makes it invalid TOML

        let config = Config::load(Some(file_path.to_str().unwrap()));
        assert!(config.is_err());

        let _ = std::fs::remove_file(file_path);
    }

    #[test]
    fn test_config_load_missing() {
        let config = Config::load(Some("non_existent_file.toml")).unwrap();
        assert_eq!(config.theme, None);
        assert_eq!(config.show_logo, None);
    }

    #[test]
    fn test_merge_defaults_all_present() {
        let existing = "theme = \"dark\"\nshow_logo = true\nascii_only = false\nchafa = false\nlogo = \"fedora\"\nfields = [\"os\"]\nweather_location = \"London\"\nweather_unit = \"fahrenheit\"\n[custom_theme]\nlabel_color = \"red\"\n";
        let (merged, additions) = Config::merge_defaults(existing);
        assert!(additions.is_empty());
        assert_eq!(merged.trim(), existing.trim());
    }

    #[test]
    fn test_merge_defaults_commented_ignored() {
        let existing = "# theme = \"auto\"\n# show_logo = true\n# ascii_only = false\n# chafa = false\n# logo = \"arch\"\n# fields = []\n# weather_location = \"\"\n# weather_unit = \"fahrenheit\"\n# [custom_theme]\n";
        let (merged, additions) = Config::merge_defaults(existing);
        assert!(additions.is_empty());
        assert_eq!(merged.trim(), existing.trim());
    }

    #[test]
    fn test_merge_defaults_missing_some() {
        let existing = "theme = \"light\"\n";
        let (merged, additions) = Config::merge_defaults(existing);
        assert_eq!(
            additions,
            vec![
                "show_logo",
                "ascii_only",
                "chafa",
                "logo",
                "fields",
                "weather_location",
                "weather_unit",
                "custom_theme"
            ]
        );
        assert!(merged.contains("theme = \"light\""));
        assert!(merged.contains("show_logo = true"));
        assert!(merged.contains("ascii_only = false"));
        assert!(merged.contains("chafa = false"));
        assert!(merged.contains("logo = \"arch\""));
        assert!(merged.contains("fields = ["));
        assert!(merged.contains("[custom_theme]"));
    }

    #[test]
    fn test_default_fields_include_battery() {
        assert!(DEFAULT_FIELDS_BLOCK.contains("battery"));
    }
}
