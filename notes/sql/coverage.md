# Minimum Coverage — SQL

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Database is PostgreSQL. Every item must be explainable with a real query — from the bookstore exercises or the TimeTrack data model.

---

## JOINs

- `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- `RIGHT JOIN` — mirror of `LEFT JOIN`; rarely used because any `RIGHT JOIN` can be rewritten as a `LEFT JOIN` by swapping the tables; tested to check you understand the symmetry
- `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- Multiple JOINs — you can chain as many JOINs as needed; interviewers ask you to write a query joining three tables, for example `time_entries → users → projects`
- Self JOIN — a table joined to itself using two aliases, used to compare rows within the same table (e.g. "which employees share the same manager?" or "find duplicate emails"); interviewers ask how you join a table to itself when there is only one `FROM` clause to work with
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

---

## Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` — `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `SUM`, `AVG`, `MIN`, `MAX` — all ignore `NULL` values automatically; `AVG(price)` on `[10, NULL, 30]` returns `20`, not `13.33`; a common source of unexpected results in junior code
- `GROUP BY` rule — every column in `SELECT` must either appear in `GROUP BY` or be inside an aggregate function; breaking this rule causes a PostgreSQL error; the most common GROUP BY mistake in junior code
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` — filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- Conditional aggregation with `CASE WHEN` — `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows; used for reporting by status in TimeTrack; interviewers ask "how would you count only approved entries per project?"
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions

---

## Querying basics

- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- `SELECT *` vs named columns — always specify columns in application code; `SELECT *` fetches data you do not need, sends more over the network, and breaks when the schema changes
- `CASE WHEN` in `SELECT` — `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row; interviewers ask you to add a status label to a result set
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- `||` string concatenation — joins two text values into one column, e.g. `first_name || ' ' || last_name AS full_name`; interviewers ask how you build a display name from separate columns without a function call
- `UNION` vs `UNION ALL` — `UNION` combines the results of two queries and removes duplicate rows; `UNION ALL` keeps every row including duplicates and is faster because it skips the duplicate check; interviewers ask which one to use when you know the two result sets cannot overlap (`UNION ALL` — no reason to pay for a duplicate scan)
- `UNION` column rules — both queries must return the same number of columns with compatible types; column names in the result come from the first query; interviewers ask what happens if the column types do not match (PostgreSQL raises an error or silently casts, depending on the mismatch)

---

## Filtering and NULL handling

- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` — `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`; interviewers ask why `= NULL` does not work
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; used to replace `NULL` with a default (`0`, `''`, `'Unknown'`) so the application never has to handle `NULL` from the query result
- `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `BETWEEN` with timestamps — `BETWEEN '2024-01-01' AND '2024-06-30'` silently excludes events after midnight on June 30; safer to cast before comparing: `created_at::date BETWEEN '2024-01-01' AND '2024-06-30'`

---

## Subqueries, CTEs, and views

- Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` — returns exactly one value used as a column in the result; runs once per row and can be slow on large tables; interviewers ask when this would cause a performance problem
- `IN` vs `EXISTS` — `IN` collects all results from the subquery first; `EXISTS` stops as soon as it finds one match and is faster on large tables; interviewers ask when you would prefer one over the other
- Subquery vs `JOIN` — most `WHERE` subqueries can be rewritten as a `JOIN`, which the database can optimize better; prefer a `JOIN` when readable; use a subquery when you need an aggregate in a filter
- `WITH` (CTE) — names a subquery so it can be referenced by name in the same query; makes multi-step queries readable; interviewers ask "when would you use a CTE instead of a subquery?"
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application
- View vs materialized view — a regular view runs the query live every time; a materialized view stores the result on disk and must be refreshed manually with `REFRESH MATERIALIZED VIEW`; regular views are for convenience, materialized views are for performance

---

## DML — modifying data

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- `RETURNING` — `INSERT INTO users (...) VALUES (...) RETURNING id` — returns the generated ID without a second `SELECT`; PostgreSQL-specific; interviewers ask "how do you get the new ID after an INSERT?"
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE`, logs every row, and can be rolled back; `TRUNCATE` removes all rows instantly, does not support `WHERE`, and resets `SERIAL` counters; never use `TRUNCATE` in application code
- `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

---

## Transactions

- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- ACID properties — Atomicity (all or nothing), Consistency (constraints never violated mid-transaction), Isolation (concurrent transactions do not see each other's uncommitted changes), Durability (committed data survives a crash); interviewers ask what ACID stands for when discussing `@Transactional`
- `@Transactional` connection — Spring Boot wraps the method in `BEGIN` / `COMMIT` and automatically issues `ROLLBACK` on an unchecked exception; interviewers ask "what happens if the second save fails inside a `@Transactional` method?"
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint; used internally by Hibernate; good to know it exists without needing to write it yourself

---

## Window functions

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a unique sequential number to each row within a partition; used to get "the latest time entry per user" by filtering `WHERE row_num = 1` in an outer query; a very common interview pattern
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; used to compare consecutive time entries
- `SUM() OVER (PARTITION BY ...)` — running total within a group without collapsing rows; unlike `GROUP BY`, it keeps every row and adds a cumulative column alongside the existing data

---

## Schema design

- Primary key — uniquely identifies each row; `SERIAL` or `BIGSERIAL` in PostgreSQL; every table needs exactly one; interviewers ask "what is the primary key of your `time_entries` table?"
- Foreign key — a column that references the primary key of another table; PostgreSQL rejects an `INSERT` if the referenced row does not exist; this guarantee is called referential integrity
- `ON DELETE` behavior — `RESTRICT` (default) rejects the delete if dependent rows exist; `CASCADE` deletes dependent rows automatically; `SET NULL` sets the foreign key to `NULL`; interviewers ask "what happens if you delete a user who has time entries?"
- `NOT NULL` constraint — the column must always have a value; used on required fields like `email`, `password`, `status`; interviewers ask why you chose to add it
- `UNIQUE` constraint — no two rows can have the same value in that column; used on `email` to prevent duplicate accounts; automatically creates an index in PostgreSQL
- `CHECK` constraint — validates a condition on insert or update; `CHECK (hours > 0 AND hours <= 24)` rejects invalid data at the database level, not just the application level
- Relationship types — one-to-many (1:N) is the most common; the foreign key always goes on the "many" side; many-to-many (N:M) needs a junction table (e.g. `order_items` linking `orders` and `books`)
- Normalization concept — storing `project_id` instead of copying `project_name` avoids duplication; changing the project name requires only one `UPDATE` in one place; interviewers ask "what problem does normalization solve?"
- Reading a schema out loud — describing the TimeTrack data model: "three tables; `users` and `projects` are independent; `time_entries` links to both via foreign keys"; interviewers ask "explain your database structure"

---

## Data types

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- `INT` vs `SERIAL` vs `BIGSERIAL` — `INT` is a plain integer; `SERIAL` is an auto-incrementing integer used for primary keys; `BIGSERIAL` handles very large tables; interviewers from MySQL ask "what is the equivalent of `AUTO_INCREMENT`?"
- `NUMERIC(p,s)` vs `FLOAT` — `FLOAT` is an approximation that compounds rounding errors over time; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices and financial values; interviewers ask "why would you not use `FLOAT` for money?"
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores `true` or `false`; PostgreSQL accepts `true`, `'t'`, `'yes'`, `1` as input — always write `true` / `false` for readability; used for flags like `is_active`

---

## PostgreSQL specifics

- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `ILIKE` — case-insensitive pattern matching; not available in MySQL or SQL Server; interviewers switching from MySQL ask why `LIKE` is not finding results they expect
- `DISTINCT ON` — keeps one row per group while returning multiple columns; not available in standard SQL; the column in `DISTINCT ON (...)` must be leftmost in `ORDER BY`
- `RETURNING` — `INSERT`, `UPDATE`, and `DELETE` can return the affected rows in a single statement; avoids a second `SELECT`; not standard SQL
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `NOW()` vs `CURRENT_DATE` — `NOW()` returns the current timestamp including time; `CURRENT_DATE` returns today's date with no time; used in date range filters and default column values
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- `STRING_AGG(column, separator)` — concatenates values from multiple rows into one string per group, e.g. `STRING_AGG(name, ', ')` to list all project names for a user on one line; PostgreSQL-specific; interviewers ask how you would turn grouped rows into a single comma-separated column for a report

---

## Performance basics

- What an index is — a sorted data structure that speeds up reads on a column at the cost of slower writes; primary keys and `UNIQUE` columns are indexed automatically; foreign key columns used in JOINs benefit most from a manual index
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- When NOT to index — small tables, columns with very few distinct values (a `status` column with three options gains little), and columns that are updated very frequently
- `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
