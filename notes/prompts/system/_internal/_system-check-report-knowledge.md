# System-check report — knowledge

Date: 2026-10-16 · Flow: knowledge · Starting commit: `953565437903df467ded0d53fb75dbf63d31560b` · Branch: `projects/07-timetrack`
Status: complete

## 1. Audited paths

Prompt `notes/prompts/system/system-check-prompt.md` blob `c8337184e21becab43d00177fac9b4e4813dc11e` ·
mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob
`cd60ab694e617051255f7962a6b6e17fc551d522`.

Inventory: 44 paths — 20 knowledge-family prompt/component/standard files, six paired skills (both adapter
copies, identical blobs) and nine launcher pairs. Concerns: 27 (20 file, 6 skill, 1 launchers), all
accepted at Step 3. Map blobs at admission (evidence only, outside freshness): `README.md`
`a45b813831588b29fb8dc00a1cf89a130119ff00`, `_system-map.md` `8fb975fa1ea85e1cdb7b6fcfaefbe13a77215f48`.

Dispositions per concern as the accepted return declares them: correct / incorrect / missing / fenced / source-contradiction.

| Path | Blob | Lines | c / i / m / f / sc |
|---|---|---|---|---|
| `notes/prompts/knowledge/coverage/_internal/_coverage-prompt-rationale.md` | `3db536a5763e8ae900801d2c3e2313157731c43d` | 308 | 3 / 0 / 0 / 1 / 0 |
| `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md` | `2342f6a1ce2fbd19ca0d3791ce91fc68eb748413` | 427 | 4 / 0 / 0 / 1 / 0 |
| `notes/prompts/knowledge/coverage/_internal/_topic-ownership.md` | `4fde7a60fde1965bfdd2c46abaab6885fd6ec764` | 88 | 3 / 0 / 0 / 0 / 0 |
| `notes/prompts/knowledge/coverage/coverage-audit-prompt.md` | `d0e260befc4aa3a7d80c9a0f20b8fdeea0159206` | 206 | 19 / 1 / 2 / 3 / 1 |
| `notes/prompts/knowledge/coverage/coverage-prompt.md` | `ce2cc5dad19537aebbd4c560990f46a510aa68af` | 416 | 22 / 0 / 6 / 2 / 0 |
| `notes/prompts/knowledge/coverage/coverage-verify-prompt.md` | `02ac6d1680575ea9b1a71cd484c7f38e01ae90e0` | 278 | 17 / 1 / 4 / 1 / 0 |
| `notes/prompts/knowledge/coverage/evidence-intake-prompt.md` | `4334b3ec388eed8b1201823d6c135c25ed653083` | 178 | 19 / 0 / 0 / 4 / 0 |
| `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-review-prompt.md` | `90beb374ed2932e3dccb6ca3923f7eaa18533af1` | 204 | 5 / 0 / 0 / 1 / 0 |
| `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-standard.md` | `3586736e5642dcbc39be261592f562c65effe5cc` | 586 | 8 / 0 / 0 / 1 / 0 |
| `notes/prompts/knowledge/interview-prep/_internal/_interview-prep-write-prompt.md` | `cf3b53454696357759da6daeb5794db0435ca6f8` | 279 | 4 / 0 / 0 / 2 / 0 |
| `notes/prompts/knowledge/interview-prep/interview-prep-audit.md` | `a0865c7eb10b4cbfa1482e208a3ec90708949dbc` | 611 | 17 / 1 / 4 / 2 / 1 |
| `notes/prompts/knowledge/interview-prep/interview-prep-route-projects-prompt.md` | `5605efdfb4b6d05b09d2cc61300cf3b7f6c9cffb` | 208 | 20 / 1 / 3 / 1 / 0 |
| `notes/prompts/knowledge/interview-prep/interview-prep-route-prompt.md` | `6f33cc715ab993b2722672d5e0177354d62c1dd3` | 144 | 17 / 0 / 1 / 1 / 0 |
| `notes/prompts/knowledge/notes/_internal/_note-quality-standard.md` | `d1df09e88a66d63269b04e37349aa817788dee43` | 1249 | 8 / 0 / 0 / 0 / 1 |
| `notes/prompts/knowledge/notes/_internal/_notes-review-es-prompt.md` | `22032e7b370d9ac227caf3acc172a24c3f1f0702` | 233 | 28 / 0 / 0 / 3 / 0 |
| `notes/prompts/knowledge/notes/_internal/_notes-review-prompt.md` | `9b6ed18e2c7a5876ee86a8074d7ee0434cd68b27` | 225 | 20 / 0 / 3 / 1 / 0 |
| `notes/prompts/knowledge/notes/_internal/_notes-translate-prompt.md` | `22ebcc23c860343bc6cdfc8cbc2dfec874173bf2` | 170 | 25 / 0 / 1 / 1 / 0 ¹ |
| `notes/prompts/knowledge/notes/_internal/_notes-write-prompt.md` | `086050f735808ad28bf8ea90789582245f415809` | 445 | 4 / 0 / 0 / 1 / 0 |
| `notes/prompts/knowledge/notes/notes-audit.md` | `c851a4e93e04184e7dc36e3ddf546200921865be` | 484 | 24 / 1 / 3 / 2 / 0 |
| `notes/prompts/knowledge/notes/notes-plan-prompt.md` | `b66d6ce8efa2fa39494a2bf4520b8545d3a263da` | 579 | 19 / 4 / 1 / 3 / 0 ² |
| `.claude/skills/authoring-progress-recount/SKILL.md` (+ `.agents/` mirror, same blob) | `b03d570896b8e5c0199e80997990fc15b0bdde2a` | 171 | 13 / 0 / 2 / 0 / 0 |
| `.claude/skills/coverage-bullet-add/SKILL.md` (+ mirror) | `ba742943889238ad4ac40cef6ac798a19e973da5` | 299 | 13 / 0 / 0 / 0 / 0 |
| `.claude/skills/coverage-mark/SKILL.md` (+ mirror) | `c773612615457c9fa9c7463993b7f905eb95b942` | 398 | 16 / 0 / 1 / 0 / 0 |
| `.claude/skills/interview-prep-block-open/SKILL.md` (+ mirror) | `6257f0eb3c7bcdae5d9fe09c7dd1635f07844a05` | 120 | 11 / 0 / 3 / 2 / 0 |
| `.claude/skills/study-block-close/SKILL.md` (+ mirror) | `5ad9c002b2354ae4bd58b5f152a61d26f6001560` | 172 | 12 / 0 / 7 / 0 / 0 |
| `.claude/skills/study-content-writer/SKILL.md` (+ mirror) | `1d0b8324142033eafde2421f43b049cdaba8e329` | 347 | 12 / 0 / 0 / 2 / 0 |
| launchers (9 pairs, 18 files — blobs below) | — | 10–22 each | 50 / 9 / 0 / 0 / 0 |

