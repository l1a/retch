# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 l1a

# Justfile for retch
# Run with: just <recipe>

# Required for shebang recipes to receive *ARGS as real argv ($@) instead of
# losing quoting via textual {{ARGS}} interpolation (see open-pr).
# ===== PROJECT — the only part of the install family this repo owns =====
#
# The COMMON block below is written against these so it can be byte-identical across repos
# that ship different binaries. `etr` sets BINS to two names; this repo has one.
BINS      := "retch"
MAN_PAGES := "docs/retch.1"

# Do NOT edit inside the markers below. Edit templates/justfile-common.just and the two
# vendored helpers, bump their versions, and propagate to the sibling repos in their own PRs.
# `just standard-check` runs the helpers' self-tests and `just check` depends on it, so a
# violation fails the build rather than being discovered years later.
# >>> COMMON (template v2)
# The interpreter is resolved ONCE per line, and a missing one is a hard error. The
# `python3 … 2>/dev/null || python …` idiom is deliberately NOT used: it retries on ANY
# failure, so a real error inside the script gets re-run and reported as if the
# interpreter were the problem.
PY := `command -v python3 || command -v python || echo PYTHON-NOT-FOUND`

# Install from this checkout: binary, man page(s) and completions.
#
# The dependencies are the point. `cargo install` alone replaces the binary and leaves the
# man page and completions at whatever version last ran their recipe — measured on a host
# whose page was ELEVEN releases stale with nothing reporting it.
install: install-man install-completions
    cargo install --path .

# Install a RELEASED tag: binary, man page(s) and completions, all three FROM THAT TAG.
#
# **It deliberately does NOT depend on `install-man`/`install-completions`**, because those
# work from the checkout. Reusing them would pair a tag's binary with the worktree's man
# page and completions — on a checkout one release ahead, a v0.2.22 binary with a v0.2.23
# page. Mismatched artefacts that each look fine is the failure class this standard exists
# to remove, so the three sources are made to agree: binary from the tag, completions from
# THE INSTALLED BINARY (`--from-path`), man page from the tag (`--from-tag`).
#
# Never `--path`: on a Syncthing-shared checkout that builds from a directory other
# machines write into. Takes a bare version and normalises a leading `v`.
install-tag VERSION:
    #!/usr/bin/env bash
    set -euo pipefail
    V="{{VERSION}}"; V="${V#v}"
    [ -n "$V" ] || { echo "error: install-tag needs a version, e.g. just install-tag 0.2.22" >&2; exit 1; }
    git rev-parse -q --verify "refs/tags/v${V}" >/dev/null || {
        echo "error: tag v${V} is not in this clone. Run: git fetch --tags" >&2; exit 1; }
    REPO=$(git config --get remote.origin.url)
    echo "Installing from tag v${V} of ${REPO}"
    cargo install --git "$REPO" --tag "v${V}" --locked --force
    # POST-CONDITION: cargo prints a replacement line, but only a version query proves which
    # binary is on PATH now.
    for b in {{BINS}}; do
        command -v "$b" >/dev/null 2>&1 || { echo "error: $b is not on PATH after install" >&2; exit 1; }
        echo "  $b -> $("$b" --version)"
    done
    "{{PY}}" scripts/install_man.py {{MAN_PAGES}} --from-tag "v${V}"
    "{{PY}}" scripts/install_completions.py {{BINS}} --from-path

# Install the man page(s) to the XDG man directory.
install-man: man
    @"{{PY}}" scripts/install_man.py {{MAN_PAGES}}

# Generate and install shell completions for every binary.
#
# Python rather than a just recipe, which is retch's finding and the more portable
# mechanism: no `sh`, no `cygpath`, no coreutils, nothing from Git's `usr\bin` on Windows.
# A `bash` shebang recipe cannot run on Windows without `cygpath` at all, and even a plain
# `sh` recipe still needs an `sh` on PATH.
install-completions: build
    @"{{PY}}" scripts/install_completions.py {{BINS}}

