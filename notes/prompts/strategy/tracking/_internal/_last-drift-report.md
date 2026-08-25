# Progress-update drift report

Date: 2026-08-25 · MODE = active · Branch: fix/backend-backlog
Scope: projects/07-timetrack · SQL: audited
Verdict: no drift

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| Java | Knowledge consolidation | `Notes plan stale (0/17 complete); junior Q&A pending full audit` | `Notes plan current, fingerprint matches (1/17 authored, 0 studied); junior Q&A pending full audit` | `notes/java/coverage/notes-plan-junior.md` reads `Plan status: current`, its `Coverage SHA-256` recomputes to the stored `b8216257…` over the scope bytes, and its `Plan J` tracker cell carries no stale flag. Entry `00` is `Status: refined` with `Pending additions: none`, so it counts as authored; its `Studied: pending` keeps studied at 0. |
| Java | Next gate | `Refresh the junior notes plan` | `Author the remaining 16 junior notes` | The plan no longer needs refreshing, so the first unmet consolidation condition is the 16 entries still `Status: pending`. |

Java stays `Junior — building`: D7 forbids promoting on file completion, and 1/17 authored with no
unaided explanation check leaves every promotion condition open. `Practical evidence` was preserved
untouched.

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| — | — | — | — |

**No drift.** D3, D4, D5, D8, D9 and D10 each matched their primary sources exactly. This closes
gate G6 for `projects/07-timetrack` (its `PLANNING.md` §23) and SQL G3 (`practice/sql/PLANNING.md` §9,
box in §11).

Measured this run:

- **D3 · Exercise route** — junior roll-up `40/40 (100%)`, `20/207 (10%)`, `0/14` all agree with
  `practice/sql/junior/PLANNING-junior.md` §1 and §3; the 15 detail rows carry §1's targets and their
  first-pass column sums to 207. Step B found `practice/sql/02-joins.sql` (10 exercises) on `main`
  only; §1 tombstones it explicitly as the file renumbered to `03-joins.sql` and deleted 2026-07-22,
  so it is not a missing row.
- **D4 · Timed simulations** — `TRACKER.md` holds 15 junior rows, all `⏳ Pending`; `0/15 (0%)` per
  level and per track, middle and senior `—`, matching the file.
- **D5 · Projects** — the 07 subagent returned 1944 lines read to EOF, Format B, `Steps 1–6 done,
  Step 7a next (from ✅ markers)`, which agrees with the row's `Steps 1–6 done, backend backlog fully
  closed, Step 7a next`.
- **D8 · Coverage demonstrated** — all 39 cells recounted from the topic files; every one matched, and
  the three `Total` rows re-sum to `516/1374 (38%)`, `8/176 (5%)`, `0/62 (0%)`. The `*` marks are
  correct: all 13 `Coverage J` tracker cells are filled, all `Coverage M`/`Coverage S` cells are empty.
- **D9 · Study progress** — three `—` rows correct: nine junior notes plans are stale or
  tracker-flagged, `notes/interview-prep/routes/` does not exist, and the bank carries no `[refined]`
  markers or stable IDs.
- **D10 · Authoring progress** — `1/208*` recounted from the 13 junior plans on disk (208 numbered
  entries; one `refined` entry owing no `Pending additions`). The `*` is justified by the stale plans.
  Interview CORE and bank rows are correctly `—` for want of stable IDs.
