# System gaps — report

**Date:** 2026-08-10 · **Starting commit:** `2988ed24` · **Branch:** `fix/backend-backlog`
**MODE:** `update` · **Status:** `complete`

First run of this prompt: no previous `_system-gaps-report.md` and no previous
`_last-run-report-system-gaps.md` existed, so the Step 0.2 run-start check and the Step 5.3 carry-over
check both had nothing to consume. The deferred set below is this report's first inheritance for the
next run.

## 1 — Evidence

| Map | Lines | Read | SHA-256 (start = end) |
|---|---|---|---|
| `notes/prompts/README.md` | 651 lines (650 content + trailing blank) | **read to EOF** by the orchestrator | `45F70800897B903464398A6DD8C446338018CCD8372AE035C5CFAC0E16257259` |
| `notes/prompts/_internal/_system-map.md` | 592 lines (591 content + trailing blank) | **read to EOF** by the orchestrator | `A1E79441E7F2BD8CEF2A1F9C5381CAE826851EB12E7BA9C1027E5C333E3EBF68` |

Both hashes were recomputed immediately before this report was written and both matched their Step 0
values, so the whole analysis rests on one state of the system. Nothing outside the declared read set
was opened — no prompt, no `SKILL.md`, no standard, no launcher, no validator, no live artifact, and
not one of the eleven files named below as *the file that would settle a finding*.

## 2 — Edge ledger

| Edge | Count | Sections swept |
|---|---|---|
| `writes` | ≈110 | map §7 (41 rows), §8 (7 sections); README hub table (l.252-258), family catalogue `Generates / updates` (l.266-362), "How the prompts feed each other" (l.371-442) |
| `reads` | ≈255 | the same five sources' `Read by` / `Reads` cells, plus §9 `Primary reads` |
| `fires-on` | 17 skill triggers + 4 block opener/closer designations (two of them `none`) | map §9 trigger column, §13 block table |
| `follows` | ≈135 | map §2 diagram, §3-§6 chains; README "Typical run order" (l.485-591), pipeline view (l.446-479) |
| `gates` | 19 | map §4, §10, §11; README index "Run-first / handoff" column |
| `clears` | 9 | map §10, §11, §12 |
| `hands-off` | ≈25 | map §9 handoff column, §2-§6 chain arrows |
| `licence` | 24 quoted sentences | both maps, whole |

## 3 — Candidate table

38 candidate subjects. Content keys, never run-scoped numbers, so the deferred set can be matched by
the next run.

**All ten detectors ran; none returned nothing.** D1 ×7 · D2 ×3 · D3 ×5 · D4 ×6 · D5 ×1 · D6 ×3 ·
D7 ×3 · D8 ×3 · D9 ×5 · D10 ×4 (two candidates are counted under the detector that produced them first;
`D5:R1–R5#mid-step-due` also satisfies D4, and `D3:PROGRESS.md#Timed simulations` also satisfies D4).

### Promoted

| Content key | Det. | Evidence | Disposition | Outcome |
|---|---|---|---|---|
| `D1:_internal-standards#no-writer` | D1 | README l.218-243 vs map §7 machinery block l.260-269; §7 preamble l.224-226 | absence | **promoted `REC-088`** |
| `D6:gate#empty-drift-report` | D6 | map §10 l.363-364; §8 l.281; README l.193, l.347, l.206-208; §7 l.265 | absence | **promoted `REC-089`** |
| `D8:§12#missing-cold-review-verdict-line` | D8 | map §12 l.437-439; README l.49-64; map §11 (whole) | absence | **promoted `REC-090`** |
| `D9:{project}/PLANNING.md#§0` | D9 | map §7 l.240; §9 l.302 and l.307; README hub table l.258 | declared | **promoted `REC-091`** |
| `D9:interview-prep-bank#writer-contract` | D9 | map §7 l.234; README l.285 | absence | **promoted `REC-092`** |

### Deferred — over cap, ranked for the next run

