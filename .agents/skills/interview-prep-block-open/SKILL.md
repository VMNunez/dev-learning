---
name: interview-prep-block-open
description: >
  Open and conduct the active-recall interview-prep block whenever Victor starts interview questions
  ("vamos con interview prep", "hazme preguntas de entrevista", "abro el bloque de preguntas") or
  continues an already open question. Resolve the selected-level CORE route — or, when he asks for
  project questions, the cross-project route — ask one refined question at a time without revealing its
  answer, accept either voice-dictation transcripts or typed answers, and grade PASS / BORDERLINE /
  FAIL. Read-only: study-block-close owns every `[studied]` write.
---

# Open the interview-prep active-recall block

Read `_session-rules.md` and apply its shared durable-friction close-out on a failed declared step.
End every run by printing `desvíos: ninguno` or `desvíos: SBRC-NNNN`; a run that finished but
deviated from this text also applies that file's "When a skill's own text is what went wrong — the
skill breach log" close-out.
Write nothing.

## 1 — Resolve the route

**Two routes exist and the CORE one is the default.** Take the project route only when Victor asks for
it — "preguntas del 07", "las de mi proyecto", "project questions" — since which of his two kinds of
recall he wants is his call and not this skill's.

**CORE route (default).** Resolve `LEVEL` from Victor's message, otherwise from `PROGRESS.md`'s active
professional level. Read:

1. `notes/interview-prep/routes/{LEVEL}.md`;
2. `_interview-prep-standard.md` lifecycle and answer-quality sections;
3. the bilingual bank pair for the next route candidates;
4. `PROGRESS.md` `## Study progress` for orientation.

Require `Route status: current`, a question-inventory fingerprint matching the current English bank
question lines under the route prompt's algorithm, unique resolvable IDs, current bank coverage
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

**When the default resolves to nothing.** A missing or stale CORE route is a failed gate like any other
— but say so and then **offer the project route** when that one exists and is current, rather than
ending the block. A default that points at a file no run has written yet is not a reason to study
nothing; the handoff to `/interview-prep-route` still gets printed, and Victor decides.

## 2 — Select the next question

Walk the resolved route in its own order and choose the first question that is:

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
punctuation or speaking style. Judge the substance against the frozen answer and real source when
needed:

- **Correctness** — technically correct;
- **Directness** — answers the actual question without hiding behind adjacent facts;
- **Mechanism/trade-off** — explains how/why when the question requires it;
- **Evidence** — uses a truthful project example when appropriate;
- **Defensibility** — Victor can explain the technical terms he chose.

Return one verdict:

- `PASS` — correct, direct and defensible;
- `BORDERLINE` — core idea is right but one material omission/vagueness remains;
- `FAIL` — conceptual error, non-answer, or memorised language that collapses under one follow-up.

Give concise evidence, then:

- `PASS` — record the ID as passed in conversation state and ask the next eligible question;
- `BORDERLINE` — explain the one missing clause and ask Victor to answer the same question again;
  only the corrected second answer can become PASS;
- `FAIL` — explain the misconception, show the frozen answer, keep the ID failed/uncompleted for this
  block, and move to the next question only when Victor asks.

Do not require verbatim recall. Do not change the frozen answer when Victor phrases the same correct
idea differently. If the frozen answer itself appears wrong or inadequate, report a reopen proposal;
never edit it or pass the question on a defective reference.

## 4 — Handoff

Keep the per-ID verdicts in conversation state. When Victor closes the block, `study-block-close` marks
only IDs with a final PASS as `[studied]`, mirrors both languages, and recounts `PROGRESS.md`. This skill
never edits, commits, or marks state.

**A project question's PASS is marked like any other since 2026-09-06.** `study-block-close` writes
`[studied]` into that bank as well and recounts its per-project row of `PROGRESS.md`
`## Study progress`, so a block that mixed both routes hands over both sets of IDs — say which bank each
came from, since the two are recorded under different contracts and in different rows.
