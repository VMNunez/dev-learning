-- ================================================================
-- 02 — Querying basics, part 2
-- Execution order · alias visibility · CASE WHEN · set operations ·
-- NULLS FIRST/LAST · deterministic LIMIT · keyset pagination
--
-- Belongs to PLANNING.md Step 0 (second half). Uses the CANONICAL
-- bookstore schema — not the thinner schema of 01-basics.sql.
-- ================================================================

-- ================================================================
-- SETUP — Paste and run this section first in pgAdmin
-- FIRST: in pgAdmin, create a database called 'bookstore' if you haven't already.
-- Open that database, then run this entire block inside it.
-- You can re-run it at any time to reset the data to its original state.
-- ================================================================

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS order_books CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50),
  birth_year INT
);

CREATE TABLE publishers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50)
);

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  price NUMERIC(8,2),
  published_year INT,
  stock INT NOT NULL DEFAULT 0,
  author_id INT REFERENCES authors(id),
  publisher_id INT REFERENCES publishers(id),
  genre_id INT REFERENCES genres(id)
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(50),
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'cancelled'))
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  book_id INT REFERENCES books(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(8,2) NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id),
  customer_id INT REFERENCES customers(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO authors (name, country, birth_year) VALUES
  ('Gabriel Garcia Marquez', 'Colombia', 1927),
  ('George Orwell', 'United Kingdom', 1903),
  ('Haruki Murakami', 'Japan', 1949),
  ('Isabel Allende', 'Chile', 1942),
  ('Kazuo Ishiguro', 'United Kingdom', 1954),
  ('Anonymous Scribe', NULL, NULL),
  ('Elena Ferrante', NULL, 1943),
  ('Yukio Mishima', 'Japan', NULL);

INSERT INTO publishers (name, country) VALUES
  ('Penguin Books', 'United Kingdom'),
  ('Anagrama', 'Spain'),
  ('Shinchosha', 'Japan');

INSERT INTO genres (name) VALUES
  ('Fiction'), ('Dystopia'), ('Magical Realism'), ('Essay'), ('Poetry');

INSERT INTO books (title, isbn, price, published_year, stock, author_id, publisher_id, genre_id) VALUES
  ('One Hundred Years of Solitude', '978-0060883287', 12.99, 1967, 12, 1, 2, 3),
  ('Love in the Time of Cholera',   '978-0307389732', 10.50, 1985,  5, 1, 2, 3),
  ('1984',                          '978-0451524935',  9.99, 1949, 30, 2, 1, 2),
  ('Animal Farm',                   '978-0451526342',  7.50, 1945, 25, 2, 1, 2),
  ('Norwegian Wood',                '978-0375704024', 11.99, 1987,  8, 3, 3, 1),
  ('Kafka on the Shore',            '978-1400079278', 13.50, 2002,  0, 3, 3, 1),
  ('The House of the Spirits',      '978-0553383805', 14.00, 1982,  6, 4, 2, 3),
  ('The Remains of the Day',        '978-0679731726', 11.25, 1989,  4, 5, 1, 1),
  ('Never Let Me Go',               '978-1400078776', 12.75, 2005,  9, 5, 1, 1),
  ('My Brilliant Friend',           '978-1609450786', 13.99, 2011,  7, 7, 2, 1),
  ('The Sound of the Mountain',     NULL,             15.50, 1954,  2, 8, 3, 1),
  ('Confessions of a Mask',         NULL,              NULL, 1949,  3, 8, 3, 1),
  ('Old Manuscript Fragments',      NULL,              NULL, NULL,  1, 6, NULL, 5),
  ('Collected Essays',              '978-1111111111',  8.25, 1996,  0, 2, 1, 4),
  ('Selected Poems',                '978-2222222222',  6.99, 1978, 11, 7, 2, 5);

INSERT INTO customers (name, email, city, joined_date) VALUES
  ('Alice Johnson',   'alice@email.com',  'New York',  '2023-01-10'),
  ('Carlos Perez',    'carlos@email.com', 'Madrid',    '2023-02-14'),
  ('Emma Schmidt',    'emma@email.com',   'Berlin',    '2023-03-02'),
  ('Yuki Tanaka',     'yuki@email.com',   'Tokyo',     '2023-05-20'),
  ('Marta Ruiz',      'marta@email.com',  'Madrid',    '2023-06-11'),
  ('John Smith',      'john@email.com',   NULL,        '2023-07-01'),
  ('Lucia Fernandez', 'lucia@email.com',  'Barcelona', '2023-08-19'),
  ('Peter Novak',     'peter@email.com',  NULL,        '2023-09-05'),
  ('Sofia Rossi',     'sofia@email.com',  'Rome',      '2024-01-08'),
  ('Ana Gomez',       'ana@email.com',    'Madrid',    '2024-02-27');

INSERT INTO orders (customer_id, order_date, status) VALUES
  (1,  '2024-01-15', 'completed'),
  (1,  '2024-02-20', 'pending'),
  (2,  '2024-03-22', 'completed'),
  (3,  '2024-06-10', 'cancelled'),
  (4,  '2024-04-05', 'completed'),
  (5,  '2024-04-18', 'pending'),
  (5,  '2024-05-30', 'completed'),
  (7,  '2024-06-14', 'completed'),
  (7,  '2024-07-01', 'cancelled'),
  (9,  '2024-07-19', 'pending'),
  (10, '2024-08-03', 'completed'),
  (10, '2024-09-12', 'completed');

INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES
  (1, 3, 1,  9.99), (1, 5, 2, 11.99), (2, 1, 1, 12.99),
  (3, 4, 3,  7.50), (3, 6, 1, 13.50), (4, 7, 1, 14.00),
  (5, 8, 2, 11.25), (5, 9, 1, 12.75), (6, 10, 1, 13.99),
  (7, 1, 1, 12.99), (7, 3, 4,  9.99), (8, 15, 2,  6.99),
  (8, 14, 1,  8.25), (9, 11, 1, 15.50), (10, 2, 1, 10.50),
  (10, 5, 1, 11.99), (11, 3, 2,  9.99), (11, 7, 1, 14.00),
  (12, 9, 3, 12.75), (12, 10, 1, 13.99);

INSERT INTO reviews (book_id, customer_id, rating, comment, reviewed_at) VALUES
  (3,  1,  5, 'A masterpiece.',     '2024-01-20 10:00:00'),
  (3,  2,  4, NULL,                 '2024-03-25 12:30:00'),
  (3,  5,  5, 'Read it twice.',     '2024-06-02 09:00:00'),
  (1,  1,  5, 'Unforgettable.',     '2024-02-25 18:45:00'),
  (1,  7,  3, NULL,                 '2024-06-20 11:10:00'),
  (5,  4,  4, 'Melancholic.',       '2024-04-10 20:00:00'),
  (7,  3,  2, 'Not for me.',        '2024-06-15 08:20:00'),
  (9,  10, 5, 'Devastating.',       '2024-09-20 16:00:00'),
  (10, 5,  4, NULL,                 '2024-05-31 14:00:00'),
  (15, 7,  3, 'Uneven collection.', '2024-06-18 19:30:00');

-- ================================================================
-- EXERCISES: basics, part 2
-- ================================================================

-- Exercise 1 [Intro]: CASE WHEN — labelling a row
-- List every book with its title, price, and a third column called price_label
-- that reads 'cheap' when the price is under 10, 'standard' when it is under 14,
-- and 'expensive' otherwise.
-- Expected result shape: one row per book, three columns.

-- Your answer:


-- Exercise 2 [Intro]: ORDER BY — NULLS LAST
-- List title and price of every book, most expensive first, but with the books
-- that have no price at the very bottom instead of at the top.
-- Expected result shape: one row per book, prices descending, NULLs last.

-- Your answer:


-- Exercise 3 [Intro]: UNION vs UNION ALL
-- Return one single column called country listing the countries of the authors
-- and the countries of the publishers together, with no duplicates.
-- Then write, below it, the version that keeps the duplicates, and note in a
-- comment how many rows each one returned.
-- Expected result shape: one column, one row per country.

-- Your answer:


-- Exercise 4 [Standard]: Alias visibility — ORDER BY
-- List title and a column called final_price that is price multiplied by 1.21,
-- ordered by final_price descending. Order by the ALIAS, not by the expression.
-- Then answer in a comment: why does the alias work in ORDER BY?
-- Expected result shape: one row per book, two columns.

-- Your answer:


-- Exercise 5 [Standard]: Alias visibility — WHERE
-- Take the query from exercise 4 and try to filter it with WHERE final_price > 15.
-- Run it. Copy the exact error message PostgreSQL returns into a comment, then
-- write the version that works, and explain in one line why WHERE cannot see the
-- alias but ORDER BY can.
-- Expected result shape: the failing query (commented out), the error text, and the working query.

-- Your answer:


-- Exercise 6 [Standard]: INTERSECT
-- Return the cities that appear both among customers who joined in 2023 and
-- among customers who have at least one order. Use INTERSECT — not a JOIN.
-- Expected result shape: one column, one row per city.

-- Your answer:


-- Exercise 7 [Standard]: EXCEPT
-- Return the ids of every book that has never been sold: all book ids, minus the
-- book ids that appear in order_items. Use EXCEPT.
-- Expected result shape: one column, one row per unsold book.

-- Your answer:


-- Exercise 8 [Standard]: LIMIT without ORDER BY
-- Write SELECT title FROM books LIMIT 3; and run it a few times.
-- Then write the deterministic version of "any 3 books", and explain in a comment
-- why the first one is unsafe in production even if it looks stable on your machine.
-- Expected result shape: both queries plus the explanation.

-- Your answer:


-- Exercise 9 [Challenge]: Deep OFFSET vs keyset pagination
-- Page through books ordered by id ascending, 5 rows per page, and return page 3
-- (rows 11 to 15) in two different ways:
--   (a) with LIMIT and OFFSET
--   (b) with keyset pagination — no OFFSET, filtering on the last id of the previous page
-- Expected result shape: two queries returning the same rows.

-- Your answer:


-- Why I chose this approach (one line — e.g. "keyset filters on an indexed id instead of reading and discarding 10 rows"):


-- Exercise 10 [Challenge]: Execution order end to end
-- Return one row per order with these columns: order_id, order_date, and a column
-- called size_label that reads 'big' when the order has 3 or more items and 'small'
-- otherwise. Keep only orders whose status is 'completed'. Sort so that 'big' orders
-- come first, then by order_date descending. Return only the first 5 rows.
-- Then, in a comment, list the clauses of your query in the order PostgreSQL actually
-- executes them, and say at which point size_label comes into existence.
-- Expected result shape: at most 5 rows, three columns.

-- Your answer:


-- Why I chose this approach (one line):
