# Notes Plan Prompt

Create or reconcile the persistent study-file plan for one topic and one professional level.
This prompt plans only. It never authors, reviews, translates, or commits study-note prose.

> **▶ Run first:** `coverage-prompt` for this exact topic and level — the plan fingerprints that
> coverage and refuses to proceed when the global mirror differs.

## Configuration

```text
TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
LEVEL = [junior | middle | senior]
MODE = [update | dry-run]
```

One execution handles exactly one topic and one level. `TOPIC = all` is unsupported.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use canonical roles and reasoning tiers from the runtime standard. Any delegated analysis is
read-only. If a required role cannot be dispatched, stop unless its instruction explicitly permits
a local fallback.

## Paths

Derive the topic slug by lowercasing and replacing spaces with hyphens.

- `COVERAGE = notes/{topic}/coverage/{LEVEL}.md`
- `PLAN = notes/{topic}/coverage/notes-plan-{LEVEL}.md`
- `EN_DIR = notes/{topic}/{LEVEL}/en/`
- `ES_DIR = notes/{topic}/{LEVEL}/es/`
- `GLOBAL_MIRROR = notes/coverage/{LEVEL}.md`

The plan is a committed source of truth. It is not a temporary worklist.

## Guards

1. Read the active adapter, `_session-rules.md`, `_note-quality-standard.md`, and all three topic
   coverage files.
2. Stop on `main`.
3. Stop if `COVERAGE` is missing or differs from the topic section in `GLOBAL_MIRROR`.
4. For `middle`, require the junior progression gate to be closed. For `senior`, require junior and
   middle to be closed. Planning later levels is blocked just like authoring them.
5. Preserve unrelated working-tree changes.

## Coverage fingerprint

Calculate the lowercase SHA-256 digest of the exact UTF-8 bytes of `COVERAGE`.

The plan stores it as:

```text
Coverage SHA-256: <64 lowercase hexadecimal characters>
```

`notes-audit` independently recalculates this value. A mismatch means the plan is stale.

## Planning algorithm

1. Read every coverage bullet and preserve its exact text.
2. Inspect existing note filenames and headings in `EN_DIR` and `ES_DIR`. Do not quality-audit prose.
3. Build a gradual study sequence. Group concepts only when they form one coherent learning unit.
   There is no target or maximum number of files.
4. Assign every selected-level coverage bullet to exactly one entry. Never paraphrase a coverage
   bullet in the assignment list.
5. Do not assign bullets from either sibling level.
6. Prefer an existing English file when its topic matches the group. Otherwise allocate the next
   unused two-digit number. Numbering starts at `01` independently in every level.
7. An entry is:
   - `audit` when its English file already exists;
   - `create` when it does not.
8. Every new or existing entry begins `pending`, except an old `complete` entry may remain complete
   only when its English path, Spanish path, and exact assigned bullet set are unchanged and both
   files still exist.
9. Existing notes that cannot be justified by this level's coverage go under `## Unassigned existing
   notes`. They are never silently deleted or treated as required study files.
10. On reconciliation, report added, removed, regrouped, preserved-complete, and unassigned entries.

## Required plan format

```markdown
# Angular Junior Notes Plan

Plan status: current
Coverage: notes/angular/coverage/junior.md
Coverage SHA-256: <digest>
Generated: YYYY-MM-DD

## 01 — Components and templates

Status: pending
Action: audit
English: notes/angular/junior/en/01-components.md
Spanish: notes/angular/junior/es/01-componentes.md
Depends on: none

Coverage concepts:

- exact coverage bullet
- exact coverage bullet

Rationale: one concise explanation of why these concepts belong together.

## Unassigned existing notes

- path — concise reason it is not owned by this level plan
```

Rules:

- Entry headings are unique and ordered numerically.
- `Status` is exactly `pending` or `complete`.
- `Action` is exactly `create` or `audit`.
- Paths are repository-relative and remain inside the selected topic and level.
- `Depends on` contains `none` or earlier entry numbers only.
- A missing Spanish file does not change `Action`; the notes pipeline creates or synchronises it.
- No coverage bullet may be absent, duplicated, paraphrased, or assigned across levels.

## Update mode

Write only `PLAN`. Before staging and before committing, run `git status --short` and stage the exact
plan path only. Commit:

```text
docs(notes): plan {topic} {level} study files
```

Dry run prints the complete proposed plan and reconciliation summary without writing or committing.

After the plan commit, execute `_pipeline-self-report.md`: write
`_internal/_last-run-report-notes-plan.md`, update the selected `Plan J/M/S` tracker cell, recalculate
the matching Notes J/M/S summary as `complete entries / total entries`, and commit the report and
tracker together. Dry run does not write `PLAN`, but it still writes and commits its self-report plus
a `dry-run` tracker outcome without replacing the persisted denominator.

## Final report

Report topic, level, coverage fingerprint, entry count, concept count, create/audit counts,
preserved-complete count, unassigned existing notes, mirror parity, and commit or `dry-run`.
