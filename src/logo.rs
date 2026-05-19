// Basic logo system for retch
// Supports ASCII logos + placeholder for graphical (Kitty/iTerm)

pub fn get_ascii_logo(distro: Option<&str>) -> Vec<String> {
    // Simple generic / distro-inspired ASCII logos
    match distro {
        Some(d) if d.to_lowercase().contains("fedora") => vec![
            "      ____".to_string(),
            "     / __ \\__".to_string(),
            "    / /  \\__/".to_string(),
            "   / /".to_string(),
            "  / /".to_string(),
            " / /".to_string(),
            "/_/".to_string(),
        ],
        Some(d) if d.to_lowercase().contains("ubuntu") => vec![
            "    __".to_string(),
            "   /  \\".to_string(),
            "  |    |".to_string(),
            "   \\__/".to_string(),
        ],
        _ => vec![
            "  ____  ".to_string(),
            " |  __| ".to_string(),
            " | |__  ".to_string(),
            " |  __| ".to_string(),
            " | |    ".to_string(),
            " |_|    ".to_string(),
        ],
    }
}

pub fn print_ascii_logo(logo: &[String]) {
    for line in logo {
        println!("{}", line);
    }
}

// Placeholder for future graphical logo support (Kitty / iTerm2 inline images)
pub fn print_graphical_logo(_image_data: &[u8]) {
    println!("[Graphical logo would be displayed here via Kitty/iTerm protocol]");
}