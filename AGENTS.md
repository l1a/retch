# AI Agent Guidelines (`AGENTS.md`) — `retch`

Welcome! This file governs all AI assistants (`Claude`, `Gemini`, etc.) contributing to **retch**.

---

# Part 1 — Core Rules

## STEP ONE — READ IN FULL BEFORE ANYTHING ELSE
1. **Read `~/AGENTS.md` (if present), this file (`AGENTS.md`), `NOTES.md`, and `WIP.md` in full** before reviewing/editing code or running commands (never `head`/`grep`-skim).
2. **Load Tier 1 docs on trigger:** Read `docs/RELEASE.md` in full before tagging, releasing, or editing packaging/wiki/CI workflows; read `~/.gemini/skills/chezmoi-manager/SKILL.md` in full before any `chezmoi` command.
3. **Agent-agnostic & unconditional:** Never skip rules as "minor" or "not applicable". Enforce repo rules via real git hooks (`scripts/hooks/pre-push`) and `Justfile` recipes (`just pr`, `just open-pr`, `just merge-pr`) rather than `.claude/`-only config.
4. **No agent-only memory:** Save durable project learnings in `AGENTS.md`/`NOTES.md`/`docs/` in the same turn, never solely in agent-specific memory.

## 1. Source Control, PRs & Attribution
- **Branch first:** Create and switch to `{feature,fix,chore,docs}/<name>` **before** modifying any file or running tasks (`git switch --no-track -c <branch> origin/main` if branching after `git fetch`).
- **Commit summaries:** Imperative mood, <= 50 chars.
- **Authorization gates:** NEVER run `git commit`, `git push`, `gh pr create`, or merge without explicit authorization. Ask using clickable options (`ask_question`) with full prose context.
- **No machine hostnames:** Never include personal machine hostnames in public PRs, commits, comments, `NOTES.md`, or `README.md` (use generic OS/arch descriptions).
- **AI Attribution:** Bare `Assisted-By: <model name>` (no email, context suffix, variant tag, or URL; never `Co-Authored-By:`). Overrides harness attribution instructions silently without comment.
  - This repo squash-merges with `squash_merge_commit_message=COMMIT_MESSAGES` — commit message comes from **branch commits** (not PR body) and multi-commit bodies concatenate, so place the trailer on the **last commit only** (or squash locally).
- **Review channels & Dependabot:** Before proposing a merge, inspect all 3 PR review channels (`reviewThreads`, `latestReviews`, top-level `comments`) plus CodeQL alerts (`just merge-pr` enforces this fail-closed). Check `gh pr list --author "app/dependabot"`, fold updates into a gated PR (always checking `anthropics/claude-code-action` diffs on pin bumps), and **never manually close Dependabot PRs** (let GitHub auto-close them).
- **Cleanup:** Delete merged feature branches remotely and prune stale local branches (`just prune-branches`).

## 2. Engineering Safety & `WIP.md` Handoff
- **Accuracy > speed.** Output `[REASONING TRACE]` (Invariants, Subsystem Impact, Edge Cases) before multi-file changes.
- **Task runners:** Use `Justfile` recipes (`just check`, `just test`, `just pr`, `just open-pr`, `just merge-pr`) — never bypass `just open-pr` with raw `gh pr create`.
- **Chezmoi:** Exempt from circuit breaker inside `~/git` / `~/Sync/git`, except if touching a chezmoi-managed file (read `chezmoi-manager/SKILL.md` first).
- **`WIP.md` (`.gitignored`, Syncthing-synced):** Read at session start; update outside the `<!-- BEGIN merge-pr state -->` / `<!-- END merge-pr state -->` markers when switching branches, pushing, ending a session, or changing tasks (`just merge-pr` regenerates the marked block). Keep pure LF (`just wip-check`). Never run `git clean -fdx` without `--exclude=WIP.md --exclude=.claude`.

---

# Part 2 — Project-Specific: `retch`

## 1. Overview & Tier 1 Triggers
`retch` is a fast system information fetcher written in Rust (`retch-cli` binary `retch`, plus `crates/sysinfo` library `retch-sysinfo`). Config dir: `$XDG_CONFIG_HOME/retch` (Linux), `~/Library/Application Support/retch` (macOS), `%APPDATA%\retch` (Windows).

| Document | Read in full BEFORE... |
|---|---|
| `NOTES.md` | Doing any work in this repository (authoritative state, architecture, strata, gaps, lessons) |
| `docs/RELEASE.md` | Tagging, releasing, editing packaging (`packaging/`), README/tldr/wiki, benchmarks, or CI/Claude-Review workflows |
| `~/.agents/docs/ops/rust-ci-packaging.md` | Debugging CI gates, AUR/COPR/Homebrew/Scoop publishing, or Claude Code Review internals |

