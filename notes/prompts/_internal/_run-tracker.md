# Run tracker — which targets each prompt has been run on

**What this is.** A permanent dashboard of every runnable prompt's latest execution, with target-level
progress for pipelines and file-level progress for study notes. It answers at a glance what completed,
what remains pending, and what last stopped as blocked or dry-run. Detailed machinery verdicts stay in
each prompt's `_last-run-report*.md`; this file stores concise operational state.

**Who updates it.** Every runnable prompt through `_pipeline-self-report.md` or
`_single-shot-self-report.md`. After writing its report, it updates the applicable row with the run
date, target/mode, outcome, and concise result, then commits report and tracker together. Victor never
fills it by hand (though he may correct it).

**One exception — the `coverage-bullet-add` skill** appends a stale flag to a `Plan` cell (see below).
It is the only writer that is not a prompt close-out, because the debt it records is created in a daily
session, where no prompt runs at all. It writes nothing else in this file.

**Two writers, one flag.** `coverage-prompt` writes the same flag, in the same accumulating form, for the
plans its own run left behind — and on the `coverage-audit` row when its recalibration lands after that
level's convergence pass. It is the larger source of the debt by far, since one recalibration can
add a dozen bullets where the skill adds one. The skill covers the daily-session path and the prompt
covers the pipeline path; a flag written by either is read and cleared identically, and the next run of
the flagged prompt rewrites the whole cell.

**How to read it:** records use `YYYY-MM-DD — completed|blocked|dry-run — concise result`. An empty
cell means **pending**: the current prompt version has not run on that target. Output files that
predate the current prompt version do not count as executions. Prompts may read this file as a gate,
but only a `completed` result satisfies a prerequisite; `blocked` and `dry-run` do not.

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
makes the reader do arithmetic to find out.

**Tracking baseline reset:** 2026-07-24. Earlier execution records were cleared after the prompt
system changed. Only runs recorded from this baseline onward are valid; the Java Junior coverage run
is the first retained execution.

## Per-topic prompts

| Topic | Coverage J | Verify J | Plan J | Notes J | Interview J | Coverage M | Verify M | Plan M | Notes M | Interview M | Coverage S | Verify S | Plan S | Notes S | Interview S |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Angular | 2026-07-29 — completed — 108 items; verify-gap fast path; 5 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA a22f33f6; fresh verification optional | 2026-08-02 — completed — 17 entries; 127 concepts; 3 create / 14 audit; mirror parity; cold review corrections applied · ⚠ stale 2026-08-04 (fingerprint only) | 0/17 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Angular Material | 2026-07-29 — completed — 73 items; verify-gap fast path; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 3 gaps | 2026-08-02 — completed — 16 entries; 76 concepts; 3 create / 13 audit; 15 English-only notes classified (13 keep, 2 unassigned); 0 relocations; 0 renumberings; mirror parity; cold review applied; entry-01 split deferred (prefix collision, REC-019) | 0/16 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Spring | 2026-08-01 — completed — 61 junior items; verify-gap fast path; 1 gap consumed by correction; 7 markers preserved; mirror parity; notes-plan next | 2026-08-01 — completed — 1 gap; SHA c8b255b9 matches coverage | 2026-08-01 — completed — 12 entries; 58 concepts; 12 create / 0 audit; no legacy notes; mirror parity; cold review applied | 0/12 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Spring Boot | 2026-07-27 — completed — 136 items; verify-gap fast path; 4 gaps judged (3 added, 1 moved to middle); mirror parity; notes plan stale | 2026-07-27 — complete — 136 items pass strict bar; zero gaps; SHA 43a1261f matches coverage; notes-plan unblocked | 2026-08-02 — completed — 16 entries; 128 concepts; 3 create / 13 audit; 3 pairs unassigned (concepts moved to the `spring` topic); 2 same-level bilingual renumbers; 04 split into 03+04; mirror parity; cold review applied · ⚠ stale 2026-08-25 (+4 bullets) | 0/16 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Java | 2026-07-26 — completed — 121 items; consumed array-access gap (fast path); mirror parity; notes plan stale | 2026-07-26 — complete — 121 items pass strict bar; SHA 4c9d4cc9 matches coverage; notes-plan unblocked | 2026-08-02 — completed — 17 entries; 128 concepts; 1 create / 16 audit; SHA b8216257; stale flag consumed; 16 cold classifiers, 0 relocations, 0 renumberings; cold review applied (14/14) | 1/17 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Architecture | 2026-07-29 — completed — 65 junior items; full recalibration; 1 item moved to middle; mirror parity; notes-plan refresh next | 2026-07-29 — completed — complete; zero gaps; SHA 31dde116 matches coverage | 2026-07-29 — completed — 18 entries; 65 concepts; 13 create / 5 audit; 2 English-only legacy renumberings; mirror parity; cold review passed · ⚠ stale 2026-08-25 (+7 bullets) | 0/18 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Security | 2026-07-29 — completed — 95 junior items; verify-gap fast path; 2 gaps added; 1 factual tightening; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 2 gaps; SHA 1cd18117 matches coverage | 2026-07-29 — completed — 13 entries; 95 concepts; 8 create / 5 audit; 5 bilingual pairs classified keep; 0 relocations; mirror parity; cold review passed · ⚠ stale 2026-08-24 (+7 bullets) | 0/13 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| TypeScript | 2026-07-29 — completed — 81 items; verify-gap fast path; 4 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA 88c63060; fresh verification optional | 2026-07-29 — completed — 15 entries; 81 concepts; 8 create / 7 audit; 7 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-08-04 (+2 bullets) | 0/15 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| JavaScript | 2026-07-29 — completed — 128 items; verify-gap fast path; 5 gaps consumed; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 5 gaps; SHA f35c4540; findings consumed by coverage update | 2026-07-29 — completed — 22 entries; 128 concepts; 7 create / 15 audit; 15 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-07-30 (+1 bullet) | 0/22 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| CSS | 2026-08-01 — completed — 115 junior items; verify-gap fast path; 8 gaps accepted as 9 bullets after reviewer split; mirror parity; notes-plan refresh next | 2026-08-01 — completed — 8 gaps consumed; verdict superseded by SHA e068b446; fresh verification optional |  |  |  |  |  |  |  |  |  |  |  |  |  |
| SQL | 2026-08-03 — completed — 149 junior items; full recalibration; 12 additions, 2 bullet splits, 3 factual corrections, 2 new sections; orphan bullet filed (unblocks sql-plan Guard 4); 19 markers preserved; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded; verification optional | 2026-07-29 — completed — 17 entries; 133 concepts; 3 create / 14 audit; 14 English notes classified keep; 0 relocations; mirror parity; cold review applied · ⚠ stale 2026-08-25 (+41 bullets) | 0/17 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Git | 2026-08-01 — completed — 92 junior items; full recalibration; 4 additions; 2 bullet splits; mirror parity; notes-plan refresh next | 2026-08-01 — completed — gaps consumed; verdict superseded by SHA f989cc0b |  |  |  |  |  |  |  |  |  |  |  |  |  |
| General | 2026-08-01 — completed — 113 junior items; full recalibration; 8 additions; 3 moved to middle; mirror parity; notes-plan refresh next | 2026-08-01 — completed — complete; zero gaps; SHA b0307fdc matches coverage | 2026-08-02 — completed — 21 entries; 116 concepts; 14 create / 7 audit; 12 English-only notes classified into intuitive thematic folders; 0 cross-level relocations; mirror parity; cold review passed · ⚠ stale 2026-08-23 (+1 bullet; prior flag was fingerprint only) | 0/21 complete — completed |  |  |  |  |  |  |  |  |  |  |  |

