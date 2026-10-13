# Interview-prep standard — what a good interview-prep file contains

This is the **shared standard** for interview-prep Q&A files. It is not a runnable prompt — it holds
no configuration and does nothing on its own. Its readers fall into five groups, and the list is
open — every **writer** of a Q&A file reads this file and is listed here rather than treated as an
exception. Read-only judges are not required to: `/simulator` grades Victor *against* the bank and
`/progress-update` counts it, neither reads this standard, and neither appears below.

**The audit pipeline**, which owns the whole bank and reads every section as a mandate:

- `_interview-prep-write-prompt.md` (author) reads it to **build/audit one topic's** Q&A to this bar.
- `_interview-prep-review-prompt.md` (reviewer) reads it to **audit the authored Q&A** against this bar.
- `interview-prep-audit.md` (orchestrator) reads it to enforce fingerprints, parity and section gates,
  and to rebuild each bank's study index and anchors.

**`interview-prep-route-prompt.md`**, which writes no Q&A file at all — it reads the ID, priority and
lifecycle sections to resolve stable question identities and build the selected level's CORE study
route without duplicating answers, and the fingerprint and bilingual-parity contracts for its entry
guards.

**The practice prompts**, which append one or a few questions per run and audit nothing:

- `practice/simulations/simulation-review-prompt.md` and `practice/interview/code-review-prompt.md`
  enter through "Adding questions from outside the audit" below — the one section addressed to them,
  and the one they follow **in full**, together with every section it invokes: the question format,
  the question types, "Priority markers", "Question identity and lifecycle", "Real code — from real
  projects", the bilingual contract, the fingerprint contract in "What an interview-prep file is", and
  the "answer in Victor's voice" bar. The fingerprint *contract* is here; the *check step* is not —
  each consumer prompt runs its own and refuses to write into a stale bank. What they are *not* bound
  by is the audit's job: they never **rewrite** a
  question they did not just write, however far from this bar it sits. Judging one is not rewriting
  it — they still deduplicate against existing questions and still report a defect they notice, which
  is the only thing they may do about one.

**`_portfolio-translate-prompt.md`**, and since 2026-09-05 **`_portfolio-review-es-prompt.md`** beside
it, the two readers from outside this family and the narrowest — both scoped to **"The bilingual en/es
contract" alone**. The first renders a *project* question bank
(`notes/interview-prep/projects/en|es/*.md`) into Spanish and the second audits that Spanish
`en/`-blind, and that bank is **not governed by this
standard**: it has no level and no coverage fingerprint. It **does** carry stable
IDs and the `[refined]` freeze since 2026-08-31, the `[studied]` state since 2026-09-06, and a `TODO:`
reopen channel of its own — but they are
`_portfolio-standard.md`'s own rules, written there deliberately rather than borrowed from here, because
one standard reaching across two disjoint chains is what `REC-180` ruled against. Its ID is
`{PROJECT_NAME}-{NNN}`, not the `{TOPIC}-{LEVEL}-{NNN}` below. Since 2026-09-05 it also has an
`es`-review owner this family still has no equivalent of — that second reader, an `en/`-blind pass over
the twin — which is why that bank's Spanish is checked on its own terms while this one's is checked by a
reviewer holding both languages. It also has priority markers since 2026-09-05, on the same three-star
scale as this file's but calibrated **over the whole bank file** rather than per section, which is why
that rule too is written there and not borrowed from here. Nothing here binds either of them except the
bilingual section, and both are listed under the open-list rule above rather than left as the unnamed
exceptions they would otherwise be. The rest of that bank's contract is `_portfolio-standard.md`'s.

**The in-session skills**, each scoped by its own `SKILL.md`: `study-content-writer` (unrefined,
reopened or refining content), `interview-prep-block-open` (the lifecycle and answer-quality sections,
read-only) and `study-block-close`, whose only write **in a Q&A file** is `[studied]`, though it reads
the fingerprint and bilingual-parity contracts to decide whether it may make it. Since 2026-09-06 that
skill writes the same marker into the **project** banks as well, under `_portfolio-standard.md` and not
under this file: the two banks are governed separately and this one's fingerprint gate is not the gate
that gets applied there.

These rules used to live in each reader's own copy; keeping them here once means the readers can never
drift. Each adds only its own *flow* (author vs cold review vs route selection vs practice insertion)
on top of this standard.

---

## What an interview-prep file is

