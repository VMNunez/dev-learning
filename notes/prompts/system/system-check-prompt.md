# System check — on-demand audit of the whole prompt and skill system

> **▶ Run first:** nothing. This is a global maintenance audit, launched only when Victor explicitly
> asks for `/system-check`, normally after a group of machinery changes. It is never a per-commit gate,
> a session-start ritual, or an automatic consequence of `map-sync`.

Read `notes/prompts/_internal/_agent-runtime-standard.md` before dispatching any role. This prompt is a
hands-off orchestrator and uses its role, isolation, whole-file, and close-out contracts exactly.

## Purpose

Establish whether the two derived maps still tell the truth about the machinery:

- `notes/prompts/README.md` — every runnable and internal prompt component, what it does, what it reads,
  what it generates or updates, prerequisites, launcher parity, grouping, and run order.
- `notes/prompts/_internal/_system-map.md` — cross-prompt chains, writers and readers, `PROGRESS.md`
  ownership, skills, triggers, handoffs, gates, debts, symptoms, and the improvement loop.

The audit also surfaces operational debt already recorded by the system, so Victor receives one
prioritised view instead of having to notice each stale flag or overdue gate independently.

## Boundaries

- **The machinery wins.** A disagreement is repaired in the maps; never edit a prompt, `SKILL.md`,
  standard, launcher, project plan, backlog, tracker debt, or source artifact to make a map look right.
- **Derived files may be corrected.** This prompt may edit only `notes/prompts/README.md`,
  `notes/prompts/_internal/_system-map.md`, its audit report, the recommendation ledger for findings,
  and the universal run report/tracker files required by the close-out contract.
- **Recommendations are not repairs.** A duplicated responsibility, missing gate, expensive ritual,
  broken feedback loop, or unclear ownership is recorded for later adjudication; this run does not
  refactor the machinery that produced it.
- **Explicit invocation only.** Do not schedule, infer, or chain this run from another prompt or skill.
- **Global only.** There is no target or batch mode. A partial inventory cannot produce a global verdict.
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
3. Run `notes/prompts/_internal/validate-prompt-system.ps1` as the mechanical baseline. Record every
   `PASS`, `REPORT`, and failure. A structural failure does not replace the semantic audit.
4. Record the starting commit hash for provenance. The frozen working-tree snapshot is built only after
   Step 1 has established its authoritative path denominator.

## Step 1 — build the exhaustive inventory mechanically

The orchestrator enumerates, from disk rather than from either map:

- every runnable prompt under `notes/prompts/`;
- every internal Markdown component under each prompt family, excluding `_last-run-report*.md` and the
  output report of this prompt;
- the root prompt-system contracts and PowerShell validator;
- `notes/prompts/README.md` and `notes/prompts/_internal/_system-map.md` themselves, as the two objects
  under review;
