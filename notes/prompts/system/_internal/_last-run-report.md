# Pipeline self-report — system-check

Date: 2026-08-09
Target: global prompt and skill system
Outcome: completed
Status: open

1. **Plan vs reality** — The 13 family manifests plus five cross-system concerns covered all 187 frozen
   inventory paths to EOF with zero duplicate owners and zero omissions, and the ownership split
   resolved to 187 exactly without adjustment. This pipeline does have a step that reads the finished
   artefact independently of the slice owners — the Step 7 cold reviewer — and its findings outrank the
   analyst traces: it confirmed all nine corrections but **overturned one classification**, so the
   split's real measure is that a defect survived every green slice and was caught only there.
2. **Report discipline** — Three of the eighteen analyst returns exceeded the inline budget and were
   persisted to disk rather than truncated; two of those (root contracts, skills) were then consumed by
   targeted grep instead of full reload, and the map-claims extraction was **not used at all** — the
   orchestrator read both maps directly, because a 106KB paraphrase of the object under review is a
   worse input than the object. That analyst's cost bought only a redundant cross-check.
3. **Failures & retries** — The first Step 7 reviewer dispatch was killed by a runtime session limit
   after three tool calls, with no verdict. It was re-dispatched cold once, per Step 3's re-dispatch
   rule, and returned normally. No single-agent fallback was taken at any point; had the retry failed,
   the run would have closed `blocked` with the map patch undrafted on disk and uncommitted.
4. **Rule friction and rule breaches** — The Step 0/1 snapshot mislabelling reported by the previous run
   is **still present** (Steps 3 and 7 say "the Step 0 path + hash manifest" while Step 0 defers its
   construction to Step 1); it again cost no result because the 187-path set was recomputed explicitly
   at both points. One rule was breached by the orchestrator, not the prompt: a machinery finding was
   drafted from a grep for `durable friction` that could not match the hyphenated `durable-friction`
   the four skills actually use, and it reached the cold reviewer as a proposed ledger row. The
   mandatory gate caught it and it was withdrawn, so nothing false shipped — but the near-miss is that
   a *negative* grep result was treated as evidence of absence without opening one of the four files.
5. **Verdict** — pipeline clean. The previous run's open finding is now resolved by evidence rather than
   by edit: launcher argument-contract parity passes 30/30, and the underlying gap it named — that no
   automated check can falsify those contracts — is filed as `REC-067` for a later run to fix at the
   validator. Per this prompt's Step 9 boundary, no at-end refinement ran inside the audit, so the
   Step 0/1 mislabelling in bullet 4 stays `open` for a separately authorised cold adjudication; this is
   the second consecutive report to name it, which makes that adjudication due rather than optional.
