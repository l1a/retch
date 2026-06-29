# retch

A fast, feature-rich system information fetcher written in Rust.

> **Note**: The crate is published as `retch-cli` on crates.io because the name `retch` was already taken.  
> Users interact with the tool as `retch` (binary name and config directory `~/.config/retch/`).

## Status

**Active and usable.**  
retch is under active development with a working core, rich system information output, theming, config support, and high-quality distro logos (ASCII + graphical via Chafa).

> **Note**: This project was 100% vibe coded using Grok and Gemini. Real programmers are welcome.

## Features

- **Concurrent Execution**: Scoped multi-threading (`std::thread::scope`) fetches slow system properties (GPUs, packages, network, displays, audio, Bluetooth, etc.) concurrently to keep execution blazing fast.
- **Cross-Platform**: First-class support for Linux (Fedora, Ubuntu, Arch, etc.), macOS (Darwin), and Windows (Win32).
- **Rich Hardware Detection**:
  - **Multi-GPU & VRAM**: Detects multiple graphics cards (supports AMD/NVIDIA/Apple Silicon; translates AMD codenames like Phoenix1 to marketing names).
  - **Displays**: Raw EDID parser reads monitor vendor/model names, preferred resolutions, refresh rates (via Detailed Timing Descriptors), and generates unique serial ID suffixes for identical models.
  - **Motherboard & BIOS**: Parses motherboard manufacturer/model and BIOS version/vendor details.
  - **Camera/Webcam**: Queries connected webcam and camera device names.
  - **Gamepad/Controller**: Enumerates wired and wireless game controllers (Xbox, PlayStation, DualShock, DualSense, Nintendo Joy-Con, etc.).
  - **Audio Devices**: Detects active audio servers (PipeWire, PulseAudio, ALSA on Linux; CoreAudio on macOS; Windows Audio on Windows).
  - **Disks & Temp**: Measures active disk mounts (hiding loopback/temporary volumes) and temperature sensors.
- **Advanced Networking & Wireless**:
  - **Network Interfaces**: Outputs IPv4 & IPv6 addresses for active interfaces.
  - **Wi-Fi**: Details SSID, band frequency, channel, link rates (RX/TX on Linux, TX-only on macOS), adapter hardware, and Wi-Fi 7 Multi-Link Operation (MLO) bands.
  - **Bluetooth**: Reports adapter controller state, manufacturer/model, and connected device names/counts.
- **Battery Info**: Uses a custom, native implementation (no heavy dependencies) to extract capacity, vendor/model, time remaining, and battery health.
- **Software & Desktop Environment**:
  - **Shell Version**: Identifies the *running* shell (process tree, not `$SHELL`) and parses versions (`bash`, `zsh`, `fish`, `nu`, `pwsh`, `elvish`, `tcsh`).
  - **Desktop Environment & WM**: Detects GNOME, KDE, macOS Aqua, Windows, etc. WM is shown separately (e.g. Mutter under GNOME) and suppressed when identical to the DE.
  - **DNS**: Reports configured nameservers from `/etc/resolv.conf` (Linux/macOS) or system DNS settings (Windows).
  - **Terminal Size**: Reports terminal dimensions (columns × rows).
  - **UI Themes & Styling**: Concurrently resolves GTK2/3/4 or Qt global settings, icon packs, cursors, and system fonts (macOS/Windows/Linux-compatible).
  - **Package Counts**: Counts packages across many managers (`dpkg`, `rpm`, `pacman`, `flatpak`, `snap`, `homebrew`, `scoop`, `chocolatey`, `macports`).
- **Logo Rendering Modes**:
  - **ASCII art**: High-quality color ASCII art matching your distro (adapted from Fastfetch).
  - **Graphical images**: Inline image rendering support via Kitty protocol, iTerm2, and Sixel.
  - **Unicode symbols fallback**: Graphical rendering using Chafa when full image protocols are unavailable.
  - **Auto-suppressed when piped**: Logo is never printed when stdout is not a terminal (e.g. `retch | bat` or `retch > file`).
  - **Interactive CLI tools**: Command flags like `--ascii-only`, `--logo <NAME>` to force overrides, `--print-logos`, and `--list-distros`.
- **Flexible Theming**:
  - Built-in community color schemes (Catppuccin Latte/Frappé/Macchiato/Mocha, Solarized Light/Dark) or automatic dark/light preference detection.
  - Full hex code (`#RRGGBB`) color support for custom theme creation.
- **Configuration Engine**: Merge logic integrates CLI parameters and TOML configuration files seamlessly.

## Installation

### On Arch Linux (AUR)

You can install `retch` from the AUR using an AUR helper (e.g., `yay` or `paru`):

```sh
yay -S retch
```

> [!NOTE]
> **AUR Registration Outage**: New account registrations on the Arch User Repository are temporarily suspended by Arch Linux. While registrations are down, you can still build and install the package locally using the provided configuration:
> ```sh
> cd packaging/aur && makepkg -si
> ```

*(AUR package configuration files are available in [packaging/aur](packaging/aur/PKGBUILD)).*

### From crates.io

```sh
cargo install retch-cli
```

### With Nix

```sh
nix run github:l1a/retch
```

