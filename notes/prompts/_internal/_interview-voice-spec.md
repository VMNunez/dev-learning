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
loop would touch.

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

7. **Collection, from the reading side.** Every resolution of step 4 deposits evidence: the question
   ID, his **verbatim** TODO, and the **initial and final** text of the answer. The before/after is the
   payload — without it there is a result and no pattern. The writer is `study-content-writer`, whose
   trigger already names `notes/interview-prep/` while its routing branches only on `{LEVEL}/en|es/`.
   *`REC-184`. Note `REC-171`'s note sink deliberately refuses to store prose, under a countability
   argument that does not transfer; that is why this is a second sink and not a widening of the first.*
8. **Maturity.** A pattern is due when it recurs **across different questions**, never on repetitions
   inside one — five occurrences in one answer is that answer's quirk, two questions is an invariant.
   *The threshold shape is `REC-171` (g)'s, applied to a different population.*
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
    and nothing more.

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
| 7 | a **new** sink, likely under `knowledge/interview-prep/_internal/` | — | — | ID + verbatim TODO + before/after answer, and a `Disposition` field; the `REC-054` cost objection answered explicitly, since storing prose is what `REC-171` priced and declined | `REC-184` |
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
- **Step 10 asserts a payoff nothing measures.** "Fewer TODOs per turn" needs TODOs counted per
  question or per generated batch, somewhere durable. Without it Loop B can never be shown to work —
  and never retired if it does not.
- **There is a door into the rule set and none out.** A pattern that matures on two questions and turns
  out to be an artefact of those two has no retirement path. `REC-171`'s sink carries a `Disposition`
  field for exactly this; Loop B's should be designed with one rather than gain one later.
- **The third invariant above**, the pre-rule/post-rule split, has no owner.

## Sequencing

`REC-183` (repair direction) → `REC-180` (IDs, priority, the `es` twin, the TODO channel, and the four
readers the project bank needs) → `REC-184` (the voice sink and its consumer), which should not precede
`REC-171` (g)'s first harvest: building a second extraction mechanism while the first has never run
once produces two untested designs.

**The transitive consequence, stated because it is easy to miss:** `REC-171` (g) is blocked behind
`REC-170`, so the critical path of the voice loop begins at a row about the calibration exemplar of
`_note-quality-standard.md` — a note pair under `notes/java/junior/`, one folder away from everything
this file describes. Nothing about interview answers can be harvested until Victor validates it.
