# Last run report — interview-prep-audit

**Date:** 2026-10-13
**Target:** `LEVEL = junior` · `FILE = typescript` · `SECTION = all` (ignored) · `MODE = index` · `DRY_RUN = false`
**Outcome:** index committed — `2b1064c6`; tracker cell carries the ` · index` suffix, no `completed`
**Status:** open

1. **Plan vs reality** — `MODE = index` has no split: the orchestrator alone, zero dispatches required and
   zero made. The evidence is command output, not a trace: 8 bank sections in the same order, 35 bold
   questions twin for twin (per-section counts 11/6/6/3/2/4/1/2, each pair read side by side), ID,
   priority marker and state identical at every position, 35 anchors each above its own ID, 35 index
   entries per file (passes 3 / 23 / 9); rebuilding each file from `HEAD` returns the committed file byte
   for byte, and removing index, anchors and IDs from it returns `HEAD`. Steps 2 and 4 had nothing to
   move or copy and step 3 no `[x]` to convert. No step reads the finished pair whole beyond those checks.
2. **Report discipline** — nothing to report; no subagent ran.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — two deviations and one breach, all logged.
   `BRCH-0007` (`Scope: own`, routed to `REC-341`): at step 0 the pair already held another session's
   finished index output for this topic, uncommitted. "Run baseline" covers a dirty pair for restore
   availability only, and step 5 does not say whether labels in an index no commit holds are existing; the
   run verified the pair against `HEAD`, answered for the labels itself and committed the pair as its
   topic commit. `BRCH-0006` (`Scope: shared`, routed to `REC-341`): the first `security` run's
   uncommitted report was still in the working copy of this file, so this report was staged as an index
   blob and never written into the working tree. `BRCH-0008` (`Scope: shared`, `open`): `HEAD`'s report
   read `Status: open`, and the run-start line naming it reached Victor in the closing message instead of
   at step 0 — no cost, the item being `REC-342` already.
5. **Verdict** — change worth considering: "Index mode" step 5 saying what a run does with an index, and
   its labels, that another run left uncommitted in the tree. Not this close-out's to dismiss — the step
   already held two rows — and not edited here, since its answer is `REC-341`'s open ruling on parallel
   launches: routed there (`82a87d8b`, validator run first, 0 failures). No draft was written and no cold
   reviewer dispatched. The prompt is 611 lines, over the ~500 alarm; its largest section is
   `### Per-section deep work` at 118 lines. No step was skipped this run, so the count is noted, not
   acted on.

Close-out check: declared files — the `en/` + `es/` pair (`2b1064c6`), this report, `_run-tracker.md`,
`_breach-log-interview-prep-audit.md` and the `REC-341` row; dispatches 0 of 0 required; the breach log
holds no `fixed` / `confirmed` row to rule on; `_skill-friction.md` holds no `open` row. No fingerprint
was written or deleted: neither file carries a `Coverage SHA-256` line, so the bank is still stale by
definition and owes `MODE = full`. 35 questions unrefined, 0 refined, 0 studied; no study mark in the
`es/` index; no `TODO:`. No authoring recount, which index mode excludes.

Verifiable contract reads: session rules — 1517 lines, read to EOF (three bounded passes); audit prompt —
611 lines, read to EOF; runtime standard — 117 lines, read to EOF; Q&A standard — 586 lines, read to EOF;
self-report contract — 451 lines, read to EOF. The bank pair was inventoried by command over every line
and its 35 bold lines read side by side; no whole-answer read or audit is claimed.
Map: verified — the index-mode claims of `README.md`'s public-interface row and catalogue row and of
`_system-map.md` §7's bank row and §11's study-mark row, against the prompt read to EOF. Maps unaffected.
