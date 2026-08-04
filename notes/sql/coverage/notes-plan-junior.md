# SQL Junior Notes Plan

Plan status: stale
Coverage: notes/sql/coverage/junior.md
Coverage SHA-256: 8bc2db5f2608d9470da9a28fb845bd7c0409cd33f29b091534e09dcec1d0a7bf
Generated: 2026-07-29

## 00 — SQL and relational databases

Status: pending
Action: create
English: notes/sql/junior/en/00-sql-and-relational-databases.md
Spanish: notes/sql/junior/es/00-sql-y-bases-de-datos-relacionales.md
Depends on: none
Pending additions: none

Narrative role: Orient Victor before syntax with the problem SQL solves, a declarative query-engine mental model, the target-stack context, and a map of the complete route.

Learning outcome: Victor can distinguish SQL, PostgreSQL, a database, a schema, and relational data; explain that he declares the result while PostgreSQL plans the work; and describe why chapters 01 through 16 follow this order.

Prerequisites: none.

Must answer:

- What persistence and shared-data problems does a relational database solve beyond JavaScript or TypeScript objects in one process?
- What is the difference between SQL, PostgreSQL, a database, a schema, a table, a row, and a column?
- What does declarative mean, and how does PostgreSQL turn a requested result into an execution plan?
- How does SQL fit between Angular, Spring Boot, JDBC or an ORM, and PostgreSQL?
- What does each chapter from 01 through 16 contribute, and why is that route ordered from structure to querying, mutation, reliability, analysis, and review?

Coverage concepts:

- none — this required introduction provides orientation rather than importing coverage from another level

Rationale: The introduction is required pedagogical scaffolding and deliberately owns no coverage bullet.

Handoff: With the system and full route visible, chapter 01 defines the value types and table-definition operations on which every later query depends.

## 01 — Data types and table definitions

Status: pending
Action: audit
English: notes/sql/junior/en/01-data-types.md
Spanish: notes/sql/junior/es/01-tipos-de-datos.md
Depends on: 00
Pending additions: none

Narrative role: Establish how PostgreSQL represents values and how CREATE TABLE, ALTER TABLE, DEFAULT, and DROP define or evolve the contract that stores them.

Learning outcome: Victor can choose justified PostgreSQL types and define or evolve a table while explaining precision, time, generated identity, defaults, and the difference between object and row deletion.

Prerequisites: entries 00.

Must answer:

- Why do data types affect precision, comparison, storage meaning, and valid operations?
- Why are NUMERIC and floating point different for money, and why can integer division discard a fraction?
- What instant does TIMESTAMPTZ represent compared with DATE and TIMESTAMP?
- How do identity columns differ from SERIAL, and what do BOOLEAN and JSONB guarantee?
- When does DEFAULT apply, and why does an explicit NULL or an existing row behave differently?
- How do CREATE TABLE, ALTER TABLE, DROP, DELETE, and TRUNCATE change different things?

Coverage concepts:

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- `NUMERIC(p,s)` vs `FLOAT` — `FLOAT` is an approximation that compounds rounding errors over time; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices and financial values; interviewers ask "why would you not use `FLOAT` for money?"
- Integer division and explicit casts — integer divided by integer truncates the fractional part in PostgreSQL; cast an operand to `NUMERIC` when the result must retain decimals
- `DATE` vs `TIMESTAMP` / `TIMESTAMPTZ` — use `DATE` for a calendar value with no time of day, `TIMESTAMP` for a local wall-clock value, and `TIMESTAMPTZ` for an instant shared across time zones
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does
  not generally treat an unquoted integer `1` as a boolean
- `JSONB` recognition — stores validated JSON in a binary representation that supports PostgreSQL operators and indexes; keep relational columns for stable fields that need ordinary constraints and joins
- `CREATE TABLE` — defines columns, data types, defaults, and constraints together; read the full definition before loading data because the database, not the application, enforces it
- `ALTER TABLE` — evolves an existing table by adding, changing, or dropping columns and constraints; versioned migration tooling belongs to the application stack, while SQL owns the resulting schema change
- `DROP` vs deleting rows — `DROP` removes the database object itself, whereas `DELETE` and `TRUNCATE` keep the table and remove data
- `DEFAULT` — supplies a value only when an insert omits the column; it does not replace an explicitly inserted `NULL`, and it does not backfill old rows unless the schema change does so

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Once tables have typed columns and an explicit definition, chapter 02 connects them with keys, constraints, cardinality, and normalization.

