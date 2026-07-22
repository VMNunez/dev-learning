# Last run — sql-exercises

2026-07-22 · `MODE = review` · `TOPIC = basics` · `FILE = practice/sql/01-basics.sql`
Status: open

1. **Resolution vs reality** — `{FILE}` was set explicitly and resolved correctly; `{COUNT}`/`{FOCUS}`/`{REVIEW}` do not apply in review mode. The file is legacy-format throughout and the legacy detection rule worked: all 40 answers were found and graded (40/40 correct). One stale fact found downstream, not in this prompt: `PROGRESS.md`'s exercises table still listed `02-joins.sql` with 10 exercises after the file was deleted on 2026-07-22 — corrected in this run.

2. **Rule friction and rule breaches** — two, both real:
   - **Step 3 / Step 4b close a topic on score alone.** At 100% they instruct "Listo para marcar {TOPIC} como sólido" and `Status: solid ✅`, but PLANNING.md §5 counts only *first-pass* exercises against a step target, and Step 0 has 20 first-pass of 30. Marking `basics` solid would have told the next practice run the topic was finished with a third of it unwritten. **Deviated deliberately:** kept `in progress ⏳` in both files and said so in chat. Step 4c already gets this right ("score ≥ 80% **and** the step's target reached"); Steps 3 and 4b are the two places that forgot the conjunction.
   - **Step 2b vs PLANNING.md §5 on markers — breach, and the plan was the wrong side to follow.** Step 2b says append `-- ✅ Corregido` to every correct answer; §5 claimed only the current format can carry it. Followed the plan and wrote no markers. Victor pushed back the same session and he was right: the marker is a comment line, it works identically in legacy format, and "the plan wins" is a rule about *scope and order*, not a licence to skip a step over a factual claim that is simply false. **Fixed after the fact:** 40 markers written into `01-basics.sql`, and §5's claim corrected.

3. **Verdict** — dos cambios, ambos aplicados a este prompt en la misma sesión, a petición de Victor:
   - **Step 5 no longer writes interview questions.** It now only *names* the concept gaps in chat. Authoring Q&A belongs to `interview-prep-audit` (G4) and notes to `/notes-audit` (Moment 5); a grading run that also authors study material bypasses both standards and their cold reviewers. Same reasoning that removed interview-prep from the step-complete ritual on 2026-07-13. Out with it: the `git add notes/interview-prep/...` block in Step 6.
   - **`COUNT` is now a visible optional key** in the config block, with `FILE`'s exact semantics — blank derives from PLANNING.md §6, a value overrides it for one run and is announced. The old "two keys only" framing hid the batch size from the person running it.

   Still open, and **not** fixed here: Step 3 and Step 4b close a topic on score alone while Step 4c correctly requires score **and** first-pass target. The fix belongs in `practice/sql/PLANNING.md` §4's ritual wording, not in a new clause here.
