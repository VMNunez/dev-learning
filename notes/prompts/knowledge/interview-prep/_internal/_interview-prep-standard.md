# Interview-prep standard — what a good interview-prep file contains

This is the **shared standard** for interview-prep Q&A files. It is not a runnable prompt — it holds
no configuration and does nothing on its own. Four prompts read it:

- `_interview-prep-write-prompt.md` (author) reads it to **build/audit one topic's** Q&A to this bar.
- `_interview-prep-review-prompt.md` (reviewer) reads it to **audit the authored Q&A** against this bar.
- `interview-prep-audit.md` (orchestrator) reads it to enforce fingerprints, parity and section gates.
- `interview-prep-route-prompt.md` reads it to resolve stable question identities and build the
  selected level's CORE study route without duplicating answers.

They used to carry their own copy of these rules; keeping them here once means the four can never
drift. Each prompt adds only its own *flow* (author vs cold review vs route selection) on top of this
standard.

---

## What an interview-prep file is

`notes/interview-prep/{LEVEL}/en/{topic}.md` (and its `es/` twin) is a **Q&A bank for one topic at
one professional level**, built to prepare Victor for the target role and progression defined in
`ROADMAP.md` and `notes/prompts/_internal/_shared-context.md`. Read both before judging any question:
every question and answer is measured against what a real interviewer would expect from a candidate
at the selected level.

It is **bounded by `coverage/{LEVEL}.md`**, but it is not a question-by-bullet mirror. Coverage says
what Victor is learning at the selected level; current market evidence decides which of those concepts
are worth testing in an interview. One realistic question may exercise several related coverage
concepts, and a pedagogical coverage bullet may legitimately produce no direct interview question.
Every question must be level-appropriate and either map to current coverage or be reported as a
coverage gap before it is admitted. Questions from different levels never share a file.

Every Q&A file stores the exact lowercase SHA-256 digest of its source coverage file's **scope bytes**,
computed only with "Evidence markers" in
`notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`. That canonical contract alone defines
the byte normalisation and marker stripping; do not reproduce or approximate it here:

```text
Coverage SHA-256: <64 lowercase hexadecimal characters>
```

For Angular, which also owns Angular Material interview questions, store both fingerprints:

```text
Coverage SHA-256 (Angular): <digest>
Coverage SHA-256 (Angular Material): <digest>
```

A missing or mismatched fingerprint means the Q&A is stale and requires a full
`interview-prep-audit`; it is not permission to mix in another level.

> The three things that make this file worth studying — enforced throughout — are: the questions are
> **realistic** (actually asked, not invented), **well-worded** (phrased as an interviewer phrases
> them), and the answers are **spoken in Victor's voice** (what he would say in the room, first person,
> anchored to a real project). A file that fails any of the three is not done, however "complete" it looks.

**Where "realistic" comes from — the same two sources coverage uses.** A question is realistic because it
is grounded, not guessed. Per `_coverage-standard.md` ("Two sources"), the backbone is a **deep analysis
of the real questions** a candidate at the selected level is actually asked at the target companies — web-backed
when possible — and `notes/prompts/_internal/_job-market-evidence.md` **corroborates** it with the recurring
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

## Question identity and lifecycle

Every question has one stable bilingual identifier inside the bold text:

**[SB-J-004] What is `@Transactional` and what does it do?** ⭐⭐⭐ [refined] [studied]

The identifier is immutable and identical in `en/` and `es/`. Format:
`{TOPIC}-{LEVEL}-{NNN}`, with level `J`, `M`, or `S` and these topic prefixes:
`ANG`, `SPR`, `SB`, `JAVA`, `ARC`, `SEC`, `TS`, `SQL`, `JS`, `CSS`, `GIT`, `GEN`.
Allocate the next unused number within that topic and level; never recycle an ID after deletion.

Question state has exactly three valid forms:

- **Unrefined** — no state marker. The author/reviewer may rewrite any part of the bilingual block.
- **Refined** — `[refined]`. Victor alone confirms this transition after the question, answer,
  priority, code and translation are to his taste. From then on the complete bilingual question content
  is frozen byte-for-byte; the only permitted line mutation is the later lifecycle append described
  below.
- **Refined + studied** — `[refined] [studied]`. The content remains frozen; the marker proves Victor
  completed a successful active-recall cycle on this exact version.

`[studied]` without `[refined]` is malformed. Appending ` [studied]` to both bold question lines after
a final active-recall PASS is the sole mutation allowed while refined; every other byte remains fixed.
A content pipeline may mirror an existing state marker between languages, but may never assign
`[refined]`, assign `[studied]`, or change refined content. If it finds
a factual, structural, priority or translation problem in a refined question, it reports the exact
problem and leaves the block untouched.

Only Victor can reopen a refined question, either by explicitly saying so or by adding a TODO to that
question. Reopening removes both state markers in both languages before any edit: the previously
studied version no longer exists, so its study evidence cannot survive. The corrected question must be
refined and studied again. Adding a new question is always allowed; it is born unrefined.

---

## Question types — definitions

Every question is one of three types. Use these definitions to classify, to decide on interview tips and
Red flags, and to count ratios.

- **Conceptual** — asks "what is X?" or "how does X work?" Tests understanding of a concept, not
  syntax. *e.g. "What is `@Transactional` and what does it do?"* Only Conceptual questions get an interview tip.
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

Every question carries a marker for how often it is asked at Spanish consultancies at the selected
professional level for this topic:

- **⭐⭐⭐** — asked in almost every interview for this topic; not answering it filters the candidate out
  immediately. Foundational, commonly misunderstood, or basic-competence signal.
- **⭐⭐** — asked often when the interviewer goes past the basics; survivable in a first screen, but a
  weak impression in a full technical round.
