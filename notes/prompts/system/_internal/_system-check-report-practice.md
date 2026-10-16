# System-check report — practice

Date: 2026-10-16 · Flow: practice · Starting commit: `5f2d13f7fcf6e44d2cbbef9c7e0bea98fc24eb4f` · Branch: `projects/07-timetrack`
Status: complete

## 1. Audited paths

Prompt `notes/prompts/system/system-check-prompt.md` blob `c8337184e21becab43d00177fac9b4e4813dc11e` ·
mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob
`cd60ab694e617051255f7962a6b6e17fc551d522`.

Inventory: 52 paths — 18 practice-family prompt/component/standard files (nine runnable prompts, six
components, three standards), eight paired skills (both adapter copies, identical blobs) and nine launcher
pairs. Concerns: 27 (18 file, 8 skill, 1 launchers), all accepted at Step 3 — 25 on their first return,
two (`practice-session`, `sql-grade`) on their one cold re-dispatch. Map blobs at admission (evidence
only, outside freshness): `README.md` `44e62403469f4aebe9aac96f495d9408bac67e64`, `_system-map.md`
`e52747bcf91477ff77bca2220f58d07099711a23`.

Dispositions per concern as the accepted return declares them: correct / incorrect / missing / fenced / source-contradiction.

| Path | Blob | Lines | c / i / m / f / sc |
|---|---|---|---|---|
| `notes/prompts/practice/exercises/_internal/_practice-plan-prompt.md` | `49a064c2b3b27f54f76fb7fd6540b4821d2a60d7` | 57 | 8 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/exercises/_internal/_practice-review-prompt.md` | `635876ae044558c5f564b9092fe11b5273a30963` | 88 | 7 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/exercises/_internal/_practice-standard.md` | `9c65df0e2d8a58cea849725745834bf24409de18` | 346 | 12 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/exercises/_internal/validate-practice-plan.py` | `56c62d7a151d1f51fab203ecbf2678a1ae6509ae` | 150 | 11 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/interview/code-review-prompt.md` | `7797bda0a9c85c50d0458a0f553f68f830e96c09` | 215 | 15 / 1 / 2 / 2 / 0 |
| `notes/prompts/practice/interview/hr-screen-prompt.md` | `9880b0a9d327f2d520367f1cab25521bff7582b6` | 153 | 15 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/interview/simulator-prompt.md` | `8e36d9f385b5cfc6e39ab7643d9531749dec51ad` | 478 | 20 / 1 / 0 / 0 / 0 |
| `notes/prompts/practice/simulations/_internal/_simulation-plan-standard.md` | `3e337143e611df8b8265417df7b7eedc56ac6da0` | 269 | 6 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/simulations/simulation-generator-prompt.md` | `e840465cce429302b69fc1f800c870ad4f0f6da9` | 110 | 22 / 0 / 2 / 1 / 0 |
| `notes/prompts/practice/simulations/simulation-plan-prompt.md` | `7bdb23c2291a61731cd588df86115093678c9ba3` | 146 | 24 / 0 / 4 / 2 / 0 |
| `notes/prompts/practice/simulations/simulation-review-prompt.md` | `f4eb7236b5aff0e744915ffddebeb40ad83ecbd6` | 235 | 23 / 0 / 5 / 1 / 0 |
| `notes/prompts/practice/sql/_internal/_sql-exercise-seeds.md` | `f92ae618633942e40c3bd0d0752d9b60fbd9d1ee` | 291 | 3 / 1 / 0 / 0 / 0 |
| `notes/prompts/practice/sql/_internal/_sql-exercises-practice.md` | `e10af5252d1271ec9ed9b668850ee3e1424f1872` | 418 | 9 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/sql/_internal/_sql-exercises-review.md` | `f681bf236cbd385421c0f24979165da9893ca14b` | 650 | 9 / 0 / 4 / 0 / 0 |
| `notes/prompts/practice/sql/_internal/_sql-plan-standard.md` | `2824a7d9a71525e6ca1bfa475671aa6591a8688f` | 363 | 7 / 0 / 0 / 0 / 0 |
| `notes/prompts/practice/sql/sql-exercises-prompt.md` | `74617f37e34e6d732ad983a69779d5ffc6e3d04b` | 430 | 22 / 1 / 4 / 2 / 0 |
| `notes/prompts/practice/sql/sql-plan-audit.md` | `a74af8c28ad55d265b3f9bc66267a572745e6724` | 438 | 16 / 0 / 2 / 0 / 0 |
| `notes/prompts/practice/sql/sql-plan-prompt.md` | `6a8bfebc232e9098cfb670caf714b14ed29d7f1d` | 454 | 27 / 1 / 4 / 2 / 0 |
| `.claude/skills/practice-session/SKILL.md` (+ `.agents/` mirror, same blob) | `a6d536ab10e47a27adcd13a7b5528451ad6b42a0` | 223 | 14 / 0 / 2 / 2 / 0 ¹ |
| `.claude/skills/simulation-block-close/SKILL.md` (+ `.agents/` mirror, same blob) | `c0860adadf724132fb184ffac8ba59128859979f` | 52 | 12 / 0 / 1 / 0 / 0 |
| `.claude/skills/simulation-block-open/SKILL.md` (+ `.agents/` mirror, same blob) | `b4185b29b7ea8c14b0f1f37c25a3283ad99fd281` | 56 | 11 / 0 / 3 / 0 / 0 |
| `.claude/skills/simulation-grade/SKILL.md` (+ `.agents/` mirror, same blob) | `10bff9a6f34c202b2880c7fa24abb8cb95afd6bb` | 56 | 10 / 0 / 2 / 0 / 0 |
| `.claude/skills/sql-block-close/SKILL.md` (+ `.agents/` mirror, same blob) | `034808c05e8f0ac64add00c75551d137853448d5` | 155 | 12 / 0 / 1 / 0 / 0 |
| `.claude/skills/sql-block-open/SKILL.md` (+ `.agents/` mirror, same blob) | `1b6c216722eb3c67648f6096c9d3eb477babd828` | 214 | 11 / 1 / 0 / 0 / 0 |
| `.claude/skills/sql-grade/SKILL.md` (+ `.agents/` mirror, same blob) | `50e738b717e78bebe9efd33dc500b2214aeb73d6` | 214 | 12 / 1 / 1 / 0 / 0 ¹ |
| `.claude/skills/sql-step-close/SKILL.md` (+ `.agents/` mirror, same blob) | `02e66f8bb6e1b5d866ba72585277e1312ecbd680` | 254 | 15 / 0 / 0 / 0 / 0 |
| launchers (9 pairs, 18 files — blobs below) | — | 12–21 each | 63 / 3 / 0 / 0 / 0 ² |

¹ The accepted return is the re-dispatch; the first return was rejected at Step 3 (§7).

The counts above are the returns' own; the final reviewer re-ruled three rows (§4).
² The three `incorrect` rows rule the launcher files themselves, not a map cell: each restates a
prompt-owned gate or commit rule. They are machinery defects, routed to the ledger (§5), and patch no map.

Launcher blobs (`.claude` · `.codex`): code-review-practice `41e5b811…` · `bd0fe02a…`; hr-screen `2a5fa2e5…` ·
`2382431a…`; simulator `ecc23d68…` · `958b6ffa…`; simulation-generator `53c731b6…` · `fe88e57b…`;
simulation-plan `bbdd583e…` · `d77bd2b9…`; simulation-review `0578c7be…` · `a9f17a73…`; sql-exercises
`dd4fa784…` · `aa4cf686…`; sql-plan-audit `af24dbb2…` · `a715b5fc…`; sql-plan `b8b13ffe…` · `3d763a09…` (full
ids in `snapshot.tsv` of the run checkpoint).

## 2. Validator

Baseline (`-MachineryOnly`, before Step 1): every check `PASS`; one `REPORT` (a path one closed ledger line
proposes that does not exist — a proposal, not a typo); `SKIP` live coverage/plan/route state by design.
Final (`-MachineryOnly`, after the approved patch, the ledger rows and this report): every check `PASS`, the same one `REPORT` and the same `SKIP`; 241 files path-scanned, 52 distinct open ledger IDs compared.

## 3. Map corrections applied

32 edits (SM = `_system-map.md`, R = `README.md`, E = a conflict the final reviewer settled): the 31
drafted from the accepted concerns, in the form the cold final reviewer approved — SM1 tightened (T1: the
gate semantics are README's, so the §7 cell keeps its bare "(advisory)" convention), SM10 dropped (T2, §4),
and the two conflicts settled as E-C1 and E-C2. Where several accepted returns added readers or writers to
one cell, the orchestrator merged them into one edit (SM2, SM3a, SM3b, SM4, SM5, SM8). The `was` / `now`
cells are the exact replaced strings.

| # | map | row | was | now | source line |
|---|---|---|---|---|---|
| SM1 | _system-map.md | §7 verify Read by (sql-plan) | \| `/notes-plan` (advisory), `/coverage` update \| | \| `/notes-plan` (advisory), `/sql-plan` (advisory, SQL only), `/coverage` update \| | sql-plan-prompt.md L91-94 |
| SM2 | _system-map.md | §7 levelled Q&A Read by (code-review-practice + simulation-review, merged) | \| `/interview-prep-route`, `interview-prep-block-open`, `/simulator`, `authoring-progress-recount` (the refined count), | \| `/interview-prep-route`, `interview-prep-block-open`, `/simulator`, `/code-review-practice` (the target pair's stored fingerprint for its one gate, and the bank for dedupe-by-concept before an insertion), `/simulation-review` (fingerprint gate before an insertion), `authoring-progress-recount` (the refined count), | code-review-prompt.md L159-163; simulation-review-prompt.md L32, L148-149 |
| SM3a | _system-map.md | §7 PROGRESS Read by, prompts (sql-plan + simulation-plan + simulation-review, merged) | `/sql-exercises`, `/progress-update` (the auditor | `/sql-exercises`, `/sql-plan` (the level's `Exercise route` tables, read to preserve graded figures before it re-syncs them), `/simulation-plan` (practical-evidence readiness per track, and the progress snapshot it hashes), `/simulation-review`, `/progress-update` (the auditor | sql-plan-prompt.md L409; simulation-plan-prompt.md L48, L58-59; simulation-review-prompt.md L32 |
| SM3b | _system-map.md | §7 PROGRESS Read by, tail (sql-plan-audit + simulation-block-open, merged) | · `sql-grade`, `sql-block-open` and `sql-block-close` (one file's `### Exercise route` row, for its `Status`) \| | · `sql-grade`, `sql-block-open` and `sql-block-close` (one file's `### Exercise route` row, for its `Status`) · `/sql-plan-audit` (the SQL projection under invariant 15 — audited read-only, never edited) · `simulation-block-open` (the whole file's SHA-256, the progress-snapshot check against the route's recorded snapshot) \| | sql-plan-audit.md L159, L206; simulation-block-open/SKILL.md L27, L32-33 |
| SM4 | _system-map.md | §7 SQL route Read by (sql-plan + sql-block-open, merged) | \| `/sql-exercises`, `sql-block-open`, `sql-block-close` (§1, which file is current) · | \| `/sql-plan` (its own previous route, when it exists: reconciled and history-gated) · `/sql-exercises`, `sql-block-close` (§1, which file is current) · `sql-block-open` (§2 and §3 — the current step and its real status; §1's revision table for the due revision points) · | sql-plan-prompt.md L72-73; sql-block-open/SKILL.md L45-46, L176-177 |
| SM5 | _system-map.md | §7 SQL MISTAKES Read by (sql-exercises reinforce + review branch, merged) | \| the revision points the level's route §1 declares · `sql-block-open` | \| the revision points the level's route §1 declares and `/sql-exercises MODE = reinforce` (its `{FOCUS}`) · `sql-grade`'s subagent and `/sql-exercises MODE = review` (`## Open`, to increment a recurring concept and to close a redeemed one) · `sql-block-open` | sql-exercises-prompt.md L192; _sql-exercises-review.md L559-560, L576-578 |
| SM6 | _system-map.md | §7 .sql Read by (sql-block-close) | and `sql-block-close` (the scored/graded greps) | and `sql-block-close` (the written/graded/accepted greps, and the answered-header count against `HEAD`) | sql-block-close/SKILL.md L50-53, L59-60 |
| SM7 | _system-map.md | §7 simulation route Written by (simulation-generator) | `/simulation-generator` (generation/state) | `/simulation-generator` (generation/state + the §0 pointer) | simulation-generator-prompt.md L90-91 |
| SM8 | _system-map.md | §7 spec Read by (simulation-block-close + simulation-plan + simulation-generator, merged) | \| Victor · `simulation-block-open` · `simulation-grade` / `/simulation-review` \| | \| Victor · `simulation-block-open` · `simulation-block-close` · `simulation-grade` / `/simulation-review` · `/simulation-plan` (existing specs, reused when they fit) · `/simulation-generator` (the two latest specs of the track and every title/path, for numbering and dedupe) \| | simulation-block-close/SKILL.md L20, L48; simulation-plan-prompt.md L48, L83-84; simulation-generator-prompt.md L42 |
| SM9 | _system-map.md | §7 simulation MISTAKES Read by (simulation-review) | \| `/simulation-plan`, `simulation-block-open`, `simulation-grade`, revision points | \| `/simulation-plan`, `/simulation-review`, `simulation-block-open`, `simulation-grade`, revision points | simulation-review-prompt.md L32, L122 |
| SM11a | _system-map.md | §9 simulation-block-open trigger + input | \| `simulation-block-open` \| a timed-simulation block starts \| | \| `simulation-block-open` \| a timed-simulation block starts; LEVEL from Victor's message, else the doctrine's §0 pointer (`practice/simulations/PLANNING.md`) \| | simulation-block-open/SKILL.md L20 |
| SM11b | _system-map.md | §9 simulation-block-open primary reads | \| doctrine/route, coverage/progress snapshots, specs, TRACKER, MISTAKES \| read-only one-next-moment orientation \| | \| doctrine/route, coverage/progress snapshots, the coverage-standard digest rule and the simulation standard's manifest-SHA algorithm it recomputes them by, specs, TRACKER, MISTAKES \| read-only one-next-moment orientation \| | simulation-block-open/SKILL.md L27, L32-33 |
| SM12a | _system-map.md | §9 simulation-grade trigger + input | \| `simulation-grade` \| a planned attempt or correction is ready and complete, or an attempt still in flight needs the one allowed hint \| | \| `simulation-grade` \| a planned attempt or correction is ready and complete, or an attempt still in flight needs the one allowed hint; receives Victor's solution (attached, pasted or at a named path), plus the stated time used and self-assessment on a first review (a hint needs only the partial solution) \| | simulation-grade/SKILL.md L24-26 |
| SM12b | _system-map.md | §9 simulation-grade isolation | \| agent commits system-owned simulation artifacts; Victor's submitted solution stays untouched \| | \| agent commits system-owned simulation artifacts; Victor's submitted solution stays untouched; isolation: one cold subagent with no conversation context beyond the resolved parameters and the solution \| | simulation-grade/SKILL.md L34-40 |
| SM13 | _system-map.md | §9 practice-session trigger + input | or grading/fix verification \| | or grading/fix verification; input: the topic, block or concept and the level (default `junior`), the time he stated, and for grading the batch he means and the help he said he used \| | practice-session/SKILL.md L68-70, L98, L131-134 |
| SM14 | _system-map.md | §7 ATTEMPTS Read by (practice-session scope) | `practice-session` (composition, difficulty and the proposal) | `practice-session` (composition, difficulty, the proposal, and resolving the batch a grading request means) | practice-session/SKILL.md L131-132 |
| SM15 | _system-map.md | §7 SQL MISTAKES Read by (sql-grade) | the latest `## Fricción` ones) · `sql-block-close` (`## Open`, so a graded failure | the latest `## Fricción` ones) · `sql-grade` (the rows its subagent's run opened or incremented, to name each failed concept) · `sql-block-close` (`## Open`, so a graded failure | sql-grade/SKILL.md L113, L119 |
| SM16 | _system-map.md | §7 _run-tracker Written by (sql-grade timing) | `Exercises` cell, after every grading — its subagent runs the review branch alone | `Exercises` cell, after every return of its subagent, `BLOCKED` included — its subagent runs the review branch alone | sql-grade/SKILL.md L160-161 |
| R1 | README.md | interface /code-review-practice commit owner | \| S, live critique · agent for logs/Q&A \| | \| S, live critique · agent for the gap log; Victor for the Q&A pair \| | code-review-prompt.md L177-179, L193-194 |
| R2 | README.md | interface /simulator commit owner | \| S, live interview · agent for logs/gaps \| interview bank first | \| S, live interview · agent for the `MISTAKES.md` gap write; Victor for the `SESSION-LOG.md` commit \| interview bank first | simulator-prompt.md L447-455, L466-468 |
| R3 | README.md | catalogue sql-plan Reads | `practice/sql/PLANNING.md`, `ROADMAP.md`, the exercise files (counted, never edited) \| | `practice/sql/PLANNING.md`, `ROADMAP.md`, the level's existing `practice/sql/{LEVEL}/PLANNING-{LEVEL}.md` (reconciled and history-gated), `_coverage-standard.md` (the digest command behind `Coverage SHA-256`), the level's existing `Exercise route` rows in `PROGRESS.md`, the exercise files (counted, never edited) \| | sql-plan-prompt.md L72-73, L113-114, L409 |
| R4 | README.md | catalogue _sql-exercise-seeds scope source | Scope still comes from `coverage-junior.md`, never from here. | Scope still comes from `notes/sql/coverage/{LEVEL}.md`, never from here. | _sql-exercise-seeds.md L10-11 |
| R5 | README.md | catalogue sql-plan-audit Reads | \| `_sql-plan-standard.md`, both plan files, `notes/sql/coverage/{LEVEL}.md`, `ROADMAP.md`, `PROGRESS.md`, | \| `_sql-plan-standard.md`, both plan files, `notes/sql/coverage/{LEVEL}.md`, `_coverage-standard.md` (the canonical digest command, Phase 1), `ROADMAP.md`, `PROGRESS.md`, | sql-plan-audit.md L109-110 |
| R6 | README.md | catalogue sql-exercises Reads (branch file) | `practice/sql/MISTAKES.md` (`## Open` and `## Fricción`, for a revision point's or a `reinforce` run's focus); | `practice/sql/MISTAKES.md` (`## Open` and `## Fricción`, for a revision point's or a `reinforce` run's focus), and the one branch file its `MODE` names (`_sql-exercises-practice.md` for `practice`/`reinforce`, `_sql-exercises-review.md` for `review`); | sql-exercises-prompt.md L384-392 |
| R7a | README.md | catalogue simulation-plan Reads (coverage standard) | \| `_simulation-plan-standard.md`, selected-level topic coverage, `_shared-context.md`, | \| `_simulation-plan-standard.md`, `_coverage-standard.md` (the evidence-marker stripping rule), selected-level topic coverage, `_shared-context.md`, | simulation-plan-prompt.md L28, L55-56 |
| R7b | README.md | catalogue simulation-plan Reads (own doctrine/route) | SQL doctrine/route, existing specs, TRACKER, MISTAKES \| | SQL doctrine/route, the simulation doctrine and level route when they exist, existing specs, TRACKER, MISTAKES \| | simulation-plan-prompt.md L75-77, L82-83, L103 |
| R8 | README.md | catalogue simulation-review Reads | selected-level Q&A, submitted solution/correction \| | selected-level Q&A, `_interview-prep-standard.md` (when the review adds questions), submitted solution/correction \| | simulation-review-prompt.md L33-35 |
| R9 | README.md | catalogue code-review Reads | \| snippet generated fresh; selected-level Q&A; `practice/interview/MISTAKES.md` \| | \| snippet generated fresh; selected-level Q&A; `practice/interview/MISTAKES.md`; `_interview-prep-standard.md`'s "Adding questions from outside the audit" section \| | code-review-prompt.md L165-167 |
| R10 | README.md | feed bullet coverage mirrors (SQL level) | mirror; current project planning, roadmap review, and SQL practice intentionally consume junior. | mirror; current project planning and roadmap review intentionally consume junior, while SQL practice consumes the selected level's mirror (`sql-plan` plans one `LEVEL` at a time, junior first). | sql-plan-prompt.md L19, L39, L90, L95-96 |
| R11 | README.md | feed bullet SQL route -> sql-exercises | → read by `sql-exercises` (every run takes its topic, count and focus from the ⏎   current step), by | → read by `sql-exercises` (a first-pass `practice` run takes its topic, count and focus from the ⏎   current step; a revision point takes its file and span from the route's §1 revision table and its focus from `MISTAKES.md`; `reinforce` takes its file from `FILE`), by | sql-exercises-prompt.md L162-166, L189 |
| E-C2 | _system-map.md | §7 SQL route Written by (settled conflict C2) | `sql-grade`'s subagent (scored counts/status) | `sql-grade`'s subagent — and the same grading branch reached directly through `/sql-exercises MODE = review`, the legacy door — (§1 and §3 scored counts, §3 statuses, §2 `**Coverage bullets:**` `[ ]` → `[x]` flips, and, on a score under 60%, a `**Moment 2b reinforcement block:**` appended to the topic's §2 step) | sql-exercises-prompt.md L389; _sql-exercises-review.md L275-292, L346-347, L438-440, L459-464, L623-627 |
| E-C1 | README.md | README L643 shared internal row Reads/Generates (settled conflict C1) | and opens every file at the step that uses it. \| — \| — \| | and opens every file at the step that uses it. \| practice branch: `PROGRESS.md` → `### Exercise route` (`{FILE}`'s row), `{FILE}` (its highest exercise number, format and setup block), `{PLAN}` §2 (the step's `**Coverage:**` line) and the `notes/sql/coverage/{LEVEL}.md` sections it names, `_sql-exercise-seeds.md` (its topic's block), and on a new file `practice/sql/PLANNING.md` → the local-database registry · review branch: `{FILE}`, `PROGRESS.md` → `### Exercise route` (`{FILE}`'s row), `{PLAN}`, `notes/sql/coverage/{LEVEL}.md` (its section headings), `practice/sql/MISTAKES.md` (`## Open`) \| practice branch: `{FILE}` (the setup block on a new file, then the exercise blocks), and the `Corrected` cells and `Total` rows of `PROGRESS.md` → `### Exercise route` · review branch: the `✅ Corregido` / `❌ Revisado` header markers on `{FILE}`, `PROGRESS.md` → `### Exercise route`, `{PLAN}` §1, §2 and §3, the doctrine's §0 when a step closes, and `practice/sql/MISTAKES.md` (`## Open`, `## Closed`) \| | _sql-exercises-practice.md L21-23, L34-35, L58-60, L191-192, L205-211, L316-318, L359-360, L368-369, L384-397; _sql-exercises-review.md L22, L51-52, L224, L233-234, L373-519, L548-549, L553-555, L576, L590-591 |

**How the two conflicts were settled.** C1 (`README.md` L643, the shared internal row, `Reads` and
`Generates` = `—`): settled for `missing` — `—`/`—` is the catalogue's shape for files that read and write
nothing, while every other executing component row lists its reads and writes; the practice branch's
conditional `{PLAN}` §1/§3 write is deliberately left out (contested ownership, `REC-357`). C2
(`_system-map.md` §7 SQL route `Written by`): settled as the union of both proposals, in the sibling
`MISTAKES.md` row's two-door phrasing.

**Occurrences of a changed claim deliberately not patched** (each an absence in a `cross`-owned feed
bullet, or true for its own prompt; owed to a `cross` run or a concern licensed for it):

1. `README.md` L417 `/hr-screen` "agent for logs/gaps" — R2's old words, true for `/hr-screen`: its gap
   write is agent-committed and its one Victor-committed output (`hr-screen.md`) is neither a log nor a gap.
2. `README.md` L697-702, the `verify-{LEVEL}.md` feed bullet, names no `sql-plan` reader (SM1's claim).
3. `README.md` L809-813, the SQL route feed bullet, "advanced by `sql-grade`'s subagent (§1 scored counts,
   §3 statuses, §2 `[x]` bullets)" — omits the legacy door and the Moment 2b block (E-C2's claim).
4. `README.md` L832, the SQL `MISTAKES.md` feed bullet, "→ read by the revision points the level's route §1
   declares" (SM5's and SM15's claim).
5. `README.md` L840-842, the spec feed bullet, "→ read by Victor, `simulation-block-open`, and the cold
   reviewer." (SM8's claim).

## 4. Rows ruled correct, and struck rows

Correct rows, per concern, are the first number in §1's table: 416 in total across 27 concerns, as the
returns declare them. No section is reported as "verified" as a whole. **The final reviewer re-ruled three
rows:** `sql-exercises-prompt` and `simulation-review-prompt`, `_run-tracker.md` `Written by` — `missing` →
`correct` ("every prompt's close-out" covers each prompt's own tracker cells, as the `sql-plan` and
`simulation-plan` concerns ruled the same row; SM10 dropped); `_sql-exercises-practice`, `README.md` L643
`Reads` and `Generates` — `correct` → `missing`, settled in E-C1. After the re-rulings: 416 correct
(+2 − 2). **Struck rows: none** — the final reviewer confirmed no accepted `missing` sits outside its
return's licence, and that R10 and R11 (both in "How the prompts feed each other") are positive
contradictions. Gate note: `practice-session`'s accepted return backs SM13's "the topic, block or concept"
with its L68 only by citation, not quotation; the final reviewer verified it against the source (F2).

## 5. Findings and ledger IDs

- `REC-355` — launcher defects: the `sql-exercises` pair restates two prompt-owned rules (the `Coverage
  SHA-256` mismatch outcome, and the legacy `MODE = review` "closes nothing", which is also false) and the
  `sql-plan-audit` pair restates its commit/gate sequence. Sibling of open `REC-344` and `REC-352`.
- `REC-356` — `simulation-grade/SKILL.md` L15-19 and `simulation-block-close/SKILL.md` L12-16 (both
  mirrors): the `desvíos` close-out sentence `eec1a117` inserted splits an existing sentence. Surfaced by
  the `simulation-grade` concern; the second skill found by the orchestrator's grep.
- `REC-357` — reviewer-surfaced (RF1): `_sql-exercises-practice.md` L88-89 and L349-350 tell the practice
  branch to write `{PLAN}` §1/§3, which `_sql-plan-standard.md` Section E, `sql-plan-prompt.md` rule 7 and
  the branch's own L92-93 give to `/sql-plan`.

No `source-contradiction` was ruled. Deduplicated against both ledger files: no open or closed row holds any
of the three (`REC-324` is a different `simulation-block-close` defect).

## 6. Final review

`approve-with-tightening` — one cold `reviewer`, tier `deep`, over the draft report, the draft patch, all 27
accepted returns and `snapshot.tsv`. It approved 28 edits as drafted, tightened SM1, dropped SM10, settled
C1 and C2 (E-C1, E-C2), confirmed no rule fork and no struck row, named the five unpatched occurrences listed
in §3, ruled `REC-355` (with clause (b)'s falsity added) and `REC-356` recordable, and surfaced `REC-357`.
Checks 5-6 passed: 27 of 27 concerns, all 54 snapshot blobs unchanged at review time, no live artifact in
the record.

## 7. Run notes

Step 3 rejected two first returns for gate item 3 — `practice-session` (its §9 isolation proposal named the
`deep` tier and the two `git status` checks without quoting L138, L143, L161) and `sql-grade` (its proposals
named "match on the numeric prefix" and the subagent's doctrine §0 write without quoting L48-49, L155-156).
Both were re-dispatched cold once and accepted.

Observation for the next `map-sync`, not patched (no concern proposed it): "closes no step" —
`_system-map.md` §7 SQL `MISTAKES.md` row ("the legacy door that still grades but closes no step") and
`README.md` L976 ("legacy door, which grades identically but closes no step") — is contradicted by
`_sql-exercises-review.md` L439-440, L507 and L535-538, `sql-exercises-prompt.md` L389 and
`sql-grade/SKILL.md` L112: that door does close the step's §3 row; what it never does is hand off to
`sql-step-close`.
