# System check — on-demand audit of the whole prompt and skill system

> **▶ Run first:** nothing. This is a global maintenance audit, launched only when Victor explicitly
> asks for `/system-check`, normally after a group of machinery changes. It is never a per-commit gate,
> a session-start ritual, or an automatic consequence of `map-sync`.

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any role. This prompt is a
hands-off orchestrator and uses its role, isolation, whole-file, and close-out contracts exactly.

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
  and the universal run report/tracker files required by the close-out contract.
- **Recommendations are not repairs.** A duplicated responsibility, missing gate, expensive ritual,
  broken feedback loop, or unclear ownership is recorded for later adjudication; this run does not
  refactor the machinery that produced it.
- **Explicit invocation only.** Do not schedule, infer, or chain this run from another prompt or skill.
- **Global only.** There is no target or batch mode. A partial inventory cannot produce a global verdict.
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
   improvements the audit discovered; map corrections themselves are not recommendations.
5. The universal pipeline report and `_run-tracker.md` update from `_pipeline-self-report.md`.

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
   finding before this run.
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
  `_recommendation-ledger.md`, plus `_shared-context.md` (the shared canonical runtime input) and the
  PowerShell validator;
- `notes/prompts/README.md` and `notes/prompts/_internal/_system-map.md` themselves, as the two objects
  under review. These two are the only inventory items with **no analyst manifest owner**: since
  `REC-079` the orchestrator reads them itself in Step 4. They stay in the inventory and in the path +
  hash snapshot, and are excluded from Step 3's `audited files` / `unassigned files` denominators; their
  read-to-EOF evidence is the two `N lines, read to EOF` declarations at the head of Step 4's claim
  ledger;
- every skill directory in both adapters, paired by relative path;
- every launcher in both adapter catalogues, paired by filename.

Exclude generated reports (`_last-run-report*.md`, `_last-drift-report.md`, this prompt's output report
and `_system-gaps-report.md`), runtime/evidence state (`_run-tracker.md`, `_skill-friction.md`,
`_ritual-friction.md`, `_job-market-evidence.md`, `_cross-topic-inbox.md`), and every live artifact
outside the machinery set above. `_recommendation-ledger.md` remains in scope for
its improvement-loop contract and for deduplicating new machinery findings, but its open rows are not
an operational-debt queue. Do not follow a path merely because an audited file names it: record the
declared pattern or contract in the manifest and stop at the machinery boundary.

Save the counts in the working report. The inventory is the denominator: every audited file must later
have exactly one manifest owner, and every launcher/skill mirror must have exactly one pair. A second
role may read the same file for a different concern, but it never becomes a second manifest owner.

Now build the path + SHA-256 manifest from **exactly that inventory path set** and assert
`snapshot paths = inventory paths` before dispatch. Recompute both the path set and hashes immediately
before reconciliation and before the final review. A changed, added, missing, or previously untracked
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
own completeness nothing checks. Step 4 builds its claim ledger from the maps directly.

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

The orchestrator compares the completed manifests against every relevant claim, not merely the first
name hit. **Reconciliation runs in two directions and is not finished until both have.**

**Build the claim ledger first, and build it from the maps themselves.** This is the orchestrator's own
work and is never dispatched: the maps are the object under review, so a separate analyst's extraction
would be a derived paraphrase (`REC-079`). The ledger itself therefore needs a mechanically checkable
denominator rather than a trust claim:

1. Read both maps to EOF. The sole source denominator is their **physical lines, blank lines included**;
   each has the stable ID `<map-path>::LNNNN`.
2. Classify every line exactly once as `claim-bearing`, `context/syntax`, or `out of scope`. The latter
   two require a reason. A multi-line assertion marks every participating line `claim-bearing`; a table
   separator, heading, fence marker or blank line is `context/syntax`.
3. Split the factual assertions on every claim-bearing line into atomic claim rows. One claim row asserts
   one fact and cites one or more physical-line IDs plus table row/column coordinates when applicable.
   Several claims may cite one line, and one claim may span several lines; the line's classification is
   still singular. Every claim-bearing line must reach at least one atomic claim, and every atomic claim
   must reach at least one claim-bearing line.
4. Record `physical lines · claim-bearing · context/syntax · out of scope · atomic claims · unclassified
   lines · conflicting classifications · claim-bearing lines with no claim` separately for each map.
   The category counts must sum to physical lines. The two EOF declarations and these equalities are the
   completeness proof the final reviewer independently recomputes.

**Rule atomic claim by atomic claim, never section by section** — a section-level pass is what published
two false `README.md` cells on 2026-08-10, both falsifiable from manifests the orchestrator was already
holding.

Give every row exactly one disposition:

- `correct` — the manifests **positively support** the cell as written. Only these may be covered by a
  `verified — no change` section in Step 7.
