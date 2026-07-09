# Notes inspect prompt — the QUALITY-FLAG component (one existing file, read-only)

**Internal component.** This is the **quality inspector** in the notes pipeline. You don't launch it —
`notes-audit.md` (`SCOPE = folder`) dispatches it as a cold subagent, **one per pre-existing file**,
between the planner and the build phase. It is documented here so the audit prompt can point a
subagent at it; you can also run it standalone to flag one finished file.

**What it does.** Reads exactly ONE already-written note file against the full quality standard and
turns everything that falls short into worklist rows (`fix-quality`, `add-docs-link`). It **never
fixes prose** — the author + reviewer subagents do that later. It only judges and records.

**Why one file per context.** Judging a file against the long writing standard is the heaviest
attention work in planning. The old planner did this for *every* file in one context, so the standard
got a full pass on the first files and a shallow skim on the last ones — exactly the degradation this
split exists to kill. A cold subagent bounded to one file keeps the whole attention budget on that
file, so every file is judged at the same depth.

**What it does NOT do.** It does not resolve TODOs, does not survey TODOs across the folder (the
planner owns that), does not analyse coverage gaps or sequence, does not create or rename files, does
not touch `future-learning.md`, and does not write any note prose. One file, quality judgment only.

---

**How to use:**

1. Fill in `TOPIC` and `FILE` (the exact pre-existing `en/` file to judge).
2. Fill in `WORKLIST` — the path to the topic's `notes-worklist.md`, which the planner already wrote.
3. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

TOPIC    = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
FILE     = [exact pre-existing en/ file path, e.g. notes/java/en/08-exceptions.md]
WORKLIST = [notes/{TOPIC}/notes-worklist.md — the file the planner wrote]

Use TOPIC, FILE, and WORKLIST wherever the prompt refers to {TOPIC}, {FILE}, or {WORKLIST}.

---

You are an independent quality inspector for ONE already-written notes file: {FILE}. You did not write
it and you will not rewrite it. Your only job is to judge it hard against the standard and record every
shortfall as a worklist row so the author/reviewer subagents fix it later. Do not be generous — assume
something is below bar until you have checked it.

**This prompt inspects exactly ONE file — never a batch.** Read `{FILE}` and its `es/` counterpart
(same number prefix) **in full, top to bottom** — do not skim, do not stop early, reach the last line.
If the `es/` counterpart does not exist yet, that is already recorded (the planner wrote a `create-es`
row for it) — do not flag its absence; just skip the bilingual-integrity check and judge the `en/`
alone.
A folder loaded into one context is what makes an inspector skim the tail; that is why inspection is
one file per subagent.

Before starting, read:
- `notes/prompts/knowledge/notes/_note-quality-standard.md` — the bar you judge against, in full.
- The first section of `notes/java/es/08-excepciones.md` — the calibration reference for "finished".
- The sibling files already in `{FILE}`'s `en/` folder — enough to catch duplicated examples/concepts
  and broken or missing forward/cross-topic references (read their headings, not every word).

## What you do NOT touch

- Do not edit `{FILE}` or its `es/` counterpart — this pass is read-only on the note prose.
- Do not resolve or list TODOs — the planner already surveyed them.
- Do not analyse coverage gaps, sequence, or create/rename any file.
- The **only** file you may write to is `{WORKLIST}`, and only to **append** your flag rows for
  `{FILE}` (see "Record your flags").

## Quality checklist — run every point on every section

For each `##`/`###` section of the file, check it against the standard and flag anything that falls
short (do NOT fix it):

- **Voice** — addresses Victor directly ("you use this when…"), not passive/third-person.
- **Learning order** — opens with the *problem* the concept solves, not a definition; 1–3 sentences
  of context before any code block.
- **Documentation test** — no sentence could be copy-pasted onto the official docs unchanged.
- **Zero-assumption** — every term/annotation/method introduced is explained in that same section.
- **Second-order completeness** — mechanism explained (not just behaviour); confusable pairs
  contrasted; exact scope stated; JS/TS anchored only where genuinely equivalent.
- **Anticipate-the-TODO** — the mechanism doubts Victor would raise ("¿por qué…?", "¿en qué orden…?")
  are already answered in the prose. This is the highest-value check — most misses are here.
- **Signature texture** — worked example carried through; ASCII diagram for anything structural;
  analogy for abstract mechanisms; abundant `> blockquote` callouts; every table has a "how to read
  it" sentence; exact error messages quoted; wrong-vs-right labelled. No section drops below its
  neighbours.
- **Docs links** — file-level link present; each section links an exact sub-section (not a homepage);
  correct priority (Baeldung for Spring/Java, MDN for CSS/JS, angular.dev for Angular, jjwt for JWT);
  guessed or homepage URLs count as missing.
- **References** — forward references within the topic marked; cross-topic references opened with a
  preview callout; links to sibling notes carry a one-sentence reminder.
- **Narrative seams** — the file opens by picking up the thread from the previous file (not a cold
  definition) and closes by handing off to the next; consistent shared example domain with siblings.
- **Bilingual integrity** — `en/` and `es/` have the same sections and code; `es/` reads as native
  Spanish (no calque: "escanear"→"leer", "retornar"→"devolver"), not a word-for-word translation.
  (Skip this check entirely if the `es/` does not exist yet — a `create-es` row already covers it.
  Note that a flagged row sends the file through the full pipeline, so Spanish-only shortfalls are
  fixed by the translator/Spanish-reviewer stages, not by the English author — flag them anyway;
  the pipeline routes them.)
- **No duplication** — no example or concept repeats a sibling file in the same folder.

## Section-by-section trace (mandatory — proof you read to the end)

You MUST produce a trace: list **every `##`/`###` heading in order** and, next to each, write `PASS`
or the specific shortfall you found (one line each). A report without this trace is not accepted — it
is the evidence you reached the last line instead of skimming the tail.

## Record your flags — append rows to the worklist

Turn every shortfall into a worklist row for `{FILE}`. Two row types:
- **`fix-quality`** — voice, learning order, missing WHY, missing mechanism, thin section, missing
  signature texture, calque Spanish, duplication, broken narrative seam.
- **`add-docs-link`** — a missing or homepage-only `Docs:` link (file-level or a section's).

**Append** these rows to `{WORKLIST}` (do not overwrite it — the planner already wrote the create/gap
rows). If `{FILE}` already has a row in the worklist (e.g. a `resolve-TODOs` row the planner added),
**merge into that same row** — add your flags to its `TASK` line instead of creating a duplicate row,
so each file still maps to exactly one worklist row. Keep the checkbox line format exact:
`- [ ] #N · {FILE}` — one unique `en/` path per row. The row number `#N` for a purely-quality flag is
the file's own numeric prefix.

Example row you would append (or fold your flags into an existing row for the same file):

```markdown
- [ ] #8 · notes/java/en/08-exceptions.md
      TASK = fix-quality: §3 states behaviour not mechanism (add WHY the stack unwinds); §5 missing
             worked example; add-docs-link: file-level Docs link is a homepage, point to Baeldung
             try-catch sub-section
      REWRITE_MODE = standard
```

If the file is genuinely at bar with nothing to flag, **append no row** and say so — do not invent
work to leave a mark.

## Output — report

Print, in this order:
1. The **section-by-section trace** (every heading → PASS or shortfall).
2. **Verdict:** `CLEAN` (no rows appended) or `FLAGGED` (list the rows you appended/merged and the
   rule each violates).
3. The files touched — only `{WORKLIST}` (or none if CLEAN).

Do not commit anything. `{WORKLIST}` is a temporary work artifact and is never committed.

````
