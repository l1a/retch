#!/usr/bin/env python3
"""Cross-platform installer for retch manual page."""

import os
import shutil
from pathlib import Path

def main():
    repo_root = Path(__file__).resolve().parent.parent
    src_man = repo_root / "docs" / "retch.1"

    if not src_man.exists():
        print(f"Error: man page not found at {src_man}. Run 'just man' first.", file=os.sys.stderr)
        os.sys.exit(1)

    home = Path.home()
    xdg_data = Path(os.environ.get("XDG_DATA_HOME", home / ".local" / "share"))
    target_dir = xdg_data / "man" / "man1"
    target_dir.mkdir(parents=True, exist_ok=True)
    dst_man = target_dir / "retch.1"

    shutil.copy2(src_man, dst_man)
    print(f"Man page installed to {dst_man}")

if __name__ == "__main__":
    main()
