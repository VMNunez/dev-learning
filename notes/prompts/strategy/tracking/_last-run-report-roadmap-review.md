# Pipeline self-report — roadmap-review

**Date:** 2026-07-21 · **Target:** `ROADMAP.md` (branch `fix/backend-backlog`) · **Status:** applied in df91763

1. **Plan vs reality** — the 2-gatherer / 2-reviewer split held. Subagent 2a's brief ("one line per
   concept") is mis-sized against a 3914-line coverage.md: it returned topic-cluster lines instead
   and said so. That was the right call, but the prompt asks for something the file cannot produce.
2. **Report discipline** — nothing had to be discarded. 2a's report was longer than contracted but
   every line was load-bearing; 2b and both reviewers returned exactly the contracted table.
3. **Failures & retries** — Reviewer 2 died mid-run on an API session limit and was re-dispatched
   once; the retry completed and applied two fixes. The prompt has no failure protocol for a
   reviewer that dies (as opposed to one that returns a bad report) — I applied the 2a/Reviewer-2
   re-dispatch-once rule by analogy.
4. **Rule friction and rule breaches** — **breach:** the step-0 run-start check never ran. The
   prompt *did* state it (line 12), but outside the fenced block that is actually pasted in, so an
   invoked run cannot see it; the cold reviewer corrected my initial read that the rule was absent.
   Cost was nil this time — no prior roadmap-review report existed. **Friction:** the folder holds
   `_last-run-report.md` owned by `progress-update`, and neither prompt named the filename it owns,
   so this run had to derive its own from the shared spec's shared-folder rule.
5. **Verdict** — applied: line 12 now names `_last-run-report-roadmap-review.md` and the ownership
   split, and one pointer line inside the fence makes the check visible to an invoked run (cold
   reviewer: approve-with-tightening — it rejected my 4-line draft as duplicating an existing rule).
   Subagent 2a's "one line per concept" wording, mis-sized against a 3914-line coverage.md, is
   friction only (#3 failed) — recorded, not applied.
