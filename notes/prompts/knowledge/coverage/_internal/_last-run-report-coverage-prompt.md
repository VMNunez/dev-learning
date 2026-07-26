# Coverage prompt — last run self-report

**Date:** 2026-07-26 · **Target:** TOPIC = Java, LEVEL = junior, MODE = update · **Branch:** `fix/backend-backlog`
**Status:** open — clean run; no prompt change recommended

Ledger reconciliation: no new prompt-change recommendation this run; the `_recommendation-ledger.md` rows stay `applied`. Nothing added or updated.

1. **Plan vs reality** — Verify-gap fast path again (preconditions held: `verify-junior.md` gaps=1 with matching SHA `212137ab`, no `## Java` inbox, prior report clean). Step 1 skipped, Step 2 scoped to the one gap (array access/bounds), Step 4 one scoped reviewer. 120 → 121 items.
2. **Report discipline** — The scoped reviewer opened with `161 lines, read to EOF`, `1 item reviewed`, returned a single keep-as-is verdict with factual verification. Nothing trimmed.
3. **Failures & retries** — One reviewer, one dispatch, no re-dispatch; content commit clean.
4. **Rule friction and rule breaches** — No mandatory step skipped: guards, EOF reads, gap adjudication, adversarial pass, one cold scoped review, mirror rebuild (121/121 parity, no cross-level dup, no format violations), notes-plan SHA recompute (still stale), staged-path check, verify superseded in the content commit.
5. **Verdict** — pipeline clean; no refinement earned. **Machinery observation (not a prompt defect):** this is the third coverage-prompt↔verify loop on Java junior (4 gaps → 1 gap → this 1). The loop is a property of using a fresh adversarial reviewer as the gate — each new cold reviewer surfaces a different marginal tail — not of missing work. The convergence lever is the verify orchestrator's Step 2 acceptance bar, which Victor recalibrated this session to "screening-critical only": recognition-level/restatement findings are rejected there so a normal round (full coverage-prompt + one verify) lands `complete`. Recorded here as the operating rule for future topics; no prompt edit, since the bar is orchestrator judgement, not prompt text. `coverage-prompt.md` is 219 lines, under the alarm.

Close-out evidence (against disk): declared outputs — `notes/java/coverage/junior.md`, mirror `notes/coverage/junior.md`, superseded `verify-junior.md` — changed in the content commit; no inbox routing. Report + `_run-tracker.md` committed together next.
