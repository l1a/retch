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
        Some("macos") => Some(include_bytes!("../assets/logos/macos.png")),
        Some("windows") => Some(include_bytes!("../assets/logos/windows.png")),
        _ => Some(include_bytes!("../assets/logos/tux.png")),
    }
}

/// Fallback for non-graphics build to provide Tux bytes for Chafa if needed.
#[cfg(not(feature = "graphics"))]
pub fn get_embedded_logo(_distro: Option<&str>) -> Option<&'static [u8]> {
    Some(include_bytes!("../assets/logos/tux.png"))
}

/// Attempts to detect the current operating system distribution.
pub fn detect_distro() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        Some("macos".to_string())
    }
    #[cfg(target_os = "windows")]
    {
        Some("windows".to_string())
    }
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    {
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
}

///// Returns a list of strings representing the ASCII art for a given distro with color placeholders.
///
/// All ASCII logos are sourced from or compatible with Fastfetch.
pub fn get_ascii_logo(distro: Option<&str>) -> Vec<String> {
    let d = distro.map(|s| s.to_lowercase());

    match d.as_deref() {
        // Arch Linux - exact from Fastfetch
        Some("arch") => vec![
            "                  -`".to_string(),
            "                 .o+`".to_string(),
            "                `ooo/".to_string(),
            "               `+oooo:".to_string(),
            "              `+oooooo:".to_string(),
            "              -+oooooo+:".to_string(),
            "            `/:-:++oooo+:".to_string(),
            "           `/++++/+++++++:".to_string(),
            "          `/++++++++++++++:".to_string(),
            "         `/+++o${2}oooooooo${1}oooo/`".to_string(),
            "        ./${2}ooosssso++osssssso${1}+`".to_string(),
            "${2}       .oossssso-````/ossssss+`".to_string(),
            "      -osssssso.      :ssssssso.".to_string(),
            "     :osssssss/        osssso+++.".to_string(),
            "    /ossssssss/        +ssssooo/-".to_string(),
            "  `/ossssso+/:-        -:/+osssso+-".to_string(),
            " `+sso+:-`                 `.-/+oso:".to_string(),
            "`++:.                           `-/+/".to_string(),
            ".`                                 `/".to_string(),
        ],

        // Debian - exact from Fastfetch
        Some("debian") => vec![
            "        ${2}_,met$$$$$$$$$$gg.".to_string(),
            "     ,g$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$P.".to_string(),
            "   ,g$$$$P\"\"       \"\"\"Y$$$$.\".".to_string(),
            "  ,$$$$P'              `$$$$$$.".to_string(),
            "',$$$$P       ,ggs.     `$$$$b:".to_string(),
            "`d$$$$'     ,$P\"'   ${1}.${2}    $$$$$$".to_string(),
            " $$$$P      d$'     ${1},${2}    $$$$P".to_string(),
            " $$$$:      $$$.   ${1}-${2}    ,d$$$$'".to_string(),
            " $$$$;      Y$b._   _,d$P'".to_string(),
            " Y$$$$.    ${1}`.${2}`\"Y$$$$$$$$P\"'".to_string(),
            " `$$$$b      ${1}\"-.__".to_string(),
            "  ${2}`Y$$$$b".to_string(),
            "   `Y$$$.".to_string(),
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
            "    .:cccccccccccccccccccccccccc:.".to_string(),
            "  .;ccccccccccccc;${2}.:dddl:${1};ccccccc;.".to_string(),
            " .:ccccccccccccc;${2}OWMKOOXMWd${1};ccccccc:.".to_string(),
            ".:ccccccccccccc;${2}KMMc${1};cc;${2}xMMc${1};ccccccc:.".to_string(),
            ",cccccccccccccc;${2}MMM.${1};cc;${2};WW:${1};cccccccc,".to_string(),
            ":cccccccccccccc;${2}MMM.${1};cccccccccccccccc:".to_string(),
            ":ccccccc;${2}oxOOOo${1};${2}MMM000k.${1};cccccccccccc:".to_string(),
            "cccccc;${2}0MMKxdd:${1};${2}MMMkddc.${1};cccccccccccc;".to_string(),
            "ccccc;${2}XMO'${1};cccc;${2}MMM.${1};cccccccccccccccc'".to_string(),
            "ccccc;${2}MMo${1};ccccc;${2}MMW.${1};ccccccccccccccc;".to_string(),
            "ccccc;${2}0MNc.${1}ccc${2}.xMMd${1};ccccccccccccccc;".to_string(),
            "cccccc;${2}dNMWXXXWM0:${1};cccccccccccccc:,".to_string(),
            "cccccccc;${2}.:odl:${1};cccccccccccccc:,.".to_string(),
            "ccccccccccccccccccccccccccccc:'.".to_string(),
            ":ccccccccccccccccccccccc:;,..".to_string(),
            " ':cccccccccccccccc::;,.".to_string(),
        ],

        // NixOS - exact from Fastfetch
        Some("nixos") => vec![
            "          ${1}▗▄▄▄       ${2}▗▄▄▄▄    ▄▄▄▖".to_string(),
            "          ${1}▜███▙       ${2}▜███▙  ▟███▛".to_string(),
            "           ${1}▜███▙       ${2}▜███▙▟███▛".to_string(),
            "            ${1}▜███▙       ${2}▜██████▛".to_string(),
            "     ${1}▟█████████████████▙ ${2}▜████▛     ${3}▟▙".to_string(),
            "    ${1}▟███████████████████▙ ${2}▜███▙    ${3}▟██▙".to_string(),
            "           ${6}▄▄▄▄▖           ${2}▜███▙  ${3}▟███▛".to_string(),
            "          ${6}▟███▛             ${2}▜██▛ ${3}▟███▛".to_string(),
            "         ${6}▟███▛               ${2}▜▛ ${3}▟███▛".to_string(),
            "${6}▟███████████▛                  ${3}▟██████████▙".to_string(),
            "${6}▜██████████▛                  ${3}▟███████████▛".to_string(),
            "      ${6}▟███▛ ${5}▟▙               ${3}▟███▛".to_string(),
            "     ${6}▟███▛ ${5}▟██▙             ${3}▟███▛".to_string(),
            "    ${6}▟███▛  ${5}▜███▙           ${3}▝▀▀▀▀".to_string(),
            "    ${6}▜██▛    ${5}▜███▙ ${4}▜██████████████████▛".to_string(),
            "     ${6}▜▛     ${5}▟████▙ ${4}▜████████████████▛".to_string(),
            "           ${5}▟██████▙         ${4}▜███▙".to_string(),
            "          ${5}▟███▛▜███▙         ${4}▜███▙".to_string(),
            "         ${5}▟███▛  ▜███▙         ${4}▜███▙".to_string(),
            "         ${5}▝▀▀▀    ▀▀▀▀▘         ${4}▀▀▀▘".to_string(),
        ],

        // Ubuntu - exact from Fastfetch
        Some("ubuntu") => vec![
            "                             ....".to_string(),
            "              ${2}.',:clooo:  ${1}.:looooo:.".to_string(),
            "           ${2}.;looooooooc  ${1}.oooooooooo'".to_string(),
            "        ${2}.;looooool:,''.  ${1}:ooooooooooc".to_string(),
            "       ${2};looool;.         ${1}'oooooooooo,".to_string(),
            "      ${2};clool'             ${1}.cooooooc.  ${2},,".to_string(),
            "         ${2}...                ${1}......  ${2}.:oo,".to_string(),
            "  ${1}.;clol:,.                        ${2}.loooo'".to_string(),
            " ${1}:ooooooooo,                        ${2}'ooool".to_string(),
            "${1}'ooooooooooo.                        ${2}loooo.".to_string(),
            "${1}'ooooooooool                         ${2}coooo.".to_string(),
            " ${1},loooooooc.                        ${2}.loooo.".to_string(),
            "   ${1}.,;;;'.                          ${2};ooooc".to_string(),
            "       ${2}...                         ${2},ooool.".to_string(),
            "    ${2}.cooooc.              ${1}..',,'.  ${2}.cooo.".to_string(),
            "      ${2};ooooo:.           ${1};oooooooc.  ${2}:l.".to_string(),
            "       ${2}.coooooc,..      ${1}coooooooooo.".to_string(),
            "         ${2}.:ooooooolc:. ${1}.ooooooooooo'".to_string(),
            "           ${2}.':loooooo;  ${1},oooooooooc".to_string(),
            "               ${2}..';::c'  ${1}.;loooo:'".to_string(),
        ],

        Some("pop") => vec![
            "             /////////////".to_string(),
            "         /////////////////////".to_string(),
            "      ///////${2}*767${1}////////////////".to_string(),
            "    //////${2}7676767676*${1}//////////////".to_string(),
            "   /////${2}76767${1}//${2}7676767${1}//////////////".to_string(),
            "  /////${2}767676${1}///${2}*76767${1}///////////////".to_string(),
            " ///////${2}767676${1}///${2}76767${1}.///${2}7676*${1}///////".to_string(),
            "/////////${2}767676${1}//${2}76767${1}///${2}767676${1}////////".to_string(),
            "//////////${2}76767676767${1}////${2}76767${1}/////////".to_string(),
            "///////////${2}76767676${1}//////${2}7676${1}//////////".to_string(),
            "////////////,${2}7676${1},///////${2}767${1}///////////".to_string(),
            "/////////////*${2}7676${1}///////${2}76${1}////////////".to_string(),
            "///////////////${2}7676${1}////////////////////".to_string(),
            " ///////////////${2}7676${1}///${2}767${1}////////////".to_string(),
            "  //////////////////////${2}'${1}////////////".to_string(),
            "   //////${2}.7676767676767676767,${1}//////".to_string(),
            "    /////${2}767676767676767676767${1}/////".to_string(),
            "      ///////////////////////////".to_string(),
            "         /////////////////////".to_string(),
            "             /////////////".to_string(),
        ],

        Some("manjaro") => vec![
            "██████████████████  ████████".to_string(),
            "██████████████████  ████████".to_string(),
            "██████████████████  ████████".to_string(),
            "██████████████████  ████████".to_string(),
            "████████            ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
            "████████  ████████  ████████".to_string(),
        ],

        Some("endeavouros") => vec![
            "                     ${2}./${1}o${3}.".to_string(),
            "                   ${2}./${1}sssso${3}-".to_string(),
            "                 ${2}`:${1}osssssss+${3}-".to_string(),
            "               ${2}`:+${1}sssssssssso${3}/.".to_string(),
            "             ${2}`-/o${1}ssssssssssssso${3}/.".to_string(),
            "           ${2}`-/+${1}sssssssssssssssso${3}+:`".to_string(),
            "         ${2}`-:/+${1}sssssssssssssssssso${3}+/.".to_string(),
            "       ${2}`.://o${1}sssssssssssssssssssso${3}++-".to_string(),
            "      ${2}.://+${1}ssssssssssssssssssssssso${3}++:".to_string(),
            "    ${2}.:///o${1}ssssssssssssssssssssssssso${3}++:".to_string(),
            "  ${2}`:////${1}ssssssssssssssssssssssssssso${3}+++.".to_string(),
            "${2}`-////+${1}ssssssssssssssssssssssssssso${3}++++-".to_string(),
            " ${2}`..-+${1}oosssssssssssssssssssssssso${3}+++++/`".to_string(),
            "   ${3}./++++++++++++++++++++++++++++++/:.".to_string(),
            "  `:::::::::::::::::::::::::------``".to_string(),
        ],

        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => vec![
            "           ${2}.;ldkO0000Okdl;.".to_string(),
            "       .;d00xl:^''''''^:ok00d;.".to_string(),
            "     .d00l'                'o00d.".to_string(),
            "   .d0Kd'${1}  Okxol:;,.          ${2}:O0d".to_string(),
            "  .OK${1}KKK0kOKKKKKKKKKKOxo:,      ${2}lKO.".to_string(),
            " ,0K${1}KKKKKKKKKKKKKKK0P^${2},,,${1}^dx:${2}    ;00,".to_string(),
            ".OK${1}KKKKKKKKKKKKKKKk'${2}.oOPPb.${1}'0k.${2}   cKO.".to_string(),
            ":KK${1}KKKKKKKKKKKKKKK: ${2}kKx..dd ${1}lKd${2}   'OK:".to_string(),
            "dKK${1}KKKKKKKKKOx0KKKd ${2}^0KKKO' ${1}kKKc${2}   dKd".to_string(),
            "dKK${1}KKKKKKKKKK;.;oOKx,..${2}^${1}..;kKKK0.${2}  dKd".to_string(),
            ":KK${1}KKKKKKKKKK0o;...^cdxxOK0O/^^'  ${2}.0K:".to_string(),
            " kKK${1}KKKKKKKKKKKKK0x;,,......,;od  ${2}lKk".to_string(),
            " '0K${1}KKKKKKKKKKKKKKKKKKKK00KKOo^  ${2}c00'".to_string(),
            "  'kK${1}KKOxddxkOO00000Okxoc;''   ${2}.dKk'".to_string(),
            "    l0Ko.                    .c00l'".to_string(),
            "     'l0Kk:.              .;xK0l'".to_string(),
            "        'lkK0xl:;,,,,;:ldO0kl'".to_string(),
            "            '^:ldxkkkkxdl:^'".to_string(),
        ],

        Some("macos") => vec![
            "                     ..'".to_string(),
            "                 ,xNMM.".to_string(),
            "               .OMMMMo".to_string(),
            "               lMM\"".to_string(),
            "     .;loddo:.  .olloddol;.".to_string(),
            "   cKMMMMMMMMMMNWMMMMMMMMMM0:".to_string(),
            " ${2}.KMMMMMMMMMMMMMMMMMMMMMMMWd.".to_string(),
            " XMMMMMMMMMMMMMMMMMMMMMMMX.".to_string(),
            "${3};MMMMMMMMMMMMMMMMMMMMMMMM:".to_string(),
            ":MMMMMMMMMMMMMMMMMMMMMMMM:".to_string(),
            "${4}.MMMMMMMMMMMMMMMMMMMMMMMMX.".to_string(),
            " kMMMMMMMMMMMMMMMMMMMMMMMMWd.".to_string(),
            " ${5}'XMMMMMMMMMMMMMMMMMMMMMMMMMMk".to_string(),
            "  'XMMMMMMMMMMMMMMMMMMMMMMMMK.".to_string(),
            "    ${6}kMMMMMMMMMMMMMMMMMMMMMMd".to_string(),
            "     ;KMMMMMMMWXXWMMMMMMMk.".to_string(),
            "       \"cooc*\"    \"*coo'\"".to_string(),
        ],

        Some("windows") => vec![
            "${1}        ,.=:!!t3Z3z.,".to_string(),
            "       :tt:::tt333EE3".to_string(),
            "${1}       Et:::ztt33EEEL${2} @Ee.,      ..,".to_string(),
            "${1}      ;tt:::tt333EE7${2} ;EEEEEEttttt33#".to_string(),
            "${1}     :Et:::zt333EEQ.${2} $EEEEEttttt33QL".to_string(),
            "${1}     it::::tt333EEF${2} @EEEEEEttttt33F".to_string(),
            "${1}    ;3=*^```\"*4EEV${2} :EEEEEEttttt33@.".to_string(),
            "${3}    ,.=::::!t=., ${1}`${2} @EEEEEEtttz33QF".to_string(),
            "${3}   ;::::::::zt33)${2}   \"4EEEtttji3P*".to_string(),
            "${3}  :t::::::::tt33.${4}:Z3z..${2}  ``${4} ,..g.".to_string(),
            "${3}  i::::::::zt33F${4} AEEEtttt::::ztF".to_string(),
            "${3} ;:::::::::t33V${4} ;EEEttttt::::t3".to_string(),
            "${3} E::::::::zt33L${4} @EEEtttt::::z3F".to_string(),
            "${3}{3=*^```\"*4E3)${4} ;EEEtttt:::::tZ`".to_string(),
            "${3}             `${4} :EEEEtttt::::z7".to_string(),
            "                 \"VEzjt:;;z>*`".to_string(),
        ],

        // Fallback: Tux (Linux)
        _ => vec![
            "    ${2}.--.".to_string(),
            "   ${2}|${3}o${2}_${3}o${2} |".to_string(),
            "   ${2}|${3}:${2}_/ |".to_string(),
            "  ${2}//   \\ \\".to_string(),
            " (|     | )".to_string(),
            "/'\\_   _/`\\".to_string(),
            "\\___)=(___/".to_string(),
        ],
    }
}

