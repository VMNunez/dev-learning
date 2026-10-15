# System check — on-demand audit of the prompt and skill system, one flow at a time

> **▶ Run first:** nothing. This is a maintenance audit, launched only when Victor explicitly asks for
> `/system-check`, normally after a group of machinery changes. It is never a per-commit gate, a
> session-start ritual, or an automatic consequence of `map-sync`.

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any role. This prompt is a
hands-off orchestrator and uses its role, isolation, whole-file, and close-out contracts exactly.

## Configuration

```
FLOW = [next | knowledge | projects | practice | strategy | system | cross]
```

Default `next`: the first flow, in the order of that list, that is not `fresh` under `## Freshness and
the record` — so a bare `/system-check` always audits the flow that has waited longest for one. Naming a
flow audits that one whatever its state. There is no other configuration, and no `all`: one run is one
flow, because one flow is what fits a session.

## Why the audit is cut by flow

Until 2026-10-15 this prompt audited the whole machinery in one run and allowed no partial verdict. It
never produced a complete run. Two admitted runs (2026-08-12, 2026-08-13) closed a 170-file manifest
census and then could not disposition 1,959 claim rows in one context (`REC-109`); the run opened
2026-08-20 resumed across sessions and stalled at 0 of 20 accepted reconciliation concerns, by which time
the machinery it had frozen was hundreds of commits old. Its carry-forward mode could reuse evidence only
from a `complete` run, which had never existed. Victor ruled the 2026-08-20 run abandoned and chose this
shape (`REC-245`).

The objection the global method rested on — *a defect in a global map is a property of the whole
system* — is answered by splitting the claims, not by ignoring it. Most map facts are **about one file**,
and `_session-rules.md` → "What a read licenses a ruling on" already partitions them file by file: a
prompt's interface row, a skill's §9 row, the §7 cells for the files it touches. Those belong to the flow
that owns the file. What no single file can settle — §1's two-engine properties, §8's `PROGRESS.md`
ownership, a chain's order where chains meet, §13's counts, the catalogue's totals — is the set that
licence already refuses one file, and it is audited as a flow of its own, `cross`. The whole machinery is
verified when every flow is `fresh`.

## Purpose

Establish whether the two derived maps completely and truthfully document the prompt-and-skill
machinery:

- `notes/prompts/README.md` — the navigable prompt catalogue and run-order entry point. It owns each
  prompt's public command, run-first prerequisite, configuration/modes and received inputs, files and
  contracts read, files written or values returned, dispatched roles/isolation, commit owner,
  handoffs/gates, and explicit exclusions.
- `notes/prompts/_internal/_system-map.md` — the comprehensive wiring reference. It owns cross-system
  chains and file ownership plus each skill's trigger, received inputs, reads, writes/returns, isolation,
  commit owner, handoffs/gates, and explicit exclusions.

Each fact has one owner. The other map links to that owner when repetition would create a rule fork.
This audit checks the machinery and its documentation; it never measures whether Victor has already
run or applied that machinery.

## Boundaries

- **The machinery wins.** A disagreement is repaired in the maps; never edit a prompt, `SKILL.md`,
  standard, launcher, or live artifact to make a map look right.
- **Derived files may be corrected.** This prompt may edit only `notes/prompts/README.md`,
  `notes/prompts/_internal/_system-map.md`, its flow's report, the recommendation ledger for findings,
  and the universal run report/tracker files required by the close-out contract. It may additionally
  write uncommitted execution evidence under the Git-ignored `.system-check/` runtime directory; that
  state is never a machinery repair, inventory member, report substitute, or commit candidate.
- **Recommendations are not repairs.** A duplicated responsibility, missing gate, expensive ritual,
  broken feedback loop, or unclear ownership is recorded for later adjudication; this run does not
  refactor the machinery that produced it.
- **Explicit invocation only.** Do not schedule, infer, or chain this run from another prompt or skill.
- **One flow per run.** A run's verdict covers its flow's files and the map rows they license, never the
  whole system; the whole-system state is the table Step 0 prints, never a verdict a run writes.
- **Machinery only.** A path pattern, schema, ownership rule, or gate declared by a prompt/skill is in
  scope as machinery. The live artifact governed by it is not. Never traverse project `PLANNING.md` or
  `PROJECT-BACKLOG.md` files, SQL doctrine/routes, coverage or notes-plan state, practice trackers,
  project/application state, or their debt counts. They are excluded from the inventory, report, and
  blocking conditions even when a source prompt names them as inputs or outputs.
