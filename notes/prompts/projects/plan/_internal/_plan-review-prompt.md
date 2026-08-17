# Project plan review prompt — second-pass auditor for ONE plan

This is the **reviewer half** of the project-plan pipeline. It audits one `PLANNING.md` against the
contract in `_planning-standard.md` and **fixes what falls short directly in the file**. A plan is
authored whole, but reviewed by **specialists**: `plan-audit.md` dispatches this prompt once per concern
(`{SCOPE}` = architecture · data-model-api · ui-design · rules-security · steps-tests ·
branches-coverage · whole-plan) — all but the last own one concern; `whole-plan` runs last and owns only
cross-slice coherence — so each
cold subagent owns a small, defined slice it cannot skim. It serves two callers:

- **`new` mode** — after the author (subagent A) and the architecture advisor write a fresh plan, the
  orchestrator runs the specialist reviewers as the independent second pass, then commits the plan + the
  ROADMAP.md / PROGRESS.md edits the author left in the working tree — plus `PROJECT-BACKLOG.md` if
  `whole-plan` fixed it.
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
SCOPE   = [all | architecture | data-model-api | ui-design | rules-security | steps-tests |
           branches-coverage | whole-plan]
          → the audit orchestrator dispatches ONE concern per subagent; "all" is for a standalone run.
DRY_RUN = [false | true]
          → **`SCOPE = all` only.** It is not a no-commit switch: no path of this prompt ever commits.
            All it decides is whether the standalone run prints its commit sequence as "ready to run"
            or as a preview. A dispatched concern leaves it unset.

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
  sections your invariants cross-reference in full (e.g. `ui-design` needs §13's page list for
  invariant 3, not its annotated file tree — stop at the routes table) · everything else headings-only, just
  enough to know the plan's shape. Never read tail sections your slice does not touch. **`whole-plan` is
  the sole exception to the tiered read** — it reads the file end to end by definition; the tier rules
  above bind the six concern scopes only.
- `notes/prompts/projects/plan/_internal/_planning-standard.md` — **only the parts your `{SCOPE}` row lists in
  the "Reads from the standard" column below**, plus "Two project formats" (every scope needs it to
  derive the format). Read the standard in full **only** when `{SCOPE}` = all.
- `notes/prompts/_internal/_session-rules.md` — **only** `steps-tests` reads it, and only the "Testing rules" section. Other scopes
  skip it entirely.
- `PROGRESS.md` — **only** `architecture` reads it, and only **`Professional level by topic`**, to judge
  level-appropriateness. That table is all this file offers your check; the per-technology concept
  sections were deleted on 2026-08-03. Other scopes skip it entirely.
- `projects/briefs/project-brief-{NN}.md` — **only** `steps-tests`, and only when the plan is new
  enough to have one. It is one page, and it is the authority for §2, §3 and §4: the two concept tables
  must match its two concept lists, and §2's gap and delta bullets its gap table and `## The decision`.
  Read §2/§3/§4 of the plan in full for it. Without the brief those checks are unverifiable from inside
  the plan, which is how a §3 row that no coverage bullet supports used to pass.
- Other projects' `PLANNING.md` — **only** `ui-design`, and **only their §14**, to verify this plan's
  visual identity actually differs from the published ones. Read that section alone.
- `{PROJECT}/PROJECT-BACKLOG.md` — **only** `whole-plan`, for its twelfth check, and the one file
  outside `PLANNING.md` any scope may edit. Other scopes skip it entirely.

**Apply the right format.** Per the standard's "Two project formats": full-stack (07+) → the full
24-section audit; Angular (01–06) → audit only the sections that project actually has, plus the
universal checks (done-condition format, no vague/TBD rules, internal consistency of present
sections). Never flag full-stack-only sections as missing on an Angular project. Derive the format
from the project number — do not ask.

---

## Your concern — audit only `{SCOPE}`

**A plan is authored whole (its sections cross-reference), but it is reviewed by specialists** — each
subagent owns one concrete concern so it cannot skim a tail: it either verified every check in its
slice or it did not. Read the plan in the tiers the `Reading map` above sets — the context a check needs
is the cross-referenced sections that map names, never the whole file — and **audit and fix only the
sections, invariants, and checks your `{SCOPE}` owns**, listed here.

