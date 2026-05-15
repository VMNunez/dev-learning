# SQL — Interview Questions

## DDL and constraints

**What is the difference between DDL and DML?**

DDL (Data Definition Language) defines the structure of the database — `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`. DML (Data Manipulation Language) works with the data — `SELECT`, `INSERT`, `UPDATE`, `DELETE`. In an interview, knowing the names shows you understand that SQL has different layers.

> **Junior tip:** Interviewers use these terms in questions — "write a DDL statement" means `CREATE TABLE`, not a query. Know both acronyms cold.
> **Consejo de entrevista:** Los entrevistadores usan estos términos — "escribe una sentencia DDL" significa `CREATE TABLE`, no una consulta. Conoce bien los dos acrónimos.

**What does `NOT NULL` do and why is it important?**

It prevents a column from storing an empty value. Without it, a row can be inserted without that field, which leads to missing data that is hard to detect later. In the bookstore database, `name` on `authors` is `NOT NULL` because a book without an author name is useless.

> **Junior tip:** NOT NULL is a contract — it says "this column must always have a value." Mention that the database enforces it automatically, not the application code.
> **Consejo de entrevista:** NOT NULL es un contrato — dice "esta columna siempre debe tener un valor." Menciona que la base de datos lo garantiza automáticamente, no el código de la aplicación.

**What does `UNIQUE` do?**

It prevents two rows from having the same value in that column. I use it on email fields — `email VARCHAR(100) NOT NULL UNIQUE` — so two customers cannot register with the same address. The database enforces it automatically, so I do not need to check for duplicates in the application for every case.

**What is `PRIMARY KEY` and how does it combine with `SERIAL`?**

`PRIMARY KEY` means the column uniquely identifies every row and cannot be NULL. Combining it with `SERIAL` — `id SERIAL PRIMARY KEY` — gives you an auto-incrementing ID that the database generates on every insert. You never have to set it manually.

> **Junior tip:** In PostgreSQL, `SERIAL` creates a sequence behind the scenes and sets a default value. It is shorthand — more modern SQL uses `GENERATED ALWAYS AS IDENTITY`, but `SERIAL` is what you will see in most real projects.
> **Consejo de entrevista:** En PostgreSQL, `SERIAL` crea una secuencia internamente y establece un valor por defecto. Es un atajo — el SQL más moderno usa `GENERATED ALWAYS AS IDENTITY`, pero `SERIAL` es lo que verás en la mayoría de proyectos reales.

**How do you define a foreign key in SQL?**

With `REFERENCES` — `author_id INT REFERENCES authors(id)`. This tells the database that `author_id` must match an existing `id` in the `authors` table. If you try to insert a book with an `author_id` that does not exist, the database rejects it.

> **Junior tip:** Foreign keys enforce "referential integrity" — the data is consistent by design, not by luck. No orphaned records, no broken links.
> **Consejo de entrevista:** Las claves foráneas garantizan la "integridad referencial" — los datos son consistentes por diseño, no por suerte. Sin registros huérfanos, sin enlaces rotos.

**When do you use `CHAR` instead of `VARCHAR`?**

When the value always has the same fixed length. I use `CHAR(2)` for country codes — `'ES'`, `'DE'`, `'US'` are always exactly two characters. `VARCHAR` would also work, but `CHAR` signals that the length is always the same, which makes the intent clear.

**What does `IF NOT EXISTS` do in `CREATE TABLE`?**

It prevents an error if the table already exists. Without it, running the same `CREATE TABLE` twice throws an error. It is useful in setup scripts that you might run more than once — the script is idempotent.

> **Junior tip:** "Idempotent" is a word interviewers like — it means running the operation multiple times gives the same result as running it once. Use it confidently.
> **Consejo de entrevista:** "Idempotente" es una palabra que gusta a los entrevistadores — significa que ejecutar la operación varias veces da el mismo resultado que ejecutarla una vez. Úsala con confianza.

**What is a `CHECK` constraint and when would you use one?**

`CHECK` lets you add a condition that every row must satisfy. For example, `price NUMERIC(10,2) CHECK (price >= 0)` prevents inserting a negative price. It is a database-level rule — the application does not need to validate this separately.

> **Junior tip:** Know the five constraint types: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, and CHECK. Interviewers sometimes ask you to name them all.
> **Consejo de entrevista:** Conoce los cinco tipos de restricciones: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY y CHECK. A veces los entrevistadores te piden nombrarlos todos.

**Why does PostgreSQL use `SERIAL` instead of `AUTO_INCREMENT` like MySQL?**

They do the same thing — auto-generate a number on insert — but the keyword is different. PostgreSQL uses `SERIAL`; MySQL uses `AUTO_INCREMENT`. Since my internship uses MySQL and my personal stack uses PostgreSQL, I know both syntaxes.

