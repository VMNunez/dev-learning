# Notes Audit Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Useful after a study session when you want to check and improve the notes for one topic. For a combined notes + interview prep audit, use `notes-audit-prompt.md` instead.

---

**How to use:**
1. Fill in `TOPIC` — the subject to audit
2. Fill in `NOTES_PATH` — the notes folder to review
3. Paste the entire prompt below into a new chat

---

```
## Configuration — edit only this block

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/ | notes/general/ | notes/security/]

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/java/ AND notes/spring-boot/ — read both, because Spring Boot
  code uses Java language concepts. Both folders use structured mode.
- Java: focus on language concepts needed to write Spring Boot code — classes, interfaces,
  annotations, generics, exceptions, Maven. Skip Java concepts not used in a Spring Boot context.
- SQL: database is PostgreSQL. Focus on PostgreSQL syntax. Flag any PostgreSQL-specific detail
  consultancies would ask about (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- General and Security: these folders use conversational mode. Interview prep files are
  notes/interview-prep/en/general.md and notes/interview-prep/en/security.md.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want a technical audit of my study notes for {TOPIC}.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, subfolder structure,
and interview prep rules. The notes format and quality standard is defined in this prompt file.

---

## Who I am and what I need

I am Victor, 31 years old. I am preparing for my first junior developer job at Spanish IT
consultancies (NTT Data, Capgemini, Indra, and similar) with a target date of August–September 2026.

My stack: Angular (frontend) + Spring Boot (backend, Java) + PostgreSQL (database).

My differentiator: most candidates in Spain apply with React. I am going with Angular + Spring
Boot, which is what large consultancies actually use internally — this makes me stand out if
I can demonstrate real understanding and real decisions, not just syntax knowledge.

I completed an internship in June 2026 (Next.js + TypeScript + MySQL) — real work experience
on my CV even though the stack is different.

Level: Junior to Junior-Mid. I need to sound like someone who makes decisions and can explain
them — not someone who followed a tutorial and memorised the steps.

What Spanish consultancies actually look for in 2026:
- Can you explain every line of code you wrote?
- Did you make architectural decisions, or did you just follow a tutorial?
- Can you read and understand code written by someone else?
- Do you have any real project or work experience?
- Can you write and understand tests?

My projects:
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: TimeTrack (in progress) — Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate,
      PostgreSQL, Docker, Angular frontend

Notes to audit: {NOTES_PATH}

---

## Pre-audit — Resolve TODOs

Before starting, scan all files in {NOTES_PATH} for any TODO markers.
These can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO` — Victor adds them while
reading to mark things he wants corrected or improved.

For each TODO found:
1. Identify exactly what Victor wants changed
2. Apply the fix at that exact location in the file
3. Remove the TODO marker after fixing
4. Report what was changed before moving on

If no TODOs are found, skip this section and move directly to Step 1.

---

## Step 1 — Structure and scope

Before checking content quality, audit the organisation of the folder.

### 1a. Scope — scan all existing content

Read every file in {NOTES_PATH}. For each section or file that covers a concept beyond Victor's
current scope (too advanced for a junior role at a Spanish consultancy, or something that
explicitly belongs in a future project phase):
- Move the out-of-scope content to `future-learning.md` in {NOTES_PATH}
- If the entire file is out of scope, move its content to `future-learning.md` and delete the file
- Do not just flag — apply the change directly

What "out of scope" means for Victor's target:
- Concepts a junior would not be expected to implement or explain in a screening interview
- Topics that depend on completing the current stack first (e.g. microservices before Spring Boot is solid)
- Advanced patterns for mid/senior roles

### 1b. future-learning graduation check

Read `future-learning.md` in {NOTES_PATH}. For each concept listed there, ask: is it now
relevant given Victor's current project (07 — TimeTrack, Spring Boot + Angular + JWT + tests)?

If a concept has become relevant, note it at the end of the audit as a candidate for promotion
to a real file. Do not create it automatically — list it and let Victor decide.

### 1c. Folder placement check

For each file in {NOTES_PATH}, ask: does this concept belong here, or in a different folder?

| Concept type | Correct folder |
|---|---|
| Security concepts (CORS, XSS, JWT auth design, AuthN/AuthZ) | notes/security/ |
| Cross-cutting general concepts (HTTP, JSON, env vars, testing, SOLID) | notes/general/ |
| Spring Boot implementation (annotations, filters, config, JPA) | notes/spring-boot/ |
| Pure Java language concepts | notes/java/ |
| Angular patterns and framework concepts | notes/angular/ |
| Angular Material components | notes/angular-material/ |
| Architecture patterns (REST, layered, MVC, component patterns) | notes/architecture/ |

Flag any misplaced concept. Move it if the correct destination is unambiguous. If it is
borderline, flag it and explain the two options so Victor can decide.

### 1d. Duplicate detection

For each concept covered in {NOTES_PATH}, check if it also appears in another folder.
- If one is the conceptual explanation and the other is the implementation: intentional — keep both and note the relationship
- If both cover the same ground: duplicate — consolidate into the more appropriate folder and remove from the other

### 1e. Study order validation

For each file numbered N, check: does it introduce concepts that depend on something not yet
covered in files 01 to N-1? If file 03 references a pattern explained in file 06, the order is
wrong. Propose the correct order and rename the files if needed.

### 1f. CLAUDE.md consistency

After any structural changes (new files, moved files, renamed files, deleted files):
- Check that the "next file:" counter for {NOTES_PATH} in CLAUDE.md is correct
- Check that the folder description in CLAUDE.md's "Subfolders and their purpose" section
  reflects the current content

