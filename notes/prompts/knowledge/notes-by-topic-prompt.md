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

MODE = [full | single-file | multi-file]
       full (default) audits a whole folder; single-file corrects one .md file; multi-file
       corrects the specific files listed in FILES. Full definition of each mode — including
       which steps run and which are skipped — is in the "Mode" section below. Read it there.

FILES = [comma-separated filenames, e.g. 01-variables-tipos.md, 03-methods.md]
        Only used when MODE = multi-file. Filenames only — no path prefix needed.
        Leave blank or omit when MODE is full or single-file.

REWRITE_MODE = [standard | first-pass]
       → standard (default): existing text is final unless marked with a TODO. Do not reword,
         restructure, or improve text that is already written. Report quality issues in the
         summary — Victor adds a TODO if he wants a fix.
       → first-pass: existing text is NOT protected. Run the mandatory per-section checklist
         defined in "First-pass checklist" below — for every section, check voice, learning
         order, documentation test, completeness, depth, and translation quality; rewrite
         directly if anything fails. TODOs are resolved as normal. Rule 2 violations in
         existing text are fixed directly (the checklist takes precedence over "report only").
         Use this only once per file, on auto-generated content Victor has not validated yet.
         After the run, the file is considered validated — use standard from that point on.

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

Use TOPIC, NOTES_PATH, MODE, FILES, and REWRITE_MODE wherever the prompt refers to {TOPIC},
{NOTES_PATH}, {MODE}, {FILES}, or {REWRITE_MODE}.

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
`coverage.md`, `future-learning.md`, and `layer-reference.md` live in the topic root — never inside `en/` or `es/`.

**File naming convention — this is mandatory:**
- Files in `en/` use English names: `03-methods.md`, `07-collections.md`, `08-exceptions.md`
- Files in `es/` use Spanish names: `03-metodos.md`, `07-colecciones.md`, `08-excepciones.md`
- The number prefix is always the same across both languages — it is the only shared part of the name
- Technical proper names with no Spanish equivalent keep the same name in both folders: `maven`, `enums`, `streams`, `lambdas`
- The `es/` counterpart of `en/XX-some-name.md` is `es/XX-nombre-en-español.md` — never a copy of the English filename

The Spanish counterpart of a file is identified by its **number prefix**, not its full name. For example, `en/09-streams-lambdas.md` → `es/09-streams-lambdas.md` (technical terms unchanged) and `en/08-exceptions.md` → `es/08-excepciones.md`.

Every change made to an `en/` file must be mirrored in the corresponding `es/` file. The rule is simple:
**never modify an `en/` file without checking its `es/` counterpart**. Specifically:

- **New file in `en/`** → also create the full Spanish version in `es/` with a **Spanish filename** (translated, same number prefix).
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
was refined and have not been validated by Victor.

For **every section** of the file, run this mandatory checklist. If a section fails any point,
rewrite it directly — do not report it, fix it. After the checklist, resolve all TODO markers
as normal.

**Rules that apply to the rewrite:**
- Keep all code blocks and the `Purpose:` and `Docs:` labels unchanged — only rewrite prose.
  Exception: if a `File:` line points to a path that does not exist in any project, correct it
  following the `File:` rule (real project path, a representative generic path, or omit it).
  Do not touch a `File:` line whose path is already valid.
- You MAY reorder or restructure sections if a different order is more logical for learning —
  always moving from foundational concepts to more complex ones; note it in the summary with a one-line justification

---

**First-pass checklist — run on every section:**

> **IMPORTANT:** The checklist runs on **every section unconditionally** — including sections that have no TODO markers. TODOs and the first-pass checklist are two independent passes. Resolving all TODOs does not complete the first-pass run. After finishing TODOs, continue with the checklist on every remaining section of the file.

**Voice and person**
- Does the section address Victor directly ("you use this when…", "you reach for this when…")?
  Passive voice and neutral third person ("this is used when…", "it is recommended to…") must be rewritten.

**Learning order**
- Does the opening sentence explain the *problem* this concept solves, not just what the concept
  is? If it opens with a definition or a neutral description, rewrite to lead with the pain:
  "Before X existed, you had to…" or "The problem is that without X, you end up with…"
- Is there at least 1–3 sentences of context before any code block? If code appears before any
  explanation, move the explanation first.

