# Coverage Audit Prompt

Global convergence pass for one professional level after every topic has been processed individually by `coverage-prompt`.

> **▶ Run first:** `coverage-prompt` for every topic at this `LEVEL` — the tracker gate below verifies
> that the complete per-topic pass has finished.

## Configuration

```text
LEVEL = [junior | middle | senior]
MODE = [update | dry-run]
```

Run junior, middle, and senior audits separately. This audit never authors a missing topic from scratch; it flags that topic for its own coverage-prompt execution.

## Runtime contract

Before dispatching roles, read:

- `notes/prompts/_internal/_agent-runtime-standard.md`
- the active platform adapter

Use canonical roles and reasoning tiers from the runtime standard. Analysts and reviewers are cold
and read-only. If a required role cannot be dispatched, stop; there is no single-agent fallback.

## Required sources

Read to EOF with verified line counts:

- `_internal/_coverage-standard.md`
- `_session-rules.md`
- `_shared-context.md`
- `_job-market-evidence.md`
- `notes/coverage/{LEVEL}.md`
- every topic's `coverage/junior.md`, `coverage/middle.md`, and `coverage/senior.md`
- `_internal/_cross-topic-inbox.md`
- `_run-tracker.md`
- previous coverage-audit self-report

`ROADMAP.md`, notes, practice plans, project plans, and project code are downstream artifacts. Do not
use them to add, remove, or raise a coverage requirement.

## Step 0 — Guards

1. Stop on `main`.
2. Inspect the tracker. Every topic must have a completed `coverage-prompt` cell for the selected level; otherwise stop and list the pending topics.
3. Surface unresolved previous recommendations.
4. Plan all analysis, editing, validation, mirror rebuild, self-report, tracker update, and commits.
5. Preserve unrelated working-tree changes.

## Step 1 — Independent analyses

Dispatch cold read-only analysts for independent concerns:

- **Market fit** — compare the selected level with current target-role evidence and flag missing or inflated requirements.
- **Fundamentals and confusable pairs** — find ordinary competency gaps that postings may omit.
- **Level boundaries** — detect concepts placed below or above the responsibility level they require.
- **Topic ownership** — find duplicates and concepts owned by another topic.

For junior, mid/senior postings must not raise the floor. For middle, analysts must distinguish autonomous application/team ownership from senior platform or organisational responsibility.

Each analyst returns evidence, not edits, and confirms all whole-file reads to EOF.
Every analyst receives `_shared-context.md`, current market evidence, and the coverage standard as the
scope authorities. None may inspect or infer requirements from `ROADMAP.md`, notes, exercises,
projects, or plans.

## Step 2 — Converge the selected level

The orchestrator verifies every finding and edits topic files only when evidence supports the change.

Allowed actions:

- add a genuine selected-level gap;
- move a concept between junior, middle, and senior;
- route a concept to its owning topic through the inbox;
- correct factual errors;
- delete duplicates, non-concepts, and plainly wrong claims — never a real concept: anything that
  names a genuine concept is moved to another level or routed to its owning topic instead, and when
  in doubt between deleting and moving, move;
- split or merge unclear sections.

Every one of those actions must carry any existing `✅ NN` evidence marker onto the surviving bullet
unchanged — a reworded, moved, or re-routed concept keeps its demonstration. Read "Evidence markers" in
the standard before editing a bullet that has one.

No numeric item budget or section-size target exists. Do not add or remove concepts to reach a count.

Apply the qualitative stopping rule:

1. recurring selected-level market requirements are mapped;
2. ordinary fundamentals, decisions, pressure cases, and confusable pairs are covered;
3. every item has correct topic and level ownership;
4. another adversarial pass yields only duplicates, different-level material, another owner, or unjustified specialisation.

## Step 3 — Detect missing topics

A new topic is justified only when:

1. it has a distinct interview/practical competency surface;
2. it supports enough independent concepts to be more than a section in an existing owner;
3. it is relevant to the selected target level.

Flag it for a separate `coverage-prompt` run. Do not create it here.

## Step 4 — Cold final review

After edits, dispatch:

- **Calibration reviewer** — missing requirements, inflated items, factual errors, and cross-level contradictions.
- **Ownership/quality reviewer** — grouped items, duplicate ownership, weak wording, and exact item count reviewed.

Both are cold, read-only, and must report selected files read to EOF. Apply accepted findings without expanding into the next level.
Both reviewers use the same source hierarchy as the analysts; downstream artifacts cannot justify a
gap or a level placement.

## Step 5 — Rebuild global mirror

Rebuild `notes/coverage/{LEVEL}.md` completely from each topic's `coverage/{LEVEL}.md` in study-priority order:

Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

Validate:

- every topic appears once;
- every local bullet and heading matches its mirror exactly and in order;
- no exact duplicate occurs within a topic;
- no normalized concept occurs in more than one level file for the same topic;
- ownership duplicates across topics are resolved or explicitly justified as concrete implementation twins;
- no checkbox, numbered coverage item, or fenced code exists;
- every `✅ NN` evidence marker present before the run is still present after it, on the bullet whose
  concept it belongs to, in both the topic file and the mirror — see "Evidence markers" in the standard.
  Reformulating a bullet carries its marker across; only a concept genuinely leaving the level may take
  its marker with it, and that must be named explicitly in the final report;
- `git diff --check` and complete diff inspection pass.

## Step 6 — Update mode

Dry run makes no coverage commits, but its self-report and `dry-run` tracker outcome are still
committed as execution evidence.

Update mode:

1. Commit selected-level topic files, any cross-level moves, and the selected mirror atomically.
2. Refresh the `## Coverage demonstrated` table in `PROGRESS.md`, in that same commit. This pass moves
   denominators across **every** topic at once, so a stale table after it is the widest drift the
   instrument can carry.
   **`progress-update-prompt.md` step D8 owns the table's format, its counting rule, and the `*`
   provisional mark — read D8 and follow it.** Recount with the two greps there, never by adjusting the
   printed values: rewrite the whole column for the audited level plus its `**Total**`, and any cell of
   another level whose file a cross-level move changed. Additions, deletions, and moves all land here;
   a marker that legitimately left the level with its concept lowers a numerator, and that must show.
   Never touch `Professional level by topic` — denominators moving is not a promotion or a demotion.
3. Commit inbox routing separately when changed.
4. Check status immediately before each add and commit; stage declared paths only.
5. Write the coverage-audit self-report and update the audit tracker row with level and date.
6. Commit report and tracker together.
7. Verify commits with `git show --stat`.

For step 4, read `notes/prompts/_internal/_pipeline-self-report.md` and execute it in full. Its
declared report path is `_internal/_last-run-report.md`; update the `coverage-audit` row in
`_internal/_run-tracker.md`.

## Final report

Include:

- branch, mode, level, and progression-gate state;
- whole-file EOF evidence;
- analyst and reviewer completion;
- added, moved down/up, moved to senior, deleted, corrected, and routed counts by topic;
- the audited level's `**Total**` cell in the `Coverage demonstrated` table, before and after;
- missing-topic detections;
- qualitative stopping-rule result;
- mirror parity;
- files and commits;
- unresolved risks or `none`.