Report any inconsistency. Do not edit CLAUDE.md — report the change needed so Victor can apply it.

---

## Step 2 — Format mode

Determine which format mode applies to {NOTES_PATH} and check that every file follows it.

### Structured mode — notes/java/, notes/spring-boot/

Use when the reader cannot guess what each API call does from context alone (unfamiliar external
libraries: jjwt, Spring Security, JPA, Hibernate). Every method and annotation needs an explicit
explanation.

Format per section:
1. `### methodName() — one-line summary`
2. `Docs:` line — direct link to the exact docs page for this section
3. `File:` line — path to the file in Victor's project where this code lives
4. `Purpose:` line — one sentence: who calls this, when, and why
5. Intro — 2–3 sentences of context when needed
6. Code block — the full method or class
7. Per-call explanations — each important call as **`.methodName()`** — what it does and why it matters; connect to other parts of the project where relevant
8. Warnings — edge cases or "never do X" in a `>` blockquote

### Conversational mode — all other folders

`notes/angular/`, `notes/angular-material/`, `notes/css/`, `notes/typescript/`,
`notes/javascript/`, `notes/sql/`, `notes/git/`, `notes/architecture/`,
`notes/general/`, `notes/security/`

Use when framework patterns click in context and the surrounding explanation makes the code readable.

Format:
- `Docs:` link per section — always link to the exact docs page, not just the main site
- No `Purpose:` or `File:` lines
- Inline explanations after code blocks — paragraphs, not bold items
- "Why not X?" with `>` blockquotes and `❌` / `✅` examples
- Analogies where they help

### Both modes

- Never include an Imports section — IntelliJ adds imports automatically
- Start with the problem, not the concept — lead with the pain that existed before this solution
- Personal, conversational voice — "You use this when..." not "This is used when..."
- Explain before the code — 1–3 sentences of context before any code block
- Reference real projects — "this is the same pattern as project 05's MatDialog flow"
- Do not write documentation — if it could appear word-for-word on the official docs site, rewrite it in Victor's voice
- Calibrate depth to complexity — a simple annotation needs one sentence; a filter chain needs a paragraph
- Inline tips — use `>` blockquotes for things that are easy to get wrong or only make sense after hitting them in practice. These are the notes a senior would whisper to a junior during a code review.

---

## Step 3 — Content audit

### 3a. Missing concepts

Identify fundamental concepts not yet covered that a Spanish consultancy would use to filter
candidates in a first technical screening. One sentence per gap explaining why they ask it.

Skip `future-learning.md` — it is a roadmap file, not a study note.

### 3b. Writing quality check

For each file, verify:
- Does it explain the WHY before showing the code?
- Does it identify repeating patterns and name them explicitly?
- Does it link to the exact official documentation page (not just the main docs site)?
- Does it read like a personal learning guide, not like documentation?
- Does it follow the correct format mode for this folder (Step 2)?

Fix any violation directly in the file.

### 3c. Coverage status

For each file, assign a status:
- ✅ Complete — solid coverage for a junior screening at a Spanish consultancy
- 🔧 Fixed — gaps found and resolved in this session
- ➕ Added — new content created from scratch

### 3d. Creating new files — proactive, not reactive

After reading all existing files, assess the full learning sequence as a whole:

- Can Victor open file 01 and learn the topic from scratch without looking elsewhere for the basics?
- Is there a logical progression? Each file should build on the previous one.
- Is the folder sparse? If a topic clearly needs 5 files but only has 2, create the missing 3.

The folder is Victor's personal textbook for that topic. It should be complete enough to learn
from scratch.

When creating a new file:
- Use the numbered naming convention (`16-topic-name.md`)
- Choose the number that fits the learning sequence — not just the next available number
- Follow the correct format mode for this folder

---

## Step 4 — Interview prep coverage

Determine the interview prep filename for {NOTES_PATH}:

| NOTES_PATH | Interview prep file |
|---|---|
| notes/angular/ or notes/angular-material/ | en/angular.md / es/angular.md |
| notes/css/ | en/css.md / es/css.md |
| notes/javascript/ | en/javascript.md / es/javascript.md |
| notes/typescript/ | en/typescript.md / es/typescript.md |
| notes/sql/ | en/sql.md / es/sql.md |
| notes/java/ or notes/spring-boot/ | en/java.md + en/spring-boot.md / same in es/ |
| notes/architecture/ | en/architecture.md / es/architecture.md |
| notes/git/ | en/git.md / es/git.md |
| notes/general/ | en/general.md / es/general.md |
| notes/security/ | en/security.md / es/security.md |

**If the interview prep file does not exist:** create it with the standard format and a first
set of questions covering the most important concepts in {NOTES_PATH}. Create both en/ and es/
versions at the same time.

**If the interview prep file exists:** for each concept covered in {NOTES_PATH}, check if there
is a corresponding interview question. For each gap, add the missing question to both en/ and es/
following the standard question format defined in `notes-audit-prompt.md`.

---

## Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

After all edits, print a final summary:

**Structural changes:**
List any files moved, renamed, deleted, or created.

**Content summary table:**

| File | Status |
|------|--------|
| [filename] | ✅ / 🔧 / ➕ |

**future-learning candidates:**
List any concepts from `future-learning.md` that have become relevant and are candidates for
promotion to a real file.

Then show the commit message so Victor can run it himself. Always use this format — one command per code block:

```
git add <files changed>
```
```
git commit -m "docs: audit {TOPIC} notes — <one line summary of main fixes>"
```
```
