#!/usr/bin/env python3
"""Cross-platform installer for retch shell completions."""

import os
import sys
import subprocess
from pathlib import Path

def main():
    repo_root = Path(__file__).resolve().parent.parent
    
    # Locate built retch binary
    bin_path = None
    candidates = [
        repo_root / "target" / "release" / "retch.exe",
        repo_root / "target" / "release" / "retch",
        repo_root / "target" / "debug" / "retch.exe",
        repo_root / "target" / "debug" / "retch",
    ]
    for c in candidates:
        if c.exists():
            bin_path = c
            break

    if not bin_path:
        # Fallback to cargo run
        cmd_prefix = ["cargo", "run", "-q", "--"]
    else:
        cmd_prefix = [str(bin_path)]

    # Determine completion target directories
    home = Path.home()
    xdg_data = Path(os.environ.get("XDG_DATA_HOME", home / ".local" / "share"))
    xdg_config = Path(os.environ.get("XDG_CONFIG_HOME", home / ".config"))

    targets = {
        "bash": (xdg_data / "bash-completion" / "completions", "retch"),
        "zsh": (xdg_data / "zsh" / "site-functions", "_retch"),
        "fish": (xdg_config / "fish" / "completions", "retch.fish"),
        "elvish": (xdg_config / "elvish" / "lib", "retch.elv"),
        "nushell": (xdg_config / "nushell" / "autoload", "50retch-completions.nu"),
        "power-shell": (xdg_config / "powershell", "retch.ps1"),
    }

    for shell_name, (target_dir, filename) in targets.items():
        target_dir.mkdir(parents=True, exist_ok=True)
        out_file = target_dir / filename
        cmd = cmd_prefix + ["--completions", shell_name]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            out_file.write_text(res.stdout, encoding="utf-8")
        except subprocess.CalledProcessError as e:
            print(f"Error generating completions for {shell_name}: {e.stderr}", file=sys.stderr)

    print("Installed completions for retch:")
    for shell_name, (target_dir, filename) in targets.items():
        print(f"  {shell_name:12}: {target_dir / filename}")

if __name__ == "__main__":
    main()
