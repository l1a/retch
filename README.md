# retch

A fast, feature-rich system information fetcher written in Rust.

> **Note**: The crate is published as `retch-cli` on crates.io because the name `retch` was already taken.  
> Users interact with the tool as `retch` (binary name and config directory `~/.config/retch/`).

## Status

**Active and usable.**  
retch is under active development with a working core, rich system information output, theming, config support, and high-quality distro logos (ASCII + graphical via Chafa).

> **Note**: This project was 100% vibe coded using Grok and Gemini. Real programmers are welcome.

## Features

- Rich system information (OS, CPU, Motherboard, BIOS, GPU, Display, Audio, Memory, Disks, Network, etc.)
- High-quality ASCII logos (adapted from Fastfetch)
- Graphical logo support via Kitty protocol, iTerm2, and Sixel
- Graphical fallback via Chafa (Unicode symbols)
- Theming system (`default`, `dark`, `light`)
- Full configuration file support (`~/.config/retch/config.toml`)
- Smart config + CLI merging
- `--ascii-only` flag to force text-only output
- `--logo` (`-l`) flag to override the distro logo
- `--print-logos` and `--list-distros` commands

## Installation

### From crates.io

```sh
cargo install retch-cli
```

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

## Configuration

retch looks for a configuration file at:

```
~/.config/retch/config.toml
```

You can generate a default config with:

```sh
retch --generate-config
```

Or write it directly to the default location:

```sh
retch --write-config
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

## License

This project is licensed under the GNU General Public License v3.0.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

If you are the copyright holder of any logo and would like different attribution or removal, please open an issue.
