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
            title_color: Color::Yellow,
            separator_color: Color::BrightBlack,
        }
    }

    pub fn from_name(name: &str) -> Self {
        match name.to_lowercase().as_str() {
            "dark" => Self::dark(),
            "light" => Self::light(),
            _ => Self::default(),
        }
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
