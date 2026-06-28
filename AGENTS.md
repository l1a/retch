# AGENTS.md

This file contains high-level, portable instructions for any AI agent working on this repository.
It details overall coding rules, source control workflows, testing processes, and agent synchronization methodologies.
These rules are designed to be project-agnostic and should be followed consistently across different projects.

---

## 1. Source Control & Commit Workflows
- **Branch Naming**: Always name new git branches using the prefix pattern `{feature,fix,chore,etc.}/<branch-name>`.
- **Workflow Mandate**: You MUST create and switch to your feature/fix branch *before* starting any file modifications or executing commands to avoid working on `main` by mistake.
- **Commit Summaries**: Write short, clear subjects (max 50 chars) in the imperative mood.
- **AI Attribution**: Use `Assisted-By: <model name>` (no email address) as the trailer line in commits. Use the actual model name of the AI assistant that helped (e.g. `Gemini 3.5 Flash`, `Claude Sonnet 4.6`, `Claude Opus 4`, etc.).
- **Constraint**: NEVER run background `git commit` or `git push` without explicit authorization.
- **Mandate**: ALWAYS ask for explicit permission before submitting a Pull Request (PR) or performing a merge.
- **Branch Cleanup**: Delete feature branches from the remote after they are merged. Periodically prune abandoned branches that were never PRed.

## 2. Engineering Philosophy & Safety
- **Cognitive Circuit Breaker**: Before modifying files or running commands, identify if target files are managed by `chezmoi` (except if located in `~/git` or `~/Sync/git`). If managed, prioritize chezmoi native commands.
- **Absolute Accuracy**: Absolute accuracy is the primary metric. Speed is irrelevant.
- **The Reasoning Trace**: Before implementing any multi-file change, you MUST output a `[REASONING TRACE]` covering Invariants, Subsystem Impact, and Edge-Cases.
- **Empirical Validation**: Test changes locally (compilation, lints, formatting, and unit tests) before proposing a push.

## 3. Cross-Machine Work Handoff (WIP.md)
Any agent starting a session on a repository utilizing cross-machine sync MUST read `WIP.md` before doing anything else.
- **Purpose**: `WIP.md` is a `.gitignored` file synced via Syncthing/Insync to carry context that cannot be inferred from git history alone (what is partially done, machine specs, active branch, next-step checklists, caveats).
- **When to Update**:
  - When switching to a new branch (clear old content, write new context).
  - Before switching machines or ending a session.
  - After pushing commits that change the state of the work.
  - After a PR is merged (set `Active Branch: none (main is current)`).
  - Whenever the next-step checklist changes.
- **What to Include**:
  1. **Machine**: OS, distro, and architecture of the last saved state (e.g. `Linux Fedora 44 x86_64`).
  2. **Active branch name** and PR URL (if open).
  3. **Latest commit hash** and message.
  4. **What was implemented**: Concise description of new/modified files.
  5. **Bugs fixed**: What went wrong and how it was resolved.
  6. **Current CI state**: Passing/failing.
  7. **Open tasks**: Checkbox list of remaining work.
  8. **How to resume**: Exact shell commands to check out, build, and verify.
  9. **Why this work**: Motivating context.
- **What NOT to Include**: Full code diffs, large file contents, detailed architecture docs.

## 4. Continuous Learning Loop
At the conclusion of any task involving a specific skill:
1. Did you encounter a failure, edge case, or nuance not currently documented in the skill?
2. Did the user have to correct your workflow?
3. If YES to either, you MUST automatically update the corresponding `SKILL.md` file with the new learning and synchronize the change before declaring the task complete.
