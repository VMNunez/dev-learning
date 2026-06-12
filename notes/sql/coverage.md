# Minimum Coverage — SQL

PostgreSQL. Every item must be explainable with a real query written in the sql/ exercises.
Focus on what appears in consultancy technical tests.

## Basics
- `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` — the foundation; every SQL technical test starts here
- Comparison operators: `=`, `!=`, `>`, `<`, `BETWEEN`, `IN`, `LIKE`, `ILIKE` — `ILIKE` is PostgreSQL-specific and case-insensitive; interviewers ask the difference
- `NULL` handling: `IS NULL`, `IS NOT NULL`, `COALESCE`, `NULLIF` — `NULL` comparisons with `=` always return false; interviewers ask why `WHERE x = NULL` never works
- Aliases: `AS` for columns and tables — required when the column name is a calculation or when two joined tables share the same column name

## JOINs
- `INNER JOIN` — only rows where both sides have a match; the most common JOIN
- `LEFT JOIN` — all rows from the left table, NULL on the right when no match; used to find records with no related data
- `RIGHT JOIN` — all rows from the right table; less common, LEFT JOIN is usually preferred
- `FULL OUTER JOIN` — all rows from both sides with NULLs where there is no match
- Finding missing data with LEFT JOIN — `WHERE right_table.id IS NULL` after a LEFT JOIN finds all left rows with no match on the right

## Aggregates and grouping
- Aggregate functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` — what each computes and what happens with NULL values
- `GROUP BY` — groups rows before aggregating; every column in SELECT must either be in GROUP BY or inside an aggregate function
- `HAVING` — filters after aggregation; `WHERE` filters rows before grouping; interviewers always ask the difference
- Conditional aggregation: `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` — aggregating only a subset of rows; used in the TimeTrack reports

## Conditional logic
- `CASE WHEN condition THEN value ELSE value END` — conditional column values in a SELECT; used for status labels and category buckets
- `COALESCE(value, fallback)` — returns the first non-NULL value; used to replace NULL with a default in results

## Subqueries and CTEs
- Subquery in `WHERE`: `WHERE id IN (SELECT ...)` — filtering rows based on the result of another query
- Subquery in `FROM` — using a query as a table; give the inner query an alias so you can filter or join against it
- `WITH` (CTE) — naming a subquery so it can be referenced by name and read clearly; interviewers ask "when would you use a CTE instead of a subquery?"
- When a CTE is better than a nested subquery — when the same result is used more than once, or when readability matters in a complex query

## Window functions
- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a unique number to each row within a partition; used to get "the latest entry per user"
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next; `ROW_NUMBER()` always gives a unique number regardless of ties
- `LAG()` and `LEAD()` — comparing a row to the previous or next row without a self-join
- `SUM() OVER (PARTITION BY ...)` — running totals within a group without collapsing rows

## PostgreSQL specifics
- `SERIAL` and `BIGSERIAL` — auto-increment in PostgreSQL; equivalent to `AUTO_INCREMENT` in MySQL; interviewers who used MySQL will ask the difference
- `RETURNING` clause — get the inserted or updated row back in a single query; avoids a second SELECT after INSERT
- `DATE_TRUNC('month', date)` — truncate a date to the start of the month; used to GROUP BY month in reports
- `NOW()` and `CURRENT_DATE` — current timestamp vs current date without time; used in date range filters

## Performance basics
- What an index is — a sorted data structure that speeds up reads on a column at the cost of slower writes; created automatically on primary keys and unique columns
- `EXPLAIN` — shows the query plan and whether an index is being used; used to diagnose slow queries
- When NOT to use `SELECT *` — fetches all columns including large ones you do not need; breaks when column names change; always specify the columns you need

## Schema design
- Primary key — uniquely identifies each row; usually `BIGSERIAL` in PostgreSQL; every table needs exactly one; interviewers ask "what is the primary key of your `time_entries` table?"
- Foreign key — a column that references the primary key of another table; enforces referential integrity; PostgreSQL rejects an INSERT if the referenced row does not exist
- `NOT NULL` constraint — the column must always have a value; used on required fields like `email`, `password`, and `status`
- `UNIQUE` constraint — no two rows can have the same value in that column; used on `email` to prevent duplicate accounts
- `CHECK` constraint — validates a condition on insert or update; `CHECK (hours > 0 AND hours <= 24)` on the `hours` column
- Normalization concept — why you store `project_id` in `time_entries` instead of copying `project_name`; avoids duplication and keeps data consistent; changing the project name requires only one UPDATE in one place
- Reading a schema — being able to describe the TimeTrack data model out loud: "there are three tables; `users` and `projects` are independent; `time_entries` links to both via foreign keys"; interviewers ask "explain your database structure"
