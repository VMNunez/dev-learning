# SQL plan audit — the entry point for keeping `practice/sql/PLANNING.md` good

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Run this **inside the supported agent runtime**. It audits and extends the SQL practice plan against
`_sql-plan-standard.md`, fixes what falls short, and commits — hands-off.

Why it exists: the projects have `plan-audit` and the concept lists have `coverage-audit`, but the
file that decides what gets drilled in the daily SQL block was written by hand and has never been
reviewed by anything cold. It is also the file that rots fastest — every closed step, every new
coverage section and every prompt change leaves it slightly less true.

**Run it whenever:** a step closes · `notes/sql/coverage-junior.md` grows · the exercise prompt changes ·
or the plan simply feels out of date. It is safe to run repeatedly; a clean plan comes back unchanged.

> **▶ Run first:** nothing. A stale `PROGRESS.md` is one of the findings, not a prerequisite.

> **Run-start check (step 0a):** execute the check in `notes/prompts/_internal/_pipeline-self-report.md` — read
> `_last-run-report-sql-plan-audit.md` and, if its `Status` is `open`, surface the finding in one line
> before proceeding. If the file does not exist, say "first run of this prompt" in one line and
> continue — its absence is expected, not a failure.

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
```

- `SCOPE = full` — the normal run: all four specialists.
- `SCOPE = extend` — only reconcile with `notes/sql/coverage-junior.md` and add the steps it now needs
  (specialists 2 and 1, in that order — the same first two of a full run). Use after a
  `coverage-audit` run added sections.

---

````
## Configuration — edit only this block

SCOPE = [full | extend]

The plan under audit is always `practice/sql/PLANNING.md`. There is no other target.

---

You are the orchestrator. You stay light: dispatch, wait, collect, gate, commit. **You never audit the
plan in your own context and you never read the standard** — the moment you start judging, the
cold-reviewer property is gone.

> **Branch guard (step 0b, right after the run-start check):** `git branch --show-current`. Study materials commit on the active branch
> (the shared session rules). On **`main`**, stop and ask Victor which branch to use.

## Phase 1 — Evidence snapshot (orchestrator, counts only)

Gather the ground truth the specialists check the plan against. Counts, never contents:

- `ls practice/sql/` — the files that exist.
- Per exercise file, **these exact commands** — both header formats live on disk, and a pattern that
  matches neither returns `0`, which `counts-and-truth` would then write into the plan as real:
  ```
  grep -cE '^-- (Exercise [0-9]+ \[|#[0-9]+ \|)' practice/sql/NN-name.sql   → written
  grep -cE '^--.*✅ Corregido' practice/sql/NN-name.sql                      → scored
  ```
  The marker always sits **at the end of the exercise's header line**, one per exercise, in both header
  formats (`_sql-exercises-review.md` Step 2b forbids it on a line of its own). If scored > written for
  any file, the count is wrong: stop and report it rather than propagating it.
- `grep -n "✅\|⏳\|done\|in progress" practice/sql/PLANNING.md` → the status baseline for the gate.
- **The plan's own count rows, copied verbatim**: the §5 file table and the **§8** progress table
  (§8 — *Progress tracking*; §9 is the quality-gate table and holds no counts). These
  are the numbers the history gate protects — the numbers on disk cannot regress, since this flow
  never touches the exercise files, so a gate that only re-greps disk checks nothing.
- `grep -n "^## " notes/sql/coverage-junior.md` → the current section list.

Hand this snapshot to specialists 2 and 3. It is evidence, not a finding: the plan is wrong only where
it disagrees with it.

## Phase 2 — Specialists, one concern each, sequential

They all edit the same file, so they **never overlap**. Dispatch in **this order — 2 → 1 → 3 → 4** —
waiting for each. None commits. `SCOPE = extend` runs the first two only, so it is a strict prefix of
a full run, not a different sequence.

**Why the extension engine goes first.** #2 is the only specialist that *writes new steps*, and #1 is
the one that audits a step's shape and justification (Section B, Section C). Run #1 first and every
step born in this run ships unreviewed — the one ripple re-dispatch allowed per concern is not a
substitute for reviewing work that did not exist yet. #3 and #4 follow because counts and prompt paths
are only true of the final set of steps.

For each, launch a fresh `role-appropriate` subagent, `reasoning tier: deep`, `execution: foreground`:

> Read `notes/prompts/practice/sql/_internal/_sql-plan-standard.md` — **only the sections your concern owns**, listed
> below — and audit `practice/sql/PLANNING.md` against them. Fix what falls short **directly in the
> file**. Do **NOT** commit. Return a **check-by-check trace**: one line per check you own,
> `check · verdict · what you changed (or "no change")`. Never paste plan content back. End with any
> cross-concern ripple the orchestrator must reconcile.
>
> **Read-to-EOF guard:** run `wc -l` on the plan first; if it is near or over 2000 lines, read it in
> passes with `offset` to the real end. Open your report with "N lines, read to EOF" — a report
> without that line is rejected.

| # | Concern | Owns | Also reads |
|---|---------|------|------------|
| 1 | `learning-design` | **Section B** (all ten) · **Section C** (every step has every field) | §2, §3, §6, §7 · `ROADMAP.md` (for B2) |
| 2 | `coverage-and-steps` | **Invariants 1, 2, 10** · **B10** | `notes/sql/coverage-junior.md` · §5, §6, §Z · the Phase 1 section list |
| 3 | `counts-and-truth` | **Invariants 3, 4, 5, 11** | §0, §5, §6, §8 · `PROGRESS.md` · **the Phase 1 snapshot** |
| 4 | `loop-and-fence` | **Section A** — every section present **and satisfying its own "Must contain" column**, row by row, not merely non-empty · **Invariants 6, 7, 8, 9** · **Section E** | §0, §2, §3, §4, §8b, §Z · `sql-exercises-prompt.md` |

**The invariant numbers are the standard's Section D numbers, and Section D is numbered identically to
the plan's own §10** — they were two different numbering schemes until 2026-07-22, which handed
specialists 3 and 4 each other's checks (the plan's invariant 8 is the revision cadence, the standard's
was the three counts). If a future edit renumbers either side, renumber both.

**Section A is checked cell by cell.** "Present and non-empty" is not the bar: §0 must carry its six
named rows (current step · current branch · done condition · next revision point · blocked on · last
updated), §1 its three lines, §4 its automated/manual marks. A row the plan invented in place of a
required one — a *next gate* where *next revision point* belongs — passes a presence check and fails
this one, and it is exactly how off-scope tracks creep back into §0.

**Specialist 2 is the extension engine.** For every `## ` section of `notes/sql/coverage-junior.md` not
claimed by a step, it does not merely report the gap — it **writes the new step**, to Section C's
shape, inserted at the dependency position B1 justifies, with its own file in §5 and its row in §8.
Existing step numbers are preserved where possible and closed steps are never renumbered into
ambiguity. Conversely, a step claiming a section coverage no longer has is removed or re-pointed.

