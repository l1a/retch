#!/usr/bin/env python3
"""Metadata stamped on every dashboard point: the retch version, and power state for local runs.

Shared by scripts/parse_criterion.py (CI) and scripts/upload_local_bench.py (local), so both
write the same string. It goes in each benchmark's `extra` field: github-action-benchmark
builds the CI entries itself, and `extra` is the only per-point field it lets us set; it
keeps the value in data.js and shows it in the tooltip.

Why the version: the stock dashboard labels points by commit hash, which says nothing to a
reader. Every PR bumps the version, so on main a version is one merge, and the chart page
(benches/dashboard/) plots by it.

Why the power state, local runs only: on arrakis the same binary's `--short` moved by
~0.3 ms between AC and battery (thread wake-up is slower under the powersave governor), which
is the whole size of the gap to fastfetch. A point without it cannot be compared with its
neighbours. CI runners are always on AC and report nothing useful, so CI points omit it.

`python3 scripts/bench_meta.py` runs the self-test.
"""

import os
import re
import subprocess
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def repo_version(root=REPO_ROOT):
    """`vX.Y.Z` from the [package] version in Cargo.toml. Raises if it cannot be found:
    a point without a version is exactly what this module exists to prevent."""
    with open(os.path.join(root, "Cargo.toml"), encoding="utf-8") as fh:
        text = fh.read()
    package = text.split("[package]", 1)[1].split("\n[", 1)[0] if "[package]" in text else ""
    m = re.search(r'^version\s*=\s*"([^"]+)"', package, re.M)
    if not m:
        raise ValueError("no [package] version in Cargo.toml")
    return f"v{m.group(1)}"


def extra_for(version, power=None):
    """The `extra` string: `v0.20.6`, or `v0.20.6; battery` when the power state is known."""
    return f"{version}; {power}" if power else version


def parse_extra(extra):
    """Inverse of extra_for, for tests: (version, power-or-None)."""
    version, _, power = extra.partition("; ")
    return version, (power or None)


def power_state():
    """`AC`, `battery`, or None when it cannot be told (a desktop with no battery is AC)."""
    try:
        if sys.platform.startswith("linux"):
            return _linux_power("/sys/class/power_supply")
        if sys.platform == "darwin":
            out = subprocess.run(["pmset", "-g", "batt"], capture_output=True, text=True,
                                 timeout=5).stdout
            return _pmset_power(out)
        if sys.platform == "win32":
            return _windows_power()
    except (OSError, subprocess.SubprocessError, ValueError):
        return None
    return None


def _linux_power(root):
    """AC if any `Mains` supply is online, battery if there is a Mains supply but none is.

    With no `Mains` entry at all -- laptops that charge only over USB-C -- an online
    system-scope `USB` supply means AC. A machine with no battery of its own is a desktop:
    AC. None when it cannot be told, or the directory is unreadable."""
    if not os.path.isdir(root):
        return None
    mains, usb, has_battery = [], [], False
    for name in sorted(os.listdir(root)):
        base = os.path.join(root, name)
        try:
            kind = _read(os.path.join(base, "type"))
        except OSError:
            continue
        if kind == "Mains":
            try:
                mains.append(_read(os.path.join(base, "online")) == "1")
            except OSError:
                pass
        elif kind == "USB" and _read_or(os.path.join(base, "scope"), "System") == "System":
            usb.append(_read_or(os.path.join(base, "online"), "0") == "1")
        elif kind == "Battery" and _read_or(os.path.join(base, "scope"), "System") == "System":
            # Peripheral batteries (a mouse, a stylus) report scope=Device; only the
            # machine's own battery says anything about how it is powered.
            has_battery = True
    if any(mains):
        return "AC"
    if mains:
        return "battery"
    if any(usb):
        return "AC"
    if usb and has_battery:
        return "battery"
    return None if has_battery else "AC"


def _pmset_power(out):
    first = out.splitlines()[0] if out else ""
    if "'AC Power'" in first:
        return "AC"
    if "'Battery Power'" in first:
        return "battery"
    return None