## 02 — Relationships, keys, and constraints

Status: pending
Action: audit
English: notes/sql/junior/en/02-relationships.md
Spanish: notes/sql/junior/es/02-relaciones.md
Depends on: 00, 01
Pending additions: none

Narrative role: Turn typed tables into a coherent relational model whose keys and constraints protect identity, references, and business invariants.

Learning outcome: Victor can read and design a small normalized schema, place foreign keys and junction tables correctly, and justify every key, nullability rule, constraint, and deletion action.

Prerequisites: entries 00, 01.

Must answer:

- How do table grain, primary keys, candidate keys, surrogate keys, and foreign keys describe identity and relationships?
- Why does the foreign key belong on the many side, and how does a junction table model many-to-many data?
- How do UNIQUE, composite uniqueness, NOT NULL, CHECK, and CHECK with NULL differ?
- How do NO ACTION, RESTRICT, CASCADE, and SET NULL change parent deletion?
- Which insert, update, and delete anomalies does normalization prevent?

Coverage concepts:

- Primary key — one optional table constraint, possibly composite, that uniquely identifies rows;
  application tables normally define one even though SQL does not require every table to have it
- Foreign key — one or more columns referencing a primary or other unique candidate key;
  PostgreSQL rejects values with no referenced row, enforcing referential integrity
- `ON DELETE` behavior — PostgreSQL defaults to `NO ACTION`; `RESTRICT` also rejects referenced-row deletion but cannot be deferred, `CASCADE` deletes dependent rows, and `SET NULL` clears a nullable foreign key
- `NOT NULL` constraint — the column must always have a value; used on required fields like `email`, `password`, `status`; interviewers ask why you chose to add it
- `UNIQUE` constraint — rejects duplicate non-`NULL` keys and creates a supporting unique B-tree index; PostgreSQL permits multiple `NULL` values by default unless `NULLS NOT DISTINCT` is requested
- Composite uniqueness — a `UNIQUE` constraint across several columns enforces a business rule on the combination, such as one membership per `(user_id, project_id)`
- `CHECK` constraint and `NULL` — a check rejects `FALSE` but accepts `TRUE` or `UNKNOWN`, so `CHECK (hours > 0)` still needs `NOT NULL` when hours are required
- One-to-many relationships — place the foreign key on the many side so each child references one parent while a parent can own several children
- Many-to-many relationships — use a junction table with two foreign keys and usually a composite uniqueness rule so each pair appears only once
- Natural vs surrogate keys — a surrogate key gives the row a stable technical identity, while a natural business key still needs a `UNIQUE` constraint when the domain says it cannot repeat
- Normalization and data anomalies — store each fact in the relation determined by its key so inserts, updates, and deletes do not require inconsistent copies; formal normal-form analysis belongs to middle
- Reading a relational schema — identify each table's grain, primary key, foreign keys, nullability, and relationship cardinality before constructing a query

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: With the schema understandable as a set of related typed tables, chapter 03 can request rows and expressions from it.

## 03 — SELECT, expressions, and text

Status: pending
Action: audit
English: notes/sql/junior/en/03-select.md
Spanish: notes/sql/junior/es/03-select.md
Depends on: 00, 01, 02
Pending additions: none

Narrative role: Introduce the declarative SELECT result, source rows, aliases, expressions, quoting, DISTINCT, CASE, and common text transformations.

Learning outcome: Victor can build a result shape from named and computed columns, qualify ambiguous names, transform text, and explain the logical query stages visible so far.

Prerequisites: entries 00, 01, 02.

Must answer:

- How do SELECT, FROM, aliases, qualified references, and expressions define the result without changing source data?
- Why should application queries name columns rather than use SELECT *?
- How do CASE, DISTINCT, string concatenation, quoted identifiers, and integer operand types affect the result?
- How do LOWER, UPPER, TRIM, LENGTH, SUBSTRING, and REPLACE treat text, whitespace, characters, and NULL?
- How should the complete FROM and JOIN through LIMIT execution order be read as a preview before JOINs and grouping are taught in chapters 06 and 07?

