# Coverage prompt — last run self-report

**Date:** 2026-07-18 · **Target:** TOPIC = JavaScript, NOTES_PATH = notes/javascript/ · **Branch:** `fix/backend-backlog`

1. **Plan vs reality** — The split held. JavaScript's coverage was mature (121 lines), so the parallel
   ordering applied again: the angles ran **alongside the Step 2 market analyst**, judged against the
   existing file, and consolidated in one pass. One deliberate deviation, and it was the most valuable
   decision of the run: a **fifth angle — output-prediction quickfire** — was added under the prompt's
   "add one the topic obviously needs" clause. It was the *only* angle that reached the language-semantics
   layer (`ToPrimitive`, the abstract equality algorithm, `this` binding precedence, the prototype chain,
   microtask-drain ordering, sparse arrays). The four standard angles are framework-shaped and, on their
   own, would have left JavaScript's largest screening surface uncovered.
2. **Report discipline** — Clean. All five angles returned only the gap list / OUT list / proof line
   ("121 lines, read to EOF" ×5). The market analyst declared the live web search ran and reported the
   frequency signal honestly — JavaScript is named in ~1 of 9 postings on file, below the 3-posting
   threshold — then shifted its weight to interview norms as instructed instead of padding with generic
   stack requirements. Nothing trimmed or discarded.
3. **Failures & retries** — None. All six passed the acceptance check on first dispatch.
4. **Rule friction and rule breaches** —
   - *Confirmation:* the **cross-topic overlap check again did heavy work**, and more than on any prior
     run. JavaScript sits underneath Angular, General, Security and Architecture, so a large share of
     proposed gaps was already owned elsewhere: an entire proposed "browser storage" section (General
     ~1801–1804 and Security), plus CORS, the `OPTIONS` preflight, the `Authorization: Bearer` header,
     JWT-in-`localStorage`/XSS, `.env`-is-public, `proxy.conf.json`, and every test-quality item
     (Angular/General own testing). Having the check *before* writing paid off again — none of it was
     written and mirrored only to be removed.
   - *Friction (minor, real):* the prompt gives no signal that **some topics are structurally
     overlap-heavy**. For a foundational topic like JavaScript the check is not a formality but the
     single most consequential consolidation step, and it only stayed tractable because the proposed
     concepts were grepped against `notes/coverage.md` in one pass rather than judged from memory.
     Worth naming that technique in the step.
   - *Structural check earned its keep:* the mechanical count forced two fixes the eye had missed — an
     undersized 4-item "Execution order and the event loop" was **grown** (call-stack item, per the rule
     added off the Java run) rather than merged, and a `console.*` bullet that had fused severity levels
     with `console.table`/`console.dir` was split under the one-concept rule.
   - *Breaches:* none. Branch guard ran (`fix/backend-backlog`, not `main`); the generator was confirmed
     on Opus before Step 1; all five angles on Opus, market analyst on Sonnet; the sync was verified
     programmatically line-for-line (266 lines, 0 mismatches) rather than by eye, and the Windows
     encoding hazard was avoided by rebuilding through Python with explicit UTF-8 instead of PowerShell.
   - *Note for the next run:* `notes/coverage.md` has now crossed the truncation threshold — **2008
     lines**. Every future whole-file read of it must use `offset` passes; this run sidestepped the risk
     by processing it programmatically, but a Read-based sync would now silently truncate.
5. **Verdict** — Pipeline clean. **Three changes applied off this run:**
   - *Step 4a angle list:* **output prediction is now a mandatory fifth angle for language topics**
     (JavaScript, Java, TypeScript). Angles 1–4 are framework-shaped, so on a language topic they can
     converge, look complete, and never reach the mechanism layer — on this run the improvised fifth
     angle was the only source of `ToPrimitive`, the abstract equality algorithm, `this` binding
     precedence, the prototype chain and microtask ordering.
   - *Cross-topic overlap check:* now states the technique (**one grep, not a re-read** of a 2000+ line
     file, and not memory) and warns that **foundational topics are structurally overlap-heavy** — Java
     and JavaScript are both recorded as the worked evidence.
   - *Final summary:* new **"Size delta"** row (lines and sections, before → after, plus the analyst's
     posting-frequency signal), with an explicit note that it is *reported, never acted on* — scope
     still comes from the job, and the scheduling conclusion is Victor's to draw, not the run's.

   **Still open, not applied — needs Victor's decision because it changes the design:** `coverage-prompt`
   has no cold reviewer of its own output. The 4a angles audit the *existing* file; the items the
   generator word-crafts during consolidation are never judged by anyone, and they are the entire product
   of the run (85 items in one pass here). `notes-audit` solves the same risk with a reviewer stage. The
   cheap version would be a single cold Opus subagent receiving only the newly added items plus
   `_coverage-standard.md`, checking format, the one-concept rule, and interview anchoring.
