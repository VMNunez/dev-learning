# Simulation practice-plan standard

This is the shared contract for the timed-simulation track. `simulation-plan-prompt.md` creates one
level route to this bar; `simulation-generator-prompt.md`, `simulation-review-prompt.md`, and the three
simulation skills consume it. It is internal and never launched directly.

## 1 — Two files, two responsibilities

- `practice/simulations/PLANNING.md` is the level-neutral doctrine: the five-moment loop, attempt and
  correction semantics, readiness gates, status vocabulary, tracking ownership, and commit boundary.
- `practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` is one level's route: ordered steps, admitted specs,
  targets, prerequisites, coverage focus, current status, and review history.

The doctrine never lists a concrete test. The route never redefines the loop. One doctrine, three
possible routes.

## 2 — Inputs and scope

The plan is evidence-driven. For the selected level it reads:

- `_shared-context.md` for the Spanish-consultancy target and interview stage;
- `PROGRESS.md` for current professional level, project evidence, study state, SQL exercise state, and
  timed-simulation history;
- `ROADMAP.md` for gates, never for invented dates;
- the selected-level coverage files for Angular, Angular Material, TypeScript, CSS, Java, Spring,
  Spring Boot, Architecture, Security, and SQL;
- `practice/sql/PLANNING.md` §8/§8c and the selected SQL route, because SQL simulations may use only
  techniques unlocked by closed exercise steps;
- for Angular and Spring Boot, `practice/exercises/{topic}/{LEVEL}/PLANNING-{LEVEL}.md` →
  `## Essential route`, when it exists, because a track's first timed test waits for the short-exercise
  stages it uses (section 5, route table);
- `practice/simulations/TRACKER.md`, `MISTAKES.md`, and all existing specs as inventory and evidence.
- `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` for the canonical
  evidence-marker stripping rule used by every coverage digest.

Coverage defines possible scope. Evidence and gates define what is ready now. A plan must never turn an
unmarked coverage bullet into a claim that Victor can perform it under time pressure.

## 3 — Route metadata and fingerprint

Every route starts with:

```text
Plan status: current | stale
Level: junior | middle | senior
Doctrine: practice/simulations/PLANNING.md
Coverage manifest SHA-256: <digest>
Progress snapshot: <SHA-256 of PROGRESS.md bytes>
Level status: open | closed ✅
Generated: YYYY-MM-DD
```

The coverage manifest is a deterministic list of `path<TAB>scope-digest`, sorted by path, for every
coverage file the route actually uses. Evidence markers are stripped with the coverage standard's
canonical rule before hashing. §1 stores it as a two-column `Coverage file | Scope SHA-256` table.
The manifest digest is SHA-256 over the UTF-8, LF-terminated, path-sorted
`path<TAB>scope-digest` rows. A later run can therefore name which input moved. `Progress snapshot` is
the SHA-256 of `PROGRESS.md`. A changed snapshot does not by itself prove the route stale, but the
opener must stop before an attempt and hand it to `/simulation-plan` for adjudication; a moved coverage
digest is hard stale.

## 4 — Required doctrine sections

1. `§0 — Session quick reference`: level, current step, current spec, next moment, timer, correction
   gate, last updated.
2. `§1 — Sources and ownership`: every input and every writer.
3. `§2 — The five moments`: open → generate/admit → timed attempt → cold review/correction → close.
4. `§3 — Status model`: `planned`, `ready`, `attempted`, `correction-required`,
   `reinforcement-required`, `closed ✅`, `blocked`.
5. `§4 — Attempt integrity`: no notes/docs/AI, timer rules, hint consequence, immutable timed verdict.
6. `§5 — Correction loop`: corrections are untimed, target only recorded gaps, and never rewrite the
   original verdict or time.
