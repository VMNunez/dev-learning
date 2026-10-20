# Last run report — interview-prep-audit

**Date:** 2026-10-20
**Target:** `LEVEL = junior` · `FILE = spring-boot` · `SECTION = all` · `MODE = full` · `DRY_RUN = false`
**Outcome:** completed — topic commit `6d9d4c20`; recount `c0b842b6`
**Status:** open

1. **Plan vs reality** — the split held: M and G once, then author → reviewer over all eight sections in
   order, each diff confined to its own section (checked by hunk ranges after every author). No step reads
   the finished bank whole for content; the orchestrator's finish pass is structural (parity, order,
   priority share, anchors, index, body unchanged modulo anchors — all by command), so the content claim
   rests on the 16 traces. Reviewers did real work after their authors: false project anchors (e.g.
   SB-J-033, 070, 079) and imprecise framework claims (e.g. SB-J-073, 084, 094) survived an author's trace.
2. **Report discipline** — every return usable; none trimmed. Authors' "outside my section" defect lists
   were routed into the next sections' slices as known defects, which is where most anchor fixes came from.
3. **Failures & retries** — one role died: reviewer B6 (`## Transactions`) hit the session limit
   mid-run. Its scratch file held a plan and no verdict token, so it counted as a partial return; three
   mirrored single-sentence edits were found in the tree and isolated by diff against A6's draft. Re-
   dispatched once (B6b) with those edits named; it verified and kept all three and returned a full
   trace. No acceptance-gate retry was needed in any section.
4. **Rule friction and rule breaches** — two deviations, logged.
   `BRCH-0014` (own): the acceptance gate's "Slice coverage" check demands every often/sometimes item be
   covered by a question and is silent on items outside the selected coverage or owned by another topic;
   the standard's "When a section is complete" scopes them out. The run closed such items as routed or
   reported coverage gaps — without that, eight core-container items would have been forced into this
   bank ahead of the `spring` bank. `BRCH-0015` (shared): the author prompt's "may be rewritten freely"
   versus its 6.2 "report only"; authors took the first reading.
   Also, mid-run (after section 4) Victor ruled that unrefined questions may be removed when they do not
   serve his target role; from then on every dispatch carried that rule plus a guard against removing any
   ID listed in `spaced/schedule.md`. Three questions were removed under it (058, 066, 068), none marked.
5. **Verdict** — change worth considering: let the acceptance gate close an item outside the selected
   coverage or owned by another topic by a reported coverage gap or a route to its owner, as the standard
   already does. The prompt is 611 lines, over the ~500 alarm; largest section `### Per-section deep work`.

Close-out check: declared files — the `en/` + `es/` pair (`6d9d4c20`, fingerprint written, index and 99
anchors rebuilt), `PROGRESS.md` via `authoring-progress-recount` (`c0b842b6`), this report,
`_run-tracker.md` and the breach log (this commit). Dispatches: 18 required (M, G, 8 A, 8 B), 19 made
(B6 re-dispatched). Breach log: no `fixed` / `confirmed` row to rule on; `_skill-friction.md`: no `open`
row. No section blocked; no uncovered slice item.

Verifiable contract reads: session rules — 1550 lines, read to EOF (three passes); audit prompt — 611
lines, read to EOF; runtime standard — 117; Q&A standard — 586; self-report contract — 461; write prompt —
279; review prompt — 204; all read to EOF. Map: verified — `README.md`'s public-interface and catalogue
rows and `_system-map.md` §7's bank row, against the prompt read to EOF.
