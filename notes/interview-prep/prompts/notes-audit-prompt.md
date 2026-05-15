# Notes + Interview Prep Deep Audit Prompt

Use in a **separate conversation**. Fill in the three values in the configuration block at the top of the prompt below, then paste everything into a new chat.

---

**How to use:**
1. Fill in `TOPIC` — the subject to audit (e.g. Angular, CSS, JavaScript, TypeScript, SQL, Java, Spring Boot)
2. Fill in `NOTES_PATH` — the notes folder to review (e.g. `notes/angular/`, `notes/java/spring-boot/`)
3. Fill in `FILE` — the interview prep filename without extension (e.g. `angular`, `css`, `sql`, `java`)
4. Paste the entire prompt below (configuration block included) into a new chat

---

```
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/]
FILE = [angular | css | javascript | typescript | sql | java | spring-boot | architecture | git | general]
       → notes/interview-prep/en/{FILE}.md
       → notes/interview-prep/es/{FILE}.md

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/java/ AND notes/spring-boot/ — read both, because Spring Boot
  code uses Java language concepts. Set FILE = spring-boot.
- General: no notes folder. Skip Part 1 and run Part 2 (interview prep audit) only.
- Java: focus on language concepts only. Spring Boot framework questions live in spring-boot.md, not java.md.

Use these three values wherever the prompt refers to {TOPIC}, {NOTES_PATH}, or {FILE}.

---

I want a deep technical audit of my study notes and interview prep for {TOPIC}.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, note format
conventions, and interview prep rules.

---

## Who I am and what I need

I am Victor, 31 years old. I am preparing for my first junior developer job at Spanish IT
consultancies (NTT Data, Capgemini, Indra, and similar) with a target date of August 2026.

My stack: Angular (frontend) + Spring Boot (backend, Java) + PostgreSQL (database).
Spring Boot is the primary backend target — not just Java generically. If the topic is Java,
focus on what is needed to understand and write Spring Boot code: classes, interfaces,
annotations, generics, exceptions, Maven. Skip Java concepts that do not appear in a
Spring Boot context.
If the topic is SQL, the database is PostgreSQL. Focus on PostgreSQL syntax and behaviour.
At junior level most SQL is the same across engines, but flag any PostgreSQL-specific detail
that consultancies would ask (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).

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
- Notes: {NOTES_PATH}
- Interview prep: notes/interview-prep/en/{FILE}.md and notes/interview-prep/es/{FILE}.md

---

## Pre-audit — Resolve TODOs

Before starting Part 1, scan both en/{FILE}.md and es/{FILE}.md for any TODO markers.
These can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO` — Victor adds them while
reading to mark things he wants corrected or improved.

For each TODO found:
1. Identify exactly what Victor wants changed
2. Apply the fix to the en/ file at that exact location
3. Apply the same fix (translated) to the es/ file at the same position
4. Remove the TODO marker after fixing
5. Report what was changed before moving on to Part 1

If no TODOs are found, skip this section and move directly to Part 1.

---

## Part 1 — Technical Foundation & Gaps

Read all files in {NOTES_PATH}.

1. Identify fundamental concepts missing that a Spanish consultancy would use to filter
   candidates in a first technical screening. One sentence per gap explaining why they ask it.
   Skip any file named `future-learning.md` — it is a roadmap file, not a study note.

2. Check if every note follows these teaching rules:
   - Does it explain the WHY before the code?
   - Does it identify repeating patterns and name them explicitly?
   - Does it link to the exact official documentation page (not just the main docs site)?
   - Does it read like a personal learning guide, not like documentation? Test: would this
     sentence appear word-for-word on the official docs site? If yes, rewrite it in Victor's voice.

3. When creating new note files or significantly rewriting existing ones, follow the
   notes/angular/ style — that is the reference model. Concretely:

   - **Personal, conversational voice.** Write for Victor. "You use this when..." not
     "This is used when...". "This is why it matters:" not "This is relevant because:".
   - **Call out gotchas and "why not X" moments.** When there is a common mistake or a
     tempting shortcut that is wrong, name it explicitly. Use a **Why not X?** subheading
     or a > blockquote. Example: "Why not just return the object directly? Because you
     always get 200, even when you created something (which should be 201)."
   - **Write in learning order — start with the problem, not the concept.** The concept
     exists because something was painful without it. Lead with that pain. "Before Spring
     Boot, you had to configure Tomcat separately and write XML to wire beans. Spring Boot
     removes all of that." Not: "Spring Boot is a framework that provides auto-configuration."
   - **Inline tips for non-obvious things.** Use > blockquote callouts for things that are
     easy to get wrong or that only make sense after you've hit them in practice. These are
     the notes a senior would whisper to a junior during a code review.
   - **Reference real projects.** If the concept was used in project 05 or 06, say so.
     "This is the same pattern as MatDialog.open() in project 05 — same idea, different layer."
   - **Do not write documentation.** If the note could be copy-pasted onto the official docs
     site unchanged, it is wrong. Notes capture what Victor learned and why it clicked —
     not a neutral description of what the framework does.

