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

# Full development setup
dev: fmt lint test build
    @echo "Development build complete."