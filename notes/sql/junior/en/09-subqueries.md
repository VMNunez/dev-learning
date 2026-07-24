# Subqueries

A subquery is a query nested inside another query. The inner query runs first and its result is used by the outer query.

---

## Subquery in WHERE

The most common use — filter rows based on the result of another query:

```sql
-- Books more expensive than the average price
SELECT title, price
FROM books
WHERE price > (SELECT AVG(price) FROM books);

-- Authors who have at least one book published after 2000
SELECT name
FROM authors
WHERE id IN (
  SELECT DISTINCT author_id
  FROM books
  WHERE published_year > 2000
);

-- Authors who have NO books
SELECT name
FROM authors
WHERE id NOT IN (
  SELECT DISTINCT author_id FROM books
);
```

### IN vs EXISTS

`IN` collects all results from the subquery and checks membership.
`EXISTS` stops as soon as it finds one match — faster on large tables.

```sql
-- Same result, EXISTS is faster if books table is large
SELECT name
FROM authors a
WHERE EXISTS (
  SELECT 1 FROM books WHERE author_id = a.id
);
```

---

## Subquery in FROM — derived table

A subquery used as a table. Must have an alias:

```sql
-- Authors who have more than 2 books
SELECT author_id, book_count
FROM (
  SELECT author_id, COUNT(*) AS book_count
  FROM books
  GROUP BY author_id
) AS author_stats
WHERE book_count > 2;
```

The inner query runs first, becomes a temporary result set called `author_stats`, then the outer query filters it.

---

## Subquery in SELECT — scalar subquery

Returns exactly one value, used as a column:

```sql
-- For each book, show how its price compares to the average
SELECT
  title,
  price,
  (SELECT ROUND(AVG(price), 2) FROM books) AS avg_price
FROM books;
```

Runs once per row — avoid on large tables without an index.

---

## Subquery vs JOIN

Most subqueries can be rewritten as a JOIN. The JOIN version is usually faster because the database can optimise it better:

```sql
-- Subquery version
SELECT title FROM books
WHERE author_id IN (
  SELECT id FROM authors WHERE nationality = 'British'
);

-- JOIN version — preferred
SELECT b.title
FROM books b
JOIN authors a ON b.author_id = a.id
WHERE a.nationality = 'British';
```

**Rule:** prefer a JOIN when it is readable. Use a subquery when the logic is clearer that way, or when you need the result of an aggregation to filter rows.

---

## When subqueries are the right tool

- Filtering with an aggregate: `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use AVG directly in WHERE
- Computing a derived value used only once: `FROM (...) AS stats WHERE stats.count > 5`
- Checking existence without needing columns from the other table: `WHERE EXISTS (...)`
