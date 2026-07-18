# Coverage prompt — last run self-report

**Date:** 2026-07-18 · **Target:** TOPIC = Angular, NOTES_PATH = notes/angular/ · **Branch:** `fix/backend-backlog` · **Commit:** `7ba9dbc`

1. **Plan vs reality** — The split held: coverage was mature (163 lines), so the angles ran in parallel
   with the market analyst. The angle set was adapted per the config block — output-prediction dropped
   (optional for a framework topic), a **testing angle** added, and that added angle was the highest-yield
   of the five by a wide margin. **One sizing miss:** the run took the file from 163 to 285 lines and
   restructured 11 of 18 sections, so the result is a rewrite rather than a patch and the diff is hard to
   review bullet-by-bullet.

2. **Report discipline** — Clean. All six subagents returned bounded lists with their proof lines. Nothing
   trimmed or discarded.

3. **Failures & retries** — **One, and it was silent.** The Step 4b reviewer returned a confident defect
   list ending "74 items reviewed" against **96** sent — no error, no truncation, just a short number.
   Re-dispatched once per protocol; the second pass returned the corrected count *plus* defects in three
   sections the first pass had skipped entirely. Without the arithmetic check, ~22 newly-written items
   would have shipped unreviewed.

4. **Rule friction and rule breaches** —
   - **Friction:** Step 4b receives only the new items, so it structurally cannot judge section size — yet
     it is asked to apply a standard containing the 3-item minimum. It flagged six sections as
     "under-filled" that actually hold 10, 10 and 6 items; all six rejected against the mechanical count.
     *Fixed off this run* — the brief now puts section-size and completeness checks out of its scope.
   - **Friction (this file):** the report as first written ran ~60 lines, of which ~25 earned their place —
     it duplicated the chat summary's content and added paragraphs about what went well. Cause: it was
     written against the *previous* report rather than the spec, which each run necessarily sees because it
     overwrites it. *Fixed off this run* — `_pipeline-self-report.md` now warns against imitating the
     predecessor.
   - **Breaches:** none. Both step-0 guards ran (branch not `main`; generator on Opus). Model policy
     honoured. Both structural counts ran mechanically, and the post-4b recount caught a section pushed to
     13 by a mandated split — confirming that recount was right to be made mandatory. Sync verified by
     `diff`, not by reading the now-2238-line combined file.
   - *Note:* `notes/coverage.md` is at **2238 lines**; any Read-based whole-file pass needs `offset`.

5. **Verdict** — Two changes applied off this run (Step 4b scope; self-report anti-imitation). The 4b count
   line proved its worth on a real silent partial review.