- `incorrect` — the manifests contradict it; draft the correction.
- `unverifiable` — the completed manifests neither support nor contradict it. **This is a finding, not a
  pass.** Record every one in the report with the evidence that would settle it. Silence here is the
  overclaim the absence rule above forbids. A cell may be recorded `unverifiable` only after **one
  bounded attempt to settle it has failed** — a re-dispatch of the owning bounded concern under Step 3,
  or the orchestrator's own read of the single named source file — and the report states which was tried.

After those bounded attempts, `unverifiable > 0` fails the Step 4 completeness gate. Preserve the
evidence and list every unresolved claim in the blocked report, but do not proceed to architecture
findings, final review, map corrections or recommendations. A global absence verdict has no qualified
form: this audit either settles every in-scope claim or closes `blocked — incomplete audit`.

### Direction 1 — claim → evidence

#### `notes/prompts/README.md`

Check every current-machinery claim throughout the whole file, including all counts and group lists;
every catalogue row's public command, run-first prerequisite,
configuration/modes and received inputs, reads, writes/returns, dispatched roles and isolation, commit
owner, handoffs/gates, and explicit exclusions; internal-component rows; launcher naming and parity;
orchestrator/single-shot classification; the hub/writer tables; producer/consumer edges and diagrams;
batch/global status; runtime tiers; and every typical run order. Historical narrative with no current
contract is still line-classified but may be `out of scope` only with that explicit reason.

#### `notes/prompts/_internal/_system-map.md`

Check every current-machinery claim throughout the whole file: the opening system properties; every
chain step in §§2–6; every applicable writer/reader row in
§7; all `PROGRESS.md` ownership claims in §8; every skill row in §9 — trigger, received inputs, reads,
writes/returns, isolation, commit owner, handoffs/gates, and explicit exclusions; every machinery debt
in §10; every symptom route in §11; the improvement/validation loop in §12; and every block/trigger/load
claim in §13. Historical narrative with no current contract may be `out of scope` only with that explicit
reason. Operational state is
never loaded to verify a structural claim: verify the prompt or skill contract that declares the path,
schema, owner, or gate.

Enforce the documentation split while reconciling: `README.md` owns per-prompt facts and run order;
`_system-map.md` owns per-skill facts and cross-system wiring. Replace duplicate rule text in the
non-owning document with a link to its owner.

### Direction 2 — evidence → claim

Direction 1 catches a **false** claim. It cannot catch an **incomplete** one: a cell naming two of five
items agrees with every manifest fact about those two. Walk **every atomic manifest fact**, not only file
access, in the opposite direction:

- for runnable prompts: command, prerequisite, every configuration key/value or received input, each
  role/dispatch/isolation fact, every read and write/return, commit owner, handoff/gate, exclusion and
  close-out fact;
- for internal components: every `read by`, purpose/authority, read, write/return and ownership fact;
- for skills: trigger and received inputs, every read and write/return, isolation, commit owner,
  handoff/gate and exclusion;
- for root contracts, launchers and validator: every system-wide fact that belongs in either map under
  the ownership split stated in `Purpose`.

The reverse denominator is exactly the union of the stable manifest fact IDs accepted at Step 3. Give
each ID exactly one reverse disposition: `documented → <claim-ledger ID>`,
`source-only by ownership split → <authoritative source>`, or `missing claim`. Silence is not a fourth
state. A manifest fact with no home in either map is corrected exactly like a false claim; a fact that
legitimately stays in its authoritative source must name the ownership rule that keeps it out. Report the
reverse denominator and counts for all three dispositions, per manifest field class.

For each discrepancy record:

`claim · source evidence · correct wording · affected rows · map correction or machinery recommendation`.

Draft corrections for all map occurrences supported by evidence, but do not apply them before the cold
final review. Never broaden a correction past what the manifests prove, and never rewrite an authoritative
file to agree with a derived one.

## Step 5 — architecture findings for later refinement

Using the manifests and corrected map as evidence, identify only cross-system findings that a per-file
audit cannot see: overlapping writers, missing consumers, broken feedback loops, orphan outputs,
unowned state, circular prerequisites, rituals whose load threatens execution, and duplicated decisions.

Reconcile each genuine improvement with `_recommendation-ledger.md`: update an existing item when it is
the same problem; create a new `REC-NNN` only when it is distinct. Preserve the ledger's resolution and
cold-review rules. Do not implement the recommendation.

## Step 6 — cold final review

