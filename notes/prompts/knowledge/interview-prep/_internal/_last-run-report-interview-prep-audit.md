# Last run report — interview-prep-audit

**Date:** 2026-10-13
**Target:** `LEVEL = junior` · `FILE = java` · `SECTION = all` (ignored) · `MODE = index` · `DRY_RUN = false`
**Outcome:** index written and committed — `89e76471`; tracker cell carries the ` · index` suffix, no `completed`
**Status:** rejected

1. **Plan vs reality** — `MODE = index` has no split: the orchestrator alone, zero dispatches required and
   zero made. The evidence is command output, not a trace: stripping the index, the anchors and the IDs
   returns both files to their `f2212cbe` lines exactly; 79 ID-bearing bold lines, 79 anchors each
   directly above its own ID and 79 index entries per file, each under the pass of its marker; ID + marker
   sequence identical across the two languages. No step reads the finished pair whole beyond those checks.
2. **Report discipline** — nothing to report; no subagent ran.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — no rule breached. Step 1 passed on the first read (17 sections,
   79 questions, same order and same markers on both sides), so steps 2 and 4 had nothing to move or
   copy. Friction, not a deviation: a second run of this same orchestrator (`FILE = spring-boot`) was
   live in the same working tree, and both runs write this one report file and `_run-tracker.md`. The
   prompt orders topics inside a run and says nothing about two runs; this one committed its pair by
   explicit path and held its close-out until the other's had committed (`f40d7374`). No step was worked
   around, so no row.
5. **Verdict** — pipeline clean. Candidate considered and rejected — *state what a run does when another
   run of this orchestrator is live in the tree* — on **condition 3**: both pairs, both tracker cells and
   both reports landed correctly, so it cost a wait and changed no output. The prompt is 611 lines, over
   the ~500 alarm; its largest section is `### Per-section deep work` at 118 lines. No step was skipped
   this run, so the count is noted, not acted on.

Close-out check: declared files — the `en/` + `es/` pair (`89e76471`), this report and `_run-tracker.md`
— all written by this run; dispatches 0 of 0 required; no breach log exists for this prompt, so no
`fixed` / `confirmed` row to rule on; `_skill-friction.md` holds no `open` row. No fingerprint was written
or deleted: neither file carries a `Coverage SHA-256` line, so the bank is still stale by definition and
owes `MODE = full`.
