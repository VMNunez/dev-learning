# System check — on-demand audit of the whole prompt and skill system

> **▶ Run first:** nothing. This is a global maintenance audit, launched only when Victor explicitly
> asks for `/system-check`, normally after a group of machinery changes. It is never a per-commit gate,
> a session-start ritual, or an automatic consequence of `map-sync`.

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any role. This prompt is a
hands-off orchestrator and uses its role, isolation, whole-file, and close-out contracts exactly.

## Configuration

```
MODE = [full | carry-forward]
```

Default `carry-forward`. `full` derives every manifest and every reconciliation concern inside this run. `carry-forward` anchors on
the most recent `Status: complete` run and reuses its accepted evidence for each concern whose own inputs
are byte-identical, deriving every other concern cold. There is no further configuration — no target, no
scope switch, no batch mode — because a defect in a global map is a property of the whole system.

`carry-forward` exists because the machinery under audit changes daily while a full derivation costs more
sessions than the interval between machinery commits: a run permitted to reuse evidence only *inside* one
session can never overtake its own subject, and the audit is then unfinishable by construction rather than
by difficulty. Reuse across runs is not the weaker proof it looks like — the evidence is the audited bytes,
identified by SHA-256, and re-deriving an identical input reproduces an identical manifest. What it may
never reuse is a **ruling**, whose inputs include the maps.

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
  `notes/prompts/_internal/_system-map.md`, its audit report, the recommendation ledger for findings,
  and the universal run report/tracker files required by the close-out contract. It may additionally
  write uncommitted execution evidence under the Git-ignored `.system-check/` runtime directory; that
  state is never a machinery repair, inventory member, report substitute, or commit candidate.
- **Recommendations are not repairs.** A duplicated responsibility, missing gate, expensive ritual,
  broken feedback loop, or unclear ownership is recorded for later adjudication; this run does not
  refactor the machinery that produced it.
- **Explicit invocation only.** Do not schedule, infer, or chain this run from another prompt or skill.
- **Global only.** There is no target or batch mode. A partial inventory cannot produce a global verdict.
  `MODE = carry-forward` is not an exception to this: its inventory, its snapshot and both reconciliation
  denominators are the whole machinery, and the only thing it reuses is a completed run's accepted proof
  over bytes that did not change.
- **Machinery only.** A path pattern, schema, ownership rule, or gate declared by a prompt/skill is in
  scope as machinery. The live artifact governed by it is not. Never traverse project `PLANNING.md` or
  `PROJECT-BACKLOG.md` files, SQL doctrine/routes, coverage or notes-plan state, practice trackers,
  project/application state, or their debt counts. They are excluded from the inventory, denominator,
  report, snapshot, and blocking conditions even when a source prompt names them as inputs or outputs.
- **No active-project orientation.** This run takes `_session-rules.md`'s machinery-only exception:
  confirm the branch and working tree, then read the two maps and source machinery. Do not open the
  active project's `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md` before Step 0 or at any later
  point. They are live state, not audit context.
- **No single-agent fallback.** If the required cold roles cannot be dispatched, close as `blocked`
  through `_pipeline-self-report.md`; do not publish a partial map correction.

## Declared outputs

1. Corrected `notes/prompts/README.md`, when any catalogue claim is false.
2. Corrected `notes/prompts/_internal/_system-map.md`, when any wiring claim is false.
3. Overwritten `notes/prompts/system/_internal/_system-check-report.md` on every admitted run, including
   a blocked run. Admission closes only after the writable-output check in Step 0 and the frozen-input
   cleanliness check in Step 1; a refusal at either gate is not a run and writes nothing.
4. New or updated rows in `notes/prompts/_internal/_recommendation-ledger.md` only for genuine machinery
   improvements the audit discovered, and — **on a blocked run too** — one row per proved
   `source-contradiction` under 4d; map corrections themselves are not recommendations.
5. The universal pipeline report and `_run-tracker.md` update from `_pipeline-self-report.md`.
6. A resumable evidence checkpoint under `.system-check/runs/{run-id}/`, updated after every accepted
   bounded concern and retained whether the run completes, blocks, or the hosting session ends.

## Durable checkpoint and resume contract

The audit's analysis is independent of the session or agent product hosting it. Runtime scratch may be
used while a role is active, but it is never the only copy of accepted evidence. The orchestrator owns
one repository-local, Git-ignored directory per admitted run:

`.system-check/runs/{YYYYMMDD-HHMMSS}-{starting-commit-short}/`