7. `§6 — Readiness gates`: common gate plus Angular, Spring Boot, and SQL-specific fences.
8. `§7 — MISTAKES and friction`: graded gaps vs friction-without-failure.
9. `§8 — Tracking`: route, tracker, spec header, MISTAKES, and PROGRESS ownership — the tracker's
   header and scale included, whose owner and text are section 8 of this standard, and its
   track-heading counts, whose meaning and two writers are there too.
10. `§9 — Level close and next gates`.
11. `§10 — Commit boundary`.
12. `§11 — Invariants`.

## 5 — Required route sections

### §0 — Current pointer

One compact table: current step, track, spec, state, time limit, next moment, blocking gate, last
updated. It is a copy and must be checked against §2/§3 and disk by `simulation-block-open`.

### §1 — Source manifest and readiness

List every coverage digest, the progress snapshot, relevant project/SQL evidence, and a readiness row
for each track: `ready`, `blocked`, or `not planned at this level`, with a falsifiable reason.

### §2 — Route table

One row per planned test:

| Step | Track | Spec | Difficulty | Time | Focus | Prerequisites | State | Timed verdict | Correction |

Rules:

- `Spec` is an existing admitted path or a planned two-digit path. No two rows share a path.
- `Focus` names 3–7 exact selected-level coverage bullets or concise clauses traceable to them.
- `Prerequisites` name evidence/gates, not vague confidence.
- **On a SQL row, `Prerequisites` names the SQL route §3 steps the spec demands, and no file outside
  this route states SQL readiness per test.** A spec demands a technique only where one of its mandatory
  `Queries to write` cannot be met without it, read off the `Evaluation` line that scores that query. A
  line accepting alternatives — a subquery *or* a window function — is met by any one of them, so it
  gates on the alternative whose step closes first; `Bonus` items are attempted only with time left
  over and gate nothing. The SQL route says what each step unlocks and which steps are closed, never
  which spec that blocks (invariant 6 holds the limit; this is how one spec is measured against it).
- **On the first Angular row and the first Spring Boot row of the route, `Prerequisites` names the
  short-exercise essential-route stages the spec uses** (Victor, 2026-10-21, `REC-382`: an area's first
  timed test waits for an adaptation period that is measured, not felt; from then on the tests are paced
  by one per completed round of the exercise rotation, `_practice-standard.md` §F, and no later row of
  the track names stages). It is written `{topic} essential stages 01–NN`, `NN` being the highest stage
  of `practice/exercises/{topic}/{LEVEL}/PLANNING-{LEVEL}.md` that lists a concept one of the spec's
  mandatory `What to build` items cannot be met without; the stages climb as a ladder, so every lower
  one is part of the gate, and `Bonus` items gate nothing. A track whose topic has no such plan names
  that plan as the missing prerequisite. Whether the stages are passed is never stored here or in a
  `State`: `simulation-block-open` reads it live (invariant 15), so the route moves on nothing a
  short-exercise grade does. The spec files declare no stages; the route alone does, as it does for SQL.
- A balanced junior route normally contains Angular, Spring Boot, and SQL. A blocked track remains
  visible with its gate; it is not silently replaced by extra work from an easier track.
- Existing pending specs are reused when they fit. The plan does not generate duplicates just to own
  the numbering.
- Failed and Assisted tests remain historical rows. Reinforcement is a new row/spec authored only by
  `/simulation-plan`, with `Redeems: <step>` and focus linked to the stable gap IDs recorded on that
  step. After mandatory corrections, those IDs resolve from MISTAKES Closed, not Open. An Assisted
  quality-Pass with no gap IDs reuses the original step's coverage focus.

### §3 — Step contracts

Each step contains:

```text
### Step N — <track>: <title> <state>
Spec: <path>
Generation: admitted-existing | pending-generation | generated YYYY-MM-DD
Redeems: — | <failed route step>
Time limit: <minutes>
Difficulty: standard | challenge
Coverage focus:
- <verbatim bullet or exact clause>
Readiness evidence:
- <source and falsifiable fact>
Done condition: Review recorded; timed verdict preserved; every required correction closed.
Review history: — | <date · verdict · time · correction state>
Reinforcement required: — | <SIM-NNNN IDs> | assisted-attempt
Redeemed by: — | <route step · date>
```

