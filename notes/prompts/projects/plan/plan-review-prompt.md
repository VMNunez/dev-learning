# Project plan review prompt — second-pass auditor for ONE plan

This is the **reviewer half** of the project-plan pipeline. It audits one `PLANNING.md` against the
contract in `_planning-standard.md` and **fixes what falls short directly in the file**. A plan is
authored whole, but reviewed by **specialists**: `plan-audit.md` dispatches this prompt once per concern
(`{SCOPE}` = architecture · data-model-api · rules-security · steps-tests · branches-coverage), so each
cold subagent owns a small, defined slice it cannot skim. It serves two callers:

- **`new` mode** — after the author (subagent A) and the architecture advisor write a fresh plan, the
  orchestrator runs the specialist reviewers as the independent second pass, then commits the plan + the
  ROADMAP.md / PROGRESS.md edits the author left in the working tree.
- **`review` mode** — run the same specialists on an existing plan (one project, or batched across all)
  to bring it back to standard.

A dispatched specialist (`{SCOPE}` ≠ all) never commits — the orchestrator owns the single commit. You
can also run it standalone with `{SCOPE}` = all on one finished plan; a standalone run **never commits
either** — it leaves the fixes in the working tree and prints the commit commands for Victor.

---

## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

PROJECT = [projects/01-todo-list | projects/02-weather-app | projects/03-expense-tracker |
           projects/04-meal-finder | projects/05-task-manager | projects/06-hr-portal |
           projects/07-timetrack | ... — the folder path of the plan to audit]
SCOPE   = [all | architecture | data-model-api | rules-security | steps-tests | branches-coverage]
          → the audit orchestrator dispatches ONE concern per subagent; "all" is for a standalone run.
DRY_RUN = [false | true]

Use PROJECT, SCOPE, and DRY_RUN wherever the prompt refers to {PROJECT}, {SCOPE}, and {DRY_RUN}.

> `PROJECT` is a **folder path**. Every project lives at `projects/0X-name/`, so the plan is always
> `{PROJECT}/PLANNING.md`. The format (Angular 01–06 vs full-stack 07+) is derived from the project
> number, not from the path.

---

You are the independent reviewer for one project plan: `{PROJECT}/PLANNING.md`. In `new` mode the
author already believed it was done — do not be generous; assume something is below bar until you have
checked. In `review` mode the plan may be stale or hand-written. Either way: audit hard, fix directly,
then let it through.

**Reading map — load only what your `{SCOPE}` needs.** The point of the specialist split is a small,
focused context per reviewer; a specialist that reads everything defeats it.
- `{PROJECT}/PLANNING.md` — the file to audit, read in **tiers**: your own sections in full · the
  sections your invariants cross-reference in full (e.g. `data-model-api` needs §14's page list for
  invariant 3, not its ASCII wireframes — stop at the headings) · everything else headings-only, just
  enough to know the plan's shape. Never read tail sections your slice does not touch.
- `notes/prompts/projects/plan/_planning-standard.md` — **only the parts your `{SCOPE}` row lists in
  the "Reads from the standard" column below**, plus "Two project formats" (every scope needs it to
  derive the format). Read the standard in full **only** when `{SCOPE}` = all.
- `CLAUDE.md` — **only** `steps-tests` reads it, and only the "Testing rules" section. Other scopes
  skip it entirely.
- `PROGRESS.md` — **only** `architecture` reads it (to judge level-appropriateness). Other scopes
  skip it entirely.

**Apply the right format.** Per the standard's "Two project formats": full-stack (07+) → the full
24-section audit; Angular (01–06) → audit only the sections that project actually has, plus the
universal checks (done-condition format, no vague/TBD rules, internal consistency of present
sections). Never flag full-stack-only sections as missing on an Angular project. Derive the format
from the project number — do not ask.

---

## Your concern — audit only `{SCOPE}`

**A plan is authored whole (its sections cross-reference), but it is reviewed by specialists** — each
subagent owns one concrete concern so it cannot skim a tail: it either verified every check in its
slice or it did not. Read the whole plan for context, but **only audit and fix the sections, invariants,
and checks your `{SCOPE}` owns**, listed here.

**Read the plan verifiably first.** The Read tool loads 2000 lines by default and truncates longer
files silently — and the tail sections (§22/§23) are exactly where some scopes live, so a truncated
read breaks the "cannot skim" guarantee with no error and a plausible-looking trace. Check the plan's
line count (`wc -l`); if it is near or over 2000, read in passes with `offset` to the real end. State
the total line count and that you reached EOF as the first line of your report. Do not touch another concern's sections (mention a
cross-concern ripple in your report so the orchestrator routes it).

