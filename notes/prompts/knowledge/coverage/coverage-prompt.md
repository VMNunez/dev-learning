# Coverage Prompt

Create or recalibrate one topic with one professional level as the primary target. Later-level runs
also protect the completeness of their prerequisite levels.

> **▶ Run first:** nothing — this is the per-topic producer for coverage and every global mirror its
> classifications affect.

## Configuration

```text
TOPIC = [one registered topic from `_internal/_topic-ownership.md`]
LEVEL = [junior | middle | senior]
NOTES_PATH = [optional — derive from TOPIC]
MODE = [update | dry-run]
```

`TOPIC = all` is intentionally unsupported. Run Angular and Angular Material in separate conversations and do the same for every other topic.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use the runtime's planning and collaboration facilities. Canonical tiers are not literal model IDs.
Subagents are read-only. If the market analyst, either normal cold reviewer, or the first-run boundary
reviewer when required cannot be dispatched, stop; there is no single-agent fallback.

## Resolve paths

- `TOPIC_ROOT = notes/{topic}/` unless NOTES_PATH explicitly provides that topic root
- `TARGET_FILE = {TOPIC_ROOT}coverage/{LEVEL}.md`
- `SIBLING_FILES = the other two files in {TOPIC_ROOT}coverage/`
- `GLOBAL_MIRROR = notes/coverage/{LEVEL}.md`
- `NOTES_PLANS = all existing notes-plan-{junior|middle|senior}.md files for this topic and every
  adjacent topic whose coverage may move`
- `LOCKED_BULLETS = [x] Coverage concepts assigned to Status: refined entries in NOTES_PLANS, matched
  by exact scope text after stripping the checkbox and any trailing evidence marker from plan and
  coverage copies; [ ] concepts are not locked`
- `TOPIC_BOUNDARY = this topic's row in _internal/_topic-ownership.md`
- `ADJACENT_TOPICS = the complete comparison set declared by TOPIC_BOUNDARY`
- `LEVEL_UNCALIBRATED = the selected Coverage tracker cell has no completed run` (scaffold files and
  existing bullets do not count as an execution)
- `FIRST_RUN = LEVEL is junior, this topic has its own explicit admission decision under "Admitting a
  new topic" in _internal/_topic-ownership.md, no Coverage J/M/S tracker cell has a completed run, and
  all three local topic coverage files are absent or contain zero coverage bullets`; count only plain
  bullets using the standard `- ` syntax
- Existing bullets in any local level file make `FIRST_RUN` false. Classify them normally and preserve
  their evidence markers through the existing Step 2 and Step 3 rules. Middle and senior always have
  `FIRST_RUN = false`.

## Required sources

Count lines before every whole-file read and read to EOF:

1. `_internal/_coverage-standard.md`
2. `_session-rules.md`
3. `_shared-context.md`
4. `_job-market-evidence.md`
5. `_internal/_topic-ownership.md`
6. all three topic scope files when present
7. `NOTES_PLANS` when present, including every complete `Status: refined` entry and its checkbox-marked
   `Coverage concepts` list
8. this topic's heading in `_internal/_cross-topic-inbox.md`
9. `{TOPIC_ROOT}coverage/verify-{LEVEL}.md` when present — its `## Open gaps` are proposed items from
   the completeness gate
10. the previous coverage-prompt self-report

On full recalibration, also read all three coverage files of every `ADJACENT_TOPICS` entry to EOF.
On a `FIRST_RUN`, these reads are the mandatory boundary-migration input, not optional context.

`ROADMAP.md`, notes, practice plans, project plans, and project code are downstream artifacts, not
scope evidence. Do not read them to establish or raise the competency floor.

For Spring Boot, also inspect Java coverage headings and `notes/spring-boot/layer-reference.md`.

## Run scope — full recalibration or consuming verify gaps

This prompt has two shapes; Step 0 fixes which one and records it in the plan.

**Full recalibration** (default) runs every step. Use it whenever this topic/level coverage does not yet exist, its ownership row or an adjacent boundary changed, any other recalibration trigger is active — a shared-context, job-market-evidence, or coverage-standard change, an unresolved recommendation, or a pending `_cross-topic-inbox.md` entry under this topic — or you are unsure.

