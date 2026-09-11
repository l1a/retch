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

# List available recipes
default:
    @just --list

# Do NOT edit inside the markers below. Edit templates/justfile-common.just and the two
# vendored helpers, bump their versions, and propagate to the sibling repos in their own PRs.
# `just standard-check` runs the helpers' self-tests and `just check` depends on it, so a
# violation fails the build rather than being discovered years later.
# >>> COMMON (template v3)
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
    @"{{PY}}" scripts/install_completions.py --self-test
    @"{{PY}}" scripts/install_man.py --self-test
    @"{{PY}}" scripts/gate_conformance.py --self-test
    @"{{PY}}" scripts/gate_conformance.py "{{justfile()}}"
# <<< COMMON

# ===== PROJECT-SPECIFIC — everything below is this repo's own =====

set positional-arguments := true

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

# The renderer is the single implementation behind all three packaging targets, so its
# self-test is a `check` dependency like theirs. It is the piece that must refuse: a
# substitution matching nothing, a sentinel surviving, a placeholder checksum.
#
# Verify scripts/render_packaging.py still renders and still refuses (offline)
render-check:
    @{{PY}} scripts/render_packaging.py --self-test

# Run strict checks (formatting and linting) as done in CI
check: standard-check render-check aur-check copr-check brew-check
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

    # REFUSE UNLESS HEAD IS THE TAG FOR THE VERSION ABOUT TO BE UPLOADED.
    #
    # `cargo publish` uploads whatever the worktree says, and a crates.io version can be
    # yanked but never deleted. On 2026-09-11 this was one command away from putting
    # `retch-cli 0.17.4` on the index -- a version with no tag, no GitHub release, and
    # disagreeing with all three distro channels -- because the post-release packaging PR
    # had opened the next version on `main`. That PR no longer exists (see RELEASING
    # below), so `main` now sits AT the released version; this guard is what makes that a
    # checked property rather than a habit. Override deliberately with PUBLISH_ANY_REF=1,
    # which is for a genuine exception, not for getting past a surprise.
    CARGO_VER=$(grep -m1 '^version' Cargo.toml | cut -d '"' -f2)
    if [ "${PUBLISH_ANY_REF:-}" != "1" ]; then
        HEAD_SHA=$(git rev-parse HEAD)
        TAG_SHA=$(git rev-parse -q --verify "refs/tags/v${CARGO_VER}^{commit}" || true)
        if [ -z "$TAG_SHA" ]; then
            echo "error: Cargo.toml is $CARGO_VER but there is no tag v$CARGO_VER in this clone." >&2
            echo "       Tag and push the release first (git fetch --tags if it was tagged elsewhere)." >&2
            exit 1
        fi
        if [ "$HEAD_SHA" != "$TAG_SHA" ]; then
            echo "error: HEAD is not v$CARGO_VER." >&2
            echo "       HEAD      $HEAD_SHA" >&2
            echo "       v$CARGO_VER  $TAG_SHA" >&2
            echo "       Publishing here would upload source that is not what the tag names." >&2
            exit 1
        fi
        echo "==> HEAD is v$CARGO_VER ($HEAD_SHA)"
    else
        echo "==> PUBLISH_ANY_REF=1: skipping the HEAD-is-the-tag check"
    fi

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

# ===== AUR =====
#
# Before these existed, packaging/aur/PKGBUILD was a "reference copy" that nothing
# rendered, nothing published and nothing checked. It sat at 0.6.12 while the published AUR
# package reached 0.6.23 — eleven releases of drift — and every bump was hand-typed on
# whichever machine did the release, with .SRCINFO hand-edited to match. That is how the
# live AUR PKGBUILD kept two man-page defects long after they were fixed here.
#
# The fix is that packaging/aur is now the SOURCE, not a copy: `aur-bump` renders it,
# `aur-check` proves the pair agrees on every `just check`, and `aur-publish` pushes exactly
# those files. Nothing is hand-edited.
#
# Adapted from rusticprofile's equivalents, which carry the same lessons; the shapes are
# kept close deliberately so the three repos stay comparable.

