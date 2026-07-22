# SQL practice-plan standard — the bar for `practice/sql/PLANNING.md`

**Internal component. Not runnable.** This is what `sql-plan-audit.md` builds and audits against.

**What this plan is.** The learning path for the daily SQL block: which topics get drilled, **in what
order and why**, which exercise file each produces, how many exercises, when to pause and revise, and
what "done" means for each step. It exists so that no SQL session starts with "¿y hoy qué hago?".

**What this plan is NOT.** It is **not** a plan for the SQL *notes*, the SQL *interview Q&A*, or the
SQL *simulations*. Those are separate tracks Victor runs himself with their own prompts
(`/notes-audit`, `/interview-prep-audit`, `simulation-generator`), on his own schedule. This plan
never schedules them, never states their config, and never lists their files. **§Z is the only place
they may be named at all**, as a one-line reminder that they live elsewhere. A step that closes partly
on a note being written is out of scope: here a step closes on exercises.

Its two inputs, and it never invents beyond them:
- **`notes/sql/coverage.md`** — what must be learned. Every step claims sections of it; a concept that
  belongs to SQL and is missing goes *there*, never into this plan.
- **`ROADMAP.md`** — why, and by when. The ordering serves the current objective (a junior Angular +
  Java role in Spain, technical screening first) and the pace fits the daily block it defines.

---

## Section A — Required sections of the plan

| § | Section | Must contain |
|---|---------|--------------|
| 0 | Session quick reference | Current step · current branch · done condition · next revision point · blocked on · last updated. Six rows, no prose — it is the first thing read in a session. |
| 1 | Inputs | The two files above and what each owns. Three lines. |
| 2 | The step loop | Every moment of a step, with its trigger and the exact config to paste. Exercise prompts only. |
| 3 | Done-condition format | The closed list of testable formats. |
| 4 | What to update when a step closes | Every file that moves, marked *automated* (a prompt does it) or *manual*. |
| 5 | The exercise files | Every file, in order, with its target and the three counts (written / answered / scored). |
| 6 | The steps | One entry per step, to the shape in Section C. |
| 7 | Revision points | Where the track deliberately stops advancing and re-drills. Governed by B4. |
| 8 | Branch and commit rules | Which branch, who commits what, atomicity. |
| 9 | Progress table | One row per step: scored/target, status. Mirrors `PROGRESS.md`. |
| 10 | Consistency invariants | The mechanical cross-checks in Section D. |
| 11 | Closure | What makes the whole track finished. |
| Z | Out of scope | One line each: notes, Q&A, simulations — run separately, not planned here. |

---

## Section B — The learning bar

The half that decides whether the track produces recall under pressure. Each item is an audit check.

**B1 — The order is by dependency, and every position is justified in one sentence.** Not the order of
`coverage.md`, not alphabetical. The stated reason is what lets a new topic be slotted in correctly
later: *"joins before aggregation, because in a screening `GROUP BY` almost always sits on a join"* is
a reason; *"next in the list"* is not.

**B2 — What a screening asks first comes first.** The ordering serves the objective in `ROADMAP.md`,
not the internal elegance of the subject. A topic that is intellectually foundational but rarely asked
does not sit in front of one that opens every technical test.

**B3 — Difficulty rises inside every step, and later steps integrate earlier ones.** Each batch spans
intro → challenge. From the middle of the track on, at least one challenge exercise per step combines
the current topic with an earlier one. A step that could have been done first taught nothing about
composition.

**B4 — Revision is scheduled, not felt.** Two mechanisms, both required:
- **Cadence** — a revision point every **3 exercise files**, never left to judgement. It re-drills the
  concepts of the files since the previous one.
- **Failure-driven** — its `FOCUS` comes from the written record of what was answered wrong
  (`practice/sql/MISTAKES.md`), never from how rusty a topic feels. A forgotten concept does not feel
  rusty, it feels learned — which is exactly why the trigger cannot be a feeling.

