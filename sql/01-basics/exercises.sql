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
-- Get all books
SELECT * FROM books;
-- Get only the title and price of all books
SELECT title,price FROM books;
-- Get all books that cost more than 10
SELECT * FROM books WHERE price>10; 
-- Get all books ordered by price from cheapest to most expensive
SELECT * FROM books ORDER BY price ASC;
-- Get the 3 most expensive books
SELECT * FROM books ORDER BY price DESC LIMIT 3;
-- Get all books that cost more than 10 and were published after 1980.
SELECT * FROM books WHERE price > 10 AND year > 1980;
-- Get all books where author_id is 11 or author_id is 12. Use OR, not IN.
SELECT * FROM books WHERE author_id = 11 OR author_id = 12;
-- Get all customers from Spain or Germany. Use IN.
SELECT * FROM customers WHERE country IN ('ES','DE');
-- Get all books whose title contains the word the — case insensitive.
SELECT * FROM books WHERE title ILIKE '%the%';
-- Get all books published between 1945 and 1987, ordered by year.
SELECT * FROM books WHERE year BETWEEN 1945 AND 1987 ORDER BY year;