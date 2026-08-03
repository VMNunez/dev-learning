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

**How to read it:** records use `YYYY-MM-DD — completed|blocked|dry-run — concise result`. An empty
cell means **pending**: the current prompt version has not run on that target. Output files that
predate the current prompt version do not count as executions. Prompts may read this file as a gate,
but only a `completed` result satisfies a prerequisite; `blocked` and `dry-run` do not.

**Stale flags on `Plan` cells.** A `Plan J|M|S` cell may end in ` · ⚠ stale YYYY-MM-DD (+N bullets)`.
It means coverage gained scope after that plan ran, so `/notes-plan {topic} {level}` is **owed** — the
run on record is real but no longer maps the whole checklist. The flag is appended to the execution
record, never a replacement for it, so the record survives underneath it; the next `notes-plan` run
rewrites the whole cell and the flag disappears on its own. A flagged cell does **not** satisfy a
prerequisite.

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

| Topic | Coverage J | Verify J | Plan J | Notes J | Interview J | Sync J | Coverage M | Verify M | Plan M | Notes M | Interview M | Sync M | Coverage S | Verify S | Plan S | Notes S | Interview S | Sync S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Angular | 2026-07-29 — completed — 108 items; verify-gap fast path; 5 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA a22f33f6; fresh verification optional | 2026-08-02 — completed — 17 entries; 127 concepts; 3 create / 14 audit; mirror parity; cold review corrections applied | 0/17 complete — completed | | | | | | | | | | | | | |
| Angular Material | 2026-07-29 — completed — 73 items; verify-gap fast path; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 3 gaps | 2026-08-02 — completed — 16 entries; 76 concepts; 3 create / 13 audit; 15 English-only notes classified (13 keep, 2 unassigned); 0 relocations; 0 renumberings; mirror parity; cold review applied; entry-01 split deferred (prefix collision, REC-019) | 0/16 complete — completed | | | | | | | | | | | | | | |
| Spring | 2026-08-01 — completed — 61 junior items; verify-gap fast path; 1 gap consumed by correction; 7 markers preserved; mirror parity; notes-plan next | 2026-08-01 — completed — 1 gap; SHA c8b255b9 matches coverage | 2026-08-01 — completed — 12 entries; 58 concepts; 12 create / 0 audit; no legacy notes; mirror parity; cold review applied | 0/12 complete — completed | | | | | | | | | | | | | | | |
| Spring Boot | 2026-07-27 — completed — 136 items; verify-gap fast path; 4 gaps judged (3 added, 1 moved to middle); mirror parity; notes plan stale | 2026-07-27 — complete — 136 items pass strict bar; zero gaps; SHA 43a1261f matches coverage; notes-plan unblocked | 2026-08-02 — completed — 16 entries; 128 concepts; 3 create / 13 audit; 3 pairs unassigned (concepts moved to the `spring` topic); 2 same-level bilingual renumbers; 04 split into 03+04; mirror parity; cold review applied | 0/16 complete — completed | | | | | | | | | | | | | | |
| Java | 2026-07-26 — completed — 121 items; consumed array-access gap (fast path); mirror parity; notes plan stale | 2026-07-26 — complete — 121 items pass strict bar; SHA 4c9d4cc9 matches coverage; notes-plan unblocked | 2026-08-02 — completed — 17 entries; 128 concepts; 1 create / 16 audit; SHA b8216257; stale flag consumed; 16 cold classifiers, 0 relocations, 0 renumberings; cold review applied (14/14) | 0/17 complete — completed | | | | | | | | | | | | | | |
| Architecture | 2026-07-29 — completed — 65 junior items; full recalibration; 1 item moved to middle; mirror parity; notes-plan refresh next | 2026-07-29 — completed — complete; zero gaps; SHA 31dde116 matches coverage | 2026-07-29 — completed — 18 entries; 65 concepts; 13 create / 5 audit; 2 English-only legacy renumberings; mirror parity; cold review passed · ⚠ stale 2026-08-01 (+3 bullets) | 0/18 complete — completed | | | | | | | | | | | | | | | |
| Security | 2026-07-29 — completed — 95 junior items; verify-gap fast path; 2 gaps added; 1 factual tightening; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 2 gaps; SHA 1cd18117 matches coverage | 2026-07-29 — completed — 13 entries; 95 concepts; 8 create / 5 audit; 5 bilingual pairs classified keep; 0 relocations; mirror parity; cold review passed · ⚠ stale 2026-08-01 (+1 bullet) | 0/13 complete — completed | | | | | | | | | | | | | | | |
| TypeScript | 2026-07-29 — completed — 81 items; verify-gap fast path; 4 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded by SHA 88c63060; fresh verification optional | 2026-07-29 — completed — 15 entries; 81 concepts; 8 create / 7 audit; 7 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-07-30 (+1 bullets) | 0/15 complete — completed | | | | | | | | | | | | | | |
| JavaScript | 2026-07-29 — completed — 128 items; verify-gap fast path; 5 gaps consumed; mirror parity; notes-plan refresh next | 2026-07-29 — completed — 5 gaps; SHA f35c4540; findings consumed by coverage update | 2026-07-29 — completed — 22 entries; 128 concepts; 7 create / 15 audit; 15 English-only legacy renumberings; mirror parity; cold review applied · ⚠ stale 2026-07-30 (+1 bullets) | 0/22 complete — completed | | | | | | | | | | | | | | |
| CSS | 2026-08-01 — completed — 115 junior items; verify-gap fast path; 8 gaps accepted as 9 bullets after reviewer split; mirror parity; notes-plan refresh next | 2026-08-01 — completed — 8 gaps consumed; verdict superseded by SHA e068b446; fresh verification optional | | | | | | | | | | | | | | | | |
| SQL | 2026-07-29 — completed — 133 items; verify-gap fast path; 4 gaps accepted; mirror parity; notes-plan refresh next | 2026-07-29 — completed — gaps consumed; verdict superseded; verification optional | 2026-07-29 — completed — 17 entries; 133 concepts; 3 create / 14 audit; 14 English notes classified keep; 0 relocations; mirror parity; cold review applied · ⚠ stale 2026-07-31 (+3 bullets) | 0/17 complete — completed | | | | | | | | | | | | | | |
| Git | 2026-08-01 — completed — 92 junior items; full recalibration; 4 additions; 2 bullet splits; mirror parity; notes-plan refresh next | 2026-08-01 — completed — gaps consumed; verdict superseded by SHA f989cc0b | | | | | | | | | | | | | | | | | |
| General | 2026-08-01 — completed — 113 junior items; full recalibration; 8 additions; 3 moved to middle; mirror parity; notes-plan refresh next | 2026-08-01 — completed — complete; zero gaps; SHA b0307fdc matches coverage | 2026-08-02 — completed — 21 entries; 116 concepts; 14 create / 7 audit; 12 English-only notes classified into intuitive thematic folders; 0 cross-level relocations; mirror parity; cold review passed | 0/21 complete — completed | | | | | | | | | | | | | | |

