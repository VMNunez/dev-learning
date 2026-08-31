# README audit — the single entry point for reviewing a project's README(s)

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It is the only readme prompt Victor launches. It reviews and fixes a
project's README(s) to the full standard, hands-off: one README at a time, each **authored/fixed then
cold-reviewed by two subagents**. Run it after a project or a big feature, or whenever a README feels
stale — and always **before** `portfolio-audit`, which assumes the READMEs are correct.

- **Angular projects (01–06)** — one README (`global`).
- **Full-stack projects (07+)** — three READMEs (`global`, `backend`, `frontend`), different audiences.

> **▶ Run first:** nothing — it only needs `PLANNING.md` and the existing README(s). It is itself a
> prerequisite of `portfolio-audit`.

> **Run-start check (step 0):** before anything else, execute the decision table in `notes/prompts/_internal/_pipeline-self-report.md` against this prompt's own `_last-run-report`; never restate the shared `Status:` meanings here.

**Internal pieces this orchestrates** (you never launch these directly):
`_readme-standard.md` (the bar) · `_readme-write-prompt.md` (author) · `_readme-review-prompt.md` (reviewer).

> **Auto-committed** (authorized 2026-08-29, reversing the earlier hand-over rule). `_session-rules.md`
> permits the agent to commit a project's `README.md` directly, and this pipeline uses that permission:
> the subagents fix the files and the orchestrator **runs one commit for the project** — one `git add`
> per README that actually changed, never one commit per README and never all three by default. The
> summary of changes is still printed, now for review *after* the commit rather than as a gate before
> it. The rule is owned by `_readme-standard.md` → "Summary + commit rule". There is no `DRY_RUN`.

---

## How to use — recipes

Open a fresh chat **inside the supported agent runtime**, paste the whole prompt below, fill only the config block, and
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

**After the run:** review the changed READMEs — they are already committed. Then skim the
**pipeline self-report** it prints (also saved to `_last-run-report.md`) — only if it shows a real
failure of the machinery do these prompts get edited, in a separate session.

---

````
## Configuration — edit only this block

PROJECT_PATH = [projects/01-todo-list | ... | projects/06-hr-portal | projects/07-timetrack | all]

## PROJECT_PATH = all runs on every project in turn — see notes/prompts/_internal/_batch-mode.md.
## Batch targets (ordered): projects/01-todo-list, 02-weather-app, 03-expense-tracker, 04-meal-finder, 05-task-manager,
## 06-hr-portal, 07-timetrack. The READMEs are derived per type (by project number: 01–06 Angular-only,
## 07+ full-stack): angular → [global]; full-stack → [global, backend, frontend].

Use PROJECT_PATH wherever the prompt refers to {PROJECT_PATH}.

---

You are the orchestrator for reviewing Victor's README(s), hands-off. First read
`notes/prompts/projects/readme/_internal/_readme-standard.md` so you know the bar, which READMEs each project type
has, and the commit rule. Then run the procedure below. You stay light: the subagents read the rules and
edit the files — you never write a README in your own context.

## If PROJECT_PATH = all
Per `notes/prompts/_internal/_batch-mode.md`, expand `all` into the ordered project list from the config block and
run the **single-project procedure below once per project**, finishing one before the next. Put each
project's report under a `### [project]` heading, and after the last print the `_batch-mode.md` summary
table (`Project | READMEs changed`) — this table replaces `_batch-mode.md`'s generic
`Target | Result | Files changed` one. `_batch-mode.md`'s "Commits" section binds here with its target
read as the **project**, never the individual README, so two projects are never squashed together — and
with one override: a project's set is one `git add` per changed README plus one `git commit`, not that
section's single `add` + `commit` pair. Once a project is finished, carry forward only its
summary table row — drop its per-target detail from your working context before starting the next project.
Otherwise, follow the procedure once.

## Single-project procedure

Derive the target list from the project type: **Angular → `[global]`**; **full-stack → `[global,
backend, frontend]`**.

For **each** target, run the author → reviewer pair below. Different targets touch different files and
none of the subagents commit, so you may run the pairs for different targets in parallel — launch the
authors for all targets in one block, wait for all, then launch the reviewers in one block. Within a
target the reviewer must always run **after** its author.

