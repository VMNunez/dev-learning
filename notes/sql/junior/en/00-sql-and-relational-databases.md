## Index of this note

- [SQL and relational databases](#sql-and-relational-databases)

1. [What a relational database solves that objects in memory cannot](#what-a-relational-database-solves-that-objects-in-memory-cannot)
   - [Three things an array in one process cannot do](#three-things-an-array-in-one-process-cannot-do)
   - [A database server is a separate program that owns the data](#a-database-server-is-a-separate-program-that-owns-the-data)
2. [SQL, PostgreSQL, database, schema, table, row and column](#sql-postgresql-database-schema-table-row-and-column)
   - [SQL is the language and PostgreSQL is the program](#sql-is-the-language-and-postgresql-is-the-program)
   - [Database, schema and table, from the outside in](#database-schema-and-table-from-the-outside-in)
   - [Table, row and column](#table-row-and-column)
   - [What relational means](#what-relational-means)
   - [The two meanings of schema](#the-two-meanings-of-schema)
3. [Running statements in pgAdmin](#running-statements-in-pgadmin)
   - [pgAdmin is the client and the local PostgreSQL server holds the databases](#pgadmin-is-the-client-and-the-local-postgresql-server-holds-the-databases)
   - [Creating the practice database `practice_junior_notes`](#creating-the-practice-database-practice_junior_notes)
   - [Seeding the practice database](#seeding-the-practice-database)
   - [Evaluating an expression with `SELECT`](#evaluating-an-expression-with-select)
   - [What a rejected statement looks like](#what-a-rejected-statement-looks-like)
   - [Reading one column definition inside `CREATE TABLE`](#reading-one-column-definition-inside-create-table)
4. [Declarative means you describe the result and PostgreSQL plans the work](#declarative-means-you-describe-the-result-and-postgresql-plans-the-work)
   - [The same question in JavaScript and in SQL](#the-same-question-in-javascript-and-in-sql)
   - [How PostgreSQL turns the statement into an execution plan](#how-postgresql-turns-the-statement-into-an-execution-plan)
   - [What the planner changes in how you write SQL](#what-the-planner-changes-in-how-you-write-sql)
5. [A result is an unordered set of rows](#a-result-is-an-unordered-set-of-rows)
6. [NULL marks a missing value](#null-marks-a-missing-value)
7. [The database enforces the rules you declare](#the-database-enforces-the-rules-you-declare)
8. [Where SQL sits between Angular, Spring Boot and PostgreSQL](#where-sql-sits-between-angular-spring-boot-and-postgresql)
9. [The route from chapter 01 to chapter 16](#the-route-from-chapter-01-to-chapter-16)

# SQL and relational databases

Docs: https://www.postgresql.org/docs/current/tutorial.html → read: "Part I. Tutorial", chapters 1 and 2 — the official walk-through from an empty server to a first query

Every application you have built keeps its data somewhere. In project 03 that place was an array of transactions inside an Angular service, copied into the browser's `localStorage` as JSON. That is enough while one person uses one browser. It stops being enough when the data has to survive a restart, be shared by many users at the same time, and stay correct whichever program writes to it. A relational database server is the program built for those three requirements, and SQL is the language you use to talk to it.

This introduction does not teach SQL syntax in depth. It gives you the picture that the sixteen chapters after it fill in, and it leaves you able to run a statement before chapter 01 asks you to.

The note has nine sections, and each one needs the one before it. It starts with the problem: what an array of objects in one program cannot do, and what kind of program solves it. Next comes the vocabulary (SQL, PostgreSQL, database, schema, table, row, column), because every later sentence uses those seven words. With the words in place, the third section has you create the practice database and run your first statements in pgAdmin, so that everything after it is something you can execute and not only read. After that comes the idea the whole topic rests on: SQL is declarative, which means that you describe the result and PostgreSQL decides the steps. The three sections that follow take one trait each: a result has no order, NULL marks a missing value, and the database enforces the rules you declare. Each of those three is explained with the vocabulary and the model that came before it, and each one comes back in every later chapter. Then the note places SQL in your stack, between Angular, Spring Boot and PostgreSQL. It closes with the route: what each chapter from 01 to 16 adds, and why they come in that order.

## What a relational database solves that objects in memory cannot

Docs: https://www.postgresql.org/docs/current/tutorial-arch.html → read: "Architectural Fundamentals" — the server process, the client applications and the connections between them

Take a small bookstore. In JavaScript you would model its catalogue as an array of objects:

```js
const books = [
  { title: '1984', price: 9.99, stock: 12 },
  { title: 'Animal Farm', price: 7.5, stock: 0 },
  { title: 'Emma', price: 9.99, stock: 4 },
];
```

This array lives in the memory of one running program. A running program is called a **process**, and the memory it uses belongs to it alone. That single fact causes three problems.

### Three things an array in one process cannot do

**The data disappears when the process ends.** When the Node server restarts, or the browser tab closes, the array is gone, and so is every sale recorded since the program started. Keeping data after the program that created it has stopped is called **persistence**, and an array has none.

**Several programs cannot share it safely.** A second process has its own memory and therefore its own copy of the array. That second process can be another running copy of the same server, a reporting script, or the application on a colleague's machine. A sale recorded in one copy is invisible in the other. Putting the data in a place both can reach, such as a file, removes that problem and creates a worse one. Suppose the shop is down to its last copy of _Emma_ and two customers buy it in the same second:

1. Request A reads the stock: `1`.
2. Request B reads the stock: `1`.
3. Request A writes the stock as `0` and confirms the sale.
4. Request B writes the stock as `0` and confirms the sale.

Two sales were confirmed and one book existed. Neither request did anything wrong on its own. The error comes from steps 1 and 2 happening before step 3: both requests decided with a number that was about to change.

**Nothing checks what goes in.** `books.push({ title: null, price: -5 })` succeeds. A TypeScript type would reject that line in your own code, but types are erased when TypeScript is compiled to JavaScript. At runtime, nothing checks the data that arrives in a request or that another program writes.

> **Why not save the array to a JSON file?** A file gives you persistence and nothing else. Two processes that write the same file overwrite each other's changes, exactly as in the four steps above. To find one book, the program has to read and parse the whole file. And the file still accepts any content. You would end up writing by hand the program that the next section describes.

### A database server is a separate program that owns the data

A **database server** is a program that runs on its own, separately from your application, and does four jobs:

1. It stores the data in files on disk, so the data survives any restart, including its own.
2. It accepts **connections** from many programs at the same time. A connection is an open channel through which one program sends requests and receives answers. Each program that connects is called a **client**.
3. It coordinates the clients that change the same data at once. Two changes to the same piece of data are never applied at the same moment: the second one waits until the first has finished, and it then finds the data as the first change left it. In the example of the last copy, the second request finds a stock of `0`, so its sale can be refused.
4. It checks every change against rules that were declared in advance, and it rejects the changes that break them.

```
pgAdmin ───────────────┐
your Spring Boot app ──┼──►  PostgreSQL server ──►  files on disk
a reporting script ────┘     (the only program that
                              reads and writes those files)
```

"Server" names the role of the program, not a machine. The PostgreSQL server you will use runs on your own computer, next to its clients. In a company it runs on another machine and the clients reach it over the network. Nothing else changes.

No client ever opens the data files. Each client sends a request written in SQL, and the server answers it. That is why the four jobs can be guaranteed: every read and every write goes through one program.

Jobs 1 and 2 ask nothing of you. Job 3 is the subject of [09-transactions.md](09-transactions.md), which teaches how several changes are grouped so that they succeed or fail together, and how the server keeps simultaneous clients from interfering with each other. Job 4 is one of the three traits this note covers, in the section [The database enforces the rules you declare](#the-database-enforces-the-rules-you-declare).

One word of the title is still undefined: **relational**. It describes how this kind of server organises its data, and the next section defines it together with the rest of the vocabulary.

## SQL, PostgreSQL, database, schema, table, row and column

Docs: https://www.postgresql.org/docs/current/tutorial-concepts.html → read: "Concepts" — three paragraphs that define relation, table, row, column and database

These seven words are easy to blur. People say "the database" when they mean the PostgreSQL program, and they use "the schema" for two different things. This section fixes one meaning for each word.

### SQL is the language and PostgreSQL is the program

**SQL** (Structured Query Language) is a language: a set of words and grammar rules for writing requests to a database server. One complete request is called a **statement**, for example `SELECT title FROM books;`. A statement that asks for data is also called a **query**.

**PostgreSQL** is a program: one particular database server that understands SQL. It is the one installed on your machine and the one project 07 uses. Oracle, MySQL and SQL Server are other servers of the same kind. The general name for this kind of program is _relational database management system_, shortened to **RDBMS**, and you will see that abbreviation in job postings.

So you write SQL, and PostgreSQL executes it. Saying "I know PostgreSQL" and "I know SQL" are different claims: the first is about one product, the second about the language that all of these products share.

> **Is SQL the same in all of those servers?** The core is. SQL is defined by an international standard, and a statement such as `SELECT title FROM books;` runs unchanged on any of them. Each server also adds syntax of its own, and that set of additions is called its **dialect**. [14-postgresql-specifics.md](14-postgresql-specifics.md) teaches how to tell standard SQL from PostgreSQL's own extensions, and covers PostgreSQL's date functions.

### Database, schema and table, from the outside in

One PostgreSQL server holds several **databases**. A database is a named, isolated container of data. A connection is made to exactly one database, and a statement sent through that connection sees only what is inside that database. Your server already holds at least two: `postgres`, which the installation creates, and `timetrack`, the database of project 07. This note adds one more, for practice.

Inside a database, tables are grouped into **schemas**. A schema is a named group of tables inside one database, in the way a folder is a named group of files. Every new database contains one schema called `public`, and a table created without naming a schema goes into it. That is why `books` and `public.books` name the same table in the practice database.

A **table** holds the data about one kind of thing: one table for books, another for authors.

```
PostgreSQL server                       the program running on your machine
└── database  practice_junior_notes     one of the databases the server holds
    └── schema  public                  the default group of tables
        ├── table  authors
        ├── table  books
        └── table  ...                  eight tables in total
```

pgAdmin draws this same nesting in its left panel: **Servers → your server → Databases → practice_junior_notes → Schemas → public → Tables**. You will open that path yourself in the section [Running statements in pgAdmin](#running-statements-in-pgadmin).

### Table, row and column

A table has a defined list of **columns**. Each column has a name and a **data type**, which states what kind of value the column accepts: text, a whole number, a date. The data itself is stored as **rows**. There is one row per item, and each row has one value for each column.

```
table books (five of its nine columns)

┌────┬─────────────────────┬───────┬───────┬───────────┐
│ id │ title               │ price │ stock │ author_id │  ◄── columns: the same for every row
├────┼─────────────────────┼───────┼───────┼───────────┤
│  1 │ 1984                │  9.99 │    12 │         1 │  ◄── one row = one book
│  2 │ Animal Farm         │  7.50 │     0 │         1 │
│  3 │ Pride and Prejudice │  8.99 │    20 │         2 │
└────┴─────────────────────┴───────┴───────┴───────────┘
```

Coming from JavaScript, a row is close to one object and a column is close to one property. Two differences matter. Every row of a table has exactly the same columns, whereas two objects in the same array can have different properties. And a column accepts only values of its type: PostgreSQL refuses to store the text `'cheap'` in the `price` column, whereas a JavaScript property accepts anything.

### What relational means

In a JavaScript object you would put the author inside the book:

```js
const book = {
  title: '1984',
  author: { name: 'George Orwell', country: 'UK' },
};
```

A relational database does not nest. It stores the books in one table and the authors in another, and it connects them through a value that both tables hold:

```
table authors (three of its four columns)
┌────┬───────────────┬─────────┐
│ id │ name          │ country │
├────┼───────────────┼─────────┤
│  1 │ George Orwell │ UK      │
│  2 │ Jane Austen   │ UK      │
└────┴───────────────┴─────────┘
   ▲
   │  the author_id of a book holds the id of its author
   │
table books (three of its nine columns)
┌────┬─────────────────────┬───────────┐
│ id │ title               │ author_id │
├────┼─────────────────────┼───────────┤
│  1 │ 1984                │         1 │
│  2 │ Animal Farm         │         1 │
│  3 │ Pride and Prejudice │         2 │
└────┴─────────────────────┴───────────┘
```

The row of _1984_ does not contain its author. It contains the number `1` in its `author_id` column, and the author whose `id` is `1` is George Orwell. Nothing else links the two rows. There is no object inside another object, only two equal values.

The benefit is that George Orwell is stored once. His two books both hold `1`, so correcting his country means changing one row. In the nested version the author is copied into every book, and a correction that misses one copy leaves two books that disagree about the same person.

> **"Relational" does not come from "relationship".** **Relation** is the mathematical name for a table, so a relational database is a database that stores its data in tables. Connecting tables through shared values is a consequence of that design, not the origin of the word. PostgreSQL uses the word in its own messages: `relation "book" does not exist` means that it found no table called `book`.

[02-relationships.md](02-relationships.md) teaches how those shared values are declared as keys. [06-joins.md](06-joins.md) teaches how one query reads two tables through them.

### The two meanings of schema

The word **schema** is used for two different things, and you will meet both.

- **A schema as a namespace** is the PostgreSQL object described above: the named group, such as `public`, that holds tables inside a database. A namespace is a space in which every name is unique. Two tables called `books` cannot exist in the same schema, but they can exist in two different schemas.
- **"The schema" as a design** is the informal sense: the complete set of tables, columns and rules that a database has. "Show me the schema" asks for that design, not for the `public` object.

The sentence around the word tells you which one is meant. `public`, and anything written as `schema.table`, is the namespace. "Design a schema" and "read the schema" are about the design.

[02-relationships.md](02-relationships.md) is about the design sense: it teaches how to define the tables, keys and rules of a database. The namespace sense comes back in [16-working-with-an-existing-database.md](16-working-with-an-existing-database.md), which covers names written as `schema.table` in a database that has more than one schema.

## Running statements in pgAdmin

Docs: https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html → read: "Query Tool" — the SQL editor, and the Data Output and Messages tabs

Chapter 01 assumes that you can type a statement, run it and read what comes back. This section gets you there. It also leaves you with the practice database that the later chapters query.

### pgAdmin is the client and the local PostgreSQL server holds the databases

Two programs are involved, and they are easy to confuse because you only ever look at one of them.

- The **PostgreSQL server** runs in the background on your machine. It has no window. It owns the databases.
- **pgAdmin** is a client with a graphical interface. It connects to the server, sends it the SQL you type, and displays what the server answers.

pgAdmin stores no data. Closing it loses nothing, and everything it shows was fetched from the server.

In pgAdmin you write SQL in the **Query Tool**: an editor at the top and a results area below it. A Query Tool is connected to one database, the one that was selected when you opened it.

### Creating the practice database `practice_junior_notes`

This route uses a database of its own, so that nothing you run here can touch `timetrack`.

1. In pgAdmin's left panel, the **Object Explorer**, expand **Servers** and then your server until you see **Databases**.
2. Right-click **Databases** and choose **Create → Database…**.
3. In the **General** tab, type `practice_junior_notes` in the **Database** field. Use that exact name: a name with capital letters or a hyphen would have to be written between double quotes in every statement.
4. Open the **SQL** tab of the same dialog. It shows the `CREATE DATABASE` statement that pgAdmin is about to send.
5. Click **Save**. The new database appears under **Databases**.

> **The dialog writes SQL for you.** The statement you saw in the **SQL** tab is what pgAdmin sent to the server when you clicked **Save**. The server only understands SQL, so all a graphical client can do is turn your clicks into statements.

### Seeding the practice database

**Seeding** a database means loading it with a known starting set of data. The script below does that. It creates the eight tables of a small bookstore and fills them with 72 rows.

1. Click `practice_junior_notes` in the Object Explorer and open **Tools → Query Tool**.
2. Look at the connection link at the top of the Query Tool. It must name `practice_junior_notes`. If it names another database, the tables will be created in that other database.
3. Paste the whole script into the editor.
4. Press **F5**, or click **Execute script** in the toolbar.

```sql
-- Practice database for the SQL junior notes.
-- Run the whole script inside practice_junior_notes.
-- Running it again rebuilds every table from scratch.

-- 1. Remove the tables if they already exist
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- 2. Create the eight tables
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

-- 3. Load the sample rows
INSERT INTO authors (name, country, birth_year) VALUES
  ('George Orwell',          'UK',       1903),
  ('Jane Austen',            'UK',       1775),
  ('Gabriel García Márquez', 'Colombia', 1927),
  ('Haruki Murakami',        'Japan',    1949),
  ('Isabel Allende',         'Chile',    1942),
  ('Carlos Ruiz Zafón',      'Spain',    1964),
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
  ('1984',                          '978-0451524935', 9.99,  1949, 12, 1, 1,    4),
  ('Animal Farm',                   '978-0451526342', 7.50,  1945, 0,  1, 3,    4),
  ('Pride and Prejudice',           '978-0141439518', 8.99,  1813, 20, 2, 3,    2),
  ('Emma',                          NULL,             9.99,  1815, 4,  2, 3,    2),
  ('One Hundred Years of Solitude', '978-0060883287', 14.99, 1967, 7,  3, 1,    3),
  ('Love in the Time of Cholera',   '978-0307389732', 12.99, 1985, 3,  3, 1,    3),
  ('Kafka on the Shore',            '978-1400079278', 12.99, 2002, 9,  4, 1,    1),
  ('Norwegian Wood',                '978-0375704024', 11.50, 1987, 0,  4, 1,    1),
  ('The House of the Spirits',      '978-1501117015', 12.99, 1982, 5,  5, 2,    3),
  ('The Shadow of the Wind',        '978-0143034902', 14.99, 2001, 15, 6, 2,    5),
  ('The Angel''s Game',             NULL,             NULL,  2008, 2,  6, 2,    5),
  ('My Brilliant Friend',           '978-1609450786', 12.99, 2011, 8,  7, NULL, 1);

INSERT INTO customers (name, email, city, joined_date) VALUES
  ('Ana García',    'ana@mail.com',    'Madrid',    '2024-01-15'),
  ('Luis Pérez',    'luis@mail.com',   'Barcelona', '2024-02-03'),
  ('Marta López',   'marta@mail.com',  NULL,        '2024-03-10'),
  ('Javier Ruiz',   'javier@mail.com', 'Valencia',  '2024-03-22'),
  ('Sofía Martín',  'sofia@mail.com',  'Madrid',    '2024-05-01'),
  ('Pablo Sánchez', 'pablo@mail.com',  'Sevilla',   '2024-06-18'),
  ('Lucía Gómez',   'lucia@mail.com',  NULL,        '2024-07-07'),
  ('Diego Torres',  'diego@mail.com',  'Bilbao',    '2024-09-12');

INSERT INTO orders (customer_id, order_date, status) VALUES
  (1, '2025-01-10', 'completed'),
  (1, '2025-02-14', 'completed'),
  (2, '2025-02-20', 'cancelled'),
  (3, '2025-03-05', 'completed'),
  (4, '2025-03-18', 'pending'),
  (5, '2025-04-02', 'completed'),
  (5, '2025-04-25', 'cancelled'),
  (6, '2025-05-11', 'completed'),
  (1, '2025-07-03', 'pending'),
  (2, '2025-08-08', 'completed');

INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES
  (1,  1,  1, 9.99),
  (1,  3,  2, 8.99),
  (2,  5,  1, 14.99),
  (3,  7,  1, 12.99),
  (3,  8,  1, 11.50),
  (4,  10, 1, 14.99),
  (4,  1,  1, 9.99),
  (5,  12, 2, 12.99),
  (6,  9,  1, 12.99),
  (6,  3,  1, 8.99),
  (7,  6,  1, 12.99),
  (8,  10, 2, 14.99),
  (9,  7,  1, 12.99),
  (9,  1,  3, 9.99),
  (10, 5,  1, 14.99),
  (10, 2,  2, 7.50);

INSERT INTO reviews (book_id, customer_id, rating, comment, reviewed_at) VALUES
  (1,  1, 5, 'A classic that still feels current', '2025-01-20 10:15:00'),
  (1,  4, 4, NULL,                                 '2025-03-12 18:40:00'),
  (3,  1, 4, 'Witty and sharp',                    '2025-01-25 09:30:00'),
  (5,  1, 5, NULL,                                 '2025-02-28 22:10:00'),
  (5,  2, 3, 'Hard to follow the family tree',     '2025-08-20 12:00:00'),
  (10, 3, 5, 'Could not put it down',              '2025-03-20 16:45:00'),
  (10, 6, 4, NULL,                                 '2025-05-30 11:20:00'),
  (7,  2, 2, 'Too strange for me',                 '2025-03-01 08:55:00');
```

You are not expected to understand this script yet. Read it only for its three parts, which its comments number: it removes the tables if they exist, it creates them, and it fills them. A line that starts with `--` is a **comment**: PostgreSQL ignores everything from `--` to the end of that line. [02-relationships.md](02-relationships.md) teaches the `CREATE TABLE` statements of part 2, and [08-dml.md](08-dml.md) teaches the `INSERT` statements of part 3.

When the script finishes, the **Messages** tab under the editor shows how long it took. The first time you run it, that tab also lists eight lines like this one:

```
NOTICE:  table "reviews" does not exist, skipping
```

> **A `NOTICE` is not an error.** Part 1 of the script removes the tables in case they exist. The first time there is nothing to remove, so PostgreSQL says that and carries on. A line that starts with `ERROR:` means the statement was rejected. A line that starts with `NOTICE:` is information.

Check the result in two ways. First, in the Object Explorer, open **practice_junior_notes → Schemas → public → Tables**. If the list is empty, right-click **Tables** and choose **Refresh…**. You should see the eight tables. Second, delete the script from the editor, type this statement and press **F5**:

```sql
SELECT title, price FROM books;
```

Read it as a sentence: from the table `books`, give me the columns `title` and `price`. The answer appears in the **Data Output** tab:

```
 title                         | price
-------------------------------+--------
 1984                          |   9.99
 Animal Farm                   |   7.50
 Pride and Prejudice           |   8.99
 Emma                          |   9.99
 One Hundred Years of Solitude |  14.99
 Love in the Time of Cholera   |  12.99
 Kafka on the Shore            |  12.99
 Norwegian Wood                |  11.50
 The House of the Spirits      |  12.99
 The Shadow of the Wind        |  14.99
 The Angel's Game              | [null]
 My Brilliant Friend           |  12.99
```

Two details of this result come back later in this note. The rows appear in the order in which the script inserted them, and the section [A result is an unordered set of rows](#a-result-is-an-unordered-set-of-rows) shows that this order is not a promise. One book shows `[null]` where its price should be, and the section [NULL marks a missing value](#null-marks-a-missing-value) explains what that is. [03-select.md](03-select.md) teaches `SELECT` and `FROM` in full.

**You can run the script again at any time.** It rebuilds the eight tables with their original 72 rows, so running it is how you undo any experiment.

> **F5 runs the selected text, or the whole editor when nothing is selected.** If part of the editor's content is highlighted, pgAdmin sends only that part. With nothing highlighted, it sends everything in the editor. So when the editor holds several statements and you want to run one, highlight that statement first.

### Evaluating an expression with `SELECT`

`SELECT` does not need a table. Given only an expression, it evaluates the expression and returns its value. An **expression** is anything that produces a value: a number, a piece of text, a calculation.

```sql
SELECT 2 + 3;
```

```
 ?column?
 integer
----------
        5
```

The answer is a table with one column and one row. The result of a `SELECT` is always a table, even when it holds a single value.

The header of the column has two lines in pgAdmin. The first line is the column's name, and the second is its data type. The other result blocks in this note show only the name. The type is `integer` because `2` and `3` are whole numbers. The name is `?column?` because the statement did not give the column a name, and that is the placeholder PostgreSQL uses for a column it has no name for. You give it a name with `AS`:

```sql
SELECT 2 + 3 AS total;
```

Now the header reads `total`. [03-select.md](03-select.md) teaches these names, which are called aliases.

This short form, `SELECT` followed by one expression and a semicolon, is the quickest way to ask PostgreSQL what an expression produces. Chapter 01 relies on it to show how each data type behaves.

Three details of the form apply to every statement you will write:

- **The semicolon ends a statement.** pgAdmin runs a single statement without it, but two statements in the same editor must be separated by one. Write it always.
- **Keywords are not case-sensitive.** A keyword is a word that belongs to the SQL language itself, such as `SELECT` or `FROM`. To PostgreSQL, `select`, `Select` and `SELECT` are the same word. The convention is to write keywords in capitals and the names of tables and columns in lowercase, which makes the two easy to tell apart at a glance.
- **Text goes between single quotes.** `SELECT 'hello';` returns the text `hello`. Double quotes mean something different: they mark a name, such as a column name, and not a value. `SELECT "hello";` fails with `column "hello" does not exist`, because PostgreSQL looks for a column with that name. [03-select.md](03-select.md) covers the difference between the two kinds of quotes.

### What a rejected statement looks like

Type `SELECT 2 + 3;` again, without the last letter of `SELECT`:

```sql
SELEC 2 + 3;
```

This time there is no result to show, and the Messages tab has this:

```
ERROR:  syntax error at or near "SELEC"
LINE 1: SELEC 2 + 3;
        ^

SQL state: 42601
Character: 1
```

Each line says something different:

- **`ERROR:  syntax error at or near "SELEC"`** names the failure. A syntax error means that the text does not follow the grammar of SQL. The quoted word is the place where PostgreSQL stopped understanding the statement.
- **`LINE 1:` and the `^` under it** repeat the line of your statement and point at that place. pgAdmin also underlines it in the editor.
- **`SQL state: 42601`** is the code PostgreSQL assigns to this kind of error. Every kind of error has its own five-character code, and `42601` is always a syntax error.
- **`Character: 1`** is the position of the problem, counted in characters from the start of the statement.

The first line is in English here. A PostgreSQL server can be installed to report its messages in another language, and then that line is translated. The SQL state does not change with the language, which makes it the part to search for.

**A rejected statement does nothing.** PostgreSQL either carries out a statement completely or not at all, so after an error every table holds exactly the rows it held before.

A statement can be rejected at three moments. This table gives one example of each, with the first line of its message:

| When it is rejected | Statement | First line of the message |
|---|---|---|
| Before it runs: the text is not valid SQL | `SELEC 2 + 3;` | `ERROR:  syntax error at or near "SELEC"` |
| Before it runs: the text is valid, but a name in it does not exist | `SELECT titel FROM books;` | `ERROR:  column "titel" does not exist` |
| While it runs: here, the data breaks a rule of the table | an `INSERT` of a review with a rating of 9 | `ERROR:  new row for relation "reviews" violates check constraint "reviews_rating_check"` |

The first two rows are rejected before PostgreSQL touches any data: it only had to read the text and look up the names. In the second one PostgreSQL even adds a line with a suggestion: `HINT:  Perhaps you meant to reference the column "books.title".` The third row is rejected later, when the new data is compared with the rules of the table, and the section [The database enforces the rules you declare](#the-database-enforces-the-rules-you-declare) runs it. [16-working-with-an-existing-database.md](16-working-with-an-existing-database.md) returns to these messages and teaches how to diagnose each kind.

### Reading one column definition inside `CREATE TABLE`

Chapter 01 is about data types, and a data type is written inside a column definition. So you need to be able to read one definition, even though writing a table is a later chapter. This is the statement that creates the `books` table in the script:

```sql
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
```

After `CREATE TABLE` comes the name of the table, and then a pair of parentheses that wraps a list of column definitions separated by commas. Each line inside the parentheses is one column definition, and it always starts with the same two parts:

```
price          NUMERIC(8,2)
└─ name        └─ data type
```

The first word is the name of the column. What follows it is the data type. The parentheses belong to the type: `VARCHAR(200)` is text of at most 200 characters, and `NUMERIC(8,2)` is a number of at most 8 digits, 2 of them after the decimal point. Anything written after the type is a rule or a default value for that column. A default value is the value the column takes when a new row does not give one. This table reads four of the definitions above:

| Definition | Name | Data type | After the type |
|---|---|---|---|
| `price NUMERIC(8,2)` | `price` | `NUMERIC(8,2)` | nothing |
| `title VARCHAR(200) NOT NULL` | `title` | `VARCHAR(200)` | `NOT NULL`, a rule |
| `stock INT NOT NULL DEFAULT 0` | `stock` | `INT` | `NOT NULL`, a rule, and `DEFAULT 0`, a default value |
| `id SERIAL PRIMARY KEY` | `id` | `SERIAL` | `PRIMARY KEY`, a rule |

What this table lists under **Data type** is what chapter 01 is about. [01-data-types.md](01-data-types.md) teaches what each data type accepts and how it behaves, including `VARCHAR`, `NUMERIC` and `SERIAL`. What it lists under **After the type** is the subject of [02-relationships.md](02-relationships.md), which teaches the rules and the default values.

> **Why do the `INSERT` statements of the script never give an `id`?** Because of `SERIAL`. A column of that type is a whole number that PostgreSQL fills in by itself, counting 1, 2, 3 in the order in which the rows are inserted. That is how _1984_, the first book inserted, got the `id` 1.

You can now run a statement, read its result, read an error and read a column definition. The last thing chapter 01 expects you to recognise is NULL. It is covered in the section [NULL marks a missing value](#null-marks-a-missing-value), which comes after the idea that explains how PostgreSQL executes what you write.

## Declarative means you describe the result and PostgreSQL plans the work

Docs: https://www.postgresql.org/docs/current/query-path.html → read: "The Path of a Query" — the stages between the text you send and the rows you get back

A JavaScript program is a list of steps, and the computer carries out exactly those steps, in exactly that order. SQL does not work that way. Reading a statement as if it were a list of steps is what makes SQL confusing for someone who arrives from JavaScript.

### The same question in JavaScript and in SQL

The question is: which books cost less than 10, by title, in alphabetical order?

In JavaScript, with a loop:

```js
const books = [
  { title: '1984', price: 9.99 },
  { title: 'Animal Farm', price: 7.5 },
  { title: 'Pride and Prejudice', price: 8.99 },
  { title: 'Emma', price: 9.99 },
  { title: 'Kafka on the Shore', price: 12.99 },
];

const cheapTitles = [];
for (const book of books) {
  if (book.price < 10) {
    cheapTitles.push(book.title);
  }
}
cheapTitles.sort();
// ['1984', 'Animal Farm', 'Emma', 'Pride and Prejudice']
```

In JavaScript, with array methods:

```js
const cheapTitles = books
  .filter((book) => book.price < 10)
  .map((book) => book.title)
  .sort();
// ['1984', 'Animal Farm', 'Emma', 'Pride and Prejudice']
```

In SQL, against the practice database:

```sql
SELECT title
FROM books
WHERE price < 10
ORDER BY title;
```

```
 title
---------------------
 1984
 Animal Farm
 Emma
 Pride and Prejudice
```

The statement has four parts, and each part that starts with a keyword is called a **clause**. Read them as English: from `books`, keep the rows whose price is below 10, give me their `title`, sorted by `title`. [04-where.md](04-where.md) teaches `WHERE`, and [05-order-by-limit.md](05-order-by-limit.md) teaches `ORDER BY`.

Both JavaScript versions say **how** to get the answer. Create an empty array. Visit every element, from the first to the last. Test it. Copy its title. Sort the copies. Code that lists the steps is called **imperative**.

The SQL statement says none of that. It has no loop, no variable and no "visit every row". It states what the result must be: which table the rows come from, which rows qualify, which column is wanted, and in which order. A statement that describes the result and leaves the steps to whoever executes it is called **declarative**. You already use one declarative language: a CSS rule such as `display: flex` states how the elements must end up, and the browser works out the positions.

> **Is `.filter().map().sort()` not declarative already?** It reads more like a description than the loop does, but it still fixes the steps. `filter` visits every element of the array, one by one, and `map` then visits every element that passed. You chose that procedure when you wrote the chain. The SQL statement chooses no procedure, and that leaves PostgreSQL free to find the answer without reading every row of the table.

### How PostgreSQL turns the statement into an execution plan

Someone has to choose the steps, and PostgreSQL does it each time a statement arrives. The statement goes through four stages:

1. **Parse.** The **parser** checks the text against the grammar of SQL. `SELEC 2 + 3;` is rejected at this stage, with a syntax error.
2. **Resolve the names.** PostgreSQL looks up every table and column that the statement mentions in the **system catalog**, which is where it records the tables and columns that each database has. `SELECT titel FROM books;` is rejected at this stage, because `books` has no column called `titel`.
3. **Plan.** The **planner** works out the different ways of producing the result, estimates the cost of each one, and keeps the cheapest. What it produces is the **execution plan**: the concrete list of steps.
4. **Execute.** The **executor** carries out the plan and sends the rows back to the client.

The documentation linked above counts the stages differently. It adds the connection as a first stage, it treats stages 1 and 2 as one, and it places a rewrite stage before the planner. PostgreSQL uses that rewrite stage for views, which [11-ctes-and-views.md](11-ctes-and-views.md) teaches.

For the statement above and a `books` table of 12 rows, the plan has two steps:

```
1. Read every row of books, and keep the ones whose price is below 10
2. Sort the rows that were kept by title
```

With 12 rows there is no better way. Now suppose the table has two million books and somebody has created an **index** on `price`. An index is an extra structure, kept in order by the values of one column, that lets PostgreSQL go straight to the rows with a given value. It works like the alphabetical index at the back of a book, which sends you to the right page without reading the whole book. The planner now has two ways of doing step 1:

- read all two million rows and keep the cheap ones, or
- use the index to fetch only the cheap ones.

To choose, it uses **statistics**: the figures PostgreSQL keeps about every table, such as how many rows it has and how the values of each column are distributed. From those figures it estimates what each way would cost, and it takes the cheaper one.

Your statement is the same four lines in both cases. That is the point of the declarative model: the question stays fixed, and the way of answering it adapts to the data.

A taxi works the same way. You give the driver the address, and the driver, who knows the streets and the traffic at that hour, chooses the route. The same address can mean a different route tomorrow.

### What the planner changes in how you write SQL

Four things follow from the fact that PostgreSQL chooses the steps:

1. **The order in which you write the clauses is not the order in which they are applied.** `SELECT title` is written first, but PostgreSQL cannot return titles before it knows which rows qualify. [03-select.md](03-select.md) gives the order in which the clauses of a statement are evaluated.
2. **You never write a loop.** SQL has no "for each row". A statement talks about all the rows that meet a condition at once: "the books whose price is below 10", not "take the first book, check its price, take the next one". Thinking one row at a time is the JavaScript habit to drop.
3. **A statement can become slower or faster without changing.** The planner works from the statistics as they are when the statement arrives. A statement that was instant on 12 rows can be slow on two million, and creating an index can make it fast again with no change to its text. [13-indexes.md](13-indexes.md) teaches indexes and `EXPLAIN`, the statement that shows which plan PostgreSQL chose.
4. **The rows come back in whatever order the plan produced them.** Nothing in the plan sorts them unless the statement asks for it. That is the first of the three traits, and the next section is about it.

## A result is an unordered set of rows

Docs: https://www.postgresql.org/docs/current/queries-order.html → read: the first paragraph of "Sorting Rows (ORDER BY)" — rows that were not sorted come back in an unspecified order

Three traits of SQL appear in every chapter of this route, and each one contradicts a habit from JavaScript. This section and the next two take one each. This is the first, and it follows directly from the way the planner works.

An array has an order: element 0, element 1, element 2, and it keeps that order. A table does not. A table is a set of rows with no first row and no last row. A result is the same: unless the statement asks for an order, PostgreSQL returns the rows in whatever order the plan produced them.

You can see this with two statements. Run the first one:

```sql
SELECT id, title FROM books;
```

```
 id | title
----+-------------------------------
  1 | 1984
  2 | Animal Farm
  3 | Pride and Prejudice
 ...
 11 | The Angel's Game
 12 | My Brilliant Friend
```

The twelve rows look sorted by `id`. They are not sorted. This is the order in which the rows are stored in the table's file, and so far that is the order in which the script inserted them.

Now change one row. The statement below sets the stock of the book whose `id` is 1 to 11. [08-dml.md](08-dml.md) teaches `UPDATE`.

```sql
UPDATE books SET stock = 11 WHERE id = 1;
```

Then run the first statement again:

```sql
SELECT id, title FROM books;
```

```
 id | title
----+-------------------------------
  2 | Animal Farm
  3 | Pride and Prejudice
  4 | Emma
 ...
 12 | My Brilliant Friend
  1 | 1984
```

The row with `id` 1 is now the last one. The statement did not change, and nothing in the `UPDATE` mentioned an order. Three steps explain it:

1. PostgreSQL does not overwrite a row in place. An `UPDATE` writes a new version of the row in free space of the table's file, which here is at the end, and it marks the old version as obsolete.
2. The plan for `SELECT id, title FROM books;` reads the table's file from beginning to end.
3. So the new version of the row with `id` 1 is read last, and it is returned last.

Nobody sorted anything in either run. The first result looked sorted because of where the rows happened to be stored. The order of a result can also change for another reason: the planner can choose a different plan when the table grows or when an index is created.

So an order exists only when the statement asks for one, with `ORDER BY`:

```sql
SELECT id, title FROM books ORDER BY id;
```

This returns the rows from `id` 1 to `id` 12, before the `UPDATE` and after it.

This trait first becomes decisive in [05-order-by-limit.md](05-order-by-limit.md). That chapter takes only some rows of a result, such as the first five or the second page. Without a stated order, "the first five" are five rows that can be different on the next run.

> **"Set" here means no order. It does not mean no duplicates.** A result can contain the same row several times: `SELECT price FROM books;` returns `12.99` four times, once for each book with that price. Removing the repeated rows is the job of `DISTINCT`, which [03-select.md](03-select.md) teaches.

Run the seed script again now. It puts the stock of _1984_ back to 12 and the rows back in their original place.

## NULL marks a missing value

Docs: https://www.postgresql.org/docs/current/functions-comparison.html → read: "Comparison Functions and Operators" — the paragraph that starts "Do not write expression = NULL"

The practice database has a book with no price. In the script, the row of _The Angel's Game_ has the word `NULL` where the price goes. **NULL** is the marker PostgreSQL stores in place of a value to say that the row has no value in that column. It is the one exception to what the section [Table, row and column](#table-row-and-column) said, that each row has one value for each column. pgAdmin displays it as `[null]`.

NULL is not zero, and it is not an empty text. A price of `0` would mean that the book is free. NULL means that the price is not known, or was never recorded. That difference is the whole trait: **NULL is not a value. It is the absence of one.**

> **`NULL` is written without quotes.** The script writes the word `NULL` bare. Between single quotes, `'NULL'` is a text of four letters, and a text is a value like any other: a book whose title is `'NULL'` has a title.

The behaviour that follows from it can be seen with two expressions:

```sql
SELECT 5 + NULL;
```

```sql
SELECT NULL = NULL;
```

Both return `[null]`. Five plus a number that is not known gives a number that is not known. And asking whether one missing value equals another missing value has no answer either: PostgreSQL cannot say true and it cannot say false, so it answers NULL.

JavaScript behaves differently, and this is where the habit has to change:

```js
null === null   // true
null + 5        // 5
null < 10       // true
```

In JavaScript, `null` is a value like any other. It is equal to itself, and in arithmetic and in comparisons such as `<`, JavaScript converts it to `0`. SQL never converts NULL into anything.

The difference changes results. Take the `books` array from the section [The same question in JavaScript and in SQL](#the-same-question-in-javascript-and-in-sql), add the book without a price to it, and run the same chain:

```js
books.push({ title: "The Angel's Game", price: null });

books
  .filter((book) => book.price < 10)
  .map((book) => book.title)
  .sort();
// ['1984', 'Animal Farm', 'Emma', 'Pride and Prejudice', "The Angel's Game"]
```

JavaScript includes _The Angel's Game_, because `null < 10` is `true`. The SQL statement of that same section, run against a table that does contain that book, returned four titles and left it out. For that row, `price < 10` is `NULL < 10`, and the answer to that is NULL. `WHERE` keeps a row only when its condition is true, and NULL is not true. The row is dropped, with no error and no warning.

Asking for the rows that have no value needs its own syntax, `price IS NULL`, because `price = NULL` never returns true. [04-where.md](04-where.md) teaches both, and it is where this trait first becomes decisive: a filter that forgets about NULL loses rows without saying so. The trait then returns in [06-joins.md](06-joins.md), where NULL fills the columns of a row that found no match in the other table, and in [07-aggregates.md](07-aggregates.md), where totals and averages skip the missing values.

Not every column can hold NULL. A column accepts it unless its definition says `NOT NULL`, or says `PRIMARY KEY`, which includes that rule. In `books`, `title` is declared `NOT NULL` and `price` is not, which is why a book can exist without a price but not without a title.

For chapter 01 you need two things from this section: read NULL as "no value here", and never compare anything with NULL using `=`.

## The database enforces the rules you declare

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html → read: the introduction of "Constraints" — why a data type alone is too coarse a limit

A review has a rating from 1 to 5. In JavaScript nothing stops this:

```js
reviews.push({ bookId: 1, customerId: 2, rating: 9 });
```

You can validate the rating in the function that saves a review. That protects one path. Any other code that writes to the array, and any other program that writes to the same data, goes around the check.

In a relational database the rule is declared once, in the table itself. This is the definition of the `rating` column in the script:

```sql
rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
```

Read it the way the section [Reading one column definition inside `CREATE TABLE`](#reading-one-column-definition-inside-create-table) showed: the name is `rating`, the type is `INT`, and two rules follow. `NOT NULL` says that every review must have a rating. `CHECK (rating BETWEEN 1 AND 5)` says that the rating must be between 1 and 5. A rule declared on a table is called a **constraint**.

Now try to break the rule. The statement below tries to add a review with a rating of 9:

```sql
INSERT INTO reviews (book_id, customer_id, rating)
VALUES (1, 2, 9);
```

PostgreSQL rejects it. This is the first line in the Messages tab:

```
ERROR:  new row for relation "reviews" violates check constraint "reviews_rating_check"
```

The line has three parts. `relation "reviews"` is the table. `check constraint` is the kind of rule that was broken. `"reviews_rating_check"` is the name of the rule, which PostgreSQL built from the name of the table and the name of the column, because the script did not give the rule a name. Under that line, the Messages tab prints the row that was refused, as `Failing row contains (…)`, and the SQL state `23514`.

The row was not stored. The `reviews` table still has its eight rows.

The reason this is stronger than a check in your code is the path that every change follows:

1. Every change, from every client, reaches the server as a statement.
2. Before the server stores a row, it compares the row with the constraints of the table.
3. If the row breaks one of them, the server rejects it, and the statement fails as a whole.

The check sits in the one program that every read and every write goes through, as the section [A database server is a separate program that owns the data](#a-database-server-is-a-separate-program-that-owns-the-data) described. pgAdmin, a Spring Boot application and a script run by a colleague all get the same rule and the same error. Validation in the application is still worth writing, because it can give the user a clearer message earlier. But it is the constraint that guarantees the data.

The script declares five kinds of rule. The left column of this table quotes a line of the script, the middle column names the rule in that line which the row is about, and the right column says what PostgreSQL will refuse to accept because of that rule:

| In the script | The rule | What PostgreSQL refuses |
|---|---|---|
| `id SERIAL PRIMARY KEY` | `PRIMARY KEY` | two rows with the same `id`, or a row without one |
| `title VARCHAR(200) NOT NULL` | `NOT NULL` | a book without a title |
| `email VARCHAR(100) UNIQUE NOT NULL` | `UNIQUE` | two customers with the same email |
| `rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5)` | `CHECK (…)` | a rating outside 1 to 5 |
| `author_id INT REFERENCES authors(id)` | `REFERENCES` | a book whose `author_id` is not the `id` of an existing author |

This trait first becomes decisive in [02-relationships.md](02-relationships.md), which teaches how to declare each of these five rules. It returns in [08-dml.md](08-dml.md), where every row you insert, change or delete is judged against them.

## Where SQL sits between Angular, Spring Boot and PostgreSQL

Docs: https://www.baeldung.com/java-jdbc → read: "Connecting to a Database" and "Executing SQL Statements" — the Java code that sits underneath every Spring Boot call to the database

> **Preview — Spring Boot:** This section names pieces of Java and Spring Boot (JDBC, Hibernate, a repository, `@Query`) to show where SQL appears in an application. Read it for the position of each piece. You study the pieces themselves in the Spring Boot notes.

In a full-stack application such as project 07, a request for data goes through four layers:

```
Browser: Angular
   │   HTTP request, JSON
   ▼
Spring Boot: controller → service → repository
   │   Hibernate writes the SQL statement
   ▼
JDBC and the PostgreSQL driver
   │   the SQL statement, as text, through a connection
   ▼
PostgreSQL server                       ◄── pgAdmin connects here too
```

The rows travel back up the same path: PostgreSQL returns rows, Hibernate turns them into Java objects, and Spring Boot sends them to Angular as JSON.

**Angular never sees SQL.** It runs in the browser, sends HTTP requests to Spring Boot and receives JSON. It cannot connect to PostgreSQL, and it must not: a connection needs the database password, and anything delivered to a browser can be read by the person using it.

**Spring Boot is a client of the database.** It does what pgAdmin does: it opens connections and sends statements. In project 07, `application.properties`, the file that holds the application's configuration, has the address it connects to:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/timetrack}
```

The part after `DB_URL:` is the address used when no environment variable replaces it. It reads: a PostgreSQL server on this machine (`localhost`), on port `5432`, which is the port PostgreSQL listens on by default, and the database `timetrack`.

**JDBC is how Java talks to a database.** JDBC (Java Database Connectivity) is the standard Java API for three things: opening a connection, sending a statement as text, and reading the rows that come back. A **driver** is the library that implements that API for one particular server. Project 07 has the PostgreSQL driver as the `org.postgresql:postgresql` dependency in its `pom.xml`, the file that lists the libraries the project uses.

**An ORM writes the SQL for you.** An ORM (object-relational mapper) is a library that lets you work with Java objects. It turns each operation on them into a SQL statement, and each row that comes back into an object. Hibernate is the ORM that Spring Boot brings in through the `spring-boot-starter-data-jpa` dependency. A call such as `projectRepository.findById(id)` in `ProjectService` contains no SQL. Hibernate generates a `SELECT` on the `projects` table that keeps the row with that `id`, and sends it through JDBC.

So every path ends in a SQL statement, written by you or written by Hibernate. That is why an ORM does not make SQL optional. Three situations in your own project show it:

**You read the SQL that Hibernate writes.** Project 07 sets `spring.jpa.show-sql=true` in `application-dev.properties`, its configuration file for development. That setting prints every statement Hibernate sends. When an endpoint is slow or returns the wrong rows, that output is the first evidence you have, and it is SQL.

**You write by hand the queries that the ORM does not generate.** A lookup by `id` is generated for you. A report that adds up the hours of each project is not, so `TimeEntryRepository.java` in project 07 holds it, written by hand:

```java
@Query("""
        SELECT te.project.id AS projectId, te.project.name AS projectName, round(SUM(te.hours), 2) AS totalHours, te.project.active AS active
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.id, te.project.name, te.project.active
        ORDER BY SUM(te.hours) DESC, te.project.name ASC
        """)
```

This is JPQL, the query language that Hibernate accepts. It has the same clauses as SQL, but it names Java classes and their fields (`TimeEntry`, `te.project.name`) where SQL names tables and columns, and Hibernate translates it into SQL. Its keywords are the ones this route teaches: `BETWEEN` is in [04-where.md](04-where.md), `ORDER BY` in [05-order-by-limit.md](05-order-by-limit.md), `SUM` and `GROUP BY` in [07-aggregates.md](07-aggregates.md), and `round` in [01-data-types.md](01-data-types.md).

**You look at the data directly.** When someone reports that a time entry disappeared, the fastest check is a `SELECT` in pgAdmin against the table: the row is there or it is not. That tells you whether to look for the problem in the data or in the code above it, and it involves no Java.

pgAdmin enters the diagram at the bottom, as a second client of the same server. A statement you try in pgAdmin is judged by the same rules when Spring Boot sends it, because, as the previous section showed, the server applies its constraints to every client.

## The route from chapter 01 to chapter 16

Docs: https://www.postgresql.org/docs/current/sql.html → read: the table of contents of "Part II. The SQL Language" — the official reference for the statements this route teaches

The sixteen chapters follow one line: what the data is, how to read it, how to change it, the harder ways of reading it, and how to work with SQL as a professional. The route opens with structure, in chapters 01 and 02, because every statement operates on typed columns inside tables: you cannot judge `WHERE price < 10` without knowing what `price` can hold. From there, chapters 03 to 07 build reading in the order in which a query grows: choose the columns, filter the rows, order them, combine tables, summarise groups. Only then do chapters 08 and 09 change data, since the safe way to change rows is to select them first and check which ones the change will reach. With the everyday cycle of reading and writing complete, chapters 10 to 12 go back to reading, with the forms that put one query inside another, give a query a name, or calculate across related rows. Chapter 13 comes after all of those, because the cost of a query is only worth measuring once you can write the query. Chapter 14 then gathers PostgreSQL's own date syntax and separates what is standard SQL from what is not. The last two chapters change the question from "how do I write this?" to "how do I work?": chapter 15 turns everything before it into a method, and chapter 16 applies that method to a database that somebody else designed.

The table gives the contribution of each chapter. The first column links the file, the second gives the chapter's title, and the third says what the chapter adds to what you could already do.

| File | Chapter | What it adds |
|---|---|---|
| [01-data-types.md](01-data-types.md) | Data types | What a single value is: text, numbers, dates and booleans, how a value is converted from one type to another, and what stays exact in a calculation |
| [02-relationships.md](02-relationships.md) | Defining a schema — tables, relationships, keys, and constraints | The tables that hold those values, the keys that identify rows and connect tables, and the constraints that keep the data valid |
| [03-select.md](03-select.md) | SELECT, expressions, and text | The shape of a result: which columns, calculated columns, names for them, and the functions that transform text |
| [04-where.md](04-where.md) | Filtering and NULL handling | Which rows qualify: conditions, and how NULL behaves inside them |
| [05-order-by-limit.md](05-order-by-limit.md) | Ordering, pagination, and set operations | A stated order, a limited number of rows, pages, and two results stacked into one |
| [06-joins.md](06-joins.md) | JOINs | Rows of several tables read together, and how many rows the combination produces |
| [07-aggregates.md](07-aggregates.md) | Aggregates and grouping | Counts, totals and averages, with one row per group |
| [08-dml.md](08-dml.md) | DML — modifying data | Inserting, changing and deleting rows, limited to the rows you intend. DML (Data Manipulation Language) is the name for those statements |
| [09-transactions.md](09-transactions.md) | Transactions | Several changes that succeed or fail as one |
| [10-subqueries.md](10-subqueries.md) | Subqueries and existence tests | A query inside another query: used as a value, as a table, or as a test that a matching row exists |
| [11-ctes-and-views.md](11-ctes-and-views.md) | CTEs and views | A name for a query: inside one statement, which is a CTE (common table expression), or saved in the database, which is a view |
| [12-window-functions.md](12-window-functions.md) | Window functions | A calculation over a group of rows that keeps every row, used above all for rankings |
| [13-indexes.md](13-indexes.md) | Performance basics | Indexes and `EXPLAIN`: what a query costs, and the evidence for it |
| [14-postgresql-specifics.md](14-postgresql-specifics.md) | PostgreSQL specifics | PostgreSQL's date functions, and the line between standard SQL and PostgreSQL's extensions |
| [15-query-workflow-and-review.md](15-query-workflow-and-review.md) | Query workflow and SQL review | A method for building a query from a business question, checking its totals, and reviewing SQL for its typical mistakes |
| [16-working-with-an-existing-database.md](16-working-with-an-existing-database.md) | Working with an existing database | Inspecting a database you did not design, reading its errors, and recognising its permissions and the code stored inside it |

You now have what chapter 01 assumes: a practice database, a client to run statements in, the short `SELECT` form that evaluates one expression, the two parts of a column definition, and NULL as the marker of a missing value. The next file, [01-data-types.md](01-data-types.md), starts from the second of those two parts, the data type. The type decides what a column can hold, how two values are compared and what a calculation returns, and every table, filter and report in the rest of the route is built on those values.