**Read the plan to your slice's real end first.** The Read tool loads 2000 lines by default and
truncates longer files silently — and the tail sections (§22/§23) are exactly where some scopes live,
so a truncated read breaks the "cannot skim" guarantee with no error and a plausible-looking trace.
Check the plan's line count (`wc -l`) before any read and use `offset` passes to reach the **last**
line your slice needs. A full plan already runs to ~1800 lines, so §22/§23 sit closest to the cut and
are the first thing lost when one comes.

**The `N lines, read to EOF` proof is owed for a file you had to read whole** — the repository's rule
in `_session-rules.md`, which is what it says. **None of the six concerns reads the plan whole**, so
`whole-plan` and `SCOPE = all` open their report with that line and the six do not; it is a claim they
could not honestly make. What proves a tiered read reached its sections is the trace they already owe —
`checks owned: n` and exactly `n` rows, one per section, invariant and design check — since a read that
stopped short of a section cannot produce its row, and writing a row it did not verify is the single
thing the trace exists to make impossible.

**`branches-coverage` owes one extra line**, because it is the one concern whose slice ends where the
file does: §23 is the plan's last section, so a truncated read hands it a §23 that looks *missing*, and
its own row then orders it to add one the plan already has. State
`{PROJECT}/PLANNING.md: {n} lines · §23 read through line {n}` — the two numbers agreeing is what says
the cut fell after your slice, not inside it. On an Angular plan (01–06) there is no §23: name the last
section you own and the line you read it through.

**Completed work is history, not format — every scope obeys this.** Steps already marked done (✅ on
a step heading, a §0 "Steps 1–N done" line, closed branches in the branch table) are facts about work
Victor already built and committed. Restructuring is allowed — renumber, reword, re-section, convert
an old-format plan to the standard — but every done step must survive, visibly marked done, and the
current in-progress step must keep its real-world position. **Never unmark, merge away, or delete a
completed step.** If the plan's own markers disagree (✅ on some steps but §0 or the branch table
recording more as done), normalize to the most complete consistent history — add the missing ✅,
never resolve a conflict by dropping a done mark — and flag the normalization in your report. The
orchestrator snapshots the done markers before the review and fails the run if any are lost. Do not touch another concern's sections (mention a
cross-concern ripple in your report so the orchestrator routes it).

