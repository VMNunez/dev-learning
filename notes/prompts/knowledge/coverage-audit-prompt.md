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

## Who I am

I am Victor, 31 years old. I am in a career transition — my background is React, Node.js, and TypeScript, but I retrained to target Angular + Spring Boot, which is the dominant stack at Spanish IT consultancies.

My situation:
- Full-time studying since June 2, 2026 — this is my main job right now
- Completed an internship in June 2026 (Next.js + TypeScript + MySQL) — real work experience, different stack, goes on the CV
- Target: land my first developer job at a Spanish IT consultancy by August–September 2026
- Target companies: NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI, and similar large consultancies
- Differentiator: most candidates in Spain apply with React; I am going with Angular + Spring Boot, which is what consultancies use internally

Projects and notes are vehicles to reach the job objective — they do not define scope. Scope is defined entirely by what the job requires.

---

## The Spanish job market in 2026

Large consultancies (NTT Data, Capgemini, Indra, Sopra Steria, Accenture, Everis, Atos, CGI) hire juniors through a 5-stage process: CV screening → HR call → technical test → technical interview → offer.

The technical interview (stage 4) is where candidates are filtered. The interviewer reviews the candidate's test code live and asks conceptual questions on the spot.

What gets a junior filtered out:
- Cannot explain why a pattern was chosen (only knows how to write it)
- No tests in the project — in 2026 this is a hard filter, not a minor gap. A junior with tests is rare and immediately stands out
- Cannot explain an architectural decision: "why JWT?", "why DTOs?", "why soft delete?" — standard questions in the review step
- Does not know the difference between similar concepts (`PATCH` vs `PUT`, `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`)
- Gives textbook definitions instead of real examples from their own project
- Cannot read code they did not write and explain what it does

What has specifically changed in 2026:
- Technical tests increasingly include a code-review step: the candidate is shown a snippet (sometimes AI-generated) and asked to find the bug or explain what is wrong
- Docker/containerisation is moving from "nice to have" to baseline expectation
- Testing is now a real differentiator — almost no junior candidate has tests; having JUnit 5 + Mockito is worth more than an extra feature

---

## The AI factor in 2026

AI writes boilerplate. This has raised the bar for what juniors must know.

In 2026 there are two layers:
1. **Explain what AI generates** — "can you explain the code you wrote?"
2. **Review AI output** — "can you spot what the AI got wrong?" Companies expect juniors to USE AI tools (Copilot, Cursor) and review the output critically

Common AI mistakes at junior level that interviewers now test for:
- Hardcoded secrets or tokens instead of environment variables
- `@Transactional` placed on the wrong layer (controller instead of service)
- `@NotBlank` vs `@NotNull` confusion
- Tests that always pass but never catch a real bug (no meaningful assertion)
- N+1 queries from missing `LAZY`/`EAGER` configuration

For coverage: any concept that is easy to generate with AI but hard to explain, defend, or review belongs in coverage. The bar is now "a junior must be able to explain, defend, and review this without AI help."

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
2. `CLAUDE.md` — Victor's full profile, learning objectives, and notes folder structure
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

For each section in `notes/coverage.md`, apply these five checks:

**Check 1 — Three types of items:**

Every section must have all three types. A section with only conceptual items is incomplete — it will only generate one type of interview question.

- **Conceptual** — "what is X and how does it work?" e.g. `@Transactional — what it does and at which layer it belongs`
- **Decision** — "why X instead of Y?" e.g. `JWT vs sessions — why JWT for a stateless REST API and what you give up`
- **Pressure** — a gotcha or edge case that exposes shallow understanding e.g. `@Transactional on a private method — silently ignored because Spring cannot proxy it`

If a type is missing, add at least one item of that type before moving to the next section.

**Check 2 — Confusable pairs:**

Scan for concepts that are easy to confuse with something similar. Both sides of every confusable pair must be present as separate items. Examples by topic (not exhaustive — apply the same logic to every topic):
- Spring Boot: `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`, `@Component` vs `@Bean`, `@Service` vs `@Repository` vs `@Component`, `findById` returns `Optional` vs throws exception, `save()` vs `saveAndFlush()`
- Angular: `Subject` vs `BehaviorSubject`, `signal()` vs `computed()`, `ngIf` vs `@if`, `async pipe` vs manual subscribe, `Observable` vs `Promise`, `constructor` vs `ngOnInit`
- Java: `==` vs `.equals()` — reference comparison vs value equality; classic trap with String comparisons, `checked` vs `unchecked exceptions` — when to use each and why Spring Boot prefers unchecked (RuntimeException subclasses)
- SQL: `WHERE` vs `HAVING`, `JOIN` vs `LEFT JOIN`, `COUNT(*)` vs `COUNT(column)`, `TRUNCATE` vs `DELETE`, `UNION` vs `UNION ALL`, `EXISTS` vs `IN`
- TypeScript: `interface` vs `type`, `any` vs `unknown`, `?.` vs `??`
- Architecture: `PUT` vs `PATCH`, `401` vs `403`, unit test vs integration test, `DTO` vs entity, soft delete vs hard delete
- Security: authentication vs authorisation, hashing vs encryption, `XSS` vs `CSRF`, access token vs refresh token

**Check 3 — AI-exploitable gaps:**

Are there concepts that AI generates commonly but a junior would struggle to explain? These are high-priority items. Focus on:
- The "why" behind decisions (why JWT, why DTOs, why soft delete, why coordinator pattern)
- Layer placement rules (what goes in controller vs service vs repository)
- Transaction behaviour and edge cases
- Security implications of common patterns
- Annotation placement rules and what happens when they are wrong

**Check 4 — Item quality:**

Each item must follow the format: `concept — why it matters anchored to interview context`.

- ❌ `@Transactional — manages database transactions`
- ✅ `@Transactional — ensures multiple DB writes either all succeed or all roll back; interviewers ask where it belongs (service layer) and what happens if you put it on a private method (silently ignored — Spring cannot proxy it)`

The bad item is a dictionary definition. The good item names what the interviewer is testing and names the gotcha a junior is likely to miss. Fix every item that reads like a dictionary definition.

**Check 5 — One concept per item:**

If any bullet groups multiple concepts, split them. This is a functional requirement, not a style rule: notes are audited per item, interview questions are generated per item, and project gap analysis maps per item. A grouped bullet breaks all three downstream steps.

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
For each `notes/{topic}/future-learning.md` corresponding to a section you reviewed: are any concepts listed there now in scope for a junior Angular + Spring Boot role in August 2026? Apply the same criteria from Step 3. If yes: add the concept to the correct section in `notes/coverage.md` and the corresponding `notes/{topic}/coverage.md`, and remove it from `future-learning.md`. Also: if any entry in `future-learning.md` is no longer relevant at all — wrong topic, outdated, or not needed in any future phase — delete it entirely. Do not move it anywhere; simply remove it.

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
