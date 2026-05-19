% RETCH(1) | System Information Fetcher
% retch developers
% May 2025

# NAME

retch - a fast, feature-rich system information fetcher

# SYNOPSIS

**retch** [*OPTIONS*]

# DESCRIPTION

**retch** is a fast system information tool written in Rust. It displays detailed information about your system including OS, CPU, memory, disks, network, and more, with support for high-quality ASCII and graphical logos.

# OPTIONS

**-h, --help**
:   Show help information.

**-V, --version**
:   Print version information.

**--ascii-only**
:   Force ASCII-only output, disabling graphical and Chafa rendering.

**--no-logo**
:   Disable the logo entirely.

**--theme** *THEME*
:   Use a specific theme (`default`, `dark`, or `light`).

**--print-logos**
:   Print all available logos.

**--list-distros**
:   List known supported distributions.

**--generate-config**
:   Print a default configuration file to stdout.

**--write-config** [*PATH*]
:   Write the default configuration to a file (uses `~/.config/retch/config.toml` if no path is given).

# CONFIGURATION

retch reads its configuration from:

    $XDG_CONFIG_HOME/retch/config.toml

or

    ~/.config/retch/config.toml

You can generate a starting configuration with:

    retch --generate-config > ~/.config/retch/config.toml

# THEMES

retch supports multiple built-in themes as well as custom color overrides.

The following themes are available:

- **auto** (default): Automatically follows your system dark/light preference.
- **neutral**: A balanced neutral theme (cyan labels, white values).
- **dark** and **light**: Basic dark and light themes.
- Popular community themes: **catppuccin-latte**, **catppuccin-frappe**, **catppuccin-macchiato**, **catppuccin-mocha**, **solarized-light**, **solarized-dark**.

You can also define custom colors using the `[custom_theme]` section in your configuration file. Example:

    [custom_theme]
    label_color = "bright_cyan"
    value_color = "white"
    accent_color = "bright_green"

# LOGOS

retch supports both ASCII and graphical logos.

- ASCII logos are adapted from Fastfetch.
- Graphical logos are rendered using Chafa when available, or via the Kitty/iTerm2 inline image protocol.

Use `--ascii-only` to force text-only output.

# EXIT STATUS

**retch** exits with status 0 on success, and non-zero on error.

# SEE ALSO

**fastfetch**(1), **neofetch**(1)

# AUTHORS

Maintained by the retch developers.
See the project repository for more information:

    https://github.com/l1a/retch