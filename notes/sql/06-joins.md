# JOINs

A JOIN combines rows from two or more tables based on a related column — usually a foreign key.

Without JOINs you can only query one table at a time. With JOINs you can get data from multiple tables in a single query.

---

## The four types of JOIN

```
authors          books
--------         --------
id  name         id  title       author_id
1   Orwell        1  1984         1
2   Tolkien       2  The Hobbit   2
3   Woolf         3  Animal Farm  1
                  4  Dune         99   ← author_id 99 does not exist
```

### INNER JOIN — only matching rows

Returns rows where the condition matches in **both** tables. Rows with no match on either side are excluded.

```sql
SELECT books.title, authors.name
FROM books
INNER JOIN authors ON books.author_id = authors.id;
```

Result: 1984 + Orwell, The Hobbit + Tolkien, Animal Farm + Orwell. **Dune is excluded** — `author_id = 99` has no match in `authors`.

### LEFT JOIN — all from left + matching from right

Returns **all rows from the left table**, plus matching rows from the right. If there is no match, the right side columns are `NULL`.

```sql
SELECT books.title, authors.name
FROM books
LEFT JOIN authors ON books.author_id = authors.id;
```

Result: 1984 + Orwell, The Hobbit + Tolkien, Animal Farm + Orwell, **Dune + NULL**. Dune appears even though its author does not exist.

### RIGHT JOIN — all from right + matching from left

Returns **all rows from the right table**. The mirror of LEFT JOIN. Rarely used — you can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the tables.

```sql
SELECT books.title, authors.name
FROM books
RIGHT JOIN authors ON books.author_id = authors.id;
```

Result: 1984 + Orwell, The Hobbit + Tolkien, Animal Farm + Orwell, **NULL + Woolf**. Woolf appears even though she has no books.

### FULL JOIN — all rows from both sides

Returns every row from both tables. NULLs appear on whichever side has no match.

```sql
SELECT books.title, authors.name
FROM books
FULL JOIN authors ON books.author_id = authors.id;
```

Result: all four books + all three authors. Dune has NULL author, Woolf has NULL title.

---

## Which JOIN to use

| You want | Use |
|----------|-----|
| Only rows with a match on both sides | `INNER JOIN` |
| All rows from the left table | `LEFT JOIN` |
| Find rows with no match (orphaned records) | `LEFT JOIN ... WHERE right.id IS NULL` |
| All rows from both tables | `FULL JOIN` |

`INNER JOIN` and `LEFT JOIN` cover 95% of real-world cases.

---

## Syntax

```sql
SELECT columns
FROM table_a
[INNER | LEFT | RIGHT | FULL] JOIN table_b ON table_a.column = table_b.column;
```

`JOIN` without a keyword defaults to `INNER JOIN`.

---

## Table aliases — keep queries readable

```sql
SELECT b.title, a.name
FROM books b
JOIN authors a ON b.author_id = a.id;
```

Single-letter aliases are fine for short queries. For complex queries use descriptive abbreviations.

---

## Multiple JOINs

You can chain as many JOINs as needed:

```sql
SELECT c.name, b.title, oi.quantity
FROM order_items oi
JOIN orders o    ON oi.order_id = o.id
JOIN customers c ON o.customer_id = c.id
JOIN books b     ON oi.book_id = b.id;
```

Each JOIN adds one more table to the result. Read left to right: start with `order_items`, attach `orders`, attach `customers`, attach `books`.

---

## Finding unmatched rows

A common pattern: find all rows from one table that have no corresponding row in another.

```sql
-- Authors who have no books
SELECT a.name
FROM authors a
LEFT JOIN books b ON b.author_id = a.id
WHERE b.id IS NULL;
```

The LEFT JOIN keeps all authors. Where there is no book, `b.id` is NULL. The WHERE then filters to only those rows.

---

## Execution order with JOINs

`FROM + JOIN` → `WHERE` → `SELECT` → `ORDER BY` → `LIMIT`

JOINs happen first, as part of building the full dataset. Then WHERE filters it.
