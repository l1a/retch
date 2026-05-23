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
    /// List of fields to display, in order.
    pub fields: Option<Vec<String>>,
    /// Custom theme color overrides.
    pub custom_theme: Option<CustomTheme>,
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
    pub fn load() -> anyhow::Result<Self> {
        if let Some(path) = Self::config_path() {
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
        if cli.ascii_only {
            merged.ascii_only = Some(true);
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

        merged
    }
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
        let cli = Cli::try_parse_from(&["retch", "--theme", "light"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.theme, Some("light".to_string()));

        // Test no-logo override
        let cli = Cli::try_parse_from(&["retch", "--no-logo"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.show_logo, Some(false));

        // Test ascii-only override
        let cli = Cli::try_parse_from(&["retch", "--ascii-only"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.ascii_only, Some(true));

        // Test fields override
        let cli = Cli::try_parse_from(&["retch", "--fields", "cpu,gpu,memory"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(
            merged.fields,
            Some(vec![
                "cpu".to_string(),
                "gpu".to_string(),
                "memory".to_string()
            ])
        );
    }
}
