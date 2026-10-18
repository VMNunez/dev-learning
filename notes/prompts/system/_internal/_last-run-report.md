# Pipeline self-report — system-check

Date: 2026-10-18
Target: `FLOW = system` (resolved from `FLOW = next`), starting commit `f88bb8ae`
Outcome: completed
Status: rejected

1. **Plan vs reality** — The 17-concern split held. The whole-patch reviewer was again the evidence that mattered: it dropped one of 20 drafted corrections (M6), tightened six, settled the two conflicts no single concern could see, and found two occurrences of corrected claims that no concern had named (README's breach-log and doctrine entries). Per-file concerns still miss cross-occurrences, so the final pass is still necessary.
2. **Report discipline** — No return needed trimming. About nine returns labelled "the source states no ownership of this cell" as `fenced`, or once as `correct`. These were recorded as gate notes and patched nothing.
3. **Failures & retries** — 19 dispatches against 18 required (17 concerns + 1 reviewer), plus one cold re-dispatch. `skill-refine`'s first return failed gate items 3 and 5 and was rejected before reaching `accepted/`; its re-dispatch passed. The validator concern's role was killed mid-session by an API weekly rate limit after it had persisted a complete return. Its scratch file was read under `_agent-runtime-standard.md`'s ladder, so no re-dispatch was needed. The final validator passed on its first run, after the report had been written.
4. **Rule friction and rule breaches** — Friction: the mandate's five dispositions have none for "outside this licence / the source is silent", so concerns improvise `fenced` or `correct` for it. This changed no output, so it fails condition 3 and takes no row. No named step was breached: Step 3 rejected before copying; both maps were read whole before Step 2 (the step of `BRCH-0008`, reached clean); the report was written before the final validator (the step of `BRCH-0004`, reached clean). Both rows are `open` rather than `fixed`, so neither advances. A drafting slip: the report header carried an invented full starting-commit hash. It was replaced with `git rev-parse`'s value before the audit commit and reached no committed file.
5. **Verdict** — Pipeline clean. One candidate was rejected on condition 3 (the missing out-of-licence disposition: cost, not result). `REC-354` remains open in the ledger for its separately authorised adjudication.

Declared-output check: both maps, the flow report and `REC-366`–`REC-369` are in `1ef91506`. This commit carries this report and the `system-check · system` tracker row; no breach-log row and no friction reconciliation were owed. Dispatches: 18 required, 19 made. The ignored checkpoint is `.system-check/flows/system/20261018-122927-f88bb8ae/`. `system-check-prompt.md` is 392 lines, under the ~500-line alarm.

map: verified and corrected by the audit itself — 23 cells in `1ef91506`. This close-out leaves the maps unaffected.
