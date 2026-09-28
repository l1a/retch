#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Ken Tobias
"""Generate the fastfetch configs the CLI benchmarks compare retch against, one per mode.

WHY THIS EXISTS. Until v0.19.0 the benchmark pairs were `retch` vs plain `fastfetch`,
`retch --short` vs `fastfetch -c none` and `retch --long` vs `fastfetch -c all`. Two of
those three measured something other than what their labels said:

  - Plain `fastfetch` loads the USER's config. On a CI runner there is none, so it ran the
    built-in 20-module default -- the same thing `-c none` runs, which is why those two
    series always timed identically. On a developer machine it ran whatever that person had
    configured: on arrakis ~75 modules including network calls, 529 ms, and "retch is faster"
    was a statement about that config rather than about either tool.
  - Nothing compared `--full` at all.

So each mode now gets a config that asks fastfetch for the SAME information retch shows in
that mode, derived from `src/fields.rs` -- the single source of truth for which mode shows
which field -- and one mapping table below. `just check` fails if a field has no mapping or a
generated config is stale, so moving a field between modes cannot quietly skew the comparison
again.

Usage:
  fastfetch_configs.py            check the committed configs (what `just check` runs)
  fastfetch_configs.py --write    regenerate them
  fastfetch_configs.py --self-test
"""

import json
import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIELDS_RS = os.path.join(REPO_ROOT, "src", "fields.rs")
CONFIG_DIR = os.path.join(REPO_ROOT, "benches", "fastfetch")

# Benchmark mode name -> `Mode` variant in src/fields.rs. Ordered least to most verbose; each
# mode is a strict superset of the one before it.
MODES = (("short", "Short"), ("default", "Standard"), ("long", "Long"), ("full", "Full"))
MODE_RANK = {variant: i for i, (_, variant) in enumerate(MODES)}

# retch field key -> the fastfetch module(s) that report the same thing, or a string saying
# why there is no equivalent. Order here is the order modules appear in the config.
#
# Choices worth knowing about:
#   - retch `host` is the HOSTNAME; fastfetch's `Host` module is the product name, which is
#     what retch calls `motherboard`/`chassis`. fastfetch's hostname lives in `Title`.
#   - `temp` is not a module in fastfetch: it is a `temp` option on the modules that own a
#     sensor. See TEMP_MODULES.
#   - `bluetooth` in retch reports the radio state AND connected devices; fastfetch splits
#     those into two modules.
MAPPING = {
    "host": ["title"],
    "os": ["os"],
    "kernel": ["kernel"],
    "domain": "no fastfetch module reports the DNS domain",
    "domain-search": "no fastfetch module reports DNS search domains",
    "chassis": ["chassis"],
    "init": ["initsystem"],
    "locale": ["locale"],
    "arch": "fastfetch folds the architecture into its OS line",
    "uptime": ["uptime"],
    "users": ["users"],
    "packages": ["packages"],
    "cpu": ["cpu"],
    "cpu-freq": "fastfetch folds the frequency into its CPU line",
    "cpu-cache": ["cpucache"],
    "cpu-usage": ["cpuusage"],
    "motherboard": ["board"],
    "bios": ["bios"],
    "bootmgr": ["bootmgr"],
    "tpm": ["tpm"],
    "gpu": ["gpu"],
    "display": ["display"],
    "vulkan": ["vulkan"],
    "opengl": ["opengl"],
    "opencl": ["opencl"],
    "brightness": ["brightness"],
    "audio": ["sound"],
    "camera": ["camera"],
    "gamepad": ["gamepad"],
    "keyboard": ["keyboard"],
    "mouse": ["mouse"],
    "wifi": ["wifi"],
    "bluetooth": ["bluetooth", "bluetoothradio"],
    "battery": ["battery"],
    "power-adapter": ["poweradapter"],
    "memory": ["memory"],
    "phys-mem": ["physicalmemory"],
    "swap": ["swap"],
    "procs": ["processes"],
    "load": ["loadavg"],
    "disk": ["disk"],
    "phys-disk": ["physicaldisk"],
    "disk-io": ["diskio"],
    "btrfs": ["btrfs"],
    "zpool": ["zpool"],
    "temp": "an option on the sensor-owning modules, not a module (see TEMP_MODULES)",
    "net": ["localip"],
    "net-io": ["netio"],
    "public-ip": ["publicip"],
    "dns": ["dns"],
    "shell": ["shell"],
    "editor": ["editor"],
    "terminal": ["terminal"],
    "terminal-font": ["terminalfont"],
    "terminal-size": ["terminalsize"],
    "desktop": ["de"],
    "wm": ["wm"],
    "login-manager": ["lm"],
    "player": ["player"],
    "media": ["media"],
    "wm-theme": ["wmtheme"],
    "wallpaper": ["wallpaper"],
    "terminal-theme": ["terminaltheme"],
    "theme": ["theme"],
    "icons": ["icons"],
    "cursor": ["cursor"],
    "font": ["font"],
    "weather": ["weather"],
}

