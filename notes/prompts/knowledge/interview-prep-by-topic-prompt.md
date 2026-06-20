# Interview Prep by Topic Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

---

**How to use:**

1. Fill in `FILE` — the interview prep filename without extension
2. Fill in `SECTION` — which section to audit (`all` for the full file, or the exact heading like `## Routing`)
3. Paste the entire prompt below into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

FILE = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general | security]
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
- security: covers authentication vs authorisation, hashing, JWT design, CORS, XSS, CSRF, SQL injection.

Use FILE and SECTION wherever the prompt refers to {FILE} or {SECTION}.

---

You are auditing my interview preparation files for a junior Angular + Java Spring Boot
position at Spanish IT consultancies (NTT Data, Capgemini, Indra, and similar) in 2026.

Before starting, read CLAUDE.md — it has the full project context, teaching rules, and subfolder structure.

---

## Who I am and what I need

I am Victor, 31 years old. I am preparing for my first junior developer job at Spanish IT
consultancies (NTT Data, Capgemini, Indra, and similar) with a target date of August 2026.

My stack: Angular (frontend) + Spring Boot (backend, Java) + PostgreSQL (database).

My differentiator: most candidates in Spain apply with React. I am going with Angular + Spring
Boot, which is what large consultancies actually use internally — this makes me stand out if
I can demonstrate real understanding and real decisions, not just syntax knowledge.

I completed an internship in June 2026 (Next.js + TypeScript + MySQL) — real work experience
on my CV even though the stack is different.

Level: Junior to Junior-Mid. I need to sound like someone who makes decisions and can explain
them — not someone who followed a tutorial and memorised the steps.

What Spanish consultancies actually look for in 2026:
- Can you explain every line of code you wrote? (AI writes boilerplate; juniors who can't
  explain it get filtered out immediately)
- Did you make architectural decisions, or did you just follow a tutorial?
- Can you read and understand code written by someone else?
- Do you have any real project or work experience?
- Can you write and understand tests?

My projects (CLAUDE.md and PROGRESS.md are authoritative — use them if this list is outdated):
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: TimeTrack (in progress) — Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate, PostgreSQL, Docker, Angular

