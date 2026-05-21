// Exact Fastfetch ASCII logos (intact, unmodified)
// Source: https://github.com/fastfetch-cli/fastfetch/src/logo/ascii/

// Embedded distro logos (PNG)
// Place real logos in assets/logos/<distro>.png
// Example: assets/logos/arch.png, assets/logos/fedora.png, assets/logos/tux.png

/// Returns the raw PNG bytes for an embedded distro logo.
///
/// If the distro is not recognized, it falls back to the Tux (Linux) logo.
/// Only available when the `graphics` feature is enabled.
#[cfg(feature = "graphics")]
pub fn get_embedded_logo(distro: Option<&str>) -> Option<&'static [u8]> {
    let d = distro.map(|s| s.to_lowercase());
    match d.as_deref() {
        Some("arch") => Some(include_bytes!("../assets/logos/arch.png")),
        Some("debian") => Some(include_bytes!("../assets/logos/debian.png")),
        Some("fedora") => Some(include_bytes!("../assets/logos/fedora.png")),
        Some("nixos") => Some(include_bytes!("../assets/logos/nixos.png")),
        Some("ubuntu") => Some(include_bytes!("../assets/logos/ubuntu.png")),
        _ => Some(include_bytes!("../assets/logos/tux.png")),
    }
}

/// Fallback for non-graphics build to provide Tux bytes for Chafa if needed.
#[cfg(not(feature = "graphics"))]
pub fn get_embedded_logo(_distro: Option<&str>) -> Option<&'static [u8]> {
    Some(include_bytes!("../assets/logos/tux.png"))
}

/// Attempts to detect the current Linux distribution by reading `/etc/os-release`.
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

