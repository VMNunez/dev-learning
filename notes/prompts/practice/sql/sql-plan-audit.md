# SQL plan audit — the entry point for keeping the SQL exercise plan good

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It audits and extends the SQL practice plan against
`_sql-plan-standard.md`, fixes what falls short, and commits — hands-off.

Why it exists: the projects have `plan-audit` and the concept lists have `coverage-audit`, but the
files that decide what gets drilled in the daily SQL block rot fastest — every closed step, every new
coverage section and every prompt change leaves them slightly less true.

**The plan is two files** (`_sql-plan-standard.md`, Section A) and this prompt audits both:

- `practice/sql/PLANNING.md` — **the doctrine**, level-neutral. This prompt owns its **rules** outright.
  It does not **author** §0's live values — the grading subagent writes them the moment a step closes and
  `sql-step-close` verifies them — but it does **correct** them: specialists 3 and 4 reconcile §0 against
  the route under invariants 5 and 6 and fix what disagrees, in place, like any other finding.
  `_sql-plan-standard.md` Section E carries the full writer set.
- `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` — **the route** for the selected level. Written by
  `sql-plan-prompt`; audited, corrected and extended here.

**Run it whenever:** a step closes · `notes/sql/coverage/{LEVEL}.md` grows · the exercise prompt changes ·
or the plan simply feels out of date. It is safe to run repeatedly; a clean plan comes back unchanged.

> **▶ Run first:** `sql-plan-prompt` for this level, at least once — a route file that does not exist is
> reported, never written from nothing (see Hard rules). A stale `PROGRESS.md` is a finding, not a
> prerequisite.

> **Run-start check (step 0a):** execute the decision table in
> `notes/prompts/_internal/_pipeline-self-report.md` against `_last-run-report-sql-plan-audit.md`.
> Never restate the shared `Status:` meanings here. If the file does not exist, say "first run of this
> prompt" in one line and continue — its absence is expected, not a failure.

**Internal pieces** (never launched directly): `_sql-plan-standard.md` (the bar) ·
`notes/prompts/_internal/_pipeline-self-report.md` (the final step). Each specialist's mandate is its slice of
the standard, given in the dispatch below — four slices of one standard do not justify a fifth file.

**Scope fence, and it is the point of this prompt.** The SQL plan covers **exercises only**. Notes,
interview Q&A and simulations are separate tracks Victor runs himself; the plan may mention they exist
in its §Z and nothing more. Any moment, gate, file table or done condition in the plan that schedules
one of them is **removed**, not preserved. This flow likewise never runs, schedules or edits them.

---

## How to use

Open a fresh chat inside the supported agent runtime and paste the config block.

```
SCOPE = full
LEVEL = junior
```

- `SCOPE = full` — the normal run: all four specialists.
- `SCOPE = extend` — only reconcile with `notes/sql/coverage/{LEVEL}.md` and add the steps it now needs
  (specialists 2 and 1, in that order — the same first two of a full run). Use after a
  `coverage-audit` run added sections.

---

````
## Configuration — edit only this block

SCOPE = [full | extend]
LEVEL = [junior | middle | senior]