/// Returns dynamic ANSI color arrays for a given distribution.
pub fn get_distro_colors(distro: Option<&str>) -> Vec<&'static str> {
    let d = distro.map(|s| s.to_lowercase());
    match d.as_deref() {
        Some("arch") => vec!["\x1b[36m", "\x1b[37m"],
        Some("debian") => vec!["\x1b[31m", "\x1b[37m"],
        Some("fedora") => vec!["\x1b[34m", "\x1b[37m"],
        Some("nixos") => vec![
            "\x1b[34m", "\x1b[36m", "\x1b[34m", "\x1b[36m", "\x1b[34m", "\x1b[36m",
        ],
        Some("ubuntu") => vec!["\x1b[33m", "\x1b[31m"],
        Some("pop") => vec!["\x1b[36m", "\x1b[37m"],
        Some("manjaro") => vec!["\x1b[32m"],
        Some("endeavouros") => vec!["\x1b[35m", "\x1b[31m", "\x1b[34m"],
        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => {
            vec!["\x1b[32m", "\x1b[37m"]
        }
        Some("macos") => vec!["\x1b[32m", "\x1b[33m", "\x1b[31m", "\x1b[35m", "\x1b[34m"],
        Some("windows") => vec!["\x1b[36m"],
        _ => vec!["\x1b[30m", "\x1b[37m", "\x1b[33m"], // Tux
    }
}

