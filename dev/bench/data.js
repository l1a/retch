window.BENCHMARK_DATA = {
  "lastUpdate": 1790719501075,
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
      }
    ]
  }
}