# The checker's own self-test runs first. It deliberately does NOT live in `standard-check`:
# that block is vendored byte-identically across retch, rusticprofile and etr, and retch is
# the only one of the three whose AUR pair is tracked in-repo.
#
# Verify packaging/aur/PKGBUILD is still a template recording no version (offline)
aur-check:
    @{{PY}} scripts/aur_check.py --self-test
    @{{PY}} scripts/aur_check.py

# Generate .SRCINFO next to a RENDERED PKGBUILD in DIR (never edit it by hand)
#
# DIR is a directory holding a rendered PKGBUILD -- `just aur-publish` makes one in a temp
# dir and calls this. It is not the repo: `packaging/aur/PKGBUILD` is a template whose
# pkgver is `@VERSION@`, which makepkg refuses outright, so there is nothing there to
# generate a .SRCINFO from and nothing committed for one to drift against.
#
# Render the AUR pair for a released tag into DIR: PKGBUILD + generated .SRCINFO
#
# Shared by `aur-publish` (which pushes DIR) and `aur-local` (which builds it), so the
# download, the checksum computation, the render and the pair check exist once. The checksum
# is always COMPUTED from the tarball just downloaded -- never read from a committed field,
# which is the staleness this whole arrangement replaced.
aur-render VERSION DIR:
    #!/usr/bin/env bash
    set -euo pipefail
    GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
    pass() { echo -e "${GREEN}[✓]${NC} $1"; }
    fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
    info() { echo -e "${YELLOW}[→]${NC} $1"; }

    V="{{VERSION}}"; V="${V#v}"
    DIR="{{DIR}}"
    [ -n "$V" ] || fail "aur-render needs a version"

    # The tag must exist: the PKGBUILD builds from the release tarball, so rendering for an
    # unreleased version would produce a package nobody can build.
    URL="https://github.com/l1a/retch/archive/refs/tags/v${V}.tar.gz"
    mkdir -p "$DIR"
    info "Downloading and checksumming the v$V tarball..."
    curl -sfL -o "$DIR/src.tar.gz" "$URL" \
        || fail "no release tarball at $URL — tag and release v$V first"
    SHA=$(sha256sum "$DIR/src.tar.gz" | cut -d' ' -f1)
    pass "v$V tarball: $(wc -c < "$DIR/src.tar.gz" | tr -d ' ') bytes, sha256 $SHA"
    rm -f "$DIR/src.tar.gz"

    {{PY}} scripts/render_packaging.py --target aur --version "$V" --sha256 "$SHA" \
        --out "$DIR/PKGBUILD"
    # Generates .SRCINFO from the rendered PKGBUILD with a real makepkg, then compares the
    # pair field by field -- a pair can agree on the version and disagree on the checksum,
    # which is the shape that breaks on the user's machine and nowhere else.
    just aur-srcinfo "$DIR"
    pass "rendered PKGBUILD + .SRCINFO for v$V in $DIR"

# Build and install the AUR package locally, without the AUR (needs makepkg, so Arch only)
#
# This is the path README and the wiki document for when the AUR itself cannot be used. It
# used to be `cd packaging/aur && makepkg -si`, which stopped working when that file became
# a template -- makepkg refuses `@VERSION@`. Rendering into a temp directory keeps the path
# working and keeps it honest: it builds the last RELEASED tag's tarball, which is exactly
# what installing from the AUR would build.
aur-local VERSION="":
    #!/usr/bin/env bash
    set -euo pipefail
    RED='\033[0;31m'; NC='\033[0m'
    fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
    command -v makepkg >/dev/null || fail "makepkg not found — this recipe only works on Arch"
    V="{{VERSION}}"; V="${V#v}"
    if [ -z "$V" ]; then
        V=$(git describe --tags --abbrev=0 2>/dev/null || true); V="${V#v}"
        [ -n "$V" ] || fail "no tags in this clone; pass a version: just aur-local 0.17.5"
        echo "using the last released tag: v$V"
    fi
    WORK=$(mktemp -d)
    trap 'rm -rf "$WORK"' EXIT
    just aur-render "$V" "$WORK/pkg"
    cd "$WORK/pkg"
    makepkg -si