The files under audit are always `practice/sql/PLANNING.md` (the doctrine) and
`practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (that level's route). There are no other targets. `LEVEL` defaults
to `junior` when left blank.

**A doctrine finding is level-neutral by definition.** If a fix to `PLANNING.md` is only correct at the
selected level, the fix belongs in the route file instead — that asymmetry is the signal that a section
was put on the wrong side of the split.

---

You are the orchestrator. You stay light: dispatch, wait, collect, gate, commit. **You never audit the
plan in your own context and you never read the standard** — the moment you start judging, the
cold-reviewer property is gone.

> **Branch guard (step 0b, right after the run-start check):** `git branch --show-current`. Study materials commit on the active branch
> (the shared session rules). On **`main`**, stop and ask Victor which branch to use.

## Phase 1 — Evidence snapshot (orchestrator, counts only)

Gather the ground truth the specialists check the plan against. Counts, never contents:

- `ls practice/sql/{LEVEL}/` — the files that exist. **The level's directory, never `practice/sql/`**
  (invariant 13: every level owns a folder, no level is flat). Listing the root returns `junior/`,
  `PLANNING.md` and `MISTAKES.md` and not one exercise file, which reads as "the route declares files
  that do not exist" and is the single fastest way to make this pipeline delete a real route.
- Per exercise file, **these exact commands** — both header formats live on disk, and a pattern that
  matches neither returns `0`, which `counts-and-truth` would then write into the plan as real:
  ```
  grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' practice/sql/{LEVEL}/NN-name.sql   → written
  grep -cE '^--.*✅ Corregido' practice/sql/{LEVEL}/NN-name.sql                      → scored
  ```
  The marker always sits **at the end of the exercise's header line**, one per exercise, in both header
  formats (`_sql-exercises-review.md` Step 2b forbids it on a line of its own). If scored > written for
  any file, the count is wrong: stop and report it rather than propagating it.
- `grep -n "✅\|⏳\|done\|in progress" practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` → the status baseline for the gate.
- **The route's own count rows, copied verbatim**: its §1 file table and its §3 progress table. These
  are the numbers the history gate protects — the numbers on disk cannot regress, since this flow
  never touches the exercise files, so a gate that only re-greps disk checks nothing.
- `grep -n "^## " notes/sql/coverage/{LEVEL}.md` → the current section list.
- **The route's `Coverage SHA-256` against a freshly recalculated one** (invariant 12, canonical command
  in `_coverage-standard.md`). A mismatch is **reported, never repaired here**: recomputing the digest
  without remapping the bullets would erase the only signal that `sql-plan-prompt` is owed a run. Say
  `route stale — /sql-plan {LEVEL} owed` in the final report and let specialist 2 handle the bullets it
  can see.

Hand this snapshot to specialists 2 and 3. It is evidence, not a finding: the plan is wrong only where
it disagrees with it.

## Phase 2 — Specialists, one concern each, sequential

They edit the same two files, so they own **one concern each, never a section each**. Dispatch in **this order — 2 → 1 → 3 → 4** —
waiting for each. None commits. `SCOPE = extend` runs the first two only, so it is a strict prefix of
a full run, not a different sequence.

**Why the extension engine goes first.** #2 is the only specialist that *writes new steps*, and #1 is
the one that audits a step's shape and justification (Section B, Section C). Run #1 first and every
step born in this run ships unreviewed — the one ripple re-dispatch allowed per concern is not a
substitute for reviewing work that did not exist yet. #3 and #4 follow because counts and prompt paths
are only true of the final set of steps.

For each, launch a fresh `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`:

> Read `notes/prompts/practice/sql/_internal/_sql-plan-standard.md` — **only the sections your concern owns**, listed
> below — and audit `practice/sql/PLANNING.md` (the doctrine) and `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md`
> (the route) against them. Fix what falls short **directly in the file your `Edits` column names, and
> in no other**. Do **NOT** commit. Return a **check-by-check trace**: one line per check you own,
> `check · verdict · what you changed (or "no change")`. Never paste plan content back. End with any
> cross-concern ripple the orchestrator must reconcile.
>
> **Read-to-EOF guard:** run `wc -l` on the plan first; if it is near or over 2000 lines, read it in
> passes with `offset` to the real end. Open your report with "N lines, read to EOF" — a report
> without that line is rejected.
>
> **If you cannot finish**, stop and open your report with `BLOCKED — <reason>` instead, naming which
> of the two plan files you already wrote to and which sections. You edit them directly and never
> commit, so that line is what stops your half-applied fixes being committed as an audited plan. Do not
> pad a trace with `blocked` rows to satisfy the row count.

| # | Concern | Owns | Edits | Also reads |
|---|---------|------|-------|------------|
| 1 | `learning-design` | **Section B** (all ten) · **Section C** (every step has every field) | route §2 | doctrine §2, §3, §7 · route §2 · `ROADMAP.md` (for B2) |
| 2 | `coverage-and-steps` | **Invariants 1, 2, 10, 14** · **B10** | route §1, §2, its out-of-scope list | `notes/sql/coverage/{LEVEL}.md` · doctrine §Z · the Phase 1 section list |
| 3 | `counts-and-truth` | **Invariants 3, 4, 5, 11, 13, 15** | route §1, §2, §3 · doctrine §0 · **never `PROGRESS.md`** | `PROGRESS.md` · **the Phase 1 snapshot** |
| 4 | `loop-and-fence` | **Section A1 and A2** — every section present **and satisfying its own "Must contain" column**, row by row, not merely non-empty · **Invariants 6, 7, 8, 9, 12** · **Section E** | **the doctrine — any section** · route header (metadata only) | `sql-exercises-prompt.md`, `sql-plan-prompt.md` |

**The `Edits` column is a fence, not a hint.** Two files are open and four specialists run against them;
a specialist writing outside its column is how the doctrine acquires a level-specific sentence. #1 and
#2 never touch the doctrine at all. #4 owns the **whole** doctrine — the other rows' sections are
exhaustive, its are not — and touches the route only to check its header
metadata is present and well-formed — it never edits a step.

**`PROGRESS.md` is read-only for this pipeline.** Invariant 15 is audited here, never repaired here: the
standard's Section E gives the route's projection to `sql-plan-prompt` (seeds and re-syncs it) and
`sql-exercises-prompt` (moves the counts). #3 reports a broken or stale projection as a finding — naming
the level and the exact rows that disagree with the route's §1 — and closes with "run `/sql-plan
{LEVEL}` to re-sync the projection". This is the one place where the "findings are fixed in place" rule
yields to the ownership fence, because the fix belongs to a prompt that sees §1 as its own output.

**Inside the route, #3 edits structure, never values.** Section E gives `§1` counts, `§3` statuses and
`§2` `[x]` bullets to `sql-exercises-prompt` in review mode: **only a scored exercise moves them.** #3
may add a missing row, a missing column or a missing field, and it may recompute a `Total` from the rows
above; it may never lower a numerator, reset a `40/40`, or flip a `closed ✅` back. A figure that looks
wrong is a finding against the grading run, not a cell to correct.

**The invariant numbers are the standard's Section D numbers, and Section D is numbered identically to
the plan's own §10** — they were two different numbering schemes until 2026-07-22, which handed
specialists 3 and 4 each other's checks (the plan's invariant 8 is the revision cadence, the standard's
was the three counts). If a future edit renumbers either side, renumber both.

**Section A is checked cell by cell.** "Present and non-empty" is not the bar: doctrine §0 must carry
its seven named rows (current level · current step · current branch · done condition · next revision
point · blocked on · last updated), §1 its lines, §4 its automated/manual marks, and the route its full
header metadata block. A row the plan invented in place of a
required one — a *next gate* where *next revision point* belongs — passes a presence check and fails
this one, and it is exactly how off-scope tracks creep back into §0.

**Specialist 2 is the extension engine.** For every `## ` section of `notes/sql/coverage/{LEVEL}.md` not
claimed by a step, it does not merely report the gap — it **writes the new step**, to Section C's
shape, inserted at the dependency position B1 justifies, with its own file in the route's §1 and its row
in §3. Existing step numbers are preserved where possible and closed steps are never renumbered.
Conversely, a step claiming a section coverage no longer has is removed or re-pointed.

