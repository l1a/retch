#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Assert packaging/nixpkgs/package.nix is still a template that records no release.

WHY THIS EXISTS
---------------
`packaging/nixpkgs/package.nix` used to be the last hand-pinned packaging file in the
repository, frozen at 0.6.12 with a stale `sha256`, `cargoHash = lib.fakeHash`, and a
broken `mandown` man-page `postBuild` snippet. Like `packaging/{aur,copr,homebrew,scoop}`,
it now stays a zero-drift template carrying `@VERSION@`, `@SRC_HASH@`, and `@CARGO_HASH@`
sentinels; `scripts/render_packaging.py --target nix` and `scripts/calculate_nix_hashes.py`
substitute real values at release time without committing them back to the template.

WHAT IT CHECKS
--------------
All offline, deterministic and free:

  1. `version` is exactly `"@VERSION@"`.
  2. `rev` is `"v${version}"`.
  3. `hash` is exactly `"@SRC_HASH@"` and `cargoHash` is exactly `"@CARGO_HASH@"`.
  4. Nothing in the uncommented derivation body records a semver version, a 64-hex sha256
     digest, an SRI `sha256-...` digest, or `fakeHash`.
  5. `postInstall` installs the committed `docs/retch.1` via `installManPage` and does not
     reference `mandown` in any uncommented line.
  6. `postInstall` still installs shell completions via `installShellCompletion`.
  7. `packaging/nixpkgs/test.nix` overrides `version` from `../../Cargo.toml` via
     `builtins.fromTOML` so local Nix builds never inherit `"@VERSION@"` or hardcode a
     version string.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TEMPLATE_VERSION = 1

REPO = Path(__file__).resolve().parent.parent
PACKAGE_NIX = REPO / "packaging" / "nixpkgs" / "package.nix"
TEST_NIX = REPO / "packaging" / "nixpkgs" / "test.nix"

SHA256_RE = re.compile(r"\b[0-9a-fA-F]{64}\b")
SRI_SHA256_RE = re.compile(r"sha256-[A-Za-z0-9+/=]+")
VERSIONISH_RE = re.compile(r"\b[0-9]+\.[0-9]+\.[0-9]+\b")


def _body(text: str) -> str:
    """Return `text` with `#` comment lines stripped so comments cannot mask or trip checks."""
    return "\n".join(
        ln for ln in text.splitlines() if not ln.lstrip().startswith("#")
    )


def check_template(nix_text: str) -> list[str]:
    """Return a list of problems; empty means `package.nix` is still a valid template."""
    problems: list[str] = []
    body = _body(nix_text)

    def expect_assign(name: str, want: str) -> None:
        m = re.search(rf'^\s*{re.escape(name)}\s*=\s*([^;]+);', body, re.M)
        if not m:
            problems.append(f"missing `{name} = ...;` assignment in package.nix")
            return
        got = m.group(1).strip()
        if got != want:
            problems.append(
                f"{name} is {got}, not {want} — package.nix is a template; "
                "render_packaging.py / calculate_nix_hashes.py supply values at release time"
            )

    expect_assign("version", '"@VERSION@"')
    expect_assign("rev", '"v${version}"')
    expect_assign("hash", '"@SRC_HASH@"')
    expect_assign("cargoHash", '"@CARGO_HASH@"')

    for line in body.splitlines():
        if "fakeHash" in line:
            problems.append(f"package.nix references fakeHash: {line.strip()!r}")
        for regex, what in (
            (SRI_SHA256_RE, "an SRI sha256 digest"),
            (SHA256_RE, "a sha256 digest"),
            (VERSIONISH_RE, "a version number"),
        ):
            m = regex.search(line)
            if m:
                problems.append(
                    f"package.nix body records {what} ({m.group(0)}): {line.strip()!r}"
                )

    if not re.search(r"^\s*installManPage\s+docs/retch\.1\b", body, re.M):
        problems.append(
            "package.nix no longer installs the committed docs/retch.1 via installManPage"
        )
    if "mandown" in body:
        problems.append(
            "package.nix references mandown — install the committed docs/retch.1 instead"
        )
    if not re.search(r"\binstallShellCompletion\b", body):
        problems.append(
            "package.nix no longer runs installShellCompletion in postInstall"
        )

    return problems


