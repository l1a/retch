#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""The one place a hyperfine command is turned into a dashboard label.

Two scripts publish CLI timings to the same gh-pages dashboard and must agree on what a
series is called: `parse_criterion.py` (CI, via .github/workflows/benchmark.yml) and
`upload_local_bench.py` (real hardware, via `just bench-upload` and the post-merge hook).
Until v0.18.2 they each carried a byte-identical private copy of this mapping -- the exact
"two copies drifting" shape the shared modules in `crates/sysinfo` exist to prevent.

THE LABELS ARE AN API, NOT A PRESENTATION CHOICE. github-action-benchmark keys each series
in `dev/bench/data.js` by this string, so renaming one does not rename a series: it starts a
NEW series and orphans the old one's history. There are 50 runs per CI suite and 95 in the
local Linux suite riding on these exact strings. Change them only deliberately, and expect
the chart to restart.

**v0.19.0 deliberately started new fastfetch series.** The old `fastfetch`, `fastfetch -c none`
and `fastfetch -c all` series measured fastfetch's built-in default (or, locally, the user's own
config) rather than the fields retch shows; the benchmark now runs fastfetch with a per-mode
config generated from src/fields.rs (see scripts/fastfetch_configs.py). Keeping the old names
would have spliced two different workloads into one line, so the four fastfetch series are
`fastfetch (short|default|long|full)` and the old ones simply stop. The retch series keep
their names; `retch --full` is new.