**But scope landing on a *closed* step is not its business** (invariant 14). It records the bullets under
that step's `**Pending additions:**` and moves on. Extending the route is this prompt's job; reopening
graded work is nobody's.

**Specialist 4 enforces the scope fence.** It is the one that keeps this plan about exercises:
- Every prompt the plan tells Victor to run must **exist at that path** and its pasted config must use
  **that prompt's real keys** — open `sql-exercises-prompt.md` and compare key by key. A moved prompt
  or an invented key is a dead instruction that fails silently.
- **And the reverse direction, which is the half that actually broke:** every value the prompt says it
  *derives from the plan* must be present in the plan **in the literal shape the prompt greps for**.
  Read the prompt's Resolution table and check each source string against every route §2 step — today that
  means a `**Moment 2 config:**` line carrying `COUNT = n`, and a `**Focus:**` line. A step missing
  either one stops the run, or worse, used to fall through to a silent default batch. Steps whose two
  runs share a `TOPIC` must also state each run's exercise range.
- The outputs the plan expects must be the outputs that prompt actually writes.
- Anything scheduling notes, Q&A or simulations **comes out**, collapsed into one §Z line. Anything the
  plan *describes* rather than *points at* (exercise format, note quality, Q&A shape) comes out too —
  Section E's table decides who owns what.
