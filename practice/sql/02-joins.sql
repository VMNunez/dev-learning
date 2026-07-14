-- ==================================
-- 02 — JOINs
-- Bookstore database
-- ==================================

-- #01 | INNER JOIN — two tables
-- Get the title of each book and the name of its author.

-- #02 | INNER JOIN — specific columns
-- Get the title of each book and the nationality of its author. Show only those two columns.

-- #03 | INNER JOIN — with table aliases
-- Same as #02 but use table aliases (b for books, a for authors).

-- #04 | LEFT JOIN — all books
-- Get all books and their author name. Include books that have no matching author.

-- #05 | INNER JOIN — three tables
-- Get the name of each customer and the title of the books they ordered.
-- Tables needed: customers → orders → order_books → books

-- #06 | INNER JOIN — with WHERE
-- Get all books ordered by customers from Spain (country = 'ES'). Show customer name and book title.

-- #07 | LEFT JOIN — find unmatched rows
-- Get all authors who have no books in the database. Show only the author name.
-- Hint: use LEFT JOIN + WHERE b.id IS NULL

-- #08 | INNER JOIN — with ORDER BY
-- Get all books with their author name, ordered alphabetically by author name then by book title.

-- #09 | INNER JOIN — with ORDER BY + LIMIT
-- Get the 3 most expensive books with their author name. Show title, price, and author name.

-- #10 | INNER JOIN — count per group (preview of aggregates)
-- Get each author's name and how many books they have. Show author name and a column called book_count.
-- Hint: use COUNT(*) and GROUP BY
