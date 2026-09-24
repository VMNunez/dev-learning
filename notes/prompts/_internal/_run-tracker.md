# Run tracker — which targets each prompt has been run on

**What this is.** A permanent dashboard of every runnable prompt's latest execution, with target-level
progress for pipelines. It answers at a glance what completed,
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
| Angular | 2026-07-29 — completed — 108 items; verify-gap fast path; 5 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA a22f33f6; fresh verification optional | 2026-09-04 — completed — 18 entries; 149 concepts; 4 create / 14 audit; 22 new bullets assigned; routing split into 11 (URL-driven view state) + 12 (matching, lazy loading, guards), 4 English-only renumbers 12→13, 14→15, 15→16, 16→17; 4 unassigned `_legacy` notes read end-to-end; mirror parity; cold review BLOCKED, 5 blocking + 3 non-blocking corrections applied, 1 rejected · ⚠ stale 2026-09-24 (fingerprint only on 2026-09-04; +24 bullets since — the `DatePipe` date-only time-zone bullet from the 07 pre-PR date-display backlog close, the application-locale bullet from the 07 en-GB dates backlog close, the static-import-cancels-the-split and componentless-parent-routes routing bullets plus `emitEvent: false`, `afterNextRender` and cross-field validators, all from project 07 Step 7a, the `Router.navigate()` outcome bullet from the 07 login-navigation backlog close, the query `read` option bullet from the 07 dialog-focus backlog close, the cancelling-an-in-flight-`HttpClient`-request bullet from the 07 HTTP-teardown backlog close, the session-expiry-in-an-auth-interceptor and one-time-notices-across-a-navigation bullets from the 07 silent-`401` backlog close, the same-URL-navigation-is-skipped bullet from the 07 responsive-sidenav backlog close, the component-member-visibility bullet from the 07 Step 7a hygiene backlog close, the route-titles bullet from the 07 document-title backlog close, the `CanMatchFn` route-variants bullet from the 07 Step 7b close, and the provider's-import-is-a-static-import bullet from the 07 bundle-budget backlog close, 2 more on 2026-09-22, and the recovering-with-`EMPTY`-vs-a-fallback-value bullet from the 07 reload-focus backlog close, plus the refetch-is-not-a-first-load and derived-state-outlives-its-data bullets from the 07 reports-loading close, and the what-`required`-actually-tests bullet from the 07 whitespace-validation close, and the deep-links-need-a-server-fallback bullet from the 07 Step 12 static-host piece) | 0/18 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Angular Material | 2026-07-29 — completed — 73 items; verify-gap fast path; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 3 gaps | 2026-08-02 — completed — 16 entries; 76 concepts; 3 create / 13 audit; 15 English-only notes classified (13 keep, 2 unassigned); 0 relocations; 0 renumberings; mirror parity; cold review applied; entry-01 split deferred (prefix collision, REC-019) · ⚠ stale 2026-09-19 (+15 bullets since this run — 2 on 2026-09-04, 3 from project 07's M3 theme setup, 1 from project 07 Step 7a on disabled controls and focus, 1 from the 07 dialog-focus backlog close on a restore target that still exists, 1 from the 07 mid-session-401 backlog close on dialog lifetime outliving its opener, 1 from the 07 login-h1 backlog close on title directives carrying no heading semantics, 1 from the 07 responsive-sidenav backlog close on `BreakpointObserver`, 1 from the 07 account-arrow backlog close on a menu trigger's open state, 1 from the 07 PLANNING-drift backlog close on where a form dialog's save runs, 1 from the 07 filter-panel backlog close on a select panel's width, 1 from the 07 clipped-icon backlog close on a component's own styles arriving after the global stylesheet, 1 from the 07 en-GB dates backlog close on the adapter deciding what a typed date means; 1 bullet also removed by the HTML boundary migration) · ⚠ stale 2026-09-22 (+6 bullets) | 0/16 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Spring | 2026-08-01 — completed — 61 junior items; verify-gap fast path; 1 gap consumed by correction; 7 markers preserved; mirror parity; notes-plan next | 2026-08-01 — completed — 1 gap; SHA c8b255b9 matches coverage | 2026-08-01 — completed — 12 entries; 58 concepts; 12 create / 0 audit; no legacy notes; mirror parity; cold review applied | 0/12 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Spring Boot | 2026-07-27 — completed — 136 items; verify-gap fast path; 4 gaps judged (3 added, 1 moved to middle); mirror parity; notes plan stale | 2026-07-27 — complete — 136 items pass strict bar; zero gaps; SHA 43a1261f matches coverage; notes-plan unblocked | 2026-08-28 — completed — 16 entries; 136 concepts (0 checked); 3 create / 13 audit; +8 bullets routed into 01/03/04/05/06/07; 16 headers migrated to spaced form with `Studied`/`Pending study`; 3 pairs unassigned; no relocations or renumbers; mirror parity; cold review applied (10 corrections, 3 blocking) · ⚠ stale 2026-09-24 (+3 bullets) | 0/16 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Java | 2026-07-26 — completed — 121 items; consumed array-access gap (fast path); mirror parity; notes plan stale | 2026-07-26 — complete — 121 items pass strict bar; SHA 4c9d4cc9 matches coverage; notes-plan unblocked | 2026-09-16 — completed — 18 entries; 132 concepts (31 checked); 1 create / 17 audit; SHA bad12930; stale flag consumed (+2 bullets: locale-sensitive case conversion → refined entry 02 as a pending addition, pom project metadata → entry 17); 0 relocations, 0 renumbers, 0 unassigned; Guard 2 unowned population empty, 0 notes read; cold review applied (2 blocking — `extends` scaffolding for entry 07, entry 06's outcome promising equality it defers — plus 12 advisory, 1 partially on frozen entry 00); REC-248 filed | 5/18 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Architecture | 2026-07-29 — completed — 65 junior items; full recalibration; 1 item moved to middle; mirror parity; notes-plan refresh next | 2026-07-29 — completed — complete; zero gaps; SHA 31dde116 matches coverage | 2026-08-27 — completed — 20 entries; 72 concepts; 15 create / 5 audit; 2 middle-level bullets unassigned; entries 02 and 05 split on cold review; 2 English-only renumberings (07→05, 18 from 16); mirror parity; cold review passed · ⚠ stale 2026-09-23 (+12 bullets) | 0/20 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Security | 2026-07-29 — completed — 95 junior items; verify-gap fast path; 2 gaps added; 1 factual tightening; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 2 gaps; SHA 1cd18117 matches coverage | 2026-09-04 — completed — 14 entries; 107 concepts; 9 create / 5 audit; 5 bilingual pairs classified keep (plan-owned); 3 pairs renumbered 03→04, 04→05, 05→06 for the entry-03 split; 0 relocations; mirror parity; cold review BLOCKED then applied · ⚠ stale 2026-09-22 (+1 bullets) | 0/14 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| TypeScript | 2026-07-29 — completed — 81 items; verify-gap fast path; 4 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA 88c63060; fresh verification optional | 2026-07-29 — completed — 15 entries; 81 concepts; 8 create / 7 audit; 7 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-09-16 (+6 bullets) | 0/15 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| JavaScript | 2026-07-29 — completed — 128 items; verify-gap fast path; 5 gaps consumed; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 5 gaps; SHA f35c4540; findings consumed by coverage update | 2026-07-29 — completed — 22 entries; 128 concepts; 7 create / 15 audit; 15 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-09-22 (+5 bullets) | 0/22 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| HTML | 2026-09-04 — completed — 81 junior items; FIRST_RUN full recalibration + boundary migration; 9 inbox proposals consumed (9 added, 1 split on review); 1 concept moved from Angular Material junior and 1 from Angular Material senior; 3 adjacent bullets trimmed (CSS junior x2, Angular junior x1) with markers preserved; `middle.md` (15) and `senior.md` (7) created as classification destinations, neither calibrated by its own run; 0 markers authored; mirror parity at all three levels; notes-plan missing | 2026-09-08 — completed — 81 junior items reviewed; 3 gaps (all junior); SHA 29b2ba5d matches coverage; 2 proposals routed to CSS; coverage-prompt update suggested | | | | | | | | | | | | | |
| CSS | 2026-08-01 — completed — 115 junior items; verify-gap fast path; 8 gaps accepted as 9 bullets after reviewer split; mirror parity; notes-plan refresh next | 2026-08-01 — completed — 8 gaps consumed; verdict superseded by SHA e068b446; fresh verification optional | ⚠ stale 2026-09-23 (+8 bullets; plan file dated 2026-07-24, no run recorded in this cell) |  |  |  |  |  |  |  |  |  |  |  |  |
| SQL | 2026-08-03 — completed — 149 junior items; full recalibration; 12 additions, 2 bullet splits, 3 factual corrections, 2 new sections; orphan bullet filed (unblocks sql-plan Guard 4); 19 markers preserved; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded; verification optional | 2026-08-28 — completed — 17 entries; 151 concepts (0 checked); 3 create / 14 audit; SHA 39aa0cfc; stale flag consumed (+42 bullets, 24 rewordings absorbed, 3 deleted bullets dropped from entry 13); 14 English-only notes read end to end and classified keep; 0 relocations, 0 renumbers; 17 headers migrated to spaced form with `Studied`/`Pending study` and checkbox concepts; 4 DDL bullets moved 01→02 and 3 concepts reassigned across entries on cold review (13 corrections, 6 blocking) · ⚠ stale 2026-09-24 (+1 bullets) | 0/17 complete — completed |  |  |  |  |  |  |  |  |  |  |  |
| Git | 2026-08-01 — completed — 92 junior items; full recalibration; 4 additions; 2 bullet splits; mirror parity; notes-plan refresh next | 2026-08-01 — completed — gaps consumed; verdict superseded by SHA f989cc0b |  |  |  |  |  |  |  |  |  |  |  |  |  |
| General | 2026-08-01 — completed — 113 junior items; full recalibration; 8 additions; 3 moved to middle; mirror parity; notes-plan refresh next | 2026-08-01 — completed — complete; zero gaps; SHA b0307fdc matches coverage | 2026-08-02 — completed — 21 entries; 116 concepts; 14 create / 7 audit; 12 English-only notes classified into intuitive thematic folders; 0 cross-level relocations; mirror parity; cold review passed · ⚠ stale 2026-09-24 (+9 bullets; prior flag was fingerprint only — the 4 counted on 2026-09-04, plus the expiring-page-index and terminating-retry bullets from the 07 paging close, plus the multi-stage build, image layer cache and build context bullets from 07's Dockerfile) | 0/21 complete — completed |  |  |  |  |  |  |  |  |  |  |  |

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
| junior | 2026-08-28 — completed (14 steps · 15 files · 209 first-pass · 151/151 bullets assigned; SHA 39aa0cfc unchanged — no coverage drift, so no step/target/status moved; 13 of 15 cold-review findings applied, 7 of them BLOCKING: two done conditions that passed without the step being drilled (Steps 11, 12), three `**Focus:**`/`**Concepts:**` lines naming unclaimed or not-yet-taught scope (Steps 1, 3, 4), Step 2's two same-`TOPIC` runs sharing a `none` FOCUS, and Step 0's stale "batch already written" paragraph; 2 deferred → coverage finding, see report) | 2026-08-28 — completed — `SCOPE = full`; fingerprint matched (route not stale); no new step owed (151/151 bullets, 18/18 sections already claimed); doctrine §0 gained its writer statement (and the finding that `Current branch`/`Blocked on` have none), invariant 9 now cites the exercise prompt's `## Configuration` block instead of a stale copy missing `LEVEL`, §11 closure count 207→209, the TimeTrack file list corrected to three files, Moment 2b's 60/40 split handed back to the prompt; route: one §2 field completed; history gate passed | 0/14 steps closed |
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
| 01-todo-list | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | 2026-08-29 (global only — Angular-only project; FIXED, README changed) | 2026-09-05 (completed — ✅ Ready; 118 questions in en/+es/, the twin created this run; IDs 001–119 and priority markers backfilled over the whole bank, 114 removed as a cross-section duplicate and its number never reused; one CV bullet rewritten to the Project-bullet spec; commit 24d6b50c) |
| 02-weather-app | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | 2026-08-31 (global only — Angular-only project; author FIXED, cold reviewer PASS/unchanged; README changed) | 2026-09-07 (completed — ✅ Ready; G7 signed. Check 1 passed on evidence the standard does not name — the plan carries a bare 7-step list with no ✅ (REC-217, reproduced) — so PROGRESS.md row 02 `Done ✓`, the live Netlify deploy and every step artefact on disk were the source; Check 2 clean (no open High/Medium, frontend reviewed 2026-07-14); Check 3 passed against the 2026-09-07 `MODE = all` drift report — `no drift`, scope naming this project, baseline PROGRESS.md commit the same day. Both sanity scans clean — no unchecked-but-resolved task, README carries a real screenshot and zero placeholders. Bank re-run over the 71 questions the 2026-09-07 dry run left: 3 sections again (Security & Auth skipped — no auth; Testing skipped — the five specs are CLI stubs), 8 dispatches, no retry, ratios 1.24 / 1.00 / 1.05 after each reviewer added its own gaps; +39 questions, IDs 072-110, one cross-section duplicate deleted by the orchestrator scan (039, subsumed by 107; number never reused) → 109 in en/+es/, parity verified independently 41 · 22 · 46. Whole-file marker proportion 13 ⭐⭐⭐ / 56 ⭐⭐ / 40 ⭐ — both failing conditions pass, ⭐⭐⭐ at 12% sits under the 20-25% band. Stage T RE-SYNCED, stage C FIXED with 9 wording repairs. CV bullet saved, all eight spec conditions satisfied; GitHub description n/a — monorepo. Profile README row 02 refreshed (stale `angular/` path → `projects/`, stack cell sharpened); its commit is Victor's. Commits 3534580c + f81e738b) |
| 03-expense-tracker | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06; the run that motivated the Step 3b consistency reviewer) | 2026-09-01 (global only — Angular-only project; completed — author FIXED, cold reviewer PASS/unchanged; README changed) | 2026-09-09 (completed — ✅ Ready; **G7 signed**. Configured `DRY_RUN = true`, so the run itself committed none of its outputs and handed back the sequence; Victor then directed the commits in the same session and they were made for him — bank + twin + CV bullet `b3be786f`, the recount `5c687091`, and the profile README `d857cbe0` in its own repo. **The push stays his and was not run.** A later reader should not read this cell as a dry run that committed: the dry branch executed as written and the outputs landed on an explicit instruction after it. All three gate checks clean, announced at step 0 and re-run in Phase 2: Check 1 on the markerless-plan branch — the plan holds a bare 7-step list with zero markers, so completeness came from PROGRESS.md row 03 `Done ✓` (REC-217 branch, working as written); Check 2 clean (backlog holds no open tasks at all, frontend reviewed 2026-07-14, backend n/a — Angular-only); Check 3 passed against the 2026-09-07 `MODE = all` drift report — `no drift`, scope names this project, baseline PROGRESS.md commit the same day. Both sanity scans clean — no open task to cross-check, README carries two real screenshots and zero placeholders. Bank created this run: 3 sections (Security & Auth skipped — no auth anywhere in src/; Testing skipped — all 8 specs are CLI stubs and app.spec.ts still asserts the generated Hello heading), 8 dispatches, no retry consumed, ratios 1.00 / 1.00 / 1.00 after each reviewer added its own gaps (authors arrived at 0.83 and 0.89). 122 questions, IDs 001–122, no gap and no renumber; en/ + es/ both created, parity verified independently 48 · 47 · 27 and ID+marker sequence byte-identical. Whole-file proportion 24 ⭐⭐⭐ / 68 ⭐⭐ / 30 ⭐ — zero unmarked so the test ran; ⭐⭐⭐ at 19.7% sits in the 20-25% band and both failing conditions pass. Cross-section scan removed nothing — no duplicate, no ID collision. Stage T TRANSLATED, stage C FIXED with 69 prose repairs over 54 questions and three defects reported not repaired: -057 and -079 are English-side factual errors that both an author and its cold reviewer passed, -092 is a Spanish calque. CV bullet saved to the working tree, all eight spec conditions satisfied; GitHub description n/a — monorepo. Profile README row 03 refreshed (stale `angular/` path → `projects/`, stack cell sharpened) and left uncommitted in that repo. Authoring recount skipped per the dry-run rule; it would have added `| 03-expense-tracker | 0/122 (0%) |`) |
| 04-meal-finder | | | 2026-07-14 (frontend only — Angular-only project; backfilled 2026-08-06) | 2026-09-02 (twice. Run 1 — first run with the `REC-197` reader-effect judge: author FIXED, cold reviewer PASS/unchanged, judge returned 10 items, applier B applied all 10 with zero rejections — one of them wrongly, `REC-199`, restored by hand in `98daae04`. Run 2, after the `REC-200` rewrite of rule 9 — completed; author FIXED (2 Features bullets), reviewer PASS 12/12 unchanged, judge returned 3 items + 3 KEEPs, applier B applied all 3 with zero objections — **including a verbatim repeat of `REC-199`'s cut**, which the orchestrator caught out of band and B reinstated when re-dispatched with rule 8's inclusion tests named; that is `REC-202`. Committed `63a5c0b4`; README changed. acceptance run for `REC-202` deferred at closure on `412bb801`, and since discharged — see the 2026-09-03 entry below) · **2026-09-03 — `REC-202` acceptance run: PASSED.** Author FIXED (2 `What I learned` bullets added), reviewer PASS 12/12 unchanged, judge returned 3 KEEPs and **0 items** — it formed two cut candidates and dropped both after reading the owning rule, and the `Future improvements` cut did not recur; pre-commit `git diff` verification run and clean. Committed `3f682ca8` | 2026-09-13 (dry-run — ✅ Ready computed; `DRY_RUN = true`, so the run itself committed only this record, the self-report and `REC-236` (`0fdedf89`); **Victor then directed the outputs committed in the same session** — bank + twin + CV bullet `90846198`, the recount `f0353d17`, and the profile README `dc59275` in its own repo. **The push stays his and was not run.** Step-0 preflight: nothing owed. Check 1 on the markerless-plan branch — PROGRESS.md row 04 `Done ✓`; Check 2 clean (zero open tasks, frontend reviewed 2026-07-14); Check 3 passed against the 2026-09-13 `MODE = all` report — `no drift`, scope names this project, baseline `e4b2ee83` PROGRESS.md commit the same day. Both sanity scans clean (three real screenshots, no placeholders). Bank re-run over the untracked 2026-09-12 bank: 4 sections (Security & Auth skipped — no auth), every ratio 1.00; +51 questions (IDs 127–177) and ~40 existing answers corrected by the reviewers → **177 in en/+es/**, 68 · 38 · 35 · 36, no deletion, no renumber; proportion 22 ⭐⭐⭐ / 98 ⭐⭐ / 57 ⭐ — both failing conditions pass, ⭐⭐⭐ at 12% under the band. Stage T died on an Opus weekly limit and was re-dispatched on Sonnet; its `RE-SYNCED` was false on content (stale -101, -033, 12 bold lines, 9 markers), caught by the orchestrator and fixed on the one retry → `REC-236`. Stage C (Sonnet) FIXED, one calque (-021). CV bullet saved uncommitted, all eight spec conditions satisfied; GitHub description n/a — monorepo. Profile README row 04 refreshed (stale `angular/` path → `projects/`, stack cell) committed in that repo, whose `CLAUDE.md` is still dirty — owed to /profile-readme. Authoring recount added `| 04-meal-finder | 0/177 (0%) |` after the directed commit) |
| 05-task-manager | | | 2026-07-16 (frontend only — Angular-only project; backfilled 2026-08-06; the `.btn-danger` cross-slice contradiction) | 2026-09-03 (global only — Angular-only project; completed — author FIXED, reviewer FIXED 12/12 traced, judge returned 3 items + 3 KEEPs; B applied both CUTs and returned the ADD unresolved, **sustained** by the orchestrator on rule 4's placeholder clause; the pre-commit `git diff` verification caught B deleting the three SCSS bullets where rule 9 test 1 mandates a merge, re-dispatched and repaired — `REC-202`'s first catch. Committed `4330ea82`; README changed) | 2026-09-15 (completed — ✅ Ready; G7 not signed (Angular-only, no §23), verdict recorded here. Step-0 preflight: nothing owed. Check 1 markerless-plan branch — PROGRESS.md row 05 `Done ✓`; Check 2 clean (zero open tasks, frontend reviewed 2026-07-16); Check 3 passed against the 2026-09-13 `MODE = all` report, baseline `3ce61cfa` PROGRESS.md commit the same day. Placeholder scan clean (task-dialog screenshot filled in `3ce61cfa`). Re-run over yesterday's bank: 4 sections (Security & Auth skipped — no auth), 11 dispatches for 10 required (Testing reviewer died on an Opus session limit, no agent id to resume, re-dispatched once), every ratio 1.00; +34 questions (IDs 106–139), 139 total, 55 · 24 · 34 · 26, no deletion, no renumber, 0 unmarked, 0 refined; proportion 15 ⭐⭐⭐ / 69 ⭐⭐ / 55 ⭐ — both failing conditions pass, ⭐⭐⭐ at 11% under the band. Stage T RE-SYNCED 139/139, parity verified by command (section + ID + marker sequence) before and after stage C; stage C FIXED, no suspected translation errors. CV bullet re-drafted identical to the saved one, all eight conditions satisfied, file unchanged; GitHub description n/a — monorepo. Profile README row 05 refreshed and committed in its repo `651d17a` (push owed to Victor; its dirty `CLAUDE.md` left, owed to /profile-readme). Commit `7c54cf8f`. Authoring recount: row 05 added 0/139 (0%), `c9c4d0fe`) |
| 06-hr-portal | | 2026-09-03 — completed (MODE = review; pre-standard plan restructured 133 → 344 lines: routes + shared-state ownership tables, design-system/per-page UI, business rules, corrected guard file names, 14 done conditions + ✅ markers; `whole-plan` fixed 4 cross-section contradictions and a stale PROJECT-BACKLOG.md count; history gate ✅ — snapshot held no done-markers) | 2026-07-16 (frontend only — Angular-only project; backfilled 2026-08-06; the rounded-up ✅ on the app-shell scroll fix) | 2026-09-04 (global only — Angular-only project; completed — author FIXED, cold reviewer PASS 12/12 unchanged, judge returned 8 items + 3 KEEPs; B applied all 8 with zero objections, 2 of them flagged `⚠ regenerable — standard gap` (`What I learned` cuts whose concepts are PLANNING.md objectives); pre-commit `git diff` verification run and clean. Committed `ab954689`; README changed) | |
| 07-timetrack | | 2026-09-24 (review mode, completed — gate G2 for the 2026-09-23 deploy-first reversal: §15 build order 11 → 12 → 8 → 9 → 10 with a new Step 12 Deployment, §0 on Step 11, §22 re-chained; seven specialists + 3 reconciliations; history gate ✅ 11/11; `e43d809d`; G2 box left for Victor) | 2026-09-23 (frontend only, completed — gate G4, Steps 7a–7d; 12 dispatches over 11 slices + the consistency pass, all traced after 1 re-dispatch; 6 Mediums, 9 Lows, 0 High — a false High dropped on cross-slice reconciliation) · 2026-09-19 (frontend only, completed — Steps 7a–7b, ahead of G4; 7 dispatches, all traced after 2 trace re-dispatches; 3 Mediums, 0 High) · 2026-08-06 (backend only, completed — 13 dispatches, all traced; 2 Highs: secrets in pushed history, `JwtFilter` blank-token 500) | | |

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
| coverage-audit | 2026-08-01 — completed — junior update; 1,344-item floor converged; 497 markers preserved; mirror parity; cold review passed · ⚠ stale 2026-09-04 (+95 bullets; the HTML topic did not exist at that pass) |
| progress-update | 2026-09-13 — completed — `MODE = all` (projects 01-07 + SQL + simulations). **No drift**: yesterday's one row (`Study progress` per-project table short of 02 and 03) was repaired by `study-block-close` in `b1a90f99`, and D3/D4/D5/D8/D9/D10/D11 all measured clean — 42 coverage cells and three `Total` rows, 5/213* authored, project refined rows 1/118 · 0/109 · 0/122, SQL route 209, 15 pending simulations. D7 moved no cell, so no `PROGRESS.md` commit. Drift report `8d7b79c1`; its `Scope:` names 04 and it post-dates `PROGRESS.md`'s last commit, so 04-meal-finder's Check 3 now holds. Whole read of the prompt corrected three `_system-map.md` §7 read-by cells and the README catalogue `Reads` cell in `78d43af7` |
| roadmap-review | 2026-08-08 — completed — ran after `progress-update` on REC-042's per-level marker rewire; aligned the active-project gate, exact SQL coverage-heading statuses, phase markers and Project 08 gap candidates; two cold reviews passed; REC-050 closed in `1e10f42` |
| system-gaps | 2026-08-11 — completed — `MODE = update`; maps read to EOF (710 + 597, hashes stable); all D1–D10 reported; 23 reconciled subjects — 5 promoted (`REC-094`–`REC-098`), 1 deferred over cap, 12 licensed, 3 under `REC-054`, 1 duplicate/possible map defect, 1 routed map defect; independent partition 5 both + 8 analyst-only + 10 orchestrator-only; cold reviewer `approve-with-tightening` |
| system-check | 2026-08-13 — blocked — 170-path frozen inventory; 168/168 analyst-owned files read to EOF; 4,988 unique atomic facts; 1,090 claim-bearing map lines reached 1,959 provisional atomic rows, but claim and reverse dispositions did not close against contradictory source clauses; no map correction or final review; audit report `76b5f35c`; repeated Step 4 failure opened `REC-109` in `1d313bc5` |

## Single-shot prompt executions

One latest-run row per prompt: every single-shot prompt, plus the two route orchestrators
(`interview-prep-route` and, since 2026-09-06, `interview-prep-route-projects`), the two the tables
above hold no execution cell for. Target/mode contains the configuration that
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
| interview-prep-route-projects-prompt | | | pending | |
| linkedin-prompt | | | pending | |
| profile-readme-prompt | | | pending | |
| simulation-generator-prompt | | | pending | |
| simulation-review-prompt | | | pending | |
| simulator-prompt | | | pending | |
| sql-exercises-prompt | | | pending | |
| tracker-prompt | | | pending | |
