# System check — machinery audit report

Date: 2026-08-10
Starting commit: `2c1e10fb38e5c232700774351a70609e7fa08e4d`
Branch: `fix/backend-backlog`
Status: complete

## 1 — Inventory and dispatch coverage

Enumerated from disk, never from either map. **167 audited paths**, each with exactly one manifest owner,
zero unassigned, zero duplicate owners.

| Class | Count | Manifest owner |
|---|---|---|
| Canonical runnable prompts | 30 | 13 family analysts |
| Internal components (`*-prompt` / `*-standard` / `*-rationale`, the 3 SQL branch/seed files, `_topic-ownership.md`) | 32 | the same 13 family analysts |
| Root contracts + validator | 9 | root-contract analyst |
| The two maps under review | 2 | map-claims analyst |
| Skill files, both adapters (17 pairs) | 34 | skill analyst |
| Launchers, both catalogues (30 pairs) | 60 | launcher analyst |
| **Total** | **167** | 17 cold roles |

Frozen path + SHA-256 snapshot built from exactly that path set; `snapshot paths = inventory paths`
asserted before dispatch and recomputed twice — before reconciliation and before the final review —
with **zero drift** each time. The one dirty file in the tree, `.claude/settings.local.json`, is outside
the inventory and was preserved unstaged.

Dispatches: **17 required, 17 completed** — 13 family `analyst` (standard), 1 root-contract `analyst`
(deep), 1 skill `analyst` (deep), 1 launcher `mechanical checker`, 1 map-claims `analyst` (standard) —
plus the Step 6 cold `reviewer` (deep). No single-agent fallback was taken at any point.

Every assigned file was declared `N lines, read to EOF`: 62 across the family manifests, 9 root, 2 maps,
17 `.claude` skill copies (their 17 `.agents` twins proven identical by SHA-256 rather than re-read, per
Step 2B), 60 launchers.

Nine analysts of one wave were killed mid-dispatch by a runtime session limit. Three of them had already
written complete manifests to disk and were kept; the other six were re-dispatched cold in two smaller
batches, per Step 3's re-dispatch rule. The path + hash manifest was recomputed after the re-dispatch and
had not moved.

## 2 — Validator baseline and final result

Baseline `validate-prompt-system.ps1 -MachineryOnly`: **11 PASS, 1 SKIP, 0 failures.**
PASS: 30 canonical prompts · 30 Claude launchers · 30 Codex launchers · launcher target parity, full
delegation and canonical runtime isolation · runnable prompt entry-point and self-report contracts ·
representative contract dry runs · external-path failure simulation · thin session adapters share one
rules source · path references resolve (129 files, both path forms) · skill mirror parity (17 files per
adapter) · both maps know the machinery exists (17 skills, 30 prompts registered).
SKIP: live coverage, notes-plan, SQL-route and simulation-route state — the switch working as designed.

Final result after applying the approved patch: **11 PASS, 1 SKIP, 0 failures** — unchanged.

## 3 — `README.md` catalogue coverage

**Corrected — two cells; everything else verified with no change.**

Verified with no change:

- Counts and group lists: 30 runnable · 30 + 30 launchers · 13 families · the 8/5/9/7/1 group table
  summing to 30 · 22 suffix-drops + 7 `*-audit` files + the deliberate `/code-review-practice` exception ·
  18 orchestrators / 12 single-shot. All re-derived from disk.
- **All 30 public-interface-index rows**: command → canonical prompt, config / received input,
  runtime · commit owner, run-first / handoff / boundary. The 30 run-first cells were re-derived by
  extracting every prompt's own `▶ Run first` header; the config cells from each prompt's own config block.
- Family catalogue rows, internal-component rows, launcher naming and parity, orchestrator/single-shot
  classification, batch/global status, typical run order, and the `/system-check` row's own reads, writes
  and machinery-only boundary.

Corrected:

- **R1 — L336, `/cover-letter` Reads cell.** It omitted `personal/job-search/internship-daw.md`, which
  `cover-letter-prompt.md` L58 names in its own body ("stack per `_shared-context.md` /
  `personal/job-search/internship-daw.md` — the ground truth"). README owns per-prompt reads, so the
  owner's cell is the one place that fact must appear. Added, with the access mode named.
- **R2 — L237-239, the `Written by` cell of all three coverage hub rows.** They named only
  `coverage-prompt` and `coverage-audit-prompt`, while `_system-map.md` §7 lists five writers and declares
  its list exhaustive; the skill manifest independently confirms three in-session writers
  (`coverage-bullet-add`, `coverage-mark`, `sql-step-close`). The same table's `PROGRESS.md` row already
  lists in-session rituals, so the omission contradicted the table's own convention. Corrected in all
  three rows, with a link to §7 as the owner of the complete list.

## 4 — `_system-map.md` wiring and skill coverage

**Corrected — four cells; everything else verified with no change.**

Verified with no change:

- §1 two-engine properties and the commit boundary.
- §2-§6 chain order and the `/system-check`-sits-outside note.
- §7 writer registry — every row except the three below.
- §8 all seven `PROGRESS.md` section-ownership claims, cross-checked against the seven skills that write
  the file.
- **§9 — all seventeen skill rows** (trigger, received inputs, reads, writes/returns, isolation, commit
  owner, handoffs/gates, explicit exclusions) against the skill manifest. No row falsified.
- §10 all eleven debts, flags and gotchas; §11 all fourteen symptom routes; §12 steps 1-7 and the
  skill-friction sub-loop.

Corrected:

- **C1 — §7, `_session-rules.md` row.** "15 of the 30 prompts also name it directly" → **16**. A bounded
  grep over exactly the 30 canonical prompts returns 16; the sixteenth is `system-check-prompt.md`, whose
  only occurrence (L80) names the file as an item of its own audit **inventory** rather than as a contract
  it obeys — which is why the cell read 15. The count is corrected and that distinction named, so the
  number stays falsifiable.
- **C2 — §7, `personal/job-search/**` row, `Read by` cell.** It collapsed the whole apply family into
  "through `_application-standard.md`", which is false for three of the five prompts: `cover-letter` names
  `internship-daw.md` directly (L58), `cv` reads `master/` and `archive/` by name (L95), and `tracker`
  reads `tracker.csv` (L93) and every `applications/*/outcome.md` in `analyze` (L144). Replaced with a
  per-prompt access-mode enumeration. The `Written by` cell is untouched — `REC-055`'s ruling that
  `/cover-letter` only *suggests* a save path and writes nothing was re-verified and holds.
- **C3 — §12, "The one automated check".** The fingerprint `REPORT:`-versus-fail rule was restated in
  full, two sentences after the same subsection declares that `README.md` owns the validator's invariants
  and that restating them "is how this section would fork from them". `README.md` L62-64 states the rule
  in a strictly broader form. Replaced with a pointer; the map-owned half — "cannot tell whether a cell is
  true", which motivates the read trigger and exists nowhere else — is kept.
- **C4 — §7, `practice/sql/MISTAKES.md` row.** Writers named only "`sql-grade`'s subagent (`## Open`)",
  but `sql-exercises-prompt.md` L381 documents `MODE = review` as a still-live second door to the same
  grading branch ("still works and grades identically… nothing hands off to `sql-step-close`"), and
  `README.md` L400 already attributes the write to it. The two maps disagreed; §7 now names both doors.

## 5 — Boundary proof

Excluded from the inventory, denominator, report, snapshot and blocking conditions: project `PLANNING.md`
/ `PROGRESS.md` / `README.md` / `PROJECT-BACKLOG.md` / `ROADMAP.md`; SQL doctrine, routes, `.sql` answers
and `MISTAKES.md`; simulation doctrine, routes, specs, `TRACKER.md` and `MISTAKES.md`; coverage files,
their mirrors, `verify-*.md` and notes plans; notes and interview-prep prose and routes;
`personal/job-search/**` and the external portfolio repo; and the runtime/evidence state files
`_run-tracker.md`, `_skill-friction.md`, `_job-market-evidence.md`, `_cross-topic-inbox.md`, every
`_last-run-report*.md`, and the previous `_system-check-report.md`.

Every analyst carried an explicit instruction not to follow a path merely because an audited file names
it. No live artifact was opened and no live path's existence was tested; where a manifest recorded such a
path it was recorded as a declared pattern or ownership contract only.

`_recommendation-ledger.md` stayed in scope only for its improvement-loop contract and for deduplicating
new findings; its open rows were not read as an operational-debt queue.

## 6 — Architecture findings

Five cross-system findings, deduplicated against every `## Open` row (REC-046, 054, 055, 067, 069, 070)
and against the `## Closed` lines. Filed as **REC-071 … REC-075**; none is implemented by this run.

| ID | Finding | Class |
|---|---|---|
| REC-071 | `_single-shot-self-report.md` states a 29/17/12 runnable population; disk, the validator and both maps say 30/18/12 | stale cross-system count in a root contract |
| REC-072 | `cover-letter-prompt.md` reads an external path with no `_external-path-preflight.md` banner, unlike the other prompts that touch it | inconsistent application of a shared contract |
| REC-073 | `_sql-plan-standard.md` names one doctrine writer; `_sql-exercises-review.md` 4d and `sql-step-close` also write it | contested write ownership, map already correct |
| REC-074 | the simulation level-close gate reads "no correction is open" in the standard and "no MISTAKES row is open" in the prompt that executes it | one gate, two conditions |
| REC-075 | `progress-update` D8 forbids counting from the coverage mirror; `roadmap-review` 2a treats it as authoritative | duplicated decision, taken oppositely |

Considered and deliberately not filed: the 30 Claude launchers omit the `_agent-runtime-standard.md`
pre-read line all 30 Codex launchers carry (verified 0/30 against 30/30) — the canonical prompt itself
carries the instruction and the Codex line is adapter translation guarding against invented model
identifiers, exactly as `README.md` L41-42 describes; and four intra-family inconsistencies the manifests
surfaced (simulation commit-prefix drift, `review-audit`'s `PROJECT_PATH` enum gap, the coverage family's
`_last-run-report` naming asymmetry, and the SQL family's split `PROGRESS.md` commit discipline), all of
which fail condition 3 of the four-condition bar — cost, not result.

## 7 — Final reviewer verdict

`cold reviewer: approve-with-tightening`.

It passed checks 1, 2, 4 and 5 (inventory evidence, correction-to-evidence, no machinery file edited,
corrections separated from recommendations) and **failed 3, 6, 7 and 8**, each with a specific defect —
and its value was in the half the audit had ruled clean. It falsified two `README.md` cells the audit had
declared verified (R1 and R2 above), widened C2 from one omission to three by reading `tracker-prompt.md`
and `cv-prompt.md` itself, and found the `practice/sql/MISTAKES.md` second door (C4). It also ruled that
the draft report's own §5 breached the machinery-only boundary by asserting that two live paths do not
exist on disk — the Boundaries name the *report* explicitly — and that §3's "every field verified"
and §8's verdict both overclaimed. All five required tightenings were applied, in the form specified;
its four findings were each re-verified against disk before being applied, not taken on its word.

## 8 — Global verdict

**maps corrected** — `_system-map.md` in four cells, `README.md` in two.
