# Coverage Audit Prompt

Use in a **separate conversation**. No configuration needed — paste everything into a new chat and run.

Use this prompt to audit `notes/coverage.md` for completeness, detect missing topics, and ensure every section reflects what Spanish consultancies actually test in 2026.

> **▶ Run first:** `coverage-prompt` for every topic — this is the global convergence pass; run it once each topic already has its own `coverage.md`.

**When to run:**
- After all individual `{topic}/coverage.md` files have been created with `coverage-prompt.md`
- After completing a major project (08, 09...) when scope may have expanded
- When you suspect a topic is missing or a section is thin

**When NOT to run:**
- As an intermediate step while iterating with `coverage-prompt.md`
- Just because you ran `coverage-prompt.md` — that does not require a global audit

**Goal:** reach a stable `notes/coverage.md` in as few iterations as possible. This prompt is the convergence step, not a recurring cycle. After a successful run, `notes/coverage.md` is the definitive source of truth — re-run only if scope changes significantly.

---

## Context — read first

Read two files before anything else:
- `notes/prompts/knowledge/coverage/_coverage-standard.md` — **the standard: what a good coverage.md contains**
  (scope logic, the three item types, confusable pairs, the AI factor, item/file format). Every
  content and quality check this audit applies is defined there — this prompt only adds the *global
  convergence flow* (topic completeness, cross-topic consistency, stability) on top.
- `notes/prompts/_shared-context.md` — my profile, the **Spanish job market 2026**, and the **AI
  factor 2026**.

This audit decides what belongs in coverage based entirely on what the job requires — the target
(role, companies, deadline) comes from ROADMAP + `_shared-context`, never from a value baked into
this prompt. Projects and notes are vehicles to reach the objective — they do not define scope.

Also read `notes/prompts/_job-market-evidence.md` — real postings from the target companies. When it
has evidence, its Synthesis is a **required floor**: every recurring requirement must map to coverage
somewhere. The **adversarial interviewer pass** (a cold subagent writes the 12 questions it would ask
and reports the gaps) is not optional or per-doubt here — it runs for every topic as **Analyst C** in
the per-topic loop (see the Execution model), the fastest way to prove a section is complete rather than
assume it.

(CLAUDE.md and ROADMAP.md are read in Step 1.)

---

## Execution model — read-only analysts, one concern each; the orchestrator is the only editor

Do **not** audit all twelve topic sections in a single context, and do **not** let any one subagent do
more than one thing. Two failures to avoid, both of which degrade quality:
- **Whole-file passes** — loading all of `coverage.md` and deep-checking every section in one context is
  the failure Victor caught in the notes flow: attention degrades toward the end and the last topics get
  a shallow skim. Every item in every section deserves the scrutiny the first one gets.
- **Multi-concern subagents** — a subagent asked to judge market-fit *and* internal quality *and* then
  edit files splits its attention three ways and does none of them deeply. One subagent, one concern,
  one deliverable.

So the work is split two ways at once — **by topic** and **by concern** — under a strict role divide:

**Analysts (cold `general-purpose` subagents) — read-only, one concern, return a list. Never edit any
file.** For each topic, dispatch three analysts, each given exactly one topic and one job:

| Analyst | Concern | Mandate | Returns |
|---------|---------|---------|---------|
| **A — Market-fit** | Step 2b | Does coverage meet what the market asks for this topic? | Gap list: recurring requirement (with freq) → the item it needs, in the standard's format, tagged by section. Plus over-coverage flags. |
| **B — Internal quality** | Step 3 | Does each existing item pass the standard's quality bar? | Gap list: missing item type, missing confusable-pair side, dictionary-definition rewrites, AI-exploitable gaps — each as a proposed item/edit, tagged by section. Plus an **item-by-item trace** (every current item listed PASS or change) as proof it read the whole section. |
| **C — Adversarial interviewer** | Step 4a | Would a real interviewer find a hole? | Gap list: of the 12 questions it would ask, the ones coverage does NOT support, each as a proposed item tagged by section. |

Rules for the analyst split:
- **One topic per analyst, one concern per analyst.** Never hand a subagent two topics or two concerns,
  even at higher token cost — deep, atomic passes are the standard, the same rule the notes audit
  enforces file-by-file. Three analysts × twelve topics is expected and fine.
- Each analyst reads only what its concern needs: its own topic's section in `notes/coverage.md`, that
  topic's `notes/{topic}/coverage.md` + `future-learning.md`, `_coverage-standard.md`, and (A and C) the
  evidence Synthesis. Nothing else.
- **Analysts do not touch files.** They return findings only. If an analyst edits a file, the run is wrong.