`notes/interview-prep/{LEVEL}/en/{topic}.md` (and its `es/` twin) is a **Q&A bank for one topic at
one professional level**, built to prepare Victor for the target role and companies defined in
`notes/prompts/_internal/_shared-context.md` and the level progression planned in `ROADMAP.md` — that
split of the two files is `_shared-context.md`'s own fence. Read both before judging any question:
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

- **`en/` is the master of record** for identity and structure — the question's ID, its section, its
  position, and the wording that survives a sync when the two files disagree and nothing says why. It
  does **not** decide which side a defect is *repaired* on: that is the direction rule below, the one
  operation this bullet does not govern.
- **`es/` is where Victor studies and marks TODOs** — he reads from `es/`, so that is where his `TODO:`
  markers appear. Scan `es/` first for them.
- **Resolving a TODO runs in the direction of the file that carries it** (Victor, 2026-08-29, stated
  symmetrically — the same rule `_note-quality-standard.md` has carried for the notes family since
  2026-08-20). A `TODO:` he writes in `es/` is resolved **in `es/`**, in Spanish, applying his
  instruction as written, and the `en/` twin is then **re-translated from the repaired Spanish**. A
  TODO in `en/` is resolved in `en/`, then translated into `es/`. Never route an `es/` TODO through
  English first: his TODOs are corrections to the Spanish phrasing itself — the file he answers out
  loud from — so rewriting the answer in English and translating it down discards the exact wording he
  asked for, which is the whole payload of the marker. A section repaired on the `es/` side is
  therefore **not** a drift the master-of-record bullet settles in `en/`'s favour; it is a twin that
  owes a re-translation, and overwriting it is the one failure this rule exists to prevent.
- **Every change is mirrored, translated.** Add a question, resolve a TODO, fix a marker order — it
  happens in both files, same section, same position. Never touch one without the other. *Mirrored*
  says both files end up saying the same thing; the direction rule says which side says it first.
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
Allocate the next unused number within that topic and level, read off the bold question lines alone
(the study index and the anchors repeat every ID); never recycle an ID after deletion.

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
A content pipeline is any prompt or skill that writes a Q&A file. One may never assign `[refined]` and
never change refined content; `[studied]` is assigned by `study-block-close` alone, under the append
rule above. **Mirroring** an existing marker onto its twin is not assigning it, and one reader may do
it — `_interview-prep-review-prompt.md`, whose job is parity; every other pipeline reports the
one-sided marker and leaves it, `study-block-close` included, even though `/progress-update` reports
mirror drift to it. The single exception is `interview-prep-audit`'s one-time legacy migration, which
converts `[x]` to `[refined] [studied]` under its own rule: it is exempt from the two assignment
prohibitions and from nothing else — the blocks it touches were never refined, so it never needs to
change refined content and is not licensed to. If it finds
a factual, structural, priority or translation problem in a refined question, it reports the exact
problem and leaves the block untouched.

Only Victor can reopen a refined question, either by explicitly saying so or by adding a TODO to that
question. Reopening removes both state markers in both languages before any edit: the previously
studied version no longer exists, so its study evidence cannot survive — and neither can the study mark on
its `es/` index entry ("Study index and question anchors" below). The corrected question must be
refined and studied again. The repair itself obeys the direction rule above, and the twin's
re-translation is **part of the same reopening**: the markers are already gone from both languages, so
a writer never leaves the twin stale on the grounds that the block was frozen. Adding a new question is
always allowed; it is born unrefined.

**The one-time legacy migration runs on `interview-prep-audit`'s `MODE = full` or its `MODE = index`**,
whichever reaches the bank first (`REC-340`). `index` performs the migration, the `es/` order and
priority-marker parity its own steps name, and the study index — nothing else — so a bank can carry
IDs, anchors and an index long before its first full audit; the full run that follows keeps every ID it
finds.

---

## Study index and question anchors

**Every ID-migrated bank opens with a study index, and it is derived: nothing in it is authored but one
short label per question — and, in the `es/` index alone, the study mark Victor writes at the end of an
entry.** Ruled by Victor 2026-10-13 (`REC-340`), on the index the project banks gained the same day —
`07-timetrack`'s is the model. It sits after every other header line and directly above the first bank
section, and it is **header**: a bank's header runs from its H1 to the line above its first bank
section's `##` heading, the `Coverage SHA-256` lines included. `## Study index` — `## Índice de estudio`
in the `es/` file — is **not a bank section**: it holds no question, it is never a `SECTION` value, it
is left out of every work list,
section count, ratio and priority-order check, and no role's trace has a row for it. A bank in which
any bold question line still lacks an ID carries no index and no anchor: its entries would have nothing
to link to.

