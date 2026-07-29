# Coverage Prompt

Create or recalibrate one topic at one professional level.

> **▶ Run first:** nothing — this is the per-topic producer for coverage and the selected global mirror.

## Configuration

```text
TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
LEVEL = [junior | middle | senior]
NOTES_PATH = [optional — derive from TOPIC]
MODE = [update | dry-run]
```

`TOPIC = all` is intentionally unsupported. Run Angular and Angular Material in separate conversations and do the same for every other topic.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use the runtime's planning and collaboration facilities. Canonical tiers are not literal model IDs. Subagents are read-only. If the market analyst or either cold reviewer cannot be dispatched, stop; there is no single-agent fallback.

## Resolve paths

- `TOPIC_ROOT = notes/{topic}/` unless NOTES_PATH explicitly provides that topic root
- `TARGET_FILE = {TOPIC_ROOT}coverage/{LEVEL}.md`
- `SIBLING_FILES = the other two files in {TOPIC_ROOT}coverage/`
- `GLOBAL_MIRROR = notes/coverage/{LEVEL}.md`
- `NOTES_PLAN = {TOPIC_ROOT}coverage/notes-plan-{LEVEL}.md`

## Required sources

Count lines before every whole-file read and read to EOF:

1. `_internal/_coverage-standard.md`
2. `_session-rules.md`
3. `_shared-context.md`
4. `_job-market-evidence.md`
5. all three topic scope files when present
6. this topic's heading in `_internal/_cross-topic-inbox.md`
7. `{TOPIC_ROOT}coverage/verify-{LEVEL}.md` when present — its `## Open gaps` are proposed items from
   the completeness gate
8. the previous coverage-prompt self-report

`ROADMAP.md`, notes, practice plans, project plans, and project code are downstream artifacts, not
scope evidence. Do not read them to establish or raise the competency floor.

For Spring Boot, also inspect Java coverage headings and `notes/spring-boot/layer-reference.md`.

## Run scope — full recalibration or consuming verify gaps

This prompt has two shapes; Step 0 fixes which one and records it in the plan.

**Full recalibration** (default) runs every step. Use it whenever this topic/level coverage does not yet exist, any recalibration trigger is active — a shared-context, job-market-evidence, or coverage-standard change, an unresolved recommendation, or a pending `_cross-topic-inbox.md` entry under this topic — or you are unsure.

**Verify-gap fast path** applies only when all of these hold:

- `verify-{LEVEL}.md` exists with `Verdict: gaps` and a non-empty `## Open gaps`;
- its stored `Coverage SHA-256` matches the current `TARGET_FILE`, so the gaps were raised against today's bytes;
- no `_cross-topic-inbox.md` entry is pending under this topic;
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
6. For middle, inspect junior progression evidence. For senior, inspect both junior and middle
   progression evidence. Mapping a later level is allowed before consolidation; downstream authoring is not.
   State the current gate explicitly.
7. Determine the run scope (full recalibration or verify-gap fast path — see "Run scope" above) and
   record it in the plan; when unsure, choose full recalibration.

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
- **MOVE DOWN** — belongs in junior while reviewing middle.
- **MOVE UP** — belongs in middle while reviewing junior.
- **MOVE TO SENIOR** — requires senior-level ownership, production scale, platform depth, or justified specialisation.
- **DELETE** — duplicated, non-conceptual, or plainly wrong text (see the limit below).
- **ROUTE** — belongs to another topic; keep only a concrete implementation twin when justified.

**DELETE never removes a real concept.** It applies to exact duplicates (the surviving copy stays),
non-conceptual filler such as dictionary definitions, and claims that are simply wrong with no
correct concept behind them. Anything that names a genuine concept is relocated instead — junior,
middle, senior, or another topic's inbox. "Too basic", "too advanced", "not on the current market
floor", and "the file is getting long" are reasons to MOVE, never to DELETE. Items already present in
the file are assumed to be there on purpose — often because they appear in the repository's own
projects — so when in doubt between deleting and moving, move. Every DELETE is listed individually in
the final summary with its reason.

