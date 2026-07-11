#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""
Updates WIP.md after merging a feature branch to main.
Sets Active Branch to none and updates the latest commit details from git.
WIP.md is an ongoing, rolling log — this only rewrites the Active-Branch and
latest-commit lines; it preserves the notes and open-task sections.
"""

import subprocess
import re
import sys
from pathlib import Path

def run(cmd):
    try:
        # encoding="utf-8" (not the platform default) so commit subjects with
        # non-Latin-1 characters — e.g. "→" or an em-dash, both common in this
        # repo's merge subjects — decode correctly on Windows (cp1252) too.
        return subprocess.run(
            cmd, capture_output=True, text=True, encoding="utf-8", check=True
        ).stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {' '.join(cmd)}", file=sys.stderr)
        if e.stdout:
            print(e.stdout, file=sys.stderr)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        sys.exit(e.returncode)

def read_cargo_version(root_dir):
    """Return the package version from Cargo.toml, or None if unreadable.

    Matches the first top-level ``version = "..."`` line — the same heuristic
    ``just man`` uses — which is the ``[package]`` version (the workspace table
    has no version key).
    """
    cargo_file = root_dir / "Cargo.toml"
    try:
        for line in cargo_file.read_text(encoding="utf-8").splitlines():
            m = re.match(r'version\s*=\s*"([^"]+)"', line)
            if m:
                return m.group(1)
    except OSError:
        pass
    return None

def main():
    # WIP.md and this repo's commit subjects contain non-Latin-1 characters
    # (em-dashes, "→"). Force UTF-8 on stdout so the final status print does not
    # crash under a cp1252 console on Windows (where `just merge-pr` runs it).
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    root_dir = Path(__file__).resolve().parent.parent
    wip_file = root_dir / "WIP.md"
    if not wip_file.exists():
        print("WIP.md not found. Skipping update.", file=sys.stderr)
        return

    # Get latest commit info on main
    commit_hash = run(["git", "rev-parse", "--short", "HEAD"])
    commit_msg = run(["git", "log", "-1", "--format=%s"])
    
    text = wip_file.read_text(encoding="utf-8")
    
    # 1. Update Active Branch to none.
    #    count=1: only the first (top-of-file header) occurrence — guards against
    #    the header string also appearing in the notes/open-task prose below.
    text = re.sub(
        r'### Active Branch:.*',
        '### Active Branch: none (main is current)',
        text,
        count=1,
    )
    
    # 2. Update the "main HEAD" pointer to the latest commit on main.
    #    WIP.md format: **main HEAD**: `<hash>` — <subject> — **v<version>**
    #    (Older WIPs used a "**Latest commit on main**:" line; that header no
    #    longer exists, which is why this substitution previously silently
    #    no-op'd and left the pointer stale after a merge.)
    #    A function replacement is used so any regex-metacharacters in the
    #    commit subject (e.g. "\1", "\g") are treated literally, not as
    #    backreferences.
    #    count=1: the header string also appears verbatim in the notes/open-task
    #    prose, so an unbounded sub would rewrite those lines too — only the first
    #    (top-of-file header) occurrence must be touched.
    version = read_cargo_version(root_dir)
    version_suffix = f" — **v{version}**" if version else ""
    new_head_line = f'**main HEAD**: `{commit_hash}` — {commit_msg}{version_suffix}'
    text = re.sub(
        r'\*\*main HEAD\*\*:.*',
        lambda _m: new_head_line,
        text,
        count=1,
    )

    wip_file.write_text(text, encoding="utf-8")
    print(f"Updated WIP.md: Active Branch set to none, main HEAD updated to {new_head_line}")

if __name__ == "__main__":
    main()