def check_test_nix(test_nix_text: str) -> list[str]:
    """Assert `packaging/nixpkgs/test.nix` overrides `version` from `Cargo.toml` cleanly."""
    problems: list[str] = []
    body = _body(test_nix_text)

    m = re.search(r'^\s*version\s*=\s*([^;]+);', body, re.M)
    if not m:
        problems.append(
            "test.nix does not override `version` — local nix-build would inherit \"@VERSION@\" "
            "from package.nix and fail Nix store-name validation"
        )
    else:
        rhs = m.group(1).strip()
        if "builtins.fromTOML" not in rhs or "../../Cargo.toml" not in rhs:
            problems.append(
                f"test.nix sets version to {rhs!r}, not `(builtins.fromTOML (builtins.readFile ../../Cargo.toml)).package.version`"
            )

    if "@VERSION@" in body:
        problems.append("test.nix body references @VERSION@ sentinel")
    for line in body.splitlines():
        for regex, what in (
            (SRI_SHA256_RE, "an SRI sha256 digest"),
            (SHA256_RE, "a sha256 digest"),
            (VERSIONISH_RE, "a hardcoded version number"),
        ):
            hit = regex.search(line)
            if hit:
                problems.append(
                    f"test.nix body records {what} ({hit.group(0)}): {line.strip()!r}"
                )

    return problems


# ── self-test ────────────────────────────────────────────────────────────────

_GOOD_PACKAGE_NIX = """\
{ lib
, rustPlatform
, fetchFromGitHub
, pkg-config
, installShellFiles
}:

# Comment mentioning 0.6.12, lib.fakeHash, mandown, and
# sha256-08nsxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM1g= must be ignored.
rustPlatform.buildRustPackage rec {
  pname = "retch";
  version = "@VERSION@";

  src = fetchFromGitHub {
    owner = "l1a";
    repo = "retch";
    rev = "v${version}";
    hash = "@SRC_HASH@";
  };

  cargoHash = "@CARGO_HASH@";

  nativeBuildInputs = [
    pkg-config
    installShellFiles
  ];

  postInstall = ''
    installManPage docs/retch.1
    installShellCompletion --cmd retch \\
      --bash <($out/bin/retch --completions bash)
  '';

  meta = with lib; {
    description = "A fast, feature-rich system information fetcher written in Rust";
    homepage = "https://github.com/l1a/retch";
    license = licenses.gpl3Plus;
  };
}
"""

_GOOD_TEST_NIX = """\
with import <nixpkgs> {};
callPackage ./package.nix {
  rustPlatform = rustPlatform // {
    buildRustPackage = args: rustPlatform.buildRustPackage (args // {
      version = (builtins.fromTOML (builtins.readFile ../../Cargo.toml)).package.version;
      src = ../../.;
      cargoLock = {
        lockFile = ../../Cargo.lock;
      };
      cargoHash = null;
    });
  };
}
"""

_REAL_SRI = "sha256-08nsxpti3GNFsK8zv2tQ+6iMQrgGBRnwzjG8nTOIM1g="
_REAL_HEX = "77ccf85843d24ac3216ab31d2584ff4a95869266c59ddb8bc83819425cfc2033"


