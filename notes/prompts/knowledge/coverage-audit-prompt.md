# Coverage Audit Prompt

Use in a **separate conversation**. No configuration needed — paste everything into a new chat and run.

Use this prompt to audit `notes/coverage.md` for completeness, detect missing topics, and ensure every section reflects what Spanish consultancies actually test in 2026.

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
- `notes/prompts/knowledge/_coverage-standard.md` — **the standard: what a good coverage.md contains**
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
somewhere. For any section you are unsure is complete, run the **adversarial interviewer pass** from
`coverage-prompt.md` Step 4a on that topic (a cold subagent writes the 12 questions it would ask and
reports the gaps) — it is the fastest way to prove a section is complete rather than assume it.

(CLAUDE.md and ROADMAP.md are read in Step 1.)

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

**If a concept belongs under an existing topic instead:**
Add it to the correct section in that topic's coverage, and sync to `notes/coverage.md`.

---

## Step 3 — Audit each section for gaps

For each section in `notes/coverage.md`, apply the **content and quality checks defined in
`_coverage-standard.md`** — do not restate them, run them:
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

## Step 5 — Apply all changes

Apply every change identified in Steps 2, 3, and 4 directly to the files.

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
