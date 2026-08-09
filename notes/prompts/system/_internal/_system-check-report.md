# System-check report — whole prompt and skill system

Date: 2026-08-09
Starting commit: `4c77723f`
Branch: `fix/backend-backlog`
Status: complete

**Global verdict: maps corrected** — nine false claims across the two derived maps, all repaired.

---

## 1 — Inventory and dispatch coverage

Frozen path + SHA-256 manifest built from the Step 1 inventory, asserted `snapshot paths = inventory
paths`, and recomputed unchanged before reconciliation and before the final review.

| | Count |
|---|---|
| Runnable prompts | 30 |
| Internal Markdown components (incl. both maps and the 12 root contracts) | 45 |
| PowerShell validator | 1 |
| Skills, both adapters (17 × 2) | 34 |
| Launchers, both catalogues (30 × 2) | 60 |
| `PROJECT-BACKLOG.md` | 7 |
| Project `PLANNING.md` (§0/§23 scoped) | 7 |
| SQL doctrine + junior route | 2 |
| **Total audited paths** | **187** |

Manifest digest `22DE2C038B1C2C6466FADEDC8EDB9CCE732E1C3F378193D5B6BE5B8DF70583E4`, identical at Step 1,
Step 3 and Step 7. The only dirty file in the tree, `.claude/settings.local.json`, is outside the
inventory; it was preserved and never staged.

**Dispatches: 19 required, 19 completed.** 13 family analysts (`standard`), root-contract analyst
(`deep`), skill analyst (`deep`), launcher analyst (`mechanical`), map-claims analyst (`standard`),
debt analyst (`standard`), cold final reviewer (`deep`). The first final-reviewer dispatch was killed
by a runtime session limit before returning a verdict and was re-dispatched cold once; no other role
failed. No analyst received either map's claims as instructions.

**Completeness gate: closed.** `audited files = inventory files` (187 = 187) · `duplicate manifest
ownership = 0` · `unassigned files = 0` · every assigned file carries an `N lines, read to EOF`
declaration · launcher and skill mirror parity both proven mechanically.

## 2 — Validator baseline and final result

Baseline and final run are identical: **12 PASS, exit 0**, with one `REPORT:` block naming four notes
plans whose `Coverage SHA-256` no longer matches their coverage file (`architecture`, `general`,
`java`, `spring-boot` — junior verify files claiming `complete`). That is the fingerprint contract
reporting and deliberately not repairing; it is carried into the debt queue below, not silenced.

## 3 — Map corrections

Nine corrections, all approved by the cold final reviewer and applied verbatim.

### `notes/prompts/README.md`

| # | Claim | Correction |
|---|---|---|
| E1 | L103 "a suffix-drop like the other **nineteen**" | → **twenty-one**. 30 prompts − 7 no-suffix `-audit.md` files − 1 deliberate exception (`code-review-prompt` → `/code-review-practice`) = 22 suffix-drops, as the same paragraph states; `/coverage-audit` is one of them. Nineteen was correct at 28 runnable prompts (`REC-055` still records "28 runnables") and was left behind when the system grew to 30 |
| E2 | L182 hub table names `plan-audit` as a reader of `notes/coverage/junior.md` | → `project-brief` is the only whole read; `plan-audit` merely digests the file to test a brief's freshness. `plan-audit.md` L156: "The author no longer loads `notes/coverage/junior.md` into context". README contradicted itself against its own L221/L224 |
| E3 | L202 `coverage-audit` "Generates / updates" omits two real writes | → added the `PROGRESS.md` `Coverage demonstrated` refresh (`coverage-audit-prompt.md` L168: "in that same commit"), the routed `_cross-topic-inbox.md` entries, and the topic level files it corrects |
| E4 | L254 `sql-plan-prompt` "Generates / updates" omits `PROGRESS.md` | → added the level's `Exercise route` tables under `## Practice completed` (`sql-plan-prompt.md` L323, L350: "the plan and PROGRESS.md **separately**") |

