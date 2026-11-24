# NOTES.md

Standing project state for **retch**: architecture, design decisions, output strata, open gaps, and hard-won lessons.
**Not a changelog:** Per-release history lives in `git log` and GitHub Releases (pre-v0.18.1 log dropped in v0.18.1; v0.18.0–v0.23.6 log distilled here in v0.23.7). Add entries only when a change alters enduring behaviour or leaves behind a rule. Release/packaging/wiki procedures live in `docs/RELEASE.md`.

---

## 1. Project Overview
- **Name:** `retch` (`retch-cli` on crates.io; library crate `retch-sysinfo`)
- **Goal:** Fast, native, Fastfetch-like system information fetcher in Rust
- **Stack:** `sysinfo`, `clap`, `serde`, `toml`, `owo-colors`, `icy_sixel`, `image`, `rusqlite`, `unicode-width`, native OS FFI (Linux procfs/sysfs/udev/EGL/Vulkan/OpenCL, macOS IOKit/CoreGraphics/CoreAudio/CoreWLAN/ObjC, Windows Win32/SetupAPI/Job/SMBIOS)
- **License / Repo:** GPL-3.0-or-later — `https://github.com/l1a/retch`

---

## 2. Codebase Architecture

```
retch/                          ← retch-cli crate (binary)
  src/
    main.rs, cli.rs, config.rs, display.rs, logo.rs, theme.rs
    fields.rs                   ← single source of truth for fields + mode strata
  Cargo.toml / Justfile
  docs/retch.1.md               ← mandown source for committed docs/retch.1
  docs/retch.md                 ← tldr source
  docs/RELEASE.md               ← Tier 1 release, packaging, wiki & CI guide

crates/sysinfo/                 ← retch-sysinfo crate (no clap dependency)
  src/
    fetch.rs                    ← concurrently-scoped probe orchestration
    macos_ffi.rs                ← all macOS FFI (CF, IOKit, CoreAudio, CG, CoreWLAN, ObjC)
    proc_tree.rs                ← direct Linux /proc reads (procs, audio, shell, terminal)
    network.rs, battery.rs, theme.rs, memory.rs, disk.rs, gpu_api.rs, media.rs, ...
  build.rs                      ← macOS framework link directives
```

---

## 3. Specific Development Guidelines
- **Purity & Testing:** Split every probe into a pure parser/formatter (tested with captured real fixtures) + thin OS I/O wrapper. Document `pub` items with `///` and `unsafe` blocks with `// SAFETY:`. Guard new CLI flags and config keys end-to-end (`--help`, `default_config_content()`, `--merge-config`, man page, README, wiki).
- **Benchmarks (`just bench` / `just bench-cli` / `just bench-compare`):** Fastfetch comparisons always run `benches/fastfetch/<mode>.jsonc` (derived from `src/fields.rs` via `just fastfetch-configs`). **If retch is slower than fastfetch in any mode, treat it as a blocking issue** (unmount slow FUSE/cryfs mounts before blaming retch).
- **Cross-machine `target/` via Syncthing:** `~/Sync/git/retch` syncs `.git` and `target/`. Runtime `SIGILL` across machines means stale host-tuned artifacts (`cargo clean`). Note the repo tracks no `.cargo/config.toml` (only `.cargo/audit.toml`).
- **Releases & Packaging:** See `docs/RELEASE.md` (and `~/.agents/docs/ops/rust-ci-packaging.md`). Never run `just install`/`just install-tag` for local updates; never edit `docs/retch.1` manually; never call `gh pr create` directly (`just open-pr`).

---

## Current State (v0.23.7)

`main` carries **`retch-cli` 0.23.6** / **`retch-sysinfo` 0.1.111** (newest released tag `v0.23.1`); this branch (`chore/compact-agent-docs`) bumps `retch-cli` to **`0.23.7`** to compact `AGENTS.md` / `NOTES.md` and extract `docs/RELEASE.md`.

