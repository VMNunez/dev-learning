# Run tracker — which targets each prompt has been run on

**What this is.** A permanent dashboard of every runnable prompt's latest execution, with target-level
progress for pipelines. It answers at a glance what completed,
what remains pending, and what last stopped as blocked or dry-run. Detailed machinery verdicts stay in
each prompt's `_last-run-report*.md`; this file stores operational state, one short record per run.

**Who updates it.** Every runnable prompt through `_pipeline-self-report.md` or
`_single-shot-self-report.md`. After writing its report, it updates the applicable row with the run
date, target/mode, outcome, and a result within the bound "How to read it" sets, then commits report and tracker together. Victor never
fills it by hand (though he may correct it).

**Two exceptions, both skills.** The `coverage-bullet-add` skill appends a stale flag to a `Plan` cell
(see below), because the debt it records is created in a daily session, where no prompt runs at all. The
`sql-grade` skill rewrites the `Exercises` cell of `## SQL exercise track` (see there). Neither writes
anything else in this file.

**Two writers, one flag.** `coverage-prompt` writes the same flag, in the same accumulating form, for the
plans its own run left behind — and on the `coverage-audit` row when its recalibration lands after that
level's convergence pass. It is the larger source of the debt by far, since one recalibration can
add a dozen bullets where the skill adds one. The skill covers the daily-session path and the prompt
covers the pipeline path; a flag written by either is read and cleared identically, and the next run of
the flagged prompt rewrites the whole cell.

**How to read it:** records use `YYYY-MM-DD — completed|blocked|dry-run — result`, **200 characters at
most per record**. An empty
cell means **pending**: the current prompt version has not run on that target. Output files that
predate the current prompt version do not count as executions. Prompts may read this file as a gate,
but only a `completed` result satisfies a prerequisite; `blocked` and `dry-run` do not.

**What fits in a record.** A record is one dated run — summary cells (`Notes J|M|S`, `Exercises`,
`Route progress`) included — and in the single-shot table it is the `Result` cell. It carries what a
reader acts on: the outcome, the counts that size the run — on a `Plan` cell always its concept count,
the baseline `coverage-bullet-add` reads — a gate it signed or a verdict only this cell records, and the
commit. Dispatch tallies, reviewer findings, renumberings and the reasoning behind them go first when a
record runs over; they live in the run's `_last-run-report*.md` and in git. The bound is per record, so
a cell holding one record per tier counts each apart, and a ` · ⚠ stale` flag or ` · index` suffix is
not counted. Over the bound, a record is rewritten shorter, never split into a second record.

**Stale flags — the one thing here that says "run this again".** A cell records a run that *happened*;
a flag is how it also says that run has since been **invalidated**, so the prompt is **owed** a re-run:

```
 · ⚠ stale YYYY-MM-DD (+N bullets)      the upstream file gained N items this run never mapped
 · ⚠ stale YYYY-MM-DD (fingerprint only) the stored digest no longer matches, though no item is unmapped
```

The second form matters more than it looks: a plan can map every current bullet and still be refused by
`notes-audit`, whose gate is the fingerprint, not the item list. Writing `(+0 bullets)` there would read
as "nothing happened" for a cell that is, in fact, blocking every note in that topic.

It applies to any cell whose recorded run an upstream run has overtaken — a `Plan J|M|S` cell when its
coverage moved, and the `coverage-audit` row when a topic recalibrated after that convergence pass, which
is what makes the pass's "the whole level converges" claim no longer true. The flag is appended to the
execution record, never a replacement for it, so the record survives underneath it; the next run of the
flagged prompt rewrites the whole cell and the flag disappears on its own. **A flagged cell does not
satisfy a prerequisite.**

**One flag per cell — the count accumulates.** "Appended" governs the flag's relationship to the
execution record, never to an earlier flag. A cell already carrying ` · ⚠ stale 2026-07-30 (+4 bullets)`
that gains one more bullet becomes ` · ⚠ stale 2026-07-30 (+5 bullets)` — the date moves to today and
`N` is the running total of bullets added since the plan ran. Never write a second flag beside the
first: what the cell has to answer is "how far has this plan drifted", and a list of dated increments
makes the reader do arithmetic to find out. For the same reason the parentheses hold the count, or
`fingerprint only`, and nothing else — which bullets they were, and from which close, is in git.