# Generate .SRCINFO beside a rendered PKGBUILD in DIR (requires podman)
aur-srcinfo DIR:
    #!/usr/bin/env bash
    set -euo pipefail
    RED='\033[0;31m'; NC='\033[0m'
    fail() { echo -e "${RED}[✗]${NC} $1" >&2; exit 1; }

    # .SRCINFO is pure derived data and the AUR rejects a pair that disagrees, so it is
    # generated by the real `makepkg --printsrcinfo` rather than written by hand. No host in
    # this fleet runs Arch, hence the container.
    command -v podman >/dev/null || fail "podman is required (or edit this recipe for docker)"

    DIR="{{DIR}}"
    [ -f "$DIR/PKGBUILD" ] || fail "$DIR/PKGBUILD does not exist -- render it first"
    grep -q '@VERSION@' "$DIR/PKGBUILD" \
        && fail "$DIR/PKGBUILD is still a template -- render it with scripts/render_packaging.py"
    OUT="$DIR/.SRCINFO"

    # Generated to a temp file and moved into place, NEVER redirected at the real file: a
    # shell redirect truncates before the command runs, so a missing image or no network
    # would destroy the committed file rather than leave it alone. rusticprofile measured
    # exactly that on a host without podman — 503 bytes to 0.
    # mktemp in the DESTINATION directory, never in /tmp. A temp file created under /tmp
    # gets `user_tmp_t`, and /tmp is tmpfs here so the `mv` below is a cross-filesystem
    # copy that carries that label to the destination. This repo lives under a Syncthing
    # folder whose container runs as `container_t` and cannot read `user_tmp_t`, so the
    # moved-in file wedges the whole folder with `hashing: ... permission denied` while
    # its Unix permissions look perfectly normal. Same blast radius as the `:Z` note
    # below, reached by a different route; see ~/AGENTS.md. Creating the temp file here
    # instead inherits the directory's context by type transition, and makes the `mv` a
    # same-filesystem rename that cannot relabel anything.
    TMP="$(mktemp "$(dirname "$OUT")/.SRCINFO.XXXXXX")"
    trap 'rm -f "$TMP"' EXIT

    # `z`, never `Z`. Uppercase assigns a fresh private MCS category pair per run, which
    # permanently relabels this directory to categories no other container holds — and this
    # repo lives under a Syncthing folder whose own container then cannot scan it. See the
    # `:Z` incident in ~/AGENTS.md.
    podman run --rm -v "$DIR:/pkg:ro,z" archlinux:base-devel bash -c '
        useradd -m builder; mkdir -p /home/builder/b && cp /pkg/PKGBUILD /home/builder/b/
        chown -R builder /home/builder/b; cd /home/builder/b
        su builder -c "makepkg --printsrcinfo"' > "$TMP"

    # `makepkg --printsrcinfo` can exit 0 having printed nothing useful, so the CONTENT is
    # checked rather than the exit code: every .SRCINFO begins with a `pkgbase` line.
    [ -s "$TMP" ] || fail ".SRCINFO came back empty — $OUT left untouched"
    grep -q '^pkgbase = ' "$TMP" || fail "output has no 'pkgbase =' line — $OUT left untouched"

    # mktemp makes the file 0600; the pushed file must match its PKGBUILD sibling.
    chmod 0644 "$TMP"
    mv "$TMP" "$OUT"
    trap - EXIT
    echo "$OUT generated"
    # The pair check, on the bytes that are about to be pushed rather than on a committed
    # copy of them. This is the same field-by-field comparison `just check` used to run
    # against the repo; it did not get weaker, it moved to where it can act on the real thing.
    {{PY}} scripts/aur_check.py --dir "$DIR"

