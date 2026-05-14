# SQL — Preguntas de entrevista

## DDL y restricciones

**¿Cuál es la diferencia entre DDL y DML?**
DDL (Data Definition Language) define la estructura de la base de datos — `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`. DML (Data Manipulation Language) trabaja con los datos — `SELECT`, `INSERT`, `UPDATE`, `DELETE`. En una entrevista, conocer los nombres demuestra que entiendes que SQL tiene diferentes capas.

**¿Qué hace `NOT NULL` y por qué es importante?**
Impide que una columna almacene un valor vacío. Sin él, se puede insertar una fila sin ese campo, lo que provoca datos incompletos difíciles de detectar después. En la base de datos de la librería, `name` en `authors` es `NOT NULL` porque un libro sin nombre de autor no sirve de nada.

**¿Qué hace `UNIQUE`?**
Impide que dos filas tengan el mismo valor en esa columna. Lo uso en los campos de email — `email VARCHAR(100) NOT NULL UNIQUE` — para que dos clientes no puedan registrarse con la misma dirección. La base de datos lo garantiza automáticamente, así que no necesito comprobar duplicados en la aplicación en todos los casos.

**¿Qué es `PRIMARY KEY` y cómo se combina con `SERIAL`?**
`PRIMARY KEY` significa que la columna identifica de forma única cada fila y no puede ser NULL. Combinándolo con `SERIAL` — `id SERIAL PRIMARY KEY` — obtienes un ID auto-incremental que la base de datos genera en cada inserción. No tienes que establecerlo manualmente.

**¿Cómo defines una clave foránea en SQL?**
Con `REFERENCES` — `author_id INT REFERENCES authors(id)`. Esto le dice a la base de datos que `author_id` debe coincidir con un `id` existente en la tabla `authors`. Si intentas insertar un libro con un `author_id` que no existe, la base de datos lo rechaza.

**¿Cuándo usas `CHAR` en lugar de `VARCHAR`?**
Cuando el valor siempre tiene la misma longitud fija. Uso `CHAR(2)` para códigos de país — `'ES'`, `'DE'`, `'US'` son siempre exactamente dos caracteres. `VARCHAR` también funcionaría, pero `CHAR` indica que la longitud es siempre la misma, lo que aclara la intención.

**¿Qué hace `IF NOT EXISTS` en `CREATE TABLE`?**
Evita un error si la tabla ya existe. Sin él, ejecutar el mismo `CREATE TABLE` dos veces lanza un error. Es útil en scripts de configuración que podrías ejecutar más de una vez — el script es idempotente.

---

## Tipos de datos

**¿Cuál es la diferencia entre `VARCHAR` y `TEXT` en PostgreSQL?**
`VARCHAR(n)` tiene una longitud máxima — úsalo cuando conoces el límite (nombres, emails). `TEXT` no tiene límite — úsalo para contenido largo como descripciones o comentarios. En la práctica, ambos almacenan datos de la misma forma en PostgreSQL, pero `VARCHAR` documenta la intención.

**¿Por qué usas `NUMERIC` para dinero y no `FLOAT`?**
`FLOAT` es un tipo aproximado — puede introducir pequeños errores de redondeo. Para dinero necesitas precisión exacta. `NUMERIC(10,2)` almacena exactamente dos decimales sin redondeo. Usar `FLOAT` para precios es un error clásico que provoca totales incorrectos.

**¿Qué es `SERIAL` y cuándo lo usas?**
Un entero auto-incremental — PostgreSQL genera el siguiente valor automáticamente en cada inserción. Úsalo para claves primarias para no tener que establecer el ID manualmente.

**¿Cuándo usarías `TIMESTAMP` en lugar de `DATE`?**
`DATE` almacena solo el día — bien para fechas de nacimiento o plazos. `TIMESTAMP` almacena fecha y hora — úsalo para eventos como `created_at` o `updated_at` donde necesitas saber exactamente cuándo ocurrió algo.

---

## Relaciones entre tablas

**¿Qué es una clave foránea (foreign key)?**
Una columna en una tabla que apunta a la clave primaria de otra tabla. Crea un vínculo entre las dos tablas e impide insertar una fila que haga referencia a algo que no existe. Por ejemplo, `books.author_id` es una clave foránea que apunta a `authors.id`.

