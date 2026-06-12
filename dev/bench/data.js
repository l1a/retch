window.BENCHMARK_DATA = {
  "lastUpdate": 1781230535986,
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
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780504900193,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 11181838.64,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 104695153.94000003,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 102425028.64,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 2906378.664859442,
            "unit": "ns"
          }
        ]
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
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780504919556,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 10455690.239999998,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 99940936.33999999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 102424324.68,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 2674544.461871699,
            "unit": "ns"
          }
        ]
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
          "id": "4be849d2c552d060db86bbc11683a8fd251f0c0b",
          "message": "Configure git safe directory inside Fedora containers",
          "timestamp": "2026-06-03T09:54:28-07:00",
          "tree_id": "bef608005f117a8a29ffa44e7f42771ecd3cd4b0",
          "url": "https://github.com/l1a/retch/commit/4be849d2c552d060db86bbc11683a8fd251f0c0b"
        },
        "date": 1780506019654,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2733827.659999999,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 66221647.76000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 58918954.83665645,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1707798.011411298,
            "unit": "ns"
          }
        ]
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
          "id": "10396be118bf4df2bef9664e6b79dcfa48c6328f",
          "message": "Disable fail-on-alert to tolerate VM noise",
          "timestamp": "2026-06-03T10:13:15-07:00",
          "tree_id": "fe92c928d5f66c210b9dae49414504acb40aa04f",
          "url": "https://github.com/l1a/retch/commit/10396be118bf4df2bef9664e6b79dcfa48c6328f"
        },
        "date": 1780507043225,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2439881.840000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 48939798.839999996,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 46716800.21343706,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1574606.7808965556,
            "unit": "ns"
          }
        ]
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
          "id": "99579ba9289002ec5b191f0921b65bfa9ed8570e",
          "message": "Import os in hyperfine installer",
          "timestamp": "2026-06-03T10:50:50-07:00",
          "tree_id": "a6778a7f2d5c8c964e660b60709cedc84c67ac99",
          "url": "https://github.com/l1a/retch/commit/99579ba9289002ec5b191f0921b65bfa9ed8570e"
        },
        "date": 1780509307728,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2734222.840000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 134929766.04000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 128044711.075,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1695565.9982143058,
            "unit": "ns"
          }
        ]
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
          "id": "248b7b5a9f9a1a3eb5b62512ffa362eac159b756",
          "message": "Configure Windows PATH in benchmark jobs",
          "timestamp": "2026-06-03T11:23:32-07:00",
          "tree_id": "4428a646927f214627bae22beffb50b429e372fd",
          "url": "https://github.com/l1a/retch/commit/248b7b5a9f9a1a3eb5b62512ffa362eac159b756"
        },
        "date": 1780511265786,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1716957.7800000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 105661061.38000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 99355326.53999999,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1550359.4988595012,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b13e968dc483454c9fbb632a9714d46474bdc678",
          "message": "Merge pull request #66 from l1a/feature/multi-platform-benchmarks\n\nv0.3.2 - macOS Battery/Bluetooth Fixes & Multi-Platform Benchmarks",
          "timestamp": "2026-06-03T12:36:18-07:00",
          "tree_id": "150eb86f6551ec2ce10a0920f17d572403943ffe",
          "url": "https://github.com/l1a/retch/commit/b13e968dc483454c9fbb632a9714d46474bdc678"
        },
        "date": 1780515638896,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1660923.4399999995,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 121218714.44000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 124354019.2,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1538899.7572071082,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "046c8e0b0137a548dcb51d46fef7703b46efe9cc",
          "message": "v0.3.3 - Native OS Queries & Performance Optimization (#68)\n\n* Implement native queries for route, displays, reg\n\n* Allow clippy upper_case_acronyms for win_reg\n\n* Bump version to 0.3.3 and rebuild man pages\n\n* Test route parsing and wire up helper\n\n* Restrict route parser to Linux or tests",
          "timestamp": "2026-06-04T08:16:04-07:00",
          "tree_id": "969803f451b805de37c1b56fbebdded3f6c125d3",
          "url": "https://github.com/l1a/retch/commit/046c8e0b0137a548dcb51d46fef7703b46efe9cc"
        },
        "date": 1780586427688,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2694815.9400000004,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 48645263.54000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 48184673.31882282,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1746108.2827593226,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "585270b923d52522281c533fb0763203d8a90b40",
          "message": "Update CLI flags for short, long, and mode options (#70)",
          "timestamp": "2026-06-04T09:08:05-07:00",
          "tree_id": "0ea02c92aac1141943ac5f8df9742e9e9034f14f",
          "url": "https://github.com/l1a/retch/commit/585270b923d52522281c533fb0763203d8a90b40"
        },
        "date": 1780589533525,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 3185817.520000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 54311254.019999996,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 51265993.71993153,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1744142.2546284464,
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
          "id": "2c8929eff22476a7f6682a4f1a22b68ffe13b346",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#69)\n\n* deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [sysinfo](https://github.com/GuillaumeGomez/sysinfo) and [chrono](https://github.com/chronotope/chrono).\n\n\nUpdates `sysinfo` from 0.39.2 to 0.39.3\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.2...v0.39.3)\n\nUpdates `chrono` from 0.4.44 to 0.4.45\n- [Release notes](https://github.com/chronotope/chrono/releases)\n- [Changelog](https://github.com/chronotope/chrono/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/chronotope/chrono/compare/v0.4.44...v0.4.45)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.3\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: chrono\n  dependency-version: 0.4.45\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\n\n* Bump version to 0.3.4 and update docs\n\n---------\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\nCo-authored-by: Ken Tobias <634380+l1a@users.noreply.github.com>",
          "timestamp": "2026-06-04T09:50:00-07:00",
          "tree_id": "da1fab8118438991920da275cd4aa46f9a678a63",
          "url": "https://github.com/l1a/retch/commit/2c8929eff22476a7f6682a4f1a22b68ffe13b346"
        },
        "date": 1780592061545,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2437758.8600000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 102495828.05999999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 103721756.96,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1593168.3915405027,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03f2f059fb0ad385d838b489f3e4ac1b62e6855b",
          "message": "refactor: isolate display parsing into display.rs, expand tests and benchmarks (v0.3.5)\n\nExtracts all display detection and EDID parsing from fetch.rs into crates/sysinfo/src/display.rs. Adds 13 new unit tests (22→35) covering edge cases and 4 new criterion benchmarks for the pure EDID parsing functions. Bumps retch-cli to 0.3.5, retch-sysinfo to 0.1.5.",
          "timestamp": "2026-06-08T11:57:39-07:00",
          "tree_id": "7f7cbba8a52f301fe9a06fec1ddbf7bae7034a21",
          "url": "https://github.com/l1a/retch/commit/03f2f059fb0ad385d838b489f3e4ac1b62e6855b"
        },
        "date": 1780945383530,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2401724.8200000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 57525920.92000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 58910882.011996284,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.220500777111496,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.862627568118784,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.50961591046138,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17824.504988260665,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1597790.6346372655,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906c5abfb8923400935698c0e78970d34b0db97c",
          "message": "Update AGENTS.md progress and next steps (#72)",
          "timestamp": "2026-06-08T12:33:05-07:00",
          "tree_id": "1de64e381b62d4f79deb5adacbc4da43901fc6ff",
          "url": "https://github.com/l1a/retch/commit/906c5abfb8923400935698c0e78970d34b0db97c"
        },
        "date": 1780947488666,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2684157.86,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 53974889.36,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 47344972.34542187,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.71255878287953,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.06429687204798,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.4875412494027,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20563.893459201634,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1705621.9255856858,
            "unit": "ns"
          }
        ]
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
          "id": "d1a535b0061e46fe228bbc6bc6750aaa1a3d682a",
          "message": "docs: update AGENTS.md wiki instructions and fix man page version\n\nAdd explicit wiki clone URL and expand wiki update guidance in AGENTS.md.\nRegenerate docs/retch.1 to correct version header (0.3.4 → 0.3.5).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:47:53-07:00",
          "tree_id": "475ab89487f022b32be2a0ef3c9080b336f41d0a",
          "url": "https://github.com/l1a/retch/commit/d1a535b0061e46fe228bbc6bc6750aaa1a3d682a"
        },
        "date": 1780973658345,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2692372.3200000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 51177297.019999996,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 47908540.069903456,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.12955998208099,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.028355815768492,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.53341444621142,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20693.72688741961,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1693895.4467263755,
            "unit": "ns"
          }
        ]
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
          "id": "6365e661aa70ab10a23ae29fda01d1c7a2afb036",
          "message": "chore: add Claude Code project settings\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:50:21-07:00",
          "tree_id": "c23a0e102dc774a5a06b0156115a4810d15e542e",
          "url": "https://github.com/l1a/retch/commit/6365e661aa70ab10a23ae29fda01d1c7a2afb036"
        },
        "date": 1780973740916,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2421600.6999999997,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 124445017.89999999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 128226387.5125,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 57.15461252855706,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.87719089790826,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.87878085783128,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17452.599532836517,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1591873.9440267335,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f896b26e8e028d7e3da3f7410b8aa71626ccd0a",
          "message": "Merge pull request #76 from l1a/refactor/bluetooth-module-isolation\n\nrefactor: isolate bluetooth detection into bluetooth.rs (v0.3.8)",
          "timestamp": "2026-06-09T21:49:44-07:00",
          "tree_id": "647698914519fc33c11cc2b44a86c80c889bbb2e",
          "url": "https://github.com/l1a/retch/commit/0f896b26e8e028d7e3da3f7410b8aa71626ccd0a"
        },
        "date": 1781067372413,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2905756.7000000007,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 57140370.39999999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 46974578.68638315,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.191510092434996,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.047197307426839,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.10158935683857,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20658.946490777198,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1689815.011224439,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b6a7b695d96cacf9bae9f744dd7e0f163af32ee",
          "message": "Merge pull request #77 from l1a/test/coverage-and-benchmarks\n\ntest: expand unit test coverage and add network/audio/camera benchmarks (v0.3.10)",
          "timestamp": "2026-06-09T22:46:29-07:00",
          "tree_id": "a702e4595123a3fc74cefe901ec8127d4700e4d0",
          "url": "https://github.com/l1a/retch/commit/7b6a7b695d96cacf9bae9f744dd7e0f163af32ee"
        },
        "date": 1781070753192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2702041.1200000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 130571800.11999997,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 127832610.3125,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2170.9365782228597,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 59.64212285741244,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.082887115729416,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.73206909953124,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20619.701099016624,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1679238.229126642,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.9132136096274,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 257.18335048468555,
            "unit": "ns"
          }
        ]
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
          "id": "7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d",
          "message": "chore: update man page version to 0.3.10\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T22:48:20-07:00",
          "tree_id": "bdc9b4add1d8ea07f2c5eb90c710ad3ac8886e0b",
          "url": "https://github.com/l1a/retch/commit/7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d"
        },
        "date": 1781070861314,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1582095.4800000002,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 99144201.28,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 98831257.95000002,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1083.2713286868088,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 50.33564560044848,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.430520005292243,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.24895667724807,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8668.872378369584,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1534494.1408090123,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 335.793855518181,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 244.50825116326968,
            "unit": "ns"
          }
        ]
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
          "id": "b7aad0ecc68d947a37cd0e781bc1689f3b53353c",
          "message": "chore: gitignore .claude/settings.local.json\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T23:11:11-07:00",
          "tree_id": "6e3904c23e95d4f1d5ddd0dd2790840ece0051c6",
          "url": "https://github.com/l1a/retch/commit/b7aad0ecc68d947a37cd0e781bc1689f3b53353c"
        },
        "date": 1781072293834,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2817510.08,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 62234089.98,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 54560789.74106376,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2134.5974438762673,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.60013599728306,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.097176351155756,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.05089075271891,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20704.86043739923,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1674502.8012226403,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 355.0625720910597,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.20279773562595,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3",
          "message": "Merge pull request #78 from l1a/feat/local-bench-upload\n\nfeat: upload local benchmark results to gh-pages dashboard",
          "timestamp": "2026-06-10T11:45:58-07:00",
          "tree_id": "7494cb4cd48958c6d8510a10e2cd5d12fedc8879",
          "url": "https://github.com/l1a/retch/commit/9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3"
        },
        "date": 1781117515440,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2452317.8000000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 58189927.70000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 54676637.91446094,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2041.5553479542043,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 56.24919701319236,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.865944950755224,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.66174144072492,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17659.780194108007,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1555595.0102161793,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 369.79218117981344,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 245.59586861390235,
            "unit": "ns"
          }
        ]
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
          "id": "7895eef6117882a2078c051541be19016a6f0061",
          "message": "fix: don't forward git hook args to upload script\n\nGit passes a single positional arg to post-merge hooks (0 = merge,\n1 = squash merge). Forwarding it via \"$@\" caused argparse to reject\nit as an unrecognized argument on the first real merge.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:47:00-07:00",
          "tree_id": "d2d1f4f9986d0168c22966bd9be2a027ae5a8321",
          "url": "https://github.com/l1a/retch/commit/7895eef6117882a2078c051541be19016a6f0061"
        },
        "date": 1781117578560,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1634631.7,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 60381035.30000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 53345800.03323691,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1064.5189357910454,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 50.414591646894955,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.45247730207542,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.59260051011965,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8637.79848444849,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1558383.0425348694,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 335.72760669236914,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 262.56796916419785,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781122349745,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2718230.92,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 52808726.52,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 48283498.61139082,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2152.150292506459,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.553829805866016,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.049685932500863,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.67141325932776,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20707.434177577365,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1694647.289150155,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 371.86104183660706,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 257.6886440205147,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5",
          "message": "refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12) (#80)\n\n* chore: document native probe replacement opportunities in Next Steps\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12)\n\n- GPU: registry enum under display adapter class GUID {4d36e968-...}\n  reads DriverDesc and HardwareInformation.MemorySize natively\n- Audio: registry enum under media device class GUID {4d36e96c-...}\n  reads DriverDesc natively\n- Display: EnumDisplayDevicesW + EnumDisplaySettingsW via user32.dll FFI,\n  enumerating only active adapters with current resolution/refresh rate\n- Motherboard/BIOS: drop wmic last-resort fallback; registry is sole source\n- win_reg: add get_reg_binary and enum_reg_subkeys helpers\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): add #[link(name = \"user32\")] for EnumDisplayDevicesW/SettingsW\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* ci: add workflow_dispatch trigger and guard release job to clean tags only\n\nworkflow_dispatch allows manually triggering build-release on any branch.\nRelease job now skips prerelease tags (anything with a hyphen, e.g. v0.3.12-rc.1).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): correct DEVMODEW struct layout to prevent stack corruption on Windows\n\nThe DevMode struct was 148 bytes but DEVMODEW is 220 bytes; EnumDisplaySettingsW\nwas writing 72 bytes past the end, corrupting the stack and causing silent crash\n(no output at all). Added all missing fields with correct offsets and initialize\nvia std::mem::zeroed() to match the Win32 ABI.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:20:27-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5"
        },
        "date": 1781216757772,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2117593.7600000002,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 126186864.56,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 124741680.17999999,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1745.9554835714407,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.47735071925575,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.8986546335786363,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.09008447408412,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 15990.746769634006,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1282957.619127117,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 282.7934654155488,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 203.1166318962874,
            "unit": "ns"
          }
        ]
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
          "id": "63e90a2cf2ac77c5b976c363ca3e659705a634e9",
          "message": "chore: merge main with upstream (resolve AGENTS.md conflict, keep v0.3.12 state)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:21:13-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/63e90a2cf2ac77c5b976c363ca3e659705a634e9"
        },
        "date": 1781216868831,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1618553.72,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 53576719.52,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 50305059.985611066,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1084.3472301516244,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.368354400099946,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.452361629637752,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.31544438197125,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8555.46544665659,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1545272.6161965732,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 334.53844524813036,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.3480482903226,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bc2115522b629470d7f515b5636079a768c4a2ef",
          "message": "docs: replace Copyright (C) with SPDX-FileCopyrightText in all source headers (v0.3.13) (#84)\n\nSwitches from the informal `// Copyright (C) 2026 l1a` form to the\nmachine-readable SPDX standard. FileCopyrightText now appears above\nSPDX-License-Identifier per the SPDX spec. Closes #81.\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T19:04:06-07:00",
          "tree_id": "73a275088e6c82ea9d136b5bf10979ebb3970013",
          "url": "https://github.com/l1a/retch/commit/bc2115522b629470d7f515b5636079a768c4a2ef"
        },
        "date": 1781230210748,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 2401328.98,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 103800127.98000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 104097320.99,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1980.2948852069821,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.558355689845044,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.866370847698173,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.93245259690167,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17366.32751870872,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1585350.4372593265,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 369.6322229977919,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 254.07004735019154,
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
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780505121983,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 7761415.420000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 123946831.62000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 160621066.32999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 2211247.5628870428,
            "unit": "ns"
          }
        ]
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
          "id": "4be849d2c552d060db86bbc11683a8fd251f0c0b",
          "message": "Configure git safe directory inside Fedora containers",
          "timestamp": "2026-06-03T09:54:28-07:00",
          "tree_id": "bef608005f117a8a29ffa44e7f42771ecd3cd4b0",
          "url": "https://github.com/l1a/retch/commit/4be849d2c552d060db86bbc11683a8fd251f0c0b"
        },
        "date": 1780506250001,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1647170.7599999998,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 115556347.46,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 116973953.98999996,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1158992.7039175942,
            "unit": "ns"
          }
        ]
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
          "id": "10396be118bf4df2bef9664e6b79dcfa48c6328f",
          "message": "Disable fail-on-alert to tolerate VM noise",
          "timestamp": "2026-06-03T10:13:15-07:00",
          "tree_id": "fe92c928d5f66c210b9dae49414504acb40aa04f",
          "url": "https://github.com/l1a/retch/commit/10396be118bf4df2bef9664e6b79dcfa48c6328f"
        },
        "date": 1780507287970,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1642810.24,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 141917269.94,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 122871702.35,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1171179.1325786265,
            "unit": "ns"
          }
        ]
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
          "id": "99579ba9289002ec5b191f0921b65bfa9ed8570e",
          "message": "Import os in hyperfine installer",
          "timestamp": "2026-06-03T10:50:50-07:00",
          "tree_id": "a6778a7f2d5c8c964e660b60709cedc84c67ac99",
          "url": "https://github.com/l1a/retch/commit/99579ba9289002ec5b191f0921b65bfa9ed8570e"
        },
        "date": 1780509532126,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1693342.82,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 128474215.62,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 134488092.5125,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1164924.5852958518,
            "unit": "ns"
          }
        ]
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
          "id": "248b7b5a9f9a1a3eb5b62512ffa362eac159b756",
          "message": "Configure Windows PATH in benchmark jobs",
          "timestamp": "2026-06-03T11:23:32-07:00",
          "tree_id": "4428a646927f214627bae22beffb50b429e372fd",
          "url": "https://github.com/l1a/retch/commit/248b7b5a9f9a1a3eb5b62512ffa362eac159b756"
        },
        "date": 1780511491455,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1836870.7000000002,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 127144102.90000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 128288516.875,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1171185.1759193104,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b13e968dc483454c9fbb632a9714d46474bdc678",
          "message": "Merge pull request #66 from l1a/feature/multi-platform-benchmarks\n\nv0.3.2 - macOS Battery/Bluetooth Fixes & Multi-Platform Benchmarks",
          "timestamp": "2026-06-03T12:36:18-07:00",
          "tree_id": "150eb86f6551ec2ce10a0920f17d572403943ffe",
          "url": "https://github.com/l1a/retch/commit/b13e968dc483454c9fbb632a9714d46474bdc678"
        },
        "date": 1780515864545,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1645353.9199999997,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 79994650.52,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 79248902.03224066,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1171900.1484419117,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "046c8e0b0137a548dcb51d46fef7703b46efe9cc",
          "message": "v0.3.3 - Native OS Queries & Performance Optimization (#68)\n\n* Implement native queries for route, displays, reg\n\n* Allow clippy upper_case_acronyms for win_reg\n\n* Bump version to 0.3.3 and rebuild man pages\n\n* Test route parsing and wire up helper\n\n* Restrict route parser to Linux or tests",
          "timestamp": "2026-06-04T08:16:04-07:00",
          "tree_id": "969803f451b805de37c1b56fbebdded3f6c125d3",
          "url": "https://github.com/l1a/retch/commit/046c8e0b0137a548dcb51d46fef7703b46efe9cc"
        },
        "date": 1780586656275,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1734715.3800000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 131648437.68000004,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 135873450.325,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1199195.8797652118,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "585270b923d52522281c533fb0763203d8a90b40",
          "message": "Update CLI flags for short, long, and mode options (#70)",
          "timestamp": "2026-06-04T09:08:05-07:00",
          "tree_id": "0ea02c92aac1141943ac5f8df9742e9e9034f14f",
          "url": "https://github.com/l1a/retch/commit/585270b923d52522281c533fb0763203d8a90b40"
        },
        "date": 1780589758078,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1494031.1400000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 120541551.94000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 125365379.65,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1187078.65584739,
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
          "id": "2c8929eff22476a7f6682a4f1a22b68ffe13b346",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#69)\n\n* deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [sysinfo](https://github.com/GuillaumeGomez/sysinfo) and [chrono](https://github.com/chronotope/chrono).\n\n\nUpdates `sysinfo` from 0.39.2 to 0.39.3\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.2...v0.39.3)\n\nUpdates `chrono` from 0.4.44 to 0.4.45\n- [Release notes](https://github.com/chronotope/chrono/releases)\n- [Changelog](https://github.com/chronotope/chrono/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/chronotope/chrono/compare/v0.4.44...v0.4.45)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.3\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: chrono\n  dependency-version: 0.4.45\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\n\n* Bump version to 0.3.4 and update docs\n\n---------\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\nCo-authored-by: Ken Tobias <634380+l1a@users.noreply.github.com>",
          "timestamp": "2026-06-04T09:50:00-07:00",
          "tree_id": "da1fab8118438991920da275cd4aa46f9a678a63",
          "url": "https://github.com/l1a/retch/commit/2c8929eff22476a7f6682a4f1a22b68ffe13b346"
        },
        "date": 1780592309740,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1588618.1000000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 113862414.60000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 119658119.9375,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1194063.560649429,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03f2f059fb0ad385d838b489f3e4ac1b62e6855b",
          "message": "refactor: isolate display parsing into display.rs, expand tests and benchmarks (v0.3.5)\n\nExtracts all display detection and EDID parsing from fetch.rs into crates/sysinfo/src/display.rs. Adds 13 new unit tests (22→35) covering edge cases and 4 new criterion benchmarks for the pure EDID parsing functions. Bumps retch-cli to 0.3.5, retch-sysinfo to 0.1.5.",
          "timestamp": "2026-06-08T11:57:39-07:00",
          "tree_id": "7f7cbba8a52f301fe9a06fec1ddbf7bae7034a21",
          "url": "https://github.com/l1a/retch/commit/03f2f059fb0ad385d838b489f3e4ac1b62e6855b"
        },
        "date": 1780945684599,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1671616.2400000002,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 125390029.64000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 125236374.9875,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.532825529994476,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947117195537423,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.20186907072381,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7712.078200010743,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1194001.4732250487,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906c5abfb8923400935698c0e78970d34b0db97c",
          "message": "Update AGENTS.md progress and next steps (#72)",
          "timestamp": "2026-06-08T12:33:05-07:00",
          "tree_id": "1de64e381b62d4f79deb5adacbc4da43901fc6ff",
          "url": "https://github.com/l1a/retch/commit/906c5abfb8923400935698c0e78970d34b0db97c"
        },
        "date": 1780947785867,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1612419.34,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 130786158.04000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 118941517.6375,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.64692646795283,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469628500790273,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.37384005753361,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7750.960963922956,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1202763.581845607,
            "unit": "ns"
          }
        ]
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
          "id": "d1a535b0061e46fe228bbc6bc6750aaa1a3d682a",
          "message": "docs: update AGENTS.md wiki instructions and fix man page version\n\nAdd explicit wiki clone URL and expand wiki update guidance in AGENTS.md.\nRegenerate docs/retch.1 to correct version header (0.3.4 → 0.3.5).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:47:53-07:00",
          "tree_id": "475ab89487f022b32be2a0ef3c9080b336f41d0a",
          "url": "https://github.com/l1a/retch/commit/d1a535b0061e46fe228bbc6bc6750aaa1a3d682a"
        },
        "date": 1780973939404,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1800408.3000000005,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 125876638.5,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 122376872.6375,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.697836441891994,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467642087258294,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.2287945108465,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7693.995053912846,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1198006.3786967222,
            "unit": "ns"
          }
        ]
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
          "id": "6365e661aa70ab10a23ae29fda01d1c7a2afb036",
          "message": "chore: add Claude Code project settings\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:50:21-07:00",
          "tree_id": "c23a0e102dc774a5a06b0156115a4810d15e542e",
          "url": "https://github.com/l1a/retch/commit/6365e661aa70ab10a23ae29fda01d1c7a2afb036"
        },
        "date": 1780974019857,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1748969.9000000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 152174821.29999998,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 139231941.8125,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.19150267096386,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947413592611558,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.42640238498519,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7644.2357289325355,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1192631.15916868,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f896b26e8e028d7e3da3f7410b8aa71626ccd0a",
          "message": "Merge pull request #76 from l1a/refactor/bluetooth-module-isolation\n\nrefactor: isolate bluetooth detection into bluetooth.rs (v0.3.8)",
          "timestamp": "2026-06-09T21:49:44-07:00",
          "tree_id": "647698914519fc33c11cc2b44a86c80c889bbb2e",
          "url": "https://github.com/l1a/retch/commit/0f896b26e8e028d7e3da3f7410b8aa71626ccd0a"
        },
        "date": 1781067650385,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1742370.2600000002,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 142350533.46000004,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 126854834.6875,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 53.1959979313678,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946941334232137,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.59544217565876,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7788.8363407275565,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1192197.6708792693,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b6a7b695d96cacf9bae9f744dd7e0f163af32ee",
          "message": "Merge pull request #77 from l1a/test/coverage-and-benchmarks\n\ntest: expand unit test coverage and add network/audio/camera benchmarks (v0.3.10)",
          "timestamp": "2026-06-09T22:46:29-07:00",
          "tree_id": "a702e4595123a3fc74cefe901ec8127d4700e4d0",
          "url": "https://github.com/l1a/retch/commit/7b6a7b695d96cacf9bae9f744dd7e0f163af32ee"
        },
        "date": 1781071108930,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1856027.2999999998,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 139444450.2,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 131158632.125,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 989.9633922918658,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 46.80824170422402,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9465605257654603,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.06799676999121,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7683.226116883046,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1223488.6685310898,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.6245535480176,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 273.8372424405814,
            "unit": "ns"
          }
        ]
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
          "id": "7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d",
          "message": "chore: update man page version to 0.3.10\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T22:48:20-07:00",
          "tree_id": "bdc9b4add1d8ea07f2c5eb90c710ad3ac8886e0b",
          "url": "https://github.com/l1a/retch/commit/7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d"
        },
        "date": 1781071190824,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1634551.2799999998,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 145163339.38000003,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 153649823.0125,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 979.5422924590468,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.64612100615646,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469121473225335,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.57390616707584,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7588.7316689881845,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1226167.029669763,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.5567841593622,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 253.29708700871112,
            "unit": "ns"
          }
        ]
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
          "id": "b7aad0ecc68d947a37cd0e781bc1689f3b53353c",
          "message": "chore: gitignore .claude/settings.local.json\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T23:11:11-07:00",
          "tree_id": "6e3904c23e95d4f1d5ddd0dd2790840ece0051c6",
          "url": "https://github.com/l1a/retch/commit/b7aad0ecc68d947a37cd0e781bc1689f3b53353c"
        },
        "date": 1781072661527,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1513472.66,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 148291400.66,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 139565118.5375,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 977.9983822574729,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.158729424808875,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946523450349677,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.182927238081035,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7652.194164291044,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1207513.208224632,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 359.75627757352925,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 256.27466237672945,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3",
          "message": "Merge pull request #78 from l1a/feat/local-bench-upload\n\nfeat: upload local benchmark results to gh-pages dashboard",
          "timestamp": "2026-06-10T11:45:58-07:00",
          "tree_id": "7494cb4cd48958c6d8510a10e2cd5d12fedc8879",
          "url": "https://github.com/l1a/retch/commit/9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3"
        },
        "date": 1781117883478,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1481745.4000000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 80205325.50000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 76920498.31050932,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 982.9709570325022,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.10803207821696,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946830719851264,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.95719222898467,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7689.5923264919475,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1224500.2363520577,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 358.16615449911467,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.4828539960609,
            "unit": "ns"
          }
        ]
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
          "id": "7895eef6117882a2078c051541be19016a6f0061",
          "message": "fix: don't forward git hook args to upload script\n\nGit passes a single positional arg to post-merge hooks (0 = merge,\n1 = squash merge). Forwarding it via \"$@\" caused argparse to reject\nit as an unrecognized argument on the first real merge.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:47:00-07:00",
          "tree_id": "d2d1f4f9986d0168c22966bd9be2a027ae5a8321",
          "url": "https://github.com/l1a/retch/commit/7895eef6117882a2078c051541be19016a6f0061"
        },
        "date": 1781117896056,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1605852.8800000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 78450411.88000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 78815214.20738563,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1054.6536152498147,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.350059468620074,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9464468663944094,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.383331694280585,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7604.917036351386,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1215103.989065744,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.78157111318257,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.1039983552042,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781122677095,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1506278.9199999997,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 78064423.02000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 77234656.26505831,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 991.0095202933302,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 53.179668878736535,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946484447904202,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.54736351266403,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7612.682723950083,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1191723.096068653,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 355.78827161247375,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 252.0907215506655,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5",
          "message": "refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12) (#80)\n\n* chore: document native probe replacement opportunities in Next Steps\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12)\n\n- GPU: registry enum under display adapter class GUID {4d36e968-...}\n  reads DriverDesc and HardwareInformation.MemorySize natively\n- Audio: registry enum under media device class GUID {4d36e96c-...}\n  reads DriverDesc natively\n- Display: EnumDisplayDevicesW + EnumDisplaySettingsW via user32.dll FFI,\n  enumerating only active adapters with current resolution/refresh rate\n- Motherboard/BIOS: drop wmic last-resort fallback; registry is sole source\n- win_reg: add get_reg_binary and enum_reg_subkeys helpers\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): add #[link(name = \"user32\")] for EnumDisplayDevicesW/SettingsW\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* ci: add workflow_dispatch trigger and guard release job to clean tags only\n\nworkflow_dispatch allows manually triggering build-release on any branch.\nRelease job now skips prerelease tags (anything with a hyphen, e.g. v0.3.12-rc.1).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): correct DEVMODEW struct layout to prevent stack corruption on Windows\n\nThe DevMode struct was 148 bytes but DEVMODEW is 220 bytes; EnumDisplaySettingsW\nwas writing 72 bytes past the end, corrupting the stack and causing silent crash\n(no output at all). Added all missing fields with correct offsets and initialize\nvia std::mem::zeroed() to match the Win32 ABI.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:20:27-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5"
        },
        "date": 1781217089248,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1741435.3600000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 130194617.46000002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 137774525.675,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 988.6904722738385,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.36522604592497,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468363026789026,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 54.03180137579259,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7668.297907057748,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1196966.2194858154,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 356.23974732325325,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.6589710508733,
            "unit": "ns"
          }
        ]
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
          "id": "63e90a2cf2ac77c5b976c363ca3e659705a634e9",
          "message": "chore: merge main with upstream (resolve AGENTS.md conflict, keep v0.3.12 state)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:21:13-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/63e90a2cf2ac77c5b976c363ca3e659705a634e9"
        },
        "date": 1781217212716,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1711395.8600000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 120972924.25999999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 123607686.24000001,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 983.0386865974785,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 47.80711553385023,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946782553408296,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 54.0641086202906,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7668.610324316721,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1195230.6811031015,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 356.01174411094615,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.47204075129844,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bc2115522b629470d7f515b5636079a768c4a2ef",
          "message": "docs: replace Copyright (C) with SPDX-FileCopyrightText in all source headers (v0.3.13) (#84)\n\nSwitches from the informal `// Copyright (C) 2026 l1a` form to the\nmachine-readable SPDX standard. FileCopyrightText now appears above\nSPDX-License-Identifier per the SPDX spec. Closes #81.\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T19:04:06-07:00",
          "tree_id": "73a275088e6c82ea9d136b5bf10979ebb3970013",
          "url": "https://github.com/l1a/retch/commit/bc2115522b629470d7f515b5636079a768c4a2ef"
        },
        "date": 1781230535426,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 1877292.8599999999,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 123480907.05999999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 127816550.6375,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 975.8024555820291,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 53.31399893325083,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946711712147709,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.401838785461266,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7618.644377963869,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 1205109.1619187011,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 354.70511750908753,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.0627642825205,
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
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780505315079,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 25217875,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 510603371.2,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 493514985.25,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 165164331.2625,
            "unit": "ns"
          }
        ]
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
          "id": "4be849d2c552d060db86bbc11683a8fd251f0c0b",
          "message": "Configure git safe directory inside Fedora containers",
          "timestamp": "2026-06-03T09:54:28-07:00",
          "tree_id": "bef608005f117a8a29ffa44e7f42771ecd3cd4b0",
          "url": "https://github.com/l1a/retch/commit/4be849d2c552d060db86bbc11683a8fd251f0c0b"
        },
        "date": 1780506481052,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 75272364.03999999,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 807709951.64,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 699583877.1,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 238081344.8,
            "unit": "ns"
          }
        ]
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
          "id": "10396be118bf4df2bef9664e6b79dcfa48c6328f",
          "message": "Disable fail-on-alert to tolerate VM noise",
          "timestamp": "2026-06-03T10:13:15-07:00",
          "tree_id": "fe92c928d5f66c210b9dae49414504acb40aa04f",
          "url": "https://github.com/l1a/retch/commit/10396be118bf4df2bef9664e6b79dcfa48c6328f"
        },
        "date": 1780507507408,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 28430545.78,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 577028195.88,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 529279358.25,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 185752405.58333337,
            "unit": "ns"
          }
        ]
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
          "id": "99579ba9289002ec5b191f0921b65bfa9ed8570e",
          "message": "Import os in hyperfine installer",
          "timestamp": "2026-06-03T10:50:50-07:00",
          "tree_id": "a6778a7f2d5c8c964e660b60709cedc84c67ac99",
          "url": "https://github.com/l1a/retch/commit/99579ba9289002ec5b191f0921b65bfa9ed8570e"
        },
        "date": 1780509729017,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 21547583.280000005,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 646849179.38,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 649175814.6,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 192708705.59999996,
            "unit": "ns"
          }
        ]
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
          "id": "248b7b5a9f9a1a3eb5b62512ffa362eac159b756",
          "message": "Configure Windows PATH in benchmark jobs",
          "timestamp": "2026-06-03T11:23:32-07:00",
          "tree_id": "4428a646927f214627bae22beffb50b429e372fd",
          "url": "https://github.com/l1a/retch/commit/248b7b5a9f9a1a3eb5b62512ffa362eac159b756"
        },
        "date": 1780511771052,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 61485096.62000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 963592800.82,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 642482901.95,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 205128734.70000002,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b13e968dc483454c9fbb632a9714d46474bdc678",
          "message": "Merge pull request #66 from l1a/feature/multi-platform-benchmarks\n\nv0.3.2 - macOS Battery/Bluetooth Fixes & Multi-Platform Benchmarks",
          "timestamp": "2026-06-03T12:36:18-07:00",
          "tree_id": "150eb86f6551ec2ce10a0920f17d572403943ffe",
          "url": "https://github.com/l1a/retch/commit/b13e968dc483454c9fbb632a9714d46474bdc678"
        },
        "date": 1780516153249,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 37701575.04000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 835256279.34,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 681351860.4,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 222356470.11666662,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "046c8e0b0137a548dcb51d46fef7703b46efe9cc",
          "message": "v0.3.3 - Native OS Queries & Performance Optimization (#68)\n\n* Implement native queries for route, displays, reg\n\n* Allow clippy upper_case_acronyms for win_reg\n\n* Bump version to 0.3.3 and rebuild man pages\n\n* Test route parsing and wire up helper\n\n* Restrict route parser to Linux or tests",
          "timestamp": "2026-06-04T08:16:04-07:00",
          "tree_id": "969803f451b805de37c1b56fbebdded3f6c125d3",
          "url": "https://github.com/l1a/retch/commit/046c8e0b0137a548dcb51d46fef7703b46efe9cc"
        },
        "date": 1780586912988,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 48269025.02000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 662474504.3199999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 553133452.25,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 180303960.4166667,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "585270b923d52522281c533fb0763203d8a90b40",
          "message": "Update CLI flags for short, long, and mode options (#70)",
          "timestamp": "2026-06-04T09:08:05-07:00",
          "tree_id": "0ea02c92aac1141943ac5f8df9742e9e9034f14f",
          "url": "https://github.com/l1a/retch/commit/585270b923d52522281c533fb0763203d8a90b40"
        },
        "date": 1780590003385,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 22603521.88,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 635073225.88,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 652311333.4,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 254923886.475,
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
          "id": "2c8929eff22476a7f6682a4f1a22b68ffe13b346",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#69)\n\n* deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [sysinfo](https://github.com/GuillaumeGomez/sysinfo) and [chrono](https://github.com/chronotope/chrono).\n\n\nUpdates `sysinfo` from 0.39.2 to 0.39.3\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.2...v0.39.3)\n\nUpdates `chrono` from 0.4.44 to 0.4.45\n- [Release notes](https://github.com/chronotope/chrono/releases)\n- [Changelog](https://github.com/chronotope/chrono/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/chronotope/chrono/compare/v0.4.44...v0.4.45)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.3\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: chrono\n  dependency-version: 0.4.45\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\n\n* Bump version to 0.3.4 and update docs\n\n---------\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\nCo-authored-by: Ken Tobias <634380+l1a@users.noreply.github.com>",
          "timestamp": "2026-06-04T09:50:00-07:00",
          "tree_id": "da1fab8118438991920da275cd4aa46f9a678a63",
          "url": "https://github.com/l1a/retch/commit/2c8929eff22476a7f6682a4f1a22b68ffe13b346"
        },
        "date": 1780592597618,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 45462051.52,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 687445322.32,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 825187608.1,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 218848881.26666665,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03f2f059fb0ad385d838b489f3e4ac1b62e6855b",
          "message": "refactor: isolate display parsing into display.rs, expand tests and benchmarks (v0.3.5)\n\nExtracts all display detection and EDID parsing from fetch.rs into crates/sysinfo/src/display.rs. Adds 13 new unit tests (22→35) covering edge cases and 4 new criterion benchmarks for the pure EDID parsing functions. Bumps retch-cli to 0.3.5, retch-sysinfo to 0.1.5.",
          "timestamp": "2026-06-08T11:57:39-07:00",
          "tree_id": "7f7cbba8a52f301fe9a06fec1ddbf7bae7034a21",
          "url": "https://github.com/l1a/retch/commit/03f2f059fb0ad385d838b489f3e4ac1b62e6855b"
        },
        "date": 1780945985858,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 38992835.74000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 764596056.8400002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 581159804.05,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 68.95178764408351,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.1326906217146795,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 78.86113093156361,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 221724628.5166667,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906c5abfb8923400935698c0e78970d34b0db97c",
          "message": "Update AGENTS.md progress and next steps (#72)",
          "timestamp": "2026-06-08T12:33:05-07:00",
          "tree_id": "1de64e381b62d4f79deb5adacbc4da43901fc6ff",
          "url": "https://github.com/l1a/retch/commit/906c5abfb8923400935698c0e78970d34b0db97c"
        },
        "date": 1780948058750,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 58016843.32,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 755744585.1200001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 736686275.2,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.355189260999886,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8038632428410817,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 67.13559484323306,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 184268002.8,
            "unit": "ns"
          }
        ]
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
          "id": "d1a535b0061e46fe228bbc6bc6750aaa1a3d682a",
          "message": "docs: update AGENTS.md wiki instructions and fix man page version\n\nAdd explicit wiki clone URL and expand wiki update guidance in AGENTS.md.\nRegenerate docs/retch.1 to correct version header (0.3.4 → 0.3.5).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:47:53-07:00",
          "tree_id": "475ab89487f022b32be2a0ef3c9080b336f41d0a",
          "url": "https://github.com/l1a/retch/commit/d1a535b0061e46fe228bbc6bc6750aaa1a3d682a"
        },
        "date": 1780974231274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 33354239.92,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 825295831.6200001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 807255529.15,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 80.76306152631261,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.848595118406375,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.66523667196324,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 235141025,
            "unit": "ns"
          }
        ]
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
          "id": "6365e661aa70ab10a23ae29fda01d1c7a2afb036",
          "message": "chore: add Claude Code project settings\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:50:21-07:00",
          "tree_id": "c23a0e102dc774a5a06b0156115a4810d15e542e",
          "url": "https://github.com/l1a/retch/commit/6365e661aa70ab10a23ae29fda01d1c7a2afb036"
        },
        "date": 1780974306214,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 43840803.440000005,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 743785878.5400001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 636479587.6,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 67.81465770583218,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.370576809639824,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 79.44682579626115,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 191361719.43333334,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f896b26e8e028d7e3da3f7410b8aa71626ccd0a",
          "message": "Merge pull request #76 from l1a/refactor/bluetooth-module-isolation\n\nrefactor: isolate bluetooth detection into bluetooth.rs (v0.3.8)",
          "timestamp": "2026-06-09T21:49:44-07:00",
          "tree_id": "647698914519fc33c11cc2b44a86c80c889bbb2e",
          "url": "https://github.com/l1a/retch/commit/0f896b26e8e028d7e3da3f7410b8aa71626ccd0a"
        },
        "date": 1781067890568,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 25975985.180000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 630295797.7800002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 602215889.65,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.76157589525146,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7280894890660428,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.75193783327563,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 238908191.7333334,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b6a7b695d96cacf9bae9f744dd7e0f163af32ee",
          "message": "Merge pull request #77 from l1a/test/coverage-and-benchmarks\n\ntest: expand unit test coverage and add network/audio/camera benchmarks (v0.3.10)",
          "timestamp": "2026-06-09T22:46:29-07:00",
          "tree_id": "a702e4595123a3fc74cefe901ec8127d4700e4d0",
          "url": "https://github.com/l1a/retch/commit/7b6a7b695d96cacf9bae9f744dd7e0f163af32ee"
        },
        "date": 1781071467254,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 43493185.94000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 798174198.04,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 661514270.8,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 72.92325928895741,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.145094258287248,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 70.4778839876614,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 470.1814437824796,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 500.71903536347617,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 206868356.95,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 262.2284142522679,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 382.4681486668193,
            "unit": "ns"
          }
        ]
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
          "id": "7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d",
          "message": "chore: update man page version to 0.3.10\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T22:48:20-07:00",
          "tree_id": "bdc9b4add1d8ea07f2c5eb90c710ad3ac8886e0b",
          "url": "https://github.com/l1a/retch/commit/7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d"
        },
        "date": 1781071597349,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 26752377.400000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 834108827.5,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 828130699.95,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 82.39761496906411,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.661842465335566,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 78.34638462707922,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 522.6445522784336,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 469.18706994508705,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 234553769.45,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 340.18561125227296,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 441.1915154143024,
            "unit": "ns"
          }
        ]
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
          "id": "b7aad0ecc68d947a37cd0e781bc1689f3b53353c",
          "message": "chore: gitignore .claude/settings.local.json\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T23:11:11-07:00",
          "tree_id": "6e3904c23e95d4f1d5ddd0dd2790840ece0051c6",
          "url": "https://github.com/l1a/retch/commit/b7aad0ecc68d947a37cd0e781bc1689f3b53353c"
        },
        "date": 1781073057975,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 25084444.98,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 933132399.2800001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 838761679.2,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 91.11640800060579,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.8535009247204757,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 93.62660011744681,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 594.485249410084,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 511.3711068038127,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 234261384.71666664,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 338.42520818647347,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 486.77634748782305,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3",
          "message": "Merge pull request #78 from l1a/feat/local-bench-upload\n\nfeat: upload local benchmark results to gh-pages dashboard",
          "timestamp": "2026-06-10T11:45:58-07:00",
          "tree_id": "7494cb4cd48958c6d8510a10e2cd5d12fedc8879",
          "url": "https://github.com/l1a/retch/commit/9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3"
        },
        "date": 1781118182754,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 39998912.46000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 676838716.46,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 504508629.2,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.53069156807305,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.874605687932437,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 67.32036487729451,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 457.04476607590834,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 493.27215919705816,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 170516553.48333332,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 258.765904832029,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 385.2704935943115,
            "unit": "ns"
          }
        ]
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
          "id": "7895eef6117882a2078c051541be19016a6f0061",
          "message": "fix: don't forward git hook args to upload script\n\nGit passes a single positional arg to post-merge hooks (0 = merge,\n1 = squash merge). Forwarding it via \"$@\" caused argparse to reject\nit as an unrecognized argument on the first real merge.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:47:00-07:00",
          "tree_id": "d2d1f4f9986d0168c22966bd9be2a027ae5a8321",
          "url": "https://github.com/l1a/retch/commit/7895eef6117882a2078c051541be19016a6f0061"
        },
        "date": 1781118245511,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 39120020.82,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 852111279.0200001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 606065350.1,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 75.11372985711701,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9639334526405325,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 69.23876458222352,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 538.8210219173873,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 559.2947731751271,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 186900726.38333333,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 324.7974928412444,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 400.8696631799427,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781123044114,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 45922294.19999999,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 835044669.1,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 597151023,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 450.807316111447,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 76.63286044461677,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.4584673393307512,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 91.45594805708171,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 513.4537841690804,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 188709008.35000002,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 299.99509780503354,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 405.0172000977967,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5",
          "message": "refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12) (#80)\n\n* chore: document native probe replacement opportunities in Next Steps\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12)\n\n- GPU: registry enum under display adapter class GUID {4d36e968-...}\n  reads DriverDesc and HardwareInformation.MemorySize natively\n- Audio: registry enum under media device class GUID {4d36e96c-...}\n  reads DriverDesc natively\n- Display: EnumDisplayDevicesW + EnumDisplaySettingsW via user32.dll FFI,\n  enumerating only active adapters with current resolution/refresh rate\n- Motherboard/BIOS: drop wmic last-resort fallback; registry is sole source\n- win_reg: add get_reg_binary and enum_reg_subkeys helpers\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): add #[link(name = \"user32\")] for EnumDisplayDevicesW/SettingsW\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* ci: add workflow_dispatch trigger and guard release job to clean tags only\n\nworkflow_dispatch allows manually triggering build-release on any branch.\nRelease job now skips prerelease tags (anything with a hyphen, e.g. v0.3.12-rc.1).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): correct DEVMODEW struct layout to prevent stack corruption on Windows\n\nThe DevMode struct was 148 bytes but DEVMODEW is 220 bytes; EnumDisplaySettingsW\nwas writing 72 bytes past the end, corrupting the stack and causing silent crash\n(no output at all). Added all missing fields with correct offsets and initialize\nvia std::mem::zeroed() to match the Win32 ABI.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:20:27-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5"
        },
        "date": 1781217447144,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 33303625.90000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 752195946.8000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 737429522.9,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 460.6442981959787,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 68.72055951326702,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.0369261940956362,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 71.13139037506001,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 500.9883436721837,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 208549205.56666666,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 329.60070205314963,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 396.6549292327843,
            "unit": "ns"
          }
        ]
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
          "id": "63e90a2cf2ac77c5b976c363ca3e659705a634e9",
          "message": "chore: merge main with upstream (resolve AGENTS.md conflict, keep v0.3.12 state)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:21:13-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/63e90a2cf2ac77c5b976c363ca3e659705a634e9"
        },
        "date": 1781217529179,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 22856130.119999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 629696038.1200002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 629311231.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 360.38969927637606,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 62.14691273500953,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7657519024278503,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.71219392608329,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 406.4600966673603,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 225152112.53333336,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 253.23966196568963,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 351.55221596094896,
            "unit": "ns"
          }
        ]
      }
    ],
    "macOS x64 Benchmarks": [
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
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780505950917,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 86602963.5,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1806464442.9999998,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1752111058.35,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 479479598.075,
            "unit": "ns"
          }
        ]
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
          "id": "10396be118bf4df2bef9664e6b79dcfa48c6328f",
          "message": "Disable fail-on-alert to tolerate VM noise",
          "timestamp": "2026-06-03T10:13:15-07:00",
          "tree_id": "fe92c928d5f66c210b9dae49414504acb40aa04f",
          "url": "https://github.com/l1a/retch/commit/10396be118bf4df2bef9664e6b79dcfa48c6328f"
        },
        "date": 1780507908034,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 49609738.02,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1203784135.5199997,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1159229401.35,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 347490106.05,
            "unit": "ns"
          }
        ]
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
          "id": "99579ba9289002ec5b191f0921b65bfa9ed8570e",
          "message": "Import os in hyperfine installer",
          "timestamp": "2026-06-03T10:50:50-07:00",
          "tree_id": "a6778a7f2d5c8c964e660b60709cedc84c67ac99",
          "url": "https://github.com/l1a/retch/commit/99579ba9289002ec5b191f0921b65bfa9ed8570e"
        },
        "date": 1780510299813,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 81318748.32,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1757014477.82,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1700514930.55,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 483599617.05,
            "unit": "ns"
          }
        ]
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
          "id": "248b7b5a9f9a1a3eb5b62512ffa362eac159b756",
          "message": "Configure Windows PATH in benchmark jobs",
          "timestamp": "2026-06-03T11:23:32-07:00",
          "tree_id": "4428a646927f214627bae22beffb50b429e372fd",
          "url": "https://github.com/l1a/retch/commit/248b7b5a9f9a1a3eb5b62512ffa362eac159b756"
        },
        "date": 1780512288513,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 49143125.10000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1407442621.2,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1203015463.5,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 394957213.075,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b13e968dc483454c9fbb632a9714d46474bdc678",
          "message": "Merge pull request #66 from l1a/feature/multi-platform-benchmarks\n\nv0.3.2 - macOS Battery/Bluetooth Fixes & Multi-Platform Benchmarks",
          "timestamp": "2026-06-03T12:36:18-07:00",
          "tree_id": "150eb86f6551ec2ce10a0920f17d572403943ffe",
          "url": "https://github.com/l1a/retch/commit/b13e968dc483454c9fbb632a9714d46474bdc678"
        },
        "date": 1780516533455,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 47827468.080000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 953948447.48,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 987462102.85,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 339139120.675,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "046c8e0b0137a548dcb51d46fef7703b46efe9cc",
          "message": "v0.3.3 - Native OS Queries & Performance Optimization (#68)\n\n* Implement native queries for route, displays, reg\n\n* Allow clippy upper_case_acronyms for win_reg\n\n* Bump version to 0.3.3 and rebuild man pages\n\n* Test route parsing and wire up helper\n\n* Restrict route parser to Linux or tests",
          "timestamp": "2026-06-04T08:16:04-07:00",
          "tree_id": "969803f451b805de37c1b56fbebdded3f6c125d3",
          "url": "https://github.com/l1a/retch/commit/046c8e0b0137a548dcb51d46fef7703b46efe9cc"
        },
        "date": 1780587449776,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 50391748.57999999,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1222733806.18,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1013153915.1,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 436403352.15,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "585270b923d52522281c533fb0763203d8a90b40",
          "message": "Update CLI flags for short, long, and mode options (#70)",
          "timestamp": "2026-06-04T09:08:05-07:00",
          "tree_id": "0ea02c92aac1141943ac5f8df9742e9e9034f14f",
          "url": "https://github.com/l1a/retch/commit/585270b923d52522281c533fb0763203d8a90b40"
        },
        "date": 1780590333419,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 42529416.220000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1021728955.52,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 918635538.4,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 329175841.85,
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
          "id": "2c8929eff22476a7f6682a4f1a22b68ffe13b346",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#69)\n\n* deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [sysinfo](https://github.com/GuillaumeGomez/sysinfo) and [chrono](https://github.com/chronotope/chrono).\n\n\nUpdates `sysinfo` from 0.39.2 to 0.39.3\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.2...v0.39.3)\n\nUpdates `chrono` from 0.4.44 to 0.4.45\n- [Release notes](https://github.com/chronotope/chrono/releases)\n- [Changelog](https://github.com/chronotope/chrono/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/chronotope/chrono/compare/v0.4.44...v0.4.45)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.3\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: chrono\n  dependency-version: 0.4.45\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\n\n* Bump version to 0.3.4 and update docs\n\n---------\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\nCo-authored-by: Ken Tobias <634380+l1a@users.noreply.github.com>",
          "timestamp": "2026-06-04T09:50:00-07:00",
          "tree_id": "da1fab8118438991920da275cd4aa46f9a678a63",
          "url": "https://github.com/l1a/retch/commit/2c8929eff22476a7f6682a4f1a22b68ffe13b346"
        },
        "date": 1780593004808,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 34241447.64000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1761069548.74,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 985225782.9,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 425000239.425,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03f2f059fb0ad385d838b489f3e4ac1b62e6855b",
          "message": "refactor: isolate display parsing into display.rs, expand tests and benchmarks (v0.3.5)\n\nExtracts all display detection and EDID parsing from fetch.rs into crates/sysinfo/src/display.rs. Adds 13 new unit tests (22→35) covering edge cases and 4 new criterion benchmarks for the pure EDID parsing functions. Bumps retch-cli to 0.3.5, retch-sysinfo to 0.1.5.",
          "timestamp": "2026-06-08T11:57:39-07:00",
          "tree_id": "7f7cbba8a52f301fe9a06fec1ddbf7bae7034a21",
          "url": "https://github.com/l1a/retch/commit/03f2f059fb0ad385d838b489f3e4ac1b62e6855b"
        },
        "date": 1780946448180,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 70035862.34,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1378785037.6399999,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1336459505,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 190.79273041586856,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.9931633619415505,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 199.76201515524636,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 369394746.05,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906c5abfb8923400935698c0e78970d34b0db97c",
          "message": "Update AGENTS.md progress and next steps (#72)",
          "timestamp": "2026-06-08T12:33:05-07:00",
          "tree_id": "1de64e381b62d4f79deb5adacbc4da43901fc6ff",
          "url": "https://github.com/l1a/retch/commit/906c5abfb8923400935698c0e78970d34b0db97c"
        },
        "date": 1780948587584,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 50489630.059999995,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1129978028.5600002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1727761819.35,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 202.88868900162458,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.490288063532373,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 179.34719265633106,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 407455864.6,
            "unit": "ns"
          }
        ]
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
          "id": "d1a535b0061e46fe228bbc6bc6750aaa1a3d682a",
          "message": "docs: update AGENTS.md wiki instructions and fix man page version\n\nAdd explicit wiki clone URL and expand wiki update guidance in AGENTS.md.\nRegenerate docs/retch.1 to correct version header (0.3.4 → 0.3.5).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:47:53-07:00",
          "tree_id": "475ab89487f022b32be2a0ef3c9080b336f41d0a",
          "url": "https://github.com/l1a/retch/commit/d1a535b0061e46fe228bbc6bc6750aaa1a3d682a"
        },
        "date": 1780974744648,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 43381954.84000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1136734339.14,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1148302719.3,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 167.61776796120506,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.117189184841665,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 166.02349383153467,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 386434774.75,
            "unit": "ns"
          }
        ]
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
          "id": "6365e661aa70ab10a23ae29fda01d1c7a2afb036",
          "message": "chore: add Claude Code project settings\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:50:21-07:00",
          "tree_id": "c23a0e102dc774a5a06b0156115a4810d15e542e",
          "url": "https://github.com/l1a/retch/commit/6365e661aa70ab10a23ae29fda01d1c7a2afb036"
        },
        "date": 1780974937878,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 58802552.540000014,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1440001349.7400002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1663113744.05,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 197.02524225070766,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.491834234637113,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 200.28281996192382,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 394962652.425,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f896b26e8e028d7e3da3f7410b8aa71626ccd0a",
          "message": "Merge pull request #76 from l1a/refactor/bluetooth-module-isolation\n\nrefactor: isolate bluetooth detection into bluetooth.rs (v0.3.8)",
          "timestamp": "2026-06-09T21:49:44-07:00",
          "tree_id": "647698914519fc33c11cc2b44a86c80c889bbb2e",
          "url": "https://github.com/l1a/retch/commit/0f896b26e8e028d7e3da3f7410b8aa71626ccd0a"
        },
        "date": 1781068501750,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 40694299.28,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1088558911.0799997,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1046163210.95,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 158.78992360377214,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.214995626507594,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 210.12523946660977,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 337590502.775,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b6a7b695d96cacf9bae9f744dd7e0f163af32ee",
          "message": "Merge pull request #77 from l1a/test/coverage-and-benchmarks\n\ntest: expand unit test coverage and add network/audio/camera benchmarks (v0.3.10)",
          "timestamp": "2026-06-09T22:46:29-07:00",
          "tree_id": "a702e4595123a3fc74cefe901ec8127d4700e4d0",
          "url": "https://github.com/l1a/retch/commit/7b6a7b695d96cacf9bae9f744dd7e0f163af32ee"
        },
        "date": 1781071974150,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 46429249.12000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1078903954.42,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1253971008.4,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.53224714702614,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.476054369675374,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 178.064227304966,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 1288.0278992222106,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 832.6871647959839,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 357021371.175,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 655.0701124938821,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 864.7019636676941,
            "unit": "ns"
          }
        ]
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
          "id": "7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d",
          "message": "chore: update man page version to 0.3.10\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T22:48:20-07:00",
          "tree_id": "bdc9b4add1d8ea07f2c5eb90c710ad3ac8886e0b",
          "url": "https://github.com/l1a/retch/commit/7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d"
        },
        "date": 1781072144256,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 45616664.8,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1134138037.6000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1203473123.4,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 162.9416818498076,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.647443709370536,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 240.43047387457085,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 1248.9971215309197,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 838.926044179166,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 350405002.45,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 1010.7851061166408,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 848.3480159197545,
            "unit": "ns"
          }
        ]
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
          "id": "b7aad0ecc68d947a37cd0e781bc1689f3b53353c",
          "message": "chore: gitignore .claude/settings.local.json\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T23:11:11-07:00",
          "tree_id": "6e3904c23e95d4f1d5ddd0dd2790840ece0051c6",
          "url": "https://github.com/l1a/retch/commit/b7aad0ecc68d947a37cd0e781bc1689f3b53353c"
        },
        "date": 1781073623440,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 58575992.620000005,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1504315243.1200001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1701519930.15,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 204.89680672553135,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.059090657073172,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 207.48508909714488,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 1194.5406855840502,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 956.2497499572197,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 410231427.2,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 730.1023010588998,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 986.2346766933888,
            "unit": "ns"
          }
        ]
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
          "id": "7895eef6117882a2078c051541be19016a6f0061",
          "message": "fix: don't forward git hook args to upload script\n\nGit passes a single positional arg to post-merge hooks (0 = merge,\n1 = squash merge). Forwarding it via \"$@\" caused argparse to reject\nit as an unrecognized argument on the first real merge.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:47:00-07:00",
          "tree_id": "d2d1f4f9986d0168c22966bd9be2a027ae5a8321",
          "url": "https://github.com/l1a/retch/commit/7895eef6117882a2078c051541be19016a6f0061"
        },
        "date": 1781118738629,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 50488097.64000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1293745836.8400002,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1180733392.65,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 186.7544870116488,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.876839108443163,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 201.06968113635165,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 1186.8037829528425,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 959.3856200167904,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 370831145.3,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 710.7730448033604,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 1024.3650402808205,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3",
          "message": "Merge pull request #78 from l1a/feat/local-bench-upload\n\nfeat: upload local benchmark results to gh-pages dashboard",
          "timestamp": "2026-06-10T11:45:58-07:00",
          "tree_id": "7494cb4cd48958c6d8510a10e2cd5d12fedc8879",
          "url": "https://github.com/l1a/retch/commit/9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3"
        },
        "date": 1781118867181,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 47646864.78000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1391677700.88,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1475543078.35,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 217.1729566350798,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.841741332826775,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 227.45209884003566,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_camera",
            "value": 1332.2877800908866,
            "unit": "ns"
          },
          {
            "name": "fetch__parse_macos_gamepad",
            "value": 1096.3431533527455,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 521119937.75,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 799.8298694007746,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 1121.0401814641896,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781123823723,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 69878760.66000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1458047564.1599998,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1381714523.95,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 1005.0395103966196,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 198.4555782294506,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.405322527695416,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 205.87397039828815,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 911.0284096980733,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 555151494.4,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 994.4206402057429,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 1350.9234591759175,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5",
          "message": "refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12) (#80)\n\n* chore: document native probe replacement opportunities in Next Steps\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12)\n\n- GPU: registry enum under display adapter class GUID {4d36e968-...}\n  reads DriverDesc and HardwareInformation.MemorySize natively\n- Audio: registry enum under media device class GUID {4d36e96c-...}\n  reads DriverDesc natively\n- Display: EnumDisplayDevicesW + EnumDisplaySettingsW via user32.dll FFI,\n  enumerating only active adapters with current resolution/refresh rate\n- Motherboard/BIOS: drop wmic last-resort fallback; registry is sole source\n- win_reg: add get_reg_binary and enum_reg_subkeys helpers\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): add #[link(name = \"user32\")] for EnumDisplayDevicesW/SettingsW\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* ci: add workflow_dispatch trigger and guard release job to clean tags only\n\nworkflow_dispatch allows manually triggering build-release on any branch.\nRelease job now skips prerelease tags (anything with a hyphen, e.g. v0.3.12-rc.1).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): correct DEVMODEW struct layout to prevent stack corruption on Windows\n\nThe DevMode struct was 148 bytes but DEVMODEW is 220 bytes; EnumDisplaySettingsW\nwas writing 72 bytes past the end, corrupting the stack and causing silent crash\n(no output at all). Added all missing fields with correct offsets and initialize\nvia std::mem::zeroed() to match the Win32 ABI.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:20:27-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5"
        },
        "date": 1781217914257,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 42308356.90000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 992990958.9000001,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 979812797.95,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 884.6833676706043,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 158.6138793993676,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.9547604475146643,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 160.90203405734732,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 762.639040623975,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 333988373.675,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 591.4957823277172,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 797.4233155155932,
            "unit": "ns"
          }
        ]
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
          "id": "63e90a2cf2ac77c5b976c363ca3e659705a634e9",
          "message": "chore: merge main with upstream (resolve AGENTS.md conflict, keep v0.3.12 state)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:21:13-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/63e90a2cf2ac77c5b976c363ca3e659705a634e9"
        },
        "date": 1781218210586,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 64140989.58,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1814256579.58,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1618335147.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 1277.5578667349082,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 255.50409602768232,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.450850051650091,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 237.98064664114796,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 1210.8894961797314,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 430923878.525,
            "unit": "ns"
          },
          {
            "name": "network__parse_airport_output",
            "value": 916.9762327390988,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 1205.8170979448491,
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
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780506529919,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 61749514.00000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1895461183.9999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 330724985,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1436585585,
            "unit": "ns"
          }
        ]
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
          "id": "248b7b5a9f9a1a3eb5b62512ffa362eac159b756",
          "message": "Configure Windows PATH in benchmark jobs",
          "timestamp": "2026-06-03T11:23:32-07:00",
          "tree_id": "4428a646927f214627bae22beffb50b429e372fd",
          "url": "https://github.com/l1a/retch/commit/248b7b5a9f9a1a3eb5b62512ffa362eac159b756"
        },
        "date": 1780512662518,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 23428352.000000004,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1214047581.9999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 231712085.00000006,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1083663745,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b13e968dc483454c9fbb632a9714d46474bdc678",
          "message": "Merge pull request #66 from l1a/feature/multi-platform-benchmarks\n\nv0.3.2 - macOS Battery/Bluetooth Fixes & Multi-Platform Benchmarks",
          "timestamp": "2026-06-03T12:36:18-07:00",
          "tree_id": "150eb86f6551ec2ce10a0920f17d572403943ffe",
          "url": "https://github.com/l1a/retch/commit/b13e968dc483454c9fbb632a9714d46474bdc678"
        },
        "date": 1780517030678,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 32940716,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1985446995.9999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 290579217.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1650082230,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "046c8e0b0137a548dcb51d46fef7703b46efe9cc",
          "message": "v0.3.3 - Native OS Queries & Performance Optimization (#68)\n\n* Implement native queries for route, displays, reg\n\n* Allow clippy upper_case_acronyms for win_reg\n\n* Bump version to 0.3.3 and rebuild man pages\n\n* Test route parsing and wire up helper\n\n* Restrict route parser to Linux or tests",
          "timestamp": "2026-06-04T08:16:04-07:00",
          "tree_id": "969803f451b805de37c1b56fbebdded3f6c125d3",
          "url": "https://github.com/l1a/retch/commit/046c8e0b0137a548dcb51d46fef7703b46efe9cc"
        },
        "date": 1780587901599,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 33955554.00000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1658560584,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 297262237.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1579978510,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "585270b923d52522281c533fb0763203d8a90b40",
          "message": "Update CLI flags for short, long, and mode options (#70)",
          "timestamp": "2026-06-04T09:08:05-07:00",
          "tree_id": "0ea02c92aac1141943ac5f8df9742e9e9034f14f",
          "url": "https://github.com/l1a/retch/commit/585270b923d52522281c533fb0763203d8a90b40"
        },
        "date": 1780590908646,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 30595539.999999996,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 2067972789.9999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 277110190,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1848106950,
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
          "id": "2c8929eff22476a7f6682a4f1a22b68ffe13b346",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#69)\n\n* deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [sysinfo](https://github.com/GuillaumeGomez/sysinfo) and [chrono](https://github.com/chronotope/chrono).\n\n\nUpdates `sysinfo` from 0.39.2 to 0.39.3\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.2...v0.39.3)\n\nUpdates `chrono` from 0.4.44 to 0.4.45\n- [Release notes](https://github.com/chronotope/chrono/releases)\n- [Changelog](https://github.com/chronotope/chrono/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/chronotope/chrono/compare/v0.4.44...v0.4.45)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.3\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: chrono\n  dependency-version: 0.4.45\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\n\n* Bump version to 0.3.4 and update docs\n\n---------\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\nCo-authored-by: Ken Tobias <634380+l1a@users.noreply.github.com>",
          "timestamp": "2026-06-04T09:50:00-07:00",
          "tree_id": "da1fab8118438991920da275cd4aa46f9a678a63",
          "url": "https://github.com/l1a/retch/commit/2c8929eff22476a7f6682a4f1a22b68ffe13b346"
        },
        "date": 1780593527060,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 32651330,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1989446050.0000002,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 287800302.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1655425260,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03f2f059fb0ad385d838b489f3e4ac1b62e6855b",
          "message": "refactor: isolate display parsing into display.rs, expand tests and benchmarks (v0.3.5)\n\nExtracts all display detection and EDID parsing from fetch.rs into crates/sysinfo/src/display.rs. Adds 13 new unit tests (22→35) covering edge cases and 4 new criterion benchmarks for the pure EDID parsing functions. Bumps retch-cli to 0.3.5, retch-sysinfo to 0.1.5.",
          "timestamp": "2026-06-08T11:57:39-07:00",
          "tree_id": "7f7cbba8a52f301fe9a06fec1ddbf7bae7034a21",
          "url": "https://github.com/l1a/retch/commit/03f2f059fb0ad385d838b489f3e4ac1b62e6855b"
        },
        "date": 1780947045185,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 30232666,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 2041565025.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 120.27952507506761,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.346001945999346,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 128.21110665586124,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 300944180,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1799097830,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906c5abfb8923400935698c0e78970d34b0db97c",
          "message": "Update AGENTS.md progress and next steps (#72)",
          "timestamp": "2026-06-08T12:33:05-07:00",
          "tree_id": "1de64e381b62d4f79deb5adacbc4da43901fc6ff",
          "url": "https://github.com/l1a/retch/commit/906c5abfb8923400935698c0e78970d34b0db97c"
        },
        "date": 1780949075940,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 30914446,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1814944275.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 125.87144713083255,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.005896148485331,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.10307953380502,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 342845237.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1334363980,
            "unit": "ns"
          }
        ]
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
          "id": "d1a535b0061e46fe228bbc6bc6750aaa1a3d682a",
          "message": "docs: update AGENTS.md wiki instructions and fix man page version\n\nAdd explicit wiki clone URL and expand wiki update guidance in AGENTS.md.\nRegenerate docs/retch.1 to correct version header (0.3.4 → 0.3.5).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:47:53-07:00",
          "tree_id": "475ab89487f022b32be2a0ef3c9080b336f41d0a",
          "url": "https://github.com/l1a/retch/commit/d1a535b0061e46fe228bbc6bc6750aaa1a3d682a"
        },
        "date": 1780975258029,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 34949872.00000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 2421996821.9999995,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.53462946855262,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.023028651622483,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 138.00219690262344,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 283410972.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1407471070,
            "unit": "ns"
          }
        ]
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
          "id": "6365e661aa70ab10a23ae29fda01d1c7a2afb036",
          "message": "chore: add Claude Code project settings\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:50:21-07:00",
          "tree_id": "c23a0e102dc774a5a06b0156115a4810d15e542e",
          "url": "https://github.com/l1a/retch/commit/6365e661aa70ab10a23ae29fda01d1c7a2afb036"
        },
        "date": 1780975363478,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 22740822,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1454863272.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 99.14400215218615,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.060330195108593,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 99.93715737521663,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 238905710.00000006,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1365851050,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f896b26e8e028d7e3da3f7410b8aa71626ccd0a",
          "message": "Merge pull request #76 from l1a/refactor/bluetooth-module-isolation\n\nrefactor: isolate bluetooth detection into bluetooth.rs (v0.3.8)",
          "timestamp": "2026-06-09T21:49:44-07:00",
          "tree_id": "647698914519fc33c11cc2b44a86c80c889bbb2e",
          "url": "https://github.com/l1a/retch/commit/0f896b26e8e028d7e3da3f7410b8aa71626ccd0a"
        },
        "date": 1781068988130,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 30510364,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1544280424.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 127.91075963773156,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.011948041985532,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 127.34036155119308,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 295040070,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1428242400,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b6a7b695d96cacf9bae9f744dd7e0f163af32ee",
          "message": "Merge pull request #77 from l1a/test/coverage-and-benchmarks\n\ntest: expand unit test coverage and add network/audio/camera benchmarks (v0.3.10)",
          "timestamp": "2026-06-09T22:46:29-07:00",
          "tree_id": "a702e4595123a3fc74cefe901ec8127d4700e4d0",
          "url": "https://github.com/l1a/retch/commit/7b6a7b695d96cacf9bae9f744dd7e0f163af32ee"
        },
        "date": 1781072560244,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 28749116.000000007,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 2075321255.9999995,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 120.98534950525698,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.681025981610494,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.20509548182284,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 291434465,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 639.535852623735,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 929.8301865097044,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1865557235,
            "unit": "ns"
          }
        ]
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
          "id": "7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d",
          "message": "chore: update man page version to 0.3.10\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T22:48:20-07:00",
          "tree_id": "bdc9b4add1d8ea07f2c5eb90c710ad3ac8886e0b",
          "url": "https://github.com/l1a/retch/commit/7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d"
        },
        "date": 1781072755123,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 29412316,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 2158731646,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 123.18041783799094,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.392560432931589,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 121.10104545135933,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 291398400,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 625.2732437123314,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 880.9091190982051,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1925562515,
            "unit": "ns"
          }
        ]
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
          "id": "b7aad0ecc68d947a37cd0e781bc1689f3b53353c",
          "message": "chore: gitignore .claude/settings.local.json\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T23:11:11-07:00",
          "tree_id": "6e3904c23e95d4f1d5ddd0dd2790840ece0051c6",
          "url": "https://github.com/l1a/retch/commit/b7aad0ecc68d947a37cd0e781bc1689f3b53353c"
        },
        "date": 1781074153098,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 28545052.000000004,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1728468002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 127.37662863507941,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.025818612588188,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 127.85342479769443,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 289586400,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 636.4326611056425,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 865.9698600848593,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1572627655,
            "unit": "ns"
          }
        ]
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
          "id": "7895eef6117882a2078c051541be19016a6f0061",
          "message": "fix: don't forward git hook args to upload script\n\nGit passes a single positional arg to post-merge hooks (0 = merge,\n1 = squash merge). Forwarding it via \"$@\" caused argparse to reject\nit as an unrecognized argument on the first real merge.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:47:00-07:00",
          "tree_id": "d2d1f4f9986d0168c22966bd9be2a027ae5a8321",
          "url": "https://github.com/l1a/retch/commit/7895eef6117882a2078c051541be19016a6f0061"
        },
        "date": 1781119371485,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 33339063.999999996,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 2209210013.9999995,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 256.17322270977945,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.66164641162831,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 129.71498840266503,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 310136300,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 632.4207113724552,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 898.759361209791,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1967818545,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3",
          "message": "Merge pull request #78 from l1a/feat/local-bench-upload\n\nfeat: upload local benchmark results to gh-pages dashboard",
          "timestamp": "2026-06-10T11:45:58-07:00",
          "tree_id": "7494cb4cd48958c6d8510a10e2cd5d12fedc8879",
          "url": "https://github.com/l1a/retch/commit/9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3"
        },
        "date": 1781119384857,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 29979684,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1605685933.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.24604073848917,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.827093710180721,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 128.34133382781337,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 285223630,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 621.8516844007573,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 895.5997717800949,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1343675770,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781124401627,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 29506644.000000004,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1640174914,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 120.01995276200107,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.319703935931353,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.26656002196907,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 297027237.5,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 564.0728639913142,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 977.0574257273005,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1625249435,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5",
          "message": "refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12) (#80)\n\n* chore: document native probe replacement opportunities in Next Steps\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12)\n\n- GPU: registry enum under display adapter class GUID {4d36e968-...}\n  reads DriverDesc and HardwareInformation.MemorySize natively\n- Audio: registry enum under media device class GUID {4d36e96c-...}\n  reads DriverDesc natively\n- Display: EnumDisplayDevicesW + EnumDisplaySettingsW via user32.dll FFI,\n  enumerating only active adapters with current resolution/refresh rate\n- Motherboard/BIOS: drop wmic last-resort fallback; registry is sole source\n- win_reg: add get_reg_binary and enum_reg_subkeys helpers\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): add #[link(name = \"user32\")] for EnumDisplayDevicesW/SettingsW\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* ci: add workflow_dispatch trigger and guard release job to clean tags only\n\nworkflow_dispatch allows manually triggering build-release on any branch.\nRelease job now skips prerelease tags (anything with a hyphen, e.g. v0.3.12-rc.1).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): correct DEVMODEW struct layout to prevent stack corruption on Windows\n\nThe DevMode struct was 148 bytes but DEVMODEW is 220 bytes; EnumDisplaySettingsW\nwas writing 72 bytes past the end, corrupting the stack and causing silent crash\n(no output at all). Added all missing fields with correct offsets and initialize\nvia std::mem::zeroed() to match the Win32 ABI.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:20:27-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5"
        },
        "date": 1781218506863,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 31054388.000000007,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1740287607.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.61095912882223,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.41121214550419,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 121.94057135040107,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42080.46009234347,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.6450231477647,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 822.0112598202265,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1380368295,
            "unit": "ns"
          }
        ]
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
          "id": "63e90a2cf2ac77c5b976c363ca3e659705a634e9",
          "message": "chore: merge main with upstream (resolve AGENTS.md conflict, keep v0.3.12 state)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:21:13-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/63e90a2cf2ac77c5b976c363ca3e659705a634e9"
        },
        "date": 1781218764572,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 31646905.999999996,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1586476936,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 117.8295402453642,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.732714015697189,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 132.90413893464034,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45353.53524309639,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 669.2741049828869,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 833.8863568242793,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1496709835,
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
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "distinct": true,
          "id": "56e8e6e804cf08fa3d7d32e61b35c7c70da8716a",
          "message": "Update Windows battery query to PowerShell and configure 6-job benchmark CI matrix",
          "timestamp": "2026-06-03T09:37:53-07:00",
          "tree_id": "e5b6f8512a14b049491db31d512ef83085fd9620",
          "url": "https://github.com/l1a/retch/commit/56e8e6e804cf08fa3d7d32e61b35c7c70da8716a"
        },
        "date": 1780506911632,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 270537630,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1404880000.0000002,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 296142327.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1261151065,
            "unit": "ns"
          }
        ]
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
          "id": "248b7b5a9f9a1a3eb5b62512ffa362eac159b756",
          "message": "Configure Windows PATH in benchmark jobs",
          "timestamp": "2026-06-03T11:23:32-07:00",
          "tree_id": "4428a646927f214627bae22beffb50b429e372fd",
          "url": "https://github.com/l1a/retch/commit/248b7b5a9f9a1a3eb5b62512ffa362eac159b756"
        },
        "date": 1780513043559,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 275041018,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1491488068,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 310733477.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1322284215,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b13e968dc483454c9fbb632a9714d46474bdc678",
          "message": "Merge pull request #66 from l1a/feature/multi-platform-benchmarks\n\nv0.3.2 - macOS Battery/Bluetooth Fixes & Multi-Platform Benchmarks",
          "timestamp": "2026-06-03T12:36:18-07:00",
          "tree_id": "150eb86f6551ec2ce10a0920f17d572403943ffe",
          "url": "https://github.com/l1a/retch/commit/b13e968dc483454c9fbb632a9714d46474bdc678"
        },
        "date": 1780517511556,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 285315999.99999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1500357430.0000002,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 324795795,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1344703915,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "046c8e0b0137a548dcb51d46fef7703b46efe9cc",
          "message": "v0.3.3 - Native OS Queries & Performance Optimization (#68)\n\n* Implement native queries for route, displays, reg\n\n* Allow clippy upper_case_acronyms for win_reg\n\n* Bump version to 0.3.3 and rebuild man pages\n\n* Test route parsing and wire up helper\n\n* Restrict route parser to Linux or tests",
          "timestamp": "2026-06-04T08:16:04-07:00",
          "tree_id": "969803f451b805de37c1b56fbebdded3f6c125d3",
          "url": "https://github.com/l1a/retch/commit/046c8e0b0137a548dcb51d46fef7703b46efe9cc"
        },
        "date": 1780588279787,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 263228258,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1406142257.9999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 301163782.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1244066820,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "585270b923d52522281c533fb0763203d8a90b40",
          "message": "Update CLI flags for short, long, and mode options (#70)",
          "timestamp": "2026-06-04T09:08:05-07:00",
          "tree_id": "0ea02c92aac1141943ac5f8df9742e9e9034f14f",
          "url": "https://github.com/l1a/retch/commit/585270b923d52522281c533fb0763203d8a90b40"
        },
        "date": 1780591316473,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 263231698,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1397087037.9999998,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 304934790,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1262774580,
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
          "id": "2c8929eff22476a7f6682a4f1a22b68ffe13b346",
          "message": "deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates (#69)\n\n* deps(deps): bump the cargo-dependencies group across 1 directory with 2 updates\n\nBumps the cargo-dependencies group with 2 updates in the / directory: [sysinfo](https://github.com/GuillaumeGomez/sysinfo) and [chrono](https://github.com/chronotope/chrono).\n\n\nUpdates `sysinfo` from 0.39.2 to 0.39.3\n- [Changelog](https://github.com/GuillaumeGomez/sysinfo/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/GuillaumeGomez/sysinfo/compare/v0.39.2...v0.39.3)\n\nUpdates `chrono` from 0.4.44 to 0.4.45\n- [Release notes](https://github.com/chronotope/chrono/releases)\n- [Changelog](https://github.com/chronotope/chrono/blob/main/CHANGELOG.md)\n- [Commits](https://github.com/chronotope/chrono/compare/v0.4.44...v0.4.45)\n\n---\nupdated-dependencies:\n- dependency-name: sysinfo\n  dependency-version: 0.39.3\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n- dependency-name: chrono\n  dependency-version: 0.4.45\n  dependency-type: direct:production\n  update-type: version-update:semver-patch\n  dependency-group: cargo-dependencies\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>\n\n* Bump version to 0.3.4 and update docs\n\n---------\n\nSigned-off-by: dependabot[bot] <support@github.com>\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\nCo-authored-by: Ken Tobias <634380+l1a@users.noreply.github.com>",
          "timestamp": "2026-06-04T09:50:00-07:00",
          "tree_id": "da1fab8118438991920da275cd4aa46f9a678a63",
          "url": "https://github.com/l1a/retch/commit/2c8929eff22476a7f6682a4f1a22b68ffe13b346"
        },
        "date": 1780593937266,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 267191922.00000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1403183242,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 303485490,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1240204200,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "03f2f059fb0ad385d838b489f3e4ac1b62e6855b",
          "message": "refactor: isolate display parsing into display.rs, expand tests and benchmarks (v0.3.5)\n\nExtracts all display detection and EDID parsing from fetch.rs into crates/sysinfo/src/display.rs. Adds 13 new unit tests (22→35) covering edge cases and 4 new criterion benchmarks for the pure EDID parsing functions. Bumps retch-cli to 0.3.5, retch-sysinfo to 0.1.5.",
          "timestamp": "2026-06-08T11:57:39-07:00",
          "tree_id": "7f7cbba8a52f301fe9a06fec1ddbf7bae7034a21",
          "url": "https://github.com/l1a/retch/commit/03f2f059fb0ad385d838b489f3e4ac1b62e6855b"
        },
        "date": 1780947458748,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 257475224,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1410950314.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.16764490482562,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947618551714036,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.31712187266194,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 288178940,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1239644925,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "906c5abfb8923400935698c0e78970d34b0db97c",
          "message": "Update AGENTS.md progress and next steps (#72)",
          "timestamp": "2026-06-08T12:33:05-07:00",
          "tree_id": "1de64e381b62d4f79deb5adacbc4da43901fc6ff",
          "url": "https://github.com/l1a/retch/commit/906c5abfb8923400935698c0e78970d34b0db97c"
        },
        "date": 1780949522453,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 252046116.00000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1317155306,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.58305933526219,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9474369390879307,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.74068672834639,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 280785197.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1168570930,
            "unit": "ns"
          }
        ]
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
          "id": "d1a535b0061e46fe228bbc6bc6750aaa1a3d682a",
          "message": "docs: update AGENTS.md wiki instructions and fix man page version\n\nAdd explicit wiki clone URL and expand wiki update guidance in AGENTS.md.\nRegenerate docs/retch.1 to correct version header (0.3.4 → 0.3.5).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:47:53-07:00",
          "tree_id": "475ab89487f022b32be2a0ef3c9080b336f41d0a",
          "url": "https://github.com/l1a/retch/commit/d1a535b0061e46fe228bbc6bc6750aaa1a3d682a"
        },
        "date": 1780975689824,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 283611750.00000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1484957440,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.4769812364535,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9475582244388843,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.64277369703765,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 319274160,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1356856535,
            "unit": "ns"
          }
        ]
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
          "id": "6365e661aa70ab10a23ae29fda01d1c7a2afb036",
          "message": "chore: add Claude Code project settings\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-08T19:50:21-07:00",
          "tree_id": "c23a0e102dc774a5a06b0156115a4810d15e542e",
          "url": "https://github.com/l1a/retch/commit/6365e661aa70ab10a23ae29fda01d1c7a2afb036"
        },
        "date": 1780975785053,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 280476387.99999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1497268288,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.45484612834711,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948054178185732,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.66406202642497,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 320425115,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1325767895,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f896b26e8e028d7e3da3f7410b8aa71626ccd0a",
          "message": "Merge pull request #76 from l1a/refactor/bluetooth-module-isolation\n\nrefactor: isolate bluetooth detection into bluetooth.rs (v0.3.8)",
          "timestamp": "2026-06-09T21:49:44-07:00",
          "tree_id": "647698914519fc33c11cc2b44a86c80c889bbb2e",
          "url": "https://github.com/l1a/retch/commit/0f896b26e8e028d7e3da3f7410b8aa71626ccd0a"
        },
        "date": 1781069389782,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 255265094.00000003,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1362104654,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 101.95170082995357,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9474809294407147,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.18182787746932,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 292796217.5,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1216835760,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b6a7b695d96cacf9bae9f744dd7e0f163af32ee",
          "message": "Merge pull request #77 from l1a/test/coverage-and-benchmarks\n\ntest: expand unit test coverage and add network/audio/camera benchmarks (v0.3.10)",
          "timestamp": "2026-06-09T22:46:29-07:00",
          "tree_id": "a702e4595123a3fc74cefe901ec8127d4700e4d0",
          "url": "https://github.com/l1a/retch/commit/7b6a7b695d96cacf9bae9f744dd7e0f163af32ee"
        },
        "date": 1781073019833,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 277891025.99999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1458970156,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.3897240024443,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947875973150044,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.20239410188691,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 314993620,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 479.56682376085837,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 735.1570616358265,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1307141110,
            "unit": "ns"
          }
        ]
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
          "id": "7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d",
          "message": "chore: update man page version to 0.3.10\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T22:48:20-07:00",
          "tree_id": "bdc9b4add1d8ea07f2c5eb90c710ad3ac8886e0b",
          "url": "https://github.com/l1a/retch/commit/7845a81e7c1c90c3edaa05e2f2ca48f2016ea24d"
        },
        "date": 1781073205907,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 274445422.00000006,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1446838862.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.39512470632113,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948547830597691,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.09143352796565,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 312876255,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 479.33916948880096,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 744.4286634510121,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1312968575,
            "unit": "ns"
          }
        ]
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
          "id": "b7aad0ecc68d947a37cd0e781bc1689f3b53353c",
          "message": "chore: gitignore .claude/settings.local.json\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-09T23:11:11-07:00",
          "tree_id": "6e3904c23e95d4f1d5ddd0dd2790840ece0051c6",
          "url": "https://github.com/l1a/retch/commit/b7aad0ecc68d947a37cd0e781bc1689f3b53353c"
        },
        "date": 1781074593805,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 266120961.9999999,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1395288312.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.42193721130816,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9519053001490843,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.24559232882554,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 297047295,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.1972894048532,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 739.3114254167,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1243435525,
            "unit": "ns"
          }
        ]
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
          "id": "7895eef6117882a2078c051541be19016a6f0061",
          "message": "fix: don't forward git hook args to upload script\n\nGit passes a single positional arg to post-merge hooks (0 = merge,\n1 = squash merge). Forwarding it via \"$@\" caused argparse to reject\nit as an unrecognized argument on the first real merge.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T11:47:00-07:00",
          "tree_id": "d2d1f4f9986d0168c22966bd9be2a027ae5a8321",
          "url": "https://github.com/l1a/retch/commit/7895eef6117882a2078c051541be19016a6f0061"
        },
        "date": 1781119822638,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 268194343.99999997,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1428972733.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.21887342722226,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94784501494508,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.90670635280465,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 308944032.5,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 480.41826759853984,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 744.7756473720854,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1302605015,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3",
          "message": "Merge pull request #78 from l1a/feat/local-bench-upload\n\nfeat: upload local benchmark results to gh-pages dashboard",
          "timestamp": "2026-06-10T11:45:58-07:00",
          "tree_id": "7494cb4cd48958c6d8510a10e2cd5d12fedc8879",
          "url": "https://github.com/l1a/retch/commit/9a0094877053c3007b93f6cf2e9dd4b56f9e5ed3"
        },
        "date": 1781119860839,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 274798031.99999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1464293992.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.6363694779332,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9484065407105833,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.39039896099641,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 317717555,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.0829702515054,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 738.2573838371807,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1302731115,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a9fd67a7413c6895871674c4a722439caa865a2b",
          "message": "refactor(sysinfo): isolate remaining detect_* functions into dedicated modules (v0.3.11) (#79)\n\n* refactor(sysinfo): isolate remaining detect_* functions into dedicated modules\n\nExtracts all remaining detection logic from fetch.rs into single-purpose\nmodules: bios, camera, gamepad, motherboard, packages, shell, terminal,\nand theme. Adds win_reg as a shared Windows registry helper. fetch.rs\nshrinks from 2275 lines to 443 lines. Bumps retch-sysinfo to v0.1.11 and\nretch-cli to v0.3.11.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(bench): gate camera and gamepad imports with cfg(target_os = \"macos\")\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* style: rustfmt theme.rs test assert_eq line wrap\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: add pre-push hook to catch fmt/clippy failures before push\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: pre-push hook delegates to just check instead of duplicating logic\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* chore: document PR test plan verification in AGENTS.md\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(theme): gate parse_ini_key and its tests to linux only\n\nparse_ini_key is only called from linux cfg blocks; clippy correctly\nflags it as dead code on macOS and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(win_reg): allow upper_case_acronyms for HKEY Windows API type name\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix: gate parse_macos_camera and parse_macos_gamepad to macos only\n\nBoth functions are only called from macos cfg blocks and macos benchmarks;\nungated pub triggers dead_code warnings on Linux and Windows.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-10T13:06:20-07:00",
          "tree_id": "ced1181ff4572a57c0debfab135605cb0de50947",
          "url": "https://github.com/l1a/retch/commit/a9fd67a7413c6895871674c4a722439caa865a2b"
        },
        "date": 1781124872302,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 267052901.99999997,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1472498412,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.2149839213167,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9521787800079435,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.56810231558138,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 320623940,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 488.6836212760818,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.5745206172626,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1325148405,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5",
          "message": "refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12) (#80)\n\n* chore: document native probe replacement opportunities in Next Steps\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* refactor(windows): replace wmic with native registry/Win32 API calls (v0.3.12)\n\n- GPU: registry enum under display adapter class GUID {4d36e968-...}\n  reads DriverDesc and HardwareInformation.MemorySize natively\n- Audio: registry enum under media device class GUID {4d36e96c-...}\n  reads DriverDesc natively\n- Display: EnumDisplayDevicesW + EnumDisplaySettingsW via user32.dll FFI,\n  enumerating only active adapters with current resolution/refresh rate\n- Motherboard/BIOS: drop wmic last-resort fallback; registry is sole source\n- win_reg: add get_reg_binary and enum_reg_subkeys helpers\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): add #[link(name = \"user32\")] for EnumDisplayDevicesW/SettingsW\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* ci: add workflow_dispatch trigger and guard release job to clean tags only\n\nworkflow_dispatch allows manually triggering build-release on any branch.\nRelease job now skips prerelease tags (anything with a hyphen, e.g. v0.3.12-rc.1).\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n* fix(display): correct DEVMODEW struct layout to prevent stack corruption on Windows\n\nThe DevMode struct was 148 bytes but DEVMODEW is 220 bytes; EnumDisplaySettingsW\nwas writing 72 bytes past the end, corrupting the stack and causing silent crash\n(no output at all). Added all missing fields with correct offsets and initialize\nvia std::mem::zeroed() to match the Win32 ABI.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:20:27-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/fcdf4e8fd0bf57f7eb739d1691819ec1a28613a5"
        },
        "date": 1781218946159,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 275728691.99999994,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1359506012.0000002,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 97.03175951943129,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9493776323915024,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 97.76698247511781,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45150.58035301375,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 494.39984503407067,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 729.5345821294479,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1222344135,
            "unit": "ns"
          }
        ]
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
          "id": "63e90a2cf2ac77c5b976c363ca3e659705a634e9",
          "message": "chore: merge main with upstream (resolve AGENTS.md conflict, keep v0.3.12 state)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>",
          "timestamp": "2026-06-11T15:21:13-07:00",
          "tree_id": "59e77b67be39f19c8b6761061a51bdf06c8f6761",
          "url": "https://github.com/l1a/retch/commit/63e90a2cf2ac77c5b976c363ca3e659705a634e9"
        },
        "date": 1781219310654,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 270392882,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 1335330031.9999998,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 97.03301112602037,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9529398044542576,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 97.81023214070876,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44649.439066042534,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 498.1947246973211,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 741.5812747426472,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 1197841780,
            "unit": "ns"
          }
        ]
      }
    ]
  }
}