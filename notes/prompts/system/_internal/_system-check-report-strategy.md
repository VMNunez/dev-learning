# System-check report — strategy

Date: 2026-10-15 · Flow: strategy · Starting commit: 527a686a · Branch: projects/07-timetrack
Status: complete

## 1. Audited paths

Prompt `notes/prompts/system/system-check-prompt.md` blob `31ff7f33ebadeb25a35ca588fee32ea08a5e4736` ·
mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob
`397e27d6a1e60ee152f66a33db56346431b51652`.

Dispositions: correct / incorrect / missing / fenced / source-contradiction, after the final review.

| Path | Blob id | Lines | c / i / m / f / sc |
|---|---|---|---|
| notes/prompts/strategy/tracking/progress-update-prompt.md | cb1c7c8406e70fbd07bbab6689b7ee9049bdb302 | 604 | 33 / 0 / 3 / 0 / 0 |
| notes/prompts/strategy/tracking/roadmap-review-prompt.md | 417ccd7426f4a49798a8729578d920982d921b1c | 519 | 27 / 1 / 5 / 1 / 0 |
| notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md | bbd25bd4803609254db45020879987804d741d41 | 166 | 5 / 0 / 0 / 1 / 0 |
| notes/prompts/strategy/tracking/_internal/_roadmap-standard.md | 96160d4558c0a76beeb6511ce6c7f4b1fa28dbb4 | 206 | 6 / 0 / 0 / 0 / 0 |
| notes/prompts/strategy/apply/cv-prompt.md | 00ca621406f1b35b6fa072cac28e02b345c2cf9a | 357 | 14 / 0 / 1 / 3 / 0 |
| notes/prompts/strategy/apply/linkedin-prompt.md | 76e7cb7e50400b2743242ca0cd0515a191058888 | 299 | 8 / 2 / 1 / 2 / 0 |
| notes/prompts/strategy/apply/cover-letter-prompt.md | af69008e4424f9154bb9b45b3c2712cad1a036c6 | 140 | 13 / 0 / 0 / 1 / 0 |
| notes/prompts/strategy/apply/profile-readme-prompt.md | 13d0b9c652d62cff6959bc82bd15ba6cfcc9b301 | 111 | 14 / 0 / 1 / 2 / 0 |
| notes/prompts/strategy/apply/tracker-prompt.md | 2981598a82961086700914845071feb35ea1f015 | 216 | 10 / 0 / 0 / 2 / 0 |
| notes/prompts/strategy/apply/_internal/_application-standard.md | 0b6ecdb1365d9722e5ca49e2757e3c2ef68a3390 | 303 | 9 / 0 / 0 / 1 / 0 |
| .claude/commands/cover-letter.md | 987bb4bcb540f87a25d4b14ecdacc084fee3f23c | 12 | launchers concern |
| .claude/commands/cv.md | 4c110c2e6930f3154377dc4a117b0cfcaec01690 | 15 | launchers concern |
| .claude/commands/linkedin.md | 5b9506d1b152039c216b21a95e00a6bc88e32de2 | 12 | launchers concern |
| .claude/commands/profile-readme.md | 4d3dca06e270f126f61da1b7cb95e2019bb95b33 | 12 | launchers concern |
| .claude/commands/progress-update.md | 79acd8ff6f059117fa3a7d7b131bf0943d1c5875 | 13 | launchers concern |
| .claude/commands/roadmap-review.md | db55c91d9242c97797b5c16aa24fcbaa0253382d | 11 | launchers concern |
| .claude/commands/tracker.md | ad70463ba63c285a734d9ff1d0ccf30ca0198387 | 13 | launchers concern |
| .codex/commands/cover-letter.md | 8a94bc77da4678bfc86470c1bbbe651da0b7f584 | 14 | launchers concern |
| .codex/commands/cv.md | 26ac40876cd25e9276f549445f7431b28129a160 | 17 | launchers concern |
| .codex/commands/linkedin.md | ac27a1781e541d896c6b717b9c999878f0a819ec | 14 | launchers concern |
| .codex/commands/profile-readme.md | a7eaddbb937a951099c8e6a7a1c8558d04cc2e98 | 14 | launchers concern |
| .codex/commands/progress-update.md | c9c662ccc0d061a7e9fb567da5ef37d439cbf9aa | 15 | launchers concern |
| .codex/commands/roadmap-review.md | 5c6657416512ccd131de6485c6927a5e57d3b80f | 13 | launchers concern |
| .codex/commands/tracker.md | 7c685214e63872b1e118de4022064340b1161380 | 15 | launchers concern |

Launchers concern (7 pairs, 42 rows): 38 / 4 / 0 / 0 / 0 after review — the analyst's 10 `incorrect`
rows on the launchers' own `Rules` blocks were cut to 4 by the reviewer (`progress-update` restates
`_session-rules.md`-owned facts; `roadmap-review` describes its pipeline). The 4 left are not map
corrections: they are `REC-344`.

Path set: 24 paths. Outside the inventory by the enumeration rule:
`strategy/apply/_internal/_application-evidence.md` (evidence, the class of `_job-market-evidence.md`),
plus the family's reports, breach logs and `_last-drift-report.md` (run-written class).