**¿Cuáles son los tres tipos de relaciones entre tablas?**
Uno a muchos — un autor tiene muchos libros; la clave foránea va en el lado "muchos". Muchos a muchos — un pedido puede tener muchos libros y un libro puede aparecer en muchos pedidos; necesitas una tabla intermedia (junction table). Uno a uno — raro, normalmente simplemente combinas las dos tablas.

**¿Cómo identificas qué tipo de relación tienen dos tablas?**
Haz dos preguntas: "¿Puede un A tener muchos B?" y "¿Puede un B tener muchos A?" Si solo la primera es sí, es uno a muchos. Si ambas son sí, es muchos a muchos. Si ninguna es sí, es uno a uno.

**¿Qué es una junction table y cuándo la necesitas?**
Una tabla con dos claves foráneas — una apuntando a cada lado de una relación muchos a muchos. La necesitas cuando dos entidades pueden relacionarse con muchas instancias de la otra. Por ejemplo, `order_items` conecta `orders` y `books`: un pedido tiene muchos libros, y un libro puede aparecer en muchos pedidos.

**¿Qué convenciones de nomenclatura sigues para tablas y columnas?**
Las tablas son en plural y minúsculas con guiones bajos — `authors`, `order_items`. Las claves primarias son siempre `id`. Las claves foráneas siguen el patrón `nombre_tabla_referenciada_singular_id` — por ejemplo `author_id`, `customer_id`. Las columnas booleanas empiezan con `is_` o `has_`. Las columnas de fecha terminan en `_at` — `created_at`, `updated_at`.

---

## SELECT

**¿Por qué debes evitar `SELECT *` en el código de la aplicación?**
Obtiene todas las columnas, incluidas las que no necesitas, lo que desperdicia ancho de banda y hace la consulta más lenta. También puede fallar si cambia el esquema de la tabla — una nueva columna podría provocar un comportamiento inesperado. Siempre nombra las columnas que realmente necesitas.

**¿Qué es un alias de columna y cuándo es útil?**
`AS` da un nombre a una columna o expresión en el resultado. Es útil cuando combinas columnas con una expresión — sin alias, PostgreSQL muestra `?column?` como cabecera. Por ejemplo: `SELECT name || ' (' || nationality || ')' AS author_info FROM authors`.

**¿Qué hace `DISTINCT`?**
Elimina las filas duplicadas del resultado. Cuando usas varias columnas, elimina las filas donde la combinación de todas las columnas seleccionadas es idéntica. Útil para explorar qué valores únicos existen en una columna.

---

## WHERE

**¿Por qué no puedes usar un alias de columna en `WHERE`?**
Porque SQL evalúa `WHERE` antes que `SELECT`. El alias todavía no existe cuando se ejecuta el filtro. Tienes que repetir la expresión: `WHERE price * 2 > 20` en lugar de `WHERE double_price > 20`.

**¿Cuál es la diferencia entre `LIKE` e `ILIKE`?**
`LIKE` distingue entre mayúsculas y minúsculas — `'Wood'` y `'wood'` son diferentes. `ILIKE` no distingue — es específico de PostgreSQL. Usa `ILIKE` cuando quieras que la búsqueda funcione independientemente de cómo escribió el usuario.

**¿Cuándo usas `IN` en lugar de múltiples condiciones `OR`?**
Cuando quieres comparar una columna contra una lista de valores. `IN (11, 13)` es más limpio y rápido que `author_id = 11 OR author_id = 13` — PostgreSQL puede optimizar `IN` internamente.

**¿Por qué `WHERE price = NULL` no funciona?**
Porque `NULL` significa "desconocido" — no puede compararse con `=`. El resultado de cualquier comparación con `NULL` es `NULL`, no `true` ni `false`. Usa `IS NULL` en su lugar: `WHERE price IS NULL`.

**¿Qué hace `BETWEEN` y es inclusivo?**
Filtra las filas donde un valor cae dentro de un rango. Sí, ambos extremos son inclusivos — `BETWEEN 1945 AND 1987` incluye 1945 y 1987. Equivalente a `>= 1945 AND <= 1987`.

---

## ORDER BY y LIMIT

**¿Cuál es el orden de ejecución de SQL?**
`FROM` → `WHERE` → `SELECT` → `ORDER BY` → `LIMIT`. Por eso puedes usar un alias de columna en `ORDER BY` (se ejecuta después de `SELECT`) pero no en `WHERE` (se ejecuta antes de `SELECT`).

