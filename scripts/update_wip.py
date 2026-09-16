#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""
Updates WIP.md after merging a feature branch to main.
Sets Active Branch to none and updates the latest commit details from git.
WIP.md is an ongoing, rolling log — this only rewrites the Active-Branch and
latest-commit lines; it preserves the notes and open-task sections.

IT ALSO PRESERVES THE FILE'S LINE ENDINGS, AND THAT IS NOT INCIDENTAL.
`WIP.md` in this repo is deliberately CRLF — it is the one tracked-adjacent artefact that
is meant to be, which is why `scripts/text_check.py` forbids carriage returns in *tracked*
text and `WIP.md` is gitignored and therefore invisible to it. Nothing else protects it.

The previous version read with `read_text()` and wrote with `write_text()`. Both use
universal newlines, so `\r\n` became `\n` in memory and was written back as whatever the
PLATFORM prefers — which round-trips on Windows and silently converts the whole file on
Linux and macOS. That is why it went unnoticed: this repo's merges were historically cut
from a Windows host, and the first merge run from Linux converted all 4773 CRLF to LF.

Measured immediately after that merge: 0 CRLF, 4824 lone LF. Restored by hand; this is the
fix so it does not recur.

A second trap, and the reason a naive "just read bytes" fix is not enough: the two
substitutions below use `.*`, and in Python's `re` a dot matches `\r` (it only excludes
`\n`). So on CRLF text `.*` swallows the carriage return and the replacement line comes
back LF-terminated — two corrupt lines in an otherwise CRLF file, which is harder to spot
than wholesale conversion. Normalising to `\n` before substituting and re-applying the
terminator on write avoids both.
"""

import subprocess
import re
import sys
from pathlib import Path

def read_preserving_newlines(path):
    """Return (text_with_lf_endings, dominant_terminator).

    Read as BYTES rather than text: `read_text()` applies universal newlines, which is
    exactly the conversion this function exists to avoid. The terminator is chosen by
    majority so a file with a few stray lone LFs in an otherwise CRLF document still
    round-trips as CRLF.
    """
    raw = path.read_bytes()
    crlf = raw.count(b"\r\n")
    lf = raw.count(b"\n") - crlf
    newline = "\r\n" if crlf > lf else "\n"
    return raw.decode("utf-8").replace("\r\n", "\n"), newline


def write_preserving_newlines(path, text, newline):
    """Write BYTES, re-applying `newline`. Never `write_text`, which re-translates."""
    path.write_bytes(text.replace("\n", newline).encode("utf-8"))


def run(cmd):
    try:
        # encoding="utf-8" (not the platform default) so commit subjects with
        # non-Latin-1 characters — e.g. "→" or an em-dash, both common in this
        # repo's merge subjects — decode correctly on Windows (cp1252) too.
        return subprocess.run(
            cmd, capture_output=True, text=True, encoding="utf-8", check=True
        ).stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {' '.join(cmd)}", file=sys.stderr)
        if e.stdout:
            print(e.stdout, file=sys.stderr)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        sys.exit(e.returncode)

def read_cargo_version(root_dir):
    """Return the package version from Cargo.toml, or None if unreadable.

    Matches the first top-level ``version = "..."`` line — the same heuristic
    ``just man`` uses — which is the ``[package]`` version (the workspace table
    has no version key).
    """
    cargo_file = root_dir / "Cargo.toml"
    try:
        for line in cargo_file.read_text(encoding="utf-8").splitlines():
            m = re.match(r'version\s*=\s*"([^"]+)"', line)
            if m:
                return m.group(1)
    except OSError:
        pass
    return None

def main():
    # WIP.md and this repo's commit subjects contain non-Latin-1 characters
    # (em-dashes, "→"). Force UTF-8 on stdout so the final status print does not
    # crash under a cp1252 console on Windows (where `just merge-pr` runs it).
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

    root_dir = Path(__file__).resolve().parent.parent
    wip_file = root_dir / "WIP.md"
    if not wip_file.exists():
        print("WIP.md not found. Skipping update.", file=sys.stderr)
        return

    # Get latest commit info on main
    commit_hash = run(["git", "rev-parse", "--short", "HEAD"])
    commit_msg = run(["git", "log", "-1", "--format=%s"])
    
    text, newline = read_preserving_newlines(wip_file)
    
    # 1. Update Active Branch to none.
    #    count=1: only the first (top-of-file header) occurrence — guards against
    #    the header string also appearing in the notes/open-task prose below.
    text = re.sub(
        r'### Active Branch:.*',
        '### Active Branch: none (main is current)',
        text,
        count=1,
    )
    
    # 2. Update the "main HEAD" pointer to the latest commit on main.
    #    WIP.md format: **main HEAD**: `<hash>` — <subject> — **v<version>**
    #    (Older WIPs used a "**Latest commit on main**:" line; that header no
    #    longer exists, which is why this substitution previously silently
    #    no-op'd and left the pointer stale after a merge.)
    #    A function replacement is used so any regex-metacharacters in the
    #    commit subject (e.g. "\1", "\g") are treated literally, not as
    #    backreferences.
    #    count=1: the header string also appears verbatim in the notes/open-task
    #    prose, so an unbounded sub would rewrite those lines too — only the first
    #    (top-of-file header) occurrence must be touched.
    version = read_cargo_version(root_dir)
    version_suffix = f" — **v{version}**" if version else ""
    new_head_line = f'**main HEAD**: `{commit_hash}` — {commit_msg}{version_suffix}'
    text = re.sub(
        r'\*\*main HEAD\*\*:.*',
        lambda _m: new_head_line,
        text,
        count=1,
    )

    write_preserving_newlines(wip_file, text, newline)
    print(f"Updated WIP.md: Active Branch set to none, main HEAD updated to {new_head_line}")

def _self_test():
    """Assert the round trip, in BOTH directions, and assert the old code would fail it.

    A guard nobody has watched fail is a check that may not be able to, so the CRLF case
    below is the one that was actually broken and the LF case is the control that stops the
    fix over-correcting a repo whose WIP.md is legitimately LF.
    """
    import tempfile

    failures = []

    def check(name, cond, detail=""):
        if not cond:
            failures.append(f"{name}: {detail}")

    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d)

        # CRLF in, CRLF out -- the defect.
        f = tmp / "crlf.md"
        f.write_bytes(b"### Active Branch: feature/x\r\nbody\r\n**main HEAD**: `old`\r\n")
        text, nl = read_preserving_newlines(f)
        check("CRLF detected", nl == "\r\n", f"got {nl!r}")
        check("normalised in memory", "\r" not in text, "carriage returns survived the read")
        write_preserving_newlines(f, text, nl)
        raw = f.read_bytes()
        check("CRLF round-trips", raw.count(b"\r\n") == 3 and raw.count(b"\n") == 3,
              f"crlf={raw.count(bytes([13,10]))} lf={raw.count(bytes([10]))}")

        # LF in, LF out -- the control. Without it the fix could force CRLF everywhere.
        f2 = tmp / "lf.md"
        f2.write_bytes(b"### Active Branch: feature/x\nbody\n")
        text2, nl2 = read_preserving_newlines(f2)
        check("LF detected", nl2 == "\n", f"got {nl2!r}")
        write_preserving_newlines(f2, text2, nl2)
        check("LF round-trips", b"\r" not in f2.read_bytes(), "a CR was introduced")

        # The `.*` trap: a dot matches \r, so substituting on UN-normalised CRLF text
        # eats the carriage return and leaves one lone-LF line. Asserted as a property so
        # nobody "simplifies" the normalisation away.
        crlf_text = "### Active Branch: feature/x\r\nbody\r\n"
        naive = re.sub(r"### Active Branch:.*", "### Active Branch: none (main is current)",
                       crlf_text, count=1)
        check("the .* trap is real", naive.count("\r\n") == 1,
              "expected the substitution to eat one CR -- if this fails, re's dot changed")

        # And the same substitution on normalised text keeps every line intact.
        norm, nl3 = read_preserving_newlines(f)
        fixed = re.sub(r"### Active Branch:.*", "### Active Branch: none (main is current)",
                       norm, count=1)
        write_preserving_newlines(f, fixed, nl3)
        raw3 = f.read_bytes()
        check("substitution keeps CRLF on the rewritten line",
              raw3.count(b"\r\n") == 3 and (raw3.count(b"\n") - raw3.count(b"\r\n")) == 0,
              f"lone LF = {raw3.count(bytes([10])) - raw3.count(bytes([13,10]))}")
        check("substitution applied", b"none (main is current)" in raw3, "sub did not fire")

    if failures:
        for f_ in failures:
            print(f"  FAIL {f_}", file=sys.stderr)
        print(f"update_wip.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("update_wip.py self-test passed")
    return 0


if __name__ == "__main__":
    if "--self-test" in sys.argv[1:]:
        sys.exit(_self_test())
    main()