Key enduring behaviours and architecture (see `git log` for per-release history):
- **Cross-platform parity & native fast paths:** Fastfetch feature gap (§6) is closed across Linux, macOS, and Windows (aside from deliberate exclusions in §6a/§6c). Linux reads `/run/udev/data/+dmi:id` (`phys-mem`), `/run/udev/data/+pci:<slot>` (`gpu`), `/sys/bus/hdaudio` (`audio`), `/proc` directly (`proc_tree.rs`), and `EGL_PLATFORM_SURFACELESS_MESA` (`opengl`). macOS reads IOKit/CoreGraphics/CoreAudio/CoreWLAN/ObjC directly without `system_profiler`/`diskutil` on Apple Silicon. Windows reads `GetIfTable2` + `GetUnicastIpAddressTable`, SetupAPI (`keyboard`/`mouse`), `\\.\LCD`, `Tbsi_GetDeviceInfo`, SMBIOS Type 4 (`cpu-freq`), `RelationCache`, and Win32 Job Objects (`own_cpu_time`).
- **Config, Color & Terminal Graphics:** Supports `include` / `include_optional` (depth <= 8, 1 MiB cap, required < optional < main), `color` (`auto`/`always`/`never`), `TERM=dumb` suppression, `--fields` overriding mode field lists while modes keep detail granularity, `ascii_only` config, semantic ANSI colorization in `display::print_line`, and Zellij 0.46+ Kitty graphics (`a=q` + DA1 `/dev/tty` probe) + KDL font/theme parsing.
- **Build & Feature Hygiene:** `image` uses `default-features = false` (`png,jpeg,gif,webp,bmp,ico` — drops `avif`/`exr`/`paste`), `chrono` was replaced with zero-dep `libc::localtime_r` / Win32 `FileTimeToSystemTime` (`boot_time`), and `--no-default-features` is linted cleanly.
- **CI, Benchmarks & Secrets:** Hardened `Claude Code Review` workflow (`v0.23.6`, see `docs/RELEASE.md` & `~/.agents/docs/ops/rust-ci-packaging.md`) requires `CLAUDE_CODE_OAUTH_TOKEN` synced in both Actions secrets and Dependabot secrets. `benchmark.yml` runs 5 platform legs in parallel with `comment-on-alert: false` (track `retch / fastfetch` ratios on `benches/dashboard/`).

---

## 4. Output Mode Strata

Strict supersets with increasing verbosity:

| Mode | Flag | Target | Key Notes / Additions |
|---|---|---|---|
| **Short** | `--short` | <100 ms | Fast hardware snapshot (`os`, `kernel`, `host`, `cpu`, `gpu`, `memory`, `disk`, `net`). No network, sensors, or cosmetic fields. |
| **Standard** | *(none)* | <50 ms | Daily overview: adds `cpu-cache`, `motherboard`, `display`, `audio`, `camera`, `phys-mem`, `swap`, `load`, `phys-disk`, `uptime`. (`cpu-usage` moved to `--long` due to 200 ms sample.) |
| **Long** | `--long` | ~200–500 ms | Diagnostics: adds `cpu-usage` (first sample taken before concurrent scope; subtracts own CPU time), `bios`, consolidated `temp` (1 worst-case sensor per unit: CPU/GPU/SSD/WiFi/System), `domain` (default-route interface only), `public-ip`, `wifi`, `bluetooth`, `battery`, `power-adapter`, `shell`, `editor`, `terminal`, `terminal-size`, `desktop`, `wm`, `login-manager`, `brightness`, `dns`, `users`, `packages`, `locale`, `init`, `chassis`, `bootmgr`, `keyboard`, `mouse`, `tpm`, `player`, `media`, `disk-io`, `net-io` (averaged over collection window, no dedicated 1s sleep). |
| **Full** | `--full` | ~5s+ | Everything slow/cosmetic: all `temp` sensors, `domain-search` (all scopes), `theme`, `icons`, `cursor`, `vulkan`, `opengl`, `opencl` (grouped together to avoid loader dlopen contention), `gamepad`, `weather` (wttr.in plain HTTP, ~4s timeout), FUSE `statvfs` (`fuse.*` skipped in shorter modes). |

