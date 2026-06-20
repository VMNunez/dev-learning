# Notes by Topic Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Useful after a study session when you want to check and improve the notes for one topic — without running a full interview prep audit. For a combined notes + interview prep audit, use `notes-and-interview-prep-prompt.md` instead.

---

**How to use:**

1. Fill in `TOPIC` — the subject to audit (e.g. Angular, SQL, Java, Spring Boot)
2. Fill in `NOTES_PATH` — the notes folder to review (e.g. `notes/angular/`, `notes/sql/`)
3. Paste the entire prompt below into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
NOTES_PATH = [notes/angular/ | notes/angular-material/ | notes/css/ | notes/javascript/ | notes/typescript/ | notes/sql/ | notes/java/ | notes/spring-boot/ | notes/architecture/ | notes/git/ | notes/general/ | notes/security/]

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/java/, notes/spring-boot/ (comma-separated — read both,
  because Spring Boot code uses Java language concepts). Both folders use structured mode.
  coverage.md lives in notes/spring-boot/ only — read it from there, not from notes/java/.
- Java: focus on language concepts needed to write Spring Boot code — classes, interfaces,
  annotations, generics, exceptions, Maven. Skip Java concepts that don't appear in a Spring Boot context.
- SQL: database is PostgreSQL. Focus on PostgreSQL syntax and behaviour. Flag any PostgreSQL-specific
  detail consultancies would ask about (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, browser storage, code principles.
  Uses conversational mode.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
  Uses conversational mode.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want a technical audit of my study notes for {TOPIC}.

Before starting, read CLAUDE.md — it has my full profile, teaching rules, and subfolder
structure with the "next file:" counters.

---

## Notes organisation rules

These rules apply both when auditing existing notes and when creating new ones.

**Folder placement — which concept goes where:**

| Concept type | Correct folder |
|---|---|
| Security concepts (CORS, XSS, JWT design, AuthN/AuthZ) | notes/security/ |
| Cross-cutting concepts (HTTP, JSON, env vars, testing, SOLID) | notes/general/ |
| Spring Boot implementation (annotations, filters, config, JPA) | notes/spring-boot/ |
| Pure Java language concepts | notes/java/ |
| Angular patterns and framework concepts | notes/angular/ |
| Angular Material components | notes/angular-material/ |
| Architecture patterns (REST, layered, MVC) | notes/architecture/ |

**Format modes:**

- `notes/java/` and `notes/spring-boot/` — **structured mode**: the file opens with a
  `# [Topic Name]` title followed by a general `Docs:` link to the main reference page
  for the whole topic; each section has three fields:
  `Purpose:` (one sentence — who calls it, when, and why), `File:` (real path to the project
  file where this code was applied — check PROGRESS.md to find which project covers this
  concept, then confirm in that project's PLANNING.md; if no project covers it yet, use a
  representative generic path or omit entirely), and `Docs:` (link to the exact sub-section
  to study with a note on what to read, e.g. `https://... → read: "Declaring Transactions"`);
  per-call explanations as bold items (`**.methodName()**`); use `##` to introduce each
  concept section
- All other folders — **conversational mode**: the file opens with a `# [Topic Name]` title
  followed by a general `Docs:` link to the main reference page for the whole topic; each section has a `Docs:` link that points to
  the exact sub-section to study and states what to read (e.g. `Docs: https://... → read:
  "Template syntax — Built-in control flow"`); no `Purpose:` or `File:` lines; prose
  explanations with code blocks — explanation comes before the code, not in dedicated
  metadata fields; use `##` for top-level topic sections and `###` for sub-concepts within
  them — when adding a section to an existing file, match the heading level already in use

**Living document rules:**

Notes are not written once and forgotten. After each concept is learned and the code is written
in a project, check the relevant notes file:
- If the concept is not documented, add it with a real code example from the current project
- If a section already exists with a code example, add a new sub-section within that file if
  the project introduces something meaningfully new — do not replace or edit the existing
  example, and do not add a duplicate for the same concept
- Never duplicate examples across files in the same folder

**IMPORTANT — existing text is final unless marked with TODO:**

Do not rewrite, rephrase, restructure, or change any text that already exists in a note file.
There are two reasons for this rule: either Victor has already read that section and the text
is exactly how he wants it, or he has not read it yet and should read the original — not a
version rewritten by AI. In both cases, the text stays untouched.

You may:
- Add new note files
- Add new sections to an existing file
- Resolve TODO markers (see Pre-audit section)

You may NOT:
- Reword sentences that are already written
- Change the structure or order of existing sections
- "Improve" or "update" existing text unless there is a TODO marker asking for it

If rule 2 of the audit identifies a note that does not follow teaching rules, report it in the
summary — but do not change the text. Victor decides whether to rewrite it.

Exception: if Victor explicitly asks you to fix the reported issues after seeing the
summary (in the same conversation), you may rewrite those sections — even without a TODO.

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

My projects:
- 01: todo list — components, signals, services, directives
- 02: weather app — HttpClient, RxJS, forkJoin, API integration
- 03: expense tracker — reactive forms, routing, localStorage, smart/dumb pattern
- 04: meal finder — route params, ActivatedRoute, effect(), favourites
- 05: task manager — Angular Material, MatTable, MatDialog, coordinator pattern
- 06: HR portal — route guards, lazy loading, HTTP interceptors, role-based access, CanDeactivate
- 07: TimeTrack (in progress) — Spring Boot REST API, JWT auth, Spring Data JPA + Hibernate, PostgreSQL, Docker, Angular

*(CLAUDE.md is authoritative for the current active project — if this list is outdated,
use what CLAUDE.md and PROGRESS.md say instead.)*

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

**Pattern detection — after resolving all TODOs:**
If 2 or more TODOs reflect the same type of correction (e.g., always changing passive to
active voice, always adding a "Why not X?" callout, always shortening code examples), this
is a personal preference that should become a permanent rule — not a repeated manual fix.
In that case, report it in the summary as a recommended prompt change: one specific sentence
to add to rule 3 that would prevent the same correction from being needed in future runs.
Do not add the rule yourself — Victor decides whether to accept it.

---

## Audit — Technical Foundation & Gaps

**Before reading note files — check coverage.md:**
If a `coverage.md` file exists in {NOTES_PATH}, read it first. It defines the minimum topics
that must be covered for Victor's objective (junior at a Spanish consultancy with Angular +
Spring Boot). Every item in that file is a required topic. Use it as the baseline alongside
rule 1 — any item not covered by an existing note file must be addressed during this audit.
Skip `coverage.md` when checking note quality in rule 2 — it is a checklist, not a study note.
If no `coverage.md` exists yet, skip this step and rely on rule 1 and your knowledge of what
junior Angular + Spring Boot interviews at Spanish consultancies require.

