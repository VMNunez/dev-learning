# Pipeline self-report — system-check

Date: 2026-10-19
Target: `FLOW = cross` (resolved from `FLOW = next`), starting commit `0eabcc70`
Outcome: completed
Status: open

1. **Plan vs reality** — The five clusters were the right cut, but the final reviewer's whole-patch read was again the evidence that mattered. It dropped one fork (F2, a widened README fence that `_session-rules.md` l.1402-1405 owns). It tightened ten edits, three of them self-contradictions that were only visible across cells (K3 in §1/§9/§13, progress P3 against P28). It settled K1. It found nine occurrences of corrected claims no cluster had named. Per-cluster returns still miss twins in the other map.
2. **Report discipline** — No return needed trimming. `catalogue` closed in 14 seconds after its resume; the check showed regions A–H had all been written before the cut, so the return was whole.
3. **Failures & retries** — 7 dispatches against 6 required (5 clusters + 1 reviewer). The extra one was the progress re-dispatch, which died and was superseded. Four roles died on an API session limit. The `_agent-runtime-standard.md` ladder handled them: loop was read from its persisted complete return, and chains and catalogue were resumed and finished. The first final validator run flagged a backticked dead path in this run's own report. It was reworded and the validator re-run before the audit commit.
4. **Rule friction and rule breaches** — A deviation at `Step 3 — the acceptance gate`. Item 1's read requirement differs between `system-check-prompt.md` l.146 ("may open, to EOF") and the mandate's cross step 3 ("open to EOF, and declare"). The orchestrator first rejected progress r1 under the strict reading. It then withdrew that rejection and gated all five returns under an operative reading, which the reviewer accepted. Cost: one wasted re-dispatch; no map text depended on it. Logged as `BRCH-0009`, the seventh row on that step, and routed to `REC-370`. Both maps were read whole before Step 2, the step of `BRCH-0008`, and it was reached clean. The report was written before the final validator, the step of `BRCH-0004`, and that was reached clean too. Both rows stay `open` rather than `fixed`, so neither advances.
5. **Verdict** — change worth considering: one obligation for a `cross` concern's reads, stated once in the mandate and pointed at from `system-check-prompt.md` l.146 and Step 3 item 1 (`REC-370`). It is left `open` for a separately authorised cold adjudication, since this audit may not refine its own prompt.

Declared-output check: both maps, `_system-check-report-cross.md` and the ledger (`REC-370`–`REC-373` opened, `REC-363`/`REC-365`/`REC-367` updated) are in `0673c9e3`. This commit carries this report, the `system-check · cross` tracker row and `BRCH-0009`. No friction row was `open`. Dispatches: 6 required, 7 made. The ignored checkpoint is `.system-check/flows/cross/20261018-171532-0eabcc70/`. `system-check-prompt.md` is 392 lines, under the ~500-line alarm. With `cross` complete, every flow is `fresh` and no path is unassigned.

map: verified and corrected by the audit itself — 74 edits in `0673c9e3`. This close-out leaves the maps unaffected.
