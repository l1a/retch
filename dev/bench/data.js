window.BENCHMARK_DATA = {
  "lastUpdate": 1790715104830,
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
      }
    ]
  }
}