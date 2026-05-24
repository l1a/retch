// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 l1a

//! ASCII and graphical logo definitions and rendering.
//!
//! Contains embedded distro logos and logic for rendering them
//! as text or images (e.g., Sixel, Kitty, iTerm).

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
        Some("pop") => Some(include_bytes!("../assets/logos/pop.png")),
        Some("manjaro") => Some(include_bytes!("../assets/logos/manjaro.png")),
        Some("endeavouros") => Some(include_bytes!("../assets/logos/endeavouros.png")),
        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => {
            Some(include_bytes!("../assets/logos/opensuse.png"))
        }
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

        Some("pop") => vec![
            "\x1b[37m             /////////////\x1b[0m".to_string(),
            "\x1b[37m         /////////////////////\x1b[0m".to_string(),
            "\x1b[37m      ///////\x1b[36m*767\x1b[37m////////////////\x1b[0m".to_string(),
            "\x1b[37m    //////\x1b[36m7676767676*\x1b[37m//////////////\x1b[0m".to_string(),
            "\x1b[37m   /////\x1b[36m76767\x1b[37m//\x1b[36m7676767\x1b[37m//////////////\x1b[0m".to_string(),
            "\x1b[37m  /////\x1b[36m767676\x1b[37m///\x1b[36m*76767\x1b[37m///////////////\x1b[0m".to_string(),
            "\x1b[37m ///////\x1b[36m767676\x1b[37m///\x1b[36m76767\x1b[37m.\x1b[36m///7676*\x1b[37m///////\x1b[0m".to_string(),
            "\x1b[37m/////////\x1b[36m767676\x1b[37m//\x1b[36m76767\x1b[37m///\x1b[36m767676\x1b[37m////////\x1b[0m".to_string(),
            "\x1b[37m//////////\x1b[36m767676767676\x1b[37m////\x1b[36m76767\x1b[37m/////////\x1b[0m".to_string(),
            "\x1b[37m///////////\x1b[36m767676767\x1b[37m//////\x1b[36m7676\x1b[37m//////////\x1b[0m".to_string(),
            "\x1b[37m////////////,\x1b[36m7676\x1b[37m,///////\x1b[36m767\x1b[37m///////////\x1b[0m".to_string(),
            "\x1b[37m/////////////*\x1b[36m7676\x1b[37m///////\x1b[36m76\x1b[37m////////////\x1b[0m".to_string(),
            "\x1b[37m///////////////\x1b[36m7676\x1b[37m////////////////////\x1b[0m".to_string(),
            "\x1b[37m ///////////////\x1b[36m7676\x1b[37m///\x1b[36m767\x1b[37m////////////\x1b[0m".to_string(),
            "\x1b[37m  //////////////////////\x1b[36m'\x1b[37m////////////\x1b[0m".to_string(),
            "\x1b[37m   //////\x1b[36m.7676767676767676767,\x1b[37m//////\x1b[0m".to_string(),
            "\x1b[37m    /////\x1b[36m767676767676767676767\x1b[37m/////\x1b[0m".to_string(),
            "\x1b[37m      ///////////////////////////\x1b[0m".to_string(),
            "\x1b[37m         /////////////////////\x1b[0m".to_string(),
            "\x1b[37m             /////////////\x1b[0m".to_string(),
        ],

        Some("manjaro") => vec![
            "\x1b[32m██████████████████  ████████\x1b[0m".to_string(),
            "\x1b[32m██████████████████  ████████\x1b[0m".to_string(),
            "\x1b[32m██████████████████  ████████\x1b[0m".to_string(),
            "\x1b[32m██████████████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████            ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
            "\x1b[32m████████  ████████  ████████\x1b[0m".to_string(),
        ],

        Some("endeavouros") => vec![
            "                     \x1b[35m./\x1b[31mo\x1b[34m.\x1b[0m".to_string(),
            "                   \x1b[35m./\x1b[31msssso\x1b[34m-\x1b[0m".to_string(),
            "                 \x1b[35m`:\x1b[31mosssssss+\x1b[34m-\x1b[0m".to_string(),
            "               \x1b[35m`:+\x1b[31msssssssssso\x1b[34m/.\x1b[0m".to_string(),
            "             \x1b[35m`-/o\x1b[31mssssssssssssso\x1b[34m/.\x1b[0m".to_string(),
            "           \x1b[35m`-/+\x1b[31msssssssssssssssso\x1b[34m+:`\x1b[0m".to_string(),
            "         \x1b[35m`-:/+\x1b[31msssssssssssssssssso\x1b[34m+/.\x1b[0m".to_string(),
            "       \x1b[35m`.://o\x1b[31msssssssssssssssssssso\x1b[34m++-\x1b[0m".to_string(),
            "      \x1b[35m.://+\x1b[31mssssssssssssssssssssssso\x1b[34m++:\x1b[0m".to_string(),
            "    \x1b[35m.:///o\x1b[31mssssssssssssssssssssssssso\x1b[34m++:\x1b[0m".to_string(),
            "  \x1b[35m`:////\x1b[31mssssssssssssssssssssssssssso\x1b[34m+++.\x1b[0m".to_string(),
            "\x1b[35m`-////+\x1b[31mssssssssssssssssssssssssssso\x1b[34m++++-\x1b[0m".to_string(),
            " \x1b[35m`..-+\x1b[31moosssssssssssssssssssssssso\x1b[34m+++++/`\x1b[0m".to_string(),
            "   \x1b[34m./++++++++++++++++++++++++++++++/:.\x1b[0m".to_string(),
            "  \x1b[34m`:::::::::::::::::::::::::------``\x1b[0m".to_string(),
            "  \x1b[34m`:::::::::::::::::::::::::------``\x1b[0m".to_string(),
        ],

        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => vec![
            "\x1b[32m           .;ldkO0000Okdl;.\x1b[0m".to_string(),
            "\x1b[32m       .;d00xl:^''''''^:ok00d;.\x1b[0m".to_string(),
            "\x1b[32m     .d00l'                'o00d.\x1b[0m".to_string(),
            "\x1b[32m   .d0Kd'\x1b[37m  Okxol:;,.          \x1b[32m:O0d\x1b[0m".to_string(),
            "\x1b[32m  .OK\x1b[37mKKK0kOKKKKKKKKKKOxo:,\x1b[32m      lKO.\x1b[0m".to_string(),
            "\x1b[32m ,0K\x1b[37mKKKKKKKKKKKKKKK0P^\x1b[32m,,,\x1b[37m^dx:\x1b[32m    ;00,\x1b[0m".to_string(),
            "\x1b[32m.OK\x1b[37mKKKKKKKKKKKKKKKk'\x1b[32m.oOPPb.\x1b[37m'0k.\x1b[32m   cKO.\x1b[0m".to_string(),
            "\x1b[32m:KK\x1b[37mKKKKKKKKKKKKKKK: \x1b[32mkKx..dd \x1b[37mlKd\x1b[32m   'OK:\x1b[0m".to_string(),
            "\x1b[32mdKK\x1b[37mKKKKKKKKKOx0KKKd \x1b[32m^0KKKO' \x1b[37mkKKc\x1b[32m   dKd\x1b[0m".to_string(),
            "\x1b[32mdKK\x1b[37mKKKKKKKKKK;.;oOKx,..\x1b[32m^\x1b[37m..;kKKK0.\x1b[32m  dKd\x1b[0m".to_string(),
            "\x1b[32m:KK\x1b[37mKKKKKKKKKK0o;...^cdxxOK0O/^^'  \x1b[32m.0K:\x1b[0m".to_string(),
            "\x1b[32m kKK\x1b[37mKKKKKKKKKKKKK0x;,,......,;od  \x1b[32mlKk\x1b[0m".to_string(),
            "\x1b[32m '0K\x1b[37mKKKKKKKKKKKKKKKKKKKK00KKOo^  \x1b[32mc00'\x1b[0m".to_string(),
            "\x1b[32m  'kK\x1b[37mKKOxddxkOO00000Okxoc;''   \x1b[32m.dKk'\x1b[0m".to_string(),
            "\x1b[32m    l0Ko.                    .c00l'\x1b[0m".to_string(),
            "\x1b[32m     'l0Kk:.              .;xK0l'\x1b[0m".to_string(),
            "\x1b[32m        'lkK0xl:;,,,,;:ldO0kl'\x1b[0m".to_string(),
            "\x1b[32m            '^:ldxkkkkxdl:^'\x1b[0m".to_string(),
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
pub fn supports_kitty() -> bool {
    std::env::var("TERM")
        .map(|t| t == "xterm-kitty")
        .unwrap_or(false)
        || std::env::var("TERMINAL_EMULATOR")
            .map(|t| t == "iterm-kitty" || t == "iTerm.app")
            .unwrap_or(false)
        || std::env::var("TERM_PROGRAM")
            .map(|t| t == "rio")
            .unwrap_or(false)
}

/// Checks if the terminal supports the iTerm2 inline image protocol.
pub fn supports_iterm2() -> bool {
    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if prog == "iTerm.app" || prog == "WezTerm" || prog == "rio" {
            return true;
        }
    }
    false
}