**Documentation test**
- Could this section be copy-pasted word-for-word onto the official docs site? If yes, it reads
  like documentation, not a personal guide. Rewrite so it explains *why it matters*, *where it
  appears in a real project*, and *what would break without it*.

**Completeness of explanation — zero-assumption rule (first order)**
- Does every term, annotation, or method introduced in the section get explained in that same
  section — what it is, why it exists, what problem it solves? If something is introduced and
  the next sentence does not clarify it, add the explanation inline.
- Is there an obvious common mistake or a "why not X?" moment that is not mentioned? If yes,
  add it as a `> blockquote` callout.

**Completeness of explanation — second order (this is where drafts fail most often)**
Passing the first-order check is not enough. A note can define every term and still leave Victor
with the exact doubts he keeps raising in TODOs. Check all four:
- **Mechanism.** Does the concept have a counter-intuitive behaviour or depend on how it works
  under the hood (memory layout, references, an internal counter, binary representation)? If yes,
  is the *mechanism* explained — not just the usage? The reader must understand *why* it behaves
  that way, not only how to call it. (e.g. `modCount` + iterator for `ConcurrentModificationException`,
  contiguous slots vs node chain for `ArrayList`/`LinkedList`, why `double` cannot store 0.1.)
- **Confusable pairs.** Does the section introduce two items with a similar name or role
  (`void`/`Void`, `Collection`/`Collections`, `==`/`equals`, overriding/overloading,
  `Comparable`/`Comparator`)? If yes, is there a direct contrast — which is which, how they differ,
  when to use each? If the contrast is missing, add it as a short sub-section or `> blockquote`.
- **Scope.** When a rule or method only applies to part of what the file covers, does the text say
  so explicitly (e.g. "`sort()` only exists on `List`")? Generic statements the reader has to
  narrow down on their own must be tightened.
- **JS/TS anchor — only when truly equivalent.** When a concept has a direct functional equivalent
  in JavaScript/TypeScript (`final` = `const`, try/catch), is it anchored in one phrase? Are
  misleading pseudo-equivalences flagged as differences instead (exception types in Java are not
  like Error classes in JS; Java's `var` is not dynamic like JS's)? Avoid anchoring when the
  concept only looks similar but serves a fundamentally different purpose.

**Depth calibration — against Victor's bar, not the concept's difficulty**
- The target is not "proportional to how hard the concept is" — it is the standard of the
  validated files (esp. `08-excepciones.md` section 1): enough depth to *truly understand* the
  concept, for every topic. A genuinely trivial one-liner can stay short, but a thin section on a
  non-trivial concept is a failure even if the concept isn't "complex" in the abstract. Expand
  under-explained sections; only trim genuine padding.
- Does the section carry the **signature elements** to the level of the surrounding validated
  sections (worked example carried through, ASCII diagram where there's structure, real-world
  analogy, abundant `> blockquote` callouts, a sentence explaining each table, exact error
  messages, MAL/BIEN labelled examples)? See "Signature elements" in rule 3. If neighbouring
  sections have this texture and this one doesn't, raise it to match.

**Translation quality (Spanish files only)**
- Does the prose read as natural Spanish, not as a word-for-word translation of the English?
  Fix calque vocabulary (e.g. "escanear" → "leer", "retornar" → "devolver") and sentence
  structures that follow English word order instead of Spanish.

---

After a `first-pass` run, the file is considered validated. Note this in the summary so Victor
knows to switch back to `standard` mode for future runs on these files.

---

## Who I am and what I need

My profile, my projects, the **Spanish job market 2026**, and the **AI factor** are in
`notes/prompts/_shared-context.md` — read it before auditing. The gaps in rule 1 are framed by
what Spanish consultancies filter juniors on, so that context matters here.

Notes to audit: {NOTES_PATH}

---

## Mode — full vs single-file vs multi-file

`{MODE}` decides how much this run does. Check it before doing anything else.

- **full (default):** `{NOTES_PATH}` is a folder. Run the whole prompt as written — coverage gap analysis, proactive file creation, the "next file:" counter, and the `future-learning` check all apply to the whole topic.

