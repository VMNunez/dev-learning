---
name: step-complete
description: >
  Run the full step-completion ritual WHENEVER a learning-plan step of the active project is
  finished during a daily session — the moment Victor's code for the step works, is tested, and is
  committed (or he says the step is done: "step X terminado", "hemos acabado el step", "mark the
  step complete", "ya está el step"). CLAUDE.md mandates updating four places after every completed
  step, and the real failure mode is doing it partially — updating PROGRESS.md but forgetting the
  ✅ in PLANNING.md or the README. This skill makes the ritual atomic: all four or flag why not.
  Do NOT trigger for ordinary commits mid-step, notes-only sessions, or the audit pipelines. (Projects 01-06 are closed - their extraction format, the "Key patterns introduced" table, is N/A in practice.)
---

# Step-completion ritual (daily session)

A learning-plan step just finished. CLAUDE.md ("After every learning plan step is completed")
requires four updates — do all of them, in this order, without being asked. If one genuinely does
not apply, say so explicitly instead of silently skipping it.

## 1 — PLANNING.md: mark the step

Append `✅` to the completed step's heading (e.g. `### Step 5 — TimeEntry workflow ✅`). Add a short
note under the step only if something changed versus the plan. This marker is what makes
`progress-update` runs self-sufficient (its Format B extraction reads ✅ before falling back to
hints) — never skip it.

## 2 — PROGRESS.md: extract the step's concepts

Read the completed step's concept source per its format (project 07: the `**Concept learned:**`
line; projects 08+: the "New concepts introduced" list routed by its Topic column). Add each
concept to the correct technology section — **one specific thing per line**, key syntax in
backticks, optional short dash-clause, never multi-line. Also update the project's summary line /
sub-headings to the new step status (e.g. "Steps 1–5 done, Step 6 in progress"). PROGRESS.md lives
on `main` — commit it from the repo root.

## 3 — Project README: "What I learned"

**Before touching the README, read `notes/prompts/projects/readme/_readme-standard.md`** — like the
note standards, it only auto-loads inside `readme-audit`, so an inline edit without it silently
misses the format. Keep the entries short bullets, no explanations (details belong in `notes/`).

## 4 — Interview-prep questions

Add questions for what the step taught, to BOTH `notes/interview-prep/en/{topic}.md` and
`es/{topic}.md` (same question, same section, translated). This is study content — the
`study-content-writer` skill's rules apply: load
`notes/prompts/knowledge/interview-prep/_interview-prep-standard.md` first.

## Commits

These are docs/study updates, not project code. Per CLAUDE.md: Claude may commit `notes/` files
directly (atomic, double `git status` check); PLANNING.md and the README follow the project's
feature branch and PROGRESS.md goes on `main` — for those, give Victor the commit commands in the
standard copy-paste format (one command per code block), one atomic commit per file/change.

## If the whole project just finished

Remind Victor to update the "Current study progress" section of CLAUDE.md and the projects table in
PROGRESS.md, per CLAUDE.md.
