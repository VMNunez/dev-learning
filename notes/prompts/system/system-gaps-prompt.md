# System gaps — what the machinery does not cover, read off the two maps

> **▶ Run first:** nothing. It is launched only when Victor asks for `/system-gaps`. It is never a gate,
> a session-start ritual, an automatic consequence of `map-sync`, or a step inside `/system-check`.

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any role. This prompt is a
hands-off orchestrator and uses its role, isolation, whole-file, and close-out contracts exactly.

## Configuration

```
MODE = [update | dry-run]
```

`update` promotes qualifying findings to the recommendation ledger. `dry-run` writes the report and
commits nothing to the ledger. No other configuration exists: there is no target, no batch mode and no
scope switch, because a gap is a property of the whole system and a partial sweep cannot find one.

## Purpose

Find what the machinery **does not do** — a file nothing writes, an event nothing records, a gate nobody
runs, a debt nothing clears — using only the two derived maps as evidence:

- `notes/prompts/README.md` — the prompt catalogue: per-prompt reads, writes, run-first, run order.
- `notes/prompts/_internal/_system-map.md` — the wiring: chains, the writer registry, `PROGRESS.md`
  section by section, the per-skill contracts, the debts, the symptom routes, the day block by block.

**Why only those two.** Both maps were written by reading the whole machinery, so the facts a gap
analysis needs — who writes what, what fires when, what runs after what — are already extracted and,
uniquely, already *joined across components*. Re-reading thirty prompts and seventeen skills to rebuild
that join is what `/system-check` costs, and it answers a different question. This run is cheap on
purpose, and cheap is what makes it runnable often enough to catch a hole while it is still small.

**The two prompts do not overlap, and the split is not a matter of degree.** `/system-check` asks *are
the maps true about the machinery* — it reads the machinery, and it may correct a map. This one asks
*does the system the maps describe have holes* — it never opens a machinery file, and it therefore may
**never correct a map**. A finding that turns out to be a map defect is routed to `/system-check` or
`map-sync` and left there. A prompt that corrected a map from the map alone would be writing down its
own inference as an observation, which is exactly the failure the derived-file rule exists to stop.

## Boundaries

- **Nothing outside the declared read set is opened.** Not a prompt, not a `SKILL.md`, not a standard,
  not a launcher, not the validator, and no live artifact of any kind. The complete read set is:
  1. the two maps, **whole** — the evidence;
  2. `_recommendation-ledger.md` — the write target, read for its `## Open` rows, and
     `_recommendation-ledger-closed.md` beside it — the resolved half, and the other deduplication
     source; both read **never** as a source of gaps;
  3. this prompt's previous `system/_internal/_system-gaps-report.md`, if it exists — continuity of the
     candidates a previous run deferred;
  4. this prompt's own `system/_internal/_last-run-report-system-gaps.md` `Status:` line — the suffixed
     form, because `/system-check` already owns the family's plain `_last-run-report.md` and two
     orchestrators sharing a folder is exactly the case the self-report contract names — and the two
     contracts every runnable prompt executes (`_agent-runtime-standard.md`, `_pipeline-self-report.md`).

  Anything else is out, **including a file a candidate finding is about**. Wanting to open one file "just
  to check" is the normal, correct instinct and it is precisely what this prompt trades away for its
  price; the disposition that records the unchecked branch is in Step 4.
- **It corrects nothing.** No map, no prompt, no skill, no standard, no live artifact. Its only writes
  are its own report, ledger rows, and the universal close-out files.
- **Findings are hypotheses, not verdicts.** The maps are derived, so every finding of the *absence* kind
  has two branches — the machinery lacks the thing, or the maps failed to record it — and this run
  cannot tell which. A row that hides that is worse than no row.
- **A gap is a missing capability, never an unrun prompt.** A prompt that would produce the right result
  if someone launched it is a cell in `_run-tracker.md`. This is the ledger's own `REC-046` rule and it
  discharges more candidates than any other test.
- **Cost is not in scope.** Whether a ritual is worth what it costs is `_ritual-friction.md` and
  `REC-054`, which need lived days this prompt has no access to. A candidate that reduces to "this is
  heavy" is discharged and named as such, never promoted.
- **No single-agent fallback for the final review.** If the reviewer cannot be dispatched, close as
  `blocked`; never publish ledger rows that nothing challenged.

## Declared outputs

1. `notes/prompts/system/_internal/_system-gaps-report.md`, overwritten on every resolved run, including
   a blocked or dry run. It is the durable half: every candidate, its evidence, its disposition.