- **⭐** — a niche detail or edge case only the most thorough interviewers probe; missing it is not a
  dealbreaker at the selected level.

**Proportion check:** in a typical 8–12 question section, expect ~3–4 ⭐⭐⭐, ~4–5 ⭐⭐, ~1–2 ⭐. If more
than half a section is ⭐⭐⭐, downgrade the excess — keep ⭐⭐⭐ for the 3–4 most foundational, reassign
the rest to ⭐⭐.

Place the marker at the end of the bold question line, after the question mark:

**What is `@Transactional` and what does it do?** ⭐⭐⭐

Within each section, order questions ⭐⭐⭐ → ⭐⭐ → ⭐.

Stars express frequency **within the topic**; they do not define the cross-topic emergency route.
`interview-prep-route-prompt` selects a separate, globally weighted CORE subset from the ⭐⭐⭐
questions. This prevents every section's fundamentals from becoming one unmanageably large "must
study first" list.

---

## Question format

Every question follows this structure. Mandatory elements:

**[TOPIC-L-NNN] Question as an interviewer at a Spanish consultancy would ask it?** ⭐⭐⭐

Answer in 1–2 sentences — what Victor would actually say out loud. Include a real example from his
projects when the question is about a pattern or a decision.

- There must be a **blank line** between the bold question and the answer.
- Every question has a **priority marker** at the end of the bold line.
- Every question has one stable selected-level ID, identical in both languages.
- State markers, when present, follow the priority marker in the exact order `[refined] [studied]`.

Optional elements after the answer, by type:
- **Conceptual only** — a blank line, then a level-appropriate tip. Junior files preserve the existing
  `Junior tip` label; middle and senior use `Interview tip`. Spanish always uses
  `Consejo de entrevista:`:
  > **Junior tip:** short advice on how to explain it clearly in a junior interview
  > **Interview tip:** short advice calibrated to a middle or senior interview
  > **Consejo de entrevista:** the matching advice in Spanish
- **Decision-based and Pressure (encouraged)** — a blank line, then one line:
  Red flag answer: what a weak candidate would say and why it fails.
- **Any question the interviewer would pose with code** — a blank line, then a real code block (see
  "Real code — from real projects" below).

### Adding questions from outside the audit (practice prompts)

The practice prompts (`simulation-review`, `code-review-practice`) add a question or two to a
Q&A file whenever a gap surfaces during practice — not through the full audit pipeline. They follow
the **same** structure above (bold question + priority marker + blank line + answer in Victor's voice
+ the level-appropriate tip if Conceptual / Red flag if Decision-based or Pressure + a real cited code block where an
interviewer would pose it with code). On top of that structure, these four rules govern every
practice-driven insertion, so each prompt references them here instead of restating them:

- **Selected level only.** The caller must resolve the current professional level and add the question
  only to `notes/interview-prep/{LEVEL}/en/{topic}.md` and its Spanish twin. Never default silently
  to a shared or different-level file.
- **Both languages, always.** Add the question to the selected level's `en/{topic}.md` **and**
  `es/{topic}.md` at once, translated — never one without the other. Junior-tip label in `es/` is
  `Consejo de entrevista:`.
- **Deduplicate by concept, not wording.** Before adding, scan the target section for a question that
  already tests the same concept. If one exists, skip it — even if the phrasing differs.
- **Allocate a stable ID.** Use the next unused selected-level topic ID and mirror it to both languages.
- **Place under the matching `##` section**, creating the section only if none fits. Then reorder
  within that section so markers run ⭐⭐⭐ → ⭐⭐ → ⭐.
- **Priority marker** per the "Priority markers" section above (⭐⭐⭐ filter-level, ⭐⭐ deeper, ⭐ niche).

---

## The answer quality bar

An answer is interview-ready only when all of these hold:

- **Realistic question.** The question is one an interviewer at the target companies would actually ask
  a candidate at the selected level — not trivia, not a question owned by another level, and not a
  phrasing no human uses. If you would not hear it in a real screening at that level, it does not belong.
- **Well-worded.** Phrased the way an interviewer phrases it out loud — natural, specific, one clear
  ask. Not a textbook heading turned into a sentence.
- **Spoken in Victor's voice.** First person, what he would say in the room — "I used it in project 06
  to…", never "it is used to…". Concise (1–2 sentences); an interviewer wants a crisp answer, not a
  lecture.
- **Anchored to a real project** whenever the question is about a pattern or a decision — named
  project, the problem it solved, and what would break without it. **The anchor must be true**: the
  named project really uses the pattern (verify in the source before claiming it). An invented anchor
  is worse than none — it is a false anecdote about Victor's own code that one follow-up question
  exposes.
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
- Every often/sometimes market question appropriate to the selected coverage scope is covered.
- Every question is traceable to selected-level coverage, or its missing concept is reported as a
  coverage gap rather than silently admitted.
- The type ratio is roughly on target (or, for <5 questions, at least 1 Decision-based question present).
- Every question is realistic, well-worded, and answered in Victor's voice per the quality bar above.
- Every question an interviewer would pose with code carries a real, cited snippet (see "Real code").
- At least one Decision-based question references a real project by name.
- Every question has a priority marker; within the section they run ⭐⭐⭐ → ⭐⭐ → ⭐.
- Every question has a stable ID with exact bilingual parity.
- Every answer passes the "explain every word" test, or carries a TODO flagging it for rewrite.
- `en/` and `es/` are in sync — same sections, same questions, same order.

Do not chase exhaustiveness for its own sake. Stop when the realistic market questions for this level
are covered with no duplicates; pedagogical completeness belongs to notes, not to the Q&A bank.