**Subagent A — author.** Launch one `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`
(recruiter-facing prose — the portfolio's front door):

> Read `notes/prompts/projects/readme/_internal/_readme-write-prompt.md` and execute it in full for
> `PROJECT_PATH = {PROJECT_PATH}` · `TARGET = «this target»`. Fix that one README to the standard.
> **Do NOT commit.** Report the summary of changes and any intentional placeholder.

Wait for A, then **subagent B — reviewer.** Launch a second, independent `role-appropriate` subagent,
`reasoning tier: standard`, `execution: foreground` (conformance against a highly prescriptive standard —
the structure guarantees quality here, and the author already ran at the top tier):

> Read `notes/prompts/projects/readme/_internal/_readme-review-prompt.md` and execute it in full for
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
commit a README whose pipeline did not complete.

## Cross-README coherence (full-stack only)

Because the three targets are written by separate subagents, the same decision can be described
inconsistently between them (a tradeoff or pattern told one way in `global` and another in `backend`).
After the pairs finish, launch one more `role-appropriate` subagent (`reasoning tier: standard`,
`execution: foreground` — cross-checking three files for contradictions, changes nothing) — do
**not** read the READMEs yourself; they stay out of your context:

> Read the three READMEs of `{PROJECT_PATH}` (`README.md`, `backend/README.md`, `frontend/README.md`)
> and `{PROJECT_PATH}/PLANNING.md`, and nothing else. Check that every shared decision (the main tradeoffs, the key patterns, the tech
> stack) reads consistently across them, with no contradiction. Change nothing. Report in ≤ 10 lines:
> `COHERENT`, or one line per conflict — which README is wrong, which section, and what the correct
> version (per the other READMEs and PLANNING.md) says.

If it reports conflicts, re-dispatch the **reviewer** subagent for each README that is wrong, quoting
the conflict line so it knows exactly what to align — and note it in the summary. Angular projects have
one README, so skip this.

## Finishing

Print a **summary of changes** across all targets (one line per section changed, grouped by README), then
**run the commit yourself**, per the **Auto-committed** note at the top of this prompt (`git status`
immediately before staging and before committing).

**What the set covers: one commit for this project**, staging one `git add` per README that actually
changed — never one commit per README, and never all three by default. A target excluded by the Failure
protocol is left out of the set even if its file changed. On `PROJECT_PATH = all`, one such set per
project, printed together at the end in project order. Example, for a full-stack project whose three
READMEs all changed:

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
`notes/prompts/projects/readme/_internal/_last-run-report.md` (overwrite; header: date + project(s)) — meta-
observations about the run itself, not the READMEs. This is the evidence a later session uses to decide
whether these prompts need changing, so be honest, including "nothing to report":
- **Report discipline** — which subagents, if any, blew their line budget or returned reports that had
  to be discarded.
- **Trace verification** — reviewer traces that were missing/incomplete, re-dispatches made, any false alarm.
- **Coherence** — conflicts the coherence subagent found (a sign the author prompts under-specify a
  shared decision), or `COHERENT`.
- **Failure protocol** — subagents that errored, second failures, any README excluded from the commit.
- **Anything else** that made the run harder than it should be.
- **Verdict** — "pipeline clean" or "change worth considering: X" (the uniform criterion from
  `notes/prompts/_internal/_pipeline-self-report.md`, of which these bullets are this pipeline's tailored version).

Six bullets, one line each. This file is prompt-system machinery (not a project file), so **commit it
directly** under the notes/prompts exception, per `_pipeline-self-report.md` → "How to commit it" —
`git status` before add and before commit, staging `_last-run-report.md` **and** `_run-tracker.md`
(plus `_breach-log-readme-audit.md` when this run wrote a row or moved a disposition in it), message
`docs: pipeline self-report for readme review of {PROJECT_PATH}`. (It is a separate commit from the README set.) The prompts stay frozen
unless this report shows a real failure. Also print the report in chat.

## Hard rules

- **Commit the READMEs yourself**, as **one commit for the project**, not one per README — the same
  `_session-rules.md` permission `readme-concept-add` uses, and the same shape as `plan-audit`
  (`PLANNING.md`) and `review-audit` (`PROJECT-BACKLOG.md`). Never ask Victor to run it. The other files
  this flow commits are `_last-run-report.md` and `_run-tracker.md` (plus the breach log when this run
  wrote one), separately, under the notes/prompts exception.
- **One README per author→reviewer pair.** Never let one subagent write all three — the focused,
  audience-specific pass is the whole point.
- **Only commit READMEs that changed** — never `git add` all three by default.
- Never skip the reviewer pass.
````
