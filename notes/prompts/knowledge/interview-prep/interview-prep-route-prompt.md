# Interview-prep route — build the selected level's CORE study order

Create or reconcile one cross-topic interview study route. This prompt selects; it never authors,
refines, studies, translates, or duplicates an answer.

> **Runtime contract:** Before dispatching a role, read
> `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles and reasoning
> tiers through the active platform adapter.

> **▶ Run first:** run `interview-prep-audit MODE = full` for every required bank at this level. Every
> EN/ES pair must exist, have current coverage fingerprints, exact question-ID/state parity, and no
> malformed lifecycle marker. A bank may contain unrefined questions; the route can select them, but
> the daily study opener will not present them until Victor marks them `[refined]`.

## Configuration

```text
LEVEL = [junior | middle | senior]
MODE = [update | dry-run]
```

One run handles exactly one level. There is no `all` mode.

## Inputs and output

Read:

- `notes/prompts/_internal/_shared-context.md` and `ROADMAP.md` for role, stack and company weighting;
- `notes/prompts/_internal/_job-market-evidence.md` for current demand;
- `_interview-prep-standard.md` for IDs, priority and lifecycle;
- every selected-level bank in this order: angular, spring, spring-boot, java, architecture, security,
  typescript, sql, javascript, css, git, general.

Write only `notes/interview-prep/routes/{LEVEL}.md`. Angular Material is represented inside the Angular
bank and never gets a duplicate route entry.

## Guards

1. Stop on `main`; record the blocked run through `_pipeline-self-report.md`.
2. Run the shared run-start check against
   `_internal/_last-run-report-interview-prep-route.md`.
3. Count lines and read every selected-level EN bank to EOF. Read each ES bank structurally and require
   identical sections, IDs, priorities and lifecycle markers.
4. Recalculate every coverage fingerprint exactly as `interview-prep-audit` does. Stop on a missing or
   stale bank, missing Spring bank, duplicate/malformed ID, `[studied]` without `[refined]`, or parity
   failure. Name every failing topic; never build a plausible route over a partial denominator.
5. Preserve unrelated working-tree changes.

## Inventory fingerprint

Build the ordered inventory from every English bold question line, topic by topic and file order.
Strip only the trailing state markers ` [refined]` and ` [studied]`; keep the stable ID, wording and
priority. Join the resulting lines with LF and calculate lowercase SHA-256 over the UTF-8 bytes.

Store it as:

```text
Question inventory SHA-256: <64 lowercase hexadecimal characters>
```

Refining or studying a question does not stale the route. Adding, removing, rewording or reprioritising
a question does.

## Selection algorithm

1. Candidate pool: current ⭐⭐⭐ questions only. ⭐⭐ and ⭐ remain in the full bank and never enter CORE
   merely to fill a quota.
2. Deduplicate by tested decision or mechanism, not wording. Keep the ID whose phrasing is likeliest in
   the target interviews.
3. Weight the target stack globally: Angular → Spring Boot → Java → SQL → Security → Architecture →
   TypeScript → JavaScript → CSS → Git → General; Spring supports Spring Boot and is placed beside it.
   Weighting changes order and representation, not the selected professional level.
4. Preserve a balanced interview shape: fundamentals, decisions/trade-offs, pressure cases and truthful
   project anchors. Do not fill CORE with definitions alone.
5. Budget is a guardrail, not a target: junior 60–80 questions, middle 50–70, senior 40–60. Go outside
   it only when the cold reviewer identifies a named filter-level omission or a duplicate that must be
   removed; explain every exception.
6. Order for study: filter-level foundations first, then framework/language mechanisms, then decisions,
   then pressure questions. Interleave topics after their foundations so a block does not become one
   long file-reading session.
7. Keep stable IDs only; never copy answers into the route.

## Cold route review

Dispatch one cold `reviewer`, reasoning tier `deep`, execution `foreground`. Give it the proposed route,
the English question lines, `_shared-context.md`, `ROADMAP.md`, and `_job-market-evidence.md`. It must
return:

- `N questions reviewed` and the selected count;
- duplicate-ID/concept verdict;
- target-stack weighting verdict;
- conceptual/decision/pressure balance verdict;
- every filter-level omission and every question it would remove;
- budget verdict and justification for any exception.

It writes nothing. Re-dispatch once if the proof is incomplete. Apply accepted corrections, then rerun
the deterministic ID, count and fingerprint checks. No reviewer means no route commit.

## Required route format

```markdown
# Junior Interview-prep CORE Route

Route status: current
Level: junior
Question inventory SHA-256: <digest>
Generated: YYYY-MM-DD
CORE questions: 68

| Order | ID | Topic | Question |
|---:|---|---|---|
| 1 | ANG-J-001 | Angular | What is Angular? |
```

IDs are unique, every ID resolves to exactly one selected-level bilingual question, and table order is
the study order. The question text is a navigation label only; the Q&A bank remains the content source.

## Write, commit and close out

`MODE = dry-run` prints the proposed route and reviewer verdict without writing the route. `MODE =
update` writes it, runs `git status --short` immediately before staging and committing, stages only the
route, and commits:

```text
docs(interview): plan {level} CORE question route
```

Then execute `notes/prompts/_internal/_pipeline-self-report.md` in full: write
`_internal/_last-run-report-interview-prep-route.md`, record the target/outcome under `## Global prompt
executions`, and commit the report plus `_run-tracker.md` separately. Report level, bank count, inventory
fingerprint, candidate count, CORE count, topic distribution, reviewer verdict, route commit and
self-report commit.