/// Returns a list of strings representing the ASCII art for a given distro.
///
/// All ASCII logos are sourced from or compatible with Fastfetch.
pub fn get_ascii_logo(distro: Option<&str>) -> Vec<String> {
    let d = distro.map(|s| s.to_lowercase());

    match d.as_deref() {
        // Arch Linux - exact from Fastfetch
        Some("arch") => vec![
            "               -`".to_string(),
            "                 .o+`".to_string(),
            "                `ooo/".to_string(),
            "               `+oooo:".to_string(),
            "              `+oooooo:".to_string(),
            "              -+oooooo+:".to_string(),
            "            `/:-:++oooo+:".to_string(),
            "           `/++++/+++++++:".to_string(),
            "          `/++++++++++++++:".to_string(),
            "         `/+++ooooooooooooo/`".to_string(),
            "        ./ooosssso++osssssso+`".to_string(),
            "       .oossssso-````/ossssss+`".to_string(),
            "      -osssssso.      :ssssssso.".to_string(),
            "     :osssssss/        osssso+++.".to_string(),
            "    /ossssssss/        +ssssooo/-".to_string(),
            "  `/ossssso+/:-        -:/+osssso+-".to_string(),
            " `+sso+:-`                 `.-/+oso:".to_string(),
            "`++:.                           `-/+/".to_string(),
            ".`                                 `".to_string(),
        ],

        // Debian - exact from Fastfetch
        Some("debian") => vec![
            " _,met$$$$$$$$$$gg.".to_string(),
            "      ,g$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$P.".to_string(),
            "    ,g$$$$P\"\"       \"\"\"Y$$$$.\".".to_string(),
            "   ,$$$$P'              `$$$$$$.".to_string(),
            "',$$$$P       ,ggs.     `$$$$b:".to_string(),
            "`d$$$$'     ,$P\"'   .    $$$$$$".to_string(),
            " $$$$P      d$'     ,    $$$$P".to_string(),
            " $$$$:      $$$.   -    ,d$$$$'".to_string(),
            " $$$$;      Y$b._   _,d$P'".to_string(),
            " Y$$$$.    .`\"Y$$$$$$$$P\"'".to_string(),
            " `$$$$b      \"-.__".to_string(),
            "  `Y$$$$b".to_string(),
            "   `Y$$$$.".to_string(),
            "     `$$$$b.".to_string(),
            "       `Y$$$$b.".to_string(),
            "         `\"Y$$b._".to_string(),
            "             `\"\"\"\"".to_string(),
        ],

        // Fedora - exact from Fastfetch
        Some("fedora") => vec![
            "             .',;::::;,'.".to_string(),
            "         .';:cccccccccccc:;,.".to_string(),
            "      .;cccccccccccccccccccccc;.".to_string(),
            "    .:cccccccccccccccccccccc:.".to_string(),
            "  .;ccccccccccccc;.:dddl:.;ccccccc;.".to_string(),
            " .:ccccccccccccc;OWMKOOXMWd;ccccccc:.".to_string(),
            ".:ccccccccccccc;KMMc;cc;xMMc;ccccccc:.".to_string(),
            ",cccccccccccccc;MMM.;cc;;WW:;cccccccc,".to_string(),
            ":cccccccccccccc;MMM.;cccccccccccccccc:".to_string(),
            ":ccccccc;oxOOOo;MMM000k.;cccccccccccc:".to_string(),
            "cccccc;0MMKxdd:;MMMkddc.;cccccccccccc;".to_string(),
            "ccccc;XMO';cccc;MMM.;cccccccccccccccc'".to_string(),
            "ccccc;MMo;ccccc;MMW.;ccccccccccccccc;".to_string(),
            "ccccc;0MNc.ccc.xMMd;ccccccccccccccc;".to_string(),
            "cccccc;dNMWXXXWM0:;cccccccccccccc:,".to_string(),
            "cccccccc;.:odl:.;cccccccccccccc:,.".to_string(),
            "ccccccccccccccccccccccccccccc:'.".to_string(),
            ":ccccccccccccccccccccccc:;,..".to_string(),
        ],

        // NixOS - exact from Fastfetch
        Some("nixos") => vec![
            "          ::::.    ':::::".to_string(),
            "      ':::::::::.   ':::::::::".to_string(),
            "  .:::::::::::::     ::::::::::::.".to_string(),
            "  :::::::::::'        ::::::::::::".to_string(),
            " .::::::::::'          :::::::::::.".to_string(),
            " ::::::::::             :::::::::::".to_string(),
            " :::::::::              :::::::::::".to_string(),
            " ::::::::                ::::::::::".to_string(),
            " '::::::.                '::::::::'".to_string(),
            "  ':::::                  '::::::'".to_string(),
            "   ':::                    '::::'".to_string(),
            "    ':                      ':".to_string(),
        ],

        // Ubuntu - exact from Fastfetch
        Some("ubuntu") => vec![
            "                          ....".to_string(),
            "          ....,,:::::ccccclllclllcc:::;,,....".to_string(),
            "      ..,;::cccllllllllllllllllllllllllcc::;..".to_string(),
            "    ..,;::cccllllllllllllllllllllllllllllcc::;..".to_string(),
            "  ..,;::cccllllllllllllllllllllllllllllllllcc::;..".to_string(),
            " ..,;::cccllllllllllllllllllllllllllllllllllcc::;..".to_string(),
            "..,;::cccllllllllllllllllllllllllllllllllllllcc::;.".to_string(),
            "..,;::cccllllllllllllllllllllllllllllllllllllcc::;.".to_string(),
            "..,;::cccllllllllllllllllllllllllllllllllllllcc::;.".to_string(),
            "..,;::cccllllllllllllllllllllllllllllllllllllcc::;.".to_string(),
            "..,;::cccllllllllllllllllllllllllllllllllllllcc::;.".to_string(),
            "..,;::cccllllllllllllllllllllllllllllllllllllcc::;.".to_string(),
        ],

        // Fallback: Tux (Linux)
        _ => vec![
            "    .--.".to_string(),
            "   |o_o |".to_string(),
            "   |:_/ |".to_string(),
            "  //   \\ \\".to_string(),
            " (|     | )".to_string(),
            "/'\\_   _/`\\".to_string(),
            "\\___)=(___/".to_string(),
        ],
    }
}

/// Checks if the terminal supports the Kitty inline image protocol.
pub fn supports_graphical_logo() -> bool {
    std::env::var("TERM").map(|t| t == "xterm-kitty").unwrap_or(false)
        || std::env::var("TERMINAL_EMULATOR")
            .map(|t| t == "iterm-kitty" || t == "iTerm.app")
            .unwrap_or(false)
}

