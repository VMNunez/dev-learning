# Pipeline self-report — system-check

Date: 2026-10-15
Target: `FLOW = strategy` (named), starting commit 527a686a
Outcome: completed
Status: rejected

1. **Plan vs reality** — The one-concern-per-file split fitted the flow: 10 file concerns + 1 launchers
   concern, each under ~5 minutes, all accepted first time. The cold final reviewer read every cited
   source whole and is this bullet's evidence: it cut the patch from 11 cells to 10, tightened two, cleared
   6 of 10 launcher `incorrect` rows and raised one finding no concern saw (`REC-345`). So the analysts
   over-rule, and the reviewer is what makes the output sound.
2. **Report discipline** — The launchers concern's scratch file stopped before its counts and closing
   line, which only its returned message carried. The orchestrator copied them into the accepted file
   verbatim and marked the copy. Nothing was trimmed.
3. **Failures & retries** — Dispatches required/actual: 10 standard analysts, 1 mechanical analyst and
   1 deep reviewer, 12/12. No re-dispatch and no dead role.
4. **Rule friction and rule breaches** — Breach: the Step 3 gate accepted the `roadmap-review-prompt`
   return although three of its rows ruled absences outside its licence. The rule requires a cold
   re-dispatch; the orchestrator held the rows out instead, and the reviewer confirmed they stay out
   (`BRCH-0001`). Friction 1: the mandate gives `KIND = launchers` an `incorrect` disposition on the
   launcher's own `Rules`, with "proposed wording", while this run may not edit a launcher. Nothing says
   such a row is a Step 5 machinery finding rather than a map correction; the orchestrator routed it
   there on Step 5's own wording. Friction 2: the first draft of the flow report quoted the path the
   validator's `REPORT:` line names, and the final validator failed on that report as a dead path. It
   was reworded before commit.
5. **Verdict** — Pipeline clean. Three candidates were rejected. The two frictions fail condition 3:
   routing and output came out right, at the cost of one judgement call and one validator re-run.
   `BRCH-0001` is a first row on a clearly stated gate, so it fails condition 2 as a discipline lapse
   until a second row names the same step.

Declared-output check: both maps, `_system-check-report-strategy.md` and two ledger rows went into
`1fa31ce5`. Git-ignored evidence is under `.system-check/flows/strategy/20261015-170320-527a686a/`
(`state.md` reads `complete`). This report, the `system-check · strategy` tracker row and the new
breach log are this commit. `_skill-friction.md` had no open rows. Prompt health:
`system-check-prompt.md` is 385 lines, under the ~500 alarm. The breach log has no `fixed` or
`confirmed` rows to rule on.

map: verified — README `/system-check` interface-index row, System catalogue row and "Auditing the
machinery" run order; `_system-map.md` §7 report and checkpoint rows, §12 "The explicit semantic sweep".
Maps unaffected by this close-out.