/// Checks if the terminal supports Sixel graphics (heuristic based on environment).
pub fn supports_sixel() -> bool {
    if let Ok(term) = std::env::var("TERM") {
        let term = term.to_lowercase();
        if term.contains("sixel") || term.contains("foot") || term.contains("mlterm") {
            return true;
        }
    }

    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if prog == "WezTerm" || prog == "iTerm.app" || prog == "rio" {
            return true;
        }
    }

    if std::env::var("WT_SESSION").is_ok() {
        return true;
    }

    false
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

    let supports_kitty = supports_kitty();
    let supports_iterm2 = supports_iterm2();
    let supports_sixel = supports_sixel();
    let has_chafa = chafa_available();

    // 1. Try embedded graphical logo (Kitty)
    #[cfg(feature = "graphics")]
    if supports_kitty {
        if let Some(bytes) = get_embedded_logo(distro) {
            if !bytes.is_empty() {
                print_graphical_logo(bytes);
                return;
            }
        }
    }

    // 2. Try embedded graphical logo (iTerm2)
    #[cfg(feature = "graphics")]
    if supports_iterm2 {
        if let Some(bytes) = get_embedded_logo(distro) {
            if !bytes.is_empty() {
                print_iterm2_logo(bytes);
                return;
            }
        }
    }

    // 3. Try embedded graphical logo (Sixel)
    #[cfg(feature = "graphics")]
    if supports_sixel {
        if let Some(bytes) = get_embedded_logo(distro) {
            if !bytes.is_empty() {
                print_sixel_logo(bytes);
                return;
            }
        }
    }

    // 3. Try chafa using embedded distro logo
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

    // 4. Final fallback: Real Fastfetch ASCII logo
    let art = get_ascii_logo(distro);
    for line in art {
        println!("{}", line);
    }
}

