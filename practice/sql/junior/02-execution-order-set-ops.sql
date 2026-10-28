-- ================================================================
-- 02 — Execution order and set operations
-- Route: junior · Step 0 (Querying basics), file 2 of 2 · first-pass target 10
-- Focus: execution order and alias visibility, CASE WHEN in SELECT,
--        UNION / UNION ALL / INTERSECT / EXCEPT, NULLS FIRST / NULLS LAST,
--        non-deterministic LIMIT, stable ordering and OFFSET pagination
-- Generated: 2026-10-02
-- ================================================================

-- ================================================================
-- SETUP — Paste and run this section first in pgAdmin
-- FIRST: In pgAdmin, create a database called 'practice_junior_02_execution_order_set_ops' if you haven't already.
-- Open that database, then run this entire block inside it.
-- You can re-run it at any time to reset the data to its original state.
-- ================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- Create tables
CREATE TABLE authors (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  country    VARCHAR(50),
  birth_year INT
);

CREATE TABLE publishers (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  country VARCHAR(50)
);

CREATE TABLE genres (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE books (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  isbn           VARCHAR(20) UNIQUE,
  price          NUMERIC(8,2),
  published_year INT,
  stock          INT NOT NULL DEFAULT 0,
  author_id      INT REFERENCES authors(id),
  publisher_id   INT REFERENCES publishers(id),
  genre_id       INT REFERENCES genres(id)
);

CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  city        VARCHAR(50),
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  order_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'completed', 'cancelled'))
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT REFERENCES orders(id),
  book_id    INT REFERENCES books(id),
  quantity   INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(8,2) NOT NULL
);

CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  book_id     INT REFERENCES books(id),
  customer_id INT REFERENCES customers(id),
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO authors (name, country, birth_year) VALUES
  ('George Orwell',          'UK',       1903),
  ('Jane Austen',            'UK',       1775),
  ('Gabriel García Márquez', 'Colombia', 1927),
  ('Haruki Murakami',        'Japan',    1949),
  ('Isabel Allende',         'Chile',    1942),
  ('Carlos Ruiz Zafón',      'Spain',    1964),
  ('Toni Morrison',          'USA',      1931),
  ('Anonymous Collective',   NULL,       NULL),
  ('Elena Ferrante',         'Italy',    NULL),
  ('Lucia Berlin',           NULL,       1936);

INSERT INTO publishers (name, country) VALUES
  ('Penguin Random House', 'USA'),
  ('Planeta',              'Spain'),
  ('Faber & Faber',        'UK'),
  ('Suhrkamp',             'Germany');

INSERT INTO genres (name) VALUES
  ('Fiction'),
  ('Classic'),
  ('Magical Realism'),
  ('Dystopia'),
  ('Mystery'),
  ('Poetry');

INSERT INTO books (title, isbn, price, published_year, stock, author_id, publisher_id, genre_id) VALUES
  ('1984',                          '978-0451524935', 9.99,  1949, 12, 1,  1, 4),
  ('Animal Farm',                   '978-0451526342', 7.50,  1945, 0,  1,  3, 4),
  ('Pride and Prejudice',           '978-0141439518', 8.99,  1813, 20, 2,  3, 2),
  ('Emma',                          NULL,             9.99,  1815, 4,  2,  3, 2),
  ('One Hundred Years of Solitude', '978-0060883287', 14.99, 1967, 7,  3,  1, 3),
  ('Love in the Time of Cholera',   '978-0307389732', 12.99, 1985, 3,  3,  1, 3),
  ('Kafka on the Shore',            '978-1400079278', 12.99, 2002, 9,  4,  1, 1),
  ('Norwegian Wood',                '978-0375704024', 11.50, 1987, 0,  4,  1, 1),
  ('The House of the Spirits',      '978-1501117015', 12.99, 1982, 5,  5,  2, 3),
  ('The Shadow of the Wind',        '978-0143034902', 14.99, 2001, 15, 6,  2, 5),
  ('The Angel''s Game',             NULL,             NULL,  2008, 2,  6,  2, 5),
  ('Beloved',                       '978-1400033416', 13.50, 1987, 6,  7,  1, 1),
  ('Song of Solomon',               '978-1400033423', NULL,  1977, 1,  7,  1, 1),
  ('Collected Fragments',           NULL,             5.00,  NULL, 0,  8,  4, 1),
  ('My Brilliant Friend',           '978-1609450786', 12.99, 2011, 8,  9,  4, 1),
  ('A Manual for Cleaning Women',   '978-0374202347', 16.00, 2015, 3,  10, 1, 1),
  ('The Days of Abandonment',       NULL,             9.99,  2002, 0,  9,  4, 1),
  ('Homage to Catalonia',           '978-0156421171', NULL,  1938, 2,  1,  3, 2);

