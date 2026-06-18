# Coverage Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Use this prompt when you want to create a new `coverage.md` for a notes folder, or update an existing one when new concepts have been learned, the project scope has changed, or topics need to be promoted from `future-learning.md`.

---

**How to use:**

1. Fill in `TOPIC` — the subject to cover (e.g. Angular, SQL, Java, Spring Boot)
2. Fill in `NOTES_PATH` — the notes folder to review (e.g. `notes/angular/`, `notes/sql/`)
3. Paste the entire prompt into a new chat

---

```
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/ | notes/general/ | notes/security/]

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/spring-boot/ — coverage.md is written there.
  Additionally read notes/java/ when reading existing notes (Step 1.3), because Spring Boot
  coverage must include Java language concepts that appear in Spring Boot code.
- Java: focus on language concepts needed to write and understand Spring Boot code. Skip anything
  that does not appear in a Spring Boot context (GUI, threads, streams, advanced collections).
- SQL: database is PostgreSQL. Include PostgreSQL-specific syntax and behaviour where it differs
  from standard SQL.
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, code principles, Docker basics
  (`docker-compose up`, what a container is, environment variables in Compose, why containerisation
  matters in a consultancy project). Docker is moving from "nice to have" to baseline expectation
  at Spanish consultancies in 2026 — include it.
- Angular Material: focus on components used in Victor's projects and likely to appear in a
  technical test or interview (MatTable, MatDialog, MatFormField, MatButton, etc.). Scope =
  understanding each component's purpose, key inputs/outputs, and typical usage patterns.
  Theming (how to customise colours in v19+) is in scope. Internal implementation and
  rarely-used components are not. The boundary with notes/angular/ is: if the concept is
  about Angular itself (directives, signals, routing), it belongs in angular/; if it is
  specific to a Material component's API or behaviour, it belongs here.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
- Architecture: in scope — REST principles, layered architecture, MVC, coordinator pattern,
  smart/dumb components, service layer, repository pattern. Out of scope (future-learning) —
  microservices, event-driven architecture, DDD, CQRS, distributed systems.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want you to create or update the coverage.md file for {TOPIC}.

Before starting, read CLAUDE.md — it has my full profile, target job, teaching rules, and the
subfolder structure for notes/.

---

## Who I am

I am Victor, 31 years old. I am in a career transition — my background is React, Node.js, and
TypeScript, but I retrained to target Angular + Spring Boot, which is the dominant stack at
Spanish IT consultancies.

My situation:
- Full-time studying since June 2, 2026 — this is not a side project, it is my main job right now
- Completed an internship in June 2026 (Next.js + TypeScript + MySQL) — this is real work
  experience and it goes on my CV, even though the stack is different from my target
- Target: land my first developer job at a Spanish IT consultancy by August–September 2026
- Target companies: NTT Data, Capgemini, Indra, Sopra Steria, and similar large consultancies
- My differentiator: most candidates in Spain apply with React; I am going with Angular +
  Spring Boot, which is what consultancies use internally — this makes me stand out if I
  can demonstrate real understanding, not just syntax knowledge

Projects are a vehicle to practise coverage items — they do not define coverage scope.
Do not use the project list to decide what belongs in coverage.

---

## The Spanish job market in 2026

Large consultancies (NTT Data, Capgemini, Indra, Sopra Steria) hire juniors through a
standard 5-stage process:

1. **CV screening** — stack match, projects, internship. Filtered out if the CV is generic.
2. **HR call** — motivation, availability, salary expectation. 15–20 minutes.
3. **Technical test** — take-home mini-project (Angular mini-app or Spring Boot mini-API),
   typically 2–4 hours. Filtered out if the code is not clean, not structured, or not
   explainable.
4. **Technical interview** — live review of the take-home code: explain every decision,
   defend architecture choices, answer conceptual questions on the spot. The most important
   stage. Filtered out if the candidate cannot explain what they wrote.
5. **Offer** — salary and contract terms.

What gets a junior filtered out at stage 4:
- Cannot explain why a pattern was chosen (only knows how to write it)
- Cannot read code written by someone else and explain what it does
- No tests in the project — in 2026 this is a hard filter at most large consultancies, not
  a minor gap. A junior with tests is rare and immediately stands out
- Does not know the difference between similar concepts (e.g. `PATCH` vs `PUT`,
  `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`, `Subject` vs `BehaviorSubject`)
- Gives textbook definitions instead of real examples from their own projects
- Cannot explain an architectural decision: "why JWT?", "why DTOs?", "why soft delete?" —
  these are standard questions in the technical interview review step

What has specifically changed in 2026:
- Technical tests increasingly include a code-review step: the candidate is shown a snippet
  (sometimes AI-generated) and asked to find the bug or explain what is wrong
- Docker/containerisation is moving from "nice to have" to baseline expectation — a candidate
  who cannot explain what `docker-compose up` does is visibly behind
- Testing has become a real differentiator: almost no junior candidate has tests. Having
  JUnit 5 + Mockito on the backend is now worth more than an extra feature

At junior level, companies are not expecting a senior. They want someone who:
- Can explain every line of code they wrote
- Can justify at least one architectural decision with a real reason, not a tutorial answer
- Knows the basics of their stack and is not faking it
- Can be productive within a few months
- Can review code — including AI-generated code — and spot obvious mistakes

---

## The AI factor in 2026

AI writes boilerplate. This has changed what technical interviewers test.

Before AI: "Can you write the code?" — enough to pass.
Now: "Can you explain the code, justify the decision, and catch a bug in code you did not write?"

This means:
- A candidate who generates code without understanding it is filtered out faster than before
- Testing knowledge is now a stronger filter — tests show real understanding because AI
  struggles to write meaningful tests for code it doesn't understand
- Architecture questions have become more common — "why did you structure it this way?" is
  harder to answer with AI-generated code
- Code review questions are now standard — the interviewer shows a snippet and asks what
  is wrong or why it was written that way

There is a second layer that is new in 2026: companies now expect juniors to USE AI tools
(Copilot, Cursor) while still understanding and reviewing the output. The question is no
longer only "can you explain the code you wrote?" — it is also "can you spot what the AI
got wrong?" Common AI mistakes at junior level that interviewers test for:
- Hardcoded secrets or tokens instead of environment variables
- `@Transactional` placed on the wrong layer (controller instead of service)
- Missing validation edge cases (`@NotBlank` used where `@NotNull` was needed, or vice versa)
- Tests that always pass but never catch a real bug (no meaningful assertion)
- N+1 queries from missing `LAZY`/`EAGER` configuration

For coverage, this means: any concept that is easy to generate with AI but hard to explain
belongs in coverage. The bar for "a junior must know this" is now "a junior must be able to
explain, defend, and review this without AI help."

---

## What coverage.md is

`coverage.md` is the **single source of truth** for everything Victor must learn about {TOPIC}.

It is NOT derived from the notes. It is derived from what the job requires.
The notes are then written to cover every item in coverage — not the other way around.

If an item is in coverage but not in the notes yet, that is a gap in the notes.
If the notes cover something that is not in coverage, that is extra material — fine to keep
in the notes, but not required.

The audit prompts (`notes-by-topic-prompt.md`, `notes-and-interview-prep-prompt.md`) use
`coverage.md` as their baseline. Every item in coverage is a required topic that must be
covered by at least one note file. No exceptions.

---

## Step 1 — Read the existing state

Before reading any file, re-read the configuration block above — some topics have additional
reading instructions (e.g. Spring Boot requires reading `notes/java/` in step 1.3 as well).

Read these files before making any decision:

1. `{NOTES_PATH}coverage.md` — if it exists, use it as the starting point. Do not remove
   items without a clear reason.
2. `{NOTES_PATH}future-learning.md` — check if any concept listed there has now become
   in-scope given Victor's job objective and August 2026 deadline.
3. All numbered note files in {NOTES_PATH} — read them to understand what has been studied
   and what examples already exist. This is context, not the source of coverage decisions.
   Skip `future-learning.md` and `coverage.md` in this pass.
4. When updating an existing `coverage.md`, touch only the items that are new, wrong, or
   being promoted/demoted. Leave correct existing bullets untouched, word for word — an
   unprompted reword of unrelated items makes the resulting commit noisy and hard to review.

---

## Step 2 — Derive coverage from the job, not the notes

Think from the perspective of a technical interviewer at NTT Data or Capgemini who has
30 minutes with a junior Angular + Spring Boot candidate.

Ask yourself: "What would I ask this person to test whether they really know {TOPIC}?"
The answers to that question are the items that belong in coverage.

Then apply the scope filter:

**Important — the notes are not the source of coverage:**
The state of the notes does not limit what goes in coverage. If the notes are sparse,
incomplete, or do not exist yet, derive coverage entirely from your knowledge of what
Spanish consultancies test at junior level. A gap in the notes means the notes need to
be written — it does not mean the topic can be left out of coverage.

**IN coverage — must be there:**
- A junior is expected to explain it confidently out loud
- A junior is expected to write it, read it, or recognise it in a real codebase
- Not knowing it would cause the interviewer to doubt the candidate's competence

**OUT of coverage → goes to `future-learning.md`:**
- Real and worth learning, but only relevant after landing the first job
- Too advanced for a junior screening (mid-level architecture, performance tuning, distributed
  systems, complex patterns only used by seniors)
- Belongs to a future project or a post-hire growth stage
- A junior who doesn't know it would not be filtered out in 2026

If a concept fits neither category, it is not needed at all. Do not add it anywhere.

**Three types of coverage items — every section should have all three:**

Coverage items are not all the same type. The interview prep system that consumes this file
generates three kinds of questions: conceptual (55%), decision (35%), and pressure (10%).
When writing or reviewing items, check that each section contains all three types:

- **Conceptual** — "what is X and how does it work?" e.g. `@Transactional — what it does
  and at which layer it belongs`
- **Decision** — "why X instead of Y?" e.g. `JWT vs sessions — when to choose each and
  the tradeoff for a stateless REST API`
- **Pressure** — a gotcha or edge case that exposes shallow understanding e.g.
  `@Transactional on a private method — silently ignored because Spring cannot proxy it`

If a section only has conceptual items, it is incomplete — add at least one decision item
and one pressure item before closing the section.

---

## Step 3 — Apply the AI factor

For each concept you are deciding whether to include, ask:

- Is this easy to generate with AI but hard to explain? → **must be in coverage**
- Is this the kind of thing an interviewer would show as a snippet and ask "what does this do
  and why?" → **must be in coverage**
- Is this something only a mid-level developer would need to know, regardless of AI? → **future-learning**

Pairs of similar concepts that are easy to confuse deserve special attention — they are a
standard interview filter. Examples: `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`,
`PUT` vs `PATCH`, `Subject` vs `BehaviorSubject`. Include both sides of the pair with a
description that explains the difference.

---

## Step 4 — The bidirectional check with future-learning.md

**Promote from future-learning → coverage:**
For each concept in `future-learning.md`: is it now in scope, given Victor's job objective
(junior Angular + Spring Boot at a Spanish consultancy) and his August 2026 deadline?
Apply the same criteria from Steps 2 and 3.
If yes: add it to coverage and remove it from `future-learning.md`.

**Demote from coverage → future-learning:**
If coverage currently contains something too advanced for a junior screening, move it.
Write a short explanation in `future-learning.md` of why it is post-junior scope.

**Add new entries to future-learning:**
If you identify a concept that is real and worth knowing post-hire — and it is not already
in `future-learning.md` — add it. Do not create a full note file for it.

---

## Step 5 — Write or update coverage.md

Write the file at `{NOTES_PATH}coverage.md`.

**File structure:**

```markdown
# Minimum Coverage — {TOPIC}

