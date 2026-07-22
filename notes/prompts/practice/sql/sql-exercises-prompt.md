# SQL Exercises Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

Two modes:

- **`practice`** — generates exercises for a SQL topic and saves them to `practice/sql/`. If the topic file already exists, adds more exercises continuing the numbering.
- **`review`** — checks your answers. Paste the exercise file at the very end of the prompt.

> **▶ Run first:** nothing — `practice` generates exercises from scratch; `review` reads the answered file from `{FILE}`.

---

**How to use:** fill in `MODE` and `TOPIC`, paste the prompt into a new chat. That is the whole ritual.

Everything left blank — which file, how many exercises, which concepts — comes from
`practice/sql/PLANNING.md`, and this prompt reads it, so the default is always the plan. `COUNT` and
`FILE` are there when you want to override that for one run. In `MODE = review` you do not need to
paste the exercise file either; it is read from disk.

---

````
## Configuration — edit only this block

MODE  = [practice | review]
TOPIC = [basics | joins | join-pitfalls | group-by | nulls | subqueries | ctes | dates-strings | window-functions | dml | transactions | schema-design | normalization | data-types | ddl | indexes | live-database | report-queries | all]
COUNT =
FILE  = practice/sql/01-basics.sql
        practice/sql/02-execution-order-set-ops.sql
        practice/sql/03-joins.sql
        practice/sql/04-aggregates.sql
        practice/sql/05-join-pitfalls.sql
        practice/sql/06-nulls.sql
        practice/sql/07-subqueries-ctes.sql
        practice/sql/08-dates-strings.sql
        practice/sql/09-window-functions.sql
        practice/sql/10-dml-transactions.sql
        practice/sql/11-schema-design.sql
        practice/sql/12-data-types-ddl.sql
        practice/sql/13-indexes.sql
        practice/sql/14-live-database.sql
        practice/sql/15-report-queries.sql

**That is the entire configuration.** Do not add keys. `MODE` and `TOPIC` are required; `COUNT` and
`FILE` are optional overrides — they are there so Victor can pin the batch size or name the file
explicitly when he wants to be sure what happens, and **blank is the normal state and never an
error**. Blank means "derive it from the plan" (see the Resolution table). If more than one path is
left under `FILE`, that is a half-finished edit: stop and ask which one, do not guess. If you feel
the need to hand-tune anything *else* about a batch, the thing that needs changing is the step in
`practice/sql/PLANNING.md`, not this run.

---

## Resolution — work these out before doing anything else

**Do not ask Victor for any of these. Derive them, print what you derived, and continue.**

| Value | Where it comes from |
|-------|---------------------|
| `{FILE}` | the `FILE` key if Victor set it; otherwise the path table in `MODE = practice` Step 4, keyed by {TOPIC}. Never invent a path. |
| `{COUNT}` | the `COUNT` key if Victor set it; otherwise the `COUNT` line of the §6 step in `practice/sql/PLANNING.md` whose TOPIC matches. When the two differ, say so in one line ("COUNT del bloque = 6, el plan pide 10") and use his — the plan is the default, not a veto. |
| `{FOCUS}` | the `FOCUS` line of that same §6 step. |
| `{REVIEW}` | `no`, unless the §6 step's block is a Moment 2b reinforcement batch, which sets it to `yes`. |

`{REVIEW} = yes` means: a batch over concepts already drilled — no Intro tier, exercises labelled
`[Repaso]`, repetition allowed, and **not** counted against the step's first-pass target.

Steps in §6 sometimes carry two blocks (a first pass and a second). Use the first one whose exercise
target is not yet met according to §8 / `PROGRESS.md`. State which block you picked.

**Then print this and continue in the same turn — it is a statement, not a question:**

```
Step {N} — {step name}
Archivo: {FILE}
Ejercicios: {COUNT}   Repaso: {REVIEW}
Focus: {FOCUS}
```

Validation:
- If MODE or TOPIC is blank: print "Error: MODE and TOPIC are required." and stop.
- If {TOPIC} is not in the Step 4 path table: stop and report it.
- If `practice/sql/PLANNING.md` has no §6 step for {TOPIC}: print "Error: {TOPIC} no tiene step en el plan. Añádelo a §6 antes de correr esto." and stop — do not fall back to a default COUNT. A topic with no step is a planning gap, and silently generating 12 exercises hides it.
- If the resolved {COUNT} is not a positive integer or is less than 4: print "Warning: COUNT must be at least 4 for the difficulty distribution to work. Using COUNT = 4." and use 4.
- In review mode: {COUNT}, {FOCUS} and {REVIEW} do not apply — only {FILE}. If {FILE} does not exist: print "Error: no existe [FILE]." and stop.
- `TOPIC = all` is practice mode only; it walks every topic in the order below, resolving each one's COUNT and FOCUS from its own §6 step. See `notes/prompts/_batch-mode.md`. Review mode stays one file at a time.

Topic order (study order, and also the file-number order): basics, joins, group-by, join-pitfalls,
nulls, subqueries, ctes, dates-strings, window-functions, dml, transactions, schema-design,
normalization, data-types, ddl, indexes, live-database, report-queries. This order, the file
numbering and the step numbering are kept in sync with `practice/sql/PLANNING.md` — that file is the
source of truth. Several topics deliberately share one file (joins + join-pitfalls, subqueries +
ctes, dml + transactions, schema-design + normalization, data-types + ddl); the Step 4 path table is
authoritative.

---

## Run-start check — read the last run's report

Before anything else, read `notes/prompts/practice/sql/_last-run-report-sql-exercises.md` (it may not
exist yet — that is fine, skip silently). If it exists and its `Status:` line says `open`, surface the
Verdict in **one line** before continuing:

"Nota del último run: [verdict]."

Then continue normally. This is the same discipline the orchestrators use, adapted for a single-shot
prompt: the report is the only evidence that ever reopens a frozen prompt, and it is worthless if
nobody reads it at the start of the next run.

---

## Context

**Before starting, read these four files:**
- `CLAUDE.md` — daily schedule and teaching context (my profile and the market are in `notes/prompts/_shared-context.md`).
- `practice/sql/PLANNING.md` — **the SQL learning plan.** It owns the step order, the file numbering, how many exercises each file targets, and which coverage sections each step claims. If this prompt and that plan ever disagree about a path or an order, the plan wins and this prompt is the thing to fix.
- `PROGRESS.md` — the SQL section shows which topics are already solid.
- `notes/sql/coverage.md` — the source of truth for every SQL concept required at junior level. Read it now; in Step 3 you will use the section for {TOPIC} to define the concept scope for the exercises.

My profile is in `notes/prompts/_shared-context.md`.

My daily SQL block is 12:30–13:30. I write answers directly in the SQL file in pgAdmin
(PostgreSQL), then paste it into review mode. This block feeds into Stage 2: technical test
simulation — so exercises should reflect the kind of SQL a real consultancy test includes.

SQL is not isolated from the rest of the stack. Where relevant, connect a concept to its
Spring Boot or JPA equivalent in the exercise description (e.g. transactions → @Transactional,
schema design → @Entity + @OneToMany, indexes → N+1 query problem).

Study order (matches `practice/sql/PLANNING.md` §6 — **the file number is the step order**, so the
folder listing reads in the order the topics are learned):

```
01 basics ─ 02 joins ─ 03 group-by ─ 04 join-pitfalls ─ 05 nulls ─ 06 subqueries+ctes
  ─ 07 dates-strings ─ 08 window-functions ─ 09 dml+transactions
  ─ 10 schema-design+normalization ─ 11 data-types+ddl ─ 12 indexes
  ─ 13 live-database ─ 14 report-queries
```

Why this order and not the coverage.md order:
- **joins before aggregation** — in a real screening `GROUP BY` almost always sits on top of a join.
- **aggregation before join-pitfalls** — every pitfall worth drilling *is* an aggregate over a broken
  join: fan-out inflating `SUM`, `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN`, pre-aggregating in
  a CTE instead of `COUNT(DISTINCT)`. None of them can even be stated without `SUM` and `COUNT`, so
  join-pitfalls cannot precede group-by.
- **NULLs after aggregation** — the surprises already met (a `LEFT JOIN` producing nulls, `AVG`
  skipping them) get their mechanism explained rather than described.
- **date functions before window functions** — a live exercise stalls on `DATE_TRUNC` first, and every
  monthly report is `GROUP BY DATE_TRUNC('month', ...)`.

The reasoning per step is in PLANNING.md §6.

---

## Canonical schema — bookstore database (PostgreSQL)

