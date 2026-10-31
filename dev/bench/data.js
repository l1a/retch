window.BENCHMARK_DATA = {
  "lastUpdate": 1793482956561,
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
          "id": "ddc8016cedff49fcd78adaf49f6bd6b5b41987e6",
          "message": "Fix release notes after v0.20.16 (#288)\n\nCorrect NOTES.md: cargo owner --list does not authenticate the\ncrates.io token, the newest released tag is v0.20.16, and record\nthe auto-mode blocks hit during the release. Bump to 0.20.17.\n\nAssisted-By: Claude Sonnet 5.5",
          "timestamp": "2026-10-02T13:28:51-07:00",
          "tree_id": "cbeeadcd4295a30f824bf2b9c0bc725f87ce1436",
          "url": "https://github.com/l1a/retch/commit/ddc8016cedff49fcd78adaf49f6bd6b5b41987e6"
        },
        "date": 1790972961392,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 2186472.64,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 8154253.84,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 1471015.4,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 1432230.0000000002,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 216414794.30000004,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 509535046.70000017,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 375711695.2600001,
            "extra": "v0.20.17; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 514743880.05999994,
            "extra": "v0.20.17; AC"
          }
        ]
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
          "id": "a7cfa0c3f0e28dae4eec94464824108211b7af7e",
          "message": "Make CLI benchmarks work under hyperfine 2.0 (#292)\n\nhyperfine 2.0.0 reached crates.io around 2026-10-10 and broke the CLI\nbenchmarks two ways, both silently.\n\nIt runs commands with no shell by default and splits them with POSIX\nrules, so a backslash is an escape. The Windows x64 runner falls back\nto an unpinned `cargo install hyperfine`, got 2.0, and turned\n.\\target\\release\\retch.exe into .targetreleaseretch.exe: the main\nbenchmark job failed with \"program not found\" on #290 and #291, so that\nsuite has no v0.20.18 or v0.20.19 point. cli_bench.py and `just\nbench-cli` now pass --shell=none explicitly (1.13+ accepts it too), so\nevery hyperfine version measures the same way, and spell the Windows\nbinary ./target/release/retch.exe. Labels key on the flags, so no\ndashboard series forks.\n\nIts JSON export is a new schema: no top-level `mean`; wall-clock time\nis summary.time_wall_clock.mean. labelled_means read only the 1.x key,\nso with hyperfine 2.0 installed locally the post-merge hook published\ntwo empty points (51cfe8f, 8d20d64) while every step reported success.\nmean_seconds now reads both schemas, and both publishers\n(parse_criterion.py, upload_local_bench.py) refuse a run missing any\nexpected series (missing_series).\n\nVerified: real runs under hyperfine 2.0.0 and 1.18.0 produce all eight\nseries; the uploader's dry run collects eight and, with the 2.x reader\nremoved, refuses. Eight mutations, each caught by its intended test.\n\nNOTES also records the arrakis GPU check, the CI dashboard read\n(Linux x64 --full behind; check fastfetch's weather first), and the\nbare-command `just merge-pr` allow rule.\n\nretch-cli 0.20.19 -> 0.20.20.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T20:51:02-07:00",
          "tree_id": "54584a1b0a27b5f07c61be671ff440acac57c4e8",
          "url": "https://github.com/l1a/retch/commit/a7cfa0c3f0e28dae4eec94464824108211b7af7e"
        },
        "date": 1791777097537,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 7083169.6,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 23348798.6,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 3508628.300000001,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 5826492.1,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 222429856.79999995,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 520158755,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 509751555.50000006,
            "extra": "v0.20.20; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 600122106.9,
            "extra": "v0.20.20; AC"
          }
        ]
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
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792595677439,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 4698917.300000001,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 14007192.500000002,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2634861.5,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2840120.1999999997,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 244248881.10000002,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 520471831.1999999,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 431936964.6000001,
            "extra": "v0.20.24; battery"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 534893590.1,
            "extra": "v0.20.24; battery"
          }
        ]
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
          "id": "7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6",
          "message": "Bump libc to 0.2.191 (consolidate #298) (#299)\n\nRolls Dependabot #298 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" spec already admits libc 0.2.191, and the Cargo.lock\nlines are identical to Dependabot's.\n\nretch-sysinfo stays at 0.1.91: a lockfile change alters nothing that\ncrate publishes.\n\nretch-cli 0.20.24 -> 0.20.25.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T08:50:41-07:00",
          "tree_id": "b47069d397a2fa415048399d8c3d37e546d8d089",
          "url": "https://github.com/l1a/retch/commit/7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6"
        },
        "date": 1792597877700,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 4780481.899999999,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 13817968.800000003,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2841470.1,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2047225.3000000003,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 248292196.69999996,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 521033213.10000014,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 434972719.40000004,
            "extra": "v0.20.25; battery"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 536089376.90000004,
            "extra": "v0.20.25; battery"
          }
        ]
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
          "id": "d485e1a7bed3201d40b5138243c3ea96403fb647",
          "message": "Note that syncing main publishes a benchmark (#300)\n\nThe post-merge hook fires after any merge onto main, a fast-forward\npull included, and pushes a local benchmark point to gh-pages. Record\nthat in NOTES 7.5 with the two ways to sync without publishing\n(GIT_NO_BENCH=1, or branch from origin/main), and the --no-track trap\nin the second: a branch tracking origin/main makes just open-pr skip\nits push.\n\nDocs-only. retch-cli 0.20.25 -> 0.20.26.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T09:13:07-07:00",
          "tree_id": "ee5373a58754448005eabf22e9420c2a687af91b",
          "url": "https://github.com/l1a/retch/commit/d485e1a7bed3201d40b5138243c3ea96403fb647"
        },
        "date": 1792599224270,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 3781382.9000000004,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 10978473.1,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2281677.9,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2383038.6999999997,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 223429121.00000003,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 512120898.20000005,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 523238921.6000002,
            "extra": "v0.20.26; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 530383865.6000001,
            "extra": "v0.20.26; AC"
          }
        ]
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
          "id": "d755c1b4920cd8b578b1e3a7465dae3f96e1f883",
          "message": "Overlap temp/wm; refuse skipped weather (#301)\n\n* Overlap temp/wm; refuse skipped weather\n\n--full no longer pays temp then wm after weather\n(~21 ms). CLI benches fail if Public IP or Weather\nis missing, so Linux CI cannot win by failing fast.\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n* Handle Windows bench UTF-8 I/O\n\nDecode captured stdout as UTF-8 and print via\nconsole_safe so cp1252 cannot crash on weather emoji.\n\nAssisted-By: Composer\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>",
          "timestamp": "2026-10-23T16:02:49-07:00",
          "tree_id": "49b6c1563e755ad02c7fb5666baa89af24e01638",
          "url": "https://github.com/l1a/retch/commit/d755c1b4920cd8b578b1e3a7465dae3f96e1f883"
        },
        "date": 1792796606784,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 4850844.400000001,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 14758455.900000004,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2899357.2,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 2752365.6999999993,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 219938925.50000003,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 518054439.4000001,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 387175207.3000001,
            "extra": "v0.20.27; battery"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 533239386.8000001,
            "extra": "v0.20.27; battery"
          }
        ]
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
          "id": "b882a0d743af4260a034c8100ceb5aa927773247",
          "message": "Single-source long-form channel text (#302)\n\nUnify README.md's top overview with packaging/copr/project-description.md\nbetween <!-- BEGIN copr-description --> / <!-- END copr-description -->\nmarkers (with all three platforms' config paths and absolute https://\nlinks, since crates.io rewrites repo-relative file links to blob/HEAD/...\nwhile COPR renders on its own domain and resolves neither relative paths\nnor #anchor fragments).\n\nReplace the manual //! crate header and ReadmeDoctests struct in\ncrates/sysinfo/src/lib.rs with #![doc = include_str!(\"../README.md\")] so\ndocs.rs and crates/sysinfo/README.md are one text and its code block\nstill compiles as a doctest.\n\nEnforce both invariants in scripts/metadata_check.py (plus --sync-copr\nand negative self-tests) and watch **/README.md in packaging.yml. Update\nNOTES.md for v0.20.28 / newest tag v0.20.27 and the d755c1b benchmark\nfigures.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-27T12:20:41-07:00",
          "tree_id": "5791e4ca47e7032f5bf9df305fe27a3eeea1448f",
          "url": "https://github.com/l1a/retch/commit/b882a0d743af4260a034c8100ceb5aa927773247"
        },
        "date": 1793128880045,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 3161496.0000000005,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 10984081.200000001,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2069819.1,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 1866045.8,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 213358798.4,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 614170280.3,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 380848288.70000005,
            "extra": "v0.20.28; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 723417918.8000001,
            "extra": "v0.20.28; AC"
          }
        ]
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
          "id": "e0b7c5075ab577c209942f3bf94b325aec2ba1dc",
          "message": "Detect Linux DE and daemon wallpapers dynamically (#310)\n\n- Remove the unconditional Step 9 GNOME `gsettings` fallback and `niri`\n  GNOME routing in `crates/sysinfo/src/theme.rs` so non-GNOME desktops\n  never report GNOME's stale wallpaper.\n- Add single-pass `/proc` wallpaper daemon detection (`noctalia`,\n  `swww-daemon`/`awww-daemon`, `swaybg`/`wbg`/`mpvpaper`, `hyprpaper`,\n  `wpaperd`) and pure parsers for Noctalia's `settings.toml`, `swww`\n  cache files, `/proc/<pid>/cmdline`, COSMIC, `wpaperd`, LXQt, and LXDE.\n- Filter multi-monitor state files (`noctalia`, `swww`/`awww`,\n  `wpaperd`) by connected DRM outputs (`/sys/class/drm/card*-*/status`)\n  and deduplicate wallpaper paths in monitor order.\n- Respect `org.gnome.desktop.interface color-scheme` (`prefer-dark`) on\n  GNOME/Budgie/Unity/Mutter and scope `sway/config` to Sway and\n  `.fehbg`/`nitrogen` to non-Wayland sessions.\n- Probe `detected_desktop` and `detected_wm` in `fetch.rs` whenever\n  `wallpaper` or `wm-theme` is requested, and add `Umbriel`, `COSMIC`,\n  and `Mango` to compositor/DE detection.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-30T19:03:51-07:00",
          "tree_id": "8f3621e63bad1a13ea973721d556f4078ee05000",
          "url": "https://github.com/l1a/retch/commit/e0b7c5075ab577c209942f3bf94b325aec2ba1dc"
        },
        "date": 1793412280049,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 4764744.499999999,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 16023363.6,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 2964164.4000000004,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 5638767.900000001,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 218176895.60000002,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 825827432.5,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 499079541.90000015,
            "extra": "v0.20.35; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 806674020.1,
            "extra": "v0.20.35; AC"
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
          "id": "1dc26f7a7899d6901721819a5fdfedfcae0ed5a4",
          "message": "List macOS volumes natively; free space from statfs (#286)\n\nmacOS --short was 43-46 ms against fastfetch's 16 ms, and all of it was\nthe `disk` field (~39 ms; the --version floor is 3.7 ms). sysinfo's\nDisks asked CoreFoundation for every mount's\nkCFURLVolumeAvailableCapacityForImportantUsageKey, which costs ~9 ms\nper volume on first query.\n\nMounts now come from getfsstat(MNT_NOWAIT). The same two CFURL keys\nsysinfo filtered on, IsBrowsable and IsLocal, pick the volumes, so the\nlist is unchanged: /System/Volumes/Data carries MNT_DONTBROWSE but is\nbrowsable to CoreFoundation, so f_flags cannot stand in for it. A fresh\nstatfs sizes only the kept volumes.\n\nVisible change, macOS only (user decision): \"free\" is f_bavail, as df\nand fastfetch report it, and no longer counts purgeable space, so it\ncan read lower than Finder (315.0 GiB vs ~336 here). The man page's\n`disk` entry says so. Totals are unchanged.\n\n--short on chani (battery): 33.5 -> 7.0 ms, fastfetch 17.0. The disk\nprobe 39 -> 1.95 ms. Tests pin the selection against chani's real\n13-mount table; three mutations of the filter, all caught.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:41:45-07:00",
          "tree_id": "f10a0fceebad4d7781d2b9f62f9e1ccd6aefc7a9",
          "url": "https://github.com/l1a/retch/commit/1dc26f7a7899d6901721819a5fdfedfcae0ed5a4"
        },
        "date": 1790969421298,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 101913789.92,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 129022264.92000002,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6883955.66,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 14632576.660000002,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 229285863.40000004,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 673307892.5000001,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 446244514,
            "extra": "v0.20.15; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 667110618.1,
            "extra": "v0.20.15; AC"
          }
        ]
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
          "id": "49db22cc74ebea3f11599867b72d52a399cdfc08",
          "message": "Stop reporting macOS Bluetooth as Off when unknown (#287)\n\nOn macOS 26 and later IOBluetoothHCIController no longer publishes\nBluetoothControllerPowerIsOn, and get_bluetooth_state folded the\nmissing property into false, so a Mac with Bluetooth on and a keyboard\nconnected printed \"Bluetooth: Off (Apple Bluetooth)\" (chani, macOS 27).\n\nThe power state is now an Option. When it cannot be read the line\ncarries no state at all, \"Bluetooth: Apple Bluetooth\", per the rule\nthat under-reporting beats asserting something false. Known states\nprint exactly as before. \"Apple Bluetooth\" is bluetooth.rs's fallback\nwhen no chipset string exists, which answers the NOTES question of\nwhere the name came from.\n\nA real power source is still open (NOTES 6c): the preferences plist\nhas no ControllerPowerState, and system_profiler knows but costs a\nseconds-long spawn. Tests pin both branches; reverting unknown to Off\nfails them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T12:41:17-07:00",
          "tree_id": "3ec0a099872ef85d74f69c184c9a09ab9e4917ff",
          "url": "https://github.com/l1a/retch/commit/49db22cc74ebea3f11599867b72d52a399cdfc08"
        },
        "date": 1790970121272,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 103423356.50000001,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 135404094.10000002,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7295235.699999999,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 15597452.3,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 234411862.60000002,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 674989466.8,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 467877961.68000007,
            "extra": "v0.20.16; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 677923161.6800001,
            "extra": "v0.20.16; AC"
          }
        ]
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
          "id": "b3630093a37b1ea5560ceb0b3eafb610d10c7f05",
          "message": "Show macOS battery on AC as not charging (#294)\n\nA Mac on AC that is holding its charge (macOS's 80% limit, Optimized\nBattery Charging) reports IsCharging = No and FullyCharged = No, and\nretch printed it as \"discharging\". fastfetch says \"AC Connected\" on the\nsame machine.\n\nRead AppleSmartBattery's ExternalConnected as well. On AC with the\nbattery neither charging nor full the state is now Unknown, which\nalready renders \"not charging\" (Linux's sysfs \"Not charging\"). Without\nthe property the old answer is kept. The decision is a pure function,\nmac_battery_state, compiled under cfg(test) on every platform so CI\ntests it everywhere.\n\nBumps retch-cli to 0.20.21 and retch-sysinfo to 0.1.91.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T19:28:14-07:00",
          "tree_id": "4cdecaed7e6a172bf9d6d524f302b9b8b4c5418b",
          "url": "https://github.com/l1a/retch/commit/b3630093a37b1ea5560ceb0b3eafb610d10c7f05"
        },
        "date": 1792031340167,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 107066333.1,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 150619091.70000002,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7227854.1000000015,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 14517829.300000003,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 232412795.90000007,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 804074787.6,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 451841487.5,
            "extra": "v0.20.21; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 782355295.9000001,
            "extra": "v0.20.21; AC"
          }
        ]
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
          "id": "22f24a82840987adc1249ebe91bb94d71f5f0b5a",
          "message": "Install fastfetch's universal macOS archive when per-arch is gone (#295)\n\nfastfetch 2.70.0 (2026-10-14) publishes only fastfetch-macos-universal\nfor macOS; 2.69.0 published only fastfetch-macos-aarch64/-amd64. The\nbenchmark installer asked for the per-arch name, got a 404, and the\nmacOS arm64 job of Continuous Benchmarking failed on main for b363009\n(#294). It is the second time fastfetch has switched layouts.\n\nmacOS now tries the per-arch archive and falls back to the universal\none. Both keep the binary at usr/bin/fastfetch, so find_binary_dir is\nunchanged. Only a 404 moves on to the next name: a network error or a\n5xx is raised as itself rather than reported as a missing asset.\n\nVerified: a real --latest-release install on an M3 Pro 404s on aarch64,\nfalls back, and runs fastfetch 2.70.0. The self-test covers the\ncandidates and download_first against a fake release; dropping the\nfallback, or treating every HTTP error as a 404, each fail it.\n\nretch-cli 0.20.21 -> 0.20.22.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T20:59:56-07:00",
          "tree_id": "89497667f1b7375453f246d993b6fb07360b464e",
          "url": "https://github.com/l1a/retch/commit/22f24a82840987adc1249ebe91bb94d71f5f0b5a"
        },
        "date": 1792036843705,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 114626670.90000004,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 153831591.70000002,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 6760766.499999999,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 14684129.099999998,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 232998783.4,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 804911629.1,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 483569449.8000001,
            "extra": "v0.20.22; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 822978375.1000001,
            "extra": "v0.20.22; AC"
          }
        ]
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
          "id": "2497ba0e7d6e6bdd55adc9190745bf9ad07e1771",
          "message": "Bump toml to 1.1.8 (consolidate #293) (#296)\n\nRolls Dependabot #293 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: the\nroot crate's \"1.1\" spec already admits toml 1.1.8, and the Cargo.lock\nlines (toml, toml_datetime, toml_parser, toml_writer, serde_spanned)\nare identical to Dependabot's.\n\ntoml 1.1.7/1.1.8 fix the serializer to encode every key and remove a\nrisk of unsoundness in the parser around synthetic events. retch only\nparses (Config::load): a real config with a field list and a custom hex\ntheme applies, the --generate-config output parses back, and a\nmalformed file still reports toml's located error.\n\nretch-sysinfo stays at 0.1.91: it does not depend on toml.\n\nretch-cli 0.20.22 -> 0.20.23.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:18:06-07:00",
          "tree_id": "80a1f51cd240e5c2237904018b159281b7f183cc",
          "url": "https://github.com/l1a/retch/commit/2497ba0e7d6e6bdd55adc9190745bf9ad07e1771"
        },
        "date": 1792037926850,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 105409600.19999999,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 146589070.8,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7064837.500000002,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 13883120.8,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 238007733.30000004,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 838317329.2,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 512499916.79999995,
            "extra": "v0.20.23; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 859063583.3,
            "extra": "v0.20.23; AC"
          }
        ]
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
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792040102216,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 96645337.3,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 146783729.3,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7158658.3,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 13796691.900000002,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 239784875,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 828418116.5,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 507187524.9000001,
            "extra": "v0.20.24; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 885916062.3000001,
            "extra": "v0.20.24; AC"
          }
        ]
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
          "id": "ce116b5ad3e75019fb185c440d6df11db27fa6a3",
          "message": "Speed up the macOS default mode (#304)\n\nOn an M3 Pro (macOS 27.2, on AC) the default mode drops from 114-152 ms\nto 65 ms (hyperfine, 40 runs; main measured 152.3 and 114.0 ms as two\ncopies of one binary in the same sitting, this build 64.9 +/- 1.3 ms).\nOutput is unchanged in all four modes. Two causes:\n\n- phys-mem spawned `system_profiler SPMemoryDataType`, 87-147 ms and the\n  whole critical path. Apple Silicon publishes the same size and type on\n  IODeviceTree:/chosen (dram-size, dram-type), which now answers in\n  under 0.1 ms. Intel Macs, which lack them, still spawn it.\n- audio took &System and read it on no platform, yet it ran after\n  sys-init and needs_process_list counted it, so off Linux the default\n  mode loaded a process table nobody used (6.6-11.8 ms) and CoreAudio\n  started late. It now starts with the borrow-nothing probes via\n  detect_audio_devices(); detect_audio(&System) stays as a wrapper so\n  retch-sysinfo's API does not break. Windows' default mode stops\n  loading the table too (not measured: no Windows host).\n\nneeds_process_list now takes the field predicate, so a test can feed it\nthe default mode's real field set. Both new guards were watched failing\nagainst a mutation.\n\nNOTES also closes the v0.20.8 macOS --short alert (runner noise: retch\nand fastfetch spiked in the same runs) and records two open macOS items:\nno IOKit source tracks the Bluetooth radio (tested by hand), and the\nNet: lines print in a different order on every run.\n\nretch-cli 0.20.28 -> 0.20.29, retch-sysinfo 0.1.93 -> 0.1.94.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T12:49:42-07:00",
          "tree_id": "33ac12268c4fabd03f7a0ff1db01333a8eb84eeb",
          "url": "https://github.com/l1a/retch/commit/ce116b5ad3e75019fb185c440d6df11db27fa6a3"
        },
        "date": 1793217032033,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 68355395.7,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 171393512.49999997,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7280841.8,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 16613304.299999999,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 235763112.5,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 862333987.6000001,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 408192850.1999999,
            "extra": "v0.20.29; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 851614399.9000001,
            "extra": "v0.20.29; AC"
          }
        ]
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
          "id": "738b5c23eaba3ffa987a35d7424322bfe355583d",
          "message": "List network interfaces in a stable order (#305)\n\nsysinfo keeps interfaces in a HashMap, whose iteration order is\nrandomised per process, and detect_networks listed them in that order.\nSo --long and --full printed the non-active Net: lines shuffled\ndifferently on every run, on every platform, and the default mode's\nfallback (the first interface that is up, used when the active one\ncannot be resolved) could print a different line each time.\n\ndetect_networks now sorts by a natural name key: the name without its\ntrailing number, that number numerically, then the full name, so en2\ncomes before en10 and utun2 before utun100. The active interface still\nleads in --long and --full. Same set of lines as before; only the order\nis now fixed.\n\nTests cover the key (including names a plain string sort gets wrong and\nWindows names with spaces) and, live, that detect_networks returns its\nlist in key order. Both were watched failing against a mutation. On\nchani three --long runs now print the same order.\n\nretch-cli 0.20.29 -> 0.20.30, retch-sysinfo 0.1.94 -> 0.1.95.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:02:55-07:00",
          "tree_id": "f1541d237236ef21be7566dd394a99ff28ab83e9",
          "url": "https://github.com/l1a/retch/commit/738b5c23eaba3ffa987a35d7424322bfe355583d"
        },
        "date": 1793217826654,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 62310278.9,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 166179041.60000002,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7159633.400000001,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 14618854.3,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 243019312.8,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 889205504.3,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 430963958.2000001,
            "extra": "v0.20.30; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 922741745.8000001,
            "extra": "v0.20.30; AC"
          }
        ]
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
          "id": "6bc247458408bb750dc4cb5d9df33ab51bf929d3",
          "message": "Bump rusqlite to 0.41 (consolidate #303) (#306)\n\nMoves Dependabot #303 (rusqlite 0.40.2 -> 0.41) onto a gated branch, as\n#299 did for #298. Dependabot skips the version bump, the NOTES header\nand the man page regeneration.\n\nThe lockfile resolves rusqlite 0.41.1, released today after #303 was\nopened with 0.41.0. Its two fixes (PRAGMA names under SQLCipher, a\nzero-argument deterministic function panic) touch nothing retch uses;\nlibsqlite3-sys and every other package match #303 exactly.\n\nretch-sysinfo's own manifest changes, so both crates bump:\nretch-cli 0.20.30 -> 0.20.31, retch-sysinfo 0.1.95 -> 0.1.96.\n\nrusqlite bundles SQLite, so per NOTES 8 the rpmdb read was checked\nunprivileged on Fedora (arrakis): `retch --fields packages` prints\nPackages: 2471, equal to `rpm -qa | wc -l`.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:19:04-07:00",
          "tree_id": "1cc67f7daac7928dfc61879ab14019db32cef7a3",
          "url": "https://github.com/l1a/retch/commit/6bc247458408bb750dc4cb5d9df33ab51bf929d3"
        },
        "date": 1793218795574,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 62992545.70000001,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 167265454.2,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 7072583.3,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 15306662.300000004,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 241241504.50000003,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 898763774.9,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 422920341.7,
            "extra": "v0.20.31; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 908613958.4000001,
            "extra": "v0.20.31; AC"
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
          "id": "ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0",
          "message": "Close Windows field parity and --short net gap (#307)\n\nRETCH_TIMING=1 on irulan (Windows 11 Pro x86_64) showed net (17.65–24.69 ms)\nand net-detail (9.88–10.69 ms) taking 89% of both --short (27.53 of 30.93 ms)\nand default mode (35.38 of 39.70 ms), because each called\nsysinfo::Networks::new_with_refreshed_list() independently. Replace both with\na single GetIfTable2 + GetUnicastIpAddressTable(AF_UNSPEC) pass (~2.5 ms) in\nwin_iftable::interfaces_with_ips(), hand the rows from\ndetect_active_interface_and_local_ip to detect_networks on the same thread,\nand cache GetAdaptersAddresses (with GAA_FLAG_SKIP_UNICAST) in a OnceLock\nwarmed concurrently for dns/domain/domain-search.\n\nOn irulan (AC), collect-done drops 30.93 -> 5.39 ms (--short) and\n39.70 -> 7.09 ms (default); hyperfine (--shell=none vs fastfetch 2.70.0)\nmeasures --short 27.8 vs 49.5 ms (1.8x), default 30.9 vs 501.3 ms (16.2x),\n--long 152.5 vs 2044.6 ms (13.4x), and --full 544.3 vs 3362.0 ms (6.2x).\n\nAlso implement the 6 remaining Windows fields natively (no PowerShell):\n- keyboard and mouse via SetupAPI GUID_DEVCLASS_KEYBOARD / GUID_DEVCLASS_MOUSE,\n  preferring DEVPKEY_Device_BusReportedDeviceDesc when non-generic\n- brightness via \\\\.\\LCD IOCTL_VIDEO_QUERY_DISPLAY_BRIGHTNESS\n- power-adapter via GetSystemPowerStatus\n- login-manager via LogonUI.exe's VS_FIXEDFILEINFO product version (version.dll)\n- tpm via Tbsi_GetDeviceInfo (tbs.dll)\nplus Windows Terminal terminal-font (settings.json) and standalone\n--fields terminal-font / terminal-theme process-tree detection.\n\nFinally, subtract retch's own and child-process CPU time from Windows\ncpu-usage via an anonymous Win32 Job Object + GetProcessTimes, and sanitize ':'\nin scripts/bench_meta.py's self-test temp directory names on Windows NTFS.\n\nretch-cli 0.20.31 -> 0.20.32, retch-sysinfo 0.1.96 -> 0.1.97.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T11:36:31-07:00",
          "tree_id": "ef9988b328033dbc532eebfbd93269bc2f7fc134",
          "url": "https://github.com/l1a/retch/commit/ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0"
        },
        "date": 1793385502145,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 28095020,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 284352680,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 25991929.999999996,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 48283960,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 153722490,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 1801103620.0000002,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 496539310,
            "extra": "v0.20.32; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 3037223660,
            "extra": "v0.20.32; AC"
          }
        ]
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
          "id": "54a7a9960827f9bb307b8831b6acb08cad9f717b",
          "message": "Add Windows CPU cache, freq range, and hybrid cores (#308)\n\nImplement native Windows CPU cache size detection (`cpu-cache`), base and\nboost frequency range detection (`cpu-freq`), hybrid P/E core topology\ndetection (`cpu`), and x86 CPUID brand trimming:\n\n- `crates/sysinfo/src/memory.rs`: Cache `read_smbios_table()` in a\n  `OnceLock` (`cached_smbios_table()`) so `phys-mem` (Type 17) and\n  `cpu-freq` (Type 4) share a single `GetSystemFirmwareTable('RSMB')`\n  call, and add `parse_smbios_type4_speeds()` to read `CurrentSpeed`\n  (base MHz) and `MaxSpeed` (boost MHz) from populated processor sockets.\n- `crates/sysinfo/src/fetch.rs`:\n  - Implement Windows `detect_cpu_cache()` via\n    `GetLogicalProcessorInformationEx(RelationCache, ...)` and share\n    `format_cpu_cache_entries()` with Linux.\n  - Implement Windows `detect_cpu_freq_range()` combining SMBIOS Type 4\n    speeds and per-core `CallNtPowerInformation(ProcessorInformation)`\n    `MaxMhz` values.\n  - Implement Windows `hybrid_cores()` via\n    `GetLogicalProcessorInformationEx(RelationProcessorCore, ...)`,\n    grouping logical processor bitmask popcounts by `EfficiencyClass`.\n  - Trim x86 `CPUID` brand strings in `cpu_brand()` so padded 48-byte\n    strings do not render extra spaces before `(8C / 16T)`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T12:43:34-07:00",
          "tree_id": "cae0fcbe3459e5c24023fe4fc0903cd7768e8923",
          "url": "https://github.com/l1a/retch/commit/54a7a9960827f9bb307b8831b6acb08cad9f717b"
        },
        "date": 1793389521033,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 27231139.999999996,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 295554580,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 25122720.000000004,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 50100800,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 141794049.99999997,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 1812184720,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 479840570,
            "extra": "v0.20.33; AC"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 3037196609.9999995,
            "extra": "v0.20.33; AC"
          }
        ]
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
          "id": "134ac3e90ebf75f3056f9bc2e33028ee303c3e48",
          "message": "Add Windows Scoop packaging and publish recipe (#311)\n\n- Add template manifest `packaging/scoop/retch.json` carrying `@VERSION@`,\n  `@SHA256_X86_64@`, and `@SHA256_ARM64@` sentinels, with `#/retch.exe`\n  URL fragments for both `64bit` (`retch-windows-x86_64.exe`) and `arm64`\n  (`retch-windows-arm64.exe`), `\"bin\": \"retch.exe\"`, `\"checkver\": \"github\"`,\n  and `\"autoupdate\"`.\n- Extend `scripts/render_packaging.py` with `--target scoop`,\n  `--sha256-x86-64`, and `--sha256-arm64` flags plus self-tests.\n- Add offline template guard `scripts/scoop_check.py` (wired into\n  `just check` via `scoop-check`) and extend `scripts/metadata_check.py`\n  to check `packaging/scoop/retch.json`'s `description` and `license`\n  against `packaging/metadata.toml`.\n- Add `just scoop-publish VERSION` to `Justfile` to download both\n  GitHub Release `.exe` assets, compute their SHA-256 digests, render\n  `bucket/retch.json`, and push to `l1a/scoop-retch` (gated by\n  `SCOOP_CONFIRM`).\n- Add a `scoop` CI verification job on `windows-latest` in\n  `.github/workflows/packaging.yml`.\n- Bump `retch-cli` to `0.20.36`, regenerate `docs/retch.1`, and update\n  `README.md`, `AGENTS.md`, and `NOTES.md`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-31T14:40:35-07:00",
          "tree_id": "d9461d9b5b387ab7c879c38e83c1a70541899e9b",
          "url": "https://github.com/l1a/retch/commit/134ac3e90ebf75f3056f9bc2e33028ee303c3e48"
        },
        "date": 1793482956561,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - retch",
            "unit": "ns",
            "value": 36956220.0,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - fastfetch (default)",
            "unit": "ns",
            "value": 316520669.99999994,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - retch --short",
            "unit": "ns",
            "value": 34518330.0,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "unit": "ns",
            "value": 62225800.0,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - retch --long",
            "unit": "ns",
            "value": 223169120.00000003,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "unit": "ns",
            "value": 1800017060.0,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - retch --full",
            "unit": "ns",
            "value": 599131360.0000001,
            "extra": "v0.20.36; battery"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "unit": "ns",
            "value": 3203630380.000001,
            "extra": "v0.20.36; battery"
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
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1dc26f7a7899d6901721819a5fdfedfcae0ed5a4",
          "message": "List macOS volumes natively; free space from statfs (#286)\n\nmacOS --short was 43-46 ms against fastfetch's 16 ms, and all of it was\nthe `disk` field (~39 ms; the --version floor is 3.7 ms). sysinfo's\nDisks asked CoreFoundation for every mount's\nkCFURLVolumeAvailableCapacityForImportantUsageKey, which costs ~9 ms\nper volume on first query.\n\nMounts now come from getfsstat(MNT_NOWAIT). The same two CFURL keys\nsysinfo filtered on, IsBrowsable and IsLocal, pick the volumes, so the\nlist is unchanged: /System/Volumes/Data carries MNT_DONTBROWSE but is\nbrowsable to CoreFoundation, so f_flags cannot stand in for it. A fresh\nstatfs sizes only the kept volumes.\n\nVisible change, macOS only (user decision): \"free\" is f_bavail, as df\nand fastfetch report it, and no longer counts purgeable space, so it\ncan read lower than Finder (315.0 GiB vs ~336 here). The man page's\n`disk` entry says so. Totals are unchanged.\n\n--short on chani (battery): 33.5 -> 7.0 ms, fastfetch 17.0. The disk\nprobe 39 -> 1.95 ms. Tests pin the selection against chani's real\n13-mount table; three mutations of the filter, all caught.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:41:45-07:00",
          "tree_id": "f10a0fceebad4d7781d2b9f62f9e1ccd6aefc7a9",
          "url": "https://github.com/l1a/retch/commit/1dc26f7a7899d6901721819a5fdfedfcae0ed5a4"
        },
        "date": 1790967152883,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3883814.94,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 286279335.46,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 253189754.12,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1950335.62,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch",
            "value": 3120909.64,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 296986427.56000006,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206870442.82000002,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2158513.22,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "SystemInfo__collect",
            "value": 304212087.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2133.114957138546,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 109.8422587230734,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.038175036658749,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 58.4268441379984,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20918.12216271742,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 211919.50167078347,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14843.502889538966,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 10276.563907444337,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 178326.93220545325,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 313.7867587295737,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 292.7058760672588,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "49db22cc74ebea3f11599867b72d52a399cdfc08",
          "message": "Stop reporting macOS Bluetooth as Off when unknown (#287)\n\nOn macOS 26 and later IOBluetoothHCIController no longer publishes\nBluetoothControllerPowerIsOn, and get_bluetooth_state folded the\nmissing property into false, so a Mac with Bluetooth on and a keyboard\nconnected printed \"Bluetooth: Off (Apple Bluetooth)\" (chani, macOS 27).\n\nThe power state is now an Option. When it cannot be read the line\ncarries no state at all, \"Bluetooth: Apple Bluetooth\", per the rule\nthat under-reporting beats asserting something false. Known states\nprint exactly as before. \"Apple Bluetooth\" is bluetooth.rs's fallback\nwhen no chipset string exists, which answers the NOTES question of\nwhere the name came from.\n\nA real power source is still open (NOTES 6c): the preferences plist\nhas no ControllerPowerState, and system_profiler knows but costs a\nseconds-long spawn. Tests pin both branches; reverting unknown to Off\nfails them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T12:41:17-07:00",
          "tree_id": "3ec0a099872ef85d74f69c184c9a09ab9e4917ff",
          "url": "https://github.com/l1a/retch/commit/49db22cc74ebea3f11599867b72d52a399cdfc08"
        },
        "date": 1790970707274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2695534.2399999998,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 273445646.87999994,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252306878.00000006,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1467474.68,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch",
            "value": 2003939.6399999997,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 405449235.38000005,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204998769.80000004,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1434929.78,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "SystemInfo__collect",
            "value": 388148817.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1432.2896804615814,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 60.75015778182069,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.10709781588855,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 27.972148308753447,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 14375.206919488977,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 154154.331796121,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10398.463551827186,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 6955.859230283988,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 130334.13582602923,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 155.35867932293468,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 141.9338911950453,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddc8016cedff49fcd78adaf49f6bd6b5b41987e6",
          "message": "Fix release notes after v0.20.16 (#288)\n\nCorrect NOTES.md: cargo owner --list does not authenticate the\ncrates.io token, the newest released tag is v0.20.16, and record\nthe auto-mode blocks hit during the release. Bump to 0.20.17.\n\nAssisted-By: Claude Sonnet 5.5",
          "timestamp": "2026-10-02T13:28:51-07:00",
          "tree_id": "cbeeadcd4295a30f824bf2b9c0bc725f87ce1436",
          "url": "https://github.com/l1a/retch/commit/ddc8016cedff49fcd78adaf49f6bd6b5b41987e6"
        },
        "date": 1790973573674,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1804149.1399999997,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 278370991.08,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252360489.83999997,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1141404.54,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch",
            "value": 1981523.1400000001,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 326129053.47999996,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204940742.64000002,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1360211.9400000002,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "SystemInfo__collect",
            "value": 339663294.65,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 704.856305134427,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 67.86876411704857,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.0948088893041685,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 35.442607438404416,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 6398.461641073556,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 59602.92211777989,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 40474.65274102526,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 40123.96909716281,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 51380.736114412866,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 231.33110604849375,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 198.0050600722053,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51cfe8f12234bdf793372a2e8a445841d6fd69c3",
          "message": "Bump libc to 0.2.190 (consolidate #289) (#290)\n\nRolls Dependabot #289 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" specs already admit libc 0.2.190, nothing else moves, and\nthe libc lines in Cargo.lock are byte-identical to Dependabot's.\n\nlibc 0.2.190 adds Default impls for more structs, a libc_unstable_time64\ncfg (opt-in, unused here) and new constants, mostly on Apple and BSD.\nretch's own libc use (the Linux fd calls in gpu_api.rs and the sysinfo\nFFI) builds and passes clippy and the full test suite unchanged, and\nthe GPU-API fields still print on real hardware.\n\nretch-sysinfo stays at 0.1.89: a lockfile change alters nothing that\ncrate publishes.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T14:57:48-07:00",
          "tree_id": "e1f0d55f8bb50b94dde179076cd192dcf11d3783",
          "url": "https://github.com/l1a/retch/commit/51cfe8f12234bdf793372a2e8a445841d6fd69c3"
        },
        "date": 1791756437426,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2957505.4000000004,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 278916574.44,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252729952.94000006,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1535209.2800000003,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch",
            "value": 2417065.6999999993,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 294183644.94000006,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 209189940.74,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1725484.78,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "SystemInfo__collect",
            "value": 436553593.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1681.9800745970938,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 86.8105047115263,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.9181149925565784,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.247869269281864,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16130.049282323223,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 164348.9939389325,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11361.99157124513,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 7877.494556075015,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 138389.14438649666,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 244.04893016558185,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 238.95412167350113,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a",
          "message": "Name Linux GPUs from udev before pci.ids (#291)\n\nretch --short on corrino (Intel Iris Xe + NVIDIA MX550) was 8.4 ms\nagainst fastfetch's 5.8. RETCH_TIMING showed the gpu probe as the\nwhole critical path: it read and walked the 1.6 MB pci.ids once per\nGPU, ~4 ms cold for the Intel iGPU near the end of the file and ~1.5 ms\nfor the NVIDIA card, whose name the driver's /proc entry then replaced\nanyway. A faster search does not help (str::find costs the same).\n\nresolve_gpu_name now asks each source lazily, first hit wins: the\nNVIDIA driver's /proc model, amdgpu.ids (AMD), udev's resolved\nID_MODEL_FROM_DATABASE in /run/udev/data/+pci:<slot> (~300 bytes),\nthen pci.ids, then a generic vendor name. AMD names from udev or\npci.ids still go through the codename table, as before.\n\n--short on corrino: 8.42 -> 3.32 ms (fastfetch 5.81); default 9.70 ->\n5.78 ms. GPU, Vulkan, OpenGL and OpenCL lines are identical in all four\nmodes, and identical in a fedora:44 container with no /run/udev, where\nthe pci.ids fallback runs. Tests pin the order with sources that panic\nif called; five mutations were all caught.\n\nretch-sysinfo 0.1.89 -> 0.1.90, retch-cli 0.20.18 -> 0.20.19.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T15:19:14-07:00",
          "tree_id": "39483f60f40a8e71c7bcc026028d415e06ebb3a4",
          "url": "https://github.com/l1a/retch/commit/8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a"
        },
        "date": 1791757729383,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3005000.2399999998,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 278276075.12,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252749172.24000004,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1545848.58,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch",
            "value": 2465494.94,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 565753932.4200001,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205986986.94000003,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1653098.5800000003,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "SystemInfo__collect",
            "value": 363342449.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1672.3360344528821,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 86.42023722256806,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.902502696409441,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 48.07521706530771,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 16106.146192991733,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 163834.10316556518,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11412.828730608275,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 7892.018384529887,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 140128.97180727823,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 237.52485114887827,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 206.54734922520387,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a7cfa0c3f0e28dae4eec94464824108211b7af7e",
          "message": "Make CLI benchmarks work under hyperfine 2.0 (#292)\n\nhyperfine 2.0.0 reached crates.io around 2026-10-10 and broke the CLI\nbenchmarks two ways, both silently.\n\nIt runs commands with no shell by default and splits them with POSIX\nrules, so a backslash is an escape. The Windows x64 runner falls back\nto an unpinned `cargo install hyperfine`, got 2.0, and turned\n.\\target\\release\\retch.exe into .targetreleaseretch.exe: the main\nbenchmark job failed with \"program not found\" on #290 and #291, so that\nsuite has no v0.20.18 or v0.20.19 point. cli_bench.py and `just\nbench-cli` now pass --shell=none explicitly (1.13+ accepts it too), so\nevery hyperfine version measures the same way, and spell the Windows\nbinary ./target/release/retch.exe. Labels key on the flags, so no\ndashboard series forks.\n\nIts JSON export is a new schema: no top-level `mean`; wall-clock time\nis summary.time_wall_clock.mean. labelled_means read only the 1.x key,\nso with hyperfine 2.0 installed locally the post-merge hook published\ntwo empty points (51cfe8f, 8d20d64) while every step reported success.\nmean_seconds now reads both schemas, and both publishers\n(parse_criterion.py, upload_local_bench.py) refuse a run missing any\nexpected series (missing_series).\n\nVerified: real runs under hyperfine 2.0.0 and 1.18.0 produce all eight\nseries; the uploader's dry run collects eight and, with the 2.x reader\nremoved, refuses. Eight mutations, each caught by its intended test.\n\nNOTES also records the arrakis GPU check, the CI dashboard read\n(Linux x64 --full behind; check fastfetch's weather first), and the\nbare-command `just merge-pr` allow rule.\n\nretch-cli 0.20.19 -> 0.20.20.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T20:51:02-07:00",
          "tree_id": "54584a1b0a27b5f07c61be671ff440acac57c4e8",
          "url": "https://github.com/l1a/retch/commit/a7cfa0c3f0e28dae4eec94464824108211b7af7e"
        },
        "date": 1791777610854,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1975160.8,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 273850672.2,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252720278.60000008,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1232746.6000000003,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch",
            "value": 2405935.8000000003,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 445717771.99999994,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205310638.5,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1560136.4,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "SystemInfo__collect",
            "value": 338588767.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 782.7186321337883,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 79.62984170424062,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.08983062774903,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 41.20029639377421,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7414.01581725305,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70745.82594481658,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 47860.41688561978,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 46614.793647368904,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 59663.00394069897,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 254.4001261601748,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 226.00437838149554,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b3630093a37b1ea5560ceb0b3eafb610d10c7f05",
          "message": "Show macOS battery on AC as not charging (#294)\n\nA Mac on AC that is holding its charge (macOS's 80% limit, Optimized\nBattery Charging) reports IsCharging = No and FullyCharged = No, and\nretch printed it as \"discharging\". fastfetch says \"AC Connected\" on the\nsame machine.\n\nRead AppleSmartBattery's ExternalConnected as well. On AC with the\nbattery neither charging nor full the state is now Unknown, which\nalready renders \"not charging\" (Linux's sysfs \"Not charging\"). Without\nthe property the old answer is kept. The decision is a pure function,\nmac_battery_state, compiled under cfg(test) on every platform so CI\ntests it everywhere.\n\nBumps retch-cli to 0.20.21 and retch-sysinfo to 0.1.91.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T19:28:14-07:00",
          "tree_id": "4cdecaed7e6a172bf9d6d524f302b9b8b4c5418b",
          "url": "https://github.com/l1a/retch/commit/b3630093a37b1ea5560ceb0b3eafb610d10c7f05"
        },
        "date": 1792031920297,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1531484.0999999999,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 300019053,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 251837687.7,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 917602.4000000001,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch",
            "value": 1906600.3,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 295616061.00000006,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204542673.6,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1317336.2,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "SystemInfo__collect",
            "value": 370914544.225,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 667.3041127194176,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 69.802334986692,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.130963910696394,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 35.001037296472916,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 6227.238252501764,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 58093.518789311485,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 39073.48877085019,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 38503.88310074732,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 49366.21434584005,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 215.97519816420055,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 189.07478614043794,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22f24a82840987adc1249ebe91bb94d71f5f0b5a",
          "message": "Install fastfetch's universal macOS archive when per-arch is gone (#295)\n\nfastfetch 2.70.0 (2026-10-14) publishes only fastfetch-macos-universal\nfor macOS; 2.69.0 published only fastfetch-macos-aarch64/-amd64. The\nbenchmark installer asked for the per-arch name, got a 404, and the\nmacOS arm64 job of Continuous Benchmarking failed on main for b363009\n(#294). It is the second time fastfetch has switched layouts.\n\nmacOS now tries the per-arch archive and falls back to the universal\none. Both keep the binary at usr/bin/fastfetch, so find_binary_dir is\nunchanged. Only a 404 moves on to the next name: a network error or a\n5xx is raised as itself rather than reported as a missing asset.\n\nVerified: a real --latest-release install on an M3 Pro 404s on aarch64,\nfalls back, and runs fastfetch 2.70.0. The self-test covers the\ncandidates and download_first against a fake release; dropping the\nfallback, or treating every HTTP error as a 404, each fail it.\n\nretch-cli 0.20.21 -> 0.20.22.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T20:59:56-07:00",
          "tree_id": "89497667f1b7375453f246d993b6fb07360b464e",
          "url": "https://github.com/l1a/retch/commit/22f24a82840987adc1249ebe91bb94d71f5f0b5a"
        },
        "date": 1792037449272,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3332462.9000000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 317083109,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252745285.79999998,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1719249.5000000002,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch",
            "value": 3148079.4,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 440610567.8,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 207215022.10000002,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2143298.2,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "SystemInfo__collect",
            "value": 344330025.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1997.0003647310223,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 112.9580727015961,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.858728702447305,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.71982439813313,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18337.72362879918,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 189404.25218611755,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12777.112493219267,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8636.011245310883,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 164564.0916473821,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 312.5733389539135,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 305.52738157837985,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2497ba0e7d6e6bdd55adc9190745bf9ad07e1771",
          "message": "Bump toml to 1.1.8 (consolidate #293) (#296)\n\nRolls Dependabot #293 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: the\nroot crate's \"1.1\" spec already admits toml 1.1.8, and the Cargo.lock\nlines (toml, toml_datetime, toml_parser, toml_writer, serde_spanned)\nare identical to Dependabot's.\n\ntoml 1.1.7/1.1.8 fix the serializer to encode every key and remove a\nrisk of unsoundness in the parser around synthetic events. retch only\nparses (Config::load): a real config with a field list and a custom hex\ntheme applies, the --generate-config output parses back, and a\nmalformed file still reports toml's located error.\n\nretch-sysinfo stays at 0.1.91: it does not depend on toml.\n\nretch-cli 0.20.22 -> 0.20.23.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:18:06-07:00",
          "tree_id": "80a1f51cd240e5c2237904018b159281b7f183cc",
          "url": "https://github.com/l1a/retch/commit/2497ba0e7d6e6bdd55adc9190745bf9ad07e1771"
        },
        "date": 1792038489486,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3338900.8000000003,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252517462.10000002,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252614444.7,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1662951.6000000003,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch",
            "value": 3133042.2000000007,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 249510981.9,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 207530892.39999998,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2140279.3,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "SystemInfo__collect",
            "value": 266894829.25,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1999.572827074227,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 112.04022827384628,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.865644368755332,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.58354908924073,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18057.270329569477,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 188116.52238228533,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12769.904954271506,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8652.958919469447,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 164500.46535035566,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 312.70291741436654,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 261.2265093322083,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792040728210,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3339480.500000001,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252926826.6,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252672403.19999996,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1664489.7,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch",
            "value": 3121111.1,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 234887988.30000004,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206839606.8,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2129063.5,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "SystemInfo__collect",
            "value": 238454693.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2015.695429986731,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 113.69555530376337,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.861035926968753,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.505206384758466,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18335.184492490524,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 188439.930339136,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12796.338428612517,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8666.775989169095,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 164246.0298065397,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 312.49936717883554,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 275.6556156943139,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6",
          "message": "Bump libc to 0.2.191 (consolidate #298) (#299)\n\nRolls Dependabot #298 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" spec already admits libc 0.2.191, and the Cargo.lock\nlines are identical to Dependabot's.\n\nretch-sysinfo stays at 0.1.91: a lockfile change alters nothing that\ncrate publishes.\n\nretch-cli 0.20.24 -> 0.20.25.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T08:50:41-07:00",
          "tree_id": "b47069d397a2fa415048399d8c3d37e546d8d089",
          "url": "https://github.com/l1a/retch/commit/7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6"
        },
        "date": 1792598489140,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3548542.200000001,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 324193767.4,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252708707.2,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1723921.5000000002,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch",
            "value": 3184948.5000000005,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 574282513.8000001,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 216455844.20000002,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2275866.0000000005,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "SystemInfo__collect",
            "value": 458406195,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2028.4154891323874,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.43760617046314,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.84176952969167,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.70558534600936,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 18190.930882033423,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 191438.70166809388,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12830.652934566879,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8685.40891440323,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 164556.74807926474,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 339.0010511657165,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 271.70068647555775,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d485e1a7bed3201d40b5138243c3ea96403fb647",
          "message": "Note that syncing main publishes a benchmark (#300)\n\nThe post-merge hook fires after any merge onto main, a fast-forward\npull included, and pushes a local benchmark point to gh-pages. Record\nthat in NOTES 7.5 with the two ways to sync without publishing\n(GIT_NO_BENCH=1, or branch from origin/main), and the --no-track trap\nin the second: a branch tracking origin/main makes just open-pr skip\nits push.\n\nDocs-only. retch-cli 0.20.25 -> 0.20.26.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T09:13:07-07:00",
          "tree_id": "ee5373a58754448005eabf22e9420c2a687af91b",
          "url": "https://github.com/l1a/retch/commit/d485e1a7bed3201d40b5138243c3ea96403fb647"
        },
        "date": 1792599835130,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2742176,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 259265362.20000002,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 251961231.40000004,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1326334.5999999999,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch",
            "value": 2172913.1,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 369852676,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205239982.10000002,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1608835.2,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "SystemInfo__collect",
            "value": 285505803.5,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1492.5670468349049,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.918025419349945,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.2958832736476813,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 28.815013236346864,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 15120.75266105432,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 163978.8032674303,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11208.098544750694,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 7564.081904187506,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 147326.83733921143,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 161.8203798329227,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 155.70206723271457,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d755c1b4920cd8b578b1e3a7465dae3f96e1f883",
          "message": "Overlap temp/wm; refuse skipped weather (#301)\n\n* Overlap temp/wm; refuse skipped weather\n\n--full no longer pays temp then wm after weather\n(~21 ms). CLI benches fail if Public IP or Weather\nis missing, so Linux CI cannot win by failing fast.\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n* Handle Windows bench UTF-8 I/O\n\nDecode captured stdout as UTF-8 and print via\nconsole_safe so cp1252 cannot crash on weather emoji.\n\nAssisted-By: Composer\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>",
          "timestamp": "2026-10-23T16:02:49-07:00",
          "tree_id": "49b6c1563e755ad02c7fb5666baa89af24e01638",
          "url": "https://github.com/l1a/retch/commit/d755c1b4920cd8b578b1e3a7465dae3f96e1f883"
        },
        "date": 1792797214809,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2564054.6,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 259147566.3,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 251794316.5,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1274406.6000000003,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch",
            "value": 2095388.2000000002,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 469225349.79999995,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204783744.7,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1563517.6,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "SystemInfo__collect",
            "value": 302057215.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1415.1890054532882,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 61.231959416063454,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.165855928252337,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 26.906666240706663,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 14040.135662612543,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 154268.0429049849,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10672.359285730055,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 7367.631830532804,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 137162.71623698296,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 151.21878797251452,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 137.6820843910894,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b882a0d743af4260a034c8100ceb5aa927773247",
          "message": "Single-source long-form channel text (#302)\n\nUnify README.md's top overview with packaging/copr/project-description.md\nbetween <!-- BEGIN copr-description --> / <!-- END copr-description -->\nmarkers (with all three platforms' config paths and absolute https://\nlinks, since crates.io rewrites repo-relative file links to blob/HEAD/...\nwhile COPR renders on its own domain and resolves neither relative paths\nnor #anchor fragments).\n\nReplace the manual //! crate header and ReadmeDoctests struct in\ncrates/sysinfo/src/lib.rs with #![doc = include_str!(\"../README.md\")] so\ndocs.rs and crates/sysinfo/README.md are one text and its code block\nstill compiles as a doctest.\n\nEnforce both invariants in scripts/metadata_check.py (plus --sync-copr\nand negative self-tests) and watch **/README.md in packaging.yml. Update\nNOTES.md for v0.20.28 / newest tag v0.20.27 and the d755c1b benchmark\nfigures.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-27T12:20:41-07:00",
          "tree_id": "5791e4ca47e7032f5bf9df305fe27a3eeea1448f",
          "url": "https://github.com/l1a/retch/commit/b882a0d743af4260a034c8100ceb5aa927773247"
        },
        "date": 1793129493834,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1796704.2,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 283892759.99999994,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 251674683.5,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1132212.9,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch",
            "value": 2143288.1,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 299731377.1,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 203777731.60000002,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1608256.5999999999,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "SystemInfo__collect",
            "value": 453178456,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 801.4980288823151,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 86.54337508285985,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.505643225183772,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.3583548823696,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7383.852023892381,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70328.23647115237,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 52459.159187914374,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 14105.154231388387,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 61853.705130706796,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 278.2866952532633,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 241.5043840866931,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce116b5ad3e75019fb185c440d6df11db27fa6a3",
          "message": "Speed up the macOS default mode (#304)\n\nOn an M3 Pro (macOS 27.2, on AC) the default mode drops from 114-152 ms\nto 65 ms (hyperfine, 40 runs; main measured 152.3 and 114.0 ms as two\ncopies of one binary in the same sitting, this build 64.9 +/- 1.3 ms).\nOutput is unchanged in all four modes. Two causes:\n\n- phys-mem spawned `system_profiler SPMemoryDataType`, 87-147 ms and the\n  whole critical path. Apple Silicon publishes the same size and type on\n  IODeviceTree:/chosen (dram-size, dram-type), which now answers in\n  under 0.1 ms. Intel Macs, which lack them, still spawn it.\n- audio took &System and read it on no platform, yet it ran after\n  sys-init and needs_process_list counted it, so off Linux the default\n  mode loaded a process table nobody used (6.6-11.8 ms) and CoreAudio\n  started late. It now starts with the borrow-nothing probes via\n  detect_audio_devices(); detect_audio(&System) stays as a wrapper so\n  retch-sysinfo's API does not break. Windows' default mode stops\n  loading the table too (not measured: no Windows host).\n\nneeds_process_list now takes the field predicate, so a test can feed it\nthe default mode's real field set. Both new guards were watched failing\nagainst a mutation.\n\nNOTES also closes the v0.20.8 macOS --short alert (runner noise: retch\nand fastfetch spiked in the same runs) and records two open macOS items:\nno IOKit source tracks the Bluetooth radio (tested by hand), and the\nNet: lines print in a different order on every run.\n\nretch-cli 0.20.28 -> 0.20.29, retch-sysinfo 0.1.93 -> 0.1.94.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T12:49:42-07:00",
          "tree_id": "33ac12268c4fabd03f7a0ff1db01333a8eb84eeb",
          "url": "https://github.com/l1a/retch/commit/ce116b5ad3e75019fb185c440d6df11db27fa6a3"
        },
        "date": 1793217615218,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2535111.0000000005,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 270553800.40000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 251605681.70000008,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1274229.8000000005,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch",
            "value": 2240216.9,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 325770680.8,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204061494.2,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1546216.6,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "SystemInfo__collect",
            "value": 383414279.7,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1315.790934405451,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 64.33025070164436,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.051205356004667,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 27.602824788594727,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 13192.578984210142,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 143632.1417642461,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10297.27137112639,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 6749.115966592709,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 119732.3389256259,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 158.65933798191526,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 135.95283895494225,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "738b5c23eaba3ffa987a35d7424322bfe355583d",
          "message": "List network interfaces in a stable order (#305)\n\nsysinfo keeps interfaces in a HashMap, whose iteration order is\nrandomised per process, and detect_networks listed them in that order.\nSo --long and --full printed the non-active Net: lines shuffled\ndifferently on every run, on every platform, and the default mode's\nfallback (the first interface that is up, used when the active one\ncannot be resolved) could print a different line each time.\n\ndetect_networks now sorts by a natural name key: the name without its\ntrailing number, that number numerically, then the full name, so en2\ncomes before en10 and utun2 before utun100. The active interface still\nleads in --long and --full. Same set of lines as before; only the order\nis now fixed.\n\nTests cover the key (including names a plain string sort gets wrong and\nWindows names with spaces) and, live, that detect_networks returns its\nlist in key order. Both were watched failing against a mutation. On\nchani three --long runs now print the same order.\n\nretch-cli 0.20.29 -> 0.20.30, retch-sysinfo 0.1.94 -> 0.1.95.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:02:55-07:00",
          "tree_id": "f1541d237236ef21be7566dd394a99ff28ab83e9",
          "url": "https://github.com/l1a/retch/commit/738b5c23eaba3ffa987a35d7424322bfe355583d"
        },
        "date": 1793218350796,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3294569.8000000007,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 253326448.50000003,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252794592.70000005,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1682438.5,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch",
            "value": 3044688,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 563799974.4,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206999042.6,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2206356.1,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "SystemInfo__collect",
            "value": 370716086.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1903.0462765297748,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.81144698010232,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.885284135428748,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 53.448395613001495,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17621.75821313303,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 179137.6873268233,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 12298.69315671705,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8369.01091592618,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 152762.66763278013,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 330.0644260441793,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 283.7206429652114,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bc247458408bb750dc4cb5d9df33ab51bf929d3",
          "message": "Bump rusqlite to 0.41 (consolidate #303) (#306)\n\nMoves Dependabot #303 (rusqlite 0.40.2 -> 0.41) onto a gated branch, as\n#299 did for #298. Dependabot skips the version bump, the NOTES header\nand the man page regeneration.\n\nThe lockfile resolves rusqlite 0.41.1, released today after #303 was\nopened with 0.41.0. Its two fixes (PRAGMA names under SQLCipher, a\nzero-argument deterministic function panic) touch nothing retch uses;\nlibsqlite3-sys and every other package match #303 exactly.\n\nretch-sysinfo's own manifest changes, so both crates bump:\nretch-cli 0.20.30 -> 0.20.31, retch-sysinfo 0.1.95 -> 0.1.96.\n\nrusqlite bundles SQLite, so per NOTES 8 the rpmdb read was checked\nunprivileged on Fedora (arrakis): `retch --fields packages` prints\nPackages: 2471, equal to `rpm -qa | wc -l`.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:19:04-07:00",
          "tree_id": "1cc67f7daac7928dfc61879ab14019db32cef7a3",
          "url": "https://github.com/l1a/retch/commit/6bc247458408bb750dc4cb5d9df33ab51bf929d3"
        },
        "date": 1793219264577,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3627582.7000000007,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252906386.4,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252886837.7,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1787814.0000000005,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch",
            "value": 3151354.3,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 212713969.8,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206582710.10000005,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2256958.1,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "SystemInfo__collect",
            "value": 248403979.225,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 2047.0775581832058,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 111.4813909898619,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.0505730320900115,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 57.61616761043341,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 20401.320385972103,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 202699.21649416036,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 14213.453396283556,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 9880.879265649017,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 166948.42120307055,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 305.8997416330424,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 288.8528274633699,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0",
          "message": "Close Windows field parity and --short net gap (#307)\n\nRETCH_TIMING=1 on irulan (Windows 11 Pro x86_64) showed net (17.65–24.69 ms)\nand net-detail (9.88–10.69 ms) taking 89% of both --short (27.53 of 30.93 ms)\nand default mode (35.38 of 39.70 ms), because each called\nsysinfo::Networks::new_with_refreshed_list() independently. Replace both with\na single GetIfTable2 + GetUnicastIpAddressTable(AF_UNSPEC) pass (~2.5 ms) in\nwin_iftable::interfaces_with_ips(), hand the rows from\ndetect_active_interface_and_local_ip to detect_networks on the same thread,\nand cache GetAdaptersAddresses (with GAA_FLAG_SKIP_UNICAST) in a OnceLock\nwarmed concurrently for dns/domain/domain-search.\n\nOn irulan (AC), collect-done drops 30.93 -> 5.39 ms (--short) and\n39.70 -> 7.09 ms (default); hyperfine (--shell=none vs fastfetch 2.70.0)\nmeasures --short 27.8 vs 49.5 ms (1.8x), default 30.9 vs 501.3 ms (16.2x),\n--long 152.5 vs 2044.6 ms (13.4x), and --full 544.3 vs 3362.0 ms (6.2x).\n\nAlso implement the 6 remaining Windows fields natively (no PowerShell):\n- keyboard and mouse via SetupAPI GUID_DEVCLASS_KEYBOARD / GUID_DEVCLASS_MOUSE,\n  preferring DEVPKEY_Device_BusReportedDeviceDesc when non-generic\n- brightness via \\\\.\\LCD IOCTL_VIDEO_QUERY_DISPLAY_BRIGHTNESS\n- power-adapter via GetSystemPowerStatus\n- login-manager via LogonUI.exe's VS_FIXEDFILEINFO product version (version.dll)\n- tpm via Tbsi_GetDeviceInfo (tbs.dll)\nplus Windows Terminal terminal-font (settings.json) and standalone\n--fields terminal-font / terminal-theme process-tree detection.\n\nFinally, subtract retch's own and child-process CPU time from Windows\ncpu-usage via an anonymous Win32 Job Object + GetProcessTimes, and sanitize ':'\nin scripts/bench_meta.py's self-test temp directory names on Windows NTFS.\n\nretch-cli 0.20.31 -> 0.20.32, retch-sysinfo 0.1.96 -> 0.1.97.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T11:36:31-07:00",
          "tree_id": "ef9988b328033dbc532eebfbd93269bc2f7fc134",
          "url": "https://github.com/l1a/retch/commit/ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0"
        },
        "date": 1793386393280,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2815382.0000000005,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252341652.5,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252310202.70000005,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1469600.6,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch",
            "value": 2389559.6000000006,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 216814697.9,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205017486.8,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1760823.3,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "SystemInfo__collect",
            "value": 276184922.525,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1791.3999402607583,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 86.33096755164357,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.9132241302162507,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.57305531996682,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 15721.390661263558,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 153762.84221900455,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 10812.6369468119,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 7538.997751045461,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 124835.83859383696,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 257.8469283377947,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 200.37611266287877,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54a7a9960827f9bb307b8831b6acb08cad9f717b",
          "message": "Add Windows CPU cache, freq range, and hybrid cores (#308)\n\nImplement native Windows CPU cache size detection (`cpu-cache`), base and\nboost frequency range detection (`cpu-freq`), hybrid P/E core topology\ndetection (`cpu`), and x86 CPUID brand trimming:\n\n- `crates/sysinfo/src/memory.rs`: Cache `read_smbios_table()` in a\n  `OnceLock` (`cached_smbios_table()`) so `phys-mem` (Type 17) and\n  `cpu-freq` (Type 4) share a single `GetSystemFirmwareTable('RSMB')`\n  call, and add `parse_smbios_type4_speeds()` to read `CurrentSpeed`\n  (base MHz) and `MaxSpeed` (boost MHz) from populated processor sockets.\n- `crates/sysinfo/src/fetch.rs`:\n  - Implement Windows `detect_cpu_cache()` via\n    `GetLogicalProcessorInformationEx(RelationCache, ...)` and share\n    `format_cpu_cache_entries()` with Linux.\n  - Implement Windows `detect_cpu_freq_range()` combining SMBIOS Type 4\n    speeds and per-core `CallNtPowerInformation(ProcessorInformation)`\n    `MaxMhz` values.\n  - Implement Windows `hybrid_cores()` via\n    `GetLogicalProcessorInformationEx(RelationProcessorCore, ...)`,\n    grouping logical processor bitmask popcounts by `EfficiencyClass`.\n  - Trim x86 `CPUID` brand strings in `cpu_brand()` so padded 48-byte\n    strings do not render extra spaces before `(8C / 16T)`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T12:43:34-07:00",
          "tree_id": "cae0fcbe3459e5c24023fe4fc0903cd7768e8923",
          "url": "https://github.com/l1a/retch/commit/54a7a9960827f9bb307b8831b6acb08cad9f717b"
        },
        "date": 1793390169556,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2240264.8,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 297825055.79999995,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252092429.6,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1308006.4,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch",
            "value": 2751026.1000000006,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 302559654.7,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204890848.29999998,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1952881.2,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "SystemInfo__collect",
            "value": 376502681.6,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 925.2563177241497,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 100.80981802776788,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.403626135081768,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.262869008374444,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8653.585573623024,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 79983.37201393467,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 59464.77395631975,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 16180.097493073477,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70603.76907458347,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 328.87327080166847,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.8239117062375,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b1b47a194a52b307dd78675ddf64541b85ebf315",
          "message": "Fix Intel cache unit and V4L2 IPU6 camera list (#309)\n\n- Fix `format_cpu_cache_entries` in `crates/sysinfo/src/fetch.rs` where\n  fractional MiB cache sizes (`kb >= 1024 && !kb.is_multiple_of(1024)`)\n  formatted `\"{:.2}M\"` before `.trim_end_matches('0')` and then appended\n  `+ \"M\"`, producing `\"1.25MM\"` on Intel Golden Cove / Raptor Cove / Lion\n  Cove P-cores (`1280` KB = 1.25 MiB).\n- Filter V4L2 ISP DMA capture queues (`Intel IPU6 ISYS Capture 0..31`),\n  CSI-2 receivers (`Intel IPU6 CSI2 0..3`), and MEI CSI bridges\n  (`Intel IVSC CSI`, `ipu3-*`) in `is_real_camera()`, expand V4L2 I2C\n  sensor names (`\"<model> <bus>-<4-hex-addr>\"`) to `\"<Vendor> <MODEL>\"`\n  (`\"ov01a10 17-0036\"` -> `\"OmniVision OV01A10\"`), append panel location\n  (`(Front)` / `(Back)`) from `device/physical_location/panel`, and sort\n  `/sys/class/video4linux` entries deterministically in `detect_camera()`.\n- Bump `retch-cli` to 0.20.34 and `retch-sysinfo` to 0.1.99, regenerate\n  `docs/retch.1`, and update `NOTES.md`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T15:25:27-07:00",
          "tree_id": "a63fa52ea6b34f624b0d7923d943b798ebaf5301",
          "url": "https://github.com/l1a/retch/commit/b1b47a194a52b307dd78675ddf64541b85ebf315"
        },
        "date": 1793399842302,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2483309.8000000003,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 284963707.3,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252371666.6,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1302559.9000000004,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch",
            "value": 2170221.7,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 625196053.9,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205231544.60000002,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1566397.9000000001,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "SystemInfo__collect",
            "value": 480353217.9,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1390.5728272791823,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 58.47264968963939,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.101173660394193,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 27.336262991629305,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 13458.112079731907,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 140609.15062525435,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 9993.932327450759,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 6781.060287628871,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 121867.72939232134,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 161.20974834076497,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 137.00035226208837,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e0b7c5075ab577c209942f3bf94b325aec2ba1dc",
          "message": "Detect Linux DE and daemon wallpapers dynamically (#310)\n\n- Remove the unconditional Step 9 GNOME `gsettings` fallback and `niri`\n  GNOME routing in `crates/sysinfo/src/theme.rs` so non-GNOME desktops\n  never report GNOME's stale wallpaper.\n- Add single-pass `/proc` wallpaper daemon detection (`noctalia`,\n  `swww-daemon`/`awww-daemon`, `swaybg`/`wbg`/`mpvpaper`, `hyprpaper`,\n  `wpaperd`) and pure parsers for Noctalia's `settings.toml`, `swww`\n  cache files, `/proc/<pid>/cmdline`, COSMIC, `wpaperd`, LXQt, and LXDE.\n- Filter multi-monitor state files (`noctalia`, `swww`/`awww`,\n  `wpaperd`) by connected DRM outputs (`/sys/class/drm/card*-*/status`)\n  and deduplicate wallpaper paths in monitor order.\n- Respect `org.gnome.desktop.interface color-scheme` (`prefer-dark`) on\n  GNOME/Budgie/Unity/Mutter and scope `sway/config` to Sway and\n  `.fehbg`/`nitrogen` to non-Wayland sessions.\n- Probe `detected_desktop` and `detected_wm` in `fetch.rs` whenever\n  `wallpaper` or `wm-theme` is requested, and add `Umbriel`, `COSMIC`,\n  and `Mango` to compositor/DE detection.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-30T19:03:51-07:00",
          "tree_id": "8f3621e63bad1a13ea973721d556f4078ee05000",
          "url": "https://github.com/l1a/retch/commit/e0b7c5075ab577c209942f3bf94b325aec2ba1dc"
        },
        "date": 1793412728600,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 3320622.3000000003,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 325770241.2,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252762711.9,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1684601.8,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch",
            "value": 3244884.5000000005,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 605279928.8000001,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205973634.29999998,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2220309.1,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "SystemInfo__collect",
            "value": 392480198.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1912.8813443942504,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 110.75765652649451,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.8325936572705235,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 55.17451362848298,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 17161.480038006925,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 174178.75486364908,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 11978.224358199706,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 8141.938703116985,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 146708.79458150585,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 379.1142488679328,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 277.4973359196827,
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
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
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
        "date": 1790965512259,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2217431.8199999994,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 253434056.58000007,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 253496327.26000005,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1331411.3399999999,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch",
            "value": 2773457.8199999994,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 245321480.38,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206968521.46000004,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2046364.0399999996,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "SystemInfo__collect",
            "value": 291141780.3,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 940.0622271193913,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.22675917111664,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466075599740744,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.18088670017723,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7680.80102375736,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71134.09103213328,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4722.001134459064,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3410.960367605255,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57333.754416714,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 273.4325728831111,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 250.95469067233594,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1dc26f7a7899d6901721819a5fdfedfcae0ed5a4",
          "message": "List macOS volumes natively; free space from statfs (#286)\n\nmacOS --short was 43-46 ms against fastfetch's 16 ms, and all of it was\nthe `disk` field (~39 ms; the --version floor is 3.7 ms). sysinfo's\nDisks asked CoreFoundation for every mount's\nkCFURLVolumeAvailableCapacityForImportantUsageKey, which costs ~9 ms\nper volume on first query.\n\nMounts now come from getfsstat(MNT_NOWAIT). The same two CFURL keys\nsysinfo filtered on, IsBrowsable and IsLocal, pick the volumes, so the\nlist is unchanged: /System/Volumes/Data carries MNT_DONTBROWSE but is\nbrowsable to CoreFoundation, so f_flags cannot stand in for it. A fresh\nstatfs sizes only the kept volumes.\n\nVisible change, macOS only (user decision): \"free\" is f_bavail, as df\nand fastfetch report it, and no longer counts purgeable space, so it\ncan read lower than Finder (315.0 GiB vs ~336 here). The man page's\n`disk` entry says so. Totals are unchanged.\n\n--short on chani (battery): 33.5 -> 7.0 ms, fastfetch 17.0. The disk\nprobe 39 -> 1.95 ms. Tests pin the selection against chani's real\n13-mount table; three mutations of the filter, all caught.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:41:45-07:00",
          "tree_id": "f10a0fceebad4d7781d2b9f62f9e1ccd6aefc7a9",
          "url": "https://github.com/l1a/retch/commit/1dc26f7a7899d6901721819a5fdfedfcae0ed5a4"
        },
        "date": 1790967153182,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2315106.6999999997,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252570752.95999998,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252531656.21999997,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1559568.4200000004,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch",
            "value": 2970677,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 232280931.56,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205261666.32000002,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2074670.3200000003,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "SystemInfo__collect",
            "value": 245812505.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 934.2775611551913,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.57680112123872,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468660481153734,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.29746683741087,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7739.198316956926,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71099.05436751003,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4815.778727944786,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3450.7958547066273,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57848.05808754461,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 273.9225061082915,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 254.41968414010566,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "49db22cc74ebea3f11599867b72d52a399cdfc08",
          "message": "Stop reporting macOS Bluetooth as Off when unknown (#287)\n\nOn macOS 26 and later IOBluetoothHCIController no longer publishes\nBluetoothControllerPowerIsOn, and get_bluetooth_state folded the\nmissing property into false, so a Mac with Bluetooth on and a keyboard\nconnected printed \"Bluetooth: Off (Apple Bluetooth)\" (chani, macOS 27).\n\nThe power state is now an Option. When it cannot be read the line\ncarries no state at all, \"Bluetooth: Apple Bluetooth\", per the rule\nthat under-reporting beats asserting something false. Known states\nprint exactly as before. \"Apple Bluetooth\" is bluetooth.rs's fallback\nwhen no chipset string exists, which answers the NOTES question of\nwhere the name came from.\n\nA real power source is still open (NOTES 6c): the preferences plist\nhas no ControllerPowerState, and system_profiler knows but costs a\nseconds-long spawn. Tests pin both branches; reverting unknown to Off\nfails them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T12:41:17-07:00",
          "tree_id": "3ec0a099872ef85d74f69c184c9a09ab9e4917ff",
          "url": "https://github.com/l1a/retch/commit/49db22cc74ebea3f11599867b72d52a399cdfc08"
        },
        "date": 1790970707673,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2239922.14,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 279056512.12,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252424093.23999998,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1406287.6400000004,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch",
            "value": 3065707.7400000007,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 297807138.02,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205926177.33999997,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2083223.6400000004,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "SystemInfo__collect",
            "value": 322322078.2,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 993.5826333291064,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.93703021530166,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94721915292431,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.319588359320576,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7831.476505720291,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71667.59668900064,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4824.109750587034,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3466.207653368464,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58044.33279173629,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 279.3741075209892,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.87044272963476,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddc8016cedff49fcd78adaf49f6bd6b5b41987e6",
          "message": "Fix release notes after v0.20.16 (#288)\n\nCorrect NOTES.md: cargo owner --list does not authenticate the\ncrates.io token, the newest released tag is v0.20.16, and record\nthe auto-mode blocks hit during the release. Bump to 0.20.17.\n\nAssisted-By: Claude Sonnet 5.5",
          "timestamp": "2026-10-02T13:28:51-07:00",
          "tree_id": "cbeeadcd4295a30f824bf2b9c0bc725f87ce1436",
          "url": "https://github.com/l1a/retch/commit/ddc8016cedff49fcd78adaf49f6bd6b5b41987e6"
        },
        "date": 1790973574730,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2257967.4600000004,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252434710.53999993,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252415490.26000005,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1316936.34,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch",
            "value": 2970647.7600000002,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 225738385.94,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205561316.75999996,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2007275.1400000001,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "SystemInfo__collect",
            "value": 232727119.525,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 935.8423662381023,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.00682405288553,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468262205465,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.39917066914769,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7736.57449368233,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 72172.97637221872,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4809.183918121036,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3468.948774426637,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57281.48150131386,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 278.1195882793701,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 252.73161098487043,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51cfe8f12234bdf793372a2e8a445841d6fd69c3",
          "message": "Bump libc to 0.2.190 (consolidate #289) (#290)\n\nRolls Dependabot #289 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" specs already admit libc 0.2.190, nothing else moves, and\nthe libc lines in Cargo.lock are byte-identical to Dependabot's.\n\nlibc 0.2.190 adds Default impls for more structs, a libc_unstable_time64\ncfg (opt-in, unused here) and new constants, mostly on Apple and BSD.\nretch's own libc use (the Linux fd calls in gpu_api.rs and the sysinfo\nFFI) builds and passes clippy and the full test suite unchanged, and\nthe GPU-API fields still print on real hardware.\n\nretch-sysinfo stays at 0.1.89: a lockfile change alters nothing that\ncrate publishes.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T14:57:48-07:00",
          "tree_id": "e1f0d55f8bb50b94dde179076cd192dcf11d3783",
          "url": "https://github.com/l1a/retch/commit/51cfe8f12234bdf793372a2e8a445841d6fd69c3"
        },
        "date": 1791756438340,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2546238.54,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252470692.48,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252467849.66000003,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1530515.4400000002,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch",
            "value": 3203465.14,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 256799464.78000003,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206161625.56,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2082851.24,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "SystemInfo__collect",
            "value": 255737255.925,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 944.1533892200589,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.92962980413662,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468582783262756,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.591955864467856,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7626.20443410034,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70988.01246401566,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4710.963005790666,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3397.5202963786674,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57023.870242848,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 279.1907550290962,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 279.4281453067738,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a",
          "message": "Name Linux GPUs from udev before pci.ids (#291)\n\nretch --short on corrino (Intel Iris Xe + NVIDIA MX550) was 8.4 ms\nagainst fastfetch's 5.8. RETCH_TIMING showed the gpu probe as the\nwhole critical path: it read and walked the 1.6 MB pci.ids once per\nGPU, ~4 ms cold for the Intel iGPU near the end of the file and ~1.5 ms\nfor the NVIDIA card, whose name the driver's /proc entry then replaced\nanyway. A faster search does not help (str::find costs the same).\n\nresolve_gpu_name now asks each source lazily, first hit wins: the\nNVIDIA driver's /proc model, amdgpu.ids (AMD), udev's resolved\nID_MODEL_FROM_DATABASE in /run/udev/data/+pci:<slot> (~300 bytes),\nthen pci.ids, then a generic vendor name. AMD names from udev or\npci.ids still go through the codename table, as before.\n\n--short on corrino: 8.42 -> 3.32 ms (fastfetch 5.81); default 9.70 ->\n5.78 ms. GPU, Vulkan, OpenGL and OpenCL lines are identical in all four\nmodes, and identical in a fedora:44 container with no /run/udev, where\nthe pci.ids fallback runs. Tests pin the order with sources that panic\nif called; five mutations were all caught.\n\nretch-sysinfo 0.1.89 -> 0.1.90, retch-cli 0.20.18 -> 0.20.19.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T15:19:14-07:00",
          "tree_id": "39483f60f40a8e71c7bcc026028d415e06ebb3a4",
          "url": "https://github.com/l1a/retch/commit/8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a"
        },
        "date": 1791757729687,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2241556.9599999995,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252405370.04000008,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252412090.04,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1350905.34,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch",
            "value": 2805241.2600000002,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 242181040.64000002,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205319689.23999998,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1829352.0400000003,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "SystemInfo__collect",
            "value": 383899568.1,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 945.0601422205827,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 108.38114189960672,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946773019814072,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.56326429042416,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7750.265515127891,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70279.42233364687,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4758.484394301747,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3438.1327311975974,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57962.83638800432,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 275.7666830507168,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.2954128333075,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a7cfa0c3f0e28dae4eec94464824108211b7af7e",
          "message": "Make CLI benchmarks work under hyperfine 2.0 (#292)\n\nhyperfine 2.0.0 reached crates.io around 2026-10-10 and broke the CLI\nbenchmarks two ways, both silently.\n\nIt runs commands with no shell by default and splits them with POSIX\nrules, so a backslash is an escape. The Windows x64 runner falls back\nto an unpinned `cargo install hyperfine`, got 2.0, and turned\n.\\target\\release\\retch.exe into .targetreleaseretch.exe: the main\nbenchmark job failed with \"program not found\" on #290 and #291, so that\nsuite has no v0.20.18 or v0.20.19 point. cli_bench.py and `just\nbench-cli` now pass --shell=none explicitly (1.13+ accepts it too), so\nevery hyperfine version measures the same way, and spell the Windows\nbinary ./target/release/retch.exe. Labels key on the flags, so no\ndashboard series forks.\n\nIts JSON export is a new schema: no top-level `mean`; wall-clock time\nis summary.time_wall_clock.mean. labelled_means read only the 1.x key,\nso with hyperfine 2.0 installed locally the post-merge hook published\ntwo empty points (51cfe8f, 8d20d64) while every step reported success.\nmean_seconds now reads both schemas, and both publishers\n(parse_criterion.py, upload_local_bench.py) refuse a run missing any\nexpected series (missing_series).\n\nVerified: real runs under hyperfine 2.0.0 and 1.18.0 produce all eight\nseries; the uploader's dry run collects eight and, with the 2.x reader\nremoved, refuses. Eight mutations, each caught by its intended test.\n\nNOTES also records the arrakis GPU check, the CI dashboard read\n(Linux x64 --full behind; check fastfetch's weather first), and the\nbare-command `just merge-pr` allow rule.\n\nretch-cli 0.20.19 -> 0.20.20.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T20:51:02-07:00",
          "tree_id": "54584a1b0a27b5f07c61be671ff440acac57c4e8",
          "url": "https://github.com/l1a/retch/commit/a7cfa0c3f0e28dae4eec94464824108211b7af7e"
        },
        "date": 1791777612483,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2198618.3000000003,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252487278.4,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252530115.60000005,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1415886.8000000003,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch",
            "value": 2875324.3,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 210519669.70000002,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205810102.20000002,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1989159,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "SystemInfo__collect",
            "value": 268728430.75,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 930.0109884465082,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 108.54548415755796,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9467676620424887,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.64649863153243,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7720.236003671463,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70660.48200311523,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4769.500513118572,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3432.078598558381,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58337.27268632031,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 275.1531391451505,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 269.68508722061773,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b3630093a37b1ea5560ceb0b3eafb610d10c7f05",
          "message": "Show macOS battery on AC as not charging (#294)\n\nA Mac on AC that is holding its charge (macOS's 80% limit, Optimized\nBattery Charging) reports IsCharging = No and FullyCharged = No, and\nretch printed it as \"discharging\". fastfetch says \"AC Connected\" on the\nsame machine.\n\nRead AppleSmartBattery's ExternalConnected as well. On AC with the\nbattery neither charging nor full the state is now Unknown, which\nalready renders \"not charging\" (Linux's sysfs \"Not charging\"). Without\nthe property the old answer is kept. The decision is a pure function,\nmac_battery_state, compiled under cfg(test) on every platform so CI\ntests it everywhere.\n\nBumps retch-cli to 0.20.21 and retch-sysinfo to 0.1.91.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T19:28:14-07:00",
          "tree_id": "4cdecaed7e6a172bf9d6d524f302b9b8b4c5418b",
          "url": "https://github.com/l1a/retch/commit/b3630093a37b1ea5560ceb0b3eafb610d10c7f05"
        },
        "date": 1792031920609,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1867979.1,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 254714249.19999996,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 251965265.20000002,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1110400.6,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch",
            "value": 2534964.1,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 282947431.90000004,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 208270012.9,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1903119.4000000001,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "SystemInfo__collect",
            "value": 357364214.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 931.6449364319611,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 108.28917681855197,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470430724580945,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 47.0558875027397,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7782.082186683923,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 72912.37552005761,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4869.5394438819985,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3484.6430844746437,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58517.82658687582,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 275.83290185065846,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 267.88261169921566,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22f24a82840987adc1249ebe91bb94d71f5f0b5a",
          "message": "Install fastfetch's universal macOS archive when per-arch is gone (#295)\n\nfastfetch 2.70.0 (2026-10-14) publishes only fastfetch-macos-universal\nfor macOS; 2.69.0 published only fastfetch-macos-aarch64/-amd64. The\nbenchmark installer asked for the per-arch name, got a 404, and the\nmacOS arm64 job of Continuous Benchmarking failed on main for b363009\n(#294). It is the second time fastfetch has switched layouts.\n\nmacOS now tries the per-arch archive and falls back to the universal\none. Both keep the binary at usr/bin/fastfetch, so find_binary_dir is\nunchanged. Only a 404 moves on to the next name: a network error or a\n5xx is raised as itself rather than reported as a missing asset.\n\nVerified: a real --latest-release install on an M3 Pro 404s on aarch64,\nfalls back, and runs fastfetch 2.70.0. The self-test covers the\ncandidates and download_first against a fake release; dropping the\nfallback, or treating every HTTP error as a 404, each fail it.\n\nretch-cli 0.20.21 -> 0.20.22.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T20:59:56-07:00",
          "tree_id": "89497667f1b7375453f246d993b6fb07360b464e",
          "url": "https://github.com/l1a/retch/commit/22f24a82840987adc1249ebe91bb94d71f5f0b5a"
        },
        "date": 1792037450210,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2114033.9000000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 276590667.1,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252374779,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1341997.9000000001,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch",
            "value": 2987718.9000000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 274458021.29999995,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 212096997.30000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2302275.1,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "SystemInfo__collect",
            "value": 373217400.15,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 933.1348355379666,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 108.2778144638479,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9469666726128243,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.64042584235968,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7804.5745728866,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71393.12220827056,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4813.793164204146,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3454.328293160518,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58255.496974204936,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 275.0296019345773,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 268.413777334364,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2497ba0e7d6e6bdd55adc9190745bf9ad07e1771",
          "message": "Bump toml to 1.1.8 (consolidate #293) (#296)\n\nRolls Dependabot #293 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: the\nroot crate's \"1.1\" spec already admits toml 1.1.8, and the Cargo.lock\nlines (toml, toml_datetime, toml_parser, toml_writer, serde_spanned)\nare identical to Dependabot's.\n\ntoml 1.1.7/1.1.8 fix the serializer to encode every key and remove a\nrisk of unsoundness in the parser around synthetic events. retch only\nparses (Config::load): a real config with a field list and a custom hex\ntheme applies, the --generate-config output parses back, and a\nmalformed file still reports toml's located error.\n\nretch-sysinfo stays at 0.1.91: it does not depend on toml.\n\nretch-cli 0.20.22 -> 0.20.23.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:18:06-07:00",
          "tree_id": "80a1f51cd240e5c2237904018b159281b7f183cc",
          "url": "https://github.com/l1a/retch/commit/2497ba0e7d6e6bdd55adc9190745bf9ad07e1771"
        },
        "date": 1792038489711,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 1947896.3000000005,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 297332050.7,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252189344.49999997,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1148351.2,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch",
            "value": 2788044.3000000003,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 302296196.40000004,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206395336.9,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1873487.7000000002,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "SystemInfo__collect",
            "value": 388208970,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 942.0552509022548,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.86740624381741,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9466426261262098,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.63369029136791,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7761.886816927409,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70814.05402132646,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4721.699321263846,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3423.567110599025,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 59110.28637471832,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 281.34888943273774,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 270.7410464196988,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792040728515,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2061486.1,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 531528446.9000001,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252297658.00000003,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1220318.6,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch",
            "value": 2906687.4,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 686050849.2000002,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205508129.1,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2020640.7000000004,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "SystemInfo__collect",
            "value": 381256274.825,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 938.8073806993519,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.8132529393841,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9474529372796665,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.057228295483526,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7840.394982733706,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70732.24680340987,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4814.8438371736565,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3474.9825321600756,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58524.41940694595,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 281.4489685425301,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 260.682816158628,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6",
          "message": "Bump libc to 0.2.191 (consolidate #298) (#299)\n\nRolls Dependabot #298 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" spec already admits libc 0.2.191, and the Cargo.lock\nlines are identical to Dependabot's.\n\nretch-sysinfo stays at 0.1.91: a lockfile change alters nothing that\ncrate publishes.\n\nretch-cli 0.20.24 -> 0.20.25.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T08:50:41-07:00",
          "tree_id": "b47069d397a2fa415048399d8c3d37e546d8d089",
          "url": "https://github.com/l1a/retch/commit/7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6"
        },
        "date": 1792598490423,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2244835.1999999997,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 279178379.7,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252364886.8,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1378570.5,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch",
            "value": 3243582.2,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 390755024.1,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204931812.40000007,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2299203.0000000005,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "SystemInfo__collect",
            "value": 352205283.925,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 989.3214768220126,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.75379450188811,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9472899733982296,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.526856739598564,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8886.205600029993,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 82937.28879323618,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5835.687321641179,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4029.6171219834127,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70694.20780960904,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 278.9252695435582,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 265.04594463518396,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d485e1a7bed3201d40b5138243c3ea96403fb647",
          "message": "Note that syncing main publishes a benchmark (#300)\n\nThe post-merge hook fires after any merge onto main, a fast-forward\npull included, and pushes a local benchmark point to gh-pages. Record\nthat in NOTES 7.5 with the two ways to sync without publishing\n(GIT_NO_BENCH=1, or branch from origin/main), and the --no-track trap\nin the second: a branch tracking origin/main makes just open-pr skip\nits push.\n\nDocs-only. retch-cli 0.20.25 -> 0.20.26.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T09:13:07-07:00",
          "tree_id": "ee5373a58754448005eabf22e9420c2a687af91b",
          "url": "https://github.com/l1a/retch/commit/d485e1a7bed3201d40b5138243c3ea96403fb647"
        },
        "date": 1792599835361,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2015231.7000000004,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 256933192.50000003,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 318344932.9,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1247653.1000000003,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch",
            "value": 2872698.3,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 254068032.8,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206786127.10000005,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1831538.7,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "SystemInfo__collect",
            "value": 281643949.575,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 945.2827142961935,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.84483767279013,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946690487141768,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 46.736799419280494,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7804.2134602161,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71352.47084033587,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4745.260946474612,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3453.140139135773,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 57746.10019272634,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 279.04264070549095,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 272.39985344178405,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d755c1b4920cd8b578b1e3a7465dae3f96e1f883",
          "message": "Overlap temp/wm; refuse skipped weather (#301)\n\n* Overlap temp/wm; refuse skipped weather\n\n--full no longer pays temp then wm after weather\n(~21 ms). CLI benches fail if Public IP or Weather\nis missing, so Linux CI cannot win by failing fast.\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n* Handle Windows bench UTF-8 I/O\n\nDecode captured stdout as UTF-8 and print via\nconsole_safe so cp1252 cannot crash on weather emoji.\n\nAssisted-By: Composer\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>",
          "timestamp": "2026-10-23T16:02:49-07:00",
          "tree_id": "49b6c1563e755ad02c7fb5666baa89af24e01638",
          "url": "https://github.com/l1a/retch/commit/d755c1b4920cd8b578b1e3a7465dae3f96e1f883"
        },
        "date": 1792797215053,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2000453.4000000004,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 362170953.6,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252088585.80000004,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1188595.4000000004,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch",
            "value": 2927243.5,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 277047135.70000005,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206307349.70000002,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1930840.7000000004,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "SystemInfo__collect",
            "value": 266841302.725,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 937.6235853867307,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.13470016247591,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9468871053018435,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 50.859122412180696,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7628.041159271526,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 70503.47934306618,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4771.097942905557,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3402.011634648808,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58048.6937838859,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 272.437568205325,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 245.96507858953774,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b882a0d743af4260a034c8100ceb5aa927773247",
          "message": "Single-source long-form channel text (#302)\n\nUnify README.md's top overview with packaging/copr/project-description.md\nbetween <!-- BEGIN copr-description --> / <!-- END copr-description -->\nmarkers (with all three platforms' config paths and absolute https://\nlinks, since crates.io rewrites repo-relative file links to blob/HEAD/...\nwhile COPR renders on its own domain and resolves neither relative paths\nnor #anchor fragments).\n\nReplace the manual //! crate header and ReadmeDoctests struct in\ncrates/sysinfo/src/lib.rs with #![doc = include_str!(\"../README.md\")] so\ndocs.rs and crates/sysinfo/README.md are one text and its code block\nstill compiles as a doctest.\n\nEnforce both invariants in scripts/metadata_check.py (plus --sync-copr\nand negative self-tests) and watch **/README.md in packaging.yml. Update\nNOTES.md for v0.20.28 / newest tag v0.20.27 and the d755c1b benchmark\nfigures.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-27T12:20:41-07:00",
          "tree_id": "5791e4ca47e7032f5bf9df305fe27a3eeea1448f",
          "url": "https://github.com/l1a/retch/commit/b882a0d743af4260a034c8100ceb5aa927773247"
        },
        "date": 1793129495262,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2035601.4000000004,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 253690251.4,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252304207.40000004,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1231922.2,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch",
            "value": 2785514.6,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 467430599.7,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 208280606.79999998,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 1949441.8000000003,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "SystemInfo__collect",
            "value": 275866755.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 940.4079552682599,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.7838815987208,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.946802288339289,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.39805796687712,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 7688.047503663731,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 71244.24983648348,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 4817.708931316052,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 3447.6491401666813,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 58528.3938645534,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 269.2690019048227,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.25415333126256,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce116b5ad3e75019fb185c440d6df11db27fa6a3",
          "message": "Speed up the macOS default mode (#304)\n\nOn an M3 Pro (macOS 27.2, on AC) the default mode drops from 114-152 ms\nto 65 ms (hyperfine, 40 runs; main measured 152.3 and 114.0 ms as two\ncopies of one binary in the same sitting, this build 64.9 +/- 1.3 ms).\nOutput is unchanged in all four modes. Two causes:\n\n- phys-mem spawned `system_profiler SPMemoryDataType`, 87-147 ms and the\n  whole critical path. Apple Silicon publishes the same size and type on\n  IODeviceTree:/chosen (dram-size, dram-type), which now answers in\n  under 0.1 ms. Intel Macs, which lack them, still spawn it.\n- audio took &System and read it on no platform, yet it ran after\n  sys-init and needs_process_list counted it, so off Linux the default\n  mode loaded a process table nobody used (6.6-11.8 ms) and CoreAudio\n  started late. It now starts with the borrow-nothing probes via\n  detect_audio_devices(); detect_audio(&System) stays as a wrapper so\n  retch-sysinfo's API does not break. Windows' default mode stops\n  loading the table too (not measured: no Windows host).\n\nneeds_process_list now takes the field predicate, so a test can feed it\nthe default mode's real field set. Both new guards were watched failing\nagainst a mutation.\n\nNOTES also closes the v0.20.8 macOS --short alert (runner noise: retch\nand fastfetch spiked in the same runs) and records two open macOS items:\nno IOKit source tracks the Bluetooth radio (tested by hand), and the\nNet: lines print in a different order on every run.\n\nretch-cli 0.20.28 -> 0.20.29, retch-sysinfo 0.1.93 -> 0.1.94.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T12:49:42-07:00",
          "tree_id": "33ac12268c4fabd03f7a0ff1db01333a8eb84eeb",
          "url": "https://github.com/l1a/retch/commit/ce116b5ad3e75019fb185c440d6df11db27fa6a3"
        },
        "date": 1793217616616,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2380276.9999999995,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 252493269.40000007,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252458255.80000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1388816.0000000002,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch",
            "value": 3235982.900000001,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 210774774.90000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204817460.4,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2192579.3000000003,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "SystemInfo__collect",
            "value": 252986326.8,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 993.5993731090408,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.0175681813384,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949130297750077,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 50.87332546349896,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8903.542331338922,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 84227.86627206193,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5756.601167327062,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4084.4083240318105,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71487.50456954053,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 275.88887927686267,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 263.7032146913226,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "738b5c23eaba3ffa987a35d7424322bfe355583d",
          "message": "List network interfaces in a stable order (#305)\n\nsysinfo keeps interfaces in a HashMap, whose iteration order is\nrandomised per process, and detect_networks listed them in that order.\nSo --long and --full printed the non-active Net: lines shuffled\ndifferently on every run, on every platform, and the default mode's\nfallback (the first interface that is up, used when the active one\ncannot be resolved) could print a different line each time.\n\ndetect_networks now sorts by a natural name key: the name without its\ntrailing number, that number numerically, then the full name, so en2\ncomes before en10 and utun2 before utun100. The active interface still\nleads in --long and --full. Same set of lines as before; only the order\nis now fixed.\n\nTests cover the key (including names a plain string sort gets wrong and\nWindows names with spaces) and, live, that detect_networks returns its\nlist in key order. Both were watched failing against a mutation. On\nchani three --long runs now print the same order.\n\nretch-cli 0.20.29 -> 0.20.30, retch-sysinfo 0.1.94 -> 0.1.95.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:02:55-07:00",
          "tree_id": "f1541d237236ef21be7566dd394a99ff28ab83e9",
          "url": "https://github.com/l1a/retch/commit/738b5c23eaba3ffa987a35d7424322bfe355583d"
        },
        "date": 1793218352163,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2671741.6999999997,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 258947444.79999998,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252432983,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1607980.9000000004,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch",
            "value": 3700038.1000000006,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 332339920.1,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 204972650.10000005,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2680277.6,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "SystemInfo__collect",
            "value": 287757301.975,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 998.4441494243217,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 103.54809995505734,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947413503763695,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.6086970071546,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8963.279273467784,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 82510.25434198994,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5637.573240620834,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4012.23953881885,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71003.5710801874,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 273.7276683366405,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 266.20752878858895,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bc247458408bb750dc4cb5d9df33ab51bf929d3",
          "message": "Bump rusqlite to 0.41 (consolidate #303) (#306)\n\nMoves Dependabot #303 (rusqlite 0.40.2 -> 0.41) onto a gated branch, as\n#299 did for #298. Dependabot skips the version bump, the NOTES header\nand the man page regeneration.\n\nThe lockfile resolves rusqlite 0.41.1, released today after #303 was\nopened with 0.41.0. Its two fixes (PRAGMA names under SQLCipher, a\nzero-argument deterministic function panic) touch nothing retch uses;\nlibsqlite3-sys and every other package match #303 exactly.\n\nretch-sysinfo's own manifest changes, so both crates bump:\nretch-cli 0.20.30 -> 0.20.31, retch-sysinfo 0.1.95 -> 0.1.96.\n\nrusqlite bundles SQLite, so per NOTES 8 the rpmdb read was checked\nunprivileged on Fedora (arrakis): `retch --fields packages` prints\nPackages: 2471, equal to `rpm -qa | wc -l`.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:19:04-07:00",
          "tree_id": "1cc67f7daac7928dfc61879ab14019db32cef7a3",
          "url": "https://github.com/l1a/retch/commit/6bc247458408bb750dc4cb5d9df33ab51bf929d3"
        },
        "date": 1793219264938,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2398812.3000000003,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 286655416.40000004,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252457827.99999994,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1482187.1,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch",
            "value": 3642817.6000000006,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 452174551.6000001,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205170207.70000002,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2331218.9000000004,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "SystemInfo__collect",
            "value": 355253854.4,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 985.6455777610587,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.49110046633575,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947191886373808,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.768569445724715,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8908.138469681839,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 83338.00232373216,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5709.304924624301,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4050.4216836512037,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70878.05475035611,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 276.08639109058015,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 255.24360920270925,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0",
          "message": "Close Windows field parity and --short net gap (#307)\n\nRETCH_TIMING=1 on irulan (Windows 11 Pro x86_64) showed net (17.65–24.69 ms)\nand net-detail (9.88–10.69 ms) taking 89% of both --short (27.53 of 30.93 ms)\nand default mode (35.38 of 39.70 ms), because each called\nsysinfo::Networks::new_with_refreshed_list() independently. Replace both with\na single GetIfTable2 + GetUnicastIpAddressTable(AF_UNSPEC) pass (~2.5 ms) in\nwin_iftable::interfaces_with_ips(), hand the rows from\ndetect_active_interface_and_local_ip to detect_networks on the same thread,\nand cache GetAdaptersAddresses (with GAA_FLAG_SKIP_UNICAST) in a OnceLock\nwarmed concurrently for dns/domain/domain-search.\n\nOn irulan (AC), collect-done drops 30.93 -> 5.39 ms (--short) and\n39.70 -> 7.09 ms (default); hyperfine (--shell=none vs fastfetch 2.70.0)\nmeasures --short 27.8 vs 49.5 ms (1.8x), default 30.9 vs 501.3 ms (16.2x),\n--long 152.5 vs 2044.6 ms (13.4x), and --full 544.3 vs 3362.0 ms (6.2x).\n\nAlso implement the 6 remaining Windows fields natively (no PowerShell):\n- keyboard and mouse via SetupAPI GUID_DEVCLASS_KEYBOARD / GUID_DEVCLASS_MOUSE,\n  preferring DEVPKEY_Device_BusReportedDeviceDesc when non-generic\n- brightness via \\\\.\\LCD IOCTL_VIDEO_QUERY_DISPLAY_BRIGHTNESS\n- power-adapter via GetSystemPowerStatus\n- login-manager via LogonUI.exe's VS_FIXEDFILEINFO product version (version.dll)\n- tpm via Tbsi_GetDeviceInfo (tbs.dll)\nplus Windows Terminal terminal-font (settings.json) and standalone\n--fields terminal-font / terminal-theme process-tree detection.\n\nFinally, subtract retch's own and child-process CPU time from Windows\ncpu-usage via an anonymous Win32 Job Object + GetProcessTimes, and sanitize ':'\nin scripts/bench_meta.py's self-test temp directory names on Windows NTFS.\n\nretch-cli 0.20.31 -> 0.20.32, retch-sysinfo 0.1.96 -> 0.1.97.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T11:36:31-07:00",
          "tree_id": "ef9988b328033dbc532eebfbd93269bc2f7fc134",
          "url": "https://github.com/l1a/retch/commit/ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0"
        },
        "date": 1793386393626,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2271606,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 287529171.9,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252338883.10000002,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1292388.6999999997,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch",
            "value": 2964341.6000000006,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 269831224.6,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 301637438.40000004,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2068964.0000000005,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "SystemInfo__collect",
            "value": 352386510.35,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 984.0620817046365,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 104.69822032817305,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9470357378083114,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.697684464411154,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8930.853632015403,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 82965.41233927649,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5634.6296279102535,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4009.7563808059103,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70967.99057566706,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 266.4271507534339,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 264.73396403408344,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54a7a9960827f9bb307b8831b6acb08cad9f717b",
          "message": "Add Windows CPU cache, freq range, and hybrid cores (#308)\n\nImplement native Windows CPU cache size detection (`cpu-cache`), base and\nboost frequency range detection (`cpu-freq`), hybrid P/E core topology\ndetection (`cpu`), and x86 CPUID brand trimming:\n\n- `crates/sysinfo/src/memory.rs`: Cache `read_smbios_table()` in a\n  `OnceLock` (`cached_smbios_table()`) so `phys-mem` (Type 17) and\n  `cpu-freq` (Type 4) share a single `GetSystemFirmwareTable('RSMB')`\n  call, and add `parse_smbios_type4_speeds()` to read `CurrentSpeed`\n  (base MHz) and `MaxSpeed` (boost MHz) from populated processor sockets.\n- `crates/sysinfo/src/fetch.rs`:\n  - Implement Windows `detect_cpu_cache()` via\n    `GetLogicalProcessorInformationEx(RelationCache, ...)` and share\n    `format_cpu_cache_entries()` with Linux.\n  - Implement Windows `detect_cpu_freq_range()` combining SMBIOS Type 4\n    speeds and per-core `CallNtPowerInformation(ProcessorInformation)`\n    `MaxMhz` values.\n  - Implement Windows `hybrid_cores()` via\n    `GetLogicalProcessorInformationEx(RelationProcessorCore, ...)`,\n    grouping logical processor bitmask popcounts by `EfficiencyClass`.\n  - Trim x86 `CPUID` brand strings in `cpu_brand()` so padded 48-byte\n    strings do not render extra spaces before `(8C / 16T)`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T12:43:34-07:00",
          "tree_id": "cae0fcbe3459e5c24023fe4fc0903cd7768e8923",
          "url": "https://github.com/l1a/retch/commit/54a7a9960827f9bb307b8831b6acb08cad9f717b"
        },
        "date": 1793390170933,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2600617.1,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 256890571.29999998,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252492589.6,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1527004.1,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch",
            "value": 3691611.8000000003,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 266642496.10000002,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205439642.3,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2574077.8000000003,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "SystemInfo__collect",
            "value": 267949207.65,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 989.4643555031796,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 106.38496874553638,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9471099826150473,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.65087645362287,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8977.131078995924,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 84600.44655752889,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5791.115228970472,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4093.775778873074,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71155.83387996136,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 270.71528206876116,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 240.678274490691,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b1b47a194a52b307dd78675ddf64541b85ebf315",
          "message": "Fix Intel cache unit and V4L2 IPU6 camera list (#309)\n\n- Fix `format_cpu_cache_entries` in `crates/sysinfo/src/fetch.rs` where\n  fractional MiB cache sizes (`kb >= 1024 && !kb.is_multiple_of(1024)`)\n  formatted `\"{:.2}M\"` before `.trim_end_matches('0')` and then appended\n  `+ \"M\"`, producing `\"1.25MM\"` on Intel Golden Cove / Raptor Cove / Lion\n  Cove P-cores (`1280` KB = 1.25 MiB).\n- Filter V4L2 ISP DMA capture queues (`Intel IPU6 ISYS Capture 0..31`),\n  CSI-2 receivers (`Intel IPU6 CSI2 0..3`), and MEI CSI bridges\n  (`Intel IVSC CSI`, `ipu3-*`) in `is_real_camera()`, expand V4L2 I2C\n  sensor names (`\"<model> <bus>-<4-hex-addr>\"`) to `\"<Vendor> <MODEL>\"`\n  (`\"ov01a10 17-0036\"` -> `\"OmniVision OV01A10\"`), append panel location\n  (`(Front)` / `(Back)`) from `device/physical_location/panel`, and sort\n  `/sys/class/video4linux` entries deterministically in `detect_camera()`.\n- Bump `retch-cli` to 0.20.34 and `retch-sysinfo` to 0.1.99, regenerate\n  `docs/retch.1`, and update `NOTES.md`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T15:25:27-07:00",
          "tree_id": "a63fa52ea6b34f624b0d7923d943b798ebaf5301",
          "url": "https://github.com/l1a/retch/commit/b1b47a194a52b307dd78675ddf64541b85ebf315"
        },
        "date": 1793399844038,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2426698.3000000003,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 256709217.49999997,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252342621.3,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1451717.4000000001,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch",
            "value": 3082270.9000000004,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 422588935.5,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205226786.00000003,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2312811.6999999997,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "SystemInfo__collect",
            "value": 303635094.45,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1001.7608400707795,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 102.82609913996366,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947476401806782,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 45.44660785871107,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8985.659215225194,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 84630.74869150945,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5735.972427569774,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4065.861358822482,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70681.1967674192,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 274.4965904190665,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 263.4869460480737,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e0b7c5075ab577c209942f3bf94b325aec2ba1dc",
          "message": "Detect Linux DE and daemon wallpapers dynamically (#310)\n\n- Remove the unconditional Step 9 GNOME `gsettings` fallback and `niri`\n  GNOME routing in `crates/sysinfo/src/theme.rs` so non-GNOME desktops\n  never report GNOME's stale wallpaper.\n- Add single-pass `/proc` wallpaper daemon detection (`noctalia`,\n  `swww-daemon`/`awww-daemon`, `swaybg`/`wbg`/`mpvpaper`, `hyprpaper`,\n  `wpaperd`) and pure parsers for Noctalia's `settings.toml`, `swww`\n  cache files, `/proc/<pid>/cmdline`, COSMIC, `wpaperd`, LXQt, and LXDE.\n- Filter multi-monitor state files (`noctalia`, `swww`/`awww`,\n  `wpaperd`) by connected DRM outputs (`/sys/class/drm/card*-*/status`)\n  and deduplicate wallpaper paths in monitor order.\n- Respect `org.gnome.desktop.interface color-scheme` (`prefer-dark`) on\n  GNOME/Budgie/Unity/Mutter and scope `sway/config` to Sway and\n  `.fehbg`/`nitrogen` to non-Wayland sessions.\n- Probe `detected_desktop` and `detected_wm` in `fetch.rs` whenever\n  `wallpaper` or `wm-theme` is requested, and add `Umbriel`, `COSMIC`,\n  and `Mango` to compositor/DE detection.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-30T19:03:51-07:00",
          "tree_id": "8f3621e63bad1a13ea973721d556f4078ee05000",
          "url": "https://github.com/l1a/retch/commit/e0b7c5075ab577c209942f3bf94b325aec2ba1dc"
        },
        "date": 1793412729901,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 2988268.1,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 282638741,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 252391397.00000003,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 1761377.6,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch",
            "value": 3680433.5,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 349516779.5,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 205750067.39999998,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 2845521.6000000006,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "SystemInfo__collect",
            "value": 300769611.85,
            "unit": "ns"
          },
          {
            "name": "audio__parse_asound_cards",
            "value": 1000.8463370615679,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 105.33217558748422,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9482465739773294,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 49.889957782687226,
            "unit": "ns"
          },
          {
            "name": "display__parse_xrandr_displays",
            "value": 8956.003359739403,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 83102.25735516724,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_freq_range",
            "value": 5745.294496399284,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 4119.12433274974,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 71043.74511796806,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 281.2684963173829,
            "unit": "ns"
          },
          {
            "name": "network__parse_proc_net_route",
            "value": 267.8616830816312,
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
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
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
        "date": 1790965512553,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 431320629.36,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1001213669.3400003,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 971097265.8400004,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 32963268.320000004,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch",
            "value": 497212916.46,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 437096185.74,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 418557886.6399999,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 37064297.419999994,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "SystemInfo__collect",
            "value": 458361156.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 636.3136394713232,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 148.7417191162653,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.6539599098498394,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 86.02083848576136,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6076.014934503964,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1731.0544555199965,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 430.21202355141884,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 123354.30397794189,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 485.291317873687,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1dc26f7a7899d6901721819a5fdfedfcae0ed5a4",
          "message": "List macOS volumes natively; free space from statfs (#286)\n\nmacOS --short was 43-46 ms against fastfetch's 16 ms, and all of it was\nthe `disk` field (~39 ms; the --version floor is 3.7 ms). sysinfo's\nDisks asked CoreFoundation for every mount's\nkCFURLVolumeAvailableCapacityForImportantUsageKey, which costs ~9 ms\nper volume on first query.\n\nMounts now come from getfsstat(MNT_NOWAIT). The same two CFURL keys\nsysinfo filtered on, IsBrowsable and IsLocal, pick the volumes, so the\nlist is unchanged: /System/Volumes/Data carries MNT_DONTBROWSE but is\nbrowsable to CoreFoundation, so f_flags cannot stand in for it. A fresh\nstatfs sizes only the kept volumes.\n\nVisible change, macOS only (user decision): \"free\" is f_bavail, as df\nand fastfetch report it, and no longer counts purgeable space, so it\ncan read lower than Finder (315.0 GiB vs ~336 here). The man page's\n`disk` entry says so. Totals are unchanged.\n\n--short on chani (battery): 33.5 -> 7.0 ms, fastfetch 17.0. The disk\nprobe 39 -> 1.95 ms. Tests pin the selection against chani's real\n13-mount table; three mutations of the filter, all caught.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:41:45-07:00",
          "tree_id": "f10a0fceebad4d7781d2b9f62f9e1ccd6aefc7a9",
          "url": "https://github.com/l1a/retch/commit/1dc26f7a7899d6901721819a5fdfedfcae0ed5a4"
        },
        "date": 1790967153481,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 387757928.42,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 994536057.7,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1076642545.82,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 16290569.74,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch",
            "value": 276364265.82,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 613541291,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 329224166.62000006,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 9410674.24,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "SystemInfo__collect",
            "value": 350716443.675,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 410.49161653138236,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 144.41799857472077,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.5228899603733907,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 86.23270670036565,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5739.892478726602,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1528.9414756289405,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 351.8552121543457,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 99170.82765846909,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 400.8735343620946,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "49db22cc74ebea3f11599867b72d52a399cdfc08",
          "message": "Stop reporting macOS Bluetooth as Off when unknown (#287)\n\nOn macOS 26 and later IOBluetoothHCIController no longer publishes\nBluetoothControllerPowerIsOn, and get_bluetooth_state folded the\nmissing property into false, so a Mac with Bluetooth on and a keyboard\nconnected printed \"Bluetooth: Off (Apple Bluetooth)\" (chani, macOS 27).\n\nThe power state is now an Option. When it cannot be read the line\ncarries no state at all, \"Bluetooth: Apple Bluetooth\", per the rule\nthat under-reporting beats asserting something false. Known states\nprint exactly as before. \"Apple Bluetooth\" is bluetooth.rs's fallback\nwhen no chipset string exists, which answers the NOTES question of\nwhere the name came from.\n\nA real power source is still open (NOTES 6c): the preferences plist\nhas no ControllerPowerState, and system_profiler knows but costs a\nseconds-long spawn. Tests pin both branches; reverting unknown to Off\nfails them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T12:41:17-07:00",
          "tree_id": "3ec0a099872ef85d74f69c184c9a09ab9e4917ff",
          "url": "https://github.com/l1a/retch/commit/49db22cc74ebea3f11599867b72d52a399cdfc08"
        },
        "date": 1790970708072,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 452904935.3,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1029205079.9600002,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1105008781.5,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 34317438.4,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch",
            "value": 301970622.5,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 496596196.46,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 375577785.6,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 39237388.199999996,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "SystemInfo__collect",
            "value": 368590519.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 517.0269492044405,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 171.20390876208896,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9832355938006097,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 92.49838708401045,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6292.399612118498,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1638.9583796789898,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 466.35613279747287,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 116600.97649139815,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 443.3031584001931,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddc8016cedff49fcd78adaf49f6bd6b5b41987e6",
          "message": "Fix release notes after v0.20.16 (#288)\n\nCorrect NOTES.md: cargo owner --list does not authenticate the\ncrates.io token, the newest released tag is v0.20.16, and record\nthe auto-mode blocks hit during the release. Bump to 0.20.17.\n\nAssisted-By: Claude Sonnet 5.5",
          "timestamp": "2026-10-02T13:28:51-07:00",
          "tree_id": "cbeeadcd4295a30f824bf2b9c0bc725f87ce1436",
          "url": "https://github.com/l1a/retch/commit/ddc8016cedff49fcd78adaf49f6bd6b5b41987e6"
        },
        "date": 1790973575042,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 316754560.04,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 971186083.9,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 878963788.1400001,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 11397464.18,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch",
            "value": 273035030.64000005,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 316120476.00000006,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 287040484.14000005,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 6669305.78,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "SystemInfo__collect",
            "value": 239392266,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 353.64902234887074,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.41853049897483,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.698844700656131,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 62.355160587789086,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 3714.9615394989096,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 918.7941106685563,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 390.9837497593918,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 70353.72395515465,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 287.46918385719425,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51cfe8f12234bdf793372a2e8a445841d6fd69c3",
          "message": "Bump libc to 0.2.190 (consolidate #289) (#290)\n\nRolls Dependabot #289 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" specs already admit libc 0.2.190, nothing else moves, and\nthe libc lines in Cargo.lock are byte-identical to Dependabot's.\n\nlibc 0.2.190 adds Default impls for more structs, a libc_unstable_time64\ncfg (opt-in, unused here) and new constants, mostly on Apple and BSD.\nretch's own libc use (the Linux fd calls in gpu_api.rs and the sysinfo\nFFI) builds and passes clippy and the full test suite unchanged, and\nthe GPU-API fields still print on real hardware.\n\nretch-sysinfo stays at 0.1.89: a lockfile change alters nothing that\ncrate publishes.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T14:57:48-07:00",
          "tree_id": "e1f0d55f8bb50b94dde179076cd192dcf11d3783",
          "url": "https://github.com/l1a/retch/commit/51cfe8f12234bdf793372a2e8a445841d6fd69c3"
        },
        "date": 1791756438636,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 342886951.46000004,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 998240993.2400001,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 900424946.8800001,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 14579486.000000006,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch",
            "value": 319081976.56000006,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 374865818.3399999,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 355911671.58000004,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 10325373.4,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "SystemInfo__collect",
            "value": 280005973.875,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 390.2944597893221,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 114.66463063136375,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.9023537030101672,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 61.90577473051771,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4788.85858210573,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1113.5593462813872,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 371.141263530861,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 77226.72433842818,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 316.736591300399,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a",
          "message": "Name Linux GPUs from udev before pci.ids (#291)\n\nretch --short on corrino (Intel Iris Xe + NVIDIA MX550) was 8.4 ms\nagainst fastfetch's 5.8. RETCH_TIMING showed the gpu probe as the\nwhole critical path: it read and walked the 1.6 MB pci.ids once per\nGPU, ~4 ms cold for the Intel iGPU near the end of the file and ~1.5 ms\nfor the NVIDIA card, whose name the driver's /proc entry then replaced\nanyway. A faster search does not help (str::find costs the same).\n\nresolve_gpu_name now asks each source lazily, first hit wins: the\nNVIDIA driver's /proc model, amdgpu.ids (AMD), udev's resolved\nID_MODEL_FROM_DATABASE in /run/udev/data/+pci:<slot> (~300 bytes),\nthen pci.ids, then a generic vendor name. AMD names from udev or\npci.ids still go through the codename table, as before.\n\n--short on corrino: 8.42 -> 3.32 ms (fastfetch 5.81); default 9.70 ->\n5.78 ms. GPU, Vulkan, OpenGL and OpenCL lines are identical in all four\nmodes, and identical in a fedora:44 container with no /run/udev, where\nthe pci.ids fallback runs. Tests pin the order with sources that panic\nif called; five mutations were all caught.\n\nretch-sysinfo 0.1.89 -> 0.1.90, retch-cli 0.20.18 -> 0.20.19.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T15:19:14-07:00",
          "tree_id": "39483f60f40a8e71c7bcc026028d415e06ebb3a4",
          "url": "https://github.com/l1a/retch/commit/8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a"
        },
        "date": 1791757729975,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 360668724.02,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1134539036.72,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1059421231.8199998,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 13943884.200000001,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch",
            "value": 371165916.02,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 402930665.72,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 373732802.62,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 8161463.2,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "SystemInfo__collect",
            "value": 316243309.375,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 350.3482231567476,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.02653676289955,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.7068378217698368,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 63.04988672523287,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4204.7603007569105,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 986.0316562547443,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 312.9469769251715,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 65654.97569644588,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 353.7892605445886,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a7cfa0c3f0e28dae4eec94464824108211b7af7e",
          "message": "Make CLI benchmarks work under hyperfine 2.0 (#292)\n\nhyperfine 2.0.0 reached crates.io around 2026-10-10 and broke the CLI\nbenchmarks two ways, both silently.\n\nIt runs commands with no shell by default and splits them with POSIX\nrules, so a backslash is an escape. The Windows x64 runner falls back\nto an unpinned `cargo install hyperfine`, got 2.0, and turned\n.\\target\\release\\retch.exe into .targetreleaseretch.exe: the main\nbenchmark job failed with \"program not found\" on #290 and #291, so that\nsuite has no v0.20.18 or v0.20.19 point. cli_bench.py and `just\nbench-cli` now pass --shell=none explicitly (1.13+ accepts it too), so\nevery hyperfine version measures the same way, and spell the Windows\nbinary ./target/release/retch.exe. Labels key on the flags, so no\ndashboard series forks.\n\nIts JSON export is a new schema: no top-level `mean`; wall-clock time\nis summary.time_wall_clock.mean. labelled_means read only the 1.x key,\nso with hyperfine 2.0 installed locally the post-merge hook published\ntwo empty points (51cfe8f, 8d20d64) while every step reported success.\nmean_seconds now reads both schemas, and both publishers\n(parse_criterion.py, upload_local_bench.py) refuse a run missing any\nexpected series (missing_series).\n\nVerified: real runs under hyperfine 2.0.0 and 1.18.0 produce all eight\nseries; the uploader's dry run collects eight and, with the 2.x reader\nremoved, refuses. Eight mutations, each caught by its intended test.\n\nNOTES also records the arrakis GPU check, the CI dashboard read\n(Linux x64 --full behind; check fastfetch's weather first), and the\nbare-command `just merge-pr` allow rule.\n\nretch-cli 0.20.19 -> 0.20.20.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T20:51:02-07:00",
          "tree_id": "54584a1b0a27b5f07c61be671ff440acac57c4e8",
          "url": "https://github.com/l1a/retch/commit/a7cfa0c3f0e28dae4eec94464824108211b7af7e"
        },
        "date": 1791777612802,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 405221724.79999995,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1069042941.6,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1051700225.2,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 14067254.200000001,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch",
            "value": 367360824.9,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 439742504.1999999,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 360154708.4,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 7650099.900000001,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "SystemInfo__collect",
            "value": 307748612.475,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 381.93342437184646,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 107.13528904582355,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.689034244568101,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 83.37215593304259,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4092.1185539512844,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 982.7078657010013,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 322.6341783488035,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 69409.45663894262,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 338.51330499151254,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22f24a82840987adc1249ebe91bb94d71f5f0b5a",
          "message": "Install fastfetch's universal macOS archive when per-arch is gone (#295)\n\nfastfetch 2.70.0 (2026-10-14) publishes only fastfetch-macos-universal\nfor macOS; 2.69.0 published only fastfetch-macos-aarch64/-amd64. The\nbenchmark installer asked for the per-arch name, got a 404, and the\nmacOS arm64 job of Continuous Benchmarking failed on main for b363009\n(#294). It is the second time fastfetch has switched layouts.\n\nmacOS now tries the per-arch archive and falls back to the universal\none. Both keep the binary at usr/bin/fastfetch, so find_binary_dir is\nunchanged. Only a 404 moves on to the next name: a network error or a\n5xx is raised as itself rather than reported as a missing asset.\n\nVerified: a real --latest-release install on an M3 Pro 404s on aarch64,\nfalls back, and runs fastfetch 2.70.0. The self-test covers the\ncandidates and download_first against a fake release; dropping the\nfallback, or treating every HTTP error as a 404, each fail it.\n\nretch-cli 0.20.21 -> 0.20.22.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T20:59:56-07:00",
          "tree_id": "89497667f1b7375453f246d993b6fb07360b464e",
          "url": "https://github.com/l1a/retch/commit/22f24a82840987adc1249ebe91bb94d71f5f0b5a"
        },
        "date": 1792037450520,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 413614658.40000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1051224054.1,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1068844054.0999999,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 23224854.1,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch",
            "value": 372526954.1,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 415390599.9,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 385873379.2000001,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 13168287.7,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "SystemInfo__collect",
            "value": 319814309.375,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 416.9023419661245,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.74838081408095,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.020752953525837,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 65.13321843456941,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4872.487105299889,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1542.2082524296434,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 347.897667067805,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 82308.38032566421,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 320.6355455449188,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2497ba0e7d6e6bdd55adc9190745bf9ad07e1771",
          "message": "Bump toml to 1.1.8 (consolidate #293) (#296)\n\nRolls Dependabot #293 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: the\nroot crate's \"1.1\" spec already admits toml 1.1.8, and the Cargo.lock\nlines (toml, toml_datetime, toml_parser, toml_writer, serde_spanned)\nare identical to Dependabot's.\n\ntoml 1.1.7/1.1.8 fix the serializer to encode every key and remove a\nrisk of unsoundness in the parser around synthetic events. retch only\nparses (Config::load): a real config with a field list and a custom hex\ntheme applies, the --generate-config output parses back, and a\nmalformed file still reports toml's located error.\n\nretch-sysinfo stays at 0.1.91: it does not depend on toml.\n\nretch-cli 0.20.22 -> 0.20.23.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:18:06-07:00",
          "tree_id": "80a1f51cd240e5c2237904018b159281b7f183cc",
          "url": "https://github.com/l1a/retch/commit/2497ba0e7d6e6bdd55adc9190745bf9ad07e1771"
        },
        "date": 1792038489908,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 409415924.9,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1021734358.3000003,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 916410229.1,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 20686070.6,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch",
            "value": 351605141.4,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 753668791.8000001,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 366478920.7,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 12019904.100000001,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "SystemInfo__collect",
            "value": 359655228.175,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 410.09993894925975,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 128.48619703847598,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.724029562892137,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 80.29959821873277,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5425.698046192829,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1374.2820268365167,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 379.8020104935131,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 103944.58527461204,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 433.7468760226766,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792040729420,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 354016166.70000005,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 997923779.1,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1008625420.7,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 18441950.200000003,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch",
            "value": 375711475,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 558071721,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 349293458.40000004,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 9896687.400000002,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "SystemInfo__collect",
            "value": 364295181.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 376.12105216794345,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 117.28660794487732,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8456700927324932,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 66.57003372026115,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4474.1171557035905,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1078.423875554945,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 342.0999977444221,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 103032.59195551526,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 327.0513433011313,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6",
          "message": "Bump libc to 0.2.191 (consolidate #298) (#299)\n\nRolls Dependabot #298 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" spec already admits libc 0.2.191, and the Cargo.lock\nlines are identical to Dependabot's.\n\nretch-sysinfo stays at 0.1.91: a lockfile change alters nothing that\ncrate publishes.\n\nretch-cli 0.20.24 -> 0.20.25.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T08:50:41-07:00",
          "tree_id": "b47069d397a2fa415048399d8c3d37e546d8d089",
          "url": "https://github.com/l1a/retch/commit/7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6"
        },
        "date": 1792598490668,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 283324233.20000005,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 948899087.5000001,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 919667550.1000001,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 14267895.899999999,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch",
            "value": 294253370.90000004,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 351379858.20000005,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 292466987.4,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 7991312.5,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "SystemInfo__collect",
            "value": 270557842.75,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 396.4235302395107,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 122.3863614431757,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.8950340182407384,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 77.4704630688824,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 4624.036640443181,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1113.824631356872,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 339.5171643385515,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 78642.52726185981,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 380.77988112396207,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d485e1a7bed3201d40b5138243c3ea96403fb647",
          "message": "Note that syncing main publishes a benchmark (#300)\n\nThe post-merge hook fires after any merge onto main, a fast-forward\npull included, and pushes a local benchmark point to gh-pages. Record\nthat in NOTES 7.5 with the two ways to sync without publishing\n(GIT_NO_BENCH=1, or branch from origin/main), and the --no-track trap\nin the second: a branch tracking origin/main makes just open-pr skip\nits push.\n\nDocs-only. retch-cli 0.20.25 -> 0.20.26.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T09:13:07-07:00",
          "tree_id": "ee5373a58754448005eabf22e9420c2a687af91b",
          "url": "https://github.com/l1a/retch/commit/d485e1a7bed3201d40b5138243c3ea96403fb647"
        },
        "date": 1792599835582,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 409119291.5,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1125465699.8999999,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1024480262.3999997,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 32740429.1,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch",
            "value": 333937891.70000005,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 618514445.8000001,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 437270116.6,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 19099741.7,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "SystemInfo__collect",
            "value": 437359811.475,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 527.1742951803558,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 168.56913366571158,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.779254311670666,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 105.01492101836541,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6713.908707489172,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1531.7736008622412,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 445.2715302268276,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 160470.4558070426,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 476.24637440297954,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d755c1b4920cd8b578b1e3a7465dae3f96e1f883",
          "message": "Overlap temp/wm; refuse skipped weather (#301)\n\n* Overlap temp/wm; refuse skipped weather\n\n--full no longer pays temp then wm after weather\n(~21 ms). CLI benches fail if Public IP or Weather\nis missing, so Linux CI cannot win by failing fast.\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n* Handle Windows bench UTF-8 I/O\n\nDecode captured stdout as UTF-8 and print via\nconsole_safe so cp1252 cannot crash on weather emoji.\n\nAssisted-By: Composer\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>",
          "timestamp": "2026-10-23T16:02:49-07:00",
          "tree_id": "49b6c1563e755ad02c7fb5666baa89af24e01638",
          "url": "https://github.com/l1a/retch/commit/d755c1b4920cd8b578b1e3a7465dae3f96e1f883"
        },
        "date": 1792797215286,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 361150171.00000006,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1010082262.4000001,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1007488070.9000002,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 18859916.80000001,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch",
            "value": 361079508.40000004,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 493850879.20000017,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 371438787.30000013,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 10283195.700000001,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "SystemInfo__collect",
            "value": 293458036.375,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 448.95854750918,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 168.8403269011993,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.1181999521100088,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 90.98918286023388,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5705.135913476468,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1494.3308761104213,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 438.6073255504824,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 109372.8737197014,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 433.6076749662467,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b882a0d743af4260a034c8100ceb5aa927773247",
          "message": "Single-source long-form channel text (#302)\n\nUnify README.md's top overview with packaging/copr/project-description.md\nbetween <!-- BEGIN copr-description --> / <!-- END copr-description -->\nmarkers (with all three platforms' config paths and absolute https://\nlinks, since crates.io rewrites repo-relative file links to blob/HEAD/...\nwhile COPR renders on its own domain and resolves neither relative paths\nnor #anchor fragments).\n\nReplace the manual //! crate header and ReadmeDoctests struct in\ncrates/sysinfo/src/lib.rs with #![doc = include_str!(\"../README.md\")] so\ndocs.rs and crates/sysinfo/README.md are one text and its code block\nstill compiles as a doctest.\n\nEnforce both invariants in scripts/metadata_check.py (plus --sync-copr\nand negative self-tests) and watch **/README.md in packaging.yml. Update\nNOTES.md for v0.20.28 / newest tag v0.20.27 and the d755c1b benchmark\nfigures.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-27T12:20:41-07:00",
          "tree_id": "5791e4ca47e7032f5bf9df305fe27a3eeea1448f",
          "url": "https://github.com/l1a/retch/commit/b882a0d743af4260a034c8100ceb5aa927773247"
        },
        "date": 1793129495536,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 398011154.20000005,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1091621424.9,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1054762295.9,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 31218316.500000004,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch",
            "value": 295196354.1000001,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 536164537.5000001,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 422386487.70000005,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 18300879,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "SystemInfo__collect",
            "value": 366279033.325,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 480.9365170419849,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 134.92344455386404,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.290761372979295,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 82.1023617913756,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5950.794120569398,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1547.553488772477,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 413.9172745277862,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 99632.69138961041,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 435.47893605325197,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce116b5ad3e75019fb185c440d6df11db27fa6a3",
          "message": "Speed up the macOS default mode (#304)\n\nOn an M3 Pro (macOS 27.2, on AC) the default mode drops from 114-152 ms\nto 65 ms (hyperfine, 40 runs; main measured 152.3 and 114.0 ms as two\ncopies of one binary in the same sitting, this build 64.9 +/- 1.3 ms).\nOutput is unchanged in all four modes. Two causes:\n\n- phys-mem spawned `system_profiler SPMemoryDataType`, 87-147 ms and the\n  whole critical path. Apple Silicon publishes the same size and type on\n  IODeviceTree:/chosen (dram-size, dram-type), which now answers in\n  under 0.1 ms. Intel Macs, which lack them, still spawn it.\n- audio took &System and read it on no platform, yet it ran after\n  sys-init and needs_process_list counted it, so off Linux the default\n  mode loaded a process table nobody used (6.6-11.8 ms) and CoreAudio\n  started late. It now starts with the borrow-nothing probes via\n  detect_audio_devices(); detect_audio(&System) stays as a wrapper so\n  retch-sysinfo's API does not break. Windows' default mode stops\n  loading the table too (not measured: no Windows host).\n\nneeds_process_list now takes the field predicate, so a test can feed it\nthe default mode's real field set. Both new guards were watched failing\nagainst a mutation.\n\nNOTES also closes the v0.20.8 macOS --short alert (runner noise: retch\nand fastfetch spiked in the same runs) and records two open macOS items:\nno IOKit source tracks the Bluetooth radio (tested by hand), and the\nNet: lines print in a different order on every run.\n\nretch-cli 0.20.28 -> 0.20.29, retch-sysinfo 0.1.93 -> 0.1.94.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T12:49:42-07:00",
          "tree_id": "33ac12268c4fabd03f7a0ff1db01333a8eb84eeb",
          "url": "https://github.com/l1a/retch/commit/ce116b5ad3e75019fb185c440d6df11db27fa6a3"
        },
        "date": 1793217616921,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 520412749.79999995,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1239333858.4999998,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1118829766.8,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 33366578.900000006,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch",
            "value": 452075466.70000005,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 535253221.0000002,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 555716129.2,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 20343766.800000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "SystemInfo__collect",
            "value": 376535531.25,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 617.7069887697126,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 186.7328696298461,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.395543010186075,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 115.31984837500154,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6483.192837917273,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1525.6223698486924,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 577.2277462986136,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 147819.65324085706,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 585.1313303337837,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "738b5c23eaba3ffa987a35d7424322bfe355583d",
          "message": "List network interfaces in a stable order (#305)\n\nsysinfo keeps interfaces in a HashMap, whose iteration order is\nrandomised per process, and detect_networks listed them in that order.\nSo --long and --full printed the non-active Net: lines shuffled\ndifferently on every run, on every platform, and the default mode's\nfallback (the first interface that is up, used when the active one\ncannot be resolved) could print a different line each time.\n\ndetect_networks now sorts by a natural name key: the name without its\ntrailing number, that number numerically, then the full name, so en2\ncomes before en10 and utun2 before utun100. The active interface still\nleads in --long and --full. Same set of lines as before; only the order\nis now fixed.\n\nTests cover the key (including names a plain string sort gets wrong and\nWindows names with spaces) and, live, that detect_networks returns its\nlist in key order. Both were watched failing against a mutation. On\nchani three --long runs now print the same order.\n\nretch-cli 0.20.29 -> 0.20.30, retch-sysinfo 0.1.94 -> 0.1.95.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:02:55-07:00",
          "tree_id": "f1541d237236ef21be7566dd394a99ff28ab83e9",
          "url": "https://github.com/l1a/retch/commit/738b5c23eaba3ffa987a35d7424322bfe355583d"
        },
        "date": 1793218352490,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 418955637.6,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1058719670.8,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1112928816.3999999,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 31860062.499999993,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch",
            "value": 356274666.70000005,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 527848537.5000002,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 396139696,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30204600.000000004,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "SystemInfo__collect",
            "value": 376839439.575,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 601.6409277485783,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 205.51708376750102,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.1857276307853377,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 92.35454244478312,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6488.433993551813,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1681.6322229967705,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 534.3331747401458,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 129777.68564647068,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 503.30173467224256,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bc247458408bb750dc4cb5d9df33ab51bf929d3",
          "message": "Bump rusqlite to 0.41 (consolidate #303) (#306)\n\nMoves Dependabot #303 (rusqlite 0.40.2 -> 0.41) onto a gated branch, as\n#299 did for #298. Dependabot skips the version bump, the NOTES header\nand the man page regeneration.\n\nThe lockfile resolves rusqlite 0.41.1, released today after #303 was\nopened with 0.41.0. Its two fixes (PRAGMA names under SQLCipher, a\nzero-argument deterministic function panic) touch nothing retch uses;\nlibsqlite3-sys and every other package match #303 exactly.\n\nretch-sysinfo's own manifest changes, so both crates bump:\nretch-cli 0.20.30 -> 0.20.31, retch-sysinfo 0.1.95 -> 0.1.96.\n\nrusqlite bundles SQLite, so per NOTES 8 the rpmdb read was checked\nunprivileged on Fedora (arrakis): `retch --fields packages` prints\nPackages: 2471, equal to `rpm -qa | wc -l`.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:19:04-07:00",
          "tree_id": "1cc67f7daac7928dfc61879ab14019db32cef7a3",
          "url": "https://github.com/l1a/retch/commit/6bc247458408bb750dc4cb5d9df33ab51bf929d3"
        },
        "date": 1793219265257,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 426750941.8000001,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 892216637.7000002,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 923777720.7,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 31637754.100000005,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch",
            "value": 371076220.7,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 375634304.3000001,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 373301349.9,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 17419979.300000004,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "SystemInfo__collect",
            "value": 314155494.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 526.2595021486903,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.9582603675842,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.6479227468557776,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.56462437003732,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5599.422261643717,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1321.9201225526954,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 448.14063366823495,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 137207.39502911325,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 386.5090004733578,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0",
          "message": "Close Windows field parity and --short net gap (#307)\n\nRETCH_TIMING=1 on irulan (Windows 11 Pro x86_64) showed net (17.65–24.69 ms)\nand net-detail (9.88–10.69 ms) taking 89% of both --short (27.53 of 30.93 ms)\nand default mode (35.38 of 39.70 ms), because each called\nsysinfo::Networks::new_with_refreshed_list() independently. Replace both with\na single GetIfTable2 + GetUnicastIpAddressTable(AF_UNSPEC) pass (~2.5 ms) in\nwin_iftable::interfaces_with_ips(), hand the rows from\ndetect_active_interface_and_local_ip to detect_networks on the same thread,\nand cache GetAdaptersAddresses (with GAA_FLAG_SKIP_UNICAST) in a OnceLock\nwarmed concurrently for dns/domain/domain-search.\n\nOn irulan (AC), collect-done drops 30.93 -> 5.39 ms (--short) and\n39.70 -> 7.09 ms (default); hyperfine (--shell=none vs fastfetch 2.70.0)\nmeasures --short 27.8 vs 49.5 ms (1.8x), default 30.9 vs 501.3 ms (16.2x),\n--long 152.5 vs 2044.6 ms (13.4x), and --full 544.3 vs 3362.0 ms (6.2x).\n\nAlso implement the 6 remaining Windows fields natively (no PowerShell):\n- keyboard and mouse via SetupAPI GUID_DEVCLASS_KEYBOARD / GUID_DEVCLASS_MOUSE,\n  preferring DEVPKEY_Device_BusReportedDeviceDesc when non-generic\n- brightness via \\\\.\\LCD IOCTL_VIDEO_QUERY_DISPLAY_BRIGHTNESS\n- power-adapter via GetSystemPowerStatus\n- login-manager via LogonUI.exe's VS_FIXEDFILEINFO product version (version.dll)\n- tpm via Tbsi_GetDeviceInfo (tbs.dll)\nplus Windows Terminal terminal-font (settings.json) and standalone\n--fields terminal-font / terminal-theme process-tree detection.\n\nFinally, subtract retch's own and child-process CPU time from Windows\ncpu-usage via an anonymous Win32 Job Object + GetProcessTimes, and sanitize ':'\nin scripts/bench_meta.py's self-test temp directory names on Windows NTFS.\n\nretch-cli 0.20.31 -> 0.20.32, retch-sysinfo 0.1.96 -> 0.1.97.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T11:36:31-07:00",
          "tree_id": "ef9988b328033dbc532eebfbd93269bc2f7fc134",
          "url": "https://github.com/l1a/retch/commit/ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0"
        },
        "date": 1793386393941,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 442423108.40000004,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1118881641.7999997,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1088941879.2,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 27195624.900000002,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch",
            "value": 359948716.7,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 411832729.1,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 378203508.6,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 14568995.600000001,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "SystemInfo__collect",
            "value": 233546753.075,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 514.6255116724253,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 147.52151721286717,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.560402120633511,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 93.15048146349022,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 7437.7131156726045,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1682.4107636416443,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 467.1641014355487,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 130165.19779813677,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 447.5446089658535,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54a7a9960827f9bb307b8831b6acb08cad9f717b",
          "message": "Add Windows CPU cache, freq range, and hybrid cores (#308)\n\nImplement native Windows CPU cache size detection (`cpu-cache`), base and\nboost frequency range detection (`cpu-freq`), hybrid P/E core topology\ndetection (`cpu`), and x86 CPUID brand trimming:\n\n- `crates/sysinfo/src/memory.rs`: Cache `read_smbios_table()` in a\n  `OnceLock` (`cached_smbios_table()`) so `phys-mem` (Type 17) and\n  `cpu-freq` (Type 4) share a single `GetSystemFirmwareTable('RSMB')`\n  call, and add `parse_smbios_type4_speeds()` to read `CurrentSpeed`\n  (base MHz) and `MaxSpeed` (boost MHz) from populated processor sockets.\n- `crates/sysinfo/src/fetch.rs`:\n  - Implement Windows `detect_cpu_cache()` via\n    `GetLogicalProcessorInformationEx(RelationCache, ...)` and share\n    `format_cpu_cache_entries()` with Linux.\n  - Implement Windows `detect_cpu_freq_range()` combining SMBIOS Type 4\n    speeds and per-core `CallNtPowerInformation(ProcessorInformation)`\n    `MaxMhz` values.\n  - Implement Windows `hybrid_cores()` via\n    `GetLogicalProcessorInformationEx(RelationProcessorCore, ...)`,\n    grouping logical processor bitmask popcounts by `EfficiencyClass`.\n  - Trim x86 `CPUID` brand strings in `cpu_brand()` so padded 48-byte\n    strings do not render extra spaces before `(8C / 16T)`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T12:43:34-07:00",
          "tree_id": "cae0fcbe3459e5c24023fe4fc0903cd7768e8923",
          "url": "https://github.com/l1a/retch/commit/54a7a9960827f9bb307b8831b6acb08cad9f717b"
        },
        "date": 1793390171517,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 430048995.90000004,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 993408962.5,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 946024424.8000001,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 25569624.9,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch",
            "value": 331996950.1,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 489851954.20000005,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 458403187.6000001,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 18940729.100000005,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "SystemInfo__collect",
            "value": 312719845.8,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 533.590253296842,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 154.27882702413012,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.445338563814457,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 84.3500471646751,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 7176.724428365543,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1663.3357618381008,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 432.1115698645235,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 110532.79306246073,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 424.4644194418678,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b1b47a194a52b307dd78675ddf64541b85ebf315",
          "message": "Fix Intel cache unit and V4L2 IPU6 camera list (#309)\n\n- Fix `format_cpu_cache_entries` in `crates/sysinfo/src/fetch.rs` where\n  fractional MiB cache sizes (`kb >= 1024 && !kb.is_multiple_of(1024)`)\n  formatted `\"{:.2}M\"` before `.trim_end_matches('0')` and then appended\n  `+ \"M\"`, producing `\"1.25MM\"` on Intel Golden Cove / Raptor Cove / Lion\n  Cove P-cores (`1280` KB = 1.25 MiB).\n- Filter V4L2 ISP DMA capture queues (`Intel IPU6 ISYS Capture 0..31`),\n  CSI-2 receivers (`Intel IPU6 CSI2 0..3`), and MEI CSI bridges\n  (`Intel IVSC CSI`, `ipu3-*`) in `is_real_camera()`, expand V4L2 I2C\n  sensor names (`\"<model> <bus>-<4-hex-addr>\"`) to `\"<Vendor> <MODEL>\"`\n  (`\"ov01a10 17-0036\"` -> `\"OmniVision OV01A10\"`), append panel location\n  (`(Front)` / `(Back)`) from `device/physical_location/panel`, and sort\n  `/sys/class/video4linux` entries deterministically in `detect_camera()`.\n- Bump `retch-cli` to 0.20.34 and `retch-sysinfo` to 0.1.99, regenerate\n  `docs/retch.1`, and update `NOTES.md`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T15:25:27-07:00",
          "tree_id": "a63fa52ea6b34f624b0d7923d943b798ebaf5301",
          "url": "https://github.com/l1a/retch/commit/b1b47a194a52b307dd78675ddf64541b85ebf315"
        },
        "date": 1793399844352,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 376260679.2,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1042024616.8000002,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1037985470.8000003,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 28630841.700000003,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch",
            "value": 334737383.50000006,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 414507299.9000001,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 399186362.5,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 18252345.7,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "SystemInfo__collect",
            "value": 320179345.825,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 713.4450547960109,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 193.70589635945666,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.634487421152374,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 97.81872228004215,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 6655.331167490568,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1852.0678246036914,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 385.6858773353937,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 115060.92004933611,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 476.46014263345415,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e0b7c5075ab577c209942f3bf94b325aec2ba1dc",
          "message": "Detect Linux DE and daemon wallpapers dynamically (#310)\n\n- Remove the unconditional Step 9 GNOME `gsettings` fallback and `niri`\n  GNOME routing in `crates/sysinfo/src/theme.rs` so non-GNOME desktops\n  never report GNOME's stale wallpaper.\n- Add single-pass `/proc` wallpaper daemon detection (`noctalia`,\n  `swww-daemon`/`awww-daemon`, `swaybg`/`wbg`/`mpvpaper`, `hyprpaper`,\n  `wpaperd`) and pure parsers for Noctalia's `settings.toml`, `swww`\n  cache files, `/proc/<pid>/cmdline`, COSMIC, `wpaperd`, LXQt, and LXDE.\n- Filter multi-monitor state files (`noctalia`, `swww`/`awww`,\n  `wpaperd`) by connected DRM outputs (`/sys/class/drm/card*-*/status`)\n  and deduplicate wallpaper paths in monitor order.\n- Respect `org.gnome.desktop.interface color-scheme` (`prefer-dark`) on\n  GNOME/Budgie/Unity/Mutter and scope `sway/config` to Sway and\n  `.fehbg`/`nitrogen` to non-Wayland sessions.\n- Probe `detected_desktop` and `detected_wm` in `fetch.rs` whenever\n  `wallpaper` or `wm-theme` is requested, and add `Umbriel`, `COSMIC`,\n  and `Mango` to compositor/DE detection.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-30T19:03:51-07:00",
          "tree_id": "8f3621e63bad1a13ea973721d556f4078ee05000",
          "url": "https://github.com/l1a/retch/commit/e0b7c5075ab577c209942f3bf94b325aec2ba1dc"
        },
        "date": 1793412730233,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 381637579.1000001,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 1007962379.3999999,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 899868762.7,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 19470391.600000005,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch",
            "value": 364718570.79999995,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 465659337.5999999,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 359696175.1,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 11642508.6,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "SystemInfo__collect",
            "value": 362419729.2,
            "unit": "ns"
          },
          {
            "name": "camera__parse_macos_camera",
            "value": 506.1494222427982,
            "unit": "ns"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 121.94802195484083,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 1.979446896074125,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 68.20504220267472,
            "unit": "ns"
          },
          {
            "name": "fetch__detect_cpu_cache",
            "value": 5111.9716715106315,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1162.1368583709834,
            "unit": "ns"
          },
          {
            "name": "gamepad__parse_macos_gamepad",
            "value": 357.39400798844486,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 84739.36293699758,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 342.2101983473708,
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
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
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
        "date": 1790965514282,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 33365868.000000007,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2339558040.0000005,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1307662282.0000002,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 27004172,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch",
            "value": 33112558,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 396163340.00000006,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 155299462,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 28452232,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 210.58083341777495,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.365848581645961,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 118.65500634712328,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 100.4301525707525,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42009.56511152622,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 507.601429430916,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 915.1066017546893,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 400034625,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1dc26f7a7899d6901721819a5fdfedfcae0ed5a4",
          "message": "List macOS volumes natively; free space from statfs (#286)\n\nmacOS --short was 43-46 ms against fastfetch's 16 ms, and all of it was\nthe `disk` field (~39 ms; the --version floor is 3.7 ms). sysinfo's\nDisks asked CoreFoundation for every mount's\nkCFURLVolumeAvailableCapacityForImportantUsageKey, which costs ~9 ms\nper volume on first query.\n\nMounts now come from getfsstat(MNT_NOWAIT). The same two CFURL keys\nsysinfo filtered on, IsBrowsable and IsLocal, pick the volumes, so the\nlist is unchanged: /System/Volumes/Data carries MNT_DONTBROWSE but is\nbrowsable to CoreFoundation, so f_flags cannot stand in for it. A fresh\nstatfs sizes only the kept volumes.\n\nVisible change, macOS only (user decision): \"free\" is f_bavail, as df\nand fastfetch report it, and no longer counts purgeable space, so it\ncan read lower than Finder (315.0 GiB vs ~336 here). The man page's\n`disk` entry says so. Totals are unchanged.\n\n--short on chani (battery): 33.5 -> 7.0 ms, fastfetch 17.0. The disk\nprobe 39 -> 1.95 ms. Tests pin the selection against chani's real\n13-mount table; three mutations of the filter, all caught.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:41:45-07:00",
          "tree_id": "f10a0fceebad4d7781d2b9f62f9e1ccd6aefc7a9",
          "url": "https://github.com/l1a/retch/commit/1dc26f7a7899d6901721819a5fdfedfcae0ed5a4"
        },
        "date": 1790967153770,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 35614602,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2352959334.0000005,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1307725256.0000002,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 26623996,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch",
            "value": 33859152,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 401282164.00000006,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 146820636,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30397716,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 241.90970807325508,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.403425006980003,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 117.46174241683616,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 102.0088219527436,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46298.62088704669,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 527.5977598118322,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 831.6146169129676,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 383661250,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "49db22cc74ebea3f11599867b72d52a399cdfc08",
          "message": "Stop reporting macOS Bluetooth as Off when unknown (#287)\n\nOn macOS 26 and later IOBluetoothHCIController no longer publishes\nBluetoothControllerPowerIsOn, and get_bluetooth_state folded the\nmissing property into false, so a Mac with Bluetooth on and a keyboard\nconnected printed \"Bluetooth: Off (Apple Bluetooth)\" (chani, macOS 27).\n\nThe power state is now an Option. When it cannot be read the line\ncarries no state at all, \"Bluetooth: Apple Bluetooth\", per the rule\nthat under-reporting beats asserting something false. Known states\nprint exactly as before. \"Apple Bluetooth\" is bluetooth.rs's fallback\nwhen no chipset string exists, which answers the NOTES question of\nwhere the name came from.\n\nA real power source is still open (NOTES 6c): the preferences plist\nhas no ControllerPowerState, and system_profiler knows but costs a\nseconds-long spawn. Tests pin both branches; reverting unknown to Off\nfails them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T12:41:17-07:00",
          "tree_id": "3ec0a099872ef85d74f69c184c9a09ab9e4917ff",
          "url": "https://github.com/l1a/retch/commit/49db22cc74ebea3f11599867b72d52a399cdfc08"
        },
        "date": 1790970709075,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 33141160.000000004,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2352918560,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1306450702,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 24177910,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch",
            "value": 31106110,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 279739690.00000006,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 133542391.99999999,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 27050710,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 230.0689352209909,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.479082640937421,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 125.56170192678796,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.65487430134041,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42965.91353634718,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 571.2177399941592,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 894.7729667904748,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 248664252.5,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddc8016cedff49fcd78adaf49f6bd6b5b41987e6",
          "message": "Fix release notes after v0.20.16 (#288)\n\nCorrect NOTES.md: cargo owner --list does not authenticate the\ncrates.io token, the newest released tag is v0.20.16, and record\nthe auto-mode blocks hit during the release. Bump to 0.20.17.\n\nAssisted-By: Claude Sonnet 5.5",
          "timestamp": "2026-10-02T13:28:51-07:00",
          "tree_id": "cbeeadcd4295a30f824bf2b9c0bc725f87ce1436",
          "url": "https://github.com/l1a/retch/commit/ddc8016cedff49fcd78adaf49f6bd6b5b41987e6"
        },
        "date": 1790973575328,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 36333316.00000001,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2353078592,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1309115074,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 29941904,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch",
            "value": 33512966.000000004,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 333922732.00000006,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 174313703.99999997,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 32158644,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 217.68047331952644,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.594559625875773,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 132.16423998010816,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.59735874740201,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 43875.379786657504,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 605.4517445806406,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 794.575099965858,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 302614410,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a7cfa0c3f0e28dae4eec94464824108211b7af7e",
          "message": "Make CLI benchmarks work under hyperfine 2.0 (#292)\n\nhyperfine 2.0.0 reached crates.io around 2026-10-10 and broke the CLI\nbenchmarks two ways, both silently.\n\nIt runs commands with no shell by default and splits them with POSIX\nrules, so a backslash is an escape. The Windows x64 runner falls back\nto an unpinned `cargo install hyperfine`, got 2.0, and turned\n.\\target\\release\\retch.exe into .targetreleaseretch.exe: the main\nbenchmark job failed with \"program not found\" on #290 and #291, so that\nsuite has no v0.20.18 or v0.20.19 point. cli_bench.py and `just\nbench-cli` now pass --shell=none explicitly (1.13+ accepts it too), so\nevery hyperfine version measures the same way, and spell the Windows\nbinary ./target/release/retch.exe. Labels key on the flags, so no\ndashboard series forks.\n\nIts JSON export is a new schema: no top-level `mean`; wall-clock time\nis summary.time_wall_clock.mean. labelled_means read only the 1.x key,\nso with hyperfine 2.0 installed locally the post-merge hook published\ntwo empty points (51cfe8f, 8d20d64) while every step reported success.\nmean_seconds now reads both schemas, and both publishers\n(parse_criterion.py, upload_local_bench.py) refuse a run missing any\nexpected series (missing_series).\n\nVerified: real runs under hyperfine 2.0.0 and 1.18.0 produce all eight\nseries; the uploader's dry run collects eight and, with the 2.x reader\nremoved, refuses. Eight mutations, each caught by its intended test.\n\nNOTES also records the arrakis GPU check, the CI dashboard read\n(Linux x64 --full behind; check fastfetch's weather first), and the\nbare-command `just merge-pr` allow rule.\n\nretch-cli 0.20.19 -> 0.20.20.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T20:51:02-07:00",
          "tree_id": "54584a1b0a27b5f07c61be671ff440acac57c4e8",
          "url": "https://github.com/l1a/retch/commit/a7cfa0c3f0e28dae4eec94464824108211b7af7e"
        },
        "date": 1791777613104,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31585580.000000004,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2377461940.0000005,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1304358600,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21463660.000000004,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch",
            "value": 27926080.000000004,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 312374690,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 177477940.00000003,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 23620920.000000004,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 143.08009148648262,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.675740486874686,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 81.45880022317867,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 62.941996391534566,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 33768.370980005755,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 316.8576810301001,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 728.9173051531998,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 284929410,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b3630093a37b1ea5560ceb0b3eafb610d10c7f05",
          "message": "Show macOS battery on AC as not charging (#294)\n\nA Mac on AC that is holding its charge (macOS's 80% limit, Optimized\nBattery Charging) reports IsCharging = No and FullyCharged = No, and\nretch printed it as \"discharging\". fastfetch says \"AC Connected\" on the\nsame machine.\n\nRead AppleSmartBattery's ExternalConnected as well. On AC with the\nbattery neither charging nor full the state is now Unknown, which\nalready renders \"not charging\" (Linux's sysfs \"Not charging\"). Without\nthe property the old answer is kept. The decision is a pure function,\nmac_battery_state, compiled under cfg(test) on every platform so CI\ntests it everywhere.\n\nBumps retch-cli to 0.20.21 and retch-sysinfo to 0.1.91.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T19:28:14-07:00",
          "tree_id": "4cdecaed7e6a172bf9d6d524f302b9b8b4c5418b",
          "url": "https://github.com/l1a/retch/commit/b3630093a37b1ea5560ceb0b3eafb610d10c7f05"
        },
        "date": 1792031920961,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 25213330,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2344984780,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1293625270.0000002,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 17491620,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch",
            "value": 29567390.000000007,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 325600620,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 223196980,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 25397230,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 244.40225951129315,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.421428018906888,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 118.18153793904324,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 103.50801867407385,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45160.15631902516,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 543.8916820879818,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 974.8418058008089,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 313469785,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22f24a82840987adc1249ebe91bb94d71f5f0b5a",
          "message": "Install fastfetch's universal macOS archive when per-arch is gone (#295)\n\nfastfetch 2.70.0 (2026-10-14) publishes only fastfetch-macos-universal\nfor macOS; 2.69.0 published only fastfetch-macos-aarch64/-amd64. The\nbenchmark installer asked for the per-arch name, got a 404, and the\nmacOS arm64 job of Continuous Benchmarking failed on main for b363009\n(#294). It is the second time fastfetch has switched layouts.\n\nmacOS now tries the per-arch archive and falls back to the universal\none. Both keep the binary at usr/bin/fastfetch, so find_binary_dir is\nunchanged. Only a 404 moves on to the next name: a network error or a\n5xx is raised as itself rather than reported as a missing asset.\n\nVerified: a real --latest-release install on an M3 Pro 404s on aarch64,\nfalls back, and runs fastfetch 2.70.0. The self-test covers the\ncandidates and download_first against a fake release; dropping the\nfallback, or treating every HTTP error as a 404, each fail it.\n\nretch-cli 0.20.21 -> 0.20.22.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T20:59:56-07:00",
          "tree_id": "89497667f1b7375453f246d993b6fb07360b464e",
          "url": "https://github.com/l1a/retch/commit/22f24a82840987adc1249ebe91bb94d71f5f0b5a"
        },
        "date": 1792037450828,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 25151560,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2336679040.0000005,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1301387630,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 18123960,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch",
            "value": 29889590.000000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 282088060,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 228653270.00000006,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 26251400,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 213.61621043638144,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.340709697796923,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.3957710318306,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 93.15847926839191,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42881.95183137375,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 522.6038248948196,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 786.5439503531938,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 248323350,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2497ba0e7d6e6bdd55adc9190745bf9ad07e1771",
          "message": "Bump toml to 1.1.8 (consolidate #293) (#296)\n\nRolls Dependabot #293 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: the\nroot crate's \"1.1\" spec already admits toml 1.1.8, and the Cargo.lock\nlines (toml, toml_datetime, toml_parser, toml_writer, serde_spanned)\nare identical to Dependabot's.\n\ntoml 1.1.7/1.1.8 fix the serializer to encode every key and remove a\nrisk of unsoundness in the parser around synthetic events. retch only\nparses (Config::load): a real config with a field list and a custom hex\ntheme applies, the --generate-config output parses back, and a\nmalformed file still reports toml's located error.\n\nretch-sysinfo stays at 0.1.91: it does not depend on toml.\n\nretch-cli 0.20.22 -> 0.20.23.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:18:06-07:00",
          "tree_id": "80a1f51cd240e5c2237904018b159281b7f183cc",
          "url": "https://github.com/l1a/retch/commit/2497ba0e7d6e6bdd55adc9190745bf9ad07e1771"
        },
        "date": 1792038490107,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 25833300.000000004,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2343455070,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1295606560,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 18444530,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch",
            "value": 29754830,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 337491620,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 206942339.99999997,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 27050900,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 191.7742643293557,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 4.454113771124801,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 106.19368732140163,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 80.24309849612897,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42121.48795026149,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 472.15696564697174,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 746.173398661225,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 302157135,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792040729728,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 28496960.000000004,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2338722450,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1294551000,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21086110,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch",
            "value": 34565120.00000001,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 333719039.99999994,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 255122420.00000006,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 31018109.999999996,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 228.8238072503046,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.38294700929876,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 128.27311858154147,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.702941525304,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 42860.209425908964,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 549.1492794935664,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 878.3026317446258,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 279331242.5,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6",
          "message": "Bump libc to 0.2.191 (consolidate #298) (#299)\n\nRolls Dependabot #298 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" spec already admits libc 0.2.191, and the Cargo.lock\nlines are identical to Dependabot's.\n\nretch-sysinfo stays at 0.1.91: a lockfile change alters nothing that\ncrate publishes.\n\nretch-cli 0.20.24 -> 0.20.25.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T08:50:41-07:00",
          "tree_id": "b47069d397a2fa415048399d8c3d37e546d8d089",
          "url": "https://github.com/l1a/retch/commit/7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6"
        },
        "date": 1792598490875,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 29058890.000000004,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2335885500,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1299868080,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 20336550,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch",
            "value": 32567330,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 418757250.00000006,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 240472640.00000003,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 29709229.999999996,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 224.76332951735225,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 7.337735417284664,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 134.42171982173903,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 94.20577910415344,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 44305.91227304611,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 550.9561379418907,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 780.9806206989667,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 368139397.5,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d485e1a7bed3201d40b5138243c3ea96403fb647",
          "message": "Note that syncing main publishes a benchmark (#300)\n\nThe post-merge hook fires after any merge onto main, a fast-forward\npull included, and pushes a local benchmark point to gh-pages. Record\nthat in NOTES 7.5 with the two ways to sync without publishing\n(GIT_NO_BENCH=1, or branch from origin/main), and the --no-track trap\nin the second: a branch tracking origin/main makes just open-pr skip\nits push.\n\nDocs-only. retch-cli 0.20.25 -> 0.20.26.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T09:13:07-07:00",
          "tree_id": "ee5373a58754448005eabf22e9420c2a687af91b",
          "url": "https://github.com/l1a/retch/commit/d485e1a7bed3201d40b5138243c3ea96403fb647"
        },
        "date": 1792599836736,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 29666180.000000004,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2344123490.0000005,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1306388960,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 19984340.000000007,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch",
            "value": 33595959.99999999,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 340675380,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 231668320.00000003,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30946230,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 259.1518916228009,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 6.269848465257219,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 135.7072568411476,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 97.80325324361182,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41862.29413661414,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 519.0679951745243,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 956.8137350084587,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 305887905,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d755c1b4920cd8b578b1e3a7465dae3f96e1f883",
          "message": "Overlap temp/wm; refuse skipped weather (#301)\n\n* Overlap temp/wm; refuse skipped weather\n\n--full no longer pays temp then wm after weather\n(~21 ms). CLI benches fail if Public IP or Weather\nis missing, so Linux CI cannot win by failing fast.\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n* Handle Windows bench UTF-8 I/O\n\nDecode captured stdout as UTF-8 and print via\nconsole_safe so cp1252 cannot crash on weather emoji.\n\nAssisted-By: Composer\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>",
          "timestamp": "2026-10-23T16:02:49-07:00",
          "tree_id": "49b6c1563e755ad02c7fb5666baa89af24e01638",
          "url": "https://github.com/l1a/retch/commit/d755c1b4920cd8b578b1e3a7465dae3f96e1f883"
        },
        "date": 1792797215532,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 32379590,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2338880160.0000005,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1294309530,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 24172950,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch",
            "value": 38356320,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 422939840,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 279091070.00000006,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 34668420.00000001,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 219.64008743816368,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.583144508471171,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 122.54702344360325,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 98.29683496182687,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 40029.62533283642,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 548.4974759211395,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 879.5943018787899,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 394103095,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b882a0d743af4260a034c8100ceb5aa927773247",
          "message": "Single-source long-form channel text (#302)\n\nUnify README.md's top overview with packaging/copr/project-description.md\nbetween <!-- BEGIN copr-description --> / <!-- END copr-description -->\nmarkers (with all three platforms' config paths and absolute https://\nlinks, since crates.io rewrites repo-relative file links to blob/HEAD/...\nwhile COPR renders on its own domain and resolves neither relative paths\nnor #anchor fragments).\n\nReplace the manual //! crate header and ReadmeDoctests struct in\ncrates/sysinfo/src/lib.rs with #![doc = include_str!(\"../README.md\")] so\ndocs.rs and crates/sysinfo/README.md are one text and its code block\nstill compiles as a doctest.\n\nEnforce both invariants in scripts/metadata_check.py (plus --sync-copr\nand negative self-tests) and watch **/README.md in packaging.yml. Update\nNOTES.md for v0.20.28 / newest tag v0.20.27 and the d755c1b benchmark\nfigures.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-27T12:20:41-07:00",
          "tree_id": "5791e4ca47e7032f5bf9df305fe27a3eeea1448f",
          "url": "https://github.com/l1a/retch/commit/b882a0d743af4260a034c8100ceb5aa927773247"
        },
        "date": 1793129495783,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 25876890.000000004,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2336738999.999999,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1293963660,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 17457760.000000004,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch",
            "value": 28418780.000000004,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 327833380.00000006,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 222941500,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 24532410,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 210.38684258168388,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.684416660119618,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 119.34126079418346,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 96.08506223376013,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 40459.98857534901,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 500.1881564021668,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 786.1785294937932,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 307153542.5,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce116b5ad3e75019fb185c440d6df11db27fa6a3",
          "message": "Speed up the macOS default mode (#304)\n\nOn an M3 Pro (macOS 27.2, on AC) the default mode drops from 114-152 ms\nto 65 ms (hyperfine, 40 runs; main measured 152.3 and 114.0 ms as two\ncopies of one binary in the same sitting, this build 64.9 +/- 1.3 ms).\nOutput is unchanged in all four modes. Two causes:\n\n- phys-mem spawned `system_profiler SPMemoryDataType`, 87-147 ms and the\n  whole critical path. Apple Silicon publishes the same size and type on\n  IODeviceTree:/chosen (dram-size, dram-type), which now answers in\n  under 0.1 ms. Intel Macs, which lack them, still spawn it.\n- audio took &System and read it on no platform, yet it ran after\n  sys-init and needs_process_list counted it, so off Linux the default\n  mode loaded a process table nobody used (6.6-11.8 ms) and CoreAudio\n  started late. It now starts with the borrow-nothing probes via\n  detect_audio_devices(); detect_audio(&System) stays as a wrapper so\n  retch-sysinfo's API does not break. Windows' default mode stops\n  loading the table too (not measured: no Windows host).\n\nneeds_process_list now takes the field predicate, so a test can feed it\nthe default mode's real field set. Both new guards were watched failing\nagainst a mutation.\n\nNOTES also closes the v0.20.8 macOS --short alert (runner noise: retch\nand fastfetch spiked in the same runs) and records two open macOS items:\nno IOKit source tracks the Bluetooth radio (tested by hand), and the\nNet: lines print in a different order on every run.\n\nretch-cli 0.20.28 -> 0.20.29, retch-sysinfo 0.1.93 -> 0.1.94.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T12:49:42-07:00",
          "tree_id": "33ac12268c4fabd03f7a0ff1db01333a8eb84eeb",
          "url": "https://github.com/l1a/retch/commit/ce116b5ad3e75019fb185c440d6df11db27fa6a3"
        },
        "date": 1793217617234,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 24375290,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2339772000,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1298033130,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 17493810.000000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch",
            "value": 27886350.000000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 440667130,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 226526950,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 25706440.000000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 215.1065564351975,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.35351513838115,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 120.91600710087451,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 92.19794554814723,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 39951.92003023189,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 534.7108138656938,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 890.878738192562,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 373447355,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "738b5c23eaba3ffa987a35d7424322bfe355583d",
          "message": "List network interfaces in a stable order (#305)\n\nsysinfo keeps interfaces in a HashMap, whose iteration order is\nrandomised per process, and detect_networks listed them in that order.\nSo --long and --full printed the non-active Net: lines shuffled\ndifferently on every run, on every platform, and the default mode's\nfallback (the first interface that is up, used when the active one\ncannot be resolved) could print a different line each time.\n\ndetect_networks now sorts by a natural name key: the name without its\ntrailing number, that number numerically, then the full name, so en2\ncomes before en10 and utun2 before utun100. The active interface still\nleads in --long and --full. Same set of lines as before; only the order\nis now fixed.\n\nTests cover the key (including names a plain string sort gets wrong and\nWindows names with spaces) and, live, that detect_networks returns its\nlist in key order. Both were watched failing against a mutation. On\nchani three --long runs now print the same order.\n\nretch-cli 0.20.29 -> 0.20.30, retch-sysinfo 0.1.94 -> 0.1.95.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:02:55-07:00",
          "tree_id": "f1541d237236ef21be7566dd394a99ff28ab83e9",
          "url": "https://github.com/l1a/retch/commit/738b5c23eaba3ffa987a35d7424322bfe355583d"
        },
        "date": 1793218352825,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31294630.000000004,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2468024459.9999995,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1296198900,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 14830030,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch",
            "value": 27072360,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 320744350,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 230582240.00000003,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 24090330,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 171.4205924080831,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.8852254430896984,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 91.32737506759347,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 72.53898723399378,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 30949.441381675988,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 396.71889082985734,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 610.8548792562378,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 294800080,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bc247458408bb750dc4cb5d9df33ab51bf929d3",
          "message": "Bump rusqlite to 0.41 (consolidate #303) (#306)\n\nMoves Dependabot #303 (rusqlite 0.40.2 -> 0.41) onto a gated branch, as\n#299 did for #298. Dependabot skips the version bump, the NOTES header\nand the man page regeneration.\n\nThe lockfile resolves rusqlite 0.41.1, released today after #303 was\nopened with 0.41.0. Its two fixes (PRAGMA names under SQLCipher, a\nzero-argument deterministic function panic) touch nothing retch uses;\nlibsqlite3-sys and every other package match #303 exactly.\n\nretch-sysinfo's own manifest changes, so both crates bump:\nretch-cli 0.20.30 -> 0.20.31, retch-sysinfo 0.1.95 -> 0.1.96.\n\nrusqlite bundles SQLite, so per NOTES 8 the rpmdb read was checked\nunprivileged on Fedora (arrakis): `retch --fields packages` prints\nPackages: 2471, equal to `rpm -qa | wc -l`.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:19:04-07:00",
          "tree_id": "1cc67f7daac7928dfc61879ab14019db32cef7a3",
          "url": "https://github.com/l1a/retch/commit/6bc247458408bb750dc4cb5d9df33ab51bf929d3"
        },
        "date": 1793219265584,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31563540.000000007,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2377523340,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1290772150,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 12331120.000000002,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch",
            "value": 22476780,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 317825100,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 161025139.99999997,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 19955030.000000004,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 129.39340899361693,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.5754329940811744,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 75.4326126777805,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 54.049158417357695,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 29121.857071168244,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 294.903475588025,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 468.2437543551717,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 316137850,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0",
          "message": "Close Windows field parity and --short net gap (#307)\n\nRETCH_TIMING=1 on irulan (Windows 11 Pro x86_64) showed net (17.65–24.69 ms)\nand net-detail (9.88–10.69 ms) taking 89% of both --short (27.53 of 30.93 ms)\nand default mode (35.38 of 39.70 ms), because each called\nsysinfo::Networks::new_with_refreshed_list() independently. Replace both with\na single GetIfTable2 + GetUnicastIpAddressTable(AF_UNSPEC) pass (~2.5 ms) in\nwin_iftable::interfaces_with_ips(), hand the rows from\ndetect_active_interface_and_local_ip to detect_networks on the same thread,\nand cache GetAdaptersAddresses (with GAA_FLAG_SKIP_UNICAST) in a OnceLock\nwarmed concurrently for dns/domain/domain-search.\n\nOn irulan (AC), collect-done drops 30.93 -> 5.39 ms (--short) and\n39.70 -> 7.09 ms (default); hyperfine (--shell=none vs fastfetch 2.70.0)\nmeasures --short 27.8 vs 49.5 ms (1.8x), default 30.9 vs 501.3 ms (16.2x),\n--long 152.5 vs 2044.6 ms (13.4x), and --full 544.3 vs 3362.0 ms (6.2x).\n\nAlso implement the 6 remaining Windows fields natively (no PowerShell):\n- keyboard and mouse via SetupAPI GUID_DEVCLASS_KEYBOARD / GUID_DEVCLASS_MOUSE,\n  preferring DEVPKEY_Device_BusReportedDeviceDesc when non-generic\n- brightness via \\\\.\\LCD IOCTL_VIDEO_QUERY_DISPLAY_BRIGHTNESS\n- power-adapter via GetSystemPowerStatus\n- login-manager via LogonUI.exe's VS_FIXEDFILEINFO product version (version.dll)\n- tpm via Tbsi_GetDeviceInfo (tbs.dll)\nplus Windows Terminal terminal-font (settings.json) and standalone\n--fields terminal-font / terminal-theme process-tree detection.\n\nFinally, subtract retch's own and child-process CPU time from Windows\ncpu-usage via an anonymous Win32 Job Object + GetProcessTimes, and sanitize ':'\nin scripts/bench_meta.py's self-test temp directory names on Windows NTFS.\n\nretch-cli 0.20.31 -> 0.20.32, retch-sysinfo 0.1.96 -> 0.1.97.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T11:36:31-07:00",
          "tree_id": "ef9988b328033dbc532eebfbd93269bc2f7fc134",
          "url": "https://github.com/l1a/retch/commit/ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0"
        },
        "date": 1793386394257,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 25383390.000000007,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2342140580,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1294713419.9999998,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 17536550,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch",
            "value": 22356130,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 359276660,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 220719050.00000003,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 19652390.000000004,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 223.81825328710642,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.369134465525311,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 118.55957737562467,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 100.81160190707395,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41174.61876835205,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 510.7838450680747,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 795.4226705047776,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 340487435,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54a7a9960827f9bb307b8831b6acb08cad9f717b",
          "message": "Add Windows CPU cache, freq range, and hybrid cores (#308)\n\nImplement native Windows CPU cache size detection (`cpu-cache`), base and\nboost frequency range detection (`cpu-freq`), hybrid P/E core topology\ndetection (`cpu`), and x86 CPUID brand trimming:\n\n- `crates/sysinfo/src/memory.rs`: Cache `read_smbios_table()` in a\n  `OnceLock` (`cached_smbios_table()`) so `phys-mem` (Type 17) and\n  `cpu-freq` (Type 4) share a single `GetSystemFirmwareTable('RSMB')`\n  call, and add `parse_smbios_type4_speeds()` to read `CurrentSpeed`\n  (base MHz) and `MaxSpeed` (boost MHz) from populated processor sockets.\n- `crates/sysinfo/src/fetch.rs`:\n  - Implement Windows `detect_cpu_cache()` via\n    `GetLogicalProcessorInformationEx(RelationCache, ...)` and share\n    `format_cpu_cache_entries()` with Linux.\n  - Implement Windows `detect_cpu_freq_range()` combining SMBIOS Type 4\n    speeds and per-core `CallNtPowerInformation(ProcessorInformation)`\n    `MaxMhz` values.\n  - Implement Windows `hybrid_cores()` via\n    `GetLogicalProcessorInformationEx(RelationProcessorCore, ...)`,\n    grouping logical processor bitmask popcounts by `EfficiencyClass`.\n  - Trim x86 `CPUID` brand strings in `cpu_brand()` so padded 48-byte\n    strings do not render extra spaces before `(8C / 16T)`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T12:43:34-07:00",
          "tree_id": "cae0fcbe3459e5c24023fe4fc0903cd7768e8923",
          "url": "https://github.com/l1a/retch/commit/54a7a9960827f9bb307b8831b6acb08cad9f717b"
        },
        "date": 1793390171735,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 26832070.000000004,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2340579820,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1296301270.0000002,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 18620389.999999996,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch",
            "value": 23515010.000000004,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 399620900.00000006,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 223414130.00000003,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 20146100.000000004,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 221.30935299428228,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.4924214585053495,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 123.66823159683754,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1348.071447633535,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 41412.46614036018,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 530.8076493881306,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 813.7277748546346,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 375648205,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b1b47a194a52b307dd78675ddf64541b85ebf315",
          "message": "Fix Intel cache unit and V4L2 IPU6 camera list (#309)\n\n- Fix `format_cpu_cache_entries` in `crates/sysinfo/src/fetch.rs` where\n  fractional MiB cache sizes (`kb >= 1024 && !kb.is_multiple_of(1024)`)\n  formatted `\"{:.2}M\"` before `.trim_end_matches('0')` and then appended\n  `+ \"M\"`, producing `\"1.25MM\"` on Intel Golden Cove / Raptor Cove / Lion\n  Cove P-cores (`1280` KB = 1.25 MiB).\n- Filter V4L2 ISP DMA capture queues (`Intel IPU6 ISYS Capture 0..31`),\n  CSI-2 receivers (`Intel IPU6 CSI2 0..3`), and MEI CSI bridges\n  (`Intel IVSC CSI`, `ipu3-*`) in `is_real_camera()`, expand V4L2 I2C\n  sensor names (`\"<model> <bus>-<4-hex-addr>\"`) to `\"<Vendor> <MODEL>\"`\n  (`\"ov01a10 17-0036\"` -> `\"OmniVision OV01A10\"`), append panel location\n  (`(Front)` / `(Back)`) from `device/physical_location/panel`, and sort\n  `/sys/class/video4linux` entries deterministically in `detect_camera()`.\n- Bump `retch-cli` to 0.20.34 and `retch-sysinfo` to 0.1.99, regenerate\n  `docs/retch.1`, and update `NOTES.md`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T15:25:27-07:00",
          "tree_id": "a63fa52ea6b34f624b0d7923d943b798ebaf5301",
          "url": "https://github.com/l1a/retch/commit/b1b47a194a52b307dd78675ddf64541b85ebf315"
        },
        "date": 1793399844676,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 24331090,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2345986080.0000005,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1294784859.9999998,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 18621460,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch",
            "value": 21667390,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 279538040.0000001,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 217181950,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 19164060,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 215.63182137357904,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 5.376300001023537,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 115.91205636469974,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1430.3054477474334,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 49564.92952702987,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 526.5822373141564,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 785.311217909633,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 275245800,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e0b7c5075ab577c209942f3bf94b325aec2ba1dc",
          "message": "Detect Linux DE and daemon wallpapers dynamically (#310)\n\n- Remove the unconditional Step 9 GNOME `gsettings` fallback and `niri`\n  GNOME routing in `crates/sysinfo/src/theme.rs` so non-GNOME desktops\n  never report GNOME's stale wallpaper.\n- Add single-pass `/proc` wallpaper daemon detection (`noctalia`,\n  `swww-daemon`/`awww-daemon`, `swaybg`/`wbg`/`mpvpaper`, `hyprpaper`,\n  `wpaperd`) and pure parsers for Noctalia's `settings.toml`, `swww`\n  cache files, `/proc/<pid>/cmdline`, COSMIC, `wpaperd`, LXQt, and LXDE.\n- Filter multi-monitor state files (`noctalia`, `swww`/`awww`,\n  `wpaperd`) by connected DRM outputs (`/sys/class/drm/card*-*/status`)\n  and deduplicate wallpaper paths in monitor order.\n- Respect `org.gnome.desktop.interface color-scheme` (`prefer-dark`) on\n  GNOME/Budgie/Unity/Mutter and scope `sway/config` to Sway and\n  `.fehbg`/`nitrogen` to non-Wayland sessions.\n- Probe `detected_desktop` and `detected_wm` in `fetch.rs` whenever\n  `wallpaper` or `wm-theme` is requested, and add `Umbriel`, `COSMIC`,\n  and `Mango` to compositor/DE detection.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-30T19:03:51-07:00",
          "tree_id": "8f3621e63bad1a13ea973721d556f4078ee05000",
          "url": "https://github.com/l1a/retch/commit/e0b7c5075ab577c209942f3bf94b325aec2ba1dc"
        },
        "date": 1793412730557,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31401369.999999996,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2357651309.9999995,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1298589080,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 15562840,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch",
            "value": 18987910.000000004,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 314475370.00000006,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 165633970,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 17872450,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 130.53842144152975,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 3.2506263477146726,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 73.80117185601213,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 747.9356005130545,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 26934.807634605655,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 284.51965553865836,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 506.6579283030495,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 288147370,
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
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
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
        "date": 1790965514577,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 56392292,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2405945032,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1327646636,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 42217244,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch",
            "value": 46386932,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 331290372,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 149940056.00000003,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 43728753.99999999,
            "unit": "ns",
            "extra": "v0.20.14"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 171.4518449305745,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9501183392996553,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.76240870725067,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 74.29108543857588,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47920.59289465864,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 424.35573102766375,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 685.222081706723,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 273992190,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1dc26f7a7899d6901721819a5fdfedfcae0ed5a4",
          "message": "List macOS volumes natively; free space from statfs (#286)\n\nmacOS --short was 43-46 ms against fastfetch's 16 ms, and all of it was\nthe `disk` field (~39 ms; the --version floor is 3.7 ms). sysinfo's\nDisks asked CoreFoundation for every mount's\nkCFURLVolumeAvailableCapacityForImportantUsageKey, which costs ~9 ms\nper volume on first query.\n\nMounts now come from getfsstat(MNT_NOWAIT). The same two CFURL keys\nsysinfo filtered on, IsBrowsable and IsLocal, pick the volumes, so the\nlist is unchanged: /System/Volumes/Data carries MNT_DONTBROWSE but is\nbrowsable to CoreFoundation, so f_flags cannot stand in for it. A fresh\nstatfs sizes only the kept volumes.\n\nVisible change, macOS only (user decision): \"free\" is f_bavail, as df\nand fastfetch report it, and no longer counts purgeable space, so it\ncan read lower than Finder (315.0 GiB vs ~336 here). The man page's\n`disk` entry says so. Totals are unchanged.\n\n--short on chani (battery): 33.5 -> 7.0 ms, fastfetch 17.0. The disk\nprobe 39 -> 1.95 ms. Tests pin the selection against chani's real\n13-mount table; three mutations of the filter, all caught.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T11:41:45-07:00",
          "tree_id": "f10a0fceebad4d7781d2b9f62f9e1ccd6aefc7a9",
          "url": "https://github.com/l1a/retch/commit/1dc26f7a7899d6901721819a5fdfedfcae0ed5a4"
        },
        "date": 1790967154061,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 45417938.00000001,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2396055880.0000005,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1319750434.0000005,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 44625752.00000001,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch",
            "value": 36537808.00000001,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 356686699.99999994,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 194296574.00000003,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36672402.00000001,
            "unit": "ns",
            "extra": "v0.20.15"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 171.73722530623553,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9474439986797623,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.50306455843176,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 74.01337234201269,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46717.85953016883,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 419.7469785171359,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 679.124664207504,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 309716135,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "49db22cc74ebea3f11599867b72d52a399cdfc08",
          "message": "Stop reporting macOS Bluetooth as Off when unknown (#287)\n\nOn macOS 26 and later IOBluetoothHCIController no longer publishes\nBluetoothControllerPowerIsOn, and get_bluetooth_state folded the\nmissing property into false, so a Mac with Bluetooth on and a keyboard\nconnected printed \"Bluetooth: Off (Apple Bluetooth)\" (chani, macOS 27).\n\nThe power state is now an Option. When it cannot be read the line\ncarries no state at all, \"Bluetooth: Apple Bluetooth\", per the rule\nthat under-reporting beats asserting something false. Known states\nprint exactly as before. \"Apple Bluetooth\" is bluetooth.rs's fallback\nwhen no chipset string exists, which answers the NOTES question of\nwhere the name came from.\n\nA real power source is still open (NOTES 6c): the preferences plist\nhas no ControllerPowerState, and system_profiler knows but costs a\nseconds-long spawn. Tests pin both branches; reverting unknown to Off\nfails them.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-02T12:41:17-07:00",
          "tree_id": "3ec0a099872ef85d74f69c184c9a09ab9e4917ff",
          "url": "https://github.com/l1a/retch/commit/49db22cc74ebea3f11599867b72d52a399cdfc08"
        },
        "date": 1790970709454,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 54912318,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2401969774,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1332182384,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 37919912,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch",
            "value": 40026297.99999999,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 338656384.00000006,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 180240624.00000003,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 37771902.00000001,
            "unit": "ns",
            "extra": "v0.20.16"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 171.72981830522926,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949180160517311,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.47617645981681,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 73.99847751129161,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 50095.05482512001,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 419.09558544787177,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 672.8499515553916,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 289764290,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ddc8016cedff49fcd78adaf49f6bd6b5b41987e6",
          "message": "Fix release notes after v0.20.16 (#288)\n\nCorrect NOTES.md: cargo owner --list does not authenticate the\ncrates.io token, the newest released tag is v0.20.16, and record\nthe auto-mode blocks hit during the release. Bump to 0.20.17.\n\nAssisted-By: Claude Sonnet 5.5",
          "timestamp": "2026-10-02T13:28:51-07:00",
          "tree_id": "cbeeadcd4295a30f824bf2b9c0bc725f87ce1436",
          "url": "https://github.com/l1a/retch/commit/ddc8016cedff49fcd78adaf49f6bd6b5b41987e6"
        },
        "date": 1790973575628,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 56556488,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2395766755.9999995,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1342533124,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 36597778,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch",
            "value": 37233398.00000001,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 336918496,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 170972574.00000003,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 37924728,
            "unit": "ns",
            "extra": "v0.20.17"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 172.09902016591755,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9649614466094283,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.47052069604337,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 74.10670380802891,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45888.92334296609,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 421.00175045985515,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 689.0586069586377,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 297635640,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51cfe8f12234bdf793372a2e8a445841d6fd69c3",
          "message": "Bump libc to 0.2.190 (consolidate #289) (#290)\n\nRolls Dependabot #289 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" specs already admit libc 0.2.190, nothing else moves, and\nthe libc lines in Cargo.lock are byte-identical to Dependabot's.\n\nlibc 0.2.190 adds Default impls for more structs, a libc_unstable_time64\ncfg (opt-in, unused here) and new constants, mostly on Apple and BSD.\nretch's own libc use (the Linux fd calls in gpu_api.rs and the sysinfo\nFFI) builds and passes clippy and the full test suite unchanged, and\nthe GPU-API fields still print on real hardware.\n\nretch-sysinfo stays at 0.1.89: a lockfile change alters nothing that\ncrate publishes.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T14:57:48-07:00",
          "tree_id": "e1f0d55f8bb50b94dde179076cd192dcf11d3783",
          "url": "https://github.com/l1a/retch/commit/51cfe8f12234bdf793372a2e8a445841d6fd69c3"
        },
        "date": 1791756438987,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 54626496.00000001,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2394003322,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1322263865.9999998,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 37932292.00000002,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch",
            "value": 42547586.00000001,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 368765162.00000006,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 179935115.99999997,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 39491342.000000015,
            "unit": "ns",
            "extra": "v0.20.18"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 173.66195488563957,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94719380836261,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.12226460183388,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 76.0223103182364,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46171.99256515036,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 428.8945078783924,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 701.9679596614563,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 315761040,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a",
          "message": "Name Linux GPUs from udev before pci.ids (#291)\n\nretch --short on corrino (Intel Iris Xe + NVIDIA MX550) was 8.4 ms\nagainst fastfetch's 5.8. RETCH_TIMING showed the gpu probe as the\nwhole critical path: it read and walked the 1.6 MB pci.ids once per\nGPU, ~4 ms cold for the Intel iGPU near the end of the file and ~1.5 ms\nfor the NVIDIA card, whose name the driver's /proc entry then replaced\nanyway. A faster search does not help (str::find costs the same).\n\nresolve_gpu_name now asks each source lazily, first hit wins: the\nNVIDIA driver's /proc model, amdgpu.ids (AMD), udev's resolved\nID_MODEL_FROM_DATABASE in /run/udev/data/+pci:<slot> (~300 bytes),\nthen pci.ids, then a generic vendor name. AMD names from udev or\npci.ids still go through the codename table, as before.\n\n--short on corrino: 8.42 -> 3.32 ms (fastfetch 5.81); default 9.70 ->\n5.78 ms. GPU, Vulkan, OpenGL and OpenCL lines are identical in all four\nmodes, and identical in a fedora:44 container with no /run/udev, where\nthe pci.ids fallback runs. Tests pin the order with sources that panic\nif called; five mutations were all caught.\n\nretch-sysinfo 0.1.89 -> 0.1.90, retch-cli 0.20.18 -> 0.20.19.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T15:19:14-07:00",
          "tree_id": "39483f60f40a8e71c7bcc026028d415e06ebb3a4",
          "url": "https://github.com/l1a/retch/commit/8d20d6430d32b6f0e7bdb9f5a80881a6bcc2d70a"
        },
        "date": 1791757730330,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 55697908,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2409508854,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1327048678.0000002,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 35126422.000000015,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch",
            "value": 38976568,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 367187253.99999994,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 171924698,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 35882032.000000015,
            "unit": "ns",
            "extra": "v0.20.19"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 173.53792300258314,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947464382509813,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.90406053841058,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.51013681178763,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48276.148938253566,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 442.15100225487174,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 694.1923546376946,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 322975585,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a7cfa0c3f0e28dae4eec94464824108211b7af7e",
          "message": "Make CLI benchmarks work under hyperfine 2.0 (#292)\n\nhyperfine 2.0.0 reached crates.io around 2026-10-10 and broke the CLI\nbenchmarks two ways, both silently.\n\nIt runs commands with no shell by default and splits them with POSIX\nrules, so a backslash is an escape. The Windows x64 runner falls back\nto an unpinned `cargo install hyperfine`, got 2.0, and turned\n.\\target\\release\\retch.exe into .targetreleaseretch.exe: the main\nbenchmark job failed with \"program not found\" on #290 and #291, so that\nsuite has no v0.20.18 or v0.20.19 point. cli_bench.py and `just\nbench-cli` now pass --shell=none explicitly (1.13+ accepts it too), so\nevery hyperfine version measures the same way, and spell the Windows\nbinary ./target/release/retch.exe. Labels key on the flags, so no\ndashboard series forks.\n\nIts JSON export is a new schema: no top-level `mean`; wall-clock time\nis summary.time_wall_clock.mean. labelled_means read only the 1.x key,\nso with hyperfine 2.0 installed locally the post-merge hook published\ntwo empty points (51cfe8f, 8d20d64) while every step reported success.\nmean_seconds now reads both schemas, and both publishers\n(parse_criterion.py, upload_local_bench.py) refuse a run missing any\nexpected series (missing_series).\n\nVerified: real runs under hyperfine 2.0.0 and 1.18.0 produce all eight\nseries; the uploader's dry run collects eight and, with the 2.x reader\nremoved, refuses. Eight mutations, each caught by its intended test.\n\nNOTES also records the arrakis GPU check, the CI dashboard read\n(Linux x64 --full behind; check fastfetch's weather first), and the\nbare-command `just merge-pr` allow rule.\n\nretch-cli 0.20.19 -> 0.20.20.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-11T20:51:02-07:00",
          "tree_id": "54584a1b0a27b5f07c61be671ff440acac57c4e8",
          "url": "https://github.com/l1a/retch/commit/a7cfa0c3f0e28dae4eec94464824108211b7af7e"
        },
        "date": 1791777613420,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 47320470,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2384668589.9999995,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1319945069.9999998,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 28958880.000000004,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch",
            "value": 31921140,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 331389550.00000006,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 214998640,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30010200.000000004,
            "unit": "ns",
            "extra": "v0.20.20"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.0621469486896,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9912160529633405,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.05810434653627,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.5151249529605,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47301.08296064654,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 445.97019547463407,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 705.1767908540199,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 286881565,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b3630093a37b1ea5560ceb0b3eafb610d10c7f05",
          "message": "Show macOS battery on AC as not charging (#294)\n\nA Mac on AC that is holding its charge (macOS's 80% limit, Optimized\nBattery Charging) reports IsCharging = No and FullyCharged = No, and\nretch printed it as \"discharging\". fastfetch says \"AC Connected\" on the\nsame machine.\n\nRead AppleSmartBattery's ExternalConnected as well. On AC with the\nbattery neither charging nor full the state is now Unknown, which\nalready renders \"not charging\" (Linux's sysfs \"Not charging\"). Without\nthe property the old answer is kept. The decision is a pure function,\nmac_battery_state, compiled under cfg(test) on every platform so CI\ntests it everywhere.\n\nBumps retch-cli to 0.20.21 and retch-sysinfo to 0.1.91.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T19:28:14-07:00",
          "tree_id": "4cdecaed7e6a172bf9d6d524f302b9b8b4c5418b",
          "url": "https://github.com/l1a/retch/commit/b3630093a37b1ea5560ceb0b3eafb610d10c7f05"
        },
        "date": 1792031921265,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 47380670,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2394405840,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1314887990,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 26702910.000000004,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch",
            "value": 37458020,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 441355590,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 240393940,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36026080,
            "unit": "ns",
            "extra": "v0.20.21"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 177.3234344692995,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.948273885675859,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.96526414507865,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.4271901765164,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46047.96227950327,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 439.0430849876292,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 699.5272020511048,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 389336290,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22f24a82840987adc1249ebe91bb94d71f5f0b5a",
          "message": "Install fastfetch's universal macOS archive when per-arch is gone (#295)\n\nfastfetch 2.70.0 (2026-10-14) publishes only fastfetch-macos-universal\nfor macOS; 2.69.0 published only fastfetch-macos-aarch64/-amd64. The\nbenchmark installer asked for the per-arch name, got a 404, and the\nmacOS arm64 job of Continuous Benchmarking failed on main for b363009\n(#294). It is the second time fastfetch has switched layouts.\n\nmacOS now tries the per-arch archive and falls back to the universal\none. Both keep the binary at usr/bin/fastfetch, so find_binary_dir is\nunchanged. Only a 404 moves on to the next name: a network error or a\n5xx is raised as itself rather than reported as a missing asset.\n\nVerified: a real --latest-release install on an M3 Pro 404s on aarch64,\nfalls back, and runs fastfetch 2.70.0. The self-test covers the\ncandidates and download_first against a fake release; dropping the\nfallback, or treating every HTTP error as a 404, each fail it.\n\nretch-cli 0.20.21 -> 0.20.22.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T20:59:56-07:00",
          "tree_id": "89497667f1b7375453f246d993b6fb07360b464e",
          "url": "https://github.com/l1a/retch/commit/22f24a82840987adc1249ebe91bb94d71f5f0b5a"
        },
        "date": 1792037451130,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 37942540.00000001,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2378345810,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1324280220,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21720290,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch",
            "value": 33199239.999999996,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 386790100,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 221659770.00000003,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30332530.000000004,
            "unit": "ns",
            "extra": "v0.20.22"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 173.73477951331085,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.94799218509426,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.09275963780084,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.33036563656863,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 49109.1246874168,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 440.47637455404765,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 703.577793422198,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 345074890,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2497ba0e7d6e6bdd55adc9190745bf9ad07e1771",
          "message": "Bump toml to 1.1.8 (consolidate #293) (#296)\n\nRolls Dependabot #293 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: the\nroot crate's \"1.1\" spec already admits toml 1.1.8, and the Cargo.lock\nlines (toml, toml_datetime, toml_parser, toml_writer, serde_spanned)\nare identical to Dependabot's.\n\ntoml 1.1.7/1.1.8 fix the serializer to encode every key and remove a\nrisk of unsoundness in the parser around synthetic events. retch only\nparses (Config::load): a real config with a field list and a custom hex\ntheme applies, the --generate-config output parses back, and a\nmalformed file still reports toml's located error.\n\nretch-sysinfo stays at 0.1.91: it does not depend on toml.\n\nretch-cli 0.20.22 -> 0.20.23.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:18:06-07:00",
          "tree_id": "80a1f51cd240e5c2237904018b159281b7f183cc",
          "url": "https://github.com/l1a/retch/commit/2497ba0e7d6e6bdd55adc9190745bf9ad07e1771"
        },
        "date": 1792038490304,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 39475190,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2380445390,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1313421740,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 22059200,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch",
            "value": 33178520.000000004,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 332831020.00000006,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 240774890.00000003,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30310010.000000004,
            "unit": "ns",
            "extra": "v0.20.23"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.9899807742424,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.950999384431534,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.04368970475164,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.51981403246481,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45228.00924986597,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 427.9653020963348,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 694.1319220299035,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 294455735,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c8f788c68be3548b15ce4475f37417d630f2311c",
          "message": "Record release notes after v0.20.23 (#297)\n\nNOTES.md: the newest released tag is v0.20.23, and three things the\nrelease ran into:\n\n- just aur-publish needs podman and an AUR SSH key on one host, and\n  none had both. chani has the key, gimli has podman; v0.20.23 went out\n  by running aur-render on gimli and the recipe's push steps on chani.\n- COPR's results URL now redirects to packages.redhat.com, so reading\n  a chroot's repodata needs curl -L.\n- zsh treats an unquoted =0.20.23 as a command lookup, which breaks\n  cargo install --version =X.\n\nretch-cli 0.20.23 -> 0.20.24.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-14T21:54:16-07:00",
          "tree_id": "f64169d3afb7082f9361bf45d4209abdab4e3c94",
          "url": "https://github.com/l1a/retch/commit/c8f788c68be3548b15ce4475f37417d630f2311c"
        },
        "date": 1792040730039,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 34559130.00000001,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2381995660.0000005,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1312042890,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 20971790,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch",
            "value": 32104599.999999996,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 336060290.00000006,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 213364110.00000006,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30696070.000000004,
            "unit": "ns",
            "extra": "v0.20.24"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 176.06532761985568,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9539156700364084,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.2462057055704,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.56246037250064,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 45625.790751365406,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 433.08389711559414,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 707.2712060438495,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 293342320,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6",
          "message": "Bump libc to 0.2.191 (consolidate #298) (#299)\n\nRolls Dependabot #298 onto a gated branch so the version bump, NOTES\nheader and man-page regeneration it skips are done. Lockfile-only: both\ncrates' \"0.2\" spec already admits libc 0.2.191, and the Cargo.lock\nlines are identical to Dependabot's.\n\nretch-sysinfo stays at 0.1.91: a lockfile change alters nothing that\ncrate publishes.\n\nretch-cli 0.20.24 -> 0.20.25.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T08:50:41-07:00",
          "tree_id": "b47069d397a2fa415048399d8c3d37e546d8d089",
          "url": "https://github.com/l1a/retch/commit/7b8fe2e624819a680db2e0a9d53e3c2ff5cf92a6"
        },
        "date": 1792598491082,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 47224820,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2387100650.0000005,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1316237050.0000002,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 27387810.000000004,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch",
            "value": 40177000,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 316313870,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 253865159.99999997,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 36886200,
            "unit": "ns",
            "extra": "v0.20.25"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.25792431987887,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9501145587364013,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.09485031459526,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.42802839265995,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47496.3519156818,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 439.45651005216496,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 716.7164861751799,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 277657020,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d485e1a7bed3201d40b5138243c3ea96403fb647",
          "message": "Note that syncing main publishes a benchmark (#300)\n\nThe post-merge hook fires after any merge onto main, a fast-forward\npull included, and pushes a local benchmark point to gh-pages. Record\nthat in NOTES 7.5 with the two ways to sync without publishing\n(GIT_NO_BENCH=1, or branch from origin/main), and the --no-track trap\nin the second: a branch tracking origin/main makes just open-pr skip\nits push.\n\nDocs-only. retch-cli 0.20.25 -> 0.20.26.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-21T09:13:07-07:00",
          "tree_id": "ee5373a58754448005eabf22e9420c2a687af91b",
          "url": "https://github.com/l1a/retch/commit/d485e1a7bed3201d40b5138243c3ea96403fb647"
        },
        "date": 1792599836947,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 47326639.99999999,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2617167750,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1319519240,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 25629130,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch",
            "value": 37547800.00000001,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 331376100.00000006,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 244580699.99999997,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 35800500,
            "unit": "ns",
            "extra": "v0.20.26"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 173.84658597926597,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.953937699151644,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.04615748418372,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 78.46664853561474,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48035.807620026535,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 439.6693509772423,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 709.0428725826852,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 275405220,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d755c1b4920cd8b578b1e3a7465dae3f96e1f883",
          "message": "Overlap temp/wm; refuse skipped weather (#301)\n\n* Overlap temp/wm; refuse skipped weather\n\n--full no longer pays temp then wm after weather\n(~21 ms). CLI benches fail if Public IP or Weather\nis missing, so Linux CI cannot win by failing fast.\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n* Handle Windows bench UTF-8 I/O\n\nDecode captured stdout as UTF-8 and print via\nconsole_safe so cp1252 cannot crash on weather emoji.\n\nAssisted-By: Composer\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Ken Tobias <l1a@users.noreply.github.com>\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>",
          "timestamp": "2026-10-23T16:02:49-07:00",
          "tree_id": "49b6c1563e755ad02c7fb5666baa89af24e01638",
          "url": "https://github.com/l1a/retch/commit/d755c1b4920cd8b578b1e3a7465dae3f96e1f883"
        },
        "date": 1792797215769,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 42697959.99999999,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2391696490,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1311209000,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 23837950,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch",
            "value": 35765320,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 433785420.00000006,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 227326610.00000003,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 30436619.999999996,
            "unit": "ns",
            "extra": "v0.20.27"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 181.35060483940705,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9481441312268446,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.20406119034459,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 76.21898888675216,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46765.52351104739,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 439.65732167124077,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 679.2315419586506,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 298064315,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b882a0d743af4260a034c8100ceb5aa927773247",
          "message": "Single-source long-form channel text (#302)\n\nUnify README.md's top overview with packaging/copr/project-description.md\nbetween <!-- BEGIN copr-description --> / <!-- END copr-description -->\nmarkers (with all three platforms' config paths and absolute https://\nlinks, since crates.io rewrites repo-relative file links to blob/HEAD/...\nwhile COPR renders on its own domain and resolves neither relative paths\nnor #anchor fragments).\n\nReplace the manual //! crate header and ReadmeDoctests struct in\ncrates/sysinfo/src/lib.rs with #![doc = include_str!(\"../README.md\")] so\ndocs.rs and crates/sysinfo/README.md are one text and its code block\nstill compiles as a doctest.\n\nEnforce both invariants in scripts/metadata_check.py (plus --sync-copr\nand negative self-tests) and watch **/README.md in packaging.yml. Update\nNOTES.md for v0.20.28 / newest tag v0.20.27 and the d755c1b benchmark\nfigures.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-27T12:20:41-07:00",
          "tree_id": "5791e4ca47e7032f5bf9df305fe27a3eeea1448f",
          "url": "https://github.com/l1a/retch/commit/b882a0d743af4260a034c8100ceb5aa927773247"
        },
        "date": 1793129496035,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 47023970,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2391685330,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1313597180,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 25324460,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch",
            "value": 37145260,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 386139440.0000001,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 236997780,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 35726300,
            "unit": "ns",
            "extra": "v0.20.28"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.00551033329285,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9582255081146434,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.55380809718304,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 76.35860966561366,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46321.10607138909,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 432.9803366713103,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 682.0973692641071,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 328470740,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce116b5ad3e75019fb185c440d6df11db27fa6a3",
          "message": "Speed up the macOS default mode (#304)\n\nOn an M3 Pro (macOS 27.2, on AC) the default mode drops from 114-152 ms\nto 65 ms (hyperfine, 40 runs; main measured 152.3 and 114.0 ms as two\ncopies of one binary in the same sitting, this build 64.9 +/- 1.3 ms).\nOutput is unchanged in all four modes. Two causes:\n\n- phys-mem spawned `system_profiler SPMemoryDataType`, 87-147 ms and the\n  whole critical path. Apple Silicon publishes the same size and type on\n  IODeviceTree:/chosen (dram-size, dram-type), which now answers in\n  under 0.1 ms. Intel Macs, which lack them, still spawn it.\n- audio took &System and read it on no platform, yet it ran after\n  sys-init and needs_process_list counted it, so off Linux the default\n  mode loaded a process table nobody used (6.6-11.8 ms) and CoreAudio\n  started late. It now starts with the borrow-nothing probes via\n  detect_audio_devices(); detect_audio(&System) stays as a wrapper so\n  retch-sysinfo's API does not break. Windows' default mode stops\n  loading the table too (not measured: no Windows host).\n\nneeds_process_list now takes the field predicate, so a test can feed it\nthe default mode's real field set. Both new guards were watched failing\nagainst a mutation.\n\nNOTES also closes the v0.20.8 macOS --short alert (runner noise: retch\nand fastfetch spiked in the same runs) and records two open macOS items:\nno IOKit source tracks the Bluetooth radio (tested by hand), and the\nNet: lines print in a different order on every run.\n\nretch-cli 0.20.28 -> 0.20.29, retch-sysinfo 0.1.93 -> 0.1.94.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T12:49:42-07:00",
          "tree_id": "33ac12268c4fabd03f7a0ff1db01333a8eb84eeb",
          "url": "https://github.com/l1a/retch/commit/ce116b5ad3e75019fb185c440d6df11db27fa6a3"
        },
        "date": 1793217617541,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 46797240.00000001,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2384288410,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1309179229.9999998,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 24358430.000000004,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch",
            "value": 36353750.00000001,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 377362880.00000006,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 234646720.00000006,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 37480610.00000001,
            "unit": "ns",
            "extra": "v0.20.29"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 172.4445327520585,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949727519775672,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 92.26789529422663,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 76.67519094393688,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46464.646063425906,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 422.4884029154796,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 689.7964196322557,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 332938655,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "738b5c23eaba3ffa987a35d7424322bfe355583d",
          "message": "List network interfaces in a stable order (#305)\n\nsysinfo keeps interfaces in a HashMap, whose iteration order is\nrandomised per process, and detect_networks listed them in that order.\nSo --long and --full printed the non-active Net: lines shuffled\ndifferently on every run, on every platform, and the default mode's\nfallback (the first interface that is up, used when the active one\ncannot be resolved) could print a different line each time.\n\ndetect_networks now sorts by a natural name key: the name without its\ntrailing number, that number numerically, then the full name, so en2\ncomes before en10 and utun2 before utun100. The active interface still\nleads in --long and --full. Same set of lines as before; only the order\nis now fixed.\n\nTests cover the key (including names a plain string sort gets wrong and\nWindows names with spaces) and, live, that detect_networks returns its\nlist in key order. Both were watched failing against a mutation. On\nchani three --long runs now print the same order.\n\nretch-cli 0.20.29 -> 0.20.30, retch-sysinfo 0.1.94 -> 0.1.95.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:02:55-07:00",
          "tree_id": "f1541d237236ef21be7566dd394a99ff28ab83e9",
          "url": "https://github.com/l1a/retch/commit/738b5c23eaba3ffa987a35d7424322bfe355583d"
        },
        "date": 1793218353149,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31549900.000000007,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2387559360,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1309664550.0000002,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21360780.000000004,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch",
            "value": 30980949.999999996,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 336751590.00000006,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 215926940.00000003,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 29353150.000000004,
            "unit": "ns",
            "extra": "v0.20.30"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 176.6395097020963,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.958891111972556,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.96215923489531,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.97227087031008,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46606.03521582793,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 442.9179005762844,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 704.7027460205501,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 296242335,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bc247458408bb750dc4cb5d9df33ab51bf929d3",
          "message": "Bump rusqlite to 0.41 (consolidate #303) (#306)\n\nMoves Dependabot #303 (rusqlite 0.40.2 -> 0.41) onto a gated branch, as\n#299 did for #298. Dependabot skips the version bump, the NOTES header\nand the man page regeneration.\n\nThe lockfile resolves rusqlite 0.41.1, released today after #303 was\nopened with 0.41.0. Its two fixes (PRAGMA names under SQLCipher, a\nzero-argument deterministic function panic) touch nothing retch uses;\nlibsqlite3-sys and every other package match #303 exactly.\n\nretch-sysinfo's own manifest changes, so both crates bump:\nretch-cli 0.20.30 -> 0.20.31, retch-sysinfo 0.1.95 -> 0.1.96.\n\nrusqlite bundles SQLite, so per NOTES 8 the rpmdb read was checked\nunprivileged on Fedora (arrakis): `retch --fields packages` prints\nPackages: 2471, equal to `rpm -qa | wc -l`.\n\nAssisted-By: Claude Opus 5.5",
          "timestamp": "2026-10-28T13:19:04-07:00",
          "tree_id": "1cc67f7daac7928dfc61879ab14019db32cef7a3",
          "url": "https://github.com/l1a/retch/commit/6bc247458408bb750dc4cb5d9df33ab51bf929d3"
        },
        "date": 1793219265916,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31552379.999999996,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2394002940,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1307420420.0000002,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 20719410,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch",
            "value": 31786080,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 366838280.00000006,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 212723080,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 28835469.999999996,
            "unit": "ns",
            "extra": "v0.20.31"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.8469938693416,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.949112622621306,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 94.84710423794186,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.83189865976776,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 49496.739586218166,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 437.22898553078005,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 681.5220543122701,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 319635995,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0",
          "message": "Close Windows field parity and --short net gap (#307)\n\nRETCH_TIMING=1 on irulan (Windows 11 Pro x86_64) showed net (17.65–24.69 ms)\nand net-detail (9.88–10.69 ms) taking 89% of both --short (27.53 of 30.93 ms)\nand default mode (35.38 of 39.70 ms), because each called\nsysinfo::Networks::new_with_refreshed_list() independently. Replace both with\na single GetIfTable2 + GetUnicastIpAddressTable(AF_UNSPEC) pass (~2.5 ms) in\nwin_iftable::interfaces_with_ips(), hand the rows from\ndetect_active_interface_and_local_ip to detect_networks on the same thread,\nand cache GetAdaptersAddresses (with GAA_FLAG_SKIP_UNICAST) in a OnceLock\nwarmed concurrently for dns/domain/domain-search.\n\nOn irulan (AC), collect-done drops 30.93 -> 5.39 ms (--short) and\n39.70 -> 7.09 ms (default); hyperfine (--shell=none vs fastfetch 2.70.0)\nmeasures --short 27.8 vs 49.5 ms (1.8x), default 30.9 vs 501.3 ms (16.2x),\n--long 152.5 vs 2044.6 ms (13.4x), and --full 544.3 vs 3362.0 ms (6.2x).\n\nAlso implement the 6 remaining Windows fields natively (no PowerShell):\n- keyboard and mouse via SetupAPI GUID_DEVCLASS_KEYBOARD / GUID_DEVCLASS_MOUSE,\n  preferring DEVPKEY_Device_BusReportedDeviceDesc when non-generic\n- brightness via \\\\.\\LCD IOCTL_VIDEO_QUERY_DISPLAY_BRIGHTNESS\n- power-adapter via GetSystemPowerStatus\n- login-manager via LogonUI.exe's VS_FIXEDFILEINFO product version (version.dll)\n- tpm via Tbsi_GetDeviceInfo (tbs.dll)\nplus Windows Terminal terminal-font (settings.json) and standalone\n--fields terminal-font / terminal-theme process-tree detection.\n\nFinally, subtract retch's own and child-process CPU time from Windows\ncpu-usage via an anonymous Win32 Job Object + GetProcessTimes, and sanitize ':'\nin scripts/bench_meta.py's self-test temp directory names on Windows NTFS.\n\nretch-cli 0.20.31 -> 0.20.32, retch-sysinfo 0.1.96 -> 0.1.97.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T11:36:31-07:00",
          "tree_id": "ef9988b328033dbc532eebfbd93269bc2f7fc134",
          "url": "https://github.com/l1a/retch/commit/ce8f3c0dcbf8cc39bbb996eb33224847ed5abec0"
        },
        "date": 1793386394577,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 39228340,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2385863510,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1314208010,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21883539.999999996,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch",
            "value": 25128610.000000004,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 340368820,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 209837530.00000003,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 23068820,
            "unit": "ns",
            "extra": "v0.20.32"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 175.44863294397462,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947592259799618,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 93.20247531366354,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 77.08649589783684,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 48273.202959412556,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 438.9038194228377,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 684.1519615889137,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 289504550,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54a7a9960827f9bb307b8831b6acb08cad9f717b",
          "message": "Add Windows CPU cache, freq range, and hybrid cores (#308)\n\nImplement native Windows CPU cache size detection (`cpu-cache`), base and\nboost frequency range detection (`cpu-freq`), hybrid P/E core topology\ndetection (`cpu`), and x86 CPUID brand trimming:\n\n- `crates/sysinfo/src/memory.rs`: Cache `read_smbios_table()` in a\n  `OnceLock` (`cached_smbios_table()`) so `phys-mem` (Type 17) and\n  `cpu-freq` (Type 4) share a single `GetSystemFirmwareTable('RSMB')`\n  call, and add `parse_smbios_type4_speeds()` to read `CurrentSpeed`\n  (base MHz) and `MaxSpeed` (boost MHz) from populated processor sockets.\n- `crates/sysinfo/src/fetch.rs`:\n  - Implement Windows `detect_cpu_cache()` via\n    `GetLogicalProcessorInformationEx(RelationCache, ...)` and share\n    `format_cpu_cache_entries()` with Linux.\n  - Implement Windows `detect_cpu_freq_range()` combining SMBIOS Type 4\n    speeds and per-core `CallNtPowerInformation(ProcessorInformation)`\n    `MaxMhz` values.\n  - Implement Windows `hybrid_cores()` via\n    `GetLogicalProcessorInformationEx(RelationProcessorCore, ...)`,\n    grouping logical processor bitmask popcounts by `EfficiencyClass`.\n  - Trim x86 `CPUID` brand strings in `cpu_brand()` so padded 48-byte\n    strings do not render extra spaces before `(8C / 16T)`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T12:43:34-07:00",
          "tree_id": "cae0fcbe3459e5c24023fe4fc0903cd7768e8923",
          "url": "https://github.com/l1a/retch/commit/54a7a9960827f9bb307b8831b6acb08cad9f717b"
        },
        "date": 1793390172887,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 47450440,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2388228929.9999995,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1314181469.9999998,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 24552050,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch",
            "value": 28723650.000000007,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 346557850.00000006,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 231259100.00000003,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 25640790.000000004,
            "unit": "ns",
            "extra": "v0.20.33"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 175.04736870813238,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.9502940965480042,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 92.3420005611386,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1311.1843835899272,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 46160.627318181476,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 415.4390431339385,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 679.0189654889339,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 289307220,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b1b47a194a52b307dd78675ddf64541b85ebf315",
          "message": "Fix Intel cache unit and V4L2 IPU6 camera list (#309)\n\n- Fix `format_cpu_cache_entries` in `crates/sysinfo/src/fetch.rs` where\n  fractional MiB cache sizes (`kb >= 1024 && !kb.is_multiple_of(1024)`)\n  formatted `\"{:.2}M\"` before `.trim_end_matches('0')` and then appended\n  `+ \"M\"`, producing `\"1.25MM\"` on Intel Golden Cove / Raptor Cove / Lion\n  Cove P-cores (`1280` KB = 1.25 MiB).\n- Filter V4L2 ISP DMA capture queues (`Intel IPU6 ISYS Capture 0..31`),\n  CSI-2 receivers (`Intel IPU6 CSI2 0..3`), and MEI CSI bridges\n  (`Intel IVSC CSI`, `ipu3-*`) in `is_real_camera()`, expand V4L2 I2C\n  sensor names (`\"<model> <bus>-<4-hex-addr>\"`) to `\"<Vendor> <MODEL>\"`\n  (`\"ov01a10 17-0036\"` -> `\"OmniVision OV01A10\"`), append panel location\n  (`(Front)` / `(Back)`) from `device/physical_location/panel`, and sort\n  `/sys/class/video4linux` entries deterministically in `detect_camera()`.\n- Bump `retch-cli` to 0.20.34 and `retch-sysinfo` to 0.1.99, regenerate\n  `docs/retch.1`, and update `NOTES.md`.\n\nAssisted-By: Claude Opus 4.6",
          "timestamp": "2026-10-30T15:25:27-07:00",
          "tree_id": "a63fa52ea6b34f624b0d7923d943b798ebaf5301",
          "url": "https://github.com/l1a/retch/commit/b1b47a194a52b307dd78675ddf64541b85ebf315"
        },
        "date": 1793399844986,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31423770.000000004,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2376427100,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1311304389.9999998,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 21373020,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch",
            "value": 25250360.000000007,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 333657960.00000006,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 213266739.99999997,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 22815470,
            "unit": "ns",
            "extra": "v0.20.34"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 176.24622775566473,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.947659893943886,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 95.0463840401643,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1310.780366333732,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47361.32992081441,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 425.379519316768,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 681.1227335448282,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 291023490,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e0b7c5075ab577c209942f3bf94b325aec2ba1dc",
          "message": "Detect Linux DE and daemon wallpapers dynamically (#310)\n\n- Remove the unconditional Step 9 GNOME `gsettings` fallback and `niri`\n  GNOME routing in `crates/sysinfo/src/theme.rs` so non-GNOME desktops\n  never report GNOME's stale wallpaper.\n- Add single-pass `/proc` wallpaper daemon detection (`noctalia`,\n  `swww-daemon`/`awww-daemon`, `swaybg`/`wbg`/`mpvpaper`, `hyprpaper`,\n  `wpaperd`) and pure parsers for Noctalia's `settings.toml`, `swww`\n  cache files, `/proc/<pid>/cmdline`, COSMIC, `wpaperd`, LXQt, and LXDE.\n- Filter multi-monitor state files (`noctalia`, `swww`/`awww`,\n  `wpaperd`) by connected DRM outputs (`/sys/class/drm/card*-*/status`)\n  and deduplicate wallpaper paths in monitor order.\n- Respect `org.gnome.desktop.interface color-scheme` (`prefer-dark`) on\n  GNOME/Budgie/Unity/Mutter and scope `sway/config` to Sway and\n  `.fehbg`/`nitrogen` to non-Wayland sessions.\n- Probe `detected_desktop` and `detected_wm` in `fetch.rs` whenever\n  `wallpaper` or `wm-theme` is requested, and add `Umbriel`, `COSMIC`,\n  and `Mango` to compositor/DE detection.\n\nAssisted-By: Gemini 2.5 Pro",
          "timestamp": "2026-10-30T19:03:51-07:00",
          "tree_id": "8f3621e63bad1a13ea973721d556f4078ee05000",
          "url": "https://github.com/l1a/retch/commit/e0b7c5075ab577c209942f3bf94b325aec2ba1dc"
        },
        "date": 1793412730886,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch (default)",
            "value": 31496410.000000004,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (full)",
            "value": 2366785970,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (long)",
            "value": 1303646270,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - fastfetch (short)",
            "value": 20071150.000000004,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch",
            "value": 24073130,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --full",
            "value": 319442620,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --long",
            "value": 199255050.00000003,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "CLI execution - retch --short",
            "value": 21258830.000000004,
            "unit": "ns",
            "extra": "v0.20.35"
          },
          {
            "name": "display__parse_monitor_name_from_edid",
            "value": 174.70746066148033,
            "unit": "ns"
          },
          {
            "name": "display__parse_refresh_rate_from_edid",
            "value": 2.955394564176985,
            "unit": "ns"
          },
          {
            "name": "display__parse_serial_number_from_edid",
            "value": 92.91183299454875,
            "unit": "ns"
          },
          {
            "name": "fetch__format_cpu_cores",
            "value": 1304.9271322271638,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 47597.393467534195,
            "unit": "ns"
          },
          {
            "name": "network__parse_iw_link_output",
            "value": 444.7692290416586,
            "unit": "ns"
          },
          {
            "name": "network__parse_netsh_output",
            "value": 701.0932363583503,
            "unit": "ns"
          },
          {
            "name": "systeminfo__collect",
            "value": 277109430,
            "unit": "ns"
          }
        ]
      }
    ]
  }
}