# Prove the vendored helpers still behave the way the standard requires.
#
# **This runs the helpers' own self-tests rather than diffing text**, and that is the whole
# point: three separate repositories cannot diff each other's files, but each can prove its
# copy still behaves correctly — which is the property that was actually violated when two
# repos quietly shipped the pre-fix nushell path for months. A text diff would also have
# passed happily on a repo that had never adopted the standard at all.
standard-check:
    #!/usr/bin/env bash
    set -euo pipefail
    [ "{{PY}}" != "PYTHON-NOT-FOUND" ] || { echo "error: no python3/python on PATH" >&2; exit 1; }
    "{{PY}}" scripts/install_completions.py --self-test
    "{{PY}}" scripts/install_man.py --self-test
# <<< COMMON

# ===== PROJECT-SPECIFIC — everything below is this repo's own =====

set positional-arguments := true

# Default recipe
default:
    @just --list

# Build the project (debug mode)
build:
    cargo build

# Build the project (release mode)
build-release:
    cargo build --release

# Run tests (all workspace members, incl. retch-sysinfo)
test:
    cargo test --workspace

# Clean build artifacts
clean:
    cargo clean

# Format code
fmt:
    cargo fmt

# Run clippy lints (all workspace members)
lint:
    cargo clippy --workspace -- -D warnings

# Run strict checks (formatting and linting) as done in CI
check: standard-check
    cargo fmt -- --check
    cargo clippy --workspace -- -D warnings
    # Also lint the optional `graphics` feature (base64/image/icy_sixel in src/logo.rs),
    # which the default --workspace clippy above does not compile. Targets retch-cli (the
    # package that defines the feature), not --workspace.
    cargo clippy --features graphics -- -D warnings

# Run security audit (requires cargo-audit)
audit:
    @command -v cargo-audit >/dev/null || cargo install cargo-audit
    cargo audit

# Generate man page from Markdown using mandown (requires: mandown)
man:
    @python3 scripts/build_man.py 2>/dev/null || python scripts/build_man.py

# Convert all SVGs to PNGs (used for embedded logos)
logos:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Converting SVGs to PNGs..."
    CONVERT_CMD="convert"
    if command -v magick >/dev/null 2>&1; then
        CONVERT_CMD="magick convert"
    fi
    cd assets/logos
    for svg in *.svg; do
        png="${svg%.svg}.png"
        $CONVERT_CMD -background none -resize 384x384 "$svg" "$png" 2>/dev/null || true
        echo "  $svg -> $png"
    done
    echo "Logo conversion complete."

# OS-appropriate path to the built release binary for hyperfine. hyperfine's
# default shell is cmd.exe on Windows — which needs backslashes and the .exe
# suffix to execute a relative path — and sh elsewhere, so a bare POSIX-style
# './target/release/retch' fails under cmd. Select the right form per OS.
retch_release_bin := if os_family() == "windows" { 'target\release\retch.exe' } else { './target/release/retch' }

# Run criterion micro-benchmarks
bench:
    cargo bench

# Benchmark the release binary with hyperfine (requires: hyperfine)
bench-cli:
    @python3 scripts/install_hyperfine.py 2>/dev/null || python scripts/install_hyperfine.py
    cargo build --release
    hyperfine --warmup 3 --runs 10 '{{retch_release_bin}}'

# Compare retch against fastfetch and neofetch (requires: hyperfine)
bench-compare:
    #!/usr/bin/env bash
    set -euo pipefail
    python3 scripts/install_hyperfine.py 2>/dev/null || python scripts/install_hyperfine.py
    cargo build --release
    echo "=== Comparing Standard/Default ==="
    if command -v fastfetch > /dev/null; then
        hyperfine --warmup 3 --runs 10 '{{retch_release_bin}}' 'fastfetch'
    else
        hyperfine --warmup 3 --runs 10 '{{retch_release_bin}}'
    fi
    echo "=== Comparing Short ==="
    if command -v fastfetch > /dev/null; then
        hyperfine --warmup 3 --runs 10 '{{retch_release_bin}} --short' 'fastfetch -c none'
    else
        hyperfine --warmup 3 --runs 10 '{{retch_release_bin}} --short'
    fi
    echo "=== Comparing Long ==="
    if command -v fastfetch > /dev/null; then
        hyperfine --warmup 3 --runs 10 '{{retch_release_bin}} --long' 'fastfetch -c all'
    else
        hyperfine --warmup 3 --runs 10 '{{retch_release_bin}} --long'
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

