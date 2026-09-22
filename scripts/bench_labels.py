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

`retch` vs `fastfetch` is decided by substring, and that is safe rather than lucky:
"fastfetch" does not contain "retch" (it contains "fetch"). The retch arm is tested first, so
a path that somehow contained both would classify as retch -- documented rather than relied
upon, since no invocation in this repository produces one.
"""

CLI_PREFIX = "CLI execution - "


def label_for_command(cmd: str) -> str:
    """Map a hyperfine `command` string to its dashboard series name.

    Pure, so both callers and the self-test can exercise it without running a benchmark.
    Handles the Unix (`./target/release/retch`) and Windows (`.\\target\\release\\retch.exe`)
    forms identically, because it keys on the flags rather than the path.
    """
    if "retch" in cmd:
        if "--short" in cmd:
            return f"{CLI_PREFIX}retch --short"
        if "--long" in cmd:
            return f"{CLI_PREFIX}retch --long"
        return f"{CLI_PREFIX}retch"
    if "fastfetch" in cmd:
        if "-c none" in cmd:
            return f"{CLI_PREFIX}fastfetch -c none"
        if "-c all" in cmd:
            return f"{CLI_PREFIX}fastfetch -c all"
        return f"{CLI_PREFIX}fastfetch"
    return f"{CLI_PREFIX}{cmd}"


def labelled_means(data: dict):
    """Turn one parsed hyperfine --export-json document into `(label, nanoseconds)` pairs.

    hyperfine reports `mean` in SECONDS; the dashboard stores nanoseconds, matching the
    criterion entries it sits beside. Getting that conversion wrong would not fail anything --
    it would silently plot CLI timings a billion times too small next to the criterion ones.

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
        mean = res.get("mean")
        if mean is None:
            continue
        out.append((label_for_command(res.get("command", "")), mean * 1_000_000_000))
    return out


# The six series the three workflow/`bench-upload` pairs produce. Pinned so a change to the
# command list has to update this list too, and so the self-test can assert completeness.
EXPECTED_LABELS = (
    f"{CLI_PREFIX}retch",
    f"{CLI_PREFIX}retch --short",
    f"{CLI_PREFIX}retch --long",
    f"{CLI_PREFIX}fastfetch",
    f"{CLI_PREFIX}fastfetch -c none",
    f"{CLI_PREFIX}fastfetch -c all",
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
        (r".\target\release\retch.exe", f"{CLI_PREFIX}retch"),
        (r".\target\release\retch.exe --short", f"{CLI_PREFIX}retch --short"),
        (r".\target\release\retch.exe --long", f"{CLI_PREFIX}retch --long"),
        ("fastfetch", f"{CLI_PREFIX}fastfetch"),
        ("fastfetch -c none", f"{CLI_PREFIX}fastfetch -c none"),
        ("fastfetch -c all", f"{CLI_PREFIX}fastfetch -c all"),
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
    check("all six series are reachable", not missing, f"unreachable: {missing}")

    # Seconds -> nanoseconds, and the unit says so.
    pairs = labelled_means({"results": [
        {"command": "./target/release/retch", "mean": 0.1234},
        {"command": "fastfetch", "mean": 1.5},
    ]})
    check("two results in, two out", len(pairs) == 2, str(pairs))
    check("seconds become nanoseconds", pairs[0][1] == 123400000.0, f"got {pairs[0][1]}")
    check("names are mapped", pairs[1][0] == f"{CLI_PREFIX}fastfetch", str(pairs))

    # A result with no mean is skipped rather than crashing or writing a null.
    check("missing mean is skipped",
          labelled_means({"results": [{"command": "x"}]}) == [], "a null mean leaked")
    check("empty document yields nothing", labelled_means({}) == [], "phantom entry")

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
