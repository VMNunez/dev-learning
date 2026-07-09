# Notes review prompt — second-pass auditor for ONE file

This is the **reviewer half** of a two-subagent build: the write prompt authors a file, then this
prompt audits and fixes it before it is committed. It exists because, under the orchestrator, notes
are committed unread — a fresh reviewer with no stake in the draft catches what the author, close to
their own text, misses. Run it on **one file**, right after the write prompt produced it.

It is normally launched by `notes-audit.md` as subagent **B** (the write prompt is subagent A). You
can also run it standalone to audit a single finished file.

---

**How to use:**

1. Fill in `TOPIC` and `FILE` (the exact `en/` file just authored).
2. Fill in `DRY_RUN` — `false` (fix, mark done, commit) or `true` (fix only, leave everything staged
   for Victor to review and commit).
3. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

TOPIC   = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
FILE    = [exact en/ file path just authored, e.g. notes/java/en/08-exceptions.md]
DRY_RUN = [false | true]

Use TOPIC, FILE, and DRY_RUN wherever the prompt refers to {TOPIC}, {FILE}, or {DRY_RUN}.

---

You are the independent reviewer for one just-authored notes file: {FILE}. You did not write it.
Your job is to audit it hard against the standard, fix what falls short, and only then let it through.
Do not be generous — the author already believed it was done. Assume something is below bar until you
have checked.

Before starting, read:
- notes/prompts/knowledge/notes/_note-quality-standard.md — the bar you audit against, in full.
- The first section of notes/java/es/08-excepciones.md — the calibration reference for "finished".
- The sibling files already in `{FILE}`'s `en/` folder — to catch duplicated examples/concepts and
  broken or missing forward/cross-topic references.
- Both `{FILE}` and its `es/` counterpart (same number prefix).

## Audit checklist — run every point on every section

For each section of the file, check:
- **Voice** — addresses Victor directly ("you use this when…"), not passive/third-person.
- **Learning order** — opens with the *problem*, not a definition; 1–3 sentences of context before
  any code block.
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
  no guessed URLs (a guess must be `Docs: TODO — add link`).
- **References** — forward references within the topic marked; cross-topic references opened with a
  preview callout; links to sibling notes carry a one-sentence reminder.
- **Narrative seams** — the file opens by picking up the thread from the previous file (not a cold
  definition) and closes by handing off to the next; where a sibling uses a shared example domain, this
  file stays consistent with it. Read the neighbouring files to check the seams, not just this one in
  isolation.
- **Bilingual integrity** — `en/` and `es/` have the same sections and code; `es/` reads as native
  Spanish (no calque: "escanear"→"leer", "retornar"→"devolver"), not a word-for-word translation.
- **Spanish reads standalone** — do a dedicated pass reading the `es/` file **from top to bottom on
  its own, without looking at the `en/` version**, as if it were the only source. Confirm it flows as
  a continuous, well-written Spanish text: the narrative thread works in Spanish (each section leads
  into the next, opens on-thread and hands off), the prose is easy to follow, and no sentence only
  makes sense if you mentally back-translate it to English. A passage that is technically correct but
  reads as translated-from-English, breaks the flow, or forces the reader to reconstruct the English
  is a fail — rewrite it as native Spanish. The `es/` must stand as a first-class study text, not a
  mirror of the `en/`.
- **No duplication** — no example or concept repeats a sibling file in the same folder.

## Fix, don't just report

Where a check fails, **fix it directly** in both `{FILE}` and its `es/` counterpart — you are the
last quality pass, not an advisor. Preserve the author's correct work; only change what misses the
bar. Keep code blocks and `Purpose:`/`Docs:` labels intact unless a `File:` path is invalid.

If the file is genuinely already at bar, change nothing and record it as PASS — do not rewrite good
text to leave a mark.

## Finish

**If `{DRY_RUN}` = false:**
1. Mark the worklist row done: derive `notes/{TOPIC}/notes-worklist.md`, find the row whose path is
   `{FILE}`, flip `- [ ] #N · {FILE}` → `- [x] #N · {FILE}` (that one line only).
2. Commit this one file atomically: `git add` the `en/` path, the `es/` path, and CLAUDE.md only if
   the counter was bumped (never add `notes-worklist.md`), then `git commit` with a message covering
   authoring + review, e.g. `docs: add {TOPIC} note NN — <topic> (reviewed)`.

**If `{DRY_RUN}` = true:** do not mark the row, do not commit. Leave every change in the working tree.

Then report your **verdict** for this file:
- `PASS` (no changes needed) or `FIXED` (with a short bullet list of what you corrected and why).
- The coverage status (✅/🔧/➕), the files touched, and — if committed — the commit hash.

````
