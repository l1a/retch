#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Assert packaging/scoop/retch.json is still a template that records no release.

WHY THIS EXISTS
---------------
`packaging/scoop/retch.json` is the Windows Scoop sibling of `packaging/homebrew/retch.rb`,
`packaging/aur/PKGBUILD` and `packaging/copr/retch.spec`. Like them, it records no released
version and no checksum in the repository: `scripts/render_packaging.py` fills in `@VERSION@`,
`@SHA256_X86_64@` and `@SHA256_ARM64@` at publish time (`just scoop-publish <version>`),
computing the hashes from the real GitHub Release `.exe` assets.

WHAT IT CHECKS
--------------
All offline, deterministic and free:

  1. The manifest parses as valid JSON and its top-level `version` is `"@VERSION@"`.
  2. `architecture.64bit` and `architecture.arm64` carry the exact sentinel URLs
     (`.../releases/download/v@VERSION@/retch-windows-{x86_64,arm64}.exe#/retch.exe`)
     and sentinel hashes (`"@SHA256_X86_64@"` and `"@SHA256_ARM64@"`). The `#/retch.exe`
     fragment is load-bearing: Scoop uses it to rename the downloaded architecture-suffixed
     binary to `retch.exe` so `"bin": "retch.exe"` works on both architectures.
  3. `"bin"` is `"retch.exe"`, `"checkver"` is `"github"`, and `"autoupdate"` carries the
     matching `v$version` URLs for `64bit` and `arm64`.
  4. Nothing anywhere in the file records a literal semver version or 64-hex sha256 digest.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

TEMPLATE_VERSION = 1

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "packaging" / "scoop" / "retch.json"

EXPECTED_URL_X64 = (
    "https://github.com/l1a/retch/releases/download/v@VERSION@/retch-windows-x86_64.exe#/retch.exe"
)
EXPECTED_URL_ARM64 = (
    "https://github.com/l1a/retch/releases/download/v@VERSION@/retch-windows-arm64.exe#/retch.exe"
)
EXPECTED_AUTO_X64 = (
    "https://github.com/l1a/retch/releases/download/v$version/retch-windows-x86_64.exe#/retch.exe"
)
EXPECTED_AUTO_ARM64 = (
    "https://github.com/l1a/retch/releases/download/v$version/retch-windows-arm64.exe#/retch.exe"
)

SHA256_RE = re.compile(r"\b[0-9a-fA-F]{64}\b")
VERSIONISH_RE = re.compile(r"\b[0-9]+\.[0-9]+\.[0-9]+\b")


def check_template(text: str) -> list[str]:
    """Return a list of problems; empty means the Scoop manifest is still a valid template."""
    problems: list[str] = []
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        return [f"invalid JSON: {exc}"]

    if not isinstance(data, dict):
        return ["manifest root must be a JSON object"]

    if data.get("version") != "@VERSION@":
        problems.append(
            f"version is {data.get('version')!r}, not '@VERSION@' — this manifest is a template; "
            "scripts/render_packaging.py fills the version in at publish time"
        )

    arch = data.get("architecture")
    if not isinstance(arch, dict):
        problems.append("missing `architecture` object")
    else:
        x64 = arch.get("64bit") if isinstance(arch.get("64bit"), dict) else {}
        arm = arch.get("arm64") if isinstance(arch.get("arm64"), dict) else {}
        if x64.get("url") != EXPECTED_URL_X64:
            problems.append(f"architecture.64bit.url is {x64.get('url')!r}, not {EXPECTED_URL_X64!r}")
        if x64.get("hash") != "@SHA256_X86_64@":
            problems.append(
                f"architecture.64bit.hash is {x64.get('hash')!r}, not '@SHA256_X86_64@'"
            )
        if arm.get("url") != EXPECTED_URL_ARM64:
            problems.append(f"architecture.arm64.url is {arm.get('url')!r}, not {EXPECTED_URL_ARM64!r}")
        if arm.get("hash") != "@SHA256_ARM64@":
            problems.append(
                f"architecture.arm64.hash is {arm.get('hash')!r}, not '@SHA256_ARM64@'"
            )

    if data.get("bin") != "retch.exe":
        problems.append(f"bin is {data.get('bin')!r}, not 'retch.exe'")

    if data.get("checkver") != "github":
        problems.append(f"checkver is {data.get('checkver')!r}, not 'github'")

    autoupdate = data.get("autoupdate")
    if not isinstance(autoupdate, dict) or not isinstance(autoupdate.get("architecture"), dict):
        problems.append("missing `autoupdate.architecture` object")
    else:
        auto_arch = autoupdate["architecture"]
        auto_x64 = auto_arch.get("64bit") if isinstance(auto_arch.get("64bit"), dict) else {}
        auto_arm = auto_arch.get("arm64") if isinstance(auto_arch.get("arm64"), dict) else {}
        if auto_x64.get("url") != EXPECTED_AUTO_X64:
            problems.append(
                f"autoupdate.architecture.64bit.url is {auto_x64.get('url')!r}, not {EXPECTED_AUTO_X64!r}"
            )
        if auto_arm.get("url") != EXPECTED_AUTO_ARM64:
            problems.append(
                f"autoupdate.architecture.arm64.url is {auto_arm.get('url')!r}, not {EXPECTED_AUTO_ARM64!r}"
            )

    for line in text.splitlines():
        for regex, what in ((SHA256_RE, "a sha256 digest"), (VERSIONISH_RE, "a version number")):
            m = regex.search(line)
            if m:
                problems.append(f"manifest records {what} ({m.group(0)}): {line.strip()!r}")

    return problems


