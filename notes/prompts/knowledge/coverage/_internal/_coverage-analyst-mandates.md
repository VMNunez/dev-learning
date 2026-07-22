# Coverage-audit analyst mandates — A, B, C, D

**Internal component. Not runnable on its own.** These are the four read-only mandates the
`coverage-audit-prompt.md` orchestrator dispatches. Each analyst is a cold `general-purpose` subagent
given exactly one topic (A, B, C) or the whole file (D), one concern, and this file's matching section.
They live here rather than in the orchestrator so the orchestrator's own context stays light — it points
each dispatch at its section and holds only the flow. The role divide, model policy, and per-topic loop
are all in the orchestrator's "Execution model" section; this file is only the mandates themselves.

Every analyst is **read-only** — it returns a list and never edits a file. Every whole-file read must
state "N lines, read to EOF" (the Read tool truncates silently at 2000 lines and `notes/coverage.md` is
well past that). Reports are bounded: the list(s) plus proof lines, no narrative.

---

## Analyst A — market-fit (Step 2b)

Run once per topic. Analyst A **returns a gap list** and edits nothing; the orchestrator applies the
survivors. "Add", "sharpen", "flag" below mean *propose in the returned list*, not write to a file.
Inputs: this topic's `notes/{topic}/coverage.md` (the section under audit) and its `future-learning.md`,
`_coverage-standard.md`, and the evidence Synthesis in `notes/prompts/_job-market-evidence.md`.

Market-fit comes **before** the finer per-section audit: coverage must first meet what the market asks,
then expand — the priority order in `_coverage-standard.md` ("cover the market first, then expand").

**Lead with the deep analysis — it is the primary input, not the evidence.** Per `_coverage-standard.md`
("Two sources"), the backbone is a full reasoning of what a junior for the target role and companies must
know, backed by a live web search of current Spanish junior postings when possible. Run that analysis for
every section — including Analyst B's quality checks and a completeness test — as the **primary floor**,
regardless of how many postings are on file. The evidence then
sharpens it — adding hard frequency and the market's exact wording — and overrides it only where the two
actually conflict on a concrete point.

Then read the **Synthesis** in `notes/prompts/_job-market-evidence.md`. For **each recurring requirement**
(with its frequency, e.g. `Docker ~3/8`, `Java ~8/8`):

1. **Gap → add.** Find the coverage item(s) it maps to. If a recurring requirement has no item, or only
   a thin one, add or sharpen it in the right topic section. Priority scales with frequency: a `~8/8`
   requirement missing is a serious defect; a `~3/8` one is required but lower urgency.
2. **Over-coverage → flag, don't cut.** Note any item no posting supports *and* that is not an interview
   fundamental the postings under-list; list it as a demotion candidate for Analyst D to judge, never
   delete it here (the standard's "raises the floor, does not lower the ceiling" rule).
3. **Signals to watch → keep out.** A requirement in the evidence's "Signals to watch" list (Kafka,
   Spring Cloud, Spring Batch, NgRx…) is senior-ish, not a junior floor — do not force it in.

The evidence is a small, partial sample, so a requirement's *absence* from it is not proof a junior does
not need it. In the returned list, note whether each change came from the analysis, from evidence, or both.

---

## Analyst B — internal quality of each item (Step 3)

Run once per topic, on that one topic's section (`notes/{topic}/coverage.md`), with `_coverage-standard.md`
as the rulebook. Analyst B **returns a gap list plus an item-by-item trace** (every current item marked
PASS or with the change needed — the proof it read the whole section) and edits nothing.

Apply the content and quality checks defined in `_coverage-standard.md` — do not restate them, run them:
- **Three item types** present (conceptual / decision / pressure) — propose the missing type.
- **Confusable pairs** — both sides present as separate items.
- **Item quality** — each item is interview-anchored, not a dictionary definition; rewrite any that reads
  like one.
