use colored::{Color, ColoredString, Colorize};

#[derive(Debug, Clone)]
pub struct Theme {
    pub name: String,
    pub label_color: Color,
    pub value_color: Color,
    pub accent_color: Color,
}

impl Default for Theme {
    fn default() -> Self {
        Self {
            name: "default".to_string(),
            label_color: Color::Cyan,
            value_color: Color::White,
            accent_color: Color::Green,
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
        }
    }

    pub fn light() -> Self {
        Self {
            name: "light".to_string(),
            label_color: Color::Blue,
            value_color: Color::Black,
            accent_color: Color::Green,
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
    }

    #[test]
    fn test_dark_theme() {
        let theme = Theme::dark();
        assert_eq!(theme.name, "dark");
        assert_eq!(theme.label_color, Color::BrightBlue);
    }

    #[test]
    fn test_light_theme() {
        let theme = Theme::light();
        assert_eq!(theme.name, "light");
        assert_eq!(theme.label_color, Color::Blue);
    }

    #[test]
    fn test_new_default() {
        let theme = Theme::new_default();
        assert_eq!(theme.name, "default");
    }
}
