# SQL Exercises Prompt

Use in a **separate conversation**. Fill in the configuration block, then paste the prompt into a new chat.

Two modes:

- **`practice`** — generates exercises for a SQL topic and saves them to `sql/`. If the topic file already exists, adds more exercises continuing the numbering.
- **`review`** — checks your answers. Paste the exercise file at the very end of the prompt.

> **▶ Run first:** nothing — `practice` generates exercises from scratch; `review` needs your answers pasted at the end.

---

**How to use:**

1. Fill in `MODE` and `TOPIC`
2. Set `COUNT` if you want more or fewer exercises than the default
3. Set `FOCUS` to concentrate on a specific concept within the topic (optional)
4. Paste the prompt into a new chat
5. If `MODE = review`: paste your answered file at the very end

---

````
## Configuration — edit only this block

MODE  = [practice | review]
TOPIC = [joins | group-by | nulls | subqueries | ctes | dml | transactions | window-functions | normalization | schema-design | data-types | postgresql-specifics | indexes | all]

## TOPIC = all (practice mode only) generates exercises for every SQL topic in turn —
## see notes/prompts/_batch-mode.md. Order: joins, group-by, nulls, subqueries, ctes, dml,
## transactions, window-functions, normalization, schema-design, data-types,
## postgresql-specifics, indexes. Review mode stays one file at a time — it needs your pasted answers.
COUNT = [number of exercises to generate — default: 12 — only used in practice mode]
FOCUS = [specific concept to practise — optional, practice mode only]
        Example: FOCUS = LEFT JOIN, FULL OUTER JOIN
        Example: FOCUS = HAVING, aggregate filters
        Leave blank to cover the full topic

Validation — check these before doing anything else:
- If MODE or TOPIC is blank: print "Error: MODE and TOPIC are required." and stop.
- If COUNT is blank: use 12.
- If COUNT is not a positive integer or is less than 4: print "Warning: COUNT must be at least 4 for the difficulty distribution to work. Using COUNT = 4." and use 4.

---

## Context

**Before starting, read these three files:**
- `CLAUDE.md` — daily schedule and teaching context (my profile and the market are in `notes/prompts/_shared-context.md`).
- `PROGRESS.md` — the SQL section shows which topics are already solid.
- `notes/sql/coverage.md` — the source of truth for every SQL concept required at junior level. Read it now; in Step 3 you will use the section for {TOPIC} to define the concept scope for the exercises.

My profile is in `notes/prompts/_shared-context.md`.

My daily SQL block is 12:30–13:30. I write answers directly in the SQL file in pgAdmin
(PostgreSQL), then paste it into review mode. This block feeds into Stage 2: technical test
simulation — so exercises should reflect the kind of SQL a real consultancy test includes.

SQL is not isolated from the rest of the stack. Where relevant, connect a concept to its
Spring Boot or JPA equivalent in the exercise description (e.g. transactions → @Transactional,
schema design → @Entity + @OneToMany, indexes → N+1 query problem).

Study order (matches ROADMAP.md):
JOINs (02) → GROUP BY (03) → NULLs (04) → subqueries (05) → CTEs (06) → DML (07)
→ transactions (12) → window functions (10) → normalization (08) → schema design (09)
→ data types (13) → PostgreSQL specifics (14) → indexes (11)

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
- postgresql-specifics: insert author and book names with mixed case (e.g. 'ORWELL', 'Orwell',
  'george orwell') so ILIKE vs LIKE differences produce visibly different result sets;
  ensure orders span at least 6 distinct months so DATE_TRUNC('month', ...) produces
  meaningful grouping in report queries

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
- If it exists: read it. Scan for lines matching the pattern `-- Exercise [number] [`. Take the
  highest number found — call it N. New exercises will start from N+1. If no line matches this
  pattern (file exists but has only the setup block and no exercises yet), set N = 0 and start
  from Exercise 1. Do NOT regenerate the setup block in either case.
- If the file does not exist: set N = 0 and generate the complete file including the setup block.

---

### Step 2 — Generate the setup block (new files only)

Skip this step if the file already exists.

**Self-contained topics — no bookstore setup block:** for `normalization`, `schema-design`,
and `data-types`, do NOT generate the bookstore setup block. Each exercise in these topics
carries its own table definitions. For a new file of one of these topics, generate only the
header comment and the `-- EXERCISES: {TOPIC}` banner, then go straight to Step 3. The rest
of this step applies only to the bookstore-based topics (joins, group-by, nulls, subqueries,
ctes, dml, transactions, window-functions, postgresql-specifics, indexes).

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

**If FOCUS is blank:** cover the full topic. Use `notes/sql/coverage.md` as the primary
source of concept scope — read the section that corresponds to {TOPIC} using the mapping
below, and ensure every concept item listed there is addressed across the exercises.
The topic-specific focus rules further below define exercise format, special constraints,
and structure; coverage.md defines the concept scope. If coverage.md lists a concept not
explicitly mentioned in the focus rules, treat it as an additional item to include,
especially in Standard and Challenge exercises.

