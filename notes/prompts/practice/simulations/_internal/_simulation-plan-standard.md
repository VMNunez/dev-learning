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
- `practice/simulations/TRACKER.md`, `MISTAKES.md`, and all existing specs as inventory and evidence.

Coverage defines possible scope. Evidence and gates define what is ready now. A plan must never turn an
unmarked coverage bullet into a claim that Victor can perform it under time pressure.

## 3 — Route metadata and fingerprint

Every route starts with:

```text
Plan status: current | stale
Level: junior | middle | senior
Doctrine: practice/simulations/PLANNING.md
Coverage manifest SHA-256: <digest>
Progress snapshot: <git blob hash or SHA-256>
Generated: YYYY-MM-DD
```

The coverage manifest is a deterministic list of `path<TAB>scope-digest`, sorted by path, for every
coverage file the route actually uses. Evidence markers are stripped with the coverage standard's
canonical rule before hashing. The manifest itself appears in §1 so a later run can name which input
moved. `Progress snapshot` detects changed readiness, but it does not make the route stale by itself:
the opener reports the drift and `/simulation-plan` decides whether sequencing must change.

## 4 — Required doctrine sections

1. `§0 — Session quick reference`: level, current step, current spec, next moment, timer, correction
   gate, last updated.
2. `§1 — Sources and ownership`: every input and every writer.
3. `§2 — The five moments`: open → generate/admit → timed attempt → cold review/correction → close.
4. `§3 — Status model`: `planned`, `ready`, `attempted`, `correction-required`, `closed ✅`, `blocked`.
5. `§4 — Attempt integrity`: no notes/docs/AI, timer rules, hint consequence, immutable timed verdict.
6. `§5 — Correction loop`: corrections are untimed, target only recorded gaps, and never rewrite the
   original verdict or time.
7. `§6 — Readiness gates`: common gate plus Angular, Spring Boot, and SQL-specific fences.
8. `§7 — MISTAKES and friction`: graded gaps vs friction-without-failure.
9. `§8 — Tracking`: route, tracker, spec header, MISTAKES, and PROGRESS ownership.
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
- A balanced junior route normally contains Angular, Spring Boot, and SQL. A blocked track remains
  visible with its gate; it is not silently replaced by extra work from an easier track.
- Existing pending specs are reused when they fit. The plan does not generate duplicates just to own
  the numbering.
- Failed tests remain historical rows. Reinforcement is a new row/spec, linked to the gaps it targets.

### §3 — Step contracts

Each step contains:

```text
### Step N — <track>: <title> <state>
Spec: <path>
Generation: admitted-existing | pending-generation | generated YYYY-MM-DD
Time limit: <minutes>
Difficulty: standard | challenge
Coverage focus:
- <verbatim bullet or exact clause>
Readiness evidence:
- <source and falsifiable fact>
Done condition: Review recorded; timed verdict preserved; every required correction closed.
Review history: — | <date · verdict · time · correction state>
```

### §4 — Revision points and level close

At least one revision point follows every three reviewed tests. It draws first from open `MISTAKES.md`
rows, then recent friction. The level closes only when every planned step is `closed ✅`, no correction
is open, and every track admitted by the route has at least one Pass. A Fail never counts as completed;
a corrected Fail remains a Fail in timed statistics but may close its learning step after a separate
reinforcement test passes.

### §5 — Out of scope and deferred gates

Name coverage deliberately excluded at this level and blocked tracks with the exact event that reopens
them. Never hide deferred scope inside prose in a step.

## 6 — Review and correction semantics

- `Pass`: closes the step when no mandatory correction remains.
- `Borderline`: opens correction rows for every score-1 dimension and unmet requirement; the step is
  `correction-required` until a cold correction review closes them.
- `Fail`: same correction gate, then a new reinforcement step is required. Fixing the old solution does
  not convert the timed Fail into a Pass.
- `hint` breaks unaided conditions. The attempt may still be reviewed for learning, but its timed
  verdict is labelled `Assisted` and it does not count toward the level's Pass gate.

## 7 — Invariants

1. Generator focus, difficulty, count, and time come from the route, never free-form config.
2. Review resolves the step from the route before scoring.
3. Original verdict and time are immutable after first review.
4. Tracker, spec header, route, MISTAKES, and PROGRESS agree after a review.
5. A correction closes only recorded gaps and never increments completed simulations.
6. SQL scope never exceeds doctrine §8c's unlocked techniques.
7. A route never claims readiness from coverage alone.
8. Existing history is preserved across plan updates.
9. `simulation-block-open` and `simulation-block-close` ask zero questions and never start grading.
10. Victor's solution code is never edited or committed by the system.

