#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Assert packaging/copr/retch.spec is still a template that records no release.

WHY THIS EXISTS, AND WHY IT CHECKS SOMETHING DIFFERENT NOW
----------------------------------------------------------
The spec's `Version:` used to track the last RELEASED tag, because `Source0` was a tag
tarball that had to exist before it could be referenced. So the field was bumped by a human,
at release time, in a separate commit -- and this file's original job was to compare that
recording against the same fact recorded in `packaging/aur/PKGBUILD` and in `Cargo.toml`.

`packaging/aur/PKGBUILD` had exactly that shape and exactly that lack of a guard before
v0.7.1, and it sat **eleven releases** stale (0.6.12 in-repo while the AUR served 0.6.23)
while every CI run was green. Three guards were written to compare four recordings of one
fact. The fix was to stop recording it: `Version:` is now `@VERSION@`, `.copr/Makefile`
renders it from `Cargo.toml` when it builds the SRPM, and `Source0` is a local tarball built
from the checkout -- so the spec needs neither a published tag nor a bump, and the post-tag
commit that forced a version bump on every release is gone.

WHAT IT CHECKS
--------------
All offline, deterministic, and free:

  1. `Version:` is exactly `@VERSION@`. An equality test, not a containment test: a spec
     carrying `Version: 0.17.3` and a `@VERSION@` in a comment would satisfy the weaker one.
  2. Nothing else in the preamble records a version number.
  3. `Source0` is the LOCAL `%{name}-%{version}.tar.gz`. A URL here would reintroduce the
     dependency on a published tag -- which is what made a PR unable to build its own SRPM.
  4. `cargo build` still passes `--locked`. The spec's own comment calls this load-bearing
     and says "Never drop it" -- with internet-enabled COPR builds and no vendor tarball it
     is the only thing pinning resolution to what was tested. A comment is not a guard.
  5. `%license LICENSE NOTICE`. NOTICE carries the MIT attribution for the adapted Fastfetch
     logos, which MIT requires to travel with every copy; v0.17.4 exists because it did not.
  6. The newest `%changelog` entry is a real historical entry, not a sentinel. The renderer
     PREPENDS the entry for the version it renders, so a sentinel here would produce two
     entries for one version.

The "newest %changelog entry matches Version-Release" check that used to live here has not
been dropped -- it moved to `render_packaging.py`'s self-test, which is where it can be
asserted about the rendered spec rather than about a template whose Version: is deliberately
not a number.

