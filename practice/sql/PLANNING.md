# SQL Learning Plan

**Purpose:** the compass for the 12:30 SQL block, built to the same contract as a project
`PLANNING.md`. `notes/sql/coverage.md` says *what* must be learned; this file says *in what order*,
*which files it produces*, *how many exercises each one gets*, *which prompt runs at which moment*,
*what to update when a step closes*, and *when the whole track is finished*.

**Database:** PostgreSQL (local, pgAdmin). **Schema:** the canonical bookstore schema defined in
`notes/prompts/practice/sql/sql-exercises-prompt.md` (`authors`, `publishers`, `genres`, `books`,
`customers`, `orders`, `order_items`, `reviews`) — that prompt is the single source of truth for it.
The capstone switches to the TimeTrack model.

> ⚠️ **`01-basics.sql` carries an older, thinner schema** (`order_books` with no `quantity` or
> `unit_price`, `authors.nationality`, `books.year`) and is **closed** because of it — resolved
> 2026-07-22 by leaving it alone and starting `02-execution-order-set-ops.sql` with the canonical
> schema. Every file from `02-` on ships its own canonical SETUP block: one file, one schema.

**Target:** pass the SQL half of a technical screening at NTT Data / Capgemini / Indra, and write the
report queries TimeTrack needs without looking anything up.

---

## Section 0 — Session quick reference

**Read this first every SQL block. Update it at the start of every session.**

| | |
|---|---|
| **Current step** | Step 0 — Querying basics (`01-basics.sql` cerrado con 20 first-pass; `02-execution-order-set-ops.sql` con 10 sin responder, target 30) |
| **Current branch** | the active feature branch (study materials follow it — see §7) |
| **Done condition** | `Review: sql-exercises MODE = review scores ≥ 80% on 02-execution-order-set-ops.sql` |
| **Next revision point** | R1 (§8b) — fires when Step 1 closes and `03-joins.sql` is scored |
| **Blocked on** | nothing. Los 10 ejercicios ya están escritos en `02-execution-order-set-ops.sql`: toca ejecutar su bloque SETUP en pgAdmin, responderlos (Moment 3) y pasarlos por `MODE = review`. |
| **Last updated** | 2026-07-22 |

---

## Section 1 — How this plan relates to the hub files

| File | Role here |
|------|-----------|
| `notes/sql/coverage.md` | **What** must be learned. This plan never restates it — it points at sections. |
| `PROGRESS.md` (SQL section) | **What** has been learned. Authoritative status; §8 here is the at-a-glance copy. |
| **This file** | **In what order**, with which files, how many exercises, which prompt, and what "done" means. |

If a concept is missing, it is added to `coverage.md` — never invented here. This plan is downstream
of coverage exactly like a project `PLANNING.md` is.

---

## Section 2 — The step loop: exactly when to run each prompt

Every step runs the same five moments. **The prompts run in a separate conversation, never in the
daily 12:30 session.** Each moment states the trigger, the prompt, and the config to paste.

> **The pasted config has exactly four keys — `MODE`, `TOPIC`, `COUNT`, `FILE` — and `sql-exercises-prompt.md`
> says in as many words: do not add keys.** `MODE` and `TOPIC` are required; `COUNT` and `FILE` are
> optional overrides. **`FOCUS` and `REVIEW` are not pasted keys**: the prompt derives them from the
> §6 step whose `TOPIC` matches, which is why every step below still states its focus — it is read
> from the plan, not typed into the chat. Pasting `FOCUS = …` is a dead instruction.

### Moment 1 — Read the concept list

**Trigger:** the very start of the step, before writing a single query.
**Prompt:** none. Open `notes/sql/coverage.md` and read the sections listed for that step.

---

### Moment 2 — Generate the exercises  ▶ RUN A PROMPT

**Trigger:** immediately after Moment 1, with the exercise file still empty.
**Prompt:** `notes/prompts/practice/sql/sql-exercises-prompt.md` — paste into a **new chat**.

```
MODE  = practice
TOPIC = <the step's TOPIC, given per step in §6>
COUNT = <the step's COUNT, given per step in §6 — never the default>
```

The step's focus travels with the step, not with the paste: the prompt looks up the §6 entry for that
`TOPIC` and takes the focus from there.

Nothing else to add: since 2026-07-22 the prompt's own path table matches §5 file for file, so it
writes to the right place on its own. If it ever asks where to save, the plan and the prompt have
drifted — fix the prompt, not the run.

> **On a first-pass run, add the new-concept rule.** Append this line:
> *"Every exercise must introduce a concept not already drilled in this file."*
>
> This applies **only to first-pass runs** — the ones whose `COUNT` is budgeted in §5 against the
> step's remaining concepts. It does **not** apply to review runs, which are a different thing
> entirely: see Moment 2b.

---

### Moment 2b — Review runs (off the critical path, any time)  ▶ RUN A PROMPT

**Two triggers, and only one of them is optional.**
- **Mandatory** — every revision point in §8b, and **R2** (after Step 4) and **R3** (after Step 7)
  above all. The focus is not a judgement call there: it is the open rows of
  `practice/sql/MISTAKES.md`. See §8b.
- **Optional** — whenever a topic feels rusty, on any step, including one already ✅. This is how
  `01-basics.sql` grew from 20 to 40 exercises, and it is a legitimate use of the block.

**Why the mandatory half exists.** Invariant 1 gives each coverage section to exactly one step, so
every concept is drilled once and never returns. Left to the optional trigger alone, the gap closes
only when Victor notices it — and a forgotten concept does not feel rusty, it feels learned. The
mistake log is the objective substitute for that feeling.

**Prompt:** the same `sql-exercises-prompt.md`, `MODE = practice`, on the topic being revisited.

```
MODE  = practice
TOPIC = <the topic being revisited>
COUNT = 8
```

The focus — the concepts to narrow onto — is stated in the §8b revision point (open rows of
`MISTAKES.md`) or in the §6 step, and the prompt reads it from there. It is not a pasted key.

Then add these two lines, which are what make it a *review* batch rather than a weaker copy of the
first pass:

> *"These are review exercises over concepts I have already drilled — deliberate repetition is the
> point. Do not restrict yourself to new concepts."*
>
> *"Skew the difficulty to Standard and Challenge; skip Intro. I have already passed the Intro pass on
> these concepts, and re-doing `SELECT title FROM books` teaches nothing."*

**Why the second line matters.** The prompt's difficulty split is fixed at 25% Intro / 50% Standard /
25% Challenge **per batch**, with no notion of a review batch. Left alone it hands you a fresh Intro
tier over concepts you already passed — which is exactly what #21–#40 became: twenty exercises that
re-covered the same ground at the same difficulty, buying three genuinely new concepts
(`NOT LIKE`, `IS NOT NULL`, `NOT BETWEEN`). The repetition was right; the *level* was too low to earn
its hour.

