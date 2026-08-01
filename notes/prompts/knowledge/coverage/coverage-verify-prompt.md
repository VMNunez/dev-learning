# Coverage Verify Prompt

Verify that one topic's already-generated coverage at one level is complete for the job target, before
`notes-plan` turns it into a study map. Middle verification also protects junior prerequisite
integrity; senior verification protects both junior and middle. This prompt is **read-only over
coverage**: it never edits a coverage file. It emits a verdict and a durable findings file;
`coverage-prompt` consumes the findings on its next update run.

> **▶ Run first:** `coverage-prompt` for this exact topic and level — this gate fingerprints that
> coverage and refuses to proceed when the global mirror differs.

## Configuration

```text
TOPIC = [one registered topic from `_internal/_topic-ownership.md`]
LEVEL = [junior | middle | senior]
MODE  = [update | dry-run]
```

One execution handles exactly one topic and one level. `TOPIC = all` is unsupported.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use canonical roles and reasoning tiers from the runtime standard. The completeness reviewer is cold
and read-only. If it cannot be dispatched, stop; there is no single-agent fallback and the gate never
passes a topic it did not actually review.

## Resolve paths

Derive the topic slug by lowercasing and replacing spaces with hyphens.

- `COVERAGE = notes/{topic}/coverage/{LEVEL}.md`
- `SIBLINGS = the other two files in notes/{topic}/coverage/`
- `PREREQUISITES = none for junior; junior for middle; junior and middle for senior`
- `GLOBAL_MIRRORS = notes/coverage/{level}.md for LEVEL and every PREREQUISITES level`
- `FINDINGS = notes/{topic}/coverage/verify-{LEVEL}.md`

## Required sources

Count lines before every whole-file read and read to EOF:

1. `_internal/_coverage-standard.md`
2. `_session-rules.md`
3. `_shared-context.md`
4. `_internal/_job-market-evidence.md`
5. `COVERAGE` and both `SIBLINGS`
6. the previous coverage-verify self-report

`ROADMAP.md`, notes, practice plans, project plans, and project code are downstream artifacts. They
must not supply proposed gaps or raise the selected-level floor.

## Step 0 — Guards and run-start check

1. Stop on `main`.
2. Read this prompt's `_internal/_last-run-report-coverage-verify.md` if it exists; surface an `open`
   finding in one line and leave it alone.
3. Stop if `COVERAGE` or a `PREREQUISITES` file is missing, or if any of them differs from its
   `## {TOPIC}` section in the matching `GLOBAL_MIRRORS` file. Compare canonical content rather than
   raw text: topic-file `##` section headings correspond to `###` headings inside the mirror's topic
   section; ignore only that expected heading-depth difference. Any other heading, bullet, or ordering
   difference means a mirror is stale, `coverage-prompt` has not finished, and there is nothing
   trustworthy to verify.
4. Compute the lowercase SHA-256 digest of `COVERAGE`'s **scope bytes** — its exact UTF-8 bytes with every
   trailing ` ✅ NN-slug — {evidence}` evidence marker stripped, per the canonical command in "Evidence markers" in
   `_coverage-standard.md`. This is what the
   findings file stamps, so `notes-plan` can tell a verified verdict from a stale one.
   Compute the same digest for every `PREREQUISITES` file. These additional fingerprints prevent a
   prerequisite finding from being consumed after the earlier-level scope it was judged against has
   changed.
5. For middle, state that the junior gate must be consolidated; for senior, junior and middle. The gate
   controls study order, not whether this verification may run.
6. Run `git status --short` and preserve unrelated changes.
7. Plan every step, the reviewer dispatch, the findings write, the self-report, and the commit.

## Step 1 — Cold completeness review

Dispatch one cold read-only reviewer. It receives the target role and level, the standard, the selected
coverage file, both siblings, `_shared-context.md`, and relevant market evidence. Do not pass it size, freshness, or
under/over-coverage priors — an orchestrator-supplied hint contaminates the adversarial pass. Its
mandate:

> Judge whether the selected file, mastered together with its earlier levels, covers the realistic
> expectations of this topic at this level for the stated job target. Report concepts genuinely
> missing from the selected level and any material prerequisite the selected scope assumes but the
> required earlier level lacks. Assign every gap to exactly one target level. Apply, at minimum, these
> lenses:
>
> - **Market floor** — recurring requirements in target postings for this level that no item maps to.
> - **Mechanism layer** (language topics — Java, JavaScript, TypeScript) — the predict-the-output and
>   confusable-pair fundamentals a quickfire screening tests but a posting never lists.
> - **Inheriting-code surface** (stack topics — Angular, Angular Material, Spring Boot) — what reading
>   and modifying a codebase you did not write demands, which postings assume rather than state.
> - **Objective fit** — for middle/senior, flag generic-seniority items with no bearing on the target
>   Angular + Java consultancy path; they are not this candidate's gaps.
> - **Prerequisite integrity** — for middle, identify junior foundations the middle scope materially
>   depends on but junior lacks; for senior, do the same across junior and middle. This is not a fresh
>   independent market audit of the earlier levels: report only gaps exposed by the selected level's
>   mechanisms, decisions, or responsibilities.
>
> Do not report items already present in any level, items owned by another topic, or unjustified
> specialisation. For each real gap return: its target level, the proposed one-sentence item, the
> section it would join, and one line on why not knowing it would materially weaken performance at the
> selected level or break its prerequisite chain.
> Do not inspect or infer requirements from `ROADMAP.md`, notes, exercises, projects, or plans. Those
> artifacts consume coverage; they do not define it.

Acceptance proof: the reviewer states the line count and EOF confirmation for `COVERAGE` and every
`PREREQUISITES` file, names which lenses applied to this topic shape, and confirms every gap has one
same-topic target level no higher than `LEVEL`.
Re-dispatch once if the proof is missing.

## Step 2 — Verify each finding

The orchestrator verifies every reported gap against the standard and **does not edit coverage**. Grep
all three topic files. Reject a finding when the concept is already present, belongs to another topic,
restates an existing bullet, targets a level above `LEVEL`, or is unjustified specialisation. Correct
the target level when the concept is real but misclassified; never discard a real gap merely because
it belongs to an earlier prerequisite. What survives is the verified gap list, grouped by target
level. Run one adversarial pass of your own; add only what the reviewer missed and the standard
supports, including prerequisite-integrity gaps exposed by the selected level.

## Step 3 — Write the findings and the verdict

`Verdict = complete` when no verified gap remains; otherwise `Verdict = gaps`.

In update mode, write `FINDINGS` in this exact shape:

```markdown
# Coverage Verify — {Topic} {Level}

Verdict: complete | gaps
Coverage SHA-256: <64 lowercase hexadecimal characters>
Junior prerequisite SHA-256: <64 lowercase hexadecimal characters> | n/a
Middle prerequisite SHA-256: <64 lowercase hexadecimal characters> | n/a
Verified: YYYY-MM-DD

## Open gaps

- [junior | middle | senior] concept — one concise sentence naming the mechanism or level signal [proposed section]
```

`Coverage SHA-256` always fingerprints the selected file for compatibility with `notes-plan`.
Prerequisite fields fingerprint only levels earlier than `LEVEL`; every non-applicable field is `n/a`.
When the verdict is `complete`, the `## Open gaps` body is exactly `*(none)*`. The level prefix is
findings metadata, not part of the proposed coverage bullet; `coverage-prompt` removes it before
judging the item.

Dry run prints the verdict and gap list without writing `FINDINGS`.

## Step 4 — Update mode

1. Run `git status --short`; stage only `FINDINGS`.
2. Commit: `docs(coverage): verify {topic} {level} coverage — {complete | N gaps}`.
3. Verify with `git show --stat`.

Dry run makes no findings commit but still writes and commits its self-report and a `dry-run` tracker
outcome as execution evidence.

## Step 5 — Self-report

Read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in full. Its declared report path
is `_internal/_last-run-report-coverage-verify.md`; update the selected Verify J/M/S cell in
`_internal/_run-tracker.md`.

## What happens next

This gate is advisory, not blocking. It never stops `notes-plan` from running; it tells the run how much
of the coverage it can trust.

- `Verdict = complete` (selected SHA matching current coverage) means `notes-plan` plans against
  selected-level coverage whose cumulative prerequisite chain produced no exposed gap.
- `Verdict = gaps`, a missing verdict, or a stale SHA does not stop `notes-plan` — the plan proceeds and
  records the degraded gate state in its report. Feed `FINDINGS` to `coverage-prompt` in update mode: it
  judges each open gap through its own Step 2 classification and adds or discards it. Once that update
  marks the findings `superseded`, the review cycle is complete and the next step is `notes-plan`.
  Re-running `coverage-verify` until it returns zero gaps is never required. Victor may start a fresh
  reassessment later when useful; that is a new optional pass, not continuation of the current loop.

## Final summary

Report branch, mode, topic, level, progression-gate state, every reviewed coverage file's line count
with EOF confirmation, selected and prerequisite SHAs, reviewer completion and lenses applied,
verified-gap count by target level, the verdict, the findings path (or `dry-run`), and unresolved risks
or `none`. Do not finish while a plan item remains incomplete.