#
# Takes the version because nothing in the repo records one any more: the PKGBUILD is a
# template, and this is the moment the released version and its checksum come into
# existence. The checksum is COMPUTED here from the tarball that was actually downloaded --
# never copied from a committed field, which is the class of staleness this replaced.
#
# Render packaging/aur for a released tag and push it to the AUR
aur-publish VERSION:
    #!/usr/bin/env bash
    set -euo pipefail
    BOLD='\033[1m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
    pass() { echo -e "${GREEN}[✓]${NC} $1"; }
    fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
    info() { echo -e "${YELLOW}[→]${NC} $1"; }

    PKGVER="{{VERSION}}"; PKGVER="${PKGVER#v}"
    [ -n "$PKGVER" ] || fail "aur-publish needs a version, e.g. just aur-publish 0.17.5"

    WORK=$(mktemp -d)
    trap 'rm -rf "$WORK"' EXIT
    just aur-render "$PKGVER" "$WORK/pkg"
    DIR="$WORK/pkg"

    # The AUR takes maintenance windows, during which SSH authenticates and then refuses.
    # Saying so plainly beats a confusing git failure.
    info "Checking the AUR is reachable..."
    OUT=$(ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new aur@aur.archlinux.org help 2>&1 || true)
    if echo "$OUT" | grep -qi 'maintenance'; then
        fail "the AUR is in a maintenance window — it said: $(echo "$OUT" | head -1)"
    fi
    echo "$OUT" | grep -qi 'Permission denied' \
        && fail "the AUR refused this SSH key; register it at https://aur.archlinux.org/account/"
    pass "AUR reachable and the SSH key is accepted"

    echo
    echo -e "${BOLD}About to publish retch $PKGVER to the AUR.${NC}"
    echo "This is public and immediate."
    echo ""
    # Same three-way answer as the pre-PR gate: an env var for non-interactive callers, a
    # terminal for humans, piped input otherwise — and never a block that hangs forever.
    if [ -n "${AUR_CONFIRM:-}" ]; then
        CONFIRM="$AUR_CONFIRM"
        echo "Publish to the AUR? [y/N] $CONFIRM   (answered by AUR_CONFIRM)"
    elif [ -t 0 ]; then
        echo -n "Publish to the AUR? [y/N] "; read -r CONFIRM
    else
        echo -n "Publish to the AUR? [y/N] "
        read -r -t 10 CONFIRM || CONFIRM=""
        echo "$CONFIRM"
        [ -n "$CONFIRM" ] || fail "no terminal and nothing on stdin. Re-run with AUR_CONFIRM=y"
    fi
    [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ] || { echo -e "${RED}Aborted.${NC}"; exit 1; }

    # Cloned INSIDE $WORK rather than into a second mktemp dir: a second `trap ... EXIT`
    # replaces the first, so the earlier one would stop cleaning up the rendered files and
    # the downloaded tarball.
    git clone "ssh://aur@aur.archlinux.org/retch.git" "$WORK/aur" 2>&1 | tail -2
    cp "$DIR/PKGBUILD" "$DIR/.SRCINFO" "$WORK/aur/"
    cd "$WORK/aur"
    if [ -z "$(git status --porcelain)" ]; then
        pass "the AUR already matches these files — nothing to push"
        exit 0
    fi
    git add PKGBUILD .SRCINFO
    git -c user.name="$(git -C {{justfile_directory()}} config user.name)" \
        -c user.email="$(git -C {{justfile_directory()}} config user.email)" \
        commit -q -m "retch $PKGVER"
    git push origin master 2>&1 | tail -3
    pass "published retch $PKGVER to the AUR"
    echo "  https://aur.archlinux.org/packages/retch"

