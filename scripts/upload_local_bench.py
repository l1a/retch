#!/usr/bin/env python3
# Upload local hyperfine benchmark results to the gh-pages benchmark dashboard.
#
# Usage: python3 scripts/upload_local_bench.py [--runs N] [--warmup N]
#
# Requires: cargo (release build), hyperfine, git, gh (for auth)
# fastfetch is optional — skipped if not on PATH.

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
import time


REPO = "l1a/retch"
GH_PAGES_BRANCH = "gh-pages"
DATA_PATH = "dev/bench/data.js"
SUITE_NAME_TEMPLATE = "Local - {platform} (real hardware)"
MAX_RETRIES = 3


def run(cmd, **kwargs):
    return subprocess.run(cmd, check=True, **kwargs)


def run_capture(cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout.strip()


def suite_name():
    system = platform.system()
    machine = platform.machine().lower()
    if "arm" in machine or "aarch64" in machine:
        arch = "arm64"
    elif "x86_64" in machine or "amd64" in machine:
        arch = "x64"
    else:
        arch = machine
    names = {"Darwin": "macOS", "Windows": "Windows", "Linux": "Linux"}
    return SUITE_NAME_TEMPLATE.format(platform=f"{names.get(system, system)} {arch}")


def git_commit_info():
    sha = run_capture(["git", "rev-parse", "HEAD"])
    tree = run_capture(["git", "rev-parse", "HEAD^{tree}"])
    message = run_capture(["git", "log", "-1", "--format=%B"]).strip()
    timestamp = run_capture(["git", "log", "-1", "--format=%cI"])
    author_name = run_capture(["git", "log", "-1", "--format=%an"])
    author_email = run_capture(["git", "log", "-1", "--format=%ae"])
    remote_url = run_capture(["git", "remote", "get-url", "origin"])
    # Normalise to https URL
    if remote_url.startswith("git@github.com:"):
        remote_url = "https://github.com/" + remote_url[len("git@github.com:"):]
    if remote_url.endswith(".git"):
        remote_url = remote_url[:-4]
    commit_url = f"{remote_url}/commit/{sha}"
    # gh username lookup (best-effort)
    try:
        username = run_capture(["gh", "api", "user", "--jq", ".login"])
    except Exception:
        username = author_name
    return {
        "author": {"email": author_email, "name": author_name, "username": username},
        "committer": {"email": author_email, "name": author_name, "username": username},
        "distinct": True,
        "id": sha,
        "message": message,
        "timestamp": timestamp,
        "tree_id": tree,
        "url": commit_url,
    }


def build_release():
    print("Building release binary...", flush=True)
    run(["cargo", "build", "--release"])


def run_hyperfine(warmup, runs):
    has_fastfetch = shutil.which("fastfetch") is not None
    if not has_fastfetch:
        print("fastfetch not found on PATH — skipping comparison, benchmarking retch only.")

    system = platform.system()
    if system == "Windows":
        retch_cmd = r".\target\release\retch.exe"
    else:
        retch_cmd = "./target/release/retch"

    cmds = [retch_cmd]
    if has_fastfetch:
        cmds.append("fastfetch")

    with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w") as f:
        tmp_path = f.name

    try:
        run([
            "hyperfine",
            "--warmup", str(warmup),
            "--runs", str(runs),
            "--export-json", tmp_path,
        ] + cmds)

        with open(tmp_path) as f:
            data = json.load(f)
    finally:
        os.unlink(tmp_path)

    results = []
    for res in data.get("results", []):
        cmd = res["command"]
        if "retch" in cmd:
            label = "CLI execution - retch"
        elif "fastfetch" in cmd:
            label = "CLI execution - fastfetch"
        else:
            label = f"CLI execution - {cmd}"
        val_ns = res["mean"] * 1_000_000_000
        results.append({"name": label, "unit": "ns", "value": val_ns})

    return results


def load_data_js(content):
    m = re.search(r'window\.BENCHMARK_DATA\s*=\s*(\{.*\})', content, re.DOTALL)
    if not m:
        raise ValueError("Could not find window.BENCHMARK_DATA in data.js")
    return json.loads(m.group(1))


def dump_data_js(data):
    return "window.BENCHMARK_DATA = " + json.dumps(data, separators=(",", ":")) + "\n"


def append_entry(gh_pages_dir, suite, commit_info, benches):
    data_file = os.path.join(gh_pages_dir, DATA_PATH)
    with open(data_file) as f:
        content = f.read()

    data = load_data_js(content)
    data.setdefault("entries", {}).setdefault(suite, [])

    # Avoid duplicate entries for the same commit+suite
    existing_ids = {e["commit"]["id"] for e in data["entries"][suite]}
    if commit_info["id"] in existing_ids:
        print(f"Entry for {commit_info['id'][:8]} already exists in '{suite}' — skipping duplicate.")
        return False

    entry = {
        "commit": commit_info,
        "date": int(time.time() * 1000),
        "tool": "customSmallerIsBetter",
        "benches": benches,
    }
    data["entries"][suite].append(entry)

    # Keep at most 100 entries per suite (same as CI max-items-in-chart: 50 + headroom)
    data["entries"][suite] = data["entries"][suite][-100:]

    # Reorder so Local suites render first on the dashboard (Object.keys insertion order)
    local = {k: v for k, v in data["entries"].items() if k.startswith("Local")}
    ci = {k: v for k, v in data["entries"].items() if not k.startswith("Local")}
    data["entries"] = {**local, **ci}

    data["lastUpdate"] = int(time.time() * 1000)

    with open(data_file, "w") as f:
        f.write(dump_data_js(data))

    return True


def push_to_gh_pages(benches, commit_info, suite):
    origin = run_capture(["git", "remote", "get-url", "origin"])

    for attempt in range(1, MAX_RETRIES + 1):
        with tempfile.TemporaryDirectory() as tmpdir:
            clone_dir = os.path.join(tmpdir, "gh-pages")
            print(f"Cloning gh-pages (attempt {attempt}/{MAX_RETRIES})...", flush=True)
            run(["git", "clone", "--branch", GH_PAGES_BRANCH, "--single-branch",
                 "--depth", "1", origin, clone_dir])

            changed = append_entry(clone_dir, suite, commit_info, benches)
            if not changed:
                return  # duplicate, nothing to push

            run(["git", "-C", clone_dir, "add", DATA_PATH])
            run(["git", "-C", clone_dir, "commit", "-m",
                 f"bench: add local results for {commit_info['id'][:8]} [{suite}]"])

            try:
                run(["git", "-C", clone_dir, "push", origin,
                     f"HEAD:{GH_PAGES_BRANCH}"])
                print(f"Pushed benchmark results to gh-pages ({suite}).")
                return
            except subprocess.CalledProcessError:
                if attempt < MAX_RETRIES:
                    print("Push failed (likely a concurrent CI push) — retrying...", flush=True)
                    time.sleep(2 ** attempt)
                else:
                    print("ERROR: Could not push after retries. Run `just bench-upload` manually later.",
                          file=sys.stderr)
                    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Upload local benchmarks to gh-pages dashboard.")
    parser.add_argument("--runs", type=int, default=10, help="hyperfine --runs (default 10)")
    parser.add_argument("--warmup", type=int, default=3, help="hyperfine --warmup (default 3)")
    parser.add_argument("--no-build", action="store_true", help="Skip cargo build --release")
    args = parser.parse_args()

    if not shutil.which("hyperfine"):
        print("ERROR: hyperfine not found. Install it with: cargo install hyperfine", file=sys.stderr)
        sys.exit(1)

    if not args.no_build:
        build_release()

    print("Running benchmarks...", flush=True)
    benches = run_hyperfine(args.warmup, args.runs)

    print("\nResults:")
    for b in benches:
        print(f"  {b['name']}: {b['value']/1e6:.1f} ms")

    commit_info = git_commit_info()
    suite = suite_name()
    print(f"\nUploading to suite: '{suite}'")
    push_to_gh_pages(benches, commit_info, suite)


if __name__ == "__main__":
    main()