- **No active-project orientation.** This run takes `_session-rules.md`'s machinery-only exception:
  confirm the branch and working tree, then read the two maps and source machinery. Do not open the
  active project's `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md` before Step 0 or at any later
  point. They are live state, not audit context.
- **No single-agent fallback.** If the required cold roles cannot be dispatched, close as `blocked`
  through `_pipeline-self-report.md`; do not publish a partial map correction.

## The flows

**The inventory** is the machinery set, enumerated from disk rather than from either map:

- every runnable prompt returned by the validator's canonical rule: recursive `*.md` under
  `notes/prompts/`, excluding `README.md`, `_internal/` directories, and filenames beginning with `_`;
- every family-internal `*-prompt.md`, `*-standard.md`, and `*-rationale.md`, plus the three SQL
  branch/seed components (`_sql-exercises-practice.md`, `_sql-exercises-review.md`,
  `_sql-exercise-seeds.md`), the coverage ownership contract (`_topic-ownership.md`), and the
  short-exercise route checker `practice/exercises/_internal/validate-practice-plan.py` — read to EOF as
  machinery and never run, since its oracle is a live route (`REC-277`);
- the root contracts `_session-rules.md`, `_agent-runtime-standard.md`, `_batch-mode.md`,
  `_external-path-preflight.md`, `_pipeline-self-report.md`, `_single-shot-self-report.md`,
  `_recommendation-ledger.md`, `_recommendation-ledger-closed.md`,
  `_recommendation-resolution-doctrine.md`, `_shared-context.md`, and the PowerShell validator;
- every skill directory in both adapters, paired by relative path;
- every launcher in both adapter catalogues, paired by filename.

It excludes generated reports (`_last-run-report*.md`, `_last-drift-report.md`, every
`_system-check-report*.md`, `_system-gaps-report.md`), runtime/evidence state (`_run-tracker.md`,
`_skill-friction.md`, `_ritual-friction.md`, `_job-market-evidence.md`, `_cross-topic-inbox.md`,
`_skill-breach-log.md`, every `_breach-log-<prompt-name>.md`, `_note-todo-harvest.md` and the
Git-ignored `_skill-runs.md`), `.system-check/` itself, and every live artifact outside the machinery set
above. **The excluded reports and sinks are one class, defined by what WROTE the file** — a run or the
`PostToolUse` hook, never its filename: the content is a transcript, so auditing it as canonical machinery
rules on a sentence nobody authored. `validate-prompt-system.ps1` carries the same class as its
`$canonicalFiles` class-A exemption, so a file joining one list joins the other, and this paragraph is
where a run notices that the two have drifted. `_recommendation-ledger.md` is in scope for its
improvement-loop contract and, with `_recommendation-ledger-closed.md`, for deduplicating new findings,
but its open rows are not an operational-debt queue; `_recommendation-resolution-doctrine.md` is in scope
as the case law the ledger's steps cite, never as a queue. Do not follow a path merely because an audited
file names it.

**Every inventory path belongs to exactly one flow**, by this table, applied mechanically:

| Flow | Prompt families (prompts + their `_internal/` members) | Skills | Matches `_system-map.md` |
|---|---|---|---|
| `knowledge` | `knowledge/coverage/`, `knowledge/notes/`, `knowledge/interview-prep/` | `coverage-bullet-add` · `coverage-mark` · `study-content-writer` · `study-block-close` · `authoring-progress-recount` · `interview-prep-block-open` | Chain A (§3) |
| `projects` | `projects/plan/`, `projects/review/`, `projects/readme/`, `projects/portfolio/` | `step-complete` · `backlog-task-open` · `backlog-task-close` · `slice-review` · `readme-concept-add` | Chain B (§4) |
| `practice` | `practice/sql/`, `practice/simulations/`, `practice/exercises/`, `practice/interview/` | `sql-block-open` · `sql-grade` · `sql-step-close` · `sql-block-close` · `simulation-block-open` · `simulation-grade` · `simulation-block-close` · `practice-session` | Chain C (§5) |
| `strategy` | `strategy/tracking/`, `strategy/apply/` | — | Chain D (§6) |
| `system` | `system/`, plus every root contract and the validator | `map-sync` · `skill-refine` | §12 |
| `cross` | no file of its own — the claims no single file licenses (below) | — | §1, §2, §8, §13 |