# ===== COPR =====
#
# packaging/copr/retch.spec is the AUR PKGBUILD's construct with the AUR PKGBUILD's exposure:
# its `Version:` tracks the last RELEASED tag (Source0 is a tag tarball that must exist), so
# it is bumped by a human, at release time, in a separate commit, with nothing checking the
# result. That is precisely how the PKGBUILD reached ELEVEN releases of drift while CI stayed
# green. These recipes are v0.7.1's answer applied to COPR before the drift rather than after.
#
# There is deliberately NO `copr-publish`. .github/workflows/copr.yml already rebuilds the
# package when the packaging commit lands on main, so a manual publish recipe would either
# duplicate that build or race it. The bump is the manual step; the rebuild is not.

# The checker's own self-test runs first, and for the same reason `aur-check` does not live in
# `standard-check`: that block is vendored byte-identically across retch, rusticprofile and
# etr, and retch is the only one of the three with a COPR target at all.
#
# Verify packaging/copr/retch.spec is still a template recording no version (offline)
copr-check:
    @{{PY}} scripts/copr_check.py --self-test
    @{{PY}} scripts/copr_check.py

#
# There is no `copr-bump`, because there is nothing to bump: the spec's Version: is
# `@VERSION@` and .copr/Makefile renders it from Cargo.toml when COPR builds the SRPM. This
# recipe exists so a human can see what COPR will be handed without running rpmbuild.
#
# Render the spec as .copr/Makefile will and print it (no network, no rpm tooling)
copr-render:
    @{{PY}} scripts/render_packaging.py --target copr

# ===== HOMEBREW =====
#
# packaging/homebrew/retch.rb is the SOURCE, not a reference copy. brew-bump renders it,
# brew-check guards it, brew-publish pushes exactly that file to the tap. The AUR pair was
# an inert reference copy for eleven releases (see scripts/brew_check.py); this does not
# repeat that.

# Verify the Homebrew formula is still a template recording no version (offline)
brew-check:
    @{{PY}} scripts/brew_check.py --self-test
    @{{PY}} scripts/brew_check.py