| Rank | Content key | Det. | Disposition | Note |
|---|---|---|---|---|
| 6 | `D10:practice/interview#unreachable` (`/hr-screen`, `/code-review-practice`) | D10 | absence | Neither is named by any chain (§2, §3-§6), any "Typical run order" list (README l.485-591) or any §11 row. Branches: either nothing routes them, or a pointer lives outside both maps. Settling file: `notes/prompts/_internal/_session-rules.md`. §13 l.544-545 licenses only their absence from the *block* table; README l.335/l.337 are family rows and l.642-647 states why they were built, not when to run them |
| 7 | `D6:G2#trigger-unrecorded` | D6 | absence | §4 l.187 states G2 fires when the plan or branch strategy moves mid-build; §9's seventeen triggers hold no such event and §11 has no row. Branches: either nothing detects or records the trigger, or the maps omit it. Settling file: `notes/prompts/projects/plan/plan-audit.md` |
| 8 | `D2:interview-prep/hr-screen.md` | D2 | absence | README l.442 and l.337 name it written by `/hr-screen`; no §7 row, no reader anywhere. Branches: either nothing consumes the saved answers, or the maps omit the reader. Settling file: `notes/prompts/practice/interview/hr-screen-prompt.md` |
| 9 | `D1:projects/README.md` | D1 | absence | README l.293 has `project-brief` read it; §7 l.241 covers only `{project}/README.md`. Settling file: `notes/prompts/projects/readme/_internal/_readme-standard.md` |
| 10 | `D3:PROGRESS.md#Timed simulations (ungraded attempt)` | D3 | absence | §8 l.286 gives the section one writer, `/simulation-review`; §9 l.317 has `simulation-block-close` write the attempt handoff only. Branches: either a closed-but-ungraded attempt reaches `TRACKER.md` and never `PROGRESS.md`, or §8 omits a second writer. Settling file: `notes/prompts/practice/simulations/simulation-review-prompt.md` |
| 11 | `D9:dev/portfolio/VMNunez/README.md` | D9 | declared | §7 l.244 states "two writers, two triggers" and no partition of the content between them |
| 12 | `D5:R1–R5#mid-step-due` | D5 | absence | §2 l.136 carries the revision points as a chain node with no row; §9 l.313 has `sql-step-close` name revision gates only at step end. Branches: either nothing detects a revision point falling due mid-step, or §9's `sql-grade` row omits that check. Settling file: `.claude/skills/sql-grade/SKILL.md` |
| 13 | `D9:_cross-topic-inbox.md` | D9 | declared | §7 l.246 gives it an unbounded writer set ("any coverage run · `coverage-bullet-add`") with no stated order or duplicate rule |
| 14 | `D10:_internal#preflight-file` | D10 | absence (weak form) | README l.82 names "preflight" among the root `_internal/` contents; the enumerated internal-only list l.218-243 omits it and no edge of any type names it. **The one candidate whose settling read is a directory listing rather than a single file**, which is why it ranks here and not on its subject weight |
| 15 | `D1:personal/job-search/internship-daw.md` | D1 | absence | §7 l.269 has `/cover-letter` and `/profile-readme` read it by name; the same row scopes `/cv` to `master/`+`applications/` and `/tracker` to `tracker.csv`+`applications/`. Settling file: `notes/prompts/strategy/apply/_internal/_application-standard.md` |
| 16 | `D1:personal/job-search/archive/` | D1 | absence | §7 l.269 has `/cv` read `archive/` "when no CV is pasted"; no writer edge names it. Settling file: `notes/prompts/strategy/apply/cv-prompt.md` |

### Observed — ruling owed by `REC-054`

Both were ranked first and second by the orchestrator and **both were demoted out of the ledger by the
cold review**, correctly: each is one of §13's four asymmetries, which the map itself declares are
"observations, and each is a candidate a `RITF-NNNN` row would later be ruled against" (§13 l.560-561).
Step 3 of this prompt forbids promoting those.

