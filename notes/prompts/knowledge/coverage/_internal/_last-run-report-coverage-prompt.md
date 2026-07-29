# Pipeline self-report — 2026-07-29 — Security junior update

Status: open

- **Plan vs reality** — The market analyst plus two whole-artifact cold reviewers was the right split:
  all 3/3 required dispatches ran, and the reviewers found missing controls, level moves, ownership
  leaks, grouped items, and factual overstatements after the draft.
- **Report discipline** — All three returns provided the required evidence classes or review fields and
  whole-file line-count/EOF proof; none required trimming or discarding.
- **Failures & retries** — No subagent failed or required re-dispatch. Sandboxed staging could not
  create `.git/index.lock`; the approved scoped retry succeeded.
- **Rule friction and rule breaches** — The previous report path was again resolved first against the
  shared `_internal` folder, so the Step 0 recommendation guard ran late during close-out. The recovered
  report was clean, so content was unaffected. This is the second consecutive occurrence; the mandatory
  extraction assessment found the 241-line prompt below budget and no optional self-contained block
  whose extraction would address a one-line path-resolution lapse.
- **Verdict** — The repeated late guard is a discipline lapse; changing the prompt is rejected against
  bar condition 3 because the recovered clean report left the target output unchanged.