> **Junior tip:** If you have MySQL experience from your internship, expect this comparison. The behaviour is identical; only the syntax differs.
> **Consejo de entrevista:** Si tienes experiencia con MySQL de tus prácticas, espera esta comparación. El comportamiento es idéntico; solo la sintaxis es diferente.

Red flag answer: saying they work differently, or not knowing that `AUTO_INCREMENT` is the MySQL equivalent.

---

## Data types

**What is the difference between `VARCHAR` and `TEXT` in PostgreSQL?**

`VARCHAR(n)` has a maximum length — use it when you know the limit (names, emails). `TEXT` has no limit — use it for long content like descriptions or comments. In practice, both store data the same way in PostgreSQL, but `VARCHAR` documents the intent.

> **Junior tip:** In PostgreSQL, VARCHAR and TEXT have identical storage performance — the difference is intent and the length constraint. Use VARCHAR to communicate "this value should not exceed N characters."
> **Consejo de entrevista:** En PostgreSQL, VARCHAR y TEXT tienen el mismo rendimiento de almacenamiento — la diferencia es la intención y la restricción de longitud. Usa VARCHAR para comunicar "este valor no debería superar N caracteres."

**Why do you use `NUMERIC` for money and not `FLOAT`?**

`FLOAT` is an approximate type — it can introduce tiny rounding errors. For money, you need exact precision. `NUMERIC(10,2)` stores exactly two decimal places with no rounding. Using `FLOAT` for prices is a classic mistake that causes wrong totals.

> **Junior tip:** Say "floating point rounding errors" — that is exactly what the interviewer wants to hear. Bonus: even `0.1 + 0.2` is not exactly `0.3` in floating point arithmetic.
> **Consejo de entrevista:** Di "errores de redondeo de punto flotante" — eso es exactamente lo que busca escuchar el entrevistador. Extra: incluso `0.1 + 0.2` no es exactamente `0.3` en aritmética de punto flotante.

Red flag answer: "I would use FLOAT because it's simpler." This shows you don't understand financial precision requirements.

**What is `SERIAL` and when do you use it?**

An auto-incrementing integer — PostgreSQL generates the next value automatically on every insert. Use it for primary keys so you never have to set the ID manually.

**When would you use `TIMESTAMP` instead of `DATE`?**

`DATE` stores only the day — good for birthdays or deadlines. `TIMESTAMP` stores the date and time — use it for events like `created_at` or `updated_at` where you need to know when exactly something happened.

> **Junior tip:** In a Spring Boot project, `created_at` is almost always `TIMESTAMP` — you need to know when something was created to the second, not just the day.
> **Consejo de entrevista:** En un proyecto Spring Boot, `created_at` es casi siempre `TIMESTAMP` — necesitas saber cuándo se creó algo al segundo, no solo el día.

**What is the difference between `TIMESTAMP` and `TIMESTAMPTZ` in PostgreSQL?**

`TIMESTAMP` stores a date and time with no time zone — it stores exactly what you put in. `TIMESTAMPTZ` (timestamp with time zone) converts the stored time to UTC internally and converts it back to the session time zone when you read it. For web applications where users can be in different time zones, `TIMESTAMPTZ` is almost always the right choice.

> **Junior tip:** `TIMESTAMPTZ` is a PostgreSQL-specific detail that shows you understand real-world requirements. Use it for `created_at`, `updated_at`, and any event timestamp in a multi-timezone app.
> **Consejo de entrevista:** `TIMESTAMPTZ` es un detalle específico de PostgreSQL que muestra que entiendes los requisitos del mundo real. Úsalo para `created_at`, `updated_at` y cualquier marca de tiempo en una app multi-zona horaria.

Red flag answer: "I always use TIMESTAMP." The interviewer wants to know you have thought about time zones.

---

## Table relationships

**What is a foreign key?**

A column in one table that points to the primary key of another table. It creates a link between the two tables and prevents you from inserting a row that references something that does not exist. For example, `books.author_id` is a foreign key pointing to `authors.id`.

> **Junior tip:** Foreign keys enforce referential integrity at the database level — no bug in the application can create orphaned data if the constraint is in place.
> **Consejo de entrevista:** Las claves foráneas garantizan la integridad referencial a nivel de base de datos — ningún error en la aplicación puede crear datos huérfanos si la restricción está en su lugar.

**What are the three types of table relationships?**

One-to-many — one author has many books; the foreign key goes in the "many" side. Many-to-many — one order can have many books and one book can appear in many orders; you need a junction table in the middle. One-to-one — rare, usually you just merge the two tables.

> **Junior tip:** Be ready to give a real example for each type. One-to-many: author → books. Many-to-many: orders ↔ books via order_items. One-to-one: user → user_profile.
> **Consejo de entrevista:** Prepárate para dar un ejemplo real de cada tipo. Uno a muchos: author → books. Muchos a muchos: orders ↔ books a través de order_items. Uno a uno: user → user_profile.

