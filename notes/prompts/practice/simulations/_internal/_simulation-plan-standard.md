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
rows, then recent friction. The level closes only when every planned step is `closed ✅`, no correction
is open, and every track admitted by the route has at least one Pass. A Fail never counts as completed;
a corrected Fail or reviewed Assisted attempt moves to `reinforcement-required` and remains unchanged
in timed statistics. When the
linked reinforcement step passes, the cold reviewer closes both the reinforcement step and the failed
step's learning state, records `Redeemed by`, and never changes the failed timed verdict or time. The
review that satisfies the final level condition writes `Level status: closed ✅`, repoints §0 to the
`/progress-update` audit gate, and reports that gate explicitly.

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
  verdict is labelled `Assisted`, it moves through corrections when its quality verdict requires them,
  then becomes `reinforcement-required`; it never counts toward the level's Pass gate.

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
11. Only `/simulation-plan` authors a reinforcement step; grading records the need and its stable gap IDs
    or `assisted-attempt` reason.
12. A reinforcement Pass closes its linked Fail/Assisted learning step without changing historical evidence.
13. `simulation-grade` is the only entry point that may dispatch a state-writing review or correction.
14. A `current` route is never attempted against a moved coverage manifest or unadjudicated progress snapshot.