Coverage concepts:

- `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- `CASE WHEN` in `SELECT` — `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row; interviewers ask you to add a status label to a result set
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase
- `||` string concatenation — joins two text values into one column, e.g. `first_name || ' ' || last_name AS full_name`; interviewers ask how you build a display name from separate columns without a function call
- `LOWER` and `UPPER` — normalise case for display or comparison while recognising that applying them to a column can affect ordinary index use
- `TRIM` — removes leading and trailing characters, whitespace by default, without changing whitespace inside the value
- `LENGTH` — counts characters in text rather than bytes, which matters for non-ASCII data
- `SUBSTRING` and `REPLACE` — extract part of a string or substitute matching text; use them for query shaping rather than repairing badly modelled data

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: After constructing result columns, chapter 04 decides which source rows survive through predicates and three-valued NULL logic.

## 04 — Filtering and NULL handling

Status: pending
Action: audit
English: notes/sql/junior/en/04-where.md
Spanish: notes/sql/junior/es/04-where.md
Depends on: 00, 01, 03
Pending additions: none

Narrative role: Teach WHERE predicates, precedence, three-valued logic, pattern matching, membership, defaults, and safe timestamp ranges.

Learning outcome: Victor can write correctly grouped filters and predict how TRUE, FALSE, UNKNOWN, NULL, membership lists, patterns, and time boundaries affect each row.

Prerequisites: entries 00, 01, 03.

Must answer:

- Why does = NULL never become TRUE, and how does UNKNOWN flow through NOT, AND, OR, and WHERE?
- Why can NOT IN return no rows when NULL is present, and why is the correlated NOT EXISTS alternative deferred to chapter 09?
- When do COALESCE and NULLIF express a deliberate contract rather than hide missing data?
- How do LIKE, ILIKE, %, _, IN, and operator precedence change a predicate?
- Why is a half-open timestamp range safer and more index-friendly than an inclusive date-only upper bound?

Coverage concepts:

- `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` — `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`; interviewers ask why `= NULL` does not work
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; use it when the query contract deliberately substitutes a default such as `0` or `'Unknown'`, without confusing missing data with a real value
- `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `BETWEEN` with timestamps — both endpoints are inclusive, so a date-only upper bound silently excludes later times on that date; use a half-open range such as `created_at >= start AND created_at < next_day` to preserve index use and include the whole period

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Once the correct rows can be selected, chapter 05 orders, limits, paginates, and combines complete result sets deterministically.

## 05 — Ordering, pagination, and set operations

Status: pending
Action: audit
English: notes/sql/junior/en/05-order-by-limit.md
Spanish: notes/sql/junior/es/05-order-by-limit.md
Depends on: 00, 03, 04
Pending additions: none

Narrative role: Control result order and size, make pagination stable, and combine compatible result sets with explicit duplicate semantics.

Learning outcome: Victor can produce deterministic sorted pages and choose UNION, UNION ALL, INTERSECT, or EXCEPT while satisfying their column and type rules.

Prerequisites: entries 00, 03, 04.

Must answer:

- How are multiple ORDER BY keys applied, and how do NULLS FIRST and NULLS LAST change PostgreSQL defaults?
- Why is LIMIT without ORDER BY arbitrary, and why does pagination need a unique tie-breaker?
- How is OFFSET calculated, and what limitation appears at large offsets?
- How do UNION, UNION ALL, INTERSECT, and EXCEPT treat duplicates, column counts, types, and result names?
- How does DISTINCT ON choose one row per group, and why must its expressions be the leftmost ORDER BY keys?

Coverage concepts:

- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages
- Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC`
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- `UNION` vs `UNION ALL` — `UNION` combines the results of two queries and removes duplicate rows; `UNION ALL` keeps every row including duplicates and is faster because it skips the duplicate check; interviewers ask which one to use when you know the two result sets cannot overlap (`UNION ALL` — no reason to pay for a duplicate scan)
- `UNION` column rules — both queries must return the same number of columns with compatible types; column names in the result come from the first query; interviewers ask what happens if the column types do not match (PostgreSQL raises an error or silently casts, depending on the mismatch)
- `INTERSECT` and `EXCEPT` — `INTERSECT` keeps rows present in both results and `EXCEPT` keeps rows from the first result that are absent from the second; both remove duplicates unless `ALL` is requested

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: With one-table result sets controlled, chapter 06 combines rows from related tables without hiding cardinality mistakes.