**How do you identify what type of relationship two tables have?**

Ask two questions: "Can one A have many B?" and "Can one B have many A?" If only the first is yes, it is one-to-many. If both are yes, it is many-to-many. If neither is yes, it is one-to-one.

**What is a junction table and when do you need one?**

A table with two foreign keys — one pointing to each side of a many-to-many relationship. You need one whenever two entities can relate to many instances of each other. For example, `order_items` connects `orders` and `books`: one order has many books, and one book can appear in many orders.

**What naming conventions do you follow for tables and columns?**

Tables are plural and lowercase with underscores — `authors`, `order_items`. Primary keys are always `id`. Foreign keys follow the pattern `referenced_table_singular_id` — so `author_id`, `customer_id`. Boolean columns start with `is_` or `has_`. Date columns end in `_at` — `created_at`, `updated_at`.

> **Junior tip:** Naming conventions show you write code others can read. Mention them confidently — they show professional awareness, not just technical skill.
> **Consejo de entrevista:** Las convenciones de nomenclatura muestran que escribes código que otros pueden leer. Mencionarlas con confianza muestra conciencia profesional, no solo habilidad técnica.

**What is `ON DELETE CASCADE` and when would you use it?**

`ON DELETE CASCADE` is an option on a foreign key that automatically deletes all dependent rows when the referenced row is deleted. For example, if `order_items.order_id` is defined with `ON DELETE CASCADE`, deleting an order also deletes all its items automatically. I use it when child rows have no meaning without the parent.

> **Junior tip:** The alternative is `ON DELETE SET NULL` — sets the foreign key to NULL instead of deleting. Use CASCADE when child rows are useless without the parent; use SET NULL when they can still exist independently.
> **Consejo de entrevista:** La alternativa es `ON DELETE SET NULL` — establece la clave foránea en NULL en lugar de eliminar. Usa CASCADE cuando las filas hijas no tienen sentido sin el padre; usa SET NULL cuando pueden existir de forma independiente.

Red flag answer: "I just delete related rows manually in the application." This is error-prone and slower than letting the database handle it atomically.

**Why would you use a foreign key instead of just storing an ID and trusting the application to keep it consistent?**

Because the database enforces referential integrity even when multiple services, migration scripts, or admin tools access the same database. Without the foreign key, any script can insert an invalid ID and the database accepts it silently. A foreign key is a guarantee, not a convention.

Red flag answer: "Foreign keys slow down the database." There is a small write cost, but the data integrity guarantee is always worth it at junior level.

---

## SELECT

**Why should you avoid `SELECT *` in application code?**

It fetches every column, including ones you do not need, which wastes bandwidth and makes the query slower. It also breaks if the table schema changes — a new column might cause unexpected behaviour in the code that processes the result. Always name the columns you actually need.

> **Junior tip:** Say "it is not explicit" as well as "it is slow." The bigger risk in a team is that a new column silently breaks the code consuming the query result.
> **Consejo de entrevista:** Di "no es explícito" además de "es lento." El mayor riesgo en un equipo es que una nueva columna rompa silenciosamente el código que consume el resultado de la consulta.

**What is a column alias and when is it useful?**

`AS` gives a name to a column or expression in the result. It is useful when you combine columns with an expression — without an alias, PostgreSQL shows `?column?` as the header. For example: `SELECT name || ' (' || nationality || ')' AS author_info FROM authors`.

**What does `DISTINCT` do?**

It removes duplicate rows from the result. When you use multiple columns, it removes rows where the combination of all selected columns is identical. Useful when exploring what unique values exist in a column.

> **Junior tip:** DISTINCT is mostly a diagnostic tool — "how many unique values does this column have?" In production queries you usually control the data well enough not to need it.
> **Consejo de entrevista:** DISTINCT es principalmente una herramienta de diagnóstico — "¿cuántos valores únicos tiene esta columna?" En consultas de producción normalmente controlas los datos lo suficiente como para no necesitarlo.

---

## WHERE

**Why can't you use a column alias in `WHERE`?**

Because SQL evaluates `WHERE` before `SELECT`. The alias does not exist yet when the filter runs. You have to repeat the expression: `WHERE price * 2 > 20` instead of `WHERE double_price > 20`.

> **Junior tip:** The full execution order solves every "why can't I use this here?" question: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Memorise this order.
> **Consejo de entrevista:** El orden de ejecución completo resuelve cada pregunta "¿por qué no puedo usar esto aquí?": FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Memoriza este orden.

**What is the difference between `LIKE` and `ILIKE`?**