**¿Cómo implementas la paginación con SQL?**
Con `LIMIT` y `OFFSET`. `LIMIT` establece cuántas filas devolver, `OFFSET` salta las primeras N filas. La fórmula es `OFFSET = (página - 1) * tamaño_de_página`. Por ejemplo, la página 2 con 10 filas por página: `LIMIT 10 OFFSET 10`.

**¿Qué ocurre con los valores NULL cuando ordenas con `ORDER BY`?**
Por defecto, `ASC` pone los NULL al final y `DESC` los pone al principio. Puedes cambiarlo con `NULLS FIRST` o `NULLS LAST` — por ejemplo, `ORDER BY price DESC NULLS LAST` mantiene los NULL al final aunque ordenes de forma descendente.

**¿Por qué siempre debes usar `ORDER BY` con `LIMIT`?**
Sin `ORDER BY`, la base de datos devuelve las filas en un orden no especificado — puede cambiar entre ejecuciones. Si solo tomas las primeras 10 filas de un resultado sin ordenar, podrías obtener filas diferentes cada vez. `ORDER BY` hace el resultado predecible.

---

## JOINs

**¿Qué es un JOIN y por qué lo necesitas?**
Un JOIN combina filas de dos o más tablas basándose en una columna relacionada — normalmente una clave foránea. Sin él solo puedes consultar una tabla a la vez. En la base de datos de la librería uso JOIN para obtener el título del libro y el nombre del autor en una sola consulta en lugar de hacer dos consultas separadas.

**¿Cuál es la diferencia entre INNER JOIN y LEFT JOIN?**
`INNER JOIN` devuelve solo las filas que tienen coincidencia en ambas tablas — las filas sin coincidencia se excluyen del resultado. `LEFT JOIN` devuelve todas las filas de la tabla de la izquierda; si no hay coincidencia en el lado derecho, esas columnas vienen como NULL. Uso `INNER JOIN` cuando solo quiero datos completos y `LEFT JOIN` cuando necesito mantener todas las filas de la tabla principal, incluso las que no tienen fila relacionada.

**¿Cómo encuentras filas que no tienen coincidencia en otra tabla?**
Con un `LEFT JOIN` combinado con `WHERE tabla_derecha.id IS NULL`. Por ejemplo, para encontrar autores sin libros: hago JOIN de `authors` con `books` usando LEFT JOIN, luego filtro donde `books.id IS NULL`. El LEFT JOIN mantiene todos los autores; el filtro NULL mantiene solo los que no tienen ningún libro.

**¿Qué ocurre cuando haces JOIN con tres tablas?**
Encadenas los JOINs — cada uno añade otra tabla al resultado. Por ejemplo, para obtener el nombre del cliente, el título del libro y la cantidad de un pedido: empiezas desde `order_items`, JOIN con `orders` para obtener el ID del cliente, JOIN con `customers` para obtener el nombre, JOIN con `books` para obtener el título. Cada JOIN usa la clave foránea que conecta las dos tablas.

---

## Agregados y GROUP BY

**¿Qué hace `COUNT(*)` y en qué se diferencia de `COUNT(columna)`?**
`COUNT(*)` cuenta todas las filas del resultado, incluyendo las que tienen valores NULL. `COUNT(columna)` cuenta solo las filas donde esa columna no es NULL. Si una columna `price` tiene NULLs, `COUNT(*)` da el número total de filas mientras que `COUNT(price)` da el número de filas que realmente tienen un precio.

**¿Qué hace `GROUP BY`?**
Agrupa múltiples filas que comparten el mismo valor en una sola fila, para que las funciones de agregación puedan calcular por grupo. `SELECT author_id, COUNT(*) FROM books GROUP BY author_id` da una fila por autor con el recuento de sus libros — en lugar de un recuento para toda la tabla.

**¿Cuál es la diferencia entre WHERE y HAVING?**
`WHERE` filtra filas individuales antes de agrupar. `HAVING` filtra grupos después de agrupar. No puedes usar una función de agregación en `WHERE` — `WHERE COUNT(*) > 2` es un error. Esa condición va en `HAVING`. Una consulta puede usar ambas: `WHERE published_year > 2000` reduce las filas primero, luego `HAVING COUNT(*) > 1` mantiene solo los grupos de autores con más de un libro coincidente.

