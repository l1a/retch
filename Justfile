# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a

# Justfile for retch
# Run with: just <recipe>

# Default recipe
default:
    @just --list

# Build the project
build:
    cargo build --release

# Run tests
test:
    cargo test

# Clean build artifacts
clean:
    cargo clean

# Format code
fmt:
    cargo fmt

# Run clippy lints
lint:
    cargo clippy -- -D warnings

# Run strict checks (formatting and linting) as done in CI
check:
    cargo fmt -- --check
    cargo clippy -- -D warnings

# Run security audit (requires cargo-audit)
audit:
    @command -v cargo-audit >/dev/null || cargo install cargo-audit
    cargo audit

# Install the binary and man page
install: install-man
    cargo install --path .

# Generate man page from Markdown using pandoc.
# The version is dynamically read from Cargo.toml and placed in the footer.
man:
    @mkdir -p docs
    @VERSION=$(grep '^version' Cargo.toml | head -1 | cut -d '"' -f2); \
    pandoc docs/retch.1.md \
        -s -t man \
        --variable=footer="retch $VERSION" \
        -o docs/retch.1

# Install man page to XDG user location (~/.local/share/man)
install-man: man
    @mkdir -p "${XDG_DATA_HOME:-$HOME/.local/share}/man/man1"
    install -m 644 docs/retch.1 "${XDG_DATA_HOME:-$HOME/.local/share}/man/man1/retch.1"
    @echo "Man page installed to ${XDG_DATA_HOME:-$HOME/.local/share}/man/man1/"

# Convert all SVGs to PNGs (used for embedded logos)
logos:
    @echo "Converting SVGs to PNGs..."
    cd assets/logos && \
    for svg in *.svg; do \
        png="${svg%.svg}.png"; \
        convert -background none -resize 384x384 "$svg" "$png" 2>/dev/null || true; \
        echo "  $svg -> $png"; \
    done
    @echo "Logo conversion complete."

# Run criterion micro-benchmarks
bench:
    cargo bench

# Benchmark the release binary with hyperfine (requires: hyperfine)
bench-cli:
    @python3 scripts/install_hyperfine.py 2>/dev/null || python scripts/install_hyperfine.py
    cargo build --release
    hyperfine --warmup 3 --runs 10 './target/release/retch'

# Compare retch against fastfetch and neofetch (requires: hyperfine)
bench-compare:
    @python3 scripts/install_hyperfine.py 2>/dev/null || python scripts/install_hyperfine.py
    cargo build --release
    @CMDS="'./target/release/retch'"; \
    if command -v fastfetch > /dev/null; then CMDS="$CMDS 'fastfetch'"; fi; \
    if command -v neofetch > /dev/null; then CMDS="$CMDS 'neofetch --off'"; fi; \
    eval hyperfine --warmup 3 --runs 10 $CMDS

# Upload local benchmark results to the gh-pages dashboard (requires: hyperfine, gh)
# On Windows: run from Git Bash, or invoke python scripts/upload_local_bench.py directly.
bench-upload *ARGS:
    @python3 scripts/upload_local_bench.py {{ARGS}} 2>/dev/null || python scripts/upload_local_bench.py {{ARGS}}

# Install git hooks (run once after cloning)
install-hooks:
    bash scripts/install_hooks.sh

# One-time repo setup: install git hooks and any other local tooling
setup: install-hooks
    @echo "Repo setup complete."

# Full development setup
dev: setup fmt lint test build
    @echo "Development build complete."