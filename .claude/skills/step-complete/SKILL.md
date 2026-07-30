---
name: step-complete
description: >
  Run the full step-completion ritual WHENEVER a learning-plan step of the active project is
  finished during a daily session — the moment Victor's code for the step works, is tested, and is
  committed (or he says the step is done: "step X terminado", "hemos acabado el step", "mark the
  step complete", "ya está el step"). CLAUDE.md mandates updating three places after every completed
  step, and the real failure mode is doing it partially — updating PROGRESS.md but forgetting the
  ✅ in PLANNING.md or the README. This skill makes the ritual atomic: all three, plus marking the
  step's concepts as demonstrated in the coverage files, or flag why not.
  Interview-prep is NOT part of this ritual (dropped 2026-07-13 — Victor adds those separately,
  on request, not automatically on step completion). Do NOT trigger for ordinary commits mid-step,
  notes-only sessions, or the audit pipelines. (Projects 01-06 are closed - their extraction format,
  the "Key patterns introduced" table, is N/A in practice.)
---

# Step-completion ritual (daily session)

A learning-plan step just finished. CLAUDE.md ("After every learning plan step is completed")
requires three updates — PLANNING.md, PROGRESS.md, the README — and this ritual adds a fourth,
coverage evidence marking (step 3), so the step's concepts are recorded as *demonstrated* and not only
as done. Do all four, in this order, without being asked. If one genuinely does not apply, say so
explicitly instead of silently skipping it.

Interview-prep questions are **not** part of this ritual — Victor asked (2026-07-13) to stop adding
them automatically on step completion. Only add interview-prep questions when he asks for them
directly, in session.

## 1 — PLANNING.md: mark the step

Append `✅` to the completed step's heading (e.g. `### Step 5 — TimeEntry workflow ✅`). Add a short
note under the step only if something changed versus the plan. This marker is what makes
`progress-update` runs self-sufficient (its Format B extraction reads ✅ before falling back to
hints) — never skip it.

## 2 — PROGRESS.md: extract the step's concepts

Read the completed step's concept source per its format (project 07: the `**Concept learned:**`
line; projects 08+: the "New concepts introduced" list routed by its Topic column). **Route each
concept with the Step 4 mapping table in
`notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md`** — read it before writing; like
the README standard below, it only auto-loads inside `progress-update`, so an inline edit without
it silently mis-routes (the trap it exists for: pure Java constructs like `Optional<T>` or
`BigDecimal.compareTo()` land in Spring Boot just because they appeared in a Spring project —
`Optional<T>` is Java; `@Autowired` is Spring). Write each concept as **one specific thing per
line**, key syntax in backticks, optional short dash-clause, never multi-line. Also update the project's summary line /
sub-headings to the new step status (e.g. "Steps 1–5 done, Step 6 in progress"). PROGRESS.md
follows the active branch (CLAUDE.md, 2026-07-14 — `main` only receives merges via PR) — commit it
from the repo root.

## 3 — Coverage: mark what the step demonstrated

The step's concepts were just written in code. **Invoke the `coverage-mark` skill** with the concepts you
extracted in step 2, the level Victor is working at, and the project number; it finds each concept's bullet
in `notes/{topic}/coverage/{LEVEL}.md` and its mirror and appends the `✅ NN` evidence marker, so the
coverage file records how much of the hiring floor is demonstrated and not only planned.

Route the concepts with the **topic-ownership block in
`notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`**, not with step 2's PROGRESS.md
routing — the two vocabularies differ (`notes/security/` owns an access-control concept that PROGRESS.md
files under Spring Boot). `coverage-mark` states this rule; follow the version in that skill.

This step **never adds a coverage bullet**. A concept with no bullet is reported as a possible gap and left
for `/coverage`; authoring scope is not part of a step close.

## 4 — Project README: "What I learned"

**Before touching the README, read `notes/prompts/projects/readme/_internal/_readme-standard.md`** — like the
note standards, it only auto-loads inside `readme-audit`, so an inline edit without it silently
misses the format. Keep the entries short bullets, no explanations (details belong in `notes/`).

## Commits

These are docs/study updates, not project code. Per CLAUDE.md: Claude may commit `notes/` files
directly (atomic, double `git status` check); PLANNING.md, the README, and PROGRESS.md all follow
the active branch (`main` only receives merges via PR) — for those, give Victor the commit commands
in the standard copy-paste format (one command per code block), one atomic commit per file/change.

## If the whole project just finished

Remind Victor to update the "Current study progress" section of CLAUDE.md and the projects table in
PROGRESS.md, per CLAUDE.md.