### `notes/prompts/_internal/_system-map.md`

| # | Claim | Correction |
|---|---|---|
| E5 | §5 step 2 describes `/sql-plan` as writing only the route | → added its `PROGRESS.md` `Exercise route` projection, in its own commit. Same evidence as E4; this is the chain-step occurrence of the same omission |
| E6 | §7 `ROADMAP.md` "Read by" names 3 readers | → 13. Independently re-derived: 17 prompts name the file, minus 4 that name it only to **exclude** it as scope evidence (`/coverage`, `/coverage-verify`, `/coverage-audit`, `/tracker`) and minus its writer `/roadmap-review`. README's own catalogue rows already listed `ROADMAP.md` for eight of the missing readers, so the two maps contradicted each other |
| E7 | §8 `## Coverage demonstrated` writer list omits `/coverage-audit` | → added. Positive contradiction against §8, which the read licence says survives any depth of read |
| E8 | §8 `Exercise route` writer is "`sql-grade`'s cold subagent" alone | → `/sql-plan` seeds/re-syncs the projection, `sql-grade`'s subagent moves the counts. `_sql-plan-standard.md` Section E names three roles; the auditor (`sql-plan-audit`) was deliberately not added, since it never edits |
| E9 | §12 "five bullets for the **seventeen** orchestrators … three for the twelve single-shot" | → **eighteen**. 17 + 12 = 29 against 30 runnable prompts. README L129-131 says eighteen; the set was re-counted from the family manifests. Seventeen is the skill count |

### Verified — no change

These claims were checked against source and found **true**; they are recorded so a later reader can
tell a checked row from an unvisited one:

- §7 "15 of the 30 prompts also name `_session-rules.md` directly" — grep returns exactly 15.
- README L100-101 "Twenty-two of the 30 work that way; seven files carry no `-prompt` suffix" — both correct.
- README L129/L131 eighteen orchestrators / twelve single-shot — confirmed prompt by prompt.
- README L41-59 — all five validator invariants exist in the script.
- README L510-521 batch-mode buckets — every listed prompt's mode matches its own config block.
- §4 gate table **G1-G8** — matches `_planning-standard.md`, which defines them.
- §5 SQL **G3/G4** — matches `practice/sql/PLANNING.md` §9.
- §9 — all seventeen skills have a row; the validator proves §9 ↔ disk in both directions.
- §7 `coverage-bullet-add` is the only skill that writes `_run-tracker.md` — grep confirms.
- Launcher parity: filename 30/30 · canonical target 30/30 · command name 30/30 · **argument contract
  30/30** (the gate that blocked the two previous runs now passes).
- Skill mirror parity: git stores an **identical blob** for all 17 pairs.

**One finding withdrawn on cold review.** A claim that four `SKILL.md` files
(`interview-prep-block-open`, `simulation-block-open`, `simulation-block-close`, `simulation-grade`)
carry no pointer to the durable-friction contract was a **false positive** from a grep for
`durable friction` that missed the hyphenated `durable-friction`. All four do point at
`_session-rules.md`, in their own paraphrase; `_session-rules.md` L141 requires only that skills
"point here rather than restating this contract" and mandates no citation format. No recommendation
filed.

**Not a defect.** `.claude/skills/sql-grade/SKILL.md` holds CRLF where its mirror holds LF. The
committed blobs are byte-identical (`063d7d2…`), `core.autocrlf=true` with no `.gitattributes`
explains the working tree, README L44-46 documents that the validator compares line-ending-normalised
for exactly this reason, and the ledger preamble already records the same false alarm under `REC-057`.

## 4 — Operational-debt queue

Reported and prioritised only; this run clears nothing.

### A — Blocking correctness / security

