# Coverage prompt — last run self-report

**Date:** 2026-07-18 · **Target:** TOPIC = Java, NOTES_PATH = notes/java/ · **Branch:** `fix/backend-backlog`

1. **Plan vs reality** — The split held. Java's coverage was mature (137 lines), so the conditional
   ordering added after the Angular Material run applied for the first time: the four angles ran **in
   parallel with the Step 2 market analyst**, judged against the existing file, and everything
   consolidated in one pass. It saved a full sequential leg with no loss — the angles never needed the
   new items, exactly as the prompt predicts. Angle yield was uneven but not wasted: live-code-review
   and debugging produced the densest Java-owned gaps, while design and take-home returned mostly
   material owned by Spring Boot or Architecture (see bullet 4).
2. **Report discipline** — Clean. All five subagents returned only the required gap list / OUT list /
   proof line ("137 lines, read to EOF", "138 lines, read to EOF"). The market analyst declared the
   live web search ran and reported the frequency signal (Java in 8/8 postings on file, but named only
   as a stack keyword — no posting itemises language-level scope, which it flagged explicitly rather
   than padding). Nothing trimmed or discarded.
3. **Failures & retries** — None. All five passed the acceptance check on first dispatch.
4. **Rule friction and rule breaches** —
   - *Confirmation, not friction:* the **cross-topic overlap check did most of the work this run** —
     roughly half of all proposed gaps were already owned elsewhere (Spring Boot: proxy/self-invocation,
     `@Data` on an entity, Lombok as a compile-time processor, stack-trace and `Caused by:` reading,
     `OutOfMemoryError`, `application.properties`, the Maven wrapper, `~/.m2`, every test-quality item;
     Architecture/General: layering, DTO-vs-entity, swallowed exceptions). Having the check *before*
     writing — the change made after the Angular Material run — paid off exactly as intended; nothing
     was written and mirrored only to be removed.
   - *Friction (minor, real):* the existing "Control flow" section had **2 items**, below the
     standard's merge floor. The structural check surfaces this but offers no clean home, since no
     adjacent section could absorb it without breaking semantics. Resolved by **growing** it — renamed
     "Control flow and source structure" and folded in the new `package`/`import`/fully-qualified-name
     items. The prompt should say that an under-3 section may be grown with adjacent new concepts
     rather than merged across a semantic boundary.
   - *Breaches:* none. Branch guard ran (`fix/backend-backlog`, not `main`); the generator was confirmed
     on Opus before Step 1; all four angles on Opus, market analyst on Sonnet; the mechanical count
     check ran and forced four section splits (Exceptions → mechanics + "the ones you will actually
     hit"; Collections → choosing/using + ordering/identity/cost; Classes and objects → classes +
     object identity and immutable data); the sync was verified programmatically line-for-line rather
     than by eye.
   - *Pre-existing defect found and fixed:* `notes/coverage.md` was missing the `---` separator between
     the Spring Boot and Java sections. Not caused by this run — the section replacement preserved the
     boundary faithfully — but repaired while there.
5. **Verdict** — Pipeline clean; the three changes made after the Angular Material run all proved out
   on their first real use. One small change worth considering: Step 4's structural check should state
   that a section under 3 items may be **grown** with adjacent new concepts instead of merged, because
   forcing a merge across a semantic boundary is worse than either alternative.