**The orchestrator (this context) is the only editor, and does only the global, structural, whole-file
work**, which genuinely needs a cross-topic view but is light: Step 1 (read state + pre-audit sync),
Step 2 (topic completeness — is a whole folder missing), Step 4 (cross-topic duplicate/misplacement/scope
scan), and the final Step 5 sync-verify + Step 6 summary/commit. It also **consolidates and applies** each
topic's three analyst gap-lists (Step 5).

**Per-topic loop (sequential, one topic fully done before the next):**
1. Dispatch Analyst A, then B, then C for the topic (`run_in_background: false`). Collect their three lists.
2. Consolidate: merge the three lists, drop duplicates, discard any gap that is out of junior scope
   (record those in the summary as "analyst-suggested, left out — reason").
3. Apply the surviving gaps to `notes/{topic}/coverage.md` and its section in `notes/coverage.md`, sync
   the two, and update `future-learning.md` if anything was promoted/demoted.
4. Move to the next topic.

Doing one topic end-to-end keeps the orchestrator's editing context small (one section at a time) and
each commit-ready, without any analyst ever holding more than a single concern.

---

## What notes/coverage.md is

`notes/coverage.md` is the combined file that mirrors all topic `coverage.md` files in one place. It is the **single source of truth** for everything Victor must learn across all topics.

Structure:
- One `## {TOPIC}` section per topic, in study-priority order: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General
- Each section is an exact copy of `notes/{topic}/coverage.md` with heading levels shifted by one (`#` → `##`, `##` → `###`)

**Sync rule — always bidirectional:**
Any change to `notes/coverage.md` must immediately be reflected in the corresponding `notes/{topic}/coverage.md`, and vice versa. The two files must never drift apart. After every edit, re-read both sides and confirm they match exactly — only heading levels should differ.

---

## Step 1 — Read the system state

Read these files before making any decision:

1. `notes/coverage.md` — the primary input
2. `CLAUDE.md` — learning objectives and notes folder structure (profile and market are in
   `notes/prompts/_shared-context.md`, read above)
3. `ROADMAP.md` — current phase, what is in progress, what is post-junior scope

Then list all existing subdirectories under `notes/` (excluding `interview-prep/`, `prompts/`). These are the current topic folders.

**Pre-audit sync check:**
For each topic folder found, read `notes/{topic}/coverage.md` (if it exists) and compare it to its corresponding section in `notes/coverage.md`. If they differ, `notes/{topic}/coverage.md` is the authoritative source — correct `notes/coverage.md` to match, applying the heading level transformation (topic `#` → `##`, topic `##` → `###`). Note any corrections in the final summary under "Sync corrections (pre-audit)".

---

## Step 2 — Audit topic completeness

Compare the current topic folders against what Victor's objective requires.

**Criteria for a topic to deserve its own folder:**
- Has enough distinct concepts for 5+ coverage items that cannot fit naturally in an existing topic
- Has its own category of interview questions at Spanish consultancies (interviewers ask about it as a distinct area, not just as a subtopic of something else)
- Is distinct enough from existing topics that merging would confuse the learning

**Questions to answer:**

Is **Testing** missing as a dedicated topic? At project 07 onwards, JUnit 5 + Mockito (backend) and Jasmine + TestBed (frontend) are permanent requirements. Apply the three criteria above. Testing has its own distinct interview questions at Spanish consultancies ("how do you write a unit test?", "what is Mockito?", "how does TestBed work?"), has well over 5 distinct coverage items (JUnit 5 structure, Mockito mocking, meaningful assertions, TestBed setup, integration vs unit test), and is clearly separate from `notes/general/`. It almost certainly meets all three criteria — confirm and, if so, create `notes/testing/`. If created, place it after the Security section in `notes/coverage.md`.

Is **Docker** missing as a topic? Victor uses Docker Compose in project 07. Decide: is there enough junior-level content for a dedicated `notes/docker/` folder (5+ distinct coverage items), or do the relevant concepts belong in `notes/architecture/` or `notes/general/`? If created, place it after the General section in `notes/coverage.md` (last in the order).

Are there any other topics that a Spanish consultancy would interview a junior Angular + Spring Boot developer about that are not represented in the current folder structure?

