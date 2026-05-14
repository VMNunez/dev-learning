# Notes + Interview Prep Deep Audit Prompt

Use in a **separate conversation**. Fill in the two blanks before pasting.
Update the project list as new projects are completed.

---

**How to use:**
1. Fill in `[TOPIC]` — the subject to audit (e.g. Angular, CSS, JavaScript, TypeScript, SQL, Java)
2. Fill in `[NOTE PATHS]` — the notes folder to review (e.g. `notes/angular/`)
3. Fill in `[FILE]` — the interview prep filename without extension (e.g. `angular`, `css`, `sql`, `java`)
4. Paste the prompt below into a new chat

---

```
I want a deep technical audit of my study notes and interview prep for [TOPIC].

Before starting, read:
- CLAUDE.md — for my teaching rules, note format conventions, interview prep rules,
  and full learning context
- notes/interview-prep/prompts/audit-prompt.md — for the 4-section audit logic and format
- notes/interview-prep/prompts/generate-prompt.md — for the output format of new questions

---

## Who I am and what I need

I am Victor, 31 years old. I am preparing for my first junior developer job at Spanish IT
consultancies (NTT Data, Capgemini, Indra, and similar) with a target date of August 2026.

My stack: Angular + Java Spring Boot.
My differentiator: most candidates in Spain apply with React. I am going with Angular + Java,
which is what large consultancies actually use internally — this makes me stand out if I can
demonstrate real understanding, not just syntax knowledge.

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
- 07: finance tracker (in progress) — Spring Boot REST API, JWT auth, PostgreSQL, Angular

Files to audit:
- Notes: [NOTE PATHS]
- Interview prep: notes/interview-prep/en/[FILE].md and notes/interview-prep/es/[FILE].md

---

## Part 1 — Technical Foundation & Gaps

Read all files in [NOTE PATHS].

1. Identify fundamental concepts missing that a Spanish consultancy would use to filter
   candidates in a first technical screening. One sentence per gap explaining why they ask it.
   Skip any file named `future-learning.md` — it is a roadmap file, not a study note.

2. Check if every note follows the teaching rules in CLAUDE.md:
   - Does it explain the WHY before the code?
   - Does it identify repeating patterns and name them explicitly?
   - Does it link to the exact official documentation page (not just the main docs site)?

3. For each note file, give a coverage status:
   - ✅ Complete — solid coverage for a junior screening at a Spanish consultancy
   - 🔧 Fixed — gaps found and resolved in this session
   - ➕ Added — new content created from scratch

Apply all fixes directly to the note files. If a concept needs its own file, create it
following the numbered naming convention (e.g. 16-topic-name.md) and update the
"next file:" counter for that folder in CLAUDE.md.

---

## Part 2 — Interview Prep Audit

Follow the 4-section format from notes/interview-prep/prompts/audit-prompt.md exactly.

Prioritisation rule: there must be enough conceptual questions to survive a technical
screening. Decision-based questions linked to my projects are what stop me from sounding
like a tutorial-only student. Every answer must pass this test: "could I explain every
word of this answer if the interviewer pressed me?" If not, the answer is weak.

Target ratio: 55% conceptual / 35% decision-based / 10% pressure.

After auditing each section of the interview prep file, give a section status:
- ✅ Complete — enough coverage and question variety for the job target; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved in this session
- ➕ Added — new section or questions created from scratch

A section is complete when:
- It has at least 2–3 questions
- At least one question is decision-based or references a real project
- No answers are purely theoretical (they all pass the "explain every word" test)
- The ratio is roughly on target for that section

---

## Part 3 — Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

Rules for every new interview question:
- Follow the output format from notes/interview-prep/prompts/generate-prompt.md
- Add it to BOTH en/[TOPIC].md and es/[TOPIC].md — same question, same answer, same
  section, translated. Never add to one without the other.
- For every new conceptual question, add a Junior Tip:

  > **Junior tip:** short advice on how to explain it clearly in an interview  (English)
  > **Consejo de entrevista:** same advice in Spanish

- Answers must be interview-ready — what I would actually say out loud, not a textbook
  definition. Reference a specific project when the question is about a pattern or decision.
- Group new questions under the correct section heading.

After all edits, print a final summary table:

| Area | Notes | Interview Prep |
|------|-------|----------------|
| [section name] | ✅ / 🔧 / ➕ | ✅ / 🔧 / ➕ |

Then commit everything on the current branch with a single commit.
Commit format: docs: audit [TOPIC] notes and interview prep — <one line summary of main fixes>
Example: docs: audit css notes and interview prep — add box model gaps and decision questions
```
