use colored::{Color, ColoredString, Colorize};

/// Parse a color name string (supports basic and bright variants).
/// Accepts names like "red", "bright_blue", "cyan", etc.
pub fn parse_color(name: &str) -> Option<Color> {
    match name.to_lowercase().as_str() {
        "black" => Some(Color::Black),
        "red" => Some(Color::Red),
        "green" => Some(Color::Green),
        "yellow" => Some(Color::Yellow),
        "blue" => Some(Color::Blue),
        "magenta" => Some(Color::Magenta),
        "cyan" => Some(Color::Cyan),
        "white" => Some(Color::White),
        "bright_black" | "grey" | "gray" => Some(Color::BrightBlack),
        "bright_red" => Some(Color::BrightRed),
        "bright_green" => Some(Color::BrightGreen),
        "bright_yellow" => Some(Color::BrightYellow),
        "bright_blue" => Some(Color::BrightBlue),
        "bright_magenta" => Some(Color::BrightMagenta),
        "bright_cyan" => Some(Color::BrightCyan),
        "bright_white" => Some(Color::BrightWhite),
        _ => None,
    }
}

#[derive(Debug, Clone)]
pub struct Theme {
    pub name: String,
    pub label_color: Color,
    pub value_color: Color,
    pub accent_color: Color,
    pub title_color: Color,
    pub separator_color: Color,
}

impl Default for Theme {
    fn default() -> Self {
        Self {
            name: "default".to_string(),
            label_color: Color::Cyan,
            value_color: Color::White,
            accent_color: Color::Green,
            title_color: Color::Yellow,
            separator_color: Color::BrightBlack,
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
            label_color: Color::BrightBlue,
            value_color: Color::BrightWhite,
            accent_color: Color::BrightGreen,
            title_color: Color::BrightYellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn light() -> Self {
        Self {
            name: "light".to_string(),
            label_color: Color::Blue,
            value_color: Color::Black,
            accent_color: Color::Green,
            title_color: Color::BrightYellow,
            separator_color: Color::Black,
        }
    }

    // === Popular Community Themes ===

    pub fn catppuccin_latte() -> Self {
        Self {
            name: "catppuccin-latte".to_string(),
            label_color: Color::Blue,
            value_color: Color::Black,
            accent_color: Color::Green,
            title_color: Color::Yellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn catppuccin_frappe() -> Self {
        Self {
            name: "catppuccin-frappe".to_string(),
            label_color: Color::BrightBlue,
            value_color: Color::White,
            accent_color: Color::BrightGreen,
            title_color: Color::BrightYellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn catppuccin_macchiato() -> Self {
        Self {
            name: "catppuccin-macchiato".to_string(),
            label_color: Color::BrightBlue,
            value_color: Color::BrightWhite,
            accent_color: Color::BrightGreen,
            title_color: Color::BrightYellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn catppuccin_mocha() -> Self {
        Self {
            name: "catppuccin-mocha".to_string(),
            label_color: Color::BrightBlue,
            value_color: Color::BrightWhite,
            accent_color: Color::BrightGreen,
            title_color: Color::BrightYellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn solarized_light() -> Self {
        Self {
            name: "solarized-light".to_string(),
            label_color: Color::Blue,
            value_color: Color::Black,
            accent_color: Color::Green,
            title_color: Color::Yellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn solarized_dark() -> Self {
        Self {
            name: "solarized-dark".to_string(),
            label_color: Color::BrightBlue,
            value_color: Color::BrightWhite,
            accent_color: Color::BrightGreen,
            title_color: Color::BrightYellow,
            separator_color: Color::BrightBlack,
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

    pub fn color_label(&self, text: &str) -> ColoredString {
        text.color(self.label_color)
    }

    pub fn color_value(&self, text: &str) -> ColoredString {
        text.color(self.value_color)
    }

    pub fn color_accent(&self, text: &str) -> ColoredString {
        text.color(self.accent_color)
    }

    pub fn color_separator(&self, text: &str) -> ColoredString {
        text.color(self.separator_color)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_theme() {
        let theme = Theme::default();
        assert_eq!(theme.name, "default");
        assert_eq!(theme.label_color, Color::Cyan);
        assert_eq!(theme.value_color, Color::White);
        assert_eq!(theme.accent_color, Color::Green);
        assert_eq!(theme.title_color, Color::Yellow);
    }

    #[test]
    fn test_dark_theme() {
        let theme = Theme::dark();
        assert_eq!(theme.name, "dark");
        assert_eq!(theme.label_color, Color::BrightBlue);
        assert_eq!(theme.title_color, Color::BrightYellow);
    }

    #[test]
    fn test_light_theme() {
        let theme = Theme::light();
        assert_eq!(theme.name, "light");
        assert_eq!(theme.label_color, Color::Blue);
        assert_eq!(theme.title_color, Color::Yellow);
    }

    #[test]
    fn test_new_default() {
        let theme = Theme::new_default();
        assert_eq!(theme.name, "default");
    }
}
