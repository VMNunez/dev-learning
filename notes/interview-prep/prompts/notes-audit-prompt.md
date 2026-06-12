# Notes + Interview Prep Deep Audit Prompt

Use in a **separate conversation**. Fill in the three values in the configuration block, then paste everything into a new chat.

---

**How to use:**
1. Fill in `TOPIC` — the subject to audit
2. Fill in `NOTES_PATH` — the notes folder to review
3. Fill in `FILE` — the interview prep filename without extension
4. Paste the entire prompt below into a new chat

---

```
## Configuration — edit only this block

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/ | notes/general/ | notes/security/]
FILE = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security]
       → notes/interview-prep/en/{FILE}.md
       → notes/interview-prep/es/{FILE}.md

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/java/ AND notes/spring-boot/ — read both, because Spring Boot
  code uses Java language concepts. Set FILE = spring-boot.
- Java: focus on language concepts needed to write Spring Boot code. Spring Boot framework questions
  live in spring-boot.md, not java.md.
- SQL: database is PostgreSQL. Focus on PostgreSQL syntax and behaviour. Flag any PostgreSQL-specific
  detail consultancies would ask about (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- General: NOTES_PATH = notes/general/, FILE = general.
- Security: NOTES_PATH = notes/security/, FILE = security.

Use TOPIC, NOTES_PATH, and FILE wherever the prompt refers to {TOPIC}, {NOTES_PATH}, or {FILE}.

---

I want a deep technical audit of my study notes and interview prep for {TOPIC}.

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

Files to audit:
- Notes: {NOTES_PATH}
- Interview prep: notes/interview-prep/en/{FILE}.md and notes/interview-prep/es/{FILE}.md

---

## Pre-audit — Resolve TODOs

Before starting Part 1, scan all files in {NOTES_PATH} and both interview prep files for any
TODO markers. These can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO`.

For each TODO found:
1. Identify exactly what Victor wants changed
2. Apply the fix at that exact location
3. Apply the same fix (translated) to the es/ file if the TODO is in an interview prep file
4. Remove the TODO marker after fixing
5. Report what was changed before moving on

If no TODOs are found, skip this section and move directly to Part 1.

---

## Part 1 — Notes audit

### Step 1 — Structure and scope

Before checking content quality, audit the organisation of the folder.

**1a. Scope — scan all existing content**

Read every file in {NOTES_PATH}. For each section or file that covers a concept beyond Victor's
current scope (too advanced for a junior role at a Spanish consultancy, or something that
explicitly belongs in a future project phase):
- Move the out-of-scope content to `future-learning.md` in {NOTES_PATH}
- If the entire file is out of scope, move its content to `future-learning.md` and delete the file
- Do not just flag — apply the change directly

What "out of scope" means for Victor's target:
- Concepts a junior would not be expected to implement or explain in a first screening
- Topics that depend on completing the current stack first (e.g. microservices before Spring Boot is solid)
- Advanced patterns for mid/senior roles

**1b. future-learning graduation check**

Read `future-learning.md` in {NOTES_PATH}. For each concept listed there, ask: is it now
relevant given Victor's current project (07 — TimeTrack, Spring Boot + Angular + JWT + tests)?

If a concept has become relevant, note it at the end of the audit as a candidate for promotion
to a real file. Do not create it automatically — list it and let Victor decide.

**1c. Folder placement check**

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

Flag any misplaced concept. Move it if the correct destination is unambiguous. If borderline,
explain the two options so Victor can decide.

**1d. Duplicate detection**

For each concept covered in {NOTES_PATH}, check if it also appears in another folder.
- Conceptual explanation in one folder + implementation in another: intentional — keep both
- Same explanation in two places: duplicate — consolidate and remove from the less appropriate folder

**1e. Study order validation**

For each file numbered N, check: does it introduce concepts that depend on something not yet
covered in files 01 to N-1? If file 03 references a pattern explained in file 06, the order is
wrong. Propose the correct order and rename the files if needed.

**1f. CLAUDE.md consistency**

After any structural changes (new files, moved files, renamed files, deleted files):
- Check that the "next file:" counter for {NOTES_PATH} in CLAUDE.md is correct
- Check that the folder description in CLAUDE.md's "Subfolders and their purpose" section
  reflects the current content

Report any inconsistency. Do not edit CLAUDE.md — report the change needed so Victor can apply it.

---

### Step 2 — Format mode

Determine which format mode applies to {NOTES_PATH} and check that every file follows it.

