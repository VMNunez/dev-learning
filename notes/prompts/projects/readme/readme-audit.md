# README audit — the single entry point for reviewing a project's README(s)

Run this **inside Claude Code**. It is the only readme prompt Victor launches. It reviews and fixes a
project's README(s) to the full standard, hands-off: one README at a time, each **authored/fixed then
cold-reviewed by two subagents**. Run it after a project or a big feature, or whenever a README feels
stale — and always **before** `portfolio-audit`, which assumes the READMEs are correct.

- **Angular projects (01–06)** — one README (`global`).
- **Full-stack projects (07+)** — three READMEs (`global`, `backend`, `frontend`), different audiences.

> **▶ Run first:** nothing — it only needs `PLANNING.md` and the existing README(s). It is itself a
> prerequisite of `portfolio-audit`.

**Internal pieces this orchestrates** (you never launch these directly):
`_readme-standard.md` (the bar) · `readme-write-prompt.md` (author) · `readme-review-prompt.md` (reviewer).

> **Not auto-committed — by design.** Like `review-audit`, this writes README files inside the project
> folder, which follow the project's **feature-branch → PR → main** workflow. The subagents fix the
> files in the working tree and the orchestrator **hands Victor the commit command** — one per README
> actually changed. There is no `DRY_RUN`.

---

## How to use — recipes

Open a fresh chat **inside Claude Code**, paste the whole prompt below, fill only the config block, and
let it run. Pick the recipe:

**A · Review one project's README(s)**
```
PROJECT_PATH = projects/07-timetrack
```

**B · Review every project in one run**
```
PROJECT_PATH = all
```

**Rules of thumb:**
- Fill in **only** the config block. Everything below it is machinery — never edit it.
- The project type (and therefore which READMEs) is derived from the path — do not set it.

**After the run:** review the changed READMEs and run the commit command it hands you. Then skim the
**pipeline self-report** it prints (also saved to `_last-run-report.md`) — only if it shows a real
failure of the machinery do these prompts get edited, in a separate session.

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/01-todo-list | ... | projects/06-hr-portal | projects/07-timetrack | all]

## PROJECT_PATH = all runs on every project in turn — see notes/prompts/_batch-mode.md.
## Order: projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The READMEs are derived per type (by project number: 01–06 Angular-only,
## 07+ full-stack): angular → [global]; full-stack → [global, backend, frontend].

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}.

---

You are the orchestrator for reviewing Victor's README(s), hands-off. First read
`notes/prompts/projects/readme/_readme-standard.md` so you know the bar, which READMEs each project type
has, and the commit rule. Then run the procedure below. You stay light: the subagents read the rules and
edit the files — you never write a README in your own context.

## If PROJECT_PATH = all
Per `notes/prompts/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, finishing one before the next. Put each
project's report under a `### [project]` heading, and after the last print the `_batch-mode.md` summary
table (`Project | READMEs changed`). Once a project is finished, carry forward only its summary table
row — drop its per-target detail from your working context before starting the next project.
Otherwise, follow the procedure once.

## Single-project procedure

Derive the target list from the project type: **Angular → `[global]`**; **full-stack → `[global,
backend, frontend]`**.

For **each** target, run the author → reviewer pair below. Different targets touch different files and
none of the subagents commit, so you may run the pairs for different targets in parallel — but within a
target the reviewer must run **after** its author.

**Subagent A — author.** Launch one `general-purpose` subagent, `run_in_background: false`:

> Read `notes/prompts/projects/readme/readme-write-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. Fix that one README to the standard.
> **Do NOT commit.** Report the summary of changes and any intentional placeholder.

Wait for A, then **subagent B — reviewer.** Launch a second, independent `general-purpose` subagent,
`run_in_background: false`:

> Read `notes/prompts/projects/readme/readme-review-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. Audit the just-authored README hard against
> the standard and fix what falls short directly. **Do NOT commit.** Report the section trace, your
> verdict (PASS/FIXED), and whether the README changed.