| Content key | Det. | Evidence | Why it is not a row |
|---|---|---|---|
| `D4:interview-prep-block-open#BORDERLINE/FAIL` | D4 | §9 l.309 (`interview-prep-block-open`: "read-only orientation + PASS/BORDERLINE/FAIL return", "no write or commit"); §13 l.573 (`study-block-close` "marks nothing without a final PASS **or a completed plan entry**"); §7 l.255 (`practice/interview/MISTAKES.md` written by `/simulator`, `/hr-screen`, `/code-review-practice`) | A failed active-recall answer changes no file. But §7 l.230 is the only writer row declaring its list "exhaustive", so reading l.255 as closed is an inference, not an observation — and the underlying fact is §13's second asymmetry, routed to `REC-054` (c) |
| `D4:08:00#friction-without-failure` | D4 | §13 l.549 (08:00 closer **none**), l.563-568; §7 l.248, l.258, l.259 | The 12:30 block has a sink for a concept that cost an hour and was then got right; the 08:00 block has none. This is §13's first asymmetry, and §12 l.508 additionally names §13's `**none**` closer as a licence form |

### Accruing

| Content key | Det. | Evidence | Route |
|---|---|---|---|
| `D7:_ritual-friction.md#three-open-rows` | D7 | §11 l.397 (three `open` rows naming one ritual is due a ruling); §7 l.259 ("no close-out adjudicates it, no cold reviewer is dispatched over it") | Nothing counts the rows. The §7 quote discharges adjudication, cold review and REC promotion — not counting — but whether uncounted rows are a defect can only be sized from lived days. Routed to `_ritual-friction.md` / `REC-054` (c) |

### Routed as a map defect — this prompt may not repair it

| Content key | Det. | Evidence | Route |
|---|---|---|---|
| `D8:coverage-mirror-drift#§11` | D8 | §10 l.356-359 routes mirror drift to `validate-prompt-system.ps1` in prose; §11's validator row l.398 is scoped to three other symptoms and none is this | A §11 completeness defect, not a machinery gap. Handed to `map-sync` |

### Discharged as tracker state (`REC-046`)

| Content key | Evidence |
|---|---|
| `D7:_run-tracker.md#⚠ stale` | §10 l.343-347: "Only a real `/notes-plan` run clears it." The clearer exists; the debt is a cell |
| `D7:_system-gaps-report.md#deferred-queue` | §7 l.262: the next `/system-gaps` reads it by contract |

### Licensed — 16, each by a quoted sentence