*(Alternative `--verbose` rejected in favor of `--full`.)*

---

## 5. Future Work / Backlog
Live items only (delete completed items rather than striking through):
- **Performance leads:**
  - Investigate Linux x64 CI `--full` vs fastfetch gap (seen when `weather` runs cleanly) and intermittent ~35–57 ms real-hardware spikes (`procs`/`audio`/`shell`/`terminal` ~50 ms each — capture with `RETCH_TIMING=1` when observed).
  - Measure `--short` on discrete NVIDIA + multi-GPU Linux laptops after the `udev` `pci.ids` skip.
- **CI/Distribution decisions:** Automating crates.io/AUR/Homebrew/Scoop publish on tag (needs 3 secrets, trades away human confirmation); `homebrew-core` submission; macOS code signing & notarization (Apple Developer membership).

---

## 6. Feature Gap with Fastfetch
Fastfetch field parity is closed on Linux, macOS, and Windows except deliberate exclusions below. (`opencl`, Windows Bluetooth LE, macOS `keyboard`/`brightness`, and Windows `disk-io` deliberately report more than fastfetch; unknown values are omitted under §7.2.)

### 6a. Windows Cross-Platform Parity
Deliberately omitted (no faithful native source): `load` (`should_probe_load()` skips `System::load_average()`, which returned `0.00` via PDH at ~185 ms cost), `editor` (`$VISUAL`/`$EDITOR` env-only), conhost `terminal-font` (only Windows Terminal has a parseable config).

### 6b. Privilege-Dependent Fields (Linux)
Diffing `sudo retch --full` against plain `retch --full` is apples-to-oranges (`sudo` `env_reset` drops user env):
- **Root-only:** `phys-mem` DMI fallback (when `/run/udev/data/+dmi:id` lacks records; `dmidecode` needs `/sys/firmware/dmi/tables/DMI` `0400 root`), `btrfs` snapshot count (`btrfs subvolume list -s`; omitted rather than shown as `0` unprivileged).
- **User-only (lost under `sudo`):** `editor`, `desktop`, `wm`, `TERM_PROGRAM` logo selection (Rio checks `TERM=xterm-rio` too, which `sudo` preserves).

### 6c. macOS Cross-Platform Parity — Open Items
- **`Bluetooth` power state on macOS 26+:** `IOBluetoothHCIController` dropped `BluetoothControllerPowerIsOn`. Live radio toggle testing on Apple Silicon (`macOS 27.2`) proved neither `BluetoothTransportConnected` nor `IOBluetoothHCIController` node presence tracks the radio (`system_profiler SPBluetoothDataType` knows `State: On`, but is too slow). Partial fix: omits `On`/`Off` rather than printing false `Off`. (Note when testing toggles: Control Center applies changes on pop-up close; always log an independent oracle alongside retch.)
- **Intel Mac internal NVMe:** Prints `[SSD]` instead of `[NVMe SSD]` (macOS spells bus `PCI-Express`; needs an Intel Mac to verify `IONVMeBlockStorageDevice` vs `IOAHCIBlockStorageDevice` IOKit class).

---

## 7. Hard-Won Lessons

