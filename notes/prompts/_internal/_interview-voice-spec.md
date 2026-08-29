# The interview-answer voice pipeline — target spec

**This file is a target, not a description of what runs today.** Nothing written here is implemented
unless an open row of `_recommendation-ledger.md` says so, and every step below names the row that owns
it. It exists because the target spans four rows and lived only in one conversation: `REC-180`,
`REC-183`, `REC-184` and `REC-171` (g) each carry one slice of it, and a row is forbidden from
restating its neighbours, so the shape none of them can hold had nowhere to be written down.

**No run obeys this file.** It is not a standard and grants no authority: it is read at step 1 of
resolving any row that cites it, so the resolution can see the whole loop before editing its own
corner. Where it and a standard disagree, the standard wins and this file is the thing that is wrong.
Where it and either map disagree, the **map** describes what runs and this file describes what is
wanted — they are not competing claims about the same tense, and neither is authority over the other.

Source: Victor, 2026-08-29, across the session that opened `REC-183` and `REC-184`. He stated the
target; the measurements and the collisions are recorded in the rows, not here. The map placement, the
wiring table, the two-standard problem in step 9 and `## What no row owns yet` were added 2026-08-29 on
his instruction, from a read of `README.md`, `_system-map.md` §1/§2/§7 and the four machinery files the
loop would touch. `## The feedback signal Loop B does not have` and `## Staging — collect early, decide
late` were added the same day, on his instruction, from an assessment of the target as a
self-improving system rather than as a set of steps. Step 7's episode shape — multiple TODO rounds, the
frozen text as the only positive example, and rounds-to-freeze as the loop's own metric — is Victor's
correction of that same day, and the reason the step no longer says "initial and final".

---

## Where this sits in the two maps

Loop A is **Chain A's Q&A branch**, drawn in `_system-map.md` §2 as
`/interview-prep-audit → unrefined Q&A → /interview-prep-route → Victor refines →
interview-prep-block-open → study-block-close → PROGRESS`. Every step of Loop A below is one hop of
that branch, and steps 1–6 are already implemented **for the levelled bank alone**.

Two things about that placement are load-bearing and neither is visible from the diagram:

- **The project bank is not on that branch at all.** `_system-map.md` §7 gives
  `notes/interview-prep/projects/*.md` one writer, `/portfolio-audit`, and **one** reader, `/simulator`
  — it is a leaf of Chain B, not a node of Chain A. Measured 2026-08-29: the string `projects` does not
  appear in `interview-prep-route-prompt.md`, `interview-prep-block-open/SKILL.md`,
  `study-block-close/SKILL.md` or `authoring-progress-recount/SKILL.md`. So `REC-180` is not only
  "IDs, priority markers and an `es/` twin": it is **admitting the project bank into Chain A's study
  branch**, which four readers would have to be widened for. A file no route lists cannot be reached by
  the block that would study it, so step 6 below cannot fire for it at any cost.
- **Loop B is in no chain of the diagram.** It is a second loop of the kind §12 describes — machinery
  reopened from evidence — but with a sink of its own rather than a `_last-run-report*.md`, and its
  closest built relative is `REC-171`'s `_note-todo-harvest.md`, one folder away in Chain A.

---

## What the system is for

Victor answers project and topic questions **out loud, in Spanish, in an interview**. An answer that is
technically correct but does not sound like him is a defect, and it is the defect nothing in the
system currently measures. The pipeline below turns each of his corrections into two things: a fixed
answer, and evidence of how he actually expresses himself — so that later questions are written in his
voice before he ever reads them.

---

## Loop A — one question, from generation to studied

1. **Generation.** `/portfolio-audit` writes the project bank from that project's code; the levelled
   bank is written by `/interview-prep-audit` from a topic. Each question is born with a **stable ID**
   and a **priority marker** (`⭐⭐⭐`/`⭐⭐`/`⭐`), ordered `⭐⭐⭐ → ⭐⭐ → ⭐` within its section.
   *Project bank today has neither: `REC-180`.*