| Content key | Quote and location |
|---|---|
| `D3:PROGRESS.md#LeetCode` | "nothing yet — gated behind the ROADMAP gates" — §8 l.287 |
| `D4:08:00#no-opener-no-closer` | "**none** — closing is per *step* and per *task*, never per block" — §13 l.549. **Scoped**: it licenses the absence of a block closer, not the absence of a friction record, which is why the candidate above survived it and died on a different ground |
| `D4:13:30#notes-half-no-opener` | "the notes half has none" — §13 l.551 |
| `D1:_shared-context.md` | "**by hand.** No prompt writes it" — §7 l.267 |
| `D1:_topic-ownership.md` | "**by hand, through its own admission contract, with explicit authorization**" — §7 l.268 |
| `D1:_session-rules.md` | "**whoever changes the session contract, by hand** … Never a prompt, never a skill, never a build step" — §7 l.263 |
| `D2:linkedin/cover-letter output` | "**Output only** … **No repo file, so the close-out has nothing to check**" — README l.352-353 |
| `D10:english/cambridge-prep` | "Still intentionally **not** a prompt" — README l.649-651 |
| `D3:PROGRESS.md#Professional level by topic` | "needs all 13 topics at once, which no ritual can compute" — §8 l.281 |
| `D3:notes-plan-{LEVEL}.md` | "the plan and its `Coverage SHA-256` are never touched by hand… Only a real `/notes-plan` run clears it" — §10 l.343-347 |
| `D4:map-sync#partial-read verdict` | "It never blocks and never sweeps, so rows about prompts nobody opens stay unverified between explicit global audits" — map l.54-56 |
| `D4:_ritual-friction.md#RITF insertion` | "Not a skill's own contract and not a prompt close-out: the ritual succeeded, so nothing in it fired" — §7 l.259 |
| `D8:silent-wrong-result-skill-write` | "This is deliberately **not** prompt-style self-reporting per ritual, and it does not claim parity with it… a defective skill that completes silently with a wrong result still leaves no friction row and remains dependent on human review, `map-sync`, the validator, or `/system-check`" — §12 l.458-461. The first named fallback, human review, is barred by nothing, so the residue the orchestrator wanted to route as a contradiction is not one |
| `D9:practice/simulations/{LEVEL}/PLANNING-{LEVEL}.md` | "`/simulation-plan` (creates/reconciles + reinforcement steps) · `/simulation-generator` (generation/state) · `/simulation-review` (verdict/correction/redemption/history) · `simulation-block-close` (attempt handoff)" — §7 l.251: every writer's part is stated |
| `D9:practice/sql/PLANNING.md` | "`/sql-plan-audit` · the grader's §0 rewrite · `sql-step-close` (§0 verify) · `/sql-plan` did the one-time split that created it" — §7 l.245 |
| `D9:PROGRESS.md` | "**section by section — see §8**" — §7 l.237 |

## 4 — Independent sweep (Step 5)

One `analyst`, tier `deep`, cold, given both maps and the ten detector definitions and **not** the
orchestrator's candidate list. It read both maps to EOF and returned 28 candidate rows (its own count
line said 27; the measured table is 28). The orchestrator's own sweep produced 26. The union is 38
subjects, partitioned:

- **Found by both — 16:** `_internal-standards`, `projects/README.md`, `hr-screen.md` orphan,
  `08:00#friction-without-failure`, `interview-prep-block-open#BORDERLINE/FAIL`, `gate#empty-drift-report`,
  `_ritual-friction#three-open-rows`, `_run-tracker#⚠ stale`, `{project}/PLANNING.md#§0`,
  `practice/interview#unreachable`, `internship-daw.md`, and the licensed `_shared-context.md`,
  linkedin/cover-letter output, `Professional level by topic`, the `/notes-plan` debt, `08:00#no-closer`.
- **Analyst only — 11:** `personal/job-search/archive/`, `PROGRESS.md#Timed simulations`,
  `map-sync#partial-read` (L), `_ritual-friction#RITF insertion` (L), `R1–R5#mid-step-due`,
  `G2#trigger-unrecorded`, `_system-gaps-report#deferred-queue`, `silent-wrong-result-skill-write` (L),
  `coverage-mirror-drift#§11`, `dev/portfolio/VMNunez/README.md`, `_cross-topic-inbox.md`.
  **All eleven were carried through Steps 3 and 4 by the orchestrator before any of them could be
  promoted**; one of them, `{project}/PLANNING.md#§0`, ended up promoted on the cold review's ranking.
- **Orchestrator only — 11:** `§12#missing-cold-review-verdict-line`, `interview-prep-bank#writer-contract`,
  `_internal#preflight-file`, and the licensed `_topic-ownership.md`, `_session-rules.md`,
  english/Cambridge, the simulations route, the SQL doctrine, `PROGRESS.md` by section,
  `13:30#notes-half-no-opener`, LeetCode.

Two of the three highest-value promotions were found by one side only, in opposite directions, which is
the argument for keeping the redundant sweep.

**Disposition disagreement, ruled by the cold reviewer:** the analyst filed
`D10:practice/interview#unreachable` as `declared`; the orchestrator filed it `absence`. The reviewer
upheld `absence` — no map sentence positively states that nothing routes those two prompts, and a
"run this when" pointer could live in `_session-rules.md`, which neither map is authoritative over.

