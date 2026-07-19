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

5. **Verdict** — change worth considering: (a) split the Execution section's single-commit rule to
   permit per-batch commits on a full 12-topic run; (b) in Step 4a, state that "uncapped" governs
   question count and not output size; (c) forbid the orchestrator from passing freshness/size priors
   to Analyst C.