¹ After the final review: the return's `incorrect` on README L591 ("the plan's `Spanish:` column") is not a positive contradiction — `LINK_TARGETS` carries the plan entries' `Spanish:` paths and `notes-audit.md` L342-344 states the cell's wording — so it counts `correct` and its edit (R8a) was dropped.
² Includes the one `missing` row struck at Step 3 (§4); it never reached the patch.

Launcher blobs (`.claude` · `.codex`): coverage `6787312a…` · `08f9443e…`; coverage-verify `32073a41…` ·
`553bbe45…`; coverage-audit `1e8d737e…` · `c1d96721…`; evidence-intake `16d27171…` · `a65dd116…`;
notes-plan `b2f1d833…` · `23d6edee…`; notes-audit `5310ac09…` · `ce6795c0…`; interview-prep-audit
`dfdf0c92…` · `a7f1f6f3…`; interview-prep-route `6b555b3e…` · `a7c1aba8…`; interview-prep-route-projects
`f9985eb8…` · `18f27a71…` (full ids in `snapshot.tsv` of the run checkpoint).

## 2. Validator

Baseline (`-MachineryOnly`, before Step 1): every check `PASS`; one `REPORT` (a ledger-proposed path
a path one closed ledger line proposes that does not exist — a proposal, not a typo); `SKIP` live coverage/plan/route
state by design. Final (`-MachineryOnly`, after the approved patch and the ledger rows): every check `PASS`, the same one `REPORT` and the same `SKIP`; 48 distinct open ledger IDs compared.

