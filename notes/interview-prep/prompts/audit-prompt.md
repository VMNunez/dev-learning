# Interview Prep Audit Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

---

**How to use:**
1. Fill in `FILE` — the interview prep filename without extension
2. Fill in `SECTION` — which section to audit (`all` for the full file, or the exact heading like `## Routing`)
3. Paste the entire prompt below into a new chat

---

```
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

FILE = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general]
       → notes/interview-prep/en/{FILE}.md
       → notes/interview-prep/es/{FILE}.md

SECTION = [all | ## Routing | ## Forms | ## JOINs | ...]
          → "all" audits every section in the file
          → Use the exact section heading to audit only that part (e.g. "## Transactions")

Notes on specific files:
- spring-boot: questions about the Spring Boot framework (auto-configuration, controllers, beans, JPA).
  Java language questions live in java.md, not here.
- java: focus on language concepts needed to write Spring Boot code — classes, interfaces,
  annotations, generics, exceptions, Maven. Skip Java concepts that don't appear in a Spring Boot context.
- sql: database is PostgreSQL. Flag any PostgreSQL-specific behaviour consultancies would ask about
  (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- general: questions that don't belong to a specific technology (debugging, teamwork, process, git workflow).

Use FILE and SECTION wherever the prompt refers to {FILE} or {SECTION}.

---

You are auditing my interview preparation files for a junior Angular + Java Spring Boot
position at Spanish IT consultancies (NTT Data, Capgemini, Indra, and similar) in 2026.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, note format
conventions, and interview prep rules.

---

## Who I am and what I need

I am Victor, 31 years old. I am preparing for my first junior developer job at Spanish IT
consultancies (NTT Data, Capgemini, Indra, and similar) with a target date of August 2026.

My stack: Angular (frontend) + Spring Boot (backend, Java) + PostgreSQL (database).

My differentiator: most candidates in Spain apply with React. I am going with Angular + Spring
Boot, which is what large consultancies actually use internally — this makes me stand out if
I can demonstrate real understanding and real decisions, not just syntax knowledge.

I currently have an internship (Next.js + TypeScript + MySQL) which counts as real work
experience on my CV even though the stack is different.

Level: Junior to Junior-Mid. I need to sound like someone who makes decisions and can explain
them — not someone who followed a tutorial and memorised the steps.

What Spanish consultancies actually look for in 2026:
- Can you explain every line of code you wrote? (AI writes boilerplate; juniors who can't
  explain it get filtered out immediately)
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
- 07: finance tracker (in progress) — Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate, PostgreSQL, Docker, Angular

Files to audit:
- notes/interview-prep/en/{FILE}.md
- notes/interview-prep/es/{FILE}.md
- If SECTION is not "all", locate the {SECTION} heading in both files and audit only the content
  under that heading (up to the next ## heading).

---

## Pre-audit — Resolve TODOs

Before starting, scan {SECTION} in both en/{FILE}.md and es/{FILE}.md for any TODO markers.
These can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO` — Victor adds them while
reading to mark things he wants corrected or improved.

For each TODO found:
1. Identify exactly what Victor wants changed
2. Apply the fix to the en/ file at that exact location
3. Apply the same fix (translated) to the es/ file at the same position
4. Remove the TODO marker after fixing
5. Report what was changed before moving on

If no TODOs are found, skip this section and move directly to the format check.

---

## Format check — mandatory before the audit

Every question in the file must follow this exact structure:

**Question as an interviewer at a Spanish consultancy would ask it?**

Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

> **Junior tip:** short advice on how to explain it clearly in an interview (English)
> **Consejo de entrevista:** same advice in Spanish

Red flag answer: what a weak candidate would say and why it fails.

Rules:
- There must be a blank line between the bold question and the answer.
- There must be a blank line between the answer and the Junior tip block.
- The Junior tip block uses `>` blockquote syntax — one line for English, one for Spanish.
- Not every question needs a Junior tip — only conceptual questions.
- Red flag answers are optional but encouraged for decision-based and pressure questions.

Scan every question in {SECTION} of both en/{FILE}.md and es/{FILE}.md.
Fix any violation immediately before moving on to the audit. Apply the same fix to both files.
Report what was fixed.

---

## Audit — 4 sections

**1. Missing topics**
Topics not covered in {SECTION} that Spanish consultancies would ask, given my stack and target
companies. One sentence per topic explaining why they would ask it.

**2. Weak answers**
Answers that are too vague, too theoretical, or that do not reference a real project.
Quote the weak part and explain what is missing.
Quality bar: every answer must pass this test — "could I explain every word of this answer
if the interviewer pressed me?" If not, the answer is weak.

**3. Imbalances**
Count questions by type: Conceptual / Decision-based / Pressure.
Give the count and percentage per type.
Target ratio: 55% conceptual / 35% decision-based / 10% pressure.
Flag any section that is all-conceptual with no decision or pressure questions.

**4. Missing questions**
All questions not yet in {SECTION} that a Spanish consultancy would realistically ask.
Do not cap at 3–5 — add every question needed until the section is genuinely complete.

Format for each new question:

**Question as an interviewer at a Spanish consultancy would ask it?**

Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

> **Junior tip:** short advice on how to explain it clearly in an interview (English)
> **Consejo de entrevista:** same advice in Spanish

Red flag answer: what a weak candidate would say and why it fails.

---

## Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

Rules for every new or updated question:
- Add to BOTH en/{FILE}.md and es/{FILE}.md — same question, same answer, same section,
  translated. Never add to one without the other.
- Answers must be interview-ready — what I would actually say out loud, not a textbook
  definition. Reference a specific project when the question is about a pattern or decision.
- Group new questions under the correct section heading.
- Add a Junior Tip to every new conceptual question.

After auditing {SECTION}, give it a status:
- ✅ Complete — thorough coverage for the job target; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved in this session
- ➕ Added — new section or questions created from scratch

A section is complete when:
- Every question a Spanish consultancy would realistically ask about this topic is covered
- The ratio is on target (55% conceptual / 35% decision-based / 10% pressure)
- Every answer passes the "explain every word" test — no purely theoretical answers
- At least one decision-based question references a real project by name
- There are no obvious gaps that would make Victor look unprepared in a screening

Do not stop at 2 or 3 questions. Add as many as needed until the section is genuinely
interview-ready. A weak junior gets filtered out because one topic was thin.
Better to over-prepare one section than to have a gap a recruiter finds first.

After all edits, show the commit message so Victor can run it himself.
Commit format: docs: audit {FILE} interview prep — <one line summary of main fixes>
Example: docs: audit angular interview prep — add routing decision questions and fix weak guards answers
```
