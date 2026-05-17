# SQL — Preguntas de entrevista

## DDL y restricciones

**¿Cuál es la diferencia entre DDL y DML?**

DDL (Data Definition Language) define la estructura de la base de datos — `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`. DML (Data Manipulation Language) trabaja con los datos — `SELECT`, `INSERT`, `UPDATE`, `DELETE`. En una entrevista, conocer los nombres demuestra que entiendes que SQL tiene diferentes capas.

> **Junior tip:** Interviewers use these terms in questions — "write a DDL statement" means `CREATE TABLE`, not a query. Know both acronyms cold.
> **Consejo de entrevista:** Los entrevistadores usan estos términos — "escribe una sentencia DDL" significa `CREATE TABLE`, no una consulta. Conoce bien los dos acrónimos.

**¿Qué hace `NOT NULL` y por qué es importante?**

Impide que una columna almacene un valor vacío. Sin él, se puede insertar una fila sin ese campo, lo que provoca datos incompletos difíciles de detectar después. En la base de datos de la librería, `name` en `authors` es `NOT NULL` porque un libro sin nombre de autor no sirve de nada.

> **Junior tip:** NOT NULL is a contract — it says "this column must always have a value." Mention that the database enforces it automatically, not the application code.
> **Consejo de entrevista:** NOT NULL es un contrato — dice "esta columna siempre debe tener un valor." Menciona que la base de datos lo garantiza automáticamente, no el código de la aplicación.

**¿Qué hace `UNIQUE`?**

Impide que dos filas tengan el mismo valor en esa columna. Lo uso en los campos de email — `email VARCHAR(100) NOT NULL UNIQUE` — para que dos clientes no puedan registrarse con la misma dirección. La base de datos lo garantiza automáticamente, así que no necesito comprobar duplicados en la aplicación en todos los casos.

**¿Qué es `PRIMARY KEY` y cómo se combina con `SERIAL`?**

`PRIMARY KEY` significa que la columna identifica de forma única cada fila y no puede ser NULL. Combinándolo con `SERIAL` — `id SERIAL PRIMARY KEY` — obtienes un ID auto-incremental que la base de datos genera en cada inserción. No tienes que establecerlo manualmente.

> **Junior tip:** In PostgreSQL, `SERIAL` creates a sequence behind the scenes and sets a default value. It is shorthand — more modern SQL uses `GENERATED ALWAYS AS IDENTITY`, but `SERIAL` is what you will see in most real projects.
> **Consejo de entrevista:** En PostgreSQL, `SERIAL` crea una secuencia internamente y establece un valor por defecto. Es un atajo — el SQL más moderno usa `GENERATED ALWAYS AS IDENTITY`, pero `SERIAL` es lo que verás en la mayoría de proyectos reales.

**¿Cómo defines una clave foránea en SQL?**

Con `REFERENCES` — `author_id INT REFERENCES authors(id)`. Esto le dice a la base de datos que `author_id` debe coincidir con un `id` existente en la tabla `authors`. Si intentas insertar un libro con un `author_id` que no existe, la base de datos lo rechaza.

> **Junior tip:** Foreign keys enforce "referential integrity" — the data is consistent by design, not by luck. No orphaned records, no broken links.
> **Consejo de entrevista:** Las claves foráneas garantizan la "integridad referencial" — los datos son consistentes por diseño, no por suerte. Sin registros huérfanos, sin enlaces rotos.

**¿Cuándo usas `CHAR` en lugar de `VARCHAR`?**

Cuando el valor siempre tiene la misma longitud fija. Uso `CHAR(2)` para códigos de país — `'ES'`, `'DE'`, `'US'` son siempre exactamente dos caracteres. `VARCHAR` también funcionaría, pero `CHAR` indica que la longitud es siempre la misma, lo que aclara la intención.

**¿Qué hace `IF NOT EXISTS` en `CREATE TABLE`?**

Evita un error si la tabla ya existe. Sin él, ejecutar el mismo `CREATE TABLE` dos veces lanza un error. Es útil en scripts de configuración que podrías ejecutar más de una vez — el script es idempotente.

> **Junior tip:** "Idempotent" is a word interviewers like — it means running the operation multiple times gives the same result as running it once. Use it confidently.
> **Consejo de entrevista:** "Idempotente" es una palabra que gusta a los entrevistadores — significa que ejecutar la operación varias veces da el mismo resultado que ejecutarla una vez. Úsala con confianza.

**¿Qué es una restricción `CHECK` y cuándo la usarías?**

`CHECK` permite añadir una condición que cada fila debe cumplir. Por ejemplo, `price NUMERIC(10,2) CHECK (price >= 0)` impide insertar un precio negativo. Es una regla a nivel de base de datos — la aplicación no necesita validarlo por separado.

> **Junior tip:** Know the five constraint types: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, and CHECK. Interviewers sometimes ask you to name them all.
> **Consejo de entrevista:** Conoce los cinco tipos de restricciones: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY y CHECK. A veces los entrevistadores te piden nombrarlos todos.

**¿Por qué PostgreSQL usa `SERIAL` en lugar de `AUTO_INCREMENT` como MySQL?**

Hacen lo mismo — auto-generar un número en cada inserción — pero la palabra clave es diferente. PostgreSQL usa `SERIAL`; MySQL usa `AUTO_INCREMENT`. Como mis prácticas usan MySQL y mi stack personal usa PostgreSQL, conozco ambas sintaxis.

> **Junior tip:** If you have MySQL experience from your internship, expect this comparison. The behaviour is identical; only the syntax differs.
> **Consejo de entrevista:** Si tienes experiencia con MySQL de tus prácticas, espera esta comparación. El comportamiento es idéntico; solo la sintaxis es diferente.

