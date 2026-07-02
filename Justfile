# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a

# Justfile for retch
# Run with: just <recipe>

BASH_COMP  := `echo "${XDG_DATA_HOME:-$HOME/.local/share}/bash-completion/completions"`
ZSH_COMP   := `echo "${XDG_DATA_HOME:-$HOME/.local/share}/zsh/site-functions"`
FISH_COMP  := `echo "${XDG_CONFIG_HOME:-$HOME/.config}/fish/completions"`
ELVISH_COMP := `echo "${XDG_CONFIG_HOME:-$HOME/.config}/elvish/lib"`
NU_COMP    := `echo "${XDG_CONFIG_HOME:-$HOME/.config}/nushell/autoload"`
PS_COMP    := `echo "${XDG_CONFIG_HOME:-$HOME/.config}/powershell"`

# Default recipe
default:
    @just --list

# Build the project (debug mode)
build:
    cargo build

# Build the project (release mode)
build-release:
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

# Install the binary, man page, and shell completions
install: install-man install-completions
    cargo install --path .

# Generate man page from Markdown using mandown.
# The version is dynamically read from Cargo.toml and placed in the footer.
man:
    @mkdir -p docs
    @VERSION=$(grep '^version' Cargo.toml | head -1 | cut -d '"' -f2); \
    DATE=$(date +"%B %Y"); \
    mandown docs/retch.1.md RETCH 1 | sed -e 's/\\fB\\fB/\\fB/g' -e 's/\\fP\\fP/\\fP/g' -e "s/\\.TH \"RETCH\" 1/\\.TH \"RETCH\" \"1\" \"$DATE\" \"retch $VERSION\" \"System Information Fetcher\"/" > docs/retch.1



# Install man page to XDG user location (~/.local/share/man)
install-man: man
    @mkdir -p "${XDG_DATA_HOME:-$HOME/.local/share}/man/man1"
    install -m 644 docs/retch.1 "${XDG_DATA_HOME:-$HOME/.local/share}/man/man1/retch.1"
    @echo "Man page installed to ${XDG_DATA_HOME:-$HOME/.local/share}/man/man1/"

# Install shell completions for all supported shells to XDG user locations
install-completions: build
    #!/usr/bin/env bash
    set -euo pipefail
    mkdir -p "{{BASH_COMP}}" "{{ZSH_COMP}}" "{{FISH_COMP}}" "{{ELVISH_COMP}}" "{{NU_COMP}}" "{{PS_COMP}}"
    BIN="{{justfile_directory()}}/target/debug/retch"
    "$BIN" --completions bash        > "{{BASH_COMP}}/retch"
    "$BIN" --completions zsh         > "{{ZSH_COMP}}/_retch"
    "$BIN" --completions fish        > "{{FISH_COMP}}/retch.fish"
    "$BIN" --completions elvish      > "{{ELVISH_COMP}}/retch.elv"
    "$BIN" --completions nushell     > "{{NU_COMP}}/50retch-completions.nu"
    "$BIN" --completions power-shell > "{{PS_COMP}}/retch.ps1"
    echo "Installed completions for retch"
    echo ""
    echo "Notes:"
    echo "  bash       source {{BASH_COMP}}/retch  (or restart shell)"
    echo "  zsh        auto-loaded from {{ZSH_COMP}}"
    echo "  fish       auto-loaded from {{FISH_COMP}}"
    echo "  elvish     add to rc.elv:  eval (slurp < {{ELVISH_COMP}}/retch.elv)"
    echo "  nushell    auto-loaded from {{NU_COMP}}"
    echo "  powershell add to \$PROFILE:  . {{PS_COMP}}/retch.ps1"

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
    @echo "=== Comparing Standard/Default ==="
    @if command -v fastfetch > /dev/null; then \
        hyperfine --warmup 3 --runs 10 './target/release/retch' 'fastfetch'; \
    else \
        hyperfine --warmup 3 --runs 10 './target/release/retch'; \
    fi
    @echo "=== Comparing Short ==="
    @if command -v fastfetch > /dev/null; then \
        hyperfine --warmup 3 --runs 10 './target/release/retch --short' 'fastfetch -c none'; \
    else \
        hyperfine --warmup 3 --runs 10 './target/release/retch --short'; \
    fi
    @echo "=== Comparing Long ==="
    @if command -v fastfetch > /dev/null; then \
        hyperfine --warmup 3 --runs 10 './target/release/retch --long' 'fastfetch -c all'; \
    else \
        hyperfine --warmup 3 --runs 10 './target/release/retch --long'; \
    fi

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

# Dry-run publish check for both crates (no upload)
publish-check:
    cargo publish --dry-run --manifest-path crates/sysinfo/Cargo.toml
    cargo publish --dry-run --manifest-path Cargo.toml

# Publish both crates to crates.io (sysinfo first, then CLI)
publish:
    cargo publish --manifest-path crates/sysinfo/Cargo.toml
    cargo publish --manifest-path Cargo.toml

