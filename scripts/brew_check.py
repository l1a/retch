#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Assert packaging/homebrew/retch.rb has not drifted from the rest of the repo.

WHY THIS EXISTS
---------------
The formula's `url` and `sha256` track the last RELEASED tag, not `Cargo.toml`, because the
tarball has to exist before it can be checksummed. That is correct and deliberate -- and it
means the fields are bumped by a human, at release time, in a separate commit, with nothing
checking the result.

That is the third time this repo has built that exact construct. `packaging/aur/PKGBUILD`
had it with no guard and sat **eleven releases** stale (0.6.12 in-repo while the AUR served
0.6.23) while every CI run was green; v0.7.1 added the guard *after* the drift.
`packaging/copr/retch.spec` had it and got `copr_check.py` in v0.9.10, *before* the drift.
This is the same guard for the same shape, written at the same time as the formula so the
gap never opens at all.

WHAT IT CHECKS
--------------
All six are offline, deterministic and free:

  1. The formula's version == `packaging/aur/PKGBUILD`'s `pkgver` == the COPR spec's
     `Version:`. All three pin the last released tag, so they are three independent
     recordings of one fact and any disagreement means one was bumped and the others
     forgotten. This is the drift that actually happened to the PKGBUILD, and it is the
     load-bearing check.
  2. The formula's version <= `Cargo.toml`'s version. The in-development version leads and
     the released version trails, so a formula AHEAD of Cargo.toml pins a tag that cannot
     exist. Deliberately one-sided: trailing by a whole release cycle is the normal state.
  3. `sha256` is a real 64-character hex digest, not a placeholder. `lib.fakeHash` sat in
     `packaging/nixpkgs/package.nix` for many releases (v0.6.13); an obvious placeholder is
     better than a wrong hash, but neither belongs in a file that gets published.
  4. The `url` derives its version from the same place the check reads, and is a
     `refs/tags/` archive URL -- not a branch tarball, which would silently change content
     under a fixed sha256.
  5. `cargo install` still passes `--locked`. Homebrew builds with network access and no
     vendoring, so `Cargo.lock` is the only thing pinning resolution to what CI tested.
     The formula's own comment says so; a comment is not a guard.
  6. The formula still installs the COMMITTED `docs/retch.1` rather than regenerating it.
     The AUR PKGBUILD regenerated its own with mandown and shipped a page footed `$DATE` /
     `retch $pkgver` for months. The tarball already carries a correct page.

WHAT IT IS NOT
--------------
It deliberately does NOT:

  - verify the tarball exists or re-checksum it (needs the network -- `just brew-bump` does
    that when it renders the file, and the `brew` CI job does it again on every PR), or
  - prove the formula builds or installs (that is `brew install --build-from-source`, run
    by the `brew` CI job on a macOS runner).

It is the cheap, offline, always-runnable half, wired into `just check` so a drifted formula
cannot reach a commit. Same division of labour, and deliberately the same wording, as
`aur_check.py` and `copr_check.py` -- the three are siblings on purpose.

WHY IT PARSES RATHER THAN CALLING brew
---------------------------------------
`brew info --json` would be the natural implementation and requires Homebrew, which does not
exist on the Linux and Windows hosts where `just check` must run -- the v0.6.16 portability
reason that made the man and completions recipes Python. Reading the file is also what makes
the *text* checkable, and the text is what drifts.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TEMPLATE_VERSION = 1

REPO = Path(__file__).resolve().parent.parent
FORMULA = REPO / "packaging" / "homebrew" / "retch.rb"
PKGBUILD = REPO / "packaging" / "aur" / "PKGBUILD"
SPEC = REPO / "packaging" / "copr" / "retch.spec"
CARGO = REPO / "Cargo.toml"

SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
TAG_URL_RE = re.compile(
    r"https://github\.com/l1a/retch/archive/refs/tags/v(?P<version>[0-9]+\.[0-9]+\.[0-9]+)\.tar\.gz"
)


class ParseError(Exception):
    """The formula used a construct this parser does not understand."""


def _body(text: str) -> str:
    """Everything from the `class` line onward, with `#` comment lines removed.

    Comments are stripped first for the same reason `gate_conformance.py` strips them: a
    comment explaining a rule must not satisfy a check for a formula that lost the rule.
    The v0.7.0 PKGBUILD audit and the v0.9.9 Makefile grep were both fooled by exactly
    that -- a grep returned hits, and every hit was the comment describing the removal.
    """
    start = text.find("class Retch")
    if start < 0:
        raise ParseError("no `class Retch` in the formula")
    lines = [ln for ln in text[start:].splitlines() if not ln.lstrip().startswith("#")]
    return "\n".join(lines)


