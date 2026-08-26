---
name: study-block-close
description: >
  Close the daily 13:30 notes/interview-prep block whenever Victor ends it ("cierro el bloque de
  estudio", "hasta aquí las notas", "terminé estas preguntas", "done with interview prep"). Record
  only what the session proves he actively studied: date the completed/refined notes-plan entries,
  clear the `Pending study` sections that session actually discharged, mirror `[studied]` onto exact
  refined interview questions that earned a final PASS, and recount CORE plus full-bank progress in
  PROGRESS.md.
  Authored is not studied, so never infer marks from files merely existing. Ask nothing and block on
  nothing: an ineligible target is reported and left unchanged.
---

# Close the notes + interview-prep study block

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


This is the 13:30 block's closing ritual. It records learning state, not content quality and not
authoring progress. The source contract is the shared session rules, "Study state and the 13:30
closing ritual".

## 1 — Resolve evidence without questions

Use only what Victor explicitly studied, answered, practised, or explained in this session. Refining
or authoring prose is not study evidence: a note edited during the block needs a separate active study
pass before it can be dated. Never mark
a whole file because one paragraph or one question was opened. If the session names no completed
study unit, write nothing and report that no studied evidence was recorded.

## 2 — Mark notes studied

For each note actually studied:

1. Locate its exact entry in `notes/{topic}/coverage/notes-plan-{LEVEL}.md`.
2. Require `Status: complete` or `Status: refined`, both declared language files to exist, and no
   unchecked `Coverage concepts` or unconsumed `Pending additions`. An open **`Pending study`** is not a
   blocker and never joins that list: it is the opposite case — the prose exists and is studiable, which
   is the whole reason the field was written.
3. Clear the `Pending study` entries this session actually covered. A section listed there landed after
   the date in `Studied`, so studying it is what discharges it: delete that exact line — matching the
   English heading it quotes — and write `none` once the list empties. Studying the whole note again
   clears every entry. Never delete an entry Victor did not study, and never add one here.
4. Set that entry's `Studied:` field to today's ISO date, inserting it after `Status:` when the
   legacy field is absent. Re-studying replaces the prior date. **Move the date only when step 3 left
   `Pending study: none`** — either because it was already `none` or because this session emptied it.
   With lines still open, leave the old date exactly as it is: the field is defined as the sections that
   landed *after* that date, so advancing it past sections still listed would describe them as older
   than a pass that never covered them, and the next reader could not tell which half of the note the
   date speaks for. A partial discharge is recorded by the lines that disappeared, not by the date.
5. A pending, stale, broken, or incomplete pair is reported and left unchanged. This ritual never
   authors prose, checks coverage concepts, or changes `Status`.

## 3 — Mark interview questions studied

For every exact question whose final verdict in this block was `PASS`:

1. Resolve the selected level's English/Spanish topic pair.
2. Resolve it by stable ID and require both files, current coverage fingerprints in both according to
   `_interview-prep-standard.md` (Angular requires both Angular and Angular Material), and exact
   bilingual parity for the complete question block.
3. Require `[refined]` in both languages. A `BORDERLINE`, `FAIL`, merely read answer, or unrefined
   question is not study completion. Dictated and typed answers are equivalent evidence.
4. Append ` [studied]` after `[refined]` on the bold question line in both languages. Preserve every
   other byte of the frozen blocks. An already studied question is a no-op.
5. A missing/stale fingerprint, missing counterpart, duplicate ID, malformed lifecycle, or ambiguous
   PASS is reported and left unchanged. Never mark neighbouring questions by association.

## 4 — Recount `PROGRESS.md` Study progress

Recount from primary sources after the marks:

- **Notes studied, per level:** numerator = plan entries with `Studied: YYYY-MM-DD`; denominator =
  all numbered entries across the registered topics' `notes-plan-{LEVEL}.md` files. An entry holding an
  open `Pending study` still counts in the numerator — it is a studied note owing one section, not an
  unstudied note, and that is the distinction the field exists to preserve. Surface those entries in
  the report instead, never as a fractional count here. Print `—` when
  any required plan is missing, `Plan status` is not `current`, or its coverage fingerprint is
  stale; never print a plausible percentage over an incomplete route.
- **Interview CORE studied, per level:** denominator = unique IDs in the current
  `notes/interview-prep/routes/{LEVEL}.md`; numerator = those IDs carrying `[refined] [studied]` in the
  exact bilingual bank pair. Print `—` when the route is missing/stale, its inventory fingerprint
  differs, an ID does not resolve exactly once, or any required bank fails fingerprint/parity.
- **Interview bank studied, per level:** denominator = all unique English master question IDs across
  every required current bank; numerator = IDs carrying `[refined] [studied]` in both languages. Print
  `—` until every required topic bank exists, has current coverage fingerprints, valid IDs/lifecycle
  and exact bilingual parity. Angular Material shares Angular's bank; every other registered topic owns
  its own topic file.
- Cell format when valid: `X/Y (P%)`, whole-number percentage. A level with no admitted route is
  `—`.

Rewrite only the three rows in `## Study progress`. SQL and simulations stay under
`## Practice completed`; coverage evidence stays under `## Coverage demonstrated`.

## 5 — Commit atomically

These are system-written tracking changes, so commit them directly on the active branch. Run
`git status --short` immediately before staging and immediately before committing. Stage only the
changed plan files, exact Q&A pairs and `PROGRESS.md`; never stage study prose changes from another
unit.

Commit message:

`docs(study): record {level} notes and interview study progress`

## 6 — Report

Report notes marked, `Pending study` entries cleared, question IDs marked, ineligible targets, the three
per-level counts, and the commit. List every entry still holding an open `Pending study` across the levels
you touched, with the sections it owes — a studied note carrying an unstudied section is invisible in the
counts by design, so this line and the append run that wrote the gap are the only places it surfaces.
The ritual asks zero questions and leaves every unresolved target open.
