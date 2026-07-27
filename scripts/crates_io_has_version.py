#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Ken Tobias
# SPDX-License-Identifier: GPL-3.0-or-later
"""Check whether a specific crate version is published on crates.io.

Used by `just publish-check` to decide whether the retch-cli dry run can succeed:
retch-cli pins `retch-sysinfo = "=0.1.x"`, and a dry run cannot resolve that pin until
the pinned version is actually on the index. Distinguishing "not published yet"
(expected before a release) from a real packaging error avoids a confusing hard failure.

Queries the sparse index (`index.crates.io`) rather than the web API: it needs no
User-Agent header, is the same source cargo itself reads, and returns one JSON object
per line, one per published version.

Exit status:
    0  the version exists and is not yanked
    1  the version is absent, or yanked
    2  the index could not be reached / parsed (caller should treat as unknown)
"""

import json
import sys
import urllib.error
import urllib.request

TIMEOUT_SECONDS = 15


def index_path(crate: str) -> str:
    """Return the sparse-index path for a crate name.

    crates.io shards by name length: 1 char -> `1/name`, 2 -> `2/name`,
    3 -> `3/f/name`, 4+ -> `ab/cd/name` using the first four characters.
    """
    name = crate.lower()
    if len(name) == 1:
        return f"1/{name}"
    if len(name) == 2:
        return f"2/{name}"
    if len(name) == 3:
        return f"3/{name[0]}/{name}"
    return f"{name[0:2]}/{name[2:4]}/{name}"


def published_versions(crate: str) -> list[dict]:
    """Fetch every version record for `crate` from the sparse index."""
    url = f"https://index.crates.io/{index_path(crate)}"
    with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as resp:
        body = resp.read().decode("utf-8")
    return [json.loads(line) for line in body.splitlines() if line.strip()]


def main() -> int:
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <crate> <version>", file=sys.stderr)
        return 2

    crate, version = sys.argv[1], sys.argv[2]

    try:
        versions = published_versions(crate)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"{crate} is not on crates.io at all", file=sys.stderr)
            return 1
        print(f"crates.io index lookup failed for {crate}: {e}", file=sys.stderr)
        return 2
    except Exception as e:  # network error, malformed index, ...
        print(f"crates.io index lookup failed for {crate}: {e}", file=sys.stderr)
        return 2

    for record in versions:
        if record.get("vers") == version:
            if record.get("yanked"):
                print(f"{crate} {version} is published but YANKED", file=sys.stderr)
                return 1
            print(f"{crate} {version} is published")
            return 0

    print(f"{crate} {version} is not published yet", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
