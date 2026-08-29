# SQL — ORDER BY, LIMIT, OFFSET

Official docs: [PostgreSQL ORDER BY](https://neon.com/postgresql/postgresql-tutorial/postgresql-order-by)

---

## ORDER BY — sort rows

`ORDER BY` sorts the result. You choose the column and the direction.

```sql
SELECT * FROM books ORDER BY price ASC;   -- cheapest first
SELECT * FROM books ORDER BY price DESC;  -- most expensive first
```

`ASC` (ascending) is the default — you can omit it and the result is the same:

```sql
SELECT * FROM books ORDER BY price;       -- same as ASC
```

---

## Sorting by multiple columns

You can give `ORDER BY` more than one column. The second column only matters when two rows have the same value in the first column.

```sql
SELECT * FROM books ORDER BY author_id ASC, price DESC;
```

Think of it step by step:

1. First, sort all rows by `author_id` ascending — all books by the same author are grouped together.
2. Then, within each group, sort by `price` descending — most expensive book from that author appears first.

With the bookstore data, the result looks like this:

```
author_id 11 → One Hundred Years of Solitude (12.99)   ← most expensive of author 11
author_id 11 → Love in the Time of Cholera   (10.50)
author_id 12 → 1984                          (9.99)    ← most expensive of author 12
author_id 12 → Animal Farm                   (7.50)
author_id 13 → Kafka on the Shore            (13.50)   ← most expensive of author 13
author_id 13 → Norwegian Wood                (11.99)
```

If you only sorted by `author_id ASC`, the two books within each author group could appear in any order. Adding `price DESC` as the second column makes that order predictable.

---

## Sorting by an expression or alias

`ORDER BY` runs after `SELECT`, so you can use a column alias you defined in `SELECT`:

```sql
SELECT title, LENGTH(title) AS title_length
FROM books
ORDER BY title_length DESC;
```

`LENGTH(title)` counts the number of characters in the title. Because `ORDER BY` sees the result of `SELECT`, it can use the alias `title_length` directly — you don't need to repeat the expression.

> This is the one place where you can use an alias in a clause. You cannot do this in `WHERE` because `WHERE` runs before `SELECT`.

---

## NULL values in ORDER BY

Some columns may have NULL values (missing data). When you sort a column that has NULLs, PostgreSQL treats NULL as the largest possible value:

- `ASC` (smallest → largest) → NULLs appear **last**
- `DESC` (largest → smallest) → NULLs appear **first**

You can change this with `NULLS FIRST` or `NULLS LAST`:

```sql
-- Most expensive first, but books with no price go at the end (not the start)
SELECT * FROM books ORDER BY price DESC NULLS LAST;

-- Cheapest first, but books with no price go at the start
SELECT * FROM books ORDER BY price ASC NULLS FIRST;
```

In the bookstore database all books have a price, so you won't see this in practice here. But in real projects, NULL columns are very common — knowing this default saves debugging time.

---

## LIMIT — return only the first N rows

`LIMIT` stops the query after returning N rows. Use it when you only need the top results.

```sql
-- The 3 most expensive books
SELECT * FROM books ORDER BY price DESC LIMIT 3;
```

**Always use `ORDER BY` with `LIMIT`.** Without it, the database returns rows in whatever internal order it chooses — and that order can change between queries. You would get 3 random books, not the 3 most expensive.

```sql
SELECT * FROM books LIMIT 3;  -- works, but which 3? unpredictable
```

---

## OFFSET — skip rows

`OFFSET` skips N rows before returning results. On its own it is rarely useful, but combined with `LIMIT` it builds pagination.

```sql
-- Skip the 2 cheapest books, then return the next 3
SELECT * FROM books ORDER BY price ASC LIMIT 3 OFFSET 2;
```

How a "3 books per page" pagination would look:

| Page   | Query                  |
| ------ | ---------------------- |
| Page 1 | `LIMIT 3 OFFSET 0`     |
| Page 2 | `LIMIT 3 OFFSET 3`     |
| Page 3 | `LIMIT 3 OFFSET 6`     |

Formula: `OFFSET = (page - 1) * page_size`

---

## FETCH — the SQL standard alternative to LIMIT

`FETCH` does exactly the same as `LIMIT`. The difference is that `FETCH` follows the SQL standard (SQL:2008) and works on any database. `LIMIT` is simpler and more common in PostgreSQL.

```sql
-- Same as LIMIT 3
SELECT * FROM books ORDER BY price DESC FETCH FIRST 3 ROWS ONLY;

-- Same as LIMIT 3 OFFSET 3
SELECT * FROM books ORDER BY price DESC OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY;
```

In day-to-day PostgreSQL work you will use `LIMIT`. You may see `FETCH` in code that needs to run on multiple databases (PostgreSQL, MySQL, SQL Server).

---

## Execution order reminder

SQL evaluates clauses in this order, not the order you write them:

```
FROM → WHERE → SELECT → ORDER BY → LIMIT
```

This is why:
- You **can** use a column alias in `ORDER BY` — it runs after `SELECT`
- You **cannot** use a column alias in `WHERE` — it runs before `SELECT`
