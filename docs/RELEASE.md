# Release, Packaging, Wiki & CI Reference (`retch`)

Loaded on demand before tagging, publishing, updating the wiki/README/tldr, or editing packaging templates and CI workflows.
*(See `~/.agents/docs/ops/rust-ci-packaging.md` for shared cross-repo CI, AUR, COPR, Homebrew, Scoop, and Claude Code Review invariants.)*

---

## 1. Pre-PR Documentation & Parity Checklists
- **Man page (`docs/retch.1.md` -> committed `docs/retch.1`):** Never edit `docs/retch.1` directly. Update `docs/retch.1.md`, then run `just man` (requires `mandown >= 1.1.1`; older versions emit `.Bl`/`.El` mdoc macros causing ~164-line diffs). `just man` reads version from `Cargo.toml`, so re-run after every version bump and commit `docs/retch.1`.
- **CLI & config templates:** Keep `default_config_content()` (`src/main.rs`), `--merge-config` comment lists (never use `key =` syntax inside comments — `contains_key_line` treats `# key =` as present!), and `docs/retch.md` (tldr source; **do NOT run `just tldr-release`**, upstream submission is on hold) in sync.
- **Distro logos:** When adding a logo, update `assets/logos/*.txt`, `src/logo.rs`, and `logo::KNOWN_LOGOS` (`cargo run -- --print-logos --ascii-logo`; `--list-distros` and `--print-logos` share `KNOWN_LOGOS`).
- **README & COPR description:** `README.md`'s top overview (`<!-- BEGIN copr-description -->` ... `<!-- END copr-description -->`) must match `packaging/copr/project-description.md` byte-for-byte with `https://` links only (`scripts/metadata_check.py --sync-copr` copies it). `crates/sysinfo/src/lib.rs` embeds `crates/sysinfo/README.md` via `#![doc = include_str!("../README.md")]`.
- **GitHub Wiki (`https://github.com/l1a/retch.wiki.git`):** Update before opening the PR (`Configuration-and-Theming.md`, `Workspace-Architecture.md`, `Development-Setup.md`).
- **Benchmark configs:** After moving a field between modes in `src/fields.rs`, run `just fastfetch-configs` (`just check` fails until updated).

---

## 2. Packaging Architecture (Zero-Drift Templates)
- **Single source of truth:** `packaging/metadata.toml` governs crates.io, AUR (`retch`), COPR (`kentobias/retch`), Homebrew (`l1a/homebrew-retch`), Scoop (`l1a/scoop-retch`), and GitHub About metadata (`just github-metadata`).
- **Templates:** `packaging/aur/PKGBUILD`, `packaging/copr/retch.spec`, `packaging/homebrew/retch.rb`, and `packaging/scoop/retch.json` carry `@VERSION@` / `@SHA256@` sentinels rendered at publish time (`scripts/render_packaging.py`). **Never commit concrete versions or checksums, and never put literal `@TOKEN@` placeholders in `#` comments** (substituting 64-char SHAs breaks `brew audit --strict`'s 118-char `Layout/LineLength` limit).
- **Offline checks (`just check`):** `standard-check`, `man-check`, `packaging-check` (`render-check`, `aur-check`, `copr-check`, `brew-check`, `scoop-check`, `metadata-check`), `bench-check`, `text-check`, `wip-check`.

---

## 3. Releasing & Publishing Sequence
A release requires **no version bump and no packaging commit** (`main` stays at the released version until the next PR bumps it).
- **Before tagging:** Read the READMEs and channel text (`packaging/metadata.toml`, COPR description, `crates/sysinfo/README.md`) for claims that are no longer true — `metadata-check` proves the copies agree, not that they are right.

```bash
git checkout main && git pull --ff-only && git status --porcelain   # must be clean
git tag -a vX.Y.Z -F <msg-file> --cleanup=verbatim                # --cleanup=verbatim keeps # lines
git push origin vX.Y.Z                                            # triggers release.yml + copr.yml
gh run list --workflow release.yml --limit 5                      # wait for GitHub Release + Windows .exe assets
just publish-check                                                # retch-cli dry-run skips pre-release (expected)
just publish                                                      # crates.io (retch-sysinfo then retch-cli) -> AUR -> Homebrew -> Scoop
                                                                  # pass SKIP_AUR=1 for split-host AUR (just aur-render X <tmp-outside-Sync>)
just github-metadata                                              # sync About box + topics
```
- **Verify live channels:** Install published `retch-cli` from crates.io into a throwaway root and run it; check GitHub Release `retch.1` matches committed `docs/retch.1`; verify AUR via fresh `git clone` (RPC/cgit cache lags); check COPR per chroot (`curl -L` follows `packages.redhat.com` 301).
- **Never run `just install` or `just install-tag`** for local updates — update from crates.io (`cargo install-update`).

---

## 4. CI, Benchmarks & Claude Code Review Notes
- **Continuous Benchmarking (`benchmark.yml`):** 5 platform jobs run in parallel (`skip-fetch-gh-pages: true`, single `git fetch` + `git push` in `publish`), `comment-on-alert: false` (runner swaps swing up to ~6x; track `retch / fastfetch` ratio on `benches/dashboard/`, updated via `just bench-page`). `on.push.paths` intentionally omits root `Cargo.toml`/`Cargo.lock` — use `workflow_dispatch` for root-only dependency bumps.
- **After every merge to `main`:** Confirm the `benchmark.yml` run for that `headSha` concluded `success` and `gh-pages` has the new points. Note local `scripts/hooks/post-merge` runs hyperfine and pushes on `git pull` (`GIT_NO_BENCH=1 git pull` skips it).
- **`Claude Code Review` (`claude-code-review.yml` + `.claude/commands/ci-code-review.md`):** Keep `CLAUDE_CODE_OAUTH_TOKEN` synced in **both** GitHub Actions secrets and Dependabot secrets. Regenerate with `claude setup-token` (from a real terminal), then set **both** stores manually; Dependabot-triggered runs see only the Dependabot copy, and an empty/stale secret fails silently. See `~/.agents/docs/ops/rust-ci-packaging.md` §1 for the full security-hardening spec.
- **Interactive `@claude` (`claude.yml`):** Keeps `--permission-mode acceptEdits` explicitly so `--allowedTools` stays a strict boundary.