**Review runs do not advance a step.** They are not counted in §5's targets and never flip a status in
§8 — a step closes on its first-pass exercises and its exit question. Review is maintenance on ground
already taken.

**Label them.** Ask the prompt for `-- Exercise N [Repaso]:` instead of `[Intro]/[Standard]/[Challenge]`
so the file itself records which batch was first-pass and which was review. Without a marker, six
months from now nothing distinguishes them — and the review-mode score silently mixes both.

---

### Moment 3 — Answer them

**Trigger:** the daily 12:30 block, in pgAdmin, writing each query under its comment.
**Prompt:** none.

---

### Moment 4 — Get them graded  ▶ RUN A PROMPT

**Trigger:** once **every** exercise in the file has an answer — never partially.
**Prompt:** the same `sql-exercises-prompt.md`, in another **new chat**, answered file pasted at the end.

```
MODE  = review
TOPIC = <same TOPIC as Moment 2>
```

What it does, beyond printing a score:

- **Writes `-- ✅ Corregido <fecha>`** under every answer it accepts, and **skips anything already
  marked** on later runs. So the score always measures the new batch, never a growing pile of
  already-validated work, and the file itself records what is settled.
- **Updates `PROGRESS.md` twice** — the concept list (one line per concept) and the exercises table.
- **Updates this file** — the §8 row (count + status) and, when a step closes, the §0 header.
- **Re-checks every answer it accepted** with a cold subagent before writing any marker, and prints
  "Segunda pasada: N ✅ confirmados, M revertidos". A marker is permanent, so it is not written on a
  single grader's word.
- **Logs every ⚠️ and ❌ in `practice/sql/MISTAKES.md`**, one row per concept, and closes the rows this
  run redeemed. It does **not** write to `notes/sql/` or `notes/interview-prep/` — those tracks are
  not planned here (§Z).

It cannot close a step on its own, and it will say so: the exit question is outside its reach. That
one is yours (Moment 5).

**Below 80% → do not advance.** Re-run Moment 2 with `FOCUS` narrowed to the failed concepts, then
repeat Moments 3–4. This is a hard stop, not a suggestion: every later step assumes the earlier one.

---

### Moment 5 — Close the step  ▶ RUN THE STEP RITUAL

**Trigger:** both done conditions met.
**Prompt:** none — but the ritual in §4 is mandatory. Skipping it is what makes every later gate read
stale files.

---

## Section 3 — Done-condition format

Every done condition in §0 and §6 uses **one** of these five formats exactly. Nothing else is valid —
"I understand joins" is not testable and is not allowed. Each one is testable by someone else: another
person can run it and get the same verdict without asking how you feel about the topic.

- `Review: sql-exercises MODE = review scores ≥ [n]% on [file]`
- `pgAdmin: [query] returns [concrete result]`
- `Terminal: [command] produces [concrete observable result]`
- `Aloud: [the exit question] answered from memory, nothing open`
- `Timed: [n] queries from prose in under [m] minutes each, no reference open`

Every step closes on **two** conditions together: a scored condition (`Review:`, `pgAdmin:` or
`Terminal:`) and the `Aloud:` exit question. The capstone replaces the first with a `Timed:` one.
Nothing outside this list closes a step — a note being written or a question being added to the Q&A
bank is a different track (§Z) and never a done condition here.

---

## Section 4 — Step-complete ritual

**When a step's done conditions pass, update all three of these in the same commit.** This is the SQL
equivalent of the `step-complete` skill, which only covers project steps and will not fire here.
Partial updates are the real failure mode — do all three or write down why not.

**Two of the three are now automated** — `sql-exercises` in `review` mode does them (its Step 4), so the
ritual is mostly a verification. Check them rather than redo them.

1. **`PROGRESS.md`** *(automated)* — the SQL section, two edits: each concept added to the **concept
   list** one specific line at a time (never grouped: `HAVING filters groups after aggregation, WHERE
   filters rows before` is a line; "aggregation" is not), and the row in the **exercises table**
   updated with the real count and status ✅ / ⏳.
2. **This file** *(automated)* — the step's row in §8, and §0 refreshed (current step, done condition,
   next revision point, last updated).
3. **`notes/sql/coverage.md`** *(manual)* — if the step surfaced a concept genuinely missing from
   coverage, add it there. Do not add it to this plan instead.

A step is closed only when its scored condition has passed **and** the **exit question** has been
answered aloud. A score alone never closes a step, and the prompt is instructed to say so rather than
claim otherwise.

Commit message: `docs: close SQL step N — <topic>`.

---

## Section 5 — Every file this plan produces

Nothing is invented mid-session. This is the complete inventory, decided up front, **with the exercise
count each file ends at**.

### Exercise files — `practice/sql/`

Flat, numbered, matching `CLAUDE.md` ("flat files"). "Done" counts are what exists on `main` today.

**Three counts, never conflated.**
- *Written* = the prompt generated the statement.
- *Answered* = the query is written under it. A file full of unanswered statements is worth nothing.
- *Scored* = a `review` run has graded it ≥ 80%. **Only this one advances a step.** Answered-but-never-
  scored is the state `02-execution-order-set-ops.sql` is in today: 10 statements written, none
  answered, so nothing to validate. `01-basics.sql` is the opposite case — all 40 answers carry a
  `-- ✅ Corregido` marker, but only its 20 first-pass exercises count toward Step 0's target.
- *Target* = the **first-pass** exercises the step needs. **Review batches (Moment 2b) are extra and
  uncounted** — a file legitimately grows past its target forever, and that is not drift.

`01-basics.sql` shows all four: 40 written and 40 answered, of which exactly 20 are a review batch, so
20 count as scored against its first-pass target of 20. Step 0's target of 30 is that 20 plus the 10
in `02-execution-order-set-ops.sql` — a step's target is the sum of its files', never one file's total.

