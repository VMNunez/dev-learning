# Coverage prompt — last run self-report

**Date:** 2026-07-26 · **Target:** TOPIC = Java, LEVEL = junior, MODE = update · **Branch:** `fix/backend-backlog`
**Status:** open — clean run; no prompt change recommended

Ledger reconciliation: no new prompt-change recommendation this run; the `_recommendation-ledger.md` rows stay `applied`. Nothing added or updated.

1. **Plan vs reality** — Ran the **verify-gap fast path** (its four preconditions all held: `verify-junior.md` `Verdict: gaps` with matching SHA `1eb8aae1`, no `## Java` inbox entry, prior self-report clean with no active trigger). Step 1 correctly skipped, Step 2 scoped to the four open gaps, Step 4 one scoped reviewer. Split held; no mis-sizing.
2. **Report discipline** — The single scoped reviewer opened with `160 lines, read to EOF` and `4 items reviewed`, returned per-item verdicts within brief. Nothing trimmed.
3. **Failures & retries** — One scoped reviewer, dispatched once, no re-dispatch; the content commit hit no block. (Context: the preceding coverage-verify run's reviewer had been cut off by a session usage limit and recovered on retry; this run was unaffected.)
4. **Rule friction and rule breaches** — No mandatory step skipped for the selected scope: branch/status guards, whole-file EOF reads, fast-path adjudication of each gap against the standard (all four accepted; item 4 reworded to drop a clause the existing `Map` bullet already carries), adversarial pass, one cold scoped review, mirror rebuild with 120/120 parity + format + cross-level uniqueness + `git diff --check`, notes-plan SHA recompute (`d30b9c…` vs new `212137ab…` → stale, as expected), staged-path check, verify-junior superseded in the content commit. The "verify gaps are proposals, never pre-approved" rule was honoured — each gap was re-judged, not rubber-stamped.
5. **Verdict** — pipeline clean. No finding cleared the refinement bar. Fast-path branch executed exactly as written; the reviewer approved all four placements with no change, so nothing about the prompt was wrong or ambiguous. `coverage-prompt.md` is 219 lines, below the ~500-line alarm.

Close-out evidence (against disk): declared update-mode outputs — `notes/java/coverage/junior.md`, global mirror `notes/coverage/junior.md`, and superseded `notes/java/coverage/verify-junior.md` — changed in the content commit; no inbox routing required. This report and `_run-tracker.md` (Java Coverage J + Verify J cells) are committed together next.
