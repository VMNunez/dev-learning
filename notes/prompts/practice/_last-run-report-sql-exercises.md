# Last run — sql-exercises

2026-07-22 · `MODE = review` · `TOPIC = basics` · `FILE = practice/sql/01-basics.sql`
Status: open

1. **Resolution vs reality** — `{FILE}` was set explicitly and resolved correctly; `{COUNT}`/`{FOCUS}`/`{REVIEW}` do not apply in review mode. The file is legacy-format throughout and the legacy detection rule worked: all 40 answers were found and graded (40/40 correct). One stale fact found downstream, not in this prompt: `PROGRESS.md`'s exercises table still listed `02-joins.sql` with 10 exercises after the file was deleted on 2026-07-22 — corrected in this run.

2. **Rule friction and rule breaches** — two, both real:
   - **Step 3 / Step 4b close a topic on score alone.** At 100% they instruct "Listo para marcar {TOPIC} como sólido" and `Status: solid ✅`, but PLANNING.md §5 counts only *first-pass* exercises against a step target, and Step 0 has 20 first-pass of 30. Marking `basics` solid would have told the next practice run the topic was finished with a third of it unwritten. **Deviated deliberately:** kept `in progress ⏳` in both files and said so in chat. Step 4c already gets this right ("score ≥ 80% **and** the step's target reached"); Steps 3 and 4b are the two places that forgot the conjunction.
   - **Step 2b vs PLANNING.md §5 on markers.** Step 2b says append `-- ✅ Corregido` to every correct answer; §5 says only the current format can carry it and legacy exercises are re-read every run. Followed the plan (it wins by the prompt's own rule) — no markers written. Cost is nil here since the topic scored 100% and needs no second review pass.

3. **Verdict** — cambio a considerar: alinear Step 3 y Step 4b con Step 4c (score **y** target de primera pasada, no solo score). **Rejected for this prompt, applied nowhere yet:** the first-pass/review distinction is owned by `practice/sql/PLANNING.md` §5, and the prompt already states the plan wins on any disagreement — so the fix belongs in the plan's §4 ritual wording, not in a new clause here. Re-proposing an edit to this prompt for the same reason is not warranted. The marker contradiction is likewise already resolved by the existing "the plan wins" rule; no edit.