Respuesta de alerta: confundir los dos, o decir que funcionan de manera diferente.

---

## Tipos de datos

**¿Cuál es la diferencia entre `VARCHAR` y `TEXT` en PostgreSQL?**

`VARCHAR(n)` tiene una longitud máxima — úsalo cuando conoces el límite (nombres, emails). `TEXT` no tiene límite — úsalo para contenido largo como descripciones o comentarios. En la práctica, ambos almacenan datos de la misma forma en PostgreSQL, pero `VARCHAR` documenta la intención.

> **Junior tip:** In PostgreSQL, VARCHAR and TEXT have identical storage performance — the difference is intent and the length constraint. Use VARCHAR to communicate "this value should not exceed N characters."
> **Consejo de entrevista:** En PostgreSQL, VARCHAR y TEXT tienen el mismo rendimiento de almacenamiento — la diferencia es la intención y la restricción de longitud. Usa VARCHAR para comunicar "este valor no debería superar N caracteres."

**¿Por qué usas `NUMERIC` para dinero y no `FLOAT`?**

`FLOAT` es un tipo aproximado — puede introducir pequeños errores de redondeo. Para dinero necesitas precisión exacta. `NUMERIC(10,2)` almacena exactamente dos decimales sin redondeo. Usar `FLOAT` para precios es un error clásico que provoca totales incorrectos.

> **Junior tip:** Say "floating point rounding errors" — that is exactly what the interviewer wants to hear. Bonus: even `0.1 + 0.2` is not exactly `0.3` in floating point arithmetic.
> **Consejo de entrevista:** Di "errores de redondeo de punto flotante" — eso es exactamente lo que busca escuchar el entrevistador. Extra: incluso `0.1 + 0.2` no es exactamente `0.3` en aritmética de punto flotante.

Respuesta de alerta: "Usaría FLOAT porque es más sencillo." Esto muestra que no entiendes los requisitos de precisión financiera.

**¿Qué es `SERIAL` y cuándo lo usas?**

Un entero auto-incremental — PostgreSQL genera el siguiente valor automáticamente en cada inserción. Úsalo para claves primarias para no tener que establecer el ID manualmente.

**¿Cuándo usarías `TIMESTAMP` en lugar de `DATE`?**

`DATE` almacena solo el día — bien para fechas de nacimiento o plazos. `TIMESTAMP` almacena fecha y hora — úsalo para eventos como `created_at` o `updated_at` donde necesitas saber exactamente cuándo ocurrió algo.

> **Junior tip:** In a Spring Boot project, `created_at` is almost always `TIMESTAMP` — you need to know when something was created to the second, not just the day.
> **Consejo de entrevista:** En un proyecto Spring Boot, `created_at` es casi siempre `TIMESTAMP` — necesitas saber cuándo se creó algo al segundo, no solo el día.

**¿Cuál es la diferencia entre `TIMESTAMP` y `TIMESTAMPTZ` en PostgreSQL?**

`TIMESTAMP` almacena una fecha y hora sin información de zona horaria — guarda exactamente lo que introduces. `TIMESTAMPTZ` (timestamp with time zone) convierte la hora almacenada a UTC internamente y la convierte de vuelta a la zona horaria de la sesión al leerla. Para aplicaciones web donde los usuarios pueden estar en diferentes zonas horarias, `TIMESTAMPTZ` es casi siempre la elección correcta.

> **Junior tip:** `TIMESTAMPTZ` is a PostgreSQL-specific detail that shows you understand real-world requirements. Use it for `created_at`, `updated_at`, and any event timestamp in a multi-timezone app.
> **Consejo de entrevista:** `TIMESTAMPTZ` es un detalle específico de PostgreSQL que muestra que entiendes los requisitos del mundo real. Úsalo para `created_at`, `updated_at` y cualquier marca de tiempo en una app multi-zona horaria.

Respuesta de alerta: "Siempre uso TIMESTAMP." El entrevistador quiere saber que has pensado en las zonas horarias.

---

## Relaciones entre tablas

**¿Qué es una clave foránea (foreign key)?**

Una columna en una tabla que apunta a la clave primaria de otra tabla. Crea un vínculo entre las dos tablas e impide insertar una fila que haga referencia a algo que no existe. Por ejemplo, `books.author_id` es una clave foránea que apunta a `authors.id`.

> **Junior tip:** Foreign keys enforce referential integrity at the database level — no bug in the application can create orphaned data if the constraint is in place.
> **Consejo de entrevista:** Las claves foráneas garantizan la integridad referencial a nivel de base de datos — ningún error en la aplicación puede crear datos huérfanos si la restricción está en su lugar.

**¿Cuáles son los tres tipos de relaciones entre tablas?**

Uno a muchos — un autor tiene muchos libros; la clave foránea va en el lado "muchos". Muchos a muchos — un pedido puede tener muchos libros y un libro puede aparecer en muchos pedidos; necesitas una tabla intermedia (junction table). Uno a uno — raro, normalmente simplemente combinas las dos tablas.

> **Junior tip:** Be ready to give a real example for each type. One-to-many: author → books. Many-to-many: orders ↔ books via order_items. One-to-one: user → user_profile.
> **Consejo de entrevista:** Prepárate para dar un ejemplo real de cada tipo. Uno a muchos: author → books. Muchos a muchos: orders ↔ books a través de order_items. Uno a uno: user → user_profile.

**¿Cómo identificas qué tipo de relación tienen dos tablas?**

