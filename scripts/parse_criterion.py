#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""Collect criterion and hyperfine results into `benchmark_result.json` for the dashboard.

Run by `.github/workflows/benchmark.yml` in each of the five platform jobs, after
`cargo bench` and `scripts/cli_bench.py` (one `hyperfine --export-json` per output mode). Its output is handed to
github-action-benchmark, which appends it to `dev/bench/data.js` on `gh-pages`.

WHY THIS READS A GLOB AND WHY IT NOW FAILS LOUDLY -- both halves are the fix for a defect
that ran for three months.

This script used to open one hardcoded `hyperfine_result.json`. On 2026-06-24 `b45894a`
split the workflow's single hyperfine run into three -- `hyperfine_default.json`,
`hyperfine_short.json`, `hyperfine_long.json` -- and taught this script to LABEL the three
modes, but never changed the name it opens. So from that day it read a file nothing wrote.

It did not fail. It printed `Warning: ... not found.` to stderr and carried on, and its only
hard error fired when BOTH sources were empty -- so criterion alone kept the step green while
every CLI timing was discarded. Measured afterwards on the published artifact: across 50 runs
each, all five CI suites held ZERO `CLI execution` series, while the `Local - ...` suites
(written by `upload_local_bench.py`, which never used this script) held all six.

So:

1. **Glob, do not hardcode.** `hyperfine_*.json` picks up whatever the workflow emits, so
   adding a fourth comparison needs no change here. That removes the class, not the instance.
2. **A source that is expected and absent is an ERROR.** Both `cargo bench` and the three
   hyperfine runs always precede this script in CI, so either producing nothing means
   something upstream broke, and the only useful thing to do is say so and exit non-zero.
   `--allow-missing` exists for a deliberate partial run; it is not the default, because the
   default is what CI uses and a warning nobody reads is how this hid for three months.
"""

import argparse
import glob
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bench_labels import labelled_means  # noqa: E402

CRITERION_DIR = "target/criterion"
HYPERFINE_GLOB = "hyperfine_*.json"
OUTPUT = "benchmark_result.json"


def collect_criterion(criterion_dir):
    """Read each benchmark's mean estimate. Returns (entries, problems)."""
    entries, problems = [], []
    if not os.path.isdir(criterion_dir):
        return entries, [f"{criterion_dir}/ does not exist (did `cargo bench` run?)"]
    for name in sorted(os.listdir(criterion_dir)):
        if name == "report":
            continue
        estimates = os.path.join(criterion_dir, name, "new", "estimates.json")
        if not os.path.isfile(estimates):
            continue
        try:
            with open(estimates, encoding="utf-8") as fh:
                data = json.load(fh)
            entries.append({
                "name": name,
                "value": data["mean"]["point_estimate"],
                "unit": "ns",
            })
        except (OSError, ValueError, KeyError) as exc:
            problems.append(f"{estimates}: {exc}")
    if not entries and not problems:
        problems.append(f"{criterion_dir}/ exists but holds no estimates.json")
    return entries, problems


def collect_hyperfine(pattern):
    """Read every hyperfine export matching `pattern`. Returns (entries, problems)."""
    entries, problems = [], []
    paths = sorted(glob.glob(pattern))
    if not paths:
        return entries, [f"no files matched {pattern!r} (did the hyperfine runs happen?)"]
    for path in paths:
        try:
            with open(path, encoding="utf-8") as fh:
                data = json.load(fh)
        except (OSError, ValueError) as exc:
            problems.append(f"{path}: {exc}")
            continue
        found = [{"name": n, "value": v, "unit": "ns"} for n, v in labelled_means(data)]
        if not found:
            problems.append(f"{path}: parsed but contained no usable results")
        entries.extend(found)
    return entries, problems