It contains `state.md`, `inventory.txt`, `snapshot.tsv`, `accepted-manifests/`, `direction-1/`,
`direction-2/`, and `review/`. Each bounded role may write to its own temporary scratch path, but the
orchestrator copies a return into the appropriate durable directory **verbatim only after its gate
accepts it**. It then atomically replaces `state.md` — write a sibling temporary file and rename it —
with: schema version, status (`in-progress | blocked | complete`), branch, starting commit, inventory
count and snapshot digest, last closed gate, every accepted concern, every incomplete/rejected concern,
and the exact next concern or gate. Persist the accepted artifact first and the state pointer second, so
an interruption can at worst leave an unindexed artifact that the resume gate revalidates; it can never
claim acceptance for a missing file. Never overwrite or delete an earlier run directory.

On explicit `/system-check`, inspect this directory before starting a new inventory:

1. If exactly one run reads `Status: in-progress`, offer no restart path implicitly: validate and resume
   it. More than one in-progress run is an admission refusal that lists them and asks Victor which one
   owns continuity. A blocked or complete run is historical evidence and is not resumed unless Victor
   explicitly names it.
2. Recompute the inventory path set and every SHA-256 before reusing evidence. If they equal the stored
   `inventory.txt` and `snapshot.tsv`, continue at `state.md`'s exact next concern. Do not re-read or
   re-dispatch an accepted manifest or accepted reconciliation concern.
3. A session/platform change is not input drift. Codex, Claude, or another conforming runtime continues
   the same run from the same files and gates.
4. Real audited-input drift blocks reuse by default. For an explicitly Victor-authorized continuity
   migration whose only purpose is changing this prompt family's own persistence, resume or audit method,
   write `migration.md`
   with the old and new snapshots plus the exact changed paths. Reuse every accepted manifest concern
   whose assigned source hashes are unchanged; cold re-dispatch only a concern owning a changed audited
   source. The two maps have no manifest owner: if either changed before Direction 1 had any accepted
   concern, recompute the Step 4a partition and discard only incomplete map-concern scratch. If an
   accepted Step 4 concern covered changed map lines, that concern and every dependent Direction 2
   return are invalid and must be re-dispatched. Replace the stored baseline only after these bounded
   invalidations are recorded. A migration that changed the **method** additionally invalidates every
   accepted ruling produced under the superseded method — **except one whose superseded method gave it a
   superset of what the new method requires**, because more evidence than a rule now demands cannot
   falsify a disposition reached on it. This is continuity of the same evidence, never a global restart or
   a licence for arbitrary source drift.
5. The durable directory is excluded from inventory, snapshot, report findings, Git staging, and every
   live-state denominator. Its evidence supports orchestration only; the committed audit report remains
   the sole final verdict.

## Cross-run carry-forward

On `MODE = carry-forward`, once Step 1 has built this run's inventory and snapshot, resolve the **anchor**:
the most recent `.system-check/runs/` directory whose `state.md` reads `Status: complete`. A `blocked` or
`in-progress` run is never an anchor, because its evidence never passed the cold final review. When no
complete run exists the mode degrades to `full`, and the report states that it did.

Carry an accepted concern forward only when **every input that concern was given** is byte-identical to
this run's:

1. a Step 2 manifest concern — the path set it owns, and every one of those paths by SHA-256;
2. a Direction 1 concern — its map's span text, plus every manifest it declared reading;
3. a Direction 2 concern — its manifest, plus **both maps in full**, because that direction rules on what
   the maps omit and an edit anywhere in either can change the answer.

Everything else is re-derived cold. Copy each carried artifact verbatim into this run's directory, marked
`carried from <anchor run id>` with the hashes that justify it, and record the carried/derived split per
step in the report. A carried artifact then has exactly the standing of a derived one: the acceptance gate,
the absence rule and the cold final review apply to the merged whole and are never relaxed because part of
it was carried. The final reviewer independently recomputes every hash a carry rests on and rejects the run
if one does not hold.

The global verdict is unaffected. `maps verified` still requires `unverifiable: 0` over the complete
denominator; what changes is only which session paid for each disposition, and the report prints both
counts.

## Step 0 — preflight and provenance

1. Confirm the repository root and active branch. Record `git status --short`. As the first admission gate,
   require every path this audit may write to be clean: both maps, `_system-check-report.md`, this
   prompt's `_last-run-report.md`, `_run-tracker.md`, `_recommendation-ledger.md`, and
   `_skill-friction.md`. If any is modified, staged or untracked, refuse before the run starts, print the
   exact dirty paths, and write or commit nothing — including no blocked report or close-out. That is an
   admission refusal, not a partial audit. Preserve every unrelated change outside this writable set and
   refuse to stage it. Do not resolve an active project or perform the ordinary project-state orientation:
   this run has already taken the machinery-only exception in `Boundaries`.
2. Execute the run-start decision table in `_pipeline-self-report.md` against this prompt's previous
   `_last-run-report.md` if it exists. Never restate the shared `Status:` meanings or apply a surfaced
   finding before this run. Then, when the previous `_system-check-report.md` exists and reads
   `Status: blocked`, read its `source-contradiction` list: every row it names `unregistered` is
   **inherited evidence**, re-proved against this run's sources and discharged with 4d's own rows. This
   report is overwritten by every admitted run and nothing else points at it, so a blocked run's proved
   findings survive only through this read. It is never evidence for a map claim.
