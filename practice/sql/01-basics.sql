-- ==================================
-- CREATE TABLES
-- ==================================

CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nationality VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS  books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  price NUMERIC(10,2),
  year INT,
  author_id INT REFERENCES authors(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR( 100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  country CHAR(2)

);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_books(
  order_id  INT REFERENCES orders(id),
  book_id  INT REFERENCES books(id)
);

-- ==================================
-- INSERT DATA
-- ==================================

-- Authors

INSERT INTO authors (name,nationality) VALUES ('Gabriel García Márquez', 'Colombian');
INSERT INTO authors (name,nationality) VALUES ('George Orwell', 'British');
INSERT INTO authors (name,nationality) VALUES ('Haruki Murakami','Japanese');

-- Books
INSERT INTO books (title,price,year,author_id) VALUES ('One Hundred Years of Solitude',12.99,1967,11);
INSERT INTO books (title,price,year,author_id) VALUES ('Love in the Time of Cholera',10.50,1985,11);
INSERT INTO books (title,price,year,author_id) VALUES ('1984',9.99,1949,12);
INSERT INTO books (title,price,year,author_id) VALUES ('Animal Farm',7.50,1945,12);
INSERT INTO books (title,price,year,author_id) VALUES ('Norwegian Wood',11.99,1987,13);
INSERT INTO books (title,price,year,author_id) VALUES ('Kafka on the Shore',13.50,2002,13);

-- Customers
INSERT INTO customers (name,email,country) VALUES ('Alice Johnson','alice@email.com','US');
INSERT INTO customers (name,email,country) VALUES ('Carlos Pérez','carlos@email.com','ES');
INSERT INTO customers (name,email,country) VALUES ('Emma Schmidt','emma@email.com','DE');

-- Orders
INSERT INTO orders (customer_id,created_at) VALUES (1,'2024-01-15 10:30:00');
INSERT INTO orders (customer_id,created_at) VALUES (2,'2024-03-22 14:00:00');
INSERT INTO orders (customer_id,created_at) VALUES (3,'2024-06-10 09:15:00');

-- Order_books
INSERT INTO order_books (order_id,book_id) VALUES (1,3);
INSERT INTO order_books (order_id,book_id) VALUES (1,5);
INSERT INTO order_books (order_id,book_id) VALUES (2,1);
INSERT INTO order_books (order_id,book_id) VALUES (2,4);
INSERT INTO order_books (order_id,book_id) VALUES (3,6);

-- ==================================
-- SELECT QUERIES
-- ==================================

-- #01 | SELECT — all columns
-- Get all books
SELECT * FROM books;

-- #02 | SELECT — specific columns
-- Get only the title and price of all books
SELECT title,price FROM books;

-- #03 | WHERE — comparison operator
-- Get all books that cost more than 10
SELECT * FROM books WHERE price>10;

-- #04 | ORDER BY — ASC
-- Get all books ordered by price from cheapest to most expensive
SELECT * FROM books ORDER BY price ASC;

-- #05 | ORDER BY + LIMIT
-- Get the 3 most expensive books
SELECT * FROM books ORDER BY price DESC LIMIT 3;

-- #06 | WHERE — AND
-- Get all books that cost more than 10 and were published after 1980
SELECT * FROM books WHERE price > 10 AND year > 1980;

-- #07 | WHERE — OR
-- Get all books where author_id is 11 or author_id is 12. Use OR, not IN.
SELECT * FROM books WHERE author_id = 11 OR author_id = 12;

-- #08 | WHERE — IN
-- Get all customers from Spain or Germany. Use IN.
SELECT * FROM customers WHERE country IN ('ES','DE');

-- #09 | WHERE — ILIKE
-- Get all books whose title contains the word the — case insensitive.
SELECT * FROM books WHERE title ILIKE '%the%';

-- #10 | WHERE — BETWEEN + ORDER BY
-- Get all books published between 1945 and 1987, ordered by year.
SELECT * FROM books WHERE year BETWEEN 1945 AND 1987 ORDER BY year;

-- #11 | SELECT DISTINCT
-- Get all unique nationalities from the authors table.
SELECT DISTINCT nationality from authors;

-- #12 | SELECT — expression + alias
-- Get all books showing the title and price, but also add a third column called price_with_tax that is the price multiplied by 1.21
SELECT title, price, price * 1.21 AS price_with_tax FROM books;

-- #13 | WHERE — NOT IN / not equal
-- Get all books that were NOT written by author_id 11.
SELECT * FROM books WHERE author_id NOT IN (11);
SELECT * FROM books WHERE author_id <> 11;

-- #14 | WHERE — BETWEEN + ORDER BY DESC
-- Get the title and price of all books that cost between 9 and 12, ordered from most expensive to cheapest.
SELECT title, price FROM books WHERE price BETWEEN 9 AND 12 ORDER BY price DESC;

-- #15 | WHERE — LIKE with OR
-- Get all authors whose name starts with 'G' or ends with 'i'.
SELECT * FROM authors WHERE name LIKE 'G%' OR name LIKE '%i';

-- #16 | ORDER BY + LIMIT / FETCH
-- Get the 2 most recently published books — show only the title and year.
SELECT title, year FROM books ORDER BY year DESC LIMIT 2;
SELECT title, year FROM books ORDER BY year DESC FETCH FIRST 2 ROWS ONLY;

-- #17 | SELECT — concatenation + alias
-- Get all authors showing a single column called author_info with the format: Name (Nationality). Example: George Orwell (British).
SELECT name ||' ('|| nationality ||')' AS author_info FROM authors;

-- #18 | DISTINCT ON
-- Get the cheapest book per author. Show author_id, title and price.
SELECT DISTINCT ON(author_id) author_id, title, price FROM books ORDER BY author_id, price ASC;

-- #19 | SELECT — LENGTH() + alias + ORDER BY alias
-- Get all books showing title and a column called title_length with the number of characters in the title. Order by title_length descending.
SELECT title, LENGTH(title) AS title_length FROM books ORDER BY title_length DESC;

-- #20 | LIMIT + OFFSET / FETCH + OFFSET
-- Get books ordered by price ascending. Skip the 2 cheapest and return the next 3.
SELECT * FROM books ORDER BY price ASC LIMIT 3 OFFSET 2;
SELECT * FROM books ORDER BY price ASC OFFSET 2 FETCH NEXT 3 ROWS ONLY;

-- ==================================
-- EXTRA EXERCISES
-- ==================================

-- #21 | SELECT — specific columns
-- Get the name and nationality of all authors.
SELECT name, nationality FROM authors; 

-- #22 | WHERE — less than
-- Get all books published before 1960. Show all columns.
SELECT * FROM books WHERE year < 1960;

-- #23 | WHERE — AND
-- Get all books by author_id 13 that cost more than 12.
SELECT * FROM books WHERE author_id = 13 AND price > 12;

-- #24 | ORDER BY — multiple columns
-- Get all books ordered by year ascending, then alphabetically by title within the same year. Show all columns.
SELECT * FROM books ORDER BY year,title;

-- #25 | ORDER BY + LIMIT
-- Get the 2 oldest books (earliest year). Show only title and year.
SELECT title,year FROM books ORDER BY year ASC LIMIT 2;

-- #26 | WHERE — OR with different fields
-- Get all books by author_id 11 or that cost less than 9. Use OR.
SELECT * FROM books WHERE author_id = 11 OR price < 9;

-- #27 | SELECT — expression + alias
-- Get all books showing title and a column called discounted_price that is the price minus 2. Order by discounted_price ascending.
SELECT title,price - 2 AS discounted_price FROM books ORDER BY discounted_price ASC;

-- #28 | WHERE — ILIKE
-- Get all books whose title starts with the letter "k". Case insensitive.
SELECT * FROM books WHERE title ILIKE 'k%';

-- #29 | SELECT DISTINCT
-- Get all unique countries from the customers table.
SELECT DISTINCT country FROM customers;

-- #30 | WHERE — NOT LIKE
-- Get all authors whose name does NOT start with "H".
SELECT * FROM authors WHERE name NOT LIKE 'H%';


-- #31 | SELECT — concatenation
-- Get all customers showing a single column called customer_info with the format: Alice Johnson — US. Use || to combine name, ' — ', and country.
SELECT name || ' — ' || country AS customer_info FROM customers;


-- #32 | WHERE — BETWEEN + ORDER BY
-- Get all books that cost between 10 and 13. Show only title and price, ordered by price ascending.
SELECT title, price FROM books WHERE price BETWEEN 10 AND 13 ORDER BY price ASC;

-- #33 | ORDER BY — multiple columns
-- Get all books ordered by author_id ascending, then by year ascending within the same author. Show title, author_id, and year.
SELECT title, author_id, year FROM books ORDER BY author_id ASC, year ASC;


-- #34 | LIMIT + OFFSET
-- Get books ordered by year ascending. Skip the 2 oldest and return the next 2.
SELECT * FROM books ORDER BY year ASC LIMIT 2 OFFSET 2;

-- #35 | SELECT — LENGTH() + WHERE
-- Get all books whose title has more than 15 characters. Show title and title length, ordered by length descending.
SELECT title, LENGTH(title) AS title_length FROM  books WHERE LENGTH(title) > 15 ORDER BY title_length DESC;

-- #36 | WHERE — IS NOT NULL
-- Get all books where the price is not null. Show only title and price.
SELECT title, price FROM books WHERE price IS NOT NULL;

-- #37 | WHERE — comparison on a different table
-- Get all orders placed after 2024-02-01. Show all columns.
SELECT * FROM orders WHERE created_at::date > '2024-02-01';

-- #38 | DISTINCT ON
-- Get the most recently published book per author. Show author_id, title, and year.
SELECT DISTINCT ON(author_id) author_id, title, year FROM books ORDER BY author_id, year DESC;

-- #39 | WHERE — NOT BETWEEN
-- Get all books NOT published between 1960 and 2000. Show title and year.
SELECT title, year FROM books WHERE year NOT BETWEEN 1960 and 2000;

-- #40 | SELECT — concatenation with numbers
-- Get all books showing a single column called book_summary with the format: 1984 — $9.99. Use || to combine title, ' — $', and price.
SELECT title || ' — $' || price AS  book_summary FROM books;