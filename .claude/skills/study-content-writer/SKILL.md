---
name: study-content-writer
description: >
  Load and apply Victor's quality standards WHENEVER you are about to write, refine, complete,
  or resolve a TODO in a study-notes file (notes/{topic}/en/ or es/) or an interview-prep Q&A
  file (notes/interview-prep/en/ or es/) DURING A DAILY SESSION — i.e. any time outside the
  dedicated /notes-audit or /interview-prep-audit runs. These standards otherwise only load inside
  those separate audit pipelines, so inline note/Q&A writing silently misses the bar. Trigger on
  requests like "add a note about X", "write up what we just learned", "add an interview question
  for this", "explain this in the notes", "resolve this TODO in the note", or any edit under
  notes/{topic}/ or notes/interview-prep/. Do NOT trigger for project code, READMEs, PLANNING.md,
  PROGRESS.md, or the prompt files themselves.
---

# Writing study content inline (notes & interview-prep)

When this skill fires, you are writing study content **outside** the audit pipeline. Your job is to
hit the exact same quality bar the pipeline would, so daily-session notes are never second-class.

## Step 1 — Load the right standard FIRST (before writing a single line)

- Writing or refining a **note** (`notes/{topic}/en|es/*.md`) →
  read `notes/prompts/knowledge/notes/_note-quality-standard.md` in full.
- Writing or refining an **interview question** (`notes/interview-prep/en|es/*.md`) →
  read `notes/prompts/knowledge/interview-prep/_interview-prep-standard.md` in full.
- If the task touches both, read both.

These files are the single source of truth — do not summarize or approximate them from memory.
Apply their format modes, signature elements, and rules exactly.

## Step 2 — Apply the two rules that carry most of the weight (from CLAUDE.md)

1. **Explain the mechanism, not just the behaviour.** Say *why* it works, under the hood, step by
   step. Tracing the mechanism is the number-one reason Victor otherwise has to add TODOs.
2. **Anticipate his "why?" before he asks it.** Simulate his chained "why does this work?" /
   "does this mean that?" questions and make the prose already answer them. Never mention an action
   in the abstract without the concrete code snippet.

The gold-standard reference for texture is the first section of `notes/java/es/08-excepciones.md`:
open with the pain not the definition; one worked example carried through; ASCII diagrams for
anything structural; real-world analogies; abundant `> blockquote` callouts (~one per non-obvious
sub-concept); a sentence explaining how to read every table; exact error messages; MAL/BIEN examples.

## Step 3 — Honour the bilingual en/es contract

- **`en/` is the canonical source; `es/` is its first-class translation.** Author and correct the
  content in `en/` first, then translate into `es/`. Both must contain the same files with the same
  structure and code blocks.
- New file in `en/` → create the full `es/` translation (same filename). TODO resolved or section
  added → do it in `en/`, then re-sync `es/`.
- **A TODO Victor wrote in `es/`** is read as *input*: resolve the doubt in `en/`, then bring the
  answer into `es/` and clear the marker. The answer round-trips through English — that is expected.
- **Intentional trims are made in `en/`.** If Victor cut something from `es/` (e.g. JS filler — never
  add those, see the no-JS-filler rule), do not restore it; remove it from `en/` too so it stays gone.
  Never re-add to `es/` content that is absent from `en/`.
- **Spanish prose must read as natural native Spanish, not a word-for-word translation.** Same idea,
  same emphasis, different words where needed. Translate structural labels (`Purpose:` → `Propósito:`,
  `File:` → `Archivo:`; `Docs:` stays).
- Victor studies from `es/` — give it equal care, never a rushed translation.

## Step 4 — Respect the folder counters

Update the `next file:` counter for the topic in CLAUDE.md if you create a new numbered file.

## What this skill does NOT do

It does not commit, does not run the audit pipeline, and does not restructure the whole topic.
For a full topic build or audit, that is `/notes-audit` or `/interview-prep-audit` in a separate
session — this skill is only for getting inline, in-session writing right.
