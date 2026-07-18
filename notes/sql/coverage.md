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

## JOIN pitfalls and row multiplication

- Condition in `ON` vs in `WHERE` for an outer join — a condition in `ON` is applied while matching rows, a condition in `WHERE` after the join is built; for an `INNER JOIN` the two are equivalent, for a `LEFT JOIN` they are not; interviewers ask exactly this before showing you a broken query
- `WHERE` on the right table silently turning a `LEFT JOIN` into an `INNER JOIN` — a filter like `WHERE p.status = 'active'` discards the `NULL`-filled rows the `LEFT JOIN` just produced; the fix is moving the condition into the `ON` clause; the most-reviewed silent JOIN bug at junior level
- Row multiplication on a one-to-many join — the parent row repeats once per matching child, so the result has more rows than the parent table; interviewers give you two small tables and ask exactly how many rows come out
- Fan-out inflating `SUM` and `AVG` — aggregating a parent column across those duplicated rows double-counts it, so a report total comes back an exact multiple of the real number; interviewers hand you a query that "adds up wrong" and ask why
- Pre-aggregation in a CTE vs `COUNT(DISTINCT ...)` — grouping in a subquery removes the duplicated rows a fan-out created, while `COUNT(DISTINCT ...)` only hides them; interviewers ask which of the two you would ship
- Accidental cross join — a missing or wrong `ON` condition produces the Cartesian product `n × m`; small tables hide it, large ones make it explode; interviewers show a join without a predicate and ask for the row count
- Joining on mismatched types — joining `varchar` to `int` forces a cast that prevents index use and often errors outright in PostgreSQL; a schema-level smell a reviewer looks for
- `NULL` in a join key — a `NULL` never matches anything in any join type, so those rows vanish from an `INNER JOIN` and keep `NULL`s on the right in a `LEFT JOIN`; interviewers ask why a row "disappeared" after adding a join
- `COUNT(*)` after a `LEFT JOIN` returning 1 instead of 0 — the unmatched row exists as all-`NULL` and `COUNT(*)` still counts it; `COUNT(child.id)` returns the real `0`; the practical payoff of the `COUNT(*)` vs `COUNT(column)` distinction

---

## Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` — `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `COUNT(DISTINCT column)` — counts unique non-`NULL` values; the usual correction when a join has duplicated rows and a plain `COUNT` overstates; notably more expensive than `COUNT(*)`
- `SUM`, `AVG`, `MIN`, `MAX` — all ignore `NULL` values automatically; `AVG(price)` on `[10, NULL, 30]` returns `20`, not `13.33`; a common source of unexpected results in junior code
- `SUM` over zero rows returns `NULL`, not `0` — `COUNT` returns `0` but `SUM`, `AVG` and `MAX` return `NULL` when nothing matches, which is why a dashboard total renders blank for a project with no entries; the fix is `COALESCE(SUM(...), 0)`
- An aggregate without `GROUP BY` always returns exactly one row — even against an empty table — while the same query with `GROUP BY` returns zero rows; the row-count prediction that separates memorised syntax from understanding grouping
- `GROUP BY` rule — every column in `SELECT` must either appear in `GROUP BY` or be inside an aggregate function; breaking this rule causes a PostgreSQL error; the most common GROUP BY mistake in junior code
- Adding a column to `GROUP BY` to silence the error changes the grouping — the query now splits into finer groups and every number in the report changes; interviewers ask what happens when you "just add the column to make the error go away"
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` — filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- `HAVING` without `GROUP BY` — legal, and treats the entire result as a single group; interviewers use it to check whether you understand grouping as a phase of the pipeline rather than as a keyword
- Conditional aggregation with `CASE WHEN` — `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows; used for reporting by status in TimeTrack; interviewers ask "how would you count only approved entries per project?"
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions

---

## Querying basics

- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- Where a `SELECT` alias is visible — usable in `GROUP BY` and `ORDER BY` because those run after `SELECT`, rejected in `WHERE` and `HAVING` because those run before it; interviewers ask why the same alias works in one clause and errors in another
- `SELECT *` vs named columns — always specify columns in application code; `SELECT *` fetches data you do not need, sends more over the network, and breaks when the schema changes
- `CASE WHEN` in `SELECT` — `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row; interviewers ask you to add a status label to a result set
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT` applies to the whole row, not the first column — adding a column to the `SELECT` list can make the result *larger*; the usual surprise when someone adds `id` to a "distinct names" query
- `DISTINCT` vs `GROUP BY` — both return the same rows when `GROUP BY` selects only its grouping columns, so they are interchangeable there; neither is a fix for a broken join, only a mask over duplicated rows; interviewers ask whether they are equivalent
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- `||` string concatenation — joins two text values into one column, e.g. `first_name || ' ' || last_name AS full_name`; interviewers ask how you build a display name from separate columns without a function call
- `UNION` vs `UNION ALL` — `UNION` combines the results of two queries and removes duplicate rows; `UNION ALL` keeps every row including duplicates and is faster because it skips the duplicate check; interviewers ask which one to use when you know the two result sets cannot overlap (`UNION ALL` — no reason to pay for a duplicate scan)
- `UNION` column rules — both queries must return the same number of columns with compatible types; column names in the result come from the first query; interviewers ask what happens if the column types do not match (PostgreSQL raises an error or silently casts, depending on the mismatch)

---

## Sorting, pagination, and determinism

- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- `ORDER BY` with ties is non-deterministic — rows sharing the same sort key can come back in any order and that order can change between runs; always add a unique tiebreaker column; interviewers ask why a paginated list shows the same record on two different pages
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- Deep `OFFSET` is not free — `OFFSET 100000` makes the database read and discard 100 000 rows on every request, so page 10 000 is far slower than page 1; interviewers ask how you paginate a table that grew to millions of rows
- Keyset (seek) pagination — `WHERE id > :last_seen ORDER BY id LIMIT 20` stays constant-cost regardless of depth because it seeks straight into the index; the standard answer to the deep-`OFFSET` problem
- Pagination drift under concurrent writes — inserts and deletes between two page requests shift rows across page boundaries, so `OFFSET` paging silently skips or repeats records; the correctness argument for keyset pagination, not just the performance one

---

## Filtering and pattern matching

- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `WHERE` conditions are not guaranteed to short-circuit — PostgreSQL may reorder an `AND` chain, so a guard like `x <> 0 AND 10 / x > 1` can still raise a division error; the safe forms are `CASE` or `NULLIF`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `LIKE` never matches `NULL` — even `column LIKE '%'` skips `NULL` rows, so a "match everything" search filter silently drops them; interviewers ask why a filter that should be a no-op changed the row count
- Negating a boolean column drops the `NULL`s — `WHERE NOT is_active` excludes rows where `is_active IS NULL`, so "inactive users" misses everyone the flag was never set for
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `BETWEEN` with timestamps — `BETWEEN '2024-01-01' AND '2024-06-30'` silently excludes events after midnight on June 30; safer to cast before comparing: `created_at::date BETWEEN '2024-01-01' AND '2024-06-30'`

---

## NULL and three-valued logic

- Three-valued logic — every comparison returns `TRUE`, `FALSE` or `UNKNOWN`, and `WHERE` keeps only the `TRUE` rows; `UNKNOWN` is discarded exactly like `FALSE` but behaves differently once you wrap it in `NOT`; the mechanism underneath every `NULL` surprise in SQL
- `NULL = NULL` returns `NULL`, not `true` — two unknowns cannot be proven equal; interviewers ask "are two NULLs equal in SQL?" as the entry point to the whole topic
- `IS NULL` vs `= NULL` — `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`; interviewers ask why `= NULL` does not work
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `NOT IN` with a `NULL` in the subquery — returns zero rows for every candidate, because comparing against the `NULL` makes the whole chain `UNKNOWN`; the most-reused SQL trick question in a Spanish quickfire screening
- `NOT EXISTS` vs `NOT IN` — `NOT EXISTS` is `NULL`-safe and returns the intuitive result while `NOT IN` silently returns nothing; interviewers ask which one you would write, after showing you the empty result
- `IS DISTINCT FROM` — the `NULL`-safe inequality operator, which treats `NULL` as a comparable value instead of yielding `UNKNOWN`; the correct tool when a nullable column must genuinely be compared
- `NULL` in a `UNIQUE` constraint — PostgreSQL considers every `NULL` distinct from every other, so a `UNIQUE` column accepts unlimited `NULL` rows; a uniqueness rule that must also cover missing values needs `NOT NULL` or a partial index
- `NULL` in `CHECK` vs in `WHERE` — a `CHECK` constraint passes when the condition evaluates to `UNKNOWN` while `WHERE` rejects it, so the same expression admits a row on insert and then hides it on select
- `NULL` under `GROUP BY` and `DISTINCT` — grouping and de-duplication treat two `NULL`s as the same value even though `=` never does; the inconsistency is deliberate and interviewers use it as a follow-up
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; used to replace `NULL` with a default (`0`, `''`, `'Unknown'`) so the application never has to handle `NULL` from the query result
- `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`