- **single-file:** `{NOTES_PATH}` points to one `.md` file — audit **only that file**. This is the "I just wrote this file — correct it" pass. Do this and nothing else:
  1. **Resolve TODOs** in that file (the Pre-audit section below).
  2. **Quality audit (rule 2)** of that file — WHY before the code, named repeating patterns, correct format mode, and `Docs:` links (file-level and section-level): add missing links directly; in `standard` mode report other existing-text issues without changing them; in `first-pass` mode apply the "First-pass checklist" to every section and rewrite directly.
  3. **Complete the file (rule 3 standards)** — if a sub-concept this file clearly should cover is missing, add it as a new section **within this file only**.
  4. **Report + commit** for that one file.

- **multi-file:** `{NOTES_PATH}` is the topic folder and `{FILES}` lists the specific filenames to audit (e.g. `01-variables-tipos.md, 03-methods.md`). Apply the same single-file pass to each file in the list, in order. Derive the full path as `{NOTES_PATH}{filename}` for `en/` and the `es/` equivalent for the Spanish counterpart.

  Do this and nothing else for each file:
  1. **Resolve TODOs** — scan the `es/` counterpart first (that is where Victor reads and adds markers), then the `en/` file. Apply fixes to `es/` first, then mirror to `en/`.
  2. **Quality audit (rule 2)** of that file — in `standard` mode report existing-text issues; in `first-pass` mode apply the "First-pass checklist" to every section and rewrite directly.
  3. **Complete the file (rule 3 standards)** — missing sub-concepts added as new sections within that file only.
  4. After all files are processed, produce one combined **Report + commit** covering all files.

In both **single-file** and **multi-file** mode, **skip** every folder-level step: the rule-1 coverage gap analysis for the whole topic, the `00-intro-{topic}.md` existence check, "Creating new files — proactive", the `future-learning.md` promotion check, the "next file:" counter update, and **`coverage.md` — do not read it**. If you spot a gap that belongs in a different file, mention it in the summary instead of acting on it.

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
For each numbered file that exists in `en/`: check whether a file with the **same number prefix** exists in `es/`.
The `es/` filename must use a Spanish name (e.g. `en/08-exceptions.md` → `es/08-excepciones.md`).
If a file is missing in `es/`, create it immediately — same structure and code blocks as the `en/`
version, all prose translated to Spanish, filename translated to Spanish.
The two folders must always contain exactly the same **number of files**, one per number prefix.
List every file created in `es/` in the summary under "Spanish files created".

**Never give an `es/` file the same English name as its `en/` counterpart** — that is a naming error.
If you find `es/` files with English names (e.g. `es/08-exceptions.md`), rename them to Spanish using `git mv` before proceeding.

---

## Pre-audit — Resolve TODOs

**Victor studies from the `es/` files — that is where he adds TODO markers.**
Scan the `es/` counterpart folder (e.g. if `{NOTES_PATH}` is `notes/java/en/`, scan
`notes/java/es/`) for TODO markers first. Then also scan `{NOTES_PATH}` (`en/`) in case
any TODOs exist there too. In practice almost all TODOs will be in `es/`.

TODO markers can appear as `TODO:`, `<!-- TODO: ... -->`, or `// TODO`.

TODOs can take two forms:

- **Instruction TODOs** — a direct correction or task (e.g. `TODO: add example`, `TODO: rewrite this paragraph`). Apply the fix literally.
- **Question TODOs** — Victor writes a doubt or question he wants clarified (e.g. `TODO: why does Spring create a new context here?`, `TODO: is this the same as X?`). These are not Q&A requests. Resolve the doubt by weaving the answer into the surrounding prose of the paragraph it appears in — the question itself must never appear in the notes. The result should read as if the explanation was always there. Never add a "Q:" / "A:" block or a subheading for the question.

  **Banned opening words — hard rule, no exceptions.** The sentence that resolves a question TODO must never start with a confirmation/agreement word or phrase, in either language. This includes but is not limited to: "Sí," / "Yes," / "Exacto," / "Exactly," / "Correcto," / "Correct," / "Efectivamente," / "Claro," / "Tu intuición es correcta" / "Your understanding is right" / "Buena pregunta" / "Good question" — or any other word whose function is to validate/agree with something before it appears in the note. If the first draft of the resolution starts with any word like this, that is a signal the sentence is structured as an answer instead of as a fact — delete the opening word and restructure the sentence so it leads with the fact itself.

  **Before/after example:**
  - ❌ "Exacto: Java se niega a compilar precisamente porque ese fichero puede no existir en tiempo de ejecución..."
  - ✅ "Java se niega a compilar precisamente porque ese fichero puede no existir en tiempo de ejecución..."

  The fix is almost always this simple: delete the confirmation word and the punctuation after it, then read the sentence as if it opened the paragraph cold. If it still reads naturally, it's correct — the fact was always strong enough to stand on its own without a preamble validating it.

  The prose must stand on its own as a statement of fact, not as a response to a question. The test: after the fix, a reader who did not see the TODO should not be able to tell there was ever a question there — they should simply find the concept well explained. Run this test explicitly on every question-TODO resolution before finalizing it, not just on the ones that feel like corrections. The same rule applies to section headings derived from question TODOs: use a descriptive noun-phrase heading (e.g. "Constructors in subclasses"), never a question-format heading (e.g. "Can a subclass add its own constructor?").