def _windows_power():
    import ctypes

    class SYSTEM_POWER_STATUS(ctypes.Structure):
        _fields_ = [("ACLineStatus", ctypes.c_ubyte), ("BatteryFlag", ctypes.c_ubyte),
                    ("BatteryLifePercent", ctypes.c_ubyte), ("SystemStatusFlag", ctypes.c_ubyte),
                    ("BatteryLifeTime", ctypes.c_ulong), ("BatteryFullLifeTime", ctypes.c_ulong)]

    status = SYSTEM_POWER_STATUS()
    if not ctypes.windll.kernel32.GetSystemPowerStatus(ctypes.byref(status)):
        return None
    return {1: "AC", 0: "battery"}.get(status.ACLineStatus)


def _read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read().strip()


def _read_or(path, default):
    try:
        return _read(path)
    except OSError:
        return default


def _self_test():
    import tempfile

    failures = []

    def check(name, cond, detail=""):
        print(f"  {'ok  ' if cond else 'FAIL'} {name}{'' if cond else ': ' + detail}")
        if not cond:
            failures.append(name)

    check("extra without power", extra_for("v0.20.6") == "v0.20.6")
    check("extra with power", extra_for("v0.20.6", "battery") == "v0.20.6; battery")
    check("extra round-trips", parse_extra(extra_for("v1.2.3", "AC")) == ("v1.2.3", "AC"))
    check("extra without power round-trips", parse_extra("v1.2.3") == ("v1.2.3", None))

    with tempfile.TemporaryDirectory() as tmp:
        with open(os.path.join(tmp, "Cargo.toml"), "w", encoding="utf-8") as fh:
            # A dependency's `version =` appears before [package] ends in some layouts; only
            # the [package] table's own key may count.
            fh.write('[workspace]\nmembers = ["x"]\n\n[package]\nname = "retch-cli"\n'
                     'version = "0.20.6"\n\n[dependencies]\nclap = { version = "4" }\n')
        check("version from [package]", repo_version(tmp) == "v0.20.6", repo_version(tmp))
    check("this repo has a version", re.fullmatch(r"v\d+\.\d+\.\d+", repo_version()) is not None)

    def supplies(entries):
        root = tempfile.mkdtemp()
        for name, files in entries.items():
            os.makedirs(os.path.join(root, name))
            for f, v in files.items():
                with open(os.path.join(root, name, f), "w", encoding="utf-8") as fh:
                    fh.write(v + "\n")
        return root

    # Verbatim layout from arrakis: AC0 Mains; BAT0 with NO scope file; two HID Device
    # batteries (touchscreen pen, Logitech mouse) that must not count; and two USB-C port
    # supplies, one online -- which must not override AC0.
    laptop = {"AC0": {"type": "Mains", "online": "0"},
              "BAT0": {"type": "Battery"},
              "hid-0018:04F3:4631.0002-battery-7": {"type": "Battery", "scope": "Device",
                                                    "online": "1"},
              "hidpp_battery_0": {"type": "Battery", "scope": "Device", "online": "1"},
              "ucsi-source-psy-USBC000:001": {"type": "USB", "scope": "System", "online": "0"},
              "ucsi-source-psy-USBC000:002": {"type": "USB", "scope": "System", "online": "1"}}
    check("laptop on battery", _linux_power(supplies(laptop)) == "battery")
    laptop["AC0"]["online"] = "1"
    check("laptop on AC", _linux_power(supplies(laptop)) == "AC")
    desktop = {"hidpp_battery_0": {"type": "Battery", "scope": "Device"}}
    check("desktop with only a mouse battery is AC", _linux_power(supplies(desktop)) == "AC")
    check("no power_supply dir is unknown", _linux_power("/nonexistent/ps") is None)
    usbc = {"BAT0": {"type": "Battery"},
            "ucsi-source-psy-USBC000:001": {"type": "USB", "scope": "System", "online": "1"}}
    check("USB-C-only laptop charging is AC", _linux_power(supplies(usbc)) == "AC")
    usbc["ucsi-source-psy-USBC000:001"]["online"] = "0"
    check("USB-C-only laptop unplugged is battery", _linux_power(supplies(usbc)) == "battery")
    check("battery but no Mains entry is unknown",
          _linux_power(supplies({"BAT0": {"type": "Battery", "scope": "System"}})) is None)

    check("pmset AC", _pmset_power("Now drawing from 'AC Power'\n -InternalBattery-0") == "AC")
    check("pmset battery", _pmset_power("Now drawing from 'Battery Power'\n") == "battery")
    check("pmset unknown", _pmset_power("") is None)

    print(f"bench_meta self-test: {'FAILED' if failures else 'ok'}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(_self_test())
