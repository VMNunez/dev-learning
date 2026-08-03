# SQL Plan Prompt

Create or reconcile the persistent exercise-route plan for the SQL track at one professional level.
This prompt plans only. It never generates an exercise, never grades one, never edits a `.sql` file,
and never touches the SQL notes, interview Q&A or simulations.

It is to `sql-exercises` what `notes-plan-prompt.md` is to `notes-audit`: it turns a coverage level into
an ordered, justified route of steps, and `sql-exercises` consumes one step of that route per run.

> **▶ Run first:** `coverage-prompt` for `TOPIC = sql` at this exact level — the coverage file is the
> input this plan maps, and it refuses to proceed when it is missing or differs from the global mirror.
> `coverage-verify` is recommended but **advisory**: it reports whether the coverage is complete for the
> job target. A consumed `superseded` verdict records a completed review cycle; a missing, stale, or open
> `gaps` verdict is recorded without stopping the run.

## Configuration

```text
LEVEL = [junior | middle | senior]
MODE  = [update | dry-run]
```

One execution handles exactly one level. `LEVEL = all` is unsupported.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use canonical roles and reasoning tiers from the runtime standard. Any delegated analysis is read-only.
If a required role cannot be dispatched, stop unless its instruction explicitly permits a local fallback.

## Paths

- `COVERAGE = notes/sql/coverage/{LEVEL}.md`
- `VERIFY = notes/sql/coverage/verify-{LEVEL}.md`
- `GLOBAL_MIRROR = notes/coverage/{LEVEL}.md` (its SQL section)
- `DOCTRINE = practice/sql/PLANNING.md`
- `PLAN = practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`
- `EXERCISE_DIR = practice/sql/{LEVEL}/` at every level
- `MISTAKES = practice/sql/MISTAKES.md`
- `STANDARD = notes/prompts/practice/sql/_internal/_sql-plan-standard.md`
- `CONTEXT = notes/prompts/_internal/_shared-context.md`
- `ROADMAP = ROADMAP.md`

`PLAN` is a committed source of truth. It is not a temporary worklist.

**Two files, one plan.** `DOCTRINE` holds the level-neutral half — the step loop, the done-condition
formats, the closing ritual, the branch rules, the revision-point mechanism, the quality gates, the
invariants, the closure condition, the out-of-scope fence. `PLAN` holds the level's own route — its
exercise files, its steps, its progress table. **This prompt writes `PLAN` only.** A finding about
`DOCTRINE` is reported, never fixed here; `sql-plan-audit` owns that file.

## Guards

0. **Run-start check.** Execute the check in `notes/prompts/_internal/_pipeline-self-report.md` — read
   `notes/prompts/practice/sql/_internal/_last-run-report-sql-plan.md` (it may not exist yet; skip
   silently) and, if its `Status:` line says `open`, surface the finding in **one line** to Victor and
   continue. Never apply it here.
1. Read the active adapter, `_session-rules.md`, `CONTEXT`, `STANDARD`, `COVERAGE`, `DOCTRINE`, and — when it
   exists — `PLAN`. Follow the repository's line-count and read-to-EOF rule on each; `DOCTRINE` and
   `PLAN` are long files and a partial read is how a step's history gets silently dropped.
2. Inventory `EXERCISE_DIR`: every exercise file, and per file its three counts, using **these exact
   commands** — both header formats live on disk and a pattern matching neither returns `0`, which
   would then be written into the plan as real:
   ```
   grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' {file}   → written
   grep -cE '^--.*✅ Corregido' {file}                      → scored
   ```
   If `scored > written` for any file, stop and report it rather than propagating it.
3. Stop on `main`.
4. Stop if `COVERAGE` is missing, or if it differs from the SQL section of `GLOBAL_MIRROR`.
5. Read `VERIFY` but never stop on it. Its verdict is history: an open `gaps` verdict, a `superseded`
   one, or no `VERIFY` file at all all continue planning identically. Report the verdict you read and
   move on. Zero gaps is never required before planning, and this prompt never requests another
   verification.
6. For `middle`, require every step of `PLANNING-junior.md` to be closed. For `senior`, require junior
   and middle. Planning a later level is blocked exactly as authoring it would be.
7. Preserve unrelated working-tree changes.