Read all files in {NOTES_PATH}.

1. Identify fundamental concepts missing that a Spanish consultancy would use to filter
   candidates in a first technical screening. One sentence per gap explaining why they ask it.
   Skip any file named `future-learning.md`, `coverage.md`, or `layer-reference.md` — these
   are reference files, not study notes. In general: skip any file in {NOTES_PATH} whose
   name does not start with a two-digit number.

   For each gap found, create the missing content using rule 3's writing standards. Create
   a new file if the concept covers multiple sub-topics or is independently searchable;
   add a section to an existing file if the concept is a direct extension of something
   already covered there.

2. Check if every note follows these teaching rules:
   - Does it explain the WHY before the code?
   - Does it identify repeating patterns and name them explicitly?
   - Is it in the correct format mode for its folder? (`notes/java/` and `notes/spring-boot/`
     → structured mode; all other folders → conversational mode)
   - Does the file open with a general `Docs:` link to the main reference page for the topic?
   - Does each section have a `Docs:` link that points to the exact sub-section to study and
     states what to read — not just a homepage link? (e.g. `Docs: https://... → read:
     "Declaring Transactions"`)
   - Does it read like a personal learning guide, not like documentation? Test: would this
     sentence appear word-for-word on the official docs site? If yes, report it in the summary
     — do not change the text; Victor decides whether to add a TODO and rewrite it.

  **Action rules for rule 2 violations:**
  - Missing `Docs:` links (file-level or section-level) → **add them directly**. They are
    new content, not modifications to existing text, so the "existing text is final" rule
    does not apply. Only add a link if you are certain of the correct URL and sub-section —
    if not, write `Docs: TODO — add link` instead of guessing. A wrong URL is worse than
    no link.
  - All other violations **in existing text** (wrong voice, wrong format mode, missing WHY,
    missing patterns) → **report in the summary only**. Do not change the text. Victor
    decides whether to add a TODO and fix it. New content you are creating must always
    follow rule 3 fully — these action rules only apply to existing text.

  **Bad note:** "`HttpClient` is a service that performs HTTP requests. It provides methods for all HTTP verbs including GET, POST, PUT, and DELETE."
  **Good note:** "`HttpClient` is Angular's way of calling external APIs. You inject it into a service (never a component) and it returns an Observable you subscribe to. Without it you would have to use the browser's `fetch` directly — Angular just wraps it and makes it injectable. Used in project 02 to call the weather API."
  The bad note reads like the official docs. The good note explains WHY you use it, WHERE it lives, and references a real project.