## 06 — JOINs

Status: pending
Action: audit
English: notes/sql/junior/en/06-joins.md
Spanish: notes/sql/junior/es/06-joins.md
Depends on: 00, 02, 03, 04
Pending additions: none

Narrative role: Combine related tables while predicting cardinality and deliberately preserving, rejecting, or locating unmatched rows.

Learning outcome: Victor can choose every junior join type, write readable aliases and ON conditions, predict row multiplication, and preserve outer-join semantics.

Prerequisites: entries 00, 02, 03, 04.

Must answer:

- How does PostgreSQL match rows through ON, and why can a one-to-many join multiply a source row?
- When do INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self joins apply?
- How does LEFT JOIN plus right-side IS NULL find missing relationships?
- Why can moving a right-side condition from ON to WHERE turn a LEFT JOIN into an inner join?
- Why is DISTINCT not a valid blind repair for apparent duplicates, and how do aliases prevent ambiguity?

Coverage concepts:

- `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- `RIGHT JOIN` — mirror of `LEFT JOIN`; rarely used because any `RIGHT JOIN` can be rewritten as a `LEFT JOIN` by swapping the tables; tested to check you understand the symmetry
- `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- Multiple JOINs — you can chain as many JOINs as needed; interviewers ask you to write a query joining three tables, for example `time_entries → users → projects`
- JOIN cardinality and row multiplication — predict whether each relationship is one-to-one, one-to-many, or many-to-many before joining; apparent duplicates usually mean the join produced several legitimate matches, so `DISTINCT` must not be used as a blind repair
- `ON` vs `WHERE` with an outer join — a condition in `ON` controls which right-side rows match while preserving unmatched left rows; moving that condition to `WHERE` can reject the `NULL`-extended rows and accidentally turn a `LEFT JOIN` into an inner join
- Self JOIN — a table joined to itself using two aliases, used to compare rows within the same table (e.g. "which employees share the same manager?" or "find duplicate emails"); interviewers ask how you join a table to itself when there is only one `FROM` clause to work with
- `CROSS JOIN` — produces every combination of the two inputs; use it only when a Cartesian product is intentional and recognise a missing join condition as the accidental version
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Correct combined rows are the input chapter 07 summarises into counts, totals, averages, and grouped reports.

## 07 — Aggregates and grouping

Status: pending
Action: audit
English: notes/sql/junior/en/07-aggregates.md
Spanish: notes/sql/junior/es/07-agregados.md
Depends on: 00, 03, 04, 06
Pending additions: none

Narrative role: Collapse detail rows into trustworthy summaries while preserving the distinctions among NULL input, empty input, row filters, and group filters.

Learning outcome: Victor can choose aggregates, form legal groups, keep zero-match groups, and write conditional aggregation with CASE or FILTER.

Prerequisites: entries 00, 03, 04, 06.

Must answer:

- Why do COUNT(*) and COUNT(column) differ, and what do all aggregates return for empty input?
- Which selected expressions must be grouped or aggregated, and what limited functional-dependency exception does PostgreSQL recognise?
- Why does WHERE filter rows before grouping while HAVING filters completed groups?
- How does LEFT JOIN keep zero-match groups, and why does COUNT of a nullable right-side column matter?
- When should conditional aggregation use CASE WHEN and when is FILTER clearer?
- How does CASE WHEN create one value per row in SELECT but choose contributing rows when nested inside an aggregate?

Coverage concepts:

- `COUNT(*)` vs `COUNT(column)` — `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `SUM` and `AVG` — both ignore `NULL`; `SUM` adds the known values and `AVG` divides by the count of known values, so `AVG` does not treat missing values as zero
- `MIN` and `MAX` — return the smallest or largest non-`NULL` input and work with ordered types such as numbers, text, and dates
- Aggregate results on empty input — `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, and `MAX` return `NULL` when no input rows remain; use `COALESCE` only when the result contract truly requires a default
- `GROUP BY` rule — selected expressions normally need to be grouped or aggregated; PostgreSQL also permits columns it can prove functionally dependent on a grouped primary key, but explicit grouping is clearer in portable junior SQL
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` — filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- Conditional aggregation with `CASE WHEN` — `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows; used for reporting by status in TimeTrack; interviewers ask "how would you count only approved entries per project?"
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: With grouped reports understood, chapter 08 safely changes rows under the schema and constraint contract.

## 08 — DML — modifying data

Status: pending
Action: audit
English: notes/sql/junior/en/08-dml.md
Spanish: notes/sql/junior/es/08-dml.md
Depends on: 00, 01, 02, 04
Pending additions: none

Narrative role: Create, update, and remove rows safely through explicit targets, bounded predicates, returned values, bulk insertion, truncation choices, and atomic conflicts.

Learning outcome: Victor can predict and verify the affected rows of INSERT, UPDATE, DELETE, TRUNCATE, and ON CONFLICT statements and keep runtime values bound separately from SQL structure.

Prerequisites: entries 00, 01, 02, 04.

Must answer:

- How do target columns, generated identity, defaults, nullability, multi-row VALUES, and INSERT SELECT determine a valid insert?
- How does RETURNING avoid a second query after INSERT, UPDATE, or DELETE?
- How do you prove the intended row set before UPDATE or DELETE?
- When do DELETE and TRUNCATE differ in filtering, locking, and identity restart?
- Why is ON CONFLICT atomic while SELECT followed by INSERT has a race condition?
- Why must application values use bound parameters rather than string interpolation?

Coverage concepts:

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- Multi-row `INSERT` and `INSERT ... SELECT` — insert several value tuples in one statement or populate a table from a query while matching target columns and compatible types
- `RETURNING` — `INSERT INTO users (...) VALUES (...) RETURNING id` — returns the generated ID without a second `SELECT`; PostgreSQL-specific; interviewers ask "how do you get the new ID after an INSERT?"
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE` and processes matching rows; `TRUNCATE`
  removes all rows with a stronger table lock and resets sequences only when `RESTART IDENTITY` is
  requested; choose deliberately rather than treating either as universally safe
- `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted
- Bound parameters — keep SQL structure separate from runtime values through prepared-statement or framework placeholders, preserving correct typing and reusable statement structure

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Several mutations can represent one business action, so chapter 09 first develops reusable nested query shapes used by later data work.

## 09 — Subqueries and existence tests

Status: pending
Action: audit
English: notes/sql/junior/en/09-subqueries.md
Spanish: notes/sql/junior/es/09-subconsultas.md
Depends on: 00, 03, 04, 06, 07
Pending additions: none

Narrative role: Nest queries when one result supplies a value, table, or existence relationship to another query without accidentally changing cardinality.

Learning outcome: Victor can choose scalar, derived-table, correlated, IN, EXISTS, JOIN, or pre-aggregation forms according to result shape, NULL semantics, and readability.

Prerequisites: entries 00, 03, 04, 06, 07.

Must answer:

- What row and column shape may WHERE, FROM, and scalar SELECT subqueries return?
- Why can a correlated subquery repeat work per outer row while an uncorrelated scalar subquery may be evaluated once?
- How do IN and EXISTS express different semantics without relying on a universal speed rule?
- When does a JOIN multiply rows that EXISTS would only test for presence?
- Why does NOT EXISTS remain safe when the compared subquery column can contain NULL?

Coverage concepts:

- Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` — must return at most one row and one column; an uncorrelated scalar subquery can be evaluated once, while a correlated one may require work for each outer row
- `IN` vs `EXISTS` — choose from result semantics and null behaviour rather than a universal speed rule: `IN` compares with a set of values, while correlated `EXISTS` asks whether at least one matching row exists; PostgreSQL may optimise either into a similar plan
- Correlated subquery — references a column from the outer row and expresses a per-row relationship; compare it with `EXISTS`, a join, or pre-aggregation when the repeated relationship is hard to read or slow
- Subquery vs `JOIN` — choose the form that expresses the required result cardinality clearly; a join can multiply rows while `EXISTS` only tests presence, and PostgreSQL can often optimise equivalent formulations similarly
- `NOT IN` with `NULL` — if the subquery or list contains `NULL`, comparisons can become `UNKNOWN` and `NOT IN` may return no rows; use `NOT EXISTS` with a correlated equality when nullability is possible

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Subqueries can express the right result and still perform poorly; chapter 10 introduces the evidence and access structures used to investigate that cost.

## 10 — Performance basics

Status: pending
Action: audit
English: notes/sql/junior/en/10-indexes.md
Spanish: notes/sql/junior/es/10-indices.md
Depends on: 00, 02, 03, 04, 06
Pending additions: none

Narrative role: Introduce B-tree indexes, foreign-key indexing, sargable predicates, and EXPLAIN as evidence for access-path decisions.

Learning outcome: Victor can explain index read/write trade-offs, identify plausible candidates, recognise Seq Scan and Index Scan in EXPLAIN, and avoid predicates that prevent a normal B-tree from narrowing the scan.

Prerequisites: entries 00, 02, 03, 04, 06.

Must answer:

- How does an auxiliary B-tree access structure reduce row visits, and what storage and write work maintains it?
- Which primary and unique keys are indexed automatically, and why are referencing foreign keys not?
- Why can a sequential scan be reasonable for a small table or a weakly selective predicate?
- How do functions on indexed columns and leading-wildcard patterns affect sargability?
- What can EXPLAIN show before any index is added?

Coverage concepts:

- What an index is — an auxiliary access structure that can speed reads at the cost of storage and write maintenance; B-tree is PostgreSQL's common ordered index, while other index methods serve different operators
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- Foreign-key indexes — PostgreSQL indexes the referenced primary or unique key but not the referencing foreign-key columns automatically; add an index when joins or parent deletes need to find dependent rows efficiently
- When NOT to index — avoid indexes without a measured access pattern, especially on small tables or frequently updated columns; low cardinality alone is not decisive because a partial or composite index can still be selective
- `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- Sargable predicates — compare an indexed column directly to a compatible value or range when possible; wrapping the column in a function or starting a pattern with `%` can prevent a normal B-tree index from narrowing the scan

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Performance changes must not weaken correctness; chapter 11 groups related statements inside explicit transaction boundaries.

## 11 — Transactions

Status: pending
Action: audit
English: notes/sql/junior/en/11-transactions.md
Spanish: notes/sql/junior/es/11-transacciones.md
Depends on: 00, 02, 08
Pending additions: none

Narrative role: Protect multi-statement business operations with explicit boundaries, all-or-nothing outcomes, savepoints, failure recovery, and deliberate isolation.

Learning outcome: Victor can explain autocommit, BEGIN, COMMIT, ROLLBACK, ACID, savepoints, PostgreSQL's failed-transaction state, and the purpose of READ COMMITTED.

Prerequisites: entries 00, 02, 08.

Must answer:

- Why can autocommit leave a multi-statement business operation partially applied?
- What do Atomicity, Consistency, Isolation, and Durability each guarantee without treating constraints or serial execution as magic?
- How do SAVEPOINT and ROLLBACK TO undo only part of a transaction?
- Why does PostgreSQL reject later statements after one statement fails until rollback clears the state?
- What can READ COMMITTED observe, and when would a stronger isolation guarantee need a concrete justification?

Coverage concepts:

- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- Autocommit and explicit transaction boundaries — outside an explicit transaction, clients commonly commit each successful statement separately, so `BEGIN` or the framework transaction boundary is required when several statements must succeed or fail together
- ACID properties — Atomicity is all-or-nothing, Consistency preserves declared invariants from one
  valid state to another, Isolation controls interference between concurrent transactions, and
  Durability preserves committed work
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint without ending the transaction
- Transaction failure state — after a PostgreSQL statement errors inside a transaction, later statements are rejected until `ROLLBACK` or `ROLLBACK TO SAVEPOINT` clears the failed state
- Transaction isolation — controls which concurrent changes a transaction can observe; recognise PostgreSQL `READ COMMITTED` as the default and choose stronger guarantees only for a concrete consistency need

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: With correctness across statements established, chapter 12 names and reuses multi-step read logic through CTEs and views.

