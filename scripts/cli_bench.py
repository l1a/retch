#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""Run the retch-vs-fastfetch CLI benchmarks: one hyperfine comparison per output mode.

THE ONE PLACE THE PAIRS ARE DEFINED. Until v0.19.0 the hyperfine command lines were written
out seven times -- three per job in all five jobs of `.github/workflows/benchmark.yml`, again
in `scripts/upload_local_bench.py`, and again in `just bench-compare` -- and they had already
drifted in meaning (see scripts/fastfetch_configs.py for what they actually measured). Now the
workflow, `just bench-upload` and `just bench-compare` all call this.

Each mode pairs `retch [--<mode>]` with `fastfetch -c benches/fastfetch/<mode>.jsonc`, a
config generated from src/fields.rs that asks fastfetch for the same fields. The config path
is RELATIVE and the commands run from the repository root, so the command strings -- and
therefore the dashboard labels derived from them in bench_labels.py -- are identical on every
machine.

Usage (from anywhere; it runs hyperfine from the repository root):
  cli_bench.py [--warmup N] [--runs N] [--out-dir DIR] [--no-fastfetch]
  cli_bench.py --self-test

Writes `hyperfine_<mode>.json` per mode into --out-dir (default: the current directory),
which is the glob `parse_criterion.py` collects.
"""

import argparse
import os
import platform
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastfetch_configs import MODES, REPO_ROOT  # noqa: E402

MODE_NAMES = tuple(mode for mode, _ in MODES)


def retch_binary(system=None):
    """The release binary, spelled the way the dashboard labels expect."""
    if (system or platform.system()) == "Windows":
        return r".\target\release\retch.exe"
    return "./target/release/retch"


def retch_command(mode, system=None):
    binary = retch_binary(system)
    return binary if mode == "default" else f"{binary} --{mode}"


def fastfetch_command(mode):
    # Forward slashes on every platform: Windows file APIs accept them, and one spelling
    # keeps the command string (and so the series label) the same everywhere.
    return f"fastfetch -c benches/fastfetch/{mode}.jsonc"


def export_name(mode):
    return f"hyperfine_{mode}.json"


def pairs(system=None, with_fastfetch=True):
    """[(mode, [commands])] in mode order."""
    out = []
    for mode in MODE_NAMES:
        cmds = [retch_command(mode, system)]
        if with_fastfetch:
            cmds.append(fastfetch_command(mode))
        out.append((mode, cmds))
    return out


def run(warmup, runs, out_dir, with_fastfetch=True):
    """Run every pair; return the list of JSON files written. Raises on any hyperfine failure."""
    out_dir = os.path.abspath(out_dir)
    if with_fastfetch:
        # Record WHICH fastfetch was measured; the dashboard cannot, and it changes on its own.
        version = subprocess.run(["fastfetch", "--version"], capture_output=True, text=True)
        print(f"fastfetch: {version.stdout.strip() or '(no version output)'}", flush=True)
    written = []
    for mode, cmds in pairs(with_fastfetch=with_fastfetch):
        path = os.path.join(out_dir, export_name(mode))
        print(f"\n=== {mode}: {' vs '.join(cmds)}", flush=True)
        subprocess.run(["hyperfine", "--warmup", str(warmup), "--runs", str(runs),
                        "--export-json", path, *cmds], cwd=REPO_ROOT, check=True)
        written.append(path)
    return written


def _self_test():
    from bench_labels import EXPECTED_LABELS, label_for_command

    failures = []

    def expect(name, cond, detail=""):
        if not cond:
            failures.append(f"{name}: {detail}")

    expect("four modes, least to most verbose",
           MODE_NAMES == ("short", "default", "long", "full"), str(MODE_NAMES))
    for system in ("Linux", "Darwin", "Windows"):
        labels = [label_for_command(c) for _, cmds in pairs(system) for c in cmds]
        expect(f"{system}: every command maps to an expected series",
               set(labels) == set(EXPECTED_LABELS),
               f"produced {sorted(set(labels))}, expected {sorted(EXPECTED_LABELS)}")
        expect(f"{system}: no two commands share a series", len(labels) == len(set(labels)),
               str(labels))
    for mode in MODE_NAMES:
        path = os.path.join(REPO_ROOT, "benches", "fastfetch", f"{mode}.jsonc")
        expect(f"{mode} config exists", os.path.isfile(path), path)
        expect(f"{mode} export matches parse_criterion's glob",
               export_name(mode).startswith("hyperfine_") and export_name(mode).endswith(".json"))
    expect("default mode passes no flag", retch_command("default", "Linux") == "./target/release/retch")
    expect("full mode passes --full", retch_command("full", "Windows").endswith("retch.exe --full"))

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"cli_bench.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("cli_bench.py self-test passed")
    return 0


def main(argv):
    if argv == ["--self-test"]:
        return _self_test()
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--warmup", type=int, default=3)
    ap.add_argument("--runs", type=int, default=10)
    ap.add_argument("--out-dir", default=".")
    ap.add_argument("--no-fastfetch", action="store_true",
                    help="benchmark retch alone (fastfetch not installed)")
    args = ap.parse_args(argv)
    if not shutil.which("hyperfine"):
        print("cli_bench: hyperfine not found (cargo install hyperfine)", file=sys.stderr)
        return 1
    with_ff = not args.no_fastfetch
    if with_ff and not shutil.which("fastfetch"):
        print("cli_bench: fastfetch not found; pass --no-fastfetch to benchmark retch alone",
              file=sys.stderr)
        return 1
    run(args.warmup, args.runs, args.out_dir, with_ff)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
