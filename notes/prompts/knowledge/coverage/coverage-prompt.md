# Coverage Prompt

Use this prompt in a separate conversation to create or recalibrate the required junior coverage for
one topic. Coverage is a **minimum hiring floor**, not an exhaustive reference manual.

## Configuration

```text
TOPIC = [Angular | Angular Material | CSS | JavaScript | TypeScript | SQL | Java | Spring Boot | Architecture | Git | General | Security | all]
NOTES_PATH = [optional — derive from TOPIC when omitted]
MODE = [update | dry-run]
```

`TOPIC = all` follows `notes/prompts/_internal/_batch-mode.md`. Process one topic completely before
starting the next and stop after three topics or when the remaining context is no longer sufficient
for careful item-level decisions.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter (`AGENTS.md` in Codex)

Translate canonical roles and reasoning tiers through the active runtime:

- Use the runtime's planning facility; do not require a tool by a platform-specific name.
- Use the runtime's native whole-file reading and line-count facilities.
- Use portable commands for the current shell. Do not require Bash on Windows or PowerShell on Unix.
- Treat `deep`, `standard`, and `mechanical` as canonical reasoning tiers, not literal model IDs.
- Omit model overrides when the runtime does not expose a valid matching override.
- Subagents are read-only with respect to repository artifacts. They return bounded reports directly;
  do not require them to create scratchpad files.

If the required cold reviewers cannot be dispatched, stop. There is no single-agent fallback for the
market analyst or final reviewer.

## Required sources

Count lines before every whole-file read and read each selected file to EOF:

1. `notes/prompts/knowledge/coverage/_internal/_coverage-standard.md`
2. `notes/prompts/_internal/_session-rules.md`
3. `notes/prompts/_internal/_shared-context.md`
4. `ROADMAP.md`
5. `notes/prompts/_internal/_job-market-evidence.md`
6. `{NOTES_PATH}coverage.md`, if present
7. `{NOTES_PATH}future-learning.md`, if present
8. the `## {TOPIC}` section of
   `notes/prompts/knowledge/coverage/_internal/_cross-topic-inbox.md`

For Spring Boot, also inspect the Java coverage headings and
`notes/spring-boot/layer-reference.md`. Do not import Java language items into Spring Boot unless the
item names a concrete Spring/JPA/Jackson artefact or behaviour.

## Step 0 — Guards and plan

1. Run `git branch --show-current`. Stop on `main`.
2. Read the previous coverage-prompt self-report. Surface an unresolved `Status: open` recommendation.
3. Create a plan containing every step in this prompt, including validation, mirror rebuild,
   self-report, tracker update, and commits when `MODE = update`.
4. Run `git status --short`. Preserve unrelated changes.

## Step 1 — Establish the junior hiring floor

Dispatch one cold **market analyst** for `{TOPIC}`.

The analyst receives only the job target, `_coverage-standard.md`, the junior section of
`_job-market-evidence.md`, and this mandate:

> Identify the concepts whose absence could realistically filter a junior candidate for the current
> target role. Use current live web evidence when available and distinguish recurring requirements
> from rare or mid-level signals. Return at most 25 must-know concepts and at most 10 differentiators.
> Every concept must include its evidence or the reason it remains a fundamental interview question.
> Do not inspect the existing coverage and do not edit files.

Acceptance proof:

- confirms whether live search ran;
- identifies the target role read from the sources;
- separates recurring floor, fundamentals, and differentiators;
- does not use mid/senior postings to raise the junior floor.

Re-dispatch once if proof is missing.

## Step 2 — Read and classify the existing topic

Read `{NOTES_PATH}coverage.md` and `{NOTES_PATH}future-learning.md` to EOF.

Classify every existing coverage item:

- **KEEP — junior floor:** common screening requirement or foundational mechanism used constantly.
- **KEEP — differentiator:** low-frequency but cheap, practical knowledge that materially strengthens
  Victor's target profile, such as basic testing.
- **MOVE TO FUTURE:** useful after hire, implementation depth beyond recognition, production
  operations, framework/compiler internals, specialist performance work, or rare tooling.
- **DELETE:** incorrect, duplicated, obsolete, non-conceptual conduct, or unrelated to the target.
- **ROUTE:** belongs to another topic. Keep only this topic's concrete implementation twin.

Correct factual errors before making scope decisions. A polished false item is never retained.

Apply proposed cross-topic inbox entries through the same classification. Clear every processed entry
from this topic's inbox heading.

## Step 3 — Scope budget and stopping rule

The budget is a guardrail, not a quota:

- Core stack topics — Angular, Spring Boot, Java, SQL: normally **60–100 items**.
- Supporting language/style topics — TypeScript, JavaScript, CSS: normally **45–80 items**.
- Focused/cross-cutting topics — Angular Material, Architecture, Security, Git, General: normally
  **35–70 items**.

Exceed the upper bound only when every extra item maps to a recurring junior requirement or a named
fundamental that would realistically be tested. Record the justification in the final summary.

