# System-check report — strategy

Date: 2026-10-18 · Flow: strategy · Starting commit: `88fb26bb2cf22f4d1af20603f2a162cae912bc5c` · Branch: `projects/07-timetrack`
Status: complete

## 1. Audited paths

Prompt `notes/prompts/system/system-check-prompt.md` blob `c8337184e21becab43d00177fac9b4e4813dc11e` ·
mandate `notes/prompts/system/_internal/_system-check-reconcile-prompt.md` blob
`cd60ab694e617051255f7962a6b6e17fc551d522`.

Why this run: the flow was `stale (method)` — its 2026-10-15 report ran under prompt `31ff7f33` / mandate
`397e27d6`; no strategy source path moved since (every blob below equals the 2026-10-15 snapshot).

Map blobs at admission (evidence only, outside freshness): `README.md` `3ed33d0d09dca53e634137d452050af43c0ef7c4`,
`_system-map.md` `8d5d559fab8d6b41782f3edc296ade860fc0c7f6`.

Concerns: 11 (7 prompt, 3 standard, 1 launchers), all accepted; four were rejected on their first return
and re-dispatched cold once (§5).

Dispositions as the accepted return declares them: correct / incorrect / missing / fenced / source-contradiction.

| Path | Blob id | Lines | c / i / m / f / sc |
|---|---|---|---|
| notes/prompts/strategy/tracking/progress-update-prompt.md | cb1c7c8406e70fbd07bbab6689b7ee9049bdb302 | 604 | 27 / 0 / 0 / 2 / 0 |
| notes/prompts/strategy/tracking/roadmap-review-prompt.md | 417ccd7426f4a49798a8729578d920982d921b1c | 519 | 30 / 0 / 1 / 1 / 0 |
| notes/prompts/strategy/tracking/_internal/_concept-extraction-standard.md | bbd25bd4803609254db45020879987804d741d41 | 166 | 6 / 0 / 0 / 1 / 0 |
| notes/prompts/strategy/tracking/_internal/_roadmap-standard.md | 96160d4558c0a76beeb6511ce6c7f4b1fa28dbb4 | 206 | 9 / 0 / 0 / 1 / 0 |
| notes/prompts/strategy/apply/cv-prompt.md | 00ca621406f1b35b6fa072cac28e02b345c2cf9a | 357 | 33 / 0 / 1 / 1 / 0 ² |
| notes/prompts/strategy/apply/linkedin-prompt.md | 76e7cb7e50400b2743242ca0cd0515a191058888 | 299 | 29 / 0 / 0 / 1 / 0 ¹ |
| notes/prompts/strategy/apply/cover-letter-prompt.md | af69008e4424f9154bb9b45b3c2712cad1a036c6 | 140 | 27 / 0 / 0 / 0 / 0 |
| notes/prompts/strategy/apply/profile-readme-prompt.md | 13d0b9c652d62cff6959bc82bd15ba6cfcc9b301 | 111 | 15 / 1 / 2 / 1 / 0 (+1 `missing` struck, §5) |
| notes/prompts/strategy/apply/tracker-prompt.md | 2981598a82961086700914845071feb35ea1f015 | 216 | 13 / 1 / 0 / 2 / 0 ³ |
| notes/prompts/strategy/apply/_internal/_application-standard.md | 0b6ecdb1365d9722e5ca49e2757e3c2ef68a3390 | 303 | 6 / 0 / 0 / 1 / 0 |
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

¹ The return ruled three cells `incorrect` (R2a-c); the final reviewer ruled them delegated universal outputs (README "Either way, **every run writes its own `_last-run-report*.md`" paragraph), so they count `correct`.
² Its one `missing` (R4) is real but was dropped as a partial fix of a population question, carried to `REC-365`.
³ Its `source-contradiction` (row 17) was ruled not mutually exclusive by the final reviewer (§6) and counts `correct`.

Launchers concern (7 pairs): 33 rows — 30 correct, 3 `incorrect` ruled on the launcher files themselves
(never a map correction; §6).

## 2. Validator