All exercise files use this schema unless the topic requires something different.
Use these exact table and column names to keep exercises consistent across sessions.

```
authors     id SERIAL PK | name VARCHAR(100) NOT NULL | country VARCHAR(50) | birth_year INT
publishers  id SERIAL PK | name VARCHAR(100) NOT NULL | country VARCHAR(50)
genres      id SERIAL PK | name VARCHAR(50) NOT NULL UNIQUE
books       id SERIAL PK | title VARCHAR(200) NOT NULL | isbn VARCHAR(20) UNIQUE
            | price NUMERIC(8,2) | published_year INT | stock INT NOT NULL DEFAULT 0
            | author_id INT FK→authors | publisher_id INT FK→publishers | genre_id INT FK→genres
customers   id SERIAL PK | name VARCHAR(100) NOT NULL | email VARCHAR(100) UNIQUE NOT NULL
            | city VARCHAR(50) | joined_date DATE NOT NULL DEFAULT CURRENT_DATE
orders      id SERIAL PK | customer_id INT FK→customers
            | order_date DATE NOT NULL DEFAULT CURRENT_DATE
            | status VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK(status IN ('pending', 'completed', 'cancelled'))
order_items id SERIAL PK | order_id INT FK→orders | book_id INT FK→books
            | quantity INT NOT NULL CHECK(quantity > 0)
            | unit_price NUMERIC(8,2) NOT NULL
reviews     id SERIAL PK | book_id INT FK→books | customer_id INT FK→customers
            | rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5)
            | comment TEXT | reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

**Baseline data requirements (apply to every topic unless overridden):**
- At least 8 authors, some with NULL country or birth_year
- At least 3 publishers, 5 genres
- At least 15 books, some with NULL isbn or price; some authors with multiple books
- At least 10 customers, some with NULL city
- At least 12 orders across different statuses; some customers with multiple orders
- At least 20 order_items spread across orders and books
- At least 10 reviews; some books with multiple reviews, some with none

**Topic-specific edge-case data — override the baseline with these additional requirements:**
- joins: at least 2 authors with no books; at least 3 books with no order_items;
  at least 2 customers with no orders — this makes LEFT JOIN exercises produce non-trivial results
- group-by: at least 2 customers with exactly 1 order; at least 1 genre with 0 books in stock
  so HAVING filters produce different results depending on threshold
- nulls: at least 30% NULL in every nullable column (country, birth_year, isbn, price, city,
  comment) — the queries must hit real NULLs to be meaningful
- subqueries: vary order totals and book counts enough so subquery thresholds return different
  subsets (e.g. "customers who spent more than the average" must return a non-trivial result)
- window-functions: ensure orders span at least 12 distinct months so PARTITION BY customer
  and running totals show meaningful patterns
- indexes: add 500+ rows to books and order_items using generate_series() so EXPLAIN ANALYZE
  shows a real cost difference before and after adding an index
- dates-strings: insert author and book names with mixed case (e.g. 'ORWELL', 'Orwell',
  'george orwell') so ILIKE vs LIKE differences produce visibly different result sets; ensure orders
  span at least 6 distinct months so DATE_TRUNC('month', ...) produces meaningful grouping; leave at
  least 2 customers with a NULL city so a || concatenation blanks a whole display name
- join-pitfalls: at least one book appearing in several order_items, so a naive
  SUM(books.price) across the join comes back an exact multiple of the real total
- live-database: no extra data — the exercises read the schema itself and provoke constraint errors

---

<!-- ============================================================ -->
<!-- BRANCH A — run only when MODE = practice                    -->
<!-- ============================================================ -->

## MODE = practice

---

### Step 1 — Check existing state

**PROGRESS.md:** read the SQL section. Find the `### Exercises completed` table and look for a row
where Topic = {TOPIC}. If that row shows `solid ✅`, print:
"Este tema ya está marcado como sólido en PROGRESS.md. ¿Quieres más ejercicios de todos modos?
Responde sí para continuar, o no para salir."
Stop and wait for Victor's response.
- If he responds with any affirmative (sí, si, yes, SÍ, claro, of course, etc.): continue to Step 2.
- If his response is not affirmative, or he does not respond: print nothing else and stop.

**Existing file:** check if the file for {TOPIC} already exists (see path table in Step 4).
- If it exists: read it and find the highest exercise number, checking **both** formats:
  - current format — lines matching `-- Exercise [number] [`
  - **legacy format** — lines matching `-- #[number] |` (used by `01-basics.sql`, the only file left
    in it — written by hand before this prompt existed, and now closed)

  Take the highest number found across both patterns — call it N. New exercises start from N+1. If
  neither pattern matches (the file has only a setup block), set N = 0. Do NOT regenerate the setup
  block in either case.

  **If the file is in the legacy format, say so before generating:**
  "Este archivo está en el formato antiguo (`-- #NN |`, sin marca `-- Your answer:`). Los ejercicios
  nuevos usarán el formato actual, así que el archivo quedará mixto — eso es normal y el modo review
  lo maneja: lee ambos formatos y puntúa tus respuestas antiguas con normalidad. La única diferencia
  es que los ejercicios antiguos no pueden llevar la marca `-- ✅ Corregido`, así que se re-leen en
  cada review en vez de saltarse como cerrados. ¿Continúo? (sí / no)"
  Wait for an affirmative before continuing.

  **Then check the schema, which is a separate and more dangerous mismatch.** Read the setup block of
  the existing file and compare its `CREATE TABLE` statements against the canonical schema above.
  Compare table names *and* column names — a file can be in the current exercise format and still
  carry an obsolete schema.

  If they differ, **stop and ask before generating a single exercise**. This step exists because the
  rule above forbids regenerating the setup block, so without this check the new exercises reference
  columns that do not exist in Victor's database and not one of them runs in pgAdmin.

  Print the concrete diff — missing tables, and columns whose name differs (e.g. `nationality` vs
  `country`, `year` vs `published_year`) — then:

  "El bloque SETUP de este archivo no coincide con el esquema canónico: [diff]. Si genero contra el
  canónico, los ejercicios nuevos no correrán en tu pgAdmin. Dos opciones:
   (A) Genero contra el esquema que ya tiene el archivo — los ejercicios corren, pero se pierden los
       conceptos que ese esquema no soporta (indícolos: [list, e.g. fan-out sobre `quantity`]).
   (B) Añado un bloque SETUP nuevo con el esquema canónico al final del archivo, antes de los
       ejercicios nuevos. Corre ese bloque en pgAdmin y a partir de ahí todo usa el canónico; los
       ejercicios antiguos dejarán de correr, aunque siguen siendo puntuables.
   ¿A o B?"

  Wait for the answer. On (A), use the file's own schema as the canonical one for this run and say so
  in the self-report bullet 1. On (B), emit the new setup block with a banner
  `-- ===== SETUP v2 — esquema canónico (los ejercicios anteriores usan el esquema v1) =====`.
- If the file does not exist: set N = 0 and generate the complete file including the setup block.

---

### Step 2 — Generate the setup block (new files only)

Skip this step if the file already exists.

**Self-contained topics — no bookstore setup block:** for `schema-design`, `normalization`,
`data-types` and `ddl`, do NOT generate the bookstore setup block. Each exercise in these topics
carries its own table definitions. For a new file of one of these topics, generate only the
header comment and the `-- EXERCISES: {TOPIC}` banner, then go straight to Step 3.

**`report-queries` uses the TimeTrack model, not the bookstore.** Generate a setup block with
`users`, `projects` and `time_entries` mirroring `projects/07-timetrack` (a `Role` enum on users, an
`EntryStatus` of DRAFT/SUBMITTED/APPROVED/REJECTED on entries, `hours NUMERIC(5,2)`, `work_date DATE`),
seeded across at least 6 distinct months and including a project with zero entries so a `LEFT JOIN`
report has an empty group to preserve.

The rest of this step applies to the bookstore-based topics: `basics`, `joins`, `join-pitfalls`,
`group-by`, `nulls`, `subqueries`, `ctes`, `dates-strings`, `window-functions`, `dml`, `transactions`,
`indexes`, `live-database`.

Generate a complete setup block that Victor can paste and run in pgAdmin.

Format:
```sql
-- ================================================================
-- SETUP — Paste and run this section first in pgAdmin
-- FIRST: In pgAdmin, create a database called 'bookstore' if you haven't already.
-- Open that database, then run this entire block inside it.
-- You can re-run it at any time to reset the data to its original state.
-- ================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- Create tables
CREATE TABLE authors ( ... );
...

-- Insert sample data
INSERT INTO authors (name, country, birth_year) VALUES
  (...),
  ...;
...

-- ================================================================
-- EXERCISES: {TOPIC}
-- ================================================================
```

