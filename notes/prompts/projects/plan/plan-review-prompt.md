# Project plan review prompt — second-pass auditor for ONE plan

This is the **reviewer half** of the project-plan pipeline. It audits one `PLANNING.md` against the
contract in `_planning-standard.md` and **fixes what falls short directly in the file**. A plan is
authored whole, but reviewed by **specialists**: `plan-audit.md` dispatches this prompt once per concern
(`{SCOPE}` = architecture · data-model-api · rules-security · steps-tests · branches-coverage), so each
cold subagent owns a small, defined slice it cannot skim. It serves two callers:

- **`new` mode** — after the author (subagent A) and the architecture advisor write a fresh plan, the
  orchestrator runs the specialist reviewers as the independent second pass, then commits the plan + the
  ROADMAP.md / PROGRESS.md edits the author left staged.
- **`review` mode** — run the same specialists on an existing plan (one project, or batched across all)
  to bring it back to standard.

A dispatched specialist (`{SCOPE}` ≠ all) never commits — the orchestrator owns the single commit. You
can also run it standalone with `{SCOPE}` = all on one finished plan (then it commits per `{DRY_RUN}`).

---

## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

PROJECT = [angular/01-todo-list | angular/02-weather-app | angular/03-expense-tracker |
           angular/04-meal-finder | angular/05-task-manager | angular/06-hr-portal |
           projects/07-timetrack | ... — the folder path of the plan to audit]
SCOPE   = [all | architecture | data-model-api | rules-security | steps-tests | branches-coverage]
          → the audit orchestrator dispatches ONE concern per subagent; "all" is for a standalone run.
DRY_RUN = [false | true]

Use PROJECT, SCOPE, and DRY_RUN wherever the prompt refers to {PROJECT}, {SCOPE}, and {DRY_RUN}.

> `PROJECT` is a **folder path**. Angular projects live at `angular/0X-name/PLANNING.md`, full-stack at
> `projects/0X-name/PLANNING.md`. Derive the plan path from it.

---

You are the independent reviewer for one project plan: `{PROJECT}/PLANNING.md`. In `new` mode the
author already believed it was done — do not be generous; assume something is below bar until you have
checked. In `review` mode the plan may be stale or hand-written. Either way: audit hard, fix directly,
then let it through.

**Reading map — load only what your `{SCOPE}` needs.** The point of the specialist split is a small,
focused context per reviewer; a specialist that reads everything defeats it.
- `{PROJECT}/PLANNING.md` — the file to audit. Read it whole once for cross-reference context, but
  only audit and edit your slice.
- `notes/prompts/projects/plan/_planning-standard.md` — **only the parts your `{SCOPE}` row lists in
  the "Reads from the standard" column below**, plus "Two project formats" (every scope needs it to
  derive the format). Read the standard in full **only** when `{SCOPE}` = all.
- `CLAUDE.md` — **only** `steps-tests` reads it, and only the "Testing rules" section. Other scopes
  skip it entirely.
- `PROGRESS.md` — **only** `architecture` reads it (to judge level-appropriateness). Other scopes
  skip it entirely.

**Apply the right format.** Per the standard's "Two project formats": full-stack (07+) → the full
23-section audit; Angular (01–06) → audit only the sections that project actually has, plus the
universal checks (done-condition format, no vague/TBD rules, internal consistency of present
sections). Never flag full-stack-only sections as missing on an Angular project. Derive the format
from the path prefix and project number — do not ask.

---

## Your concern — audit only `{SCOPE}`

**A plan is authored whole (its sections cross-reference), but it is reviewed by specialists** — each
subagent owns one concrete concern so it cannot skim a tail: it either verified every check in its
slice or it did not. Read the whole plan for context, but **only audit and fix the sections, invariants,
and checks your `{SCOPE}` owns**, listed here. Do not touch another concern's sections (mention a
cross-concern ripple in your report so the orchestrator routes it).

