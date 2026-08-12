// SPDX-FileCopyrightText: 2026 Ken Tobias
// SPDX-License-Identifier: GPL-3.0-or-later

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
        Some("mx") => Some(include_bytes!("../assets/logos/mx.png")),
        Some("linuxmint") => Some(include_bytes!("../assets/logos/linuxmint.png")),
        Some("kali") => Some(include_bytes!("../assets/logos/kali.png")),
        Some("zorin") => Some(include_bytes!("../assets/logos/zorin.png")),
        Some("garuda") => Some(include_bytes!("../assets/logos/garuda.png")),
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
        Some("arch") => {
            let logo = include_str!("../assets/logos/arch.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("debian") => {
            let logo = include_str!("../assets/logos/debian.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("fedora") => {
            let logo = include_str!("../assets/logos/fedora.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("nixos") => {
            let logo = include_str!("../assets/logos/nixos.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("ubuntu") => {
            let logo = include_str!("../assets/logos/ubuntu.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("pop") => {
            let logo = include_str!("../assets/logos/pop.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("manjaro") => {
            let logo = include_str!("../assets/logos/manjaro.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("endeavouros") => {
            let logo = include_str!("../assets/logos/endeavouros.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("opensuse") | Some("opensuse-leap") | Some("opensuse-tumbleweed") => {
            let logo = include_str!("../assets/logos/opensuse.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("mx") => {
            let logo = include_str!("../assets/logos/mx.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("linuxmint") => {
            let logo = include_str!("../assets/logos/linuxmint.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("kali") => {
            let logo = include_str!("../assets/logos/kali.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("zorin") => {
            let logo = include_str!("../assets/logos/zorin.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("garuda") => {
            let logo = include_str!("../assets/logos/garuda.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("macos") => {
            let logo = include_str!("../assets/logos/macos.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
        Some("windows") => {
            let logo = include_str!("../assets/logos/windows.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }

        // Fallback: Tux (Linux)
        _ => {
            let logo = include_str!("../assets/logos/tux.txt");
            logo.lines().map(|s| s.to_string()).collect()
        }
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
        Some("mx") => vec!["\x1b[34m", "\x1b[37m"],
        Some("linuxmint") => vec!["\x1b[32m", "\x1b[37m"],
        Some("kali") => vec!["\x1b[34m", "\x1b[37m"],
        Some("zorin") => vec!["\x1b[36m", "\x1b[37m"],
        Some("garuda") => vec!["\x1b[35m", "\x1b[36m"],
        // Grayscale (silver) ramp, matching the modern monochrome Apple logo rather than the
        // legacy rainbow. 256-colour greys (light→medium) read on light and dark terminals.
        Some("macos") => vec![
            "\x1b[38;5;252m",
            "\x1b[38;5;250m",
            "\x1b[38;5;248m",
            "\x1b[38;5;246m",
            "\x1b[38;5;244m",
        ],
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

/// Returns true when the running terminal is Rio.
///
/// Checks `TERM` as well as `TERM_PROGRAM`. `TERM_PROGRAM` alone is not sufficient: it is not
/// in sudo's default `env_keep` list, so `sudo retch` lost Rio's graphics support entirely and
/// silently fell all the way back to Chafa. `TERM` **is** preserved by sudo (`xterm-rio` here),
/// and the same gap affects any launcher that starts retch with a trimmed environment.
fn is_rio_terminal() -> bool {
    if let Ok(term) = std::env::var("TERM") {
        if term == "rio" || term.starts_with("xterm-rio") {
            return true;
        }
    }
    std::env::var("TERM_PROGRAM")
        .map(|t| t == "rio")
        .unwrap_or(false)
}

/// Checks if the terminal supports the Kitty inline image protocol.
pub fn supports_kitty() -> bool {
    std::env::var("TERM")
        .map(|t| t == "xterm-kitty")
        .unwrap_or(false)
        || std::env::var("TERMINAL_EMULATOR")
            .map(|t| t == "iterm-kitty" || t == "iTerm.app")
            .unwrap_or(false)
        || is_rio_terminal()
}

/// Checks if the terminal supports the iTerm2 inline image protocol.
pub fn supports_iterm2() -> bool {
    if let Ok(prog) = std::env::var("TERM_PROGRAM") {
        if prog == "iTerm.app" || prog == "WezTerm" {
            return true;
        }
    }
    is_rio_terminal()
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
        if prog == "WezTerm" || prog == "iTerm.app" {
            return true;
        }
    }

    if std::env::var("WT_SESSION").is_ok() {
        return true;
    }

    is_rio_terminal()
}

/// Maximum width, in terminal columns, that a rendered logo may occupy.
///
/// Widened from 28 so that wide-aspect assets (the horizontal lockups — `fedora.png` is
/// 384×108, i.e. 3.56:1 — plus arch/nixos/ubuntu/tux) get enough rows to stay legible: a
/// logo is fitted *inside* this box preserving aspect, so a narrow box caps a wide image's
/// height long before [`LOGO_MAX_ROWS`] does. At 28 columns the Fedora logo collapsed to 4
/// rows of Chafa symbols and was unreadable.
pub const LOGO_MAX_COLS: usize = 45;

/// Maximum height, in terminal rows, that a rendered logo may occupy.
pub const LOGO_MAX_ROWS: usize = 10;

/// Fits an image into a cell box **preserving its aspect ratio**, returning a [`LogoFit`].
///
/// Both the image and the box are converted to pixels (via the terminal's cell dimensions)
/// so the terminal's non-square cells are accounted for — a 2:1 image in 1:2 cells is 4
/// columns per row, not 2. The result is the smallest cell rectangle that contains the
/// scaled image, clamped to `1..=max`.
///
/// This is the single source of truth for a graphical logo's footprint: the same values feed
/// the protocol escape (so the terminal does not stretch the image) and `plan_layout` (so the
/// text column is placed against the logo's real width). Previously the Kitty path hardcoded
/// `c=26,r=10` — which *forces* the image into that rectangle, ignoring aspect entirely, so
/// the 3.56:1 Fedora logo was squashed into a roughly 1:1 box and rendered ~3× too tall —
/// while the layout separately assumed a fixed 40-column width.
pub fn fit_logo_cells(
    img_w: u32,
    img_h: u32,
    cell_w: usize,
    cell_h: usize,
    max_cols: usize,
    max_rows: usize,
) -> LogoFit {
    let (max_cols, max_rows) = (max_cols.max(1), max_rows.max(1));

    // Degenerate inputs: fall back to the full box rather than dividing by zero.
    if img_w == 0 || img_h == 0 || cell_w == 0 || cell_h == 0 {
        return LogoFit {
            cols: max_cols,
            rows: max_rows,
            width_limited: true,
        };
    }

    let (img_w, img_h) = (u64::from(img_w), u64::from(img_h));
    let box_w = (max_cols * cell_w) as u64;
    let box_h = (max_rows * cell_h) as u64;

    // Compare box_w/img_w against box_h/img_h without floating point: whichever ratio is
    // smaller is the limiting dimension.
    let width_limited = box_w * img_h <= box_h * img_w;
    let (disp_w, disp_h) = if width_limited {
        (box_w, box_w * img_h / img_w) // wide image: touches the sides first
    } else {
        (box_h * img_w / img_h, box_h) // tall image: touches top and bottom first
    };

    LogoFit {
        // `div_ceil` so the reservation is never *smaller* than what gets drawn: an extra
        // blank row or column is harmless, an overlapping one corrupts the layout.
        cols: (disp_w as usize).div_ceil(cell_w).clamp(1, max_cols),
        rows: (disp_h as usize).div_ceil(cell_h).clamp(1, max_rows),
        width_limited,
    }
}

/// The cell footprint of a logo, plus which dimension of the box it touches first.
///
/// `width_limited` matters only to the Kitty emitter — see [`kitty_placement_spec`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct LogoFit {
    /// Width in terminal columns.
    pub cols: usize,
    /// Height in terminal rows.
    pub rows: usize,
    /// True when the image reaches the box's width before its height (a wide image).
    pub width_limited: bool,
}

/// Builds the Kitty graphics-protocol placement keys (`c=` / `r=`) for a fitted logo.
///
/// Deliberately emits **only the limiting dimension**. Kitty derives the other from the
/// image's real aspect ratio, whereas specifying both makes it scale each axis independently
/// to fill the rectangle exactly — and because cells are indivisible, the rounded rectangle is
/// never quite the image's aspect, so passing both leaves a residual stretch even when the
/// numbers are computed correctly (measured at 9% for the Fedora logo). Passing one leaves
/// none.
///
/// The reservation [`plan_layout`](crate::display) makes is `div_ceil`-rounded and therefore
/// always covers what Kitty then draws.
pub fn kitty_placement_spec(fit: LogoFit) -> String {
    if fit.width_limited {
        format!("c={}", fit.cols)
    } else {
        format!("r={}", fit.rows)
    }
}

/// Returns the terminal cell size in pixels as `(width, height)` via `TIOCGWINSZ`.
///
/// Falls back to a 10×20 cell — the conventional default — when the terminal does not report
/// pixel dimensions (tmux, many terminals, and any non-TTY stdout).
pub fn terminal_cell_size_px() -> (usize, usize) {
    #[cfg(unix)]
    {
        use std::mem::MaybeUninit;
        let mut ws: libc::winsize = unsafe { MaybeUninit::zeroed().assume_init() };
        // SAFETY: `ws` is a live, zeroed `winsize` and TIOCGWINSZ writes exactly that type.
        let ret = unsafe { libc::ioctl(libc::STDOUT_FILENO, libc::TIOCGWINSZ, &mut ws) };
        if ret == 0 && ws.ws_row > 0 && ws.ws_col > 0 && ws.ws_xpixel > 0 && ws.ws_ypixel > 0 {
            return (
                ws.ws_xpixel as usize / ws.ws_col as usize,
                ws.ws_ypixel as usize / ws.ws_row as usize,
            );
        }
    }
    (10, 20)
}

/// Returns the cell footprint an image will occupy on the current terminal.
///
/// Thin wrapper pairing [`terminal_cell_size_px`] with the pure [`fit_logo_cells`].
pub fn logo_cells_for(img_w: u32, img_h: u32) -> LogoFit {
    let (cell_w, cell_h) = terminal_cell_size_px();
    fit_logo_cells(img_w, img_h, cell_w, cell_h, LOGO_MAX_COLS, LOGO_MAX_ROWS)
}

/// The `--size WxH` argument passed to `chafa`, derived from the shared logo cell box.
///
/// Chafa fits the image *inside* this box preserving aspect ratio, so this is a maximum in
/// both dimensions rather than a target — a wide logo comes back short, a tall one narrow.
pub fn chafa_size_arg() -> String {
    format!("{LOGO_MAX_COLS}x{LOGO_MAX_ROWS}")
}

static CHAFA_SUPPORTS_PROBE: std::sync::OnceLock<bool> = std::sync::OnceLock::new();

/// Checks if the `chafa` command-line tool supports the `--probe` option.
pub fn chafa_supports_probe() -> bool {
    *CHAFA_SUPPORTS_PROBE.get_or_init(|| {
        std::process::Command::new("chafa")
            .args(["--probe", "off", "--version"])
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    })
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
    let mut cmd = std::process::Command::new("chafa");
    cmd.arg("--format")
        .arg("symbols")
        .arg("--size")
        .arg(chafa_size_arg());

    if chafa_supports_probe() {
        cmd.arg("--probe").arg("off");
    }

    let output = cmd.arg(path).output();

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
    let mut cmd = std::process::Command::new("chafa");
    cmd.arg("--format")
        .arg("symbols")
        .arg("--size")
        .arg(chafa_size_arg());

    if chafa_supports_probe() {
        cmd.arg("--probe").arg("off");
    }

    let output = cmd.arg(path).output().ok()?;
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

    let (width, height) = image::load_from_memory(image_data)
        .map(|img| (img.width(), img.height()))
        .unwrap_or((0, 0));

    let encoded = base64::engine::general_purpose::STANDARD.encode(image_data);

    // `width`/`height` are in character cells here; `preserveAspectRatio=1` makes them a
    // bounding box rather than a target, so the image is never distorted. Passing both (not
    // just `height`) keeps the drawn footprint inside the width `plan_layout` reserved.
    if width > 0 && height > 0 {
        let fit = logo_cells_for(width, height);
        print!(
            "\x1b]1337;File=inline=1;width={};height={};preserveAspectRatio=1:{}\x07",
            fit.cols, fit.rows, encoded
        );
    } else {
        print!(
            "\x1b]1337;File=inline=1;height={};preserveAspectRatio=1:{}\x07",
            LOGO_MAX_ROWS, encoded
        );
    }
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
        // Kitty *forces* the image into whatever placement rectangle it is given, so the
        // spec carries only the limiting dimension and lets Kitty derive the other from the
        // image's aspect ratio. The old hardcoded `c=26,r=10` is what squashed the 3.56:1
        // Fedora logo into a roughly 1:1 box.
        let spec = kitty_placement_spec(logo_cells_for(width, height));
        println!(
            "\x1b_Gf=100,s={},v={},{},a=T;{}\x1b\\",
            width, height, spec, encoded
        );
    } else {
        println!("\x1b_Gf=100,a=T;{}", encoded);
    }
}

/// Renders a raw image buffer (e.g. PNG bytes) using the Sixel graphics protocol.
#[cfg(feature = "graphics")]
pub fn print_sixel_logo(image_data: &[u8]) {
    if let Ok(img) = image::load_from_memory(image_data) {
        // Size the sixel to the same cell box the layout reserved, in pixels. `resize` already
        // preserves aspect ratio (it fits within the box), so this only ever shrinks the image
        // to the footprint `plan_layout` was told about.
        let fit = logo_cells_for(img.width(), img.height());
        let (cell_w, cell_h) = terminal_cell_size_px();
        let resized = img.resize(
            (fit.cols * cell_w) as u32,
            (fit.rows * cell_h) as u32,
            image::imageops::FilterType::Triangle,
        );
        let rgba = resized.to_rgba8();
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
        // TERM must be guarded and cleared as well as TERM_PROGRAM: `supports_iterm2` consults
        // it via `is_rio_terminal`, so without this the *host's* TERM leaks in and the negative
        // assertions below fail on a Rio box while passing everywhere else.
        let _guard = EnvGuard::new(&["TERM", "TERM_PROGRAM"]);
        std::env::remove_var("TERM");

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
        let logo = get_embedded_logo(Some("mx"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("linuxmint"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("kali"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("zorin"));
        assert!(logo.is_some());
        let logo = get_embedded_logo(Some("garuda"));
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

        let mx = get_ascii_logo(Some("mx"));
        assert!(!mx.is_empty());
        assert!(mx
            .iter()
            .any(|line| line.contains("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMMMMMMMM")));

        let linuxmint = get_ascii_logo(Some("linuxmint"));
        assert!(!linuxmint.is_empty());
        assert!(linuxmint.iter().any(|line| line.contains("oOOOOOOOOOOo")));

        let kali = get_ascii_logo(Some("kali"));
        assert!(!kali.is_empty());
        assert!(kali.iter().any(|line| line.contains(":ccc")));

        let zorin = get_ascii_logo(Some("zorin"));
        assert!(!zorin.is_empty());
        assert!(zorin
            .iter()
            .any(|line| line.contains("osssssssssssssssssssso")));

        let garuda = get_ascii_logo(Some("garuda"));
        assert!(!garuda.is_empty());
        assert!(garuda.iter().any(|line| line.contains("888:8898898")));
    }

    // ── Rio detection (TERM as well as TERM_PROGRAM) ──────────────────────────

    #[test]
    fn test_rio_detected_from_term_when_term_program_is_absent() {
        // The sudo case: `env_reset` keeps TERM but drops TERM_PROGRAM, which used to cost
        // Rio all graphics support and fall through to Chafa.
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);
        std::env::remove_var("TERM_PROGRAM");
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::set_var("TERM", "xterm-rio");

        assert!(is_rio_terminal());
        assert!(supports_kitty());
        assert!(supports_iterm2());
        assert!(supports_sixel());
    }

    #[test]
    fn test_rio_still_detected_from_term_program() {
        // The pre-existing path must keep working when TERM says nothing useful.
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);
        std::env::remove_var("TERMINAL_EMULATOR");
        std::env::set_var("TERM", "xterm-256color");
        std::env::set_var("TERM_PROGRAM", "rio");

        assert!(is_rio_terminal());
        assert!(supports_kitty());
    }

    #[test]
    fn test_non_rio_term_is_not_matched() {
        // Guard against a loose substring match: these must not be taken for Rio.
        let _guard = EnvGuard::new(&["TERM", "TERMINAL_EMULATOR", "TERM_PROGRAM"]);
        std::env::remove_var("TERM_PROGRAM");
        std::env::remove_var("TERMINAL_EMULATOR");
        for term in ["xterm-256color", "screen", "linux", "rioja"] {
            std::env::set_var("TERM", term);
            assert!(!is_rio_terminal(), "{term} should not be detected as Rio");
        }
    }

    // ── fit_logo_cells ────────────────────────────────────────────────────────

    #[test]
    fn test_fit_logo_cells_preserves_aspect_for_wide_image() {
        // fedora.png is 384x108 (3.56:1). In 10x20px cells a 45x10 box is 450x200px, so the
        // image is width-limited: 450px wide -> 450*108/384 = 126px tall -> 7 rows.
        // The old hardcoded c=26,r=10 forced it into 260x200px, a ~3x vertical stretch.
        let fit = fit_logo_cells(384, 108, 10, 20, 45, 10);
        assert_eq!(fit.cols, 45);
        assert_eq!(fit.rows, 7);
        assert!(fit.width_limited);
        // A wide image is pinned by width, so Kitty is told the width and derives the height.
        assert_eq!(kitty_placement_spec(fit), "c=45");
    }

    #[test]
    fn test_fit_logo_cells_preserves_aspect_for_tall_image() {
        // debian.png is 291x384 (0.76:1) — height-limited, so it must not claim the full width.
        let fit = fit_logo_cells(291, 384, 10, 20, 45, 10);
        assert_eq!(fit.rows, 10);
        assert!(
            fit.cols < 45,
            "tall image should not fill the width, got {}",
            fit.cols
        );
        assert!(!fit.width_limited);
        assert_eq!(kitty_placement_spec(fit), "r=10");
    }

    #[test]
    fn test_fit_logo_cells_accounts_for_non_square_cells() {
        // A square image in 1:2 cells must come back twice as wide as it is tall, otherwise
        // it renders visibly squashed. Same image, square cells, stays square.
        let fit = fit_logo_cells(256, 256, 10, 20, 45, 10);
        assert_eq!((fit.cols, fit.rows), (20, 10));
        let sq = fit_logo_cells(256, 256, 10, 10, 45, 10);
        assert_eq!((sq.cols, sq.rows), (10, 10));
    }

    #[test]
    fn test_fit_logo_cells_never_exceeds_the_box() {
        // Whatever the aspect, the result must fit the budget plan_layout was given.
        for (w, h) in [(384, 108), (291, 384), (256, 256), (4000, 3), (3, 4000)] {
            let fit = fit_logo_cells(w, h, 10, 20, 45, 10);
            assert!((1..=45).contains(&fit.cols), "{w}x{h} -> {} cols", fit.cols);
            assert!((1..=10).contains(&fit.rows), "{w}x{h} -> {} rows", fit.rows);
        }
    }

    #[test]
    fn test_fit_logo_cells_handles_degenerate_input() {
        // Unreadable image dimensions or a terminal reporting zero-size cells must not panic
        // or divide by zero.
        for fit in [
            fit_logo_cells(0, 0, 10, 20, 45, 10),
            fit_logo_cells(384, 108, 0, 20, 45, 10),
            fit_logo_cells(384, 108, 10, 0, 45, 10),
        ] {
            assert_eq!((fit.cols, fit.rows), (45, 10));
        }
    }

    #[test]
    fn test_chafa_size_arg_matches_the_shared_box() {
        // Chafa and the graphical protocols must budget the same footprint.
        assert_eq!(chafa_size_arg(), format!("{LOGO_MAX_COLS}x{LOGO_MAX_ROWS}"));
        assert_eq!(chafa_size_arg(), "45x10");
    }
}