Use the exact column definitions from the canonical schema above.
Apply the topic-specific edge-case data requirements from the canonical schema section.

**Extra tables:** if the topic needs tables not in the canonical schema, add them after the
canonical tables with their own CREATE TABLE and INSERT INTO statements.

---

### Step 3 — Generate the exercises

Generate {COUNT} exercises for {TOPIC}, numbered starting from N+1.

**If FOCUS is set:** concentrate all exercises on the focused concept(s). Intro exercises
introduce that concept; Standard and Challenge explore its edge cases and combinations.
Do not cover other parts of the topic.

**If FOCUS is blank:** cover the full topic. `notes/sql/coverage.md` is the **single source of
truth for concept scope** — read the section that corresponds to {TOPIC} using the mapping below,
and ensure every concept item listed there is addressed across the exercises. The topic-specific
rules further below are **exercise format, structural constraints, and concrete seeds** (e.g. the
BEGIN/ROLLBACK wrapper for DML, the four-task format for normalization, a specific Challenge to
build) — they are *not* the scope list and must never be read as one.

**Reconciliation rule — coverage.md always wins on scope.** The seed bullets below were written
once and coverage.md evolves; do not assume they still match. On any disagreement about *which
concepts* to cover, coverage.md is authoritative: include a concept it lists even if no seed
mentions it, and drop a seed concept coverage.md no longer lists. The seeds only ever supply
*format and concrete examples* for the concepts coverage.md defines — treat a seed that names a
concept as an illustration, not as permission to add scope coverage.md dropped.

Every section name below is verified to exist verbatim in `notes/sql/coverage.md`. If a lookup fails,
**stop and report it** rather than falling back to the seeds — a missing section means the mapping has
gone stale and the exercises would silently lose their scope list.

| TOPIC | coverage.md section(s) to read |
|-------|-----------------------------|
| basics | ## Querying basics · ## Filtering and pattern matching · ## Sorting, pagination, and determinism · ## Set operations |
| joins | ## JOINs |
| join-pitfalls | ## JOIN pitfalls and row multiplication |
| group-by | ## Aggregates and grouping |
| nulls | ## NULL and three-valued logic |
| subqueries | ## Subqueries, CTEs, and views — subquery items only |
| ctes | ## Subqueries, CTEs, and views — CTE and view items |
| dates-strings | ## Date and string functions · ## PostgreSQL specifics |
| window-functions | ## Window functions |
| dml | ## DML — modifying data |
| transactions | ## Transactions |
| schema-design | ## Schema design — constraints and integrity · ## Schema design — modelling decisions |
| normalization | ## Schema design — modelling decisions (the 1NF/2NF/3NF items only) |
| data-types | ## Data types |
| ddl | ## DDL — creating and evolving a schema |
| indexes | ## Indexes · ## Reading a query plan and diagnosing slowness |
| live-database | ## Working with a live database · ## Reading PostgreSQL errors · ## Type behaviour at runtime |
| report-queries | ## Writing a report query |

`## Programmable database objects` is deliberately not claimed by any topic — see PLANNING.md §11.

**Difficulty distribution — applied to the batch of {COUNT} new exercises:**
Calculate the split based on COUNT, then assign labels to the new exercises in order:
- Intro:     first ⌈COUNT × 0.25⌉ exercises in the batch
- Standard:  next ⌈COUNT × 0.50⌉ exercises in the batch
- Challenge: remaining exercises in the batch

The batch starts at exercise N+1. Exercise N+1 is batch position 1, N+2 is position 2, and so on —
the distribution applies to batch positions, not to the absolute exercise numbers in the file.

Example for COUNT=12 (exercises N+1 through N+12): first 3 positions [Intro], next 6 [Standard], last 3 [Challenge].
Example for COUNT=6 (exercises N+1 through N+6): first 2 positions [Intro], next 3 [Standard], last 1 [Challenge].

**Guard — never leave Challenge empty:** because both Intro and Standard round up, some counts
leave Challenge at 0 (e.g. COUNT=5 → 2 Intro, 3 Standard, 0 Challenge). If the remainder for
Challenge is 0, move one exercise from Standard to Challenge so every batch has at least one
Challenge exercise. (COUNT=5 → 2 Intro, 2 Standard, 1 Challenge.)

Label each exercise with its level: `-- Exercise N [Intro]:`, `[Standard]:`, `[Challenge]:`.

**Review batches — resolved `{REVIEW} = yes`.** A review batch is a deliberate second pass over
concepts already drilled (PLANNING.md Moment 2b). It changes two things and nothing else:
- **No Intro tier.** Split the batch 60% Standard / 40% Challenge. Re-doing `SELECT title FROM books`
  on a concept already passed teaches nothing — that is exactly how exercises #21–#40 of
  `01-basics.sql` bought only three new concepts for a whole hour of work.
- **Label them `-- Exercise N [Repaso]:`** instead of the level, so the file itself records which
  block was first-pass and which was review. Without the marker nothing distinguishes them later.

Also drop the new-concept restriction: deliberate repetition is the point of a review batch, so
covering ground already covered is correct here and only here. Review batches are **not** counted
against a step's target in PLANNING.md §5 and never flip a status in §8 — say so in the closing
message: "Este lote es de repaso: no cuenta para el target del paso."

**Cross-topic integration rule:** for the bookstore-based query topics from nulls onward
(nulls, subqueries, ctes, dates-strings, window-functions, dml, transactions, indexes,
live-database), at least one Challenge exercise must combine the current topic with a concept from an
earlier topic. Examples: a subquery Challenge that also requires a JOIN; a CTEs Challenge that uses
GROUP BY inside a CTE; a window functions Challenge that filters with a WHERE clause using
IS NULL. This rule does not apply to the self-contained design topics (schema-design, normalization,
data-types, ddl) — they have no shared query schema to integrate with. It does not apply to
`report-queries` either, where *every* exercise is an integration by definition.

**Format for each exercise:**
```sql
-- Exercise N [Level]: [short title]
-- [One or two lines describing what to return, in plain English]
-- [Any constraints — e.g. "exclude NULL values", "order by total DESC"]
-- Expected result shape: [e.g. "one row per author with their book count"]

-- Your answer:

```

Leave a blank line after "-- Your answer:" so Victor has space to write.

**Self-explanation on Challenge exercises:** every Challenge exercise adds one extra line
after the answer space, so Victor practises justifying his choice — the single most important
skill in a technical interview ("explain every line, not just write it"):
```sql
-- Your answer:


-- Why I chose this approach (one line — e.g. "LEFT JOIN keeps authors with zero books; INNER would drop them"):

```
Do NOT add this line to Intro or Standard exercises — keep those frictionless. It is Challenge-only,
where the reasoning is deepest and most worth explaining out loud.

**Topic-specific format and seeds** (structure + concrete exercise ideas — *not* the scope list;
coverage.md defines scope, and the reconciliation rule above governs any conflict):

BASICS
- SELECT (all columns vs named columns), expressions and aliases, || concatenation
- WHERE: comparison operators, AND/OR, IN vs multiple OR, LIKE/ILIKE, BETWEEN, IS NULL, the NOT forms
- ORDER BY: single and multiple columns, by expression, by alias, ASC/DESC, NULLS FIRST/LAST
- LIMIT / OFFSET / FETCH, and why LIMIT without ORDER BY is non-deterministic
- DISTINCT (whole-row semantics) and DISTINCT ON
- SQL execution order (FROM+JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT) and where a
  SELECT alias is visible — at least two exercises must make the candidate predict whether an alias
  works in a given clause; this is the mental model every later topic leans on
- CASE WHEN in SELECT (per-row label)
- UNION vs UNION ALL, INTERSECT, EXCEPT — column count and type rules, and where ORDER BY goes
- Keyset (seek) pagination vs deep OFFSET
- Challenge: a query combining a CASE label, a set operation and a deterministic ORDER BY

JOINS
- INNER JOIN (basic), LEFT JOIN (keep rows with no match), RIGHT JOIN, FULL OUTER JOIN
- Self-join (e.g. authors who share the same country)
- Multi-table JOIN (3+ tables)
- JOIN ... USING (column) vs NATURAL JOIN — and why NATURAL JOIN is banned in real codebases
- EXISTS as a semi-join, NOT EXISTS / LEFT JOIN + IS NULL as an anti-join — as vocabulary to recognise
- At least two exercises where JOIN type matters: INNER would lose rows, LEFT is needed
- Challenge: find books with no orders (LEFT JOIN + IS NULL pattern)

