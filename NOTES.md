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

## Current State (v0.6.3)
- **v0.6.3 — dependency + CI-action bumps (consolidated Dependabot #161/#163/#164)**
  (chore; no runtime behavior change). Rolls three open Dependabot PRs into one gated PR so
  the release-hygiene steps Dependabot skips (retch version bump, NOTES/man regen) are done:
  - **8 Rust crates** (`cargo-dependencies` group, #164), all patch-level, lockfile-only
    (specs are caret ranges so `Cargo.toml` is untouched): `clap` 4.6.1→4.6.4 (pulls
    `syn` v3 via `clap_builder`/`clap_derive`), `serde` 1.0.228→1.0.229, `toml`
    1.1.2→1.1.3, `clap_complete_nushell` 4.6.0→4.6.1, `anyhow` 1.0.103→1.0.104, `libc`
    0.2.186→0.2.189, `sysinfo` 0.39.5→0.39.6, `serde_json` 1.0.150→1.0.151.
  - **2 GitHub Actions**: `actions/checkout` 7.0.0→7.0.1 (#163 — both the SHA-pinned and
    `@v7`→`@v7.0.1` uses across benchmark/claude/claude-code-review/packaging/rust/security)
    and `softprops/action-gh-release` 3.0.1→3.0.2 (#161, rust.yml release job).
  - `retch-cli` → 0.6.3; `retch-sysinfo` unchanged (`0.1.46` — no source change, only its
    transitive lockfile deps moved). Patch bump. All workspace tests/clippy/fmt green.
- **v0.6.2 — unblock `just pr` on Linux: machine-independent display tests + man-page
  regen** (docs/test hygiene; no runtime behavior change). Two coupled fixes, bundled
  because the second is what actually let the gate pass on the reinstalled Fedora box:
  - **Machine-independent xrandr display tests** (`crates/sysinfo/src/display.rs`,
    `retch-sysinfo` → `0.1.46`). `parse_xrandr_displays` called `get_monitor_name_for_port`
    directly, which reads live `/sys/class/drm/*/edid`, so the "parse this fixture" tests
    substituted whatever monitor was physically attached to the test machine for the
    fixture's connector name. They were `#[cfg(not(macos/windows))]`, so they never ran on
    the old Windows arrakis; the first `cargo test` after the Fedora reinstall failed
    (`DP-1` → the panel's EDID model `ATNA33AA08-0`). Same defect class as #155. Fix
    (same pattern as #155): extracted a pure `parse_xrandr_displays_with(stdout, resolve)`
    parameterised over the port→name resolver; the public `parse_xrandr_displays` passes
    `get_monitor_name_for_port` (production unchanged), and the fixture tests pass `|_| None`
    so they assert connector names. Added a regression test asserting the resolver *is*
    honored when it returns `Some`. No runtime change.
  - **Man page regen** (`docs/retch.1`). The committed page carried double-bold groff runs
    (`\fB\fB…\fP\fP`) from the Windows #160 `just man` run, where the recipe's
    `sed 's/\\fB\\fB/\\fB/g'` strip didn't take effect. `just man` on Linux produces the
    intended single-bold output (0 double-bold sequences), matching the recipe's intent, so
    the Linux output is canonical. **Cross-machine caveat:** a future Windows `just man` may
    re-introduce the double-bold diff; the next Windows session should regenerate and expect
    the single-bold form (tracked in WIP.md).
  - Patch bump. `retch-sysinfo` → `0.1.46` (new `pub parse_xrandr_displays_with`).
- **v0.6.1 — fix two Windows output bugs: `Camera` listing scanners, `Users` = 0**
  (Windows cross-platform-parity series, bugfix group):
  - **Camera**: the Windows path enumerated the `Camera` **and** `Image` (WIA) *setup*
    classes, but scanners/printers share the Image class with some real webcams (a
    Logitech BRIO is Image-class here), so a scanner (`EPSON ET-3850 Series`) was listed as
    a camera. Fixed by enumerating the `KSCATEGORY_VIDEO_CAMERA` **device-interface** class
    instead (`win_setupapi::present_interface_device_names`, new `DIGCF_DEVICEINTERFACE`
    path) — only real cameras register that interface, so scanners are excluded while
    Image-class webcams are kept. Also filters the synthetic "Windows Virtual Camera Device"
    (Windows-only helper `is_windows_virtual_camera`, so Linux/macOS virtual-cam naming is
    untouched). The now-unused `GUID_DEVCLASS_CAMERA`/`GUID_DEVCLASS_IMAGE` consts were
    removed. Verified live on arrakis: `Camera` now lists only `Logitech BRIO` + `ASUS FHD
    webcam` (EPSON scanner, ASUS IR camera, and the virtual camera all gone).
  - **Users**: `sysinfo`'s `Users` on Windows are keyed by SID, so the Unix `uid >= 1000`
    filter never matched and the count was 0. New `win_users` module counts active
    interactive login sessions via `WTSEnumerateSessionsW` + `WTSQuerySessionInformationW`
    (wtsapi32) — `query user`/"who" semantics; the pure `count_active_user_sessions` helper
    is unit-tested. Verified live: `Users: 1`. Additionally, per the "if it doesn't work,
    don't show it" request, `display.rs` now **suppresses `Users` when the count is 0**
    (mirrors the `packages` guard), so an undetermined count shows nothing rather than a
    misleading `0` (also hides the macOS 501-vs-1000 undercount case).
  - Non-Windows camera/users behavior unchanged. FFI house style (hand-written
    `extern "system"`, `// SAFETY:`, `size_of` layout guards for `WTS_SESSION_INFOW`).
    The camera enumeration change is FFI (verified live, not unit-testable); the virtual-cam
    filter, the WTS session-count logic, and the layout are unit-tested. `retch-sysinfo`
    → `0.1.45`. Patch bump (bugfixes).
- **v0.6.0 — Windows `domain` + `terminal-size` (cross-platform parity, quick wins)**:
  two `--long` fields that previously returned `None` on Windows now have native arms,
  the first of the Windows cross-platform-parity feature series (distinct from the earlier
  PowerShell→FFI *perf* migration). `domain` (`crates/sysinfo/src/network.rs`) queries the
  primary DNS suffix via `GetComputerNameExW(ComputerNameDnsDomain)` (kernel32, default-linked,
  two-call size probe); a workgroup host reports an empty suffix → `None` (the pure
  `clean_domain` helper maps empty→None), deliberately **not** the NetBIOS `WORKGROUP` name,
  matching the Linux/macOS `/etc/resolv.conf` DNS-domain semantics. `terminal-size`
  (`crates/sysinfo/src/terminal.rs`) reads the console viewport via `GetStdHandle` +
  `GetConsoleScreenBufferInfo`, using the **window** rect (not `dwSize`, which is the huge
  scrollback buffer); the pure `window_rect_to_size` helper does the inclusive-rect→`"CxR"`
  arithmetic. When stdout is redirected/piped there is no console → graceful `None` → the
  existing `$COLUMNS`/`$LINES` env fallback (same as Linux piped). Hand-written
  `extern "system"` FFI, no binding crate (house style). Both Linux/macOS arms are
  byte-identical (new `#[cfg(target_os = "windows")]` arms only). New tests: `clean_domain`,
  `window_rect_to_size`, and a `CONSOLE_SCREEN_BUFFER_INFO` `size_of` layout guard (Windows).
  Verified live on the AMD Ryzen AI MAX+ 395 box (arrakis): `domain` correctly absent
  (primary DNS suffix genuinely empty, confirmed vs `IPGlobalProperties`/registry);
  `terminal-size` renders `100x40` through the display path. `retch-sysinfo` → `0.1.44`.
  Minor bump (new user-visible fields on Windows). `load`/`editor`/`terminal-font` on Windows
  deliberately **not** implemented — no faithful native source (documented in the feature-gap
  notes).
- **v0.5.1 — fix nested ANSI color reset on the network line (`[Up]` bracket color)**:
  `owo_colors` closes every foreground color with `\x1b[39m` (reset to the terminal
  *default*, not to the enclosing color). The `Net` value embeds a green `"Up"` / red
  `"Down"` inside a value string that `Theme::color_value` wraps in the theme value color
  (white) and — for the **active** interface — `display.rs` additionally wraps in
  bright-blue. That inner reset dropped everything after `[Up]` (the closing `]` and the
  RX/TX stats) back to the terminal default: on the active interface the opening `[` was
  blue but the `]` was not, and on every interface the RX/TX tail lost the value color.
  Fixed with a new `colorize_nested(text, prefix)` helper (`src/theme.rs`) that re-asserts
  the enclosing color after every interior `\x1b[39m`, so nested colored spans restore the
  surrounding color instead of falling to default; it composes at arbitrary depth and is
  byte-identical to the old plain wrap when there is no nested reset (so **all non-`Net`
  fields are unchanged**). `Theme::color_value` routes through it, and the active-interface
  highlight uses it with the bright-blue prefix (`ACTIVE_IFACE_PREFIX`). Library
  `crates/sysinfo/src/network.rs` is untouched — the green/red `Up`/`Down` stays; only the
  CLI wrapping layers changed. Four regression tests cover the helper, including a
  "no default-colored tail" invariant. Verified live: the active `Net` line now renders
  name/brackets/RX/TX uniformly bright-blue with only `Up` green; non-active lines render
  the whole value in the value color with only `Up`/`Down` colored. CLI-only fix;
  `retch-sysinfo` unchanged at `0.1.43`. Patch bump.
- **v0.5.0 — three new Linux fastfetch-gap fields (`login-manager`, `brightness`,
  `power-adapter`)**: closes three of the NOTES §6 hardware/UI gaps, each a cheap
  single-source Linux probe in the simple sequential `detect_*` style (like `init`/`chassis`):
  `login-manager` resolves the `display-manager.service` systemd unit symlink (GDM/SDDM/
  LightDM/greetd/…); `brightness` reads `/sys/class/backlight/*/{brightness,max_brightness}`
  as a percentage; `power-adapter` reads the `Mains` supply under `/sys/class/power_supply`
  (name + connected state; wattage deliberately omitted — sysfs `Mains` rarely exposes it).
  All three are `--long`+, Linux-only (`None` elsewhere). Each has a **pure formatting helper**
  (`login_manager_from_unit`/`brightness_percent`/`format_power_adapter`) split out from its
  `/sys`-reading detector and unit-tested host-independently — applying the PR #155
  `format_cpu_cores` lesson. Verified live on corrino (greetd, 51%, `AC (connected)`).
  `retch-sysinfo` → `0.1.43`. Minor bump (new user-visible fields).
- **v0.4.3 — enforce LF line endings via `.gitattributes`**: added a repo-root
  `.gitattributes` (`* text=auto eol=lf`, `*.png binary`) so every checkout uses LF on all
  platforms. The working tree is shared across Linux/macOS/Windows via Syncthing, so a
  Windows checkout writing CRLF would propagate those CRLFs to the Linux/macOS clones,
  making git report the *entire* tree as modified — a phantom whole-tree diff with zero
  content changes (observed on the corrino box: 13811 insertions / 13811 deletions, all
  line-ending flips, `git diff --ignore-all-space` empty). Pinning `eol=lf` keeps every
  machine byte-identical; `*.png binary` protects the 17 `assets/logos/*.png` from any
  normalization. Same class of cross-OS Syncthing artifact as the `core.filemode false`
  exec-bit workaround. Tooling/repo-hygiene only — no Rust source or library change;
  `retch-sysinfo` unchanged at `0.1.42`.
- **v0.4.2 — fix machine-dependent `format_cpu_cores` unit tests**: `format_cpu_cores` reads
  the *host's* real CPU topology (`/sys/.../cpufreq` on Linux, `hw.perflevel*` sysctls on
  macOS) and returns a `"NP + ME / KT"` hybrid string on Intel P/E (and Apple Silicon)
  machines, ignoring its passed-in `(logical, physical)` counts. The four fallback unit tests
  called it with fixed args, so they passed on non-hybrid CPUs/CI runners but failed on a
  hybrid host — an i7-1360P produced `"8P + 8E / 16T"` where the test expected `"8C / 16T"`,
  hard-failing `just pr` there. Extracted the pure fallback into `format_cpu_cores_plain`
  (public behavior unchanged) and retargeted the four tests at it, so they no longer depend
  on the runner's hardware. Internal refactor + test fix; `retch-sysinfo` → `0.1.42`.
- **v0.4.1 — license SPDX fix + first crates.io publish of the 0.4.x line**: corrected the
  deprecated `license = "GPL-3.0"` to `GPL-3.0-or-later` in both crate manifests (matching the
  source SPDX headers), since per-version crates.io license metadata is permanent. This is the
  version published to crates.io — reversing the long-standing GitHub-only hold. `retch-cli`
  → `0.4.1`, `retch-sysinfo` → `0.1.41`. No functional code change vs v0.4.0.
- **v0.4.0 milestone release**: minor version bump marking the completed Windows native-FFI
  migration (the first GitHub Release since v0.3.40). Rolls up #141–#152 — every Windows
  PowerShell-spawn probe replaced with native Win32 FFI (net, phys-disk, phys-mem, bluetooth,
  cpu-usage, camera), the `--workspace` test/lint gate fix, FFI struct-layout assertion tests,
  and the WIP/bench tooling fixes. Headline: retch on Windows went from slower-than-fastfetch
  across the board to **~4.9× faster in standard mode** (273 vs 1348 ms) and parity in
  `--long`. Version-marker bump only — no code change in this step; `retch-sysinfo` stays at
  `0.1.40`. crates.io intentionally remains at `retch-cli 0.3.35` / `retch-sysinfo 0.1.31`.
- **`upload_local_bench.py` cp1252 crash fixed (Windows)**: `just bench-upload` (and the
  `post-merge` hook that runs it) crashed on Windows with `UnicodeDecodeError: 'charmap'
  codec can't decode byte 0x9d` — the gh-pages `data.js` is UTF-8 (commit messages embed
  `→`/em-dashes) but was read with the default cp1252. Pinned UTF-8 on all file I/O
  (`data.js` read+write, the hyperfine JSON temp read) and on `run_capture`'s subprocess
  decoding (`git log --format=%B`), plus a UTF-8 stdout guard — the same fix class as
  `update_wip.py` (#142). Verified: the crash reproduces on the live `data.js` with the
  default encoding and reads cleanly (845 KB) with UTF-8; `append_entry` and
  `git_commit_info` run without error. This unblocks the Windows "real hardware" numbers
  reaching the benchmark dashboard. Tooling-only; `retch-sysinfo` unchanged.
- **FFI struct-layout assertion tests (test hardening)**: added `size_of`/`offset_of!`
  assertions for the Windows `#[repr(C)]` FFI structs whose layout the drivers/APIs depend
  on — disk (`StoragePropertyQuery`, `StorageDeviceDescriptor` incl. `bus_type`/vendor/product
  offsets, `DeviceSeekPenaltyDescriptor`, `DiskGeometryEx` incl. `disk_size`), memory
  (`MemoryStatusEx`), bluetooth (`ServiceStatus`, `DeviceSearchParams`, `SystemTime`,
  `DeviceInfo` incl. `f_connected`/`sz_name`), cpu (`FileTime`), and `win_setupapi`
  (`SpDevinfoData`, already present). These guard against accidental field reorder/padding
  regressions — the class of bug the pure parse tests can't catch (cf. the #147 phys-mem
  offset bug). Test-only; no runtime change. `retch-sysinfo` bumped to `0.1.40`.
- **Windows `camera` perf: drop PowerShell spawn (~9× faster field) — completes the Windows
  native-FFI migration**: `detect_camera` on Windows no longer spawns PowerShell
  (`Get-PnpDevice -Class Camera,Image -PresentOnly`, ~1.36 s). It now enumerates the Camera
  and Image device setup classes via a new shared SetupAPI helper
  (`crate::win_setupapi::present_device_names`), then applies the same `is_real_camera`
  filter, `clean_camera_name` cleanup, and de-duplication as the other platforms. The
  `win_setupapi` module (hand-written `extern "system"` FFI, links `setupapi`) is shared with
  `bluetooth`, which was refactored onto it (removing its private SetupAPI copy). Measured on
  the AMD Ryzen AI MAX+ 395 box: `--fields camera` ~1359 ms → ~155 ms. Camera was the last
  standard-mode PowerShell pole, so **standard mode dropped 1558 ms → 273 ms**. Output
  verified against `Get-PnpDevice` (all real cameras; the IR camera is filtered as before).
  `retch-sysinfo` bumped to `0.1.39`.
- **Windows perf milestone**: with `net` (#144) plus phys-disk/phys-mem/bluetooth/cpu-usage/
  camera all native, retch on Windows went from slower-than-fastfetch across the board to
  **faster in standard mode and at parity in long** (AMD Ryzen AI MAX+ 395, vs fastfetch):
  short 164 ms vs 74 ms; **standard 273 ms vs 1348 ms (~4.9× faster)**; long 1554 ms vs
  1340 ms. Cumulative since the start of the migration: short 1149→164, standard 1993→273,
  long 3462→1554 ms. Remaining Windows PowerShell spawns are `--full`-only (`gamepad`) or
  `--long` (`dns`, `battery`) — candidates for future migration.
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
- `public-ip`, `wifi`, `bluetooth`, `battery`, `power-adapter`, `shell`, `editor`, `terminal`, `terminal-size`, `desktop`, `wm`, `login-manager`, `brightness`, `dns`, `users`, `packages`, `locale`, `init`, `chassis`, `bootmgr`
- `brightness` (Linux), `power-adapter` (Linux), `login-manager` (Linux) — new v0.5.0 fastfetch-gap fields

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
- ~~**Brightness**: Monitor brightness level~~ — added in v0.5.0 (`brightness` field, Linux; `/sys/class/backlight`)
- **Keyboard**: Connected keyboards
- **Mouse**: Connected mice
- ~~**PowerAdapter**: Charger name and wattage~~ — added in v0.5.0 (`power-adapter` field, Linux; `/sys/class/power_supply` `Mains`. Name + connection state; wattage not yet reported)
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
- ~~**LM**: Login manager (GDM, SDDM, etc.)~~ — added in v0.5.0 (`login-manager` field, Linux; `display-manager.service` systemd unit)
- **Wallpaper**: Current wallpaper file path
- **TerminalTheme**: Terminal foreground/background colors

### Media
- **Media / Player**: Currently playing song and active music player

---

## 6a. Windows cross-platform parity — known issues / backlog

Existing `retch` fields that behave worse (or not at all) on Windows than on Linux/macOS.
Distinct from the §6 fastfetch gap and from the completed PowerShell→FFI *perf* migration.
Tracked as the "Windows parity" series; reported by the maintainer 2026-07-13 (arrakis,
Windows 11, Windows Terminal).

**Fixed**
- ~~**Camera lists scanners as cameras**~~ — fixed v0.6.1 (enumerate the
  `KSCATEGORY_VIDEO_CAMERA` interface, not the Image setup class; also drops the synthetic
  virtual camera).
- ~~**Users = 0 with a user logged in**~~ — fixed v0.6.1 (`WTSEnumerateSessionsW` session
  count; `Users` suppressed when the count is 0).

**Open**
- **Bluetooth shows only 1 of 2 connected devices** (bug). `bluetooth.rs` Windows path uses
  `BluetoothFindFirstDevice`/`BluetoothFindNextDevice` with `{fReturnConnected}` — audit the
  enumeration loop / search-params against a box with 2 connected devices.
- **`Display` shows the GPU name + resolution, not the monitor model** (parity gap). Windows
  `display.rs` uses `EnumDisplayDevicesW`/`EnumDisplaySettingsW` (adapter + mode) and doesn't
  parse the monitor EDID for vendor/model like Linux does. Fix: read the monitor EDID
  (SetupAPI monitor class → registry `EDID` blob) and reuse the existing EDID parser.
- **Logo renders above the text, not beside it (upper-right)** on Windows Terminal
  (CLI/rendering, retch-cli `src/`). Likely terminal-detection / cursor-positioning specific
  to Windows Terminal.
- **`chafa` mode doesn't work on Windows even when requested on the CLI** (CLI). Investigate
  PATH resolution, protocol-detection override, and Windows spawn/path handling.

**Deliberately not implemented on Windows** (no faithful native source): `load` (no
load-average equivalent), `editor` (env-only `$VISUAL`/`$EDITOR`), conhost `terminal-font`
(only Windows Terminal has a parseable config).

---

## 7. Major Achievements

### v0.6.1 - Fix Windows Camera (scanners) + Users (=0) bugs (July 13, 2026)
- **Camera listed scanners as cameras** (user-reported, confirmed live: `EPSON ET-3850
  Series`). Root cause: the Windows path enumerated the `Camera` + `Image` (WIA) *setup*
  classes; scanners/printers share the Image class with some real webcams (the Logitech BRIO
  is Image-class on the test box), and `is_real_camera` has no scanner keyword to catch an
  "EPSON ET-3850 Series". **Fix**: enumerate the `KSCATEGORY_VIDEO_CAMERA` **device-interface**
  class instead — only real cameras register it, so scanners are excluded while Image-class
  webcams are kept. Added `win_setupapi::present_interface_device_names` (a
  `DIGCF_DEVICEINTERFACE` enumeration sharing the existing `enumerate_names` core) and the
  `KSCATEGORY_VIDEO_CAMERA` GUID; removed the now-unused `GUID_DEVCLASS_CAMERA`/`_IMAGE`.
  Also drops the synthetic "Windows Virtual Camera Device" via a Windows-only
  `is_windows_virtual_camera` helper (Linux/macOS untouched). Verified live: `Camera` now
  lists only `Logitech BRIO` + `ASUS FHD webcam`.
- **Users showed 0 with a user logged in** (user-reported, confirmed live). Root cause:
  `sysinfo` keys Windows users by SID, so the Unix `uid >= 1000` filter never matched.
  **Fix**: new `win_users` module counts active interactive sessions via
  `WTSEnumerateSessionsW` + `WTSQuerySessionInformationW` (wtsapi32) — `query user` semantics.
  Verified live: `Users: 1`. Per the "if it doesn't work, don't show it" request,
  `display.rs` now suppresses `Users` when the count is 0 (mirrors `packages`), hiding an
  undetermined value instead of printing a misleading `0`.
- **Tests**: pure `count_active_user_sessions` + `WTS_SESSION_INFOW` `size_of` layout guard
  (Windows) and `is_windows_virtual_camera` unit test. The camera *interface*-enumeration
  change is FFI, so it's verified live rather than unit-tested (per AGENTS §4.2). Non-Windows
  camera/users behavior unchanged; `cargo test --workspace` green (87 sysinfo lib + 40 cli +
  15 integration), `just check` clean.
- **Version**: Bumped to `0.6.1` / `retch-sysinfo 0.1.45`. Patch (bugfixes).

### v0.6.0 - Windows domain + terminal-size (parity quick wins) (July 13, 2026)
- **New Windows field arms** (both `--long`, previously `None` on Windows):
  - `domain` — primary DNS suffix via `GetComputerNameExW(ComputerNameDnsDomain)` (kernel32,
    default-linked). Two-call size-probe pattern; a workgroup host's empty suffix maps to
    `None` via the pure `clean_domain` helper. Intentionally not the NetBIOS `WORKGROUP`
    (that isn't a DNS domain) — matches the Linux/macOS `/etc/resolv.conf` semantics.
  - `terminal-size` — console viewport via `GetStdHandle` + `GetConsoleScreenBufferInfo`.
    Uses the `srWindow` rect (visible viewport), **not** `dwSize` (scrollback buffer height).
    The pure `window_rect_to_size` helper does the inclusive-rect→`"COLSxROWS"` math. Piped
    output has no console → graceful `None` → existing `$COLUMNS`/`$LINES` env fallback.
- **First of the Windows cross-platform-parity series** — distinct from the completed
  PowerShell→native-FFI *perf* migration (v0.4.0). These close fields that returned `None`
  off Linux/macOS, per the "group related fields" cadence agreed for this series.
- **House style**: hand-written `extern "system"` FFI, no binding crate; `// SAFETY:` on every
  `unsafe`; `#[allow(clippy::upper_case_acronyms)]` on the `HANDLE` alias. Both non-Windows
  arms untouched (new `#[cfg(target_os = "windows")]` arms only).
- **Testability** (the `format_cpu_cores` lesson): pure helpers `clean_domain` /
  `window_rect_to_size` are host-independently unit-tested, gated
  `#[cfg(any(target_os = "windows", test))]` so they aren't dead code elsewhere. Added a
  `CONSOLE_SCREEN_BUFFER_INFO` `size_of` layout guard (Windows, per the #151 convention).
- **Verified live** on arrakis (AMD Ryzen AI MAX+ 395, Windows 11 Pro): `domain` correctly
  absent (primary DNS suffix genuinely empty — cross-checked against
  `IPGlobalProperties.DomainName` and the `Tcpip\Parameters\Domain` registry value);
  `terminal-size` renders `100x40` via the display path. `cargo test --workspace` green
  (84 sysinfo lib + 40 cli + 15 integration), `just check` clean.
- **Deliberately not implemented on Windows**: `load` (no native load-average equivalent;
  the processor-queue-length counter is a different metric), `editor` (env-only `$VISUAL`/
  `$EDITOR`, no OS API), and `terminal-font` for conhost (only Windows Terminal has a
  parseable config). Noted so they aren't mistaken for oversights.
- **Version**: Bumped to `0.6.0` / `retch-sysinfo 0.1.44`.

### v0.5.1 - Fix nested ANSI color reset on the network line (July 12, 2026)
- **Bug**: the opening `[` of the network `[Up]` status was colored while the closing `]`
  (and the RX/TX stats after it) were not. Root cause: `owo_colors` closes every foreground
  color with `\x1b[39m` (reset to the terminal *default*, not the enclosing color). The `Net`
  value embeds a green `"Up"` / red `"Down"`; `Theme::color_value` wraps the whole value in
  the theme value color (white), and `display.rs` additionally wraps the **active** interface
  in bright-blue. The inner `\x1b[39m` from `Up`/`Down` cancelled the enclosing color, so
  everything after `[Up]` fell back to the terminal default — leaving the active line's `[`
  blue but `]`/RX/TX default, and every line's RX/TX tail un-valued.
- **Fix**: new `colorize_nested(text, prefix)` in `src/theme.rs` re-asserts `prefix` after
  every interior `\x1b[39m`, so a nested colored span restores the surrounding color on exit.
  It composes at arbitrary nesting depth and, when `text` has no interior reset, is
  byte-identical to the previous `text.color(Rgb)` wrap — so **only the `Net` field's
  rendering changes; all other fields are untouched**. `Theme::color_value` now routes through
  it; the active-interface highlight uses `colorize_nested(net, ACTIVE_IFACE_PREFIX)`
  (bright-blue) instead of `.bright_blue()`. The now-unused `owo_colors::OwoColorize` import
  was dropped from `display.rs`.
- **Library untouched**: `crates/sysinfo/src/network.rs` still emits the green/red
  `Up`/`Down`; the fix lives entirely in the CLI wrapping layers. `retch-sysinfo` stays at
  `0.1.43`.
- **Tests**: four unit tests for the helper — `rgb_prefix` matches `owo_colors`'s output;
  plain text wraps identically to the old path; the enclosing color is re-asserted after an
  interior reset; and a "no default-colored tail" invariant (after wrapping, the only bare
  reset is the final closer). Verified live on corrino: active `Net` line uniformly
  bright-blue except green `Up`; non-active lines value-colored except `Up`/`Down`.
- **Version**: Bumped to `0.5.1` (`retch-sysinfo` unchanged at `0.1.43`). CLI-only patch.

### v0.5.0 - Three new Linux fastfetch-gap fields (July 12, 2026)
- **New fields** (all `--long`+, Linux-only, `None` on macOS/Windows):
  - `login-manager` — active display/login manager, resolved from the
    `/etc/systemd/system/display-manager.service` systemd alias symlink and prettified
    (gdm/gdm3→GDM, sddm→SDDM, lightdm→LightDM, greetd, …; unknown units Title-cased).
  - `brightness` — backlight brightness as a percentage, from the first (vendor-preferred)
    `/sys/class/backlight/*` device's `brightness`/`max_brightness`.
  - `power-adapter` — AC adapter name + connection state, from the `Mains`-type supply under
    `/sys/class/power_supply`. Wattage omitted (sysfs `Mains` rarely exposes it) rather than
    emit a misleading value.
- **Testability**: each detector is a thin `/sys`/systemd-reading wrapper over a **pure
  helper** (`login_manager_from_unit`, `brightness_percent`, `format_power_adapter`) that is
  unit-tested without touching host hardware — the direct lesson from the v0.4.2
  `format_cpu_cores` flaky-test fix. Helpers + their tests are `#[cfg(target_os = "linux")]`
  so they aren't dead code (clippy `-D warnings`) on other platforms.
- **Wiring**: one `FieldDef` row each in `src/fields.rs` (golden strata counts updated:
  Long 46→49, Full 52→55), sequential gated collection + `SystemInfo` fields in
  `crates/sysinfo/src/fetch.rs`, `print_line` arms in `src/display.rs`; config generation and
  docs guardrails auto-cover them via the registry.
- **Verified live** on corrino (i7-1360P, Fedora 44): `--long` shows `Login Manager: greetd`,
  `Brightness: 51%`, `Power Adapter: AC (connected)`; absent from default/`--short`.
- **Closes** the Brightness, PowerAdapter, and LM items in NOTES §6 / the fastfetch-comparison
  wiki page.
- **Version**: Bumped to `0.5.0` / `retch-sysinfo 0.1.43`.

### v0.4.3 - Enforce LF line endings via .gitattributes (July 12, 2026)
- **Problem**: the working tree is shared across Linux/macOS/Windows machines via Syncthing.
  With no `.gitattributes` and `core.autocrlf=false`, a Windows checkout (or an editor there)
  wrote CRLF line endings, Syncthing propagated those CRLF bytes to the Linux clones, and git
  on Linux then reported *every tracked file* as modified — a phantom whole-tree diff (observed
  on the corrino box: 13811 insertions / 13811 deletions, exactly equal, all line-ending flips;
  `git diff --ignore-all-space` empty, i.e. zero content changes). This blocks the `just pr`
  clean-tree checks and drowns any real diff.
- **Fix**: added a repo-root `.gitattributes` — `* text=auto eol=lf` forces LF on checkout on
  every OS (essential for a byte-identical Syncthing-shared tree), and `*.png binary` protects
  the 17 `assets/logos/*.png` from any normalization. HEAD was already stored as LF, so the
  normalization commit changes no tracked content — the diff is just `.gitattributes` + the
  version bump artifacts.
- **Same class** as the existing `core.filemode false` workaround for Windows/NTFS phantom
  exec-bit diffs; this is the line-ending analog.
- **Tooling/repo-hygiene only**: no Rust source or library change. `retch-sysinfo` unchanged
  at `0.1.42`.
- **Version**: Bumped to `0.4.3` (`retch-sysinfo` unchanged at `0.1.42`).

### v0.4.2 - Fix machine-dependent format_cpu_cores tests (July 12, 2026)
- **Bug**: the four `format_cpu_cores` unit tests were machine-dependent. `format_cpu_cores`
  first reads the host's real CPU topology (Linux `/sys/.../cpufreq`, macOS `hw.perflevel*`)
  and, on an Intel P/E or Apple Silicon hybrid, returns a `"NP + ME / KT"` string that ignores
  the passed-in counts. So calling it with fixed args exercised the fallback only on
  non-hybrid CPUs. On an i7-1360P (corrino) it returned `"8P + 8E / 16T"` for `(16, Some(8))`
  where `test_format_cpu_cores_hyperthreaded` expected `"8C / 16T"` — hard-failing `just pr`
  on that machine. The failure had gone unnoticed because it was only ever run on non-hybrid
  hosts and CI runners.
- **Fix**: extracted the pure fallback (`match physical { … }`) into a private
  `format_cpu_cores_plain(logical, physical)` and pointed all four fallback tests at it, so
  they test the deterministic formatting without touching host hardware. `format_cpu_cores`'s
  public behavior is unchanged — it still detects hybrid topology first, then delegates to the
  helper.
- **Internal refactor + test-only fix**: no user-visible behavior change. `retch-sysinfo`
  → `0.1.42`.
- **Version**: Bumped to `0.4.2` / `retch-sysinfo 0.1.42`.

### v0.4.1 - License SPDX fix + crates.io publish (July 12, 2026)
- **License metadata**: `license = "GPL-3.0"` → `GPL-3.0-or-later` in both `Cargo.toml`
  manifests, matching the `SPDX-License-Identifier: GPL-3.0-or-later` headers in the source.
  `GPL-3.0` is a deprecated SPDX id; corrected before publishing since per-version license
  metadata on crates.io is permanent.
- **crates.io publish**: this release **reverses the standing GitHub-only hold** — retch is
  published to crates.io again for the first time since `retch-cli 0.3.35` / `retch-sysinfo
  0.1.31`. Published `retch-sysinfo 0.1.41` then `retch-cli 0.4.1` (dependency order).
- **No functional change** vs v0.4.0 — version bump + license string only.
- **Version**: Bumped to `0.4.1` / `retch-sysinfo 0.1.41`.

### v0.4.0 - Windows native-FFI migration milestone release (July 12, 2026)
- **Minor version bump** (0.3.52 → 0.4.0) marking the first GitHub Release since v0.3.40 and
  the completion of the Windows PowerShell-spawn → native-Win32-FFI migration. This release
  rolls up #141–#152:
  - **Perf**: `net` (#144), `phys-disk` (#146), `phys-mem` (#147), `bluetooth` (#148),
    `cpu-usage` (#149), `camera` (#150) all moved off PowerShell spawns to native FFI. On an
    AMD Ryzen AI MAX+ 395: short 1149→164 ms, **standard 1993→273 ms (now ~4.9× faster than
    fastfetch)**, long 3462→1554 ms (parity). phys-mem also gained running-vs-rated speed.
  - **Quality/tooling**: `--workspace` test+lint gate fix (#146), FFI struct-layout assertion
    tests (#151), WIP updater fixes (#141–#143), bench-recipe (#145) and bench-upload (#152)
    Windows fixes.
- **Version-marker only** at this step (no code change); `retch-sysinfo` unchanged at `0.1.40`.
  crates.io remains intentionally held (`retch-cli 0.3.35` / `retch-sysinfo 0.1.31`) — GitHub
  Release only, matching the v0.3.36–v0.3.40 pattern.
- **Version**: Bumped to `0.4.0` (`retch-sysinfo` unchanged at `0.1.40`).

### v0.3.52 - Fix upload_local_bench.py cp1252 crash (July 12, 2026)
- **Bug**: `just bench-upload` and the `post-merge` git hook crashed on Windows with
  `UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d` — so no local Windows
  "real hardware" numbers were reaching the gh-pages benchmark dashboard. The gh-pages
  `data.js` is UTF-8 (commit messages embed `→`/em-dashes) but `open()` used the default
  cp1252 on Windows.
- **Fix**: pinned `encoding="utf-8"` on every file operation (the `data.js` read and write,
  the hyperfine JSON temp read) and on `run_capture`'s subprocess text decoding (git output),
  plus a `sys.stdout.reconfigure` UTF-8 guard. Same fix class as `update_wip.py` (#142).
- **Verified**: reproduced the crash on the live `data.js` under the default encoding; the
  UTF-8 read succeeds (845 KB) and `append_entry`/`git_commit_info` run clean.
- **Tooling-only**: no Rust source touched; `retch-sysinfo` unchanged at `0.1.40`.
- **Version**: Bumped to `0.3.52` (`retch-sysinfo` unchanged).

### v0.3.51 - FFI struct-layout assertion tests (July 11, 2026)
- **Test hardening** following the Windows native-FFI migration (#146–#150). The pure
  parsers/formatters are well unit-tested, but the `#[repr(C)]` FFI structs the OS reads/
  writes by offset were only runtime-verified. Added `size_of` + targeted `offset_of!`
  assertions for each: disk storage descriptors/geometry, `MemoryStatusEx`, the bluetooth
  `bthprops`/SCM structs, `win_cpu::FileTime`, and `win_setupapi::SpDevinfoData`. These catch
  accidental field-reorder/padding regressions at test time — the failure mode the parse
  tests can't (the #147 phys-mem offset bug was found only by runtime comparison).
- **Test-only**: no runtime behavior change. Runs on Windows CI (the structs are
  `#[cfg(windows)]`). `retch-sysinfo` → 0.1.40.
- **Version**: Bumped to `0.3.51` / `retch-sysinfo 0.1.40`.

### v0.3.50 - Windows camera: native SetupAPI (completes migration) (July 11, 2026)
- **Root cause**: `detect_camera` on Windows spawned PowerShell (`Get-PnpDevice -Class
  Camera,Image -PresentOnly`), ~1.36 s. Last of the per-probe migrations (#146–#150).
- **Fix**: new shared `crate::win_setupapi` module (`SetupDiGetClassDevsW` +
  `SetupDiGetDeviceRegistryPropertyW`, links `setupapi`) exposes
  `present_device_names(class_guid)` — the native equivalent of `Get-PnpDevice -Class X
  -PresentOnly`. Camera enumerates the Camera + Image classes and reuses the existing
  `is_real_camera`/`clean_camera_name`/dedup logic. `bluetooth` (which had introduced a
  private SetupAPI copy in #148) was refactored onto the shared module, removing the
  duplication — mirroring the shared `win_reg.rs` pattern.
- **Result** (AMD Ryzen AI MAX+ 395, Windows 11): `--fields camera` ~1359 ms → ~155 ms
  (~9×). Camera was the last standard-mode PowerShell pole, so **standard mode 1558 ms →
  273 ms**. Verified vs `Get-PnpDevice` (all real cameras present; IR camera filtered as
  before). bluetooth output unchanged after the refactor.
- **Milestone**: retch on Windows now beats fastfetch in standard mode (273 ms vs 1348 ms,
  ~4.9×) and is at parity in long (1554 ms vs 1340 ms), having started this migration series
  slower across the board. Cumulative: short 1149→164, standard 1993→273, long 3462→1554 ms.
- **Version**: Bumped to `0.3.50` / `retch-sysinfo 0.1.39` (library behavior change).

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
