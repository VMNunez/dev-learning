# System-check report — system

Date: 2026-10-18 · Flow: system · Starting commit: `f88bb8ae9ed27d3338c63be80f7162fa48d618db` · Branch: `projects/07-timetrack`
Status: complete

## 1. Audited paths

Prompt `notes/prompts/system/system-check-prompt.md` blob `c8337184e21becab43d00177fac9b4e4813dc11e` ·
mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob
`cd60ab694e617051255f7962a6b6e17fc551d522`.

Why this run: `FLOW = next`. Knowledge, projects, practice and strategy were `fresh`; `system` had never run;
no path was `unassigned`. The whole system therefore read `not verified` at Step 0 (`system` and `cross`
outstanding).

Map blobs at admission (evidence only, outside freshness): `README.md` `6b076e50f7d1b756e0d3d3df19afa0202f4111ed`,
`_system-map.md` `c8358e090718cf3d2e2fe1e6c43fc1137ec020d3`. The two ledger files below are listed as evidence
of what was read, never as a freshness condition.

Concerns: 17 (2 prompt, 1 component, 10 standard / root contract, 1 validator, 2 skill, 1 launchers), all
accepted at Step 3 — `skill-refine` on its one cold re-dispatch, the validator from the scratch file of a
role an API rate limit killed after it had persisted a complete return (§5).

Dispositions as the accepted return declares them: correct / incorrect / missing / fenced / source-contradiction.

| Path | Blob id | Lines | c / i / m / f / sc |
|---|---|---|---|
| notes/prompts/system/system-check-prompt.md | c8337184e21becab43d00177fac9b4e4813dc11e | 392 | 27 / 3 / 1 / 3 / 0 |
| notes/prompts/system/system-gaps-prompt.md | a5ed1cdad78872e68463a81475df2c50522993ee | 298 | 15 / 6 / 3 / 0 / 1 ² |
| notes/prompts/system/_internal/_system-check-reconcile-prompt.md | cd60ab694e617051255f7962a6b6e17fc551d522 | 122 | 8 / 0 / 1 / 0 / 0 |
| notes/prompts/_internal/_session-rules.md | 0a44dcb4b4371ef984fd5457e539930ea3190b47 | 1526 | 20 / 2 / 0 / 0 / 0 |
| notes/prompts/_internal/_agent-runtime-standard.md | 5599a097c599bbb05ad50c5bb711a7747d4cf14a | 117 | 12 / 0 / 0 / 1 / 0 |
| notes/prompts/_internal/_batch-mode.md | e6bdcaf47bbc44625eccbf117d61ce6d4193524e | 107 | 7 / 0 / 0 / 1 / 0 |
| notes/prompts/_internal/_external-path-preflight.md | 1bee89cb47415a4cc34d29fe68fb1820110137fc | 15 | 2 / 0 / 0 / 2 / 0 |
| notes/prompts/_internal/_pipeline-self-report.md | 6c1202d84083cbb49c36d25d7df9ae049189a59e | 461 | 12 / 0 / 0 / 0 / 0 |
| notes/prompts/_internal/_single-shot-self-report.md | 75abd66be7fe44c3d067d1d349e6ebc86c6baa39 | 221 | 15 / 0 / 0 / 1 / 0 |
| notes/prompts/_internal/_recommendation-ledger.md | 40064bef673a3a3a6fbdcd994e9bf88bd82856a2 | 362 | 12 / 0 / 0 / 1 / 0 (evidence, outside freshness) |
| notes/prompts/_internal/_recommendation-ledger-closed.md | 759c6b4bc654e09d615a2d9e027f0159618519b0 | 351 | 7 / 0 / 0 / 1 / 0 (evidence, outside freshness) |
| notes/prompts/_internal/_recommendation-resolution-doctrine.md | ad65dde424e5abea71280977313ce1f8763b7544 | 1725 | 8 / 0 / 0 / 0 / 0 |
| notes/prompts/_internal/_shared-context.md | b848bd4771705fda62fbb6c593ebf801e400b999 | 187 | 5 / 0 / 0 / 1 / 0 |
| notes/prompts/_internal/validate-prompt-system.ps1 | ea371b057f598a5b236ae8f6a2cc557c3246d94d | 1697 | 64 / 3 / 5 / 0 / 0 |
| .claude/skills/map-sync/SKILL.md (+ `.agents/` mirror, same blob) | c59c86f9cbf7178637e1c9f82c1f75abc22b21c2 | 179 | 6 / 0 / 1 / 1 / 0 |
| .claude/skills/skill-refine/SKILL.md (+ `.agents/` mirror, same blob) | 73ebd1beefe7184bed789b2b08fdbc3e638b5164 | 195 | 9 / 0 / 3 / 0 / 0 ¹ |
| .claude/commands/system-check.md | 469d76af7d77f71a347af1a8a20c77fff3bc99d0 | 16 | launchers concern |
| .codex/commands/system-check.md | 43d854a05ace2421191e59cf056d62e65edad11d | 18 | launchers concern |
| .claude/commands/system-gaps.md | 9a980ffad1f5486522fe3cc4bf37276d11fd9be4 | 16 | launchers concern |
| .codex/commands/system-gaps.md | ebcd863046068a7787295a88136e8a84e655935d | 18 | launchers concern |