WHAT IT IS NOT
--------------
It does not prove the package builds -- that is the `copr` CI job (which now builds an SRPM
from the PR's own source, something it could not do while Source0 pinned a released tag),
and then COPR itself. It is the cheap, offline, always-runnable half, wired into
`just check`. Same division of labour, and the same wording, as `aur_check.py` -- the two
are siblings on purpose.

WHY IT PARSES RATHER THAN CALLING rpmspec
------------------------------------------
`rpmspec -q --qf '%{version}'` would be the natural implementation and is not available on
Windows or macOS, where `just check` is expected to run (the v0.6.16 portability reason that
made the man/completions recipes Python). It also expands macros, which would hide check 4
entirely: a hardcoded `Source0` and a `%{version}` one produce identical output. Reading the
file is what makes the *text* checkable, and the text is what drifts.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TEMPLATE_VERSION = 1


class ParseError(Exception):
    """The spec used a construct this parser does not understand."""


def _preamble(text: str) -> str:
    """Everything before the first `%`-section directive.

    `Version:` and friends are preamble tags. Stopping at the first section keeps a
    `Version:` mentioned inside `%description` prose or a `%changelog` body from being read
    as the package's version.
    """
    out = []
    for line in text.splitlines():
        if re.match(r"^%(prep|build|install|check|files|changelog|description|package)\b", line):
            break
        out.append(line)
    return "\n".join(out)


def spec_tag(text: str, tag: str) -> str:
    """Read one preamble tag, e.g. `Version:        0.9.7` -> `0.9.7`.

    Raises rather than returning a default: a tag this cannot find is a tag that would
    otherwise compare equal to another missing one, which is the failure mode the whole file
    exists to prevent.
    """
    m = re.search(rf"^{tag}:\s*(\S.*?)\s*$", _preamble(text), re.MULTILINE)
    if not m:
        raise ParseError(f"spec has no `{tag}:` tag in its preamble")
    return m.group(1)


def spec_version(text: str) -> str:
    return spec_tag(text, "Version")


def spec_source0(text: str) -> str:
    return spec_tag(text, "Source0")


def newest_changelog_entry(text: str) -> str:
    """The `- <version>-<release>` trailer of the newest %changelog entry.

    rpm's changelog is newest-first, so the first `*` line is the current one.
    """
    m = re.search(r"^%changelog\s*$(.*)", text, re.MULTILINE | re.DOTALL)
    if not m:
        raise ParseError("spec has no %changelog section")
    for line in m.group(1).splitlines():
        if line.startswith("*"):
            trailer = re.search(r"-\s*(\S+)\s*$", line)
            if not trailer:
                raise ParseError(f"newest %changelog entry has no `- <version>-<release>`: {line!r}")
            return trailer.group(1)
    raise ParseError("%changelog section contains no entries")


VERSIONISH_RE = re.compile(r"\b[0-9]+\.[0-9]+\.[0-9]+\b")
LOCAL_SOURCE0 = "%{name}-%{version}.tar.gz"


def check_template(spec_text: str) -> list[str]:
    """Return a list of human-readable problems; empty means the spec is still a template."""
    problems: list[str] = []

    version = spec_version(spec_text)

    # 1. The load-bearing assertion: no recorded release.
    if version != "@VERSION@":
        problems.append(
            f"Version: is {version!r}, not '@VERSION@' — this spec is a template; "
            ".copr/Makefile renders it from Cargo.toml when it builds the SRPM, so a "
            "recorded version is both redundant and a thing to forget at release time"
        )

    # 2. Nor a release recorded anywhere else in the preamble. Scoped to the preamble
    #    because the comment block cites historical versions on purpose.
    for line in _preamble(spec_text).splitlines():
        if line.lstrip().startswith("#"):
            continue
        m = VERSIONISH_RE.search(line)
        if m:
            problems.append(f"preamble line records a version ({m.group(0)}): {line.strip()!r}")

    # 3. A URL here would put the dependency on a published tag back.
    source0 = spec_source0(spec_text)
    if source0 != LOCAL_SOURCE0:
        problems.append(
            f"Source0 is {source0!r}, not {LOCAL_SOURCE0!r} — .copr/Makefile builds the "
            "source archive from the checkout, and a URL would make the spec unbuildable "
            "until after a release again"
        )

    # 4. The spec's own comment says never to drop this; make that enforceable.
    if not re.search(r"^\s*cargo build\b.*--locked", spec_text, re.MULTILINE):
        problems.append(
            "the %build `cargo build` does not pass --locked — with internet-enabled COPR "
            "builds and no vendor tarball it is the only thing pinning dependency resolution"
        )

    # 5. The licence obligation v0.17.4 was cut for. %doc can be stripped; %license cannot.
    if not re.search(r"^%license\s+.*\bLICENSE\b.*\bNOTICE\b", spec_text, re.MULTILINE):
        problems.append(
            "%files does not carry `%license LICENSE NOTICE` — NOTICE holds the MIT "
            "attribution for the adapted Fastfetch logos, which must ship with every copy"
        )

    # 6. The renderer prepends the entry for the version it renders, so a sentinel in the
    #    template's newest entry would yield two entries for one version.
    newest = newest_changelog_entry(spec_text)
    if "@" in newest:
        problems.append(
            f"the newest %changelog entry is a sentinel ({newest}) — render_packaging.py "
            "prepends the entry for the rendered version, so this one must be history"
        )

    return problems


# --------------------------------------------------------------------------------------
# Self-test
# --------------------------------------------------------------------------------------

_GOOD_SPEC = """\
# COPR spec for retch. A comment may cite 0.9.7 as history without that being a pin.
Name:           retch
Version:        @VERSION@
Release:        1%{?dist}
Summary:        A fast, feature-rich system information fetcher written in Rust

License:        GPL-3.0-or-later
URL:            https://github.com/l1a/retch
Source0:        %{name}-%{version}.tar.gz

%description
retch is a system information fetcher. Version: numbers in prose must not be
read as the package's own version, and neither must a 1.2.3 written here.

%build
export RUSTFLAGS="%{build_rustflags}"
cargo build --release --locked

%files
%license LICENSE NOTICE
%doc README.md
%{_bindir}/retch

%changelog
* Mon Aug 31 2026 Ken Tobias <nobody@example.com> - 0.9.7-1
- Update to 0.9.7

* Mon Aug 31 2026 Ken Tobias <nobody@example.com> - 0.9.4-1
- Initial COPR packaging
"""


def _self_test() -> int:
    failures = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    # The template fixture is clean.
    clean = check_template(_GOOD_SPEC)
    check("template fixture clean", clean == [], f"got {clean}")

    # The LIVE spec must be clean too. One assertion coupling the self-test to the real
    # file, deliberately: a self-test that only reads fixtures cannot notice that the thing
    # it guards has stopped being guardable.
    live = Path(__file__).resolve().parent.parent / "packaging" / "copr" / "retch.spec"
    if live.is_file():
        live_problems = check_template(live.read_text(encoding="utf-8"))
        check("live spec clean", live_problems == [], f"got {live_problems}")

    # 1. THE assertion: a recorded release must not come back. This is the successor to the
    #    old "spec bumped, PKGBUILD forgotten" check -- that drift is now unrepresentable,
    #    so what is guarded is the property that makes it so.
    pinned = _GOOD_SPEC.replace("Version:        @VERSION@", "Version:        0.9.7")
    probs = check_template(pinned)
    check("pinned Version detected", any("Version:" in p for p in probs), f"got {probs}")

    # 2. Smuggled into another preamble tag, which check 1 alone would miss.
    smuggled = _GOOD_SPEC.replace(
        "License:        GPL-3.0-or-later",
        "Provides:       retch = 0.9.7\nLicense:        GPL-3.0-or-later",
    )
    probs = check_template(smuggled)
    check("preamble version detected", any("records a version" in p for p in probs), f"got {probs}")

    # ...but the same digits in %description prose must stay silent. This is the negative
    # that keeps the check usable: it fires on tags, not on prose.
    check("prose version ignored",
          not any("records a version" in p for p in check_template(_GOOD_SPEC)),
          "the 1.2.3 in %description was read as a pin")

    # 3. A URL Source0 puts the published-tag dependency back.
    url_source = _GOOD_SPEC.replace(
        "Source0:        %{name}-%{version}.tar.gz",
        "Source0:        %{url}/archive/refs/tags/v%{version}.tar.gz#/%{name}-%{version}.tar.gz")
    probs = check_template(url_source)
    check("URL Source0 detected", any("Source0" in p for p in probs), f"got {probs}")

    # 4. --locked dropped from the build.
    unlocked = _GOOD_SPEC.replace("cargo build --release --locked", "cargo build --release")
    probs = check_template(unlocked)
    check("--locked removal detected", any("--locked" in p for p in probs), f"got {probs}")

    # 5. The licence obligation v0.17.4 was cut for.
    for label, replacement in (("NOTICE dropped", "%license LICENSE"),
                               ("%license downgraded to %doc", "%doc LICENSE NOTICE")):
        bad = _GOOD_SPEC.replace("%license LICENSE NOTICE", replacement)
        probs = check_template(bad)
        check(f"{label} detected", any("%license" in p for p in probs), f"got {probs}")

    # 6. A sentinel changelog entry would be duplicated by the renderer's prepend.
    sentinel_log = _GOOD_SPEC.replace("- 0.9.7-1", "- @VERSION@-1")
    probs = check_template(sentinel_log)
    check("sentinel changelog detected", any("%changelog" in p for p in probs), f"got {probs}")

    # Section bodies must not leak into the preamble: `Version:` appears in %description
    # prose above, and reading THAT would make check 1 compare the wrong string.
    check("preamble scoped", spec_version(_GOOD_SPEC) == "@VERSION@",
          f"got {spec_version(_GOOD_SPEC)}")

    # The changelog is newest-first; the SECOND entry must not be the one read.
    check("newest changelog entry", newest_changelog_entry(_GOOD_SPEC) == "0.9.7-1",
          f"got {newest_changelog_entry(_GOOD_SPEC)!r}")

    # A missing tag must RAISE, not compare equal to another missing one.
    try:
        spec_version("Name: retch\n")
        check("missing Version raises", False, "spec_version accepted a spec with no Version:")
    except ParseError:
        pass

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"copr_check.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print(f"copr_check.py self-test passed (template v{TEMPLATE_VERSION})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run built-in tests and exit")
    ap.add_argument("--root", default=None, help="repository root (default: this script's parent)")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    root = Path(args.root) if args.root else Path(__file__).resolve().parent.parent
    spec = root / "packaging" / "copr" / "retch.spec"
    if not spec.is_file():
        print(f"error: {spec} not found", file=sys.stderr)
        return 1

    try:
        problems = check_template(spec.read_text(encoding="utf-8"))
    except ParseError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1

    if problems:
        print(f"error: {spec} is no longer a valid template:", file=sys.stderr)
        for p in problems:
            print(f"  {p}", file=sys.stderr)
        print("\nThe version comes from Cargo.toml at SRPM time; see .copr/Makefile.",
              file=sys.stderr)
        return 1

    print("packaging/copr/retch.spec is a template (records no version, builds from the checkout)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
