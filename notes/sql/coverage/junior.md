# Minimum Coverage — SQL

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Database is PostgreSQL. Every item must be explainable with a real query — from the bookstore exercises or the TimeTrack data model.

---

## JOINs

- `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- `RIGHT JOIN` — mirror a `LEFT JOIN` and recognise that swapping table order can express the same outer-join relationship more conventionally
- `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- Multiple JOINs — chain relationships through several tables while keeping every join condition tied to the intended key path
- JOIN cardinality and row multiplication — predict whether each relationship is one-to-one, one-to-many, or many-to-many before joining; apparent duplicates usually mean the join produced several legitimate matches, so `DISTINCT` must not be used as a blind repair
- `ON` vs `WHERE` with an outer join — a condition in `ON` controls which right-side rows match while preserving unmatched left rows; moving that condition to `WHERE` can reject the `NULL`-extended rows and accidentally turn a `LEFT JOIN` into an inner join
- Self JOIN — assign separate aliases to one table so rows from that table can be related or compared with each other
- `CROSS JOIN` — produces every combination of the two inputs; use it only when a Cartesian product is intentional and recognise a missing join condition as the accidental version
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

---

## Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` — count all input rows or only rows where the selected expression is non-`NULL`
- `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN` — an unmatched left row survives as one `NULL`-extended row, so `COUNT(*)` reports `1` for a group that actually has nothing; count a non-nullable column from the right table to get the `0` the report means
- `COUNT(DISTINCT column)` — counts how many different non-`NULL` values a group holds rather than how many rows carry them; the correct repair when a legitimate join multiplication has inflated a plain `COUNT`
- `SUM` — add the known values of a numeric column across a group, ignoring `NULL` instead of treating it as zero ✅ 07-timetrack
- `AVG` — divide the sum of known values by the count of known values, so a `NULL` lowers neither side and a missing value is never averaged in as a zero
- `MIN` and `MAX` — return the smallest or largest non-`NULL` input and work with ordered types such as numbers, text, and dates
- Aggregate results on empty input — `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, and `MAX` return `NULL` when no input rows remain; use `COALESCE` only when the result contract truly requires a default ✅ 07-timetrack — `COALESCE(SUM(...), 0)` in the summary query is what makes a month with no entries answer a number instead of `null`; the enclosing `round(..., 2)` is what gives that number the contracted `0.00`
- `GROUP BY` rule — selected expressions normally need to be grouped or aggregated; PostgreSQL also permits columns it can prove functionally dependent on a grouped primary key, but explicit grouping is clearer in portable junior SQL ✅ 07-timetrack
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `GROUP BY` on an identifying column, not just a display name — grouping by a name alone silently merges two distinct rows that happen to share that name; group by the id (and select the name alongside it) so an aggregate stays correct even when values collide ✅ 07-timetrack
- `GROUP BY` and `NULL` — grouping collects every `NULL` into one single group rather than discarding those rows, which is the opposite of what `WHERE` does with an unknown predicate; a report can therefore grow an unlabelled category that is easy to misread as a bug
- `GROUP BY` vs `SELECT DISTINCT` — both collapse repeated values, so they agree whenever nothing is aggregated; reach for `GROUP BY` when the query needs a per-group calculation, and treat `DISTINCT` as deduplication of an already-correct result
- `HAVING` — filter grouped results after aggregation while `WHERE` filters input rows before grouping
- Conditional aggregation with `CASE WHEN` — make only rows satisfying a condition contribute to an aggregate without discarding other groups ✅ 07-timetrack — the summary query sums approved and submitted hours side by side with `SUM(CASE WHEN te.status = ... THEN te.hours END)`, so one pass answers both
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior ✅ 07-timetrack — the same query counts approved entries with `COUNT(CASE WHEN ... THEN 1 END)`, relying on the missing `ELSE` producing nulls that `COUNT` skips
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions
- `STRING_AGG(column, separator)` — concatenates values from several rows into one PostgreSQL result per group; the order is arbitrary unless an `ORDER BY` is written inside the aggregate call itself

---

## Querying basics

- `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- `CASE WHEN` in `SELECT` — derive one output value per row from ordered conditions
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase

---

## Ordering and pagination

- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- No guaranteed row order without `ORDER BY` — a result set is an unordered set, so `GROUP BY`, an index scan, or insertion order can make rows look sorted while the engine stays free to return them differently on the next run; an order a caller depends on has to be stated, never inherited from how the rows happened to be produced ✅ 07-timetrack
- Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC` ✅ 07-timetrack
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages ✅ 07-timetrack
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- `FETCH FIRST n ROWS ONLY` — the SQL-standard row-limiting clause, written as `OFFSET n ROWS FETCH NEXT m ROWS ONLY`; PostgreSQL accepts both it and `LIMIT`, but Oracle and other engines a consultancy account may run accept only the standard form

---

## Set operations

- `UNION` vs `UNION ALL` — remove duplicates across compatible result sets or retain every row and avoid unnecessary duplicate elimination
- `UNION` column rules — align column counts and compatible types across branches while taking result column names from the first query
- `UNION` vs `JOIN` — a union stacks rows from two result sets that share a shape, while a join widens each row with columns from a related table; "combine two tables" is ambiguous and picking the wrong one produces a result of the wrong shape, not merely the wrong size
- `INTERSECT` and `EXCEPT` — `INTERSECT` keeps rows present in both results and `EXCEPT` keeps rows from the first result that are absent from the second; both remove duplicates unless `ALL` is requested

---

## Filtering and NULL handling

- `WHERE` keeps only `TRUE` — a predicate evaluates to true, false, or unknown, and only true-rows survive; unknown is discarded exactly like false, which is why a condition and its own negation can both drop the same `NULL` row and the two result sets fail to add up to the table
- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` — test absence with `IS NULL` or `IS NOT NULL` because ordinary equality with `NULL` evaluates to unknown
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; use it when the query contract deliberately substitutes a default such as `0` or `'Unknown'`, without confusing missing data with a real value
- `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `NOT IN` with `NULL` — if the subquery or list contains `NULL`, comparisons can become `UNKNOWN` and `NOT IN` may return no rows; use `NOT EXISTS` with a correlated equality when nullability is possible
- `BETWEEN` with timestamps — both endpoints are inclusive, so a date-only upper bound silently excludes later times on that date; use a half-open range such as `created_at >= start AND created_at < next_day` to preserve index use and include the whole period

---

## Subqueries, CTEs, and views

- Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` — must return at most one row and one column; an uncorrelated scalar subquery can be evaluated once, while a correlated one may require work for each outer row
- `IN` vs `EXISTS` — choose from result semantics and null behaviour rather than a universal speed rule: `IN` compares with a set of values, while correlated `EXISTS` asks whether at least one matching row exists; PostgreSQL may optimise either into a similar plan
- Correlated subquery — references a column from the outer row and expresses a per-row relationship; compare it with `EXISTS`, a join, or pre-aggregation when the repeated relationship is hard to read or slow
- Subquery vs `JOIN` — choose the form that expresses the required result cardinality clearly; a join can multiply rows while `EXISTS` only tests presence, and PostgreSQL can often optimise equivalent formulations similarly
- `WITH` (CTE) — name an intermediate query for reuse and readability without assuming it is inherently faster than an inline subquery
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application

---

## Schema operations

- `CREATE TABLE` — defines columns, data types, defaults, and constraints together; read the full definition before loading data because the database, not the application, enforces it
- `ALTER TABLE` — evolves an existing table by adding, changing, or dropping columns and constraints; versioned migration tooling belongs to the application stack, while SQL owns the resulting schema change ✅ 07-timetrack
- Adding a constraint to a populated table — a constraint is validated against the rows already stored, so `SET NOT NULL` on a column holding empty values fails until those rows are corrected, making the change two statements in a fixed order rather than one ✅ 07-timetrack — the not-null contract on `users.created_at` reached the live schema only after the rows predating the column were backfilled
- `DROP` vs deleting rows — `DROP` removes the database object itself, whereas `DELETE` and `TRUNCATE` keep the table and remove data
- `DEFAULT` — supplies a value only when an insert omits the column; it does not replace an explicitly inserted `NULL`, and it does not backfill old rows unless the schema change does so ✅ 07-timetrack

---

## Working with an existing database

- Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access ✅ 07-timetrack — the app connects as the non-superuser role `timetrack_app`, which owns only the `timetrack` database; `postgres` is never used at runtime
- Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects

---

## DML — modifying data

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty ✅ 07-timetrack
- Multi-row `INSERT` — supply several value tuples in one statement so the rows are inserted in a single round trip and a single implicit transaction
- `INSERT ... SELECT` — populate a table from the result of a query, matching target columns to result columns by position and compatible type
- `RETURNING` — obtain generated or changed values from a PostgreSQL data-modification statement without a second query
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE` and processes matching rows; `TRUNCATE`
  removes all rows with a stronger table lock and resets sequences only when `RESTART IDENTITY` is
  requested; choose deliberately rather than treating either as universally safe
- `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