2. **Translation.** The English file gets its `es/` twin — natural Spanish, never a calque, same
   question in the same position. *The project bank has no twin and the Q&A family has no translate
   stage of its own; the notes family's translate + `es`-review is the only implementation: `REC-180`.*
3. **Study.** Victor reads, normally from `es/`, and writes a `TODO:` wherever the answer is not how he
   would say it. **A taste-and-phrasing TODO is a first-class TODO**, not a lesser kind of defect
   report: it is the whole point of the loop.
4. **Repair, on the side it was raised.** A TODO in `es/` is resolved in `es/` and `en/` is
   re-translated from the resolved Spanish; a TODO in `en/` is resolved in `en/` and `es/` is
   re-translated from it. Symmetric, one rule. The master-of-record clause keeps governing identity and
   stops governing repair direction. *`REC-183`.*
5. **Freeze.** Victor — and only Victor — writes `[refined]`. The question's content is frozen from
   that moment; a new TODO or his word are the only things that unfreeze it.
6. **Studied.** `[studied]` is written by `study-block-close` when he answers it correctly in an
   active-recall block. *For the project bank this is not one open decision but three, and `REC-180`
   owns all of them: whether `/interview-prep-route` lists project questions at all, since a question
   off the route is unreachable by `interview-prep-block-open`; whether `study-block-close` may write
   the marker into a file `_interview-prep-standard.md` does not govern; and whether `PROGRESS.md`'s
   `## Study progress` rows count them, through `authoring-progress-recount`. A marker nobody recounts
   is a state that lies, and a marker nothing can ever write is worse.*

## Loop B — the system learns his voice

7. **Collection — one episode per question, not one row per repair.** Evidence is deposited on every
   resolution of step 4, but the unit is the question's **whole journey to the freeze**: `v0` as
   generated, then each of his verbatim TODOs in order with the version it produced, and finally the
   text that carries `[refined]`. The writer is `study-content-writer`, whose trigger already names
   `notes/interview-prep/` while its routing branches only on `{LEVEL}/en|es/`.
   *`REC-184`. Note `REC-171`'s note sink deliberately refuses to store prose, under a countability
   argument that does not transfer; that is why this is a second sink and not a widening of the first.*

   **A question can take more than one round, and that is the normal case, not an edge one** (Victor,
   2026-08-29). He resolves a TODO, reads the result, and it is still not how he would say it. Three
   consequences, and the first is the reason this step was rewritten:

   - **Only the `[refined]` text is a positive example.** The output of round 1 in a three-round
     question is a version **he rejected**. A design that stores "initial and final" per repair feeds
     Loop B answers he refused as if they were answers he approved — not noise, but examples with the
     wrong sign. The valid target is the frozen text and nothing else, exactly as `[refined]` already
     means everywhere else in the system.
   - **The intermediate versions are evidence too, as negatives.** *The system tried this and he still
     said no* narrows a voice rule faster than a success does, so they are kept and **labelled
     rejected**, never mixed into the positive corpus.
   - **The episode closes on the freeze, not on the repair.** A row is open and accumulating rounds
     until Victor writes `[refined]`; that marker is what completes it. So `study-content-writer`
     appends, and the closing event belongs to the freeze — which also means an episode on a question
     he never freezes stays open, and needs a disposition rather than sitting there forever.

   The same shape applies to the notes family, where the equivalent of the freeze is
   `Status: refined` in the plan and the pair Victor declares refined.
8. **Maturity.** A pattern is due when it recurs **across different questions**, never on repetitions
   inside one — five occurrences in one answer is that answer's quirk, two questions is an invariant.
   *The threshold shape is `REC-171` (g)'s, applied to a different population.*
   **Two questions is a placeholder, not a measurement, and must not be built as if it were one.** It
   was chosen by analogy to a sink whose population is note pairs, before this sink held a single row.
   Two co-occurrences in a nearly empty corpus are as likely to be a coincidence as a voice, and the
   damage is worst exactly there: the earliest rules are the ones that govern the most future
   questions. The number is to be **fixed from the corpus once it exists** — see `## Staging` — and
   until then any figure written into machinery is a guess wearing a threshold's clothes.