Haz dos preguntas: "¿Puede un A tener muchos B?" y "¿Puede un B tener muchos A?" Si solo la primera es sí, es uno a muchos. Si ambas son sí, es muchos a muchos. Si ninguna es sí, es uno a uno.

**¿Qué es una junction table y cuándo la necesitas?**

Una tabla con dos claves foráneas — una apuntando a cada lado de una relación muchos a muchos. La necesitas cuando dos entidades pueden relacionarse con muchas instancias de la otra. Por ejemplo, `order_items` conecta `orders` y `books`: un pedido tiene muchos libros, y un libro puede aparecer en muchos pedidos.

**¿Qué convenciones de nomenclatura sigues para tablas y columnas?**

Las tablas son en plural y minúsculas con guiones bajos — `authors`, `order_items`. Las claves primarias son siempre `id`. Las claves foráneas siguen el patrón `nombre_tabla_referenciada_singular_id` — por ejemplo `author_id`, `customer_id`. Las columnas booleanas empiezan con `is_` o `has_`. Las columnas de fecha terminan en `_at` — `created_at`, `updated_at`.

> **Junior tip:** Naming conventions show you write code others can read. Mention them confidently — they show professional awareness, not just technical skill.
> **Consejo de entrevista:** Las convenciones de nomenclatura muestran que escribes código que otros pueden leer. Mencionarlas con confianza muestra conciencia profesional, no solo habilidad técnica.

**¿Qué es `ON DELETE CASCADE` y cuándo lo usarías?**

`ON DELETE CASCADE` es una opción en una clave foránea que elimina automáticamente todas las filas dependientes cuando se elimina la fila referenciada. Por ejemplo, si `order_items.order_id` se define con `ON DELETE CASCADE`, eliminar un pedido también elimina todos sus artículos automáticamente. Lo uso cuando las filas hijas no tienen sentido sin el padre.

> **Junior tip:** The alternative is `ON DELETE SET NULL` — sets the foreign key to NULL instead of deleting. Use CASCADE when child rows are useless without the parent; use SET NULL when they can still exist independently.
> **Consejo de entrevista:** La alternativa es `ON DELETE SET NULL` — establece la clave foránea en NULL en lugar de eliminar. Usa CASCADE cuando las filas hijas no tienen sentido sin el padre; usa SET NULL cuando pueden existir de forma independiente.

Respuesta de alerta: "Elimino las filas relacionadas manualmente en la aplicación." Esto es propenso a errores y más lento que dejar que la base de datos lo gestione atómicamente.

**¿Por qué usarías una clave foránea en lugar de simplemente almacenar un ID y confiar en la aplicación para mantener la consistencia?**

Porque la base de datos garantiza la integridad referencial incluso cuando múltiples servicios, scripts de migración o herramientas de administración acceden a la misma base de datos. Sin la clave foránea, cualquier script puede insertar un ID inválido y la base de datos lo acepta silenciosamente. Una clave foránea es una garantía, no una convención.

Respuesta de alerta: "Las claves foráneas ralentizan la base de datos." Hay un pequeño coste en las escrituras, pero la garantía de integridad de datos siempre vale la pena a nivel junior.

---

## SELECT

**¿Por qué debes evitar `SELECT *` en el código de la aplicación?**

Obtiene todas las columnas, incluidas las que no necesitas, lo que desperdicia ancho de banda y hace la consulta más lenta. También puede fallar si cambia el esquema de la tabla — una nueva columna podría causar un comportamiento inesperado en el código que procesa el resultado. Siempre nombra las columnas que realmente necesitas.

> **Junior tip:** Say "it is not explicit" as well as "it is slow." The bigger risk in a team is that a new column silently breaks the code consuming the query result.
> **Consejo de entrevista:** Di "no es explícito" además de "es lento." El mayor riesgo en un equipo es que una nueva columna rompa silenciosamente el código que consume el resultado de la consulta.

**¿Qué es un alias de columna y cuándo es útil?**

`AS` da un nombre a una columna o expresión en el resultado. Es útil cuando combinas columnas con una expresión — sin alias, PostgreSQL muestra `?column?` como cabecera. Por ejemplo: `SELECT name || ' (' || nationality || ')' AS author_info FROM authors`.

**¿Qué hace `DISTINCT`?**

Elimina las filas duplicadas del resultado. Cuando usas varias columnas, elimina las filas donde la combinación de todas las columnas seleccionadas es idéntica. Útil para explorar qué valores únicos existen en una columna.

> **Junior tip:** DISTINCT is mostly a diagnostic tool — "how many unique values does this column have?" In production queries you usually control the data well enough not to need it.
> **Consejo de entrevista:** DISTINCT es principalmente una herramienta de diagnóstico — "¿cuántos valores únicos tiene esta columna?" En consultas de producción normalmente controlas los datos lo suficiente como para no necesitarlo.

---

## WHERE

**¿Por qué no puedes usar un alias de columna en `WHERE`?**

Porque SQL evalúa `WHERE` antes que `SELECT`. El alias todavía no existe cuando se ejecuta el filtro. Tienes que repetir la expresión: `WHERE price * 2 > 20` en lugar de `WHERE double_price > 20`.

> **Junior tip:** The full execution order solves every "why can't I use this here?" question: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Memorise this order.
> **Consejo de entrevista:** El orden de ejecución completo resuelve cada pregunta "¿por qué no puedo usar esto aquí?": FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Memoriza este orden.

**¿Cuál es la diferencia entre `LIKE` e `ILIKE`?**

