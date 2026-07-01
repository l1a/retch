# NOTES.md

This file contains the details of this specific project (retch). It details the goals, purpose, codebase architecture, specific development guidelines, release checklists, current state, backlog, and release logs of the retch project.

---

## 1. Project Overview
- **Name**: retch (published as `retch-cli` on crates.io)
- **Goal**: A fast, feature-rich system information fetcher (Fastfetch-like) written in Rust
- **Key Technologies**: sysinfo, clap, serde, toml, owo-colors, icy_sixel
- **License**: GPLv3
- **Repository**: https://github.com/l1a/retch

---

## 2. Codebase Architecture

```
retch/                          ← retch-cli crate (binary)
  src/
    main.rs, display.rs, config.rs, ...
  Cargo.toml                    ← version = "0.3.28" (bump on release)
  Justfile
  docs/retch.1.md               ← man page source (mandown)
  docs/retch.md                 ← tldr page source

crates/sysinfo/                 ← retch-sysinfo crate (library)
  src/
    macos_ffi.rs                ← ALL macOS FFI (CoreFoundation, IOKit, CoreAudio,
                                   CoreGraphics, CoreWLAN, objc runtime)
    fetch.rs                    ← orchestrates concurrently-scoped thread fetches
    network.rs, battery.rs, theme.rs, ...
  build.rs                      ← framework link directives
  Cargo.toml                    ← version = "0.1.28" (bump on release)
```

The `retch-sysinfo` crate can be used independently as a library for cross-platform system information gathering without any dependency on `clap` or the CLI.

---

## 3. Specific Development Guidelines

- **Man Pages**: Do NOT edit `docs/retch.1` directly. It is generated from `docs/retch.1.md` using mandown via the `just man` command. The version number in the man page is dynamically extracted from `Cargo.toml`. Always run `just man` after updating the package version.
- **Quality & Linting**: Use `just check` to run formatting (`cargo fmt -- --check`) and linting (`cargo clippy -- -D warnings`) checks locally before committing. This matches the checks performed in the CI/CD pipeline.
- **Verification Routine**: Before proposing a push or Pull Request, always verify:
  1. All new and existing unit/integration tests cover changes.
  2. All documentation is kept in sync with the current features.
  3. Default configuration templates (like `default_config_content()` in `src/main.rs`) and comment lists are fully updated with new options.
  4. If the GitHub wiki exists, clone it (`https://github.com/l1a/retch.wiki.git`) and update any affected pages before submitting the PR.
  5. When adding distro logos, run `cargo run -- --print-logos --ascii-logo` and confirm every new distro appears in the output. The hardcoded list in `src/main.rs` must be updated alongside `src/logo.rs`.
  6. If package versions are bumped, run `just man` to regenerate the man pages (so `docs/retch.1` is kept in sync with the new `Cargo.toml` version) and commit the updated man page *as part of the Pull Request* before merging (never directly on `main`).
- **Pre-PR Gate**: Before calling `gh pr create`, the developer or agent MUST run `just pr` and pass the interactive confirmation prompt. `just pr` automates the checks (branch, version bump, AGENTS.md/NOTES.md header, man page, Cargo.lock, fmt+clippy, tests) and prints the manual checklist (README, release log entry, wiki, tldr doc update) requiring an explicit `y` confirmation. Note: the tldr checklist item means updating `docs/retch.md` only — do **not** run `just tldr-release` (upstream submission on hold).
  - **Code Documentation**: Review all changed public items (`pub fn`, `pub struct`, `pub enum`, fields) for accurate doc comments. Update any doc comments that describe old behavior. New functions with non-obvious logic must have a doc comment explaining the WHY, not just the what.
  - **Test Coverage**: Every new pure function must have unit tests. Every new CLI flag must appear in the `--help` integration test and have a smoke-test verifying it exits 0 and produces expected output. Every changed invariant (e.g. a filter condition gaining a new parameter) must have a test that exercises the new branch.