### 7.1 Verification & Measurement Discipline
- **Check consumption, not just production:** `parse_criterion.py` warned and exited `0` on a stale filename for 3 months while CI dropped all `CLI execution` data. Missing expected inputs must error, and `missing_series` checks both CI and local publishers.
- **Differencing baselines hide shared constants:** Windows `--fields os` paid the same ~180–195 ms PDH init cost as `--short` (`retch --version` = 17.9 ms exposed it). Measure absolute elapsed time from process start.
- **`--fields <one>` doesn't model `--long`:** Probes run concurrently, so removing a critical-path probe (`shell` ~570 ms) hides behind serial post-scope steps. Re-measure `main` vs branch in the same sitting (`RETCH_TIMING=1` captures slow states).
- **Fastfetch benchmark hygiene:** Never compare against bare `fastfetch` (reads user config or `-c none`); always pin `benches/fastfetch/<mode>.jsonc` and verify `Public IP:` / `Weather:` lines actually ran (7 ms `--full` delta on CI meant fail-fast). Compare `retch / fastfetch` ratios across noisy CI runners rather than absolutes.
- **Window & stderr side-effects:** Overlapping `cpu-usage` with probes requires subtracting own CPU (`getrusage` / Job Object). `RETCH_TIMING` dupes stderr at `timing::start()` before `gpu_api.rs` redirects fd 2 to `/dev/null` during driver init.
- **Test traps:**
  - `cargo test -q` prints dots, not `FAILED` — drop `-q` in mutation tests and assert `running 1 test`.
  - Symmetric fixtures (`4P + 4E`) hide swapped orderings — use asymmetric values (`2P + 6E`).
  - Overlapping filters hide deleted checks — test with synthetic fixtures isolating each predicate.
  - `os.walk` finding `completions/fastfetch` before `bin/fastfetch` exits 0 — pin `bin/` and verify version output.
  - A parameter `detect_audio(&sys)` kept `audio` inside the scope borrowing `sys` and triggered `needs_process_list` on macOS/Windows even after Linux stopped reading `sys`. Inspect probe bodies across all `cfg` arms.
- *(Shared oracle/shell/CI rules — `grep -c $'\r'`, `pipefail` + `grep -q`, `jq //` empty string, `gh run list --branch main`, `gh pr checks --watch` — live in `~/.agents/docs/ops/rust-ci-packaging.md`.)*

### 7.2 Testing & Design Conventions
- **`--merge-config` comment trap:** `contains_key_line` strips `#` and matches `key =`. Never write example assignments like `#   theme = "custom"` in default config comments (breaks `--merge-config`); test `DEFAULT_INCLUDE_BLOCK` explicitly.
- **Config key wiring:** Always test new keys where behavior actually changes (`ascii_only`, `color`, `TERM=dumb`) and grep every consumer of `cli.<flag>`.
- **Environment test hygiene:** Any test asserting a flag/probe is *false* must scrub or override host env vars.
- **FFI struct safety:** Guard FFI structs with `size_of` + `offset_of!` assertions.
- **Under-reporting rule:** Omit unknown fields (`Users: 0`, unclassified HID, empty OpenCL platforms) rather than guessing.
- **Deterministic output ordering:** Sort `sysinfo::Networks` results by natural interface name (`en2` < `en10`) — never rely on `HashMap` iteration order.

### 7.3 Platform Gotchas

**Windows**
- **PDH init (~185 ms):** `CpuRefreshKind::everything()` sets `frequency` and triggers PDH `get_frequencies()`; request frequency only when `cpu-freq` is selected. `System::load_average()` uses a zero-seeded PDH counter (useless -> skipped).
- **SMBIOS / SetupAPI / IOCTLs:** SMBIOS Speed is at offset `0x15` (`0x13–0x14` is Type Detail). `SP_DEVICE_INTERFACE_DETAIL_DATA_W` `cbSize` is 8 on x64 while `DevicePath` starts at offset 4. Storage IOCTLs use `FILE_ANY_ACCESS` (zero-access handle); battery IOCTLs need `GENERIC_READ`.
- **Networking (`GetIfTable2`):** Filter out `FilterInterface` (NDIS filters duplicate counters), but don't restrict to `HardwareInterface` (drops WireGuard/VPN tunnels). Never use `GetIfTable` (32-bit counters wrap at 4 GB). Note `GAA_FLAG_SKIP_DNS_SERVER` leaves `FirstDnsServerAddress` null.
- **Job Object `own_cpu_time`:** Never mix `GetProcessTimes` and Job Object time via `max()` across snapshots — prefer Job Object whenever present.
- **OpenGL / DLLs / Terminal:** Stock Windows has no headless EGL — WGL needs a hidden window + registered class cleaned up by a Drop guard. Load system DLLs (`vulkan-1.dll`, `opengl32.dll`, `OpenCL.dll`, `combase.dll`) with `LOAD_LIBRARY_SEARCH_SYSTEM32`. Windows Terminal version is in its MSIX package folder name. On NTFS, sanitize `:` in test temp filenames (`WinError 123`). `powershell -NoProfile` still takes ~880 ms on PS 5.1 (avoid spawning).