def _self_test() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    def expect_problem(label: str, text: str, needle: str) -> None:
        probs = check_template(text)
        check(label, any(needle in p for p in probs), f"got {probs}")

    clean = check_template(_GOOD_PACKAGE_NIX)
    check("template fixture clean", clean == [], f"got {clean}")

    if PACKAGE_NIX.is_file():
        live_problems = check_template(PACKAGE_NIX.read_text(encoding="utf-8"))
        check("live package.nix clean", live_problems == [], f"got {live_problems}")

    clean_test_nix = check_test_nix(_GOOD_TEST_NIX)
    check("test.nix fixture clean", clean_test_nix == [], f"got {clean_test_nix}")

    if TEST_NIX.is_file():
        live_test_problems = check_test_nix(TEST_NIX.read_text(encoding="utf-8"))
        check("live test.nix clean", live_test_problems == [], f"got {live_test_problems}")

    expect_problem(
        "pinned version detected",
        _GOOD_PACKAGE_NIX.replace('"@VERSION@"', '"0.21.8"'),
        "version is",
    )
    expect_problem(
        "pinned rev detected",
        _GOOD_PACKAGE_NIX.replace('"v${version}"', '"main"'),
        "rev is",
    )
    expect_problem(
        "pinned src hash detected",
        _GOOD_PACKAGE_NIX.replace('"@SRC_HASH@"', f'"{_REAL_SRI}"'),
        "hash is",
    )
    expect_problem(
        "pinned cargoHash detected",
        _GOOD_PACKAGE_NIX.replace('"@CARGO_HASH@"', f'"{_REAL_SRI}"'),
        "cargoHash is",
    )
    expect_problem(
        "lib.fakeHash detected",
        _GOOD_PACKAGE_NIX.replace('"@CARGO_HASH@"', "lib.fakeHash"),
        "fakeHash",
    )
    expect_problem(
        "smuggled hex sha256 detected",
        _GOOD_PACKAGE_NIX.replace(
            'homepage = "https://github.com/l1a/retch";',
            f'homepage = "https://github.com/l1a/retch#{_REAL_HEX}";',
        ),
        "sha256 digest",
    )
    expect_problem(
        "smuggled version detected",
        _GOOD_PACKAGE_NIX.replace(
            'homepage = "https://github.com/l1a/retch";',
            'homepage = "https://github.com/l1a/retch";\n    changelog = "0.21.8";',
        ),
        "version number",
    )
    expect_problem(
        "missing installManPage docs/retch.1 detected",
        _GOOD_PACKAGE_NIX.replace("installManPage docs/retch.1", "true"),
        "installManPage",
    )
    expect_problem(
        "live mandown reference detected",
        _GOOD_PACKAGE_NIX.replace("installManPage docs/retch.1", "mandown docs/retch.1.md"),
        "mandown",
    )
    expect_problem(
        "missing installShellCompletion detected",
        _GOOD_PACKAGE_NIX.replace("installShellCompletion", "true"),
        "installShellCompletion",
    )

    def expect_test_problem(label: str, text: str, needle: str) -> None:
        probs = check_test_nix(text)
        check(label, any(needle in p for p in probs), f"got {probs}")

    expect_test_problem(
        "test.nix missing version override detected",
        _GOOD_TEST_NIX.replace(
            "      version = (builtins.fromTOML (builtins.readFile ../../Cargo.toml)).package.version;\n",
            "",
        ),
        "does not override `version`",
    )
    expect_test_problem(
        "test.nix hardcoded version detected",
        _GOOD_TEST_NIX.replace(
            "(builtins.fromTOML (builtins.readFile ../../Cargo.toml)).package.version",
            '"0.21.8"',
        ),
        "hardcoded version",
    )
    expect_test_problem(
        "test.nix @VERSION@ sentinel detected",
        _GOOD_TEST_NIX.replace(
            "(builtins.fromTOML (builtins.readFile ../../Cargo.toml)).package.version",
            '"@VERSION@"',
        ),
        "@VERSION@",
    )

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"nix_check.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print(f"nix_check.py self-test passed (template v{TEMPLATE_VERSION})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run built-in tests and exit")
    args = ap.parse_args()
    if args.self_test:
        return _self_test()

    if not PACKAGE_NIX.is_file():
        print(f"error: {PACKAGE_NIX} does not exist", file=sys.stderr)
        return 1
    if not TEST_NIX.is_file():
        print(f"error: {TEST_NIX} does not exist", file=sys.stderr)
        return 1
    problems = check_template(PACKAGE_NIX.read_text(encoding="utf-8"))
    problems.extend(check_test_nix(TEST_NIX.read_text(encoding="utf-8")))
    if problems:
        for p in problems:
            print(f"[nix-check] {p}", file=sys.stderr)
        return 1
    print(
        "[nix-check] package.nix is a template (records no version, no checksum) "
        "and test.nix derives version from Cargo.toml"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