`LIKE` is case-sensitive — `'Wood'` and `'wood'` are different. `ILIKE` is case-insensitive — PostgreSQL-specific. Use `ILIKE` when you want search to work regardless of how the user typed it.

> **Junior tip:** `ILIKE` is a PostgreSQL extension. In standard SQL you would write `LOWER(column) LIKE LOWER(pattern)` instead. Know the PostgreSQL shortcut and the portable alternative.
> **Consejo de entrevista:** `ILIKE` es una extensión de PostgreSQL. En SQL estándar escribirías `LOWER(columna) LIKE LOWER(patrón)` en su lugar. Conoce el atajo de PostgreSQL y la alternativa portátil.

**When do you use `IN` instead of multiple `OR` conditions?**

When you want to match one column against a list of values. `IN (11, 13)` is cleaner and faster than `author_id = 11 OR author_id = 13` — PostgreSQL can optimise `IN` internally.

**Why does `WHERE price = NULL` not work?**

Because `NULL` means "unknown" — it cannot be compared with `=`. The result of any comparison with `NULL` is `NULL`, not `true` or `false`. Use `IS NULL` instead: `WHERE price IS NULL`.

> **Junior tip:** This trips up almost every junior. The key insight: NULL is not a value, it is the absence of a value. Any comparison with NULL returns NULL (unknown), never true. This is why `NULL = NULL` is also NULL, not true.
> **Consejo de entrevista:** Esto confunde a casi todos los juniors. La idea clave: NULL no es un valor, es la ausencia de un valor. Cualquier comparación con NULL devuelve NULL (desconocido), nunca true. Por eso `NULL = NULL` también es NULL, no true.

**What does `BETWEEN` do and is it inclusive?**

It filters rows where a value falls inside a range. Yes, both ends are inclusive — `BETWEEN 1945 AND 1987` includes 1945 and 1987. Equivalent to `>= 1945 AND <= 1987`.

---

## ORDER BY and LIMIT

**What is the SQL execution order?**

