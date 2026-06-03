#!/usr/bin/env python3
import os
import sys
import shutil
import urllib.request
import zipfile
import tarfile
import subprocess
import platform

def run_cmd(cmd):
    try:
        subprocess.run(cmd, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def download_and_extract(url, extract_to):
    try:
        print(f"Downloading pre-built fastfetch from {url}...")
        archive_name = "fastfetch_archive"
        urllib.request.urlretrieve(url, archive_name)

        os.makedirs(extract_to, exist_ok=True)
        if url.endswith(".zip"):
            with zipfile.ZipFile(archive_name, 'r') as zip_ref:
                zip_ref.extractall(extract_to)
        else:
            with tarfile.open(archive_name, 'r:gz') as tar_ref:
                tar_ref.extractall(extract_to)

        os.remove(archive_name)
        return True
    except Exception as e:
        print(f"Failed to download/extract: {e}", file=sys.stderr)
        return False

def main():
    if shutil.which("fastfetch"):
        print("fastfetch is already installed.")
        return

    os_type = platform.system()
    print(f"fastfetch not found on PATH. Attempting to install on {os_type}...")

    installed = False

    if os_type == "Darwin":
        if shutil.which("brew"):
            print("Found brew. Installing fastfetch...")
            installed = run_cmd(["brew", "install", "fastfetch"])

    elif os_type == "Windows":
        # Preference: winget, scoop, choco
        if shutil.which("winget"):
            print("Found winget. Installing fastfetch...")
            installed = run_cmd(["winget", "install", "--id", "fastfetch-cli.fastfetch", "--silent", "--accept-source-agreements"])
        elif shutil.which("scoop"):
            print("Found scoop. Installing fastfetch...")
            installed = run_cmd(["scoop", "install", "fastfetch"])
        elif shutil.which("choco"):
            print("Found choco. Installing fastfetch...")
            installed = run_cmd(["choco", "install", "fastfetch", "-y"])

    elif os_type == "Linux":
        if shutil.which("apt-get"):
            # Try to install from apt first, or download deb
            print("Found apt-get. Attempting to install fastfetch...")
            installed = run_cmd(["sudo", "apt-get", "update"]) and run_cmd(["sudo", "apt-get", "install", "-y", "fastfetch"])

    if not installed:
        print("No package manager available or installation failed. Downloading pre-built binary from GitHub...")
        # Resolve latest release download URLs
        arch = platform.machine().lower()
        is_arm = "arm" in arch or "aarch64" in arch
        
        if os_type == "Windows":
            # Fastfetch releases zip for windows
            url = "https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-windows-amd64.zip"
            # Extract to a local bin directory and add to Path or copy
            local_bin = os.path.expanduser("~/bin")
            if download_and_extract(url, local_bin):
                # Windows fastfetch zip has fastfetch.exe in the extracted folder.
                # Find it and put it in Path or copy to root of local_bin
                for root, dirs, files in os.walk(local_bin):
                    if "fastfetch.exe" in files:
                        shutil.copy2(os.path.join(root, "fastfetch.exe"), os.path.join(local_bin, "fastfetch.exe"))
                        break
                print(f"Downloaded fastfetch. Please ensure {local_bin} is in your PATH.")
                installed = True
        elif os_type == "Darwin":
            url = "https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-macos-universal.zip"
            local_bin = os.path.expanduser("~/bin")
            if download_and_extract(url, local_bin):
                for root, dirs, files in os.walk(local_bin):
                    if "fastfetch" in files:
                        shutil.copy2(os.path.join(root, "fastfetch"), os.path.join(local_bin, "fastfetch"))
                        break
                installed = True
        elif os_type == "Linux":
            pkg_arch = "aarch64" if is_arm else "amd64"
            url = f"https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-{pkg_arch}.tar.gz"
            local_bin = os.path.expanduser("~/bin")
            if download_and_extract(url, local_bin):
                for root, dirs, files in os.walk(local_bin):
                    if "fastfetch" in files and not os.path.isdir(os.path.join(root, "fastfetch")):
                        shutil.copy2(os.path.join(root, "fastfetch"), os.path.join(local_bin, "fastfetch"))
                        break
                installed = True

    if installed:
        print("fastfetch successfully installed.")
        # If manually downloaded, add local_bin to GITHUB_PATH in CI
        if "GITHUB_PATH" in os.environ and not shutil.which("fastfetch"):
            local_bin = os.path.abspath(os.path.expanduser("~/bin"))
            print(f"Adding {local_bin} to GITHUB_PATH...")
            with open(os.environ["GITHUB_PATH"], "a") as f:
                f.write(f"{local_bin}\n")
    else:
        print("Error: Failed to install fastfetch.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