For each TODO found:
1. Identify exactly what Victor wants changed (instruction) or what he wants understood (question)
2. Apply the fix at that exact location in the `es/` file — weaving answers into narrative prose for question TODOs
3. Mirror the equivalent fix to the `en/` counterpart file (same content, translated back to English)
4. Remove the TODO marker in both files after fixing
5. Report what was changed before moving on

If no TODOs are found in either folder, skip this section and move directly to the audit.

**Pattern detection — after resolving all TODOs:**
If 2 or more TODOs reflect the same type of correction or question, this reveals a
systematic gap — either in how a type of section is written, or in what the notes tend
to leave unexplained. Look for patterns across both TODO types:

- **Instruction patterns** (e.g. always changing passive to active voice, always adding a
  "Why not X?" callout, always shortening code examples) → a personal writing preference
  that should become a permanent rule so it never needs manual fixing again.
- **Question patterns** (e.g. Victor always asks *why* something behaves a certain way in
  async sections, always asks about exception cases in error handling, always wants a
  comparison with another approach) → a signal that notes on that type of concept
  systematically skip something he needs. The fix is a writing rule that forces future
  notes to address it upfront.

In both cases, report it in the summary as a recommended prompt change: one specific
sentence to add to rule 3 that would prevent the same correction or question from being
needed in future runs. Do not add the rule yourself — Victor decides whether to accept it.

---

## Audit — Technical Foundation & Gaps

**Before reading note files — check coverage.md (full mode only):**
Only read `coverage.md` when `{MODE}` is `full`. In `single-file` and `multi-file` mode, skip
this step entirely — do not open or consult `coverage.md`.

When in `full` mode: `coverage.md` lives in the topic root, not inside `en/`. For example,
for `NOTES_PATH = notes/java/en/`, read `notes/java/coverage.md`. If it exists, read it first.
It defines the minimum topics that must be covered for Victor's objective (junior at a Spanish
consultancy with Angular + Spring Boot). Every item in that file is a required topic. Use it
as the baseline alongside rule 1 — any item not covered by an existing note file must be
addressed during this audit. Skip `coverage.md` when checking note quality in rule 2 — it is
a checklist, not a study note. If no `coverage.md` exists yet, skip this step and rely on
rule 1 and your knowledge of what junior Angular + Spring Boot interviews at Spanish
consultancies require.

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
  - Missing `Docs:` links (file-level or section-level) → **add them directly** in both modes.
    They are new content, not modifications to existing text, so the "existing text is final"
    rule does not apply. Only add a link if you are certain of the correct URL and sub-section —
    if not, write `Docs: TODO — add link` instead of guessing. A wrong URL is worse than no link.
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
    missing patterns):
    - In **`standard` mode** → report in the summary only. Do not change the text. Victor
      decides whether to add a TODO and fix it.
    - In **`first-pass` mode** → the "First-pass checklist" takes precedence. Fix the violation
      directly — do not report it. New content you are creating must always follow rule 3 fully.

  **Bad note:** "`HttpClient` is a service that performs HTTP requests. It provides methods for all HTTP verbs including GET, POST, PUT, and DELETE."
  **Good note:** "`HttpClient` is Angular's way of calling external APIs. You inject it into a service (never a component) and it returns an Observable you subscribe to. Without it you would have to use the browser's `fetch` directly — Angular just wraps it and makes it injectable. Used in project 02 to call the weather API."
  The bad note reads like the official docs. The good note explains WHY you use it, WHERE it lives, and references a real project.

