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

def hex_to_sri(hex_str):
    # Convert hex string to bytes
    hash_bytes = codecs.decode(hex_str.strip(), 'hex')
    # Base64 encode
    b64_str = base64.b64encode(hash_bytes).decode('utf-8')
    return f"sha256-{b64_str}"

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
        res = run_cmd(["nix-prefetch-url", "--unpack", "--type", "sha256", url], check=False)
        if res.returncode == 0:
            src_hash_sri = hex_to_sri(res.stdout.strip())
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

        # Replace placeholders and version
        content = re.sub(r'version = ".*";', f'version = "{version}";', content)
        content = re.sub(r'hash = lib.fakeHash;', f'hash = "{src_hash_sri}";', content)
        # Use dummy valid SRI hash to trigger cargoHash mismatch
        dummy_sri = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
        content = re.sub(r'cargoHash = lib.fakeHash;', f'cargoHash = "{dummy_sri}";', content)

        with open(temp_package, "w") as f:
            f.write(content)

        # Run nix-build to trigger hash mismatch error
        expr = f"with import <nixpkgs> {{}}; callPackage {temp_package} {{}}"
        res = run_cmd(["nix-build", "--no-out-link", "-E", expr], check=False)

        # Parse stderr for the got: hash
        stderr = res.stderr
        cargo_hash = None
        
        # Search for SRI hash mismatch pattern
        m = re.search(r'specified:\s+sha256-A+.*\n\s+got:\s+(sha256-\S+)', stderr)
        if m:
            cargo_hash = m.group(1)
        else:
            # Fallback regex for standard sha256- SRI format
            hashes = re.findall(r'sha256-[a-zA-Z0-9+/=]{44}', stderr)
            for h in hashes:
                if "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" not in h:
                    cargo_hash = h
                    break

        if not cargo_hash:
            print("Error: Could not extract cargo vendor hash from nix-build output.", file=sys.stderr)
            print(f"Build Output:\n{stderr}", file=sys.stderr)
            sys.exit(1)

        print(f"Cargo Hash: {cargo_hash}")

        # 4. Update the package.nix file in-place if running locally
        if "GITHUB_ACTIONS" not in os.environ:
            print("Updating packaging/nixpkgs/package.nix in-place...")
            with open("packaging/nixpkgs/package.nix", "r") as f:
                orig_content = f.read()

            new_content = re.sub(r'version = ".*";', f'version = "{version}";', orig_content)
            new_content = re.sub(r'hash = lib.fakeHash;', f'hash = "{src_hash_sri}";', new_content)
            new_content = re.sub(r'cargoHash = lib.fakeHash;', f'cargoHash = "{cargo_hash}";', new_content)

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