## 12 — CTEs and views

Status: pending
Action: audit
English: notes/sql/junior/en/12-ctes-and-views.md
Spanish: notes/sql/junior/es/12-ctes-y-vistas.md
Depends on: 00, 03, 06, 07, 09
Pending additions: none

Narrative role: Name query stages within one statement and save reusable query definitions across statements without confusing either with stored result data.

Learning outcome: Victor can structure multiple CTEs in dependency order and create a view whose live underlying query is reusable like a table.

Prerequisites: entries 00, 03, 06, 07, 09.

Must answer:

- What does WITH name, how long does a CTE exist, and why may each CTE reference only earlier definitions?
- When does naming a subquery improve a multi-step query rather than add ceremony?
- What does CREATE VIEW store, when does its query run, and how is that different from storing table rows?

Coverage concepts:

- `WITH` (CTE) — names a subquery so it can be referenced by name in the same query; makes multi-step queries readable; interviewers ask "when would you use a CTE instead of a subquery?"
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Reusable report inputs now make it practical to calculate ranking and neighbour-aware values without collapsing detail rows in chapter 13.

## 13 — Window functions

Status: pending
Action: audit
English: notes/sql/junior/en/13-window-functions.md
Spanish: notes/sql/junior/es/13-funciones-de-ventana.md
Depends on: 00, 03, 05, 07, 12
Pending additions: none

Narrative role: Calculate rankings, neighbour values, partition totals, and running totals while keeping every detail row.

Learning outcome: Victor can define partitions and order, choose ROW_NUMBER, RANK, or DENSE_RANK, use LAG and LEAD, and distinguish partition-wide totals from cumulative frames.

Prerequisites: entries 00, 03, 05, 07, 12.

Must answer:

- Why does GROUP BY collapse a group while an aggregate with OVER keeps every row?
- How do ROW_NUMBER, RANK, and DENSE_RANK treat ties differently?
- How do PARTITION BY and ORDER BY define the rows and sequence seen by LAG, LEAD, and ranking functions?
- Why does SUM OVER without ORDER BY repeat a partition total, while an ordered explicit cumulative frame produces a running total?

Coverage concepts:

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a unique sequential number to each row within a partition; used to get "the latest time entry per user" by filtering `WHERE row_num = 1` in an outer query; a very common interview pattern
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- `DENSE_RANK()` vs `RANK()` — both give ties the same rank, but `DENSE_RANK()` does not leave gaps after a tie; choose it when the next distinct value must receive the next consecutive rank
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; used to compare consecutive time entries
- Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- Partition total vs running total — `SUM(value) OVER (PARTITION BY group_key)` repeats the whole partition total; adding `ORDER BY` and an explicit cumulative frame produces a running total

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: The analytical toolkit is complete; chapter 14 collects PostgreSQL-specific date, cast, return, and aggregation features and marks their portability boundaries.

## 14 — PostgreSQL specifics

Status: pending
Action: audit
English: notes/sql/junior/en/14-postgresql-specifics.md
Spanish: notes/sql/junior/es/14-particularidades-de-postgresql.md
Depends on: 00, 01, 03, 05, 07, 08
Pending additions: none

Narrative role: Consolidate PostgreSQL-specific syntax and reporting features already grounded in querying, mutation, dates, grouping, and ordering.

Learning outcome: Victor can use casts, DATE_TRUNC, EXTRACT, transaction-time NOW, CURRENT_DATE, INTERVAL, and STRING_AGG while explaining index and portability consequences.

Prerequisites: entries 00, 01, 03, 05, 07, 08.

Must answer:

- How does :: relate to standard CAST, and when can casting a column prevent a simple index condition?
- How do DATE_TRUNC and EXTRACT answer different reporting questions?
- Why does NOW return the transaction-start timestamp while CURRENT_DATE represents a session calendar date?
- How do INTERVAL and STRING_AGG work with existing date, ordering, and grouping concepts?