¹ The accepted return is the re-dispatch; the first return was rejected at Step 3 (§5).
² Its `source-contradiction` (R25) was re-ruled an ambiguity by the final reviewer — not mutually exclusive — and
counts toward `REC-367`, never as a proved source-contradiction (§6).

Launchers concern (2 pairs): 31 rows — 20 correct, 10 `incorrect` and 1 `source-contradiction`, all ruled on
the launcher files themselves (never a map correction; §6).

## 2. Validator

Baseline (`-MachineryOnly`, Step 0): every check `PASS`; one `REPORT` (a path a closed ledger line proposes that
does not exist — a proposal, not a typo); `SKIP` live coverage/plan/route state by design.
Final (`-MachineryOnly`, after the approved patch, the four new ledger rows and this report): every check `PASS`, the same one `REPORT` and the same `SKIP`; 64 distinct open ledger IDs compared (60 + `REC-366`–`REC-369`).

## 3. Map corrections

Applied in the reviewer's approved form: **M1, M2, M3, M4-5, M7, M8, M9, M11, M12, M15, M16-17, M18, M19, M20,
M21, M22, M23, M24, M25-28, C1, C2, T7, T10b** (M1, M2, M3, M12, M19 and M25-28 in the reviewer's tightened
wording; C1 and C2 as the reviewer settled them; T7 and T10b added by the reviewer's grep of both maps).
Dropped: **M6** (a pure absence that README's "every run writes its own `_last-run-report*.md`" paragraph
delegates — the same ruling the 2026-10-18 strategy reviewer made on R2a-c). IDs M10, M13 and M14 are unused:
the draft numbered them for the two returns' proposals on C1 and C2 and then carried those as conflicts.
Scripts `review/patch-final.py` and the applied diff `review/applied-patch.diff` are in the run checkpoint.

| ID | Map · row | Was | Now | Source |
|---|---|---|---|---|
| M1 | `_system-map.md` §9 `map-sync` · Writes / returns | "or an explicit verified/unaffected verdict" | "and always one closing verdict" with the four verdicts | map-sync/SKILL.md L154 "Always close with the verdict, in this vocabulary", L156-159 |
| M2 | README System catalogue `_system-check-reconcile-prompt.md` · Reads | — | both maps (to EOF on `cross`, grepped hits on a file concern) and the file, launcher pairs or `cross` inventory files a concern is about | reconcile L37-38 "both map paths", L68 "Count `PATH`'s lines, read it to EOF", L73-75, L86 "Read both maps to EOF and declare them" |
| M3 | README index `/system-gaps` · boundary | "no prompt, skill, standard or live artifact is opened" | nothing outside its declared read set (pointer to the family row) — no standard but the two contracts every runnable prompt executes | system-gaps L43-54, L6 |
| M4-5 | README System catalogue `system-gaps-prompt.md` · Reads | "its own previous report. **Nothing else — no prompt, skill, standard, …**" | + its `Status:` line and the two contracts; "no other prompt, skill, standard, …" | system-gaps L51-54 |
| M7 | README Typical run order · Auditing the machinery | "It reads only the two maps" | "It uses only the two maps as evidence" | system-gaps L22, L45-54 |
| M8 | `_system-map.md` §11 `/system-gaps` row | "reads only these two maps" | "reads these two maps as its only evidence" | system-gaps L45-54 |
| M9 | `_system-map.md` §7 `_recommendation-ledger.md` · Read by | (no `/system-gaps`) | + `/system-gaps` Step 5, deduplicating, never as a source of gaps | system-gaps L45-48 "read for its `## Open` rows … both read **never** as a source of gaps", L189-191 |
| M11 | `_system-map.md` §7 standards row · Read by | "`/system-gaps` never opens one" | opens only the two contracts every runnable prompt executes | system-gaps L6, L52-54 |
| M12 | README index `/system-check` · Config | "is resumed before any other run" | "is resumed rather than a new run started (`FLOW=next` resumes it whatever its flow; a named flow resumes only its own)" | system-check L213-215 |
| M15 | `_system-map.md` §2 freshness paragraph | "— both ledger files excepted —" | "— the two maps and both ledger files excepted —" | system-check L172-173 "Four files are outside every freshness comparison, deliberately: the two maps, …" |
| M16-17 | `_system-map.md` §9 `skill-refine` · Primary reads | (no "The breach log", no breach-log section of the session rules) | + `_pipeline-self-report.md` → "The breach log"; + `_session-rules.md` → "When a skill's own text is what went wrong — the skill breach log" | skill-refine L35-36, L54, L158-159 |
| M18 | `_system-map.md` §9 `skill-refine` · Commit owner + isolation | (no isolation) | + one cold `reviewer`, `deep`, five inputs, never the drafter's reasoning | skill-refine L96-98 |
| M19 | `_system-map.md` §7 `_ritual-friction.md` · Read by | "`REC-054` (c) **only** … no close-out adjudicates it" | + the invoking skill's close-out counting `open` rows against that ruling's threshold | _session-rules.md L513-517 |
| M20 | `_system-map.md` §7 `_skill-breach-log.md` · Read by | "`skill-refine` **only**" | + the invoking skill's own close-out, counting rows sharing one `Breached step` against the bar | _session-rules.md L501-506 |
| T7 | README internal-only files · `_skill-breach-log.md` | "read by `skill-refine` alone" | "consumed by `skill-refine` alone, counted against the bar by the invoking skill's own close-out" | _session-rules.md L501-506 |
| C1 | `_system-map.md` §7 `_recommendation-ledger-closed.md` · Read by | "`/system-gaps` Step 7" | "`/system-gaps` Step 5" + `/system-check` Step 5 deduplication (and its contract audit) | system-gaps L189-194 vs L225-226; system-check L111-112, L324-325 |
| C2 | `_system-map.md` §7 `_recommendation-resolution-doctrine.md` · Read by | "**and nothing else**: no prompt reads it" | "**and nothing else uses it**: no prompt or skill reads it for its rules …; `/system-check`'s `system` flow reads it to EOF only as audited machinery" | doctrine L16-18; system-check L97-98, L113-114 |
| T10b | README internal-only files · doctrine | "read only by a session resolving a ledger row" | "used only by …, and audited as machinery by `/system-check`'s `system` flow" | as C2 |
| M21 | README Platform adapters · first exempt class | "the market file" | "the market and application-evidence files" | validator L268-280 |
| M22 | README Platform adapters · path roots | "until the same date" | "until 2026-08-27" | validator L391-393 |
| M23 | README Platform adapters · `unrecorded` escape | round count + `no closing round` stated as part of what the check accepts | a parenthesis: the archive header requires it, not this check | validator L914-917 |
| M24 | README `-MachineryOnly` paragraph · skip list | "the plan/route fingerprint checks" | + the notes-plan header and `Pending study` grammar checks and the `verify-{LEVEL}.md` superseded report | validator L1019-1299, L1128 |
| M25-28 | README Platform adapters · new paragraph | (absent) | the failing checks no paragraph stated: launcher delegation + `argument-hint:`; per-prompt runtime, run-first and self-report contracts with the single-shot tracker rows; thin adapters, representative dry runs, external-path simulation; notes-plan headers + `Pending study` grammar | validator L152-159, L309-376, L1597-1629, L1099-1172 |

## 4. Rows ruled correct, per file

As the counts in §1. No section-level "verified".

## 5. Gate record (Step 3)

- Rejected on first return, re-dispatched cold once and accepted on the second: `skill-refine` (its first OUT
  file lacked the closing `concern complete` line — item 5 — and its `_skill-runs.md` `incorrect` offered two
  alternatives rather than one replacement — item 3). The re-dispatch settled that cell `correct` from the
  sink's own header, so the first return's row is superseded, not struck.
- Validator: the role died on an API rate limit after persisting a complete return; it was read from its
  scratch path under the runtime standard's ladder and gated like any other return.
- Struck: none.
- Gate notes, no patch: several returns label "the file states no ownership of this cell" `fenced`
  (shared-context, batch-mode, external-path-preflight, the map-sync hub row, agent-runtime-standard,
  single-shot, system-check rows 9/11/26) — outside the licence rather than one of the four fence sites;
  shared-context row 1 is labelled `correct` on a silent source. The reviewer confirmed system-check rows 9
  and 11 cite the README `Reads` fence for `_agent-runtime-standard.md` and `_pipeline-self-report.md`, which
  that fence does not cover: both contracts are absent from nearly every catalogue `Reads` cell — a
  whole-population map question named for the next `cross` (`catalogue`) run, not a ledger row.

## 6. Findings

- `REC-366` (new) — the `system-check` and `system-gaps` launcher pairs restate prompt-owned rules, and
  `.codex/commands/system-gaps.md` l.6 and l.14 cannot both hold; sibling of open `REC-344` and `REC-352`, a
  distinct population. The reviewer added the `system-check` write-set clause. **This run's one proved
  source-contradiction** is the `.codex` pair inside it.
- `REC-367` (new) — `system-gaps-prompt.md` characterises its read set more broadly than it lists it
  (l.36, l.43-44, l.234 against l.44-54 and l.6): an ambiguity, re-ruled from the concern's
  `source-contradiction` by the reviewer.
- `REC-368` (new) — the doctrine's l.23 and l.482 point at a `## Row shapes` heading that does not exist.
- `REC-369` (new) — a blank line at l.218 of the ledger's `## Open` table leaves every row from `REC-273` on
  rendering as paragraph text.
- Observations, no row: `system-check-prompt.md` l.212-215 leaves a named flow facing another flow's
  in-progress run undefined (not mutually exclusive); the doctrine's "Nothing else reads it" is about use and
  compatible with the audit read once the map said so (C2).

## 7. Final review

cold reviewer: approve-with-tightening — M6 dropped; M1, M2, M3, M12, M19 and M25-28 tightened; C1 and C2
settled; T7 and T10b added; every flow file has an accepted return; no struck row and no out-of-licence absence
reached the patch; no machinery file or live artifact edited. Verdict persisted at `review/verdict.md` in the
run checkpoint.
