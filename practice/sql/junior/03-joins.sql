-- ================================================================
-- 03 — JOINs
-- Route: junior · Step 1 (JOINs), run 1 of 2 (#01–#11) · first-pass target 22
-- Focus: INNER JOIN across two and three tables, table aliases, LEFT JOIN keeping
--        unmatched rows, LEFT JOIN + IS NULL as an anti-join, qualified column
--        references, named columns instead of SELECT * across joined tables
-- Generated: 2026-11-04
-- ================================================================

-- ================================================================
-- SETUP — Paste and run this section first in pgAdmin
-- FIRST: In pgAdmin, create a database called 'practice_junior_03_joins' if you haven't already.
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
-- Edge cases for this topic: two authors with no books (ids 11, 12), a book with no author
-- and no genre (id 19), five books never ordered, two customers with no orders (ids 7, 12),
-- an order with no lines (id 15) and a genre with no books (Poetry).
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
  ('Lucia Berlin',           NULL,       1936),
  ('Clarice Lispector',      'Brazil',   1920),
  ('Wisława Szymborska',     'Poland',   1923);

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
  ('1984',                          '978-0451524935', 9.99,  1949, 12, 1,    1, 4),
  ('Animal Farm',                   '978-0451526342', 7.50,  1945, 0,  1,    3, 4),
  ('Pride and Prejudice',           '978-0141439518', 8.99,  1813, 20, 2,    3, 2),
  ('Emma',                          NULL,             9.99,  1815, 4,  2,    3, 2),
  ('One Hundred Years of Solitude', '978-0060883287', 14.99, 1967, 7,  3,    1, 3),
  ('Love in the Time of Cholera',   '978-0307389732', 12.99, 1985, 3,  3,    1, 3),
  ('Kafka on the Shore',            '978-1400079278', 12.99, 2002, 9,  4,    1, 1),
  ('Norwegian Wood',                '978-0375704024', 11.50, 1987, 0,  4,    1, 1),
  ('The House of the Spirits',      '978-1501117015', 12.99, 1982, 5,  5,    2, 3),
  ('The Shadow of the Wind',        '978-0143034902', 14.99, 2001, 15, 6,    2, 5),
  ('The Angel''s Game',             NULL,             NULL,  2008, 2,  6,    2, 5),
  ('Beloved',                       '978-1400033416', 13.50, 1987, 6,  7,    1, 1),
  ('Song of Solomon',               '978-1400033423', NULL,  1977, 1,  7,    1, 1),
  ('Collected Fragments',           NULL,             5.00,  NULL, 0,  8,    4, 1),
  ('My Brilliant Friend',           '978-1609450786', 12.99, 2011, 8,  9,    4, 1),
  ('A Manual for Cleaning Women',   '978-0374202347', 16.00, 2015, 3,  10,   1, 1),
  ('The Days of Abandonment',       NULL,             9.99,  2002, 0,  9,    4, 1),
  ('Homage to Catalonia',           '978-0156421171', NULL,  1938, 2,  1,    3, 2),
  ('Tales Without a Name',          NULL,             6.50,  2019, 4,  NULL, 4, NULL);

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
  (11, '2025-08-30', 'cancelled'),
  (3,  '2025-09-02', 'pending');

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
-- EXERCISES: joins
-- ================================================================

-- Exercise 1 [Intro]: Books and their authors
-- Return the title of every book together with the name of its author.
-- Use JOIN ... ON with the foreign key books.author_id. Name the columns — no SELECT *.
-- Order by title.
-- Expected result shape: one row per book that has an author (18 rows) — title, author name

-- Your answer:
SELECT books.title, authors.name
FROM books
JOIN authors ON books.author_id = authors.id
ORDER BY books.title;


-- Exercise 2 [Intro]: Short names for long tables
-- Return each book's title and the name of its publisher.
-- Give books the alias b and publishers the alias p, and use those aliases in every column
-- reference and in the ON condition.
-- Order by publisher name, then title.
-- Expected result shape: one row per book (19 rows) — title, publisher name

-- Your answer:
SELECT b.title, p.name
FROM books b
JOIN publishers p ON b.publisher_id = p.id
ORDER BY p.name, b.title;


-- Exercise 3 [Intro]: Every author, with or without books
-- Return every author's name and the title of each of their books.
-- An author with no books must still appear once, with NULL in the title column.
-- Order by author name, then title.
-- Expected result shape: one row per (author, book) pair plus one row per author with no books (20 rows)

-- Your answer:
SELECT a.name, b.title
FROM authors a
LEFT JOIN books b ON a.id = b.author_id
ORDER BY a.name, b.title;

-- Exercise 4 [Standard]: Title, author and genre in one row
-- For every book, return its title, its author's name in a column called author, and its genre's
-- name in a column called genre. authors and genres both have a column called name — the query
-- must make clear which one each output column comes from.
-- Order by genre, then title.
-- Expected result shape: one row per book that has both an author and a genre (18 rows) — title, author, genre

-- Your answer:
SELECT  b.title, a.name AS author, g.name AS genre
FROM books b
JOIN authors a ON b.author_id = a.id
JOIN genres g ON b.genre_id = g.id
ORDER BY g.name, b.title;

-- Exercise 5 [Standard]: Latest completed orders
-- Return the five most recent completed orders: order id, order date and the name of the customer
-- who placed it.
-- Order by order date, newest first.
-- Then answer in a comment: which runs first, the JOIN or the WHERE — and why does that let your
-- WHERE filter on a column of either table?
-- Expected result shape: 5 rows — order id, order_date, customer name

-- Your answer:
SELECT o.id, o.order_date, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'completed'
ORDER BY o.order_date DESC LIMIT 5;

-- primero se ejecuta el JOIN y despues el WHERE. EL FROM  con el join crean una primera tabla que contiene
-- las columnas de ambas tablas, por lo que cuando se ejecuta el where ya puede usar la columna de cualquiera
-- de las tablas

-- Exercise 6 [Standard]: What Ana García bought
-- Return every book Ana García has ordered: the order date, the book title and the quantity.
-- Follow the relationship from customers to books through orders and order_items; each ON condition
-- must link one table to the next by its key.
-- Order by order date, then title.
-- Expected result shape: one row per order line of hers (4 rows) — order_date, title, quantity

-- Your answer:


-- Exercise 7 [Standard]: Customers and their orders — nobody left out
-- Return every customer's name with the id and date of each of their orders.
-- Customers who have never placed an order must still appear, with NULL in the order columns.
-- Order by customer name, then order date.
-- Then answer in a comment: if you swapped your join for an INNER JOIN, which customers would
-- disappear, and why?
-- Expected result shape: one row per order plus one row per customer with no orders (17 rows)

-- Your answer:


-- Exercise 8 [Standard]: Customers who never ordered
-- Return the name and email of every customer who has never placed an order.
-- Use a LEFT JOIN and filter for the rows that found no match.
-- Order by name.
-- Expected result shape: 2 rows — name, email

-- Your answer:


-- Exercise 9 [Standard]: Rewrite the SELECT *
-- A colleague wrote this query for a "book card" in the app:
--   SELECT * FROM books b JOIN authors a ON b.author_id = a.id;
-- Rewrite it so it returns only the title, the price and the author's name (as author).
-- Then answer in a comment: name two problems the SELECT * version causes in application code
-- (look at the column names it returns, and think about what happens when the schema changes).
-- Expected result shape: one row per book that has an author (18 rows) — title, price, author

-- Your answer:


-- Exercise 10 [Challenge]: Books nobody has ordered
-- Return every book that has never appeared in any order: its title, its price and its author's name.
-- A book with no author must still be listed, with NULL as the author.
-- Order by title.
-- Expected result shape: one row per never-ordered book (5 rows) — title, price, author

-- Your answer:


-- Why I chose this approach (one line — e.g. "LEFT JOIN keeps authors with zero books; INNER would drop them"):


-- Exercise 11 [Challenge]: Home-country editions
-- Return the books whose author and publisher come from the same country: the book title, the
-- author's name, the publisher's name and that shared country.
-- authors and publishers both have id, name and country — every reference to one of those columns
-- must say which table it belongs to, and the output columns must have unambiguous names.
-- Order by country, then title.
-- Expected result shape: 8 rows — title, author, publisher, country

-- Your answer:


-- Why I chose this approach (one line — e.g. "LEFT JOIN keeps authors with zero books; INNER would drop them"):

