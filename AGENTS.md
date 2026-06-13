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
- **Verification Routine**: Before proposing a push or Pull Request, always verify:
  1. All new and existing unit/integration tests cover changes.
  2. All documentation is kept in sync with the current features.
  3. Default configuration templates (like `default_config_content()` in `src/main.rs`) and comment lists are fully updated with new options.
  4. If the GitHub wiki exists, clone it (`https://github.com/l1a/retch.wiki.git`) and update any affected pages before submitting the PR.
- **PR Test Plans**: After opening a PR, immediately run each item in the test plan checklist and update the PR body via `gh pr edit` to check off passed items. Do not leave all boxes unchecked. Items requiring manual human verification (e.g. runtime output) should be left unchecked with a note.
- **Documentation & Versioning Updates**: When branching to make changes, ensure the following updates are performed:
  - **Version Bump**: Increment the version in `Cargo.toml`, verify compilation, and run `cargo check` to update `Cargo.lock`.
  - **Man Pages**: Update `docs/retch.1.md` with new parameters/fields and run `just man` to rebuild `docs/retch.1`.
  - **README**: Add new features, command examples, or configuration keys to `README.md`.
  - **Roadmap & History**: Update `AGENTS.md` by bumping the version in the "Current State" header and adding a new release log entry under "Major Achievements".
  - **GitHub Wiki**: Clone (`https://github.com/l1a/retch.wiki.git`) and update the corresponding wiki pages (`Configuration-and-Theming.md`, `Workspace-Architecture.md`, `Home.md`) for any changes to configuration parameters, workspace structure, or major features. Push the wiki update before or alongside the PR.
  - **Bumping Strategy**: If the changes are significant (e.g. new subcrates, breaking CLI changes, major architectural redesigns), ALWAYS ask the user whether to perform a major, minor, or patch version bump.
- **Command Redundancy**: Avoid running `just check && cargo test` sequentially since both build and check the project profiles, causing redundant background compilation cycles. Prefer `cargo test` during iteration and a final check before staging.
- **Benchmarking**: Use `just bench` for criterion micro-benchmarks, `just bench-cli` for hyperfine timing of the release binary, and `just bench-compare` to compare against fastfetch/neofetch. CI automatically tracks benchmark trends on pushes to `main` via GitHub Pages. Use `just bench-upload` to manually push local benchmark results to the dashboard; a `post-merge` hook installed via `just install-hooks` does this automatically after every merge to main. Local results appear as a "Local - &lt;platform&gt; (real hardware)" suite alongside the CI suites. The CI suites run in Docker containers with no physical hardware and are primarily useful for retch's own regression tracking, not for comparing against fastfetch.
- **Releases & Tagging**: Releases are triggered by pushing a `v*` tag to main. The CI pipeline runs `full-test` → `build-release` → `release` automatically.
  - **Full release** (creates GitHub Release with binaries):
    ```
    just man          # ensure man page is up to date
    git add docs/retch.1 && git commit -m "docs: regenerate man page for v<version>"  # if changed
    git tag v<version> && git push origin v<version>
    ```
    The `release` job attaches all platform binaries and the man page to a GitHub Release. Only runs when the tag name contains no `-`.
  - **Pre-release** (generates artifacts without a GitHub Release):
    ```
    git tag v<version>-rc.N && git push origin v<version>-rc.N
    ```
    Triggers `full-test` and `build-release` identically, but skips the `release` job (guarded by `!contains(github.ref_name, '-')`). Artifacts are downloadable from the GitHub Actions run page (Actions → the workflow run → Artifacts section). Use this to test cross-platform binaries before cutting a final release. Delete rc tags after merging: `git tag -d v<version>-rc.N && git push origin :refs/tags/v<version>-rc.N`.
  - **Publish to crates.io** (manual, after the GitHub Release):
    ```
    cargo publish -p retch-sysinfo
    cargo publish -p retch-cli
    ```
    Publish `retch-sysinfo` first since `retch-cli` depends on it.