- every skill directory in both adapters, paired by relative path;
- every launcher in both adapter catalogues, paired by filename;
- every `PROJECT-BACKLOG.md` whole, the §0/§23 sections of every project `PLANNING.md`, and the SQL
  doctrine §9 plus route status sections needed for the debt sweep.

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
   commit owner · handoffs/gates/debts · close-out contract`.
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

### 2C — map claims and operational debt

Dispatch two more independent analysts:

- **Map-claims analyst, tier `standard`:** reads `notes/prompts/README.md` and
  `notes/prompts/_internal/_system-map.md` to EOF and returns a location-indexed inventory of every claim
  Step 4 must rule on. It extracts claims only; it never treats them as expected truth.
- **Debt analyst, tier `standard`:** reads `_run-tracker.md` and `_recommendation-ledger.md`, every project
  backlog to EOF, the named project plan sections, and the SQL doctrine/route sections from Step 1. It
  returns the Step 5 queue evidence and owns that debt corpus in the completeness denominator.

No analyst receives either map's claims as instructions. The maps are the objects under review, not the
source from which the expected answer is reconstructed.

## Step 3 — completeness gate

Before comparing a single map row:

1. Match analyst reports against the Step 1 inventory.
2. Reject a report missing any assigned file, any EOF declaration, or any requested manifest field.
3. Re-dispatch only the failed bounded concern, cold.
4. Recompute the Step 0 path + hash manifest and stop on any change.
5. Require `audited files = inventory files`, `duplicate manifest ownership = 0`, `unassigned files = 0`, and
   launcher/skill mirror parity proven.

If the gate cannot close, take the blocked branch in Step 8 and then execute the pipeline close-out. A
partial sweep may report positive contradictions but may not claim an absence or edit maps.

## Step 4 — reconcile the two maps

The orchestrator compares the completed manifests against every relevant claim, not merely the first
name hit.

### `notes/prompts/README.md`

Check all counts and group lists; every catalogue row's description, reads, and generates/updates cells;
internal-component rows; run-first dependencies; launcher naming and parity; orchestrator/single-shot
classification; batch/global status; and typical run order.

### `notes/prompts/_internal/_system-map.md`

Check the opening system properties; every chain step in §§2–6; every applicable writer/reader row in
§7; all `PROGRESS.md` ownership claims in §8; every skill row in §9; every debt in §10; every symptom
route in §11; and the improvement/validation loop in §12.

For each discrepancy record:

`claim · source evidence · correct wording · affected rows · map correction or machinery recommendation`.

Draft corrections for all map occurrences supported by evidence, but do not apply them before the cold
final review. Never broaden a correction past what the manifests prove, and never rewrite an authoritative
file to agree with a derived one.

## Step 5 — operational-debt sweep

Independently of map truth, collect and prioritise:

- every live `⚠ stale` flag and prerequisite-relevant empty cell in `_run-tracker.md`;
- every `open` or `accepted` recommendation in `_recommendation-ledger.md`;
- every open High/Medium backlog task;
- every `⏸ Deferred` backlog marker whose named gate is now due;
- each project §0/§23 gate and SQL doctrine §9 gate whose observable precondition is satisfied but whose
  required prompt/ritual has not closed it.

Return one queue ordered by: blocking correctness/security work, due gates, stale prerequisites, then
non-blocking improvements. Every row names the evidence, why it is due now, and the exact prompt or
ritual that clears it. Do not clear or repair the debt in this run.

## Step 6 — architecture findings for later refinement

Using the manifests and corrected map as evidence, identify only cross-system findings that a per-file
audit cannot see: overlapping writers, missing consumers, broken feedback loops, orphan outputs,
unowned state, circular prerequisites, rituals whose load threatens execution, and duplicated decisions.

Reconcile each genuine improvement with `_recommendation-ledger.md`: update an existing item when it is
the same problem; create a new `REC-NNN` only when it is distinct. Preserve the ledger's resolution and
cold-review rules. Do not implement the recommendation.

## Step 7 — cold final review

Recompute the Step 0 path + hash manifest, then dispatch one cold `reviewer`, tier `deep`, with the
complete manifests, both current maps, the proposed map patch, and the draft system-check report. The
reviewer checks:

- every inventory item has evidence;
- every proposed correction follows from that evidence;
- every occurrence of a changed claim was updated;
- no authoritative machinery file was edited;
- corrections and recommendations are separated correctly;
- the debt queue names an actual owner and observable due condition;
- the final global verdict is no broader than the completed audit.

Return `approve`, `approve-with-tightening`, or `reject`, with specific corrections. Apply only an
approved form. A rejection takes the blocked Step 8 branch with no map or ledger edits.

## Step 8 — report, validate, and commit the audit

Overwrite `notes/prompts/system/_internal/_system-check-report.md` with:

1. date, starting commit, branch, and `Status: complete | blocked`;
2. inventory and dispatch coverage counts;
3. validator baseline and final result;
4. map corrections, including explicit `verified — no change` sections;
5. prioritised operational-debt queue;
6. architecture findings linked to their recommendation IDs;
7. final reviewer verdict;
8. global verdict: `maps verified`, `maps corrected`, or `blocked — incomplete audit`.

**Completed branch:** apply the reviewer-approved map patch and justified recommendation rows, then run
the validator again. Inspect `git diff` and prove that only the declared maps, audit report, and justified
ledger rows changed. Run `git status` immediately before staging and again immediately before committing.
Commit those files atomically as:

`docs: audit and synchronize prompt system`

If the audit found no map or recommendation changes, the report is still written and committed: it is
the durable evidence that the full sweep happened.

**Blocked branch:** discard any unapproved draft correction, write the report with
`Status: blocked`, the completed evidence, the failed gate and `blocked — incomplete audit`, and commit
that report alone as `docs: record blocked prompt system audit`. Then continue to Step 9 so the separate
pipeline report and tracker commit also records the blocked outcome.

## Step 9 — pipeline close-out

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
- every README and system-map claim in scope was checked;
- every supported correction survived the cold final review;
- the operational-debt queue is complete and owner-routed;
- the final validator exits successfully;
- the audit commit and the separate self-report commit both pass their stat checks.

Anything less is `blocked`, never “mostly verified”.
