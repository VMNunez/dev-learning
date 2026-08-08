---
name: study-block-close
description: >
  Close the daily 13:30 notes/interview-prep block whenever Victor ends it ("cierro el bloque de
  estudio", "hasta aquí las notas", "terminé estas preguntas", "done with interview prep"). Record
  only what the session proves he actively studied: date the completed/refined notes-plan entries,
  mirror [x] onto the exact interview questions worked, and recount PROGRESS.md Study progress.
  Authored is not studied, so never infer marks from files merely existing. Ask nothing and block on
  nothing: an ineligible target is reported and left unchanged.
---

# Close the notes + interview-prep study block

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
   unchecked `Coverage concepts` or unconsumed `Pending additions`.
3. Set that entry's `Studied:` field to today's ISO date, inserting it after `Status:` when the
   legacy field is absent. Re-studying replaces the prior date.
4. A pending, stale, broken, or incomplete pair is reported and left unchanged. This ritual never
   authors prose, checks coverage concepts, or changes `Status`.

## 3 — Mark interview questions studied

For every exact question Victor worked:

1. Resolve the selected level's English/Spanish topic pair.
2. Require both files, current coverage fingerprints in both according to
   `_interview-prep-standard.md` (Angular requires both Angular and Angular Material), and structural
   parity for the exact question.
3. Append ` [x]` to the bold question line in both languages. Preserve priority stars and answer
   prose byte-for-byte. An already marked question is a no-op.
4. A missing/stale fingerprint, missing counterpart, or ambiguous question identity is reported and
   left unchanged. Never mark neighbouring questions by association.

## 4 — Recount `PROGRESS.md` Study progress

Recount from primary sources after the marks:

- **Notes studied, per level:** numerator = plan entries with `Studied: YYYY-MM-DD`; denominator =
  all numbered entries across the registered topics' `notes-plan-{LEVEL}.md` files. Print `—` when
  any required plan is missing, `Plan status` is not `current`, or its coverage fingerprint is
  stale; never print a plausible percentage over an incomplete route.
- **Interview questions studied, per level:** denominator = all unique English master question
  identities; numerator = identities whose English line or structurally paired Spanish line carries
  `[x]`. Mirror a one-sided legacy marker before writing the count. A countable question is exactly the
  standard's format: bold text ending in `?**`, one priority marker, optional `[x]` — never any other
  bold line. Print `—` until every required topic
  bank exists, both languages have current fingerprints and parity passes. Angular Material shares
  Angular's bank; every other registered topic owns its own topic file.
- Cell format when valid: `X/Y (P%)`, whole-number percentage. A level with no admitted route is
  `—`.

Rewrite only the two rows in `## Study progress`. SQL and simulations stay under
`## Practice completed`; coverage evidence stays under `## Coverage demonstrated`.

## 5 — Commit atomically

These are system-written tracking changes, so commit them directly on the active branch. Run
`git status --short` immediately before staging and immediately before committing. Stage only the
changed plan files, exact Q&A pairs and `PROGRESS.md`; never stage study prose changes from another
unit.

Commit message:

`docs(study): record {level} notes and interview study progress`

## 6 — Report

Report notes marked, questions marked, ineligible targets, the two per-level counts, and the commit.
The ritual asks zero questions and leaves every unresolved target open.
