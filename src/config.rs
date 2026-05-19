use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct Config {
    pub theme: Option<String>,
    pub show_logo: Option<bool>,
    pub ascii_only: Option<bool>,
    pub fields: Option<Vec<String>>,
}

impl Config {
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

    pub fn config_path() -> Option<PathBuf> {
        dirs::config_dir().map(|mut p| {
            p.push("retch");
            p.push("config.toml");
            p
        })
    }

    /// Merge CLI options over config (CLI takes precedence)
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
        if let Some(fields) = &cli.fields {
            merged.fields = Some(fields.clone());
        }

        merged
    }
}