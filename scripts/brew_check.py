#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Assert packaging/homebrew/retch.rb is still a template that records no release.

WHY THIS EXISTS, AND WHY IT CHECKS SOMETHING DIFFERENT NOW
----------------------------------------------------------
The formula's `url` and `sha256` used to track the last RELEASED tag, because the tarball
has to exist before it can be checksummed. So the fields were bumped by a human, at release
time, in a separate commit -- and this file's original job was to compare that recording
against the same fact recorded in `packaging/aur/PKGBUILD` and `packaging/copr/retch.spec`.

That was the third instance of one construct. The PKGBUILD had it with no guard and sat
**eleven releases** stale (0.6.12 in-repo while the AUR served 0.6.23) while every CI run
was green; v0.7.1 added a guard *after* the drift, v0.9.10 added one for the spec *before*
its drift, and v0.17.2 gave this formula one on day one. Three guards, comparing four
recordings of a single fact -- each of them necessary only because the fact was written
down more than once.

`scripts/render_packaging.py` writes it down once instead, at publish time, from the tag.
`url` and `sha256` are now sentinels, so there is no "trailing Cargo.toml" state to reason
about, no bump to forget, and no post-tag commit -- which is what used to force a version
bump on every release.

WHAT IT CHECKS
--------------
All offline, deterministic and free:

  1. `url` is the sentinel `refs/tags/v@VERSION@` archive URL -- a `refs/tags/` archive, not
     a branch tarball, which would silently change content under a fixed sha256.
  2. `sha256` is exactly `@SHA256@`. An equality test rather than "contains a sentinel": a
     formula carrying a real digest and a `@SHA256@` in a comment would pass the weaker one.
  3. Nothing else in the formula body records a version or a digest.
  4. `cargo install` still uses `*std_cargo_args`, and does NOT add a second `--locked`.
     `std_cargo_args` is what supplies `--locked`; Homebrew builds with network access and
     no vendoring, so `Cargo.lock` is the only thing pinning resolution to what CI tested.
     Checking for the literal flag would be wrong both ways -- it would pass for a formula
     that dropped `std_cargo_args`, and would demand the duplicate cargo rejects.
  5. The formula still installs the COMMITTED `docs/retch.1` rather than regenerating it.
     The AUR PKGBUILD regenerated its own with mandown and shipped a page footed `$DATE` /
     `retch $pkgver` for months. The tarball already carries a correct page.

The "real 64-character digest, not a placeholder" check has not been dropped -- it moved to
`render_packaging.py`, which refuses to render a sha that is not a real digest. That is
where it belongs: the value only exists at publish time now.

WHAT IT IS NOT
--------------
It does not prove the formula builds or installs -- that is `brew install
--build-from-source`, run by the `brew` CI job on a macOS runner against a formula it
renders for the last released tag. It is the cheap, offline, always-runnable half, wired
into `just check`. Same division of labour, and deliberately the same wording, as
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

# What the template must carry, verbatim. `refs/tags/` and not a branch tarball: a branch
# tarball changes content under a fixed sha256, so `render_packaging.py` would pin a digest
# that stops matching the moment anything lands on the branch.
EXPECTED_URL = "https://github.com/l1a/retch/archive/refs/tags/v@VERSION@.tar.gz"
EXPECTED_SHA = "@SHA256@"

SHA256_RE = re.compile(r"\b[0-9a-fA-F]{64}\b")
VERSIONISH_RE = re.compile(r"\b[0-9]+\.[0-9]+\.[0-9]+\b")


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


def check_template(formula_text: str) -> list[str]:
    """Return a list of problems; empty means the formula is still a template."""
    problems: list[str] = []
    body = _body(formula_text)

    # 1 and 2. The load-bearing assertions: no recorded release, no recorded digest.
    # Equality rather than containment -- a formula carrying a real digest AND a sentinel in
    # a comment would satisfy a containment test while pinning a release.
    try:
        url = _field(body, "url")
        sha = _field(body, "sha256")
    except ParseError as exc:
        return [str(exc)]

    if url != EXPECTED_URL:
        problems.append(
            f"url is {url!r}, not {EXPECTED_URL!r} — this formula is a template; "
            "scripts/render_packaging.py fills the version in at publish time"
        )
    if sha != EXPECTED_SHA:
        problems.append(
            f"sha256 is {sha!r}, not {EXPECTED_SHA!r} — a checksum cannot be computed "
            "before its tag exists, which is why recording one here forced a post-tag "
            "commit on every release"
        )

    # 3. Nothing may smuggle the same facts in elsewhere. `_body` has already stripped
    #    comments, so the block explaining the history is not mistaken for a pin.
    for line in body.splitlines():
        for regex, what in ((SHA256_RE, "a sha256 digest"), (VERSIONISH_RE, "a version number")):
            m = regex.search(line)
            if m:
                problems.append(f"formula body records {what} ({m.group(0)}): {line.strip()!r}")

    # 4. Resolution stays pinned, and the flag is not duplicated.
    #
    # `std_cargo_args` expands to `--locked --root <prefix> --path .`, so it is what
    # supplies --locked. Asserting the literal flag instead would be wrong in both
    # directions: it would pass for a formula that dropped std_cargo_args (unpinning
    # resolution), and it would demand the duplicate that cargo rejects with
    # "the argument '--locked' cannot be used multiple times" -- which is exactly how the
    # first version of this formula failed in CI.
    cargo_install = re.search(r'system\s+"cargo",\s*"install"([^\n]*)', body)
    if not cargo_install:
        problems.append("the formula no longer runs `cargo install`")
    else:
        args = cargo_install.group(1)
        if "std_cargo_args" not in args:
            problems.append(
                "`cargo install` no longer uses *std_cargo_args — that is what supplies "
                "--locked, and Cargo.lock is the only thing pinning resolution in a "
                "network-enabled Homebrew build"
            )
        if '"--locked"' in args:
            problems.append(
                "`cargo install` passes an explicit --locked on top of std_cargo_args, "
                "which already includes it — cargo rejects the duplicate with "
                "\"the argument '--locked' cannot be used multiple times\""
            )

    # 5. The committed man page, not a regenerated one.
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
# a comment mentioning mandown and v1.2.3 and
# 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef, none of which
# must trip a check -- comments are stripped before matching.
class Retch < Formula
  desc "Fast, feature-rich system information fetcher"
  homepage "https://github.com/l1a/retch"
  url "https://github.com/l1a/retch/archive/refs/tags/v@VERSION@.tar.gz"
  sha256 "@SHA256@"
  license "GPL-3.0-or-later"

  def install
    system "cargo", "install", *std_cargo_args
    man1.install "docs/retch.1"
  end
