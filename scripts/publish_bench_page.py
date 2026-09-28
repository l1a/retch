#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""Publish the benchmark dashboard page (benches/dashboard/) to gh-pages dev/bench/.

The page lives in the repository so it is reviewed like code; gh-pages only receives copies.
github-action-benchmark writes its stock index.html only when none exists, so a published
page is never overwritten by CI.

Usage: publish_bench_page.py [--dry-run]
  --dry-run  clone, copy, show the staged diff, and stop (nothing is pushed).
Asks before pushing; BENCH_PAGE_CONFIRM=y answers without a terminal.
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import time

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(REPO_ROOT, "benches", "dashboard")
FILES = ("index.html", "model.js")
TARGET = "dev/bench"
BRANCH = "gh-pages"
MAX_RETRIES = 3


def git(*args, capture=False):
    return subprocess.run(["git", *args], check=True, text=True,
                          capture_output=capture).stdout if capture else \
        subprocess.run(["git", *args], check=True)


def confirm():
    answer = os.environ.get("BENCH_PAGE_CONFIRM")
    if answer is not None:
        print(f"Publish the dashboard page to gh-pages? [y/N] {answer}   (answered by BENCH_PAGE_CONFIRM)")
    elif sys.stdin.isatty():
        answer = input("Publish the dashboard page to gh-pages? [y/N] ")
    else:
        print("No terminal to confirm on; re-run with BENCH_PAGE_CONFIRM=y.", file=sys.stderr)
        return False
    return answer.strip().lower() in ("y", "yes")


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args(argv)

    missing = [f for f in FILES if not os.path.isfile(os.path.join(SOURCE, f))]
    if missing:
        print(f"missing in benches/dashboard: {missing}", file=sys.stderr)
        return 1
    origin = git("-C", REPO_ROOT, "remote", "get-url", "origin", capture=True).strip()

    for attempt in range(1, MAX_RETRIES + 1):
        with tempfile.TemporaryDirectory() as tmp:
            clone = os.path.join(tmp, "gh-pages")
            git("clone", "--quiet", "--branch", BRANCH, "--single-branch", "--depth", "1",
                origin, clone)
            for f in FILES:
                shutil.copyfile(os.path.join(SOURCE, f), os.path.join(clone, TARGET, f))
            git("-C", clone, "add", *[f"{TARGET}/{f}" for f in FILES])
            stat = git("-C", clone, "diff", "--cached", "--stat", capture=True)
            if not stat.strip():
                print("gh-pages already has this page; nothing to publish.")
                return 0
            print(stat)
            if args.dry_run:
                print("--- DRY RUN: not pushing. ---")
                return 0
            if attempt == 1 and not confirm():
                print("Aborted.")
                return 1
            git("-C", clone, "commit", "--quiet", "-m", "bench: publish dashboard page")
            try:
                git("-C", clone, "push", "--quiet", origin, f"HEAD:{BRANCH}")
                print("Published the dashboard page to gh-pages.")
                return 0
            except subprocess.CalledProcessError:
                if attempt == MAX_RETRIES:
                    print("Push failed after retries.", file=sys.stderr)
                    return 1
                print("Push rejected (a concurrent benchmark push?) - retrying...")
                time.sleep(2 ** attempt)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
