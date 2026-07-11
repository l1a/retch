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
        return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {' '.join(cmd)}", file=sys.stderr)
        if e.stdout:
            print(e.stdout, file=sys.stderr)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        sys.exit(e.returncode)

def main():
    root_dir = Path(__file__).resolve().parent.parent
    wip_file = root_dir / "WIP.md"
    if not wip_file.exists():
        print("WIP.md not found. Skipping update.", file=sys.stderr)
        return

    # Get latest commit info on main
    commit_hash = run(["git", "rev-parse", "--short", "HEAD"])
    commit_msg = run(["git", "log", "-1", "--format=%s"])
    
    text = wip_file.read_text()
    
    # 1. Update Active Branch to none
    text = re.sub(
        r'### Active Branch:.*',
        '### Active Branch: none (main is current)',
        text
    )
    
    # 2. Update Latest commit on main
    text = re.sub(
        r'\*\*Latest commit on main\*\*:\s*[0-9a-f]+.*',
        f'**Latest commit on main**: {commit_hash} ({commit_msg})',
        text
    )
    
    wip_file.write_text(text)
    print(f"Updated WIP.md: Active Branch set to none, Latest commit updated to {commit_hash} ({commit_msg})")

if __name__ == "__main__":
    main()