A revision batch is **extra**: it never counts toward a step's target and never flips a status.
Without that rule the plan starts congratulating itself for repetition.

**B5 — Every step ends in a question answered aloud, from memory, nothing open.** Exercises test
construction; the spoken question tests retrieval under interview conditions. It is part of the done
condition, not a nice-to-have.

**B6 — Done conditions are testable by someone else.** Each matches a §3 format.

**B7 — Steps are session-sized, with a stated ceiling.** The plan declares its own maximum exercises
per generation run and per step, and holds to it; anything above is split into two runs.

**B8 — The track ends in an integration step under time pressure.** Requirements handed in prose, no
new syntax, timed. Skills drilled topic by topic do not compose on their own.

**B9 — Nothing is invented mid-session.** Every file, count and revision point exists in the plan
before the first exercise is written.

**B10 — The plan is extendable without rewriting.** New coverage sections become new steps inserted at
their correct dependency position, preserving existing numbering wherever possible and never touching
the record of closed steps. Growth is the normal case, not a special event.

---

## Section C — The shape of a step

Every §6 entry has exactly these fields. A missing field is a finding.

```
### Step N — <topic> <status emoji>

**Why here:** <one sentence: what it needs from the previous step, or why a screening asks it early>
**Exercises:** practice/sql/NN-name.sql — <count> (split into runs if over the ceiling)
**Coverage claimed:** <verbatim section names from notes/sql/coverage.md>
**Reinforces:** <which earlier step, through which concept>
**Concepts:** <the concrete list this step drills>

**Config to paste:**
    MODE  = practice
    TOPIC = <the exercise prompt's topic value>
    COUNT = <n>
    FOCUS = <concepts, or blank for the full topic>

**Exit question:** <one question, answered aloud>
**Done:** <a §3 format> · exit question aloud
```

`TOPIC` is the **exercise prompt's vocabulary**, not a coverage section name — different namespaces,
and two steps may legitimately share a `TOPIC` with different `FOCUS`.

---

## Section D — Invariants

1. Every section of `notes/sql/coverage.md` is claimed by exactly one step, or excluded in §11 with a
   reason. None unclaimed, none claimed twice.
2. Every step names a file that appears in §5, and every file in §5 belongs to a step.
3. Per-step counts for a shared file sum to that file's target; §9's totals match §5's.
4. No generation run exceeds the declared ceiling; a step above it is split into runs.
5. §0's current step is the first non-done row in §9.
6. Every done condition matches a §3 format.
7. A revision point appears at least every 3 files in §5 (B4).
8. **Three counts, never conflated** — *written* (the statement exists), *answered* (a query is under
   it), *scored* (a review run graded it). Only **scored** moves a status. A plan reporting answered
   work as scored claims progress that never happened.
9. Every count and status in §5 and §9 matches the exercise files on disk and `PROGRESS.md`.
10. Every prompt named exists at the path given, and every config the plan says to paste uses that
    prompt's real keys. A plan pointing at a moved prompt or an invented key rots silently: the run
    happens and produces something else.
11. **One artefact, one schema** — an exercise file whose setup block no longer matches the canonical
    schema is closed, not extended; the next file starts fresh with its own setup block.

---

## Section E — Ownership fence

The plan may **name** an artefact and **point** at its owner. It may never describe its content,
format or quality bar.

| Artefact | Owner | This plan may say |
|----------|-------|-------------------|
| Exercise content, difficulty split, file format | `sql-exercises-prompt.md` | how many, which topic, which focus |
| The concept list | `notes/sql/coverage.md` | which sections a step claims |
| What has been learned | `PROGRESS.md` | that closing a step updates it |
| The mistake log | `practice/sql/MISTAKES.md` (written by the review run) | that revision points read it |
| Notes, interview Q&A, simulations | their own prompts, run separately by Victor | one line in §Z. Nothing else. |

A finding outside this table is reported to Victor as a recommendation, never fixed in the plan.