- **§8c is the one exception and is not to be deleted.** Simulation *readiness* — which techniques the
  closed steps of the route unlock — is a fact about SQL knowledge and belongs here; simulation *content*
  (format, time limit, bank, tracker, config) does not. Check §8c states the first but not the second,
  and that its "Estado hoy" line agrees with §8's closed steps. A specialist that removes §8c wholesale
  has failed this check, not passed it.

**Acceptance check.** A report is acceptable only with the read-to-EOF line **and** one row per check
its slice owns. Otherwise re-dispatch once, quoting what was missing; if it fails again, record the
gap in the self-report and continue — never silently accept a partial trace.

**A specialist that *returns* blocked is not a formatting failure, and this check has to be told to
catch it.** It counts rows: a specialist that applied half its fixes and stopped can still open with the
read-to-EOF line and emit one row per check it owns, writing `blocked` in the verdict column, and pass
— while its half-applied edits sit in the plan files, which Phase 4 stages wholesale. So a specialist
that cannot finish **stops and opens its report with `BLOCKED — <reason>`, naming which of the two plan
files it already wrote to and which sections** (`_agent-runtime-standard.md` requires a component
writing into a wholesale-staged target to declare exactly that), and **a report opening with `BLOCKED`
fails this acceptance check whatever its rows say**. Phase 4 already consumes that failure and refuses
the commit, and that *is* the whole disposition here — nothing is committed, the partial fixes stay in
the working tree, and the report names the files and sections holding them. No baseline or span restore
is needed precisely because nothing lands.

**It fails the check without taking the retry.** The protocol above re-dispatches once "quoting what
was missing", which is inexecutable against a blocked report — nothing is missing from it — and a cold
re-dispatch would start over on half-edited files while spending a budget the dead-specialist paragraph
below already allocates. A declared `BLOCKED` is a complete report of an incomplete job: record it, do
not re-dispatch on it, and let Phase 4's gate do the rest.

**A specialist that dies mid-run takes the dispatch ladder in `_agent-runtime-standard.md` → "Dispatch
contract"** — read what it persisted, else resume it, else re-dispatch it cold — and never advance to
the next specialist without its trace. Two things that ladder cannot say and this prompt must. Its
**first** rung is load-bearing here and the easiest to skip: these specialists write their fixes
straight into the plan files and never commit, so a dead one has usually already left part of its work
in the tree — read those files before treating it as lost. And a **resume is free** — where the runtime
can restore the agent's transcript, tell it what is already on disk and have it write the fixes it had
already concluded; that spends neither of Phase 2's two re-dispatch counts, the acceptance check's above
and **Ripples'** below. Only the cold re-dispatch after a failed resume spends **Ripples'**
one-per-concern-per-run budget.

**Ripples.** If a fix invalidates a concern already reviewed, re-dispatch that one — **at most one
re-dispatch per concern per run**. Remaining ripples go in the self-report, except a verified factual
error (a wrong path, count or cross-reference, checked against disk), which the orchestrator corrects
itself in **every** occurrence before committing.

## Phase 3 — History gate

Re-run the Phase 1 status greps **and re-read the route's §1 and §3 count rows**, comparing them against
the verbatim copy taken in Phase 1. **Every step marked done before the run must still be marked done**,
and **every scored count in the plan must be ≥ what it was** — that is the half that matters, since
the counts on disk never move here. Renumbered or reworded is fine; unmarked, downgraded or missing is
a failure — a plan that loses the record of completed work is worse than an unaudited one.