---

## Type behaviour at runtime

- Integer division truncates silently — `5 / 2` returns `2`, so `SUM(hours) / COUNT(*)` on integer columns drops the fraction with no error at all; cast one operand (`::numeric`) to get a decimal; a standard quickfire item and a wrong-number bug that produces no message
- Division by zero raises an error, it does not return `NULL` — the whole query aborts mid-report instead of degrading; `NULLIF(denominator, 0)` converts the failure into a `NULL` result you can then `COALESCE`
- PostgreSQL refuses implicit casts MySQL would perform — comparing an `integer` column to a text value fails with `operator does not exist`; the fix is an explicit `::` cast or correcting the column type; interviewers migrating candidates from MySQL ask why the same query stopped working
- Comparing a `TIMESTAMP` to a `DATE` — the date is coerced to midnight, so `created_at = '2026-07-18'` matches almost nothing; the mechanism behind the `BETWEEN` gotcha and the reason to compare with `::date` or a half-open range
- `NUMERIC` vs `FLOAT` equality — `0.1 + 0.2 = 0.3` is false in floating point and true in `NUMERIC`; the concrete demonstration of why money is never stored as `FLOAT`
- Collation decides sort order — `ORDER BY name` uses the database collation, so accented and uppercase Spanish names sort differently than a naive byte comparison and differently between locales; interviewers ask why the alphabetical list looks wrong
- Values are case-sensitive even though unquoted identifiers are not — `SELECT * FROM Users` resolves fine while `WHERE name = 'ana'` misses `'Ana'`; candidates routinely confuse the two rules
- `CHAR(n)` pads with trailing spaces — comparisons ignore the padding, so values that compare equal have different lengths; the reason to use `VARCHAR` or `TEXT` and never `CHAR`

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
- What belongs in a view — a repeated read-only projection, or a stable shape held steady over a changing schema; not a hiding place for business logic the service layer must own; interviewers ask what you would put in a view and what you would keep in Java
- Updatable views and their limits — a simple single-table view accepts an `UPDATE`, one built on JOINs or aggregates does not; the reason a view is a read-side tool
- View vs materialized view — a regular view runs the query live every time; a materialized view stores the result on disk and must be refreshed manually with `REFRESH MATERIALIZED VIEW`; regular views are for convenience, materialized views are for performance

---

## DML — modifying data

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- Multi-row `INSERT` — `INSERT INTO books (title, author_id) VALUES (...), (...), (...)` inserts many rows in one statement, one round trip and one transaction; interviewers ask why this beats a loop of single inserts, which is the write-side twin of the N+1 problem
- `COPY` vs `INSERT` for bulk loading — `COPY` streams a CSV straight into a table far faster than thousands of `INSERT`s; interviewers ask how you would load a 100 000-row CSV into PostgreSQL
- Insert order with foreign keys — parent rows must exist before the rows that reference them, or the `REFERENCES` check rejects the insert; the first thing that breaks in a hand-written seed file
- Resetting the sequence after inserting explicit ids — seeding rows with hardcoded `id` values leaves the `SERIAL` sequence behind, so the next application insert fails with a duplicate key error; fixed with `setval`; a nasty gotcha that separates people who have seeded a real database from those who have not
- `RETURNING` — `INSERT INTO users (...) VALUES (...) RETURNING id` — returns the generated ID without a second `SELECT`; PostgreSQL-specific; interviewers ask "how do you get the new ID after an INSERT?"
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- Wrapping a destructive statement in an explicit transaction — running the `UPDATE` or `DELETE` inside `BEGIN`, checking the reported row count, and only then `COMMIT`; interviewers ask how you would run a one-off data fix against production
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE`, logs every row, and can be rolled back; `TRUNCATE` removes all rows instantly, does not support `WHERE`, and resets `SERIAL` counters; never use `TRUNCATE` in application code
- `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

