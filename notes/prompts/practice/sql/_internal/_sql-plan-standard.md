# SQL practice-plan standard — the bar for the SQL exercise plan

**Internal component. Not runnable.** This is what `sql-plan-prompt.md` builds to and `sql-plan-audit.md`
audits against.

**The plan is two files, and the split is by level-neutrality.**

| File | Holds | Written by |
|------|-------|-----------|
| `practice/sql/PLANNING.md` — *the doctrine* | the step loop, the done-condition formats, the closing ritual, branch rules, the revision mechanism, quality gates, invariants, closure, the out-of-scope fence. Identical whichever level is being drilled. | `sql-plan-audit` |
| `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` — *the route* | that level's exercise files, its steps, its progress table, its coverage fingerprint. | `sql-plan-prompt` |

One doctrine, three routes. The doctrine is written once because a step loop that says something
different at middle than at junior is a step loop nobody trusts; the route is per level because the
coverage checklist is.

**What this plan is.** The learning path for the daily SQL block: which topics get drilled, **in what
order and why**, which exercise file each produces, how many exercises, when to pause and revise, and
what "done" means for each step. It exists so that no SQL session starts with "¿y hoy qué hago?".

**What this plan is NOT.** It is **not** a plan for the SQL *notes*, the SQL *interview Q&A*, or the
SQL *simulations*. Those are separate tracks Victor runs himself with their own prompts
(`/notes-audit`, `/interview-prep-audit`, `simulation-generator`), on his own schedule. This plan
never schedules them, never states their config, and never lists their files. A step that closes partly
on a note being written is out of scope: here a step closes on exercises.

**One exception, and only one: readiness.** A downstream track that may only use *closed* steps has to
ask this plan whether it is unblocked, because the route §3 is the sole record of that. So the plan may state
**which techniques the closed steps have unlocked, and therefore what that track is allowed to ask
for** — a fact about SQL knowledge, which is exactly what this plan owns. It still may not schedule the
run, state its config, describe what a test looks like, or list its files. The line is *readiness vs
content*: "joins and `GROUP BY` are available, window functions are not" is readiness; "a SQL test is
6–9 queries with a 45-minute limit" is content and belongs to the other prompt.

Amended 2026-07-22. Before that the fence was absolute, and the consequence was that the
technique-to-step mapping lived inside `simulation-generator-prompt.md` alone — so the five SQL tests
already in the bank all required Step 7 material and nothing Victor reads daily said so.

Its two inputs, and it never invents beyond them:
- **`notes/sql/coverage/{LEVEL}.md`** — what must be learned at the level the route serves. Every step
  claims bullets of it; a concept that belongs to SQL and is missing goes *there*, never into this plan.
- **`ROADMAP.md`** — why, and by when. The ordering serves the current objective (a junior Angular +
  Java role in Spain, technical screening first) and the pace fits the daily block it defines.

---

## Section A — Required sections

### A1 — `practice/sql/PLANNING.md`, the doctrine

| § | Section | Must contain |
|---|---------|--------------|
| 0 | Session quick reference | Current level · current step · current branch · done condition · next revision point · blocked on · last updated. Seven rows, no prose — it is the first thing read in a session, and the level row is what tells the reader which route file the other six refer to. |
| 1 | Inputs | The two files above and what each owns, plus the doctrine/route split. |
| 2 | The step loop | Every moment of a step, with its trigger and the exact config to paste. Exercise prompts only. |
| 3 | Done-condition format | The closed list of testable formats. |
| 4 | What to update when a step closes | Every file that moves, marked *automated* (a prompt does it) or *manual*. |
| 7 | Branch and commit rules | Which branch, who commits what, atomicity. |
| 8b | Revision points | Where the track deliberately stops advancing and re-drills. Governed by B4. The cadence and the focus mechanism are doctrine; **which** points exist for a level, and their spans, live in that level's route. |
| 8c | Simulation readiness | The technique-to-step mapping, and which techniques the closed steps have unlocked. Readiness only — see the exception in "What this plan is NOT". |
| 9 | Quality gates | Which quality prompt runs at which checkpoint, and the hard prerequisite chain. |
| 10 | Consistency invariants | The mechanical cross-checks in Section D. |
| 11 | Closure | What makes the whole track finished, level by level. |
| Z | Out of scope | One line each: notes, Q&A, simulations — run separately, not planned here. |

**§5, §6 and §8 are deliberately absent.** They were the doctrine's three level-specific sections and
they now live in the route file as §1, §2 and §3. Each of their old positions keeps a one-line pointer
at `PLANNING-{LEVEL}.md` so a cross-reference written before the split still lands somewhere true.

### A2 — `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`, the route

