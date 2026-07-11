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
    fields.rs                   ← single source of truth for the field list +
                                   output strata (see §5 "Field wiring")
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
- **Pre-PR Gate**: Never call `gh pr create` directly — always run `just open-pr` instead (any args are forwarded to `gh pr create`). `open-pr` runs `just pr` first (the full checklist: branch, version bump, AGENTS.md/NOTES.md header, man page, Cargo.lock, fmt+clippy, tests, plus the manual checklist requiring an explicit `y` confirmation for README/release-log/wiki/tldr updates) and only calls `gh pr create` if that passes. This is enforced by the Justfile, not by any editor/agent-specific config, so it applies the same way whether a human, Claude, or any other coding agent is driving — `gh`/`git` have no hook of their own for "PR about to open," so `just open-pr` is the one call site that actually gates it. Note: the tldr checklist item means updating `docs/retch.md` only — do **not** run `just tldr-release` (upstream submission on hold).
- **Git hooks are the actual enforcement layer, not agent config**: `scripts/hooks/pre-push` (installed via `just install-hooks` into `.git/hooks/pre-push`) runs `just check` (fmt+clippy) before every `git push`, regardless of what invoked it — a human, Claude Code, or any other agent, since it's real git plumbing, not a Claude-specific hook. Prefer this pattern (a real git hook, or a Justfile recipe like `open-pr`) over anything under `.claude/` when the goal is "block an action no matter what tool is driving." `.claude/settings.json` hooks only fire inside Claude Code's own harness and are invisible to every other agent and to humans typing commands directly — do not rely on them as the sole enforcement for repo-wide rules.
  - **Code Documentation**: Review all changed public items (`pub fn`, `pub struct`, `pub enum`, fields) for accurate doc comments. Update any doc comments that describe old behavior. New functions with non-obvious logic must have a doc comment explaining the WHY, not just the what.
  - **Test Coverage**: Every new pure function must have unit tests. Every new CLI flag must appear in the `--help` integration test and have a smoke-test verifying it exits 0 and produces expected output. Every changed invariant (e.g. a filter condition gaining a new parameter) must have a test that exercises the new branch.
- **PR Test Plans**: After opening a PR, immediately run each item in the test plan checklist and update the PR body via `gh pr edit` to check off passed items. Do not leave all boxes unchecked. Items requiring manual human verification (e.g. runtime output) should be left unchecked with a note.
- **Documentation & Versioning Updates**: When branching to make changes, ensure the following updates are performed:
  - **Version Bump**: Increment the version in `Cargo.toml`, verify compilation, and run `cargo check` to update `Cargo.lock`.
  - **Man Pages**: Update `docs/retch.1.md` with new parameters/fields and run `just man` to rebuild `docs/retch.1`.
  - **README**: Add new features, command examples, or configuration keys to `README.md`.
  - **Roadmap & History**: Update `NOTES.md` by bumping the version in the "Current State" header and adding a new release log entry under "Major Achievements".
  - **GitHub Wiki**: Clone (`https://github.com/l1a/retch.wiki.git`) and update the corresponding wiki pages (`Configuration-and-Theming.md`, `Workspace-Architecture.md`, `Home.md`, `Development-Setup.md`).
  - **tldr Page**: Update the local `docs/retch.md` if new options are introduced. **Do NOT run `just tldr-release`** — the upstream submission to [tldr-pages/tldr](https://github.com/tldr-pages/tldr) was denied pending more community traction. Keep `docs/retch.md` and the `just tldr-release` workflow maintained, but hold all upstream submissions until further notice.
  - **Bumping Strategy**: If the changes are significant, ALWAYS ask the user whether to perform a major, minor, or patch version bump.
- **Command Redundancy**: Avoid running `just check && cargo test` sequentially since both build and check the project profiles, causing redundant background compilation cycles. Prefer `cargo test` during iteration and a final check before staging.
- **Cross-Machine `target/` via Syncthing**: This working directory (`~/Sync/git/retch`) is synced across multiple machines by Syncthing, including `target/`. `.cargo/config.toml` sets `rustflags = ["-C", "target-cpu=native"]`, so build artifacts compiled on one machine's CPU can be illegal-instruction (`SIGILL`) on another. If a build/test fails with a `SIGILL` in a build script or binary (not a compile error), the fix is `cargo clean` (or at minimum removing the offending crate's `target/debug/build/<crate>-*` dir) to purge the stale cross-CPU artifacts — **not** overriding/unsetting `RUSTFLAGS`, which would silently build without the native-CPU optimizations the config intends.
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