`FROM` + `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. This is why you can use a column alias in `ORDER BY` (runs after `SELECT`) but not in `WHERE` or `HAVING` (they run before `SELECT`).

> **Junior tip:** Memorise this order — it explains every confusing SQL behaviour. Why can't I use an alias in WHERE? Because SELECT hasn't run yet. Why can't I use COUNT in WHERE? Because GROUP BY hasn't run yet.
> **Consejo de entrevista:** Memoriza este orden — explica todos los comportamientos confusos de SQL. ¿Por qué no puedo usar un alias en WHERE? Porque SELECT aún no se ha ejecutado. ¿Por qué no puedo usar COUNT en WHERE? Porque GROUP BY aún no se ha ejecutado.

**How do you implement pagination with SQL?**

With `LIMIT` and `OFFSET`. `LIMIT` sets how many rows to return, `OFFSET` skips the first N rows. The formula is `OFFSET = (page - 1) * page_size`. For example, page 2 with 10 rows per page: `LIMIT 10 OFFSET 10`.

> **Junior tip:** Know the formula by heart: `OFFSET = (page - 1) * page_size`. Page 1 = OFFSET 0, page 2 = OFFSET 10, page 3 = OFFSET 20.
> **Consejo de entrevista:** Conoce la fórmula de memoria: `OFFSET = (página - 1) * tamaño_de_página`. Página 1 = OFFSET 0, página 2 = OFFSET 10, página 3 = OFFSET 20.

**What happens with NULL values when you sort with `ORDER BY`?**

By default, `ASC` puts NULLs last and `DESC` puts NULLs first. You can override this with `NULLS FIRST` or `NULLS LAST` — for example, `ORDER BY price DESC NULLS LAST` keeps NULLs at the end even when sorting descending.

**Why should you always use `ORDER BY` with `LIMIT`?**

Without `ORDER BY`, the database returns rows in an unspecified order — it can change between runs. If you only take the first 10 rows from an unsorted result, you might get different rows each time. `ORDER BY` makes the result predictable.

---

## JOINs

**What is a JOIN and why do you need it?**

A JOIN combines rows from two or more tables based on a related column — usually a foreign key. Without it you can only query one table at a time. In the bookstore database I use JOIN to get the book title and the author name in a single query instead of running two separate queries.

> **Junior tip:** Always explain the "why" first — without JOIN you need multiple database round trips. JOIN gives you all the data in one query, which is faster and simpler.
> **Consejo de entrevista:** Empieza siempre por el "por qué" — sin JOIN necesitas múltiples viajes a la base de datos. JOIN te da todos los datos en una sola consulta, lo que es más rápido y simple.

**What is the difference between INNER JOIN and LEFT JOIN?**

`INNER JOIN` returns only rows that have a match in both tables — unmatched rows are excluded from the result. `LEFT JOIN` returns all rows from the left table; if there is no match on the right side, those columns come back as NULL. I use `INNER JOIN` when I only want complete data and `LEFT JOIN` when I need to keep all rows from the main table, even ones without a related row.

> **Junior tip:** `JOIN` without a keyword defaults to INNER JOIN. LEFT JOIN is the second most common. RIGHT JOIN and FULL JOIN are rare in practice.
> **Consejo de entrevista:** `JOIN` sin palabra clave equivale a INNER JOIN. LEFT JOIN es el segundo más común. RIGHT JOIN y FULL JOIN son raros en la práctica.

**How do you find rows that have no match in another table?**

With a `LEFT JOIN` combined with `WHERE right_table.id IS NULL`. For example, to find authors with no books: join `authors` to `books` with a LEFT JOIN, then filter where `books.id IS NULL`. The LEFT JOIN keeps all authors; the NULL check keeps only the ones with no book.

> **Junior tip:** This is the "anti-join" pattern. Know it by heart — it comes up constantly in real queries and interviews. LEFT JOIN keeps all left rows; the NULL filter isolates the unmatched ones.
> **Consejo de entrevista:** Este es el patrón "anti-join". Conócelo de memoria — aparece constantemente en consultas reales y entrevistas. LEFT JOIN mantiene todas las filas de la izquierda; el filtro NULL aísla las que no tienen coincidencia.

**What happens when you JOIN three tables?**

You chain the JOINs — each one adds another table to the result. For example, to get customer name, book title, and quantity from an order: start from `order_items`, JOIN `orders` to get the customer ID, JOIN `customers` to get the name, JOIN `books` to get the title. Each JOIN uses the foreign key that connects the two tables.

**When would you choose LEFT JOIN over INNER JOIN?**

When I need all rows from the main table, even ones with no related data. For example, in the finance tracker project, when listing all users and their total expenses — users with no transactions should still appear with zero, not disappear from the result. An INNER JOIN would silently drop them.

Red flag answer: "I always use LEFT JOIN to be safe." That is wrong — LEFT JOIN adds NULLs for unmatched rows and can produce unexpected results if you are not aware of it.

---

## Aggregates and GROUP BY

**What does `COUNT(*)` do and how is it different from `COUNT(column)`?**

`COUNT(*)` counts all rows in the result, including rows with NULL values. `COUNT(column)` counts only rows where that column is not NULL. If a `price` column has NULLs, `COUNT(*)` gives the total number of rows while `COUNT(price)` gives the number of rows that actually have a price.

> **Junior tip:** This distinction matters in real queries. If you are counting how many customers have a phone number on file, `COUNT(phone)` is right — it excludes NULLs. `COUNT(*)` would give you all customers.
> **Consejo de entrevista:** Esta distinción importa en consultas reales. Si cuentas cuántos clientes tienen teléfono, `COUNT(phone)` es correcto — excluye NULLs. `COUNT(*)` te daría todos los clientes.

**What does `GROUP BY` do?**

It collapses multiple rows that share the same value into one row, so aggregate functions can calculate per group. `SELECT author_id, COUNT(*) FROM books GROUP BY author_id` gives one row per author with the count of their books — instead of one count for the whole table.

> **Junior tip:** The rule that trips up every junior: every column in SELECT that is NOT inside an aggregate must be in GROUP BY. If you group by author_id but also SELECT title, the database does not know which title to show — error.
> **Consejo de entrevista:** La regla que confunde a todos los juniors: cada columna en SELECT que NO esté dentro de un agregado debe estar en GROUP BY. Si agrupas por author_id pero también seleccionas title, la base de datos no sabe qué título mostrar — error.

**What is the difference between WHERE and HAVING?**

`WHERE` filters individual rows before grouping. `HAVING` filters groups after grouping. You cannot use an aggregate function in `WHERE` — `WHERE COUNT(*) > 2` is an error. That condition goes in `HAVING`. A query can use both: `WHERE published_year > 2000` reduces the rows first, then `HAVING COUNT(*) > 1` keeps only author groups with more than one matching book.

> **Junior tip:** Simple rule: WHERE = before grouping, HAVING = after grouping. If your condition uses an aggregate (COUNT, SUM, AVG...), it must go in HAVING.
> **Consejo de entrevista:** Regla simple: WHERE = antes de agrupar, HAVING = después de agrupar. Si tu condición usa un agregado (COUNT, SUM, AVG...), debe ir en HAVING.

**What is the SQL execution order?**

`FROM` + `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. This is why you cannot use a `SELECT` alias in `WHERE` or `HAVING` — those run before `SELECT`. You can use it in `ORDER BY` because that runs after.

**What does `COALESCE` do and when do you use it?**

`COALESCE(value, fallback)` returns the first non-NULL argument. You use it when a column might be NULL and you want to show a default value instead. For example, `COALESCE(SUM(o.total_price), 0)` returns 0 for customers with no orders instead of NULL — which is what you want in a total spend report.