Files to audit:
- notes/interview-prep/en/{FILE}.md
- notes/interview-prep/es/{FILE}.md
- If SECTION is not "all", locate the {SECTION} heading in both files and audit only the content
  under that heading (up to the next ## heading).
- If {SECTION} is not found in one file: create it as an empty section in that file before
  proceeding.
- If {SECTION} is not found in either file: create it in both files as empty sections, then
  move directly to audit section 1 to populate it from scratch.

---

## Question types — definitions

Every question belongs to one of three types. Use these definitions throughout the audit to
classify existing questions, assign Junior tips, decide on Red flags, and count ratios.

- **Conceptual** — asks "what is X?" or "how does X work?" Tests whether the candidate
  understands a concept, not just its syntax. Example: "What is @Transactional and what
  does it do?" Only Conceptual questions get a Junior tip block.
- **Decision-based** — asks "why did you choose X?" or "when would you use X instead of Y?"
  Tests whether the candidate can justify architectural decisions and knows tradeoffs.
  Example: "Why did you use JWT instead of sessions?" Encouraged to have a Red flag answer.
- **Pressure** — a gotcha, an edge case, or a code snippet with a bug. Tests depth of
  understanding and exposes shallow knowledge. Example: "What happens if you put @Transactional
  on a private method?" Encouraged to have a Red flag answer.

Target ratio per section: 55% Conceptual / 35% Decision-based / 10% Pressure.

---

## Pre-audit — Sync check

Before doing anything else, check that en/{FILE}.md and es/{FILE}.md are in sync.

List the sections and question count from each file side by side. If a section exists in one
file but not the other, or if the question count for any section differs:
1. Report the mismatch clearly.
2. Bring the files into sync: create the missing section or questions in the file that is
   behind, based on the content in the more complete file (translated).
3. Only after both files are in sync, move on to the TODO step.

If the files are already in sync, skip this step and move directly to the TODO step.

---

## Pre-audit — Resolve TODOs

Scan {SECTION} in both en/{FILE}.md and es/{FILE}.md for any TODO markers.
These can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO` — Victor adds them while
reading to mark things he wants corrected or improved.

For each TODO found:
1. Identify exactly what Victor wants changed.
2. Apply the fix to the en/ file at that exact location.
3. Apply the same fix (translated) to the es/ file at the same position.
4. Remove the TODO marker after fixing.
5. Report what was changed before moving on.

If no TODOs are found, skip this section and move directly to the coverage.md check.

**Pattern detection — after resolving all TODOs:**
If 2 or more TODOs reflect the same type of correction (e.g. always rewriting passive answers
to use "I used", always adding a project reference, always removing theoretical definitions),
this is a personal preference that should become a permanent rule — not a repeated manual fix.
Report it in the Summary section at the end as a recommended prompt change: one specific
sentence to add that would prevent the same correction from being needed in future runs.
Do not add the rule yourself — Victor decides whether to accept it.

---

## Pre-audit — coverage.md check

Before reading the interview prep files, read the coverage.md for this topic:
- For most files: `notes/{FILE}/coverage.md`
- For spring-boot: `notes/spring-boot/coverage.md`
- For java: `notes/java/coverage.md`

If coverage.md exists:
- List every concept it contains.
- As you audit {SECTION}, verify that every concept from that list has at least one question.
- Concepts in coverage.md with no question are required additions — treat them the same as
  missing topics in audit section 1, regardless of whether you would have thought of them
  independently.
- When you add a question for a concept that was in coverage.md, note it as
  "coverage.md concept — added" in your report.

If coverage.md does not exist, skip this step and rely on your knowledge of what junior
Angular + Spring Boot interviews at Spanish consultancies require.

---

## Format check — mandatory before the audit

Every question in the file must follow this exact structure:

**Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

Answer in 1–2 sentences. Include a real example from my projects when the question is about
a pattern or decision.

> **Junior tip:** short advice on how to explain it clearly in an interview (English)
> **Consejo de entrevista:** same advice in Spanish

Red flag answer: what a weak candidate would say and why it fails.

Rules:
- There must be a blank line between the bold question and the answer.
- There must be a blank line between the answer and the Junior tip block.
- The Junior tip block uses `>` blockquote syntax — one line for English, one for Spanish.
- Only **Conceptual** questions get a Junior tip (see "Question types" above for the definition).
- Red flag answers are optional but encouraged for Decision-based and Pressure questions.
- Every question must have a priority marker (⭐⭐⭐, ⭐⭐, or ⭐) at the end of the bold
  question line, after the question mark.

Scan every question in {SECTION} of both en/{FILE}.md and es/{FILE}.md.
Fix any violation immediately before moving on to the audit. Apply the same fix to both files.
Report what was fixed.

---

## Priority markers — assign and order

Every question must carry a priority marker indicating how often this question is asked at
Spanish consultancies in a junior interview for {FILE}:

- ⭐⭐⭐ — Asked in almost every interview for this topic. A candidate who cannot answer this
  would be filtered out immediately.
- ⭐⭐ — Asked often. Worth knowing well. A candidate who cannot answer it leaves a weak impression.
- ⭐ — Asked sometimes. Good to have, but missing it is not a dealbreaker.

**Criteria for ⭐⭐⭐:**
- The concept is foundational — it appears in any non-trivial project using this technology.
- The concept is commonly misunderstood or often confused with something similar.
- Not knowing it would cause the interviewer to doubt the candidate's basic competence.

**Apply to all questions in {SECTION}:**
1. Every question that already exists without a marker gets one assigned now.
2. Every new question added in this session gets a marker from the start.
3. Within each section, reorder questions so ⭐⭐⭐ come first, then ⭐⭐, then ⭐.
   Reorder only within a section — never move questions across sections.

Place the marker at the end of the bold question line, after the question mark:

**What is @Transactional and what does it do?** ⭐⭐⭐

---

## Audit — 4 sections

**1. Missing topics**
Topics not covered in {SECTION} that Spanish consultancies would ask, given my stack and
target companies. Include any concept from coverage.md (if it exists) that has no question yet.
One sentence per topic explaining why they would ask it.

When a topic you identify is NOT in coverage.md, flag it with `[coverage gap]` so Victor can
add it to coverage.md in a separate run.

**2. Weak answers**
Answers that are too vague, too theoretical, or that do not reference a real project when
the question is about a pattern or decision.
Quote the weak part, explain what is missing, then rewrite the answer directly in both
en/ and es/ files. Do not leave a weak answer in place after identifying it.

Quality bar: every answer must pass this test — "could I explain every word of this answer
if the interviewer pressed me?" If not, the answer is weak.

  **Weak:** "¿Qué es un interceptor en Angular? — Es una clase que intercepta las peticiones HTTP y permite modificarlas."
  **Strong:** "¿Qué es un interceptor en Angular? — Es una función que se ejecuta antes de cada petición HTTP. La usé en el proyecto 06 para añadir el token JWT automáticamente a todas las cabeceras — sin el interceptor, tendría que añadirlo manualmente en cada llamada al servicio."
  The strong answer references a real project, explains the problem it solves, and uses "I used it" — not "it is used".

**3. Imbalances**
Count questions by type using the definitions in the "Question types" section above.

When SECTION = "all": report the count and percentage per type for each section separately.
When SECTION is a specific heading: report the count and percentage for that section only.

Target ratio per section: 55% Conceptual / 35% Decision-based / 10% Pressure.
Flag any section where Decision-based or Pressure questions are completely absent.

**4. Missing questions**
All questions not yet in {SECTION} that a Spanish consultancy would realistically ask.
Do not cap at 3–5 — add every question needed until the section is genuinely complete.
Assign a priority marker to each new question.
Flag any new question whose concept is not in coverage.md with `[coverage gap]`.

Format for each new question:

**Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

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
- Add a Junior tip to every new Conceptual question (see "Question types" for the definition).
- Every question must have a priority marker (⭐⭐⭐, ⭐⭐, or ⭐).
- After adding new questions, reorder the section so ⭐⭐⭐ come first, then ⭐⭐, then ⭐.

After auditing {SECTION}, give it a status:
- ✅ Complete — thorough coverage for the job target; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved in this session
- ➕ Added — new section or questions created from scratch

A section is complete when ALL of these are true:
- Every concept in coverage.md for this topic has at least one question
- Every question a Spanish consultancy would realistically ask about this topic is covered
- The ratio is on target (55% Conceptual / 35% Decision-based / 10% Pressure) per section
- Every answer passes the "explain every word" test — no purely theoretical answers
- At least one Decision-based question references a real project by name
- Every question has a priority marker (⭐⭐⭐, ⭐⭐, or ⭐)
- Within each section, questions are ordered ⭐⭐⭐ → ⭐⭐ → ⭐
- There are no obvious gaps that would make Victor look unprepared in a screening

Do not stop at 2 or 3 questions. Add as many as needed until the section is genuinely
interview-ready. A weak junior gets filtered out because one topic was thin.
Better to over-prepare one section than to have a gap a recruiter finds first.

---

## Summary

After all edits, report the following. Omit any section that has nothing to report.

**Coverage gaps found** (concepts added that are not yet in coverage.md — add them there in a
separate run using coverage-prompt.md):
- [concept] — [one sentence: why it belongs in coverage]

**TODO patterns detected** (recommended prompt rule additions):
- [pattern] — [one specific sentence to add to this prompt to prevent the same correction
  from being needed again]

---

After all edits, show the commit message so Victor can run it himself. Always use this format — one command per code block:

```

git add notes/interview-prep/en/{FILE}.md notes/interview-prep/es/{FILE}.md

```

```

git commit -m "docs: audit {FILE} interview prep — <one line summary of main fixes>"

```
````
