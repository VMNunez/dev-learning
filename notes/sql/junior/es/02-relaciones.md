## Índice de esta nota

- [SQL — Definir un esquema](#sql--definir-un-esquema)

1. [Declarar una tabla con `CREATE TABLE`](#declarar-una-tabla-con-create-table)
   - [Qué fija un `CREATE TABLE` para todos los clientes](#qué-fija-un-create-table-para-todos-los-clientes)
   - [Restricciones de columna y restricciones de tabla](#restricciones-de-columna-y-restricciones-de-tabla)
   - [Nombres de restricción y los errores que los citan](#nombres-de-restricción-y-los-errores-que-los-citan)
   - [Tres sentencias de una fila para probar una tabla](#tres-sentencias-de-una-fila-para-probar-una-tabla)
2. [`DEFAULT` — el valor que se usa cuando un insert omite una columna](#default--el-valor-que-se-usa-cuando-un-insert-omite-una-columna)
   - [Una columna omitida frente a un `NULL` explícito](#una-columna-omitida-frente-a-un-null-explícito)
3. [`NOT NULL`, `CHECK` y `UNIQUE` — reglas sobre los valores de una fila](#not-null-check-y-unique--reglas-sobre-los-valores-de-una-fila)
   - [`NOT NULL` hace obligatorio un valor](#not-null-hace-obligatorio-un-valor)
   - [`CHECK` rechaza lo falso y deja pasar lo desconocido](#check-rechaza-lo-falso-y-deja-pasar-lo-desconocido)
   - [`UNIQUE` rechaza valores repetidos, pero no `NULL`s repetidos](#unique-rechaza-valores-repetidos-pero-no-nulls-repetidos)
   - [Unicidad sobre varias columnas](#unicidad-sobre-varias-columnas)
   - [Las cuatro reglas, lado a lado](#las-cuatro-reglas-lado-a-lado)
4. [Claves — cómo se identifica una fila](#claves--cómo-se-identifica-una-fila)
   - [El grano de una tabla](#el-grano-de-una-tabla)
   - [Claves candidatas y clave primaria](#claves-candidatas-y-clave-primaria)
   - [Clave primaria frente a `UNIQUE`](#clave-primaria-frente-a-unique)
   - [Claves naturales y claves sustitutas](#claves-naturales-y-claves-sustitutas)
5. [Claves foráneas — cómo una fila se refiere a una fila de otra tabla](#claves-foráneas--cómo-una-fila-se-refiere-a-una-fila-de-otra-tabla)
   - [Qué comprueba `REFERENCES`](#qué-comprueba-references)
   - [A qué puede apuntar una clave foránea](#a-qué-puede-apuntar-una-clave-foránea)
6. [Tipos de relación — cuántas filas hay en cada lado](#tipos-de-relación--cuántas-filas-hay-en-cada-lado)
   - [Dos preguntas distinguen los tipos](#dos-preguntas-distinguen-los-tipos)
7. [Dónde colocar la clave foránea y cómo construir una tabla intermedia](#dónde-colocar-la-clave-foránea-y-cómo-construir-una-tabla-intermedia)
   - [Por qué la clave foránea va en el lado "muchos"](#por-qué-la-clave-foránea-va-en-el-lado-muchos)
   - [Una tabla intermedia guarda una fila por pareja](#una-tabla-intermedia-guarda-una-fila-por-pareja)
   - [Uno a uno es una clave foránea que además es única](#uno-a-uno-es-una-clave-foránea-que-además-es-única)
8. [Comportamiento de ON DELETE](#comportamiento-de-on-delete)
   - [Qué hace cada acción con las filas hijas](#qué-hace-cada-acción-con-las-filas-hijas)
   - [`NO ACTION` frente a `RESTRICT` — cuándo se ejecuta la comprobación](#no-action-frente-a-restrict--cuándo-se-ejecuta-la-comprobación)
   - [`ON UPDATE` solo actúa cuando cambia la clave referenciada](#on-update-solo-actúa-cuando-cambia-la-clave-referenciada)
9. [Normalización — cada hecho se guarda una vez](#normalización--cada-hecho-se-guarda-una-vez)
   - [Tres anomalías de una tabla que guarda copias](#tres-anomalías-de-una-tabla-que-guarda-copias)
   - [`unit_price` es un hecho de la venta, no una copia](#unit_price-es-un-hecho-de-la-venta-no-una-copia)
10. [Leer un esquema relacional antes de consultarlo](#leer-un-esquema-relacional-antes-de-consultarlo)
    - [El esquema de práctica, leído tabla por tabla](#el-esquema-de-práctica-leído-tabla-por-tabla)
    - [Lo que la lectura revela que falta](#lo-que-la-lectura-revela-que-falta)
11. [Modificar una tabla con `ALTER TABLE`](#modificar-una-tabla-con-alter-table)
    - [Añadir, cambiar y eliminar una columna](#añadir-cambiar-y-eliminar-una-columna)
    - [Añadir y eliminar una restricción](#añadir-y-eliminar-una-restricción)
    - [Valores por defecto en una tabla que ya tiene filas](#valores-por-defecto-en-una-tabla-que-ya-tiene-filas)
    - [Las herramientas de migración ejecutan estas mismas sentencias](#las-herramientas-de-migración-ejecutan-estas-mismas-sentencias)
12. [Añadir una restricción a una tabla que ya tiene filas](#añadir-una-restricción-a-una-tabla-que-ya-tiene-filas)
    - [Corrige primero las filas y añade después la restricción](#corrige-primero-las-filas-y-añade-después-la-restricción)
13. [`DROP` elimina la tabla; `DELETE` y `TRUNCATE` eliminan filas](#drop-elimina-la-tabla-delete-y-truncate-eliminan-filas)
    - [Qué se lleva por delante `DROP TABLE`](#qué-se-lleva-por-delante-drop-table)
14. [Convenciones de nombres](#convenciones-de-nombres)
15. [Lo que desbloquea este capítulo](#lo-que-desbloquea-este-capítulo)

# SQL — Definir un esquema

Docs: https://www.postgresql.org/docs/current/ddl.html → lee: "Chapter 5. Data Definition" — las secciones 5.1 a 5.7 (tablas, valores por defecto, restricciones y modificación de tablas), que es lo que sigue este capítulo

---

[01-tipos-de-datos.md](01-tipos-de-datos.md) dejó claro qué es un valor suelto: qué acepta cada tipo, cómo se convierte un valor y qué se mantiene exacto en un cálculo. Terminó en el punto del que parte este capítulo: un valor todavía necesita una tabla donde vivir, una forma de distinguir su fila de todas las demás y reglas que digan qué valores rechaza la tabla. El script de datos que ejecutaste en [00-sql-y-bases-de-datos-relacionales.md](00-sql-y-bases-de-datos-relacionales.md) ya contiene ocho sentencias `CREATE TABLE`, y esa introducción te enseñó a leer las dos primeras partes de la definición de una columna: el nombre y el tipo de dato. Este capítulo trata de todo lo que se escribe después del tipo, y de la tabla como conjunto.

Algunas de esas reglas conectan una tabla con otra. El capítulo 00 mostró que la fila de _1984_ guarda `1` en `author_id`, y que el autor cuyo `id` es `1` es George Orwell. Ese número es el único vínculo entre las dos filas. Sin una regla sobre él, nada impide que un libro guarde `99` en `author_id`, el `id` de un autor que no existe: PostgreSQL lo almacenaría, y toda consulta que buscara el autor de ese libro no encontraría a nadie. La regla que rechaza ese valor es una **clave foránea** (_foreign key_), y este capítulo la declara junto con las reglas que protegen cada fila por separado.

El capítulo se construye en cuatro etapas, y cada una necesita la anterior. Empieza por la sentencia que declara una tabla, `CREATE TABLE`, y por las tres sentencias cortas que se usan para probarla. Con una tabla ya creada, pasa a las reglas sobre los valores de una sola fila: el valor por defecto, `NOT NULL`, `CHECK` y `UNIQUE`. La segunda etapa es la identidad, porque una regla que conecta dos tablas necesita que cada fila se pueda identificar antes: primero las claves, luego las claves foráneas, después los tipos de relación que construyen las claves foráneas y, por último, qué ocurre con las filas que apuntan a una fila que borras. La tercera etapa se aparta de las reglas sueltas para mirar el diseño completo: explica por qué los datos se reparten en varias tablas y cómo se lee un esquema antes de consultarlo. La última etapa es el cambio con el tiempo: `ALTER TABLE` para una tabla que ya existe, por qué una regla nueva puede fallar con filas que ya están guardadas y qué elimina `DROP`. El capítulo se cierra con las convenciones de nombres y con el traspaso al capítulo 03.

> **Todos los experimentos de este capítulo cambian la base de datos de práctica, y una tabla hay que borrarla a mano.** El capítulo crea una tabla propia, `wishlist_items`, y la usa en casi todas las secciones. El script de datos del capítulo 00 no la conoce. Por eso, antes de volver a ejecutar ese script para deshacer tus experimentos, ejecuta primero `DROP TABLE IF EXISTS wishlist_items;`. La sección [Qué se lleva por delante `DROP TABLE`](#qué-se-lleva-por-delante-drop-table) explica qué sale mal si te saltas ese paso.

---

## Declarar una tabla con `CREATE TABLE`

Docs: https://www.postgresql.org/docs/current/ddl-basics.html → lee: "5.1. Table Basics" — crear y borrar una tabla, con el primer ejemplo de una lista de columnas

La librería necesita una lista de deseos: cada cliente puede guardar la lista de libros que quiere, y la tienda puede avisarle cuando uno baje de precio. Ninguna tabla de la base de datos de práctica guarda eso, así que la declaras tú. Abre una Query Tool sobre `practice_junior_notes`, como mostró el capítulo 00, y ejecuta esta sentencia:

```sql
CREATE TABLE wishlist_items (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  book_id     INT NOT NULL REFERENCES books(id),
  priority    INT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  max_price   NUMERIC(8,2) CHECK (max_price > 0),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wishlist_items_customer_book_key UNIQUE (customer_id, book_id)
);
```

La pestaña Messages responde `CREATE TABLE`. La tabla ya existe, vacía, en **practice_junior_notes → Schemas → public → Tables** del Object Explorer (haz clic derecho en **Tables** y elige **Refresh…** si no aparece).

Lee la sentencia antes de meter una sola fila en la tabla. Cada columna lleva el tipo que el capítulo 01 te enseñó a elegir, y después del tipo viene una regla o un valor por defecto. Cada una de esas palabras tiene una sección que la enseña:

| Parte de la sentencia | Qué declara | Dónde se enseña |
|---|---|---|
| `GENERATED ALWAYS AS IDENTITY` | PostgreSQL genera el `id` | [01-tipos-de-datos.md](01-tipos-de-datos.md), en la sección _Columnas identity y `SERIAL`_ |
| `PRIMARY KEY` | la columna que identifica cada fila | [Claves — cómo se identifica una fila](#claves--cómo-se-identifica-una-fila) |
| `NOT NULL` | el valor es obligatorio | [`NOT NULL` hace obligatorio un valor](#not-null-hace-obligatorio-un-valor) |
| `REFERENCES customers(id)` | el valor tiene que ser el `id` de un cliente que existe | [Claves foráneas — cómo una fila se refiere a una fila de otra tabla](#claves-foráneas--cómo-una-fila-se-refiere-a-una-fila-de-otra-tabla) |
| `ON DELETE CASCADE` | qué les pasa a estas filas cuando se borra su cliente | [Comportamiento de ON DELETE](#comportamiento-de-on-delete) |
| `DEFAULT 3`, `DEFAULT now()` | el valor que se usa cuando un insert omite la columna | [`DEFAULT` — el valor que se usa cuando un insert omite una columna](#default--el-valor-que-se-usa-cuando-un-insert-omite-una-columna) |
| `CHECK (...)` | una condición que tiene que cumplir todo valor | [`CHECK` rechaza lo falso y deja pasar lo desconocido](#check-rechaza-lo-falso-y-deja-pasar-lo-desconocido) |
| `UNIQUE (customer_id, book_id)` | el mismo cliente no puede apuntar el mismo libro dos veces | [Unicidad sobre varias columnas](#unicidad-sobre-varias-columnas) |

La columna de la izquierda cita la sentencia, para que encuentres cada parte en ella. La de la derecha es tu orden de lectura para el resto del capítulo: todas las filas menos la primera apuntan a una sección de este archivo, y la primera a la sección del capítulo 01 que ya estudiaste.

`now()` devuelve la fecha y la hora actuales como un `TIMESTAMPTZ`. [14-particularidades-de-postgresql.md](14-particularidades-de-postgresql.md) la enseña junto con las demás funciones de fecha de PostgreSQL. Por ahora, lee `DEFAULT now()` como "el momento en que se insertó la fila".

### Qué fija un `CREATE TABLE` para todos los clientes

`CREATE TABLE` es una sentencia **DDL**. DDL (_Data Definition Language_, lenguaje de definición de datos) es el nombre de las sentencias que crean, cambian y eliminan objetos de la base de datos, como las tablas, frente a las sentencias que leen o cambian filas. La definición que guarda no es una sugerencia. A partir de ahora, PostgreSQL compara con ella cada fila que cualquier cliente intente guardar en `wishlist_items`:

1. Un cliente envía un `INSERT` o un `UPDATE` para `wishlist_items`.
2. En un `INSERT`, PostgreSQL rellena cada columna que la sentencia omitió con el valor por defecto de esa columna. Un `UPDATE` conserva los valores guardados de las columnas que no nombra.
3. Convierte cada valor nuevo al tipo de la columna, como describió el capítulo 01.
4. Comprueba la fila contra todas las reglas de la definición: `NOT NULL`, `CHECK`, `UNIQUE`, `PRIMARY KEY` y las claves foráneas.
5. Si alguna regla falla, se rechaza la sentencia entera y no se guarda nada.

Eso es lo que significa en la práctica que "la base de datos lo hace cumplir". La aplicación Spring Boot, pgAdmin y el script de un compañero llegan a la tabla por esos cinco pasos. Ninguno de ellos puede decidir por su cuenta guardar una entrada de la lista de deseos con una prioridad de 9 o para un cliente que no existe. La aplicación todavía puede comprobar esas mismas cosas antes, para dar al usuario un mensaje más amable. Lo que ya no puede es decidir que la regla no le afecta.

Por eso también lees la definición completa **antes** de cargar datos. La definición decide cuáles de tus sentencias `INSERT` se aceptarán. Si escribes primero los inserts y lees la tabla después, cada regla que no conocías te llega como un error, una sentencia tras otra.

Una definición no es fija para siempre. `ALTER TABLE` la cambia una vez creada la tabla: añade y elimina columnas, cambia el tipo o el valor por defecto de una columna, y añade y elimina reglas. La sección [Modificar una tabla con `ALTER TABLE`](#modificar-una-tabla-con-alter-table) la enseña, y la sección siguiente muestra por qué una regla nueva puede fallar con filas que ya están guardadas.

### Restricciones de columna y restricciones de tabla

Una **restricción** (_constraint_) es una regla declarada sobre una tabla, que PostgreSQL comprueba en cada fila, como mostró el capítulo 00 con la valoración de una reseña. `CREATE TABLE` acepta una restricción en dos sitios.

Una **restricción de columna** se escribe dentro de la definición de una columna, después del tipo. Se aplica solo a esa columna. `NOT NULL`, `DEFAULT 3` (en rigor un valor por defecto y no una regla, pero escrito en el mismo sitio), `CHECK (priority BETWEEN 1 AND 5)` y `REFERENCES customers(id)` se escriben así en la sentencia de arriba.

Una **restricción de tabla** se escribe como un elemento propio de la lista, separado de las columnas por una coma, y nombra las columnas a las que se aplica. La última línea de la sentencia es una:

```sql
  CONSTRAINT wishlist_items_customer_book_key UNIQUE (customer_id, book_id)
```

Una regla que afecta a **varias columnas** tiene que ser una restricción de tabla, porque ninguna definición de columna puede hablar de otra columna. "Este cliente y este libro juntos" es una regla de ese tipo. Una regla sobre una sola columna se puede escribir de cualquiera de las dos formas, y las dos significan exactamente lo mismo:

```sql
-- Restricción de columna: dentro de la definición de priority
priority INT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),

-- Restricción de tabla: un elemento propio, que nombra la columna que comprueba
priority INT NOT NULL DEFAULT 3,
CHECK (priority BETWEEN 1 AND 5),
```

Usa la forma de columna para una regla de una sola columna, porque así la regla queda junto a la columna que protege. Usa la forma de tabla cuando la regla abarca varias columnas.

### Nombres de restricción y los errores que los citan

Toda restricción tiene un nombre, y para todos los tipos de regla salvo `NOT NULL`, PostgreSQL cita ese nombre en el error que lanza cuando una fila incumple la regla. Ya viste uno en el capítulo 00: `reviews_rating_check`.

`CONSTRAINT wishlist_items_customer_book_key` le da un nombre explícito a la regla compuesta. Donde no escribes ningún nombre, PostgreSQL construye uno con el nombre de la tabla, los nombres de las columnas y un sufijo según el tipo de regla:

| Tipo de regla | Sufijo | Nombre que le da PostgreSQL en `wishlist_items` |
|---|---|---|
| Clave primaria | `_pkey` | `wishlist_items_pkey` |
| Unique | `_key` | `wishlist_items_customer_id_book_id_key`, si la línea de arriba no tuviera nombre |
| Check | `_check` | `wishlist_items_priority_check`, `wishlist_items_max_price_check` |
| Clave foránea | `_fkey` | `wishlist_items_customer_id_fkey`, `wishlist_items_book_id_fkey` |
| Not null | `_not_null` | `wishlist_items_priority_not_null`, y uno por cada otra columna `NOT NULL` |

La fila de `NOT NULL` es nueva en PostgreSQL 18, la versión instalada en tu máquina: las versiones anteriores guardan `NOT NULL` como una marca de la columna, sin nombre. Su error nombra la columna en lugar de la restricción, como muestra la sección [Una columna omitida frente a un `NULL` explícito](#una-columna-omitida-frente-a-un-null-explícito). En los otros cuatro tipos, el sufijo es lo que te dice, dentro de un mensaje de error, qué tipo de regla rechazó la fila. Los nombres generados sirven para reglas de una sola columna. Ponle tú el nombre a una regla cuando el nombre generado quede largo o no diga para qué sirve la regla, porque ese nombre es el que leerás en un stack trace de la aplicación.

En pgAdmin, despliega **Tables → wishlist_items → Constraints** en el Object Explorer para ver, con sus nombres, las reglas de clave primaria, unique, check y clave foránea de la tabla.

### Tres sentencias de una fila para probar una tabla

Una tabla recién declarada se prueba intentando guardar filas en ella y observando qué acepta PostgreSQL. Eso requiere tres sentencias, cada una en su forma más corta. [08-dml.md](08-dml.md) enseña las tres por completo: varias filas en una sola sentencia, copiar filas desde una consulta, recuperar los valores generados y por qué es peligroso olvidar el `WHERE`. Aquí solo necesitas la forma de cada una.

**`INSERT` añade una fila.** Nombras la tabla, listas las columnas para las que das valores y das los valores en el mismo orden:

```sql
INSERT INTO wishlist_items (customer_id, book_id)
VALUES (1, 4);
```

Esto dice: en `wishlist_items`, añade una fila cuyo `customer_id` es 1 y cuyo `book_id` es 4. El cliente 1 es Ana García, y el libro 4 es _Emma_. Cada columna que no está en la lista (`id`, `priority`, `max_price`, `added_at`) la rellena el paso 2 de los cinco pasos de arriba. Para ver la fila guardada, léela de vuelta con la forma de `SELECT` que usó el capítulo 00:

```sql
SELECT id, customer_id, book_id, priority, max_price, added_at
FROM wishlist_items;
```

```
 id | customer_id | book_id | priority | max_price | added_at
----+-------------+---------+----------+-----------+-------------------------------
  1 |           1 |       4 |        3 |    [null] | 2026-10-26 17:13:29.188568+01
```

`id` vino de la columna identity, `priority` de `DEFAULT 3` y `added_at` de `DEFAULT now()`, así que tu marca de tiempo será el momento en que ejecutaste el insert. `max_price` no tiene valor por defecto, así que guarda `NULL`.

**`UPDATE` cambia los valores de filas que ya existen.** Nombras la tabla, dices qué columna toma qué valor nuevo después de `SET` y dices qué filas después de `WHERE`:

```sql
UPDATE wishlist_items
SET priority = 1
WHERE id = 1;
```

Esto dice: en `wishlist_items`, para la fila cuyo `id` es 1, pon `priority` a 1. El valor nuevo pasa por las mismas comprobaciones que un valor insertado, así que `SET priority = 9` lo rechazaría el `CHECK`. El capítulo 00 ya ejecutó un `UPDATE` de esta forma sobre `books`.

**`DELETE` elimina filas.** Nombras la tabla y dices qué filas después de `WHERE`:

```sql
DELETE FROM customers
WHERE id = 8;
```

Esto dice: elimina de `customers` la fila cuyo `id` es 8. No la ejecutes todavía. La sección [Qué hace cada acción con las filas hijas](#qué-hace-cada-acción-con-las-filas-hijas) la ejecuta, porque borrar una fila es donde las claves foráneas empiezan a actuar.

> **`WHERE id = n` es lo que limita estas sentencias a una sola fila.** `id` es la clave primaria, así que como mucho una fila tiene ese valor. Sin `WHERE`, `UPDATE` y `DELETE` actúan sobre todas las filas de la tabla. Todos los `UPDATE` y `DELETE` de este capítulo llevan un `WHERE` por esa razón, y casi todos nombran un único `id`; [08-dml.md](08-dml.md) enseña cómo comprobar qué filas alcanza un `WHERE` antes de cambiarlas.

## `DEFAULT` — el valor que se usa cuando un insert omite una columna

Docs: https://www.postgresql.org/docs/current/ddl-default.html → lee: "5.2. Default Values" — cuándo se usa un valor por defecto, el valor por defecto nulo y una expresión evaluada en el momento del insert

El insert de arriba dio valores para dos columnas, y la fila guardada tenía seis. Escribir todas las columnas en cada insert sería tedioso, y para algunas columnas el valor correcto es siempre el mismo: una entrada nueva de la lista de deseos empieza con la prioridad intermedia, y se añadió ahora. Un **valor por defecto** (_default value_) es el valor que PostgreSQL escribe en una columna cuando un insert no da ninguno.

```sql
priority    INT NOT NULL DEFAULT 3 ...,
added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
```

Dos detalles de la definición deciden cómo se comporta un valor por defecto:

- **Un valor por defecto puede ser una expresión, y la expresión se evalúa en cada insert.** `now()` no se calcula cuando se crea la tabla. Se calcula cada vez que una fila lo necesita, así que cada fila recibe el momento de su propio insert. El script de datos usa la misma idea en `joined_date DATE NOT NULL DEFAULT CURRENT_DATE`, en `customers`.
- **Una columna sin cláusula `DEFAULT` tiene igualmente un valor por defecto: `NULL`.** Por eso `max_price` salió como `NULL`. Omitir una columna sin valor por defecto guarda `NULL` en ella, o falla si la columna es `NOT NULL`.

Ya conociste un valor por defecto sin saber su nombre. En [01-tipos-de-datos.md](01-tipos-de-datos.md), la sección _Columnas identity y `SERIAL`_ mostró que `SERIAL` se expande en una columna cuyo valor por defecto es `nextval(...)`, una llamada que toma el número siguiente de una secuencia. Es un valor por defecto corriente: solo se usa cuando el insert omite `id`.

### Una columna omitida frente a un `NULL` explícito

La regla es precisa: un valor por defecto se usa cuando el insert **omite la columna**. No se usa cuando el insert le da a la columna un valor, y un `NULL` escrito en la sentencia cuenta como un valor dado. El cliente 2, Luis Pérez, también quiere _Emma_, y este insert nombra `priority` y le da `NULL`:

```sql
-- MAL: priority está nombrada, así que su valor por defecto no se usa, y NULL se guarda o se rechaza
INSERT INTO wishlist_items (customer_id, book_id, priority)
VALUES (2, 4, NULL);
```

```
ERROR:  null value in column "priority" of relation "wishlist_items" violates not-null constraint
DETAIL:  Failing row contains (2, 2, 4, null, null, 2026-10-26 17:14:02.531207+01).
```

La primera línea nombra el fallo: un `NULL` llegó a `priority`, que es `NOT NULL`. La línea `DETAIL` muestra la fila que PostgreSQL construyó antes de rechazarla. Lee sus valores en el orden de columnas de la tabla: `id` 2, `customer_id` 2, `book_id` 4, `priority` null. `DEFAULT 3` no sustituyó al `NULL`, porque la sentencia pidió `NULL` de forma explícita. Una columna sin `NOT NULL` lo habría guardado.

Omitir la columna, o escribir en su lugar la palabra clave `DEFAULT`, consigue el valor por defecto en ambos casos:

```sql
-- BIEN: la palabra clave DEFAULT pide el valor por defecto de la columna
INSERT INTO wishlist_items (customer_id, book_id, priority)
VALUES (2, 4, DEFAULT);
```

La palabra clave es útil cuando la lista de columnas es fija, por ejemplo en un insert que construye tu aplicación, y solo algunas filas deben recibir el valor por defecto. También funciona en un `UPDATE`: `SET priority = DEFAULT` devuelve el valor por defecto a la columna.

> **¿Por qué la aplicación no puede enviar `null` y dejar que la base de datos lo rellene?** Porque la base de datos no tiene forma de distinguir "no tengo valor" de "el valor es `NULL`". Los dos llegan como `NULL`. Solo omitir la columna de la sentencia dice "usa el valor por defecto". Esto importa con un ORM, que por defecto escribe todas las columnas mapeadas en su `INSERT`: un campo que queda en `null` en el objeto Java llega a la tabla como un `NULL` explícito, y el valor por defecto de la columna nunca se ejecuta.

Lee ahora la tabla de vuelta, ordenada por `id` (`ORDER BY` pide un orden, que un resultado no tiene si no se lo pides, como mostró el capítulo 00):

```sql
SELECT id, customer_id, book_id, priority
FROM wishlist_items
ORDER BY id;
```

```
 id | customer_id | book_id | priority
----+-------------+---------+----------
  1 |           1 |       4 |        1
  3 |           2 |       4 |        3
```

No hay fila 2. El insert rechazado tomó el número 2 de la secuencia de la columna identity antes de fallar, y un número tomado no se devuelve nunca. [01-tipos-de-datos.md](01-tipos-de-datos.md) avisó de estos huecos en su sección _Columnas identity y `SERIAL`_.

Un valor por defecto tiene un límite más: actúa solo en el momento en que se inserta una fila. Añadirle un valor por defecto a una tabla que ya tiene filas no cambia esas filas. Eso pertenece a `ALTER TABLE`, y la sección [Valores por defecto en una tabla que ya tiene filas](#valores-por-defecto-en-una-tabla-que-ya-tiene-filas) lo muestra.

## `NOT NULL`, `CHECK` y `UNIQUE` — reglas sobre los valores de una fila

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html → lee: "5.5.1. Check Constraints", "5.5.2. Not-Null Constraints" y "5.5.3. Unique Constraints"

Un tipo de dato limita qué clase de valor admite una columna: un número, no un texto. No puede decir que una prioridad va de 1 a 5, que toda entrada de la lista de deseos tiene un libro, o que un email pertenece a un solo cliente. Esas son reglas del negocio, y estas tres restricciones las declaran.

### `NOT NULL` hace obligatorio un valor

Una columna acepta `NULL` salvo que su definición diga otra cosa. `NOT NULL` dice que toda fila tiene que tener un valor en esa columna. Acabas de verlo rechazar una fila, en la sección [Una columna omitida frente a un `NULL` explícito](#una-columna-omitida-frente-a-un-null-explícito), con el SQL state `23502`.

Se decide columna por columna, según lo que significan los datos:

- `customer_id` y `book_id` son `NOT NULL` porque una entrada de la lista de deseos sin cliente, o sin libro, no describe nada.
- `max_price` admite nulos porque un cliente puede querer un libro a cualquier precio. Ahí `NULL` significa "no se indicó un precio máximo", que es un estado real de los datos, no una entrada que falta.

Ese segundo caso es la pregunta que hay que hacerse en cada columna: ¿`NULL` significa algo verdadero sobre esta fila, o solo significaría que alguien se olvidó? Si solo puede significar un error, declara la columna `NOT NULL`.

### `CHECK` rechaza lo falso y deja pasar lo desconocido

Una **restricción check** (_check constraint_) es una condición escrita entre paréntesis después de `CHECK`. PostgreSQL la evalúa para cada fila que va a guardar, y rechaza la fila cuando la condición es falsa:

```sql
INSERT INTO wishlist_items (customer_id, book_id, priority)
VALUES (2, 5, 9);
```

```
ERROR:  new row for relation "wishlist_items" violates check constraint "wishlist_items_priority_check"
```

Es el mismo tipo de mensaje que el capítulo 00 mostró para una reseña con valoración 9, ahora nombrando la regla de esta tabla, con el SQL state `23514`.

La regla exacta tiene un tercer caso, y es el que sorprende. El capítulo 00 mostró que una comparación con `NULL` da `NULL` como respuesta, que SQL trata como "desconocido". Una condición `CHECK` tiene por tanto tres resultados posibles, y PostgreSQL rechaza solo uno de ellos:

| La condición se evalúa como | La fila se | Ejemplo con `CHECK (max_price > 0)` |
|---|---|---|
| verdadero | acepta | `max_price` = 12.00 |
| falso | rechaza | `max_price` = -5 |
| desconocido (`NULL`) | **acepta** | `max_price` = `NULL`, porque `NULL > 0` es `NULL` |

Lee cada fila así: si la condición da este resultado, la fila se acepta o se rechaza. Un check rechaza una fila solo cuando puede demostrar que está mal. Con `NULL` no puede demostrar nada, así que deja pasar la fila. Prueba los dos casos:

```sql
INSERT INTO wishlist_items (customer_id, book_id, max_price)
VALUES (3, 4, -5);      -- rechazado: wishlist_items_max_price_check

INSERT INTO wishlist_items (customer_id, book_id, max_price)
VALUES (3, 4, NULL);    -- aceptado
```

Para `max_price` ese es exactamente el comportamiento que quieres: se permite no tener límite, y un límite que se da tiene que ser positivo. Falla cuando el valor es **obligatorio**. Toma las `hours` de una entrada de horas trabajadas, que tienen que ser un número positivo en todas las filas:

```sql
-- MAL: una fila con hours = NULL pasa el check
hours NUMERIC(4,2) CHECK (hours > 0)

-- BIEN: NOT NULL rechaza el valor que falta, CHECK rechaza el valor incorrecto
hours NUMERIC(4,2) NOT NULL CHECK (hours > 0)
```

Así que `CHECK` nunca sustituye a `NOT NULL`. Cuando una columna tiene que tener un valor **y** ese valor tiene que cumplir una condición, necesita las dos reglas.

> **¿Por qué un check deja pasar `NULL` cuando `WHERE` lo descarta?** Responden a preguntas distintas. `WHERE` conserva una fila solo cuando su condición es verdadera, así que un resultado desconocido descarta la fila. Un check rechaza una fila solo cuando su condición es falsa, así que un resultado desconocido la conserva. El mismo `NULL` lo filtra una consulta y lo acepta una restricción. [04-where.md](04-where.md) enseña el lado de `WHERE`.

### `UNIQUE` rechaza valores repetidos, pero no `NULL`s repetidos

Una **restricción unique** (_unique constraint_) dice que dos filas no pueden tener el mismo valor en una columna. La base de datos de práctica tiene dos: `email` en `customers` e `isbn` en `books`. Intenta guardar un segundo libro con el ISBN de _1984_:

```sql
INSERT INTO books (title, isbn)
VALUES ('1984, second edition', '978-0451524935');
```

```
ERROR:  duplicate key value violates unique constraint "books_isbn_key"
DETAIL:  Key (isbn)=(978-0451524935) already exists.
```

El SQL state es `23505`. La línea `DETAIL` nombra la columna y el valor que ya está ocupado.

Para comprobar rápido cada insert, PostgreSQL no compara el valor nuevo con todas las filas de la tabla. Declarar una restricción unique hace que construya un **índice unique** sobre la columna: una estructura aparte, mantenida ordenada por los valores de la columna, en la que PostgreSQL puede encontrar cualquier valor sin leer la tabla. La clase de índice que construye se llama **B-tree**, un árbol de valores ordenados. Antes de guardar una fila, PostgreSQL busca el valor nuevo en el índice, y un acierto significa un duplicado. El índice recibe el mismo nombre que la restricción, `books_isbn_key`. [13-indices.md](13-indices.md) enseña los índices.

Mira ahora los datos de ejemplo. Dos libros no tienen ISBN: _Emma_ y _The Angel's Game_ guardan `NULL` en `isbn`, y la restricción aceptó a ambos. Eso sale de la misma lógica de tres valores que el check de arriba:

1. Una restricción unique rechaza una fila cuyo valor es **igual** a un valor ya guardado.
2. `NULL = NULL` no es verdadero. Es `NULL`, desconocido.
3. Así que dos `NULL` nunca son iguales, y nunca cuentan como un duplicado.

Para `isbn` ese es el comportamiento correcto: un libro sin ISBN no choca con otro libro sin ISBN. Así que una columna `UNIQUE` puede admitir nulos, y entonces significa "dos filas no comparten valor, y cualquier número de filas puede no tener ninguno".

Cuando el dominio dice que puede haber como mucho una fila sin valor, PostgreSQL te deja pedir que los `NULL` se traten como iguales, con `NULLS NOT DISTINCT`, una cláusula disponible desde PostgreSQL 15:

```sql
isbn VARCHAR(20) UNIQUE NULLS NOT DISTINCT
```

Con esa cláusula, un segundo `NULL` es un duplicado como cualquier otro valor. No puedes añadirla a la tabla `books` de práctica tal como está, porque ya contiene dos `NULL`. La sección [Añadir una restricción a una tabla que ya tiene filas](#añadir-una-restricción-a-una-tabla-que-ya-tiene-filas) muestra ese fallo.

> **Una comprobación en tu código no sustituye a `UNIQUE`.** Buscar un email existente con un `SELECT` antes de insertar uno nuevo son dos sentencias. Dos peticiones pueden mirar a la vez, no encontrar nada ninguna de las dos, e insertar las dos. Solo la restricción decide en un único paso. [08-dml.md](08-dml.md) enseña esa condición de carrera y `ON CONFLICT`, la sentencia que gestiona un duplicado sin lanzar un error.

### Unicidad sobre varias columnas

A veces ninguna columna es única por sí sola, y solo lo es una combinación. En `wishlist_items`, el cliente 1 puede apuntar muchos libros, y el libro 4 puede estar apuntado por muchos clientes. Lo que no debe ocurrir es que el cliente 1 apunte el libro 4 dos veces. Esa es una regla sobre la **pareja** `(customer_id, book_id)`, así que se escribe como una restricción de tabla que nombra las dos columnas:

```sql
CONSTRAINT wishlist_items_customer_book_key UNIQUE (customer_id, book_id)
```

Una fila es un duplicado solo cuando **las dos** columnas son iguales a las de una fila existente. Ana ya tiene _Emma_ en su lista, desde el primer insert de este capítulo:

```sql
INSERT INTO wishlist_items (customer_id, book_id)
VALUES (1, 4);
```

```
ERROR:  duplicate key value violates unique constraint "wishlist_items_customer_book_key"
DETAIL:  Key (customer_id, book_id)=(1, 4) already exists.
```

`(1, 6)` se aceptaría: el mismo cliente con otro libro. `(2, 4)` se aceptó antes en este capítulo por la razón inversa: el mismo libro con otro cliente. Cada columna se repite libremente, y solo la pareja no puede repetirse. Escribir `UNIQUE` en cada columna por separado sería una regla distinta y equivocada: permitiría un solo libro por cliente, y un solo cliente por libro.

Esta es la forma habitual de una regla de negocio sobre una combinación: una pertenencia por usuario y proyecto, una reseña por cliente y libro, una línea por libro dentro de un pedido.

### Las cuatro reglas, lado a lado

Estas reglas se confunden con facilidad, porque todas pueden rechazar el mismo insert. La tabla las pone lado a lado. La segunda columna dice qué hace que cada regla rechace una fila, y la tercera dice qué hace cuando el valor es `NULL`:

| Regla | Rechaza una fila cuando… | Con `NULL` |
|---|---|---|
| `NOT NULL` | la columna no tiene valor | lo rechaza: es todo el trabajo de la regla |
| `CHECK (condición)` | la condición es falsa | lo acepta, porque la condición es desconocida |
| `UNIQUE (columna)` | otra fila ya tiene el mismo valor | lo acepta, y acepta cualquier cantidad de `NULL` salvo que se escriba `NULLS NOT DISTINCT` |
| `UNIQUE (columna_a, columna_b)` | otra fila ya tiene la misma combinación | acepta una combinación que contiene un `NULL`, por la misma razón |

Solo la primera fila rechaza `NULL`. Por eso un valor obligatorio necesita `NOT NULL` sea cual sea la otra regla que lleve la columna.

## Claves — cómo se identifica una fila

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS → lee: "5.5.4. Primary Keys" — qué añade una clave primaria a `UNIQUE` y `NOT NULL`, y por qué toda tabla debería tener una

Un objeto de JavaScript se identifica por su referencia: dos objetos con las mismas propiedades siguen siendo dos objetos. Una fila no tiene referencia. Dos filas con los mismos valores en todas las columnas son indistinguibles, y una sentencia que quiera cambiar una de ellas cambia las dos. Por eso una tabla necesita una columna, o un conjunto de columnas, cuyo valor distinga cada fila de las demás. Eso es una **clave** (_key_).

### El grano de una tabla

Antes de elegir una clave, di qué representa una fila de la tabla. Eso se llama el **grano** (_grain_) de la tabla. El grano de `books` es un libro. El grano de `order_items` es un libro dentro de un pedido. El grano de `wishlist_items` es un libro en la lista de un cliente.

El grano te dice qué tiene que ser único. Si una fila de `wishlist_items` es "un libro en la lista de un cliente", dos filas con el mismo cliente y el mismo libro serían la misma cosa guardada dos veces. La regla compuesta de la sección [Unicidad sobre varias columnas](#unicidad-sobre-varias-columnas) es el grano escrito como restricción.

Decir el grano en voz alta es también la forma de leer una tabla que no diseñaste, como hace la sección [Leer un esquema relacional antes de consultarlo](#leer-un-esquema-relacional-antes-de-consultarlo), y la forma en que [06-joins.md](06-joins.md) predice cuántas filas devuelve un join.

### Claves candidatas y clave primaria

Una **clave candidata** (_candidate key_) es cualquier columna, o el conjunto más pequeño de columnas, cuyos valores son únicos en todas las filas y nunca faltan. `books` tiene dos candidatas: `id`, e `isbn` si todos los libros tuvieran uno. `customers` tiene `id` y `email`. `wishlist_items` tiene `id` y la pareja `(customer_id, book_id)`.

La **clave primaria** (_primary key_) es la candidata que eliges como identificador oficial de la tabla. `PRIMARY KEY` la declara, y significa tres cosas a la vez:

1. **Única.** Dos filas no tienen el mismo valor.
2. **No nula.** Toda fila tiene un valor. La columna pasa a ser `NOT NULL` sin que lo escribas.
3. **El destino por defecto de las claves foráneas.** Una clave foránea que nombra una tabla pero ninguna columna, como `REFERENCES customers`, apunta a la clave primaria de esa tabla.

Una clave primaria puede abarcar varias columnas. En lugar del `id`, `wishlist_items` podría haber usado su pareja natural como clave:

```sql
CREATE TABLE wishlist_items_example (
  customer_id INT NOT NULL REFERENCES customers(id),
  book_id     INT NOT NULL REFERENCES books(id),
  PRIMARY KEY (customer_id, book_id)
);
```

Esto es solo un ejemplo, así que no hace falta ejecutarlo. Una **clave primaria compuesta** (_composite primary key_) como esta es una restricción de tabla, por la misma razón que un `UNIQUE` compuesto: habla de dos columnas.

> **Una tabla puede existir sin clave primaria.** SQL no exige una. `CREATE TABLE no_key (x INT);` se acepta, y después se pueden insertar dos filas con `1`, sin nada que las distinga. Si lo pruebas, elimina la tabla de nuevo con `DROP TABLE no_key;`, porque el script de datos no la conoce. Aun así, toda tabla que una aplicación lee y escribe debería tener una, porque `UPDATE ... WHERE id = 1` y todas las claves foráneas dependen de un valor que elige exactamente una fila.

### Clave primaria frente a `UNIQUE`

Una clave primaria es única y no nula, así que `UNIQUE NOT NULL` parece lo mismo. Las dos rechazan duplicados, y las dos pueden abarcar varias columnas. Quedan tres diferencias, y la primera es la razón por la que `UNIQUE` existe:

| | `PRIMARY KEY` | `UNIQUE` |
|---|---|---|
| Cuántas por tabla | como mucho una | tantas como necesites |
| ¿Admite `NULL`? | nunca: las columnas son `NOT NULL` automáticamente | sí, salvo que la columna también se declare `NOT NULL` |
| A qué apunta una clave foránea que no nombra ninguna columna | a esta | nunca por defecto; una clave foránea sí puede nombrarla de forma explícita |

Intenta darle a `wishlist_items` una segunda clave primaria:

```sql
ALTER TABLE wishlist_items ADD PRIMARY KEY (customer_id, book_id);
```

```
ERROR:  multiple primary keys for table "wishlist_items" are not allowed
```

Ese es el caso que cubre `UNIQUE`. Una tabla tiene una clave primaria y, a menudo, más de una regla de la forma "este valor no se puede repetir". `customers` usa `id` como clave primaria y aun así necesita que `email` sea único. `wishlist_items` usa `id` y aun así necesita que la pareja sea única. Toda clave candidata que no elegiste como clave primaria se declara `UNIQUE`, o la base de datos deja de protegerla. `ALTER TABLE`, con la que empieza esta sentencia, se enseña en la sección [Modificar una tabla con `ALTER TABLE`](#modificar-una-tabla-con-alter-table).

### Claves naturales y claves sustitutas

Una **clave natural** (_natural key_) es una clave candidata hecha de datos que significan algo fuera de la base de datos: un ISBN, un email, un número de documento de identidad. Una **clave sustituta** (_surrogate key_) es un valor inventado solo para identificar la fila, sin significado propio: el `id` que reparte una columna identity o `SERIAL`.

Todas las tablas de la base de datos de práctica usan un `id` sustituto como clave primaria, y las dos claves naturales muestran por qué:

- **Una clave natural puede faltar.** _Emma_ no tiene ISBN en los datos de ejemplo. Una clave primaria nunca puede ser `NULL`, así que `isbn` no puede identificar todos los libros.
- **Una clave natural puede cambiar.** Un cliente puede cambiar de dirección de email. Si `email` fuera la clave primaria, tendría que cambiar también cada fila de `orders` y `reviews` que apunta a ese cliente. La sección [`ON UPDATE` solo actúa cuando cambia la clave referenciada](#on-update-solo-actúa-cuando-cambia-la-clave-referenciada) muestra lo que cuesta eso. Un `id` nunca cambia, porque nada en el negocio le da a nadie una razón para cambiarlo.

Una clave sustituta le da a la fila una identidad estable. **No** hace que la clave natural deje de ser única. El dominio sigue diciendo que dos clientes no pueden compartir un email, y la clave sustituta no sabe nada de esa regla. Por eso `customers` declara las dos:

```sql
id    SERIAL PRIMARY KEY,                  -- sustituta: identifica la fila, nunca cambia
email VARCHAR(100) UNIQUE NOT NULL,        -- natural: la regla de negocio de que no se puede repetir
```

> **¿Por qué no solo el `id`?** Entonces nada impide que la misma persona se registre dos veces con el mismo email. Cada fila recibe su propio `id`, así que la clave primaria ve dos filas distintas. El duplicado solo lo detecta un `UNIQUE` sobre la clave natural.

> **Preview — Spring Boot:** El fragmento de abajo es una entidad JPA del proyecto 07, una clase Java que Hibernate mapea a una tabla. Las entidades las estudiarás en las notas de Spring Boot. Léelo aquí solo por las dos claves que declara.

El proyecto 07 toma la misma decisión en `User.java`, la clase que Hibernate mapea a la tabla `users`:

```java
@Id
@GeneratedValue
private Long id;

@Column(nullable = false, unique = true)
private String email;
```

`@Id` con `@GeneratedValue` es la clave sustituta, un número que reparte la base de datos. `unique = true` con `nullable = false` pide `UNIQUE NOT NULL` sobre la clave natural, de modo que dos usuarios nunca pueden registrarse con el mismo email, haga lo que haga el código Java.

## Claves foráneas — cómo una fila se refiere a una fila de otra tabla

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK → lee: "5.5.5. Foreign Keys" — los primeros ejemplos, hasta las acciones referenciales

El segundo párrafo de este capítulo nombró el peligro: el `1` en el `author_id` de _1984_ es solo un número en una columna, y sin una regla `author_id` puede guardar el `id` de un autor que no existe. Ahora que cada fila está identificada por una clave, esta sección declara esa regla.

### Qué comprueba `REFERENCES`

Una **clave foránea** (_foreign key_) es una columna, o un conjunto de columnas, cuyo valor tiene que coincidir con una clave de otra tabla. `REFERENCES` la declara:

```sql
customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
```

La tabla que contiene la clave foránea, `wishlist_items`, es la tabla **hija** (_child_, o _referencing_). La tabla a la que apunta, `customers`, es la tabla **padre** (_parent_, o _referenced_). "Hija" y "padre" son los nombres que oirás en un equipo; la documentación de PostgreSQL dice _referencing_ y _referenced_. Los dos papeles pertenecen a una clave foránea, no a una tabla: `books` es hija de `authors`, a través de `books.author_id`, y padre de `order_items` y `reviews`, cuyo `book_id` apunta a ella.

La regla es la **integridad referencial** (_referential integrity_): todo valor no `NULL` de la clave foránea tiene que existir en la clave referenciada. PostgreSQL la comprueba cada vez que se inserta la fila hija o cambia su clave foránea. Prueba una entrada de la lista de deseos para un cliente que no existe:

```sql
INSERT INTO wishlist_items (customer_id, book_id)
VALUES (99, 1);
```

```
ERROR:  insert or update on table "wishlist_items" violates foreign key constraint "wishlist_items_customer_id_fkey"
DETAIL:  Key (customer_id)=(99) is not present in table "customers".
```

El SQL state es `23503`. La primera línea dice qué tabla y qué regla, y la línea `DETAIL` dice qué valor se quedó sin nada a lo que apuntar.

La regla tiene una segunda mitad, en el lado del padre. Borrar un cliente que todavía tiene entradas en la lista de deseos dejaría esas entradas apuntando a nada. Por eso PostgreSQL también comprueba la tabla padre: cuando se borra una fila padre, o cambia su clave, la clave foránea decide qué ocurre con las hijas. La sección [Comportamiento de ON DELETE](#comportamiento-de-on-delete) trata de esa mitad.

> **Una clave foránea acepta `NULL`.** La regla se aplica solo a los valores no `NULL`. `books.author_id` no tiene `NOT NULL`, así que un libro puede existir sin ningún autor. Es una decisión sobre los datos: "un libro siempre tiene un autor" se escribe como `NOT NULL` más `REFERENCES`, y "un libro puede tener un autor" como `REFERENCES` solo.

### A qué puede apuntar una clave foránea

Una clave foránea tiene que apuntar a columnas que estén garantizadas como únicas en la tabla padre: su clave primaria, o columnas con una restricción `UNIQUE`. La razón es el significado de la regla. "El cliente cuyo `id` es 1" tiene que nombrar a un único cliente. Un valor que pudiera coincidir con tres filas no diría a qué padre pertenece la fila hija.

Por eso esto se rechaza cuando se declara la tabla, antes de que exista ninguna fila:

```sql
CREATE TABLE city_notes (
  city VARCHAR(50) REFERENCES customers(city)
);
```

```
ERROR:  there is no unique constraint matching given keys for referenced table "customers"
```

`city` no es único en `customers`, porque dos clientes viven en Madrid. Una clave foránea hacia una clave natural que **sí** es única se acepta: `genres.name` es `UNIQUE NOT NULL`, así que `REFERENCES genres(name)` es una clave foránea válida. La sección [`ON UPDATE` solo actúa cuando cambia la clave referenciada](#on-update-solo-actúa-cuando-cambia-la-clave-referenciada) usa justo ese caso.

Cuando una clave foránea no nombra ninguna columna, como en `REFERENCES customers`, apunta a la clave primaria del padre.

## Tipos de relación — cuántas filas hay en cada lado

Docs: https://en.wikipedia.org/wiki/Cardinality_(data_modeling) → lee: "Relationships" — uno a uno, uno a muchos y muchos a muchos, cada uno con un ejemplo

Una clave foránea conecta cada fila hija con una fila padre. Todavía no dice cuántas filas pueden estar en cada lado de la conexión, y ese número decide dos cosas: qué tabla contiene la clave foránea y, en [06-joins.md](06-joins.md), cuántas filas devuelve una consulta que lee las dos tablas. Cuántas filas de una tabla pueden estar relacionadas con una fila de la otra se llama la **cardinalidad** (_cardinality_) de la relación. Hay tres tipos, y la base de datos de práctica tiene los dos primeros:

| Tipo | Una fila de A se relaciona con… | Una fila de B se relaciona con… | En la base de datos de práctica |
|---|---|---|---|
| Uno a muchos (1:N) | cualquier número de filas de B | como mucho una fila de A | `authors` y `books`: Orwell tiene dos libros, y cada libro tiene un `author_id` |
| Muchos a muchos (N:M) | cualquier número de filas de B | cualquier número de filas de A | `orders` y `books`: el pedido 1 contiene dos libros, y _1984_ aparece en los pedidos 1, 4 y 9 |
| Uno a uno (1:1) | como mucho una fila de B | como mucho una fila de A | ninguna; una biografía guardada aparte de `authors`, una por autor, lo sería |

La segunda y la tercera columna son las dos direcciones de la misma relación, y el tipo se nombra juntándolas: "uno" en un lado y "muchos" en el otro es uno a muchos. La sección siguiente muestra cómo se ve cada tipo como definiciones de tabla.

### Dos preguntas distinguen los tipos

Para averiguar el tipo de la relación entre dos tablas A y B, haz la misma pregunta en las dos direcciones:

1. ¿Puede una fila de A estar relacionada con varias filas de B?
2. ¿Puede una fila de B estar relacionada con varias filas de A?

Para `authors` y `books`: ¿puede un autor tener varios libros? Sí, George Orwell tiene _1984_ y _Animal Farm_. ¿Puede un libro tener varios autores? En esta librería, no: un libro tiene un `author_id`. Para `orders` y `books`: ¿puede un pedido contener varios libros? Sí, el pedido 1 contiene _1984_ y _Pride and Prejudice_. ¿Puede un libro aparecer en varios pedidos? Sí, _1984_ aparece en los pedidos 1, 4 y 9.

| Respuesta a la pregunta 1 | Respuesta a la pregunta 2 | Tipo |
|---|---|---|
| sí | no | uno a muchos: A es el lado "uno", B el lado "muchos" |
| no | sí | uno a muchos: B es el lado "uno", A el lado "muchos" |
| sí | sí | muchos a muchos |
| no | no | uno a uno |

Lee cada fila como las dos respuestas en orden y el tipo que dan. Un solo "sí" siempre significa uno a muchos, y el lado "muchos" es la tabla que contó la pregunta con "sí": "¿puede un autor tener varios **libros**?" fue el sí, así que `books` es el lado "muchos" de `authors` y `books`. Dos síes hacen que `orders` y `books` sean muchos a muchos.

> **La respuesta sale de la regla de negocio, no de las filas que ves.** Ningún libro de los datos de ejemplo tiene dos autores, pero eso solo describe las filas guardadas hoy. La pregunta es si el negocio lo permite. Esta librería registra un autor por libro, y la única columna `author_id` de `books` es esa decisión escrita. Una tienda que vendiera libros escritos entre varios autores respondería "sí" a la segunda pregunta, y `authors` y `books` pasarían a ser muchos a muchos, guardados como muestra la sección [Una tabla intermedia guarda una fila por pareja](#una-tabla-intermedia-guarda-una-fila-por-pareja).

## Dónde colocar la clave foránea y cómo construir una tabla intermedia

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK → lee: "5.5.5. Foreign Keys" — el ejemplo `products` / `orders` / `order_items` de una relación muchos a muchos

La sección anterior nombró los tres tipos de relación y las dos preguntas que los distinguen. Esta sección dice dónde pone su clave foránea cada tipo, explica por qué y escribe las definiciones de tabla que se derivan.

### Por qué la clave foránea va en el lado "muchos"

Una columna guarda un valor por fila. Ese único hecho decide dónde puede ir una clave foránea.

Toma autores y libros. Un autor tiene muchos libros, y cada libro tiene un autor. Prueba las dos colocaciones:

```
MAL: la clave en el lado "uno" — authors necesitaría una columna por libro

authors
┌────┬───────────────┬─────────┬─────────┬─────────┐
│ id │ name          │ book_id │ book_id │   ...   │   ¿cuántas columnas? una por libro,
├────┼───────────────┼─────────┼─────────┼─────────┤   y ningún autor tiene el mismo número
│  1 │ George Orwell │       1 │       2 │         │
└────┴───────────────┴─────────┴─────────┴─────────┘

BIEN: la clave en el lado "muchos" — cada libro guarda el único autor que tiene

books
┌────┬─────────────┬───────────┐
│ id │ title       │ author_id │   un valor por fila es todo lo que necesita un libro
├────┼─────────────┼───────────┤
│  1 │ 1984        │         1 │
│  2 │ Animal Farm │         1 │
└────┴─────────────┴───────────┘
```

Un libro tiene exactamente un autor, así que una columna de `books` lo guarda. Un autor tiene cualquier número de libros, y ningún conjunto fijo de columnas de `authors` podría guardarlos. Por eso la clave foránea va en la tabla cuyas filas apuntan cada una a **una** fila de la otra: la hija, el lado "muchos". El padre nunca lista a sus hijas. Se encuentran buscando las filas que apuntan a él, que es lo que hace un join en [06-joins.md](06-joins.md).

`wishlist_items` sigue esta misma regla dos veces: cada entrada apunta a un cliente y a un libro.

> **Preview — Spring Boot:** El párrafo siguiente nombra anotaciones JPA del proyecto 07. Las estudiarás en las notas de Spring Boot. Léelo para ver dónde acaban las claves foráneas.

El proyecto 07 tiene la misma forma. Cada registro de horas pertenece a un usuario y a un proyecto, y un usuario o un proyecto tiene muchos registros de horas. Por eso `TimeEntry.java` declara `@ManyToOne` con `@JoinColumn(name = "user_id", nullable = false)` y lo mismo para `project_id`. Hibernate convierte esas anotaciones en dos columnas de clave foránea `NOT NULL` en la tabla `time_entries`, el lado "muchos" de las dos relaciones.

### Una tabla intermedia guarda una fila por pareja

Clientes y libros son muchos a muchos a través de la lista de deseos: un cliente apunta muchos libros, y un libro lo apuntan muchos clientes. Ninguna de las dos tablas puede contener la clave foránea, porque ningún lado apunta a una sola fila del otro. El problema de la tabla `authors` dibujada arriba, una columna por cada fila relacionada, aparece en **los dos** lados.

La solución es una tercera tabla cuyo grano es una pareja. Cada una de sus filas apunta a un cliente y a un libro, de modo que cada una de sus claves foráneas vuelve a estar en un lado "muchos":

```
customers (1) ──── (N) wishlist_items (N) ──── (1) books
                       customer_id ──► customers.id
                       book_id     ──► books.id
```

Esa tercera tabla es una **tabla intermedia** (_junction table_), y `wishlist_items` es una. Una relación muchos a muchos se guarda siempre como dos relaciones uno a muchos que se encuentran en una tabla intermedia.

Una tabla intermedia necesita tres cosas:

1. **Dos claves foráneas**, una hacia cada lado, normalmente las dos `NOT NULL`, porque una pareja a la que le falta una mitad no es una pareja.
2. **Una regla de unicidad sobre la pareja**, para que cada pareja aparezca una vez. Sin ella, el mismo cliente puede apuntar el mismo libro dos veces, y todo recuento de "cuántos clientes quieren este libro" cuenta a ese cliente dos veces. Se escribe o bien como un `UNIQUE` compuesto junto a un `id` sustituto, como hace `wishlist_items`, o bien como una clave primaria compuesta sin `id`, como mostró la sección [Claves candidatas y clave primaria](#claves-candidatas-y-clave-primaria).
3. **Columnas sobre la pareja, cuando las hay.** `priority` y `max_price` no describen ni al cliente ni al libro. Describen el interés de este cliente en este libro, así que pertenecen a la fila de la pareja. `quantity` y `unit_price` en `order_items` son columnas del mismo tipo.

> **¿Clave primaria compuesta o `id` sustituto?** Las dos hacen cumplir una fila por pareja. El `id` sustituto le da a la fila un único valor al que apuntar, lo cual es más sencillo para cualquier cosa que se refiera a ella: una URL como `/wishlist/42`, la clave foránea de otra tabla, una entidad de un ORM. La clave compuesta ahorra una columna y un índice. Una tabla a la que nada más se refiere puede usar cualquiera de las dos. Elijas la que elijas, la pareja tiene que seguir siendo única.

### Uno a uno es una clave foránea que además es única

En una relación uno a uno, cada fila de B apunta a una fila de A, y dos filas de B no apuntan a la misma. La primera mitad es una clave foránea corriente. La segunda mitad es lo que la hace uno a uno, y es un `UNIQUE` sobre la columna de la clave foránea. Una biografía corta guardada aparte de `authors` se vería así:

```sql
CREATE TABLE author_bios (
  author_id INT PRIMARY KEY REFERENCES authors(id),
  bio       TEXT NOT NULL
);
```

Esto es un ejemplo, no algo para ejecutar. `author_id` es una clave foránea, así que cada biografía pertenece a un autor que existe. También es la clave primaria, así que es única y no nula, y un autor puede tener como mucho una biografía. Sin la unicidad, la misma definición sería una relación uno a muchos: un autor con varias biografías.

Uno a uno es el menos frecuente de los tres tipos. Dos tablas cuyas filas se emparejan exactamente podrían ser normalmente una sola tabla, así que un equipo las separa solo por una razón. Las razones habituales son una parte de los datos que la mayoría de las filas no tienen, que entonces no necesita una columna llena de `NULL` en la tabla principal, o una parte que es grande o que se lee poco: una tabla `users` que se mantiene ligera, con el texto largo del perfil en una tabla `user_profiles` a su lado.

## Comportamiento de ON DELETE

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK → lee: "5.5.5. Foreign Keys" — desde "We know that the foreign keys disallow creation of orders that do not relate to any products" hasta el final de la sección

La sección [Qué comprueba `REFERENCES`](#qué-comprueba-references) terminó en la segunda mitad de la integridad referencial: borrar una fila padre que todavía tiene hijas dejaría a esas hijas apuntando a nada. La base de datos no puede dejar que eso ocurra en silencio, así que la clave foránea decide qué ocurre con las hijas, y esa decisión la eliges con la opción `ON DELETE`, escrita después de `REFERENCES`. Hay cuatro opciones que te vas a encontrar:

| Opción | Qué ocurre cuando se borra un padre que todavía tiene hijas |
|--------|-------------|
| `NO ACTION` (la opción por defecto, la que se usa cuando no escribes ninguna) | el borrado se rechaza |
| `RESTRICT` | el borrado se rechaza, igual que con `NO ACTION`; las dos se diferencian solo en cuándo se ejecuta la comprobación |
| `CASCADE` | el borrado se realiza, y las hijas se borran con él |
| `SET NULL` | el borrado se realiza, y las hijas se quedan con `NULL` en su clave foránea |

```sql
-- Borrar un pedido borra también todas sus líneas
order_id INT REFERENCES orders(id) ON DELETE CASCADE

-- Borrar un autor pone books.author_id a NULL (el libro se queda, el vínculo con el autor se elimina)
author_id INT REFERENCES authors(id) ON DELETE SET NULL
```

Las dos líneas de arriba son definiciones de columna, tal como se escribirían dentro de un `CREATE TABLE`. El script de datos no declara ninguna de las dos: todas las claves foráneas que declara no llevan opción, así que todas son `NO ACTION`.

### Qué hace cada acción con las filas hijas

La tabla de arriba da las cuatro acciones. Este apartado las ejecuta sobre la base de datos de práctica, para que veas qué ocurre con las filas hijas en cada caso. El conjunto tiene un quinto miembro, `SET DEFAULT`, que escribe en las hijas el valor por defecto de la columna en lugar de `NULL`. Los equipos lo usan poco, porque ese valor por defecto tiene que ser a su vez la clave de una fila padre que exista.

**Sin acción escrita: el borrado se rechaza.** `books.author_id` es una de las claves foráneas `NO ACTION` del script de datos, y George Orwell tiene dos libros:

```sql
DELETE FROM authors WHERE id = 1;
```

```
ERROR:  update or delete on table "authors" violates foreign key constraint "books_author_id_fkey" on table "books"
DETAIL:  Key (id)=(1) is still referenced from table "books".
```

La primera línea nombra la tabla padre, la regla y la tabla hija. La línea `DETAIL` nombra la clave del padre que todavía tiene hijas. El SQL state es `23503`, el mismo que el de un insert con el padre ausente: las dos son la misma regla, vista desde sus dos lados. No se borró nada.

Lo mismo ocurre con la clave foránea que declaraste sin acción. `wishlist_items.book_id` es `NO ACTION`, y hay tres entradas que apuntan a _Emma_, así que `DELETE FROM books WHERE id = 4;` se rechaza, nombrando `wishlist_items_book_id_fkey`. Solo con los datos de ejemplo, _Emma_ no tiene pedidos ni reseñas, y el mismo borrado habría funcionado. Tu tabla nueva está protegiendo ahora al libro 4.

**`CASCADE`: las hijas se borran con el padre.** `wishlist_items.customer_id` dice `ON DELETE CASCADE`. El cliente 8, Diego Torres, no tiene pedidos ni reseñas. Dale dos entradas en la lista de deseos y bórralo después con la sentencia de la sección [Tres sentencias de una fila para probar una tabla](#tres-sentencias-de-una-fila-para-probar-una-tabla):

```sql
INSERT INTO wishlist_items (customer_id, book_id) VALUES (8, 3);
INSERT INTO wishlist_items (customer_id, book_id) VALUES (8, 10);

DELETE FROM customers WHERE id = 8;
```

El `DELETE` se realiza, y la pestaña Messages dice `DELETE 1`: un cliente. Sus dos entradas de la lista de deseos también han desaparecido, aunque la sentencia nunca mencionó `wishlist_items`. En orden, PostgreSQL:

1. borra la fila del cliente 8 de `customers`;
2. busca las claves foráneas que referencian `customers`: `orders`, `reviews` y `wishlist_items`;
3. busca en cada una las filas que apuntan al `id` 8: ninguna en `orders` ni en `reviews`, dos en `wishlist_items`;
4. aplica la acción de cada clave foránea a esas filas, y `CASCADE` las borra.

Si Diego hubiera tenido un pedido, el paso 4 habría llegado hasta `orders.customer_id`, que es `NO ACTION`, y la sentencia entera se habría rechazado, lista de deseos incluida.

**`SET NULL`: las hijas se quedan y pierden a su padre.** La fila hija sobrevive con `NULL` en la clave foránea, algo que solo funciona cuando esa columna admite nulos. `SET NULL` sobre una columna `NOT NULL` convierte cada borrado de ese tipo en un error de not-null. La sección [Añadir y eliminar una restricción](#añadir-y-eliminar-una-restricción) cambia `books.author_id` a otra acción, que es como probarías esta.

Cómo elegir se reduce a una pregunta sobre la hija: ¿sigue significando algo sin su padre?

| La hija sin su padre… | Acción | Ejemplo |
|---|---|---|
| no significa nada | `CASCADE` | una entrada de la lista de deseos de un cliente borrado |
| sigue significando algo, y el vínculo es opcional | `SET NULL` | un libro cuyo registro de autor se elimina |
| no debe existir: el padre solo puede irse una vez resueltas sus hijas | `NO ACTION` o `RESTRICT` | un pedido de un cliente: la venta ocurrió, y borrar al cliente no debe borrarla |

> **¿Por qué `CASCADE` no es la opción segura por defecto?** Un cascade sigue claves foráneas que a su vez hacen cascade, así que un solo `DELETE` puede eliminar filas de varias tablas, ninguna de ellas nombrada en la sentencia. Un cascade de `customers` a `orders` y de `orders` a `order_items` borraría todo el historial de ventas de un cliente con una línea. Úsalo solo donde perder las hijas sea exactamente lo que quiere el negocio.

### `NO ACTION` frente a `RESTRICT` — cuándo se ejecuta la comprobación

La tabla del principio de esta sección dice que `NO ACTION` y `RESTRICT` rechazan el borrado y se diferencian solo en cuándo se ejecuta la comprobación. Este apartado trata de esa diferencia. Solo se nota cuando la comprobación se hace esperar, y una comprobación solo puede esperar dentro de una transacción.

Una **transacción** (_transaction_) es un grupo de sentencias que tienen éxito o fallan juntas: o se conservan todos sus cambios, en el `COMMIT`, o no se conserva ninguno. [09-transacciones.md](09-transacciones.md) la enseña. Una clave foránea puede declararse **deferrable** (aplazable), lo que permite que su comprobación espere hasta el `COMMIT` en lugar de ejecutarse al final de cada sentencia:

```sql
author_id INT REFERENCES authors(id) DEFERRABLE INITIALLY DEFERRED
```

Con esa declaración, esta secuencia funciona. Es un ejemplo para leer, no para ejecutar: el script de datos declara `books.author_id` sin `DEFERRABLE`, así que en la base de datos de práctica el `DELETE` falla enseguida con el error de `NO ACTION` que viste arriba.

```sql
BEGIN;
DELETE FROM authors WHERE id = 7;                        -- las hijas siguen apuntando al 7: aún no se comprueba
UPDATE books SET author_id = NULL WHERE author_id = 7;   -- se arreglan las hijas
COMMIT;                                                  -- se comprueba ahora: nada apunta al 7, así que pasa
```

El borrado deja a _My Brilliant Friend_ apuntando a un autor borrado durante una sentencia. La comprobación espera al `COMMIT`, y para entonces el `UPDATE` ya ha arreglado el libro.

Esa es la diferencia:

- **`NO ACTION`** comprueba la regla al final de la sentencia, o en el `COMMIT` cuando la clave foránea es aplazable y está aplazada. Otras sentencias pueden arreglar las hijas entre medias.
- **`RESTRICT`** comprueba de inmediato, durante el propio `DELETE`, y no se puede aplazar. Incluso con `DEFERRABLE` escrito en la clave foránea, el mismo `DELETE` falla enseguida, antes de que pueda ejecutarse el `UPDATE`.

Sin `DEFERRABLE`, que es el caso de todas las claves foráneas de esta ruta hasta ahora, las dos rechazan los mismos borrados. El mensaje difiere un poco: `RESTRICT` dice `violates RESTRICT setting of foreign key constraint`. Elige `RESTRICT` cuando quieras decir "nunca, ni siquiera temporalmente"; en cualquier otro caso deja el `NO ACTION` por defecto.

### `ON UPDATE` solo actúa cuando cambia la clave referenciada

Borrar un padre es una manera de dejar a sus hijas apuntando a nada. Cambiar la **clave** del padre es la otra. `ON UPDATE` admite las mismas acciones que `ON DELETE`, y se aplica cuando cambia el valor de la columna de la clave referenciada. Su valor por defecto también es `NO ACTION`.

Puedes verlo con los datos de ejemplo. `authors.id` es una columna `SERIAL`, que el capítulo 01 mostró que es un `integer` corriente con un valor por defecto, de modo que un `UPDATE` puede escribir cualquier valor en ella. Una columna identity declarada `GENERATED ALWAYS`, como `wishlist_items.id`, rechaza el mismo tipo de sentencia con `column "id" can only be updated to DEFAULT`. Cambia el `id` de George Orwell:

```sql
UPDATE authors SET id = 100 WHERE id = 1;
```

```
ERROR:  update or delete on table "authors" violates foreign key constraint "books_author_id_fkey" on table "books"
DETAIL:  Key (id)=(1) is still referenced from table "books".
```

El mensaje es el del borrado, palabra por palabra. Cambiar el `id` de George Orwell dejaría a sus dos libros apuntando a `1`, un autor que ya no existe, así que `ON UPDATE NO ACTION` lo rechaza. La misma sentencia sobre el autor 8, Lucia Berlin, que no tiene libros, funciona.

Con una clave sustituta esto casi nunca ocurre, porque nada en el negocio le da a nadie una razón para cambiar un `id`. `ON UPDATE` existe para las claves naturales, que sí cambian. Imagina un esquema heredado en el que las etiquetas de estantería apuntan a un género por su nombre, que es único en `genres`:

```sql
CREATE TABLE shelf_labels (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  shelf      INT NOT NULL,
  genre_name VARCHAR(50) NOT NULL REFERENCES genres(name) ON UPDATE CASCADE
);
INSERT INTO shelf_labels (shelf, genre_name) VALUES (1, 'Mystery'), (2, 'Mystery'), (3, 'Poetry');

UPDATE genres SET name = 'Crime' WHERE name = 'Mystery';

SELECT shelf, genre_name FROM shelf_labels;
DROP TABLE shelf_labels;
```

El `INSERT` crea tres filas a la vez, con una lista de valores entre paréntesis por cada fila, una forma que enseña [08-dml.md](08-dml.md). Tras el `UPDATE` sobre `genres`, el `SELECT` muestra las estanterías 1 y 2 con `Crime`. El `UPDATE` solo nombró `genres`, y `ON UPDATE CASCADE` copió el nombre nuevo en cada fila hija que tenía el antiguo. La última línea elimina de nuevo la tabla de ejemplo. El género se queda renombrado como `Crime` hasta que vuelvas a ejecutar el script de datos al final del capítulo.

> **¿Por qué un `ON UPDATE CASCADE` heredado es fácil de malinterpretar?** Porque sobre una clave que nunca cambia nunca se ejecuta, así que parece inofensivo y se olvida. El día que alguien corrige una clave natural, un solo `UPDATE` sobre el padre reescribe filas de todas las tablas hijas, y nadie que lea ese `UPDATE` las ve. Cuando encuentres `ON UPDATE CASCADE` en un esquema, mira qué es la columna referenciada. Sobre un `id` sustituto es ruido. Sobre una clave natural es una regla que reescribe datos en otros sitios.

## Normalización — cada hecho se guarda una vez

Docs: https://en.wikipedia.org/wiki/Database_normalization → lee: "Objectives" — las anomalías de inserción, actualización y borrado, cada una con un ejemplo

Todas las secciones hasta ahora han repartido los datos entre tablas y las han enlazado con claves. Una única tabla con todo dentro no necesitaría claves foráneas ni joins, así que el reparto necesita una razón. La razón es lo que sale mal cuando el mismo hecho se guarda más de una vez.

### Tres anomalías de una tabla que guarda copias

Aquí están los datos de ventas de la base de datos de práctica como una única tabla plana, construida a partir de los pedidos 1, 2 y 5 del script de datos:

```
sales (una fila por libro vendido)
┌──────────┬─────────────┬─────────────────┬───────────────────────────────┬──────────┬────────────┐
│ order_id │ customer    │ customer_email  │ book_title                    │ quantity │ unit_price │
├──────────┼─────────────┼─────────────────┼───────────────────────────────┼──────────┼────────────┤
│        1 │ Ana García  │ ana@mail.com    │ 1984                          │        1 │       9.99 │
│        1 │ Ana García  │ ana@mail.com    │ Pride and Prejudice           │        2 │       8.99 │
│        2 │ Ana García  │ ana@mail.com    │ One Hundred Years of Solitude │        1 │      14.99 │
│        5 │ Javier Ruiz │ javier@mail.com │ My Brilliant Friend           │        2 │      12.99 │
└──────────┴─────────────┴─────────────────┴───────────────────────────────┴──────────┴────────────┘
```

El email de Ana está guardado tres veces, una por cada libro que compró. Cada problema de abajo sale de esa copia, y cada uno se llama una **anomalía** (_anomaly_): un cambio en los datos que la forma de la tabla hace que salga mal.

- **Anomalía de actualización.** Ana cambia su email. Tiene que cambiar cada fila que lo guarda. Un `UPDATE` que se deja una fila deja a la tabla diciendo dos cosas distintas sobre la misma persona, y ninguna regla lo detecta.
- **Anomalía de inserción.** Se registra un cliente nuevo que todavía no ha comprado nada. Cada fila de esta tabla es un libro vendido, así que no hay dónde guardar al cliente nuevo sin inventarse una venta.
- **Anomalía de borrado.** El único pedido de Javier se cancela y se borra su fila. El email de Javier se va con ella, aunque el hecho "Javier es un cliente, con esta dirección" no tenía nada que ver con el pedido.

La base de datos de práctica evita las tres guardando cada hecho en la tabla de la clave de la que depende:

| Hecho | De qué depende | Por tanto vive en |
|---|---|---|
| el nombre y el email de un cliente | el cliente: `customers.id` | `customers`, una vez por cliente |
| la fecha y el cliente de un pedido | el pedido: `orders.id` | `orders`, una vez por pedido |
| el título de un libro | el libro: `books.id` | `books`, una vez por libro |
| cuántos ejemplares de un libro contiene un pedido | el pedido **y** el libro juntos | `order_items`, una vez por libro dentro de un pedido |

Lee cada fila como una pregunta: ¿qué clave necesitarías conocer para buscar este hecho? La tabla de esa clave es donde pertenece el hecho. El email de Ana ahora existe una vez, así que cambiarlo cambia una fila. Un cliente puede existir sin pedidos. Borrar un pedido elimina líneas de pedido, no clientes. Repartir los datos así se llama **normalización** (_normalization_). Tiene reglas formales, las formas normales, que van más allá de lo que necesita esta ruta junior. La regla de trabajo de arriba, un hecho en la tabla de su clave, es la que aplicas cuando diseñas o revisas un esquema.

### `unit_price` es un hecho de la venta, no una copia

`order_items` guarda un `unit_price`, y `books` guarda un `price`. En los datos de ejemplo son iguales: la línea 1 del pedido 1 vendió _1984_ a `9.99`, y _1984_ cuesta `9.99`. Eso parece la copia contra la que advirtió el apartado anterior. No lo es, porque las dos columnas guardan dos hechos distintos:

- `books.price` es lo que cuesta el libro **hoy**. Depende del libro.
- `order_items.unit_price` es lo que se cobró **en esa venta**. Depende de la línea del pedido.

Cuando la tienda sube el precio de _1984_ a `10.99`, el pedido de enero de 2025 se pagó igualmente a `9.99`. Si el pedido leyera el precio de `books`, subir el precio reescribiría todas las facturas pasadas. Así que la prueba no es "¿tienen dos columnas valores iguales?". Es "¿cambiar una de ellas tendría que cambiar la otra?". Para `price` y `unit_price` la respuesta es no, así que ninguna es una copia.

## Leer un esquema relacional antes de consultarlo

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html → lee: "5.5. Constraints" — la introducción, como una lista de lo que cada tipo de regla te dice sobre los datos

La mayoría de las consultas que escribirás en el trabajo parten de tablas que diseñó otra persona, y una suposición equivocada sobre ellas devuelve filas equivocadas sin ningún error. Por eso, antes de escribir una consulta contra un esquema, léelo buscando cinco cosas, todas las cuales ha enseñado ya este capítulo:

1. **El grano** de cada tabla: qué representa una fila.
2. **La clave primaria**: qué identifica una fila.
3. **Las claves foráneas**: a qué tablas apunta cada fila.
4. **La nulabilidad** (_nullability_) de cada columna, empezando por las claves foráneas: ¿puede faltar el valor, o el padre?
5. **La cardinalidad** de cada relación: uno a muchos, muchos a muchos a través de una tabla intermedia, o uno a uno.

### El esquema de práctica, leído tabla por tabla

Aplica las cinco lecturas a las sentencias `CREATE TABLE` del script de datos, más tu `wishlist_items`:

| Tabla | Una fila es… | Clave primaria | Claves foráneas | Otras claves únicas |
|---|---|---|---|---|
| `authors` | un autor | `id` | — | — |
| `publishers` | una editorial | `id` | — | — |
| `genres` | un género | `id` | — | `name` |
| `books` | un libro | `id` | `author_id`, `publisher_id`, `genre_id`, todas admiten nulos | `isbn`, admite nulos |
| `customers` | un cliente | `id` | — | `email`, `NOT NULL` |
| `orders` | un pedido | `id` | `customer_id`, admite nulos | — |
| `order_items` | un libro dentro de un pedido | `id` | `order_id`, `book_id`, las dos admiten nulos | — |
| `reviews` | una reseña de un libro por un cliente | `id` | `book_id`, `customer_id`, las dos admiten nulos | — |
| `wishlist_items` | un libro en la lista de un cliente | `id` | `customer_id`, `book_id`, las dos `NOT NULL` | `(customer_id, book_id)` |

La segunda columna es el grano. La cuarta dice, para cada clave foránea, si una fila puede estar sin su padre. A partir de las claves foráneas puedes dibujar todas las relaciones:

```
authors    (1) ──── (N) books           books.author_id
publishers (1) ──── (N) books           books.publisher_id
genres     (1) ──── (N) books           books.genre_id
customers  (1) ──── (N) orders          orders.customer_id
orders     (N) ──── (M) books           a través de order_items
books      (N) ──── (M) customers       a través de reviews
books      (N) ──── (M) customers       a través de wishlist_items
```

La nulabilidad cambia lo que significa "uno". `books.author_id` admite nulos, así que la relación es "cada libro tiene **como mucho** un autor", y `books.publisher_id` hace que sea "como mucho una editorial". Los datos de ejemplo usan esa libertad: _My Brilliant Friend_ no tiene editorial. Una consulta que liste todos los libros con su editorial tiene por tanto que decidir qué hacer con ese libro. [06-joins.md](06-joins.md) enseña esa decisión, y parte justo de esta lectura.

> **Dónde leer un esquema que no escribiste tú.** Aquí tienes el script. En una base de datos real normalmente no lo tienes. pgAdmin muestra las columnas y las restricciones de cada tabla en el Object Explorer, y [16-trabajar-con-una-base-de-datos-existente.md](16-trabajar-con-una-base-de-datos-existente.md) enseña cómo inspeccionar una base de datos que no diseñaste.

### Lo que la lectura revela que falta

Leer un esquema con ojo crítico también muestra las reglas que su diseñador dejó fuera. El esquema de práctica tiene tres huecos de este tipo, y cada uno permite una fila que el negocio nunca aceptaría:

- **`order_items.order_id` admite nulos.** Una línea de pedido que no pertenece a ningún pedido no describe nada, así que debería ser `NOT NULL`. Lo mismo vale para `book_id`.
- **`order_items` no tiene unicidad sobre `(order_id, book_id)`.** El grano es "un libro dentro de un pedido", pero nada impide que el mismo libro aparezca en dos líneas de un mismo pedido, con su cantidad repartida entre ellas. Un `UNIQUE` compuesto haría cumplir el grano.
- **`reviews` no tiene unicidad sobre `(book_id, customer_id)`.** Si la tienda permite una reseña por cliente y libro, esa regla existe solo en la aplicación.

Los datos de ejemplo cumplen casualmente las tres, y esa es la trampa: una regla que falta es invisible hasta que una fila la rompe. Las dos secciones siguientes muestran cómo añadir estas reglas a tablas que ya tienen filas.

## Modificar una tabla con `ALTER TABLE`

Docs: https://www.postgresql.org/docs/current/ddl-alter.html → lee: "5.7. Modifying Tables" — todos los apartados, del 5.7.1 al 5.7.8

Una tabla se declara una vez y se cambia durante años. Una funcionalidad nueva necesita una columna, una revisión muestra que falta una regla, un límite resulta demasiado pequeño. Borrar la tabla y declararla de nuevo perdería sus filas. `ALTER TABLE` cambia la definición de una tabla que ya existe, y conserva sus filas. Cada forma de abajo empieza con `ALTER TABLE` y el nombre de la tabla, y después dice qué cambiar.

### Añadir, cambiar y eliminar una columna

**Añadir una columna.** La tienda quiere destacar algunos libros en su página de inicio:

```sql
ALTER TABLE books ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
```

Una columna nueva tiene que guardar algo en todas las filas que ya existen, y esta sentencia dice qué: el valor por defecto. Todos los libros existentes tienen ahora `false`. La sección [Valores por defecto en una tabla que ya tiene filas](#valores-por-defecto-en-una-tabla-que-ya-tiene-filas) explica por qué este caso rellena las filas antiguas y otro no.

**Cambiar el tipo de una columna.** Este es el cambio que [01-tipos-de-datos.md](01-tipos-de-datos.md) mencionó al final de su sección _`VARCHAR(n)` frente a `TEXT` — qué queda por elegir_: un límite de longitud que resulta demasiado pequeño. `customers.city` es `VARCHAR(50)`, y ampliarlo es una sentencia:

```sql
ALTER TABLE customers ALTER COLUMN city TYPE VARCHAR(100);
```

PostgreSQL convierte cada valor guardado al tipo nuevo. Ampliar un límite siempre funciona. Reducirlo falla en cuanto un valor guardado no cabe:

```sql
ALTER TABLE customers ALTER COLUMN city TYPE VARCHAR(5);
```

```
ERROR:  value too long for type character varying(5)
```

`Barcelona` tiene nueve letras. La sentencia se rechaza entera, y la columna conserva su tipo anterior.

**Renombrar una columna, o eliminarla.**

```sql
ALTER TABLE books RENAME COLUMN is_featured TO featured;
ALTER TABLE books DROP COLUMN featured;
```

`RENAME COLUMN` conserva los valores y cambia el nombre, lo que rompe toda consulta y toda aplicación que use el nombre antiguo. `DROP COLUMN` elimina la columna y todos los valores que guarda, junto con las reglas de esta tabla que la involucran. Si una clave foránea de otra tabla referencia la columna, PostgreSQL rechaza el borrado.

### Añadir y eliminar una restricción

**Añadir una regla.** Los huecos que encontró la sección [Lo que la lectura revela que falta](#lo-que-la-lectura-revela-que-falta) se arreglan así:

```sql
ALTER TABLE order_items ADD CONSTRAINT order_items_order_book_key UNIQUE (order_id, book_id);
```

`ADD CONSTRAINT` toma un nombre y después la misma regla que escribirías como restricción de tabla dentro de `CREATE TABLE`. `NOT NULL` tiene su propia forma, porque pertenece a una sola columna:

```sql
ALTER TABLE order_items ALTER COLUMN order_id SET NOT NULL;
```

Las dos funcionan con los datos de ejemplo, porque ninguna fila guardada las incumple. Una regla nueva se comprueba contra todas las filas guardadas en el momento en que se añade, y la sección siguiente muestra qué ocurre cuando una fila la incumple.

**Eliminar una regla.** Una regla se elimina por su nombre, y por eso importan aquí los nombres de la sección [Nombres de restricción y los errores que los citan](#nombres-de-restricción-y-los-errores-que-los-citan). `NOT NULL` tiene otra vez su propia forma, que nombra la columna:

```sql
ALTER TABLE order_items DROP CONSTRAINT order_items_order_book_key;
ALTER TABLE order_items ALTER COLUMN order_id DROP NOT NULL;
```

**Cambiar la acción de una clave foránea.** Ninguna sentencia cambia la acción de una clave foránea existente. Para cambiar lo que hace una clave foránea al borrar, la eliminas y la vuelves a añadir con la acción nueva. Esto cambia `books.author_id` de `NO ACTION` a `SET NULL`:

```sql
ALTER TABLE books DROP CONSTRAINT books_author_id_fkey;
ALTER TABLE books ADD CONSTRAINT books_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL;

DELETE FROM authors WHERE id = 7;
SELECT id, title, author_id FROM books WHERE id = 12;
```

```
 id | title               | author_id
----+---------------------+-----------
 12 | My Brilliant Friend |    [null]
```

`FOREIGN KEY (author_id) REFERENCES authors(id)` es la forma de restricción de tabla del `REFERENCES` de una columna. El `DELETE` de Elena Ferrante ahora funciona, y su libro se queda sin autor. Repite las dos sentencias `ALTER TABLE` con `ON DELETE RESTRICT` en lugar de `SET NULL`, y `DELETE FROM authors WHERE id = 1;` falla con el mensaje de `RESTRICT` que citó la sección [`NO ACTION` frente a `RESTRICT` — cuándo se ejecuta la comprobación](#no-action-frente-a-restrict--cuándo-se-ejecuta-la-comprobación).

### Valores por defecto en una tabla que ya tiene filas

Dos sentencias le dan un valor por defecto a una columna, y tratan las filas ya guardadas de maneras opuestas.

**`ALTER COLUMN ... SET DEFAULT` cambia solo los inserts futuros.** La tienda decide que un cliente sin ciudad está en Madrid:

```sql
ALTER TABLE customers ALTER COLUMN city SET DEFAULT 'Madrid';
SELECT id, name, city FROM customers WHERE city IS NULL;
```

```
 id | name        | city
----+-------------+--------
  3 | Marta López | [null]
  7 | Lucía Gómez | [null]
```

Marta y Lucía siguen sin ciudad. `IS NULL` es la forma en que una consulta encuentra los valores que faltan, algo que enseña [04-where.md](04-where.md). No se hizo ningún **backfill**, la palabra para rellenar filas antiguas después de un cambio de esquema. Un valor por defecto actúa cuando se inserta una fila, y estas filas se insertaron hace mucho. Si también deberían estar en Madrid, eso es un `UPDATE` aparte, y una decisión aparte: quizá de verdad no tienen ciudad.

**`ADD COLUMN ... DEFAULT` rellena todas las filas existentes.** Eso fue lo que ocurrió con `is_featured`. Una columna nueva no existía cuando se insertaron las filas antiguas, así que todavía no tiene valor en ellas. PostgreSQL tiene que darles uno, y les da el valor por defecto, o `NULL` cuando la sentencia no tiene `DEFAULT`.

| Sentencia | Filas existentes | Inserts futuros que omiten la columna |
|---|---|---|
| `ADD COLUMN c ... DEFAULT x` | reciben `x` | reciben `x` |
| `ADD COLUMN c ...` sin valor por defecto | reciben `NULL` | reciben `NULL` |
| `ALTER COLUMN c SET DEFAULT x` | conservan sus valores, `NULL` incluido | reciben `x` |

La primera columna es la sentencia que ejecutas. La segunda dice qué hace con las filas ya guardadas, y la tercera qué hace con las filas insertadas más tarde. Las filas que ya existen se ven afectadas solo cuando la propia columna es nueva.

### Las herramientas de migración ejecutan estas mismas sentencias

En un proyecto, nadie ejecuta `ALTER TABLE` a mano en pgAdmin en cada base de datos. Un equipo tiene una base de datos de desarrollo, una de pruebas y la de producción, y las tres tienen que cambiar de la misma manera y en el mismo orden. Una **herramienta de migración** (_migration tool_) mantiene ese orden. Flyway, que usaste durante tus prácticas, es una: cada cambio es un archivo con sentencias SQL, numerado por versión, y la herramienta ejecuta en cada base de datos los archivos que todavía no ha ejecutado.

La herramienta pertenece al lado de la aplicación: decide qué cambio se ejecuta dónde, y cuándo. Lo que contiene cada archivo sigue siendo `ALTER TABLE`, `CREATE TABLE` y las sentencias de este capítulo. La herramienta añade el historial de versiones. SQL sigue siendo lo que cambia el esquema, y cada fallo de la sección siguiente ocurre dentro de una migración exactamente igual que en pgAdmin.

> **Preview — Spring Boot:** Este párrafo nombra ajustes de Hibernate del proyecto 07. Los estudiarás en las notas de Spring Boot. Léelo para ver qué cambios de esquema llegan a la base de datos.

El proyecto 07 no usa ninguna herramienta de migración. Su `application.properties` define `spring.jpa.hibernate.ddl-auto=update`, que deja que Hibernate cree las tablas que faltan y añada las columnas que faltan cada vez que arranca la aplicación. No cambia una columna que ya existe. El `PLANNING.md` del proyecto 07 recoge la consecuencia: una regla añadida a una columna existente, como un not-null, llega a la base de datos solo mediante un `ALTER TABLE` ejecutado a mano, después de rellenar las filas antiguas. Ese orden es el tema de la sección siguiente.

## Añadir una restricción a una tabla que ya tiene filas

Docs: https://www.postgresql.org/docs/current/ddl-alter.html#DDL-ALTER-ADDING-A-CONSTRAINT → lee: "5.7.3. Adding a Constraint" — la restricción se comprueba de inmediato, así que las filas guardadas ya tienen que cumplirla

Una restricción es una promesa sobre todas las filas de la tabla, no solo sobre las filas insertadas a partir de ahora. Por eso, cuando añades una, PostgreSQL comprueba en ese momento todas las filas ya guardadas, y rechaza la regla si una sola fila la incumple.

`books` tiene un libro sin precio, _The Angel's Game_. Haz el precio obligatorio:

```sql
ALTER TABLE books ALTER COLUMN price SET NOT NULL;
```

```
ERROR:  column "price" of relation "books" contains null values
```

La regla no se añadió, y la tabla no cambió. Lo mismo ocurre cuando añades una columna nueva como `NOT NULL` sin valor por defecto, porque todas las filas existentes reciben `NULL` en ella:

```sql
ALTER TABLE books ADD COLUMN is_featured BOOLEAN NOT NULL;
```

```
ERROR:  column "is_featured" of relation "books" contains null values
```

Las demás reglas se comportan igual. Un `UNIQUE` se rechaza cuando dos filas guardadas comparten un valor. Por eso la sección [`UNIQUE` rechaza valores repetidos, pero no `NULL`s repetidos](#unique-rechaza-valores-repetidos-pero-no-nulls-repetidos) dijo que `NULLS NOT DISTINCT` no se puede añadir a `books`:

```sql
ALTER TABLE books ADD CONSTRAINT books_isbn_nnd_key UNIQUE NULLS NOT DISTINCT (isbn);
```

```
ERROR:  could not create unique index "books_isbn_nnd_key"
DETAIL:  Key (isbn)=(null) is duplicated.
```

La primera línea dice que no se pudo construir el índice que hace cumplir la regla. La línea `DETAIL` dice por qué: con esta regla dos `NULL` son iguales, y dos libros guardan uno.

Un `CHECK` todavía puede pasar sobre estas mismas filas, por la lógica de tres valores de la sección [`CHECK` rechaza lo falso y deja pasar lo desconocido](#check-rechaza-lo-falso-y-deja-pasar-lo-desconocido). `ALTER TABLE books ADD CONSTRAINT books_price_positive CHECK (price > 0);` **funciona**, aunque _The Angel's Game_ no tiene precio, porque `NULL > 0` es desconocido y un check solo rechaza lo falso.

### Corrige primero las filas y añade después la restricción

La solución son dos sentencias, y su orden es fijo. Primero haces que todas las filas guardadas cumplan la regla. Después añades la regla:

```sql
-- 1. Corregir las filas que incumplen la regla
UPDATE books SET price = 15.99 WHERE id = 11;

-- 2. Añadir la regla: ahora todas las filas la cumplen
ALTER TABLE books ALTER COLUMN price SET NOT NULL;
```

Las dos funcionan. En el otro orden, el `ALTER TABLE` se ejecuta cuando el libro todavía no tiene precio, falla con el error de arriba, y la regla no se añade nunca. Lo que escribe la primera sentencia es una decisión de negocio, no un detalle técnico: aquí, el precio que la tienda cobra de verdad por ese libro. Inventarse un valor solo para que la restricción pase, como `0`, guarda una falsedad que la regla nueva pasará a proteger.

> **¿Por qué PostgreSQL no aplica la regla solo a las filas nuevas y deja en paz a las antiguas?** Porque entonces la regla ya no diría nada seguro. Una consulta que cuente con que "`price` nunca es `NULL`" seguiría encontrando `NULL`, en las filas que ya estaban. Una restricción vale algo porque se cumple en todas las filas, así que PostgreSQL se niega a declarar una que ya es falsa.

## `DROP` elimina la tabla; `DELETE` y `TRUNCATE` eliminan filas

Docs: https://www.postgresql.org/docs/current/ddl-depend.html → lee: "5.15. Dependency Tracking" — el ejemplo de `DROP TABLE products`, con `RESTRICT` y `CASCADE`

Tres sentencias hacen desaparecer datos, y eliminan cosas distintas. `DROP` elimina un objeto de la base de datos: la propia tabla, con su definición, sus filas, sus restricciones y sus índices. Después de un `DROP TABLE`, el nombre ya no existe y un `SELECT` sobre él falla con `relation ... does not exist`. `DELETE` y `TRUNCATE` eliminan filas y conservan la tabla: sus columnas, sus reglas y su nombre se quedan, vacíos o más vacíos, listos para filas nuevas.

| Sentencia | Elimina | La tabla después |
|---|---|---|
| `DROP TABLE wishlist_items;` | la tabla: definición, filas, restricciones, índices | no existe |
| `TRUNCATE wishlist_items;` | todas las filas | existe, vacía |
| `DELETE FROM wishlist_items WHERE id = 3;` | las filas que alcanza el `WHERE` | existe, con sus otras filas |

La segunda columna es lo que ha desaparecido, y la tercera es lo que todavía puedes consultar. La diferencia entre las dos últimas filas es una pregunta sobre filas: `DELETE` elimina las filas que selecciona un `WHERE` y `TRUNCATE` las elimina todas a la vez, y se diferencian en velocidad, en bloqueos y en lo que le hacen a una secuencia identity. Ese es el tema de [08-dml.md](08-dml.md), con el resto de sentencias que cambian filas. Este capítulo trata de la tabla, y la tabla sobrevive a ambas.

### Qué se lleva por delante `DROP TABLE`

Una tabla a la que referencian otras tablas no puede desaparecer sin más, por la misma razón por la que no puede hacerlo una fila padre. `authors` está referenciada por `books`:

```sql
DROP TABLE authors;
```

```
ERROR:  cannot drop table authors because other objects depend on it
DETAIL:  constraint books_author_id_fkey on table books depends on table authors
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

La línea `DETAIL` nombra el objeto que estorba, y es una restricción, no una tabla. Eso importa para el `HINT`. `DROP TABLE authors CASCADE` elimina `authors` y la **clave foránea** `books_author_id_fkey`. No elimina `books`:

```
NOTICE:  drop cascades to constraint books_author_id_fkey on table books
```

`books` conserva todas sus filas y todos los valores de `author_id`, y nada comprueba ya esos valores. `TRUNCATE` está protegido de la misma manera: `TRUNCATE authors;` falla con `cannot truncate a table referenced in a foreign key constraint`, porque vaciar el padre dejaría a todas las hijas apuntando a nada.

Esto es también lo que hace el script de datos en su primera parte. `DROP TABLE IF EXISTS books CASCADE;` elimina `books`, y el `CASCADE` elimina las claves foráneas de las otras tablas que apuntan a ella. `IF EXISTS` convierte "no existe esa tabla" en el `NOTICE` que viste en el capítulo 00 en lugar de un error. Y es la razón por la que este capítulo te pidió eliminar `wishlist_items` a mano: el `CASCADE` del script de datos eliminaría solo las dos claves foráneas de `wishlist_items`, y dejaría la tabla atrás con filas que apuntan a clientes y libros que el script acaba de reconstruir sin garantía de que coincidan.

Termina ahora los experimentos del capítulo, en este orden:

```sql
DROP TABLE wishlist_items;
```

Después ejecuta de nuevo el script de datos completo. La base de datos de práctica vuelve a sus ocho tablas y a sus 72 filas originales, con las reglas originales.

---

## Convenciones de nombres

Docs: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS → lee: "4.1.1. Identifiers and Key Words" — por qué los nombres sin comillas se pasan a minúsculas, que es la razón de las minúsculas con guiones bajos

Todas las tablas de la base de datos de práctica siguen los mismos hábitos de nombres, y también lo hacen la mayoría de los esquemas que encontrarás en el trabajo. Importan por dos razones. Un lector que los conoce sabe qué guarda una columna antes de leer su definición: `author_id` apunta a `authors`, `is_featured` es un indicador de sí o no. Y PostgreSQL pasa a minúsculas un nombre escrito sin comillas dobles, así que `firstName` en una sentencia se convierte en `firstname`. Las palabras en minúsculas separadas por guiones bajos son el único estilo que sobrevive a ese paso sin cambios. [03-select.md](03-select.md) enseña los nombres entre comillas que conservan las mayúsculas.

| Cosa | Convención | Ejemplo |
| --- | --- | --- |
| Tablas | En plural, minúsculas, guiones bajos | `authors`, `order_items` |
| Clave primaria | `id`, cuando es una clave sustituta | `id` |
| Clave foránea | la tabla referenciada en singular, y luego `_id` | `author_id`, `customer_id` |
| Columnas | Minúsculas, guiones bajos | `first_name`, `unit_price` |
| Columnas de marca de tiempo | Terminan en `_at` | `added_at`, `created_at` |
| Columnas de fecha | Terminan en `_date` | `joined_date`, `order_date` |
| Columnas booleanas | Empiezan por `is_` o `has_` | `is_featured`, `has_discount` |
| Restricciones | la tabla, las columnas y luego el sufijo del tipo de regla | `wishlist_items_customer_book_key`, `books_isbn_key` |

La segunda columna es el hábito, y la tercera lo muestra en las tablas de este capítulo. Dos filas tienen un alcance concreto. La fila de la clave primaria trata de claves sustitutas: una tabla intermedia con una clave primaria compuesta, como `wishlist_items_example` en la sección [Claves candidatas y clave primaria](#claves-candidatas-y-clave-primaria), no tiene ningún `id`. La fila de las restricciones sigue los nombres que genera el propio PostgreSQL, que listó la sección [Nombres de restricción y los errores que los citan](#nombres-de-restricción-y-los-errores-que-los-citan), de modo que un nombre que escribas tú se lee como los generados.

## Lo que desbloquea este capítulo

Ya puedes escribir un `CREATE TABLE` y leer uno: el tipo de cada columna, su valor por defecto, si es obligatoria y las reglas sobre sus valores. Puedes decir qué hace un valor por defecto con una columna omitida y con un `NULL` explícito, por qué un `CHECK` deja pasar `NULL` y por qué una columna `UNIQUE` acepta varios `NULL`. Puedes nombrar el grano de una tabla, elegir su clave primaria, mantener únicas sus claves naturales junto a una sustituta, colocar una clave foránea en el lado "muchos", modelar una relación muchos a muchos con una tabla intermedia y elegir qué ocurre con las hijas cuando se borra un padre o cambia su clave. Puedes explicar por qué los datos se reparten entre tablas, y leer un esquema para ver su grano, sus claves, su nulabilidad y su cardinalidad. Y puedes hacer evolucionar una tabla con `ALTER TABLE`, en el orden correcto cuando ya existen filas, y distinguir `DROP` de eliminar filas.

Todo eso describe datos que ya están guardados. Nada de ello le hace todavía una pregunta a la base de datos, y el capítulo 00 usó `SELECT` solo en sus formas más cortas. Con el esquema ya comprensible como un conjunto de tablas tipadas y relacionadas, [03-select.md](03-select.md) empieza a preguntar: qué columnas tiene un resultado, qué expresiones calculan columnas nuevas y cómo se nombran las columnas de un resultado.