**One more suffix, on the `Interview J|M|S` cells alone** (`REC-340`): ` · index YYYY-MM-DD`, written by
an `interview-prep-audit MODE = index` run — with ` dry-run` after the date on `DRY_RUN = true`, or
` blocked — «condition»` when its step 1 stopped the topic. It is an annotation, never a record: it
carries no `completed` and satisfies no prerequisite, a cell holding nothing else is still **pending**
its audit, a later index run replaces it, and the next `full` or `correct` run rewrites the whole cell.

**Tracking baseline reset:** 2026-07-24. Earlier execution records were cleared after the prompt
system changed. Only runs recorded from this baseline onward are valid; the Java Junior coverage run
is the first retained execution.

## Per-topic prompts

| Topic | Coverage J | Verify J | Plan J | Notes J | Interview J | Coverage M | Verify M | Plan M | Notes M | Interview M | Coverage S | Verify S | Plan S | Notes S | Interview S |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Angular | 2026-07-29 — completed — 108 items; verify-gap fast path; 5 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA a22f33f6; fresh verification optional | 2026-10-03 — completed — 28 entries; 173 concepts; 13 create / 15 audit; SHA 090fc362; cold review PASS-WITH-CORRECTIONS, 24 of 25 applied | 0/28 complete — completed | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| Angular Material | 2026-07-29 — completed — 73 items; verify-gap fast path; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 3 gaps | 2026-10-03 — completed — 25 entries; 96 concepts; 9 create / 16 audit; route rebuilt from 16 entries; cold review BLOCKED, 30 corrections applied | 0/25 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Spring | 2026-08-01 — completed — 61 junior items; verify-gap fast path; 1 gap consumed by correction; 7 markers preserved; mirror parity; notes-plan next | 2026-08-01 — completed — 1 gap; SHA c8b255b9 matches coverage | 2026-08-01 — completed — 12 entries; 58 concepts; 12 create / 0 audit; no legacy notes; mirror parity; cold review applied | 0/12 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Spring Boot | 2026-07-27 — completed — 136 items; verify-gap fast path; 4 gaps judged (3 added, 1 moved to middle); mirror parity; notes plan stale | 2026-07-27 — complete — 136 items pass strict bar; zero gaps; SHA 43a1261f matches coverage; notes-plan unblocked | 2026-10-09 — completed — 16 entries; 140 concepts; 3 create / 13 audit; +4 bullets routed; route renumbered; cold review ACCEPT-WITH-CORRECTIONS, 20 applied | 0/16 complete — completed | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| Java | 2026-07-26 — completed — 121 items; consumed array-access gap (fast path); mirror parity; notes plan stale | 2026-07-26 — complete — 121 items pass strict bar; SHA 4c9d4cc9 matches coverage; notes-plan unblocked | 2026-09-16 — completed — 18 entries; 132 concepts (31 checked); 1 create / 17 audit; SHA bad12930; stale flag consumed (+2 bullets); cold review applied | 6/18 complete — completed on 2026-10-02 (Java junior note 05; four stages, no re-dispatch) | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| Architecture | 2026-07-29 — completed — 65 junior items; full recalibration; 1 item moved to middle; mirror parity; notes-plan refresh next | 2026-07-29 — completed — complete; zero gaps; SHA 31dde116 matches coverage | 2026-10-09 — completed — 25 entries; 84 concepts; 20 create / 5 audit; SHA 0a6ec62c; stale flag consumed (+12 bullets), route rebuilt; cold review BLOCKED, 26 applied | 0/25 complete — completed | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| Security | 2026-07-29 — completed — 95 junior items; verify-gap fast path; 2 gaps added; 1 factual tightening; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 2 gaps; SHA 1cd18117 matches coverage | 2026-10-09 — completed — 14 entries; 108 concepts (+1 → 02); 9 create / 5 audit; cold review ACCEPT-WITH-CORRECTIONS, 13 of 14 applied; plan `54f384d5` | 0/14 complete | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| TypeScript | 2026-07-29 — completed — 81 items; verify-gap fast path; 4 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA 88c63060; fresh verification optional | 2026-07-29 — completed — 15 entries; 81 concepts; 8 create / 7 audit; 7 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-09-16 (+6 bullets) | 0/15 complete — completed | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| JavaScript | 2026-07-29 — completed — 128 items; verify-gap fast path; 5 gaps consumed; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 5 gaps; SHA f35c4540; findings consumed by coverage update | 2026-07-29 — completed — 22 entries; 128 concepts; 7 create / 15 audit; 15 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-09-22 (+5 bullets) | 0/22 complete — completed | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| HTML | 2026-09-04 — completed — 81 junior items; first-run recalibration + boundary migration; 9 inbox proposals consumed; `middle.md` and `senior.md` created; mirror parity | 2026-09-08 — completed — 81 junior items reviewed; 3 gaps (all junior); SHA 29b2ba5d matches coverage; 2 proposals routed to CSS; coverage-prompt update suggested |  |  |  |  |  |  |  |  |  |  |  |  |  |
| CSS | 2026-08-01 — completed — 115 junior items; verify-gap fast path; 8 gaps accepted as 9 bullets after reviewer split; mirror parity; notes-plan refresh next | 2026-08-01 — completed — 8 gaps consumed; verdict superseded by SHA e068b446; fresh verification optional | plan predates the 2026-07-24 baseline, no run recorded · ⚠ stale 2026-09-23 (+8 bullets) |  | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| SQL | 2026-08-03 — completed — 149 junior items; full recalibration; 12 additions, 2 splits, 3 factual corrections, 2 new sections; 19 markers preserved; mirror parity | 2026-07-29 — completed — gaps consumed; verdict superseded; verification optional | 2026-10-03 — completed — 17 entries; 152 concepts; 3 create / 14 audit; SHA bded1b85; stale flag consumed (+1 bullet); 5 renumbers; cold review 15 corrections applied | 1/17 complete — completed on 2026-10-03 (SQL junior note 00; four stages, no re-dispatch) | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| Git | 2026-08-01 — completed — 92 junior items; full recalibration; 4 additions; 2 bullet splits; mirror parity; notes-plan refresh next | 2026-08-01 — completed — gaps consumed; verdict superseded by SHA f989cc0b |  |  | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |
| General | 2026-08-01 — completed — 113 junior items; full recalibration; 8 additions; 3 moved to middle; mirror parity; notes-plan refresh next | 2026-08-01 — completed — complete; zero gaps; SHA b0307fdc matches coverage | 2026-08-02 — completed — 21 entries; 116 concepts; 14 create / 7 audit; 12 English-only notes foldered; mirror parity; cold review passed · ⚠ stale 2026-09-24 (+9 bullets) | 0/21 complete — completed | · index 2026-10-13 |  |  |  |  |  |  |  |  |  |  |

