window.BENCHMARK_DATA = {
  "lastUpdate": 1787377807320,
  "repoUrl": "https://github.com/l1a/retch",
  "entries": {
    "Local - Linux x64 (real hardware)": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "0a5c8ebaed3085bd11c7aedd46193054eeb5d442",
          "message": "chore: wire install-hooks into just setup and just dev\n\n`just setup` is now the canonical post-clone step; `just dev` depends\non it so hooks are always installed before a full dev build.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:17:04-07:00",
          "tree_id": "9502a2bbe06cf25d2a8037bef08ea0ff5038f588",
          "url": "https://github.com/l1a/retch/commit/0a5c8ebaed3085bd11c7aedd46193054eeb5d442"
        },
        "date": 1781115493644,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 453607868.08000004
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1017525047.4133333
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "7096c791e27e3c07822458502dc753c7db6d6afa",
          "message": "fix: clone gh-pages from remote URL, not local repo path\n\nCloning from the local path gave a stale gh-pages snapshot, causing\nevery push to be rejected as non-fast-forward. Clone from the remote\nURL directly so the working copy is always current.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:23:38-07:00",
          "tree_id": "fbb86c9f324063e5cfce81f132600b8a3c288fad",
          "url": "https://github.com/l1a/retch/commit/7096c791e27e3c07822458502dc753c7db6d6afa"
        },
        "date": 1781116108319,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 425039143.3866667
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1013387340.053333
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "7f3f848bd89ae2741965fa25fc330c4091527224",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T12:14:26-07:00",
          "tree_id": "3950745990a47b83b5b2a5caa43203d7c63bf919",
          "url": "https://github.com/l1a/retch/commit/7f3f848bd89ae2741965fa25fc330c4091527224"
        },
        "date": 1781119190180,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 369309963.0400001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1016038582.54
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781122010627,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 385452230.08000004
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1022137868.18
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "37b53d4101d641b5411b9c5a485fbc0bac2c22bd",
          "message": "docs: document full release, pre-release, and crates.io publish process in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T20:04:45-07:00",
          "tree_id": "7d57d78ea5d92f96e8a6838ccd3e2dbeffd11bc7",
          "url": "https://github.com/l1a/retch/commit/37b53d4101d641b5411b9c5a485fbc0bac2c22bd"
        },
        "date": 1781235363546,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 326617426.64000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1019421836.0399998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "c4633dd7ab0a57810eef8b0f53a397a0286b9452",
          "message": "refactor(macos): replace all system_profiler spawns with native FFI (v0.3.16) (#87)\n\n* refactor(macos): replace all system_profiler spawns with native FFI (v0.3.16)\n\nAdd macos_ffi.rs with safe wrappers for CoreFoundation, IOKit, CoreAudio,\nand CoreGraphics. Zero system_profiler spawns on macOS:\n\n- bios: IODeviceTree:/rom firmware version via IOKit\n- audio: CoreAudio AudioObjectGetPropertyData device enumeration\n- display: CoreGraphics CGGetActiveDisplayList + IODisplayConnect names\n- gpu: IOKit AGXAccelerator (Apple Silicon) + IOPCIDevice class 0x03\n- camera: IOKit USB bInterfaceClass=0x0E (UVC) enumeration\n- gamepad: IOKit HID usage page 0x01 / usages 0x04+0x05\n- bluetooth: IOBluetoothHCIController power state + chipset\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: cargo fmt\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: wrap enumerate_hid_usage call in unsafe block\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: remove unused CFArray and kCFBooleanTrue declarations\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(macos): add build.rs to propagate framework link directives\n\n#[link(kind = \"framework\")] in lib crates does not reliably propagate\nto the final binary link step. Emit cargo:rustc-link-lib directives\nfrom build.rs instead.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(macos): replace IOMainPortDefault extern static with literal 0\n\nIOMainPortDefault was introduced as an exported symbol in macOS 12.0.\nThe CI SDK targets macOS 11.0 where it does not exist, causing a link\nerror. Both kIOMasterPortDefault and IOMainPortDefault are always 0, so\nuse a Rust constant instead of the extern static.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-12T10:10:04-07:00",
          "tree_id": "303651b63023cd37e41aceaa61bc2ce4c9861863",
          "url": "https://github.com/l1a/retch/commit/c4633dd7ab0a57810eef8b0f53a397a0286b9452"
        },
        "date": 1781284289848,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 308723856.52
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1016648180.3199998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "4fa327fd4f6705f13d6e8b1bdffccf00ba4c6e0d",
          "message": "ci: drop macOS x64 benchmark job (#88)\n\nIntel Mac no longer a supported release target; macOS arm64 remains.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-12T21:14:13-07:00",
          "tree_id": "abdceb7d9a12eb5dc49922168f04d50797eca50b",
          "url": "https://github.com/l1a/retch/commit/4fa327fd4f6705f13d6e8b1bdffccf00ba4c6e0d"
        },
        "date": 1781324074383,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 317674163.97999996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1021361801.1800001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "16a3378de076d47006baa9d37ffc4cd0f376183d",
          "message": "refactor(macos): replace ioreg/defaults/airport spawns with native FFI (v0.3.17) (#89)\n\n* refactor(macos): replace ioreg/defaults/airport spawns with native FFI (v0.3.17)\n\n- Battery: IOServiceMatching(AppleSmartBattery) + IORegistryEntryCreateCFProperty\n  replaces 'ioreg -r -c AppleSmartBattery' process spawn\n- Theme: CFPreferencesCopyValue(kCFPreferencesAnyApplication, ...) replaces\n  'defaults read -g AppleInterfaceStyle' process spawn\n- WiFi: SCDynamicStoreCopyValue(State:/Network/Interface/*/AirPort) replaces\n  private airport binary; new SystemConfiguration framework dependency\n- Zero process spawns remaining on macOS\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: remove bench referencing deleted parse_airport_output\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt",
          "timestamp": "2026-06-13T14:23:35-07:00",
          "tree_id": "fbe3595a4642fd2ae2c898d0ebbb247fbc013b13",
          "url": "https://github.com/l1a/retch/commit/16a3378de076d47006baa9d37ffc4cd0f376183d"
        },
        "date": 1781385845418,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 297584156.38
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1016286813.7799999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "28dafa442e4064a005d0514f37eeb23e613b0c85",
          "message": "docs: clarify Wi-Fi link rate availability by platform\n\nmacOS exposes only TX rate (CWInterface.transmitRate); no RX rate exists\nin any public CoreWLAN or IOKit API. Linux has both via iw.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-14T14:15:08-07:00",
          "tree_id": "39c8b6d1fea217d7989fb5dffdae13cdbe80b49b",
          "url": "https://github.com/l1a/retch/commit/28dafa442e4064a005d0514f37eeb23e613b0c85"
        },
        "date": 1781475619930,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 377797110.94
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1020708378.9399999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "a1ab21b8ea5fffe896154a3b8bdde17873a39699",
          "message": "ci: prune rc tags and old releases on stable release (#92)\n\n* fix(bench): gate audio import for non-Linux/non-macOS targets\n\n`retch_sysinfo::audio` is only used by the `bench_parse_asound_cards`\nbenchmark, which was already cfg-gated. The bare import caused an\nunused-import warning on Windows benchmark runs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: prune rc tags and old releases on stable release\n\nAfter a stable tag is published, delete all rc pre-releases for that\nversion and keep only the 10 most recent stable releases (including\ntheir git tags).\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-14T18:10:12-07:00",
          "tree_id": "5992c18bc64e11a5c068c7a0b08dbcc15e648ca5",
          "url": "https://github.com/l1a/retch/commit/a1ab21b8ea5fffe896154a3b8bdde17873a39699"
        },
        "date": 1781485834388,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 339833682.9800001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1017629145.18
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "d21a97a20b1c1f7556ff181c3f5d00450d349058",
          "message": "chore: v0.3.18 release cleanup â€” version bump, man page, AGENTS.md (#93)\n\nItems overlooked by not following AGENTS.md release checklist and\nsaved memories:\n\n- Bump retch-cli 0.3.17 â†’ 0.3.18 and retch-sysinfo 0.1.17 â†’ 0.1.18\n  (should have been on PR #90 branch before merging)\n- Run `just man` to regenerate docs/retch.1 with updated version\n  (required by the man-page-timing memory and AGENTS.md Â§Man Pages)\n- Update AGENTS.md \"Last updated\" footer from v0.3.15 to v0.3.18\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-14T19:47:54-07:00",
          "tree_id": "375a36de8d75b5634fc7c6de9cdd52b5b8dba77c",
          "url": "https://github.com/l1a/retch/commit/d21a97a20b1c1f7556ff181c3f5d00450d349058"
        },
        "date": 1781491704367,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 334768943.64000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1018923256.0399998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "9579fdcccbf2a4736c850349812353866edf554d",
          "message": "fix(ci): use shell interpolation in jq for rc tag cleanup (#94)\n\n`gh release list --jq` does not support passing jq's `--arg` flag â€”\nit treats `--arg` as the jq expression, causing 'unknown command \"v\"'.\nUse shell variable interpolation directly in the jq string instead.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-14T20:54:52-07:00",
          "tree_id": "d0c90c88d30c1050a0210829448529484307069e",
          "url": "https://github.com/l1a/retch/commit/9579fdcccbf2a4736c850349812353866edf554d"
        },
        "date": 1781495713386,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 333817060.24
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1021351867.2400001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "3dd0a1d0ac85449cfffe313ca180098107b28bd2",
          "message": "feat: add MX Linux, Mint, Kali, Zorin, Garuda logos (#96)\n\n* feat: add MX Linux, Mint, Kali, Zorin, Garuda logos\n\nASCII logos sourced from fastfetch-cli/fastfetch. PNG logos converted\nfrom Wikimedia SVGs via ImageMagick. Adds get_embedded_logo,\nget_ascii_logo, get_distro_colors entries and tests for all five distros.\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.19, regenerate man page, update AGENTS.md\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add new distros to --print-logos; sort alphabetically, OS last\n\nThe hardcoded logo list in main.rs was not updated when new distros were\nadded to logo.rs. Also sorts Linux distros alphabetically with macOS,\nWindows, and Tux at the end.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add --print-logos verification step to AGENTS.md checklist\n\nCaught by missing main.rs update when adding new distro logos in #96.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-14T21:46:31-07:00",
          "tree_id": "05b5c418513d8c480fd45321bc4c2389a503b58e",
          "url": "https://github.com/l1a/retch/commit/3dd0a1d0ac85449cfffe313ca180098107b28bd2"
        },
        "date": 1781498821619,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 366697314.38000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1016684409.08
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "370912eb198bcb6c18277c0ed8b8269c910d338f",
          "message": "Add Claude Code GitHub Workflow (#98)\n\n* \"Claude PR Assistant workflow\"\n\n* \"Claude Code Review workflow\"",
          "timestamp": "2026-06-14T23:25:19-07:00",
          "tree_id": "f6b985f66832612aae83720755a10cf19084e1c0",
          "url": "https://github.com/l1a/retch/commit/370912eb198bcb6c18277c0ed8b8269c910d338f"
        },
        "date": 1781504919893,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 5649358326.58
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1016287480.98
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "a7b091ac39d5dedd909ae375d90f9bc423621663",
          "message": "fix(theme): use neutral as auto fallback when headless or GTK unset (#99)\n\n* fix(theme): use neutral as auto fallback when headless or GTK unset\n\nWhen retch runs over SSH or mosh with no display server, `$DISPLAY` and\n`$WAYLAND_DISPLAY` are unset. Previously, `auto` would read GTK settings\nand return `light` if `prefer-dark-theme=false` was set on the remote,\nor fall back to `dark` otherwise â€” both wrong for an unknown background.\n\nNow: skip GTK detection entirely when headless, and fall back to\n`neutral` (safe for any terminal background) when GTK yields nothing.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix(theme): use neutral fallback when display present but no GTK preference\n\nThe correct split for auto theme detection:\n- Headless (no $DISPLAY / $WAYLAND_DISPLAY): neutral (unknown background)\n- GTK explicit dark/light: respected as before\n- Has display but no GTK preference (KDE, no config, etc.): neutral (safe)\n\nneutral uses pure ANSI primaries that work on any terminal background,\nso it is the right choice whenever the background is unknown.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix(theme): also detect SSH via env vars, not just $DISPLAY\n\nShell profiles on many systems set $DISPLAY=:0 even in SSH sessions so\nGUI apps can connect to the running compositor. This caused the headless\nguard to be skipped, GTK detection to find prefer-dark-theme=false, and\nauto theme to resolve to light over SSH.\n\nAlso check $SSH_CLIENT / $SSH_TTY / $SSH_CONNECTION, which SSH always\nsets, so we return neutral regardless of what $DISPLAY says.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix(theme): detect KDE dark/light via kdeglobals BackgroundNormal luminance\n\nRead [Colors:Window] BackgroundNormal=R,G,B from kdeglobals and compute\nluminance (0.299R + 0.587G + 0.114B). Values below 128 indicate a dark\ncolor scheme; 128 and above indicate light. This works for any KDE color\nscheme without relying on scheme name conventions.\n\nChecked after GTK settings so GNOME takes precedence on dual-toolkit\nsystems.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-15T12:31:58-07:00",
          "tree_id": "ab717e3fa7832545dd4ad84dea68fadbb612ed40",
          "url": "https://github.com/l1a/retch/commit/a7b091ac39d5dedd909ae375d90f9bc423621663"
        },
        "date": 1781551982614,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 523073146.9200001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1018223477.5200001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "152d458bb9475caf4f944421182e2c542a451393",
          "message": "feat: add CPU cache, usage, topology, and freq range fields (v0.3.21) (#101)\n\n* feat: add CPU cache, usage, topology, and freq range fields\n\nCPUCache: Linux reads sysfs /sys/devices/system/cpu/cpu0/cache/;\nmacOS reads hw.l1dcachesize/l1icachesize/l2cachesize/l3cachesize via\nsysctlbyname. Returns None on Windows.\n\nCPUUsage: instantaneous utilization % combined with 1/5/15 min load\naverages â€” e.g. \"12.8% (load: 0.45, 1.23, 0.87)\".\n\nCPU topology: uses sysinfo physical_core_count() to show \"8C / 16T\"\ninstead of a raw thread count.\n- Linux Intel 12th gen+: groups cpufreq policies by max frequency to\n  detect P/E cores â€” \"6P + 4E / 16T\".\n- macOS Apple Silicon: reads hw.nperflevels / hw.perflevel0.logicalcpu /\n  hw.perflevel1.logicalcpu â€” \"4P + 4E / 8T\" on M-series.\n\nCPU Freq (long mode): now includes minâ€“max hardware range from sysfs\ncpufreq on Linux â€” e.g. \"2.38 GHz (0.42 â€“ 5.13 GHz)\".\n\nTests: format_cpu_cores (3 cases), detect_cpu_cache (Linux sysfs\npresence check), detect_cpu_freq_range (ordered pair assertion).\n\nBenchmarks: detect_cpu_cache (Linux+macOS), detect_cpu_freq_range\n(Linux), format_cpu_cores (all platforms).\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: add dry-run fetcher step to full-test job\n\nRC tag builds now execute the binary with --long on every platform,\nmatching the visibility the build job provides on PRs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix(cpu-usage): show instantaneous % on Windows without load average\n\nWindows has no load average concept; sysinfo returns zeros. On Windows,\ndisplay just the usage percentage rather than suppressing the field.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-16T14:41:43-07:00",
          "tree_id": "bf24aa1ba36c56763b1bb1c4cc56933d6673dfac",
          "url": "https://github.com/l1a/retch/commit/152d458bb9475caf4f944421182e2c542a451393"
        },
        "date": 1781646690003,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 612290856.5400003
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1016817933.74
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "c1e57ab633ff499ba3b5c403f76c3a7759099fed",
          "message": "Remove supported versions section from SECURITY.md\n\nRemoved the section listing supported versions for security updates.",
          "timestamp": "2026-06-17T17:38:28-07:00",
          "tree_id": "21593a997c5d3bf2a5bbdb06616374cba90615c4",
          "url": "https://github.com/l1a/retch/commit/c1e57ab633ff499ba3b5c403f76c3a7759099fed"
        },
        "date": 1782229178470,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 669311982.3000001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1010054635.6999999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "896a3acbc1b5feb1819a84acfb46eb52795d7abe",
          "message": "Add AUR and Nixpkgs packaging configs (#103)\n\n* Add AUR and Nixpkgs packaging configs\n\nCreates PKGBUILD for Arch Linux and package.nix for Nixpkgs, along\nwith local Nix test building expressions and automated CI workflows\nto verify compilation.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix tar warning in packaging CI\n\nExclude output file from tar archive by writing to /tmp/ first,\nresolving the \"file changed as we read it\" error in CI.\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: add AUR registration outage note to README.md\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix AUR linker target and dependencies in CI\n\nAdd sqlite pacman dependency and unset runner-inherited CARGO_TARGET\nlinker config in the Arch container to ensure native build/link.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Replace pandoc with mandown for man pages\n\nSwitch the manual page compilation toolchain from pandoc to mandown. Update Justfile, packaging configurations, Nix flake devShell, CI workflows, and documentation references. Regenerate docs/retch.1.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix AUR CI: remove system sqlite package\n\nrusqlite uses bundled feature which compiles sqlite3 statically. Installing the system sqlite package causes ld.lld symbol conflicts on Arch Linux. The system package is not needed.\n\nAssisted-By: Claude Sonnet 4.6\n\n* Disable LTO for AUR PKGBUILD\n\nArch Linux's default makepkg settings enable LTO, which conflicts with static linking of Cargo-compiled C dependencies (like sqlite3 in rusqlite's bundled feature), resulting in undefined symbol errors.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Automate Nixpkgs hash calculation\n\nAdd scripts/calculate_nix_hashes.py to compute source and cargo hashes. Add nix-update recipe to Justfile, and integrate hash calculation into the GitHub Actions release workflow to publish hashes in release notes.\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-23T13:54:22-07:00",
          "tree_id": "b42a76f82aaadcc436f134774a47331b654c10c7",
          "url": "https://github.com/l1a/retch/commit/896a3acbc1b5feb1819a84acfb46eb52795d7abe"
        },
        "date": 1782248099760,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 661464307.9399999
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1008572003.5400001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "e751e50d49581e42a9b60a8ce8250769697d64bd",
          "message": "Fix prefetch hash formatting (#104)\n\nAdd --type sha256 to nix-prefetch-url to force hexadecimal output, preventing binascii decoding failures caused by Nix's default base32 output format.\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-23T14:30:26-07:00",
          "tree_id": "b6460f8f0dbedb5db54470e4530c3c679c262d5b",
          "url": "https://github.com/l1a/retch/commit/e751e50d49581e42a9b60a8ce8250769697d64bd"
        },
        "date": 1782250251410,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 695938071.0000001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1008314662.1999999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "01cff50855f67afef7c41650489cfb3113951b41",
          "message": "Use nix hash to-sri to convert prefetch (#105)\n\nReplace hex_to_sri with to_sri helper that invokes native nix hash to-sri. This handles Nix's base32 output format natively and robustly without manual base-16 decoding.\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-23T14:55:59-07:00",
          "tree_id": "02d2c565ab74b7d19cf0433027a69ad08308b311",
          "url": "https://github.com/l1a/retch/commit/01cff50855f67afef7c41650489cfb3113951b41"
        },
        "date": 1782251792326,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 1327769793.1599996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1008911873.26
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "b45894a1b7175cde4f9dd68da42b049ded0ebec1",
          "message": "perf: map sequential mode comparisons\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:02:25-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/b45894a1b7175cde4f9dd68da42b049ded0ebec1"
        },
        "date": 1782327856821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 296929912.90000004
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015626409.8000001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7704518.160000002
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 21427224.06
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 420274291.90000004
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1016208900.5000001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "447f7796abf0b7810da7499a874504400076dfb6",
          "message": "Merge pull request #111 from l1a/fix/performance-regression\n\nperf: fix performance regression and align hyperfine mode comparisons",
          "timestamp": "2026-06-24T12:14:54-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/447f7796abf0b7810da7499a874504400076dfb6"
        },
        "date": 1782328547025,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 340585029.62000006
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1009906876.6200001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 49260230.14000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 25499052.439999998
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 435027252.5
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1009796062.4
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "04d2442f2ab2a46ae627bbe76af2e08ecec87220",
          "message": "Merge pull request #112 from l1a/feat/windows-phys-disk-mem\n\nfeat: implement Windows PhysDisk and PhysMem detection",
          "timestamp": "2026-06-24T22:33:30-07:00",
          "tree_id": "9c6c912cc8c4f04055290db2ab35fc64cc3e8675",
          "url": "https://github.com/l1a/retch/commit/04d2442f2ab2a46ae627bbe76af2e08ecec87220"
        },
        "date": 1782365734929,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 332842595.46
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1088879244.66
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 10380929.32
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 40421419.22000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 427224909.12
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1083144341.1200001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "ee330bee589f3cc23883fa67e627ad06b31d2d2b",
          "message": "fix: rebuild release binary if signal-killed on post-merge bench (#117)\n\nA Syncthing-synced binary compiled with target-cpu=native on a\ndifferent CPU microarchitecture crashes with SIGILL during sysinfo\ngathering. Cargo considers it up-to-date so `cargo build --release`\nis a no-op. Detect signal-killed exit (Python returncode < 0) and\nforce `cargo clean -p retch-cli && cargo build --release`.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:59:12-07:00",
          "tree_id": "13b71b071d9e5f31c3faa06d4aa51320377501b8",
          "url": "https://github.com/l1a/retch/commit/ee330bee589f3cc23883fa67e627ad06b31d2d2b"
        },
        "date": 1782576018987,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 909193128.1400001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015423531.4399999
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 617644882.28
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 19067960.48
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1115824909.6599998
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1015327370.7600001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f",
          "message": "feat: add just install-completions recipe (#118)\n\nGenerates and installs shell completions for bash, zsh, fish, elvish,\nnushell, and powershell to their correct XDG user locations. Also adds\nXDG path variables at the top of the Justfile and updates `just install`\nto depend on both install-man and install-completions.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:37:34-07:00",
          "tree_id": "d9c8234aa1d97872442e3e68b1a968f215f50f90",
          "url": "https://github.com/l1a/retch/commit/9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f"
        },
        "date": 1782578295047,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 287818538.20000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015712546.8000001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6305285.44
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 18450095.64
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 455919656
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1016571243.1000003
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "71466e09694d76209fdf3bc02eef9cdfc6155c0d",
          "message": "docs: add performance regression vigilance guideline to AGENTS.md (#119)\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:53:59-07:00",
          "tree_id": "b6775fe68f3fa2aa0befa4fe2f722a2a1f15a8fe",
          "url": "https://github.com/l1a/retch/commit/71466e09694d76209fdf3bc02eef9cdfc6155c0d"
        },
        "date": 1782579280604,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 286821646.86
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015625430.4599997
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6326956.620000002
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 19463596.62
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 471292486.42
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1015924385.82
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "d76a7d5246a051893671a84ed973b52bbe56e1b1",
          "message": "fix: skip FUSE and pseudo mounts in disk detection (#120)\n\n* fix: skip FUSE and pseudo mounts in disk detection\n\nsysinfo::Disks::new_with_refreshed_list() calls statvfs on every entry\nin /proc/mounts, including FUSE mounts that can block for hundreds of\nmilliseconds (e.g. cryfs vault: 613ms).\n\nOn Linux, replace sysinfo disk enumeration with a direct /proc/mounts\nreader that filters pseudo/FUSE filesystem types before calling statvfs.\nmacOS and Windows continue to use sysinfo::Disks unchanged.\n\nReduces disk field timing from ~634ms to ~2ms on affected machines.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: restore cross-platform deps moved to linux-only target by mistake\n\ndirs, chrono, anyhow, owo-colors, and rusqlite are used unconditionally\nacross macOS/Windows; only libc should be linux-only.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: mark is_skip_fs as linux-only to silence dead_code on macOS/Windows\n\nThe function is only called from detect_logical_linux which is already\ncfg-gated; clippy -D warnings caught it on the macOS CI job.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: make libc an unconditional dep to avoid lock file mismatch on AUR CI\n\nSome cargo versions handle cfg-gated deps in the lock file differently.\nlibc compiles on all platforms; the Linux-specific code that uses it is\nalready cfg-gated, so making it unconditional is safe.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:34:03-07:00",
          "tree_id": "1740235a0c0c2d66418ef5eac4e55c0e3132401a",
          "url": "https://github.com/l1a/retch/commit/d76a7d5246a051893671a84ed973b52bbe56e1b1"
        },
        "date": 1782581702552,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 284949435.91999996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1013226334.9200002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6888387.000000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 20014272.1
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 447454319.92
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1013221332.4200001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "7733084c8ee1c58721066fc0199ac3c4ec3b2f4d",
          "message": "chore: bump version to v0.3.26 (#121)\n\n* chore: bump version to v0.3.26\n\nFollows fix for FUSE mount statvfs hang (PR #120).\n\nAssisted-By: claude-sonnet-4-6\n\n* docs: add mandatory pre-PR gate checklist to AGENTS.md\n\nForces explicit per-item verification output before gh pr create so\nno version bump or doc step can be silently skipped.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:56:14-07:00",
          "tree_id": "68842ea99eb9a017711b6c72ef0f9687e864c5da",
          "url": "https://github.com/l1a/retch/commit/7733084c8ee1c58721066fc0199ac3c4ec3b2f4d"
        },
        "date": 1782583025110,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 285746274.32
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015332393.3200003
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6014087.220000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 19369924.720000003
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 465497989.79999995
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1015585320.8000001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "79e4de519e6b7bc2f4ce2f6df351d62e41c05b26",
          "message": "feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields (#122)\n\n* feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields\n\nCloses six items from the fastfetch feature gap list:\n\n- Chassis: DMI chassis_type â†’ human label on Linux; hw.model inference on macOS\n- Init: /proc/1/comm on Linux; static \"launchd\"/\"SCM\" on macOS/Windows\n- Locale: $LC_ALL â†’ $LC_MESSAGES â†’ $LANG\n- Bootmgr: checks /boot/loader, /boot/grub2, /boot/grub, /sys/firmware/efi on Linux\n- Editor: $VISUAL â†’ $EDITOR\n- Weather: curl wttr.in/?format=3 (long mode only, 3s timeout)\n\nChassis/Init/Locale/Bootmgr/Editor added to the default output set.\nWeather is long-only to avoid adding a network call to standard runs.\n\nAlso moves the feature gap tracking list from AGENTS.md to NOTES.md â€”\nit is project state, not a standing instruction.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add weather_location config key\n\nUsers can now set `weather_location` in config.toml to pin the weather\nfield to a specific city name, ZIP code, airport IATA code, or lat/lon\ncoordinates â€” all formats supported natively by wttr.in. Without the\nkey, location is auto-detected from the requester's IP as before.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: complete --generate-config output\n\nAdded missing logo key, weather_location key, and updated the fields\nexample to include all current fields (chassis, init, locale, bootmgr,\neditor, weather, phys-mem, phys-disk, cpu-cache, cpu-usage, etc.).\nAlso synced DEFAULT_FIELDS_BLOCK in config.rs to match.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add --weather-location CLI flag\n\nAllows specifying weather location on the command line, overriding the\nconfig file's weather_location setting.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: URL-encode weather location and handle unknown locations\n\nSpaces and commas in location strings (e.g. \"Thousand Oaks, CA\") were\nnot encoded, breaking the URL. Now encodes spaces as + and commas as\n%2C before inserting into the wttr.in URL path.\n\nAdded -f to curl so HTTP 4xx/5xx (unknown location) causes a non-zero\nexit and the Weather field is silently omitted rather than showing the\nwttr.in error text.\n\nAdded url_encode_location unit tests.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: show error when explicit weather location is not found\n\nInstead of silently omitting the Weather field, display\n'Unknown location: \"<name>\"' when the user set a location\nexplicitly but wttr.in can't resolve it. Auto-detect failures\n(no location set) remain silent.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: update tests and benchmark for weather_location field\n\nAdded weather_location to config test fixtures and CollectOptions\ninitializer in benchmarks.rs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump version to v0.3.27, update docs and README\n\n- Bump retch-cli to 0.3.27, retch-sysinfo to 0.1.27\n- Bump AGENTS.md Current State header to v0.3.27\n- README: add weather_location config key, update fields example with\n  all new fields (chassis, init, locale, bootmgr, editor, weather)\n- docs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add just pr pre-PR gate recipe\n\nAutomates the pre-PR checklist so it can't be skipped:\n- Checks feature branch (not main)\n- Checks version bumped past last tag\n- Checks AGENTS.md Current State header matches version\n- Regenerates man page and fails if result is uncommitted\n- Runs cargo check and fails if Cargo.lock is uncommitted\n- Runs just check (fmt + clippy)\n- Runs cargo test\n- Prints manual checklist (README, release log, wiki) and requires\n  explicit 'y' confirmation before exiting 0\n\nUpdates AGENTS.md pre-PR gate instruction to reference just pr.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: move Chassis, Init, Locale, Bootmgr, Editor to long-only output\n\nThese fields are too verbose for the default view. They now appear\nonly in --long mode, alongside Weather.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: disable nixpkgs verification job\n\nnixpkgs PR was declined due to lack of popularity. No point running\nthe slow Nix build until we meet the popularity threshold. Re-enable\nby removing the `if: false` condition.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-28T08:32:51-07:00",
          "tree_id": "d40cb87dbb3673839a3b79e597cda6b56ae3e97f",
          "url": "https://github.com/l1a/retch/commit/79e4de519e6b7bc2f4ce2f6df351d62e41c05b26"
        },
        "date": 1782660826204,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 287051971.6600001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1014106433.3599999
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6768275.4
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 21147724.3
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 870764560.52
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1008912958.0199999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "770e0b0eabf6d60a1fecc1982117f738c3899fc0",
          "message": "feature/add tldr (#123)\n\n* docs: add tldr page entry for retch\n\nAssisted-By: Gemini 3.5 Flash\n\n* chore: add tldr page to pre-pr checklist\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add tldr-release automation script and recipes\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add merge-pr recipe and reset_wip script\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:28:45-07:00",
          "tree_id": "c1f8fdf58502f0ab22c57e17c25bcbd3feda49dd",
          "url": "https://github.com/l1a/retch/commit/770e0b0eabf6d60a1fecc1982117f738c3899fc0"
        },
        "date": 1782664185381,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 327539333.36
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1009864918.1600003
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 46438355.42
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22903896.22
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 998819977.26
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1008202201.5600001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "b8d3f6ea87cf396f449249595ed4d787aa2bb2fe",
          "message": "fix: ignore already deleted branch error in merge-pr recipe (#124)\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:34:40-07:00",
          "tree_id": "c9c370af106069b537c4019e66afc44f31927e26",
          "url": "https://github.com/l1a/retch/commit/b8d3f6ea87cf396f449249595ed4d787aa2bb2fe"
        },
        "date": 1782664528836,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 328080074.4
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1010899272.1
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 46519140.36000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22296280.86
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1001737213.1199998
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1008362514.7200001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "d13f2fe0da7a898a1ebbd9c412284e5d02a0651e",
          "message": "chore/refactor docs (#125)\n\n* docs: refactor documentation structure\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: fix Current State header formatting\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:54:34-07:00",
          "tree_id": "aaa002e02169e3c871a1373946d09700c6002e90",
          "url": "https://github.com/l1a/retch/commit/d13f2fe0da7a898a1ebbd9c412284e5d02a0651e"
        },
        "date": 1782665722147,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 330035494.18
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1012210739.4799999
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 46359839.78
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22527919.38
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 970122834.94
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1017666886.2400002
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "0bc5e587df1dee945e8b33182694531b28affdb9",
          "message": "Merge pull request #126 from l1a/fix/tldr-auth-bypass\n\nfix: resolve gh auth and fork directory issues in tldr release script",
          "timestamp": "2026-06-28T19:15:24-07:00",
          "tree_id": "41349673c84e317f53711dc893f4ebf44ab425c3",
          "url": "https://github.com/l1a/retch/commit/0bc5e587df1dee945e8b33182694531b28affdb9"
        },
        "date": 1782699585197,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 281106885.37999994
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1012974495.18
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5615800.120000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 18234624.220000003
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 876507575.84
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1015778769.04
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "b61db1f0a08f4d023930e0231b61079b17d4dc75",
          "message": "Merge pull request #127 from l1a/fix/tldr-page-format\n\nfix: fix tldr page lint errors",
          "timestamp": "2026-06-28T19:35:48-07:00",
          "tree_id": "80701731a659a4af0387474cc7517b7f36d10c32",
          "url": "https://github.com/l1a/retch/commit/b61db1f0a08f4d023930e0231b61079b17d4dc75"
        },
        "date": 1782700671691,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 285367175.52000004
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1014517966.0199996
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6049537.040000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 20419225.64
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 898822199.0400002
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1015132152.6400001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "1094ac231ae3237ed49464785b01c00c96026b20",
          "message": "feat: add TerminalSize, DNS, WM fields; fix Shell detection (v0.3.29) (#128)\n\n* feat: add TerminalSize, DNS, WM fields; fix Shell detection\n\n- TerminalSize: ioctl(TIOCGWINSZ) on Linux/macOS, $COLUMNS/$LINES fallback\n- DNS: parse /etc/resolv.conf nameserver lines; PowerShell on Windows\n- WM: scan /proc for compositor/WM process names; suppressed in output\n  when identical to Desktop field (case-insensitive)\n- Shell: walk process tree first to find running shell; fall back to\n  $SHELL (login shell) only when scan yields nothing\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: improve Desktop detection when XDG env vars are absent\n\nAdd XDG_SESSION_DESKTOP and GDMSESSION as fallbacks, normalize\nDE names to canonical casing, and probe /proc as a last resort\n(e.g. gnome-shell â†’ GNOME) for terminals that don't inherit the\nfull session environment.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add non-Linux stub for detect_desktop_from_proc\n\nSatisfies clippy::unnecessary_lazy_evaluations (Rust 1.96+):\nreplace inline cfg closure with .or_else(detect_desktop_from_proc)\nand add a #[cfg(not(target_os = \"linux\"))] stub returning None.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: suppress logo when stdout is not a tty\n\nUse std::io::IsTerminal::is_terminal() instead of terminal_size()\nto detect piped output. terminal_size() returns Some() when a pager\nlike bat allocates a PTY, causing the logo to print as raw escape\nsequences.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+tests: update for v0.3.29 PR changes\n\n- docs/retch.1.md + retch.1: note logo tty-suppression in LOGOS section\n- README.md: add auto-suppressed-when-piped bullet to Logo Rendering Modes\n- NOTES.md: bump Current State to v0.3.29; add Desktop fix, logo tty\n  suppression, and logo cursor placement to release entry; remove DNS,\n  WM, TerminalSize from feature gap list\n- tests/cli_tests.rs: add tests for --fields dns/wm/terminal-size and\n  piped output containing no graphical logo escape sequences\n- fetch.rs: add unit tests for normalize_desktop_name,\n  detect_desktop_from_proc, and title-case/whitespace edge cases\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T12:30:38-07:00",
          "tree_id": "47d929d6f83cb36e994b9821fee1a649e882b21c",
          "url": "https://github.com/l1a/retch/commit/1094ac231ae3237ed49464785b01c00c96026b20"
        },
        "date": 1782761712609,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 299603098.1
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1014817924.4000002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5938365.319999999
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22177044.12
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1061261367.7999998
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1014221666.0999999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a",
          "message": "fix: advance cursor past graphical logo bottom edge (#129)\n\nWhen the info field list is shorter than the logo height, the shell\nprompt was drawn on top of the logo. Fix by computing the logo's\nheight in terminal rows (image px height / cell px height via\nTIOCGWINSZ, with 20px fallback) and emitting CSI B after restoring\nthe cursor to push past the logo's bottom edge.\n\nAdds libc as a unix-only direct dep for TIOCGWINSZ.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:00:36-07:00",
          "tree_id": "f9622416d510a495b2af1a31b6b9c7e6b12f477e",
          "url": "https://github.com/l1a/retch/commit/1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a"
        },
        "date": 1782763301061,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 312137431.88000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1009421128.7800001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6845087.260000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22758800.26
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1167093649.8
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1022820221.1999999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "400f31e6f99e05724137adc0e67d046233010752",
          "message": "feat: switch weather backend to Open-Meteo (v0.3.30) (#130)\n\n* feat: switch weather to Open-Meteo + ipinfo.io\n\nReplace wttr.in (World Weather Online backend) with:\n- Open-Meteo for temperature/WMO weather code (geocoding API + forecast API)\n- ipinfo.io for IP-based auto-location fallback\n\nAdds `weather_unit` config/CLI option (\"fahrenheit\"/\"celsius\").\nWMO weather codes are mapped to emojis.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+test: improve weather.rs coverage and docs\n\n- Doc comments on detect_weather, curl_get, wmo_to_emoji, WeatherUnit variants\n- Expand wmo_to_emoji test to cover all major WMO code ranges + fallback\n- Add parse_coords edge cases: spaces around comma, out-of-range lat/lon\n- Add geolocate_ip display-name tests (US, non-US, no-city) without network\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.30, update docs and man page\n\nVersion: 0.3.29 â†’ 0.3.30 / retch-sysinfo 0.1.29 â†’ 0.1.30\nNOTES.md: Current State header + v0.3.30 release log entry\nREADME.md: fix weather config comment, add weather_unit key\ndocs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add weather-location to tldr page\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: note tldr upstream submission on hold\n\nUpstream tldr-pages submission denied pending community traction.\nKeep docs/retch.md and just tldr-release workflow maintained but\ndo not submit upstream until further notice.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add --weather-unit CLI flag\n\nWas wired through config but never added to the Cli struct.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:54:42-07:00",
          "tree_id": "2f9c12cc5e33db065dd02eb01cd157c8227985d1",
          "url": "https://github.com/l1a/retch/commit/400f31e6f99e05724137adc0e67d046233010752"
        },
        "date": 1782766551104,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 305625159.98
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1013953724.8799999
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6487834.680000002
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 23372295.880000006
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1628395963.82
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1012509179.22
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "dbfa98155bcaa5b4a0415343af370f5580c7bc69",
          "message": "Merge pull request #131 from l1a/feat/output-mode-strata\n\nfeat: add --full mode, restructure output strata (v0.3.31)",
          "timestamp": "2026-06-29T15:47:51-07:00",
          "tree_id": "387cdab8aa181c79bc2a9d112600cd183d385188",
          "url": "https://github.com/l1a/retch/commit/dbfa98155bcaa5b4a0415343af370f5580c7bc69"
        },
        "date": 1782773324877,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 308169185.4800001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1017112727.4799998
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6967343.0200000005
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 24200671.220000003
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 560390165.22
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1016610456.9200001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c",
          "message": "chore: merge AGENTS.md with etr, document just pr gate (#133)\n\n* chore: merge AGENTS.md with etr, document just pr gate\n\nRestructure AGENTS.md into a Portable Core (kept in sync with etr's\nAGENTS.md) plus project-specific rules. Add NOTES.md read/update\ndiscipline and Core Developer Guidelines adopted from etr, and\ndocument exactly what the existing just pr gate automates.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: add CLAUDE.md, require reading ~/AGENTS.md\n\nretch had no CLAUDE.md pointing agents at AGENTS.md; add one\n(relative link), matching the fixed version now in etr. Also add a\nGlobal Mandates item to the Portable Core requiring agents to read\n~/AGENTS.md before starting work, so cross-repo mandates aren't\nsilently skipped when only the repo AGENTS.md is consulted.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T11:59:32-07:00",
          "tree_id": "1a29b12394fae5b30b5d0d83a768c294938169ae",
          "url": "https://github.com/l1a/retch/commit/4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c"
        },
        "date": 1782932424094,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 302984380.53999996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1014823224.5400002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5904487.6400000015
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 21711995.14
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 490103540.05999994
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1099738304.6600003
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "e6605afd7d4f8dbce3f984541177ffaffb57901b",
          "message": "fix: allow dependabot PRs to trigger claude-code-review (#134)\n\nclaude-code-action@v1 refuses to run for non-human actors by default,\nso every Dependabot PR (e.g. #132) hard-failed the claude-review\ncheck in ~10s before doing any actual review. Add\nallowed_bots: 'dependabot[bot]' scoped narrowly to Dependabot.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T12:19:47-07:00",
          "tree_id": "a345de40f93e702accd3928257b0d831789bd7c1",
          "url": "https://github.com/l1a/retch/commit/e6605afd7d4f8dbce3f984541177ffaffb57901b"
        },
        "date": 1782933639967,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 303990139.62
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015344961.6199999
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5936922.86
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 23527443.459999997
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 440051895.44
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1016548599.2400001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "l1a"
          },
          "committer": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "l1a"
          },
          "distinct": true,
          "id": "c732fa42bbf646eaedff5b0000c0f3a94793f64f",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#132)\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [clap_complete](https://github.com/clap-rs/clap) and [anyhow](https://github.com/dtolnay/anyhow).\n\n\nUpdates `clap_complete` from 4.6.5 to 4.6.7\n- [Release notes](https://github.com/clap-rs/clap/releases)\n- [Changelog](https://github.com/clap-rs/clap/blob/master/CHANGELOG.md)\n- [Commits](https://github.com/clap-rs/clap/compare/clap_complete-v4.6.5...clap_complete-v4.6.7)\n\nUpdates `anyhow` from 1.0.102 to 1.0.103\n- [Release notes](https://github.com/dtolnay/anyhow/releases)\n- [Commits](https://github.com/dtolnay/anyhow/compare/1.0.102...1.0.103)\n\n---\nupdated-dependencies:\n- dependency-name: anyhow\n  dependency-version: 1.0.103\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: clap_complete\n  dependency-version: 4.6.6\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-07-01T12:45:11-07:00",
          "tree_id": "f6c62954a19f2b176352837922b1b5d311baa1e8",
          "url": "https://github.com/l1a/retch/commit/c732fa42bbf646eaedff5b0000c0f3a94793f64f"
        },
        "date": 1782935197210,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 308224847.03999996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1017452140.9400002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5590756.72
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 21445229.32
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 580853738.7799999
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1017209683.78
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee",
          "message": "docs: add Development-Setup.md to wiki checklist (#135)\n\n* docs: add Development-Setup.md to wiki checklist\n\nIt was omitted from AGENTS.md Â§4.8 when the checklist was first\nwritten, even though it documents just recipes and was directly\naffected by the just pr/just merge-pr additions. Also caught up the\nwiki itself (done directly, outside this PR, since wiki edits aren't\ngated by review): documented just pr/merge-pr and fixed a stale\npandoc reference (Justfile/flake use mandown).\n\nAssisted-By: Claude Sonnet 5\n\n* docs: add Development-Setup.md to NOTES.md wiki list too\n\nSame gap as AGENTS.md \\u00a74.8, duplicated in NOTES.md \\u00a73's own\nwiki checklist.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T13:51:17-07:00",
          "tree_id": "48e3a31d893308fa4ca9065b2e39f8936f7d87f6",
          "url": "https://github.com/l1a/retch/commit/0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee"
        },
        "date": 1782939128553,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 310584075.26
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1015212206.86
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5614832.3
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22568842.7
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 539085309.66
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1017320763.1600001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "efde1f0505b401f804ea9e26c4968d6f1499ca8d",
          "message": "chore: untap aws/tap in macOS benchmark CI (cosmetic) (#136)\n\nThe macOS benchmark job surfaces \"aws/tap is not trusted\" Homebrew\nwarnings as Actions annotations on every run, caused by a\npre-installed tap on the GitHub-hosted macos-latest runner image\nthat's unrelated to installing fastfetch/hyperfine. Nothing was\nfailing â€” this just declutters the Actions summary.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T14:36:18-07:00",
          "tree_id": "e1067f42e582559f8bd96b6325d3d25a663aece1",
          "url": "https://github.com/l1a/retch/commit/efde1f0505b401f804ea9e26c4968d6f1499ca8d"
        },
        "date": 1782941894277,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 312385391.56
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1029461596.86
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5566900.420000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 23513383.820000004
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 572663617.0400001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1038316553.7400001
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "15176a3f82579e79a3b29d95a33a28f18bfc2bf9",
          "message": "feat: add btrfs and zpool storage fields (#137)\n\nAdds `btrfs` (label, subvolume, and used/allocated space per mount point,\nwith best-effort snapshot count) and `zpool` (ZFS pool allocation and\nhealth) fields, both gated behind --long and above. Closes the two\nStorage & Filesystems items in NOTES.md's fastfetch feature-gap list.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T15:30:08-07:00",
          "tree_id": "87ab581eee79770fe40b13279622d3b13a20f53c",
          "url": "https://github.com/l1a/retch/commit/15176a3f82579e79a3b29d95a33a28f18bfc2bf9"
        },
        "date": 1782945060644,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 310246449.08
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1013705534.9800001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6920006.680000002
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 24121928.080000002
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 582707208.86
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1023755811.6599998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "67c88b1988e92087607f45e6cd164467a3fd2db1",
          "message": "Show configured vs. rated memory speed on phys-mem (#138)\n\n* feat(sysinfo): show configured vs rated memory speed on Linux\n\ndmidecode's \"Configured Memory Speed\" is the module's actual running\nspeed, separate from \"Speed\" (rated max) â€” surfaces cases like\nXMP/EXPO not being enabled where RAM runs below spec.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: rename Memory display label to Memory Usage\n\nClarifies against the adjacent \"Phys Mem:\" line. The --fields/config\nkey \"memory\" is unchanged via an alias in should_show(), matching the\nexisting dns/\"DNS Server\" pattern.\n\nAssisted-By: Claude Sonnet 5\n\n* chore: add just open-pr as the sanctioned PR-opening entry point\n\ngh has no hook of its own to gate PR creation, so this recipe (just\npr's checklist, then gh pr create) is the one enforcement point that\nworks regardless of which tool is driving.\n\nAssisted-By: Claude Sonnet 5\n\n* docs: v0.3.38, agent-agnostic tooling mandate, memory speed docs\n\n- Bump retch-cli 0.3.38 / retch-sysinfo 0.1.33 (public DimmSlot field\n  addition), regenerate man page.\n- README/man page: document configured-vs-rated memory speed display.\n- NOTES.md: Current State header, v0.3.38 release log entry.\n- AGENTS.md: mandate reading chezmoi-manager skill in full before any\n  chezmoi command (prior incident caused git desync requiring\n  reverts); mandate recording learnings in AGENTS.md/SKILL.md rather\n  than agent-specific memory, so any agent benefits, not just one.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: open-pr recipe loses arg quoting without a shebang\n\njust's plain (non-shebang) recipe substitution joins *ARGS with bare\nspaces, so multi-word --title/--body values lost their quoting and\nbroke gh's flag parsing. A shebang recipe passes ARGS as real argv via\n\"$@\", preserving quoting correctly.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: set positional-arguments so open-pr's shebang script gets \\$@\n\nThe prior shebang fix alone wasn't enough -- without positional-arguments,\njust's shebang recipes don't receive *ARGS as real argv, so \"\\$@\" was\nempty. With it set, ARGS forward correctly through gh pr create.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-02T16:50:33-07:00",
          "tree_id": "e2969e45b48ba97220eb96078e8a686bd30d1fcc",
          "url": "https://github.com/l1a/retch/commit/67c88b1988e92087607f45e6cd164467a3fd2db1"
        },
        "date": 1783036289016,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 330680475.84
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1153947696.84
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 8232426.2
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 31948600.700000003
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 454413016.9800001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1089099056.68
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "18f0bfa4e337d9a815662b1383dab85187e1ac5c",
          "message": "Fix bench-cli/bench-compare on Windows (#145)\n\nThe bench recipes passed a POSIX-style './target/release/retch' to\nhyperfine. With no --shell, hyperfine uses cmd.exe on Windows, which\ncan't execute that path (forward slashes, no .exe), so it exited 1 in\nthe first warmup run and aborted the recipe. retch itself was fine and\n`just bench` (criterion) was unaffected.\n\nAdd an os_family()-selected `retch_release_bin` variable\n('target\\release\\retch.exe' on Windows, './target/release/retch'\nelsewhere) and route all bench hyperfine calls through it. Verified both\nrecipes now run to completion on Windows.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T21:26:47-07:00",
          "tree_id": "b2195da8db613809ef3a732f524156e3dd175501",
          "url": "https://github.com/l1a/retch/commit/18f0bfa4e337d9a815662b1383dab85187e1ac5c"
        },
        "date": 1783744614936,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 264586910.13999996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1023396310.8400002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5306874.600000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 4673781.100000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 379187143.21999997
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1022550230.3199998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "84a7d7c354231007c97f94f25b262266bb64e146",
          "message": "Fix machine-dependent format_cpu_cores tests (#155)\n\n`format_cpu_cores` reads the host's real CPU topology (Linux /sys cpufreq,\nmacOS hw.perflevel*) and returns a \"NP + ME / KT\" hybrid string on Intel P/E\nand Apple Silicon machines, ignoring its passed-in (logical, physical) counts.\nThe four fallback unit tests called it with fixed args, so they passed on\nnon-hybrid CPUs/CI runners but failed on a hybrid host — an i7-1360P produced\n\"8P + 8E / 16T\" for (16, Some(8)) where the test expected \"8C / 16T\", hard-\nfailing `just pr` there.\n\nExtract the pure fallback into `format_cpu_cores_plain` and retarget the four\ntests at it, so they no longer depend on the runner's hardware. Public\nbehavior of `format_cpu_cores` is unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:41:15-07:00",
          "tree_id": "26f59d72e69fb5f71508fb9427bd765258b160f2",
          "url": "https://github.com/l1a/retch/commit/84a7d7c354231007c97f94f25b262266bb64e146"
        },
        "date": 1783906927377,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 325212441.76000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1112254687.76
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7751780.740000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 16385168.040000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 414277718.96000004
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1098616132.5599997
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "be732f18be8ed35c252a364cc1241d542d0962ef",
          "message": "Enforce LF line endings via .gitattributes (#156)\n\nThe working tree is shared across Linux/macOS/Windows via Syncthing. With no\n.gitattributes and core.autocrlf=false, a Windows checkout wrote CRLF, Syncthing\npropagated those bytes to the Linux clones, and git reported the entire tree as\nmodified — a phantom 13811+/13811- whole-tree diff with zero content changes\n(git diff --ignore-all-space empty). This blocked the just-pr clean-tree checks.\n\nAdd `* text=auto eol=lf` to force LF on checkout on every OS (essential for a\nbyte-identical Syncthing-shared tree) and `*.png binary` to protect the logo\nassets. HEAD was already stored as LF, so no tracked content changes.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:59:28-07:00",
          "tree_id": "09a0473cae06eab0155f9d17e371c9dc4271dea9",
          "url": "https://github.com/l1a/retch/commit/be732f18be8ed35c252a364cc1241d542d0962ef"
        },
        "date": 1783908019105,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 349015586.93999994
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1089065946.9400003
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 8671397.780000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 23547239.68
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 433715089.48
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1086049814.6799998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "280db85bc07aaa37fe6e22c1428c57d3a95ba55b",
          "message": "Add Linux login-manager/brightness/power-adapter (#157)\n\nThree new --long fields closing NOTES §6 fastfetch gaps, each a cheap\nsingle-source Linux probe in the sequential detect_* style (like init/chassis):\n\n- login-manager: resolves the display-manager.service systemd unit symlink\n  (GDM/SDDM/LightDM/greetd/…), prettified.\n- brightness: reads /sys/class/backlight/*/{brightness,max_brightness} as a %.\n- power-adapter: reads the Mains supply under /sys/class/power_supply (name +\n  connected state; wattage omitted — sysfs Mains rarely exposes it).\n\nAll three are Linux-only (None elsewhere). Each detector wraps a pure helper\n(login_manager_from_unit / brightness_percent / format_power_adapter), split\nout and unit-tested host-independently per the v0.4.2 format_cpu_cores lesson;\nhelpers + tests are cfg(linux) so they aren't dead code under clippy -D warnings\non other platforms. Verified live on corrino (greetd, 51%, AC (connected)).\n\nretch-cli 0.4.3 -> 0.5.0, retch-sysinfo 0.1.42 -> 0.1.43.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T20:11:45-07:00",
          "tree_id": "c4f4b86a753026bf48a3009deb1ece1f46ea99bc",
          "url": "https://github.com/l1a/retch/commit/280db85bc07aaa37fe6e22c1428c57d3a95ba55b"
        },
        "date": 1783912357360,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 329000509.56000006
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1125124496.9600003
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 8947977.6
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 22744153.6
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 412928558.2800001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1091059457.7800002
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "fbb9672b8c95616671974128187d9d3b32f0fe53",
          "message": "Fix network status bracket color nesting (#158)\n\nowo_colors closes every foreground color with the default-reset \\x1b[39m, so\nthe green \"Up\" / red \"Down\" embedded in the Net value cancelled the enclosing\nvalue color (and, for the active interface, the bright-blue highlight). Everything\nafter [Up] fell back to the terminal default: the active line's opening [ was blue\nbut the closing ] and the RX/TX stats were not.\n\nAdd colorize_nested(text, prefix) which re-asserts the enclosing color after every\ninterior \\x1b[39m so nested colored spans restore the surrounding color instead of\nfalling to default. It is byte-identical to the old plain wrap when there is no\nnested reset, so only the Net field's rendering changes. Theme::color_value routes\nthrough it and the active-interface highlight uses ACTIVE_IFACE_PREFIX. The library\nnetwork.rs is untouched. Four regression tests cover the helper.\n\nBump retch-cli to 0.5.1 (retch-sysinfo unchanged at 0.1.43); regen man page.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T21:49:19-07:00",
          "tree_id": "15c36368910c46efd1ba4d0a4f43df2b81c63aa0",
          "url": "https://github.com/l1a/retch/commit/fbb9672b8c95616671974128187d9d3b32f0fe53"
        },
        "date": 1783918205557,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 261377380.64000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1023746614.7399999
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 5076573.98
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 5108351.379999999
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 371894629.35999995
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1024467865.3599999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "c0edb25430b6cfb1cf5cb62229659048de5b3c7b",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:47:29-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/c0edb25430b6cfb1cf5cb62229659048de5b3c7b"
        },
        "date": 1785077863891,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 270342547.0800001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1064529114.3800002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 3834756.5400000005
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 17767007.94
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 447042940.2200001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1066271916.6199999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "fd8164049e99da545e8fe98d3f0b76e8c09b6faa",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10) (#175)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:58:18-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/fd8164049e99da545e8fe98d3f0b76e8c09b6faa"
        },
        "date": 1785077951836,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 272583633.08
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1107967382.38
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 3933154.04
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 17832583.340000007
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 569572934.24
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1070363385.5399998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "e8b380c97debf11a4a35306f669cf3e456ccd616",
          "message": "Report default-route domain, not a VPN's (v0.6.11) (#176)\n\nUnder systemd-resolved /etc/resolv.conf is the stub file whose search\nlist is the merged set of every link's domains, so the Domain field --\nwhich took its first entry -- showed a split-tunnel VPN's domain\n(netbird.cloud) instead of the default route's (lan). It never\nconsidered interfaces at all.\n\nResolve the IP default-route interface from /proc/net/route and report\nthat link's own domain from resolvectl status. Keyed on the routing\ntable, not resolvectl's per-link 'Default Route:' flag, which is a DNS\nrouting flag and was yes for both links. When resolved manages the\ndefault link but it has no domain, report nothing rather than falling\nback to the merged list (which would resurrect the VPN domain); an\nunmanaged link still falls back, so static-resolv.conf hosts are\nunchanged. A full-tunnel VPN that is the default route reports its own\ndomain, as intended.\n\nFix two latent bugs in the same parser: all '~'-prefixed routing-only\ndomains are excluded (not just the exact catch-all '~.'), and wrapped\ncontinuation lines are no longer silently dropped.\n\nresolvectl is now needed by --long, so one OnceLock-cached invocation\nis shared with --full's domain-search rather than spawning twice.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T08:39:18-07:00",
          "tree_id": "8e30bf9598c906aed347fbd5c1c2ab33160360b0",
          "url": "https://github.com/l1a/retch/commit/e8b380c97debf11a4a35306f669cf3e456ccd616"
        },
        "date": 1785080409070,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 260830803.78
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1065451739.8800001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 3343824.8600000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 14883890.059999999
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 444064405.58
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1075426920.2799997
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "86f5803462d1608de8b7739c8dc6c69bc9c85a46",
          "message": "Give Domain Search one shape per source (v0.6.12) (#177)\n\nCI dry-run output showed 'eth0: <domain>' on Ubuntu but a bare\n'<domain>' on Fedora. The difference is not platform-driven: the same\nOS flips format between jobs. Ubuntu in the build matrix runs on a bare\nrunner and takes the resolvectl path; Ubuntu in full-test runs in a\ncontainer with no systemd-resolved and falls back to resolv.conf.\nFedora is always containerised, so it only looked different from\nUbuntu.\n\nGrouping differed too: the resolvectl path returns one entry per\ninterface with domains joined, while the fallback returned one entry\nper domain and the display prints one line per entry, so 'search a b c'\nemitted three separate bare lines.\n\nRender the fallback in the same '<scope>: a, b' shape, scoped 'global'\n-- labelled honestly rather than attributed to an interface, since\nresolv.conf's search list carries no attribution. The parser stays\nfaithful to the file; the shape is imposed at the detect layer. macOS\nroutes through the same formatter. The resolvectl path is unchanged.\n\nWindows is deliberately not fixed here and is documented in NOTES 6a:\nits Domain reads the AD/primary suffix rather than the connection\nsuffix, and Domain Search has no Windows arm at all. Both need\nGetAdaptersAddresses and cannot be verified live without a Windows box.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T19:35:39-07:00",
          "tree_id": "b11c193d8bdb824b38e28d4104d2b63b410c8fea",
          "url": "https://github.com/l1a/retch/commit/86f5803462d1608de8b7739c8dc6c69bc9c85a46"
        },
        "date": 1785119784503,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 227932364.0600001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1031565969.8600001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2470111.1
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 9693631.6
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 371226135.28000003
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1029781087.3800002
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "3738fdb3ff66b18fc121092f4f086ea51ac0dc30",
          "message": "Fix release tooling: publish-check and nix hashes (v0.6.13) (#178)\n\npublish-check failed on every release: the retch-cli dry run cannot\nresolve its '=0.1.x' retch-sysinfo pin until sysinfo is actually on the\nindex, and a dry run never uploads. It now checks the sparse index via\na new crates_io_has_version.py helper and skips that leg with an\nexplanation instead of dying on 'failed to select a version'. Both\npublish recipes also skip retch-sysinfo when its version is already\npublished, which is the normal state for a CLI-only release.\n\ncalculate_nix_hashes.py was silently emitting a wrong cargoHash. Its\nsubstitutions matched only 'lib.fakeHash', so once package.nix held\nreal values they became no-ops, the temp build kept the previous\nrelease's hashes, it failed on a source-hash mismatch rather than the\nintended cargoHash mismatch, and the lenient parser returned that stale\nsource hash. That is why the published v0.6.12 cargoHash equals\nv0.6.8's hash. Patterns now match a literal hash too, are line-anchored,\nand hard-error when they match nothing; the parser only accepts a hash\nreported against our own dummy.\n\nRefresh the in-repo packaging reference copies to the released v0.6.12.\npackage.nix keeps the genuine src hash but resets cargoHash to\nlib.fakeHash rather than carrying the corrupt value -- recompute with\n'just nix-update' on a machine with Nix.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-07-26T20:14:41-07:00",
          "tree_id": "195de4a24b9c74a5d3bbc3288e0a4ce21ab48a89",
          "url": "https://github.com/l1a/retch/commit/3738fdb3ff66b18fc121092f4f086ea51ac0dc30"
        },
        "date": 1785122124729,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 229571696.69999996
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1032818655.5000002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2508335.9800000004
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 10155962.48
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 381965823.82
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1032934008.8200003
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "1177d194785c63e2058a99f5cffa5ef33577d9cb",
          "message": "ci: disable Claude Code Review workflow (#187)\n\nThe claude-review job no longer runs on pull requests: the\n`pull_request` trigger is replaced with `workflow_dispatch` and the\njob carries `if: false`, so it is off by default but can still be\ninvoked manually if wanted.\n\nBumps retch-cli 0.6.16 -> 0.6.17 (patch), refreshes Cargo.lock,\nregenerates docs/retch.1 for the new version footer, and updates the\nNOTES.md Current State header and release log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T08:18:19-07:00",
          "tree_id": "5edf46dce11e5ab7293d0a0411af8f9341a70b2b",
          "url": "https://github.com/l1a/retch/commit/1177d194785c63e2058a99f5cffa5ef33577d9cb"
        },
        "date": 1786461547646,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 269454409.8400001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1028156215.2400001
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 3463308.16
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 5341699.260000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 397975772.8
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1038063814.1
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "1d0dc367f9ad44e2a04cc045891998fa9d9b1aae",
          "message": "fix: unprivileged Packages, sudo Rio, logo aspect (#189)\n\nThree defects found by diffing `sudo retch --full` against a plain run.\n\nPackages appeared only under sudo. The RPM SQLite database was opened\nread-write; it is root-owned inside a root-owned directory, so SQLite\ncould not create its journal sidecars and every *query* failed with\n\"attempt to write a readonly database\" — not the open(), which is why\nthe existing warning never fired and the field vanished silently. Now\nopened read-only over a `file:...?immutable=1` URI, and the query error\nis reported instead of swallowed.\n\nRio lost all graphics support under sudo: it was identified only by\nTERM_PROGRAM, which env_reset drops. `is_rio_terminal` now also accepts\nTERM=rio/xterm-rio, which sudo preserves.\n\nThe Kitty logo was stretched ~3x vertically. `c=26,r=10` was hardcoded\nand Kitty forces an image into that rectangle, while display.rs assumed\na fixed 40-column width and derived the row count a third way. A single\npure `fit_logo_cells` now feeds all three protocol emitters and\nplan_layout. Passing both correct values still left a 9% stretch from\ncell quantisation, so the Kitty spec carries only the limiting dimension\nand lets Kitty derive the other — measured 0.0% aspect error in a PTY.\n\nThe chafa box widens 28 -> 45 columns (row cap unchanged at 10) so wide\nlockup assets stay legible: the Fedora logo goes from 4 rows to 7. The\nside-by-side threshold is unaffected (45 + 45 <= 95), pinned by a test.\n\nAlso fixes a test-isolation defect the change exposed: once\nsupports_iterm2 read TERM, the host's TERM leaked into a test that\nguarded only TERM_PROGRAM, failing on a Rio box and passing on CI.\n\nDocuments the privilege trade-off in both directions (root-only\nphys-mem and btrfs snapshot counts; user-only editor/desktop/wm) in a\nnew NOTES section, README, and a man-page PRIVILEGES section.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T17:52:19-07:00",
          "tree_id": "9996d32ff3728e9292ad474ad37e12907763f637",
          "url": "https://github.com/l1a/retch/commit/1d0dc367f9ad44e2a04cc045891998fa9d9b1aae"
        },
        "date": 1786496001983,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 347208992.88000005
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1128798832.78
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 11915922.860000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 63381244.060000025
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 463708425.48
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1103047990.28
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "9d27af8746fe0e349822f3272031e94e03589b50",
          "message": "chore: bump 3 deps (consolidated Dependabot #188) (#190)\n\nRolls Dependabot #188 onto a gated branch so the release hygiene it\nbypasses — version bump, NOTES entry, man regen — is actually done,\nfollowing the #167/v0.6.3 and #184/v0.6.16 pattern.\n\nAll patch-level and lockfile-only; every spec is a caret range, so both\nCargo.toml manifests are untouched:\n\n  clap           4.6.5 -> 4.6.6  (pulls clap_builder 4.6.5 -> 4.6.6)\n  clap_complete  4.6.8 -> 4.6.9\n  rusqlite       0.40.1 -> 0.40.2 (pulls libsqlite3-sys 0.38.1 -> 0.38.2)\n\nThe lockfile was diff-verified byte-identical to Dependabot's before the\nversion bump, so this carries exactly the change its green CI validated;\nafterwards the only divergence is retch-cli's own version line.\n\nrusqlite warranted a live check rather than just a green suite: it is a\ndirect dependency of retch-sysinfo and the crate v0.6.18's Packages fix\nhad just started using differently, and libsqlite3-sys bundles SQLite\nitself, so a bump changes the engine that has to honour `immutable=1`.\nThe rpm_db_uri unit tests only assert string construction and could not\ncatch a behavioural change there. Verified live as an unprivileged user:\nPackages: 2509, unchanged.\n\nretch-cli -> 0.6.19; retch-sysinfo unchanged at 0.1.53 (no source\nchange, only its transitive lockfile deps moved).\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T18:52:53-07:00",
          "tree_id": "0f8eb7815bf12c631f95919caaeb1e89e3549096",
          "url": "https://github.com/l1a/retch/commit/9d27af8746fe0e349822f3272031e94e03589b50"
        },
        "date": 1786499633153,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 347653832.4
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1112967299.7
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 12245284.780000001
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 58219257.48
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 552537944.2800001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1109482587.38
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "120ed8e2e0fe45a624212a8204ae34b082b8c360",
          "message": "Add keyboard, mouse and tpm fields (#195)\n\n* Add keyboard, mouse and tpm fields\n\nThree NOTES.md section 6 fastfetch-gap fields, all --long and above,\nLinux-only, in the v0.5.0 shape: thin /proc and sysfs readers over pure\nhelpers that unit-test without touching host hardware.\n\nInput classification is exclusive and declines to guess. On a Logitech\nUnifying/Bolt receiver no kernel-visible signal separates a keyboard from\na mouse: handlers, capabilities/rel (0x1943 on both), the alphabet key\nblock, INPUT_PROP, udev ID_INPUT_* (POINTINGSTICK on both), USB HID\nbInterfaceProtocol and the HID report descriptor itself are all identical\nfor an MX Keys and an MX Master 3. fastfetch 2.66 gets this wrong in both\ndirections on that hardware. Ambiguous devices are resolved via the HID++\ndriver's battery model_name and, failing that, reported in neither field\nrather than asserted into the wrong one.\n\ntpm reads tpm_version_major and maps it to the published spec names\n(1 -> 1.2, 2 -> 2.0), returning None for anything unrecognised.\n\nAlso refresh packaging/aur/PKGBUILD, stranded at 0.6.12 for eleven\nreleases while the AUR moved to 0.6.23, and drop its man-page\nregeneration: the font-strip sed never matched on any platform (GNU sed\nreads \\\\f as a form feed) and $DATE/$pkgver were literal inside double\nquotes, so the installed footer read \"retch $pkgver\". The committed\ndocs/retch.1 ships in the tarball with the correct footer, so package()\ninstalls it directly and the mandown makedepend is gone.\n\nStrata golden counts move Long 49->52, Full 55->58. 11 new unit tests.\nVerified live on corrino (Fedora 44, i7-1360P).\n\nAssisted-By: Claude Opus 5\n\n* Close two holes in the aur CI job\n\nThe job rewrote source= and sha256sums= to build from local sources, so the\ndeclared checksum was never checked by anything — a stale one (as this\nPKGBUILD carried for eleven releases) stayed green and would only fail for\nsomeone installing from the AUR. Verify it against the real tag tarball\nbefore that patching, refusing a committed SKIP and skipping cleanly when the\ntag is not published yet.\n\nNothing inspected the packaged man page either, which is where both defects\nthis branch fixes actually showed. Assert the built package's .TH line carries\nno literal $ and a real retch <version> footer, and that no doubled font runs\nsurvive.\n\nAlso stop pre-installing mandown, so makedepends is load-bearing: makepkg -s\ninstalls what the PKGBUILD declares and nothing else.\n\nAssisted-By: Claude Opus 5\n\n* Fix the man-page check failing on a correct package\n\nThe new verification step used `bsdtar -tf \"$pkg\" | grep -qx …` under\n`set -o pipefail`. grep -q exits on its first match, bsdtar takes SIGPIPE and\nexits 141, and pipefail turns that into a failed pipeline — so the step\nreported the man page missing exactly when it was present, and CI went red on\na package that was correct. head -1 and grep -m1 carry the same hazard.\n\nMaterialise the listing and the page to files and grep those; select the\npackage with find -print -quit. Verified against a good package and against\npurpose-built broken ones (missing page, literal $ footer, doubled font runs).\n\nAssisted-By: Claude Opus 5\n\n* Match the gzipped man page makepkg actually ships\n\nmakepkg's zipman option is on by default, so the packaged path is\nusr/share/man/man1/retch.1.gz. The verification step looked for retch.1 and\nreported it missing — the check wrong again, the package correct again.\n\nMatch retch.1 with an optional .gz/.zst/.xz/.bz2 suffix and decompress before\ninspecting. Tested against gzipped, uncompressed, and gzipped-but-broken\npackages.\n\nThe diagnostic added in the previous commit is what made this cheap: printing\nthe real usr/share listing on failure named retch.1.gz directly in the CI log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T09:49:12-07:00",
          "tree_id": "274aff11102cf1108fb49cbe2f4d8beedda7b477",
          "url": "https://github.com/l1a/retch/commit/120ed8e2e0fe45a624212a8204ae34b082b8c360"
        },
        "date": 1786726205914,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 324879545.62
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1110595653.0199997
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 9030561.379999999
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 36850967.980000004
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 433272000.08
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1091574375.78
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "0fb38978e0182c24717fea4d8b4a80047b15d233",
          "message": "Make packaging/aur the source, not a stale copy (#196)\n\npackaging/aur/PKGBUILD was a reference copy that nothing rendered, published or\nchecked. It reached eleven releases of lag (0.6.12 in-repo against 0.6.23\npublished), and because the copy was inert the live AUR PKGBUILD kept two\nman-page defects long after they were fixed here — Arch installs got a page\nfooted $DATE / retch $pkgver the whole time.\n\npackaging/aur is now the source. aur-bump renders it from a released tag,\naur-publish pushes exactly those files, and .SRCINFO is tracked and generated\nby a real makepkg --printsrcinfo in a container (no host here runs Arch).\nCarried over from rusticprofile: write to a temp file and move it into place so\na failure cannot truncate the committed file, check the output content rather\nthan the exit code, and mount :z never :Z.\n\nscripts/aur_check.py is the anti-drift guard and just check depends on it. It\ncompares the pair field-by-field including the expanded source URL, so it\ncatches a pair that agrees on the version and disagrees on the checksum — the\nshape that breaks on the user's machine and nowhere else. Pure Python, so it\nruns on Windows; parses rather than sourcing the PKGBUILD, and raises rather\nthan expanding unknown variables to empty.\n\nVerified end to end: the generated .SRCINFO came out byte-identical to the one\nhand-written and pushed to the AUR earlier today, and AUR_CONFIRM=n\njust aur-publish exercised every preflight check without publishing.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T10:43:28-07:00",
          "tree_id": "0dcac6b08b8ab4bb34654fbcf6096f083db1f748",
          "url": "https://github.com/l1a/retch/commit/0fb38978e0182c24717fea4d8b4a80047b15d233"
        },
        "date": 1786729459274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 328808873.58
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1088784448.48
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7930174.42
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 29017863.120000005
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 431095874.3000001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1088254415.4000003
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "9b8bcc71daafe3d38abb8ba9085195eef680d68f",
          "message": "Native Media and Player Detection (#197)\n\n* Add native media and player detection fields\n\nImplement 100% native FFI / direct socket media and player detection with zero subprocess forks across Windows (WinRT COM GlobalSystemMediaTransportControlsSessionManager via combase.dll), Linux (direct Unix domain socket D-Bus MPRIS client), and macOS (Objective-C runtime SBApplication FFI).\n\nAdds 'player' and 'media' to FIELDS registry (Mode::Long, available in --long and --full). Strata golden counts Long 52 -> 54, Full 58 -> 60. Regenerated man page, updated README.md, docs/retch.1.md, NOTES.md, WIP.md, and GitHub wiki.\n\nAssisted-By: Gemini 2.5 Flash\n\n* Fix Rust 1.97 Clippy lints in media.rs\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:19:02-07:00",
          "tree_id": "5f6c7da98e5d1a0862003b59cc74c4130d097866",
          "url": "https://github.com/l1a/retch/commit/9b8bcc71daafe3d38abb8ba9085195eef680d68f"
        },
        "date": 1786933204855,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 348337582.96
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1105057660.06
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 17668657.240000002
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 57051718.84
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 510192921.8600001
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1103946815.86
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "ed45ec18928bf19b4add811c3f8a567211932073",
          "message": "Add README and crate metadata for retch-sysinfo (#198)\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:39:49-07:00",
          "tree_id": "13cd0a580de7afdb2209726aa2a026b4079579a6",
          "url": "https://github.com/l1a/retch/commit/ed45ec18928bf19b4add811c3f8a567211932073"
        },
        "date": 1786934452411,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 390847634.9000001
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1106979075.9
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 15588792.4
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 57903073.60000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 523294015.90000015
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1115413571.6
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "2b80c74b321872317f495009db27eddb70dcfe58",
          "message": "Add Desktop & UI detection probes (#201)\n\n* Add Desktop & UI detection probes\n\nImplement zero-subprocess desktop and UI detection probes:\n- WM Theme (wm-theme): KWin, Xfwm4, Openbox, Fluxbox, IceWM, GTK, Aqua, Windows.\n- Wallpaper (wallpaper): GNOME, KDE Plasma, XFCE, Hyprpaper, Sway, Feh, Nitrogen, macOS AppKit FFI, Windows registry FFI.\n- Terminal Theme (terminal-theme): Kitty, Alacritty, WezTerm, Foot, Windows Terminal, Konsole, Ptyxis, iTerm2, Apple Terminal.\n- Register fields under FIELDS (Mode::Full), update man page, README, NOTES, and wiki.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix cross-platform parser visibility on macOS/Win\n\nEnsure pure theme and terminal parser functions are available across all\ntarget platforms without cfg gating or dead-code warnings.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Make parse_ini_key available across all targets\n\nRemove target_os = \"linux\" gate from parse_ini_key so unit tests pass\non macOS and Windows.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Make all pure terminal parsers available on Win\n\nRemove target_os cfgs from parse_kitty_theme and other terminal parsers\nso they are unconditionally available on Windows.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix macOS wallpaper Obj-C FFI ABI & AppKit link\n\nAdd AppKit framework link in build.rs and use non-variadic objc_msgSend\ndeclaration (objc_msgSend_id_id) for desktopImageURLForScreen to prevent\nABI misalignments on aarch64 Apple Darwin.\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-08-21T22:41:46-07:00",
          "tree_id": "a4206d6e867d2fd2e324cf08f590848666fb1316",
          "url": "https://github.com/l1a/retch/commit/2b80c74b321872317f495009db27eddb70dcfe58"
        },
        "date": 1787377361624,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 336201050.2
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1109677158.1999998
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 10124612.259999998
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 32422488.760000005
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 472058711.36
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1116144080.16
          }
        ]
      }
    ],
    "Local - macOS arm64 (real hardware)": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781124714515,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 665707210.86
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1053358752.6599998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "c4633dd7ab0a57810eef8b0f53a397a0286b9452",
          "message": "refactor(macos): replace all system_profiler spawns with native FFI (v0.3.16) (#87)\n\n* refactor(macos): replace all system_profiler spawns with native FFI (v0.3.16)\n\nAdd macos_ffi.rs with safe wrappers for CoreFoundation, IOKit, CoreAudio,\nand CoreGraphics. Zero system_profiler spawns on macOS:\n\n- bios: IODeviceTree:/rom firmware version via IOKit\n- audio: CoreAudio AudioObjectGetPropertyData device enumeration\n- display: CoreGraphics CGGetActiveDisplayList + IODisplayConnect names\n- gpu: IOKit AGXAccelerator (Apple Silicon) + IOPCIDevice class 0x03\n- camera: IOKit USB bInterfaceClass=0x0E (UVC) enumeration\n- gamepad: IOKit HID usage page 0x01 / usages 0x04+0x05\n- bluetooth: IOBluetoothHCIController power state + chipset\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: cargo fmt\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: wrap enumerate_hid_usage call in unsafe block\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: remove unused CFArray and kCFBooleanTrue declarations\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(macos): add build.rs to propagate framework link directives\n\n#[link(kind = \"framework\")] in lib crates does not reliably propagate\nto the final binary link step. Emit cargo:rustc-link-lib directives\nfrom build.rs instead.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(macos): replace IOMainPortDefault extern static with literal 0\n\nIOMainPortDefault was introduced as an exported symbol in macOS 12.0.\nThe CI SDK targets macOS 11.0 where it does not exist, causing a link\nerror. Both kIOMasterPortDefault and IOMainPortDefault are always 0, so\nuse a Rust constant instead of the extern static.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-12T10:10:04-07:00",
          "tree_id": "303651b63023cd37e41aceaa61bc2ce4c9861863",
          "url": "https://github.com/l1a/retch/commit/c4633dd7ab0a57810eef8b0f53a397a0286b9452"
        },
        "date": 1781297455720,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 243726771.72
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1044398896.52
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "0dd36c88f3f5ce4cd505560dd50c5984df3b8c8a",
          "message": "Merge pull request #90 from l1a/refactor/macos-wifi-link-rate\n\nfeat(macos): restore WiFi link rate via IO80211Interface IOKit FFI",
          "timestamp": "2026-06-13T21:43:02-07:00",
          "tree_id": "cb50b922e531657719d8dc14524d9beb88cce88b",
          "url": "https://github.com/l1a/retch/commit/0dd36c88f3f5ce4cd505560dd50c5984df3b8c8a"
        },
        "date": 1781412209994,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 241809182.4
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1040176403.3999999
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "28dafa442e4064a005d0514f37eeb23e613b0c85",
          "message": "docs: clarify Wi-Fi link rate availability by platform\n\nmacOS exposes only TX rate (CWInterface.transmitRate); no RX rate exists\nin any public CoreWLAN or IOKit API. Linux has both via iw.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-14T14:15:08-07:00",
          "tree_id": "39c8b6d1fea217d7989fb5dffdae13cdbe80b49b",
          "url": "https://github.com/l1a/retch/commit/28dafa442e4064a005d0514f37eeb23e613b0c85"
        },
        "date": 1781474122294,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 235064190.88000003
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1046872849.0800002
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "0d3d05ae1d6616853d4a694d4c9e62ad13763471",
          "message": "fix(bench): cfg-gate detect_cpu_freq_range import for Linux only\n\nThe bench function was already #[cfg(target_os = \"linux\")] but the\nimport wasn't, producing an unused-import warning on macOS/Windows.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-24T10:05:24-07:00",
          "tree_id": "6490d1606ef0649efdedfb16007397593452f3a4",
          "url": "https://github.com/l1a/retch/commit/0d3d05ae1d6616853d4a694d4c9e62ad13763471"
        },
        "date": 1782321096821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 644014766.9200002
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1053000991.62
          }
        ]
      }
    ],
    "Local - Windows x64 (real hardware)": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab",
          "message": "Drop PowerShell spawn in Windows net detection (#144)\n\ndetect_active_interface_and_local_ip shelled out to PowerShell\n(Get-NetRoute) on Windows to name the default-route interface. That\nspawn costs ~977ms (PowerShell startup) and, since the `net` field is in\nevery mode, dominated runtime â€” `retch --short` was ~1.15s, ~11x over\nits <100ms target and ~20x slower than fastfetch.\n\nDerive the active interface instead from the adapter whose\nsysinfo-reported IPs include the outbound local_ip (already resolved via\nthe UDP-connect trick) â€” no spawn, no new dependency, no FFI. Extracted\na pure match_active_interface helper with a unit test. Resolves to the\nsame interface as before (verified on Windows).\n\nMeasured (AMD Ryzen AI MAX+ 395, Win 11): --short 1149ms -> 163ms (~7x).\nretch-sysinfo bumped 0.1.33 -> 0.1.34 (library behavior change).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:42:31-07:00",
          "tree_id": "e39a81d2e6892fa08bbcacc34138d13dd5af8989",
          "url": "https://github.com/l1a/retch/commit/cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab"
        },
        "date": 1783742484955,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 1884571820.0000002
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1438535140.0000005
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 155851624.00000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 58640134
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 3387447272
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1325977722
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "744c0dcd3c15ea67803948e0372c5229715b4783",
          "message": "Fix upload_local_bench.py cp1252 crash on Windows (#152)\n\njust bench-upload and the post-merge hook crashed on Windows with\nUnicodeDecodeError: 'charmap' codec can't decode byte 0x9d — so no local\nWindows \"real hardware\" numbers reached the gh-pages benchmark dashboard.\nThe gh-pages data.js is UTF-8 (commit messages embed arrow/em-dash chars)\nbut open() used the default cp1252 encoding on Windows.\n\nPin encoding=\"utf-8\" on every file operation (data.js read + write, the\nhyperfine JSON temp read) and on run_capture's subprocess text decoding\n(git log --format=%B), plus a sys.stdout.reconfigure UTF-8 guard. Same fix\nclass as scripts/update_wip.py (#142).\n\nVerified: the crash reproduces on the live data.js under the default\nencoding; the UTF-8 read succeeds (845 KB) and append_entry /\ngit_commit_info run without error.\n\nTooling-only; no Rust source touched, retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:01:43-07:00",
          "tree_id": "d579527f5693db2e5215b8c7e6ddfa52671a60fd",
          "url": "https://github.com/l1a/retch/commit/744c0dcd3c15ea67803948e0372c5229715b4783"
        },
        "date": 1783865013646,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 345949690.00000006
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1641306060.0000002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 227038790.00000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 83981210
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 2088187864
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1539821654
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "6c384b96645a8d096e3c0f7a55be58958363939a",
          "message": "Bump version to 0.4.0 (milestone release) (#153)\n\nMinor version bump (0.3.52 -> 0.4.0) marking the completed Windows\nnative-FFI migration and the first GitHub Release since v0.3.40 (rolls up\n#141-#152). Version-marker only — no code change; retch-sysinfo stays at\n0.1.40 and crates.io remains intentionally held.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:46:27-07:00",
          "tree_id": "53e438ffe42566998097d0bc24ec6bd506b380bf",
          "url": "https://github.com/l1a/retch/commit/6c384b96645a8d096e3c0f7a55be58958363939a"
        },
        "date": 1783867685603,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 340025166.00000006
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1495054125.9999998
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 232378912
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 90149902.00000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1976016372.0000002
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1434365552.0000002
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "88162b293638dfad573a4b63f046cd27aca023f4",
          "message": "Bump to 0.4.1; fix license SPDX for crates.io (#154)\n\nCorrect the deprecated `license = \"GPL-3.0\"` to `GPL-3.0-or-later` in both\ncrate manifests (matching the SPDX-License-Identifier headers in the\nsource) ahead of publishing to crates.io, where per-version license\nmetadata is permanent.\n\nBump retch-cli 0.4.0 -> 0.4.1 and retch-sysinfo 0.1.40 -> 0.1.41 (v0.4.0\nis already tagged, so the license fix requires a new version). No\nfunctional code change. This is the version published to crates.io,\nreversing the prior GitHub-Release-only hold.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T08:27:56-07:00",
          "tree_id": "20fc220a727f5d7f59bb468da3002cf8631afc81",
          "url": "https://github.com/l1a/retch/commit/88162b293638dfad573a4b63f046cd27aca023f4"
        },
        "date": 1783870170992,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 297139526
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1364860746.0000002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 191827838.00000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 83824578
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1565742395.9999998
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1677886116.0000002
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "c4f762eed77a36ac3d95a1beb6a4cab62afb2965",
          "message": "Add Windows domain and terminal-size fields (#159)\n\nTwo --long fields that previously returned None on Windows now have\nnative arms — the first of the Windows cross-platform-parity feature\nseries (distinct from the completed PowerShell->FFI perf migration).\n\n- domain: primary DNS suffix via GetComputerNameExW(ComputerNameDnsDomain)\n  (kernel32, two-call size probe). A workgroup host's empty suffix maps to\n  None via the pure clean_domain helper — not the NetBIOS WORKGROUP name —\n  matching the Linux/macOS /etc/resolv.conf DNS-domain semantics.\n- terminal-size: console viewport via GetStdHandle + GetConsoleScreenBufferInfo,\n  using the srWindow rect (not dwSize, the scrollback buffer). Pure\n  window_rect_to_size helper does the inclusive-rect -> \"COLSxROWS\" math;\n  piped output has no console -> graceful None -> existing env fallback.\n\nHand-written extern \"system\" FFI, no binding crate (house style); // SAFETY:\non every unsafe. Non-Windows arms untouched. New tests: clean_domain,\nwindow_rect_to_size, and a CONSOLE_SCREEN_BUFFER_INFO size_of layout guard.\nVerified live on arrakis (Windows 11): domain correctly absent (DNS suffix\ngenuinely empty), terminal-size renders 100x40.\n\nretch-cli 0.5.1 -> 0.6.0, retch-sysinfo 0.1.43 -> 0.1.44.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:13:18-07:00",
          "tree_id": "89121134b1cdf90e97f3ba23b740bd744dbf5193",
          "url": "https://github.com/l1a/retch/commit/c4f762eed77a36ac3d95a1beb6a4cab62afb2965"
        },
        "date": 1783977288180,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 269332355.99999994
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1344338696
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 165875626
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 77074896
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1471333798.0000002
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1793268197.9999998
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "30195b0eaaf4f96b4b6fe43c11001046a871537b",
          "message": "Fix Windows Camera (scanners) and Users (=0) bugs (#160)\n\nTwo user-reported Windows output bugs in the cross-platform-parity series.\n\nCamera listed scanners as cameras (e.g. \"EPSON ET-3850 Series\"). The Windows\npath enumerated the Camera + Image (WIA) setup classes, but scanners/printers\nshare the Image class with some real webcams (a Logitech BRIO is Image-class),\nand is_real_camera has no keyword to catch an EPSON model string. Fixed by\nenumerating the KSCATEGORY_VIDEO_CAMERA device-interface class instead — only\nreal cameras register it, so scanners are excluded while Image-class webcams are\nkept. Added win_setupapi::present_interface_device_names (DIGCF_DEVICEINTERFACE,\nsharing the existing enumerate_names core) + the KSCATEGORY_VIDEO_CAMERA GUID;\nremoved the now-unused GUID_DEVCLASS_CAMERA/_IMAGE. Also drops the synthetic\n\"Windows Virtual Camera Device\" via a Windows-only is_windows_virtual_camera\nhelper (Linux/macOS untouched).\n\nUsers showed 0 with a user logged in: sysinfo keys Windows users by SID, so the\nUnix uid>=1000 filter never matched. New win_users module counts active\ninteractive sessions via WTSEnumerateSessionsW + WTSQuerySessionInformationW\n(wtsapi32; query-user semantics), with a pure unit-tested count helper. Per the\n\"if it doesn't work, don't show it\" request, display.rs now suppresses Users\nwhen the count is 0 (mirrors the packages guard).\n\nNon-Windows camera/users behavior unchanged. FFI house style (hand-written\nextern \"system\", // SAFETY:, WTS_SESSION_INFOW size_of guard). Verified live on\narrakis: Camera = Logitech BRIO + ASUS FHD webcam only; Users: 1.\n\nretch-cli 0.6.0 -> 0.6.1, retch-sysinfo 0.1.44 -> 0.1.45. Patch (bugfixes).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:46:19-07:00",
          "tree_id": "13dc79f2b8c9dd3041dc8f5dfc070fb42bba266a",
          "url": "https://github.com/l1a/retch/commit/30195b0eaaf4f96b4b6fe43c11001046a871537b"
        },
        "date": 1783979263063,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 270301229.99999994
          },
          {
            "name": "CLI execution - fastfetch",
            "unit": "ns",
            "value": 1347412970.0000002
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 166242362.00000003
          },
          {
            "name": "CLI execution - fastfetch -c none",
            "unit": "ns",
            "value": 82178472.00000001
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 1460869406
          },
          {
            "name": "CLI execution - fastfetch -c all",
            "unit": "ns",
            "value": 1339984466
          }
        ]
      }
    ],
    "Linux x64 Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2",
          "message": "Fix update_wip.py stale-pointer regex + UTF-8 (#142)\n\nThe post-merge WIP updater matched an obsolete \"**Latest commit on\nmain**:\" line that no longer exists, so the substitution silently\nno-op'd and left \"**main HEAD**:\" stale after every `just merge-pr`\n(seen live after #141). Retarget the regex to \"**main HEAD**:\", rewrite\nin the current format (`<hash>` â€” <subject> â€” **v<version>**) with the\nversion read from Cargo.toml, using a function replacement so metachars\nin the subject are literal.\n\nSince the fix now writes the commit subject into WIP.md, and this repo's\nsubjects contain \"â†’\"/em-dashes, pin UTF-8 on read_text/write_text,\nsubprocess decoding, and stdout â€” otherwise cp1252 (the default Windows\nconsole/locale where merge-pr runs) crashes the script. Verified\nend-to-end against a subject containing \"â†’\".\n\nAlso gitignore __pycache__/*.pyc.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:31:45-07:00",
          "tree_id": "2db4346561186354ab7202a4b36fa637426c79f1",
          "url": "https://github.com/l1a/retch/commit/fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2"
        },
        "date": 1783733961514,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 922828563,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2126.4230123179486,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.23738610140528,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.801413024143921,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.999169647475505,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18233.117499526223,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189622.17363638623,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12870.133524740568,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13032.138172785637,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1619244.8662918543,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 375.53410614582606,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 296.87139021769747,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9f639d38da27f892e183f9fa1e0f77d57cdfdcad",
          "message": "update_wip.py: bound subs with count=1 (#143)\n\nFollow-up to #142. The retargeted `**main HEAD**:` regex had no count,\nso it rewrote every line containing the header string â€” and WIP.md's\nopen-task prose mentions it verbatim, so the #142 merge clobbered those\ntask lines. Pass count=1 to both re.sub calls (Active-Branch and\nmain-HEAD) so only the first top-of-file header occurrence is rewritten.\nVerified end-to-end against a sample with the header in both a header\nline and later prose.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:05:40-07:00",
          "tree_id": "e1d68a1f542a32e88f5f5adaece7b1b06c929de4",
          "url": "https://github.com/l1a/retch/commit/9f639d38da27f892e183f9fa1e0f77d57cdfdcad"
        },
        "date": 1783739588873,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 943814067.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2123.345982472543,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.78145554073482,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8566117950008785,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.05033377048411,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18350.078684019485,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189882.49709230225,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12897.448208372713,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13043.34809954442,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1647290.5518859972,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 363.44774934875704,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 289.53194624937584,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab",
          "message": "Drop PowerShell spawn in Windows net detection (#144)\n\ndetect_active_interface_and_local_ip shelled out to PowerShell\n(Get-NetRoute) on Windows to name the default-route interface. That\nspawn costs ~977ms (PowerShell startup) and, since the `net` field is in\nevery mode, dominated runtime â€” `retch --short` was ~1.15s, ~11x over\nits <100ms target and ~20x slower than fastfetch.\n\nDerive the active interface instead from the adapter whose\nsysinfo-reported IPs include the outbound local_ip (already resolved via\nthe UDP-connect trick) â€” no spawn, no new dependency, no FFI. Extracted\na pure match_active_interface helper with a unit test. Resolves to the\nsame interface as before (verified on Windows).\n\nMeasured (AMD Ryzen AI MAX+ 395, Win 11): --short 1149ms -> 163ms (~7x).\nretch-sysinfo bumped 0.1.33 -> 0.1.34 (library behavior change).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:42:31-07:00",
          "tree_id": "e39a81d2e6892fa08bbcacc34138d13dd5af8989",
          "url": "https://github.com/l1a/retch/commit/cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab"
        },
        "date": 1783741795132,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1039386610.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2284.226135816155,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.963159220069336,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.028744732801462,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.24439762208923,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21258.58099844316,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 211853.7206385492,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14909.05741503504,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 15024.425844711619,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1683049.6836058195,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 386.90527726569695,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.4614234363651,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "18f0bfa4e337d9a815662b1383dab85187e1ac5c",
          "message": "Fix bench-cli/bench-compare on Windows (#145)\n\nThe bench recipes passed a POSIX-style './target/release/retch' to\nhyperfine. With no --shell, hyperfine uses cmd.exe on Windows, which\ncan't execute that path (forward slashes, no .exe), so it exited 1 in\nthe first warmup run and aborted the recipe. retch itself was fine and\n`just bench` (criterion) was unaffected.\n\nAdd an os_family()-selected `retch_release_bin` variable\n('target\\release\\retch.exe' on Windows, './target/release/retch'\nelsewhere) and route all bench hyperfine calls through it. Verified both\nrecipes now run to completion on Windows.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T21:26:47-07:00",
          "tree_id": "b2195da8db613809ef3a732f524156e3dd175501",
          "url": "https://github.com/l1a/retch/commit/18f0bfa4e337d9a815662b1383dab85187e1ac5c"
        },
        "date": 1783744443389,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 949093571.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2220.081852758127,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.954317197274044,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.039883328706498,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.142829488299625,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21176.22431775332,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 204507.150833582,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14356.34915260162,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14545.33718901646,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1705330.5766744558,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 370.7197024173432,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.9765785256164,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c57409d318756bf9bf92ee798f438e2c2e4747fd",
          "message": "Use native Win32 IOCTLs for Windows phys-disk (#146)\n\nReplace the Get-PhysicalDisk PowerShell spawn (~1.7s of interpreter\nstartup) in retch-sysinfo's Windows physical-disk detection with direct\nstorage IOCTLs over \\.\\PhysicalDriveN, via hand-written extern \"system\"\nFFI matching the crate's existing style (win_reg.rs) — no new dependency.\n\nEach drive is opened with zero desired access and only FILE_ANY_ACCESS\nquery IOCTLs are used (IOCTL_STORAGE_QUERY_PROPERTY for model/bus type +\nseek penalty, IOCTL_DISK_GET_DRIVE_GEOMETRY_EX for size), so no elevation\nis required. Classification and label format are unchanged; the model\nstring reproduces Get-PhysicalDisk's FriendlyName. Verified byte-identical\noutput; --fields phys-disk ~1684ms -> ~210ms on an AMD Ryzen AI MAX+ 395.\n\nAlso fix a gate/CI blind spot found while verifying this: a bare\n`cargo test`/`cargo clippy` at the workspace root only covers retch-cli\nand silently skips the retch-sysinfo member (where this change lives).\nThe just recipes (test/lint/check + the pr steps) and both rust.yml CI\njobs now pass --workspace; AGENTS.md 4.0/4.1 document why.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T12:51:19-07:00",
          "tree_id": "02202ebbc2cd99020a9d56bc36db81f79b1aa906",
          "url": "https://github.com/l1a/retch/commit/c57409d318756bf9bf92ee798f438e2c2e4747fd"
        },
        "date": 1783799909192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 679877820,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2071.4247692252657,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.76545954637275,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8375887130864905,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.61406178171234,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18001.543270465383,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 187100.96468657898,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12660.145846943939,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12857.02583975172,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1626737.1910429897,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 366.9618662109152,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 291.35777748262393,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e7427ff1a1011473cda36ef463893d8a10dea342",
          "message": "Read SMBIOS natively for Windows phys-mem (#147)\n\n* Read SMBIOS natively for Windows phys-mem\n\nReplace the two Get-CimInstance Win32_PhysicalMemory / Win32_ComputerSystem\nPowerShell spawns (~600 ms) with GetSystemFirmwareTable('RSMB') (kernel32),\nparsing SMBIOS type-17 (Memory Device) structures directly, plus\nGlobalMemoryStatusEx as the VM total-memory fallback. Hand-written\nextern \"system\" FFI matching win_reg.rs — no new dependency.\n\nA pure parse_smbios_type17 fn does a bounds-checked walk of the structure\ntable (formatted area + double-null-terminated string set) and carries the\nunit tests. Now also surfaces the SMBIOS Configured Memory Speed field\n(offset 0x20), so Windows shows running-vs-rated speed when they differ\n(e.g. \"8x 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)\"), matching Linux; the\nold WMI path only reported the rated speed.\n\n--fields phys-mem ~597ms -> ~152ms on an AMD Ryzen AI MAX+ 395; output\nverified against Get-CimInstance Win32_PhysicalMemory.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix clippy byte-str lint on RSMB signature\n\nRust 1.97's clippy flags `[b'R', b'S', b'M', b'B']` (can be a byte str).\nUse `*b\"RSMB\"` instead. Local toolchain was 1.96 so `just check` passed\nlocally but CI (1.97) failed clippy; bumped local toolchain to match.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T13:32:19-07:00",
          "tree_id": "dde402b0cc3e8c191c71996d19858d5d403cf3b0",
          "url": "https://github.com/l1a/retch/commit/e7427ff1a1011473cda36ef463893d8a10dea342"
        },
        "date": 1783802417123,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 763829729.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2130.0892200317244,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.236300531033166,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8101944048529335,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.98775026193054,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18357.19818073215,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190593.91496269137,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12964.387167779376,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13122.479256338522,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1616635.5325549701,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 377.24667455050906,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 276.26768487310284,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36888f89870197b2e040c9178970859ffc467c42",
          "message": "Detect Windows bluetooth natively (bthprops) (#148)\n\nReplace the PowerShell spawn (Get-Service bthserv + two Get-PnpDevice\n-Class Bluetooth queries, ~1.8s) with native Win32:\n- power state from the bthserv service via the Service Control Manager\n  (advapi32),\n- adapter hardware name via SetupAPI enumeration of the Bluetooth device\n  class (links setupapi),\n- connected devices via the classic bthprops API (BluetoothFindFirstDevice\n  with fReturnConnected; links bthprops).\n\nHand-written extern \"system\" FFI, no WinRT and no binding crate. The\ndevice-info struct layout was validated at runtime before trusting the\ncount. A pure format_windows_bluetooth fn carries the unit tests.\n\nBehavior change: \"N connected\" now counts actually-connected devices\nrather than the old count of all paired/present Bluetooth PnP nodes (which\nthe old code mislabeled as connected). Adapter name unchanged. On an AMD\nRyzen AI MAX+ 395: --fields bluetooth ~1765ms -> ~150ms; --long 3462 ->\n2934ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:06:28-07:00",
          "tree_id": "ad23df51a0dfa2097d5eeb928be7307ad5c07e92",
          "url": "https://github.com/l1a/retch/commit/36888f89870197b2e040c9178970859ffc467c42"
        },
        "date": 1783811597700,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1129727173.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1744.3671018324735,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 49.59666489285202,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.982388863405036,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 50.35371829161565,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16394.323405143237,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 163632.85885449886,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11608.3917389308,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 11583.050186954126,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1326787.9707824772,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 281.4874040090344,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 225.96229062707386,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dfa18d3ba7b91698f61b34f76aaf85b3bd479271",
          "message": "Drop serial CPU-usage sleep on Windows (#149)\n\nCPU usage needs a delta between two samples. sysinfo enforces a ~200ms\nminimum interval, so collect() slept 200ms then refreshed — and that\nsleep ran serially AFTER the concurrent probe scope, adding ~200ms to\nevery standard/long run.\n\nOn Windows, sample GetSystemTimes (kernel32) just before the scope and\ndiff against a fresh sample at the usage-computation point: the existing\ncollection window is the delta, so no dedicated sleep is added. A ~100ms\nfloor is topped up only when the window is shorter (e.g. an isolated\n`--fields cpu-usage`) so a tiny request reads a real value instead of\nGetSystemTimes quantization noise. A pure usage_percent helper carries\nunit tests. Linux/macOS keep the sysinfo+sleep path (its min interval\nmakes the window-diff unreliable there).\n\nOn an AMD Ryzen AI MAX+ 395: standard mode 1757ms -> 1558ms; isolated\n--fields cpu-usage ~340ms -> ~253ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:26:38-07:00",
          "tree_id": "ff94a5086c547509df94d6fc37722dd5e6667f45",
          "url": "https://github.com/l1a/retch/commit/dfa18d3ba7b91698f61b34f76aaf85b3bd479271"
        },
        "date": 1783812833919,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 843686467.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2122.1120945435537,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.72087488465017,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.801534523937101,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.313460551870165,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18359.319307282727,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189026.03970012558,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12895.34289141744,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13175.267112027275,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1621038.7659511017,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 370.5441851487245,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 309.0338510066445,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cae94eb0c09e6b2f4675d84cbd239d3ed13b6926",
          "message": "Detect Windows camera natively (SetupAPI) (#150)\n\nReplace the camera PowerShell spawn (Get-PnpDevice -Class Camera,Image\n-PresentOnly, ~1.36s) with a new shared win_setupapi module that enumerates\npresent devices in a setup class via SetupDiGetClassDevsW +\nSetupDiGetDeviceRegistryPropertyW (links setupapi) — the native equivalent\nof Get-PnpDevice -PresentOnly. Camera enumerates the Camera and Image\nclasses and reuses the existing is_real_camera / clean_camera_name / dedup\nlogic. bluetooth (which introduced a private SetupAPI copy) is refactored\nonto the shared module, removing the duplication (mirrors win_reg.rs).\n\nHand-written extern \"system\" FFI, no binding crate. Verified against\nGet-PnpDevice (all real cameras; IR camera filtered as before); bluetooth\nadapter name unchanged after the refactor.\n\nCamera was the last standard-mode PowerShell pole, so this completes the\nWindows native-FFI migration: on an AMD Ryzen AI MAX+ 395, --fields camera\n~1359ms -> ~155ms and standard mode 1558ms -> 273ms. retch now beats\nfastfetch in standard mode (273 vs 1348ms) and is at parity in --long.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:26:15-07:00",
          "tree_id": "dc9eca701a17186aff929c1b979a8956c13aed61",
          "url": "https://github.com/l1a/retch/commit/cae94eb0c09e6b2f4675d84cbd239d3ed13b6926"
        },
        "date": 1783834405288,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 918362050.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2096.281558421391,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.82409694383316,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.810249857960089,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.058251543673485,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17921.630836744007,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186866.2206507015,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12715.17605296159,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12869.032931670463,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1607141.028915876,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 367.06964831085054,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 313.1206984056455,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ae3ecffd014bc206189c58e5b613f8ff4e0b66d",
          "message": "Add FFI struct-layout assertion tests (#151)\n\nFollowing the Windows native-FFI migration (#146-#150), the pure parsers\nare well unit-tested but the #[repr(C)] FFI structs the OS reads/writes by\noffset were only runtime-verified. Add size_of + targeted offset_of!\nassertions for each: disk (StoragePropertyQuery, StorageDeviceDescriptor\nincl. bus_type/vendor/product offsets, DeviceSeekPenaltyDescriptor,\nDiskGeometryEx incl. disk_size), memory (MemoryStatusEx), bluetooth\n(ServiceStatus, DeviceSearchParams, SystemTime, DeviceInfo incl.\nf_connected/sz_name), fetch (win_cpu::FileTime), win_setupapi\n(SpDevinfoData, already present).\n\nThese catch accidental field-reorder/padding regressions at test time —\nthe failure mode the parse tests can't (the phys-mem 0x14->0x15 offset bug\nin #147 was found only by runtime comparison). Test-only, no runtime\nchange; runs on Windows CI since the structs are cfg(windows).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:52:26-07:00",
          "tree_id": "1d42a683cfb643a99870fca57f865d9e88b409e0",
          "url": "https://github.com/l1a/retch/commit/2ae3ecffd014bc206189c58e5b613f8ff4e0b66d"
        },
        "date": 1783835998647,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 960597279.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2150.299098902674,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.003371018989036,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.834940216950993,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.67632840516249,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18417.830727040604,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190202.38901840878,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12948.364118195717,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13022.424729205562,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1633166.9928104295,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 366.6738502912203,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 273.50443532027367,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "744c0dcd3c15ea67803948e0372c5229715b4783",
          "message": "Fix upload_local_bench.py cp1252 crash on Windows (#152)\n\njust bench-upload and the post-merge hook crashed on Windows with\nUnicodeDecodeError: 'charmap' codec can't decode byte 0x9d — so no local\nWindows \"real hardware\" numbers reached the gh-pages benchmark dashboard.\nThe gh-pages data.js is UTF-8 (commit messages embed arrow/em-dash chars)\nbut open() used the default cp1252 encoding on Windows.\n\nPin encoding=\"utf-8\" on every file operation (data.js read + write, the\nhyperfine JSON temp read) and on run_capture's subprocess text decoding\n(git log --format=%B), plus a sys.stdout.reconfigure UTF-8 guard. Same fix\nclass as scripts/update_wip.py (#142).\n\nVerified: the crash reproduces on the live data.js under the default\nencoding; the UTF-8 read succeeds (845 KB) and append_entry /\ngit_commit_info run without error.\n\nTooling-only; no Rust source touched, retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:01:43-07:00",
          "tree_id": "d579527f5693db2e5215b8c7e6ddfa52671a60fd",
          "url": "https://github.com/l1a/retch/commit/744c0dcd3c15ea67803948e0372c5229715b4783"
        },
        "date": 1783865333350,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 743732185.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2093.9216784537107,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.919590532002054,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.828696377513511,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.03834677161706,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17980.696166255148,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186508.04518801163,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12680.217619484669,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12839.805268270004,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1612938.8902452078,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 368.94858532920586,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.5262436888247,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6c384b96645a8d096e3c0f7a55be58958363939a",
          "message": "Bump version to 0.4.0 (milestone release) (#153)\n\nMinor version bump (0.3.52 -> 0.4.0) marking the completed Windows\nnative-FFI migration and the first GitHub Release since v0.3.40 (rolls up\n#141-#152). Version-marker only — no code change; retch-sysinfo stays at\n0.1.40 and crates.io remains intentionally held.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:46:27-07:00",
          "tree_id": "53e438ffe42566998097d0bc24ec6bd506b380bf",
          "url": "https://github.com/l1a/retch/commit/6c384b96645a8d096e3c0f7a55be58958363939a"
        },
        "date": 1783868023192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 953074174.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2126.694908112213,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.89078368024583,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.797988812667287,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.71431190365861,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18282.28033562592,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190525.52674901456,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12864.588414437207,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13067.397026627546,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1612128.5797242615,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 375.9743082769732,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 300.4435693116721,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88162b293638dfad573a4b63f046cd27aca023f4",
          "message": "Bump to 0.4.1; fix license SPDX for crates.io (#154)\n\nCorrect the deprecated `license = \"GPL-3.0\"` to `GPL-3.0-or-later` in both\ncrate manifests (matching the SPDX-License-Identifier headers in the\nsource) ahead of publishing to crates.io, where per-version license\nmetadata is permanent.\n\nBump retch-cli 0.4.0 -> 0.4.1 and retch-sysinfo 0.1.40 -> 0.1.41 (v0.4.0\nis already tagged, so the license fix requires a new version). No\nfunctional code change. This is the version published to crates.io,\nreversing the prior GitHub-Release-only hold.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T08:27:56-07:00",
          "tree_id": "20fc220a727f5d7f59bb468da3002cf8631afc81",
          "url": "https://github.com/l1a/retch/commit/88162b293638dfad573a4b63f046cd27aca023f4"
        },
        "date": 1783870522595,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1038623669.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2120.7983813732158,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.28844820036223,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.830968134529981,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.01471912318006,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17951.763920262667,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186643.03814960137,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12668.377130919751,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12765.19330436963,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1612510.451960693,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.0686158573363,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.09322289448284,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84a7d7c354231007c97f94f25b262266bb64e146",
          "message": "Fix machine-dependent format_cpu_cores tests (#155)\n\n`format_cpu_cores` reads the host's real CPU topology (Linux /sys cpufreq,\nmacOS hw.perflevel*) and returns a \"NP + ME / KT\" hybrid string on Intel P/E\nand Apple Silicon machines, ignoring its passed-in (logical, physical) counts.\nThe four fallback unit tests called it with fixed args, so they passed on\nnon-hybrid CPUs/CI runners but failed on a hybrid host — an i7-1360P produced\n\"8P + 8E / 16T\" for (16, Some(8)) where the test expected \"8C / 16T\", hard-\nfailing `just pr` there.\n\nExtract the pure fallback into `format_cpu_cores_plain` and retarget the four\ntests at it, so they no longer depend on the runner's hardware. Public\nbehavior of `format_cpu_cores` is unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:41:15-07:00",
          "tree_id": "26f59d72e69fb5f71508fb9427bd765258b160f2",
          "url": "https://github.com/l1a/retch/commit/84a7d7c354231007c97f94f25b262266bb64e146"
        },
        "date": 1783907331894,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1231927988.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1086.9223445744456,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 52.682670144174516,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.4414002054628785,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.394939035992635,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 9015.49656895591,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 85664.02871224875,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 57728.39057578948,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 57728.48480486691,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1550124.885891678,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.9614792645285,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 272.5825444295764,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be732f18be8ed35c252a364cc1241d542d0962ef",
          "message": "Enforce LF line endings via .gitattributes (#156)\n\nThe working tree is shared across Linux/macOS/Windows via Syncthing. With no\n.gitattributes and core.autocrlf=false, a Windows checkout wrote CRLF, Syncthing\npropagated those bytes to the Linux clones, and git reported the entire tree as\nmodified — a phantom 13811+/13811- whole-tree diff with zero content changes\n(git diff --ignore-all-space empty). This blocked the just-pr clean-tree checks.\n\nAdd `* text=auto eol=lf` to force LF on checkout on every OS (essential for a\nbyte-identical Syncthing-shared tree) and `*.png binary` to protect the logo\nassets. HEAD was already stored as LF, so no tracked content changes.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:59:28-07:00",
          "tree_id": "09a0473cae06eab0155f9d17e371c9dc4271dea9",
          "url": "https://github.com/l1a/retch/commit/be732f18be8ed35c252a364cc1241d542d0962ef"
        },
        "date": 1783908423411,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1316521685,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2200.4595233370633,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.429642696406496,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.804260964342157,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.094094059063174,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18293.395157124003,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190100.38826972753,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12911.87518514595,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12989.17213254809,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1620038.2161008525,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 366.23179198703144,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 283.1840973493688,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "280db85bc07aaa37fe6e22c1428c57d3a95ba55b",
          "message": "Add Linux login-manager/brightness/power-adapter (#157)\n\nThree new --long fields closing NOTES §6 fastfetch gaps, each a cheap\nsingle-source Linux probe in the sequential detect_* style (like init/chassis):\n\n- login-manager: resolves the display-manager.service systemd unit symlink\n  (GDM/SDDM/LightDM/greetd/…), prettified.\n- brightness: reads /sys/class/backlight/*/{brightness,max_brightness} as a %.\n- power-adapter: reads the Mains supply under /sys/class/power_supply (name +\n  connected state; wattage omitted — sysfs Mains rarely exposes it).\n\nAll three are Linux-only (None elsewhere). Each detector wraps a pure helper\n(login_manager_from_unit / brightness_percent / format_power_adapter), split\nout and unit-tested host-independently per the v0.4.2 format_cpu_cores lesson;\nhelpers + tests are cfg(linux) so they aren't dead code under clippy -D warnings\non other platforms. Verified live on corrino (greetd, 51%, AC (connected)).\n\nretch-cli 0.4.3 -> 0.5.0, retch-sysinfo 0.1.42 -> 0.1.43.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T20:11:45-07:00",
          "tree_id": "c4f4b86a753026bf48a3009deb1ece1f46ea99bc",
          "url": "https://github.com/l1a/retch/commit/280db85bc07aaa37fe6e22c1428c57d3a95ba55b"
        },
        "date": 1783912759644,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 956493279.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2132.1192412302044,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 66.44242967215007,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.833942044330579,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.416631308664044,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18397.931292627014,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 191236.18804551425,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12980.04606973221,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13088.113079504337,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1640343.8143278505,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 406.8107630151731,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 288.9715936757221,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbb9672b8c95616671974128187d9d3b32f0fe53",
          "message": "Fix network status bracket color nesting (#158)\n\nowo_colors closes every foreground color with the default-reset \\x1b[39m, so\nthe green \"Up\" / red \"Down\" embedded in the Net value cancelled the enclosing\nvalue color (and, for the active interface, the bright-blue highlight). Everything\nafter [Up] fell back to the terminal default: the active line's opening [ was blue\nbut the closing ] and the RX/TX stats were not.\n\nAdd colorize_nested(text, prefix) which re-asserts the enclosing color after every\ninterior \\x1b[39m so nested colored spans restore the surrounding color instead of\nfalling to default. It is byte-identical to the old plain wrap when there is no\nnested reset, so only the Net field's rendering changes. Theme::color_value routes\nthrough it and the active-interface highlight uses ACTIVE_IFACE_PREFIX. The library\nnetwork.rs is untouched. Four regression tests cover the helper.\n\nBump retch-cli to 0.5.1 (retch-sysinfo unchanged at 0.1.43); regen man page.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T21:49:19-07:00",
          "tree_id": "15c36368910c46efd1ba4d0a4f43df2b81c63aa0",
          "url": "https://github.com/l1a/retch/commit/fbb9672b8c95616671974128187d9d3b32f0fe53"
        },
        "date": 1783918582475,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 671605393.65,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2029.4284753591153,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.43054448696607,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.865408197152666,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.57339214583247,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17985.14421870742,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186641.0206157949,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12639.989423396648,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12783.450681212013,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1637119.6387636384,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 381.1027779558629,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 288.23002169483095,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c4f762eed77a36ac3d95a1beb6a4cab62afb2965",
          "message": "Add Windows domain and terminal-size fields (#159)\n\nTwo --long fields that previously returned None on Windows now have\nnative arms — the first of the Windows cross-platform-parity feature\nseries (distinct from the completed PowerShell->FFI perf migration).\n\n- domain: primary DNS suffix via GetComputerNameExW(ComputerNameDnsDomain)\n  (kernel32, two-call size probe). A workgroup host's empty suffix maps to\n  None via the pure clean_domain helper — not the NetBIOS WORKGROUP name —\n  matching the Linux/macOS /etc/resolv.conf DNS-domain semantics.\n- terminal-size: console viewport via GetStdHandle + GetConsoleScreenBufferInfo,\n  using the srWindow rect (not dwSize, the scrollback buffer). Pure\n  window_rect_to_size helper does the inclusive-rect -> \"COLSxROWS\" math;\n  piped output has no console -> graceful None -> existing env fallback.\n\nHand-written extern \"system\" FFI, no binding crate (house style); // SAFETY:\non every unsafe. Non-Windows arms untouched. New tests: clean_domain,\nwindow_rect_to_size, and a CONSOLE_SCREEN_BUFFER_INFO size_of layout guard.\nVerified live on arrakis (Windows 11): domain correctly absent (DNS suffix\ngenuinely empty), terminal-size renders 100x40.\n\nretch-cli 0.5.1 -> 0.6.0, retch-sysinfo 0.1.43 -> 0.1.44.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:13:18-07:00",
          "tree_id": "89121134b1cdf90e97f3ba23b740bd744dbf5193",
          "url": "https://github.com/l1a/retch/commit/c4f762eed77a36ac3d95a1beb6a4cab62afb2965"
        },
        "date": 1783977651617,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 947135703.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2054.922306562602,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 76.17745163785892,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.864122360905556,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 74.64219397792131,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17727.99702243645,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 185756.22761609318,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12752.250987901516,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12628.605542409527,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1646185.974217105,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 381.3576111790909,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 302.0498527153924,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30195b0eaaf4f96b4b6fe43c11001046a871537b",
          "message": "Fix Windows Camera (scanners) and Users (=0) bugs (#160)\n\nTwo user-reported Windows output bugs in the cross-platform-parity series.\n\nCamera listed scanners as cameras (e.g. \"EPSON ET-3850 Series\"). The Windows\npath enumerated the Camera + Image (WIA) setup classes, but scanners/printers\nshare the Image class with some real webcams (a Logitech BRIO is Image-class),\nand is_real_camera has no keyword to catch an EPSON model string. Fixed by\nenumerating the KSCATEGORY_VIDEO_CAMERA device-interface class instead — only\nreal cameras register it, so scanners are excluded while Image-class webcams are\nkept. Added win_setupapi::present_interface_device_names (DIGCF_DEVICEINTERFACE,\nsharing the existing enumerate_names core) + the KSCATEGORY_VIDEO_CAMERA GUID;\nremoved the now-unused GUID_DEVCLASS_CAMERA/_IMAGE. Also drops the synthetic\n\"Windows Virtual Camera Device\" via a Windows-only is_windows_virtual_camera\nhelper (Linux/macOS untouched).\n\nUsers showed 0 with a user logged in: sysinfo keys Windows users by SID, so the\nUnix uid>=1000 filter never matched. New win_users module counts active\ninteractive sessions via WTSEnumerateSessionsW + WTSQuerySessionInformationW\n(wtsapi32; query-user semantics), with a pure unit-tested count helper. Per the\n\"if it doesn't work, don't show it\" request, display.rs now suppresses Users\nwhen the count is 0 (mirrors the packages guard).\n\nNon-Windows camera/users behavior unchanged. FFI house style (hand-written\nextern \"system\", // SAFETY:, WTS_SESSION_INFOW size_of guard). Verified live on\narrakis: Camera = Logitech BRIO + ASUS FHD webcam only; Users: 1.\n\nretch-cli 0.6.0 -> 0.6.1, retch-sysinfo 0.1.44 -> 0.1.45. Patch (bugfixes).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:46:19-07:00",
          "tree_id": "13dc79f2b8c9dd3041dc8f5dfc070fb42bba266a",
          "url": "https://github.com/l1a/retch/commit/30195b0eaaf4f96b4b6fe43c11001046a871537b"
        },
        "date": 1783979622367,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1213694324.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1068.168093705683,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 53.09725873277669,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.898247219653369,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.09190116637236,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8713.7026377695,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 83509.36372062695,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 57505.01373901825,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 57071.26170135278,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1562831.88851897,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.1007391139239,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 297.2356584817993,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2b4a083ed6b7696bd56727cbcc285ed5ac45030f",
          "message": "Unblock just pr on Linux: tests + man regen (#165)\n\nTwo coupled docs/test-hygiene fixes (no runtime behavior change), bundled\nbecause the first is what lets `just pr` pass on the reinstalled Fedora box.\n\n1. Machine-independent xrandr display tests. parse_xrandr_displays called\n   get_monitor_name_for_port (live /sys/class/drm EDID) inline, so the\n   fixture tests substituted the physically-attached monitor for the\n   fixture's connector name (DP-1 -> the panel's EDID model ATNA33AA08-0).\n   These tests are cfg(not(macos/windows)) and never ran on the old Windows\n   arrakis, so the defect was latent until the first cargo test after the\n   Fedora reinstall. Same class as #155. Extract a pure\n   parse_xrandr_displays_with(stdout, resolve); the public wrapper passes\n   get_monitor_name_for_port (production unchanged) and the tests pass\n   |_| None. Add a regression test asserting the resolver is honored.\n\n2. Regenerate docs/retch.1. The committed page carried double-bold groff\n   runs from the Windows #160 `just man` run, where the recipe's\n   sed 's/\\fB\\fB/\\fB/g' strip did not take effect. Linux regeneration\n   produces the intended single-bold output, matching the recipe's intent.\n\nPatch bump: retch-cli 0.6.2, retch-sysinfo 0.1.46 (new pub\nparse_xrandr_displays_with).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:10:26-07:00",
          "tree_id": "545ecee36947f96e29585e4dcc803424559d5b6b",
          "url": "https://github.com/l1a/retch/commit/2b4a083ed6b7696bd56727cbcc285ed5ac45030f"
        },
        "date": 1784906295467,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 994815249.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1112.0540728409892,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.68066938736111,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.3734966081545235,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.61393355224642,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 9126.941010935268,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 86604.1953051718,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 58455.03965615565,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 59088.12662131237,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1693103.9412431982,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 354.58327834582553,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.56039490350224,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9cbad3234c6ec06f444e623a84b3ff72efbcd50",
          "message": "Bump deps + CI actions (Dependabot #161/163/164) (#167)\n\nConsolidate three open Dependabot PRs into one gated PR so the release-hygiene\nsteps they bypass (retch version bump, NOTES/man regen) are performed. No\nruntime behavior change.\n\n- Rust deps (#164, cargo-dependencies group, all patch-level, lockfile-only\n  since the Cargo.toml specs are caret ranges): clap 4.6.1->4.6.4 (pulls syn v3\n  via clap_builder/clap_derive), serde 1.0.228->1.0.229, toml 1.1.2->1.1.3,\n  clap_complete_nushell 4.6.0->4.6.1, anyhow 1.0.103->1.0.104,\n  libc 0.2.186->0.2.189, sysinfo 0.39.5->0.39.6, serde_json 1.0.150->1.0.151.\n- actions/checkout 7.0.0->7.0.1 (#163) across benchmark/claude/\n  claude-code-review/packaging/rust/security (both SHA-pinned and @v7 uses).\n- softprops/action-gh-release 3.0.1->3.0.2 (#161) in the rust.yml release job.\n\nretch-cli -> 0.6.3; retch-sysinfo unchanged (0.1.46, no source change).\nWorkspace fmt/clippy/test all green.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:51:12-07:00",
          "tree_id": "0627e675b46ff2705a23fb6064df75bf587aac13",
          "url": "https://github.com/l1a/retch/commit/a9cbad3234c6ec06f444e623a84b3ff72efbcd50"
        },
        "date": 1784908716007,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 956417884.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2047.6538773001623,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.272649469543616,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.828852521754483,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.98420125083476,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18311.68720518787,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190830.495195919,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12941.9899280259,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13017.244651254112,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1620831.9663397432,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 398.0589919055612,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 281.5041210545389,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c0cf9c9583413e1b1d346274f3367162daef52e",
          "message": "Bump base64 0.22 -> 0.23 (Dependabot #166) (#169)\n\nThe one genuinely-new bump from Dependabot #166 (the other 8 crates in that\ngroup already landed in #167/v0.6.3). A semver-breaking 0.x bump, held out of\nthe v0.6.3 consolidation pending an API check. No runtime behavior change.\n\nbase64 is used only under the optional `graphics` feature (src/logo.rs, two\ngeneral_purpose::STANDARD.encode() sites for the Kitty/iTerm2 inline-image\nprotocol). The Engine encode API is unchanged in 0.23: build + clippy\n-D warnings are clean *with --features graphics* (the default gate does not\ncompile base64), and tests pass with and without the feature. `cargo bench`\nis unchanged (base64 is not on any benchmarked path). Widened the Cargo.toml\nspec \"0.22\" -> \"0.23\" since the caret range wouldn't admit 0.23.\n\nretch-cli -> 0.6.4; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T08:22:25-07:00",
          "tree_id": "5c659664226725eb40ca8c915bafbcf13fe02f12",
          "url": "https://github.com/l1a/retch/commit/7c0cf9c9583413e1b1d346274f3367162daef52e"
        },
        "date": 1784993429718,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1133417781.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1047.2110432269208,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.88056679646438,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.4016607271023505,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.32125100409746,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 9007.36140908499,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 84658.52643511796,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 57370.07654368399,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 57880.23947065948,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1745330.8513648012,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 379.6862659629458,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.56089452983898,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "586012cefc4c98dfa9ab5b227b0832620797265c",
          "message": "Lint graphics feature in just check (v0.6.5) (#170)\n\nAdd `cargo clippy --features graphics -- -D warnings` to the `check` recipe\n(and therefore the `just pr` gate). The base64 0.22->0.23 bump surfaced that\nbase64/image/icy_sixel and their src/logo.rs call sites live behind the\noptional `graphics` feature, which the default `cargo clippy --workspace`\nnever compiles -- so a graphics-only lint or API break could pass the gate\nunseen. Targets retch-cli (which defines the feature), not --workspace.\n\nTooling only, no runtime change. Closes the LOCAL gate gap; CI still builds\ndefault features, so a CI graphics job would be a separate follow-up.\nretch-cli -> 0.6.5; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:33:31-07:00",
          "tree_id": "f944cee1876f95b5314bfca44f0ba40a154033bb",
          "url": "https://github.com/l1a/retch/commit/586012cefc4c98dfa9ab5b227b0832620797265c"
        },
        "date": 1784997645074,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 719137456.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2063.6482766172276,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.51999121072517,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.814444623143443,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.830762357688776,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18298.801064084968,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 191228.88569279696,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12923.891776267605,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13010.664518051257,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1614494.9636026472,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 398.5197853543041,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 272.71750375570105,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da6c74f858f9d84a8b3b076473c1026f04aef412",
          "message": "Show ASCII logo without a TTY; fix CI dry-run (v0.6.6) (#171)\n\ndisplay.rs gated the logo purely on stdout_is_tty, so `retch --ascii-logo`\nrendered no logo when piped/redirected -- including CI's full-test \"Run\nfetcher (dry run)\" step, which showed no logo.\n\nExtract a pure `should_show_logo(config_show_logo, no_logo, ascii_logo,\nstdout_is_tty)` helper: `--no-logo` always wins; `--ascii-logo` now forces the\nlogo on regardless of TTY or config (ASCII is plain, pipe-safe text, mirroring\nhow --no-logo is always honored); auto mode is unchanged (default-on,\nTTY-gated). --chafa-logo/graphical modes are deliberately not forced (they emit\nterminal-only control sequences).\n\nUpdate the CI full-test dry-run to `cargo run --release -- --full --ascii-logo`\nso it exercises every field AND the ASCII-logo path. 4 new unit tests on the\nhelper; verified live that piped `--full --ascii-logo` shows the logo while\npiped `--full` alone still shows none.\n\nretch-cli -> 0.6.6; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:48:23-07:00",
          "tree_id": "88dc56bcc4160f88dae2e60506f62a93c2ca7ea4",
          "url": "https://github.com/l1a/retch/commit/da6c74f858f9d84a8b3b076473c1026f04aef412"
        },
        "date": 1784998539751,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 954204301.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2033.7261753526436,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.511060922039306,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.812100742048335,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.44580906553087,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18063.776396443627,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 187676.2264923171,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12728.896332077511,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12943.299104145492,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1598326.3838745577,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 388.753949626122,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 276.7014871107258,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ada1356ee93539a36a2c996eaa23e24c481463a3",
          "message": "Add CI graphics-feature job (v0.6.7) (#172)\n\nThe default `build` matrix never compiles the optional `graphics` feature\n(base64/image/icy_sixel + the src/logo.rs inline-image paths), so a\ngraphics-only lint or API break could pass CI unseen -- as the base64\n0.22->0.23 bump nearly did. v0.6.5 closed this in the local `just check` gate;\nthis closes it in CI.\n\nAdd a dedicated `graphics-feature` job to rust.yml (one ubuntu runner, same\nnon-tag triggers as `build`) running:\n  cargo clippy --features graphics -- -D warnings\n  cargo build  --features graphics --verbose\n\nCI only, no runtime change. retch-cli -> 0.6.7; retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T10:40:12-07:00",
          "tree_id": "ee5c8fdd3c4060bb2ec7f42369695582a0637e23",
          "url": "https://github.com/l1a/retch/commit/ada1356ee93539a36a2c996eaa23e24c481463a3"
        },
        "date": 1785001691162,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 716367705.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2101.081957148899,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.62482174805781,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.846105474432524,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.47521410540342,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18386.93109610865,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190253.72035025666,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12872.676355362853,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12981.268932261988,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1671967.4529326088,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 389.2294626000375,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.6181750061104,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa886633f69e0ee0a7db86ea7dc9773ceec03be9",
          "message": "Keep logo beside text in --long/--full (v0.6.8) (#173)\n\n* Keep logo beside text in --long/--full (v0.6.8)\n\nThe side-by-side vs. stacked layout decision (and the text-column width) was\ncomputed from the widest of ALL info lines. In --long/--full a single very long\nline -- a 150+ char Wi-Fi line, or the Net/Battery lines -- inflated the text\ncolumn past the terminal width and forced the logo to stack ABOVE the text,\neven though those long lines sit well BELOW the logo.\n\nExtract a pure `plan_layout(info_widths, logo_height, logo_width, term_width,\nshow_logo)` that considers only the info lines that actually sit BESIDE the\nlogo (the first `logo_height` rows). Long lines below the logo render at column\n0 with the full terminal width and no longer affect placement.\n\nLogo-type-agnostic: logo_height/logo_width come from the active logo, so it\nworks identically for ASCII, Chafa (both rendered as text `Lines`) and the\ngraphical image protocols (Kitty/iTerm2/Sixel -- height_lines + fixed image\ncolumn).\n\nVerified in a pseudo-terminal: --full renders the logo beside the text at\n140 cols (previously stacked) and correctly stacks at 90 cols. 7 new\nplan_layout unit tests. retch-cli -> 0.6.8; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8\n\n* CI: build-job dry run uses --full --ascii-logo too\n\nThe `build` job's \"Run fetcher (dry run)\" step still ran `cargo run -- --long`\n(no logo). Make it `cargo run -- --full --ascii-logo`, matching the full-test\ndry run, so every CI dry run exercises all fields and the logo/layout path.\n\nAssisted-By: Claude Opus 4.8\n\n* Split Wi-Fi into two lines; grayscale Apple logo\n\nTwo display tweaks requested on top of the layout fix (same PR):\n\n- Wi-Fi: the iw path builds a single \"{adapter} [{iface}] - {SSID} (band/rate)\"\n  string that ran 150+ chars and wrapped into the logo. Split on the \" - \"\n  boundary via a pure `split_wifi_line` into a `Wi-Fi` line (adapter hardware)\n  and a `Wi-Fi Link` line (live connection). Fallback detectors have no \" - \"\n  and stay one line. `Wi-Fi Link` is aliased to the `wifi` field key in\n  should_show (like dns/memory). 3 unit tests.\n\n- macOS/Apple ASCII logo: replace the legacy rainbow colour bands\n  (green/yellow/red/magenta/blue) with a 256-colour grey (silver) ramp,\n  matching the modern monochrome Apple logo. Graphical macos.png untouched.\n\nretch-cli stays 0.6.8 (same PR); retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix graphical logo landing mid-text in --long/--full\n\nThe side-by-side path for image protocols (Kitty/iTerm2/Sixel) printed ALL the\ninfo lines first, then did `\\x1b[{n}A` to move back up and draw the image to the\nright of the top rows. For tall output (--long/--full) the info block is taller\nthan the viewport, so by the time the text finished the screen had scrolled and\nthe cursor-up was clamped at the top of the viewport -- the image was drawn in\nthe MIDDLE of the text, overlapping it (reported on kitty).\n\nDraw the image FIRST instead: move to the top of the logo column, bracket the\nimage draw with save/restore (\\x1b7/\\x1b8) so it lands at the correct row before\nany text is printed or the screen scrolls, then print the info lines\ntop-to-bottom at column 0. The terminal scrolls naturally and carries the\ncell-anchored image with it. Shared `render_graphical_side_by_side` helper for\nall three protocols. Verified the escape choreography (right/save/image/restore/\nCR/text) at the byte level in a kitty pty.\n\nretch-cli stays 0.6.8 (same PR).\n\nAssisted-By: Claude Opus 4.8\n\n* docs(NOTES): record graphical logo placement fix (v0.6.8)\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T17:31:49-07:00",
          "tree_id": "9b82d07a4ddf3e53b29bc8579d9a7acdcf12908e",
          "url": "https://github.com/l1a/retch/commit/fa886633f69e0ee0a7db86ea7dc9773ceec03be9"
        },
        "date": 1785026346844,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 730975198.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2271.913588299796,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.58567847480542,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.834181042502579,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.88869089393857,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18338.355277667368,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190411.96376683115,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12835.276929406245,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12992.906149660837,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1626330.3224826502,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 390.0683766983352,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 298.00477628440206,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b899b3ca3988eab8b8632cbb3b5263bf35322a76",
          "message": "Fix graphical logo placement after scroll (v0.6.9) (#174)\n\nThe v0.6.8 side-by-side choreography saved the cursor (DECSC), drew\nthe image, and restored (DECRC). With the prompt at the bottom of the\nscreen the draw scrolls the viewport, and DECSC/DECRC restore a\nviewport-relative position, so the info text landed below the logo\ninstead of beside it. Reproduced identically on Rio and kitty.\n\nReserve the logo rows with newlines first and cursor-up back to the\nimage-top row, so any scroll happens before the save and nothing\nbetween save and restore can scroll. Fresh-screen output unchanged.\n\nAlso refresh the stale in-repo packaging reference copies\n(PKGBUILD/package.nix 0.3.21 -> 0.6.8), per the tracked WIP task.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:32:00-07:00",
          "tree_id": "a20285fab03aaf49bedc3f4d570f209aaf34e68d",
          "url": "https://github.com/l1a/retch/commit/b899b3ca3988eab8b8632cbb3b5263bf35322a76"
        },
        "date": 1785076773941,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 767122749.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1105.8645577307987,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.10010807736385,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.345427003542314,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.80185308018129,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 9176.450859174485,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 86875.04858076671,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 58750.739244175085,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 58954.79911384526,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1688636.995250769,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 376.50946713073455,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.80248533130583,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fd8164049e99da545e8fe98d3f0b76e8c09b6faa",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10) (#175)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:58:18-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/fd8164049e99da545e8fe98d3f0b76e8c09b6faa"
        },
        "date": 1785078338386,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1065589210.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2085.6202372588787,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.193453286335384,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.832509691432732,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.589738774684555,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18208.853808913722,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189250.18864367,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12823.807600797734,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12978.006344717143,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1405189.8313897199,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 364.9612738472558,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 285.0860329541812,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e8b380c97debf11a4a35306f669cf3e456ccd616",
          "message": "Report default-route domain, not a VPN's (v0.6.11) (#176)\n\nUnder systemd-resolved /etc/resolv.conf is the stub file whose search\nlist is the merged set of every link's domains, so the Domain field --\nwhich took its first entry -- showed a split-tunnel VPN's domain\n(netbird.cloud) instead of the default route's (lan). It never\nconsidered interfaces at all.\n\nResolve the IP default-route interface from /proc/net/route and report\nthat link's own domain from resolvectl status. Keyed on the routing\ntable, not resolvectl's per-link 'Default Route:' flag, which is a DNS\nrouting flag and was yes for both links. When resolved manages the\ndefault link but it has no domain, report nothing rather than falling\nback to the merged list (which would resurrect the VPN domain); an\nunmanaged link still falls back, so static-resolv.conf hosts are\nunchanged. A full-tunnel VPN that is the default route reports its own\ndomain, as intended.\n\nFix two latent bugs in the same parser: all '~'-prefixed routing-only\ndomains are excluded (not just the exact catch-all '~.'), and wrapped\ncontinuation lines are no longer silently dropped.\n\nresolvectl is now needed by --long, so one OnceLock-cached invocation\nis shared with --full's domain-search rather than spawning twice.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T08:39:18-07:00",
          "tree_id": "8e30bf9598c906aed347fbd5c1c2ab33160360b0",
          "url": "https://github.com/l1a/retch/commit/e8b380c97debf11a4a35306f669cf3e456ccd616"
        },
        "date": 1785080764235,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 908388208.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1525.8323360653374,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 29.705968255446805,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.1735364860952417,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 30.263644779090612,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 14834.69985511495,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 155693.78599396415,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10815.716669663638,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 10986.985972415958,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 997303.2445052795,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 180.7607539815281,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 153.8633925386246,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "86f5803462d1608de8b7739c8dc6c69bc9c85a46",
          "message": "Give Domain Search one shape per source (v0.6.12) (#177)\n\nCI dry-run output showed 'eth0: <domain>' on Ubuntu but a bare\n'<domain>' on Fedora. The difference is not platform-driven: the same\nOS flips format between jobs. Ubuntu in the build matrix runs on a bare\nrunner and takes the resolvectl path; Ubuntu in full-test runs in a\ncontainer with no systemd-resolved and falls back to resolv.conf.\nFedora is always containerised, so it only looked different from\nUbuntu.\n\nGrouping differed too: the resolvectl path returns one entry per\ninterface with domains joined, while the fallback returned one entry\nper domain and the display prints one line per entry, so 'search a b c'\nemitted three separate bare lines.\n\nRender the fallback in the same '<scope>: a, b' shape, scoped 'global'\n-- labelled honestly rather than attributed to an interface, since\nresolv.conf's search list carries no attribution. The parser stays\nfaithful to the file; the shape is imposed at the detect layer. macOS\nroutes through the same formatter. The resolvectl path is unchanged.\n\nWindows is deliberately not fixed here and is documented in NOTES 6a:\nits Domain reads the AD/primary suffix rather than the connection\nsuffix, and Domain Search has no Windows arm at all. Both need\nGetAdaptersAddresses and cannot be verified live without a Windows box.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T19:35:39-07:00",
          "tree_id": "b11c193d8bdb824b38e28d4104d2b63b410c8fea",
          "url": "https://github.com/l1a/retch/commit/86f5803462d1608de8b7739c8dc6c69bc9c85a46"
        },
        "date": 1785120160549,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1355592969.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1734.6257491662825,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.31681059022244,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.907900241166536,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.70973604880344,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16238.110827764094,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 163930.2450248493,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11392.577128705972,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 11566.065329223778,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1160993.7349277844,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 281.4502083495637,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 211.715987431943,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3738fdb3ff66b18fc121092f4f086ea51ac0dc30",
          "message": "Fix release tooling: publish-check and nix hashes (v0.6.13) (#178)\n\npublish-check failed on every release: the retch-cli dry run cannot\nresolve its '=0.1.x' retch-sysinfo pin until sysinfo is actually on the\nindex, and a dry run never uploads. It now checks the sparse index via\na new crates_io_has_version.py helper and skips that leg with an\nexplanation instead of dying on 'failed to select a version'. Both\npublish recipes also skip retch-sysinfo when its version is already\npublished, which is the normal state for a CLI-only release.\n\ncalculate_nix_hashes.py was silently emitting a wrong cargoHash. Its\nsubstitutions matched only 'lib.fakeHash', so once package.nix held\nreal values they became no-ops, the temp build kept the previous\nrelease's hashes, it failed on a source-hash mismatch rather than the\nintended cargoHash mismatch, and the lenient parser returned that stale\nsource hash. That is why the published v0.6.12 cargoHash equals\nv0.6.8's hash. Patterns now match a literal hash too, are line-anchored,\nand hard-error when they match nothing; the parser only accepts a hash\nreported against our own dummy.\n\nRefresh the in-repo packaging reference copies to the released v0.6.12.\npackage.nix keeps the genuine src hash but resets cargoHash to\nlib.fakeHash rather than carrying the corrupt value -- recompute with\n'just nix-update' on a machine with Nix.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-07-26T20:14:41-07:00",
          "tree_id": "195de4a24b9c74a5d3bbc3288e0a4ce21ab48a89",
          "url": "https://github.com/l1a/retch/commit/3738fdb3ff66b18fc121092f4f086ea51ac0dc30"
        },
        "date": 1785122527472,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 998423215,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2149.4261472949097,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.09461986365087,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.803225648711525,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.90217213627731,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18201.671124513054,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 188633.92064181136,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12840.865700171309,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12932.731194540582,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1397404.421149382,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 374.0184479414416,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 281.1254569473734,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29c90fa282c281f6c5a2b797544c5babf5e957ce",
          "message": "fix(net): resolve Windows connection DNS domain and search list (#181)\n\n* fix(net): resolve Windows connection DNS domain\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(net): read Windows interface registry search list\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-07T23:10:01-07:00",
          "tree_id": "1430e5590c797113f0e21a4cdab22e90bfe90ce4",
          "url": "https://github.com/l1a/retch/commit/29c90fa282c281f6c5a2b797544c5babf5e957ce"
        },
        "date": 1786169840677,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 840025414.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2264.1692549759964,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.682724971992194,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.05076655561969,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.423274967882186,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21084.558796897792,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 212071.0019799914,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14784.293540213836,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14985.961679274938,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1528746.905436138,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 360.27358877255864,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 272.4679477539933,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "464951f8ff41455093d91045e621a17b81124684",
          "message": "fix(display): parse monitor vendor and panel model from EDID on Windows (#183)\n\n* fix(display): parse monitor EDID on Windows\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): extract monitor vendor and model on Windows\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-08T07:48:08-07:00",
          "tree_id": "5029838743a7e4449bedecce22a3d07443557dd7",
          "url": "https://github.com/l1a/retch/commit/464951f8ff41455093d91045e621a17b81124684"
        },
        "date": 1786200931261,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 860270606.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2230.937978861579,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 115.20491914305737,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.698298939559962,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.18649224830434,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21087.924154552275,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 210788.79281040764,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14776.203834350768,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14872.74003910269,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1520350.0833649922,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.1801790473902,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 290.2070250840549,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "622cf3b843fc5f6286cad91442e7bd41af2fdf12",
          "message": "Bump 4 deps and fix man page font-run strip (#184)\n\nConsolidates Dependabot #182 onto a gated branch so the release-hygiene\nsteps Dependabot skips (version bump, NOTES entry, man regen) are done.\n\nDependencies (cargo-dependencies group, lockfile-only — every spec is a\ncaret range, so Cargo.toml is untouched):\n  clap          4.6.4 -> 4.6.5  (clap_builder 4.6.2 -> 4.6.5)\n  toml          1.1.3 -> 1.1.4  (toml_parser  1.1.2 -> 1.1.3)\n  clap_complete 4.6.7 -> 4.6.8\n  base64        0.23.0 -> 0.23.1\n\nThe resulting Cargo.lock is byte-identical to what Dependabot generated.\n\nAlso fixes the `just man` font-collapsing sed, which has never worked on\nany platform. mandown emits redundant \\fB\\fB...\\fP\\fP runs and the recipe\ncarried `s/\\fB\\fB/\\fB/g` to strip them, but GNU sed reads \\f as the\nform-feed escape rather than backslash-then-f, so the pattern only ever\nmatched form feeds that groff output never contains. This is why\ndocs/retch.1 kept flip-flopping between machines: v0.6.2 concluded the\nstrip merely \"didn't take effect on Windows\", when in fact Linux was not\nstripping anything either — its mandown build just doesn't emit the\ndoubled runs. Matching the backslash as [\\] and carrying it out through a\ncapture group keeps any backslash escape off the replacement side.\n\nWith the fix, `just man` on Windows reproduces byte-for-byte the file a\nLinux `just man` produces, so the regen check in `just pr` no longer\ndepends on which machine last ran it. The regenerated page drops 21\ndoubled font runs and changes nothing else but the version footer.\n\nretch-sysinfo unchanged at 0.1.51; no Rust source touched.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-09T07:06:33-07:00",
          "tree_id": "15f29415e43f3e3f4f04318b070cc8c16695ac9a",
          "url": "https://github.com/l1a/retch/commit/622cf3b843fc5f6286cad91442e7bd41af2fdf12"
        },
        "date": 1786284834171,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 927428588.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2109.5940584566474,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 119.96003693474238,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8285399480831535,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.01917897939262,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18183.674000907653,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189200.3015825371,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12793.039251592854,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12912.155705081745,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1403108.9113880112,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 367.6000792651613,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 310.43200658969,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30f2bc0d85fda967af17b3472e2784627296f331",
          "message": "fix(justfile): make install and man recipes portable (#185)\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T13:24:44-07:00",
          "tree_id": "0ebf13827d71fe02fbbdd12b0eb83ccbacbc2ab8",
          "url": "https://github.com/l1a/retch/commit/30f2bc0d85fda967af17b3472e2784627296f331"
        },
        "date": 1786393925374,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 981409361.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2104.635225007227,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 119.52254655570243,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.808809490528101,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.98644313408008,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18363.994705986308,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 188610.45500871644,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12845.573356372988,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12962.595411843136,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1426006.3766825018,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 370.4529916474482,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 297.39053838678797,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "521364f30839992fda65499538a01a44bc4f11bb",
          "message": "fix(display): constrain graphic logo height, normalize audio, and wrap lines to terminal width (#186)\n\n* fix(display): reduce logo height and wrap long info lines\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): constrain graphic logo height and wrap below-logo lines to full terminal width\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): normalize and deduplicate Windows audio device names\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): evaluate soundwire before streaming filter in normalize_win_audio_device\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T14:10:09-07:00",
          "tree_id": "8526b53eccb25ed2a964d63d08a63e698c00c32f",
          "url": "https://github.com/l1a/retch/commit/521364f30839992fda65499538a01a44bc4f11bb"
        },
        "date": 1786396647523,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 692379788.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2209.3236965258975,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 123.09159037921684,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.055785198505912,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.42871348471093,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21044.584366044845,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 211502.9363716004,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14675.558020819513,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14563.287010099146,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1522463.8284894694,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 389.67822741316206,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 286.2101625628678,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1177d194785c63e2058a99f5cffa5ef33577d9cb",
          "message": "ci: disable Claude Code Review workflow (#187)\n\nThe claude-review job no longer runs on pull requests: the\n`pull_request` trigger is replaced with `workflow_dispatch` and the\njob carries `if: false`, so it is off by default but can still be\ninvoked manually if wanted.\n\nBumps retch-cli 0.6.16 -> 0.6.17 (patch), refreshes Cargo.lock,\nregenerates docs/retch.1 for the new version footer, and updates the\nNOTES.md Current State header and release log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T08:18:19-07:00",
          "tree_id": "5edf46dce11e5ab7293d0a0411af8f9341a70b2b",
          "url": "https://github.com/l1a/retch/commit/1177d194785c63e2058a99f5cffa5ef33577d9cb"
        },
        "date": 1786461929142,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 683319753.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2251.7100043112046,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 116.22989679221442,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.031154403076076,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.761249586235955,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20919.222921396162,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 208774.27625532067,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14738.059624273275,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14937.53812898805,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1504561.1258821299,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 382.72890994069274,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.46914428085495,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1d0dc367f9ad44e2a04cc045891998fa9d9b1aae",
          "message": "fix: unprivileged Packages, sudo Rio, logo aspect (#189)\n\nThree defects found by diffing `sudo retch --full` against a plain run.\n\nPackages appeared only under sudo. The RPM SQLite database was opened\nread-write; it is root-owned inside a root-owned directory, so SQLite\ncould not create its journal sidecars and every *query* failed with\n\"attempt to write a readonly database\" — not the open(), which is why\nthe existing warning never fired and the field vanished silently. Now\nopened read-only over a `file:...?immutable=1` URI, and the query error\nis reported instead of swallowed.\n\nRio lost all graphics support under sudo: it was identified only by\nTERM_PROGRAM, which env_reset drops. `is_rio_terminal` now also accepts\nTERM=rio/xterm-rio, which sudo preserves.\n\nThe Kitty logo was stretched ~3x vertically. `c=26,r=10` was hardcoded\nand Kitty forces an image into that rectangle, while display.rs assumed\na fixed 40-column width and derived the row count a third way. A single\npure `fit_logo_cells` now feeds all three protocol emitters and\nplan_layout. Passing both correct values still left a 9% stretch from\ncell quantisation, so the Kitty spec carries only the limiting dimension\nand lets Kitty derive the other — measured 0.0% aspect error in a PTY.\n\nThe chafa box widens 28 -> 45 columns (row cap unchanged at 10) so wide\nlockup assets stay legible: the Fedora logo goes from 4 rows to 7. The\nside-by-side threshold is unaffected (45 + 45 <= 95), pinned by a test.\n\nAlso fixes a test-isolation defect the change exposed: once\nsupports_iterm2 read TERM, the host's TERM leaked into a test that\nguarded only TERM_PROGRAM, failing on a Rio box and passing on CI.\n\nDocuments the privilege trade-off in both directions (root-only\nphys-mem and btrfs snapshot counts; user-only editor/desktop/wm) in a\nnew NOTES section, README, and a man-page PRIVILEGES section.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T17:52:19-07:00",
          "tree_id": "9996d32ff3728e9292ad474ad37e12907763f637",
          "url": "https://github.com/l1a/retch/commit/1d0dc367f9ad44e2a04cc045891998fa9d9b1aae"
        },
        "date": 1786496378821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 866676076.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2264.6111102852738,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 120.36362290712569,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.027972152707867,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.17472321587864,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21177.437477408694,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 212876.55947319878,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14812.42859751674,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14997.605434061796,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1554402.664701099,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 379.02218224681064,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.7332951091112,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d27af8746fe0e349822f3272031e94e03589b50",
          "message": "chore: bump 3 deps (consolidated Dependabot #188) (#190)\n\nRolls Dependabot #188 onto a gated branch so the release hygiene it\nbypasses — version bump, NOTES entry, man regen — is actually done,\nfollowing the #167/v0.6.3 and #184/v0.6.16 pattern.\n\nAll patch-level and lockfile-only; every spec is a caret range, so both\nCargo.toml manifests are untouched:\n\n  clap           4.6.5 -> 4.6.6  (pulls clap_builder 4.6.5 -> 4.6.6)\n  clap_complete  4.6.8 -> 4.6.9\n  rusqlite       0.40.1 -> 0.40.2 (pulls libsqlite3-sys 0.38.1 -> 0.38.2)\n\nThe lockfile was diff-verified byte-identical to Dependabot's before the\nversion bump, so this carries exactly the change its green CI validated;\nafterwards the only divergence is retch-cli's own version line.\n\nrusqlite warranted a live check rather than just a green suite: it is a\ndirect dependency of retch-sysinfo and the crate v0.6.18's Packages fix\nhad just started using differently, and libsqlite3-sys bundles SQLite\nitself, so a bump changes the engine that has to honour `immutable=1`.\nThe rpm_db_uri unit tests only assert string construction and could not\ncatch a behavioural change there. Verified live as an unprivileged user:\nPackages: 2509, unchanged.\n\nretch-cli -> 0.6.19; retch-sysinfo unchanged at 0.1.53 (no source\nchange, only its transitive lockfile deps moved).\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T18:52:53-07:00",
          "tree_id": "0f8eb7815bf12c631f95919caaeb1e89e3549096",
          "url": "https://github.com/l1a/retch/commit/9d27af8746fe0e349822f3272031e94e03589b50"
        },
        "date": 1786500012480,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 695190513.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2183.2279393533254,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 116.92736322047861,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.0492904983445985,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.8643620417342,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21196.611513562682,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 211199.66015548204,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14714.840350909624,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14825.287989906885,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1525928.1454956909,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 358.82359444232935,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 284.58956625533114,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbd76828105384492815f283cc8351f68368cb56",
          "message": "Fix nushell completion path; adopt shared helpers (#191)\n\ninstall_completions.py wrote nushell completions to\n$XDG_CONFIG_HOME/nushell/autoload. On Windows\n$nu.user-autoload-dirs is exactly %APPDATA%\\nushell\\autoload and\nnushell never reads the XDG path, so the helper wrote a real file\nsomewhere nothing consults, printed the path, and delivered nothing.\n\nTwo more defects in the same helper: it logged a generation failure\nto stderr, continued, and then printed \"Installed completions for\nretch:\" unconditionally -- success reported over work not done; and\nnothing checked whether zsh would ever load the file (it reads only\ndirectories on fpath, and site-functions is not on it by default).\nIt now checks, via an INTERACTIVE zsh, since a non-interactive one\nreports the built-in default.\n\nThis repo's MECHANISM was right and is now the standard. v0.6.16\nmoved these recipes to Python so they run natively on Windows\nwithout Git's usr\\bin; rusticprofile first proposed replacing them\nwith sh recipes because it held the correctness fixes, which would\nhave regressed that work in the name of consistency. Each repo had\nsolved half the problem.\n\ninstall_completions.py and install_man.py are now vendored\nbyte-identically across retch, rusticprofile and etr, with\ntemplates/justfile-common.just as the Justfile block reference.\nstandard-check runs their self-tests -- not a text diff, since\nseparate repos cannot diff each other's files and a diff would pass\non a repo that never adopted the standard -- and check depends on it.\n\nAlso adds install-tag VERSION, which installs a released tag with\nbinary, completions (from the INSTALLED binary) and man page (from\nthe tag) so the three cannot disagree.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T17:11:38-07:00",
          "tree_id": "52f09d8ff2178e92d32e22dc2177be6643ec678b",
          "url": "https://github.com/l1a/retch/commit/fbd76828105384492815f283cc8351f68368cb56"
        },
        "date": 1786580350782,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1172894366.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2108.7880246463287,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.470137334335,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.809011005627657,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.26277109538512,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18128.28500395336,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 192458.34546000563,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12908.614540275774,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13001.628947578463,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1405929.3115013181,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 362.04156731307404,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.83665275283477,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1b99674ea9eded99c6558e78098409ebe6a78ac",
          "message": "Make the pre-PR gate answerable; open-pr now pushes (#192)\n\n* Make the pre-PR gate answerable; open-pr now pushes\n\njust pr ended in a bare read, so only a human at a terminal could\nanswer it -- a script or agent blocked on a stdin that would never\nanswer, or died without saying why, and that reads as the gate refusing\nthe change. It now accepts PR_CONFIRM, an interactive stdin, or piped\ninput under a timeout, and names PR_CONFIRM when it cannot be answered.\nNot a bypass: every path still requires an explicit y.\n\njust open-pr did not push, so on a never-pushed branch it printed\n\"Gate passed\" and then failed because gh pr create had no remote\nbranch to open from. It now pushes only when there is no upstream --\npushing unconditionally would silently publish existing commits on a\nbranch that already has one. pre-push still runs just check, so the\npush is inside the gate rather than around it.\n\nBoth are rusticprofile's 0.0.21 and 0.2.12, which retch never received.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:24:18-07:00",
          "tree_id": "7307c8c54022ab27b0b3e8ecfeab8995613e25ea",
          "url": "https://github.com/l1a/retch/commit/c1b99674ea9eded99c6558e78098409ebe6a78ac"
        },
        "date": 1786591982355,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 955637063.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2096.905189128434,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.71810086785024,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.830119871329988,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.581418460367594,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18157.988982185067,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189415.39928514228,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12787.565993268636,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12922.301398555708,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1409531.1350929907,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 368.65529591675556,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.75690033645907,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6",
          "message": "Let the manual Claude review actually run (#193)\n\n* Let the manual Claude review actually run\n\nv0.6.17 disabled automatic review by commenting out the pull_request\ntrigger AND setting if: false on the job. The trigger alone already did\nthat, so the guard added nothing -- but it also applied to\nworkflow_dispatch, which was kept. So gh workflow run started a run,\nskipped the job, and reported SUCCESS having reviewed nothing.\n\nA green run that did nothing is the failure this repo's tooling exists\nto refuse, and the one rusticprofile recorded twice about this action.\nDispatch available but silently inert is worse than working or absent.\n\nAutomatic review stays OFF -- only the job guard is removed; the\npull_request trigger is still commented immediately above it.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:45:42-07:00",
          "tree_id": "a129dbfd95e55ff45255a019bb60311bdfcf5738",
          "url": "https://github.com/l1a/retch/commit/e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6"
        },
        "date": 1786593185183,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 917094157.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 886.6489821139821,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 88.7488263278797,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.239368727130374,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 50.62503976185153,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7533.64805579747,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 72312.94706870694,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 48196.81972282771,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 48916.03667002529,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1348979.272942002,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 317.77799159225253,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 222.70155019412908,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a",
          "message": "Gate merge-pr on CI; bring the triad under standard-check (#194)\n\n* Gate merge-pr on CI; check the triad\n\nmerge-pr went straight from the branch check to gh pr merge --squash\n--delete-branch, with no inspection of the status rollup. gh pr merge\nhappily merges a red PR when there is no branch protection, so every\nmerge in this repo has been ungated -- safe only because whoever merged\nhappened to look first.\n\nrusticprofile added this in v0.1.5 after a PR went in with a leg red,\nand extended it in 0.2.1 after an EMPTY rollup passed vacuously.\nNeither reached here.\n\nThree refusals now: a failing check, an empty rollup, and checks still\nrunning. The empty state is compared as a string rather than via jq -e\nlength, because an external jq is not on a default Windows PATH and a\ngate that degrades where its dependency is missing is the thing being\nfixed.\n\ngate_conformance.py (template v3) is vendored and run by\nstandard-check, so the guards cannot vanish again. It is structural,\nnot behavioural, and says so.\n\nVerified safely: on a branch with no PR the rollup is empty, so\nmerge-pr refuses before reaching gh pr merge.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T21:18:47-07:00",
          "tree_id": "09cf28f2dd68d69de2931ed6e287f3ca4b42fd13",
          "url": "https://github.com/l1a/retch/commit/25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a"
        },
        "date": 1786595190433,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 948729855.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2103.561081664461,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.57969361789625,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.843811534873547,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.83640219021432,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18404.548710165098,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189906.04788956908,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12881.110104820451,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13020.724451935715,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1403096.5473392033,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 367.17412310963306,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.60781267792464,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "120ed8e2e0fe45a624212a8204ae34b082b8c360",
          "message": "Add keyboard, mouse and tpm fields (#195)\n\n* Add keyboard, mouse and tpm fields\n\nThree NOTES.md section 6 fastfetch-gap fields, all --long and above,\nLinux-only, in the v0.5.0 shape: thin /proc and sysfs readers over pure\nhelpers that unit-test without touching host hardware.\n\nInput classification is exclusive and declines to guess. On a Logitech\nUnifying/Bolt receiver no kernel-visible signal separates a keyboard from\na mouse: handlers, capabilities/rel (0x1943 on both), the alphabet key\nblock, INPUT_PROP, udev ID_INPUT_* (POINTINGSTICK on both), USB HID\nbInterfaceProtocol and the HID report descriptor itself are all identical\nfor an MX Keys and an MX Master 3. fastfetch 2.66 gets this wrong in both\ndirections on that hardware. Ambiguous devices are resolved via the HID++\ndriver's battery model_name and, failing that, reported in neither field\nrather than asserted into the wrong one.\n\ntpm reads tpm_version_major and maps it to the published spec names\n(1 -> 1.2, 2 -> 2.0), returning None for anything unrecognised.\n\nAlso refresh packaging/aur/PKGBUILD, stranded at 0.6.12 for eleven\nreleases while the AUR moved to 0.6.23, and drop its man-page\nregeneration: the font-strip sed never matched on any platform (GNU sed\nreads \\\\f as a form feed) and $DATE/$pkgver were literal inside double\nquotes, so the installed footer read \"retch $pkgver\". The committed\ndocs/retch.1 ships in the tarball with the correct footer, so package()\ninstalls it directly and the mandown makedepend is gone.\n\nStrata golden counts move Long 49->52, Full 55->58. 11 new unit tests.\nVerified live on corrino (Fedora 44, i7-1360P).\n\nAssisted-By: Claude Opus 5\n\n* Close two holes in the aur CI job\n\nThe job rewrote source= and sha256sums= to build from local sources, so the\ndeclared checksum was never checked by anything — a stale one (as this\nPKGBUILD carried for eleven releases) stayed green and would only fail for\nsomeone installing from the AUR. Verify it against the real tag tarball\nbefore that patching, refusing a committed SKIP and skipping cleanly when the\ntag is not published yet.\n\nNothing inspected the packaged man page either, which is where both defects\nthis branch fixes actually showed. Assert the built package's .TH line carries\nno literal $ and a real retch <version> footer, and that no doubled font runs\nsurvive.\n\nAlso stop pre-installing mandown, so makedepends is load-bearing: makepkg -s\ninstalls what the PKGBUILD declares and nothing else.\n\nAssisted-By: Claude Opus 5\n\n* Fix the man-page check failing on a correct package\n\nThe new verification step used `bsdtar -tf \"$pkg\" | grep -qx …` under\n`set -o pipefail`. grep -q exits on its first match, bsdtar takes SIGPIPE and\nexits 141, and pipefail turns that into a failed pipeline — so the step\nreported the man page missing exactly when it was present, and CI went red on\na package that was correct. head -1 and grep -m1 carry the same hazard.\n\nMaterialise the listing and the page to files and grep those; select the\npackage with find -print -quit. Verified against a good package and against\npurpose-built broken ones (missing page, literal $ footer, doubled font runs).\n\nAssisted-By: Claude Opus 5\n\n* Match the gzipped man page makepkg actually ships\n\nmakepkg's zipman option is on by default, so the packaged path is\nusr/share/man/man1/retch.1.gz. The verification step looked for retch.1 and\nreported it missing — the check wrong again, the package correct again.\n\nMatch retch.1 with an optional .gz/.zst/.xz/.bz2 suffix and decompress before\ninspecting. Tested against gzipped, uncompressed, and gzipped-but-broken\npackages.\n\nThe diagnostic added in the previous commit is what made this cheap: printing\nthe real usr/share listing on failure named retch.1.gz directly in the CI log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T09:49:12-07:00",
          "tree_id": "274aff11102cf1108fb49cbe2f4d8beedda7b477",
          "url": "https://github.com/l1a/retch/commit/120ed8e2e0fe45a624212a8204ae34b082b8c360"
        },
        "date": 1786726544129,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 902692411.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1460.4988948441871,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.07002507122179,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.0450142318817894,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 31.38914250163821,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 13825.61665315979,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 151064.65911002425,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10257.180600035736,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 10581.73521290539,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1001029.1175243702,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 187.37349756855312,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 144.4363220090389,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0fb38978e0182c24717fea4d8b4a80047b15d233",
          "message": "Make packaging/aur the source, not a stale copy (#196)\n\npackaging/aur/PKGBUILD was a reference copy that nothing rendered, published or\nchecked. It reached eleven releases of lag (0.6.12 in-repo against 0.6.23\npublished), and because the copy was inert the live AUR PKGBUILD kept two\nman-page defects long after they were fixed here — Arch installs got a page\nfooted $DATE / retch $pkgver the whole time.\n\npackaging/aur is now the source. aur-bump renders it from a released tag,\naur-publish pushes exactly those files, and .SRCINFO is tracked and generated\nby a real makepkg --printsrcinfo in a container (no host here runs Arch).\nCarried over from rusticprofile: write to a temp file and move it into place so\na failure cannot truncate the committed file, check the output content rather\nthan the exit code, and mount :z never :Z.\n\nscripts/aur_check.py is the anti-drift guard and just check depends on it. It\ncompares the pair field-by-field including the expanded source URL, so it\ncatches a pair that agrees on the version and disagrees on the checksum — the\nshape that breaks on the user's machine and nowhere else. Pure Python, so it\nruns on Windows; parses rather than sourcing the PKGBUILD, and raises rather\nthan expanding unknown variables to empty.\n\nVerified end to end: the generated .SRCINFO came out byte-identical to the one\nhand-written and pushed to the AUR earlier today, and AUR_CONFIRM=n\njust aur-publish exercised every preflight check without publishing.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T10:43:28-07:00",
          "tree_id": "0dcac6b08b8ab4bb34654fbcf6096f083db1f748",
          "url": "https://github.com/l1a/retch/commit/0fb38978e0182c24717fea4d8b4a80047b15d233"
        },
        "date": 1786729853411,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 881861162.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1084.388905534311,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.347779770126,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.395098948347644,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.501193739768894,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8904.672466308128,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 84499.63323353816,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 57452.70608883365,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 58216.501703516624,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1474295.0700819795,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.44541400282776,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 275.90373519012115,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9b8bcc71daafe3d38abb8ba9085195eef680d68f",
          "message": "Native Media and Player Detection (#197)\n\n* Add native media and player detection fields\n\nImplement 100% native FFI / direct socket media and player detection with zero subprocess forks across Windows (WinRT COM GlobalSystemMediaTransportControlsSessionManager via combase.dll), Linux (direct Unix domain socket D-Bus MPRIS client), and macOS (Objective-C runtime SBApplication FFI).\n\nAdds 'player' and 'media' to FIELDS registry (Mode::Long, available in --long and --full). Strata golden counts Long 52 -> 54, Full 58 -> 60. Regenerated man page, updated README.md, docs/retch.1.md, NOTES.md, WIP.md, and GitHub wiki.\n\nAssisted-By: Gemini 2.5 Flash\n\n* Fix Rust 1.97 Clippy lints in media.rs\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:19:02-07:00",
          "tree_id": "5f6c7da98e5d1a0862003b59cc74c4130d097866",
          "url": "https://github.com/l1a/retch/commit/9b8bcc71daafe3d38abb8ba9085195eef680d68f"
        },
        "date": 1786933594725,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1327496693.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2075.3770927610867,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 120.48924613673125,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.829726020503113,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.62941956243287,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17963.09256982017,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 188441.06633459774,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12768.824666027982,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12888.672474670644,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1463009.5441360096,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 370.23567920966656,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 291.36373567222455,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ed45ec18928bf19b4add811c3f8a567211932073",
          "message": "Add README and crate metadata for retch-sysinfo (#198)\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:39:49-07:00",
          "tree_id": "13cd0a580de7afdb2209726aa2a026b4079579a6",
          "url": "https://github.com/l1a/retch/commit/ed45ec18928bf19b4add811c3f8a567211932073"
        },
        "date": 1786934790890,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1067520205.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1456.4430928350353,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.566728376448395,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.163918543751712,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 29.282543130215156,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 14598.855694568507,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 155528.70636760193,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10622.095923601802,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 10722.71406230977,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1003648.2409981198,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 175.19226179299784,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 146.73198498373125,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "f75989c777d19ce11a71c02c17a50e959cdb94cb",
          "message": "aur: bump to 0.8.0\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:47:18-07:00",
          "tree_id": "6e84e4f067d36b437236a783f86e1b1b04a441ca",
          "url": "https://github.com/l1a/retch/commit/f75989c777d19ce11a71c02c17a50e959cdb94cb"
        },
        "date": 1786935352212,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 853141676.65,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2097.2845713017637,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.99698674381666,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.84708776398801,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.98325782323853,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17988.834176007025,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189017.60838045116,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12860.765954902772,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12947.25381536573,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1476376.608658257,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 370.16118660302914,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 288.9300525171577,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e42fb854db13c202146dc739849f67429547ebf9",
          "message": "deps: bump dependencies (consolidate #199) (#200)\n\nConsolidate Dependabot PR #199:\n- clap_complete_nushell 4.6.1 -> 4.6.2\n- icy_sixel 0.5.0 -> 0.5.1\n- Cargo.lock transitive dependency updates\n- Bump retch-cli to 0.8.1 and regenerate man page\n\nAssisted-By: Gemini 3.7 Flash",
          "timestamp": "2026-08-21T15:33:39-07:00",
          "tree_id": "f4dea1009382aed406875e53dbf14115c540f5df",
          "url": "https://github.com/l1a/retch/commit/e42fb854db13c202146dc739849f67429547ebf9"
        },
        "date": 1787352048580,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 669080921.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2213.4115637611076,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 114.69699057787531,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.040670383812744,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.298005691247475,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21356.956134194712,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 210458.02012249408,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14699.586226359737,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14945.800065156149,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1525326.9951503843,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 364.75062743743314,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 277.5295069492394,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2b80c74b321872317f495009db27eddb70dcfe58",
          "message": "Add Desktop & UI detection probes (#201)\n\n* Add Desktop & UI detection probes\n\nImplement zero-subprocess desktop and UI detection probes:\n- WM Theme (wm-theme): KWin, Xfwm4, Openbox, Fluxbox, IceWM, GTK, Aqua, Windows.\n- Wallpaper (wallpaper): GNOME, KDE Plasma, XFCE, Hyprpaper, Sway, Feh, Nitrogen, macOS AppKit FFI, Windows registry FFI.\n- Terminal Theme (terminal-theme): Kitty, Alacritty, WezTerm, Foot, Windows Terminal, Konsole, Ptyxis, iTerm2, Apple Terminal.\n- Register fields under FIELDS (Mode::Full), update man page, README, NOTES, and wiki.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix cross-platform parser visibility on macOS/Win\n\nEnsure pure theme and terminal parser functions are available across all\ntarget platforms without cfg gating or dead-code warnings.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Make parse_ini_key available across all targets\n\nRemove target_os = \"linux\" gate from parse_ini_key so unit tests pass\non macOS and Windows.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Make all pure terminal parsers available on Win\n\nRemove target_os cfgs from parse_kitty_theme and other terminal parsers\nso they are unconditionally available on Windows.\n\nAssisted-By: Gemini 3.5 Flash\n\n* Fix macOS wallpaper Obj-C FFI ABI & AppKit link\n\nAdd AppKit framework link in build.rs and use non-variadic objc_msgSend\ndeclaration (objc_msgSend_id_id) for desktopImageURLForScreen to prevent\nABI misalignments on aarch64 Apple Darwin.\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-08-21T22:41:46-07:00",
          "tree_id": "a4206d6e867d2fd2e324cf08f590848666fb1316",
          "url": "https://github.com/l1a/retch/commit/2b80c74b321872317f495009db27eddb70dcfe58"
        },
        "date": 1787377805873,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 737973815,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1688.856083286558,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 90.46265008598306,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.908710893496022,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.92465492021441,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16210.284639433148,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 163317.8895155585,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11413.247379017692,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 11578.57547181532,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1175261.8924606033,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 292.39902814728197,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 215.034835945383,
            "unit": "ns"
          }
        ]
      }
    ],
    "Linux Arm64 Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7a3b029a318196f57111112492235841e6692d8c",
          "message": "Reword WIP resetâ†’update, rename wip script (#141)\n\nWIP.md is an ongoing rolling log, not reset per-PR. Align the docs and\ntooling with that: AGENTS.md Â§5 and the just merge-pr recipe now say\n\"update\" instead of \"reset\", and scripts/reset_wip.py is renamed to\nscripts/update_wip.py (git mv; behavior unchanged â€” it still only\nrewrites the Active-Branch and latest-commit lines).\n\nAlso folds in the NOTES.md Â§5 \"real hardware benchmark section\" backlog\nitem. Docs/tooling only; no Rust source touched.\n\nVersion bumped 0.3.40 â†’ 0.3.41 (patch); man page + Cargo.lock regenerated.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:14:33-07:00",
          "tree_id": "3985c178b81541f77e250902c4997776fb98a214",
          "url": "https://github.com/l1a/retch/commit/7a3b029a318196f57111112492235841e6692d8c"
        },
        "date": 1783733265313,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 785441009.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 999.7046711830186,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.35398361448982,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946769100150491,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.083669428274064,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7895.004074971634,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71747.79503704692,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4833.621376089666,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4945.239421426263,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1204980.296240997,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 337.09832453488985,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 259.2980896595892,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2",
          "message": "Fix update_wip.py stale-pointer regex + UTF-8 (#142)\n\nThe post-merge WIP updater matched an obsolete \"**Latest commit on\nmain**:\" line that no longer exists, so the substitution silently\nno-op'd and left \"**main HEAD**:\" stale after every `just merge-pr`\n(seen live after #141). Retarget the regex to \"**main HEAD**:\", rewrite\nin the current format (`<hash>` â€” <subject> â€” **v<version>**) with the\nversion read from Cargo.toml, using a function replacement so metachars\nin the subject are literal.\n\nSince the fix now writes the commit subject into WIP.md, and this repo's\nsubjects contain \"â†’\"/em-dashes, pin UTF-8 on read_text/write_text,\nsubprocess decoding, and stdout â€” otherwise cp1252 (the default Windows\nconsole/locale where merge-pr runs) crashes the script. Verified\nend-to-end against a subject containing \"â†’\".\n\nAlso gitignore __pycache__/*.pyc.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:31:45-07:00",
          "tree_id": "2db4346561186354ab7202a4b36fa637426c79f1",
          "url": "https://github.com/l1a/retch/commit/fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2"
        },
        "date": 1783734374192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1219741372.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1008.0852095403355,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.56926383213533,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469645469625965,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.37767400368315,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7950.449312969485,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71776.73413796164,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4880.261566744561,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4965.797002451786,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1218653.2104666657,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.34359233620376,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 280.4910992911331,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9f639d38da27f892e183f9fa1e0f77d57cdfdcad",
          "message": "update_wip.py: bound subs with count=1 (#143)\n\nFollow-up to #142. The retargeted `**main HEAD**:` regex had no count,\nso it rewrote every line containing the header string â€” and WIP.md's\nopen-task prose mentions it verbatim, so the #142 merge clobbered those\ntask lines. Pass count=1 to both re.sub calls (Active-Branch and\nmain-HEAD) so only the first top-of-file header occurrence is rewritten.\nVerified end-to-end against a sample with the header in both a header\nline and later prose.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:05:40-07:00",
          "tree_id": "e1d68a1f542a32e88f5f5adaece7b1b06c929de4",
          "url": "https://github.com/l1a/retch/commit/9f639d38da27f892e183f9fa1e0f77d57cdfdcad"
        },
        "date": 1783740024798,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 767111503.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 992.7069951331381,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.66680232310023,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469726702787113,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.92093949883008,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7813.749494332398,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70558.60474696374,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4780.121041887973,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4877.990173263925,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1205157.8095299557,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.5069301430261,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 275.98573734527565,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab",
          "message": "Drop PowerShell spawn in Windows net detection (#144)\n\ndetect_active_interface_and_local_ip shelled out to PowerShell\n(Get-NetRoute) on Windows to name the default-route interface. That\nspawn costs ~977ms (PowerShell startup) and, since the `net` field is in\nevery mode, dominated runtime â€” `retch --short` was ~1.15s, ~11x over\nits <100ms target and ~20x slower than fastfetch.\n\nDerive the active interface instead from the adapter whose\nsysinfo-reported IPs include the outbound local_ip (already resolved via\nthe UDP-connect trick) â€” no spawn, no new dependency, no FFI. Extracted\na pure match_active_interface helper with a unit test. Resolves to the\nsame interface as before (verified on Windows).\n\nMeasured (AMD Ryzen AI MAX+ 395, Win 11): --short 1149ms -> 163ms (~7x).\nretch-sysinfo bumped 0.1.33 -> 0.1.34 (library behavior change).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:42:31-07:00",
          "tree_id": "e39a81d2e6892fa08bbcacc34138d13dd5af8989",
          "url": "https://github.com/l1a/retch/commit/cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab"
        },
        "date": 1783742192937,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 907663825.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 999.2419776843808,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.67406202354221,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468922643165625,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.501573228405526,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7894.878567149838,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71801.04380157226,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4841.430704259407,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4954.254375386765,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1205345.2010010474,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 337.09098522233273,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.9278005671328,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "18f0bfa4e337d9a815662b1383dab85187e1ac5c",
          "message": "Fix bench-cli/bench-compare on Windows (#145)\n\nThe bench recipes passed a POSIX-style './target/release/retch' to\nhyperfine. With no --shell, hyperfine uses cmd.exe on Windows, which\ncan't execute that path (forward slashes, no .exe), so it exited 1 in\nthe first warmup run and aborted the recipe. retch itself was fine and\n`just bench` (criterion) was unaffected.\n\nAdd an os_family()-selected `retch_release_bin` variable\n('target\\release\\retch.exe' on Windows, './target/release/retch'\nelsewhere) and route all bench hyperfine calls through it. Verified both\nrecipes now run to completion on Windows.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T21:26:47-07:00",
          "tree_id": "b2195da8db613809ef3a732f524156e3dd175501",
          "url": "https://github.com/l1a/retch/commit/18f0bfa4e337d9a815662b1383dab85187e1ac5c"
        },
        "date": 1783744840673,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 732760135.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1005.3030892778188,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.40273819194639,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946839522528685,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.11620100935438,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7851.213387258106,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 72273.85376137377,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4865.407926271033,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4980.653163698652,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1217940.804884902,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.53541391414785,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.7262428043947,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c57409d318756bf9bf92ee798f438e2c2e4747fd",
          "message": "Use native Win32 IOCTLs for Windows phys-disk (#146)\n\nReplace the Get-PhysicalDisk PowerShell spawn (~1.7s of interpreter\nstartup) in retch-sysinfo's Windows physical-disk detection with direct\nstorage IOCTLs over \\.\\PhysicalDriveN, via hand-written extern \"system\"\nFFI matching the crate's existing style (win_reg.rs) — no new dependency.\n\nEach drive is opened with zero desired access and only FILE_ANY_ACCESS\nquery IOCTLs are used (IOCTL_STORAGE_QUERY_PROPERTY for model/bus type +\nseek penalty, IOCTL_DISK_GET_DRIVE_GEOMETRY_EX for size), so no elevation\nis required. Classification and label format are unchanged; the model\nstring reproduces Get-PhysicalDisk's FriendlyName. Verified byte-identical\noutput; --fields phys-disk ~1684ms -> ~210ms on an AMD Ryzen AI MAX+ 395.\n\nAlso fix a gate/CI blind spot found while verifying this: a bare\n`cargo test`/`cargo clippy` at the workspace root only covers retch-cli\nand silently skips the retch-sysinfo member (where this change lives).\nThe just recipes (test/lint/check + the pr steps) and both rust.yml CI\njobs now pass --workspace; AGENTS.md 4.0/4.1 document why.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T12:51:19-07:00",
          "tree_id": "02202ebbc2cd99020a9d56bc36db81f79b1aa906",
          "url": "https://github.com/l1a/retch/commit/c57409d318756bf9bf92ee798f438e2c2e4747fd"
        },
        "date": 1783800318899,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 890069618.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1000.9924456408396,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 50.007176574112606,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9464035995473123,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.0797917797363,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7841.532835421854,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71704.58525230746,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4813.576345565967,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4957.45007987855,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1196284.4023272095,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.66808682865053,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 278.86370933627643,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e7427ff1a1011473cda36ef463893d8a10dea342",
          "message": "Read SMBIOS natively for Windows phys-mem (#147)\n\n* Read SMBIOS natively for Windows phys-mem\n\nReplace the two Get-CimInstance Win32_PhysicalMemory / Win32_ComputerSystem\nPowerShell spawns (~600 ms) with GetSystemFirmwareTable('RSMB') (kernel32),\nparsing SMBIOS type-17 (Memory Device) structures directly, plus\nGlobalMemoryStatusEx as the VM total-memory fallback. Hand-written\nextern \"system\" FFI matching win_reg.rs — no new dependency.\n\nA pure parse_smbios_type17 fn does a bounds-checked walk of the structure\ntable (formatted area + double-null-terminated string set) and carries the\nunit tests. Now also surfaces the SMBIOS Configured Memory Speed field\n(offset 0x20), so Windows shows running-vs-rated speed when they differ\n(e.g. \"8x 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)\"), matching Linux; the\nold WMI path only reported the rated speed.\n\n--fields phys-mem ~597ms -> ~152ms on an AMD Ryzen AI MAX+ 395; output\nverified against Get-CimInstance Win32_PhysicalMemory.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix clippy byte-str lint on RSMB signature\n\nRust 1.97's clippy flags `[b'R', b'S', b'M', b'B']` (can be a byte str).\nUse `*b\"RSMB\"` instead. Local toolchain was 1.96 so `just check` passed\nlocally but CI (1.97) failed clippy; bumped local toolchain to match.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T13:32:19-07:00",
          "tree_id": "dde402b0cc3e8c191c71996d19858d5d403cf3b0",
          "url": "https://github.com/l1a/retch/commit/e7427ff1a1011473cda36ef463893d8a10dea342"
        },
        "date": 1783802842205,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 749321143.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 998.1920502201414,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.5013514118475,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946724599462981,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.4204090014682,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7866.470113342037,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71511.93782995596,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4858.8149498792945,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4959.035053499031,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1198420.3017554204,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.32581717723616,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.39702075805116,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36888f89870197b2e040c9178970859ffc467c42",
          "message": "Detect Windows bluetooth natively (bthprops) (#148)\n\nReplace the PowerShell spawn (Get-Service bthserv + two Get-PnpDevice\n-Class Bluetooth queries, ~1.8s) with native Win32:\n- power state from the bthserv service via the Service Control Manager\n  (advapi32),\n- adapter hardware name via SetupAPI enumeration of the Bluetooth device\n  class (links setupapi),\n- connected devices via the classic bthprops API (BluetoothFindFirstDevice\n  with fReturnConnected; links bthprops).\n\nHand-written extern \"system\" FFI, no WinRT and no binding crate. The\ndevice-info struct layout was validated at runtime before trusting the\ncount. A pure format_windows_bluetooth fn carries the unit tests.\n\nBehavior change: \"N connected\" now counts actually-connected devices\nrather than the old count of all paired/present Bluetooth PnP nodes (which\nthe old code mislabeled as connected). Adapter name unchanged. On an AMD\nRyzen AI MAX+ 395: --fields bluetooth ~1765ms -> ~150ms; --long 3462 ->\n2934ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:06:28-07:00",
          "tree_id": "ad23df51a0dfa2097d5eeb928be7307ad5c07e92",
          "url": "https://github.com/l1a/retch/commit/36888f89870197b2e040c9178970859ffc467c42"
        },
        "date": 1783812011094,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 696383803.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 997.2823101633423,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.37254193215877,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946864770187557,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.50564527468173,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7866.132875244165,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70465.66429791003,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4824.503505143566,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4893.119822630225,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1197475.3722589775,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.0089978240321,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.84910836991634,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dfa18d3ba7b91698f61b34f76aaf85b3bd479271",
          "message": "Drop serial CPU-usage sleep on Windows (#149)\n\nCPU usage needs a delta between two samples. sysinfo enforces a ~200ms\nminimum interval, so collect() slept 200ms then refreshed — and that\nsleep ran serially AFTER the concurrent probe scope, adding ~200ms to\nevery standard/long run.\n\nOn Windows, sample GetSystemTimes (kernel32) just before the scope and\ndiff against a fresh sample at the usage-computation point: the existing\ncollection window is the delta, so no dedicated sleep is added. A ~100ms\nfloor is topped up only when the window is shorter (e.g. an isolated\n`--fields cpu-usage`) so a tiny request reads a real value instead of\nGetSystemTimes quantization noise. A pure usage_percent helper carries\nunit tests. Linux/macOS keep the sysinfo+sleep path (its min interval\nmakes the window-diff unreliable there).\n\nOn an AMD Ryzen AI MAX+ 395: standard mode 1757ms -> 1558ms; isolated\n--fields cpu-usage ~340ms -> ~253ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:26:38-07:00",
          "tree_id": "ff94a5086c547509df94d6fc37722dd5e6667f45",
          "url": "https://github.com/l1a/retch/commit/dfa18d3ba7b91698f61b34f76aaf85b3bd479271"
        },
        "date": 1783813250838,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1017206197.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 990.7978106825118,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.6054842108477,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470961560901943,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.01587315345317,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7861.008440078605,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70927.20527961999,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4829.254857577635,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4947.175312813653,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1205964.0250664887,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.29768116871475,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.01210222117027,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cae94eb0c09e6b2f4675d84cbd239d3ed13b6926",
          "message": "Detect Windows camera natively (SetupAPI) (#150)\n\nReplace the camera PowerShell spawn (Get-PnpDevice -Class Camera,Image\n-PresentOnly, ~1.36s) with a new shared win_setupapi module that enumerates\npresent devices in a setup class via SetupDiGetClassDevsW +\nSetupDiGetDeviceRegistryPropertyW (links setupapi) — the native equivalent\nof Get-PnpDevice -PresentOnly. Camera enumerates the Camera and Image\nclasses and reuses the existing is_real_camera / clean_camera_name / dedup\nlogic. bluetooth (which introduced a private SetupAPI copy) is refactored\nonto the shared module, removing the duplication (mirrors win_reg.rs).\n\nHand-written extern \"system\" FFI, no binding crate. Verified against\nGet-PnpDevice (all real cameras; IR camera filtered as before); bluetooth\nadapter name unchanged after the refactor.\n\nCamera was the last standard-mode PowerShell pole, so this completes the\nWindows native-FFI migration: on an AMD Ryzen AI MAX+ 395, --fields camera\n~1359ms -> ~155ms and standard mode 1558ms -> 273ms. retch now beats\nfastfetch in standard mode (273 vs 1348ms) and is at parity in --long.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:26:15-07:00",
          "tree_id": "dc9eca701a17186aff929c1b979a8956c13aed61",
          "url": "https://github.com/l1a/retch/commit/cae94eb0c09e6b2f4675d84cbd239d3ed13b6926"
        },
        "date": 1783834819598,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 869581909,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1009.2072873178738,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.46998554385271,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947178460236855,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.638975529003254,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7879.473678117602,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71571.16739023883,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4869.327232870799,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4952.286666279052,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1209452.5759490135,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.38036082458785,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 275.8761530661028,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ae3ecffd014bc206189c58e5b613f8ff4e0b66d",
          "message": "Add FFI struct-layout assertion tests (#151)\n\nFollowing the Windows native-FFI migration (#146-#150), the pure parsers\nare well unit-tested but the #[repr(C)] FFI structs the OS reads/writes by\noffset were only runtime-verified. Add size_of + targeted offset_of!\nassertions for each: disk (StoragePropertyQuery, StorageDeviceDescriptor\nincl. bus_type/vendor/product offsets, DeviceSeekPenaltyDescriptor,\nDiskGeometryEx incl. disk_size), memory (MemoryStatusEx), bluetooth\n(ServiceStatus, DeviceSearchParams, SystemTime, DeviceInfo incl.\nf_connected/sz_name), fetch (win_cpu::FileTime), win_setupapi\n(SpDevinfoData, already present).\n\nThese catch accidental field-reorder/padding regressions at test time —\nthe failure mode the parse tests can't (the phys-mem 0x14->0x15 offset bug\nin #147 was found only by runtime comparison). Test-only, no runtime\nchange; runs on Windows CI since the structs are cfg(windows).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:52:26-07:00",
          "tree_id": "1d42a683cfb643a99870fca57f865d9e88b409e0",
          "url": "https://github.com/l1a/retch/commit/2ae3ecffd014bc206189c58e5b613f8ff4e0b66d"
        },
        "date": 1783836415294,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1016981365.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 997.0554036600028,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 49.83124027615424,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9465795039474334,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.0150051707953,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7903.721637932291,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71561.0548765056,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4874.244965681932,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4963.758800325468,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1213941.5711900967,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 335.1061809523393,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 267.5821614190339,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "744c0dcd3c15ea67803948e0372c5229715b4783",
          "message": "Fix upload_local_bench.py cp1252 crash on Windows (#152)\n\njust bench-upload and the post-merge hook crashed on Windows with\nUnicodeDecodeError: 'charmap' codec can't decode byte 0x9d — so no local\nWindows \"real hardware\" numbers reached the gh-pages benchmark dashboard.\nThe gh-pages data.js is UTF-8 (commit messages embed arrow/em-dash chars)\nbut open() used the default cp1252 encoding on Windows.\n\nPin encoding=\"utf-8\" on every file operation (data.js read + write, the\nhyperfine JSON temp read) and on run_capture's subprocess text decoding\n(git log --format=%B), plus a sys.stdout.reconfigure UTF-8 guard. Same fix\nclass as scripts/update_wip.py (#142).\n\nVerified: the crash reproduces on the live data.js under the default\nencoding; the UTF-8 read succeeds (845 KB) and append_entry /\ngit_commit_info run without error.\n\nTooling-only; no Rust source touched, retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:01:43-07:00",
          "tree_id": "d579527f5693db2e5215b8c7e6ddfa52671a60fd",
          "url": "https://github.com/l1a/retch/commit/744c0dcd3c15ea67803948e0372c5229715b4783"
        },
        "date": 1783865759040,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 760604107.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 996.9802616317453,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 49.7920239997272,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468033234484916,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.02667365884004,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7837.546196654488,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70956.85654175258,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4782.611545344205,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4882.818625099515,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1210418.2625502287,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.63752474026677,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 263.3329322724197,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6c384b96645a8d096e3c0f7a55be58958363939a",
          "message": "Bump version to 0.4.0 (milestone release) (#153)\n\nMinor version bump (0.3.52 -> 0.4.0) marking the completed Windows\nnative-FFI migration and the first GitHub Release since v0.3.40 (rolls up\n#141-#152). Version-marker only — no code change; retch-sysinfo stays at\n0.1.40 and crates.io remains intentionally held.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:46:27-07:00",
          "tree_id": "53e438ffe42566998097d0bc24ec6bd506b380bf",
          "url": "https://github.com/l1a/retch/commit/6c384b96645a8d096e3c0f7a55be58958363939a"
        },
        "date": 1783868416871,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 764257319.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 997.7950103265233,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 49.78623055117276,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946455651077133,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.28825930953259,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7710.89906559035,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69984.31302505119,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4746.055664316113,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4900.401255132622,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1193558.083331915,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.6420983658679,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 271.77215174508717,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88162b293638dfad573a4b63f046cd27aca023f4",
          "message": "Bump to 0.4.1; fix license SPDX for crates.io (#154)\n\nCorrect the deprecated `license = \"GPL-3.0\"` to `GPL-3.0-or-later` in both\ncrate manifests (matching the SPDX-License-Identifier headers in the\nsource) ahead of publishing to crates.io, where per-version license\nmetadata is permanent.\n\nBump retch-cli 0.4.0 -> 0.4.1 and retch-sysinfo 0.1.40 -> 0.1.41 (v0.4.0\nis already tagged, so the license fix requires a new version). No\nfunctional code change. This is the version published to crates.io,\nreversing the prior GitHub-Release-only hold.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T08:27:56-07:00",
          "tree_id": "20fc220a727f5d7f59bb468da3002cf8631afc81",
          "url": "https://github.com/l1a/retch/commit/88162b293638dfad573a4b63f046cd27aca023f4"
        },
        "date": 1783870918022,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 757938029,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1002.1667740537757,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.35678232759617,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467155676312418,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.252631032545374,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7892.781434750284,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71258.28555687043,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4843.918943427719,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4936.561871165844,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1210697.0589131787,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.8863356369337,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 257.87668352072086,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84a7d7c354231007c97f94f25b262266bb64e146",
          "message": "Fix machine-dependent format_cpu_cores tests (#155)\n\n`format_cpu_cores` reads the host's real CPU topology (Linux /sys cpufreq,\nmacOS hw.perflevel*) and returns a \"NP + ME / KT\" hybrid string on Intel P/E\nand Apple Silicon machines, ignoring its passed-in (logical, physical) counts.\nThe four fallback unit tests called it with fixed args, so they passed on\nnon-hybrid CPUs/CI runners but failed on a hybrid host — an i7-1360P produced\n\"8P + 8E / 16T\" for (16, Some(8)) where the test expected \"8C / 16T\", hard-\nfailing `just pr` there.\n\nExtract the pure fallback into `format_cpu_cores_plain` and retarget the four\ntests at it, so they no longer depend on the runner's hardware. Public\nbehavior of `format_cpu_cores` is unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:41:15-07:00",
          "tree_id": "26f59d72e69fb5f71508fb9427bd765258b160f2",
          "url": "https://github.com/l1a/retch/commit/84a7d7c354231007c97f94f25b262266bb64e146"
        },
        "date": 1783907737295,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 766518777.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1011.3406205757283,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 48.99436542628315,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469862456718916,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.07267250083832,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7923.461938968898,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71271.91653199265,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4850.380224545215,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4971.543808978169,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1218291.3130673973,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 335.4218162529567,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 271.8883206073625,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be732f18be8ed35c252a364cc1241d542d0962ef",
          "message": "Enforce LF line endings via .gitattributes (#156)\n\nThe working tree is shared across Linux/macOS/Windows via Syncthing. With no\n.gitattributes and core.autocrlf=false, a Windows checkout wrote CRLF, Syncthing\npropagated those bytes to the Linux clones, and git reported the entire tree as\nmodified — a phantom 13811+/13811- whole-tree diff with zero content changes\n(git diff --ignore-all-space empty). This blocked the just-pr clean-tree checks.\n\nAdd `* text=auto eol=lf` to force LF on checkout on every OS (essential for a\nbyte-identical Syncthing-shared tree) and `*.png binary` to protect the logo\nassets. HEAD was already stored as LF, so no tracked content changes.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:59:28-07:00",
          "tree_id": "09a0473cae06eab0155f9d17e371c9dc4271dea9",
          "url": "https://github.com/l1a/retch/commit/be732f18be8ed35c252a364cc1241d542d0962ef"
        },
        "date": 1783908836517,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1230139114.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1002.7940247625263,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 48.68287242239905,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467195488223563,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.80414866666756,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7955.261133500258,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71394.33934808058,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4798.808461825527,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4899.117512446772,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1270558.9857553432,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.56075776416026,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 276.4133182393156,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "280db85bc07aaa37fe6e22c1428c57d3a95ba55b",
          "message": "Add Linux login-manager/brightness/power-adapter (#157)\n\nThree new --long fields closing NOTES §6 fastfetch gaps, each a cheap\nsingle-source Linux probe in the sequential detect_* style (like init/chassis):\n\n- login-manager: resolves the display-manager.service systemd unit symlink\n  (GDM/SDDM/LightDM/greetd/…), prettified.\n- brightness: reads /sys/class/backlight/*/{brightness,max_brightness} as a %.\n- power-adapter: reads the Mains supply under /sys/class/power_supply (name +\n  connected state; wattage omitted — sysfs Mains rarely exposes it).\n\nAll three are Linux-only (None elsewhere). Each detector wraps a pure helper\n(login_manager_from_unit / brightness_percent / format_power_adapter), split\nout and unit-tested host-independently per the v0.4.2 format_cpu_cores lesson;\nhelpers + tests are cfg(linux) so they aren't dead code under clippy -D warnings\non other platforms. Verified live on corrino (greetd, 51%, AC (connected)).\n\nretch-cli 0.4.3 -> 0.5.0, retch-sysinfo 0.1.42 -> 0.1.43.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T20:11:45-07:00",
          "tree_id": "c4f4b86a753026bf48a3009deb1ece1f46ea99bc",
          "url": "https://github.com/l1a/retch/commit/280db85bc07aaa37fe6e22c1428c57d3a95ba55b"
        },
        "date": 1783913168084,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 758502857.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 994.1709745972751,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.387087338399354,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466796185623485,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.829755760204556,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7861.4368394337025,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71513.30409983564,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4847.244324545702,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4914.466394690346,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1218441.403516883,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 339.3629106716711,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.37251240880437,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbb9672b8c95616671974128187d9d3b32f0fe53",
          "message": "Fix network status bracket color nesting (#158)\n\nowo_colors closes every foreground color with the default-reset \\x1b[39m, so\nthe green \"Up\" / red \"Down\" embedded in the Net value cancelled the enclosing\nvalue color (and, for the active interface, the bright-blue highlight). Everything\nafter [Up] fell back to the terminal default: the active line's opening [ was blue\nbut the closing ] and the RX/TX stats were not.\n\nAdd colorize_nested(text, prefix) which re-asserts the enclosing color after every\ninterior \\x1b[39m so nested colored spans restore the surrounding color instead of\nfalling to default. It is byte-identical to the old plain wrap when there is no\nnested reset, so only the Net field's rendering changes. Theme::color_value routes\nthrough it and the active-interface highlight uses ACTIVE_IFACE_PREFIX. The library\nnetwork.rs is untouched. Four regression tests cover the helper.\n\nBump retch-cli to 0.5.1 (retch-sysinfo unchanged at 0.1.43); regen man page.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T21:49:19-07:00",
          "tree_id": "15c36368910c46efd1ba4d0a4f43df2b81c63aa0",
          "url": "https://github.com/l1a/retch/commit/fbb9672b8c95616671974128187d9d3b32f0fe53"
        },
        "date": 1783919015945,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1229097194.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 996.6259287949175,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.99514225258635,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469175027070755,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.431181929855775,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7895.042168437717,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71396.90571563135,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4832.850109266105,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4920.501792608036,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1226064.489555734,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.5766014150243,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 280.1692882647714,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c4f762eed77a36ac3d95a1beb6a4cab62afb2965",
          "message": "Add Windows domain and terminal-size fields (#159)\n\nTwo --long fields that previously returned None on Windows now have\nnative arms — the first of the Windows cross-platform-parity feature\nseries (distinct from the completed PowerShell->FFI perf migration).\n\n- domain: primary DNS suffix via GetComputerNameExW(ComputerNameDnsDomain)\n  (kernel32, two-call size probe). A workgroup host's empty suffix maps to\n  None via the pure clean_domain helper — not the NetBIOS WORKGROUP name —\n  matching the Linux/macOS /etc/resolv.conf DNS-domain semantics.\n- terminal-size: console viewport via GetStdHandle + GetConsoleScreenBufferInfo,\n  using the srWindow rect (not dwSize, the scrollback buffer). Pure\n  window_rect_to_size helper does the inclusive-rect -> \"COLSxROWS\" math;\n  piped output has no console -> graceful None -> existing env fallback.\n\nHand-written extern \"system\" FFI, no binding crate (house style); // SAFETY:\non every unsafe. Non-Windows arms untouched. New tests: clean_domain,\nwindow_rect_to_size, and a CONSOLE_SCREEN_BUFFER_INFO size_of layout guard.\nVerified live on arrakis (Windows 11): domain correctly absent (DNS suffix\ngenuinely empty), terminal-size renders 100x40.\n\nretch-cli 0.5.1 -> 0.6.0, retch-sysinfo 0.1.43 -> 0.1.44.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:13:18-07:00",
          "tree_id": "89121134b1cdf90e97f3ba23b740bd744dbf5193",
          "url": "https://github.com/l1a/retch/commit/c4f762eed77a36ac3d95a1beb6a4cab62afb2965"
        },
        "date": 1783978064110,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 996479670.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 982.0335067257538,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.98805065734125,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470309869222753,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.496058402432,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7710.667280498512,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70358.01964414767,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4774.644692499829,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4880.704455015406,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1232667.8591640848,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 333.8251928970768,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.38121250426735,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30195b0eaaf4f96b4b6fe43c11001046a871537b",
          "message": "Fix Windows Camera (scanners) and Users (=0) bugs (#160)\n\nTwo user-reported Windows output bugs in the cross-platform-parity series.\n\nCamera listed scanners as cameras (e.g. \"EPSON ET-3850 Series\"). The Windows\npath enumerated the Camera + Image (WIA) setup classes, but scanners/printers\nshare the Image class with some real webcams (a Logitech BRIO is Image-class),\nand is_real_camera has no keyword to catch an EPSON model string. Fixed by\nenumerating the KSCATEGORY_VIDEO_CAMERA device-interface class instead — only\nreal cameras register it, so scanners are excluded while Image-class webcams are\nkept. Added win_setupapi::present_interface_device_names (DIGCF_DEVICEINTERFACE,\nsharing the existing enumerate_names core) + the KSCATEGORY_VIDEO_CAMERA GUID;\nremoved the now-unused GUID_DEVCLASS_CAMERA/_IMAGE. Also drops the synthetic\n\"Windows Virtual Camera Device\" via a Windows-only is_windows_virtual_camera\nhelper (Linux/macOS untouched).\n\nUsers showed 0 with a user logged in: sysinfo keys Windows users by SID, so the\nUnix uid>=1000 filter never matched. New win_users module counts active\ninteractive sessions via WTSEnumerateSessionsW + WTSQuerySessionInformationW\n(wtsapi32; query-user semantics), with a pure unit-tested count helper. Per the\n\"if it doesn't work, don't show it\" request, display.rs now suppresses Users\nwhen the count is 0 (mirrors the packages guard).\n\nNon-Windows camera/users behavior unchanged. FFI house style (hand-written\nextern \"system\", // SAFETY:, WTS_SESSION_INFOW size_of guard). Verified live on\narrakis: Camera = Logitech BRIO + ASUS FHD webcam only; Users: 1.\n\nretch-cli 0.6.0 -> 0.6.1, retch-sysinfo 0.1.44 -> 0.1.45. Patch (bugfixes).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:46:19-07:00",
          "tree_id": "13dc79f2b8c9dd3041dc8f5dfc070fb42bba266a",
          "url": "https://github.com/l1a/retch/commit/30195b0eaaf4f96b4b6fe43c11001046a871537b"
        },
        "date": 1783980030201,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 766839452.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 976.3920143585071,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.95859296974557,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9465957764809705,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.4478228786708,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7723.195722882391,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70663.7612491789,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4743.584169698707,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4858.348325067212,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1224340.0969867671,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.2938266932096,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.8340814757119,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2b4a083ed6b7696bd56727cbcc285ed5ac45030f",
          "message": "Unblock just pr on Linux: tests + man regen (#165)\n\nTwo coupled docs/test-hygiene fixes (no runtime behavior change), bundled\nbecause the first is what lets `just pr` pass on the reinstalled Fedora box.\n\n1. Machine-independent xrandr display tests. parse_xrandr_displays called\n   get_monitor_name_for_port (live /sys/class/drm EDID) inline, so the\n   fixture tests substituted the physically-attached monitor for the\n   fixture's connector name (DP-1 -> the panel's EDID model ATNA33AA08-0).\n   These tests are cfg(not(macos/windows)) and never ran on the old Windows\n   arrakis, so the defect was latent until the first cargo test after the\n   Fedora reinstall. Same class as #155. Extract a pure\n   parse_xrandr_displays_with(stdout, resolve); the public wrapper passes\n   get_monitor_name_for_port (production unchanged) and the tests pass\n   |_| None. Add a regression test asserting the resolver is honored.\n\n2. Regenerate docs/retch.1. The committed page carried double-bold groff\n   runs from the Windows #160 `just man` run, where the recipe's\n   sed 's/\\fB\\fB/\\fB/g' strip did not take effect. Linux regeneration\n   produces the intended single-bold output, matching the recipe's intent.\n\nPatch bump: retch-cli 0.6.2, retch-sysinfo 0.1.46 (new pub\nparse_xrandr_displays_with).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:10:26-07:00",
          "tree_id": "545ecee36947f96e29585e4dcc803424559d5b6b",
          "url": "https://github.com/l1a/retch/commit/2b4a083ed6b7696bd56727cbcc285ed5ac45030f"
        },
        "date": 1784906704399,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 935043135.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1016.0964010396892,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.2151238620131,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470307844169854,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.29222890609064,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7957.293973534246,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70572.30196852116,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4906.09230078155,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4950.399105066403,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1238984.1860469873,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 342.91114162960764,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 281.92811190206777,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9cbad3234c6ec06f444e623a84b3ff72efbcd50",
          "message": "Bump deps + CI actions (Dependabot #161/163/164) (#167)\n\nConsolidate three open Dependabot PRs into one gated PR so the release-hygiene\nsteps they bypass (retch version bump, NOTES/man regen) are performed. No\nruntime behavior change.\n\n- Rust deps (#164, cargo-dependencies group, all patch-level, lockfile-only\n  since the Cargo.toml specs are caret ranges): clap 4.6.1->4.6.4 (pulls syn v3\n  via clap_builder/clap_derive), serde 1.0.228->1.0.229, toml 1.1.2->1.1.3,\n  clap_complete_nushell 4.6.0->4.6.1, anyhow 1.0.103->1.0.104,\n  libc 0.2.186->0.2.189, sysinfo 0.39.5->0.39.6, serde_json 1.0.150->1.0.151.\n- actions/checkout 7.0.0->7.0.1 (#163) across benchmark/claude/\n  claude-code-review/packaging/rust/security (both SHA-pinned and @v7 uses).\n- softprops/action-gh-release 3.0.1->3.0.2 (#161) in the rust.yml release job.\n\nretch-cli -> 0.6.3; retch-sysinfo unchanged (0.1.46, no source change).\nWorkspace fmt/clippy/test all green.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:51:12-07:00",
          "tree_id": "0627e675b46ff2705a23fb6064df75bf587aac13",
          "url": "https://github.com/l1a/retch/commit/a9cbad3234c6ec06f444e623a84b3ff72efbcd50"
        },
        "date": 1784909118685,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 740252160.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1007.6030946260604,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.331850595391536,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946796675821754,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.618400403160685,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7841.281666236757,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71252.26898878432,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4837.057291866449,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4920.718388006231,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1284994.5422055812,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.6358467795782,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 258.64590744549776,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c0cf9c9583413e1b1d346274f3367162daef52e",
          "message": "Bump base64 0.22 -> 0.23 (Dependabot #166) (#169)\n\nThe one genuinely-new bump from Dependabot #166 (the other 8 crates in that\ngroup already landed in #167/v0.6.3). A semver-breaking 0.x bump, held out of\nthe v0.6.3 consolidation pending an API check. No runtime behavior change.\n\nbase64 is used only under the optional `graphics` feature (src/logo.rs, two\ngeneral_purpose::STANDARD.encode() sites for the Kitty/iTerm2 inline-image\nprotocol). The Engine encode API is unchanged in 0.23: build + clippy\n-D warnings are clean *with --features graphics* (the default gate does not\ncompile base64), and tests pass with and without the feature. `cargo bench`\nis unchanged (base64 is not on any benchmarked path). Widened the Cargo.toml\nspec \"0.22\" -> \"0.23\" since the caret range wouldn't admit 0.23.\n\nretch-cli -> 0.6.4; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T08:22:25-07:00",
          "tree_id": "5c659664226725eb40ca8c915bafbcf13fe02f12",
          "url": "https://github.com/l1a/retch/commit/7c0cf9c9583413e1b1d346274f3367162daef52e"
        },
        "date": 1784993839854,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 753423364.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1007.6960296423891,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.302581194290994,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470137151455056,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.66796752625789,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7842.085495846963,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70932.31324569421,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4825.386109040612,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4913.376763594888,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1283826.7666593129,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.39568732061616,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.71565226783574,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "586012cefc4c98dfa9ab5b227b0832620797265c",
          "message": "Lint graphics feature in just check (v0.6.5) (#170)\n\nAdd `cargo clippy --features graphics -- -D warnings` to the `check` recipe\n(and therefore the `just pr` gate). The base64 0.22->0.23 bump surfaced that\nbase64/image/icy_sixel and their src/logo.rs call sites live behind the\noptional `graphics` feature, which the default `cargo clippy --workspace`\nnever compiles -- so a graphics-only lint or API break could pass the gate\nunseen. Targets retch-cli (which defines the feature), not --workspace.\n\nTooling only, no runtime change. Closes the LOCAL gate gap; CI still builds\ndefault features, so a CI graphics job would be a separate follow-up.\nretch-cli -> 0.6.5; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:33:31-07:00",
          "tree_id": "f944cee1876f95b5314bfca44f0ba40a154033bb",
          "url": "https://github.com/l1a/retch/commit/586012cefc4c98dfa9ab5b227b0832620797265c"
        },
        "date": 1784998053542,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 860615071.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1006.063541994564,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.04261783352138,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9472888151751975,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.0568992621482,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7797.938550484408,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71065.80395671036,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4847.61197166634,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4949.094591577263,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1331716.2395971012,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.1559450372036,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.60537866848324,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da6c74f858f9d84a8b3b076473c1026f04aef412",
          "message": "Show ASCII logo without a TTY; fix CI dry-run (v0.6.6) (#171)\n\ndisplay.rs gated the logo purely on stdout_is_tty, so `retch --ascii-logo`\nrendered no logo when piped/redirected -- including CI's full-test \"Run\nfetcher (dry run)\" step, which showed no logo.\n\nExtract a pure `should_show_logo(config_show_logo, no_logo, ascii_logo,\nstdout_is_tty)` helper: `--no-logo` always wins; `--ascii-logo` now forces the\nlogo on regardless of TTY or config (ASCII is plain, pipe-safe text, mirroring\nhow --no-logo is always honored); auto mode is unchanged (default-on,\nTTY-gated). --chafa-logo/graphical modes are deliberately not forced (they emit\nterminal-only control sequences).\n\nUpdate the CI full-test dry-run to `cargo run --release -- --full --ascii-logo`\nso it exercises every field AND the ASCII-logo path. 4 new unit tests on the\nhelper; verified live that piped `--full --ascii-logo` shows the logo while\npiped `--full` alone still shows none.\n\nretch-cli -> 0.6.6; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:48:23-07:00",
          "tree_id": "88dc56bcc4160f88dae2e60506f62a93c2ca7ea4",
          "url": "https://github.com/l1a/retch/commit/da6c74f858f9d84a8b3b076473c1026f04aef412"
        },
        "date": 1784998942416,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1038999144.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 999.6228470589718,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.73278406653406,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946863536724677,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.692189249983166,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7827.775459817572,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70991.91942310618,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4835.581142040937,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4922.758852723633,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1294646.4354527746,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.03450947098224,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 277.74205955393353,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ada1356ee93539a36a2c996eaa23e24c481463a3",
          "message": "Add CI graphics-feature job (v0.6.7) (#172)\n\nThe default `build` matrix never compiles the optional `graphics` feature\n(base64/image/icy_sixel + the src/logo.rs inline-image paths), so a\ngraphics-only lint or API break could pass CI unseen -- as the base64\n0.22->0.23 bump nearly did. v0.6.5 closed this in the local `just check` gate;\nthis closes it in CI.\n\nAdd a dedicated `graphics-feature` job to rust.yml (one ubuntu runner, same\nnon-tag triggers as `build`) running:\n  cargo clippy --features graphics -- -D warnings\n  cargo build  --features graphics --verbose\n\nCI only, no runtime change. retch-cli -> 0.6.7; retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T10:40:12-07:00",
          "tree_id": "ee5c8fdd3c4060bb2ec7f42369695582a0637e23",
          "url": "https://github.com/l1a/retch/commit/ada1356ee93539a36a2c996eaa23e24c481463a3"
        },
        "date": 1785002089344,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1004672507.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1007.450997008527,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.740449615710006,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9471729332091137,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.6920626807139,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7844.578103855396,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71039.7603977773,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4844.908089206987,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4941.349740939266,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1297656.5884464085,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.6216974357379,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 254.1909466448351,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa886633f69e0ee0a7db86ea7dc9773ceec03be9",
          "message": "Keep logo beside text in --long/--full (v0.6.8) (#173)\n\n* Keep logo beside text in --long/--full (v0.6.8)\n\nThe side-by-side vs. stacked layout decision (and the text-column width) was\ncomputed from the widest of ALL info lines. In --long/--full a single very long\nline -- a 150+ char Wi-Fi line, or the Net/Battery lines -- inflated the text\ncolumn past the terminal width and forced the logo to stack ABOVE the text,\neven though those long lines sit well BELOW the logo.\n\nExtract a pure `plan_layout(info_widths, logo_height, logo_width, term_width,\nshow_logo)` that considers only the info lines that actually sit BESIDE the\nlogo (the first `logo_height` rows). Long lines below the logo render at column\n0 with the full terminal width and no longer affect placement.\n\nLogo-type-agnostic: logo_height/logo_width come from the active logo, so it\nworks identically for ASCII, Chafa (both rendered as text `Lines`) and the\ngraphical image protocols (Kitty/iTerm2/Sixel -- height_lines + fixed image\ncolumn).\n\nVerified in a pseudo-terminal: --full renders the logo beside the text at\n140 cols (previously stacked) and correctly stacks at 90 cols. 7 new\nplan_layout unit tests. retch-cli -> 0.6.8; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8\n\n* CI: build-job dry run uses --full --ascii-logo too\n\nThe `build` job's \"Run fetcher (dry run)\" step still ran `cargo run -- --long`\n(no logo). Make it `cargo run -- --full --ascii-logo`, matching the full-test\ndry run, so every CI dry run exercises all fields and the logo/layout path.\n\nAssisted-By: Claude Opus 4.8\n\n* Split Wi-Fi into two lines; grayscale Apple logo\n\nTwo display tweaks requested on top of the layout fix (same PR):\n\n- Wi-Fi: the iw path builds a single \"{adapter} [{iface}] - {SSID} (band/rate)\"\n  string that ran 150+ chars and wrapped into the logo. Split on the \" - \"\n  boundary via a pure `split_wifi_line` into a `Wi-Fi` line (adapter hardware)\n  and a `Wi-Fi Link` line (live connection). Fallback detectors have no \" - \"\n  and stay one line. `Wi-Fi Link` is aliased to the `wifi` field key in\n  should_show (like dns/memory). 3 unit tests.\n\n- macOS/Apple ASCII logo: replace the legacy rainbow colour bands\n  (green/yellow/red/magenta/blue) with a 256-colour grey (silver) ramp,\n  matching the modern monochrome Apple logo. Graphical macos.png untouched.\n\nretch-cli stays 0.6.8 (same PR); retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix graphical logo landing mid-text in --long/--full\n\nThe side-by-side path for image protocols (Kitty/iTerm2/Sixel) printed ALL the\ninfo lines first, then did `\\x1b[{n}A` to move back up and draw the image to the\nright of the top rows. For tall output (--long/--full) the info block is taller\nthan the viewport, so by the time the text finished the screen had scrolled and\nthe cursor-up was clamped at the top of the viewport -- the image was drawn in\nthe MIDDLE of the text, overlapping it (reported on kitty).\n\nDraw the image FIRST instead: move to the top of the logo column, bracket the\nimage draw with save/restore (\\x1b7/\\x1b8) so it lands at the correct row before\nany text is printed or the screen scrolls, then print the info lines\ntop-to-bottom at column 0. The terminal scrolls naturally and carries the\ncell-anchored image with it. Shared `render_graphical_side_by_side` helper for\nall three protocols. Verified the escape choreography (right/save/image/restore/\nCR/text) at the byte level in a kitty pty.\n\nretch-cli stays 0.6.8 (same PR).\n\nAssisted-By: Claude Opus 4.8\n\n* docs(NOTES): record graphical logo placement fix (v0.6.8)\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T17:31:49-07:00",
          "tree_id": "9b82d07a4ddf3e53b29bc8579d9a7acdcf12908e",
          "url": "https://github.com/l1a/retch/commit/fa886633f69e0ee0a7db86ea7dc9773ceec03be9"
        },
        "date": 1785026740585,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 906298003.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1015.101811961537,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.31704283694465,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946757913288553,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.59671397885147,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7806.61950241673,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70764.95516911097,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4836.440911246269,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4922.642101908583,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1262487.5067813054,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 333.20828524598676,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.78333209307914,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b899b3ca3988eab8b8632cbb3b5263bf35322a76",
          "message": "Fix graphical logo placement after scroll (v0.6.9) (#174)\n\nThe v0.6.8 side-by-side choreography saved the cursor (DECSC), drew\nthe image, and restored (DECRC). With the prompt at the bottom of the\nscreen the draw scrolls the viewport, and DECSC/DECRC restore a\nviewport-relative position, so the info text landed below the logo\ninstead of beside it. Reproduced identically on Rio and kitty.\n\nReserve the logo rows with newlines first and cursor-up back to the\nimage-top row, so any scroll happens before the save and nothing\nbetween save and restore can scroll. Fresh-screen output unchanged.\n\nAlso refresh the stale in-repo packaging reference copies\n(PKGBUILD/package.nix 0.3.21 -> 0.6.8), per the tracked WIP task.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:32:00-07:00",
          "tree_id": "a20285fab03aaf49bedc3f4d570f209aaf34e68d",
          "url": "https://github.com/l1a/retch/commit/b899b3ca3988eab8b8632cbb3b5263bf35322a76"
        },
        "date": 1785077151707,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 707215365.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1014.4793959023785,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.76470510785154,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946742366291274,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.56854139150412,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7857.417543069835,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71096.24169140057,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4818.127342864581,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4903.387472146691,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1253726.5999832815,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 332.6897514625684,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.89270107980684,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fd8164049e99da545e8fe98d3f0b76e8c09b6faa",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10) (#175)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:58:18-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/fd8164049e99da545e8fe98d3f0b76e8c09b6faa"
        },
        "date": 1785078744935,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 867971927.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 987.5447920527668,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 52.76918922608407,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946833143401578,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.13637652292152,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7877.168069950829,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71103.98314627446,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4868.702204244858,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4907.603439586321,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1138212.895977823,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.2943670657384,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 257.0908536159541,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e8b380c97debf11a4a35306f669cf3e456ccd616",
          "message": "Report default-route domain, not a VPN's (v0.6.11) (#176)\n\nUnder systemd-resolved /etc/resolv.conf is the stub file whose search\nlist is the merged set of every link's domains, so the Domain field --\nwhich took its first entry -- showed a split-tunnel VPN's domain\n(netbird.cloud) instead of the default route's (lan). It never\nconsidered interfaces at all.\n\nResolve the IP default-route interface from /proc/net/route and report\nthat link's own domain from resolvectl status. Keyed on the routing\ntable, not resolvectl's per-link 'Default Route:' flag, which is a DNS\nrouting flag and was yes for both links. When resolved manages the\ndefault link but it has no domain, report nothing rather than falling\nback to the merged list (which would resurrect the VPN domain); an\nunmanaged link still falls back, so static-resolv.conf hosts are\nunchanged. A full-tunnel VPN that is the default route reports its own\ndomain, as intended.\n\nFix two latent bugs in the same parser: all '~'-prefixed routing-only\ndomains are excluded (not just the exact catch-all '~.'), and wrapped\ncontinuation lines are no longer silently dropped.\n\nresolvectl is now needed by --long, so one OnceLock-cached invocation\nis shared with --full's domain-search rather than spawning twice.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T08:39:18-07:00",
          "tree_id": "8e30bf9598c906aed347fbd5c1c2ab33160360b0",
          "url": "https://github.com/l1a/retch/commit/e8b380c97debf11a4a35306f669cf3e456ccd616"
        },
        "date": 1785081180091,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 768553773.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1017.7595744856484,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.25789327526301,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947174966086511,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.857580531504816,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7836.836252013159,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70741.57992842817,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4793.720006716938,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4909.14842027267,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1151913.9440117918,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 343.81822977545465,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.92005494790897,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "86f5803462d1608de8b7739c8dc6c69bc9c85a46",
          "message": "Give Domain Search one shape per source (v0.6.12) (#177)\n\nCI dry-run output showed 'eth0: <domain>' on Ubuntu but a bare\n'<domain>' on Fedora. The difference is not platform-driven: the same\nOS flips format between jobs. Ubuntu in the build matrix runs on a bare\nrunner and takes the resolvectl path; Ubuntu in full-test runs in a\ncontainer with no systemd-resolved and falls back to resolv.conf.\nFedora is always containerised, so it only looked different from\nUbuntu.\n\nGrouping differed too: the resolvectl path returns one entry per\ninterface with domains joined, while the fallback returned one entry\nper domain and the display prints one line per entry, so 'search a b c'\nemitted three separate bare lines.\n\nRender the fallback in the same '<scope>: a, b' shape, scoped 'global'\n-- labelled honestly rather than attributed to an interface, since\nresolv.conf's search list carries no attribution. The parser stays\nfaithful to the file; the shape is imposed at the detect layer. macOS\nroutes through the same formatter. The resolvectl path is unchanged.\n\nWindows is deliberately not fixed here and is documented in NOTES 6a:\nits Domain reads the AD/primary suffix rather than the connection\nsuffix, and Domain Search has no Windows arm at all. Both need\nGetAdaptersAddresses and cannot be verified live without a Windows box.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T19:35:39-07:00",
          "tree_id": "b11c193d8bdb824b38e28d4104d2b63b410c8fea",
          "url": "https://github.com/l1a/retch/commit/86f5803462d1608de8b7739c8dc6c69bc9c85a46"
        },
        "date": 1785120566133,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1058097126.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1001.3898370014716,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.214493917150236,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946786110990075,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.42449656389265,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7853.45010320865,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 72100.31786747466,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4830.142077484622,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4946.334653356458,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1093077.1841839862,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.47373114511004,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 280.1944794997878,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3738fdb3ff66b18fc121092f4f086ea51ac0dc30",
          "message": "Fix release tooling: publish-check and nix hashes (v0.6.13) (#178)\n\npublish-check failed on every release: the retch-cli dry run cannot\nresolve its '=0.1.x' retch-sysinfo pin until sysinfo is actually on the\nindex, and a dry run never uploads. It now checks the sparse index via\na new crates_io_has_version.py helper and skips that leg with an\nexplanation instead of dying on 'failed to select a version'. Both\npublish recipes also skip retch-sysinfo when its version is already\npublished, which is the normal state for a CLI-only release.\n\ncalculate_nix_hashes.py was silently emitting a wrong cargoHash. Its\nsubstitutions matched only 'lib.fakeHash', so once package.nix held\nreal values they became no-ops, the temp build kept the previous\nrelease's hashes, it failed on a source-hash mismatch rather than the\nintended cargoHash mismatch, and the lenient parser returned that stale\nsource hash. That is why the published v0.6.12 cargoHash equals\nv0.6.8's hash. Patterns now match a literal hash too, are line-anchored,\nand hard-error when they match nothing; the parser only accepts a hash\nreported against our own dummy.\n\nRefresh the in-repo packaging reference copies to the released v0.6.12.\npackage.nix keeps the genuine src hash but resets cargoHash to\nlib.fakeHash rather than carrying the corrupt value -- recompute with\n'just nix-update' on a machine with Nix.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-07-26T20:14:41-07:00",
          "tree_id": "195de4a24b9c74a5d3bbc3288e0a4ce21ab48a89",
          "url": "https://github.com/l1a/retch/commit/3738fdb3ff66b18fc121092f4f086ea51ac0dc30"
        },
        "date": 1785122930750,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 744990493.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1001.5120958654248,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.17158694799478,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466873521172667,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.494420163048424,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7841.8064129435315,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71281.1023149234,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4809.161018908458,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4961.455481286535,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1091921.3049375033,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 339.08512756585543,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.9973768304494,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29c90fa282c281f6c5a2b797544c5babf5e957ce",
          "message": "fix(net): resolve Windows connection DNS domain and search list (#181)\n\n* fix(net): resolve Windows connection DNS domain\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(net): read Windows interface registry search list\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-07T23:10:01-07:00",
          "tree_id": "1430e5590c797113f0e21a4cdab22e90bfe90ce4",
          "url": "https://github.com/l1a/retch/commit/29c90fa282c281f6c5a2b797544c5babf5e957ce"
        },
        "date": 1786170244157,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1135023960.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1000.7466908365461,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.42694039598753,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467958661725406,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.18583743388202,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7876.025474377083,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71799.99979225032,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4822.715350989272,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4926.707703988842,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1107350.659025842,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 337.42740577113295,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.6110013644256,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "464951f8ff41455093d91045e621a17b81124684",
          "message": "fix(display): parse monitor vendor and panel model from EDID on Windows (#183)\n\n* fix(display): parse monitor EDID on Windows\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): extract monitor vendor and model on Windows\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-08T07:48:08-07:00",
          "tree_id": "5029838743a7e4449bedecce22a3d07443557dd7",
          "url": "https://github.com/l1a/retch/commit/464951f8ff41455093d91045e621a17b81124684"
        },
        "date": 1786201361373,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 816734061,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 997.7081903786788,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.4047036790867,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946419709926547,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.1100670385085,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7803.517827920208,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71237.18878690271,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4862.465993189167,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4953.358227622827,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1050128.3221806004,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 349.83871672532496,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.43634599132764,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "622cf3b843fc5f6286cad91442e7bd41af2fdf12",
          "message": "Bump 4 deps and fix man page font-run strip (#184)\n\nConsolidates Dependabot #182 onto a gated branch so the release-hygiene\nsteps Dependabot skips (version bump, NOTES entry, man regen) are done.\n\nDependencies (cargo-dependencies group, lockfile-only — every spec is a\ncaret range, so Cargo.toml is untouched):\n  clap          4.6.4 -> 4.6.5  (clap_builder 4.6.2 -> 4.6.5)\n  toml          1.1.3 -> 1.1.4  (toml_parser  1.1.2 -> 1.1.3)\n  clap_complete 4.6.7 -> 4.6.8\n  base64        0.23.0 -> 0.23.1\n\nThe resulting Cargo.lock is byte-identical to what Dependabot generated.\n\nAlso fixes the `just man` font-collapsing sed, which has never worked on\nany platform. mandown emits redundant \\fB\\fB...\\fP\\fP runs and the recipe\ncarried `s/\\fB\\fB/\\fB/g` to strip them, but GNU sed reads \\f as the\nform-feed escape rather than backslash-then-f, so the pattern only ever\nmatched form feeds that groff output never contains. This is why\ndocs/retch.1 kept flip-flopping between machines: v0.6.2 concluded the\nstrip merely \"didn't take effect on Windows\", when in fact Linux was not\nstripping anything either — its mandown build just doesn't emit the\ndoubled runs. Matching the backslash as [\\] and carrying it out through a\ncapture group keeps any backslash escape off the replacement side.\n\nWith the fix, `just man` on Windows reproduces byte-for-byte the file a\nLinux `just man` produces, so the regen check in `just pr` no longer\ndepends on which machine last ran it. The regenerated page drops 21\ndoubled font runs and changes nothing else but the version footer.\n\nretch-sysinfo unchanged at 0.1.51; no Rust source touched.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-09T07:06:33-07:00",
          "tree_id": "15f29415e43f3e3f4f04318b070cc8c16695ac9a",
          "url": "https://github.com/l1a/retch/commit/622cf3b843fc5f6286cad91442e7bd41af2fdf12"
        },
        "date": 1786285232062,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1013099844.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1008.5912420835151,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.46295309264194,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470098654509913,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.10557452284657,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7892.331646081899,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71037.25291722805,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4813.070214455876,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4908.830435930313,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1051847.3857629416,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 361.65776665887074,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 290.39936029327635,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30f2bc0d85fda967af17b3472e2784627296f331",
          "message": "fix(justfile): make install and man recipes portable (#185)\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T13:24:44-07:00",
          "tree_id": "0ebf13827d71fe02fbbdd12b0eb83ccbacbc2ab8",
          "url": "https://github.com/l1a/retch/commit/30f2bc0d85fda967af17b3472e2784627296f331"
        },
        "date": 1786394334217,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 845291471.5,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1020.8702947664548,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.97926604028899,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467783102028906,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.240530144414244,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7844.456329773413,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71558.03069962286,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4826.885922605635,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4975.023303434229,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1068827.1370557607,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 361.3741678444915,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 285.0958770712586,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "521364f30839992fda65499538a01a44bc4f11bb",
          "message": "fix(display): constrain graphic logo height, normalize audio, and wrap lines to terminal width (#186)\n\n* fix(display): reduce logo height and wrap long info lines\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): constrain graphic logo height and wrap below-logo lines to full terminal width\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): normalize and deduplicate Windows audio device names\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): evaluate soundwire before streaming filter in normalize_win_audio_device\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T14:10:09-07:00",
          "tree_id": "8526b53eccb25ed2a964d63d08a63e698c00c32f",
          "url": "https://github.com/l1a/retch/commit/521364f30839992fda65499538a01a44bc4f11bb"
        },
        "date": 1786397054238,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1023947797.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1008.1000003248786,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.11066455802604,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467498895723923,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.0925278961147,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7856.31909318927,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71215.50371501646,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4826.158212906753,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4932.321732761235,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1093846.1088371747,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.6810289365434,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.980134029327,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1177d194785c63e2058a99f5cffa5ef33577d9cb",
          "message": "ci: disable Claude Code Review workflow (#187)\n\nThe claude-review job no longer runs on pull requests: the\n`pull_request` trigger is replaced with `workflow_dispatch` and the\njob carries `if: false`, so it is off by default but can still be\ninvoked manually if wanted.\n\nBumps retch-cli 0.6.16 -> 0.6.17 (patch), refreshes Cargo.lock,\nregenerates docs/retch.1 for the new version footer, and updates the\nNOTES.md Current State header and release log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T08:18:19-07:00",
          "tree_id": "5edf46dce11e5ab7293d0a0411af8f9341a70b2b",
          "url": "https://github.com/l1a/retch/commit/1177d194785c63e2058a99f5cffa5ef33577d9cb"
        },
        "date": 1786462323729,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 837949163.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1015.7333836800523,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.85294180040049,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467052988494875,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.45832612057557,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7840.628019077029,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70918.19111598526,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4780.273191298988,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4877.242494576725,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1079675.5933245225,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.039394851086,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 263.2872091790121,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1d0dc367f9ad44e2a04cc045891998fa9d9b1aae",
          "message": "fix: unprivileged Packages, sudo Rio, logo aspect (#189)\n\nThree defects found by diffing `sudo retch --full` against a plain run.\n\nPackages appeared only under sudo. The RPM SQLite database was opened\nread-write; it is root-owned inside a root-owned directory, so SQLite\ncould not create its journal sidecars and every *query* failed with\n\"attempt to write a readonly database\" — not the open(), which is why\nthe existing warning never fired and the field vanished silently. Now\nopened read-only over a `file:...?immutable=1` URI, and the query error\nis reported instead of swallowed.\n\nRio lost all graphics support under sudo: it was identified only by\nTERM_PROGRAM, which env_reset drops. `is_rio_terminal` now also accepts\nTERM=rio/xterm-rio, which sudo preserves.\n\nThe Kitty logo was stretched ~3x vertically. `c=26,r=10` was hardcoded\nand Kitty forces an image into that rectangle, while display.rs assumed\na fixed 40-column width and derived the row count a third way. A single\npure `fit_logo_cells` now feeds all three protocol emitters and\nplan_layout. Passing both correct values still left a 9% stretch from\ncell quantisation, so the Kitty spec carries only the limiting dimension\nand lets Kitty derive the other — measured 0.0% aspect error in a PTY.\n\nThe chafa box widens 28 -> 45 columns (row cap unchanged at 10) so wide\nlockup assets stay legible: the Fedora logo goes from 4 rows to 7. The\nside-by-side threshold is unaffected (45 + 45 <= 95), pinned by a test.\n\nAlso fixes a test-isolation defect the change exposed: once\nsupports_iterm2 read TERM, the host's TERM leaked into a test that\nguarded only TERM_PROGRAM, failing on a Rio box and passing on CI.\n\nDocuments the privilege trade-off in both directions (root-only\nphys-mem and btrfs snapshot counts; user-only editor/desktop/wm) in a\nnew NOTES section, README, and a man-page PRIVILEGES section.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T17:52:19-07:00",
          "tree_id": "9996d32ff3728e9292ad474ad37e12907763f637",
          "url": "https://github.com/l1a/retch/commit/1d0dc367f9ad44e2a04cc045891998fa9d9b1aae"
        },
        "date": 1786496768785,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 723641196.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1008.4857308852646,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.91218487922372,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468362071825043,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.07641964508482,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7888.78434607723,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71084.23813385748,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4861.911164601135,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4915.022488229814,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1055073.6356044838,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 351.4020819916059,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 285.6494663055088,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d27af8746fe0e349822f3272031e94e03589b50",
          "message": "chore: bump 3 deps (consolidated Dependabot #188) (#190)\n\nRolls Dependabot #188 onto a gated branch so the release hygiene it\nbypasses — version bump, NOTES entry, man regen — is actually done,\nfollowing the #167/v0.6.3 and #184/v0.6.16 pattern.\n\nAll patch-level and lockfile-only; every spec is a caret range, so both\nCargo.toml manifests are untouched:\n\n  clap           4.6.5 -> 4.6.6  (pulls clap_builder 4.6.5 -> 4.6.6)\n  clap_complete  4.6.8 -> 4.6.9\n  rusqlite       0.40.1 -> 0.40.2 (pulls libsqlite3-sys 0.38.1 -> 0.38.2)\n\nThe lockfile was diff-verified byte-identical to Dependabot's before the\nversion bump, so this carries exactly the change its green CI validated;\nafterwards the only divergence is retch-cli's own version line.\n\nrusqlite warranted a live check rather than just a green suite: it is a\ndirect dependency of retch-sysinfo and the crate v0.6.18's Packages fix\nhad just started using differently, and libsqlite3-sys bundles SQLite\nitself, so a bump changes the engine that has to honour `immutable=1`.\nThe rpm_db_uri unit tests only assert string construction and could not\ncatch a behavioural change there. Verified live as an unprivileged user:\nPackages: 2509, unchanged.\n\nretch-cli -> 0.6.19; retch-sysinfo unchanged at 0.1.53 (no source\nchange, only its transitive lockfile deps moved).\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T18:52:53-07:00",
          "tree_id": "0f8eb7815bf12c631f95919caaeb1e89e3549096",
          "url": "https://github.com/l1a/retch/commit/9d27af8746fe0e349822f3272031e94e03589b50"
        },
        "date": 1786500413465,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 802876761.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1009.0730126574856,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.76742704111086,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466584315522977,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.01148643676578,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7884.2618986165135,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71742.60842114822,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4842.785679671009,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4918.930247191823,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1064421.976081432,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.4216208811667,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.90382890258695,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbd76828105384492815f283cc8351f68368cb56",
          "message": "Fix nushell completion path; adopt shared helpers (#191)\n\ninstall_completions.py wrote nushell completions to\n$XDG_CONFIG_HOME/nushell/autoload. On Windows\n$nu.user-autoload-dirs is exactly %APPDATA%\\nushell\\autoload and\nnushell never reads the XDG path, so the helper wrote a real file\nsomewhere nothing consults, printed the path, and delivered nothing.\n\nTwo more defects in the same helper: it logged a generation failure\nto stderr, continued, and then printed \"Installed completions for\nretch:\" unconditionally -- success reported over work not done; and\nnothing checked whether zsh would ever load the file (it reads only\ndirectories on fpath, and site-functions is not on it by default).\nIt now checks, via an INTERACTIVE zsh, since a non-interactive one\nreports the built-in default.\n\nThis repo's MECHANISM was right and is now the standard. v0.6.16\nmoved these recipes to Python so they run natively on Windows\nwithout Git's usr\\bin; rusticprofile first proposed replacing them\nwith sh recipes because it held the correctness fixes, which would\nhave regressed that work in the name of consistency. Each repo had\nsolved half the problem.\n\ninstall_completions.py and install_man.py are now vendored\nbyte-identically across retch, rusticprofile and etr, with\ntemplates/justfile-common.just as the Justfile block reference.\nstandard-check runs their self-tests -- not a text diff, since\nseparate repos cannot diff each other's files and a diff would pass\non a repo that never adopted the standard -- and check depends on it.\n\nAlso adds install-tag VERSION, which installs a released tag with\nbinary, completions (from the INSTALLED binary) and man page (from\nthe tag) so the three cannot disagree.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T17:11:38-07:00",
          "tree_id": "52f09d8ff2178e92d32e22dc2177be6643ec678b",
          "url": "https://github.com/l1a/retch/commit/fbd76828105384492815f283cc8351f68368cb56"
        },
        "date": 1786580772757,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 997512798.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1007.9046242953889,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.9292353661862,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9465959641620456,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.10777767850031,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7801.888930485409,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71862.95979140457,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4833.974292800873,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4893.320334149974,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1062916.462333363,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.65171000412585,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 292.17984087159635,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1b99674ea9eded99c6558e78098409ebe6a78ac",
          "message": "Make the pre-PR gate answerable; open-pr now pushes (#192)\n\n* Make the pre-PR gate answerable; open-pr now pushes\n\njust pr ended in a bare read, so only a human at a terminal could\nanswer it -- a script or agent blocked on a stdin that would never\nanswer, or died without saying why, and that reads as the gate refusing\nthe change. It now accepts PR_CONFIRM, an interactive stdin, or piped\ninput under a timeout, and names PR_CONFIRM when it cannot be answered.\nNot a bypass: every path still requires an explicit y.\n\njust open-pr did not push, so on a never-pushed branch it printed\n\"Gate passed\" and then failed because gh pr create had no remote\nbranch to open from. It now pushes only when there is no upstream --\npushing unconditionally would silently publish existing commits on a\nbranch that already has one. pre-push still runs just check, so the\npush is inside the gate rather than around it.\n\nBoth are rusticprofile's 0.0.21 and 0.2.12, which retch never received.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:24:18-07:00",
          "tree_id": "7307c8c54022ab27b0b3e8ecfeab8995613e25ea",
          "url": "https://github.com/l1a/retch/commit/c1b99674ea9eded99c6558e78098409ebe6a78ac"
        },
        "date": 1786592385213,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 858459484.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1025.5782460786836,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.94861440765332,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468083017743623,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.02038807819555,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7812.888884883912,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70368.85260217774,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4804.055393889199,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4900.537888527026,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1050893.9690098413,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.65282300891266,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.394091654454,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6",
          "message": "Let the manual Claude review actually run (#193)\n\n* Let the manual Claude review actually run\n\nv0.6.17 disabled automatic review by commenting out the pull_request\ntrigger AND setting if: false on the job. The trigger alone already did\nthat, so the guard added nothing -- but it also applied to\nworkflow_dispatch, which was kept. So gh workflow run started a run,\nskipped the job, and reported SUCCESS having reviewed nothing.\n\nA green run that did nothing is the failure this repo's tooling exists\nto refuse, and the one rusticprofile recorded twice about this action.\nDispatch available but silently inert is worse than working or absent.\n\nAutomatic review stays OFF -- only the job guard is removed; the\npull_request trigger is still commented immediately above it.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:45:42-07:00",
          "tree_id": "a129dbfd95e55ff45255a019bb60311bdfcf5738",
          "url": "https://github.com/l1a/retch/commit/e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6"
        },
        "date": 1786593585856,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 762015122.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1004.409503827349,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 108.08178620122831,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946906019848103,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.05693364201932,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7801.782888869438,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70195.5818024828,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4777.961315954322,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4875.491835813378,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1053753.7263238307,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 351.5099682644797,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 276.5450522041592,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a",
          "message": "Gate merge-pr on CI; bring the triad under standard-check (#194)\n\n* Gate merge-pr on CI; check the triad\n\nmerge-pr went straight from the branch check to gh pr merge --squash\n--delete-branch, with no inspection of the status rollup. gh pr merge\nhappily merges a red PR when there is no branch protection, so every\nmerge in this repo has been ungated -- safe only because whoever merged\nhappened to look first.\n\nrusticprofile added this in v0.1.5 after a PR went in with a leg red,\nand extended it in 0.2.1 after an EMPTY rollup passed vacuously.\nNeither reached here.\n\nThree refusals now: a failing check, an empty rollup, and checks still\nrunning. The empty state is compared as a string rather than via jq -e\nlength, because an external jq is not on a default Windows PATH and a\ngate that degrades where its dependency is missing is the thing being\nfixed.\n\ngate_conformance.py (template v3) is vendored and run by\nstandard-check, so the guards cannot vanish again. It is structural,\nnot behavioural, and says so.\n\nVerified safely: on a branch with no PR the rollup is empty, so\nmerge-pr refuses before reaching gh pr merge.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T21:18:47-07:00",
          "tree_id": "09cf28f2dd68d69de2931ed6e287f3ca4b42fd13",
          "url": "https://github.com/l1a/retch/commit/25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a"
        },
        "date": 1786595829945,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 722727469,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1015.7052614926224,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.79516630897197,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94671163975639,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.06407677174768,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7854.185377403519,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71534.85109595128,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4811.818695357251,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4911.227248918067,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1054349.5650604027,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 351.5395037530974,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 278.2426212708662,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "120ed8e2e0fe45a624212a8204ae34b082b8c360",
          "message": "Add keyboard, mouse and tpm fields (#195)\n\n* Add keyboard, mouse and tpm fields\n\nThree NOTES.md section 6 fastfetch-gap fields, all --long and above,\nLinux-only, in the v0.5.0 shape: thin /proc and sysfs readers over pure\nhelpers that unit-test without touching host hardware.\n\nInput classification is exclusive and declines to guess. On a Logitech\nUnifying/Bolt receiver no kernel-visible signal separates a keyboard from\na mouse: handlers, capabilities/rel (0x1943 on both), the alphabet key\nblock, INPUT_PROP, udev ID_INPUT_* (POINTINGSTICK on both), USB HID\nbInterfaceProtocol and the HID report descriptor itself are all identical\nfor an MX Keys and an MX Master 3. fastfetch 2.66 gets this wrong in both\ndirections on that hardware. Ambiguous devices are resolved via the HID++\ndriver's battery model_name and, failing that, reported in neither field\nrather than asserted into the wrong one.\n\ntpm reads tpm_version_major and maps it to the published spec names\n(1 -> 1.2, 2 -> 2.0), returning None for anything unrecognised.\n\nAlso refresh packaging/aur/PKGBUILD, stranded at 0.6.12 for eleven\nreleases while the AUR moved to 0.6.23, and drop its man-page\nregeneration: the font-strip sed never matched on any platform (GNU sed\nreads \\\\f as a form feed) and $DATE/$pkgver were literal inside double\nquotes, so the installed footer read \"retch $pkgver\". The committed\ndocs/retch.1 ships in the tarball with the correct footer, so package()\ninstalls it directly and the mandown makedepend is gone.\n\nStrata golden counts move Long 49->52, Full 55->58. 11 new unit tests.\nVerified live on corrino (Fedora 44, i7-1360P).\n\nAssisted-By: Claude Opus 5\n\n* Close two holes in the aur CI job\n\nThe job rewrote source= and sha256sums= to build from local sources, so the\ndeclared checksum was never checked by anything — a stale one (as this\nPKGBUILD carried for eleven releases) stayed green and would only fail for\nsomeone installing from the AUR. Verify it against the real tag tarball\nbefore that patching, refusing a committed SKIP and skipping cleanly when the\ntag is not published yet.\n\nNothing inspected the packaged man page either, which is where both defects\nthis branch fixes actually showed. Assert the built package's .TH line carries\nno literal $ and a real retch <version> footer, and that no doubled font runs\nsurvive.\n\nAlso stop pre-installing mandown, so makedepends is load-bearing: makepkg -s\ninstalls what the PKGBUILD declares and nothing else.\n\nAssisted-By: Claude Opus 5\n\n* Fix the man-page check failing on a correct package\n\nThe new verification step used `bsdtar -tf \"$pkg\" | grep -qx …` under\n`set -o pipefail`. grep -q exits on its first match, bsdtar takes SIGPIPE and\nexits 141, and pipefail turns that into a failed pipeline — so the step\nreported the man page missing exactly when it was present, and CI went red on\na package that was correct. head -1 and grep -m1 carry the same hazard.\n\nMaterialise the listing and the page to files and grep those; select the\npackage with find -print -quit. Verified against a good package and against\npurpose-built broken ones (missing page, literal $ footer, doubled font runs).\n\nAssisted-By: Claude Opus 5\n\n* Match the gzipped man page makepkg actually ships\n\nmakepkg's zipman option is on by default, so the packaged path is\nusr/share/man/man1/retch.1.gz. The verification step looked for retch.1 and\nreported it missing — the check wrong again, the package correct again.\n\nMatch retch.1 with an optional .gz/.zst/.xz/.bz2 suffix and decompress before\ninspecting. Tested against gzipped, uncompressed, and gzipped-but-broken\npackages.\n\nThe diagnostic added in the previous commit is what made this cheap: printing\nthe real usr/share listing on failure named retch.1.gz directly in the CI log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T09:49:12-07:00",
          "tree_id": "274aff11102cf1108fb49cbe2f4d8beedda7b477",
          "url": "https://github.com/l1a/retch/commit/120ed8e2e0fe45a624212a8204ae34b082b8c360"
        },
        "date": 1786726946020,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 666220796.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1015.3469779911738,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.35858618988081,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946908840537577,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 51.684849162876766,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7846.4359705534025,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70107.3626143663,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4762.205355108594,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4888.496305339596,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1066007.695452116,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 336.3903467798326,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 287.37870408585445,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0fb38978e0182c24717fea4d8b4a80047b15d233",
          "message": "Make packaging/aur the source, not a stale copy (#196)\n\npackaging/aur/PKGBUILD was a reference copy that nothing rendered, published or\nchecked. It reached eleven releases of lag (0.6.12 in-repo against 0.6.23\npublished), and because the copy was inert the live AUR PKGBUILD kept two\nman-page defects long after they were fixed here — Arch installs got a page\nfooted $DATE / retch $pkgver the whole time.\n\npackaging/aur is now the source. aur-bump renders it from a released tag,\naur-publish pushes exactly those files, and .SRCINFO is tracked and generated\nby a real makepkg --printsrcinfo in a container (no host here runs Arch).\nCarried over from rusticprofile: write to a temp file and move it into place so\na failure cannot truncate the committed file, check the output content rather\nthan the exit code, and mount :z never :Z.\n\nscripts/aur_check.py is the anti-drift guard and just check depends on it. It\ncompares the pair field-by-field including the expanded source URL, so it\ncatches a pair that agrees on the version and disagrees on the checksum — the\nshape that breaks on the user's machine and nowhere else. Pure Python, so it\nruns on Windows; parses rather than sourcing the PKGBUILD, and raises rather\nthan expanding unknown variables to empty.\n\nVerified end to end: the generated .SRCINFO came out byte-identical to the one\nhand-written and pushed to the AUR earlier today, and AUR_CONFIRM=n\njust aur-publish exercised every preflight check without publishing.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T10:43:28-07:00",
          "tree_id": "0dcac6b08b8ab4bb34654fbcf6096f083db1f748",
          "url": "https://github.com/l1a/retch/commit/0fb38978e0182c24717fea4d8b4a80047b15d233"
        },
        "date": 1786730258525,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 955791225.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 991.9523234932892,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.08795138778319,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946803883709887,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 51.49122086398518,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7847.007215206077,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70444.39792184407,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4802.029150650256,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4912.538755336975,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1078246.2867952182,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.2824961228451,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.905228578398,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9b8bcc71daafe3d38abb8ba9085195eef680d68f",
          "message": "Native Media and Player Detection (#197)\n\n* Add native media and player detection fields\n\nImplement 100% native FFI / direct socket media and player detection with zero subprocess forks across Windows (WinRT COM GlobalSystemMediaTransportControlsSessionManager via combase.dll), Linux (direct Unix domain socket D-Bus MPRIS client), and macOS (Objective-C runtime SBApplication FFI).\n\nAdds 'player' and 'media' to FIELDS registry (Mode::Long, available in --long and --full). Strata golden counts Long 52 -> 54, Full 58 -> 60. Regenerated man page, updated README.md, docs/retch.1.md, NOTES.md, WIP.md, and GitHub wiki.\n\nAssisted-By: Gemini 2.5 Flash\n\n* Fix Rust 1.97 Clippy lints in media.rs\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:19:02-07:00",
          "tree_id": "5f6c7da98e5d1a0862003b59cc74c4130d097866",
          "url": "https://github.com/l1a/retch/commit/9b8bcc71daafe3d38abb8ba9085195eef680d68f"
        },
        "date": 1786933982343,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 756272133.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 989.9387419388777,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.21922246355011,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9471003415263795,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 51.64803585439525,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7753.334152616754,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70197.36184315637,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4761.946552323507,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4834.831584794667,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1040162.1026756248,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 355.5563188642969,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 267.92956443601815,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ed45ec18928bf19b4add811c3f8a567211932073",
          "message": "Add README and crate metadata for retch-sysinfo (#198)\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:39:49-07:00",
          "tree_id": "13cd0a580de7afdb2209726aa2a026b4079579a6",
          "url": "https://github.com/l1a/retch/commit/ed45ec18928bf19b4add811c3f8a567211932073"
        },
        "date": 1786935184140,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 881220733.5,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 991.4095679988501,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.88394355041862,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9465344635110724,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 51.67229965612167,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7798.791212161459,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70374.6665461292,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4764.287259393101,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4893.229934916915,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1032256.7676218168,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 355.83692659824965,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 273.5615613297674,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "f75989c777d19ce11a71c02c17a50e959cdb94cb",
          "message": "aur: bump to 0.8.0\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:47:18-07:00",
          "tree_id": "6e84e4f067d36b437236a783f86e1b1b04a441ca",
          "url": "https://github.com/l1a/retch/commit/f75989c777d19ce11a71c02c17a50e959cdb94cb"
        },
        "date": 1786935742070,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 872864602.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1005.5882187336281,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.89291597445379,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946794597777582,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 51.65238926298614,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7934.2828098494165,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71707.51798106654,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4822.659230928998,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4892.567589725527,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1039828.962229933,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 355.62757634456136,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 275.13230132533965,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e42fb854db13c202146dc739849f67429547ebf9",
          "message": "deps: bump dependencies (consolidate #199) (#200)\n\nConsolidate Dependabot PR #199:\n- clap_complete_nushell 4.6.1 -> 4.6.2\n- icy_sixel 0.5.0 -> 0.5.1\n- Cargo.lock transitive dependency updates\n- Bump retch-cli to 0.8.1 and regenerate man page\n\nAssisted-By: Gemini 3.7 Flash",
          "timestamp": "2026-08-21T15:33:39-07:00",
          "tree_id": "f4dea1009382aed406875e53dbf14115c540f5df",
          "url": "https://github.com/l1a/retch/commit/e42fb854db13c202146dc739849f67429547ebf9"
        },
        "date": 1787352525510,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 823809281.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 969.7362863558008,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 111.79271880571034,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946691806082886,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.252188739558605,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7818.095962426621,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70429.90154127247,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4778.5372011314685,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4877.391668139681,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1066784.2116893257,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 353.71070247079314,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.22390900424864,
            "unit": "ns"
          }
        ]
      }
    ],
    "macOS Arm64 Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7a3b029a318196f57111112492235841e6692d8c",
          "message": "Reword WIP resetâ†’update, rename wip script (#141)\n\nWIP.md is an ongoing rolling log, not reset per-PR. Align the docs and\ntooling with that: AGENTS.md Â§5 and the just merge-pr recipe now say\n\"update\" instead of \"reset\", and scripts/reset_wip.py is renamed to\nscripts/update_wip.py (git mv; behavior unchanged â€” it still only\nrewrites the Active-Branch and latest-commit lines).\n\nAlso folds in the NOTES.md Â§5 \"real hardware benchmark section\" backlog\nitem. Docs/tooling only; no Rust source touched.\n\nVersion bumped 0.3.40 â†’ 0.3.41 (patch); man page + Cargo.lock regenerated.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:14:33-07:00",
          "tree_id": "3985c178b81541f77e250902c4997776fb98a214",
          "url": "https://github.com/l1a/retch/commit/7a3b029a318196f57111112492235841e6692d8c"
        },
        "date": 1783733627008,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 919227012.6,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 422.87682039663804,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 72.01983927196825,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8709869532044678,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 69.03969702966933,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6381.254086100959,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1474.9309699811984,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 413.50073218398074,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 123282.65812387157,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.5571976325304,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2",
          "message": "Fix update_wip.py stale-pointer regex + UTF-8 (#142)\n\nThe post-merge WIP updater matched an obsolete \"**Latest commit on\nmain**:\" line that no longer exists, so the substitution silently\nno-op'd and left \"**main HEAD**:\" stale after every `just merge-pr`\n(seen live after #141). Retarget the regex to \"**main HEAD**:\", rewrite\nin the current format (`<hash>` â€” <subject> â€” **v<version>**) with the\nversion read from Cargo.toml, using a function replacement so metachars\nin the subject are literal.\n\nSince the fix now writes the commit subject into WIP.md, and this repo's\nsubjects contain \"â†’\"/em-dashes, pin UTF-8 on read_text/write_text,\nsubprocess decoding, and stdout â€” otherwise cp1252 (the default Windows\nconsole/locale where merge-pr runs) crashes the script. Verified\nend-to-end against a subject containing \"â†’\".\n\nAlso gitignore __pycache__/*.pyc.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:31:45-07:00",
          "tree_id": "2db4346561186354ab7202a4b36fa637426c79f1",
          "url": "https://github.com/l1a/retch/commit/fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2"
        },
        "date": 1783734719017,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 788380816.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 393.4757599010065,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.55513200569807,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6577860820120094,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.17756738763275,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4769.211149974831,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1216.705494635657,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 392.8589333697488,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 64136.6834059697,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 323.55011096444116,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9f639d38da27f892e183f9fa1e0f77d57cdfdcad",
          "message": "update_wip.py: bound subs with count=1 (#143)\n\nFollow-up to #142. The retargeted `**main HEAD**:` regex had no count,\nso it rewrote every line containing the header string â€” and WIP.md's\nopen-task prose mentions it verbatim, so the #142 merge clobbered those\ntask lines. Pass count=1 to both re.sub calls (Active-Branch and\nmain-HEAD) so only the first top-of-file header occurrence is rewritten.\nVerified end-to-end against a sample with the header in both a header\nline and later prose.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:05:40-07:00",
          "tree_id": "e1d68a1f542a32e88f5f5adaece7b1b06c929de4",
          "url": "https://github.com/l1a/retch/commit/9f639d38da27f892e183f9fa1e0f77d57cdfdcad"
        },
        "date": 1783740432758,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1040152256.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 413.36824147991763,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 64.5195627238358,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7533143815580083,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.7125732361218,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5096.306903220017,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1348.9142900818558,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 416.8863075005217,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 74690.96821636384,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 343.7571757296781,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab",
          "message": "Drop PowerShell spawn in Windows net detection (#144)\n\ndetect_active_interface_and_local_ip shelled out to PowerShell\n(Get-NetRoute) on Windows to name the default-route interface. That\nspawn costs ~977ms (PowerShell startup) and, since the `net` field is in\nevery mode, dominated runtime — `retch --short` was ~1.15s, ~11x over\nits <100ms target and ~20x slower than fastfetch.\n\nDerive the active interface instead from the adapter whose\nsysinfo-reported IPs include the outbound local_ip (already resolved via\nthe UDP-connect trick) — no spawn, no new dependency, no FFI. Extracted\na pure match_active_interface helper with a unit test. Resolves to the\nsame interface as before (verified on Windows).\n\nMeasured (AMD Ryzen AI MAX+ 395, Win 11): --short 1149ms -> 163ms (~7x).\nretch-sysinfo bumped 0.1.33 -> 0.1.34 (library behavior change).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:42:31-07:00",
          "tree_id": "e39a81d2e6892fa08bbcacc34138d13dd5af8989",
          "url": "https://github.com/l1a/retch/commit/cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab"
        },
        "date": 1783742623750,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1095601056.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 444.7481775804713,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 68.53139092261051,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8007473460377752,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 81.59713591392294,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4650.169017065142,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1069.8580411989137,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 426.7952799469105,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 88496.42887888325,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 463.8649775404634,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "18f0bfa4e337d9a815662b1383dab85187e1ac5c",
          "message": "Fix bench-cli/bench-compare on Windows (#145)\n\nThe bench recipes passed a POSIX-style './target/release/retch' to\nhyperfine. With no --shell, hyperfine uses cmd.exe on Windows, which\ncan't execute that path (forward slashes, no .exe), so it exited 1 in\nthe first warmup run and aborted the recipe. retch itself was fine and\n`just bench` (criterion) was unaffected.\n\nAdd an os_family()-selected `retch_release_bin` variable\n('target\\release\\retch.exe' on Windows, './target/release/retch'\nelsewhere) and route all bench hyperfine calls through it. Verified both\nrecipes now run to completion on Windows.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T21:26:47-07:00",
          "tree_id": "b2195da8db613809ef3a732f524156e3dd175501",
          "url": "https://github.com/l1a/retch/commit/18f0bfa4e337d9a815662b1383dab85187e1ac5c"
        },
        "date": 1783745210564,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1063105356.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 501.2534185316399,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 75.23638732627103,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.0042035806298544,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.7924033270107,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4236.793036242129,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1097.7579876287875,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 500.0437207504714,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 74700.02450072709,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 352.4320201575108,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c57409d318756bf9bf92ee798f438e2c2e4747fd",
          "message": "Use native Win32 IOCTLs for Windows phys-disk (#146)\n\nReplace the Get-PhysicalDisk PowerShell spawn (~1.7s of interpreter\nstartup) in retch-sysinfo's Windows physical-disk detection with direct\nstorage IOCTLs over \\.\\PhysicalDriveN, via hand-written extern \"system\"\nFFI matching the crate's existing style (win_reg.rs) — no new dependency.\n\nEach drive is opened with zero desired access and only FILE_ANY_ACCESS\nquery IOCTLs are used (IOCTL_STORAGE_QUERY_PROPERTY for model/bus type +\nseek penalty, IOCTL_DISK_GET_DRIVE_GEOMETRY_EX for size), so no elevation\nis required. Classification and label format are unchanged; the model\nstring reproduces Get-PhysicalDisk's FriendlyName. Verified byte-identical\noutput; --fields phys-disk ~1684ms -> ~210ms on an AMD Ryzen AI MAX+ 395.\n\nAlso fix a gate/CI blind spot found while verifying this: a bare\n`cargo test`/`cargo clippy` at the workspace root only covers retch-cli\nand silently skips the retch-sysinfo member (where this change lives).\nThe just recipes (test/lint/check + the pr steps) and both rust.yml CI\njobs now pass --workspace; AGENTS.md 4.0/4.1 document why.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T12:51:19-07:00",
          "tree_id": "02202ebbc2cd99020a9d56bc36db81f79b1aa906",
          "url": "https://github.com/l1a/retch/commit/c57409d318756bf9bf92ee798f438e2c2e4747fd"
        },
        "date": 1783800684853,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1059344439.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 405.9489857784064,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 63.85072316083606,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7782395218988216,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.45515781797324,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4370.753760277608,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1051.3023104951694,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 383.00381074437917,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 76092.74953342804,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 363.2387862311278,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e7427ff1a1011473cda36ef463893d8a10dea342",
          "message": "Read SMBIOS natively for Windows phys-mem (#147)\n\n* Read SMBIOS natively for Windows phys-mem\n\nReplace the two Get-CimInstance Win32_PhysicalMemory / Win32_ComputerSystem\nPowerShell spawns (~600 ms) with GetSystemFirmwareTable('RSMB') (kernel32),\nparsing SMBIOS type-17 (Memory Device) structures directly, plus\nGlobalMemoryStatusEx as the VM total-memory fallback. Hand-written\nextern \"system\" FFI matching win_reg.rs — no new dependency.\n\nA pure parse_smbios_type17 fn does a bounds-checked walk of the structure\ntable (formatted area + double-null-terminated string set) and carries the\nunit tests. Now also surfaces the SMBIOS Configured Memory Speed field\n(offset 0x20), so Windows shows running-vs-rated speed when they differ\n(e.g. \"8x 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)\"), matching Linux; the\nold WMI path only reported the rated speed.\n\n--fields phys-mem ~597ms -> ~152ms on an AMD Ryzen AI MAX+ 395; output\nverified against Get-CimInstance Win32_PhysicalMemory.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix clippy byte-str lint on RSMB signature\n\nRust 1.97's clippy flags `[b'R', b'S', b'M', b'B']` (can be a byte str).\nUse `*b\"RSMB\"` instead. Local toolchain was 1.96 so `just check` passed\nlocally but CI (1.97) failed clippy; bumped local toolchain to match.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T13:32:19-07:00",
          "tree_id": "dde402b0cc3e8c191c71996d19858d5d403cf3b0",
          "url": "https://github.com/l1a/retch/commit/e7427ff1a1011473cda36ef463893d8a10dea342"
        },
        "date": 1783803251444,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 841175608.4,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 383.52003474358065,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.347998995899275,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6827563430657242,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.491774145012286,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4203.570074613425,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 976.6347766173252,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 382.6657377186554,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 67531.3524954061,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 327.0612924242334,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36888f89870197b2e040c9178970859ffc467c42",
          "message": "Detect Windows bluetooth natively (bthprops) (#148)\n\nReplace the PowerShell spawn (Get-Service bthserv + two Get-PnpDevice\n-Class Bluetooth queries, ~1.8s) with native Win32:\n- power state from the bthserv service via the Service Control Manager\n  (advapi32),\n- adapter hardware name via SetupAPI enumeration of the Bluetooth device\n  class (links setupapi),\n- connected devices via the classic bthprops API (BluetoothFindFirstDevice\n  with fReturnConnected; links bthprops).\n\nHand-written extern \"system\" FFI, no WinRT and no binding crate. The\ndevice-info struct layout was validated at runtime before trusting the\ncount. A pure format_windows_bluetooth fn carries the unit tests.\n\nBehavior change: \"N connected\" now counts actually-connected devices\nrather than the old count of all paired/present Bluetooth PnP nodes (which\nthe old code mislabeled as connected). Adapter name unchanged. On an AMD\nRyzen AI MAX+ 395: --fields bluetooth ~1765ms -> ~150ms; --long 3462 ->\n2934ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:06:28-07:00",
          "tree_id": "ad23df51a0dfa2097d5eeb928be7307ad5c07e92",
          "url": "https://github.com/l1a/retch/commit/36888f89870197b2e040c9178970859ffc467c42"
        },
        "date": 1783812363274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 970564177.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 394.7988755906464,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.2197518273649,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6720074638723847,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.83064487281475,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4085.0576107290085,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 987.5504775473888,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 388.99615197805133,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 64128.44016015576,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 325.5187035786438,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dfa18d3ba7b91698f61b34f76aaf85b3bd479271",
          "message": "Drop serial CPU-usage sleep on Windows (#149)\n\nCPU usage needs a delta between two samples. sysinfo enforces a ~200ms\nminimum interval, so collect() slept 200ms then refreshed — and that\nsleep ran serially AFTER the concurrent probe scope, adding ~200ms to\nevery standard/long run.\n\nOn Windows, sample GetSystemTimes (kernel32) just before the scope and\ndiff against a fresh sample at the usage-computation point: the existing\ncollection window is the delta, so no dedicated sleep is added. A ~100ms\nfloor is topped up only when the window is shorter (e.g. an isolated\n`--fields cpu-usage`) so a tiny request reads a real value instead of\nGetSystemTimes quantization noise. A pure usage_percent helper carries\nunit tests. Linux/macOS keep the sysinfo+sleep path (its min interval\nmakes the window-diff unreliable there).\n\nOn an AMD Ryzen AI MAX+ 395: standard mode 1757ms -> 1558ms; isolated\n--fields cpu-usage ~340ms -> ~253ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:26:38-07:00",
          "tree_id": "ff94a5086c547509df94d6fc37722dd5e6667f45",
          "url": "https://github.com/l1a/retch/commit/dfa18d3ba7b91698f61b34f76aaf85b3bd479271"
        },
        "date": 1783813666684,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1067157347.85,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 425.36687966893095,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 81.94290190821317,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9156594605745956,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.19437139778418,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5096.281490512079,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1507.5220506309238,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 430.1754629589016,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 75368.88917884036,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 353.44810705987635,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cae94eb0c09e6b2f4675d84cbd239d3ed13b6926",
          "message": "Detect Windows camera natively (SetupAPI) (#150)\n\nReplace the camera PowerShell spawn (Get-PnpDevice -Class Camera,Image\n-PresentOnly, ~1.36s) with a new shared win_setupapi module that enumerates\npresent devices in a setup class via SetupDiGetClassDevsW +\nSetupDiGetDeviceRegistryPropertyW (links setupapi) — the native equivalent\nof Get-PnpDevice -PresentOnly. Camera enumerates the Camera and Image\nclasses and reuses the existing is_real_camera / clean_camera_name / dedup\nlogic. bluetooth (which introduced a private SetupAPI copy) is refactored\nonto the shared module, removing the duplication (mirrors win_reg.rs).\n\nHand-written extern \"system\" FFI, no binding crate. Verified against\nGet-PnpDevice (all real cameras; IR camera filtered as before); bluetooth\nadapter name unchanged after the refactor.\n\nCamera was the last standard-mode PowerShell pole, so this completes the\nWindows native-FFI migration: on an AMD Ryzen AI MAX+ 395, --fields camera\n~1359ms -> ~155ms and standard mode 1558ms -> 273ms. retch now beats\nfastfetch in standard mode (273 vs 1348ms) and is at parity in --long.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:26:15-07:00",
          "tree_id": "dc9eca701a17186aff929c1b979a8956c13aed61",
          "url": "https://github.com/l1a/retch/commit/cae94eb0c09e6b2f4675d84cbd239d3ed13b6926"
        },
        "date": 1783835243159,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1253265787.35,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 548.1716400036505,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 75.70240485322843,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.2773375567351186,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 72.0440486080839,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5967.154141328651,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1441.0843390549626,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 525.4027344417523,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 127968.1656801129,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 426.79860357574955,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ae3ecffd014bc206189c58e5b613f8ff4e0b66d",
          "message": "Add FFI struct-layout assertion tests (#151)\n\nFollowing the Windows native-FFI migration (#146-#150), the pure parsers\nare well unit-tested but the #[repr(C)] FFI structs the OS reads/writes by\noffset were only runtime-verified. Add size_of + targeted offset_of!\nassertions for each: disk (StoragePropertyQuery, StorageDeviceDescriptor\nincl. bus_type/vendor/product offsets, DeviceSeekPenaltyDescriptor,\nDiskGeometryEx incl. disk_size), memory (MemoryStatusEx), bluetooth\n(ServiceStatus, DeviceSearchParams, SystemTime, DeviceInfo incl.\nf_connected/sz_name), fetch (win_cpu::FileTime), win_setupapi\n(SpDevinfoData, already present).\n\nThese catch accidental field-reorder/padding regressions at test time —\nthe failure mode the parse tests can't (the phys-mem 0x14->0x15 offset bug\nin #147 was found only by runtime comparison). Test-only, no runtime\nchange; runs on Windows CI since the structs are cfg(windows).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:52:26-07:00",
          "tree_id": "1d42a683cfb643a99870fca57f865d9e88b409e0",
          "url": "https://github.com/l1a/retch/commit/2ae3ecffd014bc206189c58e5b613f8ff4e0b66d"
        },
        "date": 1783836778438,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1020528025.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 433.4274825929104,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 70.56852115938759,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.0640509061139154,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 78.73422878806353,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5125.340445035705,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1192.165103876398,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 410.9455192201552,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 77159.92278037203,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 361.6017771499298,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "744c0dcd3c15ea67803948e0372c5229715b4783",
          "message": "Fix upload_local_bench.py cp1252 crash on Windows (#152)\n\njust bench-upload and the post-merge hook crashed on Windows with\nUnicodeDecodeError: 'charmap' codec can't decode byte 0x9d — so no local\nWindows \"real hardware\" numbers reached the gh-pages benchmark dashboard.\nThe gh-pages data.js is UTF-8 (commit messages embed arrow/em-dash chars)\nbut open() used the default cp1252 encoding on Windows.\n\nPin encoding=\"utf-8\" on every file operation (data.js read + write, the\nhyperfine JSON temp read) and on run_capture's subprocess text decoding\n(git log --format=%B), plus a sys.stdout.reconfigure UTF-8 guard. Same fix\nclass as scripts/update_wip.py (#142).\n\nVerified: the crash reproduces on the live data.js under the default\nencoding; the UTF-8 read succeeds (845 KB) and append_entry /\ngit_commit_info run without error.\n\nTooling-only; no Rust source touched, retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:01:43-07:00",
          "tree_id": "d579527f5693db2e5215b8c7e6ddfa52671a60fd",
          "url": "https://github.com/l1a/retch/commit/744c0dcd3c15ea67803948e0372c5229715b4783"
        },
        "date": 1783866201656,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1066526531.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 419.9997746957699,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 63.856899300636236,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7710480064330902,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.1087931061673,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4348.5463605615705,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1055.5871250011621,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 409.76536173765044,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 73472.03851439418,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 406.5595933846654,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6c384b96645a8d096e3c0f7a55be58958363939a",
          "message": "Bump version to 0.4.0 (milestone release) (#153)\n\nMinor version bump (0.3.52 -> 0.4.0) marking the completed Windows\nnative-FFI migration and the first GitHub Release since v0.3.40 (rolls up\n#141-#152). Version-marker only — no code change; retch-sysinfo stays at\n0.1.40 and crates.io remains intentionally held.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:46:27-07:00",
          "tree_id": "53e438ffe42566998097d0bc24ec6bd506b380bf",
          "url": "https://github.com/l1a/retch/commit/6c384b96645a8d096e3c0f7a55be58958363939a"
        },
        "date": 1783868871582,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1104331943.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 454.3846540409539,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 71.15743131917853,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9186784175701888,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 74.7270062810611,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5746.901479045938,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1107.1855316183262,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 404.8277243514332,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 125759.6657699986,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 428.86328272406,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88162b293638dfad573a4b63f046cd27aca023f4",
          "message": "Bump to 0.4.1; fix license SPDX for crates.io (#154)\n\nCorrect the deprecated `license = \"GPL-3.0\"` to `GPL-3.0-or-later` in both\ncrate manifests (matching the SPDX-License-Identifier headers in the\nsource) ahead of publishing to crates.io, where per-version license\nmetadata is permanent.\n\nBump retch-cli 0.4.0 -> 0.4.1 and retch-sysinfo 0.1.40 -> 0.1.41 (v0.4.0\nis already tagged, so the license fix requires a new version). No\nfunctional code change. This is the version published to crates.io,\nreversing the prior GitHub-Release-only hold.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T08:27:56-07:00",
          "tree_id": "20fc220a727f5d7f59bb468da3002cf8631afc81",
          "url": "https://github.com/l1a/retch/commit/88162b293638dfad573a4b63f046cd27aca023f4"
        },
        "date": 1783871336820,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1863323983.4,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 412.26741821785197,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 64.0248405238015,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.768359382236476,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.92178055608497,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4371.569839082259,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1049.0294302033485,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 387.42882333308654,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 73476.00836774713,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 352.57126307843583,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84a7d7c354231007c97f94f25b262266bb64e146",
          "message": "Fix machine-dependent format_cpu_cores tests (#155)\n\n`format_cpu_cores` reads the host's real CPU topology (Linux /sys cpufreq,\nmacOS hw.perflevel*) and returns a \"NP + ME / KT\" hybrid string on Intel P/E\nand Apple Silicon machines, ignoring its passed-in (logical, physical) counts.\nThe four fallback unit tests called it with fixed args, so they passed on\nnon-hybrid CPUs/CI runners but failed on a hybrid host — an i7-1360P produced\n\"8P + 8E / 16T\" for (16, Some(8)) where the test expected \"8C / 16T\", hard-\nfailing `just pr` there.\n\nExtract the pure fallback into `format_cpu_cores_plain` and retarget the four\ntests at it, so they no longer depend on the runner's hardware. Public\nbehavior of `format_cpu_cores` is unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:41:15-07:00",
          "tree_id": "26f59d72e69fb5f71508fb9427bd765258b160f2",
          "url": "https://github.com/l1a/retch/commit/84a7d7c354231007c97f94f25b262266bb64e146"
        },
        "date": 1783908166080,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1268805495.7,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 437.2758032985792,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 69.38533311744068,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.2341490914861044,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 77.05160605970542,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5312.277769408474,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1285.6010052399881,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 424.29145886927245,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 93533.13671799103,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 400.306397520917,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be732f18be8ed35c252a364cc1241d542d0962ef",
          "message": "Enforce LF line endings via .gitattributes (#156)\n\nThe working tree is shared across Linux/macOS/Windows via Syncthing. With no\n.gitattributes and core.autocrlf=false, a Windows checkout wrote CRLF, Syncthing\npropagated those bytes to the Linux clones, and git reported the entire tree as\nmodified — a phantom 13811+/13811- whole-tree diff with zero content changes\n(git diff --ignore-all-space empty). This blocked the just-pr clean-tree checks.\n\nAdd `* text=auto eol=lf` to force LF on checkout on every OS (essential for a\nbyte-identical Syncthing-shared tree) and `*.png binary` to protect the logo\nassets. HEAD was already stored as LF, so no tracked content changes.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:59:28-07:00",
          "tree_id": "09a0473cae06eab0155f9d17e371c9dc4271dea9",
          "url": "https://github.com/l1a/retch/commit/be732f18be8ed35c252a364cc1241d542d0962ef"
        },
        "date": 1783909310282,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1143722337.55,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 436.0555918395239,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 70.0153164494777,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8650567208503692,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 67.03286951545802,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4914.611129772576,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1402.116795759601,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 406.9229762484166,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 107357.36749659493,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 375.97125511830757,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "280db85bc07aaa37fe6e22c1428c57d3a95ba55b",
          "message": "Add Linux login-manager/brightness/power-adapter (#157)\n\nThree new --long fields closing NOTES §6 fastfetch gaps, each a cheap\nsingle-source Linux probe in the sequential detect_* style (like init/chassis):\n\n- login-manager: resolves the display-manager.service systemd unit symlink\n  (GDM/SDDM/LightDM/greetd/…), prettified.\n- brightness: reads /sys/class/backlight/*/{brightness,max_brightness} as a %.\n- power-adapter: reads the Mains supply under /sys/class/power_supply (name +\n  connected state; wattage omitted — sysfs Mains rarely exposes it).\n\nAll three are Linux-only (None elsewhere). Each detector wraps a pure helper\n(login_manager_from_unit / brightness_percent / format_power_adapter), split\nout and unit-tested host-independently per the v0.4.2 format_cpu_cores lesson;\nhelpers + tests are cfg(linux) so they aren't dead code under clippy -D warnings\non other platforms. Verified live on corrino (greetd, 51%, AC (connected)).\n\nretch-cli 0.4.3 -> 0.5.0, retch-sysinfo 0.1.42 -> 0.1.43.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T20:11:45-07:00",
          "tree_id": "c4f4b86a753026bf48a3009deb1ece1f46ea99bc",
          "url": "https://github.com/l1a/retch/commit/280db85bc07aaa37fe6e22c1428c57d3a95ba55b"
        },
        "date": 1783913583103,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 916254051.95,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 509.4862311363057,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 67.97334572835894,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7673154649928526,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 67.87601220362099,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4334.511995071352,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1030.708106174061,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 400.39606997851234,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70358.53768879801,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 339.88925279551245,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbb9672b8c95616671974128187d9d3b32f0fe53",
          "message": "Fix network status bracket color nesting (#158)\n\nowo_colors closes every foreground color with the default-reset \\x1b[39m, so\nthe green \"Up\" / red \"Down\" embedded in the Net value cancelled the enclosing\nvalue color (and, for the active interface, the bright-blue highlight). Everything\nafter [Up] fell back to the terminal default: the active line's opening [ was blue\nbut the closing ] and the RX/TX stats were not.\n\nAdd colorize_nested(text, prefix) which re-asserts the enclosing color after every\ninterior \\x1b[39m so nested colored spans restore the surrounding color instead of\nfalling to default. It is byte-identical to the old plain wrap when there is no\nnested reset, so only the Net field's rendering changes. Theme::color_value routes\nthrough it and the active-interface highlight uses ACTIVE_IFACE_PREFIX. The library\nnetwork.rs is untouched. Four regression tests cover the helper.\n\nBump retch-cli to 0.5.1 (retch-sysinfo unchanged at 0.1.43); regen man page.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T21:49:19-07:00",
          "tree_id": "15c36368910c46efd1ba4d0a4f43df2b81c63aa0",
          "url": "https://github.com/l1a/retch/commit/fbb9672b8c95616671974128187d9d3b32f0fe53"
        },
        "date": 1783919373753,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 771281975.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 415.6456687275747,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 72.67613568060668,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8507210507630887,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.705384193066664,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4257.955209606525,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1054.8313787695529,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 394.98030362141645,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71207.64268886857,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 360.1226709791345,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c4f762eed77a36ac3d95a1beb6a4cab62afb2965",
          "message": "Add Windows domain and terminal-size fields (#159)\n\nTwo --long fields that previously returned None on Windows now have\nnative arms — the first of the Windows cross-platform-parity feature\nseries (distinct from the completed PowerShell->FFI perf migration).\n\n- domain: primary DNS suffix via GetComputerNameExW(ComputerNameDnsDomain)\n  (kernel32, two-call size probe). A workgroup host's empty suffix maps to\n  None via the pure clean_domain helper — not the NetBIOS WORKGROUP name —\n  matching the Linux/macOS /etc/resolv.conf DNS-domain semantics.\n- terminal-size: console viewport via GetStdHandle + GetConsoleScreenBufferInfo,\n  using the srWindow rect (not dwSize, the scrollback buffer). Pure\n  window_rect_to_size helper does the inclusive-rect -> \"COLSxROWS\" math;\n  piped output has no console -> graceful None -> existing env fallback.\n\nHand-written extern \"system\" FFI, no binding crate (house style); // SAFETY:\non every unsafe. Non-Windows arms untouched. New tests: clean_domain,\nwindow_rect_to_size, and a CONSOLE_SCREEN_BUFFER_INFO size_of layout guard.\nVerified live on arrakis (Windows 11): domain correctly absent (DNS suffix\ngenuinely empty), terminal-size renders 100x40.\n\nretch-cli 0.5.1 -> 0.6.0, retch-sysinfo 0.1.43 -> 0.1.44.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:13:18-07:00",
          "tree_id": "89121134b1cdf90e97f3ba23b740bd744dbf5193",
          "url": "https://github.com/l1a/retch/commit/c4f762eed77a36ac3d95a1beb6a4cab62afb2965"
        },
        "date": 1783978501662,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1056177593.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 483.42202697397505,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 71.12052313973012,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.159769627217704,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 80.09021280323913,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5141.341407907525,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1139.7600678211247,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 447.46380356214723,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 78712.81127130904,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 387.28623695779095,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30195b0eaaf4f96b4b6fe43c11001046a871537b",
          "message": "Fix Windows Camera (scanners) and Users (=0) bugs (#160)\n\nTwo user-reported Windows output bugs in the cross-platform-parity series.\n\nCamera listed scanners as cameras (e.g. \"EPSON ET-3850 Series\"). The Windows\npath enumerated the Camera + Image (WIA) setup classes, but scanners/printers\nshare the Image class with some real webcams (a Logitech BRIO is Image-class),\nand is_real_camera has no keyword to catch an EPSON model string. Fixed by\nenumerating the KSCATEGORY_VIDEO_CAMERA device-interface class instead — only\nreal cameras register it, so scanners are excluded while Image-class webcams are\nkept. Added win_setupapi::present_interface_device_names (DIGCF_DEVICEINTERFACE,\nsharing the existing enumerate_names core) + the KSCATEGORY_VIDEO_CAMERA GUID;\nremoved the now-unused GUID_DEVCLASS_CAMERA/_IMAGE. Also drops the synthetic\n\"Windows Virtual Camera Device\" via a Windows-only is_windows_virtual_camera\nhelper (Linux/macOS untouched).\n\nUsers showed 0 with a user logged in: sysinfo keys Windows users by SID, so the\nUnix uid>=1000 filter never matched. New win_users module counts active\ninteractive sessions via WTSEnumerateSessionsW + WTSQuerySessionInformationW\n(wtsapi32; query-user semantics), with a pure unit-tested count helper. Per the\n\"if it doesn't work, don't show it\" request, display.rs now suppresses Users\nwhen the count is 0 (mirrors the packages guard).\n\nNon-Windows camera/users behavior unchanged. FFI house style (hand-written\nextern \"system\", // SAFETY:, WTS_SESSION_INFOW size_of guard). Verified live on\narrakis: Camera = Logitech BRIO + ASUS FHD webcam only; Users: 1.\n\nretch-cli 0.6.0 -> 0.6.1, retch-sysinfo 0.1.44 -> 0.1.45. Patch (bugfixes).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:46:19-07:00",
          "tree_id": "13dc79f2b8c9dd3041dc8f5dfc070fb42bba266a",
          "url": "https://github.com/l1a/retch/commit/30195b0eaaf4f96b4b6fe43c11001046a871537b"
        },
        "date": 1783980441460,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 883933687.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 416.33934865207095,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.042790402096635,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8259547680098378,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.457243076482484,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4213.901771627012,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1007.5960304824919,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 417.1596853593552,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 68584.51884974656,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 348.52004993879405,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2b4a083ed6b7696bd56727cbcc285ed5ac45030f",
          "message": "Unblock just pr on Linux: tests + man regen (#165)\n\nTwo coupled docs/test-hygiene fixes (no runtime behavior change), bundled\nbecause the first is what lets `just pr` pass on the reinstalled Fedora box.\n\n1. Machine-independent xrandr display tests. parse_xrandr_displays called\n   get_monitor_name_for_port (live /sys/class/drm EDID) inline, so the\n   fixture tests substituted the physically-attached monitor for the\n   fixture's connector name (DP-1 -> the panel's EDID model ATNA33AA08-0).\n   These tests are cfg(not(macos/windows)) and never ran on the old Windows\n   arrakis, so the defect was latent until the first cargo test after the\n   Fedora reinstall. Same class as #155. Extract a pure\n   parse_xrandr_displays_with(stdout, resolve); the public wrapper passes\n   get_monitor_name_for_port (production unchanged) and the tests pass\n   |_| None. Add a regression test asserting the resolver is honored.\n\n2. Regenerate docs/retch.1. The committed page carried double-bold groff\n   runs from the Windows #160 `just man` run, where the recipe's\n   sed 's/\\fB\\fB/\\fB/g' strip did not take effect. Linux regeneration\n   produces the intended single-bold output, matching the recipe's intent.\n\nPatch bump: retch-cli 0.6.2, retch-sysinfo 0.1.46 (new pub\nparse_xrandr_displays_with).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:10:26-07:00",
          "tree_id": "545ecee36947f96e29585e4dcc803424559d5b6b",
          "url": "https://github.com/l1a/retch/commit/2b4a083ed6b7696bd56727cbcc285ed5ac45030f"
        },
        "date": 1784907127151,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 944557939.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 729.188699923306,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 80.3210096875044,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.219312530853153,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 79.95180457772528,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5855.483679378052,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1510.7165539961668,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 615.8581121222073,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 172215.6399762088,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 537.7588427382486,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9cbad3234c6ec06f444e623a84b3ff72efbcd50",
          "message": "Bump deps + CI actions (Dependabot #161/163/164) (#167)\n\nConsolidate three open Dependabot PRs into one gated PR so the release-hygiene\nsteps they bypass (retch version bump, NOTES/man regen) are performed. No\nruntime behavior change.\n\n- Rust deps (#164, cargo-dependencies group, all patch-level, lockfile-only\n  since the Cargo.toml specs are caret ranges): clap 4.6.1->4.6.4 (pulls syn v3\n  via clap_builder/clap_derive), serde 1.0.228->1.0.229, toml 1.1.2->1.1.3,\n  clap_complete_nushell 4.6.0->4.6.1, anyhow 1.0.103->1.0.104,\n  libc 0.2.186->0.2.189, sysinfo 0.39.5->0.39.6, serde_json 1.0.150->1.0.151.\n- actions/checkout 7.0.0->7.0.1 (#163) across benchmark/claude/\n  claude-code-review/packaging/rust/security (both SHA-pinned and @v7 uses).\n- softprops/action-gh-release 3.0.1->3.0.2 (#161) in the rust.yml release job.\n\nretch-cli -> 0.6.3; retch-sysinfo unchanged (0.1.46, no source change).\nWorkspace fmt/clippy/test all green.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:51:12-07:00",
          "tree_id": "0627e675b46ff2705a23fb6064df75bf587aac13",
          "url": "https://github.com/l1a/retch/commit/a9cbad3234c6ec06f444e623a84b3ff72efbcd50"
        },
        "date": 1784909560092,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1260065429.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 633.1207946972198,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 85.43870675348974,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.544991953754507,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 89.3879345483654,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6099.677172203592,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1396.3024140979192,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 486.3295010350588,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 100292.15587956284,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.66930322618157,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c0cf9c9583413e1b1d346274f3367162daef52e",
          "message": "Bump base64 0.22 -> 0.23 (Dependabot #166) (#169)\n\nThe one genuinely-new bump from Dependabot #166 (the other 8 crates in that\ngroup already landed in #167/v0.6.3). A semver-breaking 0.x bump, held out of\nthe v0.6.3 consolidation pending an API check. No runtime behavior change.\n\nbase64 is used only under the optional `graphics` feature (src/logo.rs, two\ngeneral_purpose::STANDARD.encode() sites for the Kitty/iTerm2 inline-image\nprotocol). The Engine encode API is unchanged in 0.23: build + clippy\n-D warnings are clean *with --features graphics* (the default gate does not\ncompile base64), and tests pass with and without the feature. `cargo bench`\nis unchanged (base64 is not on any benchmarked path). Widened the Cargo.toml\nspec \"0.22\" -> \"0.23\" since the caret range wouldn't admit 0.23.\n\nretch-cli -> 0.6.4; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T08:22:25-07:00",
          "tree_id": "5c659664226725eb40ca8c915bafbcf13fe02f12",
          "url": "https://github.com/l1a/retch/commit/7c0cf9c9583413e1b1d346274f3367162daef52e"
        },
        "date": 1784994280131,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1098636125.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 494.24683632424876,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 67.21056877382442,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.2423164918639227,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 83.079240023003,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4889.778871823944,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1073.8542514144283,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 519.922494147058,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 85339.47136071009,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 375.7496564237437,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "586012cefc4c98dfa9ab5b227b0832620797265c",
          "message": "Lint graphics feature in just check (v0.6.5) (#170)\n\nAdd `cargo clippy --features graphics -- -D warnings` to the `check` recipe\n(and therefore the `just pr` gate). The base64 0.22->0.23 bump surfaced that\nbase64/image/icy_sixel and their src/logo.rs call sites live behind the\noptional `graphics` feature, which the default `cargo clippy --workspace`\nnever compiles -- so a graphics-only lint or API break could pass the gate\nunseen. Targets retch-cli (which defines the feature), not --workspace.\n\nTooling only, no runtime change. Closes the LOCAL gate gap; CI still builds\ndefault features, so a CI graphics job would be a separate follow-up.\nretch-cli -> 0.6.5; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:33:31-07:00",
          "tree_id": "f944cee1876f95b5314bfca44f0ba40a154033bb",
          "url": "https://github.com/l1a/retch/commit/586012cefc4c98dfa9ab5b227b0832620797265c"
        },
        "date": 1784998504257,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1203127012.7,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 690.5506254268487,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 73.90300629999662,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8979347074455712,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 89.81535565507677,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6483.621165679588,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1466.2905073649667,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 544.7701623241278,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 112252.23903792942,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 374.86487225103605,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da6c74f858f9d84a8b3b076473c1026f04aef412",
          "message": "Show ASCII logo without a TTY; fix CI dry-run (v0.6.6) (#171)\n\ndisplay.rs gated the logo purely on stdout_is_tty, so `retch --ascii-logo`\nrendered no logo when piped/redirected -- including CI's full-test \"Run\nfetcher (dry run)\" step, which showed no logo.\n\nExtract a pure `should_show_logo(config_show_logo, no_logo, ascii_logo,\nstdout_is_tty)` helper: `--no-logo` always wins; `--ascii-logo` now forces the\nlogo on regardless of TTY or config (ASCII is plain, pipe-safe text, mirroring\nhow --no-logo is always honored); auto mode is unchanged (default-on,\nTTY-gated). --chafa-logo/graphical modes are deliberately not forced (they emit\nterminal-only control sequences).\n\nUpdate the CI full-test dry-run to `cargo run --release -- --full --ascii-logo`\nso it exercises every field AND the ASCII-logo path. 4 new unit tests on the\nhelper; verified live that piped `--full --ascii-logo` shows the logo while\npiped `--full` alone still shows none.\n\nretch-cli -> 0.6.6; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:48:23-07:00",
          "tree_id": "88dc56bcc4160f88dae2e60506f62a93c2ca7ea4",
          "url": "https://github.com/l1a/retch/commit/da6c74f858f9d84a8b3b076473c1026f04aef412"
        },
        "date": 1784999375198,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 925503312.45,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 465.4767836661523,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 66.51013921676086,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9716932844859776,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 75.82437951476786,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4569.236881584677,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1108.0281114539562,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 485.7676284621722,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 83872.1618040034,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 398.09826676765044,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ada1356ee93539a36a2c996eaa23e24c481463a3",
          "message": "Add CI graphics-feature job (v0.6.7) (#172)\n\nThe default `build` matrix never compiles the optional `graphics` feature\n(base64/image/icy_sixel + the src/logo.rs inline-image paths), so a\ngraphics-only lint or API break could pass CI unseen -- as the base64\n0.22->0.23 bump nearly did. v0.6.5 closed this in the local `just check` gate;\nthis closes it in CI.\n\nAdd a dedicated `graphics-feature` job to rust.yml (one ubuntu runner, same\nnon-tag triggers as `build`) running:\n  cargo clippy --features graphics -- -D warnings\n  cargo build  --features graphics --verbose\n\nCI only, no runtime change. retch-cli -> 0.6.7; retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T10:40:12-07:00",
          "tree_id": "ee5c8fdd3c4060bb2ec7f42369695582a0637e23",
          "url": "https://github.com/l1a/retch/commit/ada1356ee93539a36a2c996eaa23e24c481463a3"
        },
        "date": 1785002438834,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 843802627.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 426.3257856463882,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.94074157663491,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7126785046433963,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.765072245529055,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4167.142010162912,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1023.2387956181568,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 389.96287425854416,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63855.79087498064,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 326.93899698268706,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa886633f69e0ee0a7db86ea7dc9773ceec03be9",
          "message": "Keep logo beside text in --long/--full (v0.6.8) (#173)\n\n* Keep logo beside text in --long/--full (v0.6.8)\n\nThe side-by-side vs. stacked layout decision (and the text-column width) was\ncomputed from the widest of ALL info lines. In --long/--full a single very long\nline -- a 150+ char Wi-Fi line, or the Net/Battery lines -- inflated the text\ncolumn past the terminal width and forced the logo to stack ABOVE the text,\neven though those long lines sit well BELOW the logo.\n\nExtract a pure `plan_layout(info_widths, logo_height, logo_width, term_width,\nshow_logo)` that considers only the info lines that actually sit BESIDE the\nlogo (the first `logo_height` rows). Long lines below the logo render at column\n0 with the full terminal width and no longer affect placement.\n\nLogo-type-agnostic: logo_height/logo_width come from the active logo, so it\nworks identically for ASCII, Chafa (both rendered as text `Lines`) and the\ngraphical image protocols (Kitty/iTerm2/Sixel -- height_lines + fixed image\ncolumn).\n\nVerified in a pseudo-terminal: --full renders the logo beside the text at\n140 cols (previously stacked) and correctly stacks at 90 cols. 7 new\nplan_layout unit tests. retch-cli -> 0.6.8; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8\n\n* CI: build-job dry run uses --full --ascii-logo too\n\nThe `build` job's \"Run fetcher (dry run)\" step still ran `cargo run -- --long`\n(no logo). Make it `cargo run -- --full --ascii-logo`, matching the full-test\ndry run, so every CI dry run exercises all fields and the logo/layout path.\n\nAssisted-By: Claude Opus 4.8\n\n* Split Wi-Fi into two lines; grayscale Apple logo\n\nTwo display tweaks requested on top of the layout fix (same PR):\n\n- Wi-Fi: the iw path builds a single \"{adapter} [{iface}] - {SSID} (band/rate)\"\n  string that ran 150+ chars and wrapped into the logo. Split on the \" - \"\n  boundary via a pure `split_wifi_line` into a `Wi-Fi` line (adapter hardware)\n  and a `Wi-Fi Link` line (live connection). Fallback detectors have no \" - \"\n  and stay one line. `Wi-Fi Link` is aliased to the `wifi` field key in\n  should_show (like dns/memory). 3 unit tests.\n\n- macOS/Apple ASCII logo: replace the legacy rainbow colour bands\n  (green/yellow/red/magenta/blue) with a 256-colour grey (silver) ramp,\n  matching the modern monochrome Apple logo. Graphical macos.png untouched.\n\nretch-cli stays 0.6.8 (same PR); retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix graphical logo landing mid-text in --long/--full\n\nThe side-by-side path for image protocols (Kitty/iTerm2/Sixel) printed ALL the\ninfo lines first, then did `\\x1b[{n}A` to move back up and draw the image to the\nright of the top rows. For tall output (--long/--full) the info block is taller\nthan the viewport, so by the time the text finished the screen had scrolled and\nthe cursor-up was clamped at the top of the viewport -- the image was drawn in\nthe MIDDLE of the text, overlapping it (reported on kitty).\n\nDraw the image FIRST instead: move to the top of the logo column, bracket the\nimage draw with save/restore (\\x1b7/\\x1b8) so it lands at the correct row before\nany text is printed or the screen scrolls, then print the info lines\ntop-to-bottom at column 0. The terminal scrolls naturally and carries the\ncell-anchored image with it. Shared `render_graphical_side_by_side` helper for\nall three protocols. Verified the escape choreography (right/save/image/restore/\nCR/text) at the byte level in a kitty pty.\n\nretch-cli stays 0.6.8 (same PR).\n\nAssisted-By: Claude Opus 4.8\n\n* docs(NOTES): record graphical logo placement fix (v0.6.8)\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T17:31:49-07:00",
          "tree_id": "9b82d07a4ddf3e53b29bc8579d9a7acdcf12908e",
          "url": "https://github.com/l1a/retch/commit/fa886633f69e0ee0a7db86ea7dc9773ceec03be9"
        },
        "date": 1785027106424,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1057057083.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 432.0848371634444,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 70.88871973133789,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9419310592315226,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.54825236159782,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4696.390462693857,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1140.9524459675042,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 422.8967600687054,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 89715.13584861395,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 414.12040369339377,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b899b3ca3988eab8b8632cbb3b5263bf35322a76",
          "message": "Fix graphical logo placement after scroll (v0.6.9) (#174)\n\nThe v0.6.8 side-by-side choreography saved the cursor (DECSC), drew\nthe image, and restored (DECRC). With the prompt at the bottom of the\nscreen the draw scrolls the viewport, and DECSC/DECRC restore a\nviewport-relative position, so the info text landed below the logo\ninstead of beside it. Reproduced identically on Rio and kitty.\n\nReserve the logo rows with newlines first and cursor-up back to the\nimage-top row, so any scroll happens before the save and nothing\nbetween save and restore can scroll. Fresh-screen output unchanged.\n\nAlso refresh the stale in-repo packaging reference copies\n(PKGBUILD/package.nix 0.3.21 -> 0.6.8), per the tracked WIP task.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:32:00-07:00",
          "tree_id": "a20285fab03aaf49bedc3f4d570f209aaf34e68d",
          "url": "https://github.com/l1a/retch/commit/b899b3ca3988eab8b8632cbb3b5263bf35322a76"
        },
        "date": 1785077502072,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 820116568.85,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 395.14793417024663,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.60543499964352,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.675788223616813,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.54616688212104,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4103.0608092151615,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 999.5315907361176,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 386.9479631067139,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 65755.43639424654,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 329.03581665244405,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fd8164049e99da545e8fe98d3f0b76e8c09b6faa",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10) (#175)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:58:18-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/fd8164049e99da545e8fe98d3f0b76e8c09b6faa"
        },
        "date": 1785079101299,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 789184666.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 393.4640823170622,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.25554603405463,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6690004065299455,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.30376645596506,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4310.636019256971,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1014.1997970747689,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 385.0289899401757,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 65742.46349343739,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 322.69978103865475,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e8b380c97debf11a4a35306f669cf3e456ccd616",
          "message": "Report default-route domain, not a VPN's (v0.6.11) (#176)\n\nUnder systemd-resolved /etc/resolv.conf is the stub file whose search\nlist is the merged set of every link's domains, so the Domain field --\nwhich took its first entry -- showed a split-tunnel VPN's domain\n(netbird.cloud) instead of the default route's (lan). It never\nconsidered interfaces at all.\n\nResolve the IP default-route interface from /proc/net/route and report\nthat link's own domain from resolvectl status. Keyed on the routing\ntable, not resolvectl's per-link 'Default Route:' flag, which is a DNS\nrouting flag and was yes for both links. When resolved manages the\ndefault link but it has no domain, report nothing rather than falling\nback to the merged list (which would resurrect the VPN domain); an\nunmanaged link still falls back, so static-resolv.conf hosts are\nunchanged. A full-tunnel VPN that is the default route reports its own\ndomain, as intended.\n\nFix two latent bugs in the same parser: all '~'-prefixed routing-only\ndomains are excluded (not just the exact catch-all '~.'), and wrapped\ncontinuation lines are no longer silently dropped.\n\nresolvectl is now needed by --long, so one OnceLock-cached invocation\nis shared with --full's domain-search rather than spawning twice.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T08:39:18-07:00",
          "tree_id": "8e30bf9598c906aed347fbd5c1c2ab33160360b0",
          "url": "https://github.com/l1a/retch/commit/e8b380c97debf11a4a35306f669cf3e456ccd616"
        },
        "date": 1785081571051,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1003584402.15,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 440.07945800679516,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 71.52067801632286,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9981494059841203,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 71.61735959951332,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4653.24220422578,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1093.8416472394324,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 448.05679888282185,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 96077.80897851757,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 369.84924403828506,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "86f5803462d1608de8b7739c8dc6c69bc9c85a46",
          "message": "Give Domain Search one shape per source (v0.6.12) (#177)\n\nCI dry-run output showed 'eth0: <domain>' on Ubuntu but a bare\n'<domain>' on Fedora. The difference is not platform-driven: the same\nOS flips format between jobs. Ubuntu in the build matrix runs on a bare\nrunner and takes the resolvectl path; Ubuntu in full-test runs in a\ncontainer with no systemd-resolved and falls back to resolv.conf.\nFedora is always containerised, so it only looked different from\nUbuntu.\n\nGrouping differed too: the resolvectl path returns one entry per\ninterface with domains joined, while the fallback returned one entry\nper domain and the display prints one line per entry, so 'search a b c'\nemitted three separate bare lines.\n\nRender the fallback in the same '<scope>: a, b' shape, scoped 'global'\n-- labelled honestly rather than attributed to an interface, since\nresolv.conf's search list carries no attribution. The parser stays\nfaithful to the file; the shape is imposed at the detect layer. macOS\nroutes through the same formatter. The resolvectl path is unchanged.\n\nWindows is deliberately not fixed here and is documented in NOTES 6a:\nits Domain reads the AD/primary suffix rather than the connection\nsuffix, and Domain Search has no Windows arm at all. Both need\nGetAdaptersAddresses and cannot be verified live without a Windows box.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T19:35:39-07:00",
          "tree_id": "b11c193d8bdb824b38e28d4104d2b63b410c8fea",
          "url": "https://github.com/l1a/retch/commit/86f5803462d1608de8b7739c8dc6c69bc9c85a46"
        },
        "date": 1785121002077,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1167825977.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 555.7012147660049,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 93.2514268171156,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.250543943265909,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 89.38953496221845,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5443.946407021002,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1481.1099653246179,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 530.34294636025,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 100762.82772286922,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 422.9019996398362,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3738fdb3ff66b18fc121092f4f086ea51ac0dc30",
          "message": "Fix release tooling: publish-check and nix hashes (v0.6.13) (#178)\n\npublish-check failed on every release: the retch-cli dry run cannot\nresolve its '=0.1.x' retch-sysinfo pin until sysinfo is actually on the\nindex, and a dry run never uploads. It now checks the sparse index via\na new crates_io_has_version.py helper and skips that leg with an\nexplanation instead of dying on 'failed to select a version'. Both\npublish recipes also skip retch-sysinfo when its version is already\npublished, which is the normal state for a CLI-only release.\n\ncalculate_nix_hashes.py was silently emitting a wrong cargoHash. Its\nsubstitutions matched only 'lib.fakeHash', so once package.nix held\nreal values they became no-ops, the temp build kept the previous\nrelease's hashes, it failed on a source-hash mismatch rather than the\nintended cargoHash mismatch, and the lenient parser returned that stale\nsource hash. That is why the published v0.6.12 cargoHash equals\nv0.6.8's hash. Patterns now match a literal hash too, are line-anchored,\nand hard-error when they match nothing; the parser only accepts a hash\nreported against our own dummy.\n\nRefresh the in-repo packaging reference copies to the released v0.6.12.\npackage.nix keeps the genuine src hash but resets cargoHash to\nlib.fakeHash rather than carrying the corrupt value -- recompute with\n'just nix-update' on a machine with Nix.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-07-26T20:14:41-07:00",
          "tree_id": "195de4a24b9c74a5d3bbc3288e0a4ce21ab48a89",
          "url": "https://github.com/l1a/retch/commit/3738fdb3ff66b18fc121092f4f086ea51ac0dc30"
        },
        "date": 1785123354857,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 964953654.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 505.09338190430947,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 78.12263983923188,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.1281571957394405,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 73.85100839276987,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5056.541201256591,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1215.0752716238967,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 475.9854835317445,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 83002.81127393902,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 419.8869448545873,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29c90fa282c281f6c5a2b797544c5babf5e957ce",
          "message": "fix(net): resolve Windows connection DNS domain and search list (#181)\n\n* fix(net): resolve Windows connection DNS domain\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(net): read Windows interface registry search list\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-07T23:10:01-07:00",
          "tree_id": "1430e5590c797113f0e21a4cdab22e90bfe90ce4",
          "url": "https://github.com/l1a/retch/commit/29c90fa282c281f6c5a2b797544c5babf5e957ce"
        },
        "date": 1786170594578,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 814366833.4,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 413.7504634091433,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.95898684348449,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6605343088258018,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.84329939458187,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4109.347317836218,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 989.9965712098896,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 394.80076568701753,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63702.05574290232,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 324.6470742173642,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "464951f8ff41455093d91045e621a17b81124684",
          "message": "fix(display): parse monitor vendor and panel model from EDID on Windows (#183)\n\n* fix(display): parse monitor EDID on Windows\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): extract monitor vendor and model on Windows\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-08T07:48:08-07:00",
          "tree_id": "5029838743a7e4449bedecce22a3d07443557dd7",
          "url": "https://github.com/l1a/retch/commit/464951f8ff41455093d91045e621a17b81124684"
        },
        "date": 1786201718740,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1044942354.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 442.71995074038495,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.71114627271874,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8503182678453818,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.4682397353408,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4551.943069322353,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1108.264912009218,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 424.08503244143185,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 73836.30687221131,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 346.78347690902854,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "622cf3b843fc5f6286cad91442e7bd41af2fdf12",
          "message": "Bump 4 deps and fix man page font-run strip (#184)\n\nConsolidates Dependabot #182 onto a gated branch so the release-hygiene\nsteps Dependabot skips (version bump, NOTES entry, man regen) are done.\n\nDependencies (cargo-dependencies group, lockfile-only — every spec is a\ncaret range, so Cargo.toml is untouched):\n  clap          4.6.4 -> 4.6.5  (clap_builder 4.6.2 -> 4.6.5)\n  toml          1.1.3 -> 1.1.4  (toml_parser  1.1.2 -> 1.1.3)\n  clap_complete 4.6.7 -> 4.6.8\n  base64        0.23.0 -> 0.23.1\n\nThe resulting Cargo.lock is byte-identical to what Dependabot generated.\n\nAlso fixes the `just man` font-collapsing sed, which has never worked on\nany platform. mandown emits redundant \\fB\\fB...\\fP\\fP runs and the recipe\ncarried `s/\\fB\\fB/\\fB/g` to strip them, but GNU sed reads \\f as the\nform-feed escape rather than backslash-then-f, so the pattern only ever\nmatched form feeds that groff output never contains. This is why\ndocs/retch.1 kept flip-flopping between machines: v0.6.2 concluded the\nstrip merely \"didn't take effect on Windows\", when in fact Linux was not\nstripping anything either — its mandown build just doesn't emit the\ndoubled runs. Matching the backslash as [\\] and carrying it out through a\ncapture group keeps any backslash escape off the replacement side.\n\nWith the fix, `just man` on Windows reproduces byte-for-byte the file a\nLinux `just man` produces, so the regen check in `just pr` no longer\ndepends on which machine last ran it. The regenerated page drops 21\ndoubled font runs and changes nothing else but the version footer.\n\nretch-sysinfo unchanged at 0.1.51; no Rust source touched.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-09T07:06:33-07:00",
          "tree_id": "15f29415e43f3e3f4f04318b070cc8c16695ac9a",
          "url": "https://github.com/l1a/retch/commit/622cf3b843fc5f6286cad91442e7bd41af2fdf12"
        },
        "date": 1786285761632,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 2779923823.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 611.2558046985696,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.73928351062,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.774142897770705,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 93.701349111143,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6334.702316916597,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1524.245369113144,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 576.4185291608009,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 111691.49428107946,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 514.7204044154186,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30f2bc0d85fda967af17b3472e2784627296f331",
          "message": "fix(justfile): make install and man recipes portable (#185)\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T13:24:44-07:00",
          "tree_id": "0ebf13827d71fe02fbbdd12b0eb83ccbacbc2ab8",
          "url": "https://github.com/l1a/retch/commit/30f2bc0d85fda967af17b3472e2784627296f331"
        },
        "date": 1786394761320,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 964967518.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 598.2404779039174,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 178.99295911874896,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.6103645648001885,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 89.99585834582683,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5991.4084443681795,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1728.3072652180877,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 499.4034983631283,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 98257.16622425479,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 457.91493111918896,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "521364f30839992fda65499538a01a44bc4f11bb",
          "message": "fix(display): constrain graphic logo height, normalize audio, and wrap lines to terminal width (#186)\n\n* fix(display): reduce logo height and wrap long info lines\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): constrain graphic logo height and wrap below-logo lines to full terminal width\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): normalize and deduplicate Windows audio device names\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): evaluate soundwire before streaming filter in normalize_win_audio_device\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T14:10:09-07:00",
          "tree_id": "8526b53eccb25ed2a964d63d08a63e698c00c32f",
          "url": "https://github.com/l1a/retch/commit/521364f30839992fda65499538a01a44bc4f11bb"
        },
        "date": 1786397452565,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1159370191.7,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 612.3403458481441,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 215.7564389494691,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.7897728159332695,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.49581433793323,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6168.07715566655,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1789.016840453864,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 453.88934418745504,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 113146.48245625754,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 466.00836522549554,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1177d194785c63e2058a99f5cffa5ef33577d9cb",
          "message": "ci: disable Claude Code Review workflow (#187)\n\nThe claude-review job no longer runs on pull requests: the\n`pull_request` trigger is replaced with `workflow_dispatch` and the\njob carries `if: false`, so it is off by default but can still be\ninvoked manually if wanted.\n\nBumps retch-cli 0.6.16 -> 0.6.17 (patch), refreshes Cargo.lock,\nregenerates docs/retch.1 for the new version footer, and updates the\nNOTES.md Current State header and release log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T08:18:19-07:00",
          "tree_id": "5edf46dce11e5ab7293d0a0411af8f9341a70b2b",
          "url": "https://github.com/l1a/retch/commit/1177d194785c63e2058a99f5cffa5ef33577d9cb"
        },
        "date": 1786462791666,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1227734533.3,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 562.0875267446263,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 194.56103957960104,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.8342427579309506,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 90.67740982588005,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6834.044533373029,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1672.2098723082163,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 579.4183702536408,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 126376.55387811913,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 489.3486493568174,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1d0dc367f9ad44e2a04cc045891998fa9d9b1aae",
          "message": "fix: unprivileged Packages, sudo Rio, logo aspect (#189)\n\nThree defects found by diffing `sudo retch --full` against a plain run.\n\nPackages appeared only under sudo. The RPM SQLite database was opened\nread-write; it is root-owned inside a root-owned directory, so SQLite\ncould not create its journal sidecars and every *query* failed with\n\"attempt to write a readonly database\" — not the open(), which is why\nthe existing warning never fired and the field vanished silently. Now\nopened read-only over a `file:...?immutable=1` URI, and the query error\nis reported instead of swallowed.\n\nRio lost all graphics support under sudo: it was identified only by\nTERM_PROGRAM, which env_reset drops. `is_rio_terminal` now also accepts\nTERM=rio/xterm-rio, which sudo preserves.\n\nThe Kitty logo was stretched ~3x vertically. `c=26,r=10` was hardcoded\nand Kitty forces an image into that rectangle, while display.rs assumed\na fixed 40-column width and derived the row count a third way. A single\npure `fit_logo_cells` now feeds all three protocol emitters and\nplan_layout. Passing both correct values still left a 9% stretch from\ncell quantisation, so the Kitty spec carries only the limiting dimension\nand lets Kitty derive the other — measured 0.0% aspect error in a PTY.\n\nThe chafa box widens 28 -> 45 columns (row cap unchanged at 10) so wide\nlockup assets stay legible: the Fedora logo goes from 4 rows to 7. The\nside-by-side threshold is unaffected (45 + 45 <= 95), pinned by a test.\n\nAlso fixes a test-isolation defect the change exposed: once\nsupports_iterm2 read TERM, the host's TERM leaked into a test that\nguarded only TERM_PROGRAM, failing on a Rio box and passing on CI.\n\nDocuments the privilege trade-off in both directions (root-only\nphys-mem and btrfs snapshot counts; user-only editor/desktop/wm) in a\nnew NOTES section, README, and a man-page PRIVILEGES section.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T17:52:19-07:00",
          "tree_id": "9996d32ff3728e9292ad474ad37e12907763f637",
          "url": "https://github.com/l1a/retch/commit/1d0dc367f9ad44e2a04cc045891998fa9d9b1aae"
        },
        "date": 1786497150338,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 910868170.75,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 417.7428513426963,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 131.4716419925765,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8186735280112891,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 65.46295974921475,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5031.003016410074,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1037.2390512175348,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 393.32767145434144,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 87685.10487554627,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.60965715830565,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d27af8746fe0e349822f3272031e94e03589b50",
          "message": "chore: bump 3 deps (consolidated Dependabot #188) (#190)\n\nRolls Dependabot #188 onto a gated branch so the release hygiene it\nbypasses — version bump, NOTES entry, man regen — is actually done,\nfollowing the #167/v0.6.3 and #184/v0.6.16 pattern.\n\nAll patch-level and lockfile-only; every spec is a caret range, so both\nCargo.toml manifests are untouched:\n\n  clap           4.6.5 -> 4.6.6  (pulls clap_builder 4.6.5 -> 4.6.6)\n  clap_complete  4.6.8 -> 4.6.9\n  rusqlite       0.40.1 -> 0.40.2 (pulls libsqlite3-sys 0.38.1 -> 0.38.2)\n\nThe lockfile was diff-verified byte-identical to Dependabot's before the\nversion bump, so this carries exactly the change its green CI validated;\nafterwards the only divergence is retch-cli's own version line.\n\nrusqlite warranted a live check rather than just a green suite: it is a\ndirect dependency of retch-sysinfo and the crate v0.6.18's Packages fix\nhad just started using differently, and libsqlite3-sys bundles SQLite\nitself, so a bump changes the engine that has to honour `immutable=1`.\nThe rpm_db_uri unit tests only assert string construction and could not\ncatch a behavioural change there. Verified live as an unprivileged user:\nPackages: 2509, unchanged.\n\nretch-cli -> 0.6.19; retch-sysinfo unchanged at 0.1.53 (no source\nchange, only its transitive lockfile deps moved).\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T18:52:53-07:00",
          "tree_id": "0f8eb7815bf12c631f95919caaeb1e89e3549096",
          "url": "https://github.com/l1a/retch/commit/9d27af8746fe0e349822f3272031e94e03589b50"
        },
        "date": 1786500849752,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1182897862.35,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 558.867362000005,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 163.41178215825005,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.1515455651953337,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 75.95156307228558,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5418.715335187409,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1282.9028545327133,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 556.2497043709939,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 96049.93602151397,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 415.29372422988524,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbd76828105384492815f283cc8351f68368cb56",
          "message": "Fix nushell completion path; adopt shared helpers (#191)\n\ninstall_completions.py wrote nushell completions to\n$XDG_CONFIG_HOME/nushell/autoload. On Windows\n$nu.user-autoload-dirs is exactly %APPDATA%\\nushell\\autoload and\nnushell never reads the XDG path, so the helper wrote a real file\nsomewhere nothing consults, printed the path, and delivered nothing.\n\nTwo more defects in the same helper: it logged a generation failure\nto stderr, continued, and then printed \"Installed completions for\nretch:\" unconditionally -- success reported over work not done; and\nnothing checked whether zsh would ever load the file (it reads only\ndirectories on fpath, and site-functions is not on it by default).\nIt now checks, via an INTERACTIVE zsh, since a non-interactive one\nreports the built-in default.\n\nThis repo's MECHANISM was right and is now the standard. v0.6.16\nmoved these recipes to Python so they run natively on Windows\nwithout Git's usr\\bin; rusticprofile first proposed replacing them\nwith sh recipes because it held the correctness fixes, which would\nhave regressed that work in the name of consistency. Each repo had\nsolved half the problem.\n\ninstall_completions.py and install_man.py are now vendored\nbyte-identically across retch, rusticprofile and etr, with\ntemplates/justfile-common.just as the Justfile block reference.\nstandard-check runs their self-tests -- not a text diff, since\nseparate repos cannot diff each other's files and a diff would pass\non a repo that never adopted the standard -- and check depends on it.\n\nAlso adds install-tag VERSION, which installs a released tag with\nbinary, completions (from the INSTALLED binary) and man page (from\nthe tag) so the three cannot disagree.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T17:11:38-07:00",
          "tree_id": "52f09d8ff2178e92d32e22dc2177be6643ec678b",
          "url": "https://github.com/l1a/retch/commit/fbd76828105384492815f283cc8351f68368cb56"
        },
        "date": 1786581183204,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1047203360.45,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 468.85663438852873,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 146.2988750875451,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.7340624765939725,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 68.65999215840121,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4893.055632373771,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1101.4597954080266,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 434.8531247412196,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 73946.78036906457,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 385.533122681689,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1b99674ea9eded99c6558e78098409ebe6a78ac",
          "message": "Make the pre-PR gate answerable; open-pr now pushes (#192)\n\n* Make the pre-PR gate answerable; open-pr now pushes\n\njust pr ended in a bare read, so only a human at a terminal could\nanswer it -- a script or agent blocked on a stdin that would never\nanswer, or died without saying why, and that reads as the gate refusing\nthe change. It now accepts PR_CONFIRM, an interactive stdin, or piped\ninput under a timeout, and names PR_CONFIRM when it cannot be answered.\nNot a bypass: every path still requires an explicit y.\n\njust open-pr did not push, so on a never-pushed branch it printed\n\"Gate passed\" and then failed because gh pr create had no remote\nbranch to open from. It now pushes only when there is no upstream --\npushing unconditionally would silently publish existing commits on a\nbranch that already has one. pre-push still runs just check, so the\npush is inside the gate rather than around it.\n\nBoth are rusticprofile's 0.0.21 and 0.2.12, which retch never received.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:24:18-07:00",
          "tree_id": "7307c8c54022ab27b0b3e8ecfeab8995613e25ea",
          "url": "https://github.com/l1a/retch/commit/c1b99674ea9eded99c6558e78098409ebe6a78ac"
        },
        "date": 1786592745205,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1107191039.6,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 447.40887201593966,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.53675862350264,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8074156533838337,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.86336255948147,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4531.386007059467,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1071.4898093490356,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 423.3332044946031,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 77844.93234352424,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 349.1956370585336,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6",
          "message": "Let the manual Claude review actually run (#193)\n\n* Let the manual Claude review actually run\n\nv0.6.17 disabled automatic review by commenting out the pull_request\ntrigger AND setting if: false on the job. The trigger alone already did\nthat, so the guard added nothing -- but it also applied to\nworkflow_dispatch, which was kept. So gh workflow run started a run,\nskipped the job, and reported SUCCESS having reviewed nothing.\n\nA green run that did nothing is the failure this repo's tooling exists\nto refuse, and the one rusticprofile recorded twice about this action.\nDispatch available but silently inert is worse than working or absent.\n\nAutomatic review stays OFF -- only the job guard is removed; the\npull_request trigger is still commented immediately above it.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:45:42-07:00",
          "tree_id": "a129dbfd95e55ff45255a019bb60311bdfcf5738",
          "url": "https://github.com/l1a/retch/commit/e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6"
        },
        "date": 1786593960799,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1118865306.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 451.04767534955664,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 133.550466266761,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.009840706163823,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 65.88154044941173,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5921.1919855383085,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1234.7525292362523,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 426.47794881839457,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 82487.08230357624,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 362.34223751826676,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a",
          "message": "Gate merge-pr on CI; bring the triad under standard-check (#194)\n\n* Gate merge-pr on CI; check the triad\n\nmerge-pr went straight from the branch check to gh pr merge --squash\n--delete-branch, with no inspection of the status rollup. gh pr merge\nhappily merges a red PR when there is no branch protection, so every\nmerge in this repo has been ungated -- safe only because whoever merged\nhappened to look first.\n\nrusticprofile added this in v0.1.5 after a PR went in with a leg red,\nand extended it in 0.2.1 after an EMPTY rollup passed vacuously.\nNeither reached here.\n\nThree refusals now: a failing check, an empty rollup, and checks still\nrunning. The empty state is compared as a string rather than via jq -e\nlength, because an external jq is not on a default Windows PATH and a\ngate that degrades where its dependency is missing is the thing being\nfixed.\n\ngate_conformance.py (template v3) is vendored and run by\nstandard-check, so the guards cannot vanish again. It is structural,\nnot behavioural, and says so.\n\nVerified safely: on a branch with no PR the rollup is empty, so\nmerge-pr refuses before reaching gh pr merge.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T21:18:47-07:00",
          "tree_id": "09cf28f2dd68d69de2931ed6e287f3ca4b42fd13",
          "url": "https://github.com/l1a/retch/commit/25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a"
        },
        "date": 1786596224030,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 937460108.35,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 437.24220000801716,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.00731245498773,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.687781763174229,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.83549054381797,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4036.137544944603,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 997.3028556089682,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 403.5966027539313,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63975.47514994687,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 446.16362377987235,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "120ed8e2e0fe45a624212a8204ae34b082b8c360",
          "message": "Add keyboard, mouse and tpm fields (#195)\n\n* Add keyboard, mouse and tpm fields\n\nThree NOTES.md section 6 fastfetch-gap fields, all --long and above,\nLinux-only, in the v0.5.0 shape: thin /proc and sysfs readers over pure\nhelpers that unit-test without touching host hardware.\n\nInput classification is exclusive and declines to guess. On a Logitech\nUnifying/Bolt receiver no kernel-visible signal separates a keyboard from\na mouse: handlers, capabilities/rel (0x1943 on both), the alphabet key\nblock, INPUT_PROP, udev ID_INPUT_* (POINTINGSTICK on both), USB HID\nbInterfaceProtocol and the HID report descriptor itself are all identical\nfor an MX Keys and an MX Master 3. fastfetch 2.66 gets this wrong in both\ndirections on that hardware. Ambiguous devices are resolved via the HID++\ndriver's battery model_name and, failing that, reported in neither field\nrather than asserted into the wrong one.\n\ntpm reads tpm_version_major and maps it to the published spec names\n(1 -> 1.2, 2 -> 2.0), returning None for anything unrecognised.\n\nAlso refresh packaging/aur/PKGBUILD, stranded at 0.6.12 for eleven\nreleases while the AUR moved to 0.6.23, and drop its man-page\nregeneration: the font-strip sed never matched on any platform (GNU sed\nreads \\\\f as a form feed) and $DATE/$pkgver were literal inside double\nquotes, so the installed footer read \"retch $pkgver\". The committed\ndocs/retch.1 ships in the tarball with the correct footer, so package()\ninstalls it directly and the mandown makedepend is gone.\n\nStrata golden counts move Long 49->52, Full 55->58. 11 new unit tests.\nVerified live on corrino (Fedora 44, i7-1360P).\n\nAssisted-By: Claude Opus 5\n\n* Close two holes in the aur CI job\n\nThe job rewrote source= and sha256sums= to build from local sources, so the\ndeclared checksum was never checked by anything — a stale one (as this\nPKGBUILD carried for eleven releases) stayed green and would only fail for\nsomeone installing from the AUR. Verify it against the real tag tarball\nbefore that patching, refusing a committed SKIP and skipping cleanly when the\ntag is not published yet.\n\nNothing inspected the packaged man page either, which is where both defects\nthis branch fixes actually showed. Assert the built package's .TH line carries\nno literal $ and a real retch <version> footer, and that no doubled font runs\nsurvive.\n\nAlso stop pre-installing mandown, so makedepends is load-bearing: makepkg -s\ninstalls what the PKGBUILD declares and nothing else.\n\nAssisted-By: Claude Opus 5\n\n* Fix the man-page check failing on a correct package\n\nThe new verification step used `bsdtar -tf \"$pkg\" | grep -qx …` under\n`set -o pipefail`. grep -q exits on its first match, bsdtar takes SIGPIPE and\nexits 141, and pipefail turns that into a failed pipeline — so the step\nreported the man page missing exactly when it was present, and CI went red on\na package that was correct. head -1 and grep -m1 carry the same hazard.\n\nMaterialise the listing and the page to files and grep those; select the\npackage with find -print -quit. Verified against a good package and against\npurpose-built broken ones (missing page, literal $ footer, doubled font runs).\n\nAssisted-By: Claude Opus 5\n\n* Match the gzipped man page makepkg actually ships\n\nmakepkg's zipman option is on by default, so the packaged path is\nusr/share/man/man1/retch.1.gz. The verification step looked for retch.1 and\nreported it missing — the check wrong again, the package correct again.\n\nMatch retch.1 with an optional .gz/.zst/.xz/.bz2 suffix and decompress before\ninspecting. Tested against gzipped, uncompressed, and gzipped-but-broken\npackages.\n\nThe diagnostic added in the previous commit is what made this cheap: printing\nthe real usr/share listing on failure named retch.1.gz directly in the CI log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T09:49:12-07:00",
          "tree_id": "274aff11102cf1108fb49cbe2f4d8beedda7b477",
          "url": "https://github.com/l1a/retch/commit/120ed8e2e0fe45a624212a8204ae34b082b8c360"
        },
        "date": 1786727283691,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 742897002.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 451.25769900365674,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 130.50439828389938,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7145112020313438,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 67.79136073142898,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4760.059715292388,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1069.8508873786227,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 458.1952396219396,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71141.53769022395,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 361.6257196757857,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0fb38978e0182c24717fea4d8b4a80047b15d233",
          "message": "Make packaging/aur the source, not a stale copy (#196)\n\npackaging/aur/PKGBUILD was a reference copy that nothing rendered, published or\nchecked. It reached eleven releases of lag (0.6.12 in-repo against 0.6.23\npublished), and because the copy was inert the live AUR PKGBUILD kept two\nman-page defects long after they were fixed here — Arch installs got a page\nfooted $DATE / retch $pkgver the whole time.\n\npackaging/aur is now the source. aur-bump renders it from a released tag,\naur-publish pushes exactly those files, and .SRCINFO is tracked and generated\nby a real makepkg --printsrcinfo in a container (no host here runs Arch).\nCarried over from rusticprofile: write to a temp file and move it into place so\na failure cannot truncate the committed file, check the output content rather\nthan the exit code, and mount :z never :Z.\n\nscripts/aur_check.py is the anti-drift guard and just check depends on it. It\ncompares the pair field-by-field including the expanded source URL, so it\ncatches a pair that agrees on the version and disagrees on the checksum — the\nshape that breaks on the user's machine and nowhere else. Pure Python, so it\nruns on Windows; parses rather than sourcing the PKGBUILD, and raises rather\nthan expanding unknown variables to empty.\n\nVerified end to end: the generated .SRCINFO came out byte-identical to the one\nhand-written and pushed to the AUR earlier today, and AUR_CONFIRM=n\njust aur-publish exercised every preflight check without publishing.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T10:43:28-07:00",
          "tree_id": "0dcac6b08b8ab4bb34654fbcf6096f083db1f748",
          "url": "https://github.com/l1a/retch/commit/0fb38978e0182c24717fea4d8b4a80047b15d233"
        },
        "date": 1786730689697,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1713934208.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 503.7749489468953,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 147.52560239007363,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.873727155270824,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 68.73103941901714,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5642.27409466839,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1213.3969101115558,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 494.809198992619,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 80209.43614441858,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 385.5222409289169,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9b8bcc71daafe3d38abb8ba9085195eef680d68f",
          "message": "Native Media and Player Detection (#197)\n\n* Add native media and player detection fields\n\nImplement 100% native FFI / direct socket media and player detection with zero subprocess forks across Windows (WinRT COM GlobalSystemMediaTransportControlsSessionManager via combase.dll), Linux (direct Unix domain socket D-Bus MPRIS client), and macOS (Objective-C runtime SBApplication FFI).\n\nAdds 'player' and 'media' to FIELDS registry (Mode::Long, available in --long and --full). Strata golden counts Long 52 -> 54, Full 58 -> 60. Regenerated man page, updated README.md, docs/retch.1.md, NOTES.md, WIP.md, and GitHub wiki.\n\nAssisted-By: Gemini 2.5 Flash\n\n* Fix Rust 1.97 Clippy lints in media.rs\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:19:02-07:00",
          "tree_id": "5f6c7da98e5d1a0862003b59cc74c4130d097866",
          "url": "https://github.com/l1a/retch/commit/9b8bcc71daafe3d38abb8ba9085195eef680d68f"
        },
        "date": 1786934421118,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1137309783.45,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 456.86057605582346,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 135.85681045928905,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.973803000241786,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 72.11240954584436,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4966.603999930255,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1182.1747857605276,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 478.3041738476112,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 84387.6242390168,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 383.0489932308203,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ed45ec18928bf19b4add811c3f8a567211932073",
          "message": "Add README and crate metadata for retch-sysinfo (#198)\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:39:49-07:00",
          "tree_id": "13cd0a580de7afdb2209726aa2a026b4079579a6",
          "url": "https://github.com/l1a/retch/commit/ed45ec18928bf19b4add811c3f8a567211932073"
        },
        "date": 1786935641688,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1298084356.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 566.5669526765357,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 144.55214428721538,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.5299088497235624,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 88.2816317250719,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6051.449350721521,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1650.0436812121873,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 518.9665939399347,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 119208.52391967058,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 459.8365496523993,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "f75989c777d19ce11a71c02c17a50e959cdb94cb",
          "message": "aur: bump to 0.8.0\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:47:18-07:00",
          "tree_id": "6e84e4f067d36b437236a783f86e1b1b04a441ca",
          "url": "https://github.com/l1a/retch/commit/f75989c777d19ce11a71c02c17a50e959cdb94cb"
        },
        "date": 1786936188702,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1119037868.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 495.6720983025633,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 148.46996695088885,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.10662989840234,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 77.08729222509196,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5015.19325217852,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1221.4671363474365,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 492.1487441468732,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 86567.67748199297,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 398.9821285450569,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e42fb854db13c202146dc739849f67429547ebf9",
          "message": "deps: bump dependencies (consolidate #199) (#200)\n\nConsolidate Dependabot PR #199:\n- clap_complete_nushell 4.6.1 -> 4.6.2\n- icy_sixel 0.5.0 -> 0.5.1\n- Cargo.lock transitive dependency updates\n- Bump retch-cli to 0.8.1 and regenerate man page\n\nAssisted-By: Gemini 3.7 Flash",
          "timestamp": "2026-08-21T15:33:39-07:00",
          "tree_id": "f4dea1009382aed406875e53dbf14115c540f5df",
          "url": "https://github.com/l1a/retch/commit/e42fb854db13c202146dc739849f67429547ebf9"
        },
        "date": 1787352974152,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1115910039.55,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 477.2029883796631,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 150.6456303688255,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.7129785043702865,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 75.59926703011641,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4772.7468155749275,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1102.1860766007783,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 408.6039181615117,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 86728.14029291862,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 422.2670750223957,
            "unit": "ns"
          }
        ]
      }
    ],
    "Windows x64 Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7a3b029a318196f57111112492235841e6692d8c",
          "message": "Reword WIP resetâ†’update, rename wip script (#141)\n\nWIP.md is an ongoing rolling log, not reset per-PR. Align the docs and\ntooling with that: AGENTS.md Â§5 and the just merge-pr recipe now say\n\"update\" instead of \"reset\", and scripts/reset_wip.py is renamed to\nscripts/update_wip.py (git mv; behavior unchanged â€” it still only\nrewrites the Active-Branch and latest-commit lines).\n\nAlso folds in the NOTES.md Â§5 \"real hardware benchmark section\" backlog\nitem. Docs/tooling only; no Rust source touched.\n\nVersion bumped 0.3.40 â†’ 0.3.41 (patch); man page + Cargo.lock regenerated.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:14:33-07:00",
          "tree_id": "3985c178b81541f77e250902c4997776fb98a214",
          "url": "https://github.com/l1a/retch/commit/7a3b029a318196f57111112492235841e6692d8c"
        },
        "date": 1783734381763,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.50213862965154,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.395069656121361,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 127.70285990101301,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.52039519515236,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42416.88133157596,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 582.1625011368676,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 799.1956130741007,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 4666945305,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2",
          "message": "Fix update_wip.py stale-pointer regex + UTF-8 (#142)\n\nThe post-merge WIP updater matched an obsolete \"**Latest commit on\nmain**:\" line that no longer exists, so the substitution silently\nno-op'd and left \"**main HEAD**:\" stale after every `just merge-pr`\n(seen live after #141). Retarget the regex to \"**main HEAD**:\", rewrite\nin the current format (`<hash>` â€” <subject> â€” **v<version>**) with the\nversion read from Cargo.toml, using a function replacement so metachars\nin the subject are literal.\n\nSince the fix now writes the commit subject into WIP.md, and this repo's\nsubjects contain \"â†’\"/em-dashes, pin UTF-8 on read_text/write_text,\nsubprocess decoding, and stdout â€” otherwise cp1252 (the default Windows\nconsole/locale where merge-pr runs) crashes the script. Verified\nend-to-end against a subject containing \"â†’\".\n\nAlso gitignore __pycache__/*.pyc.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:31:45-07:00",
          "tree_id": "2db4346561186354ab7202a4b36fa637426c79f1",
          "url": "https://github.com/l1a/retch/commit/fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2"
        },
        "date": 1783735435312,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.77423379690293,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.512539824094139,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 134.49184534559203,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.84704852032203,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41893.99905596172,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 640.5307900028286,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 800.1283478028093,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3845610830,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9f639d38da27f892e183f9fa1e0f77d57cdfdcad",
          "message": "update_wip.py: bound subs with count=1 (#143)\n\nFollow-up to #142. The retargeted `**main HEAD**:` regex had no count,\nso it rewrote every line containing the header string â€” and WIP.md's\nopen-task prose mentions it verbatim, so the #142 merge clobbered those\ntask lines. Pass count=1 to both re.sub calls (Active-Branch and\nmain-HEAD) so only the first top-of-file header occurrence is rewritten.\nVerified end-to-end against a sample with the header in both a header\nline and later prose.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:05:40-07:00",
          "tree_id": "e1d68a1f542a32e88f5f5adaece7b1b06c929de4",
          "url": "https://github.com/l1a/retch/commit/9f639d38da27f892e183f9fa1e0f77d57cdfdcad"
        },
        "date": 1783741148424,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 145.28837520787738,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.910236730241312,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 139.29527233142517,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 99.26448264613346,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41873.739298174696,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 833.8637843623658,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 956.0514169646449,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3757221620,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab",
          "message": "Drop PowerShell spawn in Windows net detection (#144)\n\ndetect_active_interface_and_local_ip shelled out to PowerShell\n(Get-NetRoute) on Windows to name the default-route interface. That\nspawn costs ~977ms (PowerShell startup) and, since the `net` field is in\nevery mode, dominated runtime — `retch --short` was ~1.15s, ~11x over\nits <100ms target and ~20x slower than fastfetch.\n\nDerive the active interface instead from the adapter whose\nsysinfo-reported IPs include the outbound local_ip (already resolved via\nthe UDP-connect trick) — no spawn, no new dependency, no FFI. Extracted\na pure match_active_interface helper with a unit test. Resolves to the\nsame interface as before (verified on Windows).\n\nMeasured (AMD Ryzen AI MAX+ 395, Win 11): --short 1149ms -> 163ms (~7x).\nretch-sysinfo bumped 0.1.33 -> 0.1.34 (library behavior change).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:42:31-07:00",
          "tree_id": "e39a81d2e6892fa08bbcacc34138d13dd5af8989",
          "url": "https://github.com/l1a/retch/commit/cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab"
        },
        "date": 1783743334181,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.62513021151184,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.035169788916327,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 131.1486542343739,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.14822538435007,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43620.56357626818,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 625.6202380507577,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 838.879547156403,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 4114360265,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "18f0bfa4e337d9a815662b1383dab85187e1ac5c",
          "message": "Fix bench-cli/bench-compare on Windows (#145)\n\nThe bench recipes passed a POSIX-style './target/release/retch' to\nhyperfine. With no --shell, hyperfine uses cmd.exe on Windows, which\ncan't execute that path (forward slashes, no .exe), so it exited 1 in\nthe first warmup run and aborted the recipe. retch itself was fine and\n`just bench` (criterion) was unaffected.\n\nAdd an os_family()-selected `retch_release_bin` variable\n('target\\release\\retch.exe' on Windows, './target/release/retch'\nelsewhere) and route all bench hyperfine calls through it. Verified both\nrecipes now run to completion on Windows.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T21:26:47-07:00",
          "tree_id": "b2195da8db613809ef3a732f524156e3dd175501",
          "url": "https://github.com/l1a/retch/commit/18f0bfa4e337d9a815662b1383dab85187e1ac5c"
        },
        "date": 1783745893674,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 134.91981568189016,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.718532926410736,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 135.71346377773204,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.29500571442048,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42429.812246865724,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 618.7582327163634,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 831.332051151637,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3333852220,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c57409d318756bf9bf92ee798f438e2c2e4747fd",
          "message": "Use native Win32 IOCTLs for Windows phys-disk (#146)\n\nReplace the Get-PhysicalDisk PowerShell spawn (~1.7s of interpreter\nstartup) in retch-sysinfo's Windows physical-disk detection with direct\nstorage IOCTLs over \\.\\PhysicalDriveN, via hand-written extern \"system\"\nFFI matching the crate's existing style (win_reg.rs) — no new dependency.\n\nEach drive is opened with zero desired access and only FILE_ANY_ACCESS\nquery IOCTLs are used (IOCTL_STORAGE_QUERY_PROPERTY for model/bus type +\nseek penalty, IOCTL_DISK_GET_DRIVE_GEOMETRY_EX for size), so no elevation\nis required. Classification and label format are unchanged; the model\nstring reproduces Get-PhysicalDisk's FriendlyName. Verified byte-identical\noutput; --fields phys-disk ~1684ms -> ~210ms on an AMD Ryzen AI MAX+ 395.\n\nAlso fix a gate/CI blind spot found while verifying this: a bare\n`cargo test`/`cargo clippy` at the workspace root only covers retch-cli\nand silently skips the retch-sysinfo member (where this change lives).\nThe just recipes (test/lint/check + the pr steps) and both rust.yml CI\njobs now pass --workspace; AGENTS.md 4.0/4.1 document why.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T12:51:19-07:00",
          "tree_id": "02202ebbc2cd99020a9d56bc36db81f79b1aa906",
          "url": "https://github.com/l1a/retch/commit/c57409d318756bf9bf92ee798f438e2c2e4747fd"
        },
        "date": 1783801255972,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 70.93878996384896,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.1346445392458384,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 71.98138080514114,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 53.45732870682001,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 26480.061117607005,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 292.66056510644466,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 467.6963118869162,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1901730050,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e7427ff1a1011473cda36ef463893d8a10dea342",
          "message": "Read SMBIOS natively for Windows phys-mem (#147)\n\n* Read SMBIOS natively for Windows phys-mem\n\nReplace the two Get-CimInstance Win32_PhysicalMemory / Win32_ComputerSystem\nPowerShell spawns (~600 ms) with GetSystemFirmwareTable('RSMB') (kernel32),\nparsing SMBIOS type-17 (Memory Device) structures directly, plus\nGlobalMemoryStatusEx as the VM total-memory fallback. Hand-written\nextern \"system\" FFI matching win_reg.rs — no new dependency.\n\nA pure parse_smbios_type17 fn does a bounds-checked walk of the structure\ntable (formatted area + double-null-terminated string set) and carries the\nunit tests. Now also surfaces the SMBIOS Configured Memory Speed field\n(offset 0x20), so Windows shows running-vs-rated speed when they differ\n(e.g. \"8x 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)\"), matching Linux; the\nold WMI path only reported the rated speed.\n\n--fields phys-mem ~597ms -> ~152ms on an AMD Ryzen AI MAX+ 395; output\nverified against Get-CimInstance Win32_PhysicalMemory.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix clippy byte-str lint on RSMB signature\n\nRust 1.97's clippy flags `[b'R', b'S', b'M', b'B']` (can be a byte str).\nUse `*b\"RSMB\"` instead. Local toolchain was 1.96 so `just check` passed\nlocally but CI (1.97) failed clippy; bumped local toolchain to match.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T13:32:19-07:00",
          "tree_id": "dde402b0cc3e8c191c71996d19858d5d403cf3b0",
          "url": "https://github.com/l1a/retch/commit/e7427ff1a1011473cda36ef463893d8a10dea342"
        },
        "date": 1783803903676,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.30591880968855,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.224697986596281,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.20813386814828,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.38819276873329,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43605.550202256476,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 634.454689841248,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 913.5227282759528,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2821435600,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36888f89870197b2e040c9178970859ffc467c42",
          "message": "Detect Windows bluetooth natively (bthprops) (#148)\n\nReplace the PowerShell spawn (Get-Service bthserv + two Get-PnpDevice\n-Class Bluetooth queries, ~1.8s) with native Win32:\n- power state from the bthserv service via the Service Control Manager\n  (advapi32),\n- adapter hardware name via SetupAPI enumeration of the Bluetooth device\n  class (links setupapi),\n- connected devices via the classic bthprops API (BluetoothFindFirstDevice\n  with fReturnConnected; links bthprops).\n\nHand-written extern \"system\" FFI, no WinRT and no binding crate. The\ndevice-info struct layout was validated at runtime before trusting the\ncount. A pure format_windows_bluetooth fn carries the unit tests.\n\nBehavior change: \"N connected\" now counts actually-connected devices\nrather than the old count of all paired/present Bluetooth PnP nodes (which\nthe old code mislabeled as connected). Adapter name unchanged. On an AMD\nRyzen AI MAX+ 395: --fields bluetooth ~1765ms -> ~150ms; --long 3462 ->\n2934ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:06:28-07:00",
          "tree_id": "ad23df51a0dfa2097d5eeb928be7307ad5c07e92",
          "url": "https://github.com/l1a/retch/commit/36888f89870197b2e040c9178970859ffc467c42"
        },
        "date": 1783813007373,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 126.35080377364916,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.804934713036831,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 130.78498615256092,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.15200544142125,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41106.1355299533,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 669.1540570525609,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 933.1880575200518,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3395268470,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dfa18d3ba7b91698f61b34f76aaf85b3bd479271",
          "message": "Drop serial CPU-usage sleep on Windows (#149)\n\nCPU usage needs a delta between two samples. sysinfo enforces a ~200ms\nminimum interval, so collect() slept 200ms then refreshed — and that\nsleep ran serially AFTER the concurrent probe scope, adding ~200ms to\nevery standard/long run.\n\nOn Windows, sample GetSystemTimes (kernel32) just before the scope and\ndiff against a fresh sample at the usage-computation point: the existing\ncollection window is the delta, so no dedicated sleep is added. A ~100ms\nfloor is topped up only when the window is shorter (e.g. an isolated\n`--fields cpu-usage`) so a tiny request reads a real value instead of\nGetSystemTimes quantization noise. A pure usage_percent helper carries\nunit tests. Linux/macOS keep the sysinfo+sleep path (its min interval\nmakes the window-diff unreliable there).\n\nOn an AMD Ryzen AI MAX+ 395: standard mode 1757ms -> 1558ms; isolated\n--fields cpu-usage ~340ms -> ~253ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:26:38-07:00",
          "tree_id": "ff94a5086c547509df94d6fc37722dd5e6667f45",
          "url": "https://github.com/l1a/retch/commit/dfa18d3ba7b91698f61b34f76aaf85b3bd479271"
        },
        "date": 1783814301119,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 145.33329733258677,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.350566702906946,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 124.84517237264197,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 106.2694307009015,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46324.30956706307,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 618.9490930781151,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 790.4998142027349,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2834459460,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cae94eb0c09e6b2f4675d84cbd239d3ed13b6926",
          "message": "Detect Windows camera natively (SetupAPI) (#150)\n\nReplace the camera PowerShell spawn (Get-PnpDevice -Class Camera,Image\n-PresentOnly, ~1.36s) with a new shared win_setupapi module that enumerates\npresent devices in a setup class via SetupDiGetClassDevsW +\nSetupDiGetDeviceRegistryPropertyW (links setupapi) — the native equivalent\nof Get-PnpDevice -PresentOnly. Camera enumerates the Camera and Image\nclasses and reuses the existing is_real_camera / clean_camera_name / dedup\nlogic. bluetooth (which introduced a private SetupAPI copy) is refactored\nonto the shared module, removing the duplication (mirrors win_reg.rs).\n\nHand-written extern \"system\" FFI, no binding crate. Verified against\nGet-PnpDevice (all real cameras; IR camera filtered as before); bluetooth\nadapter name unchanged after the refactor.\n\nCamera was the last standard-mode PowerShell pole, so this completes the\nWindows native-FFI migration: on an AMD Ryzen AI MAX+ 395, --fields camera\n~1359ms -> ~155ms and standard mode 1558ms -> 273ms. retch now beats\nfastfetch in standard mode (273 vs 1348ms) and is at parity in --long.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:26:15-07:00",
          "tree_id": "dc9eca701a17186aff929c1b979a8956c13aed61",
          "url": "https://github.com/l1a/retch/commit/cae94eb0c09e6b2f4675d84cbd239d3ed13b6926"
        },
        "date": 1783835855465,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 127.17763109256786,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.828539042020148,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 133.2482164612614,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.76211134995279,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41794.82148983667,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 647.1588025076974,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 1001.8716080653927,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2387999050,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ae3ecffd014bc206189c58e5b613f8ff4e0b66d",
          "message": "Add FFI struct-layout assertion tests (#151)\n\nFollowing the Windows native-FFI migration (#146-#150), the pure parsers\nare well unit-tested but the #[repr(C)] FFI structs the OS reads/writes by\noffset were only runtime-verified. Add size_of + targeted offset_of!\nassertions for each: disk (StoragePropertyQuery, StorageDeviceDescriptor\nincl. bus_type/vendor/product offsets, DeviceSeekPenaltyDescriptor,\nDiskGeometryEx incl. disk_size), memory (MemoryStatusEx), bluetooth\n(ServiceStatus, DeviceSearchParams, SystemTime, DeviceInfo incl.\nf_connected/sz_name), fetch (win_cpu::FileTime), win_setupapi\n(SpDevinfoData, already present).\n\nThese catch accidental field-reorder/padding regressions at test time —\nthe failure mode the parse tests can't (the phys-mem 0x14->0x15 offset bug\nin #147 was found only by runtime comparison). Test-only, no runtime\nchange; runs on Windows CI since the structs are cfg(windows).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:52:26-07:00",
          "tree_id": "1d42a683cfb643a99870fca57f865d9e88b409e0",
          "url": "https://github.com/l1a/retch/commit/2ae3ecffd014bc206189c58e5b613f8ff4e0b66d"
        },
        "date": 1783837375219,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 130.1965910488749,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.100751890821487,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.96800831798275,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.15758998922848,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42565.11217031232,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 567.8486198860878,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 805.4524175987834,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2983267455,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "744c0dcd3c15ea67803948e0372c5229715b4783",
          "message": "Fix upload_local_bench.py cp1252 crash on Windows (#152)\n\njust bench-upload and the post-merge hook crashed on Windows with\nUnicodeDecodeError: 'charmap' codec can't decode byte 0x9d — so no local\nWindows \"real hardware\" numbers reached the gh-pages benchmark dashboard.\nThe gh-pages data.js is UTF-8 (commit messages embed arrow/em-dash chars)\nbut open() used the default cp1252 encoding on Windows.\n\nPin encoding=\"utf-8\" on every file operation (data.js read + write, the\nhyperfine JSON temp read) and on run_capture's subprocess text decoding\n(git log --format=%B), plus a sys.stdout.reconfigure UTF-8 guard. Same fix\nclass as scripts/update_wip.py (#142).\n\nVerified: the crash reproduces on the live data.js under the default\nencoding; the UTF-8 read succeeds (845 KB) and append_entry /\ngit_commit_info run without error.\n\nTooling-only; no Rust source touched, retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:01:43-07:00",
          "tree_id": "d579527f5693db2e5215b8c7e6ddfa52671a60fd",
          "url": "https://github.com/l1a/retch/commit/744c0dcd3c15ea67803948e0372c5229715b4783"
        },
        "date": 1783866827952,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 127.83475183416847,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.858507434238545,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 128.86641367377337,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.1399673238574,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42929.58793077639,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 613.0026650411459,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 842.7837131320266,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2489845895,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6c384b96645a8d096e3c0f7a55be58958363939a",
          "message": "Bump version to 0.4.0 (milestone release) (#153)\n\nMinor version bump (0.3.52 -> 0.4.0) marking the completed Windows\nnative-FFI migration and the first GitHub Release since v0.3.40 (rolls up\n#141-#152). Version-marker only — no code change; retch-sysinfo stays at\n0.1.40 and crates.io remains intentionally held.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:46:27-07:00",
          "tree_id": "53e438ffe42566998097d0bc24ec6bd506b380bf",
          "url": "https://github.com/l1a/retch/commit/6c384b96645a8d096e3c0f7a55be58958363939a"
        },
        "date": 1783869470109,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.45105619365049,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.367118935582896,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 131.37712839474312,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.27558436626275,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42366.79521468456,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 676.415596841812,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 1054.2069626178895,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2152603640,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88162b293638dfad573a4b63f046cd27aca023f4",
          "message": "Bump to 0.4.1; fix license SPDX for crates.io (#154)\n\nCorrect the deprecated `license = \"GPL-3.0\"` to `GPL-3.0-or-later` in both\ncrate manifests (matching the SPDX-License-Identifier headers in the\nsource) ahead of publishing to crates.io, where per-version license\nmetadata is permanent.\n\nBump retch-cli 0.4.0 -> 0.4.1 and retch-sysinfo 0.1.40 -> 0.1.41 (v0.4.0\nis already tagged, so the license fix requires a new version). No\nfunctional code change. This is the version published to crates.io,\nreversing the prior GitHub-Release-only hold.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T08:27:56-07:00",
          "tree_id": "20fc220a727f5d7f59bb468da3002cf8631afc81",
          "url": "https://github.com/l1a/retch/commit/88162b293638dfad573a4b63f046cd27aca023f4"
        },
        "date": 1783871968560,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 136.2099904792512,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.581093736256608,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 132.5268104825971,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 102.41939137475899,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42867.36551521047,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 639.9200267009658,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 964.5456239502794,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3134440675,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84a7d7c354231007c97f94f25b262266bb64e146",
          "message": "Fix machine-dependent format_cpu_cores tests (#155)\n\n`format_cpu_cores` reads the host's real CPU topology (Linux /sys cpufreq,\nmacOS hw.perflevel*) and returns a \"NP + ME / KT\" hybrid string on Intel P/E\nand Apple Silicon machines, ignoring its passed-in (logical, physical) counts.\nThe four fallback unit tests called it with fixed args, so they passed on\nnon-hybrid CPUs/CI runners but failed on a hybrid host — an i7-1360P produced\n\"8P + 8E / 16T\" for (16, Some(8)) where the test expected \"8C / 16T\", hard-\nfailing `just pr` there.\n\nExtract the pure fallback into `format_cpu_cores_plain` and retarget the four\ntests at it, so they no longer depend on the runner's hardware. Public\nbehavior of `format_cpu_cores` is unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:41:15-07:00",
          "tree_id": "26f59d72e69fb5f71508fb9427bd765258b160f2",
          "url": "https://github.com/l1a/retch/commit/84a7d7c354231007c97f94f25b262266bb64e146"
        },
        "date": 1783908820391,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.74541132791956,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.327661167521707,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.76964523950059,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.34053307470393,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42441.97421232909,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 854.7499118275512,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 824.6313784293234,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2682709000,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be732f18be8ed35c252a364cc1241d542d0962ef",
          "message": "Enforce LF line endings via .gitattributes (#156)\n\nThe working tree is shared across Linux/macOS/Windows via Syncthing. With no\n.gitattributes and core.autocrlf=false, a Windows checkout wrote CRLF, Syncthing\npropagated those bytes to the Linux clones, and git reported the entire tree as\nmodified — a phantom 13811+/13811- whole-tree diff with zero content changes\n(git diff --ignore-all-space empty). This blocked the just-pr clean-tree checks.\n\nAdd `* text=auto eol=lf` to force LF on checkout on every OS (essential for a\nbyte-identical Syncthing-shared tree) and `*.png binary` to protect the logo\nassets. HEAD was already stored as LF, so no tracked content changes.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:59:28-07:00",
          "tree_id": "09a0473cae06eab0155f9d17e371c9dc4271dea9",
          "url": "https://github.com/l1a/retch/commit/be732f18be8ed35c252a364cc1241d542d0962ef"
        },
        "date": 1783909936029,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.84522462049102,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.319681298269932,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.3936208578605,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.90762346836839,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42515.81699520827,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 592.1520885998711,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 816.9493129794204,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3334608260,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "280db85bc07aaa37fe6e22c1428c57d3a95ba55b",
          "message": "Add Linux login-manager/brightness/power-adapter (#157)\n\nThree new --long fields closing NOTES §6 fastfetch gaps, each a cheap\nsingle-source Linux probe in the sequential detect_* style (like init/chassis):\n\n- login-manager: resolves the display-manager.service systemd unit symlink\n  (GDM/SDDM/LightDM/greetd/…), prettified.\n- brightness: reads /sys/class/backlight/*/{brightness,max_brightness} as a %.\n- power-adapter: reads the Mains supply under /sys/class/power_supply (name +\n  connected state; wattage omitted — sysfs Mains rarely exposes it).\n\nAll three are Linux-only (None elsewhere). Each detector wraps a pure helper\n(login_manager_from_unit / brightness_percent / format_power_adapter), split\nout and unit-tested host-independently per the v0.4.2 format_cpu_cores lesson;\nhelpers + tests are cfg(linux) so they aren't dead code under clippy -D warnings\non other platforms. Verified live on corrino (greetd, 51%, AC (connected)).\n\nretch-cli 0.4.3 -> 0.5.0, retch-sysinfo 0.1.42 -> 0.1.43.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T20:11:45-07:00",
          "tree_id": "c4f4b86a753026bf48a3009deb1ece1f46ea99bc",
          "url": "https://github.com/l1a/retch/commit/280db85bc07aaa37fe6e22c1428c57d3a95ba55b"
        },
        "date": 1783914215788,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 130.91610401096887,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.892303813551928,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 130.59371473826582,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.19840211485328,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42743.310596014395,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 676.3024212528288,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 830.6228167710975,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3515455530,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbb9672b8c95616671974128187d9d3b32f0fe53",
          "message": "Fix network status bracket color nesting (#158)\n\nowo_colors closes every foreground color with the default-reset \\x1b[39m, so\nthe green \"Up\" / red \"Down\" embedded in the Net value cancelled the enclosing\nvalue color (and, for the active interface, the bright-blue highlight). Everything\nafter [Up] fell back to the terminal default: the active line's opening [ was blue\nbut the closing ] and the RX/TX stats were not.\n\nAdd colorize_nested(text, prefix) which re-asserts the enclosing color after every\ninterior \\x1b[39m so nested colored spans restore the surrounding color instead of\nfalling to default. It is byte-identical to the old plain wrap when there is no\nnested reset, so only the Net field's rendering changes. Theme::color_value routes\nthrough it and the active-interface highlight uses ACTIVE_IFACE_PREFIX. The library\nnetwork.rs is untouched. Four regression tests cover the helper.\n\nBump retch-cli to 0.5.1 (retch-sysinfo unchanged at 0.1.43); regen man page.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T21:49:19-07:00",
          "tree_id": "15c36368910c46efd1ba4d0a4f43df2b81c63aa0",
          "url": "https://github.com/l1a/retch/commit/fbb9672b8c95616671974128187d9d3b32f0fe53"
        },
        "date": 1783919981336,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.72653035746316,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.31671226230092,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.3158819133641,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.00406099877314,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41386.72105676448,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 571.7687017181754,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 809.5142737253739,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2106396785,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c4f762eed77a36ac3d95a1beb6a4cab62afb2965",
          "message": "Add Windows domain and terminal-size fields (#159)\n\nTwo --long fields that previously returned None on Windows now have\nnative arms — the first of the Windows cross-platform-parity feature\nseries (distinct from the completed PowerShell->FFI perf migration).\n\n- domain: primary DNS suffix via GetComputerNameExW(ComputerNameDnsDomain)\n  (kernel32, two-call size probe). A workgroup host's empty suffix maps to\n  None via the pure clean_domain helper — not the NetBIOS WORKGROUP name —\n  matching the Linux/macOS /etc/resolv.conf DNS-domain semantics.\n- terminal-size: console viewport via GetStdHandle + GetConsoleScreenBufferInfo,\n  using the srWindow rect (not dwSize, the scrollback buffer). Pure\n  window_rect_to_size helper does the inclusive-rect -> \"COLSxROWS\" math;\n  piped output has no console -> graceful None -> existing env fallback.\n\nHand-written extern \"system\" FFI, no binding crate (house style); // SAFETY:\non every unsafe. Non-Windows arms untouched. New tests: clean_domain,\nwindow_rect_to_size, and a CONSOLE_SCREEN_BUFFER_INFO size_of layout guard.\nVerified live on arrakis (Windows 11): domain correctly absent (DNS suffix\ngenuinely empty), terminal-size renders 100x40.\n\nretch-cli 0.5.1 -> 0.6.0, retch-sysinfo 0.1.43 -> 0.1.44.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:13:18-07:00",
          "tree_id": "89121134b1cdf90e97f3ba23b740bd744dbf5193",
          "url": "https://github.com/l1a/retch/commit/c4f762eed77a36ac3d95a1beb6a4cab62afb2965"
        },
        "date": 1783979155166,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 126.51363164600684,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.329239179098123,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.708698747598,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 103.14298879935748,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41600.997158446335,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 573.2275454847234,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 813.9184612337017,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3186269300,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30195b0eaaf4f96b4b6fe43c11001046a871537b",
          "message": "Fix Windows Camera (scanners) and Users (=0) bugs (#160)\n\nTwo user-reported Windows output bugs in the cross-platform-parity series.\n\nCamera listed scanners as cameras (e.g. \"EPSON ET-3850 Series\"). The Windows\npath enumerated the Camera + Image (WIA) setup classes, but scanners/printers\nshare the Image class with some real webcams (a Logitech BRIO is Image-class),\nand is_real_camera has no keyword to catch an EPSON model string. Fixed by\nenumerating the KSCATEGORY_VIDEO_CAMERA device-interface class instead — only\nreal cameras register it, so scanners are excluded while Image-class webcams are\nkept. Added win_setupapi::present_interface_device_names (DIGCF_DEVICEINTERFACE,\nsharing the existing enumerate_names core) + the KSCATEGORY_VIDEO_CAMERA GUID;\nremoved the now-unused GUID_DEVCLASS_CAMERA/_IMAGE. Also drops the synthetic\n\"Windows Virtual Camera Device\" via a Windows-only is_windows_virtual_camera\nhelper (Linux/macOS untouched).\n\nUsers showed 0 with a user logged in: sysinfo keys Windows users by SID, so the\nUnix uid>=1000 filter never matched. New win_users module counts active\ninteractive sessions via WTSEnumerateSessionsW + WTSQuerySessionInformationW\n(wtsapi32; query-user semantics), with a pure unit-tested count helper. Per the\n\"if it doesn't work, don't show it\" request, display.rs now suppresses Users\nwhen the count is 0 (mirrors the packages guard).\n\nNon-Windows camera/users behavior unchanged. FFI house style (hand-written\nextern \"system\", // SAFETY:, WTS_SESSION_INFOW size_of guard). Verified live on\narrakis: Camera = Logitech BRIO + ASUS FHD webcam only; Users: 1.\n\nretch-cli 0.6.0 -> 0.6.1, retch-sysinfo 0.1.44 -> 0.1.45. Patch (bugfixes).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:46:19-07:00",
          "tree_id": "13dc79f2b8c9dd3041dc8f5dfc070fb42bba266a",
          "url": "https://github.com/l1a/retch/commit/30195b0eaaf4f96b4b6fe43c11001046a871537b"
        },
        "date": 1783981063749,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.15693003508173,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.312976025223966,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.74303463183783,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.2753812240411,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41302.817832369365,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 611.6894985802742,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 980.7717730523764,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2458504400,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2b4a083ed6b7696bd56727cbcc285ed5ac45030f",
          "message": "Unblock just pr on Linux: tests + man regen (#165)\n\nTwo coupled docs/test-hygiene fixes (no runtime behavior change), bundled\nbecause the first is what lets `just pr` pass on the reinstalled Fedora box.\n\n1. Machine-independent xrandr display tests. parse_xrandr_displays called\n   get_monitor_name_for_port (live /sys/class/drm EDID) inline, so the\n   fixture tests substituted the physically-attached monitor for the\n   fixture's connector name (DP-1 -> the panel's EDID model ATNA33AA08-0).\n   These tests are cfg(not(macos/windows)) and never ran on the old Windows\n   arrakis, so the defect was latent until the first cargo test after the\n   Fedora reinstall. Same class as #155. Extract a pure\n   parse_xrandr_displays_with(stdout, resolve); the public wrapper passes\n   get_monitor_name_for_port (production unchanged) and the tests pass\n   |_| None. Add a regression test asserting the resolver is honored.\n\n2. Regenerate docs/retch.1. The committed page carried double-bold groff\n   runs from the Windows #160 `just man` run, where the recipe's\n   sed 's/\\fB\\fB/\\fB/g' strip did not take effect. Linux regeneration\n   produces the intended single-bold output, matching the recipe's intent.\n\nPatch bump: retch-cli 0.6.2, retch-sysinfo 0.1.46 (new pub\nparse_xrandr_displays_with).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:10:26-07:00",
          "tree_id": "545ecee36947f96e29585e4dcc803424559d5b6b",
          "url": "https://github.com/l1a/retch/commit/2b4a083ed6b7696bd56727cbcc285ed5ac45030f"
        },
        "date": 1784907728136,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 137.13709820264597,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.988165437105097,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 129.0333309039558,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.12353704311572,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43449.255394887245,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 554.9077884933824,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 835.0526640078581,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2770485590,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9cbad3234c6ec06f444e623a84b3ff72efbcd50",
          "message": "Bump deps + CI actions (Dependabot #161/163/164) (#167)\n\nConsolidate three open Dependabot PRs into one gated PR so the release-hygiene\nsteps they bypass (retch version bump, NOTES/man regen) are performed. No\nruntime behavior change.\n\n- Rust deps (#164, cargo-dependencies group, all patch-level, lockfile-only\n  since the Cargo.toml specs are caret ranges): clap 4.6.1->4.6.4 (pulls syn v3\n  via clap_builder/clap_derive), serde 1.0.228->1.0.229, toml 1.1.2->1.1.3,\n  clap_complete_nushell 4.6.0->4.6.1, anyhow 1.0.103->1.0.104,\n  libc 0.2.186->0.2.189, sysinfo 0.39.5->0.39.6, serde_json 1.0.150->1.0.151.\n- actions/checkout 7.0.0->7.0.1 (#163) across benchmark/claude/\n  claude-code-review/packaging/rust/security (both SHA-pinned and @v7 uses).\n- softprops/action-gh-release 3.0.1->3.0.2 (#161) in the rust.yml release job.\n\nretch-cli -> 0.6.3; retch-sysinfo unchanged (0.1.46, no source change).\nWorkspace fmt/clippy/test all green.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:51:12-07:00",
          "tree_id": "0627e675b46ff2705a23fb6064df75bf587aac13",
          "url": "https://github.com/l1a/retch/commit/a9cbad3234c6ec06f444e623a84b3ff72efbcd50"
        },
        "date": 1784910198720,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.87005200675551,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.362120432545304,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.77644558607537,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.82333913200273,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42644.52277079231,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 576.3711185916502,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 828.2781475550712,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1812153010,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c0cf9c9583413e1b1d346274f3367162daef52e",
          "message": "Bump base64 0.22 -> 0.23 (Dependabot #166) (#169)\n\nThe one genuinely-new bump from Dependabot #166 (the other 8 crates in that\ngroup already landed in #167/v0.6.3). A semver-breaking 0.x bump, held out of\nthe v0.6.3 consolidation pending an API check. No runtime behavior change.\n\nbase64 is used only under the optional `graphics` feature (src/logo.rs, two\ngeneral_purpose::STANDARD.encode() sites for the Kitty/iTerm2 inline-image\nprotocol). The Engine encode API is unchanged in 0.23: build + clippy\n-D warnings are clean *with --features graphics* (the default gate does not\ncompile base64), and tests pass with and without the feature. `cargo bench`\nis unchanged (base64 is not on any benchmarked path). Widened the Cargo.toml\nspec \"0.22\" -> \"0.23\" since the caret range wouldn't admit 0.23.\n\nretch-cli -> 0.6.4; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T08:22:25-07:00",
          "tree_id": "5c659664226725eb40ca8c915bafbcf13fe02f12",
          "url": "https://github.com/l1a/retch/commit/7c0cf9c9583413e1b1d346274f3367162daef52e"
        },
        "date": 1784994908775,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 125.75091081359726,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.316893860025843,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.54940493391427,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.5268852346032,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44104.502675086704,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 570.738999112332,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 829.8544418083686,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2903597250,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "586012cefc4c98dfa9ab5b227b0832620797265c",
          "message": "Lint graphics feature in just check (v0.6.5) (#170)\n\nAdd `cargo clippy --features graphics -- -D warnings` to the `check` recipe\n(and therefore the `just pr` gate). The base64 0.22->0.23 bump surfaced that\nbase64/image/icy_sixel and their src/logo.rs call sites live behind the\noptional `graphics` feature, which the default `cargo clippy --workspace`\nnever compiles -- so a graphics-only lint or API break could pass the gate\nunseen. Targets retch-cli (which defines the feature), not --workspace.\n\nTooling only, no runtime change. Closes the LOCAL gate gap; CI still builds\ndefault features, so a CI graphics job would be a separate follow-up.\nretch-cli -> 0.6.5; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:33:31-07:00",
          "tree_id": "f944cee1876f95b5314bfca44f0ba40a154033bb",
          "url": "https://github.com/l1a/retch/commit/586012cefc4c98dfa9ab5b227b0832620797265c"
        },
        "date": 1784999136044,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 123.04267155786525,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.7850887657148435,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.35149785590042,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.10107327475995,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43083.71635077779,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 568.2268793914976,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 841.9313936209294,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1343056805,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da6c74f858f9d84a8b3b076473c1026f04aef412",
          "message": "Show ASCII logo without a TTY; fix CI dry-run (v0.6.6) (#171)\n\ndisplay.rs gated the logo purely on stdout_is_tty, so `retch --ascii-logo`\nrendered no logo when piped/redirected -- including CI's full-test \"Run\nfetcher (dry run)\" step, which showed no logo.\n\nExtract a pure `should_show_logo(config_show_logo, no_logo, ascii_logo,\nstdout_is_tty)` helper: `--no-logo` always wins; `--ascii-logo` now forces the\nlogo on regardless of TTY or config (ASCII is plain, pipe-safe text, mirroring\nhow --no-logo is always honored); auto mode is unchanged (default-on,\nTTY-gated). --chafa-logo/graphical modes are deliberately not forced (they emit\nterminal-only control sequences).\n\nUpdate the CI full-test dry-run to `cargo run --release -- --full --ascii-logo`\nso it exercises every field AND the ASCII-logo path. 4 new unit tests on the\nhelper; verified live that piped `--full --ascii-logo` shows the logo while\npiped `--full` alone still shows none.\n\nretch-cli -> 0.6.6; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:48:23-07:00",
          "tree_id": "88dc56bcc4160f88dae2e60506f62a93c2ca7ea4",
          "url": "https://github.com/l1a/retch/commit/da6c74f858f9d84a8b3b076473c1026f04aef412"
        },
        "date": 1785000001071,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.1177297174831,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.354359005587351,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.71557372125565,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.7546796646213,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42143.69726025978,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 619.850779514156,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 897.4932088676305,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2294988865,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ada1356ee93539a36a2c996eaa23e24c481463a3",
          "message": "Add CI graphics-feature job (v0.6.7) (#172)\n\nThe default `build` matrix never compiles the optional `graphics` feature\n(base64/image/icy_sixel + the src/logo.rs inline-image paths), so a\ngraphics-only lint or API break could pass CI unseen -- as the base64\n0.22->0.23 bump nearly did. v0.6.5 closed this in the local `just check` gate;\nthis closes it in CI.\n\nAdd a dedicated `graphics-feature` job to rust.yml (one ubuntu runner, same\nnon-tag triggers as `build`) running:\n  cargo clippy --features graphics -- -D warnings\n  cargo build  --features graphics --verbose\n\nCI only, no runtime change. retch-cli -> 0.6.7; retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T10:40:12-07:00",
          "tree_id": "ee5c8fdd3c4060bb2ec7f42369695582a0637e23",
          "url": "https://github.com/l1a/retch/commit/ada1356ee93539a36a2c996eaa23e24c481463a3"
        },
        "date": 1785003056540,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 123.68834730227861,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.307063239803947,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.41440611378589,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.91433984606262,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42364.33757414492,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 590.7307390623002,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 823.7860099824281,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1900053335,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa886633f69e0ee0a7db86ea7dc9773ceec03be9",
          "message": "Keep logo beside text in --long/--full (v0.6.8) (#173)\n\n* Keep logo beside text in --long/--full (v0.6.8)\n\nThe side-by-side vs. stacked layout decision (and the text-column width) was\ncomputed from the widest of ALL info lines. In --long/--full a single very long\nline -- a 150+ char Wi-Fi line, or the Net/Battery lines -- inflated the text\ncolumn past the terminal width and forced the logo to stack ABOVE the text,\neven though those long lines sit well BELOW the logo.\n\nExtract a pure `plan_layout(info_widths, logo_height, logo_width, term_width,\nshow_logo)` that considers only the info lines that actually sit BESIDE the\nlogo (the first `logo_height` rows). Long lines below the logo render at column\n0 with the full terminal width and no longer affect placement.\n\nLogo-type-agnostic: logo_height/logo_width come from the active logo, so it\nworks identically for ASCII, Chafa (both rendered as text `Lines`) and the\ngraphical image protocols (Kitty/iTerm2/Sixel -- height_lines + fixed image\ncolumn).\n\nVerified in a pseudo-terminal: --full renders the logo beside the text at\n140 cols (previously stacked) and correctly stacks at 90 cols. 7 new\nplan_layout unit tests. retch-cli -> 0.6.8; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8\n\n* CI: build-job dry run uses --full --ascii-logo too\n\nThe `build` job's \"Run fetcher (dry run)\" step still ran `cargo run -- --long`\n(no logo). Make it `cargo run -- --full --ascii-logo`, matching the full-test\ndry run, so every CI dry run exercises all fields and the logo/layout path.\n\nAssisted-By: Claude Opus 4.8\n\n* Split Wi-Fi into two lines; grayscale Apple logo\n\nTwo display tweaks requested on top of the layout fix (same PR):\n\n- Wi-Fi: the iw path builds a single \"{adapter} [{iface}] - {SSID} (band/rate)\"\n  string that ran 150+ chars and wrapped into the logo. Split on the \" - \"\n  boundary via a pure `split_wifi_line` into a `Wi-Fi` line (adapter hardware)\n  and a `Wi-Fi Link` line (live connection). Fallback detectors have no \" - \"\n  and stay one line. `Wi-Fi Link` is aliased to the `wifi` field key in\n  should_show (like dns/memory). 3 unit tests.\n\n- macOS/Apple ASCII logo: replace the legacy rainbow colour bands\n  (green/yellow/red/magenta/blue) with a 256-colour grey (silver) ramp,\n  matching the modern monochrome Apple logo. Graphical macos.png untouched.\n\nretch-cli stays 0.6.8 (same PR); retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix graphical logo landing mid-text in --long/--full\n\nThe side-by-side path for image protocols (Kitty/iTerm2/Sixel) printed ALL the\ninfo lines first, then did `\\x1b[{n}A` to move back up and draw the image to the\nright of the top rows. For tall output (--long/--full) the info block is taller\nthan the viewport, so by the time the text finished the screen had scrolled and\nthe cursor-up was clamped at the top of the viewport -- the image was drawn in\nthe MIDDLE of the text, overlapping it (reported on kitty).\n\nDraw the image FIRST instead: move to the top of the logo column, bracket the\nimage draw with save/restore (\\x1b7/\\x1b8) so it lands at the correct row before\nany text is printed or the screen scrolls, then print the info lines\ntop-to-bottom at column 0. The terminal scrolls naturally and carries the\ncell-anchored image with it. Shared `render_graphical_side_by_side` helper for\nall three protocols. Verified the escape choreography (right/save/image/restore/\nCR/text) at the byte level in a kitty pty.\n\nretch-cli stays 0.6.8 (same PR).\n\nAssisted-By: Claude Opus 4.8\n\n* docs(NOTES): record graphical logo placement fix (v0.6.8)\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T17:31:49-07:00",
          "tree_id": "9b82d07a4ddf3e53b29bc8579d9a7acdcf12908e",
          "url": "https://github.com/l1a/retch/commit/fa886633f69e0ee0a7db86ea7dc9773ceec03be9"
        },
        "date": 1785027712185,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 127.44713552314015,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.3273076726901225,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 124.40044319930507,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.80043248635755,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41851.07986990323,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 556.1912652095737,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 823.785641736033,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2158811520,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b899b3ca3988eab8b8632cbb3b5263bf35322a76",
          "message": "Fix graphical logo placement after scroll (v0.6.9) (#174)\n\nThe v0.6.8 side-by-side choreography saved the cursor (DECSC), drew\nthe image, and restored (DECRC). With the prompt at the bottom of the\nscreen the draw scrolls the viewport, and DECSC/DECRC restore a\nviewport-relative position, so the info text landed below the logo\ninstead of beside it. Reproduced identically on Rio and kitty.\n\nReserve the logo rows with newlines first and cursor-up back to the\nimage-top row, so any scroll happens before the save and nothing\nbetween save and restore can scroll. Fresh-screen output unchanged.\n\nAlso refresh the stale in-repo packaging reference copies\n(PKGBUILD/package.nix 0.3.21 -> 0.6.8), per the tracked WIP task.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:32:00-07:00",
          "tree_id": "a20285fab03aaf49bedc3f4d570f209aaf34e68d",
          "url": "https://github.com/l1a/retch/commit/b899b3ca3988eab8b8632cbb3b5263bf35322a76"
        },
        "date": 1785078170284,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 123.40201106541608,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.321367101583851,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.60969197092204,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.26990878323805,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42246.79393366286,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 561.6942179652864,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 810.5090673669154,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2314733960,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fd8164049e99da545e8fe98d3f0b76e8c09b6faa",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10) (#175)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:58:18-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/fd8164049e99da545e8fe98d3f0b76e8c09b6faa"
        },
        "date": 1785079734439,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.75088685050828,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.743869320223359,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 139.9302936549227,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.68969540926379,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41972.054951269165,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 559.9847909336966,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 836.0682041559827,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2531571285,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e8b380c97debf11a4a35306f669cf3e456ccd616",
          "message": "Report default-route domain, not a VPN's (v0.6.11) (#176)\n\nUnder systemd-resolved /etc/resolv.conf is the stub file whose search\nlist is the merged set of every link's domains, so the Domain field --\nwhich took its first entry -- showed a split-tunnel VPN's domain\n(netbird.cloud) instead of the default route's (lan). It never\nconsidered interfaces at all.\n\nResolve the IP default-route interface from /proc/net/route and report\nthat link's own domain from resolvectl status. Keyed on the routing\ntable, not resolvectl's per-link 'Default Route:' flag, which is a DNS\nrouting flag and was yes for both links. When resolved manages the\ndefault link but it has no domain, report nothing rather than falling\nback to the merged list (which would resurrect the VPN domain); an\nunmanaged link still falls back, so static-resolv.conf hosts are\nunchanged. A full-tunnel VPN that is the default route reports its own\ndomain, as intended.\n\nFix two latent bugs in the same parser: all '~'-prefixed routing-only\ndomains are excluded (not just the exact catch-all '~.'), and wrapped\ncontinuation lines are no longer silently dropped.\n\nresolvectl is now needed by --long, so one OnceLock-cached invocation\nis shared with --full's domain-search rather than spawning twice.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T08:39:18-07:00",
          "tree_id": "8e30bf9598c906aed347fbd5c1c2ab33160360b0",
          "url": "https://github.com/l1a/retch/commit/e8b380c97debf11a4a35306f669cf3e456ccd616"
        },
        "date": 1785082130838,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.91682836752561,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.880764595074889,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.63205241607939,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 86.60890300231456,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 35904.986352169784,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 443.8590715900044,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 634.8484224382594,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2867780505,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "86f5803462d1608de8b7739c8dc6c69bc9c85a46",
          "message": "Give Domain Search one shape per source (v0.6.12) (#177)\n\nCI dry-run output showed 'eth0: <domain>' on Ubuntu but a bare\n'<domain>' on Fedora. The difference is not platform-driven: the same\nOS flips format between jobs. Ubuntu in the build matrix runs on a bare\nrunner and takes the resolvectl path; Ubuntu in full-test runs in a\ncontainer with no systemd-resolved and falls back to resolv.conf.\nFedora is always containerised, so it only looked different from\nUbuntu.\n\nGrouping differed too: the resolvectl path returns one entry per\ninterface with domains joined, while the fallback returned one entry\nper domain and the display prints one line per entry, so 'search a b c'\nemitted three separate bare lines.\n\nRender the fallback in the same '<scope>: a, b' shape, scoped 'global'\n-- labelled honestly rather than attributed to an interface, since\nresolv.conf's search list carries no attribution. The parser stays\nfaithful to the file; the shape is imposed at the detect layer. macOS\nroutes through the same formatter. The resolvectl path is unchanged.\n\nWindows is deliberately not fixed here and is documented in NOTES 6a:\nits Domain reads the AD/primary suffix rather than the connection\nsuffix, and Domain Search has no Windows arm at all. Both need\nGetAdaptersAddresses and cannot be verified live without a Windows box.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T19:35:39-07:00",
          "tree_id": "b11c193d8bdb824b38e28d4104d2b63b410c8fea",
          "url": "https://github.com/l1a/retch/commit/86f5803462d1608de8b7739c8dc6c69bc9c85a46"
        },
        "date": 1785121596204,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 134.51076512644264,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.569680219547747,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 135.39194022559212,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 100.56038305613156,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43517.04811858326,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.935745732934,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 812.6017283378594,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1548375720,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3738fdb3ff66b18fc121092f4f086ea51ac0dc30",
          "message": "Fix release tooling: publish-check and nix hashes (v0.6.13) (#178)\n\npublish-check failed on every release: the retch-cli dry run cannot\nresolve its '=0.1.x' retch-sysinfo pin until sysinfo is actually on the\nindex, and a dry run never uploads. It now checks the sparse index via\na new crates_io_has_version.py helper and skips that leg with an\nexplanation instead of dying on 'failed to select a version'. Both\npublish recipes also skip retch-sysinfo when its version is already\npublished, which is the normal state for a CLI-only release.\n\ncalculate_nix_hashes.py was silently emitting a wrong cargoHash. Its\nsubstitutions matched only 'lib.fakeHash', so once package.nix held\nreal values they became no-ops, the temp build kept the previous\nrelease's hashes, it failed on a source-hash mismatch rather than the\nintended cargoHash mismatch, and the lenient parser returned that stale\nsource hash. That is why the published v0.6.12 cargoHash equals\nv0.6.8's hash. Patterns now match a literal hash too, are line-anchored,\nand hard-error when they match nothing; the parser only accepts a hash\nreported against our own dummy.\n\nRefresh the in-repo packaging reference copies to the released v0.6.12.\npackage.nix keeps the genuine src hash but resets cargoHash to\nlib.fakeHash rather than carrying the corrupt value -- recompute with\n'just nix-update' on a machine with Nix.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-07-26T20:14:41-07:00",
          "tree_id": "195de4a24b9c74a5d3bbc3288e0a4ce21ab48a89",
          "url": "https://github.com/l1a/retch/commit/3738fdb3ff66b18fc121092f4f086ea51ac0dc30"
        },
        "date": 1785123906101,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 97.88015483750223,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.9419199452674993,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.81646333611488,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 74.56416514682768,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 39996.67501787091,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 487.76714969089306,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 703.1043720078692,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1486674090,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29c90fa282c281f6c5a2b797544c5babf5e957ce",
          "message": "fix(net): resolve Windows connection DNS domain and search list (#181)\n\n* fix(net): resolve Windows connection DNS domain\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(net): read Windows interface registry search list\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-07T23:10:01-07:00",
          "tree_id": "1430e5590c797113f0e21a4cdab22e90bfe90ce4",
          "url": "https://github.com/l1a/retch/commit/29c90fa282c281f6c5a2b797544c5babf5e957ce"
        },
        "date": 1786171210305,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 133.71058553949322,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.716807527355582,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 146.71881064068072,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.52404563317907,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42324.245571834734,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 743.20709281511,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 924.1332797864595,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2636115555,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "464951f8ff41455093d91045e621a17b81124684",
          "message": "fix(display): parse monitor vendor and panel model from EDID on Windows (#183)\n\n* fix(display): parse monitor EDID on Windows\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): extract monitor vendor and model on Windows\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-08T07:48:08-07:00",
          "tree_id": "5029838743a7e4449bedecce22a3d07443557dd7",
          "url": "https://github.com/l1a/retch/commit/464951f8ff41455093d91045e621a17b81124684"
        },
        "date": 1786202474588,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 219.0500482694893,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.178244896739466,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.67391818192482,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 99.05108718022996,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42299.14720325584,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 567.7376943390354,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 829.1380591871919,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1604219120,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "622cf3b843fc5f6286cad91442e7bd41af2fdf12",
          "message": "Bump 4 deps and fix man page font-run strip (#184)\n\nConsolidates Dependabot #182 onto a gated branch so the release-hygiene\nsteps Dependabot skips (version bump, NOTES entry, man regen) are done.\n\nDependencies (cargo-dependencies group, lockfile-only — every spec is a\ncaret range, so Cargo.toml is untouched):\n  clap          4.6.4 -> 4.6.5  (clap_builder 4.6.2 -> 4.6.5)\n  toml          1.1.3 -> 1.1.4  (toml_parser  1.1.2 -> 1.1.3)\n  clap_complete 4.6.7 -> 4.6.8\n  base64        0.23.0 -> 0.23.1\n\nThe resulting Cargo.lock is byte-identical to what Dependabot generated.\n\nAlso fixes the `just man` font-collapsing sed, which has never worked on\nany platform. mandown emits redundant \\fB\\fB...\\fP\\fP runs and the recipe\ncarried `s/\\fB\\fB/\\fB/g` to strip them, but GNU sed reads \\f as the\nform-feed escape rather than backslash-then-f, so the pattern only ever\nmatched form feeds that groff output never contains. This is why\ndocs/retch.1 kept flip-flopping between machines: v0.6.2 concluded the\nstrip merely \"didn't take effect on Windows\", when in fact Linux was not\nstripping anything either — its mandown build just doesn't emit the\ndoubled runs. Matching the backslash as [\\] and carrying it out through a\ncapture group keeps any backslash escape off the replacement side.\n\nWith the fix, `just man` on Windows reproduces byte-for-byte the file a\nLinux `just man` produces, so the regen check in `just pr` no longer\ndepends on which machine last ran it. The regenerated page drops 21\ndoubled font runs and changes nothing else but the version footer.\n\nretch-sysinfo unchanged at 0.1.51; no Rust source touched.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-09T07:06:33-07:00",
          "tree_id": "15f29415e43f3e3f4f04318b070cc8c16695ac9a",
          "url": "https://github.com/l1a/retch/commit/622cf3b843fc5f6286cad91442e7bd41af2fdf12"
        },
        "date": 1786286405536,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 275.6855622185276,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.2068984870252475,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.85042990133195,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 105.95660801970764,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44925.984630624516,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 574.8177073720839,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 813.4174482853817,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2917678400,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30f2bc0d85fda967af17b3472e2784627296f331",
          "message": "fix(justfile): make install and man recipes portable (#185)\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T13:24:44-07:00",
          "tree_id": "0ebf13827d71fe02fbbdd12b0eb83ccbacbc2ab8",
          "url": "https://github.com/l1a/retch/commit/30f2bc0d85fda967af17b3472e2784627296f331"
        },
        "date": 1786395437879,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 224.95997343909144,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.356716185290162,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 121.82534390862558,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.89986099014689,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42457.353200982136,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.5978188273092,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 809.777811353262,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2943433875,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "521364f30839992fda65499538a01a44bc4f11bb",
          "message": "fix(display): constrain graphic logo height, normalize audio, and wrap lines to terminal width (#186)\n\n* fix(display): reduce logo height and wrap long info lines\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): constrain graphic logo height and wrap below-logo lines to full terminal width\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): normalize and deduplicate Windows audio device names\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): evaluate soundwire before streaming filter in normalize_win_audio_device\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T14:10:09-07:00",
          "tree_id": "8526b53eccb25ed2a964d63d08a63e698c00c32f",
          "url": "https://github.com/l1a/retch/commit/521364f30839992fda65499538a01a44bc4f11bb"
        },
        "date": 1786398086747,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 216.1651294524223,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.720145252494483,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 134.1004741851806,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 108.65377947064083,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48303.873371600705,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 640.6735755345546,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 852.3056109708626,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2542209250,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1177d194785c63e2058a99f5cffa5ef33577d9cb",
          "message": "ci: disable Claude Code Review workflow (#187)\n\nThe claude-review job no longer runs on pull requests: the\n`pull_request` trigger is replaced with `workflow_dispatch` and the\njob carries `if: false`, so it is off by default but can still be\ninvoked manually if wanted.\n\nBumps retch-cli 0.6.16 -> 0.6.17 (patch), refreshes Cargo.lock,\nregenerates docs/retch.1 for the new version footer, and updates the\nNOTES.md Current State header and release log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T08:18:19-07:00",
          "tree_id": "5edf46dce11e5ab7293d0a0411af8f9341a70b2b",
          "url": "https://github.com/l1a/retch/commit/1177d194785c63e2058a99f5cffa5ef33577d9cb"
        },
        "date": 1786463419890,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 236.75824400898165,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.877188501085049,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.60434721342199,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 107.21250577749213,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43746.95337147356,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 576.982935317888,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 824.400282028277,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3205428210,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1d0dc367f9ad44e2a04cc045891998fa9d9b1aae",
          "message": "fix: unprivileged Packages, sudo Rio, logo aspect (#189)\n\nThree defects found by diffing `sudo retch --full` against a plain run.\n\nPackages appeared only under sudo. The RPM SQLite database was opened\nread-write; it is root-owned inside a root-owned directory, so SQLite\ncould not create its journal sidecars and every *query* failed with\n\"attempt to write a readonly database\" — not the open(), which is why\nthe existing warning never fired and the field vanished silently. Now\nopened read-only over a `file:...?immutable=1` URI, and the query error\nis reported instead of swallowed.\n\nRio lost all graphics support under sudo: it was identified only by\nTERM_PROGRAM, which env_reset drops. `is_rio_terminal` now also accepts\nTERM=rio/xterm-rio, which sudo preserves.\n\nThe Kitty logo was stretched ~3x vertically. `c=26,r=10` was hardcoded\nand Kitty forces an image into that rectangle, while display.rs assumed\na fixed 40-column width and derived the row count a third way. A single\npure `fit_logo_cells` now feeds all three protocol emitters and\nplan_layout. Passing both correct values still left a 9% stretch from\ncell quantisation, so the Kitty spec carries only the limiting dimension\nand lets Kitty derive the other — measured 0.0% aspect error in a PTY.\n\nThe chafa box widens 28 -> 45 columns (row cap unchanged at 10) so wide\nlockup assets stay legible: the Fedora logo goes from 4 rows to 7. The\nside-by-side threshold is unaffected (45 + 45 <= 95), pinned by a test.\n\nAlso fixes a test-isolation defect the change exposed: once\nsupports_iterm2 read TERM, the host's TERM leaked into a test that\nguarded only TERM_PROGRAM, failing on a Rio box and passing on CI.\n\nDocuments the privilege trade-off in both directions (root-only\nphys-mem and btrfs snapshot counts; user-only editor/desktop/wm) in a\nnew NOTES section, README, and a man-page PRIVILEGES section.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T17:52:19-07:00",
          "tree_id": "9996d32ff3728e9292ad474ad37e12907763f637",
          "url": "https://github.com/l1a/retch/commit/1d0dc367f9ad44e2a04cc045891998fa9d9b1aae"
        },
        "date": 1786497822637,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 215.34934801464152,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.607358620079755,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.82649713856208,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.70180666453189,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41750.71328796639,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 601.8452033674455,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 827.1828857725152,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3790500705,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d27af8746fe0e349822f3272031e94e03589b50",
          "message": "chore: bump 3 deps (consolidated Dependabot #188) (#190)\n\nRolls Dependabot #188 onto a gated branch so the release hygiene it\nbypasses — version bump, NOTES entry, man regen — is actually done,\nfollowing the #167/v0.6.3 and #184/v0.6.16 pattern.\n\nAll patch-level and lockfile-only; every spec is a caret range, so both\nCargo.toml manifests are untouched:\n\n  clap           4.6.5 -> 4.6.6  (pulls clap_builder 4.6.5 -> 4.6.6)\n  clap_complete  4.6.8 -> 4.6.9\n  rusqlite       0.40.1 -> 0.40.2 (pulls libsqlite3-sys 0.38.1 -> 0.38.2)\n\nThe lockfile was diff-verified byte-identical to Dependabot's before the\nversion bump, so this carries exactly the change its green CI validated;\nafterwards the only divergence is retch-cli's own version line.\n\nrusqlite warranted a live check rather than just a green suite: it is a\ndirect dependency of retch-sysinfo and the crate v0.6.18's Packages fix\nhad just started using differently, and libsqlite3-sys bundles SQLite\nitself, so a bump changes the engine that has to honour `immutable=1`.\nThe rpm_db_uri unit tests only assert string construction and could not\ncatch a behavioural change there. Verified live as an unprivileged user:\nPackages: 2509, unchanged.\n\nretch-cli -> 0.6.19; retch-sysinfo unchanged at 0.1.53 (no source\nchange, only its transitive lockfile deps moved).\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T18:52:53-07:00",
          "tree_id": "0f8eb7815bf12c631f95919caaeb1e89e3549096",
          "url": "https://github.com/l1a/retch/commit/9d27af8746fe0e349822f3272031e94e03589b50"
        },
        "date": 1786501489391,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 224.91891156759607,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.680698033802287,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 151.48108898753108,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.59311885456994,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44253.519172648565,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 700.7030020767534,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 895.7013261654316,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3168153935,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbd76828105384492815f283cc8351f68368cb56",
          "message": "Fix nushell completion path; adopt shared helpers (#191)\n\ninstall_completions.py wrote nushell completions to\n$XDG_CONFIG_HOME/nushell/autoload. On Windows\n$nu.user-autoload-dirs is exactly %APPDATA%\\nushell\\autoload and\nnushell never reads the XDG path, so the helper wrote a real file\nsomewhere nothing consults, printed the path, and delivered nothing.\n\nTwo more defects in the same helper: it logged a generation failure\nto stderr, continued, and then printed \"Installed completions for\nretch:\" unconditionally -- success reported over work not done; and\nnothing checked whether zsh would ever load the file (it reads only\ndirectories on fpath, and site-functions is not on it by default).\nIt now checks, via an INTERACTIVE zsh, since a non-interactive one\nreports the built-in default.\n\nThis repo's MECHANISM was right and is now the standard. v0.6.16\nmoved these recipes to Python so they run natively on Windows\nwithout Git's usr\\bin; rusticprofile first proposed replacing them\nwith sh recipes because it held the correctness fixes, which would\nhave regressed that work in the name of consistency. Each repo had\nsolved half the problem.\n\ninstall_completions.py and install_man.py are now vendored\nbyte-identically across retch, rusticprofile and etr, with\ntemplates/justfile-common.just as the Justfile block reference.\nstandard-check runs their self-tests -- not a text diff, since\nseparate repos cannot diff each other's files and a diff would pass\non a repo that never adopted the standard -- and check depends on it.\n\nAlso adds install-tag VERSION, which installs a released tag with\nbinary, completions (from the INSTALLED binary) and man page (from\nthe tag) so the three cannot disagree.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T17:11:38-07:00",
          "tree_id": "52f09d8ff2178e92d32e22dc2177be6643ec678b",
          "url": "https://github.com/l1a/retch/commit/fbd76828105384492815f283cc8351f68368cb56"
        },
        "date": 1786581857084,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 218.74624484387587,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.362273839682817,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 115.13530950212393,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.51865345689995,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42431.48907601673,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 604.0690252313206,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 844.4121881649102,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3264037250,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1b99674ea9eded99c6558e78098409ebe6a78ac",
          "message": "Make the pre-PR gate answerable; open-pr now pushes (#192)\n\n* Make the pre-PR gate answerable; open-pr now pushes\n\njust pr ended in a bare read, so only a human at a terminal could\nanswer it -- a script or agent blocked on a stdin that would never\nanswer, or died without saying why, and that reads as the gate refusing\nthe change. It now accepts PR_CONFIRM, an interactive stdin, or piped\ninput under a timeout, and names PR_CONFIRM when it cannot be answered.\nNot a bypass: every path still requires an explicit y.\n\njust open-pr did not push, so on a never-pushed branch it printed\n\"Gate passed\" and then failed because gh pr create had no remote\nbranch to open from. It now pushes only when there is no upstream --\npushing unconditionally would silently publish existing commits on a\nbranch that already has one. pre-push still runs just check, so the\npush is inside the gate rather than around it.\n\nBoth are rusticprofile's 0.0.21 and 0.2.12, which retch never received.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:24:18-07:00",
          "tree_id": "7307c8c54022ab27b0b3e8ecfeab8995613e25ea",
          "url": "https://github.com/l1a/retch/commit/c1b99674ea9eded99c6558e78098409ebe6a78ac"
        },
        "date": 1786593388568,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 213.12054756649985,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.406597559715065,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 121.90139885143076,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.84650348741597,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43245.54229089133,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 679.6572549295431,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 839.965926381348,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2909613905,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6",
          "message": "Let the manual Claude review actually run (#193)\n\n* Let the manual Claude review actually run\n\nv0.6.17 disabled automatic review by commenting out the pull_request\ntrigger AND setting if: false on the job. The trigger alone already did\nthat, so the guard added nothing -- but it also applied to\nworkflow_dispatch, which was kept. So gh workflow run started a run,\nskipped the job, and reported SUCCESS having reviewed nothing.\n\nA green run that did nothing is the failure this repo's tooling exists\nto refuse, and the one rusticprofile recorded twice about this action.\nDispatch available but silently inert is worse than working or absent.\n\nAutomatic review stays OFF -- only the job guard is removed; the\npull_request trigger is still commented immediately above it.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:45:42-07:00",
          "tree_id": "a129dbfd95e55ff45255a019bb60311bdfcf5738",
          "url": "https://github.com/l1a/retch/commit/e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6"
        },
        "date": 1786594629093,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 220.44556736385658,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.383975184577641,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.09275006170472,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.99512836595427,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44707.16205703922,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 611.1084723831478,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 850.4327315768269,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2078161525,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a",
          "message": "Gate merge-pr on CI; bring the triad under standard-check (#194)\n\n* Gate merge-pr on CI; check the triad\n\nmerge-pr went straight from the branch check to gh pr merge --squash\n--delete-branch, with no inspection of the status rollup. gh pr merge\nhappily merges a red PR when there is no branch protection, so every\nmerge in this repo has been ungated -- safe only because whoever merged\nhappened to look first.\n\nrusticprofile added this in v0.1.5 after a PR went in with a leg red,\nand extended it in 0.2.1 after an EMPTY rollup passed vacuously.\nNeither reached here.\n\nThree refusals now: a failing check, an empty rollup, and checks still\nrunning. The empty state is compared as a string rather than via jq -e\nlength, because an external jq is not on a default Windows PATH and a\ngate that degrades where its dependency is missing is the thing being\nfixed.\n\ngate_conformance.py (template v3) is vendored and run by\nstandard-check, so the guards cannot vanish again. It is structural,\nnot behavioural, and says so.\n\nVerified safely: on a branch with no PR the rollup is empty, so\nmerge-pr refuses before reaching gh pr merge.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T21:18:47-07:00",
          "tree_id": "09cf28f2dd68d69de2931ed6e287f3ca4b42fd13",
          "url": "https://github.com/l1a/retch/commit/25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a"
        },
        "date": 1786596863637,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 226.538980419437,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.394215300538855,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.77216085916943,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 110.4103526638763,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48397.5540875657,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 609.9875980283866,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 834.6100308363606,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3083114285,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "120ed8e2e0fe45a624212a8204ae34b082b8c360",
          "message": "Add keyboard, mouse and tpm fields (#195)\n\n* Add keyboard, mouse and tpm fields\n\nThree NOTES.md section 6 fastfetch-gap fields, all --long and above,\nLinux-only, in the v0.5.0 shape: thin /proc and sysfs readers over pure\nhelpers that unit-test without touching host hardware.\n\nInput classification is exclusive and declines to guess. On a Logitech\nUnifying/Bolt receiver no kernel-visible signal separates a keyboard from\na mouse: handlers, capabilities/rel (0x1943 on both), the alphabet key\nblock, INPUT_PROP, udev ID_INPUT_* (POINTINGSTICK on both), USB HID\nbInterfaceProtocol and the HID report descriptor itself are all identical\nfor an MX Keys and an MX Master 3. fastfetch 2.66 gets this wrong in both\ndirections on that hardware. Ambiguous devices are resolved via the HID++\ndriver's battery model_name and, failing that, reported in neither field\nrather than asserted into the wrong one.\n\ntpm reads tpm_version_major and maps it to the published spec names\n(1 -> 1.2, 2 -> 2.0), returning None for anything unrecognised.\n\nAlso refresh packaging/aur/PKGBUILD, stranded at 0.6.12 for eleven\nreleases while the AUR moved to 0.6.23, and drop its man-page\nregeneration: the font-strip sed never matched on any platform (GNU sed\nreads \\\\f as a form feed) and $DATE/$pkgver were literal inside double\nquotes, so the installed footer read \"retch $pkgver\". The committed\ndocs/retch.1 ships in the tarball with the correct footer, so package()\ninstalls it directly and the mandown makedepend is gone.\n\nStrata golden counts move Long 49->52, Full 55->58. 11 new unit tests.\nVerified live on corrino (Fedora 44, i7-1360P).\n\nAssisted-By: Claude Opus 5\n\n* Close two holes in the aur CI job\n\nThe job rewrote source= and sha256sums= to build from local sources, so the\ndeclared checksum was never checked by anything — a stale one (as this\nPKGBUILD carried for eleven releases) stayed green and would only fail for\nsomeone installing from the AUR. Verify it against the real tag tarball\nbefore that patching, refusing a committed SKIP and skipping cleanly when the\ntag is not published yet.\n\nNothing inspected the packaged man page either, which is where both defects\nthis branch fixes actually showed. Assert the built package's .TH line carries\nno literal $ and a real retch <version> footer, and that no doubled font runs\nsurvive.\n\nAlso stop pre-installing mandown, so makedepends is load-bearing: makepkg -s\ninstalls what the PKGBUILD declares and nothing else.\n\nAssisted-By: Claude Opus 5\n\n* Fix the man-page check failing on a correct package\n\nThe new verification step used `bsdtar -tf \"$pkg\" | grep -qx …` under\n`set -o pipefail`. grep -q exits on its first match, bsdtar takes SIGPIPE and\nexits 141, and pipefail turns that into a failed pipeline — so the step\nreported the man page missing exactly when it was present, and CI went red on\na package that was correct. head -1 and grep -m1 carry the same hazard.\n\nMaterialise the listing and the page to files and grep those; select the\npackage with find -print -quit. Verified against a good package and against\npurpose-built broken ones (missing page, literal $ footer, doubled font runs).\n\nAssisted-By: Claude Opus 5\n\n* Match the gzipped man page makepkg actually ships\n\nmakepkg's zipman option is on by default, so the packaged path is\nusr/share/man/man1/retch.1.gz. The verification step looked for retch.1 and\nreported it missing — the check wrong again, the package correct again.\n\nMatch retch.1 with an optional .gz/.zst/.xz/.bz2 suffix and decompress before\ninspecting. Tested against gzipped, uncompressed, and gzipped-but-broken\npackages.\n\nThe diagnostic added in the previous commit is what made this cheap: printing\nthe real usr/share listing on failure named retch.1.gz directly in the CI log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T09:49:12-07:00",
          "tree_id": "274aff11102cf1108fb49cbe2f4d8beedda7b477",
          "url": "https://github.com/l1a/retch/commit/120ed8e2e0fe45a624212a8204ae34b082b8c360"
        },
        "date": 1786727923005,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 232.47524772943711,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.425267569169258,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.58459042219474,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 103.55844376568996,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41999.28739519198,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 685.6371570799918,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 924.7364748789171,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2770409080,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0fb38978e0182c24717fea4d8b4a80047b15d233",
          "message": "Make packaging/aur the source, not a stale copy (#196)\n\npackaging/aur/PKGBUILD was a reference copy that nothing rendered, published or\nchecked. It reached eleven releases of lag (0.6.12 in-repo against 0.6.23\npublished), and because the copy was inert the live AUR PKGBUILD kept two\nman-page defects long after they were fixed here — Arch installs got a page\nfooted $DATE / retch $pkgver the whole time.\n\npackaging/aur is now the source. aur-bump renders it from a released tag,\naur-publish pushes exactly those files, and .SRCINFO is tracked and generated\nby a real makepkg --printsrcinfo in a container (no host here runs Arch).\nCarried over from rusticprofile: write to a temp file and move it into place so\na failure cannot truncate the committed file, check the output content rather\nthan the exit code, and mount :z never :Z.\n\nscripts/aur_check.py is the anti-drift guard and just check depends on it. It\ncompares the pair field-by-field including the expanded source URL, so it\ncatches a pair that agrees on the version and disagrees on the checksum — the\nshape that breaks on the user's machine and nowhere else. Pure Python, so it\nruns on Windows; parses rather than sourcing the PKGBUILD, and raises rather\nthan expanding unknown variables to empty.\n\nVerified end to end: the generated .SRCINFO came out byte-identical to the one\nhand-written and pushed to the AUR earlier today, and AUR_CONFIRM=n\njust aur-publish exercised every preflight check without publishing.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T10:43:28-07:00",
          "tree_id": "0dcac6b08b8ab4bb34654fbcf6096f083db1f748",
          "url": "https://github.com/l1a/retch/commit/0fb38978e0182c24717fea4d8b4a80047b15d233"
        },
        "date": 1786731290901,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 226.51291323891624,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.08728143909519,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.5395335153228,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 102.47735546636582,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42536.78875968545,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 588.0538643131665,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 825.9462939142762,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2359147595,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9b8bcc71daafe3d38abb8ba9085195eef680d68f",
          "message": "Native Media and Player Detection (#197)\n\n* Add native media and player detection fields\n\nImplement 100% native FFI / direct socket media and player detection with zero subprocess forks across Windows (WinRT COM GlobalSystemMediaTransportControlsSessionManager via combase.dll), Linux (direct Unix domain socket D-Bus MPRIS client), and macOS (Objective-C runtime SBApplication FFI).\n\nAdds 'player' and 'media' to FIELDS registry (Mode::Long, available in --long and --full). Strata golden counts Long 52 -> 54, Full 58 -> 60. Regenerated man page, updated README.md, docs/retch.1.md, NOTES.md, WIP.md, and GitHub wiki.\n\nAssisted-By: Gemini 2.5 Flash\n\n* Fix Rust 1.97 Clippy lints in media.rs\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:19:02-07:00",
          "tree_id": "5f6c7da98e5d1a0862003b59cc74c4130d097866",
          "url": "https://github.com/l1a/retch/commit/9b8bcc71daafe3d38abb8ba9085195eef680d68f"
        },
        "date": 1786935039658,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 217.91818884848573,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.363957712658001,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 118.84264789772521,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 103.09795720695647,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42144.28668497565,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 574.0117497037076,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 836.0443942371636,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2757534655,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ed45ec18928bf19b4add811c3f8a567211932073",
          "message": "Add README and crate metadata for retch-sysinfo (#198)\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:39:49-07:00",
          "tree_id": "13cd0a580de7afdb2209726aa2a026b4079579a6",
          "url": "https://github.com/l1a/retch/commit/ed45ec18928bf19b4add811c3f8a567211932073"
        },
        "date": 1786936239198,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 221.13252046273246,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.034258465882232,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 120.85547357287336,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.68228004138714,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41533.22517970421,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 565.3482077944825,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 841.4947201308341,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2208781890,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "f75989c777d19ce11a71c02c17a50e959cdb94cb",
          "message": "aur: bump to 0.8.0\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:47:18-07:00",
          "tree_id": "6e84e4f067d36b437236a783f86e1b1b04a441ca",
          "url": "https://github.com/l1a/retch/commit/f75989c777d19ce11a71c02c17a50e959cdb94cb"
        },
        "date": 1786936823657,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 217.08180099361925,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.401556345929449,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 129.3377731486873,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.15231759684977,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42350.66031297772,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 598.0674266309597,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 829.0251471238125,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2639676715,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e42fb854db13c202146dc739849f67429547ebf9",
          "message": "deps: bump dependencies (consolidate #199) (#200)\n\nConsolidate Dependabot PR #199:\n- clap_complete_nushell 4.6.1 -> 4.6.2\n- icy_sixel 0.5.0 -> 0.5.1\n- Cargo.lock transitive dependency updates\n- Bump retch-cli to 0.8.1 and regenerate man page\n\nAssisted-By: Gemini 3.7 Flash",
          "timestamp": "2026-08-21T15:33:39-07:00",
          "tree_id": "f4dea1009382aed406875e53dbf14115c540f5df",
          "url": "https://github.com/l1a/retch/commit/e42fb854db13c202146dc739849f67429547ebf9"
        },
        "date": 1787353573183,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 230.00024606354503,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.684159218231716,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 134.74924886429898,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 106.954993437654,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44576.1566311685,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 610.6022666797112,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 1007.0743441484635,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2022508270,
            "unit": "ns"
          }
        ]
      }
    ],
    "Windows Arm64 Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0e1c1784b9978fdff89b81f40496397a7becfb04",
          "message": "Bump crossbeam-epoch to clear RUSTSEC-2026-0204 (#140)\n\n* Bump crossbeam-epoch to clear RUSTSEC-2026-0204\n\ncargo audit flagged crossbeam-epoch 0.9.18 (RUSTSEC-2026-0204: invalid\npointer dereference in the fmt::Pointer impl for Atomic/Shared). Bump to\n0.9.20 (Cargo.lock only; transitive via rayon â†’ image/criterion). No\nmanifest or direct-dependency change.\n\nAssisted-By: Claude Opus 4.8\n\n* Add advisory cargo audit step to just pr gate\n\nThe pre-PR gate never ran cargo audit, so RUSTSEC-2026-0204 (crossbeam-\nepoch) only surfaced in CI. Add step 8 to `just pr`: install cargo-audit\nif missing, run it, print advisories. Advisory-only â€” it does not block\nthe gate, since advisories can be newly published against unchanged\ntransitive deps. Documented in AGENTS.md Â§4.0 and NOTES.md.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T09:25:18-07:00",
          "tree_id": "20c022c102ba6752d23ea9a6923616b6a5d9b58c",
          "url": "https://github.com/l1a/retch/commit/0e1c1784b9978fdff89b81f40496397a7becfb04"
        },
        "date": 1783703204218,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 100.11361183039378,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948768332302203,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.1877143868829,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.1693577732947,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46455.76098102511,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 490.4905071387492,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 735.5316248073551,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3273192640,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e0687d49ba4020e78a8b09d6320347f2757c5ffd",
          "message": "Consolidate field list into single registry (#139)\n\nReplace four hand-duplicated field-list copies (main.rs collection\nallow-lists + config template, display.rs display allow-lists,\nconfig.rs DEFAULT_FIELDS_BLOCK) with one FIELDS table in src/fields.rs.\nmain.rs and display.rs derive per-strata allow-lists from\nfields_for(mode); both config-generation paths emit the fields block\nfrom config_fields_block().\n\nFixes pre-existing doc drift the consolidation exposed (man page was\nmissing cpu-cache/cpu-usage/public-ip and spelled terminal_font;\nREADME missing gamepad/public-ip) and adds guardrail tests that fail\nCI if any registry key is undocumented or missing from generated\nconfig. Strata sets are byte-for-byte unchanged; pure internal refactor.\n\nResolves the field-wiring de-duplication tech debt (NOTES.md Â§5).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T09:45:06-07:00",
          "tree_id": "74f40f025e3cda412809c914329171c301a7e106",
          "url": "https://github.com/l1a/retch/commit/e0687d49ba4020e78a8b09d6320347f2757c5ffd"
        },
        "date": 1783704452914,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.04165655031275,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9490884598158487,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.72608696344467,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.34611778165927,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47931.36452670403,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.69479122415714,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 743.1214713965073,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3145339810,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7a3b029a318196f57111112492235841e6692d8c",
          "message": "Reword WIP resetâ†’update, rename wip script (#141)\n\nWIP.md is an ongoing rolling log, not reset per-PR. Align the docs and\ntooling with that: AGENTS.md Â§5 and the just merge-pr recipe now say\n\"update\" instead of \"reset\", and scripts/reset_wip.py is renamed to\nscripts/update_wip.py (git mv; behavior unchanged â€” it still only\nrewrites the Active-Branch and latest-commit lines).\n\nAlso folds in the NOTES.md Â§5 \"real hardware benchmark section\" backlog\nitem. Docs/tooling only; no Rust source touched.\n\nVersion bumped 0.3.40 â†’ 0.3.41 (patch); man page + Cargo.lock regenerated.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:14:33-07:00",
          "tree_id": "3985c178b81541f77e250902c4997776fb98a214",
          "url": "https://github.com/l1a/retch/commit/7a3b029a318196f57111112492235841e6692d8c"
        },
        "date": 1783735003995,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.70347930741579,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.95315213757736,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.15081229412414,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.24120758957929,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47177.19964344787,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 489.13547731668115,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 746.282863038297,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3438870640,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2",
          "message": "Fix update_wip.py stale-pointer regex + UTF-8 (#142)\n\nThe post-merge WIP updater matched an obsolete \"**Latest commit on\nmain**:\" line that no longer exists, so the substitution silently\nno-op'd and left \"**main HEAD**:\" stale after every `just merge-pr`\n(seen live after #141). Retarget the regex to \"**main HEAD**:\", rewrite\nin the current format (`<hash>` â€” <subject> â€” **v<version>**) with the\nversion read from Cargo.toml, using a function replacement so metachars\nin the subject are literal.\n\nSince the fix now writes the commit subject into WIP.md, and this repo's\nsubjects contain \"â†’\"/em-dashes, pin UTF-8 on read_text/write_text,\nsubprocess decoding, and stdout â€” otherwise cp1252 (the default Windows\nconsole/locale where merge-pr runs) crashes the script. Verified\nend-to-end against a subject containing \"â†’\".\n\nAlso gitignore __pycache__/*.pyc.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T18:31:45-07:00",
          "tree_id": "2db4346561186354ab7202a4b36fa637426c79f1",
          "url": "https://github.com/l1a/retch/commit/fa00d4325e62ef3a7ad84c9158c1328d53f6f6a2"
        },
        "date": 1783736062763,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.72955802351723,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9481925007740144,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.27047720742308,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.66464702906501,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47130.71565277877,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.51145260893543,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 737.1641732594002,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3824133795,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9f639d38da27f892e183f9fa1e0f77d57cdfdcad",
          "message": "update_wip.py: bound subs with count=1 (#143)\n\nFollow-up to #142. The retargeted `**main HEAD**:` regex had no count,\nso it rewrote every line containing the header string â€” and WIP.md's\nopen-task prose mentions it verbatim, so the #142 merge clobbered those\ntask lines. Pass count=1 to both re.sub calls (Active-Branch and\nmain-HEAD) so only the first top-of-file header occurrence is rewritten.\nVerified end-to-end against a sample with the header in both a header\nline and later prose.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:05:40-07:00",
          "tree_id": "e1d68a1f542a32e88f5f5adaece7b1b06c929de4",
          "url": "https://github.com/l1a/retch/commit/9f639d38da27f892e183f9fa1e0f77d57cdfdcad"
        },
        "date": 1783741760419,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.6537476952066,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9481985174265963,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.06982444111478,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.1400830110812,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47549.05004575632,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 484.7768267563958,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 745.0975214595522,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 4040054815,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab",
          "message": "Drop PowerShell spawn in Windows net detection (#144)\n\ndetect_active_interface_and_local_ip shelled out to PowerShell\n(Get-NetRoute) on Windows to name the default-route interface. That\nspawn costs ~977ms (PowerShell startup) and, since the `net` field is in\nevery mode, dominated runtime — `retch --short` was ~1.15s, ~11x over\nits <100ms target and ~20x slower than fastfetch.\n\nDerive the active interface instead from the adapter whose\nsysinfo-reported IPs include the outbound local_ip (already resolved via\nthe UDP-connect trick) — no spawn, no new dependency, no FFI. Extracted\na pure match_active_interface helper with a unit test. Resolves to the\nsame interface as before (verified on Windows).\n\nMeasured (AMD Ryzen AI MAX+ 395, Win 11): --short 1149ms -> 163ms (~7x).\nretch-sysinfo bumped 0.1.33 -> 0.1.34 (library behavior change).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T20:42:31-07:00",
          "tree_id": "e39a81d2e6892fa08bbcacc34138d13dd5af8989",
          "url": "https://github.com/l1a/retch/commit/cc5b997b1ce8d887d19a0813bd26c4a8e52b35ab"
        },
        "date": 1783743917700,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.7723051192331,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9476182873873915,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.49677789566654,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.14246442855031,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47555.03642090521,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.7769606962934,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 731.0691360289424,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3500714375,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "18f0bfa4e337d9a815662b1383dab85187e1ac5c",
          "message": "Fix bench-cli/bench-compare on Windows (#145)\n\nThe bench recipes passed a POSIX-style './target/release/retch' to\nhyperfine. With no --shell, hyperfine uses cmd.exe on Windows, which\ncan't execute that path (forward slashes, no .exe), so it exited 1 in\nthe first warmup run and aborted the recipe. retch itself was fine and\n`just bench` (criterion) was unaffected.\n\nAdd an os_family()-selected `retch_release_bin` variable\n('target\\release\\retch.exe' on Windows, './target/release/retch'\nelsewhere) and route all bench hyperfine calls through it. Verified both\nrecipes now run to completion on Windows.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T21:26:47-07:00",
          "tree_id": "b2195da8db613809ef3a732f524156e3dd175501",
          "url": "https://github.com/l1a/retch/commit/18f0bfa4e337d9a815662b1383dab85187e1ac5c"
        },
        "date": 1783746473171,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.86589887065495,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9496454243264845,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.29160849219647,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.75169600215932,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46135.02271505704,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 514.2443750937886,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 748.4278178997138,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3373918315,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c57409d318756bf9bf92ee798f438e2c2e4747fd",
          "message": "Use native Win32 IOCTLs for Windows phys-disk (#146)\n\nReplace the Get-PhysicalDisk PowerShell spawn (~1.7s of interpreter\nstartup) in retch-sysinfo's Windows physical-disk detection with direct\nstorage IOCTLs over \\.\\PhysicalDriveN, via hand-written extern \"system\"\nFFI matching the crate's existing style (win_reg.rs) — no new dependency.\n\nEach drive is opened with zero desired access and only FILE_ANY_ACCESS\nquery IOCTLs are used (IOCTL_STORAGE_QUERY_PROPERTY for model/bus type +\nseek penalty, IOCTL_DISK_GET_DRIVE_GEOMETRY_EX for size), so no elevation\nis required. Classification and label format are unchanged; the model\nstring reproduces Get-PhysicalDisk's FriendlyName. Verified byte-identical\noutput; --fields phys-disk ~1684ms -> ~210ms on an AMD Ryzen AI MAX+ 395.\n\nAlso fix a gate/CI blind spot found while verifying this: a bare\n`cargo test`/`cargo clippy` at the workspace root only covers retch-cli\nand silently skips the retch-sysinfo member (where this change lives).\nThe just recipes (test/lint/check + the pr steps) and both rust.yml CI\njobs now pass --workspace; AGENTS.md 4.0/4.1 document why.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T12:51:19-07:00",
          "tree_id": "02202ebbc2cd99020a9d56bc36db81f79b1aa906",
          "url": "https://github.com/l1a/retch/commit/c57409d318756bf9bf92ee798f438e2c2e4747fd"
        },
        "date": 1783801808218,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.49100225569961,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947520228201557,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.61518034859174,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.53550878241302,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46806.514091565055,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.9232226111006,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 751.5837166395864,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3133746585,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e7427ff1a1011473cda36ef463893d8a10dea342",
          "message": "Read SMBIOS natively for Windows phys-mem (#147)\n\n* Read SMBIOS natively for Windows phys-mem\n\nReplace the two Get-CimInstance Win32_PhysicalMemory / Win32_ComputerSystem\nPowerShell spawns (~600 ms) with GetSystemFirmwareTable('RSMB') (kernel32),\nparsing SMBIOS type-17 (Memory Device) structures directly, plus\nGlobalMemoryStatusEx as the VM total-memory fallback. Hand-written\nextern \"system\" FFI matching win_reg.rs — no new dependency.\n\nA pure parse_smbios_type17 fn does a bounds-checked walk of the structure\ntable (formatted area + double-null-terminated string set) and carries the\nunit tests. Now also surfaces the SMBIOS Configured Memory Speed field\n(offset 0x20), so Windows shows running-vs-rated speed when they differ\n(e.g. \"8x 16 GB LPDDR5 8000 MT/s (rated 8533 MT/s)\"), matching Linux; the\nold WMI path only reported the rated speed.\n\n--fields phys-mem ~597ms -> ~152ms on an AMD Ryzen AI MAX+ 395; output\nverified against Get-CimInstance Win32_PhysicalMemory.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix clippy byte-str lint on RSMB signature\n\nRust 1.97's clippy flags `[b'R', b'S', b'M', b'B']` (can be a byte str).\nUse `*b\"RSMB\"` instead. Local toolchain was 1.96 so `just check` passed\nlocally but CI (1.97) failed clippy; bumped local toolchain to match.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T13:32:19-07:00",
          "tree_id": "dde402b0cc3e8c191c71996d19858d5d403cf3b0",
          "url": "https://github.com/l1a/retch/commit/e7427ff1a1011473cda36ef463893d8a10dea342"
        },
        "date": 1783804423220,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.95684146741111,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9477903983026663,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.24185649510773,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.40682505787004,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46796.65661217397,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 484.8263244426347,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 733.0641628331191,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2065350490,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36888f89870197b2e040c9178970859ffc467c42",
          "message": "Detect Windows bluetooth natively (bthprops) (#148)\n\nReplace the PowerShell spawn (Get-Service bthserv + two Get-PnpDevice\n-Class Bluetooth queries, ~1.8s) with native Win32:\n- power state from the bthserv service via the Service Control Manager\n  (advapi32),\n- adapter hardware name via SetupAPI enumeration of the Bluetooth device\n  class (links setupapi),\n- connected devices via the classic bthprops API (BluetoothFindFirstDevice\n  with fReturnConnected; links bthprops).\n\nHand-written extern \"system\" FFI, no WinRT and no binding crate. The\ndevice-info struct layout was validated at runtime before trusting the\ncount. A pure format_windows_bluetooth fn carries the unit tests.\n\nBehavior change: \"N connected\" now counts actually-connected devices\nrather than the old count of all paired/present Bluetooth PnP nodes (which\nthe old code mislabeled as connected). Adapter name unchanged. On an AMD\nRyzen AI MAX+ 395: --fields bluetooth ~1765ms -> ~150ms; --long 3462 ->\n2934ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:06:28-07:00",
          "tree_id": "ad23df51a0dfa2097d5eeb928be7307ad5c07e92",
          "url": "https://github.com/l1a/retch/commit/36888f89870197b2e040c9178970859ffc467c42"
        },
        "date": 1783813545731,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.31174570654214,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9473693345996703,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.0443550986301,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.07026059092338,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46173.11146935883,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 490.03140969242384,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 752.1465516990029,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2208695675,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dfa18d3ba7b91698f61b34f76aaf85b3bd479271",
          "message": "Drop serial CPU-usage sleep on Windows (#149)\n\nCPU usage needs a delta between two samples. sysinfo enforces a ~200ms\nminimum interval, so collect() slept 200ms then refreshed — and that\nsleep ran serially AFTER the concurrent probe scope, adding ~200ms to\nevery standard/long run.\n\nOn Windows, sample GetSystemTimes (kernel32) just before the scope and\ndiff against a fresh sample at the usage-computation point: the existing\ncollection window is the delta, so no dedicated sleep is added. A ~100ms\nfloor is topped up only when the window is shorter (e.g. an isolated\n`--fields cpu-usage`) so a tiny request reads a real value instead of\nGetSystemTimes quantization noise. A pure usage_percent helper carries\nunit tests. Linux/macOS keep the sysinfo+sleep path (its min interval\nmakes the window-diff unreliable there).\n\nOn an AMD Ryzen AI MAX+ 395: standard mode 1757ms -> 1558ms; isolated\n--fields cpu-usage ~340ms -> ~253ms.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T16:26:38-07:00",
          "tree_id": "ff94a5086c547509df94d6fc37722dd5e6667f45",
          "url": "https://github.com/l1a/retch/commit/dfa18d3ba7b91698f61b34f76aaf85b3bd479271"
        },
        "date": 1783814806987,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.09161987688272,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9478407863898504,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.15081798768998,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.82349045059902,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47800.77031613224,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 494.0424123571691,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 733.0747982443331,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1941453165,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cae94eb0c09e6b2f4675d84cbd239d3ed13b6926",
          "message": "Detect Windows camera natively (SetupAPI) (#150)\n\nReplace the camera PowerShell spawn (Get-PnpDevice -Class Camera,Image\n-PresentOnly, ~1.36s) with a new shared win_setupapi module that enumerates\npresent devices in a setup class via SetupDiGetClassDevsW +\nSetupDiGetDeviceRegistryPropertyW (links setupapi) — the native equivalent\nof Get-PnpDevice -PresentOnly. Camera enumerates the Camera and Image\nclasses and reuses the existing is_real_camera / clean_camera_name / dedup\nlogic. bluetooth (which introduced a private SetupAPI copy) is refactored\nonto the shared module, removing the duplication (mirrors win_reg.rs).\n\nHand-written extern \"system\" FFI, no binding crate. Verified against\nGet-PnpDevice (all real cameras; IR camera filtered as before); bluetooth\nadapter name unchanged after the refactor.\n\nCamera was the last standard-mode PowerShell pole, so this completes the\nWindows native-FFI migration: on an AMD Ryzen AI MAX+ 395, --fields camera\n~1359ms -> ~155ms and standard mode 1558ms -> 273ms. retch now beats\nfastfetch in standard mode (273 vs 1348ms) and is at parity in --long.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:26:15-07:00",
          "tree_id": "dc9eca701a17186aff929c1b979a8956c13aed61",
          "url": "https://github.com/l1a/retch/commit/cae94eb0c09e6b2f4675d84cbd239d3ed13b6926"
        },
        "date": 1783836374780,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.3116471776857,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949782793520194,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.59932393903284,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.70064506635231,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47387.24341636711,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.50800317258125,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 762.9992193315405,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2950290270,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ae3ecffd014bc206189c58e5b613f8ff4e0b66d",
          "message": "Add FFI struct-layout assertion tests (#151)\n\nFollowing the Windows native-FFI migration (#146-#150), the pure parsers\nare well unit-tested but the #[repr(C)] FFI structs the OS reads/writes by\noffset were only runtime-verified. Add size_of + targeted offset_of!\nassertions for each: disk (StoragePropertyQuery, StorageDeviceDescriptor\nincl. bus_type/vendor/product offsets, DeviceSeekPenaltyDescriptor,\nDiskGeometryEx incl. disk_size), memory (MemoryStatusEx), bluetooth\n(ServiceStatus, DeviceSearchParams, SystemTime, DeviceInfo incl.\nf_connected/sz_name), fetch (win_cpu::FileTime), win_setupapi\n(SpDevinfoData, already present).\n\nThese catch accidental field-reorder/padding regressions at test time —\nthe failure mode the parse tests can't (the phys-mem 0x14->0x15 offset bug\nin #147 was found only by runtime comparison). Test-only, no runtime\nchange; runs on Windows CI since the structs are cfg(windows).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-11T22:52:26-07:00",
          "tree_id": "1d42a683cfb643a99870fca57f865d9e88b409e0",
          "url": "https://github.com/l1a/retch/commit/2ae3ecffd014bc206189c58e5b613f8ff4e0b66d"
        },
        "date": 1783837882397,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.5862578964354,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9474590514105454,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.9056749878004,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.79182354006542,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45091.03338511706,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 492.97162020549194,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 761.6566655257468,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2193316175,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "744c0dcd3c15ea67803948e0372c5229715b4783",
          "message": "Fix upload_local_bench.py cp1252 crash on Windows (#152)\n\njust bench-upload and the post-merge hook crashed on Windows with\nUnicodeDecodeError: 'charmap' codec can't decode byte 0x9d — so no local\nWindows \"real hardware\" numbers reached the gh-pages benchmark dashboard.\nThe gh-pages data.js is UTF-8 (commit messages embed arrow/em-dash chars)\nbut open() used the default cp1252 encoding on Windows.\n\nPin encoding=\"utf-8\" on every file operation (data.js read + write, the\nhyperfine JSON temp read) and on run_capture's subprocess text decoding\n(git log --format=%B), plus a sys.stdout.reconfigure UTF-8 guard. Same fix\nclass as scripts/update_wip.py (#142).\n\nVerified: the crash reproduces on the live data.js under the default\nencoding; the UTF-8 read succeeds (845 KB) and append_entry /\ngit_commit_info run without error.\n\nTooling-only; no Rust source touched, retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:01:43-07:00",
          "tree_id": "d579527f5693db2e5215b8c7e6ddfa52671a60fd",
          "url": "https://github.com/l1a/retch/commit/744c0dcd3c15ea67803948e0372c5229715b4783"
        },
        "date": 1783867378898,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.76193531562221,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9478545143168504,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.07665434022326,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.94339342589039,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46677.358387005144,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.4677709895881,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 740.9010498272562,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2603184120,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6c384b96645a8d096e3c0f7a55be58958363939a",
          "message": "Bump version to 0.4.0 (milestone release) (#153)\n\nMinor version bump (0.3.52 -> 0.4.0) marking the completed Windows\nnative-FFI migration and the first GitHub Release since v0.3.40 (rolls up\n#141-#152). Version-marker only — no code change; retch-sysinfo stays at\n0.1.40 and crates.io remains intentionally held.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T07:46:27-07:00",
          "tree_id": "53e438ffe42566998097d0bc24ec6bd506b380bf",
          "url": "https://github.com/l1a/retch/commit/6c384b96645a8d096e3c0f7a55be58958363939a"
        },
        "date": 1783869984721,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.6220702679423,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9481307727363237,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.10218079257137,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.52123737740638,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46397.18870486294,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.00006020741137,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 749.2982756060737,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2692310795,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88162b293638dfad573a4b63f046cd27aca023f4",
          "message": "Bump to 0.4.1; fix license SPDX for crates.io (#154)\n\nCorrect the deprecated `license = \"GPL-3.0\"` to `GPL-3.0-or-later` in both\ncrate manifests (matching the SPDX-License-Identifier headers in the\nsource) ahead of publishing to crates.io, where per-version license\nmetadata is permanent.\n\nBump retch-cli 0.4.0 -> 0.4.1 and retch-sysinfo 0.1.40 -> 0.1.41 (v0.4.0\nis already tagged, so the license fix requires a new version). No\nfunctional code change. This is the version published to crates.io,\nreversing the prior GitHub-Release-only hold.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T08:27:56-07:00",
          "tree_id": "20fc220a727f5d7f59bb468da3002cf8631afc81",
          "url": "https://github.com/l1a/retch/commit/88162b293638dfad573a4b63f046cd27aca023f4"
        },
        "date": 1783872524048,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.62267287024811,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949384279736089,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.04739368138932,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.86318662333414,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46129.94409980936,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.4322917746334,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 753.734578601855,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2397747900,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84a7d7c354231007c97f94f25b262266bb64e146",
          "message": "Fix machine-dependent format_cpu_cores tests (#155)\n\n`format_cpu_cores` reads the host's real CPU topology (Linux /sys cpufreq,\nmacOS hw.perflevel*) and returns a \"NP + ME / KT\" hybrid string on Intel P/E\nand Apple Silicon machines, ignoring its passed-in (logical, physical) counts.\nThe four fallback unit tests called it with fixed args, so they passed on\nnon-hybrid CPUs/CI runners but failed on a hybrid host — an i7-1360P produced\n\"8P + 8E / 16T\" for (16, Some(8)) where the test expected \"8C / 16T\", hard-\nfailing `just pr` there.\n\nExtract the pure fallback into `format_cpu_cores_plain` and retarget the four\ntests at it, so they no longer depend on the runner's hardware. Public\nbehavior of `format_cpu_cores` is unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:41:15-07:00",
          "tree_id": "26f59d72e69fb5f71508fb9427bd765258b160f2",
          "url": "https://github.com/l1a/retch/commit/84a7d7c354231007c97f94f25b262266bb64e146"
        },
        "date": 1783909318096,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.80381141995367,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947701739245224,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.28237431663847,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.78208980502248,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47071.20008356332,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 494.59946993906567,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 755.6456807637077,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1928506500,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be732f18be8ed35c252a364cc1241d542d0962ef",
          "message": "Enforce LF line endings via .gitattributes (#156)\n\nThe working tree is shared across Linux/macOS/Windows via Syncthing. With no\n.gitattributes and core.autocrlf=false, a Windows checkout wrote CRLF, Syncthing\npropagated those bytes to the Linux clones, and git reported the entire tree as\nmodified — a phantom 13811+/13811- whole-tree diff with zero content changes\n(git diff --ignore-all-space empty). This blocked the just-pr clean-tree checks.\n\nAdd `* text=auto eol=lf` to force LF on checkout on every OS (essential for a\nbyte-identical Syncthing-shared tree) and `*.png binary` to protect the logo\nassets. HEAD was already stored as LF, so no tracked content changes.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T18:59:28-07:00",
          "tree_id": "09a0473cae06eab0155f9d17e371c9dc4271dea9",
          "url": "https://github.com/l1a/retch/commit/be732f18be8ed35c252a364cc1241d542d0962ef"
        },
        "date": 1783910463365,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.09708538630926,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9478684628068628,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 107.45622345957683,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.69336495732352,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48012.672800042834,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 503.69055683121906,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 761.7528181153327,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2419477820,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "280db85bc07aaa37fe6e22c1428c57d3a95ba55b",
          "message": "Add Linux login-manager/brightness/power-adapter (#157)\n\nThree new --long fields closing NOTES §6 fastfetch gaps, each a cheap\nsingle-source Linux probe in the sequential detect_* style (like init/chassis):\n\n- login-manager: resolves the display-manager.service systemd unit symlink\n  (GDM/SDDM/LightDM/greetd/…), prettified.\n- brightness: reads /sys/class/backlight/*/{brightness,max_brightness} as a %.\n- power-adapter: reads the Mains supply under /sys/class/power_supply (name +\n  connected state; wattage omitted — sysfs Mains rarely exposes it).\n\nAll three are Linux-only (None elsewhere). Each detector wraps a pure helper\n(login_manager_from_unit / brightness_percent / format_power_adapter), split\nout and unit-tested host-independently per the v0.4.2 format_cpu_cores lesson;\nhelpers + tests are cfg(linux) so they aren't dead code under clippy -D warnings\non other platforms. Verified live on corrino (greetd, 51%, AC (connected)).\n\nretch-cli 0.4.3 -> 0.5.0, retch-sysinfo 0.1.42 -> 0.1.43.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-12T20:11:45-07:00",
          "tree_id": "c4f4b86a753026bf48a3009deb1ece1f46ea99bc",
          "url": "https://github.com/l1a/retch/commit/280db85bc07aaa37fe6e22c1428c57d3a95ba55b"
        },
        "date": 1783914733275,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.18062921261183,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9477502961633926,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.14781784137934,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.43481127396957,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46881.74308551313,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 496.6098381030747,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 742.8951286051954,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2351829810,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c4f762eed77a36ac3d95a1beb6a4cab62afb2965",
          "message": "Add Windows domain and terminal-size fields (#159)\n\nTwo --long fields that previously returned None on Windows now have\nnative arms — the first of the Windows cross-platform-parity feature\nseries (distinct from the completed PowerShell->FFI perf migration).\n\n- domain: primary DNS suffix via GetComputerNameExW(ComputerNameDnsDomain)\n  (kernel32, two-call size probe). A workgroup host's empty suffix maps to\n  None via the pure clean_domain helper — not the NetBIOS WORKGROUP name —\n  matching the Linux/macOS /etc/resolv.conf DNS-domain semantics.\n- terminal-size: console viewport via GetStdHandle + GetConsoleScreenBufferInfo,\n  using the srWindow rect (not dwSize, the scrollback buffer). Pure\n  window_rect_to_size helper does the inclusive-rect -> \"COLSxROWS\" math;\n  piped output has no console -> graceful None -> existing env fallback.\n\nHand-written extern \"system\" FFI, no binding crate (house style); // SAFETY:\non every unsafe. Non-Windows arms untouched. New tests: clean_domain,\nwindow_rect_to_size, and a CONSOLE_SCREEN_BUFFER_INFO size_of layout guard.\nVerified live on arrakis (Windows 11): domain correctly absent (DNS suffix\ngenuinely empty), terminal-size renders 100x40.\n\nretch-cli 0.5.1 -> 0.6.0, retch-sysinfo 0.1.43 -> 0.1.44.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:13:18-07:00",
          "tree_id": "89121134b1cdf90e97f3ba23b740bd744dbf5193",
          "url": "https://github.com/l1a/retch/commit/c4f762eed77a36ac3d95a1beb6a4cab62afb2965"
        },
        "date": 1783979681012,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.60849946766382,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948137282330988,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.65134591236149,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.63624301645739,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45625.22585755799,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 490.1246627065525,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 747.2225988964921,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2163348725,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30195b0eaaf4f96b4b6fe43c11001046a871537b",
          "message": "Fix Windows Camera (scanners) and Users (=0) bugs (#160)\n\nTwo user-reported Windows output bugs in the cross-platform-parity series.\n\nCamera listed scanners as cameras (e.g. \"EPSON ET-3850 Series\"). The Windows\npath enumerated the Camera + Image (WIA) setup classes, but scanners/printers\nshare the Image class with some real webcams (a Logitech BRIO is Image-class),\nand is_real_camera has no keyword to catch an EPSON model string. Fixed by\nenumerating the KSCATEGORY_VIDEO_CAMERA device-interface class instead — only\nreal cameras register it, so scanners are excluded while Image-class webcams are\nkept. Added win_setupapi::present_interface_device_names (DIGCF_DEVICEINTERFACE,\nsharing the existing enumerate_names core) + the KSCATEGORY_VIDEO_CAMERA GUID;\nremoved the now-unused GUID_DEVCLASS_CAMERA/_IMAGE. Also drops the synthetic\n\"Windows Virtual Camera Device\" via a Windows-only is_windows_virtual_camera\nhelper (Linux/macOS untouched).\n\nUsers showed 0 with a user logged in: sysinfo keys Windows users by SID, so the\nUnix uid>=1000 filter never matched. New win_users module counts active\ninteractive sessions via WTSEnumerateSessionsW + WTSQuerySessionInformationW\n(wtsapi32; query-user semantics), with a pure unit-tested count helper. Per the\n\"if it doesn't work, don't show it\" request, display.rs now suppresses Users\nwhen the count is 0 (mirrors the packages guard).\n\nNon-Windows camera/users behavior unchanged. FFI house style (hand-written\nextern \"system\", // SAFETY:, WTS_SESSION_INFOW size_of guard). Verified live on\narrakis: Camera = Logitech BRIO + ASUS FHD webcam only; Users: 1.\n\nretch-cli 0.6.0 -> 0.6.1, retch-sysinfo 0.1.44 -> 0.1.45. Patch (bugfixes).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-13T14:46:19-07:00",
          "tree_id": "13dc79f2b8c9dd3041dc8f5dfc070fb42bba266a",
          "url": "https://github.com/l1a/retch/commit/30195b0eaaf4f96b4b6fe43c11001046a871537b"
        },
        "date": 1783981601848,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.13722831750647,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947521180222803,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.3555970330946,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.79668307188942,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45881.713331547624,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 491.42894449802736,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 743.4321431771018,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2573082490,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2b4a083ed6b7696bd56727cbcc285ed5ac45030f",
          "message": "Unblock just pr on Linux: tests + man regen (#165)\n\nTwo coupled docs/test-hygiene fixes (no runtime behavior change), bundled\nbecause the first is what lets `just pr` pass on the reinstalled Fedora box.\n\n1. Machine-independent xrandr display tests. parse_xrandr_displays called\n   get_monitor_name_for_port (live /sys/class/drm EDID) inline, so the\n   fixture tests substituted the physically-attached monitor for the\n   fixture's connector name (DP-1 -> the panel's EDID model ATNA33AA08-0).\n   These tests are cfg(not(macos/windows)) and never ran on the old Windows\n   arrakis, so the defect was latent until the first cargo test after the\n   Fedora reinstall. Same class as #155. Extract a pure\n   parse_xrandr_displays_with(stdout, resolve); the public wrapper passes\n   get_monitor_name_for_port (production unchanged) and the tests pass\n   |_| None. Add a regression test asserting the resolver is honored.\n\n2. Regenerate docs/retch.1. The committed page carried double-bold groff\n   runs from the Windows #160 `just man` run, where the recipe's\n   sed 's/\\fB\\fB/\\fB/g' strip did not take effect. Linux regeneration\n   produces the intended single-bold output, matching the recipe's intent.\n\nPatch bump: retch-cli 0.6.2, retch-sysinfo 0.1.46 (new pub\nparse_xrandr_displays_with).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:10:26-07:00",
          "tree_id": "545ecee36947f96e29585e4dcc803424559d5b6b",
          "url": "https://github.com/l1a/retch/commit/2b4a083ed6b7696bd56727cbcc285ed5ac45030f"
        },
        "date": 1784908263694,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.48218500684997,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94733909784003,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.32634693579624,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.59246117887184,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46557.00100567789,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.7468268798646,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 728.4509923388956,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1947541185,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9cbad3234c6ec06f444e623a84b3ff72efbcd50",
          "message": "Bump deps + CI actions (Dependabot #161/163/164) (#167)\n\nConsolidate three open Dependabot PRs into one gated PR so the release-hygiene\nsteps they bypass (retch version bump, NOTES/man regen) are performed. No\nruntime behavior change.\n\n- Rust deps (#164, cargo-dependencies group, all patch-level, lockfile-only\n  since the Cargo.toml specs are caret ranges): clap 4.6.1->4.6.4 (pulls syn v3\n  via clap_builder/clap_derive), serde 1.0.228->1.0.229, toml 1.1.2->1.1.3,\n  clap_complete_nushell 4.6.0->4.6.1, anyhow 1.0.103->1.0.104,\n  libc 0.2.186->0.2.189, sysinfo 0.39.5->0.39.6, serde_json 1.0.150->1.0.151.\n- actions/checkout 7.0.0->7.0.1 (#163) across benchmark/claude/\n  claude-code-review/packaging/rust/security (both SHA-pinned and @v7 uses).\n- softprops/action-gh-release 3.0.1->3.0.2 (#161) in the rust.yml release job.\n\nretch-cli -> 0.6.3; retch-sysinfo unchanged (0.1.46, no source change).\nWorkspace fmt/clippy/test all green.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-24T08:51:12-07:00",
          "tree_id": "0627e675b46ff2705a23fb6064df75bf587aac13",
          "url": "https://github.com/l1a/retch/commit/a9cbad3234c6ec06f444e623a84b3ff72efbcd50"
        },
        "date": 1784910782587,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.2384483431831,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9480980790364066,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.10453118460836,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.66661207282868,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46974.30415556398,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 491.6363409003058,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.5692882966953,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1703847100,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c0cf9c9583413e1b1d346274f3367162daef52e",
          "message": "Bump base64 0.22 -> 0.23 (Dependabot #166) (#169)\n\nThe one genuinely-new bump from Dependabot #166 (the other 8 crates in that\ngroup already landed in #167/v0.6.3). A semver-breaking 0.x bump, held out of\nthe v0.6.3 consolidation pending an API check. No runtime behavior change.\n\nbase64 is used only under the optional `graphics` feature (src/logo.rs, two\ngeneral_purpose::STANDARD.encode() sites for the Kitty/iTerm2 inline-image\nprotocol). The Engine encode API is unchanged in 0.23: build + clippy\n-D warnings are clean *with --features graphics* (the default gate does not\ncompile base64), and tests pass with and without the feature. `cargo bench`\nis unchanged (base64 is not on any benchmarked path). Widened the Cargo.toml\nspec \"0.22\" -> \"0.23\" since the caret range wouldn't admit 0.23.\n\nretch-cli -> 0.6.4; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T08:22:25-07:00",
          "tree_id": "5c659664226725eb40ca8c915bafbcf13fe02f12",
          "url": "https://github.com/l1a/retch/commit/7c0cf9c9583413e1b1d346274f3367162daef52e"
        },
        "date": 1784995441773,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.1622205392684,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9475700853715936,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.54996741267173,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.80860666412221,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45228.10084670432,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 492.99451156255884,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 744.6044385813076,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2791616910,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "586012cefc4c98dfa9ab5b227b0832620797265c",
          "message": "Lint graphics feature in just check (v0.6.5) (#170)\n\nAdd `cargo clippy --features graphics -- -D warnings` to the `check` recipe\n(and therefore the `just pr` gate). The base64 0.22->0.23 bump surfaced that\nbase64/image/icy_sixel and their src/logo.rs call sites live behind the\noptional `graphics` feature, which the default `cargo clippy --workspace`\nnever compiles -- so a graphics-only lint or API break could pass the gate\nunseen. Targets retch-cli (which defines the feature), not --workspace.\n\nTooling only, no runtime change. Closes the LOCAL gate gap; CI still builds\ndefault features, so a CI graphics job would be a separate follow-up.\nretch-cli -> 0.6.5; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:33:31-07:00",
          "tree_id": "f944cee1876f95b5314bfca44f0ba40a154033bb",
          "url": "https://github.com/l1a/retch/commit/586012cefc4c98dfa9ab5b227b0832620797265c"
        },
        "date": 1784999812985,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.2430906364485,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948731843081087,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.89102171284085,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.79874451310798,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44098.729739373775,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 496.4867555889753,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.1850864544547,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2610007240,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da6c74f858f9d84a8b3b076473c1026f04aef412",
          "message": "Show ASCII logo without a TTY; fix CI dry-run (v0.6.6) (#171)\n\ndisplay.rs gated the logo purely on stdout_is_tty, so `retch --ascii-logo`\nrendered no logo when piped/redirected -- including CI's full-test \"Run\nfetcher (dry run)\" step, which showed no logo.\n\nExtract a pure `should_show_logo(config_show_logo, no_logo, ascii_logo,\nstdout_is_tty)` helper: `--no-logo` always wins; `--ascii-logo` now forces the\nlogo on regardless of TTY or config (ASCII is plain, pipe-safe text, mirroring\nhow --no-logo is always honored); auto mode is unchanged (default-on,\nTTY-gated). --chafa-logo/graphical modes are deliberately not forced (they emit\nterminal-only control sequences).\n\nUpdate the CI full-test dry-run to `cargo run --release -- --full --ascii-logo`\nso it exercises every field AND the ASCII-logo path. 4 new unit tests on the\nhelper; verified live that piped `--full --ascii-logo` shows the logo while\npiped `--full` alone still shows none.\n\nretch-cli -> 0.6.6; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T09:48:23-07:00",
          "tree_id": "88dc56bcc4160f88dae2e60506f62a93c2ca7ea4",
          "url": "https://github.com/l1a/retch/commit/da6c74f858f9d84a8b3b076473c1026f04aef412"
        },
        "date": 1785000560761,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.21264455900527,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9476539675219144,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.65632664867357,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.95028678829861,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45098.658860261305,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 494.00467863660015,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 737.7903304680186,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2654876025,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ada1356ee93539a36a2c996eaa23e24c481463a3",
          "message": "Add CI graphics-feature job (v0.6.7) (#172)\n\nThe default `build` matrix never compiles the optional `graphics` feature\n(base64/image/icy_sixel + the src/logo.rs inline-image paths), so a\ngraphics-only lint or API break could pass CI unseen -- as the base64\n0.22->0.23 bump nearly did. v0.6.5 closed this in the local `just check` gate;\nthis closes it in CI.\n\nAdd a dedicated `graphics-feature` job to rust.yml (one ubuntu runner, same\nnon-tag triggers as `build`) running:\n  cargo clippy --features graphics -- -D warnings\n  cargo build  --features graphics --verbose\n\nCI only, no runtime change. retch-cli -> 0.6.7; retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T10:40:12-07:00",
          "tree_id": "ee5c8fdd3c4060bb2ec7f42369695582a0637e23",
          "url": "https://github.com/l1a/retch/commit/ada1356ee93539a36a2c996eaa23e24c481463a3"
        },
        "date": 1785003611702,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 100.91297895977365,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9489816880984163,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.97571351197924,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.7093217325135,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46402.116832436164,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 492.14224721131166,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 739.3037858102687,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2340924195,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa886633f69e0ee0a7db86ea7dc9773ceec03be9",
          "message": "Keep logo beside text in --long/--full (v0.6.8) (#173)\n\n* Keep logo beside text in --long/--full (v0.6.8)\n\nThe side-by-side vs. stacked layout decision (and the text-column width) was\ncomputed from the widest of ALL info lines. In --long/--full a single very long\nline -- a 150+ char Wi-Fi line, or the Net/Battery lines -- inflated the text\ncolumn past the terminal width and forced the logo to stack ABOVE the text,\neven though those long lines sit well BELOW the logo.\n\nExtract a pure `plan_layout(info_widths, logo_height, logo_width, term_width,\nshow_logo)` that considers only the info lines that actually sit BESIDE the\nlogo (the first `logo_height` rows). Long lines below the logo render at column\n0 with the full terminal width and no longer affect placement.\n\nLogo-type-agnostic: logo_height/logo_width come from the active logo, so it\nworks identically for ASCII, Chafa (both rendered as text `Lines`) and the\ngraphical image protocols (Kitty/iTerm2/Sixel -- height_lines + fixed image\ncolumn).\n\nVerified in a pseudo-terminal: --full renders the logo beside the text at\n140 cols (previously stacked) and correctly stacks at 90 cols. 7 new\nplan_layout unit tests. retch-cli -> 0.6.8; retch-sysinfo unchanged (0.1.46).\n\nAssisted-By: Claude Opus 4.8\n\n* CI: build-job dry run uses --full --ascii-logo too\n\nThe `build` job's \"Run fetcher (dry run)\" step still ran `cargo run -- --long`\n(no logo). Make it `cargo run -- --full --ascii-logo`, matching the full-test\ndry run, so every CI dry run exercises all fields and the logo/layout path.\n\nAssisted-By: Claude Opus 4.8\n\n* Split Wi-Fi into two lines; grayscale Apple logo\n\nTwo display tweaks requested on top of the layout fix (same PR):\n\n- Wi-Fi: the iw path builds a single \"{adapter} [{iface}] - {SSID} (band/rate)\"\n  string that ran 150+ chars and wrapped into the logo. Split on the \" - \"\n  boundary via a pure `split_wifi_line` into a `Wi-Fi` line (adapter hardware)\n  and a `Wi-Fi Link` line (live connection). Fallback detectors have no \" - \"\n  and stay one line. `Wi-Fi Link` is aliased to the `wifi` field key in\n  should_show (like dns/memory). 3 unit tests.\n\n- macOS/Apple ASCII logo: replace the legacy rainbow colour bands\n  (green/yellow/red/magenta/blue) with a 256-colour grey (silver) ramp,\n  matching the modern monochrome Apple logo. Graphical macos.png untouched.\n\nretch-cli stays 0.6.8 (same PR); retch-sysinfo unchanged.\n\nAssisted-By: Claude Opus 4.8\n\n* Fix graphical logo landing mid-text in --long/--full\n\nThe side-by-side path for image protocols (Kitty/iTerm2/Sixel) printed ALL the\ninfo lines first, then did `\\x1b[{n}A` to move back up and draw the image to the\nright of the top rows. For tall output (--long/--full) the info block is taller\nthan the viewport, so by the time the text finished the screen had scrolled and\nthe cursor-up was clamped at the top of the viewport -- the image was drawn in\nthe MIDDLE of the text, overlapping it (reported on kitty).\n\nDraw the image FIRST instead: move to the top of the logo column, bracket the\nimage draw with save/restore (\\x1b7/\\x1b8) so it lands at the correct row before\nany text is printed or the screen scrolls, then print the info lines\ntop-to-bottom at column 0. The terminal scrolls naturally and carries the\ncell-anchored image with it. Shared `render_graphical_side_by_side` helper for\nall three protocols. Verified the escape choreography (right/save/image/restore/\nCR/text) at the byte level in a kitty pty.\n\nretch-cli stays 0.6.8 (same PR).\n\nAssisted-By: Claude Opus 4.8\n\n* docs(NOTES): record graphical logo placement fix (v0.6.8)\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-25T17:31:49-07:00",
          "tree_id": "9b82d07a4ddf3e53b29bc8579d9a7acdcf12908e",
          "url": "https://github.com/l1a/retch/commit/fa886633f69e0ee0a7db86ea7dc9773ceec03be9"
        },
        "date": 1785028298087,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.9189948556677,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947838278272153,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.33947423743555,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.63412907118939,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48665.511983363525,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 498.5794557384913,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 745.5376633519681,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2142895335,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b899b3ca3988eab8b8632cbb3b5263bf35322a76",
          "message": "Fix graphical logo placement after scroll (v0.6.9) (#174)\n\nThe v0.6.8 side-by-side choreography saved the cursor (DECSC), drew\nthe image, and restored (DECRC). With the prompt at the bottom of the\nscreen the draw scrolls the viewport, and DECSC/DECRC restore a\nviewport-relative position, so the info text landed below the logo\ninstead of beside it. Reproduced identically on Rio and kitty.\n\nReserve the logo rows with newlines first and cursor-up back to the\nimage-top row, so any scroll happens before the save and nothing\nbetween save and restore can scroll. Fresh-screen output unchanged.\n\nAlso refresh the stale in-repo packaging reference copies\n(PKGBUILD/package.nix 0.3.21 -> 0.6.8), per the tracked WIP task.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:32:00-07:00",
          "tree_id": "a20285fab03aaf49bedc3f4d570f209aaf34e68d",
          "url": "https://github.com/l1a/retch/commit/b899b3ca3988eab8b8632cbb3b5263bf35322a76"
        },
        "date": 1785078730005,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.93889166298653,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.953503418634525,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.24104221406726,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.04076380406396,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45573.51277233214,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 491.5327584579415,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 752.9869484136301,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2750815045,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fd8164049e99da545e8fe98d3f0b76e8c09b6faa",
          "message": "Fix AMD GPU names via libdrm amdgpu.ids (v0.6.10) (#175)\n\nThe Strix Halo iGPU (1002:1586) was reported as 'Radeon 880M / 890M':\nimprove_amd_gpu_name's first-substring-wins table matched the 'Strix'\n(Strix Point) entry against pci.ids' 'Strix Halo [...]' name, and\npci.ids cannot separate 1586's revision variants (8040S/8050S/8060S)\nat all.\n\nResolve AMD names on Linux through /usr/share/libdrm/amdgpu.ids first,\nkeyed by device id + revision from sysfs (how fastfetch does it), with\ngraceful fallback to the pci.ids + codename path. Order 'Strix Halo'\nbefore 'Strix' in the fallback table and add 'Krackan'.\n\nVerified live on Strix Halo: 'AMD Radeon 8060S Graphics (32 GB)'.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T07:58:18-07:00",
          "tree_id": "30c6fa2ba1ee6c45f748cc640eb4ed19adc3000a",
          "url": "https://github.com/l1a/retch/commit/fd8164049e99da545e8fe98d3f0b76e8c09b6faa"
        },
        "date": 1785080265838,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.9117335303991,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949756195139035,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.1485513152032,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.57883807451604,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47174.63156960493,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 500.8658210645478,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.3340361837797,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2963082055,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e8b380c97debf11a4a35306f669cf3e456ccd616",
          "message": "Report default-route domain, not a VPN's (v0.6.11) (#176)\n\nUnder systemd-resolved /etc/resolv.conf is the stub file whose search\nlist is the merged set of every link's domains, so the Domain field --\nwhich took its first entry -- showed a split-tunnel VPN's domain\n(netbird.cloud) instead of the default route's (lan). It never\nconsidered interfaces at all.\n\nResolve the IP default-route interface from /proc/net/route and report\nthat link's own domain from resolvectl status. Keyed on the routing\ntable, not resolvectl's per-link 'Default Route:' flag, which is a DNS\nrouting flag and was yes for both links. When resolved manages the\ndefault link but it has no domain, report nothing rather than falling\nback to the merged list (which would resurrect the VPN domain); an\nunmanaged link still falls back, so static-resolv.conf hosts are\nunchanged. A full-tunnel VPN that is the default route reports its own\ndomain, as intended.\n\nFix two latent bugs in the same parser: all '~'-prefixed routing-only\ndomains are excluded (not just the exact catch-all '~.'), and wrapped\ncontinuation lines are no longer silently dropped.\n\nresolvectl is now needed by --long, so one OnceLock-cached invocation\nis shared with --full's domain-search rather than spawning twice.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T08:39:18-07:00",
          "tree_id": "8e30bf9598c906aed347fbd5c1c2ab33160360b0",
          "url": "https://github.com/l1a/retch/commit/e8b380c97debf11a4a35306f669cf3e456ccd616"
        },
        "date": 1785082640808,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.6243188723899,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9480247799936743,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.60415212971705,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.0997647469525,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46993.386388722276,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.34720003608663,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 751.1284281982211,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1920919040,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "86f5803462d1608de8b7739c8dc6c69bc9c85a46",
          "message": "Give Domain Search one shape per source (v0.6.12) (#177)\n\nCI dry-run output showed 'eth0: <domain>' on Ubuntu but a bare\n'<domain>' on Fedora. The difference is not platform-driven: the same\nOS flips format between jobs. Ubuntu in the build matrix runs on a bare\nrunner and takes the resolvectl path; Ubuntu in full-test runs in a\ncontainer with no systemd-resolved and falls back to resolv.conf.\nFedora is always containerised, so it only looked different from\nUbuntu.\n\nGrouping differed too: the resolvectl path returns one entry per\ninterface with domains joined, while the fallback returned one entry\nper domain and the display prints one line per entry, so 'search a b c'\nemitted three separate bare lines.\n\nRender the fallback in the same '<scope>: a, b' shape, scoped 'global'\n-- labelled honestly rather than attributed to an interface, since\nresolv.conf's search list carries no attribution. The parser stays\nfaithful to the file; the shape is imposed at the detect layer. macOS\nroutes through the same formatter. The resolvectl path is unchanged.\n\nWindows is deliberately not fixed here and is documented in NOTES 6a:\nits Domain reads the AD/primary suffix rather than the connection\nsuffix, and Domain Search has no Windows arm at all. Both need\nGetAdaptersAddresses and cannot be verified live without a Windows box.\n\nAssisted-By: Claude Fable 5",
          "timestamp": "2026-07-26T19:35:39-07:00",
          "tree_id": "b11c193d8bdb824b38e28d4104d2b63b410c8fea",
          "url": "https://github.com/l1a/retch/commit/86f5803462d1608de8b7739c8dc6c69bc9c85a46"
        },
        "date": 1785122130759,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.86999537103786,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9486663197653504,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.01230814031238,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.16315339153257,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47967.29496806237,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 500.4914875541758,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 767.964817478043,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2574530000,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3738fdb3ff66b18fc121092f4f086ea51ac0dc30",
          "message": "Fix release tooling: publish-check and nix hashes (v0.6.13) (#178)\n\npublish-check failed on every release: the retch-cli dry run cannot\nresolve its '=0.1.x' retch-sysinfo pin until sysinfo is actually on the\nindex, and a dry run never uploads. It now checks the sparse index via\na new crates_io_has_version.py helper and skips that leg with an\nexplanation instead of dying on 'failed to select a version'. Both\npublish recipes also skip retch-sysinfo when its version is already\npublished, which is the normal state for a CLI-only release.\n\ncalculate_nix_hashes.py was silently emitting a wrong cargoHash. Its\nsubstitutions matched only 'lib.fakeHash', so once package.nix held\nreal values they became no-ops, the temp build kept the previous\nrelease's hashes, it failed on a source-hash mismatch rather than the\nintended cargoHash mismatch, and the lenient parser returned that stale\nsource hash. That is why the published v0.6.12 cargoHash equals\nv0.6.8's hash. Patterns now match a literal hash too, are line-anchored,\nand hard-error when they match nothing; the parser only accepts a hash\nreported against our own dummy.\n\nRefresh the in-repo packaging reference copies to the released v0.6.12.\npackage.nix keeps the genuine src hash but resets cargoHash to\nlib.fakeHash rather than carrying the corrupt value -- recompute with\n'just nix-update' on a machine with Nix.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-07-26T20:14:41-07:00",
          "tree_id": "195de4a24b9c74a5d3bbc3288e0a4ce21ab48a89",
          "url": "https://github.com/l1a/retch/commit/3738fdb3ff66b18fc121092f4f086ea51ac0dc30"
        },
        "date": 1785124461475,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.0091275535387,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9483946253149678,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.13453455239613,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.20218085595783,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47053.52991014561,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 496.8400327613311,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 758.0345424638696,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2631057420,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29c90fa282c281f6c5a2b797544c5babf5e957ce",
          "message": "fix(net): resolve Windows connection DNS domain and search list (#181)\n\n* fix(net): resolve Windows connection DNS domain\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(net): read Windows interface registry search list\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-07T23:10:01-07:00",
          "tree_id": "1430e5590c797113f0e21a4cdab22e90bfe90ce4",
          "url": "https://github.com/l1a/retch/commit/29c90fa282c281f6c5a2b797544c5babf5e957ce"
        },
        "date": 1786171724967,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.9587596367084,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9504567674836135,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.6575654343266,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.96300889676104,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47444.27804246038,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 489.3626651829277,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 745.0396452138208,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1943337875,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "464951f8ff41455093d91045e621a17b81124684",
          "message": "fix(display): parse monitor vendor and panel model from EDID on Windows (#183)\n\n* fix(display): parse monitor EDID on Windows\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): extract monitor vendor and model on Windows\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-08T07:48:08-07:00",
          "tree_id": "5029838743a7e4449bedecce22a3d07443557dd7",
          "url": "https://github.com/l1a/retch/commit/464951f8ff41455093d91045e621a17b81124684"
        },
        "date": 1786202989871,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 176.85087225065746,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9497512604938327,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 99.76592231765302,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.15216022368223,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47279.58783723063,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 494.0126500674879,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 755.4518966851099,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1764564625,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "622cf3b843fc5f6286cad91442e7bd41af2fdf12",
          "message": "Bump 4 deps and fix man page font-run strip (#184)\n\nConsolidates Dependabot #182 onto a gated branch so the release-hygiene\nsteps Dependabot skips (version bump, NOTES entry, man regen) are done.\n\nDependencies (cargo-dependencies group, lockfile-only — every spec is a\ncaret range, so Cargo.toml is untouched):\n  clap          4.6.4 -> 4.6.5  (clap_builder 4.6.2 -> 4.6.5)\n  toml          1.1.3 -> 1.1.4  (toml_parser  1.1.2 -> 1.1.3)\n  clap_complete 4.6.7 -> 4.6.8\n  base64        0.23.0 -> 0.23.1\n\nThe resulting Cargo.lock is byte-identical to what Dependabot generated.\n\nAlso fixes the `just man` font-collapsing sed, which has never worked on\nany platform. mandown emits redundant \\fB\\fB...\\fP\\fP runs and the recipe\ncarried `s/\\fB\\fB/\\fB/g` to strip them, but GNU sed reads \\f as the\nform-feed escape rather than backslash-then-f, so the pattern only ever\nmatched form feeds that groff output never contains. This is why\ndocs/retch.1 kept flip-flopping between machines: v0.6.2 concluded the\nstrip merely \"didn't take effect on Windows\", when in fact Linux was not\nstripping anything either — its mandown build just doesn't emit the\ndoubled runs. Matching the backslash as [\\] and carrying it out through a\ncapture group keeps any backslash escape off the replacement side.\n\nWith the fix, `just man` on Windows reproduces byte-for-byte the file a\nLinux `just man` produces, so the regen check in `just pr` no longer\ndepends on which machine last ran it. The regenerated page drops 21\ndoubled font runs and changes nothing else but the version footer.\n\nretch-sysinfo unchanged at 0.1.51; no Rust source touched.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-09T07:06:33-07:00",
          "tree_id": "15f29415e43f3e3f4f04318b070cc8c16695ac9a",
          "url": "https://github.com/l1a/retch/commit/622cf3b843fc5f6286cad91442e7bd41af2fdf12"
        },
        "date": 1786286964753,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 179.98561211855358,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948651640036006,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.04042254832609,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.90606608903099,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46542.9459701875,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 496.7132038471762,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 751.8543766534048,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2620748120,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "30f2bc0d85fda967af17b3472e2784627296f331",
          "message": "fix(justfile): make install and man recipes portable (#185)\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T13:24:44-07:00",
          "tree_id": "0ebf13827d71fe02fbbdd12b0eb83ccbacbc2ab8",
          "url": "https://github.com/l1a/retch/commit/30f2bc0d85fda967af17b3472e2784627296f331"
        },
        "date": 1786395989448,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 178.28849241152517,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9479128471771228,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.64858170586919,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.594537456887,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47332.34581624769,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.6745606746399,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 754.8703240191269,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2449318685,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "521364f30839992fda65499538a01a44bc4f11bb",
          "message": "fix(display): constrain graphic logo height, normalize audio, and wrap lines to terminal width (#186)\n\n* fix(display): reduce logo height and wrap long info lines\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(display): constrain graphic logo height and wrap below-logo lines to full terminal width\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): normalize and deduplicate Windows audio device names\n\nAssisted-By: Gemini 3.6 Flash\n\n* fix(sysinfo): evaluate soundwire before streaming filter in normalize_win_audio_device\n\nAssisted-By: Gemini 3.6 Flash",
          "timestamp": "2026-08-10T14:10:09-07:00",
          "tree_id": "8526b53eccb25ed2a964d63d08a63e698c00c32f",
          "url": "https://github.com/l1a/retch/commit/521364f30839992fda65499538a01a44bc4f11bb"
        },
        "date": 1786398634783,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 180.48188838663447,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947670137197315,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.15641421033199,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.4873022684442,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46382.3133229299,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.60990985302334,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.4006505838095,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2040453695,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1177d194785c63e2058a99f5cffa5ef33577d9cb",
          "message": "ci: disable Claude Code Review workflow (#187)\n\nThe claude-review job no longer runs on pull requests: the\n`pull_request` trigger is replaced with `workflow_dispatch` and the\njob carries `if: false`, so it is off by default but can still be\ninvoked manually if wanted.\n\nBumps retch-cli 0.6.16 -> 0.6.17 (patch), refreshes Cargo.lock,\nregenerates docs/retch.1 for the new version footer, and updates the\nNOTES.md Current State header and release log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T08:18:19-07:00",
          "tree_id": "5edf46dce11e5ab7293d0a0411af8f9341a70b2b",
          "url": "https://github.com/l1a/retch/commit/1177d194785c63e2058a99f5cffa5ef33577d9cb"
        },
        "date": 1786463990244,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 181.3855455990951,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948044542483151,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 105.50389035274486,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.3422854250223,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46471.919254129556,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.84295882348414,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 738.0833764443303,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1854522285,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1d0dc367f9ad44e2a04cc045891998fa9d9b1aae",
          "message": "fix: unprivileged Packages, sudo Rio, logo aspect (#189)\n\nThree defects found by diffing `sudo retch --full` against a plain run.\n\nPackages appeared only under sudo. The RPM SQLite database was opened\nread-write; it is root-owned inside a root-owned directory, so SQLite\ncould not create its journal sidecars and every *query* failed with\n\"attempt to write a readonly database\" — not the open(), which is why\nthe existing warning never fired and the field vanished silently. Now\nopened read-only over a `file:...?immutable=1` URI, and the query error\nis reported instead of swallowed.\n\nRio lost all graphics support under sudo: it was identified only by\nTERM_PROGRAM, which env_reset drops. `is_rio_terminal` now also accepts\nTERM=rio/xterm-rio, which sudo preserves.\n\nThe Kitty logo was stretched ~3x vertically. `c=26,r=10` was hardcoded\nand Kitty forces an image into that rectangle, while display.rs assumed\na fixed 40-column width and derived the row count a third way. A single\npure `fit_logo_cells` now feeds all three protocol emitters and\nplan_layout. Passing both correct values still left a 9% stretch from\ncell quantisation, so the Kitty spec carries only the limiting dimension\nand lets Kitty derive the other — measured 0.0% aspect error in a PTY.\n\nThe chafa box widens 28 -> 45 columns (row cap unchanged at 10) so wide\nlockup assets stay legible: the Fedora logo goes from 4 rows to 7. The\nside-by-side threshold is unaffected (45 + 45 <= 95), pinned by a test.\n\nAlso fixes a test-isolation defect the change exposed: once\nsupports_iterm2 read TERM, the host's TERM leaked into a test that\nguarded only TERM_PROGRAM, failing on a Rio box and passing on CI.\n\nDocuments the privilege trade-off in both directions (root-only\nphys-mem and btrfs snapshot counts; user-only editor/desktop/wm) in a\nnew NOTES section, README, and a man-page PRIVILEGES section.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T17:52:19-07:00",
          "tree_id": "9996d32ff3728e9292ad474ad37e12907763f637",
          "url": "https://github.com/l1a/retch/commit/1d0dc367f9ad44e2a04cc045891998fa9d9b1aae"
        },
        "date": 1786498405206,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.97786542098004,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9641768718634807,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 97.98860182163563,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.16608989814691,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48848.0197212285,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 490.9679765126367,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 751.5241683900898,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2949890710,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9d27af8746fe0e349822f3272031e94e03589b50",
          "message": "chore: bump 3 deps (consolidated Dependabot #188) (#190)\n\nRolls Dependabot #188 onto a gated branch so the release hygiene it\nbypasses — version bump, NOTES entry, man regen — is actually done,\nfollowing the #167/v0.6.3 and #184/v0.6.16 pattern.\n\nAll patch-level and lockfile-only; every spec is a caret range, so both\nCargo.toml manifests are untouched:\n\n  clap           4.6.5 -> 4.6.6  (pulls clap_builder 4.6.5 -> 4.6.6)\n  clap_complete  4.6.8 -> 4.6.9\n  rusqlite       0.40.1 -> 0.40.2 (pulls libsqlite3-sys 0.38.1 -> 0.38.2)\n\nThe lockfile was diff-verified byte-identical to Dependabot's before the\nversion bump, so this carries exactly the change its green CI validated;\nafterwards the only divergence is retch-cli's own version line.\n\nrusqlite warranted a live check rather than just a green suite: it is a\ndirect dependency of retch-sysinfo and the crate v0.6.18's Packages fix\nhad just started using differently, and libsqlite3-sys bundles SQLite\nitself, so a bump changes the engine that has to honour `immutable=1`.\nThe rpm_db_uri unit tests only assert string construction and could not\ncatch a behavioural change there. Verified live as an unprivileged user:\nPackages: 2509, unchanged.\n\nretch-cli -> 0.6.19; retch-sysinfo unchanged at 0.1.53 (no source\nchange, only its transitive lockfile deps moved).\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-11T18:52:53-07:00",
          "tree_id": "0f8eb7815bf12c631f95919caaeb1e89e3549096",
          "url": "https://github.com/l1a/retch/commit/9d27af8746fe0e349822f3272031e94e03589b50"
        },
        "date": 1786502016632,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.87052596234662,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9487391539177286,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 97.9215514955733,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.10950675639944,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46425.82791202316,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 487.42357421723216,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 727.4663350984727,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2419996210,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1b99674ea9eded99c6558e78098409ebe6a78ac",
          "message": "Make the pre-PR gate answerable; open-pr now pushes (#192)\n\n* Make the pre-PR gate answerable; open-pr now pushes\n\njust pr ended in a bare read, so only a human at a terminal could\nanswer it -- a script or agent blocked on a stdin that would never\nanswer, or died without saying why, and that reads as the gate refusing\nthe change. It now accepts PR_CONFIRM, an interactive stdin, or piped\ninput under a timeout, and names PR_CONFIRM when it cannot be answered.\nNot a bypass: every path still requires an explicit y.\n\njust open-pr did not push, so on a never-pushed branch it printed\n\"Gate passed\" and then failed because gh pr create had no remote\nbranch to open from. It now pushes only when there is no upstream --\npushing unconditionally would silently publish existing commits on a\nbranch that already has one. pre-push still runs just check, so the\npush is inside the gate rather than around it.\n\nBoth are rusticprofile's 0.0.21 and 0.2.12, which retch never received.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:24:18-07:00",
          "tree_id": "7307c8c54022ab27b0b3e8ecfeab8995613e25ea",
          "url": "https://github.com/l1a/retch/commit/c1b99674ea9eded99c6558e78098409ebe6a78ac"
        },
        "date": 1786593958930,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.97220856857447,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948049563703345,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.20334608973543,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.98042209263049,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46417.63510042655,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 486.802722235934,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 726.8206757924728,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2996746880,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6",
          "message": "Let the manual Claude review actually run (#193)\n\n* Let the manual Claude review actually run\n\nv0.6.17 disabled automatic review by commenting out the pull_request\ntrigger AND setting if: false on the job. The trigger alone already did\nthat, so the guard added nothing -- but it also applied to\nworkflow_dispatch, which was kept. So gh workflow run started a run,\nskipped the job, and reported SUCCESS having reviewed nothing.\n\nA green run that did nothing is the failure this repo's tooling exists\nto refuse, and the one rusticprofile recorded twice about this action.\nDispatch available but silently inert is worse than working or absent.\n\nAutomatic review stays OFF -- only the job guard is removed; the\npull_request trigger is still commented immediately above it.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T20:45:42-07:00",
          "tree_id": "a129dbfd95e55ff45255a019bb60311bdfcf5738",
          "url": "https://github.com/l1a/retch/commit/e5b9b5941c53dc4bcdc12aac4b5549e7d0ddf5f6"
        },
        "date": 1786595177214,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 178.35713141489336,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947798848977942,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.9539729448284,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.93094062801478,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47223.860366859124,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.3173522608,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 757.3713384287,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2048605605,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a",
          "message": "Gate merge-pr on CI; bring the triad under standard-check (#194)\n\n* Gate merge-pr on CI; check the triad\n\nmerge-pr went straight from the branch check to gh pr merge --squash\n--delete-branch, with no inspection of the status rollup. gh pr merge\nhappily merges a red PR when there is no branch protection, so every\nmerge in this repo has been ungated -- safe only because whoever merged\nhappened to look first.\n\nrusticprofile added this in v0.1.5 after a PR went in with a leg red,\nand extended it in 0.2.1 after an EMPTY rollup passed vacuously.\nNeither reached here.\n\nThree refusals now: a failing check, an empty rollup, and checks still\nrunning. The empty state is compared as a string rather than via jq -e\nlength, because an external jq is not on a default Windows PATH and a\ngate that degrades where its dependency is missing is the thing being\nfixed.\n\ngate_conformance.py (template v3) is vendored and run by\nstandard-check, so the guards cannot vanish again. It is structural,\nnot behavioural, and says so.\n\nVerified safely: on a branch with no PR the rollup is empty, so\nmerge-pr refuses before reaching gh pr merge.\n\nAssisted-By: Claude Opus 5\n\n* Commit the Cargo.lock version bump\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-12T21:18:47-07:00",
          "tree_id": "09cf28f2dd68d69de2931ed6e287f3ca4b42fd13",
          "url": "https://github.com/l1a/retch/commit/25a63eba863ae9cb9fb41eafa2ad6a65e9c42b8a"
        },
        "date": 1786597403679,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.8338105508045,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948794891428535,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 97.8038326676865,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 81.94313922763317,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46582.9809188185,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.0119594705733,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 728.7180002004212,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1435672365,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "120ed8e2e0fe45a624212a8204ae34b082b8c360",
          "message": "Add keyboard, mouse and tpm fields (#195)\n\n* Add keyboard, mouse and tpm fields\n\nThree NOTES.md section 6 fastfetch-gap fields, all --long and above,\nLinux-only, in the v0.5.0 shape: thin /proc and sysfs readers over pure\nhelpers that unit-test without touching host hardware.\n\nInput classification is exclusive and declines to guess. On a Logitech\nUnifying/Bolt receiver no kernel-visible signal separates a keyboard from\na mouse: handlers, capabilities/rel (0x1943 on both), the alphabet key\nblock, INPUT_PROP, udev ID_INPUT_* (POINTINGSTICK on both), USB HID\nbInterfaceProtocol and the HID report descriptor itself are all identical\nfor an MX Keys and an MX Master 3. fastfetch 2.66 gets this wrong in both\ndirections on that hardware. Ambiguous devices are resolved via the HID++\ndriver's battery model_name and, failing that, reported in neither field\nrather than asserted into the wrong one.\n\ntpm reads tpm_version_major and maps it to the published spec names\n(1 -> 1.2, 2 -> 2.0), returning None for anything unrecognised.\n\nAlso refresh packaging/aur/PKGBUILD, stranded at 0.6.12 for eleven\nreleases while the AUR moved to 0.6.23, and drop its man-page\nregeneration: the font-strip sed never matched on any platform (GNU sed\nreads \\\\f as a form feed) and $DATE/$pkgver were literal inside double\nquotes, so the installed footer read \"retch $pkgver\". The committed\ndocs/retch.1 ships in the tarball with the correct footer, so package()\ninstalls it directly and the mandown makedepend is gone.\n\nStrata golden counts move Long 49->52, Full 55->58. 11 new unit tests.\nVerified live on corrino (Fedora 44, i7-1360P).\n\nAssisted-By: Claude Opus 5\n\n* Close two holes in the aur CI job\n\nThe job rewrote source= and sha256sums= to build from local sources, so the\ndeclared checksum was never checked by anything — a stale one (as this\nPKGBUILD carried for eleven releases) stayed green and would only fail for\nsomeone installing from the AUR. Verify it against the real tag tarball\nbefore that patching, refusing a committed SKIP and skipping cleanly when the\ntag is not published yet.\n\nNothing inspected the packaged man page either, which is where both defects\nthis branch fixes actually showed. Assert the built package's .TH line carries\nno literal $ and a real retch <version> footer, and that no doubled font runs\nsurvive.\n\nAlso stop pre-installing mandown, so makedepends is load-bearing: makepkg -s\ninstalls what the PKGBUILD declares and nothing else.\n\nAssisted-By: Claude Opus 5\n\n* Fix the man-page check failing on a correct package\n\nThe new verification step used `bsdtar -tf \"$pkg\" | grep -qx …` under\n`set -o pipefail`. grep -q exits on its first match, bsdtar takes SIGPIPE and\nexits 141, and pipefail turns that into a failed pipeline — so the step\nreported the man page missing exactly when it was present, and CI went red on\na package that was correct. head -1 and grep -m1 carry the same hazard.\n\nMaterialise the listing and the page to files and grep those; select the\npackage with find -print -quit. Verified against a good package and against\npurpose-built broken ones (missing page, literal $ footer, doubled font runs).\n\nAssisted-By: Claude Opus 5\n\n* Match the gzipped man page makepkg actually ships\n\nmakepkg's zipman option is on by default, so the packaged path is\nusr/share/man/man1/retch.1.gz. The verification step looked for retch.1 and\nreported it missing — the check wrong again, the package correct again.\n\nMatch retch.1 with an optional .gz/.zst/.xz/.bz2 suffix and decompress before\ninspecting. Tested against gzipped, uncompressed, and gzipped-but-broken\npackages.\n\nThe diagnostic added in the previous commit is what made this cheap: printing\nthe real usr/share listing on failure named retch.1.gz directly in the CI log.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T09:49:12-07:00",
          "tree_id": "274aff11102cf1108fb49cbe2f4d8beedda7b477",
          "url": "https://github.com/l1a/retch/commit/120ed8e2e0fe45a624212a8204ae34b082b8c360"
        },
        "date": 1786728506254,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 181.1000409058924,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9558136256730108,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.38216050825166,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.34008410484556,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46734.587662465245,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.93314820999285,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 749.650839144773,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2195085910,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0fb38978e0182c24717fea4d8b4a80047b15d233",
          "message": "Make packaging/aur the source, not a stale copy (#196)\n\npackaging/aur/PKGBUILD was a reference copy that nothing rendered, published or\nchecked. It reached eleven releases of lag (0.6.12 in-repo against 0.6.23\npublished), and because the copy was inert the live AUR PKGBUILD kept two\nman-page defects long after they were fixed here — Arch installs got a page\nfooted $DATE / retch $pkgver the whole time.\n\npackaging/aur is now the source. aur-bump renders it from a released tag,\naur-publish pushes exactly those files, and .SRCINFO is tracked and generated\nby a real makepkg --printsrcinfo in a container (no host here runs Arch).\nCarried over from rusticprofile: write to a temp file and move it into place so\na failure cannot truncate the committed file, check the output content rather\nthan the exit code, and mount :z never :Z.\n\nscripts/aur_check.py is the anti-drift guard and just check depends on it. It\ncompares the pair field-by-field including the expanded source URL, so it\ncatches a pair that agrees on the version and disagrees on the checksum — the\nshape that breaks on the user's machine and nowhere else. Pure Python, so it\nruns on Windows; parses rather than sourcing the PKGBUILD, and raises rather\nthan expanding unknown variables to empty.\n\nVerified end to end: the generated .SRCINFO came out byte-identical to the one\nhand-written and pushed to the AUR earlier today, and AUR_CONFIRM=n\njust aur-publish exercised every preflight check without publishing.\n\nAssisted-By: Claude Opus 5",
          "timestamp": "2026-08-14T10:43:28-07:00",
          "tree_id": "0dcac6b08b8ab4bb34654fbcf6096f083db1f748",
          "url": "https://github.com/l1a/retch/commit/0fb38978e0182c24717fea4d8b4a80047b15d233"
        },
        "date": 1786731841478,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 181.0637903146159,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9479788413105465,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.89705303100894,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 83.69347795492641,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45032.96450167777,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.9090329851821,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 748.7142302049091,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3253555905,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9b8bcc71daafe3d38abb8ba9085195eef680d68f",
          "message": "Native Media and Player Detection (#197)\n\n* Add native media and player detection fields\n\nImplement 100% native FFI / direct socket media and player detection with zero subprocess forks across Windows (WinRT COM GlobalSystemMediaTransportControlsSessionManager via combase.dll), Linux (direct Unix domain socket D-Bus MPRIS client), and macOS (Objective-C runtime SBApplication FFI).\n\nAdds 'player' and 'media' to FIELDS registry (Mode::Long, available in --long and --full). Strata golden counts Long 52 -> 54, Full 58 -> 60. Regenerated man page, updated README.md, docs/retch.1.md, NOTES.md, WIP.md, and GitHub wiki.\n\nAssisted-By: Gemini 2.5 Flash\n\n* Fix Rust 1.97 Clippy lints in media.rs\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:19:02-07:00",
          "tree_id": "5f6c7da98e5d1a0862003b59cc74c4130d097866",
          "url": "https://github.com/l1a/retch/commit/9b8bcc71daafe3d38abb8ba9085195eef680d68f"
        },
        "date": 1786935563525,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 179.0638797603917,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.956193042597625,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.67536913126996,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.49084923580385,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47167.49465506444,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 489.78692483445604,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 731.3465385988499,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1946138320,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ed45ec18928bf19b4add811c3f8a567211932073",
          "message": "Add README and crate metadata for retch-sysinfo (#198)\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:39:49-07:00",
          "tree_id": "13cd0a580de7afdb2209726aa2a026b4079579a6",
          "url": "https://github.com/l1a/retch/commit/ed45ec18928bf19b4add811c3f8a567211932073"
        },
        "date": 1786936783487,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 178.44206991241182,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949329588055982,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.70424600570598,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.54740285529687,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47633.02051692533,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 487.4908929842063,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 748.5015144046649,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2854188470,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "f75989c777d19ce11a71c02c17a50e959cdb94cb",
          "message": "aur: bump to 0.8.0\n\nAssisted-By: Antigravity",
          "timestamp": "2026-08-16T19:47:18-07:00",
          "tree_id": "6e84e4f067d36b437236a783f86e1b1b04a441ca",
          "url": "https://github.com/l1a/retch/commit/f75989c777d19ce11a71c02c17a50e959cdb94cb"
        },
        "date": 1786937368738,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 179.00207297711455,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947685243873235,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.64819383945806,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.45662351924472,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46257.338155732665,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 487.4565239685038,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 734.7603520301213,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2036292555,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e42fb854db13c202146dc739849f67429547ebf9",
          "message": "deps: bump dependencies (consolidate #199) (#200)\n\nConsolidate Dependabot PR #199:\n- clap_complete_nushell 4.6.1 -> 4.6.2\n- icy_sixel 0.5.0 -> 0.5.1\n- Cargo.lock transitive dependency updates\n- Bump retch-cli to 0.8.1 and regenerate man page\n\nAssisted-By: Gemini 3.7 Flash",
          "timestamp": "2026-08-21T15:33:39-07:00",
          "tree_id": "f4dea1009382aed406875e53dbf14115c540f5df",
          "url": "https://github.com/l1a/retch/commit/e42fb854db13c202146dc739849f67429547ebf9"
        },
        "date": 1787354119208,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 178.0503287114297,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9474512886140056,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.96190920102795,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.46755750429907,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47577.70967116983,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 495.52528083008644,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 743.4511385148268,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2395026220,
            "unit": "ns"
          }
        ]
      }
    ]
  }
}