def merge(criterion_entries, hyperfine_entries):
    """Combine and sort. Duplicate names are a defect, so they are reported, not silently kept.

    Two files exporting the same command -- easy to do by adding a comparison without changing
    its flags -- would otherwise append two points to one series for a single commit.
    """
    entries = criterion_entries + hyperfine_entries
    seen, dupes = set(), []
    for e in entries:
        if e["name"] in seen:
            dupes.append(e["name"])
        seen.add(e["name"])
    entries.sort(key=lambda x: x["name"])
    return entries, dupes


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--allow-missing", action="store_true",
                    help="downgrade an absent source to a warning (NOT for CI)")
    ap.add_argument("--criterion-dir", default=CRITERION_DIR)
    ap.add_argument("--hyperfine-glob", default=HYPERFINE_GLOB)
    ap.add_argument("--output", default=OUTPUT)
    args = ap.parse_args(argv)

    crit, crit_problems = collect_criterion(args.criterion_dir)
    hyper, hyper_problems = collect_hyperfine(args.hyperfine_glob)
    entries, dupes = merge(crit, hyper)

    problems = crit_problems + hyper_problems
    if dupes:
        problems.append(f"duplicate series names: {sorted(set(dupes))}")

    for p in problems:
        print(f"  {p}", file=sys.stderr)

    if problems and not args.allow_missing:
        print(
            f"\nparse_criterion: refusing to publish a partial result.\n"
            f"  Collected {len(crit)} criterion and {len(hyper)} hyperfine entries.\n"
            f"  Both sources run before this script in CI, so an empty one means something\n"
            f"  upstream failed. This used to be a warning, and that is how the CLI timings\n"
            f"  went missing from every CI suite for three months. Pass --allow-missing only\n"
            f"  for a deliberately partial local run.",
            file=sys.stderr,
        )
        return 1

    if not entries:
        print("parse_criterion: no benchmark results at all.", file=sys.stderr)
        return 1

    with open(args.output, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2)

    print(f"Wrote {args.output}: {len(crit)} criterion + {len(hyper)} CLI = {len(entries)}")
    for e in entries:
        print(f"  {e['name']}: {e['value']} {e['unit']}")
    return 0