- **PR Test Plans**: After opening a PR, immediately run each item in the test plan checklist and update the PR body via `gh pr edit` to check off passed items. Do not leave all boxes unchecked. Items requiring manual human verification (e.g. runtime output) should be left unchecked with a note.
- **Documentation & Versioning Updates**: When branching to make changes, ensure the following updates are performed:
  - **Version Bump**: Increment the version in `Cargo.toml`, verify compilation, and run `cargo check` to update `Cargo.lock`.
  - **Man Pages**: Update `docs/retch.1.md` with new parameters/fields and run `just man` to rebuild `docs/retch.1`.
  - **README**: Add new features, command examples, or configuration keys to `README.md`.
  - **Roadmap & History**: Update `NOTES.md` by bumping the version in the "Current State" header and adding a new release log entry under "Major Achievements".
  - **GitHub Wiki**: Clone (`https://github.com/l1a/retch.wiki.git`) and update the corresponding wiki pages (`Configuration-and-Theming.md`, `Workspace-Architecture.md`, `Home.md`).
  - **tldr Page**: Update the local `docs/retch.md` if new options are introduced. **Do NOT run `just tldr-release`** — the upstream submission to [tldr-pages/tldr](https://github.com/tldr-pages/tldr) was denied pending more community traction. Keep `docs/retch.md` and the `just tldr-release` workflow maintained, but hold all upstream submissions until further notice.
  - **Bumping Strategy**: If the changes are significant, ALWAYS ask the user whether to perform a major, minor, or patch version bump.
- **Command Redundancy**: Avoid running `just check && cargo test` sequentially since both build and check the project profiles, causing redundant background compilation cycles. Prefer `cargo test` during iteration and a final check before staging.
- **Benchmarking**: Use `just bench` for criterion micro-benchmarks, `just bench-cli` for hyperfine timing of the release binary, and `just bench-compare` to compare against fastfetch/neofetch. CI automatically tracks benchmark trends on pushes to `main` via GitHub Pages. Use `just bench-upload` to manually push local benchmark results to the dashboard; a `post-merge` hook installed via `just install-hooks` does this automatically after every merge to main.
- **Performance Regression Vigilance**: After every merge, check the post-merge benchmark output. A primary goal of retch is to be faster than fastfetch — benchmarks exist to catch regressions early. If retch is slower than fastfetch in any mode, treat it as a blocking issue. Note that local benchmarks can be skewed by slow FUSE mounts (e.g. cryfs vaults) causing `statvfs` delays in disk detection — unmount them before benchmarking or discount those runs.
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
    Triggers `full-test` and `build-release` identically, but skips the `release` job (guarded by `!contains(github.ref_name, '-')`). Artifacts are downloadable from the GitHub Actions run page.
  - **Publish to crates.io** (manual, after the GitHub Release):
    ```
    cargo publish -p retch-sysinfo
    cargo publish -p retch-cli
    ```
    Publish `retch-sysinfo` first since `retch-cli` depends on it.
  - **Publish to tldr-pages upstream** (on hold — do not run):
    The upstream tldr-pages submission was denied pending more community traction.
    Keep `docs/retch.md` current but do not run `just tldr-release` until further notice.
    ```
    just tldr-release
    ```

---

## Current State (v0.3.34)
- **Parallelization**: Core fetching pipeline executes slow queries (GPU, packages, IPs, active interface, motherboard, BIOS, displays, audio, WiFi, Bluetooth, UI Theme/Fonts, Camera, Gamepad) concurrently using scoped threads.
- **Architecture**: Modularized GPU detection into a dedicated `gpu` module and all display detection/EDID parsing into a dedicated `display` module.
- **Visuals**: Added leading newline to output for better separation.
- **Graphical Support**: Robust support for Kitty, iTerm2, and Sixel protocols.
- **Terminal Detection**: Heuristic detection for Rio, foot, WezTerm, iTerm2, and modern VTE-based terminals (with Chafa fallback).
- **Quality**: Strict `just check` (fmt + lint), unit test coverage (39 `retch-sysinfo` and 26 `retch-cli` passing unit tests), and automated CLI integration test suite (8 tests).
- **CI/CD**: Multi-platform build/testing on Linux (Fedora & Ubuntu), macOS, and Windows. Releases compiled for Fedora (x86_64/ARM), macOS (ARM), and Windows (x86_64/ARM) on native host/container runner environments.
- **Documentation**: Full internal Rustdoc coverage and updated README/man pages.
- **Completions**: Shell completion generation for Bash, Zsh, Fish, Nushell, Elvish, and PowerShell.
- **UX**: Improved error visibility for slow external queries (GPU detection, RPM packages, chafa).
- **Battery**: Added time remaining, health, vendor/model, and improved formatting.
- **Network**: Added local IPv4 and larger-scoped IPv6 address display for all "Up" interfaces with loopback and link-local filtering.
- **WiFi & Bluetooth**: Integrated detailed connection parameters, link rates (macOS: TX only via CoreWLAN), MLO bands, adapter hardware names, power states, and connected Bluetooth device profiles.
- **Input Hardware**: Added cross-platform camera/webcam and gamepad/controller detection.

---

## 4. Output Mode Strata

retch has four output modes with increasing verbosity and acceptable runtime. Each mode is a strict superset of the one above it.

| Mode | Flag | Typical runtime | Purpose |
|---|---|---|---|
| Short | `--short` | <100ms | Hardware snapshot — fastest, scriptable |
| Standard | *(none)* | ~200ms | Daily-use system overview |
| Long | `--long` | ~500ms | Diagnostics — consolidated thermals, network detail, firmware |
| Full | `--full` | ~5s+ | Everything, including slow and cosmetic fields |

### `--short`
Fast hardware-only snapshot. No network calls, no sensors, no cosmetic fields.
Fields: `os`, `kernel`, `host`, `cpu`, `gpu`, `memory`, `disk`, `net`

### Standard (no flag)
Full system overview suitable for daily use. No slow fields, no sensors, no cosmetic fields.
Fields: `os`, `kernel`, `host`, `cpu`, `cpu-cache`, `cpu-usage`, `motherboard`, `gpu`, `display`, `audio`, `camera`, `memory`, `phys-mem`, `swap`, `load`, `disk`, `phys-disk`, `net`, `uptime`
- BIOS moves to `--long` (firmware detail, not needed at a glance)
- Gamepad moves to `--full` (cosmetic/slow)

### `--long`
Standard plus diagnostics. Aimed at understanding system health and network configuration.
Adds over standard:
- `bios` — firmware vendor, version, date
- `temp` (consolidated) — **one representative reading per physical unit**: CPU, GPU, SSD/NVMe, WiFi adapter, System/Motherboard. Rule: highest sensor within each category (worst-case thermal indicator). All other sensor readings are deferred to `--full`.
- `domain` — current DNS domain name (from `/etc/resolv.conf` `domain` directive or `hostname -d`)
- `public-ip`, `wifi`, `bluetooth`, `battery`, `shell`, `editor`, `terminal`, `terminal-size`, `desktop`, `wm`, `dns`, `users`, `packages`, `locale`, `init`, `chassis`, `bootmgr`

### `--full`
Long plus everything slow, verbose, or cosmetic. Suitable for reporting, screenshots, or deep diagnostics. Users should expect multi-second runtimes.
Adds over long:
- `temp` (all sensors) — replaces the consolidated view with every sensor reading
- `domain-search` — per-interface DNS search domain lists (from `resolvectl status` or equivalent)
- Cosmetic fields: `theme`, `icons`, `cursor` (font and terminal-font remain in `--long`)
- `weather` — current conditions via Open-Meteo (~4s network timeout)
- FUSE mounts — disk detection re-enables `statvfs` for `fuse.*` entries (skipped in all other modes to avoid 600ms+ hangs from cryfs/EncFS vaults)
- `phys-disk`, `phys-mem` — may be promoted here if runtime warrants it

### Design notes
- **Temperature consolidation logic** for `--long`: classify sensors by name patterns (e.g. `k10temp`/`coretemp` → CPU, `amdgpu`/`nvidia` → GPU, `nvme` → SSD, `ath`/`iwl` → WiFi, `acpitz`/`thinkpad` → System). Within each category, report the highest reading.
- **`--full` as a superset**: every field visible in `--long` also appears in `--full`; nothing is hidden or replaced except the temp view (consolidated → all sensors).
- **Breaking change note**: cosmetic fields (`theme`, `icons`, `cursor`) and `gamepad` have moved from `--long` to `--full`. `font` and `terminal-font` remain in `--long`. This is intentional — theme/icon/cursor detection involves sqlite/gsettings queries and is cosmetic, not diagnostic.
- **Alternative considered**: `--verbose` instead of `--full`. Rejected — `--full` is more intuitive as the natural escalation from `--long`, and `--verbose` implies logging noise rather than field breadth.

---

## 5. Future Work / Backlog
- **Package repository submissions**: Submit retch to AUR (Arch User Repository) and nixpkgs so it appears in the [Repology](https://repology.org/project/retch/versions) packaging status widget. The Nix flake (contributed by @quixaq) is a useful starting point for the nixpkgs submission.
- **macOS code signing & notarization**: Sign and notarize the macOS release binary so users don't need to run `xattr -dr com.apple.quarantine` after downloading. Requires Apple Developer Program membership and CI secrets.
- **Homebrew tap / formula**: Publish a `homebrew-retch` tap or submit a formula to Homebrew core so macOS users can `brew install retch`.
- **FUSE mounts in `--full`**: v0.3.26 skips all `fuse.*` mounts to avoid 600ms+ hangs from cryfs/EncFS vaults. The `--full` mode redesign (§4) resolves this by re-enabling `statvfs` for fuse.* entries in `--full` only — no separate config key or flag needed.

---

## 6. Feature Gap with Fastfetch

Below is a comparison of information gathered by `fastfetch` that is currently missing in `retch`.

### Hardware
- **Brightness**: Monitor brightness level
- **Keyboard**: Connected keyboards
- **Mouse**: Connected mice
- **PowerAdapter**: Charger name and wattage
- **TPM**: Trusted Platform Module device info

### GPU / Graphics
- **OpenCL / OpenGL / Vulkan**: Highest supported API versions

### Storage & Filesystems
- **Btrfs**: Btrfs volume info
- **Zpool**: ZFS storage pool info
- **DiskIO**: Disk I/O throughput

### Network
- **NetIO**: Network I/O throughput

### Desktop Environment & UI
- **WMTheme**: Window manager theme
- **LM**: Login manager (GDM, SDDM, etc.)
- **Wallpaper**: Current wallpaper file path
- **TerminalTheme**: Terminal foreground/background colors

### Media
- **Media / Player**: Currently playing song and active music player

---

## 7. Major Achievements

### v0.3.34 - Fix claude-code-review failing on Dependabot PRs (July 1, 2026)
- **Bug**: `.github/workflows/claude-code-review.yml` hard-failed in ~10s on any
  Dependabot PR (e.g. #132) because `claude-code-action@v1` refuses to run for
  non-human actors by default.
- **Fix**: Added `allowed_bots: 'dependabot[bot]'` to the action's `with:` block,
  scoped narrowly to Dependabot rather than allowing all bots.
- **Version**: Bumped to `0.3.34`.

### v0.3.33 - Add CLAUDE.md, require reading ~/AGENTS.md (July 1, 2026)
- **CLAUDE.md added**: New file pointing agents at `AGENTS.md` via a relative link
  (retch previously had no `CLAUDE.md` at all; etr's had a broken absolute path,
  fixed alongside this).
- **Global Mandates item**: `AGENTS.md` Portable Core gained a `0. Global Mandates`
  item requiring agents to read `~/AGENTS.md` (cross-repo mandates) before starting
  work.
- **Version**: Bumped to `0.3.33`.

### v0.3.32 - Merge AGENTS.md with etr (July 1, 2026)
- **AGENTS.md restructured**: Split into a Portable Core (shared, kept in sync with
  `etr`'s AGENTS.md) plus a Part 2 project-specific section.
- **NOTES.md discipline documented**: AGENTS.md now requires reading NOTES.md at
  session start and updating it before every commit/push, matching what `just pr`
  already enforced silently.
- **Core Developer Guidelines added**: unsafe-Rust, idiomatic-Rust, and testing/doc
  mandates adopted from `etr`, adapted for retch (no client-server architecture note).
- **Pre-PR Checklist documented**: AGENTS.md now describes exactly what `just pr`
  automates (branch check, version-bump check, NOTES.md header check, man page
  build+diff check, Cargo.lock check, fmt/clippy, tests) plus the remaining manual
  checklist, with man-page-regen and version-bump called out as unconditional.
- **Version**: Bumped to `0.3.32`.

### v0.3.31 - Output mode strata refactor (June 29, 2026)
- **`--full` flag**: New output mode that is a strict superset of `--long`. Adds slow and cosmetic fields: `theme`, `icons`, `cursor`, `gamepad`, `weather`, and FUSE mounts in disk detection.
- **Standard mode cleanup**: Removed `bios` and `gamepad` from the default field set. `bios` moves to `--long`; `gamepad` moves to `--full`.
- **`--long` is now explicit**: Long mode uses an explicit field list instead of "collect everything". Fields include all standard fields plus `bios`, `font`, `shell`, `editor`, `terminal`, `terminal-font`, `terminal-size`, `desktop`, `wm`, `dns`, `domain`, `wifi`, `bluetooth`, `battery`, `public-ip`, `locale`, `init`, `chassis`, `bootmgr`, `temp`, `cpu-freq`, `procs`, `arch`, `users`, `packages`.
- **Consolidated temps in `--long`**: Temperature output in `--long` mode shows one reading per physical unit (CPU, GPU, NVMe, WiFi, System — highest sensor in each category). All raw sensor readings appear in `--full`.
- **FUSE mounts in `--full`**: `detect_logical_disks` now accepts an `include_fuse` flag; `--full` re-enables `statvfs` for `fuse.*` entries (all other modes skip them to avoid 600ms+ hangs).
- **`domain` field**: Current DNS domain name from `/etc/resolv.conf` `domain` directive (falls back to first `search` entry). Shown in `--long` and above.
- **`domain-search` field**: Per-interface DNS search domain lists from `resolvectl status`, formatted as `"wlan0: home.local"`. Full mode only.
- **Display reorder**: Logical grouping of fields — domain/domain-search under Host, uptime near OS identity, users/packages near OS section, Wi-Fi/Bluetooth/Battery in hardware block (after Camera).
- **DNS label renamed**: "DNS" display label changed to "DNS Server". Config key `dns` is unchanged.
- **Version**: Bumped to `0.3.31` / `retch-sysinfo 0.1.31`.

### v0.3.30 - Switch weather backend to Open-Meteo (June 29, 2026)
- **Weather accuracy**: Replaced wttr.in (World Weather Online backend) with Open-Meteo for forecast data and Open-Meteo geocoding API for location resolution. Auto-location now uses ipinfo.io instead of wttr.in IP detection. Results match NWS/ECMWF model data.
- **weather_unit config**: New `weather_unit` config key and `--weather-unit` flag accepting `"fahrenheit"` (default) or `"celsius"`.
- **WMO emoji map**: Weather conditions expressed as emojis via WMO weather interpretation codes (clear, cloudy, fog, drizzle, rain, snow, thunderstorm).
- **Version**: Bumped to `0.3.30` / `retch-sysinfo 0.1.30`.

### v0.3.29 - Terminal size, DNS, WM, shell/desktop fixes, logo improvements (June 29, 2026)
- **TerminalSize**: Detects terminal dimensions (columns × rows) via `ioctl(TIOCGWINSZ)` on Linux/macOS; falls back to `$COLUMNS`/`$LINES`.
- **DNS**: Parses configured nameservers from `/etc/resolv.conf` (Linux/macOS); PowerShell `Get-DnsClientServerAddress` on Windows.
- **WM**: Detects the active window manager by scanning `/proc` for known compositor/WM process names. Suppressed in output when identical to the Desktop field (case-insensitive).
- **Shell fix**: Shell detection now walks the process tree first to find the *running* shell, falling back to `$SHELL` (login shell) only when the scan yields nothing.
- **Desktop fix**: Added `XDG_SESSION_DESKTOP` and `GDMSESSION` as env-var fallbacks for Desktop detection; added `normalize_desktop_name()` for canonical casing (e.g. `gnome` → `GNOME`); added `detect_desktop_from_proc()` last-resort scan of `/proc` for known DE processes.
- **Logo tty suppression**: Logo is now automatically suppressed when stdout is not a terminal (uses `isatty()` — not fooled by pagers like `bat` that allocate a PTY).
- **Logo cursor placement**: Graphical logos (Kitty/iTerm2/Sixel) now correctly advance the terminal cursor past the logo's bottom edge when the info field list is shorter than the logo height. Cell height is computed via `TIOCGWINSZ` with a 20px fallback.
- **Version**: Bumped to `0.3.29` / `retch-sysinfo 0.1.29`.

### v0.3.28 - TL;DR page (June 28, 2026)
- **TL;DR Page**: Added `tldr` command page entry (`docs/retch.md`) detailing the most common CLI parameters, themes, and configuration flags.
- **Documentation**: Updated manual pages (`just man`) and README to integrate references to the new `tldr` utility documentation.
- **Version**: Bumped to `0.3.28` / `retch-sysinfo 0.1.28`.

### v0.3.27 - System and Misc fields (June 28, 2026)
- **InitSystem**: Detects PID 1 init system name from `/proc/1/comm` on Linux; always "launchd" on macOS, "SCM" on Windows.
- **Chassis**: Maps `/sys/class/dmi/id/chassis_type` number to human label (Laptop, Desktop, Mini PC, etc.) on Linux; infers from `hw.model` sysctl on macOS.
- **Locale**: Reads `$LC_ALL` → `$LC_MESSAGES` → `$LANG` env vars.
- **Bootmgr**: Checks `/boot/loader/entries` (systemd-boot), `/boot/grub2` (GRUB 2), `/boot/grub` (GRUB), `/sys/firmware/efi` (UEFI fallback) on Linux; "Apple Boot ROM" on macOS.
- **Editor**: Reads `$VISUAL` → `$EDITOR` env vars.
- **Weather**: Long-mode only; calls `curl https://wttr.in/?format=3` (3-second timeout) for one-line city+condition+temperature.
- All five fast fields are in the default output set; Weather is long-only due to network latency.
- **Feature gap list** moved from `AGENTS.md` to `NOTES.md` (project state tracking, not standing instructions).
- **Version**: Bumped to `0.3.27` / `retch-sysinfo 0.1.27`.

### v0.3.26 - Skip FUSE mounts in disk detection (June 27, 2026)
- **Disk detection (Linux)**: Replaced `sysinfo::Disks::new_with_refreshed_list()` with a custom `/proc/mounts` reader that filters pseudo-filesystems and `fuse.*` mounts before calling `statvfs`. Eliminates 600ms+ hangs caused by cryfs/EncFS vaults and other FUSE mounts.
- **Version**: Bumped to `0.3.26` / `retch-sysinfo 0.1.26`.

### v0.3.25 - Windows PhysDisk and PhysMem (June 24, 2026)
- Implemented `detect_windows()` in `crates/sysinfo/src/disk.rs` and `crates/sysinfo/src/memory.rs` using PowerShell scripts.
- **Version**: Bumped to `0.3.25` / `retch-sysinfo 0.1.25`.

### v0.3.24 - Benchmark Mode Mappings and Metric Fetch Optimizations (June 24, 2026)
- Restricted metric gathering in `SystemInfo::collect` to only fetch fields specified in configuration or CLI flags.
- **Version**: Bumped to `0.3.24` / `retch-sysinfo 0.1.24`.

### v0.3.23 - Physical Disk and Physical Memory Fields (June 23, 2026)
- Added `PhysDisk` and `PhysMem` fields running concurrently in the fetching pipeline.
- **Version**: Bumped to `0.3.23` / `retch-sysinfo 0.1.23`.

### v0.3.22 - Packaging Configurations (June 23, 2026)
- Created package configuration files for Arch User Repository (`packaging/aur/PKGBUILD`) and Nixpkgs (`packaging/nixpkgs/package.nix`).
- **Version**: Bumped to `0.3.22` / `retch-sysinfo 0.1.22`.

### v0.3.21 - CPU Cache and CPU Usage (June 15, 2026)
- **CPU Cache**: Added `CPUCache` field showing L1d/L1i/L2/L3 sizes parsed from `/sys/devices/system/cpu/cpu0/cache/` on Linux.
- **CPU Usage**: Added `CPUUsage` field showing current CPU utilization percentage.
- **Version**: Bumped to `0.3.21` / `retch-sysinfo 0.1.21`.

### v0.3.20 - Fix `auto` theme headless fallback (June 15, 2026)
- **Bug fix**: `theme = "auto"` now returns `neutral` instead of `dark` when no display server is present.
- **Version**: Bumped to `0.3.20` / `retch-sysinfo 0.1.20`.

### v0.3.19 - New Distro Logos: MX Linux, Mint, Kali, Zorin, Garuda (June 15, 2026)
- Sourced and integrated ASCII art, PNG, and color palettes for 5 additional Linux distros.
- **Version**: Bumped to `0.3.19` / `retch-sysinfo 0.1.19`.

### v0.3.18 - macOS WiFi: CoreWLAN SSID + Link Rate (June 14, 2026)
- Replaced the SC dynamic store approach with CoreWLAN Objective-C runtime FFI.
- **Version**: Bumped to `0.3.18` / `retch-sysinfo 0.1.18`.

### v0.3.17 - macOS Native Probes: Process-Spawn Elimination Complete (June 13, 2026)
- Replaced `ioreg` battery process spawns and interface defaults with CoreFoundation, IOKit, and SC framework FFI.
- **Version**: Bumped to `0.3.17` / `retch-sysinfo 0.1.17`.

### v0.3.16 - macOS Native Probes: system_profiler Elimination (June 11, 2026)
- Swapped macOS system_profiler process spawns for CPU ROM, audio FFI, display listing, webcam HID, and Bluetooth IOKit framework wrappers.
- **Version**: Bumped to `0.3.16` / `retch-sysinfo 0.1.16`.

### v0.3.15 - CLI Refactor: Logo Externalization and Module Cleanup (June 11, 2026)
- Moved hardcoded distro logos into external `.txt` files under `assets/logos/`.
- **Version**: Bumped to `0.3.15` / `retch-sysinfo 0.1.15`.

### v0.3.14 - Nix Flake (June 11, 2026)
- Added `flake.nix` with crane-based builds and Home Manager default modules.
- **Version**: Bumped to `0.3.14` / `retch-sysinfo 0.1.14`.

### v0.3.13 - SPDX Copyright Headers (June 11, 2026)
- Added SPDX-FileCopyrightText to all source files.
- **Version**: Bumped to `0.3.13` / `retch-sysinfo 0.1.13`.

### v0.3.12 - Windows Native Probes: wmic Elimination (June 10, 2026)
- Swapped out wmic process queries for native Registry/user32 FFI for Windows GPUs, displays, audio, and BIOS.
- **Version**: Bumped to `0.3.12` / `retch-sysinfo 0.1.12`.

### v0.3.11 - Module Isolation Completion (June 10, 2026)
- Completed the `retch-sysinfo` module isolation refactor.
- **Version**: Bumped to `0.3.11` / `retch-sysinfo 0.1.11`.

### v0.3.10+scripts - Local Benchmark Upload (June 10, 2026)
- Added `scripts/upload_local_bench.py` and `post-merge` git hooks.

### v0.3.10 - Test Coverage and Benchmarks (June 10, 2026)
- Expanded test coverage and benchmark micro-harness.
- **Version**: Bumped to `0.3.10` / `retch-sysinfo 0.1.10`.

---

## 8. Dependencies (Cargo.toml)
- `sysinfo` — System information gathering
- `clap` — CLI argument parsing
- `serde` + `toml` — Configuration
- `owo-colors` — Truecolor/RGB terminal coloring
- `icy_sixel` — Pure Rust Sixel encoding
- `image` + `base64` — Graphical logo processing
- `rusqlite` — RPM package counting
- `chrono` — Date/time formatting

---

## 9. Historical Session Notes

### Session Notes — June 27, 2026 (v0.3.25)
**Benchmark Anomaly: cryfs FUSE Mount**
Local benchmarks on this machine (Linux Fedora 44 x86_64) show ~900ms standard / ~618ms short vs ~333ms / ~10ms from the other machine. Root cause: `/home/ktobias/Vaults/FooCry` is a cryfs FUSE mount that takes **613ms** to `statvfs`. The sysinfo `Disks::new_with_refreshed_list()` calls `statvfs` on every mount entry in `/proc/mounts`, and this one blocks.
This is an environment issue, not a code regression. Benchmarks run on this machine while the vault is mounted will be skewed. Potential fix: skip `fuse.*` filesystem types in disk detection.

### Session Notes — June 25, 2026 (v0.3.25)
**Nixpkgs PR #535318**: open resubmission of #534754 with correct single-commit structure, filled PR template, `Assisted-by:` trailer, and AI disclosure.
Added `l1a` to `maintainers/maintainer-list.nix` in the nixpkgs fork.
`just nixpkgs-release` automation script added (`scripts/nixpkgs_release.py`).

### Session Notes — June 24, 2026 (v0.3.24)
Local benchmark uploads have been updated to run sequential pairwise comparisons for standard (`retch` vs `fastfetch`), short (`retch --short` vs `fastfetch -c none`), and long (`retch --long` vs `fastfetch -c all`) modes.
**Default Output Set**: The new Physical Disk and Physical Memory modules should not be shown in the default set (they should only be shown in long/custom fields) to preserve default CLI runtime speed and avoid unnecessary overhead.

### Session Notes — June 14, 2026
macOS WiFi SSID + link rate display. Branch: `refactor/macos-wifi-link-rate` (PR #90).
Three-tier SSID fallback via CoreWLAN ObjC FFI, `/usr/sbin/ipconfig getsummary <iface>`, and "Connected" placeholder.
Transmit rate via `CWInterface.transmitRate`. Receive rate is not available on any public/private macOS API.

### Commit Attribution guidelines
All commits use the format:
```
Assisted-By: Claude Sonnet 4.6
```
(Adjust the model name depending on the assistant version that worked on the task).
