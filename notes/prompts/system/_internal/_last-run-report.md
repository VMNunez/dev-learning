# Pipeline self-report — system-check

Date: 2026-08-10
Target: global prompt and skill system
Outcome: completed
Status: open

1. **Plan vs reality** — The 13 family manifests plus four cross-system concerns covered all 167 frozen
   inventory paths to EOF, zero duplicate owners, zero omissions. This pipeline does have a step that
   reads the finished artefact independently of the slice owners — the Step 6 cold reviewer — and its
   findings outrank the analyst traces, so the split's real measure is what it caught: it **failed four
   of its eight checks** and falsified two `README.md` cells the orchestrator had already published as
   `verified — no change`. Both were falsifiable from manifests the orchestrator was holding at the time
   (`family-apply.md`, `skills.md`). The slicing was sound; the reconciliation over it was not.
2. **Report discipline** — Three of the seventeen returns exceeded the inline budget and were persisted
   to disk rather than truncated. The Step 2C map-claims extraction (434 lines) was again used only as a
   cross-check — the orchestrator read both maps directly, because a paraphrase of the object under
   review is a worse input than the object. **That is the second consecutive report saying so**, which
   makes it a pattern rather than one run's preference.
3. **Failures & retries** — A runtime session limit killed an entire nine-agent wave mid-dispatch with no
   returns. Three of the nine had already written complete manifests to disk and were verified and kept
   (all sections present, all EOF declarations); the other six were re-dispatched cold in two smaller
   batches under Step 3's re-dispatch rule, and the path + hash manifest was recomputed afterwards and had
   not moved. The wave size — nine deep/standard analysts at once — is what met the limit; the two later
   batches of three each completed. No single-agent fallback was taken.
4. **Rule friction and rule breaches** — Two friction points, both in Step 6's input contract, found by
   the family analyst reading this prompt: Step 6 dispatches the reviewer with "the draft system-check
   report", but **no step before it is assigned to author that artefact** — Step 7 is what writes the
   report, and two of its nine fields (the reviewer verdict, the global verdict) cannot exist before Step
   6 returns; and a run blocked at Step 3 reaches Step 7 having never run Step 6, so report item 8 has no
   possible value and the blocked branch never says which items are dropped. The first cost this run only
   an improvised scratchpad artefact; the second would produce a wrong report on a path this run did not
   take. **One rule was breached by the orchestrator, not the prompt:** Step 4 requires comparing the
   manifests against *every relevant claim, not merely the first name hit*, and the README hub table's
   writer cells and the `/cover-letter` reads cell were never compared against `skills.md` and
   `family-apply.md` — they were ruled verified on a section-level pass. The mandatory gate caught both,
   so nothing false shipped, but this is the second consecutive run in which the cold reviewer overturned
   an orchestrator ruling rather than merely confirming corrections.
5. **Verdict** — change worth considering: Step 6's `draft system-check report` input has no producer,
   and the Step-3-blocked path cannot satisfy the Step 7 report schema it is sent to. Per this prompt's
   Step 8 boundary no at-end refinement ran inside the audit, so both stay `open` for a separately
   authorised cold adjudication. The previous run's open finding — Steps 3 and 7 mislabelling the
   snapshot as "the Step 0 manifest" — is **resolved**: the `REC-068` rewrite (`0d1b8a5d`) now says
   "the Step 1 path + hash manifest" in both places, and the prompt is 8 steps, not 9. `cold reviewer:
   approve-with-tightening` (audit gate, Step 6); no prompt refinement was drafted or reviewed.
