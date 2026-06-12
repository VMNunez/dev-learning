# SQL — JOINs

**Docs:** [PostgreSQL JOINs](https://neon.com/postgresql/postgresql-tutorial/postgresql-joins)

---

## The bookstore data

These are the five tables used in all examples below. Keep them in mind as you read.

**authors**
```
id  | name                    | nationality
----|-------------------------|-------------
11  | Gabriel García Márquez  | Colombian
12  | George Orwell           | British
13  | Haruki Murakami         | Japanese
```

**books**
```
id | title                         | price | year | author_id
---|-------------------------------|-------|------|----------
1  | One Hundred Years of Solitude | 12.99 | 1967 | 11
2  | Love in the Time of Cholera   | 10.50 | 1985 | 11
3  | 1984                          |  9.99 | 1949 | 12
4  | Animal Farm                   |  7.50 | 1945 | 12
5  | Norwegian Wood                | 11.99 | 1987 | 13
6  | Kafka on the Shore            | 13.50 | 2002 | 13
```

**customers**
```
id | name          | email             | country
---|---------------|-------------------|--------
1  | Alice Johnson | alice@email.com   | US
2  | Carlos Pérez  | carlos@email.com  | ES
3  | Emma Schmidt  | emma@email.com    | DE
```

**orders**
```
id | customer_id | created_at
---|-------------|---------------------
1  | 1           | 2024-01-15 10:30:00
2  | 2           | 2024-03-22 14:00:00
3  | 3           | 2024-06-10 09:15:00
```

**order_books** *(link table — one row per book in an order)*
```
order_id | book_id
---------|--------
1        | 3       → Alice ordered 1984
1        | 5       → Alice ordered Norwegian Wood
2        | 1       → Carlos ordered One Hundred Years of Solitude
2        | 4       → Carlos ordered Animal Farm
3        | 6       → Emma ordered Kafka on the Shore
```

---

## Why JOINs exist

Your database splits data across multiple tables. Books live in `books`, authors live in `authors`. They are connected by a foreign key — `books.author_id` points to `authors.id`.

If you run:

```sql
SELECT * FROM books;
```

You get:

```
id | title       | price | year | author_id
---|-------------|-------|------|----------
3  | 1984        | 9.99  | 1949 | 12
4  | Animal Farm | 7.50  | 1945 | 12
```

`author_id = 12` means nothing to a user. They want to see "George Orwell", not "12". But the name is in a different table.

A JOIN lets you combine both tables in a single query so you can show the author's name instead of the id.

> The main use case for a JOIN is when two tables are connected by a foreign key. That foreign key is the bridge — it tells PostgreSQL how to find the matching row in the other table.

---

## How a JOIN works — step by step

A JOIN says: **for each row in the first table, find the matching row in the second table and combine them into one row.**

PostgreSQL goes through `books` row by row:
- "1984" has `author_id = 12` → find the author where `id = 12` → George Orwell → combine into one row
- "Animal Farm" has `author_id = 12` → find the author where `id = 12` → George Orwell → combine into one row
- "Norwegian Wood" has `author_id = 13` → find the author where `id = 13` → Haruki Murakami → combine into one row

The result is a new combined table with columns from both.

---

## INNER JOIN — the most common JOIN

`INNER JOIN` returns only the rows where a match exists in **both** tables. If a book has an `author_id` that does not exist in `authors`, that book is excluded from the result.

```sql
SELECT books.title, authors.name
FROM books
INNER JOIN authors ON books.author_id = authors.id;
```

Result:

```
title                          | name
-------------------------------|------------------------
One Hundred Years of Solitude  | Gabriel García Márquez
Love in the Time of Cholera    | Gabriel García Márquez
1984                           | George Orwell
Animal Farm                    | George Orwell
Norwegian Wood                 | Haruki Murakami
Kafka on the Shore             | Haruki Murakami
```

Now let's break down each part of that query.

---

**`FROM books`** — your starting table. PostgreSQL reads every row from here first.

By convention, `FROM` takes the table that has the foreign key. In this example, `books` has `author_id`, which is the foreign key that points to `authors.id` — so `books` goes in `FROM`. For `INNER JOIN`, swapping the tables would produce the same result, but following this convention makes queries easier to read: you start from the "child" table (the one that references another) and attach the "parent" table (the one being referenced).

---

**`INNER JOIN authors`** — the table you want to connect to. PostgreSQL attaches matching rows from `authors` to each row in `books`.

`JOIN` without any keyword means the same as `INNER JOIN` — `INNER` is optional:

```sql
FROM books JOIN authors ON ...        -- same result
FROM books INNER JOIN authors ON ...  -- more explicit, same result
```

---

**`ON books.author_id = authors.id`** — the connection rule. This is where you express the foreign key relationship: the column that holds the foreign key on one side (`books.author_id`), and the primary key it references on the other (`authors.id`). PostgreSQL uses this condition to decide which rows belong together — for every book row, it finds the author row where `authors.id` matches `books.author_id`. Without `ON`, PostgreSQL would have no way to know how to connect the two tables.

---

**`SELECT books.title, authors.name`** — this works exactly like any `SELECT` you have written before: you list the columns you want to see. The difference is that now you have columns from two tables in scope, and both tables have a column called `id`. If you just write `id`, PostgreSQL does not know which table's `id` you mean and throws an error.

The solution is to prefix each column with its table name: `books.title` means "the `title` column from the `books` table", and `authors.name` means "the `name` column from the `authors` table". This prefix is only strictly required when two joined tables share a column name, but adding it everywhere makes queries clearer and easier to read.

---

## Table aliases — keep queries short

Writing the full table name every time is repetitive. You can give each table a short alias.

Table aliases work exactly like column aliases — `AS` is optional. `books b` and `books AS b` mean exactly the same thing. Most developers drop the `AS` for table aliases because it is shorter, but both forms are valid:

```sql
SELECT b.title, a.name
FROM books b
JOIN authors a ON b.author_id = a.id;
```

`books b` means "call `books` by the name `b` in this query". Everywhere you would write `books.`, you write `b.` instead. Single letters are fine for short queries and most developers use them by default.

---

## LEFT JOIN — all rows from the left table

`LEFT JOIN` returns **all rows from the left table** (the one after `FROM`), plus matching rows from the right. If a row in the left table has no match in the right table, the right side columns appear as `NULL`.

Imagine a book exists with `author_id = 99` — that author does not exist in `authors`:

```sql
SELECT b.title, a.name
FROM books b
LEFT JOIN authors a ON b.author_id = a.id;
```

```
title        | name
-------------|---------------
1984         | George Orwell
Dune         | NULL           ← no match, but the book still appears
```

**Use LEFT JOIN when you want all rows from the left table, even if some have no match.**

---

## Finding rows with no match

A very common real-world pattern: find all rows from one table that have no corresponding row in another.

```sql
-- Find all authors who have no books
SELECT a.name
FROM authors a
LEFT JOIN books b ON b.author_id = a.id
WHERE b.id IS NULL;
```

How it works step by step:
1. `LEFT JOIN` keeps all authors, even those with no books
2. Where there is no book, all `books` columns are `NULL` — including `b.id`
3. `WHERE b.id IS NULL` filters to only those authors

---

## RIGHT JOIN and FULL JOIN

**RIGHT JOIN** — the mirror of LEFT JOIN. Returns all rows from the right table (the one after `JOIN`). If no match, the left side columns are `NULL`.

**FULL JOIN** — returns every row from both tables. NULLs on whichever side has no match.

> Both are rare in practice. You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the tables. `INNER JOIN` and `LEFT JOIN` cover 95% of real queries — focus on those.

---

## Multiple JOINs — connecting more than two tables

You can chain JOINs to connect as many tables as you need. Getting customer names and book titles from an order requires four tables:

```
customers → orders → order_books → books
```

```sql
SELECT c.name, b.title
FROM customers c
JOIN orders o        ON o.customer_id = c.id
JOIN order_books ob  ON ob.order_id = o.id
JOIN books b         ON ob.book_id = b.id;
```

Result:

```
name           | title
---------------|-------------------------------
Alice Johnson  | 1984
Alice Johnson  | Norwegian Wood
Carlos Pérez   | One Hundred Years of Solitude
Carlos Pérez   | Animal Farm
Emma Schmidt   | Kafka on the Shore
```

Read it left to right: start with `customers`, attach their `orders`, attach the `order_books` link table, attach the `books`. Each JOIN adds one more table.

---

## Which JOIN to use

| You want | Use |
|----------|-----|
| Only rows with a match on both sides | `INNER JOIN` |
| All rows from the left table, NULL if no match | `LEFT JOIN` |
| Find rows with no match on the right | `LEFT JOIN ... WHERE right.id IS NULL` |
| All rows from both tables | `FULL JOIN` |

---

## Execution order with JOINs

```
FROM + JOIN → WHERE → SELECT → ORDER BY → LIMIT
```

JOINs happen first — they build the full combined dataset. Then `WHERE` filters it. This means you can filter on columns from any joined table in the `WHERE` clause.