The `en/` index, with its fixed strings — nothing in it varies but the three counts, the section groups
and the entries:

```markdown
<a id="study-index"></a>

## Study index

Start with the first pass. Within each pass, follow the topics from top to bottom and work through a small group of questions at a time. If a question needs a concept from another pass, consult that question and then return to where you were.

| Pass | Priority | Questions |
|---|---|---:|
| [1. Essentials](#study-pass-1) | ⭐⭐⭐ | N |
| [2. Deeper understanding](#study-pass-2) | ⭐⭐ | N |
| [3. Details](#study-pass-3) | ⭐ | N |

Read the question, try to answer without looking, check your answer against the written one and explain it again in your own words. In the next block, recall an earlier question without consulting its answer.

Links lead to the original questions. The numbers are their identifiers, not the study order. This index supports independent study. Record your progress in the Spanish index: ✅ and the date at the end of the line of each question you have worked on, then · PASS and the date when you pass it in a recall exam.

<a id="study-pass-1"></a>

### First pass — Essentials — ⭐⭐⭐

**Angular basics**

- [001 — What Angular is](#ANG-J-001)

<a id="study-pass-2"></a>

### Second pass — Deeper understanding — ⭐⭐

<a id="study-pass-3"></a>

### Third pass — Details — ⭐

---
```

The `es/` index is the same structure with these strings, the three anchor lines and every link target
left verbatim: `## Índice de estudio` · `Empieza por la primera vuelta. Dentro de cada vuelta, sigue los
temas de arriba abajo y trabaja un grupo pequeño de preguntas cada vez. Si una pregunta requiere un
concepto de otra vuelta, consulta esa pregunta y vuelve al punto donde estabas.` · the table header
`| Vuelta | Prioridad | Preguntas |` with rows `1. Imprescindibles` / `2. Profundización` /
`3. Detalles` · `Lee la pregunta, intenta responder sin mirar, contrasta tu respuesta con la escrita y
vuelve a explicarla con tus palabras. En el siguiente bloque, recupera alguna pregunta anterior sin
consultar la respuesta.` · `Los enlaces llevan a las preguntas originales. Los números son sus
identificadores, no el orden de estudio. Este índice sirve para estudiar por tu cuenta. Registra aquí tu
progreso: ✅ y la fecha al final de la línea de cada pregunta que hayas trabajado, y después · PASS y la
fecha cuando la superes en un examen de repaso.` · `### Primera vuelta — Imprescindibles — ⭐⭐⭐` ·
`### Segunda vuelta — Profundización — ⭐⭐` · `### Tercera vuelta — Detalles — ⭐`. The bold group names
are each language's own `##` section headings, without the `##`.

**What it lists, and in what order — one rule, read off the file it sits in.** Every question whose bold
line carries a priority marker has exactly one entry, in the index **of the file that holds that bold
line**: under the pass of its marker; inside a pass, under the bold name of its `##` bank section, the
sections in the file's own order and a section with no question in that pass left out; inside a section,
by **ascending ID** — not by the order the questions stand in, which the ⭐⭐⭐ → ⭐⭐ → ⭐ rule moves. The
three passes are always present, a pass with no question reading `0` in the table with nothing under its
heading, and each `Questions` cell is the number of entries under that pass. A question with no priority
marker has no entry until it gains one.

**An entry is `- [NNN — label](#{ID})`**, `NNN` the ID's counter alone and `{ID}` the whole
`{TOPIC}-{LEVEL}-{NNN}` — followed, in the `es/` index, by the study mark below wherever Victor has
written one: for every run, **whatever follows the link's closing `)` on that line**, kept byte-for-byte,
and never part of the label. **The label is a short name for the concept the question asks about — a
handful of words, two to nine** — read off the question's own bold line in that language, never the
answer. **It is written once, when its ID enters the index, and kept byte-for-byte by every later run, in
both languages**: the ID stays with the concept however the question is reworded, so the label does too,
and a label Victor edits by hand survives every rebuild. It leaves the index only when its question
leaves the bank or loses its marker.

**The index carries no question-state marker and gates nothing.** No `[refined]` and no `[studied]` is
ever written into it, and no route, skill, counter, fingerprint or verdict reads it. It is **as current
as the last `interview-prep-audit` run on that topic**: a question a practice prompt or
`study-content-writer` adds, or a marker Victor changes by hand, moves nothing in it until that run
rebuilds it — except that a reopening clears that question's study mark at once.