#
# Takes the version for the same reason `aur-publish` does: the formula is a template, and
# this is the moment the released version and its checksum come into existence. There is no
# `brew-bump` any more -- nothing in the repo holds a value to bump.
#
# Render the formula for a released tag and push it to the tap at l1a/homebrew-retch
brew-publish VERSION:
    #!/usr/bin/env bash
    set -euo pipefail
    BOLD='\033[1m'; GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
    pass() { echo -e "${GREEN}[✓]${NC} $1"; }
    fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
    info() { echo -e "${YELLOW}[→]${NC} $1"; }

    TAP_REPO="git@github.com:l1a/homebrew-retch.git"
    VER="{{VERSION}}"; VER="${VER#v}"
    [ -n "$VER" ] || fail "brew-publish needs a version, e.g. just brew-publish 0.17.5"

    {{PY}} scripts/brew_check.py || fail "packaging/homebrew/retch.rb is not a valid template"
    pass "formula template is valid"

    # The checksum is COMPUTED from the tarball that will actually be downloaded, never
    # copied from a committed field. Written to a file rather than piped, so the byte count
    # is inspectable if the hash ever looks wrong.
    WORK=$(mktemp -d)
    trap 'rm -rf "$WORK"' EXIT
    URL="https://github.com/l1a/retch/archive/refs/tags/v${VER}.tar.gz"
    info "Downloading and checksumming the v$VER tarball..."
    curl -sfL -o "$WORK/src.tar.gz" "$URL" \
        || fail "no release tarball at $URL — tag and release v$VER first"
    SHA=$({{PY}} -c "import hashlib,sys;print(hashlib.sha256(open(sys.argv[1],'rb').read()).hexdigest())" "$WORK/src.tar.gz")
    pass "v$VER tarball: $(wc -c < "$WORK/src.tar.gz" | tr -d ' ') bytes, sha256 $SHA"

    {{PY}} scripts/render_packaging.py --target brew --version "$VER" --sha256 "$SHA" \
        --out "$WORK/retch.rb"
    FORMULA="$WORK/retch.rb"
    pass "rendered formula for v$VER"

    echo
    echo -e "${BOLD}About to publish retch $VER to the Homebrew tap.${NC}"
    echo "This is public and immediate: $TAP_REPO"
    echo ""
    # Takes its answer from BREW_CONFIRM, an interactive stdin, or piped input under a
    # bound -- mirroring aur-publish, and for the v0.6.21 reason: a bare `read` can only be
    # answered by a human at a terminal, so a script or agent either blocks on a stdin that
    # will never answer or dies without saying why, and that failure reads as the gate
    # REFUSING the publish rather than as a question nobody could hear. This widens who can
    # answer, not what counts as an answer: every path still requires an explicit "yes".
    if [ -n "${BREW_CONFIRM:-}" ]; then
        CONFIRM="$BREW_CONFIRM"
        echo "Type 'yes' to continue: $CONFIRM   (answered by BREW_CONFIRM)"
    elif [ -t 0 ]; then
        echo -n "Type 'yes' to continue: "; read -r CONFIRM
    else
        read -r -t 10 CONFIRM || CONFIRM=""
        echo "$CONFIRM"
        [ -n "$CONFIRM" ] || fail "no terminal and nothing on stdin. Re-run with BREW_CONFIRM=yes"
    fi
    [ "$CONFIRM" = "yes" ] || { echo -e "${RED}Aborted.${NC}"; exit 1; }

    # Cloned fresh each time rather than kept as a working copy: a long-lived clone is how
    # the aur-retch checkout drifted eleven releases out of date. Inside the $WORK created
    # above, because a second `trap ... EXIT` would replace the first and leave the rendered
    # formula and the downloaded tarball behind.
    info "Cloning the tap..."
    git clone -q "$TAP_REPO" "$WORK/tap" || fail "could not clone $TAP_REPO — does the tap exist, and is the SSH key registered?"
    mkdir -p "$WORK/tap/Formula"
    cp "$FORMULA" "$WORK/tap/Formula/retch.rb"

    # A brand-new tap has no commits and therefore no branch, and which name git invents
    # depends on the host's `init.defaultBranch` -- unset on at least one machine in this
    # fleet, which would make the tap's default branch differ per publisher. Pin it, but
    # ONLY when the repo is genuinely empty: doing this unconditionally would move HEAD on
    # a populated tap without touching the index, which is a quiet way to lose work.
    if ! git -C "$WORK/tap" rev-parse --verify -q HEAD >/dev/null 2>&1; then
        git -C "$WORK/tap" symbolic-ref HEAD refs/heads/main
        info "empty tap: default branch pinned to main"
    fi

    # A fresh clone does not inherit this repo's commit identity, and GitHub rejects a push
    # authored with a private email (hit on the wiki clone, 2026-08-11).
    git -C "$WORK/tap" config user.name  "$(git -C "{{justfile_directory()}}" config user.name)"
    git -C "$WORK/tap" config user.email "$(git -C "{{justfile_directory()}}" config user.email)"

    # Stage FIRST, then ask the index whether anything changed.
    #
    # `git diff --quiet -- <path>` compares the worktree to the index and **does not see
    # untracked files**, so on a brand-new empty tap it reports "no changes" and this would
    # skip the push entirely -- exiting 0 having published nothing, which is the worst
    # available outcome. `--cached` compares the index to HEAD (or to the empty tree when
    # there is no HEAD, as in an empty repo), which is the question actually being asked.
    git -C "$WORK/tap" add Formula/retch.rb
    if git -C "$WORK/tap" diff --cached --quiet; then
        pass "tap already has this exact formula — nothing to push"
        exit 0
    fi
    git -C "$WORK/tap" commit -q -m "retch $VER"
    # -u so an empty tap gets its default branch set by this first push.
    git -C "$WORK/tap" push -q -u origin HEAD
    pass "pushed retch $VER to $TAP_REPO"
    echo "Verify: brew tap l1a/retch && brew install retch"

