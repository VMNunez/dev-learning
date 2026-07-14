# SQL — SELECT

Official docs: [PostgreSQL SELECT](https://neon.com/postgresql/postgresql-tutorial/postgresql-select)

---

## What SELECT does

`SELECT` retrieves data from a table. It is the most common SQL statement you will write.

---

## Basic syntax

```sql
SELECT column1, column2
FROM table_name;
```

PostgreSQL reads the `FROM` clause first, then the `SELECT` clause.
Order of evaluation: `FROM` → `SELECT`.

---

## Select specific columns

Only ask for the columns you need.

```sql
SELECT title, price FROM books;
```

---

## Select all columns — SELECT \*

```sql
SELECT * FROM books;
```

`*` means "all columns". Useful when you explore data manually.

**Do not use `*` in application code.** Reasons:

- It fetches columns you may not need → slower database
- It sends more data over the network → slower app

Always name the columns in real code.

---

## Expressions — combine columns

You can combine columns directly inside `SELECT`.

PostgreSQL uses `||` to join text — this is called **concatenation**. It works exactly like `+` for strings in JavaScript.

`||` does **not** add spaces automatically. Every character in the result comes exactly from what you write:

```sql
SELECT 'hello' || 'world';           -- helloworld   (no space)
SELECT 'hello' || ' ' || 'world';    -- hello world  (you add the space yourself)
```

In the bookstore example, the `' ('` and `')'` are literal strings you add yourself — that is where the space and the parentheses come from.

```sql
SELECT name || ' (' || nationality || ')' FROM authors;
```

Result:

```
Gabriel García Márquez (Colombian)
George Orwell (British)
Haruki Murakami (Japanese)
```

---

## Column alias — AS

When you use an expression, the result column has no name (PostgreSQL shows `?column?`).
Use `AS` to give it a name.

```sql
SELECT name || ' (' || nationality || ')' AS author_info
FROM authors;
```

`AS` is never technically required — PostgreSQL accepts `SELECT price * 1.21 discounted_price` without it. But there is a practical rule:

- **Normal column** (`title`, `price`) — already has a name. `AS` is optional.
- **Expression** (`price * 1.21`, `name || '...'`) — has no natural name. PostgreSQL shows `?column?` without an alias. You should always give it one.

So in practice: whenever you write an expression, always add `AS alias_name`.

You can also alias a normal column:

```sql
SELECT title AS book_title, price AS cost FROM books;
```

If the alias has spaces, wrap it in double quotes:

```sql
SELECT title AS "book title" FROM books;
```

---

## SELECT DISTINCT — remove duplicates

`DISTINCT` removes duplicate rows from the result.

```sql
-- Get all unique nationalities
SELECT DISTINCT nationality FROM authors;
```

If you use multiple columns, `DISTINCT` looks at the **combination** of values:

```sql
-- Unique combinations of nationality and name
SELECT DISTINCT nationality, name FROM authors;
```

Two important things to remember:

- PostgreSQL treats `NULL` as a duplicate — it keeps **one** NULL and removes the rest
- Use `DISTINCT` to explore what unique values exist in a column — very useful in real work

---

## DISTINCT vs DISTINCT ON — the difference

`DISTINCT` and `DISTINCT ON` solve different problems.

**`DISTINCT`** removes duplicate rows based on the columns you select. You get exactly those columns back, nothing more.

```sql
SELECT DISTINCT nationality FROM authors;
-- Returns one row per unique nationality — only that column
```

You can use `ORDER BY` with `DISTINCT`, but the column you order by must be in the `SELECT` list:

```sql
SELECT DISTINCT nationality FROM authors ORDER BY nationality;  -- OK
SELECT DISTINCT nationality FROM authors ORDER BY name;         -- ERROR — name is not selected
```

---

**`DISTINCT ON`** is a PostgreSQL feature (not standard SQL). It lets you return **multiple columns** while still keeping only one row per group.

```sql
-- Get the most expensive book per author
SELECT DISTINCT ON (author_id) author_id, title, price
FROM books
ORDER BY author_id, price DESC;
```

This returns `author_id`, `title`, and `price` — three columns — but keeps only one row per `author_id`.

**How `ORDER BY` works here — two jobs at once:**

`ORDER BY author_id, price DESC` does two things simultaneously:

1. **`author_id`** — satisfies the rule: the first column in `ORDER BY` must match `DISTINCT ON (author_id)`. This is mandatory.
2. **`price DESC`** — determines *which* row to keep per author (the one with the highest price).

The final result is sorted by `author_id`. If you also want the result sorted by price at the end, you need a subquery — but at junior level you will not need that.

**Rule:** the column inside `DISTINCT ON (...)` must be the **leftmost** column in `ORDER BY`.

> You will not use this often at junior level, but it is good to know it exists.

---

## Summary

| Clause     | Purpose                      |
| ---------- | ---------------------------- |
| `SELECT`   | choose which columns to show |
| `FROM`     | choose the table             |
| `DISTINCT` | remove duplicate rows        |
