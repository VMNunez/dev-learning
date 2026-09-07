# Progress-update drift report

Date: 2026-09-07 · MODE = all · Branch: prompts/portfolio-audit-ledger
Scope: projects/01-todo-list, projects/02-weather-app, projects/03-expense-tracker, projects/04-meal-finder, projects/05-task-manager, projects/06-hr-portal, projects/07-timetrack · SQL: audited
Verdict: no drift

## 1 — Level matrix, what changed

| Topic | Field | Was | Now | Why |
|---|---|---|---|---|
| — | — | — | — | The matrix was already accurate: every `Current tracked level`, `Knowledge consolidation` and `Next gate` cell matches its sources (plan `Status:` fields, `_run-tracker.md` stale flags, bank ID/route state), and no evidence this run verified was absent from `Practical evidence`. No edit, so no matrix commit. |

## 2 — Drift report

| Section | What PROGRESS.md says | What the sources say | Owner to re-run |
|---|---|---|---|
| — | — | — | — |

**No drift.** Every audited section measured equal to its primary sources:

- **D3 · Exercise route** — `PLANNING-junior.md` §1 sums to 209 first-pass across 15 files; Step B counted 40 exercise headers in `practice/sql/junior/01-basics.sql` (identical on `HEAD` and `main`). File rows, `Corrected` 40/40, `Route progress` 20/209 (10%) and `Steps closed` 0/14 all agree; Step 0 is still ⏳ (20/30).
- **D4 · Timed simulations** — `practice/simulations/TRACKER.md` holds 15 rows, all Junior, all ⏳ Pending: 0/15 completed, 0/5 per track. Matches both tables.
- **D5 · Projects** — projects 01–06 returned Format A / all steps complete against six `Done ✓` rows; 07 returned `Steps 1–6 done, Steps 7–11 not marked (from ✅ markers)` against `Steps 1–6 done, backend backlog fully closed, Step 7a next`. Plan and row agree.
- **D8 · Coverage demonstrated** — all 42 cells recounted from the per-topic files; every numerator, denominator and percentage matches, and the recomputed totals are 609/1510 (40%), 9/191 (5%), 0/68 (0%). Every `*` is justified: no topic has a `Coverage M` or `Coverage S` record in `_run-tracker.md`, and every junior cell has one.
- **D9 · Study progress** — no notes plan carries a dated `Studied:` entry and several junior plans are `Plan status: stale`, so the levelled rows are correctly `—`; the junior CORE banks carry no stable IDs and `notes/interview-prep/routes/` does not exist, so `Interview CORE studied`, `Interview bank studied` and the project row are `—`.
- **D10 · Authoring progress** — 213 numbered entries across the 13 junior plans on disk; 4 `complete` plus 1 `refined` owing no `Pending additions` (all in Java) gives 5/213 (2%), with the `*` justified by six stale plans. Interview rows `—` for want of stable IDs. Project bank: `01-todo-list` is the only project whose portfolio gate closed `✅ Ready` (02's 2026-09-07 run was a blocked dry-run), and its bank holds 118 stable IDs with 1 `[refined]` in both languages — 1/118 (1%).

An empty drift report is the good outcome: **gate G6 and SQL G3 may be ticked on this run**, for the seven projects named in the scope line plus the SQL track.