3. Run `notes/prompts/_internal/validate-prompt-system.ps1 -MachineryOnly` as the mechanical baseline.
   Record every `PASS`, `SKIP`, and failure. The switch preserves machinery invariants while preventing
   live coverage/plan/route state from blocking this audit. A structural failure does not replace the
   semantic audit.
4. Record the starting commit hash for provenance. The frozen working-tree snapshot is built only after
   Step 1 has established its authoritative path denominator.

## Step 1 — build the exhaustive inventory mechanically

The orchestrator enumerates, from disk rather than from either map:

- every runnable prompt returned by the validator's canonical rule: recursive `*.md`, excluding
  `README.md`, `_internal/` directories, and filenames beginning with `_`; assert that this set equals
  the canonical targets referenced by both launcher catalogues;
- every internal `*-prompt.md`, `*-standard.md`, and `*-rationale.md`, plus the three SQL branch/seed
  components (`_sql-exercises-practice.md`, `_sql-exercises-review.md`, `_sql-exercise-seeds.md`) and
  the coverage ownership contract (`_topic-ownership.md`);
- the root contracts `_session-rules.md`, `_agent-runtime-standard.md`, `_batch-mode.md`,
  `_external-path-preflight.md`, `_pipeline-self-report.md`, `_single-shot-self-report.md`, and
  `_recommendation-ledger.md`, `_recommendation-ledger-closed.md` and
  `_recommendation-resolution-doctrine.md`, plus `_shared-context.md`
  (the shared canonical runtime input) and the PowerShell validator;
- `notes/prompts/README.md` and `notes/prompts/_internal/_system-map.md` themselves, as the two objects
  under review. These two are the only inventory items with **no analyst manifest owner**: they are ruled
  on directly in Step 4 rather than manifested (`REC-079`). They stay in the inventory and in the path +
  hash snapshot, and are excluded from Step 3's `audited files` / `unassigned files` denominators; their
  read-to-EOF evidence is the `N lines, read to EOF` declaration of every Step 4b concern;
- every skill directory in both adapters, paired by relative path;
- every launcher in both adapter catalogues, paired by filename.

Exclude generated reports (`_last-run-report*.md`, `_last-drift-report.md`, this prompt's output report
— whose previous edition Step 0 reads as a continuity source, never as an inventory member —
and `_system-gaps-report.md`), runtime/evidence state (`_run-tracker.md`, `_skill-friction.md`,
`_ritual-friction.md`, `_job-market-evidence.md`, `_cross-topic-inbox.md`), and every live artifact
outside the machinery set above. `_recommendation-ledger.md` remains in scope for
its improvement-loop contract and, with `_recommendation-ledger-closed.md`, for deduplicating new
machinery findings, but its open rows are not an operational-debt queue; `_recommendation-resolution-doctrine.md` is in scope as the case law those
four steps cite, never as a queue. Do not follow a path merely because an audited file names it: record the
declared pattern or contract in the manifest and stop at the machinery boundary.

Also exclude `.system-check/` itself. It is resumable execution evidence governed by the section above,
not canonical machinery and not live project state.

Save the counts in the working report. The inventory is the denominator: every audited file must later
have exactly one manifest owner, and every launcher/skill mirror must have exactly one pair. A second
role may read the same file for a different concern, but it never becomes a second manifest owner.

Now build the path + SHA-256 manifest from **exactly that inventory path set** and assert
`snapshot paths = inventory paths` before dispatch. Recompute both the path set and hashes immediately
before each reconciliation wave (Steps 4b and 4c) and before the final review. A changed, added, missing, or previously untracked
audited input stops the run as `blocked`; unrelated dirty files outside the inventory are preserved and
do not invalidate the snapshot.

As the second and final admission gate, assert that no inventory path is dirty relative to `HEAD` and the index.
The audit may describe only a frozen committed machinery state; an uncommitted source prompt, skill,
launcher, standard, validator or map would let the audit commit derived documentation before its source.
If one exists, take the same admission-refusal path as Step 0 rather than beginning dispatch. Only after
this check passes is the run admitted and the declared-output/close-out contract active.

## Step 2 — cold family manifests

Dispatch in parallel waves, bounded by the runtime's concurrency limit:

Every dispatch repeats the machinery boundary in its payload: do not open active-project
`PLANNING.md`, `PROJECT-BACKLOG.md`, `PROGRESS.md`, or any other live artifact. A manifest records only
the path pattern or contract stated by its assigned machinery source.

### 2A — one `analyst`, tier `standard`, per prompt family

One family is one directory containing runnable prompts and its `_internal/` components. The analyst:

1. Counts every assigned file's lines, reads every file to the real EOF, and begins with one
   `N lines, read to EOF` line per file.
2. Reads implementation steps, not only headers or frontmatter.
3. Returns one manifest row per runnable prompt with:
   `command · run-first prerequisite · configuration/modes · roles/dispatches · reads · writes/returns ·
   commit owner · handoffs/gates · explicit exclusions · close-out contract`.
4. Returns one manifest row per internal component with:
   `read by · purpose/authority · reads · writes/returns · ownership claims it establishes`.
5. Names contradictions inside the family separately from map disagreements. It does not edit files.

### 2B — root contracts, skills, and launchers

Dispatch three independent analysts:

- **Root-contract analyst, tier `deep`:** reads the root `_internal/` contracts and validator to EOF;
  reports system-wide ownership, commit, self-report, tracker, ledger, map-sync, and validation rules.
- **Skill analyst, tier `deep`:** first verifies adapter mirror parity mechanically, then reads one copy
  of every paired `SKILL.md` to EOF and returns
  `trigger · reads · writes · commits · handoff · explicit exclusions` for each skill.
- **Launcher analyst, tier `mechanical`:** proves filename and canonical-target parity, command names,
  delegation, argument contracts, and the runnable-prompt denominator.

**One manifest atom format for every analyst.** Every requested manifest field is returned as an ordered
list of source-cited atomic facts with stable `<inventory-path>::<field>::NN` IDs. Split conjunctions:
one ID asserts one fact. `none` is an explicit sentinel, not a fact and receives no ID. The root-contract
analyst applies the same form to each system-wide ownership/commit/self-report/map-sync/validation fact;
the launcher analyst and skill analyst apply it to every fact their return contract requests. IDs are
unique across the complete manifest set because the inventory path is their first component. Within one
field, assign `NN` in ascending order of the fact's first supporting source location; ties use source
column or table-cell position, then the assertion's left-to-right order inside that source text. A later
citation never changes the ID. Step 3 recomputes this order from the citations and rejects any mismatch.

No analyst receives either map's claims as instructions. The maps are the objects under review, not the
source from which the expected answer is reconstructed — **and for the same reason no analyst extracts
them either.** A third sub-step, `2C — map claims`, dispatched one `standard` analyst to return a
location-indexed inventory of every claim Step 4 must rule on. It was **deleted 2026-08-10 (`REC-079`)**
and must not be reintroduced. Two consecutive runs demoted its return — to nothing on 2026-08-09, to a
cross-check on 2026-08-10 — and the extraction was 434 lines against 1101 in the two maps, 39% of the
object, so **size was not what made it a worse input; being derived was.** A derived paraphrase can omit
a claim in a way nothing downstream can see, and the audit's completeness would then rest on a list whose
own completeness nothing checks. Step 4's concerns build the claim ledger from the maps directly: dividing
the **ruling** across bounded concerns that each read the map itself is not what that deletion forbids,
which is dividing the **source** into a paraphrase somebody else rules on.

## Step 3 — completeness gate

Before comparing a single map row:

1. Match analyst reports against the Step 1 inventory.
2. Reject a report missing any assigned file, any EOF declaration, or any requested manifest field.
3. **A present field is not a complete one.** Every non-`none` field item must be one atomic fact with its
   stable ID and a line or section citation proving it. Reject a conjunction under one ID, a duplicate
   ID, a missing ID, a field left blank instead of `none`, or a fact without per-item evidence. Access
   fields additionally name every path or prompt they claim. Re-dispatch an incomplete field exactly
   like a missing one. This raises the floor; it does **not** prove exhaustiveness — a manifest citing
   three of four paths still passes, which is precisely why the absence rule below and Step 4's
   `unverifiable` disposition exist. The maps' `Written by` cells are not a manifest field at all:
   Direction 2 derives them by inverting `writes/returns`.
4. Re-dispatch only the failed bounded concern, cold.
5. Recompute the Step 1 path + hash manifest and stop on any change.
6. Require `audited files = inventory files − 2` (the two maps have no analyst owner — see Step 1),
   `duplicate manifest ownership = 0`, `unassigned files = 0` over that same set, and launcher/skill
   mirror parity proven.
7. On acceptance, persist every accepted manifest **verbatim** to this run's
   `.system-check/.../accepted-manifests/` directory, one file per concern, named by it, and atomically
   advance `state.md`. That directory is the accepted denominator's durable copy and is what Step 4's
   concerns read, so no single context ever has to hold every manifest fact at once and a later Codex or
   Claude session does not repeat the census. A Git-ignored runtime-evidence write crosses no commit
   boundary (`_agent-runtime-standard.md`). A manifest is never edited or added to after acceptance — a
   defect in one is a re-dispatch under item 4.

If the gate cannot close, take the blocked branch in Step 7 and then execute the pipeline close-out. **A
run that took the blocked branch** additionally may not edit either map.

