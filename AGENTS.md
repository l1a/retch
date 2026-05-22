# retch Development Notes

## Project Overview
- **Name**: retch (published as `retch-cli` on crates.io)
- **Goal**: A fast, feature-rich system information fetcher (Fastfetch-like) written in Rust
- **Key Technologies**: sysinfo, clap, serde, toml, owo-colors, icy_sixel
- **License**: GPLv3
- **Repository**: https://github.com/l1a/retch

## Current State (v0.1.6)
- **Architecture**: Modularized GPU detection into a dedicated component.
- **Visuals**: Added leading newline to output for better separation.
- **Graphical Support**: Robust support for Kitty, iTerm2, and Sixel protocols.
- **Terminal Detection**: Heuristic detection for Rio, foot, WezTerm, iTerm2, and modern VTE-based terminals (with Chafa fallback).
- **Quality**: Strict `just check` (fmt + lint) and comprehensive unit tests.
- **Documentation**: Full internal Rustdoc coverage and updated README/man pages.
- **Completions**: Shell completion generation for Bash, Zsh, Fish, Nushell, Elvish, and PowerShell.

## Major Achievements

### v0.1.6 - Refactoring & Modularity (May 22, 2026)
- **Architecture**: Refactored GPU detection into a standalone `gpu` module for better maintainability and reusability.

### v0.1.5 - UI Polish & Hardware Detection (May 22, 2026)
- **Output**: Added leading newline before logo or system info for better visual clarity.
- **GPU**: Improved AMD GPU recognition by mapping codenames (e.g., Phoenix1, Rembrandt) to marketing names (e.g., Radeon 780M, 680M).

### v0.1.4 - Enhanced Graphical Support (May 20, 2026)
- **Sixel**: Integrated `icy-sixel` (pure Rust) for high-performance Sixel rendering.
- **iTerm2**: Implemented the iTerm2 Inline Image protocol (`OSC 1337`).
- **Detection**: Refined heuristics to prioritize Kitty -> iTerm2 -> Sixel -> Chafa -> ASCII.
- **Quality**: Renovated all internal source files with comprehensive Rustdoc comments.
- **Justfile**: Added strict `check` recipe to match GitHub CI requirements.

### v0.1.3 - Shell Completions (May 20, 2026)
- Added `clap_complete` and `clap_complete_nushell`.
- Implemented `--completions <SHELL>` flag supporting all major shells.
- Improved CI/CD with strict linting on every push.

### v0.1.2 - Multi-GPU & PCI ID Lookup (May 20, 2026)
- **Multi-GPU**: Refactored detection to support multiple graphics cards.
- **PCI ID Lookup**: Implemented manual parser for `/usr/share/hwdata/pci.ids` for accurate naming.
- **NVIDIA/AMD**: Added specific model extraction from `/proc` and VRAM detection.

### v0.1.1 - crates.io Preparation (May 2025)
- Released `retch-cli` v0.1.1 with improved crate descriptions.
- Established automated GitHub Release workflow.

### Initial Development (May 2025)
- **Theming**: Major overhaul with hex color support, community themes (Catppuccin, Solarized), and "auto" system theme detection.
- **Output Modes**: Added `--short` and `--long` modes.
- **Logo System**: Implemented priority rendering: Real PNG -> Chafa -> ASCII.
- **Core Info**: Implemented OS, Kernel, CPU (cores/freq), Memory, Swap, Uptime, Disks, Temps, Net, Packages.

## Dependencies (Cargo.toml)
- `sysinfo` — System information gathering
- `clap` — CLI argument parsing
- `serde` + `toml` — Configuration
- `owo-colors` — Truecolor/RGB terminal coloring
- `icy_sixel` — Pure Rust Sixel encoding
- `image` + `base64` — Graphical logo processing
- `rusqlite` — RPM package counting
- `chrono` — Date/time formatting

## Next Steps

1. **More Distros** — Add support and high-res logos for Pop!_OS, Manjaro, EndeavourOS, openSUSE, etc.
2. **Expansion** — Explore support for other platforms (macOS, Windows).
3. **Advanced Testing** — Increase coverage for config merging, theming overrides, and terminal detection logic.
4. **UX Polish** — Refine error messages and configuration generation.

---
*Last updated: May 20, 2026*
