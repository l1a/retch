#!/usr/bin/env python3
"""Cross-platform script to build docs/retch.1 man page from docs/retch.1.md."""

import re
import sys
import datetime
import subprocess
from pathlib import Path

def main():
    repo_root = Path(__file__).resolve().parent.parent
    docs_dir = repo_root / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)

    cargo_toml = repo_root / "Cargo.toml"
    version = "0.0.0"
    for line in cargo_toml.read_text(encoding="utf-8").splitlines():
        if line.startswith("version ="):
            version = line.split("=")[1].strip().strip('"')
            break

    date_str = datetime.datetime.now().strftime("%B %Y")
    src_md = docs_dir / "retch.1.md"
    dst_man = docs_dir / "retch.1"

    # Run mandown
    mandown_cmd = ["mandown", str(src_md), "RETCH", "1"]
    try:
        res = subprocess.run(mandown_cmd, capture_output=True, text=True, check=True)
        content = res.stdout
    except FileNotFoundError:
        print("Error: 'mandown' executable not found. Install with: cargo install mandown", file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"Error running mandown: {e.stderr}", file=sys.stderr)
        sys.exit(1)

    # Collapse redundant \fB\fB and \fP\fP runs
    content = re.sub(r'\\fB\\fB', r'\\fB', content)
    content = re.sub(r'\\fP\\fP', r'\\fP', content)

    # Update .TH header line
    th_replacement = f'.TH "RETCH" "1" "{date_str}" "retch {version}" "System Information Fetcher"'
    content = re.sub(r'\.TH "RETCH" 1', th_replacement, content)

    dst_man.write_text(content, encoding="utf-8", newline="\n")
    print(f"Generated {dst_man} (v{version}, {date_str})")

if __name__ == "__main__":
    main()
