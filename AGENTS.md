# AI Agent Guidelines (AGENTS.md)

Welcome! This file contains project-specific guidelines, constraints, and instructions for
all AI assistants (Gemini, Claude, etc.) contributing to the **retch** project.

This file has two parts:

- **Part 1 — Portable Core**: rules that are identical across all of Ken's repos using this
  pattern (currently `etr` and `retch`). If you change wording here, propagate the same
  change to the Portable Core section in sibling repos so they stay in sync.
- **Part 2 — Project-Specific**: rules that only make sense for `retch`.

---

# Part 1 — Portable Core

## 0. Global Mandates
Before doing anything else in a session, read `~/AGENTS.md` (and any skill files it
references) if it exists on the current machine. It carries standing mandates that
apply across all of Ken's repos and are not repeated here — e.g. the chezmoi
native-command hierarchy, the `[REASONING TRACE]` requirement, and language
requirements. If `~/AGENTS.md` conflicts with this file on a repo-specific detail
(e.g. a project's own branch-naming or checklist convention), this file wins for
that detail; `~/AGENTS.md`'s cross-cutting mandates still apply.

## 1. Source Control & Commit Workflow
* **Branch Naming:** Always name new git branches using the prefix pattern `{feature,fix,chore,etc.}/<branch-name>`.
* **Workflow Mandate:** You MUST create and switch to your feature/fix branch *before* starting any file modifications or executing commands to avoid working on `main` by mistake.
* **Commit Summaries:** Write short, clear subjects (max 50 chars) in the imperative mood.
* **AI Attribution:** Use `Assisted-By: <model name>` (no email address) as the trailer line in commits. Use the actual model name of the AI assistant that helped (e.g. `Gemini 3.5 Flash`, `Claude Sonnet 4.6`, `Claude Opus 4`, etc.).
* **Constraint:** NEVER run background `git commit` or `git push` without explicit authorization.
* **Mandate:** ALWAYS ask for explicit permission before submitting a Pull Request (PR) or performing a merge.
* **Branch Cleanup:** Delete feature branches from the remote after they are merged. Periodically prune abandoned branches that were never PRed.

## 2. Engineering Philosophy & Safety
* **Cognitive Circuit Breaker:** Before modifying files or running commands, identify if target files are managed by `chezmoi` (except if located in `~/git` or `~/Sync/git`). If managed, prioritize chezmoi native commands.
* **Absolute Accuracy:** Absolute accuracy is the primary metric. Speed is irrelevant.
* **The Reasoning Trace:** Before implementing any multi-file change, you MUST output a `[REASONING TRACE]` covering Invariants, Subsystem Impact, and Edge-Cases.
* **Empirical Validation:** Test changes locally (compilation, lints, formatting, and unit tests) before proposing a push. See Part 2 §4 for this project's full Pre-PR Checklist and automated gate.

## 3. Cross-Machine Work Handoff (WIP.md)
Any agent starting a session on a repository utilizing cross-machine sync MUST read `WIP.md` before doing anything else.
* **Purpose:** `WIP.md` is a `.gitignored` file synced via Syncthing/Insync to carry context that cannot be inferred from git history alone (what is partially done, machine specs, active branch, next-step checklists, caveats).
* **When to Update:**
  * When switching to a new branch (clear old content, write new context).
  * Before switching machines or ending a session.
  * After pushing commits that change the state of the work.
  * After a PR is merged (set `Active Branch: none (main is current)`).
  * Whenever the next-step checklist changes.
* **What to Include:**
  1. **Machine**: OS, distro, and architecture of the last saved state (e.g. `Linux Fedora 44 x86_64`).
  2. **Active branch name** and PR URL (if open).
  3. **Latest commit hash** and message.
  4. **What was implemented**: Concise description of new/modified files.
  5. **Bugs fixed**: What went wrong and how it was resolved.
  6. **Current CI state**: Passing/failing.
  7. **Open tasks**: Checkbox list of remaining work.
  8. **How to resume**: Exact shell commands to check out, build, and verify.
  9. **Why this work**: Motivating context.
* **What NOT to Include:** Full code diffs, large file contents, detailed architecture docs.

## 4. Continuous Learning Loop
At the conclusion of any task involving a specific skill:
1. Did you encounter a failure, edge case, or nuance not currently documented in the skill?
2. Did the user have to correct your workflow?
3. If YES to either, you MUST automatically update the corresponding `SKILL.md` file with the new learning and synchronize the change before declaring the task complete.

---

# Part 2 — Project-Specific: retch

## 0. Start of session — required reading

**Before doing any work**, read `NOTES.md` in this directory. It is the authoritative
record of current project state: architecture decisions, known gaps, working features,
and design intent. Do not rely on git history or code inspection alone — NOTES.md
captures context that is not in the code.

## 1. Project Overview
`retch` is a fast, feature-rich system information fetcher written in Rust (published on
crates.io as `retch-cli`; the binary and config directory are `retch` /
`~/.config/retch/`). It runs concurrent hardware/system probes (GPU, display, network,
audio, Bluetooth, etc.) and renders themed output, including graphical distro logos. See
NOTES.md for full architecture and current status.

## 2. Core Developer Guidelines
* **Safety First:** Avoid `unsafe` Rust unless absolutely necessary for low-level system integrations. If `unsafe` is used, it must be thoroughly documented with safety comments.
* **Idiomatic Rust:** Follow standard Rust styling, formatting (`rustfmt`), and linting (`clippy`). Prefer standard library constructs and robust, well-established crates.
* **Testing & Documentation Mandates:**
  * When writing code, always write the corresponding tests to go with it.
  * Always document the code clearly as you go.
  * All new features must include unit or integration tests where applicable.

## 3. NOTES.md — update on every commit or push
Before committing or pushing, update `NOTES.md` to reflect any changes to architecture,
known gaps, working features, or design decisions made during the session. NOTES.md must
stay current — a reader picking up the project from NOTES.md alone should have an
accurate picture.

## 4. Pre-PR Checklist

Before opening a pull request — and before each subsequent push to an open PR — you
MUST run `just pr`. It automates most of this checklist and hard-fails on the
unconditional items; the rest is a manual checklist it prints for you to confirm. Do not
run `gh pr create` until `just pr` reports the gate passed.

### STOP — read this before treating anything as optional

Two items are **unconditional** — they apply to every PR without exception, including
doc-only, test-only, and chore PRs. There is no "this is just a small change" carve-out,
and `just pr` will hard-fail the gate if either is missed:

| Step | Why unconditional |
|------|------------------|
| **Man page regen (4.4)** | Verifies mandown still builds `docs/retch.1`; the version footer must match the bumped version. `just pr` fails if the regenerated page differs from what's committed. |
| **Version bump (4.7)** | Every merged PR changes the codebase; the published version must reflect that. Use **patch** for fixes, tests, and doc improvements; **minor** for new user-visible features. `just pr` fails if `Cargo.toml`'s version still matches the last git tag. |

Rationalising either of these away — "it's only docs", "it's only tests", "no behaviour
changed" — is incorrect. If you find yourself about to skip 4.4 or 4.7, stop and do
them instead.

NOTES.md (4.6) and the wiki (4.8) are also required on every PR. They must be updated
**before** the PR is opened, not deferred. AGENTS.md itself must be included in the
same PR as any change to the checklist — never pushed to `main` as a standalone commit.

### 4.0 Automated gate — `just pr`
Run `just pr` before opening a PR and before each subsequent push. It runs, in order,
and hard-fails on the first problem:
1. Confirms you are on a feature branch, not `main`.
2. Confirms `Cargo.toml`'s version has been bumped past the last git tag.
3. Confirms `NOTES.md` has a `## Current State (v<version>)` header matching the bumped version.
4. Regenerates the man page (`just man`) and fails if `docs/retch.1` differs from what's committed — regenerate and commit first.
5. Runs `cargo check` and fails if `Cargo.lock` changed but wasn't committed.
6. Runs `just check` (`cargo fmt --check` + `cargo clippy -- -D warnings`).
7. Runs `cargo test`.
8. Prints the manual checklist below and requires an explicit `y` confirmation before printing "Gate passed."

### 4.1 Code quality gate
- [ ] `just check` passes — `cargo fmt --check` + `cargo clippy -- -D warnings`
- [ ] `cargo test` passes — all unit and integration tests green

### 4.2 Tests
- [ ] Every new public function or non-trivial private function has at least one unit test.
- [ ] Every bug fix has a regression test that would have caught the original bug.
- [ ] New user-visible behaviour (new detection field, new CLI flag, new config key) has
      coverage or an explicit note in the PR explaining why it cannot be tested automatically.
- [ ] If performance-sensitive code changed, run `just bench` (criterion) or `just bench-cli`
      (hyperfine) and note the before/after numbers in the PR description.

### 4.3 Inline code documentation
- [ ] All new `pub` items (functions, structs, enums, traits, modules) have `///` doc
      comments explaining what they do and any non-obvious invariants.
- [ ] Every `unsafe` block has a `// SAFETY:` comment explaining why it is sound.
- [ ] Non-obvious logic inside function bodies has a brief inline comment explaining
      *why*, not *what*.

### 4.4 Man page
- [ ] Run `just man` and verify it succeeds (requires `mandown` — `cargo install mandown`).
- [ ] `docs/retch.1` must be committed — it is not gitignored (unlike etr's `man/build/`).

### 4.5 README.md
- [ ] If a new user-visible feature, CLI flag, config key, or platform support note was
      added, update `README.md` accordingly.
- [ ] If CLI flags changed, check whether `docs/retch.md` / the upstream tldr page needs
      `just tldr-release`.

### 4.6 NOTES.md
- [ ] "Current State" header version updated to match the new version.
- [ ] Release log entry added under "Major Achievements" describing what shipped.
- [ ] Feature-gap or known-issue list updated: mark completed items done, add new gaps
      discovered during the work.

### 4.7 Version bump & release hygiene
- [ ] Bump the version in `Cargo.toml` following semver:
      patch (`0.x.N+1`) for bug fixes, minor (`0.x+1.0`) for new features.
- [ ] `Cargo.lock` updated (`cargo check` does this automatically) and committed.
- [ ] `just man` re-run after the bump so the man page version footer is current, and committed.
- [ ] Before tagging, verify `git status` is completely clean. The tag must only be
      created from a clean `main`.
- [ ] `cargo publish` (via `just publish`) must **never** use `--allow-dirty`. If publish
      requires that flag, stop: something tracked was left uncommitted. Commit or discard
      it first. Run `just publish-check` (dry-run) before the real `just publish`.

### 4.8 Wiki
Update the GitHub wiki **before opening the PR** (not deferred to publish time).
Clone `https://github.com/l1a/retch.wiki.git`, edit the relevant pages, and push:
- [ ] **Configuration-and-Theming.md** — if config keys, theming, or CLI display flags changed.
- [ ] **Workspace-Architecture.md** — if module layout, concurrency model, or crate
      boundaries (`crates/sysinfo`) changed.
- [ ] **Development-Setup.md** — if `just` recipes, build prerequisites, or the
      Pre-PR/merge workflow (`just pr`, `just merge-pr`) changed.

### 4.9 Packaging
- [ ] If this is a release PR, check whether `packaging/nixpkgs/package.nix` needs
      `just nix-update` and whether the AUR PKGBUILD needs a version bump.

### 4.10 PR description
- [ ] Title is concise (≤ 70 chars), imperative mood.
- [ ] Body summarises *what* changed and *why* (not just a commit list).
- [ ] Test plan lists manual verification steps the reviewer can follow.

## 5. Merging
After a PR is merged, run `just merge-pr` to squash-merge via `gh`, switch to `main`,
pull, delete the local feature branch, and reset `WIP.md`
(`Active Branch: none (main is current)`, latest commit updated).

---
