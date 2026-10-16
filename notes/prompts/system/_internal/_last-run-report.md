# Pipeline self-report — system-check

Date: 2026-10-16
Target: `FLOW = knowledge`, starting commit `95356543`
Outcome: completed
Status: open

1. **Plan vs reality** — The cut held: 27 concerns (20 files, 6 skills, 1 launchers), each accepted on its first return, then one cold `deep` reviewer over the whole patch. That reviewer is the evidence that outranks the traces: after every concern was accepted it struck one out-of-licence row, dropped one row that was not a contradiction, tightened ten edits and found one unnamed duplicate cell (README L582) plus four unnamed occurrences. So the per-file split works only with the whole-patch review behind it.
2. **Report discipline** — No return had to be trimmed or discarded. Three returns used `fenced` for a non-owed absence outside the four fence sites, and one misstated its own counts. None of these carried proposed wording, so the report records them without striking.
3. **Failures & retries** — No dispatch failed and no re-dispatch was needed: 28 of 28 required dispatches ran (26 `standard` analysts, 1 `mechanical` launcher analyst, 1 `deep` reviewer). The dispatch payload restated the gate's five items and put the EOF line first. The two earlier knowledge runs had blocked on exactly those two items.
4. **Rule friction and rule breaches** — Step 3 was breached. The orchestrator accepted the `notes-plan-prompt.md` return without striking its `missing` row on README "Typical run order" (the `chains` cluster's), and the row reached the draft patch. The reviewer struck it before any map edit, so the cost was one row of rework and no wrong map text. That makes `BRCH-0003` the third row naming `Step 3 — the acceptance gate`, and the first since `REC-347`'s fix. At two or more rows a dismissal is barred, and Step 7 bars the at-end refinement inside an audit, so it is routed to `REC-354`. Step 6 was also breached: the final validator ran before the flow report was written, so `2a3b8250` carried a dead backticked path in the report. The close-out's own validator run caught it and `31ec593e` reworded it. No map text was involved. It is a first row for that step (`BRCH-0004`, left open). The breach log has no `fixed` or `confirmed` rows to advance: `BRCH-0001` and `BRCH-0002` stay `routed to REC-347`.
5. **Verdict** — Change worth considering: make Step 3 resolve each `missing` row's cited map line to its enclosing section before accepting it (`REC-354`). It is not applied here, because Step 7 forbids it.

Declared-output check: both maps, the flow report and five ledger rows (`REC-349`…`REC-353`) are in `2a3b8250`. The report fix is `31ec593e`. This report, the `system-check · knowledge` tracker row, `BRCH-0003`, `BRCH-0004` and `REC-354` (validator run first, passing) go in the separate close-out commit. The checkpoint is under `.system-check/flows/knowledge/20261016-103815-95356543/`. `_skill-friction.md` has no open row. `system-check-prompt.md` is 392 lines, under the ~500-line alarm.

map: verified and corrected by the audit itself — 44 cells in `2a3b8250`. This close-out leaves the maps unaffected.