**Verify the trace.** The reviewer's report must contain a section trace — one line per required
section for that target. If the trace is missing or skips sections, the audit was not a full pass:
re-dispatch the reviewer for that target once, telling it which sections lack a trace line.

Collect, per target, whether the README changed. Keep only the verdict, the changed-flag, and the
one-line-per-section summaries — do not accumulate anything longer in your context.

**Failure protocol.** If a subagent errors out or returns a report you cannot act on (no verdict, no
summary), re-dispatch that same subagent once with the same instructions. If it fails again, stop that
target, exclude its README from the commit command, and flag it clearly in the final summary — never
hand Victor a commit that includes a README whose pipeline did not complete.

## Cross-README coherence (full-stack only)

Because the three targets are written by separate subagents, the same decision can be described
inconsistently between them (a tradeoff or pattern told one way in `global` and another in `backend`).
After the pairs finish, launch one more `general-purpose` subagent (`run_in_background: false`) — do
**not** read the READMEs yourself; they stay out of your context:

> Read the three READMEs of `{PROJECT_PATH}` (`README.md`, `backend/README.md`, `frontend/README.md`)
> and nothing else. Check that every shared decision (the main tradeoffs, the key patterns, the tech
> stack) reads consistently across them, with no contradiction. Change nothing. Report in ≤ 10 lines:
> `COHERENT`, or one line per conflict — which README is wrong, which section, and what the correct
> version (per the other READMEs and PLANNING.md) says.

If it reports conflicts, re-dispatch the **reviewer** subagent for each README that is wrong, quoting
the conflict line so it knows exactly what to align — and note it in the summary. Angular projects have
one README, so skip this.

## Finishing

Print a **summary of changes** across all targets (one line per section changed, grouped by README), then
**hand Victor the commit** — do not run it (see the by-design note). Include only the READMEs that
actually changed, one `git add` per file, e.g.:

```
git add {PROJECT_PATH}/README.md
```
```
git add {PROJECT_PATH}/backend/README.md
```
```
git add {PROJECT_PATH}/frontend/README.md
```
```
git commit -m "docs: update {PROJECT_PATH} README(s) — <one-line summary of main changes>"
```

## Pipeline self-report (orchestrator, last)

After the commit hand-over, write a short **Pipeline self-report** to
`notes/prompts/projects/readme/_last-run-report.md` (overwrite; header: date + project(s)) — meta-
observations about the run itself, not the READMEs. This is the evidence a later session uses to decide
whether these prompts need changing, so be honest, including "nothing to report":
- **Report discipline** — which subagents, if any, blew their line budget or returned reports that had
  to be discarded.
- **Trace verification** — reviewer traces that were missing/incomplete, re-dispatches made, any false alarm.
- **Coherence** — conflicts the coherence subagent found (a sign the author prompts under-specify a
  shared decision), or `COHERENT`.
- **Failure protocol** — subagents that errored, second failures, any README excluded from the commit.
- **Anything else** that made the run harder than it should be.

Five bullets, one line each. This file is prompt-system machinery (not a project file), so **commit it
directly** under the notes/prompts exception — `git status` before add and before commit, stage only
`_last-run-report.md`, message `docs: pipeline self-report for readme review of {PROJECT_PATH}`. (The
never-auto-commit rule below applies to the README files, not to this one.) The prompts stay frozen
unless this report shows a real failure. Also print the report in chat.

## Hard rules

- **Never auto-commit the READMEs.** They follow the project's feature-branch workflow; always hand
  Victor the command. (The `plan-audit` / `portfolio-audit` auto-commit exception does not extend to
  them — same as `review-audit`.) The only file this flow commits itself is `_last-run-report.md` —
  prompt-system machinery under the notes/prompts exception.
- **One README per author→reviewer pair.** Never let one subagent write all three — the focused,
  audience-specific pass is the whole point.
- **Only commit READMEs that changed** — never `git add` all three by default.
- Never skip the reviewer pass.
````
