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
never reached it: it fetched `fastfetch-macos-universal.zip`, which fastfetch had stopped
publishing, and gave the Windows arm64 runner the amd64 build.

fastfetch then flipped back. 2.69.0 shipped `fastfetch-macos-aarch64`/`-amd64`; 2.70.0
(2026-10-14) shipped only `fastfetch-macos-universal`, and the macOS benchmark job on main
failed with a 404. So macOS now tries the per-architecture archive and falls back to the
universal one (see asset_candidates), which survives a flip in either direction.
"""

import os
import platform
import shutil
import subprocess
import sys
import tarfile
import urllib.error
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



# Both macOS layouts keep the binary at `<archive dir>/usr/bin/fastfetch`, so find_binary_dir
# needs no change whichever one the release has.
MACOS_UNIVERSAL = "fastfetch-macos-universal.tar.gz"


def asset_candidates(system=None, machine=None):
    """The release assets to try for this platform, best first.

    Pure, like asset_name. macOS gets the universal archive as a fallback because fastfetch
    has switched between the two layouts more than once (see the module docstring).
    """
    candidates = [asset_name(system, machine)]
    if (system or platform.system()) == "Darwin":
        candidates.append(MACOS_UNIVERSAL)
    return candidates


def download_first(candidates, fetch):
    """Download the first candidate the release has; return (asset, local path).

    `fetch(asset)` downloads one asset and returns its path; it is a parameter so the
    self-test can drive this without the network. ONLY a 404 moves on to the next name: a
    network error or a 5xx is a real failure, and trying another name would turn it into a
    misleading "the release has none of these".
    """
    missing = []
    for asset in candidates:
        try:
            return asset, fetch(asset)
        except urllib.error.HTTPError as e:
            if e.code != 404:
                raise
            print(f"{asset} is not in this release (404)", flush=True)
            missing.append(asset)
    raise SystemExit("install_fastfetch: the latest release has none of " + ", ".join(missing))

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
    if os.path.isdir(INSTALL_ROOT):
        shutil.rmtree(INSTALL_ROOT)
    os.makedirs(INSTALL_ROOT)

    def fetch(asset):
        url = RELEASE_URL.format(asset=asset)
        archive = os.path.join(INSTALL_ROOT, asset)
        print(f"Downloading {url}", flush=True)
        urllib.request.urlretrieve(url, archive)
        return archive

    asset, archive = download_first(asset_candidates(), fetch)
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

    # macOS falls back to the universal archive; nothing else has a fallback to try.
    for machine in ("arm64", "x86_64"):
        got = asset_candidates("Darwin", machine)
        if got[1:] != [MACOS_UNIVERSAL]:
            failures.append(f"asset_candidates(Darwin, {machine}) = {got}, want universal last")
    for system, machine in (("Linux", "x86_64"), ("Windows", "ARM64")):
        if len(asset_candidates(system, machine)) != 1:
            failures.append(f"asset_candidates({system}, {machine}) has a fallback")

    # download_first, against a fake release. The 2.70.0 case: the first name 404s.
    # Its 404 notices are the fakes', so they are kept out of the self-test's output.
    import contextlib
    import io
    with contextlib.redirect_stdout(io.StringIO()):
        def fake_release(have, other_error=None):
            calls = []
            def fetch(asset):
                calls.append(asset)
                if other_error:
                    raise urllib.error.HTTPError(asset, other_error, "boom", None, None)
                if asset not in have:
                    raise urllib.error.HTTPError(asset, 404, "Not Found", None, None)
                return "/x/" + asset
            return fetch, calls
        darwin = asset_candidates("Darwin", "arm64")
        fetch, calls = fake_release({MACOS_UNIVERSAL})
        try:
            got = download_first(darwin, fetch)
        except SystemExit as e:
            got = e
        if got != (MACOS_UNIVERSAL, "/x/" + MACOS_UNIVERSAL):
            failures.append(f"download_first did not fall back to the universal archive: {got}")
        fetch, calls = fake_release(set(darwin))
        download_first(darwin, fetch)
        if calls != darwin[:1]:
            failures.append(f"download_first fetched {calls} when the first name existed")
        fetch, _ = fake_release(set(), other_error=503)
        try:
            download_first(darwin, fetch)
            failures.append("download_first swallowed a 503")
        except urllib.error.HTTPError:
            pass
        except SystemExit:
            failures.append("download_first turned a 503 into 'release has none of these'")
        fetch, _ = fake_release(set())
        try:
            download_first(darwin, fetch)
            failures.append("download_first returned with every name missing")
        except SystemExit:
            pass

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