`LIKE` distingue entre mayúsculas y minúsculas — `'Wood'` y `'wood'` son diferentes. `ILIKE` no distingue — es específico de PostgreSQL. Usa `ILIKE` cuando quieras que la búsqueda funcione independientemente de cómo escribió el usuario.

> **Junior tip:** `ILIKE` is a PostgreSQL extension. In standard SQL you would write `LOWER(column) LIKE LOWER(pattern)` instead. Know the PostgreSQL shortcut and the portable alternative.
> **Consejo de entrevista:** `ILIKE` es una extensión de PostgreSQL. En SQL estándar escribirías `LOWER(columna) LIKE LOWER(patrón)` en su lugar. Conoce el atajo de PostgreSQL y la alternativa portátil.

**¿Cuándo usas `IN` en lugar de múltiples condiciones `OR`?**

Cuando quieres comparar una columna contra una lista de valores. `IN (11, 13)` es más limpio y rápido que `author_id = 11 OR author_id = 13` — PostgreSQL puede optimizar `IN` internamente.

**¿Por qué `WHERE price = NULL` no funciona?**

Porque `NULL` significa "desconocido" — no puede compararse con `=`. El resultado de cualquier comparación con `NULL` es `NULL`, no `true` ni `false`. Usa `IS NULL` en su lugar: `WHERE price IS NULL`.

> **Junior tip:** This trips up almost every junior. The key insight: NULL is not a value, it is the absence of a value. Any comparison with NULL returns NULL (unknown), never true. This is why `NULL = NULL` is also NULL, not true.
> **Consejo de entrevista:** Esto confunde a casi todos los juniors. La idea clave: NULL no es un valor, es la ausencia de un valor. Cualquier comparación con NULL devuelve NULL (desconocido), nunca true. Por eso `NULL = NULL` también es NULL, no true.

**¿Qué hace `BETWEEN` y es inclusivo?**

Filtra las filas donde un valor cae dentro de un rango. Sí, ambos extremos son inclusivos — `BETWEEN 1945 AND 1987` incluye 1945 y 1987. Equivalente a `>= 1945 AND <= 1987`.

---

## ORDER BY y LIMIT

**¿Cuál es el orden de ejecución de SQL?**

