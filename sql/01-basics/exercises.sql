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
