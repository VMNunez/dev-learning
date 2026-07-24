# Coverage Prompt

Create or recalibrate one topic at one professional level.

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

- `TARGET_FILE = {NOTES_PATH}coverage-{LEVEL}.md`
- `SIBLING_FILES = the other two files among coverage-junior.md, coverage-middle.md, and coverage-senior.md`
- `GLOBAL_MIRROR = notes/coverage-{LEVEL}.md`

## Required sources

Count lines before every whole-file read and read to EOF:

1. `_internal/_coverage-standard.md`
2. `_session-rules.md`
3. `_shared-context.md`
4. `ROADMAP.md`
5. `_job-market-evidence.md`
6. all three topic scope files when present
7. this topic's heading in `_internal/_cross-topic-inbox.md`
8. the previous coverage-prompt self-report

For Spring Boot, also inspect Java coverage headings and `notes/spring-boot/layer-reference.md`.

## Step 0 — Guards and plan

1. Stop on `main`.
2. Surface any unresolved previous recommendation.
3. Create a plan containing every step, validation, mirror rebuild, self-report, tracker update, and update-mode commits.
4. Run `git status --short` and preserve unrelated changes.
5. Confirm one topic only.
6. For middle, inspect junior progression evidence. For senior, inspect both junior and middle
   progression evidence. Mapping a later level is allowed before consolidation; downstream authoring is not.
   State the current gate explicitly.

## Step 1 — Establish the level floor

Dispatch one cold market analyst. It receives only the target role, selected level, standard, relevant evidence, and this mandate:

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

Read all three topic files to EOF and classify every existing item:

- **KEEP HERE** — belongs to the selected level and topic.
- **MOVE DOWN** — belongs in junior while reviewing middle.
- **MOVE UP** — belongs in middle while reviewing junior.
- **MOVE TO SENIOR** — requires senior-level ownership, production scale, platform depth, or justified specialisation.
- **DELETE** — incorrect, obsolete, duplicated, non-conceptual, or irrelevant.
- **ROUTE** — belongs to another topic; keep only a concrete implementation twin when justified.

Correct factual errors before making scope decisions. Apply this topic's inbox entries through the same classification and clear every processed entry.

## Step 3 — Draft the selected level

The orchestrator is the only repository editor.

Write `TARGET_FILE`, move reclassified material to the correct level file, and route other-topic proposals to the inbox.

Apply the standard's item format, topic ownership, level definitions, and qualitative stopping rule. Never add or remove an item to satisfy a numeric count.

Before closing the draft, run an adversarial pass. Stop when it yields only duplicates, different-level material, another topic's ownership, or unjustified specialisation.

## Step 4 — Cold final review

Dispatch two cold reviewers after the draft exists.

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

## Step 6 — Update mode

Dry run never commits or updates the tracker.

In update mode:

1. Commit changed topic scope files and the selected global mirror atomically.
2. Commit inbox routing separately only when another topic receives proposals.
3. Before every add and commit, inspect status and stage only declared paths.
4. Write the pipeline self-report.
5. Update the run tracker cell for the topic and level.
6. Commit self-report and tracker together.
7. Verify both commits with `git show --stat`.

## Final summary

Report:

- branch, mode, topic, and level;
- progression-gate state;
- selected file lines/items before and after;
- all whole-file EOF confirmations;
- kept, moved down/up, moved to senior, deleted, corrected, and routed counts;
- market analyst and reviewer completion;
- qualitative stopping-rule result;
- mirror parity;
- files and commits;
- unresolved risks or `none`.

Do not finish while a plan item remains incomplete.
