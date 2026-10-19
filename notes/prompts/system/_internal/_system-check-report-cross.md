# System-check report — cross

Date: 2026-10-19 (admitted 2026-10-18) · Flow: cross · Starting commit: `0eabcc701bcb47f8d8a6d330012c51d765e69514` · Branch: `projects/07-timetrack`
Status: complete

## 1. Audited scope

Prompt `notes/prompts/system/system-check-prompt.md` blob `c8337184e21becab43d00177fac9b4e4813dc11e` ·
mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob
`cd60ab694e617051255f7962a6b6e17fc551d522`.

Why this run: `FLOW = next`. knowledge, projects, practice, strategy and system were `fresh`; `cross` had never run; no
path was `unassigned`. With this run complete every flow is `fresh` until its sources move.

Path-set digest: `684ade9cf3f058895f1cbf508b06c48226d0b2b3e8c744c0910252263edde8bf` — SHA-256 of the 189 inventory paths,
codepoint-sorted, LF-joined, no trailing LF. **Every count, exclusivity or completeness claim below marked
`path-set-level` rests on that digest alone**: a change of path set stales it, and no list of blob ids holds it.

Concerns: 5 clusters (`chains`, `progress`, `loop`, `day`, `catalogue`), analyst tier `standard`, all accepted at Step 3
(§5). Dispositions as each accepted return declares them: correct / incorrect / missing / fenced / source-contradiction.

| Cluster | Rows | c / i / m / f / sc | Rows marked `path-set-level` |
|---|---|---|---|
| chains | 78 | 60 / 7 / 11 / 0 / 0 | 5, 6, 47, 48, 49, 56, 58, 59 |
| progress | 35 | 28 / 4 / 3 / 0 / 0 | 12, 25, 26, 34 |
| loop | 91 | 83 / 8 / 0 / 0 / 0 | 3, 26, 58a, 67, 72, 87b and the others its return marks |
| day | 65 | 51 / 14 / 0 / 0 / 0 | D07, D13, D35, D42, D53, D60, D64 |
| catalogue | 75 | 58 / 14 / 3 / 0 / 0 | the absence-based rows its return marks (A1-A3, A5, A7, B1, B2, B4, B6, D2, E1, E2, E4, G4, G6, H-region counts) |

Files the clusters opened or matched by grep — an inventory path is listed when an accepted return names it as read
whole, read in part or grep-matched; the two maps are outside every freshness comparison and are omitted. Blob ids are
`snapshot.tsv`'s at admission, unchanged when the patch was applied:

| Path | Blob id | Lines | Clusters |
|---|---|---|---|
| .agents/skills/authoring-progress-recount/SKILL.md | b03d570896b8e5c0199e80997990fc15b0bdde2a | 171 | chains, progress, loop, day, catalogue |
| .agents/skills/backlog-task-close/SKILL.md | 707ab5a6e6dcce31213cb795ed99fd8fabe5c5d0 | 542 | chains, progress, loop, day |
| .agents/skills/backlog-task-open/SKILL.md | 8abe6aac825c16c3d78e3a600df8b9e246da6204 | 328 | chains, loop, day, catalogue |
| .agents/skills/coverage-bullet-add/SKILL.md | ba742943889238ad4ac40cef6ac798a19e973da5 | 299 | chains, progress, day, catalogue |
| .agents/skills/coverage-mark/SKILL.md | c773612615457c9fa9c7463993b7f905eb95b942 | 398 | chains, progress, loop, day, catalogue |
| .agents/skills/interview-prep-block-open/SKILL.md | 6257f0eb3c7bcdae5d9fe09c7dd1635f07844a05 | 120 | chains, progress, loop, day, catalogue |
| .agents/skills/map-sync/SKILL.md | c59c86f9cbf7178637e1c9f82c1f75abc22b21c2 | 179 | loop, day |
| .agents/skills/practice-session/SKILL.md | a6d536ab10e47a27adcd13a7b5528451ad6b42a0 | 223 | progress, loop, day |
| .agents/skills/readme-concept-add/SKILL.md | 9d778f250db35c5e69de4caaa3da22bcd9c6dcee | 263 | day, catalogue |
| .agents/skills/simulation-block-close/SKILL.md | c0860adadf724132fb184ffac8ba59128859979f | 52 | day |
| .agents/skills/simulation-block-open/SKILL.md | b4185b29b7ea8c14b0f1f37c25a3283ad99fd281 | 56 | day |
| .agents/skills/simulation-grade/SKILL.md | 10bff9a6f34c202b2880c7fa24abb8cb95afd6bb | 56 | loop, day, catalogue |
| .agents/skills/skill-refine/SKILL.md | 73ebd1beefe7184bed789b2b08fdbc3e638b5164 | 195 | loop, day |
| .agents/skills/slice-review/SKILL.md | 65739640ec1ceb22cf35640424c28f6e5bb602cb | 191 | chains, loop, day, catalogue |
| .agents/skills/sql-block-close/SKILL.md | 034808c05e8f0ac64add00c75551d137853448d5 | 155 | chains, day |
| .agents/skills/sql-block-open/SKILL.md | 1b6c216722eb3c67648f6096c9d3eb477babd828 | 214 | day |
| .agents/skills/sql-grade/SKILL.md | 50e738b717e78bebe9efd33dc500b2214aeb73d6 | 214 | chains, progress, day |
| .agents/skills/sql-step-close/SKILL.md | 02e66f8bb6e1b5d866ba72585277e1312ecbd680 | 254 | chains, progress, loop, day, catalogue |
| .agents/skills/step-complete/SKILL.md | cb5da841ec28e5cb07b704e6ec81c4f5038a8b43 | 419 | chains, progress, loop, day |
| .agents/skills/study-block-close/SKILL.md | 5ad9c002b2354ae4bd58b5f152a61d26f6001560 | 172 | chains, progress, loop, day, catalogue |
| .agents/skills/study-content-writer/SKILL.md | 1d0b8324142033eafde2421f43b049cdaba8e329 | 347 | chains, progress, loop, day |
| .claude/commands/roadmap-review.md | db55c91d9242c97797b5c16aa24fcbaa0253382d | 11 | progress |
| .claude/commands/simulation-review.md | 0578c7beee55afe878e4a76773350878be7d11d7 | 16 | catalogue |
| .claude/commands/simulator.md | ecc23d685f8ce5e69e8d0bfffa4a5e5f75ae6b64 | 14 | catalogue |
| .claude/skills/authoring-progress-recount/SKILL.md | b03d570896b8e5c0199e80997990fc15b0bdde2a | 171 | chains, progress, loop, day, catalogue |
| .claude/skills/backlog-task-close/SKILL.md | 707ab5a6e6dcce31213cb795ed99fd8fabe5c5d0 | 542 | chains, progress, loop, day |
| .claude/skills/backlog-task-open/SKILL.md | 8abe6aac825c16c3d78e3a600df8b9e246da6204 | 328 | chains, loop, day, catalogue |
| .claude/skills/coverage-bullet-add/SKILL.md | ba742943889238ad4ac40cef6ac798a19e973da5 | 299 | chains, progress, day, catalogue |
| .claude/skills/coverage-mark/SKILL.md | c773612615457c9fa9c7463993b7f905eb95b942 | 398 | chains, progress, loop, day, catalogue |
| .claude/skills/interview-prep-block-open/SKILL.md | 6257f0eb3c7bcdae5d9fe09c7dd1635f07844a05 | 120 | chains, progress, loop, day, catalogue |
| .claude/skills/map-sync/SKILL.md | c59c86f9cbf7178637e1c9f82c1f75abc22b21c2 | 179 | loop, day |
| .claude/skills/practice-session/SKILL.md | a6d536ab10e47a27adcd13a7b5528451ad6b42a0 | 223 | progress, loop, day |
| .claude/skills/readme-concept-add/SKILL.md | 9d778f250db35c5e69de4caaa3da22bcd9c6dcee | 263 | day, catalogue |
| .claude/skills/simulation-block-close/SKILL.md | c0860adadf724132fb184ffac8ba59128859979f | 52 | day |
| .claude/skills/simulation-block-open/SKILL.md | b4185b29b7ea8c14b0f1f37c25a3283ad99fd281 | 56 | day |
| .claude/skills/simulation-grade/SKILL.md | 10bff9a6f34c202b2880c7fa24abb8cb95afd6bb | 56 | loop, day, catalogue |
| .claude/skills/skill-refine/SKILL.md | 73ebd1beefe7184bed789b2b08fdbc3e638b5164 | 195 | loop, day |
| .claude/skills/slice-review/SKILL.md | 65739640ec1ceb22cf35640424c28f6e5bb602cb | 191 | chains, loop, day, catalogue |
| .claude/skills/sql-block-close/SKILL.md | 034808c05e8f0ac64add00c75551d137853448d5 | 155 | chains, day |
| .claude/skills/sql-block-open/SKILL.md | 1b6c216722eb3c67648f6096c9d3eb477babd828 | 214 | day |
| .claude/skills/sql-grade/SKILL.md | 50e738b717e78bebe9efd33dc500b2214aeb73d6 | 214 | chains, progress, day |
| .claude/skills/sql-step-close/SKILL.md | 02e66f8bb6e1b5d866ba72585277e1312ecbd680 | 254 | chains, progress, loop, day, catalogue |
| .claude/skills/step-complete/SKILL.md | cb5da841ec28e5cb07b704e6ec81c4f5038a8b43 | 419 | chains, progress, loop, day |
| .claude/skills/study-block-close/SKILL.md | 5ad9c002b2354ae4bd58b5f152a61d26f6001560 | 172 | chains, progress, loop, day, catalogue |
| .claude/skills/study-content-writer/SKILL.md | 1d0b8324142033eafde2421f43b049cdaba8e329 | 347 | chains, progress, loop, day |
| notes/prompts/_internal/_agent-runtime-standard.md | 5599a097c599bbb05ad50c5bb711a7747d4cf14a | 117 | loop, catalogue |
| notes/prompts/_internal/_batch-mode.md | e6bdcaf47bbc44625eccbf117d61ce6d4193524e | 107 | catalogue |
| notes/prompts/_internal/_external-path-preflight.md | 1bee89cb47415a4cc34d29fe68fb1820110137fc | 15 | catalogue |
| notes/prompts/_internal/_pipeline-self-report.md | 6c1202d84083cbb49c36d25d7df9ae049189a59e | 461 | loop, catalogue |
| notes/prompts/_internal/_recommendation-ledger-closed.md | 759c6b4bc654e09d615a2d9e027f0159618519b0 | 351 | chains, progress, loop, day, catalogue |
| notes/prompts/_internal/_recommendation-ledger.md | 69b71f1939f9d6ab627bab383ba03e57e25790b6 | 366 | chains, progress, loop, day, catalogue |
| notes/prompts/_internal/_recommendation-resolution-doctrine.md | ad65dde424e5abea71280977313ce1f8763b7544 | 1725 | loop, catalogue |
| notes/prompts/_internal/_session-rules.md | 0a44dcb4b4371ef984fd5457e539930ea3190b47 | 1526 | chains, progress, loop, day, catalogue |
| notes/prompts/_internal/_shared-context.md | b848bd4771705fda62fbb6c593ebf801e400b999 | 187 | catalogue |
| notes/prompts/_internal/_single-shot-self-report.md | 75abd66be7fe44c3d067d1d349e6ebc86c6baa39 | 221 | loop, catalogue |
| notes/prompts/_internal/validate-prompt-system.ps1 | ea371b057f598a5b236ae8f6a2cc557c3246d94d | 1697 | chains, loop, catalogue |
| notes/prompts/knowledge/coverage/_internal/_coverage-prompt-rationale.md | 3db536a5763e8ae900801d2c3e2313157731c43d | 308 | progress, catalogue |
| notes/prompts/knowledge/coverage/_internal/_coverage-standard.md | 2342f6a1ce2fbd19ca0d3791ce91fc68eb748413 | 427 | loop, catalogue |
| notes/prompts/knowledge/coverage/_internal/_topic-ownership.md | 4fde7a60fde1965bfdd2c46abaab6885fd6ec764 | 88 | catalogue |
| notes/prompts/knowledge/coverage/coverage-audit-prompt.md | d0e260befc4aa3a7d80c9a0f20b8fdeea0159206 | 206 | chains, progress, catalogue |
| notes/prompts/knowledge/coverage/coverage-prompt.md | ce2cc5dad19537aebbd4c560990f46a510aa68af | 416 | progress, catalogue |
| notes/prompts/knowledge/coverage/coverage-verify-prompt.md | 02ac6d1680575ea9b1a71cd484c7f38e01ae90e0 | 278 | chains, catalogue |
| notes/prompts/knowledge/coverage/evidence-intake-prompt.md | 4334b3ec388eed8b1201823d6c135c25ed653083 | 178 | catalogue |
| notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md | 3586736e5642dcbc39be261592f562c65effe5cc | 586 | chains |
| notes/prompts/knowledge/interview-prep/interview-prep-audit.md | a0865c7eb10b4cbfa1482e208a3ec90708949dbc | 611 | day |
| notes/prompts/knowledge/interview-prep/interview-prep-route-projects-prompt.md | 5605efdfb4b6d05b09d2cc61300cf3b7f6c9cffb | 208 | chains |
| notes/prompts/knowledge/interview-prep/interview-prep-route-prompt.md | 6f33cc715ab993b2722672d5e0177354d62c1dd3 | 144 | chains, catalogue |
| notes/prompts/knowledge/notes/_internal/_note-quality-standard.md | d1df09e88a66d63269b04e37349aa817788dee43 | 1249 | progress |
| notes/prompts/knowledge/notes/notes-audit.md | c851a4e93e04184e7dc36e3ddf546200921865be | 484 | progress, day |
| notes/prompts/knowledge/notes/notes-plan-prompt.md | b66d6ce8efa2fa39494a2bf4520b8545d3a263da | 579 | chains, catalogue |
| notes/prompts/practice/exercises/_internal/_practice-plan-prompt.md | 49a064c2b3b27f54f76fb7fd6540b4821d2a60d7 | 57 | loop, day, catalogue |
| notes/prompts/practice/exercises/_internal/_practice-review-prompt.md | 635876ae044558c5f564b9092fe11b5273a30963 | 88 | progress, loop, catalogue |
| notes/prompts/practice/exercises/_internal/_practice-standard.md | 9c65df0e2d8a58cea849725745834bf24409de18 | 346 | chains, progress, loop, catalogue |
| notes/prompts/practice/exercises/_internal/validate-practice-plan.py | 56c62d7a151d1f51fab203ecbf2678a1ae6509ae | 150 | loop, catalogue |
| notes/prompts/practice/interview/code-review-prompt.md | 7797bda0a9c85c50d0458a0f553f68f830e96c09 | 215 | chains, catalogue |
| notes/prompts/practice/interview/hr-screen-prompt.md | 9880b0a9d327f2d520367f1cab25521bff7582b6 | 153 | chains, catalogue |
| notes/prompts/practice/interview/simulator-prompt.md | 8e36d9f385b5cfc6e39ab7643d9531749dec51ad | 478 | chains, catalogue |
| notes/prompts/practice/simulations/_internal/_simulation-plan-standard.md | 3e337143e611df8b8265417df7b7eedc56ac6da0 | 269 | chains |
| notes/prompts/practice/simulations/simulation-generator-prompt.md | e840465cce429302b69fc1f800c870ad4f0f6da9 | 110 | chains, loop, catalogue |
| notes/prompts/practice/simulations/simulation-plan-prompt.md | 7bdb23c2291a61731cd588df86115093678c9ba3 | 146 | chains, progress |
| notes/prompts/practice/simulations/simulation-review-prompt.md | f4eb7236b5aff0e744915ffddebeb40ad83ecbd6 | 235 | chains, progress, loop, catalogue |
| notes/prompts/practice/sql/_internal/_sql-exercises-practice.md | e10af5252d1271ec9ed9b668850ee3e1424f1872 | 418 | progress |
| notes/prompts/practice/sql/_internal/_sql-exercises-review.md | f681bf236cbd385421c0f24979165da9893ca14b | 650 | chains, progress |
| notes/prompts/practice/sql/_internal/_sql-plan-standard.md | 2824a7d9a71525e6ca1bfa475671aa6591a8688f | 363 | chains |
| notes/prompts/practice/sql/sql-exercises-prompt.md | 74617f37e34e6d732ad983a69779d5ffc6e3d04b | 430 | progress, catalogue |
| notes/prompts/practice/sql/sql-plan-prompt.md | 6a8bfebc232e9098cfb670caf714b14ed29d7f1d | 454 | chains, progress, catalogue |
| notes/prompts/projects/plan/_internal/_plan-review-prompt.md | 97b19c7174a815e27ba40d2cfa3df0c4e4083701 | 225 | chains, catalogue |
| notes/prompts/projects/plan/_internal/_plan-write-prompt.md | 1a228af8853eda0c1edf20eba3f490049644e702 | 245 | chains, progress |
| notes/prompts/projects/plan/_internal/_planning-standard.md | 4167ef1726d5409c716e244ec1d9327c8f2db9d1 | 673 | chains |
| notes/prompts/projects/plan/plan-audit.md | 5a41d4c5a32ea07c54061e867c0e54b3d117cbc9 | 402 | chains |
| notes/prompts/projects/plan/project-brief-prompt.md | fa1fb411fd6b485e59fa99e0930c51f904f64eef | 307 | chains, progress, catalogue |
| notes/prompts/projects/portfolio/_internal/_portfolio-standard.md | 797aa2b164a6b1e5ede0acf51e3ee5ef07930433 | 1056 | chains, progress, day |
| notes/prompts/projects/portfolio/portfolio-audit.md | 803b7671fcdde56c13d9541a0f1c30fcbcdb5306 | 1144 | day |
| notes/prompts/projects/readme/_internal/_readme-standard.md | 14751fdaf04177118ca482d82fd968508b88329b | 577 | chains, catalogue |
| notes/prompts/projects/readme/_internal/_readme-write-prompt.md | f87a52c2844f167b6392a0f1f5287af3920f4b32 | 103 | catalogue |
| notes/prompts/projects/readme/readme-audit.md | eed37b05240ad4229813edfc8e7f5a9b39ae15b6 | 406 | loop |
| notes/prompts/projects/review/_internal/_review-standard.md | 98d8bdf4867f566f43e1b1b9821cba72ecb878f2 | 598 | progress |
| notes/prompts/strategy/apply/_internal/_application-standard.md | 0b6ecdb1365d9722e5ca49e2757e3c2ef68a3390 | 303 | chains, catalogue |
| notes/prompts/strategy/apply/cover-letter-prompt.md | af69008e4424f9154bb9b45b3c2712cad1a036c6 | 140 | chains, progress, catalogue |
| notes/prompts/strategy/apply/cv-prompt.md | 00ca621406f1b35b6fa072cac28e02b345c2cf9a | 357 | chains, progress, catalogue |
| notes/prompts/strategy/apply/linkedin-prompt.md | 76e7cb7e50400b2743242ca0cd0515a191058888 | 299 | chains, progress, catalogue |
| notes/prompts/strategy/apply/profile-readme-prompt.md | 13d0b9c652d62cff6959bc82bd15ba6cfcc9b301 | 111 | chains, progress |
| notes/prompts/strategy/apply/tracker-prompt.md | 2981598a82961086700914845071feb35ea1f015 | 216 | chains, catalogue |
| notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md | bbd25bd4803609254db45020879987804d741d41 | 166 | catalogue |
| notes/prompts/strategy/tracking/_internal/_roadmap-standard.md | 96160d4558c0a76beeb6511ce6c7f4b1fa28dbb4 | 206 | chains, progress |
| notes/prompts/strategy/tracking/progress-update-prompt.md | cb1c7c8406e70fbd07bbab6689b7ee9049bdb302 | 604 | chains, progress, day, catalogue |
| notes/prompts/strategy/tracking/roadmap-review-prompt.md | 417ccd7426f4a49798a8729578d920982d921b1c | 519 | chains, progress, catalogue |
| notes/prompts/system/_internal/_system-check-reconcile-prompt.md | cd60ab694e617051255f7962a6b6e17fc551d522 | 122 | chains, progress, loop, day, catalogue |
| notes/prompts/system/system-check-prompt.md | c8337184e21becab43d00177fac9b4e4813dc11e | 392 | chains, progress, loop, day, catalogue |
| notes/prompts/system/system-gaps-prompt.md | a5ed1cdad78872e68463a81475df2c50522993ee | 298 | chains, loop, catalogue |