`FROM` + `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. Por eso puedes usar un alias de columna en `ORDER BY` (se ejecuta después de `SELECT`) pero no en `WHERE` o `HAVING` (se ejecutan antes de `SELECT`).

> **Junior tip:** Memorise this order — it explains every confusing SQL behaviour. Why can't I use an alias in WHERE? Because SELECT hasn't run yet. Why can't I use COUNT in WHERE? Because GROUP BY hasn't run yet.
> **Consejo de entrevista:** Memoriza este orden — explica todos los comportamientos confusos de SQL. ¿Por qué no puedo usar un alias en WHERE? Porque SELECT aún no se ha ejecutado. ¿Por qué no puedo usar COUNT en WHERE? Porque GROUP BY aún no se ha ejecutado.

**¿Cómo implementas la paginación con SQL?**

Con `LIMIT` y `OFFSET`. `LIMIT` establece cuántas filas devolver, `OFFSET` salta las primeras N filas. La fórmula es `OFFSET = (página - 1) * tamaño_de_página`. Por ejemplo, la página 2 con 10 filas por página: `LIMIT 10 OFFSET 10`.

> **Junior tip:** Know the formula by heart: `OFFSET = (page - 1) * page_size`. Page 1 = OFFSET 0, page 2 = OFFSET 10, page 3 = OFFSET 20.
> **Consejo de entrevista:** Conoce la fórmula de memoria: `OFFSET = (página - 1) * tamaño_de_página`. Página 1 = OFFSET 0, página 2 = OFFSET 10, página 3 = OFFSET 20.

**¿Qué ocurre con los valores NULL cuando ordenas con `ORDER BY`?**

Por defecto, `ASC` pone los NULL al final y `DESC` los pone al principio. Puedes cambiarlo con `NULLS FIRST` o `NULLS LAST` — por ejemplo, `ORDER BY price DESC NULLS LAST` mantiene los NULL al final aunque ordenes de forma descendente.

**¿Por qué siempre debes usar `ORDER BY` con `LIMIT`?**

Sin `ORDER BY`, la base de datos devuelve las filas en un orden no especificado — puede cambiar entre ejecuciones. Si solo tomas las primeras 10 filas de un resultado sin ordenar, podrías obtener filas diferentes cada vez. `ORDER BY` hace el resultado predecible.

---

## JOINs

**¿Qué es un JOIN y por qué lo necesitas?**

Un JOIN combina filas de dos o más tablas basándose en una columna relacionada — normalmente una clave foránea. Sin él solo puedes consultar una tabla a la vez. En la base de datos de la librería uso JOIN para obtener el título del libro y el nombre del autor en una sola consulta en lugar de hacer dos consultas separadas.

> **Junior tip:** Always explain the "why" first — without JOIN you need multiple database round trips. JOIN gives you all the data in one query, which is faster and simpler.
> **Consejo de entrevista:** Empieza siempre por el "por qué" — sin JOIN necesitas múltiples viajes a la base de datos. JOIN te da todos los datos en una sola consulta, lo que es más rápido y simple.

**¿Cuál es la diferencia entre INNER JOIN y LEFT JOIN?**

`INNER JOIN` devuelve solo las filas que tienen coincidencia en ambas tablas — las filas sin coincidencia se excluyen del resultado. `LEFT JOIN` devuelve todas las filas de la tabla de la izquierda; si no hay coincidencia en el lado derecho, esas columnas vienen como NULL. Uso `INNER JOIN` cuando solo quiero datos completos y `LEFT JOIN` cuando necesito mantener todas las filas de la tabla principal, incluso las que no tienen fila relacionada.

> **Junior tip:** `JOIN` without a keyword defaults to INNER JOIN. LEFT JOIN is the second most common. RIGHT JOIN and FULL JOIN are rare in practice.
> **Consejo de entrevista:** `JOIN` sin palabra clave equivale a INNER JOIN. LEFT JOIN es el segundo más común. RIGHT JOIN y FULL JOIN son raros en la práctica.

**¿Cómo encuentras filas que no tienen coincidencia en otra tabla?**

Con un `LEFT JOIN` combinado con `WHERE tabla_derecha.id IS NULL`. Por ejemplo, para encontrar autores sin libros: hago JOIN de `authors` con `books` usando LEFT JOIN, luego filtro donde `books.id IS NULL`. El LEFT JOIN mantiene todos los autores; el filtro NULL mantiene solo los que no tienen ningún libro.

> **Junior tip:** This is the "anti-join" pattern. Know it by heart — it comes up constantly in real queries and interviews. LEFT JOIN keeps all left rows; the NULL filter isolates the unmatched ones.
> **Consejo de entrevista:** Este es el patrón "anti-join". Conócelo de memoria — aparece constantemente en consultas reales y entrevistas. LEFT JOIN mantiene todas las filas de la izquierda; el filtro NULL aísla las que no tienen coincidencia.

**¿Qué ocurre cuando haces JOIN con tres tablas?**

Encadenas los JOINs — cada uno añade otra tabla al resultado. Por ejemplo, para obtener el nombre del cliente, el título del libro y la cantidad de un pedido: empiezas desde `order_items`, JOIN con `orders` para obtener el ID del cliente, JOIN con `customers` para obtener el nombre, JOIN con `books` para obtener el título. Cada JOIN usa la clave foránea que conecta las dos tablas.

**¿Cuándo elegirías LEFT JOIN en lugar de INNER JOIN?**

Cuando necesito todas las filas de la tabla principal, incluso las que no tienen datos relacionados. Por ejemplo, en el proyecto finance tracker, al listar todos los usuarios y sus gastos totales — los usuarios sin transacciones deben aparecer con cero, no desaparecer del resultado. Un INNER JOIN los eliminaría silenciosamente.

Respuesta de alerta: "Siempre uso LEFT JOIN para estar seguro." Eso es incorrecto — LEFT JOIN añade NULLs para las filas sin coincidencia y puede producir resultados inesperados si no eres consciente de ello.

---

## Agregados y GROUP BY

**¿Qué hace `COUNT(*)` y en qué se diferencia de `COUNT(columna)`?**

`COUNT(*)` cuenta todas las filas del resultado, incluyendo las que tienen valores NULL. `COUNT(columna)` cuenta solo las filas donde esa columna no es NULL. Si una columna `price` tiene NULLs, `COUNT(*)` da el número total de filas mientras que `COUNT(price)` da el número de filas que realmente tienen un precio.

> **Junior tip:** This distinction matters in real queries. If you are counting how many customers have a phone number on file, `COUNT(phone)` is right — it excludes NULLs. `COUNT(*)` would give you all customers.
> **Consejo de entrevista:** Esta distinción importa en consultas reales. Si cuentas cuántos clientes tienen teléfono, `COUNT(phone)` es correcto — excluye NULLs. `COUNT(*)` te daría todos los clientes.

**¿Qué hace `GROUP BY`?**

Agrupa múltiples filas que comparten el mismo valor en una sola fila, para que las funciones de agregación puedan calcular por grupo. `SELECT author_id, COUNT(*) FROM books GROUP BY author_id` da una fila por autor con el recuento de sus libros — en lugar de un recuento para toda la tabla.

> **Junior tip:** The rule that trips up every junior: every column in SELECT that is NOT inside an aggregate must be in GROUP BY. If you group by author_id but also SELECT title, the database does not know which title to show — error.
> **Consejo de entrevista:** La regla que confunde a todos los juniors: cada columna en SELECT que NO esté dentro de un agregado debe estar en GROUP BY. Si agrupas por author_id pero también seleccionas title, la base de datos no sabe qué título mostrar — error.

**¿Cuál es la diferencia entre WHERE y HAVING?**

`WHERE` filtra filas individuales antes de agrupar. `HAVING` filtra grupos después de agrupar. No puedes usar una función de agregación en `WHERE` — `WHERE COUNT(*) > 2` es un error. Esa condición va en `HAVING`. Una consulta puede usar ambas: `WHERE published_year > 2000` reduce las filas primero, luego `HAVING COUNT(*) > 1` mantiene solo los grupos de autores con más de un libro coincidente.

> **Junior tip:** Simple rule: WHERE = before grouping, HAVING = after grouping. If your condition uses an aggregate (COUNT, SUM, AVG...), it must go in HAVING.
> **Consejo de entrevista:** Regla simple: WHERE = antes de agrupar, HAVING = después de agrupar. Si tu condición usa un agregado (COUNT, SUM, AVG...), debe ir en HAVING.

**¿Cuál es el orden de ejecución de SQL?**

`FROM` + `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. Por eso no puedes usar un alias de `SELECT` en `WHERE` o `HAVING` — esas cláusulas se ejecutan antes que `SELECT`. Sí puedes usarlo en `ORDER BY` porque se ejecuta después.

**¿Qué hace `COALESCE` y cuándo lo usas?**