On failure: re-dispatch `counts-and-truth` once, quoting the lost lines verbatim. If it still fails,
**abort without committing**, leave the working tree, and report exactly what was lost.

## Phase 4 — Commit

The specialists left every fix in the working tree; **the orchestrator makes the single commit.**
Gate first: if the acceptance check or the history gate failed, do not commit.

Otherwise `git status` → stage → `git status` again → commit:

```
git add practice/sql/PLANNING.md practice/sql/{LEVEL}/PLANNING-{LEVEL}.md
```
```
git commit -m "docs: audit SQL {level} plan — <one-line summary of the main fixes>"
```

Stage only the files that actually changed; an unchanged doctrine is not staged just because it was read.

**Both plan files are machinery, not Victor's work** — a tracking document this pipeline
authors, so the shared session rules' auto-commit exception covers it exactly as it covers a project `PLANNING.md`.
**The exercise files are Victor's and are never touched here** — not staged, not edited, not
renumbered. A specialist wanting an exercise file changed says so in its trace; the orchestrator
reports it as a recommendation. Same for `sql-exercises-prompt.md`: if specialist 4 concludes the
prompt is the wrong side of a divergence, it reports it rather than editing another prompt's file
mid-audit.

## Phase 5 — The handoff this run cannot perform itself

Two of this pipeline's outputs are deliberately incomplete, and the run is not finished until it says
so **in its last line to Victor**, not only inside the self-report:

- **Specialist 2 wrote or re-pointed a step.** The route now maps coverage that the header's
  `Coverage SHA-256` does not, and `PROGRESS.md` has no rows for the new files — this pipeline may
  refresh neither (Hard rules; invariant 15 is audited, never repaired here). Until `/sql-plan {LEVEL}`
  runs, every `/sql-exercises` run prints "ruta desactualizada" and the route percentage is computed
  over the old file list.
- **The digest was already stale on arrival** and specialist 2 could not claim every new bullet.

In either case close with exactly one line:

```text
⚠ /sql-plan {LEVEL} owed — N steps added/re-pointed · digest stale · PROGRESS.md not seeded for M new files
```

If neither applies, close with `route and projection consistent — nothing owed`. **This is the gap the
prompt existed with until 2026-08-04:** the audit could grow the route and nothing in the chain said the
planner had to run again, so a remapped route kept warning it was stale for weeks and the projection
quietly described a route that no longer existed. The order is `/sql-plan` → `/sql-plan-audit` →
**`/sql-plan` again when this line fires** → `/sql-exercises`, and it is doctrine §9's `G1c`.

## Hard rules

- **Top model for every subagent** (`reasoning tier: deep`). Four cold auditors firing rarely on the file that
  governs months of study is the wrong place to save tokens.
- **Strict sequence, never parallel** — one file, four editors.
- **Never write the plan from nothing.** This audits and extends. A missing `PLANNING-{LEVEL}.md` is
  reported as "run `/sql-plan {LEVEL}` first" and the run stops — building a route cold is
  `sql-plan-prompt`'s job, and it does it against the coverage fingerprint and a cold route reviewer
  that this flow has no equivalent of.
- **Never recompute the route's `Coverage SHA-256`.** Report the mismatch; the digest is the staleness
  signal, and refreshing it without remapping the bullets destroys it.
- **Findings are fixed in place, not reported for later.** A report Victor must apply by hand is the
  failure mode the whole system exists to avoid. **One exception, `PROGRESS.md`** — audited, never
  edited, never staged; the projection belongs to `sql-plan-prompt`, so the finding hands off to
  `/sql-plan {LEVEL}` instead of being applied here.
- **Never schedule, run or edit the notes, Q&A or simulation tracks.**

## Final step — pipeline self-report

Read `notes/prompts/_internal/_pipeline-self-report.md` and execute it: write
`notes/prompts/practice/sql/_internal/_last-run-report-sql-plan-audit.md`, update `notes/prompts/_internal/_run-tracker.md`,
commit both on their own, print the five bullets, and run the refinement step — that is what makes
this prompt improve from its own runs instead of from theory.

````