| § | Section | Must contain |
|---|---------|--------------|
| header | Plan metadata | `Plan status` · `Level` · `Coverage` path · `Coverage SHA-256` · `Doctrine` path · `Generated`. |
| 1 | The exercise files | Every file, in order, with its target and the three counts (written / answered / scored). Revision files in their own table, with no target. |
| 2 | The steps | One entry per step, to the shape in Section C. |
| 3 | Progress table | One row per step: scored/target, status. Mirrors `PROGRESS.md`. |
| — | Out of scope at this level | Every coverage bullet deliberately not drilled here, with a reason. |

**These numbers are the contract.** Three other files cross-reference the plan by section number —
`_sql-exercises-review.md`, `_sql-exercises-practice.md` and `simulation-generator-prompt.md` — so
renumbering a section is a breaking change, not a tidy-up. Doctrine sections kept their original numbers
across the split (§0–§4, §7, §8b–§11, §Z) precisely so those references survived; only the three moved
sections were renumbered, and they were renumbered because they changed file.

---

## Section B — The learning bar

The half that decides whether the track produces recall under pressure. Each item is an audit check.

**B1 — The order is by dependency, and every position is justified in one sentence.** Not the order of
the coverage file, not alphabetical. The stated reason is what lets a new topic be slotted in correctly
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

Every route §2 entry has exactly these fields. A missing field is a finding.

```
### Step N — <topic> <status emoji>

**Why here:** <one sentence: what it needs from the previous step, or why a screening asks it early>
**Exercises:** practice/sql/{LEVEL}/NN-name.sql — <count> (split into runs if over the ceiling)
**Coverage:** <verbatim section names from notes/sql/coverage/{LEVEL}.md>
**Reinforces:** <which earlier step, through which concept>
**Moment 2 config:** `TOPIC = <the exercise prompt's topic value>`, `COUNT = <n>`
**Focus:** <the concepts to narrow onto, or `none — the whole topic`>
**Concepts:** <the concrete list this step drills>

**Coverage bullets:**

- [ ] <exact coverage bullet>
- [x] <exact coverage bullet — drilled by a scored exercise>

**Pending additions:** <none, or bullets coverage gained after this step closed>

**Exit question:** <one question, answered aloud>
**Done:** <a doctrine §3 format, written out in full> · exit question aloud
```

**The two bullet fields are what make the route reconcilable.** `**Coverage:**` names the sections a
step claims — human-readable, and what invariant 1 checks. `**Coverage bullets:**` lists the individual
bullets verbatim, checkbox-prefixed, and is what lets `sql-plan-prompt` tell a step that has drilled its
scope from one that merely mentions the section. A `[x]` is written when a **scored** exercise drilled
that bullet; nothing else sets it. `**Pending additions:**` carries bullets coverage gained *after* the
step closed: a closed step is never reopened by new scope, so the additions sit there until a
reinforcement run drills them.

**`FOCUS` is a field of the step, never a pasted key.** The pasted config has exactly four keys —
`MODE`, `TOPIC`, `COUNT`, `FILE` — and `sql-exercises-prompt.md` derives `{FOCUS}` and `{REVIEW}` by
reading the step. So the step must carry a literal **`**Focus:**` line** and a literal `COUNT = n`
inside its **`**Moment 2 config:**`** line: those two strings are what the prompt greps for, and a step
that states the same information in prose resolves to nothing and stops the run. (Corrected
2026-07-22: this block used to show a five-key config with `FOCUS =` in it, which the prompt has never
accepted.) `none — the whole topic` is a value; a blank `**Focus:**` line is a finding.

**A step split into two runs states each run's exercise range** (`run 1 → #01–#11`, `run 2 →
#12–#22`) whenever both runs share a `TOPIC`. Without the range there is nothing on disk that tells the
prompt which run it is being asked for.

`TOPIC` is the **exercise prompt's vocabulary**, not a coverage section name — different namespaces,
and two steps may legitimately share a `TOPIC` with different focus.

---

## Section D — Invariants

**Numbered to match the plan's own §10, one for one.** The audit dispatches concerns by invariant
number, so a standard numbering these differently from the plan hands two specialists each other's
checks. Aligned 2026-07-22.

1. Every bullet of `notes/sql/coverage/{LEVEL}.md` is claimed by exactly one step of that level's route,
   or excluded in its *Out of scope at this level* section with a reason. None unclaimed, none claimed
   twice, none claimed by two levels.
2. Every step names a file that appears in the route's §1 step table, and every file in that table
   belongs to a step. **Declared exception:** the revision files (`R{n}-repaso.sql`) belong to a
   revision point, not a step, and live in their own §1 table with no target — they are the physical
   form of "a revision batch is extra" (B4). A plan that lets them into the step table has started
   counting repaso as progress.