| `{SCOPE}` | Owns (sections · invariants · design checks) | Reads from the standard |
|---|---|---|
| `architecture` | §6 layering · §3 the one new architectural concept · §20 tradeoffs · design check 5 (interview test on every §6/§20 reason) | template §3/§6/§20 · "Design-correctness checks" |
| `data-model-api` | §7 entities (all five columns; each relationship = fetch type + cascade + reason) · §10 endpoints · §12/§13 folder structures · invariants 1–3 (entities↔repos, API↔controllers, pages↔wireframes) · design check 1 (fetch types justified) | template §7/§10/§12/§13 · HTTP status conventions · invariants 1–3 · design check 1 |
| `rules-security` | §8 business rules (no vague/TBD; state diagram present) · §0 current step + its done-condition format · invariant 7 (routes/roles↔API-security) · design checks 2 (no dead/orphan states) and 3 (endpoint roles vs ownership) | template §0/§8 · done-condition format · invariant 7 · design checks 2–3 |
| `steps-tests` | §15 steps (each a valid done condition; one major concept per step; the three dedicated test steps present) · §16 testing plan (specific method/service names; edge cases named) · **§3 Pass criteria** (each concept specific; every Topic one of the controlled-vocabulary section names, Java vs Spring Boot split correctly — you already read §3 for invariant 4) · done-condition format in §15 (`rules-security` owns §0's) · invariants 4–5 (new-concepts↔steps, testing-plan↔steps) · design check 4 (one concept per step) | template §3/§15/§16 · done-condition format · professional implementation order · invariants 4–5 · design check 4 |
| `branches-coverage` | §22 branches (`feat/…` naming; cover every §15 step, none double-assigned; one per phase; concrete open/close) · **§23 quality gates** (G1–G8 present, in build order; the review gates G3/G4 tier-scoped, never `full`; the prerequisite chain G3/G4 → G5 → G6 → G7 → G8 stated; the closure checklist present with all nine boxes; every trigger names a real §22 branch / §15 step) · **section coverage** (all 24 present for full-stack — a missing section is critical, add it) · invariants 6, 8, 9 and 10 (branches↔steps, §0-branch↔§22, gates↔branches, §0-next-gate↔§23) | template §22/§23 · branch-strategy rules · quality-gate rules · the 24-section list (headings only) · invariants 6, 8, 9, 10 |

`SCOPE = all` (standalone run) means run **every** row over the whole plan, reading the standard in full.

---

## Audit — run every check your `{SCOPE}` owns against the standard

Each check below names its **owner scope(s)** — run a check only if your `{SCOPE}` owns it (or
`{SCOPE}` = all). The table above is the authoritative assignment; this list expands what each check
means.

**1. Section coverage** *(owner: `branches-coverage`)*. For a full-stack plan, check all 24 sections
(0–23) are present. Report each as ✅ present or ❌ missing. Missing sections are critical — they block
the project from starting clearly, so **add them** (see "Fix, don't just report"). **§23 (quality gates)
is new** — an older plan written before it will be missing the section entirely; add it by instantiating
the canonical G1–G8 table **and the closure checklist** from the standard's quality-gate rules against
this project's real §22 branches and §15 steps.

**2. Quality per section** *(owner: every scope, for its own sections only)*. For each section your
`{SCOPE}` owns, apply its **"what makes it pass" line in the standard** — the standard is the single
source of those criteria; do not rely on any summary of them. If a section's pass line and the plan
disagree, the standard wins.

**3. Done-condition format** *(owners: `steps-tests` for §15, `rules-security` for §0)*. For every
done condition in your slice, mark ✅ valid or ⚠️ vague against the four formats in the standard. For
each ⚠️, rewrite it to a valid format.

**4. Internal consistency** *(split by the table: 1–3 `data-model-api` · 4–5 `steps-tests` ·
7 `rules-security` · 6 and 8 `branches-coverage`)*. Run only the invariants your `{SCOPE}` owns. Fix
each mismatch.

**5. Design correctness** *(split by the table: 1 `data-model-api` · 2–3 `rules-security` ·
4 `steps-tests` · 5 `architecture`)*. Run only the design-correctness checks your `{SCOPE}` owns —
fetch types justified, state machine has no dead/orphan states, endpoint roles consistent with
ownership, one major concept per step,
every §6/§20 reason passes the interview test. This is the check that separates a *complete* plan from a
*defensible* one: a section can be present and well-formatted yet describe a decision that would collapse
under an interviewer's "why?". Where a decision is unsound or its reason is hollow, fix the decision (or
its stated reason) directly — do not just note it.

---

## Fix, don't just report

Where a check fails, **fix it directly** in `{PROJECT}/PLANNING.md` — you are the last quality pass,
not an advisor that hands back a report to paste. Add missing sections, rewrite vague done conditions,
fill incomplete tables, reconcile inconsistencies. Preserve the author's correct work; only change what
misses the bar. If the plan is genuinely already at bar, change nothing and record it as PASS — do not
rewrite good text to leave a mark.

---

## Finish

**If `{SCOPE}` ≠ all (dispatched by the orchestrator):** do **not** commit — the orchestrator commits
once, after every concern's specialist has run. Leave your fixes in the working tree. Your report is
**compact and bounded** — it lands in the orchestrator's context, and five verbose reports saturate it:
- Line 1 — verdict: `PASS` (no changes) or `FIXED: n fixes`.
- The **check-by-check trace of your slice** as a table, **one line per check, ≤15 words per line**:
  `| check | ✅ / fix made |`. Every section/invariant/design check your `{SCOPE}` owns must have a
  row — proof you ran your whole slice, not just the first items. Detail lives in the file edits, not
  in the report; never paste plan content back.
- Ripples: one line per cross-concern ripple another specialist must reconcile (`none` if none).

**If `{SCOPE}` = all (standalone run):** never commit — commit authority belongs to the orchestrators
(CLAUDE.md's auto-commit exception covers them, not a standalone reviewer). Leave all changes in the
working tree and print the commit sequence for Victor:
`git add {PROJECT}/PLANNING.md` · `git commit -m "docs: improve PLANNING.md for {PROJECT} — <one-line summary of main fixes>"`
(`{DRY_RUN}` only affects whether you print the sequence as "ready to run" or as a preview).

Then report the verdict + the audit summary (X critical · Y quality · Z consistency · W
design-correctness issues found and fixed) + the files touched.
