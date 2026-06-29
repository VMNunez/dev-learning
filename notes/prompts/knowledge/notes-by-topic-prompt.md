# Notes by Topic Prompt

Use in a **separate conversation**. Fill in the two values in the configuration block, then paste everything into a new chat.

Useful after a study session when you want to check and improve the notes for one topic — without running a full interview prep audit. You can also point it at a **single file** to correct just that file as you write it (see "Mode" below). For a combined notes + interview prep audit, use `notes-and-interview-prep-prompt.md` instead.

---

**How to use:**

1. Fill in `TOPIC` — the subject to audit (e.g. Angular, SQL, Java, Spring Boot)
2. Fill in `NOTES_PATH` — for `full` a folder (e.g. `notes/angular/`); for `single-file` the exact file (e.g. `notes/angular/06-http-rxjs.md`)
3. Fill in `MODE` — `full` for the whole-topic audit, or `single-file` to correct just that one file (see "Mode")
4. Fill in `REWRITE_MODE` — `standard` to protect existing text (default), or `first-pass` to allow full rewrites (see below)
5. Paste the entire prompt below into a new chat

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security | all]
NOTES_PATH = [notes/angular/en/ | notes/angular-material/en/ | notes/css/en/ | notes/javascript/en/ | notes/typescript/en/ | notes/sql/en/ | notes/java/en/ | notes/spring-boot/en/ | notes/architecture/en/ | notes/git/en/ | notes/general/en/ | notes/security/en/]

MODE = [full | single-file]
       → full (default): NOTES_PATH is a folder; audit the whole topic — coverage gap analysis,
         proactive new files, the "next file:" counter, and the future-learning check.
       → single-file: NOTES_PATH is one .md file (e.g. notes/angular/en/06-http-rxjs.md); a focused
         pass on just that file (TODOs + quality + Docs links + completing that file) that skips
         the folder-level steps. See "Mode" below.

REWRITE_MODE = [standard | first-pass]
       → standard (default): existing text is final unless marked with a TODO. Do not reword,
         restructure, or improve text that is already written. Report quality issues in the
         summary — Victor adds a TODO if he wants a fix.
       → first-pass: the notes were generated before the prompt was refined and have not been
         validated by Victor yet. Existing text is NOT protected. You may rewrite any section
         that has quality problems: poor translation, awkward phrasing, missing explanation,
         wrong voice, or translation that follows the English sentence structure too closely.
         TODOs are still resolved as normal. After rewriting, the file is considered validated
         — standard mode applies from the next run onwards.
         Use this only once per file, when you know the content was auto-generated and untrusted.

## TOPIC = all runs this prompt on every topic in turn — see notes/prompts/_batch-mode.md.
## Batch order (NOTES_PATH derived per topic): Angular, Angular Material, Spring Boot
## (also reads notes/java/en/), Java, Architecture, Security, TypeScript, JavaScript, CSS, SQL,
## Git, General.

Notes on specific topics:
- Spring Boot: set NOTES_PATH = notes/java/en/, notes/spring-boot/en/ (comma-separated — read both,
  because Spring Boot code uses Java language concepts). Both folders use structured mode.
  coverage.md lives in notes/spring-boot/ root only — read it from there, not from notes/java/.
- Java: focus on language concepts needed to write Spring Boot code — classes, interfaces,
  annotations, generics, exceptions, Maven. Skip Java concepts that don't appear in a Spring Boot context.
