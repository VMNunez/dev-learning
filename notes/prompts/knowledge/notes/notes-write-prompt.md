# Notes write prompt — the AUTHOR component (one file)

**Internal component.** This is the **author** in the notes pipeline. You normally don't launch it —
`notes-audit.md` dispatches it as a cold subagent, one per file, then hands the result to
`notes-review-prompt.md` (the reviewer). It is documented here so the audit prompt can point a
subagent at it; you can also run it standalone to draft/correct a single file.

**What it does.** Takes a single note file and does the heavy, high-standard work on it: resolves its
TODOs, audits its quality, completes it to the full writing standard, and mirrors every change to the
Spanish counterpart. It is the only component that writes rich note prose.

**Why one file at a time.** The writing standard is long and demanding. Applying it to a whole folder
at once overloads the model's attention and the standard is the first thing that slips — which is
exactly why the old whole-folder audit skipped work. A cold subagent bounded to one file keeps the
full attention budget on that file, so the standard actually gets applied every time.

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

I want you to do deep work on ONE notes file: {FILE}. Do only what {TASK} asks — do not wander into
other files or folder-level work.

> **If `{TASK}` is `create-es`** (translate an already-finished `en/` file into its missing `es/`
> counterpart): the `en/` file is validated — do NOT audit or change it. Do only Step 4 (translate
> `en/` → create the `es/` file, Spanish filename, natural Spanish prose) and Step 5 (mark the row).
> Skip Steps 1–3. Then commit/report as usual.
>
> **Before writing a new file or a new section, read the sibling files already in `{FILE}`'s `en/`
> folder** — enough to avoid duplicating an example or a concept another note already carries, to keep
> terminology consistent, and to wire forward/back references correctly (a note that references a file
> not written yet still gets the one-line forward-reference marker from the standard).

Before starting, read:
- CLAUDE.md — teaching rules and the "next file:" counters (update the counter only if you create a
  new numbered file this run).
- notes/prompts/_shared-context.md — my profile and the Spanish job market 2026.
- notes/prompts/knowledge/notes/_note-quality-standard.md — THE writing standard. This is your bar. Apply
  it in full to everything you write this run: zero-assumption, second-order completeness, signature
  elements, the anticipate-the-TODO pass, format mode, bilingual rules, Docs link priority. Before
  writing a new file, read the first section of notes/java/es/08-excepciones.md to calibrate.

---

## Scope — this run touches exactly two files

- `{FILE}` (the `en/` file), and
- its `es/` counterpart, identified by the **same number prefix** (e.g. `en/08-exceptions.md` →
  `es/08-excepciones.md`). Victor studies from `es/`, so apply changes there first, then mirror to
  `en/`. If the `es/` counterpart does not exist yet, create it as part of this run.

Do **not** touch any other file except CLAUDE.md's "next file:" counter, and only if this run creates
a new numbered file. Do not read or edit `coverage.md`, `future-learning.md`, or any sibling note —
if you notice a gap that belongs elsewhere, mention it in the summary instead of acting on it. The
folder-level survey is the plan prompt's job.

---

## Step 1 — Resolve TODOs (if TASK includes them)

Scan `{FILE}`'s `es/` counterpart first (that is where Victor adds markers), then the `en/` file.
Markers appear as `TODO:`, `<!-- TODO: -->`, or `// TODO`. Two forms:

- **Instruction TODOs** — a direct correction or task (`TODO: add example`, `TODO: rewrite this
  paragraph`). Apply the fix literally.
- **Question TODOs** — Victor writes a doubt he wants clarified (`TODO: why does Spring create a new
  context here?`). These are NOT Q&A requests. Resolve the doubt by weaving the answer into the
  surrounding prose of the paragraph it appears in — the question itself must never appear in the
  notes. The result should read as if the explanation was always there. Never add a "Q:"/"A:" block
  or a subheading for the question.

  **Banned opening words — hard rule, no exceptions.** The sentence that resolves a question TODO must
  never start with a confirmation/agreement word, in either language: "Sí," / "Yes," / "Exacto," /
  "Exactly," / "Correcto," / "Efectivamente," / "Claro," / "Tu intuición es correcta" / "Buena
  pregunta" — or anything whose function is to validate before the fact appears. If the first draft
  starts with one, delete it and restructure so the sentence leads with the fact itself.
  - ❌ "Exacto: Java se niega a compilar precisamente porque ese fichero puede no existir…"
  - ✅ "Java se niega a compilar precisamente porque ese fichero puede no existir…"

  The test: after the fix, a reader who did not see the TODO should not be able to tell there was ever
  a question there. Run this test on every question-TODO resolution. Section headings derived from
  question TODOs use a descriptive noun phrase ("Constructors in subclasses"), never a question format
  ("Can a subclass add its own constructor?").

For each TODO: identify what Victor wants, apply the fix at that exact location in `es/`, mirror the
equivalent fix to `en/`, remove the marker in both files, and note what changed in the summary.

## Step 2 — Quality audit of this file (rule 2)

Check `{FILE}` against the standard in `_note-quality-standard.md`: WHY before the code, named
repeating patterns, correct format mode, file-level and section-level `Docs:` links, personal-guide
voice, forward-reference notes, cross-topic preview callouts.

