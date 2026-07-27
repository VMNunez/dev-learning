# Run tracker — which targets each prompt has been run on

**What this is.** A permanent dashboard of every runnable prompt's latest execution, with target-level
progress for pipelines and file-level progress for study notes. It answers at a glance what completed,
what remains pending, and what last stopped as blocked or dry-run. Detailed machinery verdicts stay in
each prompt's `_last-run-report*.md`; this file stores concise operational state.

**Who updates it.** Every runnable prompt through `_pipeline-self-report.md` or
`_single-shot-self-report.md`. After writing its report, it updates the applicable row with the run
date, target/mode, outcome, and concise result, then commits report and tracker together. Victor never
fills it by hand (though he may correct it).

**How to read it:** records use `YYYY-MM-DD — completed|blocked|dry-run — concise result`. An empty
cell means **pending**: the current prompt version has not run on that target. Output files that
predate the current prompt version do not count as executions. Prompts may read this file as a gate,
but only a `completed` result satisfies a prerequisite; `blocked` and `dry-run` do not.

**Tracking baseline reset:** 2026-07-24. Earlier execution records were cleared after the prompt
system changed. Only runs recorded from this baseline onward are valid; the Java Junior coverage run
is the first retained execution.

## Per-topic prompts

| Topic | Coverage J | Verify J | Plan J | Notes J | Interview J | Sync J | Coverage M | Verify M | Plan M | Notes M | Interview M | Sync M | Coverage S | Verify S | Plan S | Notes S | Interview S | Sync S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Angular | | | | | | | | | | | | | | | | | | |
| Angular Material | | | | | | | | | | | | | | | | | | |
| Spring Boot | 2026-07-27 — completed — 136 items; verify-gap fast path; 4 gaps judged (3 added, 1 moved to middle); mirror parity; notes plan stale | 2026-07-27 — complete — 136 items pass strict bar; zero gaps; SHA 43a1261f matches coverage; notes-plan unblocked | 2026-07-27 — completed — 16 entries; 136 concepts; 2 create / 14 audit; 16 pairs classified `keep`; 0 relocations; mirror parity; cold review applied | 0/16 complete — completed | | | | | | | | | | | | | | |
| Java | 2026-07-26 — completed — 121 items; consumed array-access gap (fast path); mirror parity; notes plan stale | 2026-07-26 — complete — 121 items pass strict bar; SHA 4c9d4cc9 matches coverage; notes-plan unblocked | 2026-07-26 — completed — 16 entries; 121 concepts; 0 create / 16 audit; mirror parity; cold review applied | 0/16 complete — completed | | | | | | | | | | | | | | |
| Architecture | | | | | | | | | | | | | | | | | | |
| Security | | | | | | | | | | | | | | | | | | |
| TypeScript | | | | | | | | | | | | | | | | | | |
| JavaScript | | | | | | | | | | | | | | | | | | |
| CSS | | | | | | | | | | | | | | | | | | |
| SQL | | | | | | | | | | | | | | | | | | |
| Git | | | | | | | | | | | | | | | | | | |
| General | | | | | | | | | | | | | | | | | | |

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

## Per-project prompts

| Project | plan-audit | review-audit | readme-audit | portfolio-audit |
|---|---|---|---|---|
| 01-todo-list | | | | |
| 02-weather-app | | | | |
| 03-expense-tracker | | | | |
| 04-meal-finder | | | | |
| 05-task-manager | | | | |
| 06-hr-portal | | | | |
| 07-timetrack | | | | |

## Global pipeline prompts (no per-target scope)

| Prompt | Last run |
|---|---|
| coverage-audit | |
| sql-plan-audit | |
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