9. **Draft and approval.** Detection and drafting are **automatic**: Victor is told a rule is due and
   shown its draft without having initiated anything. The **landing is not** — a rule reaches the
   standard only through an approval gate, because that standard governs every question written
   afterwards and a bad auto-derived rule would propagate in silence to the whole future bank.
   *Which gate — the four-step `REC-NNN` route or a lighter in-session one — is open in `REC-184`, and
   must be ruled for `notes/` at the same time or the two mechanisms diverge.*

   **A rule must land in two standards, not one.** Measured 2026-08-29: the consumer sets of
   `_interview-prep-standard.md` and `_portfolio-standard.md` are **disjoint**. The portfolio chain
   (`portfolio-audit.md`, `_portfolio-write-prompt.md`, `_portfolio-review-prompt.md`) never reads the
   interview-prep standard, and no file of the interview-prep chain reads the portfolio one. A voice
   rule landed only in the first would refine the levelled bank and leave the project bank — the
   questions he answers most, about work he built — generated in the voice the loop had just proved is
   not his. Either both standards receive the rule, or the voice rules live in one file both chains are
   made to read.
10. **Payoff.** New questions are generated already in his voice, so each turn of Loop A needs fewer of
    his TODOs. Loop B is what makes Loop A cheaper; without it this is a well-ordered bilingual bank
    and nothing more. *This step is an **assertion**, and the next section is about the fact that
    nothing in the loop can currently tell whether it is true.*

---

## The feedback signal Loop B does not have

**As written, steps 7–10 form an open loop.** A rule is derived from his corrections and applied to
everything written afterwards, and **nothing ever checks whether the questions written after a rule
needed fewer corrections than the ones written before it**. Every other loop in this repository closes:
a prompt's refinement is decided by `_last-run-report*.md`, a skill's by `_skill-breach-log.md`, a step
of the plan by its own done condition. Loop B has an input, a rule set and no verdict on itself.

The consequence is not that it fails — it is that it cannot be told from a system that works. Rules
accumulate, every one of them plausible on the two questions it came from, and the only reader who
could notice that one of them is wrong is the person whose voice it claims to describe, reading
questions that were already written under it. **A loop with a door in and no door out only grows.**

What closing it requires is small and has to be decided before the first rule lands, not after:

- **A count that moves, and step 7 already produces it: rounds-to-freeze.** How many TODO rounds a
  question needs before Victor writes `[refined]`. It is the closing number of every episode, it needs
  no instrumentation beyond the sink itself, and it answers the question step 10 only asserts: if the
  derived rules are learning his voice, questions generated after a rule freeze in fewer rounds than
  the ones before it. **A rule whose cohort does not freeze faster did not pay**, and that is a
  falsifiable statement about a voice rule, which is the thing this design otherwise lacks entirely.
- **A rule that can be found again.** Each derived rule keeps the question IDs it was derived from, so
  a rule that stops paying can be traced back to the two answers that suggested it and withdrawn.
- **A disposition field from the first row.** `REC-171`'s sink carries one; this one should be born
  with it rather than gain it once a wrong rule is already in a standard.

*No row owns any of this yet.* It is the difference between an improvement system and an accumulator,
so it belongs in whichever row builds the sink rather than in a later one.

---

## Staging — collect early, decide late

**Do not build Loop B in one piece.** The reason is not caution: it is that collecting is cheap and
deciding is expensive, and every decision the design still owes — the maturity threshold, the shape of
a voice rule, whether the corpus is even large enough to hold patterns — is answerable from data that
does not exist yet and unanswerable from an empty file.