def _self_test():
    import tempfile

    failures = []

    def check(name, cond, detail=""):
        if not cond:
            failures.append(f"{name}: {detail}")

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    with tempfile.TemporaryDirectory() as d:
        cwd = os.getcwd()
        os.chdir(d)
        try:
            # --- the regression: every real filename must be read ---------------------------
            # Fixtures come from cli_bench.pairs(), the one definition of the commands and file
            # names, so this cannot keep passing on a stale hand-written copy of them.
            import cli_bench
            n_expected = 0
            for i, (mode, cmds) in enumerate(cli_bench.pairs("Linux")):
                with open(cli_bench.export_name(mode), "w", encoding="utf-8") as fh:
                    json.dump({"results": [{"command": c, "mean": 0.01 * (i + 1)}
                                           for c in cmds]}, fh)
                n_expected += len(cmds)

            hyper, probs = collect_hyperfine(HYPERFINE_GLOB)
            check("every mode's file is read", len(hyper) == n_expected,
                  f"got {len(hyper)} of {n_expected}: {probs}")
            check("no problems on a good set", not probs, str(probs))
            names = sorted(e["name"] for e in hyper)
            check("exactly the expected series appear",
                  names == sorted(__import__("bench_labels").EXPECTED_LABELS), str(names))

            # THE BUG ITSELF: the old hardcoded name must not be what makes this work.
            os.rename("hyperfine_default.json", "hyperfine_result.json")
            still, _ = collect_hyperfine(HYPERFINE_GLOB)
            check("the glob is not keyed on one name", len(still) == n_expected,
                  f"got {len(still)} after renaming one file")
            os.rename("hyperfine_result.json", "hyperfine_default.json")

            # --- absent sources are errors, not warnings ----------------------------------
            empty, probs = collect_hyperfine("nothing_matches_*.json")
            check("absent hyperfine is a problem", empty == [] and probs, str(probs))
            crit, cprobs = collect_criterion("definitely/not/here")
            check("absent criterion is a problem", crit == [] and cprobs, str(cprobs))

            # main() must REFUSE rather than publish a partial result.
            rc = main(["--criterion-dir", "definitely/not/here",
                       "--hyperfine-glob", HYPERFINE_GLOB, "--output", "out.json"])
            check("partial result is refused", rc == 1, f"exit {rc} -- this is the defect")
            check("nothing is written on refusal", not os.path.exists("out.json"),
                  "a partial benchmark_result.json was written")

            # ...and --allow-missing is the deliberate escape hatch.
            rc = main(["--criterion-dir", "definitely/not/here",
                       "--hyperfine-glob", HYPERFINE_GLOB, "--output", "out.json",
                       "--allow-missing"])
            check("--allow-missing publishes anyway", rc == 0, f"exit {rc}")
            check("and writes the file", os.path.exists("out.json"), "no output written")
            if os.path.exists("out.json"):
                with open("out.json", encoding="utf-8") as fh:
                    got = json.load(fh)
                check("every CLI entry survives", len(got) == n_expected, str(len(got)))
                check("entries are sorted",
                      [e["name"] for e in got] == sorted(e["name"] for e in got), str(got))

            # --- criterion side, and the two sources merging ------------------------------
            os.makedirs("crit/parse_thing/new", exist_ok=True)
            with open("crit/parse_thing/new/estimates.json", "w", encoding="utf-8") as fh:
                json.dump({"mean": {"point_estimate": 42.0}}, fh)
            crit, cprobs = collect_criterion("crit")
            check("criterion is read", len(crit) == 1 and crit[0]["value"] == 42.0, str(crit))
            check("no problems on a good criterion dir", not cprobs, str(cprobs))

            rc = main(["--criterion-dir", "crit", "--hyperfine-glob", HYPERFINE_GLOB,
                       "--output", "both.json"])
            check("both sources publish cleanly", rc == 0, f"exit {rc}")
            if os.path.exists("both.json"):
                with open("both.json", encoding="utf-8") as fh:
                    both = json.load(fh)
                check("criterion and CLI are merged", len(both) == n_expected + 1,
                      str(len(both)))
            else:
                check("both.json was written", False, "no output -- see the failure above")

            # --- THE COUPLING THAT WAS MISSING, and the whole reason this defect existed --
            # b45894a changed the filenames the workflow wrote and not this script; nothing
            # connected the two, so nothing complained. Since v0.19.0 cli_bench.py names the
            # files, so assert (1) every name it writes matches the default glob, and (2) the
            # workflow gets its CLI timings from cli_bench.py in EVERY job that publishes, and
            # never from a hand-written hyperfine line that could name a file of its own.
            import fnmatch
            written = [cli_bench.export_name(m) for m in cli_bench.MODE_NAMES]
            unmatched = [n for n in written if not fnmatch.fnmatch(n, HYPERFINE_GLOB)]
            check("every file cli_bench writes is matched by the default glob", not unmatched,
                  f"{unmatched} not matched by {HYPERFINE_GLOB!r} -- the b45894a defect")
            wf = os.path.join(repo_root, ".github", "workflows", "benchmark.yml")
            if os.path.isfile(wf):
                with open(wf, encoding="utf-8") as fh:
                    wf_text = fh.read()
                # Count INVOCATIONS, not mentions: the workflow's pull_request path filter
                # names both scripts too, and counting those would let a job silently drop
                # cli_bench.py while the totals still matched.
                parsers = len(re.findall(r"python3?\s+scripts/parse_criterion\.py", wf_text))
                runners = len(re.findall(r"python3?\s+scripts/cli_bench\.py", wf_text))
                check("the workflow runs parse_criterion.py at all", parsers > 0,
                      "has the workflow stopped collecting results?")
                check("every job that collects results runs cli_bench.py first",
                      runners == parsers, f"{runners} cli_bench.py vs {parsers} parse_criterion.py")
                check("no job calls hyperfine directly", "--export-json" not in wf_text,
                      "a raw hyperfine line bypasses cli_bench.py and can name its own file")
            else:
                print(f"  (skipped: {wf} not present)")

            # --- duplicates are reported rather than silently doubling a series -----------
            with open("hyperfine_copy.json", "w", encoding="utf-8") as fh:
                json.dump({"results": [{"command": cli_bench.fastfetch_command("default"),
                                        "mean": 0.6}]}, fh)
            rc = main(["--criterion-dir", "crit", "--hyperfine-glob", HYPERFINE_GLOB,
                       "--output", "dup.json"])
            check("a duplicated series is refused", rc == 1, f"exit {rc}")
        finally:
            os.chdir(cwd)

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"parse_criterion.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("parse_criterion.py self-test passed")
    return 0


if __name__ == "__main__":
    if "--self-test" in sys.argv[1:]:
        sys.exit(_self_test())
    sys.exit(main(sys.argv[1:]))