/// Interpolates placeholders `${1}`...`${9}` or `$1`...`$9` with dynamic ANSI colors and appends a reset at the end.
pub fn get_distro_logo_lines(distro: Option<&str>) -> Vec<String> {
    let raw_lines = get_ascii_logo(distro);
    let colors = get_distro_colors(distro);
    let default_color = colors.first().copied().unwrap_or("\x1b[0m");

    raw_lines
        .into_iter()
        .map(|line| {
            let mut formatted = line;
            for i in 1..=9 {
                let color_val = colors.get(i - 1).copied().unwrap_or("\x1b[0m");
                let placeholder = format!("${{{}}}", i);
                formatted = formatted.replace(&placeholder, color_val);
                let placeholder_short = format!("${}", i);
                formatted = formatted.replace(&placeholder_short, color_val);
            }
            if !formatted.is_empty() {
                format!("{}{}\x1b[0m", default_color, formatted)
            } else {
                formatted
            }
        })
        .collect()
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
        Ok(out) => {
            eprintln!("warning: chafa failed with status: {}", out.status);
            false
        }
        Err(e) => {
            eprintln!("warning: failed to execute chafa: {}", e);
            false
        }
    }
}

/// Attempts to get Chafa output as a list of lines.
pub fn get_chafa_logo_lines(path: &std::path::Path) -> Option<Vec<String>> {
    let output = std::process::Command::new("chafa")
        .arg("--format")
        .arg("symbols")
        .arg("--size")
        .arg("40x20")
        .arg(path)
        .output()
        .ok()?;
    if output.status.success() {
        let content = String::from_utf8_lossy(&output.stdout);
        Some(content.lines().map(|s| s.to_string()).collect())
    } else {
        None
    }
}