JOIN-PITFALLS
**Runs after group-by, never before it** — every pitfall below is an aggregate over a broken join, so
`SUM` and `COUNT` must already be fluent. Every exercise here is a join that looks right and is not.
Where useful, present a broken query and ask for the diagnosis rather than only asking for a correct
query from scratch.
- A condition in ON vs in WHERE on an outer join — equivalent for INNER, not for LEFT
- The WHERE filter on the right table that silently turns a LEFT JOIN into an INNER JOIN
- Row multiplication on a one-to-many join — at least one exercise must ask for the predicted row
  count before running it
- Fan-out inflating SUM/AVG, and the two fixes: pre-aggregating in a CTE vs COUNT(DISTINCT ...)
- Accidental cross join from a missing ON predicate, and the deliberate CROSS JOIN as a real tool
- NULL in a join key — why the row disappears from an INNER JOIN
- COUNT(*) returning 1 instead of 0 after a LEFT JOIN, and why COUNT(child.id) gives the real 0
- Challenge: a report whose total comes back an exact multiple of the right answer — find and fix it

DATES-STRINGS
Exercises use the bookstore schema. Claims the whole `## PostgreSQL specifics` coverage section, so
the PostgreSQL-only tools live here rather than in a topic of their own.
- DATE_TRUNC('month'|'week'|'day', ...) — the backbone of every period report; at least one exercise
  builds a monthly total from raw timestamps
- EXTRACT(YEAR FROM ...) / DATE_PART, and when each beats DATE_TRUNC (truncate to keep periods
  ordered, extract to bucket across periods)
- What subtraction returns — two timestamps give an INTERVAL, two DATEs give an integer day count
- AGE(a, b) vs plain subtraction
- INTERVAL arithmetic — NOW() - INTERVAL '30 days' as a sargable "last 30 days" filter
- NOW() vs CURRENT_DATE
- The string toolkit: UPPER, LOWER, TRIM, LENGTH, SUBSTRING, REPLACE, SPLIT_PART
- || with a NULL operand blanking the whole result, and the two fixes (COALESCE per piece, CONCAT_WS)
- STRING_AGG vs ARRAY_AGG — which one you hand back to an API
- :: cast operator, and ILIKE vs LIKE (one exercise where LIKE finds nothing and ILIKE finds rows)
- Challenge: a monthly report combining DATE_TRUNC, STRING_AGG and a COALESCE'd concatenation

DDL
Self-contained — no bookstore setup block. Victor writes DDL from a blank editor, because ddl-auto has
been generating it for him in TimeTrack.
- CREATE TABLE by hand: column list, types, NOT NULL, DEFAULT, constraint clauses
- Column-level vs table-level constraint syntax, and why you name a constraint
- REFERENCES inline, and what order tables must be created in
- CREATE TABLE IF NOT EXISTS — what makes a seed script re-runnable
- ALTER TABLE ADD COLUMN — and why adding it NOT NULL to a populated table fails without a DEFAULT
- ALTER TABLE ALTER COLUMN TYPE, ADD CONSTRAINT on a populated table, RENAME COLUMN
- DROP TABLE vs DROP TABLE ... CASCADE
- DDL is transactional in PostgreSQL — one exercise wraps an ALTER in BEGIN; ... ROLLBACK; to prove it
- Challenge: write the full TimeTrack schema (users, projects, time_entries) from the domain rules,
  constraints included

LIVE-DATABASE
Two halves: operating the database without a GUI, and reading its errors. Uses the bookstore schema.
- psql orientation: \l, \dt, \d table_name, \i file.sql — one exercise per command, stating what the
  output tells you
- information_schema and pg_catalog — list every table and every column of one table with a query
- The public schema, search_path, and qualified vs unqualified names
- Role vs user, GRANT on a table, object ownership — which privileges the app's DB user should hold
- pg_dump and restoring a dump
- The error catalogue — for each, give the exact message text and ask what caused it and how to fix it:
  duplicate key / unique violation · foreign key violation on insert vs on delete · not-null violation ·
  check constraint violation · "must appear in the GROUP BY clause" · "more than one row returned by a
  subquery used as an expression" · "relation does not exist" (three causes) · "invalid input syntax
  for type integer"
- SQLSTATE codes 23505, 23503, 23502, 23514 — and why code beats parsing the message text
- Type behaviour that fails silently: integer division truncating, division by zero aborting the query,
  PostgreSQL refusing an implicit cast MySQL would perform, TIMESTAMP compared to DATE
- Challenge: given a raw log line, name the statement that caused it and write the fix

REPORT-QUERIES
The capstone. **Uses the TimeTrack model, not the bookstore.** No new syntax — every exercise hands a
requirement in prose and expects the whole query, the way a live exercise does.
- Format: the exercise is a business requirement in one or two sentences, plus the expected column
  list. No hints, no clause skeleton given.
- Mapping a requirement onto FROM/JOIN → WHERE → GROUP BY → HAVING → ORDER BY
- Choosing the driving table so a LEFT JOIN preserves groups with zero rows
- COALESCE(SUM(...), 0) so an empty group renders 0 rather than blank
- Aliasing every output column
- Formatting in the query vs in the application — ROUND(SUM(hours)::numeric, 2) vs letting Angular do it
- At least two exercises must be answerable only with a period filter (DATE_TRUNC or a half-open range)
- Every exercise is Challenge level: add the "-- Why I chose this approach" line to all of them, and
  state a target time of 10 minutes in the exercise header so the file doubles as timed practice

GROUP BY
- Basic aggregates: COUNT, SUM, AVG, MIN, MAX
- GROUP BY multiple columns
- HAVING to filter groups (distinguish clearly from WHERE)
- Difference between COUNT(*) and COUNT(column) when NULLs are present
- CASE WHEN in SELECT (per-row label, not aggregate — e.g. classify book price as 'cheap' / 'standard' / 'expensive')
- Conditional aggregation: CASE WHEN inside SUM or COUNT to aggregate only a subset of rows (e.g. total value of in-stock books per genre)
- FILTER (WHERE ...) — PostgreSQL shorthand for conditional aggregation, same result as CASE WHEN but cleaner for simple conditions (e.g. COUNT(*) FILTER (WHERE stock > 0))
- Challenge: nested aggregation or HAVING with a subquery

NULLS
- IS NULL / IS NOT NULL in WHERE
- COALESCE to replace NULLs with a default
- NULLIF (return NULL when two values are equal)
- NULL behaviour in aggregates (COUNT(*) vs COUNT(column))
- NULL in JOIN conditions (why a LEFT JOIN row shows NULL for right-side columns)
- AND / OR with NULL — exercises that expose the truth-table behaviour (true AND NULL → NULL; false AND NULL → false; true OR NULL → true; false OR NULL → NULL) and why a missing IS NULL check can silently exclude rows
- IN vs multiple OR — semantically equivalent but IN is cleaner and optimised; exercises to recognise both forms
- LIKE vs ILIKE — case-sensitive vs case-insensitive pattern matching; % and _ wildcards; why ILIKE does not exist in MySQL
- BETWEEN with timestamps — show why BETWEEN '2024-01-01' AND '2024-06-30' silently excludes events after midnight on June 30, and how casting fixes it (created_at::date BETWEEN ...)
- Challenge: combine COALESCE with an aggregate or a CASE expression

SUBQUERIES
- Subquery in WHERE (scalar and list)
- Subquery in SELECT (correlated)
- Subquery in FROM (derived table)
- EXISTS / NOT EXISTS
- IN vs EXISTS — IN collects all subquery results first; EXISTS stops on first match; exercises where one performs better than the other
- Subquery vs JOIN — rewrite a WHERE subquery as a JOIN and discuss when each is preferred; the JOIN is usually optimised better
- UNION vs UNION ALL — UNION removes duplicate rows; UNION ALL keeps all rows and is faster; column count and compatible types required; exercise: combine two separate result sets (e.g. authors from Spain + publishers from Spain, deduplicated)
- Challenge: correlated subquery that references the outer query's table twice