3. When creating new note files or adding new sections to existing files, follow these
   rules. The goal is notes that work as a personal study book — clear enough to learn
   from scratch and return to as a reference. Every concept needs enough explanation to
   understand it, not just recognise the syntax.

   - **Personal, conversational voice.** Write for Victor. "You use this when..." not
     "This is used when...". "This is why it matters:" not "This is relevant because:".
   - **Explain before the code.** Give 1–3 sentences of context before any code block —
     what the concept is, why it exists, when you reach for it. Do not open a section
     with a code block and no explanation.
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
   - **Reference real projects.** If a concept was practiced in one of Victor's projects,
     reference it with a real code fragment — not a fabricated example. To find it: check
     PROGRESS.md to identify which project covers this concept, then read that project's
     PLANNING.md to confirm, then search the project source code for the relevant fragment.
     (e.g. "This is the same pattern as MatDialog.open() in project 05 — same idea,
     different layer.")
   - **Do not write documentation.** If the note could be copy-pasted onto the official docs
     site unchanged, it is wrong. Notes capture what Victor learned and why it clicked —
     not a neutral description of what the framework does.
   - **Calibrate depth to complexity.** Simple syntax (a short annotation, a method call)
     needs one sentence. Complex concepts (JPA relationships, Spring Security filter chain,
     JWT flow) need a paragraph. Match the explanation length to how long it actually takes
     to understand the concept — not to a fixed template.
   - **Code concept sections (methods, classes, annotations):** *(structured mode — notes/java/
     and notes/spring-boot/ only)* each section starts with three metadata lines: `Purpose:` —
     one sentence: who calls it, when, and why; `File:` — real path to the file where this
     code was applied (e.g. `src/main/java/.../service/UserService.java`); check PROGRESS.md
     to find which project covers this concept, then confirm in that project's PLANNING.md,
     then locate the actual file; if no project covers it yet, use a representative generic
     path or omit entirely; `Docs:` — link to the exact sub-section to study with a
     note on what to read (e.g. `https://... → read: "Declaring Transactions"`). Then explain
     each important call or line with a bold item — what it does and why it matters, in plain
     language. Never include an Imports section — IntelliJ handles imports automatically.

4. For each note file, give a coverage status:
   - ✅ Complete — solid coverage for a junior screening at a Spanish consultancy
   - 🔧 Fixed — gaps found and resolved in this session
   - ➕ Added — new content created from scratch

**Apply all fixes to new content and TODO resolutions directly to the note files.**

**Creating new files — proactive, not reactive.**
Do not wait for a gap in rule #1 to justify creating a new file. After reading the existing
notes, assess the full learning sequence as a whole:

- Can Victor sit down with files 01 through N and learn the topic end-to-end without looking
  elsewhere for the basics? If not, the missing pieces need their own files.
- Is there a logical progression? Each file should build on the previous one. A concept that
  depends on something not yet covered is in the wrong place.
- Is the folder sparse? If a topic has 2 files but clearly needs 5 to be learnable, create the
  missing 3. Do not leave holes in the sequence just because no specific "gap" was flagged.

If rule 1 already created a file or section for a concept in this session, do not address
it again here.

Use `coverage.md` as the ceiling — do not create files for topics not listed there. The
proactive check is about sequence completeness, not scope expansion. If no `coverage.md`
exists, limit new files to concepts you identified as gaps in rule 1 — do not generate
additional files beyond those.

If the total number of new files to create in one session exceeds 3, create the first 3
in study-sequence order and report the remaining gaps in the summary — address them in
the next run.

The notes/ folder is Victor's personal textbook for that topic. It should be complete enough
that he can open file 01 and learn the topic from scratch — concise, personal, in order.

When creating new files, follow the numbered naming convention (e.g. 16-topic-name.md). Start
from the next available number listed in CLAUDE.md for that folder. If creating multiple files
in one session, assign numbers in the order they should be studied — not the order you happen
to write them. Update the "next file:" counter in CLAUDE.md after all new files are created.

**`future-learning.md` — bidirectional check:**

Start by reading the existing `future-learning.md` in {NOTES_PATH}. If it does not exist
yet, skip the promotion check and go directly to the demote/add step below. For each concept
listed, assess whether it is now within scope. A concept is in scope if it appears in
`coverage.md` OR if the active project's `PLANNING.md` lists it as a learning objective
for a completed step. If in scope, create a full note file for it and remove it from
`future-learning.md`.

Then, if during the audit a concept is identified that is real and worth knowing — but still
beyond Victor's current scope (too advanced for a junior screening, or belongs to a future
project) — add it to `future-learning.md`. If the file does not exist yet, create it with a
short intro line and at least one `## Phase` section grouping concepts by when they become
relevant. Do not create a full note file for concepts that are still premature. If the file
already lists the concept, leave it as is.

---

## Execution

**Reminder:** only apply changes to existing text if there is a TODO marker. New files and new
sections are always allowed. Do not edit existing text without a TODO — even if it could be improved.

Apply all new content and TODO resolutions directly to the files. For issues in existing
text, report them in the summary — do not change the text. Exception: if Victor explicitly
asks you to fix the reported issues after seeing the summary (in the same conversation),
you may rewrite those sections — even without a TODO.

After all edits, print a final summary table:

| File | Status |
|------|--------|
| [filename] | ✅ / 🔧 / ➕ |

If any issues were found in existing text that could not be changed, list them here:

**Reported issues — existing text (require a TODO to fix):**
- `[filename]` — [description of the issue and which rule it violates; Victor adds a TODO marker to get it fixed next run]

If no issues in existing text were found, omit this section.

Then show the commit message so Victor can run it himself. Always use this format — one command per code block:

```

git add <list every file you created or modified by exact path — no wildcards or "." — include CLAUDE.md if you updated the "next file:" counter>

```

```

git commit -m "docs: audit {TOPIC} notes — <one line summary of main fixes>"

```

````