/// Print logo for a distro following the strict priority:
/// 1. Real graphic logo (if terminal supports it and embedded logo exists)
/// 2. Chafa high-quality symbols (if chafa is available)
/// 3. Real Fastfetch ASCII logo (always available)
pub fn print_distro_logo(distro: Option<&str>) {
    print_distro_logo_with_ascii(distro, false, false);
}

/// Renders the distribution logo with options to force ASCII or Chafa mode.
///
/// This is the primary entry point for logo rendering, handling the entire
/// priority chain from high-res graphics down to text-based ASCII.
/// - `ascii_only`: skip all graphical protocols and render the ASCII art directly.
/// - `chafa_only`: skip Kitty/iTerm2/Sixel and go straight to Chafa (falls back
///   to ASCII if Chafa is unavailable). `ascii_only` takes precedence.
pub fn print_distro_logo_with_ascii(distro: Option<&str>, ascii_only: bool, chafa_only: bool) {
    if ascii_only {
        // Force ASCII path
        let art = get_distro_logo_lines(distro);
        for line in art {
            println!("{}", line);
        }
        return;
    }

    let has_chafa = chafa_available();

    if !chafa_only {
        let supports_kitty = supports_kitty();
        let supports_iterm2 = supports_iterm2();
        let supports_sixel = supports_sixel();

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
    }

    // 4. Try chafa using embedded distro logo
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

    // 5. Final fallback: Real Fastfetch ASCII logo
    let art = get_distro_logo_lines(distro);
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
        assert!(logo
            .iter()
            .any(|line| line.contains("o${2}_${3}o") || line.contains("o_o")));
    }

    #[test]
    fn test_get_ascii_logo_none() {
        let logo = get_ascii_logo(None);
        assert!(!logo.is_empty());
    }

    static ENV_LOCK: std::sync::Mutex<()> = std::sync::Mutex::new(());

    struct EnvGuard {
        _mutex_guard: std::sync::MutexGuard<'static, ()>,
        old_vars: std::collections::HashMap<&'static str, Option<String>>,
    }

    impl EnvGuard {
        fn new(vars_to_mock: &[&'static str]) -> Self {
            let guard = ENV_LOCK.lock().unwrap();
            let mut old_vars = std::collections::HashMap::new();
            for var in vars_to_mock {
                old_vars.insert(*var, std::env::var(var).ok());
            }
            EnvGuard {
                _mutex_guard: guard,
                old_vars,
            }
        }
    }

    impl Drop for EnvGuard {
        fn drop(&mut self) {
            for (var, value) in &self.old_vars {
                if let Some(val) = value {
                    std::env::set_var(var, val);
                } else {
                    std::env::remove_var(var);
                }
            }
        }
    }

    #[test]
    fn test_supports_kitty_heuristics() {
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);

        // Test TERM=xterm-kitty
        std::env::set_var("TERM", "xterm-kitty");
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::remove_var("TERM_PROGRAM");
        assert!(supports_kitty());

        // Test TERMINAL_EMULATOR=iterm-kitty
        std::env::remove_var("TERM");
        std::env::set_var("TERMINAL_EMULATOR", "iterm-kitty");
        assert!(supports_kitty());

        // Test TERMINAL_EMULATOR=iTerm.app
        std::env::set_var("TERMINAL_EMULATOR", "iTerm.app");
        assert!(supports_kitty());

        // Test TERM_PROGRAM=rio
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::set_var("TERM_PROGRAM", "rio");
        assert!(supports_kitty());

        // Test clear env -> false
        std::env::remove_var("TERM_PROGRAM");
        assert!(!supports_kitty());
    }

    #[test]
    fn test_supports_iterm2_heuristics() {
        let _guard = EnvGuard::new(&["TERM_PROGRAM"]);

        // Test TERM_PROGRAM=iTerm.app
        std::env::set_var("TERM_PROGRAM", "iTerm.app");
        assert!(supports_iterm2());

        // Test TERM_PROGRAM=WezTerm
        std::env::set_var("TERM_PROGRAM", "WezTerm");
        assert!(supports_iterm2());

        // Test TERM_PROGRAM=rio
        std::env::set_var("TERM_PROGRAM", "rio");
        assert!(supports_iterm2());

        // Test TERM_PROGRAM=Apple_Terminal
        std::env::set_var("TERM_PROGRAM", "Apple_Terminal");
        assert!(!supports_iterm2());

        // Test clear env -> false
        std::env::remove_var("TERM_PROGRAM");
        assert!(!supports_iterm2());
    }

    #[test]
    fn test_supports_sixel_heuristics() {
        let _guard = EnvGuard::new(&["TERM", "TERM_PROGRAM", "WT_SESSION"]);

        // Clear all to start fresh
        std::env::remove_var("TERM");
        std::env::remove_var("TERM_PROGRAM");
        std::env::remove_var("WT_SESSION");
        assert!(!supports_sixel());

        // Test TERM=xterm-sixel
        std::env::set_var("TERM", "xterm-sixel");
        assert!(supports_sixel());

        // Test TERM=foot
        std::env::set_var("TERM", "foot");
        assert!(supports_sixel());

        // Test TERM=mlterm (case variations)
        std::env::set_var("TERM", "MLTerm");
        assert!(supports_sixel());

        // Reset TERM, test TERM_PROGRAM=WezTerm
        std::env::remove_var("TERM");
        std::env::set_var("TERM_PROGRAM", "WezTerm");
        assert!(supports_sixel());

        // Test TERM_PROGRAM=iTerm.app
        std::env::set_var("TERM_PROGRAM", "iTerm.app");
        assert!(supports_sixel());

        // Test TERM_PROGRAM=rio
        std::env::set_var("TERM_PROGRAM", "rio");
        assert!(supports_sixel());

        // Reset TERM_PROGRAM, test WT_SESSION
        std::env::remove_var("TERM_PROGRAM");
        std::env::set_var("WT_SESSION", "active");
        assert!(supports_sixel());
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
        let logo = get_embedded_logo(Some("macos"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("windows"));
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

        let macos = get_ascii_logo(Some("macos"));
        assert!(!macos.is_empty());
        assert!(macos
            .iter()
            .any(|line| line.contains("cKMMMMMMMMMMNWMMMMMMMMMM0")));

        let windows = get_ascii_logo(Some("windows"));
        assert!(!windows.is_empty());
        assert!(windows
            .iter()
            .any(|line| line.contains("AEEEtttt::::ztF") || line.contains("tt:::tt333EE3")));
    }
}
