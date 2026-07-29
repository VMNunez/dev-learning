# Pipeline self-report — 2026-07-29 — Architecture junior update

Status: open

- **Plan vs reality** — The one market analyst plus two whole-artifact cold reviewers was the right
  split: all 3/3 required dispatches ran, and the reviewers found calibration, ownership, and factual
  defects after the draft rather than merely confirming their own work.
- **Report discipline** — All three returns followed their evidence-only contracts and included the
  required line counts and EOF confirmations; none required trimming or discarding.
- **Failures & retries** — No subagent failed or required re-dispatch. The first mechanical mirror
  rebuild changed encoding outside the target section; the diff-size guard caught it and the rebuild
  was repeated with explicit UTF-8 handling. Sandboxed staging failed on `.git/index.lock`; the approved
  scoped retry succeeded.
- **Rule friction and rule breaches** — The previous report path was initially resolved against the
  shared internal folder instead of the coverage orchestrator's internal folder, so the Step 0
  recommendation check ran late during close-out. The recovered previous report was clean and had no
  unresolved recommendation, so content was unaffected. PowerShell's implicit text encoding also made
  the first mirror rewrite unsafe, but declared diff inspection prevented it from landing.
- **Verdict** — pipeline completed with one late Step 0 guard; this was a discipline lapse, not a prompt
  defect, so no prompt change is justified.