4. For each note file, give a coverage status:
   - ✅ Complete — solid coverage for a junior screening at a Spanish consultancy
   - 🔧 Fixed — gaps found and resolved in this session
   - ➕ Added — new content created from scratch

**Apply all fixes directly to the note files.**

**Creating new files — proactive, not reactive.**
Do not wait for a gap in rule #1 to justify creating a new file. After reading the existing
notes, assess the full learning sequence as a whole:

- Can Victor sit down with files 01 through N and learn the topic end-to-end without looking
  elsewhere for the basics? If not, the missing pieces need their own files.
- Is there a logical progression? Each file should build on the previous one. A concept that
  depends on something not yet covered is in the wrong place.
- Is the folder sparse? If a topic has 2 files but clearly needs 5 to be learnable, create the
  missing 3. Do not leave holes in the sequence just because no specific "gap" was flagged.

The notes/ folder is Victor's personal textbook for that topic. It should be complete enough
that he can open file 01 and learn the topic from scratch — concise, personal, in order.

When creating a new file, follow the numbered naming convention (e.g. 16-topic-name.md) and
choose the number that fits logically in the learning sequence — not just the next available
number. Update the "next file:" counter for that folder in CLAUDE.md after all new files are
created.

---

## Part 2 — Interview Prep Audit

Read notes/interview-prep/en/{FILE}.md and notes/interview-prep/es/{FILE}.md.

**Before the 4-section audit — mandatory format check:**

Every question in the file must follow this exact structure:

**Question?**

Answer text here.

> **Junior tip:** short advice (English)
> **Consejo de entrevista:** same advice (Spanish)

Red flag answer: what a weak answer looks like and why it fails.

Rules:
- There must be a blank line between the bold question and the answer.
- There must be a blank line between the answer and the Junior tip block.
- The Junior tip block uses `>` blockquote syntax — one line for English, one for Spanish.
- Not every question needs a Junior tip — only conceptual questions.
- Red flag answers are optional but encouraged for decision-based and pressure questions.

Scan every question in both en/{FILE}.md and es/{FILE}.md. Fix any violation immediately
before moving on to the 4-section audit. Apply the same fix to both files.

---

Run a 4-section audit:

**1. Missing topics**
Topics not covered yet that Spanish consultancies would ask, given my stack and target
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

After auditing each section of the interview prep file, give a section status:
- ✅ Complete — thorough coverage for the job target; no action needed
- 🔧 Fixed — gaps or weak answers found and resolved in this session
- ➕ Added — new section or questions created from scratch

A section is complete when:
- Every question a Spanish consultancy would realistically ask about this topic is covered
- The ratio is on target (55% conceptual / 35% decision-based / 10% pressure)
- Every answer passes the "explain every word" test — no purely theoretical answers
- At least one decision-based question references a real project by name
- There are no obvious gaps that would make Victor look unprepared in a screening

Do not stop at 2 or 3 questions per section. Add as many as needed until the section is
genuinely interview-ready. A weak junior gets filtered out because one topic was thin.
Better to over-prepare one section than to have a gap a recruiter finds first.

---

## Part 3 — Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

Rules for every new or updated interview question:
- Add to BOTH en/{FILE}.md and es/{FILE}.md — same question, same answer, same section,
  translated. Never add to one without the other.
- Answers must be interview-ready — what I would actually say out loud, not a textbook
  definition. Reference a specific project when the question is about a pattern or decision.
- Group new questions under the correct section heading.
- Add a Junior Tip to every new conceptual question (see format in Part 2 above).

Question format — use this exact structure for every new or updated question:

**Question?**

Answer text here. One or two sentences. Reference a project when relevant.

> **Junior tip:** short advice (English)
> **Consejo de entrevista:** same advice (Spanish)

Red flag answer: what a weak answer looks like and why it fails.

The blank line between the question and the answer is required — it keeps the .md readable
in both raw and rendered view.

Normalize existing questions too: if any question in the file has no blank line between the
bold question and the answer, add it. Apply the same normalization to both en/ and es/.

After all edits, print a final summary table:

| Area | Notes | Interview Prep |
|------|-------|----------------|
| [section name] | ✅ / 🔧 / ➕ | ✅ / 🔧 / ➕ |

Then show the commit message so Victor can run it himself.
Commit format: docs: audit {TOPIC} notes and interview prep — <one line summary of main fixes>
Example: docs: audit angular notes and interview prep — add lazy loading gaps and decision questions
```