## 2. Validator

Baseline (`-MachineryOnly`, Step 0): every check `PASS`; one `REPORT` (the path a closed ledger line proposes for a Git workflow
note — a proposal, not a typo); `SKIP` live coverage/plan/route state by design.
Final (`-MachineryOnly`, after the approved patch, the ledger rows and this report): every check `PASS`, the same one
`REPORT` and the same `SKIP`; 68 distinct open ledger IDs compared (64 + `REC-370`–`REC-373`). A first final run
flagged this report's backticked copy of the ledger-proposed path as dead; the sentence was reworded and the validator
re-run before the audit commit.

## 3. Map corrections

Applied in the reviewer's `approve-with-tightening` form — 74 edits; script `review/patch-final.py` and diff
`review/applied-patch.diff` are in the run checkpoint. Each edit ID names the accepted row whose was, now and source
quote it implements; the source column gives that row's quoted lines.

| ID | Map · row | Was → now (short) | Source |
|---|---|---|---|
| D01-D04 | `_system-map.md` §13 table, `Declared steps · contract size` | 43·~1,850 / 29·~858 / 20·~500 / 18·~368 → 52·~2,440 / 29·~1,001 / 20·~810 / 22·~374 | the 21 `.claude/skills/*/SKILL.md`, counted by §13's own rule and re-run by the reviewer |
| D05 | §13 under the table | measured 2026-08-26 → 2026-10-18 | the one-pass re-measurement |
| D09a/b | §13 opening; preamble item 5 | "Every other section cuts … by track" → "Sections 3–6 cut …" | the map's own §7–§12 headings |
| D13 | §13 "no skill reads the clock" | → no skill reads the *hour*; names the two date reads | `step-complete` l.291-295, `backlog-task-close` l.262-269 |
| D39 | §13 08:00 bullet | "calls two of the three only on its exception path" → only `coverage-bullet-add` | `step-complete` l.168-170, l.236-238 |
| D41 | §13 | 10 + 7 + 8 + 6 → 11 + 7 + 8 + 6 | `backlog-task-close` l.33-34, l.502 |
| D47, D48 | §13 trace bullet | "finishes no step …" → verifiable piece; "widest trace" → "as wide as any block's" | `coverage-mark` l.15-17, `readme-concept-add` l.16-18 |
| D53, D56 | §13 questions bullet | "allowed to ask a question" → "has a question as its product"; "stall a block" → "write past an open question", pointing at §9 | `study-content-writer` l.204-206, `step-complete` l.78-84, `backlog-task-open` l.175 |
| D61 | §13 last paragraph | `map-sync` fires "in any session at all" → "outside a prompt pipeline run" | `map-sync` l.15-17 |
| L13b | preamble | "`REC-062` found three restatements" → "`REC-064`'s cold review found `REC-062`'s licence restated three times" | doctrine l.612-615 |
| L26 | §9 prose | rule kept; exceptions listed (`step-complete` step 0, `backlog-task-open` step 3) | `step-complete` l.78, `backlog-task-open` l.175 |
| L57 | §12 intro | "an edit is never a decision someone makes" → "not made on a hunch … a run's report or a ruling Victor states" | closed ledger l.274, l.275, l.302 |
| R-K1 | §12 item 1 | + "`readme-audit` restates them as seven" | `readme-audit.md` l.345, l.378; `_pipeline-self-report.md` l.87 |
| L71, R-L71b | §12 skill loop; §1 `Trace it leaves` | + the `desvíos:` line and the `SBRC` loop | `_session-rules.md` l.475-506 |
| L78, R-L78b | §12 sweep; README `/system-check` catalogue row | one analyst per inventory file and paired skill, one mechanical for launchers; licence as the mandate narrows and extends it | `system-check-prompt.md` l.266-273; mandate l.10-13 |
| L83, R-L83b | §12; README `/system-check` catalogue row | "a claim its own source contradicts" → "whose own source states two mutually exclusive clauses" | `system-check-prompt.md` l.59-60; mandate l.106-108 |
| L87b | §12 | "the second place … bounded" → "one of the places" | `_session-rules.md` l.508; `system-gaps-prompt.md` l.213 |
| P03, P31, R-P3c | §8 intro; README hub `PROGRESS.md` `Written by`; README feed bullet | `/progress-update` audits the rest → except `Short exercises` (`REC-275`) and `Useful resources` | `progress-update-prompt.md` l.91, l.93 |
| P12 | §8 `Authoring progress` | "Alone among the counts" → its notes row keeps `*`, its interview rows `—` | `authoring-progress-recount` l.72-77, l.102-103 |
| P18 | §8 `Projects` | + whole-project completion: Victor by hand on `step-complete`'s reminder | `step-complete` l.394-398 |
| P20 | §8 `Exercise route` | + the legacy `/sql-exercises MODE = review` door | `sql-exercises-prompt.md` l.277, l.389 |
| P28 | §8 | + `## Useful resources` and header-prose row | `progress-update-prompt.md` l.93, l.323-325 |
| P34 | README hub `PROGRESS.md` `Read by` | "simulation/interview planning" → `simulation-plan` + `interview-prep-block-open` | `simulation-plan-prompt.md` l.48; `interview-prep-block-open` l.32 |
| C-B2 | README "Every folder keeps …" | + `practice/interview/`'s `_internal/` appears with its first report | `code-review-prompt.md` l.213, `hr-screen-prompt.md` l.151, `simulator-prompt.md` l.476 |
| C-B4 | README "Internal —" | "Two kinds" → "Mainly two kinds" | the internal-only list it introduces |
| C-B6 | README slash-skill grep | "three lines today" → two | the stated regex, re-run by the reviewer |
| C-B9, K-6 | README orchestrator flavour; `_system-map.md` §1 `Questions` | + seven orchestrators stop and ask which branch when started on `main`; "human ownership gate" | `plan-audit.md` l.98 and six others |
| C-B11, C-G5 | README single-shot flavour; batch mode | the solution goes to `simulation-grade`, which dispatches the prompt cold | `.claude/commands/simulation-review.md` l.6-9 |
| C-D2 | README internal-only list | + closing sentence naming the root files the list omitted; the `_` rule stays the exhaustive one | README l.282-285; `find` over `_internal/` |
| C-E1E2, C-E2 (×2), R-E2c | README hub `Read by` for the three mirrors; feed bullet | mirror readers re-derived; notes/interview-prep audits and `sql-exercises` read the topic files | `roadmap-review-prompt.md` l.55-59, `coverage-audit-prompt.md` l.36, `notes-plan-prompt.md` l.46, `coverage-verify-prompt.md` l.47, `sql-plan-prompt.md` l.39 |
| C-G4 | README batch mode | + `sql-plan-prompt` among "one target only" | `sql-plan-prompt.md` l.23 |
| C-G6 | README tiers | "Every orchestrator specifies a tier" → except the three coverage prompts | `coverage-prompt.md` l.27, `coverage-verify-prompt.md` l.33, `coverage-audit-prompt.md` l.24 |
| C-G7, C-G8 | README tier lists | concept-extraction subagents → mechanical; notes English reviewer and backend flow/security → deep; frontend reviewers → standard | `progress-update-prompt.md` l.148-149; `notes-audit.md` l.266-271; `review-audit.md` l.226-232 |
| C-H7 | §7 `_skill-runs.md` | "the only one Git ignores" → one of two, with `.system-check/flows/` | `.gitignore` l.8-12 |
| C-H10 | §7 `_session-rules.md` | 19 → 20 of the 32 prompts name it | path-set-level grep |
| C-H14a/b, R-H14c | §7 standards row; README `/system-gaps` catalogue and index rows | "the two contracts every runnable prompt executes" → the runtime standard every runnable prompt reads and the self-report contract every orchestrator executes | `_pipeline-self-report.md` l.180-182 |
| K-1 | §1 opening | "Everything in the repo" → "Nearly everything the system maintains … the rest is written by hand (§7)" | `_session-rules.md` l.1296-1300; `sql-block-close` l.130 |
| K-7, K-8 | §1 skills `Questions`, `Depth` | zero questions scoped to mechanical/closing rituals, exceptions in §9; cold dispatches named | `slice-review` l.50; the K3 settlement |
| K-19, K-77, R-K4a/b/c | §2; README run order; §12; README `/system-check` index and catalogue rows | freshness also requires an unchanged path set; the two maps excepted with the ledgers | `system-check-prompt.md` l.160-162, l.172-173 |
| K-26 | §3 inbox paragraph | + `/coverage-audit` reads every heading | `coverage-audit-prompt.md` l.40, l.85 |
| K-34 | §4 gate paragraph | `/portfolio-audit` tests both: Check 2 (G3/G4 stamps) and Check 3 (G6) | `_portfolio-standard.md` l.62-64 |
| K-35, K-37 | §5 SQL chain and prose | `sql-block-close` writes only `## Fricción`; revision points R1–R5 vs the level-close gates G3/G4 | `sql-block-close` l.33; `sql-step-close` l.151-163 |
| K-44, K-46, K-47, K-51, K-54, K-57 | README "How the prompts feed each other" | in-session coverage writers; `sql-plan` reads `verify-*`; `_job-market-evidence.md` readers; `PROGRESS.md` readers; in-session `PLANNING.md` writers; levelled-bank readers | `coverage-mark` l.11, `sql-plan-prompt.md` l.12-14, `coverage-verify-prompt.md` l.61, `cover-letter-prompt.md` l.53, `slice-review` l.161-165, `study-block-close` l.77-86 |
| K-52 | README feed, project brief | §3/§4 → §2/§3/§4 | `_plan-review-prompt.md` l.67-69 |
| K-69 | README run order, knowledge step 5 | + declaring the pair refined in session | `study-content-writer` l.220-222 |

