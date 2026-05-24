# retch Development Notes

## Project Overview
- **Name**: retch (published as `retch-cli` on crates.io)
- **Goal**: A fast, feature-rich system information fetcher (Fastfetch-like) written in Rust
- **Key Technologies**: sysinfo, clap, serde, toml, owo-colors, icy_sixel
- **License**: GPLv3
- **Repository**: https://github.com/l1a/retch

## Current State (v0.1.10)
- **Architecture**: Modularized GPU detection into a dedicated component.
- **Visuals**: Added leading newline to output for better separation.
- **Graphical Support**: Robust support for Kitty, iTerm2, and Sixel protocols.
- **Terminal Detection**: Heuristic detection for Rio, foot, WezTerm, iTerm2, and modern VTE-based terminals (with Chafa fallback).
- **Quality**: Strict `just check` (fmt + lint) and expanded unit test coverage to 28 passing tests (with thread-safe environment mocking).
- **CI/CD**: Release binaries compiled in a Fedora container.
- **Documentation**: Full internal Rustdoc coverage and updated README/man pages.
- **Completions**: Shell completion generation for Bash, Zsh, Fish, Nushell, Elvish, and PowerShell.

## Major Achievements

### v0.1.10 - Refined Config Merging & Formatting (May 23, 2026)
- **Refactoring**: Extracted config merge logic into a pure, fully unit-testable function `Config::merge_defaults` inside [config.rs](file:///home/ktobias/git/retch/src/config.rs).
- **Bugfixes**: Resolved merge option bugs where subfields (e.g. `shell`, `terminal`, `desktop`) were incorrectly validated as top-level keys.
- **Formatting**: Replaced raw key-value merged overrides with clean, fully documented default TOML blocks.
- **Testing**: Added unit tests covering all merging configurations (complete configs, partially completed files, and fully commented-out keys).
- **Version**: Bumped version to `0.1.10` in `Cargo.toml` and `docs/retch.1`.

### v0.1.9 - Advanced Testing & Fedora Release Build (May 23, 2026)
- **Testing**: Added unit tests for isolated TOML configuration loading, full custom theme overrides, and hex parsing variants. Implemented a thread-safe environment variable mocking helper (`EnvGuard`) using a static mutex for terminal detection heuristic tests.
- **CI/CD**: Split the release building process in `.github/workflows/rust.yml` to compile the release binary inside a `fedora:latest` container and publish it natively from the host runner.
- **Version**: Bumped project version to `0.1.9` in `Cargo.toml` and `docs/retch.1`.

### v0.1.8 - New Distro Logos & CLI Option (May 23, 2026)
- **Logos**: Sourced and converted SVG/PNG assets and defined colored ASCII art for Pop!_OS, Manjaro, EndeavourOS, and openSUSE.
- **CLI Flag**: Implemented the `--logo` (`-l`) CLI argument and configuration setting to override the detected distro.
- **Documentation**: Updated manual pages (`retch.1`), `README.md`, and project development notes.
- **Testing**: Added unit test coverage for the `--logo` configuration override and the new distro logo definitions.

### v0.1.7 - Quality Assurance & Test Coverage (May 23, 2026)
- **Testing**: Significantly increased unit test coverage across all core modules (GPU, Config, Fetch, Display, Logo, Theme), bringing the total to 19 passing tests.
- **CI/CD**: Optimized GitHub Actions workflow to prevent redundant runs on Pull Requests, improving efficiency.

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

1. **Expansion** — Explore support for other platforms (macOS, Windows).
2. **UX Polish** — Refine error messages.
3. **Integration Testing** — Add automated CLI and config generation integration tests.

---
*Last updated: May 23, 2026*
