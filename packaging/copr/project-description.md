**retch** is a fast, feature-rich system information fetcher written in Rust, in the spirit of [fastfetch](https://github.com/fastfetch-cli/fastfetch) and neofetch.

It runs its hardware and system probes **concurrently** (CPU, GPU and graphics APIs, displays, network, audio, Bluetooth, battery, packages, media and player, and more) and renders themed output beside your distribution's logo, including true graphical logos via the **Kitty**, **iTerm2** and **Sixel** protocols, with `chafa` and plain ASCII as fallbacks.

### Output modes

Four modes, each a strict superset of the last:

* **`retch --short`**: a fast hardware snapshot, with no network calls and no sensors
* **`retch`**: the daily-use system overview
* **`retch --long`**: diagnostics, including firmware, thermals and network detail
* **`retch --full`**: everything, including slow and cosmetic fields

### Performance

retch is benchmarked against fastfetch on every merge to `main`. Current numbers for Linux, macOS and Windows are on the [comparison page](https://github.com/l1a/retch/wiki/Compared-to-fastfetch-and-neofetch), rather than here, where they would go stale.

### Configuration

retch reads `~/.config/retch/config.toml`, created on first run. Themes, field selection and logo behaviour are all configurable; see the [Configuration and Theming](https://github.com/l1a/retch/wiki/Configuration-and-Theming) wiki page.

### Links

* [Source and issues](https://github.com/l1a/retch)
* [Documentation wiki](https://github.com/l1a/retch/wiki)
* Also on crates.io as [`retch-cli`](https://crates.io/crates/retch-cli), because the name `retch` was already taken there; the binary and config directory are both `retch`

Licensed **GPL-3.0-or-later**.