CTEs
- Basic WITH clause (one CTE)
- Chained CTEs (two CTEs, one referencing the other)
- CTE used multiple times in the main query
- CREATE VIEW — save a query with a name so it can be queried like a table; exercise: create a view for a complex JOIN then query it; explain that it runs the underlying query live on every access
- View vs materialized view — regular view runs the query live; materialized view stores the result on disk and needs REFRESH MATERIALIZED VIEW; exercise: write both and explain the trade-off (convenience vs performance)
- DISTINCT ON — PostgreSQL-specific; keeps one row per group while returning multiple columns; must be leftmost in ORDER BY; exercise: get the most recent order per customer without a subquery
- Challenge: recursive CTE (e.g. category hierarchy or cumulative totals)

DML
Wrap EVERY exercise in BEGIN; ... ROLLBACK; so data resets after each one.
The ROLLBACK at the end is part of the exercise — Victor must include it.
Format:
```sql
-- Exercise N [Level]: [title]
-- [description]

-- Your answer:
BEGIN;

-- write your statement here

-- verify (run this SELECT to check the result before ROLLBACK):


ROLLBACK;
```
Cover: INSERT (single row, multi-row), UPDATE with WHERE, DELETE with WHERE,
RETURNING clause, ON CONFLICT (upsert), UPDATE with a subquery.
The BEGIN / ROLLBACK wrapper is a safety mechanism here — deep transaction concepts
(COMMIT, SAVEPOINT, ACID, @Transactional) are covered in the TRANSACTIONS topic.

NORMALIZATION
Each exercise starts with a denormalized table definition. Victor must:
1. Identify the functional dependencies
2. Name the normal form violations
3. Write the normalized CREATE TABLE statements in 3NF
4. Write INSERT INTO statements to migrate the sample data

Format:
```sql
-- Exercise N [Level]: [title]
-- The following denormalized table has design problems.
-- Analyze it and rewrite it in 3NF.
--
-- [table definition with columns and sample rows as comments]
--
-- Tasks:
-- 1. List the functional dependencies you identify
-- 2. State which normal form is violated and why
-- 3. Write CREATE TABLE statements for the normalized schema
-- 4. Write INSERT INTO to populate the normalized tables with the sample data

-- Your answer:
```

Do NOT use the bookstore setup block for normalization — each exercise is self-contained.
Scenarios: order management, school grades, employee projects, product inventory, hotel bookings.

SCHEMA DESIGN
Each exercise gives a set of real-world requirements. Victor designs the schema from scratch.
Format:
```sql
-- Exercise N [Level]: [title]
-- Design a PostgreSQL schema for: [real-world system]
--
-- Requirements:
-- - [entity 1 with key attributes]
-- - [entity 2 with key attributes]
-- - [relationships between entities]
-- - [constraints: at least one CHECK, one UNIQUE, and FKs for all relationships]
-- - [one business rule to enforce with a constraint]
-- - [ON DELETE behaviour for each FK: RESTRICT, CASCADE, or SET NULL — and why]
-- - [data type choices with justification: NUMERIC(p,s) vs FLOAT for money, TIMESTAMPTZ vs TIMESTAMP for created_at, VARCHAR(n) vs TEXT for free text, BIGSERIAL for large tables]
--
-- For Challenge exercises: apply at least 3NF, justify every ON DELETE choice, and explain every data type decision in a comment.

-- Your answer: (write your CREATE TABLE statements below)
```

Do NOT use the bookstore setup block — each exercise is a standalone design task.
Scenarios: library, hotel, university, gym, delivery service, e-commerce, clinic.

WINDOW FUNCTIONS
- ROW_NUMBER(), RANK(), DENSE_RANK() — show the difference between RANK and DENSE_RANK
- LAG() and LEAD() (e.g. compare each order total to the previous one by the same customer)
- SUM() OVER (PARTITION BY) — running total per customer
- AVG() OVER () — compare each book's price to the overall average
- Challenge: top-N per group using ROW_NUMBER() in a subquery

TRANSACTIONS
Wrap each DML exercise in a transaction. The goal is to practise transaction control explicitly — not just as a safety wrapper.
Cover:
- BEGIN / COMMIT — multi-statement exercises where both statements must succeed together (e.g. insert a customer and their first order); Victor writes BEGIN, both statements, COMMIT, then verifies with SELECT
- BEGIN / ROLLBACK — exercises where an error mid-transaction means nothing should be saved; Victor explains why atomicity matters
- SAVEPOINT — BEGIN; first change; SAVEPOINT sp1; second change; ROLLBACK TO sp1; COMMIT — shows partial rollback while keeping the first change
- ACID as comments — for each exercise, include a brief comment line: "-- Atomicity: both inserts succeed or neither does" — so Victor practises mapping the concept to code
- @Transactional connection — at least one exercise description must include: "-- In Spring Boot, @Transactional wraps this method in BEGIN / COMMIT and issues ROLLBACK on any unchecked exception"
- DELETE vs TRUNCATE — one exercise contrasting both: DELETE supports WHERE, logs each row, can be rolled back; TRUNCATE removes all rows instantly, resets SERIAL, and cannot be filtered
Format: same BEGIN / ROLLBACK wrapper as DML — use COMMIT instead of ROLLBACK only in exercises explicitly testing the COMMIT path.

DATA TYPES
Each exercise presents a CREATE TABLE scenario where Victor must choose and justify the data type for each column.
Cover:
- VARCHAR(n) vs TEXT — VARCHAR(100) signals intent; TEXT has no meaningful limit; both perform identically in PostgreSQL; Victor must write one sentence justifying each choice
- INT vs SERIAL vs BIGSERIAL — INT is a plain integer; SERIAL auto-increments for PKs; BIGSERIAL for tables expected to grow very large; Victor must state which to use and why
- NUMERIC(p,s) vs FLOAT — FLOAT is an approximation; NUMERIC(10,2) stores exact decimals; always use NUMERIC for prices and financial values; one exercise must show the rounding error FLOAT can cause
- TIMESTAMP vs TIMESTAMPTZ — TIMESTAMP ignores time zones; TIMESTAMPTZ stores in UTC and converts on read; always use TIMESTAMPTZ for created_at; Victor must explain what happens in a server moved to a different time zone
- BOOLEAN — stores true / false; always write true / false (not 1 / 0 / 'yes') for readability; one exercise on a flag column like is_active or is_verified
Format: each exercise provides a description of the system (e.g. "an e-commerce order table"), asks Victor to write CREATE TABLE with the correct types, and requires a comment on each column explaining the choice.
Do NOT use the bookstore setup block — each exercise is self-contained.

POSTGRESQL SPECIFICS — *retired as a standalone topic.* Its items were redistributed to the topic
where each one is actually needed, so a PostgreSQL-only tool is learned in the context that uses it
rather than in a grab-bag at the end:
- DATE_TRUNC, NOW() vs CURRENT_DATE, INTERVAL, STRING_AGG, :: casts, ILIKE → **dates-strings**
- DISTINCT ON → **basics** (alongside DISTINCT) and again in **ctes**, as the no-subquery way to get
  the most recent row per group
- RETURNING → **dml**
- Single vs double quotes, identifier case folding → **live-database**, with the errors they produce

INDEXES
Use the bookstore schema with 500+ rows (use generate_series() in setup).
Cover: CREATE INDEX on a single column, composite index, partial index,
EXPLAIN ANALYZE before and after adding an index, when NOT to add an index
(low-cardinality column), index on a column used in ORDER BY.
Also cover: LIMIT with ORDER BY for pagination — why ORDER BY is mandatory without it results are non-deterministic; why large OFFSET is slow on big tables; how an index on the ORDER BY column helps.
Challenge: analyze a slow query and decide what index to add, then verify with EXPLAIN ANALYZE.

---

### Step 4 — Save the file

**Flat files, numbered in study order.** Several topics share a file — that is deliberate, and the
second topic appends to the first rather than creating a new file.

| Topic | Path | PLANNING.md step |
|-------|------|------------------|
| basics | practice/sql/02-execution-order-set-ops.sql | 0 |
| joins | practice/sql/03-joins.sql | 1 |
| group-by | practice/sql/04-aggregates.sql | 2 |
| join-pitfalls | practice/sql/05-join-pitfalls.sql | 3 |
| nulls | practice/sql/06-nulls.sql | 4 |
| subqueries | practice/sql/07-subqueries-ctes.sql | 5 |
| ctes | practice/sql/07-subqueries-ctes.sql *(appends)* | 5 |
| dates-strings | practice/sql/08-dates-strings.sql | 6 |
| window-functions | practice/sql/09-window-functions.sql | 7 |
| dml | practice/sql/10-dml-transactions.sql | 8 |
| transactions | practice/sql/10-dml-transactions.sql *(appends)* | 8 |
| schema-design | practice/sql/11-schema-design.sql | 9 |
| normalization | practice/sql/11-schema-design.sql *(appends)* | 9 |
| data-types | practice/sql/12-data-types-ddl.sql | 10 |
| ddl | practice/sql/12-data-types-ddl.sql *(appends)* | 10 |
| indexes | practice/sql/13-indexes.sql | 11 |
| live-database | practice/sql/14-live-database.sql | 12 |
| report-queries | practice/sql/15-report-queries.sql | 13 |

