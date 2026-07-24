# SQL exercise seeds — per-topic structure and exercise ideas

**Internal component of `sql-exercises-prompt.md`. Not runnable.**

**What this is:** for each `TOPIC` the exercise prompt accepts, the *shape* a batch should take and
concrete exercise ideas worth drilling — the accumulated judgement about what makes a good exercise on
that topic, including the traps worth building a question around and the Challenge that ties the topic
together.

**What this is NOT: the scope list.** `notes/sql/coverage/junior.md` defines what must be learned, and the
reconciliation rule in the prompt's Step 3 governs any conflict — **coverage-junior.md always wins on scope.**
A concept here that coverage-junior.md dropped is stale and comes out; a coverage section with no seed here is
generated from coverage-junior.md directly, never skipped.

**How it is read:** the prompt's Step 3 looks up **only the block for the run's `TOPIC`** and ignores
the other seventeen. Extracted 2026-07-22, when the prompt passed 1200 lines and this block was 267 of
them — carrying seventeen irrelevant topic blocks into every run's context was the largest single cost
in the file.

**Heading style is not `TOPIC` style.** Blocks are headed in caps with spaces (`GROUP BY`,
`WINDOW FUNCTIONS`, `SCHEMA DESIGN`, `DATA TYPES`) where the topic value is lowercase and hyphenated
(`group-by`, `window-functions`, `schema-design`, `data-types`). The match is case- and
separator-insensitive; four topics would otherwise look unseeded and are not.

---


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