`COALESCE(valor, alternativa)` devuelve el primer argumento que no sea NULL. Lo usas cuando una columna puede ser NULL y quieres mostrar un valor por defecto en su lugar. Por ejemplo, `COALESCE(SUM(o.total_price), 0)` devuelve 0 para clientes sin pedidos en lugar de NULL — que es lo que quieres en un informe de gasto total.

> **Junior tip:** COALESCE is most common in aggregate queries — SUM and AVG return NULL when there are no matching rows. Wrap them in COALESCE to show 0 instead of NULL in the result.
> **Consejo de entrevista:** COALESCE es más común en consultas de agregación — SUM y AVG devuelven NULL cuando no hay filas. Envuélvelos en COALESCE para mostrar 0 en lugar de NULL en el resultado.

---

## DML

**¿Cómo insertas una fila en una tabla?**

Con `INSERT INTO tabla (columnas) VALUES (valores)`. Solo especificas las columnas que estás estableciendo — `id` es `SERIAL` así que lo omites y la base de datos lo genera. En PostgreSQL uso `RETURNING id` al final para obtener el ID generado en la misma consulta, lo que es útil en un servicio Spring Boot cuando necesitas devolver el ID del nuevo recurso en la respuesta.

> **Junior tip:** `RETURNING` is PostgreSQL-specific — standard SQL does not have it. In MySQL you would use `LAST_INSERT_ID()`. Since your stack is PostgreSQL, know `RETURNING` cold.
> **Consejo de entrevista:** `RETURNING` es específico de PostgreSQL — el SQL estándar no lo tiene. En MySQL usarías `LAST_INSERT_ID()`. Como tu stack es PostgreSQL, domina `RETURNING`.

**¿Cómo actualizas una fila de forma segura?**

`UPDATE tabla SET columna = valor WHERE condición`. La cláusula WHERE es crítica — sin ella, cada fila de la tabla se actualiza. Siempre ejecuto primero un `SELECT` con el mismo WHERE para confirmar qué filas se verán afectadas, luego ejecuto el UPDATE.

> **Junior tip:** The "SELECT first, then UPDATE" habit is what separates careful developers from careless ones. Mention it explicitly in an interview — it shows you think about data safety.
> **Consejo de entrevista:** El hábito de "SELECT primero, luego UPDATE" separa a los desarrolladores cuidadosos de los descuidados. Menciónalo explícitamente en una entrevista — muestra que piensas en la seguridad de los datos.

**¿Cómo eliminas filas y qué debes comprobar primero?**

`DELETE FROM tabla WHERE condición`. La misma regla que UPDATE — incluye siempre una cláusula WHERE o eliminarás toda la tabla. Antes de eliminar, comprueba si otras tablas tienen una clave foránea apuntando a esa fila. Si es así, la base de datos rechazará el delete a menos que elimines primero las filas dependientes o la clave foránea esté configurada con `ON DELETE CASCADE`.

**¿Cuál es la diferencia entre DELETE y TRUNCATE?**

`DELETE` elimina filas una a una, soporta una cláusula WHERE y puede revertirse. `TRUNCATE` elimina todas las filas a la vez, es mucho más rápido en tablas grandes y resetea el contador `SERIAL`. Uso `DELETE` en el código de la aplicación porque soporta condiciones y es más seguro. `TRUNCATE` solo es útil en scripts que resetean una tabla completamente — por ejemplo, para limpiar datos de prueba antes de un test.

**¿Cómo haces un "upsert" en PostgreSQL — insertar una fila, pero actualizarla si ya existe?**

Con `INSERT ... ON CONFLICT`. Si ocurre un conflicto en una columna única, puedes elegir actualizar la fila existente en lugar de lanzar un error:

```sql
INSERT INTO users (email, name)
VALUES ('victor@email.com', 'Victor')
ON CONFLICT (email)
DO UPDATE SET name = EXCLUDED.name;
```

`EXCLUDED` hace referencia a la fila que se habría insertado. Usaría esto en el finance tracker al sincronizar datos — si el registro existe, actualizarlo; si no, crearlo.

> **Junior tip:** "Upsert" = insert + update in one atomic operation. PostgreSQL uses `ON CONFLICT`; MySQL uses `ON DUPLICATE KEY UPDATE`. Know the PostgreSQL syntax since that is your stack.
> **Consejo de entrevista:** "Upsert" = insert + update en una operación atómica. PostgreSQL usa `ON CONFLICT`; MySQL usa `ON DUPLICATE KEY UPDATE`. Conoce la sintaxis de PostgreSQL ya que es tu stack.

Respuesta de alerta: "Haría primero un SELECT para comprobar si existe, luego INSERT o UPDATE." Funciona pero requiere dos viajes a la base de datos y tiene una condición de carrera en escrituras concurrentes. `ON CONFLICT` es atómico.

---

## Subconsultas

**¿Qué es una subconsulta y cuándo usas una en lugar de un JOIN?**

Una consulta anidada dentro de otra — la interior se ejecuta primero y su resultado es usado por la exterior. Uso una subconsulta cuando necesito el resultado de una agregación para filtrar filas, porque no puedes usar funciones de agregación directamente en WHERE: `WHERE price > (SELECT AVG(price) FROM books)`. Para la mayoría de otros casos prefiero un JOIN porque la base de datos puede optimizarlo mejor.

> **Junior tip:** Rule of thumb — if the subquery returns a single value (scalar) or a short list for IN, a subquery is fine. If you are joining on the result set, prefer a JOIN or a CTE instead.
> **Consejo de entrevista:** Regla general — si la subconsulta devuelve un valor único (escalar) o una lista corta para IN, está bien. Si estás haciendo JOIN sobre el resultado, prefiere un JOIN o un CTE.