/// Renders a raw image buffer using the iTerm2 inline image protocol.
#[cfg(feature = "graphics")]
pub fn print_iterm2_logo(image_data: &[u8]) {
    use base64::Engine;
    let encoded = base64::engine::general_purpose::STANDARD.encode(image_data);
    print!(
        "\x1b]1337;File=inline=1;preserveAspectRatio=1:{}\x07",
        encoded
    );
    println!(); // iTerm2 typically needs a newline after the logo
}

/// Loads an image from a file and prints it using the iTerm2 protocol.
#[cfg(feature = "graphics")]
pub fn print_iterm2_logo_from_path(path: &std::path::Path) {
    if let Ok(bytes) = std::fs::read(path) {
        print_iterm2_logo(&bytes);
    } else {
        println!("[Could not read logo for iTerm2 from {}]", path.display());
    }
}

/// Placeholder for iTerm2 logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_iterm2_logo(_image_data: &[u8]) {
    println!("[iTerm2 logo support requires --features graphics]");
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

/// Renders a raw image buffer (e.g. PNG bytes) using the Sixel graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_logo(image_data: &[u8]) {
    if let Ok(img) = image::load_from_memory(image_data) {
        let rgba = img.to_rgba8();
        let (width, height) = rgba.dimensions();
        print_sixel_rgba(rgba.as_raw(), width, height);
    }
}