---

## Transactions

- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- Autocommit and explicit transaction boundaries — outside an explicit transaction, clients commonly commit each successful statement separately, so `BEGIN` or the framework transaction boundary is required when several statements must succeed or fail together
- ACID properties — Atomicity is all-or-nothing, Consistency preserves declared invariants from one
  valid state to another, Isolation controls interference between concurrent transactions, and
  Durability preserves committed work
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint without ending the transaction
- Transaction failure state — after a PostgreSQL statement errors inside a transaction, later statements are rejected until `ROLLBACK` or `ROLLBACK TO SAVEPOINT` clears the failed state
- Transaction isolation — controls which concurrent changes a transaction can observe; recognise PostgreSQL `READ COMMITTED` as the default and choose stronger guarantees only for a concrete consistency need

---

## Window functions

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assign a deterministic sequence within each partition, such as selecting one latest row per group in an outer query
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- `DISTINCT ON` vs `ROW_NUMBER() = 1` — both answer "one latest row per group"; `DISTINCT ON` is shorter but PostgreSQL-only and ties its result to `ORDER BY`, while the window form is portable and can keep the rank as a column or take more than one row per group

---

## Schema design

- Primary key — one optional table constraint, possibly composite, that uniquely identifies rows;
  application tables normally define one even though SQL does not require every table to have it ✅ 07-timetrack
- Primary key vs `UNIQUE` constraint — both reject duplicates and both can be composite, but a table has at most one primary key, its columns are implicitly `NOT NULL`, and it is what foreign keys reference by default; a `UNIQUE` column can stay nullable and a table may carry several
- Foreign key — one or more columns referencing a primary or other unique candidate key;
  PostgreSQL rejects values with no referenced row, enforcing referential integrity ✅ 07-timetrack
- `ON DELETE` behavior — PostgreSQL defaults to `NO ACTION`; `RESTRICT` also rejects referenced-row deletion but cannot be deferred, `CASCADE` deletes dependent rows, and `SET NULL` clears a nullable foreign key ✅ 07-timetrack
- `ON UPDATE` behavior — the same referential actions apply when the referenced key value itself changes; it is nearly invisible with surrogate keys that never change, which is exactly why an inherited `ON UPDATE CASCADE` on a natural key is easy to misread
- `NOT NULL` constraint — reject missing values for fields whose domain contract requires a value ✅ 07-timetrack
- `UNIQUE` constraint — rejects duplicate non-`NULL` keys and creates a supporting unique B-tree index; PostgreSQL permits multiple `NULL` values by default unless `NULLS NOT DISTINCT` is requested ✅ 07-timetrack
- Composite uniqueness — a `UNIQUE` constraint across several columns enforces a business rule on the combination, such as one membership per `(user_id, project_id)`
- Constraint vs application-side uniqueness check — a `SELECT` that finds no duplicate followed by an `INSERT` is two statements, so a concurrent session can pass the same check and both rows land; only the constraint decides atomically, which makes the application check a friendlier error message rather than the guarantee, and makes `ON CONFLICT` one concrete way of handling the constraint's verdict ✅ 07-timetrack — `ProjectService.create` keeps `existsByNameIgnoreCase` for the message and translates the constraint's own rejection into the same 409
- `CHECK` constraint and `NULL` — a check rejects `FALSE` but accepts `TRUE` or `UNKNOWN`, so `CHECK (hours > 0)` still needs `NOT NULL` when hours are required
- One-to-many relationships — place the foreign key on the many side so each child references one parent while a parent can own several children ✅ 07-timetrack
- Many-to-many relationships — use a junction table with two foreign keys and usually a composite uniqueness rule so each pair appears only once
- Natural vs surrogate keys — a surrogate key gives the row a stable technical identity, while a natural business key still needs a `UNIQUE` constraint when the domain says it cannot repeat ✅ 07-timetrack
- Normalization and data anomalies — store each fact in the relation determined by its key so inserts, updates, and deletes do not require inconsistent copies; formal normal-form analysis belongs to middle
- Reading a relational schema — identify each table's grain, primary key, foreign keys, nullability, and relationship cardinality before constructing a query

---