Columns are grouped by level (J, then M, then S), with Coverage → Verify → Plan → Notes → Interview
inside each level. The Notes J/M/S cells are summaries, written as `X/Y complete` plus the last outcome. Their denominator
comes from the corresponding notes plan, never from counting files on disk.

## Notes file executions

One row per planned pair, upserted by `notes-audit`. `Plan status` mirrors the selected plan entry;
`Last outcome` records the execution independently, so a failed retry remains visible without falsely
marking the note complete.

| Topic | Level | Note | English | Spanish | Plan status | Last run | Last outcome |
|---|---|---|---|---|---|---|---|
| Java | junior | 00 | `notes/java/junior/en/00-intro-java.md` | `notes/java/junior/es/00-intro-java.md` | complete | 2026-08-20 | completed — audit under the 2026-08-02 plan; 2/2 concepts `[x]`; four intro invariants written; `Studied` field inserted as `pending`; four stages passed |

## SQL exercise track

The SQL **exercise** route, per level — distinct from the `SQL` row in the per-topic table above, which
tracks the SQL *notes*. `sql-plan` writes the route (`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`); `sql-plan-audit`
audits it together with the level-neutral doctrine (`practice/sql/PLANNING.md`).

| Level | SQL plan | sql-plan-audit | Exercises |
|---|---|---|---|
| junior | 2026-08-03 — completed (14 steps · 15 files · 207 first-pass · 149/149 bullets assigned; doctrine route migrated out) | 2026-08-04 — completed — `SCOPE = full`; fingerprint matched (route not stale); no new step owed (149/149 bullets, 18/18 sections already claimed); revision triggers migrated doctrine §8b → route §1 per REC-020; doctrine §1 gained its `ROADMAP.md` input row; 7 dead `coverage.md` paths and 3 §10 invariant contradictions fixed; history gate passed | 0/14 steps closed |
| middle | | | |
| senior | | | |