**macOS**
- **ObjC `objc_msgSend` ABI:** Declare bare symbol and `transmute` to exact non-variadic `extern "C"` signatures — C-variadic (`...`) spills args to stack on `aarch64-apple-darwin` while ObjC expects registers `x2+`.
- **Network & Alignment:** `getifaddrs` `if_data` counters wrap at 4 GiB -> use `sysctl(NET_RT_IFLIST2)` / `if_data64` (4-byte aligned -> copy fields, never borrow `&data.ifi_ibytes`, E0793).
- **Frameworks & CGL:** `dlopen` requires full `/System/Library/Frameworks/X.framework/X` paths. CGL requires core profile attribute to report OpenGL `4.1` instead of legacy `2.1`.
- **IOKit / CoreFoundation fast paths:** Use `IOBlockStorageDriver` (`Product Name`, `Medium Type`, `Physical Interconnect`) instead of `diskutil` (~0.2s/call); use `IODeviceTree:/chosen` (`dram-size`/`dram-type`/`dram-vendor`) instead of `system_profiler` (~100 ms); read `AppleARMBacklight` only when `CGDisplayIsBuiltin` is active (frozen `50%` in clamshell mode), else `IOMobileFramebuffer`.
- **Volumes & Caskroom:** Avoid `kCFURLVolumeAvailableCapacityForImportantUsageKey` (~9 ms/mount); use `statfs` `f_bavail` + CF `IsBrowsable`/`IsLocal` (`/System/Volumes/Data` has `MNT_DONTBROWSE`). Skip `.metadata`/`.DS_Store` dotfiles in `/opt/homebrew/Caskroom`.
- **Apple Silicon Cache Topology:** Top-level `hw.l*cachesize` reports Efficiency cores only -> iterate `hw.perflevel0..hw.nperflevels-1`, handling both 4-byte `CTLTYPE_INT` and 8-byte `CTLTYPE_QUAD` sysctl sizes.

**Linux**
- **`/proc/diskstats`:** Counts 512-byte sectors regardless of `hw_sector_size`.
- **`resolvectl` vs `/proc/net/route`:** `Default Route: yes` in `resolvectl` marks DNS routing (can include VPNs); resolve default interface from `/proc/net/route`.
- **HID & Input:** Kernel capability bitmaps print most-significant word first (bits 0–63 are last). Logitech Unifying/Bolt receivers expose identical HID descriptors for keyboards and mice — do not guess via heuristics.
- **`udev` & `pci.ids`:** Read `/run/udev/data/+pci:<slot>` (`E:ID_MODEL_FROM_DATABASE=`) before walking 1.6 MB `pci.ids`. Read `/sys/bus/hdaudio/devices/*` before `/proc/asound/card*/codec#*` (SOF DSP codecs stall ~115 ms).
- **RPM SQLite & `wpaperd`:** `rusqlite` `Connection::open` fails on queries against `0644` rpmdb unless opened with `immutable=1`. For `wpaperd`, prefer `config.toml` (1.0) exclusively when readable over leftover pre-1.0 `wallpaper.toml`.