Columns are grouped by level (J, then M, then S), with Coverage → Verify → Plan → Notes → Interview
inside each level. The Notes J/M/S cells are summaries, written as `X/Y complete` plus the last outcome. Their denominator
comes from the corresponding notes plan, never from counting files on disk. There is no per-note row: which
entries are complete lives in the plan's `Status:` fields, and each run's detail in `_last-run-report.md`.

## SQL exercise track

The SQL **exercise** route, per level — distinct from the `SQL` row in the per-topic table above, which
tracks the SQL *notes*. `sql-plan` writes the route (`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`); `sql-plan-audit`
audits it together with the level-neutral doctrine (`practice/sql/PLANNING.md`).

| Level | SQL plan | sql-plan-audit | Exercises |
|---|---|---|---|
| junior | 2026-10-08 — completed, second run — 14 steps · 15 files · 216 first-pass · 152/152 bullets; SHA bded1b85; cold review 17 findings, 13 applied; history gate passed | 2026-10-08 — completed, second run — `SCOPE = full`; 152/152 bullets, no new step; 4/4 specialists + 3 hand-over dispatches; history gate passed (`a75755e2`) | 0/14 steps closed — 2026-10-02 practice run: Step 0 batch (10) written in `02-execution-order-set-ops.sql`, awaiting answers |
| middle | | | |
| senior | | | |