The `Exercises` cell is a **summary**, written like a `Notes J/M/S` cell: `X/Y steps closed` plus the
last outcome, where Y is the step count in that level's `PLANNING-{LEVEL}.md` §3 and X the rows at
`closed ✅`. Both numbers come from the plan, **never from counting `.sql` files on disk** — a level with
no plan yet leaves the cell empty. `sql-exercises` writes it in its close-out, on every run including a
`blocked` one; the three cells read left to right answer "route planned → route audited → how much of it
I have actually drilled". There is deliberately no per-step table here: §3 of the plan already is one,
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
| 01-todo-list | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | | |
| 02-weather-app | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | | |
| 03-expense-tracker | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06; the run that motivated the Step 3b consistency reviewer) | | |
| 04-meal-finder | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | | |
| 05-task-manager | | | 2026-07-16 (frontend only — Angular-only project; backfilled 2026-08-06; the `.btn-danger` cross-slice contradiction) | | |
| 06-hr-portal | | | 2026-07-16 (frontend only — Angular-only project; backfilled 2026-08-06; the rounded-up ✅ on the app-shell scroll fix) | | |
| 07-timetrack | | 2026-07-28 (review mode, completed — six-specialist pass: §1 added, §14 visual design system written from scratch, change-password dialog wired §10→§16) | 2026-08-06 (backend only, completed — 13 dispatches, all traced; 2 Highs: secrets in pushed history, `JwtFilter` blank-token 500; batch 3 killed by a session limit and re-dispatched in pairs; frontend tier still `never`) | | |

Read left to right: the brief chose the project → the plan built it → review, README and portfolio
closed it. **The `review-audit` cell is an execution record, not review state**: whether a tier holds
unreviewed code is answered by `{project}/PROJECT-BACKLOG.md`'s per-tier `Last Reviewed` lines, which the
unreviewed-code gate reads and this column never is. The seven 2026-07 cells were backfilled on
2026-08-06 from
each backlog's own `Last Reviewed` lines — until then the column was empty although every project had
been reviewed, because the prompt's own Step 6 never mentioned this file (REC-043). **`project-brief` is the one column whose row may not exist yet**: it decides the *next*
project, so its run creates that project's row before any folder does. Its cell's staleness is not
tracked here — the brief carries its own `Coverage SHA-256`, marker count and `Status:` header, and its
consumer reads freshness from the file itself.

## Global pipeline prompts (no per-target scope)

| Prompt | Last run |
|---|---|
| coverage-audit | 2026-08-01 — completed — junior update; 1,344-item floor converged; 497 markers preserved; mirror parity; cold review passed · ⚠ stale 2026-08-04 (+14 bullets) |
| progress-update | 2026-08-08 — completed — `MODE = active` (07-timetrack + SQL + simulations); level matrix refreshed from the current notes plans; coverage, project status and simulation counts matched; no actionable drift |
| roadmap-review | 2026-08-08 — completed — ran after `progress-update` on REC-042's per-level marker rewire; aligned the active-project gate, exact SQL coverage-heading statuses, phase markers and Project 08 gap candidates; two cold reviews passed; REC-050 closed in `1e10f42` |
| system-gaps | 2026-08-11 — completed — `MODE = update`; maps read to EOF (710 + 597, hashes stable); all D1–D10 reported; 23 reconciled subjects — 5 promoted (`REC-094`–`REC-098`), 1 deferred over cap, 12 licensed, 3 under `REC-054`, 1 duplicate/possible map defect, 1 routed map defect; independent partition 5 both + 8 analyst-only + 10 orchestrator-only; cold reviewer `approve-with-tightening` |
| system-check | 2026-08-13 — blocked — 170-path frozen inventory; 168/168 analyst-owned files read to EOF; 4,988 unique atomic facts; 1,090 claim-bearing map lines reached 1,959 provisional atomic rows, but claim and reverse dispositions did not close against contradictory source clauses; no map correction or final review; audit report `76b5f35c`; repeated Step 4 failure opened `REC-109` in `1d313bc5` |

## Single-shot prompt executions

One latest-run row per prompt: every single-shot prompt, plus `interview-prep-route`, the one
orchestrator the tables above hold no execution cell for. Target/mode contains the configuration that
identifies the work; prompts with no target use `global`. A row here records the **run**; where a prompt
also has a progress cell above (`sql-exercises`, `simulation-review`), the two are written together and
neither replaces the other.

| Prompt | Last run | Target / mode | Outcome | Result |
|---|---|---|---|---|
| code-review-prompt | | | pending | |
| cover-letter-prompt | | | pending | |
| cv-prompt | | | pending | |
| evidence-intake-prompt | | | pending | |
| hr-screen-prompt | | | pending | |
| interview-prep-route-prompt | | | pending | |
| linkedin-prompt | | | pending | |
| profile-readme-prompt | | | pending | |
| simulation-generator-prompt | | | pending | |
| simulation-review-prompt | | | pending | |
| simulator-prompt | | | pending | |
| sql-exercises-prompt | | | pending | |
| tracker-prompt | | | pending | |