Columns are grouped by level (J, then M, then S), with Coverage → Plan → Notes → Interview → Sync
inside each level. The Notes J/M/S cells are summaries, written as `X/Y complete` plus the last outcome. Their denominator
comes from the corresponding notes plan, never from counting files on disk.

## Notes file executions

One row per planned pair, upserted by `notes-audit`. `Plan status` mirrors the selected plan entry;
`Last outcome` records the execution independently, so a failed retry remains visible without falsely
marking the note complete.

| Topic | Level | Note | English | Spanish | Plan status | Last run | Last outcome |
|---|---|---|---|---|---|---|---|
| Java | junior | 00 | `notes/java/junior/en/00-intro-java.md` | `notes/java/junior/es/00-intro-java.md` | complete | 2026-07-24 | completed — 2/2 assigned concepts covered; four stages passed |

## SQL exercise track

The SQL **exercise** route, per level — distinct from the `SQL` row in the per-topic table above, which
tracks the SQL *notes*. `sql-plan` writes the route (`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`); `sql-plan-audit`
audits it together with the level-neutral doctrine (`practice/sql/PLANNING.md`).

| Level | SQL plan | sql-plan-audit | Exercises |
|---|---|---|---|
| junior | | | |
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

## Per-project prompts

| Project | plan-audit | review-audit | readme-audit | portfolio-audit |
|---|---|---|---|---|
| 01-todo-list | | | | |
| 02-weather-app | | | | |
| 03-expense-tracker | | | | |
| 04-meal-finder | | | | |
| 05-task-manager | | | | |
| 06-hr-portal | | | | |
| 07-timetrack | 2026-07-28 (review mode, completed — six-specialist pass: §1 added, §14 visual design system written from scratch, change-password dialog wired §10→§16) | | | |

## Global pipeline prompts (no per-target scope)

| Prompt | Last run |
|---|---|
| coverage-audit | 2026-08-01 — completed — junior update; 1,344-item floor converged; 497 markers preserved; mirror parity; cold review passed |
| progress-update | |
| roadmap-review | |

## Single-shot prompt executions

One latest-run row per single-shot prompt. Target/mode contains the configuration that identifies the
work; prompts with no target use `global`.

| Prompt | Last run | Target / mode | Outcome | Result |
|---|---|---|---|---|
| code-review-prompt | | | pending | |
| cover-letter-prompt | | | pending | |
| cv-prompt | | | pending | |
| evidence-intake-prompt | | | pending | |
| hr-screen-prompt | | | pending | |
| linkedin-prompt | | | pending | |
| profile-readme-prompt | | | pending | |
| simulation-generator-prompt | | | pending | |
| simulation-review-prompt | | | pending | |
| simulator-prompt | | | pending | |
| sql-exercises-prompt | | | pending | |
| tracker-prompt | | | pending | |