| `{SCOPE}` | Owns (sections · invariants · design checks) | Reads from the standard |
|---|---|---|
| `architecture` | §6 layering — **both rule blocks, backend layers and Angular** · §3 the one new architectural concept · §20 tradeoffs · design check 5 (interview test on every §6/§20 reason) · design check 6 (enterprise-gap sweep — read §10, the §15 Docker step, and §20 just deep enough to verify each listed gap is addressed or documented as a tradeoff) · design checks 7 and 9 (the Angular rules are violable, not labels; at least one frontend tradeoff survives "why?") | template §3/§6/§20 · "Design-correctness checks" |
| `data-model-api` | §7 entities (all five columns; each relationship = fetch type + cascade + reason) · §10 endpoints · §12/§13 folder structures — **§13 annotated to the same bar as §12, plus its shared-state ownership lines** · invariants 1–2 (entities↔repos, API↔controllers) · invariant 12 (every §10 endpoint has a §13 consumer or a backend-only ruling) · design checks 1 (fetch types justified) and 8 (state ownership decided, not discovered) | template §7/§10/§12/§13 · HTTP status conventions · invariants 1–2 and 12 · design checks 1 and 8 |
| `ui-design` | **§14, the whole section** — the visual identity statement (three named axes, each contrasted against what the earlier projects did, and consistent with the design-system table below it: to check this, read the §14 palette/density/shape/typography rows of the other published plans, that section only, never a whole plan) · the design-system table (theming mechanism in one named file, typography, spacing grid, status tokens, elevation/shape/density, explicit dark-mode ruling — each row a decision naming where the value lives and who consumes it) · the Material components table · every page's wireframe with its loading/error/empty states and role variations · motion · the accessibility floor · the inspiration table's one-concrete-element and traceability rules · the visual QA checklist · responsive intent · invariants 3 and 11 (pages↔wireframes, visual-QA↔§15) | template §13 (its page list and routes table only, as invariant 3's other side) · template §14 · invariants 3 and 11 |
| `rules-security` | §8 business rules (no vague/TBD; state diagram present) · §0 current step + its done-condition format · invariant 7 (routes/roles↔API-security) · design checks 2 (no dead/orphan states) and 3 (endpoint roles vs ownership) | template §0/§8 · done-condition format · invariant 7 · design checks 2–3 |
| `steps-tests` | §15 steps (each a valid done condition; one major concept per step; the three dedicated test steps present) · §16 testing plan (specific method/service names; edge cases named) · **§3 Pass criteria** (each concept specific; every Topic one of the controlled-vocabulary topic folders, Java vs Spring vs Spring Boot split correctly — you already read §3 for invariant 4) · **§2/§3/§4 against the brief** (the two tables are the brief's two lists; a row in neither is a claim nothing supports, and §4's `Originally demonstrated in` is the bullet's own marker — you own §4's **rows**, `whole-plan` owns its shape. §2's gap bullet condenses the brief's gap table and its last bullet restates the brief's `## The decision` — you own that neither claims a gap or a delta the brief does not; §2 is a summary, so never demand one bullet per gap row. `whole-plan` owns §2's shape. You are the only scope holding the brief, which is why all three checks live here) · done-condition format in §15 (`rules-security` owns §0's) · invariants 4–5 (new-concepts↔steps, testing-plan↔steps) · design check 4 (one concept per step) | template §3/§15/§16 · done-condition format · professional implementation order · invariants 4–5 · design check 4 |
| `branches-coverage` | §22 branches (`feat/…` naming; cover every §15 step, none double-assigned; one per phase; concrete open/close) · **§23 quality gates** (G1–G8 present, in build order; the review gates G3/G4 tier-scoped, never `full`; the prerequisite chain G3/G4 → G5 → G6 → G7 → G8 stated; the closure checklist present with all nine boxes **and each box's text matching the standard's own wording, not merely counted** — the checklist is a verbatim copy, so a drifted box is a stale condition; every trigger names a real §22 branch / §15 step) · **section coverage** (all 24 present for full-stack — a missing section is critical, add it) · invariants 6, 8, 9 and 10 (branches↔steps, §0-branch↔§22, gates↔branches, §0-next-gate↔§23) | template §22/§23 · branch-strategy rules · quality-gate rules · the 24-section list (headings only) · invariants 6, 8, 9, 10 |
| `whole-plan` | Runs **last**, reads the whole file end to end — **coherence, not conformance**; do not re-run another row's checks. Twelve checks: the ten sections no other row owns (§1 · §2 · §4 · §5 · §9 · §11 · §17 · §18 · §19 · §21 — for these ten only, also check content against its **section spec**, since no other row does: the `**Pass:**` line where the section has one, otherwise the shape the section itself states, exactly as §12 is held to §13's bar and §20 to design check 5. Only **§1 and §9** carry a pass line; for the other eight you check stated shape — column sets, counts, formats, named contents. **§2 and §4 are shared**: `steps-tests` owns §4's rows and §2's gap bullets against the brief, which you cannot read; you own both sections' shape — §2's 3–4 bullets and its four named contents, §4's three columns and its 8–12 limit) · cross-section contradictions (a rule in one section broken by prose in another) · `PROJECT-BACKLOG.md` against the plan's recorded decisions. Fix directly; emit no ripples; trace is always twelve rows | the 24-section list · the **section spec** for §1/§2/§4/§5/§9/§11/§17/§18/§19/§21 only — no standard section in full |

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
`{SCOPE}` owns, apply its **section spec in the standard** — its `**Pass:**` line where the section has
one, otherwise the shape the section itself states. A section without a pass line is still auditable and
is not waved through: §12 is held to §13's bar, §20 to design check 5, and the eight of `whole-plan`'s
ten that carry none to their stated shape. The standard is the single source of those criteria; do not rely on any
summary of them. If the standard and the plan disagree, the standard wins.

**3. Done-condition format** *(owners: `steps-tests` for §15, `rules-security` for §0)*. For every
done condition in your slice, mark ✅ valid or ⚠️ vague against the four formats in the standard. For
each ⚠️, rewrite it to a valid format.

**4. Internal consistency** *(split by the table: 1–2 and 12 `data-model-api` · 3 and 11 `ui-design` ·
4–5 `steps-tests` · 7 `rules-security` · 6, 8, 9 and 10 `branches-coverage`)*. Run only the invariants your `{SCOPE}` owns. Fix
each mismatch.

**5. Design correctness** *(split by the table: 1 and 8 `data-model-api` · 2–3 `rules-security` ·
4 `steps-tests` · 5–7 and 9 `architecture`)*. Run only the design-correctness checks your `{SCOPE}` owns —
fetch types justified, state machine has no dead/orphan states, endpoint roles consistent with
ownership, one major concept per step,
every §6/§20 reason passes the interview test. This is the check that separates a *complete* plan from a
*defensible* one: a section can be present and well-formatted yet describe a decision that would collapse
under an interviewer's "why?". Where a decision is unsound or its reason is hollow, fix the decision (or
its stated reason) directly — do not just note it.

---

## Fix, don't just report

Where a check fails, **fix it directly** in `{PROJECT}/PLANNING.md` — you are the last quality pass,
not an advisor that hands back a report to paste. One fix lands outside the plan: `whole-plan`'s twelfth
check reconciles `{PROJECT}/PROJECT-BACKLOG.md` **in the backlog file** (still without committing), and
its trace row must say so, because that is what tells the orchestrator to stage it. Add missing sections, rewrite vague done conditions,
fill incomplete tables, reconcile inconsistencies. Preserve the author's correct work; only change what
misses the bar. If the plan is genuinely already at bar, change nothing and record it as PASS — do not
rewrite good text to leave a mark.

---

## Finish

**If `{SCOPE}` ≠ all (dispatched by the orchestrator):** do **not** commit — the orchestrator commits
once, after every concern's specialist has run. Leave your fixes in the working tree. Your report is
**compact and bounded** — it lands in the orchestrator's context, and seven verbose reports saturate it:
- `whole-plan` **only** — one line first: `{PROJECT}/PLANNING.md: {n} lines, read to EOF`. Its slice is
  the whole file, so the repository's whole-file rule reaches it and reaches no concern scope.
- Line 1 for the six concerns — verdict: `PASS` (no changes) or `FIXED: n fixes`, then
  **`checks owned: n`** — count the sections, invariants and design checks your `{SCOPE}` row assigns
  you and state the number *before* writing the trace. The orchestrator never reads this prompt or the standard, so this declaration is
  the only thing that turns its acceptance check into a count rather than a glance at a non-empty table.
- The **check-by-check trace of your slice** as a table, **one line per check, ≤15 words per line**:
  `| check | ✅ / fix made |` — **exactly `checks owned` rows**. Every section/invariant/design check
  your `{SCOPE}` owns must have one: proof you ran your whole slice, not just the first items. Detail
  lives in the file edits, not in the report; never paste plan content back.
- Ripples: one line per cross-concern ripple another specialist must reconcile (`none` if none).

**If `{SCOPE}` = all (standalone run):** never commit — commit authority belongs to the orchestrators
(the shared session rules' auto-commit exception covers them, not a standalone reviewer). Leave all changes in the
working tree and print the commit sequence for Victor:
`git add {PROJECT}/PLANNING.md` — **plus `{PROJECT}/PROJECT-BACKLOG.md` when your twelfth check fixed
it** · `git commit -m "docs: improve PLANNING.md for {PROJECT} — <one-line summary of main fixes>"`
(`{DRY_RUN}` only affects whether you print the sequence as "ready to run" or as a preview).

Then report `{PROJECT}/PLANNING.md: {n} lines, read to EOF` — this scope runs every row over the whole
plan — followed by the verdict + the audit summary (X critical · Y quality · Z consistency · W
design-correctness issues found and fixed) + the files touched.
