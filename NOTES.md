# retch-cli Development Notes

## Project Overview
- **Name**: retch-cli
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
- Optional graphics support: `image` + `base64` (behind `graphics` feature)

### Module Structure
- `main.rs` — Entry point
- `lib.rs` — Module declarations
- `cli.rs` — CLI definition with `OutputMode` (Short/Long/Custom)
- `config.rs` — Config struct + loading skeleton
- `fetch.rs` — SystemInfo struct using sysinfo
- `display.rs` — Basic display implementation
- `logo.rs` — Placeholder for ASCII + graphical logo support

### Current Features Implemented
- Basic CLI with clap (`--mode`, `--theme`, `--config`, `--no-logo`, `--ascii-only`)
- System information collection:
  - OS name/version
  - Kernel version
  - Hostname
  - CPU model
  - Memory usage
  - Uptime
- Very basic display output
- Placeholder theming and logo system
- Compiles cleanly

### Design Goals
- Support **ASCII** and **graphical logos** (Kitty / iTerm inline image protocol)
- Theming with several default themes
- Config file support (`~/.config/retch-cli/config.toml`)
- Output modes: short, long, custom (via config)
- Highly readable output
- As feature-rich as Fastfetch

## Next Steps (Recommended Order)

1. **Expand SystemInfo** — Add more fields (GPU, Disks, Battery, Packages, Desktop Environment, Window Manager, Shell, Terminal, etc.)
2. **Implement theming system** — Create a `theme.rs` module with structs for colors and layout
3. **Logo system** — ASCII logos + Kitty/iTerm graphics support
4. **Config loading** — Full TOML config with field selection and theme choice
5. **Improve display** — Better formatting, alignment, colors
6. **Add more CLI options** — e.g. `--list-themes`, `--generate-config`

## Important Notes

- We chose `sysinfo` over `libmacchina` for broader data access (especially Swap, Network, Temperatures).
- The original `retch` name was taken on crates.io, so we switched to `retch-cli`.
- A placeholder `retch-cli` v0.1.0 has already been published.
- The project is in early development — currently a working skeleton.

## How to Resume

Just say something like:
> "Continue working on retch-cli"

I should be able to pick up from here using this file + the codebase.