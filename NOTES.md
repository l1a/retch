# Session Notes — June 24, 2026

## Current Task

Release `v0.3.23` (Physical Memory and Disk support).

## Status: Tagged & Pushed

* Tag `v0.3.23` has been created and pushed to origin.
* CI/CD packaging and release run is active.
* Nixpkgs submission is currently skipped for this version because the initial PR to `NixOS/nixpkgs` (#534754, init at `v0.3.22`) is still pending approval.

---

# Session Notes — June 14, 2026

## Current Task

macOS WiFi SSID + link rate display. Branch: `refactor/macos-wifi-link-rate` (PR #90).

## Status: Ready to merge / release v0.3.18

`cargo run -- --long` now shows `Wi-Fi: Connected (↑N Mbps)` correctly.

---

## What This Branch Does

`crates/sysinfo/src/macos_ffi.rs` — `get_wifi_info() -> Option<(String, Option<u64>)>`

Three-tier SSID fallback, all in one function:

```
1. CWWiFiClient.sharedWiFiClient.interface.ssid   (CoreWLAN ObjC FFI)
      → works when Location Services is granted to the terminal
      → nil otherwise (macOS 10.15+ privacy restriction)

2. /usr/sbin/ipconfig getsummary <iface>           (one process spawn)
      → reads from configd daemon (root-privileged, bypasses LS restriction)
      → macOS returns literal "<redacted>" string when LS is blocked
      → parse_ipconfig_ssid() filters that out

3. "Connected" placeholder                          (rate > 0 confirms association)
      → shown as "Connected (↑N Mbps)" when SSID is truly unavailable
```

Transmit rate: `CWInterface.transmitRate` (no Location Services needed).
Receive rate: **not available** — CoreWLAN exposes no RX rate, IO80211Interface
IOKit service was removed in macOS 12, and `class_copyMethodList` on CWInterface
confirms no private receive-rate method exists (175 methods, only `transmitRate`/`txRate`).

`crates/sysinfo/build.rs` — links `CoreWLAN` + `objc`; removed `SystemConfiguration`.

---

## Why So Many RC Tags

| Tag | What failed |
|-----|-------------|
| rc.1 | First attempt, IOKit IO80211Interface — no data on macOS 12+ |
| rc.2 | Switched to CoreWLAN rate; `clashing_extern_declarations` lint error |
| rc.3 | Fixed lint; WiFi line missing (SC dynamic store SSID_STR = empty on macOS 15) |
| rc.4 | Tried `SCDynamicStoreCopyKeyList` wildcard — still empty (same LS restriction) |
| rc.5 | Moved SSID to CoreWLAN `CWInterface.ssid`; nil due to Location Services |
| rc.6 | Removed unused `CFDictionaryGetValue` extern — CI tested but LS still blocks |
| local fix | Added ipconfig fallback; ipconfig returns `<redacted>` literal |
| **final** | Filter `<redacted>`; fall back to "Connected (↑N Mbps)" when SSID unavailable |

Root causes discovered:
- `IO80211Interface` IOKit service absent on macOS 12+
- `State:/Network/Interface/*/AirPort` SC dynamic store key exists but `SSID_STR`
  is an empty CFString (length=0) — macOS deliberately redacts it without LS
- `CWInterface.ssid` returns nil without LS (same restriction)
- `ipconfig getsummary` returns literal `<redacted>` string without LS
- No receive rate exists in any public or private macOS API

---

## Key Files Changed in This PR

- `crates/sysinfo/src/macos_ffi.rs` — CoreWLAN + objc FFI; `get_wifi_info()` with
  three-tier fallback; `parse_ipconfig_ssid()` extracted for testability
- `crates/sysinfo/src/network.rs` — macOS WiFi block calls `get_wifi_info()`
- `crates/sysinfo/build.rs` — CoreWLAN + objc; removed SystemConfiguration
- `AGENTS.md` — v0.3.18 changelog entry; v0.3.17 WiFi note corrected
- Wiki `Workspace-Architecture.md` — updated network.rs and macos_ffi.rs descriptions

---

## After This PR Merges

1. **Release v0.3.18** — bump versions in `Cargo.toml` and `crates/sysinfo/Cargo.toml`
   (`0.3.17` → `0.3.18`, `0.1.17` → `0.1.18`), run `just man`, tag `v0.3.18`,
   push tag to trigger CI release.

2. **crates.io publish** — publish `retch-sysinfo` then `retch-cli`.

3. **Future backlog** (in AGENTS.md):
   - AUR / nixpkgs submission
   - macOS code signing & notarization
   - Homebrew tap

---

## Repo Layout Reminder

```
retch/                          ← retch-cli crate (binary)
  src/
    main.rs, display.rs, config.rs, ...
  Cargo.toml                    ← version = "0.3.17" (bump to 0.3.18 on release)
  Justfile
  docs/retch.1.md               ← man page source
  AGENTS.md                     ← project notes / changelog

crates/sysinfo/                 ← retch-sysinfo crate (library)
  src/
    macos_ffi.rs                ← ALL macOS FFI (CoreFoundation, IOKit, CoreAudio,
    fetch.rs                       CoreGraphics, CoreWLAN, objc runtime)
    network.rs
    battery.rs, theme.rs, ...
  build.rs                      ← framework link directives
  Cargo.toml                    ← version = "0.1.17" (bump to 0.1.18 on release)
```

Wiki: `/tmp/retch.wiki` (cloned from github.com/l1a/retch.wiki).

---

## Commit Attribution

All commits use:
```
Assisted-By: Claude Sonnet 4.6
```
