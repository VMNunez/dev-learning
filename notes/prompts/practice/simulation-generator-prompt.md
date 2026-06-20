# Simulation Generator Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

The `simulations/` folder started with a fixed bank of 15 hand-written timed tests. This prompt
**creates new ones in the same format** — for when the bank is used up, or when `simulation-review`
tells me a type (Angular / Spring Boot / SQL) is weak and I need more practice of exactly that kind.
It is the producer; `simulation-review-prompt` is the consumer that grades what I build.

---

**How to use:**

1. Fill in `TYPE`, and optionally `COUNT`, `DIFFICULTY`, and `FOCUS`
2. Paste the entire prompt into a new chat
3. The new specs are saved to `simulations/{type}/` and registered in `simulations/TRACKER.md`

---

````
## Configuration — edit only this block

TYPE       = [angular | spring-boot | sql]
COUNT      = [how many new tests to generate]   → default: 2
DIFFICULTY = [standard | challenge]             → default: standard
             (challenge = more business rules, more entities/queries, tighter time)
FOCUS      = [optional — a skill to target, e.g. "pagination", "JWT + roles", "window functions",
             "reactive forms + validation". Leave blank for a well-rounded test.]

Validation — before anything else:
- If TYPE is blank: print "Error: TYPE is required (angular | spring-boot | sql)." and stop.
- If COUNT is blank: use 2. If DIFFICULTY is blank: use standard.

---

## Context

Before starting, read `CLAUDE.md` and `notes/prompts/_shared-context.md`. The tests must look like
what a Spanish consultancy actually hands a junior in the take-home stage (stage 3) — a realistic
enterprise mini-task, clean acceptance criteria, doable in the time limit. Not a toy, not a
multi-day project.

Time limits by type (match the existing bank):
- angular: 60 min (standard) / 75 min (challenge)
- spring-boot: 90 min
- sql: 45 min

---

## Step 1 — Read the existing bank

1. List the files in `simulations/{TYPE}/`. Find the highest test number — call it N. New tests
   start at N+1, with two-digit numbers (`06`, `07`, …).
2. Read the two most recent existing specs in that folder. Match their **exact format and section
   order** — do not invent a new structure.
3. Read `simulations/TRACKER.md` — note the section for {TYPE} and its current count (e.g. "Angular
   (0 / 5)").
4. Do not repeat a scenario already in the bank. Each new test must use a different domain.

---

## Step 2 — Design and write each test

Generate {COUNT} tests, numbered from N+1. Pick distinct, recognisable enterprise domains
(invoicing, bookings, inventory, support tickets, payroll, deliveries, etc.).

Each file goes to `simulations/{TYPE}/NN-short-name.md` and must follow the format for its type:

**Header (all types):**
```
# {Type} — Test NN: {Title}

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
`## Queries to write` (numbered, 6–9 queries that escalate from simple JOINs to GROUP BY/HAVING,
NULL handling, and at least one that needs a subquery or window function at challenge level) ·
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

In `simulations/TRACKER.md`, add one row per new test under the {TYPE} section, matching the
existing column format (`| # | [Title](path) | time | ⏳ Pending | — | — |`). Update the section
count in the heading (e.g. "Angular (0 / 5)" → "Angular (0 / 7)"). Do not touch other sections or
any existing row.

---

## Step 4 — Report and commit

Print: "Generated {COUNT} {TYPE} test(s): NN, NN. Saved to simulations/{TYPE}/ and registered in
TRACKER.md." List each title in one line.

One command per code block — list only the files actually created plus the tracker:

```
git add simulations/{TYPE}/ simulations/TRACKER.md
```

```
git commit -m "docs: add {COUNT} {TYPE} simulation(s) — [main skill targeted]"
```

> Branch note: simulations live on `main` / the active branch, not on `sql/practice`. SQL *exercises*
> (the `sql/` folder) are the ones tied to `sql/practice` — SQL *simulations* are not.
````