A launcher pair belongs to the flow of its canonical prompt. The two maps belong to no flow: they are
the object every flow rules on. **A path the table does not place** — a new family directory, a new
skill — is never dropped and never guessed into a flow: Step 0 prints it as `unassigned`, and while one
exists the system as a whole cannot read as verified. The table is hand-written, so placing a new path is
the edit that adds it, in the commit that creates the machinery.

**`cross` audits the map content no per-file licence reaches**, one cold concern per cluster:

| Cluster | Map content it rules on |
|---|---|
| `chains` | `_system-map.md` §1 and §2 whole, and in §3–§6 the **order** of every chain plus every paragraph relating more than one component, such as the gate conditions under §4 (a prompt's own step in a chain is its file's concern); in `README.md`, "How the prompts feed each other" whole — its producer→consumer bullets and "Pipeline view" — and every sequence in "Typical run order" |
| `progress` | `_system-map.md` §8 whole; the `PROGRESS.md` row of `README.md` → "The five hub files" |
| `loop` | `_system-map.md`'s preamble above §1, §12 whole, the prose above and below §9's table, and every §10 bullet and §11 row that names no prompt |
| `day` | `_system-map.md` §13 whole, re-measuring every `Declared steps · contract size` cell in one pass — never one row alone, which would put two dates in one table |
| `catalogue` | **every line of either map that no file licence and no other cluster names** — a catch-all, of which the rest of this cell lists the known regions: in `README.md`, the preamble, the counts, group lists and classifications from "Platform adapters" through "The internal-only files" (runnable totals, the group table, the orchestrator/single-shot split, the internal-only list, launcher naming and parity), the hub table's `Source of truth` and `Read by` cells, the intros, fence paragraphs and folder tables under "The prompts — what each one reads and generates", "Batch mode", "Runtime-neutral reasoning tiers" and "Gaps"; in `_system-map.md`, §7's intro; and in either map, every row or bullet whose only writer is `by hand`, plus **the whole-population half of every cell** that asserts exclusivity, completeness or a count over several files ("only", "every", "never", a writer list called exhaustive) — a file concern rules only its own file's membership in it |

The validator's paragraphs in "Platform adapters" are the validator's own concern, not this cluster's.

A `cross` concern may open, to EOF, any inventory file a claim it rules on names, and may grep the whole
inventory to settle a count, exclusivity or completeness claim; the files it opened are its declared
inputs.

## Freshness and the record

**Each flow has one report**, `notes/prompts/system/_internal/_system-check-report-{FLOW}.md`,
overwritten only by a run of that flow. It records every audited path with its **git blob id** —
`git hash-object <path>`, which normalises line endings the way git stores the file, so a checkout under
`core.autocrlf` that rewrites CRLF and LF moves no id — plus the blob ids of this prompt and of
`_system-check-reconcile-prompt.md` the run executed under. For `cross` it also records every file its
concerns opened or matched by grep, and the **path-set digest**: the SHA-256 of the inventory's
repo-relative paths, sorted and joined with LF.

A flow is **`fresh`** when its report reads `Status: complete`, the flow's current path set equals the
one the report lists, every listed path's blob id equals the one recorded, and this prompt's and the
mandate's ids equal the ones the run executed under. For `cross`, the files it opened or matched are
compared the same way and the path-set digest must also match, since a count claim moves when a file is
added or retired. A claim `cross` settled wholly or partly from an **absence** of grep matches — every count,
exclusivity or completeness claim, since "these twenty" also says no other file matches — rests on every
file's content and no list of ids can hold it, so the report marks it `path-set-level`:
only a change of path set stales it, and the report says so beside it. A flow with no report, a
`blocked` report, a changed path set or a changed id is **`stale`**, and the Step 0 table says which
paths moved; a changed prompt or mandate id marks every flow `stale (method)`, because a run under a
different licence ruled different rows.

