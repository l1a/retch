# retch Development Notes

## Project Overview
- **Name**: retch (published as `retch-cli` on crates.io)
- **Goal**: A fast, feature-rich system information fetcher (Fastfetch-like) written in Rust
- **Key Technologies**: sysinfo, clap, serde, toml, colored/owo-colors
- **License**: GPLv3
- **Repository**: https://github.com/l1a/retch

## Current State (as of latest session)

### Dependencies (Cargo.toml)
- `sysinfo = "0.33"` — System information gathering
- `clap = { version = "4.5", features = ["derive"] }` — CLI argument parsing
- `serde` + `toml` — Configuration
- `colored` + `owo-colors` — Terminal coloring
- `dirs` — Config directory handling
- `anyhow` — Error handling
- `chrono = "0.4"` — Date/time formatting for boot time
- `rusqlite` (bundled) — RPM package counting
- Optional graphics support: `image` + `base64` (behind `graphics` feature)

### Module Structure
- `main.rs` — Entry point + CLI special commands
- `lib.rs` — Module declarations
- `cli.rs` — Full CLI with many options
- `config.rs` — Config loading + CLI merge logic
- `fetch.rs` — Rich SystemInfo struct
- `display.rs` — Formatted + field-filtered display
- `logo.rs` — ASCII logo support
- `theme.rs` — Theming system

### Current Features Implemented
- Rich system information:
  - OS, Kernel, Hostname, Arch, **Current User**
  - CPU (model + cores + frequency) + **CPU Freq**
  - **GPU** detection
  - Memory + Swap
  - **Improved Uptime** (human-readable + ISO boot time)
  - Processes, Load Average
  - **Disks with filesystem type** (btrfs, ext4, etc.)
  - Temperatures, **Networks** (Up/Down status + RX/TX volume + color)
  - Boot time (ISO + human-readable duration)
  - Battery, Shell, Terminal, Desktop Environment
  - **Interactive users count** (UID >= 1000)
  - **Package count** (pacman, dpkg, RPM via SQLite)
- Theming system (`default`, `dark`, `light`) with `--list-themes`
- **Improved ASCII logos** + `--list-logos` command
- Graphical logo support (Kitty protocol + image loading via `chafa`-style)
- Full config support (`~/.config/retch/config.toml`)
- CLI options: `--fields`, `--generate-config`, `--write-config`, `--merge-config`, `--list-logos`
- Field selection (config + CLI)
- Smart config merging
- Clean right-aligned formatted display
- Boot time formatted with `chrono`

### Design Goals
- Support **ASCII** and **graphical logos** (Kitty / iTerm inline image protocol)
- Theming with several default themes
- Config file support (`~/.config/retch/config.toml`)
- Output modes: short, long, custom (via config)
- Highly readable output
- As feature-rich as Fastfetch

## Next Steps (Recommended Order)

1. **Enhanced theming** — Custom color overrides, more themes
2. **Documentation & polish** — Improve README, examples, help text, man page
3. **Release preparation** — Versioning, changelog, packaging, crates.io updates
4. **Optional**: Explore colorful logo support (chafa-style) for more visual appeal

## Important Notes

- We chose `sysinfo` over `libmacchina` for broader data access (especially Swap, Network, Temperatures).
- The original `retch` name was taken on crates.io, so the crate is published as `retch-cli`.
- Users interact with the tool as `retch` (binary + config directory `~/.config/retch/`).
- The project is in early development — currently a working skeleton.

## How to Resume

Just say something like:
> "Continue working on retch"

Current focus areas:
- Enhanced theming
- Documentation & polish (README, examples, help)
- Release preparation (versioning, changelog, packaging)

I should be able to pick up from here using this file + the codebase.

---

## Session Update - May 2025

### Progress Made

- **Logo System Overhaul**
  - Implemented strict priority rendering: Real graphic PNG → Chafa (high-quality symbols) → Real Fastfetch ASCII
  - All supported distros (Arch, Debian, Fedora, NixOS, Ubuntu) + Tux now follow the same fallback chain
  - Converted real SVG logos to high-resolution PNGs (384px) and embedded them via `include_bytes!`
  - Original `.svg` files are preserved in `assets/logos/` for future use