**If a topic is identified as missing and meets the criteria for its own folder:**
1. Create `notes/{topic}/coverage.md` following the same format rules as `coverage-prompt.md` Step 5 — every item must be interview-anchored, one concept per item, sections named specifically
2. Create `notes/{topic}/future-learning.md` with a short intro line and at least one `## Phase` section grouping post-junior concepts by when they become relevant (during the job, 6–12 months in, senior level)
3. Do NOT create note files (the numbered `01-...` files) — those are written in separate guided sessions
4. Add the new section to `notes/coverage.md` in study-priority order, with a `---` separator before and after. Apply the heading level transformation: `# Minimum Coverage — {TOPIC}` becomes `## {TOPIC}`, and each `## Section name` in the source becomes `### Section name` in `notes/coverage.md`
5. **Register the new topic across the machinery — otherwise coverage names it but nothing downstream builds it.** A coverage file with no home in the rest of the system produces notes and Q&A for a topic no other prompt knows exists. Flag each of these in the final summary under "New-topic registration needed" (Victor applies the ones outside this prompt's scope, since they touch prompts this audit does not own):
   - **CLAUDE.md** — add the topic to the `notes/` subfolders list (with its `next file:` counter) and, if it is study-relevant, to the 13:30 notes study order.
   - **notes-audit / notes-plan** — add the topic to the `TOPIC` enum in both (the batch order lives in notes-audit only; notes-plan never runs batched).
   - **interview-prep-audit / interview-prep-write** — if the topic gets its own Q&A file, add it to the `FILE` enum and the batch order; if it folds into an existing file (like Angular Material into `angular.md`), note that routing instead.
   - **notes-and-interview-prep** — add it to the `TOPIC`/`FILE`/`NOTES_PATH` config and batch order.
   - **simulator** — add its interview-prep file to the full-mode source list if it should appear in a mock interview.
   Do NOT edit those prompt files from this audit — only create the coverage/future-learning files and the `notes/coverage.md` section here, and list the registration edits for Victor. This keeps the coverage audit's own commit atomic.

**If a concept belongs under an existing topic instead:**
Add it to the correct section in that topic's coverage, and sync to `notes/coverage.md`.

---

## Step 2b — Analyst A's mandate: market-fit (deep analysis first, evidence as the sharpening floor)

This is the single concern of **Analyst A**, run once per topic as a read-only cold subagent. It comes
**before** the finer per-section audit: coverage must first meet what the market actually asks, then
expand — the priority order defined in `_coverage-standard.md` ("cover the market first, then expand").
This is the step that operationalises the "required floor" principle instead of leaving it to memory.

Analyst A **returns a gap list** and edits nothing — the orchestrator applies the surviving gaps in the
per-topic loop. "Add", "sharpen", "flag" below mean *propose in the returned list*, not write to a file.

**Lead with the deep analysis — it is the primary input, not the evidence.** Per `_coverage-standard.md`
("Two sources"), the backbone is a full reasoning of what a junior for the target role and companies must
know, backed by a live web search of current Spanish junior postings when possible. Run that analysis for
every section (Step 3's checks plus the completeness test) as the **primary floor**, regardless of how many
postings are on file. The evidence below then **complements and sharpens** it — adding hard frequency and
the market's exact wording — and overrides it only on a concrete point where the two actually conflict.

Then read the **Synthesis** in `notes/prompts/_job-market-evidence.md`. For **each recurring requirement**
(with its frequency, e.g. `Docker ~3/8`, `Java ~8/8`):

1. **Gap → add.** Find the coverage item(s) it maps to. If a recurring requirement has no item — or only
   a thin/vague one — add or sharpen the item in the right topic section and sync to
   `notes/{topic}/coverage.md`. Priority scales with frequency: a `~8/8` requirement missing from
   coverage is a serious defect; a `~3/8` one is still required but lower urgency.
2. **Over-coverage → flag, don't cut yet.** Note any coverage item that no posting supports **and** is
   not an interview fundamental the postings under-list. Do not delete it here for that reason alone
   (the standard's "raises the floor, does not lower the ceiling" rule) — list it as a demotion
   candidate for the Step 4 scope check to judge.
3. **Signals to watch → keep out.** A requirement in the evidence's "Signals to watch" list (senior-ish:
   Kafka, Spring Cloud, Spring Batch, NgRx…) is **not** a junior floor — do not force it into coverage.

Remember the evidence is a **small, partial sample**, so it only raises the floor set by the analysis,
never lowers it: a requirement's *absence* from the file is not proof a junior does not need it. In the
summary, note whether each market-fit change came from the deep analysis, from real evidence, or from both.

---

## Step 3 — Analyst B's mandate: internal quality of each item

This is the single concern of **Analyst B**, run once per topic as a read-only cold subagent, on that
one topic's section. Analyst B **returns a gap list plus the item-by-item trace** and edits nothing —
the orchestrator applies the surviving gaps in the per-topic loop.

Apply the **content and quality checks defined in `_coverage-standard.md`** — do not restate them, run them:
- **Three item types** present (conceptual / decision / pressure) — add the missing type.
- **Confusable pairs** — both sides present as separate items.
- **Item quality** — each item is interview-anchored, not a dictionary definition; fix any that read
  like one.
- **One concept per item** — split any grouped bullet.

Plus one audit-specific check the standard doesn't cover, because it only makes sense across a whole
finished coverage file:

**AI-exploitable gaps** — are there concepts AI generates commonly but a junior would struggle to
explain? These are high-priority to have in coverage. Focus on: the "why" behind decisions (why JWT,
why DTOs, why soft delete, why coordinator pattern); layer-placement rules (controller vs service vs
repository); transaction behaviour and edge cases; security implications of common patterns;
annotation-placement rules and what breaks when they are wrong.

---

## Step 4 — Cross-topic consistency

Before applying changes, scan across all sections of `notes/coverage.md`:

**Duplicate detection:**
If the same concept appears in two sections (e.g. "service layer" in both Architecture and Spring Boot), keep it in the topic where an interviewer is most likely to ask it. Remove it from the other. Note the overlap in the final summary.

**Misplaced items:**
If a concept is in the wrong topic (e.g. a TypeScript-specific item sitting in JavaScript, or a REST concept sitting in Spring Boot when it belongs in Architecture), move it to the correct section and update both files.

**Scope check:**
If any item in an existing section is clearly post-junior (too advanced for a junior screening, belongs to mid-level architecture or senior performance work), demote it to `notes/{topic}/future-learning.md` and remove it from coverage.

**Future-learning promotion check:**
For each `notes/{topic}/future-learning.md` corresponding to a section you reviewed: are any concepts listed there now in scope for the job target read from ROADMAP + `_shared-context` (role, deadline)? Apply the same criteria from Step 3. If yes: add the concept to the correct section in `notes/coverage.md` and the corresponding `notes/{topic}/coverage.md`, and remove it from `future-learning.md`. Also: if any entry in `future-learning.md` is no longer relevant at all — wrong topic, outdated, or not needed in any future phase — delete it entirely. Do not move it anywhere; simply remove it.

---

## Step 5 — Orchestrator applies the consolidated changes

The orchestrator (this context) is the only editor. Apply every change directly to the files: the
orchestrator's own findings from Step 2 (topic completeness) and Step 4 (cross-topic), plus each topic's
consolidated Analyst A/B/C gap-list from the per-topic loop (Steps 2b + 3 + 4a). Analysts never wrote
anything — everything they surfaced lands here.

**Files to update:**
- `notes/coverage.md` — the primary file
- Each `notes/{topic}/coverage.md` that was changed — must mirror its section in `notes/coverage.md` exactly (heading levels shifted back: `##` → `#`, `###` → `##`)
- Each `notes/{topic}/future-learning.md` that changed — received demoted items, had promoted items removed, or had entries deleted entirely

**Do NOT:**
- Reword bullets that are already correct — only touch what is new, wrong, restructured, or moved
- Create note files (the numbered `01-...` files)
- Remove items without a documented reason in the summary

**Sync verification — mandatory before Step 6:**
After all edits, re-read each modified section in `notes/coverage.md` and its corresponding `notes/{topic}/coverage.md` side by side. Confirm every bullet matches exactly — only heading levels differ. If anything differs, fix it now.

---

## Step 6 — Declare stability and output summary

Print the summary:

| Change | Detail |
|--------|--------|
| Sync corrections (pre-audit) | [topic — what differed] |
| New topic folders created | [list or "none"] |
| New-topic registration needed | [per new folder: the CLAUDE.md / notes-audit / interview-prep / simulator edits Victor must apply, or "none"] |
| Market-fit gaps filled | [topic — recurring requirement (freq) that had no/thin item] |
| Over-coverage demotion candidates | [item — no posting supports it, not a fundamental] |
| Sections with gaps filled | [topic — what was added] |
| Items split (grouped → atomic) | [list or "none"] |
| Items moved between topics | [concept — from → to] |
| Items fixed (definition → interview-anchored) | [list or "none"] |
| Items promoted from future-learning | [topic — concept] |
| Items demoted to future-learning | [item — reason] |
| Items removed from future-learning | [item — reason it was deleted entirely] |
| Sync verified | [yes — all topic files match notes/coverage.md] |

Then answer explicitly:

**Is notes/coverage.md now stable?**

Stable means: every topic for Victor's objective is represented, every section has the three types (conceptual / decision / pressure), every confusable pair has both sides, and no item is a dictionary definition.

- If **stable**: "notes/coverage.md is stable. Re-run this audit only if: a new topic folder is added, a new project introduces scope not yet covered, or the job objective changes significantly."
- If **not stable**: list what remains and why it could not be fixed in this pass (e.g. a section needed more than 5 new items and you split the work). Be specific about what the next run must address.

---

## Execution

Apply all changes directly to the files. Do not describe what you would write — write it.

Then show the commit message so Victor can run it himself. Always use this format — one command per code block:

```
git add <all files changed>
```

```
git commit -m "docs: global coverage audit — <one line summary of main changes>"
```
