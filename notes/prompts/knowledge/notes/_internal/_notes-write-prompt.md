# Notes write prompt — the ENGLISH AUTHOR component (one file, en/ only)

**Internal component.** This is the **English author** in the notes pipeline — stage **A**. You
normally don't launch it — `notes-audit.md` dispatches it as a cold subagent, one per file, then hands
the result down the chain: English reviewer (B) → translator (T) → Spanish reviewer (C). It is
documented here so the audit prompt can point a subagent at it; you can also run it standalone to
draft/correct a single `en/` file.

**What it does.** Takes a single `en/` note file and does the heavy, high-standard authoring on it:
resolves its TODOs, audits its quality, and completes it to the full writing standard. **It works only
in English (`en/`).** It never writes the Spanish file — translation is a separate stage (T) that runs
on the *finished, reviewed* English, so the Spanish is produced once from a stable source instead of
being written and re-synced repeatedly.

**Why English-only, and why one file at a time.** Writing rich English prose to the standard and
translating it to natural Spanish are two different cognitive jobs; doing both in one context means the
Spanish gets whatever attention is left after the heavy English work. And the writing standard is long
enough that applying it to a whole folder at once overloads attention and the standard is the first
thing that slips. So authoring is bounded to **one `en/` file, in English only** — the full attention
budget stays on writing that file well.

---

**How to use:**

1. Fill in `TOPIC`.
2. Fill in `FILE` — the exact `en/` file to work on (e.g. `notes/angular/en/06-http-rxjs.md`). For a
   brand-new file that does not exist yet, still name its intended path here.
3. Fill in `TASK` — what this run should do to the file (from the worklist, or free-form).
4. Fill in `REWRITE_MODE` — `standard` (protect existing prose) or `first-pass` (allow full rewrites).
5. Paste the entire prompt below into a new chat.

---

````
## Configuration — edit only this block
## Replace the [ ] with your value and delete the brackets.

TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
FILE  = [exact en/ file path, e.g. notes/java/en/08-exceptions.md]

TASK = [what to do this run — copy the worklist row, or describe it, e.g.
        "resolve TODOs + fix WHY-before-code in §3" | "create the file from scratch"
        | "add a section on optimistic locking"]