/// Renders raw RGBA pixels using the Sixel graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_rgba(rgba: &[u8], width: u32, height: u32) {
    use icy_sixel::SixelImage;

    match SixelImage::try_from_rgba(rgba.to_vec(), width as usize, height as usize) {
        Ok(sixel_img) => match sixel_img.encode() {
            Ok(sixel_str) => {
                print!("{}", sixel_str);
            }
            Err(e) => eprintln!("[Sixel Encoding Error: {}]", e),
        },
        Err(e) => eprintln!("[Sixel Creation Error: {}]", e),
    }
}

/// Placeholder for graphical logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_graphical_logo(_image_data: &[u8]) {
    println!("[Graphical logo support requires --features graphics]");
}

/// Placeholder for sixel logo rendering when the `graphics` feature is disabled.
#[cfg(not(feature = "graphics"))]
pub fn print_sixel_logo(_image_data: &[u8]) {
    println!("[Sixel logo support requires --features graphics]");
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

/// Loads an image from a file, resizes it, and prints it using the Sixel protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_logo_from_path(path: &std::path::Path) {
    match image::open(path) {
        Ok(img) => {
            let resized = img.resize(128, 128, image::imageops::FilterType::Lanczos3);
            let rgba = resized.to_rgba8();
            let (width, height) = rgba.dimensions();
            print_sixel_rgba(rgba.as_raw(), width, height);
        }
        Err(_) => {
            println!("[Could not load logo for Sixel from {}]", path.display());
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

    #[test]
    fn test_supports_kitty() {
        std::env::set_var("TERM", "xterm-kitty");
        assert!(supports_kitty());
        std::env::set_var("TERM", "xterm");
        assert!(!supports_kitty());
    }

    #[test]
    fn test_supports_iterm2() {
        std::env::set_var("TERM_PROGRAM", "iTerm.app");
        assert!(supports_iterm2());
        std::env::set_var("TERM_PROGRAM", "Apple_Terminal");
        assert!(!supports_iterm2());
    }

    #[test]
    fn test_supports_sixel() {
        std::env::set_var("TERM", "xterm-sixel");
        assert!(supports_sixel());
        std::env::set_var("TERM", "xterm");
        assert!(!supports_sixel());
    }

    #[test]
    fn test_get_embedded_logo() {
        let logo = get_embedded_logo(Some("arch"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("pop"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("manjaro"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("endeavouros"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("opensuse"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("opensuse-leap"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("opensuse-tumbleweed"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(None);
        assert!(logo.is_some());
    }

    #[test]
    fn test_get_ascii_logo_new_distros() {
        let pop = get_ascii_logo(Some("pop"));
        assert!(!pop.is_empty());
        assert!(pop.iter().any(|line| line.contains("767")));

        let manjaro = get_ascii_logo(Some("manjaro"));
        assert!(!manjaro.is_empty());
        assert!(manjaro.iter().any(|line| line.contains("████████")));

        let endeavouros = get_ascii_logo(Some("endeavouros"));
        assert!(!endeavouros.is_empty());
        assert!(endeavouros.iter().any(|line| line.contains("ssso")));

        let opensuse = get_ascii_logo(Some("opensuse"));
        assert!(!opensuse.is_empty());
        assert!(opensuse.iter().any(|line| line.contains("O0000Ok")));
    }
}
