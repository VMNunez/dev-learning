# Interview Prep Audit Prompt

Use in a **separate conversation** when you want to audit interview prep files only
(no notes review). For a full audit including notes, use `notes-audit-prompt.md` instead.

Before pasting, read CLAUDE.md for the complete context, teaching rules, and format conventions.
Update the project list as new projects are completed.

Files live in `notes/interview-prep/en/` (English) and `notes/interview-prep/es/` (Spanish).
Current files: `angular.md`, `typescript.md`, `architecture.md`, `general.md`, `javascript.md`,
`css.md`, `git.md`, `sql.md`, `java.md`. Both `en/` and `es/` must always stay in sync.

---

```
You are auditing my interview preparation files for a junior Angular + Java Spring Boot
position at Spanish IT consultancies (NTT Data, Capgemini, Indra, and similar) in 2026.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, note format
conventions, and interview prep rules.

I am Victor, 31 years old. I have an internship (Next.js + TypeScript + MySQL) which counts
as real work experience on my CV even though the stack is different.
My stack: Angular + Java Spring Boot.
My differentiator: most candidates in Spain apply with React. Angular + Java is what large
consultancies actually use — I stand out if I can demonstrate real understanding and decisions,
not just syntax knowledge.

What Spanish consultancies filter for in 2026:
- Can you explain every line of code you wrote?
- Did you make architectural decisions, or did you follow a tutorial?
- Can you write and understand tests?
- Do you have any real project or work experience?

My projects:
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: finance tracker (in progress) — Spring Boot REST API, JWT auth, PostgreSQL, Angular

Files to audit (specify which file or files before starting):

---

## Audit — 4 sections

**1. Missing topics**
Topics not covered yet that Spanish consultancies would ask, given my stack and target companies.
One sentence per topic explaining why they would ask it.

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

**4. Suggested new questions**
3 to 5 new questions not yet in the file, based on gaps found.
Format for each:

**Question?**
What they really want to know: one sentence.
A: interview-ready answer with project example.
Red flag answer: what a weak candidate would say and why it fails.

---

## Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

Rules for every new or updated question:
- Add to BOTH en/ and es/ files — same question, same answer, same section, translated.
  Never add to one without the other.
- For every new conceptual question, add a Junior Tip:

  > **Junior tip:** short advice on how to explain it clearly in an interview  (English)
  > **Consejo de entrevista:** same advice in Spanish

- Answers must be interview-ready — what I would actually say out loud, not a textbook
  definition. Always reference a specific project for pattern or decision questions.

After auditing each section, give it a status:
- ✅ Complete — sufficient coverage for a junior screening; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved in this session
- ➕ Added — new section or questions created from scratch

A section is complete when:
- It has at least 2–3 questions
- At least one question is decision-based or references a real project
- No answers are purely theoretical
- The ratio is roughly on target for that section

After all edits, commit everything on the current branch.
Commit format: docs: audit [topic] interview prep — <one line summary of main fixes>
```
