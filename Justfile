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

# Install the binary
install:
    cargo install --path .

# Generate man page (placeholder - customize as needed)
man:
    @echo "Man page generation not yet implemented"

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