**The study mark is Victor's: no run writes or changes it, and none drops it while its question stays in
the bank.** An `es/` entry line may end with ` ✅ YYYY-MM-DD` — he worked the question on his own — and
then, once he has passed it in a recall exam, ` · PASS YYYY-MM-DD`, the date of the last such pass, which
the next one overwrites. He writes it, or an agent does on his say-so; it lives in the `es/` index alone,
the side he studies, and the `en/` index carries none. **It is bound to its ID, not to its line**: a
rebuild that moves the entry to another pass or section carries the mark to the end of the same ID's
entry byte-for-byte, the way it keeps the label. It leaves on two events only. **A reopening** of a
`[refined]` question clears it in the same edit that removes the state markers, since the frozen answer
he worked is the one being replaced; a `TODO:` on an unrefined question leaves it, as every rewrite of
an unrefined answer does. **The question leaving the bank** takes its entry and the mark with it, and
the run that removed it reports the ID with the mark verbatim. A `PASS` here is not `[studied]` and never
becomes one: `[studied]` stays `study-block-close`'s, from the routed recall block.

**How the marks are used is a conversation, not a component**, and the rulings are the ones Victor gave
for the project banks the same day, stated once in `_portfolio-standard.md` → "Study index and question
anchors", its paragraph "How the marks are used" — read that paragraph alone; the rest of that standard
does not govern this bank. It is a pointer to six lines of his rulings, kept in one place so they cannot
fork, and not the cross-chain reach `REC-180` ruled against. Exam 2's *"in his own words from his code"*
reads here as in his own words
from what he knows. No skill serves, counts or gates on the marks.

**Every question has an anchor: one `<a id="{ID}"></a>` line above its bold line, one blank line between
them**, which is what its entry links to. The anchor is **not part of the question block**: a block ends
at an anchor line, so setting one above a `[refined]` question changes no frozen byte. **A writer that
moves a block moves its anchor with it** — the author's and a practice insertion's ⭐⭐⭐ → ⭐⭐ → ⭐
reorder included — and an anchor line left anywhere but directly above the bold line of the ID it names
is deleted by the next rebuild.

**An ID is counted on its bold question line and nowhere else.** An anchor line and an index entry each
repeat it, so every count and every identity read of this bank — allocating the next unused number, the
parity counts, a duplicate test, the route's inventory and its resolution of an ID, the recounts of both
progress sections — is taken over bold question lines.

**Who writes them.** `interview-prep-audit`'s orchestrator, at the end of every topic it finishes —
committed, or left in the tree on `DRY_RUN = true` — on every `MODE`: it rebuilds the index whole in
both languages and re-sets every anchor in both, whatever
the run's `SECTION`, since all of it is read off the bold lines by command except the label of an ID
entering the index, which the orchestrator writes in each language. It clears the study mark of every ID
the run's author or reviewer reports reopened, and reports every ID that left the bank with its mark.
**No author, reviewer, practice prompt or skill writes an anchor, an entry, a label or a study mark** —
with one write excepted, clearing a reopened question's mark where no orchestrator follows:
`study-content-writer` in session, and the author or reviewer on a standalone run.

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
interviewer would pose it with code). On top of that structure, the rules below govern every
practice-driven insertion, so each prompt references them here instead of restating them.

**A practice prompt is a content pipeline** under "Question identity and lifecycle" above, and takes
its three prohibitions: it may never assign `[refined]`, assign `[studied]`, or change refined content.
It does **not** take the parity-mirror permission alongside them: that permission is scoped to the
reader whose declared job is repairing parity, and an appender's is not. A defect it notices in an
existing refined question — including a state marker present in one language and missing in the
other — is therefore reported in its own output and left untouched, exactly as the author and
reviewer report one.

**Do not run a practice prompt against a topic whose `/interview-prep-audit` is still open.** No
automatic path puts two writers on one pair — there is no scheduler, no queue and nothing running in
the background. The only path is Victor's own hands, and it is an inviting one: an audit is designed
to be left alone (`FILE = all` is twelve topics of unattended work), and both practice prompts are
run in a separate conversation, so opening one while an audit grinds is the natural thing to do. It
is also the one thing that corrupts what this section exists to protect: both writers allocate "the
next unused ID" from independent reads of the same file, and the bank ends with **duplicate IDs** —
which the route prompt's guard then refuses and `study-block-close` reports as ineligible.

