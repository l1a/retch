# NOTES.md

Project state and standing knowledge for **retch**: architecture, current status, design
decisions, known gaps, and the lessons that cost something to learn.

**What belongs here:** anything a developer or agent must keep in mind to avoid repeating a
mistake, re-deriving a decision, or losing time to a trap this project has already hit.

**What does not:** a per-release changelog. History lives in `git log` and the
[GitHub releases](https://github.com/l1a/retch/releases); the wiki carries user-facing
documentation. Until v0.18.1 this file held a full release log — ~4,400 lines of it — which
buried the parts that are actually load-bearing. The durable content of those entries was
distilled into **§7 Hard-won lessons**; the narrative was dropped rather than migrated,
because a reader who needs "what changed in v0.9.7" is better served by `git log`.

**Keep it that way.** When a release entry would only say what changed, write a good commit
message instead. Add to this file when a change leaves behind a *rule* — something the next
person would otherwise get wrong.

---

## 1. Project Overview
- **Name**: retch (published as `retch-cli` on crates.io)
- **Goal**: A fast, feature-rich system information fetcher (Fastfetch-like) written in Rust
- **Key Technologies**: sysinfo, clap, serde, toml, owo-colors, icy_sixel
- **License**: GPLv3
- **Repository**: https://github.com/l1a/retch

---

## 2. Codebase Architecture

```
retch/                          ← retch-cli crate (binary)
  src/
    main.rs, display.rs, config.rs, ...
    fields.rs                   ← single source of truth for the field list +
                                   output strata (see §5 "Field wiring")
  Cargo.toml                    ← bump on release
  Justfile
  docs/retch.1.md               ← man page source (mandown)
  docs/retch.md                 ← tldr page source

crates/sysinfo/                 ← retch-sysinfo crate (library)
  src/
    macos_ffi.rs                ← ALL macOS FFI (CoreFoundation, IOKit, CoreAudio,
                                   CoreGraphics, CoreWLAN, objc runtime)
    fetch.rs                    ← orchestrates concurrently-scoped thread fetches
    network.rs, battery.rs, theme.rs, ...
  build.rs                      ← framework link directives
  Cargo.toml                    ← bump on release
```

The `retch-sysinfo` crate can be used independently as a library for cross-platform system
information gathering without any dependency on `clap` or the CLI.

---

## 3. Specific Development Guidelines

- **Man Pages**: Do NOT edit `docs/retch.1` directly. It is generated from `docs/retch.1.md`
  using mandown via `just man`. The version is extracted from `Cargo.toml`, so always run
  `just man` after a version bump. **mandown >= 1.1.1 is required** — older builds emit
  `.Bl`/`.El` mdoc macros that are undefined in `man(7)`, producing a spurious ~164-line diff
  that reads as "my change broke the man page".
- **Quality & Linting**: `just check` runs formatting, linting and every offline guard. It
  matches what CI enforces.
- **Verification Routine**: Before proposing a push or Pull Request, always verify:
  1. All new and existing unit/integration tests cover changes.
  2. All documentation is kept in sync with the current features.
  3. Default configuration templates (like `default_config_content()` in `src/main.rs`) and
     comment lists are fully updated with new options.
  4. If the GitHub wiki exists, clone it (`https://github.com/l1a/retch.wiki.git`) and update
     any affected pages before submitting the PR.
  5. When adding distro logos, run `cargo run -- --print-logos --ascii-logo` and confirm every
     new distro appears. The hardcoded list in `src/main.rs` must be updated alongside
     `src/logo.rs`.
  6. If package versions are bumped, run `just man` and commit the regenerated page *as part
     of the Pull Request* (never directly on `main`).
- **Pre-PR Gate**: Never call `gh pr create` directly — always run `just open-pr`. It runs
  `just pr` first (branch, version bump, NOTES.md header, man page, `Cargo.lock`, fmt+clippy,
  tests, plus a manual checklist requiring an explicit `y`) and only then calls `gh pr create`.
  This is enforced by the Justfile, not by editor- or agent-specific config, so it applies the
  same way whether a human, Claude, or any other agent is driving — `gh`/`git` have no hook of
  their own for "PR about to open", so `just open-pr` is the one call site that gates it.
  The tldr checklist item means updating `docs/retch.md` only — do **not** run
  `just tldr-release` (upstream submission is on hold).
- **Git hooks are the actual enforcement layer, not agent config**: `scripts/hooks/pre-push`
  (installed by `just install-hooks`) runs `just check` before every `git push`, regardless of
  what invoked it. Prefer this pattern — a real git hook, or a Justfile recipe — over anything
  under `.claude/` when the goal is "block an action no matter what tool is driving".
  `.claude/settings.json` hooks only fire inside Claude Code and are invisible to every other
  agent and to a human typing commands directly.
- **Code Documentation**: Review all changed public items for accurate doc comments. New
  functions with non-obvious logic must explain the WHY, not the what.
- **Test Coverage**: Every new pure function must have unit tests. Every new CLI flag must
  appear in the `--help` integration test and have a smoke test. Every changed invariant must
  have a test that exercises the new branch. See §7.2 for the conventions that matter most.
- **PR Test Plans**: After opening a PR, run each item in the test plan and update the PR body
  via `gh pr edit` to check off passed items. Items needing manual human verification stay
  unchecked with a note.
- **Documentation & Versioning Updates**: when branching to make changes — bump the version in
  `Cargo.toml` and run `cargo check` to refresh `Cargo.lock`; update `docs/retch.1.md` and run
  `just man`; update `README.md`; update this file (the `## Current State` header, plus §5/§6
  and §7 where the change leaves a rule behind); update the wiki; update `docs/retch.md` if
  options changed. **If the changes are significant, ALWAYS ask the user whether to perform a
  major, minor, or patch bump.**
- **Command Redundancy**: Avoid running `just check && cargo test` sequentially — both build
  the project. Prefer `cargo test` during iteration and a final `just check` before staging.
- **Cross-Machine `target/` via Syncthing**: `~/Sync/git/retch` is synced across machines
  including `target/`, so a build can pick up artifacts compiled elsewhere. A failure at
  *runtime* rather than compile time — a `SIGILL` being the classic shape — means stale
  cross-CPU artifacts: `cargo clean`.
  - Note this repo does **not** ship a `.cargo/config.toml`; only `.cargo/audit.toml` is
    tracked. Nothing here sets `-C target-cpu=native`. (An earlier version of this entry said
    otherwise, which mattered when the COPR spec was written: a builder inheriting
    `-march=native` would emit a binary that SIGILLs on users' machines. Verified absent from
    the release tarball at the time; the AUR package is safe for the same reason.)
- **Benchmarking**: `just bench` (criterion), `just bench-cli` (hyperfine), `just bench-compare`
  (vs fastfetch/neofetch). CI tracks trends on pushes to `main` via GitHub Pages;
  `just bench-upload` pushes local results, and a `post-merge` hook does it automatically.
- **Performance Regression Vigilance**: After every merge, check the post-merge benchmark
  output. A primary goal of retch is to be faster than fastfetch — **if retch is slower than
  fastfetch in any mode, treat it as a blocking issue.** Local benchmarks can be skewed by slow
  FUSE mounts (e.g. cryfs vaults) causing `statvfs` delays; unmount them or discount the run.
- **Releases & Tagging**: a release is a tag push, and it requires **no version bump and no
  packaging commit** — `main` sits at the released version until the next feature PR bumps it.
  ```
  git tag -a vX -F <msg-file> --cleanup=verbatim   # see §7.4 on --cleanup
  git push origin vX          # CI builds the GitHub Release; copr.yml fires on the tag
  just publish                # crates.io. Refuses unless HEAD is the tag.
  just aur-publish X          # renders + pushes to the AUR (needs podman). AUR_CONFIRM=y
  just brew-publish X         # renders + pushes to the tap. BREW_CONFIRM=y
  just github-metadata        # About box from packaging/metadata.toml
  ```
  `retch-sysinfo` publishes before `retch-cli`, which pins `=0.1.x`; `just publish` orders them
  and skips sysinfo when it is already on the index. `just publish-check`'s retch-cli leg
  *skipping* before a release is expected, not a failure.
  **Publishing to tldr-pages upstream is on hold** — the submission was declined pending more
  community traction. Keep `docs/retch.md` current; do not run `just tldr-release`.

---

## Current State (v0.18.4)

`main` carries **`retch-cli` 0.18.4** / **`retch-sysinfo` 0.1.76**. Newest released tag is
**`v0.18.0`**, live on GitHub, crates.io, the AUR, COPR and the Homebrew tap.

Everything in §6 (the fastfetch feature gap) is closed on all three platforms. What is open is
listed in §5, §6a and §6c.

Recent work worth knowing about, beyond what `git log` says:

- **v0.18.4 — the parallel publish job could not publish, and the first run said so.**
  v0.18.3's five benchmark jobs ran perfectly in parallel — **604 s (10.1 min) against the
  2424 s (40.4 min) serial baseline**, 1814 s of overlap — and then `publish` failed 13 s in.
  - **`github-action-benchmark` re-fetches `gh-pages` at the start of EVERY invocation**
    (`git fetch origin gh-pages:gh-pages`). With `auto-push: false`, the first step leaves the
    local branch one commit ahead of origin, so the second step's fetch is a
    **non-fast-forward** and the job dies: `! [rejected] gh-pages -> gh-pages`.
    `Publish Linux x64` succeeded; `Publish Linux arm64` took the rest down with it.
  - **The shape was right and one input was missing**: `skip-fetch-gh-pages: true`, now set on
    **all five** steps, with a single explicit `git fetch` before them. All five rather than
    "all but the first", because each step is guarded on its own artifact, so which one runs
    first is not fixed.
  - **The failure cost nothing but that run's points, which is the design working.** Because
    every step used `auto-push: false` and the single push came last, a failure before the push
    published *nothing*: `origin/gh-pages` was untouched and all five suites still read the
    previous commit. Had each step pushed for itself, the run would have left one suite ahead
    of four.
  - **The lesson is the one v0.18.3 wrote down and could not act on**: a workflow that triggers
    only on push to `main` cannot be tested by a PR, so the first post-merge run *is* the test.
    Structural verification caught everything it could — YAML, job graph, artifact wiring,
    suite names — and could not catch an action's undocumented-in-context runtime behaviour.
    **Budget for a follow-up fix when merging a workflow change; do not treat the merge as the
    end of it.**

- **v0.18.3 — the benchmark workflow runs in parallel.** Its five platform jobs were a
  strict five-deep `needs:` chain, so a run cost the *sum* of its jobs rather than the
  *maximum*: measured on run `35745177092`, **39.1 min wall clock** against a **579 s** longest
  job, with each job starting 3–10 s after the previous one *completed*. Now they run
  concurrently and hand their results to one `publish` job.
  - **The chain was load-bearing, which is why it could not simply be deleted.** Every job
    ended in `github-action-benchmark` with `auto-push: true`, the same `gh-pages-branch` and
    the same `benchmark-data-dir-path`; `dev/bench/data.js` is a single file holding all eight
    suites. Five parallel publishes would have raced. Serialising them as **steps of one job**
    keeps that guarantee while letting the expensive half overlap.
  - **Invoking the action repeatedly in one job is its documented pattern**, not a trick — its
    README says to give each step a distinct `name` when a workflow has several. Each step uses
    `auto-push: false` and one explicit `git push` follows, so five appends become one
    commit-and-push instead of five races with ourselves.
  - **A failed platform still costs only its own series.** Before, each job published for
    itself, so a Windows failure lost Windows alone; making `publish` depend on all five would
    have turned that into all-or-nothing. So `publish` runs `if: ${{ !cancelled() }}` and each
    step is guarded on **its own artifact existing** (`hashFiles(...) != ''`), not on the job
    having succeeded.
  - **A `concurrency:` group was added, and it fixes something the chain never covered.**
    `needs:` orders jobs *within* a run; two merges to `main` in quick succession started two
    runs that both published. `cancel-in-progress: false`, because a half-finished benchmark
    run has already spent the runner time and its results are still wanted.
  - **Machine-checked rather than eyeballed**, since a workflow cannot be run from a PR: both
    versions parsed and compared, asserting every job's steps *except* the final one are
    byte-identical, runners and containers unchanged, triggers/permissions/env unchanged, and
    `concurrency` the only added top-level key. The `cargo bench`, `hyperfine` and
    `parse_criterion` lines are identical to `main`'s — **the measurement half is untouched**.
  - **The suite names were checked against the live dashboard**, because renaming one forks a
    series rather than renaming it: all five `name:` values still match entries present in
    `gh-pages:dev/bench/data.js`.
  - **Verification limit, and it is the important one:** the workflow triggers on push to
    `main`, so **a PR cannot exercise it** — the first run after merge is the test. If it
    misbehaves the fallback is reverting the workflow; `data.js` is append-only per suite, so a
    failed publish loses that run's points rather than any history.
  - Not done, and a reasonable follow-up: the five jobs are near-identical and could collapse
    into a matrix. That is a refactor rather than this change, and a bigger diff to review.

- **v0.18.2 — the CI hyperfine benchmarks were dead for three months, and now work.**
  `.github/workflows/benchmark.yml` writes `hyperfine_{default,short,long}.json` while
  `scripts/parse_criterion.py` opened a hardcoded `hyperfine_result.json` that nothing
  produces, so every CI run timed six commands and discarded them. `b45894a` (2026-06-24) had
  split one hyperfine run into three and taught the parser to *label* the three modes without
  changing the name it opens.
  - **It stayed green because a missing source was a warning.** The script printed to stderr
    and exited 0, and its only hard error needed *both* sources empty — so criterion alone kept
    the step passing. Measured on the published artifact: across 50 runs each, all five CI
    suites held **zero** `CLI execution` series while the `Local - …` suites held all six.
  - **Fixed three ways, because the filename was the instance and not the class**: the parser
    now **globs** `hyperfine_*.json` so adding a comparison needs no change here; a source that
    is expected and absent is an **error** (`--allow-missing` is the deliberate escape hatch,
    not the default); and its self-test **reads `benchmark.yml` and asserts the glob matches
    every `--export-json` filename the workflow writes**, which is the coupling whose absence
    let the two drift. `just bench-check` runs it from `just check`.
  - **Verified end to end on real data, not fixtures**: same real `cargo bench` output and the
    same three real hyperfine runs through both versions — the `main` copy produced **12
    entries, 0 of them CLI, exit 0**; this one produces **18 entries, 6 of them CLI**.
  - **The label mapping moved to `scripts/bench_labels.py`**, shared with
    `upload_local_bench.py`, which carried a byte-identical private copy. It returns
    `(label, ns)` **pairs rather than finished dicts**, deliberately: the two callers serialise
    differently and must keep doing so — the local suites store `name, unit, value` in a
    `data.js` that script writes itself, the CI entries store `name, value, unit`, and
    normalising one would rewrite every key in a suite for nothing (v0.9.11's churn lesson).
  - **The series names are an API.** github-action-benchmark keys each chart series by the
    label, so renaming one **forks** the series rather than renaming it, orphaning 50–95 runs
    of history. `bench_labels.EXPECTED_LABELS` pins all six.
  - **`just bench-upload` gained `--dry-run`**, because until now there was no way to exercise
    it without publishing: `main()` ran hyperfine and then pushed, unconditionally, and the
    `post-merge` hook calls it after every merge. **A path that can only be tested in
    production does not get tested** — verifying the change above initially meant importing the
    script's internals. The dry run clones, appends and stages, prints the diff that would
    land, and returns before the commit. Used to confirm the change end to end: 6 benches, the
    right suite, **55 insertions / 1 deletion** (v0.9.11's small diff, not the whole-file
    churn), and `origin/gh-pages` unmoved.
  - Still open, and unchanged by this: the five jobs run in a strict serial chain costing
    **39 min per merge** against a **9.7 min** parallel floor, where the chain is
    **load-bearing** because all five push the same `data.js`. See §5.
- **v0.18.1 — LF is the base model for every non-binary file.** `WIP.md` had been deliberately
  CRLF; a byte-count survey of retch, `etr` and `rusticprofile` found it was the only CRLF file
  in any of them, so it was converted. `just wip-check --check-endings` now guards it, because
  `WIP.md` is gitignored and therefore invisible to both `.gitattributes` and `text_check.py`.
  `update_wip.py` needed no change — it already follows the file's own terminator.
- **v0.18.0 — `--color auto|always|never`, and `NO_COLOR` is honoured.** The user-visible
  change is that **piped output is now plain by default**; `less -R` users need
  `--color always`. Colour is removed by stripping SGR at render time rather than teaching each
  source to stay quiet, because one source lives in the other crate and because `print_line`
  right-aligns the *coloured* label. Without colour the ASCII logo is stripped and Chafa falls
  back to it; Kitty/iTerm2/Sixel images are kept — a picture is not text colour.
- **Open follow-up from v0.18.0**: a `color` key in `config.toml` (no-color.org permits config
  to override `NO_COLOR`) and `TERM=dumb` handling.

---

## 4. Output Mode Strata

retch has four output modes with increasing verbosity and acceptable runtime. Each mode is a
strict superset of the one above it.

| Mode | Flag | Typical runtime | Purpose |
|---|---|---|---|
| Short | `--short` | <100ms | Hardware snapshot — fastest, scriptable |
| Standard | *(none)* | ~200ms | Daily-use system overview |
| Long | `--long` | ~500ms | Diagnostics — consolidated thermals, network detail, firmware |
| Full | `--full` | ~5s+ | Everything, including slow and cosmetic fields |

### `--short`
Fast hardware-only snapshot. No network calls, no sensors, no cosmetic fields.
Fields: `os`, `kernel`, `host`, `cpu`, `gpu`, `memory`, `disk`, `net`

### Standard (no flag)
Full system overview suitable for daily use. No slow fields, no sensors, no cosmetic fields.
Fields: `os`, `kernel`, `host`, `cpu`, `cpu-cache`, `cpu-usage`, `motherboard`, `gpu`,
`display`, `audio`, `camera`, `memory`, `phys-mem`, `swap`, `load`, `disk`, `phys-disk`, `net`,
`uptime`
- BIOS moves to `--long` (firmware detail, not needed at a glance)
- Gamepad moves to `--full` (cosmetic/slow)

### `--long`
Standard plus diagnostics. Aimed at understanding system health and network configuration.
Adds over standard:
- `bios` — firmware vendor, version, date
- `temp` (consolidated) — **one representative reading per physical unit**: CPU, GPU, SSD/NVMe,
  WiFi adapter, System/Motherboard. Rule: highest sensor within each category (worst-case
  thermal indicator). All other sensor readings are deferred to `--full`.
- `domain` — current DNS domain. Reported for the **default-route interface** on every
  platform, so a split-tunnel VPN's domain is not reported unless the VPN *is* the default
  route (Linux via `resolvectl`, macOS via SystemConfiguration's primary service, Windows via
  `GetAdaptersAddresses`).
- `public-ip`, `wifi`, `bluetooth`, `battery`, `power-adapter`, `shell`, `editor`, `terminal`,
  `terminal-size`, `desktop`, `wm`, `login-manager`, `brightness`, `dns`, `users`, `packages`,
  `locale`, `init`, `chassis`, `bootmgr`, `keyboard`, `mouse`, `tpm`, `player`, `media`
- `disk-io`, `net-io` — throughput rates measured across the run's **own collection window**
  rather than a dedicated sleep, so they add no wall-clock. fastfetch sleeps ~1 s for the same
  figures. Consequence, stated rather than hidden: the number is the average over the run
  (~0.4 s in `--long`, seconds in `--full`), not an instantaneous rate. Documented in the man
  page's I/O RATES section.

### `--full`
Long plus everything slow, verbose, or cosmetic. Users should expect multi-second runtimes.
Adds over long:
- `temp` (all sensors) — replaces the consolidated view
- `domain-search` — one entry per scope, rendered `scope: a, b`. The scope is the interface name
  when per-interface data exists, or `global` for the `/etc/resolv.conf` `search` fallback,
  which carries no interface attribution. Deliberately **not** narrowed to the primary service
  on macOS: the machine really does search every listed domain.
- Cosmetic fields: `theme`, `icons`, `cursor` (`font` and `terminal-font` remain in `--long`)
- `vulkan`, `opengl`, `opencl` — collected together on purpose; they dlopen loaders into the
  same driver stack, so splitting them across threads buys contention, not overlap
- `gamepad`, `weather` (Open-Meteo, ~4 s network timeout)
- FUSE mounts — disk detection re-enables `statvfs` for `fuse.*` entries (skipped elsewhere to
  avoid 600ms+ hangs from cryfs/EncFS vaults)

### Design notes
- **Temperature consolidation** for `--long`: classify sensors by name pattern
  (`k10temp`/`coretemp` → CPU, `amdgpu`/`nvidia` → GPU, `nvme` → SSD, `ath`/`iwl` → WiFi,
  `acpitz`/`thinkpad` → System), then report the highest within each category.
- **`--full` as a superset**: everything in `--long` also appears in `--full`; nothing is hidden
  or replaced except the temp view.
- **Alternative considered**: `--verbose` instead of `--full`. Rejected — `--full` reads as the
  natural escalation from `--long`, while `--verbose` implies logging noise rather than breadth.
- **Known wart, not fixed**: `--long`/`--full` override `--fields` (`retch --long --fields cpu`
  prints all lines). Pre-existing and out of scope when found; worth a decision, since
  `--fields` reads as a filter.

---

## 5. Future Work / Backlog

Live items only. Completed items are removed rather than struck through — `git log` has them.

- **CI automation of the publish steps.** A tag still does not, by itself, publish to crates.io
  or push to the AUR and the tap. Since v0.17.5 this is a genuine port rather than a redesign —
  the workflow would run the same recipes a human runs, with nothing to commit afterwards — but
  it needs three secrets (crates.io token, AUR SSH key, tap push token) and it trades away a
  human's confirmation before each irreversible public act. That is a decision, not a free win.
  The COPR quarter is already done: `copr.yml` fires on the tag.
- **`packaging/nixpkgs/package.nix` is the one hand-pinned target**, still at 0.6.12 with
  `cargoHash = lib.fakeHash`, its CI job `if: false`, and no host in the fleet has Nix. This
  has been carried for well over a dozen PRs. **It needs a decision — track it properly or stop
  tracking it — not another carry-forward.**
- **Investigate a single source for the long-form text each channel shows.** Only GitHub and
  crates.io render a full README, and they already share the root `README.md`. The rest show a
  one-liner that `packaging/metadata.toml` centralises, or the COPR project page
  (`packaging/copr/project-description.md`). Options: generate the COPR description from a
  marked section of `README.md` so it cannot drift; make repo-relative links absolute in that
  section, since the COPR page will not resolve them. Keep `crates/sysinfo/README.md` separate
  on purpose — it documents the library API — but consider
  `#![doc = include_str!("../README.md")]` so docs.rs and that README are one text.
  **Settle first**: whether crates.io resolves repo-relative links, checked on the live page.
- **"Real hardware" benchmark section on the wiki.** The published numbers are CI-runner or
  local figures, which are noisy and unrepresentative. Document retch-vs-fastfetch timings from
  actual physical machines with CPU/OS context per run.
- **homebrew-core submission** remains open and is a separate decision from the tap (which
  shipped in v0.17.2). Its notability bar is comparable to the tldr-pages submission that was
  declined.
- **macOS code signing & notarization** so users need not `xattr -dr com.apple.quarantine`.
  Requires Apple Developer Program membership and CI secrets.
- **nixpkgs submission** so retch appears in the
  [Repology](https://repology.org/project/retch/versions) widget. The Nix flake (contributed by
  @quixaq) is a starting point.

---

## 6. Feature Gap with Fastfetch

**Every field-level gap is closed, on all three platforms.** Hardware (`brightness`,
`keyboard`, `mouse`, `power-adapter`, `tpm`), GPU APIs (`vulkan`, `opengl`, `opencl`), storage
(`btrfs`, `zpool`, `disk-io`), network (`net-io`), desktop/UI (`wm-theme`, `login-manager`,
`wallpaper`, `terminal-theme`) and media (`player`, `media`) all report.

Where retch deliberately reports **more** than fastfetch: `opencl` (fastfetch prints a platform
version even when the platform exposes no device), Windows Bluetooth (fastfetch misses LE
peripherals), macOS `keyboard` (finds a connected Bluetooth keyboard fastfetch misses), macOS
`brightness` and Windows `disk-io` (fastfetch reports neither).

Where retch deliberately reports **less**: any case where the honest answer is unknown. See
§7.2's under-reporting rule.

Remaining platform-specific defects are in §6a and §6c.

---

## 6a. Windows cross-platform parity — open items

- **Logo renders above the text, not beside it (upper-right)** on Windows Terminal
  (CLI/rendering, `retch-cli` `src/`). Likely terminal-detection or cursor-positioning specific
  to Windows Terminal. Do **not** conflate this with the v0.9.2 flush-right fix, which was
  "beside, but not on the margin".
- **`chafa` mode is ignored on Windows even when requested on the CLI.** Investigate PATH
  resolution, protocol-detection override, and Windows spawn/path handling.

Both need a TTY, so both need real hardware (arrakis) — a piped run cannot distinguish the
chafa case from the documented v0.6.6 behaviour.

**Deliberately not implemented on Windows** (no faithful native source): `load` (no load-average
equivalent), `editor` (env-only `$VISUAL`/`$EDITOR`), conhost `terminal-font` (only Windows
Terminal has a parseable config).

The `load` exclusion is **enforced in code**, not merely a property of the data:
`should_probe_load()` skips `System::load_average()` on Windows outright. It had been called on
every run, had always returned `0.00, 0.00, 0.00`, and cost ~183–194 ms — see §7.3.

---

## 6b. Privilege-dependent fields (Linux) — what `sudo retch` changes, both directions

Running retch under `sudo` does not simply add fields: it adds some and **removes others**,
because `sudo`'s default `env_reset` strips most of the environment. Diffing a `sudo --full`
run against a plain one is therefore not a fair before/after, and the differences below are
expected behaviour, not bugs.

**Only available as root**
- **`phys-mem`** — reads `/sys/firmware/dmi/tables/DMI`, mode `0400 root`, via `dmidecode`.
  There is no unprivileged source for per-DIMM type/capacity/speed on Linux, so the field is
  omitted rather than guessed. (Windows reads SMBIOS natively and needs no elevation.)
- **`btrfs` snapshot count** — `btrfs subvolume list -s` requires root. Deliberately **omitted
  rather than shown as `0`** when it cannot be read, so "couldn't check" is never mistaken for
  "no snapshots"; the rest of the field still renders.

**Only available as the logged-in user** (lost under `sudo`, since `env_reset` drops them)
- **`editor`** — `$VISUAL` / `$EDITOR`.
- **`desktop`**, **`wm`** — `XDG_CURRENT_DESKTOP` / `XDG_SESSION_DESKTOP` / `GDMSESSION`.
- **Logo protocol selection** — `TERM_PROGRAM` is not in sudo's `env_keep`. This used to
  silently downgrade Rio from the Kitty graphics protocol to Chafa; the Rio check now also
  consults `TERM` (`xterm-rio`), which sudo *does* preserve. Any terminal identified solely by
  `TERM_PROGRAM` still degrades under sudo by design.

**Rule of thumb for this class of bug:** if a field is missing only for the unprivileged user,
check whether the underlying source is genuinely root-only before adding an elevation note.
`Packages` looked exactly like a permissions limit for a long time and was in fact a fixable
SQLite open-mode defect — see §7.3.

---

## 6c. macOS cross-platform parity — open items

- **`Bluetooth` reports `Off` while Bluetooth devices are connected**
  (`macos_ffi.rs::get_bluetooth_state`). `iokit_property_as_bool(service,
  "BluetoothControllerPowerIsOn")` returns `None` on macOS 26 — **the property does not
  exist**; `IOBluetoothHCIController` exposes only `IOClass`, `Built-In` and
  `BluetoothTransportConnected = Yes`. The `.unwrap_or(false)` then turns "could not read" into
  a confident `Off`. The three chipset-name properties it tries are absent too, yet the field
  still prints a name — so that comes from a fallback elsewhere, worth tracing at the same time.
  - **Deliberately not fixed blind.** `BluetoothTransportConnected` is the obvious replacement,
    but confirming it tracks the *radio* being switched off means toggling Bluetooth off, which
    would disconnect the keyboard in use. **Confirm it reads `No` with the radio off before
    relying on it.**
  - **The safe partial fix is independent of that question and can be done anywhere**: stop
    reporting `Off` when the property cannot be read at all.

**Decided — `tpm` stays absent on macOS.** Macs have a **Secure Enclave**, not a TPM. The field
reports a TPM *specification* version (`2.0`/`1.2`) and a Secure Enclave has none; labelling one
as the other would be an approximate-but-wrong answer. fastfetch reports no TPM on macOS either.
Reopen only if a Secure Enclave field is wanted under its own name — a different feature.

---

## 7. Hard-won lessons

Rules distilled from the work, not a history of it. Nearly every one was paid for twice: once
by the defect, once by a check that failed to catch it.

### 7.1 Verification — the oracle that answers a different question

**This is the project's signature failure and it has recurred in every subsystem.** The pattern
is always the same: a check runs, returns a plausible answer, and is answering a question
nobody asked.

- **A check that cannot fail is not a check.** Before trusting a new guard or test, break the
  thing it guards and watch it fail *for the right reason*. Every guard and test added here is
  expected to have been watched failing against a deliberate mutation, with the file restored
  byte-identical afterwards.
- **A step that warns and then exits 0 reports success over work it did not do**, and it can do
  so for years. `parse_criterion.py` opened a filename nothing produced, printed
  `Warning: … not found.` to stderr, and still exited 0 because its `if not results` guard
  needed *both* of its sources to be empty — so the CI benchmark job stayed green for three
  months while publishing half the data it appeared to. `install_completions.py` did the same
  shape earlier, catching an exception and then printing "Installed completions for …"
  unconditionally. **If a script is told to read something, its absence is an error, not a
  warning** — and a partial success must not be indistinguishable from a complete one.
- **Check that a produced artifact is actually CONSUMED, not just that it was produced.** Both
  halves of the above ran and succeeded on their own terms; the break was between them, in a
  filename. The question that found it was not "does this step pass?" but "do we use both of
  these outputs?" — and the answer came from the *published data*, where one entire class of
  measurement was simply absent. Diff what a pipeline claims to emit against what its consumer
  actually contains.
- **A mutation that "passes" reads exactly like a sound test.** A `MIB_IF_ROW2` layout assertion
  passed against an `alias` array shortened by one `WCHAR`, because the lost bytes were absorbed
  by later padding. A macOS HID vendor-page test passed with its page filter deleted, because
  every fixture entry also failed the *usage* filter. Two filters overlapping on real data hide
  each other — pin the property with a synthetic case where they cannot.
- **The negative control is the load-bearing one.** A drift guard must stay *silent* in the
  repo's normal resting state (e.g. a packaging version legitimately trailing `Cargo.toml` by a
  release cycle). A guard that fires on correct code is deleted within a week, taking the real
  rule with it.
- **A differencing harness cannot see a cost its own baseline shares.** The Windows `--short`
  investigation put the startup floor at ~314 ms and concluded "the floor itself is the cost".
  Every number was real; the conclusion was not — the `--fields os` baseline paid the same
  ~200 ms of PDH setup being hunted, so subtracting it cancelled the constant exactly. The tell
  was "41 of 56 fields within 20 ms of the floor", which is that cancellation seen from the
  other side. **Measure absolute elapsed time from process start, not more differences.** The
  true floor was `retch --version` = 17.9 ms.
- **`--fields <one field>` does not model `--long`.** Fields collect concurrently, so an
  isolated sweep finds a slow *field* and cannot find a slow *serial section*. Confirm any
  predicted win against the real mode. Conversely the removal test can be wrong too: `shell`
  measured 19 ms when removed from the set and was actually ~570 ms on the critical path,
  running serially *after* the concurrent scope.
- **A pipeline under `set -o pipefail` fails when the reader exits early.** `bsdtar -tf x |
  grep -q y` → `grep` exits on first match, `bsdtar` takes SIGPIPE and exits 141, the pipeline
  fails — so the step reports "not found" precisely when the thing is present. `head -1` and
  `grep -m1` are the same hazard. **Materialise to a file, then grep the file.** This also
  broke Homebrew on a dev machine by truncating a native-gem build mid-install, and the same
  invocation was both the thing that broke it and the thing that reported it.
- **`grep -c $'\r'` from an agent shell returns the file's LINE COUNT.** The backslash collapses
  in transport, `grep` gets an empty pattern and matches every line. Wrong in both directions.
  The tell is that the answer equals `wc -l`. **Count bytes in a language that has them.**
- **`grep` for "did the fix land?" counts your own explanatory comments.** Strip comments first —
  the same reason the vendored guards do.
- **`gh pr checks --watch` exits 0 on an EMPTY rollup** and prints "no checks reported". Racing
  a fresh push, that reads as success. It also exits 0 when a check failed. Query
  `statusCheckRollup`, assert it is **non-empty**, and that nothing is pending or failing.
  CodeQL can also finish `NEUTRAL` rather than settling to `SUCCESS`; `merge-pr`'s gate refuses
  only FAILURE/TIMED_OUT/CANCELLED/ACTION_REQUIRED, so check explicitly.
- **A local command is not an authentication test.** `copr-cli whoami` reads the config file and
  never contacts the API, so it returns the right name for a deliberately corrupted token.
- **When a transported value is rejected, re-parse it from its source before theorising about
  the transport.** `awk -F'= *'` truncated a 30-character COPR login to 6 (the `-F` regex
  matches at *every* `=`); two of three values were byte-exact, so it looked like a GitHub
  secrets problem and the credentials were re-issued twice.
- **Read a verification command's output raw before piping it through a filter.** An empty
  result and a rejected argument are indistinguishable downstream — `dnf repoquery` refusing
  `--repofrompath` alongside `--disablerepo` printed a clean, confident nothing.
- **Confirm the probe really resolved what you think.** When A/B-ing two dependency versions,
  read the probe's own `Cargo.lock` back at each step, or the check passes by testing one
  version twice.
- **Ask git the right question about line endings.** `git status` shows CRLF drift exactly once,
  as an ` M` with no diff behind it, and the first `git add` erases that signal while leaving
  every byte on disk. `git ls-files --eol` (`i/lf w/crlf`) is the unambiguous oracle.
- **`jq`'s `//` is not a null-coalesce for the GitHub API.** It falls back only on `null` and
  `false`, and a check or run that has not finished carries `conclusion: ""` — an *empty
  string*, which `//` passes straight through. So `.conclusion // .status` renders blank for
  exactly the entries that are still running, and `.conclusion // "pending"` reports them as
  nothing at all. This produced two confident, wrong readings of CI state in one session, the
  second of which reported a still-running workflow as finished. **Test for emptiness
  explicitly:** `if (.conclusion // "") == "" then .status else .conclusion end`.
- **`gh run list --branch main` answers about the branch, not about your commit.** Straight
  after a merge it returns the *previous* commit's runs, which are green, while the merge's own
  runs are still queuing. Filter on the sha you actually care about:
  `select(.headSha == "<sha>")`.
- **A pipeline's exit status is the LAST command's**, so `grep pattern file | head || echo
  none` can never print `none` — `head` succeeds whether or not `grep` matched. Either drop the
  pipe, or capture with `grep -c` and test the number. Same family as the `$pipestatus` entry:
  the guard is attached to the wrong command.

### 7.2 Testing conventions

- **Pure helper + thin I/O wrapper.** Every detector splits into a pure function (parsing,
  formatting, classification) and a wrapper that reads `/proc`, sysfs, the registry or an FFI
  call. Tests target the pure half with verbatim fixtures captured from a real machine, so no
  test depends on the hardware of whatever runs it. This exists because tests that read live
  CPU topology, live EDID or live block devices each failed on one machine and passed on every
  other.
- **Inject the resolver.** Where a parser needs a lookup, parameterise it
  (`parse_xrandr_displays_with(stdout, resolve)`) and pass `|_| None` in tests.
- **When a function gains a new environment input, every test asserting it *false* must guard
  that input too** — otherwise the host's own environment leaks in and the test fails on one
  developer's box and passes on CI.
- **Under-reporting beats asserting something false.** `Users: 0` is suppressed rather than
  printed; a keyboard/mouse that cannot be classified is listed in *neither* field; an OpenCL
  platform with no devices is not reported as working. This is a standing design rule, not a
  case-by-case call.
- **FFI structs get `size_of` + targeted `offset_of!` guards**, because value-parse tests cannot
  catch a field reorder or a padding change.
- **A test fixture must reproduce the condition the bug needs.** A helper that built its line
  with a plain `[Up]` would have let a broken `contains("[Up]")` predicate pass — the real code
  colourises the status, so the literal never appears.

### 7.3 Platform gotchas

**Windows**
- **The first PDH performance-counter touch in a process costs ~180–195 ms**, paid once by
  whichever call gets there first — which makes several independent costs look like one mystery
  constant. `CpuRefreshKind::everything()` sets `frequency`, and Windows `init_cpus` calls
  `get_frequencies()` only when that flag is set: 195.5 ms → 0.5 ms by asking only for what a
  selected field reads.
- **sysinfo synthesises the Windows load average from a PDH counter sampled every 5 seconds
  into a process-local static seeded at zero**, so a fetch tool can never observe anything but
  that zero.
- **SMBIOS Speed is at offset 0x15, not 0x14** (0x13–0x14 is Type Detail). Self-consistent unit
  tests encoded the wrong offset and passed; comparing live output to WMI exposed it.
- **`SP_DEVICE_INTERFACE_DETAIL_DATA_W`: `cbSize` is 8 on x64, but `DevicePath` starts at offset
  4.** Using one constant for both chops two characters off every device path, and the only
  symptom is `CreateFileW` failing on a device that plainly exists — which reads as "this
  machine has no battery".
- **`GetIfTable2` returns one row per NDIS filter bound to an adapter**, each carrying the
  adapter's counters again. Exclude `FilterInterface`; do **not** keep only `HardwareInterface`,
  which drops tunnel interfaces like WireGuard that carry real traffic.
- **Use `GetIfTable2`, not `GetIfTable`**: the older `MIB_IFROW` has 32-bit octet counters that
  wrap every 4 GB.
- **`GAA_FLAG_SKIP_DNS_SERVER` was set**, so `FirstDnsServerAddress` was declared and guaranteed
  null. Check the flags before claiming a struct field is populated.
- **Access rights differ per IOCTL family**: the storage IOCTLs are `FILE_ANY_ACCESS` and answer
  on a zero-access handle; the battery IOCTLs are `FILE_READ_ACCESS` and need `GENERIC_READ`.
  Neither needs elevation — but probe it before designing around it.
- **Stock Windows ships no EGL**, so there is no headless OpenGL path: WGL needs a device
  context, which needs a window, which needs a registered class. Create it hidden, tear it down
  behind a drop guard — a leaked window class makes the *next* registration fail, presenting as
  "no OpenGL".
- **`-NoProfile` is not a PowerShell speed fix** — measured: bare `powershell -Command exit` is
  893 ms with a profile and 878 ms without. The ~642 ms profile figure is about pwsh 7, not
  Windows PowerShell 5.1. Only removing the spawn removes the cost.
- **Windows Terminal's reported version is the MSIX *package* version**, readable only from the
  install folder's name. The executable's file-version resource is an internal build number that
  matches nothing.

**macOS**
- **`getifaddrs`'s `if_data` byte counters are 32-bit and wrap every 4 GiB** — a development
  machine sat at 77% of that ceiling on one boot, so the wrap would have produced a
  plausible-looking wrong rate mid-session. Use `sysctl(NET_RT_IFLIST2)` / `if_data64`.
- **`if_data64` is 4-byte aligned with `u64` fields**, so `&data.ifi_ibytes` is undefined
  behaviour (rustc rejects it as E0793). **Copy, never borrow.**
- **System frameworks do not `dlopen` by short name** — the full
  `/System/Library/Frameworks/X.framework/X` path is required, or the field silently vanishes.
- **The CGL profile attribute decides the OpenGL version reported**: no attribute or legacy
  gives `2.1`, a core profile gives `4.1` on the same machine. Writing the obvious thing reports
  less than half what the machine supports, as a perfectly plausible string.
- **Brightness lives on `AppleARMBacklight`** on Apple Silicon — the documented
  `IODisplayConnect`, `AppleBacklightDisplay`, `AppleCLCD2` and `IOMobileFramebufferShim` all
  return nothing.

**Linux**
- **`/proc/diskstats` counts 512-byte sectors regardless of the device's `hw_sector_size`.**
  Keying off the hardware value inflates every figure 8× on a 4 KiB-sector drive.
- **`resolvectl`'s per-link `Default Route:` is a DNS-routing flag, not the routing table** — it
  was `yes` for both a VPN link and the Wi-Fi link simultaneously. Resolve the default route
  from `/proc/net/route` instead. A resolvable default link with *no* domain must report
  nothing rather than falling back to the merged list, which resurrects the VPN's domain.
- **The kernel prints capability bitmaps most-significant word first**, so the *last* word holds
  bits 0–63. Getting it backwards inverts every capability test silently.
- **On a Logitech Unifying/Bolt receiver, no kernel-visible signal distinguishes a keyboard from
  a mouse.** Handlers, `capabilities/rel`, the alphabet key block, `INPUT_PROP`, udev
  `ID_INPUT_*`, USB HID `bInterfaceProtocol` and the HID report descriptor itself are all
  identical — the receiver synthesises one merged descriptor per paired device. fastfetch
  classifies from those and gets it wrong in both directions. Do **not** "improve" this with a
  capability heuristic; the data to support one does not exist.
- **SQLite `Connection::open` is read-write**, so the root-owned `0644` rpmdb fails on **every
  query** (not on `open()`) with "attempt to write a readonly database" — which is why a guard
  around the open never fired. `mode=ro` does not help either; `immutable=1` does.

**Cross-platform**
- **A Vulkan instance below 1.2 silently ignores the `pNext` chain** — a call that succeeds
  while returning empty strings and no error. And `vkEnumerateInstanceVersion` returns the
  *loader* version, not the device `apiVersion`: the cheap call answers a different question,
  and both are plausible-looking version numbers.
- **Mesa enumerates the software rasteriser `llvmpipe` as a CPU device beside the real GPU**, so
  taking the first enumerated device reports software rendering on a working machine.
- **ANSI stripping must match the whole `ESC [ … <final byte>` form, not SGR (`m`) only.** Chafa
  opens a run with `\x1b[?25l`, so an SGR-only strip leaves exactly 6 characters behind — the
  suspiciously *constant* error across widths is the tell.
- **Terminal cells are indivisible, so a correctly-rounded `c`×`r` rectangle still stretches an
  image.** Kitty forces the image into whatever rectangle it is given; emit only the limiting
  dimension and let it derive the other.

### 7.4 Release, packaging and publishing

- **This repo squash-merges with `squash_merge_commit_message=COMMIT_MESSAGES`**, so the commit
  that lands on `main` takes its body from the **branch commit**. Editing the PR body changes
  nothing. On a multi-commit branch the bodies are **concatenated**, so a trailer on every
  commit becomes a duplicate trailer on `main` — put it on the last commit only, or squash
  locally first. Read the setting from `gh api repos/l1a/retch` rather than assuming it.
- **`git tag -a -F <file>` applies `--cleanup=strip`, which DELETES every line beginning with
  `#`.** A tag message lost three `#NNN —` headings while all surrounding prose survived, and
  nothing warned. Use `--cleanup=verbatim`, word the headings as `PR #NNN`, and **diff the tag
  message against the intended text before pushing** — a pushed tag is far more annoying to fix.
- **An expired crates.io token 403s at *upload*, not at start**, so it reads as a crate
  permissions problem. The credentials file existing proves nothing about its validity. This
  blocked two consecutive releases; `cargo owner --list retch-cli` is an authenticated read that
  proves the token up front.
- **Check the index against the pin every release.** A two-crate publish and a CLI-only publish
  are both normal, and assuming either is wrong. `publish-check` skipping the retch-cli dry run
  before a release is the correct behaviour, not a failure.
- **The AUR RPC lags a push by minutes to hours.** `git ls-remote` is authoritative; a stale
  `rpc/v5/info` reading immediately after a push is documented behaviour, not a broken hook.
- **COPR runs `.copr/Makefile` inside mock, which sets `HOME=/builddir` *and* moves
  `%{_topdir}`.** Reproducing the environment with only one of those does not reproduce the
  bug. Verifying "exactly what COPR runs" in a plain container was true of the *command* and
  false of the *environment* — and the environment was the half that mattered.
- **Homebrew 6.0+ refuses third-party taps until `brew trust` has been run**, and reports it as
  `invalid syntax in tap!` for a formula whose syntax is fine. The `brew` CI job cannot catch
  this: a locally-created `brew tap-new` bypasses the trust gate entirely.
- **`tar --exclude-vcs-ignores` does not implement `.gitignore` semantics.** Against this repo's
  ignore file it excluded a bare filename and kept both the directory form and the anchored
  form — so the first `.copr/Makefile` packed `WIP.md` and the auto-memory directory into the
  SRPM. Assert on the archive's contents, both what must not ship and what must.
- **Verify a release from the channel, not from the publish exit code.** Install the published
  crate into a throwaway root and *run* it; check the GitHub Release's `retch.1` is
  byte-identical to the committed page; check COPR per chroot rather than the aggregate, and
  check the published repo rather than the build state. A duplicate-sha256 audit across all
  release bodies is cheap and is the only thing that ever caught a corrupted nix hash.

### 7.5 Tooling and environment

- **`just` parses `{{` inside a recipe body before the shell or Python ever sees it** — an
  incidental `{{` in an embedded heredoc breaks the whole Justfile.
- **In a `#!` shebang recipe, `just` does NOT strip a leading `@`** — that is plain-recipe
  syntax. The shell receives a command literally named `@/usr/bin/python3` and exits 127. This
  shipped twice, the second time in a session where the first write-up had already been read:
  **a documented trap is not a guard**, which is why `gate_conformance.py` now refuses the
  shape.
- **`.git` is synced by Syncthing**, so creating a branch on one host switches every peer's
  checkout with it. Self-heals while one host is driving; two hosts on different branches would
  fight. After any multi-host session check for debris:
  `git for-each-ref | grep sync-conflict` — a `git push --tags` would publish it.
- **A Syncthing conflict copy may be the *good* file.** Hash HEAD, the working copy and every
  conflict copy before discarding anything; it has gone both ways.
- **Never `mktemp` in `/tmp` and `mv` into a Syncthing folder.** `/tmp` is tmpfs, so the `mv` is
  a cross-filesystem copy and coreutils preserves the SELinux context — landing `user_tmp_t`
  (and mktemp's 0600) in a `container_file_t` directory. The Syncthing container cannot read
  that, and the entire synced folder wedges on one file while Unix permissions look perfectly
  normal. Create the temp file **in the destination directory** and `chmod 0644`.
- **The session scratchpad is on tmpfs**, so building there consumes RAM — a 475 MB `target/`
  was enough to trip the OOM guard. Put an A/B worktree on a real filesystem.
- **A one-shot hyperfine number at the ~5 ms scale is not a measurement.** Re-run before
  reporting a regression at that magnitude; ratios travel between runs, absolutes do not.
- **Benchmark A/B needs a control**, and the honest signal is often the direction flipping
  across repeats. Compare `main` against *itself* in the same session before believing a gap.
- **Before removing a constraint, find out what it protects.** The five-deep `needs:` chain in
  `benchmark.yml` looks like an obvious mistake — five independent platform jobs, run one after
  another, for no stated reason. It is not: every job pushes the *same* `data.js` on the *same*
  branch, so the chain is the only thing preventing five concurrent pushes from racing. The
  giveaway was in the artifact, not the config — one file holding all eight suites. A `needs:`
  with no comment explaining it is a question, not an answer; go and find the coupling before
  deleting it, and leave a comment behind so the next reader does not have to.
- **Serial-versus-parallel is measurable from the Actions API, so measure it.** Compare the sum
  of job durations against the run's wall clock: if they agree, nothing overlapped. Per-job
  `started_at`/`completed_at` then shows the shape directly, and per-step timings say whether
  the cost is build or work — which decides whether caching or parallelism is the bigger win.
  Reading the YAML tells you the intent; the API tells you what happened.

---

## 8. Dependencies (Cargo.toml)
- `sysinfo` — System information gathering
- `clap` — CLI argument parsing
- `serde` + `toml` — Configuration
- `owo-colors` — Truecolor/RGB terminal coloring. **`src/theme.rs` hardcodes ANSI byte
  sequences that must equal what this crate emits**, so a bump of it is the change that can
  break them silently; tests pin `rgb_prefix`, `FG_RESET` and `ACTIVE_IFACE_PREFIX`.
- `icy_sixel` — Pure Rust Sixel encoding (graphics feature)
- `image` + `base64` — Graphical logo processing (graphics feature)
- `rusqlite` — RPM package counting. It bundles SQLite, so a bump changes the engine that has to
  honour `immutable=1`; the unit tests only assert string construction. Check
  `retch --fields packages` unprivileged after any bump.
- `chrono` — Date/time formatting
- `dirs` — Home and config directory resolution (`home_dir`/`config_dir`; a direct dependency of
  **both** crates, which is why a major bump widens two manifests)
- `unicode-width` — Terminal column measurement for layout

The optional `graphics` feature is **not** compiled by the default `--workspace` clippy, so
`just check` runs a separate `--features graphics` pass and CI has a dedicated
`graphics-feature` job.