INSERT INTO customers (name, email, city, joined_date) VALUES
  ('Ana García',    'ana@mail.com',    'Madrid',    '2024-01-15'),
  ('Luis Pérez',    'luis@mail.com',   'Barcelona', '2024-02-03'),
  ('Marta López',   'marta@mail.com',  NULL,        '2024-03-10'),
  ('Javier Ruiz',   'javier@mail.com', 'Valencia',  '2024-03-22'),
  ('Sofía Martín',  'sofia@mail.com',  'Madrid',    '2024-05-01'),
  ('Pablo Sánchez', 'pablo@mail.com',  'Sevilla',   '2024-06-18'),
  ('Lucía Gómez',   'lucia@mail.com',  NULL,        '2024-07-07'),
  ('Diego Torres',  'diego@mail.com',  'Bilbao',    '2024-09-12'),
  ('Carmen Díaz',   'carmen@mail.com', 'Barcelona', '2024-10-30'),
  ('Raúl Navarro',  'raul@mail.com',   'Madrid',    '2025-01-05'),
  ('Elena Castro',  'elena@mail.com',  'Zaragoza',  '2025-02-14'),
  ('Hugo Molina',   'hugo@mail.com',   'Valencia',  '2025-03-01');

INSERT INTO orders (customer_id, order_date, status) VALUES
  (1,  '2025-01-10', 'completed'),
  (1,  '2025-02-14', 'completed'),
  (2,  '2025-02-20', 'cancelled'),
  (3,  '2025-03-05', 'completed'),
  (4,  '2025-03-18', 'pending'),
  (5,  '2025-04-02', 'completed'),
  (5,  '2025-04-25', 'cancelled'),
  (6,  '2025-05-11', 'completed'),
  (8,  '2025-06-01', 'pending'),
  (9,  '2025-06-15', 'completed'),
  (1,  '2025-07-03', 'pending'),
  (10, '2025-07-20', 'completed'),
  (2,  '2025-08-08', 'completed'),
  (11, '2025-08-30', 'cancelled');

INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES
  (1,  1,  1, 9.99),
  (1,  3,  2, 8.99),
  (2,  5,  1, 14.99),
  (3,  7,  1, 12.99),
  (3,  8,  1, 11.50),
  (4,  10, 1, 14.99),
  (4,  1,  1, 9.99),
  (5,  12, 2, 13.50),
  (6,  9,  1, 12.99),
  (6,  15, 1, 12.99),
  (6,  3,  1, 8.99),
  (7,  6,  1, 12.99),
  (8,  10, 2, 14.99),
  (9,  16, 1, 16.00),
  (10, 1,  3, 9.99),
  (10, 13, 1, 11.00),
  (11, 7,  1, 12.99),
  (12, 5,  1, 14.99),
  (12, 2,  2, 7.50),
  (13, 10, 1, 14.99),
  (13, 15, 1, 12.99),
  (14, 4,  1, 9.99);

INSERT INTO reviews (book_id, customer_id, rating, comment, reviewed_at) VALUES
  (1,  1,  5, 'A classic that still feels current', '2025-01-20 10:15:00'),
  (1,  4,  4, NULL,                                 '2025-03-12 18:40:00'),
  (1,  9,  5, 'Chilling',                           '2025-06-25 21:05:00'),
  (3,  1,  4, 'Witty and sharp',                    '2025-01-25 09:30:00'),
  (5,  1,  5, NULL,                                 '2025-02-28 22:10:00'),
  (5,  10, 3, 'Hard to follow the family tree',     '2025-08-01 12:00:00'),
  (10, 3,  5, 'Could not put it down',              '2025-03-20 16:45:00'),
  (10, 6,  4, NULL,                                 '2025-05-30 11:20:00'),
  (9,  5,  4, 'Beautiful prose',                    '2025-04-15 19:00:00'),
  (7,  2,  2, 'Too strange for me',                 '2025-03-01 08:55:00'),
  (16, 8,  5, 'Every story hits',                   '2025-06-20 14:30:00'),
  (12, 7,  3, NULL,                                 '2025-07-15 10:00:00');

