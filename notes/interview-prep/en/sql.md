# SQL — Interview Questions

## DDL and constraints

**What is the difference between DDL and DML?**
DDL (Data Definition Language) defines the structure of the database — `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`. DML (Data Manipulation Language) works with the data — `SELECT`, `INSERT`, `UPDATE`, `DELETE`. In an interview, knowing the names shows you understand that SQL has different layers.

**What does `NOT NULL` do and why is it important?**
It prevents a column from storing an empty value. Without it, a row can be inserted without that field, which leads to missing data that is hard to detect later. In the bookstore database, `name` on `authors` is `NOT NULL` because a book without an author name is useless.

**What does `UNIQUE` do?**
It prevents two rows from having the same value in that column. I use it on email fields — `email VARCHAR(100) NOT NULL UNIQUE` — so two customers cannot register with the same address. The database enforces it automatically, so I do not need to check for duplicates in the application for every case.

**What is `PRIMARY KEY` and how does it combine with `SERIAL`?**
`PRIMARY KEY` means the column uniquely identifies every row and cannot be NULL. Combining it with `SERIAL` — `id SERIAL PRIMARY KEY` — gives you an auto-incrementing ID that the database generates on every insert. You never have to set it manually.

**How do you define a foreign key in SQL?**
With `REFERENCES` — `author_id INT REFERENCES authors(id)`. This tells the database that `author_id` must match an existing `id` in the `authors` table. If you try to insert a book with an `author_id` that does not exist, the database rejects it.

**When do you use `CHAR` instead of `VARCHAR`?**
When the value always has the same fixed length. I use `CHAR(2)` for country codes — `'ES'`, `'DE'`, `'US'` are always exactly two characters. `VARCHAR` would also work, but `CHAR` signals that the length is always the same, which makes the intent clear.

**What does `IF NOT EXISTS` do in `CREATE TABLE`?**
It prevents an error if the table already exists. Without it, running the same `CREATE TABLE` twice throws an error. It is useful in setup scripts that you might run more than once — the script is idempotent.

---

## Data types

**What is the difference between `VARCHAR` and `TEXT` in PostgreSQL?**
`VARCHAR(n)` has a maximum length — use it when you know the limit (names, emails). `TEXT` has no limit — use it for long content like descriptions or comments. In practice, both store data the same way in PostgreSQL, but `VARCHAR` documents the intent.

**Why do you use `NUMERIC` for money and not `FLOAT`?**
`FLOAT` is an approximate type — it can introduce tiny rounding errors. For money, you need exact precision. `NUMERIC(10,2)` stores exactly two decimal places with no rounding. Using `FLOAT` for prices is a classic mistake that causes wrong totals.

**What is `SERIAL` and when do you use it?**
An auto-incrementing integer — PostgreSQL generates the next value automatically on every insert. Use it for primary keys so you never have to set the ID manually.

**When would you use `TIMESTAMP` instead of `DATE`?**
`DATE` stores only the day — good for birthdays or deadlines. `TIMESTAMP` stores the date and time — use it for events like `created_at` or `updated_at` where you need to know when exactly something happened.

---

## Table relationships

**What is a foreign key?**
A column in one table that points to the primary key of another table. It creates a link between the two tables and prevents you from inserting a row that references something that does not exist. For example, `books.author_id` is a foreign key pointing to `authors.id`.

**What are the three types of table relationships?**
One-to-many — one author has many books; the foreign key goes in the "many" side. Many-to-many — one order can have many books and one book can appear in many orders; you need a junction table in the middle. One-to-one — rare, usually you just merge the two tables.

**How do you identify what type of relationship two tables have?**
Ask two questions: "Can one A have many B?" and "Can one B have many A?" If only the first is yes, it is one-to-many. If both are yes, it is many-to-many. If neither is yes, it is one-to-one.

**What is a junction table and when do you need one?**
A table with two foreign keys — one pointing to each side of a many-to-many relationship. You need one whenever two entities can relate to many instances of each other. For example, `order_items` connects `orders` and `books`: one order has many books, and one book can appear in many orders.

