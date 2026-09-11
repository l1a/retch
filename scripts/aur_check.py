#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Guard the AUR packaging: the template in-repo, and the rendered pair at publish time.

TWO MODES, FOR TWO DIFFERENT MOMENTS
------------------------------------
  (default)    packaging/aur/PKGBUILD is a TEMPLATE and must stay one -- no recorded
               version, no recorded checksum, sentinels intact. Wired into `just check`.
  --dir DIR    DIR/PKGBUILD and DIR/.SRCINFO agree field by field. `just aur-publish`
               renders both into a temp directory and runs this against them, so the check
               happens on the bytes actually being pushed to the AUR.

WHY THE TEMPLATE MODE EXISTS
----------------------------
`pkgver` and `sha256sums` used to name a released version here, and keeping that in step
with the same fact recorded in .SRCINFO, the COPR spec and the Homebrew formula is the
entire history of this directory: the PKGBUILD sat at 0.6.12 while the AUR served 0.6.23,
eleven releases, with every CI run green. A checksum cannot be computed before its tag
exists, so recording it also forced a post-tag commit -- and therefore a version bump on
every release, to satisfy `just pr`. scripts/render_packaging.py supplies both values at
publish time instead; this mode's job is to make sure nobody puts them back.

WHY THE PAIR MODE STILL EXISTS
------------------------------
`.SRCINFO` is pure derived data, and the AUR reads *it* for package metadata while building
from the *PKGBUILD*. A pair that disagrees does not fail loudly: the AUR advertises one
version and builds another, and the first person to notice is a user whose install broke.
That check has not become less necessary -- it has moved to the point where it can act on
the real thing rather than on a committed copy of it.