| File | Step(s) | Written | Answered | Scored | First-pass target | Status |
|------|---------|---------|----------|--------|-------------------|--------|
| `01-basics.sql` | 0 | 40 *(20 review)* | 40 | **20** *(+20 review, uncounted)* | 20 | **closed** — all 40 answers graded correct on 2026-07-22 (40/40), of which the 20 first-pass ones are what the Scored column counts. Legacy schema (v1); no more exercises are added here |
| `02-execution-order-set-ops.sql` | 0 | 10 | 0 | 0 | 10 | created 2026-07-22 — canonical schema, current format |
| `03-joins.sql` | 1 | 0 | 0 | 0 | 22 | deleted 2026-07-22 — to regenerate |
| `04-aggregates.sql` | 2 | 0 | 0 | 0 | 12 | to create |
| `05-join-pitfalls.sql` | 3 | 0 | 0 | 0 | 12 | to create |
| `06-nulls.sql` | 4 | 0 | 0 | 0 | 12 | to create |
| `07-subqueries-ctes.sql` | 5 | 0 | 0 | 0 | 16 | to create |
| `08-dates-strings.sql` | 6 | 0 | 0 | 0 | 12 | to create |
| `09-window-functions.sql` | 7 | 0 | 0 | 0 | 12 | to create |
| `10-dml-transactions.sql` | 8 | 0 | 0 | 0 | 16 | to create |
| `11-schema-design.sql` | 9 | 0 | 0 | 0 | 12 | to create |
| `12-data-types-ddl.sql` | 10 | 0 | 0 | 0 | 12 | to create |
| `13-indexes.sql` | 11 | 0 | 0 | 0 | 12 | to create |
| `14-live-database.sql` | 12 | 0 | 0 | 0 | 12 | to create |
| `15-report-queries.sql` | 13 | 0 | 0 | 0 | 8 | to create |

> **One file, one schema (rule adopted 2026-07-22).** `01-basics.sql` keeps the old thin schema and is
> closed at 40 exercises; everything from `02-` on carries the canonical bookstore schema in its own
> SETUP block. Step 0's 30 first-pass exercises are therefore split 20 + 10 across two files. This is
> why the file numbers no longer match the step numbers — the mapping is this table, and the prompt's
> path table was updated to match.

**First-pass total when the track is done: 200 exercises across 15 files.** Review batches add on top
and are deliberately not budgeted — 40 written today, 40 answered, 20 first-pass scored.

**Two header formats exist, and that is deliberate.** The prompt handles both — do not "fix" either
one by hand.

*Legacy* — `01-basics.sql` only, written before the prompt existed. (the old `02-joins.sql`, now renumbered `03-joins.sql`, was the other one;
it was deleted and will be regenerated in the current format, so `01-basics.sql` is the last file that
will ever carry this.)
The answer goes directly under the description, and the correction marker goes at the end of the
header line:

```sql
-- #07 | LEFT JOIN — finding missing data ✅ Corregido 2026-07-22
-- List every author who has never had a book ordered.
SELECT ...
```

*Current* — everything the prompt generates from now on, including new batches appended to a legacy
file:

```sql
-- Exercise 41 [Standard]: LEFT JOIN — finding missing data ✅ Corregido 2026-07-22
-- List every author who has never had a book ordered.
-- Your answer:
SELECT ...
```

Appending to a legacy file leaves it **mixed**, and the prompt warns you and asks before doing it —
answer yes; a mixed file is expected and correctly handled. `review` mode reads both (legacy answers
are the SQL lines between one `-- #NN |` and the next), so the 40 answered exercises in `01-basics.sql`
will score normally. **Both formats carry the `-- ✅ Corregido` marker** — it is just a comment line,
so a graded legacy exercise is skipped as settled exactly like a current-format one (corrected
2026-07-22; this file used to claim otherwise, which cost `01-basics.sql` its markers on the first
review run).

### The mistake log — `practice/sql/MISTAKES.md`

One file, written only by `sql-exercises` in `review` mode (its Step 5). Every ⚠️ or ❌ becomes one
open row — concept, its `coverage.md` section, severity, what went wrong, the exercises — and a
re-failure increments that row's `Times` instead of opening a second one. A later run that gets the
same concept right
moves the row to `## Closed` instead of deleting it. It is the focus source for every revision point
in §8b, and the only place in this track where *what was failed* is written down: `PROGRESS.md` only
ever records what was learned.

**Note files are not listed here.** The SQL notes are their own track with their own prompt (§Z).

---

## Section 6 — The steps

The order is not the order of `coverage.md`. It follows how the concepts actually depend on each
other, and front-loads what a screening asks first.

**Step sizing:** a step is a handful of 12:30 sessions, never weeks. **No single generation run asks
for more than 12 exercises, and no step targets more than 22** — that ceiling is why schema design is
split across Steps 9 and 10 instead of being one 36-exercise block. Any step targeting more than 12 is
split into runs of 12 or fewer (Steps 1, 5, 8; Steps 9 and 10 sit exactly at 12 and are still split
into two runs of 6 because each covers two distinct coverage sections), which also keeps each batch's
difficulty split meaningful.

**Step 0 is the one step above the 22 ceiling, at 30, and it is a legacy artefact rather than a
precedent.** Its first 20 exercises in `01-basics.sql` were hand-written before the exercise prompt
existed — they were never a generation run, so the 12-per-run ceiling was never breached — and the
schema change (§5, "one file, one schema") forced the remaining 10 into a second file instead of
letting the step be re-cut. Its only prompt run was `COUNT = 10`. No future step is planned above 22.