2. New rows in `_recommendation-ledger.md` `## Open`, in `update` mode only, for findings that cleared
   the promotion bar in Step 6.
3. The universal `system/_internal/_last-run-report-system-gaps.md` + `_run-tracker.md` update from
   `_pipeline-self-report.md`.

## Step 0 — preflight

1. Confirm the repository root and active branch. Record `git status --short`; preserve every unrelated
   change and refuse to stage it.
2. Execute the run-start decision table in `_pipeline-self-report.md` against this prompt's previous
   `_last-run-report-system-gaps.md`. Never restate the shared `Status:` meanings or apply a surfaced
   finding inside this run.
3. Record the starting commit hash, and the two maps' line counts and SHA-256. Recompute both hashes
   immediately before writing the report; a map that changed mid-run stops the run as `blocked`, because
   half the evidence would then be from a system that no longer exists.

## Step 1 — build the edge ledger, and build it yourself

**The orchestrator reads both maps to EOF itself and this is never dispatched.** `REC-079` deleted the
equivalent extraction step from `/system-check` on 2026-08-10 for a reason that applies here with more
force: the maps are the object under review, so a subagent's extraction of them is a derived paraphrase
that can drop a claim in a way nothing downstream can see — and here the whole analysis is *absence*
reasoning, where a silently dropped claim does not weaken a finding, it manufactures one. Begin the
ledger with one `N lines, read to EOF` declaration per map.

Enumerate every edge the two maps declare, typed. The sources for each type are named so the sweep is
reproducible and so a missed section is visible as a missed section:

| Edge | Written as | Read from |
|---|---|---|
| `writes` | `component → file` | §7 writer registry · §8 `PROGRESS.md` by section · README hub table · README family catalogue `Generates / updates` · README "How the prompts feed each other" |
| `reads` | `component → file` | the same five sources' `Read by` / `Reads` cells |
| `fires-on` | `event → skill` | §9 trigger column · §13 block table |
| `follows` | `step → step` | §2 diagram · §3–§6 chains · README "Typical run order" · README pipeline view |
| `gates` | `gate → what runs it` | §4 project gates · §10 gate notes · §11 symptom routes |
| `clears` | `debt or flag → what clears it` | §10 · §11 |
| `hands-off` | `component → component` | §9 handoff column · chain arrows |
| `licence` | a sentence declaring an absence deliberate | anywhere in either map — see Step 3 |

Every edge cites its map and its section or row. An edge you cannot cite is not an edge.

## Step 2 — run the detectors over the edge ledger

Ten detectors, each with a fixed ID so the report, the ledger row and the next run all name the same
thing. Each candidate cites the edges that produced it — the ones present **and** the one absent.

| ID | Detects | Fires when |
|---|---|---|
| `D1` | **unwritten file** | a `reads` edge points at a file with no `writes` edge — something consumes what nothing produces |
| `D2` | **orphan output** | a `writes` edge with no `reads` edge and no declared human reader — a run leaves something behind that nothing and nobody picks up |
| `D3` | **cold-only writer on in-session state** | every writer of a file or section is a prompt (§1: cold, launched by hand) while the thing it records is produced inside a daily block (§13) — so it is correct only until the next session and nothing in that session can repair it |
| `D4` | **unrecorded event** | an event in `fires-on`, `follows` or the §13 block table changes state and no skill or prompt writes anything when it happens — a block with no closer, a state change with no recorder |
| `D5` | **broken handoff** | a `hands-off` target or a chain arrow names a component that has no row of its own anywhere in either map |
| `D6` | **ownerless gate** | a `gates` edge names no component that runs it, or its closing condition depends on a report or file no `writes` edge produces |
| `D7` | **uncleared debt** | a `clears` edge resolves to nothing but someone remembering — §10 is the whole hunting ground |
| `D8` | **unrouted symptom** | a failure mode either map describes has no §11 row, or a §11 row routes to something with no `writes` edge for the file the symptom is about |
| `D9` | **contested write with no order** | a file has two or more writers and neither map states who wins, in what order, or over which part. §8's `Coverage demonstrated` note exists because that collision was real once; this detector finds the ones that never got such a note |
| `D10` | **unreachable machinery** | a catalogued prompt or a §9 skill is named by no chain, no run-order step and no symptom row — nothing in the system ever tells you to run it |