## The one-time legacy migration — junior only

Before building any entry, check whether `DOCTRINE` still contains the level route. Until this
migration runs, `practice/sql/PLANNING.md` is a single 1000-line file holding both halves.

Run this stage **only** at `LEVEL = junior`, and only when `PLAN` does not yet exist:

1. Move **Section 5**, **Section 6** and **Section 8** out of `DOCTRINE` and into `PLAN`, **verbatim** —
   every step's `Why here`, `Concepts`, `Q&A seed` and `Done` line, every count in the file tables,
   every status in the progress table, every dated annotation. This prose was written by hand and
   justifies a route that works; it is migrated, not regenerated. Renumber the sections in `PLAN` as
   §1 (files), §2 (steps), §3 (progress) and add the plan header below. Two normalisations are allowed
   on the way through, and only these two: the legacy route writes a closed step as `done ✅`, which
   becomes `closed ✅` — the three §3 values are the format's, and a fourth spelling silently breaks
   every status check downstream; and migrated coverage bullets, which carry no checkbox at all, arrive
   as `- [ ]`, since no scored exercise has been recorded against a specific bullet yet. Neither
   normalisation may change which steps are closed.
2. Leave every other section in `DOCTRINE`, unchanged, and add one line under each moved section's old
   position pointing at `PLANNING-{LEVEL}.md`. Cross-references from `DOCTRINE` §4, §8b, §9, §10 and
   §Z into "§5/§6/§8" are rewritten to name the level file's new section number. This is the only edit
   to `DOCTRINE` this prompt may ever make, and it happens once.
3. Fix the two dead paths on the way through: `DOCTRINE` §1 and §4 point at `notes/sql/coverage.md`,
   which no longer exists. The file is `notes/sql/coverage/{LEVEL}.md`.
4. Then continue with the normal algorithm below, which reconciles the migrated route against
   `COVERAGE`. Every migrated step is `Action: audit`; nothing migrated starts as `create`.

Report the migration as `migrated N steps · M exercise files · doctrine reduced from X to Y lines`. If
`DOCTRINE` no longer holds a route, say `migration already done` in one line and continue.

## Coverage fingerprint

Calculate the lowercase SHA-256 digest of `COVERAGE`'s **scope bytes** — its exact UTF-8 bytes with
every trailing ` ✅ NN-slug — {evidence}` evidence marker stripped, using the canonical command in
"Evidence markers" in `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`. Markers record
where a concept was demonstrated, not what the scope is, so a closed project step must never make a
current plan look stale.

`PLAN` stores it as:

```text
Coverage SHA-256: <64 lowercase hexadecimal characters>
```

`sql-exercises` recalculates this value at the start of every `practice` run. A mismatch means the plan
no longer maps the whole checklist, and the exercise generator says so in one line rather than stopping —
generating from a slightly stale route is not a correctness failure the way generating from a missing
step is.

## Exercise-file numbering across levels

Every level takes its own directory and its own sequence from `01`. There is no flat level, and no
level's numbering collides with another's — the isolation is the folder, not the number:

```text
practice/sql/junior/01-basics.sql
practice/sql/middle/01-....sql
practice/sql/senior/01-....sql
```

**Junior's existing files are never renumbered** — they are Victor's authored work and several are
closed. They were relocated into `junior/` once, wholesale, when the layout was made symmetric
(2026-08-03); nothing renames them again.

The level's route file lives with its exercises: `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`. Revision
files likewise: `practice/sql/{LEVEL}/R{n}-repaso.sql`. Two files stay at `practice/sql/` root because
neither belongs to a level — `PLANNING.md`, the level-neutral doctrine, and `MISTAKES.md`, one shared
log for the whole track: a concept failed at junior and re-failed at middle is one row, not two.

## Planning algorithm

1. Read every coverage bullet in `COVERAGE` and preserve its exact text.
2. Read `STANDARD` Sections B, C and D in full. They are the bar this plan is built to, not a checklist
   applied afterwards.
3. Build the route by **dependency, then by what a screening asks first** (B1, B2). Every step's
   position carries a one-sentence `Why here` that names what it needs from an earlier step, or why the
   objective pulls it forward. "Next in the coverage file" is not a reason. The objective is not a
   slogan: `CONTEXT` states the role being targeted and the timeline, `ROADMAP` the gate this level
   feeds. A step pulled forward "because it comes up in interviews" must name **which** target that is.
