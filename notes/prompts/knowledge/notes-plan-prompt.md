# Notes plan prompt — the PLANNING component (folder analysis)

**Internal component.** This is the **planner** in the notes pipeline, used only in folder mode. You
don't launch it — `notes-audit.md` (`SCOPE = folder`) dispatches it as a cold subagent first, then
builds each row it produced. It is documented here so the audit prompt can point a subagent at it.

**What it does and does not do.** It surveys a whole topic folder and figures out *what needs to
happen* — but it does **not** write or rewrite note prose. It does the cheap, verifiable, whole-folder
work (folder setup, `en`/`es` parity, gap analysis, sequence check) and writes an **ordered
worklist** (`notes/{TOPIC}/notes-worklist.md`). Each row is then built by the author + reviewer
subagents the audit dispatches.

**Why planning is separate from writing.** Applying the full writing standard to every file of a
folder in one context overloads the model's attention — the heaviest work (the writing bar) is the
first thing that gets dropped. Planning is analytical and mechanical, so it is safe to do across the
whole folder in one pass. Writing is where the attention budget matters, so it is bounded to one cold
subagent per file. This component never writes rich note content.

---

**How it runs** (invoked by `notes-audit.md`; the config block below is filled by the dispatching
subagent, not by Victor):

1. `TOPIC` — the subject to plan (e.g. Angular, SQL, Java, Spring Boot).
2. `NOTES_PATH` — the `en/` folder for that topic (e.g. `notes/angular/en/`).
3. It writes the worklist; the audit orchestrator then builds each row.

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security | all]
NOTES_PATH = [notes/angular/en/ | notes/angular-material/en/ | notes/css/en/ | notes/javascript/en/ | notes/typescript/en/ | notes/sql/en/ | notes/java/en/ | notes/spring-boot/en/ | notes/architecture/en/ | notes/git/en/ | notes/general/en/ | notes/security/en/]

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
- SQL: database is PostgreSQL. Flag any PostgreSQL-specific detail consultancies would ask about
  (e.g. sequences vs AUTO_INCREMENT, RETURNING clause).
- General: covers HTTP, JSON, env vars, testing concepts, SOLID, browser storage, code principles.
  Uses conversational mode.
- Security: covers AuthN/AuthZ, hashing, JWT design, CORS, XSS, CSRF, SQL injection.
  Uses conversational mode.

Use TOPIC and NOTES_PATH wherever the prompt refers to {TOPIC} or {NOTES_PATH}.

---

I want you to plan a technical audit of my study notes for {TOPIC}. You will survey the whole folder,
do the mechanical/structural fixes, and produce an ordered worklist of writing tasks — but you will
NOT write or rewrite any note prose. That happens later, one file at a time, with notes-write-prompt.md.

Before starting, read:
- CLAUDE.md — teaching rules, subfolder structure, and the "next file:" counters.
- notes/prompts/_shared-context.md — my profile, the Spanish job market 2026, and the AI factor.
  The gaps you look for are framed by what Spanish consultancies filter juniors on.
- notes/prompts/knowledge/_note-quality-standard.md — the writing standard. You read it to *judge*
  whether existing notes meet the bar and to decide what is missing. You do NOT apply it to write
  here — you only use it to spot what falls short and turn that into a worklist item.

---

## What you WILL do (folder-level, safe to run on the whole folder)

### Step 0 — Folder setup and file migration (mechanical)

Before anything else, check whether the bilingual folder structure is in place. These are
deterministic, verifiable operations — do them directly.

**1. Migrate numbered files from the topic root to `en/`.**
Check whether there are numbered `.md` files sitting directly in the topic root (e.g.
`notes/java/01-variables-types.md`). These contain Victor's refined content and must be preserved
exactly.
- If numbered files exist in the root: create `en/` if it does not exist, then run `git mv` for each
  file to move it into `en/`. Do NOT copy or recreate — `git mv` only, so git tracks the rename and
  the content is preserved.
- Non-numbered files (`coverage.md`, `future-learning.md`, `layer-reference.md`) always stay in the
  root — never move them.
- Report every file moved.

**CRITICAL — never create files in `en/` if they already exist or if you are about to move the
originals there. `git mv` is the only correct way to get files into `en/` during migration. Writing
new files with the same names would overwrite Victor's refined content.**

**2. Check that `es/` exists.** If it does not, create it as an empty folder.

