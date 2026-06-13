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
- Spring Boot: set NOTES_PATH = notes/java/ AND notes/spring-boot/ — read both; the coverage.md
  lives in notes/spring-boot/ but must include Java concepts that appear in Spring Boot code.
- Java: focus on language concepts needed to write and understand Spring Boot code. Skip anything
  that does not appear in a Spring Boot context (GUI, threads, streams, advanced collections).
- SQL: database is PostgreSQL. Include PostgreSQL-specific syntax and behaviour where it differs
  from standard SQL.
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, code principles.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.

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

My projects: read CLAUDE.md, PROGRESS.md, or ROADMAP.md for the current and complete list —
these files stay up to date as new projects are completed. Do not rely on a hardcoded list here.

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
- No tests — signals the candidate only follows tutorials
- Does not know the difference between similar concepts (e.g. `PATCH` vs `PUT`,
  `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`, `Subject` vs `BehaviorSubject`)
- Gives textbook definitions instead of real examples from their own projects

At junior level, companies are not expecting a senior. They want someone who:
- Can explain every line of code they wrote
- Can justify at least one architectural decision
- Knows the basics of their stack and is not faking it
- Can be productive within a few months

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

For coverage, this means: any concept that is easy to generate with AI but hard to explain
belongs in coverage. The bar for "a junior must know this" is now "a junior must be able to
explain and defend this without AI help."

---

## What coverage.md is

`coverage.md` is the **single source of truth** for everything Victor must learn about {TOPIC}.

It is NOT derived from the notes. It is derived from what the job requires.
The notes are then written to cover every item in coverage — not the other way around.

If an item is in coverage but not in the notes yet, that is a gap in the notes.
If the notes cover something that is not in coverage, that is extra material — fine to keep
in the notes, but not required.

The audit prompts (`notes-prompt.md`, `auto-audit-prompt.md`) use `coverage.md` as their
baseline. Every item in coverage is a required topic that must be covered by at least one
note file. No exceptions.

---

## Step 1 — Read the existing state

Read these files before making any decision:

1. `{NOTES_PATH}coverage.md` — if it exists, use it as the starting point. Do not remove
   items without a clear reason.
2. `{NOTES_PATH}future-learning.md` — check if any concept listed there has now become
   in-scope given Victor's current project and objective.
3. All numbered note files in {NOTES_PATH} — read them to understand what has been studied
   and what examples already exist. This is context, not the source of coverage decisions.
   Skip `future-learning.md` and `coverage.md` in this pass.
4. One existing coverage file from another topic as a quality anchor — for example,
   `notes/spring-boot/coverage.md` or `notes/angular/coverage.md`. Use it to calibrate
   the expected depth, tone, and level of detail for each item. Do not copy its structure —
   use it to understand what "good" looks like before writing.
   If no other coverage.md exists yet, skip this step.

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
- It appeared in projects 01–07 or is needed to understand them

**OUT of coverage → goes to `future-learning.md`:**
- Real and worth learning, but only relevant after landing the first job
- Too advanced for a junior screening (mid-level architecture, performance tuning, distributed
  systems, complex patterns only used by seniors)
- Belongs to a future project or a post-hire growth stage
- A junior who doesn't know it would not be filtered out in 2026

If a concept fits neither category, it is not needed at all. Do not add it anywhere.

---

## Step 3 — Apply the AI factor

For each concept you are deciding whether to include, ask:

- Is this easy to generate with AI but hard to explain? → **must be in coverage**
- Is this the kind of thing an interviewer would show as a snippet and ask "what does this do
  and why?" → **must be in coverage**
- Is this something only a mid-level developer would need to know, and AI makes it irrelevant
  at junior level? → **future-learning**

Pairs of similar concepts that are easy to confuse deserve special attention — they are a
standard interview filter. Examples: `@NotNull` vs `@NotBlank`, `LAZY` vs `EAGER`,
`PUT` vs `PATCH`, `Subject` vs `BehaviorSubject`. Include both sides of the pair with a
description that explains the difference.

---

## Step 4 — The bidirectional check with future-learning.md

**Promote from future-learning → coverage:**
For each concept in `future-learning.md`: is it now in scope, given Victor's current project
(07: Spring Boot + JWT + JPA + Docker) and his August 2026 deadline?
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
  `@Entity`, `@Table`, `@Id` together, split them. The audit prompt checks each item
  individually against the notes — a grouped item cannot be checked properly.
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

**Completeness check — before writing the file, answer this question:**
"If Victor studied only the items in this coverage.md and nothing else, would he be ready
to pass a technical interview at NTT Data for a junior Angular + Spring Boot role?"
If the answer is no, something is missing. Find it before writing.

**Section design:**

Use functional, specific section names. "Spring Data JPA", "Bean validation", "Smart/dumb
pattern" are good. "Annotations", "Patterns", "Basics" are too vague.

Aim for 5–10 items per section. More than 12: split. Fewer than 3: merge into a related section.

---

## Step 6 — Update future-learning.md

After writing coverage.md:
- Remove concepts promoted to coverage
- Add concepts demoted from coverage or newly identified as post-junior
- Do not rewrite the whole file — only touch the entries that changed
- Preserve the phased structure (Phase 1, Phase 2, Phase 3) if it already exists

---

## Execution

Apply all changes directly to the files. Do not describe what you would write — write it.

After all edits, print a short summary:

| Change | Detail |
|--------|--------|
| Added to coverage | [list of new items] |
| Promoted from future-learning | [list or "none"] |
| Demoted to future-learning | [list or "none"] |
| Removed from future-learning | [list or "none"] |

If coverage.md did not exist before and was created from scratch, only show the
"Added to coverage" row grouped by section. Skip the promoted/demoted rows.

Then show the commit message so Victor can run it himself. Always one command per code block:

```

git add {NOTES_PATH}coverage.md {NOTES_PATH}future-learning.md

```

```

git commit -m "docs: update {TOPIC} coverage — <one line summary of main changes>"

```

```