> **Junior tip:** COALESCE is most common in aggregate queries — SUM and AVG return NULL when there are no matching rows. Wrap them in COALESCE to show 0 instead of NULL in the result.
> **Consejo de entrevista:** COALESCE es más común en consultas de agregación — SUM y AVG devuelven NULL cuando no hay filas. Envuélvelos en COALESCE para mostrar 0 en lugar de NULL en el resultado.

---

## DML

**How do you insert a row into a table?**

With `INSERT INTO table (columns) VALUES (values)`. You only specify the columns you are setting — `id` is `SERIAL` so you leave it out and the database generates it. In PostgreSQL I use `RETURNING id` at the end to get the generated ID back in the same query, which is useful in a Spring Boot service when you need to return the new resource's ID in the response.

> **Junior tip:** `RETURNING` is PostgreSQL-specific — standard SQL does not have it. In MySQL you would use `LAST_INSERT_ID()`. Since your stack is PostgreSQL, know `RETURNING` cold.
> **Consejo de entrevista:** `RETURNING` es específico de PostgreSQL — el SQL estándar no lo tiene. En MySQL usarías `LAST_INSERT_ID()`. Como tu stack es PostgreSQL, domina `RETURNING`.

**How do you update a row safely?**

`UPDATE table SET column = value WHERE condition`. The WHERE clause is critical — without it, every row in the table gets updated. I always run a `SELECT` with the same WHERE first to confirm which rows will be affected, then run the UPDATE.

> **Junior tip:** The "SELECT first, then UPDATE" habit is what separates careful developers from careless ones. Mention it explicitly in an interview — it shows you think about data safety.
> **Consejo de entrevista:** El hábito de "SELECT primero, luego UPDATE" separa a los desarrolladores cuidadosos de los descuidados. Menciónalo explícitamente en una entrevista — muestra que piensas en la seguridad de los datos.

**How do you delete rows and what should you check first?**

`DELETE FROM table WHERE condition`. Same rule as UPDATE — always include a WHERE clause or you delete the entire table. Before deleting, check if other tables have a foreign key pointing to that row. If they do, the database will reject the delete unless you delete the dependent rows first or the foreign key is set up with `ON DELETE CASCADE`.

**What is the difference between DELETE and TRUNCATE?**

`DELETE` removes rows one by one, supports a WHERE clause, and can be rolled back. `TRUNCATE` removes all rows at once, is much faster on large tables, and resets the `SERIAL` counter. I use `DELETE` in application code because it supports conditions and is safer. `TRUNCATE` is only useful in scripts that reset a table completely — for example, clearing test data before a test run.

**How do you do an "upsert" in PostgreSQL — insert a row, but update it if it already exists?**

With `INSERT ... ON CONFLICT`. If a conflict occurs on a unique column, you can choose to update the existing row instead of throwing an error:

```sql
INSERT INTO users (email, name)
VALUES ('victor@email.com', 'Victor')
ON CONFLICT (email)
DO UPDATE SET name = EXCLUDED.name;
```

`EXCLUDED` refers to the row that would have been inserted. I would use this in the finance tracker when syncing data — if the record exists, update it; if not, create it.

> **Junior tip:** "Upsert" = insert + update in one atomic operation. PostgreSQL uses `ON CONFLICT`; MySQL uses `ON DUPLICATE KEY UPDATE`. Know the PostgreSQL syntax since that is your stack.
> **Consejo de entrevista:** "Upsert" = insert + update en una operación atómica. PostgreSQL usa `ON CONFLICT`; MySQL usa `ON DUPLICATE KEY UPDATE`. Conoce la sintaxis de PostgreSQL ya que es tu stack.

Red flag answer: "I would SELECT first to check if it exists, then INSERT or UPDATE." This works but requires two round trips to the database and has a race condition under concurrent writes. `ON CONFLICT` is atomic.

---

## Subqueries

**What is a subquery and when do you use one instead of a JOIN?**

A query nested inside another query — the inner one runs first and its result is used by the outer one. I use a subquery when I need the result of an aggregation to filter rows, because you cannot use aggregate functions directly in WHERE: `WHERE price > (SELECT AVG(price) FROM books)`. For most other cases I prefer a JOIN because the database can optimise it better.

> **Junior tip:** Rule of thumb — if the subquery returns a single value (scalar) or a short list for IN, a subquery is fine. If you are joining on the result set, prefer a JOIN or a CTE instead.
> **Consejo de entrevista:** Regla general — si la subconsulta devuelve un valor único (escalar) o una lista corta para IN, está bien. Si estás haciendo JOIN sobre el resultado, prefiere un JOIN o un CTE.

**What is the difference between IN and EXISTS in a subquery?**