## Current State (v0.3.17)
- **Parallelization**: Core fetching pipeline executes slow queries (GPU, packages, IPs, active interface, motherboard, BIOS, displays, audio, WiFi, Bluetooth, UI Theme/Fonts, Camera, Gamepad) concurrently using scoped threads.
- **Architecture**: Modularized GPU detection into a dedicated `gpu` module and all display detection/EDID parsing into a dedicated `display` module.
- **Visuals**: Added leading newline to output for better separation.
- **Graphical Support**: Robust support for Kitty, iTerm2, and Sixel protocols.
- **Terminal Detection**: Heuristic detection for Rio, foot, WezTerm, iTerm2, and modern VTE-based terminals (with Chafa fallback).
- **Quality**: Strict `just check` (fmt + lint), unit test coverage (35 `retch-sysinfo` and 26 `retch-cli` passing unit tests), and automated CLI integration test suite (8 tests).
- **CI/CD**: Multi-platform build/testing on Linux (Fedora & Ubuntu), macOS, and Windows. Releases compiled for Fedora (x86_64/ARM), macOS (ARM), and Windows (x86_64/ARM) on native host/container runner environments.
- **Documentation**: Full internal Rustdoc coverage and updated README/man pages.
- **Completions**: Shell completion generation for Bash, Zsh, Fish, Nushell, Elvish, and PowerShell.
- **UX**: Improved error visibility for slow external queries (GPU detection, RPM packages, chafa).
- **Battery**: Added time remaining, health, vendor/model, and improved formatting.
- **Network**: Added local IPv4 and larger-scoped IPv6 address display for all "Up" interfaces with loopback and link-local filtering.
- **WiFi & Bluetooth**: Integrated detailed connection parameters, link rates, MLO bands, adapter hardware names, power states, and connected Bluetooth device profiles.
- **Input Hardware**: Added cross-platform camera/webcam and gamepad/controller detection.

## Future Work / Backlog

