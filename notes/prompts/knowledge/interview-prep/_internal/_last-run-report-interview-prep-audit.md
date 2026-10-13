# Last run report — interview-prep-audit

**Date:** 2026-10-13
**Target:** `LEVEL = junior` · `FILE = architecture` · `SECTION = all` (ignored) · `MODE = index` · `DRY_RUN = false`
**Outcome:** nothing to write — the bank already carried its IDs, anchors and index (`0f8b2f50`, another session's run the same day); rebuild byte-identical, no content commit; tracker cell carries the ` · index` suffix, no `completed`
**Status:** rejected

1. **Plan vs reality** — `MODE = index` has no split: the orchestrator alone, zero dispatches required and
   zero made. The evidence is command output, not a trace: 9 bank sections in the same order, 39
   ID-bearing bold lines twin for twin (per-section counts 7/6/4/3/6/6/2/2/3), ID, priority marker and
   state identical across the two languages, 39 anchors each directly above its own ID, 39 index entries
   per file (passes 11 / 24 / 4); rebuilding both indexes and every anchor from the bold lines, labels
   kept, returns each file byte for byte. Steps 2, 3 and 4 had nothing to move, migrate or copy. No step
   reads the finished pair whole beyond those checks.
2. **Report discipline** — nothing to report; no subagent ran.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — no rule of this prompt breached. Two deviations, both logged.
   `BRCH-0002` (`Scope: shared`): the `security` run's uncommitted tracker cell and report were still in
   both working copies, so this close-out staged index blobs — `HEAD`'s tracker plus its own cell, and
   this report — exactly as the SQL run did (`BRCH-0001`); the working-tree copy of this file never held
   this report. Two rows now name `_pipeline-self-report.md` → `How to commit it`, so both went to the
   ledger as `REC-341` (`f2d285cf`, validator run first). `BRCH-0003` (`Scope: own`, `open`): "Index
   mode" names a tracker suffix for a topic that committed, a dry run and a blocked topic, and none for a
   run that verifies an already-indexed bank and writes nothing; this run wrote the plain suffix because
   the index it verified is committed.
5. **Verdict** — change worth considering: "Index mode" naming the verified, nothing-to-write outcome —
   **rejected on condition 3**: with the case named the tracker cell and the tree would be what they are
   now, so it is friction, recorded as `BRCH-0003` for a second sighting to count. The prompt is 611
   lines, over the ~500 alarm; its largest section is `### Per-section deep work` at 118 lines. No step
   was skipped this run, so the count is noted, not acted on.

Close-out check: declared files — the `en/` + `es/` pair (verified, not written: `git status` clean on it
before and after), this report, `_run-tracker.md`, `_breach-log-interview-prep-audit.md` and the ledger
row; dispatches 0 of 0 required; the breach log holds no `fixed` / `confirmed` row to rule on;
`_skill-friction.md` holds no `open` row. No fingerprint was written or deleted: neither file carries a
`Coverage SHA-256` line, so the bank is still stale by definition and owes `MODE = full`. 39 questions
unrefined, 0 refined, 0 studied; no study mark in the `es/` index; no `TODO:`.

Verifiable contract reads: session rules — 1516 lines, read to EOF (three bounded passes); audit prompt —
611 lines, read to EOF; runtime standard — 117 lines, read to EOF; Q&A standard — 586 lines, read to EOF;
self-report contract — 451 lines, read to EOF. The bank pair (495 lines each) was inventoried by command
over every line; no whole-answer audit is claimed.
Map: verified — `README.md`'s public-interface row, catalogue row, hub writer cell and run-order step 6,
and `_system-map.md` §7's bank row and §11's study-mark row, against the prompt read to EOF. Maps unaffected.
