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

## Select all columns — SELECT *

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

PostgreSQL uses `||` to join text (called **concatenation**).

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

`AS` is optional — you can write the alias directly after the expression.
But using `AS` makes the query easier to read.

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

## DISTINCT ON — PostgreSQL only

`DISTINCT ON` is a PostgreSQL feature (not standard SQL). It keeps **one row per group**, and you control which row with `ORDER BY`.

```sql
-- Get the most expensive book per author
SELECT DISTINCT ON (author_id) author_id, title, price
FROM books
ORDER BY author_id, price DESC;
```

This keeps one row per `author_id` — the one that comes first after sorting by `price DESC`, so the most expensive book.

**Rule:** the column inside `DISTINCT ON (...)` must be the **leftmost** column in `ORDER BY`.

> You will not use this often at junior level, but it is good to know it exists.

---

## Summary

| Clause | Purpose |
|--------|---------|
| `SELECT` | choose which columns to show |
| `FROM` | choose the table |
| `DISTINCT` | remove duplicate rows |