| TOPIC | coverage.md section to read |
|-------|-----------------------------|
| joins | ## JOINs |
| group-by | ## Aggregates and grouping |
| nulls | ## Filtering and NULL handling |
| subqueries | ## Subqueries, CTEs, and views — subquery items only |
| ctes | ## Subqueries, CTEs, and views — CTE and view items |
| dml | ## DML — modifying data |
| transactions | ## Transactions |
| window-functions | ## Window functions |
| normalization | ## Schema design — normalization items |
| schema-design | ## Schema design |
| data-types | ## Data types |
| postgresql-specifics | ## PostgreSQL specifics |
| indexes | ## Performance basics |

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

**Cross-topic integration rule:** for the bookstore-based query topics from nulls onward
(nulls, subqueries, ctes, transactions, window-functions, postgresql-specifics, indexes),
at least one Challenge exercise must combine the current topic with a concept from an earlier
topic. Examples: a subquery Challenge that also requires a JOIN; a CTEs Challenge that uses
GROUP BY inside a CTE; a window functions Challenge that filters with a WHERE clause using
IS NULL. This rule does not apply to the self-contained design topics (normalization,
schema-design, data-types) — they have no shared query schema to integrate with.

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

**Topic-specific focus:**

JOINS
- INNER JOIN (basic), LEFT JOIN (keep rows with no match), RIGHT JOIN, FULL OUTER JOIN
- Self-join (e.g. authors who share the same country)
- Multi-table JOIN (3+ tables)
- At least two exercises where JOIN type matters: INNER would lose rows, LEFT is needed
- Challenge: find books with no orders (LEFT JOIN + IS NULL pattern)

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

POSTGRESQL SPECIFICS
Exercises use the bookstore schema. Each exercise must require at least one PostgreSQL-specific feature — not achievable with standard SQL alone.
Cover:
- :: cast operator — created_at::date, price::text, '5'::int; exercises with date comparisons that require casting a timestamp to date
- ILIKE — case-insensitive search; one exercise explicitly comparing LIKE (case-sensitive, finds nothing) vs ILIKE (case-insensitive, finds results) on the same query
- DISTINCT ON — get one row per group with multiple columns; the column in DISTINCT ON(...) must be leftmost in ORDER BY; exercise: most recent order per customer
- RETURNING — exercises with INSERT/UPDATE/DELETE that return the affected row without a second SELECT; Victor must write the full statement and explain why this avoids a round-trip
- DATE_TRUNC('month', date) — group orders by calendar month; exercise: monthly sales report showing total revenue per month
- NOW() vs CURRENT_DATE — NOW() returns timestamp with time; CURRENT_DATE returns date only; exercises filtering recent rows using each
- INTERVAL — WHERE order_date > NOW() - INTERVAL '30 days'; exercise: find customers who joined in the last 90 days
- STRING_AGG(column, separator) — concatenate grouped values into one string (e.g. list all genre names for a given author on one line); exercise: report showing authors and their genres as a comma-separated column
Challenge: a query that combines at least three of the above features in one statement (e.g. DISTINCT ON + DATE_TRUNC + RETURNING).

INDEXES
Use the bookstore schema with 500+ rows (use generate_series() in setup).
Cover: CREATE INDEX on a single column, composite index, partial index,
EXPLAIN ANALYZE before and after adding an index, when NOT to add an index
(low-cardinality column), index on a column used in ORDER BY.
Also cover: LIMIT with ORDER BY for pagination — why ORDER BY is mandatory without it results are non-deterministic; why large OFFSET is slow on big tables; how an index on the ORDER BY column helps.
Challenge: analyze a slow query and decide what index to add, then verify with EXPLAIN ANALYZE.

---

### Step 4 — Save the file

| Topic | Path |
|-------|------|
| joins | sql/02-joins/exercises.sql |
| group-by | sql/03-group-by/exercises.sql |
| nulls | sql/04-nulls/exercises.sql |
| subqueries | sql/05-subqueries/exercises.sql |
| ctes | sql/06-ctes/exercises.sql |
| dml | sql/07-dml/exercises.sql |
| normalization | sql/08-normalization/exercises.sql |
| schema-design | sql/09-schema-design/exercises.sql |
| window-functions | sql/10-window-functions/exercises.sql |
| indexes | sql/11-indexes/exercises.sql |
| transactions | sql/12-transactions/exercises.sql |
| data-types | sql/13-data-types/exercises.sql |
| postgresql-specifics | sql/14-postgresql-specifics/exercises.sql |

If the folder does not exist, create it using the path above.

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

Read the file Victor pasted at the end of this chat.
Identify the topic from the file header.

For each exercise, check if there is any content after "-- Your answer:" (ignoring blank
lines and comment-only lines):
- Answer present: review it.
- No answer: mark as "— Sin responder" in the summary. Exclude from score and breakdown.

**Partial-file detection:** if the first N exercises are all "Sin responder" and only later
exercises have answers, print one line at the top:
"Revisando ejercicios [first answered] a [last answered]."
This is normal when reviewing a new append batch.

---

### Step 2 — Check each answer

Run each query mentally against the schema defined in the setup block.
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

