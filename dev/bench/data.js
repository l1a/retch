window.BENCHMARK_DATA = {
  "lastUpdate": 1779827456287,
  "repoUrl": "https://github.com/l1a/retch",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1192d1b114b75e56357adc79e09d3c3fe30317fc",
          "message": "Merge pull request #39 from l1a/fix/benchmark-ci\n\nFix continuous benchmarking CI format",
          "timestamp": "2026-05-26T13:00:52-07:00",
          "tree_id": "8f08ba7318e87e1b95ba9197791b51917e34bf4d",
          "url": "https://github.com/l1a/retch/commit/1192d1b114b75e56357adc79e09d3c3fe30317fc"
        },
        "date": 1779825845647,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "SystemInfo__collect",
            "value": 85830035.19514295,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 2356509.892689231,
            "unit": "ns"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "634380+l1a@users.noreply.github.com",
            "name": "Ken Tobias",
            "username": "l1a"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e9fede0fb8621ddc70e274320a1f31222cbdbe1f",
          "message": "Merge pull request #41 from l1a/fix/benchmark-fastfetch-install\n\nFix fastfetch installation in benchmark workflow",
          "timestamp": "2026-05-26T13:24:33-07:00",
          "tree_id": "69e3e0ec4a61b3a4bc41dd9e6d3c74372c48e095",
          "url": "https://github.com/l1a/retch/commit/e9fede0fb8621ddc70e274320a1f31222cbdbe1f"
        },
        "date": 1779827455490,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "CLI execution - fastfetch",
            "value": 10908583.280000001,
            "unit": "ns"
          },
          {
            "name": "CLI execution - retch",
            "value": 157147071.08,
            "unit": "ns"
          },
          {
            "name": "SystemInfo__collect",
            "value": 157395909.24999994,
            "unit": "ns"
          },
          {
            "name": "gpu__detect_gpus",
            "value": 2346709.3797579617,
            "unit": "ns"
          }
        ]
      }
    ]
  }
}