# retch Development Notes

## Project Overview
- **Name**: retch (published as `retch-cli` on crates.io)
- **Goal**: A fast, feature-rich system information fetcher (Fastfetch-like) written in Rust
- **Key Technologies**: sysinfo, clap, serde, toml, owo-colors, icy_sixel
- **License**: GPLv3
- **Repository**: https://github.com/l1a/retch

## Development Guidelines
- **Man Pages**: Do NOT edit `docs/retch.1` directly. It is generated from `docs/retch.1.md` using pandoc via the `just man` command. The version number in the man page is dynamically extracted from `Cargo.toml`. Always run `just man` after updating the package version.
- **Quality & Linting**: Use `just check` to run formatting (`cargo fmt -- --check`) and linting (`cargo clippy -- -D warnings`) checks locally before committing. This matches the checks performed in the CI/CD pipeline.
- **Benchmarking**: Use `just bench` for criterion micro-benchmarks, `just bench-cli` for hyperfine timing of the release binary, and `just bench-compare` to compare against fastfetch/neofetch. CI automatically tracks benchmark trends on pushes to `main` via GitHub Pages.

## Current State (v0.2.5)
- **Parallelization**: Core fetching pipeline executes slow queries (GPU, packages, IPs, active interface) concurrently using scoped threads.
- **Benchmarking**: Criterion micro-benchmarks for core subsystems, hyperfine CLI recipes for cross-tool comparison, and continuous benchmarking CI with GitHub Pages dashboard.
- **Architecture**: Modularized GPU detection into a dedicated component.
- **Visuals**: Added leading newline to output for better separation.
- **Graphical Support**: Robust support for Kitty, iTerm2, and Sixel protocols.
- **Terminal Detection**: Heuristic detection for Rio, foot, WezTerm, iTerm2, and modern VTE-based terminals (with Chafa fallback).
- **Quality**: Strict `just check` (fmt + lint), unit test coverage (31 passing tests), and automated CLI integration test suite (6 tests).
- **CI/CD**: Multi-platform build/testing on Linux (Fedora & Ubuntu), macOS, and Windows. Releases compiled for Fedora (x86_64/ARM), macOS (ARM), and Windows (x86_64/ARM) on native host/container runner environments.
- **Documentation**: Full internal Rustdoc coverage and updated README/man pages.
- **Completions**: Shell completion generation for Bash, Zsh, Fish, Nushell, Elvish, and PowerShell.
- **UX**: Improved error visibility for slow external queries (GPU detection, RPM packages, chafa).
- **Battery**: Added time remaining, health, vendor/model, and improved formatting.
- **Network**: Added local IPv4 and larger-scoped IPv6 address display for all "Up" interfaces with loopback and link-local filtering.

## Major Achievements

### v0.2.5 - Concurrent System Info Fetching (May 26, 2026)
- **Parallelization**: Refactored the core system info fetching pipeline to execute slow external processes and queries (GPU detection, package counting, local/public IP resolving, and active network interface detection) concurrently using scoped threads (`std::thread::scope`).
- **Performance**: Boosted CLI responsiveness, reducing overall rendering blockages from sequential external calls.
- **Version**: Bumped version to `0.2.5` in `Cargo.toml`, `docs/retch.1`, and `AGENTS.md`.

### v0.2.4 - Multi-Arch CI/CD and Release (May 25, 2026)
- **CI/CD Matrix**: Expanded GitHub Actions workflow to run debug builds and tests across 7 platform architectures: Ubuntu x86_64/ARM, Fedora x86_64/ARM, macOS ARM, and Windows x86_64/ARM.
- **Toolchain Updates**: Integrated `dtolnay/rust-toolchain` to dynamically resolve latest stable compilers across all host environments.
- **Releases**: Optimized release compilation pipeline to package and publish 5 targeted binary assets (`retch-linux-x86_64`, `retch-linux-arm64`, `retch-macos-arm64`, `retch-windows-x86_64.exe`, and `retch-windows-arm64.exe`) directly into GitHub Releases.
- **Version**: Bumped version to `0.2.4` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.1 - Windows Support (May 24, 2026)
- **Platforms**: Added native Windows support.
- **Logos**: Added high-resolution transparent Windows PNG/SVG logos and modern block ASCII Windows logo.
- **GPUs**: Implemented Windows-specific GPU/VRAM detection using `wmic` with `powershell` fallback.
- **Packages**: Implemented Windows package counting for Scoop and Chocolatey.
- **CI/CD**: Expanded GitHub Actions workflow matrix to test on Linux, macOS, and Windows-latest.
- **Version**: Bumped version to `0.2.1` in `Cargo.toml` and `docs/retch.1`.

### v0.2.0 - macOS Support (May 24, 2026)
- **Platforms**: Added native macOS support (Darwin).
- **Logos**: Added high-resolution transparent white PNG and multi-colored ASCII Apple logos for macOS.
- **GPUs**: Implemented macOS-specific GPU detection using `system_profiler SPDisplaysDataType` alongside a VRAM size parser.
- **Packages**: Implemented macOS package counting for Homebrew (formulae and casks) and MacPorts.
- **CI/CD**: Expanded GitHub Actions workflow to run the build, clippy, formatting, and test suites on both Linux and macOS.
- **Version**: Bumped version to `0.2.0` in `Cargo.toml` and `docs/retch.1`.

### v0.1.11 - CLI Integration Testing (May 23, 2026)
- **Testing**: Added an automated CLI integration test suite in [tests/cli_tests.rs](file:///home/ktobias/git/retch/tests/cli_tests.rs) running the compiled binary.
- **Coverage**: Verified exit statuses and stdout text structures for `--help`, `--version`, `--list-themes`, `--print-logos`, `--generate-config`, and custom path configuration writing `--write-config <temp_file>`.
- **Version**: Bumped version to `0.1.11` in `Cargo.toml` and `docs/retch.1`.

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

1. **Expansion** — Explore support for other platforms (e.g., BSDs, Android/Termux).
2. **UX Polish** — Refine error messages and performance of slow platform queries.

---
*Last updated: May 26, 2026*
