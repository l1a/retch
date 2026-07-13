window.BENCHMARK_DATA = {
  "lastUpdate": 1783908167974,
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
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "d89aa928c05f9ff70640a355b7aa104df5933a86",
          "message": "docs: update NOTES for v0.3.23 release and nixpkgs PR\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T10:56:28-07:00",
          "tree_id": "4de75ab73dd70c0da1ffc10be9ba0f151bfd5c5f",
          "url": "https://github.com/l1a/retch/commit/d89aa928c05f9ff70640a355b7aa104df5933a86"
        },
        "date": 1782324252333,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2679552.7399999998,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 351777439.24000007,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 336367359.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2134.5308164796943,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.674403597629365,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.0516203722279425,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.427810152933525,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20580.034457723224,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207135.15015551352,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14356.123921214374,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14530.488848991057,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1725533.2810175344,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 366.0396707385536,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 256.955625764855,
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
          "id": "cb511d8ada171c399172dfebc8bde41a8137148f",
          "message": "perf: fix chafa and nmcli performance bottlenecks\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T11:12:15-07:00",
          "tree_id": "73aa12c54edcd985c05025eaa5c69f7f525872d6",
          "url": "https://github.com/l1a/retch/commit/cb511d8ada171c399172dfebc8bde41a8137148f"
        },
        "date": 1782325144542,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2488661.1200000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 262940917.02,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 259437360.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2000.5133096140482,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.51164569752575,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.82874072530821,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.10713080358356,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17433.756562110975,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 183254.49628513213,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12176.056727471028,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12560.210348680801,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1602754.2830096597,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.66268011276696,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 265.70570262963486,
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
          "id": "447f7796abf0b7810da7499a874504400076dfb6",
          "message": "Merge pull request #111 from l1a/fix/performance-regression\n\nperf: fix performance regression and align hyperfine mode comparisons",
          "timestamp": "2026-06-24T12:14:54-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/447f7796abf0b7810da7499a874504400076dfb6"
        },
        "date": 1782328923827,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 264469670.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2176.1936062994077,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.55936632560501,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.067087477234294,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.65394653088286,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20926.028886809167,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207642.85946499652,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14472.382293348312,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14605.66484970885,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1730723.0059290174,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.11129633276016,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 263.9658694578382,
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
          "id": "f38e23d53463405bbe973aa41c6ba9f794feabb9",
          "message": "chore: update checklists for version bump man pages\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:19:13-07:00",
          "tree_id": "75eec970de36474ac08d3746351c260f654e5e8b",
          "url": "https://github.com/l1a/retch/commit/f38e23d53463405bbe973aa41c6ba9f794feabb9"
        },
        "date": 1782329191370,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 271673695.125,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2002.443608658353,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.115886703075645,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.834825311103863,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.58704462649422,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17495.2324443525,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 182965.8903220959,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12303.540682634219,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12481.446240462501,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1629101.5259047267,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 356.487346900498,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 277.50259293998704,
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
          "id": "485da1be8ba30a6409d4220e303ee1380f4c8937",
          "message": "docs: document default set notes in NOTES\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:31:27-07:00",
          "tree_id": "ca4119acbfdfeee6b90c27723a146c8529d0cef2",
          "url": "https://github.com/l1a/retch/commit/485da1be8ba30a6409d4220e303ee1380f4c8937"
        },
        "date": 1782330324695,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 304275662.925,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2060.1696397131423,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.24079785080119,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.800116808282117,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.67819913628207,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17673.272898493677,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 184618.930804218,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12332.587322877607,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12688.105956769374,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1622507.0060708825,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 365.4139064609079,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 278.0883604417543,
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
          "id": "04d2442f2ab2a46ae627bbe76af2e08ecec87220",
          "message": "Merge pull request #112 from l1a/feat/windows-phys-disk-mem\n\nfeat: implement Windows PhysDisk and PhysMem detection",
          "timestamp": "2026-06-24T22:33:30-07:00",
          "tree_id": "9c6c912cc8c4f04055290db2ab35fc64cc3e8675",
          "url": "https://github.com/l1a/retch/commit/04d2442f2ab2a46ae627bbe76af2e08ecec87220"
        },
        "date": 1782366040903,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 255406813.525,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2063.0992579897634,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.02552048088893,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.803812834248877,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.452513104413775,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17744.553470227198,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186014.20952629187,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12587.495970201293,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12799.009948092189,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1626286.9168104795,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 367.59484694408263,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 245.58432845229473,
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
          "id": "cc924b5dc321850fda70d1fd023e08d3849a39e4",
          "message": "docs: update AGENTS.md last-updated footer to v0.3.25 (#113)\n\n* chore: add just nixpkgs-release automation script\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: update AGENTS.md last-updated footer to v0.3.25\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:12:53-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/cc924b5dc321850fda70d1fd023e08d3849a39e4"
        },
        "date": 1782418811479,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 327468684.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2026.5461872029105,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.87017756388191,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.831819193244545,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.662292455574494,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17487.850104176276,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 184210.12720598557,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12383.886315704109,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12539.675200890548,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1616871.2802639457,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 373.57219947410454,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 236.13685274047947,
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
          "id": "616ce0be9684e55037a517f1c5b4e646f9d395c1",
          "message": "chore: add just nixpkgs-release automation script (#114)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:14:18-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/616ce0be9684e55037a517f1c5b4e646f9d395c1"
        },
        "date": 1782418886041,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 305024419.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1094.4856288166934,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 52.08786497066486,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.407701081150082,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.095892208676354,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8625.440789814613,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 82915.14758431353,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 56360.71975055139,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 56395.57597658873,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1590982.0914737205,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.0015717968505,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.8101217599025,
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
          "id": "bf9f9116909d0291a83a77f97482debe1f6e4ec5",
          "message": "chore: add just nixpkgs-release automation script (#115)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:04:58-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/bf9f9116909d0291a83a77f97482debe1f6e4ec5"
        },
        "date": 1782573119595,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 242996759.26666665,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2030.7446210045703,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.83870946166612,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.864561294566234,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.07063069642553,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17383.117357003757,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 182565.7593096706,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12414.106495883196,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12512.417815566154,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1606638.139405865,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 375.45944689788394,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 262.46798435989365,
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
          "id": "2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7",
          "message": "docs/ci: branch cleanup policy and skip CI on docs-only PRs (#116)\n\n* docs: document branch-deletion policy in AGENTS.md\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: skip Rust/Security/Packaging workflows on docs-only PRs\n\nAdd paths filters to pull_request triggers so the full CI matrix\ndoes not run when only docs, scripts, or config files change.\nPush-to-main continues to run unconditionally.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:29:33-07:00",
          "tree_id": "81fad1b28f95d6c6e1f50b3e961f2a81c7ea145d",
          "url": "https://github.com/l1a/retch/commit/2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7"
        },
        "date": 1782574596006,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 242768773.83333334,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2013.6464442057306,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.36327236323133,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.831145042918686,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.04998909063139,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17750.190484406558,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 182353.18093736164,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12394.022906502161,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12561.14557983643,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1612329.0215347663,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.2971198233372,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.4428576984556,
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
          "id": "ee330bee589f3cc23883fa67e627ad06b31d2d2b",
          "message": "fix: rebuild release binary if signal-killed on post-merge bench (#117)\n\nA Syncthing-synced binary compiled with target-cpu=native on a\ndifferent CPU microarchitecture crashes with SIGILL during sysinfo\ngathering. Cargo considers it up-to-date so `cargo build --release`\nis a no-op. Detect signal-killed exit (Python returncode < 0) and\nforce `cargo clean -p retch-cli && cargo build --release`.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:59:12-07:00",
          "tree_id": "13b71b071d9e5f31c3faa06d4aa51320377501b8",
          "url": "https://github.com/l1a/retch/commit/ee330bee589f3cc23883fa67e627ad06b31d2d2b"
        },
        "date": 1782576379562,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 255625992.175,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2082.4035522065997,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.80076629989202,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.840823866588263,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.05103378175595,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17869.34901441034,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 185941.5386487097,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12560.622513550725,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12658.295698526937,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1631461.657946487,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 365.4673728358889,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 272.0931692258009,
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
          "id": "9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f",
          "message": "feat: add just install-completions recipe (#118)\n\nGenerates and installs shell completions for bash, zsh, fish, elvish,\nnushell, and powershell to their correct XDG user locations. Also adds\nXDG path variables at the top of the Justfile and updates `just install`\nto depend on both install-man and install-completions.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:37:34-07:00",
          "tree_id": "d9c8234aa1d97872442e3e68b1a968f215f50f90",
          "url": "https://github.com/l1a/retch/commit/9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f"
        },
        "date": 1782578689624,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 257933908.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2191.5598125618867,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.759540527050945,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.044983128261111,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 83.29294575647704,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20792.192824703023,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207715.8049918796,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14426.640004865123,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14711.781419171733,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1739549.451242589,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 360.1755052841901,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 244.02550888046912,
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
          "id": "71466e09694d76209fdf3bc02eef9cdfc6155c0d",
          "message": "docs: add performance regression vigilance guideline to AGENTS.md (#119)\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:53:59-07:00",
          "tree_id": "b6775fe68f3fa2aa0befa4fe2f722a2a1f15a8fe",
          "url": "https://github.com/l1a/retch/commit/71466e09694d76209fdf3bc02eef9cdfc6155c0d"
        },
        "date": 1782579661334,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 272106764.675,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2183.191832259463,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.96365501242375,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.035368265442349,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.97505464206428,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20554.467165888786,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207106.7957948087,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14341.860133046308,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14514.27765182477,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1714789.026934776,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 366.26354180026254,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.94647189263804,
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
          "id": "d76a7d5246a051893671a84ed973b52bbe56e1b1",
          "message": "fix: skip FUSE and pseudo mounts in disk detection (#120)\n\n* fix: skip FUSE and pseudo mounts in disk detection\n\nsysinfo::Disks::new_with_refreshed_list() calls statvfs on every entry\nin /proc/mounts, including FUSE mounts that can block for hundreds of\nmilliseconds (e.g. cryfs vault: 613ms).\n\nOn Linux, replace sysinfo disk enumeration with a direct /proc/mounts\nreader that filters pseudo/FUSE filesystem types before calling statvfs.\nmacOS and Windows continue to use sysinfo::Disks unchanged.\n\nReduces disk field timing from ~634ms to ~2ms on affected machines.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: restore cross-platform deps moved to linux-only target by mistake\n\ndirs, chrono, anyhow, owo-colors, and rusqlite are used unconditionally\nacross macOS/Windows; only libc should be linux-only.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: mark is_skip_fs as linux-only to silence dead_code on macOS/Windows\n\nThe function is only called from detect_logical_linux which is already\ncfg-gated; clippy -D warnings caught it on the macOS CI job.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: make libc an unconditional dep to avoid lock file mismatch on AUR CI\n\nSome cargo versions handle cfg-gated deps in the lock file differently.\nlibc compiles on all platforms; the Linux-specific code that uses it is\nalready cfg-gated, so making it unconditional is safe.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:34:03-07:00",
          "tree_id": "1740235a0c0c2d66418ef5eac4e55c0e3132401a",
          "url": "https://github.com/l1a/retch/commit/d76a7d5246a051893671a84ed973b52bbe56e1b1"
        },
        "date": 1782582059378,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 242050125,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2012.1035889845195,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.680506462444725,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.850326185724633,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.97684232464375,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17466.06176270423,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 183147.5410795795,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12329.305810547254,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12531.068567924061,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1597041.5543780315,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 407.024119502869,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.8890546922618,
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
          "id": "7733084c8ee1c58721066fc0199ac3c4ec3b2f4d",
          "message": "chore: bump version to v0.3.26 (#121)\n\n* chore: bump version to v0.3.26\n\nFollows fix for FUSE mount statvfs hang (PR #120).\n\nAssisted-By: claude-sonnet-4-6\n\n* docs: add mandatory pre-PR gate checklist to AGENTS.md\n\nForces explicit per-item verification output before gh pr create so\nno version bump or doc step can be silently skipped.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:56:14-07:00",
          "tree_id": "68842ea99eb9a017711b6c72ef0f9687e864c5da",
          "url": "https://github.com/l1a/retch/commit/7733084c8ee1c58721066fc0199ac3c4ec3b2f4d"
        },
        "date": 1782583402014,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 297090594.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2027.7111662502743,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.82759999754899,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.182790714073257,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.72080333227791,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17502.182578931264,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 183445.0981430703,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12392.712549175241,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12559.241809543415,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1596563.3760494243,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 413.60762942686233,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 259.5811243399793,
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
          "id": "79e4de519e6b7bc2f4ce2f6df351d62e41c05b26",
          "message": "feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields (#122)\n\n* feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields\n\nCloses six items from the fastfetch feature gap list:\n\n- Chassis: DMI chassis_type â†’ human label on Linux; hw.model inference on macOS\n- Init: /proc/1/comm on Linux; static \"launchd\"/\"SCM\" on macOS/Windows\n- Locale: $LC_ALL â†’ $LC_MESSAGES â†’ $LANG\n- Bootmgr: checks /boot/loader, /boot/grub2, /boot/grub, /sys/firmware/efi on Linux\n- Editor: $VISUAL â†’ $EDITOR\n- Weather: curl wttr.in/?format=3 (long mode only, 3s timeout)\n\nChassis/Init/Locale/Bootmgr/Editor added to the default output set.\nWeather is long-only to avoid adding a network call to standard runs.\n\nAlso moves the feature gap tracking list from AGENTS.md to NOTES.md â€”\nit is project state, not a standing instruction.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add weather_location config key\n\nUsers can now set `weather_location` in config.toml to pin the weather\nfield to a specific city name, ZIP code, airport IATA code, or lat/lon\ncoordinates â€” all formats supported natively by wttr.in. Without the\nkey, location is auto-detected from the requester's IP as before.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: complete --generate-config output\n\nAdded missing logo key, weather_location key, and updated the fields\nexample to include all current fields (chassis, init, locale, bootmgr,\neditor, weather, phys-mem, phys-disk, cpu-cache, cpu-usage, etc.).\nAlso synced DEFAULT_FIELDS_BLOCK in config.rs to match.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add --weather-location CLI flag\n\nAllows specifying weather location on the command line, overriding the\nconfig file's weather_location setting.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: URL-encode weather location and handle unknown locations\n\nSpaces and commas in location strings (e.g. \"Thousand Oaks, CA\") were\nnot encoded, breaking the URL. Now encodes spaces as + and commas as\n%2C before inserting into the wttr.in URL path.\n\nAdded -f to curl so HTTP 4xx/5xx (unknown location) causes a non-zero\nexit and the Weather field is silently omitted rather than showing the\nwttr.in error text.\n\nAdded url_encode_location unit tests.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: show error when explicit weather location is not found\n\nInstead of silently omitting the Weather field, display\n'Unknown location: \"<name>\"' when the user set a location\nexplicitly but wttr.in can't resolve it. Auto-detect failures\n(no location set) remain silent.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: update tests and benchmark for weather_location field\n\nAdded weather_location to config test fixtures and CollectOptions\ninitializer in benchmarks.rs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump version to v0.3.27, update docs and README\n\n- Bump retch-cli to 0.3.27, retch-sysinfo to 0.1.27\n- Bump AGENTS.md Current State header to v0.3.27\n- README: add weather_location config key, update fields example with\n  all new fields (chassis, init, locale, bootmgr, editor, weather)\n- docs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add just pr pre-PR gate recipe\n\nAutomates the pre-PR checklist so it can't be skipped:\n- Checks feature branch (not main)\n- Checks version bumped past last tag\n- Checks AGENTS.md Current State header matches version\n- Regenerates man page and fails if result is uncommitted\n- Runs cargo check and fails if Cargo.lock is uncommitted\n- Runs just check (fmt + clippy)\n- Runs cargo test\n- Prints manual checklist (README, release log, wiki) and requires\n  explicit 'y' confirmation before exiting 0\n\nUpdates AGENTS.md pre-PR gate instruction to reference just pr.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: move Chassis, Init, Locale, Bootmgr, Editor to long-only output\n\nThese fields are too verbose for the default view. They now appear\nonly in --long mode, alongside Weather.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: disable nixpkgs verification job\n\nnixpkgs PR was declined due to lack of popularity. No point running\nthe slow Nix build until we meet the popularity threshold. Re-enable\nby removing the `if: false` condition.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-28T08:32:51-07:00",
          "tree_id": "d40cb87dbb3673839a3b79e597cda6b56ae3e97f",
          "url": "https://github.com/l1a/retch/commit/79e4de519e6b7bc2f4ce2f6df351d62e41c05b26"
        },
        "date": 1782661205421,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 864411386.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1085.411736284648,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 50.29578203950422,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.441266680327327,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 51.15276502093833,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8609.418169210732,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 82658.52796679374,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 55947.38542301736,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 56323.51685949669,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1556568.723231879,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.915373873028,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 285.1151271181945,
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
          "id": "770e0b0eabf6d60a1fecc1982117f738c3899fc0",
          "message": "feature/add tldr (#123)\n\n* docs: add tldr page entry for retch\n\nAssisted-By: Gemini 3.5 Flash\n\n* chore: add tldr page to pre-pr checklist\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add tldr-release automation script and recipes\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add merge-pr recipe and reset_wip script\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:28:45-07:00",
          "tree_id": "c1f8fdf58502f0ab22c57e17c25bcbd3feda49dd",
          "url": "https://github.com/l1a/retch/commit/770e0b0eabf6d60a1fecc1982117f738c3899fc0"
        },
        "date": 1782664592718,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 603749631.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2057.478439161267,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.0554265413562,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.830784928062168,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.379020337302755,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18151.405565249966,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186150.26552049918,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12639.862987601995,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12661.317546461596,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1602506.721860494,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 402.96169931029715,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 281.0747298864513,
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
          "id": "b8d3f6ea87cf396f449249595ed4d787aa2bb2fe",
          "message": "fix: ignore already deleted branch error in merge-pr recipe (#124)\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:34:40-07:00",
          "tree_id": "c9c370af106069b537c4019e66afc44f31927e26",
          "url": "https://github.com/l1a/retch/commit/b8d3f6ea87cf396f449249595ed4d787aa2bb2fe"
        },
        "date": 1782664932410,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 743550872.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2055.9288876710007,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.403343945600895,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.825492713170485,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.895818083251925,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17948.886689076546,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186459.39749903075,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12585.635577251975,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12823.40318250464,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1607723.5114850726,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 394.0518384632427,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 291.64554726133986,
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
          "id": "d13f2fe0da7a898a1ebbd9c412284e5d02a0651e",
          "message": "chore/refactor docs (#125)\n\n* docs: refactor documentation structure\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: fix Current State header formatting\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:54:34-07:00",
          "tree_id": "aaa002e02169e3c871a1373946d09700c6002e90",
          "url": "https://github.com/l1a/retch/commit/d13f2fe0da7a898a1ebbd9c412284e5d02a0651e"
        },
        "date": 1782666123120,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 759516757.65,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2044.9641664218495,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.33373951186845,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.882273172849516,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.810819083934554,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17818.05802346156,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 186961.54537297323,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12541.828509833062,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12701.175941653186,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1577035.658049448,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 399.0251688417461,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 295.1542752703194,
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
          "id": "0bc5e587df1dee945e8b33182694531b28affdb9",
          "message": "Merge pull request #126 from l1a/fix/tldr-auth-bypass\n\nfix: resolve gh auth and fork directory issues in tldr release script",
          "timestamp": "2026-06-28T19:15:24-07:00",
          "tree_id": "41349673c84e317f53711dc893f4ebf44ab425c3",
          "url": "https://github.com/l1a/retch/commit/0bc5e587df1dee945e8b33182694531b28affdb9"
        },
        "date": 1782699752312,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 821117081.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1689.2918367346574,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 49.476951818315605,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.8996806054297095,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.44998385997361,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16030.977233942735,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 160858.35390292396,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11234.041603758324,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 11352.859244939362,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1287823.2648789051,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 292.0275332933745,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 232.02319327030855,
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
          "id": "b61db1f0a08f4d023930e0231b61079b17d4dc75",
          "message": "Merge pull request #127 from l1a/fix/tldr-page-format\n\nfix: fix tldr page lint errors",
          "timestamp": "2026-06-28T19:35:48-07:00",
          "tree_id": "80701731a659a4af0387474cc7517b7f36d10c32",
          "url": "https://github.com/l1a/retch/commit/b61db1f0a08f4d023930e0231b61079b17d4dc75"
        },
        "date": 1782701001052,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 657054773.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2181.054034601483,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.88598305517799,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.05122812300728,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.594668865889375,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20773.577382314437,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207078.10019279813,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14493.466583287784,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14648.407497637683,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1676484.5839485005,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 372.46999200825604,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 296.2962926610791,
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
          "id": "1094ac231ae3237ed49464785b01c00c96026b20",
          "message": "feat: add TerminalSize, DNS, WM fields; fix Shell detection (v0.3.29) (#128)\n\n* feat: add TerminalSize, DNS, WM fields; fix Shell detection\n\n- TerminalSize: ioctl(TIOCGWINSZ) on Linux/macOS, $COLUMNS/$LINES fallback\n- DNS: parse /etc/resolv.conf nameserver lines; PowerShell on Windows\n- WM: scan /proc for compositor/WM process names; suppressed in output\n  when identical to Desktop field (case-insensitive)\n- Shell: walk process tree first to find running shell; fall back to\n  $SHELL (login shell) only when scan yields nothing\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: improve Desktop detection when XDG env vars are absent\n\nAdd XDG_SESSION_DESKTOP and GDMSESSION as fallbacks, normalize\nDE names to canonical casing, and probe /proc as a last resort\n(e.g. gnome-shell â†’ GNOME) for terminals that don't inherit the\nfull session environment.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add non-Linux stub for detect_desktop_from_proc\n\nSatisfies clippy::unnecessary_lazy_evaluations (Rust 1.96+):\nreplace inline cfg closure with .or_else(detect_desktop_from_proc)\nand add a #[cfg(not(target_os = \"linux\"))] stub returning None.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: suppress logo when stdout is not a tty\n\nUse std::io::IsTerminal::is_terminal() instead of terminal_size()\nto detect piped output. terminal_size() returns Some() when a pager\nlike bat allocates a PTY, causing the logo to print as raw escape\nsequences.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+tests: update for v0.3.29 PR changes\n\n- docs/retch.1.md + retch.1: note logo tty-suppression in LOGOS section\n- README.md: add auto-suppressed-when-piped bullet to Logo Rendering Modes\n- NOTES.md: bump Current State to v0.3.29; add Desktop fix, logo tty\n  suppression, and logo cursor placement to release entry; remove DNS,\n  WM, TerminalSize from feature gap list\n- tests/cli_tests.rs: add tests for --fields dns/wm/terminal-size and\n  piped output containing no graphical logo escape sequences\n- fetch.rs: add unit tests for normalize_desktop_name,\n  detect_desktop_from_proc, and title-case/whitespace edge cases\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T12:30:38-07:00",
          "tree_id": "47d929d6f83cb36e994b9821fee1a649e882b21c",
          "url": "https://github.com/l1a/retch/commit/1094ac231ae3237ed49464785b01c00c96026b20"
        },
        "date": 1782761862419,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 572336887.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1978.861014540334,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 75.15006950829118,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.831298824788869,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 66.59250343974269,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17462.746757857254,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 183298.73430498928,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12401.904436100283,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12574.503171068845,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1590363.349039632,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 373.71244400270206,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 262.97169584689425,
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
          "id": "1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a",
          "message": "fix: advance cursor past graphical logo bottom edge (#129)\n\nWhen the info field list is shorter than the logo height, the shell\nprompt was drawn on top of the logo. Fix by computing the logo's\nheight in terminal rows (image px height / cell px height via\nTIOCGWINSZ, with 20px fallback) and emitting CSI B after restoring\nthe cursor to push past the logo's bottom edge.\n\nAdds libc as a unix-only direct dep for TIOCGWINSZ.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:00:36-07:00",
          "tree_id": "f9622416d510a495b2af1a31b6b9c7e6b12f477e",
          "url": "https://github.com/l1a/retch/commit/1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a"
        },
        "date": 1782763688365,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 653398005.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1030.0043985334908,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 64.60808438586805,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.367715162450594,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.15531552881622,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8706.989147291115,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 81568.22210230448,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 54636.03656625714,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 55737.5777552597,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1699203.0758390739,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 395.2747133287023,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 262.7536288902242,
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
          "id": "400f31e6f99e05724137adc0e67d046233010752",
          "message": "feat: switch weather backend to Open-Meteo (v0.3.30) (#130)\n\n* feat: switch weather to Open-Meteo + ipinfo.io\n\nReplace wttr.in (World Weather Online backend) with:\n- Open-Meteo for temperature/WMO weather code (geocoding API + forecast API)\n- ipinfo.io for IP-based auto-location fallback\n\nAdds `weather_unit` config/CLI option (\"fahrenheit\"/\"celsius\").\nWMO weather codes are mapped to emojis.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+test: improve weather.rs coverage and docs\n\n- Doc comments on detect_weather, curl_get, wmo_to_emoji, WeatherUnit variants\n- Expand wmo_to_emoji test to cover all major WMO code ranges + fallback\n- Add parse_coords edge cases: spaces around comma, out-of-range lat/lon\n- Add geolocate_ip display-name tests (US, non-US, no-city) without network\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.30, update docs and man page\n\nVersion: 0.3.29 â†’ 0.3.30 / retch-sysinfo 0.1.29 â†’ 0.1.30\nNOTES.md: Current State header + v0.3.30 release log entry\nREADME.md: fix weather config comment, add weather_unit key\ndocs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add weather-location to tldr page\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: note tldr upstream submission on hold\n\nUpstream tldr-pages submission denied pending community traction.\nKeep docs/retch.md and just tldr-release workflow maintained but\ndo not submit upstream until further notice.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add --weather-unit CLI flag\n\nWas wired through config but never added to the Cli struct.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:54:42-07:00",
          "tree_id": "2f9c12cc5e33db065dd02eb01cd157c8227985d1",
          "url": "https://github.com/l1a/retch/commit/400f31e6f99e05724137adc0e67d046233010752"
        },
        "date": 1782766916030,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 924423635.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1645.5135818198276,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.63393706359152,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.9158341849210396,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.96940638032285,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16076.435925158785,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 161087.87649486584,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11278.852041629047,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 11291.88774768086,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1294131.1987620245,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 283.8338449549122,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 218.96691589524053,
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
          "id": "dbfa98155bcaa5b4a0415343af370f5580c7bc69",
          "message": "Merge pull request #131 from l1a/feat/output-mode-strata\n\nfeat: add --full mode, restructure output strata (v0.3.31)",
          "timestamp": "2026-06-29T15:47:51-07:00",
          "tree_id": "387cdab8aa181c79bc2a9d112600cd183d385188",
          "url": "https://github.com/l1a/retch/commit/dbfa98155bcaa5b4a0415343af370f5580c7bc69"
        },
        "date": 1782773710209,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 976868139.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2024.7587596864705,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.59733599387583,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.803638748121389,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.645447876728284,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17812.7088001806,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 185663.1834764915,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12691.378232443054,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12718.196133620986,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1614892.8585680523,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 381.22908594397785,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 296.98306231332754,
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
          "id": "9f54423ddcf00725127f8a6939746d86d36aa426",
          "message": "chore: ignore memory/ directory\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-29T15:56:30-07:00",
          "tree_id": "77f45ad8edfdbec0879df29d0d4e640cbfc2c21c",
          "url": "https://github.com/l1a/retch/commit/9f54423ddcf00725127f8a6939746d86d36aa426"
        },
        "date": 1782774238090,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1052004128.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2072.6110126902895,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.661590293344105,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.855946146296107,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.39539004395003,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17895.61976260764,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 185759.61964091173,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12536.00316439192,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12711.647662475923,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1614141.0277981893,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 384.9060970796013,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 284.4695555888522,
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
          "id": "4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c",
          "message": "chore: merge AGENTS.md with etr, document just pr gate (#133)\n\n* chore: merge AGENTS.md with etr, document just pr gate\n\nRestructure AGENTS.md into a Portable Core (kept in sync with etr's\nAGENTS.md) plus project-specific rules. Add NOTES.md read/update\ndiscipline and Core Developer Guidelines adopted from etr, and\ndocument exactly what the existing just pr gate automates.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: add CLAUDE.md, require reading ~/AGENTS.md\n\nretch had no CLAUDE.md pointing agents at AGENTS.md; add one\n(relative link), matching the fixed version now in etr. Also add a\nGlobal Mandates item to the Portable Core requiring agents to read\n~/AGENTS.md before starting work, so cross-repo mandates aren't\nsilently skipped when only the repo AGENTS.md is consulted.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T11:59:32-07:00",
          "tree_id": "1a29b12394fae5b30b5d0d83a768c294938169ae",
          "url": "https://github.com/l1a/retch/commit/4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c"
        },
        "date": 1782932793054,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 691037403.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1997.9975785040485,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.60336874902471,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.876523807641028,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.644984723597034,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17681.61650412818,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 184710.12108122298,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12446.390551077027,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12635.277677689397,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1579072.5152828959,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 386.13798094804804,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 278.29324574672074,
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
          "id": "e6605afd7d4f8dbce3f984541177ffaffb57901b",
          "message": "fix: allow dependabot PRs to trigger claude-code-review (#134)\n\nclaude-code-action@v1 refuses to run for non-human actors by default,\nso every Dependabot PR (e.g. #132) hard-failed the claude-review\ncheck in ~10s before doing any actual review. Add\nallowed_bots: 'dependabot[bot]' scoped narrowly to Dependabot.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T12:19:47-07:00",
          "tree_id": "a345de40f93e702accd3928257b0d831789bd7c1",
          "url": "https://github.com/l1a/retch/commit/e6605afd7d4f8dbce3f984541177ffaffb57901b"
        },
        "date": 1782934039295,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 908580024.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1170.7997399614596,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 52.49754563674168,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.435522027307893,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.10507287884335,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8862.301544315515,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 83351.33400830967,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 56714.81275842657,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 56284.51890646509,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 2236577.878957037,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 474.3035842830841,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 310.36779174278206,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c732fa42bbf646eaedff5b0000c0f3a94793f64f",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#132)\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [clap_complete](https://github.com/clap-rs/clap) and [anyhow](https://github.com/dtolnay/anyhow).\n\n\nUpdates `clap_complete` from 4.6.5 to 4.6.7\n- [Release notes](https://github.com/clap-rs/clap/releases)\n- [Changelog](https://github.com/clap-rs/clap/blob/master/CHANGELOG.md)\n- [Commits](https://github.com/clap-rs/clap/compare/clap_complete-v4.6.5...clap_complete-v4.6.7)\n\nUpdates `anyhow` from 1.0.102 to 1.0.103\n- [Release notes](https://github.com/dtolnay/anyhow/releases)\n- [Commits](https://github.com/dtolnay/anyhow/compare/1.0.102...1.0.103)\n\n---\nupdated-dependencies:\n- dependency-name: anyhow\n  dependency-version: 1.0.103\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: clap_complete\n  dependency-version: 4.6.6\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-07-01T12:45:11-07:00",
          "tree_id": "f6c62954a19f2b176352837922b1b5d311baa1e8",
          "url": "https://github.com/l1a/retch/commit/c732fa42bbf646eaedff5b0000c0f3a94793f64f"
        },
        "date": 1782935549486,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 845929945.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2170.519230136452,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.135037046493565,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.099470771731166,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.42656121503014,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20721.730711202454,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 203543.11153434118,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14306.963862265018,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14470.5362489525,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1708488.1267246052,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.8743386724409,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 259.20461402647805,
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
          "id": "0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee",
          "message": "docs: add Development-Setup.md to wiki checklist (#135)\n\n* docs: add Development-Setup.md to wiki checklist\n\nIt was omitted from AGENTS.md Â§4.8 when the checklist was first\nwritten, even though it documents just recipes and was directly\naffected by the just pr/just merge-pr additions. Also caught up the\nwiki itself (done directly, outside this PR, since wiki edits aren't\ngated by review): documented just pr/merge-pr and fixed a stale\npandoc reference (Justfile/flake use mandown).\n\nAssisted-By: Claude Sonnet 5\n\n* docs: add Development-Setup.md to NOTES.md wiki list too\n\nSame gap as AGENTS.md \\u00a74.8, duplicated in NOTES.md \\u00a73's own\nwiki checklist.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T13:51:17-07:00",
          "tree_id": "48e3a31d893308fa4ca9065b2e39f8936f7d87f6",
          "url": "https://github.com/l1a/retch/commit/0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee"
        },
        "date": 1782939530066,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 868619694,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2174.076023320539,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.789457652921385,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.081909623859783,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.772460151999084,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20760.649976283923,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207757.0605510862,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14647.576176762232,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14676.19982390857,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1704647.5385763838,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.16363023478254,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.97893262289176,
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
          "id": "efde1f0505b401f804ea9e26c4968d6f1499ca8d",
          "message": "chore: untap aws/tap in macOS benchmark CI (cosmetic) (#136)\n\nThe macOS benchmark job surfaces \"aws/tap is not trusted\" Homebrew\nwarnings as Actions annotations on every run, caused by a\npre-installed tap on the GitHub-hosted macos-latest runner image\nthat's unrelated to installing fastfetch/hyperfine. Nothing was\nfailing â€” this just declutters the Actions summary.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T14:36:18-07:00",
          "tree_id": "e1067f42e582559f8bd96b6325d3d25a663aece1",
          "url": "https://github.com/l1a/retch/commit/efde1f0505b401f804ea9e26c4968d6f1499ca8d"
        },
        "date": 1782942204578,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 931369349.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1968.0963551104367,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.63136465222168,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.865885251168455,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.29797418545545,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17033.01560966431,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 180684.42450759356,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12088.041612656565,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12164.320264065089,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1596196.872941087,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 386.46694506702397,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 278.63209142397614,
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
          "id": "15176a3f82579e79a3b29d95a33a28f18bfc2bf9",
          "message": "feat: add btrfs and zpool storage fields (#137)\n\nAdds `btrfs` (label, subvolume, and used/allocated space per mount point,\nwith best-effort snapshot count) and `zpool` (ZFS pool allocation and\nhealth) fields, both gated behind --long and above. Closes the two\nStorage & Filesystems items in NOTES.md's fastfetch feature-gap list.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T15:30:08-07:00",
          "tree_id": "87ab581eee79770fe40b13279622d3b13a20f53c",
          "url": "https://github.com/l1a/retch/commit/15176a3f82579e79a3b29d95a33a28f18bfc2bf9"
        },
        "date": 1782945447750,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 756135725.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2098.480431797542,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.80654558379748,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.032391006193253,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.391079477765444,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20741.20456247294,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 207433.6840024862,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14507.172646952095,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14606.69359020587,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1713297.372483413,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 372.56310144315864,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 295.60331622604787,
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
          "id": "67c88b1988e92087607f45e6cd164467a3fd2db1",
          "message": "Show configured vs. rated memory speed on phys-mem (#138)\n\n* feat(sysinfo): show configured vs rated memory speed on Linux\n\ndmidecode's \"Configured Memory Speed\" is the module's actual running\nspeed, separate from \"Speed\" (rated max) â€” surfaces cases like\nXMP/EXPO not being enabled where RAM runs below spec.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: rename Memory display label to Memory Usage\n\nClarifies against the adjacent \"Phys Mem:\" line. The --fields/config\nkey \"memory\" is unchanged via an alias in should_show(), matching the\nexisting dns/\"DNS Server\" pattern.\n\nAssisted-By: Claude Sonnet 5\n\n* chore: add just open-pr as the sanctioned PR-opening entry point\n\ngh has no hook of its own to gate PR creation, so this recipe (just\npr's checklist, then gh pr create) is the one enforcement point that\nworks regardless of which tool is driving.\n\nAssisted-By: Claude Sonnet 5\n\n* docs: v0.3.38, agent-agnostic tooling mandate, memory speed docs\n\n- Bump retch-cli 0.3.38 / retch-sysinfo 0.1.33 (public DimmSlot field\n  addition), regenerate man page.\n- README/man page: document configured-vs-rated memory speed display.\n- NOTES.md: Current State header, v0.3.38 release log entry.\n- AGENTS.md: mandate reading chezmoi-manager skill in full before any\n  chezmoi command (prior incident caused git desync requiring\n  reverts); mandate recording learnings in AGENTS.md/SKILL.md rather\n  than agent-specific memory, so any agent benefits, not just one.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: open-pr recipe loses arg quoting without a shebang\n\njust's plain (non-shebang) recipe substitution joins *ARGS with bare\nspaces, so multi-word --title/--body values lost their quoting and\nbroke gh's flag parsing. A shebang recipe passes ARGS as real argv via\n\"$@\", preserving quoting correctly.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: set positional-arguments so open-pr's shebang script gets \\$@\n\nThe prior shebang fix alone wasn't enough -- without positional-arguments,\njust's shebang recipes don't receive *ARGS as real argv, so \"\\$@\" was\nempty. With it set, ARGS forward correctly through gh pr create.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-02T16:50:33-07:00",
          "tree_id": "e2969e45b48ba97220eb96078e8a686bd30d1fcc",
          "url": "https://github.com/l1a/retch/commit/67c88b1988e92087607f45e6cd164467a3fd2db1"
        },
        "date": 1783036672704,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1004345301.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2114.841908221565,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.0271839623489,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.88701416920167,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.61928862548653,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18388.482599810897,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190815.42974759726,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12922.746486153866,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 13078.14329708081,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1619073.1033943575,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 377.7392015226637,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 289.45917762867697,
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
          "id": "0e1c1784b9978fdff89b81f40496397a7becfb04",
          "message": "Bump crossbeam-epoch to clear RUSTSEC-2026-0204 (#140)\n\n* Bump crossbeam-epoch to clear RUSTSEC-2026-0204\n\ncargo audit flagged crossbeam-epoch 0.9.18 (RUSTSEC-2026-0204: invalid\npointer dereference in the fmt::Pointer impl for Atomic/Shared). Bump to\n0.9.20 (Cargo.lock only; transitive via rayon â†’ image/criterion). No\nmanifest or direct-dependency change.\n\nAssisted-By: Claude Opus 4.8\n\n* Add advisory cargo audit step to just pr gate\n\nThe pre-PR gate never ran cargo audit, so RUSTSEC-2026-0204 (crossbeam-\nepoch) only surfaced in CI. Add step 8 to `just pr`: install cargo-audit\nif missing, run it, print advisories. Advisory-only â€” it does not block\nthe gate, since advisories can be newly published against unchanged\ntransitive deps. Documented in AGENTS.md Â§4.0 and NOTES.md.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T09:25:18-07:00",
          "tree_id": "20c022c102ba6752d23ea9a6923616b6a5d9b58c",
          "url": "https://github.com/l1a/retch/commit/0e1c1784b9978fdff89b81f40496397a7becfb04"
        },
        "date": 1783701151449,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 691034077.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2074.2817001435283,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.27928457410724,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.882812270943265,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.0942342777944,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17944.708881649865,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 187011.0842109161,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12654.74924873198,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 12799.66095696626,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1605858.4532164643,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 354.62881615593653,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 276.3590343744975,
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
        "date": 1783702336266,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 273123923.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2249.913069750285,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.46851563083919,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.0303946436089255,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.09468487923694,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 21168.51233675154,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 211306.35660239734,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14738.750363488323,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14998.001560809498,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1682309.9838892047,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.47329820434925,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.11433347618475,
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
        "date": 1783732863766,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 739187522.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1761.911794816669,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.73194506310835,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.923147078365038,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.11455193006174,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16573.212457082875,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 165541.04124284137,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11517.21390457234,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 11640.911882124727,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1312999.9684736573,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 299.15853345275553,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 218.89758890664416,
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
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "d89aa928c05f9ff70640a355b7aa104df5933a86",
          "message": "docs: update NOTES for v0.3.23 release and nixpkgs PR\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T10:56:28-07:00",
          "tree_id": "4de75ab73dd70c0da1ffc10be9ba0f151bfd5c5f",
          "url": "https://github.com/l1a/retch/commit/d89aa928c05f9ff70640a355b7aa104df5933a86"
        },
        "date": 1782324655751,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1871045.28,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 335501171.68,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 341383749.325,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 992.8438037695975,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 48.402300046578,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946685654271392,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.27762328926486,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7705.435457541386,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69592.25134248465,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4700.971085321993,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4801.47939880515,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1193823.6886433915,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 340.88373059386663,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 246.69558089671347,
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
          "id": "cb511d8ada171c399172dfebc8bde41a8137148f",
          "message": "perf: fix chafa and nmcli performance bottlenecks\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T11:12:15-07:00",
          "tree_id": "73aa12c54edcd985c05025eaa5c69f7f525872d6",
          "url": "https://github.com/l1a/retch/commit/cb511d8ada171c399172dfebc8bde41a8137148f"
        },
        "date": 1782325540050,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1514009.48,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 319855168.68000007,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 314910549.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 986.4078962444652,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.686619568281046,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468069244056037,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.896481636972865,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7660.642626227968,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69491.06294598765,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4756.433622971841,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4859.984636277037,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1208250.0525363886,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 355.2346075350316,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 249.36760758034558,
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
          "id": "447f7796abf0b7810da7499a874504400076dfb6",
          "message": "Merge pull request #111 from l1a/fix/performance-regression\n\nperf: fix performance regression and align hyperfine mode comparisons",
          "timestamp": "2026-06-24T12:14:54-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/447f7796abf0b7810da7499a874504400076dfb6"
        },
        "date": 1782329346875,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 279678473.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 973.1849655819694,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.16488488634924,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946894639541277,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.336980411223564,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7758.160826115859,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70202.67583360845,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4744.038244054792,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4844.5575539404535,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1203795.7197142134,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 346.08451966117866,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.8659519640033,
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
          "id": "f38e23d53463405bbe973aa41c6ba9f794feabb9",
          "message": "chore: update checklists for version bump man pages\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:19:13-07:00",
          "tree_id": "75eec970de36474ac08d3746351c260f654e5e8b",
          "url": "https://github.com/l1a/retch/commit/f38e23d53463405bbe973aa41c6ba9f794feabb9"
        },
        "date": 1782329602420,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 306645914.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 975.7810335471531,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.61310752017196,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467889939139815,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.36492407572624,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7760.674476987566,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70766.5802694843,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4829.180145261978,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4899.902133379938,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1219566.6718639615,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 346.63614093785304,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.8489582473952,
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
          "id": "485da1be8ba30a6409d4220e303ee1380f4c8937",
          "message": "docs: document default set notes in NOTES\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:31:27-07:00",
          "tree_id": "ca4119acbfdfeee6b90c27723a146c8529d0cef2",
          "url": "https://github.com/l1a/retch/commit/485da1be8ba30a6409d4220e303ee1380f4c8937"
        },
        "date": 1782330718664,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 277457774.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 975.8288284064723,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.67101058535026,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469501861320784,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.320459007800984,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7860.649083890498,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71057.44918732531,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4794.805789446119,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4874.66687371053,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1219078.9344382533,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.9766560184008,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 259.1845278833508,
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
          "id": "04d2442f2ab2a46ae627bbe76af2e08ecec87220",
          "message": "Merge pull request #112 from l1a/feat/windows-phys-disk-mem\n\nfeat: implement Windows PhysDisk and PhysMem detection",
          "timestamp": "2026-06-24T22:33:30-07:00",
          "tree_id": "9c6c912cc8c4f04055290db2ab35fc64cc3e8675",
          "url": "https://github.com/l1a/retch/commit/04d2442f2ab2a46ae627bbe76af2e08ecec87220"
        },
        "date": 1782366438483,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 273121933.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 971.2247081702571,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.11469395823667,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470843615301185,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.33814197027326,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7707.560708100168,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70482.96563367316,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4739.096496677777,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4808.794208657235,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1223615.1677181567,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.3509809641964,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 257.37078255080706,
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
          "id": "cc924b5dc321850fda70d1fd023e08d3849a39e4",
          "message": "docs: update AGENTS.md last-updated footer to v0.3.25 (#113)\n\n* chore: add just nixpkgs-release automation script\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: update AGENTS.md last-updated footer to v0.3.25\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:12:53-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/cc924b5dc321850fda70d1fd023e08d3849a39e4"
        },
        "date": 1782419224551,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 347162034.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 970.9594477578397,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.15708183489415,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946693353877577,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.17343149724174,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7802.101228309909,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70211.03693258457,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4766.706328056478,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4830.010371610839,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1211650.2217917668,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.3997664987379,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 254.29001762690433,
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
          "id": "616ce0be9684e55037a517f1c5b4e646f9d395c1",
          "message": "chore: add just nixpkgs-release automation script (#114)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:14:18-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/616ce0be9684e55037a517f1c5b4e646f9d395c1"
        },
        "date": 1782419301775,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 355749450.575,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 969.2594259295229,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.15262815579065,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946617894043139,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.19354041913208,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7889.343017365063,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70277.94934604775,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4739.931477217535,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4842.212926090031,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1207642.2507097006,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.68761921644443,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 278.5914650076496,
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
          "id": "bf9f9116909d0291a83a77f97482debe1f6e4ec5",
          "message": "chore: add just nixpkgs-release automation script (#115)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:04:58-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/bf9f9116909d0291a83a77f97482debe1f6e4ec5"
        },
        "date": 1782573519008,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 329118264.575,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 981.8071166015812,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.376646375544325,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947758729976039,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.66048955771046,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7819.037989012492,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71034.71291899122,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4804.8164160938895,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4915.738890121068,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1212571.139902492,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.42996776313043,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 271.29821974029517,
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
          "id": "2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7",
          "message": "docs/ci: branch cleanup policy and skip CI on docs-only PRs (#116)\n\n* docs: document branch-deletion policy in AGENTS.md\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: skip Rust/Security/Packaging workflows on docs-only PRs\n\nAdd paths filters to pull_request triggers so the full CI matrix\ndoes not run when only docs, scripts, or config files change.\nPush-to-main continues to run unconditionally.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:29:33-07:00",
          "tree_id": "81fad1b28f95d6c6e1f50b3e961f2a81c7ea145d",
          "url": "https://github.com/l1a/retch/commit/2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7"
        },
        "date": 1782575008463,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 333925296.975,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 978.2181369405495,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.11665832456916,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946770585832902,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.16145509061486,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7876.249244152478,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70833.9190100583,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4791.807566694939,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4861.657856261328,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1201517.4425973152,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.2497125884946,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 286.45820788396213,
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
          "id": "ee330bee589f3cc23883fa67e627ad06b31d2d2b",
          "message": "fix: rebuild release binary if signal-killed on post-merge bench (#117)\n\nA Syncthing-synced binary compiled with target-cpu=native on a\ndifferent CPU microarchitecture crashes with SIGILL during sysinfo\ngathering. Cargo considers it up-to-date so `cargo build --release`\nis a no-op. Detect signal-killed exit (Python returncode < 0) and\nforce `cargo clean -p retch-cli && cargo build --release`.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:59:12-07:00",
          "tree_id": "13b71b071d9e5f31c3faa06d4aa51320377501b8",
          "url": "https://github.com/l1a/retch/commit/ee330bee589f3cc23883fa67e627ad06b31d2d2b"
        },
        "date": 1782576804181,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 326054113,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 970.5917382234514,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.17529647676109,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948297310065504,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.64847698326973,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7788.407493234925,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70282.71177034345,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4717.304516581965,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4814.440300880521,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1202577.707939057,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.5976552505018,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 248.7179024953719,
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
          "id": "9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f",
          "message": "feat: add just install-completions recipe (#118)\n\nGenerates and installs shell completions for bash, zsh, fish, elvish,\nnushell, and powershell to their correct XDG user locations. Also adds\nXDG path variables at the top of the Justfile and updates `just install`\nto depend on both install-man and install-completions.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:37:34-07:00",
          "tree_id": "d9c8234aa1d97872442e3e68b1a968f215f50f90",
          "url": "https://github.com/l1a/retch/commit/9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f"
        },
        "date": 1782579083461,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 273740592.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 974.6149155360487,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.72078853974671,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467868126806893,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.61903784920979,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7781.614741543152,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70484.55437917661,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4732.440111004668,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4833.233018797444,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1211629.208807294,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.91629068235375,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 257.1526739766763,
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
          "id": "71466e09694d76209fdf3bc02eef9cdfc6155c0d",
          "message": "docs: add performance regression vigilance guideline to AGENTS.md (#119)\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:53:59-07:00",
          "tree_id": "b6775fe68f3fa2aa0befa4fe2f722a2a1f15a8fe",
          "url": "https://github.com/l1a/retch/commit/71466e09694d76209fdf3bc02eef9cdfc6155c0d"
        },
        "date": 1782580060601,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 339227691.725,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 973.5058884062112,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.071271886093996,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946416161907464,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.11491213527239,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7776.584594540598,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70261.19759470742,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4743.90363475626,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4823.869099575279,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1210660.8802828267,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.19111866522013,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 284.05587611209927,
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
          "id": "d76a7d5246a051893671a84ed973b52bbe56e1b1",
          "message": "fix: skip FUSE and pseudo mounts in disk detection (#120)\n\n* fix: skip FUSE and pseudo mounts in disk detection\n\nsysinfo::Disks::new_with_refreshed_list() calls statvfs on every entry\nin /proc/mounts, including FUSE mounts that can block for hundreds of\nmilliseconds (e.g. cryfs vault: 613ms).\n\nOn Linux, replace sysinfo disk enumeration with a direct /proc/mounts\nreader that filters pseudo/FUSE filesystem types before calling statvfs.\nmacOS and Windows continue to use sysinfo::Disks unchanged.\n\nReduces disk field timing from ~634ms to ~2ms on affected machines.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: restore cross-platform deps moved to linux-only target by mistake\n\ndirs, chrono, anyhow, owo-colors, and rusqlite are used unconditionally\nacross macOS/Windows; only libc should be linux-only.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: mark is_skip_fs as linux-only to silence dead_code on macOS/Windows\n\nThe function is only called from detect_logical_linux which is already\ncfg-gated; clippy -D warnings caught it on the macOS CI job.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: make libc an unconditional dep to avoid lock file mismatch on AUR CI\n\nSome cargo versions handle cfg-gated deps in the lock file differently.\nlibc compiles on all platforms; the Linux-specific code that uses it is\nalready cfg-gated, so making it unconditional is safe.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:34:03-07:00",
          "tree_id": "1740235a0c0c2d66418ef5eac4e55c0e3132401a",
          "url": "https://github.com/l1a/retch/commit/d76a7d5246a051893671a84ed973b52bbe56e1b1"
        },
        "date": 1782582457189,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 314081073.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 986.6728384476967,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 55.54354062756897,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467837121402622,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.80376204544335,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7730.6215292796605,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70478.13333540675,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4743.604395410167,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4842.304721030106,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1189963.5929622445,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 340.06521886277585,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 295.79918668572043,
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
          "id": "7733084c8ee1c58721066fc0199ac3c4ec3b2f4d",
          "message": "chore: bump version to v0.3.26 (#121)\n\n* chore: bump version to v0.3.26\n\nFollows fix for FUSE mount statvfs hang (PR #120).\n\nAssisted-By: claude-sonnet-4-6\n\n* docs: add mandatory pre-PR gate checklist to AGENTS.md\n\nForces explicit per-item verification output before gh pr create so\nno version bump or doc step can be silently skipped.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:56:14-07:00",
          "tree_id": "68842ea99eb9a017711b6c72ef0f9687e864c5da",
          "url": "https://github.com/l1a/retch/commit/7733084c8ee1c58721066fc0199ac3c4ec3b2f4d"
        },
        "date": 1782583852773,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 275566793.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1043.9036443052332,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.01233629687516,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947013340908026,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.04366924572263,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7690.862887536027,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69978.65111965386,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4763.237386051339,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4831.001860808456,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1208970.0746024735,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 342.45753934708574,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.9969802167414,
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
          "id": "79e4de519e6b7bc2f4ce2f6df351d62e41c05b26",
          "message": "feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields (#122)\n\n* feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields\n\nCloses six items from the fastfetch feature gap list:\n\n- Chassis: DMI chassis_type â†’ human label on Linux; hw.model inference on macOS\n- Init: /proc/1/comm on Linux; static \"launchd\"/\"SCM\" on macOS/Windows\n- Locale: $LC_ALL â†’ $LC_MESSAGES â†’ $LANG\n- Bootmgr: checks /boot/loader, /boot/grub2, /boot/grub, /sys/firmware/efi on Linux\n- Editor: $VISUAL â†’ $EDITOR\n- Weather: curl wttr.in/?format=3 (long mode only, 3s timeout)\n\nChassis/Init/Locale/Bootmgr/Editor added to the default output set.\nWeather is long-only to avoid adding a network call to standard runs.\n\nAlso moves the feature gap tracking list from AGENTS.md to NOTES.md â€”\nit is project state, not a standing instruction.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add weather_location config key\n\nUsers can now set `weather_location` in config.toml to pin the weather\nfield to a specific city name, ZIP code, airport IATA code, or lat/lon\ncoordinates â€” all formats supported natively by wttr.in. Without the\nkey, location is auto-detected from the requester's IP as before.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: complete --generate-config output\n\nAdded missing logo key, weather_location key, and updated the fields\nexample to include all current fields (chassis, init, locale, bootmgr,\neditor, weather, phys-mem, phys-disk, cpu-cache, cpu-usage, etc.).\nAlso synced DEFAULT_FIELDS_BLOCK in config.rs to match.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add --weather-location CLI flag\n\nAllows specifying weather location on the command line, overriding the\nconfig file's weather_location setting.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: URL-encode weather location and handle unknown locations\n\nSpaces and commas in location strings (e.g. \"Thousand Oaks, CA\") were\nnot encoded, breaking the URL. Now encodes spaces as + and commas as\n%2C before inserting into the wttr.in URL path.\n\nAdded -f to curl so HTTP 4xx/5xx (unknown location) causes a non-zero\nexit and the Weather field is silently omitted rather than showing the\nwttr.in error text.\n\nAdded url_encode_location unit tests.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: show error when explicit weather location is not found\n\nInstead of silently omitting the Weather field, display\n'Unknown location: \"<name>\"' when the user set a location\nexplicitly but wttr.in can't resolve it. Auto-detect failures\n(no location set) remain silent.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: update tests and benchmark for weather_location field\n\nAdded weather_location to config test fixtures and CollectOptions\ninitializer in benchmarks.rs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump version to v0.3.27, update docs and README\n\n- Bump retch-cli to 0.3.27, retch-sysinfo to 0.1.27\n- Bump AGENTS.md Current State header to v0.3.27\n- README: add weather_location config key, update fields example with\n  all new fields (chassis, init, locale, bootmgr, editor, weather)\n- docs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add just pr pre-PR gate recipe\n\nAutomates the pre-PR checklist so it can't be skipped:\n- Checks feature branch (not main)\n- Checks version bumped past last tag\n- Checks AGENTS.md Current State header matches version\n- Regenerates man page and fails if result is uncommitted\n- Runs cargo check and fails if Cargo.lock is uncommitted\n- Runs just check (fmt + clippy)\n- Runs cargo test\n- Prints manual checklist (README, release log, wiki) and requires\n  explicit 'y' confirmation before exiting 0\n\nUpdates AGENTS.md pre-PR gate instruction to reference just pr.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: move Chassis, Init, Locale, Bootmgr, Editor to long-only output\n\nThese fields are too verbose for the default view. They now appear\nonly in --long mode, alongside Weather.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: disable nixpkgs verification job\n\nnixpkgs PR was declined due to lack of popularity. No point running\nthe slow Nix build until we meet the popularity threshold. Re-enable\nby removing the `if: false` condition.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-28T08:32:51-07:00",
          "tree_id": "d40cb87dbb3673839a3b79e597cda6b56ae3e97f",
          "url": "https://github.com/l1a/retch/commit/79e4de519e6b7bc2f4ce2f6df351d62e41c05b26"
        },
        "date": 1782661629380,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 783832317.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 980.1240742379175,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.34265504613527,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468795234462366,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.076484724560395,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7738.555213759753,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70592.78239709022,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4753.847028112189,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4837.650301099124,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1189700.4771029653,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 346.2403857169301,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 282.32393455322944,
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
          "id": "770e0b0eabf6d60a1fecc1982117f738c3899fc0",
          "message": "feature/add tldr (#123)\n\n* docs: add tldr page entry for retch\n\nAssisted-By: Gemini 3.5 Flash\n\n* chore: add tldr page to pre-pr checklist\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add tldr-release automation script and recipes\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add merge-pr recipe and reset_wip script\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:28:45-07:00",
          "tree_id": "c1f8fdf58502f0ab22c57e17c25bcbd3feda49dd",
          "url": "https://github.com/l1a/retch/commit/770e0b0eabf6d60a1fecc1982117f738c3899fc0"
        },
        "date": 1782665009619,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 665126722.05,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 977.9887830993014,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.84761706616947,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469022586140157,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.42559881303144,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7780.2985963861165,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69738.09714092566,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4708.4601648815105,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4843.205132544804,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1190901.3230882038,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.66097113508033,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.4801925795095,
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
          "id": "b8d3f6ea87cf396f449249595ed4d787aa2bb2fe",
          "message": "fix: ignore already deleted branch error in merge-pr recipe (#124)\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:34:40-07:00",
          "tree_id": "c9c370af106069b537c4019e66afc44f31927e26",
          "url": "https://github.com/l1a/retch/commit/b8d3f6ea87cf396f449249595ed4d787aa2bb2fe"
        },
        "date": 1782665358453,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 676485013.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 990.3715050509594,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.64072529801898,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9475662493647037,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.28882278420002,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7794.308048594918,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69980.7289235701,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4759.972836707052,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4816.999305410873,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1200817.5140834912,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.6762618756185,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 281.1175474587567,
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
          "id": "d13f2fe0da7a898a1ebbd9c412284e5d02a0651e",
          "message": "chore/refactor docs (#125)\n\n* docs: refactor documentation structure\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: fix Current State header formatting\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:54:34-07:00",
          "tree_id": "aaa002e02169e3c871a1373946d09700c6002e90",
          "url": "https://github.com/l1a/retch/commit/d13f2fe0da7a898a1ebbd9c412284e5d02a0651e"
        },
        "date": 1782666544235,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 780244696.5,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 975.3361102146937,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.64891014246247,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946637256835657,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.312028566536,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7734.310821072519,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70209.28830158304,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4744.8507931263575,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4842.220244281033,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1205632.0503113703,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 351.2218869667364,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 276.9578208148975,
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
          "id": "0bc5e587df1dee945e8b33182694531b28affdb9",
          "message": "Merge pull request #126 from l1a/fix/tldr-auth-bypass\n\nfix: resolve gh auth and fork directory issues in tldr release script",
          "timestamp": "2026-06-28T19:15:24-07:00",
          "tree_id": "41349673c84e317f53711dc893f4ebf44ab425c3",
          "url": "https://github.com/l1a/retch/commit/0bc5e587df1dee945e8b33182694531b28affdb9"
        },
        "date": 1782700150038,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 753129734.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 973.841542743063,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.92927815811025,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468044442793486,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.51180799308629,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7807.446903858954,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70893.0760126401,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4795.259814397558,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4888.818864314423,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1200508.8052362725,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 351.4420417188352,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 282.9567440932593,
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
          "id": "b61db1f0a08f4d023930e0231b61079b17d4dc75",
          "message": "Merge pull request #127 from l1a/fix/tldr-page-format\n\nfix: fix tldr page lint errors",
          "timestamp": "2026-06-28T19:35:48-07:00",
          "tree_id": "80701731a659a4af0387474cc7517b7f36d10c32",
          "url": "https://github.com/l1a/retch/commit/b61db1f0a08f4d023930e0231b61079b17d4dc75"
        },
        "date": 1782701421570,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 811758860.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 979.3962009976005,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.7510503271479,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468732787620944,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.21368670504921,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7772.38669078847,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70403.53120856345,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4772.454330725524,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4858.730535271286,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1203604.132637081,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.719225750135,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.15946638834697,
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
          "id": "1094ac231ae3237ed49464785b01c00c96026b20",
          "message": "feat: add TerminalSize, DNS, WM fields; fix Shell detection (v0.3.29) (#128)\n\n* feat: add TerminalSize, DNS, WM fields; fix Shell detection\n\n- TerminalSize: ioctl(TIOCGWINSZ) on Linux/macOS, $COLUMNS/$LINES fallback\n- DNS: parse /etc/resolv.conf nameserver lines; PowerShell on Windows\n- WM: scan /proc for compositor/WM process names; suppressed in output\n  when identical to Desktop field (case-insensitive)\n- Shell: walk process tree first to find running shell; fall back to\n  $SHELL (login shell) only when scan yields nothing\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: improve Desktop detection when XDG env vars are absent\n\nAdd XDG_SESSION_DESKTOP and GDMSESSION as fallbacks, normalize\nDE names to canonical casing, and probe /proc as a last resort\n(e.g. gnome-shell â†’ GNOME) for terminals that don't inherit the\nfull session environment.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add non-Linux stub for detect_desktop_from_proc\n\nSatisfies clippy::unnecessary_lazy_evaluations (Rust 1.96+):\nreplace inline cfg closure with .or_else(detect_desktop_from_proc)\nand add a #[cfg(not(target_os = \"linux\"))] stub returning None.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: suppress logo when stdout is not a tty\n\nUse std::io::IsTerminal::is_terminal() instead of terminal_size()\nto detect piped output. terminal_size() returns Some() when a pager\nlike bat allocates a PTY, causing the logo to print as raw escape\nsequences.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+tests: update for v0.3.29 PR changes\n\n- docs/retch.1.md + retch.1: note logo tty-suppression in LOGOS section\n- README.md: add auto-suppressed-when-piped bullet to Logo Rendering Modes\n- NOTES.md: bump Current State to v0.3.29; add Desktop fix, logo tty\n  suppression, and logo cursor placement to release entry; remove DNS,\n  WM, TerminalSize from feature gap list\n- tests/cli_tests.rs: add tests for --fields dns/wm/terminal-size and\n  piped output containing no graphical logo escape sequences\n- fetch.rs: add unit tests for normalize_desktop_name,\n  detect_desktop_from_proc, and title-case/whitespace edge cases\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T12:30:38-07:00",
          "tree_id": "47d929d6f83cb36e994b9821fee1a649e882b21c",
          "url": "https://github.com/l1a/retch/commit/1094ac231ae3237ed49464785b01c00c96026b20"
        },
        "date": 1782762256217,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 636214158.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1001.0115213291526,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 52.829657734927665,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468737217017287,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.226909243876975,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7784.400054977096,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71103.07699109055,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4723.598231417405,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4817.995554998182,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1195782.3139283988,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 359.3527464494697,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.6855691323639,
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
          "id": "1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a",
          "message": "fix: advance cursor past graphical logo bottom edge (#129)\n\nWhen the info field list is shorter than the logo height, the shell\nprompt was drawn on top of the logo. Fix by computing the logo's\nheight in terminal rows (image px height / cell px height via\nTIOCGWINSZ, with 20px fallback) and emitting CSI B after restoring\nthe cursor to push past the logo's bottom edge.\n\nAdds libc as a unix-only direct dep for TIOCGWINSZ.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:00:36-07:00",
          "tree_id": "f9622416d510a495b2af1a31b6b9c7e6b12f477e",
          "url": "https://github.com/l1a/retch/commit/1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a"
        },
        "date": 1782764105976,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 850786680.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 992.3848901962435,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.05982395269111,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9464254238003336,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.07082435915229,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7741.301942248096,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70680.27657372502,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4727.524989585114,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4834.60457501664,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1277305.302259552,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 358.763250897084,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.13662215372375,
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
          "id": "400f31e6f99e05724137adc0e67d046233010752",
          "message": "feat: switch weather backend to Open-Meteo (v0.3.30) (#130)\n\n* feat: switch weather to Open-Meteo + ipinfo.io\n\nReplace wttr.in (World Weather Online backend) with:\n- Open-Meteo for temperature/WMO weather code (geocoding API + forecast API)\n- ipinfo.io for IP-based auto-location fallback\n\nAdds `weather_unit` config/CLI option (\"fahrenheit\"/\"celsius\").\nWMO weather codes are mapped to emojis.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+test: improve weather.rs coverage and docs\n\n- Doc comments on detect_weather, curl_get, wmo_to_emoji, WeatherUnit variants\n- Expand wmo_to_emoji test to cover all major WMO code ranges + fallback\n- Add parse_coords edge cases: spaces around comma, out-of-range lat/lon\n- Add geolocate_ip display-name tests (US, non-US, no-city) without network\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.30, update docs and man page\n\nVersion: 0.3.29 â†’ 0.3.30 / retch-sysinfo 0.1.29 â†’ 0.1.30\nNOTES.md: Current State header + v0.3.30 release log entry\nREADME.md: fix weather config comment, add weather_unit key\ndocs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add weather-location to tldr page\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: note tldr upstream submission on hold\n\nUpstream tldr-pages submission denied pending community traction.\nKeep docs/retch.md and just tldr-release workflow maintained but\ndo not submit upstream until further notice.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add --weather-unit CLI flag\n\nWas wired through config but never added to the Cli struct.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:54:42-07:00",
          "tree_id": "2f9c12cc5e33db065dd02eb01cd157c8227985d1",
          "url": "https://github.com/l1a/retch/commit/400f31e6f99e05724137adc0e67d046233010752"
        },
        "date": 1782767355296,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 770583217.95,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 985.3681724072634,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 53.69768598251055,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946911158404543,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.70117718718131,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7764.449519094017,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71351.03987339739,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4806.373199737905,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4875.113844244357,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1218749.4278239955,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 358.2755853383892,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.37675797655777,
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
          "id": "dbfa98155bcaa5b4a0415343af370f5580c7bc69",
          "message": "Merge pull request #131 from l1a/feat/output-mode-strata\n\nfeat: add --full mode, restructure output strata (v0.3.31)",
          "timestamp": "2026-06-29T15:47:51-07:00",
          "tree_id": "387cdab8aa181c79bc2a9d112600cd183d385188",
          "url": "https://github.com/l1a/retch/commit/dbfa98155bcaa5b4a0415343af370f5580c7bc69"
        },
        "date": 1782774124489,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 905618704.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 974.7034842874916,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 48.02471635244482,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946565884975487,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.99585376979937,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7724.380233445462,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70437.97500655249,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4723.609905282734,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4801.500851876671,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1222981.1251408004,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.9747655702774,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.2367513517805,
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
          "id": "9f54423ddcf00725127f8a6939746d86d36aa426",
          "message": "chore: ignore memory/ directory\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-29T15:56:30-07:00",
          "tree_id": "77f45ad8edfdbec0879df29d0d4e640cbfc2c21c",
          "url": "https://github.com/l1a/retch/commit/9f54423ddcf00725127f8a6939746d86d36aa426"
        },
        "date": 1782774645757,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 914614267.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 971.3501963356587,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.895073590125506,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946759184768442,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.943596057807866,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7766.3460641362135,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70432.6709750387,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4721.9064412401585,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4807.590705773264,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1220656.123305726,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.3974489451918,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.338597377798,
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
          "id": "4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c",
          "message": "chore: merge AGENTS.md with etr, document just pr gate (#133)\n\n* chore: merge AGENTS.md with etr, document just pr gate\n\nRestructure AGENTS.md into a Portable Core (kept in sync with etr's\nAGENTS.md) plus project-specific rules. Add NOTES.md read/update\ndiscipline and Core Developer Guidelines adopted from etr, and\ndocument exactly what the existing just pr gate automates.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: add CLAUDE.md, require reading ~/AGENTS.md\n\nretch had no CLAUDE.md pointing agents at AGENTS.md; add one\n(relative link), matching the fixed version now in etr. Also add a\nGlobal Mandates item to the Portable Core requiring agents to read\n~/AGENTS.md before starting work, so cross-repo mandates aren't\nsilently skipped when only the repo AGENTS.md is consulted.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T11:59:32-07:00",
          "tree_id": "1a29b12394fae5b30b5d0d83a768c294938169ae",
          "url": "https://github.com/l1a/retch/commit/4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c"
        },
        "date": 1782933202907,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 967129579.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 961.4795885301152,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.87208008495971,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946880230375858,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.69739664936378,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7720.599279349311,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70133.39730407568,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4767.475456315029,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4851.266481077301,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1198059.8106074226,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 342.6713498244847,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.6850846673201,
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
          "id": "e6605afd7d4f8dbce3f984541177ffaffb57901b",
          "message": "fix: allow dependabot PRs to trigger claude-code-review (#134)\n\nclaude-code-action@v1 refuses to run for non-human actors by default,\nso every Dependabot PR (e.g. #132) hard-failed the claude-review\ncheck in ~10s before doing any actual review. Add\nallowed_bots: 'dependabot[bot]' scoped narrowly to Dependabot.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T12:19:47-07:00",
          "tree_id": "a345de40f93e702accd3928257b0d831789bd7c1",
          "url": "https://github.com/l1a/retch/commit/e6605afd7d4f8dbce3f984541177ffaffb57901b"
        },
        "date": 1782934442718,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 788117853.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 970.4454847790128,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.31849826368894,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467851313503326,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.1446101105375,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7744.057265875538,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70574.52145955942,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4746.998816736397,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4812.740042414984,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1199041.179513711,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.53734204219984,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 246.8768643563491,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c732fa42bbf646eaedff5b0000c0f3a94793f64f",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#132)\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [clap_complete](https://github.com/clap-rs/clap) and [anyhow](https://github.com/dtolnay/anyhow).\n\n\nUpdates `clap_complete` from 4.6.5 to 4.6.7\n- [Release notes](https://github.com/clap-rs/clap/releases)\n- [Changelog](https://github.com/clap-rs/clap/blob/master/CHANGELOG.md)\n- [Commits](https://github.com/clap-rs/clap/compare/clap_complete-v4.6.5...clap_complete-v4.6.7)\n\nUpdates `anyhow` from 1.0.102 to 1.0.103\n- [Release notes](https://github.com/dtolnay/anyhow/releases)\n- [Commits](https://github.com/dtolnay/anyhow/compare/1.0.102...1.0.103)\n\n---\nupdated-dependencies:\n- dependency-name: anyhow\n  dependency-version: 1.0.103\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: clap_complete\n  dependency-version: 4.6.6\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-07-01T12:45:11-07:00",
          "tree_id": "f6c62954a19f2b176352837922b1b5d311baa1e8",
          "url": "https://github.com/l1a/retch/commit/c732fa42bbf646eaedff5b0000c0f3a94793f64f"
        },
        "date": 1782935948815,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 894989369.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 966.4621446985186,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.281676739817556,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9463866415698776,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.17294055607145,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7729.115561098649,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71322.66490679297,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4758.7551102152665,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4832.643716994004,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1211602.4741953074,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.19543050328474,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 267.90440577557285,
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
          "id": "0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee",
          "message": "docs: add Development-Setup.md to wiki checklist (#135)\n\n* docs: add Development-Setup.md to wiki checklist\n\nIt was omitted from AGENTS.md Â§4.8 when the checklist was first\nwritten, even though it documents just recipes and was directly\naffected by the just pr/just merge-pr additions. Also caught up the\nwiki itself (done directly, outside this PR, since wiki edits aren't\ngated by review): documented just pr/merge-pr and fixed a stale\npandoc reference (Justfile/flake use mandown).\n\nAssisted-By: Claude Sonnet 5\n\n* docs: add Development-Setup.md to NOTES.md wiki list too\n\nSame gap as AGENTS.md \\u00a74.8, duplicated in NOTES.md \\u00a73's own\nwiki checklist.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T13:51:17-07:00",
          "tree_id": "48e3a31d893308fa4ca9065b2e39f8936f7d87f6",
          "url": "https://github.com/l1a/retch/commit/0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee"
        },
        "date": 1782939947072,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1065829993.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 968.6408179930716,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.431572303714944,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469943493870785,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.36635039025972,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7750.679229412568,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70762.43442058776,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4744.311461123967,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4808.169670988629,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1219924.4639450433,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.602298137056,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 273.31821858773026,
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
          "id": "efde1f0505b401f804ea9e26c4968d6f1499ca8d",
          "message": "chore: untap aws/tap in macOS benchmark CI (cosmetic) (#136)\n\nThe macOS benchmark job surfaces \"aws/tap is not trusted\" Homebrew\nwarnings as Actions annotations on every run, caused by a\npre-installed tap on the GitHub-hosted macos-latest runner image\nthat's unrelated to installing fastfetch/hyperfine. Nothing was\nfailing â€” this just declutters the Actions summary.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T14:36:18-07:00",
          "tree_id": "e1067f42e582559f8bd96b6325d3d25a663aece1",
          "url": "https://github.com/l1a/retch/commit/efde1f0505b401f804ea9e26c4968d6f1499ca8d"
        },
        "date": 1782942608143,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 769489376.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 975.358596237905,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.77245579391352,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468124656418713,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.17770473764845,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7720.163502687133,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70266.91936429506,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4727.32689120791,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4799.518409765866,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1205819.0358580374,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 341.0408717665291,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 267.0777943550966,
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
          "id": "15176a3f82579e79a3b29d95a33a28f18bfc2bf9",
          "message": "feat: add btrfs and zpool storage fields (#137)\n\nAdds `btrfs` (label, subvolume, and used/allocated space per mount point,\nwith best-effort snapshot count) and `zpool` (ZFS pool allocation and\nhealth) fields, both gated behind --long and above. Closes the two\nStorage & Filesystems items in NOTES.md's fastfetch feature-gap list.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T15:30:08-07:00",
          "tree_id": "87ab581eee79770fe40b13279622d3b13a20f53c",
          "url": "https://github.com/l1a/retch/commit/15176a3f82579e79a3b29d95a33a28f18bfc2bf9"
        },
        "date": 1782945907148,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 4326764802.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 959.0460615293053,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 45.62708599937059,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946751606956222,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.55984876415228,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7676.1625593118415,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69568.24114943732,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4746.585048058293,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4817.968579869709,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1193665.0037720879,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.6252360377722,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.9398957122602,
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
          "id": "67c88b1988e92087607f45e6cd164467a3fd2db1",
          "message": "Show configured vs. rated memory speed on phys-mem (#138)\n\n* feat(sysinfo): show configured vs rated memory speed on Linux\n\ndmidecode's \"Configured Memory Speed\" is the module's actual running\nspeed, separate from \"Speed\" (rated max) â€” surfaces cases like\nXMP/EXPO not being enabled where RAM runs below spec.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: rename Memory display label to Memory Usage\n\nClarifies against the adjacent \"Phys Mem:\" line. The --fields/config\nkey \"memory\" is unchanged via an alias in should_show(), matching the\nexisting dns/\"DNS Server\" pattern.\n\nAssisted-By: Claude Sonnet 5\n\n* chore: add just open-pr as the sanctioned PR-opening entry point\n\ngh has no hook of its own to gate PR creation, so this recipe (just\npr's checklist, then gh pr create) is the one enforcement point that\nworks regardless of which tool is driving.\n\nAssisted-By: Claude Sonnet 5\n\n* docs: v0.3.38, agent-agnostic tooling mandate, memory speed docs\n\n- Bump retch-cli 0.3.38 / retch-sysinfo 0.1.33 (public DimmSlot field\n  addition), regenerate man page.\n- README/man page: document configured-vs-rated memory speed display.\n- NOTES.md: Current State header, v0.3.38 release log entry.\n- AGENTS.md: mandate reading chezmoi-manager skill in full before any\n  chezmoi command (prior incident caused git desync requiring\n  reverts); mandate recording learnings in AGENTS.md/SKILL.md rather\n  than agent-specific memory, so any agent benefits, not just one.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: open-pr recipe loses arg quoting without a shebang\n\njust's plain (non-shebang) recipe substitution joins *ARGS with bare\nspaces, so multi-word --title/--body values lost their quoting and\nbroke gh's flag parsing. A shebang recipe passes ARGS as real argv via\n\"$@\", preserving quoting correctly.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: set positional-arguments so open-pr's shebang script gets \\$@\n\nThe prior shebang fix alone wasn't enough -- without positional-arguments,\njust's shebang recipes don't receive *ARGS as real argv, so \"\\$@\" was\nempty. With it set, ARGS forward correctly through gh pr create.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-02T16:50:33-07:00",
          "tree_id": "e2969e45b48ba97220eb96078e8a686bd30d1fcc",
          "url": "https://github.com/l1a/retch/commit/67c88b1988e92087607f45e6cd164467a3fd2db1"
        },
        "date": 1783037100014,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1138293531.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 964.9048868484157,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.18562557845829,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467803121778355,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 54.35447530943892,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7798.593824063847,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71018.55473465992,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4782.684673311319,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4838.71043458228,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1183688.4475075311,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 337.4431127236739,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.54243803549406,
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
          "id": "0e1c1784b9978fdff89b81f40496397a7becfb04",
          "message": "Bump crossbeam-epoch to clear RUSTSEC-2026-0204 (#140)\n\n* Bump crossbeam-epoch to clear RUSTSEC-2026-0204\n\ncargo audit flagged crossbeam-epoch 0.9.18 (RUSTSEC-2026-0204: invalid\npointer dereference in the fmt::Pointer impl for Atomic/Shared). Bump to\n0.9.20 (Cargo.lock only; transitive via rayon â†’ image/criterion). No\nmanifest or direct-dependency change.\n\nAssisted-By: Claude Opus 4.8\n\n* Add advisory cargo audit step to just pr gate\n\nThe pre-PR gate never ran cargo audit, so RUSTSEC-2026-0204 (crossbeam-\nepoch) only surfaced in CI. Add step 8 to `just pr`: install cargo-audit\nif missing, run it, print advisories. Advisory-only â€” it does not block\nthe gate, since advisories can be newly published against unchanged\ntransitive deps. Documented in AGENTS.md Â§4.0 and NOTES.md.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T09:25:18-07:00",
          "tree_id": "20c022c102ba6752d23ea9a6923616b6a5d9b58c",
          "url": "https://github.com/l1a/retch/commit/0e1c1784b9978fdff89b81f40496397a7becfb04"
        },
        "date": 1783701580205,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1097716306.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1003.9012386693121,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 49.23786674450595,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946991672611568,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.12523114012125,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7822.78498982699,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71693.74462607686,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4856.478563607949,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4970.448576500732,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1283192.9794208074,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 337.12676387518775,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.01336402028926,
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
        "date": 1783702769923,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1030796708.65,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 991.6084675493814,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.729479904071084,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469135647821867,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.54776811754044,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7848.639923057895,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71224.81259729821,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4811.866914535419,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4874.156239183751,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1215438.5660559712,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 337.14358901882326,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 282.5890139233291,
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
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "d89aa928c05f9ff70640a355b7aa104df5933a86",
          "message": "docs: update NOTES for v0.3.23 release and nixpkgs PR\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T10:56:28-07:00",
          "tree_id": "4de75ab73dd70c0da1ffc10be9ba0f151bfd5c5f",
          "url": "https://github.com/l1a/retch/commit/d89aa928c05f9ff70640a355b7aa104df5933a86"
        },
        "date": 1782324961387,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 22937344.12,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 783473894.22,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 705724958.4,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 350.4902061907593,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 71.34842424156469,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6545359630059089,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.573370549734136,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4074.854359203497,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 977.0743976806174,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 386.2468083386995,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63834.51111837911,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 324.20975302781824,
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
          "id": "cb511d8ada171c399172dfebc8bde41a8137148f",
          "message": "perf: fix chafa and nmcli performance bottlenecks\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T11:12:15-07:00",
          "tree_id": "73aa12c54edcd985c05025eaa5c69f7f525872d6",
          "url": "https://github.com/l1a/retch/commit/cb511d8ada171c399172dfebc8bde41a8137148f"
        },
        "date": 1782325910100,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 21413678.52,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 693508541.2200001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 613133014.55,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 350.91508543304815,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.93914797355554,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6845412267950164,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.751401710656,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5142.174697393957,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1257.861317446978,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 385.3526741698896,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 69410.23032402141,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 363.1539320461909,
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
          "id": "447f7796abf0b7810da7499a874504400076dfb6",
          "message": "Merge pull request #111 from l1a/fix/performance-regression\n\nperf: fix performance regression and align hyperfine mode comparisons",
          "timestamp": "2026-06-24T12:14:54-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/447f7796abf0b7810da7499a874504400076dfb6"
        },
        "date": 1782329693708,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 751054791.7,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 433.596794107278,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 80.29001647965403,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.2489857066509527,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.92173591998898,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6282.74249748275,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1702.3677635017516,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 444.0235277623909,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 97201.22439008334,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 436.4236937237285,
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
          "id": "f38e23d53463405bbe973aa41c6ba9f794feabb9",
          "message": "chore: update checklists for version bump man pages\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:19:13-07:00",
          "tree_id": "75eec970de36474ac08d3746351c260f654e5e8b",
          "url": "https://github.com/l1a/retch/commit/f38e23d53463405bbe973aa41c6ba9f794feabb9"
        },
        "date": 1782330028058,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 826890593.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 468.0251068507735,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 91.36615943808704,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.630686718599269,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 86.6673517425179,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6691.170798456924,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1624.1864999836223,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 511.7726158282386,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 127011.28017764553,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 472.95675919079974,
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
          "id": "485da1be8ba30a6409d4220e303ee1380f4c8937",
          "message": "docs: document default set notes in NOTES\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:31:27-07:00",
          "tree_id": "ca4119acbfdfeee6b90c27723a146c8529d0cef2",
          "url": "https://github.com/l1a/retch/commit/485da1be8ba30a6409d4220e303ee1380f4c8937"
        },
        "date": 1782331106136,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1292405916.65,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 359.1535732415094,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 65.32469433038106,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8379946321716552,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 69.295672515174,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5394.412905814112,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1328.1087743821934,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 411.1559086474466,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 84804.5987174111,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 373.2432203887281,
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
          "id": "04d2442f2ab2a46ae627bbe76af2e08ecec87220",
          "message": "Merge pull request #112 from l1a/feat/windows-phys-disk-mem\n\nfeat: implement Windows PhysDisk and PhysMem detection",
          "timestamp": "2026-06-24T22:33:30-07:00",
          "tree_id": "9c6c912cc8c4f04055290db2ab35fc64cc3e8675",
          "url": "https://github.com/l1a/retch/commit/04d2442f2ab2a46ae627bbe76af2e08ecec87220"
        },
        "date": 1782366788620,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 747424608.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 357.7635578026438,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 77.63812687135385,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7737938910047095,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.708050799612394,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4484.698302220454,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1088.1020046202912,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 414.1833570867608,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 76763.14113704357,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 348.68300671936674,
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
          "id": "616ce0be9684e55037a517f1c5b4e646f9d395c1",
          "message": "chore: add just nixpkgs-release automation script (#114)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:14:18-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/616ce0be9684e55037a517f1c5b4e646f9d395c1"
        },
        "date": 1782419659430,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 741013479.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 378.438225437826,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 75.93892505121701,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.1583495469544256,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 72.52047397686665,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6872.7359406511605,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 2190.50320233659,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 439.6468661270151,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 110618.91967637939,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 364.52268131227834,
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
          "id": "cc924b5dc321850fda70d1fd023e08d3849a39e4",
          "message": "docs: update AGENTS.md last-updated footer to v0.3.25 (#113)\n\n* chore: add just nixpkgs-release automation script\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: update AGENTS.md last-updated footer to v0.3.25\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:12:53-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/cc924b5dc321850fda70d1fd023e08d3849a39e4"
        },
        "date": 1782419671400,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1194815227.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 479.9765139203424,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.59931810745051,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.8318913655317712,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 89.51128929327089,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5842.072230160813,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1521.5321576673314,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 429.31790582513247,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 115866.37805989853,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 458.48928323412775,
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
          "id": "bf9f9116909d0291a83a77f97482debe1f6e4ec5",
          "message": "chore: add just nixpkgs-release automation script (#115)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:04:58-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/bf9f9116909d0291a83a77f97482debe1f6e4ec5"
        },
        "date": 1782573858128,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 693115991.7,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 334.4869188894123,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.439383308502315,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6643929666106665,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.28471551179884,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4057.0818251797527,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 975.2822751823527,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 386.15024054455864,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63574.98199173827,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 322.31402895444654,
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
          "id": "2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7",
          "message": "docs/ci: branch cleanup policy and skip CI on docs-only PRs (#116)\n\n* docs: document branch-deletion policy in AGENTS.md\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: skip Rust/Security/Packaging workflows on docs-only PRs\n\nAdd paths filters to pull_request triggers so the full CI matrix\ndoes not run when only docs, scripts, or config files change.\nPush-to-main continues to run unconditionally.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:29:33-07:00",
          "tree_id": "81fad1b28f95d6c6e1f50b3e961f2a81c7ea145d",
          "url": "https://github.com/l1a/retch/commit/2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7"
        },
        "date": 1782575367410,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 741785127,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 420.1017799018532,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 64.10608024885778,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.089437675115679,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 73.92778401533027,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4270.500867556254,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1035.448564212542,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 441.28198068537165,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 72614.35571885083,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 409.85563916284383,
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
          "id": "ee330bee589f3cc23883fa67e627ad06b31d2d2b",
          "message": "fix: rebuild release binary if signal-killed on post-merge bench (#117)\n\nA Syncthing-synced binary compiled with target-cpu=native on a\ndifferent CPU microarchitecture crashes with SIGILL during sysinfo\ngathering. Cargo considers it up-to-date so `cargo build --release`\nis a no-op. Detect signal-killed exit (Python returncode < 0) and\nforce `cargo clean -p retch-cli && cargo build --release`.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:59:12-07:00",
          "tree_id": "13b71b071d9e5f31c3faa06d4aa51320377501b8",
          "url": "https://github.com/l1a/retch/commit/ee330bee589f3cc23883fa67e627ad06b31d2d2b"
        },
        "date": 1782577147205,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 636830654.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 352.641508907352,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.515992263174965,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7716113722323517,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.197501936545834,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5126.600117367359,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1295.482702930268,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 408.55326799392617,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70777.51811685719,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.4441070933899,
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
          "id": "9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f",
          "message": "feat: add just install-completions recipe (#118)\n\nGenerates and installs shell completions for bash, zsh, fish, elvish,\nnushell, and powershell to their correct XDG user locations. Also adds\nXDG path variables at the top of the Justfile and updates `just install`\nto depend on both install-man and install-completions.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:37:34-07:00",
          "tree_id": "d9c8234aa1d97872442e3e68b1a968f215f50f90",
          "url": "https://github.com/l1a/retch/commit/9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f"
        },
        "date": 1782579425160,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 712002868.7,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 334.804545205611,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.852024401573864,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6763133833606179,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.26619299980829,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4043.239205291993,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 972.4984020988435,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 389.16520694157,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63216.30858086542,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 321.1895098850327,
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
          "id": "71466e09694d76209fdf3bc02eef9cdfc6155c0d",
          "message": "docs: add performance regression vigilance guideline to AGENTS.md (#119)\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:53:59-07:00",
          "tree_id": "b6775fe68f3fa2aa0befa4fe2f722a2a1f15a8fe",
          "url": "https://github.com/l1a/retch/commit/71466e09694d76209fdf3bc02eef9cdfc6155c0d"
        },
        "date": 1782580516115,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 859998012.55,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 351.35248027953446,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 69.2911919193667,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8799239511130268,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.92896116855904,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4763.923717146243,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1088.4535127623217,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 411.7487948972777,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 104103.60354560919,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 350.2066950063934,
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
          "id": "d76a7d5246a051893671a84ed973b52bbe56e1b1",
          "message": "fix: skip FUSE and pseudo mounts in disk detection (#120)\n\n* fix: skip FUSE and pseudo mounts in disk detection\n\nsysinfo::Disks::new_with_refreshed_list() calls statvfs on every entry\nin /proc/mounts, including FUSE mounts that can block for hundreds of\nmilliseconds (e.g. cryfs vault: 613ms).\n\nOn Linux, replace sysinfo disk enumeration with a direct /proc/mounts\nreader that filters pseudo/FUSE filesystem types before calling statvfs.\nmacOS and Windows continue to use sysinfo::Disks unchanged.\n\nReduces disk field timing from ~634ms to ~2ms on affected machines.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: restore cross-platform deps moved to linux-only target by mistake\n\ndirs, chrono, anyhow, owo-colors, and rusqlite are used unconditionally\nacross macOS/Windows; only libc should be linux-only.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: mark is_skip_fs as linux-only to silence dead_code on macOS/Windows\n\nThe function is only called from detect_logical_linux which is already\ncfg-gated; clippy -D warnings caught it on the macOS CI job.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: make libc an unconditional dep to avoid lock file mismatch on AUR CI\n\nSome cargo versions handle cfg-gated deps in the lock file differently.\nlibc compiles on all platforms; the Linux-specific code that uses it is\nalready cfg-gated, so making it unconditional is safe.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:34:03-07:00",
          "tree_id": "1740235a0c0c2d66418ef5eac4e55c0e3132401a",
          "url": "https://github.com/l1a/retch/commit/d76a7d5246a051893671a84ed973b52bbe56e1b1"
        },
        "date": 1782582820799,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 672097135.4,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 352.70537309970604,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 66.80224729181421,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7773008200297487,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.805780698269324,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5254.465985941525,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1326.9355620957144,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 411.85368168579237,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 75931.72432249787,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 347.25622774878144,
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
          "id": "7733084c8ee1c58721066fc0199ac3c4ec3b2f4d",
          "message": "chore: bump version to v0.3.26 (#121)\n\n* chore: bump version to v0.3.26\n\nFollows fix for FUSE mount statvfs hang (PR #120).\n\nAssisted-By: claude-sonnet-4-6\n\n* docs: add mandatory pre-PR gate checklist to AGENTS.md\n\nForces explicit per-item verification output before gh pr create so\nno version bump or doc step can be silently skipped.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:56:14-07:00",
          "tree_id": "68842ea99eb9a017711b6c72ef0f9687e864c5da",
          "url": "https://github.com/l1a/retch/commit/7733084c8ee1c58721066fc0199ac3c4ec3b2f4d"
        },
        "date": 1782584212201,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 592477381.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 385.8286314336823,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 71.75765605137187,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.0689664028114096,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 66.32314082311402,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5086.492222311894,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1419.7237132976697,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 429.55152292930177,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70785.1602223322,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 390.39755223455313,
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
          "id": "79e4de519e6b7bc2f4ce2f6df351d62e41c05b26",
          "message": "feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields (#122)\n\n* feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields\n\nCloses six items from the fastfetch feature gap list:\n\n- Chassis: DMI chassis_type â†’ human label on Linux; hw.model inference on macOS\n- Init: /proc/1/comm on Linux; static \"launchd\"/\"SCM\" on macOS/Windows\n- Locale: $LC_ALL â†’ $LC_MESSAGES â†’ $LANG\n- Bootmgr: checks /boot/loader, /boot/grub2, /boot/grub, /sys/firmware/efi on Linux\n- Editor: $VISUAL â†’ $EDITOR\n- Weather: curl wttr.in/?format=3 (long mode only, 3s timeout)\n\nChassis/Init/Locale/Bootmgr/Editor added to the default output set.\nWeather is long-only to avoid adding a network call to standard runs.\n\nAlso moves the feature gap tracking list from AGENTS.md to NOTES.md â€”\nit is project state, not a standing instruction.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add weather_location config key\n\nUsers can now set `weather_location` in config.toml to pin the weather\nfield to a specific city name, ZIP code, airport IATA code, or lat/lon\ncoordinates â€” all formats supported natively by wttr.in. Without the\nkey, location is auto-detected from the requester's IP as before.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: complete --generate-config output\n\nAdded missing logo key, weather_location key, and updated the fields\nexample to include all current fields (chassis, init, locale, bootmgr,\neditor, weather, phys-mem, phys-disk, cpu-cache, cpu-usage, etc.).\nAlso synced DEFAULT_FIELDS_BLOCK in config.rs to match.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add --weather-location CLI flag\n\nAllows specifying weather location on the command line, overriding the\nconfig file's weather_location setting.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: URL-encode weather location and handle unknown locations\n\nSpaces and commas in location strings (e.g. \"Thousand Oaks, CA\") were\nnot encoded, breaking the URL. Now encodes spaces as + and commas as\n%2C before inserting into the wttr.in URL path.\n\nAdded -f to curl so HTTP 4xx/5xx (unknown location) causes a non-zero\nexit and the Weather field is silently omitted rather than showing the\nwttr.in error text.\n\nAdded url_encode_location unit tests.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: show error when explicit weather location is not found\n\nInstead of silently omitting the Weather field, display\n'Unknown location: \"<name>\"' when the user set a location\nexplicitly but wttr.in can't resolve it. Auto-detect failures\n(no location set) remain silent.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: update tests and benchmark for weather_location field\n\nAdded weather_location to config test fixtures and CollectOptions\ninitializer in benchmarks.rs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump version to v0.3.27, update docs and README\n\n- Bump retch-cli to 0.3.27, retch-sysinfo to 0.1.27\n- Bump AGENTS.md Current State header to v0.3.27\n- README: add weather_location config key, update fields example with\n  all new fields (chassis, init, locale, bootmgr, editor, weather)\n- docs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add just pr pre-PR gate recipe\n\nAutomates the pre-PR checklist so it can't be skipped:\n- Checks feature branch (not main)\n- Checks version bumped past last tag\n- Checks AGENTS.md Current State header matches version\n- Regenerates man page and fails if result is uncommitted\n- Runs cargo check and fails if Cargo.lock is uncommitted\n- Runs just check (fmt + clippy)\n- Runs cargo test\n- Prints manual checklist (README, release log, wiki) and requires\n  explicit 'y' confirmation before exiting 0\n\nUpdates AGENTS.md pre-PR gate instruction to reference just pr.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: move Chassis, Init, Locale, Bootmgr, Editor to long-only output\n\nThese fields are too verbose for the default view. They now appear\nonly in --long mode, alongside Weather.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: disable nixpkgs verification job\n\nnixpkgs PR was declined due to lack of popularity. No point running\nthe slow Nix build until we meet the popularity threshold. Re-enable\nby removing the `if: false` condition.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-28T08:32:51-07:00",
          "tree_id": "d40cb87dbb3673839a3b79e597cda6b56ae3e97f",
          "url": "https://github.com/l1a/retch/commit/79e4de519e6b7bc2f4ce2f6df351d62e41c05b26"
        },
        "date": 1782662033468,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 855309483.45,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 384.30659367155346,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 64.60964362456863,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8467282271159828,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.07976501294974,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4323.977280604956,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1059.5045347256414,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 445.4893111823918,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 72402.56330185445,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 348.57152268217067,
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
          "id": "770e0b0eabf6d60a1fecc1982117f738c3899fc0",
          "message": "feature/add tldr (#123)\n\n* docs: add tldr page entry for retch\n\nAssisted-By: Gemini 3.5 Flash\n\n* chore: add tldr page to pre-pr checklist\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add tldr-release automation script and recipes\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add merge-pr recipe and reset_wip script\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:28:45-07:00",
          "tree_id": "c1f8fdf58502f0ab22c57e17c25bcbd3feda49dd",
          "url": "https://github.com/l1a/retch/commit/770e0b0eabf6d60a1fecc1982117f738c3899fc0"
        },
        "date": 1782665339724,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 680443339.55,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 366.32879909091326,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 63.39321352761989,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7951333670043141,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.71540482828285,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5199.496979481265,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1354.8560110488202,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 448.9765118460774,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 76844.80308636138,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.2619027252263,
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
          "id": "b8d3f6ea87cf396f449249595ed4d787aa2bb2fe",
          "message": "fix: ignore already deleted branch error in merge-pr recipe (#124)\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:34:40-07:00",
          "tree_id": "c9c370af106069b537c4019e66afc44f31927e26",
          "url": "https://github.com/l1a/retch/commit/b8d3f6ea87cf396f449249595ed4d787aa2bb2fe"
        },
        "date": 1782665757793,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 810650595.9,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 355.2649530457756,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.134512834196144,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.662489775967439,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.01460405038326,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4605.497499137861,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1017.5652592106701,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 406.7932259964855,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 73066.87769976372,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.21525505164874,
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
          "id": "d13f2fe0da7a898a1ebbd9c412284e5d02a0651e",
          "message": "chore/refactor docs (#125)\n\n* docs: refactor documentation structure\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: fix Current State header formatting\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:54:34-07:00",
          "tree_id": "aaa002e02169e3c871a1373946d09700c6002e90",
          "url": "https://github.com/l1a/retch/commit/d13f2fe0da7a898a1ebbd9c412284e5d02a0651e"
        },
        "date": 1782666882199,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 678072974.85,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 372.09590713388354,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 63.82086532767862,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.853339449339596,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 68.94479899044862,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5212.856648247857,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1319.5658937302173,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 423.5168729028504,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 78901.97904427935,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.62233147934427,
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
          "id": "0bc5e587df1dee945e8b33182694531b28affdb9",
          "message": "Merge pull request #126 from l1a/fix/tldr-auth-bypass\n\nfix: resolve gh auth and fork directory issues in tldr release script",
          "timestamp": "2026-06-28T19:15:24-07:00",
          "tree_id": "41349673c84e317f53711dc893f4ebf44ab425c3",
          "url": "https://github.com/l1a/retch/commit/0bc5e587df1dee945e8b33182694531b28affdb9"
        },
        "date": 1782700547000,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 849021820.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 402.85621417852536,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 85.41088033721796,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.2043250221374957,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 65.56144716717075,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6143.6372844160815,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1610.0285498819808,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 483.2866864327967,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 106532.09128940548,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 405.62097985200404,
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
          "id": "b61db1f0a08f4d023930e0231b61079b17d4dc75",
          "message": "Merge pull request #127 from l1a/fix/tldr-page-format\n\nfix: fix tldr page lint errors",
          "timestamp": "2026-06-28T19:35:48-07:00",
          "tree_id": "80701731a659a4af0387474cc7517b7f36d10c32",
          "url": "https://github.com/l1a/retch/commit/b61db1f0a08f4d023930e0231b61079b17d4dc75"
        },
        "date": 1782701792545,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 839183321.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 450.531005155913,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 80.21032769617597,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.382927353207092,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 78.4305750955215,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6689.9564947140925,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1652.9656458850127,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 526.6026760743836,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 101935.04125240217,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 406.32234477965386,
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
          "id": "1094ac231ae3237ed49464785b01c00c96026b20",
          "message": "feat: add TerminalSize, DNS, WM fields; fix Shell detection (v0.3.29) (#128)\n\n* feat: add TerminalSize, DNS, WM fields; fix Shell detection\n\n- TerminalSize: ioctl(TIOCGWINSZ) on Linux/macOS, $COLUMNS/$LINES fallback\n- DNS: parse /etc/resolv.conf nameserver lines; PowerShell on Windows\n- WM: scan /proc for compositor/WM process names; suppressed in output\n  when identical to Desktop field (case-insensitive)\n- Shell: walk process tree first to find running shell; fall back to\n  $SHELL (login shell) only when scan yields nothing\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: improve Desktop detection when XDG env vars are absent\n\nAdd XDG_SESSION_DESKTOP and GDMSESSION as fallbacks, normalize\nDE names to canonical casing, and probe /proc as a last resort\n(e.g. gnome-shell â†’ GNOME) for terminals that don't inherit the\nfull session environment.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add non-Linux stub for detect_desktop_from_proc\n\nSatisfies clippy::unnecessary_lazy_evaluations (Rust 1.96+):\nreplace inline cfg closure with .or_else(detect_desktop_from_proc)\nand add a #[cfg(not(target_os = \"linux\"))] stub returning None.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: suppress logo when stdout is not a tty\n\nUse std::io::IsTerminal::is_terminal() instead of terminal_size()\nto detect piped output. terminal_size() returns Some() when a pager\nlike bat allocates a PTY, causing the logo to print as raw escape\nsequences.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+tests: update for v0.3.29 PR changes\n\n- docs/retch.1.md + retch.1: note logo tty-suppression in LOGOS section\n- README.md: add auto-suppressed-when-piped bullet to Logo Rendering Modes\n- NOTES.md: bump Current State to v0.3.29; add Desktop fix, logo tty\n  suppression, and logo cursor placement to release entry; remove DNS,\n  WM, TerminalSize from feature gap list\n- tests/cli_tests.rs: add tests for --fields dns/wm/terminal-size and\n  piped output containing no graphical logo escape sequences\n- fetch.rs: add unit tests for normalize_desktop_name,\n  detect_desktop_from_proc, and title-case/whitespace edge cases\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T12:30:38-07:00",
          "tree_id": "47d929d6f83cb36e994b9821fee1a649e882b21c",
          "url": "https://github.com/l1a/retch/commit/1094ac231ae3237ed49464785b01c00c96026b20"
        },
        "date": 1782762666204,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 981935975.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 369.5435732996158,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 71.32071475247923,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.827667224874192,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 68.38141575985111,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4564.90566131562,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1136.7436099359504,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 452.77300528610556,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 98435.861092659,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 366.0966935550441,
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
          "id": "1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a",
          "message": "fix: advance cursor past graphical logo bottom edge (#129)\n\nWhen the info field list is shorter than the logo height, the shell\nprompt was drawn on top of the logo. Fix by computing the logo's\nheight in terminal rows (image px height / cell px height via\nTIOCGWINSZ, with 20px fallback) and emitting CSI B after restoring\nthe cursor to push past the logo's bottom edge.\n\nAdds libc as a unix-only direct dep for TIOCGWINSZ.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:00:36-07:00",
          "tree_id": "f9622416d510a495b2af1a31b6b9c7e6b12f477e",
          "url": "https://github.com/l1a/retch/commit/1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a"
        },
        "date": 1782764483895,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 878463126.95,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 516.2727079534129,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 83.15909866582369,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.234987922929366,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.00006705309647,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5524.9862361934265,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1352.3020675745527,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 587.4109053631397,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 85530.33895762007,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 532.2704372432775,
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
          "id": "400f31e6f99e05724137adc0e67d046233010752",
          "message": "feat: switch weather backend to Open-Meteo (v0.3.30) (#130)\n\n* feat: switch weather to Open-Meteo + ipinfo.io\n\nReplace wttr.in (World Weather Online backend) with:\n- Open-Meteo for temperature/WMO weather code (geocoding API + forecast API)\n- ipinfo.io for IP-based auto-location fallback\n\nAdds `weather_unit` config/CLI option (\"fahrenheit\"/\"celsius\").\nWMO weather codes are mapped to emojis.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+test: improve weather.rs coverage and docs\n\n- Doc comments on detect_weather, curl_get, wmo_to_emoji, WeatherUnit variants\n- Expand wmo_to_emoji test to cover all major WMO code ranges + fallback\n- Add parse_coords edge cases: spaces around comma, out-of-range lat/lon\n- Add geolocate_ip display-name tests (US, non-US, no-city) without network\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.30, update docs and man page\n\nVersion: 0.3.29 â†’ 0.3.30 / retch-sysinfo 0.1.29 â†’ 0.1.30\nNOTES.md: Current State header + v0.3.30 release log entry\nREADME.md: fix weather config comment, add weather_unit key\ndocs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add weather-location to tldr page\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: note tldr upstream submission on hold\n\nUpstream tldr-pages submission denied pending community traction.\nKeep docs/retch.md and just tldr-release workflow maintained but\ndo not submit upstream until further notice.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add --weather-unit CLI flag\n\nWas wired through config but never added to the Cli struct.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:54:42-07:00",
          "tree_id": "2f9c12cc5e33db065dd02eb01cd157c8227985d1",
          "url": "https://github.com/l1a/retch/commit/400f31e6f99e05724137adc0e67d046233010752"
        },
        "date": 1782767711478,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 947643622.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 375.95952140220226,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.34856204907294,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.6744534556314103,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 66.93358205128564,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4185.91656690022,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 972.821536242782,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 397.1041237068242,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71861.88473929084,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 383.4388511544067,
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
          "id": "dbfa98155bcaa5b4a0415343af370f5580c7bc69",
          "message": "Merge pull request #131 from l1a/feat/output-mode-strata\n\nfeat: add --full mode, restructure output strata (v0.3.31)",
          "timestamp": "2026-06-29T15:47:51-07:00",
          "tree_id": "387cdab8aa181c79bc2a9d112600cd183d385188",
          "url": "https://github.com/l1a/retch/commit/dbfa98155bcaa5b4a0415343af370f5580c7bc69"
        },
        "date": 1782774573402,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1140667954.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 440.01340443850705,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 67.46794059964621,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.181207253469882,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 81.4747506606943,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5000.098274808847,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1124.09694557814,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 444.32372873160864,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 102291.7065753724,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 464.5907869081486,
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
          "id": "9f54423ddcf00725127f8a6939746d86d36aa426",
          "message": "chore: ignore memory/ directory\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-29T15:56:30-07:00",
          "tree_id": "77f45ad8edfdbec0879df29d0d4e640cbfc2c21c",
          "url": "https://github.com/l1a/retch/commit/9f54423ddcf00725127f8a6939746d86d36aa426"
        },
        "date": 1782775066862,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1093782756.35,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 399.2918006295466,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 81.98973729027097,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.2740294398230705,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 72.39530657847385,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6804.479617372177,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1683.0061456790577,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 482.4987296927835,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 113525.55297938905,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 396.26778377907925,
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
          "id": "4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c",
          "message": "chore: merge AGENTS.md with etr, document just pr gate (#133)\n\n* chore: merge AGENTS.md with etr, document just pr gate\n\nRestructure AGENTS.md into a Portable Core (kept in sync with etr's\nAGENTS.md) plus project-specific rules. Add NOTES.md read/update\ndiscipline and Core Developer Guidelines adopted from etr, and\ndocument exactly what the existing just pr gate automates.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: add CLAUDE.md, require reading ~/AGENTS.md\n\nretch had no CLAUDE.md pointing agents at AGENTS.md; add one\n(relative link), matching the fixed version now in etr. Also add a\nGlobal Mandates item to the Portable Core requiring agents to read\n~/AGENTS.md before starting work, so cross-repo mandates aren't\nsilently skipped when only the repo AGENTS.md is consulted.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T11:59:32-07:00",
          "tree_id": "1a29b12394fae5b30b5d0d83a768c294938169ae",
          "url": "https://github.com/l1a/retch/commit/4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c"
        },
        "date": 1782933616216,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 978044120.75,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 340.42639093828893,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 66.80483154253254,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8294297538405047,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.86304855403205,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4337.011757564623,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1067.2827144398302,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 387.91319540725294,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 79072.09844235473,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.6791806154746,
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
          "id": "e6605afd7d4f8dbce3f984541177ffaffb57901b",
          "message": "fix: allow dependabot PRs to trigger claude-code-review (#134)\n\nclaude-code-action@v1 refuses to run for non-human actors by default,\nso every Dependabot PR (e.g. #132) hard-failed the claude-review\ncheck in ~10s before doing any actual review. Add\nallowed_bots: 'dependabot[bot]' scoped narrowly to Dependabot.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T12:19:47-07:00",
          "tree_id": "a345de40f93e702accd3928257b0d831789bd7c1",
          "url": "https://github.com/l1a/retch/commit/e6605afd7d4f8dbce3f984541177ffaffb57901b"
        },
        "date": 1782934870337,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1068019818.6,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 365.1301308444251,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 70.95171729350594,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8449602755127432,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 65.63261037071842,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5488.507667483198,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1470.7668873349348,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 438.82402494657765,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 85032.25169443013,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 378.82208828401974,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c732fa42bbf646eaedff5b0000c0f3a94793f64f",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#132)\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [clap_complete](https://github.com/clap-rs/clap) and [anyhow](https://github.com/dtolnay/anyhow).\n\n\nUpdates `clap_complete` from 4.6.5 to 4.6.7\n- [Release notes](https://github.com/clap-rs/clap/releases)\n- [Changelog](https://github.com/clap-rs/clap/blob/master/CHANGELOG.md)\n- [Commits](https://github.com/clap-rs/clap/compare/clap_complete-v4.6.5...clap_complete-v4.6.7)\n\nUpdates `anyhow` from 1.0.102 to 1.0.103\n- [Release notes](https://github.com/dtolnay/anyhow/releases)\n- [Commits](https://github.com/dtolnay/anyhow/compare/1.0.102...1.0.103)\n\n---\nupdated-dependencies:\n- dependency-name: anyhow\n  dependency-version: 1.0.103\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: clap_complete\n  dependency-version: 4.6.6\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-07-01T12:45:11-07:00",
          "tree_id": "f6c62954a19f2b176352837922b1b5d311baa1e8",
          "url": "https://github.com/l1a/retch/commit/c732fa42bbf646eaedff5b0000c0f3a94793f64f"
        },
        "date": 1782936354085,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 835912810.4,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 465.0928505398898,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 82.30572530842818,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.1818072097612995,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 77.3753823019374,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6171.950334015158,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1687.4860551923782,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 529.6386229179673,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 122447.48157325068,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 467.5196535500721,
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
          "id": "0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee",
          "message": "docs: add Development-Setup.md to wiki checklist (#135)\n\n* docs: add Development-Setup.md to wiki checklist\n\nIt was omitted from AGENTS.md Â§4.8 when the checklist was first\nwritten, even though it documents just recipes and was directly\naffected by the just pr/just merge-pr additions. Also caught up the\nwiki itself (done directly, outside this PR, since wiki edits aren't\ngated by review): documented just pr/merge-pr and fixed a stale\npandoc reference (Justfile/flake use mandown).\n\nAssisted-By: Claude Sonnet 5\n\n* docs: add Development-Setup.md to NOTES.md wiki list too\n\nSame gap as AGENTS.md \\u00a74.8, duplicated in NOTES.md \\u00a73's own\nwiki checklist.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T13:51:17-07:00",
          "tree_id": "48e3a31d893308fa4ca9065b2e39f8936f7d87f6",
          "url": "https://github.com/l1a/retch/commit/0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee"
        },
        "date": 1782940356159,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1070283672.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 380.23617131530347,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 69.0201042820643,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.0507607084810546,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 74.39485293121209,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5212.850512206359,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1345.006576718794,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 447.88371518786926,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 74755.43491974237,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 377.24628674335196,
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
          "id": "efde1f0505b401f804ea9e26c4968d6f1499ca8d",
          "message": "chore: untap aws/tap in macOS benchmark CI (cosmetic) (#136)\n\nThe macOS benchmark job surfaces \"aws/tap is not trusted\" Homebrew\nwarnings as Actions annotations on every run, caused by a\npre-installed tap on the GitHub-hosted macos-latest runner image\nthat's unrelated to installing fastfetch/hyperfine. Nothing was\nfailing â€” this just declutters the Actions summary.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T14:36:18-07:00",
          "tree_id": "e1067f42e582559f8bd96b6325d3d25a663aece1",
          "url": "https://github.com/l1a/retch/commit/efde1f0505b401f804ea9e26c4968d6f1499ca8d"
        },
        "date": 1782942966751,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 985712681.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 338.61706626426974,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.559885490955594,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.664046538345329,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.17245106114948,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4118.722946307275,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 994.2558822884018,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 387.7573365565112,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 63273.62626921127,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 326.4219484459703,
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
          "id": "15176a3f82579e79a3b29d95a33a28f18bfc2bf9",
          "message": "feat: add btrfs and zpool storage fields (#137)\n\nAdds `btrfs` (label, subvolume, and used/allocated space per mount point,\nwith best-effort snapshot count) and `zpool` (ZFS pool allocation and\nhealth) fields, both gated behind --long and above. Closes the two\nStorage & Filesystems items in NOTES.md's fastfetch feature-gap list.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T15:30:08-07:00",
          "tree_id": "87ab581eee79770fe40b13279622d3b13a20f53c",
          "url": "https://github.com/l1a/retch/commit/15176a3f82579e79a3b29d95a33a28f18bfc2bf9"
        },
        "date": 1782946285581,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 984053779.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 364.60641065224803,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.40238082542642,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8050671916705867,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 64.87875947963745,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5446.941422410378,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1150.5366339386785,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 383.36061777669084,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 92688.0496081048,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 347.2649729853478,
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
          "id": "67c88b1988e92087607f45e6cd164467a3fd2db1",
          "message": "Show configured vs. rated memory speed on phys-mem (#138)\n\n* feat(sysinfo): show configured vs rated memory speed on Linux\n\ndmidecode's \"Configured Memory Speed\" is the module's actual running\nspeed, separate from \"Speed\" (rated max) â€” surfaces cases like\nXMP/EXPO not being enabled where RAM runs below spec.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: rename Memory display label to Memory Usage\n\nClarifies against the adjacent \"Phys Mem:\" line. The --fields/config\nkey \"memory\" is unchanged via an alias in should_show(), matching the\nexisting dns/\"DNS Server\" pattern.\n\nAssisted-By: Claude Sonnet 5\n\n* chore: add just open-pr as the sanctioned PR-opening entry point\n\ngh has no hook of its own to gate PR creation, so this recipe (just\npr's checklist, then gh pr create) is the one enforcement point that\nworks regardless of which tool is driving.\n\nAssisted-By: Claude Sonnet 5\n\n* docs: v0.3.38, agent-agnostic tooling mandate, memory speed docs\n\n- Bump retch-cli 0.3.38 / retch-sysinfo 0.1.33 (public DimmSlot field\n  addition), regenerate man page.\n- README/man page: document configured-vs-rated memory speed display.\n- NOTES.md: Current State header, v0.3.38 release log entry.\n- AGENTS.md: mandate reading chezmoi-manager skill in full before any\n  chezmoi command (prior incident caused git desync requiring\n  reverts); mandate recording learnings in AGENTS.md/SKILL.md rather\n  than agent-specific memory, so any agent benefits, not just one.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: open-pr recipe loses arg quoting without a shebang\n\njust's plain (non-shebang) recipe substitution joins *ARGS with bare\nspaces, so multi-word --title/--body values lost their quoting and\nbroke gh's flag parsing. A shebang recipe passes ARGS as real argv via\n\"$@\", preserving quoting correctly.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: set positional-arguments so open-pr's shebang script gets \\$@\n\nThe prior shebang fix alone wasn't enough -- without positional-arguments,\njust's shebang recipes don't receive *ARGS as real argv, so \"\\$@\" was\nempty. With it set, ARGS forward correctly through gh pr create.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-02T16:50:33-07:00",
          "tree_id": "e2969e45b48ba97220eb96078e8a686bd30d1fcc",
          "url": "https://github.com/l1a/retch/commit/67c88b1988e92087607f45e6cd164467a3fd2db1"
        },
        "date": 1783037515514,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 939914468.75,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 378.81151610437786,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 65.11541346000692,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.1052464321243978,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 75.129005800579,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5158.328957162833,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1396.223000777151,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 430.004283690798,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 75785.5417700259,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 424.75183850737915,
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
          "id": "0e1c1784b9978fdff89b81f40496397a7becfb04",
          "message": "Bump crossbeam-epoch to clear RUSTSEC-2026-0204 (#140)\n\n* Bump crossbeam-epoch to clear RUSTSEC-2026-0204\n\ncargo audit flagged crossbeam-epoch 0.9.18 (RUSTSEC-2026-0204: invalid\npointer dereference in the fmt::Pointer impl for Atomic/Shared). Bump to\n0.9.20 (Cargo.lock only; transitive via rayon â†’ image/criterion). No\nmanifest or direct-dependency change.\n\nAssisted-By: Claude Opus 4.8\n\n* Add advisory cargo audit step to just pr gate\n\nThe pre-PR gate never ran cargo audit, so RUSTSEC-2026-0204 (crossbeam-\nepoch) only surfaced in CI. Add step 8 to `just pr`: install cargo-audit\nif missing, run it, print advisories. Advisory-only â€” it does not block\nthe gate, since advisories can be newly published against unchanged\ntransitive deps. Documented in AGENTS.md Â§4.0 and NOTES.md.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T09:25:18-07:00",
          "tree_id": "20c022c102ba6752d23ea9a6923616b6a5d9b58c",
          "url": "https://github.com/l1a/retch/commit/0e1c1784b9978fdff89b81f40496397a7becfb04"
        },
        "date": 1783702003944,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1922266091.75,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 472.09711815473645,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 74.40928967519804,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9617621104552092,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 66.50037694449533,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4200.131863806975,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1057.3132342771983,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 475.01447285994425,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 68629.77853911326,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 406.01989008552073,
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
        "date": 1783703178986,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 1000455904.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 548.4956327259836,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 80.3924439465907,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.13957582320599,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 85.76589816670878,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6045.654700498307,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1556.8776972057703,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 544.4518832456367,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 91757.09245483285,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 454.46829020538627,
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
          "id": "ce1e6d15e07936c6632ff5fcc156d23aac99e347",
          "message": "Merge pull request #110 from l1a/feature/physical-memory-disk\n\nfeat: add PhysDisk and PhysMem fields (v0.3.23)",
          "timestamp": "2026-06-24T10:24:48-07:00",
          "tree_id": "53e59729a4c4d031fa6462ce01421b02d939e8ac",
          "url": "https://github.com/l1a/retch/commit/ce1e6d15e07936c6632ff5fcc156d23aac99e347"
        },
        "date": 1782323762684,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 30787788,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1719556028.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 134.96438601080945,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.330517662060575,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.94175606595454,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 105.28076028869368,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47788.92971636124,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 601.5838553794639,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 880.1819712404883,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1541062130,
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
          "id": "d89aa928c05f9ff70640a355b7aa104df5933a86",
          "message": "docs: update NOTES for v0.3.23 release and nixpkgs PR\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T10:56:28-07:00",
          "tree_id": "4de75ab73dd70c0da1ffc10be9ba0f151bfd5c5f",
          "url": "https://github.com/l1a/retch/commit/d89aa928c05f9ff70640a355b7aa104df5933a86"
        },
        "date": 1782325522597,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 28561424.000000004,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1586627174.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 118.21923265140882,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.990495041019619,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 118.29070852633338,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.18184003936355,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42545.840769114475,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 558.5477504035614,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 848.0332987625623,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1481088935,
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
          "id": "cb511d8ada171c399172dfebc8bde41a8137148f",
          "message": "perf: fix chafa and nmcli performance bottlenecks\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T11:12:15-07:00",
          "tree_id": "73aa12c54edcd985c05025eaa5c69f7f525872d6",
          "url": "https://github.com/l1a/retch/commit/cb511d8ada171c399172dfebc8bde41a8137148f"
        },
        "date": 1782326495486,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 32953398.000000007,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1636532128,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 117.06038737222454,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.988430863510265,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 115.58309508956006,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.70993920490909,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43071.73754489813,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 566.8036805109739,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 811.4942469376293,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1502504065,
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
          "id": "447f7796abf0b7810da7499a874504400076dfb6",
          "message": "Merge pull request #111 from l1a/fix/performance-regression\n\nperf: fix performance regression and align hyperfine mode comparisons",
          "timestamp": "2026-06-24T12:14:54-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/447f7796abf0b7810da7499a874504400076dfb6"
        },
        "date": 1782330304821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.72620079442856,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.502998200847257,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 132.8917525803017,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.39311227375524,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42715.726477811004,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 599.8046545316474,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 891.7571671254984,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1403281920,
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
          "id": "f38e23d53463405bbe973aa41c6ba9f794feabb9",
          "message": "chore: update checklists for version bump man pages\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:19:13-07:00",
          "tree_id": "75eec970de36474ac08d3746351c260f654e5e8b",
          "url": "https://github.com/l1a/retch/commit/f38e23d53463405bbe973aa41c6ba9f794feabb9"
        },
        "date": 1782330621968,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 90.30317006947254,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.8305956736169966,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 90.01467606138522,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 75.10934620402915,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 32642.82885800176,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 445.5972602024879,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 645.2872760275189,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1277857775,
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
          "id": "485da1be8ba30a6409d4220e303ee1380f4c8937",
          "message": "docs: document default set notes in NOTES\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:31:27-07:00",
          "tree_id": "ca4119acbfdfeee6b90c27723a146c8529d0cef2",
          "url": "https://github.com/l1a/retch/commit/485da1be8ba30a6409d4220e303ee1380f4c8937"
        },
        "date": 1782331717201,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 115.18432207004348,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.323312802669122,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.93095694013138,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 124.6791865957211,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45387.840364360025,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 601.1460746849307,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 853.6273142998316,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1593761485,
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
          "id": "04d2442f2ab2a46ae627bbe76af2e08ecec87220",
          "message": "Merge pull request #112 from l1a/feat/windows-phys-disk-mem\n\nfeat: implement Windows PhysDisk and PhysMem detection",
          "timestamp": "2026-06-24T22:33:30-07:00",
          "tree_id": "9c6c912cc8c4f04055290db2ab35fc64cc3e8675",
          "url": "https://github.com/l1a/retch/commit/04d2442f2ab2a46ae627bbe76af2e08ecec87220"
        },
        "date": 1782367456577,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 120.88160115414026,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.46542044931409,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 120.97264475417651,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 99.3859221981465,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41229.83339456761,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 583.025843317094,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 840.502909310256,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2919451805,
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
          "id": "616ce0be9684e55037a517f1c5b4e646f9d395c1",
          "message": "chore: add just nixpkgs-release automation script (#114)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:14:18-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/616ce0be9684e55037a517f1c5b4e646f9d395c1"
        },
        "date": 1782420275959,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 96.46772758873905,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.784895418329288,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 99.53317765413514,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 73.41934322178646,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 33149.53235576488,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 416.05006774688974,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 629.9860537234488,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2206506405,
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
          "id": "cc924b5dc321850fda70d1fd023e08d3849a39e4",
          "message": "docs: update AGENTS.md last-updated footer to v0.3.25 (#113)\n\n* chore: add just nixpkgs-release automation script\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: update AGENTS.md last-updated footer to v0.3.25\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:12:53-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/cc924b5dc321850fda70d1fd023e08d3849a39e4"
        },
        "date": 1782420364748,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.0921802497171,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.326021110777621,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 120.41166842056926,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.11519195577338,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41753.24152894572,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 564.2731723139825,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 829.0526823032384,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3257129430,
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
          "id": "bf9f9116909d0291a83a77f97482debe1f6e4ec5",
          "message": "chore: add just nixpkgs-release automation script (#115)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:04:58-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/bf9f9116909d0291a83a77f97482debe1f6e4ec5"
        },
        "date": 1782574522335,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.05327281980257,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.590813873023847,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.25670767909389,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.37208653198186,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41577.33348906839,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.6330802640518,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 814.4123790337883,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2714069070,
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
          "id": "2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7",
          "message": "docs/ci: branch cleanup policy and skip CI on docs-only PRs (#116)\n\n* docs: document branch-deletion policy in AGENTS.md\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: skip Rust/Security/Packaging workflows on docs-only PRs\n\nAdd paths filters to pull_request triggers so the full CI matrix\ndoes not run when only docs, scripts, or config files change.\nPush-to-main continues to run unconditionally.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:29:33-07:00",
          "tree_id": "81fad1b28f95d6c6e1f50b3e961f2a81c7ea145d",
          "url": "https://github.com/l1a/retch/commit/2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7"
        },
        "date": 1782575834939,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 72.98859996051064,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.1692117679980507,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 71.05158134458142,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 53.08049581102231,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 27618.26037187816,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 297.08951893927605,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 448.23345726322066,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1594350285,
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
          "id": "ee330bee589f3cc23883fa67e627ad06b31d2d2b",
          "message": "fix: rebuild release binary if signal-killed on post-merge bench (#117)\n\nA Syncthing-synced binary compiled with target-cpu=native on a\ndifferent CPU microarchitecture crashes with SIGILL during sysinfo\ngathering. Cargo considers it up-to-date so `cargo build --release`\nis a no-op. Detect signal-killed exit (Python returncode < 0) and\nforce `cargo clean -p retch-cli && cargo build --release`.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:59:12-07:00",
          "tree_id": "13b71b071d9e5f31c3faa06d4aa51320377501b8",
          "url": "https://github.com/l1a/retch/commit/ee330bee589f3cc23883fa67e627ad06b31d2d2b"
        },
        "date": 1782577855868,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.56293278031919,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.334640667109645,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.95837864037988,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.41159212714467,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43099.55253542869,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 583.4558404348858,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 807.9643192181977,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2686723895,
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
          "id": "9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f",
          "message": "feat: add just install-completions recipe (#118)\n\nGenerates and installs shell completions for bash, zsh, fish, elvish,\nnushell, and powershell to their correct XDG user locations. Also adds\nXDG path variables at the top of the Justfile and updates `just install`\nto depend on both install-man and install-completions.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:37:34-07:00",
          "tree_id": "d9c8234aa1d97872442e3e68b1a968f215f50f90",
          "url": "https://github.com/l1a/retch/commit/9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f"
        },
        "date": 1782580075527,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 156.52349891497482,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.559688238550675,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 124.43081535061553,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 107.76814361424981,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48984.570999777236,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 599.9966798447057,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 889.4245264922935,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2495554075,
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
          "id": "71466e09694d76209fdf3bc02eef9cdfc6155c0d",
          "message": "docs: add performance regression vigilance guideline to AGENTS.md (#119)\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:53:59-07:00",
          "tree_id": "b6775fe68f3fa2aa0befa4fe2f722a2a1f15a8fe",
          "url": "https://github.com/l1a/retch/commit/71466e09694d76209fdf3bc02eef9cdfc6155c0d"
        },
        "date": 1782581226782,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.37848959945829,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.319470756512999,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.9717000794935,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 92.39267397622791,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41910.698663007686,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 566.325368308046,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 799.5355791315261,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2568930675,
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
          "id": "d76a7d5246a051893671a84ed973b52bbe56e1b1",
          "message": "fix: skip FUSE and pseudo mounts in disk detection (#120)\n\n* fix: skip FUSE and pseudo mounts in disk detection\n\nsysinfo::Disks::new_with_refreshed_list() calls statvfs on every entry\nin /proc/mounts, including FUSE mounts that can block for hundreds of\nmilliseconds (e.g. cryfs vault: 613ms).\n\nOn Linux, replace sysinfo disk enumeration with a direct /proc/mounts\nreader that filters pseudo/FUSE filesystem types before calling statvfs.\nmacOS and Windows continue to use sysinfo::Disks unchanged.\n\nReduces disk field timing from ~634ms to ~2ms on affected machines.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: restore cross-platform deps moved to linux-only target by mistake\n\ndirs, chrono, anyhow, owo-colors, and rusqlite are used unconditionally\nacross macOS/Windows; only libc should be linux-only.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: mark is_skip_fs as linux-only to silence dead_code on macOS/Windows\n\nThe function is only called from detect_logical_linux which is already\ncfg-gated; clippy -D warnings caught it on the macOS CI job.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: make libc an unconditional dep to avoid lock file mismatch on AUR CI\n\nSome cargo versions handle cfg-gated deps in the lock file differently.\nlibc compiles on all platforms; the Linux-specific code that uses it is\nalready cfg-gated, so making it unconditional is safe.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:34:03-07:00",
          "tree_id": "1740235a0c0c2d66418ef5eac4e55c0e3132401a",
          "url": "https://github.com/l1a/retch/commit/d76a7d5246a051893671a84ed973b52bbe56e1b1"
        },
        "date": 1782583534380,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.77728313032294,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.348927899817298,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 121.00732046015818,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 92.94804508548468,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41602.640304097615,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 601.4768910234645,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 980.7774794467568,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2704048820,
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
          "id": "7733084c8ee1c58721066fc0199ac3c4ec3b2f4d",
          "message": "chore: bump version to v0.3.26 (#121)\n\n* chore: bump version to v0.3.26\n\nFollows fix for FUSE mount statvfs hang (PR #120).\n\nAssisted-By: claude-sonnet-4-6\n\n* docs: add mandatory pre-PR gate checklist to AGENTS.md\n\nForces explicit per-item verification output before gh pr create so\nno version bump or doc step can be silently skipped.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:56:14-07:00",
          "tree_id": "68842ea99eb9a017711b6c72ef0f9687e864c5da",
          "url": "https://github.com/l1a/retch/commit/7733084c8ee1c58721066fc0199ac3c4ec3b2f4d"
        },
        "date": 1782584895156,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.25416062494169,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.3383070352488415,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.66919356342564,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 100.28275430232375,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43855.39781117147,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 589.3105232822552,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 849.4305878326319,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2899367355,
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
          "id": "79e4de519e6b7bc2f4ce2f6df351d62e41c05b26",
          "message": "feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields (#122)\n\n* feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields\n\nCloses six items from the fastfetch feature gap list:\n\n- Chassis: DMI chassis_type â†’ human label on Linux; hw.model inference on macOS\n- Init: /proc/1/comm on Linux; static \"launchd\"/\"SCM\" on macOS/Windows\n- Locale: $LC_ALL â†’ $LC_MESSAGES â†’ $LANG\n- Bootmgr: checks /boot/loader, /boot/grub2, /boot/grub, /sys/firmware/efi on Linux\n- Editor: $VISUAL â†’ $EDITOR\n- Weather: curl wttr.in/?format=3 (long mode only, 3s timeout)\n\nChassis/Init/Locale/Bootmgr/Editor added to the default output set.\nWeather is long-only to avoid adding a network call to standard runs.\n\nAlso moves the feature gap tracking list from AGENTS.md to NOTES.md â€”\nit is project state, not a standing instruction.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add weather_location config key\n\nUsers can now set `weather_location` in config.toml to pin the weather\nfield to a specific city name, ZIP code, airport IATA code, or lat/lon\ncoordinates â€” all formats supported natively by wttr.in. Without the\nkey, location is auto-detected from the requester's IP as before.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: complete --generate-config output\n\nAdded missing logo key, weather_location key, and updated the fields\nexample to include all current fields (chassis, init, locale, bootmgr,\neditor, weather, phys-mem, phys-disk, cpu-cache, cpu-usage, etc.).\nAlso synced DEFAULT_FIELDS_BLOCK in config.rs to match.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add --weather-location CLI flag\n\nAllows specifying weather location on the command line, overriding the\nconfig file's weather_location setting.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: URL-encode weather location and handle unknown locations\n\nSpaces and commas in location strings (e.g. \"Thousand Oaks, CA\") were\nnot encoded, breaking the URL. Now encodes spaces as + and commas as\n%2C before inserting into the wttr.in URL path.\n\nAdded -f to curl so HTTP 4xx/5xx (unknown location) causes a non-zero\nexit and the Weather field is silently omitted rather than showing the\nwttr.in error text.\n\nAdded url_encode_location unit tests.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: show error when explicit weather location is not found\n\nInstead of silently omitting the Weather field, display\n'Unknown location: \"<name>\"' when the user set a location\nexplicitly but wttr.in can't resolve it. Auto-detect failures\n(no location set) remain silent.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: update tests and benchmark for weather_location field\n\nAdded weather_location to config test fixtures and CollectOptions\ninitializer in benchmarks.rs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump version to v0.3.27, update docs and README\n\n- Bump retch-cli to 0.3.27, retch-sysinfo to 0.1.27\n- Bump AGENTS.md Current State header to v0.3.27\n- README: add weather_location config key, update fields example with\n  all new fields (chassis, init, locale, bootmgr, editor, weather)\n- docs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add just pr pre-PR gate recipe\n\nAutomates the pre-PR checklist so it can't be skipped:\n- Checks feature branch (not main)\n- Checks version bumped past last tag\n- Checks AGENTS.md Current State header matches version\n- Regenerates man page and fails if result is uncommitted\n- Runs cargo check and fails if Cargo.lock is uncommitted\n- Runs just check (fmt + clippy)\n- Runs cargo test\n- Prints manual checklist (README, release log, wiki) and requires\n  explicit 'y' confirmation before exiting 0\n\nUpdates AGENTS.md pre-PR gate instruction to reference just pr.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: move Chassis, Init, Locale, Bootmgr, Editor to long-only output\n\nThese fields are too verbose for the default view. They now appear\nonly in --long mode, alongside Weather.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: disable nixpkgs verification job\n\nnixpkgs PR was declined due to lack of popularity. No point running\nthe slow Nix build until we meet the popularity threshold. Re-enable\nby removing the `if: false` condition.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-28T08:32:51-07:00",
          "tree_id": "d40cb87dbb3673839a3b79e597cda6b56ae3e97f",
          "url": "https://github.com/l1a/retch/commit/79e4de519e6b7bc2f4ce2f6df351d62e41c05b26"
        },
        "date": 1782662709515,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.81108509514112,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.328433787532495,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 121.02426375124512,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.60735409501478,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41847.20170594931,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 576.6577340613792,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 838.3796414976975,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2981483030,
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
          "id": "770e0b0eabf6d60a1fecc1982117f738c3899fc0",
          "message": "feature/add tldr (#123)\n\n* docs: add tldr page entry for retch\n\nAssisted-By: Gemini 3.5 Flash\n\n* chore: add tldr page to pre-pr checklist\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add tldr-release automation script and recipes\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add merge-pr recipe and reset_wip script\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:28:45-07:00",
          "tree_id": "c1f8fdf58502f0ab22c57e17c25bcbd3feda49dd",
          "url": "https://github.com/l1a/retch/commit/770e0b0eabf6d60a1fecc1982117f738c3899fc0"
        },
        "date": 1782666014211,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.19915496091053,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.911596622602281,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 128.3164295340586,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.8656098659116,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47089.715984832714,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 699.5914549484382,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 829.6905565100276,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2717572630,
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
          "id": "b8d3f6ea87cf396f449249595ed4d787aa2bb2fe",
          "message": "fix: ignore already deleted branch error in merge-pr recipe (#124)\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:34:40-07:00",
          "tree_id": "c9c370af106069b537c4019e66afc44f31927e26",
          "url": "https://github.com/l1a/retch/commit/b8d3f6ea87cf396f449249595ed4d787aa2bb2fe"
        },
        "date": 1782666464784,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 123.2172238668021,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.347765118100128,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.94381596317373,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.99974541534115,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43082.33157373372,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.8246169705898,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 839.1051023658835,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3355993410,
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
          "id": "d13f2fe0da7a898a1ebbd9c412284e5d02a0651e",
          "message": "chore/refactor docs (#125)\n\n* docs: refactor documentation structure\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: fix Current State header formatting\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:54:34-07:00",
          "tree_id": "aaa002e02169e3c871a1373946d09700c6002e90",
          "url": "https://github.com/l1a/retch/commit/d13f2fe0da7a898a1ebbd9c412284e5d02a0651e"
        },
        "date": 1782667620869,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 130.7290713072352,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.852617186574331,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 150.83849245221026,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.8159078005552,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41364.11745775296,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 602.246147191558,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 846.7406035707476,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2859904290,
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
          "id": "0bc5e587df1dee945e8b33182694531b28affdb9",
          "message": "Merge pull request #126 from l1a/fix/tldr-auth-bypass\n\nfix: resolve gh auth and fork directory issues in tldr release script",
          "timestamp": "2026-06-28T19:15:24-07:00",
          "tree_id": "41349673c84e317f53711dc893f4ebf44ab425c3",
          "url": "https://github.com/l1a/retch/commit/0bc5e587df1dee945e8b33182694531b28affdb9"
        },
        "date": 1782701215280,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 137.16534493753358,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.560094370574143,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.42955068047493,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.41384253848128,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42461.611849360976,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 582.9206884713498,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 837.6499022073831,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2649750005,
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
          "id": "b61db1f0a08f4d023930e0231b61079b17d4dc75",
          "message": "Merge pull request #127 from l1a/fix/tldr-page-format\n\nfix: fix tldr page lint errors",
          "timestamp": "2026-06-28T19:35:48-07:00",
          "tree_id": "80701731a659a4af0387474cc7517b7f36d10c32",
          "url": "https://github.com/l1a/retch/commit/b61db1f0a08f4d023930e0231b61079b17d4dc75"
        },
        "date": 1782702466466,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.32947483142937,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.31530562172022,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.53175339888931,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.70237085832744,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43798.24774251928,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 572.1782965443512,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 834.9511045516156,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3062797730,
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
          "id": "1094ac231ae3237ed49464785b01c00c96026b20",
          "message": "feat: add TerminalSize, DNS, WM fields; fix Shell detection (v0.3.29) (#128)\n\n* feat: add TerminalSize, DNS, WM fields; fix Shell detection\n\n- TerminalSize: ioctl(TIOCGWINSZ) on Linux/macOS, $COLUMNS/$LINES fallback\n- DNS: parse /etc/resolv.conf nameserver lines; PowerShell on Windows\n- WM: scan /proc for compositor/WM process names; suppressed in output\n  when identical to Desktop field (case-insensitive)\n- Shell: walk process tree first to find running shell; fall back to\n  $SHELL (login shell) only when scan yields nothing\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: improve Desktop detection when XDG env vars are absent\n\nAdd XDG_SESSION_DESKTOP and GDMSESSION as fallbacks, normalize\nDE names to canonical casing, and probe /proc as a last resort\n(e.g. gnome-shell â†’ GNOME) for terminals that don't inherit the\nfull session environment.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add non-Linux stub for detect_desktop_from_proc\n\nSatisfies clippy::unnecessary_lazy_evaluations (Rust 1.96+):\nreplace inline cfg closure with .or_else(detect_desktop_from_proc)\nand add a #[cfg(not(target_os = \"linux\"))] stub returning None.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: suppress logo when stdout is not a tty\n\nUse std::io::IsTerminal::is_terminal() instead of terminal_size()\nto detect piped output. terminal_size() returns Some() when a pager\nlike bat allocates a PTY, causing the logo to print as raw escape\nsequences.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+tests: update for v0.3.29 PR changes\n\n- docs/retch.1.md + retch.1: note logo tty-suppression in LOGOS section\n- README.md: add auto-suppressed-when-piped bullet to Logo Rendering Modes\n- NOTES.md: bump Current State to v0.3.29; add Desktop fix, logo tty\n  suppression, and logo cursor placement to release entry; remove DNS,\n  WM, TerminalSize from feature gap list\n- tests/cli_tests.rs: add tests for --fields dns/wm/terminal-size and\n  piped output containing no graphical logo escape sequences\n- fetch.rs: add unit tests for normalize_desktop_name,\n  detect_desktop_from_proc, and title-case/whitespace edge cases\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T12:30:38-07:00",
          "tree_id": "47d929d6f83cb36e994b9821fee1a649e882b21c",
          "url": "https://github.com/l1a/retch/commit/1094ac231ae3237ed49464785b01c00c96026b20"
        },
        "date": 1782763334996,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.77770822204317,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.313861018696757,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.47651852128968,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 92.01375758793027,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 40831.90648366405,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 555.7742406290794,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 800.366327112381,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3033241425,
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
          "id": "1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a",
          "message": "fix: advance cursor past graphical logo bottom edge (#129)\n\nWhen the info field list is shorter than the logo height, the shell\nprompt was drawn on top of the logo. Fix by computing the logo's\nheight in terminal rows (image px height / cell px height via\nTIOCGWINSZ, with 20px fallback) and emitting CSI B after restoring\nthe cursor to push past the logo's bottom edge.\n\nAdds libc as a unix-only direct dep for TIOCGWINSZ.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:00:36-07:00",
          "tree_id": "f9622416d510a495b2af1a31b6b9c7e6b12f477e",
          "url": "https://github.com/l1a/retch/commit/1b9007d1bcbf3a54c8f1878c3836ba63ca92df8a"
        },
        "date": 1782765200619,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.42132408618184,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.3239489860944,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 130.97565445635857,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 99.36999507008116,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45520.98093841294,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 586.8920740899869,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 799.6226274126573,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3224812235,
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
          "id": "400f31e6f99e05724137adc0e67d046233010752",
          "message": "feat: switch weather backend to Open-Meteo (v0.3.30) (#130)\n\n* feat: switch weather to Open-Meteo + ipinfo.io\n\nReplace wttr.in (World Weather Online backend) with:\n- Open-Meteo for temperature/WMO weather code (geocoding API + forecast API)\n- ipinfo.io for IP-based auto-location fallback\n\nAdds `weather_unit` config/CLI option (\"fahrenheit\"/\"celsius\").\nWMO weather codes are mapped to emojis.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+test: improve weather.rs coverage and docs\n\n- Doc comments on detect_weather, curl_get, wmo_to_emoji, WeatherUnit variants\n- Expand wmo_to_emoji test to cover all major WMO code ranges + fallback\n- Add parse_coords edge cases: spaces around comma, out-of-range lat/lon\n- Add geolocate_ip display-name tests (US, non-US, no-city) without network\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.30, update docs and man page\n\nVersion: 0.3.29 â†’ 0.3.30 / retch-sysinfo 0.1.29 â†’ 0.1.30\nNOTES.md: Current State header + v0.3.30 release log entry\nREADME.md: fix weather config comment, add weather_unit key\ndocs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add weather-location to tldr page\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: note tldr upstream submission on hold\n\nUpstream tldr-pages submission denied pending community traction.\nKeep docs/retch.md and just tldr-release workflow maintained but\ndo not submit upstream until further notice.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add --weather-unit CLI flag\n\nWas wired through config but never added to the Cli struct.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:54:42-07:00",
          "tree_id": "2f9c12cc5e33db065dd02eb01cd157c8227985d1",
          "url": "https://github.com/l1a/retch/commit/400f31e6f99e05724137adc0e67d046233010752"
        },
        "date": 1782768420151,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.37720484499187,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.856411696153725,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 155.73595336556212,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.21662933031857,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42198.76044695837,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 618.9710474640979,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 906.2602210187868,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3598985145,
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
          "id": "dbfa98155bcaa5b4a0415343af370f5580c7bc69",
          "message": "Merge pull request #131 from l1a/feat/output-mode-strata\n\nfeat: add --full mode, restructure output strata (v0.3.31)",
          "timestamp": "2026-06-29T15:47:51-07:00",
          "tree_id": "387cdab8aa181c79bc2a9d112600cd183d385188",
          "url": "https://github.com/l1a/retch/commit/dbfa98155bcaa5b4a0415343af370f5580c7bc69"
        },
        "date": 1782775268569,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 132.9327509830826,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.101828123644532,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 132.28884793978972,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 92.92802452216445,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43906.23251663404,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 554.5588826019783,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 814.5554032179488,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3321458905,
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
          "id": "9f54423ddcf00725127f8a6939746d86d36aa426",
          "message": "chore: ignore memory/ directory\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-29T15:56:30-07:00",
          "tree_id": "77f45ad8edfdbec0879df29d0d4e640cbfc2c21c",
          "url": "https://github.com/l1a/retch/commit/9f54423ddcf00725127f8a6939746d86d36aa426"
        },
        "date": 1782775766927,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.47795548224656,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.31996830140735,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.81405080133717,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.89234846899635,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41880.493411980715,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 625.6682875274502,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 839.6538086844819,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3706800220,
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
          "id": "4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c",
          "message": "chore: merge AGENTS.md with etr, document just pr gate (#133)\n\n* chore: merge AGENTS.md with etr, document just pr gate\n\nRestructure AGENTS.md into a Portable Core (kept in sync with etr's\nAGENTS.md) plus project-specific rules. Add NOTES.md read/update\ndiscipline and Core Developer Guidelines adopted from etr, and\ndocument exactly what the existing just pr gate automates.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: add CLAUDE.md, require reading ~/AGENTS.md\n\nretch had no CLAUDE.md pointing agents at AGENTS.md; add one\n(relative link), matching the fixed version now in etr. Also add a\nGlobal Mandates item to the Portable Core requiring agents to read\n~/AGENTS.md before starting work, so cross-repo mandates aren't\nsilently skipped when only the repo AGENTS.md is consulted.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T11:59:32-07:00",
          "tree_id": "1a29b12394fae5b30b5d0d83a768c294938169ae",
          "url": "https://github.com/l1a/retch/commit/4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c"
        },
        "date": 1782934323754,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 125.19082035718682,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.351418855526951,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.87490181290619,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.20448642886805,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41717.41284923746,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 559.5439700610762,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 796.4832466985977,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3657632505,
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
          "id": "e6605afd7d4f8dbce3f984541177ffaffb57901b",
          "message": "fix: allow dependabot PRs to trigger claude-code-review (#134)\n\nclaude-code-action@v1 refuses to run for non-human actors by default,\nso every Dependabot PR (e.g. #132) hard-failed the claude-review\ncheck in ~10s before doing any actual review. Add\nallowed_bots: 'dependabot[bot]' scoped narrowly to Dependabot.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T12:19:47-07:00",
          "tree_id": "a345de40f93e702accd3928257b0d831789bd7c1",
          "url": "https://github.com/l1a/retch/commit/e6605afd7d4f8dbce3f984541177ffaffb57901b"
        },
        "date": 1782935563819,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 131.7928004584463,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.900695655780282,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 129.59634900667737,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.52558152219481,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42778.803215521526,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 544.7266280963421,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 862.2780326496843,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 4333469375,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c732fa42bbf646eaedff5b0000c0f3a94793f64f",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#132)\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [clap_complete](https://github.com/clap-rs/clap) and [anyhow](https://github.com/dtolnay/anyhow).\n\n\nUpdates `clap_complete` from 4.6.5 to 4.6.7\n- [Release notes](https://github.com/clap-rs/clap/releases)\n- [Changelog](https://github.com/clap-rs/clap/blob/master/CHANGELOG.md)\n- [Commits](https://github.com/clap-rs/clap/compare/clap_complete-v4.6.5...clap_complete-v4.6.7)\n\nUpdates `anyhow` from 1.0.102 to 1.0.103\n- [Release notes](https://github.com/dtolnay/anyhow/releases)\n- [Commits](https://github.com/dtolnay/anyhow/compare/1.0.102...1.0.103)\n\n---\nupdated-dependencies:\n- dependency-name: anyhow\n  dependency-version: 1.0.103\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: clap_complete\n  dependency-version: 4.6.6\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-07-01T12:45:11-07:00",
          "tree_id": "f6c62954a19f2b176352837922b1b5d311baa1e8",
          "url": "https://github.com/l1a/retch/commit/c732fa42bbf646eaedff5b0000c0f3a94793f64f"
        },
        "date": 1782937073035,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.8901162113187,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.9247111430289365,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 129.58462323944468,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 92.5819884282003,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42796.62184054007,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 562.4590636231352,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 817.7718602544851,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3987285920,
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
          "id": "0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee",
          "message": "docs: add Development-Setup.md to wiki checklist (#135)\n\n* docs: add Development-Setup.md to wiki checklist\n\nIt was omitted from AGENTS.md Â§4.8 when the checklist was first\nwritten, even though it documents just recipes and was directly\naffected by the just pr/just merge-pr additions. Also caught up the\nwiki itself (done directly, outside this PR, since wiki edits aren't\ngated by review): documented just pr/merge-pr and fixed a stale\npandoc reference (Justfile/flake use mandown).\n\nAssisted-By: Claude Sonnet 5\n\n* docs: add Development-Setup.md to NOTES.md wiki list too\n\nSame gap as AGENTS.md \\u00a74.8, duplicated in NOTES.md \\u00a73's own\nwiki checklist.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T13:51:17-07:00",
          "tree_id": "48e3a31d893308fa4ca9065b2e39f8936f7d87f6",
          "url": "https://github.com/l1a/retch/commit/0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee"
        },
        "date": 1782941046507,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 131.20971693574003,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.476276262328966,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 132.2426294203163,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.74126377184531,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44169.04256507241,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.9286921845085,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 815.4177588859951,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3921233540,
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
          "id": "efde1f0505b401f804ea9e26c4968d6f1499ca8d",
          "message": "chore: untap aws/tap in macOS benchmark CI (cosmetic) (#136)\n\nThe macOS benchmark job surfaces \"aws/tap is not trusted\" Homebrew\nwarnings as Actions annotations on every run, caused by a\npre-installed tap on the GitHub-hosted macos-latest runner image\nthat's unrelated to installing fastfetch/hyperfine. Nothing was\nfailing â€” this just declutters the Actions summary.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T14:36:18-07:00",
          "tree_id": "e1067f42e582559f8bd96b6325d3d25a663aece1",
          "url": "https://github.com/l1a/retch/commit/efde1f0505b401f804ea9e26c4968d6f1499ca8d"
        },
        "date": 1782943724906,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 124.83062428288488,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.322429494947529,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.57740751156064,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.61325480400576,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41732.64584594787,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 561.9334278209037,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 827.4482972424878,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3754716285,
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
          "id": "15176a3f82579e79a3b29d95a33a28f18bfc2bf9",
          "message": "feat: add btrfs and zpool storage fields (#137)\n\nAdds `btrfs` (label, subvolume, and used/allocated space per mount point,\nwith best-effort snapshot count) and `zpool` (ZFS pool allocation and\nhealth) fields, both gated behind --long and above. Closes the two\nStorage & Filesystems items in NOTES.md's fastfetch feature-gap list.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T15:30:08-07:00",
          "tree_id": "87ab581eee79770fe40b13279622d3b13a20f53c",
          "url": "https://github.com/l1a/retch/commit/15176a3f82579e79a3b29d95a33a28f18bfc2bf9"
        },
        "date": 1782946998590,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.74656286081859,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.931474115699998,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 108.90103047263935,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 84.98543004718165,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44250.81394687621,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 535.2541989374668,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 791.9559644241358,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3586242120,
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
          "id": "67c88b1988e92087607f45e6cd164467a3fd2db1",
          "message": "Show configured vs. rated memory speed on phys-mem (#138)\n\n* feat(sysinfo): show configured vs rated memory speed on Linux\n\ndmidecode's \"Configured Memory Speed\" is the module's actual running\nspeed, separate from \"Speed\" (rated max) â€” surfaces cases like\nXMP/EXPO not being enabled where RAM runs below spec.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: rename Memory display label to Memory Usage\n\nClarifies against the adjacent \"Phys Mem:\" line. The --fields/config\nkey \"memory\" is unchanged via an alias in should_show(), matching the\nexisting dns/\"DNS Server\" pattern.\n\nAssisted-By: Claude Sonnet 5\n\n* chore: add just open-pr as the sanctioned PR-opening entry point\n\ngh has no hook of its own to gate PR creation, so this recipe (just\npr's checklist, then gh pr create) is the one enforcement point that\nworks regardless of which tool is driving.\n\nAssisted-By: Claude Sonnet 5\n\n* docs: v0.3.38, agent-agnostic tooling mandate, memory speed docs\n\n- Bump retch-cli 0.3.38 / retch-sysinfo 0.1.33 (public DimmSlot field\n  addition), regenerate man page.\n- README/man page: document configured-vs-rated memory speed display.\n- NOTES.md: Current State header, v0.3.38 release log entry.\n- AGENTS.md: mandate reading chezmoi-manager skill in full before any\n  chezmoi command (prior incident caused git desync requiring\n  reverts); mandate recording learnings in AGENTS.md/SKILL.md rather\n  than agent-specific memory, so any agent benefits, not just one.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: open-pr recipe loses arg quoting without a shebang\n\njust's plain (non-shebang) recipe substitution joins *ARGS with bare\nspaces, so multi-word --title/--body values lost their quoting and\nbroke gh's flag parsing. A shebang recipe passes ARGS as real argv via\n\"$@\", preserving quoting correctly.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: set positional-arguments so open-pr's shebang script gets \\$@\n\nThe prior shebang fix alone wasn't enough -- without positional-arguments,\njust's shebang recipes don't receive *ARGS as real argv, so \"\\$@\" was\nempty. With it set, ARGS forward correctly through gh pr create.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-02T16:50:33-07:00",
          "tree_id": "e2969e45b48ba97220eb96078e8a686bd30d1fcc",
          "url": "https://github.com/l1a/retch/commit/67c88b1988e92087607f45e6cd164467a3fd2db1"
        },
        "date": 1783038222827,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 126.227273568197,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.2938057845304245,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.82965301656868,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.37231651653461,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43846.743968361596,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 622.6705290303026,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 814.4356429774438,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3589214750,
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
          "id": "0e1c1784b9978fdff89b81f40496397a7becfb04",
          "message": "Bump crossbeam-epoch to clear RUSTSEC-2026-0204 (#140)\n\n* Bump crossbeam-epoch to clear RUSTSEC-2026-0204\n\ncargo audit flagged crossbeam-epoch 0.9.18 (RUSTSEC-2026-0204: invalid\npointer dereference in the fmt::Pointer impl for Atomic/Shared). Bump to\n0.9.20 (Cargo.lock only; transitive via rayon â†’ image/criterion). No\nmanifest or direct-dependency change.\n\nAssisted-By: Claude Opus 4.8\n\n* Add advisory cargo audit step to just pr gate\n\nThe pre-PR gate never ran cargo audit, so RUSTSEC-2026-0204 (crossbeam-\nepoch) only surfaced in CI. Add step 8 to `just pr`: install cargo-audit\nif missing, run it, print advisories. Advisory-only â€” it does not block\nthe gate, since advisories can be newly published against unchanged\ntransitive deps. Documented in AGENTS.md Â§4.0 and NOTES.md.\n\nAssisted-By: Claude Opus 4.8",
          "timestamp": "2026-07-10T09:25:18-07:00",
          "tree_id": "20c022c102ba6752d23ea9a6923616b6a5d9b58c",
          "url": "https://github.com/l1a/retch/commit/0e1c1784b9978fdff89b81f40496397a7becfb04"
        },
        "date": 1783702624370,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 99.48072207744131,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.8394718958379093,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 99.57929197131672,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.05496028390264,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 33062.03030397804,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 434.47438883186635,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 652.2339898171533,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3107516835,
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
        "date": 1783703840152,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 108.89466789144322,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.038673579413115,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.06557249967544,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 71.02808162128844,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 36880.824300356006,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 472.57676014488425,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 669.9638775305245,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3549876555,
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
      }
    ],
    "Windows Arm64 Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "220df5465b33d99038bf92cb7e1a29bea0b75fb6",
          "message": "deps(deps): bump sysinfo in the cargo-dependencies group (#109)\n\nBumps the cargo-dependencies group with 1 update: [sysinfo](https://github.com/GuillaumeGomez/sysinfo).\n\n\nUpdates `sysinfo` from 0.39.3 to 0.39.5\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.3...v0.39.5)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.5\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-06-23T21:41:04-07:00",
          "tree_id": "d0637dc2f48db2f5807ba1634a9d71a51b466c96",
          "url": "https://github.com/l1a/retch/commit/220df5465b33d99038bf92cb7e1a29bea0b75fb6"
        },
        "date": 1782278519092,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 273338320,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1537727129.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 99.33936463051808,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9477196162020207,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 99.8941823011662,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.2731305157754,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46225.09515190932,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.16112566802576,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 751.6524213329463,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1386222025,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3386d46e7b612993957b9aec731e7cb6c823c6b7",
          "message": "ci(deps): bump cachix/install-nix-action from 27 to 31 (#108)\n\nBumps [cachix/install-nix-action](https://github.com/cachix/install-nix-action) from 27 to 31.\n- [Release notes](https://github.com/cachix/install-nix-action/releases)\n- [Changelog](https://github.com/cachix/install-nix-action/blob/master/RELEASE.md)\n- [Commits](https://github.com/cachix/install-nix-action/compare/v27...v31)\n\n---\nupdated-dependencies:\n- dependency-name: cachix/install-nix-action\n  dependency-version: '31'\n  dependency-type: direct:production\n  update-type: version-update:semver-major\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-06-23T21:40:57-07:00",
          "tree_id": "9e82cb04434e6f6f68fe35f70ce025c17f3e333e",
          "url": "https://github.com/l1a/retch/commit/3386d46e7b612993957b9aec731e7cb6c823c6b7"
        },
        "date": 1782278522013,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 288803379.99999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1619447620,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.03683475504383,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948321182817801,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.93739864285621,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.88708520911196,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44432.984649678445,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 492.03716488222574,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 758.9269531762081,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1450879255,
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
          "id": "ce1e6d15e07936c6632ff5fcc156d23aac99e347",
          "message": "Merge pull request #110 from l1a/feature/physical-memory-disk\n\nfeat: add PhysDisk and PhysMem fields (v0.3.23)",
          "timestamp": "2026-06-24T10:24:48-07:00",
          "tree_id": "53e59729a4c4d031fa6462ce01421b02d939e8ac",
          "url": "https://github.com/l1a/retch/commit/ce1e6d15e07936c6632ff5fcc156d23aac99e347"
        },
        "date": 1782324222500,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 258821676,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1474979046,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 96.78049883850375,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9477404305841928,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 98.89441202501952,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.73804370136426,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45629.917308579985,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 496.81698511939896,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 759.709051145697,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1312267270,
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
          "id": "d89aa928c05f9ff70640a355b7aa104df5933a86",
          "message": "docs: update NOTES for v0.3.23 release and nixpkgs PR\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T10:56:28-07:00",
          "tree_id": "4de75ab73dd70c0da1ffc10be9ba0f151bfd5c5f",
          "url": "https://github.com/l1a/retch/commit/d89aa928c05f9ff70640a355b7aa104df5933a86"
        },
        "date": 1782326008295,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 286100266,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1585276695.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 96.76205477207026,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9497500073659615,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.45087450555816,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.72111045683906,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46710.460659783814,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 501.2545139647738,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 763.1274821198751,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1415258645,
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
          "id": "cb511d8ada171c399172dfebc8bde41a8137148f",
          "message": "perf: fix chafa and nmcli performance bottlenecks\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-24T11:12:15-07:00",
          "tree_id": "73aa12c54edcd985c05025eaa5c69f7f525872d6",
          "url": "https://github.com/l1a/retch/commit/cb511d8ada171c399172dfebc8bde41a8137148f"
        },
        "date": 1782326975960,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 277813000.00000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1542324350,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 96.65166529678162,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948945502652814,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.94637483787858,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.80773616059156,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45209.204128416895,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 493.48226688718023,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 743.8807309416729,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1375962100,
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
          "id": "447f7796abf0b7810da7499a874504400076dfb6",
          "message": "Merge pull request #111 from l1a/fix/performance-regression\n\nperf: fix performance regression and align hyperfine mode comparisons",
          "timestamp": "2026-06-24T12:14:54-07:00",
          "tree_id": "40e34e3cc0a351717b334d171164482fee0e379a",
          "url": "https://github.com/l1a/retch/commit/447f7796abf0b7810da7499a874504400076dfb6"
        },
        "date": 1782330838615,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 96.42742454737068,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468082015966406,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.49626072025013,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.37048145912203,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47247.42730073445,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 483.2227021554645,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 735.4185824856269,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1380498555,
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
          "id": "485da1be8ba30a6409d4220e303ee1380f4c8937",
          "message": "docs: document default set notes in NOTES\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-06-24T12:31:27-07:00",
          "tree_id": "ca4119acbfdfeee6b90c27723a146c8529d0cef2",
          "url": "https://github.com/l1a/retch/commit/485da1be8ba30a6409d4220e303ee1380f4c8937"
        },
        "date": 1782332425118,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 96.61758739632278,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946825002343431,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.79261608229427,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.31214353444103,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47020.360633353,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 482.1440510091742,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 746.9015069226948,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1313774420,
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
          "id": "04d2442f2ab2a46ae627bbe76af2e08ecec87220",
          "message": "Merge pull request #112 from l1a/feat/windows-phys-disk-mem\n\nfeat: implement Windows PhysDisk and PhysMem detection",
          "timestamp": "2026-06-24T22:33:30-07:00",
          "tree_id": "9c6c912cc8c4f04055290db2ab35fc64cc3e8675",
          "url": "https://github.com/l1a/retch/commit/04d2442f2ab2a46ae627bbe76af2e08ecec87220"
        },
        "date": 1782368026509,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.85911794132122,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947106456513094,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.2143719697956,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.5942294451718,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46651.93813754675,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 490.80464165423274,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 749.1334256052403,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2358957570,
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
          "id": "616ce0be9684e55037a517f1c5b4e646f9d395c1",
          "message": "chore: add just nixpkgs-release automation script (#114)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:14:18-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/616ce0be9684e55037a517f1c5b4e646f9d395c1"
        },
        "date": 1782420841708,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.47016058411467,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949111142546921,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 105.84109201782367,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.58730668723385,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44585.84406786831,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.2264589864957,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 735.772085171598,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2294251785,
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
          "id": "cc924b5dc321850fda70d1fd023e08d3849a39e4",
          "message": "docs: update AGENTS.md last-updated footer to v0.3.25 (#113)\n\n* chore: add just nixpkgs-release automation script\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: update AGENTS.md last-updated footer to v0.3.25\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-25T13:12:53-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/cc924b5dc321850fda70d1fd023e08d3849a39e4"
        },
        "date": 1782420949850,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.21843925364139,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947545331508261,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.57746446170742,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.50393144682286,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45796.34079972168,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 484.7512903132898,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 746.6627840655639,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2388919500,
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
          "id": "bf9f9116909d0291a83a77f97482debe1f6e4ec5",
          "message": "chore: add just nixpkgs-release automation script (#115)\n\nAutomates the full retch â†’ nixpkgs release pipeline without requiring\na local Nix installation: tags the version, polls the GitHub release for\nCI-computed hashes, updates the nixpkgs fork branch, and opens a PR.\n\nUsage: just nixpkgs-release [VERSION]\nOverride fork path with NIXPKGS_DIR env var.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:04:58-07:00",
          "tree_id": "1aa03e00e034b8c11e50ecbc06a482e87c8275ef",
          "url": "https://github.com/l1a/retch/commit/bf9f9116909d0291a83a77f97482debe1f6e4ec5"
        },
        "date": 1782575103163,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.44120733851443,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468938157656757,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.63399644975796,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.65189941263687,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44681.99947449543,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.279643014498,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 735.4464320152188,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2394281710,
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
          "id": "2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7",
          "message": "docs/ci: branch cleanup policy and skip CI on docs-only PRs (#116)\n\n* docs: document branch-deletion policy in AGENTS.md\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: skip Rust/Security/Packaging workflows on docs-only PRs\n\nAdd paths filters to pull_request triggers so the full CI matrix\ndoes not run when only docs, scripts, or config files change.\nPush-to-main continues to run unconditionally.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:29:33-07:00",
          "tree_id": "81fad1b28f95d6c6e1f50b3e961f2a81c7ea145d",
          "url": "https://github.com/l1a/retch/commit/2b42bfaa80b8a2f163ea057a8015bdd5dd601eb7"
        },
        "date": 1782576402525,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.22797142580335,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9487674668259496,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.53721375594014,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.69551138158917,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44290.10234919807,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.4627049591578,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 743.7912499373322,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2393408175,
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
          "id": "ee330bee589f3cc23883fa67e627ad06b31d2d2b",
          "message": "fix: rebuild release binary if signal-killed on post-merge bench (#117)\n\nA Syncthing-synced binary compiled with target-cpu=native on a\ndifferent CPU microarchitecture crashes with SIGILL during sysinfo\ngathering. Cargo considers it up-to-date so `cargo build --release`\nis a no-op. Detect signal-killed exit (Python returncode < 0) and\nforce `cargo clean -p retch-cli && cargo build --release`.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T08:59:12-07:00",
          "tree_id": "13b71b071d9e5f31c3faa06d4aa51320377501b8",
          "url": "https://github.com/l1a/retch/commit/ee330bee589f3cc23883fa67e627ad06b31d2d2b"
        },
        "date": 1782578443291,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.75231397843962,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.950167231912153,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.20591269128622,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.88656447648808,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46672.288680338446,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.9580823460283,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 746.9104225964597,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2329276015,
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
          "id": "9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f",
          "message": "feat: add just install-completions recipe (#118)\n\nGenerates and installs shell completions for bash, zsh, fish, elvish,\nnushell, and powershell to their correct XDG user locations. Also adds\nXDG path variables at the top of the Justfile and updates `just install`\nto depend on both install-man and install-completions.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:37:34-07:00",
          "tree_id": "d9c8234aa1d97872442e3e68b1a968f215f50f90",
          "url": "https://github.com/l1a/retch/commit/9f7a7fd8c88af96dbbc43c912115f9ee1ba8386f"
        },
        "date": 1782580663263,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.21259364835605,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94807931183246,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.71064003933952,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.46843634407664,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47275.72755845812,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.3893526364207,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 750.7543918380404,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2431065180,
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
          "id": "71466e09694d76209fdf3bc02eef9cdfc6155c0d",
          "message": "docs: add performance regression vigilance guideline to AGENTS.md (#119)\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-27T09:53:59-07:00",
          "tree_id": "b6775fe68f3fa2aa0befa4fe2f722a2a1f15a8fe",
          "url": "https://github.com/l1a/retch/commit/71466e09694d76209fdf3bc02eef9cdfc6155c0d"
        },
        "date": 1782581781870,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.80442689790618,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9476220179986257,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.2703706940027,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.7754029186536,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46315.27005830902,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 486.96507399318915,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 742.5580746200669,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2198151015,
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
          "id": "d76a7d5246a051893671a84ed973b52bbe56e1b1",
          "message": "fix: skip FUSE and pseudo mounts in disk detection (#120)\n\n* fix: skip FUSE and pseudo mounts in disk detection\n\nsysinfo::Disks::new_with_refreshed_list() calls statvfs on every entry\nin /proc/mounts, including FUSE mounts that can block for hundreds of\nmilliseconds (e.g. cryfs vault: 613ms).\n\nOn Linux, replace sysinfo disk enumeration with a direct /proc/mounts\nreader that filters pseudo/FUSE filesystem types before calling statvfs.\nmacOS and Windows continue to use sysinfo::Disks unchanged.\n\nReduces disk field timing from ~634ms to ~2ms on affected machines.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: restore cross-platform deps moved to linux-only target by mistake\n\ndirs, chrono, anyhow, owo-colors, and rusqlite are used unconditionally\nacross macOS/Windows; only libc should be linux-only.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: mark is_skip_fs as linux-only to silence dead_code on macOS/Windows\n\nThe function is only called from detect_logical_linux which is already\ncfg-gated; clippy -D warnings caught it on the macOS CI job.\n\nAssisted-By: claude-sonnet-4-6\n\n* fix: make libc an unconditional dep to avoid lock file mismatch on AUR CI\n\nSome cargo versions handle cfg-gated deps in the lock file differently.\nlibc compiles on all platforms; the Linux-specific code that uses it is\nalready cfg-gated, so making it unconditional is safe.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:34:03-07:00",
          "tree_id": "1740235a0c0c2d66418ef5eac4e55c0e3132401a",
          "url": "https://github.com/l1a/retch/commit/d76a7d5246a051893671a84ed973b52bbe56e1b1"
        },
        "date": 1782584106951,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.29993668881805,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9476519215072434,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.0592624855249,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.21644464161825,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46065.128333408815,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 481.6910227921103,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 729.7721886639962,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2360827270,
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
          "id": "7733084c8ee1c58721066fc0199ac3c4ec3b2f4d",
          "message": "chore: bump version to v0.3.26 (#121)\n\n* chore: bump version to v0.3.26\n\nFollows fix for FUSE mount statvfs hang (PR #120).\n\nAssisted-By: claude-sonnet-4-6\n\n* docs: add mandatory pre-PR gate checklist to AGENTS.md\n\nForces explicit per-item verification output before gh pr create so\nno version bump or doc step can be silently skipped.\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-27T10:56:14-07:00",
          "tree_id": "68842ea99eb9a017711b6c72ef0f9687e864c5da",
          "url": "https://github.com/l1a/retch/commit/7733084c8ee1c58721066fc0199ac3c4ec3b2f4d"
        },
        "date": 1782585445269,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.59448404900493,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948320266936335,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.74475802016984,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.04861738303707,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44304.69488525647,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.01964339946073,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 726.4738328459704,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2283060055,
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
          "id": "79e4de519e6b7bc2f4ce2f6df351d62e41c05b26",
          "message": "feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields (#122)\n\n* feat: add Chassis, Init, Locale, Bootmgr, Editor, Weather fields\n\nCloses six items from the fastfetch feature gap list:\n\n- Chassis: DMI chassis_type â†’ human label on Linux; hw.model inference on macOS\n- Init: /proc/1/comm on Linux; static \"launchd\"/\"SCM\" on macOS/Windows\n- Locale: $LC_ALL â†’ $LC_MESSAGES â†’ $LANG\n- Bootmgr: checks /boot/loader, /boot/grub2, /boot/grub, /sys/firmware/efi on Linux\n- Editor: $VISUAL â†’ $EDITOR\n- Weather: curl wttr.in/?format=3 (long mode only, 3s timeout)\n\nChassis/Init/Locale/Bootmgr/Editor added to the default output set.\nWeather is long-only to avoid adding a network call to standard runs.\n\nAlso moves the feature gap tracking list from AGENTS.md to NOTES.md â€”\nit is project state, not a standing instruction.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add weather_location config key\n\nUsers can now set `weather_location` in config.toml to pin the weather\nfield to a specific city name, ZIP code, airport IATA code, or lat/lon\ncoordinates â€” all formats supported natively by wttr.in. Without the\nkey, location is auto-detected from the requester's IP as before.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: complete --generate-config output\n\nAdded missing logo key, weather_location key, and updated the fields\nexample to include all current fields (chassis, init, locale, bootmgr,\neditor, weather, phys-mem, phys-disk, cpu-cache, cpu-usage, etc.).\nAlso synced DEFAULT_FIELDS_BLOCK in config.rs to match.\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add --weather-location CLI flag\n\nAllows specifying weather location on the command line, overriding the\nconfig file's weather_location setting.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: URL-encode weather location and handle unknown locations\n\nSpaces and commas in location strings (e.g. \"Thousand Oaks, CA\") were\nnot encoded, breaking the URL. Now encodes spaces as + and commas as\n%2C before inserting into the wttr.in URL path.\n\nAdded -f to curl so HTTP 4xx/5xx (unknown location) causes a non-zero\nexit and the Weather field is silently omitted rather than showing the\nwttr.in error text.\n\nAdded url_encode_location unit tests.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: show error when explicit weather location is not found\n\nInstead of silently omitting the Weather field, display\n'Unknown location: \"<name>\"' when the user set a location\nexplicitly but wttr.in can't resolve it. Auto-detect failures\n(no location set) remain silent.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: update tests and benchmark for weather_location field\n\nAdded weather_location to config test fixtures and CollectOptions\ninitializer in benchmarks.rs.\n\nAssisted-By: Claude Sonnet 4.6\n\n* style: cargo fmt\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump version to v0.3.27, update docs and README\n\n- Bump retch-cli to 0.3.27, retch-sysinfo to 0.1.27\n- Bump AGENTS.md Current State header to v0.3.27\n- README: add weather_location config key, update fields example with\n  all new fields (chassis, init, locale, bootmgr, editor, weather)\n- docs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* feat: add just pr pre-PR gate recipe\n\nAutomates the pre-PR checklist so it can't be skipped:\n- Checks feature branch (not main)\n- Checks version bumped past last tag\n- Checks AGENTS.md Current State header matches version\n- Regenerates man page and fails if result is uncommitted\n- Runs cargo check and fails if Cargo.lock is uncommitted\n- Runs just check (fmt + clippy)\n- Runs cargo test\n- Prints manual checklist (README, release log, wiki) and requires\n  explicit 'y' confirmation before exiting 0\n\nUpdates AGENTS.md pre-PR gate instruction to reference just pr.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: move Chassis, Init, Locale, Bootmgr, Editor to long-only output\n\nThese fields are too verbose for the default view. They now appear\nonly in --long mode, alongside Weather.\n\nAssisted-By: Claude Sonnet 4.6\n\n* ci: disable nixpkgs verification job\n\nnixpkgs PR was declined due to lack of popularity. No point running\nthe slow Nix build until we meet the popularity threshold. Re-enable\nby removing the `if: false` condition.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-28T08:32:51-07:00",
          "tree_id": "d40cb87dbb3673839a3b79e597cda6b56ae3e97f",
          "url": "https://github.com/l1a/retch/commit/79e4de519e6b7bc2f4ce2f6df351d62e41c05b26"
        },
        "date": 1782663305007,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.93982795378409,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948285762598246,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.06831646076878,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.79754934389248,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45481.8975113202,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 510.4629122118922,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 749.8855939598989,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2491383145,
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
          "id": "770e0b0eabf6d60a1fecc1982117f738c3899fc0",
          "message": "feature/add tldr (#123)\n\n* docs: add tldr page entry for retch\n\nAssisted-By: Gemini 3.5 Flash\n\n* chore: add tldr page to pre-pr checklist\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add tldr-release automation script and recipes\n\nAssisted-By: Gemini 3.5 Flash\n\n* feat: add merge-pr recipe and reset_wip script\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:28:45-07:00",
          "tree_id": "c1f8fdf58502f0ab22c57e17c25bcbd3feda49dd",
          "url": "https://github.com/l1a/retch/commit/770e0b0eabf6d60a1fecc1982117f738c3899fc0"
        },
        "date": 1782666562879,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.2494078442746,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947836493660615,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.56279490882905,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.7170962821998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45566.88569840917,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 502.2933060516442,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.2269199399027,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2230130450,
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
          "id": "b8d3f6ea87cf396f449249595ed4d787aa2bb2fe",
          "message": "fix: ignore already deleted branch error in merge-pr recipe (#124)\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:34:40-07:00",
          "tree_id": "c9c370af106069b537c4019e66afc44f31927e26",
          "url": "https://github.com/l1a/retch/commit/b8d3f6ea87cf396f449249595ed4d787aa2bb2fe"
        },
        "date": 1782667057387,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.59588467507115,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948326162163317,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.14491798496907,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.87997704836376,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45064.670227163486,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 501.5847116994237,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 738.7368996819084,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2440200485,
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
          "id": "d13f2fe0da7a898a1ebbd9c412284e5d02a0651e",
          "message": "chore/refactor docs (#125)\n\n* docs: refactor documentation structure\n\nAssisted-By: Gemini 3.5 Flash\n\n* docs: fix Current State header formatting\n\nAssisted-By: Gemini 3.5 Flash",
          "timestamp": "2026-06-28T09:54:34-07:00",
          "tree_id": "aaa002e02169e3c871a1373946d09700c6002e90",
          "url": "https://github.com/l1a/retch/commit/d13f2fe0da7a898a1ebbd9c412284e5d02a0651e"
        },
        "date": 1782668160200,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.84639944610085,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947695783797084,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.31268142834323,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.9307802716177,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45856.11600439601,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 501.4699484056067,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 733.3284790324685,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2270097465,
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
          "id": "0bc5e587df1dee945e8b33182694531b28affdb9",
          "message": "Merge pull request #126 from l1a/fix/tldr-auth-bypass\n\nfix: resolve gh auth and fork directory issues in tldr release script",
          "timestamp": "2026-06-28T19:15:24-07:00",
          "tree_id": "41349673c84e317f53711dc893f4ebf44ab425c3",
          "url": "https://github.com/l1a/retch/commit/0bc5e587df1dee945e8b33182694531b28affdb9"
        },
        "date": 1782701783444,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.75998154203228,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947629827943371,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.23153018104645,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.6690975595371,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45641.23308584693,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 501.3525288736396,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 735.1792611503723,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2291337020,
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
          "id": "b61db1f0a08f4d023930e0231b61079b17d4dc75",
          "message": "Merge pull request #127 from l1a/fix/tldr-page-format\n\nfix: fix tldr page lint errors",
          "timestamp": "2026-06-28T19:35:48-07:00",
          "tree_id": "80701731a659a4af0387474cc7517b7f36d10c32",
          "url": "https://github.com/l1a/retch/commit/b61db1f0a08f4d023930e0231b61079b17d4dc75"
        },
        "date": 1782703037160,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.64139073843867,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9472711964550653,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.39350791404408,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 82.04610677776233,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46350.930037911676,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 504.4158042215331,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 750.372836572767,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 2384108495,
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
          "id": "1094ac231ae3237ed49464785b01c00c96026b20",
          "message": "feat: add TerminalSize, DNS, WM fields; fix Shell detection (v0.3.29) (#128)\n\n* feat: add TerminalSize, DNS, WM fields; fix Shell detection\n\n- TerminalSize: ioctl(TIOCGWINSZ) on Linux/macOS, $COLUMNS/$LINES fallback\n- DNS: parse /etc/resolv.conf nameserver lines; PowerShell on Windows\n- WM: scan /proc for compositor/WM process names; suppressed in output\n  when identical to Desktop field (case-insensitive)\n- Shell: walk process tree first to find running shell; fall back to\n  $SHELL (login shell) only when scan yields nothing\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: improve Desktop detection when XDG env vars are absent\n\nAdd XDG_SESSION_DESKTOP and GDMSESSION as fallbacks, normalize\nDE names to canonical casing, and probe /proc as a last resort\n(e.g. gnome-shell â†’ GNOME) for terminals that don't inherit the\nfull session environment.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add non-Linux stub for detect_desktop_from_proc\n\nSatisfies clippy::unnecessary_lazy_evaluations (Rust 1.96+):\nreplace inline cfg closure with .or_else(detect_desktop_from_proc)\nand add a #[cfg(not(target_os = \"linux\"))] stub returning None.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: suppress logo when stdout is not a tty\n\nUse std::io::IsTerminal::is_terminal() instead of terminal_size()\nto detect piped output. terminal_size() returns Some() when a pager\nlike bat allocates a PTY, causing the logo to print as raw escape\nsequences.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+tests: update for v0.3.29 PR changes\n\n- docs/retch.1.md + retch.1: note logo tty-suppression in LOGOS section\n- README.md: add auto-suppressed-when-piped bullet to Logo Rendering Modes\n- NOTES.md: bump Current State to v0.3.29; add Desktop fix, logo tty\n  suppression, and logo cursor placement to release entry; remove DNS,\n  WM, TerminalSize from feature gap list\n- tests/cli_tests.rs: add tests for --fields dns/wm/terminal-size and\n  piped output containing no graphical logo escape sequences\n- fetch.rs: add unit tests for normalize_desktop_name,\n  detect_desktop_from_proc, and title-case/whitespace edge cases\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T12:30:38-07:00",
          "tree_id": "47d929d6f83cb36e994b9821fee1a649e882b21c",
          "url": "https://github.com/l1a/retch/commit/1094ac231ae3237ed49464785b01c00c96026b20"
        },
        "date": 1782763959372,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.43458340927172,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9483365356115008,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 108.38535260804886,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.79820265108336,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46879.39741988496,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 487.57509643314626,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 742.8912689793641,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3123974855,
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
          "id": "400f31e6f99e05724137adc0e67d046233010752",
          "message": "feat: switch weather backend to Open-Meteo (v0.3.30) (#130)\n\n* feat: switch weather to Open-Meteo + ipinfo.io\n\nReplace wttr.in (World Weather Online backend) with:\n- Open-Meteo for temperature/WMO weather code (geocoding API + forecast API)\n- ipinfo.io for IP-based auto-location fallback\n\nAdds `weather_unit` config/CLI option (\"fahrenheit\"/\"celsius\").\nWMO weather codes are mapped to emojis.\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs+test: improve weather.rs coverage and docs\n\n- Doc comments on detect_weather, curl_get, wmo_to_emoji, WeatherUnit variants\n- Expand wmo_to_emoji test to cover all major WMO code ranges + fallback\n- Add parse_coords edge cases: spaces around comma, out-of-range lat/lon\n- Add geolocate_ip display-name tests (US, non-US, no-city) without network\n\nAssisted-By: Claude Sonnet 4.6\n\n* chore: bump to v0.3.30, update docs and man page\n\nVersion: 0.3.29 â†’ 0.3.30 / retch-sysinfo 0.1.29 â†’ 0.1.30\nNOTES.md: Current State header + v0.3.30 release log entry\nREADME.md: fix weather config comment, add weather_unit key\ndocs/retch.1: regenerated\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: add weather-location to tldr page\n\nAssisted-By: Claude Sonnet 4.6\n\n* docs: note tldr upstream submission on hold\n\nUpstream tldr-pages submission denied pending community traction.\nKeep docs/retch.md and just tldr-release workflow maintained but\ndo not submit upstream until further notice.\n\nAssisted-By: Claude Sonnet 4.6\n\n* fix: add --weather-unit CLI flag\n\nWas wired through config but never added to the Cli struct.\n\nAssisted-By: Claude Sonnet 4.6",
          "timestamp": "2026-06-29T13:54:42-07:00",
          "tree_id": "2f9c12cc5e33db065dd02eb01cd157c8227985d1",
          "url": "https://github.com/l1a/retch/commit/400f31e6f99e05724137adc0e67d046233010752"
        },
        "date": 1782769043581,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.97442187948086,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9477315086024065,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.5979648782153,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.17721557640671,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46694.90556246008,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 494.1004045570841,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.3208704454116,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3632799070,
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
          "id": "dbfa98155bcaa5b4a0415343af370f5580c7bc69",
          "message": "Merge pull request #131 from l1a/feat/output-mode-strata\n\nfeat: add --full mode, restructure output strata (v0.3.31)",
          "timestamp": "2026-06-29T15:47:51-07:00",
          "tree_id": "387cdab8aa181c79bc2a9d112600cd183d385188",
          "url": "https://github.com/l1a/retch/commit/dbfa98155bcaa5b4a0415343af370f5580c7bc69"
        },
        "date": 1782775876132,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.05530458347098,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949401053770102,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 107.45878516096509,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.78052631044623,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45489.3204962786,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 501.23639264451214,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 760.9675131876479,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3338642215,
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
          "id": "9f54423ddcf00725127f8a6939746d86d36aa426",
          "message": "chore: ignore memory/ directory\n\nAssisted-By: claude-sonnet-4-6",
          "timestamp": "2026-06-29T15:56:30-07:00",
          "tree_id": "77f45ad8edfdbec0879df29d0d4e640cbfc2c21c",
          "url": "https://github.com/l1a/retch/commit/9f54423ddcf00725127f8a6939746d86d36aa426"
        },
        "date": 1782776380952,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.53344379635253,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948217222222436,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 105.3417008265715,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.7721726420975,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45667.37230546599,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 500.11003972439084,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 754.7489637862167,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3567373075,
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
          "id": "4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c",
          "message": "chore: merge AGENTS.md with etr, document just pr gate (#133)\n\n* chore: merge AGENTS.md with etr, document just pr gate\n\nRestructure AGENTS.md into a Portable Core (kept in sync with etr's\nAGENTS.md) plus project-specific rules. Add NOTES.md read/update\ndiscipline and Core Developer Guidelines adopted from etr, and\ndocument exactly what the existing just pr gate automates.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: add CLAUDE.md, require reading ~/AGENTS.md\n\nretch had no CLAUDE.md pointing agents at AGENTS.md; add one\n(relative link), matching the fixed version now in etr. Also add a\nGlobal Mandates item to the Portable Core requiring agents to read\n~/AGENTS.md before starting work, so cross-repo mandates aren't\nsilently skipped when only the repo AGENTS.md is consulted.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T11:59:32-07:00",
          "tree_id": "1a29b12394fae5b30b5d0d83a768c294938169ae",
          "url": "https://github.com/l1a/retch/commit/4bb9a9902ef41bd93902dc96ef9f1cc5468f1f9c"
        },
        "date": 1782934913280,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.77007112205251,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.96354155560823,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.29530736478544,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.8497718711536,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44359.71345893877,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 501.01369591955137,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 737.46414147834,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3463389670,
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
          "id": "e6605afd7d4f8dbce3f984541177ffaffb57901b",
          "message": "fix: allow dependabot PRs to trigger claude-code-review (#134)\n\nclaude-code-action@v1 refuses to run for non-human actors by default,\nso every Dependabot PR (e.g. #132) hard-failed the claude-review\ncheck in ~10s before doing any actual review. Add\nallowed_bots: 'dependabot[bot]' scoped narrowly to Dependabot.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T12:19:47-07:00",
          "tree_id": "a345de40f93e702accd3928257b0d831789bd7c1",
          "url": "https://github.com/l1a/retch/commit/e6605afd7d4f8dbce3f984541177ffaffb57901b"
        },
        "date": 1782936175403,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.54429217303017,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9488352285332193,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.45889589241366,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.46450722623152,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45885.51031571087,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 505.1245244666751,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 757.5461803327279,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3783938650,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c732fa42bbf646eaedff5b0000c0f3a94793f64f",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#132)\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [clap_complete](https://github.com/clap-rs/clap) and [anyhow](https://github.com/dtolnay/anyhow).\n\n\nUpdates `clap_complete` from 4.6.5 to 4.6.7\n- [Release notes](https://github.com/clap-rs/clap/releases)\n- [Changelog](https://github.com/clap-rs/clap/blob/master/CHANGELOG.md)\n- [Commits](https://github.com/clap-rs/clap/compare/clap_complete-v4.6.5...clap_complete-v4.6.7)\n\nUpdates `anyhow` from 1.0.102 to 1.0.103\n- [Release notes](https://github.com/dtolnay/anyhow/releases)\n- [Commits](https://github.com/dtolnay/anyhow/compare/1.0.102...1.0.103)\n\n---\nupdated-dependencies:\n- dependency-name: anyhow\n  dependency-version: 1.0.103\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: clap_complete\n  dependency-version: 4.6.6\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2026-07-01T12:45:11-07:00",
          "tree_id": "f6c62954a19f2b176352837922b1b5d311baa1e8",
          "url": "https://github.com/l1a/retch/commit/c732fa42bbf646eaedff5b0000c0f3a94793f64f"
        },
        "date": 1782937699977,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.47219618582855,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9489545410231686,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 105.60320230183382,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.39759518405857,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46312.721756595696,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 502.1725754632042,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 749.4760735406113,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3570821155,
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
          "id": "0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee",
          "message": "docs: add Development-Setup.md to wiki checklist (#135)\n\n* docs: add Development-Setup.md to wiki checklist\n\nIt was omitted from AGENTS.md Â§4.8 when the checklist was first\nwritten, even though it documents just recipes and was directly\naffected by the just pr/just merge-pr additions. Also caught up the\nwiki itself (done directly, outside this PR, since wiki edits aren't\ngated by review): documented just pr/merge-pr and fixed a stale\npandoc reference (Justfile/flake use mandown).\n\nAssisted-By: Claude Sonnet 5\n\n* docs: add Development-Setup.md to NOTES.md wiki list too\n\nSame gap as AGENTS.md \\u00a74.8, duplicated in NOTES.md \\u00a73's own\nwiki checklist.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T13:51:17-07:00",
          "tree_id": "48e3a31d893308fa4ca9065b2e39f8936f7d87f6",
          "url": "https://github.com/l1a/retch/commit/0157907ad80e3ce0a3b2a1d30b8bd93aa1d92aee"
        },
        "date": 1782941669327,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.4386491307999,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9478651144154995,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.29523994909343,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.20327427801159,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45858.07715213292,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 499.1589324618778,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 747.0260009001657,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3653422785,
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
          "id": "efde1f0505b401f804ea9e26c4968d6f1499ca8d",
          "message": "chore: untap aws/tap in macOS benchmark CI (cosmetic) (#136)\n\nThe macOS benchmark job surfaces \"aws/tap is not trusted\" Homebrew\nwarnings as Actions annotations on every run, caused by a\npre-installed tap on the GitHub-hosted macos-latest runner image\nthat's unrelated to installing fastfetch/hyperfine. Nothing was\nfailing â€” this just declutters the Actions summary.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T14:36:18-07:00",
          "tree_id": "e1067f42e582559f8bd96b6325d3d25a663aece1",
          "url": "https://github.com/l1a/retch/commit/efde1f0505b401f804ea9e26c4968d6f1499ca8d"
        },
        "date": 1782944303166,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.26748745186985,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948437351952136,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.2703366638561,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.22658048943995,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44458.27101843794,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 491.142378146162,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 742.6538990669867,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3086068595,
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
          "id": "15176a3f82579e79a3b29d95a33a28f18bfc2bf9",
          "message": "feat: add btrfs and zpool storage fields (#137)\n\nAdds `btrfs` (label, subvolume, and used/allocated space per mount point,\nwith best-effort snapshot count) and `zpool` (ZFS pool allocation and\nhealth) fields, both gated behind --long and above. Closes the two\nStorage & Filesystems items in NOTES.md's fastfetch feature-gap list.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-01T15:30:08-07:00",
          "tree_id": "87ab581eee79770fe40b13279622d3b13a20f53c",
          "url": "https://github.com/l1a/retch/commit/15176a3f82579e79a3b29d95a33a28f18bfc2bf9"
        },
        "date": 1782947603989,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.26999963276197,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469994475424786,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 103.46016909708283,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.27899346173247,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47831.87374177415,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 491.241864160373,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 740.3014079530058,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3772077835,
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
          "id": "67c88b1988e92087607f45e6cd164467a3fd2db1",
          "message": "Show configured vs. rated memory speed on phys-mem (#138)\n\n* feat(sysinfo): show configured vs rated memory speed on Linux\n\ndmidecode's \"Configured Memory Speed\" is the module's actual running\nspeed, separate from \"Speed\" (rated max) â€” surfaces cases like\nXMP/EXPO not being enabled where RAM runs below spec.\n\nAssisted-By: Claude Sonnet 5\n\n* feat: rename Memory display label to Memory Usage\n\nClarifies against the adjacent \"Phys Mem:\" line. The --fields/config\nkey \"memory\" is unchanged via an alias in should_show(), matching the\nexisting dns/\"DNS Server\" pattern.\n\nAssisted-By: Claude Sonnet 5\n\n* chore: add just open-pr as the sanctioned PR-opening entry point\n\ngh has no hook of its own to gate PR creation, so this recipe (just\npr's checklist, then gh pr create) is the one enforcement point that\nworks regardless of which tool is driving.\n\nAssisted-By: Claude Sonnet 5\n\n* docs: v0.3.38, agent-agnostic tooling mandate, memory speed docs\n\n- Bump retch-cli 0.3.38 / retch-sysinfo 0.1.33 (public DimmSlot field\n  addition), regenerate man page.\n- README/man page: document configured-vs-rated memory speed display.\n- NOTES.md: Current State header, v0.3.38 release log entry.\n- AGENTS.md: mandate reading chezmoi-manager skill in full before any\n  chezmoi command (prior incident caused git desync requiring\n  reverts); mandate recording learnings in AGENTS.md/SKILL.md rather\n  than agent-specific memory, so any agent benefits, not just one.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: open-pr recipe loses arg quoting without a shebang\n\njust's plain (non-shebang) recipe substitution joins *ARGS with bare\nspaces, so multi-word --title/--body values lost their quoting and\nbroke gh's flag parsing. A shebang recipe passes ARGS as real argv via\n\"$@\", preserving quoting correctly.\n\nAssisted-By: Claude Sonnet 5\n\n* fix: set positional-arguments so open-pr's shebang script gets \\$@\n\nThe prior shebang fix alone wasn't enough -- without positional-arguments,\njust's shebang recipes don't receive *ARGS as real argv, so \"\\$@\" was\nempty. With it set, ARGS forward correctly through gh pr create.\n\nAssisted-By: Claude Sonnet 5",
          "timestamp": "2026-07-02T16:50:33-07:00",
          "tree_id": "e2969e45b48ba97220eb96078e8a686bd30d1fcc",
          "url": "https://github.com/l1a/retch/commit/67c88b1988e92087607f45e6cd164467a3fd2db1"
        },
        "date": 1783038845598,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.26071481121855,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466379966273095,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 104.08760330419712,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.32380428981696,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44933.71702159026,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 491.9657431831136,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 756.7404800165167,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 3647154900,
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
      }
    ]
  }
}