# ===== RELEASING =====
#
# A release needs NO VERSION BUMP, and that is the point of the shape below.
#
# WHAT USED TO HAPPEN, AND WHY
# ----------------------------
# Three packaging targets recorded the released version in-repo, two of them with the
# tarball's sha256. A checksum cannot be computed before its tag exists, so every release
# ended with a post-tag commit -- and because that commit had to be a reviewed PR, and
# `just pr` refuses a Cargo.toml equal to the last tag, it also had to OPEN THE NEXT
# VERSION. So a release forced a bump, `main` then named a version that was never released,
# and `just publish` on `main` came one command away from putting an unreleased
# `retch-cli 0.17.4` on crates.io while every other channel served 0.17.3.
#
# `scripts/render_packaging.py` supplies the version and checksum at publish time instead.
# Nothing records them, so there is no post-tag commit, no `post-release` recipe, no
# `aur-bump`/`copr-bump`/`brew-bump`, and no bump forced on a release. `main` sits AT the
# released version until the next feature PR bumps it, which is what makes `just publish`
# safe to run from `main` -- and the guard in `publish` enforces that rather than trusting it.
#
# THE SEQUENCE
# ------------
#   1. main is green and Cargo.toml says X (bumped by whichever PR landed last)
#   2. git tag -a vX -m '...' --cleanup=verbatim && git push origin vX
#        -> the release workflow builds the GitHub Release
#        -> .github/workflows/copr.yml rebuilds COPR from the tag
#   3. just publish              # crates.io; refuses unless HEAD is the tag for X
#   4. just aur-publish X        # renders + pushes to the AUR      (needs podman)
#      just brew-publish X       # renders + pushes to the tap
#
# There is no step that edits a file, and therefore nothing to commit afterwards. Steps 3
# and 4 still ask before acting: they are public and irreversible.

# Merge the active PR, switch to main, pull, delete the branch, and update WIP.md (requires gh)
merge-pr:
    #!/usr/bin/env bash
    set -euo pipefail
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$BRANCH" = "main" ]; then
        echo "Error: You are already on main."
        exit 1
    fi
    # Refuse to merge over a failing check.
    #
    # `gh pr merge` happily merges a red PR when the repository has no branch protection, and
    # "wait for the checks to settle" is not "wait for them to pass". rusticprofile added this
    # after PR #19 went in with a leg red; retch never had it, so every merge here has been
    # ungated -- safe only because whoever merged happened to look first.
    echo "Checking CI on this branch..."
    STATES=$(gh pr view --json statusCheckRollup         --jq '[.statusCheckRollup[]? | select(.conclusion != "SKIPPED") | .conclusion]' 2>/dev/null || echo '[]')

    # NO checks at all is not "green", and the arm below cannot tell the difference: an empty
    # rollup matches neither "" nor FAILURE, so without this the recipe prints "CI is green."
    # and merges a commit CI has never seen. That is not hypothetical -- it happened in
    # rusticprofile on 2026-08-06, when GitHub stopped creating runs for pushed commits.
    #
    # Compared as a string rather than piped through `jq -e length`: `gh --jq` is gh's BUILT-IN
    # jq, but an external `jq` is not on a default Windows PATH, and a gate that silently
    # degrades where its dependency is missing is the thing being fixed, not a way to fix it.
    if [ "$(printf '%s' "$STATES" | tr -d '[:space:]')" = "[]" ]; then
        echo "Error: no checks have reported for this commit at all."
        echo "       That is not the same as passing. GitHub sometimes fails to create a run;"
        echo "       force one with: gh workflow run rust.yml --ref $BRANCH"
        exit 1
    fi

    if echo "$STATES" | grep -q '""'; then
        echo "Error: checks are still running. Wait for them, or merge deliberately with gh."
        exit 1
    fi

    if echo "$STATES" | grep -qE 'FAILURE|TIMED_OUT|CANCELLED|ACTION_REQUIRED'; then
        echo "Error: CI is not green on this branch:"
        gh pr view --json statusCheckRollup             --jq '.statusCheckRollup[]? | select(.conclusion != "SKIPPED" and .conclusion != "SUCCESS") | "  \(.conclusion)  \(.name)"'
        echo "Fix it, or merge deliberately with gh if you have a reason."
        exit 1
    fi
    echo "CI is green."

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
    # A bare `read` makes this gate unanswerable by anything that is not a human at a
    # terminal: a script, CI job or agent either blocks on a stdin that will never answer or
    # dies without saying why -- and that failure reads as the gate refusing the change rather
    # than asking a question nobody could hear. Three sources of an answer, in order:
    #
    #   1. PR_CONFIRM in the environment -- the explicit answer for a non-interactive caller.
    #      It is NOT a bypass: setting it is the same act of confirmation as typing y, just
    #      recorded where a script can supply it. Answer it AFTER checking each item.
    #   2. An interactive stdin -- a human, prompted exactly as before.
    #   3. Neither, so read whatever was piped in, bounded by a timeout. `echo y | just pr`
    #      keeps working, and a stdin that never answers costs ten seconds rather than hanging.
    #
    # The failure names PR_CONFIRM, because a gate that cannot be satisfied from the context it
    # failed in is a wall rather than a gate.
    if [ -n "${PR_CONFIRM:-}" ]; then
        CONFIRM="$PR_CONFIRM"
        echo "All manual items confirmed? [y/N] $CONFIRM   (answered by PR_CONFIRM)"
    elif [ -t 0 ]; then
        echo -n "All manual items confirmed? [y/N] "
        read -r CONFIRM
    else
        echo -n "All manual items confirmed? [y/N] "
        read -r -t 10 CONFIRM || CONFIRM=""
        echo "$CONFIRM"
        [ -n "$CONFIRM" ] || { echo -e "${RED}Aborted.${NC} No terminal to confirm the checklist on, and nothing on stdin. Re-run with PR_CONFIRM=y once each item above is actually checked."; exit 1; }
    fi
    [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ] \
        || { echo -e "${RED}Aborted.${NC} Complete the checklist first."; exit 1; }

    echo -e "\n${GREEN}Gate passed. You may now run: gh pr create${NC}\n"