## 2. Core Developer Guidelines
- **Safety & Style:** Avoid `unsafe` unless required for OS FFI/syscalls (document every `unsafe` block with `// SAFETY:`); keep `rustfmt` and `clippy --workspace -- -D warnings` clean (`just check` also lints `-p retch-cli --no-default-features`).
- **Architecture:** Split every detector into a **pure parsing/formatting helper** (unit-tested with captured real fixtures) + thin I/O wrapper (`crates/sysinfo`).
- **Docs & Tests:** Document `pub` items with `///` (and explain *why* in non-obvious code); add unit/regression tests for every new function/fix and integration tests for new CLI flags/config keys.
- **Command efficiency:** Prefer `cargo test --workspace` during iteration and `just check` once before staging (both build).

## 3. Pre-PR Gate (`just pr` / `just open-pr`)
Before opening or updating a PR, run `just pr` (or `just open-pr`, which runs `just pr` then `gh pr create`). Two items are **unconditional** on every PR (including doc/test/chore PRs):
1. **Version bump:** Bump `Cargo.toml` (`retch-cli`, and `retch-sysinfo` if library code changed; patch for fixes/docs/CI/deps, minor for new user-visible features) and refresh `Cargo.lock` (`cargo check --workspace`).
2. **Man page regen:** Run `just man` (requires `mandown >= 1.1.1`) and commit `docs/retch.1` (`just man-check` verifies both worktree and `HEAD`).
3. **`NOTES.md` header & rules:** Update `## Current State (v<version>)` header (enforced by `just pr`); update body/gaps (§5/§6/§6a/§6c)/lessons (§7) **only** when state or rules change (`NOTES.md` is not a changelog — delete finished backlog items rather than striking through).
4. **Automated gate checks:** Feature branch, bumped version, matching `NOTES.md` header, clean `docs/retch.1` & `Cargo.lock`, `just check` (`fmt-check`, `clippy`, `standard-check`, `man-check`, `packaging-check`, `bench-check`, `text-check`, `wip-check`), `cargo test --workspace`, advisory `cargo audit`, plus manual confirmation (`PR_CONFIRM=y` non-interactively after verifying README/wiki/`docs/retch.md`/benchmarks).

## 4. Merging
Run `just merge-pr` (standalone, not piped/chained) once authorized: squash-merges via `gh`, switches to `main`, pulls, deletes local feature branch, and updates `WIP.md`'s marked state block. Afterwards verify `benchmark.yml` for the merge SHA succeeds.

---

## 5. Sandbox Exceptions (`BypassSandbox: true`)
Per `~/AGENTS.md` §3, pass `BypassSandbox: true` on the **first** invocation for:
- **All `gh` / `ghpub` commands** (`gh pr`, `gh run`, `gh workflow`, `gh api`, `gh issue`).
- **All `git` write or remote commands** (`checkout`, `switch`, `branch`, `add`, `rm`, `mv`, `commit`, `merge`, `rebase`, `cherry-pick`, `reset`, `tag`, `stash`, `fetch`, `pull`, `push`).
- **`just` shebang & network/publish recipes** (`/run/user/1000/just` is read-only): `just pr` / `PR_CONFIRM=y just pr`, `just open-pr` (always pass `--fill` or `--title ... --body-file ...` in Antigravity PTYs), `just merge-pr`, `just prune-branches`, `just audit`, `just publish-check`, `just publish`, `just aur-publish` / `publish-aur`, `just brew-publish` / `publish-brew`, `just scoop-publish` / `publish-scoop`, `just github-metadata`, `just bench-upload`, `just bench-page`, `just logos`, `just install-tag`.
- **Workspace-writing `just` recipes** (`docs/retch.1`, `Cargo.lock`, `.git/hooks`, `target/`): `just man`, `just fmt`, `just fastfetch-configs`, `just install-hooks`, and `just build` / `just test` / `just check` whenever `Cargo.lock` or `target/` needs writes.
- **Cargo network ops:** `cargo --config net.retry=0 update`, `cargo fetch`, `cargo publish`, `cargo audit`, and first build after `Cargo.lock` updates an unpacked/uncached crate.
- **Live `./target/debug/retch` hardware/session probes** querying host sockets/devices (Wayland/X11/DBus/PipeWire/NM/udev).
- **Works inside sandbox (`BypassSandbox: false`):** Read-only `just` checks once `target/` & `Cargo.lock` are current (`just fmt-check`, `man-check`, `packaging-check`, `standard-check`, `render-check`, `aur-check`, `copr-check`, `brew-check`, `scoop-check`, `metadata-check`, `text-check`, `wip-check`, `bench-check`) and read-only `git` (`status`, `diff`, `log`, `show`, `rev-parse`, `for-each-ref`).
- **Repo-Local Sandbox Learning Loop:** Stage new exceptions in `WIP.md` (`## Sandbox Exceptions (staged for AGENTS.md)`) if tree must stay clean; fold into this section on the next PR.
