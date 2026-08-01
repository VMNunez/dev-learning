# Notes translate prompt — the TRANSLATOR component (one file, en/ → es/)

This is stage **T** of a four-stage build: English author (A) → English reviewer (B) → **translator
(T)** → Spanish reviewer (C). By the time you run, the `en/` file is **finished and reviewed** — it is
the canonical source. Your single job is to produce (or re-sync) its `es/` counterpart as **natural,
first-class Spanish**, then hand off to the Spanish reviewer who reads it cold and commits.

**Why translation is its own stage.** Writing rich English to the standard and rendering it as native
Spanish are two different cognitive jobs. When one subagent did both, the Spanish got whatever
attention was left after the heavy English work — and it was written *before* the English review, so
every English fix forced a re-sync. Translating only the final, reviewed English, in its own cold
context, means the Spanish is produced once from a stable source with the full attention budget on
making it read like Spanish.

**You do not audit or change the English.** The `en/` is validated and canonical. You read it as the
source of truth and mirror it. If you believe an English sentence is wrong, do **not** fix it — note it
in your report; the English is not yours to touch.

---

**How to use:**

1. Fill in `TOPIC` and `FILE` — `FILE` is the **`en/`** path; you create/update its `es/` counterpart
   (same number prefix, Spanish filename, e.g. `en/08-exceptions.md` → `es/08-excepciones.md`).
2. Paste into a fresh conversation (or let the orchestrator dispatch it).

---

````
## Configuration — edit only this block

TOPIC = [one registered topic from `../../coverage/_internal/_topic-ownership.md`]
LEVEL = [junior | middle | senior]
FILE  = [exact en/ file path (the canonical source), e.g. notes/java/junior/en/08-exceptions.md]

SCOPE = [full | append-only — with append-only, list the exact English headings that were appended]

Use TOPIC, LEVEL, FILE, and SCOPE wherever the prompt refers to their placeholders.

> **`SCOPE = append-only`: the `es/` file is FROZEN.** Victor refined it and declared it final, and this
> run exists only to add coverage that arrived later. Translate **only the appended English headings
> named in SCOPE** and append their Spanish counterparts at the matching position. Do not re-sync, do not
> re-translate, do not "improve" and do not clear a `TODO:` marker anywhere else — every pre-existing
> byte of the `es/` stays as it is, even where it now diverges from the English. Structural parity is
> owed only for the appended sections. Your trace marks every other heading `frozen`, and your report
> must include a `git diff` proving the `es/` changes are additions only.

---

You translate exactly ONE file: the canonical `en/` source `{FILE}` → its `es/` counterpart (same
number prefix). Read `{FILE}` **in full, top to bottom**, and produce an `es/` that is its faithful,
natural-Spanish mirror. If the `es/` already exists, **re-sync it** to the current English: bring over
every section, code block, table, and callout so the two match exactly, and clear any leftover `TODO:`
marker Victor wrote in the `es/` (the English author already resolved the doubt in `{FILE}`).

> **Verifiable read (the shared session rules non-negotiable):** run `wc -l` on `{FILE}` (and the existing `es/`, if
> any) before reading — the Read tool truncates at 2000 lines **silently**; a truncated read here means
> a silently missing tail in the translation. If a file is near or over 2000 lines, read it in passes
> with `offset` to the real end. Your report must state **"N lines, read to EOF"** for each file read
> whole; the orchestrator rejects a report without it.

Before starting, read:
- `{FILE}` — the canonical English source (your input, do not change it).
- The existing `es/` counterpart, if any (you are re-syncing it, not starting blind).
- The first section of `notes/java/junior/es/08-excepciones.md` — the reference for what finished, native
  Spanish notes read like.
- notes/prompts/knowledge/notes/_internal/_note-quality-standard.md — the bilingual rules and the Spanish-prose
  expectations (structural labels, calque list).

## What you produce

An `es/` file that is **structurally identical** to `{FILE}` — same sections in the same order, same
code blocks, same tables, same `> blockquote` callouts, same diagrams — but whose **prose reads as
native Spanish**, not a word-for-word calque of the English.

- **Structural parity is exact.** Every `##`/`###` heading in `{FILE}` exists in the `es/`; every code
  block is present unchanged (comments may be translated to natural Spanish); every table and callout
  is carried over. Do not add or drop sections — this is a mirror.
- **Internal cross-file links point at the Spanish filename in `es/`.** When `{FILE}` links to a
  sibling note (e.g. `[10-generics.md](10-generics.md)`), the `es/` must link to that sibling's **`es/`
  counterpart by its Spanish name** — `[10-genericos.md](10-genericos.md)`, not the English filename.
  The `es/` folder is self-contained: every internal link resolves to a file that exists in `es/`.
  Never carry an English filename into an `es/` link (it becomes a broken link the moment the reader
  clicks it). If you are unsure of a sibling's exact Spanish filename, list the selected
  `notes/{TOPIC}/{LEVEL}/es/` directory and
  match by numeric prefix. Prose-only references with no markdown link stay prose-only.
- **Prose is native Spanish.** Fix calque as you translate: `escanear`→`leer`, `retornar`→`devolver`,
  English word order, literal idioms. Translate structural labels: `Purpose:`→`Propósito:`,
  `File:`→`Archivo:`; `Docs:` stays. Technical English terms Victor hears at work (*deploy, refactor,
  stack, edge case, trade-off*) stay in English inside the Spanish prose — that is correct, not calque.
- **Meaning is identical.** Same idea, same emphasis, same worked example — only the language changes.
  Do not summarise, do not expand, do not "improve" the content; render it.

## Section-by-section trace (mandatory — proof you translated the whole file)

List **every `##`/`###` heading in order** and, next to each, write `translated` (or `re-synced` if it
already existed and you updated it). A report without this trace is not accepted — it is your proof you
reached the last line instead of stopping at the middle of the file.

## Finish

**You do not commit and do not mark the persistent plan entry** — the Spanish reviewer (C) reads your `es/`
cold, polishes naturalness, and owns the single atomic commit. Leave the `es/` file in the working
tree and report:
- `TRANSLATED` (created the `es/`) or `RE-SYNCED` (updated an existing `es/`).
- The **"N lines, read to EOF"** line for `{FILE}` (and the prior `es/`, if read).
- The section-by-section trace.
- The persistent plan owns paths and numbering — you never change either.
- Any English sentence you believe is wrong (for a follow-up author run — you did **not** change it).

````