**Verify-gap fast path** applies only when all of these hold:

- `verify-{LEVEL}.md` exists with `Verdict: gaps` and a non-empty `## Open gaps`;
- its stored `Coverage SHA-256` matches the current `TARGET_FILE`'s **scope bytes** and every applicable
  prerequisite SHA matches its current earlier-level file (evidence markers stripped — see "Evidence
  markers" in the standard), so every gap was raised against today's complete dependency chain;
- no `_cross-topic-inbox.md` entry is pending under this topic;
- neither this topic's ownership row nor an adjacent boundary changed since its last coverage run;
- no other recalibration trigger is active.

Its purpose is to not re-derive the whole market floor just to add an already-verified gap: the floor was set when this coverage was built, and `verify` already read the file to EOF under the market-floor lens to raise the gap. It changes exactly three steps:

- **Step 1 is skipped** — the floor is not re-derived.
- **Step 2 is scoped to the open gaps** — judge each open gap exactly as Step 2 already mandates (record add/discard), plus any single move an accepted gap forces; do not re-classify every existing item.
- **Step 4 dispatches one cold reviewer**, scoped to the added and moved items: placement, ownership, duplication across the three level files, and factual accuracy.

Everything else — the Step 0 guards, the Step 3 draft and adversarial pass, the Step 5 mirror rebuild and validation, and the Step 6 commits and self-report — runs unchanged. The "verify gaps are proposals, never pre-approved" rule is never relaxed. When unsure whether a trigger is active, run the full recalibration. The runtime contract's stop-on-dispatch-failure rule applies to the roles the selected scope actually dispatches; a scope that does not dispatch the market analyst or the second reviewer is not a fallback and does not trip that rule.

## Step 0 — Guards and plan

1. Stop on `main`.
2. Surface any unresolved previous recommendation.
3. Create a plan containing every step, validation, mirror rebuild, self-report, tracker update, and update-mode commits.
4. Run `git status --short` and preserve unrelated changes.
5. Confirm one topic only.
6. Resolve `TOPIC_BOUNDARY` and `ADJACENT_TOPICS`. Stop if the topic is unregistered, an adjacent topic
   is missing from the registry, or the relationship is not reciprocal. A missing topic must first go
   through the admission contract in `_topic-ownership.md`; never infer and silently create its boundary.
7. Set `LEVEL_UNCALIBRATED` and `FIRST_RUN`. `LEVEL_UNCALIBRATED` forces full recalibration and
   disqualifies the verify-gap fast path. If this topic has its own admission decision, no Coverage
   J/M/S cell is completed, and all three local coverage files contain zero `- ` bullets, stop unless
   `LEVEL = junior`; a newly admitted topic must be initialized through its junior `FIRST_RUN` before
   middle or senior. On `FIRST_RUN`, add the boundary migration and every affected local/global file to
   the plan, and state that no adjacent-owner bullet will be copied into the new topic; an accepted
   ownership transfer is a move.
8. For middle, inspect junior progression evidence. For senior, inspect both junior and middle
   progression evidence. Mapping a later level is allowed before consolidation; downstream authoring is not.
   State the current gate explicitly. Treat those earlier coverage files as cumulative prerequisite
   floors: they are not only context for the selected level.
9. Determine the run scope (full recalibration or verify-gap fast path — see "Run scope" above) and
   record it in the plan; when unsure, choose full recalibration.
10. Build `LOCKED_BULLETS` before classification. Stop if a refined entry's `[x]` bullet is absent
    from its recorded topic/level coverage: the freeze is already broken and must not be guessed back
    into place.

## Step 1 — Establish the level floor

*Skipped in the verify-gap fast path (see Run scope).*

Dispatch one cold market analyst. It receives only the target role, selected level,
`_coverage-standard.md`, `_shared-context.md`, `_job-market-evidence.md`, current live evidence, and
this mandate. It must not inspect `ROADMAP.md`, existing topic coverage, notes, practice plans, project
plans, or project code:

> Identify concepts whose absence would materially weaken a developer at the selected topic and level. Use current live evidence when available. Separate recurring requirements, ordinary fundamentals, practical autonomy signals, and differentiators. Do not inspect existing topic scope files and do not edit files. Do not impose an item count.

Acceptance proof:

- confirms whether live search ran;
- identifies target role and selected level;
- separates evidence classes;
- for junior, confirms that mid/senior postings did not raise the floor;
- for middle, distinguishes application/team autonomy from senior/platform ownership;
- for senior, identifies responsibility that genuinely requires deep production, platform, or multi-team ownership.

Re-dispatch once if proof is missing.

## Step 2 — Classify the existing topic

*In the verify-gap fast path this is scoped to the open gaps only (see Run scope).*

Read all three topic files to EOF and classify every existing item:

- **KEEP HERE** — belongs to the selected level and topic.
- **LOCKED IN PLACE** — marked `[x]` in a `Status: refined` notes-plan entry; preserve its scope text
  byte-for-byte after stripping the trailing evidence marker, even when current calibration would
  place it elsewhere, and record the placement conflict.
- **MOVE TO JUNIOR** — belongs to the junior foundation, regardless of the selected level.
- **MOVE TO MIDDLE** — belongs to middle autonomy, regardless of the selected level.
- **MOVE TO SENIOR** — belongs to senior ownership, production scale, platform depth, or justified specialisation.
- **DELETE** — duplicated, non-conceptual, or plainly wrong text (see the limit below).
- **ROUTE** — belongs to another topic; keep only a concrete implementation twin when justified.

Then run the cumulative prerequisite-integrity check:

- when `LEVEL = middle`, check whether the middle scope assumes any material junior concept absent
  from `coverage/junior.md`;
- when `LEVEL = senior`, check whether the senior scope assumes any material junior or middle concept
  absent from the corresponding earlier file;
- add each confirmed missing prerequisite directly to its correct earlier level, subject to the same
  market, ownership, one-concept, deduplication, and evidence-marker rules as selected-level items;
- do not expand this into a complete fresh market derivation for the earlier levels. Record incidental
  gaps found while calibrating the selected level; explicit earlier-level runs remain responsible for
  proving those levels complete.

**DELETE never removes a real concept.** It applies to exact duplicates (the surviving copy stays),
non-conceptual filler such as dictionary definitions, and claims that are simply wrong with no
correct concept behind them. Anything that names a genuine concept is relocated instead — junior,
middle, senior, or another topic's inbox. "Too basic", "too advanced", "not on the current market
floor", and "the file is getting long" are reasons to MOVE, never to DELETE. Items already present in
the file are assumed to be there on purpose — often because they appear in the repository's own
projects — so when in doubt between deleting and moving, move. Every DELETE is listed individually in
the final summary with its reason.

The refined-note lock outranks every classification except `LOCKED IN PLACE`. Never reword the scope text, move,
delete, merge, split, route, or reorder a `LOCKED_BULLET`, and never create a normalized twin at the
destination that calibration would otherwise prefer. Bullets assigned only to `pending` or `complete`
entries remain movable, as does a refined entry's `[ ]` pending addition; report the resulting
notes-plan fingerprint mismatch so `notes-plan` remaps them before further note authoring. Appending a
valid evidence marker remains allowed and does not change the lock.

Correct factual errors before making scope decisions. Apply this topic's inbox entries through the
same classification and clear every processed entry. Apply each level-prefixed open gap from
`verify-{LEVEL}.md` the same way: remove the metadata prefix, verify or correct its target level, then
add or discard it and say which in the summary. A gap the gate raised is a proposal, never a
pre-approved item.

On full recalibration, compare every retained or proposed concept against all three files of every
adjacent topic. On `FIRST_RUN`, classify every adjacent bullet that could fall inside the new
boundary as **KEEP WITH ADJACENT OWNER** or **MOVE TO NEW TOPIC**. A move removes the old bullet,
preserves its evidence marker verbatim, and records every affected topic and level. Never satisfy a new
topic by copying an existing bullet or by leaving normalized twins on both sides.

Before editing, capture every `LOCKED_BULLET` with its topic, level, section, byte-exact scope text
(trailing evidence marker stripped), and
relative order inside its refined entry. Also capture the complete trailing evidence marker from every marked bullet in every affected
topic file and mirror. After editing, compare those marker multisets byte-for-byte. Rewording, changing
level, or changing topic never changes or drops a marker; any mismatch blocks the draft and commit.

## Step 3 — Draft the selected level

The orchestrator is the only repository editor.

Write `TARGET_FILE`, add confirmed prerequisite gaps to the correct earlier level file, move
reclassified material to the correct level file, and route other-topic proposals to the inbox. On
`FIRST_RUN`, also apply accepted boundary moves to adjacent topic files; the orchestrator remains
the only repository editor.

An existing bullet carrying a `✅ NN-slug — {evidence}` evidence marker keeps that marker verbatim through KEEP HERE, any
MOVE, ROUTE, or factual correction — including when the concept sentence is rewritten from scratch. This
step is the one most likely to destroy markers, because it redrafts a whole level file: never author a
marker here, and never drop one. Read "Evidence markers" in the standard first.

Apply the standard's item format, topic ownership, level definitions, and qualitative stopping rule. Never add or remove an item to satisfy a numeric count.

Before closing the draft, run an adversarial pass. Stop when it yields only duplicates, different-level material, another topic's ownership, or unjustified specialisation.

## Step 4 — Cold final review

Dispatch two cold reviewers after the draft exists.

*In the verify-gap fast path, dispatch one scoped reviewer instead (see Run scope).*

### Reviewer A — level calibration

Reads the three final topic coverage files, target, evidence, and standard. Returns only:

- missing selected-level requirements;
- missing prerequisite requirements in every earlier level required by the selected level;
- items placed too low or too high;
- cross-level contradictions or duplicates;
- factual errors;
- selected-file item count as information only, never as a verdict.

### Reviewer B — quality and ownership

Reads all three topic level files, every adjacent topic's three level files, the relevant global mirrors, targeted owner files, the ownership registry, and standard. Returns only:

- grouped or dictionary-definition items;
- missing important confusable pairs;
- duplicate or misplaced ownership;
- unclear section structure;
- evidence markers missing, altered, duplicated, or detached from a surviving moved concept;
- locked bullets altered, moved, reordered, duplicated, or detached from their refined plan entry;
- confirmation: `N items reviewed`.

Both reports must state the selected file's line count and that it was read to EOF. Re-dispatch a failed reviewer once. Apply accepted findings, then repeat factual and mechanical checks.

### Reviewer C — first-run boundary migration only

When `FIRST_RUN` is true, dispatch one additional cold reviewer after A and B. It reads the
ownership registry, the new topic's three final files, every adjacent topic's three final files, the
affected mirrors, and the pre-run versions from Git. It returns only:

- concepts copied or left under more than one owner;
- moves that violate the registered boundary;
- marked concepts whose complete evidence marker is missing, altered, duplicated, or attached to the
  wrong surviving concept;
- confirmation: `N moved concepts and M pre-run markers reviewed`.

Its report must state every whole-file line count and EOF confirmation. Re-dispatch once if the proof is
missing; a failed second report blocks the run. This reviewer never proposes new scope—the market and
normal reviewers own that judgment.

Both reviewers judge scope only from the target in `_shared-context.md`, current market evidence,
ordinary fundamentals, and the standard's level definitions. A concept's presence in `ROADMAP.md`,
notes, exercises, projects, or plans is never evidence that it belongs at the selected level.

## Step 5 — Rebuild and validate the level mirror

Rebuild `## {TOPIC}` in `GLOBAL_MIRROR` from `TARGET_FILE`:

- topic `##` headings become `###`;
- bullets and order remain identical;
- introduction appears once.

If a prerequisite-integrity finding or cross-level move changed a sibling level, rebuild this topic's
heading in that level's global mirror too. No local sibling edit may ship with a stale mirror.

If the first-run boundary migration changed an adjacent topic/level, rebuild that topic heading in the
matching global mirror from its source file in the same run. A new topic is not complete while an old
mirror still contains a moved concept.

Validate:

1. local/mirror bullet text and order match — including each bullet's trailing `✅ NN-slug — {evidence}` evidence marker,
   which is part of the bullet text and must appear identically in both files;
2. local/mirror headings match;
3. expected top-level topics remain exactly once;
4. no checkbox, numbered coverage item, or fenced code exists;
5. no exact duplicate exists;
6. no normalized concept occurs in more than one of the three level files;
7. the selected file contains no obvious other-topic section;
8. no normalized concept occurs in the selected topic and any adjacent topic at any level;
9. the pre/post evidence-marker multisets match exactly across every affected topic file and mirror;
10. every locked bullet's scope text remains byte-identical in the same section, topic, level, and refined plan
    entry, with its relative locked-bullet order unchanged;
11. `git diff --check` passes and the complete declared diff is inspected.
12. For every affected notes plan, recalculate its stored coverage SHA-256 over its level file's scope bytes
   (evidence markers stripped, per the standard's canonical command). A mismatch is the expected
   refresh signal: report `notes-plan-prompt` as the next step so it can remap the final coverage
   before another note is built. This is not a return to `coverage-verify`.

## Step 6 — Update mode

Dry run never writes coverage artifacts, but its self-report and `dry-run` tracker outcome are still
committed as execution evidence.

In update mode:

1. Commit changed topic scope files and every affected global mirror atomically. When `verify-{LEVEL}.md`
   supplied gaps, blank its `## Open gaps` to `*(none)*` and set `Verdict: superseded` in the same
   commit, add `Superseded by Coverage SHA-256: <new TARGET_FILE digest>`,
   `Superseded junior prerequisite SHA-256: <digest> | n/a`, and
   `Superseded middle prerequisite SHA-256: <digest> | n/a`. Fingerprint every prerequisite applicable
   to `LEVEL`, whether or not that particular file changed, and thereby prove which final dependency
   chain consumed the gaps.
   Preserve `## Locked placement conflicts` unchanged as historical evidence; consuming actionable
   gaps never erases a conflict Victor deliberately chose to freeze.
   No run re-proposes a consumed gap. That superseded verification is
   execution history, not a new gate: continue directly to `notes-plan-prompt`. A fresh
   `coverage-verify` may be run later for new completeness evidence, but it is never required before
   planning or authoring notes.
2. Refresh the `## Coverage demonstrated` table in `PROGRESS.md` for this topic and level, in the same
   commit as the coverage files. Authoring changes the denominator, so leaving the table alone makes it
   overstate the demonstrated share until the next `progress-update` run.
   **`progress-update-prompt.md` step D8 owns the table's format, its counting rule, and the `*`
   provisional mark — read D8 and follow it.** Recount the cell with the two greps there rather than
   adjusting the printed value, rewrite that cell and the level's `**Total**`, and drop the `*` from the
   cell now that this run has recorded a coverage execution for the level. If cross-level moves changed
   another level's file, recount those cells too. Touch no other row, and never touch
   `Professional level by topic` — a denominator that moved is not a promotion or a demotion.
3. Commit inbox routing separately only when another topic receives proposals.
4. Before every add and commit, inspect status and stage only declared paths.
5. Write the pipeline self-report.
6. Update the run tracker cell for the topic and level.
7. Commit self-report and tracker together.
8. Verify both commits with `git show --stat`.

For step 4, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in full. Its
declared report path is `_internal/_last-run-report-coverage-prompt.md`; update the selected
Coverage J/M/S cell in `_internal/_run-tracker.md`.

## Final summary

Report:

- branch, mode, topic, and level;
- ownership boundary, adjacent topics, and the `LEVEL_UNCALIBRATED` and `FIRST_RUN` states;
- for a `FIRST_RUN`, every boundary move and affected local/global mirror;
- run scope (full recalibration or verify-gap fast path);
- progression-gate state;
- selected file lines/items before and after;
- all whole-file EOF confirmations;
- kept, prerequisite gaps added by level, moved to junior/middle/senior, deleted, corrected, and routed counts;
- locked-bullet count and every locked placement conflict;
- market analyst and reviewer completion;
- first-run boundary reviewer completion or `n/a`;
- qualitative stopping-rule result;
- mirror parity;
- notes-plan state (`missing`, `current`, or `refresh required`) and, for `refresh required`, name
  `notes-plan-prompt` as the next step without sending the workflow back to `coverage-verify`;
- files and commits;
- unresolved risks or `none`.

Do not finish while a plan item remains incomplete.
