use owo_colors::{OwoColorize, Rgb};

/// Parse a color name or hex string into an RGB value.
/// Supports named colors and hex values (e.g. "#ff6432" or "ff6432").
pub fn parse_color(input: &str) -> Option<Rgb> {
    let s = input.trim();

    // Hex color support
    if s.starts_with('#') || s.len() == 6 {
        let hex = if s.starts_with('#') { &s[1..] } else { s };
        if hex.len() == 6 {
            if let (Ok(r), Ok(g), Ok(b)) = (
                u8::from_str_radix(&hex[0..2], 16),
                u8::from_str_radix(&hex[2..4], 16),
                u8::from_str_radix(&hex[4..6], 16),
            ) {
                return Some(Rgb(r, g, b));
            }
        }
    }

    // Named colors
    match s.to_lowercase().as_str() {
        "black"       => Some(Rgb(0, 0, 0)),
        "red"         => Some(Rgb(255, 0, 0)),
        "green"       => Some(Rgb(0, 255, 0)),
        "yellow"      => Some(Rgb(255, 255, 0)),
        "blue"        => Some(Rgb(0, 0, 255)),
        "magenta"     => Some(Rgb(255, 0, 255)),
        "cyan"        => Some(Rgb(0, 255, 255)),
        "white"       => Some(Rgb(255, 255, 255)),
        "bright_black" | "grey" | "gray" => Some(Rgb(128, 128, 128)),
        "bright_red"   => Some(Rgb(255, 128, 128)),
        "bright_green" => Some(Rgb(128, 255, 128)),
        "bright_yellow" => Some(Rgb(255, 255, 128)),
        "bright_blue"   => Some(Rgb(128, 128, 255)),
        "bright_magenta" => Some(Rgb(255, 128, 255)),
        "bright_cyan"   => Some(Rgb(128, 255, 255)),
        "bright_white"  => Some(Rgb(255, 255, 255)),
        _ => None,
    }
}

#[derive(Debug, Clone)]
pub struct Theme {
    pub name: String,
    pub label_color: Rgb,
    pub value_color: Rgb,
    pub accent_color: Rgb,
    pub title_color: Rgb,
    pub separator_color: Rgb,
}

impl Default for Theme {
    fn default() -> Self {
        Self {
            name: "neutral".to_string(),
            label_color: Rgb(0, 255, 255),       // Cyan
            value_color: Rgb(255, 255, 255),     // White
            accent_color: Rgb(0, 255, 0),        // Green
            title_color: Rgb(255, 255, 0),       // Yellow
            separator_color: Rgb(128, 128, 128), // BrightBlack / Gray
        }
    }
}

impl Theme {
    pub fn neutral() -> Self {
        Self::default()
    }

    // Keep for backward compatibility
    pub fn new_default() -> Self {
        Self::neutral()
    }

    pub fn dark() -> Self {
        Self {
            name: "dark".to_string(),
            label_color: Rgb(128, 128, 255),     // Bright Blue
            value_color: Rgb(255, 255, 255),     // Bright White
            accent_color: Rgb(128, 255, 128),    // Bright Green
            title_color: Rgb(255, 255, 128),     // Bright Yellow
            separator_color: Rgb(128, 128, 128), // Bright Black / Gray
        }
    }

    pub fn light() -> Self {
        Self {
            name: "light".to_string(),
            label_color: Rgb(0, 0, 255),     // Blue
            value_color: Rgb(0, 0, 0),       // Black
            accent_color: Rgb(0, 255, 0),    // Green
            title_color: Rgb(255, 255, 128), // Bright Yellow
            separator_color: Rgb(0, 0, 0),   // Black
        }
    }

    // === Popular Community Themes ===

    // Catppuccin Latte (light)
    pub fn catppuccin_latte() -> Self {
        Self {
            name: "catppuccin-latte".to_string(),
            label_color: Rgb(30, 102, 245),      // Blue      #1e66f5
            value_color: Rgb(76, 79, 105),       // Text      #4c4f69
            accent_color: Rgb(64, 160, 43),      // Green     #40a02b
            title_color: Rgb(223, 142, 29),      // Yellow    #df8e1d
            separator_color: Rgb(140, 143, 161), // Overlay0  #8c8fa1
        }
    }

    // Catppuccin Frappe
    pub fn catppuccin_frappe() -> Self {
        Self {
            name: "catppuccin-frappe".to_string(),
            label_color: Rgb(137, 180, 250),    // Blue      #89b4fa
            value_color: Rgb(198, 208, 245),    // Text      #c6d0f5
            accent_color: Rgb(166, 227, 161),   // Green     #a6e3a1
            title_color: Rgb(249, 226, 175),    // Yellow    #f9e2af
            separator_color: Rgb(98, 104, 128), // Overlay0  #626880
        }
    }

    // Catppuccin Macchiato
    pub fn catppuccin_macchiato() -> Self {
        Self {
            name: "catppuccin-macchiato".to_string(),
            label_color: Rgb(138, 173, 244),   // Blue      #8aadf4
            value_color: Rgb(202, 211, 245),   // Text      #cad3f5
            accent_color: Rgb(166, 218, 149),  // Green     #a6da95
            title_color: Rgb(238, 212, 159),   // Yellow    #eed6af
            separator_color: Rgb(91, 96, 120), // Overlay0  #5b6078
        }
    }

