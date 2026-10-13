# Last run report — interview-prep-audit

**Date:** 2026-10-13
**Target:** `LEVEL = junior` · `FILE = css` · `SECTION = all` (ignored) · `MODE = index` · `DRY_RUN = false`
**Outcome:** index committed — `a278f642`; tracker cell carries the ` · index` suffix, no `completed`
**Status:** clean

1. **Plan vs reality** — `MODE = index` has no split: the orchestrator alone, zero dispatches required and
   zero made. The evidence is command output, not a trace: 19 bank sections in the same order, 75 bold
   questions twin for twin, each section's bold lines read side by side, priority marker identical at
   every position; after the write, 75 IDs / anchors / index entries per file, each anchor directly above
   its own bold line, ID + marker parity exact, passes 12 / 45 / 18, every label 2–9 words, the index's
   fixed strings found in the standard, and stripping index, anchors and IDs returns `HEAD` byte for byte
   in both languages (CRLF kept). Steps 2 and 4 had nothing to move or copy, step 3 no `[x]` to convert.
   No step reads the finished pair whole beyond those checks.
2. **Report discipline** — nothing to report; no subagent ran.
3. **Failures & retries** — none. Two of the run's own verification commands were mis-written on the
   first try (an LF/CRLF comparison against the blob, a broken `sed` parity diff) and were re-run
   correctly before the commit; nothing was written on their output.
4. **Rule friction and rule breaches** — one deviation, `REC-341`'s case again (`BRCH-0009`). Another
   session ran this prompt on `git` and `general` in the same tree (its `git` commit `58d5e59d` landed
   between this run's step 0 and its topic commit). The tracker was clean when this run wrote its CSS
   cell, but that session then wrote and staged its `Git` cell, so `git add` of the tracker swept both;
   caught at the cached diff before the commit, the tracker was re-staged as `HEAD`'s blob plus the CSS
   cell alone and the working copy, holding both cells, was left as it stood. Before this run could
   commit, that session's `general` topic commit `01c9436b` took the whole index — this run's tracker
   blob and its first report draft with it — so the CSS cell is in `HEAD` under that commit's message and
   this commit carries the corrected report and the breach row only. The topic commit staged the css pair
   alone and was unaffected.
5. **Verdict** — pipeline clean. The prompt is 611 lines, over the ~500 alarm; its largest section is
   `### Per-section deep work` at 118 lines. No step was skipped, so the count is noted, not acted on.

Close-out check: declared files — the `en/` + `es/` pair (`a278f642`), `_run-tracker.md`'s CSS cell
(landed in `01c9436b`, see bullet 4) and this report;
dispatches 0 of 0 required; the breach log holds no `fixed` / `confirmed` row to rule on, its
`BRCH-0008` (`shared`, one sighting) stays open, and `BRCH-0009` is routed to the `REC-341` row, which
cites it; `_skill-friction.md` holds no `open` row. No
fingerprint was written or deleted: neither file carries a `Coverage SHA-256` line, so the bank is still
stale by definition and owes `MODE = full`. 75 questions unrefined, 0 refined, 0 studied; no study mark in
the `es/` index; no `TODO:`. No authoring recount, which index mode excludes.

Verifiable contract reads: session rules — 1517 lines, read to EOF (two bounded passes); audit prompt —
611 lines, read to EOF; runtime standard — 117 lines, read to EOF; Q&A standard — 586 lines, read to EOF;
self-report contract — 451 lines, read to EOF. The bank pair was inventoried by command over every line
and its 75 bold lines read side by side; no whole-answer read or audit is claimed.
Map: verified — the index-mode claims of `README.md`'s public-interface row and catalogue row and of
`_system-map.md` §7's bank row, against the prompt read to EOF. Maps unaffected.
