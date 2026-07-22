# Practice-plan standard — the bar for a `practice/{track}/PLANNING.md`

**Internal component. Not runnable.** This is what `practice-plan-audit.md` audits against. It is to a
practice track what `notes/prompts/projects/plan/_planning-standard.md` is to a project: the single
statement of what the plan must contain and what makes it good.

**What a practice plan is.** A project plan says *what gets built*. A practice plan says *how a skill
gets drilled until it survives an interview*: the order of the topics, the exercise files, how many of
each, which prompt runs when, what "done" means per step, and when the whole track is finished. Today
one exists — `practice/sql/PLANNING.md`. The standard is written to fit any future track (simulations,
leetcode) without change.

---

## Section A — Required sections

A plan is complete when it has all of these. A missing section is a finding, not a style choice.

| § | Section | Must contain |
|---|---------|--------------|
| 0 | Session quick reference | Current step · current branch · done condition · next gate · blocked on · last updated. Six rows, no prose. |
| 1 | Relation to the hub files | Which file owns *what to learn*, *what has been learned*, and *in what order*. The plan never restates coverage. |
| 2 | The step loop | Every moment of a step, each with a trigger, the prompt to run, and the exact config to paste. A moment with no trigger is not a moment. |
| 3 | Done-condition format | The closed list of testable formats a done condition may use. |
| 4 | Step-complete ritual | Every file that moves when a step closes, marked *automated* or *manual*. |
| 5 | Inventory of files produced | Every exercise file and every note file, decided up front, with the exercise count each ends at. |
| 6 | The steps | One entry per step: exercises, coverage claimed, notes, what it reinforces, the prompt config, the exit question, the done condition. |
| 7 | Branch and commit rules | Which branch, who commits what, atomicity. |
| 8 | Progress tracking | One row per step: scored/target, notes produced, status. |
| 9 | Quality gates | One row per gate: trigger, prompt + config, why exactly there. Plus the prerequisite chain and a closure checklist. |
| 10 | Consistency invariants | The cross-checks between sections, verifiable mechanically. |
| 11 | What is deliberately not here | Named exclusions with a reason. Silence is not an exclusion. |

---

## Section B — The learning bar

This is the half a project-plan standard does not have, and the half that decides whether the track
actually produces recall under pressure. Each item is a check the `learning-design` specialist owns.

**B1 — Dependency order, justified.** Every step's position is explained by what it needs from the
previous one, not by the order of the coverage file. A step whose placement has no stated reason is a
finding: the reason is what tells you where a *new* topic slots in later.

**B2 — Retrieval before exposition.** Drilling comes before the write-up: a step's notes are authored
only after its exercises score, never before. Reading a note first turns the exercises into
recognition; doing them first makes the note explain something the hands have already met.

**B3 — Every concept is revisited at least once, on an objective trigger.** A plan that gives each
concept to exactly one step drills everything once and never returns — the default outcome is decay,
and the decay is invisible because a forgotten concept does not feel rusty, it feels learned.
Therefore: the revisit must be scheduled by a **gate**, and its scope must come from a **written
record of what was failed**, never from self-assessed rustiness. An optional "revisit when it feels
stale" trigger may exist *in addition*; it never substitutes.

**B4 — Failures are persisted.** A grading run that names gaps only in chat loses them. The plan must
name the file where failed concepts accumulate, who writes it, and which gate consumes it. Progress
files record what was learned; something must record what was not.

**B5 — Difficulty rises inside a step and across the track.** Each batch spans an intro → challenge
range, and later steps integrate earlier ones instead of restarting at the bottom. A step whose
exercises are all the same level is a finding regardless of how many there are.

**B6 — Every step ends in a question answered aloud, from memory.** Written exercises test
construction; the spoken question tests retrieval under the conditions of an interview. It is part of
the done condition, never a nice-to-have.

**B7 — Done conditions are testable.** Each one matches a format from §3 and could be judged by
someone else. "I understand joins" is not a done condition.

**B8 — Steps are session-sized.** A step is a handful of daily blocks, never weeks, and the plan
states the ceiling it holds itself to (max exercises per generation run, max per step). A step over
the ceiling is split into two runs, not shipped as one.

**B9 — The track ends in an integration step under time pressure.** The last step hands requirements
in prose, times them, and adds no new syntax. Skills drilled topic by topic do not compose on their
own.

**B10 — Nothing is invented mid-session.** Every file, count and gate exists in the plan before the
first exercise is written. Ad-hoc additions during a study block are what turns a plan into a diary.

---

## Section C — Truth rules

The plan makes factual claims about files on disk. Those claims rot silently.

**C1 — Three counts, never conflated.** *Written* (the statement exists), *answered* (a query is under
it), *scored* (a review run graded it). Only **scored** advances a step. A plan that reports answered
work as scored claims progress that never happened.

**C2 — Every status is verifiable against the artefact.** A row claiming N exercises in a file must
match that file. The audit checks the files, not the plan's own summary lines.

**C3 — Targets exclude revisit batches.** A file legitimately grows past its target forever; that is
not drift. Revisit batches are counted separately and never flip a status.

**C4 — The plan and its prompts must agree.** Paths, topic names, counts and config keys appear in
both the plan and the prompt that consumes them. On disagreement the plan wins on *order and scope*;
the prompt wins on *its own config vocabulary*. Either way the divergence is a finding — one of the
two gets fixed, never left.

**C5 — One artefact, one schema.** An exercise file whose setup block no longer matches the canonical
schema is closed, not extended; the next file starts fresh. (Generalises to any track: an artefact
built on a superseded baseline is closed rather than patched.)

---

## Section D — Invariants the plan must state about itself

§10 of the plan lists these; the `steps-and-counts` and `coverage-and-scope` specialists verify them.

1. Every section of the coverage file is claimed by exactly one step, or listed in §11 as excluded.
2. Every step names a file that appears in §5, and every file in §5 belongs to a step.
3. Per-step counts for a shared file sum to that file's target; §8's totals match §5's.
4. No generation run exceeds the stated ceiling; a step above it is split.
5. Every note file a step creates or extends appears in §5, with both language versions named.
6. §0's current step is the first non-done row in §8.
7. §0's next gate is a real gate from §9, and the first whose trigger has not fired.
8. Every done condition matches a §3 format.
9. The note numbering agrees with the counter in `CLAUDE.md`.

---

## Section E — What this standard does not govern

- **The content of the exercises** — that is the generating prompt's job, bounded by the coverage file.
- **The coverage list itself** — a concept missing from coverage is added there, never invented in the
  plan. A plan that grows its own concept list has become a second source of truth.
- **Note quality** — `_note-quality-standard.md` owns it.