**3. Check `es/` parity — but do NOT translate here.** For each numbered file in `en/`, check whether
a file with the same number prefix exists in `es/` (Spanish filename, e.g. `en/08-exceptions.md` →
`es/08-excepciones.md`). Translating a full note is substantial prose work — doing ten of them inline
would re-create exactly the whole-folder saturation this split exists to avoid. So:
- If an `es/` file is **missing**, add a worklist row for it (task `create-es`, REWRITE_MODE inherits
  from the `en/` file's own row if it has one) — a subagent translates it in its own cold context.
- If an `es/` file has an **English name** (a naming error), that is a pure rename → `git mv` it to
  the Spanish name here. That is mechanical, not translation.
- The two folders must end up with the same **number of files**, one per number prefix — but the plan
  only guarantees that by *listing* the missing translations as worklist rows, not by writing them.

### Step 1 — Survey TODOs across the folder (read-only)

Scan both `es/` (primary — that is where Victor adds markers) and `en/` for TODO markers
(`TODO:`, `<!-- TODO: -->`, `// TODO`). Do NOT resolve them here — resolving a TODO means editing
note prose, which is the write prompt's job. Instead:
- List every file that contains TODOs, with a count and a one-line description of each.
- **Pattern detection.** If 2+ TODOs reflect the same type of correction or question (e.g. always
  asking *why* a mechanism works, always wanting a comparison, always shortening code), that reveals
  a systematic gap. Report it as a recommended one-sentence addition to `_note-quality-standard.md`
  that would stop the same doubt recurring. Do not add the rule yourself — Victor decides.

### Step 2 — Coverage and gap analysis (read-only)

**Read `coverage.md` first.** It lives in the topic root, not inside `en/` (e.g. for
`NOTES_PATH = notes/java/en/`, read `notes/java/coverage.md`). Every item in it is a required topic
for Victor's objective (junior at a Spanish consultancy with Angular + Spring Boot). It is the
ceiling — do not plan files for topics not listed there. If no `coverage.md` exists, rely on rule 1
below and your knowledge of what junior Angular + Spring Boot interviews at Spanish consultancies
require.

Then read all numbered files in `{NOTES_PATH}` (skip `future-learning.md`, `coverage.md`,
`layer-reference.md`, and anything not starting with a two-digit number).

1. **Missing fundamentals (rule 1).** Identify fundamental concepts missing that a Spanish
   consultancy would use to filter candidates in a first technical screening. One sentence per gap
   explaining why they ask it. For each: decide whether it needs a **new file** (concept covers
   multiple sub-topics or is independently searchable) or a **new section in an existing file**
   (direct extension of something already covered).

2. **`00-intro-{topic}.md` existence check.** Every topic must have a `00-intro-{topic}.md` before
   all numbered files, covering: what the technology is and how it works at a high level; key
   concepts that appear everywhere and must be understood first; how it differs from JS/TS/React;
   and a one-paragraph map of what the rest of the notes cover. If it is missing, the very first
   worklist item is to create it.

3. **Sequence completeness and narrative order (proactive).** Assess the learning sequence as a
   whole: can Victor learn the topic end-to-end from files 01–N without looking elsewhere for the
   basics? Is there a logical progression where each file builds on the previous? Is the folder sparse
   (2 files where it clearly needs 5)? Add the missing pieces as worklist items — but stay within
   `coverage.md` as the ceiling. If no `coverage.md` exists, limit new files to the rule-1 gaps only.

   Order the worklist as a **narrative journey**, not just by number: each file should arrive because
   the previous one made it necessary (see "Narrative thread" in the standard). For every row, add to
   its `TASK` a one-line thread note — *what it continues from and what it sets up next* — so the
   author opens and closes the file on-thread (e.g. "continues from 02-objects; sets up 07-collections").

### Step 3 — Quality flags on existing files (read-only, report only)

For each existing file, check it against the standard (in `_note-quality-standard.md`) and flag —
**do not fix** — anything that falls short:
- WHY explained before the code?
- Repeating patterns named explicitly?
- Correct format mode for its folder (structured vs conversational)?
- File-level `Docs:` link present? Each section's `Docs:` link points to an exact sub-section, not a
  homepage?
- Reads like a personal learning guide, not documentation? (Test: would this sentence appear
  word-for-word on the official docs site?)
- Forward references within the topic marked with a one-line note?
- Cross-topic references opened with a preview callout?
- Second-order completeness and signature texture present, or does the file visibly shift standard
  halfway through?

Turn every flag into a worklist item tagged `fix-quality` for that file. Missing `Docs:` links become
`add-docs-link` items. Do not edit any prose.

### Step 4 — `future-learning.md` (edits to this reference file allowed)

Read `future-learning.md` in the topic root. It is a reference list, not a study note, so you may
edit it directly.
- **Promote:** for each listed concept now in scope (it appears in `coverage.md`, OR the active
  project's `PLANNING.md` lists it as an objective for a completed step), remove it from
  `future-learning.md` and add a `create-file` worklist item for it.
- **Demote:** if the survey surfaced a concept that is real and worth knowing but still beyond a
  junior screening or belongs to a future project, add it to `future-learning.md` (create the file
  with a short intro and at least one `## Phase` section if it does not exist). Do not plan a full
  note for premature concepts.

---

## What you will NOT do

- Do not write or rewrite any note prose, in `en/` or `es/`.
- Do not resolve TODOs.
- Do not add sections to existing files, and do not create the `00-intro` or any new numbered file's
  content — only *list* them as worklist items.
- Do not update the "next file:" counter in CLAUDE.md — the write prompt does that when it actually
  creates a file. **But you MUST assign the concrete number to every new file in the worklist** (start
  from the "next file:" counter and increment in study-sequence order). If you leave numbers for the
  subagents to choose, parallel-in-time runs would each grab the same "next" number and collide. The
  plan owns numbering; the subagents just use the number you gave them and the last one bumps the
  counter.

The only files you may modify are: the `en`/`es` folder structure (Step 0 migration only — never a
translation), and `future-learning.md` (Step 4).

---

## Output — write the worklist to a file

The worklist is not just printed — **write it to a file** so it survives across conversations and can
be consumed by the write prompt (or an orchestrator) without Victor re-typing anything.

**Write it to `notes/{TOPIC}/notes-worklist.md`** (topic root, next to `coverage.md` — NOT inside
`en/`). Overwrite it if it already exists. Order the rows in study sequence (00-intro first, then by
number). Use exactly this structure so it can be parsed and auto-checked later:

```markdown
# Worklist — {TOPIC}   (generated by notes-plan · <YYYY-MM-DD>)

Each item is one run of notes-write-prompt.md. The checkbox is flipped to [x] automatically by the
write prompt when that file's run finishes. Delete this file once every row is [x].

- [ ] #1 · notes/{TOPIC}/en/00-intro-{topic}.md
      TASK = create the intro covering the four points (mental model, key concepts, JS/TS diff, map)
      REWRITE_MODE = first-pass

- [ ] #2 · notes/{TOPIC}/en/04-methods.md
      TASK = resolve 2 TODOs (list them briefly); add WHY-before-code in §3
      REWRITE_MODE = standard

- [ ] #3 · notes/{TOPIC}/en/09-generics.md
      TASK = add a section on bounded type parameters (rule-1 gap)
      REWRITE_MODE = standard
```

Rules for the file:
- The checkbox line must be **exactly** `- [ ] #N · <full en/ path>` — one unique `en/` path per row.
  This exact line is what the write prompt edits to `- [x] …`, so do not reformat it.
- `TASK` is a self-contained instruction: what to do to that file. Include the specific TODOs, the
  named sections, and the gap. The write run must not need to re-derive it.
- `REWRITE_MODE`: `first-pass` only for auto-generated files Victor has never validated; `standard`
  otherwise.
- Task types you may fold into the TASK line: `create-file`, `add-section`, `resolve-TODOs`,
  `fix-quality`, `add-docs-link` (a file may carry several).
- List **every** file that needs work — the cap is on how many get *built*, not *planned*. Building
  happens later, one file per run.

This file is a **temporary work artifact**, not study content — do not commit it (see the commit step).

Also print the same worklist as a table in the chat so Victor sees it immediately. Then print:

**Structural fixes applied this run** (Step 0 migrations, `es/` files created, `future-learning.md`
edits) — with a status per file.

**TODO pattern → recommended standard change** (if any): one specific sentence to add to
`_note-quality-standard.md`. Victor decides whether to accept it.

**Reported quality issues** that need a Victor decision before the write prompt touches existing text
(in `standard` mode, existing prose is only rewritten with a TODO or explicit go-ahead).

Finally, the commit for the structural work only (the write runs commit their own file changes).
**Never `git add` `notes/{TOPIC}/notes-worklist.md`** — it is a temporary work artifact, not study
content:

```
git add <every file moved/created/edited in Step 0 and Step 4 by exact path — no wildcards, and NOT notes-worklist.md>
```

```
git commit -m "docs: sync {TOPIC} notes structure ahead of notes audit"
```

If Step 0 and Step 4 made no changes, say so and skip the commit — the worklist file is the only output.

````
