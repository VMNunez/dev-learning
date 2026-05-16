# Notes Audit Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Useful after a study session when you want to check and improve the notes for one topic — without running a full interview prep audit. For a combined notes + interview prep audit, use `notes-audit-prompt.md` instead.

---

**How to use:**
1. Fill in `TOPIC` — the subject to audit (e.g. Angular, SQL, Java, Spring Boot)
2. Fill in `NOTES_PATH` — the notes folder to review (e.g. `notes/angular/`, `notes/sql/`)
3. Paste the entire prompt below into a new chat

---

```
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/]

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/java/ AND notes/spring-boot/ — read both, because Spring Boot
  code uses Java language concepts.
- Java: focus on language concepts needed to write Spring Boot code — classes, interfaces,
  annotations, generics, exceptions, Maven. Skip Java concepts that don't appear in a Spring Boot context.
- SQL: database is PostgreSQL. Focus on PostgreSQL syntax and behaviour. Flag any PostgreSQL-specific
  detail consultancies would ask about (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want a technical audit of my study notes for {TOPIC}.

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

If no TODOs are found, skip this section and move directly to the audit.

---

## Audit — Technical Foundation & Gaps

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

**Updating `future-learning.md`:**
If during the audit a concept is identified that is real and worth knowing — but beyond Victor's
current scope (too advanced for a junior screening, depends on Phase 3 topics, or belongs to a
future project) — add it to `future-learning.md` in {NOTES_PATH}. Do not create a full note file
for concepts that are not yet relevant. `future-learning.md` is the right place for anything
that is genuine but premature. If the file already lists the concept, leave it as is.

---

## Execution

Apply all fixes directly to the files. Do not just report and leave them broken.

After all edits, print a final summary table:

| File | Status |
|------|--------|
| [filename] | ✅ / 🔧 / ➕ |

Then show the commit message so Victor can run it himself.
Commit format: docs: audit {TOPIC} notes — <one line summary of main fixes>
Example: docs: audit angular notes — add lazy loading file and fix interceptor explanation
```