| `{SCOPE}` | Owns (sections · invariants · design checks) | Reads from the standard |
|---|---|---|
| `architecture` | §6 layering · §3 the one new architectural concept · §20 tradeoffs · design check 5 (interview test on every §6/§20 reason) | template §3/§6/§20 · "Design-correctness checks" |
| `data-model-api` | §7 entities (all five columns; each relationship = fetch type + cascade + reason) · §10 endpoints · §12/§13 folder structures · invariants 1–3 (entities↔repos, API↔controllers, pages↔wireframes) · design check 1 (fetch types justified) | template §7/§10/§12/§13 · HTTP status conventions · invariants 1–3 · design check 1 |
| `rules-security` | §8 business rules (no vague/TBD; state diagram present) · §0 current step + its done-condition format · invariant 7 (routes/roles↔API-security) · design checks 2 (no dead/orphan states) and 3 (endpoint roles vs ownership) | template §0/§8 · done-condition format · invariant 7 · design checks 2–3 |
| `steps-tests` | §15 steps (each a valid done condition; one major concept per step; the three dedicated test steps present) · §16 testing plan (specific method/service names; edge cases named) · done-condition format in §15 (`rules-security` owns §0's) · invariants 4–5 (new-concepts↔steps, testing-plan↔steps) · design check 4 (one concept per step) | template §15/§16 · done-condition format · professional implementation order · invariants 4–5 · design check 4 |
| `branches-coverage` | §22 branches (`feat/…` naming; cover every §15 step, none double-assigned; one per phase; concrete open/close) · **section coverage** (all 23 present for full-stack — a missing section is critical, add it) · invariants 6 and 8 (branches↔steps, §0-branch↔§22) | template §22 · branch-strategy rules · the 23-section list (headings only) · invariants 6 and 8 |

`SCOPE = all` (standalone run) means run **every** row over the whole plan, reading the standard in full.

---

## Audit — run every check your `{SCOPE}` owns against the standard

Each check below names its **owner scope(s)** — run a check only if your `{SCOPE}` owns it (or
`{SCOPE}` = all). The table above is the authoritative assignment; this list expands what each check
means.

**1. Section coverage** *(owner: `branches-coverage`)*. For a full-stack plan, check all 23 sections
(0–22) are present. Report each as ✅ present or ❌ missing. Missing sections are critical — they block
the project from starting clearly, so **add them** (see "Fix, don't just report").

**2. Quality per section** *(owner: every scope, for its own sections only)*. For each section your
`{SCOPE}` owns, check it against its "what makes it pass" line in the standard. The highest-value ones:
- **§0** — if in progress, Current step is real, Done condition specific and valid.
- **§3** — each concept specific, each with a reason.
- **§7** — every field has all five columns; every relationship states fetch type + cascade + reason.
- **§8** — no vague rule, no TBD; state diagram present if there are transitions.
- **§10** — every endpoint complete; status codes match the conventions.
- **§15** — every step has a valid done condition; one major concept per step; the three dedicated
  steps (backend tests, Angular tests, SQL complement) are present.
- **§16** — specific method/service names; edge cases named (not just the happy path).
- **§22** — every branch name follows `feat/short-description`; concrete open/close conditions; the
  branches cover every §15 step with none unassigned or double-assigned; no more than one branch per
  coherent phase.

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
once, after every concern's specialist has run. Leave your fixes in the working tree. Report your
**verdict for this concern**:
- `PASS` (no changes) or `FIXED` (a short bullet list of what you corrected and why).
- A **check-by-check trace of your slice**: list every section/invariant/check your `{SCOPE}` owns and,
  next to each, ✅ pass or the fix you made — proof you ran your whole slice, not just the first items.
- Any cross-concern ripple another specialist must reconcile.

**If `{SCOPE}` = all (standalone run):**
- **`{DRY_RUN}` = false, `new` mode** (author left ROADMAP.md + PROGRESS.md staged): commit all three
  atomically. `git add {PROJECT}/PLANNING.md ROADMAP.md PROGRESS.md`, then
  `git commit -m "docs: add PLANNING.md for project 0X [name] — closes [main gap], introduces [key concept] (reviewed)"`.
- **`{DRY_RUN}` = false, `review` mode** (only the plan changed): commit just the plan, real path prefix
  (`angular/` for 01–06, `projects/` for 07+): `git add {PROJECT}/PLANNING.md`, then
  `git commit -m "docs: improve PLANNING.md for {PROJECT} — fix done conditions, add missing sections"`.
- **`{DRY_RUN}` = true:** do not commit; leave changes in the tree and print the commit sequence.

Then report the verdict + the audit summary (X critical · Y quality · Z consistency · W
design-correctness issues found and fixed) + the files touched + the commit hash if committed.