`retch` vs `fastfetch` is decided by substring, and that is safe rather than lucky:
"fastfetch" does not contain "retch" (it contains "fetch"). The retch arm is tested first, so
a path that somehow contained both would classify as retch -- documented rather than relied
upon, since no invocation in this repository produces one.
"""

import re

CLI_PREFIX = "CLI execution - "

# `fastfetch -c benches/fastfetch/<mode>.jsonc`, either slash direction.
_FASTFETCH_CONFIG = re.compile(r"benches[/\\]fastfetch[/\\](short|default|long|full)\.jsonc")


def label_for_command(cmd: str) -> str:
    """Map a hyperfine `command` string to its dashboard series name.

    Pure, so both callers and the self-test can exercise it without running a benchmark.
    Handles the Unix (`./target/release/retch`) and Windows (`./target/release/retch.exe`
    since v0.20.20, `.\\target\\release\\retch.exe` before) forms identically, because it keys
    on the flags rather than the path.
    """
    if "retch" in cmd:
        for flag in ("--short", "--long", "--full"):
            if flag in cmd:
                return f"{CLI_PREFIX}retch {flag}"
        return f"{CLI_PREFIX}retch"
    if "fastfetch" in cmd:
        m = _FASTFETCH_CONFIG.search(cmd)
        if m:
            return f"{CLI_PREFIX}fastfetch ({m.group(1)})"
    # Anything else keeps its raw command as the label, so an unexpected command shows up
    # as an obviously-new series instead of silently merging into an existing one.
    return f"{CLI_PREFIX}{cmd}"


def mean_seconds(res: dict):
    """One hyperfine result's mean wall-clock time in seconds, or None if it has none.

    Two export schemas exist, and a runner gets whichever its package manager ships:
      - hyperfine 1.x: a top-level `mean`, in seconds.
      - hyperfine 2.x (`schema_version: 2`): no top-level `mean`; wall-clock time is
        `summary.time_wall_clock.mean`, with its unit stated beside it (`"second"`).
    Reading only the 1.x key made every 2.x export yield nothing, and the local uploader then
    published two EMPTY points (2026-10-11). Any other unit is refused rather than guessed.
    """
    mean = res.get("mean")
    if isinstance(mean, (int, float)):
        return float(mean)
    wall = (res.get("summary") or {}).get("time_wall_clock") or {}
    if wall.get("unit") == "second" and isinstance(wall.get("mean"), (int, float)):
        return float(wall["mean"])
    return None


def labelled_means(data: dict):
    """Turn one parsed hyperfine --export-json document into `(label, nanoseconds)` pairs.

    hyperfine reports the mean in SECONDS (see mean_seconds for where, per version); the
    dashboard stores nanoseconds, matching the criterion entries it sits beside. Getting that
    conversion wrong would not fail anything -- it would silently plot CLI timings a billion
    times too small next to the criterion ones.

    **Returns pairs rather than finished dicts on purpose.** The two callers serialise
    differently and must keep doing so: `upload_local_bench.py` writes `data.js` itself, and
    its existing 95-run Linux suite stores keys as `name, unit, value`, while the CI entries
    that github-action-benchmark writes store `name, value, unit`. Imposing one order here
    would rewrite every key in one of those suites for no reason -- the same pointless
    whole-file churn v0.9.11 removed. Share the mapping, which can drift; leave the
    serialisation to whoever owns the file.
    """
    out = []
    for res in data.get("results", []):
        mean = mean_seconds(res)
        if mean is None:
            continue
        out.append((label_for_command(res.get("command", "")), mean * 1_000_000_000))
    return out


def missing_series(labels, with_fastfetch=True):
    """The expected CLI series absent from `labels`, in EXPECTED_LABELS order.

    Both publishers check this before writing anything, because a run that yields fewer
    series than it ran is a failure upstream (a hyperfine that died, an export nobody can
    read), never a smaller result. Without fastfetch only the four retch series are expected.
    """
    have = set(labels)
    want = [l for l in EXPECTED_LABELS if with_fastfetch or "fastfetch" not in l]
    return [l for l in want if l not in have]


# The eight series the four scripts/cli_bench.py pairs produce. Pinned so a change to the
# command list has to update this list too; cli_bench.py's self-test asserts the two agree.
EXPECTED_LABELS = (
    f"{CLI_PREFIX}retch --short",
    f"{CLI_PREFIX}retch",
    f"{CLI_PREFIX}retch --long",
    f"{CLI_PREFIX}retch --full",
    f"{CLI_PREFIX}fastfetch (short)",
    f"{CLI_PREFIX}fastfetch (default)",
    f"{CLI_PREFIX}fastfetch (long)",
    f"{CLI_PREFIX}fastfetch (full)",
)


def _self_test() -> int:
    import sys

    failures = []

    def check(name, cond, detail=""):
        if not cond:
            failures.append(f"{name}: {detail}")

    # The exact commands both callers run, Unix and Windows forms.
    cases = [
        ("./target/release/retch", f"{CLI_PREFIX}retch"),
        ("./target/release/retch --short", f"{CLI_PREFIX}retch --short"),
        ("./target/release/retch --long", f"{CLI_PREFIX}retch --long"),
        ("./target/release/retch --full", f"{CLI_PREFIX}retch --full"),
        (r".\target\release\retch.exe", f"{CLI_PREFIX}retch"),
        (r".\target\release\retch.exe --short", f"{CLI_PREFIX}retch --short"),
        (r".\target\release\retch.exe --long", f"{CLI_PREFIX}retch --long"),
        (r".\target\release\retch.exe --full", f"{CLI_PREFIX}retch --full"),
        # The Windows spelling cli_bench.py has used since v0.20.20 (forward slashes, so
        # hyperfine's no-shell POSIX splitting keeps the path). Same series as the old form.
        ("./target/release/retch.exe", f"{CLI_PREFIX}retch"),
        ("./target/release/retch.exe --short", f"{CLI_PREFIX}retch --short"),
        ("./target/release/retch.exe --long", f"{CLI_PREFIX}retch --long"),
        ("./target/release/retch.exe --full", f"{CLI_PREFIX}retch --full"),
        ("fastfetch -c benches/fastfetch/short.jsonc", f"{CLI_PREFIX}fastfetch (short)"),
        ("fastfetch -c benches/fastfetch/default.jsonc", f"{CLI_PREFIX}fastfetch (default)"),
        ("fastfetch -c benches/fastfetch/long.jsonc", f"{CLI_PREFIX}fastfetch (long)"),
        (r"fastfetch -c benches\fastfetch\full.jsonc", f"{CLI_PREFIX}fastfetch (full)"),
    ]
    for cmd, want in cases:
        got = label_for_command(cmd)
        check(f"label {cmd!r}", got == want, f"expected {want!r}, got {got!r}")

    # The load-bearing negative: "fastfetch" must NOT be seen as retch. If it ever were, both
    # commands in a pair would collapse onto one series and the comparison would vanish.
    check("fastfetch is not retch", "retch" not in "fastfetch",
          "the substring test this module relies on has stopped holding")

    # Every expected series is reachable from some real command.
    produced = {label_for_command(c) for c, _ in cases}
    missing = [l for l in EXPECTED_LABELS if l not in produced]
    check("all eight series are reachable", not missing, f"unreachable: {missing}")

    # The retired commands must NOT land on a current series: that would splice the old
    # workload (fastfetch's built-in default, or a user's config) into the new line.
    for old in ("fastfetch", "fastfetch -c none", "fastfetch -c all"):
        check(f"retired {old!r} starts no current series",
              label_for_command(old) not in EXPECTED_LABELS, label_for_command(old))

    # Seconds -> nanoseconds, and the unit says so.
    pairs = labelled_means({"results": [
        {"command": "./target/release/retch", "mean": 0.1234},
        {"command": "fastfetch -c benches/fastfetch/default.jsonc", "mean": 1.5},
    ]})
    check("two results in, two out", len(pairs) == 2, str(pairs))
    check("seconds become nanoseconds", pairs[0][1] == 123400000.0, f"got {pairs[0][1]}")
    check("names are mapped", pairs[1][0] == f"{CLI_PREFIX}fastfetch (default)", str(pairs))

    # A result with no mean is skipped rather than crashing or writing a null.
    check("missing mean is skipped",
          labelled_means({"results": [{"command": "x"}]}) == [], "a null mean leaked")
    check("empty document yields nothing", labelled_means({}) == [], "phantom entry")

    # hyperfine 2.x export (schema_version 2), keys as hyperfine 2.0.0 writes them: no
    # top-level mean, wall-clock time under summary.time_wall_clock with its unit.
    v2 = {"schema_version": 2, "primary_metric": "time_wall_clock", "results": [
        {"command": "./target/release/retch --short",
         "measurements": [{"time_wall_clock": {"value": 0.0025, "unit": "second"}}],
         "summary": {"time_cpu": {"unit": "second", "mean": 0.9},
                     "time_wall_clock": {"unit": "second", "count": 3, "mean": 0.0025,
                                         "median": 0.0026}}},
    ]}
    pairs2 = labelled_means(v2)
    check("hyperfine 2.x export is read", len(pairs2) == 1, str(pairs2))
    check("2.x reads WALL-CLOCK time, not CPU time, as seconds -> ns",
          pairs2 == [(f"{CLI_PREFIX}retch --short", 2500000.0)], str(pairs2))
    check("2.x mean in a unit other than seconds is refused",
          mean_seconds({"summary": {"time_wall_clock": {"unit": "ms", "mean": 2.5}}}) is None,
          "an unknown unit was guessed")
    check("1.x top-level mean still read",
          mean_seconds({"mean": 0.5, "summary": {}}) == 0.5, "1.x schema regressed")

    # Completeness, which the publishers check before writing anything.
    full_set = [f"{CLI_PREFIX}retch", f"{CLI_PREFIX}retch --short", f"{CLI_PREFIX}retch --long",
                f"{CLI_PREFIX}retch --full"]
    check("nothing collected: every series is missing",
          missing_series([]) == list(EXPECTED_LABELS), str(missing_series([])))
    check("all eight collected: none missing", missing_series(EXPECTED_LABELS) == [],
          str(missing_series(EXPECTED_LABELS)))
    check("without fastfetch only retch's four are expected",
          missing_series(full_set, with_fastfetch=False) == [],
          str(missing_series(full_set, with_fastfetch=False)))
    check("a missing fastfetch series is reported when fastfetch ran",
          missing_series(full_set) == [l for l in EXPECTED_LABELS if "fastfetch" in l],
          str(missing_series(full_set)))

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"bench_labels.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("bench_labels.py self-test passed")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(_self_test())
