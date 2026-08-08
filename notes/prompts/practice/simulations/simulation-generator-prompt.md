# Simulation Generator Prompt

> **Runtime contract:** Before dispatching any role, read `notes/prompts/_internal/_agent-runtime-standard.md` and translate its canonical roles, reasoning tiers, and execution modes through the shared session rules.

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

The `practice/simulations/` folder started with a fixed bank of 15 hand-written timed tests. This prompt
**creates new ones in the same format** — for when the bank is used up, or when `simulation-review`
tells me a type (Angular / Spring Boot / SQL) is weak and I need more practice of exactly that kind.
It is the producer; `simulation-review-prompt` is the consumer that grades what I build.

> **▶ Run first:** nothing — this is a producer; `simulation-review` consumes what it makes.

---

**How to use:**

1. Fill in `TYPE`, `LEVEL`, and optionally `COUNT`, `DIFFICULTY`, and `FOCUS`
2. Paste the entire prompt into a new chat
3. The new specs are saved to `practice/simulations/{type}/` and registered in `practice/simulations/TRACKER.md`

---

````
## Configuration — edit only this block

TYPE       = [angular | spring-boot | sql | all]
             → TYPE = all generates for every type in turn — see notes/prompts/_internal/_batch-mode.md
               (order: angular, spring-boot, sql)
LEVEL      = [junior | middle | senior]
COUNT      = [how many new tests to generate]   → default: 2
DIFFICULTY = [standard | challenge]             → default: standard
             (challenge = more business rules, more entities/queries, tighter time)
FOCUS      = [optional — a skill to target, e.g. "pagination", "JWT + roles", "window functions",
             "reactive forms + validation". Leave blank for a well-rounded test.]

Validation — before anything else:
- If TYPE is blank: print "Error: TYPE is required (angular | spring-boot | sql)." and stop.
- If LEVEL is blank: print "Error: LEVEL is required (junior | middle | senior)." and stop.
- If COUNT is blank: use 2. If DIFFICULTY is blank: use standard.

---

## Context

Before starting, read `notes/prompts/_internal/_session-rules.md` and `notes/prompts/_internal/_shared-context.md`. The tests must look like
what a Spanish consultancy actually hands a junior in the take-home stage (stage 3) — a realistic
enterprise mini-task, clean acceptance criteria, doable in the time limit. Not a toy, not a
multi-day project.

Time limits by type (match the existing bank):
- angular: 60 min (standard) / 75 min (challenge)
- spring-boot: 90 min
- sql: 45 min

---

## Step 1 — Read the existing bank

1. List the files in `practice/simulations/{TYPE}/`. Find the highest test number — call it N. New tests
   start at N+1, with two-digit numbers (`06`, `07`, …).
2. Read the two most recent existing specs in that folder. Match their **exact format and section
   order** — do not invent a new structure.
