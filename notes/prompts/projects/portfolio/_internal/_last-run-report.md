# portfolio-audit — last run report

**Date:** 2026-09-27
**Target:** `PROJECT_PATH = projects/06-hr-portal`, `PORTFOLIO_SCOPE = full`, `DRY_RUN = false` (first bank for this project)
**Status:** clean

1. **Plan vs reality.** Five author/reviewer section pairs, the whole-bank scan, one translator and one `en/`-blind Spanish reviewer — 12 of 12 mandated dispatches ran. Every reviewer added questions or corrected factual claims (interceptor never fires, `ActivatedRoute` not `Router` in specs, wrong counts), so the cold pass did real work; the orchestrator's own whole-file checks (unique IDs 001–142, marker format, EN/ES per-section parity 55/30/25/20/12, identical ID and marker sequences) are the evidence beyond the traces. No step reads the finished English bank whole except the orchestrator's mechanical scan.
2. **Report discipline.** No code dumps; returns stayed within contract.
3. **Failures & retries.** The translator died at a model session limit (HTTP 429) with 28 of 142 questions on disk; the ladder's second rung (resume the same agent) completed it, and the translator reported it had not lost state. No ratio or parity retry was needed.
4. **Rule friction and rule breaches.** The Technical Decisions author skipped `_shared-context.md`, reading the dispatch's "read only this section's code area plus PLANNING.md" (the prompt's own wording, Phase 1a subagent A) as narrower than `_portfolio-write-prompt.md` Step 1; the other four authors read it. No rule breached by the orchestrator: `_session-rules.md` was read to EOF (two passes, 1,408 lines) before the first dispatch.
5. **Verdict.** Pipeline clean. The read-list friction is rejected on condition 3: its reviewer found the section at ratio 1.00 and nothing indicates a different output. The prompt is 1,035 lines, above the ~500-line smoke alarm; `## Single-project procedure` remains its largest section.

Breach log: no `fixed in` / `confirmed N/3` rows to rule on. `maps unaffected` — no prompt or skill changed. `map: verified — README.md portfolio interface row; _system-map.md §7 rows for project banks en/es, cv-bullets.md and the profile README`.
