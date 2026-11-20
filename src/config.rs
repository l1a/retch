// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

//! Configuration management and parsing.
//!
//! This module handles loading, parsing, and merging of user-defined
//! TOML configurations with the default settings.
//!
//! Config files may pull in other TOML files via an `include` key (a string or
//! array of strings). Relative paths resolve against the including file's
//! directory. Included tables are deep-merged left-to-right as a base; keys in
//! the including file then overlay them. Nested includes are supported up to
//! [`MAX_INCLUDE_DEPTH`].

use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::io::Read;
use std::path::{Path, PathBuf};

/// Maximum size of a single config or include file (1 MiB).
const MAX_CONFIG_BYTES: u64 = 1024 * 1024;

/// Maximum nesting depth for `include` chains (root file counts as depth 0).
const MAX_INCLUDE_DEPTH: usize = 8;

/// Configuration for the retch CLI.
///
/// This struct represents the options that can be set in the `config.toml` file.
#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct Config {
    /// The name of the theme to use (e.g., "dark", "catppuccin-mocha").
    pub theme: Option<String>,
    /// When to emit ANSI colour: "auto", "always", or "never".
    pub color: Option<crate::cli::ColorChoice>,
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
    /// Reads `retch/config.toml` under `dirs::config_dir()`: `$XDG_CONFIG_HOME` or `~/.config`
    /// on Linux, `~/Library/Application Support` on macOS, `%APPDATA%` on Windows.
    ///
    /// When the file sets `include` (a path string or array of paths), those TOML
    /// files are loaded and deep-merged first; keys in this file then overlay them.
    /// Relative include paths are resolved against the including file's directory.
    pub fn load(custom_path: Option<&str>) -> anyhow::Result<Self> {
        let path = if let Some(p) = custom_path {
            Some(PathBuf::from(p))
        } else {
            Self::config_path()
        };

        if let Some(path) = path {
            if path.exists() {
                let mut visiting = HashSet::new();
                let table = load_toml_table(&path, 0, &mut visiting)?;
                let config: Config = table.try_into().map_err(|e| {
                    anyhow::anyhow!("Failed to parse config {}: {e}", path.display())
                })?;
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
        if let Some(color) = cli.color {
            merged.color = Some(color);
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
        if let Some(fields) = cli.parsed_fields() {
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

        // The fields block is generated from the single field registry
        // (src/fields.rs) so it stays in sync with the strata allow-lists and
        // with main.rs's full-config template. Held in a local so the `checks`
        // array can borrow it alongside the static blocks.
        let fields_block = crate::fields::config_fields_block();

        let checks = [
            ("theme", DEFAULT_THEME_BLOCK),
            ("include", DEFAULT_INCLUDE_BLOCK),
            ("color", DEFAULT_COLOR_BLOCK),
            ("show_logo", DEFAULT_SHOW_LOGO_BLOCK),
            ("ascii_only", DEFAULT_ASCII_ONLY_BLOCK),
            ("chafa", DEFAULT_CHAFA_BLOCK),
            ("logo", DEFAULT_LOGO_BLOCK),
            ("fields", fields_block.as_str()),
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

const DEFAULT_INCLUDE_BLOCK: &str = r##"# Merge another TOML file (or list of files) into this config.
# Relative paths resolve against this file's directory. Included tables are
# deep-merged first; keys in this file then overlay them. Useful for a theme
# fragment rewritten by an external tool (e.g. a Noctalia color template):
# set the theme key to "custom" and point include at themes/noctalia.toml.
# Do not write other keys as `name =` in these comments — --merge-config
# treats any commented `key =` line as that key already being present.
# include = "themes/noctalia.toml"
# include = ["base.toml", "themes/noctalia.toml"]"##;

const DEFAULT_COLOR_BLOCK: &str = r##"# When to emit ANSI colour: "auto" (default), "always", or "never".
# "always" and "never" override the NO_COLOR environment variable.
# color = "auto""##;

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

const DEFAULT_WEATHER_LOCATION_BLOCK: &str = r##"# Location for weather lookup (city name, ZIP code, airport code, or lat/lon coordinates).
# If unset, your location is auto-detected from your IP address.
# Examples: "London", "10001", "SFO", "48.8566,2.3522"
# weather_location = """##;

const DEFAULT_WEATHER_UNIT_BLOCK: &str = r##"# Temperature unit for weather: "fahrenheit" or "celsius"
# weather_unit = "fahrenheit""##;

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

/// Read a TOML config file, resolving `include` recursively into one table.
///
/// `include` accepts a string path or an array of string paths and is stripped
/// from the result (it is not a [`Config`] field). Relative paths resolve
/// against `path`'s parent directory. Cycle detection uses canonical paths when
/// available, otherwise the absolute path as given.
fn load_toml_table(
    path: &Path,
    depth: usize,
    visiting: &mut HashSet<PathBuf>,
) -> anyhow::Result<toml::Table> {
    anyhow::ensure!(
        depth <= MAX_INCLUDE_DEPTH,
        "Config include nesting exceeds maximum depth ({MAX_INCLUDE_DEPTH}) at {}",
        path.display()
    );

    let identity = path.canonicalize().unwrap_or_else(|_| path.to_path_buf());
    anyhow::ensure!(
        visiting.insert(identity.clone()),
        "Config include cycle detected at {}",
        path.display()
    );

    let contents = read_config_bytes(path)?;
    let mut table: toml::Table = toml::from_str(&contents)
        .map_err(|e| anyhow::anyhow!("Failed to parse config {}: {e}", path.display()))?;

    let include_paths = take_include_paths(&mut table, path)?;
    let mut merged = toml::Table::new();
    if let Some(parent) = path.parent() {
        for inc in include_paths {
            let resolved = resolve_include_path(parent, &inc);
            let included = load_toml_table(&resolved, depth + 1, visiting)?;
            deep_merge_table(&mut merged, included);
        }
    }
    deep_merge_table(&mut merged, table);

    visiting.remove(&identity);
    Ok(merged)
}

/// Read a config/include file with the same size and regularity checks as the
/// original single-file loader.
fn read_config_bytes(path: &Path) -> anyhow::Result<String> {
    let path_meta = fs::metadata(path)?;
    anyhow::ensure!(
        path_meta.is_file(),
        "Config path {} is not a regular file",
        path.display()
    );
    anyhow::ensure!(
        path_meta.len() <= MAX_CONFIG_BYTES,
        "Config file {} exceeds maximum size ({} bytes)",
        path.display(),
        MAX_CONFIG_BYTES
    );
    let file = fs::File::open(path)?;
    let meta = file.metadata()?;
    anyhow::ensure!(
        meta.is_file(),
        "Config path {} is not a regular file",
        path.display()
    );
    anyhow::ensure!(
        meta.len() <= MAX_CONFIG_BYTES,
        "Config file {} exceeds maximum size ({} bytes)",
        path.display(),
        MAX_CONFIG_BYTES
    );
    let mut contents = String::with_capacity(meta.len() as usize);
    file.take(MAX_CONFIG_BYTES).read_to_string(&mut contents)?;
    Ok(contents)
}

/// Remove and return `include` paths from a TOML table.
///
/// Accepts `include = "file.toml"` or `include = ["a.toml", "b.toml"]`.
fn take_include_paths(table: &mut toml::Table, source: &Path) -> anyhow::Result<Vec<String>> {
    let Some(value) = table.remove("include") else {
        return Ok(Vec::new());
    };
    match value {
        toml::Value::String(s) => Ok(vec![s]),
        toml::Value::Array(items) => {
            let mut paths = Vec::with_capacity(items.len());
            for item in items {
                match item {
                    toml::Value::String(s) => paths.push(s),
                    other => {
                        anyhow::bail!(
                            "Config include in {} must be a string or array of strings, got {}",
                            source.display(),
                            other.type_str()
                        );
                    }
                }
            }
            Ok(paths)
        }
        other => anyhow::bail!(
            "Config include in {} must be a string or array of strings, got {}",
            source.display(),
            other.type_str()
        ),
    }
}

/// Resolve an include path: absolute paths are used as-is; relative paths are
/// joined to `base` (the including file's directory).
fn resolve_include_path(base: &Path, include: &str) -> PathBuf {
    let candidate = PathBuf::from(include);
    if candidate.is_absolute() {
        candidate
    } else {
        base.join(candidate)
    }
}

/// Deep-merge `overlay` into `base`: tables recurse, all other values replace.
fn deep_merge_table(base: &mut toml::Table, overlay: toml::Table) {
    for (key, overlay_value) in overlay {
        match (base.get_mut(&key), overlay_value) {
            (Some(toml::Value::Table(base_table)), toml::Value::Table(overlay_table)) => {
                deep_merge_table(base_table, overlay_table);
            }
            (_, overlay_value) => {
                base.insert(key, overlay_value);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cli::Cli;
    use clap::Parser;

    #[test]
    fn test_config_merge_with_cli() {
        use crate::cli::ColorChoice;
        let config = Config {
            theme: Some("dark".to_string()),
            color: Some(ColorChoice::Always),
            show_logo: Some(true),
            ascii_only: Some(false),
            fields: Some(vec!["os".to_string(), "kernel".to_string()]),
            ..Default::default()
        };

        // Test color override and preservation
        let cli = Cli::try_parse_from(["retch"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.color, Some(ColorChoice::Always));

        let cli = Cli::try_parse_from(["retch", "--color", "never"]).unwrap();
        let merged = config.merge_with_cli(&cli);
        assert_eq!(merged.color, Some(ColorChoice::Never));

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
        let existing = "theme = \"dark\"\ninclude = \"themes/noctalia.toml\"\ncolor = \"auto\"\nshow_logo = true\nascii_only = false\nchafa = false\nlogo = \"fedora\"\nfields = [\"os\"]\nweather_location = \"London\"\nweather_unit = \"fahrenheit\"\n[custom_theme]\nlabel_color = \"red\"\n";
        let (merged, additions) = Config::merge_defaults(existing);
        assert!(additions.is_empty());
        assert_eq!(merged.trim(), existing.trim());
    }

    #[test]
    fn test_merge_defaults_commented_ignored() {
        let existing = "# theme = \"auto\"\n# include = \"themes/noctalia.toml\"\n# color = \"auto\"\n# show_logo = true\n# ascii_only = false\n# chafa = false\n# logo = \"arch\"\n# fields = []\n# weather_location = \"\"\n# weather_unit = \"fahrenheit\"\n# [custom_theme]\n";
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
                "include",
                "color",
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
        assert!(merged.contains("include = \"themes/noctalia.toml\""));
        assert!(merged.contains("color = \"auto\""));
        assert!(merged.contains("show_logo = true"));
        assert!(merged.contains("ascii_only = false"));
        assert!(merged.contains("chafa = false"));
        assert!(merged.contains("logo = \"arch\""));
        assert!(merged.contains("fields = ["));
        assert!(merged.contains("[custom_theme]"));
    }

    #[test]
    fn test_merge_defaults_include_docs_do_not_poison_theme() {
        // Bugbot: an earlier draft of DEFAULT_INCLUDE_BLOCK embedded
        // `#   theme = "custom"` as a usage example. contains_key_line treats
        // any commented `key =` line as the key being present, so a later
        // --merge-config would skip adding the real theme block. The shipped
        // include docs must not contain that shape for any other key.
        assert!(
            !contains_key_line(DEFAULT_INCLUDE_BLOCK, "theme"),
            "DEFAULT_INCLUDE_BLOCK must not contain a commented theme = line"
        );
        let (_, additions) = Config::merge_defaults(DEFAULT_INCLUDE_BLOCK);
        assert!(
            additions.contains(&"theme"),
            "include docs alone must still cause theme to be merged in: {additions:?}"
        );
    }

    #[test]
    fn test_config_load_include_string() {
        let dir = std::env::temp_dir().join("retch_include_string_test");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(dir.join("themes")).unwrap();
        fs::write(
            dir.join("themes/noctalia.toml"),
            "theme = \"custom\"\n[custom_theme]\nlabel_color = \"#89b4fa\"\nvalue_color = \"#cdd6f4\"\n",
        )
        .unwrap();
        let main = dir.join("config.toml");
        fs::write(
            &main,
            "include = \"themes/noctalia.toml\"\nshow_logo = false\n",
        )
        .unwrap();

        let config = Config::load(Some(main.to_str().unwrap())).unwrap();
        assert_eq!(config.theme.as_deref(), Some("custom"));
        assert_eq!(config.show_logo, Some(false));
        let custom = config.custom_theme.expect("custom_theme from include");
        assert_eq!(custom.label_color.as_deref(), Some("#89b4fa"));
        assert_eq!(custom.value_color.as_deref(), Some("#cdd6f4"));

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_config_load_include_overlay_wins() {
        let dir = std::env::temp_dir().join("retch_include_overlay_test");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(dir.join("themes")).unwrap();
        fs::write(
            dir.join("themes/noctalia.toml"),
            "theme = \"custom\"\n[custom_theme]\nlabel_color = \"#111111\"\nvalue_color = \"#222222\"\n",
        )
        .unwrap();
        let main = dir.join("config.toml");
        fs::write(
            &main,
            "include = \"themes/noctalia.toml\"\ntheme = \"dark\"\n[custom_theme]\nlabel_color = \"#abcdef\"\n",
        )
        .unwrap();

        let config = Config::load(Some(main.to_str().unwrap())).unwrap();
        assert_eq!(config.theme.as_deref(), Some("dark"));
        let custom = config.custom_theme.expect("merged custom_theme");
        // Main overlays include: label from main, value retained from include.
        assert_eq!(custom.label_color.as_deref(), Some("#abcdef"));
        assert_eq!(custom.value_color.as_deref(), Some("#222222"));

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_config_load_include_array_order() {
        let dir = std::env::temp_dir().join("retch_include_array_test");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        fs::write(dir.join("a.toml"), "theme = \"light\"\nlogo = \"arch\"\n").unwrap();
        fs::write(dir.join("b.toml"), "theme = \"dark\"\n").unwrap();
        let main = dir.join("config.toml");
        fs::write(&main, "include = [\"a.toml\", \"b.toml\"]\n").unwrap();

        let config = Config::load(Some(main.to_str().unwrap())).unwrap();
        // Later includes overlay earlier ones; main has no theme of its own.
        assert_eq!(config.theme.as_deref(), Some("dark"));
        assert_eq!(config.logo.as_deref(), Some("arch"));

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_config_load_include_missing_errors() {
        let dir = std::env::temp_dir().join("retch_include_missing_test");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        let main = dir.join("config.toml");
        fs::write(&main, "include = \"missing.toml\"\n").unwrap();

        let err = Config::load(Some(main.to_str().unwrap())).unwrap_err();
        let msg = err.to_string();
        assert!(
            msg.contains("missing.toml")
                || msg.contains("No such file")
                || msg.contains("os error"),
            "expected missing-include error, got: {msg}"
        );

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_config_load_include_cycle_errors() {
        let dir = std::env::temp_dir().join("retch_include_cycle_test");
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        fs::write(dir.join("a.toml"), "include = \"b.toml\"\n").unwrap();
        fs::write(dir.join("b.toml"), "include = \"a.toml\"\n").unwrap();
        let main = dir.join("config.toml");
        fs::write(&main, "include = \"a.toml\"\n").unwrap();

        let err = Config::load(Some(main.to_str().unwrap())).unwrap_err();
        assert!(
            err.to_string().contains("cycle"),
            "expected cycle error, got: {err}"
        );

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn test_deep_merge_table_nested() {
        let mut base: toml::Table =
            toml::from_str("[custom_theme]\nlabel_color = \"red\"\nvalue_color = \"white\"\n")
                .unwrap();
        let overlay: toml::Table =
            toml::from_str("[custom_theme]\nlabel_color = \"blue\"\n").unwrap();
        deep_merge_table(&mut base, overlay);
        let custom = base.get("custom_theme").unwrap().as_table().unwrap();
        assert_eq!(custom.get("label_color").unwrap().as_str(), Some("blue"));
        assert_eq!(custom.get("value_color").unwrap().as_str(), Some("white"));
    }

    #[test]
    fn test_config_color_parsing() {
        use crate::cli::ColorChoice;
        for (raw, expected) in [
            ("color = \"auto\"\n", ColorChoice::Auto),
            ("color = \"always\"\n", ColorChoice::Always),
            ("color = \"never\"\n", ColorChoice::Never),
        ] {
            let cfg: Config = toml::from_str(raw).unwrap();
            assert_eq!(cfg.color, Some(expected), "failed for {raw:?}");
        }
        assert!(toml::from_str::<Config>("color = \"bogus\"\n").is_err());
    }

    #[test]
    fn test_default_fields_include_battery() {
        assert!(crate::fields::config_fields_block().contains("battery"));
    }
}