- **Package repository submissions**: Submit retch to AUR (Arch User Repository) and nixpkgs so it appears in the [Repology](https://repology.org/project/retch/versions) packaging status widget. The Nix flake (contributed by @quixaq) is a useful starting point for the nixpkgs submission.
- **macOS code signing & notarization**: Sign and notarize the macOS release binary so users don't need to run `xattr -dr com.apple.quarantine` after downloading. Requires Apple Developer Program membership and CI secrets.
- **Homebrew tap / formula**: Publish a `homebrew-retch` tap or submit a formula to Homebrew core so macOS users can `brew install retch`.
- **crates.io publish**: Publish `retch-sysinfo` and `retch-cli` to crates.io (pending post-release testing). Publish `retch-sysinfo` first.

## Major Achievements

### v0.3.17 - macOS Native Probes: Process-Spawn Elimination Complete (June 13, 2026)
- **Battery**: Replaced `ioreg -r -c AppleSmartBattery` process spawn with direct IOKit `AppleSmartBattery` service enumeration via `IOServiceMatching` + `IORegistryEntryCreateCFProperty`. All fields (capacity, health, charge state, time remaining, vendor, model) read natively.
- **Theme**: Replaced `defaults read -g AppleInterfaceStyle` process spawn with `CFPreferencesCopyValue(kCFPreferencesAnyApplication, kCFPreferencesCurrentUser, kCFPreferencesAnyHost)` CoreFoundation FFI.
- **WiFi**: Replaced private `airport -I` binary with `SCDynamicStoreCopyValue` from the SystemConfiguration framework, reading `State:/Network/Interface/<iface>/AirPort` for the `SSID_STR` key. New framework dependency: SystemConfiguration (added to `build.rs`).
- **Zero process spawns on macOS** — all detection is now native framework FFI (CoreFoundation, IOKit, CoreAudio, CoreGraphics, SystemConfiguration).
- **Version**: Bumped to `0.3.17` / `retch-sysinfo 0.1.17`.

### v0.3.16 - macOS Native Probes: system_profiler Elimination (June 11, 2026)
- **New Module**: Added `crates/sysinfo/src/macos_ffi.rs` — a safe FFI wrapper for CoreFoundation, IOKit, CoreAudio, and CoreGraphics. Follows the `win_reg.rs` pattern: raw `extern "C"` blocks at module level followed by safe public functions.
- **BIOS**: Replaced `system_profiler SPHardwareDataType` with `IORegistryEntryFromPath("IODeviceTree:/rom")` → `version` property.
- **Audio**: Replaced `system_profiler SPAudioDataType` with `AudioObjectGetPropertyData` via CoreAudio framework FFI.
- **Display**: Replaced `system_profiler SPDisplaysDataType` with `CGGetActiveDisplayList` + `CGDisplayPixelsWide/High/Mode` + IODisplayConnect name lookup.
- **GPU**: Replaced `system_profiler SPDisplaysDataType` with IOKit enumeration of `AGXAccelerator` (Apple Silicon) and `IOPCIDevice` with PCI class 0x03 (discrete/Intel).
- **Camera**: Replaced `system_profiler SPCameraDataType` with IOKit USB enumeration matching `bInterfaceClass = 0x0E` (UVC). Note: built-in cameras on Apple Silicon use AVFoundation layer and will not appear (USB webcams fully supported).
- **Gamepad**: Replaced both `system_profiler SPUSBDataType` and `system_profiler SPBluetoothDataType` spawns with IOKit HID device matching (usage page 0x01, usages 0x04/0x05).
- **Bluetooth**: Replaced `system_profiler SPBluetoothDataType` with `IOBluetoothHCIController` IOKit service for power state and chipset. Connected device names not available without Obj-C IOBluetooth runtime; shows "connected devices unknown" instead.
- **Zero `system_profiler` spawns** on macOS — all detection is now native framework FFI.
- **Version**: Bumped to `0.3.16` / `retch-sysinfo 0.1.16`.

### v0.3.15 - CLI Refactor: Logo Externalization and Module Cleanup (June 11, 2026)
- **Logo Files**: Moved all distro ASCII logos from hardcoded Rust string vectors in `logo.rs` to external `.txt` files under `assets/logos/`, loaded at compile time via `include_str!`. Contributed by @quixaq.
- **Module Cleanup**: Inlined `fetch` and `gpu` re-export shims from `src/fetch.rs`/`src/gpu.rs` directly into `src/lib.rs`; deleted the now-redundant shim files.
- **Version**: Bumped to `0.3.15` / `retch-sysinfo 0.1.15`.

### v0.3.14 - Nix Flake (June 11, 2026)
- **Nix Flake**: Added `flake.nix` with a `crane`-based package build, a `devShell` with all required tools (`cargo`, `rustc`, `rust-analyzer`, `just`, `pandoc`, `hyperfine`, `python3`), and a `homeManagerModules.default` (`programs.retch`) for declarative NixOS/Home Manager installation. Contributed by @quixaq.
- **README**: Added Nix installation section with `nix run` and Home Manager module examples.
- **Version**: Bumped to `0.3.14` / `retch-sysinfo 0.1.14`.

### v0.3.13 - SPDX Copyright Headers (June 11, 2026)
- **License Headers**: Replaced informal `// Copyright (C) <year> l1a` with machine-readable `// SPDX-FileCopyrightText: <year> Ken Tobias` in all source files, positioned above `SPDX-License-Identifier` per the SPDX specification. Closes #81.
- **Version**: Bumped to `0.3.13` / `retch-sysinfo 0.1.13`.

### v0.3.12 - Windows Native Probes: wmic Elimination (June 10, 2026)
- **GPU (Windows)**: Replaced `wmic path win32_VideoController` with registry enumeration under the display adapter class GUID `{4d36e968-e325-11ce-bfc1-08002be10318}`. Reads `DriverDesc` (name) and `HardwareInformation.MemorySize` (VRAM) natively.
- **Audio (Windows)**: Replaced `wmic path Win32_SoundDevice` with registry enumeration under the media device class GUID `{4d36e96c-e325-11ce-bfc1-08002be10318}`. Reads `DriverDesc` natively.
- **Display (Windows)**: Replaced `wmic path Win32_VideoController` with `EnumDisplayDevicesW` + `EnumDisplaySettingsW` via user32.dll FFI. Enumerates only active adapters and reads current resolution and refresh rate directly.
- **Motherboard/BIOS (Windows)**: Dropped wmic last-resort fallback — registry is now the sole source; no process spawning.
- **Registry Helper**: Added `get_reg_binary` and `enum_reg_subkeys` to `win_reg.rs` to support the new patterns.
- **Version**: Bumped to `0.3.12` / `retch-sysinfo 0.1.12`.

### v0.3.11 - Module Isolation Completion (June 10, 2026)
- **Refactor**: Completed the `retch-sysinfo` module isolation refactor. Extracted all remaining `detect_*` and related helpers from the 2275-line `fetch.rs` into 8 dedicated modules. `fetch.rs` is now 443 lines (struct definitions, `collect()`, and orchestration only).
- **New Modules**: `camera.rs`, `gamepad.rs`, `packages.rs`, `motherboard.rs`, `bios.rs`, `shell.rs`, `theme.rs`, `terminal.rs`.
- **Shared Helper**: `win_reg.rs` — Windows registry helpers (shared by motherboard, bios, theme).
- **New Test**: Added `test_parse_ini_key` to `theme.rs`; sysinfo test count now 36.
- **Benchmarks**: Updated `benches/benchmarks.rs` — `parse_macos_camera`/`parse_macos_gamepad` now reference `camera`/`gamepad` modules.
- **Version**: Bumped to `0.3.11` / `retch-sysinfo 0.1.11`.

### v0.3.10+scripts - Local Benchmark Upload (June 10, 2026, infrastructure only — no crate version bump)
- **Local Benchmark Dashboard**: Added `scripts/upload_local_bench.py` which builds the release binary, runs hyperfine (with optional fastfetch comparison), and pushes results to the gh-pages benchmark dashboard as a "Local - &lt;platform&gt; (real hardware)" suite. Handles concurrent CI push conflicts with exponential-backoff retry and deduplicates by commit SHA.
- **Post-merge Hook**: Added `scripts/hooks/post-merge` — runs automatically after `git merge` on main. Skips silently if cargo or hyperfine are absent; respects `GIT_NO_BENCH=1` escape hatch.
- **Hook Installer**: Added `scripts/install_hooks.sh` and `just install-hooks` recipe for one-time hook setup after cloning.
- **Justfile**: Added `just bench-upload`, `just install-hooks`, and `just setup` recipes.

### v0.3.10 - Test Coverage and Benchmarks (June 10, 2026)
- **New Unit Tests**: Added `test_is_real_camera` and `test_clean_camera_name` to `fetch.rs`; added `test_parse_ioreg_line` to `battery.rs` (macOS-only). Covers previously untested camera-filtering and battery key-parsing helpers.
- **Exposed Parse Helpers**: Made `parse_proc_net_route`, `parse_iw_link_output`, `parse_airport_output`, `parse_netsh_output`, and `WifiLink` pub in `network.rs`; `parse_asound_cards` pub in `audio.rs`; `is_real_camera`, `clean_camera_name`, `parse_macos_camera`, `parse_macos_gamepad` pub in `fetch.rs` — enabling cross-crate benchmarking.
- **New Benchmarks**: Added `bench_parse_proc_net_route`, `bench_parse_iw_link_output`, `bench_parse_airport_output` (macOS), `bench_parse_netsh_output` (Windows), `bench_parse_asound_cards` (Linux), `bench_parse_macos_camera` (macOS), and `bench_parse_macos_gamepad` (macOS) to `benches/benchmarks.rs`.
- **Version**: Bumped version to `0.3.10` in `Cargo.toml`, `crates/sysinfo/Cargo.toml` (→ `0.1.10`), and documentation.

### v0.3.9 - Dependency Updates (June 10, 2026)
- **Dependency Upgrade**: Bumped `rusqlite` from 0.40.0 to 0.40.1. Bundled SQLite updated to 3.53.2; includes a security fix for SQL injection when SAVEPOINT name is tainted and a clippy fix.
- **Version**: Bumped version to `0.3.9` in `Cargo.toml`, `crates/sysinfo/Cargo.toml` (→ `0.1.9`), and documentation.

### v0.3.8 - Bluetooth Module Isolation (June 9, 2026)
- **Workspace Refactor**: Extracted all Bluetooth detection logic from `crates/sysinfo/src/fetch.rs` into a new dedicated module `crates/sysinfo/src/bluetooth.rs` within `retch-sysinfo`.
- **New Module**: `bluetooth.rs` now owns `detect_bluetooth`, `lookup_usb_vendor`, `lookup_usb_device`, `parse_macos_bluetooth`, and `parse_windows_bluetooth_output`. Handles Linux sysfs + bluetoothctl, macOS `system_profiler SPBluetoothDataType`, and Windows PowerShell probing.
- **Test Migration**: Moved `test_parse_macos_bluetooth` and `test_parse_windows_bluetooth_output` from `fetch.rs` into `bluetooth.rs`.
- **Zero Regression**: All unit tests and `just check` (fmt + clippy) pass clean.
- **Version**: Bumped version to `0.3.8` in `Cargo.toml`, `crates/sysinfo/Cargo.toml` (→ `0.1.8`), and documentation.

### v0.3.7 - Audio Module Isolation (June 9, 2026)
- **Workspace Refactor**: Extracted all audio detection logic from `crates/sysinfo/src/fetch.rs` into a new dedicated module `crates/sysinfo/src/audio.rs` within `retch-sysinfo`.
- **New Module**: `audio.rs` now owns `detect_audio` and `parse_asound_cards`. Detects PipeWire/PulseAudio/ALSA on Linux, CoreAudio on macOS, and Windows Audio on Windows.
- **Test Migration**: Moved `test_parse_asound_cards` from `fetch.rs` into `audio.rs`.
- **Zero Regression**: All 33 `retch-sysinfo` unit tests, 26 `retch-cli` unit tests, and 8 CLI integration tests pass. `just check` (fmt + clippy) is clean.
- **Version**: Bumped version to `0.3.7` in `Cargo.toml`, `crates/sysinfo/Cargo.toml` (→ `0.1.7`), and documentation.

### v0.3.6 - Network Module Isolation (June 9, 2026)
- **Workspace Refactor**: Extracted all network-related detection logic from the monolithic `crates/sysinfo/src/fetch.rs` into a new dedicated module `crates/sysinfo/src/network.rs` within `retch-sysinfo`.
- **New Module**: `network.rs` now owns `detect_active_interface_and_local_ip`, `detect_public_ip`, `detect_networks`, `detect_wifi`, `format_bytes`, `lookup_pci_vendor`, and all Wi-Fi parsing helpers (`parse_proc_net_route`, `parse_iw_link_output`, `parse_airport_output`, `parse_netsh_output`, `freq_to_channel`, `get_wifi_card_model`, `clean_rate`, `WifiLink`).
- **Shared Utility**: `lookup_pci_vendor` is now `pub` in `network.rs` so `detect_bluetooth` (in `bluetooth.rs`) can call it via `crate::network::lookup_pci_vendor`.
- **Test Migration**: Moved 5 unit tests (`test_format_bytes`, `test_parse_proc_net_route`, `test_parse_airport_output`, `test_parse_netsh_output`, `test_parse_iw_link_output`) from `fetch.rs` into `network.rs`.
- **Zero Regression**: All 35 `retch-sysinfo` unit tests (now split across `fetch`, `display`, `gpu`, and `network` modules), 26 `retch-cli` unit tests, and 8 CLI integration tests pass. `just check` (fmt + clippy) is clean.
- **Version**: Bumped version to `0.3.6` in `Cargo.toml`, `crates/sysinfo/Cargo.toml` (→ `0.1.6`), and documentation.

### v0.3.5 - Display Module Isolation (June 8, 2026)
- **Workspace Refactor**: Extracted all display detection and EDID parsing logic from `crates/sysinfo/src/fetch.rs` into a new dedicated module `crates/sysinfo/src/display.rs` within `retch-sysinfo`.
- **New Module**: `display.rs` now owns `detect_displays`, `parse_macos_displays`, `parse_xrandr_displays`, `parse_monitor_name_from_edid`, `parse_refresh_rate_from_edid`, `parse_serial_number_from_edid`, `format_refresh_rate`, and `get_monitor_name_for_port`.
- **Test & Bench Expansion**: Expanded test coverage with 13 new unit tests verifying EDID edge cases (precedence, bounds, malformed data), bringing `retch-sysinfo` unit tests to 35. Added 4 new Criterion micro-benchmarks for EDID parsing.
- **Zero Regression**: All 35 `retch-sysinfo` unit tests, 26 `retch-cli` unit tests, and 8 CLI integration tests pass. `just check` (fmt + clippy) is clean.
- **Version**: Bumped version to `0.3.5` in `Cargo.toml`, `crates/sysinfo/Cargo.toml` (→ `0.1.5`), and documentation.

### v0.3.4 - Dependency Updates & CLI Refinements (June 4, 2026)
- **CLI Options**: Added short `-s` for `--short`, short `-l` for `--long`, removed `-l` from `--logo` to prevent conflicts, and removed default from `--mode` to error when missing its value.
- **Dependency Upgrades**: Upgraded `sysinfo` to `0.39.3` (fixing Unix MAC address retrieval and Linux process TOCTOU errors) and `chrono` to `0.4.45` (fixing Android time zone and offset validation bugs), along with general lockfile updates.
- **Version**: Bumped version to `0.3.4` in `Cargo.toml`, `crates/sysinfo/Cargo.toml`, `docs/retch.1.md`, and documentation.

### v0.3.3 - Native OS Queries & Performance Optimization (June 4, 2026)
- **Active Network Interface**: Swapped out spawning `ip route show default` (taking ~10-20ms) with a native parser for `/proc/net/route` on Linux, falling back to the command if `/proc/net/route` is unavailable.
- **Display Resolution & Refresh Rates**: Reordered display detection to try reading `/sys/class/drm` and EDIDs directly from the sysfs filesystem first, reserving `xrandr` as a fallback.
- **System Model (Motherboard)**: Substituted spawning `sysctl -n hw.model` with a native `sysctlbyname` FFI call on macOS.
- **Registry FFI Module**: Added a lightweight, native FFI registry reader targeting `advapi32.dll` to query registry values directly on Windows.
- **Motherboard, BIOS, & Theme**: Swapped out spawning slow `wmic` or `reg query` processes for motherboard, BIOS, and theme details with direct native registry queries.
- **Version**: Bumped version to `0.3.3` in `Cargo.toml`, `docs/retch.1.md`, and documentation.

### v0.3.2 - macOS Battery Health and Bluetooth Fix (June 3, 2026)
- **macOS Battery Health**: Fixed battery health calculation on newer/Apple Silicon macOS systems by prioritizing the raw `AppleRawMaxCapacity` metric from `ioreg` over the normalized `MaxCapacity` (which is often fixed at 100), preventing new batteries from reporting incorrect low values (such as 2%).
- **macOS Bluetooth Status**: Fixed Bluetooth power status detection showing "Off" when Bluetooth is on, by supporting the modern `State: On/Off` output key format from `system_profiler SPBluetoothDataType`.
- **Version**: Bumped version to `0.3.2` in `Cargo.toml`, `docs/retch.1.md`, and documentation.

### v0.3.1 - Terminal Font Detection (June 2, 2026)
- **Terminal Fonts**: Implemented terminal font detection for Kitty, Alacritty, WezTerm, iTerm2, foot, ptyxis, and konsole.
- **Dynamic Fallbacks**: Added fontconfig (`fc-match`) and GNOME (`gsettings`) dynamic queries to automatically resolve and substitute system default fonts when explicit family declarations are missing from configuration files.
- **Version**: Bumped version to `0.3.1` in `Cargo.toml`, `docs/retch.1.md`, and documentation.

### v0.3.0 - retch-sysinfo Workspace Crate (June 1, 2026)
- **Workspace Refactor**: Extracted all system information gathering logic into a new standalone workspace crate `crates/sysinfo` (`retch-sysinfo`), covering GPU detection, battery, network, audio, display, bluetooth, camera, gamepad, UI theme, shell, and all other `detect_*` subsystems.
- **Battery Absorbed**: The existing `retch-battery` workspace crate (`crates/battery`) has been absorbed into `retch-sysinfo` as the `battery` submodule, eliminating a redundant crate.
- **CollectOptions**: Introduced `CollectOptions` struct to decouple `SystemInfo::collect()` from the CLI argument parser, enabling `retch-sysinfo` to be used as a pure library without depending on `clap`.
- **Orphan Rule Fix**: Converted `SystemInfo::display()` inherent impl (which violated Rust orphan rules after the type moved crates) to a free function `display::display()` in the CLI crate.
- **Thin Shims**: CLI crate `src/fetch.rs` and `src/gpu.rs` are now thin re-export shims (`pub use retch_sysinfo::...`) so all existing callsites continue to compile unchanged.
- **Version**: Bumped version to `0.3.0` in `Cargo.toml`, `docs/retch.1.md`, and documentation.

### v0.2.21 - UI Layout Improvements and High Detailed ASCII Logos (June 1, 2026)
- **Side-by-Side Layout**: Implemented side-by-side printing for logo (text ASCII, Chafa, and Sixel/Kitty/iTerm2 graphics) and system info on wider terminals (width >= 95 columns) with automatic vertical fallback for narrow terminals.
- **High Detailed ASCII Logos**: Sourced and added highly detailed color-placeholder-based Fastfetch ASCII logos for all supported distributions (Arch, Debian, Fedora, NixOS, Ubuntu, Pop!_OS, Manjaro, EndeavourOS, openSUSE, Apple/macOS, Windows).
- **Dynamic Color Interpolation**: Implemented dynamic ANSI color placeholder substitution using distro-specific color palettes.
- **Chafa/ASCII Logo Flags**: Introduced `--chafa-logo` (force Chafa rendering, skip graphical protocols) and `--ascii-logo` (force ASCII art) CLI flags and configuration parameters.
- **Logo Flag Fix**: Fixed `--print-logos --chafa-logo` incorrectly rendering graphical images instead of Chafa; `print_distro_logo_with_ascii` now accepts a `chafa_only` parameter that bypasses Kitty/iTerm2/Sixel.
- **Version**: Bumped version to `0.2.21` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.20 - Webcam/Camera and Gamepad/Controller Support (June 1, 2026)
- **Hardware Support**: Implemented cross-platform detection for connected Cameras/Webcams and Gamepads/Controllers across Linux, macOS, and Windows.
- **Concurrency**: Integrated new device probes concurrently in the scoped-thread fetching pipeline to maintain fast startup.
- **Version**: Bumped version to `0.2.20` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.19 - Cargo Publish Validation Fix (June 1, 2026)
- **Publish Readiness**: Added explicit version constraints to the local `retch-battery` workspace path dependency in the root `Cargo.toml`. This ensures the project builds and verifies successfully under `cargo publish --dry-run` and is fully ready to be published to crates.io.
- **Version**: Bumped version to `0.2.19` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.18 - Documentation Update (May 31, 2026)
- **Documentation**: Significantly expanded README.md and manual page docs/retch.1.md to fully cover and document the active configuration options, CLI argument mappings, and newly supported concurrent queries (UI styling, shell version detection, EDID parsing, audio server types, Bluetooth devices, and Wi-Fi features).
- **Version**: Bumped version to `0.2.18` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.17 - Workspace Migration and Battery Subcrate (May 31, 2026)
- **Battery Subcrate**: Extracted the native battery parsing implementations into a new standalone workspace package `crates/battery` (`retch-battery`), making it reusable as a library.
- **Version**: Bumped version to `0.2.17` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.16 - Update Roadmap with Native Battery Plan (May 31, 2026)
- **Roadmap Update**: Updated development documentation (`AGENTS.md`) to include native battery implementation plan to eliminate the unmaintained `battery` crate and transitively fix dependabot security alerts on `nix`.
- **Version**: Bumped version to `0.2.16` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.15 - Restrict GITHUB_TOKEN Permissions (May 31, 2026)
- **Workflows Security**: Added explicit `permissions: contents: read` blocks to both the Rust CI and Security Audit workflows to limit the scope of the default GITHUB_TOKEN and resolve CodeQL warnings.
- **Version**: Bumped version to `0.2.15` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.14 - Memory and Swap Unit Fix (May 31, 2026)
- **Memory & Swap Formatting**: Fixed a byte conversion bug where memory and swap usage returned by the `sysinfo` crate (in bytes) were only divided twice (yielding MiB) but labeled as "GB". Now properly divides by 1024.0 three times to output correct GB sizes.
- **Version**: Bumped version to `0.2.14` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.13 - UI Theme and Fonts Support (May 27, 2026)
- **UI Theme & Fonts**: Implemented cross-platform concurrent detection of UI Theme, Icons, Cursor, and Font, supporting Linux (GTK 2/3/4, KDE/Qt global settings, with gsettings fallback), macOS (Aqua theme light/dark detection), and Windows (AppsUseLightTheme registry parsing).
- **Version**: Bumped version to `0.2.13` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.12 - Active Shell Version Detection (May 27, 2026)
- **Shell Version**: Implemented active shell detection and version parsing supporting `bash`, `zsh`, `fish`, `nu`, `pwsh`, `powershell`, `elvish`, and `tcsh`.
- **Version**: Bumped version to `0.2.12` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.11 - Fix shell completions command name (May 27, 2026)
- **Shell Completions**: Fixed generated shell completions using the binary name `retch` instead of package name `retch-cli`.
- **Version**: Bumped version to `0.2.11` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.10 - Wi-Fi and Bluetooth Support (May 27, 2026)
- **Wi-Fi**: Added cross-platform SSID, band frequency, channel mapping, Rx/Tx link rates, PCI hardware model lookup, and Wi-Fi 7 Multi-Link Operation (MLO) support.
- **Bluetooth**: Added detailed controller state, adapter name, manufacturer, model (via USB/PCI database lookup), and connected device count/names.
- **Version**: Bumped version to `0.2.10` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.9 - Audio Support (May 26, 2026)
- **Audio Detection**: Implemented audio/sound card and active server detection (PipeWire/PulseAudio/ALSA on Linux, CoreAudio on macOS, and Windows Audio on Windows) inside the concurrent fetching pipeline.
- **Version**: Bumped version to `0.2.9` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.8 - Short and Default Mode Refinement (May 26, 2026)
- **Disk & Network Filtering**: Restricts default layout and `--short` output modes to display only the `/home` filesystem mount (or its parent) and the primary active network interface.
- **Styling**: Suppresses special bright blue highlighting for network interfaces in short and default modes, displaying the single primary interface with standard styling. Highlight is preserved in `--long` mode.
- **Version**: Bumped version to `0.2.8` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.7 - Motherboard, BIOS, and Display Support (May 26, 2026)
- **Hardware Info**: Integrated Motherboard, BIOS, and connected Display queries into the parallel fetching pipeline.
- **BIOS Formatting**: Cleans whitespace formatting for BIOS version strings (e.g. `R2FET68W (1.48 )` -> `R2FET68W (1.48)`).
- **Display Resolution & Refresh Rates**: Implemented a raw EDID parser to read monitor names, preferred resolutions, and compute refresh rates natively from the Detailed Timing Descriptor (DTD) block on Linux.
- **Unique Identification**: Display outputs differentiate multiple monitors of the same model by appending unique serial numbers parsed from EDID (e.g. `DELL S3422DW #HXZ50M3`).
- **Version**: Bumped version to `0.2.7` in `Cargo.toml`, `docs/retch.1`, and documentation.

### v0.2.6 - Benchmarking Infrastructure (May 26, 2026)
- **Benchmarking**: Integrated criterion micro-benchmarks for core subsystems, hyperfine CLI benchmarking recipes, and fastfetch execution speed comparisons.
- **CI/CD**: Established continuous benchmarking workflow with GitHub Actions and automated GitHub Pages dashboard hosting, incorporating live CLI comparison tracking against fastfetch.
- **Version**: Bumped version to `0.2.6` in `Cargo.toml`, `docs/retch.1`, and documentation.

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

## Feature Gap with Fastfetch

Below is a comparison of information gathered by `fastfetch` that is currently missing in `retch`:

### Desktop Environment & UI
- (All desktop UI features currently match Fastfetch)

## Next Steps

1. **crates.io Publishing** — Publish `retch-sysinfo` v0.1.15 and `retch-cli` v0.3.15` to crates.io now that dry-run validations are complete.
2. **Platform & Native Probes** — Replace slow `Command::new` spawns with direct FFI/API calls. Priority order:
   - **Windows `wmic` (×5 spawns)** — deprecated in modern Windows, ~200-500ms startup cost. Replace with:
     - GPU (`gpu.rs`): registry under display adapter class GUID `{4d36e968-e325-11ce-bfc1-08002be10318}` (`DriverDesc`, `HardwareInformation.MemorySize`)
     - Audio (`audio.rs`): registry under media device class GUID `{4d36e96c-e325-11ce-bfc1-08002be10318}` (`DriverDesc`)
     - Display (`display.rs`): `EnumDisplayDevices` + `EnumDisplaySettings` via user32.dll FFI
     - Motherboard/BIOS (`motherboard.rs`, `bios.rs`): wmic is already a last-resort fallback after registry; can be dropped entirely
   - **macOS `system_profiler` (×8 spawns)** — spawns a new process per subsystem. Replace with IOKit/CoreFoundation FFI for GPU, audio, bluetooth, camera, displays, and gamepad.
   - **macOS `ioreg` (×1, battery)** — replace with `IOKit` FFI (`IOServiceGetMatchingServices`, `IORegistryEntryCreateCFProperties`).
   - **macOS `sysctl` (×1 remaining)** — extend existing `sysctlbyname` FFI pattern.

---
*Last updated: June 11, 2026 (v0.3.15)*
