---
name: interview-prep-block-open
description: >
  Open and conduct the active-recall interview-prep block whenever Victor starts interview questions
  ("vamos con interview prep", "¿qué toca hoy?", "hazme preguntas de entrevista", "abro el bloque de
  preguntas") or continues an already open question. By default it follows the spaced-repetition
  schedule of the essential questions (`notes/interview-prep/spaced/`): it runs `spaced.py hoy`, tells
  him what to review first and what to learn next, serves one question at a time without revealing its
  answer, accepts either voice-dictation transcripts or typed answers, grades PASS / BORDERLINE / FAIL
  and records every result in `schedule.md` through `spaced.py registrar`. The CORE route and the
  cross-project route stay available on request. It never writes a Q&A bank: study-block-close owns
  every `[studied]` write.
---

# Open the interview-prep active-recall block

Read `_session-rules.md` and apply its shared durable-friction close-out on a failed declared step.
End every run by printing `desvíos: ninguno` or `desvíos: SBRC-NNNN`; a run that finished but
deviated from this text also applies that file's "When a skill's own text is what went wrong — the
skill breach log" close-out.
Its only write is `notes/interview-prep/spaced/schedule.md`, and only through
`notes/interview-prep/spaced/spaced.py` on the spaced route (§1–§4 below). It never edits a Q&A bank,
a route file or `PROGRESS.md`.

## 1 — Resolve the route

**Three routes exist and the spaced route is the default** (Victor, 2026-10-20). Take the CORE route
only when he asks for it by name ("la ruta CORE", "preguntas de nivel junior fuera del plan") and the
project route only when he asks for project questions outside the plan ("todas las preguntas del 07",
"project questions"). Which kind of recall he wants is his call and not this skill's.

**Spaced route (default).** The essential questions, each with the date Victor learned it, its review
history, its streak and its next review date, live in `notes/interview-prep/spaced/schedule.md`; its
`## Reglas` and `## Ajustes` sections are the contract and are not restated here. Before anything else:

1. If `git status --short` shows `schedule.md` modified by an earlier block that was never closed,
   commit it alone first, `docs(study): record spaced interview review progress`, with `git status`
   immediately before staging and before committing.
2. Run `python -I notes/interview-prep/spaced/spaced.py hoy` — it first appends any `⭐⭐⭐` question the
   source banks gained, then prints today's reviews (overdue first) and the new questions that still fit
   the block. Relay it to Victor in Spanish as a short instruction — *«Hoy: primero repasa X, Y; después
   estudia Z»* — with the estimated minutes, and name any question it reported as added or as gone from
   the banks.
3. Read the Spanish bank file of each listed question — `notes/interview-prep/junior/es/{topic}.md` or
   `notes/interview-prep/projects/es/«project».md`, resolving the ID on its bold question line alone —
   for its question text and stored answer.

The spaced route serves the questions the schedule lists **whether or not they are `[refined]`**: the
schedule is what decides what he studies, and refining stays a separate act of his. It needs no route
file and no fingerprint gate.

**CORE route (on request).** Resolve `LEVEL` from Victor's message, otherwise from `PROGRESS.md`'s active
professional level. Read:

1. `notes/interview-prep/routes/{LEVEL}.md`;
2. `_interview-prep-standard.md` lifecycle and answer-quality sections;
3. the bilingual bank pair for the next route candidates;
4. `PROGRESS.md` `## Study progress` for orientation.

Require `Route status: current`, a question-inventory fingerprint matching the current English bank
question lines under the route prompt's algorithm, unique resolvable IDs — read off bold question lines
alone, the study index and the anchors repeating each one (`REC-340`) — current bank coverage
fingerprints, and exact EN/ES ID/state parity. If any gate fails, name it and hand off to
`/interview-prep-route LEVEL={LEVEL} MODE=update`; never improvise a question outside the route.

**Project route (on request).** Read:

1. `notes/interview-prep/routes/projects.md`;
2. `_portfolio-standard.md` → "Question identity, the refined freeze and the TODO channel" and
   "Priority markers" — that file governs this bank, and the levelled Q&A standard does not;
3. the bilingual project pair for the next route candidates;
4. `PROGRESS.md` `## Study progress` for orientation.

Require `Route status: current`, a question-inventory fingerprint matching the current English banks
under `interview-prep-route-projects-prompt.md`'s algorithm, unique resolvable IDs, and exact EN/ES
ID/state parity. **Require no coverage fingerprint**: a project bank has none by design, so the pair
parity and the route fingerprint are the whole freshness test here. Name the failing gate and hand off
to the run that owns it — `/interview-prep-route-projects MODE=update` for a stale or missing route, but
`/portfolio-audit PROJECT_PATH=projects/«name»` when the defect is in the **bank** (a missing `es/` twin,
an ID-less or unmarked question), which no route run can repair.

**When a requested route resolves to nothing.** A missing or stale CORE or project route is a failed gate
like any other — say so, print its handoff, and offer the spaced route instead of ending the block.

## 2 — Select the next question

**Spaced route.** Follow the order `spaced.py hoy` printed: every review first, then the new questions.
Never add a question it did not list, and never skip one he did not ask to skip. Run `hoy` again
whenever he asks what is left; it accounts for what was already recorded that day.

**CORE and project routes.** Walk the resolved route in its own order and choose the first question
that is:

- `[refined]` in both languages;
- not `[studied]` in either language;
- not already attempted in this open block.

**All three clauses read the same on both routes since 2026-09-06.** The project bank carries the
`[studied]` marker too, written by `study-block-close` after a pass in this block, so a studied project
question is skipped exactly as a studied CORE one is.

Skip unrefined route entries but count them as refinement debt. If no eligible question remains on the
resolved route, report whether it is fully studied or blocked entirely on refinement; do not fall
through to ⭐⭐/⭐, and do not silently switch to the other route.

Show only the Spanish question text, its topic — or its project, on the project route — and its ID. Do not show its stored answer, tip, code block,
red flag or priority explanation before Victor answers. State once per block: `Puedes responder por
dictado o por escrito; se evalúan igual.`

## 3 — Grade the answer

Accept either a voice-dictation transcript or typed text. Never penalise transcription noise, spelling,
punctuation or speaking style. Judge the substance against the stored answer and real source when
needed:

- **Correctness** — technically correct;
- **Directness** — answers the actual question without hiding behind adjacent facts;
- **Mechanism/trade-off** — explains how/why when the question requires it;
- **Evidence** — uses a truthful project example when appropriate;
- **Defensibility** — Victor can explain the technical terms he chose.

**A new question on the spaced route is learned, not graded.** Ask it without the answer and let him
try; then show the stored Spanish answer, have him explain it back in his own words with one example,
and correct what he gets wrong. Then record it:
`python -I notes/interview-prep/spaced/spaced.py registrar «ID» aprendida`.

**A review on the spaced route is graded, once.** After his answer, ask **one follow-up question** on
the same concept (*repregunta*), and grade answer and follow-up together:

- `PASS` — correct, with a valid example (from the project when the question calls for one), and the
  follow-up held;
- `BORDERLINE` — the core idea is right but one material omission, vagueness or a weak follow-up;
- `FAIL` — conceptual error, non-answer, or memorised language that collapses under the follow-up.

Give concise evidence, explain what was missing, show the stored answer on a `BORDERLINE` or `FAIL`, and
record the verdict at once: `spaced.py registrar «ID» pass|borderline|fail`. Only the first attempt of
the day counts — a corrected second answer is good practice and is not recorded; the script refuses a
second record for the same day and question, and `--forzar` exists only to correct a mistyped verdict.
Relay the script's output line (streak, state, next review date) in Spanish.

**CORE and project routes** keep their in-block verdicts:

- `PASS` — correct, direct and defensible;
- `BORDERLINE` — core idea is right but one material omission/vagueness remains;
- `FAIL` — conceptual error, non-answer, or memorised language that collapses under one follow-up.

Then:

- `PASS` — record the ID as passed in conversation state and ask the next eligible question;
- `BORDERLINE` — explain the one missing clause and ask Victor to answer the same question again;
  only the corrected second answer can become PASS;
- `FAIL` — explain the misconception, show the frozen answer, keep the ID failed/uncompleted for this
  block, and move to the next question only when Victor asks.

Do not require verbatim recall. Do not change the stored answer when Victor phrases the same correct
idea differently. If the stored answer itself appears wrong or inadequate, report a reopen proposal —
on any route, the repair is a `TODO:` resolved by `study-content-writer`; never edit it here, and never
pass the question on a defective reference.

## 4 — Handoff

**Spaced route.** Every result is already in `schedule.md` the moment it is recorded. When Victor closes
the block, `study-block-close` commits that file; a block left open is committed by step 1 of the next
one. Hand `study-block-close` only the `PASS` IDs of questions that are `[refined]` in both languages —
the only ones it may mark `[studied]` — and say that the rest are recorded in the schedule alone.

**CORE and project routes.** Keep the per-ID verdicts in conversation state. When Victor closes the
block, `study-block-close` marks only IDs with a final PASS as `[studied]`, mirrors both languages, and
recounts `PROGRESS.md`. This skill never edits a Q&A bank, commits nothing but the leftover schedule of
§1 step 1, and marks no state.

**A project question's PASS is marked like any other since 2026-09-06.** `study-block-close` writes
`[studied]` into that bank as well and recounts its per-project row of `PROGRESS.md`
`## Study progress`, so a block that mixed both routes hands over both sets of IDs — say which bank each
came from, since the two are recorded under different contracts and in different rows.
