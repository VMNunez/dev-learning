---
name: authoring-progress-recount
description: >
  Recount the `## Authoring progress` rows of PROGRESS.md WHENEVER a note or an interview question
  reaches an authored state — called by `notes-audit` and `interview-prep-audit` as their closing
  recount, by `study-content-writer` when Victor declares a pair refined or confirms a question
  `[refined]`, and directly when he asks ("actualiza el progreso de las notas", "recuenta lo escrito",
  "recount authoring"). It counts authored notes from the plans' `Status:` fields and refined questions
  from the bilingual `[refined]` markers, then writes those three rows and nothing else. The failure
  mode this exists for is work that exists on disk and nowhere in the tracker: a note refined in the
  morning that PROGRESS.md still reports as unwritten until someone runs the whole `/progress-update`
  by hand. Authored is not studied, so it never reads or writes a `Studied:` date, a `[studied]` marker
  or the `## Study progress` rows — those are `study-block-close`'s. Ask nothing and block on nothing:
  a level it cannot count is printed as `—` or `*` and reported, never guessed.
---

# Recount authoring progress

**Shared failure close-out.** The write counts below describe successful and expected no-op or
ineligibility paths. If this invoked ritual cannot complete a declared step, follow
`notes/prompts/_internal/_session-rules.md` → "When a skill cannot finish — durable friction"; do not
restate or widen that trigger here.


This ritual records how much of the study route has been **written**, which is a different question
from how much of it Victor has studied. The source contract is the shared session rules,
"PROGRESS.md updates", and the section partition in `notes/prompts/_internal/_system-map.md` §8.

## 0 — Resolve the level and the registered topics

Take the level from the caller, or from the level Victor is working at when he asks directly. Read the
registry in `notes/prompts/knowledge/coverage/_internal/_topic-ownership.md` — the topics it lists are
the denominator's scope, in its order. Never count files found by globbing a directory: a topic that is
not registered does not exist for this count, and a registered topic whose plan is missing is a
reported gap, not a smaller denominator.

Recount every row of the level you were given, not only the row the caller's event touched. The rows
are cheap to recompute and a stale neighbour is indistinguishable from a correct one.

## 1 — Recount `Notes authored`

Numerator: entries whose `Status:` is `complete`, plus entries whose `Status:` is `refined` **unless**
they carry unconsumed `Pending additions`. A `refined` entry still owing an append is not finished prose
and does not count; `Pending additions: none` and a plan old enough to have no such field at all both
mean the entry owes nothing, and both count. This is the definition `notes-plan-prompt.md` already uses
for the `Notes J/M/S` cells of `notes/prompts/_internal/_run-tracker.md`, and the two must not diverge —
reading them apart is what let them drift before.

Denominator: every numbered entry across the registered topics' `notes/{topic}/coverage/notes-plan-{LEVEL}.md`
files. This is **not** the sum of the `Notes J/M/S` tracker cells and does not have to match it: a topic
whose plan exists on disk but which the plan pipeline never ran has a blank tracker cell and a real set
of entries, so it belongs in this denominator and is absent from that sum. Today CSS and Git are exactly
that case, and the two totals differ by their 24 entries. Report the gap; never reconcile it by dropping
a plan that exists.

**A stale plan does not blank this cell — it marks it.** If any required plan is not `Plan status: current`,
or its `Plan` cell in `notes/prompts/_internal/_run-tracker.md` carries a `⚠ stale` flag, append `*` to
the cell and keep the count. The reasoning is the asymmetry with study: a stale denominator makes a
*studied* percentage false, because the accepted route is going to grow under it, but an *authored*
numerator is a fact about files that already exist and a stale denominator can only grow, so the
fraction is an honest floor rather than a claim that will be contradicted. Print `—` only when the
level has no plan at all.

A registered topic whose plan is **missing** is the one case neither mark covers, because the denominator
is then incomplete rather than merely provisional: count the plans that exist, carry the `*`, and name the
missing topics in the report. That is a smaller denominator than the level really owes, so it is stated
out loud rather than printed silently — and it is not `—`, which would throw away a count that is
correct for every plan that exists.

## 2 — Recount the two interview rows

- **Interview CORE refined:** denominator = unique IDs in the current `notes/interview-prep/routes/{LEVEL}.md`;
  numerator = those IDs carrying `[refined]` in the exact bilingual bank pair, whether or not they also
  carry `[studied]`. Print `—` when the route is missing/stale, its inventory fingerprint differs, an ID
  does not resolve exactly once, or any required bank fails fingerprint/parity.
- **Interview bank refined:** denominator = all unique English master question IDs across every required
  current bank; numerator = IDs carrying `[refined]` in both languages. Print `—` until every required
  topic bank exists, has current coverage fingerprints, valid IDs/lifecycle and exact bilingual parity.
  Angular Material shares Angular's bank; every other registered topic owns its own topic file. Like the
  other read-only counters of the bank, this ritual reads those states off the files themselves and does
  not open the interview standard.

These two rows keep the strict `—` gate rather than step 1's `*`, because a question bank has no
denominator at all until its stable IDs exist: there is nothing to mark provisional. Both rows read `—`
until the first `interview-prep-audit` migration lands, and that is the correct reading, not a defect.

## 3 — Write the rows

Cell format when valid: `X/Y (P%)`, whole-number percentage. Where step 1 requires the `*`, it goes
immediately after the denominator and before the percentage — `1/208* (0%)` — so the mark sits on the
number it qualifies. An honest zero over a real denominator is `0/N (0%)`, never `—`.

Rewrite only the three rows in `## Authoring progress`. Study dates and `[studied]` markers stay under
`## Study progress`, coverage evidence under `## Coverage demonstrated`, and no cell of
`## Professional level by topic` is touched here — that table is `/progress-update`'s.

## 4 — Commit

These are system-written tracking changes, so commit them directly on the active branch. Run
`git status --short` immediately before staging and immediately before committing. Stage `PROGRESS.md`
only; the plan entries, notes and Q&A pairs that caused the transition belong to the caller's commit.

When a caller is already committing `PROGRESS.md` as part of the same logical change, say so in the
report and let its commit carry the rows instead of committing here.

Commit message:

`docs(progress): recount {level} authoring progress`

## 5 — Report

Report the three per-level counts before and after, every cell that carries a `*` and the plans that
earned it, every row printed `—` and the gate that blanked it, and the commit. One line per row is
enough. The ritual asks zero questions and leaves every unresolved target open.