**Cross-Platform**
- **UTF-8 URL encoding:** Iterate `s.bytes()`, never `c as u32` (`ã` -> `%C3%A3`, not `%E3`).
- **Terminal sanitization:** Plain HTTP weather replies (`wttr.in` — note `nearest_area` is nearest station, not query) are untrusted input -> reject replies with control bytes while preserving combining marks (`U+FE0F`). Strip all `ESC [ ... <final>` sequences, not just SGR `m`.
- **GPU APIs:** Vulkan < 1.2 silently ignores `pNext`; `vkEnumerateInstanceVersion` returns loader version, not device `apiVersion`; skip Mesa `llvmpipe` software device.
- **Kitty graphics:** Cells are indivisible — emit only the limiting dimension so Kitty preserves aspect ratio.

### 7.4 Release, Packaging, CI & Tooling
- **CLIs & Environment:**
  - `just bench-cli` / `cli_bench.py`: pass `--shell=none` (hyperfine 2.0+ splits backslashes POSIX-style and uses `schema_version: 2`).
  - Windows CI weather lines emit emoji: capture bytes + UTF-8 `errors="replace"` and print console-safely (cp1252 `UnicodeEncodeError`).
  - In zsh, quote `--version '=0.20.23'` (leading `=` triggers path expansion). In `Justfile`, avoid literal `{{` in recipe bodies and `@` in `#!` recipes.
  - `post-merge` hook runs hyperfine and pushes to `gh-pages` on `git pull` (`GIT_NO_BENCH=1 git pull` skips it).
  - Never test `cargo` / `target/` on tmpfs scratchpads (OOM risk); use real disk.
  - Pre-v0.19.0 benchmark series are frozen at `gh-pages:dev/bench/archive/` (mode redefinition boundary).
- **COPR token (`~/.config/copr`):** Expires **2027-02-27** — renew CLI token and GitHub repo secrets together.
- **See `docs/RELEASE.md` & `~/.agents/docs/ops/rust-ci-packaging.md`** for full packaging, AUR, COPR, Homebrew, Scoop, and Claude Code Review details.

### 7.5 CI & Claude Code Review Hardening
- **Two-checkout isolation & fork guard (#346/#349):** `claude-code-review.yml` checks out the API-resolved base branch at workspace root and the PR head under `.ci-review/head/` with `persist-credentials: false` on both (narrower designs tried on #346 leaked credentials or workspace rules). Cross-repo PRs are refused before checkout, and `.ci-review/head/` is stripped of `CLAUDE*.md`, `AGENTS.md`, `.claude/`, `.claude.json`, and `.mcp.json`.
- **Tool boundary & foreground subagents (#347/#349):** Pin `--model claude-opus-5-5` (Sonnet skips subagents while still reporting clean), `--permission-mode default` with `--allowedTools` scoped solely to `mcp__github_inline_comment__create_inline_comment`, `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` (prevents `claude-code-action` from exiting on the first result while subagents are still running), and `use_sticky_comment: false` (clean runs post no top-level comment). Interactive `claude.yml` pins `--permission-mode acceptEdits` explicitly so `--allowedTools` remains a strict boundary.

---

## 8. Dependencies (`Cargo.toml`)
- `sysinfo`, `clap`, `serde`, `toml`, `icy_sixel` (`graphics` feature, default), `image` (`default-features = false`: `png,jpeg,gif,webp,bmp,ico`), `base64`, `unicode-width`, `dirs` (direct dependency of both crates).
- **`owo-colors`:** `src/theme.rs` hardcodes ANSI sequences (`rgb_prefix`, `FG_RESET`, `ACTIVE_IFACE_PREFIX`) pinned by tests — re-verify after bumps.
- **`rusqlite`:** Bundles SQLite; verify `retch --fields packages` unprivileged (`immutable=1`) after bumps.