## Data types

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- `CHAR(n)` blank padding — a fixed-length column stores every shorter value padded with trailing spaces, then ignores those spaces when comparing and when reporting `length()`; expect it in inherited Oracle and legacy schemas rather than choosing it for new columns
- Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- `NUMERIC(p,s)` vs `FLOAT` — choose exact fixed-precision decimals for money and approximated floating-point values for measurements that tolerate representation error ✅ 07-timetrack
- Integer division and explicit casts — integer divided by integer truncates the fractional part in PostgreSQL; cast an operand to `NUMERIC` when the result must retain decimals
- `ROUND(value, n)` — rounds to a given number of decimal places, but only for `NUMERIC`; PostgreSQL has no two-argument `ROUND` for `double precision`, so a computed average usually needs an explicit cast before a report can round it ✅ 07-timetrack — the three report queries in `TimeEntryRepository` round their aggregate with `round(SUM(te.hours), 2)`, which is what fixes the scale every report endpoint serves
- Scale of an expression's result — `NUMERIC` scale propagates outwards through an expression, and a literal fallback carries its own, so `COALESCE(SUM(x), 0)` answers with the summed column's scale when rows exist and with scale 0 when none do; a rounding rule must therefore wrap the whole expression rather than one of its operands ✅ 07-timetrack — the summary query writes `round(COALESCE(SUM(...), 0), 2)`, so a month with no entries answers `0.00` instead of the scale-0 `0` the fallback alone would give
- `DATE` vs `TIMESTAMP` / `TIMESTAMPTZ` — use `DATE` for a calendar value with no time of day, `TIMESTAMP` for a local wall-clock value, and `TIMESTAMPTZ` for an instant shared across time zones ✅ 07-timetrack
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does
  not generally treat an unquoted integer `1` as a boolean
- `JSONB` recognition — stores validated JSON in a binary representation that supports PostgreSQL operators and indexes; keep relational columns for stable fields that need ordinary constraints and joins

---

## PostgreSQL specifics

- Standard SQL vs vendor extensions — prefer portable constructs for transferable query logic and use PostgreSQL-specific syntax deliberately when its benefit justifies the coupling
- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `EXTRACT` — returns one date/time field such as year, month, or hour for filtering or reporting; use it deliberately because applying a function to an indexed column can prevent a simple index condition
- `NOW()` vs `CURRENT_DATE` — both are fixed at the start of the current transaction rather than re-read per statement, so neither advances inside a long transaction; the difference is the returned type, a full timestamp against a date with no time component
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years

---

## Common string functions

- `||` string concatenation — combine text expressions into one output value while accounting for `NULL` propagation
- `LOWER` and `UPPER` — normalise case for display or comparison while recognising that applying them to a column can affect ordinary index use
- `TRIM` — removes leading and trailing characters, whitespace by default, without changing whitespace inside the value
- `LENGTH` — counts characters in text rather than bytes, which matters for non-ASCII data
- `SUBSTRING` — extract a positional part of a string for query shaping rather than to repair badly modelled data
- `REPLACE` — substitute every occurrence of matching text within a value, without regard to word boundaries

---

## Performance basics

- What an index is — an auxiliary access structure that can speed reads at the cost of storage and write maintenance; B-tree is PostgreSQL's common ordered index, while other index methods serve different operators
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- Foreign-key indexes — PostgreSQL indexes the referenced primary or unique key but not the referencing foreign-key columns automatically; add an index when joins or parent deletes need to find dependent rows efficiently
- When NOT to index — avoid indexes without a measured access pattern, especially on small tables or frequently updated columns; low cardinality alone is not decisive because a partial or composite index can still be selective
- `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- Sargable predicates — compare an indexed column directly to a compatible value or range when possible; wrapping the column in a function or starting a pattern with `%` can prevent a normal B-tree index from narrowing the scan

---

## Query workflow and SQL review

- Bound parameters — keep SQL structure separate from runtime values through prepared-statement or framework placeholders, preserving correct typing and reusable statement structure ✅ 07-timetrack
- Query construction from a business question — decide the result grain first, then identify tables, join paths, filters, grouping, and ordering before writing syntax
- Incremental query debugging — inspect a small sample after each join, filter, and aggregation, and predict the expected row count so errors are found where they enter
- Report-total verification — compare complex report totals with simpler control queries at the intended grain before trusting the result
- Join-review failures — detect accidental Cartesian products, incorrect cardinality, and `DISTINCT` used to hide row multiplication
- Predicate-review failures — detect `NULL` comparisons, unsafe value interpolation, and date ranges that omit boundary rows
- Mutation-review failures — detect unbounded `UPDATE` or `DELETE` statements and verify the intended affected-row set before execution
- Pagination-review failures — require deterministic ordering and recognise when large `OFFSET` values make a different pagination strategy necessary