**¿Cuál es la diferencia entre IN y EXISTS en una subconsulta?**

`IN` recoge todos los resultados de la subconsulta primero, luego comprueba si el valor está en esa lista. `EXISTS` se detiene en cuanto encuentra una coincidencia — no construye la lista completa. En tablas grandes, `EXISTS` es más rápido. En tablas pequeñas la diferencia es insignificante. Uso `IN` cuando la subconsulta devuelve una lista corta y legible de IDs; `EXISTS` cuando solo necesito comprobar si existe una fila relacionada.

---

## Índices

**¿Qué es un índice y qué problema resuelve?**

Un índice es una estructura de datos que permite a la base de datos encontrar filas sin escanear toda la tabla. Sin índice, un `WHERE author_id = 5` en una tabla de un millón de filas lee cada fila. Con un índice en `author_id`, la base de datos salta directamente a las filas coincidentes. La contrapartida es que los índices ralentizan las escrituras — cada INSERT, UPDATE y DELETE debe actualizar también el índice.

> **Junior tip:** The analogy that always works: an index is like the index at the back of a book. Without it you read every page. With it you go directly to the right page. The cost is maintaining that index as the content changes.
> **Consejo de entrevista:** La analogía que siempre funciona: un índice es como el índice al final de un libro. Sin él lees todas las páginas. Con él vas directamente a la página correcta. El coste es mantener ese índice a medida que cambia el contenido.

**¿Qué columnas deben tener un índice?**

Las columnas usadas frecuentemente en `WHERE`, `JOIN ON` y `ORDER BY` en tablas grandes. Las columnas de clave foránea son el caso más común — `books.author_id` se usa en cada JOIN con `authors`, por lo que debería tener un índice. Las claves primarias y las columnas UNIQUE reciben un índice automáticamente. Evito indexar columnas con muy pocos valores distintos (como un estado con tres opciones) porque la base de datos suele hacer un escaneo completo de todas formas.

> **Junior tip:** The question "when NOT to index" is as important as "when to index." Too many indexes slow down writes and increase storage. Know both sides.
> **Consejo de entrevista:** La pregunta "cuándo NO indexar" es tan importante como "cuándo indexar." Demasiados índices ralentizan las escrituras y aumentan el almacenamiento. Conoce ambos lados.

**¿Qué es un índice compuesto y cuándo lo usarías?**

Un índice sobre dos o más columnas. Lo usas cuando las consultas filtran u ordenan frecuentemente por varias columnas juntas. Por ejemplo, `CREATE INDEX ON orders(customer_id, created_at)` acelera `WHERE customer_id = 5 ORDER BY created_at DESC` — una consulta muy común en una página de historial de pedidos. El orden de las columnas importa: la columna más a la izquierda se usa primero.

> **Junior tip:** Composite indexes have a "leading column" rule — the index helps queries that start with the leftmost column. An index on `(customer_id, created_at)` helps `WHERE customer_id = 5` but does NOT help `WHERE created_at > '2024-01-01'` alone.
> **Consejo de entrevista:** Los índices compuestos tienen la regla de la "columna líder" — el índice ayuda a las consultas que empiezan por la columna más a la izquierda. Un índice en `(customer_id, created_at)` ayuda a `WHERE customer_id = 5` pero NO ayuda a `WHERE created_at > '2024-01-01'` solo.

---

## Transacciones

**¿Qué es una transacción y por qué la necesitas?**

Una transacción es un grupo de sentencias SQL que se ejecutan como una sola unidad — o todas tienen éxito, o ninguna lo tiene. Las necesitas cuando múltiples sentencias deben tener éxito juntas. El ejemplo clásico es una transferencia de dinero: restas de una cuenta y añades a otra. Si la segunda sentencia falla, la primera debe revertirse — de lo contrario el dinero desaparece.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

> **Junior tip:** Use the bank transfer example — every interviewer will recognise it. Then connect it to your stack: "In Spring Boot, `@Transactional` on a service method wraps everything in a transaction automatically."
> **Consejo de entrevista:** Usa el ejemplo de transferencia bancaria — todo entrevistador lo reconocerá. Luego conéctalo a tu stack: "En Spring Boot, `@Transactional` en un método de servicio envuelve todo en una transacción automáticamente."

**¿Cuáles son las propiedades ACID?**

ACID son las siglas de Atomicity (Atomicidad), Consistency (Consistencia), Isolation (Aislamiento) y Durability (Durabilidad). Atomicidad significa que todas las sentencias de una transacción tienen éxito o ninguna lo tiene. Consistencia significa que la base de datos permanece en un estado válido antes y después. Aislamiento significa que las transacciones concurrentes no interfieren entre sí. Durabilidad significa que los datos confirmados sobreviven a un fallo del sistema.

> **Junior tip:** You do not need to recite all four perfectly, but you must know Atomicity — that is the one interviewers check first. If you know all four with a one-line explanation each, that is impressive for a junior.
> **Consejo de entrevista:** No necesitas recitar los cuatro perfectamente, pero debes conocer Atomicity — ese es el primero que comprueban los entrevistadores. Si conoces los cuatro con una explicación de una línea cada uno, es impresionante para un junior.

**¿Cuál es la diferencia entre COMMIT y ROLLBACK?**

`COMMIT` guarda de forma permanente todos los cambios realizados en la transacción actual en la base de datos. `ROLLBACK` deshace todos los cambios realizados desde que comenzó la transacción — como si nunca hubieran ocurrido. Usa `ROLLBACK` cuando algo sale mal y necesitas volver a un estado consistente.