# When retch shows `temp`, these fastfetch modules are asked for their sensor reading too.
TEMP_MODULES = ("cpu", "gpu", "physicaldisk", "battery")

# Per-module options that make fastfetch do the same work retch does. Both network modules
# default to NO timeout in fastfetch (0 = wait indefinitely); retch gives up after 2 s
# (public IP, `crates/sysinfo/src/network.rs`) and 4 s per request (weather,
# `crates/sysinfo/src/weather.rs`). Left unmatched, one slow server would decide the result.
#
# Deliberately NOT matched: the sampling waits. fastfetch's CPU usage waits 200 ms (as retch
# does) and its disk/network I/O rates sample for 250 ms, while retch measures I/O across its
# own collection window instead of sleeping. That is a real design difference between the two
# tools, and it is part of what is being measured.
MODULE_OPTIONS = {
    "publicip": {"timeout": 2000},
    "weather": {"timeout": 4000},
}

HEADER = """\
// GENERATED by scripts/fastfetch_configs.py from src/fields.rs -- do not edit by hand.
// Regenerate with: just fastfetch-configs
//
// What fastfetch is asked for when benchmarked against `retch{flag}`: the same information,
// field for field. Fields with no fastfetch equivalent are listed here rather than faked:
{unmatched}
"""


def parse_fields(path=FIELDS_RS):
    """Return [(key, Mode variant)] from the FIELDS table in src/fields.rs, in table order."""
    with open(path, encoding="utf-8") as f:
        text = f.read()
    pairs = re.findall(r'key:\s*"([^"]+)",\s*min_mode:\s*Mode::(\w+)', text)
    if not pairs:
        raise ValueError(f"no FieldDef entries found in {path}")
    return pairs


def fields_for(fields, mode_variant):
    """Field keys visible in a mode: the same rule as `fields_for` in src/fields.rs."""
    rank = MODE_RANK[mode_variant]
    return [key for key, variant in fields if MODE_RANK[variant] <= rank]


def problems_with_mapping(fields):
    """Every way the mapping can disagree with src/fields.rs, as human-readable strings."""
    out = []
    keys = [k for k, _ in fields]
    for key, variant in fields:
        if variant not in MODE_RANK:
            out.append(f"{key}: unknown mode {variant!r} in src/fields.rs")
    for key in keys:
        if key not in MAPPING:
            out.append(f"{key}: in src/fields.rs but has no entry in MAPPING -- say which "
                       f"fastfetch module matches it, or why none does")
    for key in MAPPING:
        if key not in keys:
            out.append(f"{key}: in MAPPING but no longer a field in src/fields.rs")
    return out


def build_config(fields, mode, variant):
    """The config dict for one mode, plus the list of retch fields fastfetch cannot match."""
    visible = set(fields_for(fields, variant))
    want_temp = "temp" in visible
    modules, unmatched = [], []
    for key, spec in MAPPING.items():
        if key not in visible or key == "temp":
            continue
        if isinstance(spec, str):
            unmatched.append((key, spec))
            continue
        for name in spec:
            opts = dict(MODULE_OPTIONS.get(name, {}))
            if want_temp and name in TEMP_MODULES:
                opts["temp"] = True
            modules.append({"type": name, **opts} if opts else name)
    if want_temp and not any(
        (m if isinstance(m, str) else m["type"]) in TEMP_MODULES for m in modules
    ):
        unmatched.append(("temp", "no sensor-owning module is in this mode"))
    # retch prints no logo when its output is not a terminal (as under hyperfine); fastfetch
    # still prints one, so turn it off rather than time a logo only one side draws.
    config = {"logo": {"type": "none"}, "modules": modules}
    return config, unmatched


def render(fields, mode, variant):
    """The exact file content for one mode."""
    config, unmatched = build_config(fields, mode, variant)
    flag = "" if mode == "default" else f" --{mode}"
    lines = [f"//   {k}: {why}" for k, why in unmatched] or ["//   (none)"]
    return HEADER.format(flag=flag, unmatched="\n".join(lines)) + json.dumps(config, indent=2) + "\n"


def config_path(mode, config_dir=CONFIG_DIR):
    return os.path.join(config_dir, f"{mode}.jsonc")


def check(fields, config_dir=CONFIG_DIR):
    """Return a list of problems; empty means the committed configs are current."""
    out = problems_with_mapping(fields)
    if out:
        return out
    for mode, variant in MODES:
        path = config_path(mode, config_dir)
        want = render(fields, mode, variant)
        try:
            with open(path, encoding="utf-8", newline="") as f:
                have = f.read()
        except FileNotFoundError:
            out.append(f"{os.path.relpath(path, REPO_ROOT)} is missing")
            continue
        if have != want:
            out.append(f"{os.path.relpath(path, REPO_ROOT)} is stale")
    return out


