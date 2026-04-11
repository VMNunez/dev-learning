# SQL — Table Relationships

## Types of tables

### Primary table

- Exists independently
- No foreign keys
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

### One-to-one (1:1)

One row in A relates to exactly one row in B.
Rare — you usually just merge the two tables.

### One-to-many (1:N)

One row in A relates to many rows in B.
The foreign key goes in the secondary table (the "many" side).

```
authors (1) ──── (N) books
```

`books` has `author_id` → points to `authors`

### Many-to-many (N:M)

Many rows in A relate to many rows in B.
You need a junction table in the middle.

```
orders (N) ──── order_items ──── (N) books
```

`order_items` has `order_id` and `book_id`

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

## Naming conventions

| Thing           | Convention                     | Example                     |
| --------------- | ------------------------------ | --------------------------- |
| Tables          | Plural, lowercase, underscores | `authors`, `order_items`    |
| Primary key     | Always `id`                    | `id`                        |
| Foreign key     | `referenced_table_singular_id` | `author_id`, `customer_id`  |
| Columns         | Lowercase, underscores         | `first_name`, `created_at`  |
| Date columns    | End in `_at`                   | `created_at`, `updated_at`  |
| Boolean columns | Start with `is_` or `has_`     | `is_active`, `has_discount` |
