# SQL Learning Plan

**Purpose:** the compass for the 12:30 SQL block, built to the same contract as a project
`PLANNING.md`. `notes/sql/coverage.md` says *what* must be learned; this file says *in what order*,
*which files it produces*, *how many exercises each one gets*, *which prompt runs at which moment*,
*what to update when a step closes*, and *when the whole track is finished*.

**Database:** PostgreSQL (local, pgAdmin). **Schema:** the canonical bookstore schema defined in
`notes/prompts/practice/sql-exercises-prompt.md` (`authors`, `publishers`, `genres`, `books`,
`customers`, `orders`, `order_items`, `reviews`) — that prompt is the single source of truth for it.
The capstone switches to the TimeTrack model.

> ⚠️ **`01-basics.sql` carries an older, thinner schema** (`order_books` with no `quantity` or
> `unit_price`, `authors.nationality`, `books.year`). The prompt now detects this and asks before
> generating. Steps 2, 3 and 13 need `quantity`/`unit_price` to be possible at all, so the canonical
> schema has to be adopted at the latest when Step 2 creates `03-aggregates.sql` — which is a new
> file, so it gets the canonical setup block for free.

**Target:** pass the SQL half of a technical screening at NTT Data / Capgemini / Indra, and write the
report queries TimeTrack needs without looking anything up.

---

## Section 0 — Session quick reference

**Read this first every SQL block. Update it at the start of every session.**

| | |
|---|---|
| **Current step** | Step 0 — Querying basics (40 answered, **20 first-pass scored 40/40 correct**, target 30) |
| **Current branch** | the active feature branch (study materials follow it — see §7) |
| **Done condition** | `Review: sql-exercises MODE = review scores ≥ 80% on 01-basics.sql` |
| **Next gate** | G3 — split `notes/sql/` into `en/` + `es/` (G0 ✅ 2026-07-22, G2 ✅ 2026-07-18) |
| **Blocked on** | nothing. The next action is the Moment 2 run of Step 0 (`MODE = practice`, `TOPIC = basics`, `COUNT = 10`) — the review is done and clean, what is missing are the last 10 first-pass exercises. |
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

Every step runs the same six moments. **The prompts run in a separate conversation, never in the
daily 12:30 session.** Each moment states the trigger, the prompt, and the config to paste.

### Moment 1 — Read the concept list

**Trigger:** the very start of the step, before writing a single query.
**Prompt:** none. Open `notes/sql/coverage.md` and read the sections listed for that step.

---

### Moment 2 — Generate the exercises  ▶ RUN A PROMPT

**Trigger:** immediately after Moment 1, with the exercise file still empty.
**Prompt:** `notes/prompts/practice/sql-exercises-prompt.md` — paste into a **new chat**.

```
MODE  = practice
TOPIC = <the step's TOPIC, given per step in §6>
COUNT = <the step's COUNT, given per step in §6 — never the default>
FOCUS = <the step's FOCUS, given per step in §6>
```

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

**Trigger:** whenever a topic feels rusty — including a step already closed ✅. Not scheduled, not
gated, entirely your call. This is how `01-basics.sql` grew from 20 to 40 exercises: #21–#40 are a
deliberate second pass over the same concepts, and that is a legitimate, valuable use of the block.

**Prompt:** the same `sql-exercises-prompt.md`, `MODE = practice`, on the topic being revisited.

```
MODE  = practice
TOPIC = <the topic being revisited>
COUNT = 8
FOCUS = <the concepts that feel rusty — narrow it; a blank FOCUS regenerates the whole topic>
```

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
- Adds questions to `notes/interview-prep/en/sql.md` + `es/sql.md` for each conceptual gap.

It cannot close a step on its own, and it will say so: the notes in `en/` + `es/` and the exit question
are outside its reach. Those two are yours (Moments 5 and 6).

**Below 80% → do not advance.** Re-run Moment 2 with `FOCUS` narrowed to the failed concepts, then
repeat Moments 3–4. This is a hard stop, not a suggestion: every later step assumes the earlier one.

---

### Moment 5 — Write the note  ▶ RUN A PROMPT

**Trigger:** after the exercises score ≥ 80% — never before. Drilling comes first so the note explains
something your hands have already met.
**Prompt:** `/notes-audit` inside Claude Code, **one run per file** listed in the step.

```
SCOPE = file
FILE  = notes/sql/en/NN-name.md
```

It authors the English, reviews it cold, translates to `es/`, reviews the Spanish blind, and commits
each file atomically. Nothing to do while it runs.

---

### Moment 6 — Close the step  ▶ RUN THE STEP RITUAL

**Trigger:** all three done conditions met.
**Prompt:** none — but the ritual in §4 is mandatory. Skipping it is what makes every later gate read
stale files.

---

## Section 3 — Done-condition format

Every done condition in §0 and §6 uses **one** of these four formats exactly. Nothing else is valid —
"I understand joins" is not testable and is not allowed.