Or add it to your NixOS / Home Manager configuration using the provided Flake:

```nix
# flake.nix inputs
inputs.retch.url = "github:l1a/retch";

# Home Manager module
programs.retch.enable = true;
# Optionally configure retch (writes ~/.config/retch/config.toml):
programs.retch.settings = {
  theme = "catppuccin";
};
```

*(Nixpkgs package derivation expression is available in [packaging/nixpkgs](packaging/nixpkgs/package.nix)).*

### From source

```sh
git clone https://github.com/l1a/retch.git
cd retch
cargo install --path .
```

## Usage

Basic usage:

```sh
retch
```

Force ASCII-only output:

```sh
retch --ascii-only
```

Override distribution logo:

```sh
retch --logo pop
```

List available logos:

```sh
retch --print-logos
```

List known distros:

```sh
retch --list-distros
```

Show help:

```sh
retch --help
```

## Shell Completions

Generate completion scripts for your shell:

```sh
# Bash
retch --completions bash > ~/.local/share/bash-completion/completions/retch

# Zsh
retch --completions zsh > ~/.local/share/zsh/site-functions/_retch

# Fish
retch --completions fish > ~/.config/fish/completions/retch.fish
```

Supported shells: `bash`, `elvish`, `fish`, `power-shell`, `zsh`, `nushell`.

## Documentation

Retch provides standard documentation and quick-reference guides:
- **Man Page**: Display the full user manual:
  ```sh
  man retch
  ```
- **TL;DR Page**: Display common command usage examples (using a `tldr` client like `tealdeer` or `tldr`):
  ```sh
  tldr retch
  ```

## Configuration

retch looks for a configuration file at `~/.config/retch/config.toml` (or `$XDG_CONFIG_HOME/retch/config.toml`).

### Setup Commands

- **Generate config template** (prints to stdout):
  ```sh
  retch --generate-config
  ```
- **Write config directly** to the default location:
  ```sh
  retch --write-config
  ```
- **Merge defaults** into an existing configuration file (adds comments for new keys):
  ```sh
  retch --merge-config
  ```

### Configuration Structure

Here is an example of the settings you can configure in `config.toml`:

```toml
# Theme to use. Defaults to "auto" (follows system dark/light preference).
# Other options: "neutral", "dark", "light", "custom", or community schemes:
# "catppuccin-latte", "catppuccin-frappe", "catppuccin-macchiato", "catppuccin-mocha",
# "solarized-dark", "solarized-light".
theme = "auto"

# Whether to show the distribution ASCII/graphical logo
show_logo = true

# Force ASCII-only logo output (even if graphical protocols are supported)
ascii_only = false

# Override the detected distribution logo (e.g. "ubuntu", "fedora", "pop", "macos", "windows")
logo = "pop"

# Custom theme colors (applied if theme = "custom" or as partial overrides)
# Colors can be specified using terminal names or standard hex values (#RRGGBB)
[custom_theme]
label_color = "bright_cyan"
value_color = "#cdd6f4"
accent_color = "bright_green"
title_color = "bright_yellow"
separator_color = "bright_black"

# Location for weather lookup (city name, ZIP code, airport code, or lat/lon coordinates).
# If unset, wttr.in auto-detects from your IP. Can also be set with --weather-location.
# weather_location = "London"

# Ordered list of system information fields to display
# Note: "phys-mem" requires root (sudo) on Linux to read DMI memory tables. On Windows, uses Win32_PhysicalMemory via PowerShell.
# Note: "phys-disk" on Windows uses Get-PhysicalDisk via PowerShell.
# Note: "weather" requires network access; shown in long mode by default.
fields = [
    "os", "kernel", "host", "chassis", "init", "locale",
    "arch", "cpu", "cpu-freq", "cpu-cache", "cpu-usage", "gpu",
    "motherboard", "bios", "bootmgr", "display", "audio",
    "memory", "phys-mem", "swap", "uptime", "procs", "load",
    "disk", "phys-disk", "temp", "net", "wifi", "dns", "bluetooth", "battery",
    "shell", "editor", "terminal", "terminal_font", "terminal-size", "desktop", "wm",
    "theme", "icons", "cursor", "font", "users", "packages", "weather"
]
```

## Logos

### ASCII Logos

Some ASCII logos are adapted from [Fastfetch](https://github.com/fastfetch-cli/fastfetch) (MIT licensed).

### Graphic Logos

Graphic logos are converted from official or community SVG logos. These are **not** covered by the project's GPLv3 license and remain subject to the original trademarks and licenses of their respective projects.

See the full list of supported distros with:

```sh
retch --print-logos
```

## Workspace Architecture

retch is structured as a Cargo workspace with the following crates:

| Crate | Path | Description |
|---|---|---|
| `retch-cli` | `.` | CLI binary — display logic, configuration, logo rendering |
| `retch-sysinfo` | `crates/sysinfo` | System info library — all `detect_*` logic, `SystemInfo`, `CollectOptions`, GPU, and battery |

The `retch-sysinfo` crate can be used independently as a library for cross-platform system information gathering without any dependency on `clap` or the CLI.

## License

This project is licensed under the GNU General Public License v3.0.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

If you are the copyright holder of any logo and would like different attribution or removal, please open an issue.
