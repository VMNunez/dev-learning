# Practice-plan audit — the entry point for auditing a practice track's plan

Run this **inside Claude Code**. It audits a `practice/{track}/PLANNING.md` against
`_practice-plan-standard.md`, fixes what falls short, and commits — hands-off.

A project plan gets `plan-audit`. A practice track had nothing: `practice/sql/PLANNING.md` was written
by hand, has never been reviewed by anything cold, and is the file that decides what gets drilled for
months. This closes that gap.

> **▶ Run first:** nothing. The audit reads `PROGRESS.md` and the exercise files as evidence, but it
> does not need them refreshed first — a stale `PROGRESS.md` is itself one of the findings.

> **Run-start check (step 0):** before anything else, run the check in
> `notes/prompts/_pipeline-self-report.md` — read this prompt's own `_last-run-report-practice-plan-audit.md`
> and, if its `Status` is `open`, surface that finding in one line before proceeding.

**Internal pieces this orchestrates** (never launched directly):
`_practice-plan-standard.md` (the bar) · `notes/prompts/_pipeline-self-report.md` (the final step).

There is no separate reviewer prompt: each specialist's mandate is its slice of the standard, given in
the dispatch below. That is deliberate — four slices of one standard do not justify a fifth file.

---

## How to use

Open a fresh chat inside Claude Code, paste the config block, let it run.

```
TRACK = sql
```

`TRACK = sql` audits `practice/sql/PLANNING.md`. Any other value must name a folder under `practice/`
that contains a `PLANNING.md`; if it does not exist, stop and say so — never audit a plan that is not
there, and never create one from scratch here (writing a new practice plan is not this prompt's job).

---

````
## Configuration — edit only this block

TRACK = [sql]

Use TRACK wherever the prompt refers to {TRACK}. The plan under audit is `practice/{TRACK}/PLANNING.md`.

---

You are the orchestrator. You stay light: you dispatch, wait, collect, gate, commit. **You never audit
the plan in your own context and you never read the standard** — each specialist reads only its slice.

> **Branch guard (step 0):** run `git branch --show-current`. Study materials commit on the active
> branch (CLAUDE.md). If you are on **`main`**, stop and ask Victor which branch to use.

## Phase 1 — Evidence snapshot (orchestrator, cheap)

Before dispatching anything, gather the ground truth the specialists will check the plan against —
counts, not contents:

- `ls practice/{TRACK}/` — the files that actually exist.
- For each exercise file: `grep -c` for the exercise header patterns, so you hold a real count per file.
- `grep -n "✅\|⏳\|done\|in progress" practice/{TRACK}/PLANNING.md` — the status markers, as the
  history baseline for the gate below.

Pass this snapshot to the `steps-and-counts` specialist. It is evidence, not a finding: the plan is
wrong only where it disagrees with it.

## Phase 2 — Specialists, one concern each, sequential

Four specialists. They all edit the same file, so they **never overlap** — dispatch in this order,
waiting for each. None of them commits.

For each, launch a fresh `general-purpose` subagent, `model: opus`, `run_in_background: false`:

> Read `notes/prompts/practice/_practice-plan-standard.md` — **only the sections your concern owns**,
> listed below — and audit `practice/{TRACK}/PLANNING.md` against them. Fix what falls short **directly
> in the file**. Do **NOT** commit. Return a **check-by-check trace**: one line per check you own,
> each `check · verdict · what you changed (or "no change")`. Never paste plan content back. End with
> any cross-concern ripple the orchestrator must reconcile.
>
> **Read-to-EOF guard:** the plan is long. Run `wc -l` on it first; if it is near or over 2000 lines,
> read it in passes with `offset` to the real end. Open your report with
> "N lines, read to EOF" — a report without that line is rejected.

| # | Concern | Owns | Also reads |
|---|---------|------|------------|
| 1 | `learning-design` | Section B, all ten items | the step entries (§6), §2, §3 |
| 2 | `coverage-and-scope` | Section D invariants 1, 2, 5 · Section E | the coverage file for {TRACK}, §5, §6, §11 |
| 3 | `steps-and-counts` | Section C (all) · Section D invariants 3, 4, 6, 8, 9 | §0, §5, §6, §8 · `PROGRESS.md` · **the orchestrator's Phase 1 snapshot** |
| 4 | `gates-and-rituals` | Section A (every required section present and non-empty) · Section D invariant 7 | §2, §4, §7, §9 · the prompts §2 tells Victor to run |

Concern 4 also owns **C4** — the plan and the prompts it invokes must agree on paths, topic names and
config keys. Where they diverge it decides which side is wrong per C4's rule and fixes **that** side,
even when the fix lands in the prompt file rather than the plan. Say so explicitly in its trace.

**Acceptance check.** A specialist's report is acceptable only if it opens with the read-to-EOF line
**and** has one row per check its slice owns. Otherwise re-dispatch it once, quoting what was missing;
if it fails again, record the gap in the self-report and continue — never silently accept a partial
trace.

**Ripples.** If a specialist's fix invalidates a concern already reviewed, re-dispatch that one —
**at most one re-dispatch per concern per run**. Remaining ripples go in the self-report, except a
verified factual error (a wrong path, count or cross-reference, checked against disk), which the
orchestrator corrects itself in **every** occurrence before committing.

## Phase 3 — History-preservation gate

Re-run the Phase 1 status greps. **Every step marked done before the run must still be marked done.**
Renumbered or reworded is fine; unmarked, downgraded or missing is a failure. A plan that loses its
record of completed work is worse than an unaudited one.

On failure: re-dispatch `steps-and-counts` once, quoting the lost lines verbatim. If it still fails,
**abort without committing**, leave the working tree, and report exactly what was lost.

## Phase 4 — Commit

The specialists left every fix in the working tree; **the orchestrator makes the single commit.**
Gate first: if the acceptance check or the history gate ended in a failed state, do not commit.

Otherwise: `git status` → stage → `git status` again → commit. Only the plan, plus any prompt file
concern 4 corrected under C4 (name it in the report — a prompt fix riding along unannounced is how a
tracking commit swallows machinery changes).

```
git add practice/{TRACK}/PLANNING.md
```
```
git commit -m "docs: audit practice/{TRACK}/PLANNING.md — <one-line summary of the main fixes>"
```

**`PLANNING.md` under `practice/` is machinery, not Victor's work** — it is a tracking document this
pipeline authors, so the auto-commit exception in CLAUDE.md covers it, exactly as it covers a project
`PLANNING.md` in `plan-audit`. **The exercise files it describes are Victor's and are never touched
here** — not staged, not edited, not renumbered. A specialist that wants an exercise file changed says
so in its trace and the orchestrator reports it as a recommendation.

## Hard rules

- **Top model for every subagent** (`model: opus`). Four cold auditors that fire rarely on the file
  that governs months of study is the wrong place to save tokens.
- **The orchestrator never reads the standard or audits anything.** The moment it starts judging, the
  cold-reviewer property is gone.
- **Strict sequence, never parallel** — one file, four editors.
- **Never write a plan from nothing.** This prompt audits; a missing plan is reported, not authored.
- **Findings are fixed in place, not reported for later.** A report Victor has to apply by hand is the
  failure mode this whole system exists to avoid.

## Final step — pipeline self-report

Read `notes/prompts/_pipeline-self-report.md` and execute it for this run: write
`notes/prompts/practice/_last-run-report-practice-plan-audit.md`, update `notes/prompts/_run-tracker.md`,
commit both on their own, print the five bullets — and run the refinement step, which is what makes
this prompt improve from its own runs instead of from theory.

````