The `Exercises` cell is a **summary**, written like a `Notes J/M/S` cell: `X/Y steps closed` plus the
last outcome, where Y is the step count in that level's `PLANNING-{LEVEL}.md` §3 and X the rows at
`closed ✅`. Both numbers come from the plan, **never from counting `.sql` files on disk** — a level with
no plan yet leaves the cell empty. `sql-exercises` writes it in its close-out, on every run including a
`blocked` one, and the `sql-grade` skill after every return of its grading subagent, which runs the
review branch alone and never that close-out. The three cells read left to right answer "route planned →
route audited → how much of it I have actually drilled". There is deliberately no per-step table here: §3 of the plan already is one,
and a second copy would only drift.

A `SQL plan` cell carries the same ` · ⚠ stale` flag rules as a `Plan J/M/S` cell above: coverage that
grows after the route was planned makes the cell stale, and a stale cell does not satisfy the
`sql-plan-audit` prerequisite. The flag here is written by `sql-plan-audit` when its fingerprint check
fails, since no daily-session skill touches this route.

## Timed-simulation track

`simulation-plan` writes one evidence-gated route per level. The route's own §2/§3 remains the source
for step state: the `Simulation plan` cell records the latest planning run only, and `Route progress`
is a derived summary of that route's §2, never a second copy of step state.

| Level | Simulation plan | Route progress |
|---|---|---|
| junior | | |
| middle | | |
| senior | | |

`Route progress` is `X/Y steps closed` from `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` §2; a
level with no route stays blank. `simulation-review` recalculates it on every run whose `LEVEL`
resolved — `hint` and `blocked` runs included — and its own `## Final step` is where that obligation is
stated, because that is the file the run opens. **It is not `PROGRESS.md`'s `Route progress`**, which
counts first-pass **SQL exercises** graded against a route target; this one counts **simulation steps
closed**, which is what the `Exercises` cell above holds for SQL. The two names are not derived from
each other and never share a table. A changed coverage manifest makes the plan cell stale; changed
PROGRESS evidence is surfaced by `simulation-block-open` and adjudicated by the next
`/simulation-plan` run rather than auto-staling the route on every project update.

## Per-project prompts