1. **`07-timetrack` §0 is factually stale and asserts a gate condition that is not met.** §0
   (`Last updated: 2026-08-04`) says "every backend task at every priority is closed" and that G3's
   condition is "met, action pending: PR". `PROJECT-BACKLOG.md` (backend Last Reviewed **2026-08-06**,
   i.e. newer) carries **3 open High** backend tasks, including a **leaked PostgreSQL password and
   BCrypt admin hash still reachable in pushed history** (`f17c01e`, `21f5221`), a `JwtFilter` returning
   500 instead of 401 on a blank token, and undocumented required env vars. → fix the three Highs, then
   `step-complete` to repoint §0; only then is the `fix/backend-backlog` PR a G3 sign-off.

### B — Due gates

2. **`REC-054`** (whole-system + lived-day review) — its stated precondition is now true: Waves 1-6 are
   all closed, Wave 6 as of today. Unblocks `REC-055(e)`, which is scoped to be written out of it. →
   the ledger's own four-step resolution procedure.
3. **`coverage-audit` is `⚠ stale 2026-08-04 (+14 bullets)`** — the 2026-08-01 global convergence claim
   no longer holds. → `/coverage-audit junior`.
4. **`07-timetrack` G3** — blocked behind item 1.

### C — Stale prerequisites (each blocks `/notes-audit` for that topic)

5. `/notes-plan` owed on seven junior topics, flagged in `_run-tracker.md`: **SQL `+40 bullets`**
   (largest), architecture `+4`, security `+2`, typescript `+2`, javascript `+1`, angular and general
   (fingerprint only).
6. **CSS and Git have never had `/notes-plan` run at all**, though `Coverage J` and `Verify J` are both
   `completed` — first run, not a re-run.
7. The validator's four `REPORT:` fingerprint disagreements (`architecture`, `general`, `java`,
   `spring-boot` junior verify files claiming `complete` against a moved digest) belong to the same
   queue and are cleared by the same `/notes-plan` runs, never by editing the flag.

### D — Non-blocking

8. Timed-simulation track has **no route at any level** — `Simulation plan` and `Route progress` are
   empty for junior/middle/senior. → `/simulation-plan junior`, after item 2's `progress-update` gate.
9. `Notes file executions` holds **one** row (`java junior 00`) against dozens of planned entries.
10. All twelve single-shot prompts show `pending` — never run.
11. 34 Medium + 25 Low open backlog items across projects 01-06; no gate depends on them.

## 5 — Architecture findings

- **`REC-067` (new)** — launcher public argument contracts are not mechanically falsifiable. The
  validator proves filename, target, delegation and runtime isolation, but nothing compares a
  launcher's advertised config keys and MODE values against the canonical prompt's own config block.
  Eight mismatches were found by prose review in the two prior runs, the fix was likewise unverified,
  and this run re-proved 30/30 by hand — which is the evidence that the guarantee is manual and will
  drift silently again. Fix site is the validator, not either map. Carries forward the `open` finding
  of the 2026-08-09 blocked run.
- No existing ledger row was updated: `REC-046`, `REC-054` and `REC-055(e)` are unrelated to anything
  this audit found, and no finding duplicated them.

## 6 — Final reviewer verdict

`approve-with-tightening`. All nine map edits confirmed against disk with correct line citations, no
missed sibling occurrences (both maps grepped for every corrected claim), no over-reach — the reviewer
independently re-derived E6's reader list and both counts in E1 and E9 and reached the same figures.
The single tightening was to the classification section, not to any edit: the durable-friction finding
was ruled a false positive and dropped, as recorded above.

## 7 — Boundary observed

Only the two derived maps, this report, and one new ledger row were written. No prompt, `SKILL.md`,
standard, launcher, project plan, backlog, tracker debt or recorded gate was edited to make the audit
pass. Per this prompt's Step 9 boundary, no at-end prompt refinement ran inside the audit — the
`_last-run-report.md` finding it earns stays `open` for a later, separately authorised adjudication.
