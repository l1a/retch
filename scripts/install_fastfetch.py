#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""Install fastfetch for the CLI benchmarks.

Two modes:

  install_fastfetch.py                   use fastfetch if it is on PATH, else a package
                                         manager, else the latest GitHub release. For a
                                         developer machine.
  install_fastfetch.py --latest-release  always install fastfetch's latest GitHub release,
                                         ahead of anything else on PATH. What CI uses.

WHY CI USES THE RELEASE. Until v0.19.0 each CI platform took fastfetch from its own package
manager: dnf in the Fedora container, brew on macOS, winget on Windows. Those lag upstream by
different amounts -- on 2026-09-26 Fedora had 2.68.1 while upstream had released 2.69.0 the
day before -- so the five platforms could be comparing retch against different fastfetch
versions. The release assets exist for every runner, so every platform now runs the same,
newest fastfetch, and the benchmark step prints `fastfetch --version` so the log says which.

The previous fallback downloader was also broken on two platforms and nobody knew, because CI
never reached it: it fetched `fastfetch-macos-universal.zip`, which fastfetch no longer
publishes, and gave the Windows arm64 runner the amd64 build.
"""

import os
import platform
import shutil
import subprocess
import sys
import tarfile
import urllib.request
import zipfile

RELEASE_URL = "https://github.com/fastfetch-cli/fastfetch/releases/latest/download/{asset}"
INSTALL_ROOT = os.path.expanduser(os.path.join("~", ".local", "fastfetch-release"))


def asset_name(system=None, machine=None):
    """The release asset for this platform, e.g. `fastfetch-linux-aarch64.tar.gz`.

    Pure, so the self-test can cover every runner without being on it.
    """
    system = system or platform.system()
    machine = (machine or platform.machine()).lower()
    arm = machine in ("arm64", "aarch64") or machine.startswith("armv8")
    arch = "aarch64" if arm else "amd64"
    if system == "Linux":
        return f"fastfetch-linux-{arch}.tar.gz"
    if system == "Darwin":
        return f"fastfetch-macos-{arch}.tar.gz"
    if system == "Windows":
        return f"fastfetch-windows-{arch}.zip"
    raise SystemExit(f"install_fastfetch: no fastfetch release asset for {system}")


def binary_name(system=None):
    return "fastfetch.exe" if (system or platform.system()) == "Windows" else "fastfetch"


def find_binary_dir(root, system=None):
    """The directory holding the fastfetch binary inside an extracted release.

    Linux/macOS archives nest it at `fastfetch-<os>-<arch>/usr/bin/`; the Windows zip keeps
    it at the top level next to the DLLs it needs, which is why the DIRECTORY goes on PATH
    rather than the executable being copied somewhere on its own.

    The name alone is NOT enough: the Unix archives also carry the bash completion as
    `usr/share/bash-completion/completions/fastfetch`, and an os.walk that stops at the first
    file called `fastfetch` can land there. That file then "runs" as a shell script and exits
    0 with no output -- found by the first real install of this function. So off Windows the
    binary must sit in a directory named `bin`.
    """
    system = system or platform.system()
    want = binary_name(system)
    for dirpath, _dirs, files in sorted(os.walk(root)):
        if want in files and (system == "Windows" or os.path.basename(dirpath) == "bin"):
            return dirpath
    return None


def install_latest_release():
    asset = asset_name()
    url = RELEASE_URL.format(asset=asset)
    if os.path.isdir(INSTALL_ROOT):
        shutil.rmtree(INSTALL_ROOT)
    os.makedirs(INSTALL_ROOT)
    archive = os.path.join(INSTALL_ROOT, asset)
    print(f"Downloading {url}", flush=True)
    urllib.request.urlretrieve(url, archive)
    if asset.endswith(".zip"):
        with zipfile.ZipFile(archive) as z:
            z.extractall(INSTALL_ROOT)
    else:
        with tarfile.open(archive) as t:
            # The "data" filter (Python 3.12+) refuses absolute paths and escaping links;
            # older Pythons have no filter argument at all.
            if hasattr(tarfile, "data_filter"):
                t.extractall(INSTALL_ROOT, filter="data")
            else:
                t.extractall(INSTALL_ROOT)
    os.remove(archive)

    bin_dir = find_binary_dir(INSTALL_ROOT)
    if not bin_dir:
        raise SystemExit(f"install_fastfetch: {binary_name()} not found in {asset}")
    exe = os.path.join(bin_dir, binary_name())
    if platform.system() != "Windows":
        os.chmod(exe, 0o755)

    # Prove it runs before claiming success: a binary that cannot start would otherwise
    # surface only as a hyperfine failure several steps later.
    # A zero exit is not enough either (see find_binary_dir): the output must name fastfetch.
    version = subprocess.run([exe, "--version"], check=True, capture_output=True,
                             text=True).stdout.strip()
    if not version.startswith("fastfetch "):
        raise SystemExit(f"install_fastfetch: {exe} --version printed {version!r}, "
                         "which is not fastfetch")
    print(f"Installed {version} at {exe}")

    # GITHUB_PATH entries are PREPENDED to PATH for later steps, so this copy wins over any
    # fastfetch the runner image or a package manager already put on PATH.
    gh_path = os.environ.get("GITHUB_PATH")
    if gh_path:
        with open(gh_path, "a", encoding="utf-8") as f:
            f.write(bin_dir + "\n")
        print(f"Added {bin_dir} to GITHUB_PATH")
    else:
        print(f"Add {bin_dir} to PATH to use it.")


def install_from_package_manager():
    system = platform.system()
    candidates = {
        "Darwin": [["brew", "install", "fastfetch"]],
        "Windows": [
            ["winget", "install", "--id", "fastfetch-cli.fastfetch", "--silent",
             "--accept-source-agreements"],
            ["scoop", "install", "fastfetch"],
            ["choco", "install", "fastfetch", "-y"],
        ],
        "Linux": [["dnf", "install", "-y", "fastfetch"],
                  ["sudo", "apt-get", "install", "-y", "fastfetch"]],
    }.get(system, [])
    for cmd in candidates:
        if shutil.which(cmd[0] if cmd[0] != "sudo" else cmd[1]):
            print(f"Installing fastfetch with {cmd[0] if cmd[0] != 'sudo' else cmd[1]}...")
            if subprocess.run(cmd).returncode == 0:
                return True
    return False


def _self_test():
    failures = []
    cases = [
        (("Linux", "x86_64"), "fastfetch-linux-amd64.tar.gz"),
        (("Linux", "aarch64"), "fastfetch-linux-aarch64.tar.gz"),
        (("Darwin", "arm64"), "fastfetch-macos-aarch64.tar.gz"),
        (("Darwin", "x86_64"), "fastfetch-macos-amd64.tar.gz"),
        (("Windows", "AMD64"), "fastfetch-windows-amd64.zip"),
        # The case the old downloader got wrong: Windows reports ARM64 on the arm runner.
        (("Windows", "ARM64"), "fastfetch-windows-aarch64.zip"),
    ]
    for (system, machine), want in cases:
        got = asset_name(system, machine)
        if got != want:
            failures.append(f"asset_name({system}, {machine}) = {got}, want {want}")
    if binary_name("Windows") != "fastfetch.exe" or binary_name("Linux") != "fastfetch":
        failures.append("binary_name")

    # The archive layouts, including the decoy that bit the first real install: a non-binary
    # file named exactly like the binary. The real one (usr/share/bash-completion/...) sorts
    # AFTER usr/bin, so it only won on a filesystem that happened to list `share` first; the
    # decoy here sorts BEFORE `bin`, so this fails on any filesystem if the `bin` rule goes.
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        for rel in ("x/usr/aaa-completions/fastfetch", "x/usr/bin/fastfetch"):
            os.makedirs(os.path.join(tmp, os.path.dirname(rel)), exist_ok=True)
            open(os.path.join(tmp, rel), "w").close()
        got = find_binary_dir(tmp, "Linux")
        if got != os.path.join(tmp, "x", "usr", "bin"):
            failures.append(f"find_binary_dir picked {got!r} over usr/bin")
    with tempfile.TemporaryDirectory() as tmp:
        open(os.path.join(tmp, "fastfetch.exe"), "w").close()
        if find_binary_dir(tmp, "Windows") != tmp:
            failures.append("find_binary_dir missed the top-level Windows exe")
    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        return 1
    print("install_fastfetch.py self-test passed")
    return 0


def main(argv):
    if argv == ["--self-test"]:
        return _self_test()
    if argv == ["--latest-release"]:
        install_latest_release()
        return 0
    if argv:
        print(__doc__, file=sys.stderr)
        return 2
    if shutil.which("fastfetch"):
        print("fastfetch is already installed.")
        return 0
    if install_from_package_manager() and shutil.which("fastfetch"):
        return 0
    print("No package manager install; using the latest GitHub release.")
    install_latest_release()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
