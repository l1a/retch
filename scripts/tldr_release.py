#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""
Automates the submission of the retch tldr page to the upstream tldr-pages/tldr repository.

Steps:
  1. Fork and clone tldr-pages/tldr using the GitHub CLI (gh)
  2. Copy docs/retch.md to pages/common/retch.md
  3. Commit and push to the fork
  4. Open a Pull Request against tldr-pages/tldr

Usage:
    python3 scripts/tldr_release.py
"""

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

TLDR_REPO = "tldr-pages/tldr"
AI_TRAILER = "Assisted-by: Gemini 3.5 Flash"

def run(cmd, *, check=True, cwd=None):
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if check and result.returncode != 0:
        print(f"Command failed: {' '.join(str(c) for c in cmd)}", file=sys.stderr)
        if result.stdout:
            print(result.stdout, file=sys.stderr)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        sys.exit(result.returncode)
    return result

def main():
    # 1. Verify gh CLI is installed and authenticated
    if not shutil.which("gh"):
        print("Error: 'gh' CLI tool is required but not found in PATH.", file=sys.stderr)
        sys.exit(1)
        
    auth_check = run(["gh", "auth", "status"], check=False)
    if auth_check.returncode != 0:
        print("Error: GitHub CLI (gh) is not authenticated. Please run 'gh auth login'.", file=sys.stderr)
        sys.exit(1)

    root_dir = Path(__file__).resolve().parent.parent
    local_page = root_dir / "docs" / "retch.md"
    if not local_page.exists():
        print(f"Error: Local tldr page not found at {local_page}", file=sys.stderr)
        sys.exit(1)

    print("Forking and cloning upstream tldr-pages/tldr...")
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        # Fork the repo into the temp directory
        run(["gh", "repo", "fork", TLDR_REPO, "--clone", "--dir", str(tmp_path)])
        
        # Verify the target directory path exists in the cloned repository
        target_dir = tmp_path / "pages" / "common"
        if not target_dir.exists():
            print(f"Error: Target directory {target_dir} not found in cloned tldr repo.", file=sys.stderr)
            sys.exit(1)
            
        target_file = target_dir / "retch.md"
        is_update = target_file.exists()
        
        # Copy our local page to the cloned repository
        shutil.copy(local_page, target_file)
        
        # Create a new branch
        branch_name = "add-retch-page" if not is_update else "update-retch-page"
        run(["git", "checkout", "-b", branch_name], cwd=tmp_path)
        
        # Commit the changes
        run(["git", "add", "pages/common/retch.md"], cwd=tmp_path)
        
        action = "add" if not is_update else "update"
        commit_msg = f"retch: {action} page\n\n{AI_TRAILER}"
        run(["git", "commit", "-m", commit_msg], cwd=tmp_path)
        
        # Push the branch to user's fork
        print("Pushing branch to your fork...")
        run(["git", "push", "--force", "origin", branch_name], cwd=tmp_path)
        
        # Open a PR against upstream
        print("Opening Pull Request on tldr-pages/tldr...")
        pr_title = f"retch: {action} page"
        pr_body = (
            f"This PR {action}s the tldr-page entry for the `retch` system information fetcher.\n\n"
            f"Command repository: https://github.com/l1a/retch\n\n"
            f"Assisted-by: Gemini 3.5 Flash"
        )
        
        pr_cmd = [
            "gh", "pr", "create",
            "--repo", TLDR_REPO,
            "--title", pr_title,
            "--body", pr_body,
            "--head", branch_name
        ]
        pr_result = run(pr_cmd, cwd=tmp_path)
        print("\nSuccess! Pull Request created upstream:")
        print(pr_result.stdout.strip())

if __name__ == "__main__":
    main()