Dropped by the reviewer: **C-F2a/b/c** — widening README's `Reads` absence fence from two files to four restates and
widens a rule `_session-rules.md` l.1402-1405 owns (`REC-064`), and its quoted source was the README's own heading; the
underlying gap went to the ledger (`REC-365`, widened). **K1** settled by the reviewer for loop 58a (R-K1); catalogue
H22's `correct` on that clause is superseded.

## 4. Rows ruled correct, per cluster

chains 60 · progress 28 · loop 83 · day 51 · catalogue 58 (H22 superseded on its "five bullets" clause by K1). No
section-level "verified". Struck rows: none — no accepted row ruled an absence outside its licence (reviewer).

## 5. Gate record (Step 3)

- All five clusters accepted. progress r1 was first rejected on item 1 (inventory files a claim names, opened by section
  rather than to EOF) and re-dispatched; the rejection was then **withdrawn**, when the prompt (l.146 "may open, to EOF,
  any inventory file a claim it rules on names") and the mandate (cross step 3 "open to EOF, and declare, every
  inventory file a claim names") were found to set different obligations. The operative reading applied to all five
  returns: a cited source is read to EOF and declared, or grep-matched for a `path-set-level` claim, or a verbatim
  positive line — no absence on a partial read. The reviewer accepted it as consistent with `_session-rules.md`
  l.1418-1422. Deviation logged as `BRCH-0009`; the ambiguity is `REC-370`.
- Four roles died on an API session limit. Under `_agent-runtime-standard.md`'s ladder, loop was read from its persisted
  complete return, chains and catalogue were resumed and finished, and progress r2 was superseded by the withdrawal.
- Conflicts sent to Step 4: K1 (one cell, two dispositions) — settled; K2–K4 (one fact, several cells) — K2 consistent,
  K3 and K4 tightened.

## 6. Findings

- `REC-370` (new) — the `cross` read obligation differs between `system-check-prompt.md` l.146 and the mandate's cross
  step 3.
- `REC-371` (new) — `map-sync/SKILL.md` l.131-133 quotes a §13 bullet ("10 + 7 + 7 + 5") that no longer exists.
- `REC-372` (new) — the zero-questions rule is unscoped in `_session-rules.md` l.1435-1436 and `map-sync` l.178, while
  `step-complete` l.78 and other skills put questions to Victor.
- `REC-373` (new) — `_session-rules.md` l.110 forbids reading a time; l.629-634 prescribes two date signals.
- `REC-367` (updated) — `system-gaps-prompt.md` l.53-54's "the two contracts every runnable prompt executes".
- `REC-363` (updated) — `backlog-task-close/SKILL.md` l.33-34 omits sub-step 2b from its walk list.
- `REC-365` (widened) — the README `Reads` fence leaves `_agent-runtime-standard.md` and the self-report contracts
  neither fenced nor listed.
- Existing, no change: `REC-275` (b) (`_session-rules.md` l.1123 vs `progress-update-prompt.md` l.91).
- No proved `source-contradiction` in any accepted return.

## 7. Final review

cold reviewer: approve-with-tightening — F2a/b/c dropped; chains 1, chains 7, loop 26, loop 71, day D56, progress 3,
12 and 31, B2 and G6 tightened; K1 settled for loop 58a; K4 and the missed occurrences added (README l.437, l.438,
l.693 ×3, l.707-708, l.736-737; `_system-map.md` l.84, l.737-738); every cluster has an accepted return; no
out-of-licence absence reached the patch; no machinery file or live artifact edited or opened. Verdict persisted at
`review/verdict.md` in the run checkpoint.
