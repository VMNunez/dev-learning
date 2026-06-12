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
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, code principles. Cross-cutting
  concepts not specific to one technology.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want you to create or update the coverage.md file for {TOPIC}.

Before starting, read CLAUDE.md — it has my full profile, target job, teaching rules, and the
subfolder structure for notes/.

---

## Who I am and what this coverage is for

I am Victor, 31 years old. I am preparing for my first junior developer job at Spanish IT
consultancies (NTT Data, Capgemini, Indra, Sopra Steria, and similar) with a target date of
August 2026.

My stack: Angular (frontend) + Spring Boot (backend, Java) + PostgreSQL (database).

I completed an internship in June 2026 (Next.js + TypeScript + MySQL) — real work experience
on my CV even though the stack is different.

Level: Junior to Junior-Mid. I need to sound like someone who makes decisions and can explain
them — not someone who followed a tutorial and memorised the steps.

My projects:
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: TimeTrack (in progress) — Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate,
  PostgreSQL, Docker, Angular

The `coverage.md` file is the single source of truth for what I must learn and be able to
explain for this topic. It is used by audit prompts to check that notes and interview prep
are complete. Every item in `coverage.md` is a required topic — not optional, not bonus.

---

## Step 1 — Read the existing state

Before making any decision about what belongs in coverage, read these files:

1. The existing `{NOTES_PATH}coverage.md` — if it exists, use it as the starting point.
   Do not delete sections without a reason.
2. All numbered note files in {NOTES_PATH} — these define what has already been studied.
   Skip `future-learning.md` and `coverage.md` in this pass.
3. The existing `{NOTES_PATH}future-learning.md` — check if any concept listed there
   has now become in-scope (see the bidirectional check below).

---

## Step 2 — Decide what goes in coverage

The scope test for a coverage item: **Would a Spanish consultancy test this in a
technical interview for a junior Angular + Spring Boot role by August 2026?**

A concept is IN coverage if:
- A junior at NTT Data, Capgemini, or Indra would be expected to explain it out loud
- A junior would be expected to write it or recognise it in a code review
- It appears in real project code at Victor's level (projects 01–07)
- Skipping it would make Victor look underprepared in a screening

A concept goes to `future-learning.md` if:
- It is real and worth learning — but only relevant after landing the first job
- It is too advanced for a junior screening (mid-level architecture, advanced performance tuning)
- It belongs to a future project or a post-hire growth area
- A junior who doesn't know it would not be filtered out

If a concept does not fit either — it is not needed at all and should be ignored.

**The AI factor (2026):** Companies have raised the bar slightly because AI writes boilerplate.
What they now test:
- Can you explain every line, not just write it?
- Did you make decisions, or did you copy code?
- Can you read and review code written by someone else or by AI?
- Can you write and understand tests?

Let this shape what "a junior must know" means. A concept that is easy to generate with AI
but hard to explain belongs in coverage — because explaining it is exactly what separates
Victor from a weaker candidate.

---

## Step 3 — The bidirectional check with future-learning.md

**Promote from future-learning → coverage:**
Read the existing `future-learning.md`. For each concept listed, ask: is this now in scope,
given Victor's current project (07: Spring Boot + JWT + JPA + Docker) and his objective
(junior at a Spanish consultancy by August 2026)?
If yes: add it to coverage and remove it from `future-learning.md`.

**Demote from coverage → future-learning:**
If coverage currently contains something too advanced for a junior screening, move it to
`future-learning.md` with a short explanation of why it belongs there.

**Add to future-learning:**
If during this process you identify a concept that is real and worth knowing — but is still
beyond junior scope — add it to `future-learning.md`. If it is already listed there, leave it.

---

## Step 4 — Write or update coverage.md

Write the file at `{NOTES_PATH}coverage.md`.

**File structure:**

```
# Minimum Coverage — {TOPIC}

[One or two sentences explaining what this coverage is for and what the scope is.
Anchor it to the job target. Do not make it generic.]

## [Section name]
- concept — why it matters / what the interviewer expects

## [Section name]
...
```

**Exact format rules:**

- Plain `- ` bullet points. No checkboxes (`[ ]`). No numbered lists.
- Each item: `concept or syntax — one sentence explaining why it matters or what the
  interviewer is testing`. The "why it matters" part is mandatory — it is what makes
  coverage useful as a study guide, not just a list of names.
- No code blocks inside coverage.md — concept names only, no implementation.
- Sections grouped by theme, not alphabetical. Order sections from most important
  (highest filtering risk in an interview) to least.
- Items within a section: foundational first, then more specific.
- The description after the dash must be interview-anchored: "interviewers ask...",
  "used in...", "tested in every technical interview", "asked when discussing..."
  Not a tutorial definition — a signal of what the interviewer is probing.

**Section design:**

Do not create one giant flat list. Group related concepts under a clear section heading.
Good section names are functional, not generic — "Spring Data JPA", "Bean validation",
"Smart / dumb pattern" are better than "Annotations", "Testing", "Patterns".

Aim for 6–12 items per section. If a section has 20+ items, split it.
If a section has 2 items, consider merging it into a related section.

---

## Step 5 — Update future-learning.md

After writing coverage.md:
- Remove any concept from `future-learning.md` that was promoted to coverage.
- Add any concept that was demoted or newly identified as post-junior scope.
- Do not rewrite the whole file — only touch the entries that changed.

---

## Execution

Apply all changes directly to the files. Do not describe what you would write — write it.

After all edits, print a short summary:

- What was added to coverage
- What was promoted from future-learning (if any)
- What was demoted to future-learning (if any)
- What stayed unchanged

Then show the commit message so Victor can run it himself. Always use this format —
one command per code block:

```

git add {NOTES_PATH}coverage.md {NOTES_PATH}future-learning.md

```

```

git commit -m "docs: update {TOPIC} coverage — <one line summary of main changes>"

```

```
