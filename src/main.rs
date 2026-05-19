use clap::Parser;
use retch_cli::cli::Cli;
use retch_cli::config::Config;
use retch_cli::fetch::SystemInfo;

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    // Handle special CLI commands
    if cli.list_themes {
        println!("Available themes:");
        println!("  default");
        println!("  dark");
        println!("  light");
        return Ok(());
    }

    if cli.generate_config {
        print_default_config();
        return Ok(());
    }

    if let Some(maybe_path) = &cli.write_config {
        let path = match maybe_path {
            Some(p) => std::path::PathBuf::from(p),
            None => retch_cli::config::Config::config_path().unwrap_or_else(|| {
                std::path::PathBuf::from("retch-config.toml")
            }),
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
    let config = Config::load()?;
    let config = config.merge_with_cli(&cli);

    // Collect system information
    let info = SystemInfo::collect(&cli, &config)?;

    // Display output
    info.display(&cli, &config)?;

    Ok(())
}

fn default_config_content() -> String {
    r#"# retch configuration file
# 
# This file uses TOML syntax.
# All settings below are commented out by default.
# Uncomment and modify as needed.

# Theme to use: "default", "dark", or "light"
# theme = "default"

# Whether to show the ASCII logo
# show_logo = true

# Force ASCII-only output (even if graphical logos are supported)
# ascii_only = false

# List of fields to display (leave empty or omit to show all)
# fields = [
#     "os", "kernel", "hostname", "arch", "cpu", "cpu freq",
#     "memory", "swap", "uptime", "procs", "load",
#     "disk", "temp", "net", "booted", "battery",
#     "shell", "terminal", "desktop", "users"
# ]
"#.to_string()
}

fn print_default_config() {
    println!("{}", default_config_content());
}

fn merge_default_config() -> anyhow::Result<()> {
    use std::fs;

    if let Some(path) = retch_cli::config::Config::config_path() {
        let defaults = default_config_content();

        if path.exists() {
            let existing = fs::read_to_string(&path)?;
            let mut additions = Vec::new();

            // Check for each important setting
            let settings = [
                "theme", "show_logo", "ascii_only", "fields",
                "shell", "terminal", "desktop", "cpu freq", "users"
            ];

            for setting in &settings {
                if !existing.to_lowercase().contains(&setting.to_lowercase()) {
                    additions.push(*setting);
                }
            }

            if !additions.is_empty() {
                let mut new_content = existing.clone();
                new_content.push_str("\n\n# --- Missing default options (commented) ---\n");
                for setting in additions {
                    new_content.push_str(&format!("# {} = <value>\n", setting));
                }
                fs::write(&path, new_content)?;
                println!("Merged missing options into {}", path.display());
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