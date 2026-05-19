use owo_colors::{OwoColorize, Rgb};

/// Parse a color name string into an RGB value.
/// Supports both ANSI names and some common aliases.
pub fn parse_color(name: &str) -> Option<Rgb> {
    match name.to_lowercase().as_str() {
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
            name: "default".to_string(),
            label_color: Rgb(0, 255, 255),      // Cyan
            value_color: Rgb(255, 255, 255),    // White
            accent_color: Rgb(0, 255, 0),       // Green
            title_color: Rgb(255, 255, 0),      // Yellow
            separator_color: Rgb(128, 128, 128),// BrightBlack / Gray
        }
    }
}

impl Theme {
    pub fn new_default() -> Self {
        Self::default()
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
            label_color: Rgb(0, 0, 255),         // Blue
            value_color: Rgb(0, 0, 0),           // Black
            accent_color: Rgb(0, 255, 0),        // Green
            title_color: Rgb(255, 255, 128),     // Bright Yellow
            separator_color: Rgb(0, 0, 0),       // Black
        }
    }

    // === Popular Community Themes ===

    // Catppuccin Latte (light)
    pub fn catppuccin_latte() -> Self {
        Self {
            name: "catppuccin-latte".to_string(),
            label_color: Rgb(30, 102, 245),      // Blue
            value_color: Rgb(76, 79, 105),       // Text
            accent_color: Rgb(64, 160, 43),      // Green
            title_color: Rgb(223, 142, 29),      // Yellow
            separator_color: Rgb(140, 143, 161), // Overlay0
        }
    }

    // Catppuccin Frappe
    pub fn catppuccin_frappe() -> Self {
        Self {
            name: "catppuccin-frappe".to_string(),
            label_color: Rgb(137, 180, 250),     // Blue
            value_color: Rgb(198, 208, 245),     // Text
            accent_color: Rgb(166, 227, 161),    // Green
            title_color: Rgb(249, 226, 175),     // Yellow
            separator_color: Rgb(98, 104, 128),  // Overlay0
        }
    }

    // Catppuccin Macchiato
    pub fn catppuccin_macchiato() -> Self {
        Self {
            name: "catppuccin-macchiato".to_string(),
            label_color: Rgb(138, 173, 244),     // Blue
            value_color: Rgb(202, 211, 245),     // Text
            accent_color: Rgb(166, 218, 149),    // Green
            title_color: Rgb(238, 212, 159),     // Yellow
            separator_color: Rgb(91, 96, 120),   // Overlay0
        }
    }

    // Catppuccin Mocha (most popular dark variant)
    pub fn catppuccin_mocha() -> Self {
        Self {
            name: "catppuccin-mocha".to_string(),
            label_color: Rgb(137, 180, 250),     // Blue
            value_color: Rgb(205, 214, 244),     // Text
            accent_color: Rgb(245, 194, 231),    // Pink
            title_color: Rgb(249, 226, 175),     // Yellow
            separator_color: Rgb(108, 112, 134), // Overlay0
        }
    }

    // Solarized Light
    pub fn solarized_light() -> Self {
        Self {
            name: "solarized-light".to_string(),
            label_color: Rgb(38, 139, 210),      // Solarized blue
            value_color: Rgb(131, 148, 150),     // base0
            accent_color: Rgb(181, 137, 0),      // Solarized yellow
            title_color: Rgb(203, 75, 22),       // Orange
            separator_color: Rgb(147, 161, 161), // base1
        }
    }

    // Solarized Dark
    pub fn solarized_dark() -> Self {
        Self {
            name: "solarized-dark".to_string(),
            label_color: Rgb(38, 139, 210),      // Solarized blue
            value_color: Rgb(131, 148, 150),     // base0
            accent_color: Rgb(181, 137, 0),      // Solarized yellow
            title_color: Rgb(203, 75, 22),       // Orange
            separator_color: Rgb(147, 161, 161), // base1
        }
    }

    pub fn from_name(name: &str) -> Self {
        match name.to_lowercase().replace('_', "-").as_str() {
            "dark" => Self::dark(),
            "light" => Self::light(),
            "custom" => Self::default(),
            "catppuccin-latte" | "catppuccin_latte" | "latte" => Self::catppuccin_latte(),
            "catppuccin-frappe" | "catppuccin_frappe" | "frappe" => Self::catppuccin_frappe(),
            "catppuccin-macchiato" | "catppuccin_macchiato" | "macchiato" => Self::catppuccin_macchiato(),
            "catppuccin-mocha" | "catppuccin_mocha" | "mocha" => Self::catppuccin_mocha(),
            "solarized-light" | "solarized_light" => Self::solarized_light(),
            "solarized-dark" | "solarized_dark" => Self::solarized_dark(),
            _ => Self::default(),
        }
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
    fn test_default_theme() {
        let theme = Theme::default();
        assert_eq!(theme.name, "default");
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
        assert_eq!(theme.name, "default");
    }
}