**Structured mode — notes/java/, notes/spring-boot/**

Use when the reader cannot guess what each API call does from context alone (unfamiliar external
libraries: jjwt, Spring Security, JPA, Hibernate).

Format per section:
1. `### methodName() — one-line summary`
2. `Docs:` line — direct link to the exact docs page for this section
3. `File:` line — path to the file in Victor's project where this code lives
4. `Purpose:` line — one sentence: who calls this, when, and why
5. Intro — 2–3 sentences of context when needed
6. Code block — the full method or class
7. Per-call explanations — each important call as **`.methodName()`** — what it does and why it matters; connect to other parts of the project where relevant
8. Warnings — edge cases or "never do X" in a `>` blockquote

**Conversational mode — all other folders**

`notes/angular/`, `notes/angular-material/`, `notes/css/`, `notes/typescript/`,
`notes/javascript/`, `notes/sql/`, `notes/git/`, `notes/architecture/`,
`notes/general/`, `notes/security/`

Format:
- `Docs:` link per section — always link to the exact docs page, not just the main site
- No `Purpose:` or `File:` lines
- Inline explanations after code blocks — paragraphs, not bold items
- "Why not X?" with `>` blockquotes and `❌` / `✅` examples
- Analogies where they help

**Both modes:**
- Never include an Imports section — IntelliJ adds imports automatically
- Start with the problem, not the concept — lead with the pain that existed before this solution
- Personal, conversational voice — "You use this when..." not "This is used when..."
- Explain before the code — 1–3 sentences of context before any code block
- Reference real projects — "this is the same pattern as project 05's MatDialog flow"
- Do not write documentation — if it could appear word-for-word on the official docs site, rewrite it in Victor's voice
- Calibrate depth to complexity — a simple annotation needs one sentence; a filter chain needs a paragraph
- Inline tips — `>` blockquotes for things easy to get wrong or that only make sense after hitting them in practice

---

### Step 3 — Content audit

**3a. Missing concepts**

Identify fundamental concepts not yet covered that a Spanish consultancy would use to filter
candidates in a first technical screening. One sentence per gap explaining why they ask it.

Skip `future-learning.md` — it is a roadmap file, not a study note.

**3b. Writing quality check**

For each file, verify:
- Does it explain the WHY before showing the code?
- Does it identify repeating patterns and name them explicitly?
- Does it link to the exact official documentation page (not just the main docs site)?
- Does it read like a personal learning guide, not like documentation?
- Does it follow the correct format mode (Step 2)?

Fix any violation directly in the file.

**3c. Coverage status**

For each file:
- ✅ Complete — solid coverage for a junior screening at a Spanish consultancy
- 🔧 Fixed — gaps found and resolved in this session
- ➕ Added — new content created from scratch

**3d. Creating new files — proactive, not reactive**

After reading all existing files, assess the full learning sequence:
- Can Victor open file 01 and learn the topic from scratch without looking elsewhere?
- Is there a logical progression? Each file should build on the previous one.
- Is the folder sparse? If a topic clearly needs 5 files but only has 2, create the missing 3.

When creating a new file: use the numbered naming convention, choose the number that fits the
learning sequence (not just the next available), and follow the correct format mode.

**Cross-reference: notes → interview prep**

After reviewing all note files, scan en/{FILE}.md for concepts covered in the notes but with no
corresponding interview question. For each gap, add the missing question to both en/ and es/.

---

## Part 2 — Interview Prep Audit

Read notes/interview-prep/en/{FILE}.md and notes/interview-prep/es/{FILE}.md.

**If either file does not exist:** create it now with a first set of questions covering the most
important concepts in {NOTES_PATH}. Create both en/ and es/ at the same time.

**Cross-reference: interview prep → notes**

Before the format check, scan every question in en/{FILE}.md. If a question covers a concept
with no corresponding note file in {NOTES_PATH}, create the note file now (following Step 2
format rules). Do not leave a concept Victor is expected to answer without study material.

**Mandatory format check**

Every question must follow this exact structure:

**Question?**

Answer text here.

> **Junior tip:** short advice (English)
> **Consejo de entrevista:** same advice (Spanish)

Red flag answer: what a weak answer looks like and why it fails.

Rules:
- Blank line between the bold question and the answer
- Blank line between the answer and the Junior tip block
- Junior tip uses `>` blockquote — one line English, one line Spanish
- Not every question needs a Junior tip — only conceptual questions
- Red flag answers are optional but encouraged for decision-based and pressure questions

Fix every violation before moving to the 4-section audit. Apply the same fix to both files.

---

**4-section audit:**

**1. Missing topics**
Topics not covered yet that Spanish consultancies would ask. One sentence per topic explaining why.

**2. Weak answers**
Answers too vague, too theoretical, or without a real project reference.
Quality bar: "could I explain every word of this answer if the interviewer pressed me?"

**3. Imbalances**
Count questions by type: Conceptual / Decision-based / Pressure.
Target: 55% conceptual / 35% decision-based / 10% pressure.
Flag any section with no decision or pressure questions.

**4. Missing questions**
All questions not yet in the file that a Spanish consultancy would realistically ask.
Do not cap at 3–5 — add every question needed until the file is genuinely complete.

Format for each new question:

**Question as an interviewer at a Spanish consultancy would ask it?**

Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

> **Junior tip:** short advice on how to explain it clearly in an interview (English)
> **Consejo de entrevista:** same advice in Spanish

Red flag answer: what a weak candidate would say and why it fails.

---

After auditing each section, give a section status:
- ✅ Complete — thorough coverage; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved
- ➕ Added — new section or questions created from scratch

A section is complete when:
- Every question a Spanish consultancy would realistically ask is covered
- The ratio is on target
- Every answer passes the "explain every word" test
- At least one decision-based question references a real project by name

---

## Part 3 — Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

Rules for every new or updated interview question:
- Add to BOTH en/{FILE}.md and es/{FILE}.md — same question, same answer, same section, translated
- Answers must be interview-ready — what Victor would actually say out loud
- Group new questions under the correct section heading
- Add a Junior Tip to every new conceptual question

Question format:

**Question?**

Answer text here. One or two sentences. Reference a project when relevant.

> **Junior tip:** short advice (English)
> **Consejo de entrevista:** same advice (Spanish)

Red flag answer: what a weak answer looks like and why it fails.

Normalize existing questions: add blank lines where missing, in both en/ and es/.

After all edits, print a final summary:

**Structural changes:**
List any files moved, renamed, deleted, or created.

**future-learning candidates:**
List any concepts from `future-learning.md` that have become relevant.

**Content summary table:**

| Area | Notes | Interview Prep |
|------|-------|----------------|
| [section name] | ✅ / 🔧 / ➕ | ✅ / 🔧 / ➕ |

Then show the commit message:

```
git add <files changed>
```
```
git commit -m "docs: audit {TOPIC} notes and interview prep — <one line summary of main fixes>"
```
```
