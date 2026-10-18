# Pipeline self-report — system-check

Date: 2026-10-18
Target: `FLOW = strategy`, starting commit `88fb26bb`
Outcome: completed
Status: open

1. **Plan vs reality** — The 11-concern split held, but item 2 of the gate did real work: four of ten file concerns (cover-letter, cv, linkedin, profile-readme) left a licensed §7 cell unruled on their first return and passed on a cold re-dispatch that named the templated §7 rows. The whole-patch reviewer then dropped four of nine proposed corrections (R2a-c, R4) and found that the same population (the external-path preflight) had been ruled three ways across concerns — evidence that per-file concerns cannot see a cross-file inconsistency and that the final pass remains necessary.
2. **Report discipline** — No return needed trimming. Several mislabelled out-of-fence absences as `fenced` with no patch; they were recorded as gate notes, and one `missing` row proposing a new §7 row was struck as a completeness claim.
3. **Failures & retries** — 16 dispatches: 11 concerns + 4 cold re-dispatches (each passed on its second return) + 1 deep reviewer; no role died. The final validator passed on its first run, after the report was written.
4. **Rule friction and rule breaches** — Step 3 was breached again: the `linkedin-prompt.md` first return entered `accepted/` before its §7 coverage was checked, and was removed and re-dispatched before any patch (`BRCH-0007`, routed to open `REC-354`, whose source cell now cites it). The orchestration-gate read of both maps was completed after the Step 2 dispatch rather than before it (`BRCH-0008`, `shared`, first row — stays `open`). No `fixed` or `confirmed` row to advance; `BRCH-0004` stays `open`.
5. **Verdict** — Change worth considering: `REC-354` (Step 3's items are checked after the copy into `accepted/`, now six rows) still needs its separately authorised cold adjudication; Step 7 forbids applying it inside this audit.

Declared-output check: both maps, the flow report and `REC-365` are in `923176c0`. This commit carries this report, the `system-check · strategy` tracker row, `BRCH-0007`/`BRCH-0008` and the `REC-354` source update. Dispatches: 12 required (11 concerns + 1 reviewer), 16 made. The ignored checkpoint is `.system-check/flows/strategy/20261018-114544-88fb26bb/`. `_skill-friction.md` has no open row. `system-check-prompt.md` is 392 lines, under the ~500-line alarm.

map: verified and corrected by the audit itself — 5 cells in `923176c0`. This close-out leaves the maps unaffected.
