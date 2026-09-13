# retch-sysinfo

[![Crates.io](https://img.shields.io/crates/v/retch-sysinfo.svg)](https://crates.io/crates/retch-sysinfo)
[![Documentation](https://docs.rs/retch-sysinfo/badge.svg)](https://docs.rs/retch-sysinfo)
[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A fast, concurrent, cross-platform hardware and system information gathering library for [**retch**](https://github.com/l1a/retch).

Extracted from the `retch-cli` binary to allow reuse as a standalone, zero-unnecessary-subprocess system probing library on Linux, macOS, and Windows.

---

## Features

- **High-Performance & Concurrent**: Probes run in parallel using scoped threads for minimal latency.
- **Minimal Subprocesses**: Native Win32 FFI / WinRT COM on Windows, a direct binary D-Bus socket client on Linux, and Objective-C runtime / IOKit / SystemConfiguration FFI on macOS, instead of slow shell and interpreter forks. The few remaining spawns (for example `btrfs`, `zpool`, `dmidecode`, or a shell's own version query) run only when their field is requested.
- **Comprehensive Hardware & OS Detection**:
  - **CPU**: Model name, physical/logical core count, P/E hybrid topology, frequency ranges, and cache sizes (L1/L2/L3).
  - **GPU & VRAM**: AMD GPUs (via `libdrm` `amdgpu.ids` & PCI IDs), NVIDIA, Intel, Apple Silicon, and the display-adapter registry keys on Windows.
  - **Graphics APIs**: Vulkan, OpenGL and OpenCL versions from the installed loaders.
  - **I/O Throughput**: Disk and network rates sampled over the collection window.
  - **Displays**: Multi-monitor resolution, refresh rates, and model/vendor names parsed from raw EDID binaries.
  - **Memory & Storage**: RAM capacity/usage, swap, physical DIMM speeds/types (SMBIOS/dmidecode), physical disks, NVMe/SATA/HDD identification, Btrfs subvolumes, and ZFS pools.
  - **Network & Wi-Fi**: Active default-route interface, local IPs, DNS domain/search scopes, Wi-Fi SSID/BSSID/channel/band/rate.
  - **Peripherals**: Audio servers/devices, Bluetooth controller status & connected devices, Battery health/cycle counts, Power adapters, Webcams/cameras, Gamepads/controllers, Input devices (Keyboards, Mice, Touchpads), and TPM versions.
  - **Media & Player**: Active media player name, playback status, and track metadata (artist, title, album).
  - **Desktop Environment**: DE, Window Manager, Login Manager, UI Theme, Icons, Cursor, Terminal (including Windows Terminal and its package version), Shell, and Weather.

---

## Usage

Add `retch-sysinfo` to your `Cargo.toml`:

```toml
[dependencies]
retch-sysinfo = "0.1"
```

### Basic Example

```rust,no_run
use retch_sysinfo::{CollectOptions, SystemInfo};

fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Collect every field; set `fields: Some(vec![...])` to probe only some of them.
    let options = CollectOptions::default();

    // Probe system information concurrently.
    let info = SystemInfo::collect(options)?;

    println!("OS: {}", info.os);
    println!("CPU: {}", info.cpu);
    println!("Memory: {}", info.memory);
    if let Some(kernel) = &info.kernel {
        println!("Kernel: {kernel}");
    }
    Ok(())
}
```

This example is compiled as a doctest, so it cannot quietly stop compiling again.

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
| [`gpu_api`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/gpu_api/) | Vulkan, OpenGL and OpenCL API versions via the platform loaders |
| [`input`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/input/) | Input devices (keyboards, mice, touchpads, graphics tablets) |
| [`io`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/io/) | Disk and network throughput sampling |
| [`media`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/media/) | Active media player and playback track metadata |
| [`memory`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/memory/) | RAM usage, swap, and physical memory DIMM details |
| [`motherboard`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/motherboard/) | Motherboard / system vendor and model name |
| [`network`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/network/) | Network interfaces, IP addresses, DNS domain, and Wi-Fi link status |
| [`packages`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/packages/) | Installed package counts (dpkg, rpm, pacman, flatpak, brew, etc.) |
| [`shell`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/shell/) | Current user shell and version |
| [`terminal`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/terminal/) | Terminal emulator detection (including Windows Terminal's package version), window size, font and theme |
| [`theme`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/theme/) | Desktop theme, icons, cursor, and system fonts |
| [`weather`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/weather/) | Current weather conditions |
| [`wm`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/wm/) | Window manager and desktop environment detection |
| [`zfs`](https://docs.rs/retch-sysinfo/latest/retch_sysinfo/zfs/) | ZFS storage pool health and capacity |

---

## License

This project is licensed under the **GPL-3.0-or-later** license. See the top-level repository for details.