**One file, one schema (2026-07-22).** `practice/sql/01-basics.sql` is closed and is not in this
table: it carries the pre-canonical schema, so nothing is ever appended to it again. A file whose
SETUP block does not match the canonical schema is never extended — start the next numbered file
instead, and update `practice/sql/PLANNING.md` §5 and §8.

If the folder does not exist, create it using the path above. **Never invent a path** — if {TOPIC} is
not in this table, stop and report it.

For a **new file**: write the complete file (setup block + exercises).
For **append**: read the existing file, then append the new exercises after the last line. Do not modify any existing content.

After saving, print the message matching the case:
- New file, bookstore-based topic: "Listo. {COUNT} ejercicios guardados en [path]. Total en el archivo: {COUNT}. Ábrelo en pgAdmin, ejecuta el bloque SETUP primero, y escribe tus respuestas después de cada '-- Your answer:'. Luego pégalo en el modo review."
- New file, self-contained topic (normalization, schema-design, data-types): "Listo. {COUNT} ejercicios guardados en [path]. Total en el archivo: {COUNT}. Cada ejercicio es independiente — no hay bloque SETUP. Ábrelo en pgAdmin y escribe tus respuestas después de cada '-- Your answer:'. Luego pégalo en el modo review."
- Append: "Listo. {COUNT} ejercicios añadidos a [path]. Total en el archivo: {N+COUNT}. Abre el archivo en pgAdmin y escribe tus respuestas después de cada '-- Your answer:' nuevo. Luego pégalo en el modo review."

---

<!-- ============================================================ -->
<!-- BRANCH B — run only when MODE = review                      -->
<!-- ============================================================ -->

## MODE = review

---

### Step 1 — Read the file

Read the file at {FILE} (resolved from the path table in Step 4 when FILE was left blank).
If Victor pasted a file at the end of the chat instead, use the pasted content — a paste always wins
over {FILE}, because it may hold answers he has not saved to disk yet.
Confirm in one line which one you used: "Reviso [path]" or "Reviso el archivo pegado".
Identify the topic from the file header.

**First, detect the format**, because the two are answered differently:
- **Current format** — exercises marked `-- Exercise N [Level]:` with a `-- Your answer:` line. An
  answer is any content after `-- Your answer:` (ignoring blank and comment-only lines).
- **Legacy format** — exercises marked `-- #NN | title` with **no** `-- Your answer:` line; the answer
  is written directly under the description. Here, an answer is any non-comment SQL line between one
  `-- #NN |` header and the next. `01-basics.sql` is the only file in this format — treating it with
  the current-format rule reports all 40 answered exercises as unanswered.
- **Mixed file** — apply each rule to the block it belongs to. Say so in one line at the top:
  "Archivo mixto: ejercicios #1–#N en formato antiguo, el resto en formato actual."

**Second, skip what is already settled.** An exercise whose **header line ends with**
`✅ Corregido YYYY-MM-DD` has already been reviewed and accepted in an earlier run. **Do not
re-review it, do not re-score it, do not comment on it.** List it in the summary as `✅ (ya corregido)`
and exclude it from the score, exactly like an unanswered one — the score must measure *this* batch,
not a growing pile of work already validated. This mirrors the studied-content-is-final rule in
`notes/prompts/knowledge/interview-prep/_interview-prep-standard.md`.

If **every** exercise in the file carries the marker, print
"Todo este archivo ya está corregido. Nada que revisar." and stop — do not run Steps 3–6.

Then, for each remaining exercise:
- Answer present: review it.
- No answer: mark as "— Sin responder" in the summary. Exclude from score and breakdown.

**Partial-file detection:** if the first N exercises are all "Sin responder" and only later
exercises have answers, print one line at the top:
"Revisando ejercicios [first answered] a [last answered]."
This is normal when reviewing a new append batch.

---

### Step 2 — Check each answer

Run each query mentally against the schema defined in the setup block.

**If the file has two setup blocks** (a `SETUP v2` banner marks a mid-file schema change — see
practice Step 1), evaluate each exercise against the block that precedes it, not against the last one
read. An exercise written for the v1 schema is **not** wrong for using a v1 column name.

For the self-contained design topics (schema-design, normalization, data-types), there is no
shared setup block — evaluate each answer's table design and type choices against the
requirements stated in that exercise.

Mark each answer with one of these:

**✅ Correct** — returns the right result with a good approach.
One line confirming it is correct.
If there is a significantly cleaner or more idiomatic PostgreSQL way to write it,
add: "Nota: [one sentence on the alternative]" — do not rewrite the query, just note it.
Only add this note when the improvement is meaningful (e.g. using FILTER instead of CASE
inside an aggregate, using DISTINCT ON instead of a subquery). Skip for minor style differences.

**⚠️ Partial** — runs without error but returns wrong or incomplete results.
- One sentence: what is wrong
- Correct query in a code block
- If the mistake is a classic pattern error (WHERE vs HAVING, INNER vs LEFT, COUNT(*) vs
  COUNT(column), correlated vs non-correlated), explain the distinction in one sentence

**❌ Wrong** — syntax error, wrong approach, or completely wrong result.
- One sentence: what is wrong
- Correct query in a code block
- Explain the concept behind the correct approach in one sentence

**For dml-topic exercises:** a missing ROLLBACK is flagged as ⚠️ Partial even if the DML
statement itself is correct — resetting data after each exercise is part of the skill.
This applies only to the `dml` topic. In the `transactions` topic, COMMIT is the correct
ending for exercises that test the COMMIT path — do not flag a missing ROLLBACK there;
instead apply the transactions checklist below.

**For normalization exercises:** check:
- Are the functional dependencies correctly identified?
- Is the normal form violation correctly named?
- Does the normalized schema reach 3NF?
- Are the INSERT statements consistent with the new structure?

**For schema design exercises:** check:
- Are all required entities represented as tables?
- Do foreign keys correctly represent the relationships?
- Are NOT NULL, UNIQUE, and CHECK constraints applied where the requirements imply them?
- Is there anything that would cause problems in practice (e.g. missing FK, mutable PK)?

**For transactions exercises:** check:
- Does every exercise that requires COMMIT actually use COMMIT (not ROLLBACK)?
- Is SAVEPOINT used correctly — ROLLBACK TO saves partial work, not everything?
- Are ACID comments present and accurate? A wrong comment is flagged as ⚠️ Partial.
- Is the @Transactional connection described correctly when the exercise asks for it?
- For DELETE vs TRUNCATE: are the differences (WHERE support, logging, rollback, SERIAL reset) all stated?

**For data-types exercises:** check:
- Is the chosen type correct for the scenario (NUMERIC for money, TIMESTAMPTZ for created_at, etc.)?
- Does Victor justify each choice with a comment? Missing justifications are flagged as ⚠️ Partial.
- For NUMERIC vs FLOAT: does Victor explain the rounding error risk?
- For TIMESTAMP vs TIMESTAMPTZ: does Victor explain what happens when the server time zone changes?

**For dates-strings exercises:** check:
- Is the PostgreSQL-specific syntax used correctly (:: cast, ILIKE, DATE_TRUNC, STRING_AGG, INTERVAL)?
- For ILIKE vs LIKE: does the answer demonstrate understanding of case sensitivity — not just use ILIKE?
- For a period report: is DATE_TRUNC used (keeps periods ordered) where EXTRACT would scramble them?
- For a concatenation over a nullable column: is the NULL handled with COALESCE or CONCAT_WS? An
  unguarded `||` is ⚠️ Partial even when the query runs.

**For join-pitfalls exercises:** check:
- When the exercise asks for a predicted row count, is the number right? A correct query with a wrong
  prediction is ⚠️ Partial — the prediction is the skill being tested.
- Is a fix that only masks a fan-out (COUNT(DISTINCT ...)) distinguished from one that removes it
  (pre-aggregating in a CTE)? Naming the difference is required on Challenge exercises.

**For ddl exercises:** check:
- Does the CREATE TABLE run as written — no forward reference to a table created later?
- Are constraints named where the exercise asked for it?
- For ALTER on a populated table: does the answer address the existing rows, not just the new rule?