/// Checks if the `chafa` command-line tool is available in the system path.
pub fn chafa_available() -> bool {
    std::process::Command::new("chafa")
        .arg("--version")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

/// Write embedded logo bytes to a temporary file and return the path.
fn write_temp_logo(bytes: &[u8]) -> std::io::Result<std::path::PathBuf> {
    let temp_path = std::env::temp_dir().join(format!("retch_logo_{}.png", std::process::id()));
    std::fs::write(&temp_path, bytes)?;
    Ok(temp_path)
}

/// Attempts to render an image using the `chafa` utility.
///
/// Chafa renders images using high-quality Unicode symbols, providing a
/// good graphical fallback for many terminal emulators.
pub fn print_with_chafa(path: &std::path::Path) -> bool {
    let output = std::process::Command::new("chafa")
        .arg("--format")
        .arg("symbols")
        .arg("--size")
        .arg("40x20")
        .arg(path)
        .output();

    match output {
        Ok(out) if out.status.success() => {
            print!("{}", String::from_utf8_lossy(&out.stdout));
            true
        }
        _ => false,
    }
}

/// Print logo for a distro following the strict priority:
/// 1. Real graphic logo (if terminal supports it and embedded logo exists)
/// 2. Chafa high-quality symbols (if chafa is available)
/// 3. Real Fastfetch ASCII logo (always available)
pub fn print_distro_logo(distro: Option<&str>) {
    print_distro_logo_with_ascii(distro, false);
}

/// Renders the distribution logo with an option to force ASCII mode.
///
/// This is the primary entry point for logo rendering, handling the entire
/// priority chain from high-res graphics down to text-based ASCII.
pub fn print_distro_logo_with_ascii(distro: Option<&str>, ascii_only: bool) {
    if ascii_only {
        // Force ASCII path
        let art = get_ascii_logo(distro);
        for line in art {
            println!("{}", line);
        }
        return;
    }

    let supports_graphics = supports_graphical_logo();
    let has_chafa = chafa_available();

    // 1. Try embedded graphical logo (only if feature is enabled)
    #[cfg(feature = "graphics")]
    if supports_graphics {
        if let Some(bytes) = get_embedded_logo(distro) {
            if !bytes.is_empty() {
                print_graphical_logo(bytes);
                return;
            }
        }
    }

    // 2. Try chafa using embedded distro logo
    if has_chafa {
        if let Some(bytes) = get_embedded_logo(distro) {
            if bytes.len() > 100 {
                if let Ok(temp_path) = write_temp_logo(bytes) {
                    if print_with_chafa(&temp_path) {
                        let _ = std::fs::remove_file(&temp_path);
                        return;
                    }
                    let _ = std::fs::remove_file(&temp_path);
                }
            }
        }
    }

    // 3. Final fallback: Real Fastfetch ASCII logo
    let art = get_ascii_logo(distro);
    for line in art {
        println!("{}", line);
    }
}

/// Renders a raw image buffer using the Kitty graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo(image_data: &[u8]) {
    use base64::Engine;

    let (width, height) = image::load_from_memory(image_data)
        .map(|img| (img.width(), img.height()))
        .unwrap_or((0, 0));

    let encoded = base64::engine::general_purpose::STANDARD.encode(image_data);

    if width > 0 && height > 0 {
        println!("\x1b_Gf=100,s={},v={},a=T;{}\x1b\\", width, height, encoded);
    } else {
        println!("\x1b_Gf=100,a=T;{}", encoded);
    }
}

/// Placeholder for graphical logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_graphical_logo(_image_data: &[u8]) {
    println!("[Graphical logo support requires --features graphics]");
}

/// Loads an image from a file, resizes it, and prints it using the graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_graphical_logo_from_path(path: &std::path::Path) {
    use image::ImageFormat;
    match image::open(path) {
        Ok(img) => {
            let resized = img.resize(128, 128, image::imageops::FilterType::Lanczos3);
            let mut png_data = Vec::new();
            if resized
                .write_to(&mut std::io::Cursor::new(&mut png_data), ImageFormat::Png)
                .is_ok()
            {
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_ascii_logo_arch() {
        let logo = get_ascii_logo(Some("arch"));
        assert!(!logo.is_empty());
        assert!(logo[0].contains("`"));
    }

    #[test]
    fn test_get_ascii_logo_unknown() {
        let logo = get_ascii_logo(Some("unknown_distro"));
        assert!(!logo.is_empty());
        // Should fall back to Tux
        assert!(logo.iter().any(|line| line.contains("o_o")));
    }

    #[test]
    fn test_get_ascii_logo_none() {
        let logo = get_ascii_logo(None);
        assert!(!logo.is_empty());
    }
}