Step 1 is the only step at the 22 ceiling, deliberately: JOINs is the single most-tested SQL topic at
junior level, and it absorbed the ten hand-written exercises the step used to start from. (A file's
*total* can exceed its step's target when several steps write into it, as `01-basics.sql` does.)

**Difficulty rises inside every step, and later steps integrate earlier ones.** Two rules, both
mechanical:
- Every batch spans intro → challenge; the exercise prompt's own difficulty split does this and is not
  overridden on a first-pass run (a review batch deliberately skips Intro — see Moment 2b).
- **From Step 5 on, every Moment 2 config gets one extra line appended**, verbatim:
  *"At least two Challenge exercises must combine this topic with a topic from an earlier step."*
  The `Reinforces:` line of each step names which earlier step that is, so the line is never a guess.
  Without it a late step is drilled in isolation and teaches nothing about composition — which is
  exactly what a screening tests, since no real question is ever one topic wide.

> **A note on `TOPIC` values.** The `TOPIC` in a Moment 2 config is the *prompt's* vocabulary, not a
> `coverage.md` section name. Two steps may pass the same `TOPIC` with different `FOCUS` values without
> either of them claiming the same coverage section — invariant 1 in §10 is about coverage sections
> only.

---

### Step 0 — Querying basics ⏳ (20/30 first-pass scored, +20 review)

**Why here:** first, because every later step writes a `SELECT ... WHERE ... ORDER BY` around its own
topic — and because execution order is the mental model joins, aggregation and windows are all
explained against.
**Exercises:** dos archivos, uno por esquema.
- `practice/sql/01-basics.sql` — **cerrado**: 40 respondidas (20 first-pass #01–#20 + 20 de repaso
  #21–#40), **40/40 correctas** el 2026-07-22. Esquema v1 (el viejo). No se le añade nada más.
- `practice/sql/02-execution-order-set-ops.sql` — 10 first-pass, escritas el 2026-07-22 con el esquema
  canónico y el formato actual. Sin responder todavía.
**Coverage:** `Querying basics`, `Filtering and pattern matching`, `Sorting, pagination, and determinism`, `Set operations`
**Reinforces:** — (first step)

**Concepts:** covered across both batches — `SELECT`, `WHERE` (`AND`/`OR`/`IN`/`NOT IN`/`LIKE`/
`ILIKE`/`NOT LIKE`/`BETWEEN`/`NOT BETWEEN`/`IS NOT NULL`), `ORDER BY` (single, multiple, by alias),
`LIMIT`/`OFFSET`/`FETCH`, `DISTINCT`, `DISTINCT ON`, expressions and aliases, concatenation, `LENGTH()`.

Still missing before this step closes — the ten remaining exercises target exactly these:
- SQL execution order (`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`) and where an
  alias is visible — the mental model every later step leans on
- `CASE WHEN` in `SELECT`
- `UNION` vs `UNION ALL`, `INTERSECT`, `EXCEPT`
- `NULLS FIRST` / `NULLS LAST`, and why `LIMIT` without `ORDER BY` is non-deterministic
- Keyset pagination vs deep `OFFSET`

**Moment 2:** ya ejecutado el 2026-07-22 (`COUNT = 10`, el FOCUS de la lista de arriba). Nada que
generar; el paso está en Moment 3.

**Exit question:** *why does an alias defined in `SELECT` work in `ORDER BY` but raise an error in `WHERE`?*
**Done:** `Review: sql-exercises MODE = review scores ≥ 80% on 02-execution-order-set-ops.sql` · exit question aloud

---

### Step 1 — JOINs (0 scored / 22 target)

**Why here:** it needs only Step 0's clause skeleton, and it is the single most-tested SQL topic at
junior level — in a real screening `GROUP BY` almost always sits on top of a join, so joins come
before aggregation, not after.
**Exercises:** `practice/sql/03-joins.sql` — 22, generated from scratch in **two runs of 11**. The
original ten hand-written statements were deleted on 2026-07-22: they were never answered, and they
carried the old thin schema, so regenerating gets the canonical one and the current exercise format
(`-- Your answer:` + `-- ✅ Corregido` markers) instead of perpetuating the legacy format into a
second file.
**Coverage:** `JOINs`
**Reinforces:** Step 0 — execution order (`FROM + JOIN` runs first, which is why the join happens before `WHERE`)

**Concepts:** Run 1 builds the foundation — `INNER JOIN` (two tables, named columns, aliases, three tables, combined
with `WHERE` / `ORDER BY` / `LIMIT`) and `LEFT JOIN` (keeping unmatched rows, and the `IS NULL`
anti-join). Run 2 covers the rest: `RIGHT JOIN` and why it is rewritable as a `LEFT`,
`FULL OUTER JOIN`, self join, `USING` vs `NATURAL JOIN` and why `NATURAL` is banned in real
codebases, `EXISTS`/`NOT EXISTS` as semi-join and anti-join vocabulary.

**Moment 2 config — run 1** *(new file: it generates the canonical setup block)*:
```
MODE  = practice
TOPIC = joins
COUNT = 11
```
**Focus — run 1** *(read from this step by the prompt, not pasted)*: INNER JOIN across two and three
tables, table aliases, LEFT JOIN keeping unmatched rows, LEFT JOIN + IS NULL as an anti-join.

**Moment 2 config — run 2** *(appends, continuing from #11)*:
```
MODE  = practice
TOPIC = joins
COUNT = 11
```
**Focus — run 2** *(read from this step by the prompt, not pasted)*: RIGHT JOIN, FULL OUTER JOIN,
self join, USING vs NATURAL JOIN, EXISTS as a semi-join, NOT EXISTS as an anti-join.

Add the no-repetition line to both runs. Nothing else: the file no longer exists, so run 1 writes the
canonical schema itself and there is no legacy-schema prompt to answer.

**Exit question:** *given `authors` and `books`, which join do you use for "every author, including those with no books", and what does the row look like for an author with none?*
**Done:** `Review: ... ≥ 80% on 03-joins.sql` (#01–#22) · exit question aloud

---

### Step 2 — Aggregates and grouping

**Why here:** it needs the join from Step 1, because the surface a screening asks you to aggregate is
almost never a single table — and with joins + aggregation you can already answer the second question
of a technical test.
**Exercises:** `practice/sql/04-aggregates.sql` — 12
**Coverage:** `Aggregates and grouping`
**Reinforces:** Step 1 — a join is the surface `GROUP BY` almost always sits on top of
**Moment 2 config:** `TOPIC = group-by`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** `COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT)`, `SUM`/`AVG`/`MIN`/`MAX` ignoring `NULL`, `SUM`
over zero rows returning `NULL`, the `GROUP BY` rule, `HAVING` vs `WHERE`, conditional aggregation
with `CASE WHEN` and `FILTER (WHERE ...)`.

**Exit question:** *`WHERE` vs `HAVING` — which runs first, and why can't `WHERE` use `COUNT(*)`?*
**Done:** `Review: ... ≥ 80% on 04-aggregates.sql` · exit question aloud

---

### Step 3 — JOIN pitfalls and row multiplication

**Why here:** every pitfall on its list is an *aggregate over a broken join*, so it cannot even be
stated before Step 2 — and it is what separates "knows the syntax" from "has debugged a wrong report",
which is the follow-up question after a join answer lands.
**Exercises:** `practice/sql/05-join-pitfalls.sql` — 12
**Coverage:** `JOIN pitfalls and row multiplication`
**Reinforces:** Steps 1 + 2 — every pitfall here is an **aggregate over a broken join**
**Moment 2 config:** `TOPIC = join-pitfalls`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** condition in `ON` vs in `WHERE`, the `WHERE` filter that silently turns a `LEFT JOIN` into an
`INNER JOIN`, fan-out inflating `SUM`, `COUNT(*)` returning 1 instead of 0 after a `LEFT JOIN`,
pre-aggregating in a CTE vs `COUNT(DISTINCT)`, accidental cross joins, `NULL` in a join key,
deliberate `CROSS JOIN`.

**Why it sits after aggregation, not next to joins.** Every item on that list is an aggregate: fan-out
is a wrong `SUM`, the `COUNT(*)`/`COUNT(column)` trap is a wrong count, the CTE fix is a pre-aggregation.
None of them can even be *stated* before `SUM` and `GROUP BY` are fluent — which is why this is its own
step and its own file rather than the back half of Step 1.

It stays a separate step from Step 2 on purpose: these are what separate "knows the syntax" from "has
debugged a wrong report", and burying them inside the aggregation step loses them.

**Exit question:** *a report total comes back exactly double the real number. What is the first thing you check?*
**Done:** `Review: ... ≥ 80% on 05-join-pitfalls.sql` · exit question aloud

---

### Step 4 — NULL and three-valued logic

**Why here:** Steps 1–3 have already produced `NULL`s by hand (`LEFT JOIN`, `AVG` skipping them,
`COUNT(*)` counting them), so this step explains a mechanism he has already been bitten by instead of
describing one he has not met — and `NOT IN` with a `NULL` is a standard screening trap.
**Exercises:** `practice/sql/06-nulls.sql` — 12
**Coverage:** `NULL and three-valued logic`
**Reinforces:** Steps 1–3 — `LEFT JOIN` producing nulls, `AVG` skipping them, `COUNT(*)` counting them
**Moment 2 config:** `TOPIC = nulls`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** `NULL = NULL`, `IS NULL` vs `= NULL`, `AND`/`OR` truth tables, `NOT IN` with a `NULL` in the subquery,
`NOT EXISTS` vs `NOT IN`, `IS DISTINCT FROM`, `NULL` in `UNIQUE`, `COALESCE`, `NULLIF`.

**Exit question:** *are two `NULL`s equal in SQL? Explain what `WHERE price = NULL` actually evaluates to.*
**Done:** `Review: ... ≥ 80% on 06-nulls.sql` · exit question aloud

> **This closes the screening core.** Steps 1–4 are what a quickfire round asks — which is why
> revision point **R2** (§8b) fires here, before anything is built on top of it.

---

### Step 5 — Subqueries, CTEs, and views

**Why here:** it needs Step 3's pre-aggregation fix, which *is* a subquery in `FROM` — and it closes
the set `ROADMAP.md` calls test-relevant (joins · aggregation · subqueries/CTEs), so it is the last
step before the surface is wide enough for a realistic timed test.
**Exercises:** `practice/sql/07-subqueries-ctes.sql` — 16 (two runs of 8)
**Coverage:** `Subqueries, CTEs, and views`
**Reinforces:** Step 3 — a subquery in `FROM` is how you filter on an aggregate `WHERE` cannot see
**Moment 2 config:** two runs, both `COUNT = 8`, appending to the same file — `TOPIC = subqueries`, then `TOPIC = ctes`

**Concepts:** subquery in `WHERE` / `FROM` / `SELECT`, `IN` vs `EXISTS`, subquery vs `JOIN`, correlated subqueries
and why they do not scale, `WITH` and chained CTEs, `CREATE VIEW`, view vs materialized view.

**Exit question:** *when would you reach for a CTE instead of a subquery, and is a CTE slower?*
**Done:** `Review: ... ≥ 80% on 07-subqueries-ctes.sql` · exit question aloud

---

### Step 6 — Date and string functions

**Why here:** it needs Step 3's grouping-by-an-expression (`GROUP BY DATE_TRUNC('month', ...)` is the
whole of monthly reporting), and it comes before window functions and the capstone because a live
exercise stalls on a raw `TIMESTAMP` long before it stalls on `ROW_NUMBER`.
**Exercises:** `practice/sql/08-dates-strings.sql` — 12
**Coverage:** `Date and string functions`, `PostgreSQL specifics`
**Reinforces:** Step 3 — `GROUP BY DATE_TRUNC('month', ...)` is grouping by an expression
**Moment 2 config:** `TOPIC = dates-strings`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** `DATE_TRUNC` and grouping by month, `EXTRACT`, `AGE` and date arithmetic, `INTERVAL`,
`NOW()` vs `CURRENT_DATE`, casting a `TIMESTAMP` to a `DATE`, `TO_CHAR` formatting, `CONCAT` vs `||`,
`SUBSTRING`, `TRIM`, `UPPER`/`LOWER`, `REPLACE`, `SPLIT_PART`, `COALESCE` on text, and the PostgreSQL
specifics that ride along (`::` casting, `ILIKE`, `RETURNING`).

**This step owns the whole `PostgreSQL specifics` coverage section** — Step 12 uses the same prompt
`TOPIC` but claims different coverage sections.

**Exit question:** *build a monthly total from a raw `TIMESTAMP` column. Which function, and why not `EXTRACT`?*
**Done:** `Review: ... ≥ 80% on 08-dates-strings.sql` · exit question aloud

---

### Step 7 — Window functions

**Why here:** a window is only explainable against what `GROUP BY` collapses (Step 3) and against
execution order (Step 0) — and it is asked *after* the core in a screening, as the "and can you also…"
question, never as the opener.
**Exercises:** `practice/sql/09-window-functions.sql` — 12
**Coverage:** `Window functions`
**Reinforces:** Step 3 — a window keeps the rows `GROUP BY` collapses; Step 0 — execution order explains why a window cannot sit in `WHERE`
**Moment 2 config:** `TOPIC = window-functions`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`/`LEAD`, `SUM() OVER (PARTITION BY ...)`, why a window
function cannot appear in `WHERE`, window vs `GROUP BY`, the default frame, "the second highest value".

**Exit question:** *"the latest entry per user" — write the shape of the query and explain why you need a subquery around it.*
**Done:** `Review: ... ≥ 80% on 09-window-functions.sql` · exit question aloud

> Revision point **R3** (§8b) fires here: subqueries, dates and windows now sit on a core that has had
> months to decay, and the mistake log is the only honest record of what slipped.

---

### Step 8 — DML and transactions

**Why here:** finding duplicates needs Step 3's `HAVING COUNT(*) > 1` and deleting them keeping one
needs Step 7's `ROW_NUMBER()`, so it cannot precede either — and it is where SQL meets the Spring Boot
`@Transactional` the interviewer will actually ask about.
**Exercises:** `practice/sql/10-dml-transactions.sql` — 16 (two runs of 8)
**Coverage:** `DML — modifying data`, `Transactions`
**Reinforces:** Step 3 — `GROUP BY ... HAVING COUNT(*) > 1` is the duplicate-finding query; Step 7 — `ROW_NUMBER()` is how you delete duplicates keeping one
**Moment 2 config:** two runs, both `COUNT = 8`, appending to the same file — `TOPIC = dml`, then `TOPIC = transactions`

**Concepts:** `INSERT` (single, multi-row, `RETURNING`), insert order with foreign keys, resetting a sequence after
seeding, `UPDATE`/`DELETE` and the missing-`WHERE` catastrophe, `DELETE` vs `TRUNCATE`, `ON CONFLICT`
upsert, finding and deleting duplicates. Then `BEGIN`/`COMMIT`/`ROLLBACK`, ACID, the three read
anomalies, the four isolation levels, `SELECT ... FOR UPDATE`, deadlocks, and the link to
`@Transactional` in Spring Boot.

One step because in practice you learn transactions by wrapping a destructive `UPDATE` in one.

**Exit question:** *what happens if the second `save()` fails inside a `@Transactional` method, and what SQL is Spring actually issuing?*
**Done:** `Review: ... ≥ 80% on 10-dml-transactions.sql` · exit question aloud

---

### Step 9 — Schema design: constraints and modelling

**Why here:** a constraint is only meaningful once you have written the `UPDATE` it blocks (Step 8)
and met the `NULL` it treats specially (Step 4) — and it is late because a screening asks you to
*query* first and to *model* second, usually only in the second interview.
**Exercises:** `practice/sql/11-schema-design.sql` — 12
**Coverage:** `Schema design — constraints and integrity`, `Schema design — modelling decisions`
**Reinforces:** Step 4 — `NULL` in a `UNIQUE` constraint; Step 8 — a constraint violation is the race an application check cannot win
**Moment 2 config:** two runs, both `COUNT = 6` — `TOPIC = schema-design`, then `TOPIC = normalization`

**Concepts:** primary and foreign keys, which side of a 1:N carries the FK, composite keys on a junction table,
`ON DELETE` behaviour, `NOT NULL` / `UNIQUE` / `CHECK`, why a database constraint is not made
redundant by Bean Validation, natural vs surrogate keys, soft vs hard delete, and 1NF/2NF/3NF
**by name** — Spanish screenings ask "¿qué es la tercera forma normal?" verbatim.

**Exit question:** *explain the TimeTrack data model out loud in three sentences, then say where each foreign key lives and why it cannot go on the other side.*
**Done:** `Review: ... ≥ 80% on 11-schema-design.sql` · exit question aloud

---

### Step 10 — Data types and DDL

**Why here:** it writes by hand the constraints Step 9 only reasoned about, so it needs that step
first; putting DDL before modelling would produce syntax with nothing to say about why the column is
`NOT NULL`.
**Exercises:** `practice/sql/12-data-types-ddl.sql` — 12
**Coverage:** `Data types`, `DDL — creating and evolving a schema`
**Reinforces:** Step 9 — every constraint from that step is now written by hand in `CREATE TABLE`
**Moment 2 config:** two runs, both `COUNT = 6` — `TOPIC = data-types`, then `TOPIC = ddl`

**Concepts:** `NUMERIC` vs `FLOAT`, `TIMESTAMP` vs `TIMESTAMPTZ`, `DATE` for a business day, `VARCHAR` vs `TEXT`,
`SERIAL` vs `IDENTITY`, `JSONB` vs a real table. Then writing `CREATE TABLE` / `ALTER TABLE` by hand.

Written, not queried: the deliverable is a schema you can produce from a blank editor, because
`ddl-auto` has been doing it for you in TimeTrack.

**Exit question:** *write `CREATE TABLE time_entries` from memory, constraints included.*
**Done:** `pgAdmin: the hand-written schema in 12-data-types-ddl.sql creates all three TimeTrack tables from empty, constraints included` · exit question aloud

---

### Step 11 — Indexes and query plans

**Why here:** you cannot read a plan for a query shape you cannot yet write, so it comes after joins,
aggregation and windows; and it needs Step 10's `CREATE TABLE` because `UNIQUE` and `PRIMARY KEY` are
where a junior's first indexes actually come from.
**Exercises:** `practice/sql/13-indexes.sql` — 12
**Coverage:** `Indexes`, `Reading a query plan and diagnosing slowness`
**Reinforces:** Step 10 — `UNIQUE` and `PRIMARY KEY` create their index automatically; Step 1 — the join column is the one that needs one
**Moment 2 config:** `TOPIC = indexes`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** what an index is and its write cost, why PostgreSQL does not index a foreign key column, when not to
index, composite index column order, non-sargable predicates, leading-wildcard `LIKE`, `EXPLAIN` vs
`EXPLAIN ANALYZE`, estimated vs actual rows, when a `Seq Scan` is correct, the join node types.

**Exit question:** *your two-column index on `(user_id, work_date)` is being ignored by a query filtering only on `work_date`. Why?*
**Done:** `pgAdmin: EXPLAIN on a seeded table shows Seq Scan before CREATE INDEX and Index Scan after` · exit question aloud

---

### Step 12 — Working with a live database and reading errors

**Why here:** every error it teaches to recognise is a Step 9 constraint firing, so the constraints
must already be understood; it sits last before the capstone because it is the only step that leaves
pgAdmin, and a server without a GUI is a job-day problem, not a screening one.
**Exercises:** `practice/sql/14-live-database.sql` — 12
**Coverage:** `Working with a live database`, `Reading PostgreSQL errors`, `Type behaviour at runtime`
**Reinforces:** Step 9 — every error message here is a constraint from that step firing
**Moment 2 config:** `TOPIC = live-database`, `COUNT = 12` · focus: *(none — the whole topic)*

**Concepts:** `psql` basics (`\dt`, `\d`, `\l`, `\i`), `information_schema`, the `public` schema and `search_path`,
roles and `GRANT`, `pg_dump` and restoring a dump. Then the exact text of the eight errors a junior
must recognise on sight, SQLSTATE codes (`23505`, `23503`, `23502`, `23514`), integer division
truncating silently, division by zero aborting the query, PostgreSQL refusing implicit casts.

The one step where you deliberately leave pgAdmin: a server does not have a GUI, and interviewers ask.

**Exit question:** *`relation "users" does not exist` — name the three real causes.*
**Done:** `Terminal: psql connects, \dt lists the TimeTrack tables, and \i loads a .sql file` · exit question aloud

---

### Step 13 — Writing a report query (capstone)

**Why here:** last by definition — it introduces no syntax and instead composes every earlier step
under time pressure, which is the one thing drilling topic by topic never produces on its own.
**Exercises:** `practice/sql/15-report-queries.sql` — 8
**Coverage:** `Writing a report query`
**Reinforces:** everything; this is the integration step
**Moment 2 config:**

```
MODE  = practice
TOPIC = report-queries
COUNT = 8
```

**Focus:** none — the whole topic.

The prompt's `report-queries` topic already builds its own TimeTrack setup block (`users`, `projects`,
`time_entries`) instead of the bookstore, marks every exercise Challenge, and states a 10-minute
target per exercise — nothing extra to add to the config.

**Concepts:** no new syntax. Timed exercises that hand you a requirement in prose and expect the whole
query: mapping the requirement onto the clause skeleton, choosing the driving table so zero-row groups
survive, `COALESCE(SUM(...), 0)`, aliasing output columns, and where formatting belongs.

**Exit question:** *"per project, total approved hours this month, only projects above 40h" — write it without stopping.*
**Done (overrides the standard condition):** `Timed: 3 report requirements written correctly from prose in under 10 minutes each, no reference open` · exit question aloud

---

## Section 7 — Branch and commit rules

Study materials follow the **active branch** — no direct commits to `main` (`CLAUDE.md`, changed
2026-07-14). There is no dedicated SQL branch: `practice/sql/` and `PROGRESS.md` commit
on whatever feature branch the morning project block is on.

- **Before any SQL session, check the branch has the latest `practice/sql/`.** A feature branch cut
  before the last SQL commit still carries the old exercise files, and appending to them silently
  drops the newer exercises when it merges. This has already happened once: on 2026-07-22
  `fix/backend-backlog` carried a 20-exercise `01-basics.sql` while `main` had 40 plus a whole
  the old `02-joins.sql` — resolved by merging `main` into the branch (G0).
  Check with `git log --oneline main -1 -- practice/sql/` against your branch before starting.
- Exercise files are **Victor's authorship** → Claude never commits them, only prints the commands.
- Commits stay atomic: the exercise file and its `PROGRESS.md` update are one commit.

---

## Section 8 — Progress tracking

Status is driven by the **scored** count (§5's third definition), never the written or merely answered
one. A row moves to ✅ only after a `review` run has graded it.

| Step | Topic | Exercises file | Scored / target | Status |
|------|-------|----------------|-----------------|--------|
| 0 | Querying basics | `01-basics.sql` + `02-execution-order-set-ops.sql` | 20 / 30 *(01: 20/20 closed, 40/40 correct 2026-07-22 incl. 20 repaso; 02: 0/10 answered)* | in progress ⏳ |
| 1 | JOINs | `03-joins.sql` | 0 / 22 | not started |
| 2 | Aggregates and grouping | `04-aggregates.sql` | 0 / 12 | not started |
| 3 | JOIN pitfalls | `05-join-pitfalls.sql` | 0 / 12 | not started |
| 4 | NULL and three-valued logic | `06-nulls.sql` | 0 / 12 | not started |
| 5 | Subqueries, CTEs, views | `07-subqueries-ctes.sql` | 0 / 16 | not started |
| 6 | Date and string functions | `08-dates-strings.sql` | 0 / 12 | not started |
| 7 | Window functions | `09-window-functions.sql` | 0 / 12 | not started |
| 8 | DML and transactions | `10-dml-transactions.sql` | 0 / 16 | not started |
| 9 | Schema design | `11-schema-design.sql` | 0 / 12 | not started |
| 10 | Data types and DDL | `12-data-types-ddl.sql` | 0 / 12 | not started |
| 11 | Indexes and query plans | `13-indexes.sql` | 0 / 12 | not started |
| 12 | Live database and errors | `14-live-database.sql` | 0 / 12 | not started |
| 13 | Report queries (capstone) | `15-report-queries.sql` | 0 / 8 | not started |

**20 of 200 first-pass exercises scored** (Step 0's `#01–#20`, all correct), plus a
20-exercise review batch that does not count. `PROGRESS.md` holds the
authoritative status; this table is the at-a-glance copy. Both are updated by the §4 ritual, in the
same commit. Review batches never change a row here.

---

## Section 8b — Revision points

**Revision is scheduled, not felt.** A concept you have forgotten does not feel rusty — it feels
learned, which is exactly why "revise when it feels shaky" cannot be the trigger. This section fixes
both halves of that: *when* revision happens, and *what* it drills.

### The cadence — one revision point every 3 exercise files

Fixed, never left to judgement. A revision point fires when the third file since the previous one has
been **scored**, and it re-drills the concepts of those three files. The full schedule, decided up
front (nothing invented mid-session):

| Point | Fires when | Re-drills the files |
|-------|-----------|---------------------|
| **R1** | Step 1 closes (`03-joins.sql` scored) | `01-basics`, `02-execution-order-set-ops`, `03-joins` |
| **R2** | Step 4 closes (`06-nulls.sql` scored) | `04-aggregates`, `05-join-pitfalls`, `06-nulls` |
| **R3** | Step 7 closes (`09-window-functions.sql` scored) | `07-subqueries-ctes`, `08-dates-strings`, `09-window-functions` |
| **R4** | Step 10 closes (`12-data-types-ddl.sql` scored) | `10-dml-transactions`, `11-schema-design`, `12-data-types-ddl` |
| **R5** | Step 12 closes (`14-live-database.sql` scored) | `13-indexes`, `14-live-database` |

**R2 and R3 are the two hard checkpoints.** R2 closes the screening core (Steps 0–4) and R3 closes the
second block (Steps 5–7), where each concept has been drilled exactly once (invariant 1) and whatever
was failed is still sitting open in `MISTAKES.md`. Neither is skippable, and neither waits for a topic
to *feel* rusty. Each clears when its span has no `## Open` row left in `MISTAKES.md`.

R5 covers two files rather than three because the capstone (`15-report-queries.sql`) is itself the
integration pass over everything — a revision point immediately before it would drill the same ground
twice.

### The focus — read from the record, never from a feeling

Every revision point runs Moment 2b with its `FOCUS` taken from the **open rows of
`practice/sql/MISTAKES.md`** for the files in its span — the written record of what was actually
answered wrong. Not "what feels rusty". **Order them by `Times` descending**: the concept failed three
times earns the batch before the one failed once. If a span has no open rows, the point still fires, and `FOCUS`
becomes the concepts of those files that have appeared in the fewest exercises.

A revision point clears when the open rows in its span are closed by a later scored run.

### A revision batch is extra

It never counts toward a step's first-pass target in §5, never moves a `Scored / target` figure, and
never flips a status in §8. Without that rule the plan starts congratulating itself for repetition:
the same twenty exercises done twice would read as forty exercises of progress.

---

## Section 9 — Quality gates: which prompt to run when

A **gate** is a checkpoint where a quality prompt runs. Same logic as the project standard: run each
prompt at the point where the file it *reads* has just become accurate, and before the prompt that
*consumes* its output.

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G0 — Branch sync** ✅ 2026-07-22 | Before the first SQL session on any branch | *(no prompt — `git merge main` into the branch)* | Appending to a stale file loses exercises at merge time. Done once on `fix/backend-backlog`; re-check on every future branch. |
| **G1 — Step ritual** | Every step's done conditions pass | *(no prompt — the §4 ritual, by hand)* | The `step-complete` skill only covers project steps and will not fire for SQL. Without this, every later gate reads a stale `PROGRESS.md`. |
| **G2 — Coverage refresh** ✅ 2026-07-18 | Once, before Step 0; again if a real job posting reveals a gap | `notes/prompts/knowledge/coverage/coverage-prompt.md` · `TOPIC = sql` (logged in `notes/prompts/_run-tracker.md`) | Coverage is the root of this plan. Refresh it *before* building on it, not after. |
| **G3 — PROGRESS accurate** | After **Step 13** closes | `notes/prompts/strategy/tracking/progress-update-prompt.md` (it has a dedicated SQL subagent) | Reconciles the whole SQL section in one pass, catching anything the per-step ritual missed. Must precede G4. |
| **G4 — Roadmap resync** | After G3 | `notes/prompts/strategy/tracking/roadmap-review-prompt.md` | The roadmap's SQL gate can only be marked cleared once `PROGRESS.md` says the track is finished. |

**The mandatory revision checkpoints are not gates here — they are revision points R1–R5 in §8b**, and
that is the only place they are scheduled from.

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G0 → G2 → steps (G1 each, with R1–R5 firing on the §8b cadence) → G3 → G4`.
G0 before anything because a stale branch corrupts the exercise files themselves. G3 before G4 because
`roadmap-review` reads `PROGRESS.md`.

## Section 10 — Consistency invariants

Cross-checks between sections. Verify these whenever this plan is edited:

1. **Coverage vs steps** — every section of `notes/sql/coverage.md` is claimed by exactly one step in
   §6, or listed in §Z as deliberately excluded. No section unclaimed, none in two steps. (This is
   about coverage **section names**, not the prompt's `TOPIC` values — two steps may share a `TOPIC`.)
2. **Steps vs exercise files** — every step in §6 names an exercise file that appears in §5, and every
   file in §5 belongs to a step.
3. **Exercise counts** — every step in §6 states a count; the per-step counts for a shared file sum to
   that file's first-pass target in §5; §8's totals match §5's. A file whose *written* count exceeds
   its target is not a violation — that is a review batch (Moment 2b) and is expected.
4. **Step sizing** — no generation run asks for more than 12 exercises and no step targets more than
   22; anything above 12 is split into two runs (a file's total may be higher when several steps
   write into it). **One recorded exception, not to be repeated:** Step 0 targets 30, because its
   first 20 exercises pre-date the exercise prompt (hand-written, never a generation run) and the
   schema change split the rest into a second file — see §6, step sizing.
5. **§0 vs §8** — the Current step in §0 is the first step row in §8 that is not ✅. Every row of that
   table is a step: nothing else is tracked there.
6. **§0 Next revision point vs §8b** — the Next revision point in §0 is a real point from §8b, and the
   first one whose trigger has not fired yet given the §0 Current step.
7. **Done conditions** — every step's done condition matches one of the five formats in §3, and
   nothing outside that list appears in a `Done:` line. No vague condition survives an edit.
8. **Revision cadence** — a revision point in §8b lands at least every **3 exercise files** of §5, and
    every revision point names its focus source as the open rows of `practice/sql/MISTAKES.md`. No
    revision batch is counted in a §5 target or a §8 status. A span of four files with no revision
    point between them is a violation, not a scheduling preference.
9. **Prompt paths and keys** — every prompt this plan names exists at the path given, and every config
   it says to paste uses only that prompt's real keys (`sql-exercises-prompt.md`: `MODE`, `TOPIC`,
   `COUNT`, `FILE` — `FOCUS` and `REVIEW` are derived from the §6 step, never pasted). A plan pointing
   at a moved prompt or an invented key rots silently: the run happens and produces something else.
10. **Extendable without rewriting** — growth is the normal case here, not a special event. When
    `coverage.md` gains a `## ` section (G2, or a job posting revealing a gap), it becomes a **new
    step**, added by this procedure and nothing else:
    - **Position it by dependency, not by number.** Insert it after the last step whose concepts it
      needs and before the first step that needs it, and write the one-sentence reason into its
      `Why here:` line — that reason is what lets the next insertion be placed correctly.
    - **Do not renumber.** Existing step numbers stay as they are, closed steps above all: a step
      inserted between Steps 5 and 6 is `Step 5b`. Step numbers are labels, not an ordering key —
      §6's reading order is the ordering, and §5 has already decoupled file numbers from step
      numbers for the same reason.
    - **It takes its own file.** A new step never appends to a file another step already targets:
      one new row at the end of §5 (next free `NN-`, its first-pass target, status *to create*),
      one new row in §8 at its reading position, `0 / target`, *not started*.
    - **Re-check the invariants it moves** — 1 (the new section is now claimed once), 4 (target ≤ 22,
      runs ≤ 12), 8 (a revision point still lands at least every 3 files in §5 — a new file may push
      a span to four, in which case §8b gains a point or an existing one moves).
    - The reverse case: a step claiming a coverage section that no longer exists is re-pointed at the
      section that replaced it, or removed with its §5 and §8 rows — never left claiming a name that
      is not in `coverage.md`.

    Only exercise steps are added this way. A new coverage section never adds a note, Q&A or
    simulation task to this plan — those tracks run separately, on their own prompts, and pick the
    new section up on their own runs.

---

## Section 11 — Closure

The SQL track is finished only when every box is ticked. A failed condition means going back, not
shipping.

```
- [x] practice/sql/ is current on the working branch (G0) — 2026-07-22
- [x] coverage-prompt TOPIC=sql has run — coverage.md current (G2) — 2026-07-18
- [ ] Steps 0–13 all closed, each with its §4 ritual (G1): scored condition + exit question aloud
- [ ] All 200 first-pass exercises answered and scored ≥ 80% (review batches are extra and uncounted)
- [ ] All five revision points R1–R5 (§8b) fired on cadence — no stale open rows in MISTAKES.md
- [ ] Capstone timed condition met: 3 report queries from prose, under 10 minutes each
- [ ] progress-update has run — PROGRESS.md SQL section reflects all 14 steps (G3)
- [ ] roadmap-review has run — the SQL gate in ROADMAP.md is marked cleared (G4)
```

---

## Section Z — Out of scope

**Not planned here — three separate tracks, each with its own prompt and its own schedule:**

- **SQL notes** (`notes/sql/`) — run `/notes-audit` when Victor decides to. This plan never schedules a
  note, never lists a note file, and no step closes on one.
- **SQL interview Q&A** (`notes/interview-prep/`) — run `/interview-prep-audit`. Same rule.
- **SQL simulations** (`practice/simulations/`) — run the simulation prompts. Same rule.

**Coverage sections deliberately excluded from the steps:** everything in
`notes/sql/future-learning.md`, plus the `Programmable database objects` coverage section (triggers,
stored procedures) — recognise them in a legacy codebase, do not drill them. Revisit only if a job
posting asks for them.