3. When creating new note files or adding new sections to existing files, follow these
   rules. The goal is notes that work as a personal study book — clear enough to learn
   from scratch and return to as a reference. Every concept needs enough explanation to
   understand it, not just recognise the syntax.

   **Target reader:** write for someone who has never seen this concept before. A complete
   file is one that takes that person from zero to "I understand what this is and why it
   exists" without needing to look anything else up.

   **Zero-assumption rule — this is the most important rule in this section:**
   Never assume the reader knows anything about the topic being covered. Every term,
   every concept, every annotation, every method introduced in a section must be explained
   in that same section — what it is, why it exists, and what problem it solves. If you
   introduce a word and the next sentence does not clarify what it means and why it matters,
   that is a gap. The test: could a developer who knows JavaScript but has never touched
   this technology read this section and understand every word without Googling anything?
   If not, something is missing.

   This rule overrides "calibrate depth to complexity" — there is no such thing as a concept
   too simple to explain. What feels obvious to an experienced developer is often exactly
   what a beginner gets stuck on. When in doubt, explain more, not less.

   **Second-order completeness — the four rules that separate a draft from a finished note:**
   The zero-assumption rule above ("define every term") is first order — it is satisfiable by a
   note that still leaves every doubt below open. These four rules are where auto-generated drafts
   consistently fall short and where Victor ends up adding TODOs by hand. Apply all four when
   writing any new section, and check them when auditing an existing one:

   - **Explain the mechanism, not just the usage.** When a concept has a counter-intuitive
     behaviour or depends on how it works under the hood — memory layout, references, an internal
     counter, binary representation — explain *why* it behaves that way, not only how to call it.
     Defining what it is and showing the syntax is not enough if the behaviour is surprising.
     (e.g. explain the `modCount` + iterator interaction behind `ConcurrentModificationException`,
     the contiguous memory slots of `ArrayList` vs the node chain of `LinkedList`, why `double`
     cannot represent 0.1 exactly.)
   - **Contrast confusable pairs explicitly.** When a section introduces two elements with a
     similar name or role — `void`/`Void`, `Collection`/`Collections`, `==`/`equals`,
     overriding/overloading, `Comparable`/`Comparator`, `compareTo`/`compare`/`comparing` —
     add a short sub-section or a `> blockquote` that contrasts them directly: which is which,
     how they differ, and when to use each. Do not leave the reader to infer the distinction.
   - **State the exact scope of every rule.** When a rule or method only applies to part of what
     the file covers, say so explicitly ("`sort()` only exists on `List`"; "`Collections.sort()`
     is List only — `Set` and `Map` have no positional order"). Never leave a generic statement
     the reader has to narrow down on their own.
   - **Anchor against JavaScript/TypeScript — but only when equivalent is truly functional.** Anchor
     only when the equivalence is direct and transparent — where using them is functionally the
     same in both languages (e.g. `final` = `const`, for-each = `for...of`, try/catch syntax is
     identical, `.formatted()` = template literals). Do NOT anchor when a concept exists in JS/TS
     but serves a fundamentally different purpose or requires different mental context — for
     example, exception types in Java (checked/unchecked, compile-time enforcement, type hierarchy)
     are not comparable to JS error objects (runtime-only, informal, no type distinctions). When
     the JS version is only superficially similar, acknowledge the difference explicitly instead
     of suggesting they are equivalent. This applies per section, not just in the `00-intro` file.
     When in doubt, it is better to acknowledge that JS/TS has no equivalent than to force a
     misleading comparison.

   **Signature elements — the texture of a finished note (this is Victor's actual bar):**
   The rules above make a note *correct*. These make it match the standard Victor has actually
   validated — the level of the early Java notes (`01-variables-tipos.md`,
   `06-herencia-polimorfismo.md`, `07-colecciones.md`) and above all **the first section of
   `08-excepciones.md`, which is the single best reference for what a finished note looks like**.
   This bar is the same for every topic — it is NOT Java-specific. Notes in other folders
   (e.g. Angular) that currently sit below it are a backlog to raise, never a lower target to
   match. When writing or auditing any section, these are the elements that take it from "correct"
   to "Victor's standard". Not every element fits every section, but a finished note visibly uses
   most of them:
   - **One worked example carried through the whole section.** Pick a single concrete example and
     follow it from start to finish, rather than scattering unrelated fragments. `Animal/Dog/Cat`
     runs through all of the inheritance section; `main() → methodA() → methodB()` runs through the
     entire call-stack explanation in `08`. The reader should be able to trace one story, not
     re-orient at every code block.
   - **ASCII diagrams for anything with spatial or structural shape.** When the concept has a shape
     — a stack, a tree, a memory layout, a request flow — draw it. The call-stack diagram in `08`
     (`[top] methodB() / methodA() / main() [bottom]`) is the model. A diagram is often worth more
     than a paragraph for structure.
   - **Real-world analogies for abstract mechanisms.** Anchor an abstract idea to a physical one:
     the call stack as "a stack of plates", integer overflow as "an odometer rolling over",
     `StringBuilder` as "a whiteboard you write on piece by piece". One good analogy per hard concept.
   - **Abundant `> blockquote` callouts — roughly one per non-obvious sub-concept.** Victor's
     validated notes are dense with these (five in the first `01` file alone). Every time there is a
     "why does it work this way?", a "what does this word mean?", or a "why not the obvious
     alternative?", it becomes a callout. Do not ration them — under-using callouts is the most
     common way a draft falls below his bar. Resolve the doubt as a statement of fact (see the
     question-TODO rule) — never phrase the heading as a literal question.
   - **Every comparison table gets a sentence on how to read it.** After any table, add a line that
     explains what a non-obvious column or row actually means and how to use it — e.g. "The
     `Parent class` column is what determines whether the compiler treats it as checked or
     unchecked." A table Victor has to decode on his own is below standard; he has explicitly asked
     for this ("no entiendo por qué pone Extiende").
   - **Show the exact error message.** When a mistake produces a specific compiler or runtime error,
     quote it verbatim (`unreported exception IOException; must be caught or declared to be thrown`,
     `Type argument int is not within bounds of type-variable E`). The real string is what he'll
     recognize later in IntelliJ, and it makes the note concrete instead of abstract.
   - **Label wrong-vs-right examples.** When there is a tempting wrong way, show both and label them
     — `// MAL` / `// BIEN` (or ✅ / ❌ inline). Seeing the broken version next to the correct one is
     what makes the lesson stick (the shared-vs-local `StringBuilder`, the `if`-chain vs polymorphism).

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
   - **Calibrate depth to Victor's bar, not to the concept's difficulty.** The floor is never
     "how hard is this concept" — it is "how much does it take to *truly understand* it", which is
     the standard set by the validated files (esp. `08-excepciones.md` section 1). A genuinely
     trivial one-liner (a self-explanatory annotation) can stay short, but the default assumption
     is that a concept deserves the full treatment: mechanism, a worked example, a callout for the
     non-obvious part. Do not write a thin two-paragraph section just because the concept isn't
     "complex" in the abstract — if the surrounding sections in the same file have diagrams, tables,
     worked examples and callouts, this section matches that texture too. Under-explaining is the
     failure mode here, not padding. (This is exactly the miss that made Victor ask for "el mismo
     nivel de detalle" mid-session — the fix is to treat his established bar as the target, never
     the objective hardness of the topic.)
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
   - **Link to other note files when a concept depends on something already covered elsewhere.**
     Use a markdown link to the relevant file (e.g. `see [08-generics.md](08-generics.md)`).
     After the link, add one sentence of reminder — short enough that the reader can continue
     without opening the other file if they roughly remember the concept. Example: "This uses
     generics (see [08-generics.md](08-generics.md)) — the `<T>` is a type placeholder so the
     method works with any type, not just one specific class." The link is for deep review; the
     sentence is so the flow of the current file is never broken.
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

**Every topic must have a `00-intro-{topic}.md` file.**

Before checking for gaps, check whether a `00-intro-*.md` file exists in `{NOTES_PATH}`. This
file must come before all numbered files and cover:

- What the technology is and how it works at a high level (the mental model before the details)
- Key concepts that appear everywhere in the topic and must be understood first (e.g. compile
  time vs runtime for Java, the component tree for Angular, the box model for CSS)
- How it differs from technologies Victor already knows — frame the comparison against
  JavaScript/TypeScript/React where relevant, since those are his reference points
- A one-paragraph map of what the rest of the notes cover and in what order

If the intro file is missing, create it as the first action of this run — before addressing
any other gaps. If it already exists, check whether it covers the four points above and add
any missing section directly.

The intro file uses a `00-` prefix (not a numbered sequence prefix) and is never listed in
`coverage.md` — it is structural scaffolding for the topic, not a learning objective in itself.
Create the Spanish counterpart in `es/` at the same time.

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
