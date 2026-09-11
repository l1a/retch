#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Render packaging/{aur,copr,homebrew} for a released version.

WHY THIS EXISTS
---------------
The AUR PKGBUILD, the COPR spec and the Homebrew formula all need the version of the
release they package, and two of the three need its tarball's sha256. A checksum cannot
be computed before the tag exists, so for a long time the answer was to *record* the
released version in the repository after each tag:

  packaging/aur/PKGBUILD      pkgver= + sha256sums=
  packaging/aur/.SRCINFO      the same two, again
  packaging/copr/retch.spec   Version: + a %changelog entry
  packaging/homebrew/retch.rb url + sha256

That is **four recordings of one fact**, and the entire history of this directory is the
cost of keeping them in step. The PKGBUILD reached ELEVEN releases of drift (0.6.12
in-repo while the AUR served 0.6.23) with every CI run green; v0.7.1 added a guard for the
pair, v0.9.10 added one for the spec, v0.17.2 added one for the formula. Three guards, each
comparing recordings against each other, all of them detecting a problem that only exists
because the fact is written down more than once.

It also forced a post-tag commit, and therefore a version bump on every release: the
packaging PR had to open the next version to satisfy `just pr`'s "version must differ from
the last tag" step. That in turn left `main`'s Cargo.toml naming a version that was never
released, which is how `just publish` on `main` came within one command of uploading
`retch-cli 0.17.4` to crates.io while every other channel served 0.17.3.

So this script inverts it: **the templates record nothing, and the version is supplied
once, at publish time, from the tag.** A stale checksum cannot be committed because no
checksum is committed. The guards that compared four recordings now assert only that the
templates still carry their sentinels -- a much smaller claim, because the failure they
used to hunt has become unrepresentable.

WHAT IT DOES NOT DO
-------------------
No network. The caller computes the sha256 from the tarball it downloaded (`just
aur-publish` / `just brew-publish` / the packaging CI jobs) and passes it in; this only
substitutes and validates. Keeping it offline is what lets `--self-test` run inside
`just check` on every machine, including the Windows and macOS hosts where the check must
work without Git's `usr/bin` on PATH (the v0.6.16 portability reason).