def _field(body: str, name: str) -> str:
    """Read a top-level `name "value"` field."""
    m = re.search(rf'^\s*{re.escape(name)}\s+"([^"]*)"', body, re.M)
    if not m:
        raise ParseError(f"no `{name}` field in the formula")
    return m.group(1)


def formula_version(body: str) -> str:
    """The version the formula pins, taken from its tag URL.

    Deliberately derived from `url` rather than from a separate `version` field: a formula
    with both can have them disagree, and the URL is what actually gets downloaded.
    """
    url = _field(body, "url")
    m = TAG_URL_RE.fullmatch(url)
    if not m:
        raise ParseError(
            f"url is not a github refs/tags archive for this repo: {url!r}\n"
            "        a branch tarball would change content under a fixed sha256"
        )
    return m.group("version")


def pkgbuild_version(text: str) -> str:
    m = re.search(r"^pkgver=([0-9]+\.[0-9]+\.[0-9]+)\s*$", text, re.M)
    if not m:
        raise ParseError("no pkgver= in packaging/aur/PKGBUILD")
    return m.group(1)


def spec_version(text: str) -> str:
    m = re.search(r"^Version:\s*([0-9]+\.[0-9]+\.[0-9]+)\s*$", text, re.M)
    if not m:
        raise ParseError("no Version: in packaging/copr/retch.spec")
    return m.group(1)


def cargo_version(text: str) -> str:
    m = re.search(r'^version\s*=\s*"([0-9]+\.[0-9]+\.[0-9]+)"', text, re.M)
    if not m:
        raise ParseError("no version in Cargo.toml")
    return m.group(1)


def as_tuple(v: str) -> tuple[int, ...]:
    return tuple(int(p) for p in v.split("."))


def check(
    formula_text: str, pkgbuild_text: str, spec_text: str, cargo_text: str
) -> list[str]:
    """Return a list of problems; empty means the formula is consistent."""
    problems: list[str] = []
    body = _body(formula_text)

    # An unusable `url` is a problem to report, not an exception to propagate: every
    # later check needs the version it encodes, so this returns early rather than
    # cascading a dozen confusing follow-on failures.
    try:
        fver = formula_version(body)
    except ParseError as exc:
        return [str(exc)]
    pver = pkgbuild_version(pkgbuild_text)
    sver = spec_version(spec_text)
    cver = cargo_version(cargo_text)

    # 1. The load-bearing check: three recordings of one fact.
    if fver != pver:
        problems.append(
            f"formula pins {fver} but packaging/aur/PKGBUILD pkgver is {pver} — "
            "both track the last RELEASED tag, so one of them was not bumped "
            "(remedy: just brew-bump <version>)"
        )
    if fver != sver:
        problems.append(
            f"formula pins {fver} but packaging/copr/retch.spec Version: is {sver} — "
            "both track the last RELEASED tag, so one of them was not bumped "
            "(remedy: just brew-bump <version>)"
        )

    # 2. One-sided: trailing is normal, ahead is impossible.
    if as_tuple(fver) > as_tuple(cver):
        problems.append(
            f"formula pins {fver}, which is AHEAD of Cargo.toml's {cver} — "
            "that tag cannot exist yet"
        )

    # 3. A real digest.
    sha = _field(body, "sha256")
    if not SHA256_RE.fullmatch(sha):
        problems.append(f"sha256 is not a 64-character hex digest: {sha!r}")

    # 5. --locked survives.
    if not re.search(r'"cargo",\s*"install",\s*"--locked"', body):
        problems.append(
            "`cargo install` no longer passes --locked — Homebrew builds with network "
            "access and no vendoring, so Cargo.lock is the only thing pinning resolution"
        )

    # 6. The committed man page, not a regenerated one.
    if 'man1.install "docs/retch.1"' not in body:
        problems.append(
            "the formula no longer installs the committed docs/retch.1 — regenerating it "
            "is how the AUR package shipped a page footed `$DATE` / `retch $pkgver`"
        )
    if "mandown" in body:
        problems.append(
            "the formula references mandown — the tarball already carries a correct man "
            "page; regenerating it reintroduces the v0.7.0 footer defect"
        )

    return problems


# ── self-test ────────────────────────────────────────────────────────────────

