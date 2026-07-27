#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias

import os
import sys
import re
import shutil
import urllib.request
import subprocess
import tempfile
import base64
import codecs
import time

def to_sri(hash_str):
    # Run nix hash to-sri to convert hash format to SRI
    res = run_cmd(["nix", "hash", "to-sri", "--type", "sha256", hash_str.strip()])
    return res.stdout.strip()

def substitute_package_nix(content, version, src_hash, cargo_hash):
    """Return `package.nix` content with version/hash/cargoHash replaced.

    Each pattern matches BOTH the `lib.fakeHash` placeholder and an already-filled
    `"sha256-..."` literal, and both hash patterns are line-anchored so `hash` can never
    match the tail of `cargoHash`.

    This matters: the original version matched only `lib.fakeHash`, so once package.nix
    had been filled in with real values every substitution silently became a no-op. The
    temp build then still carried the *previous release's* hashes, failed on a source-hash
    mismatch instead of the intended cargoHash mismatch, and the caller reported that stale
    source hash as the new cargoHash — which is how v0.6.12 shipped a `cargoHash` equal to
    v0.6.8's `hash`. A substitution that matches nothing is now a hard error rather than a
    silent stale build.
    """
    hash_value = r'(?:lib\.fakeHash|"[^"]*")'
    substitutions = (
        ("version", r'(?m)^(\s*)version = ".*";', rf'\g<1>version = "{version}";'),
        ("hash", rf'(?m)^(\s*)hash = {hash_value};', rf'\g<1>hash = "{src_hash}";'),
        (
            "cargoHash",
            rf'(?m)^(\s*)cargoHash = {hash_value};',
            rf'\g<1>cargoHash = "{cargo_hash}";',
        ),
    )
    for label, pattern, replacement in substitutions:
        content, count = re.subn(pattern, replacement, content)
        if count == 0:
            print(
                f"Error: no '{label}' assignment found in packaging/nixpkgs/package.nix; "
                "the substitution anchors are out of date.",
                file=sys.stderr,
            )
            sys.exit(1)
    return content


def extract_cargo_hash(stderr, dummy_sri):
    """Extract the real cargo vendor hash from a nix-build hash-mismatch report.

    Returns `None` when the output cannot be attributed with confidence, so the caller
    fails loudly instead of guessing.

    Only a mismatch reported against OUR dummy counts: `specified:` must name `dummy_sri`
    and `got:` carries the real hash. The previous implementation fell back to "the first
    sha256- literal in the output that isn't the dummy", which would happily return a hash
    belonging to an *unrelated* mismatch — most damagingly a source-hash failure, whose
    first hash is the stale `hash` value. That is precisely how v0.6.12 published a
    cargoHash equal to v0.6.8's src hash. A wrong-but-well-formed hash is indistinguishable
    from a right one downstream, so an unattributable output must be an error, not a guess.
    """
    m = re.search(
        r'specified:\s+' + re.escape(dummy_sri) + r'\s*\n\s+got:\s+(sha256-\S+)', stderr
    )
    if m:
        return m.group(1)

    # Tolerate ordering/formatting drift in nix's message, but still require the dummy to
    # appear (proving this is our cargoHash mismatch) alongside a distinct `got:` hash.
    m = re.search(r'got:\s+(sha256-\S+)', stderr)
    if m and dummy_sri in stderr and m.group(1) != dummy_sri:
        return m.group(1)

    return None


def run_cmd(cmd, check=True):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if check and res.returncode != 0:
        print(f"Error running command: {' '.join(cmd)}", file=sys.stderr)
        print(f"Stdout:\n{res.stdout}", file=sys.stderr)
        print(f"Stderr:\n{res.stderr}", file=sys.stderr)
        sys.exit(res.returncode)
    return res