Correct factual errors before making scope decisions. Apply this topic's inbox entries through the same classification and clear every processed entry. Apply each open gap from `verify-{LEVEL}.md` the same way — judge it against the standard, add or discard it, and say which in the summary; a gap the gate raised is a proposal, never a pre-approved item.

## Step 3 — Draft the selected level

The orchestrator is the only repository editor.

Write `TARGET_FILE`, move reclassified material to the correct level file, and route other-topic proposals to the inbox.

Apply the standard's item format, topic ownership, level definitions, and qualitative stopping rule. Never add or remove an item to satisfy a numeric count.

Before closing the draft, run an adversarial pass. Stop when it yields only duplicates, different-level material, another topic's ownership, or unjustified specialisation.

## Step 4 — Cold final review

Dispatch two cold reviewers after the draft exists.

*In the verify-gap fast path, dispatch one scoped reviewer instead (see Run scope).*

### Reviewer A — level calibration

Reads the three final topic coverage files, target, evidence, and standard. Returns only:

- missing selected-level requirements;
- items placed too low or too high;
- cross-level contradictions or duplicates;
- factual errors;
- selected-file item count as information only, never as a verdict.

### Reviewer B — quality and ownership

Reads all three topic level files, the relevant global mirrors, targeted owner files, and standard. Returns only:

- grouped or dictionary-definition items;
- missing important confusable pairs;
- duplicate or misplaced ownership;
- unclear section structure;
- confirmation: `N items reviewed`.

Both reports must state the selected file's line count and that it was read to EOF. Re-dispatch a failed reviewer once. Apply accepted findings, then repeat factual and mechanical checks.

Both reviewers judge scope only from the target in `_shared-context.md`, current market evidence,
ordinary fundamentals, and the standard's level definitions. A concept's presence in `ROADMAP.md`,
notes, exercises, projects, or plans is never evidence that it belongs at the selected level.

## Step 5 — Rebuild and validate the level mirror

Rebuild only `## {TOPIC}` in `GLOBAL_MIRROR` from `TARGET_FILE`:

- topic `##` headings become `###`;
- bullets and order remain identical;
- introduction appears once.

Validate:

1. local/mirror bullet text and order match;
2. local/mirror headings match;
3. expected top-level topics remain exactly once;
4. no checkbox, numbered coverage item, or fenced code exists;
5. no exact duplicate exists;
6. no normalized concept occurs in more than one of the three level files;
7. the selected file contains no obvious other-topic section;
8. `git diff --check` passes and the complete declared diff is inspected.
9. If `NOTES_PLAN` exists, recalculate its stored coverage SHA-256. A mismatch is the expected
   automatic stale signal: report that `notes-plan-prompt` must run before another note can be built.

## Step 6 — Update mode

Dry run never writes coverage artifacts, but its self-report and `dry-run` tracker outcome are still
committed as execution evidence.

In update mode:

1. Commit changed topic scope files and the selected global mirror atomically. When `verify-{LEVEL}.md`
   supplied gaps, blank its `## Open gaps` to `*(none)*` and set `Verdict: superseded` in the same
   commit, so no run re-proposes a consumed gap; the changed coverage bytes also stale the gate's stored
   SHA, so `coverage-verify` should be re-run — `notes-plan` records the stale gate but is not blocked
   by it.
2. Commit inbox routing separately only when another topic receives proposals.
3. Before every add and commit, inspect status and stage only declared paths.
4. Write the pipeline self-report.
5. Update the run tracker cell for the topic and level.
6. Commit self-report and tracker together.
7. Verify both commits with `git show --stat`.

For step 4, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in full. Its
declared report path is `_internal/_last-run-report-coverage-prompt.md`; update the selected
Coverage J/M/S cell in `_internal/_run-tracker.md`.

## Final summary

Report:

- branch, mode, topic, and level;
- run scope (full recalibration or verify-gap fast path);
- progression-gate state;
- selected file lines/items before and after;
- all whole-file EOF confirmations;
- kept, moved down/up, moved to senior, deleted, corrected, and routed counts;
- market analyst and reviewer completion;
- qualitative stopping-rule result;
- mirror parity;
- notes-plan state (`missing`, `current`, or `stale`);
- files and commits;
- unresolved risks or `none`.

Do not finish while a plan item remains incomplete.