# ── self-test ────────────────────────────────────────────────────────────────

_GOOD_MANIFEST = """\
{
    "version": "@VERSION@",
    "description": "A fast, feature-rich system information fetcher written in Rust",
    "homepage": "https://github.com/l1a/retch",
    "license": "GPL-3.0-or-later",
    "architecture": {
        "64bit": {
            "url": "https://github.com/l1a/retch/releases/download/v@VERSION@/retch-windows-x86_64.exe#/retch.exe",
            "hash": "@SHA256_X86_64@"
        },
        "arm64": {
            "url": "https://github.com/l1a/retch/releases/download/v@VERSION@/retch-windows-arm64.exe#/retch.exe",
            "hash": "@SHA256_ARM64@"
        }
    },
    "bin": "retch.exe",
    "checkver": "github",
    "autoupdate": {
        "architecture": {
            "64bit": {
                "url": "https://github.com/l1a/retch/releases/download/v$version/retch-windows-x86_64.exe#/retch.exe"
            },
            "arm64": {
                "url": "https://github.com/l1a/retch/releases/download/v$version/retch-windows-arm64.exe#/retch.exe"
            }
        }
    }
}
"""

_REAL_SHA = "77ccf85843d24ac3216ab31d2584ff4a95869266c59ddb8bc83819425cfc2033"


def _self_test() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    def expect_problem(label: str, text: str, needle: str) -> None:
        probs = check_template(text)
        check(label, any(needle in p for p in probs), f"got {probs}")

    clean = check_template(_GOOD_MANIFEST)
    check("template fixture clean", clean == [], f"got {clean}")

    if MANIFEST.is_file():
        live_problems = check_template(MANIFEST.read_text(encoding="utf-8"))
        check("live manifest clean", live_problems == [], f"got {live_problems}")

    expect_problem("invalid json detected", "{not json", "invalid JSON")
    expect_problem(
        "pinned version detected",
        _GOOD_MANIFEST.replace('"@VERSION@"', '"0.20.28"'),
        "version is",
    )
    expect_problem(
        "pinned x86_64 hash detected",
        _GOOD_MANIFEST.replace('"@SHA256_X86_64@"', f'"{_REAL_SHA}"'),
        "architecture.64bit.hash is",
    )
    expect_problem(
        "pinned arm64 hash detected",
        _GOOD_MANIFEST.replace('"@SHA256_ARM64@"', f'"{_REAL_SHA}"'),
        "architecture.arm64.hash is",
    )
    expect_problem(
        "missing #/retch.exe fragment detected",
        _GOOD_MANIFEST.replace("retch-windows-x86_64.exe#/retch.exe", "retch-windows-x86_64.exe"),
        "architecture.64bit.url is",
    )
    expect_problem(
        "wrong bin detected",
        _GOOD_MANIFEST.replace('"bin": "retch.exe"', '"bin": "retch-windows-x86_64.exe"'),
        "bin is",
    )
    expect_problem(
        "broken autoupdate detected",
        _GOOD_MANIFEST.replace("v$version/retch-windows-arm64.exe", "v0.20.28/retch-windows-arm64.exe"),
        "autoupdate.architecture.arm64.url is",
    )

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"scoop_check.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print(f"scoop_check.py self-test passed (template v{TEMPLATE_VERSION})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run built-in tests and exit")
    args = ap.parse_args()
    if args.self_test:
        return _self_test()

    if not MANIFEST.is_file():
        print(f"error: {MANIFEST} does not exist", file=sys.stderr)
        return 1
    problems = check_template(MANIFEST.read_text(encoding="utf-8"))
    if problems:
        for p in problems:
            print(f"[scoop-check] {p}", file=sys.stderr)
        return 1
    print("[scoop-check] retch.json is a template (records no version, no checksum)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