**¿Cuál es el orden de ejecución de SQL?**
`FROM` + `JOIN` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. Por eso no puedes usar un alias de `SELECT` en `WHERE` o `HAVING` — esas cláusulas se ejecutan antes que `SELECT`. Sí puedes usarlo en `ORDER BY` porque se ejecuta después.

---

## DML

**¿Cómo insertas una fila en una tabla?**
Con `INSERT INTO tabla (columnas) VALUES (valores)`. Solo especificas las columnas que estás estableciendo — `id` es `SERIAL` así que lo omites y la base de datos lo genera. En PostgreSQL uso `RETURNING id` al final para obtener el ID generado en la misma consulta, lo que es útil en un servicio Spring Boot cuando necesitas devolver el ID del nuevo recurso en la respuesta.

**¿Cómo actualizas una fila de forma segura?**
`UPDATE tabla SET columna = valor WHERE condición`. La cláusula WHERE es crítica — sin ella, cada fila de la tabla se actualiza. Siempre ejecuto primero un `SELECT` con el mismo WHERE para confirmar qué filas se verán afectadas, luego ejecuto el UPDATE.

**¿Cómo eliminas filas y qué debes comprobar primero?**
`DELETE FROM tabla WHERE condición`. La misma regla que UPDATE — incluye siempre una cláusula WHERE o eliminarás toda la tabla. Antes de eliminar, comprueba si otras tablas tienen una clave foránea apuntando a esa fila. Si es así, la base de datos rechazará el delete a menos que elimines primero las filas dependientes o la clave foránea esté configurada con `ON DELETE CASCADE`.

**¿Cuál es la diferencia entre DELETE y TRUNCATE?**
`DELETE` elimina filas una a una, soporta una cláusula WHERE y puede revertirse. `TRUNCATE` elimina todas las filas a la vez, es mucho más rápido en tablas grandes y resetea el contador `SERIAL`. Uso `DELETE` en el código de la aplicación porque soporta condiciones y es más seguro. `TRUNCATE` solo es útil en scripts que resetean una tabla completamente — por ejemplo, para limpiar datos de prueba antes de un test.

---

## Subconsultas

**¿Qué es una subconsulta y cuándo usas una en lugar de un JOIN?**
Una consulta anidada dentro de otra — la interior se ejecuta primero y su resultado es usado por la exterior. Uso una subconsulta cuando necesito el resultado de una agregación para filtrar filas, porque no puedes usar funciones de agregación directamente en WHERE: `WHERE price > (SELECT AVG(price) FROM books)`. Para la mayoría de otros casos prefiero un JOIN porque la base de datos puede optimizarlo mejor.

**¿Cuál es la diferencia entre IN y EXISTS en una subconsulta?**
`IN` recoge todos los resultados de la subconsulta primero, luego comprueba si el valor está en esa lista. `EXISTS` se detiene en cuanto encuentra una coincidencia — no construye la lista completa. En tablas grandes, `EXISTS` es más rápido. En tablas pequeñas la diferencia es insignificante. Uso `IN` cuando la subconsulta devuelve una lista corta y legible de IDs; `EXISTS` cuando solo necesito comprobar si existe una fila relacionada.

---

## Índices

**¿Qué es un índice y qué problema resuelve?**
Un índice es una estructura de datos que permite a la base de datos encontrar filas sin escanear toda la tabla. Sin índice, un `WHERE author_id = 5` en una tabla de un millón de filas lee cada fila. Con un índice en `author_id`, la base de datos salta directamente a las filas coincidentes. La contrapartida es que los índices ralentizan las escrituras — cada INSERT, UPDATE y DELETE debe actualizar también el índice.

**¿Qué columnas deben tener un índice?**
Las columnas usadas frecuentemente en `WHERE`, `JOIN ON` y `ORDER BY` en tablas grandes. Las columnas de clave foránea son el caso más común — `books.author_id` se usa en cada JOIN con `authors`, por lo que debería tener un índice. Las claves primarias y las columnas UNIQUE reciben un índice automáticamente. Evito indexar columnas con muy pocos valores distintos (como un estado con tres opciones) porque la base de datos suele hacer un escaneo completo de todas formas.

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