[One or two sentences. State what this file defines and anchor it to the job target.
Example: "Topics a junior must know to pass a technical screening at NTT Data, Capgemini,
or Indra in 2026. Every item must be explainable with a real example from one of the projects."]

## [Section name]
- concept — why it matters and what the interviewer is testing

## [Section name]
- ...
```

**Exact format rules:**

- Plain `- ` bullets. No checkboxes (`[ ]`). No numbered lists.
- Each item: `concept name or syntax — one sentence anchored to interview context`.
  The description is mandatory. It must answer: "why does this belong in coverage?"
  Use language like: "interviewers ask...", "tested in every technical screening",
  "asked when discussing...", "the most common source of bugs in junior code", etc.
  Never write a tutorial definition — write the signal the interviewer is probing for.

  **Good vs bad item — example:**
  - ❌ `@Transactional — manages database transactions`
  - ✅ `@Transactional — ensures multiple DB writes either all succeed or all roll back;
    interviewers ask where it belongs (service layer) and what happens if you put it on
    a private method (silently ignored — Spring cannot proxy it)`

  The bad item is a dictionary definition. The good item tells you what the interviewer
  is actually testing and names the gotcha a junior is likely to miss.

- One concept per item — never group multiple concepts in one bullet. If an item lists
  `@Entity`, `@Table`, `@Id` together, split them. This is not a style rule — it is a
  functional requirement: notes are audited per item, interview questions are generated per
  item, and project gap analysis maps per item. A grouped bullet breaks all three downstream
  steps.
- Inline backticks for annotations, class names, and method names are fine and encouraged
  (`` `@Transactional` ``, `` `JpaRepository` ``). What is not allowed is fenced code blocks
  (triple backtick) — no implementation, no method bodies, no examples.
- Sections grouped by theme. Order from highest filtering risk (most likely to cause rejection
  if unknown) to lowest.
- Items within a section: foundational first, then more specific.

**Confusable pairs check — before closing each section:**
Scan the section for concepts that are easy to confuse with something similar. If both
sides of a pair are not already present, add them. Examples by topic:
- Spring Boot: `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`, private method + `@Transactional`
- Angular: `Subject` vs `BehaviorSubject`, `signal()` vs `computed()`, `ngIf` vs `@if`
- SQL: `WHERE` vs `HAVING`, `JOIN` vs `LEFT JOIN`, `COUNT(*)` vs `COUNT(column)`
- TypeScript: `interface` vs `type`, `any` vs `unknown`, `?.` vs `??`
- Architecture: `PUT` vs `PATCH`, unit test vs integration test, `401` vs `403`
Apply the same logic to whatever {TOPIC} is — do not limit yourself to these examples.

**Three-types check — before closing each section:**
Confirm the section has at least one item of each type:
- **Conceptual** — "what is X and how does it work?"
- **Decision** — "why X instead of Y?"
- **Pressure** — a gotcha or edge case that exposes shallow understanding

If any type is missing, add one item before moving on. Do not close a section with only
conceptual items — that is the most common gap and the one interviewers use to filter juniors.

**Completeness check — before writing the file, answer this question:**
"If Victor studied only the items in this coverage.md and nothing else, would he be able
to confidently answer any interview question about {TOPIC} at a junior Angular + Spring Boot
screening at NTT Data or Capgemini?"
If the answer is no, something is missing. Find it before writing.

**Section design:**

Use functional, specific section names. "Spring Data JPA", "Bean validation", "Smart/dumb
pattern" are good. "Annotations", "Patterns", "Basics" are too vague.

Aim for 5–10 items per section. More than 12: split. Fewer than 3: merge into a related section.

---

## Step 5b — Keep notes/coverage.md in sync

`notes/coverage.md` is a combined file that mirrors all 12 topic `coverage.md` files in one
place, for cross-topic analysis. It must always contain **exactly the same content** as each
topic file — never a paraphrase, a shortened version, or a summary.

Whenever `{NOTES_PATH}coverage.md` is created or edited in Step 5, immediately apply the same
change to its section inside `notes/coverage.md`:

**If the section for {TOPIC} does not yet exist in `notes/coverage.md`:** insert it at the
correct position following the study-priority order: Angular → Angular Material →
Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL →
Git → General. Add a `---` separator before and after the new section.

1. Find the section for {TOPIC} in `notes/coverage.md` — it starts at the line `## {TOPIC}`
   and ends right before the next `## ` heading (or end of file if {TOPIC} is General, the
   last section).
2. Replace that whole section with the new content from `{NOTES_PATH}coverage.md`, transformed
   like this:
   - The title line `# Minimum Coverage — {TOPIC}` becomes `## {TOPIC}` (drop the
     "Minimum Coverage — " prefix, keep one heading level deeper than the source).
   - The description paragraph right after the title is copied verbatim, word for word.
   - Every `## [Section name]` in the source becomes `### [Section name]` (one heading level
     deeper) — content and order stay otherwise identical, including any `---` separators
     between subsections if the source file uses them.
3. Keep the `---` separator before and after the section so it stays cleanly divided from the
   topics before and after it in the study-priority order (Angular → Angular Material →
   Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git →
   General).

Do this for every edit, not just full rewrites — if only one bullet changes in
`{NOTES_PATH}coverage.md`, change that same bullet in `notes/coverage.md` too. The two files
must never drift apart.

**Cross-topic overlap check:**
Before finalizing, scan the other sections of `notes/coverage.md` for items that overlap with
what you just added or changed (e.g. REST status codes or "service layer" could plausibly sit
under Architecture, Spring Boot, or Angular). If the same concept already exists elsewhere,
keep it in the topic where an interviewer is most likely to ask it, and mention the overlap in
the final summary instead of duplicating the item.

**Verify the sync before reporting done:**
Re-read the {TOPIC} section in `notes/coverage.md` and the full content of
`{NOTES_PATH}coverage.md` side by side. Confirm every bullet matches exactly — only the
heading levels should differ (`#` → `##`, `##` → `###`). If anything differs, fix
`notes/coverage.md` now, before moving to Step 6.

---

## Step 6 — Update future-learning.md

After writing coverage.md:
- Remove concepts promoted to coverage
- Add concepts demoted from coverage or newly identified as post-junior
- Do not rewrite the whole file — only touch the entries that changed
- Preserve the phased structure (Phase 1, Phase 2, Phase 3) if it already exists
- If `future-learning.md` does not exist yet for this topic, create it with a short intro
  line and at least one `## Phase` section grouping concepts by when they become relevant
  (during the job, 6–12 months in, senior level)

---

## Execution

Apply all changes directly to the files. Do not describe what you would write — write it.

After all edits, print a short summary:

| Change | Detail |
|--------|--------|
| Added to coverage | [list of new items] |
| Promoted from future-learning | [list or "none"] |
| Demoted to future-learning | [item — one-line reason it no longer belongs in coverage, or "none"] |
| Removed from future-learning | [item — one-line reason it was removed, or "none"] |
| Synced to notes/coverage.md | [yes — X bullets changed / no changes needed] |

If coverage.md did not exist before and was created from scratch, only show the
"Added to coverage" row grouped by section. Skip the promoted/demoted/removed rows.
The "Synced to notes/coverage.md" row always appears, even when creating from scratch.

"Promoted from future-learning" = concept moved into coverage (now in scope).
"Removed from future-learning" = concept deleted entirely because it is no longer relevant
(wrong topic, outdated, or not needed anywhere — not just post-junior).

Then show the commit message so Victor can run it himself. Always one command per code block:

```

git add {NOTES_PATH}coverage.md {NOTES_PATH}future-learning.md notes/coverage.md

```

If `{NOTES_PATH}future-learning.md` was not modified, remove it from the git add command.

```

git commit -m "docs: update {TOPIC} coverage — <one line summary of main changes>"

```
