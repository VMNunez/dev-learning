# SQL — Table Relationships

Official docs: [PostgreSQL Foreign Key](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)

---

Tables on their own are just flat lists. Relationships are what make a database useful — they let you model real-world connections between entities and enforce that those connections stay valid.

Without relationships, nothing stops you from inserting a `books` row with an `author_id` that points to an author that does not exist. The database silently accepts it and you end up with broken data. Foreign keys fix this.

---

## Types of tables

### Primary table

- Exists independently — does not depend on any other table
- No foreign keys pointing outward
- The "one" side of a relationship
- Examples: `authors`, `customers`

### Secondary table

- Depends on a primary table
- Holds the foreign key
- The "many" side of a relationship
- Examples: `books` (depends on `authors`), `orders` (depends on `customers`)

### Junction table

- Used for many-to-many relationships
- Has two foreign keys, one pointing to each side
- Example: `order_items` (connects `orders` and `books`)

---

## Types of relationships

### One-to-many (1:N)

One row in A relates to many rows in B. The foreign key goes in the secondary table — the "many" side.

```
authors (1) ──── (N) books
```

`books` has `author_id` → points to `authors.id`.

### Many-to-many (N:M)

Many rows in A relate to many rows in B. You cannot store this with a single foreign key — you need a junction table in the middle.

```
orders (N) ──── order_items ──── (N) books
```

`order_items` has both `order_id` and `book_id`.

### One-to-one (1:1)

One row in A relates to exactly one row in B. Rare — you usually just merge the two tables into one. A real case: splitting a `users` table from a `user_profiles` table to keep the main table lean.

---

## How to identify the relationship

Ask yourself two questions:

1. Can one A have many B?
2. Can one B have many A?

| Answer    | Relationship |
| --------- | ------------ |
| Yes / No  | One-to-many  |
| Yes / Yes | Many-to-many |
| No / No   | One-to-one   |

---

## ON DELETE behaviour

When you delete a row that other rows depend on, the database has to decide what to do. You control this with the `ON DELETE` option on the foreign key.

| Option | What happens |
|--------|-------------|
| `RESTRICT` (default) | Rejects the delete if dependent rows exist |
| `CASCADE` | Automatically deletes all dependent rows |
| `SET NULL` | Sets the foreign key to NULL on dependent rows |
| `NO ACTION` | Same as RESTRICT in most cases |

```sql
-- Deleting an order also deletes all its items
order_id INT REFERENCES orders(id) ON DELETE CASCADE

-- Deleting an author sets books.author_id to NULL (book stays, author link is removed)
author_id INT REFERENCES authors(id) ON DELETE SET NULL
```

> Use `CASCADE` when child rows have no meaning without the parent. Use `SET NULL` when the child can exist independently. Use the default `RESTRICT` when you want the database to force you to clean up manually — this is the safest option for most cases.

---

## Naming conventions

| Thing           | Convention                     | Example                     |
| --------------- | ------------------------------ | --------------------------- |
| Tables          | Plural, lowercase, underscores | `authors`, `order_items`    |
| Primary key     | Always `id`                    | `id`                        |
| Foreign key     | `referenced_table_singular_id` | `author_id`, `customer_id`  |
| Columns         | Lowercase, underscores         | `first_name`, `created_at`  |
| Date columns    | End in `_at`                   | `created_at`, `updated_at`  |
| Boolean columns | Start with `is_` or `has_`     | `is_active`, `has_discount` |
