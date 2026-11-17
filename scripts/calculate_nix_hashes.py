#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PACKAGE_NIX = REPO / "packaging" / "nixpkgs" / "package.nix"


class AnchorError(ValueError):
    """Raised when a required Nix assignment anchor is missing from package.nix."""


def to_sri(hash_str):
    # Run nix hash to-sri to convert hash format to SRI
    res = run_cmd(["nix", "hash", "to-sri", "--type", "sha256", hash_str.strip()])
    return res.stdout.strip()


def substitute_package_nix(content, version, src_hash, cargo_hash):
    """Return `package.nix` content with version/hash/cargoHash replaced.

    Each pattern matches BOTH template sentinels (`"@VERSION@"`, `"@SRC_HASH@"`,
    `"@CARGO_HASH@"`), `lib.fakeHash`, and an already-filled `"sha256-..."` literal,
    and both hash patterns are line-anchored so `hash` can never match `cargoHash`.

    This matters: the original version matched only `lib.fakeHash`, so once package.nix
    had been filled in with real values every substitution silently became a no-op. The
    temp build then still carried the *previous release's* hashes, failed on a source-hash
    mismatch instead of the intended cargoHash mismatch, and the caller reported that stale
    source hash as the new cargoHash — which is how v0.6.12 shipped a `cargoHash` equal to
    v0.6.8's `hash`. A substitution that matches nothing now raises `AnchorError` rather
    than leaving a silent stale build.
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
            raise AnchorError(
                f"no '{label}' assignment found in packaging/nixpkgs/package.nix; "
                "the substitution anchors are out of date."
            )
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

def _self_test() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    if not PACKAGE_NIX.is_file():
        print(f"Error: {PACKAGE_NIX} does not exist", file=sys.stderr)
        return 1

    template = PACKAGE_NIX.read_text(encoding="utf-8")
    src1 = "sha256-08nsxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM1g="
    cargo1 = "sha256-19otxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM2h="
    src2 = "sha256-20puxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM3i="
    cargo2 = "sha256-31qvxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM4j="

    rendered1 = substitute_package_nix(template, "1.2.3", src1, cargo1)
    check("first render version", '  version = "1.2.3";' in rendered1, rendered1)
    check("first render src hash", f'    hash = "{src1}";' in rendered1, rendered1)
    check("first render cargoHash", f'  cargoHash = "{cargo1}";' in rendered1, rendered1)
    check("first render no sentinels", "@VERSION@" not in rendered1 and "@SRC_HASH@" not in rendered1 and "@CARGO_HASH@" not in rendered1, rendered1)

    rendered2 = substitute_package_nix(rendered1, "1.2.4", src2, cargo2)
    check("second render version", '  version = "1.2.4";' in rendered2, rendered2)
    check("second render src hash", f'    hash = "{src2}";' in rendered2, rendered2)
    check("second render cargoHash", f'  cargoHash = "{cargo2}";' in rendered2, rendered2)

    try:
        substitute_package_nix(template.replace('  version = "@VERSION@";\n', ""), "1.2.3", src1, cargo1)
        check("missing version anchor raises", False, "substitute_package_nix did not raise AnchorError")
    except AnchorError:
        pass

    dummy_sri = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
    good_err = (
        "error: hash mismatch in fixed-output derivation '/nix/store/...-retch-1.2.3-vendor.drv':\n"
        f"         specified: {dummy_sri}\n"
        f"            got:    {cargo1}\n"
    )
    check(
        "extract_cargo_hash matches valid mismatch",
        extract_cargo_hash(good_err, dummy_sri) == cargo1,
        f"got {extract_cargo_hash(good_err, dummy_sri)!r}",
    )

    unrelated_err = (
        "error: hash mismatch in fixed-output derivation '/nix/store/...-source.drv':\n"
        f"         specified: {src1}\n"
        f"            got:    {src2}\n"
    )
    check(
        "extract_cargo_hash refuses unrelated source mismatch",
        extract_cargo_hash(unrelated_err, dummy_sri) is None,
        f"got {extract_cargo_hash(unrelated_err, dummy_sri)!r}",
    )

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"calculate_nix_hashes.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("calculate_nix_hashes.py self-test passed")
    return 0


def main():
    ap = argparse.ArgumentParser(description="Calculate Nixpkgs source and Cargo vendor hashes for retch.")
    ap.add_argument("version", nargs="?", help="Release version (default: GITHUB_REF_NAME or Cargo.toml)")
    ap.add_argument("--out", help="Write rendered package.nix to this path when running locally")
    ap.add_argument("--self-test", action="store_true", help="Run offline built-in self-tests and exit")
    args = ap.parse_args()

    if args.self_test:
        sys.exit(_self_test())

    if not shutil.which("nix-prefetch-url"):
        print("Error: nix-prefetch-url is not installed or not in PATH.", file=sys.stderr)
        print("Please install Nix to use this script.", file=sys.stderr)
        sys.exit(1)

    # 1. Determine version
    version = args.version
    if not version and "GITHUB_REF_NAME" in os.environ and os.environ["GITHUB_REF_NAME"].startswith("v"):
        version = os.environ["GITHUB_REF_NAME"][1:]
    if not version:
        # Read from Cargo.toml
        try:
            with open(REPO / "Cargo.toml", "r", encoding="utf-8") as f:
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

        orig_content = PACKAGE_NIX.read_text(encoding="utf-8")

        # Use dummy valid SRI hash to trigger cargoHash mismatch
        dummy_sri = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
        try:
            content = substitute_package_nix(orig_content, version, src_hash_sri, dummy_sri)
        except AnchorError as exc:
            print(f"Error: {exc}", file=sys.stderr)
            sys.exit(1)

        with open(temp_package, "w", encoding="utf-8", newline="\n") as f:
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

        # 4. Print output block and optionally write a rendered file (without dirtying the template)
        print("\n" + "="*40)
        print("NIXPKGS PACKAGE SNIPPET FOR RELEASE NOTES")
        print("="*40)
        print(f"version = \"{version}\";")
        print(f"hash = \"{src_hash_sri}\";")
        print(f"cargoHash = \"{cargo_hash}\";")
        print("="*40 + "\n")

        if "GITHUB_ACTIONS" not in os.environ:
            if args.out:
                try:
                    new_content = substitute_package_nix(
                        orig_content, version, src_hash_sri, cargo_hash
                    )
                except AnchorError as exc:
                    print(f"Error: {exc}", file=sys.stderr)
                    sys.exit(1)
                out_path = Path(args.out)
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_path.write_text(new_content, encoding="utf-8", newline="\n")
                print(f"Wrote rendered package.nix to {out_path}")
        else:
            # Write values to GitHub output if running in Github Actions
            if "GITHUB_OUTPUT" in os.environ:
                with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as f:
                    f.write(f"version={version}\n")
                    f.write(f"src_hash={src_hash_sri}\n")
                    f.write(f"cargo_hash={cargo_hash}\n")

if __name__ == "__main__":
    main()