THE RULE THAT MATTERS MOST
--------------------------
**A substitution that matches nothing is a hard error, and a sentinel that survives
rendering is a hard error.** Both directions have burned this repo:
`calculate_nix_hashes.py` silently emitted the *previous* release's cargoHash for a whole
release because its substitution had stopped matching (v0.6.13), and a `@VERSION@` left in
a published PKGBUILD would be a package nobody can build.
"""

from __future__ import annotations

import argparse
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path

TEMPLATE_VERSION = 1

REPO_ROOT = Path(__file__).resolve().parent.parent

# Any @UPPERCASE@ token is a sentinel. Deliberately broad: the post-render check asserts
# that NONE remain, so a sentinel someone adds to a template without teaching this script
# about it fails loudly instead of shipping verbatim.
SENTINEL_RE = re.compile(r"@[A-Z0-9_]+@")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
VERSION_RE = re.compile(r"^[0-9]+(\.[0-9]+)+$")

# The %changelog entry the COPR spec gets at render time. A constant rather than
# `git config user.name`: this runs inside mock, where there is no git configuration and no
# git repository, and an entry attributed to whoever happened to trigger the build is worse
# than one attributed to the project.
MAINTAINER = "Ken Tobias <634380+l1a@users.noreply.github.com>"


class RenderError(Exception):
    """The render could not be completed safely."""


@dataclass(frozen=True)
class Target:
    path: str
    needs_sha: bool
    what: str


TARGETS = {
    "aur": Target("packaging/aur/PKGBUILD", True, "AUR PKGBUILD"),
    "copr": Target("packaging/copr/retch.spec", False, "COPR spec"),
    "brew": Target("packaging/homebrew/retch.rb", True, "Homebrew formula"),
}


def cargo_version(text: str) -> str:
    """Return the `[package]` version from a Cargo.toml.

    Section-aware on purpose. A bare `grep '^version'` happens to work on this manifest
    today, but a `[workspace.package]` or `[dependencies.x]` table carrying its own
    `version` would make it answer about the wrong thing -- and it would answer
    confidently, which is the failure mode this repo keeps recording.
    """
    section = None
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("[") and stripped.endswith("]"):
            section = stripped[1:-1]
            continue
        if section != "package":
            continue
        m = re.match(r'^version\s*=\s*"([^"]+)"', stripped)
        if m:
            return m.group(1)
    raise RenderError("no [package] version found in Cargo.toml")


def repo_version(root: Path = REPO_ROOT) -> str:
    return cargo_version((root / "Cargo.toml").read_text(encoding="utf-8"))


def validate_version(version: str) -> str:
    if not VERSION_RE.match(version):
        raise RenderError(f"not a version number: {version!r}")
    return version


def validate_sha256(sha: str) -> str:
    if not SHA256_RE.match(sha):
        raise RenderError(
            f"not a 64-character lowercase hex sha256: {sha!r} "
            "(compute it from the real tarball; SKIP and placeholders are refused)"
        )
    # A digest of one repeated character is arithmetically possible and has never once been
    # real. Refusing it costs nothing and catches the obvious hand-written placeholder.
    if len(set(sha)) == 1:
        raise RenderError(f"sha256 is a single repeated character -- placeholder? {sha!r}")
    return sha


def substitute(text: str, values: dict[str, str], *, what: str) -> str:
    """Replace each @KEY@ with its value, requiring at least one hit for every key."""
    for key, value in values.items():
        token = f"@{key}@"
        text, n = re.subn(re.escape(token), value.replace("\\", "\\\\"), text)
        if n == 0:
            raise RenderError(
                f"{what}: {token} matched nothing -- the template no longer carries it. "
                "Rendering a file that merely LOOKS updated is the v0.6.13 nix-hash defect."
            )
    leftover = SENTINEL_RE.findall(text)
    if leftover:
        raise RenderError(
            f"{what}: sentinel(s) survived rendering: {sorted(set(leftover))}. "
            "Refusing to write a file that would be published with a placeholder in it."
        )
    return text


def prepend_changelog(spec: str, version: str, stamp: str) -> str:
    """Insert a %changelog entry for `version` directly under the `%changelog` header.

    rpm's changelog is newest-first, and rpmlint reports an entry whose version disagrees
    with `Version:` (`incoherent-version-in-changelog`). Generating the entry in the same
    pass that renders `Version:` is what makes disagreement impossible -- previously both
    were hand-edited by `just copr-bump`, which is two chances to get one fact wrong.

    IDEMPOTENT, and that is not hypothetical tidiness. The template's changelog keeps the
    history written by the old `copr-bump` flow, which ends at 0.17.3; rendering one of
    those versions again would give rpm two entries for the same version-release. Measured
    while comparing this renderer's output against the spec that actually built COPR 0.17.3.
    """
    if re.search(rf"^\*.*-\s*{re.escape(version)}-\S*\s*$", spec, re.M):
        return spec
    entry = (
        f"* {stamp} {MAINTAINER} - {version}-1\n"
        f"- Update to {version}\n"
        "\n"
    )
    out, n = re.subn(r"^%changelog\n", f"%changelog\n{entry}", spec, count=1, flags=re.M)
    if n != 1:
        raise RenderError("COPR spec has no %changelog section to prepend to")
    return out


def render(
    target: str,
    version: str,
    sha256: str | None = None,
    *,
    root: Path = REPO_ROOT,
    stamp: str | None = None,
) -> str:
    """Return the rendered text for `target` at `version`."""
    if target not in TARGETS:
        raise RenderError(f"unknown target {target!r}; expected one of {sorted(TARGETS)}")
    spec = TARGETS[target]
    validate_version(version)

    template = (root / spec.path).read_text(encoding="utf-8")
    values = {"VERSION": version}
    if spec.needs_sha:
        if sha256 is None:
            raise RenderError(f"{spec.what} pins a checksum: --sha256 is required")
        values["SHA256"] = validate_sha256(sha256)
    elif sha256 is not None:
        raise RenderError(f"{spec.what} pins no checksum: --sha256 is not accepted")

    text = template
    if target == "copr":
        # Before substitution, so the entry's own @VERSION@-free text cannot re-introduce a
        # sentinel and so the leftover check below sees the finished file.
        text = prepend_changelog(text, version, stamp or time.strftime("%a %b %d %Y", time.gmtime()))
    return substitute(text, values, what=spec.what)


# --------------------------------------------------------------------------------------
# Self-test
# --------------------------------------------------------------------------------------

_SHA = "77ccf85843d24ac3216ab31d2584ff4a95869266c59ddb8bc83819425cfc2033"


def _self_test() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    def refuses(name: str, fn) -> None:
        try:
            fn()
        except RenderError:
            return
        failures.append(f"{name}: expected a RenderError, got none")

    # ---- the real templates render, and carry exactly what was asked for ----
    aur = render("aur", "1.2.3", _SHA)
    check("aur pkgver", "\npkgver=1.2.3\n" in aur, "rendered PKGBUILD has no pkgver=1.2.3")
    check("aur sha", f"sha256sums=('{_SHA}')" in aur, "rendered PKGBUILD has no sha256sums")
    check("aur no sentinel", not SENTINEL_RE.search(aur), "sentinel survived")

    brew = render("brew", "1.2.3", _SHA)
    check("brew url", "/refs/tags/v1.2.3.tar.gz" in brew, "rendered formula has no versioned url")
    check("brew sha", f'sha256 "{_SHA}"' in brew, "rendered formula has no sha256")
    check("brew no sentinel", not SENTINEL_RE.search(brew), "sentinel survived")

    copr = render("copr", "1.2.3", stamp="Mon Jan 05 2026")
    check("copr version", "\nVersion:        1.2.3\n" in copr, "rendered spec has no Version: 1.2.3")
    check("copr no sentinel", not SENTINEL_RE.search(copr), "sentinel survived")
    # The coherence rpmlint checks: newest changelog entry must name Version-Release.
    newest = re.search(r"^%changelog\n\* [^\n]*- ([0-9.]+)-(\S+)$", copr, re.M)
    check("copr changelog coherent", newest is not None and newest.group(1) == "1.2.3",
          f"newest changelog entry is {newest.group(1) if newest else None!r}, not 1.2.3")
    check("copr changelog history kept", copr.count("* ") > 1,
          "the historical changelog entries were dropped")

    # Rendering a version the history already documents must not duplicate its entry. The
    # live template's newest historical entry is the case this protects.
    already = re.search(r"^%changelog\n\* [^\n]*- ([0-9.]+)-", copr, re.M)
    if already:
        v = already.group(1)
        again = render("copr", v, stamp="Tue Feb 03 2026")
        n = len(re.findall(rf"^\*.*- {re.escape(v)}-", again, re.M))
        check("copr render is idempotent", n == 1,
              f"rendering {v} again produced {n} changelog entries for it")

    # ---- every refusal, because a renderer that cannot refuse is not a guard ----
    refuses("bad version", lambda: render("aur", "not-a-version", _SHA))
    refuses("bad sha", lambda: render("aur", "1.2.3", "SKIP"))
    refuses("short sha", lambda: render("aur", "1.2.3", _SHA[:63]))
    refuses("uppercase sha", lambda: render("aur", "1.2.3", _SHA.upper()))
    refuses("placeholder sha", lambda: render("aur", "1.2.3", "0" * 64))
    refuses("sha for copr", lambda: render("copr", "1.2.3", _SHA))
    refuses("missing sha", lambda: render("brew", "1.2.3"))
    refuses("unknown target", lambda: render("nope", "1.2.3"))

    # A template that has LOST its sentinel must fail rather than render unchanged -- the
    # v0.6.13 defect, reproduced directly.
    refuses("sentinel gone", lambda: substitute("pkgver=0.1.2\n", {"VERSION": "1.2.3"}, what="t"))
    # A template carrying a sentinel this script does not know about must also fail.
    refuses("unknown sentinel",
            lambda: substitute("a=@VERSION@ b=@WHAT@\n", {"VERSION": "1.2.3"}, what="t"))

    # ---- Cargo.toml parsing ----
    manifest = (
        '[workspace]\nmembers = ["."]\n\n'
        '[package]\nname = "retch-cli"\nversion = "9.9.9"\n\n'
        '[dependencies]\nclap = "4.6"\n\n'
        '[dependencies.retch-sysinfo]\nversion = "=0.1.72"\n'
    )
    check("cargo version", cargo_version(manifest) == "9.9.9",
          f"got {cargo_version(manifest)!r}")
    refuses("cargo no package", lambda: cargo_version('[dependencies]\nversion = "1.0.0"\n'))
    # The live manifest must parse, since the COPR SRPM build reads it.
    check("live cargo version", VERSION_RE.match(repo_version()) is not None,
          f"repo_version() returned {repo_version()!r}")

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"render_packaging.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print(f"render_packaging.py self-test passed (template v{TEMPLATE_VERSION})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run built-in tests and exit")
    ap.add_argument("--print-version", action="store_true",
                    help="print Cargo.toml's [package] version and exit")
    ap.add_argument("--target", choices=sorted(TARGETS), help="which packaging file to render")
    ap.add_argument("--version", help="released version (default: Cargo.toml's)")
    ap.add_argument("--sha256", help="sha256 of the release tarball (aur and brew only)")
    ap.add_argument("--out", help="write here instead of stdout")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    try:
        if args.print_version:
            print(repo_version())
            return 0
        if not args.target:
            ap.error("--target is required (or use --print-version / --self-test)")
        text = render(args.target, args.version or repo_version(), args.sha256)
    except RenderError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        # Written with an explicit newline policy: these files are consumed by makepkg,
        # rpmbuild and Homebrew on hosts where git may hand out CRLF, and a CR in a
        # PKGBUILD breaks it for Arch users.
        out.write_text(text, encoding="utf-8", newline="\n")
        print(f"rendered {TARGETS[args.target].what} -> {out}")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
