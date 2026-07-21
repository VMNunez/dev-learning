# Pipeline self-report — roadmap-review

**Date:** 2026-07-21 · **Target:** `ROADMAP.md` (branch `fix/backend-backlog`) · **Status:** open

1. **Plan vs reality** — the 2-gatherer / 2-reviewer split held. Subagent 2a's brief ("one line per
   concept") is mis-sized against a 3914-line coverage.md: it returned topic-cluster lines instead
   and said so. That was the right call, but the prompt asks for something the file cannot produce.
2. **Report discipline** — nothing had to be discarded. 2a's report was longer than contracted but
   every line was load-bearing; 2b and both reviewers returned exactly the contracted table.
3. **Failures & retries** — Reviewer 2 died mid-run on an API session limit and was re-dispatched
   once; the retry completed and applied two fixes. The prompt has no failure protocol for a
   reviewer that dies (as opposed to one that returns a bad report) — I applied the 2a/Reviewer-2
   re-dispatch-once rule by analogy.
4. **Rule friction and rule breaches** — **breach:** I skipped the step-0 run-start check
   (`_pipeline-self-report.md`'s mandate to read this orchestrator's own last-run report before
   starting). Cost was nil this time — no prior roadmap-review report existed — but the check was
   skipped because the prompt's own step-0 block covers only the branch guard and does not mention
   it. **Friction:** the folder holds `_last-run-report.md` written by `progress-update`; the shared
   spec's "if several orchestrators share a folder" rule resolves it, but neither prompt names the
   filename it owns, so the first run here had to derive it.
5. **Verdict** — change worth considering: the prompt's step-0 block should name the run-start
   check (it is mandated by `_pipeline-self-report.md` but invisible from this prompt alone) — real
   evidence, prompt silent where it needed to speak, and it changes the result, not just the cost.
   Subagent 2a's "one line per concept" wording is friction only (#3 failed) — recorded, not applied.
