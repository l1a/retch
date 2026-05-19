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
  - OS, Kernel, Hostname, Arch
  - CPU (model + cores + frequency)
  - Memory + Swap
  - Uptime, Processes, Load Average
  - Disks, Temperatures, Networks
  - Boot time (ISO + human-readable duration)
  - Battery, Shell, Terminal, Desktop Environment
  - Users count
- Theming system (`default`, `dark`, `light`) with `--list-themes`
- ASCII logo support with basic distro detection
- Full config support (`~/.config/retch/config.toml`)
- CLI options: `--fields`, `--generate-config`, `--write-config`, `--merge-config`
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

1. **Graphical logo support** — Kitty / iTerm inline image protocol
2. **More system information** — GPU, Packages, more detailed hardware info
3. **Enhanced theming** — Custom color overrides, more themes
4. **Documentation & polish** — Improve README, examples, error messages
5. **Release preparation** — Versioning, packaging, crates.io updates

## Important Notes

- We chose `sysinfo` over `libmacchina` for broader data access (especially Swap, Network, Temperatures).
- The original `retch` name was taken on crates.io, so the crate is published as `retch-cli`.
- Users interact with the tool as `retch` (binary + config directory `~/.config/retch/`).
- The project is in early development — currently a working skeleton.

## How to Resume

Just say something like:
> "Continue working on retch"

Current focus areas:
- Graphical logo support (next major feature)
- Additional system information fields
- Polish and release preparation

I should be able to pick up from here using this file + the codebase.