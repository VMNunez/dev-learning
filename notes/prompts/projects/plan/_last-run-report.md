# plan-audit — last run report

**Date:** 2026-07-21 · **Target:** MODE = review, PROJECT = projects/01-todo-list
**Status:** applied in bbe5d4c

1. **Plan vs reality** — the Angular-only path worked as designed: `rules-security` was correctly not dispatched (nothing to audit) and `branches-coverage` returned an all-N/A trace, the honest result for a legacy plan with no numbered sections — but that means two of five slices did no work on 01–06, so the five-specialist split is oversized for Angular projects.
2. **Report discipline** — nothing trimmed or discarded; all traces came back compact with line count + read-to-EOF.
3. **Failures & retries** — zero unusable reports. Two re-dispatches, both for ripples: `architecture` (component names and state ownership contradicting the corrected steps) and `steps-tests` (an `output()` the built component never had). Each concern used its one allowed re-dispatch; the cap held.
4. **Rule friction and rule breaches** — **breach:** step 0 read the previous report but did not print its open finding to Victor. That report predates the `Status:` line, and its Verdict named an unapplied change (invariant 8 vs transient fix branches); the check keys on `Status`, so a header without one read as clean and the finding stayed silent for a second run. **Friction:** the ripple cap forced the run to commit a plan carrying a line it had already verified as false — see Verdict.
5. **Verdict** — change applied: the leftover-ripple rule now carves out verified factual errors (the orchestrator corrects every occurrence before committing, instead of only recording them). Drafted, then tightened by the cold reviewer, which caught that the error occurred twice, not once. Second finding recorded, not applied: the oversized specialist set on Angular projects is cost, not a wrong result (bar condition 3).
