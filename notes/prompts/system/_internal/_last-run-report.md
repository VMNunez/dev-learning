# Pipeline self-report — system-check

Date: 2026-10-15
Target: `FLOW = knowledge`, starting commit `7c60e840`
Outcome: blocked
Status: open

1. **Plan vs reality** — Six file concerns passed Step 3; the second cold return for `_notes-review-prompt.md` remained incomplete and blocked the flow. The other 20 file/skill concerns and launcher concern have no accepted return. No whole-result reviewer ran, so the partial returns do not establish map accuracy.
2. **Report discipline** — Returns with paraphrased evidence or missing required declarations were rejected; one invalid return was briefly persisted as accepted, then removed before patching. The six valid returns are stored verbatim in the checkpoint.
3. **Failures & retries** — Cold re-dispatch repaired the `_note-quality-standard.md` and `_interview-prep-review-prompt.md` returns. The `_notes-review-prompt.md` re-dispatch failed the one-retry gate. Other live concerns were stopped; the final reviewer was not dispatched because Step 3 never closed.
4. **Rule friction and rule breaches** — `BRCH-0002`: Step 3 item 3 required exact source quotations before acceptance, but the first `_interview-prep-review-prompt.md` return was temporarily marked accepted without them. The mistake was caught before any map edit. This is the second breach of that named gate (`BRCH-0001`); both rows route to `REC-347`.
5. **Verdict** — Change worth considering: put Step 3's evidence check at the persist-accepted action so an invalid return cannot enter the accepted set. Repeated-breach ruling is open in `REC-347`; this audit's Step 7 forbids editing its own prompt, so a separate cold adjudication must decide the repair.

Declared-output check: the flow report and `REC-346` are in `cdbb85a5`; the blocked branch wrote neither map. This report, the `system-check · knowledge` tracker row, the breach-log dispositions and `REC-347` are the close-out commit. `_skill-friction.md` has no open rows. `system-check-prompt.md` is 385 lines, below the ~500-line alarm; the breach log has no `fixed` or `confirmed` rows to test. No mandatory final-review dispatch was owed after the acceptance gate blocked.

map: no knowledge-flow verdict — the blocked branch made no correction. Maps unaffected by this close-out.
