---
name: study-content-writer
description: >
  Load and apply Victor's quality standards WHENEVER you are about to write, refine, complete,
  or resolve a TODO in a study-notes file (notes/{topic}/{level}/en/ or es/) or an interview-prep Q&A
  file (`notes/interview-prep/{LEVEL}/en/` or `es/`) DURING A DAILY SESSION — i.e. any time outside the
  dedicated /notes-audit or /interview-prep-audit runs. These standards otherwise only load inside
  those separate audit pipelines, so inline note/Q&A writing silently misses the bar. Trigger on
  requests like "add a note about X", "write up what we just learned", "add an interview question
  for this", "explain this in the notes", "resolve this TODO in the note", or any edit under
  notes/{topic}/ or notes/interview-prep/. Do NOT trigger for project code, READMEs, PLANNING.md,
  PROGRESS.md, or the prompt files themselves.
---

# Writing study content inline (notes & interview-prep)

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.


When this skill fires, you are writing study content **outside** the audit pipeline. Your job is to
hit the exact same quality bar the pipeline would, so daily-session notes are never second-class.

## Step 1 — Load the right standard FIRST (before writing a single line)

- Writing or refining a **note** (`notes/{topic}/{LEVEL}/en|es/*.md`) →
  read `notes/prompts/knowledge/notes/_internal/_note-quality-standard.md` in full.
- Writing or refining an **interview question** (`notes/interview-prep/{LEVEL}/en|es/*.md`) →
  read `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` in full.
- If the task touches both, read both.

These files are the single source of truth — do not summarize or approximate them from memory.
Apply their format modes, signature elements, and rules exactly.

## Step 2 — Apply the two rules that carry most of the weight

These two rules come from `notes/prompts/_internal/_session-rules.md` → `notes/ folder` →
`Detail standard`; that shared session contract, not a platform adapter, owns them.

1. **Explain the mechanism, not just the behaviour.** Say *why* it works, under the hood, step by
   step. Tracing the mechanism is the number-one reason Victor otherwise has to add TODOs.
2. **Anticipate his "why?" before he asks it.** Simulate his chained "why does this work?" /
   "does this mean that?" questions and make the prose already answer them. Never mention an action
   in the abstract without the concrete code snippet.

The gold-standard reference for texture is the first section of `notes/java/junior/es/08-excepciones.md`:
open with the pain not the definition; one worked example carried through; ASCII diagrams for
anything structural; real-world analogies; abundant `> blockquote` callouts (~one per non-obvious
sub-concept); a sentence explaining how to read every table; exact error messages; MAL/BIEN examples.

## Step 3 — Honour the bilingual en/es contract

- **`en/` is the canonical source; `es/` is its first-class translation.** Author and correct the
  content in `en/` first, then translate into `es/`. Once a plan entry completes, both hold a matching
  file per **number prefix**, with the same structure and code blocks.
- New file in `en/` → create the full `es/` translation under a **Spanish** filename carrying the same
  number prefix (`en/03-methods.md` → `es/03-metodos.md`) — never a copy of the English name. The
  prefix is the only shared part; technical proper names with no Spanish equivalent (`maven`, `enums`,
  `streams`, `lambdas`) keep theirs. A new section added → write it in `en/`, then re-sync `es/`.
- **Resolving a TODO runs in the direction of the file that carries it** — the one operation that
  overrides the canonical-source rule above (given 2026-08-20). A TODO Victor wrote in `es/` is
  resolved **in `es/`**, in Spanish, applying his instruction as written; only then is the updated
  `es/` file translated back into `en/`. A TODO in `en/` is resolved in `en/`, then translated into
  `es/`. Never route an `es/` TODO through English first — his TODOs are usually corrections to the
  Spanish prose itself ("no uses esa palabra", "esa frase está mal expresada"), and rewriting in
  English and re-translating discards the exact wording he asked for.
- **Intentional trims are made in `en/`.** If Victor cut something from `es/` (e.g. JS filler — never
  add those, see the no-JS-filler rule), do not restore it; remove it from `en/` too so it stays gone.
  Never re-add to `es/` content that is absent from `en/`.
- **Spanish prose must read as natural native Spanish, not a word-for-word translation.** Same idea,
  same emphasis, different words where needed. Translate structural labels (`Purpose:` → `Propósito:`,
  `File:` → `Archivo:`; `Docs:` stays).
- Victor studies from `es/` — give it equal care, never a rushed translation.

## Step 4 — A note edit must belong to the plan

The notes plan is the register and the authoring pipeline. Before editing a note, locate its exact
entry in `notes/{topic}/coverage/notes-plan-{LEVEL}.md`.

- A missing entry or `Status: pending` means the content belongs to `/notes-plan` + `/notes-audit`.
  Name that handoff and do not create or complete the file inline.
- An existing `complete` pair may be refined inline or have a TODO resolved. Keep the
  bilingual contract, then set that entry's `Studied:` field to `pending` (insert it when legacy),
  because the accepted prose changed after its last study pass.
- A `refined` pair remains frozen. Report the requested change and wait for Victor to set its status
  back to `pending`; this skill never silently bypasses that hand-back gate.
- Never allocate a prefix or create an unplanned note file here. The old append-only allocator closed
  the dead counter but still created content outside the plan's denominator; that is the systemic
  half of REC-053 and is now forbidden.

Interview-prep has no per-file plan. Existing topic banks may still receive inline Q&A under the
interview standard. Allocate the next stable bilingual question ID; every new question is unrefined.
Only Victor's explicit confirmation may append `[refined]` in both languages. Once present, the whole
bilingual block is immutable. A TODO on that block or an explicit reopen first removes `[refined]` and
`[studied]` from both languages, then permits the edit; the changed version must be refined and studied
again. The 13:30 closing ritual, not this writer, owns `[studied]` after a final active-recall PASS.

## What this skill does NOT do

It does not run the audit pipeline and does not restructure the whole topic. Committing is governed
by `notes/prompts/_internal/_session-rules.md` → `No git side effects on code`, not by this skill — in
a daily session the active agent MAY commit `notes/` files directly (atomic, no Co-Authored-By,
double `git status` check), so after writing, follow that rule as usual.
For a full topic build or audit, that is `/notes-audit` or `/interview-prep-audit` in a separate
session — this skill is only for getting inline, in-session writing right.