Baseline (`-MachineryOnly`, Step 0): every check `PASS`; one `REPORT` (a path a closed ledger line
proposes that does not exist — a proposal, not a typo); `SKIP` live coverage/plan/route state by design.
Final (`-MachineryOnly`, after the approved patch, the `REC-365` row and this report): every check `PASS`, the same one `REPORT` and the same `SKIP`; 60 distinct open ledger IDs compared.

## 3. Map corrections

Applied: **R1, R3, R5, SM1, SM2** (R1 and R5 in the reviewer's tightened wording). Dropped by the reviewer: **R2a, R2b, R2c** (F1 — delegated, not a contradiction; keeping them would restate a universal rule in one row, a `REC-064` fork) and **R4** (F2 — population question, `REC-365`). Script `review/patch.py`, applied diff `review/applied-patch.diff` in the run checkpoint.

| ID | Map · row | Was | Now | Source |
|---|---|---|---|---|
| R1 | README · Public interface index `/tracker` · Config | `update` adds `EMPRESA` + `PUESTO` | `update` adds `EMPRESA` (and `PUESTO` only if needed to disambiguate) | tracker-prompt.md L80 "PUESTO   = [role, only if needed to disambiguate]" |
| ~~R2a~~ dropped | README · index `/linkedin` · Runtime · commit owner | `S · output only` | `S · agent commits its own _last-run-report-linkedin.md + tracker row; the LinkedIn text itself is output only` | linkedin-prompt.md L297 "the three bullets written to … `_last-run-report-linkedin.md`, its own commit" |
| ~~R2b~~ dropped | README · index `/linkedin` · Run-first/boundary | writes no repo file | writes no repo file beyond the universal `_last-run-report-linkedin.md` + `_run-tracker.md` close-out | same |
| ~~R2c~~ dropped | README · Strategy catalogue `linkedin-prompt.md` · Generates | No repo file, so the close-out has nothing to check: instead name each section actually drafted | No repo file beyond the universal … row, so the close-out's declared-output check is met by naming each section actually drafted | linkedin-prompt.md L296-297 |
| R3 | README · Strategy catalogue `roadmap-review-prompt.md` · Reads | (no `ROADMAP.md`) | + `ROADMAP.md` (the current plan, read before the edits) | roadmap-review-prompt.md L94-96 "`ROADMAP.md` — the current plan: strategic context, phase table, project sequence, and study block tables." |
| ~~R4~~ dropped | README · Strategy catalogue `cv-prompt.md` · Reads | (no preflight) | + `_external-path-preflight.md` (executed before any `job-search/` read or write) | cv-prompt.md L5-6 "Before reading or writing `job-search/`, execute `notes/prompts/_internal/_external-path-preflight.md`." |
| R5 | README · Strategy catalogue `profile-readme-prompt.md` · Generates | gap list unconditional; "checks both paths' mtime" | gap list (every `optimize` run; a `sync` run only when an item resolved or a new one was found); "checks that the mtime of each path this run wrote is from this run, not just that the path exists" | profile-readme-prompt.md L61 "Update the "Known gaps" list … if anything was resolved or newly discovered." vs L79-80 |
| SM1 | `_system-map.md` §7 `{project}/PLANNING.md` · Read by | (no `/profile-readme`) | + `/profile-readme` (the active project's Section 0) | profile-readme-prompt.md L46-47 "the active project's `PLANNING.md` Section 0" |
| SM2 | `_system-map.md` §7 `dev/portfolio/VMNunez/README.md` · Read by | recruiters; the profile repo's own adapter … | recruiters; `/profile-readme` (its current state, and the adapter's gap list as standing context); … | profile-readme-prompt.md L42, L45 "Read `dev/portfolio/VMNunez/README.md` — the current state." |

**Orchestrator flags, as the reviewer settled them:**

- F1 — R2a/R2b/R2c rest on the reading that the universal self-report falsifies "output only" / "writes no
  repo file". The cover-letter concern (r2) ruled the identical shape on `/cover-letter` (README L422, and
  its catalogue row L673) `correct`, citing README L428-433 ("not repeated in the per-prompt rows below only
  because they are universal"), and the cv concern ruled `/cv`'s commit-owner cell `correct` on the same
  delegation. Settle whether R2a-c are positive contradictions or delegated universal outputs; whichever way,
  the `/linkedin` and `/cover-letter` rows must not end up ruled two ways. → **Delegated**; R2a-c dropped; linkedin r2 rows 4, 6, 9 count `correct`, matching cover-letter r2.
- F2 — R4 adds the preflight to `/cv`'s Reads alone. linkedin (r2) and cover-letter (r2) ruled the same
  absence on their own rows `fenced` (the Reads-column fence covers only `_session-rules.md` and
  `_shared-context.md`), tracker and profile-readme did not rule it. The cv concern itself names the
  whole-population half as `catalogue`'s. Decide whether R4 stands for one row, or is held back as a
  population question. → **Held back**: one population ruled three ways (`missing`, `fenced`, struck); `REC-365`.
- F3 — roadmap-review row 25 rules the absence of `_agent-runtime-standard.md`, `_pipeline-self-report.md`
  and `_last-drift-report.md` from its Reads cell `fenced` on README L34-35 / L355 and a convention — none of
  the four fence sites. No patch follows; check whether `_last-drift-report.md` is owed (`missing`). → No patch owed, but the `fenced` label is wrong: the runtime standard and the self-report are stated universally at README L35/L355, and the drift report's readers are set by rule at `_system-map.md` §7 L325, so adding it per row would restate that rule. The `fenced` rulings on the preflight (linkedin row 8, cover-letter Reads row, tracker row 6) likewise misuse the `Reads` fence, which names only `_session-rules.md` and `_shared-context.md`.
- F4 — SM1/SM2 add a reader to a §7 Read-by list; check each is no broader than the quoted lines. → Approved as drafted (profile-readme l.42-47). Other occurrences named, not changed: README L541 and L734-736 are `PLANNING.md` reader lists that also lack `/profile-readme` — outside this licence and not complete lists.

## 4. Rows ruled correct, per file

As the counts in §1. No section-level "verified".

## 5. Gate record (Step 3)

- Rejected on first return (gate item 2 — a §7 cell its licence names left unruled), each re-dispatched
  cold once and accepted on the second: `cover-letter-prompt` (cv-bullets L287, coverage L269 unruled),
  `cv-prompt` (coverage L269), `profile-readme-prompt` (`{project}/PLANNING.md` L284 unruled),
  `linkedin-prompt` (coverage L269).
- **`linkedin-prompt`'s first return had been copied into `accepted/` before that check and was then
  removed** — a Step 3 breach (logged at close-out), caught before any draft patch.
- Struck: `profile-readme-prompt` (r2) row 10 — a `missing` §7 **row** for `_external-path-preflight.md`;
  whether §7 must carry a row for that file is a completeness claim over the registry (the `catalogue`
  cluster's — the return itself marks it whole-population), outside the prompt licence. Kept out of the patch.
- Gate notes, no patch: `concept-extraction-standard` rules a §7 absence `fenced` outside the four fence
  sites; `roadmap-review-prompt` row 25 (F3).

## 6. Findings

- `REC-365` (new) — `_external-path-preflight.md` is executed by six prompts and named in neither map; one decision must place it for all six (raised by the final reviewer, verified against cv-prompt.md l.5-6 and a grep of both maps).
- Launcher rows 3 and 12 (`/cover-letter`, `/linkedin` "Output only — nothing is written to the repo") — already open as `REC-344`, same four files and quotes; no new evidence, no ledger change.
- Launcher row 23 (`/progress-update` "and to close gate G6") — no row: `_session-rules.md` owns G6 and that scheduling (its "PROGRESS.md updates" bullets) and its launcher rule lets a session-rules-owned fact stand, so the 2026-10-15 clearing stands.
- tracker-prompt row 17 — **not** a source contradiction: L207 "only this prompt is committed" (with L31-32) keeps the personal-data files out of the repo while the prompt lives in it, and puts no limit on the run's own self-report commit at L216; a compliant run satisfies both. Counted as `correct` for the rest of the row set.

No `source-contradiction` was proved.

## 7. Final review

cold reviewer: approve-with-tightening — R2a-c and R4 dropped, R1 and R5 tightened, R3/SM1/SM2 approved as drafted; the struck profile-readme row upheld; every flow file has an accepted return; no out-of-licence absence reached the patch; no machinery file or live artifact edited. Verdict persisted at `review/verdict.md` in the run checkpoint.