**For live-database exercises:** check:
- For an error-diagnosis exercise, is the *cause* named, not just the fix?
- For "relation does not exist": are all three causes given (wrong database, wrong search_path,
  quoted-identifier case)? Fewer than three is ⚠️ Partial.

**For report-queries exercises:** check:
- Does a group with zero rows survive — LEFT JOIN from the driving table, COALESCE(SUM(...), 0)?
  A report that silently drops empty groups is ❌ even if every returned row is right.
- Is every output column aliased?
- Is the stated 10-minute target met? Record it in the summary, but do not lower the score for it.

---

### Step 2a — Second pass on the ✅ answers, by a cold subagent

**Run this before writing a single marker.** The marker is irreversible in practice: a ✅ exercise is
skipped by every later run, so a wrongly accepted answer becomes a concept Victor believes he owns
and never sees again. One grader marking his own work has no check against that.

Dispatch **one subagent that has not seen this run**. Give it: the setup block the exercises run
against, and *only* the exercises marked ✅ in Step 2 — the exercise text and Victor's query, with no
verdict, no commentary, and no hint that they were already accepted. Ask it for one line per
exercise: **correct** or **not correct, because <one clause>**. Nothing else — it is not reviewing
style, not suggesting idiomatic alternatives, not grading the ⚠️ and ❌ ones.

Reconcile:
- **Both say correct** → the ✅ stands and the exercise gets its marker in Step 2b.
- **The subagent says not correct** → re-check that exercise yourself against the schema. If it is
  right, downgrade the answer to ⚠️ or ❌, give the correction in the summary, and **write no marker**.
  If the subagent is wrong, keep the ✅ and say so in one line: "Segunda pasada discrepó en el #N; la
  revisé y la respuesta es correcta porque […]".

**Print the outcome in one line:** "Segunda pasada: N ✅ confirmados, M revertidos." A run where the
second pass changed nothing is the normal case and is worth stating — it is the evidence the markers
were earned.

This is the only subagent in this prompt. It exists here and not on the ⚠️/❌ answers because those
come back through review anyway; the ✅ ones never do.

---

### Step 2b — Write the correction markers back into the file

**This is the only step that edits the exercise file, and it edits nothing but these marker lines.**
The file it edits is {FILE}. If the review ran off a paste whose exercises do not match what is on
disk, skip this step and print: "No escribo marcadores: el texto pegado no coincide con [FILE]."

For every exercise marked **✅ Correct** in Step 2, append the marker **to the end of that exercise's
header line** — never on a line of its own, so the file stays scannable and the answer keeps its own
line. It goes on the header in both formats:

```sql
-- #39 | WHERE — NOT BETWEEN ✅ Corregido 2026-07-22
-- Exercise 41 [Standard]: LEFT JOIN — finding missing data ✅ Corregido 2026-07-22
```

Use today's real date. Do **not** add the marker to ⚠️ Partial or ❌ Wrong answers — those still need
work, and they must come back through review once corrected. Do not add it to unanswered exercises.
Never modify Victor's queries, never reformat, never touch anything but these appended lines.

Why this exists: without it, every review run re-grades the whole file from #01, the score silently
mixes old validated work with the new batch, and there is no record in the file itself of what has
been settled. The marker is what makes an exercise file resumable.

**Print the count:** "Marcados como corregidos: N ejercicios."

---

### Step 3 — Summary

Print the summary table:

| Exercise | Level | Result | Issue |
|----------|-------|--------|-------|
| 1 | Intro | ✅ | — |
| 2 | Intro | ⚠️ | Used WHERE instead of HAVING |
| 3 | Standard | ❌ | Missed LEFT JOIN — INNER drops non-matching rows |
| 4 | — | Sin responder | — |

**Score:** X / Y correct  (Y = attempted exercises only; unanswered not counted)

Breakdown by level (attempted only):
- Intro: X/N ✅
- Standard: X/N ✅
- Challenge: X/N ✅

**Verdict — three mutually exclusive cases based on score:**

**Score < 60%:**
"Este tema necesita más práctica. Revisa los errores y corrígelos en pgAdmin.
Conceptos a reforzar: [list the specific concepts that had ❌ or ⚠️ answers].
Añado un batch de refuerzo al plan; luego ejecuta el prompt con MODE = practice y TOPIC = {TOPIC}."

Then, in Step 4, append a Moment 2b reinforcement block to the {TOPIC} step in
`practice/sql/PLANNING.md` §6 — `COUNT = 8`, `REVIEW = yes`, and `FOCUS` set to exactly those failed
concepts. **This is what keeps the config down to two keys:** the next run reads the block instead of
Victor retyping it, and the plan ends up holding the record of what he struggled with.
Then proceed to Steps 4 and 5.

**Score ≥ 60% and < 80%:**
"Base sólida. Repasa los ejercicios marcados con ⚠️ o ❌ antes de avanzar."
Then proceed to Steps 4 and 5.

**Score ≥ 80%:**
"Listo para marcar {TOPIC} como sólido. Pasamos al siguiente tema."
Find {TOPIC} in the study order below. The next topic is the one immediately to the right.
basics → joins → group-by → join-pitfalls → nulls → subqueries → ctes → dates-strings
→ window-functions → dml → transactions → schema-design → normalization → data-types → ddl
→ indexes → live-database → report-queries
Print: "Siguiente tema: [next topic]. Ejecuta el prompt en modo practice con TOPIC = [next topic]."
If {TOPIC} is report-queries (the last topic): print "Has completado todos los temas SQL. Revisa
practice/sql/PLANNING.md §9 — te toca el gate G7 (progress-update)."

**Also name the step gate when one fires here.** PLANNING.md §9 hangs three gates off a closing step —
after `nulls` closes, G4 (`interview-prep-audit TOPIC = sql`); after `window-functions` closes, G6
(`simulation-generator TYPE = sql`); after `report-queries`, G7. If {TOPIC} is one of those three, add:
"Además, esto cierra el paso [N] del plan: toca ejecutar [gate] antes de seguir."
Then proceed to Steps 4 and 5.

---

### Step 4 — Update PROGRESS.md and PLANNING.md

Five things must move when a topic is scored, and the failure mode is doing one of them. Do all five,
or state explicitly which one you skipped and why.

#### 4a — PROGRESS.md, the concept list

Read PROGRESS.md, `## SQL` section. Add every concept this batch actually exercised to the concept
list, **one specific line per concept**. Never group: `HAVING filters groups after aggregation, WHERE
filters rows before it` is a line; "aggregation" is not. Skip concepts already listed — check before
adding.

This is the half that has always been missed. The exercises table below records *how many*; this
records *what*, and it is what `progress-update` and `cv-prompt` read downstream.

#### 4b — PROGRESS.md, the exercises table

The table format is (4 columns — shared with `progress-update-prompt`):

```markdown
### Exercises completed

[N] total exercises across [M] topics

| Topic | Folder | Exercises | Status |
|-------|--------|-----------|--------|
| basics / SELECT | practice/sql/01-basics.sql | [count] | in progress ⏳ |
| joins | practice/sql/03-joins.sql | [count] | solid ✅ |
```

The numbers above are placeholders showing the shape — read the real counts from the file you just
reviewed. Never copy an example figure into PROGRESS.md.

**If the table exists:** find the row for {TOPIC} and update the `Exercises` and `Status` columns:
- Status: `solid ✅` if score ≥ 80%; `in progress ⏳` if score < 80%
- Exercises: count all exercises in the reviewed file, including any previous batches
- Leave the `Folder` column as-is (it is the file path, e.g. `practice/sql/03-joins.sql`)
- Then refresh the `X total exercises across Y topics` summary line above the table to match the
  new column totals

**If the row for {TOPIC} does not exist in the table:** add it. Fill `Folder` with the file's
path (`practice/sql/<NN>-<topic>.sql` — the flat-file convention is the real one; a legacy subfolder would be `practice/sql/<NN>-<topic>/`).

**If the `### Exercises completed` table does not exist in PROGRESS.md:** create it under a new
`### Exercises completed` heading, with the 4-column format and the summary line above. Insert it
at the end of the `## SQL` section — after the last existing `###` heading in that section and
before the next `##` heading.

#### 4c — PLANNING.md §8, the step row

Open `practice/sql/PLANNING.md`. Find the row in the §8 table for the step this {TOPIC} belongs to
(the path table in Step 4 gives the step number). Update its **Scored / target** cell with the number
of exercises this run actually graded ≥ 80%, and its **Status** cell:
- score ≥ 80% **and** the step's target reached → `done ✅`
- otherwise → `in progress ⏳`

