---
name: step-complete
description: >
  Run the full step-completion ritual WHENEVER a learning-plan step of the active project is
  finished during a daily session — the moment Victor's code for the step works, is tested, and is
  committed (or he says the step is done: "step X terminado", "hemos acabado el step", "mark the
  step complete", "ya está el step"). CLAUDE.md mandates updating three places after every completed
  step, and the real failure mode is doing it partially — updating PROGRESS.md but forgetting the
  ✅ in PLANNING.md or the README. This skill makes the ritual atomic: all three, plus the step's coverage
  work — authoring the bullet for a concept the checklist is missing, and marking what the code
  demonstrated — or flag why not.
  Interview-prep is NOT part of this ritual (dropped 2026-07-13 — Victor adds those separately,
  on request, not automatically on step completion). Do NOT trigger for ordinary commits mid-step,
  notes-only sessions, or the audit pipelines. (Projects 01-06 are closed - their extraction format,
  the "Key patterns introduced" table, is N/A in practice.)
---

# Step-completion ritual (daily session)

A learning-plan step just finished. CLAUDE.md ("After every learning plan step is completed")
requires three updates — PLANNING.md, PROGRESS.md, the README — and this ritual adds a fourth, coverage
(step 3), which does two things: it **authors** the bullet for a concept the checklist is missing, and it
**marks** what the step demonstrated. So the step's concepts end up recorded as part of the curriculum and
as *demonstrated*, not merely as done. Do all four, in this order, without being asked. If one genuinely
does not apply, say so explicitly instead of silently skipping it.

This is the step-level twin of `backlog-task-close`. That one fires on a **backlog task** — a concept that
came out of a review and was never planned — and additionally reconciles PLANNING.md and the backlog's
Closed ledger. This one fires on a **planned step**, so PLANNING.md only needs its ✅ and there is no ledger
to collapse. Both share the same coverage contract, through the same two skills.

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
sub-headings to the new step status (e.g. "Steps 1–5 done, Step 6 in progress").

Two rules that keep the file honest:

- If a concept is **already recorded from an earlier step**, do not duplicate it. Say so.
- If the step gives the `Professional level by topic` table real practical evidence, update that row's
  evidence cell too — a shipped, tested step is exactly the kind of demonstration that table is for.

PROGRESS.md follows the active branch (CLAUDE.md, 2026-07-14 — `main` only receives merges via PR) — commit
it from the repo root.

## 3 — Coverage: land the step's concepts on the checklist

The step's concepts were just written in code, so both halves of the coverage contract apply. Run them in
this order, for each concept from step 2:

**3a — Author the bullet if it is missing.** **Invoke the `coverage-bullet-add` skill** with the concept and
the level Victor is working at. It routes the concept to its owning `notes/` topic by altitude, searches the
level file, writes the bullet under the right section when it is genuinely absent, mirrors it into
`notes/coverage/{LEVEL}.md` with a diff check, and reports whether `/notes-plan {topic} {LEVEL}` is owed.
Pass it the **concept, not step 2's PROGRESS.md section** — that routing answers a different question, and
handing it over is how an access-control concept ends up under `spring-boot` when `notes/security/` owns it.

This is a deliberate change (2026-07-30): a step close used to only ever *flag* a missing bullet and leave
it for `/coverage`. It now authors it, because the concepts a project teaches are exactly the ones the
curriculum should absorb — a step that discovers a real concept and leaves no bullet behind is the gap this
ritual exists to close. Authoring stays inside the skill, under the coverage standard's contract; this
ritual never writes a bullet inline.

**3b — Mark it as demonstrated.** **Invoke the `coverage-mark` skill** with the same concepts, topic, level,
and the project's folder name. It appends the `✅ NN-slug` evidence marker to the matching bullet in the topic file and
the mirror, so the coverage file records how much of the hiring floor Victor can *prove* and not only what
he planned. This runs on the already-covered path too — that is precisely where a close would otherwise
leave no trace.

**3c — Carry the owed work.** If `coverage-bullet-add` reports `/notes-plan {topic} {LEVEL}` owed, put it in
the report table and keep it for the **end of the session**, batched: one run per affected topic+level, never
one per bullet. Never write `notes-plan-{LEVEL}.md` or its `Coverage SHA-256` by hand — the stale hash is the
correct signal that a remap is due.

Fold both skills' report rows into this ritual's final table.

## 4 — Project README: land the step's concepts

**Invoke the `readme-concept-add` skill** with the step's concepts. It owns this decision end to end:
deriving which READMEs exist from the project number, routing each concept by **audience** to the global /
backend / frontend file, checking whether it is already represented, and writing it in that section's own
format under the README standard. Do not reproduce its logic here and do not pick the file yourself.

Two things to pass it explicitly, because they are this ritual's context and not the skill's:

- **The concepts, not step 2's PROGRESS.md sections.** That routing answers a different question — a
  technology section is not a README audience.
- **The tier the code landed in, as a hint only.** The skill routes by who needs to read the concept, not
  by which folder changed; handing it the tier as the answer is how an API contract ends up buried in a
  backend README instead of the global one.

If the existing entries already cover the step's concepts, the skill will report **nothing written**, and
that is a good outcome — a README with one bullet per step is worse than one that names what the project
taught. Fold its report rows into this ritual's final table.

## Commits

These are docs/study updates, not project code. Do **not** bundle them — one atomic commit per file.
Everything lands on the **active branch** (`main` only receives merges via PR).

- `notes/**/coverage/*.md` — committed by `coverage-bullet-add` and `coverage-mark` themselves, under the
  standing `notes/` authorization. Do not re-stage those files here; when both ran in the same close they
  fold the authoring and the marking into one coverage commit.
- The README — handed back by `readme-concept-add`, which hands Victor the command itself, one per README
  actually changed. Do not restage it here; the README follows the project's feature-branch → PR workflow.
- `PLANNING.md`, `PROGRESS.md` — **give Victor the commands** in the standard two-block format
  (`git add` block, then `git commit` block), one command per block. Only their dedicated orchestrators
  (`progress-update`, `roadmap-review`) may commit them directly.

Before every commit you run, `git status` immediately before the `add` and before the `commit`, so no
project code file is staged alongside a doc file.

## If the whole project just finished

Remind Victor to update the "Current study progress" section of CLAUDE.md and the projects table in
PROGRESS.md, per CLAUDE.md.

## Report back

Close with a compact table so Victor can see at a glance that nothing was skipped silently:

| Target | Result |
|---|---|
| PLANNING.md | `### Step 5 — TimeEntry workflow ✅` |
| PROGRESS.md | 3 concepts added under Spring Boot, 1 under Java; `Optional<T>` already recorded in Step 4 |
| Coverage bullet | added "declarative transaction boundaries" to `spring-boot`/junior + mirror, 141/141 match |
| Topic chosen | `spring-boot` — the framework mechanism, not the neutral boundary rule |
| Evidence marker | marked `✅ 07-timetrack` — 24/139 junior bullets demonstrated |
| `/notes-plan` owed | yes — `/notes-plan spring-boot junior`, run once at end of session |
| README | `backend` / Key patterns — 2 entries added; 1 concept already represented |