# Run the full pre-PR checklist (`just pr`), then `gh pr create`. Always use this instead
# of calling `gh pr create` directly — `gh` has no hook of its own to gate it otherwise.
open-pr *ARGS:
    #!/usr/bin/env bash
    set -euo pipefail
    just pr

    # Push the branch if it has no upstream yet. Without this, on a never-pushed branch
    # `gh pr create` has no remote branch to open a PR from and fails non-interactively --
    # AFTER the gate has printed "Gate passed", which reads as the gate refusing a change it
    # had just approved.
    #
    # Deliberately ONLY when there is no upstream. Pushing unconditionally would make this
    # recipe silently publish existing commits on a branch that already has one -- a different
    # and more surprising act than "put this branch where gh can see it".
    if ! git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' >/dev/null 2>&1; then
        BRANCH="$(git rev-parse --abbrev-ref HEAD)"
        [ "$BRANCH" != HEAD ] || { echo "detached HEAD -- check out a branch first" >&2; exit 1; }
        echo "no upstream for $BRANCH -- pushing it so gh has a remote branch to open from"
        # pre-push runs `just check`, so this cannot publish a branch the gate would refuse.
        git push -u origin "$BRANCH"
    fi
    gh pr create "$@"

# Generate a flamegraph for execution profiling (requires perf on Linux or dtrace on macOS)
flamegraph *ARGS="":
    @command -v cargo-flamegraph >/dev/null || (echo "Installing cargo-flamegraph..." && cargo install flamegraph)
    @if [ "$(uname)" = "Linux" ] && ! command -v perf >/dev/null; then \
        echo "Error: 'perf' is not installed. Please install 'perf' (e.g., 'sudo dnf install perf' on Fedora)"; \
        exit 1; \
    fi
    cargo flamegraph --profile profiling -- {{ARGS}}