REWRITE_MODE = [standard | first-pass]
       → standard (default): existing prose is final unless marked with a TODO or unless TASK
         explicitly asks to rewrite a named section. Do not reword, restructure, or "improve" text
         that is already written. Report other quality issues in the summary — Victor adds a TODO if
         he wants a fix. (Adding NEW sections and NEW files is always allowed and is not "existing
         text".)
       → first-pass: existing prose is NOT protected. Run the per-section checklist below on every
         section and rewrite directly where it fails. Use this only once per file, on auto-generated
         content Victor has not validated yet. After the run, the file is validated — use standard
         from then on.

Use TOPIC, FILE, TASK, and REWRITE_MODE wherever the prompt refers to {TOPIC}, {FILE}, {TASK},
or {REWRITE_MODE}.

---

I want you to do deep work on ONE English notes file: {FILE}. Do only what {TASK} asks — do not wander
into other files or folder-level work. **Verifiable read (the shared session rules non-negotiable):** before reading
`{FILE}` (or the `es/` for TODO markers), run `wc -l` on it — the Read tool truncates at 2000 lines
silently; if a file is near or over that, read it in passes with `offset` to the real end, and state
**"N lines, read to EOF"** in your report for every file you had to process end-to-end. **You write
English only.** You never create or edit the `es/`
file — a later stage translates your finished English. Your single deliverable is a `{FILE}` that is at
the full standard in English.

> **Before writing a new file or a new section, read the sibling files already in `{FILE}`'s `en/`
> folder** — enough to avoid duplicating an example or a concept another note already carries, to keep
> terminology consistent, and to wire forward/back references correctly (a note that references a file
> not written yet still gets the one-line forward-reference marker from the standard).

Before starting, read:
- the shared session rules — teaching rules and the "next file:" counters (update the counter only if you create a
  new numbered file this run).
- notes/prompts/_internal/_shared-context.md — my profile and the Spanish job market 2026.
- notes/prompts/knowledge/notes/_internal/_note-quality-standard.md — THE writing standard. This is your bar. Apply
  it in full to everything you write this run: zero-assumption, second-order completeness, signature
  elements, the anticipate-the-TODO pass, format mode, Docs link priority. Before writing a new file,
  read the first section of notes/java/es/08-excepciones.md to calibrate the *depth* (read it for the
  texture, not to copy Spanish — you write English).

---

## Scope — this run touches exactly ONE file

- `{FILE}` (the `en/` file) — and nothing else, except the shared session rules' "next file:" counter, and only if
  this run creates a new numbered file.

You do **not** create, read for editing, or touch the `es/` counterpart to *write* it — that is the
translator's job (stage T). The one exception is **reading** the `es/` file to find Victor's TODO
markers (see Step 1): Victor adds his doubts in the `es/` file, so you read them there as *input*, but
you write your answer in `{FILE}` (English). You never edit the `es/` file.

Do not read or edit `coverage.md`, `future-learning.md`, or any sibling note's body — if you notice a
gap that belongs elsewhere, mention it in the summary instead of acting on it.

---

## Fact-check gate — verify before you write, never from memory (applies to every step below)

Anything factual you put in `{FILE}` — a code fragment, an annotation, a class / interface / config
name, a dependency artifact, a version-specific API, a `File:` path, or a `Docs:` URL — must be verified
against the live source **before** it goes in, not recalled and hoped correct. Verify against the actual
project files for anything drawn from the project, against `pom.xml` for a dependency or a version-fact,
and against the real documentation page (opened, not pattern-guessed) for a link. If you cannot verify
it, write a `TODO` in its place; a gap Victor can see beats a fabrication he cannot.

This is a **prevention** gate at author time, not a review afterthought. The 2026-07-15 Spring Boot run
shipped fabricated code and version-facts into eight files — an annotation placed on a class that does
not carry it, a `JwtService` and a `JwtProperties` that are not in the repo, a whole
`Transaction`/`TransactionService` domain that was invented, `@MockBean` where Boot 4 needs
`@MockitoBean`, `spring-boot-starter-web` where the project uses `-webmvc`, plus roughly eight Baeldung
URLs built from a plausible-looking pattern. Every one was caught only because reviewer B ran on deep-reasoning
with an explicit fact-check mandate; on a cheaper reviewer they reach Victor's study notes as confident,
wrong material. Reviewer B is the backstop — it is not the reason you may write from memory.

---

## Step 1 — Resolve TODOs (if TASK includes them)

Victor adds his doubts as markers in the **`es/`** file (that is where he studies), so **read the
`es/` counterpart to find them**, then also scan `{FILE}` itself. Markers appear as `TODO:`,
`<!-- TODO: -->`, or `// TODO`. Two forms:

- **Instruction TODOs** — a direct correction or task (`TODO: add example`, `TODO: rewrite this
  paragraph`). Apply the fix literally, in English, in `{FILE}`.
- **Question TODOs** — Victor writes a doubt he wants clarified (`TODO: why does Spring create a new
  context here?`). These are NOT Q&A requests. Resolve the doubt by weaving the answer into the
  surrounding prose of the paragraph it appears in — the question itself must never appear in the
  notes. The result should read as if the explanation was always there. Never add a "Q:"/"A:" block
  or a subheading for the question.

  **Banned opening words — hard rule, no exceptions.** The sentence that resolves a question TODO must
  never start with a confirmation/agreement word: "Yes," / "Exactly," / "Correct," / "Good question" —
  or anything whose function is to validate before the fact appears. If the first draft starts with
  one, delete it and restructure so the sentence leads with the fact itself.
  - ❌ "Exactly: Java refuses to compile precisely because that file may not exist…"
  - ✅ "Java refuses to compile precisely because that file may not exist…"

  The test: after the fix, a reader who did not see the TODO should not be able to tell there was ever
  a question there. Run this test on every question-TODO resolution. Section headings derived from
  question TODOs use a descriptive noun phrase ("Constructors in subclasses"), never a question format
  ("Can a subclass add its own constructor?").

For each TODO: identify what Victor wants, apply the fix in English at the matching location in
`{FILE}`, and remove any TODO marker that lives in `{FILE}`. **Leave the marker in the `es/` file
untouched** — the translator (T) re-syncs the `es/` from your finished English and clears it there.
Note in the summary which TODOs you resolved so T knows which `es/` sections changed.

## Step 2 — Quality audit of this file (rule 2)

Check `{FILE}` against the standard in `_note-quality-standard.md`: WHY before the code, named
repeating patterns, correct format mode, file-level and section-level `Docs:` links, personal-guide
voice, forward-reference notes, cross-topic preview callouts.

**Action rules:**
- **Missing `Docs:` links** (file- or section-level) → **add them directly**. They are new content,
  not modifications to existing text. Follow the link priority in the standard. If you are not certain
  of the exact URL/sub-section, write `Docs: TODO — add link` — never guess.
- **Forward references / cross-topic references** without a note or preview callout → **add the
  note/callout directly** — it is new content, not a modification.
- **All other violations in existing prose** (wrong voice, wrong format mode, missing WHY, missing
  patterns):
  - `standard` mode → report in the summary only. Do not change the text (unless TASK explicitly
    names that section for rewrite).
  - `first-pass` mode → the checklist below takes precedence: fix directly, do not report.

## Step 3 — Complete the file to the standard (rule 3)

If TASK asks to create the file, add a section, or complete a thin one, write it to the full standard
in `_note-quality-standard.md`. When creating a new numbered file, use the next available number from
the shared session rules and update that counter.

If TASK is `create-file` for `00-intro-{topic}.md`, cover the four intro points from the standard:
high-level mental model, key concepts that appear everywhere, how it differs from JS/TS/React, and a
one-paragraph map of the rest of the notes.

## Step 4 — Self-check gate (before you finish)

The English reviewer (B) audits this file next, but do not lean on that — hand off clean work. Re-read
`{FILE}` and confirm, honestly:
- You ran the **anticipate-the-TODO pass** — you actually wrote out the 3–5 doubts Victor would raise
  and each is answered in the prose (mechanism, not just behaviour).
- Signature texture is present where the section warrants it (worked example, a diagram for anything
  structural, callouts, tables explained) — and no section visibly drops below its neighbours.
- No example or concept duplicates a sibling file you read; forward/cross-topic references are marked.
- The **fact-check gate** held: every code fragment, class/config name, dependency, version-specific
  API, `File:` path and `Docs:` link in the file was verified against the live source, not written from
  memory — anything unverifiable is a `TODO`, never a plausible guess.

If any check fails, fix it now.

---

## First-pass checklist — run on every section (first-pass mode only)

> **IMPORTANT:** The checklist runs on **every section unconditionally** — including sections with no
> TODO markers. TODOs and the first-pass checklist are two independent passes. After finishing TODOs,
> continue with the checklist on every remaining section.

Keep all code blocks and the `Purpose:`/`Docs:` labels unchanged — only rewrite prose. Exception: fix
a `File:` line whose path exists in no project. You MAY reorder sections if a different order is more
logical for learning (foundational → complex); note it in the summary with a one-line justification.

- **Voice and person** — Does the section address Victor directly ("you use this when…")? Passive
  voice and neutral third person must be rewritten.
- **Learning order** — Does the opening sentence lead with the *problem* the concept solves, not a
  definition? Is there 1–3 sentences of context before any code block?
- **Documentation test** — Could this be copy-pasted onto the official docs site word-for-word? If
  yes, rewrite so it explains why it matters, where it appears in a real project, and what would break
  without it.
- **Zero-assumption (first order)** — Is every term/annotation/method introduced also explained in the
  same section? Is there an obvious "why not X?" moment missing? Add it as a `> blockquote`.
- **Second-order completeness** — Apply all four rules from the standard (mechanism not just usage;
  confusable pairs contrasted; exact scope stated; JS/TS anchor only when truly equivalent).
- **Depth calibration** — Apply "Calibrate depth to Victor's bar" and the signature-elements block
  from the standard. Compare each section against its neighbours: raise any that drops below.

After a first-pass run, note in the summary that the file is now validated so Victor switches back to
`standard` for future runs.

---

## Output — report (you do NOT commit)

You never commit and never mark the worklist row — later stages (T translates, C commits) own that.
Leave your English work in the working tree and report:

- The **"N lines, read to EOF"** line for every file you processed end-to-end.
- The file's coverage status (✅ Complete / 🔧 Fixed / ➕ Added, from the standard).
- A short summary of what changed in `{FILE}`, and **which sections you touched** — the translator
  needs this to know what to (re)translate in the `es/`.
- Which TODOs you resolved (so T clears the matching `es/` markers).

If any issues remain in existing prose that you did not change (standard mode, no TODO), list them so
Victor can add a TODO next run:

**Reported issues — existing English text (require a TODO to fix):**
- `{FILE}` — [issue and which rule it violates]

**All-or-nothing.** If you cannot complete the file to the bar (blocked on a `File:` path, unsure of a
mechanism, missing project context), do NOT leave a half-written file — revert your partial edits and
report what blocked you so the row can be re-run cleanly. A partial English file would poison every
stage after you.

````
