#!/usr/bin/env python3
import sys
import shutil
import subprocess
import platform

def run_cmd(cmd):
    try:
        subprocess.run(cmd, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def main():
    if shutil.which("hyperfine"):
        print("hyperfine is already installed.")
        return

    os_type = platform.system()
    print(f"hyperfine not found on PATH. Attempting to install on {os_type}...")

    installed = False

    if os_type == "Darwin":
        if shutil.which("brew"):
            print("Found brew. Installing hyperfine...")
            installed = run_cmd(["brew", "install", "hyperfine"])

    elif os_type == "Windows":
        if shutil.which("winget"):
            print("Found winget. Installing hyperfine...")
            installed = run_cmd(["winget", "install", "--id", "sharkdp.hyperfine", "--silent"])
        elif shutil.which("choco"):
            print("Found choco. Installing hyperfine...")
            installed = run_cmd(["choco", "install", "hyperfine", "-y"])
        elif shutil.which("scoop"):
            print("Found scoop. Installing hyperfine...")
            installed = run_cmd(["scoop", "install", "hyperfine"])

    elif os_type == "Linux":
        if shutil.which("dnf"):
            print("Found dnf. Installing hyperfine...")
            installed = run_cmd(["dnf", "install", "-y", "hyperfine"])
        elif shutil.which("apt-get"):
            print("Found apt-get. Installing hyperfine...")
            installed = run_cmd(["sudo", "apt-get", "update"]) and run_cmd(["sudo", "apt-get", "install", "-y", "hyperfine"])

    if not installed:
        print("No package manager available or installation failed. Compiling hyperfine locally via cargo...")
        if shutil.which("cargo"):
            installed = run_cmd(["cargo", "install", "--locked", "hyperfine"])
        else:
            print("Error: cargo is not installed. Cannot compile hyperfine locally.", file=sys.stderr)
            sys.exit(1)

    if installed:
        print("hyperfine successfully installed.")
    else:
        print("Error: Failed to install hyperfine.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
