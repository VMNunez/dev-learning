# SQL — Test 01: Bookstore

**Time limit:** 45 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Schema

```sql
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    price NUMERIC(8,2) NOT NULL,
    author_id INT REFERENCES authors(id),
    category_id INT REFERENCES categories(id)
);

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id),
    quantity INT NOT NULL,
    sale_date DATE NOT NULL
);
```

## Queries to write

1. List all books with their author name and category name
2. Total number of books per author — include authors with 0 books
3. Average price per category
4. Top 3 most sold books by total quantity sold
5. Books that have never been sold
6. Total revenue per category (price × quantity for each sale, grouped by category)
7. Authors who have more than 2 books in the catalog

## Evaluation — what a good solution looks like

- [ ] Query 1 uses JOIN correctly — all columns from multiple tables
- [ ] Query 2 uses LEFT JOIN to include authors with 0 books
- [ ] Query 3 uses AVG with GROUP BY
- [ ] Query 4 uses SUM + ORDER BY + LIMIT
- [ ] Query 5 uses LEFT JOIN + WHERE IS NULL or NOT IN / NOT EXISTS
- [ ] Query 6 joins three tables (books, sales, categories) to calculate revenue per category
- [ ] Query 7 uses HAVING to filter after GROUP BY

## Bonus (if done before time)

- Query 8: For each category, show the most expensive book and its author
- Query 9: Authors whose books have an average price above the overall average price