**For postgresql-specifics exercises:** check:
- Is the PostgreSQL-specific syntax used correctly (:: cast, ILIKE, DISTINCT ON, RETURNING, DATE_TRUNC, STRING_AGG, INTERVAL)?
- For ILIKE vs LIKE: does the answer demonstrate understanding of case sensitivity — not just use ILIKE?
- For DISTINCT ON: is the column inside DISTINCT ON(...) also the leftmost column in ORDER BY?
- For RETURNING: does Victor explain why it avoids a second SELECT?

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
Para practicar más los conceptos donde fallaste, ejecuta el prompt en modo practice con:
  TOPIC = {TOPIC}
  FOCUS = [list the specific concepts that had ❌ or ⚠️ answers]
  COUNT = 8"
Then proceed to Steps 4 and 5.

**Score ≥ 60% and < 80%:**
"Base sólida. Repasa los ejercicios marcados con ⚠️ o ❌ antes de avanzar."
Then proceed to Steps 4 and 5.

**Score ≥ 80%:**
"Listo para marcar {TOPIC} como sólido. Pasamos al siguiente tema."
Find {TOPIC} in the study order below. The next topic is the one immediately to the right.
joins → group-by → nulls → subqueries → ctes → dml → transactions → window-functions
→ normalization → schema-design → data-types → postgresql-specifics → indexes
Print: "Siguiente tema: [next topic]. Ejecuta el prompt en modo practice con TOPIC = [next topic]."
If {TOPIC} is indexes (the last topic): print "Has completado todos los temas SQL. Revisa PROGRESS.md."
Then proceed to Steps 4 and 5.

---

### Step 4 — Update PROGRESS.md

Read PROGRESS.md. Find the `## SQL` section. Within it, look for a `### Exercises completed` table.

The table format is (4 columns — shared with `progress-update-prompt`):

```markdown
### Exercises completed

50 total exercises across 2 topics

| Topic | Folder | Exercises | Status |
|-------|--------|-----------|--------|
| basics / SELECT | sql/01-basics.sql | 40 | in progress ⏳ |
| joins | sql/02-joins.sql | 24 | solid ✅ |
```

**If the table exists:** find the row for {TOPIC} and update the `Exercises` and `Status` columns:
- Status: `solid ✅` if score ≥ 80%; `in progress ⏳` if score < 80%
- Exercises: count all exercises in the reviewed file, including any previous batches
- Leave the `Folder` column as-is (it is the file path, e.g. `sql/02-joins.sql`)
- Then refresh the `X total exercises across Y topics` summary line above the table to match the
  new column totals

**If the row for {TOPIC} does not exist in the table:** add it. Fill `Folder` with the file's
path (`sql/<NN>-<topic>.sql` for a flat file, `sql/<NN>-<topic>/` for a subfolder).

**If the `### Exercises completed` table does not exist in PROGRESS.md:** create it under a new
`### Exercises completed` heading, with the 4-column format and the summary line above. Insert it
at the end of the `## SQL` section — after the last existing `###` heading in that section and
before the next `##` heading.

---

### Step 5 — Interview questions

For each distinct conceptual gap revealed by ⚠️ or ❌ answers, add one interview question.
"Distinct gap" means a different underlying concept. If three exercises failed for the same
reason (e.g. WHERE vs HAVING), add one question, not three.

This step runs for any score. Even at ≥ 80%, if one or two exercises were ⚠️ or ❌, add
questions for those gaps. If every exercise was ✅, skip this step entirely.

Add each question to `notes/interview-prep/en/sql.md` and `notes/interview-prep/es/sql.md` following
**"Adding questions from outside the audit (practice prompts)"** in
`notes/prompts/knowledge/interview-prep/_interview-prep-standard.md` — it defines the question format,
the bilingual rule, dedupe-by-concept, placement under the matching `##` section, and priority-marker
reordering. Do not restate them here. Two SQL-specific points on top of the standard:

- **Anchor the answer to the exercises.** Reference the bookstore schema or the exercise number when
  the question is about a query pattern (e.g. "In the JOINs exercises, I used LEFT JOIN + IS NULL to
  find authors with no books…").
- **Priority calibration for SQL:** ⭐⭐⭐ = core pattern that filters in a first screen (WHERE vs
  HAVING, INNER vs LEFT JOIN, NULL comparison behaviour, COUNT(*) vs COUNT(column)); ⭐⭐ = deeper
  probes (COALESCE, correlated subqueries, EXISTS vs IN, DML with RETURNING); ⭐ = PostgreSQL-specific
  edge cases.

---

### Step 6 — Commit message

**Branch:** SQL exercises and PROGRESS.md both live on `main` (there is no separate SQL branch).
Commit on `main`.

List only files that were actually modified. Always one command per code block.

Use the exact folder path from the Step 4 path table for {TOPIC} — not `sql/{TOPIC}/`:

```
git add [exact path from Step 4 table] PROGRESS.md
```

If interview questions were added:
```
git add notes/interview-prep/en/sql.md notes/interview-prep/es/sql.md
```

```
git commit -m "docs: SQL {TOPIC} review — [X/Y correct], [main gap or 'all solid']"
```

---

[paste your exercise file below this line — only needed in review mode]
````