- `Review: sql-exercises MODE = review scores ≥ [n]% on [file]`
- `pgAdmin: [query] returns [concrete result]`
- `Aloud: [the exit question] answered from memory, nothing open`
- `Timed: [n] queries from prose in under [m] minutes each, no reference open`

Every step closes on **three** conditions together: the first one, the notes existing in both
languages, and the `Aloud:` exit question. The capstone replaces the first with a `Timed:` one.

---

## Section 4 — Step-complete ritual

**When a step's done conditions pass, update all four of these in the same commit.** This is the SQL
equivalent of the `step-complete` skill, which only covers project steps and will not fire here.
Partial updates are the real failure mode — do all four or write down why not.

**Two of the four are now automated** — `sql-exercises` in `review` mode does them (its Step 4), so the
ritual is mostly a verification. Check them rather than redo them.

1. **`PROGRESS.md`** *(automated)* — the SQL section, two edits: each concept added to the **concept
   list** one specific line at a time (never grouped: `HAVING filters groups after aggregation, WHERE
   filters rows before` is a line; "aggregation" is not), and the row in the **exercises table**
   updated with the real count and status ✅ / ⏳.
2. **This file** *(automated)* — the step's row in §8, and §0 refreshed (current step, done condition,
   next gate, last updated).
3. **`CLAUDE.md`** *(manual)* — bump the `notes/sql/` "next file:" counter if the step created a new
   note number. The prompt never touches `CLAUDE.md`.
4. **`notes/sql/coverage.md`** *(manual)* — if the step surfaced a concept genuinely missing from
   coverage, add it there. Do not add it to this plan instead.

A step is closed only when its **notes exist in `en/` + `es/`** and the **exit question** has been
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
  scored is the state `01-basics.sql` is in today: 40 queries written, zero validated.
- *Target* = the **first-pass** exercises the step needs. **Review batches (Moment 2b) are extra and
  uncounted** — a file legitimately grows past its target forever, and that is not drift.

`01-basics.sql` shows all three: 40 written, of which ~20 are a review batch, against a first-pass
target of 30.

| File | Step(s) | Written | Answered | Scored | First-pass target | Status |
|------|---------|---------|----------|--------|-------------------|--------|
| `01-basics.sql` | 0 | 40 *(20 review)* | 40 | **20** *(+20 review, uncounted)* | 30 | scored 40/40 on 2026-07-22 — 10 first-pass exercises still to write |
| `02-joins.sql` | 1 | 0 | 0 | 0 | 22 | deleted 2026-07-22 — to regenerate |
| `03-aggregates.sql` | 2 | 0 | 0 | 0 | 12 | to create |
| `04-join-pitfalls.sql` | 3 | 0 | 0 | 0 | 12 | to create |
| `05-nulls.sql` | 4 | 0 | 0 | 0 | 12 | to create |
| `06-subqueries-ctes.sql` | 5 | 0 | 0 | 0 | 16 | to create |
| `07-dates-strings.sql` | 6 | 0 | 0 | 0 | 12 | to create |
| `08-window-functions.sql` | 7 | 0 | 0 | 0 | 12 | to create |
| `09-dml-transactions.sql` | 8 | 0 | 0 | 0 | 16 | to create |
| `10-schema-design.sql` | 9 | 0 | 0 | 0 | 12 | to create |
| `11-data-types-ddl.sql` | 10 | 0 | 0 | 0 | 12 | to create |
| `12-indexes.sql` | 11 | 0 | 0 | 0 | 12 | to create |
| `13-live-database.sql` | 12 | 0 | 0 | 0 | 12 | to create |
| `14-report-queries.sql` | 13 | 0 | 0 | 0 | 8 | to create |

**First-pass total when the track is done: 200 exercises across 14 files.** Review batches add on top
and are deliberately not budgeted — 40 written today, 40 answered, 20 first-pass scored.

**Two header formats exist, and that is deliberate.** The prompt handles both — do not "fix" either
one by hand.