end
'''

_REAL_SHA = "77ccf85843d24ac3216ab31d2584ff4a95869266c59ddb8bc83819425cfc2033"


def _self_test() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    def expect_problem(label: str, text: str, needle: str) -> None:
        probs = check_template(text)
        check(label, any(needle in p for p in probs), f"got {probs}")

    # The template fixture is clean -- including its comment block, which deliberately
    # contains a version and a digest to prove comments are stripped before matching.
    clean = check_template(_GOOD_FORMULA)
    check("template fixture clean", clean == [], f"got {clean}")

    # The LIVE formula must be clean too: one assertion coupling this self-test to the real
    # file, so it cannot keep passing about a fixture after the real formula changed shape.
    live = Path(__file__).resolve().parent.parent / "packaging" / "homebrew" / "retch.rb"
    if live.is_file():
        live_problems = check_template(live.read_text(encoding="utf-8"))
        check("live formula clean", live_problems == [], f"got {live_problems}")

    # 1. A pinned release must not come back. This is the successor to the old
    #    formula-vs-PKGBUILD-vs-spec comparison: that drift is now unrepresentable, so what
    #    is guarded is the property that makes it so.
    expect_problem(
        "pinned url detected",
        _GOOD_FORMULA.replace("v@VERSION@.tar.gz", "v0.17.3.tar.gz"),
        "url is",
    )
    expect_problem(
        "pinned sha256 detected",
        _GOOD_FORMULA.replace('sha256 "@SHA256@"', f'sha256 "{_REAL_SHA}"'),
        "sha256 is",
    )

    # A branch tarball would change content under a fixed digest.
    expect_problem(
        "branch tarball detected",
        _GOOD_FORMULA.replace(
            "https://github.com/l1a/retch/archive/refs/tags/v@VERSION@.tar.gz",
            "https://github.com/l1a/retch/archive/refs/heads/main.tar.gz",
        ),
        "url is",
    )

    # 3. Smuggled into another live field, which the equality checks alone would miss.
    expect_problem(
        "smuggled digest detected",
        _GOOD_FORMULA.replace(
            '  license "GPL-3.0-or-later"', f'  license "GPL-3.0-or-later"\n  version "{_REAL_SHA}"'
        ),
        "records a sha256 digest",
    )
    expect_problem(
        "smuggled version detected",
        _GOOD_FORMULA.replace('  license "GPL-3.0-or-later"',
                              '  license "GPL-3.0-or-later"\n  version "0.17.3"'),
        "records a version number",
    )

    # 4. Resolution pinning, both directions of the std_cargo_args trap.
    expect_problem(
        "dropped std_cargo_args detected",
        _GOOD_FORMULA.replace('system "cargo", "install", *std_cargo_args',
                              'system "cargo", "install", "--root", prefix'),
        "std_cargo_args",
    )
    expect_problem(
        "duplicate --locked detected",
        _GOOD_FORMULA.replace('system "cargo", "install", *std_cargo_args',
                              'system "cargo", "install", "--locked", *std_cargo_args'),
        "multiple times",
    )
    expect_problem(
        "no cargo install detected",
        _GOOD_FORMULA.replace('system "cargo", "install", *std_cargo_args', "true"),
        "cargo install",
    )

    # 5. The man page the AUR package got wrong for months.
    expect_problem(
        "regenerated man page detected",
        _GOOD_FORMULA.replace('man1.install "docs/retch.1"', 'man1.install "retch.1"'),
        "docs/retch.1",
    )
    expect_problem(
        "live mandown reference detected",
        _GOOD_FORMULA.replace('man1.install "docs/retch.1"',
                              'system "mandown", "docs/retch.1.md"'),
        "mandown",
    )

    # A formula with no class at all must raise rather than compare as empty.
    try:
        _body("puts 1\n")
        check("missing class raises", False, "_body accepted a file with no class Retch")
    except ParseError:
        pass

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"brew_check.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print(f"brew_check.py self-test passed (template v{TEMPLATE_VERSION})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run the built-in assertions")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    try:
        problems = check_template(FORMULA.read_text(encoding="utf-8"))
    except (ParseError, FileNotFoundError) as exc:
        print(f"[brew-check] {exc}", file=sys.stderr)
        return 1

    if problems:
        for p in problems:
            print(f"[brew-check] {p}", file=sys.stderr)
        print("[brew-check] the version and checksum are supplied by "
              "scripts/render_packaging.py at publish time", file=sys.stderr)
        return 1

    print("[brew-check] retch.rb is a template (records no version, no checksum)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