## 5 — Cold review (Step 7)

One `reviewer`, tier `deep`, cold, with a scratch path, both maps, the full candidate table and the
draft rows. Verdict: **`approve-with-tightening`**, on 14 findings. Every one was applied. The four
that changed the outcome rather than the wording:

1. **The top-ranked row was demoted out of the ledger entirely.** Its two halves are §13 asymmetries,
   and its universal negatives ("no §7 row accepts…", "changes no file anywhere") were inferences from
   writer lists that do not declare themselves exhaustive — §7 l.230 is the only row that does. Filed
   `observed — ruling owed by REC-054` above.
2. **A quote in that row was truncated in its own favour**: §13 l.573 reads "marks nothing without a
   final PASS **or a completed plan entry**", and the row had dropped the second clause and cited it to
   §9 l.310, where it does not appear.
3. **The cap was not applied by rank**: `{project}/PLANNING.md` is one of README's five hub files
   (l.247-258) and its §0 is contested by two 08:00-block skills, so it outranks a non-hub file and is
   promoted as `REC-091`. Its correction target is §7's row or the two `SKILL.md` files — **never the
   project plan**, which crosses the `REC-087` ownership fence.
4. **`D8:silent-wrong-result-skill-write` was re-disposed `licensed` in full.** The orchestrator had
   held back a residue as a contradiction between two map sentences; §12 l.461's first named fallback is
   human review, which no map sentence bars from live artifacts, so there was no contradiction to route.

The other ten were citation and scope repairs: a miscount of the standards (12, not 13, and
`_agent-runtime-standard.md` is at README l.28/l.37, outside the internal-only list); an inverted count
in `REC-092`'s cell (two writers carry a scope parenthetical, three do not — the stronger form of its own
claim); `REC-089` had to engage README l.206-208, which declares the omission of `_last-run-report*.md`
from per-prompt rows deliberate, and discharge that branch with §7 l.265; `REC-089` had to separate
itself from closed `REC-045`; `REC-090`'s claim was narrowed to what one file can settle; `REC-092` had
to engage `REC-059`; deferred candidate 7 was re-disposed `absence`; the set partition was restated as a
real partition; the verdict line was rewritten; and two licensed rows were re-quoted verbatim instead of
paraphrased.

## 6 — Promoted rows

Five, the cap. All five cleared the ledger's three scope tests (the wrong thing is a file, every file is
machinery under `notes/prompts/` or a `SKILL.md`, and none needs a lived day to size), none is a
duplicate of an `## Open` or `## Closed` row, and each names which file would gain what.

- `REC-088` — no standard in the system has a declared writer.
- `REC-089` — G6 and SQL G3 close on a drift report no `writes` edge produces.
- `REC-090` — the cold-review verdict line is the improvement loop's only integrity trace and nothing
  looks for it.
- `REC-091` — `step-complete` and `backlog-task-close` both write `PLANNING.md` §0 with no stated order.
- `REC-092` — the Q&A bank has five writers and two are outside the contract that governs it.

## 7 — Verdict

**38 gaps found in the system as the two maps describe it — 5 promoted, 9 unsettled between the two
branches and deferred over the cap.** In full: 16 licensed by a quoted sentence · 5 promoted (4 of them
`absence`, 1 `declared`) · 11 deferred by rank (9 `absence`, 2 `declared`) · 2 observed with a ruling
owed by `REC-054` · 1 accruing · 1 routed to `map-sync` as a map defect · 2 discharged as tracker state.

This is a claim about **the maps**, not about the machinery. Nothing here says the system has no other
gaps: this run cannot see one the two maps forgot to mention, and eleven of the surviving findings name
the single file whose read — by `/system-check` or `map-sync`, never by this prompt — would settle which
of their two branches is true.

**Maps unaffected.** This prompt cannot change what a file contains, who writes it, when something runs,
or which prompts and skills exist.