*Legacy* — `01-basics.sql` only, written before the prompt existed. (`02-joins.sql` was the other one;
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

### Note files — `notes/sql/en/` + `notes/sql/es/`

**Fourteen files already exist** (`01-data-types` … `14-postgresql-specifics`) but sit in the topic
root, **not yet split into `en/` and `es/`**. Gate G3 fixes that once, before any note work.

Files this plan **creates new**, numbered in the order the plan reaches them (`CLAUDE.md` says the
next free number for `notes/sql/` is `15-`):

| # | English file | Spanish counterpart | Created in |
|---|--------------|---------------------|-----------|
| 15 | `en/15-set-operations.md` | `es/15-operaciones-de-conjuntos.md` | Step 0 |
| 16 | `en/16-nulls-and-three-valued-logic.md` | `es/16-nulls-y-logica-de-tres-valores.md` | Step 4 |
| 17 | `en/17-date-and-string-functions.md` | `es/17-funciones-de-fecha-y-texto.md` | Step 6 |
| 18 | `en/18-ddl.md` | `es/18-ddl-creacion-de-esquemas.md` | Step 10 |
| 19 | `en/19-query-plans.md` | `es/19-planes-de-ejecucion.md` | Step 11 |
| 20 | `en/20-live-database-and-errors.md` | `es/20-base-de-datos-en-vivo-y-errores.md` | Step 12 |

Files this plan **extends** (they exist; the step adds sections or resolves TODOs): `01-data-types`,
`02-relationships`, `03-select`, `04-where`, `05-order-by-limit`, `06-joins`, `07-aggregates`,
`08-dml`, `09-subqueries`, `10-indexes`, `11-transactions`, `12-ctes-and-views`, `13-window-functions`,
`14-postgresql-specifics`.

**Every new file lands in `en/` and `es/` in the same `/notes-audit` run** — the two folders are never
allowed to be out of sync (`CLAUDE.md`, bilingual notes rule).

---

## Section 6 — The steps

The order is not the order of `coverage.md`. It follows how the concepts actually depend on each
other, and front-loads what a screening asks first.

**Step sizing:** a step is a handful of 12:30 sessions, never weeks. **No single generation run asks
for more than 12 exercises, and no step targets more than 22** — that ceiling is why schema design is
split across Steps 9 and 10 instead of being one 36-exercise block. A step above 12 is always split
into two runs (Steps 1, 5, 8, 9, 10), which also keeps each batch's difficulty split meaningful.

Step 1 is the only step at the 22 ceiling, deliberately: JOINs is the single most-tested SQL topic at
junior level, and it absorbed the ten hand-written exercises the step used to start from. (A file's
*total* can exceed its step's target when several steps write into it, as `01-basics.sql` does.)

> **A note on `TOPIC` values.** The `TOPIC` in a Moment 2 config is the *prompt's* vocabulary, not a
> `coverage.md` section name. Two steps may pass the same `TOPIC` with different `FOCUS` values without
> either of them claiming the same coverage section — invariant 1 in §10 is about coverage sections
> only.

---

### Step 0 — Querying basics ⏳ (20/30 first-pass scored, +20 review)

**Exercises:** `practice/sql/01-basics.sql` — 40 answered in total: **20 first-pass (#01–#20), 20 review
(#21–#40), 10 first-pass still to go**. Reviewed 2026-07-22: **40/40 correctas (100%)** — el score no
cierra el paso porque el target de primera pasada son 30.
**Coverage:** `Querying basics`, `Filtering and pattern matching`, `Sorting, pagination, and determinism`, `Set operations`
**Notes — extend:** `03-select`, `04-where`, `05-order-by-limit` · **create:** `15-set-operations`
**Reinforces:** — (first step)

Concepts covered across both batches: `SELECT`, `WHERE` (`AND`/`OR`/`IN`/`NOT IN`/`LIKE`/
`ILIKE`/`NOT LIKE`/`BETWEEN`/`NOT BETWEEN`/`IS NOT NULL`), `ORDER BY` (single, multiple, by alias),
`LIMIT`/`OFFSET`/`FETCH`, `DISTINCT`, `DISTINCT ON`, expressions and aliases, concatenation, `LENGTH()`.

Still missing before this step closes — the ten remaining exercises target exactly these:
- SQL execution order (`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`) and where an
  alias is visible — the mental model every later step leans on
- `CASE WHEN` in `SELECT`
- `UNION` vs `UNION ALL`, `INTERSECT`, `EXCEPT`
- `NULLS FIRST` / `NULLS LAST`, and why `LIMIT` without `ORDER BY` is non-deterministic
- Keyset pagination vs deep `OFFSET`

**Moment 2 config:**

```
MODE  = practice
TOPIC = basics
COUNT = 10
FOCUS = execution order, alias visibility per clause, CASE WHEN in SELECT,
        UNION vs UNION ALL, INTERSECT, EXCEPT, NULLS FIRST/LAST,
        LIMIT without ORDER BY, keyset vs deep OFFSET pagination
```
Add: *"append to `practice/sql/01-basics.sql`, continuing the numbering from #40"* + the no-repetition line.

**Exit question:** *why does an alias defined in `SELECT` work in `ORDER BY` but raise an error in `WHERE`?*
**Done:** `Review: sql-exercises MODE = review scores ≥ 80% on 01-basics.sql` · notes in `en/` + `es/` · exit question aloud

---

### Step 1 — JOINs (0 scored / 22 target)

**Exercises:** `practice/sql/02-joins.sql` — 22, generated from scratch in **two runs of 11**. The
original ten hand-written statements were deleted on 2026-07-22: they were never answered, and they
carried the old thin schema, so regenerating gets the canonical one and the current exercise format
(`-- Your answer:` + `-- ✅ Corregido` markers) instead of perpetuating the legacy format into a
second file.
**Coverage:** `JOINs`
**Notes — extend:** `06-joins`
**Reinforces:** Step 0 — execution order (`FROM + JOIN` runs first, which is why the join happens before `WHERE`)

Run 1 builds the foundation: `INNER JOIN` (two tables, named columns, aliases, three tables, combined
with `WHERE` / `ORDER BY` / `LIMIT`) and `LEFT JOIN` (keeping unmatched rows, and the `IS NULL`
anti-join). Run 2 covers the rest: `RIGHT JOIN` and why it is rewritable as a `LEFT`,
`FULL OUTER JOIN`, self join, `USING` vs `NATURAL JOIN` and why `NATURAL` is banned in real
codebases, `EXISTS`/`NOT EXISTS` as semi-join and anti-join vocabulary.

**Moment 2 config — run 1** *(new file: it generates the canonical setup block)*:
```
MODE  = practice
TOPIC = joins
COUNT = 11
FOCUS = INNER JOIN across two and three tables, table aliases, LEFT JOIN keeping
        unmatched rows, LEFT JOIN + IS NULL as an anti-join
```

**Moment 2 config — run 2** *(appends, continuing from #11)*:
```
MODE  = practice
TOPIC = joins
COUNT = 11
FOCUS = RIGHT JOIN, FULL OUTER JOIN, self join, USING vs NATURAL JOIN,
        EXISTS as a semi-join, NOT EXISTS as an anti-join
```
Add the no-repetition line to both runs. Nothing else: the file no longer exists, so run 1 writes the
canonical schema itself and there is no legacy-schema prompt to answer.

The single most-tested SQL topic at junior level, which is why it comes before aggregation: in a real
screening `GROUP BY` almost always sits on top of a join.

**Exit question:** *given `authors` and `books`, which join do you use for "every author, including those with no books", and what does the row look like for an author with none?*
**Done:** `Review: ... ≥ 80% on 02-joins.sql` (#01–#22) · `06-joins` in `en/` + `es/` · exit question aloud

---

### Step 2 — Aggregates and grouping

**Exercises:** `practice/sql/03-aggregates.sql` — 12
**Coverage:** `Aggregates and grouping`
**Notes — extend:** `07-aggregates`
**Reinforces:** Step 1 — a join is the surface `GROUP BY` almost always sits on top of
**Moment 2 config:** `TOPIC = group-by`, `COUNT = 12`, `FOCUS =` *(blank — full topic)*

`COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT)`, `SUM`/`AVG`/`MIN`/`MAX` ignoring `NULL`, `SUM`
over zero rows returning `NULL`, the `GROUP BY` rule, `HAVING` vs `WHERE`, conditional aggregation
with `CASE WHEN` and `FILTER (WHERE ...)`.

**Exit question:** *`WHERE` vs `HAVING` — which runs first, and why can't `WHERE` use `COUNT(*)`?*
**Done:** `Review: ... ≥ 80% on 03-aggregates.sql` · `07-aggregates` in both languages · exit question aloud

---

### Step 3 — JOIN pitfalls and row multiplication

**Exercises:** `practice/sql/04-join-pitfalls.sql` — 12
**Coverage:** `JOIN pitfalls and row multiplication`
**Notes — extend:** `06-joins` (second half)
**Reinforces:** Steps 1 + 2 — every pitfall here is an **aggregate over a broken join**
**Moment 2 config:** `TOPIC = join-pitfalls`, `COUNT = 12`, `FOCUS =` *(blank — full topic)*

Condition in `ON` vs in `WHERE`, the `WHERE` filter that silently turns a `LEFT JOIN` into an
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
**Done:** `Review: ... ≥ 80% on 04-join-pitfalls.sql` · `06-joins` complete in both languages · exit question aloud

---

### Step 4 — NULL and three-valued logic

**Exercises:** `practice/sql/05-nulls.sql` — 12
**Coverage:** `NULL and three-valued logic`
**Notes — create:** `16-nulls-and-three-valued-logic`
**Reinforces:** Steps 1–3 — `LEFT JOIN` producing nulls, `AVG` skipping them, `COUNT(*)` counting them
**Moment 2 config:** `TOPIC = nulls`, `COUNT = 12`, `FOCUS =` *(blank)*

`NULL = NULL`, `IS NULL` vs `= NULL`, `AND`/`OR` truth tables, `NOT IN` with a `NULL` in the subquery,
`NOT EXISTS` vs `NOT IN`, `IS DISTINCT FROM`, `NULL` in `UNIQUE`, `COALESCE`, `NULLIF`.

Right after aggregation because every `NULL` surprise you have already met now gets its mechanism
explained rather than described.

**Exit question:** *are two `NULL`s equal in SQL? Explain what `WHERE price = NULL` actually evaluates to.*
**Done:** `Review: ... ≥ 80% on 05-nulls.sql` · `16-...` in both languages · exit question aloud

> **This closes the screening core.** Steps 1–4 are what a quickfire round asks. Gate **G4** fires here.

---

### Step 5 — Subqueries, CTEs, and views

**Exercises:** `practice/sql/06-subqueries-ctes.sql` — 16 (two runs of 8)
**Coverage:** `Subqueries, CTEs, and views`
**Notes — extend:** `09-subqueries`, `12-ctes-and-views`
**Reinforces:** Step 3 — a subquery in `FROM` is how you filter on an aggregate `WHERE` cannot see
**Moment 2 config:** two runs, both `COUNT = 8`, appending to the same file — `TOPIC = subqueries`, then `TOPIC = ctes`

Subquery in `WHERE` / `FROM` / `SELECT`, `IN` vs `EXISTS`, subquery vs `JOIN`, correlated subqueries
and why they do not scale, `WITH` and chained CTEs, `CREATE VIEW`, view vs materialized view.

**Exit question:** *when would you reach for a CTE instead of a subquery, and is a CTE slower?*
**Done:** `Review: ... ≥ 80% on 06-subqueries-ctes.sql` · both notes in both languages · exit question aloud

---

### Step 6 — Date and string functions

**Exercises:** `practice/sql/07-dates-strings.sql` — 12
**Coverage:** `Date and string functions`, `PostgreSQL specifics`
**Notes — create:** `17-date-and-string-functions` · **extend:** `14-postgresql-specifics`
**Reinforces:** Step 3 — `GROUP BY DATE_TRUNC('month', ...)` is grouping by an expression
**Moment 2 config:** `TOPIC = dates-strings`, `COUNT = 12`, `FOCUS =` *(blank — full topic)*

Deliberately before window functions and the capstone: a live exercise stalls here first, and every
monthly report is `GROUP BY DATE_TRUNC('month', ...)`.

**This step owns the whole `PostgreSQL specifics` coverage section** — Step 12 uses the same prompt
`TOPIC` but claims different coverage sections.

**Exit question:** *build a monthly total from a raw `TIMESTAMP` column. Which function, and why not `EXTRACT`?*
**Done:** `Review: ... ≥ 80% on 07-dates-strings.sql` · `17-...` in both languages · exit question aloud

---

### Step 7 — Window functions

**Exercises:** `practice/sql/08-window-functions.sql` — 12
**Coverage:** `Window functions`
**Notes — extend:** `13-window-functions`
**Reinforces:** Step 3 — a window keeps the rows `GROUP BY` collapses; Step 0 — execution order explains why a window cannot sit in `WHERE`
**Moment 2 config:** `TOPIC = window-functions`, `COUNT = 12`, `FOCUS =` *(blank)*

`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`/`LEAD`, `SUM() OVER (PARTITION BY ...)`, why a window
function cannot appear in `WHERE`, window vs `GROUP BY`, the default frame, "the second highest value".

**Exit question:** *"the latest entry per user" — write the shape of the query and explain why you need a subquery around it.*
**Done:** `Review: ... ≥ 80% on 08-window-functions.sql` · `13-window-functions` in both languages · exit question aloud

> Gate **G6** (first timed simulation) fires here — you now have enough surface for a realistic test.

---

### Step 8 — DML and transactions

**Exercises:** `practice/sql/09-dml-transactions.sql` — 16 (two runs of 8)
**Coverage:** `DML — modifying data`, `Transactions`
**Notes — extend:** `08-dml`, `11-transactions`
**Reinforces:** Step 3 — `GROUP BY ... HAVING COUNT(*) > 1` is the duplicate-finding query; Step 7 — `ROW_NUMBER()` is how you delete duplicates keeping one
**Moment 2 config:** two runs, both `COUNT = 8`, appending to the same file — `TOPIC = dml`, then `TOPIC = transactions`

`INSERT` (single, multi-row, `RETURNING`), insert order with foreign keys, resetting a sequence after
seeding, `UPDATE`/`DELETE` and the missing-`WHERE` catastrophe, `DELETE` vs `TRUNCATE`, `ON CONFLICT`
upsert, finding and deleting duplicates. Then `BEGIN`/`COMMIT`/`ROLLBACK`, ACID, the three read
anomalies, the four isolation levels, `SELECT ... FOR UPDATE`, deadlocks, and the link to
`@Transactional` in Spring Boot.

One step because in practice you learn transactions by wrapping a destructive `UPDATE` in one.

**Exit question:** *what happens if the second `save()` fails inside a `@Transactional` method, and what SQL is Spring actually issuing?*
**Done:** `Review: ... ≥ 80% on 09-dml-transactions.sql` · both notes in both languages · exit question aloud

---

### Step 9 — Schema design: constraints and modelling

**Exercises:** `practice/sql/10-schema-design.sql` — 12
**Coverage:** `Schema design — constraints and integrity`, `Schema design — modelling decisions`
**Notes — extend:** `02-relationships`
**Reinforces:** Step 4 — `NULL` in a `UNIQUE` constraint; Step 8 — a constraint violation is the race an application check cannot win
**Moment 2 config:** two runs, both `COUNT = 6` — `TOPIC = schema-design`, then `TOPIC = normalization`

Primary and foreign keys, which side of a 1:N carries the FK, composite keys on a junction table,
`ON DELETE` behaviour, `NOT NULL` / `UNIQUE` / `CHECK`, why a database constraint is not made
redundant by Bean Validation, natural vs surrogate keys, soft vs hard delete, and 1NF/2NF/3NF
**by name** — Spanish screenings ask "¿qué es la tercera forma normal?" verbatim.

**Exit question:** *explain the TimeTrack data model out loud in three sentences, then say where each foreign key lives and why it cannot go on the other side.*
**Done:** `Review: ... ≥ 80% on 10-schema-design.sql` · `02-relationships` in both languages · exit question aloud

---

### Step 10 — Data types and DDL

**Exercises:** `practice/sql/11-data-types-ddl.sql` — 12
**Coverage:** `Data types`, `DDL — creating and evolving a schema`
**Notes — create:** `18-ddl` · **extend:** `01-data-types`
**Reinforces:** Step 9 — every constraint from that step is now written by hand in `CREATE TABLE`
**Moment 2 config:** two runs, both `COUNT = 6` — `TOPIC = data-types`, then `TOPIC = ddl`

`NUMERIC` vs `FLOAT`, `TIMESTAMP` vs `TIMESTAMPTZ`, `DATE` for a business day, `VARCHAR` vs `TEXT`,
`SERIAL` vs `IDENTITY`, `JSONB` vs a real table. Then writing `CREATE TABLE` / `ALTER TABLE` by hand.

Written, not queried: the deliverable is a schema you can produce from a blank editor, because
`ddl-auto` has been doing it for you in TimeTrack.

**Exit question:** *write `CREATE TABLE time_entries` from memory, constraints included.*
**Done:** `pgAdmin: the hand-written schema in 11-data-types-ddl.sql creates all three TimeTrack tables from empty, constraints included` · `18-ddl` in both languages · exit question aloud

---

### Step 11 — Indexes and query plans

**Exercises:** `practice/sql/12-indexes.sql` — 12
**Coverage:** `Indexes`, `Reading a query plan and diagnosing slowness`
**Notes — create:** `19-query-plans` · **extend:** `10-indexes`
**Reinforces:** Step 10 — `UNIQUE` and `PRIMARY KEY` create their index automatically; Step 1 — the join column is the one that needs one
**Moment 2 config:** `TOPIC = indexes`, `COUNT = 12`, `FOCUS =` *(blank)*

What an index is and its write cost, why PostgreSQL does not index a foreign key column, when not to
index, composite index column order, non-sargable predicates, leading-wildcard `LIKE`, `EXPLAIN` vs
`EXPLAIN ANALYZE`, estimated vs actual rows, when a `Seq Scan` is correct, the join node types.

**Exit question:** *your two-column index on `(user_id, work_date)` is being ignored by a query filtering only on `work_date`. Why?*
**Done:** `pgAdmin: EXPLAIN on a seeded table shows Seq Scan before CREATE INDEX and Index Scan after` · `19-...` in both languages · exit question aloud

---

### Step 12 — Working with a live database and reading errors

**Exercises:** `practice/sql/13-live-database.sql` — 12
**Coverage:** `Working with a live database`, `Reading PostgreSQL errors`, `Type behaviour at runtime`
**Notes — create:** `20-live-database-and-errors`
**Reinforces:** Step 9 — every error message here is a constraint from that step firing
**Moment 2 config:** `TOPIC = live-database`, `COUNT = 12`, `FOCUS =` *(blank — full topic)*

`psql` basics (`\dt`, `\d`, `\l`, `\i`), `information_schema`, the `public` schema and `search_path`,
roles and `GRANT`, `pg_dump` and restoring a dump. Then the exact text of the eight errors a junior
must recognise on sight, SQLSTATE codes (`23505`, `23503`, `23502`, `23514`), integer division
truncating silently, division by zero aborting the query, PostgreSQL refusing implicit casts.

The one step where you deliberately leave pgAdmin: a server does not have a GUI, and interviewers ask.

**Exit question:** *`relation "users" does not exist` — name the three real causes.*
**Done:** `Terminal: psql connects, \dt lists the TimeTrack tables, and \i loads a .sql file` · `20-...` in both languages · exit question aloud

---

### Step 13 — Writing a report query (capstone)

**Exercises:** `practice/sql/14-report-queries.sql` — 8
**Coverage:** `Writing a report query`
**Notes:** none — the capstone is drilled, not noted
**Reinforces:** everything; this is the integration step
**Moment 2 config:**

```
MODE  = practice
TOPIC = report-queries
COUNT = 8
FOCUS =
```
The prompt's `report-queries` topic already builds its own TimeTrack setup block (`users`, `projects`,
`time_entries`) instead of the bookstore, marks every exercise Challenge, and states a 10-minute
target per exercise — nothing extra to add to the config.

No new syntax. Timed exercises that hand you a requirement in prose and expect the whole query:
mapping the requirement onto the clause skeleton, choosing the driving table so zero-row groups
survive, `COALESCE(SUM(...), 0)`, aliasing output columns, and where formatting belongs.

**Exit question:** *"per project, total approved hours this month, only projects above 40h" — write it without stopping.*
**Done (overrides the standard condition):** `Timed: 3 report requirements written correctly from prose in under 10 minutes each, no reference open`

---

## Section 7 — Branch and commit rules

Study materials follow the **active branch** — no direct commits to `main` (`CLAUDE.md`, changed
2026-07-14). There is no dedicated SQL branch: `practice/sql/`, `notes/sql/` and `PROGRESS.md` commit
on whatever feature branch the morning project block is on.

- **Before any SQL session, check the branch has the latest `practice/sql/`.** A feature branch cut
  before the last SQL commit still carries the old exercise files, and appending to them silently
  drops the newer exercises when it merges. This has already happened once: on 2026-07-22
  `fix/backend-backlog` carried a 20-exercise `01-basics.sql` while `main` had 40 plus a whole
  `02-joins.sql` — resolved by merging `main` into the branch (G0).
  Check with `git log --oneline main -1 -- practice/sql/` against your branch before starting.
- Exercise files are **Victor's authorship** → Claude never commits them, only prints the commands.
- `notes/sql/` files are written by the notes pipeline → `/notes-audit` commits them itself.
- Commits stay atomic: the exercise file and its `PROGRESS.md` update are one commit; a note is another.

---

## Section 8 — Progress tracking

Status is driven by the **scored** count (§5's third definition), never the written or merely answered
one. A row moves to ✅ only after a `review` run has graded it.

| Step | Topic | Exercises file | Scored / target | Notes produced | Status |
|------|-------|----------------|-------------------|----------------|--------|
| — | `en`/`es` migration (G3) | — | — | 14 files × 2 | not started |
| 0 | Querying basics | `01-basics.sql` | 20 / 30 *(40/40 correct 2026-07-22; +20 repaso, uncounted)* | extend 03, 04, 05 · **new 15** | in progress ⏳ |
| 1 | JOINs | `02-joins.sql` | 0 / 22 | extend 06 | not started |
| 2 | Aggregates and grouping | `03-aggregates.sql` | 0 / 12 | extend 07 | not started |
| 3 | JOIN pitfalls | `04-join-pitfalls.sql` | 0 / 12 | extend 06 | not started |
| 4 | NULL and three-valued logic | `05-nulls.sql` | 0 / 12 | **new 16** | not started |
| 5 | Subqueries, CTEs, views | `06-subqueries-ctes.sql` | 0 / 16 | extend 09, 12 | not started |
| 6 | Date and string functions | `07-dates-strings.sql` | 0 / 12 | **new 17** · extend 14 | not started |
| 7 | Window functions | `08-window-functions.sql` | 0 / 12 | extend 13 | not started |
| 8 | DML and transactions | `09-dml-transactions.sql` | 0 / 16 | extend 08, 11 | not started |
| 9 | Schema design | `10-schema-design.sql` | 0 / 12 | extend 02 | not started |
| 10 | Data types and DDL | `11-data-types-ddl.sql` | 0 / 12 | **new 18** · extend 01 | not started |
| 11 | Indexes and query plans | `12-indexes.sql` | 0 / 12 | **new 19** · extend 10 | not started |
| 12 | Live database and errors | `13-live-database.sql` | 0 / 12 | **new 20** | not started |
| 13 | Report queries (capstone) | `14-report-queries.sql` | 0 / 8 | — | not started |

**20 of 200 first-pass exercises scored** (Step 0's `#01–#20`, all correct), plus a
20-exercise review batch that does not count. `PROGRESS.md` holds the
authoritative status; this table is the at-a-glance copy. Both are updated by the §4 ritual, in the
same commit. Review batches never change a row here.

---

## Section 9 — Quality gates: which prompt to run when

A **gate** is a checkpoint where a quality prompt runs. Same logic as the project standard: run each
prompt at the point where the file it *reads* has just become accurate, and before the prompt that
*consumes* its output.

| Gate | Trigger | Prompt + config | Why exactly here |
|------|---------|-----------------|------------------|
| **G0 — Branch sync** ✅ 2026-07-22 | Before the first SQL session on any branch | *(no prompt — `git merge main` into the branch)* | Appending to a stale file loses exercises at merge time. Done once on `fix/backend-backlog`; re-check on every future branch. |
| **G1 — Step ritual** | Every step's done conditions pass | *(no prompt — the §4 ritual, by hand)* | The `step-complete` skill only covers project steps and will not fire for SQL. Without this, every later gate reads a stale `PROGRESS.md`. |
| **G2 — Coverage refresh** ✅ 2026-07-18 | Once, before Step 0; again if a real job posting reveals a gap | `coverage-prompt` · `TOPIC = sql` (logged in `notes/prompts/_run-tracker.md`) | Coverage is the root of this plan. Refresh it *before* building on it, not after. |
| **G3 — Notes `en`/`es` migration** | Once, before any Moment 5 | `/notes-audit` · `SCOPE = folder` · `TOPIC = sql` | The 14 existing files sit in the topic root — `notes-audit` has never run on SQL (`_run-tracker.md`, SQL row is empty). Every step's Moment 5 targets `notes/sql/en/…`, which does not exist yet. Hard blocker. **Also fix `CLAUDE.md` line ~259 afterwards** — it already claims `notes/sql/` has `en/` and `es/`, which is not true until this gate runs. |
| **G4 — Q&A build** | After **Step 4** closes — joins + pitfalls + aggregation + nulls is the screening core | `interview-prep-audit` · `TOPIC = sql` | Builds the real Q&A bank on the half of SQL a quickfire round actually asks, while there is still time to drill it. `sql-exercises` review mode adds questions incrementally; this is the structured pass. |
| **G5 — Notes ↔ Q&A sync** | Right after G4 | `notes-and-interview-prep` · `TOPIC = sql` | Closes both directions: every note concept has a question, every question has a note. Meaningless before G4 exists. |
| **G6 — First timed simulation** | After **Step 7** closes | `simulation-generator` · `TYPE = sql`, then `simulation-review` on the finished test | You now have joins, aggregation, nulls, subqueries, dates and windows — enough surface for a realistic timed test. `PROGRESS.md` shows 0/15 simulations; this is where SQL starts filling that. |
| **G7 — PROGRESS accurate** | After **Step 13** closes | `progress-update-prompt` (it has a dedicated SQL subagent) | Reconciles the whole SQL section in one pass, catching anything the per-step ritual missed. Must precede G8. |
| **G8 — Final Q&A + roadmap resync** | After G7 | `interview-prep-audit` · `TOPIC = sql`, then `roadmap-review-prompt` | The Q&A now covers all 14 steps, and the roadmap's SQL gate can finally be marked cleared. |

**Prerequisite chain (hard — a gate run out of order gives a wrong answer, not just a late one):**
`G0 → G2 → G3 → steps (G1 each) → G4 → G5 → G6 → G7 → G8`.
G0 before anything because a stale branch corrupts the exercise files themselves. G3 before any note
work because the target folders must exist. G4 before G5 because the sync prompt needs a Q&A file to
sync against. G7 before G8 because both `interview-prep-audit` and `roadmap-review` read `PROGRESS.md`.

### Closure checklist — this plan's definition of done

The SQL track is finished only when every box is ticked. A failed condition means going back, not
shipping.

```
- [x] practice/sql/ is current on the working branch (G0) — 2026-07-22
- [x] coverage-prompt TOPIC=sql has run — coverage.md current (G2) — 2026-07-18
- [ ] notes-audit SCOPE=folder TOPIC=sql has run — all 14 files split into en/ + es/ (G3)
- [ ] Steps 0–13 all closed, each with its §4 ritual (G1)
- [ ] All 200 first-pass exercises answered and scored ≥ 80% (review batches are extra and uncounted)
- [ ] Every new note file 15–20 exists in both en/ and es/, no open TODOs
- [ ] interview-prep-audit TOPIC=sql has run after Step 4 (G4)
- [ ] notes-and-interview-prep TOPIC=sql has run — no orphan concepts either way (G5)
- [ ] At least 3 SQL simulations completed with a Pass in practice/simulations/TRACKER.md (G6)
- [ ] progress-update has run — PROGRESS.md SQL section reflects all 14 steps (G7)
- [ ] interview-prep-audit TOPIC=sql re-run on the full track, roadmap-review has run (G8)
- [ ] Capstone timed condition met: 3 report queries from prose, under 10 minutes each
```

---

## Section 10 — Consistency invariants

Cross-checks between sections. Verify these whenever this plan is edited:

1. **Coverage vs steps** — every section of `notes/sql/coverage.md` is claimed by exactly one step in
   §6, or listed in §11 as deliberately excluded. No section unclaimed, none in two steps. (This is
   about coverage **section names**, not the prompt's `TOPIC` values — two steps may share a `TOPIC`.)
2. **Steps vs exercise files** — every step in §6 names an exercise file that appears in §5, and every
   file in §5 belongs to a step.
3. **Exercise counts** — every step in §6 states a count; the per-step counts for a shared file sum to
   that file's first-pass target in §5; §8's totals match §5's. A file whose *written* count exceeds
   its target is not a violation — that is a review batch (Moment 2b) and is expected.
4. **Step sizing** — no generation run asks for more than 12 exercises and no step targets more than
   22; anything above 12 is split into two runs (a file's total may be higher when several steps
   write into it).
5. **Steps vs note files** — every note file a step creates or extends appears in §5, and every new
   file in §5 has both an `en/` and an `es/` name.
6. **§0 vs §8** — the Current step in §0 is the first row in §8 that is not ✅.
7. **§0 Next gate vs §9** — the Next gate in §0 is a real gate from §9, and the first one whose trigger
   has not fired yet given the §0 Current step.
8. **Done conditions** — every step's done condition matches one of the four formats in §3. No vague
   condition survives an edit.
9. **Note numbering vs `CLAUDE.md`** — the highest number in §5 is one below the `notes/sql/` "next
   file:" counter once every file is created.

---

## Section 11 — What is deliberately not here

Everything in `notes/sql/future-learning.md`, plus the `Programmable database objects` coverage
section (triggers, stored procedures) — recognise them in a legacy codebase, do not drill them.
Revisit only if a job posting asks for them.
