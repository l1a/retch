#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""
Automates the full retch → nixpkgs release pipeline (no Nix required):

  1. Create and push git tag vX.Y.Z (skipped if tag already exists)
  2. Poll GitHub releases until the CI-computed nix hashes appear in the release body
  3. In the nixpkgs fork:
       - Create a fresh branch from upstream/master
       - Update pkgs/by-name/re/retch/package.nix (version + hashes)
       - Single commit: "retch: OLD -> NEW" with Assisted-by trailer
       - Force-push to origin
  4. Open a PR against NixOS/nixpkgs

Usage:
    python3 scripts/nixpkgs_release.py [VERSION]
    just nixpkgs-release [VERSION]

Environment:
    NIXPKGS_DIR   Path to your local nixpkgs fork clone.
                  Default: ~/git/nixpkgs
    RETCH_REPO    GitHub slug for retch.  Default: l1a/retch
    NIXPKGS_FORK  Your GitHub username for the nixpkgs fork.  Default: l1a
"""

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

RETCH_REPO = os.environ.get("RETCH_REPO", "l1a/retch")
NIXPKGS_REPO = "nixos/nixpkgs"
NIXPKGS_FORK = os.environ.get("NIXPKGS_FORK", "l1a")
AI_TRAILER = "Assisted-by: Claude Code (claude-sonnet-4-6)"

POLL_INTERVAL = 20   # seconds between release polls
POLL_TIMEOUT  = 600  # seconds before giving up


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


def cargo_version():
    with open("Cargo.toml") as f:
        for line in f:
            if line.startswith("version ="):
                return line.split("=", 1)[1].strip().strip('"')
    raise RuntimeError("Could not read version from Cargo.toml")


def nixpkgs_current_version(nixpkgs_dir: Path):
    pkg = nixpkgs_dir / "pkgs/by-name/re/retch/package.nix"
    if not pkg.exists():
        return None
    m = re.search(r'version = "([^"]+)"', pkg.read_text())
    return m.group(1) if m else None


def tag_and_push(version: str):
    tag = f"v{version}"
    existing = run(["git", "tag", "--list", tag]).stdout.strip()
    if existing:
        print(f"Tag {tag} already exists locally — skipping creation.")
    else:
        run(["git", "tag", tag])
        print(f"Created tag {tag}.")
    run(["git", "push", "origin", tag])
    print(f"Pushed {tag}.")


def wait_for_hashes(version: str):
    tag = f"v{version}"
    print(f"Polling for GitHub release {tag} with nix hashes (timeout {POLL_TIMEOUT}s)...")
    deadline = time.monotonic() + POLL_TIMEOUT
    while time.monotonic() < deadline:
        r = run(["gh", "release", "view", tag, "--repo", RETCH_REPO, "--json", "body"], check=False)
        if r.returncode == 0:
            body = json.loads(r.stdout).get("body", "")
            src   = re.search(r'hash = "(sha256-[A-Za-z0-9+/=]+)"', body)
            cargo = re.search(r'cargoHash = "(sha256-[A-Za-z0-9+/=]+)"', body)
            if src and cargo:
                print(f"  hash      = {src.group(1)}")
                print(f"  cargoHash = {cargo.group(1)}")
                return src.group(1), cargo.group(1)
        remaining = int(deadline - time.monotonic())
        print(f"  Hashes not in release yet — retrying in {POLL_INTERVAL}s ({remaining}s left)...")
        time.sleep(POLL_INTERVAL)
    raise RuntimeError(f"Timed out waiting for release {tag} to contain nix hashes.")


def apply_package_update(nixpkgs_dir: Path, old_version: str | None, new_version: str,
                         src_hash: str, cargo_hash: str):
    pkg = nixpkgs_dir / "pkgs/by-name/re/retch/package.nix"
    text = pkg.read_text()
    text = re.sub(r'version = "[^"]+";',  f'version = "{new_version}";', text)
    text = re.sub(r'hash = "sha256-[^"]+";',      f'hash = "{src_hash}";',   text)
    text = re.sub(r'cargoHash = "sha256-[^"]+";', f'cargoHash = "{cargo_hash}";', text)
    pkg.write_text(text)
    print(f"Updated {pkg.relative_to(nixpkgs_dir)}")


def make_commit_message(old_version: str | None, new_version: str) -> str:
    subject = (f"retch: init at {new_version}" if old_version is None
               else f"retch: {old_version} -> {new_version}")
    return f"{subject}\n\n{AI_TRAILER}"


def make_pr_title(old_version: str | None, new_version: str) -> str:
    if old_version is None:
        return f"retch: init at {new_version}"
    return f"retch: {old_version} -> {new_version}"


def make_pr_body(old_version: str | None, new_version: str) -> str:
    if old_version is None:
        summary = (
            "retch is a fast, feature-rich system information fetcher written in Rust. "
            "It uses scoped threads to run slow external queries (GPU, battery, network, "
            "motherboard, cameras, etc.) concurrently, with support for Linux, macOS, and "
            "Windows, ASCII/graphical distro logos, theming, and shell completions.\n\n"
            f"- Homepage: https://github.com/l1a/retch\n"
            f"- License: GPLv3"
        )
    else:
        summary = (
            f"Update retch from {old_version} to {new_version}.\n\n"
            f"Changelog: https://github.com/l1a/retch/releases/tag/v{new_version}"
        )

    return f"""{summary}