### §4 — Revision points and level close

At least one revision point follows every three reviewed tests. It draws first from open `MISTAKES.md`
rows, then recent friction.

**The level-close condition is defined here and nowhere else.** The level closes only when every planned
step is `closed ✅`, no correction is open **for this level**, and every track admitted by the route has
at least one Pass. Its clauses use the vocabulary of section 6 of this standard on purpose: a
*correction* is a step in `correction-required`, never a row read on its own — section 6 fixes when a
`MISTAKES.md` `## Open` row puts its step in that state, so the first two clauses check the same fact
from both ends. Two consequences follow from that wording and neither survives a paraphrase in row
vocabulary: `MISTAKES.md`'s `## Friction` rows never enter the condition — friction is dated evidence,
not a correction backlog — and a row recorded at another level never blocks this one, because rows are
stored `level:step`.

Everything else **points here**. Where a reader genuinely will not follow the pointer — the executing
`simulation-review-prompt.md` §5, doctrine §9, and the timed-simulation chain step in
`notes/prompts/README.md` — the restatement is diffed against this paragraph in the commit that touches
either side, because a paraphrase in row vocabulary moves the gate without announcing it. That is
exactly what `REC-074` found.

A Fail never counts as completed; a corrected Fail or reviewed Assisted attempt moves to
`reinforcement-required` and remains unchanged in timed statistics. When the
linked reinforcement step passes, the cold reviewer closes both the reinforcement step and the failed
step's learning state, records `Redeemed by`, and never changes the failed timed verdict or time. The
review that satisfies the final level condition writes `Level status: closed ✅`, repoints §0 to the
`/progress-update` audit gate, and reports that gate explicitly.

### §5 — Out of scope and deferred gates

Name coverage deliberately excluded at this level and blocked tracks with the exact event that reopens
them. Never hide deferred scope inside prose in a step.

## 6 — Review and correction semantics

Every `MISTAKES.md` `## Open` row a first review writes — one per unmet requirement and one per score-1
dimension, core or not — **is a mandatory correction row, whatever the timed verdict was**. A score-2
dimension is feedback in the review report and never becomes a row, so an open row always has a
correction behind it and the two are never counted separately. A step holding one of its own open rows is
`correction-required` and not `closed ✅`; that is what the Pass bullet below means for an attempt that
left a requirement unmet or scored 1 on a non-core dimension and still earned the verdict.

- `Pass`: closes the step when no mandatory correction remains.
- `Borderline`: the step is `correction-required` until a cold correction review closes every row the
  first review opened.
- `Fail`: same correction gate, then a new reinforcement step is required. Fixing the old solution does
  not convert the timed Fail into a Pass.
- `hint` breaks unaided conditions. The attempt may still be reviewed for learning, but its timed
  verdict is labelled `Assisted`, it moves through corrections when its quality verdict requires them,
  then becomes `reinforcement-required`; it never counts toward the level's Pass gate.

## 7 — Invariants

1. Generator focus, difficulty, count, and time come from the route, never free-form config.
2. Review resolves the step from the route before scoring.
3. Original verdict and time are immutable after first review.
4. Tracker, spec header, route, MISTAKES, and PROGRESS agree after a review.
5. A correction closes only recorded gaps and never increments completed simulations.
6. SQL scope never exceeds the techniques unlocked by the `closed ✅` steps of `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` §3, under the rule in SQL doctrine §8c.
7. A route never claims readiness from coverage alone.
8. Existing history is preserved across plan updates.
9. `simulation-block-open` and `simulation-block-close` ask zero questions and never start grading.
10. Victor's solution code is never edited or committed by the system.
11. Only `/simulation-plan` authors a reinforcement step; grading records the need and its stable gap IDs
    or `assisted-attempt` reason.
