# Pipeline self-report — system-check

Date: 2026-10-17
Target: `FLOW = projects`, starting commit `41a9a084`
Outcome: completed
Status: open

1. **Plan vs reality** — The 27 concern split plus one whole-patch reviewer held. The cold reviewer found one missed map occurrence, one displaced qualifier and one rule-fork risk after all concern returns were accepted; its `approve-with-tightening` verdict is the evidence that the final whole-patch pass remains necessary.
2. **Report discipline** — No return needed trimming or discarding. One accepted concern included an out-of-licence §9 Handoffs absence; it was struck and recorded before the live patch.
3. **Failures & retries** — All 28 required dispatches completed with no re-dispatch. The final validator failed once because the new flow report rendered a closed-ledger proposal as a live path; the report was corrected and the validator then passed every invariant.
4. **Rule friction and rule breaches** — Step 3 was breached again: the `backlog-task-close` concern entered `accepted/` before its out-of-licence absence was struck. No map carried the row, but acceptance itself violated the gate. Logged as `BRCH-0006` and routed to existing `REC-354`, which remains open. `BRCH-0004` remains open; there are no `fixed` or `confirmed` rows to advance.
5. **Verdict** — Change worth considering: `REC-354` must settle the repeated Step 3 licence check in a separately authorised cold adjudication; Step 7 forbids applying it inside this audit.

Declared-output check: both maps, the flow report and seven new ledger rows are in `b5effb82`; the existing trace contradiction was deduplicated to `REC-329`. This commit carries this report, the `system-check · projects` tracker row, `BRCH-0006` and the `REC-354` source update. The ignored checkpoint is `.system-check/flows/projects/20261017-123110-41a9a084/`. `_skill-friction.md` has no open row. `system-check-prompt.md` is 392 lines, under the ~500-line alarm.

map: verified and corrected by the audit itself — the projects catalogue, writer registry, lifecycle and debt rows in `b5effb82`. This close-out leaves the maps unaffected.