> **Junior tip:** In Spring Boot, `@Transactional` handles COMMIT and ROLLBACK automatically — if the method throws an unchecked exception, Spring rolls back the transaction. Mention this to show you connect SQL knowledge to the framework you will use.
> **Consejo de entrevista:** En Spring Boot, `@Transactional` gestiona COMMIT y ROLLBACK automáticamente — si el método lanza una excepción no comprobada, Spring hace rollback. Menciónalo para mostrar que conectas el conocimiento SQL con el framework.

Respuesta de alerta: "Dejo que la aplicación gestione los errores en lugar de usar transacciones." Para cuando la aplicación detecta el error, la primera sentencia puede que ya esté confirmada y los datos son inconsistentes.

---

## CTEs y Vistas

**¿Qué es un CTE y cuándo lo usas?**

Un CTE (Common Table Expression) es un conjunto de resultados temporal con nombre definido con `WITH`. Hace que las consultas complejas sean más legibles dividiéndolas en pasos con nombre en lugar de anidar subconsultas:

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

**¿Qué es una vista y cuándo crearías una?**

Una vista es una consulta guardada con nombre — la consultas como si fuera una tabla, pero la base de datos ejecuta la consulta subyacente cada vez. Creas una cuando un JOIN complejo o una agregación se usa en varios lugares. En lugar de repetir la misma consulta, la defines una vez como vista:

```sql
CREATE VIEW books_with_authors AS
SELECT b.title, b.price, a.name AS author_name
FROM books b
JOIN authors a ON b.author_id = a.id;
```

Luego: `SELECT * FROM books_with_authors WHERE price > 20;`

> **Junior tip:** A view is not a copy of the data — it is a saved query that runs live every time. This is different from a materialized view, which stores the result and must be refreshed. Regular views always show current data.
> **Consejo de entrevista:** Una vista no es una copia de los datos — es una consulta guardada que se ejecuta en tiempo real cada vez. Esto es diferente de una vista materializada, que almacena el resultado y debe actualizarse. Las vistas regulares siempre muestran datos actuales.

Respuesta de alerta: "Una vista almacena una copia de los datos." Incorrecto — una vista regular siempre ejecuta la consulta subyacente en tiempo real.

**¿Por qué usarías un CTE en lugar de una subconsulta?**

Legibilidad. Un CTE da nombre a la subconsulta, lo que hace la consulta principal más fácil de entender y revisar. Uso una subconsulta cuando es una sola línea y la intención es clara; cambio a un CTE cuando la lógica es suficientemente compleja para que un nombre explique lo que hace. En código de equipo, los CTEs son más fáciles de depurar y modificar.

Respuesta de alerta: "Los CTEs son más rápidos que las subconsultas." No es cierto en la mayoría de los casos — el planificador de consultas los trata de forma similar. El beneficio es la claridad, no la velocidad.

---

## Presión

**Necesitas mostrar una lista de clientes y su gasto total. Algunos clientes nunca han hecho un pedido. ¿Cómo escribes esta consulta?**

Uso un `LEFT JOIN` para que aparezcan todos los clientes, incluso los que no tienen pedidos. Luego `SUM(o.total_price)` calcula el total — para clientes sin pedidos devuelve NULL, que envuelvo en `COALESCE(SUM(o.total_price), 0)` para mostrar cero en lugar de NULL.

```sql
SELECT c.name, COALESCE(SUM(o.total_price), 0) AS total_spend
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total_spend DESC;
```

**La base de datos tiene 5 millones de filas en la tabla orders. Una consulta que filtra por `customer_id` es muy lenta. ¿Qué comprobarías primero?**

Primero comprobaría si hay un índice en `customer_id` en la tabla `orders` — una clave foránea no recibe un índice automáticamente en PostgreSQL, hay que crearlo manualmente. Ejecutaría `EXPLAIN` en la consulta para ver si está haciendo un escaneo secuencial. Si es así, añadiría `CREATE INDEX ON orders(customer_id)` y ejecutaría `EXPLAIN` de nuevo para confirmar que ahora usa el índice.

Respuesta de alerta: "Reescribiría el SELECT para usar menos columnas." Eso no soluciona un índice que falta. La respuesta debe mencionar los índices y `EXPLAIN`.

**Tienes una consulta con WHERE, GROUP BY y una cláusula HAVING. Explícame el orden de ejecución.**

La base de datos lo ejecuta en este orden: primero FROM y cualquier JOIN para construir el conjunto de datos completo, luego WHERE para filtrar filas individuales, luego GROUP BY para colapsar grupos, luego HAVING para filtrar esos grupos, luego SELECT para seleccionar las columnas, luego ORDER BY para ordenar, y finalmente LIMIT para recortar el resultado. Así que si escribo `WHERE price > 10 ... HAVING COUNT(*) > 2`, primero elimina los libros baratos, luego agrupa por autor, luego mantiene solo los autores con más de 2 libros restantes.

**Necesitas encontrar los 3 autores con mayor ingresos totales por ventas de libros. Escribe la consulta.**

```sql
SELECT a.name, SUM(oi.quantity * b.price) AS total_revenue
FROM authors a
JOIN books b ON b.author_id = a.id
JOIN order_items oi ON oi.book_id = b.id
GROUP BY a.id, a.name
ORDER BY total_revenue DESC
LIMIT 3;
```

Respuesta de alerta: escribir una consulta con SUM pero sin GROUP BY, o olvidar incluir `a.id` en GROUP BY al seleccionar `a.name` — PostgreSQL requiere que todas las columnas SELECT no agregadas estén en GROUP BY.