## Current State (v0.3.49)
- **Windows `cpu-usage` perf: drop the serial 200 ms sleep**: the CPU-usage field needs a
  delta between two samples. sysinfo enforces a ~200 ms minimum interval, so the code slept
  200 ms — and that sleep ran **serially, after** the concurrent probe scope, adding ~200 ms
  to every standard/long run. On Windows it now diffs a `GetSystemTimes` (kernel32) snapshot
  taken *before* the concurrent scope against a fresh one, so the collection window is the
  delta — no dedicated sleep in a normal run. A ~100 ms floor is topped up only when very
  few fields are requested (so an isolated `--fields cpu-usage` reads sensibly instead of
  sampling noise). Linux/macOS keep the sysinfo+sleep path (sysinfo's minimum interval).
  Measured on the AMD Ryzen AI MAX+ 395 box: standard mode 1757 ms → 1558 ms; isolated
  `--fields cpu-usage` ~340 ms → ~253 ms. `retch-sysinfo` bumped to `0.1.38`.
- **Windows `bluetooth` perf: drop PowerShell spawn (~12× faster field)**:
  `detect_bluetooth` on Windows no longer spawns PowerShell (`Get-Service bthserv` + two
  `Get-PnpDevice -Class Bluetooth` queries, ~1.8 s). Power state now comes from the
  `bthserv` service state via the Service Control Manager (advapi32); the adapter's
  hardware name via SetupAPI enumeration of the Bluetooth device class
  (`SetupDiGetClassDevsW` + `SetupDiGetDeviceRegistryPropertyW`); and connected devices via
  the classic `bthprops` Bluetooth API (`BluetoothFindFirstDevice` with `fReturnConnected`).
  Hand-written `extern "system"` FFI (no WinRT, no binding crate; links `bthprops`/`setupapi`).
  Measured on the AMD Ryzen AI MAX+ 395 box: `--fields bluetooth` ~1765 ms → ~150 ms;
  `--long` mode 3462 ms → 2934 ms (bluetooth was the `--long` pole). **Behavior change:** the
  "N connected" count now reflects *actually-connected* devices (what `fReturnConnected`
  returns), not the old count of all paired/present PnP device nodes — the label is now
  accurate and matches fastfetch. Adapter name is unchanged (e.g. "MediaTek Bluetooth
  Adapter"). `retch-sysinfo` bumped to `0.1.37`.
- **Windows `phys-mem` perf: drop PowerShell spawns (~4× faster field)**:
  `detect_physical_memory` on Windows no longer spawns PowerShell twice
  (`Get-CimInstance Win32_PhysicalMemory` + a `Win32_ComputerSystem` fallback, ~600 ms).
  It now reads the raw SMBIOS table via `GetSystemFirmwareTable('RSMB')` (kernel32) and
  parses type-17 (Memory Device) structures directly, with `GlobalMemoryStatusEx` as the
  VM fallback — hand-written `extern "system"` FFI, no new dependency. Measured on the AMD
  Ryzen AI MAX+ 395 box: `--fields phys-mem` ~597 ms → ~152 ms. **Display enhancement:** the
  SMBIOS Configured Memory Speed field (offset 0x20) is now surfaced, so Windows shows the
  actual running speed alongside the rated speed when they differ (e.g.
  `8× 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)`) — matching the Linux dmidecode behavior;
  the old WMI path only reported the rated speed. `retch-sysinfo` bumped to `0.1.36`.
- **Windows `phys-disk` perf: drop PowerShell spawn (~8× faster field)**:
  `detect_physical_disks` on Windows no longer shells out to PowerShell
  (`Get-PhysicalDisk | ConvertTo-Csv`, ~1.7 s of interpreter startup). It now opens
  each `\\.\PhysicalDriveN` (0..32) with zero desired access and queries native storage
  IOCTLs via hand-written `extern "system"` FFI (matching `win_reg.rs`, no new crate
  dependency): `IOCTL_STORAGE_QUERY_PROPERTY` (`StorageDeviceProperty` → model/bus type,
  `StorageDeviceSeekPenaltyProperty` → HDD vs SSD) and `IOCTL_DISK_GET_DRIVE_GEOMETRY_EX`
  → total size. Both IOCTLs are `FILE_ANY_ACCESS`, so **no elevation is required**
  (deliberately avoids `IOCTL_DISK_GET_LENGTH_INFO`, which needs read access → admin).
  Classification mirrors the old parser exactly (NVMe bus → "NVMe SSD"; seek penalty →
  "HDD"; otherwise "SSD"), and the model string reproduces `Get-PhysicalDisk`'s
  `FriendlyName` (generic "ATA" vendor id suppressed). Measured on the AMD Ryzen AI MAX+
  395 / Windows 11 box: `--fields phys-disk` ~1684 ms → ~210 ms; output verified
  byte-identical to `Get-PhysicalDisk`. First of the Windows PowerShell-spawn probe
  migrations tracked in WIP.md. `retch-sysinfo` bumped to `0.1.35`.
- **Pre-PR gate + CI now cover `retch-sysinfo` (`--workspace`)**: the root `Cargo.toml`
  is both the `retch-cli` package and the workspace root, so a bare `cargo test` /
  `cargo clippy` only covered `retch-cli` and silently skipped the `crates/sysinfo`
  member — exactly where most probe code (and this phys-disk change) lives. `just check`,
  `just test`, `just lint`, the `just pr` test/check/`cargo check` steps, and both
  `rust.yml` CI jobs now pass `--workspace`. Target scope is unchanged (lib + bins, not
  `--all-targets`), so test/bench code is still not linted. AGENTS.md §4.0/§4.1 updated
  to match. This gap let the new phys-disk FFI's clippy lints go unchecked until caught
  by hand; the gate now enforces them.
- **`just bench-cli`/`bench-compare` fixed on Windows**: the recipes passed a POSIX-style
  `./target/release/retch` to hyperfine, whose default shell is `cmd.exe` on Windows —
  which can't execute that path (forward slashes, no `.exe`), so hyperfine aborted with a
  non-zero warmup exit. Added an `os_family()`-selected `retch_release_bin` Justfile
  variable (`target\release\retch.exe` on Windows, `./target/release/retch` elsewhere) and
  routed all bench hyperfine calls through it. `just bench` (criterion) was never affected.
  Justfile-only; verified both recipes now run to completion on Windows.
- **Windows `net` perf fix (~7× faster `--short`)**: `detect_active_interface_and_local_ip`
  no longer spawns PowerShell (`Get-NetRoute`) to find the default-route interface on
  Windows — that single spawn cost ~977 ms and dominated every mode (`net` is in
  short/standard/long). It now derives the active interface as the adapter whose
  sysinfo-reported IPs include the outbound `local_ip` (already resolved via the
  UDP-connect trick), via the new pure `match_active_interface` helper. Measured on an
  AMD Ryzen AI MAX+ 395 / Windows 11 box: `--short` 1149 ms → 163 ms. Same
  `active_interface` value as before (verified: matches the "Wi-Fi" adapter), so display
  behavior is unchanged; falls back to `None` only when no adapter IP matches (offline),
  which degrades gracefully to the existing "first Up interface" display path.
  `retch-sysinfo` bumped to `0.1.34` for the library behavior change.
- **`update_wip.py` substitutions bounded with `count=1`**: the v0.3.42 regex retarget
  (below) rewrote *every* line containing the header string — including verbatim mentions
  in WIP.md's notes/open-task prose — which clobbered task lines during the #142 merge.
  Both `re.sub` calls now pass `count=1` so only the first (top-of-file header) occurrence
  is rewritten. Verified against a sample with the header strings in both a header line and
  later prose. Docs/tooling only.
- **`update_wip.py` fixed**: the post-merge WIP updater now targets the current
  `**main HEAD**:` header (it previously matched an obsolete `**Latest commit on main**:`
  line and silently no-op'd, leaving the pointer stale after every merge). It also
  reconstructs the `— **v<version>**` suffix from `Cargo.toml` and forces UTF-8 on file
  I/O, subprocess decoding, and stdout so commit subjects containing `→`/em-dashes (common
  in this repo) don't crash `just merge-pr` on a cp1252 Windows console. Docs/tooling only.
- **WIP.md handling wording**: AGENTS.md §5, the `just merge-pr` recipe, and the
  helper script now consistently say *update* (not *reset*) WIP.md, reflecting that
  WIP.md is an ongoing rolling log whose notes/open-tasks are preserved across merges.
  `scripts/reset_wip.py` was renamed to `scripts/update_wip.py`. Docs/tooling only —
  no runtime behavior change.
- **Field registry**: The displayable-field list and its output strata now live in
  one place — `src/fields.rs` (`FIELDS` table + `Mode` enum). `main.rs` (collection)
  and `display.rs` (display) derive their per-strata allow-lists from
  `fields::fields_for(mode)`, and both config-generation paths (`main.rs`'s
  full-write template and `config.rs`'s `merge_defaults`) derive the commented
  `fields = [...]` block from `fields::config_fields_block()`. This replaced the
  four in-code copies that previously drifted. Two guardrail tests in
  `tests/cli_tests.rs` assert every registry key is documented in `README.md` and
  `docs/retch.1.md` and appears in generated config, so drift now fails CI.
- **Security**: `cargo audit` clean — `crossbeam-epoch` bumped `0.9.18 → 0.9.20`
  (Cargo.lock only) to clear RUSTSEC-2026-0204 (invalid pointer dereference in the
  `fmt::Pointer` impl for `Atomic`/`Shared`). Transitive dependency via `rayon`
  (`image`/graphics feature and dev-only `criterion`); no manifest change.
- **Pre-PR gate now runs `cargo audit`**: `just pr` step 8 installs `cargo-audit`
  if missing, then runs it and prints any advisories. It is **advisory only** (never
  blocks the gate) so newly-published advisories against unchanged transitive deps
  don't hard-fail otherwise-ready work — it surfaces them locally before the separate
  (also non-required) CI `audit` job does. The RUSTSEC-2026-0204 miss motivated this:
  the gate never ran audit, so nothing caught it before CI.
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
- **Storage**: Added `btrfs` (label + space allocation via `btrfs filesystem show`/`usage`, Linux) and `zpool` (ZFS pool allocation + health via `zpool list`, Linux/macOS) fields, both in `--long` and above.
- **Physical Memory**: `phys-mem` now reports the module's actual running speed alongside
  its rated speed on Linux when they differ (dmidecode's "Configured Memory Speed" vs.
  "Speed"), e.g. `4800 MT/s (rated 6000 MT/s)`. The `Memory` display label was renamed to
  `Memory Usage` for clarity (config/`--fields` key `memory` unaffected via an alias).
- **Tooling**: `just open-pr` is now the only sanctioned way to open a PR — it runs
  `just pr`'s full checklist and only calls `gh pr create` if it passes, since `gh` has
  no hook of its own to gate it otherwise. `scripts/hooks/pre-push` remains the
  agent-agnostic enforcement layer for `git push` (real git hook, fires for any tool or
  human, not just one AI agent's config).

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
- **"Real hardware" benchmark section on the wiki**: The wiki benchmark pages
  currently reflect CI-runner / local numbers, which are noisy and not
  representative (e.g. GitHub-hosted runners, or local runs skewed by FUSE
  statvfs delays — see §9 session notes). Add a dedicated "real hardware"
  benchmarks section documenting retch-vs-fastfetch timings measured on actual
  physical machines (with CPU/OS/spec context per run), so the published numbers
  are meaningful rather than runner-dependent.
- **Package repository submissions**: Submit retch to AUR (Arch User Repository) and nixpkgs so it appears in the [Repology](https://repology.org/project/retch/versions) packaging status widget. The Nix flake (contributed by @quixaq) is a useful starting point for the nixpkgs submission.
- **macOS code signing & notarization**: Sign and notarize the macOS release binary so users don't need to run `xattr -dr com.apple.quarantine` after downloading. Requires Apple Developer Program membership and CI secrets.
- **Homebrew tap / formula**: Publish a `homebrew-retch` tap or submit a formula to Homebrew core so macOS users can `brew install retch`.
- **FUSE mounts in `--full`**: v0.3.26 skips all `fuse.*` mounts to avoid 600ms+ hangs from cryfs/EncFS vaults. The `--full` mode redesign (§4) resolves this by re-enabling `statvfs` for fuse.* entries in `--full` only — no separate config key or flag needed.
- ~~**Field wiring de-duplication (tech debt)**~~ — resolved in v0.3.39. The field
  list is now a single `FIELDS` table in `src/fields.rs`. The four *in-code* copies
  (`main.rs` collection allow-lists + config template, `display.rs` display
  allow-lists, `config.rs`'s `DEFAULT_FIELDS_BLOCK`) all derive from it via
  `fields::fields_for(mode)` / `fields::config_fields_block()`. The two *doc* copies
  (`docs/retch.1.md`, `README.md`) can't be generated from Rust, so a guardrail test
  (`test_docs_cover_all_registry_fields`) fails CI if either omits a registry key —
  which caught real pre-existing drift when added (the man page was missing
  `cpu-cache`/`cpu-usage`/`public-ip`; README was missing `gamepad`/`public-ip`).
  *Not folded in (deliberate):* the per-collector `should_collect("…")` calls in
  `crates/sysinfo/src/fetch.rs` remain decentralized — each collector checks its own
  key, matching is spelling-tolerant, and it lives across the crate boundary, so the
  drift risk there is low and unifying it would widen the blast radius.

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
- ~~**Btrfs**: Btrfs volume info~~ — added in v0.3.37 (`btrfs` field)
- ~~**Zpool**: ZFS storage pool info~~ — added in v0.3.37 (`zpool` field)
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

### v0.3.49 - Windows cpu-usage: no serial sleep (July 11, 2026)
- **Root cause**: CPU usage is a delta between two CPU-time samples; sysinfo enforces a
  ~200 ms minimum refresh interval, so `collect()` slept 200 ms then called
  `refresh_cpu_usage()`. That sleep ran **serially after** the concurrent `thread::scope`,
  so it added ~200 ms to the wall-clock of every standard/long run (not a PowerShell spawn
  — the odd one out in the migration list, but a real serial cost).
- **Fix (Windows)**: sample `GetSystemTimes` (kernel32, default-linked) just before the
  concurrent scope and diff against a fresh sample at the usage-computation point, so the
  existing collection window *is* the delta — no dedicated sleep. A pure `usage_percent`
  helper (kernel-includes-idle math) carries unit tests. A ~100 ms floor is topped up only
  when the collection window is shorter than that (e.g. an isolated `--fields cpu-usage`),
  so a tiny request still reads a real value rather than `GetSystemTimes` quantization noise.
  Linux/macOS are unchanged (sysinfo + 200 ms sleep) because sysinfo's minimum interval
  makes the window-diff approach unreliable there.
- **Result** (AMD Ryzen AI MAX+ 395, Windows 11): standard mode 1757 ms → 1558 ms; isolated
  `--fields cpu-usage` ~340 ms → ~253 ms. Verified stable idle readings (~0.5–1.7%) across
  repeated isolated runs (previously ~50% sampling noise before the floor was added).
- **Version**: Bumped to `0.3.49` / `retch-sysinfo 0.1.38` (library behavior change).

### v0.3.48 - Windows bluetooth: native bthprops + SetupAPI (July 11, 2026)
- **Root cause**: `detect_bluetooth` on Windows spawned PowerShell (`Get-Service bthserv`
  + two `Get-PnpDevice -Class Bluetooth` queries), ~1.8 s — the single biggest Windows
  probe. Third of the per-probe migrations (after phys-disk #146, phys-mem #147).
- **Fix** (three native sources, all hand-written `extern "system"` FFI, no WinRT):
  - Power state: `bthserv` service state via the Service Control Manager (advapi32,
    default-linked) — the same signal the old `Get-Service` used.
  - Adapter name: SetupAPI enumeration of `GUID_DEVCLASS_BLUETOOTH`
    (`SetupDiGetClassDevsW`/`SetupDiEnumDeviceInfo`/`SetupDiGetDeviceRegistryPropertyW`),
    filtered by the same name keywords the old PowerShell used. Links `setupapi`.
  - Connected devices: the classic `bthprops` API (`BluetoothFindFirstDevice`/
    `BluetoothFindNextDevice` with `BLUETOOTH_DEVICE_SEARCH_PARAMS{fReturnConnected}`).
    Links `bthprops`. The device-info struct layout was validated at runtime (correctly
    read a device name + `fConnected` flag) before trusting the count.
- **Behavior change (improvement)**: "N connected" now counts *actually-connected*
  devices, not the old count of all paired/present Bluetooth PnP nodes (which the old code
  mislabeled as "connected"). Matches fastfetch semantics. Adapter display unchanged.
- **Result** (AMD Ryzen AI MAX+ 395, Windows 11): `--fields bluetooth` ~1765 ms → ~150 ms
  (~12×); `--long` mode 3462 ms → 2934 ms. Verified adapter name matches the old
  `Get-PnpDevice` output ("MediaTek Bluetooth Adapter").
- **Version**: Bumped to `0.3.48` / `retch-sysinfo 0.1.37` (library behavior change).

### v0.3.47 - Windows phys-mem: native SMBIOS table (July 11, 2026)
- **Root cause**: `detect_physical_memory` on Windows spawned PowerShell twice
  (`Get-CimInstance Win32_PhysicalMemory` for DIMM rows + a `Win32_ComputerSystem` VM
  fallback), ~600 ms of interpreter startup. Second of the per-probe PowerShell-spawn
  migrations (after phys-disk #146).
- **Fix**: read the raw SMBIOS table via `GetSystemFirmwareTable('RSMB')` (kernel32) and
  parse type-17 (Memory Device) structures directly; `GlobalMemoryStatusEx` provides the
  VM total-memory fallback. Hand-written `extern "system"` FFI (matching `win_reg.rs`), no
  new dependency. A pure `parse_smbios_type17` fn (bounds-checked structure walk over the
  double-null-terminated string sets) carries the unit tests.
- **Display enhancement**: the SMBIOS Configured Memory Speed field (offset 0x20) is now
  read, so Windows surfaces the actual running speed vs the rated speed when they differ
  (e.g. `8× 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)`), matching the Linux dmidecode path.
  The old `Win32_PhysicalMemory` route only reported the rated speed. Verified against
  `Get-CimInstance Win32_PhysicalMemory` (Speed 8533 / ConfiguredClockSpeed 8000) on the
  AMD Ryzen AI MAX+ 395.
- **Offset gotcha (caught by runtime verification)**: SMBIOS Speed is at offset 0x15, not
  0x14 (0x13–0x14 is the Type Detail WORD). The initial self-consistent unit tests encoded
  the wrong offset and passed; comparing live output to WMI exposed it.
- **Result** (AMD Ryzen AI MAX+ 395, Windows 11): `--fields phys-mem` ~597 ms → ~152 ms
  (~4×). Standard-mode wall-clock is unchanged for now — `camera` (~1359 ms) still masks it
  until that probe is migrated.
- **Version**: Bumped to `0.3.47` / `retch-sysinfo 0.1.36` (library behavior change).

### v0.3.46 - Windows phys-disk: native storage IOCTLs (July 11, 2026)
- **Root cause**: `detect_physical_disks` on Windows spawned PowerShell
  (`Get-PhysicalDisk | Select-Object … | ConvertTo-Csv`) — ~1.7 s of interpreter startup
  isolated by the per-field timing sweep, one of the ~7 remaining PowerShell-spawn probes
  making retch slower than fastfetch on Windows. `phys-disk` is in standard/`--long`, so it
  slowed the common run.
- **Fix**: enumerate `\\.\PhysicalDrive0..31` with `CreateFileW` (zero desired access) and
  query native storage IOCTLs via hand-written `extern "system"` FFI, matching the crate's
  existing Windows FFI style (`win_reg.rs`) — **no new dependency** (WIP.md had floated
  `windows-sys`; the raw-extern house convention was used instead). `IOCTL_STORAGE_QUERY_PROPERTY`
  yields the device descriptor (model, bus type) and seek-penalty descriptor (HDD vs SSD);
  `IOCTL_DISK_GET_DRIVE_GEOMETRY_EX` yields total size. Both are `FILE_ANY_ACCESS`, so the
  probe needs no admin rights.
- **Parity**: classification and label format are unchanged; the model string reproduces
  `Get-PhysicalDisk`'s `FriendlyName` (generic "ATA" SATA vendor id suppressed). Pure
  `format_disk_label`/`combine_model` helpers replace the old CSV parser and carry the unit
  tests.
- **Result** (AMD Ryzen AI MAX+ 395, Windows 11): `--fields phys-disk` ~1684 ms → ~210 ms
  (~8×); output verified byte-identical to `Get-PhysicalDisk`.
- **Gate/CI gap fixed (`--workspace`)**: found while verifying this change — a bare
  `cargo test`/`cargo clippy` at the root only covers the `retch-cli` package and skips
  the `retch-sysinfo` workspace member (where this change lives). The `just` recipes
  (`test`, `lint`, `check`) and both `rust.yml` CI jobs now pass `--workspace` (lib+bins
  scope unchanged, no `--all-targets`); AGENTS.md §4.0/§4.1 updated. The phys-disk FFI's
  `HANDLE` acronym lint that this surfaced is fixed in-place.
- **Version**: Bumped to `0.3.46` / `retch-sysinfo 0.1.35` (library behavior change).

### v0.3.45 - Fix bench-cli/bench-compare on Windows (July 10, 2026)
- **Bug**: `just bench-cli` and `just bench-compare` failed on Windows. They invoked
  `hyperfine … './target/release/retch'`; with no `--shell`, hyperfine uses `cmd.exe` on
  Windows, which can't run that POSIX-style path (forward slashes, no `.exe`), so it exited
  1 in the first warmup run and hyperfine aborted the recipe. `retch` itself was fine
  (exits 0) and `just bench` (criterion) was unaffected.
- **Fix**: new Justfile variable `retch_release_bin := if os_family() == "windows" {
  'target\release\retch.exe' } else { './target/release/retch' }`, used by all bench
  hyperfine invocations. Verified on Windows: `just bench-cli` and `just bench-compare`
  now run all comparisons to completion (exit 0).
- **Justfile-only**: no Rust source or library change.
- **Version**: Bumped to `0.3.45` (`retch-sysinfo` unchanged at `0.1.34`).

### v0.3.44 - Windows net-detection perf: drop PowerShell spawn (July 10, 2026)
- **Root cause**: `detect_active_interface_and_local_ip` shelled out to PowerShell
  (`Get-NetRoute -DestinationPrefix 0.0.0.0/0 …`) on Windows to name the default-route
  interface. PowerShell startup is ~977 ms, and since the `net` field is in every mode,
  this inflated `--short`/standard/`--long` alike. Isolated by per-field timing: every
  other `--short` field was ~135 ms; `net` was ~1183 ms.
- **Fix**: identify the active interface as the adapter whose sysinfo-reported IPs contain
  the outbound `local_ip` (already computed via the UDP-connect trick) — no process spawn,
  no new dependency, no FFI. Extracted a pure `match_active_interface` helper with a unit
  test. On Windows sysinfo reports the "Wi-Fi" adapter with its IP, so the resolved active
  interface matches what the old PowerShell alias produced; display is unchanged.
- **Result** (AMD Ryzen AI MAX+ 395, Windows 11): `--short` 1149 ms → 163 ms (~7×).
  retch is still ~2.6× behind fastfetch's 63 ms in short mode on Windows (startup margin,
  tracked separately), but the pathological ~1 s spawn is gone. Wiki
  `Compared-to-fastfetch-and-neofetch.md` "Real-hardware benchmarks" section carries the
  pre-fix numbers and the investigation note.
- **Version**: Bumped to `0.3.44` / `retch-sysinfo 0.1.34` (library behavior change).

### v0.3.43 - update_wip.py: bound substitutions with count=1 (July 10, 2026)
- **Follow-up to v0.3.42**: the retargeted `**main HEAD**:` regex had no `count`, so it
  rewrote every line containing that header string. WIP.md's open-task prose mentions the
  header verbatim, so the #142 merge clobbered those task lines (repaired by hand). Both
  `re.sub` calls (Active-Branch and main-HEAD) now pass `count=1`, rewriting only the first
  top-of-file header occurrence and leaving prose intact. Verified end-to-end against a
  sample containing the header strings in both a header line and later prose.
- **Docs/tooling only**: no Rust source touched.
- **Version**: Bumped to `0.3.43` (`retch-sysinfo` unchanged at `0.1.33`).

### v0.3.42 - Fix update_wip.py post-merge updater (July 10, 2026)
- **Stale-pointer bug**: `scripts/update_wip.py` matched an obsolete
  `**Latest commit on main**:` line that no longer exists in WIP.md, so the substitution
  silently no-op'd and left `**main HEAD**:` stale after every `just merge-pr` (observed
  live after the #141 merge). Regex retargeted to `**main HEAD**:`, output rewritten to the
  current format (backtick hash — subject — **v<version>**), with the version read from
  `Cargo.toml`. A function replacement is used so regex metacharacters in a commit subject
  are treated literally.
- **Windows UTF-8 crash averted**: because the fix now writes the commit subject into
  WIP.md, and this repo's subjects contain `→`/em-dashes, `Path.read_text`/`write_text`,
  `subprocess` decoding, and stdout are all pinned to UTF-8 — otherwise the default cp1252
  console/locale on the Windows dev box would crash the script mid-merge. Verified
  end-to-end against a commit subject containing `→`.
- **Docs/tooling only**: no Rust source touched.
- **Version**: Bumped to `0.3.42` (`retch-sysinfo` unchanged at `0.1.33`).

### v0.3.41 - WIP.md handling wording: "reset" → "update" (July 10, 2026)
- **Consistent "update" wording**: AGENTS.md §5 ("reset `WIP.md`" → "update `WIP.md`",
  with a clarifying note that WIP.md is a rolling log, not reset per-PR), the
  `just merge-pr` recipe comment, and the helper script now all say *update*. This
  aligns the docs/tooling with WIP.md's own protocol header ("never reset per-PR").
- **Script rename**: `scripts/reset_wip.py` → `scripts/update_wip.py` (via `git mv`);
  `Justfile` `merge-pr` updated to call the new name. Script behavior is unchanged — it
  still only rewrites the Active-Branch and latest-commit lines and preserves the
  notes/open-task sections. (Pre-existing note: the script's `**Latest commit on main**:`
  regex predates the current WIP header format and is left as-is — out of scope here.)
- **Backlog**: added the "real hardware" benchmark section item to §5 Future Work.
- **Docs/tooling only**: no Rust source touched, no runtime behavior change.
- **Version**: Bumped to `0.3.41` (`retch-sysinfo` unchanged at `0.1.33`).

### v0.3.40 - Single field registry (field-wiring de-duplication) (July 10, 2026)
- **`src/fields.rs`**: new single source of truth for the displayable-field list.
  A `FIELDS` table pairs each canonical field key with the least-verbose `Mode`
  (`Short`/`Standard`/`Long`/`Full`) it appears in; modes are strictly nested so one
  `min_mode` per field defines all four strata. Exposes `fields_for(mode)` and
  `config_fields_block()`.
- **Consumers rewired**: `main.rs` (collection allow-lists + the full-config
  template) and `display.rs` (display allow-lists) now call `fields_for(mode)`;
  `config.rs`'s `merge_defaults` and `main.rs`'s `default_config_content` both emit
  the commented `fields = [...]` block via `config_fields_block()`. Removed ~318
  lines of hand-duplicated `&str` lists across four in-code sites that had already
  drifted apart.
- **Docs corrected + guarded**: fixed pre-existing drift the consolidation exposed —
  `docs/retch.1.md` was missing `cpu-cache`, `cpu-usage`, `public-ip` and spelled
  `terminal_font`; `README.md` was missing `gamepad`, `public-ip`. New guardrail
  tests (`test_docs_cover_all_registry_fields`,
  `test_generated_config_covers_all_registry_fields`) fail CI if any registry key is
  undocumented or missing from generated config, so the drift can't silently return.
- **Behavior preserved**: strata sets are byte-for-byte identical (unit tests pin
  short=8 / standard=19 / long=46 / full=52, strict nesting, and exact membership);
  short/standard/full verified at runtime. Pure internal refactor — no user-visible
  behavior change.
- **Version**: Bumped to `0.3.40` (`retch-sysinfo` unchanged at `0.1.33`).

### v0.3.39 - Security: bump crossbeam-epoch (RUSTSEC-2026-0204) (July 10, 2026)
- **cargo audit fix**: `crossbeam-epoch` `0.9.18 → 0.9.20` (Cargo.lock only) clears
  RUSTSEC-2026-0204 — an invalid pointer dereference in the `fmt::Pointer` impl for
  `Atomic`/`Shared` when the underlying pointer is invalid. Pulled in transitively
  through `rayon` (`image`/graphics feature and dev-only `criterion`); no direct
  dependency or manifest change. The `paste` unmaintained warning (RUSTSEC-2024-0436)
  remains an allowed, non-blocking warning.
- **`just pr` gains an audit step**: step 8 now runs `cargo audit` (auto-installing
  `cargo-audit` if absent), advisory-only so it never blocks the gate. Documented in
  AGENTS.md §4.0. This closes the gap that let RUSTSEC-2026-0204 reach CI unnoticed —
  the local gate previously never invoked audit at all.
- **Version**: Bumped to `0.3.39` (`retch-sysinfo` unchanged at `0.1.33`).

### v0.3.38 - Configured vs. rated memory speed, PR-gate tooling (July 2, 2026)
- **`phys-mem` configured speed**: on Linux, `DimmSlot` now carries a `configured_speed_mt`
  parsed from `dmidecode --type 17`'s "Configured Memory Speed" field, separate from the
  existing "Speed" (rated/max). `format_dimm_slots` shows both when they differ, e.g.
  `2× 16 GB DDR5 4800 MT/s (rated 6000 MT/s)` — surfaces cases like XMP/EXPO not being
  enabled, where the module runs below spec. macOS/Windows sources don't distinguish the
  two, so `configured_speed_mt` is always `None` there; behavior unchanged.
  `retch-sysinfo` bumped to `0.1.33` for the public `DimmSlot` field addition.
- **`Memory` → `Memory Usage` display label**: renamed for clarity against `phys-mem`
  ("Phys Mem"). The `--fields`/config key `memory` still matches via an alias in
  `should_show()` (same pattern as the existing `dns`/"DNS Server" alias) — config files
  written against the old docs keep working.
- **`just open-pr` recipe**: the only sanctioned way to open a PR now — runs `just pr`'s
  full checklist first, then `gh pr create`, since `gh` has no hook mechanism of its own
  to gate PR creation. Direct `gh pr create` calls are no longer documented as valid.
- **Agent-agnostic tooling principle documented**: NOTES.md and AGENTS.md now explicitly
  call out that `.claude/`-scoped hooks only bind Claude Code and are invisible to any
  other agent or a human typing commands directly — prefer real git hooks
  (`scripts/hooks/pre-push`) and Justfile recipes (`just open-pr`) for anything that
  needs to hold regardless of which tool is driving.
- **Version**: Bumped to `0.3.38` / `retch-sysinfo 0.1.33`.

### v0.3.37 - Btrfs and Zpool storage fields (July 1, 2026)
- **`btrfs` field**: reports label + subvolume + used/allocated space per mount point
  (not deduplicated by device — an earlier draft did that and silently dropped `/home`
  when `/` and `/home` are separate subvolumes of the same underlying filesystem;
  fixed after review caught it, see subvol parsing in `parse_mount_line`). Snapshot
  count is included via `btrfs subvolume list -s` when readable (requires root) and
  omitted — not shown as zero — otherwise. Shells out to `btrfs filesystem show`/`usage
  --raw`. Linux only. New module `crates/sysinfo/src/btrfs.rs`.
- **`zpool` field**: reports name, allocation, and health for each imported ZFS pool
  via `zpool list -H -p`. Linux and macOS (OpenZFS); returns empty if the `zpool`
  binary isn't installed rather than erroring. New module `crates/sysinfo/src/zfs.rs`.
- Both fields are subprocess-based and gated behind `--long` and above, following the
  same fast-inline-vs-thread-scope split as other subprocess fields (bios, wifi, ...).
- Closes both Storage & Filesystems feature-gap items from §6.
- **Version**: Bumped to `0.3.37` / `retch-sysinfo 0.1.32`.

### v0.3.36 - Untap aws/tap in macOS benchmark CI (cosmetic) (July 1, 2026)
- **CI annotation cleanup**: The macOS benchmark job (`benchmark.yml`) was surfacing
  "aws/tap is not trusted" Homebrew warnings as GitHub Actions annotations on every
  run — caused by an `aws/tap` Homebrew tap pre-installed on the GitHub-hosted
  `macos-latest` runner image, unrelated to `fastfetch`/`hyperfine` installation.
  Added a `brew untap aws/tap || true` step before the install step to silence it.
  Purely cosmetic — nothing was failing.
- **Version**: Bumped to `0.3.36`.

### v0.3.35 - Add Development-Setup.md to wiki checklist, catch up wiki (July 1, 2026)
- **AGENTS.md §4.8**: Added `Development-Setup.md` to the wiki checklist — it was
  omitted when the checklist was first written, even though the page documents
  `just` recipes and was directly affected by the `just pr`/`just merge-pr` additions.
- **Wiki catch-up**: Documented `just pr`/`just merge-pr` in `Development-Setup.md`
  and fixed a stale `pandoc` reference (the Justfile/flake use `mandown`) — done
  directly on the wiki since wiki edits aren't gated by PR review.
- **Version**: Bumped to `0.3.35`.

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
