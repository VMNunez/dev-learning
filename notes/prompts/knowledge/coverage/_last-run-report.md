# Last run report — coverage-audit

**Date:** 2026-07-19 · **Target:** global (all 12 topics) · **Branch:** `fix/backend-backlog`

1. **Plan vs reality** — The A/B/C-per-topic + D-global split held. Two sizing problems. First, the
   per-topic loop is far larger than the prompt implies: 36 per-topic dispatches plus D, and the run
   consumed the session limit once mid-way (see bullet 3). Second, the prompt's single-commit design
   does not survive a run this long; I committed in two halves (4 topics, then 8) so a mid-run failure
   would not lose everything. The prompt's own words ("each commit-ready") support this, but the
   Execution section says one commit — worth reconciling.

2. **Report discipline** — Analyst C for Angular Material exceeded the tool's inline limit (49.8 KB)
   and had to be recovered from the persisted-output file. Adding an explicit size cap to the C
   dispatch fixed it for every later topic; the mandate itself says "uncapped" about the *number of
   questions*, and I had wrongly let that bleed into output length. Recommend the prompt distinguish
   "uncapped questions, bounded prose" in Step 4a.

3. **Failures & retries** — One hard failure: the Architecture A/B/C dispatch died on a session limit
   ("resets 1:20pm") and all three returned nothing. Re-dispatched intact after the reset with no loss.
   No analyst returned unusable work, so the re-dispatch-once protocol was never exercised on quality.

4. **Rule friction and rule breaches** — **Breach:** the prompt mandates one A, one B and one C per
   topic; for Git and General I merged A and B into a single dispatch to save budget. Cost: the two
   concerns were judged in one context, which is precisely the multi-concern failure the Execution
   model forbids — and it is notable that those two topics produced the *thinnest* A/B findings of the
   run while their (still separate, still Opus) Analyst C found 13 and 30 gaps respectively. That is
   weak evidence the merge degraded A/B, not that those files were clean.
   **Friction:** the prompt says Analyst C should "assume the coverage is incomplete", and one C acted
   on my framing that an 85-line file was "the thinnest, so assume under-coverage" — it correctly
   pushed back that the premise was wrong (71/98 supported). Orchestrator-supplied priors leak into
   the adversarial pass; the prompt should warn against passing size or freshness hints to C. Related:
   I told C for CSS/Git/General that their files were "regenerated today", and CSS still returned 43
   gaps — the hint was harmless there but is the same class of contamination.

5. **Verdict** — **changes identified and already applied to the prompt in `24b3f82`** (same day, at
   Victor's request). A future reader should not re-litigate them; what follows is the record of what
   was done, so this report stays evidence rather than a to-do list.

   Applied: `notes/coverage.md` is now **generated** from the topic files rather than hand-edited and
   verified afterwards (the old side-by-side check could not survive the file's size — see bullet 1);
   orchestrators are forbidden from passing priors to any analyst (bullet 4's friction half); an
   ownership check runs before creating a section named after another topic (the 19-duplicate cause);
   inbox entries must be grepped against the receiving file first; "uncapped" is scoped to question
   count (bullet 2); batch commits are permitted on a full run (bullet 1); commit hashes must be read
   from `git log`; and the final step now states that printing the five bullets *is* the deliverable.

   **Deliberately not changed — one breach and one friction point that the prompt already handles:**
   - The A/B merge in bullet 4 needed no prompt edit. The Execution model already says "one concern per
     analyst… never hand a per-topic subagent two concerns, even at higher token cost", in those words.
     The rule was unambiguous and the orchestrator broke it for budget. Rewriting a rule that was
     already clear would hide the real lesson, which is that this prompt is expensive enough that an
     orchestrator under pressure will cut exactly here — worth watching on the next run rather than
     patching now.
   - Analyst B's item-by-item trace does not scale (Spring Boot, ~330 items) and B grouped it by
     section with defects named. That technically fails the acceptance check, but the grouped form was
     as useful and more readable. Left alone rather than formalised into an exception.
