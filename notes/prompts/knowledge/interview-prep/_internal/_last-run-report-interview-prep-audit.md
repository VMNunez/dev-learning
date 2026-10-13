# Last run report — interview-prep-audit

**Date:** 2026-10-13
**Target:** `LEVEL = junior` · `FILE = git` · `SECTION = all` (ignored) · `MODE = index` · `DRY_RUN = false`
**Outcome:** index committed — `58d5e59d`; tracker cell carries the ` · index` suffix, no `completed`
**Status:** clean

1. **Plan vs reality** — `MODE = index` has no split: the orchestrator alone, zero dispatches required and
   zero made. The evidence is command output, not a trace: 7 bank sections in the same order, 55 bold
   questions twin for twin, each section's bold lines read side by side, priority marker identical at
   every position; after the write, 55 IDs / anchors / index entries per file, each anchor directly above
   its own bold line, ID + marker parity exact, passes 9 / 32 / 14, every label 2–9 words, and stripping
   index, anchors and IDs returns `HEAD` byte for byte in both languages (CRLF normalised as
   `core.autocrlf` stores the blob). Steps 2 and 4 had nothing to move or copy, step 3 no `[x]` to
   convert. No step reads the finished pair whole beyond those checks.
2. **Report discipline** — nothing to report; no subagent ran.
3. **Failures & retries** — none.
4. **Rule friction and rule breaches** — one deviation, `BRCH-0010` (routed to `REC-341`, seventh
   sighting): the `css` and `general` runs were closing out in the same tree; this run's blob-staged
   tracker cell was replaced in the shared index by the `css` run's staging, and that run's report
   overwrote this file before this run wrote it. The run waited for `7d4d7074`, confirmed the tracker's
   working copy differed from `HEAD` by its Git cell alone, and staged then. **And one breach,
   `BRCH-0011`** (same REC): that check counted diff lines without reading them, and the `general` run's
   cell, written in between, rode into `4db1a894` under this run's message — true content, wrong
   attribution; left in history rather than rewritten in a shared tree.
5. **Verdict** — pipeline clean; the deviation is `REC-341`'s, already open and Victor's to rule. The
   prompt is 611 lines, over the ~500 alarm; its largest section is `### Per-section deep work` at 118
   lines. No step was skipped, so the count is noted, not acted on.

Close-out check: declared files — the `en/` + `es/` pair (`58d5e59d`), this report, `_run-tracker.md` and
the breach-log row; the ledger sighting in `fa021419`; dispatches 0 of 0 required; the breach log holds no
`fixed` / `confirmed` row to rule on; `_skill-friction.md` holds no `open` row. No fingerprint was written
or deleted: neither file carries a `Coverage SHA-256` line, so the bank is still stale by definition and
owes `MODE = full`. 55 questions unrefined, 0 refined, 0 studied; no study mark in the `es/` index; no
`TODO:`. No authoring recount, which index mode excludes.

Verifiable contract reads: session rules — 1516 lines, read to EOF; audit prompt — 611 lines, read to EOF;
runtime standard — 117 lines, read to EOF; Q&A standard — 586 lines, read to EOF; self-report contract —
451 lines, read to EOF. The bank pair was inventoried by command over every line and its 55 bold lines
read side by side; no whole-answer read or audit is claimed.
Map: verified — the index-mode claims of `README.md`'s public-interface row and catalogue row and of
`_system-map.md` §7's bank row, against the prompt read to EOF. Maps unaffected.