> **AI Disclosure**: This PR was prepared with assistance from Claude Code (claude-sonnet-4-6). The derivation was reviewed and tested by the submitter. See the `Assisted-by:` trailer in the commit.

## Things done

- Built on platform:
  - [x] x86_64-linux
  - [ ] aarch64-linux
  - [ ] aarch64-darwin
- Tested, as applicable:
  - [ ] [NixOS tests] in [nixos/tests].
  - [ ] [Package tests] at `passthru.tests`.
  - [ ] Tests in [lib/tests] or [pkgs/test] for functions and "core" functionality.
- [ ] Ran `nixpkgs-review` on this PR. See [nixpkgs-review usage].
- [x] Tested basic functionality of all binary files, usually in `./result/bin/`.
- Nixpkgs Release Notes
  - [ ] Package update: when the change is major or breaking.
- NixOS Release Notes
  - [ ] Module addition: when adding a new NixOS module.
  - [ ] Module update: when the change is significant.
- [x] Fits [CONTRIBUTING.md], [pkgs/README.md], [maintainers/README.md] and other READMEs.
- [x] Follows the [automation/AI policy].

[NixOS tests]: https://nixos.org/manual/nixos/unstable/index.html#sec-nixos-tests
[Package tests]: https://github.com/NixOS/nixpkgs/blob/master/pkgs/README.md#package-tests
[nixpkgs-review usage]: https://github.com/Mic92/nixpkgs-review#usage
[CONTRIBUTING.md]: https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md
[automation/AI policy]: https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md#automationai-policy
[lib/tests]: https://github.com/NixOS/nixpkgs/blob/master/lib/tests
[maintainers/README.md]: https://github.com/NixOS/nixpkgs/blob/master/maintainers/README.md
[nixos/tests]: https://github.com/NixOS/nixpkgs/blob/master/nixos/tests
[pkgs/test]: https://github.com/NixOS/nixpkgs/blob/master/pkgs/test"""


def main():
    nixpkgs_dir = Path(os.environ.get("NIXPKGS_DIR", Path.home() / "git/nixpkgs")).expanduser()
    if not nixpkgs_dir.is_dir():
        print(f"Error: nixpkgs directory not found: {nixpkgs_dir}", file=sys.stderr)
        print("Set NIXPKGS_DIR to your local nixpkgs fork clone.", file=sys.stderr)
        sys.exit(1)

    new_version = sys.argv[1] if len(sys.argv) > 1 else cargo_version()
    old_version = nixpkgs_current_version(nixpkgs_dir)
    print(f"retch {old_version or '(new)'} → {new_version}")

    if old_version == new_version:
        print("nixpkgs is already at this version. Nothing to do.")
        sys.exit(0)

    # Step 1 — tag
    tag_and_push(new_version)

    # Step 2 — wait for CI to publish release with hashes
    src_hash, cargo_hash = wait_for_hashes(new_version)

    # Step 3 — update nixpkgs fork
    branch = f"retch-{new_version}"

    print(f"\nUpdating nixpkgs fork in {nixpkgs_dir}...")
    run(["git", "fetch", "upstream"], cwd=nixpkgs_dir, check=False)

    existing_branches = run(["git", "branch", "--list", branch], cwd=nixpkgs_dir).stdout
    if branch in existing_branches:
        run(["git", "checkout", branch], cwd=nixpkgs_dir)
        run(["git", "reset", "--hard", "upstream/master"], cwd=nixpkgs_dir)
    else:
        run(["git", "checkout", "-b", branch, "upstream/master"], cwd=nixpkgs_dir)

    apply_package_update(nixpkgs_dir, old_version, new_version, src_hash, cargo_hash)

    run(["git", "add", "pkgs/by-name/re/retch/package.nix"], cwd=nixpkgs_dir)
    run(["git", "commit", "-m", make_commit_message(old_version, new_version)], cwd=nixpkgs_dir)
    run(["git", "push", "--force", "origin", branch], cwd=nixpkgs_dir)
    print(f"Pushed branch {branch} to fork.")

    # Step 4 — open PR
    print("\nOpening PR against NixOS/nixpkgs...")
    r = run([
        "gh", "pr", "create",
        "--repo", NIXPKGS_REPO,
        "--base", "master",
        "--head", f"{NIXPKGS_FORK}:{branch}",
        "--title", make_pr_title(old_version, new_version),
        "--body",  make_pr_body(old_version, new_version),
    ], check=False)

    if r.returncode == 0:
        print(f"PR created: {r.stdout.strip()}")
    else:
        print("PR creation failed (it may already exist):", r.stderr.strip(), file=sys.stderr)
        sys.exit(r.returncode)


if __name__ == "__main__":
    main()
