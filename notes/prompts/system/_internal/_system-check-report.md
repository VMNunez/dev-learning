# System check — machinery audit report

Date: 2026-08-12
Starting commit: `000f5c792f60cc8015884c75c9477de1c37c63a8`
Branch: `fix/backend-backlog`
Status: blocked

## 1 — Admission and frozen inventory

Both admission gates passed. Every writable audit output was clean, and every inventory path was clean
relative to `HEAD` and the index. The frozen inventory contained **170 paths**:

| Class | Count |
|---|---:|
| Canonical runnable prompts | 31 |
| Family internal components | 32 |
| Root contracts + validator | 9 |
| Maps under review | 2 |
| Skill files (17 mirrored pairs) | 34 |
| Launchers (31 mirrored pairs) | 62 |
| **Total** | **170** |

The starting path + SHA-256 snapshot was
`9ab69d7f2ee7a140fe3fbe902183aa5efddfbd503d41bfa6309996aeda44d14f`. It was recomputed after
the analyst waves with the same 170 paths and the same digest; dirty inventory paths remained **0**.

## 2 — Validator baseline

`validate-prompt-system.ps1 -MachineryOnly` could not run under the host's default execution policy, so
it was re-run with `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ... -MachineryOnly`. That
bypass was process-local and did not change system or repository configuration.

Baseline result: **13 PASS groups, 1 intentional SKIP group, 0 failures**.

- PASS: 31 canonical prompts; 31 Claude launchers; 31 Codex launchers.
- PASS: launcher target parity, delegation, runtime isolation, and argument contracts (85 keys; 44
  closed enumerations compared).
- PASS: runnable entry-point/self-report contracts, representative dry runs, external-path failure
  simulation, thin adapters, 133-file path resolution, 17-report cold-review tokens, 17 mirrored skills,
  and both-map registration of all 17 skills and 31 prompts.
- SKIP: live coverage, notes-plan, SQL-route/declared-exercise, and simulation-route state, as required by
  machinery-only mode.

Final validator result before the blocked-report commit: the same **13 PASS groups, 1 intentional SKIP
group, 0 failures**.

## 3 — Manifest completeness gate

The cold manifest gate closed after two bounded re-dispatches: the first simulation and portfolio
returns had read their files to EOF but used alias IDs rather than the required
`<inventory-path>::<field>::NN` schema. Their replacements passed.

| Concern | Files | Source lines read to EOF | Accepted atomic IDs |
|---|---:|---:|---:|
| Knowledge — coverage | 7 | 1,747 | 349 |
| Knowledge — interview prep | 5 | 1,262 | 306 |
| Knowledge — notes | 7 | 1,711 | 184 |
| Practice — interview | 3 | 775 | 324 |
| Practice — simulations | 4 | 633 | 305 |
| Practice — SQL | 7 | 2,615 | 318 |
| Projects — plan | 6 | 1,793 | 369 |
| Projects — portfolio | 4 | 612 | 167 |
| Projects — README | 4 | 538 | 136 |
| Projects — review | 4 | 1,283 | 197 |
| Strategy — apply | 6 | 1,077 | 229 |
| Strategy — tracking | 4 | 1,213 | 293 |
| System family | 2 | 740 | 217 |
| Root contracts + validator | 9 | 3,373 | 156 |
| Skills (one copy of 17 pairs) | 17 | 2,720 | 181 |
| Launchers | 62 | 917 | 698 |
| **Total** | **168 analyst-owned files** | — | **4,429** |

Results: `audited files = inventory files - 2 maps = 168`; unassigned files **0**; duplicate manifest
ownership **0**; duplicate stable IDs **0**; 17/17 skill pairs and 31/31 launcher pairs proven. Every
assigned file had an `N lines, read to EOF` declaration.

## 4 — Map reconciliation gate

The orchestrator read both maps to EOF:

- `notes/prompts/README.md`: **747 lines, read to EOF**.
- `notes/prompts/_internal/_system-map.md`: **616 lines, read to EOF**.

The physical-line census began with this provisional classification:

| Map | Physical | Claim-bearing | Context/syntax | Out of scope | Unclassified | Conflicts |
|---|---:|---:|---:|---:|---:|---:|
| `README.md` | 747 | 621 | 126 | 0 | 0 | 0 |
| `_system-map.md` | 616 | 483 | 133 | 0 | 0 | 0 |

The category sums equal each physical denominator. The atomic claim ledger did **not** close:
claim-bearing lines with no accepted atomic claim remained **621** and **483** respectively. Therefore
no section is published as `verified — no change`, and no partial correction is applied.

The evidence-to-claim denominator was **4,429 accepted manifest facts**. It also did not close: the
source machinery contains mutually exclusive facts in fields whose owner is the README or system map,
so those facts cannot each receive an honest `documented`, `source-only by ownership split`, or
`missing claim` disposition without first deciding which authoritative instruction is operative.

### First bounded unresolved cluster

The portfolio concern was re-dispatched cold once and then settled once more by the orchestrator reading
all **228 lines of `portfolio-audit.md` to EOF**. The conflict remained:

- G7 says it requires a clean G6 `progress-update`, while the explicit `Run first` list names only
  `readme-audit` and `review-audit`.
- `DRY_RUN = true` says it “commits nothing”, while the mandatory final step commits its self-report and
  tracker even in dry-run.
- `DRY_RUN = false` calls the flow fully hands-off and commits target files, while the same finish path
  tells Victor to choose and delete one CV option before committing.
- The reviewer is asked for a ratio and uncovered-decision list that its own return contract does not
  consistently provide.

This is not a map correction: the authoritative source itself contains both sides. The accepted
portfolio manifest records nine contradictions after the retry. The same class appears independently in
plan commit ownership, README commit granularity, SQL route authority, coverage marker preservation,
single-shot self-report status handling, and skill commit/trigger contracts.

Disposition: **unverifiable**. The evidence needed to settle it is an authorised source-machinery
adjudication of the conflicting clauses; this audit is forbidden to perform that repair.

Because `unverifiable > 0`, Step 4's completeness gate failed. The run did not proceed to architecture
recommendations, a final reviewer, map corrections, or recommendation-ledger edits.

## 5 — README catalogue coverage and corrections

Blocked before a complete atomic-claim and reverse-ledger reconciliation. Corrections: **none applied**.
No `verified — no change` claim is made.

## 6 — System-map wiring/skill coverage and corrections

Blocked before a complete atomic-claim and reverse-ledger reconciliation. Corrections: **none applied**.
One positive discrepancy was measured but deliberately left unapplied on the blocked branch:
`_system-map.md` §13 says the 08:00 skill contracts total approximately 1,494 lines; the current six
files total 1,493. A blocked run cannot edit either map.

## 7 — Boundary proof

No active-project `PLANNING.md`, `PROJECT-BACKLOG.md`, or `PROGRESS.md` was opened. No project, SQL,
simulation, coverage, notes-plan, tracker, application, job-search, external-profile, evidence, or debt
state entered the inventory, snapshot, denominator, or verdict. Analysts recorded declared paths and
schemas as machinery contracts only and did not follow them.

`_recommendation-ledger.md` was read only as an audited root contract and for deduplication context;
its rows were not treated as an operational work queue. `_skill-friction.md` had no open rows at
close-out.

## 8 — Architecture findings

Not run: Step 4 did not close. No new recommendation ID was created.

## 9 — Final review state

`not run — blocked before final-review dispatch`

## 10 — Global verdict

**blocked — incomplete audit**

The two maps remain byte-for-byte unchanged. This report is the durable evidence of the admitted run,
the complete source inventory, the closed manifest gate, and the reconciliation gate that did not close.
