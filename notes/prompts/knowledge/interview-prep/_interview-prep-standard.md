# Interview-prep standard — what a good interview-prep file contains

This is the **shared standard** for interview-prep Q&A files. It is not a runnable prompt — it holds
no configuration and does nothing on its own. Three prompts read it:

- `interview-prep-write-prompt.md` (author) reads it to **build/audit one topic's** Q&A to this bar.
- `interview-prep-review-prompt.md` (reviewer) reads it to **audit the authored Q&A** against this bar.
- `notes-and-interview-prep-prompt.md` reads it to reuse the **question format** when it adds
  cross-reference questions.

They used to carry their own copy of these rules; keeping them here once means the three can never
drift. Each prompt adds only its own *flow* (author vs cold review vs cross-reference) on top of this
standard.

---

## What an interview-prep file is

`notes/interview-prep/en/{topic}.md` (and its `es/` twin) is a **Q&A bank for one topic**, built to
prepare Victor for a junior Angular + Java Spring Boot screening at a Spanish IT consultancy (NTT Data,
Capgemini, Indra, and similar) — the target in `ROADMAP.md` and `notes/prompts/_shared-context.md`.
Read both before judging any question: every question and answer is measured against what a real
interviewer at those companies would filter a junior on.

It is **derived from `coverage.md`**: every item in the topic's coverage must have at least one
question. Coverage says *what* to test; this file turns each item into a question the way an
interviewer would actually ask it, and an answer the way Victor would actually say it out loud.

> The three things that make this file worth studying — enforced throughout — are: the questions are
> **realistic** (actually asked, not invented), **well-worded** (phrased as an interviewer phrases
> them), and the answers are **spoken in Victor's voice** (what he would say in the room, first person,
> anchored to a real project). A file that fails any of the three is not done, however "complete" it looks.

**Where "realistic" comes from — the same two sources coverage uses.** A question is realistic because it
is grounded, not guessed. Per `_coverage-standard.md` ("Two sources"), the backbone is a **deep analysis
of the real questions** a junior for this stack is actually asked at the target companies — web-backed
when possible — and `notes/prompts/_job-market-evidence.md` **corroborates** it with the recurring
requirements and the exact wording the market prints. The analysis is primary and defines the floor; the
evidence sharpens it and overrides it only where a real posting concretely conflicts. Together they keep
the Q&A anchored to real interviews instead of invented trivia — the `interview-prep-audit` pipeline runs
exactly this split as its Stage M (market analysis) feeding the author.

---

## The bilingual en/es contract

Notes and Q&A both live in two languages, and the two files are **never allowed to drift**.

- **`en/` is the master of record** for wording. If the same question exists in different forms in both
  files, the `en/` version wins and `es/` is updated to match (translated).
- **`es/` is where Victor studies and marks TODOs** — he reads from `es/`, so that is where his `TODO:`
  markers appear. Scan `es/` first for them.
- **Every change is mirrored, translated.** Add a question, resolve a TODO, fix a marker order — it
  happens in both files, same section, same position. Never touch one without the other.
- Spanish prose reads as **natural Spanish**, not a word-for-word calque of the English. Same question,
  same answer, same emphasis — different words where Spanish needs them. Translate the Junior-tip label
  to `Consejo de entrevista:`; keep the technical vocabulary that Victor will hear in English on the job.

---

## Existing content is final unless marked with TODO

Do not rewrite, rephrase, or "improve" a question or answer that already exists. Victor may have
studied it and likes it as written.

**Allowed without a TODO:**
- Resolve TODO markers.
- Add new questions (always allowed).
- Assign priority markers (⭐⭐⭐/⭐⭐/⭐) to existing questions.
- Reorder existing questions by priority within a section (never across sections).
- Fix structural format violations (missing blank line between question and answer).
- Add a Junior tip to an existing Conceptual question missing one; add a Red flag to an existing
  Decision-based or Pressure question missing one.