3. **Counts, and the three that are never conflated** — *written* (the statement exists), *answered* (a
   query is under it), *scored* (a review run graded it); only **scored** moves a status, and a plan
   reporting answered work as scored claims progress that never happened. Per-step counts for a shared
   file sum to that file's target, the route's §3 totals match its §1, and both match the exercise files
   on disk and `PROGRESS.md`.
4. No generation run exceeds the declared ceiling; a step above it is split into runs.
5. Doctrine §0's current step is the first non-done row in the current level's route §3, and its
   *current level* row names a route file that exists.
6. Doctrine §0's next revision point is a real point from the current route, and the first whose trigger
   has not fired.
7. Every done condition matches a doctrine §3 format **verbatim**, not abbreviated.
   `Review: ... ≥ 80% on X.sql` is not the format;
   `Review: sql-exercises MODE = review scores ≥ 80% on X.sql` is.
8. A revision point appears at least every 3 files in the route's §1 (B4), each naming `MISTAKES.md`
   open rows as its focus source, and no revision batch is counted in a §1 target or a §3 status.
9. Every prompt named exists at the path given, and every config the plan says to paste uses that
   prompt's real keys. A plan pointing at a moved prompt or an invented key rots silently: the run
   happens and produces something else. **This runs in both directions:** every value the prompt says
   it *derives* from the plan must be present in the plan, in the shape the prompt names — a step with
   no `COUNT` line is the same dead instruction as an invented key.
10. **Extendable without rewriting** (B10) — a new coverage section becomes a new step at its dependency
    position, without renumbering closed steps, taking its own file.
11. **One artefact, one schema** — an exercise file whose setup block no longer matches the canonical
    schema is closed, not extended; the next file starts fresh with its own setup block.
12. **The route carries a live coverage fingerprint.** Every `PLANNING-{LEVEL}.md` states a
    `Coverage SHA-256` over its coverage file's scope bytes (evidence markers stripped). A route whose
    digest no longer matches is **stale, not wrong**: it maps a checklist that has since grown, so
    `sql-exercises` says so in one line and continues, and `sql-plan-prompt` is owed a re-run. Without
    the digest, a coverage file can gain a whole section and nothing anywhere notices.
13. **Level isolation.** Every level owns a directory — `practice/sql/{LEVEL}/` — holding its exercise
    files, its revision files and its own `PLANNING-{LEVEL}.md`, each numbering from `01`. No level is
    flat, so no numbering collides: the isolation is the folder. Junior's existing files are never
    renumbered, being Victor's authored work and several of them closed; they were relocated into
    `junior/` once, wholesale, when the layout was made symmetric (2026-08-03). Two files stay at
    `practice/sql/` root because neither belongs to a level: `PLANNING.md`, the level-neutral doctrine,
    and `MISTAKES.md`, one shared log for the whole track — a concept failed at junior and re-failed at
    middle is one row, not two.
14. **A closed step is never reopened and never renumbered.** New coverage scope landing on a closed
    step goes to its `**Pending additions:**` field, and a reinforcement run drills it. A plan that
    reopens a step whose exercises were answered and graded has thrown away the only record that they
    were.

---

## Section E — Ownership fence

The plan may **name** an artefact and **point** at its owner. It may never describe its content,
format or quality bar.

| Artefact | Owner | This plan may say |
|----------|-------|-------------------|
| Exercise content, difficulty split, file format | `sql-exercises-prompt.md` | how many, which topic, which focus |
| The route: steps, files, counts, statuses, fingerprint | `sql-plan-prompt.md` (writes) · `sql-plan-audit.md` (audits) | — the route file *is* this |
| Progress *inside* the route: §1 counts, §3 statuses, §2 `[x]` bullets | `sql-exercises-prompt.md` (review mode) | — the planner writes these fields' *structure*, never their values; it reads them, preserves them, and never reverses one. Only a scored exercise moves them. |
| The doctrine: loop, formats, ritual, gates, invariants | `sql-plan-audit.md` | — the doctrine file *is* this. `sql-plan-prompt` reads it and reports findings against it; it edits it exactly once, in the one-time route migration. |
| The concept list | `notes/sql/coverage/{LEVEL}.md` | which sections and bullets a step claims |
| What has been learned | `PROGRESS.md` | that closing a step updates it |
| The mistake log | `practice/sql/MISTAKES.md` (written by the review run) | that revision points read it |
| Notes, interview Q&A | their own prompts, run separately by Victor | one line in §Z. Nothing else. |
| Simulations — what a test contains, its format, its time limit, the bank, the tracker | `simulation-generator-prompt.md` · `simulation-review-prompt.md` | one line in §Z **plus §8c: readiness only** — which techniques the closed steps unlock, and therefore what may be asked for today. Never the config, never the format. |

A finding outside this table is reported to Victor as a recommendation, never fixed in the plan.
