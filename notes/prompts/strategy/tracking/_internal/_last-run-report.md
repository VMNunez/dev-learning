# Pipeline self-report — progress-update

**Date:** 2026-07-16 · **Target:** `MODE = active` — project 07-timetrack, plus SQL (Step B) and simulations (Step C)

**Status:** applied — both Verdict findings are spent. (b) Step F's "lives on `main`" was corrected as
REC-003. (a) D2's Java-section trigger no longer exists: `fad2ec5` deleted the per-technology concept
sections on 2026-08-03 and the 2026-08-05 demotion (REC-039) turned D2 into a tombstone. *(This line
was missing until 2026-08-05 — `_pipeline-self-report.md` requires it and this prompt's own step 0
reads it, so its absence made every run-start check unresolvable. Backfilled from the report's own
content; the five bullets below are unchanged and remain the immutable record of that run.)*

1. **Plan vs reality** — split was right-sized: one project subagent + one SQL subagent, simulations read directly by the orchestrator; in `MODE = active` the parallel-launch instruction is moot but harmless.
2. **Report discipline** — both subagents returned exactly the contracted items (format/status/concept table; topic rows) with no excerpts, dumps, or reasoning trace; nothing had to be trimmed.
3. **Failures & retries** — none; no subagent failed or needed re-dispatch, and the SQL zero-file guard never tripped (both files found on `main`).
4. **Rule friction** — two points. (a) D2's Java-section trigger is gated on a concept *needing* the section, but the subagent tagged two concepts Java whose content already sits in Spring Boot; the gate reads as not firing, leaving pre-existing pure-Java entries in Spring Boot indefinitely — the prompt does not say when that cleanup is ever due. (b) Step F says PROGRESS.md "lives on `main`", which contradicts CLAUDE.md's 2026-07-14 rule that study materials commit on the active branch; committed on the active branch per CLAUDE.md.
5. **Verdict** — change worth considering: Step F's "lives on `main`" line is stale against the 2026-07-14 branch rule and should be reworded; D2's Java-section trigger condition is worth clarifying.