    // Catppuccin Mocha (most popular dark variant)
    pub fn catppuccin_mocha() -> Self {
        Self {
            name: "catppuccin-mocha".to_string(),
            label_color: Rgb(137, 180, 250),     // Blue      #89b4fa
            value_color: Rgb(205, 214, 244),     // Text      #cdd6f4
            accent_color: Rgb(245, 194, 231),    // Pink      #f5c2e7
            title_color: Rgb(249, 226, 175),     // Yellow    #f9e2af
            separator_color: Rgb(108, 112, 134), // Overlay0  #6c7086
        }
    }

    // Solarized Light
    pub fn solarized_light() -> Self {
        Self {
            name: "solarized-light".to_string(),
            label_color: Rgb(38, 139, 210),      // blue      #268bd2
            value_color: Rgb(101, 123, 131),     // base00    #657b83
            accent_color: Rgb(181, 137, 0),      // yellow    #b58900
            title_color: Rgb(203, 75, 22),       // orange    #cb4b16
            separator_color: Rgb(147, 161, 161), // base1     #93a1a1
        }
    }

    // Solarized Dark
    pub fn solarized_dark() -> Self {
        Self {
            name: "solarized-dark".to_string(),
            label_color: Rgb(38, 139, 210),      // blue      #268bd2
            value_color: Rgb(131, 148, 150),     // base0     #839496
            accent_color: Rgb(181, 137, 0),      // yellow    #b58900
            title_color: Rgb(203, 75, 22),       // orange    #cb4b16
            separator_color: Rgb(147, 161, 161), // base1     #93a1a1
        }
    }

    pub fn from_name(name: &str) -> Self {
        match name.to_lowercase().replace('_', "-").as_str() {
            "dark" => Self::dark(),
            "light" => Self::light(),
            "neutral" | "default" => Self::neutral(), // "default" kept for backward compat
            "custom" => Self::default(),
            "auto" => Self::detect_system_theme(),
            "catppuccin-latte" | "catppuccin_latte" | "latte" => Self::catppuccin_latte(),
            "catppuccin-frappe" | "catppuccin_frappe" | "frappe" => Self::catppuccin_frappe(),
            "catppuccin-macchiato" | "catppuccin_macchiato" | "macchiato" => {
                Self::catppuccin_macchiato()
            }
            "catppuccin-mocha" | "catppuccin_mocha" | "mocha" => Self::catppuccin_mocha(),
            "solarized-light" | "solarized_light" => Self::solarized_light(),
            "solarized-dark" | "solarized_dark" => Self::solarized_dark(),
            _ => Self::default(),
        }
    }

    /// Detect system dark/light preference (basic implementation)
    pub fn detect_system_theme() -> Self {
        // Try to read GTK settings
        if let Some(config_dir) = dirs::config_dir() {
            let gtk_settings = config_dir.join("gtk-3.0").join("settings.ini");
            if gtk_settings.exists() {
                if let Ok(contents) = std::fs::read_to_string(&gtk_settings) {
                    for line in contents.lines() {
                        if line.to_lowercase().contains("prefer-dark-theme") {
                            if line.to_lowercase().contains("true") {
                                return Self::dark();
                            } else {
                                return Self::light();
                            }
                        }
                    }
                }
            }
        }
        // Default fallback
        Self::dark()
    }

    /// Build a theme from a base theme + custom color overrides (from config)
    pub fn with_custom_overrides(base: Self, custom: &crate::config::CustomTheme) -> Self {
        let mut theme = base;

        if let Some(color) = &custom.label_color {
            if let Some(c) = parse_color(color) {
                theme.label_color = c;
            }
        }
        if let Some(color) = &custom.value_color {
            if let Some(c) = parse_color(color) {
                theme.value_color = c;
            }
        }
        if let Some(color) = &custom.accent_color {
            if let Some(c) = parse_color(color) {
                theme.accent_color = c;
            }
        }
        if let Some(color) = &custom.title_color {
            if let Some(c) = parse_color(color) {
                theme.title_color = c;
            }
        }
        if let Some(color) = &custom.separator_color {
            if let Some(c) = parse_color(color) {
                theme.separator_color = c;
            }
        }

        theme
    }

    pub fn color_label(&self, text: &str) -> String {
        text.color(self.label_color).to_string()
    }

    pub fn color_value(&self, text: &str) -> String {
        text.color(self.value_color).to_string()
    }

    pub fn color_accent(&self, text: &str) -> String {
        text.color(self.accent_color).to_string()
    }

    pub fn color_separator(&self, text: &str) -> String {
        text.color(self.separator_color).to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_neutral_theme() {
        let theme = Theme::neutral();
        assert_eq!(theme.name, "neutral");
        assert_eq!(theme.label_color, Rgb(0, 255, 255));
        assert_eq!(theme.value_color, Rgb(255, 255, 255));
        assert_eq!(theme.accent_color, Rgb(0, 255, 0));
        assert_eq!(theme.title_color, Rgb(255, 255, 0));
    }

    #[test]
    fn test_dark_theme() {
        let theme = Theme::dark();
        assert_eq!(theme.name, "dark");
        assert_eq!(theme.label_color, Rgb(128, 128, 255));
        assert_eq!(theme.title_color, Rgb(255, 255, 128));
    }

    #[test]
    fn test_light_theme() {
        let theme = Theme::light();
        assert_eq!(theme.name, "light");
        assert_eq!(theme.label_color, Rgb(0, 0, 255));
        assert_eq!(theme.title_color, Rgb(255, 255, 128));
    }

    #[test]
    fn test_new_default() {
        let theme = Theme::new_default();
        assert_eq!(theme.name, "neutral");
    }
}