**NOT allowed without a TODO:**
- Change the wording of existing questions.
- Rewrite or rephrase existing answers.
- "Strengthen" existing content on your own judgment.

If an existing answer is weak but has no TODO, **report it** — do not change it. Victor adds a TODO, and
the fix lands on the next run. (Exception: if Victor explicitly asks you to fix the reported weak
answers in the same conversation, you may rewrite them — mirrored to both files.)

---

## Question types — definitions

Every question is one of three types. Use these definitions to classify, to decide on Junior tips and
Red flags, and to count ratios.

- **Conceptual** — asks "what is X?" or "how does X work?" Tests understanding of a concept, not
  syntax. *e.g. "What is `@Transactional` and what does it do?"* Only Conceptual questions get a Junior tip.
- **Decision-based** — asks "why did you choose X?" or "when would you use X instead of Y?" Tests
  whether the candidate can justify a decision and knows the tradeoff. *e.g. "Why JWT instead of
  sessions?"* Encouraged to have a Red flag.
- **Pressure** — a gotcha, an edge case, or a buggy snippet. Exposes shallow knowledge. *e.g. "What
  happens if you put `@Transactional` on a private method?"* Encouraged to have a Red flag.

**Edge cases:**
- "What is the difference between X and Y?" where the answer implies choosing one → **Decision-based**,
  not Conceptual.
- "What happens when X?" → **Pressure** if X is an unusual/surprising condition; **Conceptual** if X is
  the normal expected behaviour of the technology.

**Target ratio per section:** ~55% Conceptual / ~35% Decision-based / ~10% Pressure. For a section with
fewer than 5 questions the exact ratio is not achievable — treat it as a direction. The practical
floor: **every section has at least 1 Decision-based question.** A section with zero is always flagged,
regardless of size.

---

## Priority markers

Every question carries a marker for how often it is asked at Spanish consultancies in a junior
interview for this topic:

- **⭐⭐⭐** — asked in almost every interview for this topic; not answering it filters the candidate out
  immediately. Foundational, commonly misunderstood, or basic-competence signal.
- **⭐⭐** — asked often when the interviewer goes past the basics; survivable in a first screen, but a
  weak impression in a full technical round.
- **⭐** — a niche detail or edge case only the most thorough interviewers probe; missing it is not a
  dealbreaker at junior level.

**Proportion check:** in a typical 8–12 question section, expect ~3–4 ⭐⭐⭐, ~4–5 ⭐⭐, ~1–2 ⭐. If more
than half a section is ⭐⭐⭐, downgrade the excess — keep ⭐⭐⭐ for the 3–4 most foundational, reassign
the rest to ⭐⭐.

Place the marker at the end of the bold question line, after the question mark:

**What is `@Transactional` and what does it do?** ⭐⭐⭐

Within each section, order questions ⭐⭐⭐ → ⭐⭐ → ⭐.

---

## Question format

Every question follows this structure. Mandatory elements:

**Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

Answer in 1–2 sentences — what Victor would actually say out loud. Include a real example from his
projects when the question is about a pattern or a decision.

- There must be a **blank line** between the bold question and the answer.
- Every question has a **priority marker** at the end of the bold line.

Optional elements after the answer, by type:
- **Conceptual only** — a blank line, then a Junior tip as two consecutive blockquote lines, English
  then Spanish:
  > **Junior tip:** short advice on how to explain it clearly in an interview
  > **Consejo de entrevista:** the same advice in Spanish
- **Decision-based and Pressure (encouraged)** — a blank line, then one line:
  Red flag answer: what a weak candidate would say and why it fails.
- **Any question the interviewer would pose with code** — a blank line, then a real code block (see
  "Real code — from real projects" below).

---

## The answer quality bar

An answer is interview-ready only when all of these hold:

- **Realistic question.** The question is one an interviewer at the target companies would actually ask
  a junior — not a trivia question, not a mid/senior-level question, not a phrasing no human uses. If
  you would not hear it in a real screening for this stack, it does not belong.
- **Well-worded.** Phrased the way an interviewer phrases it out loud — natural, specific, one clear
  ask. Not a textbook heading turned into a sentence.
- **Spoken in Victor's voice.** First person, what he would say in the room — "I used it in project 06
  to…", never "it is used to…". Concise (1–2 sentences); an interviewer wants a crisp answer, not a
  lecture.
- **Anchored to a real project** whenever the question is about a pattern or a decision — named
  project, the problem it solved, and what would break without it.
- **Every word defensible.** Apply the test: *"could Victor explain every word of this answer if the
  interviewer pressed on it?"* If not, the answer is padded or memorised — it is weak.

**Weak → Strong (same question):**
- **Weak:** "¿Qué es un interceptor en Angular? — Es una clase que intercepta las peticiones HTTP y
  permite modificarlas."
- **Strong:** "¿Qué es un interceptor en Angular? — Es una función que se ejecuta antes de cada
  petición HTTP. La usé en el proyecto 06 para añadir el token JWT automáticamente a todas las
  cabeceras — sin él, tendría que añadirlo a mano en cada llamada al servicio."

The strong answer references a real project, states the problem it solves, and says "I used it" — not
"it is used". Fix every answer that reads like a definition instead of something Victor would say.

---

## Real code — from real projects

Some questions are answered far better with a short code block than with prose — and interviewers
routinely **show** a snippet ("what does this print?", "why is this `@Transactional` ignored?") or
**ask you to write one** ("write a JOIN that…", "how do you add the JWT to every request?"). For those
questions, a real snippet is what makes the answer land.

**When a question warrants code** (heuristic — not every question does):
- **Pressure questions built on a snippet** — the code *is* the question; it must appear.
- **"How do you write / configure X?"** where the honest answer is code — a JOIN, a reactive form, an
  HTTP interceptor, a JWT filter, a `@Transactional` service method.
- **Confusable-pair questions** where a 3-line contrast makes the difference click (`ngIf` vs `@if`,
  `WHERE` vs `HAVING`).

Most Conceptual and Decision-based questions stay prose — do not bolt code onto a question that a
person would answer by talking.

**Rules for the code block:**
- **It comes from Victor's real project code**, and the block is cited to the file it came from — e.g.
  a first-line comment `// projects/07-timetrack · TimeEntryService.java`. Never present invented code
  as if it were his. If no project actually contains it (e.g. a pure-language gotcha), use a **minimal
  generic snippet clearly marked** `// illustrative — not from a project`, or skip the code entirely.
- **Smallest fragment that makes the point** — 3–10 lines, not a whole class. Trim imports and
  unrelated fields.
- **Same code in both `en/` and `es/`.** Code is identical; only comments may be translated.
- The snippet supports the spoken answer — it does not replace it. The 1–2 sentence answer still says
  what Victor would say; the code is what he would point at or write on the whiteboard.

## When a section is complete

A section is done only when ALL hold:
- Every `coverage.md` concept that belongs in the section has at least one question.
- Every question a Spanish consultancy would realistically ask about the topic is covered.
- The type ratio is roughly on target (or, for <5 questions, at least 1 Decision-based question present).
- Every question is realistic, well-worded, and answered in Victor's voice per the quality bar above.
- Every question an interviewer would pose with code carries a real, cited snippet (see "Real code").
- At least one Decision-based question references a real project by name.
- Every question has a priority marker; within the section they run ⭐⭐⭐ → ⭐⭐ → ⭐.
- Every answer passes the "explain every word" test, or carries a TODO flagging it for rewrite.
- `en/` and `es/` are in sync — same sections, same questions, same order.

Do not stop at 2–3 questions per section. A weak junior gets filtered because one topic was thin —
better to over-prepare a section than to leave a gap a recruiter finds first.