**The absence rule governs every verdict this prompt writes, not only a blocked one.** A sweep may report
a positive contradiction from any amount of evidence, but it may assert an **absence** — `verified — no
change`, "every field checked", "no correction owed" — only over evidence that is itself complete. A run
whose gate *closes* is not exempt: closing proves every file was read and every field was present, never
that any field was exhaustive. Where the manifests cannot settle a cell, the honest output is Step 4's
`unverifiable` disposition, never silence.

This is **not** the map-sync read licence in `_session-rules.md` → "a read of any depth rules on a
contradiction; only a whole read rules on an absence", which bounds a reader over a **source file** by
read depth. Here the evidence is a **derived manifest**, so a whole read of the source is necessary and
not sufficient.

## Step 4 — reconcile the two maps

**Reconciliation runs in two directions and is not finished until both have.** Both are divided into
bounded cold concerns, and `_internal/_system-check-reconcile-prompt.md` is the mandate each concern is
dispatched with: it owns the per-direction steps, what counts as a claim in each map, the disposition
vocabulary and the return contract, none of which are restated here. This step owns the denominator, the
partition, the dispatch, the merge and the gate.

**Why the ruling is divided.** Two consecutive admitted runs closed the 168-file manifest gate and then
failed to disposition 1,959 claim rows against 4,988 manifest facts in one context (`REC-109`); the second
reached full atomization and died at the dispositions, so the wall is the ruling volume, not the census.
What is divided is the **ruling** and never the source — Step 2's `2C` paragraph owns that distinction and
every concern below reads the map file itself. **Rule atomic claim by atomic claim, never section by
section**: a section-level pass is what published two false `README.md` cells on 2026-08-10, both
falsifiable from manifests already in hand.

### 4a — denominator and partition

1. `wc -l` each map. Its **physical lines, blank lines included**, are the sole source denominator; each
   line has the stable ID `<map-path>::LNNNN`.
2. Partition each map mechanically, so the final reviewer reproduces it rather than trusting it, and bound
   a concern on **both** quantities — its lines and its table rows. Lines alone concentrate instead of
   dividing: a catalogue row runs ~580 characters against ~75 for prose, so a line-only merge put 45% of
   `README.md`'s text into one concern of twelve. `grep -n "^## "` gives the top-level sections; a concern
   is one section, from its heading to the line before the next, plus one preamble concern for the lines
   above the first heading. Then:
   - walking in order, merge the next section into the current concern while the merged span stays
     **≤ 150 physical lines and ≤ 25 table rows** (`^|` lines, separator rows excluded);
   - a single section over either bound is **split at its own `^### ` sub-headings** — never inside a
     table and never mid-row, because a cut through a table separates a claim from the row that
     qualifies it;
   - a section over bound with no sub-headings stays whole, and the report names it as the concern
     carrying the most.
3. Assert the spans are contiguous, non-overlapping, and cover exactly `1..N` for each map. Record the
   partition — concern, map, first line, last line, lines, table rows — in the report.

### 4b — Direction 1, claim → evidence

Recompute the Step 1 path + hash manifest; any change stops the run as `blocked`. Then dispatch one cold
`analyst`, tier `standard`, per 4a concern, in parallel waves bounded by the runtime's concurrency limit,
each receiving `_internal/_system-check-reconcile-prompt.md`, `DIRECTION = claim`, its `MAP` and `SPAN`,
the accepted-manifest directory, its own scratch return path, and the machinery boundary repeated.

Merge only complete returns, then assert over the union:

- every concern declared its map read to EOF. **These declarations are the two maps' read-to-EOF
  evidence**, standing where the orchestrator's own once did — it partitions and merges, and the whole
  reads it no longer performs are performed by the concerns and by the cold final reviewer;
- each span's three classification counts sum to its length, the spans sum to each map's physical
  denominator, and unclassified, conflicting, and claim-bearing-without-claim lines are zero;
- every claim row carries exactly one disposition and cites at least one line ID **inside its own span**;
  no two concerns claim the same line;
- every `source-contradiction` row meets its bar — both clauses quoted, with their manifest fact IDs and
  the one owning inventory path. A row that does not is incomplete and its concern is re-dispatched cold.

After each concern passes its individual return contract, persist it verbatim under `direction-1/` and
atomically advance `state.md` before dispatching more work. A wave interruption therefore re-dispatches
only concerns absent from the accepted list.

### 4c — Direction 2, evidence → claim

Recompute the snapshot again, then dispatch one cold `analyst`, tier `standard`, per **Step 2 manifest
concern**, with `DIRECTION = evidence`, that concern's accepted manifest, the merged Direction 1 claim
ledger directory, both map paths, its own scratch path, and the boundary.

