// Basic logo system for retch
// Supports ASCII logos + graphical (Kitty/iTerm2 inline image protocol)
//
// Some logos are adapted from Fastfetch (https://github.com/fastfetch-cli/fastfetch)
// Fastfetch is MIT licensed. See README.md and LICENSE for attribution.

/// Detects the distro ID from /etc/os-release for better logo selection.
pub fn detect_distro() -> Option<String> {
    if let Ok(content) = std::fs::read_to_string("/etc/os-release") {
        for line in content.lines() {
            if line.starts_with("ID=") {
                let id = line.trim_start_matches("ID=").trim_matches('"');
                return Some(id.to_string());
            }
        }
    }
    None
}

pub fn get_ascii_logo(distro: Option<&str>) -> Vec<String> {
    let d = distro.map(|s| s.to_lowercase());

    match d.as_deref() {
        // Arch Linux
        Some("arch") => vec![
            "      /\\".to_string(),
            "     /  \\".to_string(),
            "    /\\   \\".to_string(),
            "   /      \\".to_string(),
            "  /   ,,   \\".to_string(),
            " /   |  |   \\".to_string(),
            "/_-''    ''-_\\".to_string(),
        ],

        // Debian
        Some("debian") => vec![
            "  _____".to_string(),
            " /  __ \\".to_string(),
            "|  /  \\  |".to_string(),
            "|  \\__/  |".to_string(),
            " \\______/".to_string(),
        ],

        // EndeavourOS
        Some("endeavouros") | Some("endeavour") => vec![
            "  ____".to_string(),
            " / __ \\".to_string(),
            "| |  | |".to_string(),
            "| |  | |".to_string(),
            "| |__| |".to_string(),
            " \\____/".to_string(),
        ],

        // Fedora
        Some("fedora") => vec![
            "      ____".to_string(),
            "     / __ \\__".to_string(),
            "    / /  \\__/".to_string(),
            "   / /".to_string(),
            "  / /".to_string(),
            " / /".to_string(),
            "/_/".to_string(),
        ],

        // Linux Mint
        Some("linuxmint") | Some("mint") => vec![
            " __  __".to_string(),
            "|  \\/  |".to_string(),
            "| |  | |".to_string(),
            "| |  | |".to_string(),
            "|_|  |_|".to_string(),
        ],

        // Manjaro
        Some("manjaro") => vec![
            " _/\\___".to_string(),
            "| |   |".to_string(),
            "| |   |".to_string(),
            "| |   |".to_string(),
            "|_|   |".to_string(),
        ],

        // NixOS
        Some("nixos") => vec![
            "  __  _".to_string(),
            " /o \\| |".to_string(),
            "|   \\| |".to_string(),
            "| |\\   |".to_string(),
            "|_| \\__|".to_string(),
        ],

        // Pop!_OS
        Some("pop") | Some("pop_os") | Some("popos") => vec![
            " ____".to_string(),
            "|  _ \\".to_string(),
            "| |_) |".to_string(),
            "|  __/".to_string(),
            "|_|".to_string(),
        ],

        // Ubuntu
        Some("ubuntu") => vec![
            "    __".to_string(),
            "   /  \\".to_string(),
            "  |    |".to_string(),
            "   \\__/".to_string(),
        ],

        // Tux (default / unknown)
        _ => vec![
            "    .--. ".to_string(),
            "   |o_o | ".to_string(),
            "   |:_/ | ".to_string(),
            "  //   \\ \\".to_string(),
            " (|     | )".to_string(),
            "'/_   _/' ".to_string(),
            "  |___|  ".to_string(),
        ],
    }
}

pub fn print_ascii_logo(logo: &[String]) {
    for line in logo {
        println!("{}", line);
    }
}

/// Detects Kitty or iTerm2 terminal for graphical logo support.
pub fn supports_graphical_logo() -> bool {
    if let Ok(term) = std::env::var("TERM") {
        if term.contains("kitty") {
            return true;
        }
    }
    if let Ok(program) = std::env::var("TERM_PROGRAM") {
        if program.to_lowercase().contains("iterm") {
            return true;
        }
    }
    false
}

/// Prints an image using the Kitty inline image protocol.
/// Expects raw PNG bytes. Includes proper dimensions for better compatibility.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo(image_data: &[u8]) {
    use base64::Engine;

    // Try to get dimensions from the PNG data
    let (width, height) = image::load_from_memory(image_data)
        .map(|img| (img.width(), img.height()))
        .unwrap_or((0, 0));

    let encoded = base64::engine::general_purpose::STANDARD.encode(image_data);

    if width > 0 && height > 0 {
        // Include width/height for better protocol compliance
        println!(
            "\x1b_Gf=100,s={},v={},a=T;{}\x1b\\",
            width, height, encoded
        );
    } else {
        println!("\x1b_Gf=100,a=T;{}\x1b\\", encoded);
    }
}

/// Fallback when graphics feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_graphical_logo(_image_data: &[u8]) {
    println!("[Graphical logo support requires --features graphics]");
}

#[cfg(feature = "graphics")]
use image::ImageFormat;

/// Load an image from disk, resize it for terminal display, and print using Kitty protocol.
/// Falls back to ASCII if loading fails.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo_from_path(path: &std::path::Path) {
    match image::open(path) {
        Ok(img) => {
            // Resize to reasonable terminal size (preserve aspect ratio)
            let resized = img.resize(128, 128, image::imageops::FilterType::Lanczos3);
            
            let mut png_data = Vec::new();
            if resized.write_to(&mut std::io::Cursor::new(&mut png_data), ImageFormat::Png).is_ok() {
                print_graphical_logo(&png_data);
            } else {
                println!("[Failed to encode logo as PNG]");
            }
        }
        Err(_) => {
            println!("[Could not load graphical logo from {}]", path.display());
        }
    }
}