- **Phase 0 — the sink alone.** One open episode per question: `v0`, then an appended round per TODO
  (his verbatim words + the version it produced, marked rejected once a later round supersedes it),
  the frozen text when `[refined]` lands, the rounds-to-freeze count that closes it, and a
  `Disposition` field. **No detector, no threshold, no consumer, no standard touched.** The writer is
  `study-content-writer` at the moment it resolves a TODO, which already fires on that event; the
  closing write is triggered by the freeze. This is the whole of what should be built first, and it is
  a fraction of the machinery the rest of this file describes.
- **Phase 1 — read it, once there is something to read.** With real episodes in front of him: is there
  a pattern at all? At what recurrence does one stop being a coincidence? What does rounds-to-freeze
  actually look like — one round for most questions, or four? Do his TODOs describe *voice*, or mostly
  technical content — which would mean the loop he wants is a different loop. **This phase can conclude
  that Loop B should not be built**, and that is a successful outcome, not a failure.
- **Phase 2 — the detector, the threshold, the gate.** Only here, and only with Phase 1's numbers,
  does anything reach `_interview-prep-standard.md` and `_portfolio-standard.md`.

**The risk Phase 1 exists to catch, stated plainly:** the corpus may never reach maturity. If he
refines twenty questions over two months and most of his TODOs are one-off, nothing recurs, no rule is
ever due, and a fully built Loop B sits silent while nothing reports that it is silent. Phase 0 costs
almost nothing and finds this out; Phase 2 built first would hide it behind machinery.

---

## The wiring, step by step

What each step would touch, in `_system-map.md` §7's vocabulary. **Every "target adds" cell is a claim
about what is wanted, not a licence**: the owning row authorises the edit, and §7 is what must be
updated in the same commit if one lands.

| Step | File | Written by today | Read by today | What the target adds | Row |
|---|---|---|---|---|---|
| 1–2 | `notes/interview-prep/projects/*.md` | `/portfolio-audit` | `/simulator` | IDs, priority markers, an `es/` twin, a TODO channel — and readers: the route, the recall block, both recounts | `REC-180` |
| 3–4 | `notes/interview-prep/{LEVEL}/en\|es/*.md` | `/interview-prep-audit` · `/simulation-review` · `/code-review-practice` · `study-content-writer` · `study-block-close` | route, block-open, `/simulator`, both recounts | the symmetric repair-direction rule, and the re-translation reviewer `REC-183` (a) owes | `REC-183` |
| 5 | same | Victor alone writes `[refined]` | — | nothing — already the contract | — |
| 6 | `notes/interview-prep/routes/{LEVEL}.md` · `PROGRESS.md` `## Study progress` | `/interview-prep-route` only · the closing rituals | block-open, `study-block-close`, `authoring-progress-recount` | whether project questions enter the route, the block and the count at all | `REC-180` |
| 7 | a **new** sink, likely under `knowledge/interview-prep/_internal/` | — | — | one **episode** per question: `v0`, a round per TODO (verbatim + its version, rejected once superseded), the `[refined]` text, rounds-to-freeze, `Disposition`. Two writes, not one — appended by `study-content-writer`, closed by the freeze. The `REC-054` cost objection answered explicitly, since storing prose is what `REC-171` priced and declined, and an episode stores more of it than a row | `REC-184` |
| 8 | the same sink | — | its consumer | the across-questions threshold, and where the count is printed — `REC-171`'s equivalent is a close-out's `cosecha:` line | `REC-184` |
| 9 | `_interview-prep-standard.md` **and** `_portfolio-standard.md` | **by hand only** — the standards fence, owned by `_session-rules.md` | their two disjoint chains | the approval gate, and a landing that reaches both chains | `REC-184` |

Step 9 is where this target is easiest to get wrong, because §7's bottom block fences every
`_*-standard.md` as *by hand only*. "Automatic up to an approved draft" is the one shape that fence
permits: the drafting is a run, the landing is a hand.

---

## The three invariants that hold the loop together

- **A derived rule never rewrites a question that already carries `[refined]`.** It would overwrite the
  very answers the pattern was derived from, and it is what the freeze exists to forbid. A rule governs
  what is written next.