The reverse denominator is exactly the union of the stable manifest fact IDs accepted at Step 3. Merge and
assert: the union of dispositioned IDs equals that denominator exactly — no fact twice, none missing, none
invented; every `documented → <claim ID>` resolves to a real row in the merged ledger; every
`source-only by ownership split` quotes the rule that keeps the fact out. Report the reverse denominator
and counts for all three dispositions, per manifest field class.

**A `source-only` disposition may be ruled per class.** This sweep's cost is its disposition count, and
most of that denominator is facts neither map was ever meant to carry — one ruling repeated thousands of
times. A concern may therefore return a **class ruling**: one row per `<path class> × <manifest field>`
pair, quoting the ownership rule that keeps the entire pair out of both maps, after which every fact in the
pair inherits `source-only by ownership split → <class ruling ID>`. The counts still sum to the complete
denominator and no fact loses its disposition; what disappears is the restatement. Three limits make it
safe, and the merge enforces all three: a class ruling carries **only** `source-only` — never `documented`
and never `missing claim`, which are per-fact findings and stay per-fact; it may not be issued for any
field the `Purpose` section names as owned by either map for that path class; and the quoted rule must
appear verbatim in the source cited, or the concern is re-dispatched cold. The final reviewer reproduces
every class ruling from that same quote.

Apply the same accepted-artifact-then-state order to every Direction 2 concern under `direction-2/`.

### 4d — the completeness gate

- **`unverifiable > 0` fails the gate.** Preserve the evidence and list every unresolved claim in the
  blocked report, but do not proceed to architecture findings, final review, map corrections or
  recommendations — **except the contradiction discharge below, which a blocked branch suspends only on
  the two branches Step 7 names**. A global absence verdict has no qualified form: this audit either
  settles every in-scope claim or closes `blocked — incomplete audit`.
- **`source-contradiction > 0` does not fail it.** The question this audit asks is whether the maps
  document the machinery truthfully, and a source stating two mutually exclusive clauses cannot be
  documented truthfully by any wording; blocking on it makes the global verdict hostage to defects the run
  is expressly forbidden to repair, which is exactly how the runs of 2026-08-12 and 2026-08-13 ended.
  Each such row instead **(a)** is barred from every `verified — no change` section, **(b)** is named in
  the report with both clauses and its owning path, and **(c)** is reconciled to exactly one `REC-NNN` —
  in Step 5 on a run that reaches it, and in Step 7's blocked branch on every run that does not. A
  `source-contradiction` row that reaches Step 7 without a ledger ID fails the gate exactly like an
  `unverifiable` — **except where `unregistered` is the required value and not a missing one, which is two
  cases: the two branches Step 7 names as withholding the discharge, and any row Step 0 inherited that
  this run did not re-prove, which is carried forward rather than ruled on**. **A row that met its 4b bar
  is proved evidence, and a block after that is not a reason to discard it** (`REC-158`); a run blocked
  before 4b merged has no such row **of its own**, and this rule neither creates one nor reaches it — **it
  still carries the inherited list forward under Step 7's blocked branch**.

Enforce the documentation split while merging: `README.md` owns per-prompt facts and run order;
`_system-map.md` owns per-skill facts and cross-system wiring. Duplicate rule text in the non-owning
document is replaced by a link to its owner.

For each discrepancy record:

`claim · source evidence · correct wording · affected rows · map correction or machinery recommendation`.

Draft corrections for all map occurrences supported by evidence, but do not apply them before the cold
final review. Never broaden a correction past what the manifests prove, and never rewrite an authoritative
file to agree with a derived one.

## Step 5 — architecture findings for later refinement

Using the manifests and corrected map as evidence, identify only cross-system findings that a per-file
audit cannot see: overlapping writers, missing consumers, broken feedback loops, orphan outputs,
unowned state, circular prerequisites, rituals whose load threatens execution, and duplicated decisions.

**Every `source-contradiction` row from 4d is reconciled here too**, and this is where a run that reaches
this step discharges it: the two conflicting clauses and their owning path are the finding, and the row is
not settled until it carries exactly one ledger ID. It is a defect in the source, so the audit records it
and repairs nothing. A run blocked before this step discharges the same rows under Step 7's blocked
branch — the discharge belongs to 4d's evidence, not to this step's architecture pass. A row inherited at
Step 0 is discharged here only where this run re-proved it; one this run's exhaustive Direction 1 sweep
did not re-derive is resolved, and the completed report says so beside the count.

Reconcile each genuine improvement with `_recommendation-ledger.md`: update an existing item when it is
the same problem; create a new `REC-NNN` only when it is distinct. Preserve the ledger's resolution and
cold-review rules. Do not implement the recommendation.

## Step 6 — cold final review