§5 of the plan defines three counts — *written*, *answered*, *scored* — and only **scored** moves a
status. Do not write an answered-but-ungraded count into that cell; that conflation is what made the
plan claim Step 0 was 40/40 when nothing had ever been reviewed. Update the matching `Scored` cell in
the §5 table too.

Then refresh the totals line under the table.

#### 4d — PLANNING.md §0, the quick reference

Only when 4c set a row to `done ✅`. Rewrite the §0 table:
- **Current step** → the next row in §8 that is not ✅
- **Done condition** → that step's done condition, copied from its §6 entry
- **Next gate** → the first gate in §9 whose trigger has not fired yet. Steps 4, 7 and 13 close with a
  gate attached (G4, G6, G7) — if this was one of them, Next gate is that one.
- **Last updated** → today

#### 4e — Report what is still manual

Two parts of the step-complete ritual (PLANNING.md §4) are **outside this prompt's reach**, because
they depend on work this run did not do:
- the note files in `notes/sql/en/` + `es/` — written by `/notes-audit`, not here
- the `notes/sql/` counter in `CLAUDE.md` — only moves when a new note number is used

So never print "step closed" on the strength of a score alone. If 4c set the row to `done ✅`, print:
"Ejercicios del paso [N] cerrados. Para cerrar el paso entero faltan: las notas en `en/` + `es/`
(ejecuta `/notes-audit SCOPE = file`) y responder la exit question de memoria."

---

### Step 5 — Concept gaps: log them in `MISTAKES.md`

If any answer was ⚠️ or ❌, **record each distinct conceptual gap in the `## Open` table of
`practice/sql/MISTAKES.md`**, whose columns are `Logged | Last seen | Times | Step | Coverage section |
Concept | Sev | What went wrong | Exercises`. One row per *concept*, not per exercise: three exercises
that all failed on `WHERE` vs `HAVING` are one row, with all three numbers in `Exercises`.

- **`Coverage section` is the heading from `notes/sql/coverage.md`, copied verbatim** — not a
  paraphrase and not the step name. If the gap fits no existing heading, write the closest one and say
  so in one line in the chat; that mismatch is a signal for the next `coverage-audit`, not a licence to
  invent a section name here.
- **A concept already in `## Open` is never given a second row.** Increment its `Times`, set
  `Last seen` to today, append the new exercise numbers, and raise `Sev` to ❌ if this run was worse.
  Recurrence is the whole point of the column — a second row destroys it.
- **`Sev`** is the worst grade the concept has ever received, not this run's.

Then list the same gaps in one short block at the end of the chat, highest `Times` first.

**Also close what this run redeemed.** Before recording anything, read the `## Open` table: if a
concept listed there was answered correctly in this batch, move its row to `## Closed` with today's
date as the closing date, carrying its `Times` across. Never delete a row — a concept failed twice and
fixed once is a different fact from a concept never failed, and the closed table is what tells them
apart.

If the file does not exist, create it with the two tables and the header explaining what it is.

**This prompt still never writes to `notes/interview-prep/` or to `notes/sql/`.** Those belong to
`interview-prep-audit` (G4) and `/notes-audit` (Moment 5); a grading run that also authors study
material bypasses both standards and their cold reviewers. `MISTAKES.md` is not study material — it
is this run's own output, the record of what it graded wrong. **This prompt is its only writer**; the
revision points R1–R5 in `PLANNING.md` §8b read it to derive their focus.

If every attempted exercise was ✅, skip the appending half but still run the closing half.

---

### Step 6 — Commit message

**Branch:** SQL exercises and PROGRESS.md commit on **whatever branch is active** (CLAUDE.md
2026-07-14 — study materials follow the active branch; `main` only receives merges via PR). No
branch switch, no separate SQL branch.

**These are Victor's files — never run the commit yourself.** Print the commands below for him to
copy-paste; `practice/sql/` and `practice/simulations/` are his work, outside every auto-commit
exception.

List only files that were actually modified. Always one command per code block.

Use the exact folder path from the Step 4 path table for {TOPIC} — not `sql/{TOPIC}/`:

```
git add [exact path from Step 4 table] PROGRESS.md practice/sql/PLANNING.md
```

If Step 5 touched the mistake log:
```
git add practice/sql/MISTAKES.md
```

```
git commit -m "docs: SQL {TOPIC} review — [X/Y correct], [main gap or 'all solid']"
```

---

<!-- ============================================================ -->
<!-- FINAL STEP — both modes                                      -->
<!-- ============================================================ -->

## Final step — write the self-report

**Runs at the end of every run, in both modes.** Write
`notes/prompts/practice/sql/_last-run-report-sql-exercises.md`, overwriting the previous one. This is the
adaptation of `notes/prompts/_pipeline-self-report.md` for a single-shot prompt: no subagents, no
slices, so three bullets instead of five.

Header: today's date · `MODE` and `TOPIC` · a `Status:` line — `open` if the Verdict names a change
nobody has applied yet, `applied in <hash>` once this prompt has been edited to address it. A clean
run's status is `open` and stays `open`.

Then exactly these three bullets, honest, including "nothing to report":

1. **Resolution vs reality** — the config is two keys, so this bullet is about what the prompt
   *derived*: did the `{COUNT}` and `{FOCUS}` read from PLANNING.md §6 produce what the step actually
   needed, or was the batch mis-sized or off-scope? Did `{FILE}` resolve to the right file? Name it if
   a path, a coverage section, or a §6 step turned out to be wrong, missing, or stale. **A wrong
   derived value is a bug in the plan, not in the run** — say which file needs the fix.
2. **Rule friction and rule breaches** — any instruction here that was ambiguous, contradictory, or had
   to be worked around; **and any rule this run broke** — the run-start check skipped, the coverage
   lookup failed and the seeds were used anyway, correction markers not written, PLANNING.md not
   updated. Name what was breached and what it cost.
3. **Verdict** — one line: "prompt limpio" or "cambio a considerar: <qué>".

### Refinement — apply the verdict, or the report is just a diary

**Skip entirely when the Verdict is "prompt limpio".** Otherwise: this prompt is frozen, and a
self-report is the only evidence that reopens it — but evidence nobody acts on rots. The orchestrators
close this loop (`notes/prompts/_pipeline-self-report.md`, "Commit flow"); a single-shot prompt closes
it the same way, with one cold reviewer instead of a pipeline.

1. Draft the edit: the smallest clause that would have prevented this run's friction. A clause, never
   a paragraph — the war story stays in the report, the prompt states the rule crisply.
2. Dispatch **one cold subagent** (it has not seen this run) with: the drafted edit, the bullet that
   motivated it, and this bar. It answers **apply** or **reject**, with one line of reasoning:
   - Reject if the friction was a one-off, if an existing rule already covers it, or if the edit
     restates something the plan owns — **a fix that belongs in `practice/sql/PLANNING.md` is applied
     there, not here.** That is the most common correct verdict for this prompt.
   - This file is over 1000 lines, so **one-in-one-out applies**: the reviewer must name what stale
     caveat or spent incident comes *out* to make room, or reject the edit.
3. On **apply**: make the edit, commit it alone (`docs: sql-exercises — refine from the run that just
   finished`), read the hash from `git log` (never from memory), and set the report's
   `Status: applied in <hash>`. Print one line naming what went in and one naming what came out.
   On **reject**: leave the prompt untouched and record the rejection and its reason in the Verdict,
   so a future run does not re-propose it. `Status` stays `open`.

**Never edit the prompt and then re-run it in the same conversation** — that is the entangled
before-and-run pattern this step exists to avoid.

**Keep it short.** This file exists to surface what broke; padding it with what went well buries the
one finding that should reopen the prompt. It is about the machinery, never the SQL — which exercises
were wrong belongs in the chat summary, not here.

**Commit it yourself** — `notes/prompts/` is prompt-system machinery, inside the auto-commit
exception in CLAUDE.md, and separate from the exercise commit Victor runs:

```
git add notes/prompts/practice/sql/_last-run-report-sql-exercises.md
```
```
git commit -m "docs: self-report for sql-exercises run ({MODE}, {TOPIC})"
```

> The run tracker (`notes/prompts/_run-tracker.md`) is an orchestrator ledger — this prompt does not
> write to it.

---

[optional — paste an exercise file below this line only if your answers are not saved to disk yet;
a paste overrides {FILE}]
````
