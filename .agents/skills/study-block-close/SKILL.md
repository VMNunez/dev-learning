---
name: study-block-close
description: >
  Close the daily 13:30 notes/interview-prep block whenever Victor ends it ("cierro el bloque de
  estudio", "hasta aquí las notas", "terminé estas preguntas", "done with interview prep"). Record
  only what the session proves he actively studied: date the completed/refined notes-plan entries,
  clear the `Pending study` sections that session actually discharged, mirror `[studied]` onto exact
  refined interview questions that earned a final PASS — in the levelled banks and, since 2026-09-06, in
  the project banks too — and recount CORE, full-bank and per-project progress in PROGRESS.md.
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

**Two banks reach this step and the procedure is one procedure.** `interview-prep-block-open` serves the
levelled CORE route by default and `notes/interview-prep/routes/projects.md` on request, and one block can
have served both. Run steps 1–5 per question, whichever bank it came from; the project bank's own contract
for what a frozen block is and where a marker sits on its bold line is `_portfolio-standard.md` →
"Question identity, the refined freeze and the TODO channel", which is the file this ritual reads for that
bank instead of `_interview-prep-standard.md`.

For every exact question whose final verdict in this block was `PASS`:

1. Resolve its bilingual pair: the selected level's English/Spanish topic pair, or — for a project
   question — `notes/interview-prep/projects/en|es/«project».md`.
2. Resolve it by stable ID and require both files and exact bilingual parity for the complete question
   block. **The freshness gate is the one thing that differs by bank.** A levelled pair requires current
   coverage fingerprints in both according to `_interview-prep-standard.md` (Angular requires both Angular
   and Angular Material). A **project** pair has no coverage fingerprint by design, so its gate is the
   substitute `interview-prep-block-open` already applied when it served the question:
   `routes/projects.md` reading `Route status: current`, with its `Question inventory SHA-256` matching
   the current banks under `interview-prep-route-projects-prompt.md`'s algorithm. Demanding a fingerprint
   of a bank that will never have one would make this branch unreachable for every project bank there
   will ever be.
3. Require `[refined]` in both languages. A `BORDERLINE`, `FAIL`, merely read answer, or unrefined
   question is not study completion. Dictated and typed answers are equivalent evidence. For a project
   question, require its ID to resolve on `routes/projects.md` as well: this ritual records what the
   block served, and that route is what the block serves.
4. Append ` [studied]` after `[refined]` on the bold question line in both languages. Preserve every
   other byte of the frozen blocks. An already studied question is a no-op.
5. A missing/stale fingerprint, missing counterpart, duplicate ID, malformed lifecycle, or ambiguous
   PASS is reported and left unchanged. Never mark neighbouring questions by association. For a project
   question the equivalent blockers are a stale or missing route, a failed inventory digest, and an ID the
   route does not carry.

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

**Then recount the per-project table, one row per project.** The three rows above are levelled
populations and a project bank is in none of them; Victor ruled 2026-09-06 that it gets a row of its own
rather than a widened cell, so the level columns keep meaning what they say.

- **The project list is the one `interview-prep-route-projects-prompt.md` → "Eligibility" resolves** —
  **applied, never restated**, since a second copy of that ladder is a fork that stays invisible until
  the two disagree — and never a glob of `notes/interview-prep/projects/en/`. It is the same list
  `authoring-progress-recount` uses for its twin table, so the two sections name the same projects.
- **Numerator:** that project's route IDs carrying `[refined] [studied]` in both languages.
  **Denominator:** that project's questions **on the route**, not in its bank. The block may not serve an
  off-route question, so a whole-bank denominator is one no amount of studying could ever close.
- A `[studied]` question the route no longer carries — downgraded out of `⭐⭐⭐`, or deduplicated against
  another project's question — is in neither half of the fraction and is named in the report. Its marker stays: it records a pass that
  happened, and the block it sits on is frozen against every hand that could clean it.
- **These cells are born `0/N`, never `—`.** Once the route and both twins exist the denominator is real,
  and the honest reading of a bank nobody has studied yet is zero over it. `—` is only for a project whose
  denominator cannot be computed at all — no route, a stale one, a failed digest or a failed pair parity —
  and it is reported with the gate that blanked it. **A real denominator of zero is `0/0 (—%)` and not
  `—`**: an eligible project whose every `⭐⭐⭐` was deduplicated into another project's has a route
  presence of nothing, which is a measured fact and not a missing gate. Name it either way.

Rewrite only the three levelled rows and that table in `## Study progress`. SQL and simulations stay under
`## Practice completed`; coverage evidence stays under `## Coverage demonstrated`.

## 5 — Commit atomically

These are system-written tracking changes, so commit them directly on the active branch. Run
`git status --short` immediately before staging and immediately before committing. Stage only the
changed plan files, exact Q&A pairs — levelled or project — and `PROGRESS.md`; never stage study prose
changes from another unit.

Commit message, by what the close actually touched. **A project bank has no level to name**, so the
levelled subject is not merely inaccurate over one, it is unwritable:

- levelled work only — `docs(study): record {level} notes and interview study progress`
- project bank only — `docs(study): record project interview study progress`
- both — `docs(study): record {level} and project study progress`

## 6 — Report

Report notes marked, `Pending study` entries cleared, question IDs marked — naming the bank each came
from — ineligible targets, the three per-level counts, every project row, and the commit. List every entry
still holding an open `Pending study` across the levels
you touched, with the sections it owes — a studied note carrying an unstudied section is invisible in the
counts by design, so this line and the append run that wrote the gap are the only places it surfaces.
List the same way every `[studied]` project question the route no longer carries: it is invisible in its
row by design, and this line is the only place it surfaces.
The ritual asks zero questions and leaves every unresolved target open.