-- ================================================================
-- EXERCISES: basics
-- ================================================================

-- Exercise 1 [Intro]: Price band with CASE WHEN ❌ Revisado 2026-10-27
-- For every book, return its title, its price, and a column price_band:
-- 'budget' under 10, 'standard' from 10 up to (not including) 15, 'premium' from 15 up.
-- A book with no price must be labelled 'unpriced' — it must never fall into another band.
-- Order by title.
-- Expected result shape: one row per book (18 rows) — title, price, price_band

-- Your answer:

SELECT title, price,
	CASE
    WHEN price IS NULL THEN 'unpriced'
    WHEN price < 10 THEN 'budget'
    WHEN price < 15 THEN 'standard'
  ELSE 'premium'
END AS price_band

FROM books ORDER BY title ASC;

-- Exercise 2 [Intro]: Every country, once ✅ Corregido 2026-10-27
-- List every country that appears either as an author's country or as a publisher's country.
-- Each country appears exactly once, and NULL is not a country — leave it out.
-- Order alphabetically.
-- Expected result shape: one column (country), one row per distinct country

-- Your answer:
SELECT country  FROM authors WHERE country IS NOT NULL
UNION 
SELECT country FROM publishers WHERE country IS NOT NULL
ORDER BY country ASC;

-- Exercise 3 [Intro]: Most expensive first, unpriced last ✅ Corregido 2026-10-27
-- Return title and price for every book, from most expensive to cheapest.
-- Books with no price go at the very end, not at the top.
-- Expected result shape: 18 rows — title, price; the 3 unpriced books are the last 3 rows

-- Your answer:
SELECT title, price FROM books ORDER BY price DESC NULLS LAST;

-- Exercise 4 [Standard]: The alias WHERE cannot see ✅ Corregido 2026-10-27
-- Return title, price, and price * 1.21 AS price_with_vat, only for books whose price_with_vat is above 15.
-- First, in a comment, write the query that filters on price_with_vat directly, and the exact error
-- PostgreSQL gives for it. Then write the version that runs.
-- Expected result shape: title, price, price_with_vat — only the books above 15 with VAT

-- Your answer:
-- SELECT title, price, price * 1.21 AS price_with_vat FROM books WHERE price_with_vat > 15;
-- ERROR:  column "price_with_vat" does not exist
-- LINE 1: ..., price * 1.21 AS price_with_vat FROM books WHERE price_with...

SELECT title, price, price * 1.21 AS price_with_vat FROM books WHERE price * 1.21 > 15;

-- Exercise 5 [Standard]: The alias ORDER BY can see ✅ Corregido 2026-10-27
-- From order_items, return id, order_id, and quantity * unit_price AS line_total,
-- ordered by line_total from highest to lowest (use the alias), then by id.
-- Above your query, in a comment, write the order in which PostgreSQL executes the clauses
-- (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT) and mark the step at which line_total starts to exist.
-- Expected result shape: one row per order item (22 rows) — id, order_id, line_total

-- Your answer:
-- Your answer:
-- The order is :
-- 1) FROM
-- 2) WHERE
-- 3) GROUP BY
-- 4) HAVING
-- 5) SELECT ( IN THIS STEP line_total starts)
-- 6) ORDER BY
-- 7) LIMIT
SELECT id, order_id, quantity * unit_price AS line_total FROM order_items ORDER BY line_total DESC, id;

-- Exercise 6 [Standard]: Reviewed, never ordered ✅ Corregido 2026-10-27
-- Return the ids of customers who wrote at least one review but never placed an order.
-- Use a set operation, not a JOIN and not a subquery.
-- Expected result shape: one column (customer_id)