Before dispatch, the orchestrator writes the **draft** system-check report to an orchestrator-owned,
immutable runtime scratch path with
Step 7 items 1–7 complete, item 8 set to `pending cold review`, and item 9 set to
`pending cold review — no global verdict yet`. This is the draft's producer; it is never the committed
report. The reviewer receives a **different** scratch path for its findings and verdict, under
`_agent-runtime-standard.md`. Recompute the Step 1 path + hash manifest; if it moved, take the blocked
branch with `not run — blocked before final-review dispatch`. Otherwise dispatch one cold `reviewer`,
tier `deep`, with
the complete manifests, both current maps, the physical-line + atomic-claim ledger, the complete reverse ledger,
the proposed map patch, and that immutable draft report. Its payload repeats the machinery-only boundary.
The reviewer reads both maps to EOF and checks:

- every inventory item has evidence — the two maps' evidence being Step 4's claim ledger and its two
  EOF declarations;
- the physical-line category denominator independently reproduces, every in-scope factual
  assertion became an atomic claim row, the category sum equals the physical-line denominator, and no
  `context/syntax` or `out of scope` line hides one;
- every claim-ledger row carries one disposition, every manifest fact carries one reverse disposition,
  **both** reconciliation directions ran, and no
  `verified — no change` section covers a cell not dispositioned `correct`;
- every proposed correction follows from that evidence;
- every occurrence of a changed claim was updated;
- no authoritative machinery file was edited;
- corrections and recommendations are separated correctly;
- the README/system-map ownership split is complete and contains no rule fork;
- no live artifact or operational-state claim entered the inventory, denominator, report, or verdict;
- the final global verdict is no broader than the completed audit.

Return `approve`, `approve-with-tightening`, or `reject`, with specific corrections. Apply only an
approved form. A rejection takes the blocked Step 7 branch with no map or ledger edits.

## Step 7 — report, validate, and commit the audit

Overwrite `notes/prompts/system/_internal/_system-check-report.md` with:

1. date, starting commit, branch, and `Status: complete | blocked`;
2. inventory and dispatch coverage counts;
3. validator baseline and final result;
4. README catalogue coverage and corrections — **on a run that reached Step 4**: its claim-ledger counts
   by disposition, the physical-line category reconciliation with zero unclassified lines,
   `verified — no change` sections covering **only** cells dispositioned `correct`, every `unverifiable`
   claim named with the evidence that would settle it, and the evidence → claim sweep's complete
   manifest-fact denominator, dispositions and findings;
5. system-map wiring/skill coverage and corrections, on those same four terms;
6. boundary proof: the excluded live-artifact classes and confirmation that none entered the denominator;
7. architecture findings linked to their recommendation IDs;
8. exactly one final-review state: `approve`, `approve-with-tightening`, `reject`,
   `not completed — reviewer unavailable`, or `not run — blocked before final-review dispatch`;
9. global verdict: `maps verified`, `maps corrected`, or `blocked — incomplete audit`. The first two
   assert an absence and therefore require `unverifiable: 0`. Any positive count forces
   `blocked — incomplete audit`; `maps verified` and `maps corrected` have no qualified form.

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

**Blocked branch:** discard any unapproved draft correction, write the report with
`Status: blocked`, the completed evidence, the failed gate and `blocked — incomplete audit`. Item 8 uses
the exact final-review state vocabulary above: a pre-dispatch snapshot failure is `not run — blocked
before final-review dispatch`; an exhausted dispatch ladder is `not completed — reviewer unavailable`;
and a returned rejection is `reject`.

If the **final validator** fails after an approved patch was applied, reverse only the run-owned map and
ledger hunks using the stored approved patch — never `git checkout`, reset, or a whole-file overwrite.
Verify those paths byte-for-byte match their frozen pre-application content, including any unrelated
pre-existing dirt, and verify no run-owned map/ledger hunk remains. Then write and commit the blocked
report alone.

Commit that report alone as `docs: record blocked prompt system audit`. Then continue to Step 8 so the
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
in the committed audit report and must not be misreported as a skipped step.

## Acceptance gate

A run is `completed` only when all of these are true:

- every analyst-owned inventory file was read to EOF and appears exactly once in the manifests, and both
  maps carry the orchestrator's own `N lines, read to EOF` declaration at the head of Step 4's claim
  ledger;
- every atomic claim derived from every in-scope README prompt-contract field and system-map
  wiring/skill field carries exactly one Step 4 disposition; both maps' physical-line category counts
  sum exactly, with zero unclassified/conflicting or claim-bearing-without-claim lines; every manifest
  fact has one reverse disposition; `unverifiable = 0`; and **both** reconciliation directions ran;
- every supported correction survived the cold final review;
- no live project, learning, practice, application, or debt state entered the audit denominator;
- no active-project `PLANNING.md`, `PROJECT-BACKLOG.md` or `PROGRESS.md` was opened even for orientation;
- the final validator exits successfully;
- the audit commit and the separate self-report commit both pass their stat checks.

Anything less is `blocked`, never “mostly verified”.