- SQL: database is PostgreSQL. Focus on PostgreSQL syntax and behaviour. Flag any PostgreSQL-specific
  detail consultancies would ask about (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, browser storage, code principles.
  Uses conversational mode.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
  Uses conversational mode.

Use TOPIC, NOTES_PATH, and MODE wherever the prompt refers to {TOPIC}, {NOTES_PATH}, or {MODE}.

---

I want a technical audit of my study notes for {TOPIC}.

Before starting, read CLAUDE.md — it has the teaching rules and the subfolder structure with
the "next file:" counters. (My profile and the market are in `notes/prompts/_shared-context.md`.)

---

## Notes organisation rules

These rules apply both when auditing existing notes and when creating new ones.

**Folder placement — which concept goes where:**

| Concept type | Correct folder |
|---|---|
| Security concepts (CORS, XSS, JWT design, AuthN/AuthZ) | notes/security/en/ |
| Cross-cutting concepts (HTTP, JSON, env vars, testing, SOLID) | notes/general/en/ |
| Spring Boot implementation (annotations, filters, config, JPA) | notes/spring-boot/en/ |
| Pure Java language concepts | notes/java/en/ |
| Angular patterns and framework concepts | notes/angular/en/ |
| Angular Material components | notes/angular-material/en/ |
| Architecture patterns (REST, layered, MVC) | notes/architecture/en/ |

**Format modes:**

- `notes/java/en/` and `notes/spring-boot/en/` — **structured mode**: the file opens with a
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

**Bilingual notes — English and Spanish:**

Each topic folder has `en/` and `es/` subfolders. {NOTES_PATH} always points to `en/`.
The Spanish counterpart lives at the same relative path but under `es/` (e.g. `notes/java/es/09-streams-lambdas.md`).
`coverage.md`, `future-learning.md`, and `layer-reference.md` live in the topic root — never inside `en/` or `es/`.

Every change made to an `en/` file must be mirrored in the corresponding `es/` file. The rule is simple:
**never modify an `en/` file without checking its `es/` counterpart**. Specifically:

- **New file in `en/`** → also create the full Spanish version in `es/` with the same filename.
  Same structure, same code blocks — only the prose is in Spanish. Code comments may also be translated.
  **The Spanish prose must read as natural Spanish, not as a literal word-for-word translation of the English.**
  The content and message must be identical across both languages, but each version should read as if it were
  written natively in that language — same idea, same emphasis, different words where the language demands it.
  Awkward or robotic translations that follow the English sentence structure too closely are not acceptable.
  Structural labels (`Purpose:`, `File:`) must be translated to `Propósito:`, `Archivo:`. `Docs:` stays as-is.
- **New section added to an existing `en/` file** (from a gap found in rule 1, or from the proactive
  coverage check) → add the translated section to the `es/` counterpart too. The `es/` file must
  always exist (Step 0 guarantees this), so there is no "if it exists" check needed here.
- **TODO resolved in an `en/` file** → apply the equivalent fix in the `es/` counterpart too.
- **Single-file mode** → apply all the same changes (TODO resolutions, new sections, quality fixes)
  to the Spanish counterpart too.

Include all `es/` files created or modified in the final `git add` and in the summary table.

**Living document rules:**

Notes are not written once and forgotten. After each concept is learned and the code is written
in a project, check the relevant notes file:
- If the concept is not documented, add it with a real code example from the current project
- If a section already exists with a code example, add a new sub-section within that file if
  the project introduces something meaningfully new — do not replace or edit the existing
  example, and do not add a duplicate for the same concept
- Never duplicate examples across files in the same folder

**IMPORTANT — existing text protection (depends on {REWRITE_MODE}):**

Check `{REWRITE_MODE}` before touching any existing text.

**If `{REWRITE_MODE}` = `standard` (default):**

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

**If `{REWRITE_MODE}` = `first-pass`:**

Existing text is NOT protected in this run. The notes were auto-generated before the prompt
was refined and have not been validated by Victor. Rewrite freely:
- Fix any section where the translation sounds robotic, follows English sentence structure too
  closely, or uses calque vocabulary (e.g. "escanear" instead of "leer", "bandera" instead of
  "indicador o flag", etc.)
- Fix any section that is missing the WHY, opens with code before explanation, or reads like
  official documentation
- Resolve all TODO markers as normal
- Keep all code blocks and structural labels unchanged — only rewrite prose
- Do NOT restructure the file or change the order of sections unless a TODO asks for it

After a `first-pass` run, the file is considered validated. Note this in the summary so Victor
knows to switch back to `standard` mode for future runs on these files.

---

## Who I am and what I need

My profile, my projects, the **Spanish job market 2026**, and the **AI factor** are in
`notes/prompts/_shared-context.md` — read it before auditing. The gaps in rule 1 are framed by
what Spanish consultancies filter juniors on, so that context matters here.

Notes to audit: {NOTES_PATH}

---

## Mode — full vs single-file

`{MODE}` decides how much this run does. Check it before doing anything else. (`full` expects `{NOTES_PATH}` to be a folder; `single-file` expects it to be one `.md` file.)

- **full (default):** run the whole prompt as written. The coverage gap analysis, proactive file creation, the "next file:" counter, and the `future-learning` check all apply to the whole topic.
- **single-file:** `{NOTES_PATH}` points to one `.md` file — audit **only that file**. This is the "I just wrote this file — correct it" pass. Do this and nothing else:
  1. **Resolve TODOs** in that file (the Pre-audit section below).
  2. **Quality audit (rule 2)** of that file — WHY before the code, named repeating patterns, correct format mode, and `Docs:` links (file-level and section-level): add missing links directly; report other existing-text issues without changing them.
  3. **Complete the file (rule 3 standards)** — if a sub-concept this file clearly should cover is missing, add it as a new section **within this file only**.
  4. **Report + commit** for that one file.

  In single-file mode, **skip** every folder-level step: the rule-1 coverage gap analysis for the whole topic, "Creating new files — proactive", the `future-learning.md` promotion check, and the "next file:" counter update (you are not adding numbered files). You may still *read* `coverage.md` to confirm this file's own concept is fully covered — but never create files for other missing topics. If you spot a gap that belongs in a different file, mention it in the summary instead of acting on it.

---

## Step 0 — Folder setup and file migration (full mode only)

Before doing anything else, check whether the bilingual folder structure is in place.

**1. Migrate numbered files from the topic root to `en/`.**

Check whether there are numbered `.md` files sitting directly in the topic root (e.g. `notes/java/01-variables-types.md`). These are files that have not been migrated yet — they contain Victor's refined content and must be preserved exactly.

- If numbered files exist in the root: create `en/` if it does not exist yet, then run `git mv` for each file to move it into `en/`. Do NOT copy or recreate — `git mv` only, so git tracks the rename and the content is preserved.
- Non-numbered files (`coverage.md`, `future-learning.md`, `layer-reference.md`) always stay in the root — never move them.
- Report every file moved in the summary.
- After moving, `{NOTES_PATH}` now correctly points to the `en/` subfolder — continue the audit from there.

If no numbered files exist in the root (they are already inside `en/`), skip the migration and verify `en/` exists as a folder.

**CRITICAL — never create files in `en/` if they already exist or if you are about to move the originals there. `git mv` is the only correct way to get files into `en/` during migration. Writing new files with the same names would overwrite Victor's refined content.**

**2. Check that `es/` exists.**
If the `es/` subfolder does not exist inside the topic folder, create it now as an empty folder.
If `es/` already exists, skip this step.

**3. Sync `es/` with `en/`.**
For each numbered file that exists in `en/`: check whether the same filename exists in `es/`.
If a file is missing in `es/`, create it immediately — same structure and code blocks as the `en/`
version, all prose translated to Spanish. The two folders must always contain exactly the same files.
List every file created in `es/` in the summary under "Spanish files created".

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
`coverage.md` lives in the topic root, not inside `en/`. For example, for `NOTES_PATH = notes/java/en/`,
read `notes/java/coverage.md`. If it exists, read it first. It defines the minimum topics
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
   - Is it in the correct format mode for its folder? (`notes/java/en/` and `notes/spring-boot/en/`
     → structured mode; all other folders → conversational mode)
   - Does the file open with a general `Docs:` link to the main reference page for the topic?
   - Does each section have a `Docs:` link that points to the exact sub-section to study and
     states what to read — not just a homepage link? (e.g. `Docs: https://... → read:
     "Declaring Transactions"`)
   - Does it read like a personal learning guide, not like documentation? Test: would this
     sentence appear word-for-word on the official docs site? If yes, report it in the summary
     — do not change the text; Victor decides whether to add a TODO and rewrite it.
   - Does it use any syntax, class, or annotation from a later file in the same topic (forward
     reference) without a one-line note pointing to where it is explained? If yes, add the
     inline note directly — it is new content, not a modification of existing text.
   - Does it use any class, annotation, or pattern from a different topic folder (cross-topic
     reference) without a preview callout blockquote? If yes, add the callout directly — same
     reasoning: it is new content.

  **Action rules for rule 2 violations:**
  - Missing `Docs:` links (file-level or section-level) → **add them directly**. They are
    new content, not modifications to existing text, so the "existing text is final" rule
    does not apply. Only add a link if you are certain of the correct URL and sub-section —
    if not, write `Docs: TODO — add link` instead of guessing. A wrong URL is worse than
    no link.
    **Link priority by topic:** the linked page must show real code examples and explain
    where things come from — not just define terms. Rule: for Spring Boot and Java concepts,
    prefer Baeldung (baeldung.com) as the primary link — it has full working code, step-by-step
    context, and clear explanations of why each piece exists. Add the official Spring docs as
    a secondary link only. For JWT, prefer the jjwt GitHub README (github.com/jwtk/jjwt) — it
    has direct examples. For Angular, the official Angular docs (angular.dev) are clear and
    learner-friendly — use them as primary. For CSS and JavaScript, MDN (developer.mozilla.org)
    is primary. Never link the official Spring docs as the sole reference for a concept that
    Baeldung explains better with examples.
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
   - **Mark forward references within the same topic.** If an example in file N uses a
     concept that is not explained until file M (M > N), add a one-line note inline:
     "The `X::Y` syntax is a method reference — covered in full in `09-streams-lambdas.md`.
     For now, read it as 'the `Y` method of `X`.'" Never leave syntax the reader hasn't
     seen yet unexplained and unmarked, even if it appears as a minor part of an example.
   - **Add a preview callout for every cross-topic reference.** When a section uses classes,
     annotations, or patterns from a different topic folder — for example, Java language
     notes mentioning `@Entity`, `JpaRepository`, `ResponseEntity`, or `@Service` — open
     that section with a blockquote callout:
     `> **Preview — Spring Boot:** The examples below use Spring Boot classes you haven't
     studied yet. Read this to see where this Java concept appears in practice — you'll
     implement it in the Spring Boot notes.`
     Adapt the topic name and description to the actual cross-topic reference. This rule
     applies to every section that mixes the current topic with an external one — not only
     to sections explicitly labelled "Spring Boot connection". A reader who is studying
     files in sequence must never encounter an unexplained class or annotation without a
     clear signal that it belongs to a different topic they haven't reached yet.
   - **Code concept sections (methods, classes, annotations):** *(structured mode — notes/java/en/
     and notes/spring-boot/en/ only)* each section starts with three metadata lines: `Purpose:` —
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

Start by reading the existing `future-learning.md` in the topic root (not inside `en/` — e.g. `notes/java/future-learning.md`). If it does not exist
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

**Reminder:** check `{REWRITE_MODE}` before touching existing text.
- `standard`: only apply changes to existing text if there is a TODO marker. New files and new
  sections are always allowed. Do not edit existing text without a TODO — even if it could be improved.
  For issues in existing text, report them in the summary — do not change the text.
- `first-pass`: apply quality rewrites freely to existing text (see above). Resolve all TODOs.
  New files and sections are always allowed.

Apply all new content and TODO resolutions directly to the files.

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