Give every candidate a **content key**, not a counter: the detector ID plus its primary subject, e.g.
`D3:PROGRESS.md#Timed simulations` or `D1:notes/cv/cv-bullets.md`. A run-scoped number renumbers the
same gap on the next run and makes carry-over unprovable; the key is what lets Step 5 recognise a
candidate this prompt already deferred, and what a ledger row cites as its origin.

## Step 3 — discharge everything the maps declare deliberate

Most of what the detectors return is design. Both maps state their intentional absences in prose —
`nothing yet — gated behind the ROADMAP gates`, `**none** — closing is per *step* and per *task*`, `the
notes half has none`, `**by hand.** No prompt writes it`, `Still intentionally **not** a prompt` — and a
gap detector that re-raises them is worth nothing and will be turned off.

- A candidate is discharged only by **a quoted sentence** from either map that declares that absence
  deliberate. Record the quote and its location. No quote is not a discharge.
- **A sentence that describes an asymmetry without accepting it does not discharge it.** §13's four
  asymmetries say so themselves — they are observations awaiting a `REC-054` ruling. Such a candidate
  is dispositioned `observed — ruling owed by REC-054` and stays in the report, out of the ledger.
- A discharge is scoped to what the quote says. A licence covering one level, one track or one block
  does not cover the others, and stretching it is how a real hole gets a permanent excuse.

## Step 4 — classify what survives, and never hide the unchecked branch

Every surviving candidate takes exactly one disposition:

- **`declared`** — every fact the finding needs is positively stated in the maps. Someone declares the
  writer, the trigger or the gate, and the gap is in *what is declared*. Falsifiable by one named file.
- **`absence`** — the finding rests on nothing in either map saying it. Both maps were read to EOF, so
  the absence is established **in the maps**; whether the machinery has the same hole is not, and this
  run may not find out. The row states **both branches explicitly** — *"either nothing writes X, or §7
  omits its writer"* — and names the single file whose read would settle it. This is the honest form,
  not a weaker one: the map-sync licence in `_session-rules.md` grants exactly this much and no more —
  *a read of any depth rules on a contradiction; only a whole read rules on an absence* — and here the
  file read whole is the map, so the ruling is about the map's account of the system.
- **`accruing`** — real, but only a lived day can size it. Named in the report, routed to
  `_ritual-friction.md` / `REC-054`, never a row.
- **`licensed`** — discharged in Step 3, with the quote.

An `absence` finding is promotable. What it may never do is state one branch as the fact.

## Step 5 — one cold independent sweep, and deduplication

Dispatch **one `analyst`, tier `deep`, cold**, with both maps and the ten detector definitions — and
**not** with the orchestrator's candidate list. It reads both maps to EOF, runs the same detectors, and
returns its own candidates with their content keys. This is not the `REC-079` pattern: the analyst's
return is redundant coverage checked against the orchestrator's own reading, never the denominator the
analysis rests on. Report both counts and every key only one side found; a key only the analyst found is
carried through Steps 3 and 4 by the orchestrator before it can be promoted. Reconcile by subject, not by
key string: where one side merged what the other split, re-key both to the finer subject before
comparing, and report the result as a partition of the union — both, orchestrator only, analyst only —
whose sizes add up. A row may still be drafted over merged subjects in Step 6; it is the comparison that
must be fine-grained, because a subject lost inside a merge is invisible to a count that never separated
it.

Then deduplicate the merged set against, in this order:

1. `_recommendation-ledger.md` `## Open` — same problem, so update that row rather than opening a second.
2. `_recommendation-ledger-closed.md` — including **rejected** rows, whose reason is kept in the
   line for exactly this purpose: to stop the next analysis re-raising the same zombie. A candidate
   matching a rejected row is discharged with that reason quoted.
3. the previous `_system-gaps-report.md` — a candidate deferred over the cap last run keeps its place in
   the ranking and is promoted before a newly found one of equal weight.

## Step 6 — the promotion bar, and the cap

A finding reaches `## Open` only when **all five** hold:

1. It passes the ledger's own three scope tests, in the preamble: is the wrong thing a file or a cell ·
   whose file is it · does it need a lived day. Test two matters most here — a defect in a project's
   `PLANNING.md`, a practice doctrine, a coverage or a notes file is owed to that file's writer and is
   not a machinery row.
2. It is not a duplicate under Step 5.
3. It names a missing **capability**, not an unrun prompt.
4. Its correction is nameable: the row says which file would gain what. Not *how* — this prompt does not
   design the fix — but a finding that cannot name its target is an observation, and observations belong
   in the report.