12. A reinforcement Pass closes its linked Fail/Assisted learning step without changing historical evidence.
13. `simulation-grade` is the only entry point that may dispatch a state-writing review or correction.
14. A `current` route is never attempted against a moved coverage manifest or unadjudicated progress snapshot.
15. An Angular or Spring Boot track's first step at this level — its first row under section 5, while
    that step's `Review history` records no attempt — is never attempted before every short-exercise stage its
    `Prerequisites` names is passed — every ID the stage lists passed or, a variant, waived, as
    `_practice-standard.md` §B → "Conditional variants" defines it, read off `practice/exercises/ATTEMPTS.md`
    and the `Kind` and `Concepts` of the plan rows the stage lists — and `simulation-block-open` checks
    it live before Moment 3. Later steps of the track are paced by the round cadence alone
    (`_practice-standard.md` §F).

## 8 — The tracker's header and scale

`practice/simulations/TRACKER.md` is the inventory of every spec and its recorded outcome. Its track
sections — one `##` heading and table per track — belong to their row writers — `/simulation-generator`,
`simulation-block-close` and `/simulation-review` — each of whose own text states the fields it writes
(generator §3, block-close §1, review §5). **Everything else in the file — the header
above the first track heading and the self-assessment scale below the last table — has one writer,
`/simulation-plan`**, which writes both to the text below on every update run and changes nothing in a
track section. The header only points. A tracker that tells Victor to time, review or mark an attempt
himself sends him around `simulation-block-open`, `simulation-block-close` and `simulation-grade`
(invariant 13), so it states no procedure of its own.

Each row's link to its spec is inventory and stays, because the generator's row contract writes it. A
link is not an entry point: which spec is current is the route's §0, read by `simulation-block-open`.

Each track heading is `## {Track} ({completed} / {total})`. Both counts cover **all inventory rows in
that track section, across levels**, a row with no Level included. `total` is the
number of spec rows, never the route target; `/simulation-generator` recounts it after registering a
spec and preserves the numerator. `completed` counts rows whose recorded timed `Status` is `Pass` or
`Borderline`, the same completed-attempt meaning as `simulation-review-prompt.md` §5's PROGRESS count.
Pending, awaiting-review, Fail and Assisted rows count zero, whatever their self-assessment or an
Assisted attempt's quality verdict. `/simulation-review` recounts the numerator from the whole affected
track table after every first review, preserving the denominator. Corrections and reinforcement
redemption never turn an old verdict into another completed attempt; a reinforcement spec counts only
through its own first review. The heading is a projection of recorded timed outcomes, never a count of
`closed ✅` learning steps or a level-close gate. Neither the block close nor the planner edits it.

The scale is the vocabulary `simulation-block-close` records and `simulation-review-prompt.md`'s
`SELF_ASSESSMENT` accepts. Its meanings describe the attempt and never prescribe what comes next —
reinforcement is `/simulation-plan`'s to author (invariant 11), and the order is the route's.

Header, from the first line of the file to the first track heading:

```markdown
# Technical Test Simulations — Tracker

Inventory of every timed-simulation spec and its recorded outcome — not a procedure. Open a block with
`simulation-block-open` ("vamos con una simulación"): it names the current test, its time limit and the
attempt conditions. `simulation-block-close` records the attempt and `simulation-grade` reviews it. The
rows are written by `/simulation-generator`, `simulation-block-close` and the review `simulation-grade`
dispatches — never by hand. The target this count serves is set in `ROADMAP.md` (its technical test
simulations section).

---
```

Scale, from the rule after the last track table to the end of the file:

```markdown
---

## Self-assessment scale

The value you state when you close an attempt. The reviewed verdict goes in the `Status` column.

| Score | Meaning |
|-------|---------|
| ✅ Solid | Finished before time, all requirements met, clean code |
| 🔧 Good | Finished in time, minor gaps or rough edges |
| ⚠️ Weak | Did not finish or had significant gaps |
| ❌ Failed | Could not build a working solution |
```