`IN` collects all results from the subquery first, then checks if the value is in that list. `EXISTS` stops as soon as it finds one match — it does not build the full list. For large tables, `EXISTS` is faster. For small tables the difference is negligible. I use `IN` when the subquery returns a short, readable list of IDs; `EXISTS` when I only need to check whether a related row exists.

---

## Indexes

**What is an index and what problem does it solve?**

An index is a data structure that lets the database find rows without scanning the entire table. Without an index, a `WHERE author_id = 5` on a million-row table reads every row. With an index on `author_id`, the database jumps directly to the matching rows. The trade-off is that indexes slow down writes — every INSERT, UPDATE, and DELETE must also update the index.

> **Junior tip:** The analogy that always works: an index is like the index at the back of a book. Without it you read every page. With it you go directly to the right page. The cost is maintaining that index as the content changes.
> **Consejo de entrevista:** La analogía que siempre funciona: un índice es como el índice al final de un libro. Sin él lees todas las páginas. Con él vas directamente a la página correcta. El coste es mantener ese índice a medida que cambia el contenido.

**Which columns should have an index?**

Columns used frequently in `WHERE`, `JOIN ON`, and `ORDER BY` on large tables. Foreign key columns are the most common case — `books.author_id` is used in every JOIN with `authors`, so it should be indexed. Primary keys and UNIQUE columns get an index automatically. I avoid indexing columns with very few distinct values (like a status with three options) because the database will often do a full scan anyway.

> **Junior tip:** The question "when NOT to index" is as important as "when to index." Too many indexes slow down writes and increase storage. Know both sides.
> **Consejo de entrevista:** La pregunta "cuándo NO indexar" es tan importante como "cuándo indexar." Demasiados índices ralentizan las escrituras y aumentan el almacenamiento. Conoce ambos lados.

**What is a composite index and when would you use one?**

An index on two or more columns. You use it when queries frequently filter or sort by multiple columns together. For example, `CREATE INDEX ON orders(customer_id, created_at)` speeds up `WHERE customer_id = 5 ORDER BY created_at DESC` — a very common query in an order history page. The order of columns matters: the leftmost column is used first.

> **Junior tip:** Composite indexes have a "leading column" rule — the index helps queries that start with the leftmost column. An index on `(customer_id, created_at)` helps `WHERE customer_id = 5` but does NOT help `WHERE created_at > '2024-01-01'` alone.
> **Consejo de entrevista:** Los índices compuestos tienen la regla de la "columna líder" — el índice ayuda a las consultas que empiezan por la columna más a la izquierda. Un índice en `(customer_id, created_at)` ayuda a `WHERE customer_id = 5` pero NO ayuda a `WHERE created_at > '2024-01-01'` solo.

---

## Transactions

**What is a transaction and why do you need one?**

A transaction is a group of SQL statements that execute as a single unit — either all succeed, or none of them do. You need transactions when multiple statements must succeed together. The classic example is a money transfer: subtract from one account and add to another. If the second statement fails, the first must be rolled back — otherwise money disappears.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

> **Junior tip:** Use the bank transfer example — every interviewer will recognise it. Then connect it to your stack: "In Spring Boot, `@Transactional` on a service method wraps everything in a transaction automatically."
> **Consejo de entrevista:** Usa el ejemplo de transferencia bancaria — todo entrevistador lo reconocerá. Luego conéctalo a tu stack: "En Spring Boot, `@Transactional` en un método de servicio envuelve todo en una transacción automáticamente."

**What are the ACID properties?**

ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity means all statements in a transaction succeed or none do. Consistency means the database stays valid before and after. Isolation means concurrent transactions do not interfere with each other. Durability means committed data survives a crash.

> **Junior tip:** You do not need to recite all four perfectly, but you must know Atomicity — that is the one interviewers check first. If you know all four with a one-line explanation each, that is impressive for a junior.
> **Consejo de entrevista:** No necesitas recitar los cuatro perfectamente, pero debes conocer Atomicity — ese es el primero que comprueban los entrevistadores. Si conoces los cuatro con una explicación de una línea cada uno, es impresionante para un junior.

**What is the difference between COMMIT and ROLLBACK?**

`COMMIT` saves all changes made in the current transaction to the database permanently. `ROLLBACK` undoes all changes made since the transaction started — as if they never happened. Use `ROLLBACK` when something goes wrong and you need to revert to a consistent state.

> **Junior tip:** In Spring Boot, `@Transactional` handles COMMIT and ROLLBACK automatically — if the method throws an unchecked exception, Spring rolls back the transaction. Mention this to show you connect SQL knowledge to the framework you will use.
> **Consejo de entrevista:** En Spring Boot, `@Transactional` gestiona COMMIT y ROLLBACK automáticamente — si el método lanza una excepción no comprobada, Spring hace rollback. Menciónalo para mostrar que conectas el conocimiento SQL con el framework.