Before dispatch, the orchestrator writes the **draft** system-check report to this run's durable,
immutable `review/` path with
Step 7 items 1–7 complete, item 8 set to `pending cold review`, and item 9 set to
`pending cold review — no global verdict yet`. This is the draft's producer; it is never the committed
report. The reviewer receives a **different** `review/` path for its findings and verdict, under
`_agent-runtime-standard.md`. Recompute the Step 1 path + hash manifest; if it moved, take the blocked
branch with `not run — blocked before final-review dispatch`. Otherwise dispatch one cold `reviewer`,
tier `deep`, with the accepted-manifest directory, both current maps, the 4a partition, the merged
physical-line + atomic-claim ledger, the complete reverse ledger,
the proposed map patch, and that immutable draft report. Its payload repeats the machinery-only boundary.
The reviewer reads both maps to EOF and checks:

- every inventory item has evidence — the two maps' evidence being Step 4's claim ledger and the per-concern
  EOF declarations behind it;
- the 4a partition independently reproduces from `grep -n "^## "` and the ≤ 150-line merge rule, its spans
  are contiguous, non-overlapping and exhaustive, and no claim row cites a line outside its own span;
- the physical-line category denominator independently reproduces, every in-scope factual
  assertion became an atomic claim row, the category sum equals the physical-line denominator, and no
  `context/syntax` or `out of scope` line hides one;
- every claim-ledger row carries one disposition, every manifest fact carries one reverse disposition,
  **both** reconciliation directions ran, and no
  `verified — no change` section covers a cell not dispositioned `correct`;
- every `source-contradiction` row quotes both conflicting clauses with their manifest fact IDs, names one
  owning inventory path, and carries exactly one ledger ID — the state is a route to its discharge, never
  a way past a claim the manifests could have settled;
- every class ruling quotes a rule that appears verbatim in the source it cites, covers no field either
  map owns for that path class, and carries only `source-only` dispositions;
- on a carry-forward run, every carried artifact's justifying hashes recompute against this run's snapshot,
  no Direction 2 concern was carried across an edited map, and no ruling was carried across a method change
  that narrowed what its concern was given;
- every proposed correction follows from that evidence;
- every occurrence of a changed claim was updated;
- no authoritative machinery file was edited;
- corrections and recommendations are separated correctly;
- the README/system-map ownership split is complete and contains no rule fork;
- no live artifact or operational-state claim entered the inventory, denominator, report, or verdict;
- the final global verdict is no broader than the completed audit.

Return `approve`, `approve-with-tightening`, or `reject`, with specific corrections. Apply only an
approved form. A rejection takes the blocked Step 7 branch with no map or ledger edits — one of the two
branches that withhold 4d's contradiction discharge, which Step 7 names and owns, because a cold gate has
just contested the evidence those rows rest on. The blocked report still names them, `unregistered`, so
the next run inherits them.

## Step 7 — report, validate, and commit the audit

Overwrite `notes/prompts/system/_internal/_system-check-report.md` with:

1. date, starting commit, branch, and `Status: complete | blocked`;
2. inventory and dispatch coverage counts, and — on a carry-forward run — the anchor run ID plus the
   carried/derived split per step, or the statement that the mode degraded to `full` for want of an anchor;
3. validator baseline and final result;
4. README catalogue coverage and corrections — **on a run that reached Step 4** (the inherited
   `source-contradiction` list required by the blocked branch below is written on **every** blocked report,
   whether or not Step 4 was reached): the 4a partition table,
   its claim-ledger counts by disposition, the physical-line category reconciliation with zero unclassified
   lines, `verified — no change` sections covering **only** cells dispositioned `correct`, every
   `unverifiable` claim named with the evidence that would settle it, every `source-contradiction` claim
   named with both clauses, its owning path and its ledger ID — or `unregistered`, on the two branches
   Step 7 names as withholding the discharge and for any row inherited at Step 0 and not re-proved — and
   the evidence → claim sweep's complete
   manifest-fact denominator, dispositions and findings, with every class ruling listed by its covered
   pair, its quoted rule and its inherited fact count;
5. system-map wiring/skill coverage and corrections, on those same terms;
6. boundary proof: the excluded live-artifact classes and confirmation that none entered the denominator;
7. architecture findings linked to their recommendation IDs;
8. exactly one final-review state: `approve`, `approve-with-tightening`, `reject`,
   `not completed — reviewer unavailable`, or `not run — blocked before final-review dispatch`;
9. global verdict: `maps verified`, `maps corrected`, or `blocked — incomplete audit`. The first two
   assert an absence and therefore require `unverifiable: 0`. Any positive count forces
   `blocked — incomplete audit`; `maps verified` and `maps corrected` have no qualified form. The
   `source-contradiction` count is printed beside the verdict and does **not** force the blocked branch
   while every one of its rows carries a ledger ID: the verdict rules on the maps, and those rows rule on
   the sources, which this run may not repair.

After writing either the completed or blocked report, persist the same terminal state and exact next
action in `state.md` before any commit. `blocked` remains resumable only when Victor explicitly names
that run on a later invocation; `complete` is immutable historical evidence.

