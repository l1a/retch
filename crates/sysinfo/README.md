# retch-sysinfo

[![Crates.io](https://img.shields.io/crates/v/retch-sysinfo.svg)](https://crates.io/crates/retch-sysinfo)
[![Documentation](https://docs.rs/retch-sysinfo/badge.svg)](https://docs.rs/retch-sysinfo)
[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A fast, concurrent, cross-platform hardware and system information gathering library for [**retch**](https://github.com/l1a/retch).

Extracted from the `retch-cli` binary to allow reuse as a standalone, zero-unnecessary-subprocess system probing library on Linux, macOS, and Windows.

---

## Features

- **High-Performance & Concurrent**: Probes run in parallel using scoped threads for minimal latency.
- **Zero Subprocess Overhead**: Native Win32 FFI / WinRT COM on Windows, direct binary D-Bus socket connections on Linux, and Objective-C runtime FFI on macOS to avoid slow shell/interpreter forks.
- **Comprehensive Hardware & OS Detection**:
  - **CPU**: Model name, physical/logical core count, P/E hybrid topology, frequency ranges, and cache sizes (L1/L2/L3).
  - **GPU & VRAM**: AMD GPUs (via `libdrm` `amdgpu.ids` & PCI IDs), NVIDIA, Intel, Apple Silicon, and Direct3D/WMI.
  - **Displays**: Multi-monitor resolution, refresh rates, and model/vendor names parsed from raw EDID binaries.
  - **Memory & Storage**: RAM capacity/usage, swap, physical DIMM speeds/types (SMBIOS/dmidecode), physical disks, NVMe/SATA/HDD identification, Btrfs subvolumes, and ZFS pools.
  - **Network & Wi-Fi**: Active default-route interface, local IPs, DNS domain/search scopes, Wi-Fi SSID/BSSID/channel/band/rate.
  - **Peripherals**: Audio servers/devices, Bluetooth controller status & connected devices, Battery health/cycle counts, Power adapters, Webcams/cameras, Gamepads/controllers, Input devices (Keyboards, Mice, Touchpads), and TPM versions.
  - **Media & Player**: Active media player name, playback status, and track metadata (artist, title, album).
  - **Desktop Environment**: DE, Window Manager, Login Manager, UI Theme, Icons, Cursor, Terminal, Shell, and Weather.

---

## Usage

Add `retch-sysinfo` to your `Cargo.toml`:

```toml
[dependencies]
retch-sysinfo = "0.1"
```

### Basic Example

```rust
use retch_sysinfo::{CollectOptions, SystemInfo};

fn main() {
    // Customize what fields to collect (or use CollectOptions::default())
    let options = CollectOptions::default();

    // Probe system information concurrently
    let info = SystemInfo::collect(&options);

    if let Some(os) = &info.os {
        println!("OS: {}", os);
    }
    if let Some(cpu) = &info.cpu {
        println!("CPU: {}", cpu);
    }
    if let Some(mem) = &info.memory {
        println!("Memory: {}", mem);
    }
}
```

---

## Modules

`retch-sysinfo` provides modular subsystem detectors:

| Module | Description |
| :--- | :--- |
| [`audio`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/audio/) | Audio server (PipeWire, PulseAudio, ALSA, CoreAudio, WASAPI) and output devices |
| [`battery`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/battery/) | Battery status, charge level, health, time remaining, and power supplies |
| [`bios`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/bios/) | BIOS/firmware vendor, version, and release date |
| [`bluetooth`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/bluetooth/) | Bluetooth adapter power state, name, and connected devices |
| [`btrfs`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/btrfs/) | Btrfs filesystem pools, allocation, and snapshot counts |
| [`camera`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/camera/) | Connected webcams and video capture devices |
| [`disk`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/disk/) | Filesystem mount usage and physical drive models (SSD/NVMe/HDD) |
| [`display`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/display/) | Display connector resolution, refresh rate, and EDID model parsing |
| [`fetch`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/fetch/) | Core orchestrator (`SystemInfo`, `CollectOptions`) |
| [`gamepad`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/gamepad/) | Connected gamepads, joysticks, and controllers |
| [`gpu`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/gpu/) | GPU model detection and VRAM reporting |
| [`input`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/input/) | Input devices (keyboards, mice, touchpads, graphics tablets) |
| [`media`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/media/) | Active media player and playback track metadata |
| [`memory`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/memory/) | RAM usage, swap, and physical memory DIMM details |
| [`motherboard`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/motherboard/) | Motherboard / system vendor and model name |
| [`network`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/network/) | Network interfaces, IP addresses, DNS domain, and Wi-Fi link status |
| [`packages`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/packages/) | Installed package counts (dpkg, rpm, pacman, flatpak, brew, etc.) |
| [`shell`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/shell/) | Current user shell and version |
| [`terminal`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/terminal/) | Terminal emulator detection, window size, and font configuration |
| [`theme`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/theme/) | Desktop theme, icons, cursor, and system fonts |
| [`weather`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/weather/) | Current weather conditions |
| [`wm`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/wm/) | Window manager and desktop environment detection |
| [`zfs`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/zfs/) | ZFS storage pool health and capacity |

---

## License

This project is licensed under the **GPL-3.0-or-later** license. See the top-level repository for details.
