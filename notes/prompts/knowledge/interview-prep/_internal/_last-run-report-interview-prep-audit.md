# Last run report — interview-prep-audit

**Date:** 2026-10-13
**Target:** `LEVEL = junior` · `FILE = general` · `SECTION = all` (ignored) · `MODE = index` · `DRY_RUN = false`
**Outcome:** index committed — `01c9436b`; tracker cell carries the ` · index` suffix, no `completed`
**Status:** clean

1. **Plan vs reality** — `MODE = index` has no split: the orchestrator alone, zero dispatches required and
   zero made. The evidence is command output, not a trace: 5 bank sections in the same order, 23 bold
   questions twin for twin, each section's bold lines read side by side, priority marker identical at
   every position; after the write, 23 IDs / anchors / index entries per file, each anchor directly above
   its own bold line, ID + marker parity exact, passes 6 / 17 / 0, and stripping index, anchors and IDs
   returns `HEAD` byte for byte in both languages (CRLF kept). Steps 2 and 4 had nothing to move or copy,
   step 3 no `[x]` to convert. No step reads the finished pair whole beyond those checks.
2. **Report discipline** — nothing to report; no subagent ran.
3. **Failures & retries** — none in the pipeline. One verification command hung on a stray `cat` reading
   stdin and was stopped; the LF-blob vs CRLF-tree comparison was then normalised and re-run before the
   commit.
4. **Rule friction and rule breaches** — one breach and one deviation, both `REC-341`'s shared-tree case,
   with the parallel `css` and `git` runs closing out in the same tree.
   **Breach (`BRCH-0012`):** the topic commit's `git status` showed the `css` run's staged report and
   tracker beside the pair, and the run committed anyway — status, add and commit ran chained, so the
   check printed and was not read. `01c9436b` carries that run's report and CSS cell under this topic's
   message; the bytes were its own, unaltered, and it committed its close-out over them (`7d4d7074`). No
   history was rewritten with other sessions live. The step's own remedy, `git restore --staged`, would
   have unstaged that run's work; a pathspec commit (`git commit -- <pair>`) was the right move.
   **Deviation (`BRCH-0013`):** the run wrote its General cell into the tracker's working copy, which
   then held the `git` run's uncommitted cell, and built a `HEAD` + General blob; before it staged, the
   `git` run staged the working copy whole and committed it (`4db1a894`, its own `BRCH-0011`), so this
   run's tracker half is in `HEAD` but not in this run's commit, which "How to commit it"'s stat check
   requires.
5. **Verdict** — pipeline clean; both rows are evidence for `REC-341`, whose ruling is Victor's. The prompt
   is 611 lines, over the ~500 alarm; its largest section is `### Per-section deep work` at 118 lines. No
   step was skipped, so the count is noted, not acted on.

Close-out check: declared files — the `en/` + `es/` pair (`01c9436b`), this report and `_run-tracker.md`
(General cell in `HEAD` via `4db1a894`); dispatches 0 of 0 required; the breach log holds no `fixed` /
`confirmed` row to rule on; `_skill-friction.md` holds no `open` row. No fingerprint was written or
deleted: neither file carries a `Coverage SHA-256` line, so the bank is still stale by definition and owes
`MODE = full`. 23 questions unrefined, 0 refined, 0 studied; no study mark in the `es/` index; no `TODO:`.
No authoring recount, which index mode excludes.

Verifiable contract reads: session rules — 1517 lines, read to EOF (three bounded passes); audit prompt —
611 lines, read to EOF; runtime standard — 117 lines, read to EOF; Q&A standard — 586 lines, read to EOF
(two passes); self-report contract — 451 lines, read to EOF. The bank pair (113 lines each) was read whole
and its 23 bold lines compared side by side.
Map: verified — `README.md`'s public-interface row and catalogue row and `_system-map.md` §7's bank row,
on their index-mode claims, against the prompt read to EOF. Maps unaffected.