- **One concept per item** — split any grouped bullet.

Plus one audit-specific check the standard does not cover: **AI-exploitable gaps** — concepts AI generates
commonly but a junior would struggle to explain. High priority to have in coverage. Focus on the "why"
behind decisions (why JWT, why DTOs, why soft delete, why coordinator); layer-placement rules (controller
vs service vs repository); transaction behaviour and edge cases; security implications of common patterns;
annotation-placement rules and what breaks when they are wrong.

---

## Analyst C — adversarial interviewer (Step 4a)

Run once per topic on `model: opus` — this is the deepest reasoning in the audit and proves a section
complete rather than assuming it. Analyst C **returns a gap list** and edits nothing.

You are a senior technical interviewer at one of the target consultancies (read `ROADMAP.md` and
`notes/prompts/_shared-context.md` for the exact role/companies, and `notes/prompts/_job-market-evidence.md`
for what they hire for). You are screening a candidate at the target level and the topic is {TOPIC}. Read
that topic's `notes/{topic}/coverage.md` (and its section in `notes/coverage.md` if the topic file is
missing) plus `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`.

Write the questions you would actually ask to decide whether this candidate really knows {TOPIC} — **as
many as you genuinely would use; do not stop at a fixed number, be exhaustive.** A capped interviewer
finds only the gaps that fit its question budget (a real run returned 13 gaps and looked convergent while
uncapped angles found 80+ more). "Uncapped" governs the *number of questions*, not the size of the report:
keep each question a terse one-liner and put the substance in the gap items, or a report that overruns the
tool's inline limit has to be recovered from a persisted file before it can be used.

Mix conceptual, decision ("why X over Y"), and pressure/gotcha questions, and lean on the recurring
requirements in the job-market evidence. For each question, check whether the current coverage gives the
candidate what they'd need to answer it. Return only the **gaps** — the questions coverage does NOT
support — each as a proposed item in the standard's format (`concept — interview-anchored sentence`),
tagged with its section. Do not rewrite existing items. Be adversarial: assume the coverage is incomplete
until your questions prove otherwise.

---

## Analyst D — cross-topic consistency (Step 4)

Run **once**, `model: sonnet`, over the whole of `notes/coverage.md` after the per-topic loop.
Cross-topic consistency cannot be judged one section at a time — a duplicate lives in two sections at
once — so D is the one analyst with a global view. It holds exactly one concern and **returns three
lists, editing nothing**; the orchestrator applies the survivors.

Dispatch it with this brief:

> You are auditing `notes/coverage.md` for cross-topic consistency only — not market-fit, not item
> quality, not interview holes (other analysts own those). Read the whole `notes/coverage.md`, the
> `future-learning.md` of each topic folder, and
> `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`. The section order is Angular → Angular
> Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git →
> General. Return exactly three lists, nothing else:
> 1. **Duplicates** — the same concept in two sections (e.g. "service layer" in both Architecture and
>    Spring Boot). For each: the concept, the two sections, and which should keep it (the one an
>    interviewer is most likely to ask it in) — the other is removed.
> 2. **Misplaced items** — a concept in the wrong topic (a TypeScript-specific item under JavaScript, a
>    REST concept under Spring Boot that belongs in Architecture). For each: `concept — from → to`.
> 3. **Scope-demotion candidates** — items clearly post-junior for the target role (mid-level
>    architecture, senior performance work). For each: `item — one-line why it is post-junior`. Read
>    ROADMAP.md and `notes/prompts/_shared-context.md` for the target level.
> Do not edit any file. Before reading `notes/coverage.md`, run `wc -l` on it — it is far past the Read
> tool's silent 2000-line truncation limit (3900+ lines), so one Read call returns roughly half and the
> tail topics would be invisible to you. Read it in several `offset` passes to the real last line and
> state "N lines, read to EOF"; a report covering only the first 2000 lines is a failed pass. Return
> only the three lists plus that line.