**Four files are outside every freshness comparison, deliberately: the two maps, `_recommendation-ledger.md` and
`_recommendation-ledger-closed.md`.** Nearly every machinery commit edits a map, and every prompt
close-out and every ledger resolution — this run's own Step 5 included — writes the ledger, so a digest
that held them would stale every flow on every commit: the global method's unfinishable state reached by
another road. The `system` flow still audits both ledger files as contracts, each read whole by its own
concern, and the report lists their ids as evidence of what was read, never as a freshness condition.
Between audits the maps are kept true by `_session-rules.md` → "The two maps follow every change to the
machinery" and by `map-sync`; this audit verifies them against the source at the moment it runs, and a
flow goes stale when its **source** moves. A `fresh` flow therefore says *these rows matched these source
bytes when they were last read*, never *no map edit since has broken them*.

**The tracker carries one row per flow** — `system-check · {FLOW}` in `_run-tracker.md` →
`## Global pipeline prompts (no per-target scope)` — so a run of one flow never overwrites another's
record. The whole-system state is `verified` only when all six flows are `fresh` and no path is
`unassigned`; it is computed at Step 0 and stored nowhere.

## Declared outputs

1. Corrected `notes/prompts/README.md`, when any audited claim is false.
2. Corrected `notes/prompts/_internal/_system-map.md`, when any audited claim is false.
3. `notes/prompts/system/_internal/_system-check-report-{FLOW}.md`, overwritten on every admitted run of
   that flow, a blocked one included. A refusal at Step 0 or Step 1's admission gate is not a run and
   writes nothing.
4. New or updated rows in `notes/prompts/_internal/_recommendation-ledger.md` for genuine machinery
   defects the audit discovered — every proved `source-contradiction` among them, blocked run or not,
   save the two exceptions Step 5 names; map corrections themselves are not recommendations.
5. The universal pipeline report and the flow's `_run-tracker.md` row, from `_pipeline-self-report.md`.
6. A resumable evidence checkpoint under `.system-check/flows/{FLOW}/{run-id}/`.

## Durable checkpoint and resume

The orchestrator owns one Git-ignored directory per admitted run,
`.system-check/flows/{FLOW}/{YYYYMMDD-HHMMSS}-{starting-commit-short}/`, holding `state.md`,
`snapshot.tsv` (path + blob id for the flow's inventory and both maps), `accepted/` (one verbatim return
per accepted concern) and `review/`. A role may write to its own scratch path; the orchestrator copies a
return into `accepted/` only after Step 3 accepts it, then atomically replaces `state.md` — sibling
temporary file, then rename — with the status (`in-progress | blocked | complete`), branch, starting
commit, accepted concerns, rejected concerns and the exact next action. Artifact first, pointer second.
Never overwrite or delete an earlier run directory.

On invocation, before resolving `next`: if a run directory under `.system-check/flows/` reads
`Status: in-progress`, resume it rather than starting another — `FLOW = next` resumes it whatever its
flow, a named flow resumes only its own. More than one in-progress run is an admission refusal listing
them. On resume, an accepted concern is reused only when its source file **and both maps** still carry the
blob ids recorded in `snapshot.tsv`; any other concern is re-dispatched cold. A session or platform change is not
drift: Codex, Claude or another conforming runtime continues from the same files.

A `.system-check/runs/` directory belongs to the retired global method; Victor deleted it on 2026-10-15.
Should one reappear, it is never read, resumed or anchored on.

## Step 0 — preflight and the flow table

1. Confirm the repository root and active branch. Record `git status --short`. As the first admission
   gate, require every path a run may write to be clean: both maps, every `_system-check-report*.md`
   (the flow is not resolved yet), this prompt's
   `_last-run-report.md`, `_run-tracker.md`, `_recommendation-ledger.md`, and `_skill-friction.md`. If any
   is modified, staged or untracked, refuse before the run starts, print the exact dirty paths, and write
   or commit nothing. Preserve every unrelated change outside this set and refuse to stage it.
2. Execute the run-start decision table in `_pipeline-self-report.md` against this prompt's previous
   `_last-run-report.md` if it exists. Never restate the shared `Status:` meanings or apply a surfaced
   finding before this run.
3. Run `notes/prompts/_internal/validate-prompt-system.ps1 -MachineryOnly` as the mechanical baseline and
   record every `PASS`, `SKIP`, and failure. The switch keeps live coverage/plan/route state from
   blocking this audit. A structural failure does not replace the semantic audit.