def main():
    if not shutil.which("nix-prefetch-url"):
        print("Error: nix-prefetch-url is not installed or not in PATH.", file=sys.stderr)
        print("Please install Nix to use this script.", file=sys.stderr)
        sys.exit(1)

    # 1. Determine version
    version = None
    if len(sys.argv) > 1:
        version = sys.argv[1]
    elif "GITHUB_REF_NAME" in os.environ and os.environ["GITHUB_REF_NAME"].startswith("v"):
        version = os.environ["GITHUB_REF_NAME"][1:]
    else:
        # Read from Cargo.toml
        try:
            with open("Cargo.toml", "r") as f:
                for line in f:
                    if line.startswith("version ="):
                        version = line.split("=")[1].strip().replace('"', '')
                        break
        except Exception as e:
            print(f"Error reading Cargo.toml: {e}", file=sys.stderr)
            sys.exit(1)

    if not version:
        print("Error: Could not determine version.", file=sys.stderr)
        sys.exit(1)

    print(f"Target version: {version}")

    # 2. Calculate source hash
    url = f"https://github.com/l1a/retch/archive/refs/tags/v{version}.tar.gz"
    print(f"Prefetching source archive from: {url}")

    src_hash_sri = None
    # Add retry loop for potential GitHub archive generation delay
    for attempt in range(1, 4):
        res = run_cmd(["nix-prefetch-url", "--unpack", url], check=False)
        if res.returncode == 0:
            src_hash_sri = to_sri(res.stdout.strip())
            break
        print(f"Attempt {attempt} failed. Retrying in 5 seconds...", file=sys.stderr)
        time.sleep(5)

    if not src_hash_sri:
        print("Error: Failed to prefetch source archive.", file=sys.stderr)
        sys.exit(1)

    print(f"Source Hash (SRI): {src_hash_sri}")

    # 3. Calculate cargo vendor hash via temporary build
    print("Calculating cargo vendor hash...")
    with tempfile.TemporaryDirectory() as tmpdir:
        temp_package = os.path.join(tmpdir, "package.nix")
        
        # Read the current package.nix
        with open("packaging/nixpkgs/package.nix", "r") as f:
            content = f.read()

        # Use dummy valid SRI hash to trigger cargoHash mismatch
        dummy_sri = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
        content = substitute_package_nix(content, version, src_hash_sri, dummy_sri)

        with open(temp_package, "w") as f:
            f.write(content)

        # Run nix-build to trigger hash mismatch error
        expr = f"with import <nixpkgs> {{}}; callPackage {temp_package} {{}}"
        res = run_cmd(["nix-build", "--no-out-link", "-E", expr], check=False)

        stderr = res.stderr
        cargo_hash = extract_cargo_hash(stderr, dummy_sri)

        if not cargo_hash:
            print("Error: Could not extract cargo vendor hash from nix-build output.", file=sys.stderr)
            print(
                "The build must fail with a cargoHash mismatch naming the dummy hash\n"
                f"  {dummy_sri}\n"
                "as 'specified:'. If it failed for another reason (e.g. a source-hash\n"
                "mismatch), fix that first — do NOT copy a hash out of the output by hand.",
                file=sys.stderr,
            )
            print(f"Build Output:\n{stderr}", file=sys.stderr)
            sys.exit(1)

        print(f"Cargo Hash: {cargo_hash}")

        # 4. Update the package.nix file in-place if running locally
        if "GITHUB_ACTIONS" not in os.environ:
            print("Updating packaging/nixpkgs/package.nix in-place...")
            with open("packaging/nixpkgs/package.nix", "r") as f:
                orig_content = f.read()

            # Same anchors as the temp build — see substitute_package_nix. This branch had
            # the identical `lib.fakeHash`-only bug, so a second local run silently left the
            # previous release's hashes in place.
            new_content = substitute_package_nix(
                orig_content, version, src_hash_sri, cargo_hash
            )

            with open("packaging/nixpkgs/package.nix", "w") as f:
                f.write(new_content)
            print("Successfully updated package.nix!")
        else:
            # Print output block for CI release notes
            print("\n" + "="*40)
            print("NIXPKGS PACKAGE SNIPPET FOR RELEASE NOTES")
            print("="*40)
            print(f"version = \"{version}\";")
            print(f"hash = \"{src_hash_sri}\";")
            print(f"cargoHash = \"{cargo_hash}\";")
            print("="*40 + "\n")

            # Write values to GitHub output if running in Github Actions
            if "GITHUB_OUTPUT" in os.environ:
                with open(os.environ["GITHUB_OUTPUT"], "a") as f:
                    f.write(f"version={version}\n")
                    f.write(f"src_hash={src_hash_sri}\n")
                    f.write(f"cargo_hash={cargo_hash}\n")

if __name__ == "__main__":
    main()
