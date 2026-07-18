# Coverage prompt — last run self-report

**Date:** 2026-07-18 · **Target:** TOPIC = Angular, NOTES_PATH = notes/angular/ · **Branch:** `fix/backend-backlog` · **Commit:** `7ba9dbc`

1. **Plan vs reality** — The split held. Coverage was mature (163 lines), so the parallel ordering applied:
   the five angles ran **alongside the Step 2 market analyst** and were consolidated in one pass. The angle
   set was adapted per the prompt's instruction: output-prediction dropped (framework topic, where it is
   optional) and a **testing angle** added, which the configuration block's "testing is always in scope for
   Angular" line mandates. That added angle was by far the highest-yield of the five — it alone returned
   ~31 gaps and took the Testing block from 7 items to four sections totalling 40. Treating it as covered
   by the generic angles would have left the topic's single biggest differentiator thin.
   **Sizing was the one real miss:** the run took a 163-line file to 285 lines and 18 sections to 29, with
   11 original sections split or restructured. Step 4's "restructuring is allowed — and expected" authorises
   this, but at this volume the file was effectively rewritten rather than patched, which makes the diff
   hard to review bullet-by-bullet. The growth is defensible (223 items, all job-anchored), but per the
   "Size delta is reported, never acted on" rule the scheduling consequence is Victor's call, not the run's.

2. **Report discipline** — Clean. All six subagents returned bounded lists with proof lines ("163 lines,
   read to EOF" ×5; the analyst declared its search status and frequency signal). Nothing had to be trimmed
   or discarded. The analyst correctly reported the low-frequency signal (Angular named in **3 of 8**
   postings, always paired with Java, never as a pure-Angular junior role) and shifted its weight to
   interview norms rather than padding the list with generic stack requirements.

3. **Failures & retries** — **One, and it matters.** The Step 4b reviewer returned a plausible, well-argued
   defect list ending "74 items reviewed" — against **96** sent. The failure protocol worked exactly as
   written: re-dispatched once naming the miscount, and the second pass returned the corrected count plus
   **additional defects in sections the first pass had silently skipped** (Service layer and HTTP, Routing,
   RxJS Interop). This is the strongest evidence so far that the count line earns its keep: the first report
   showed no sign of being partial — no error, no truncation, just a short number at the bottom — and
   without the arithmetic check ~22 newly-written items would have shipped unreviewed.

4. **Rule friction and rule breaches** —
   - **Friction (real, worth a prompt change): Step 4b's scope makes it structurally unable to judge
     section size, yet it is asked to apply a standard that includes the 3-item minimum.** Its second pass
     flagged six sections as "under-filled" — Signals "2 items", Template syntax "1 item", Services and DI
     "2 items" — when those sections actually hold **10, 10 and 6**. It was measuring the *excerpt it was
     sent*, not the file, which is the direct and predictable consequence of the (correct) rule that it
     receives only the new items. All six flags were rejected against the mechanical count. The narrow
     scope should stay — it is what keeps the step cheap — but the brief should state that **section-size
     and file-completeness checks are out of its scope**, so it stops emitting false positives the
     generator must catch by hand. Note this is a *new* friction: it did not surface on the TypeScript run
     because that run's new items happened to cover most of each section.
   - *Cross-topic overlap check: did heavy work again, as the prompt predicts for foundational topics.*
     Angular sits *above* JavaScript/TypeScript and *beside* Security/General, and the discards reflect
     that: `npm ci`/lockfile/`node_modules` (owned by TypeScript), `.gitignore` (Git), Swagger generation
     (Spring Boot), `[innerHTML]`/XSS (Security — which already owns the Angular-specific exception),
     401 vs 403 (Security/General/Architecture), AAA + unit-vs-integration + test pyramid (Spring Boot,
     General), source maps (JavaScript). One grep over the 2116-line file sufficed; no re-read.
   - *Routing produced two genuine handoffs, not just mentions.* Two proposed gaps were owned elsewhere
     **and absent from the owner**, so both were written to `_cross-topic-inbox.md`: the CORS-blocked
     `status 0` symptom (Security — which owns CORS and preflight but not this symptom) and the
     consumer-side OpenAPI contract (Spring Boot — which owns springdoc from the producer side only).
     The distinction the prompt draws between "already covered there" (mention only) and "owned but
     missing" (write it down) was load-bearing here and easy to blur.
   - *The inbox closed its first full loop.* All four Angular entries filed by the TypeScript run were
     consumed and **all four added** — `strictTemplates`, AOT vs JIT, the `ng build` type-check, and typed
     `FormGroup<T>`. Three of the five angles independently rediscovered the first three, which corroborates
     them; but typed reactive forms surfaced only from the design angle, so the inbox genuinely carried an
     item this run might otherwise have filed thinner. The mechanism works.
   - *Structural check earned its keep again, in the specific way the last run predicted.* First count:
     all 29 sections within 3–12. Then applying the reviewer's `tick()`/`flush()`/`flushMicrotasks()` split
     pushed "Testing components and async" to **13** — the exact cap collision the TypeScript run added
     guidance for. That guidance resolved it cleanly and without improvisation this time: relocate the
     least-central item (moved "Testing a service vs testing a component" into "Testing — setup and
     mechanics", where it files better). **The recount is what caught it**, confirming the rule added off
     the last run was correct to make it mandatory rather than incidental.
   - *Breaches:* none. Both step-0 guards ran (branch `fix/backend-backlog`, not `main`; generator confirmed
     on Opus before Step 1). Model policy honoured — analyst on `sonnet`, all five angles and the 4b reviewer
     on `opus`. Sync verified programmatically (`diff` of the mirrored section against the topic file — 223
     items both sides, zero mismatches) rather than by reading the now-**2238-line** combined file, and the
     Windows encoding hazard was avoided by rebuilding through bash/awk rather than PowerShell `Set-Content`.
   - *Note for the next run:* `notes/coverage.md` is now **2238 lines**. Any Read-based whole-file pass must
     use `offset`; this run processed it programmatically throughout.

5. **Verdict** — Change worth considering: **tell the Step 4b reviewer that section-size and completeness
   checks are outside its scope**, since it only ever sees an excerpt — this run cost six false "under-filled"
   flags that had to be individually rejected against the count. Otherwise the pipeline ran clean, and two
   mechanisms proved themselves on real failures: the 4b count line caught a silent partial review, and the
   cross-topic inbox closed its first loop with an item no angle would have recovered on its own.