**What naming conventions do you follow for tables and columns?**
Tables are plural and lowercase with underscores — `authors`, `order_items`. Primary keys are always `id`. Foreign keys follow the pattern `referenced_table_singular_id` — so `author_id`, `customer_id`. Boolean columns start with `is_` or `has_`. Date columns end in `_at` — `created_at`, `updated_at`.

---

## SELECT

**Why should you avoid `SELECT *` in application code?**
It fetches every column, including ones you do not need, which wastes bandwidth and makes the query slower. It also breaks if the table schema changes — a new column might cause unexpected behaviour. Always name the columns you actually need.

**What is a column alias and when is it useful?**
`AS` gives a name to a column or expression in the result. It is useful when you combine columns with an expression — without an alias, PostgreSQL shows `?column?` as the header. For example: `SELECT name || ' (' || nationality || ')' AS author_info FROM authors`.

**What does `DISTINCT` do?**
It removes duplicate rows from the result. When you use multiple columns, it removes rows where the combination of all selected columns is identical. Useful when exploring what unique values exist in a column.

---

## WHERE

**Why can't you use a column alias in `WHERE`?**
Because SQL evaluates `WHERE` before `SELECT`. The alias does not exist yet when the filter runs. You have to repeat the expression: `WHERE price * 2 > 20` instead of `WHERE double_price > 20`.

**What is the difference between `LIKE` and `ILIKE`?**
`LIKE` is case-sensitive — `'Wood'` and `'wood'` are different. `ILIKE` is case-insensitive — PostgreSQL-specific. Use `ILIKE` when you want search to work regardless of how the user typed it.

**When do you use `IN` instead of multiple `OR` conditions?**
When you want to match one column against a list of values. `IN (11, 13)` is cleaner and faster than `author_id = 11 OR author_id = 13` — PostgreSQL can optimise `IN` internally.

**Why does `WHERE price = NULL` not work?**
Because `NULL` means "unknown" — it cannot be compared with `=`. The result of any comparison with `NULL` is `NULL`, not `true` or `false`. Use `IS NULL` instead: `WHERE price IS NULL`.

**What does `BETWEEN` do and is it inclusive?**
It filters rows where a value falls inside a range. Yes, both ends are inclusive — `BETWEEN 1945 AND 1987` includes 1945 and 1987. Equivalent to `>= 1945 AND <= 1987`.

---

## ORDER BY and LIMIT

**What is the SQL execution order?**
`FROM` → `WHERE` → `SELECT` → `ORDER BY` → `LIMIT`. This is why you can use a column alias in `ORDER BY` (it runs after `SELECT`) but not in `WHERE` (it runs before `SELECT`).

**How do you implement pagination with SQL?**
With `LIMIT` and `OFFSET`. `LIMIT` sets how many rows to return, `OFFSET` skips the first N rows. The formula is `OFFSET = (page - 1) * page_size`. For example, page 2 with 10 rows per page: `LIMIT 10 OFFSET 10`.

**What happens with NULL values when you sort with `ORDER BY`?**
By default, `ASC` puts NULLs last and `DESC` puts NULLs first. You can override this with `NULLS FIRST` or `NULLS LAST` — for example, `ORDER BY price DESC NULLS LAST` keeps NULLs at the end even when sorting descending.

**Why should you always use `ORDER BY` with `LIMIT`?**
Without `ORDER BY`, the database returns rows in an unspecified order — it can change between runs. If you only take the first 10 rows from an unsorted result, you might get different rows each time. `ORDER BY` makes the result predictable.

---

## Pressure

**What SQL topics have you not learned yet?**
JOINs — combining data from multiple tables in a single query. Aggregate functions like `COUNT`, `SUM`, and `AVG`. `GROUP BY` for grouping rows and calculating totals per group. Subqueries and indexes. These are the next things I plan to study.
