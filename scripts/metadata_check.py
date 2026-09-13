#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a
"""Assert every channel's description and licence agree with packaging/metadata.toml.

WHY THIS EXISTS
---------------
Each channel shows users a description and a licence, and until v0.17.9 each one was written
separately and checked by nothing. The v0.17.9 review found four of them wrong at once:

  * the Nix derivation declared `licenses.gpl3Only` for a GPL-3.0-**or-later** project;
  * the AUR PKGBUILD still used the legacy `GPL3` rather than the SPDX identifier;
  * `flake.nix` and the GitHub About box both advertised "short/long output modes", two of
    the four modes that exist;
  * the COPR project page quoted one machine's benchmark numbers from an old release.

The last two are the telling ones: they live on services, not in any file a release
publishes, so no release step had ever touched them. `packaging/metadata.toml` is now the one
place the text is written, this script fails when a channel's copy drifts from it, and the two
service-side copies are pushed at release time (`copr.yml` on the tag; `--sync-github`, via
`just github-metadata`).

WHAT IT CHECKS
--------------
All offline, deterministic and free:

  1. retch-cli's Cargo.toml `description` BEGINS with `summary`; the PKGBUILD `pkgdesc`, the
     spec's `Summary:`, the Nix derivation's and the flake's descriptions EQUAL it.
  2. The Homebrew formula's `desc` equals `brew_desc`, and `brew_desc` obeys `brew audit`'s
     rules (no leading article, no formula name, no trailing full stop, at most 80 chars).
  3. Every licence field names `license`, in its channel's vocabulary.
  4. The GitHub description and topics are within GitHub's limits.
  5. The COPR project-page files exist, are non-empty and LF-only, and indent no paragraph line
     by 4+ spaces outside a code fence -- COPR renders Markdown, and such a line becomes a
     code block (the 2026-08-31 description bug).

Files are read as BYTES and decoded, not with `read_text()`: universal-newline decoding turns
CRLF into LF on the way in, which would make the CR check in (5) a check that cannot fail.

WHAT IT IS NOT
--------------
It does not judge whether the prose is TRUE -- a README can agree with itself and still name a
flag that does not exist, which is what the v0.17.9 review also found. That is a human review
before tagging, and AGENTS.md §4.9 says so.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tomllib
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
META = REPO / "packaging" / "metadata.toml"
REPO_SLUG = "l1a/retch"

FILES = {
    "cargo_cli": "Cargo.toml",
    "cargo_sysinfo": "crates/sysinfo/Cargo.toml",
    "pkgbuild": "packaging/aur/PKGBUILD",
    "spec": "packaging/copr/retch.spec",
    "formula": "packaging/homebrew/retch.rb",
    "package_nix": "packaging/nixpkgs/package.nix",
    "flake_nix": "flake.nix",
}

# Nix names licences by attribute rather than SPDX id. Only identifiers this project could
# plausibly declare; an unknown one is reported rather than guessed.
NIX_LICENSE = {"GPL-3.0-or-later": "gpl3Plus", "GPL-3.0-only": "gpl3Only"}

TOPIC_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,49}$")
GITHUB_DESCRIPTION_MAX = 350
GITHUB_TOPICS_MAX = 20
BREW_DESC_MAX = 80


class ParseError(Exception):
    """metadata.toml is malformed, or a checked file lacks a field this script needs."""


def load_meta(text: str) -> dict:
    """Parse metadata.toml and insist on every key the checks and the syncs rely on."""
    try:
        meta = tomllib.loads(text)
    except tomllib.TOMLDecodeError as exc:
        raise ParseError(f"metadata.toml: {exc}") from exc
    for key in ("summary", "brew_desc", "license"):
        if not isinstance(meta.get(key), str) or not meta[key].strip():
            raise ParseError(f"metadata.toml: `{key}` must be a non-empty string")
    github = meta.get("github")
    if (
        not isinstance(github, dict)
        or not isinstance(github.get("description"), str)
        or not isinstance(github.get("topics"), list)
    ):
        raise ParseError("metadata.toml: [github] needs `description` (string) and `topics` (list)")
    copr = meta.get("copr")
    if not isinstance(copr, dict) or not all(
        isinstance(copr.get(k), str) for k in ("description", "instructions")
    ):
        raise ParseError("metadata.toml: [copr] needs `description` and `instructions` paths")
    return meta


def _read(path: Path) -> str:
    # Bytes, then decode: `read_text()` would translate CRLF and hide it from check (5).
    return path.read_bytes().decode("utf-8")


def read_texts(meta: dict) -> dict[str, str]:
    texts = {key: _read(REPO / rel) for key, rel in FILES.items()}
    texts["copr_description"] = _read(REPO / meta["copr"]["description"])
    texts["copr_instructions"] = _read(REPO / meta["copr"]["instructions"])
    return texts


def _field(text: str, pattern: str, what: str) -> str:
    """The first match of `pattern` (one group), or ParseError naming what was missing."""
    m = re.search(pattern, text, re.M)
    if not m:
        raise ParseError(f"no {what}")
    return m.group(1).strip()


def check_copr_markdown(text: str, label: str) -> list[str]:
    problems: list[str] = []
    if not text.strip():
        problems.append(f"{label} is empty")
    if "\r" in text:
        problems.append(f"{label} contains CR bytes; COPR stores exactly what is sent")
    fenced = False
    for number, line in enumerate(text.split("\n"), 1):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if not fenced and line.strip() and (line.startswith("    ") or line.startswith("\t")):
            problems.append(
                f"{label} line {number} is indented 4+ spaces outside a code fence, which "
                f"COPR's Markdown renders as a code block: {line.strip()[:60]!r}"
            )
    return problems


def check_channels(meta: dict, texts: dict[str, str]) -> list[str]:
    """Return a list of problems; empty means every channel agrees with metadata.toml."""
    problems: list[str] = []
    summary, brew_desc, licence = meta["summary"], meta["brew_desc"], meta["license"]

    def expect(where: str, got: str | None, want: str) -> None:
        if got != want:
            problems.append(f"{where} is {got!r}, not {want!r}")

    # 1 and 3 for the two crates, read with a real TOML parser.
    try:
        cli = tomllib.loads(texts["cargo_cli"])["package"]
        sysinfo = tomllib.loads(texts["cargo_sysinfo"])["package"]
    except (tomllib.TOMLDecodeError, KeyError) as exc:
        return [f"could not read a Cargo.toml [package] table: {exc}"]
    description = cli.get("description", "")
    if not description.startswith(summary):
        problems.append(
            f"Cargo.toml description {description!r} does not begin with the summary "
            f"{summary!r} (crates.io shows it as the one-liner)"
        )
    expect("Cargo.toml license", cli.get("license"), licence)
    expect("crates/sysinfo/Cargo.toml license", sysinfo.get("license"), licence)

    # 1, 2 and 3 for the packaging files. Each is parsed independently so one missing field
    # does not hide a drift in the next file.
    fields = [
        ("PKGBUILD pkgdesc", "pkgbuild", r'^pkgdesc="([^"]*)"', summary),
        ("PKGBUILD license", "pkgbuild", r"^license=\('([^']*)'\)", licence),
        ("spec Summary", "spec", r"^Summary:\s*(.+)$", summary),
        ("spec License", "spec", r"^License:\s*(.+)$", licence),
        ("formula desc", "formula", r'^\s*desc\s+"([^"]*)"', brew_desc),
        ("formula license", "formula", r'^\s*license\s+"([^"]*)"', licence),
        ("package.nix description", "package_nix", r'^\s*description\s*=\s*"([^"]*)";', summary),
        # The flake's own description is its FIRST `description =`: a later one belongs to the
        # Home Manager option set ("Configuration for retch").
        ("flake.nix description", "flake_nix", r'^\s*description\s*=\s*"([^"]*)";', summary),
    ]
    for where, key, pattern, want in fields:
        try:
            expect(where, _field(texts[key], pattern, where), want)
        except ParseError as exc:
            problems.append(str(exc))

    nix_licence = NIX_LICENSE.get(licence)
    if nix_licence is None:
        problems.append(f"no Nix licence attribute is known for {licence!r}; add it to NIX_LICENSE")
    else:
        try:
            got = _field(texts["package_nix"], r"^\s*license\s*=\s*licenses\.(\w+);", "package.nix license")
            expect("package.nix license", f"licenses.{got}", f"licenses.{nix_licence}")
        except ParseError as exc:
            problems.append(str(exc))

    # 2. `brew audit`'s rules for `desc`, checked here because brew only runs on macOS CI.
    if len(brew_desc) > BREW_DESC_MAX:
        problems.append(f"brew_desc is {len(brew_desc)} characters; brew audit allows {BREW_DESC_MAX}")
    if re.match(r"(?i)(a|an|the)\s", brew_desc):
        problems.append(f"brew_desc {brew_desc!r} starts with an article, which brew audit rejects")
    if "retch" in brew_desc.lower():
        problems.append(f"brew_desc {brew_desc!r} contains the formula name, which brew audit rejects")
    if brew_desc.endswith("."):
        problems.append(f"brew_desc {brew_desc!r} ends with a full stop, which brew audit rejects")

    # 4. GitHub's limits, so `--sync-github` is not the first thing to discover them.
    github_description = meta["github"]["description"]
    topics = meta["github"]["topics"]
    if not github_description.strip():
        problems.append("[github] description is empty")
    if len(github_description) > GITHUB_DESCRIPTION_MAX:
        problems.append(
            f"[github] description is {len(github_description)} characters; GitHub allows "
            f"{GITHUB_DESCRIPTION_MAX}"
        )
    if len(topics) > GITHUB_TOPICS_MAX:
        problems.append(f"[github] has {len(topics)} topics; GitHub allows {GITHUB_TOPICS_MAX}")
    if len(set(topics)) != len(topics):
        problems.append("[github] topics contain a duplicate")
    for topic in topics:
        if not isinstance(topic, str) or not TOPIC_RE.match(topic):
            problems.append(f"[github] topic {topic!r} is not lowercase letters, digits and hyphens")

    # 5. The COPR project page.
    problems.extend(check_copr_markdown(texts["copr_description"], "COPR description"))
    problems.extend(check_copr_markdown(texts["copr_instructions"], "COPR instructions"))
    return problems


# ── GitHub sync ──────────────────────────────────────────────────────────────


def _gh(*args: str) -> str:
    gh = shutil.which("gh")
    if gh is None:
        raise RuntimeError("gh is not on PATH")
    result = subprocess.run([gh, *args], capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        raise RuntimeError(f"`gh {' '.join(args[:3])} ...` failed: {result.stderr.strip()}")
    return result.stdout


def github_state() -> tuple[str, list[str]]:
    data = json.loads(_gh("repo", "view", REPO_SLUG, "--json", "description,repositoryTopics"))
    topics = sorted(t["name"] for t in (data.get("repositoryTopics") or []))
    return data.get("description") or "", topics


def sync_github(meta: dict, dry_run: bool) -> int:
    """Make the repository's description and topics exactly metadata.toml's, then read back."""
    want_description = meta["github"]["description"]
    want_topics = sorted(meta["github"]["topics"])
    have_description, have_topics = github_state()

    if have_description == want_description and have_topics == want_topics:
        print(f"[github-metadata] {REPO_SLUG} already matches packaging/metadata.toml")
        return 0
    if have_description != want_description:
        print(f"[github-metadata] description: {have_description!r}\n"
              f"                          -> {want_description!r}")
    if have_topics != want_topics:
        print(f"[github-metadata] topics: {have_topics} -> {want_topics}")
    if dry_run:
        print("[github-metadata] --dry-run: nothing changed")
        return 0

    if have_description != want_description:
        _gh("repo", "edit", REPO_SLUG, "--description", want_description)
    if have_topics != want_topics:
        # PUT replaces the whole list, so a topic dropped from metadata.toml is dropped here.
        args = ["api", "-X", "PUT", f"repos/{REPO_SLUG}/topics"]
        for topic in want_topics:
            args += ["-f", f"names[]={topic}"]
        _gh(*args)

    # Read back rather than trust the exit codes: the claim is that GitHub now shows this.
    got_description, got_topics = github_state()
    if got_description != want_description or got_topics != want_topics:
        print(f"[github-metadata] read-back disagrees: {got_description!r} {got_topics}",
              file=sys.stderr)
        return 1
    print(f"[github-metadata] {REPO_SLUG} updated and read back")
    return 0


# ── self-test ────────────────────────────────────────────────────────────────

_META = """\
summary = "A fast thing written in Rust"
brew_desc = "Fast thing"
license = "GPL-3.0-or-later"
[github]
description = "Fast thing."
topics = ["cli", "rust"]
[copr]
description = "d.md"
instructions = "i.md"
"""

_TEXTS = {
    "cargo_cli": '[package]\nname = "retch-cli"\ndescription = "A fast thing written in Rust (like others)"\nlicense = "GPL-3.0-or-later"\n',
    "cargo_sysinfo": '[package]\nname = "retch-sysinfo"\ndescription = "A library"\nlicense = "GPL-3.0-or-later"\n',
    "pkgbuild": "pkgname=retch\npkgdesc=\"A fast thing written in Rust\"\nlicense=('GPL-3.0-or-later')\n",
    "spec": "Name:           retch\nSummary:        A fast thing written in Rust\nLicense:        GPL-3.0-or-later\n",
    "formula": 'class Retch < Formula\n  desc "Fast thing"\n  license "GPL-3.0-or-later"\nend\n',
    "package_nix": '  meta = with lib; {\n    description = "A fast thing written in Rust";\n    license = licenses.gpl3Plus;\n  };\n',
    "flake_nix": '{\n  description = "A fast thing written in Rust";\n  opts = {\n    description = "Configuration for retch";\n  };\n}\n',
    "copr_description": "**retch** is fast.\n\n* an item\n\n```\n    indented code is fine inside a fence\n```\n",
    "copr_instructions": "Install:\n\n```\nsudo dnf install retch\n```\n",
}


def _self_test() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        if not cond:
            failures.append(f"{name}: {detail}")

    meta = load_meta(_META)

    def expect_problem(label: str, key: str, old: str, new: str, needle: str) -> None:
        texts = dict(_TEXTS)
        check(f"{label} (fixture carries {old!r})", old in texts[key], "fixture changed shape")
        texts[key] = texts[key].replace(old, new)
        probs = check_channels(meta, texts)
        check(label, any(needle in p for p in probs), f"got {probs}")

    clean = check_channels(meta, _TEXTS)
    check("fixture clean", clean == [], f"got {clean}")

    # The LIVE files must be clean too: one assertion coupling this self-test to the real
    # repository, so it cannot keep passing about fixtures after a real file drifted.
    if META.is_file():
        try:
            live_meta = load_meta(_read(META))
            live = check_channels(live_meta, read_texts(live_meta))
        except (ParseError, FileNotFoundError) as exc:
            live = [str(exc)]
        check("live repository clean", live == [], f"got {live}")

    # The four real defects the v0.17.9 review found, each as a fixture.
    expect_problem("Nix gpl3Only detected", "package_nix", "gpl3Plus", "gpl3Only", "package.nix license")
    expect_problem("legacy AUR GPL3 detected", "pkgbuild", "('GPL-3.0-or-later')", "('GPL3')", "PKGBUILD license")
    expect_problem("stale flake description detected", "flake_nix",
                   '"A fast thing written in Rust"', '"Fast fetcher, short/long modes."', "flake.nix description")
    expect_problem("indented COPR paragraph detected", "copr_description",
                   "* an item\n", "* an item\n\n    an indented paragraph\n", "code block")

    # The later `description =` in the flake belongs to the HM options, not the flake, so
    # changing it must produce no problem at all.
    check("second flake description ignored",
          check_channels(meta, {**_TEXTS, "flake_nix": _TEXTS["flake_nix"].replace(
              '"Configuration for retch"', '"Something else"')}) == [], "a later description was checked")

    # Every other channel copy, one drift each.
    expect_problem("pkgdesc drift detected", "pkgbuild", "A fast thing written", "A slow thing written", "PKGBUILD pkgdesc")
    expect_problem("spec Summary drift detected", "spec", "Summary:        A fast", "Summary:        A slow", "spec Summary")
    expect_problem("spec License drift detected", "spec", "License:        GPL-3.0-or-later", "License:        MIT", "spec License")
    expect_problem("formula desc drift detected", "formula", 'desc "Fast thing"', 'desc "Slow thing"', "formula desc")
    expect_problem("Cargo description drift detected", "cargo_cli", '"A fast thing written in Rust (like others)"',
                   '"A fetcher"', "does not begin with the summary")
    expect_problem("sysinfo licence drift detected", "cargo_sysinfo", 'license = "GPL-3.0-or-later"',
                   'license = "MIT"', "crates/sysinfo/Cargo.toml license")
    expect_problem("CR in COPR text detected", "copr_instructions", "Install:\n", "Install:\r\n", "CR bytes")

    # A missing field is reported, not treated as agreement.
    texts = dict(_TEXTS, pkgbuild="pkgname=retch\n")
    probs = check_channels(meta, texts)
    check("missing pkgdesc reported", any("no PKGBUILD pkgdesc" in p for p in probs), f"got {probs}")

    # brew audit's rules, and GitHub's limits.
    for label, brew, needle in [
        ("leading article", "A fast thing", "article"),
        ("formula name", "Fast retch thing", "formula name"),
        ("full stop", "Fast thing.", "full stop"),
        ("too long", "F" * 81, "characters"),
    ]:
        bad = load_meta(_META.replace('brew_desc = "Fast thing"', f'brew_desc = "{brew}"'))
        probs = check_channels(bad, dict(_TEXTS, formula=_TEXTS["formula"].replace('"Fast thing"', f'"{brew}"')))
        check(f"brew {label} detected", any(needle in p for p in probs), f"got {probs}")
    bad = load_meta(_META.replace('["cli", "rust"]', '["cli", "Rust Lang"]'))
    check("bad topic detected", any("topic" in p for p in check_channels(bad, _TEXTS)), "no topic problem")
    bad = load_meta(_META.replace('["cli", "rust"]', '["cli", "cli"]'))
    check("duplicate topic detected", any("duplicate" in p for p in check_channels(bad, _TEXTS)), "no duplicate problem")

    # A malformed metadata.toml raises rather than comparing as empty.
    try:
        load_meta('summary = ""\n')
        check("empty summary raises", False, "load_meta accepted an empty summary")
    except ParseError:
        pass

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"metadata_check.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("metadata_check.py self-test passed")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-test", action="store_true", help="run the built-in assertions")
    ap.add_argument("--sync-github", action="store_true",
                    help="after checking, set the GitHub description and topics from metadata.toml")
    ap.add_argument("--dry-run", action="store_true", help="with --sync-github: show, change nothing")
    args = ap.parse_args()

    if args.self_test:
        return _self_test()

    try:
        meta = load_meta(_read(META))
        problems = check_channels(meta, read_texts(meta))
    except (ParseError, FileNotFoundError) as exc:
        print(f"[metadata-check] {exc}", file=sys.stderr)
        return 1

    if problems:
        for p in problems:
            print(f"[metadata-check] {p}", file=sys.stderr)
        print("[metadata-check] packaging/metadata.toml is the source; bring the channel back "
              "in line with it (or change it there, deliberately)", file=sys.stderr)
        return 1
    print("[metadata-check] channel descriptions and licences agree with packaging/metadata.toml")

    if args.sync_github:
        try:
            return sync_github(meta, args.dry_run)
        except RuntimeError as exc:
            print(f"[github-metadata] {exc}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