Red flag answer: "I let the application handle errors instead of using transactions." By the time the application detects the error, the first statement may already be committed and the data is inconsistent.

---

## CTEs and Views

**What is a CTE and when do you use one?**

A CTE (Common Table Expression) is a named temporary result set defined with `WITH`. It makes complex queries more readable by breaking them into named steps instead of nesting subqueries:

```sql
WITH expensive_book_counts AS (
  SELECT author_id, COUNT(*) AS count
  FROM books
  WHERE price > 20
  GROUP BY author_id
)
SELECT a.name, ebc.count
FROM authors a
JOIN expensive_book_counts ebc ON a.id = ebc.author_id;
```

> **Junior tip:** CTEs do not improve performance over subqueries in most cases — the benefit is readability. When a query has multiple levels of nesting, a CTE makes it clear what each step does by giving it a name.
> **Consejo de entrevista:** Los CTEs no mejoran el rendimiento sobre las subconsultas en la mayoría de los casos — el beneficio es la legibilidad. Cuando una consulta tiene varios niveles de anidamiento, un CTE deja claro qué hace cada paso dándole un nombre.

**What is a view and when would you create one?**

A view is a saved query with a name — you query it like a table, but the database runs the underlying query each time. You create one when a complex JOIN or aggregation is used in multiple places. Instead of repeating the same query, you define it once as a view:

```sql
CREATE VIEW books_with_authors AS
SELECT b.title, b.price, a.name AS author_name
FROM books b
JOIN authors a ON b.author_id = a.id;
```

Then: `SELECT * FROM books_with_authors WHERE price > 20;`

> **Junior tip:** A view is not a copy of the data — it is a saved query that runs live every time. This is different from a materialized view, which stores the result and must be refreshed. Regular views always show current data.
> **Consejo de entrevista:** Una vista no es una copia de los datos — es una consulta guardada que se ejecuta en tiempo real cada vez. Esto es diferente de una vista materializada, que almacena el resultado y debe actualizarse. Las vistas regulares siempre muestran datos actuales.

Red flag answer: "A view stores a copy of the data." Wrong — a regular view always runs the underlying query live.

**Why would you use a CTE instead of a subquery?**

Readability. A CTE gives the subquery a name, which makes the main query easier to understand and review. I use a subquery when it is a one-liner and the intent is clear; I switch to a CTE when the logic is complex enough that a name would explain what it does. In team code, CTEs are easier to debug and modify.

Red flag answer: "CTEs are faster than subqueries." Not true in most cases — the query planner treats them similarly. The benefit is clarity, not speed.

---

## Pressure

**You need to show a list of customers and their total spend. Some customers have never placed an order. How do you write this query?**

I use a `LEFT JOIN` so every customer appears, even ones with no orders. Then `SUM(o.total_price)` calculates the total — for customers with no orders it returns NULL, which I wrap in `COALESCE(SUM(o.total_price), 0)` to show zero instead.

```sql
SELECT c.name, COALESCE(SUM(o.total_price), 0) AS total_spend
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total_spend DESC;
```

**The database has 5 million rows in the orders table. A query that filters by `customer_id` is very slow. What would you check first?**

First I would check if there is an index on `customer_id` in the `orders` table — a foreign key does not automatically get an index in PostgreSQL, you have to create it manually. I would run `EXPLAIN` on the query to see if it is doing a sequential scan. If it is, I would add `CREATE INDEX ON orders(customer_id)` and run `EXPLAIN` again to confirm it is now using the index.

Red flag answer: "I would rewrite the SELECT to use fewer columns." That does not fix a missing index. The answer must mention indexes and `EXPLAIN`.

**You have a query with WHERE, GROUP BY, and HAVING. Walk me through the execution order.**

The database runs it in this order: FROM and any JOINs first to build the full dataset, then WHERE to filter individual rows, then GROUP BY to collapse groups, then HAVING to filter those groups, then SELECT to pick the columns, then ORDER BY to sort, and finally LIMIT to cut the result. So if I write `WHERE price > 10 ... HAVING COUNT(*) > 2`, it first removes cheap books, then groups by author, then keeps only authors with more than 2 remaining books.

**You need to find the top 3 authors by total book sales revenue. Write the query.**

```sql
SELECT a.name, SUM(oi.quantity * b.price) AS total_revenue
FROM authors a
JOIN books b ON b.author_id = a.id
JOIN order_items oi ON oi.book_id = b.id
GROUP BY a.id, a.name
ORDER BY total_revenue DESC
LIMIT 3;
```

Red flag answer: writing a query with SUM but without GROUP BY, or forgetting to include `a.id` in GROUP BY when selecting `a.name` — PostgreSQL requires all non-aggregate SELECT columns to be in GROUP BY.
