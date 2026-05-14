# DML — INSERT, UPDATE, DELETE

DML (Data Manipulation Language) modifies the data in the tables. SELECT reads data; INSERT, UPDATE, and DELETE change it.

---

## INSERT

Add one or more rows to a table.

```sql
-- Insert one row — specify all non-default columns
INSERT INTO authors (name, nationality)
VALUES ('Franz Kafka', 'Czech');

-- Insert multiple rows at once
INSERT INTO books (title, author_id, price, published_year)
VALUES
  ('The Trial', 3, 18.99, 1925),
  ('The Metamorphosis', 3, 12.99, 1915);

-- Insert and get the generated ID back (PostgreSQL)
INSERT INTO authors (name) VALUES ('Borges') RETURNING id;
```

`RETURNING` gives you the auto-generated `id` without a second query. Very useful in a Spring Boot application — you insert the row and immediately have the new ID to use in the response.

You do not need to include:
- `id` — it is `SERIAL`, generated automatically
- Columns with `DEFAULT` values
- Nullable columns you want to leave empty

---

## UPDATE

Modify existing rows. **Always use a WHERE clause** — without it, every row in the table is updated.

```sql
-- Update one row by ID
UPDATE authors
SET nationality = 'Austrian'
WHERE id = 3;

-- Update multiple columns at once
UPDATE books
SET price = 14.99, published_year = 1926
WHERE id = 7;

-- Update multiple rows matching a condition
UPDATE books
SET price = price * 1.10
WHERE genre = 'fiction';
```

`UPDATE ... RETURNING` also works in PostgreSQL:

```sql
UPDATE books SET price = 24.99 WHERE id = 5 RETURNING id, title, price;
```

---

## DELETE

Remove rows from a table. **Always use a WHERE clause** — without it, every row is deleted.

```sql
-- Delete one row
DELETE FROM books WHERE id = 7;

-- Delete multiple rows matching a condition
DELETE FROM books WHERE published_year < 1900;

-- Delete and see what was removed
DELETE FROM authors WHERE id = 3 RETURNING name;
```

### Foreign key constraints and DELETE

If other rows reference the row you are deleting, the database will reject the delete by default:

```sql
-- ERROR if books.author_id = 3 exists somewhere
DELETE FROM authors WHERE id = 3;
```

Fix options:
- Delete the dependent rows first, then delete the author
- Define `ON DELETE CASCADE` on the foreign key — automatically deletes dependent rows
- Define `ON DELETE SET NULL` — sets the foreign key to NULL on dependent rows

---

## The difference between DELETE and TRUNCATE

| | DELETE | TRUNCATE |
|---|--------|---------|
| Removes all rows | `DELETE FROM table` | `TRUNCATE table` |
| Supports WHERE | Yes | No |
| Can be rolled back | Yes (inside a transaction) | Yes (in PostgreSQL) |
| Speed on full table | Slow — logs every row | Fast — removes all at once |
| Resets SERIAL | No | Yes |

Use `DELETE` in application code. Use `TRUNCATE` only in scripts that reset a table completely (e.g. test data setup).

---

## Common mistakes

```sql
-- ⚠️ Updates EVERY row — forgot WHERE
UPDATE books SET price = 0;

-- ⚠️ Deletes EVERY row — forgot WHERE
DELETE FROM books;

-- ✅ Always double-check with a SELECT first
SELECT * FROM books WHERE genre = 'fiction';
-- Then, once you are sure:
UPDATE books SET price = price * 1.10 WHERE genre = 'fiction';
```