# Automatically calculate and update Nixpkgs hashes in packaging/nixpkgs/package.nix (requires Nix)
nix-update VERSION="":
    @python3 scripts/calculate_nix_hashes.py {{VERSION}}

# Tag, wait for CI hashes, update nixpkgs fork, and open a PR — no Nix required.
# Set NIXPKGS_DIR to override the default ~/git/nixpkgs fork location.
nixpkgs-release VERSION="":
    @python3 scripts/nixpkgs_release.py {{VERSION}}

# Submit the local tldr page upstream to tldr-pages/tldr (requires gh)
tldr-release:
    @python3 scripts/tldr_release.py

# Merge the active PR, switch to main, pull, delete the branch, and reset WIP.md (requires gh)
merge-pr:
    #!/usr/bin/env bash
    set -euo pipefail
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$BRANCH" = "main" ]; then
        echo "Error: You are already on main."
        exit 1
    fi
    echo "Merging PR for branch $BRANCH..."
    gh pr merge --squash --delete-branch
    echo "Switching to main and pulling..."
    git checkout main
    git pull
    echo "Deleting local branch $BRANCH..."
    git branch -D "$BRANCH" 2>/dev/null || true
    python3 scripts/reset_wip.py

# Pre-PR gate: run all automated checks and print manual checklist before opening a PR.
# All items must pass before calling `gh pr create`.
pr:
    #!/usr/bin/env bash
    set -euo pipefail
    BOLD='\033[1m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
    pass() { echo -e "${GREEN}[✓]${NC} $1"; }
    fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
    info() { echo -e "${YELLOW}[→]${NC} $1"; }

    echo -e "\n${BOLD}=== Pre-PR Gate ===${NC}\n"

    # 1. Must be on a feature branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    [ "$BRANCH" = "main" ] && fail "On main — create a feature branch first"
    pass "Feature branch: $BRANCH"

    # 2. Version must be bumped past the last tag
    CARGO_VER=$(grep '^version' Cargo.toml | head -1 | cut -d'"' -f2)
    LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "none")
    [ "$LAST_TAG" = "v$CARGO_VER" ] && fail "Version not bumped — Cargo.toml is still $CARGO_VER (matches last tag)"
    pass "Version bumped: $CARGO_VER (last tag: $LAST_TAG)"

    # 3. NOTES.md Current State header must match
    grep -q "## Current State (v$CARGO_VER)" NOTES.md \
        || fail "NOTES.md Current State header not updated to v$CARGO_VER"
    pass "NOTES.md Current State header: v$CARGO_VER"

    # 4. Regenerate man page and verify it was committed
    info "Regenerating man page..."
    just man
    MAN_DIRTY=$(git diff --name-only docs/retch.1)
    [ -n "$MAN_DIRTY" ] && fail "docs/retch.1 was regenerated but not committed — stage and commit it first"
    pass "docs/retch.1 is current and committed"

    # 5. cargo check — updates Cargo.lock; verify it was committed
    info "Running cargo check..."
    cargo check -q 2>&1
    LOCK_DIRTY=$(git diff --name-only Cargo.lock)
    [ -n "$LOCK_DIRTY" ] && fail "Cargo.lock was updated but not committed — stage and commit it first"
    pass "Cargo.lock is current and committed"

    # 6. fmt + clippy
    info "Running just check..."
    just check
    pass "fmt + clippy passed"

    # 7. Tests
    info "Running cargo test..."
    cargo test -q 2>&1
    pass "All tests passed"

    # Manual checklist
    echo -e "\n${BOLD}Automated checks passed.${NC}\n"
    echo -e "${BOLD}Manual checklist — confirm each before proceeding:${NC}"
    echo "  [ ] README.md reviewed and updated (new features, flags, config keys)"
    echo "  [ ] NOTES.md release log entry added under Major Achievements"
    echo "  [ ] GitHub wiki cloned and updated (Configuration-and-Theming.md, Workspace-Architecture.md)"
    echo "  [ ] Upstream tldr page updated / docs/retch.md synced (if CLI flags changed)"
    echo ""
    echo -n "All manual items confirmed? [y/N] "
    read -r CONFIRM
    [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ] \
        || { echo -e "${RED}Aborted.${NC} Complete the checklist first."; exit 1; }

    echo -e "\n${GREEN}Gate passed. You may now run: gh pr create${NC}\n"

# Run the full pre-PR checklist (`just pr`), then `gh pr create`. Always use this instead
# of calling `gh pr create` directly — `gh` has no hook of its own to gate it otherwise.
open-pr *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    just pr
    gh pr create "$@"

# Generate a flamegraph for execution profiling (requires perf on Linux or dtrace on macOS)
flamegraph *ARGS="":
    @command -v cargo-flamegraph >/dev/null || (echo "Installing cargo-flamegraph..." && cargo install flamegraph)
    @if [ "$(uname)" = "Linux" ] && ! command -v perf >/dev/null; then \
        echo "Error: 'perf' is not installed. Please install 'perf' (e.g., 'sudo dnf install perf' on Fedora)"; \
        exit 1; \
    fi
    cargo flamegraph --profile profiling -- {{ARGS}}

