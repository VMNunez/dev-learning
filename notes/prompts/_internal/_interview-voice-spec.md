# The interview-answer voice pipeline — target spec

**This file is a target, not a description of what runs today.** Nothing written here is implemented
unless an open row of `_recommendation-ledger.md` says so, and every step below names the row that owns
it. It exists because the target spans four rows and lived only in one conversation: `REC-180`,
`REC-183`, `REC-184` and `REC-171` (g) each carry one slice of it, and a row is forbidden from
restating its neighbours, so the shape none of them can hold had nowhere to be written down.

**No run obeys this file.** It is not a standard and grants no authority: it is read at step 1 of
resolving any row that cites it, so the resolution can see the whole loop before editing its own
corner. Where it and a standard disagree, the standard wins and this file is the thing that is wrong.

Source: Victor, 2026-08-29, across the session that opened `REC-183` and `REC-184`. He stated the
target; the measurements and the collisions are recorded in the rows, not here.

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
   active-recall block. *Whether project-bank questions are counted by `PROGRESS.md`'s
   `## Study progress` rows is an open decision of `REC-180`; a marker nobody recounts is a state that
   lies.*

## Loop B — the system learns his voice

7. **Collection.** Every resolution of step 4 deposits evidence: the question ID, his **verbatim** TODO,
   and the **initial and final** text of the answer. The before/after is the payload — without it there
   is a result and no pattern. *`REC-184`. Note `REC-171`'s note sink deliberately refuses to store
   prose, under a countability argument that does not transfer; that is why this is a second sink and
   not a widening of the first.*
8. **Maturity.** A pattern is due when it recurs **across different questions**, never on repetitions
   inside one — five occurrences in one answer is that answer's quirk, two questions is an invariant.
   *The threshold shape is `REC-171` (g)'s, applied to a different population.*
9. **Draft and approval.** Detection and drafting are **automatic**: Victor is told a rule is due and
   shown its draft without having initiated anything. The **landing is not** — a rule reaches
   `_interview-prep-standard.md` only through an approval gate, because that standard governs every
   question written afterwards and a bad auto-derived rule would propagate in silence to the whole
   future bank. *Which gate — the four-step `REC-NNN` route or a lighter in-session one — is open in
   `REC-184`, and must be ruled for `notes/` at the same time or the two mechanisms diverge.*
10. **Payoff.** New questions are generated already in his voice, so each turn of Loop A needs fewer of
    his TODOs. Loop B is what makes Loop A cheaper; without it this is a well-ordered bilingual bank
    and nothing more.

---

## The two invariants that hold the loop together

- **A derived rule never rewrites a question that already carries `[refined]`.** It would overwrite the
  very answers the pattern was derived from, and it is what the freeze exists to forbid. A rule governs
  what is written next.
- **The pair never drifts, in either direction.** Step 4 is the only repair route, and it always ends
  with both files saying the same thing.

## The parallel in `notes/`

`REC-171` built the same second loop for note prose and shipped (a)–(f): the sink
`knowledge/notes/_internal/_note-todo-harvest.md`, its writers, its counter, its threshold. Only the
first harvest, (g)+(h), is left, and it is blocked behind `REC-170` — the standard's calibration
exemplar was never validated by Victor, so depth rules refined against it would calibrate the bar
against the pipeline's own prose. **The question differs even though the evidence is shared**: that
sink asks *which rule of the standard was missing or unapplied*, countable across pairs. Loop B asks
*what is Victor's answering voice*, legible only in the before/after.

## Sequencing

`REC-183` (repair direction) → `REC-180` (IDs, priority, the `es` twin, the TODO channel in the
project bank) → `REC-184` (the voice sink and its consumer), which should not precede `REC-171` (g)'s
first harvest: building a second extraction mechanism while the first has never run once produces two
untested designs.