## 3. Map corrections applied

44 edits (SM = `_system-map.md`, R = `README.md`): the 45 proposed by the accepted concerns, in the form the
cold final reviewer approved — ten tightened (SM7, SM9, SM11, SM15a, SM16, SM18, R1, R2, R6b, R9a), R3a
extended to the identical claim in README L582 (R3c), R5c struck (§4) and R8a dropped (§1 note ¹). The
`was` / `now` cells are the exact replaced strings.

| # | map | row | was | now | source line |
|---|---|---|---|---|---|
| SM1 | _system-map.md | coverage-prompt §7 verify Written by | \| `notes/{topic}/coverage/verify-{LEVEL}.md` \| `/coverage-verify` \|  | \| `notes/{topic}/coverage/verify-{LEVEL}.md` \| `/coverage-verify` · `/coverage` (update mode only: blanks the consumed `## Open gaps`, sets `Verdict: superseded` and adds `Superseded by Coverage SHA-256`; never edits a sibling `verify-*.md`) \|  | coverage-prompt.md L346-348, L76 |
| SM2 | _system-map.md | coverage-audit+coverage-verify+study-block-close §7 notes-plan Read by | `/notes-audit` (fingerprint gate), `/coverage`, `/interview-prep-audit`, `authoring-progress-recount` (the authored count), | `/notes-audit` (fingerprint gate), `/coverage`, `/coverage-verify` (to identify locked bullets, read-only), `/coverage-audit` (every existing plan, to extract the exact locked `[x]` bullets of `Status: refined` entries), `/interview-prep-audit`, `authoring-progress-recount` (the authored count), `study-block-close` (entries' `Status`/`Studied`/`Pending study`, and the denominator of its Notes row), | coverage-audit-prompt.md L38; coverage-verify-prompt.md L49-50, L70; study-block-close/SKILL.md L47 |
| SM3 | _system-map.md | notes-plan §7 notes Written by | for a same-level renumber or a cross-level relocation only: it renames the pair and corrects | for a same-level renumber or a cross-level relocation only: it renames the pair (a legacy English-only note, its English file alone) and corrects | notes-plan-prompt.md L160-163 |
| SM4 | _system-map.md | notes-audit §7 notes Read by | \| Victor · `/notes-plan`, which reads the prose of the notes no plan entry owns | \| Victor · `/notes-audit` and its four stages (the entry's own file and the `complete`/`refined` entries' prose the plan declares as `READABLE_SIBLINGS` — a `pending` sibling is link-target-only) · `/notes-plan`, which reads the prose of the notes no plan entry owns | notes-audit.md L127-128 |
| SM5 | _system-map.md | study-block-close §7 levelled Q&A Read by | `authoring-progress-recount` (the refined count), `/progress-update` · `/portfolio-audit`'s translator | `authoring-progress-recount` (the refined count), `study-block-close` (resolves the pair, parity and fingerprints; counts the bank and CORE rows), `/progress-update` · `/portfolio-audit`'s translator | study-block-close/SKILL.md L77 |
| SM6a | _system-map.md | study-block-close §7 project en Read by | `authoring-progress-recount` for its per-project refined row and `/progress-update` measuring both project rows as D9/D10 \| | `authoring-progress-recount` for its per-project refined row and `/progress-update` measuring both project rows as D9/D10 · `study-block-close` (resolves the exact question and checks pair parity before marking, and counts the per-project numerator) \| | study-block-close/SKILL.md L77-78 |
| SM6b | _system-map.md | study-block-close §7 project es Read by | `authoring-progress-recount` and `/progress-update`, which require both languages before either project row is counted (all since 2026-09-06). | `authoring-progress-recount` and `/progress-update`, which require both languages before either project row is counted (all since 2026-09-06) · `study-block-close` (pair parity before marking; per-project numerator). | study-block-close/SKILL.md L77-78 |
| SM7 | _system-map.md | coverage-prompt §7 PROGRESS Read by | `/progress-update` (the auditor — it reads every section to measure it), | `/progress-update` (the auditor — it reads every section to measure it), `/coverage` (its topic/level `Coverage demonstrated` cells and the level's `**Total**`, which it rewrites from D8's greps — never by adjusting the printed value), | coverage-prompt.md L361-366 |
| SM8 | _system-map.md | route-projects §7 PLANNING Read by | `/readme-audit`, `/review-audit`, `/portfolio-audit`, `/progress-update`, `/roadmap-review`, every session \| | `/readme-audit`, `/review-audit`, `/portfolio-audit`, `/progress-update`, `/roadmap-review`, `/interview-prep-route-projects` (§23 G7 box, for eligibility), every session \| | interview-prep-route-projects-prompt.md L42 |
| SM9 | _system-map.md | coverage-verify §7 inbox Written by | `/coverage-verify` (a gap rejected on ownership alone; separate commit) | `/coverage-verify` (an ownership referral or finding the registry supports as owned elsewhere — only when ownership is the sole reason; separate commit) | coverage-verify-prompt.md L171-178 |
| SM10 | _system-map.md | coverage-verify §7 job-market Read by | \| `/coverage`, `/coverage-audit`, `/interview-prep-audit`, `/interview-prep-route` \| | \| `/coverage`, `/coverage-verify`, `/coverage-audit`, `/interview-prep-audit`, `/interview-prep-route` \| | coverage-verify-prompt.md L61 |
| SM11 | _system-map.md | interview-prep-audit §3 chain edge |          └───────────────────────┴→ /notes-plan → /notes-audit → bilingual notes ⏎          └→ /interview-prep-audit → /interview-prep-route ⏎  |          └───────────────────────┴→ /notes-plan → /notes-audit → bilingual notes ⏎          └→ /interview-prep-audit → /interview-prep-route   (also needs a current /notes-plan; MODE = index needs neither) ⏎  | interview-prep-audit.md L25-27, L31 |
| SM12 | _system-map.md | coverage-mark §9 Primary reads | `progress-update-prompt.md` D8 for the table's counting rule, `PROGRESS.md` coverage totals \| | `progress-update-prompt.md` D8 for the table's counting rule, `PROGRESS.md` coverage totals, the topic's selected Coverage tracker cell (scaffolding stop, §2) \| | coverage-mark/SKILL.md L94 |
| SM13a | _system-map.md | authoring-progress-recount §9 trigger/input | or Victor asking directly; receives **a level or a project**, never both \| | or Victor asking directly; receives **a level or a project**, never both; a calling `portfolio-audit` also hands it the eligibility verdict it just computed, which settles that project's eligibility \| | authoring-progress-recount/SKILL.md L118 |
| SM13b | _system-map.md | authoring-progress-recount §9 commit owner | \| agent commits `PROGRESS.md`; the caller commits the prose and plan that caused the transition \| | \| agent commits `PROGRESS.md` (staging it alone) — unless the caller is already committing `PROGRESS.md` for the same change, when the caller's commit carries the rows; the caller commits the prose and plan that caused the transition \| | authoring-progress-recount/SKILL.md L158-159 |
| SM14a | _system-map.md | interview-prep-block-open §9 trigger/input | \| `interview-prep-block-open` \| Victor starts/continues active recall; one answer at a time \| | \| `interview-prep-block-open` \| Victor starts/continues active recall; one answer at a time; input: the level from his message, else `PROGRESS.md`'s active professional level, and the project route only when he asks for it \| | interview-prep-block-open/SKILL.md L22-23, L26-27 |
| SM14b | _system-map.md | interview-prep-block-open §9 Primary reads | the bilingual bank pair, `PROGRESS.md` study orientation \| | the bilingual bank pair, the route prompts' fingerprint algorithm (`interview-prep-route-projects-prompt.md` named for the project route) it applies to test freshness, `PROGRESS.md` study orientation \| | interview-prep-block-open/SKILL.md L35, L49 |
| SM14c | _system-map.md | interview-prep-block-open §9 Writes/returns | \| read-only orientation + PASS/BORDERLINE/FAIL return \| | \| read-only orientation + PASS/BORDERLINE/FAIL return, plus a reopen proposal when the frozen answer looks wrong and the unrefined-entry refinement-debt count \| | interview-prep-block-open/SKILL.md L73, L108 |
| SM15a | _system-map.md | study-block-close §9 Primary reads | both routes, `_portfolio-standard.md`'s identity section for a project pair, `PROGRESS.md` \| | both routes, `_interview-prep-standard.md` (levelled fingerprint gate; "Study index and question anchors" for ID resolution), `_portfolio-standard.md`'s identity section for a project pair, `interview-prep-route-projects-prompt.md` (its "Eligibility" ladder for the project list and its inventory-digest algorithm), `PROGRESS.md` \| | study-block-close/SKILL.md L72-73, L82, L86, L129-130 |
| SM15b | _system-map.md | study-block-close §9 Writes/returns | **plus the per-project studied table** (denominator = that project's route questions) \| | **plus the per-project studied table** (denominator = that project's route questions) · returns a report listing every still-open `Pending study` entry with the sections it owes and every `[studied]` project question the route no longer carries \| | study-block-close/SKILL.md L166, L170 |
| SM16 | _system-map.md | coverage-prompt §10 notes-plan debt |   plan's cell in `_run-tracker.md`, so the debt outlives the session. Only a real `/notes-plan` run ⏎   clears it. Batch these at the end of the session. ⏎  |   plan's cell in `_run-tracker.md`, so the debt outlives the session. Only a real `/notes-plan` run ⏎   clears it. Batch these at the end of the session. An update-mode `/coverage` run leaves the same debt: it sets ⏎   `Plan status: stale` on every notes plan whose fingerprint mismatched and accumulates `+N` on that ⏎   plan's `Plan` cell in `_run-tracker.md`; only a real `/notes-plan` run clears it. ⏎  | coverage-prompt.md L333-336, L344, L356, L379-380 |
| SM17 | _system-map.md | notes-plan §10 refined lock | Setting it freezes that entry's prose in both languages *and* its ⏎   assigned coverage bullets — no prompt may reword, move or delete them. | Setting it freezes that entry's prose in both languages *and* its ⏎   incorporated (`[x]`) coverage bullets — no prompt may reword, move or delete them (a `Pending additions` bullet is not locked until incorporated). | notes-plan-prompt.md L534-537 |
| SM18 | _system-map.md | interview-prep-audit §10 restore/leave | question bank — the run disposes of that section (restore its span from the run's baseline when one ⏎   exists, else leave and declare it), | question bank — the run disposes of that section (restore its span from the run's baseline when one exists, else leave and declare it — for `interview-prep-audit`, restore only when the author blocked, the section existed under that heading at the baseline and the pair was clean there; every other case, a reviewer that blocked included, leaves it and declares it), | interview-prep-audit.md L387-389, L393-394 |
| SM19 | _system-map.md | interview-prep-route + interview-prep-audit §11 rows | \| `/coverage-verify` returned `gaps` \| `/coverage {topic} {level}` in update mode \| ⏎  | \| `/coverage-verify` returned `gaps` \| `/coverage {topic} {level}` in update mode \| ⏎ \| a topic's interview-prep bank is stale against its coverage, or a run left it `blocked` \| `/interview-prep-audit` with that `LEVEL` and `FILE`, `MODE = full` (a missing or mismatched `Coverage SHA-256` continues only in full) \| ⏎ \| a bank's question was added, removed, reworded, reprioritised or reordered → the level's CORE route no longer matches its inventory \| `/interview-prep-route` with that `LEVEL` \| ⏎  | interview-prep-audit.md L172 (+L502); interview-prep-route-prompt.md L65-67 |
| R1 | README.md | coverage-prompt interface Runtime | \| `/coverage` → `coverage-prompt` \| `TOPIC`, `LEVEL`, optional `NOTES_PATH`, `MODE=update\\|dry-run` \| O · agent \| | \| `/coverage` → `coverage-prompt` \| `TOPIC`, `LEVEL`, optional `NOTES_PATH`, `MODE=update\\|dry-run` \| O, one cold market analyst + two cold reviewers (the verify-gap fast path: one scoped reviewer, no analyst) + a cold first-run boundary reviewer when `FIRST_RUN` · agent \| | coverage-prompt.md L105, L107, L253, L281-283 |
| R2 | README.md | coverage-prompt catalogue Reads | `_cross-topic-inbox.md`, applicable `verify-*.md` files, previous self-report \| | `_cross-topic-inbox.md`, applicable `verify-*.md` files, previous self-report, `PROGRESS.md` `Coverage demonstrated` table and `progress-update-prompt.md` step D8 (counting rule), to recount the affected cells; for Spring Boot, the Java coverage headings and `notes/spring-boot/layer-reference.md` \| | coverage-prompt.md L361-365, L86 |
| R3a | README.md | coverage-verify catalogue What it does | Like `coverage-prompt` it locks every bullet a `Status: refined` notes-plan entry carries: | Like `coverage-prompt` it locks every `[x]` bullet a `Status: refined` notes-plan entry carries: | coverage-verify-prompt.md L50-52 |
| R3c | README.md | coverage-prompt catalogue What it does (R3a occurrence) | locks every bullet assigned to a `Status: refined` entry; planned, `pending`, and `complete` entries remain remappable | locks every `[x]` bullet assigned to a `Status: refined` entry; planned, `pending`, and `complete` entries — and a refined entry's `[ ]` pending additions — remain remappable | coverage-prompt.md L39-41, L203-205 |
| R3b | README.md | coverage-verify catalogue Generates | one `_cross-topic-inbox.md` proposal per gap it rejects on ownership alone — committed separately — | one `_cross-topic-inbox.md` proposal per ownership referral or finding the registry supports as owned elsewhere (ownership the sole reason) — committed separately — | coverage-verify-prompt.md L171-178 |
| R4a | README.md | coverage-audit catalogue Reads mirrors | `_shared-context.md`, all three global mirrors and topic level files, every notes plan, | `_shared-context.md`, the selected global mirror (`notes/coverage/{LEVEL}.md`) and every topic's three level files, every notes plan, | coverage-audit-prompt.md L36-37 |
| R4b | README.md | coverage-audit catalogue Reads D8 | `_run-tracker.md` (its Step 0 gate: every topic needs a completed run at this level) \| | `_run-tracker.md` (its Step 0 gate: every topic needs a completed run at this level), `progress-update-prompt.md` step D8 (the `Coverage demonstrated` table's format and counting rule) \| | coverage-audit-prompt.md L172 |
| R5a | README.md | notes-plan verify bullet | stale verdict is recorded in the plan and its report, but never stops the run) | stale verdict is reported in its final summary and never stops the run) | notes-plan-prompt.md L72-74 |
| R5b | README.md | notes-plan Auditing knowledge step 2 | can run `notes-plan-prompt` without it, and the plan records that the coverage was unverified | can run `notes-plan-prompt` without it, and the run reports the verdict it read (or that none exists) in its final summary | notes-plan-prompt.md L72-74, L569-570 |
| R6a | README.md | notes-audit universal paragraph | Orchestrators record target-level state; `notes-audit` additionally records every planned EN/ES pair, | Orchestrators record target-level state; `notes-audit` rewrites the level's Notes J/M/S summary cell, naming the `TOPIC + LEVEL + NOTE` it ran on, and keeps no per-note row, | notes-audit.md L476-479 |
| R6b | README.md | notes-audit catalogue Reads | `REC-314`, `REC-315`), and its internal stages; retains | `REC-314`, `REC-315`), its previous `_internal/_last-run-report.md` (the run-start decision table), and its internal stages; retains | notes-audit.md L53-54 |
| R6c | README.md | notes-audit catalogue Generates | for every TODO marker it reports and may not resolve \| | for every TODO marker it reports and may not resolve; through the `authoring-progress-recount` skill it invokes after the content attempt, the `## Authoring progress` rows of `PROGRESS.md` (the skill commits them, not this run) \| | notes-audit.md L465-468 |
| R7a | README.md | notes-review What it does dispatcher | Never opens the counterpart `es/`, never commits. \| `_note-quality-standard.md`, the one `en/` file, | Never opens the counterpart `es/`, never commits. Dispatched by `notes-audit` as subagent B, or run standalone on a single `en/` file. \| `_note-quality-standard.md`, the one `en/` file, | _notes-review-prompt.md L20 |
| R7b | README.md | notes-review Reads TASK/SCOPE | the authority every same-topic link and every claim about what a target teaches is checked against) \| the audited `en/*.md`; | the authority every same-topic link and every claim about what a target teaches is checked against), `TASK` (the complete selected persistent-plan entry, treated as the acceptance contract), `SCOPE` (`full`, or `append-only` with the appended headings listed) \| the audited `en/*.md`; | _notes-review-prompt.md L126, L61 |
| R8b | README.md | notes-translate Reads cross-topic | reporting a mismatch rather than re-aiming a sentence the `en/` owns \| that one `es/*.md` \| | reporting a mismatch rather than re-aiming a sentence the `en/` owns; for a cross-topic link, that topic's own `notes-plan-{LEVEL}.md` (its `es/` listing only where no plan exists); the `notes/{TOPIC}/{LEVEL}/es/` listing only as a cross-check \| that one `es/*.md` \| | _notes-translate-prompt.md L119-123 |
| R9a | README.md | interview-prep-audit interface run-first | the anchors and the study index (`REC-340`); never edits a refined block \| | the anchors and the study index (`REC-340`); a middle or senior run — not `MODE = index`, which needs no gate — first needs the earlier-level progression gate closed (junior notes, questions and practical recall for middle; junior and middle for senior); never edits a refined block \| | interview-prep-audit.md L124, L242-243 |
| R9b | README.md | interview-prep-audit catalogue Reads | \| its internal pieces, selected topic coverage + current notes plan (not on `MODE = index`), `_job-market-evidence.md`, selected-level interview-prep en/es \| | \| its internal pieces, selected topic coverage + current notes plan (not on `MODE = index`; on `angular` also the Angular Material coverage and plan), `_coverage-standard.md` (the canonical digest command), `_job-market-evidence.md`, `ROADMAP.md`, selected-level interview-prep en/es \| | interview-prep-audit.md L29-30, L165-167, L294 |
| R10a | README.md | route-projects interface run-first | \| after `portfolio-audit` on each project it carries; | \| after `portfolio-audit … PORTFOLIO_SCOPE = full` on each project it carries; | interview-prep-route-projects-prompt.md L10-11, L62-63 |
| R10b | README.md | route-projects catalogue Reads | `_portfolio-standard.md`, `_run-tracker.md`, `_shared-context.md` \| `notes/interview-prep/routes/projects.md` \| | `_portfolio-standard.md`, `_run-tracker.md`, `_shared-context.md`, the existing `notes/interview-prep/routes/projects.md` (the previous run's route, to list dropped `[studied]` questions) \| `notes/interview-prep/routes/projects.md` \| | interview-prep-route-projects-prompt.md L46-49 |
| R10c | README.md | route-projects feed bullet EN bank | by `interview-prep-route-projects` (every EN bank, to ⏎   EOF) | by `interview-prep-route-projects` (every eligible project's EN bank, to ⏎   EOF) | interview-prep-route-projects-prompt.md L45, L86 |

Occurrences named by a concern and deliberately **not** patched (outside every returning concern's licence
and not a positive contradiction it proved): `README.md` L579 (`_cross-topic-inbox.md` catalogue row,
"`coverage-verify` (a gap rejected on ownership alone)") — same claim as SM9/R3b, named by the
coverage-verify concern; `README.md` L698-701 (the `verify-{LEVEL}.md` feed bullet names only
`coverage-verify` as writer) — named by the coverage-prompt concern as hub prose outside its licence; `README.md` L704-706 (the
`_job-market-evidence.md` feed bullet omits `/coverage-verify` and `/interview-prep-route` as readers —
SM10's claim, an absence in a `chains` bullet); `_system-map.md` §2 L114 (`└──► /interview-prep-audit` under
`/coverage` alone — SM11's claim, §2 is the `chains` cluster's); and the §7 `notes-plan-{LEVEL}.md` Read-by
cell, which has no entry for stage T's cross-topic plan read that R8b adds to README (outside the component
licence). Each is owed to a `cross` run or a concern licensed for it.

## 4. Rows ruled correct, and struck rows

Correct rows, per concern, are the first number in §1's table: 413 in total across 27 concerns (after note ¹). No
section is reported as "verified" as a whole. **Struck rows: one.** Concern `notes-plan-prompt.md` (licence `prompt`) ruled `missing` on README
"Auditing knowledge" step 3 (L924). That line is in "## Typical run order", which `system-check-prompt.md` →
"The flows" gives to the `cross` `chains` cluster; the prompt licence reaches "How the prompts feed each
other" only. Step 3 should have struck it; the cold final reviewer caught it and it was kept out of the
patch (breach recorded in `_breach-log-system-check.md`). The fact it names (the L77-78 progression gate) is
true and owed to a `cross` run. Three returns used `fenced` for a non-owed absence outside the four
fence sites (`_coverage-prompt-rationale.md` §7, `_notes-write-prompt.md` `SOURCE_REPAIRS`,
`_notes-review-es-prompt.md` §7 notes-plan writer): each carries no proposed wording, so nothing reached
the patch.

## 5. Findings and ledger IDs

- `REC-349` — source-contradiction: `coverage-audit-prompt.md` L180 vs L184, and (reviewer-widened) `coverage-prompt.md` L372 vs L384 — "For step 4" points the close-out at the staging step.
- `REC-350` — source-contradiction: `interview-prep-audit.md` L194 ("`MODE = index` skips this whole block — the fingerprint comparison is reported") vs L165-169 and L189-190 inside that block.
- `REC-351` — source-contradiction: `_note-quality-standard.md` L34-35 (structured mode for `notes/java/junior/en/`) vs L578-582 (Java never used it). Distinct from open `REC-346`.
- `REC-352` — launcher defects: four knowledge pairs restate prompt-owned rules (`coverage-verify`, `coverage-audit`, `evidence-intake`, `interview-prep-audit`) and `.codex/commands/coverage-audit.md` L13 names a step the prompt lacks. Narrowed by the reviewer (the `.codex` coverage-verify level-scope line and the route pair's "orchestrator" wording dropped) and extended (the stale inbox clause in both `coverage-verify` launchers). Sibling of open `REC-344`.
- `REC-353` — reviewer-surfaced, orchestrator-verified: `/coverage-audit` may move a bullet across levels (L84, L168) but rebuilds only the selected mirror (L136-140), the state `coverage-prompt.md` L309-310 forbids.

Every `source-contradiction` an accepted concern proved carries one ID above (three concerns, three rows). Deduplicated against both ledger files: no open or closed row held any of them.

## 6. Final review

`approve-with-tightening` — one cold `reviewer`, tier `deep`, over the draft report, the draft patch, all 27
accepted returns and `snapshot.tsv`. It approved 31 edits as proposed, tightened ten, added R3c, struck R5c,
dropped R8a, confirmed SM2's three readers additive, found no rule fork, named the occurrences now listed in
§3, ruled REC-349…352 recordable (widening 349, narrowing and extending 352) and surfaced REC-353. Checks 5-6
passed: 27 of 27 concerns, all 52 snapshot blobs unchanged at review time, no live artifact in the record.

## 7. Run notes

Two earlier attempts at this flow are on record: 2026-10-15 (`7c60e840`, blocked at a second failed
`_notes-review-prompt.md` return) and 2026-10-16 (`b2ac5e19`, blocked at a second failed
`_note-quality-standard.md` return). This run admitted all 27 concerns on their first return.