- **CLI Improvements**
  - Added `--ascii-only` flag that forces ASCII logos (bypasses graphics and chafa)
  - Renamed `--list-logos` → `--print-logos` (shows actual logos)
  - Added `--list-distros` (simple list of known distros)
  - Tux is now properly demonstrated in `--print-logos`

- **Developer Experience**
  - Created `Justfile` with common tasks:
    - `just build`, `just test`, `just lint`, `just fmt`
    - `just logos` — regenerates PNGs from SVGs
    - `just install`, `just clean`, `just dev`

- **Code Quality**
  - Centralized logo logic in `print_distro_logo()` and `print_distro_logo_with_ascii()`
  - All changes committed and pushed

### Current State

- Real embedded logos work in Kitty/iTerm2
- Chafa integration works on other terminals when available
- `--ascii-only` provides a reliable fallback
- All distros (including unknown → Tux) follow the same rendering priority

### Next Steps (Updated)

1. **Enhanced theming** — Custom color overrides, more themes
2. **Documentation & polish** — Improve README, examples, help text, man page
3. **Release preparation** — Versioning, changelog, packaging, crates.io updates
4. **Optional**: Explore colorful logo support or sixel protocol
5. **Optional**: Add support for more distros in the embedded logo set

---

*End of update*

---

## Session Update - Late May 2025 (Major Theming + Polish Phase)

### Progress Made

- **Theming System Overhaul (Major Work)**
  - Expanded `Theme` struct with `title_color` and `separator_color`
  - Added `parse_color()` with support for named colors + hex values (e.g. `"#89b4fa"`)
  - Added full support for custom themes via `[custom_theme]` section in config
  - Implemented `Theme::with_custom_overrides()` and `detect_system_theme()`
  - Added `theme = "auto"` to automatically follow system dark/light preference (via GTK settings)
  - Made `auto` the default behavior when no theme is specified
  - Added many new built-in themes:
    - Catppuccin Latte, Frappe, Macchiato, Mocha
    - Solarized Light and Dark
  - Renamed the old "default" theme to `"neutral"` (kept backward compatibility)
  - Added `--list-themes` command
  - Added `--print-theme-template` to output a ready-to-use custom theme example

- **CLI Improvements**
  - Added `--short` and `--long` output modes with proper field filtering
  - Short mode: OS, Kernel, Host, CPU, GPU, Memory, Disk
  - Default mode: OS, Kernel, Host, CPU, GPU, Memory, Swap, Load, Disk, Net, Uptime
  - Long mode: Everything
  - `--ascii-only` flag now fully functional

- **Documentation & Polish**
  - Major README overhaul with better structure, features, installation, usage, and examples
  - Added fun note: *"This project was 100% vibe coded using Grok. Real programmers are welcome."*
  - Man page (`docs/retch.1.md`) significantly expanded with theming documentation
  - Default config template updated with theme examples and output mode comments

- **Release & CI Automation**
  - Added `full-test` job that runs on version tags (`v*`)
  - Full test runs on both **Ubuntu** and **Fedora** (via containers)
  - Includes: Release build, `--all-features` tests, Clippy, Format check, Man page generation
  - Added `release` job that automatically creates a GitHub Release with:
    - Release binary
    - Man page
    - Source tarball
    - Auto-generated release notes

- **Testing**
  - Added unit tests for `Theme` module (neutral, dark, light, etc.)
  - Added unit tests for logo selection logic

- **Developer Experience**
  - Improved Justfile with man page generation and `install-man` support
  - Better default config examples

### Current State

- Theming system is now quite mature and flexible
- Release process is largely automated
- Documentation is in good shape (README + Man page)
- Core CLI features are solid
- Project is in a releasable state

### Next Steps (Updated Priority)

1. **More Distros** — Add logos and support for additional distributions (Pop!_OS, Manjaro, EndeavourOS, openSUSE, etc.)
2. **Release Polish** — Multi-platform binaries, better artifact naming, checksums, version handling
3. **Shell Completions** — Add Bash/Zsh/Fish completions
4. **Sixel Support** (optional) — Alternative graphical output method
5. **Expand Testing** — More coverage, especially around config merging and theming

---

*End of update*