4. Enumerate the inventory, place every path under `## The flows`, and print **the flow table**: one row
   per flow — `fresh` / `stale` with the paths that moved / `never run` — plus every `unassigned` path and
   the whole-system state. Then resolve `FLOW = next` to the first flow in configuration order that is
   not `fresh`. Under `FLOW = next` with no flow `stale`, there is no run to admit and nothing is
   written: with an `unassigned` path, print it and stop, the owed action being the edit that places it
   in `## The flows`; without one, print `verified` and stop. A named flow is audited whatever its state.
5. Record the starting commit hash.

## Step 1 — the flow's frozen inventory

Take the flow's paths from Step 0's placement — for `cross`, the five clusters, each with no fixed path
set — and write `snapshot.tsv`: every path with its blob id, plus both maps. **As the second and final
admission gate, assert that no path in the snapshot is dirty relative to `HEAD` and the index**, both
maps included: an uncommitted source would let the audit commit documentation before its source. On a
dirty path, take Step 0's refusal path. Only after this gate is the run admitted and the close-out
contract active.

Recompute the snapshot immediately before Step 4's dispatch and before applying the patch — every path
but the two ledger files, which this run's own Step 5 writes. A changed, added or missing path stops the
run as `blocked`; unrelated dirty files outside the snapshot are
preserved and never invalidate it.

## Step 2 — one cold concern per file

Every dispatch carries `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` as its
mandate, its own scratch return path, both map paths, and the machinery boundary repeated in the payload:
do not open active-project `PLANNING.md`, `PROJECT-BACKLOG.md`, `PROGRESS.md`, or any other live artifact.
Dispatch in parallel waves bounded by the runtime's concurrency limit, running Step 3's gate on each
return as it arrives and persisting only one that passes, before the next wave.

