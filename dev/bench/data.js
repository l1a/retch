window.BENCHMARK_DATA = {
  "lastUpdate": 1790965512012,
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
          "id": "cc620fdc65929ad764ea2483f2befa92416dae56",
          "message": "Restart the benchmark dashboard, charted by version (#278)\n\nThe published history mixes things that cannot be compared: until\nv0.19.0 the fastfetch series measured the wrong workload (built-in\ndefault, no config, every module, or a personal config), the retch\nseries span a mode redefinition (cpu-usage left the default mode),\nlocal points carry no power state, and CI kept only 50 runs, 12 of\nthem with CLI timings. It is archived on gh-pages under\ndev/bench/archive/ with a note on what is comparable, and the\ndashboard starts again from this merge.\n\n- scripts/bench_meta.py stamps every CLI point's `extra` with the\n  version, plus AC or battery for local runs (on arrakis the power\n  state moved --short by ~0.3 ms). parse_criterion.py (CI) and\n  upload_local_bench.py (local) both use it; both self-tests check it.\n- benches/dashboard/ is our own chart page: points labelled by version,\n  and retch time divided by fastfetch time per mode from the same run,\n  which cancels CI runner speed (macOS CI's retch default alone ranged\n  334-2596 ms). Battery runs are drawn as triangles. model.js is tested\n  under Node by model.test.js in `just bench-check`; `just bench-page`\n  publishes the page (asks first).\n- History caps go from 50 (CI) and 100 (local) to 200 runs per suite;\n  the cap deletes older entries from data.js, not just from the chart.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-28T12:54:55-07:00",
          "tree_id": "47693cd0524bb851d2ac962fc52f1a9da73fe02c",
          "url": "https://github.com/l1a/retch/commit/cc620fdc65929ad764ea2483f2befa92416dae56"
        },
        "date": 1790625334474,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2762642.5,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2223212.1,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 3331872.340000001,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 14163487.94,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 221134058.82,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 510986904.02000004,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 627621074.44,
            "extra": "v0.20.7; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 518109931.94,
            "extra": "v0.20.7; AC"
          }
        ]
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
          "id": "5a56a32891519db3e8b22b1b22f25bccafaff7c3",
          "message": "Run the default benchmark mode first again (#279)\n\ncli_bench.py ran the four retch-vs-fastfetch pairs in MODES order\nsince v0.19.0, so --short ran first, straight after the build on a\ncold runner. The workflow before that always started with the default\nmode. The first run on the new order raised a macOS --short\nPerformance Alert (24.4 -> 52.4 ms) on a commit that changed no\n--short code.\n\nRUN_ORDER (default, short, long, full) now sets the order pairs() and\nrun() use. MODES is unchanged, since config generation and the strata\nlogic depend on it. Series are keyed by command string, so no\ndashboard series forks. The self-test pins the exact order, checks it\ncovers every mode once, and checks pairs() follows it.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T13:40:54-07:00",
          "tree_id": "eb5cbd2f1dcc4734f7909c53c88b787ff01f5190",
          "url": "https://github.com/l1a/retch/commit/5a56a32891519db3e8b22b1b22f25bccafaff7c3"
        },
        "date": 1790714490597,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 3229077.14,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 13297933.24,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2268082.96,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2369944.7600000002,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 221099137.20000002,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 510587684.6,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 618810746.4600002,
            "extra": "v0.20.8; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 518493464.56,
            "extra": "v0.20.8; AC"
          }
        ]
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
          "id": "9e79fef974446bac7f0e90a3babffe03184a8d0c",
          "message": "Fail the COPR run when secrets are missing here (#280)\n\ncopr.yml's credentials step printed a notice and exited 0 whenever a\nCOPR secret was empty. The skip exists so forks, which have no\nsecrets, stay green, but it fired on l1a/retch too: a lost secret\nwould give a green release run that rebuilt nothing. rusticprofile's\nidentical guard hid its never-added secrets that way for weeks.\n\nOn l1a/retch a missing secret is now an ::error:: and exit 1. Forks\nstill skip.\n\ncopr_check.py --self-test now extracts that step from copr.yml and\nruns it under bash with a throwaway HOME and GITHUB_ENV in three\ncases: canonical repo without secrets must fail, a fork must skip,\ncanonical repo with secrets must write the config. A fixture of the\nold guard must be caught. packaging.yml runs the self-test in CI and\nnow triggers on copr.yml changes, since copr.yml itself runs only on\na tag or by hand.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:02:31-07:00",
          "tree_id": "da4fe5e19592173f73ec9d5fb59423fe3fb0df7b",
          "url": "https://github.com/l1a/retch/commit/9e79fef974446bac7f0e90a3babffe03184a8d0c"
        },
        "date": 1790715789307,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 3808250.12,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 14895547.420000002,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2370897.68,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2694825.78,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 227674287.55999997,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 510054625.66,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 619182136.4200001,
            "extra": "v0.20.9; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 517010436.32,
            "extra": "v0.20.9; AC"
          }
        ]
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
          "id": "e3d16e03aab826b6e8eb6d6b94d1df991165ba49",
          "message": "Fetch weather over plain HTTP, like fastfetch (#281)\n\nweather used one HTTPS request to wttr.in since v0.20.0. The TLS 1.3\nhandshake is one extra round trip to a server ~190 ms away: 570 vs\n373 ms median, 10 interleaved runs of the same request on arrakis. It\nwas the entire --full gap to fastfetch, which uses the same service\nover plain HTTP. HTTP answers 200 with the same body and no redirect,\nand an unknown location is still a 500, so curl -f still fails it.\n\n--full on arrakis (15 runs, AC): 621 -> 425 ms; fastfetch 519 ms.\nWeather output identical.\n\nThe trade-off is that the request and the approximate location in the\nreply are now unencrypted, and any hop can rewrite the reply.\nparse_wttr prints the location verbatim, so it now rejects any reply\ncontaining a control character: an ESC there would reach the\nterminal. Real replies never contain one; weather emoji are a symbol\nplus U+FE0F, a combining mark, and a test pins that they still parse.\n\nretch-sysinfo 0.1.86, retch-cli 0.20.10.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:53:35-07:00",
          "tree_id": "aaa14d15c51db8ebde24227739e7b4285f271d39",
          "url": "https://github.com/l1a/retch/commit/e3d16e03aab826b6e8eb6d6b94d1df991165ba49"
        },
        "date": 1790718855908,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 3538381.5200000005,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 16637199.620000005,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2692554.8200000003,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2512432.62,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 221608018.34000003,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 510398403.94,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 430238555.7200001,
            "extra": "v0.20.10; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 517931976.3200001,
            "extra": "v0.20.10; AC"
          }
        ]
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
          "id": "80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c",
          "message": "Fix --list-distros and document real config paths (#282)\n\n--list-distros printed its own hand-written list, which never gained\nthe five logos added after it was written: mx, linuxmint, kali, zorin\nand garuda. Both it and --print-logos now read logo::KNOWN_LOGOS, and\ntwo tests pin the list to assets/logos/*.txt in both directions.\n\nThe config path is dirs::config_dir(): XDG on Linux, but\n~/Library/Application Support/retch/ on macOS and %APPDATA%\\retch\\ on\nWindows. The README, man page, COPR page and AGENTS.md all said\n~/.config/retch/, so a config put there was ignored on macOS and\nWindows. They now state each platform's path (user decision: document\nthe behaviour, don't change it). The man page also listed --short\nwithout Net and promised multi-second --full runs.\n\nThe Nix Home Manager module wrote xdg.configFile on macOS too, so its\nsettings never took effect there; on Darwin it now writes the\nApplication Support path. Checked with lib.evalModules in a nixos/nix\ncontainer for x86_64-linux and aarch64-darwin, old module as control.\n\nNOTES.md: section 6 said every fastfetch gap was closed on all three\nplatforms. Windows has no keyboard, mouse, brightness, power-adapter,\nlogin-manager or tpm; section 6a now lists them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:07:59-07:00",
          "tree_id": "7c8f75dd771a51b4256b304cfa00597809106e76",
          "url": "https://github.com/l1a/retch/commit/80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c"
        },
        "date": 1790737709108,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 2097024.8600000003,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 7205958.86,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 1376008.6400000001,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 1336638.04,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 215678641.10000002,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 508592419.09999996,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 386646537.22,
            "extra": "v0.20.11; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 513702217.92000014,
            "extra": "v0.20.11; AC"
          }
        ]
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
          "id": "19b379904d67825172c8333b277699b6a62fc2c8",
          "message": "Make ascii_only in config.toml select ASCII (#283)\n\ndisplay.rs picked the ASCII logo from the --ascii-logo flag alone and\nnever read the merged config's ascii_only, so the key did nothing. In\na pty claiming Kitty support, ascii_only = true still drew the Kitty\nimage while the flag drew ASCII. wants_ascii_logo now reads both;\nshould_show_logo still keys on the flag alone, since forcing a logo\ninto a pipe is for an explicit command-line request.\n\nAlso documents the chafa key and the custom logo.png (read from\nretch's config folder by the image protocols and Chafa), and corrects\nNOTES.md section 8: graphics is a default feature, so the extra\n--features graphics lint re-tests the default while the\n--no-default-features build, which fails clippy, goes untested.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:23:01-07:00",
          "tree_id": "66c37c0846880b9d3fbd50d81550777942848a1e",
          "url": "https://github.com/l1a/retch/commit/19b379904d67825172c8333b277699b6a62fc2c8"
        },
        "date": 1790738611648,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 2016051.14,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 7126558.84,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 1589847.9,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 1322218.2,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 214286122.08,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 508373084.17999995,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 394738242.74000007,
            "extra": "v0.20.12; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 514003522.0400001,
            "extra": "v0.20.12; AC"
          }
        ]
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
          "id": "e67fdd5128a973545ef52e0d926ba03c6f976fab",
          "message": "Lint the build without default features (#284)\n\ngraphics has been a default feature since May, so the --workspace\nclippy already compiles it. just check's second clippy pass and CI's\ngraphics-feature job ran --features graphics on the belief that it was\noff by default, which only repeated the default. Meanwhile the build\nwithout it stopped passing clippy: three unused supports_* probes in\nlogo.rs and the never-constructed image variants of ActiveLogo.\n\nBoth now build and lint -p retch-cli --no-default-features, and the CI\njob is renamed no-default-features. The probes are cfg-gated like the\ncode that reads them; the enum gets a targeted, commented allowance,\nsince its layout code is shared. No shipped package uses that build.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:37:14-07:00",
          "tree_id": "915d3fe2cb4640a03978fc9320479f1f638dd51a",
          "url": "https://github.com/l1a/retch/commit/e67fdd5128a973545ef52e0d926ba03c6f976fab"
        },
        "date": 1790739464824,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 2028072.9400000002,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 8186132.340000001,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 1481451.06,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 1363198.5599999998,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 213360111,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 507442665.79999995,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 398732385.03999996,
            "extra": "v0.20.13; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 513474464.74,
            "extra": "v0.20.13; AC"
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
          "id": "00b400ee23e90baba5613eef371399452a2e2633",
          "message": "Read macOS physical disks from IOKit (#285)\n\nphys-disk spawned `diskutil list -plist` and then one `diskutil info\n-plist` per whole disk, serially. Each call is a round trip to\ndiskarbitrationd (~0.2 s), so on an M3 Pro with four whole disks (three\nof them synthesized APFS containers that were then discarded) the field\ntook 0.97-1.04 s and was the whole of the default mode's critical path.\nThe NOTES suspect, phys-mem, was wrong; RETCH_TIMING=1 found it.\n\nIt now walks IOBlockStorageDriver in IOKit: the whole-disk IOMedia\nchild gives BSD Name and Size, the IOBlockStorageDevice parent gives\nProduct Name, Medium Type and Physical Interconnect, which are the\nvalues diskutil reported as MediaName, SolidState and BusProtocol.\nSynthesized APFS disks have no driver and never appear; disk images\nread \"Virtual Interface\" and are skipped, as diskutil skipped them.\n\nphys-disk: ~1 s -> 0.15 ms. Default mode on chani (battery, same\nsitting): v0.20.13 305-322 ms, this 108-126 ms, fastfetch's matched\ndefault 145-161 ms. Output identical in all four modes, also with a\ndisk image attached. Tests cover the formatter (three mutations, all\ncaught) and the numeric diskN sort.\n\nAlso fixes the Linux build under Rust 1.99, which reached CI after\nmain last passed: gpu_api.rs declared libc's variadic `open` as\nnon-variadic in its own extern block, now a hard error (\"invalid\ndefinition of the runtime `open` symbol used by the standard library\").\nThe fd calls (dup, dup2, close, open) now come from the libc crate.\nVerified by reproducing the error with rustc 1.99 and by compiling and\nrunning the same SuppressStderr logic against libc on macOS.\n\nAlso records the remaining macOS --short gap (the `disk` field, ~39 ms\nin sysinfo's free-space query) and the pre-existing Intel PCI-Express\n[SSD] labelling, and fixes the stale newest-tag line in NOTES.md.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:14:06-07:00",
          "tree_id": "474ef4a382ae5724b9c9012c522080d7ac0a6106",
          "url": "https://github.com/l1a/retch/commit/00b400ee23e90baba5613eef371399452a2e2633"
        },
        "date": 1790964889639,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 110778675.88000001,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 131084483.98,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 33824088.24000001,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 14997709.040000001,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 231027520.00000003,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 659215461.6999999,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 494794331.86,
            "extra": "v0.20.14; battery"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 666626619.1600002,
            "extra": "v0.20.14; battery"
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
          "id": "cc620fdc65929ad764ea2483f2befa92416dae56",
          "message": "Restart the benchmark dashboard, charted by version (#278)\n\nThe published history mixes things that cannot be compared: until\nv0.19.0 the fastfetch series measured the wrong workload (built-in\ndefault, no config, every module, or a personal config), the retch\nseries span a mode redefinition (cpu-usage left the default mode),\nlocal points carry no power state, and CI kept only 50 runs, 12 of\nthem with CLI timings. It is archived on gh-pages under\ndev/bench/archive/ with a note on what is comparable, and the\ndashboard starts again from this merge.\n\n- scripts/bench_meta.py stamps every CLI point's `extra` with the\n  version, plus AC or battery for local runs (on arrakis the power\n  state moved --short by ~0.3 ms). parse_criterion.py (CI) and\n  upload_local_bench.py (local) both use it; both self-tests check it.\n- benches/dashboard/ is our own chart page: points labelled by version,\n  and retch time divided by fastfetch time per mode from the same run,\n  which cancels CI runner speed (macOS CI's retch default alone ranged\n  334-2596 ms). Battery runs are drawn as triangles. model.js is tested\n  under Node by model.test.js in `just bench-check`; `just bench-page`\n  publishes the page (asks first).\n- History caps go from 50 (CI) and 100 (local) to 200 runs per suite;\n  the cap deletes older entries from data.js, not just from the chart.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-28T12:54:55-07:00",
          "tree_id": "47693cd0524bb851d2ac962fc52f1a9da73fe02c",
          "url": "https://github.com/l1a/retch/commit/cc620fdc65929ad764ea2483f2befa92416dae56"
        },
        "date": 1790625968664,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3524992.340000001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252975765.04000008,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252985514.00000003,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1843555.78,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch",
            "value": 3005036.8400000003,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 407491399.4400001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 219884978.50000003,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2078895.3800000001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "SystemInfo__collect",
            "value": 435184861.725,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2073.2050842870567,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.95315279986121,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.910071615361675,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.51924052721448,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18056.295836542296,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 190908.42030041275,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12777.558036726456,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8697.625954784458,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 162799.17387470996,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 421.42412751915015,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 277.8837407549767,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a56a32891519db3e8b22b1b22f25bccafaff7c3",
          "message": "Run the default benchmark mode first again (#279)\n\ncli_bench.py ran the four retch-vs-fastfetch pairs in MODES order\nsince v0.19.0, so --short ran first, straight after the build on a\ncold runner. The workflow before that always started with the default\nmode. The first run on the new order raised a macOS --short\nPerformance Alert (24.4 -> 52.4 ms) on a commit that changed no\n--short code.\n\nRUN_ORDER (default, short, long, full) now sets the order pairs() and\nrun() use. MODES is unchanged, since config generation and the strata\nlogic depend on it. Series are keyed by command string, so no\ndashboard series forks. The self-test pins the exact order, checks it\ncovers every mode once, and checks pairs() follows it.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T13:40:54-07:00",
          "tree_id": "eb5cbd2f1dcc4734f7909c53c88b787ff01f5190",
          "url": "https://github.com/l1a/retch/commit/5a56a32891519db3e8b22b1b22f25bccafaff7c3"
        },
        "date": 1790715104477,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3636436.14,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 253328352.82000005,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 253189394.90000004,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1895546.0599999998,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch",
            "value": 3028050.7400000007,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 417170012.02000004,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 208170494.60000002,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2122789.460000001,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "SystemInfo__collect",
            "value": 364891638.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2060.694313526239,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 117.37741829772915,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8662965337703685,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 59.01348175732543,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18173.27280228296,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189227.22620828843,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12750.384996078252,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8673.881877497473,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 162565.17427458594,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 426.72279213723357,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 271.91814284288773,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e79fef974446bac7f0e90a3babffe03184a8d0c",
          "message": "Fail the COPR run when secrets are missing here (#280)\n\ncopr.yml's credentials step printed a notice and exited 0 whenever a\nCOPR secret was empty. The skip exists so forks, which have no\nsecrets, stay green, but it fired on l1a/retch too: a lost secret\nwould give a green release run that rebuilt nothing. rusticprofile's\nidentical guard hid its never-added secrets that way for weeks.\n\nOn l1a/retch a missing secret is now an ::error:: and exit 1. Forks\nstill skip.\n\ncopr_check.py --self-test now extracts that step from copr.yml and\nruns it under bash with a throwaway HOME and GITHUB_ENV in three\ncases: canonical repo without secrets must fail, a fork must skip,\ncanonical repo with secrets must write the config. A fixture of the\nold guard must be caught. packaging.yml runs the self-test in CI and\nnow triggers on copr.yml changes, since copr.yml itself runs only on\na tag or by hand.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:02:31-07:00",
          "tree_id": "da4fe5e19592173f73ec9d5fb59423fe3fb0df7b",
          "url": "https://github.com/l1a/retch/commit/9e79fef974446bac7f0e90a3babffe03184a8d0c"
        },
        "date": 1790716332121,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3561267.26,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 328655706.40000004,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252877740.11999997,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1844324.0200000003,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch",
            "value": 3068270.360000001,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 514583569.40000004,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 207365989.62000003,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2033106.72,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "SystemInfo__collect",
            "value": 592422686.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2050.2728666537773,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.8666670572333,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.860770876463141,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.74337870879447,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18016.336846329203,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 187762.85422111826,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12694.803945502848,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8624.580704788274,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 162104.75982864486,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 418.0499116765699,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.14087016628827,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e3d16e03aab826b6e8eb6d6b94d1df991165ba49",
          "message": "Fetch weather over plain HTTP, like fastfetch (#281)\n\nweather used one HTTPS request to wttr.in since v0.20.0. The TLS 1.3\nhandshake is one extra round trip to a server ~190 ms away: 570 vs\n373 ms median, 10 interleaved runs of the same request on arrakis. It\nwas the entire --full gap to fastfetch, which uses the same service\nover plain HTTP. HTTP answers 200 with the same body and no redirect,\nand an unknown location is still a 500, so curl -f still fails it.\n\n--full on arrakis (15 runs, AC): 621 -> 425 ms; fastfetch 519 ms.\nWeather output identical.\n\nThe trade-off is that the request and the approximate location in the\nreply are now unencrypted, and any hop can rewrite the reply.\nparse_wttr prints the location verbatim, so it now rejects any reply\ncontaining a control character: an ESC there would reach the\nterminal. Real replies never contain one; weather emoji are a symbol\nplus U+FE0F, a combining mark, and a test pins that they still parse.\n\nretch-sysinfo 0.1.86, retch-cli 0.20.10.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:53:35-07:00",
          "tree_id": "aaa14d15c51db8ebde24227739e7b4285f271d39",
          "url": "https://github.com/l1a/retch/commit/e3d16e03aab826b6e8eb6d6b94d1df991165ba49"
        },
        "date": 1790719501036,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1853139.7000000002,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 372751484.38,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252105440.14000002,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1144521.0000000002,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch",
            "value": 1917471.8,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 479402721.8800001,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204233300.54000002,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1388019.9,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "SystemInfo__collect",
            "value": 298000303.55,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 859.3460889603917,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 87.42081967056426,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.164239703148629,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 50.351678828722974,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7509.016468278469,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70443.73452832615,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 48008.43401491591,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 46103.20169055155,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 59373.38483037837,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 303.15414685070743,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 222.47347796500625,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c",
          "message": "Fix --list-distros and document real config paths (#282)\n\n--list-distros printed its own hand-written list, which never gained\nthe five logos added after it was written: mx, linuxmint, kali, zorin\nand garuda. Both it and --print-logos now read logo::KNOWN_LOGOS, and\ntwo tests pin the list to assets/logos/*.txt in both directions.\n\nThe config path is dirs::config_dir(): XDG on Linux, but\n~/Library/Application Support/retch/ on macOS and %APPDATA%\\retch\\ on\nWindows. The README, man page, COPR page and AGENTS.md all said\n~/.config/retch/, so a config put there was ignored on macOS and\nWindows. They now state each platform's path (user decision: document\nthe behaviour, don't change it). The man page also listed --short\nwithout Net and promised multi-second --full runs.\n\nThe Nix Home Manager module wrote xdg.configFile on macOS too, so its\nsettings never took effect there; on Darwin it now writes the\nApplication Support path. Checked with lib.evalModules in a nixos/nix\ncontainer for x86_64-linux and aarch64-darwin, old module as control.\n\nNOTES.md: section 6 said every fastfetch gap was closed on all three\nplatforms. Windows has no keyboard, mouse, brightness, power-adapter,\nlogin-manager or tpm; section 6a now lists them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:07:59-07:00",
          "tree_id": "7c8f75dd771a51b4256b304cfa00597809106e76",
          "url": "https://github.com/l1a/retch/commit/80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c"
        },
        "date": 1790738341605,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1881834.7000000002,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 277036326.92,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252133448.38000005,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1282408.2000000002,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch",
            "value": 2009095.7000000004,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 332204300.9200001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204819831.88,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1422371.9000000004,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "SystemInfo__collect",
            "value": 331175722.475,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 853.6522753367578,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 83.71307217682445,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.175140476915822,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.70085524308949,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7571.826697771801,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71212.49101525573,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 48305.93318596641,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 46663.87747319318,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 59615.96058725678,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 304.065451446278,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 233.5553937286261,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "19b379904d67825172c8333b277699b6a62fc2c8",
          "message": "Make ascii_only in config.toml select ASCII (#283)\n\ndisplay.rs picked the ASCII logo from the --ascii-logo flag alone and\nnever read the merged config's ascii_only, so the key did nothing. In\na pty claiming Kitty support, ascii_only = true still drew the Kitty\nimage while the flag drew ASCII. wants_ascii_logo now reads both;\nshould_show_logo still keys on the flag alone, since forcing a logo\ninto a pipe is for an explicit command-line request.\n\nAlso documents the chafa key and the custom logo.png (read from\nretch's config folder by the image protocols and Chafa), and corrects\nNOTES.md section 8: graphics is a default feature, so the extra\n--features graphics lint re-tests the default while the\n--no-default-features build, which fails clippy, goes untested.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:23:01-07:00",
          "tree_id": "66c37c0846880b9d3fbd50d81550777942848a1e",
          "url": "https://github.com/l1a/retch/commit/19b379904d67825172c8333b277699b6a62fc2c8"
        },
        "date": 1790739235672,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1635180.1000000003,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 280047138.73999995,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252072492.02000004,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1052578.0799999998,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch",
            "value": 1801307.4,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 512690588.84,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205177127.32000005,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1269987.4799999997,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "SystemInfo__collect",
            "value": 373199118.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 699.171933918962,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 72.48057316031513,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.086575159928686,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 40.627703113956834,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 6198.524327939832,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 58975.37163656787,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 39768.70271756746,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 38033.80692117972,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 49448.314424818396,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 246.43765842813104,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 184.45510534483398,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e67fdd5128a973545ef52e0d926ba03c6f976fab",
          "message": "Lint the build without default features (#284)\n\ngraphics has been a default feature since May, so the --workspace\nclippy already compiles it. just check's second clippy pass and CI's\ngraphics-feature job ran --features graphics on the belief that it was\noff by default, which only repeated the default. Meanwhile the build\nwithout it stopped passing clippy: three unused supports_* probes in\nlogo.rs and the never-constructed image variants of ActiveLogo.\n\nBoth now build and lint -p retch-cli --no-default-features, and the CI\njob is renamed no-default-features. The probes are cfg-gated like the\ncode that reads them; the enum gets a targeted, commented allowance,\nsince its layout code is shared. No shipped package uses that build.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:37:14-07:00",
          "tree_id": "915d3fe2cb4640a03978fc9320479f1f638dd51a",
          "url": "https://github.com/l1a/retch/commit/e67fdd5128a973545ef52e0d926ba03c6f976fab"
        },
        "date": 1790740032283,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3553178.2799999993,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 253053072.02000004,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 253013980.12000003,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1849074.82,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch",
            "value": 3069067.0799999996,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 374804560.42,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 207216781.41999996,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2057094.5199999993,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "SystemInfo__collect",
            "value": 276562795.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2087.6792068233253,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 117.6102727022214,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.864871305972728,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.94141670622666,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18147.608133196853,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 191155.70416463303,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12769.08612044017,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8644.108493111826,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 162661.77198284626,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 402.61302905870673,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 292.3654301568464,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "00b400ee23e90baba5613eef371399452a2e2633",
          "message": "Read macOS physical disks from IOKit (#285)\n\nphys-disk spawned `diskutil list -plist` and then one `diskutil info\n-plist` per whole disk, serially. Each call is a round trip to\ndiskarbitrationd (~0.2 s), so on an M3 Pro with four whole disks (three\nof them synthesized APFS containers that were then discarded) the field\ntook 0.97-1.04 s and was the whole of the default mode's critical path.\nThe NOTES suspect, phys-mem, was wrong; RETCH_TIMING=1 found it.\n\nIt now walks IOBlockStorageDriver in IOKit: the whole-disk IOMedia\nchild gives BSD Name and Size, the IOBlockStorageDevice parent gives\nProduct Name, Medium Type and Physical Interconnect, which are the\nvalues diskutil reported as MediaName, SolidState and BusProtocol.\nSynthesized APFS disks have no driver and never appear; disk images\nread \"Virtual Interface\" and are skipped, as diskutil skipped them.\n\nphys-disk: ~1 s -> 0.15 ms. Default mode on chani (battery, same\nsitting): v0.20.13 305-322 ms, this 108-126 ms, fastfetch's matched\ndefault 145-161 ms. Output identical in all four modes, also with a\ndisk image attached. Tests cover the formatter (three mutations, all\ncaught) and the numeric diskN sort.\n\nAlso fixes the Linux build under Rust 1.99, which reached CI after\nmain last passed: gpu_api.rs declared libc's variadic `open` as\nnon-variadic in its own extern block, now a hard error (\"invalid\ndefinition of the runtime `open` symbol used by the standard library\").\nThe fd calls (dup, dup2, close, open) now come from the libc crate.\nVerified by reproducing the error with rustc 1.99 and by compiling and\nrunning the same SuppressStderr logic against libc on macOS.\n\nAlso records the remaining macOS --short gap (the `disk` field, ~39 ms\nin sysinfo's free-space query) and the pre-existing Intel PCI-Express\n[SSD] labelling, and fixes the stale newest-tag line in NOTES.md.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:14:06-07:00",
          "tree_id": "474ef4a382ae5724b9c9012c522080d7ac0a6106",
          "url": "https://github.com/l1a/retch/commit/00b400ee23e90baba5613eef371399452a2e2633"
        },
        "date": 1790965511981,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 4331880.3,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 325427334.70000005,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 253261628.82000008,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 2064511.7000000004,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch",
            "value": 3591793.8000000007,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 352663917.90000004,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 207535055.82000002,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2328732.5000000005,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "SystemInfo__collect",
            "value": 396882553.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2044.0643222976682,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 111.64014935878484,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8234342930915295,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 60.52979282476324,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17949.107108202425,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189981.56140854434,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12760.996374305152,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8649.399755594204,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 162116.65428588708,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 327.2503090908972,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 272.70370063350094,
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
          "id": "cc620fdc65929ad764ea2483f2befa92416dae56",
          "message": "Restart the benchmark dashboard, charted by version (#278)\n\nThe published history mixes things that cannot be compared: until\nv0.19.0 the fastfetch series measured the wrong workload (built-in\ndefault, no config, every module, or a personal config), the retch\nseries span a mode redefinition (cpu-usage left the default mode),\nlocal points carry no power state, and CI kept only 50 runs, 12 of\nthem with CLI timings. It is archived on gh-pages under\ndev/bench/archive/ with a note on what is comparable, and the\ndashboard starts again from this merge.\n\n- scripts/bench_meta.py stamps every CLI point's `extra` with the\n  version, plus AC or battery for local runs (on arrakis the power\n  state moved --short by ~0.3 ms). parse_criterion.py (CI) and\n  upload_local_bench.py (local) both use it; both self-tests check it.\n- benches/dashboard/ is our own chart page: points labelled by version,\n  and retch time divided by fastfetch time per mode from the same run,\n  which cancels CI runner speed (macOS CI's retch default alone ranged\n  334-2596 ms). Battery runs are drawn as triangles. model.js is tested\n  under Node by model.test.js in `just bench-check`; `just bench-page`\n  publishes the page (asks first).\n- History caps go from 50 (CI) and 100 (local) to 200 runs per suite;\n  the cap deletes older entries from data.js, not just from the chart.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-28T12:54:55-07:00",
          "tree_id": "47693cd0524bb851d2ac962fc52f1a9da73fe02c",
          "url": "https://github.com/l1a/retch/commit/cc620fdc65929ad764ea2483f2befa92416dae56"
        },
        "date": 1790625968975,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2084464.5599999998,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 276994612.96,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252280049.22000003,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1767451.1,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch",
            "value": 2523666.16,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 444941555.3600001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204967940.92000005,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1949458.2000000004,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "SystemInfo__collect",
            "value": 469639867.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 977.3348452872764,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.69930556143856,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946848357039422,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.02558902485682,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7749.915136544858,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71210.03585682323,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4813.078126099518,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3478.8790558201413,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57318.95331813778,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 345.37869419372225,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.5950860381732,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a56a32891519db3e8b22b1b22f25bccafaff7c3",
          "message": "Run the default benchmark mode first again (#279)\n\ncli_bench.py ran the four retch-vs-fastfetch pairs in MODES order\nsince v0.19.0, so --short ran first, straight after the build on a\ncold runner. The workflow before that always started with the default\nmode. The first run on the new order raised a macOS --short\nPerformance Alert (24.4 -> 52.4 ms) on a commit that changed no\n--short code.\n\nRUN_ORDER (default, short, long, full) now sets the order pairs() and\nrun() use. MODES is unchanged, since config generation and the strata\nlogic depend on it. Series are keyed by command string, so no\ndashboard series forks. The self-test pins the exact order, checks it\ncovers every mode once, and checks pairs() follows it.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T13:40:54-07:00",
          "tree_id": "eb5cbd2f1dcc4734f7909c53c88b787ff01f5190",
          "url": "https://github.com/l1a/retch/commit/5a56a32891519db3e8b22b1b22f25bccafaff7c3"
        },
        "date": 1790715104777,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2554530.74,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 265471749.7,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252342634.78000006,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1625275.06,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch",
            "value": 3248978.6400000006,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 398730559.09999996,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205620337.87999997,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2205894.76,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "SystemInfo__collect",
            "value": 477377434.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 968.2734151505495,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.76809183858227,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946608871292736,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.94899225286473,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7752.136722064934,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70553.8638921818,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4793.9357421999175,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3449.3751087873097,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57287.399970276965,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.78226620381076,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.1716525042259,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e79fef974446bac7f0e90a3babffe03184a8d0c",
          "message": "Fail the COPR run when secrets are missing here (#280)\n\ncopr.yml's credentials step printed a notice and exited 0 whenever a\nCOPR secret was empty. The skip exists so forks, which have no\nsecrets, stay green, but it fired on l1a/retch too: a lost secret\nwould give a green release run that rebuilt nothing. rusticprofile's\nidentical guard hid its never-added secrets that way for weeks.\n\nOn l1a/retch a missing secret is now an ::error:: and exit 1. Forks\nstill skip.\n\ncopr_check.py --self-test now extracts that step from copr.yml and\nruns it under bash with a throwaway HOME and GITHUB_ENV in three\ncases: canonical repo without secrets must fail, a fork must skip,\ncanonical repo with secrets must write the config. A fixture of the\nold guard must be caught. packaging.yml runs the self-test in CI and\nnow triggers on copr.yml changes, since copr.yml itself runs only on\na tag or by hand.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:02:31-07:00",
          "tree_id": "da4fe5e19592173f73ec9d5fb59423fe3fb0df7b",
          "url": "https://github.com/l1a/retch/commit/9e79fef974446bac7f0e90a3babffe03184a8d0c"
        },
        "date": 1790716332431,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2095053.0999999999,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252531273.87999997,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252264358.82,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1299399.4200000002,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch",
            "value": 2792328.4,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 361150335.98,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205242929.52,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1802654.2200000002,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "SystemInfo__collect",
            "value": 391516953.025,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 969.091446082826,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.39624713494814,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466429868847297,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 56.38141555076273,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7726.315545706845,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70561.3398618692,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4771.145987846661,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3422.4913359395673,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 56924.97382819592,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 344.620771802808,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.38775814496944,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e3d16e03aab826b6e8eb6d6b94d1df991165ba49",
          "message": "Fetch weather over plain HTTP, like fastfetch (#281)\n\nweather used one HTTPS request to wttr.in since v0.20.0. The TLS 1.3\nhandshake is one extra round trip to a server ~190 ms away: 570 vs\n373 ms median, 10 interleaved runs of the same request on arrakis. It\nwas the entire --full gap to fastfetch, which uses the same service\nover plain HTTP. HTTP answers 200 with the same body and no redirect,\nand an unknown location is still a 500, so curl -f still fails it.\n\n--full on arrakis (15 runs, AC): 621 -> 425 ms; fastfetch 519 ms.\nWeather output identical.\n\nThe trade-off is that the request and the approximate location in the\nreply are now unencrypted, and any hop can rewrite the reply.\nparse_wttr prints the location verbatim, so it now rejects any reply\ncontaining a control character: an ESC there would reach the\nterminal. Real replies never contain one; weather emoji are a symbol\nplus U+FE0F, a combining mark, and a test pins that they still parse.\n\nretch-sysinfo 0.1.86, retch-cli 0.20.10.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:53:35-07:00",
          "tree_id": "aaa14d15c51db8ebde24227739e7b4285f271d39",
          "url": "https://github.com/l1a/retch/commit/e3d16e03aab826b6e8eb6d6b94d1df991165ba49"
        },
        "date": 1790719501807,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2418726.6799999997,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252568005.84000006,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252419736.79999995,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1504668.1200000003,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch",
            "value": 3018240.38,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 216782480.23999995,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205297040.5,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2080673.72,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "SystemInfo__collect",
            "value": 239831830.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 984.2341362095788,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 111.35616627800569,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467302980551966,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.821656208658545,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7794.97209982301,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71334.28354705396,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4761.126238286066,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3438.1819242836464,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57139.40668243816,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 348.4362779523224,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.8388482713848,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c",
          "message": "Fix --list-distros and document real config paths (#282)\n\n--list-distros printed its own hand-written list, which never gained\nthe five logos added after it was written: mx, linuxmint, kali, zorin\nand garuda. Both it and --print-logos now read logo::KNOWN_LOGOS, and\ntwo tests pin the list to assets/logos/*.txt in both directions.\n\nThe config path is dirs::config_dir(): XDG on Linux, but\n~/Library/Application Support/retch/ on macOS and %APPDATA%\\retch\\ on\nWindows. The README, man page, COPR page and AGENTS.md all said\n~/.config/retch/, so a config put there was ignored on macOS and\nWindows. They now state each platform's path (user decision: document\nthe behaviour, don't change it). The man page also listed --short\nwithout Net and promised multi-second --full runs.\n\nThe Nix Home Manager module wrote xdg.configFile on macOS too, so its\nsettings never took effect there; on Darwin it now writes the\nApplication Support path. Checked with lib.evalModules in a nixos/nix\ncontainer for x86_64-linux and aarch64-darwin, old module as control.\n\nNOTES.md: section 6 said every fastfetch gap was closed on all three\nplatforms. Windows has no keyboard, mouse, brightness, power-adapter,\nlogin-manager or tpm; section 6a now lists them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:07:59-07:00",
          "tree_id": "7c8f75dd771a51b4256b304cfa00597809106e76",
          "url": "https://github.com/l1a/retch/commit/80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c"
        },
        "date": 1790738341887,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2076048.78,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 276674921.38000005,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252341715.76000002,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1233886.9400000002,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch",
            "value": 2710804.28,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 324015506.48,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205165008.95999998,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1873977.9400000004,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "SystemInfo__collect",
            "value": 340885547,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 984.7138039070762,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 111.2947241063152,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470161731585023,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 52.823581773549975,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7792.729661917976,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 69763.46860205542,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4755.767903237183,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3401.4660322515774,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57032.3848127844,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 348.65627334551607,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 288.53921423680225,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "19b379904d67825172c8333b277699b6a62fc2c8",
          "message": "Make ascii_only in config.toml select ASCII (#283)\n\ndisplay.rs picked the ASCII logo from the --ascii-logo flag alone and\nnever read the merged config's ascii_only, so the key did nothing. In\na pty claiming Kitty support, ascii_only = true still drew the Kitty\nimage while the flag drew ASCII. wants_ascii_logo now reads both;\nshould_show_logo still keys on the flag alone, since forcing a logo\ninto a pipe is for an explicit command-line request.\n\nAlso documents the chafa key and the custom logo.png (read from\nretch's config folder by the image protocols and Chafa), and corrects\nNOTES.md section 8: graphics is a default feature, so the extra\n--features graphics lint re-tests the default while the\n--no-default-features build, which fails clippy, goes untested.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:23:01-07:00",
          "tree_id": "66c37c0846880b9d3fbd50d81550777942848a1e",
          "url": "https://github.com/l1a/retch/commit/19b379904d67825172c8333b277699b6a62fc2c8"
        },
        "date": 1790739235955,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2388687.0999999996,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252987591.54,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252330378.28000003,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1520072.4400000002,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch",
            "value": 2848737.2000000007,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 247271474.54000002,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205576236.08000004,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2073724.84,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "SystemInfo__collect",
            "value": 318726345.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 970.3146607430311,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.93254471966861,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466555890085147,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.92033855632506,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7808.785924824051,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70995.97021190605,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4740.12214635385,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3432.482956914954,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57028.40042875274,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 349.72128109172735,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 274.31526023722927,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e67fdd5128a973545ef52e0d926ba03c6f976fab",
          "message": "Lint the build without default features (#284)\n\ngraphics has been a default feature since May, so the --workspace\nclippy already compiles it. just check's second clippy pass and CI's\ngraphics-feature job ran --features graphics on the belief that it was\noff by default, which only repeated the default. Meanwhile the build\nwithout it stopped passing clippy: three unused supports_* probes in\nlogo.rs and the never-constructed image variants of ActiveLogo.\n\nBoth now build and lint -p retch-cli --no-default-features, and the CI\njob is renamed no-default-features. The probes are cfg-gated like the\ncode that reads them; the enum gets a targeted, commented allowance,\nsince its layout code is shared. No shipped package uses that build.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:37:14-07:00",
          "tree_id": "915d3fe2cb4640a03978fc9320479f1f638dd51a",
          "url": "https://github.com/l1a/retch/commit/e67fdd5128a973545ef52e0d926ba03c6f976fab"
        },
        "date": 1790740033137,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2116655.4400000004,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252423135.00000003,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252458925.77999994,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1269749.72,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch",
            "value": 2758753.8400000003,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 245464465.80000004,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 209662688.17999998,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1789211.7200000002,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "SystemInfo__collect",
            "value": 344252268,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 972.7969614216587,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.62453866337107,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468357106880223,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.890615616736795,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7962.744480702588,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71247.83000821415,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4788.679227688337,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3423.43935275119,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57540.75137925331,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 357.534850520313,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.95666497142827,
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
          "id": "cc620fdc65929ad764ea2483f2befa92416dae56",
          "message": "Restart the benchmark dashboard, charted by version (#278)\n\nThe published history mixes things that cannot be compared: until\nv0.19.0 the fastfetch series measured the wrong workload (built-in\ndefault, no config, every module, or a personal config), the retch\nseries span a mode redefinition (cpu-usage left the default mode),\nlocal points carry no power state, and CI kept only 50 runs, 12 of\nthem with CLI timings. It is archived on gh-pages under\ndev/bench/archive/ with a note on what is comparable, and the\ndashboard starts again from this merge.\n\n- scripts/bench_meta.py stamps every CLI point's `extra` with the\n  version, plus AC or battery for local runs (on arrakis the power\n  state moved --short by ~0.3 ms). parse_criterion.py (CI) and\n  upload_local_bench.py (local) both use it; both self-tests check it.\n- benches/dashboard/ is our own chart page: points labelled by version,\n  and retch time divided by fastfetch time per mode from the same run,\n  which cancels CI runner speed (macOS CI's retch default alone ranged\n  334-2596 ms). Battery runs are drawn as triangles. model.js is tested\n  under Node by model.test.js in `just bench-check`; `just bench-page`\n  publishes the page (asks first).\n- History caps go from 50 (CI) and 100 (local) to 200 runs per suite;\n  the cap deletes older entries from data.js, not just from the chart.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-28T12:54:55-07:00",
          "tree_id": "47693cd0524bb851d2ac962fc52f1a9da73fe02c",
          "url": "https://github.com/l1a/retch/commit/cc620fdc65929ad764ea2483f2befa92416dae56"
        },
        "date": 1790625969279,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 469259925.18000007,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1012065641.54,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1149641252.48,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 19157439.500000004,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch",
            "value": 666129095.7800001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 843887991.7400001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 856873940.08,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 45095568.5,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "SystemInfo__collect",
            "value": 551037350.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 623.3960977761611,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 223.07718623535743,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.179341803364232,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 110.89332086266377,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6859.421310700791,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1976.9161662378897,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 644.7000862414643,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 162559.57184726815,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 601.6172588301699,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a56a32891519db3e8b22b1b22f25bccafaff7c3",
          "message": "Run the default benchmark mode first again (#279)\n\ncli_bench.py ran the four retch-vs-fastfetch pairs in MODES order\nsince v0.19.0, so --short ran first, straight after the build on a\ncold runner. The workflow before that always started with the default\nmode. The first run on the new order raised a macOS --short\nPerformance Alert (24.4 -> 52.4 ms) on a commit that changed no\n--short code.\n\nRUN_ORDER (default, short, long, full) now sets the order pairs() and\nrun() use. MODES is unchanged, since config generation and the strata\nlogic depend on it. Series are keyed by command string, so no\ndashboard series forks. The self-test pins the exact order, checks it\ncovers every mode once, and checks pairs() follows it.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T13:40:54-07:00",
          "tree_id": "eb5cbd2f1dcc4734f7909c53c88b787ff01f5190",
          "url": "https://github.com/l1a/retch/commit/5a56a32891519db3e8b22b1b22f25bccafaff7c3"
        },
        "date": 1790715105085,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 360400390.04,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1248987987.66,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1108864023.34,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 44429931.56,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch",
            "value": 739729560.64,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 645471425.16,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 705116590.0400001,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 28871639.96,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "SystemInfo__collect",
            "value": 1147079350.1,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 661.980926652773,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 201.30353919743482,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.5351148617942494,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 112.34741608987902,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 8089.926950180299,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1791.488166744725,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 631.2422997964717,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 189872.22660872893,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 518.8061917311461,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e79fef974446bac7f0e90a3babffe03184a8d0c",
          "message": "Fail the COPR run when secrets are missing here (#280)\n\ncopr.yml's credentials step printed a notice and exited 0 whenever a\nCOPR secret was empty. The skip exists so forks, which have no\nsecrets, stay green, but it fired on l1a/retch too: a lost secret\nwould give a green release run that rebuilt nothing. rusticprofile's\nidentical guard hid its never-added secrets that way for weeks.\n\nOn l1a/retch a missing secret is now an ::error:: and exit 1. Forks\nstill skip.\n\ncopr_check.py --self-test now extracts that step from copr.yml and\nruns it under bash with a throwaway HOME and GITHUB_ENV in three\ncases: canonical repo without secrets must fail, a fork must skip,\ncanonical repo with secrets must write the config. A fixture of the\nold guard must be caught. packaging.yml runs the self-test in CI and\nnow triggers on copr.yml changes, since copr.yml itself runs only on\na tag or by hand.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:02:31-07:00",
          "tree_id": "da4fe5e19592173f73ec9d5fb59423fe3fb0df7b",
          "url": "https://github.com/l1a/retch/commit/9e79fef974446bac7f0e90a3babffe03184a8d0c"
        },
        "date": 1790716332744,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 427695205.06,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1032561743.3000001,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1032560721.56,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 48879877.58,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch",
            "value": 850264554.96,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 762846710,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 793051109.26,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 43270831.78,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "SystemInfo__collect",
            "value": 657050037.55,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 606.5563111837782,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 199.9772142336347,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.2324710489147983,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 96.22790529143961,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6282.406985353342,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1885.0024295630938,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 657.9762330137995,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 107806.34779893028,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 548.5548920296487,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e3d16e03aab826b6e8eb6d6b94d1df991165ba49",
          "message": "Fetch weather over plain HTTP, like fastfetch (#281)\n\nweather used one HTTPS request to wttr.in since v0.20.0. The TLS 1.3\nhandshake is one extra round trip to a server ~190 ms away: 570 vs\n373 ms median, 10 interleaved runs of the same request on arrakis. It\nwas the entire --full gap to fastfetch, which uses the same service\nover plain HTTP. HTTP answers 200 with the same body and no redirect,\nand an unknown location is still a 500, so curl -f still fails it.\n\n--full on arrakis (15 runs, AC): 621 -> 425 ms; fastfetch 519 ms.\nWeather output identical.\n\nThe trade-off is that the request and the approximate location in the\nreply are now unencrypted, and any hop can rewrite the reply.\nparse_wttr prints the location verbatim, so it now rejects any reply\ncontaining a control character: an ESC there would reach the\nterminal. Real replies never contain one; weather emoji are a symbol\nplus U+FE0F, a combining mark, and a test pins that they still parse.\n\nretch-sysinfo 0.1.86, retch-cli 0.20.10.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:53:35-07:00",
          "tree_id": "aaa14d15c51db8ebde24227739e7b4285f271d39",
          "url": "https://github.com/l1a/retch/commit/e3d16e03aab826b6e8eb6d6b94d1df991165ba49"
        },
        "date": 1790719502010,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 299968425.88000005,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 969739031.6800002,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 973460983.9600002,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 45190724.760000005,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch",
            "value": 685179330.2800001,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 636019052.6800001,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 614306013.16,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 26452716.96,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "SystemInfo__collect",
            "value": 989310479.05,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 607.7507354976433,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 186.12778586222788,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.1178769640428294,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.88856630156664,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 7107.383407095959,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1692.2392847065446,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 660.5307812226831,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 139250.36709693473,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 489.24540999334056,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c",
          "message": "Fix --list-distros and document real config paths (#282)\n\n--list-distros printed its own hand-written list, which never gained\nthe five logos added after it was written: mx, linuxmint, kali, zorin\nand garuda. Both it and --print-logos now read logo::KNOWN_LOGOS, and\ntwo tests pin the list to assets/logos/*.txt in both directions.\n\nThe config path is dirs::config_dir(): XDG on Linux, but\n~/Library/Application Support/retch/ on macOS and %APPDATA%\\retch\\ on\nWindows. The README, man page, COPR page and AGENTS.md all said\n~/.config/retch/, so a config put there was ignored on macOS and\nWindows. They now state each platform's path (user decision: document\nthe behaviour, don't change it). The man page also listed --short\nwithout Net and promised multi-second --full runs.\n\nThe Nix Home Manager module wrote xdg.configFile on macOS too, so its\nsettings never took effect there; on Darwin it now writes the\nApplication Support path. Checked with lib.evalModules in a nixos/nix\ncontainer for x86_64-linux and aarch64-darwin, old module as control.\n\nNOTES.md: section 6 said every fastfetch gap was closed on all three\nplatforms. Windows has no keyboard, mouse, brightness, power-adapter,\nlogin-manager or tpm; section 6a now lists them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:07:59-07:00",
          "tree_id": "7c8f75dd771a51b4256b304cfa00597809106e76",
          "url": "https://github.com/l1a/retch/commit/80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c"
        },
        "date": 1790738342171,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 423574922.5000001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1161871875.2600002,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1070039286.6199999,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 22560108.340000004,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch",
            "value": 759749197.4000001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 829334295.7600001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 844414986.72,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 32868516.54000001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "SystemInfo__collect",
            "value": 918060047.9,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 611.1250338042705,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 188.30519995811298,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.866825961186423,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.1358593109275,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6899.30208843914,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1693.195135803382,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 607.9665783263401,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 131009.7586061788,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 526.333012756334,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "19b379904d67825172c8333b277699b6a62fc2c8",
          "message": "Make ascii_only in config.toml select ASCII (#283)\n\ndisplay.rs picked the ASCII logo from the --ascii-logo flag alone and\nnever read the merged config's ascii_only, so the key did nothing. In\na pty claiming Kitty support, ascii_only = true still drew the Kitty\nimage while the flag drew ASCII. wants_ascii_logo now reads both;\nshould_show_logo still keys on the flag alone, since forcing a logo\ninto a pipe is for an explicit command-line request.\n\nAlso documents the chafa key and the custom logo.png (read from\nretch's config folder by the image protocols and Chafa), and corrects\nNOTES.md section 8: graphics is a default feature, so the extra\n--features graphics lint re-tests the default while the\n--no-default-features build, which fails clippy, goes untested.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:23:01-07:00",
          "tree_id": "66c37c0846880b9d3fbd50d81550777942848a1e",
          "url": "https://github.com/l1a/retch/commit/19b379904d67825172c8333b277699b6a62fc2c8"
        },
        "date": 1790739236234,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 381041897.44,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1128679490.8799999,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1053755837.46,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 24116961.82,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch",
            "value": 681113159.8400002,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 784298932.6800002,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 749045412.4599999,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 25064499.220000003,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "SystemInfo__collect",
            "value": 794382383.3,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 559.2635321632854,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 157.83924968455813,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.5595327766594247,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 80.37130146429547,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5835.304401228855,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1545.586090146945,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 563.8823902029137,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 130318.58673908061,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 452.56066407984383,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e67fdd5128a973545ef52e0d926ba03c6f976fab",
          "message": "Lint the build without default features (#284)\n\ngraphics has been a default feature since May, so the --workspace\nclippy already compiles it. just check's second clippy pass and CI's\ngraphics-feature job ran --features graphics on the belief that it was\noff by default, which only repeated the default. Meanwhile the build\nwithout it stopped passing clippy: three unused supports_* probes in\nlogo.rs and the never-constructed image variants of ActiveLogo.\n\nBoth now build and lint -p retch-cli --no-default-features, and the CI\njob is renamed no-default-features. The probes are cfg-gated like the\ncode that reads them; the enum gets a targeted, commented allowance,\nsince its layout code is shared. No shipped package uses that build.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:37:14-07:00",
          "tree_id": "915d3fe2cb4640a03978fc9320479f1f638dd51a",
          "url": "https://github.com/l1a/retch/commit/e67fdd5128a973545ef52e0d926ba03c6f976fab"
        },
        "date": 1790740033447,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 407748534.36,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1037505106.72,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1014032101.7600002,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 16187462.64,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch",
            "value": 495380250.9600001,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 490942144.12000006,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 508979364.36,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 22559649.94,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "SystemInfo__collect",
            "value": 613473743.9,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 478.81329079066506,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 142.1188119983438,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8564937866919287,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 65.06344876324927,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4985.92896027574,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1075.5096674861109,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 450.1887211068324,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 97013.35041969907,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 363.0580888791869,
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
          "id": "cc620fdc65929ad764ea2483f2befa92416dae56",
          "message": "Restart the benchmark dashboard, charted by version (#278)\n\nThe published history mixes things that cannot be compared: until\nv0.19.0 the fastfetch series measured the wrong workload (built-in\ndefault, no config, every module, or a personal config), the retch\nseries span a mode redefinition (cpu-usage left the default mode),\nlocal points carry no power state, and CI kept only 50 runs, 12 of\nthem with CLI timings. It is archived on gh-pages under\ndev/bench/archive/ with a note on what is comparable, and the\ndashboard starts again from this merge.\n\n- scripts/bench_meta.py stamps every CLI point's `extra` with the\n  version, plus AC or battery for local runs (on arrakis the power\n  state moved --short by ~0.3 ms). parse_criterion.py (CI) and\n  upload_local_bench.py (local) both use it; both self-tests check it.\n- benches/dashboard/ is our own chart page: points labelled by version,\n  and retch time divided by fastfetch time per mode from the same run,\n  which cancels CI runner speed (macOS CI's retch default alone ranged\n  334-2596 ms). Battery runs are drawn as triangles. model.js is tested\n  under Node by model.test.js in `just bench-check`; `just bench-page`\n  publishes the page (asks first).\n- History caps go from 50 (CI) and 100 (local) to 200 runs per suite;\n  the cap deletes older entries from data.js, not just from the chart.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-28T12:54:55-07:00",
          "tree_id": "47693cd0524bb851d2ac962fc52f1a9da73fe02c",
          "url": "https://github.com/l1a/retch/commit/cc620fdc65929ad764ea2483f2befa92416dae56"
        },
        "date": 1790625969586,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 33647894,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2348982282,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1305748146,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 26319183.999999996,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch",
            "value": 31995763.999999996,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 379209442.00000006,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 133963455.99999999,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 32089364.000000004,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 224.40685712094955,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.395697408032431,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 124.98465312604883,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.84000257461123,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45137.91457994366,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 558.5316903463056,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 811.2860657177702,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 349927800,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a56a32891519db3e8b22b1b22f25bccafaff7c3",
          "message": "Run the default benchmark mode first again (#279)\n\ncli_bench.py ran the four retch-vs-fastfetch pairs in MODES order\nsince v0.19.0, so --short ran first, straight after the build on a\ncold runner. The workflow before that always started with the default\nmode. The first run on the new order raised a macOS --short\nPerformance Alert (24.4 -> 52.4 ms) on a commit that changed no\n--short code.\n\nRUN_ORDER (default, short, long, full) now sets the order pairs() and\nrun() use. MODES is unchanged, since config generation and the strata\nlogic depend on it. Series are keyed by command string, so no\ndashboard series forks. The self-test pins the exact order, checks it\ncovers every mode once, and checks pairs() follows it.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T13:40:54-07:00",
          "tree_id": "eb5cbd2f1dcc4734f7909c53c88b787ff01f5190",
          "url": "https://github.com/l1a/retch/commit/5a56a32891519db3e8b22b1b22f25bccafaff7c3"
        },
        "date": 1790715105955,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 33755446.00000001,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2343049060.0000005,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1306691298,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 25002236,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch",
            "value": 31139906.000000004,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 428122340,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 147986618.00000003,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 27805836,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 228.32985976823625,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.380020022625235,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 126.59237267861985,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 101.18806533843528,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41942.28809660335,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 579.3418740119147,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 855.5101060115192,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 398169890,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e79fef974446bac7f0e90a3babffe03184a8d0c",
          "message": "Fail the COPR run when secrets are missing here (#280)\n\ncopr.yml's credentials step printed a notice and exited 0 whenever a\nCOPR secret was empty. The skip exists so forks, which have no\nsecrets, stay green, but it fired on l1a/retch too: a lost secret\nwould give a green release run that rebuilt nothing. rusticprofile's\nidentical guard hid its never-added secrets that way for weeks.\n\nOn l1a/retch a missing secret is now an ::error:: and exit 1. Forks\nstill skip.\n\ncopr_check.py --self-test now extracts that step from copr.yml and\nruns it under bash with a throwaway HOME and GITHUB_ENV in three\ncases: canonical repo without secrets must fail, a fork must skip,\ncanonical repo with secrets must write the config. A fixture of the\nold guard must be caught. packaging.yml runs the self-test in CI and\nnow triggers on copr.yml changes, since copr.yml itself runs only on\na tag or by hand.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:02:31-07:00",
          "tree_id": "da4fe5e19592173f73ec9d5fb59423fe3fb0df7b",
          "url": "https://github.com/l1a/retch/commit/9e79fef974446bac7f0e90a3babffe03184a8d0c"
        },
        "date": 1790716333053,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 43130838.00000001,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2371513716,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1305214954,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 23130802,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch",
            "value": 31049887.999999996,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 369759126.00000006,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 133636484,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 25888642.000000007,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 175.29362031443628,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.161006121602732,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.51408256188476,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 75.1211788588742,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 32911.496209858764,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 448.977998902894,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 613.8684445875995,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 347823685,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e3d16e03aab826b6e8eb6d6b94d1df991165ba49",
          "message": "Fetch weather over plain HTTP, like fastfetch (#281)\n\nweather used one HTTPS request to wttr.in since v0.20.0. The TLS 1.3\nhandshake is one extra round trip to a server ~190 ms away: 570 vs\n373 ms median, 10 interleaved runs of the same request on arrakis. It\nwas the entire --full gap to fastfetch, which uses the same service\nover plain HTTP. HTTP answers 200 with the same body and no redirect,\nand an unknown location is still a 500, so curl -f still fails it.\n\n--full on arrakis (15 runs, AC): 621 -> 425 ms; fastfetch 519 ms.\nWeather output identical.\n\nThe trade-off is that the request and the approximate location in the\nreply are now unencrypted, and any hop can rewrite the reply.\nparse_wttr prints the location verbatim, so it now rejects any reply\ncontaining a control character: an ESC there would reach the\nterminal. Real replies never contain one; weather emoji are a symbol\nplus U+FE0F, a combining mark, and a test pins that they still parse.\n\nretch-sysinfo 0.1.86, retch-cli 0.20.10.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:53:35-07:00",
          "tree_id": "aaa14d15c51db8ebde24227739e7b4285f271d39",
          "url": "https://github.com/l1a/retch/commit/e3d16e03aab826b6e8eb6d6b94d1df991165ba49"
        },
        "date": 1790719502202,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 41538934.00000001,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2371314460,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1308042762,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21626878.000000007,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch",
            "value": 25835884.000000004,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 354832830,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 127049041.99999997,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 25005908.000000004,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 183.67072014931796,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.073988101132637,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 105.54503692759836,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.27256843974318,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 36140.929274669754,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 442.0362915901236,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 639.6062452205844,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 346175192.5,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c",
          "message": "Fix --list-distros and document real config paths (#282)\n\n--list-distros printed its own hand-written list, which never gained\nthe five logos added after it was written: mx, linuxmint, kali, zorin\nand garuda. Both it and --print-logos now read logo::KNOWN_LOGOS, and\ntwo tests pin the list to assets/logos/*.txt in both directions.\n\nThe config path is dirs::config_dir(): XDG on Linux, but\n~/Library/Application Support/retch/ on macOS and %APPDATA%\\retch\\ on\nWindows. The README, man page, COPR page and AGENTS.md all said\n~/.config/retch/, so a config put there was ignored on macOS and\nWindows. They now state each platform's path (user decision: document\nthe behaviour, don't change it). The man page also listed --short\nwithout Net and promised multi-second --full runs.\n\nThe Nix Home Manager module wrote xdg.configFile on macOS too, so its\nsettings never took effect there; on Darwin it now writes the\nApplication Support path. Checked with lib.evalModules in a nixos/nix\ncontainer for x86_64-linux and aarch64-darwin, old module as control.\n\nNOTES.md: section 6 said every fastfetch gap was closed on all three\nplatforms. Windows has no keyboard, mouse, brightness, power-adapter,\nlogin-manager or tpm; section 6a now lists them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:07:59-07:00",
          "tree_id": "7c8f75dd771a51b4256b304cfa00597809106e76",
          "url": "https://github.com/l1a/retch/commit/80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c"
        },
        "date": 1790738342457,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 32936021.999999996,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2347542490,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1306175441.9999998,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 25350462,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch",
            "value": 31246422.000000004,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 269300569.99999994,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 132432692.00000001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 27591862.000000004,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 223.81024477997357,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.480660924058066,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 127.72944167105463,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 95.26557861397244,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43548.535824852916,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 588.2156783995994,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 818.9494834560011,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 258105570,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "19b379904d67825172c8333b277699b6a62fc2c8",
          "message": "Make ascii_only in config.toml select ASCII (#283)\n\ndisplay.rs picked the ASCII logo from the --ascii-logo flag alone and\nnever read the merged config's ascii_only, so the key did nothing. In\na pty claiming Kitty support, ascii_only = true still drew the Kitty\nimage while the flag drew ASCII. wants_ascii_logo now reads both;\nshould_show_logo still keys on the flag alone, since forcing a logo\ninto a pipe is for an explicit command-line request.\n\nAlso documents the chafa key and the custom logo.png (read from\nretch's config folder by the image protocols and Chafa), and corrects\nNOTES.md section 8: graphics is a default feature, so the extra\n--features graphics lint re-tests the default while the\n--no-default-features build, which fails clippy, goes untested.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:23:01-07:00",
          "tree_id": "66c37c0846880b9d3fbd50d81550777942848a1e",
          "url": "https://github.com/l1a/retch/commit/19b379904d67825172c8333b277699b6a62fc2c8"
        },
        "date": 1790739236505,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 32438200,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2336981088.0000005,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1306884830,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 26989307.999999996,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch",
            "value": 28845610,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 347020377.99999994,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 130555670.00000001,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 26818018.000000007,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 232.65693402676584,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.072186406056984,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 130.7112310891473,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 103.22057092922721,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41802.19281410904,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 572.3307870868058,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 830.128086556669,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 340607275,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e67fdd5128a973545ef52e0d926ba03c6f976fab",
          "message": "Lint the build without default features (#284)\n\ngraphics has been a default feature since May, so the --workspace\nclippy already compiles it. just check's second clippy pass and CI's\ngraphics-feature job ran --features graphics on the belief that it was\noff by default, which only repeated the default. Meanwhile the build\nwithout it stopped passing clippy: three unused supports_* probes in\nlogo.rs and the never-constructed image variants of ActiveLogo.\n\nBoth now build and lint -p retch-cli --no-default-features, and the CI\njob is renamed no-default-features. The probes are cfg-gated like the\ncode that reads them; the enum gets a targeted, commented allowance,\nsince its layout code is shared. No shipped package uses that build.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:37:14-07:00",
          "tree_id": "915d3fe2cb4640a03978fc9320479f1f638dd51a",
          "url": "https://github.com/l1a/retch/commit/e67fdd5128a973545ef52e0d926ba03c6f976fab"
        },
        "date": 1790740033752,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 41707194.00000001,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2368259981.9999995,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1305522958,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 20935030,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch",
            "value": 24381404.000000004,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 343604562.00000006,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 125686718,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 21089800,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 179.16953916342737,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.116670119281962,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 102.83334397258784,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.09608533027836,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 32802.43184891498,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 433.7725221431375,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 642.4614156244318,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 319982325,
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
          "id": "cc620fdc65929ad764ea2483f2befa92416dae56",
          "message": "Restart the benchmark dashboard, charted by version (#278)\n\nThe published history mixes things that cannot be compared: until\nv0.19.0 the fastfetch series measured the wrong workload (built-in\ndefault, no config, every module, or a personal config), the retch\nseries span a mode redefinition (cpu-usage left the default mode),\nlocal points carry no power state, and CI kept only 50 runs, 12 of\nthem with CLI timings. It is archived on gh-pages under\ndev/bench/archive/ with a note on what is comparable, and the\ndashboard starts again from this merge.\n\n- scripts/bench_meta.py stamps every CLI point's `extra` with the\n  version, plus AC or battery for local runs (on arrakis the power\n  state moved --short by ~0.3 ms). parse_criterion.py (CI) and\n  upload_local_bench.py (local) both use it; both self-tests check it.\n- benches/dashboard/ is our own chart page: points labelled by version,\n  and retch time divided by fastfetch time per mode from the same run,\n  which cancels CI runner speed (macOS CI's retch default alone ranged\n  334-2596 ms). Battery runs are drawn as triangles. model.js is tested\n  under Node by model.test.js in `just bench-check`; `just bench-page`\n  publishes the page (asks first).\n- History caps go from 50 (CI) and 100 (local) to 200 runs per suite;\n  the cap deletes older entries from data.js, not just from the chart.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-28T12:54:55-07:00",
          "tree_id": "47693cd0524bb851d2ac962fc52f1a9da73fe02c",
          "url": "https://github.com/l1a/retch/commit/cc620fdc65929ad764ea2483f2befa92416dae56"
        },
        "date": 1790625969894,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 55528644,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2396484672,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1317890965.9999998,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 36017699.999999985,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch",
            "value": 39476974.00000001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 604655492.0000001,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 170591016.00000003,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36928739.99999998,
            "unit": "ns",
            "extra": "v0.20.7"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 180.6718595710349,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9478646825941697,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.4848182954614,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.28760752834862,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46842.77155034908,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 484.53111494709253,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 727.8887105030391,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 749879690,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a56a32891519db3e8b22b1b22f25bccafaff7c3",
          "message": "Run the default benchmark mode first again (#279)\n\ncli_bench.py ran the four retch-vs-fastfetch pairs in MODES order\nsince v0.19.0, so --short ran first, straight after the build on a\ncold runner. The workflow before that always started with the default\nmode. The first run on the new order raised a macOS --short\nPerformance Alert (24.4 -> 52.4 ms) on a commit that changed no\n--short code.\n\nRUN_ORDER (default, short, long, full) now sets the order pairs() and\nrun() use. MODES is unchanged, since config generation and the strata\nlogic depend on it. Series are keyed by command string, so no\ndashboard series forks. The self-test pins the exact order, checks it\ncovers every mode once, and checks pairs() follows it.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T13:40:54-07:00",
          "tree_id": "eb5cbd2f1dcc4734f7909c53c88b787ff01f5190",
          "url": "https://github.com/l1a/retch/commit/5a56a32891519db3e8b22b1b22f25bccafaff7c3"
        },
        "date": 1790715106264,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 56627490.00000002,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2391854102,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1322022456,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 35060864,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch",
            "value": 38356310.000000015,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 449181722.00000006,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 174214596.00000003,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36993444,
            "unit": "ns",
            "extra": "v0.20.8"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 181.77709790855667,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9507274730689304,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.73221016286631,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.99300507277881,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46063.9772188206,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 497.96653113339664,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 726.4206410900284,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 414415560,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e79fef974446bac7f0e90a3babffe03184a8d0c",
          "message": "Fail the COPR run when secrets are missing here (#280)\n\ncopr.yml's credentials step printed a notice and exited 0 whenever a\nCOPR secret was empty. The skip exists so forks, which have no\nsecrets, stay green, but it fired on l1a/retch too: a lost secret\nwould give a green release run that rebuilt nothing. rusticprofile's\nidentical guard hid its never-added secrets that way for weeks.\n\nOn l1a/retch a missing secret is now an ::error:: and exit 1. Forks\nstill skip.\n\ncopr_check.py --self-test now extracts that step from copr.yml and\nruns it under bash with a throwaway HOME and GITHUB_ENV in three\ncases: canonical repo without secrets must fail, a fork must skip,\ncanonical repo with secrets must write the config. A fixture of the\nold guard must be caught. packaging.yml runs the self-test in CI and\nnow triggers on copr.yml changes, since copr.yml itself runs only on\na tag or by hand.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:02:31-07:00",
          "tree_id": "da4fe5e19592173f73ec9d5fb59423fe3fb0df7b",
          "url": "https://github.com/l1a/retch/commit/9e79fef974446bac7f0e90a3babffe03184a8d0c"
        },
        "date": 1790716333364,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 54295268.00000001,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2398536984,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1321205612,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 36937642,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch",
            "value": 39336757.99999999,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 609394184,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 169493482,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 38044572.00000001,
            "unit": "ns",
            "extra": "v0.20.9"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 180.31143783064672,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9484743334880075,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 101.03254466863872,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.68129985440677,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47937.687863265295,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 482.011231135669,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 713.6620380663466,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 549939400,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e3d16e03aab826b6e8eb6d6b94d1df991165ba49",
          "message": "Fetch weather over plain HTTP, like fastfetch (#281)\n\nweather used one HTTPS request to wttr.in since v0.20.0. The TLS 1.3\nhandshake is one extra round trip to a server ~190 ms away: 570 vs\n373 ms median, 10 interleaved runs of the same request on arrakis. It\nwas the entire --full gap to fastfetch, which uses the same service\nover plain HTTP. HTTP answers 200 with the same body and no redirect,\nand an unknown location is still a 500, so curl -f still fails it.\n\n--full on arrakis (15 runs, AC): 621 -> 425 ms; fastfetch 519 ms.\nWeather output identical.\n\nThe trade-off is that the request and the approximate location in the\nreply are now unencrypted, and any hop can rewrite the reply.\nparse_wttr prints the location verbatim, so it now rejects any reply\ncontaining a control character: an ESC there would reach the\nterminal. Real replies never contain one; weather emoji are a symbol\nplus U+FE0F, a combining mark, and a test pins that they still parse.\n\nretch-sysinfo 0.1.86, retch-cli 0.20.10.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T14:53:35-07:00",
          "tree_id": "aaa14d15c51db8ebde24227739e7b4285f271d39",
          "url": "https://github.com/l1a/retch/commit/e3d16e03aab826b6e8eb6d6b94d1df991165ba49"
        },
        "date": 1790719502388,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 64608714,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2396396672,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1320800530,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 36105576,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch",
            "value": 38122783.999999985,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 341882442.00000006,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 174971210,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36640186,
            "unit": "ns",
            "extra": "v0.20.10"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 179.57789799638633,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94777248835411,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.30075978297066,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.57338712264018,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48329.16065431113,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 486.96315105674387,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 727.7504204454182,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 291445215,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c",
          "message": "Fix --list-distros and document real config paths (#282)\n\n--list-distros printed its own hand-written list, which never gained\nthe five logos added after it was written: mx, linuxmint, kali, zorin\nand garuda. Both it and --print-logos now read logo::KNOWN_LOGOS, and\ntwo tests pin the list to assets/logos/*.txt in both directions.\n\nThe config path is dirs::config_dir(): XDG on Linux, but\n~/Library/Application Support/retch/ on macOS and %APPDATA%\\retch\\ on\nWindows. The README, man page, COPR page and AGENTS.md all said\n~/.config/retch/, so a config put there was ignored on macOS and\nWindows. They now state each platform's path (user decision: document\nthe behaviour, don't change it). The man page also listed --short\nwithout Net and promised multi-second --full runs.\n\nThe Nix Home Manager module wrote xdg.configFile on macOS too, so its\nsettings never took effect there; on Darwin it now writes the\nApplication Support path. Checked with lib.evalModules in a nixos/nix\ncontainer for x86_64-linux and aarch64-darwin, old module as control.\n\nNOTES.md: section 6 said every fastfetch gap was closed on all three\nplatforms. Windows has no keyboard, mouse, brightness, power-adapter,\nlogin-manager or tpm; section 6a now lists them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:07:59-07:00",
          "tree_id": "7c8f75dd771a51b4256b304cfa00597809106e76",
          "url": "https://github.com/l1a/retch/commit/80bbe4b3c7c3fd3636ffef5ce5c7557d0d6d749c"
        },
        "date": 1790738342771,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 57023792,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2392524432.0000005,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1331007498,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 33629504,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch",
            "value": 37017942.00000001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 332293832,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 172498188.00000003,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 35734824.00000001,
            "unit": "ns",
            "extra": "v0.20.11"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 180.10282435358968,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9527708778857855,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.43168154802726,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.93507319532134,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46716.988267329616,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 484.5607443265035,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 721.9879257696641,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 285921482.5,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "19b379904d67825172c8333b277699b6a62fc2c8",
          "message": "Make ascii_only in config.toml select ASCII (#283)\n\ndisplay.rs picked the ASCII logo from the --ascii-logo flag alone and\nnever read the merged config's ascii_only, so the key did nothing. In\na pty claiming Kitty support, ascii_only = true still drew the Kitty\nimage while the flag drew ASCII. wants_ascii_logo now reads both;\nshould_show_logo still keys on the flag alone, since forcing a logo\ninto a pipe is for an explicit command-line request.\n\nAlso documents the chafa key and the custom logo.png (read from\nretch's config folder by the image protocols and Chafa), and corrects\nNOTES.md section 8: graphics is a default feature, so the extra\n--features graphics lint re-tests the default while the\n--no-default-features build, which fails clippy, goes untested.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:23:01-07:00",
          "tree_id": "66c37c0846880b9d3fbd50d81550777942848a1e",
          "url": "https://github.com/l1a/retch/commit/19b379904d67825172c8333b277699b6a62fc2c8"
        },
        "date": 1790739236791,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 55933030.00000001,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2397136816.0000005,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1344961135.9999998,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 34871828.00000001,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch",
            "value": 37390880,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 407046796.0000001,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 147052666.00000003,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36946498.00000001,
            "unit": "ns",
            "extra": "v0.20.12"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 179.90688053286664,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9482071173012434,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 99.85225718570506,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.72885288905269,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48933.74592685407,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 475.0113394150179,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 710.2749674257132,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 348691760,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e67fdd5128a973545ef52e0d926ba03c6f976fab",
          "message": "Lint the build without default features (#284)\n\ngraphics has been a default feature since May, so the --workspace\nclippy already compiles it. just check's second clippy pass and CI's\ngraphics-feature job ran --features graphics on the belief that it was\noff by default, which only repeated the default. Meanwhile the build\nwithout it stopped passing clippy: three unused supports_* probes in\nlogo.rs and the never-constructed image variants of ActiveLogo.\n\nBoth now build and lint -p retch-cli --no-default-features, and the CI\njob is renamed no-default-features. The probes are cfg-gated like the\ncode that reads them; the enum gets a targeted, commented allowance,\nsince its layout code is shared. No shipped package uses that build.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-09-29T20:37:14-07:00",
          "tree_id": "915d3fe2cb4640a03978fc9320479f1f638dd51a",
          "url": "https://github.com/l1a/retch/commit/e67fdd5128a973545ef52e0d926ba03c6f976fab"
        },
        "date": 1790740034048,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 56364238,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2401334158,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1319881723.9999998,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 35067576.00000001,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch",
            "value": 37550858,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 304528348,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 143511644,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36528366.00000001,
            "unit": "ns",
            "extra": "v0.20.13"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 182.91746903113363,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9559283928308657,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 100.0020904805248,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 79.43132738333523,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44904.4395033912,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 475.6454315670224,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 704.2709983708103,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 257450970,
            "unit": "ns"
          }
        ]
      }
    ]
  }
}