4. Assign every coverage bullet of the selected level to exactly one step (invariant 1). A bullet this
   level deliberately does not drill goes under `## Out of scope at this level` with a reason, never
   silently dropped. Never paraphrase a coverage bullet in the assignment list.
5. Do not assign bullets from either sibling level.
6. Respect the declared ceilings: **no generation run over 12 exercises, no step over 22**. A step above
   the run ceiling is split into runs, and each run gets its own `Moment 2 config` line. Two runs
   sharing a `TOPIC` must each state their exercise range — that range is the only thing on disk that
   tells `sql-exercises` which run it is being asked for.
7. Prefer an existing exercise file when its topic matches the group. A file whose setup block no longer
   matches the canonical schema is **closed, not extended** (invariant 11): the next step starts a fresh
   file with its own setup block.
8. Give every step the complete field set from `STANDARD` Section C — including the literal
   `**Moment 2 config:**` line carrying `COUNT = n` and the literal `**Focus:**` line, because those two
   strings are what `sql-exercises` greps for. A step stating the same information in prose resolves to
   nothing and stops that run.
9. Every step ends in a **`**Q&A seed:**` line** (B5) and a **done condition in a `DOCTRINE` §3 format,
   written out verbatim** (B6, invariant 7). `Review: ... ≥ 80% on X.sql` is not the format;
   `Review: sql-grade scores ≥ 80% on X.sql` is. The seed is **not** a done condition and closes nothing
   — it is a question handed to the interview-prep track (`DOCTRINE` §Z). The `Aloud:` format and the
   two-condition rule were removed on 2026-08-03; a step closes on its scored condition alone.
10. Place a **revision point every three exercise files** (B4, invariant 8), each drawing its focus from
    the open rows of `MISTAKES`, each writing to its own uncounted file. A revision batch never counts
    toward a target and never flips a status.
11. The level's last step is an **integration step under time pressure** (B8): requirements in prose, no
    new syntax, timed.
12. Validate the complete route: no step may rely on a later one; every step's `Reinforces` names a real
    earlier step and the concrete concept it reuses; the counts in the file table, the step entries and
    the progress table agree with each other and with the Guard 2 inventory.

## Status is read, never invented

A step's status belongs to the exercise track, not to this planner. `sql-exercises` in `review` mode is
what moves a step to closed, and only a **scored** count does it.

- Derive each status from the Guard 2 counts and the existing `PLAN`: `not started` · `in progress ⏳` ·
  `closed ✅`.
- **Never downgrade one.** A step marked closed before this run is still closed after it, whatever the
  reconciliation did to its bullet set. Renumbered or reworded is fine; unmarked or downgraded is a
  failure, and the history gate below catches it.
- A closed step that gains coverage bullets stays closed and lists the newly owed bullets under its own
  `Pending additions:` field. Those bullets are what a later reinforcement run drills; they do not
  reopen a step whose exercises were already answered and graded.
- Never renumber a closed step.

**The `[x]` checkboxes are read too, and by the same rule.** `sql-exercises` in `review` mode marks a
bullet the moment a scored exercise has drilled it — it is the only prompt that knows which bullet a
given exercise tested, because it is the one that generated it. This planner **never sets a `[x]` and
never clears one**. It writes `[ ]` on bullets it is adding to a step for the first time, carries every
existing checkbox across verbatim through any reconciliation — renumbering, rewording, regrouping — and
lets the history gate below catch a lost one. The Guard 2 counts are per file and can never say which
bullet a scored exercise drilled; a planner that derives checkboxes from them is inventing progress.

## Cold route review

After drafting or reconciling the complete plan, dispatch **one cold reviewer**, `reasoning tier: deep`,
`execution: foreground`. Give it only `COVERAGE`, `STANDARD` Sections B and C, `DOCTRINE` §3, the
objective as `CONTEXT` and `ROADMAP` state it, the exercise-file inventory from Guard 2, and the
proposed plan. Those two extra inputs are not background: §3 holds the done-condition formats, so
without it the reviewer can only check that a `Done` line looks plausible rather than that it is one of
the formats; and the objective is the only thing that can falsify a `Why here` claiming it pulls a step
forward. It does not edit files. It must challenge:

- whether every step's `Why here` survives contact with the step before it, or is a label;
- whether a step could have been done first — which would mean it teaches nothing about composition (B3);
- steps grouped around a coverage section name rather than one drillable skill;
- concepts an exercise would need before the step that teaches them;
- `Q&A seed` questions that test recognition instead of retrieval;
- done conditions another person could not run and get the same verdict from (B6);
- whether the revision cadence actually holds at every third file (B4);
- whether the route, drilled in order, produces someone who passes the SQL half of a screening at this
  level.

Acceptance proof must include `N steps reviewed`, an explicit dependency-order verdict, a ceiling
verdict, and every proposed correction. Re-dispatch once if that proof is absent. Apply accepted
findings, then repeat exact coverage assignment and route validation. If the reviewer cannot be
dispatched or fails twice, stop; there is no single-agent fallback.

## Required plan format

````markdown
# SQL Junior Exercise Plan

Plan status: current
Level: junior
Coverage: notes/sql/coverage/junior.md
Coverage SHA-256: <digest>
Doctrine: practice/sql/PLANNING.md
Generated: YYYY-MM-DD

## §1 — Exercise files

| File | Step(s) | Written | Answered | Scored | First-pass target | Status |
|------|---------|---------|----------|--------|-------------------|--------|
| `01-basics.sql` | 0 | 40 | 40 | 20 | 20 | closed |

### Revision files

| File | Point | Span (steps) | Status |
|------|-------|--------------|--------|
| `R1-repaso.sql` | R1 | 0–1 | sin crear |

## §2 — The steps

### Step 0 — Querying basics ⏳

**Why here:** one sentence naming what it needs from the previous step, or why the objective pulls it forward.
**Exercises:** practice/sql/junior/02-execution-order-set-ops.sql — 10
**Coverage:** verbatim section names from notes/sql/coverage/junior.md
**Reinforces:** which earlier step, through which concept — or `— (first step)`
**Moment 2 config:** `TOPIC = basics`, `COUNT = 10`
**Focus:** the concepts to narrow onto, or `none — the whole topic`
**Concepts:** the concrete list this step drills

**Coverage bullets:**

- [ ] exact coverage bullet
- [x] exact coverage bullet

**Pending additions:** none

**Q&A seed:** one question worth handing to the interview-prep track — closes nothing here
**Done:** a §3 format from the doctrine, written out in full

## §3 — Progress

| Step | Topic | Exercises file | Scored / target | Status |
|------|-------|----------------|-----------------|--------|
| 0 | Querying basics | `01-basics.sql` + `02-...` | 20 / 30 | in progress ⏳ |

## Out of scope at this level

- exact coverage bullet — concise reason this level does not drill it
````

Rules:

- Step headings are unique and ordered numerically. A closed step is never renumbered.
- `Status` in §3 is exactly `not started`, `in progress ⏳`, or `closed ✅`.
- Every `Coverage bullets` line is exactly `- [ ] {exact bullet}` or `- [x] {exact bullet}`. The checkbox
  is plan metadata, stripped before exact matching against `COVERAGE`; trailing evidence markers are
  handled by the normal scope-byte rule. `[x]` means a scored exercise has drilled it, written by
  `sql-exercises` and only preserved here — see "Status is read, never invented".
- `Pending additions` is `none` or bullets quoted verbatim from `COVERAGE`. It is meaningful only on a
  closed step.
- No coverage bullet may be absent, duplicated, paraphrased, or assigned to two steps.
- Every path is repository-relative and inside this level's `EXERCISE_DIR`.
- `Why here`, `Reinforces`, `Focus`, `Concepts`, `Q&A seed` and `Done` are non-empty and specific.
  `none — the whole topic` is a value for `Focus`; a blank line is a finding.
- The plan **names** the exercise prompt and points at it. It never describes exercise content, the
  difficulty split or the file format — `STANDARD` Section E decides who owns what.
- Nothing about notes, interview Q&A or simulations appears here. That fence is the point of this track.

## History gate

Before writing anything, take a verbatim copy of the existing `PLAN`'s §1 and §3 count rows, every
status marker, and every §2 checked bullet. After the reconciliation, compare:

- every step closed before the run is still closed;
- every scored count is **≥** what it was;
- every closed step keeps its number;
- no bullet went from `[x]` back to `[ ]`.

The counts on disk never move in this run — this prompt does not touch a `.sql` file — so a gate that
only re-greps disk checks nothing. On failure, fix it and re-check once; if it still fails, **abort
without committing**, leave the working tree, and report exactly what was lost. A plan that loses the
record of completed work is worse than an unplanned one.

## Update mode

Write `PLAN`, plus the one-time `DOCTRINE` split when the migration stage ran, plus **`{LEVEL}`'s two
tables in `PROGRESS.md`** → `## Practice completed` → `### Exercise route`. Do not touch a single `.sql`
file or `MISTAKES`.

**Why this prompt owns those tables (2026-08-03).** They are a projection of §5: one row per file of the
route, with its step and its first-pass target, *including the files not written yet*. Nobody else can
seed them — the exercise prompts see one file at a time — and a table that only lists what exists hides
exactly what is left to do. So:

- **`{LEVEL}`'s detail table** — one row per §5 file, in step order: `Step`, `File`,
  `Corrected` = `—`, `First-pass / target` = `0/{§5 target}`, `Status` = `not created`. Never collapse
  pending files into a summary row.
- **`{LEVEL}`'s roll-up row** — `Corrected` and `Route progress` at `0/{sum of §5 targets}`,
  `Steps closed` at `0/{§3 step count}`.
- **Both `Total` rows** — the last row of each table. The roll-up's totals every level's figures (so a
  newly planned route raises the shared denominator without touching another level's row); the detail
  table's totals that level's files. Recompute them from the rows above; never carry a stale total.
  **`Corrected` has no total in either table — its cell stays `—`.** It is a correction backlog that
  rises on generation and falls on grading, so an aggregate of it measures nothing actionable. Leave
  the dash; do not "fix" it by computing a sum.

**Preserve every figure already there.** A replan keeps each existing row's `Corrected`,
`First-pass / target` numerator and `Status`; it only adds rows for new files, updates targets the
replan changed, and recomputes the roll-up denominators. A cell that says `40/40` is graded work and is
never reset — same discipline as the History gate above, which rejects a plan that loses completed work.
Write only `{LEVEL}`'s rows; another level's tables are not yours to touch.

Before staging and before committing, run `git status --short`; stage only these declared outputs. Commit
the plan and PROGRESS.md **separately** — the route and its projection are two logical changes:

```text
docs(sql): plan {level} exercise route
```

```text
docs(progress): seed the {level} exercise route table
```

`PLANNING-{LEVEL}.md` is machinery, not Victor's work — a tracking document this pipeline authors, so
the shared session rules' auto-commit exception covers it exactly as it covers a project `PLANNING.md`.
**The exercise files are Victor's and are never staged.**

Dry run prints the complete proposed plan and reconciliation summary without writing or committing.

After the commit, execute `_pipeline-self-report.md`: write
`notes/prompts/practice/sql/_internal/_last-run-report-sql-plan.md`, update the `SQL plan {J|M|S}` cell in
`notes/prompts/_internal/_run-tracker.md`, and commit the report and tracker together. Dry run does not
write `PLAN`, but it still writes and commits its self-report plus a `dry-run` tracker outcome.

**A blocked run reports too.** Every stop after configuration and target resolution — a Guard that
fired, a cold reviewer that failed twice, a history gate that aborted — still writes the self-report and
a `blocked` tracker outcome naming the failed gate, then commits the two together. The abort leaves
`PLAN` untouched; it does not leave the run invisible. A history-gate abort is the single most valuable
entry this file can carry, and it is the one a stop-and-exit would silently discard.

## Final report

Report level, coverage fingerprint, the `VERIFY` verdict as read (never prescribe repeated verification
until zero gaps), migration outcome, step count, exercise-file count, total first-pass exercises,
assigned/unassigned bullet counts, checked/unchecked bullet counts, closed steps preserved, every closed
step carrying `Pending additions` with its count, revision-point cadence verdict, ceiling verdict,
dependency-order verdict, mirror parity, cold-review completion, history-gate verdict, any `DOCTRINE`
finding left for `sql-plan-audit`, and commit or `dry-run`.