**No gate is built for it, because none would work — and the instruments ruled out here are the
*inserting* prompt's, read at the moment it inserts.** The coverage fingerprint cannot see it: the
digest is over the *coverage* file, so an audit that rewrote every question in the bank leaves it
matching. The working tree cannot either — the audit's longest stages are read-only, so the target
pair is clean through them, and clean while a `FILE = all` run is still working through the other
topics. The audit's own `git status --porcelain` is a **different reading and not this gate**: it
fires per topic **before that topic's first author dispatch**, so it can see an insertion left
uncommitted before that moment — but only as *dirty*, indistinguishable from any other uncommitted
change, which is why `interview-prep-audit.md` scopes it to baseline availability and refuses to read
it as a detector of who else wrote to the pair. What that reading reaches is the sequential hazard
below, which already has its own rule. **Not running a practice prompt against an open audit** is a
rule for Victor, not a check for a prompt, and it is written here because here is where a future
reader will come looking for it.

**The reachable hazard is sequential, and it is the one to guard.** The audit's pre-commit `git
status` check whitelists exactly the `en/` + `es/` pair an insertion touches, so an insertion still
sitting uncommitted when an audit later starts on that topic is swept **into** the audit's topic
commit — attributed to a run that did not write it, in a commit whose message does not mention it. So
**an insertion is committed by the run that made it**, or, where the prompt hands its commands to
Victor instead, that run states plainly that the pair must be committed before any audit is run on
that topic. That is the whole of the contract here; there is nothing for an insertion to detect.

**Position is structural, not content**, so the freeze does not pin a refined question to a line
number — the audit already fixes ordering directly as a structural repair, and reordering a section is
not authoring. A practice insertion may therefore reorder its target section like any other writer;
what it may not do is change a single byte *inside* a refined block while doing so.

- **Selected level only.** The caller must resolve the current professional level and add the question
  only to `notes/interview-prep/{LEVEL}/en/{topic}.md` and its Spanish twin. Never default silently
  to a shared or different-level file.
- **Both languages, always.** Add the question to the selected level's `en/{topic}.md` **and**
  `es/{topic}.md` at once, translated — never one without the other. Junior-tip label in `es/` is
  `Consejo de entrevista:`.
- **Deduplicate by concept, not wording.** Before adding, scan the target section for a question that
  already tests the same concept. If one exists, skip it — even if the phrasing differs.
- **Allocate a stable ID.** Use the next unused selected-level topic ID and mirror it to both languages.
  The new question is **born unrefined** and carries no state marker in either language.
- **Place under the matching `##` section**, creating the section only if none fits. Then reorder
  within that section so markers run ⭐⭐⭐ → ⭐⭐ → ⭐, refined blocks included, and apply the identical
  order to `es/` — position is one of the things the two languages keep in sync.
- **Report the route as stale.** Both adding a question and reordering a section stale
  `notes/interview-prep/routes/{LEVEL}.md`, whose question inventory is a digest over the bank's
  English question lines, state markers stripped, *in file order* — which is why appending `[studied]`
  stales nothing and moving a block stales it. The insertion never repairs the route: it prints
  `route stale — run /interview-prep-route LEVEL={LEVEL} MODE=update` as a line of its own report.
  `interview-prep-block-open` gates the next study block on that same fingerprint and emits the same
  handoff, so this line does not prevent a failure — it moves the handoff to the run that caused it,
  where the level is already resolved.
- **Priority marker** per the "Priority markers" section above (⭐⭐⭐ filter-level, ⭐⭐ deeper, ⭐ niche).
- **No anchor and no index entry.** The new question has neither until the next `interview-prep-audit`
  run on that topic rebuilds them; the insertion never writes into `## Study index`, which is header and
  never a section to place a question under, and when it reorders a section each anchor line moves with
  the bold line below it ("Study index and question anchors").

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
- **Where the honest answer is "not yet", the answer teaches the concept with an example.** An
  experience question — *"have you written X?"*, *"have you used X?"* — is never answered by claiming a
  practice no project demonstrates, and a promise about a future project is not an answer on its own.
  Say what he has actually done, then show the concept working on a concrete case, and name when the
  missing half lands where it is planned. The anchor rule above forbids the false claim; this one says
  what takes its place, which is the half an answer left to itself gets wrong — it pads, or it
  substitutes the plan for the knowledge. Stated by Victor 2026-09-08, after the Angular junior testing
  section had him answer "I test services with Jasmine and TestBed": a tool he had never run, and a
  practice none of his projects demonstrated.
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