WHAT THIS IS NOT
----------------
It does not verify a sha256 against the real tarball (that is `just aur-publish`, which
computes it, and the `aur` CI job, which re-derives it for the last released tag), and it
does not prove the package builds (that is the `aur` CI job's real `makepkg`). It is the
cheap, offline, always-runnable half. The expensive halves run where they belong.

WHY IT PARSES RATHER THAN SOURCING THE PKGBUILD
-----------------------------------------------
A PKGBUILD is bash, so the obvious implementation is `bash -c 'source PKGBUILD; ...'`. This
parses instead, for two reasons: `just check` is expected to work on Windows without Git's
`usr/bin` on PATH (the reason the man/completions recipes became Python in v0.6.16), and
sourcing an untrusted-by-construction file to validate it is a worse habit than reading it.
The parser handles the subset this PKGBUILD uses and *fails loudly* on anything it does not
understand, rather than silently skipping a field it cannot read — an unparsed field would
otherwise compare equal by being absent from both sides.
"""

from __future__ import annotations

import argparse
import re
import sys
import tempfile
from pathlib import Path

TEMPLATE_VERSION = 1

# Fields that appear in .SRCINFO and must match the PKGBUILD.
SCALARS = ("pkgname", "pkgver", "pkgrel", "pkgdesc", "url")
ARRAYS = ("arch", "license", "depends", "makedepends", "options", "source", "sha256sums")


class ParseError(Exception):
    """The PKGBUILD used a construct this parser does not understand."""


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
        return value[1:-1]
    return value


def _split_array(body: str) -> list[str]:
    """Split a bash array body into elements, respecting quotes.

    `('a' 'b')` and `("x::y" "z")` both occur in practice; a bare `.split()` would break
    any element containing a space (pkgdesc-like strings do).
    """
    out: list[str] = []
    token = ""
    quote = None
    for ch in body:
        if quote:
            if ch == quote:
                quote = None
            else:
                token += ch
        elif ch in "'\"":
            quote = ch
        elif ch.isspace():
            if token:
                out.append(token)
                token = ""
        else:
            token += ch
    if quote:
        raise ParseError(f"unterminated {quote} in array: {body!r}")
    if token:
        out.append(token)
    return out


def parse_pkgbuild(text: str) -> dict[str, list[str]]:
    """Parse the assignments at the top level of a PKGBUILD.

    Stops at the first function definition: everything this cares about is declared above
    `prepare()`/`build()`, and the function bodies contain assignments (`DATE=...`,
    `CARGO_HOME=...`) that are emphatically not package metadata.
    """
    fields: dict[str, list[str]] = {}
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.strip()
        i += 1
        if not line or line.startswith("#"):
            continue
        if re.match(r"^[A-Za-z_][A-Za-z0-9_]*\s*\(\)\s*\{", line):
            break  # first function — metadata section is over
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line)
        if not m:
            continue
        name, rest = m.group(1), m.group(2)
        if name not in SCALARS and name not in ARRAYS:
            continue
        if rest.startswith("("):
            body = rest
            # An array may wrap across lines; accumulate until parens balance.
            while body.count("(") > body.count(")"):
                if i >= len(lines):
                    raise ParseError(f"unterminated array for {name}")
                body += "\n" + lines[i]
                i += 1
            inner = body[body.index("(") + 1 : body.rindex(")")]
            fields[name] = _split_array(inner)
        else:
            fields[name] = [_strip_quotes(rest)]
    missing = [f for f in ("pkgname", "pkgver", "pkgrel") if f not in fields]
    if missing:
        raise ParseError(f"PKGBUILD is missing required field(s): {', '.join(missing)}")
    return fields


def expand(value: str, fields: dict[str, list[str]]) -> str:
    """Expand `$var` / `${var}` against already-parsed scalar fields.

    `source` is written as `"$pkgname-$pkgver.tar.gz::$url/archive/.../v$pkgver.tar.gz"`,
    and .SRCINFO stores it expanded — so comparing them requires doing the same expansion.
    An unknown variable raises rather than expanding to empty: silently producing a
    half-expanded URL would make a real mismatch compare equal.
    """
    scalars = {k: v[0] for k, v in fields.items() if k in SCALARS}

    def repl(m: re.Match[str]) -> str:
        name = m.group(1) or m.group(2)
        if name not in scalars:
            raise ParseError(f"cannot expand ${name} — not a scalar field in this PKGBUILD")
        return scalars[name]

    return re.sub(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)", repl, value)


def pkgbuild_fields(text: str) -> set[tuple[str, str]]:
    """Return the PKGBUILD's metadata as comparable (key, value) pairs."""
    parsed = parse_pkgbuild(text)
    out: set[tuple[str, str]] = set()
    for key, values in parsed.items():
        for v in values:
            out.add((key, expand(v, parsed)))
    return out


def srcinfo_fields(text: str) -> set[tuple[str, str]]:
    """Return .SRCINFO's declarations as comparable (key, value) pairs.

    `pkgbase` is skipped (it names the section, and equals pkgname for a single-package
    build); the trailing `pkgname = …` line IS a real field and is kept.
    """
    out: set[tuple[str, str]] = set()
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("pkgbase"):
            continue
        if "=" not in line:
            continue
        key, value = (s.strip() for s in line.split("=", 1))
        out.add((key, value))
    return out


def compare(pkgbuild_text: str, srcinfo_text: str) -> list[str]:
    """Return a list of human-readable disagreements; empty means they match."""
    pkg = pkgbuild_fields(pkgbuild_text)
    src = srcinfo_fields(srcinfo_text)
    problems = []
    for key, value in sorted(pkg - src):
        problems.append(f"PKGBUILD has {key} = {value!r}, .SRCINFO does not")
    for key, value in sorted(src - pkg):
        problems.append(f".SRCINFO has {key} = {value!r}, PKGBUILD does not")
    return problems


SHA256_RE = re.compile(r"\b[0-9a-fA-F]{64}\b")
VERSIONISH_RE = re.compile(r"\b[0-9]+\.[0-9]+\.[0-9]+\b")


def check_template(text: str) -> list[str]:
    """Return problems with the PKGBUILD *template*; empty means it is still a template.

    The two sentinel assertions are the load-bearing ones, and they are deliberately
    equality tests rather than "contains @VERSION@": a file carrying `pkgver=0.17.3` *and*
    a `@VERSION@` in a comment would satisfy a containment test while shipping a pinned
    version, which is exactly the failure being ruled out.
    """
    problems: list[str] = []
    try:
        fields = parse_pkgbuild(text)
    except ParseError as exc:
        return [str(exc)]

    pkgver = fields.get("pkgver", [""])[0]
    if pkgver != "@VERSION@":
        problems.append(
            f"pkgver is {pkgver!r}, not '@VERSION@' — this file is a template and must "
            "record no released version; scripts/render_packaging.py supplies it at "
            "publish time"
        )
    sums = fields.get("sha256sums", [])
    if sums != ["@SHA256@"]:
        problems.append(
            f"sha256sums is {sums!r}, not ['@SHA256@'] — a checksum cannot be computed "
            "before its tag exists, which is why recording one here forced a post-tag "
            "commit on every release"
        )

    # Nothing else may smuggle the same facts in. Scanned over the parsed metadata rather
    # than the whole file so the comment block, which cites historical versions on purpose,
    # is not mistaken for a pin.
    for key, values in sorted(fields.items()):
        for value in values:
            if key != "sha256sums" and SHA256_RE.search(value):
                problems.append(f"{key} contains a sha256 digest: {value!r}")
            if VERSIONISH_RE.search(value):
                problems.append(f"{key} contains a version number: {value!r}")

    # Regressions this packaging has actually shipped, each worth one line to keep out.
    if 'install -Dm644 "docs/retch.1"' not in text:
        problems.append(
            "package() no longer installs the committed docs/retch.1 — regenerating it is "
            "how the AUR shipped a page footed `$DATE` / `retch $pkgver` for months (v0.7.0)"
        )
    # Matched against non-comment lines only: the comment block explains the mandown defect
    # at length, and a comment describing a rule must never satisfy the check for a file
    # that lost it -- the trap the v0.7.0 PKGBUILD audit and the v0.9.9 Makefile grep both
    # fell into.
    if re.search(r"^\s*[^#\n]*mandown", text, re.M):
        problems.append("a live (non-comment) line references mandown — see v0.7.0")
    for legal in ("LICENSE", "NOTICE"):
        if f'install -Dm644 "{legal}"' not in text:
            problems.append(
                f"package() no longer installs {legal} — NOTICE carries the MIT attribution "
                "for the adapted Fastfetch logos, which must travel with every copy (v0.17.4)"
            )
    return problems


# --------------------------------------------------------------------------------------
# Self-test
# --------------------------------------------------------------------------------------

_GOOD_PKGBUILD = """\
# Maintainer: someone <nobody@example.com>
pkgname=retch
pkgver=0.7.0
pkgrel=1
pkgdesc="A fast, feature-rich system information fetcher written in Rust"
arch=('x86_64' 'aarch64')
url="https://github.com/l1a/retch"
license=('GPL3')
depends=('gcc-libs' 'glibc')
makedepends=('cargo')
options=('!lto')
source=("$pkgname-$pkgver.tar.gz::$url/archive/refs/tags/v$pkgver.tar.gz")
sha256sums=('3d1079e594091341136a272904e3526c69d9764be50dff3e3e96913d001f7691')

build() {
  cd "$pkgname-$pkgver"
  DATE=$(date +"%B %Y")
  cargo build --release --frozen
}
"""

_GOOD_SRCINFO = """\
pkgbase = retch
\tpkgdesc = A fast, feature-rich system information fetcher written in Rust
\tpkgver = 0.7.0
\tpkgrel = 1
\turl = https://github.com/l1a/retch
\tarch = x86_64
\tarch = aarch64
\tlicense = GPL3
\tmakedepends = cargo
\tdepends = gcc-libs
\tdepends = glibc
\toptions = !lto
\tsource = retch-0.7.0.tar.gz::https://github.com/l1a/retch/archive/refs/tags/v0.7.0.tar.gz
\tsha256sums = 3d1079e594091341136a272904e3526c69d9764be50dff3e3e96913d001f7691

pkgname = retch
"""


def _self_test() -> int:
    failures = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    # A matching pair is clean.
    check("matching pair", compare(_GOOD_PKGBUILD, _GOOD_SRCINFO) == [],
          f"got {compare(_GOOD_PKGBUILD, _GOOD_SRCINFO)}")

    # The source URL must be compared EXPANDED — this is the whole point of `expand`.
    pkg = pkgbuild_fields(_GOOD_PKGBUILD)
    check("source expanded",
          ("source", "retch-0.7.0.tar.gz::https://github.com/l1a/retch/archive/refs/tags/v0.7.0.tar.gz") in pkg,
          f"expanded source missing from {sorted(v for k, v in pkg if k == 'source')}")

    # The drift this exists to catch: a bumped pkgver with a stale .SRCINFO.
    stale = _GOOD_SRCINFO.replace("pkgver = 0.7.0", "pkgver = 0.6.23")
    check("stale pkgver detected", len(compare(_GOOD_PKGBUILD, stale)) >= 2,
          f"got {compare(_GOOD_PKGBUILD, stale)}")

    # A stale checksum with a matching version — the shape that breaks on the user's machine.
    badsum = _GOOD_SRCINFO.replace(
        "3d1079e594091341136a272904e3526c69d9764be50dff3e3e96913d001f7691",
        "bf51f58b97adf6dda271eb197bea2cecac7e0fad0475f355962bb0a485f1a8bd")
    check("stale sha256 detected", len(compare(_GOOD_PKGBUILD, badsum)) >= 2,
          f"got {compare(_GOOD_PKGBUILD, badsum)}")

    # A makedepend dropped from one side only.
    extra = _GOOD_SRCINFO.replace("\tmakedepends = cargo",
                                  "\tmakedepends = cargo\n\tmakedepends = mandown")
    check("extra makedepend detected",
          any("mandown" in p for p in compare(_GOOD_PKGBUILD, extra)),
          f"got {compare(_GOOD_PKGBUILD, extra)}")

    # Function bodies must not leak in: `DATE=` lives inside build().
    check("function bodies ignored",
          not any(k == "DATE" for k, _ in pkgbuild_fields(_GOOD_PKGBUILD)),
          "DATE from build() was parsed as metadata")

    # Quoted values containing spaces survive array splitting.
    check("pkgdesc intact",
          ("pkgdesc", "A fast, feature-rich system information fetcher written in Rust") in pkg,
          "pkgdesc was split or mangled")

    # An unknown variable must raise, not expand to empty and compare equal by accident.
    try:
        expand("$nope/x", parse_pkgbuild(_GOOD_PKGBUILD))
        check("unknown var raises", False, "expand() silently accepted $nope")
    except ParseError:
        pass

    # A PKGBUILD missing a required field must raise rather than compare as empty.
    try:
        parse_pkgbuild("pkgname=retch\n")
        check("missing pkgver raises", False, "parse_pkgbuild accepted a PKGBUILD with no pkgver")
    except ParseError:
        pass

    # ---- template mode ----
    # The live template must pass. This is the one assertion that couples the self-test to
    # the real file, and deliberately so: a self-test that only ever reads fixtures cannot
    # notice that the thing it guards has stopped being guardable.
    live = Path(__file__).resolve().parent.parent / "packaging" / "aur" / "PKGBUILD"
    if live.is_file():
        live_problems = check_template(live.read_text(encoding="utf-8"))
        check("live template clean", live_problems == [], f"got {live_problems}")

    tmpl = _GOOD_PKGBUILD.replace("pkgver=0.7.0", "pkgver=@VERSION@").replace(
        "sha256sums=('3d1079e594091341136a272904e3526c69d9764be50dff3e3e96913d001f7691')",
        "sha256sums=('@SHA256@')",
    ) + (
        'package() {\n'
        '  install -Dm644 "docs/retch.1" "$pkgdir/x"\n'
        '  install -Dm644 "LICENSE" "$pkgdir/l"\n'
        '  install -Dm644 "NOTICE" "$pkgdir/n"\n'
        "}\n"
    )
    check("template fixture clean", check_template(tmpl) == [], f"got {check_template(tmpl)}")

    # Each way a template can stop being one. These are the assertions that matter: the
    # whole point of the mode is that a pinned version cannot come back unnoticed.
    pinned = tmpl.replace("pkgver=@VERSION@", "pkgver=0.17.3")
    check("pinned pkgver rejected", any("pkgver" in p for p in check_template(pinned)),
          f"got {check_template(pinned)}")
    pinned_sum = tmpl.replace(
        "sha256sums=('@SHA256@')",
        "sha256sums=('77ccf85843d24ac3216ab31d2584ff4a95869266c59ddb8bc83819425cfc2033')")
    check("pinned sha256 rejected", any("sha256sums" in p for p in check_template(pinned_sum)),
          f"got {check_template(pinned_sum)}")
    # A digest smuggled into another field, which the equality checks alone would miss.
    smuggled = tmpl.replace(
        'url="https://github.com/l1a/retch"',
        'url="https://github.com/l1a/retch#77ccf85843d24ac3216ab31d2584ff4a95869266c59ddb8bc83819425cfc2033"')
    check("smuggled digest rejected", any("digest" in p for p in check_template(smuggled)),
          f"got {check_template(smuggled)}")
    check("regenerated man page rejected",
          any("docs/retch.1" in p for p in check_template(tmpl.replace('install -Dm644 "docs/retch.1" "$pkgdir/x"', "true"))),
          "a template that stopped installing the committed man page passed")
    check("live mandown rejected",
          any("mandown" in p for p in check_template(tmpl + "  mandown docs/retch.1.md\n")),
          "a non-comment mandown line passed")
    check("commented mandown accepted",
          not any("mandown" in p for p in check_template(tmpl + "# mandown is not used here\n")),
          "a COMMENT mentioning mandown was treated as a live reference")
    for legal in ("LICENSE", "NOTICE"):
        dropped = tmpl.replace(f'install -Dm644 "{legal}" ', "true ")
        check(f"missing {legal} rejected", any(legal in p for p in check_template(dropped)),
              f"got {check_template(dropped)}")

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"aur_check.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print(f"aur_check.py self-test passed (template v{TEMPLATE_VERSION})")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run built-in tests and exit")
    ap.add_argument("--dir", default=None,
                    help="directory holding a RENDERED PKGBUILD and .SRCINFO to compare")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    # No --dir: check the in-repo template. This is what `just check` runs, and there is no
    # committed .SRCINFO to compare it against -- it is generated from the rendered PKGBUILD
    # at publish time, which is where the pair check now happens.
    if args.dir is None:
        template = Path(__file__).resolve().parent.parent / "packaging" / "aur" / "PKGBUILD"
        if not template.is_file():
            print(f"error: {template} not found", file=sys.stderr)
            return 1
        problems = check_template(template.read_text(encoding="utf-8"))
        if problems:
            print(f"error: {template} is no longer a valid template:", file=sys.stderr)
            for p in problems:
                print(f"  {p}", file=sys.stderr)
            return 1
        print("packaging/aur/PKGBUILD is a template (records no version, no checksum)")
        return 0

    base = Path(args.dir)
    pkgbuild, srcinfo = base / "PKGBUILD", base / ".SRCINFO"
    for f in (pkgbuild, srcinfo):
        if not f.is_file():
            print(f"error: {f} not found", file=sys.stderr)
            return 1

    try:
        problems = compare(pkgbuild.read_text(encoding="utf-8"),
                           srcinfo.read_text(encoding="utf-8"))
    except ParseError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1

    if problems:
        print(f"error: {pkgbuild} and {srcinfo} disagree:", file=sys.stderr)
        for p in problems:
            print(f"  {p}", file=sys.stderr)
        print("\nRegenerate the pair with: just aur-srcinfo <dir>", file=sys.stderr)
        return 1

    ver = dict((k, v) for k, v in pkgbuild_fields(pkgbuild.read_text(encoding="utf-8")) if k == "pkgver")
    print(f"{base}: PKGBUILD and .SRCINFO agree (pkgver {ver.get('pkgver', '?')})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
