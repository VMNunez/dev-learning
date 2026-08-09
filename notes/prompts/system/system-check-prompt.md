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
- **No single-agent fallback.** If the required cold roles cannot be dispatched, close as `blocked`
  through `_pipeline-self-report.md`; do not publish a partial map correction.

## Declared outputs

1. Corrected `notes/prompts/README.md`, when any catalogue claim is false.
2. Corrected `notes/prompts/_internal/_system-map.md`, when any wiring claim is false.
3. Overwritten `notes/prompts/system/_internal/_system-check-report.md` on every resolved run, including
   a blocked run.
4. New or updated rows in `notes/prompts/_internal/_recommendation-ledger.md` only for genuine machinery
   improvements the audit discovered; map corrections themselves are not recommendations.
5. The universal pipeline report and `_run-tracker.md` update from `_pipeline-self-report.md`.

## Step 0 — preflight and provenance

1. Confirm the repository root and active branch. Record `git status --short`; preserve every unrelated
   change and refuse to stage it.
2. Read this prompt's previous `_last-run-report.md` `Status:` line if the file exists, following the
   run-start rule in `_pipeline-self-report.md`. Surface an open finding; never apply it before this run.
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
  under review;
- every skill directory in both adapters, paired by relative path;
- every launcher in both adapter catalogues, paired by filename.

Exclude generated reports (`_last-run-report*.md` and this prompt's output report), runtime/evidence
state (`_run-tracker.md`, `_skill-friction.md`, `_job-market-evidence.md`, `_cross-topic-inbox.md`), and
every live artifact outside the machinery set above. `_recommendation-ledger.md` remains in scope for
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

## Step 2 — cold family manifests

Dispatch in parallel waves, bounded by the runtime's concurrency limit:

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

### 2C — map claims

Dispatch one independent analyst:

- **Map-claims analyst, tier `standard`:** reads `notes/prompts/README.md` and
  `notes/prompts/_internal/_system-map.md` to EOF and returns a location-indexed inventory of every claim
  Step 4 must rule on. It extracts claims only; it never treats them as expected truth.

No analyst receives either map's claims as instructions. The maps are the objects under review, not the
source from which the expected answer is reconstructed.

## Step 3 — completeness gate

Before comparing a single map row:

1. Match analyst reports against the Step 1 inventory.
2. Reject a report missing any assigned file, any EOF declaration, or any requested manifest field.
3. Re-dispatch only the failed bounded concern, cold.
4. Recompute the Step 1 path + hash manifest and stop on any change.
5. Require `audited files = inventory files`, `duplicate manifest ownership = 0`, `unassigned files = 0`, and
   launcher/skill mirror parity proven.

If the gate cannot close, take the blocked branch in Step 7 and then execute the pipeline close-out. A
partial sweep may report positive contradictions but may not claim an absence or edit maps.

## Step 4 — reconcile the two maps

The orchestrator compares the completed manifests against every relevant claim, not merely the first
name hit.

### `notes/prompts/README.md`

Check all counts and group lists; every catalogue row's public command, run-first prerequisite,
configuration/modes and received inputs, reads, writes/returns, dispatched roles and isolation, commit
owner, handoffs/gates, and explicit exclusions; internal-component rows; launcher naming and parity;
orchestrator/single-shot classification; batch/global status; and typical run order.

### `notes/prompts/_internal/_system-map.md`

Check the opening system properties; every chain step in §§2–6; every applicable writer/reader row in
§7; all `PROGRESS.md` ownership claims in §8; every skill row in §9 — trigger, received inputs, reads,
writes/returns, isolation, commit owner, handoffs/gates, and explicit exclusions; every machinery debt
in §10; every symptom route in §11; and the improvement/validation loop in §12. Operational state is
never loaded to verify a structural claim: verify the prompt or skill contract that declares the path,
schema, owner, or gate.

Enforce the documentation split while reconciling: `README.md` owns per-prompt facts and run order;
`_system-map.md` owns per-skill facts and cross-system wiring. Replace duplicate rule text in the
non-owning document with a link to its owner.

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

Recompute the Step 1 path + hash manifest, then dispatch one cold `reviewer`, tier `deep`, with the
complete manifests, both current maps, the proposed map patch, and the draft system-check report. The
reviewer checks:

- every inventory item has evidence;
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
4. README catalogue coverage and corrections, including explicit `verified — no change` sections;
5. system-map wiring/skill coverage and corrections, including explicit `verified — no change` sections;
6. boundary proof: the excluded live-artifact classes and confirmation that none entered the denominator;
7. architecture findings linked to their recommendation IDs;
8. final reviewer verdict;
9. global verdict: `maps verified`, `maps corrected`, or `blocked — incomplete audit`.

**Completed branch:** apply the reviewer-approved map patch and justified recommendation rows, then run
the validator again with `-MachineryOnly`. Inspect `git diff` and prove that only the declared maps,
audit report, and justified ledger rows changed. Run `git status` immediately before staging and again
immediately before committing.
Commit those files atomically as:

`docs: audit and synchronize prompt system`

If the audit found no map or recommendation changes, the report is still written and committed: it is
the durable evidence that the full sweep happened.

**Blocked branch:** discard any unapproved draft correction, write the report with
`Status: blocked`, the completed evidence, the failed gate and `blocked — incomplete audit`, and commit
that report alone as `docs: record blocked prompt system audit`. Then continue to Step 8 so the separate
pipeline report and tracker commit also records the blocked outcome.

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

- every inventory file was read to EOF and appears exactly once in the manifests;
- every README prompt-contract field and every system-map wiring/skill field in scope was checked;
- every supported correction survived the cold final review;
- no live project, learning, practice, application, or debt state entered the audit denominator;
- the final validator exits successfully;
- the audit commit and the separate self-report commit both pass their stat checks.

Anything less is `blocked`, never “mostly verified”.