Stop adding items when all three conditions hold:

1. every recurring market requirement maps to at least one item;
2. the topic's ordinary junior fundamentals and high-value confusable pairs are covered;
3. a fresh adversarial pass produces only duplicates, post-junior depth, or another topic's ownership.

Do not use “could an interviewer ask this?” as the criterion. An interviewer can ask infinitely many
things. Use: **“Would not knowing this materially weaken Victor's junior candidacy now?”**

## Step 4 — Draft the final topic coverage

The orchestrator is the only repository editor.

Write:

- `{NOTES_PATH}coverage.md` — retained and corrected junior items;
- `{NOTES_PATH}future-learning.md` — useful deferred material, without duplicating coverage;
- routed proposals under the correct headings in `_cross-topic-inbox.md`.

Rules:

- one independently studyable concept per bullet;
- comparisons may name both sides in one bullet when the comparison itself is the concept;
- `concept — one concise sentence naming the interview signal or practical decision`;
- plain `- ` bullets; no checkboxes or fenced code;
- functional section names;
- normally 5–10 items per section; split above 12 and merge below 3;
- order by filtering risk;
- no conduct, project storytelling scripts, ticket workflow, or interview behaviour;
- no item may exist simultaneously in coverage and future-learning;
- neutral concept belongs to its neutral owner; framework topics keep only concrete implementation.

Topic boundaries:

- Security owns threat and defence concepts; Angular/Spring Boot own client/server implementation.
- General owns neutral HTTP, JSON, testing vocabulary, configuration, and basic Docker awareness.
- Architecture owns layer boundaries, DTO/entity separation, REST design decisions, coupling/cohesion,
  and junior-level SOLID.
- SQL owns database behaviour; Spring Boot owns JPA/Spring transaction implementation.
- Java owns language semantics; Spring Boot owns framework behaviour.
- JavaScript owns Promise semantics; Angular owns Observable/RxJS comparisons.
- CSS owns layout/cascade mechanics; Angular Material owns Material APIs, overlays, tokens, and
  component-specific behaviour.

## Step 5 — Cold adversarial review of the final artifact

Dispatch two cold reviewers **after the draft exists**.

### Reviewer A — junior calibration

Reads the final topic coverage, future-learning, job target, evidence, and standard. Returns only:

- missing junior filters;
- retained post-junior items;
- coverage/future contradictions;
- factual errors;
- item count and whether exceeding the budget is justified.

### Reviewer B — quality and ownership

Reads the final topic coverage, the section map of `notes/coverage.md`, targeted owner-topic sections,
and the standard. Returns only:

- grouped or dictionary-definition items;
- missing important confusable pairs;
- duplicate/misplaced ownership;
- sections outside the 3–12 structural range;
- confirmation: `N items reviewed`.

Acceptance requires both reports to state the topic file's line count and that it was read to EOF.
Re-dispatch a failed reviewer once.

Apply accepted findings, then re-run both mechanical and factual checks. Do not respond to a failed
review by expanding every possible edge case; keep the junior filter and scope budget authoritative.

## Step 6 — Rebuild and validate the combined mirror

Rebuild only the `## {TOPIC}` section of `notes/coverage.md` from the topic file:

- topic `##` headings become `###`;
- bullets and their order remain identical;
- the topic introduction remains present once.

Use a portable script or shell commands appropriate to the active runtime.

Validate mechanically:

1. local and mirrored bullet counts match;
2. local and mirrored bullet text/order match exactly;
3. local section headings and mirrored subsection headings match exactly;
4. `notes/coverage.md` still has exactly the expected top-level topic headings;
5. every section has 3–12 items;
6. no checkbox or fenced code exists;
7. no exact duplicate bullet exists within the topic;
8. no normalized concept appears in both coverage and future-learning.

Then inspect `git diff --check` and the complete diff for the declared files.

## Step 7 — Update mode only

When `MODE = dry-run`, do not commit and do not update the tracker.

When `MODE = update`:

1. Commit the topic coverage, future-learning, and combined mirror atomically.
2. If another topic's inbox received entries, commit the inbox separately.
3. Before each `git add` and immediately before each commit, run `git status --short`; stage only
   declared prompt-system paths and preserve Victor's files.
4. Write the pipeline self-report according to
   `notes/prompts/_internal/_pipeline-self-report.md`.
5. Update this topic's coverage-prompt cell in `_run-tracker.md`.
6. Commit the self-report and tracker together.
7. Verify the run's commits with `git show --stat`.

## Final summary

Report:

- branch and mode;
- topic file line/item count before → after;
- `N lines, read to EOF`;
- kept junior floor, differentiators, moved-to-future, deleted, corrected, and routed counts;
- market analyst and reviewer completion;
- budget result and any justified exception;
- mirror parity result;
- files and commits changed;
- unresolved risks, or `none`.

Do not print the final summary while a plan item remains incomplete.
