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

**Shared deviation close-out.** Every invocation ends by printing `desvíos: ninguno` or
`desvíos: SBRC-NNNN` as its report's last line, on clean runs too. If this ritual finished its work and
the text above is what made it improvise, ask a question this contract forbids, re-derive state the
trigger declared resolved, or write outside its declared writer set, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill's own text is what went wrong — the skill
breach log"; do not restate or widen that trigger here.


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

The gold-standard reference for texture is the first section of `notes/java/junior/es/11-excepciones.md`:
open with the pain not the definition; one worked example carried through; ASCII diagrams for
anything structural; real-world analogies; abundant `> blockquote` callouts (~one per non-obvious
sub-concept); a sentence explaining how to read every table; exact error messages; MAL/BIEN examples.

## Step 3 — Honour the bilingual en/es contract

- **`en/` is the canonical source; `es/` is its first-class translation.** Author and correct the
  content in `en/` first, then translate into `es/`. Once a plan entry completes, both hold a matching
  file per **number prefix**, with the same structure and code blocks.
- New file in `en/` → create the full `es/` translation under a **Spanish** filename carrying the same
  number prefix (`en/04-methods.md` → `es/04-metodos.md`) — never a copy of the English name. The
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
- A `refined` pair is frozen against *your* initiative, not against Victor's. **You are the only writer
  in the system that may resolve a TODO on one** (2026-08-22 — the doctrine is "The `refined` freeze" in
  `notes/prompts/knowledge/notes/notes-plan-prompt.md`; `/notes-audit` deliberately declines this and
  reports the markers instead). Two routes, and the difference between them is who asked:
  - **A TODO Victor wrote in the pair, or a correction he states directly in chat** → resolve it, under
    Step 3's direction rule: an `es/` marker is resolved in `es/`, in Spanish, in his words, and `en/`
    is then brought into line. Leave `Status: refined` exactly as it is, and leave `Studied` exactly as
    it is: a date stays that date, a `pending` stays pending. That preservation is the whole point — a
    two-word fix must not cost an active-recall pass.

    **The bound is the marked passage — the paragraph, list, table, callout or code block the marker
    sits in.** A heading may be reworded when the TODO asks for that; the section under it may not be
    rewritten. A TODO that names a whole section (`TODO: esta sección no se entiende`) is a request this
    route cannot serve: report it and hand it back, because rewriting a section wholesale is the thing
    the freeze exists to prevent, and it would carry a study date across prose Victor never studied. The
    test is not how many words moved — it is whether what came out is *his correction applied to a
    passage* or *your rewrite of a section*.

    **You never append a section on this route.** New sections reach a frozen note through one door
    only: a coverage bullet under `Pending additions`, an `/notes-audit` append-only run, and its diff
    proof. A TODO asking for content that has no home in an existing passage is reported and routed
    there — writing it here would create content outside the plan's denominator, which is the REC-053
    defect the last bullet of this step already forbids.

    **Report what you touched**: quote the instruction you acted on (the TODO text, or Victor's words
    when he stated it in chat), name the exact heading and passage you changed in each language, and
    state that nothing else in either file moved. This route has no cold reviewer and no diff gate, so
    that report is its only evidence — write it even when the fix was one word.
  - **Anything else** — a change you propose, a quality miss you noticed, or a TODO whose fix means
    rewriting a section or restructuring the note → report it and wait for Victor to set the status
    back to `pending`. The hand-back gate survives for everything the TODO route does not cover,
    and this skill never silently bypasses it.
- **Victor declaring a pair refined is its own operation, and it runs before the freeze**
  (2026-08-22). When he says he has refined a note and names the language — "esta nota está refinada en
  español", "the English one is refined" — that file is finished and **you change nothing in it**: not a
  word, not a line break, not a heading, not the order of a list. Read it whole, then bring the
  *counterpart* into line until the translation is faithful — same content, same message, same structure
  and code blocks, native prose in its own language — respecting intentional trims instead of
  "resyncing" them back in. Then: report every counterpart change and confirm the declared file is
  untouched (`git diff --stat` proves it), hand Victor the commit for **both** files, and set that
  entry's `Status: refined` in `notes-plan-{LEVEL}.md`. This is the one place a writer assigns that
  status, and the authority is his declaration, not your judgement of the prose. If `Studied` carries a
  date, set it to `pending` — his refinement changed the accepted text after that pass. If a current
  concept is still `[ ]` or `Pending additions` is not `none`, do the sync, report the blocker, and
  leave `Status` where it is. When the status was actually written, **invoke the
  `authoring-progress-recount` skill** with that topic's level. It owns the `## Authoring progress`
  rows of `PROGRESS.md` end to end and commits that file itself; you never edit those rows, which is
  why this skill's own trigger still excludes `PROGRESS.md`. Do not reproduce its counting here. One
  thing to pass it explicitly, because it is this route's context and not the skill's: that the entry
  became `refined` in this session, so a no-op recount is a finding rather than the expected result.
  Fold its report row into your own report. A blocked sync leaves `Status` untouched and therefore
  invokes nothing.
- Never allocate a prefix or create an unplanned note file here. The old append-only allocator closed
  the dead counter but still created content outside the plan's denominator; that is the systemic
  half of REC-053 and is now forbidden.

Interview-prep has no per-file plan. Existing topic banks may still receive inline Q&A under the
interview standard. Allocate the next stable bilingual question ID; every new question is unrefined.
Only Victor's explicit confirmation may append `[refined]` in both languages. Once present, the whole
bilingual block is immutable. A TODO on that block or an explicit reopen first removes `[refined]` and
`[studied]` from both languages, then permits the edit; the changed version must be refined and studied
again. The 13:30 closing ritual, not this writer, owns `[studied]` after a final active-recall PASS.
Once you have appended `[refined]` to a question in both languages, **invoke the
`authoring-progress-recount` skill** with that bank's level. It owns the two interview rows end to end,
it commits `PROGRESS.md`, and you neither count nor edit them here. Do not reproduce its counting. One
thing to pass it explicitly, because it is this route's context and not the skill's: the exact question
IDs that became `[refined]` in this session, so it can say whether its gate or your write is the reason
a cell did not move. Both rows read `—` until the first `interview-prep-audit` migration gives the banks
stable IDs, so expect a reported no-op rather than a moved cell. Fold its report row into your own
report.

## What this skill does NOT do

It does not write `PROGRESS.md`. Its two refining routes hand the `## Authoring progress` rows to
`authoring-progress-recount`, which owns and commits them — which is why this skill's trigger still
excludes that file even though refining a pair now moves it.
It does not run the audit pipeline and does not restructure the whole topic. Committing is governed
by `notes/prompts/_internal/_session-rules.md` → `No git side effects on code`, not by this skill — in
a daily session the active agent MAY commit `notes/` files directly (atomic, no Co-Authored-By,
double `git status` check), so after writing, follow that rule as usual.
For a full topic build or audit, that is `/notes-audit` or `/interview-prep-audit` in a separate
session — this skill is only for getting inline, in-session writing right.