# Dry-run publish check for both crates (no upload).
#
# The retch-cli dry run can only succeed once the retch-sysinfo version it pins
# (`retch-sysinfo = "=0.1.x"`) is actually on the crates.io index — a dry run never
# uploads, so the pin is unresolvable until the real `just publish` has pushed sysinfo.
# That is expected on every release and is NOT a failure, so this recipe checks the index
# first and skips the cli leg with an explanation rather than dying on a confusing
# "failed to select a version" error.
publish-check:
    #!/usr/bin/env bash
    set -euo pipefail
    SYSINFO_VER=$(grep -m1 '^version' crates/sysinfo/Cargo.toml | cut -d '"' -f2)

    # A CLI-only release leaves retch-sysinfo untouched, in which case its version is
    # already on the index and any publish attempt is a no-op error.
    if python3 scripts/crates_io_has_version.py retch-sysinfo "$SYSINFO_VER" >/dev/null 2>&1; then
        echo "==> retch-sysinfo $SYSINFO_VER is already published — nothing to do for it"
    else
        echo "==> retch-sysinfo dry run"
        cargo publish --dry-run --manifest-path crates/sysinfo/Cargo.toml
    fi

    PINNED=$(grep -oE 'retch-sysinfo = \{[^}]*version = "=?[0-9.]+"' Cargo.toml \
             | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    if [ -z "$PINNED" ]; then
        echo "Error: could not read the retch-sysinfo version pin from Cargo.toml" >&2
        exit 1
    fi

    if python3 scripts/crates_io_has_version.py retch-sysinfo "$PINNED" >/dev/null 2>&1; then
        echo "==> retch-cli dry run"
        cargo publish --dry-run --manifest-path Cargo.toml
    else
        echo
        echo "SKIPPED: retch-cli dry run."
        echo "  retch-sysinfo $PINNED is not on crates.io yet, so the '=$PINNED' pin"
        echo "  cannot resolve and the dry run would fail for that reason alone."
        echo "  This is expected before a release. 'just publish' publishes sysinfo"
        echo "  first, after which the cli leg resolves normally."
    fi

# Publish both crates to crates.io (sysinfo first, then CLI).
#
# retch-sysinfo is skipped when its current version is already on the index — a CLI-only
# release (no library change) is the common case, and re-publishing an existing version is
# an error rather than a no-op. cargo waits for the index after the sysinfo upload, so the
# cli leg's `=0.1.x` pin resolves on the same run.
publish:
    #!/usr/bin/env bash
    set -euo pipefail
    SYSINFO_VER=$(grep -m1 '^version' crates/sysinfo/Cargo.toml | cut -d '"' -f2)
    if python3 scripts/crates_io_has_version.py retch-sysinfo "$SYSINFO_VER" >/dev/null 2>&1; then
        echo "==> retch-sysinfo $SYSINFO_VER already published — skipping (CLI-only release)"
    else
        echo "==> publishing retch-sysinfo $SYSINFO_VER"
        cargo publish --manifest-path crates/sysinfo/Cargo.toml
    fi
    echo "==> publishing retch-cli"
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

# Merge the active PR, switch to main, pull, delete the branch, and update WIP.md (requires gh)
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
    python3 scripts/update_wip.py

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
    cargo check --workspace -q 2>&1
    LOCK_DIRTY=$(git diff --name-only Cargo.lock)
    [ -n "$LOCK_DIRTY" ] && fail "Cargo.lock was updated but not committed — stage and commit it first"
    pass "Cargo.lock is current and committed"

    # 6. fmt + clippy
    info "Running just check..."
    just check
    pass "fmt + clippy passed"

    # 7. Tests
    info "Running cargo test..."
    cargo test --workspace -q 2>&1
    pass "All tests passed"

    # 8. Security audit (advisory — surfaces RustSec advisories locally before CI,
    #    but does NOT block: advisories can be newly published against unchanged
    #    transitive deps, which shouldn't hard-fail otherwise-ready work).
    info "Running cargo audit..."
    if ! command -v cargo-audit >/dev/null 2>&1; then
        info "cargo-audit not installed — installing (cargo install cargo-audit)..."
        cargo install cargo-audit || info "cargo-audit install failed — skipping audit this run"
    fi
    if command -v cargo-audit >/dev/null 2>&1; then
        if cargo audit; then
            pass "cargo audit: no advisories"
        else
            info "cargo audit reported advisories (above) — advisory only, NOT blocking the gate"
        fi
    fi

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

