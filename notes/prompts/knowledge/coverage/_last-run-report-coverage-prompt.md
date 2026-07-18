# Coverage prompt — last run self-report

**Date:** 2026-07-18 · **Target:** TOPIC = TypeScript, NOTES_PATH = notes/typescript/ · **Branch:** `fix/backend-backlog`

1. **Plan vs reality** — The split held. Coverage was mature (86 lines), so the parallel ordering applied:
   the five angles ran **alongside the Step 2 market analyst**, judged against the existing file, and were
   consolidated in one pass. The **mandatory output-prediction angle** (added to the prompt off the
   JavaScript run) justified its mandate on its first enforced outing: it was the sole source of
   narrowing-reset-inside-a-closure, `let` vs `const` widening, `void`-as-a-contextual-return-contract,
   excess property checks and numeric-enum reverse mapping. Angles 1, 3 and 4 converged hard on type
   erasure / strict mode / tsconfig — the convergence the stop rule describes — yet each still returned
   non-duplicate items, so no angle was redundant.

2. **Report discipline** — Clean. All six subagents returned bounded lists with proof lines ("86 lines,
   read to EOF" ×5; the analyst declared its search status). The analyst appended a short "bottom line"
   paragraph beyond the requested lists — harmless, kept for its frequency signal. Nothing discarded.

3. **Failures & retries** — None. Every acceptance check passed on first dispatch, including the Step 4b
   reviewer's "80 items reviewed" matching the count sent.

4. **Rule friction and rule breaches** —
   - **Step 4b's first real execution — it paid for itself.** The previous report flagged that the step
     had never run and that a reviewer reliably returning nothing would be cost without value. It returned
     **6 defects on 80 items, and all 6 were applied**: three one-concept violations the generator had
     written while believing it complied (a four-flag `noUnusedLocals`/`noUnusedParameters`/… bullet,
     `module` fused with `moduleResolution`, `extends` fused with the Angular config layout), one narrowing
     item conflating two distinct mechanisms, one item **misfiled** (literal widening under "Structural
     typing and assignability" when `as const` already owned widening), and one item that **restated the
     bullet directly above it**. Note the pattern: these are precisely the defects no *other* check in the
     pipeline looks for — the 4a angles audit the old file, the structural count only counts. The step
     should stay.
   - *Friction (real, unguided):* applying the reviewer's mandated splits pushed
     `## Narrowing and type guards` from 12 to **13** items — a reviewer-mandated split colliding with the
     structural 12-item cap. **The prompt does not say which wins.** Resolved by relocating the
     `catch (e: unknown)` item to `## Modelling domain state and errors`, where it files better anyway; but
     that was an unguided judgement call, and a weaker run would have either ignored the split or blown
     the cap.
   - *Cross-topic overlap check:* did real work again, as predicted for topics sitting under others.
     Routed out to **Angular**: `strictTemplates` / template type-checking, AOT compilation, the `ng build`
     type-check pipeline, and typed reactive forms (`FormGroup<T>`) — all Angular-owned and currently
     *absent* from Angular's coverage, so they are a genuine gap in that file, not duplicates. Also left
     with their owners: OpenAPI/Swagger generation (Spring Boot), ISO-8601 parsing (JavaScript), custom
     error classes and `this`-binding-in-callbacks (JavaScript), Java's own type erasure (Java). One grep
     over `notes/coverage.md` sufficed — no re-read of the now-2116-line file.
   - *Structural check earned its keep:* the mechanical count confirmed all 19 sections within 3–12 both
     before and after the 4b fixes; without the recount after applying fixes, the 13-item overflow above
     would have shipped unnoticed.
   - *Search limitation (recurring, not a failure):* the analyst's live web search ran but surfaced no
     quotable Spanish postings — listing pages don't expose "Requisitos" text in snippets — so its
     frequency signal leaned on `_job-market-evidence.md`. TypeScript is explicitly named in only ~1 of 8
     postings there (absorbed into "Angular"), so it correctly shifted weight to interview norms.
   - *Breaches:* none. Branch guard ran (`fix/backend-backlog`, not `main`); generator confirmed on Opus
     before Step 1; all five angles + the 4b reviewer on Opus, analyst on Sonnet; the sync was verified
     programmatically (`diff` on bullets and headings — 0 mismatches) rather than by eye, and the Windows
     encoding hazard was avoided by rebuilding through bash/awk instead of PowerShell `Set-Content`.
   - *Note for the next run:* `notes/coverage.md` is now **2116 lines**, well past the truncation
     threshold. Any Read-based whole-file pass must use `offset`; this run processed it programmatically.

5. **Verdict** — Change worth considering: **add one line to Step 4b's consolidation** telling the
   generator what to do when applying a reviewer's split pushes a section past the 12-item cap — prefer
   relocating the least-central item to a semantically honest section (as done here), and split the
   section only when no such home exists. Everything else: pipeline clean, and Step 4b is confirmed
   worth keeping.
