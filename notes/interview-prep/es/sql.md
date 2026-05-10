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

## Presión

**¿Qué temas de SQL todavía no has aprendido?**
Los JOINs — combinar datos de varias tablas en una sola consulta. Las funciones de agregación como `COUNT`, `SUM` y `AVG`. `GROUP BY` para agrupar filas y calcular totales por grupo. Subconsultas e índices. Estos son los próximos temas que planeo estudiar.
