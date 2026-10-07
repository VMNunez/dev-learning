# Last run — `sql-plan-audit`

**Date:** 2026-10-07 · **Target:** `practice/sql/PLANNING.md` + `practice/sql/junior/PLANNING-junior.md` · **Scope:** `full` · **Level:** `junior`
**Status:** open · cold reviewer: not dispatched — the finding was routed to `REC-287` instead of refined at the end of the run

1. **Plan vs reality** — the four-concern split ran, but it has a hole, and the evidence is #4's own trace,
   not the green rows. #4, the one specialist that owns Section E, found six route-body passages
   that describe what another file owns, and gave verbatim replacements. Its `Edits` cell allows only the
   route header, and no other specialist's licence covers them, so all six were committed unchanged.
   No whole-artefact reader exists here, so beyond that the traces support only "the machinery ran". The
   one independent probe, the orchestrator's check against disk, confirmed #4's literal-shape finding: 12
   split-run labels lacked the `**Moment 2 config:**` string the standard says the prompt greps for. The
   orchestrator fixed them as a verified factual error. It refuted nothing.
2. **Report discipline** — all four traces arrived in the required shape, with read-to-EOF lines; nothing
   was trimmed.
3. **Failures & retries** — #4 died on an API session limit before returning. A second session took over.
   It recovered #1–#3's hand-backs from the transcripts, re-dispatched #4 cold (that spent the Ripples
   budget for `loop-and-fence`), and #4 completed. It then hit its own usage limit before Phase 3. This
   session resumed at Phase 3. No report was `BLOCKED`, and no acceptance-check re-dispatch was spent.
4. **Rule friction and rule breaches** — the recovering session wrote four `.sql-audit-*.tmp` files
   (dispatch copies, a prior report, #4's report) into the **repository root**, not into scratch. That is
   an undeclared write. They were moved out before the commit and no output was affected (`BRCH-0001`).
   Friction: the prompt does not say who applies a route-body finding from #4. The Ripples rule only
   re-dispatches a concern whose work a fix *invalidated*, and that does not fit a finding no concern was
   licensed to fix. This is the candidate below. No other rule was breached. The step-0 guards and the
   branch guard ran, every specialist ran at the `deep` tier and in order 2 → 1 → 3 → 4, and the history
   gate matched the Phase 1 copy. No `.sql` file was touched, `PROGRESS.md` was not edited, and the digest
   was not recomputed.
5. **Verdict** — change worth considering: **give #4's route-body Section E findings an applier**, by
   widening its `Edits` cell to route prose or by re-dispatching #1 and #3 with its replacements. Routed
   to `REC-287` (open). This run did not refine the prompt, because the fix redesigns a fence and carries
   six content replacements, which is more than an at-end edit should hold. The prompt is 360 lines,
   under budget. There are no breach-log rows at `fixed`/`confirmed` to rule on.
   `maps unaffected` · `map: verified — README.md public interface row and catalogue row; _system-map.md §7 doctrine and route rows, the SQL chain line, the §11 "route ran out of steps" row`.

**#4's six replacements, kept here for `REC-287`** (route line numbers are those before `bfdf8177`):
- R2, §1 lines 104–138: replace the "Two header formats" block with: "**Exercise-file format:**
  `notes/prompts/practice/sql/sql-exercises-prompt.md` owns it. Grading records its verdict on each
  exercise header; `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` Steps 1 and 2b own
  format recognition, markers and re-grade/skip behaviour."
- R3, §2 lines 225–233: replace the "Difficulty rises" block and its two bullets with: "**Exercise
  content and difficulty:** `notes/prompts/practice/sql/sql-exercises-prompt.md` owns them; each step's
  `**Reinforces:**` line names the earlier concept to reuse."
- R4, Step 1 lines 329–333: keep the first sentence, then: "The original ten hand-written statements were
  deleted on 2026-07-22; the new file is generated under `sql-exercises-prompt.md`."
- R5, Step 6 line 568: replace "— the string functions ride along as the Intro half of the batch" with
  "plus the common string functions claimed below".
- R6, Step 13 lines 906–908: replace the paragraph with: "The `report-queries` output is owned by
  `notes/prompts/practice/sql/sql-exercises-prompt.md`; use the config above."
- R7, §1 line 176: delete the "Note files are not listed here" sentence. Step 9 lines 699–703: keep the
  passage up to "…rather than 1NF/2NF/3NF by name." and delete the screening question and interview-prep
  explanation that follow.