---

## Transactions

- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- ACID properties — Atomicity (all or nothing), Consistency (constraints never violated mid-transaction), Isolation (concurrent transactions do not see each other's uncommitted changes), Durability (committed data survives a crash); interviewers ask what ACID stands for when discussing `@Transactional`
- `@Transactional` connection — Spring Boot wraps the method in `BEGIN` / `COMMIT` and automatically issues `ROLLBACK` on an unchecked exception; interviewers ask "what happens if the second save fails inside a `@Transactional` method?"
- Read committed is PostgreSQL's default isolation level — every statement sees a fresh snapshot of committed data, so two identical reads inside one transaction can return different rows; interviewers ask what a concurrent transaction can and cannot see from inside yours
- The aborted-transaction state — after any error inside a transaction every following statement fails with `current transaction is aborted, commands ignored until end of transaction block`; you must `ROLLBACK` before the session is usable again; interviewers ask why the next, perfectly valid query also failed
- Lost update from read-modify-write — two transactions read the same value, both write it back, and one update vanishes with no error; the concrete problem row locking and optimistic locking exist to solve
- `SELECT ... FOR UPDATE` — locks the selected rows so a concurrent transaction cannot modify them until you commit; the raw-SQL fix for a read-then-write race; interviewers ask how you stop two requests both booking the last free slot
- Row-level locks from `UPDATE` — an `UPDATE` holds a lock on every row it touches until the transaction ends, which is why one uncommitted transaction can block every other writer
- An open, uncommitted transaction is worse than a slow query — the session sits `idle in transaction` holding its locks indefinitely, so writers queue behind it while the CPU stays idle; the classic cause of a database that "hangs" rather than fails
- `deadlock detected` — two transactions each hold a lock the other needs, so PostgreSQL kills one of them; caused by updating the same rows in a different order, and prevented by touching rows in a consistent order and keeping transactions short
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint; used internally by Hibernate; good to know it exists without needing to write it yourself

---

## Window functions

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a unique sequential number to each row within a partition; used to get "the latest time entry per user" by filtering `WHERE row_num = 1` in an outer query; a very common interview pattern
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; used to compare consecutive time entries
- `SUM() OVER (PARTITION BY ...)` — running total within a group without collapsing rows; unlike `GROUP BY`, it keeps every row and adds a cumulative column alongside the existing data

---

## Schema design — constraints and integrity

- Primary key — uniquely identifies each row; `SERIAL` or `BIGSERIAL` in PostgreSQL; every table needs exactly one; interviewers ask "what is the primary key of your `time_entries` table?"
- Foreign key — a column that references the primary key of another table; PostgreSQL rejects an `INSERT` if the referenced row does not exist; this guarantee is called referential integrity
- Which side of a 1:N carries the foreign key — it lives on the "many" table whichever entity feels primary in the domain, because one `users` row cannot hold many `time_entry` ids in a single column; interviewers ask where the FK goes and why it cannot go on `users`
- Composite primary key on a junction table — `PRIMARY KEY (order_id, book_id)` enforces "no duplicate pair" for free, while a surrogate `id` does not unless you add a `UNIQUE`; interviewers ask which you would choose for `order_items` and why
- `ON DELETE` behavior — `RESTRICT` (default) rejects the delete if dependent rows exist; `CASCADE` deletes dependent rows automatically; `SET NULL` sets the foreign key to `NULL`; interviewers ask "what happens if you delete a user who has time entries?"
- `NOT NULL` constraint — the column must always have a value; used on required fields like `email`, `password`, `status`; interviewers ask why you chose to add it
- `UNIQUE` constraint — no two rows can have the same value in that column; used on `email` to prevent duplicate accounts; automatically creates an index in PostgreSQL
- Multi-column and partial `UNIQUE` — `UNIQUE (user_id, work_date)` enforces uniqueness over a pair, and a partial unique index (`WHERE deleted_at IS NULL`) over a subset of rows; the answer to "how do you stop one user logging two entries for the same day?"
- `CHECK` constraint — validates a condition on insert or update; `CHECK (hours > 0 AND hours <= 24)` rejects invalid data at the database level, not just the application level
- Constraint in the database vs validation in the application — application checks are advisory and bypassed by migrations, scripts and any other client; the database constraint is the only enforced guarantee; interviewers ask whether Bean Validation makes the `CHECK` unnecessary, and the answer is that you duplicate it on purpose
- A constraint violation is a race the application check cannot win — a duplicate can pass a prior `SELECT` and still fail at insert time because another request committed in between; the reason the `UNIQUE` constraint is required even with a service-layer duplicate check

---

## Schema design — modelling decisions

- Relationship types — one-to-many (1:N) is the most common; the foreign key always goes on the "many" side; many-to-many (N:M) needs a junction table (e.g. `order_items` linking `orders` and `books`)
- Natural key vs surrogate key — using `email` or a business code as the primary key versus a generated `id`; business values change, and a changed primary key cascades into every referencing row; interviewers ask why juniors default to surrogate keys and expect that reason
- `SERIAL` vs `GENERATED ALWAYS AS IDENTITY` — `SERIAL` is legacy PostgreSQL shorthand that creates a hidden sequence, `IDENTITY` is the SQL-standard form now recommended for new code; interviewers who follow PostgreSQL ask which one a fresh schema should use
- UUID vs a sequential integer key — a UUID lets the client generate the id before the row exists, but it indexes worse because inserts land randomly across the B-tree instead of appending; interviewers ask "why not UUID everywhere?"
- Normalization concept — storing `project_id` instead of copying `project_name` avoids duplication; changing the project name requires only one `UPDATE` in one place; interviewers ask "what problem does normalization solve?"
- Transitive dependency in a table — a non-key column that depends on another non-key column instead of on the key (storing `project_name` beside `project_id`); interviewers show a denormalised table and ask what is wrong with it, not for the normal form's number
- Deliberate denormalisation — storing a computed `total_hours` or a copied `project_name` to avoid an expensive aggregate, accepting that the copy can go stale; interviewers ask when duplicating data is the right call and how you keep it consistent
- PostgreSQL `ENUM` type vs a `CHECK` constraint on a status column — the `ENUM` needs a migration to add a value while the `CHECK` is edited in place, and a free-text column with neither admits typos that silently break every `WHERE status = 'approved'`; interviewers ask how you would constrain `time_entries.status`
- Lookup table for a status column — a referenced table costs a JOIN on every read but lets the set of valid values be edited at runtime by the application rather than by a migration; interviewers ask when the extra table earns its keep
- Soft delete vs hard delete — a `deleted_at` column keeps history and preserves foreign keys, but every query must now filter it and one forgotten filter resurrects deleted rows in a report; interviewers ask what breaks when you soft-delete a user whose `email` must stay unique
- Database `DEFAULT NOW()` vs Hibernate `@CreationTimestamp` for `created_at` — interviewers ask what happens to the database default when the ORM always sends the column explicitly, and the answer is that the default never fires
- Reading a schema out loud — describing the TimeTrack data model: "three tables; `users` and `projects` are independent; `time_entries` links to both via foreign keys"; interviewers ask "explain your database structure"

---

## Data types

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- Choosing a `VARCHAR` length too small — a limit that fits today's emails and rejects tomorrow's tokens turns into a migration on a live table; a standard review finding on a hand-written schema
- `INT` vs `SERIAL` vs `BIGSERIAL` — `INT` is a plain integer; `SERIAL` is an auto-incrementing integer used for primary keys; `BIGSERIAL` handles very large tables; interviewers from MySQL ask "what is the equivalent of `AUTO_INCREMENT`?"
- `NUMERIC(p,s)` vs `FLOAT` — `FLOAT` is an approximation that compounds rounding errors over time; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices and financial values; interviewers ask "why would you not use `FLOAT` for money?"
- Choosing the unit a quantity is stored in — hours as `NUMERIC(5,2)` versus minutes as `INT`; interviewers ask how you would store `hours` in `time_entries` and expect the precision argument, not a shrug
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `DATE` vs `TIMESTAMPTZ` for a business day — a work date has no time component and no time zone, so storing it as a timestamp shifts it a day across zone boundaries; interviewers ask which type `time_entries.work_date` should be
- Where time zone conversion happens — the database stores UTC and the presentation layer converts to the user's zone; interviewers ask how you would show a work day correctly to employees in two countries
- `BOOLEAN` — stores `true` or `false`; PostgreSQL accepts `true`, `'t'`, `'yes'`, `1` as input — always write `true` / `false` for readability; used for flags like `is_active`
- `JSONB` column vs a proper table — `JSONB` fits genuinely schemaless payloads and is wrong for anything you filter, join, or constrain; interviewers ask why you would not "just put the settings in a JSON column"
- Array column vs junction table — a PostgreSQL array avoids a JOIN but gives up foreign keys and referential integrity entirely; interviewers ask why you would not store `tag_ids` as an array

---

## DDL — creating and evolving a schema

- `CREATE DATABASE` vs `CREATE SCHEMA` — a database is a separate connection target and PostgreSQL cannot join across two of them; a schema is a namespace inside one database that you can join across freely; interviewers ask which one you would use to separate two modules
- `CREATE TABLE` written by hand — the column list, types, `NOT NULL`, `DEFAULT` and constraint clauses in one statement; every live-coding exercise starts here, and candidates who only ever used `ddl-auto` freeze at a blank editor
- Column-level vs table-level constraint syntax — `email VARCHAR(255) UNIQUE` versus `CONSTRAINT uq_users_email UNIQUE (email)`; interviewers ask why you would name a constraint, and the answer is readable error messages and being able to `DROP` it by name later
- `REFERENCES` inline in `CREATE TABLE` — `user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE`; interviewers ask what order the tables must be created in, since the referenced table has to exist first
- `DEFAULT` in DDL — `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`; the default applies only when the column is omitted, so an `INSERT` that names it explicitly with `NULL` still fails the `NOT NULL`
- `CREATE TABLE IF NOT EXISTS` — makes a setup script re-runnable; the difference between a script you can execute twice and one that fails the second time is what makes a seed file usable by a reviewer
- `DROP TABLE` vs `DROP TABLE ... CASCADE` — a plain `DROP` fails while another table's foreign key depends on it; `CASCADE` drops the dependent constraints too; interviewers ask what `CASCADE` actually removes
- `ALTER TABLE ... ADD COLUMN` — the safe additive change; adding it as `NOT NULL` to a table that already has rows fails unless you also give a `DEFAULT`, which is the standard follow-up question
- `ALTER TABLE ... ALTER COLUMN TYPE` — every existing value must be castable to the new type and PostgreSQL rewrites the whole table; interviewers ask what happens to the rows that do not fit
- `ALTER TABLE ... ADD CONSTRAINT` on a populated table — adding a `UNIQUE` or `CHECK` fails if any existing row violates it; the interviewer is probing whether you think about the data already there, not just the new rule
- `ALTER TABLE ... RENAME COLUMN` — trivial in SQL and yet it breaks every query and entity mapping that referenced the old name; the standard opener for "why are schema changes risky?"
- DDL is transactional in PostgreSQL — `BEGIN; ALTER TABLE ...; ROLLBACK;` really does undo the change, unlike MySQL or Oracle where DDL commits implicitly; candidates coming from those databases are surprised and interviewers ask them to confirm it

---

## Working with a live database

- `psql` vs a GUI client — `psql` is the terminal client shipped with PostgreSQL and pgAdmin or DBeaver wrap the same protocol; interviewers ask whether you can operate without a GUI, because servers rarely have one
- `\dt` and `\l` — list the tables of the current database and the databases on the server; the orientation step in an unknown schema during a live exercise
- `\d table_name` output — reads back the columns, types, defaults, indexes and foreign keys of a table; the verification step after writing DDL by hand
- `information_schema` and `pg_catalog` — the system views that let you query the schema itself (`SELECT * FROM information_schema.columns WHERE table_name = 'users'`); interviewers ask how you would list every table without a GUI
- The `public` schema — the default schema an unqualified `CREATE TABLE` lands in; interviewers ask where your table actually went
- `search_path` — the ordered list of schemas PostgreSQL scans to resolve an unqualified table name; explains how the very same query finds the table in one session and raises `relation does not exist` in another
- Qualified vs unqualified table names — `app.users` versus `users`; you qualify explicitly in migrations and in anything run by a different role, precisely because `search_path` differs per session
- Role vs user in PostgreSQL — they are the same object and a "user" is simply a role with `LOGIN`; the first surprise for anyone arriving from MySQL
- `GRANT` on a table — gives a role `SELECT`, `INSERT`, `UPDATE` or `DELETE` on it; interviewers ask which privileges the application's own database user should hold and why it must not be a superuser
- Object ownership — the role that created a table owns it and can alter or drop it regardless of grants; explains permission errors that look inexplicable after a migration ran as a different user
- Importing a `.sql` dump — `psql -d mydb -f dump.sql` or `\i file.sql` runs a script against a database; the take-home instruction "restore the attached dump and answer these questions" assumes you can do this unaided
- `pg_dump` — produces a reloadable copy of a whole database; interviewers ask how you would get production-shaped data onto your laptop to reproduce a bug

---

## Reading PostgreSQL errors

- `duplicate key value violates unique constraint "users_email_key"` — the exact text of a `UNIQUE` violation, and the constraint name in the message tells you which column failed; interviewers show the raw log line and ask which statement caused it
- `insert or update on table "time_entries" violates foreign key constraint` — the referenced row does not exist; its mirror image, `update or delete on table "users" violates foreign key constraint on table "time_entries"`, means a dependent row still does; interviewers ask you to tell the two apart
- `null value in column "email" violates not-null constraint` — the `NOT NULL` failure; the fix is a value, a `DEFAULT`, or admitting the column should be nullable, and most of the time it signals a data bug rather than a schema bug
- `new row for relation "time_entries" violates check constraint "time_entries_hours_check"` — the `CHECK` failure message; interviewers follow up with why the database validates at all when the application already did
- `column "u.name" must appear in the GROUP BY clause or be used in an aggregate function` — the literal text of the `GROUP BY` rule; interviewers paste it and expect both fixes named (add the column to `GROUP BY`, or wrap it in an aggregate) plus which one preserves the intended grouping
- `more than one row returned by a subquery used as an expression` — a scalar subquery matched several rows; interviewers ask why it worked in development and failed in production (the data grew) and what the fix is
- `relation "users" does not exist` — the three real causes a junior must be able to enumerate: connected to the wrong database, the wrong `search_path`, or a quoted-identifier case problem
- `invalid input syntax for type integer: "abc"` — a value that cannot be cast; interviewers ask where it typically comes from (an unvalidated request parameter) and which layer should have caught it first
- SQLSTATE codes — every PostgreSQL error carries a code (`23505` unique violation, `23503` foreign key, `23502` not null, `23514` check); interviewers ask how you distinguish "duplicate email" from any other failure in code, since parsing the message text is fragile
- The row count changes at each join step — every join can only keep or multiply rows, never reduce them below the driving table unless it is an `INNER JOIN`, so comparing the count before and after each one localises where a report inflated

---

## Indexes

- What an index is — a sorted data structure that speeds up reads on a column at the cost of slower writes; primary keys and `UNIQUE` columns are indexed automatically; foreign key columns used in JOINs benefit most from a manual index
- PostgreSQL does not index a foreign key column — it indexes the *referenced* key only, so the child side of every `@ManyToOne` stays unindexed until you create it yourself; the single most common missing index in a junior schema
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- When NOT to index — small tables, columns with very few distinct values (a `status` column with three options gains little), and columns that are updated very frequently
- The write cost of an index — every `INSERT` and `UPDATE` must also update each index on the table, so an over-indexed hot table has slow writes and grows on disk; the concrete meaning of "an index is not free"
- Redundant indexes — an index on `(a)` is already served by an index on `(a, b)`, and `PRIMARY KEY` and `UNIQUE` create theirs automatically; the duplicate costs write throughput for nothing
- Composite index column order — a multi-column index only helps queries filtering on its leftmost columns, so an index on `(user_id, work_date)` serves `WHERE user_id = ?` but not `WHERE work_date = ?`; interviewers ask why their two-column index is being ignored
- Non-sargable predicates — wrapping an indexed column in a function or cast (`WHERE DATE(created_at) = '2024-01-01'`) disables the index and forces a `Seq Scan`; rewrite it as a range on the raw column; the most common "the index does nothing" review finding
- Leading-wildcard `LIKE` — `LIKE '%term%'` cannot use a B-tree index because the index is sorted by prefix, while `LIKE 'term%'` can; interviewers ask why the search box got slow at a million rows

---

## Reading a query plan and diagnosing slowness

- `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- `EXPLAIN` vs `EXPLAIN ANALYZE` — `EXPLAIN` shows the planner's estimate without running the query, `EXPLAIN ANALYZE` actually executes it and reports real times and row counts; the difference matters because you must not run `EXPLAIN ANALYZE` on an `UPDATE` in production
- Estimated vs actual rows in a plan — a large gap between the two means the planner is working from stale statistics and chose the wrong plan; interviewers ask why a query that used an index yesterday does a `Seq Scan` today
- A `Seq Scan` is sometimes the correct plan — when a query returns a large fraction of the table, reading it sequentially beats thousands of random index lookups; "there is a Seq Scan" is not automatically a bug, and interviewers use this to separate memorised advice from understanding
- `ANALYZE` and table statistics — the planner estimates row counts from collected column statistics, which go stale after a bulk load and degrade every plan until they are refreshed
- `pg_stat_activity` — the view listing current sessions, their state (`active`, `idle in transaction`) and the query each is running; the first thing you look at when the database appears stuck rather than slow
- `statement_timeout` — makes a long-running query fail fast instead of hanging forever and tying up its connection; interviewers ask how you stop one bad query from exhausting the pool
- `ALTER TABLE` takes an exclusive lock — it blocks every read and write on that table for its duration, which is how a "small migration" takes a production API down; interviewers ask what you check before running one on a live table

---

## PostgreSQL specifics

- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `ILIKE` — case-insensitive pattern matching; not available in MySQL or SQL Server; interviewers switching from MySQL ask why `LIKE` is not finding results they expect
- `DISTINCT ON` — keeps one row per group while returning multiple columns; not available in standard SQL; the column in `DISTINCT ON (...)` must be leftmost in `ORDER BY`
- `RETURNING` — `INSERT`, `UPDATE`, and `DELETE` can return the affected rows in a single statement; avoids a second `SELECT`; not standard SQL
- Single quotes vs double quotes — single quotes delimit string literals and double quotes delimit identifiers, so `WHERE name = "Victor"` fails with `column "Victor" does not exist`; interviewers use exactly that error to test the distinction
- Unquoted identifiers are folded to lowercase — a column created as `createdAt` without quotes becomes `createdat`, while one created as `"createdAt"` must be quoted forever after; interviewers ask why a column generated by a tool only works when quoted
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `NOW()` vs `CURRENT_DATE` — `NOW()` returns the current timestamp including time; `CURRENT_DATE` returns today's date with no time; used in date range filters and default column values
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- `STRING_AGG(column, separator)` — concatenates values from multiple rows into one string per group, e.g. `STRING_AGG(name, ', ')` to list all project names for a user on one line; PostgreSQL-specific; interviewers ask how you would turn grouped rows into a single comma-separated column for a report

---

## Writing a report query

- Mapping a requirement onto the clause skeleton — turning "per project, total approved hours this month, only projects above 40h" into `FROM/JOIN → WHERE → GROUP BY → HAVING → ORDER BY`; this decomposition, not the syntax, is what a live-coding exercise actually measures
- Choosing the driving table — starting `FROM` the entity the report is "per", so a `LEFT JOIN` can preserve the groups with zero rows; the reason a report silently drops the projects nobody logged time against
- Zero-row groups in a report — `COUNT` returns `0` but `SUM` returns `NULL` for an empty group, so the cell renders blank; wrap it as `COALESCE(SUM(hours), 0)`; interviewers show the blank cells and ask you to explain them
- Aliasing output columns — `AS total_hours`; the deliverable is read by a human and a reviewer notices an unnamed `sum` column
- Formatting in the query vs in the application — `ROUND(SUM(hours)::numeric, 2)` versus letting Angular format the value; interviewers ask where presentation belongs and expect the layer argument