- **One `analyst`, tier `standard`, per inventory file of the flow** — prompt, internal component,
  standard, root contract, the validator — and **one per paired skill**, reading the `.claude/skills/`
  copy (mirror parity is the validator's). Each receives `PATH` and its `KIND`.
- **One `analyst`, tier `mechanical`, for the flow's launcher pairs together**, with `KIND = launchers`:
  the launcher files are a few lines each, and what they carry — command name, argument hint,
  delegation — is one fact per launcher.
- **On `FLOW = cross`, one `analyst`, tier `standard`, per cluster**, with `KIND = cross` and the
  cluster's name.

## Step 3 — the acceptance gate

Run this gate on each return the moment it arrives, before it is copied into `accepted/`: the copy is
the acceptance, so no file in `accepted/` may fail an item below. Accept a return only when it:

1. opens with an `N lines, read to EOF` line for its file — every file, for `launchers` and `cross`;
2. rules every map row its licence names for that file, each with one disposition from the mandate's
   vocabulary;
3. quotes, for every `incorrect` and `missing` disposition not struck below, the source's own words that
   prove it — a line number or a paraphrase is not a quote — and the exact replacement or addition, no
   broader than those words prove;
4. quotes, for every `source-contradiction`, both clauses and names the owning path;
5. ends with the mandate's `concern complete` line.

Re-dispatch a failed concern cold, once; a second failure blocks the run. **An absence ruled outside the
return's licence is struck, never re-dispatched** — outside it a return may rule only a positive
contradiction, and its in-licence rows stand on their own quotes: record each struck row, with its
concern and the licence it falls outside, in `state.md` and the draft report, and keep it out of the
draft patch. **Two accepted returns that
propose different wording for the same map cell are a conflict**, and the orchestrator never settles it
by choosing: both go to Step 4's reviewer with both cited sources. When every concern is accepted, write
the draft patch — every proposed correction applied to scratch copies of the maps, never to the files —
and confirm the snapshot still holds.

## Step 4 — cold final review

Write the **draft** report to `review/` with every section of Step 6 filled except the review verdict.
Dispatch one cold `reviewer`, tier `deep`, with the draft report, the draft patch as a diff, every
accepted return, `snapshot.tsv`, and the machinery boundary. The reviewer:

- reads to EOF every source file a proposed correction or a conflict cites, and checks each correction
  follows from it and is no broader than it proves;
- settles every conflict from the two sources, or rejects it as unsettled;
- greps both maps for every changed claim and checks each occurrence was updated or is named;
- checks no correction creates or keeps a rule fork — a rule the other map owns, restated instead of
  linked (`REC-064`);
- checks every flow file has an accepted return, that every row Step 3 struck lies outside its return's
  licence — ruling one that does not as it rules any proposed correction — and that no absence outside a
  licence reached the patch;
- checks no authoritative machinery file and no live artifact was edited or entered the record.

It returns `approve`, `approve-with-tightening` (each tightening named), or `reject`. Apply only an
approved form. A `reject`, or a reviewer the dispatch ladder in `_agent-runtime-standard.md` could not
reach, takes the blocked branch with no map edit.

## Step 5 — findings for the ledger

Every `source-contradiction`, and every machinery defect a concern or the reviewer surfaced that is not a
map correction — a duplicated responsibility, a gate nobody owns, a stale pointer inside a source file —
is reconciled with `_recommendation-ledger.md`: update an existing row when it is the same problem, open
one `REC-NNN` only when it is distinct, deduplicated against `_recommendation-ledger-closed.md`, on the
ledger's own terms. Implement none of them. A blocked run still records every source contradiction a
concern proved, except after a reviewer `reject`, which contests the evidence those rows rest on, or a
Step 6 validator reversal, which contests the write — then the report names them instead.

## Step 6 — report, validate, and commit

Overwrite `_system-check-report-{FLOW}.md` with:

1. date, flow, starting commit, branch, and `Status: complete | blocked`;
2. the audited path table — path · blob id · lines · disposition counts — the blob ids of this prompt and
   the mandate, and, for `cross`, the files each cluster opened or matched, the path-set digest and every
   claim marked `path-set-level`;
3. the validator baseline and final result;
4. every map correction applied, as `map · row or line · was · now · source line`;
5. every row ruled `correct` — counted per file, never as a section-level "verified" — and every row
   Step 3 struck, with its concern;
6. findings with their ledger IDs;
7. the final-review state: `approve`, `approve-with-tightening`, `reject`, or `not completed — reviewer
   unavailable`;
8. on a blocked run, the gate that failed and the exact next action.

**Completed branch:** apply the approved patch, run the validator again with `-MachineryOnly`, and prove
with `git diff` that only both maps, this flow's report and the justified ledger rows changed. Stage only
those paths, with `git status` immediately before staging and again before committing, and commit them
atomically as `docs(prompts): system-check {FLOW} — verify and synchronize the maps`. A run that found
nothing still commits its report: it is the record that makes the flow `fresh`.

If that final validator fails, reverse only the run-owned map and ledger hunks from the stored patch —
never `git checkout`, reset or a whole-file overwrite — and take the blocked branch, committing the report
**alone**: it names the reversed rows, since a reversal contests the write those rows rest on.

**Blocked branch:** apply no map edit, write the report with `Status: blocked`, and commit it — with any
ledger rows Step 5 wrote — as `docs(prompts): system-check {FLOW} — record a blocked audit`, after the
same `git status` checks. Persist the terminal state in `state.md` before any commit.

## Step 7 — pipeline close-out

Execute the close-out checks, ledger reconciliation, report, tracker and commit rules in
`notes/prompts/_internal/_pipeline-self-report.md`. Its report is about how this audit pipeline behaved,
not the findings above. **Never apply the contract's at-end prompt refinement during this audit**: that
would mutate source machinery inside the run that audited it — leave any earned refinement `open` for a
later, separately authorised cold adjudication. Update the `system-check · {FLOW}` row in
`_run-tracker.md` and no other `system-check` row, then make the separate report + tracker commit the
shared contract requires.

For the close-out's declared-output check, the flow report is unconditional. The maps and the ledger are
conditional: an unchanged map is satisfied by the report's correction list reading `none`, and the ledger
by its findings list reading `none` — and, after a validator reversal, by the report naming the
reversed rows. On a blocked run the maps are satisfied by the blocked branch's
rule that it edits neither.

## Acceptance gate

A run is `completed` only when all of these are true:

- every inventory file of the flow — or every `cross` cluster — has an accepted return with its
  `N lines, read to EOF` declarations;
- every return ruled every row its licence names, every row carries one disposition, no absence outside
  a licence reached the patch, and every `source-contradiction` carries both clauses and one ledger ID;
- every applied correction survived the cold final review;
- no live project, learning, practice, application or debt state entered the audit, and no
  active-project `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md` was opened even for orientation;
- the final validator exits successfully;
- the audit commit and the separate self-report commit both pass their stat checks.

Anything less is `blocked`, never "mostly verified" — and a `blocked` flow stays `stale` in the next
run's flow table.
