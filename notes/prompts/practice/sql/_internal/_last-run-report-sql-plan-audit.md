# Last run — `sql-plan-audit`

**Date:** 2026-10-07 (second run of the day) · **Target:** `practice/sql/PLANNING.md` + `practice/sql/junior/PLANNING-junior.md` · **Scope:** `full` · **Level:** `junior`
**Status:** open · cold reviewer: not dispatched — the finding is the Phase 2 fence gap already open as `REC-287`, extended and routed there instead of refined at the end of the run

1. **Plan vs reality** — the four concerns ran in order 2 → 1 → 3 → 4. No step reads the finished artefact whole, so the traces show only that the machinery ran. Two independent probes back them. The orchestrator's history gate matched the Phase 1 copy. The validator then flagged seven path mismatches against `sql-exercises-prompt.md`. Those are the expected price of applying `REC-288`'s route half before its machinery half, not a defect in the split.
2. **Report discipline** — all four reports arrived with read-to-EOF lines and one row per owned check. Nothing was trimmed.
3. **Failures & retries** — none. No specialist died or returned `BLOCKED`, and the acceptance-check and Ripples budgets went unspent.
4. **Rule friction and rule breaches** — **deviation:** `REC-288` was an accepted ruling addressed to this prompt. Its reorder needed edits in route §1, §2 and §3, and no single concern may edit all three. Phase 2 does not say how a ledger ruling enters a run, so the orchestrator split it in the dispatch text: #2 took §1/§2 and #3 took §3 (`BRCH-0002`). This is the second row under the same Phase 2 heading, so under the two-row rule both rows were routed to `REC-287`, which already holds the fence gap. #4 again returned four route-body Section E findings that nothing may apply (replacements below). No scratch file reached the repo. No `.sql` file or `PROGRESS.md` was touched, and the digest was not recomputed.
5. **Verdict** — change worth considering: **give a finding or a ledger ruling whose repair crosses `Edits` fences an applier in Phase 2**. This is routed to `REC-287` (open), not refined here, because it redesigns a fence. The prompt is 360 lines, under budget. There are no `fixed`/`confirmed` breach-log rows to rule on.
   `maps unaffected` · `map: verified — README.md public interface row and catalogue row`; `_system-map.md` was not opened this run, so `map: not verified — partial read` for it.

**#4's four route-body replacements, kept for `REC-287`** (line numbers are those after `fb5a922f`):
- §1 lines ~102–138, the "Two header formats exist…" block through the 2026-07-22 note: replace with "**Exercise header format is `sql-exercises-prompt.md`'s; grading markers are `_sql-exercises-review.md`'s** — Step 1 for format detection and the re-grade/skip policy, Step 2b for the markers. `01-basics.sql` is the one legacy-format file; appending to it leaves it mixed, which the prompt handles — do not "fix" either format by hand."
- Step 1's `**Exercises:**` line: delete the parenthetical "(`-- Your answer:` + `-- ✅ Corregido` markers)".
- §2 lines ~244–245: replace the "(a review batch deliberately skips Intro — see doctrine Moment 2b)" bullet with "Every batch spans intro → challenge; the difficulty split is `sql-exercises-prompt.md`'s and is not overridden on a first-pass run."
- Step 13 lines ~939–941: replace with "Nothing extra to add to the config: the `report-queries` setup, difficulty and timing are `sql-exercises-prompt.md`'s."