3. Read `practice/simulations/TRACKER.md` — note the section for {TYPE} and its current count (e.g. "Angular
   (0 / 5)").
4. Do not repeat a scenario already in the bank. Each new test must use a different domain.

**`TYPE = sql` only — read the exercise plan first.** Open `practice/sql/PLANNING.md` **§8 — *Progress
tracking*** (find it by that heading, not by the number alone: §9 is the quality-gate table and looks
similar) and list the steps whose Status is ✅. **A SQL test may only require techniques from closed
steps.** This is not a style preference: the bank's first five tests were written before the plan
existed and every one of them needs window functions (Step 7), which makes them unusable for months.
**The technique-to-step mapping is `PLANNING.md` §8c — read it there, do not re-derive it.** That plan
owns what Victor knows and when; duplicating the mapping here is how the two drift, and §8c also
carries the "Estado hoy" line and the note that tests 01–05 are blocked on Step 7. If fewer
than three steps are closed, print "Not enough closed steps for a realistic SQL test — the first one
is due when **Step 2** closes: Steps 0, 1 and 2 give basics + joins + `GROUP BY`, which is already a
real 45-minute test." and stop. State in your Step 4 report which closed steps each test drew on.

---

## Step 2 — Design and write each test

Generate {COUNT} tests, numbered from N+1. Pick distinct, recognisable enterprise domains
(invoicing, bookings, inventory, support tickets, payroll, deliveries, etc.).

Each file goes to `practice/simulations/{TYPE}/NN-short-name.md` and must follow the format for its type:

**Header (all types):**
```
# {Type} — Test NN: {Title}

**Level:** {LEVEL}
**Time limit:** {minutes} minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---
```

**angular** — then: `## Scenario` (2–3 lines, backend assumed to exist) · `## What to build`
(numbered list: components, reactive form with named validators, a service with the HTTP method,
loading/disabled/error/success states) · `## Interfaces and mock` (a TypeScript interface + a note
that the service may return `of(...)` with a delay if there is no backend) · `## Evaluation — what a
good solution looks like` (checkbox list, including "no logic in the component that belongs in the
service") · `## Bonus (if done before time)`.

**spring-boot** — then: `## Scenario` (build from scratch, JPA + H2 or PostgreSQL) · `## Entities`
(one table per entity: Field | Type | Rules) · `## What to build` (numbered endpoints with method,
path, validation, and the status codes to return) · `## Expected HTTP status codes` (table:
Operation | Success | Error) · `## Evaluation — what a good solution looks like` (checkbox list:
layered separation, Bean Validation, 404 via custom exception, DTOs not entities, business logic in
the service) · `## Bonus (if done before time)`.

**sql** — then: `## Schema` (a ```sql CREATE TABLE block, 3–5 related tables with FKs) ·
`## Queries to write` (numbered, 6–9 queries that escalate in difficulty, **drawn only from closed
steps** — the hardest technique in the test is the one from the highest closed step, and at challenge
level at least one query must combine two of them) ·
`## Evaluation — what a good solution looks like` (one checkbox per query naming the technique it
tests) · `## Bonus (if done before time)`.

**Quality bar for every test:**
- The acceptance criteria are concrete and checkable — no "make it work".
- At least one requirement forces a real decision, not just CRUD (a business rule, a state
  transition, a tricky JOIN, a validation edge case).
- If FOCUS is set, every test centres on it. If blank, cover the type broadly.
- It is genuinely completable in the time limit by a junior who knows the material.

---

## Step 3 — Update the tracker

In `practice/simulations/TRACKER.md`, add one row per new test under the {TYPE} section, matching the
existing column format (`| # | [Title](path) | {Level} | time | ⏳ Pending | — | — |`). Update the section
count in the heading (e.g. "Angular (0 / 5)" → "Angular (0 / 7)"). Do not touch other sections or
any existing row.

---

## Step 4 — Report and commit

Print: "Generated {COUNT} {TYPE} test(s): NN, NN. Saved to practice/simulations/{TYPE}/ and registered in
TRACKER.md." List each title in one line.

One command per code block — list only the files actually created plus the tracker:

```
git add practice/simulations/{TYPE}/ practice/simulations/TRACKER.md
```

```
git commit -m "docs: add {COUNT} {TYPE} simulation(s) — [main skill targeted]"
```

> Branch note: study materials commit on **whatever branch is currently active** (`notes/prompts/_internal/_session-rules.md`,
> 2026-07-14) — `main` never receives direct commits, only merges via PR. Run `git branch --show-current`
> first; if it returns `main`, stop and ask which branch to use.

---

## Final step — write the self-report

Read `notes/prompts/_internal/_single-shot-self-report.md` and execute it in full: the close-out check
against this prompt's declared outputs in `notes/prompts/README.md`, the three bullets written to
`notes/prompts/practice/simulations/_internal/_last-run-report-simulation-generator.md`, its own commit, then the refinement step.

> **Run-start check (step 0):** that file's Step 5 — before anything else, read
> `notes/prompts/practice/simulations/_internal/_last-run-report-simulation-generator.md` and surface its Verdict in one line if `Status` is `open`.

````