_GOOD_FORMULA = '''\
# a comment mentioning mandown, which must NOT trip check 6
class Retch < Formula
  desc "Fast, feature-rich system information fetcher"
  homepage "https://github.com/l1a/retch"
  url "https://github.com/l1a/retch/archive/refs/tags/v1.2.3.tar.gz"
  sha256 "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
  license "GPL-3.0-or-later"

  def install
    system "cargo", "install", "--locked", *std_cargo_args
    man1.install "docs/retch.1"
  end
end
'''
_GOOD_PKGBUILD = "pkgname=retch\npkgver=1.2.3\npkgrel=1\n"
_GOOD_SPEC = "Name:           retch\nVersion:        1.2.3\nRelease:        1%{?dist}\n"
_GOOD_CARGO = 'version = "1.2.4"\n'


def _self_test() -> int:
    failures = 0

    def expect(label: str, problems: list[str], want_problem: bool) -> None:
        nonlocal failures
        got = bool(problems)
        if got != want_problem:
            failures += 1
            print(f"  [FAIL] {label}: expected problem={want_problem}, got {problems}")
        else:
            print(f"  [ok]   {label}")

    # The control. If this ever reports a problem the others prove nothing.
    expect(
        "a consistent set passes",
        check(_GOOD_FORMULA, _GOOD_PKGBUILD, _GOOD_SPEC, _GOOD_CARGO),
        False,
    )

    # THE LOAD-BEARING NEGATIVE, and the reason it is here: the formula legitimately
    # TRAILS Cargo.toml for a whole release cycle. A guard that fires on the repo's normal
    # resting state gets deleted within a week, taking the other five with it.
    expect(
        "trailing Cargo.toml by a release cycle stays silent",
        check(_GOOD_FORMULA, _GOOD_PKGBUILD, _GOOD_SPEC, 'version = "9.9.9"\n'),
        False,
    )

    expect(
        "stale pkgver is caught",
        check(_GOOD_FORMULA, "pkgver=1.2.2\n", _GOOD_SPEC, _GOOD_CARGO),
        True,
    )
    expect(
        "stale spec Version is caught",
        check(_GOOD_FORMULA, _GOOD_PKGBUILD, "Version:        1.2.2\n", _GOOD_CARGO),
        True,
    )
    expect(
        "formula ahead of Cargo.toml is caught",
        check(_GOOD_FORMULA, _GOOD_PKGBUILD, _GOOD_SPEC, 'version = "1.0.0"\n'),
        True,
    )
    expect(
        "placeholder sha256 is caught",
        check(
            _GOOD_FORMULA.replace(
                "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
                "lib.fakeHash",
            ),
            _GOOD_PKGBUILD,
            _GOOD_SPEC,
            _GOOD_CARGO,
        ),
        True,
    )
    expect(
        "dropped --locked is caught",
        check(
            _GOOD_FORMULA.replace('"install", "--locked"', '"install"'),
            _GOOD_PKGBUILD,
            _GOOD_SPEC,
            _GOOD_CARGO,
        ),
        True,
    )
    expect(
        "dropped man page install is caught",
        check(
            _GOOD_FORMULA.replace('    man1.install "docs/retch.1"\n', ""),
            _GOOD_PKGBUILD,
            _GOOD_SPEC,
            _GOOD_CARGO,
        ),
        True,
    )
    expect(
        "a mandown regeneration is caught",
        check(
            _GOOD_FORMULA.replace(
                '    man1.install "docs/retch.1"',
                '    system "mandown", "docs/retch.1.md"',
            ),
            _GOOD_PKGBUILD,
            _GOOD_SPEC,
            _GOOD_CARGO,
        ),
        True,
    )
    # A branch tarball would change content under a fixed sha256.
    expect(
        "a non-tag url is caught",
        check(
            _GOOD_FORMULA.replace(
                "https://github.com/l1a/retch/archive/refs/tags/v1.2.3.tar.gz",
                "https://github.com/l1a/retch/archive/refs/heads/main.tar.gz",
            ),
            _GOOD_PKGBUILD,
            _GOOD_SPEC,
            _GOOD_CARGO,
        ),
        True,
    )

    print(f"brew_check self-test: {'FAILED' if failures else 'all passed'}")
    return 1 if failures else 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run the built-in assertions")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    try:
        problems = check(
            FORMULA.read_text(encoding="utf-8"),
            PKGBUILD.read_text(encoding="utf-8"),
            SPEC.read_text(encoding="utf-8"),
            CARGO.read_text(encoding="utf-8"),
        )
    except (ParseError, FileNotFoundError) as exc:
        print(f"[brew-check] {exc}", file=sys.stderr)
        return 1

    if problems:
        for p in problems:
            print(f"[brew-check] {p}", file=sys.stderr)
        return 1

    body = _body(FORMULA.read_text(encoding="utf-8"))
    print(f"[brew-check] retch.rb is consistent (version {formula_version(body)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