def write(fields, config_dir=CONFIG_DIR):
    problems = problems_with_mapping(fields)
    if problems:
        return problems
    os.makedirs(config_dir, exist_ok=True)
    for mode, variant in MODES:
        with open(config_path(mode, config_dir), "w", encoding="utf-8", newline="\n") as f:
            f.write(render(fields, mode, variant))
    return []


def _self_test():
    import tempfile

    failures = []

    def expect(name, cond, detail=""):
        if not cond:
            failures.append(f"{name}: {detail}")

    fields = parse_fields()
    expect("fields.rs parses to a plausible table", len(fields) > 50, f"{len(fields)} fields")

    # The live repo must be clean, or every mutation below proves nothing.
    expect("committed configs are current", check(fields) == [], str(check(fields)))

    # Short is exactly the eight hardware fields, so its module list is pinned outright.
    cfg, unmatched = build_config(fields, "short", "Short")
    expect("short modules", cfg["modules"] == [
        "title", "os", "kernel", "cpu", "gpu", "memory", "disk", "localip"],
        str(cfg["modules"]))
    expect("short has nothing unmatched", unmatched == [], str(unmatched))

    # The field this change moved: cpu-usage is long+, so fastfetch must not sample CPU
    # usage in the default config -- that 200 ms is the whole point of the move.
    default_types = {m if isinstance(m, str) else m["type"]
                     for m in build_config(fields, "default", "Standard")[0]["modules"]}
    long_cfg, _ = build_config(fields, "long", "Long")
    long_types = {m if isinstance(m, str) else m["type"] for m in long_cfg["modules"]}
    expect("default does not sample cpu usage", "cpuusage" not in default_types)
    expect("long samples cpu usage", "cpuusage" in long_types)

    # Nesting carries over: each mode's modules are a superset of the previous mode's.
    prev = set()
    for mode, variant in MODES:
        types = {m if isinstance(m, str) else m["type"]
                 for m in build_config(fields, mode, variant)[0]["modules"]}
        expect(f"{mode} is a superset", prev <= types, str(prev - types))
        prev = types

    # temp becomes an option, and only once retch shows temps.
    def opts(cfg, name):
        return next((m for m in cfg["modules"] if isinstance(m, dict) and m["type"] == name), {})
    expect("long asks cpu for its temp", opts(long_cfg, "cpu").get("temp") is True)
    expect("default does not ask for temps",
           all(isinstance(m, str) for m in build_config(fields, "default", "Standard")[0]["modules"]
               if (m if isinstance(m, str) else m["type"]) in TEMP_MODULES))
    expect("public ip timeout matches retch", opts(long_cfg, "publicip").get("timeout") == 2000)

    # Negative controls: each must make check() fail.
    unmapped = fields + [("brand-new-field", "Standard")]
    expect("an unmapped field is caught",
           any("brand-new-field" in p for p in check(unmapped)), "check passed")
    expect("a mapping for a deleted field is caught",
           any("cpu-usage" in p for p in check([f for f in fields if f[0] != "cpu-usage"])),
           "check passed")
    moved = [(k, "Standard" if k == "cpu-usage" else v) for k, v in fields]
    expect("moving a field between modes makes the configs stale",
           any("default.jsonc is stale" in p for p in check(moved)), str(check(moved)))
    with tempfile.TemporaryDirectory() as tmp:
        write(fields, tmp)
        expect("write then check is clean", check(fields, tmp) == [], str(check(fields, tmp)))
        with open(config_path("long", tmp), "a", encoding="utf-8") as f:
            f.write("// hand edit\n")
        expect("a hand edit is caught", any("long.jsonc is stale" in p for p in check(fields, tmp)))
        os.remove(config_path("full", tmp))
        expect("a missing config is caught", any("full.jsonc is missing" in p for p in check(fields, tmp)))

    if failures:
        for f in failures:
            print(f"  FAIL {f}", file=sys.stderr)
        print(f"fastfetch_configs.py self-test FAILED ({len(failures)})", file=sys.stderr)
        return 1
    print("fastfetch_configs.py self-test passed")
    return 0


def main(argv):
    if argv == ["--self-test"]:
        return _self_test()
    fields = parse_fields()
    if argv == ["--write"]:
        problems = write(fields)
        verb = "wrote"
    elif argv == []:
        problems = check(fields)
        verb = "checked"
    else:
        print(__doc__, file=sys.stderr)
        return 2
    if problems:
        for p in problems:
            print(f"fastfetch-configs: {p}", file=sys.stderr)
        if verb == "checked":
            print("fastfetch-configs: run `just fastfetch-configs` to regenerate", file=sys.stderr)
        return 1
    print(f"fastfetch-configs: {verb} {len(MODES)} configs in benches/fastfetch/")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
