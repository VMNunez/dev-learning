## Índice de esta nota

- [SQL — Tipos de datos](#sql--tipos-de-datos)

1. [Qué decide un tipo de datos sobre un valor](#qué-decide-un-tipo-de-datos-sobre-un-valor)
2. [Convertir un valor con `::` y `CAST`](#convertir-un-valor-con--y-cast)
   - [Las dos formas de escribir un cast](#las-dos-formas-de-escribir-un-cast)
   - [Cuándo PostgreSQL convierte sin que se lo pidas](#cuándo-postgresql-convierte-sin-que-se-lo-pidas)
   - [Un cast se aplica solo a lo que tiene justo delante](#un-cast-se-aplica-solo-a-lo-que-tiene-justo-delante)
   - [Un cast que no puede convertir el valor](#un-cast-que-no-puede-convertir-el-valor)
3. [Tipos de texto](#tipos-de-texto)
   - [`VARCHAR(n)` frente a `TEXT` — qué queda por elegir](#varcharn-frente-a-text--qué-queda-por-elegir)
   - [`CHAR(n)` rellena cada valor con espacios](#charn-rellena-cada-valor-con-espacios)
4. [Tipos numéricos](#tipos-numéricos)
   - [Columnas identity y `SERIAL`](#columnas-identity-y-serial)
   - [Por qué `NUMERIC` es exacto y `FLOAT` no](#por-qué-numeric-es-exacto-y-float-no)
   - [La división entera descarta la fracción](#la-división-entera-descarta-la-fracción)
5. [Tipos de fecha y hora](#tipos-de-fecha-y-hora)
   - [El instante que representa cada tipo](#el-instante-que-representa-cada-tipo)
   - [Un mismo valor `TIMESTAMPTZ` leído en dos zonas horarias](#un-mismo-valor-timestamptz-leído-en-dos-zonas-horarias)
   - [Convertir un timestamp a date](#convertir-un-timestamp-a-date)
6. [Boolean](#boolean)
   - [Tres estados y los literales que debes escribir](#tres-estados-y-los-literales-que-debes-escribir)
7. [`JSONB` — un documento JSON en una columna](#jsonb--un-documento-json-en-una-columna)
   - [Leer un campo de un valor `JSONB`](#leer-un-campo-de-un-valor-jsonb)
   - [Cuándo un documento gana a las columnas tipadas, y qué sacrifica](#cuándo-un-documento-gana-a-las-columnas-tipadas-y-qué-sacrifica)
8. [Redondeo y escala del resultado](#redondeo-y-escala-del-resultado)
   - [`ROUND(value, n)` solo acepta `NUMERIC`](#roundvalue-n-solo-acepta-numeric)
   - [Cómo decide PostgreSQL la escala de un resultado](#cómo-decide-postgresql-la-escala-de-un-resultado)
   - [Redondea la expresión entera, nunca un operando](#redondea-la-expresión-entera-nunca-un-operando)
   - [La misma regla de la escala dentro de un total de informe](#la-misma-regla-de-la-escala-dentro-de-un-total-de-informe)
9. [Qué tipo elegir — referencia rápida](#qué-tipo-elegir--referencia-rápida)
10. [Qué desbloquea este capítulo](#qué-desbloquea-este-capítulo)

# SQL — Tipos de datos

Docs: https://www.postgresql.org/docs/current/datatype.html → lee: "Chapter 8. Data Types" — el párrafo inicial y la Table 8.1, y después las familias de tipos que esta nota recorre una a una

---

[00-sql-y-bases-de-datos-relacionales.md](00-sql-y-bases-de-datos-relacionales.md), la introducción a esta ruta, te dejó capaz de leer la definición de una columna dentro de `CREATE TABLE`: primero el nombre de la columna, luego su tipo de datos y después cualquier regla o valor por defecto. En `price NUMERIC(8,2)` sabes qué palabra es el nombre y qué parte es el tipo, pero todavía no qué promete `NUMERIC(8,2)`. Este capítulo trata de esa parte central. Antes de poder declarar una tabla (capítulo 02) o filtrar sus filas (capítulo 04), necesitas saber qué es un valor suelto en PostgreSQL: qué acepta cada tipo, cómo un valor pasa a ser de otro tipo y qué sigue siendo exacto cuando se combinan valores en un cálculo.

El capítulo sigue ese orden. Empieza por lo que un tipo decide sobre un valor, con unas cuantas sentencias `SELECT` de una línea que puedes ejecutar en la base de datos de práctica. A continuación viene la conversión, el operador `::` y `CAST`, porque casi todas las secciones posteriores usan un cast. Después llegan los tipos en sí, una familia por sección: texto, números, fechas y horas, booleanos y `JSONB` para documentos JSON enteros. Con los tipos ya vistos, la sección de redondeo enseña cómo se calcula la escala de un resultado `NUMERIC` a partir de sus operandos, que es la regla que hay detrás de todo total de informe que vas a escribir. El capítulo cierra con una tabla de referencia rápida y el paso al capítulo 02.

---

## Qué decide un tipo de datos sobre un valor

Docs: https://www.postgresql.org/docs/current/datatype.html → lee: el párrafo inicial y la Table 8.1 "Data Types" — la lista completa de tipos integrados, con los nombres alternativos que te vas a encontrar (`int`, `float8`, `timestamptz`)

Los mismos caracteres pueden significar tres cosas distintas según su tipo. Toma los caracteres `10` y `9`. Ejecuta estas dos sentencias en pgAdmin, contra `practice_junior_notes`:

```sql
SELECT 10 < 9;
```

```sql
SELECT '10' < '9';
```

La primera devuelve `false`. La segunda devuelve `true`.

En la primera sentencia, `10` y `9` son números enteros, así que `<` compara sus valores numéricos, y diez no es menor que nueve. En la segunda, las comillas simples los convierten en texto, y el texto se compara carácter a carácter desde la izquierda, como un diccionario ordena las palabras. El primer carácter de `'10'` es `1`, el primer carácter de `'9'` es `9`, y `1` va antes que `9`. La comparación termina ahí, así que `'10'` se ordena antes que `'9'`.

Los caracteres no cambiaron. Solo cambió el tipo, y el tipo decidió qué significa `<`. Esa es la regla general sobre la que se apoya este capítulo: **el tipo de un valor decide cuatro cosas sobre él.**

1. **Qué operaciones existen.** `+` está definido para números. No está definido para texto, así que `SELECT title + 1 FROM books;` falla con `ERROR:  operator does not exist: character varying + integer`. `character varying` es el nombre completo de `VARCHAR`, el tipo de `title`.
2. **Cómo se comparan dos valores.** Los números se comparan por tamaño, el texto por caracteres y las fechas por su posición en el calendario. Acabas de ver que los dos primeros discrepan sobre `10` y `9`.
3. **Qué significa un valor almacenado.** `2025-03-01` almacenado como `DATE` es un día del calendario: `SELECT DATE '2025-03-01' + 30;` responde `2025-03-31`, porque sumar un número entero a una fecha la desplaza esa cantidad de días. La palabra `DATE` delante del texto entrecomillado marca ese texto como una fecha; la sección [El instante que representa cada tipo](#el-instante-que-representa-cada-tipo) explica esa forma. Almacenados como texto, esos mismos caracteres son solo diez caracteres, y sumarles 30 no significa nada.
4. **Qué precisión tiene un número.** Algunos tipos numéricos guardan cada dígito decimal con exactitud y otros guardan una aproximación. La diferencia es invisible hasta que un cálculo la deja ver, y eso es lo que hace la sección [Por qué `NUMERIC` es exacto y `FLOAT` no](#por-qué-numeric-es-exacto-y-float-no).

> **¿Por qué importa más el tipo de la columna que el valor que inserto?** Porque PostgreSQL convierte cada valor al tipo de la columna antes de almacenarlo, y desde ese momento el valor se comporta como ese tipo en todas las consultas y para todos los clientes. Si `price` estuviera declarada como texto, `ORDER BY price` pondría `14.99` antes que `9.99` por la misma razón por la que `'10' < '9'` es verdadero, y ninguna consulta lo arreglaría sin convertir antes la columna.

Este es también el hábito de JavaScript que conviene abandonar. En JavaScript, `'10' < '9'` es `true` y `10 < '9'` es `false`, porque JavaScript convierte un lado cuando los dos tipos son distintos. PostgreSQL decide primero el tipo de cada valor y después busca un operador definido para esos tipos. Solo convierte un valor por su cuenta a lo largo de una lista corta de conversiones que considera seguras, como pasar un número entero a un número decimal, y de texto a número no está en esa lista. Por eso `title + 1` es un error y no una conversión silenciosa. La sección siguiente muestra esa lista en funcionamiento y cómo conviertes tú un valor cuando lo necesitas.

---

## Convertir un valor con `::` y `CAST`

Docs: https://www.postgresql.org/docs/current/sql-expressions.html → lee: "4.2.9. Type Casts" — las dos sintaxis y cuándo se puede omitir un cast

Un **cast** es la conversión de un valor de un tipo a otro. Lo necesitas siempre que un valor tiene el contenido correcto pero el tipo equivocado para lo que quieres hacer con él: un número que llegó como texto, un timestamp que quieres comparar como un día, un número entero que quieres dividir sin perder la fracción.

### Las dos formas de escribir un cast

PostgreSQL acepta dos sintaxis, y hacen exactamente lo mismo:

```sql
SELECT CAST('5' AS INT);
```

```sql
SELECT '5'::int;
```

Las dos devuelven el número entero `5`. `CAST(value AS type)` es la forma definida por el estándar SQL, así que funciona en cualquier base de datos. `value::type` es la forma más corta, propia de PostgreSQL, y es la que verás en casi todas las consultas de PostgreSQL, porque se lee de izquierda a derecha: primero el valor y luego aquello en lo que lo conviertes.

El cast funciona sobre cualquier expresión, no solo sobre un literal. Un **literal** es un valor escrito directamente en la sentencia, como `'5'` o `9.99`. Aquí el valor viene de una columna de la base de datos de práctica. `reviewed_at` es un timestamp: una fecha más una hora del día.

```sql
SELECT reviewed_at, reviewed_at::date
FROM reviews
WHERE book_id = 7;
```

```
 reviewed_at         | reviewed_at
---------------------+-------------
 2025-03-01 08:55:00 | 2025-03-01
```

`reviewed_at::date` convierte el timestamp en una fecha, lo que elimina la hora del día. Las dos columnas se llaman `reviewed_at` porque PostgreSQL pone a la columna de un cast el nombre de la columna que lleva dentro. `WHERE book_id = 7` conserva solo la reseña del libro 7. [04-where.md](04-where.md) enseña `WHERE`.

Este es el cast que más vas a escribir, porque te permite comparar un timestamp con un día:

```sql
-- MAL: '2025-03-01' se convierte en el timestamp 2025-03-01 00:00:00, que ninguna reseña tiene
SELECT book_id, rating FROM reviews WHERE reviewed_at = '2025-03-01';

-- BIEN: compara el día del timestamp con el día que quieres decir
SELECT book_id, rating FROM reviews WHERE reviewed_at::date = '2025-03-01';
```

La primera sentencia no devuelve ninguna fila. La segunda devuelve el libro 7 con una valoración de 2. La primera no encuentra nada porque el texto `'2025-03-01'` se convierte al tipo del otro lado, un timestamp, y un timestamp sin hora del día significa medianoche. La reseña se escribió a las 08:55, así que no es igual a medianoche. Al convertir la columna a `date`, los dos lados pasan a ser días, y los dos días son iguales. El mismo cast aparece en las condiciones de join, que enseña [06-joins.md](06-joins.md): para emparejar el timestamp de una reseña con la fecha de un pedido hace falta `reviewed_at::date` en uno de los lados.

> **En una tabla grande, el cast sobre la columna tiene un coste.** `reviewed_at::date` hay que calcularlo para cada fila antes de poder compararlo, así que PostgreSQL no puede ir directo a las filas que coinciden a través de un índice sobre `reviewed_at`. [04-where.md](04-where.md) enseña la forma que deja la columna intacta, un rango desde el inicio del día hasta el inicio del siguiente: `reviewed_at >= '2025-03-01' AND reviewed_at < '2025-03-02'`. [13-indices.md](13-indices.md) explica por qué un índice necesita la columna tal como está almacenada. En las ocho filas de la tabla `reviews` de práctica, las dos formas son igual de rápidas.

### Cuándo PostgreSQL convierte sin que se lo pidas

No escribes un cast en cada valor, porque PostgreSQL convierte por sí mismo en dos situaciones.

**Un literal entre comillas no tiene tipo hasta que se usa.** En la consulta `BIEN` de arriba, `'2025-03-01'` se convirtió en fecha sin ningún cast. El texto entre comillas simples que todavía no está unido a nada empieza sin tipo, y PostgreSQL le da el tipo que la expresión necesita. Por eso `SELECT '5' + 1;` devuelve `6`. Cuando un lado de un operador aún no tiene tipo, PostgreSQL prueba primero con el tipo del otro lado. El otro lado es el entero `1`, existe un operador `integer + integer`, y por eso `'5'` se lee como el número entero 5.

**Un valor que se escribe en una columna se convierte al tipo de esa columna.** Cuando insertas `9.99` en la columna `price NUMERIC(8,2)`, PostgreSQL lo convierte a `NUMERIC(8,2)`. No escribiste `9.99::numeric(8,2)`.

Las dos conversiones automáticas están limitadas a propósito. PostgreSQL lleva una lista interna de las conversiones que existen entre cada par de tipos, y cada entrada indica dónde puede ocurrir la conversión sin que se escriba:

- **dentro de cualquier expresión**: un `integer` pasa a `numeric`, que es como funciona `12 / 5.0` más abajo;
- **solo cuando un valor se almacena en una columna**: un `numeric` pasa a `integer`, de modo que insertar `9.7` en una columna `INT` almacena `10`, redondeado sin avisar;
- **nunca**: un `integer` nunca pasa a `boolean` por sí solo, lo que muestra fallando la sección [Tres estados y los literales que debes escribir](#tres-estados-y-los-literales-que-debes-escribir).

Toda conversión que no esté entre esas entradas hay que escribirla como un cast, para que nada cambie de tipo a tus espaldas. Por eso tienes que escribir el cast en tres situaciones:

| Situación | Ejemplo | Dónde la trata este capítulo |
|---|---|---|
| Los dos operandos ya tienen un tipo, y el operador que PostgreSQL elige para esos tipos no es el que quieres | `12 / 5` divide dos números enteros y descarta la fracción | [La división entera descarta la fracción](#la-división-entera-descarta-la-fracción) |
| Una función u operador existe solo para otro tipo, y ninguna conversión automática llega hasta él | `ROUND(value, 2)` existe solo para `NUMERIC`, y un valor `double precision` no se convierte a él automáticamente | [`ROUND(value, n)` solo acepta `NUMERIC`](#roundvalue-n-solo-acepta-numeric) |
| El valor ya tiene un tipo, y lo quieres como otro | `reviewed_at::date` para comparar con un día; el texto leído de un documento JSON convertido en número | [Convertir un timestamp a date](#convertir-un-timestamp-a-date) y [Leer un campo de un valor `JSONB`](#leer-un-campo-de-un-valor-jsonb) |

La columna del medio da un ejemplo por situación. La columna de la derecha enlaza la sección de este archivo donde se desarrolla ese ejemplo.

### Un cast se aplica solo a lo que tiene justo delante

`::` se une con más fuerza que cualquier operador aritmético. En `12 / 5::numeric`, PostgreSQL lee primero `5::numeric` y solo después divide, así que el cast convierte el `5` y nada más. Eso suele ser justo lo que quieres, porque convertir un solo operando basta para cambiar el tipo de toda la división (la sección [La división entera descarta la fracción](#la-división-entera-descarta-la-fracción) muestra por qué). Cuando quieres convertir el resultado de una expresión, pon la expresión entre paréntesis: `(12 / 5)::numeric` divide primero y convierte después el resultado.

```sql
SELECT 12 / 5::numeric;    -- 2.4000000000000000  el 5 se convierte antes de dividir
SELECT (12 / 5)::numeric;  -- 2                   la división ya descartó el .4
```

### Un cast que no puede convertir el valor

Un cast comprueba que el contenido tenga sentido para el nuevo tipo. La columna `isbn` guarda texto como `978-0451524935`, y convertirlo a número falla:

```sql
SELECT isbn::bigint FROM books;
```

```
ERROR:  invalid input syntax for type bigint: "978-0451524935"
```

`bigint` es un tipo de número entero con un rango mayor que `int`, que trata la sección [Columnas identity y `SERIAL`](#columnas-identity-y-serial). El mensaje nombra el tipo de destino y cita el primer valor que no se pudo leer como tal, aquí por culpa del guion. Como con cualquier error, la sentencia no devuelve nada. Un cast de texto a número o a fecha solo tiene éxito cuando el texto de cada fila es una entrada válida para ese tipo.

---

## Tipos de texto

Docs: https://www.postgresql.org/docs/current/datatype-character.html → lee: "8.3. Character Types" — el consejo sobre rendimiento y el Example 8.1

La mayoría de las columnas de un esquema guardan texto: un título, un email, una ciudad. PostgreSQL te da tres tipos para ello, y se diferencian solo en lo que hacen con la longitud de un valor.

| Tipo | Cuándo usarlo |
|------|-------------|
| `CHAR(n)` | Longitud fija, rellenada con espacios — se encuentra en esquemas heredados, no se elige para columnas nuevas (p. ej. un código de país heredado `'ES'`, `'UK'`) |
| `VARCHAR(n)` | Longitud variable con un máximo — la elección más habitual para nombres, títulos y emails |
| `TEXT` | Sin límite de longitud — para contenido largo como descripciones, comentarios o entradas de blog |

> En PostgreSQL, `VARCHAR` y `TEXT` tienen exactamente el mismo rendimiento de almacenamiento. La única razón real para usar `VARCHAR(n)` es documentar la intención: "este valor no debería superar N caracteres".

### `VARCHAR(n)` frente a `TEXT` — qué queda por elegir

El aviso de arriba resuelve la cuestión del rendimiento. Esta sección trata de lo que sigue haciendo la `(n)`, porque "documentar la intención" no es solo un comentario para el siguiente desarrollador: PostgreSQL lo hace cumplir.

La columna `city` de `customers` es `VARCHAR(50)`. Intenta guardar un nombre de ciudad de más de 50 caracteres, el nombre de 58 letras de un pueblo galés real:

```sql
UPDATE customers
SET city = 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch'
WHERE id = 3;
```

```
ERROR:  value too long for type character varying(50)
```

La sentencia se rechaza y la fila conserva su ciudad. `UPDATE` modifica las filas que `WHERE` conserva, y lo enseña [08-dml.md](08-dml.md). Con `TEXT`, la misma sentencia tendría éxito, porque `TEXT` no tiene ningún máximo que romper.

Así que la elección entre los dos es una elección sobre los datos, nunca sobre la velocidad:

- **`VARCHAR(n)`** cuando el dominio tiene un máximo real y un valor más largo significa un bug o una entrada incorrecta: un número de teléfono, un ISBN, una dirección de email, un código de estado. El límite funciona entonces como una regla, y todos los clientes reciben el mismo error.
- **`TEXT`** cuando ninguna longitud tiene sentido: el comentario de una reseña, una descripción, una nota. Inventar un `VARCHAR(255)` para estos casos solo crea un fallo el día en que alguien escriba 256 caracteres.

> **`VARCHAR` sin `(n)` es `TEXT` con otro nombre.** Sin una longitud, `VARCHAR` acepta cadenas de cualquier longitud, así que no queda ninguna regla en él. Escribe `TEXT`, para que quien lea sepa que la ausencia de límite es deliberada.

> **Un cast explícito corta el texto en lugar de fallar.** `SELECT 'too long'::varchar(5);` devuelve `too l` sin ningún error. Solo almacenar un valor demasiado largo en una columna provoca el error de arriba. Un cast a un `VARCHAR` más corto es una forma silenciosa de perder caracteres, así que nunca lo uses para que un valor "quepa".

Cambiar el límite más adelante es un cambio en la definición de la tabla, que forma parte de [02-relaciones.md](02-relaciones.md). Ese coste es el único argumento real para dejar sin límite una columna de texto cuyo máximo no conoces.

### `CHAR(n)` rellena cada valor con espacios

`CHAR(n)` es un tipo de texto de otra clase. Todo valor que almacena mide exactamente `n` caracteres: un valor más corto se completa por la derecha con espacios hasta llegar a `n`. El **relleno con espacios** (_blank padding_) es el nombre de esos espacios añadidos.

Guarda `'ok'` en una columna `CHAR(4)` y el valor almacenado es `'ok'` seguido de dos espacios. Después, PostgreSQL trata esos espacios como si no estuvieran en dos lugares:

```sql
SELECT length('ok'::char(4));            -- 2
SELECT 'ok'::char(4) = 'ok  '::char(4);  -- true
```

`length()` devuelve el número de caracteres de un valor de texto. Aquí dice 2, aunque se almacenan cuatro caracteres. La comparación dice que los dos valores son iguales, aunque uno se escribió con espacios y el otro sin ellos. Las dos cosas se deben a la misma regla: en `CHAR(n)`, los espacios finales se consideran no significativos. Se ignoran cuando `length()` cuenta los caracteres de un valor `CHAR` y cuando se comparan dos valores `CHAR`, y se eliminan cuando un valor `CHAR` se convierte a otro tipo de texto, como `VARCHAR` o `TEXT`.

Por eso la longitud que se informa no coincide con lo que se almacenó: la columna conserva el relleno, y `length()` no lo cuenta. El relleno sigue ahí para cualquier cosa que lea el valor almacenado tal cual. Un cliente que obtiene la columna recibe `'ok  '`, cuatro caracteres, y un `equals("ok")` de Java sobre ese valor devuelve `false`.

> **Dónde te vas a encontrar `CHAR(n)`.** En esquemas heredados de Oracle o de sistemas de bases de datos más antiguos es habitual una columna como `country_code CHAR(2)` o un código de estado `CHAR(1)`, porque en otros sistemas de bases de datos el texto de longitud fija tiene una ventaja de rendimiento. La propia documentación de PostgreSQL afirma que `CHAR(n)` no tiene aquí esa ventaja y que suele ser el más lento de los tres tipos, por el almacenamiento adicional. Cuando lo encuentres en una tabla heredada, ya sabes cómo se comporta; para las columnas nuevas, usa `VARCHAR(n)` o `TEXT`.

---

## Tipos numéricos

Docs: https://www.postgresql.org/docs/current/datatype-numeric.html → lee: "8.1. Numeric Types" — la Table 8.2 con todos los rangos, "Arbitrary Precision Numbers" para `NUMERIC` y "Floating-Point Types"

| Tipo | Cuándo usarlo |
|------|-------------|
| `SMALLINT` | Números enteros pequeños (-32.768 a 32.767) — rara vez hace falta |
| `INT` | Elección por defecto para números enteros |
| `SERIAL` | Entero autoincremental — atajo heredado; prefiere una columna identity (ver más abajo) |
| `NUMERIC(p,s)` | Números decimales exactos — **úsalo siempre para dinero y precios** |
| `REAL` / `FLOAT` | Decimales aproximados — para datos científicos, **nunca para dinero** |

`NUMERIC(p,s)` — `p` es el total de dígitos, `s` es el número de dígitos después del punto decimal.
Ejemplo: `NUMERIC(10,2)` → almacena con exactitud valores hasta `99999999.99`.

> **¿Por qué no FLOAT para dinero?** `FLOAT` es una aproximación: incluso valores simples como `0.1` no se pueden representar con exactitud en coma flotante binaria. Cada cálculo puede mover el resultado en una cantidad minúscula, y esas cantidades se acumulan a lo largo de un total, de modo que una suma que debería ser exactamente `100.00` puede salir un pelo por encima o por debajo. Usa `NUMERIC(10,2)` para cualquier columna que guarde un precio, un importe o un valor financiero.

### Columnas identity y `SERIAL`

Docs: https://www.postgresql.org/docs/current/ddl-identity-columns.html → lee: "5.3. Identity Columns" — `ALWAYS` frente a `BY DEFAULT`

Cada fila necesita un `id` que la identifique, y nadie quiere escribirlo a mano. En la base de datos de práctica, las sentencias `INSERT` nunca dan un `id`, y los libros aun así reciben 1, 2, 3. El script de datos iniciales lo consigue con `SERIAL`:

```sql
id SERIAL PRIMARY KEY,
```

**`SERIAL` no es un tipo.** Es un atajo que PostgreSQL expande en tres cosas al crear la tabla. La documentación de PostgreSQL da la expansión. Escribir una columna `colname SERIAL` en una tabla `tablename` equivale a esto:

```sql
CREATE SEQUENCE tablename_colname_seq AS integer;
CREATE TABLE tablename (
    colname integer NOT NULL DEFAULT nextval('tablename_colname_seq')
);
ALTER SEQUENCE tablename_colname_seq OWNED BY tablename.colname;
```

Léelo en tres pasos:

1. `CREATE SEQUENCE` crea una **secuencia** (_sequence_): un objeto de la base de datos aparte que guarda un contador y entrega el siguiente número cada vez que se lo piden. `nextval('tablename_colname_seq')` es la función que se lo pide.
2. La propia columna es un `integer` normal, declarado `NOT NULL`, con un **valor por defecto** (_default value_) de `nextval(...)`. Un valor por defecto se usa solo cuando un insert no da ningún valor para la columna. Así, un insert que omite `id` recibe el siguiente número de la secuencia.
3. `OWNED BY` une la secuencia a la columna, de modo que eliminar la columna o la tabla elimina también la secuencia.

El paso 2 es donde `SERIAL` es débil: el valor por defecto es solo un valor por defecto. Un insert que sí da un `id`, por ejemplo `INSERT INTO genres (id, name) VALUES (7, 'Essay');`, se acepta, y la secuencia no se entera. Los seis géneros de los datos iniciales usaron los números del 1 al 6, así que la secuencia sigue entregando el 7 a continuación, y el siguiente insert sin `id` recibe el 7 y choca con la fila que acabas de escribir. Cómo reajustar la secuencia para que vuelva a ir por delante de las filas que ya existen se enseña en [08-dml.md](08-dml.md).

**Una columna identity** es la forma del estándar SQL de pedir lo mismo, y la que debes elegir para las tablas nuevas. Así declararía su clave la tabla `genres` del script de datos iniciales con una:

```sql
CREATE TABLE genres (
  id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```

`GENERATED ALWAYS AS IDENTITY` le dice a PostgreSQL que genere él mismo el valor de `id`, a partir de una secuencia que pertenece a la columna y que no es un objeto aparte del que tengas que ocuparte tú. La columna es `NOT NULL` automáticamente. `ALWAYS` añade la protección de la que carece `SERIAL`: se rechaza un insert que dé su propio `id`.

```
ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.
```

La primera línea nombra el fallo: el insert intentó poner su propio valor en `id`. La línea `DETAIL` dice por qué eso está prohibido, y la línea `HINT` nombra la cláusula que lo permite a propósito, para el caso poco frecuente de copiar filas con sus ids originales.

La otra forma, `GENERATED BY DEFAULT AS IDENTITY`, acepta un valor que tú des y genera uno solo cuando no das ninguno. En ese aspecto se comporta como `SERIAL`, con la secuencia aún perteneciendo a la columna.

> **Ninguna de las dos formas hace única la columna.** Una secuencia normalmente da a cada fila un número nuevo, pero nada impide que dos filas tengan el mismo valor si una de ellas se insertó con un id explícito, o si la secuencia se reinició. La unicidad la dan `PRIMARY KEY` o `UNIQUE`, y por eso los dos ejemplos de arriba llevan `PRIMARY KEY`. [02-relaciones.md](02-relaciones.md) enseña esas reglas.

> **Espera huecos en los números.** Un número tomado de la secuencia queda gastado aunque falle el insert que lo tomó. Después de un insert rechazado, la fila siguiente recibe el número que sigue, y el que falta no vuelve nunca. No uses nunca un `id` para contar filas ni para comprobar que no se ha borrado nada.

**`INT` o `BIGINT`.** Una clave `INT` se detiene en 2.147.483.647: unos 2.100 millones de números entregados a lo largo de toda la vida de la tabla, incluidos los que gastaron los inserts fallidos. `BIGINT` es un número entero de 8 bytes que llega hasta 9.223.372.036.854.775.807. Usa `BIGINT GENERATED ALWAYS AS IDENTITY` para las tablas que pueden crecer sin límite, como logs o eventos. `BIGSERIAL` es el atajo `SERIAL` para una columna `BIGINT`, y lo leerás en esquemas antiguos. El script de datos iniciales de la base de datos de práctica usa `SERIAL` para todas las claves, así que es donde lo leerás en esta ruta.

### Por qué `NUMERIC` es exacto y `FLOAT` no

El aviso **¿Por qué no FLOAT para dinero?**, bajo la tabla del comienzo de la sección [Tipos numéricos](#tipos-numéricos), dice que `FLOAT` es una aproximación. Esta sección muestra la aproximación ocurriendo, explica de dónde viene y enseña qué hace `NUMERIC` en su lugar.

```sql
SELECT 0.1 + 0.2;
```

```sql
SELECT 0.1::float8 + 0.2::float8;
```

La primera devuelve `0.3`. La segunda devuelve `0.30000000000000004`.

Un número escrito con punto decimal, como `0.1`, es un literal `NUMERIC` en PostgreSQL. `NUMERIC` almacena un número como sus dígitos decimales, así que `0.1` se almacena exactamente como una décima y la suma es exactamente `0.3`. `float8` es otro nombre para `double precision`, que es también lo que significa `FLOAT` sin tamaño. Almacena un número en binario, como una fracción cuyo denominador es una potencia de dos. Una décima no se puede escribir así con un número finito de dígitos binarios, por la misma razón por la que un tercio no se puede escribir en decimal con un número finito de dígitos: `0.3333…` no termina nunca. Por eso PostgreSQL almacena la fracción binaria más cercana a `0.1`, y otra más cercana a `0.2`. Su suma se acerca a `0.3` pero no es la fracción binaria más cercana a `0.3`, y PostgreSQL imprime los dígitos necesarios para mostrar esa diferencia.

Es el mismo comportamiento que conoces de JavaScript, y por la misma razón: un número de JavaScript es un valor `double precision`, así que `0.1 + 0.2` en la consola del navegador también imprime `0.30000000000000004`.

El error es minúsculo, y aun así rompe dos cosas:

- **La igualdad.** `SELECT 0.1::float8 + 0.2::float8 = 0.3::float8;` devuelve `false`. Con `NUMERIC`, `SELECT 0.1 + 0.2 = 0.3;` devuelve `true`.
- **Los totales que deben cuadrar al céntimo.** Cada suma puede mover el resultado en una cantidad minúscula, y la suma de miles de importes puede acabar a un céntimo de distancia de la suma de la factura.

**`NUMERIC(p,s)` conserva exactamente `s` decimales.** Los dos números son los que describió el comienzo de la sección [Tipos numéricos](#tipos-numéricos), y tienen nombres que verás en mensajes de error: `p` es la **precisión** (_precision_) y `s` es la **escala** (_scale_). La base de datos de práctica declara `price NUMERIC(8,2)`, así que un precio tiene como máximo 8 dígitos, 2 de ellos después del punto y como máximo 6 antes. Un valor con más decimales que `s` se redondea al almacenarse, y un valor con demasiados dígitos antes del punto se rechaza:

```sql
SELECT 9.995::numeric(8,2);      -- 10.00  redondeado a 2 decimales
SELECT 1234567.5::numeric(8,2);  -- error
```

```
ERROR:  numeric field overflow
DETAIL:  A field with precision 8, scale 2 must round to an absolute value less than 10^6.
```

La línea `DETAIL` lee por ti el tipo declarado: con 8 dígitos en total y 2 tras el punto, el valor debe quedar por debajo de 10^6, un millón, y `1234567.5` tiene siete dígitos antes del punto. La primera sentencia muestra además cómo redondea `NUMERIC` un valor que cae justo en el punto medio: `9.995` está exactamente a medio camino entre `9.99` y `10.00`, y `NUMERIC` lo redondea alejándose de cero, de modo que pasa a ser `10.00`.

> **`NUMERIC` sin `(p,s)` acepta cualquier escala.** Una columna declarada solo como `NUMERIC` almacena cada valor con los decimales con que llegó, así que `9.5` y `9.50` se guardan con escalas distintas. Para dinero, declara la escala, de modo que cada importe de la columna tenga sus dos decimales.

**Cuándo `FLOAT` es la elección correcta.** Un tipo de coma flotante sirve para mediciones en las que un error de representación minúsculo no importa y nadie necesita que el resultado coincida exactamente con una cifra escrita: la temperatura de un sensor, una coordenada GPS, una medida física. Hay dos:

| Tipo | Tamaño | Precisión | Cuándo usarlo |
|---|---|---|---|
| `REAL` (`float4`) | 4 bytes | unos 6 dígitos decimales | rara vez; solo cuando importa el almacenamiento y bastan 6 dígitos |
| `DOUBLE PRECISION` (`float8`, y `FLOAT` sin tamaño) | 8 bytes | al menos 15 dígitos decimales | mediciones y valores científicos |

Todo lo que una persona puede contar en dinero, o comprobar con un documento, va en `NUMERIC`.

### La división entera descarta la fracción

Hay 12 ejemplares de _1984_ en stock, y quieres saber cuántos van en cada una de 5 estanterías:

```sql
SELECT 12 / 5;
```

La respuesta es `2`, no `2.4`. PostgreSQL eligió el tipo del resultado antes de dividir. `12` y `5` son los dos enteros (un número entero escrito sin punto decimal es un literal `integer`), y un operador sobre dos valores de un mismo tipo devuelve ese mismo tipo. Un entero no puede guardar `2.4`, así que la división conserva la parte entera y descarta el resto. "Descartar" significa **truncar hacia cero**, no redondear: `(-12) / 5` devuelve `-2`, no `-3`.

JavaScript tiene un único tipo de número, así que allí `12 / 5` es `2.4`. En SQL, el resultado depende de los tipos de los operandos, y dos enteros dan un entero.

Para conservar los decimales, convierte un operando a `NUMERIC` antes de que se ejecute la división:

```sql
SELECT 12::numeric / 5;   -- 2.4000000000000000
SELECT 12 / 5.0;          -- 2.4000000000000000
```

Cuando los dos operandos tienen tipos numéricos distintos, PostgreSQL usa el que va después en esta lista: `smallint`, `integer`, `bigint`, `numeric`, `real`, `double precision`. Así, un solo operando `NUMERIC` convierte toda la división en una división `NUMERIC`. La segunda línea funciona sin cast porque `5.0`, escrito con punto decimal, ya es un literal `NUMERIC`. La larga cola de ceros es la forma en que la división `NUMERIC` elige su escala, que explica la sección [Cómo decide PostgreSQL la escala de un resultado](#cómo-decide-postgresql-la-escala-de-un-resultado).

El cast tiene que llegar hasta un operando. Un cast sobre el resultado llega demasiado tarde:

```sql
-- MAL: la división entera se ejecuta primero y ya ha descartado el .4
SELECT (12 / 5)::numeric;   -- 2

-- BIEN: la propia división es NUMERIC
SELECT 12::numeric / 5;     -- 2.4000000000000000
```

> **La trampa está en las columnas, no en los literales.** Nadie escribe `12 / 5` a mano esperando `2.4`. Lo que escribes es `stock / shelves` o `quantity / items`, dos columnas `INT`, y el resultado se trunca igual de silenciosamente. Comprueba los tipos de los dos operandos de cada `/`.

---

## Tipos de fecha y hora

Docs: https://www.postgresql.org/docs/current/datatype-datetime.html → lee: "8.5. Date/Time Types" — los apartados "Time Stamps" y "Time Zones"

| Tipo | Cuándo usarlo |
|------|-------------|
| `DATE` | Solo una fecha — año, mes y día (p. ej. cumpleaños, fechas límite) |
| `TIMESTAMP` | Fecha y hora, sin zona horaria — almacena exactamente lo que le das |
| `TIMESTAMPTZ` | Fecha y hora **con zona horaria** — convierte a UTC al escribir y de vuelta al leer |

`TIMESTAMP` almacena `2024-06-15 14:30:00` exactamente como se introduce. Si un usuario en Madrid y otro en Tokio guardan cada uno la hora de su propio reloj en el mismo momento, los dos valores almacenados son distintos, aunque describen un único momento.

`TIMESTAMPTZ` almacena internamente el momento en UTC y lo convierte a la zona horaria de la sesión cuando lo lees. En aplicaciones web donde los usuarios pueden estar en zonas horarias distintas, **usa `TIMESTAMPTZ` para `created_at`, `updated_at` y cualquier timestamp de evento**.

> Esta es una pregunta de entrevista muy habitual sobre PostgreSQL. La mayoría de los desarrolladores usan `TIMESTAMP` por defecto sin pensar en las zonas horarias. Usar `TIMESTAMPTZ` demuestra que has construido aplicaciones web reales.

### El instante que representa cada tipo

La tabla de arriba dice qué almacena cada tipo. Esta sección dice qué momento del tiempo identifica cada uno en realidad, porque solo uno de los tres identifica un único momento. Ese momento se llama **instante** (_instant_): un punto de la línea temporal, el mismo para todo el mundo en la Tierra.

| Tipo | Qué registra un valor | ¿Es un único instante? | Ejemplo |
|---|---|---|---|
| `DATE` | un día del calendario | no: un día entero, que empieza en un instante distinto en cada zona horaria | el día en que se dio de alta un cliente: `2024-01-15` |
| `TIMESTAMP` | la lectura de un reloj de pared: una fecha y una hora del día | no: las 09:00 en Madrid y las 09:00 en Tokio están a ocho horas de distancia en invierno y a siete en verano, y el valor no dice qué reloj se leyó | la hora de apertura de una tienda, la misma hora local esté donde esté la tienda |
| `TIMESTAMPTZ` | un instante de la línea temporal | sí | el momento en que se hizo un pedido |

`TIMESTAMP` es la forma corta de `TIMESTAMP WITHOUT TIME ZONE`, y `TIMESTAMPTZ` de `TIMESTAMP WITH TIME ZONE`. Cada fila de esta tabla responde a la misma pregunta: si dos personas de países distintos leen este valor, ¿se refieren al mismo momento?

`TIMESTAMP` no registra una zona ni siquiera cuando se la das. PostgreSQL ignora en silencio la parte de la zona horaria de la entrada:

```sql
SELECT TIMESTAMP '2025-03-01 08:00:00+02';
```

```
 timestamp
---------------------
 2025-03-01 08:00:00
```

El `+02` ha desaparecido. `+02` es un **offset** (desfase): dice que el reloj que marcaba las 08:00 iba dos horas por delante de UTC. **UTC** (_Coordinated Universal Time_, tiempo universal coordinado) es el reloj de referencia respecto al cual se define cada zona horaria: Madrid es UTC+01 en invierno y Tokio es UTC+09. Un `TIMESTAMP` conserva las 08:00 y descarta la información que lo convertiría en un instante.

`TIMESTAMP '2025-03-01 08:00:00+02'` es una forma más de escribir un cast, que funciona solo sobre un literal: el nombre del tipo y después el texto entre comillas. Significa lo mismo que `'2025-03-01 08:00:00+02'::timestamp`.

### Un mismo valor `TIMESTAMPTZ` leído en dos zonas horarias

Un `TIMESTAMPTZ` funciona en dos pasos:

1. **Al escribir**, PostgreSQL convierte el valor a UTC usando el offset que diste. Si no diste ninguno, usa la zona horaria de tu sesión. Solo se almacena el instante en UTC. La zona que escribiste no se conserva.
2. **Al leer**, PostgreSQL convierte el instante UTC almacenado a la zona horaria de la sesión que lo lee, y lo muestra con el offset de esa zona.

La **sesión** (_session_) es tu conexión: cada Query Tool de pgAdmin tiene la suya. Su zona horaria es un ajuste llamado `TimeZone`. `SHOW timezone;` lo muestra, y `SET TIME ZONE` lo cambia solo para esa sesión. Ejecuta estas cuatro sentencias de una en una, resaltando cada una antes de pulsar F5:

```sql
SET TIME ZONE 'Europe/Madrid';
SELECT TIMESTAMPTZ '2025-03-01 08:00:00+00';   -- 2025-03-01 09:00:00+01

SET TIME ZONE 'Asia/Tokyo';
SELECT TIMESTAMPTZ '2025-03-01 08:00:00+00';   -- 2025-03-01 17:00:00+09
```

Las dos sentencias `SELECT` son idénticas, y devuelven el mismo instante: las 08:00 UTC. Quien lee en Madrid lo ve como las 09:00 en un reloj una hora por delante de UTC, y quien lee en Tokio lo ve como las 17:00 en un reloj nueve horas por delante. Entre las dos lecturas no cambió nada de lo almacenado. Solo cambió la sesión que lee el valor. `RESET timezone;` devuelve el ajuste al valor por defecto del servidor.

Por eso `created_at` pertenece a un `TIMESTAMPTZ`. Los usuarios de una aplicación web, su servidor y su base de datos pueden estar en zonas horarias distintas, y el pedido hecho a las 08:00 UTC tiene que ser el mismo pedido, en el mismo momento, para todos ellos. Un `TIMESTAMP` guardaría la lectura de reloj de pared que el programa que escribe hubiera usado, y ninguna consulta posterior podría saber de qué zona era.

### Convertir un timestamp a date

La sección [Las dos formas de escribir un cast](#las-dos-formas-de-escribir-un-cast) usó `reviewed_at::date` sobre un `TIMESTAMP`, y el cast se limitó a eliminar la hora del día. Sobre un `TIMESTAMPTZ`, el cast da un paso más: primero convierte el instante a la zona horaria de la sesión, y solo después toma la fecha.

```sql
SET TIME ZONE 'Europe/Madrid';
SELECT TIMESTAMPTZ '2025-03-01 23:30:00+00'::date;   -- 2025-03-02

SET TIME ZONE 'UTC';
SELECT TIMESTAMPTZ '2025-03-01 23:30:00+00'::date;   -- 2025-03-01
```

El instante es las 23:30 UTC del 1 de marzo, que en Madrid ya son las 00:30 del 2 de marzo. Así, `created_at::date` en un informe de "pedidos por día" responde en el día de quien ejecuta el informe. Cuando importa el día, fija la zona horaria de la sesión en la que el negocio cuenta sus días antes de hacer el cast. [14-particularidades-de-postgresql.md](14-particularidades-de-postgresql.md) enseña las funciones de fecha que se construyen sobre esto.

---

## Boolean

Docs: https://www.postgresql.org/docs/current/datatype-boolean.html → lee: "8.6. Boolean Type" — las cadenas de entrada aceptadas y el Example 8.2

`BOOLEAN` guarda una respuesta de sí o no: `true` o `false`, más `NULL` cuando no se conoce la respuesta. Úsalo para flags y campos de sí o no.

```sql
is_active BOOLEAN DEFAULT true
has_discount BOOLEAN DEFAULT false
```

> PostgreSQL acepta varias formas de escribir booleanos en las consultas: `true`, `'t'`, `'yes'`, `'on'`, `'1'` — y sus equivalentes para falso. En la práctica, usa siempre `true` y `false` para que se lea bien.

### Tres estados y los literales que debes escribir

Una columna `BOOLEAN` guarda uno de tres estados, no dos: `true`, `false` o `NULL`, el estado "desconocido", cuando la columna lo permite. Esa es la garantía que da el tipo: no se puede almacenar nada más. No hay un `2`, ni un `'maybe'`, ni un texto vacío. Si un flag tiene que ser siempre conocido, la columna necesita además `NOT NULL`, que enseña [02-relaciones.md](02-relaciones.md). Sin él, el tercer estado está permitido, y [04-where.md](04-where.md) muestra cómo un flag `NULL` descarta filas de un filtro sin avisar.

Las cadenas entre comillas del aviso de arriba son todas texto que PostgreSQL lee como un booleano, y por eso `'1'` y `'yes'` funcionan. Un `1` sin comillas es distinto: es un entero, y PostgreSQL no convierte un entero a booleano automáticamente. En una tabla con una columna `BOOLEAN` llamada `active`, insertar `1` en ella falla:

```
ERROR:  column "active" is of type boolean but expression is of type integer
```

Lo mismo ocurre en una condición. `SELECT 1 = TRUE;` falla con `operator does not exist: integer = boolean`. En JavaScript `true == 1` es `true`, y ese hábito no se traslada. En PostgreSQL escribe las palabras clave de SQL `TRUE` y `FALSE`, que la documentación de PostgreSQL nombra como la forma preferida, la del estándar SQL.

Una columna booleana ya es una condición, así que no necesita ninguna comparación. En una tabla `users` con una columna `BOOLEAN` `active`, estas dos sentencias devuelven las mismas filas, y la segunda forma es la habitual:

```sql
SELECT name FROM users WHERE active = TRUE;
SELECT name FROM users WHERE active;
```

> **Un booleano enviado a un cliente como texto llega como `t` o `f`.** Ese es el formato de salida de PostgreSQL para el tipo, y es la forma que ves en `psql`, el cliente de línea de comandos de PostgreSQL, que imprime todos los valores como texto plano. Es el mismo valor que `true` y `false`, escrito en corto. Un cast que escribes tú da la palabra completa: `SELECT TRUE::text;` devuelve `true`.

---

## `JSONB` — un documento JSON en una columna

Docs: https://www.postgresql.org/docs/current/datatype-json.html → lee: "8.14. JSON Types" — la diferencia entre `json` y `jsonb`, y "Designing JSON Documents"

A veces los datos que recibes ya son un documento JSON: el cuerpo de un webhook de un proveedor de pagos (un webhook es una petición HTTP que otro servicio envía a tu aplicación cuando ocurre algo por su parte, como la confirmación de un pago), los ajustes que un usuario guardó en la aplicación Angular, los atributos de un producto que cambian de un producto a otro. Dividir cada uno de ellos en columnas significa añadir una columna cada vez que aparece una clave nueva. `JSONB` almacena en cambio el documento entero en una sola columna.

```sql
SELECT '{"format": "ebook", "pages": 328}'::jsonb;
```

```
 jsonb
-----------------------------------
 {"pages": 328, "format": "ebook"}
```

En ese cast pasaron tres cosas:

1. **PostgreSQL comprobó que el texto es JSON válido.** `SELECT '{"format": ebook}'::jsonb;` falla con `ERROR:  invalid input syntax for type json`, seguido de `DETAIL:  Token "ebook" is invalid.`, porque una cadena JSON necesita comillas dobles. Una columna `TEXT` habría almacenado el documento roto sin quejarse.
2. **Almacenó el documento en una forma binaria, no como el texto que escribiste.** PostgreSQL analiza el JSON una sola vez, cuando se escribe, y conserva la estructura ya analizada. Eso hace que escribir sea algo más lento y que leer un campo sea mucho más rápido, porque no hay que volver a analizar nada. También significa que la forma binaria se puede indexar. [13-indices.md](13-indices.md) enseña qué es un índice.
3. **No conservó los detalles de tu texto.** Las claves volvieron en otro orden, porque `jsonb` no conserva el orden de las claves, ni los espacios en blanco sobrantes. Si una clave aparece dos veces en la entrada, solo se conserva el último valor.

PostgreSQL tiene también un tipo `json`, que conserva una copia exacta del texto y lo vuelve a analizar en cada uso. La documentación de PostgreSQL recomienda `jsonb` para la mayoría de las aplicaciones. Cuando leas "una columna JSON" en un esquema de PostgreSQL, espera `jsonb`.

### Leer un campo de un valor `JSONB`

Dos operadores leen una clave de un objeto JSON. `->` devuelve el valor como `jsonb`, y `->>` lo devuelve como texto:

```sql
SELECT '{"format": "ebook", "pages": 328}'::jsonb ->> 'format';   -- ebook
SELECT '{"format": "ebook", "pages": 328}'::jsonb ->> 'pages';    -- 328, como texto
```

El segundo resultado parece un número, pero es texto, así que la aritmética sobre él necesita un cast. Los paréntesis hacen que el cast se aplique al valor extraído y no a `'pages'`, por la razón que dio la sección [Un cast se aplica solo a lo que tiene justo delante](#un-cast-se-aplica-solo-a-lo-que-tiene-justo-delante):

```sql
SELECT ('{"format": "ebook", "pages": 328}'::jsonb ->> 'pages')::int + 1;   -- 329
```

Ese cast es el coste visible de `JSONB`: la base de datos almacena el documento, pero el tipo de cada valor que contiene no se declara nunca, así que cada consulta tiene que decir qué espera.

### Cuándo un documento gana a las columnas tipadas, y qué sacrifica

Usa ese cast como criterio para decidir. Un campo que vas a filtrar, unir, sumar o validar en cada fila debe ser una columna propia con su propio tipo. Una parte de los datos cuya forma varía, o que almacenas y devuelves sobre todo como un todo, puede ser un valor `JSONB`.

| Guárdalo como columnas tipadas cuando… | Guárdalo como `JSONB` cuando… |
|---|---|
| todas las filas tienen el campo y su significado es estable (`price`, `email`, `order_date`) | las claves cambian de una fila a otra (atributos de un ebook frente a los de un libro de tapa dura) |
| la base de datos debe hacer cumplir una regla sobre él: `NOT NULL`, un `CHECK`, una clave foránea | la aplicación lee y escribe el documento como una sola unidad (preferencias de usuario guardadas) |
| otras tablas se unen a él | tienes que conservar un documento recibido exactamente como llegó, por ejemplo para auditar un webhook |

Lo que `JSONB` sacrifica es todo lo que este capítulo dice que garantiza un tipo. Una columna tipada `price NUMERIC(8,2)` garantiza que todas las filas tienen un número con dos decimales. Una clave `"price"` dentro de un documento no garantiza nada: una fila puede tener `9.99`, otra `"9.99"` como cadena y otra ninguna clave. Las reglas que enseña [02-relaciones.md](02-relaciones.md) se declaran sobre columnas, no sobre claves dentro de un documento: una clave foránea no puede partir de una clave de él, y un `CHECK` sobre una de ellas tiene que extraerla y convertirla primero, el mismo trabajo que la consulta de arriba. Unir otra tabla a través de un valor enterrado en el documento significa también extraerlo y convertirlo en cada consulta. Así, un campo estable que se mueve a una columna `JSONB` cambia las comprobaciones de la base de datos por algo de flexibilidad, lo que rara vez es un buen intercambio. Reserva `JSONB` para la parte de los datos que de verdad no tiene una forma fija.

---

## Redondeo y escala del resultado

Docs: https://www.postgresql.org/docs/current/functions-math.html → lee: "9.3. Mathematical Functions and Operators" — la Table 9.4 (los operadores y cómo se resuelven los tipos mixtos) y las filas `round` y `scale` de la Table 9.5

Todas las secciones hasta aquí han tratado de un valor cada vez. Un informe rara vez muestra un valor almacenado: muestra un valor calculado a partir de varios, como un precio por una cantidad, un promedio, un total. Esta sección trata de qué sigue siendo exacto en ese cálculo y de dónde corresponde el redondeo.

### `ROUND(value, n)` solo acepta `NUMERIC`

`ROUND(value, n)` redondea un valor a `n` decimales, y un valor que cae justo en el punto medio se redondea alejándose de cero:

```sql
SELECT ROUND(2.345, 2);   -- 2.35
```

También existe un `ROUND(value)` de un argumento, que redondea a un número entero y existe tanto para `NUMERIC` como para `double precision`. La forma de dos argumentos existe **solo para `NUMERIC`**. Por eso redondear a dos decimales un valor `double precision` falla:

```sql
SELECT ROUND(10::float8 / 3, 2);
```

```
ERROR:  function round(double precision, integer) does not exist
```

El mensaje enumera los tipos de los argumentos que recibió. PostgreSQL buscó un `round` cuyo primer argumento fuera `double precision` y el segundo `integer`, y no encontró ninguno. No convierte el primer argumento a `NUMERIC` por sí mismo, porque esa conversión no es de las que aplica automáticamente al argumento de una función. Una línea `HINT` bajo el error sugiere añadir un cast explícito.

El cast va **sobre el argumento**, dentro de los paréntesis, para que la función reciba un `NUMERIC`:

```sql
-- MAL: round() sigue recibiendo un valor double precision; el cast solo se aplicaría a su resultado
SELECT ROUND(10::float8 / 3, 2)::numeric;

-- BIEN: el resultado de la división se convierte primero, y round() recibe un NUMERIC
SELECT ROUND((10::float8 / 3)::numeric, 2);   -- 3.33
```

Los paréntesis interiores también importan. Sin ellos, `10::float8 / 3::numeric` convertiría solo el `3`, y una división entre un `double precision` y un `NUMERIC` se resuelve como `double precision`, el tipo posterior de la lista de la sección [La división entera descarta la fracción](#la-división-entera-descarta-la-fracción).

¿De dónde sale un valor `double precision` en un informe, si guardas el dinero como `NUMERIC`? Sobre todo de promedios de mediciones. `AVG` de una columna `REAL` o `DOUBLE PRECISION` devuelve `double precision`, así que `ROUND(AVG(temperature), 1)` falla y `ROUND(AVG(temperature)::numeric, 1)` funciona. `AVG` de una columna `INT` o `NUMERIC` ya devuelve `NUMERIC` y no necesita cast. [07-agregados.md](07-agregados.md) enseña `AVG`. Hasta entonces, lee `AVG(column)` como "el promedio de los valores de la columna".

### Cómo decide PostgreSQL la escala de un resultado

La **escala** (_scale_) de un valor `NUMERIC` es su número de dígitos después del punto decimal. `scale()` la devuelve: `SELECT scale(8.4100);` responde `4`. Cada operador `NUMERIC` calcula la escala de su resultado a partir de las escalas de sus operandos, con una regla fija por operador:

| Expresión | Escala del resultado | Ejemplo | Resultado |
|---|---|---|---|
| `a + b`, `a - b` | la mayor de las dos escalas | `2.50 + 1.5` | `4.00` |
| `a * b` | las dos escalas sumadas | `9.99 * 0.85` | `8.4915` |
| `a / b` | los decimales suficientes para al menos 16 dígitos significativos, y nunca menos de los que tenga cualquiera de los operandos | `12::numeric / 5` | `2.4000000000000000` |
| un entero usado como `NUMERIC` | 0 | `0` | `0` |
| `ROUND(a, n)` | `n` | `ROUND(8.4915, 2)` | `8.49` |

Lee cada fila así: un operador de esta clase, aplicado a operandos con estas escalas, da un resultado con esta escala. La suma y la multiplicación conservan todos los dígitos que tiene la respuesta exacta, y por eso la aritmética `NUMERIC` es exacta. La división normalmente no tiene una respuesta exacta finita, así que PostgreSQL se detiene en un número fijo de dígitos significativos, que son los dígitos contados desde el primero que no es cero. Esa es la larga cola de ceros de la sección [La división entera descarta la fracción](#la-división-entera-descarta-la-fracción).

La regla se aplica en cada operador, y cada resultado pasa a ser un operando del siguiente. Así, la escala viaja hacia fuera a través de una expresión. Toma una línea de pedido de la base de datos de práctica, la del pedido 9 con tres ejemplares de _1984_ a `9.99`, y aplícale tú mismo un descuento del 15 %, lo que significa pagar 0.85 del precio:

```sql
SELECT 9.99 * 3 * 0.85;          -- 25.4745
SELECT scale(9.99 * 3 * 0.85);   -- 4
```

```
9.99 * 3 * 0.85

paso 1:  9.99   *  3      →  29.97        escala 2 + 0 = 2
paso 2:  29.97  *  0.85   →  25.4745      escala 2 + 2 = 4
```

Ninguna columna de la base de datos tiene escala 4, y el resultado aun así la tiene, porque la escala del resultado salió de los operandos, no de ninguna columna.

### Redondea la expresión entera, nunca un operando

El resultado de arriba hay que mostrarlo como una cantidad de dinero, con dos decimales. La solución tentadora redondea el precio:

```sql
-- MAL: el precio ya tenía 2 decimales; las multiplicaciones posteriores vuelven a dar escala 4
SELECT ROUND(9.99, 2) * 3 * 0.85;   -- 25.4745

-- BIEN: redondea el valor terminado, de modo que la última operación aplicada sea el redondeo
SELECT ROUND(9.99 * 3 * 0.85, 2);   -- 25.47
```

`ROUND` fija la escala de su propio resultado y nada más. En la primera sentencia, su resultado `9.99` sigue siendo un operando de dos multiplicaciones, y el paso 2 del desglose de arriba vuelve a sumar las escalas. Solo cuando `ROUND` es la operación más externa, su escala es la escala de lo que devuelve la consulta.

Así que la regla para cualquier importe calculado es: **escribe primero el cálculo entero y envuélvelo todo en un solo `ROUND`**. Redondear en mitad del cálculo cambia además el valor, no solo su aspecto: un precio redondeado antes de multiplicarlo arrastra el error de redondeo a cada ejemplar.

### La misma regla de la escala dentro de un total de informe

Este capítulo muestra la regla de la escala con aritmética simple porque la regla pertenece a los propios valores `NUMERIC`. Toda expresión que produce un `NUMERIC` la cumple, con tabla o sin ella. La misma regla reaparece, sin cambios, cuando la expresión es un total de informe. Dos funciones que todavía no has estudiado lo hacen visible.

`COALESCE(value, fallback)` devuelve su primer argumento cuando ese argumento no es `NULL`, y su segundo argumento en caso contrario. [04-where.md](04-where.md) la enseña. Las dos respuestas posibles conservan su propia escala:

```sql
SELECT COALESCE(9.99, 0);                       -- 9.99   el primer argumento, escala 2
SELECT COALESCE(NULL::numeric, 0);              -- 0      el valor de respaldo, escala 0
SELECT ROUND(COALESCE(NULL::numeric, 0), 2);    -- 0.00   ROUND da escala 2 en cualquier caso
```

La segunda línea devuelve `0`, no `0.00`. El valor de respaldo es el literal entero `0`, y un entero pasa a ser un `NUMERIC` con escala 0. La escala de la respuesta depende de qué argumento ganó.

`SUM(column)` suma una columna sobre muchas filas. [07-agregados.md](07-agregados.md) la enseña, y también por qué `SUM` sobre cero filas devuelve `NULL` en lugar de `0`. Por eso un total de informe suele escribirse `COALESCE(SUM(x), 0)`: una suma de precios `NUMERIC(8,2)` devuelve escala 2 cuando hay filas, y el valor de respaldo devuelve un `0` a secas cuando no las hay. La solución es la de la sección anterior: un solo `ROUND` alrededor de la expresión entera. Aquí es donde la regla de la escala vuelve a aparecer en la ruta: los totales que escribas en [07-agregados.md](07-agregados.md) son expresiones de esta clase, y su escala se decide exactamente como en el desglose de la sección [Cómo decide PostgreSQL la escala de un resultado](#cómo-decide-postgresql-la-escala-de-un-resultado).

> **Preview — Spring Boot:** el fragmento de abajo es JPQL del proyecto 07, el lenguaje de consultas que Hibernate traduce a SQL, y que la introducción a esta ruta mostró en la sección "Dónde encaja SQL entre Angular, Spring Boot y PostgreSQL" de [00-sql-y-bases-de-datos-relacionales.md](00-sql-y-bases-de-datos-relacionales.md). El propio JPQL lo estudiarás en las notas de Spring Boot. Léelo aquí solo para ver dónde está su `round`.

En el proyecto 07, `TimeEntryRepository.java` construye el resumen de un periodo con esta expresión, recortada a la parte que importa aquí:

```java
round(COALESCE(SUM(CASE WHEN ... THEN te.hours END), 0), 2) AS approvedHours,
```

`hours` se declara en `TimeEntry`, la clase Java que Hibernate mapea a la tabla de entradas de tiempo, con precisión 4 y escala 2. El `round(..., 2)` envuelve el `COALESCE` entero, así que un periodo con horas aprobadas responde con dos decimales, y un periodo sin ninguna responde `0.00` en lugar del `0` de escala 0 que daría el valor de respaldo por sí solo.

---

## Qué tipo elegir — referencia rápida

Docs: https://www.postgresql.org/docs/current/datatype.html → lee: la Table 8.1 "Data Types" — todos los nombres de tipo y sus alias en una sola tabla

| Qué almacenas | Usa |
|-----------------|-----|
| ID autogenerado | `INT GENERATED ALWAYS AS IDENTITY` |
| Nombre, título, email | `VARCHAR(n)` |
| Descripción larga | `TEXT` |
| Número entero | `INT` |
| Dinero / precio | `NUMERIC(10,2)` |
| Medición, valor científico | `DOUBLE PRECISION` |
| Flag verdadero/falso | `BOOLEAN` |
| Solo fecha | `DATE` |
| Fecha + hora (aplicación web) | `TIMESTAMPTZ` |
| Fecha + hora (local, sin zona horaria) | `TIMESTAMP` |

## Qué desbloquea este capítulo

Ya puedes elegir un tipo para cualquier columna de un esquema junior y decir qué garantiza: `VARCHAR(n)` o `TEXT` según si el dato tiene un máximo, una columna identity para las claves generadas, `NUMERIC(p,s)` para todo lo que se cuenta en dinero, `TIMESTAMPTZ` para cualquier instante que comparten los usuarios, `BOOLEAN` para los flags y `JSONB` solo para la parte de los datos sin una forma fija. Puedes convertir un valor con `::` o `CAST`, y puedes predecir el tipo y la escala de un valor calculado: una división entera que descarta su fracción, un `ROUND` que necesita un `NUMERIC`, un total cuya escala depende de sus operandos.

Un valor solo todavía no son datos. Necesita una tabla donde vivir, una clave que identifique su fila y reglas que digan qué valores rechaza la tabla. Con el vocabulario de los valores ya asentado, [02-relaciones.md](02-relaciones.md) declara las tablas que guardan estos valores, y las claves, las restricciones y las reglas de cardinalidad que los mantienen coherentes.