5. It survived Step 7.

**At most five rows per run.** The ledger's own preamble records the pathology this cap exists for: the
queue refilled as fast as it drained, and a ledger holding a worklist nobody can drain is one nobody
reads. Rank the survivors by how much of the system the gap sits under — a hub file or a daily block
outranks a single prompt's output — and disposition the rest `deferred — over cap`, which is not a loss:
the report is durable and Step 5.3 gives them priority next run.

Each promoted row carries: its content key as the source, the detector ID, both map citations, the
`declared` / `absence` disposition, and — for an `absence` — the two branches and the file that settles
them. In `dry-run`, draft the rows into the report and write nothing to the ledger.

## Step 7 — cold review

Dispatch **one `reviewer`, tier `deep`, cold**, with a scratch path per the runtime standard, holding
both maps, the full candidate table with dispositions, and the draft ledger rows. It checks:

- no candidate was discharged in Step 3 without a quoted sentence, and no quote was stretched past what
  it says;
- every `declared` finding is genuinely supported by a positive statement, and everything else is
  `absence` — a misfiled `absence` is the failure that matters most, because it publishes an inference
  as an observation;
- every `absence` row names both branches and one settling file;
- no row rests on a machinery file, since none was read;
- no candidate is a duplicate, an unrun prompt, a cost complaint, or another file's owner's defect;
- the cap was applied by rank and the deferred set is complete;
- the report's verdict is no broader than the evidence.

Return `approve`, `approve-with-tightening`, or `reject`. Only an approved form is written to the ledger.
A rejection, or a reviewer that could not be dispatched after the standard's dispatch ladder, takes the
blocked branch: the report is still written, with `Status: blocked` and the complete candidate table, and
no ledger row is created.

## Step 8 — report and commit

Overwrite `notes/prompts/system/_internal/_system-gaps-report.md` with:

1. date, starting commit, branch, `MODE`, and `Status: complete | blocked`;
2. the two maps' line counts, `read to EOF` declarations and hashes;
3. edge-ledger counts by type, and the sections swept for each;
4. the full candidate table: content key · detector · evidence citations · disposition · outcome
   (`promoted REC-NNN` / `deferred — over cap` / `licensed` / `accruing` / `duplicate of …`);
5. the independent-sweep counts and every key only one side found;
6. the promoted rows and the reviewer's verdict;
7. the verdict line, which is **a claim about the maps, never about the machinery**:
   `N gaps found in the system as the two maps describe it — M promoted, K unsettled between the two
   branches`. Never write "the system has no gaps": this run cannot see one the maps forgot to mention,
   and saying otherwise turns a cheap sweep into a false clearance.

Inspect `git diff` and prove only the report, the justified ledger rows and the close-out files changed.
Run `git status` immediately before staging and again immediately before committing. Commit the report
and any ledger rows atomically as:

`docs: record system gap scan`

A run that found nothing promotable still writes and commits its report — that file is the evidence the
sweep happened, and the deferred set the next run inherits.

**Maps unaffected, always.** This prompt cannot change what a file contains, who writes it, when
something runs, or which prompts and skills exist, so the two-map test in `_session-rules.md` closes with
`maps unaffected` on every run. Say it out loud; a silent skip and a genuine no-op are indistinguishable
afterwards.

## Step 9 — pipeline close-out

Execute the close-out checks, skill-friction reconciliation, report, tracker and commit rules in
`notes/prompts/_internal/_pipeline-self-report.md`, and update the `system-gaps` row under
`## Global pipeline prompts (no per-target scope)` in `_run-tracker.md`. Its report is about how this
pipeline behaved, not about the gaps it found. The at-end refinement applies normally — unlike
`/system-check`, this prompt audits nothing it could be refined into contradicting.

For the declared-output check: the report is unconditional; the ledger rows are conditional and an
unchanged ledger is satisfied by the report's own promoted-rows section reading `none`, never by silence.

## Acceptance gate

A run is `completed` only when all of these are true:

- both maps carry an `N lines, read to EOF` declaration at the head of the edge ledger, and both hashes
  matched at the end of the run;
- every one of the ten detectors ran and is reported, including the ones that returned nothing;
- every candidate carries exactly one disposition, and every discharge carries its quote;
- the independent sweep ran and its keys were reconciled;
- the cold review approved what reached the ledger;
- no file outside the declared read set was opened;
- the report and the close-out commits both pass their stat checks.

Anything less is `blocked`, never "mostly swept".
