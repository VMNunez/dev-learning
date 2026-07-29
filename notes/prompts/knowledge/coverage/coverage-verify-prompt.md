# Coverage Verify Prompt

Verify that one topic's already-generated coverage at one level is complete for the job target, before
`notes-plan` turns it into a study map. This prompt is **read-only over coverage**: it never edits a
coverage file. It emits a verdict and a durable findings file; `coverage-prompt` consumes the findings
on its next update run.

> **▶ Run first:** `coverage-prompt` for this exact topic and level — this gate fingerprints that
> coverage and refuses to proceed when the global mirror differs.

## Configuration

```text
TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security]
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
- `GLOBAL_MIRROR = notes/coverage/{LEVEL}.md`
- `FINDINGS = notes/{topic}/coverage/verify-{LEVEL}.md`

## Required sources

Count lines before every whole-file read and read to EOF:

1. `_internal/_coverage-standard.md`
2. `_session-rules.md`
3. `_shared-context.md`
4. `ROADMAP.md`
5. `_internal/_job-market-evidence.md`
6. `COVERAGE` and both `SIBLINGS`
7. the previous coverage-verify self-report

## Step 0 — Guards and run-start check

1. Stop on `main`.
2. Read this prompt's `_internal/_last-run-report-coverage-verify.md` if it exists; surface an `open`
   finding in one line and leave it alone.
3. Stop if `COVERAGE` is missing or differs from the `## {TOPIC}` section in `GLOBAL_MIRROR` — a stale
   mirror means `coverage-prompt` has not finished; there is nothing trustworthy to verify.
4. Compute the lowercase SHA-256 digest of the exact UTF-8 bytes of `COVERAGE`. This is what the
   findings file stamps, so `notes-plan` can tell a verified verdict from a stale one.
5. For middle, state that the junior gate must be consolidated; for senior, junior and middle. The gate
   controls study order, not whether this verification may run.
6. Run `git status --short` and preserve unrelated changes.
7. Plan every step, the reviewer dispatch, the findings write, the self-report, and the commit.

## Step 1 — Cold completeness review

Dispatch one cold read-only reviewer. It receives the target role and level, the standard, the selected
coverage file, both siblings, and relevant market evidence. Do not pass it size, freshness, or
under/over-coverage priors — an orchestrator-supplied hint contaminates the adversarial pass. Its
mandate:

> Judge whether this file, mastered alone, covers the realistic expectations of this topic at this level
> for the stated job target. Report only concepts that are genuinely missing at this level and owned by
> this topic. Apply, at minimum, these lenses:
>
> - **Market floor** — recurring requirements in target postings for this level that no item maps to.
> - **Mechanism layer** (language topics — Java, JavaScript, TypeScript) — the predict-the-output and
>   confusable-pair fundamentals a quickfire screening tests but a posting never lists.
> - **Inheriting-code surface** (stack topics — Angular, Angular Material, Spring Boot) — what reading
>   and modifying a codebase you did not write demands, which postings assume rather than state.
> - **Objective fit** — for middle/senior, flag generic-seniority items with no bearing on the target
>   Angular + Java consultancy path; they are not this candidate's gaps.
>
> Do not report items already present, items owned by a sibling level, items owned by another topic, or
> unjustified specialisation. For each real gap return: the proposed one-sentence item, the section it
> would join, and one line on why not knowing it would materially weaken performance at this level.

Acceptance proof: the reviewer states `COVERAGE` line count and that it was read to EOF, names which
lenses applied to this topic shape, and confirms it reported only same-topic, same-level gaps.
Re-dispatch once if the proof is missing.

## Step 2 — Verify each finding

The orchestrator verifies every reported gap against the standard and **does not edit coverage**. Reject
a finding when the concept is already present (grep the coverage file), belongs to a sibling level or
another topic, restates an existing bullet, or is unjustified specialisation. What survives is the
verified gap list. Run one adversarial pass of your own; add only what the reviewer missed and the
standard supports.

## Step 3 — Write the findings and the verdict

`Verdict = complete` when no verified gap remains; otherwise `Verdict = gaps`.

In update mode, write `FINDINGS` in this exact shape:

```markdown
# Coverage Verify — {Topic} {Level}

Verdict: complete | gaps
Coverage SHA-256: <64 lowercase hexadecimal characters>
Verified: YYYY-MM-DD

## Open gaps

- concept — one concise sentence naming the mechanism or level signal [proposed section]
```

When the verdict is `complete`, the `## Open gaps` body is exactly `*(none)*`. The list is written in the
standard item format so `coverage-prompt` can judge each entry like any other proposed gap.

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

- `Verdict = complete` (SHA matching current coverage) means `notes-plan` plans against verified coverage.
- `Verdict = gaps`, a missing verdict, or a stale SHA does not stop `notes-plan` — the plan proceeds and
  records the degraded gate state in its report. Feed `FINDINGS` to `coverage-prompt` in update mode: it
  judges each open gap through its own Step 2 classification and adds or discards it. That changes the
  coverage bytes, so this gate's stored SHA no longer matches — re-run coverage-verify, and the loop
  closes when it returns `complete`.

## Final summary

Report branch, mode, topic, level, progression-gate state, `COVERAGE` line count with EOF confirmation,
the coverage SHA, reviewer completion and lenses applied, verified-gap count, the verdict, the findings
path (or `dry-run`), and unresolved risks or `none`. Do not finish while a plan item remains incomplete.