**Specialist 4 enforces the scope fence.** It is the one that keeps this plan about exercises:
- Every prompt the plan tells Victor to run must **exist at that path** and its pasted config must use
  **that prompt's real keys** — open `sql-exercises-prompt.md` and compare key by key. A moved prompt
  or an invented key is a dead instruction that fails silently.
- **And the reverse direction, which is the half that actually broke:** every value the prompt says it
  *derives from the plan* must be present in the plan **in the literal shape the prompt greps for**.
  Read the prompt's Resolution table and check each source string against every §6 step — today that
  means a `**Moment 2 config:**` line carrying `COUNT = n`, and a `**Focus:**` line. A step missing
  either one stops the run, or worse, used to fall through to a silent default batch. Steps whose two
  runs share a `TOPIC` must also state each run's exercise range.
- The outputs the plan expects must be the outputs that prompt actually writes.
- Anything scheduling notes, Q&A or simulations **comes out**, collapsed into one §Z line. Anything the
  plan *describes* rather than *points at* (exercise format, note quality, Q&A shape) comes out too —
  Section E's table decides who owns what.
- **§8c is the one exception and is not to be deleted.** Simulation *readiness* — which techniques the
  closed steps of §8 unlock — is a fact about SQL knowledge and belongs here; simulation *content*
  (format, time limit, bank, tracker, config) does not. Check §8c states the first but not the second,
  and that its "Estado hoy" line agrees with §8's closed steps. A specialist that removes §8c wholesale
  has failed this check, not passed it.

**Acceptance check.** A report is acceptable only with the read-to-EOF line **and** one row per check
its slice owns. Otherwise re-dispatch once, quoting what was missing; if it fails again, record the
gap in the self-report and continue — never silently accept a partial trace.

**A specialist that dies mid-run is resumed, not re-dispatched.** Silence is not acceptance — never
advance to the next specialist without its trace. `SendMessage` to its agent id restores its
transcript: tell it what is already on disk and have it write the fixes it had already concluded. This
does not consume the concern's re-dispatch. If the resume also fails, then re-dispatch cold — that one
does count.

**Ripples.** If a fix invalidates a concern already reviewed, re-dispatch that one — **at most one
re-dispatch per concern per run**. Remaining ripples go in the self-report, except a verified factual
error (a wrong path, count or cross-reference, checked against disk), which the orchestrator corrects
itself in **every** occurrence before committing.

## Phase 3 — History gate

Re-run the Phase 1 status greps **and re-read the §5 and §8 count rows**, comparing them against the
verbatim copy taken in Phase 1. **Every step marked done before the run must still be marked done**,
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
git add practice/sql/PLANNING.md
```
```
git commit -m "docs: audit practice/sql/PLANNING.md — <one-line summary of the main fixes>"
```

**`practice/sql/PLANNING.md` is machinery, not Victor's work** — a tracking document this pipeline
authors, so the shared session rules' auto-commit exception covers it exactly as it covers a project `PLANNING.md`.
**The exercise files are Victor's and are never touched here** — not staged, not edited, not
renumbered. A specialist wanting an exercise file changed says so in its trace; the orchestrator
reports it as a recommendation. Same for `sql-exercises-prompt.md`: if specialist 4 concludes the
prompt is the wrong side of a divergence, it reports it rather than editing another prompt's file
mid-audit.

## Hard rules

- **Top model for every subagent** (`reasoning tier: deep`). Four cold auditors firing rarely on the file that
  governs months of study is the wrong place to save tokens.
- **Strict sequence, never parallel** — one file, four editors.
- **Never write the plan from nothing.** This audits and extends; a missing plan is reported.
- **Findings are fixed in place, not reported for later.** A report Victor must apply by hand is the
  failure mode the whole system exists to avoid.
- **Never schedule, run or edit the notes, Q&A or simulation tracks.**

## Final step — pipeline self-report

Read `notes/prompts/_internal/_pipeline-self-report.md` and execute it: write
`notes/prompts/practice/sql/_internal/_last-run-report-sql-plan-audit.md`, update `notes/prompts/_internal/_run-tracker.md`,
commit both on their own, print the five bullets, and run the refinement step — that is what makes
this prompt improve from its own runs instead of from theory.

````