**Completed branch:** apply the reviewer-approved map patch and justified recommendation rows, then run
the validator again with `-MachineryOnly`. Inspect `git diff` and prove that only the declared maps,
audit report, and justified ledger rows changed. Because every writable path was clean at admission,
assert the complete working-tree delta on each is run-owned and equals the approved patch plus the report;
any extra hunk blocks instead of being staged. Stage only those exact paths. Run `git status` immediately
before staging and again immediately before committing.
Commit those files atomically as:

`docs: audit and synchronize prompt system`

If the audit found no map or recommendation changes, the report is still written and committed: it is
the durable evidence that the full sweep happened.

**Blocked branch:** discard any unapproved draft correction, then execute 4d's contradiction discharge for
every `source-contradiction` row that met its 4b bar — one `REC-NNN` each, deduplicated against both
ledger files, on the ledger's own terms and implementing nothing. **This branch owns the exceptions to the
discharge, and there are exactly two**: a reviewer `reject` and the validator reversal below both withhold
it, because in each a later gate has contested the evidence or the write. `unregistered` has one further
legitimate source, which is not an exception but a carry-forward: a row inherited at Step 0 that this run
did not re-prove. Then write the report with
`Status: blocked`, the completed evidence, the failed gate and `blocked — incomplete audit`. **Name every
proved `source-contradiction` row with both clauses, its owning path and either its ledger ID or the word
`unregistered`**, and **repeat, verbatim and still `unregistered`, every row inherited at Step 0 that this
run did not re-prove** — that list is what the next run's Step 0 inherits, this report is overwritten by
every admitted run, so a row it does not carry is gone; a blocked run holding no such row says so in one
line. Item 8 uses
the exact final-review state vocabulary above: a pre-dispatch snapshot failure is `not run — blocked
before final-review dispatch`; an exhausted dispatch ladder is `not completed — reviewer unavailable`;
and a returned rejection is `reject`.

If the **final validator** fails after an approved patch was applied, reverse only the run-owned map and
ledger hunks using the stored approved patch — never `git checkout`, reset, or a whole-file overwrite.
Verify those paths byte-for-byte match their frozen pre-application content, including any unrelated
pre-existing dirt, and verify no run-owned map/ledger hunk remains. Then write and commit the blocked
report alone.

Commit that report as `docs: record blocked prompt system audit` — alone, or with the discharged ledger
rows when this branch wrote any, staged after the same `git status` checks as the completed branch and
proven by `git diff` to contain nothing else. Then continue to Step 8 so the
separate pipeline report and tracker commit also records the blocked outcome.

## Step 8 — pipeline close-out

Execute the close-out checks, ledger reconciliation, report, tracker and commit rules in
`notes/prompts/_internal/_pipeline-self-report.md`. Its report is about how this audit pipeline behaved,
not the audit findings above. **System-check-specific boundary:** never apply the contract's at-end prompt
refinement during this audit, because that would mutate source machinery inside the run that audited it;
leave any earned refinement finding `open` for a later, separately authorised cold adjudication. Update
the `system-check` row under
`## Global pipeline prompts (no per-target scope)` in `_run-tracker.md`, then make the separate report +
tracker commit the shared contract requires.

For the close-out's declared-output check, the audit report is unconditional. The two maps and ledger are
conditional outputs: an unchanged file is satisfied only by its explicit `verified — no change` section
in the committed audit report and must not be misreported as a skipped step. On a blocked run, which has
no such section, the two maps are satisfied by Step 3's rule that a blocked run may not edit either one,
recorded in the report as the failed gate; the ledger's satisfying statement is the report's
`source-contradiction` list — including one that reads `none`.

## Acceptance gate

A run is `completed` only when all of these are true:

- every analyst-owned inventory file was read to EOF and appears exactly once in the manifests, and every
  Step 4b concern carries its own `N lines, read to EOF` declaration for the map it ruled on;
- the 4a partition is contiguous, non-overlapping and exhaustive over both maps; every atomic claim
  derived from every in-scope README prompt-contract field and system-map
  wiring/skill field carries exactly one Step 4 disposition; both maps' physical-line category counts
  sum exactly, with zero unclassified/conflicting or claim-bearing-without-claim lines; every manifest
  fact has one reverse disposition; `unverifiable = 0`; every `source-contradiction` row carries both
  clauses and one ledger ID; and **both** reconciliation directions ran;
- every carried artifact was justified by recomputed hashes and holds the same standing as a derived one;
- every supported correction survived the cold final review;
- no live project, learning, practice, application, or debt state entered the audit denominator;
- no active-project `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md` was opened even for orientation;
- the final validator exits successfully;
- the audit commit and the separate self-report commit both pass their stat checks.

Anything less is `blocked`, never “mostly verified”.