**Action rules:**
- **Missing `Docs:` links** (file- or section-level) → **add them directly**, in both modes. They are
  new content, not modifications to existing text. Follow the link priority in the standard. If you
  are not certain of the exact URL/sub-section, write `Docs: TODO — add link` — never guess.
- **Forward references / cross-topic references** without a note or preview callout → **add the
  note/callout directly** in both modes — it is new content, not a modification.
- **All other violations in existing prose** (wrong voice, wrong format mode, missing WHY, missing
  patterns):
  - `standard` mode → report in the summary only. Do not change the text (unless TASK explicitly
    names that section for rewrite).
  - `first-pass` mode → the checklist below takes precedence: fix directly, do not report.

## Step 3 — Complete the file to the standard (rule 3)

If TASK asks to create the file, add a section, or complete a thin one, write it to the full standard
in `_note-quality-standard.md`. New content always follows the standard fully, in both modes. When
creating a new numbered file, use the next available number from CLAUDE.md and update that counter.

If TASK is `create-file` for `00-intro-{topic}.md`, cover the four intro points from the standard:
high-level mental model, key concepts that appear everywhere, how it differs from JS/TS/React, and a
one-paragraph map of the rest of the notes.

## Step 4 — Mirror to `es/`

Every change above must exist in both files. Apply to `es/` first (Victor's primary), then `en/`.
Spanish prose must read as natural Spanish, not a word-for-word translation — fix calque vocabulary
("escanear" → "leer", "retornar" → "devolver") and English word order. Translate structural labels
(`Purpose:` → `Propósito:`, `File:` → `Archivo:`; `Docs:` stays).

## Step 4.5 — Self-check gate (before you mark done or commit)

Nothing reviews this file after you — under the orchestrator it is committed unread. So verify your
own work before finishing. Re-read the file you produced and confirm, honestly:
- You ran the **anticipate-the-TODO pass** — you actually wrote out the 3–5 doubts Victor would raise
  and each is answered in the prose (mechanism, not just behaviour).
- Signature texture is present where the section warrants it (worked example, a diagram for anything
  structural, callouts, tables explained) — and no section visibly drops below its neighbours.
- `en/` and `es/` are truly in sync — same sections, same code, and the `es/` reads as native Spanish.
- No example or concept duplicates a sibling file you read; forward/cross-topic references are marked.
- Every `Docs:` link is real (or left as `Docs: TODO — add link`), never guessed.

If any check fails, fix it now — do not commit a file that misses its own bar. This gate is the
replacement for the human review that used to happen before the commit.

## Step 5 — Mark this file done in the worklist (automatic)

Derive the worklist path from the topic root of `{FILE}` — e.g. `{FILE} = notes/java/en/08-exceptions.md`
→ `notes/java/notes-worklist.md`. If that file exists, find the row whose path matches `{FILE}` and
flip its checkbox from `[ ]` to `[x]` — edit only that one line (`- [ ] #N · {FILE}` → `- [x] #N · {FILE}`),
change nothing else. This is how progress is tracked without Victor marking anything by hand.

**All-or-nothing.** If you cannot complete the file to the bar (blocked on a `File:` path, unsure of a
mechanism, missing project context), do NOT commit a partial file and do NOT flip the checkbox. Leave
the row `[ ]`, revert your partial edits, and report what blocked you so it can be re-run cleanly.

If the worklist file does not exist (this run was launched directly, not from a plan), skip this step
silently — there is nothing to mark.

---

## First-pass checklist — run on every section (first-pass mode only)

> **IMPORTANT:** The checklist runs on **every section unconditionally** — including sections with no
> TODO markers. TODOs and the first-pass checklist are two independent passes. Resolving all TODOs
> does not complete the first-pass run. After finishing TODOs, continue with the checklist on every
> remaining section.

Keep all code blocks and the `Purpose:`/`Docs:` labels unchanged — only rewrite prose. Exception: fix
a `File:` line whose path exists in no project (real project path, a representative generic path, or
omit); do not touch a valid `File:` line. You MAY reorder sections if a different order is more
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
  from the standard. Compare each section against its neighbours in the same file: if they carry the
  signature texture (diagram, worked example, callouts, table explained) and this one doesn't, raise
  it to match. A file must not visibly shift standard halfway through.
- **Translation quality (`es/` only)** — natural Spanish, not a calque of the English.

After a first-pass run, note in the summary that the file is now validated so Victor switches back to
`standard` for future runs.

---

## Output — report and commit

Give the file its coverage status (✅ Complete / 🔧 Fixed / ➕ Added, from the standard) and a short
summary of what changed in both `en/` and `es/`.

If any issues remain in existing prose that you did not change (standard mode, no TODO), list them so
Victor can add a TODO next run:

**Reported issues — existing text (require a TODO to fix):**
- `{FILE}` — [issue and which rule it violates]

Then the commit — one command per code block:

```
git add <the en/ file, the es/ file, and CLAUDE.md if the counter changed — exact paths, no wildcards>
```

```
git commit -m "docs: <type> {TOPIC} note <NN> — <one-line summary>"
```

Use `➕ Added` → `feat`-style summary "add"; `🔧 Fixed`/TODO resolutions → "fix"/"resolve"; keep it to
one logical change per commit. If this run both created a file and resolved unrelated TODOs in it,
that is still one file → one commit.

````
