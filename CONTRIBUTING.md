# Contributing to retch

First off, thank you for considering contributing to `retch`! It's people like you who make the open-source community such an amazing place to learn, inspire, and create.

## How Can I Contribute?

### Reporting Bugs

- **Check for existing issues:** Before opening a new issue, please search the issue tracker to see if the problem has already been reported.
- **Use the Bug Report template:** Provide as much information as possible, including your OS, terminal, and `retch` version.
- **Provide reproduction steps:** A clear description of how to reproduce the bug helps us fix it faster.

### Suggesting Enhancements

- **Open a Feature Request:** Use the Feature Request template to describe your idea and why it would be useful for the project.
- **Be specific:** Describe the desired behavior and any potential edge cases.

### Submitting Pull Requests

1.  **Fork the repository** and create your branch from `main`.
2.  **Ensure the code follows the project's style:** We use `rustfmt` and `clippy`.
3.  **Run tests:** Make sure all tests pass before submitting.
4.  **Use `just`:** We use `just` as a command runner. Run `just check` to verify formatting and lints.
5.  **Write a clear commit message:** Follow standard git commit conventions.
6.  **Link related issues:** Mention any related issues in your PR description.

## Development Setup

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [just](https://github.com/casey/just) (command runner)
- [mandown](https://crates.io/crates/mandown) (for generating man pages)
- [hyperfine](https://github.com/sharkdp/hyperfine) (optional, for CLI benchmarking recipes)

### Build and Run

```bash
git clone https://github.com/l1a/retch.git
cd retch
cargo build
cargo run
```

### Checking your changes

Before submitting a PR, please run:

```bash
just check
```

This runs `cargo fmt`, `cargo clippy`, and `cargo test`.

## Licensing

By contributing to `retch`, you agree that your contributions will be licensed under the project's **GPL-3.0 License**.