-- Your answer:
SELECT DISTINCT customer_id FROM reviews 
EXCEPT
SELECT customer_id FROM orders;

-- Exercise 7 [Standard]: The four cheapest — the same four every time ✅ Corregido 2026-10-27
-- Return id, title and price of the 4 cheapest books that have a price.
-- Several books share the same price, so ORDER BY price LIMIT 4 alone can hand back a different
-- 4th row on another run. Write the version that always returns the same four rows.
-- Expected result shape: exactly 4 rows — id, title, price

-- Your answer:
SELECT id, title, price FROM books WHERE price IS NOT NULL ORDER BY price, id LIMIT 4;

-- Exercise 8 [Standard]: Catalogue page 3 ✅ Corregido 2026-10-27
-- The shop's catalogue shows 5 books per page, sorted by price from highest to lowest
-- (unpriced books at the end), and a book must never move between pages when prices tie.
-- Return page 3 of that catalogue: id, title, price.
-- Expected result shape: exactly 5 rows — positions 11 to 15 of the full sorted list

-- Your answer:
SELECT id, title, price FROM books ORDER BY price DESC NULLS LAST, id LIMIT 5 OFFSET 10;

-- Exercise 9 [Challenge]: Where do authors and publishers meet? ✅ Corregido 2026-10-27
-- Return one row per country (NULL excluded) that has authors, publishers, or both, with a column
-- presence: 'authors and publishers', 'authors only' or 'publishers only'.
-- Use only set operations — no JOIN, no subquery, no CASE.
-- Order by presence, then country.
-- Expected result shape: two columns (country, presence), one row per country

-- Your answer:
(SELECT country, 'authors and publishers' AS presence FROM authors WHERE country IS NOT NULL
INTERSECT
SELECT country,'authors and publishers' AS presence FROM publishers WHERE country IS NOT NULL)
UNION
(SELECT country, 'authors only' AS presence FROM authors WHERE country IS NOT NULL
EXCEPT
SELECT country,'authors only' AS presence FROM publishers WHERE country IS NOT NULL)
UNION
(SELECT country, 'publishers only' AS presence FROM publishers WHERE country IS NOT NULL
EXCEPT
SELECT country,'publishers only' AS presence FROM authors WHERE country IS NOT NULL)
ORDER BY presence, country;

-- Why I chose this approach (one line — e.g. "LEFT JOIN keeps authors with zero books; INNER would drop them"):
-- INTERSECT keeps the countries found in both tables, each EXCEPT keeps the countries of one table that are missing from the other, and UNION stacks the three labelled groups before one final ORDER BY.

-- Exercise 10 [Challenge]: Customer activity timeline ✅ Corregido 2026-10-27
-- Build one timeline of customer activity, stacking orders and reviews into a single result with
-- three columns: customer_id, activity_at, activity.
-- For an order, activity is 'purchase' (completed), 'pending order' (pending) or 'cancelled order' (cancelled).
-- For a review, activity is 'positive review' (rating 4 or 5) or 'critical review' (rating 1 to 3).
-- Every order and every review appears once — none may be lost, even if two rows look identical.
-- Order the whole timeline by customer_id, then activity_at, then activity.
-- Expected result shape: 26 rows (14 orders + 12 reviews) — customer_id, activity_at, activity

-- Your answer:
(SELECT customer_id, order_date AS activity_at, 
  CASE
    WHEN status = 'completed' THEN 'purchase'
    WHEN status = 'pending' THEN 'pending order'
    WHEN status = 'cancelled' THEN 'cancelled order'
  END AS activity
FROM orders)
UNION ALL
(SELECT customer_id, reviewed_at AS activity_at,
  CASE
    WHEN rating >= 4 THEN 'positive review'
    WHEN rating < 4 THEN 'critical review'
  END AS activity
FROM reviews)
ORDER BY customer_id, activity_at, activity;

-- Why I chose this approach (one line — e.g. "LEFT JOIN keeps authors with zero books; INNER would drop them"):
-- UNION ALL stacks both queries without removing duplicates, so no order or review is lost (UNION would drop identical rows), and a CASE WHEN in each branch maps status and rating to the activity labels.