## 2. Validator

Baseline (`-MachineryOnly`, before Step 2): exit 0 — all PASS; one `REPORT:` (one path a closed ledger line proposes);
one `SKIP` (live state). Final (`-MachineryOnly`, after the patch and the
two ledger rows): exit 0 — the same PASS set, the same `REPORT:`, the same `SKIP`; the ledger-ID check
compared 42 distinct open rows.

## 3. Map corrections applied

| Map · row or line | Was | Now | Source line |
|---|---|---|---|
| `_system-map.md` §7 `notes/cv/cv-bullets.md` · Read by | "(Step 6 · `PROJECT BULLETS NEEDING A RE-RUN`)" for both `/cv` and `/linkedin` | "(`/cv` Step 6, `/linkedin` Step 4 and its final output · …)" | linkedin-prompt.md l.126-131, l.179 (`## Step 6 — Open to work settings`), l.249-257 |
| `_system-map.md` §7 `ROADMAP.md` · Read by | "…no longer appear here ·" | adds "— with one exception the source still carries: `/linkedin`'s prompt reads it for the career target as well as its LinkedIn checklist" | linkedin-prompt.md l.32-33 |
| `_system-map.md` §7 `dev/portfolio/VMNunez/README.md` · Written by | no writer named for the adapter gap list | `/profile-readme` as its one writer (every `optimize`; `sync` conditionally), committed there; `/portfolio-audit` writes the README alone | profile-readme-prompt.md l.61, l.79-80, l.86, l.96-98; `_session-rules.md` l.16 |
| `_system-map.md` §7 `PROGRESS.md` · Read by | `/progress-update` absent | adds `/progress-update` (the auditor — it reads every section to measure it) | progress-update-prompt.md l.73-74, l.113-119 |
| `_system-map.md` §7 `_run-tracker.md` · Read by | "you and prompts that gate on it" | adds `/progress-update` (D8/D10 `*` denominators) | progress-update-prompt.md l.399-402, l.444-448 |
| `_system-map.md` §7 `validate-prompt-system.ps1` · Read by | "full mode by hand" | adds "and by `/roadmap-review`'s fact-gatherer 2a with no switches, as its mirror-parity proof" | roadmap-review-prompt.md l.165-169 |
| `README.md` Strategy catalogue `linkedin-prompt` · Generates | "(headline, about, experience, projects, skills, 3 posts)" | adds the `PROJECTS FEATURED` count line, the never-dropped `SKILLS LEFT OUT` line, open-to-work settings | linkedin-prompt.md l.179 ff., l.209-257, l.289 |
| `README.md` Strategy catalogue `cv-prompt` · Generates | "`tailor` also appends the posting to …" | "records the posting … by running `evidence-intake`'s Steps 2–4 as written (that prompt's row owns what they write)" | cv-prompt.md l.331-336 |
| `README.md` Strategy catalogue `progress-update-prompt` · Reads | levelled CORE routes absent | adds `notes/interview-prep/routes/{LEVEL}.md` (D9) | progress-update-prompt.md l.124-126, l.415-418 |
| `README.md` Strategy catalogue `roadmap-review-prompt` · Reads | validator absent | adds `validate-prompt-system.ps1` in full mode (2a's parity proof) | roadmap-review-prompt.md l.165-169 |

**Occurrences not updated, named for the `catalogue` cluster:** `README.md` "The five hub files"
`PROGRESS.md` `Read by` cell and "How the prompts feed each other" → `PROGRESS.md` reader list — neither
names `/progress-update` as a reader; both are whole-population lists outside a file licence.

**Held out after review:** the `roadmap-review-prompt` catalogue `What it does` cross-file reviewer list
(an absence outside the prompt licence — `catalogue`'s; the only wording its source supports is
"no duplication of `PROGRESS.md`, `notes/coverage/junior.md` or `_shared-context.md`"); "Typical run
order" step 10, §3 Chain A and the §11 coverage-audit row gaining a clean `/progress-update` (run order is
`chains`'; a README-owned run-first restated would fork); the `/linkedin` and `/cover-letter` index
`output only` cells (README l.428-433 scope the universal report out of every row).

## 4. Rows ruled `correct`, per file

progress-update-prompt 33 · roadmap-review-prompt 27 · _concept-extraction-standard 5 ·
_roadmap-standard 6 · cv-prompt 14 · linkedin-prompt 8 · cover-letter-prompt 13 · profile-readme-prompt 14
· tracker-prompt 10 · _application-standard 9 · launchers 38.

## 5. Findings

- `REC-344` — the `/linkedin` and `/cover-letter` launcher pairs restate a prompt-owned output rule
  ("nothing is written to the repo") that each prompt's own close-out falsifies.
- `REC-345` — `linkedin-prompt.md` l.32-33 reads the career target from `ROADMAP.md`, against the
  `_shared-context.md` fence `REC-111` stated from both owners.

No `source-contradiction` was proved.

## 6. Final review

cold reviewer: approve-with-tightening — B rewritten as an exception clause, D's procedure restatement
replaced by a pointer, the `roadmap-review` `What it does` correction removed; F approved with the two
occurrences above named; F1 narrowed from four launcher pairs to two; F2 raised by the reviewer.
