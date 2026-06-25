# NAME

retch - a fast, feature-rich system information fetcher

# SYNOPSIS

**retch** [*OPTIONS*]

# DESCRIPTION

**retch** is a fast system information tool written in Rust. It displays detailed information about your system including OS, CPU, memory, audio, disks, network, Wi-Fi, Bluetooth, and more, with support for high-quality ASCII and graphical logos.

# OPTIONS

**-h, --help**
:   Show help information.

**-V, --version**
:   Print version information.

**-m, --mode** *MODE*
:   Select output mode (`short`, `long`, or `custom`).

**-c, --config** *FILE*
:   Path to a custom configuration file instead of the default.

**--ascii-logo**
:   Force ASCII logo output, disabling graphical and Chafa rendering.

**--chafa-logo**
:   Force Chafa symbols output, disabling high-res graphical protocols (Kitty, Sixel, iTerm2).

**--no-logo**
:   Disable the logo entirely.

**--logo** *LOGO*
:   Force a specific distribution logo by name/ID (e.g. `pop`, `manjaro`, `endeavouros`, `opensuse`, `ubuntu`, `fedora`, `macos`, `windows`).

**--theme** *THEME*
:   Use a specific theme (e.g. `default`, `dark`, `light`, or community themes).

**--list-themes**
:   List all available built-in themes.

**--print-theme-template**
:   Print an example custom theme template to stdout.

**--print-logos**
:   Print all available logos.

**--list-distros**
:   List known supported distributions.

**--completions** *SHELL*
:   Generate shell completion scripts for the specified shell. Supported shells are: `bash`, `elvish`, `fish`, `power-shell`, `zsh`, `nushell`.

**--generate-config**
:   Print a default configuration file to stdout.

**--write-config** [*PATH*]
:   Write the default configuration to a file (uses `~/.config/retch/config.toml` if no path is given).

**--merge-config**
:   Merge default configuration settings (as comments) into an existing config file at the default path (or custom path if `--config` is supplied).

**--fields** *FIELDS*
:   Comma-separated list of fields to display, overriding the config file's default list.

**-s, --short**
:   Short output mode. Equivalent to `--mode short`. Shows: OS, Kernel, Host, CPU, GPU, Memory, Disk.

**-l, --long**
:   Long output mode. Equivalent to `--mode long`. Shows all available fields.

# CONFIGURATION

retch reads its configuration from:

    $XDG_CONFIG_HOME/retch/config.toml

or

    ~/.config/retch/config.toml

You can generate a starting configuration with:

    retch --generate-config > ~/.config/retch/config.toml

## Available Configuration Keys

- **theme**: Theme name to use. (default: `"auto"`).
- **show_logo**: Boolean indicating whether to show the logo (default: `true`).
- **ascii_only**: Boolean indicating whether to restrict logo to ASCII representation.
- **chafa**: Boolean indicating whether to force Chafa symbols output.
- **logo**: Distro name/ID to force override logo detection.
- **fields**: Array of strings representing active fields and their display order. Available fields are:
  - `os`: Operating system name.
  - `kernel`: Kernel version.
  - `host`: System host/product name.
  - `arch`: System architecture.
  - `cpu`: CPU model name.
  - `cpu-freq`: CPU current/max/min frequencies.
  - `gpu`: GPU model(s) and VRAM.
  - `motherboard`: Motherboard manufacturer and model.
  - `bios`: BIOS vendor and version.
  - `display`: Connected monitor displays with refresh rates and resolution.
  - `audio`: Audio card controller and active sound servers (PipeWire, PulseAudio, ALSA, CoreAudio, Windows Audio).
  - `camera`: Connected camera/webcam names.
  - `gamepad`: Connected gamepad/controller names.
  - `memory`: System RAM usage and capacity.
  - `phys-mem`: Physical RAM slot details — type (DDR5, LPDDR5, etc.), speed, and per-slot capacity. On Linux, requires root (`sudo`) to read DMI memory tables via `dmidecode`. On Windows, uses `Win32_PhysicalMemory` via PowerShell.
  - `swap`: System SWAP usage and capacity.
  - `uptime`: System uptime.
  - `procs`: Active process count.
  - `load`: Average system load.
  - `disk`: Mounted disk capacity, usage, and mountpoint.
  - `phys-disk`: Physical disk model, size, and type (NVMe SSD, SSD, HDD). On Windows, uses `Get-PhysicalDisk` via PowerShell.
  - `temp`: System temperature sensors.
  - `net`: Active network interfaces and local/public IP addresses.
  - `wifi`: Active Wi-Fi SSID, band frequency, channel, and link rates.
  - `bluetooth`: Bluetooth adapter details and connected device count/names.
  - `battery`: Battery capacity, vendor/model, time remaining, and health.
  - `shell`: Shell name and version (e.g. bash, zsh, fish, nu).
  - `terminal`: Terminal emulator name and version.
  - `terminal_font`: Terminal emulator active font.
  - `desktop`: Desktop environment or window manager.
  - `theme`: UI Theme settings.
  - `icons`: UI icon pack.
  - `cursor`: UI mouse cursor settings.
  - `font`: UI system font.
  - `users`: Current logged in users.
  - `packages`: Installed package counts (supporting dpkg, rpm, pacman, flatpak, snap, homebrew, scoop, chocolatey, etc.).

# THEMES

retch supports multiple built-in themes as well as custom color overrides.

The following themes are available:

- **auto** (default): Automatically follows your system dark/light preference.
- **neutral**: A balanced neutral theme (cyan labels, white values).
- **dark** and **light**: Basic dark and light themes.
- Popular community themes: **catppuccin-latte**, **catppuccin-frappe**, **catppuccin-macchiato**, **catppuccin-mocha**, **solarized-light**, **solarized-dark**.

You can also define custom colors using the `[custom_theme]` section in your configuration file.

Colors can be specified using names (e.g. `"bright_cyan"`) or hex values (e.g. `"#89b4fa"`).

Example:

    [custom_theme]
    label_color = "bright_cyan"
    value_color = "#cdd6f4"
    accent_color = "bright_green"

# LOGOS

retch supports both ASCII and graphical logos.

- ASCII logos are adapted from Fastfetch.
- Graphical logos are rendered using Chafa when available, or via the Kitty, iTerm2, or Sixel inline image protocols.

Use `--ascii-only` to force text-only output.

# EXIT STATUS

**retch** exits with status 0 on success, and non-zero on error.

# SEE ALSO

**fastfetch**(1), **neofetch**(1)

# AUTHORS

Maintained by the retch developers.
See the project repository for more information:

    https://github.com/l1a/retch