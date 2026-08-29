---
name: interview-prep-block-open
description: >
  Open and conduct the active-recall interview-prep block whenever Victor starts interview questions
  ("vamos con interview prep", "hazme preguntas de entrevista", "abro el bloque de preguntas") or
  continues an already open question. Resolve the selected-level CORE route, ask one refined question
  at a time without revealing its answer, accept either voice-dictation transcripts or typed answers,
  and grade PASS / BORDERLINE / FAIL. Read-only: study-block-close owns every `[studied]` write.
---

# Open the interview-prep active-recall block

Read `_session-rules.md` and apply its shared durable-friction close-out on a failed declared step.
End every run by printing `desvíos: ninguno` or `desvíos: SBRC-NNNN`; a run that finished but
deviated from this text also applies that file's "When a skill's own text is what went wrong — the
skill breach log" close-out.
Write nothing.

## 1 — Resolve the route

Resolve `LEVEL` from Victor's message, otherwise from `PROGRESS.md`'s active professional level. Read:

1. `notes/interview-prep/routes/{LEVEL}.md`;
2. `_interview-prep-standard.md` lifecycle and answer-quality sections;
3. the bilingual bank pair for the next route candidates;
4. `PROGRESS.md` `## Study progress` for orientation.

Require `Route status: current`, a question-inventory fingerprint matching the current English bank
question lines under the route prompt's algorithm, unique resolvable IDs, current bank coverage
fingerprints, and exact EN/ES ID/state parity. If any gate fails, name it and hand off to
`/interview-prep-route LEVEL={LEVEL} MODE=update`; never improvise a question outside the route.

## 2 — Select the next question

Walk CORE order and choose the first question that is:

- `[refined]` in both languages;
- not `[studied]` in either language;
- not already attempted in this open block.

Skip unrefined route entries but count them as refinement debt. If no eligible CORE question remains,
report whether CORE is fully studied or blocked entirely on refinement; do not fall through to ⭐⭐/⭐.

Show only the Spanish question text, its topic and ID. Do not show its stored answer, tip, code block,
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
