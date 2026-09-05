# portfolio-audit — last run report

**Date:** 2026-09-05
**Target:** `PROJECT_PATH = projects/01-todo-list`, `PORTFOLIO_SCOPE = full`, `DRY_RUN = false`
**Status:** open

## 1. Close-out check against disk
Declared files, from `README.md`'s row: `notes/interview-prep/projects/en/01-todo-list.md` (118 questions,
committed `24d6b50c`), `notes/interview-prep/projects/es/01-todo-list.md` (**created this run**, 118,
same commit), `notes/cv/cv-bullets.md` (one bullet rewritten, same commit),
`dev/portfolio/VMNunez/README.md` (✅-only step — **read, compared, not edited**: the project is already
featured as row `01` of its table with the correct `projects/01-todo-list` path and its live link, so
there was nothing to add or refresh; the external-path preflight passed, and that repo carries
pre-existing uncommitted changes to `README.md` and `CLAUDE.md` that are not this run's), this report,
and `_run-tracker.md`. `git log --name-only` over `24d6b50c` confirms the three committed paths;
`git status` was run before staging and before committing.

**Tracker outcome:** `01-todo-list` · `portfolio-audit` → `2026-09-05 (completed — ✅ Ready; …)`. The
cell's `⚠ stale` note is **gone because its debt was discharged**, not because it was tidied: the twin,
the IDs and the priority markers were the three things it named.

## 2. Declared dispatches
Required: one author + one reviewer per present section, then one translator and one `en/`-blind Spanish
reviewer per project. Sections present: 3 (`Security & Auth` skipped — no auth; `Testing` skipped — the
five `.spec.ts` are CLI scaffold asserting nothing, and the backlog declares testing out of scope for
01–06). Required 8, dispatched **9** — the extra is the one re-dispatch in §3. Every acceptance gate
passed: three reviewer ratios at 1.0, and the parity gate at 118/118 per section, re-verified by the
orchestrator against both files rather than taken from the translator's return.

## 3. Failures & retries
The `Technical Decisions` **reviewer died mid-flight** on an Opus session limit (resets 21:30). The
dispatch contract's ladder ran as written: its scratch path was **empty**, so there was nothing to read;
resuming would have met the same limit; it was re-dispatched **once**. Disk was verified before the
retry — 90 IDs, 90 markers, the 29 legacy questions of that section untouched — so the dead role had
written nothing and no restore was owed. The retry ran at the **strongest available** agent rather than
the historical `deep` model, which `_agent-runtime-standard.md` § "Reasoning tiers" provides for; the
translator and the Spanish reviewer ran the same way for the same reason. That substitution is a fact of
this run and is recorded here rather than left implicit.

## 4. Machinery findings
- **The G6 prerequisite is still uncheckable, and this is the second run to say so** — the 2026-08-29
  report named it and kept it local at one occurrence. Routed this time, per the shared-scope rule, to
  **`REC-214`** (`6e9e6780`). Measured: the only G6 artefact on disk is a global drift report dated
  **2026-08-25**, scoped to `projects/07-timetrack`, which this gate has no instruction to read.
- **The bank's own backfill worked exactly as the standard predicted.** The author appends and marks what
  it writes; the per-section reviewer allocates the missing IDs and markers **in its lane** — that is what
  moved 79 unmarked, ID-less questions to a fully identified bank in one run, and it needed no new
  machinery. Recorded because the standard called it "declared debt rather than hand work" and this is the
  first run that proves the claim.
- **One cross-section duplicate reached the orchestrator's scan**, which is the scan working: `114`
  (Technical Decisions) and `055` (Business Rules) asked the same code path — the title `<span>` with a
  click handler — with substantially the same answer. `055` was kept, `114` removed, its number never
  reused. Neither section's reviewer could have caught it; only the whole-file pass can.
- **Outside this run's lane, reported not fixed:** in `dev/portfolio/VMNunez/README.md`, rows `02`–`06`
  of the projects table still link to `angular/…` paths the learning repo renamed to `projects/…`. Row
  `01` is correct. The prompt fences this run to the ✅-Ready entry only, so the links were left alone.

## 5. Verdict
Change worth considering: **`REC-214`**, already open — the G6 prerequisite this gate declares and cannot
check. No edit to this prompt's own text is drafted: nothing in it was ambiguous or inexecutable this run,
and the one finding that recurred is `shared` scope and belongs to the ledger. Prompt length **780 lines**,
well over the ~500-line budget; the largest section is `## Single-project procedure` (l.183–605, 422
lines), and within it Phase 1a alone runs 183 lines. No breach log exists for this prompt and none was
opened: no mandatory step was skipped or shortcut.