- **The pair never drifts, in either direction.** Step 4 is the only repair route, and it always ends
  with both files saying the same thing.
- **A bank governed by a rule its older half never saw has to say so.** The first invariant guarantees
  that from the first derived rule onward the bank holds two populations — questions frozen before it
  and after it — and today nothing tells them apart. Whatever form the answer takes, the property is
  that a question's compliance is judged against the rules in force **when it was frozen**, not against
  today's standard; otherwise every future audit reopens the whole bank, or quietly grades old
  questions against a bar they were never written to. *No row owns this yet.*

## The parallel in `notes/`

`REC-171` built the same second loop for note prose and shipped (a)–(f): the sink
`knowledge/notes/_internal/_note-todo-harvest.md`, its writers, its counter, its threshold. Only the
first harvest, (g)+(h), is left, and it is blocked behind `REC-170` — the standard's calibration
exemplar was never validated by Victor, so depth rules refined against it would calibrate the bar
against the pipeline's own prose. **The question differs even though the evidence is shared**: that
sink asks *which rule of the standard was missing or unapplied*, countable across pairs. Loop B asks
*what is Victor's answering voice*, legible only in the before/after.

Because `REC-184` and `REC-171` (g)/(h) must rule the approval gate together or diverge, a session
resolving `REC-171` (g) or (h) reads this file at its step 1 as well — the fifth reader, where
`README.md` and `_system-map.md` §7 both list only the first three.

## What no row owns yet

Found 2026-08-29 while fitting this target to the two maps. **None of it is authorised**: each needs a
clause in an existing row, or a row of its own, before anything is built.

- **The recall block is the second evidence source, and it discards everything it produces.**
  `interview-prep-block-open` accepts a voice-dictation transcript and instructs *never penalise
  transcription noise, spelling, punctuation or speaking style* — right for grading substance, and it
  means the only artefact of Victor actually speaking is graded and dropped. Its `BORDERLINE`
  disposition then asks him to answer the same question again, so the block **manufactures** the exact
  before/after pair step 7 exists to collect, for free, and keeps neither half. Step 7 as written
  harvests only TODOs he writes while *reading*, which is his editorial taste; the transcript is his
  voice, and the two are not the same corpus. Whether the block stops being read-only or hands the
  pair to `study-block-close` is the decision. Candidate home: a clause in `REC-184`.
- **Everything in `## The feedback signal Loop B does not have`** — the count that moves, the
  traceable rule, the `Disposition` field — is unowned, and is the part that decides whether this is an
  improvement system or an accumulator. Not restated here.
- **The staging in `## Staging`** is a recommendation with no row behind it. Phase 0 is the piece worth
  opening first, and it is smaller than `REC-184` as currently written.
- **The maturity number in step 8** is a placeholder no measurement supports.
- **The third invariant above**, the pre-rule/post-rule split, has no owner.

## Sequencing

`REC-183` (repair direction) → `REC-180` (IDs, priority, the `es` twin, the TODO channel, and the four
readers the project bank needs) → `REC-184` (the voice sink and its consumer), which should not precede
`REC-171` (g)'s first harvest: building a second extraction mechanism while the first has never run
once produces two untested designs.

**`REC-184` should be split along `## Staging`'s phases rather than sequenced as one row.** Phase 0 —
the sink and its writer, nothing else — is blocked only behind `REC-180` (a row cannot store a question
ID before question IDs exist) and can start the moment that lands, well before the notes harvest has
run. Phase 2 is the part that must wait for `REC-171` (g), because the untested-design objection is
about the *detector and its gate*, not about a file that accumulates rows. Splitting it that way starts
the corpus months earlier at almost no cost, which is the whole argument of that section.

**The transitive consequence, stated because it is easy to miss:** `REC-171` (g) is blocked behind
`REC-170`, so the critical path of the voice loop begins at a row about the calibration exemplar of
`_note-quality-standard.md` — a note pair under `notes/java/junior/`, one folder away from everything
this file describes. Nothing about interview answers can be harvested until Victor validates it.