| Project | project-brief | plan-audit | review-audit | readme-audit | portfolio-audit |
|---|---|---|---|---|---|
| 01-todo-list |  |  | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | 2026-09-28 (global only — completed; author FIXED, reviewer FIXED 12/12; judge 2 CUTs + 3 KEEPs, both applied; committed `ddbfa240`) | 2026-09-05 (completed — ✅ Ready; 118 questions in en/+es/; one CV bullet rewritten; commit 24d6b50c) |
| 02-weather-app |  |  | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | 2026-09-28 (global only — completed; judge 6 CUTs + 3 KEEPs, all applied; 2 orchestrator objections; committed `9ae50a8e`, re-cut `8508ae61`) | 2026-09-07 (completed — ✅ Ready; G7 signed; +39 questions → 109 in en/+es/; CV bullet saved; commits 3534580c + f81e738b) |
| 03-expense-tracker |  |  | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06; the run that motivated the Step 3b consistency reviewer) | 2026-09-28 (global only — completed; judge 2 CUTs + 1 ADD + 3 KEEPs; 1 objection sustained; committed `8445bb55` + corrective `b58d05b7`) | 2026-09-09 (completed — ✅ Ready; G7 signed; `DRY_RUN = true`, outputs committed on Victor's instruction; 122 questions in en/+es/; commits b3be786f, 5c687091) |
| 04-meal-finder |  |  | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | 2026-09-27 (global only — completed; judge 3 CUTs + 1 ADD + 3 KEEPs, all applied; committed `1b70f799`; 3 Low tasks raised `7dd11128`) | 2026-09-13 (dry-run — ✅ Ready computed; outputs committed on Victor's instruction; +51 questions → 177 in en/+es/; commits 90846198, f0353d17; profile repo `CLAUDE.md` owed to /profile-readme) |
| 05-task-manager |  |  | 2026-07-16 (frontend only — Angular-only project; backfilled 2026-08-06; the `.btn-danger` cross-slice contradiction) | 2026-09-27 (global only — completed; judge 2 CUTs + 3 KEEPs, both applied; committed `a4f93144`; 2 Low tasks raised `90b3d7d7`) | 2026-09-15 (completed — ✅ Ready, verdict recorded only here (no §23); +34 questions → 139 in en/+es/; commit `7c54cf8f`) |
| 06-hr-portal |  | 2026-09-03 — completed (MODE = review; pre-standard plan restructured 133 → 344 lines; history gate ✅) | 2026-07-16 (frontend only — Angular-only project; backfilled 2026-08-06; the rounded-up ✅ on the app-shell scroll fix) | 2026-09-27 (global only — completed; judge 5 CUTs + 4 KEEPs, all applied; 2 orchestrator objections repaired; committed `7e3c8742`; 3 Low tasks `166556a7`) | 2026-09-27 (completed — ✅ Ready; 142 questions in en/+es/, bank created this run; one CV bullet written; commit 44f13bce) |
| 07-timetrack |  | 2026-09-24 (review mode, completed — gate G2 for the deploy-first reversal; new Step 12 Deployment; history gate ✅ 11/11; `e43d809d`) | 2026-09-23 (frontend only, completed — gate G4, Steps 7a–7d; 6 Mediums, 9 Lows, 0 High) · 2026-08-06 (backend only, completed — 2 Highs: secrets in pushed history, `JwtFilter` blank-token 500) | 2026-09-24 (global + backend + frontend, completed — first full-stack run; 1 coherence conflict routed to Victor; committed `db821281`) | 2026-09-26 (frontend only, completed — 45 questions; 101 EN/ES in parity; commit `a5cb976a`; no verdict) · 2026-09-27 (global only, completed — 30 new questions, 141 EN/ES; commit `ab270bd8`; no verdict) |

Read left to right: the brief chose the project → the plan built it → review, README and portfolio
closed it. **The `review-audit` cell is an execution record, not review state**: whether a tier holds
unreviewed code is answered by `{project}/PROJECT-BACKLOG.md`'s per-tier `Last Reviewed` lines, which the
unreviewed-code gate reads and this column never is. **The `portfolio-audit` cell is an execution record
too, and since 2026-09-05 (`REC-189`) it can hold a bank-only run** — `2026-09-05 (backend only, …)` —
which computes no verdict and closes no gate. Because a cell records the *last* run and not a history,
such a run **overwrites** the cell that held the last full gate result: the verdict itself lives in the
project's own `PLANNING.md` §23 G7 box, and the bank's per-tier freshness in its `**Last banked — «tier»:**`
header. Neither is this column, and neither is lost when it moves. The seven 2026-07 cells were backfilled on
2026-08-06 from
each backlog's own `Last Reviewed` lines — until then the column was empty although every project had
been reviewed, because the prompt's own Step 6 never mentioned this file (REC-043). **`project-brief` is the one column whose row may not exist yet**: it decides the *next*
project, so its run creates that project's row before any folder does. Its cell's staleness is not
tracked here — the brief carries its own `Coverage SHA-256`, marker count and `Status:` header, and its
consumer reads freshness from the file itself.

## Global pipeline prompts (no per-target scope)

| Prompt | Last run |
|---|---|
| coverage-audit | 2026-08-01 — completed — junior update; 1,344-item floor converged; 497 markers preserved; mirror parity; cold review passed · ⚠ stale 2026-09-04 (+95 bullets) |
| progress-update | 2026-10-09 — completed — MODE=active; 2/2 dispatches; 2 drift rows (`Authoring progress` denominator, `Study progress` missing 06); matrix refreshed in 4 rows (`176ebdc4`) |
| roadmap-review | 2026-10-09 — completed — parity PASS (14 topics x 3 levels); 4/4 roles, both reviewers passed after fixes; Steps 8–10 reflected; no new candidate; `2d6f911f` |
| system-gaps | 2026-08-11 — completed — `MODE = update`; 23 subjects reconciled, 5 promoted (`REC-094`–`REC-098`); cold reviewer `approve-with-tightening` |
| system-check · knowledge | 2026-10-16 — completed — 44 paths, 28/28 dispatches; 44 map cells corrected, REC-349…353 opened; reviewer approve-with-tightening; BRCH-0003 → REC-354 (`2a3b8250`) |
| system-check · projects | 2026-10-17 — completed — 43 paths, 28/28 dispatches; maps synchronized, REC-358…364 opened; reviewer approve-with-tightening; BRCH-0006 → REC-354 (`b5effb82`) |
| system-check · practice | 2026-10-16 — completed — 52 paths, 30 dispatches (28 required + 2 cold re-dispatches); 32 map cells corrected, REC-355…357 opened; reviewer approve-with-tightening (`4fec3e6a`) |
| system-check · strategy | 2026-10-18 — completed — 24 paths, 16 dispatches (12 required + 4 cold re-dispatches); 5 map cells corrected, REC-365 opened; reviewer approve-with-tightening; BRCH-0007 → REC-354 (`923176c0`) |
| system-check · system | 2026-10-18 — completed — 22 paths, 19 dispatches (18 required + 1 cold re-dispatch); 23 map cells corrected, REC-366…369 opened; reviewer approve-with-tightening (`1ef91506`) |
| system-check · cross |  |

## Single-shot prompt executions

One latest-run row per prompt: every single-shot prompt, plus the two route orchestrators
(`interview-prep-route` and, since 2026-09-06, `interview-prep-route-projects`), the two the tables
above hold no execution cell for. Target/mode contains the configuration that
identifies the work; prompts with no target use `global`. A row here records the **run**; where a prompt
also has a progress cell above (`sql-exercises`, `simulation-review`), its close-out writes the two
together and neither replaces the other; `sql-grade` writes the `sql-exercises` progress cell alone,
since its grading door runs no close-out.

| Prompt | Last run | Target / mode | Outcome | Result |
|---|---|---|---|---|
| code-review-prompt | | | pending | |
| cover-letter-prompt | | | pending | |
| cv-prompt | 2026-10-03 | `create` · `PROJECTS = auto` → `07-timetrack`, `06-hr-portal` | completed | one-page Spanish master CV saved to `job-search/master/cv-2026-10.md` (outside the repo); two projects featured; no sourced bullet fails the Project-bullet spec |
| evidence-intake-prompt | 2026-10-14 | `search` · FOCUS blank | completed | 8 junior + 6 `## Techo` postings added (Tecnoempleo, 2026-10); Synthesis re-tallied to /22; footer 14+5 → 22+11 (`e5a05b49`) |
| hr-screen-prompt | | | pending | |
| interview-prep-route-prompt | | | pending | |
| interview-prep-route-projects-prompt | | | pending | |
| linkedin-prompt | 2026-10-03 | `global` | completed | every section drafted to chat, nothing stored; projects 07, 06, 04; `origin/main`'s 07 README predates the deploy — push-and-merge precondition |
| profile-readme-prompt | | | pending | |
| simulation-generator-prompt | | | pending | |
| simulation-review-prompt | | | pending | |
| simulator-prompt | | | pending | |
| sql-exercises-prompt | 2026-10-02 | junior · `practice` · `basics` (Step 0) · `COUNT = 10` | completed | 10 first-pass exercises in new `practice/sql/junior/02-execution-order-set-ops.sql`; `PROGRESS.md` `Corrected` 40/50; route fingerprint stale, `/sql-plan junior` owed |
| tracker-prompt | | | pending | |