Coverage concepts:

- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `EXTRACT` — returns one date/time field such as year, month, or hour for filtering or reporting; use it deliberately because applying a function to an indexed column can prevent a simple index condition
- `NOW()` vs `CURRENT_DATE` — `NOW()` returns the transaction-start timestamp, while `CURRENT_DATE` returns the session's current date with no time component
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- `STRING_AGG(column, separator)` — concatenates values from multiple rows into one string per group, e.g. `STRING_AGG(name, ', ')` to list all project names for a user on one line; PostgreSQL-specific; interviewers ask how you would turn grouped rows into a single comma-separated column for a report

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: Chapter 15 turns all preceding mechanisms into a repeatable construction and review workflow.

## 15 — Query workflow and SQL review

Status: pending
Action: create
English: notes/sql/junior/en/15-query-workflow-and-review.md
Spanish: notes/sql/junior/es/15-flujo-de-trabajo-y-revision-de-sql.md
Depends on: 00, 02, 03, 04, 05, 06, 07, 08, 10
Pending additions: none

Narrative role: Consolidate SQL into a professional workflow that begins from result grain, builds incrementally, binds values, verifies totals, and reviews common failure modes.

Learning outcome: Victor can translate a business question into staged SQL, predict and test row counts and edge cases, review mutations and pagination safely, and explain each clause in an interview.

Prerequisites: entries 00, 02, 03, 04, 05, 06, 07, 08, 10.

Must answer:

- How do you define result grain, tables, join paths, filters, grouping, and ordering before writing syntax?
- Why should runtime values be bound parameters, and what safety and typing properties does that preserve?
- How does inspecting a small sample and expected row count after each stage locate the first wrong transformation?
- Which control queries verify report totals at the intended grain?
- How do you review Cartesian products, row multiplication hidden by DISTINCT, NULL predicates, unsafe mutation scope, date boundaries, and unstable pagination?

Coverage concepts:

- Query construction from a business question — decide the result grain first, then identify tables, join paths, filters, grouping, and ordering before writing syntax
- Incremental query debugging — inspect a small sample after each join, filter, and aggregation, and predict the expected row count so errors are found where they enter
- Report-total verification — compare complex report totals with simpler control queries at the intended grain before trusting the result
- Join-review failures — detect accidental Cartesian products, incorrect cardinality, and `DISTINCT` used to hide row multiplication
- Predicate-review failures — detect `NULL` comparisons, unsafe value interpolation, and date ranges that omit boundary rows
- Mutation-review failures — detect unbounded `UPDATE` or `DELETE` statements and verify the intended affected-row set before execution
- Pagination-review failures — require deterministic ordering and recognise when large `OFFSET` values make a different pagination strategy necessary

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: The final chapter applies that workflow to an inherited database whose schema, permissions, and server-side behaviour must first be discovered.

## 16 — Working with an existing database

Status: pending
Action: create
English: notes/sql/junior/en/16-working-with-an-existing-database.md
Spanish: notes/sql/junior/es/16-trabajar-con-una-base-de-datos-existente.md
Depends on: 00, 01, 02, 03, 08, 15
Pending additions: none

Narrative role: Close the junior route with the consultancy scenario of inspecting, querying, and diagnosing a database Victor did not design.

Learning outcome: Victor can inspect catalogs and schemas, resolve names through qualification and search path, classify common errors, recognise least-privilege grants, and investigate routines or triggers behind unexpected behaviour.

Prerequisites: entries 00, 01, 02, 03, 08, 15.

Must answer:

- How do object browsers, information_schema, and PostgreSQL catalogs reveal columns, types, nullability, keys, and constraints?
- How do schema-qualified names and search path determine which relation a statement resolves?
- How do syntax or name-resolution errors differ from cast, operator, and constraint errors?
- Why should an application role receive only required object privileges rather than superuser access?
- How can stored routines and triggers cause behaviour not visible in an application statement?

Coverage concepts:

- Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access
- Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects

Rationale: The assigned concepts form one teachable mental model for this point in the route.

Handoff: This chapter closes the junior SQL journey by applying the complete route to unfamiliar real-world data under review and operational constraints.

## Unassigned existing notes

- none
