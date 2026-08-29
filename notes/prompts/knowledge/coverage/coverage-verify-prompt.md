# Coverage Verify Prompt

Verify that one topic's already-generated coverage at one level is complete for the job target, before
`notes-plan` turns it into a study map. Middle verification also protects junior prerequisite
integrity; senior verification protects both junior and middle. This prompt is **read-only over
coverage**: it never edits a coverage file. It emits a verdict, a durable findings file, and — when a
proposed gap turns out to belong to another topic — one routed proposal in
`_internal/_cross-topic-inbox.md`, which is a handoff file and not coverage.
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
- `TOPIC_BOUNDARY = this topic's row in _internal/_topic-ownership.md`
- `ADJACENT_TOPICS = the complete comparison set declared by TOPIC_BOUNDARY, taken as their registry
  rows only — this prompt never opens an adjacent topic's coverage files`
- `PREREQUISITES = none for junior; junior for middle; junior and middle for senior`
- `GLOBAL_MIRRORS = notes/coverage/{level}.md for LEVEL and every PREREQUISITES level`
- `FINDINGS = notes/{topic}/coverage/verify-{LEVEL}.md`
- `NOTES_PLANS = all existing notes-plan-{junior|middle|senior}.md files for this topic`
- `LOCKED_BULLETS = [x] Coverage concepts assigned to Status: refined entries in NOTES_PLANS, matched
  by exact scope text after stripping the checkbox and every trailing marker — project and drill alike,
  both defined in "Evidence markers" in the standard; [ ] concepts are not locked`

## Required sources

Count lines before every whole-file read and read to EOF:

1. `_internal/_coverage-standard.md`
2. `notes/prompts/_internal/_session-rules.md`
3. `notes/prompts/_internal/_shared-context.md`
4. `notes/prompts/_internal/_job-market-evidence.md`
5. `_internal/_topic-ownership.md` — this run demands an ownership verdict twice (the reviewer mandate's
   `items owned by another topic`, and Step 2's rejection test), and the rows are the only authority for
   either: `TOPIC_BOUNDARY`'s own `Owns` and `Excludes / delegates`, read against the `Owns` cells of
   `ADJACENT_TOPICS`. `Excludes / delegates` names only the **nearest** tempting overlap, so it is where
   the answer usually is and never where the test stops. `_coverage-standard.md` names this file as the
   boundary registry but states the boundaries themselves only "in particular", so the standard alone
   leaves every pair it does not list undecided.
6. `COVERAGE` and both `SIBLINGS`
7. `NOTES_PLANS` when present, to identify locked bullets
8. the previous coverage-verify self-report

`ROADMAP.md`, notes, practice plans, project plans, and project code are downstream artifacts. They
must not supply proposed gaps or raise the selected-level floor.

## Step 0 — Guards and run-start check

1. Stop on `main`.
2. Execute the run-start decision table in `_pipeline-self-report.md` against this prompt's
   `_internal/_last-run-report-coverage-verify.md` if it exists; never restate the shared `Status:`
   meanings here.
3. Stop if `COVERAGE` or a `PREREQUISITES` file is missing, or if any of them differs from its
   `## {TOPIC}` section in the matching `GLOBAL_MIRRORS` file. Compare canonical content rather than
   raw text: topic-file `##` section headings correspond to `###` headings inside the mirror's topic
   section; ignore only that expected heading-depth difference. Any other heading, bullet, or ordering
   difference means a mirror is stale, `coverage-prompt` has not finished, and there is nothing
   trustworthy to verify.
4. Compute the lowercase SHA-256 digest of `COVERAGE`'s **scope bytes** using the canonical command in
   "Evidence markers" in `_coverage-standard.md`, which alone defines the byte normalisation and marker
   stripping. Never reproduce or approximate that definition locally. This is what the findings file stamps, so `coverage-prompt` can tell
   whether its verify-gap fast path is judging today's scope. Fingerprint only `COVERAGE`; earlier
   levels are not fingerprinted.
5. For middle, state that the junior gate must be consolidated; for senior, junior and middle. The gate
   controls study order, not whether this verification may run.
6. Run `git status --short` and preserve unrelated changes.
7. Plan every step, the reviewer dispatch, the findings write, the self-report, and the commit.

## Step 1 — Cold completeness review

Dispatch one cold read-only reviewer. It receives the target role and level, the standard, the selected
coverage file, both siblings, `_shared-context.md`, relevant market evidence, and the `TOPIC_BOUNDARY` +
`ADJACENT_TOPICS` rows. Do not pass it size, freshness, or
under/over-coverage priors — an orchestrator-supplied hint contaminates the adversarial pass. A boundary
row is not such a hint: it states which concept families this topic owns, never how complete its coverage
is. Those rows are a **boundary reference for the ownership exclusion below and nothing more** — they do
not widen the read set to an adjacent topic's coverage files. The registry declares the adjacent
*topics* the mandatory comparison set for full recalibration and cold ownership review, neither of which
this prompt runs; handing over their rows is that comparison at row granularity. Its
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
> Do not report **as gaps** items already present in any level, items an adjacent topic owns under the
> `TOPIC_BOUNDARY` and `ADJACENT_TOPICS` rows, or unjustified specialisation. For each real gap return: its target level, the proposed one-sentence item, the
> section it would join, and one line on why not knowing it would materially weaken performance at the
> selected level or break its prerequisite chain.
>
> An item the target role genuinely needs at this level but an **adjacent topic owns** is not silently
> dropped either. Return it in a separate `ownership referrals` list — the owning topic from the
> `ADJACENT_TOPICS` rows, the proposed one-sentence item, and its proposed level. A referral is not a
> gap: it never enters the gap list, it never carries a target level in this topic, and the acceptance
> proof's confirmation that every gap has one same-topic target level does not reach it. Items already
> present in any level and unjustified specialisation are still simply dropped.
> Do not inspect or infer requirements from `ROADMAP.md`, notes, exercises, projects, or plans. Those
> artifacts consume coverage; they do not define it.

The reviewer may flag that current calibration would place a locked bullet elsewhere, but labels it
`locked placement conflict`, not an open gap. It never proposes moving, rewriting, deleting, routing,
or duplicating that bullet. A bullet assigned to `pending` or `complete`, or marked `[ ]` as a refined
entry's pending addition, remains normally recalibratable; only `[x]` under `Status: refined` creates
the lock.

Acceptance proof: the reviewer states the line count and EOF confirmation for `COVERAGE` and every
`PREREQUISITES` file, names which lenses applied to this topic shape, and confirms every gap has one
same-topic target level no higher than `LEVEL` — a count of `ownership referrals`, listed apart, is
part of the proof and never part of that confirmation.
Re-dispatch once if the proof is missing.

## Step 2 — Verify each finding

The orchestrator verifies every reported gap against the standard and **does not edit coverage**. Grep
all three topic files. Reject a finding when the concept is already present, belongs to another topic
under the `TOPIC_BOUNDARY` and `ADJACENT_TOPICS` rows, restates an existing bullet, targets a level above `LEVEL`, or is unjustified
specialisation. The grep settles **presence**; it cannot settle **ownership**, because the files it
reaches are this topic's — that verdict comes from the registry row and is never asserted without it. Correct
the target level when the concept is real but misclassified; never discard a real gap merely because
it belongs to an earlier prerequisite. What survives is the verified gap list, grouped by target
level. Run one adversarial pass of your own; add only what the reviewer missed and the standard
supports, including prerequisite-integrity gaps exposed by the selected level.

**A concept this run judges another topic's is routed, not discarded.** The `## Topic isolation` section
of `_coverage-standard.md` requires any run that discovers another topic's concept to route a proposal to
`_internal/_cross-topic-inbox.md`; that file's own contract defines the entry and the writer set, and
neither is restated here. Write it under the owning topic's heading — never into a coverage file, and
never into that topic's coverage, which this run does not open. Two channels feed it, and both are
verified here before anything is written: the reviewer's `ownership referrals` list, and any finding
**this step rejects on ownership**. Confirm each against the `TOPIC_BOUNDARY` and `ADJACENT_TOPICS`
rows exactly as the rejection test does — a referral is the reviewer's claim, not a verdict — and drop
the ones the registry does not support.

Three boundaries hold the routing. It fires only when ownership is the **sole** reason the concept is
not this topic's gap: one also rejected as already present in any level of this topic, as a restatement
of an existing bullet, as targeting a level above `LEVEL`, or as unjustified specialisation is dropped
exactly as before, because routing a bad item to another topic is worse than dropping it. It never
enters `FINDINGS` and never changes `Verdict`, for the reason a locked placement conflict does not — the
concept is absent from this topic's coverage by design, so it is not a gap in what this run verifies.
And it is a write only: this run never reads, judges or clears a pending entry under its own heading,
which belongs to the owning `coverage-prompt` run.

Record locked placement conflicts separately from actionable gaps. They do not change `Verdict` and
must never be converted into a duplicate proposal at another level.

## Step 3 — Write the findings and the verdict

`Verdict = complete` when no verified gap remains; otherwise `Verdict = gaps`.

In update mode, write `FINDINGS` in this exact shape:

```markdown
# Coverage Verify — {Topic} {Level}

Verdict: complete | gaps
Coverage SHA-256: <64 lowercase hexadecimal characters>
Verified: YYYY-MM-DD
Superseded by Coverage SHA-256: <digest>   # only when Verdict is superseded

## Open gaps

- [junior | middle | senior] concept — one concise sentence naming the mechanism or level signal [proposed section]

## Locked placement conflicts

- [current level] exact locked coverage bullet — preferred placement and evidence, no edit permitted
```

`Coverage SHA-256` always fingerprints the selected file. It is the only fingerprint this prompt
writes: earlier levels carry no field of their own.
This prompt only ever writes `complete` or `gaps`. The schema's third verdict, `superseded`, and the
`Superseded by Coverage SHA-256` line are written **only** by `coverage-prompt` when it consumes these
gaps — they are declared here because this file's shape is declared here, and a state no schema admits
is a state the next run has to guess at. A later verification of the same level overwrites the whole
file and returns it to `complete` or `gaps`.
When the verdict is `complete`, the `## Open gaps` body is exactly `*(none)*`. The level prefix is
findings metadata, not part of the proposed coverage bullet; `coverage-prompt` removes it before
judging the item.
When no conflict exists, `## Locked placement conflicts` is exactly `*(none)*`.

Dry run prints the verdict, the gap list, and every proposal it would route, and writes neither
`FINDINGS` nor the inbox.

## Step 4 — Update mode

1. Commit `FINDINGS`: `docs(coverage): verify {topic} {level} coverage — {complete | N gaps}`.
2. Commit inbox routing separately, and only when another topic receives proposals:
   `docs(coverage): route {n} proposal(s) from {topic} {level} verify`. Never one commit for both — the
   two files are read by different runs.
3. Before every add and commit, inspect `git status --short` and stage only the declared paths: this
   run declares `FINDINGS`, `_internal/_cross-topic-inbox.md`, and its self-report and tracker cell,
   and nothing else. Preserve unrelated changes.
4. Verify each commit with `git show --stat`.

Dry run makes no findings or inbox commit but still writes and commits its self-report and a `dry-run`
tracker outcome as execution evidence.

## Step 5 — Self-report

Read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in full. Its declared report path
is `_internal/_last-run-report-coverage-verify.md`; update the selected Verify J/M/S cell in
`_internal/_run-tracker.md`.

## What happens next

This gate is advisory, not blocking. It never stops `notes-plan` from running; it tells the run how much
of the coverage it can trust.

**This section is handoff information, not authorization to execute another workflow.** The current
run ends after Step 5 and the final summary. Never invoke `coverage-prompt`, `notes-plan`, or any other
runnable prompt from `coverage-verify`; report the appropriate next command and wait for Victor to
launch it manually.

- `Verdict = complete` (selected SHA matching current coverage) means `notes-plan` plans against
  selected-level coverage whose cumulative prerequisite chain produced no exposed gap.
- `Verdict = gaps`, a missing verdict, or a stale SHA does not stop `notes-plan` — the plan proceeds and
  records the degraded gate state in its report. The suggested manual next command is
  `coverage-prompt` in update mode: when Victor launches it, that separate run judges each open gap
  through its own Step 2 classification and adds or discards it. A gap this run targeted at an **earlier**
  level is reachable from both sides: a `coverage-prompt` run at the verified level adds it to that
  earlier file through its prerequisite-integrity path, and a run at the earlier level reads it out of
  this findings file as a sibling gap. Neither one strands it. Once that update marks the findings
  `superseded`, the review cycle is complete and the suggested manual next step is `notes-plan`.
  Re-running `coverage-verify` until it returns zero gaps is never required. Victor may start a fresh
  reassessment later when useful; that is a new optional pass, not continuation of the current loop.

## Final summary

Report branch, mode, topic, level, progression-gate state, the ownership boundary applied, every reviewed
coverage file's line count
with EOF confirmation, the selected SHA, reviewer completion and lenses applied,
verified-gap count by target level, the verdict, the findings path (or `dry-run`), every proposal routed
to the inbox with its receiving topic and every ownership referral the registry did not support (or
`none routed`), and unresolved risks
or `none`, including every locked placement conflict. Do not finish while a plan item remains incomplete.
