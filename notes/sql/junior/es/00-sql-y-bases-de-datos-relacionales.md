## Índice de esta nota

- [SQL y bases de datos relacionales](#sql-y-bases-de-datos-relacionales)

1. [Qué resuelve una base de datos relacional que los objetos en memoria no pueden](#qué-resuelve-una-base-de-datos-relacional-que-los-objetos-en-memoria-no-pueden)
   - [Tres cosas que un array en un solo proceso no puede hacer](#tres-cosas-que-un-array-en-un-solo-proceso-no-puede-hacer)
   - [Un servidor de base de datos es un programa aparte que tiene los datos a su cargo](#un-servidor-de-base-de-datos-es-un-programa-aparte-que-tiene-los-datos-a-su-cargo)
2. [SQL, PostgreSQL, base de datos, esquema, tabla, fila y columna](#sql-postgresql-base-de-datos-esquema-tabla-fila-y-columna)
   - [SQL es el lenguaje y PostgreSQL es el programa](#sql-es-el-lenguaje-y-postgresql-es-el-programa)
   - [Base de datos, esquema y tabla, de fuera hacia dentro](#base-de-datos-esquema-y-tabla-de-fuera-hacia-dentro)
   - [Tabla, fila y columna](#tabla-fila-y-columna)
   - [Qué significa relacional](#qué-significa-relacional)
   - [Los dos significados de esquema](#los-dos-significados-de-esquema)
3. [Ejecutar sentencias en pgAdmin](#ejecutar-sentencias-en-pgadmin)
   - [pgAdmin es el cliente y el servidor PostgreSQL local guarda las bases de datos](#pgadmin-es-el-cliente-y-el-servidor-postgresql-local-guarda-las-bases-de-datos)
   - [Crear la base de datos de práctica `practice_junior_notes`](#crear-la-base-de-datos-de-práctica-practice_junior_notes)
   - [Cargar con datos iniciales la base de datos de práctica (seeding)](#cargar-con-datos-iniciales-la-base-de-datos-de-práctica-seeding)
   - [Evaluar una expresión con `SELECT`](#evaluar-una-expresión-con-select)
   - [Cómo se ve una sentencia rechazada](#cómo-se-ve-una-sentencia-rechazada)
   - [Leer la definición de una columna dentro de `CREATE TABLE`](#leer-la-definición-de-una-columna-dentro-de-create-table)
4. [Declarativo significa que describes el resultado y PostgreSQL planifica el trabajo](#declarativo-significa-que-describes-el-resultado-y-postgresql-planifica-el-trabajo)
   - [La misma pregunta en JavaScript y en SQL](#la-misma-pregunta-en-javascript-y-en-sql)
   - [Cómo convierte PostgreSQL la sentencia en un plan de ejecución](#cómo-convierte-postgresql-la-sentencia-en-un-plan-de-ejecución)
   - [Qué cambia el planner en cómo escribes SQL](#qué-cambia-el-planner-en-cómo-escribes-sql)
5. [Un resultado es un conjunto de filas sin orden](#un-resultado-es-un-conjunto-de-filas-sin-orden)
6. [NULL marca un valor ausente](#null-marca-un-valor-ausente)
7. [La base de datos hace cumplir las reglas que declaras](#la-base-de-datos-hace-cumplir-las-reglas-que-declaras)
8. [Dónde encaja SQL entre Angular, Spring Boot y PostgreSQL](#dónde-encaja-sql-entre-angular-spring-boot-y-postgresql)
9. [La ruta del capítulo 01 al capítulo 16](#la-ruta-del-capítulo-01-al-capítulo-16)

# SQL y bases de datos relacionales

Docs: https://www.postgresql.org/docs/current/tutorial.html → lee: "Part I. Tutorial", capítulos 1 y 2 — el recorrido oficial desde un servidor vacío hasta la primera consulta

Todas las aplicaciones que has construido guardan sus datos en algún sitio. En el proyecto 03, ese sitio era un array de transacciones dentro de un servicio de Angular, copiado como JSON en el `localStorage` del navegador. Eso basta mientras una sola persona usa un solo navegador. Deja de bastar cuando los datos tienen que sobrevivir a un reinicio, compartirse entre muchos usuarios a la vez y seguir siendo correctos sea cual sea el programa que los escribe. Un servidor de base de datos relacional es el programa construido para esos tres requisitos, y SQL es el lenguaje con el que le hablas.

Esta introducción no enseña la sintaxis de SQL en profundidad. Te da la visión de conjunto que rellenan los dieciséis capítulos siguientes, y te deja en condiciones de ejecutar una sentencia antes de que el capítulo 01 te lo pida.

La nota tiene nueve secciones, y cada una necesita la anterior. Empieza por el problema: qué no puede hacer un array de objetos dentro de un programa, y qué tipo de programa lo resuelve. A continuación viene el vocabulario (SQL, PostgreSQL, base de datos, esquema, tabla, fila, columna), porque todas las frases posteriores usan esas siete palabras. Con las palabras ya claras, la tercera sección te hace crear la base de datos de práctica y ejecutar tus primeras sentencias en pgAdmin, de modo que todo lo que sigue sea algo que puedes ejecutar y no solo leer. Después llega la idea sobre la que se apoya todo el tema: SQL es declarativo, es decir, tú describes el resultado y PostgreSQL decide los pasos. Las tres secciones siguientes tratan un rasgo cada una: un resultado no tiene orden, NULL marca un valor ausente y la base de datos hace cumplir las reglas que declaras. Cada uno de esos tres rasgos se explica con el vocabulario y el modelo que lo preceden, y cada uno reaparece en todos los capítulos posteriores. Luego la nota sitúa SQL en tu stack, entre Angular, Spring Boot y PostgreSQL. Y cierra con la ruta: qué añade cada capítulo del 01 al 16 y por qué van en ese orden.

## Qué resuelve una base de datos relacional que los objetos en memoria no pueden

Docs: https://www.postgresql.org/docs/current/tutorial-arch.html → lee: "Architectural Fundamentals" — el proceso servidor, las aplicaciones cliente y las conexiones entre ellos

Piensa en una librería pequeña. En JavaScript modelarías su catálogo como un array de objetos:

```js
const books = [
  { title: '1984', price: 9.99, stock: 12 },
  { title: 'Animal Farm', price: 7.5, stock: 0 },
  { title: 'Emma', price: 9.99, stock: 4 },
];
```

Este array vive en la memoria de un programa en ejecución. Un programa en ejecución se llama **proceso**, y la memoria que usa le pertenece solo a él. Ese único hecho provoca tres problemas.

### Tres cosas que un array en un solo proceso no puede hacer

**Los datos desaparecen cuando el proceso termina.** Cuando el servidor de Node se reinicia, o se cierra la pestaña del navegador, el array se pierde, y con él cada venta registrada desde que arrancó el programa. Conservar los datos después de que el programa que los creó haya terminado se llama **persistencia**, y un array no tiene ninguna.

**Varios programas no pueden compartirlo con seguridad.** Un segundo proceso tiene su propia memoria y, por tanto, su propia copia del array. Ese segundo proceso puede ser otra copia en ejecución del mismo servidor, un script de informes o la aplicación en el equipo de un compañero. Una venta registrada en una copia es invisible en la otra. Poner los datos en un lugar al que ambos puedan llegar, como un archivo, elimina ese problema y crea otro peor. Imagina que a la tienda solo le queda un ejemplar de _Emma_ y dos clientes lo compran en el mismo segundo:

1. La petición A lee el stock: `1`.
2. La petición B lee el stock: `1`.
3. La petición A escribe el stock como `0` y confirma la venta.
4. La petición B escribe el stock como `0` y confirma la venta.

Se confirmaron dos ventas y existía un solo libro. Ninguna de las dos peticiones hizo nada mal por sí sola. El error viene de que los pasos 1 y 2 ocurren antes del paso 3: las dos peticiones decidieron con un número que estaba a punto de cambiar.

**Nada comprueba lo que entra.** `books.push({ title: null, price: -5 })` se ejecuta sin quejas. Un tipo de TypeScript rechazaría esa línea en tu propio código, pero los tipos se borran cuando TypeScript se compila a JavaScript. En tiempo de ejecución, nada comprueba los datos que llegan en una petición ni los que escribe otro programa.

> **¿Por qué no guardar el array en un archivo JSON?** Un archivo te da persistencia y nada más. Dos procesos que escriben en el mismo archivo se pisan los cambios, exactamente como en los cuatro pasos de arriba. Para encontrar un libro, el programa tiene que leer y analizar el archivo entero. Y el archivo sigue aceptando cualquier contenido. Acabarías escribiendo a mano el programa que describe la sección siguiente.

### Un servidor de base de datos es un programa aparte que tiene los datos a su cargo

Un **servidor de base de datos** es un programa que se ejecuta por su cuenta, separado de tu aplicación, y hace cuatro trabajos:

1. Guarda los datos en archivos en disco, de modo que sobreviven a cualquier reinicio, incluido el suyo.
2. Acepta **conexiones** de muchos programas a la vez. Una conexión es un canal abierto por el que un programa envía peticiones y recibe respuestas. Cada programa que se conecta se llama **cliente**.
3. Coordina a los clientes que cambian los mismos datos a la vez. Dos cambios sobre el mismo dato nunca se aplican en el mismo instante: el segundo espera a que termine el primero, y entonces encuentra el dato tal como lo dejó el primer cambio. En el ejemplo del último ejemplar, la segunda petición encuentra un stock de `0`, así que su venta puede rechazarse.
4. Comprueba cada cambio contra reglas declaradas de antemano, y rechaza los cambios que las incumplen.

```
pgAdmin ──────────────────────┐
tu aplicación Spring Boot ────┼──►  servidor PostgreSQL ──►  archivos en disco
un script de informes ────────┘     (el único programa que
                                     lee y escribe esos archivos)
```

"Servidor" nombra el papel del programa, no una máquina. El servidor PostgreSQL que vas a usar se ejecuta en tu propio ordenador, junto a sus clientes. En una empresa se ejecuta en otra máquina y los clientes llegan a él por la red. Nada más cambia.

Ningún cliente abre nunca los archivos de datos. Cada cliente envía una petición escrita en SQL, y el servidor la responde. Por eso se pueden garantizar los cuatro trabajos: toda lectura y toda escritura pasan por un solo programa.

Los trabajos 1 y 2 no te piden nada. El trabajo 3 es el tema de [09-transacciones.md](09-transacciones.md), que enseña cómo se agrupan varios cambios para que triunfen o fallen juntos, y cómo evita el servidor que los clientes simultáneos interfieran entre sí. El trabajo 4 es uno de los tres rasgos que trata esta nota, en la sección [La base de datos hace cumplir las reglas que declaras](#la-base-de-datos-hace-cumplir-las-reglas-que-declaras).

Queda por definir una palabra del título: **relacional**. Describe cómo organiza sus datos este tipo de servidor, y la sección siguiente la define junto con el resto del vocabulario.

## SQL, PostgreSQL, base de datos, esquema, tabla, fila y columna

Docs: https://www.postgresql.org/docs/current/tutorial-concepts.html → lee: "Concepts" — tres párrafos que definen relación, tabla, fila, columna y base de datos

Estas siete palabras se confunden con facilidad. La gente dice "la base de datos" cuando se refiere al programa PostgreSQL, y usa "el esquema" para dos cosas distintas. Esta sección fija un único significado para cada palabra.

### SQL es el lenguaje y PostgreSQL es el programa

**SQL** (_Structured Query Language_, «lenguaje de consulta estructurado») es un lenguaje: un conjunto de palabras y reglas gramaticales para escribir peticiones a un servidor de base de datos. Una petición completa se llama **sentencia**, por ejemplo `SELECT title FROM books;`. Una sentencia que pide datos se llama también **consulta** (_query_).

**PostgreSQL** es un programa: un servidor de base de datos concreto que entiende SQL. Es el que tienes instalado en tu máquina y el que usa el proyecto 07. Oracle, MySQL y SQL Server son otros servidores del mismo tipo. El nombre general de este tipo de programa es _relational database management system_ («sistema gestor de bases de datos relacional»), abreviado **RDBMS**, y verás esa abreviatura en las ofertas de trabajo.

Así que tú escribes SQL y PostgreSQL lo ejecuta. Decir "sé PostgreSQL" y decir "sé SQL" son afirmaciones distintas: la primera habla de un producto concreto, la segunda del lenguaje que comparten todos esos productos.

> **¿Es el SQL igual en todos esos servidores?** El núcleo sí. SQL está definido por un estándar internacional, y una sentencia como `SELECT title FROM books;` se ejecuta sin cambios en cualquiera de ellos. Cada servidor añade además sintaxis propia, y ese conjunto de añadidos se llama su **dialecto**. [14-particularidades-de-postgresql.md](14-particularidades-de-postgresql.md) enseña a distinguir el SQL estándar de las extensiones propias de PostgreSQL, y trata las funciones de fecha de PostgreSQL.

### Base de datos, esquema y tabla, de fuera hacia dentro

Un servidor PostgreSQL contiene varias **bases de datos**. Una base de datos es un contenedor de datos con nombre y aislado. Una conexión se hace con exactamente una base de datos, y una sentencia enviada por esa conexión solo ve lo que hay dentro de esa base de datos. Tu servidor ya contiene al menos dos: `postgres`, que crea la instalación, y `timetrack`, la base de datos del proyecto 07. Esta nota añade una más, para practicar.

Dentro de una base de datos, las tablas se agrupan en **esquemas** (_schemas_). Un esquema es un grupo de tablas con nombre dentro de una base de datos, igual que una carpeta es un grupo de archivos con nombre. Toda base de datos nueva contiene un esquema llamado `public`, y una tabla creada sin nombrar ningún esquema va a parar a él. Por eso `books` y `public.books` nombran la misma tabla en la base de datos de práctica.

Una **tabla** guarda los datos sobre una clase de cosa: una tabla para los libros, otra para los autores.

```
servidor PostgreSQL                          el programa que corre en tu máquina
└── base de datos  practice_junior_notes     una de las bases de datos del servidor
    └── esquema  public                      el grupo de tablas por defecto
        ├── tabla  authors
        ├── tabla  books
        └── tabla  ...                       ocho tablas en total
```

pgAdmin dibuja esta misma jerarquía en su panel izquierdo: **Servers → tu servidor → Databases → practice_junior_notes → Schemas → public → Tables**. Recorrerás ese camino tú mismo en la sección [Ejecutar sentencias en pgAdmin](#ejecutar-sentencias-en-pgadmin).

### Tabla, fila y columna

Una tabla tiene una lista definida de **columnas**. Cada columna tiene un nombre y un **tipo de dato**, que indica qué clase de valor acepta la columna: texto, un número entero, una fecha. Los datos en sí se guardan como **filas**. Hay una fila por elemento, y cada fila tiene un valor para cada columna.

```
tabla books (cinco de sus nueve columnas)

┌────┬─────────────────────┬───────┬───────┬───────────┐
│ id │ title               │ price │ stock │ author_id │  ◄── columnas: las mismas en todas las filas
├────┼─────────────────────┼───────┼───────┼───────────┤
│  1 │ 1984                │  9.99 │    12 │         1 │  ◄── una fila = un libro
│  2 │ Animal Farm         │  7.50 │     0 │         1 │
│  3 │ Pride and Prejudice │  8.99 │    20 │         2 │
└────┴─────────────────────┴───────┴───────┴───────────┘
```

Si vienes de JavaScript, una fila se parece a un objeto y una columna se parece a una propiedad. Importan dos diferencias. Todas las filas de una tabla tienen exactamente las mismas columnas, mientras que dos objetos del mismo array pueden tener propiedades distintas. Y una columna solo acepta valores de su tipo: PostgreSQL se niega a guardar el texto `'cheap'` en la columna `price`, mientras que una propiedad de JavaScript acepta cualquier cosa.

### Qué significa relacional

En un objeto de JavaScript meterías el autor dentro del libro:

```js
const book = {
  title: '1984',
  author: { name: 'George Orwell', country: 'UK' },
};
```

Una base de datos relacional no anida. Guarda los libros en una tabla y los autores en otra, y las conecta mediante un valor que tienen en común las dos tablas:

```
tabla authors (tres de sus cuatro columnas)
┌────┬───────────────┬─────────┐
│ id │ name          │ country │
├────┼───────────────┼─────────┤
│  1 │ George Orwell │ UK      │
│  2 │ Jane Austen   │ UK      │
└────┴───────────────┴─────────┘
   ▲
   │  el author_id de un libro guarda el id de su autor
   │
tabla books (tres de sus nueve columnas)
┌────┬─────────────────────┬───────────┐
│ id │ title               │ author_id │
├────┼─────────────────────┼───────────┤
│  1 │ 1984                │         1 │
│  2 │ Animal Farm         │         1 │
│  3 │ Pride and Prejudice │         2 │
└────┴─────────────────────┴───────────┘
```

La fila de _1984_ no contiene a su autor. Contiene el número `1` en su columna `author_id`, y el autor cuyo `id` es `1` es George Orwell. Nada más une las dos filas. No hay un objeto dentro de otro objeto, solo dos valores iguales.

La ventaja es que George Orwell se guarda una sola vez. Sus dos libros guardan `1`, así que corregir su país significa cambiar una fila. En la versión anidada el autor se copia en cada libro, y una corrección que se deja una copia sin tocar produce dos libros que discrepan sobre la misma persona.

> **"Relacional" no viene de "relación" en el sentido de vínculo.** **Relación** (_relation_) es el nombre matemático de una tabla, así que una base de datos relacional es una base de datos que guarda sus datos en tablas. Conectar tablas mediante valores compartidos es una consecuencia de ese diseño, no el origen de la palabra. PostgreSQL usa la palabra en sus propios mensajes: `relation "book" does not exist` significa que no encontró ninguna tabla llamada `book`.

[02-relaciones.md](02-relaciones.md) enseña cómo se declaran esos valores compartidos como claves. [06-joins.md](06-joins.md) enseña cómo una consulta lee dos tablas a través de ellos.

### Los dos significados de esquema

La palabra **esquema** (_schema_) se usa para dos cosas distintas, y te vas a encontrar con las dos.

- **Un esquema como espacio de nombres** (_namespace_) es el objeto de PostgreSQL descrito arriba: el grupo con nombre, como `public`, que contiene tablas dentro de una base de datos. Un espacio de nombres es un espacio en el que cada nombre es único. Dos tablas llamadas `books` no pueden existir en el mismo esquema, pero sí en dos esquemas distintos.
- **"El esquema" como diseño** es el sentido informal: el conjunto completo de tablas, columnas y reglas que tiene una base de datos. "Enséñame el esquema" pide ese diseño, no el objeto `public`.

La frase que rodea a la palabra te dice cuál de los dos se quiere decir. `public`, y cualquier cosa escrita como `esquema.tabla`, es el espacio de nombres. "Diseñar un esquema" y "leer el esquema" hablan del diseño.

[02-relaciones.md](02-relaciones.md) trata el sentido de diseño: enseña cómo se definen las tablas, las claves y las reglas de una base de datos. El sentido de espacio de nombres vuelve en [16-trabajar-con-una-base-de-datos-existente.md](16-trabajar-con-una-base-de-datos-existente.md), que trata los nombres escritos como `schema.table` en una base de datos con más de un esquema.

## Ejecutar sentencias en pgAdmin

Docs: https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html → lee: "Query Tool" — el editor de SQL y las pestañas Data Output y Messages

El capítulo 01 da por hecho que sabes escribir una sentencia, ejecutarla y leer lo que devuelve. Esta sección te lleva hasta ahí. Y te deja con la base de datos de práctica que consultan los capítulos posteriores.

### pgAdmin es el cliente y el servidor PostgreSQL local guarda las bases de datos

Intervienen dos programas, y es fácil confundirlos porque solo miras uno de ellos.

- El **servidor PostgreSQL** se ejecuta en segundo plano en tu máquina. No tiene ventana. Es el dueño de las bases de datos.
- **pgAdmin** es un cliente con interfaz gráfica. Se conecta al servidor, le envía el SQL que escribes y muestra lo que el servidor responde.

pgAdmin no guarda ningún dato. Cerrarlo no pierde nada, y todo lo que muestra se lo pidió al servidor.

En pgAdmin escribes SQL en la **Query Tool**: un editor arriba y una zona de resultados debajo. Una Query Tool está conectada a una base de datos, la que estaba seleccionada cuando la abriste.

### Crear la base de datos de práctica `practice_junior_notes`

Esta ruta usa una base de datos propia, para que nada de lo que ejecutes aquí pueda tocar `timetrack`.

1. En el panel izquierdo de pgAdmin, el **Object Explorer**, despliega **Servers** y después tu servidor hasta ver **Databases**.
2. Haz clic derecho en **Databases** y elige **Create → Database…**.
3. En la pestaña **General**, escribe `practice_junior_notes` en el campo **Database**. Usa ese nombre exacto: un nombre con mayúsculas o con guion habría que escribirlo entre comillas dobles en cada sentencia.
4. Abre la pestaña **SQL** del mismo cuadro de diálogo. Muestra la sentencia `CREATE DATABASE` que pgAdmin está a punto de enviar.
5. Haz clic en **Save**. La nueva base de datos aparece bajo **Databases**.

> **El cuadro de diálogo escribe SQL por ti.** La sentencia que viste en la pestaña **SQL** es la que pgAdmin envió al servidor cuando hiciste clic en **Save**. El servidor solo entiende SQL, así que lo único que puede hacer un cliente gráfico es convertir tus clics en sentencias.

### Cargar con datos iniciales la base de datos de práctica (seeding)

**Cargar con datos iniciales** una base de datos (en inglés, _seeding_) significa llenarla con un conjunto de datos de partida conocido. El script de abajo lo hace. Crea las ocho tablas de una pequeña librería y las rellena con 72 filas.

1. Haz clic en `practice_junior_notes` en el Object Explorer y abre **Tools → Query Tool**.
2. Mira el enlace de conexión en la parte superior de la Query Tool. Tiene que nombrar `practice_junior_notes`. Si nombra otra base de datos, las tablas se crearán en esa otra base de datos.
3. Pega el script completo en el editor.
4. Pulsa **F5**, o haz clic en **Execute script** en la barra de herramientas.

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

No se espera que entiendas todavía este script. Léelo solo por sus tres partes, que numeran sus comentarios: borra las tablas si existen, las crea y las rellena. Una línea que empieza por `--` es un **comentario**: PostgreSQL ignora todo lo que hay desde `--` hasta el final de esa línea. [02-relaciones.md](02-relaciones.md) enseña las sentencias `CREATE TABLE` de la parte 2, y [08-dml.md](08-dml.md) enseña las sentencias `INSERT` de la parte 3.

Cuando el script termina, la pestaña **Messages** bajo el editor muestra cuánto tardó. La primera vez que lo ejecutas, esa pestaña lista además ocho líneas como esta:

```
NOTICE:  table "reviews" does not exist, skipping
```

> **Un `NOTICE` no es un error.** La parte 1 del script borra las tablas por si existen. La primera vez no hay nada que borrar, así que PostgreSQL lo dice y sigue adelante. Una línea que empieza por `ERROR:` significa que la sentencia fue rechazada. Una línea que empieza por `NOTICE:` es información.

Comprueba el resultado de dos maneras. Primero, en el Object Explorer, abre **practice_junior_notes → Schemas → public → Tables**. Si la lista está vacía, haz clic derecho en **Tables** y elige **Refresh…**. Deberías ver las ocho tablas. Segundo, borra el script del editor, escribe esta sentencia y pulsa **F5**:

```sql
SELECT title, price FROM books;
```

Léela como una frase: de la tabla `books`, dame las columnas `title` y `price`. La respuesta aparece en la pestaña **Data Output**:

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

Dos detalles de este resultado vuelven más adelante en la nota. Las filas aparecen en el orden en que las insertó el script, y la sección [Un resultado es un conjunto de filas sin orden](#un-resultado-es-un-conjunto-de-filas-sin-orden) muestra que ese orden no es una promesa. Un libro muestra `[null]` donde debería estar su precio, y la sección [NULL marca un valor ausente](#null-marca-un-valor-ausente) explica qué es eso. [03-select.md](03-select.md) enseña `SELECT` y `FROM` por completo.

**Puedes volver a ejecutar el script en cualquier momento.** Reconstruye las ocho tablas con sus 72 filas originales, así que ejecutarlo es la manera de deshacer cualquier experimento.

> **F5 ejecuta el texto seleccionado, o el editor entero cuando no hay nada seleccionado.** Si una parte del contenido del editor está resaltada, pgAdmin envía solo esa parte. Sin nada resaltado, envía todo lo que hay en el editor. Así que, cuando el editor contiene varias sentencias y quieres ejecutar una sola, resalta primero esa sentencia.

### Evaluar una expresión con `SELECT`

`SELECT` no necesita una tabla. Si solo le das una expresión, la evalúa y devuelve su valor. Una **expresión** es cualquier cosa que produce un valor: un número, un trozo de texto, un cálculo.

```sql
SELECT 2 + 3;
```

```
 ?column?
 integer
----------
        5
```

La respuesta es una tabla con una columna y una fila. El resultado de un `SELECT` es siempre una tabla, incluso cuando contiene un único valor.

La cabecera de la columna tiene dos líneas en pgAdmin. La primera línea es el nombre de la columna, y la segunda es su tipo de dato. Los demás bloques de resultado de esta nota muestran solo el nombre. El tipo es `integer` porque `2` y `3` son números enteros. El nombre es `?column?` porque la sentencia no le dio nombre a la columna, y ese es el nombre provisional que usa PostgreSQL para una columna que no tiene nombre. Le pones nombre con `AS`:

```sql
SELECT 2 + 3 AS total;
```

Ahora la cabecera dice `total`. [03-select.md](03-select.md) enseña estos nombres, que se llaman alias.

Esta forma corta, `SELECT` seguido de una expresión y un punto y coma, es la manera más rápida de preguntarle a PostgreSQL qué produce una expresión. El capítulo 01 se apoya en ella para mostrar cómo se comporta cada tipo de dato.

Tres detalles de esta forma valen para todas las sentencias que vas a escribir:

- **El punto y coma termina una sentencia.** pgAdmin ejecuta una sola sentencia aunque no lo lleve, pero dos sentencias en el mismo editor tienen que ir separadas por uno. Escríbelo siempre.
- **Las palabras clave no distinguen mayúsculas de minúsculas.** Una palabra clave es una palabra que pertenece al propio lenguaje SQL, como `SELECT` o `FROM`. Para PostgreSQL, `select`, `Select` y `SELECT` son la misma palabra. La convención es escribir las palabras clave en mayúsculas y los nombres de tablas y columnas en minúsculas, lo que permite distinguirlos de un vistazo.
- **El texto va entre comillas simples.** `SELECT 'hello';` devuelve el texto `hello`. Las comillas dobles significan otra cosa: marcan un nombre, como el nombre de una columna, y no un valor. `SELECT "hello";` falla con `column "hello" does not exist`, porque PostgreSQL busca una columna con ese nombre. [03-select.md](03-select.md) trata la diferencia entre los dos tipos de comillas.

### Cómo se ve una sentencia rechazada

Escribe `SELECT 2 + 3;` otra vez, pero sin la última letra de `SELECT`:

```sql
SELEC 2 + 3;
```

Esta vez no hay ningún resultado que mostrar, y la pestaña Messages dice esto:

```
ERROR:  syntax error at or near "SELEC"
LINE 1: SELEC 2 + 3;
        ^

SQL state: 42601
Character: 1
```

Cada línea dice algo distinto:

- **`ERROR:  syntax error at or near "SELEC"`** nombra el fallo. Un error de sintaxis (_syntax error_) significa que el texto no sigue la gramática de SQL. La palabra entre comillas es el punto donde PostgreSQL dejó de entender la sentencia.
- **`LINE 1:` y el `^` que hay debajo** repiten la línea de tu sentencia y señalan ese punto. pgAdmin también lo subraya en el editor.
- **`SQL state: 42601`** es el código que PostgreSQL asigna a esta clase de error. Cada clase de error tiene su propio código de cinco caracteres, y `42601` es siempre un error de sintaxis.
- **`Character: 1`** es la posición del problema, contada en caracteres desde el principio de la sentencia.

Aquí la primera línea está en inglés. Un servidor PostgreSQL puede instalarse para dar sus mensajes en otro idioma, y entonces esa línea aparece traducida. El SQL state no cambia con el idioma, y por eso es la parte que conviene buscar.

**Una sentencia rechazada no hace nada.** PostgreSQL ejecuta una sentencia por completo o no la ejecuta, así que tras un error cada tabla contiene exactamente las filas que tenía antes.

Una sentencia puede rechazarse en tres momentos. Esta tabla da un ejemplo de cada uno, con la primera línea de su mensaje:

| Cuándo se rechaza | Sentencia | Primera línea del mensaje |
|---|---|---|
| Antes de ejecutarse: el texto no es SQL válido | `SELEC 2 + 3;` | `ERROR:  syntax error at or near "SELEC"` |
| Antes de ejecutarse: el texto es válido, pero un nombre que contiene no existe | `SELECT titel FROM books;` | `ERROR:  column "titel" does not exist` |
| Mientras se ejecuta: aquí, los datos incumplen una regla de la tabla | un `INSERT` de una reseña con una valoración de 9 | `ERROR:  new row for relation "reviews" violates check constraint "reviews_rating_check"` |

Las dos primeras filas se rechazan antes de que PostgreSQL toque ningún dato: solo tuvo que leer el texto y buscar los nombres. En la segunda, PostgreSQL añade incluso una línea con una sugerencia: `HINT:  Perhaps you meant to reference the column "books.title".` La tercera fila se rechaza más tarde, cuando los datos nuevos se comparan con las reglas de la tabla, y la sección [La base de datos hace cumplir las reglas que declaras](#la-base-de-datos-hace-cumplir-las-reglas-que-declaras) ejecuta esa sentencia. [16-trabajar-con-una-base-de-datos-existente.md](16-trabajar-con-una-base-de-datos-existente.md) vuelve sobre estos mensajes y enseña a diagnosticar cada clase.

### Leer la definición de una columna dentro de `CREATE TABLE`

El capítulo 01 trata los tipos de datos, y un tipo de dato se escribe dentro de la definición de una columna. Por eso necesitas saber leer una definición, aunque escribir una tabla sea tema de un capítulo posterior. Esta es la sentencia que crea la tabla `books` en el script:

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

Después de `CREATE TABLE` viene el nombre de la tabla, y luego un par de paréntesis que encierra una lista de definiciones de columna separadas por comas. Cada línea dentro de los paréntesis es una definición de columna, y siempre empieza con las mismas dos partes:

```
price          NUMERIC(8,2)
└─ nombre      └─ tipo de dato
```

La primera palabra es el nombre de la columna. Lo que va a continuación es el tipo de dato. Los paréntesis pertenecen al tipo: `VARCHAR(200)` es texto de como máximo 200 caracteres, y `NUMERIC(8,2)` es un número de como máximo 8 dígitos, 2 de ellos después de la coma decimal. Todo lo que se escribe después del tipo es una regla o un valor por defecto de esa columna. Un valor por defecto es el valor que toma la columna cuando una fila nueva no da ninguno. Esta tabla lee cuatro de las definiciones de arriba:

| Definición | Nombre | Tipo de dato | Después del tipo |
|---|---|---|---|
| `price NUMERIC(8,2)` | `price` | `NUMERIC(8,2)` | nada |
| `title VARCHAR(200) NOT NULL` | `title` | `VARCHAR(200)` | `NOT NULL`, una regla |
| `stock INT NOT NULL DEFAULT 0` | `stock` | `INT` | `NOT NULL`, una regla, y `DEFAULT 0`, un valor por defecto |
| `id SERIAL PRIMARY KEY` | `id` | `SERIAL` | `PRIMARY KEY`, una regla |

Lo que esta tabla lista bajo **Tipo de dato** es de lo que trata el capítulo 01. [01-tipos-de-datos.md](01-tipos-de-datos.md) enseña qué acepta cada tipo de dato y cómo se comporta, incluidos `VARCHAR`, `NUMERIC` y `SERIAL`. Lo que lista bajo **Después del tipo** es el tema de [02-relaciones.md](02-relaciones.md), que enseña las reglas y los valores por defecto.

> **¿Por qué los `INSERT` del script nunca dan un `id`?** Por `SERIAL`. Una columna de ese tipo es un número entero que PostgreSQL rellena por sí mismo, contando 1, 2, 3 en el orden en que se insertan las filas. Así fue como _1984_, el primer libro insertado, recibió el `id` 1.

Ya sabes ejecutar una sentencia, leer su resultado, leer un error y leer la definición de una columna. Lo último que el capítulo 01 espera que reconozcas es NULL. Se explica en la sección [NULL marca un valor ausente](#null-marca-un-valor-ausente), que viene después de la idea que explica cómo ejecuta PostgreSQL lo que escribes.

## Declarativo significa que describes el resultado y PostgreSQL planifica el trabajo

Docs: https://www.postgresql.org/docs/current/query-path.html → lee: "The Path of a Query" — las etapas entre el texto que envías y las filas que recibes

Un programa de JavaScript es una lista de pasos, y el ordenador ejecuta exactamente esos pasos, exactamente en ese orden. SQL no funciona así. Leer una sentencia como si fuera una lista de pasos es lo que hace que SQL resulte confuso a quien llega desde JavaScript.

### La misma pregunta en JavaScript y en SQL

La pregunta es: ¿qué libros cuestan menos de 10, por título y en orden alfabético?

En JavaScript, con un bucle:

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

En JavaScript, con métodos de array:

```js
const cheapTitles = books
  .filter((book) => book.price < 10)
  .map((book) => book.title)
  .sort();
// ['1984', 'Animal Farm', 'Emma', 'Pride and Prejudice']
```

En SQL, sobre la base de datos de práctica:

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

La sentencia tiene cuatro partes, y cada parte que empieza con una palabra clave se llama **cláusula**. Léelas como una frase en español: de `books`, quédate con las filas cuyo precio es menor que 10, dame su `title`, ordenado por `title`. [04-where.md](04-where.md) enseña `WHERE`, y [05-order-by-limit.md](05-order-by-limit.md) enseña `ORDER BY`.

Las dos versiones de JavaScript dicen **cómo** obtener la respuesta. Crea un array vacío. Visita cada elemento, del primero al último. Compruébalo. Copia su título. Ordena las copias. El código que enumera los pasos se llama **imperativo**.

La sentencia SQL no dice nada de eso. No tiene bucle, ni variable, ni "visita cada fila". Establece cuál tiene que ser el resultado: de qué tabla salen las filas, qué filas cumplen la condición, qué columna se quiere y en qué orden. Una sentencia que describe el resultado y deja los pasos en manos de quien la ejecuta se llama **declarativa**. Ya usas un lenguaje declarativo: una regla de CSS como `display: flex` establece cómo tienen que quedar los elementos, y el navegador calcula las posiciones.

> **¿No es ya declarativo `.filter().map().sort()`?** Se lee más como una descripción que el bucle, pero sigue fijando los pasos. `filter` visita todos los elementos del array, uno por uno, y después `map` visita todos los elementos que pasaron el filtro. Ese procedimiento lo elegiste tú al escribir la cadena. La sentencia SQL no elige ningún procedimiento, y eso deja a PostgreSQL libre para encontrar la respuesta sin leer todas las filas de la tabla.

### Cómo convierte PostgreSQL la sentencia en un plan de ejecución

Alguien tiene que elegir los pasos, y PostgreSQL lo hace cada vez que llega una sentencia. La sentencia pasa por cuatro etapas:

1. **Analizar.** El **parser** (analizador sintáctico) comprueba el texto contra la gramática de SQL. `SELEC 2 + 3;` se rechaza en esta etapa, con un error de sintaxis.
2. **Resolver los nombres.** PostgreSQL busca cada tabla y cada columna que menciona la sentencia en el **catálogo del sistema** (_system catalog_), que es donde registra las tablas y columnas que tiene cada base de datos. `SELECT titel FROM books;` se rechaza en esta etapa, porque `books` no tiene ninguna columna llamada `titel`.
3. **Planificar.** El **planner** (planificador) calcula las distintas maneras de producir el resultado, estima el coste de cada una y se queda con la más barata. Lo que produce es el **plan de ejecución** (_execution plan_): la lista concreta de pasos.
4. **Ejecutar.** El **executor** (ejecutor) lleva a cabo el plan y envía las filas de vuelta al cliente.

La documentación enlazada arriba cuenta las etapas de otra forma. Añade la conexión como primera etapa, trata las etapas 1 y 2 como una sola y coloca una etapa de reescritura antes del planner. PostgreSQL usa esa etapa de reescritura para las vistas, que enseña [11-ctes-y-vistas.md](11-ctes-y-vistas.md).

Para la sentencia de arriba y una tabla `books` de 12 filas, el plan tiene dos pasos:

```
1. Leer todas las filas de books y quedarse con las que tienen un precio menor que 10
2. Ordenar por title las filas que se han conservado
```

Con 12 filas no hay una forma mejor. Ahora supón que la tabla tiene dos millones de libros y alguien ha creado un **índice** (_index_) sobre `price`. Un índice es una estructura adicional, mantenida en orden según los valores de una columna, que permite a PostgreSQL ir directamente a las filas con un valor dado. Funciona como el índice alfabético del final de un libro, que te manda a la página correcta sin leer el libro entero. El planner tiene ahora dos maneras de hacer el paso 1:

- leer los dos millones de filas y quedarse con las baratas, o
- usar el índice para traer solo las baratas.

Para elegir, usa las **estadísticas** (_statistics_): las cifras que PostgreSQL guarda sobre cada tabla, como cuántas filas tiene y cómo se distribuyen los valores de cada columna. A partir de esas cifras estima cuánto costaría cada manera, y toma la más barata.

Tu sentencia son las mismas cuatro líneas en los dos casos. Ese es el sentido del modelo declarativo: la pregunta permanece fija, y la manera de responderla se adapta a los datos.

Un taxi funciona igual. Le das al conductor la dirección, y el conductor, que conoce las calles y el tráfico a esa hora, elige la ruta. La misma dirección puede significar una ruta distinta mañana.

### Qué cambia el planner en cómo escribes SQL

Que sea PostgreSQL quien elige los pasos tiene cuatro consecuencias:

1. **El orden en que escribes las cláusulas no es el orden en que se aplican.** `SELECT title` se escribe primero, pero PostgreSQL no puede devolver títulos antes de saber qué filas cumplen la condición. [03-select.md](03-select.md) da el orden en que se evalúan las cláusulas de una sentencia.
2. **Nunca escribes un bucle.** SQL no tiene "para cada fila". Una sentencia habla de todas las filas que cumplen una condición a la vez: "los libros cuyo precio es menor que 10", no "coge el primer libro, mira su precio, coge el siguiente". Pensar fila por fila es el hábito de JavaScript que hay que abandonar.
3. **Una sentencia puede volverse más lenta o más rápida sin cambiar.** El planner trabaja con las estadísticas tal como están cuando llega la sentencia. Una sentencia que era instantánea con 12 filas puede ser lenta con dos millones, y crear un índice puede volver a hacerla rápida sin cambiar su texto. [13-indices.md](13-indices.md) enseña los índices y `EXPLAIN`, la sentencia que muestra qué plan eligió PostgreSQL.
4. **Las filas vuelven en el orden en que las produjo el plan.** Nada en el plan las ordena a menos que la sentencia lo pida. Ese es el primero de los tres rasgos, y la sección siguiente trata de él.

## Un resultado es un conjunto de filas sin orden

Docs: https://www.postgresql.org/docs/current/queries-order.html → lee: el primer párrafo de "Sorting Rows (ORDER BY)" — las filas que no se han ordenado vuelven en un orden no especificado

Tres rasgos de SQL aparecen en todos los capítulos de esta ruta, y cada uno contradice un hábito de JavaScript. Esta sección y las dos siguientes tratan uno cada una. Este es el primero, y se sigue directamente de cómo trabaja el planner.

Un array tiene un orden: el elemento 0, el elemento 1, el elemento 2, y lo conserva. Una tabla no. Una tabla es un conjunto de filas sin primera fila ni última fila. Un resultado es igual: a menos que la sentencia pida un orden, PostgreSQL devuelve las filas en el orden en que las produjo el plan.

Puedes verlo con dos sentencias. Ejecuta la primera:

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

Las doce filas parecen ordenadas por `id`. No lo están. Este es el orden en que las filas están guardadas en el archivo de la tabla, y hasta ahora ese es el orden en que las insertó el script.

Ahora cambia una fila. La sentencia de abajo pone en 11 el stock del libro cuyo `id` es 1. [08-dml.md](08-dml.md) enseña `UPDATE`.

```sql
UPDATE books SET stock = 11 WHERE id = 1;
```

Luego ejecuta otra vez la primera sentencia:

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

La fila con `id` 1 es ahora la última. La sentencia no cambió, y nada en el `UPDATE` mencionaba un orden. Tres pasos lo explican:

1. PostgreSQL no sobrescribe una fila en su sitio. Un `UPDATE` escribe una versión nueva de la fila en espacio libre del archivo de la tabla, que aquí está al final, y marca la versión antigua como obsoleta.
2. El plan de `SELECT id, title FROM books;` lee el archivo de la tabla de principio a fin.
3. Así que la versión nueva de la fila con `id` 1 se lee la última, y se devuelve la última.

Nadie ordenó nada en ninguna de las dos ejecuciones. El primer resultado parecía ordenado por el sitio donde casualmente estaban guardadas las filas. El orden de un resultado puede cambiar también por otra razón: el planner puede elegir un plan distinto cuando la tabla crece o cuando se crea un índice.

Por eso un orden existe solo cuando la sentencia lo pide, con `ORDER BY`:

```sql
SELECT id, title FROM books ORDER BY id;
```

Esta devuelve las filas del `id` 1 al `id` 12, antes del `UPDATE` y después de él.

Este rasgo se vuelve decisivo por primera vez en [05-order-by-limit.md](05-order-by-limit.md). Ese capítulo toma solo algunas filas de un resultado, como las cinco primeras o la segunda página. Sin un orden indicado, "las cinco primeras" son cinco filas que pueden ser distintas en la ejecución siguiente.

> **"Conjunto" aquí significa sin orden. No significa sin duplicados.** Un resultado puede contener la misma fila varias veces: `SELECT price FROM books;` devuelve `12.99` cuatro veces, una por cada libro con ese precio. Quitar las filas repetidas es trabajo de `DISTINCT`, que enseña [03-select.md](03-select.md).

Ejecuta ahora otra vez el script de carga. Devuelve el stock de _1984_ a 12 y las filas a su lugar original.

## NULL marca un valor ausente

Docs: https://www.postgresql.org/docs/current/functions-comparison.html → lee: "Comparison Functions and Operators" — el párrafo que empieza por "Do not write expression = NULL"

La base de datos de práctica tiene un libro sin precio. En el script, la fila de _The Angel's Game_ lleva la palabra `NULL` donde va el precio. **NULL** es el marcador que PostgreSQL guarda en lugar de un valor para decir que la fila no tiene valor en esa columna. Es la única excepción a lo que dijo la sección [Tabla, fila y columna](#tabla-fila-y-columna), que cada fila tiene un valor para cada columna. pgAdmin lo muestra como `[null]`.

NULL no es cero, y no es un texto vacío. Un precio de `0` significaría que el libro es gratis. NULL significa que el precio no se conoce, o que nunca se registró. Esa diferencia es todo el rasgo: **NULL no es un valor. Es la ausencia de uno.**

> **`NULL` se escribe sin comillas.** El script escribe la palabra `NULL` a secas. Entre comillas simples, `'NULL'` es un texto de cuatro letras, y un texto es un valor como cualquier otro: un libro cuyo título es `'NULL'` tiene título.

El comportamiento que se deriva de esto se ve con dos expresiones:

```sql
SELECT 5 + NULL;
```

```sql
SELECT NULL = NULL;
```

Las dos devuelven `[null]`. Cinco más un número que no se conoce da un número que no se conoce. Y preguntar si un valor ausente es igual a otro valor ausente tampoco tiene respuesta: PostgreSQL no puede decir verdadero y no puede decir falso, así que responde NULL.

JavaScript se comporta de otra manera, y aquí es donde hay que cambiar el hábito:

```js
null === null   // true
null + 5        // 5
null < 10       // true
```

En JavaScript, `null` es un valor como cualquier otro. Es igual a sí mismo, y en las operaciones aritméticas y en comparaciones como `<`, JavaScript lo convierte en `0`. SQL nunca convierte NULL en nada.

La diferencia cambia los resultados. Toma el array `books` de la sección [La misma pregunta en JavaScript y en SQL](#la-misma-pregunta-en-javascript-y-en-sql), añádele el libro sin precio y ejecuta la misma cadena:

```js
books.push({ title: "The Angel's Game", price: null });

books
  .filter((book) => book.price < 10)
  .map((book) => book.title)
  .sort();
// ['1984', 'Animal Farm', 'Emma', 'Pride and Prejudice', "The Angel's Game"]
```

JavaScript incluye _The Angel's Game_, porque `null < 10` es `true`. La sentencia SQL de esa misma sección, ejecutada contra una tabla que sí contiene ese libro, devolvió cuatro títulos y lo dejó fuera. Para esa fila, `price < 10` es `NULL < 10`, y la respuesta a eso es NULL. `WHERE` conserva una fila solo cuando su condición es verdadera, y NULL no es verdadero. La fila se descarta, sin error y sin aviso.

Pedir las filas que no tienen valor exige una sintaxis propia, `price IS NULL`, porque `price = NULL` nunca devuelve verdadero. [04-where.md](04-where.md) enseña las dos, y es donde este rasgo se vuelve decisivo por primera vez: un filtro que se olvida de NULL pierde filas sin avisar. Luego el rasgo vuelve en [06-joins.md](06-joins.md), donde NULL rellena las columnas de una fila que no encontró pareja en la otra tabla, y en [07-agregados.md](07-agregados.md), donde los totales y las medias saltan los valores ausentes.

No todas las columnas pueden contener NULL. Una columna lo acepta salvo que su definición diga `NOT NULL`, o diga `PRIMARY KEY`, que incluye esa regla. En `books`, `title` está declarada `NOT NULL` y `price` no, y por eso un libro puede existir sin precio pero no sin título.

Para el capítulo 01 necesitas dos cosas de esta sección: leer NULL como "aquí no hay valor", y no comparar nunca nada con NULL usando `=`.

## La base de datos hace cumplir las reglas que declaras

Docs: https://www.postgresql.org/docs/current/ddl-constraints.html → lee: la introducción de "Constraints" — por qué un tipo de dato por sí solo es un límite demasiado grueso

Una reseña tiene una valoración (`rating`) de 1 a 5. En JavaScript nada impide esto:

```js
reviews.push({ bookId: 1, customerId: 2, rating: 9 });
```

Puedes validar la valoración en la función que guarda una reseña. Eso protege un solo camino. Cualquier otro código que escriba en el array, y cualquier otro programa que escriba sobre los mismos datos, se salta la comprobación.

En una base de datos relacional la regla se declara una sola vez, en la propia tabla. Esta es la definición de la columna `rating` en el script:

```sql
rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
```

Léela como mostró la sección [Leer la definición de una columna dentro de `CREATE TABLE`](#leer-la-definición-de-una-columna-dentro-de-create-table): el nombre es `rating`, el tipo es `INT` y siguen dos reglas. `NOT NULL` dice que toda reseña tiene que tener una valoración. `CHECK (rating BETWEEN 1 AND 5)` dice que la valoración tiene que estar entre 1 y 5. Una regla declarada sobre una tabla se llama **restricción** (_constraint_).

Ahora intenta romper la regla. La sentencia de abajo intenta añadir una reseña con una valoración de 9:

```sql
INSERT INTO reviews (book_id, customer_id, rating)
VALUES (1, 2, 9);
```

PostgreSQL la rechaza. Esta es la primera línea de la pestaña Messages:

```
ERROR:  new row for relation "reviews" violates check constraint "reviews_rating_check"
```

La línea tiene tres partes. `relation "reviews"` es la tabla. `check constraint` es la clase de regla que se incumplió. `"reviews_rating_check"` es el nombre de la regla, que PostgreSQL construyó a partir del nombre de la tabla y del nombre de la columna, porque el script no le dio nombre a la regla. Debajo de esa línea, la pestaña Messages imprime la fila que se rechazó, como `Failing row contains (…)`, y el SQL state `23514`.

La fila no se guardó. La tabla `reviews` sigue teniendo sus ocho filas.

La razón por la que esto es más fuerte que una comprobación en tu código es el camino que sigue todo cambio:

1. Todo cambio, de cualquier cliente, llega al servidor como una sentencia.
2. Antes de que el servidor guarde una fila, compara la fila con las restricciones de la tabla.
3. Si la fila incumple alguna, el servidor la rechaza, y la sentencia falla entera.

La comprobación está en el único programa por el que pasan todas las lecturas y todas las escrituras, como describió la sección [Un servidor de base de datos es un programa aparte que tiene los datos a su cargo](#un-servidor-de-base-de-datos-es-un-programa-aparte-que-tiene-los-datos-a-su-cargo). pgAdmin, una aplicación Spring Boot y un script que ejecuta un compañero reciben la misma regla y el mismo error. Sigue valiendo la pena escribir validación en la aplicación, porque puede dar al usuario un mensaje más claro y antes. Pero es la restricción la que garantiza los datos.

El script declara cinco clases de regla. La columna izquierda de esta tabla cita una línea del script, la columna central nombra la regla de esa línea de la que trata la fila, y la columna derecha dice qué se negará a aceptar PostgreSQL por culpa de esa regla:

| En el script | La regla | Qué rechaza PostgreSQL |
|---|---|---|
| `id SERIAL PRIMARY KEY` | `PRIMARY KEY` | dos filas con el mismo `id`, o una fila sin `id` |
| `title VARCHAR(200) NOT NULL` | `NOT NULL` | un libro sin título |
| `email VARCHAR(100) UNIQUE NOT NULL` | `UNIQUE` | dos clientes con el mismo email |
| `rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5)` | `CHECK (…)` | una valoración fuera del rango de 1 a 5 |
| `author_id INT REFERENCES authors(id)` | `REFERENCES` | un libro cuyo `author_id` no es el `id` de ningún autor existente |

Este rasgo se vuelve decisivo por primera vez en [02-relaciones.md](02-relaciones.md), que enseña cómo se declara cada una de estas cinco reglas. Vuelve en [08-dml.md](08-dml.md), donde cada fila que insertas, cambias o borras se juzga contra ellas.

## Dónde encaja SQL entre Angular, Spring Boot y PostgreSQL

Docs: https://www.baeldung.com/java-jdbc → lee: "Connecting to a Database" y "Executing SQL Statements" — el código Java que hay debajo de cada llamada de Spring Boot a la base de datos

> **Preview — Spring Boot:** Esta sección nombra piezas de Java y de Spring Boot (JDBC, Hibernate, un repository, `@Query`) para mostrar dónde aparece SQL en una aplicación. Léela por la posición de cada pieza. Las piezas en sí las estudiarás en las notas de Spring Boot.

En una aplicación full-stack como el proyecto 07, una petición de datos atraviesa cuatro capas:

```
Navegador: Angular
   │   petición HTTP, JSON
   ▼
Spring Boot: controller → service → repository
   │   Hibernate escribe la sentencia SQL
   ▼
JDBC y el driver de PostgreSQL
   │   la sentencia SQL, como texto, por una conexión
   ▼
Servidor PostgreSQL                     ◄── pgAdmin también se conecta aquí
```

Las filas hacen el camino de vuelta por la misma ruta: PostgreSQL devuelve filas, Hibernate las convierte en objetos Java y Spring Boot se las envía a Angular como JSON.

**Angular nunca ve SQL.** Se ejecuta en el navegador, envía peticiones HTTP a Spring Boot y recibe JSON. No puede conectarse a PostgreSQL, y no debe: una conexión necesita la contraseña de la base de datos, y todo lo que se entrega a un navegador puede leerlo la persona que lo usa.

**Spring Boot es un cliente de la base de datos.** Hace lo que hace pgAdmin: abre conexiones y envía sentencias. En el proyecto 07, `application.properties`, el archivo que contiene la configuración de la aplicación, tiene la dirección a la que se conecta:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/timetrack}
```

La parte que sigue a `DB_URL:` es la dirección que se usa cuando ninguna variable de entorno la sustituye. Se lee así: un servidor PostgreSQL en esta máquina (`localhost`), en el puerto `5432`, que es el puerto en el que escucha PostgreSQL por defecto, y la base de datos `timetrack`.

**JDBC es la forma en que Java habla con una base de datos.** JDBC (_Java Database Connectivity_) es la API estándar de Java para tres cosas: abrir una conexión, enviar una sentencia como texto y leer las filas que vuelven. Un **driver** es la librería que implementa esa API para un servidor concreto. El proyecto 07 tiene el driver de PostgreSQL como la dependencia `org.postgresql:postgresql` en su `pom.xml`, el archivo que lista las librerías que usa el proyecto.

**Un ORM escribe el SQL por ti.** Un ORM (_object-relational mapper_, «mapeador objeto-relacional») es una librería que te permite trabajar con objetos Java. Convierte cada operación sobre ellos en una sentencia SQL, y cada fila que vuelve en un objeto. Hibernate es el ORM que Spring Boot incorpora a través de la dependencia `spring-boot-starter-data-jpa`. Una llamada como `projectRepository.findById(id)` en `ProjectService` no contiene SQL. Hibernate genera un `SELECT` sobre la tabla `projects` que se queda con la fila de ese `id`, y lo envía por JDBC.

Así que todo camino termina en una sentencia SQL, escrita por ti o escrita por Hibernate. Por eso un ORM no hace opcional el SQL. Lo muestran tres situaciones de tu propio proyecto:

**Lees el SQL que escribe Hibernate.** El proyecto 07 pone `spring.jpa.show-sql=true` en `application-dev.properties`, su archivo de configuración para desarrollo. Ese ajuste imprime cada sentencia que envía Hibernate. Cuando un endpoint es lento o devuelve las filas equivocadas, esa salida es la primera evidencia que tienes, y es SQL.

**Escribes a mano las consultas que el ORM no genera.** Una búsqueda por `id` te la genera. Un informe que suma las horas de cada proyecto no, así que `TimeEntryRepository.java` en el proyecto 07 lo contiene, escrito a mano:

```java
@Query("""
        SELECT te.project.id AS projectId, te.project.name AS projectName, round(SUM(te.hours), 2) AS totalHours, te.project.active AS active
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.id, te.project.name, te.project.active
        ORDER BY SUM(te.hours) DESC, te.project.name ASC
        """)
```

Esto es JPQL, el lenguaje de consulta que acepta Hibernate. Tiene las mismas cláusulas que SQL, pero nombra clases de Java y sus campos (`TimeEntry`, `te.project.name`) donde SQL nombra tablas y columnas, e Hibernate lo traduce a SQL. Sus palabras clave son las que enseña esta ruta: `BETWEEN` está en [04-where.md](04-where.md), `ORDER BY` en [05-order-by-limit.md](05-order-by-limit.md), `SUM` y `GROUP BY` en [07-agregados.md](07-agregados.md), y `round` en [01-tipos-de-datos.md](01-tipos-de-datos.md).

**Miras los datos directamente.** Cuando alguien informa de que una entrada de horas ha desaparecido, la comprobación más rápida es un `SELECT` en pgAdmin sobre la tabla: la fila está o no está. Eso te dice si buscar el problema en los datos o en el código que hay por encima, y no interviene nada de Java.

pgAdmin entra en el diagrama por abajo, como segundo cliente del mismo servidor. Una sentencia que pruebas en pgAdmin se juzga con las mismas reglas cuando la envía Spring Boot, porque, como mostró la sección anterior, el servidor aplica sus restricciones a todos los clientes.

## La ruta del capítulo 01 al capítulo 16

Docs: https://www.postgresql.org/docs/current/sql.html → lee: el índice de contenidos de "Part II. The SQL Language" — la referencia oficial de las sentencias que enseña esta ruta

Los dieciséis capítulos siguen una sola línea: qué son los datos, cómo se leen, cómo se cambian, las formas más difíciles de leerlos y cómo trabajar con SQL como profesional. La ruta abre con la estructura, en los capítulos 01 y 02, porque toda sentencia opera sobre columnas con tipo dentro de tablas: no puedes juzgar `WHERE price < 10` sin saber qué puede contener `price`. A partir de ahí, los capítulos 03 a 07 construyen la lectura en el orden en que crece una consulta: elegir las columnas, filtrar las filas, ordenarlas, combinar tablas, resumir grupos. Solo entonces los capítulos 08 y 09 cambian datos, ya que la manera segura de cambiar filas es seleccionarlas primero y comprobar a cuáles llegará el cambio. Con el ciclo cotidiano de lectura y escritura completo, los capítulos 10 a 12 vuelven a la lectura, con las formas que meten una consulta dentro de otra, dan nombre a una consulta o calculan sobre filas relacionadas. El capítulo 13 viene después de los doce anteriores, porque el coste de una consulta solo vale la pena medirlo cuando ya sabes escribir la consulta. El capítulo 14 reúne entonces la sintaxis de fechas propia de PostgreSQL y separa lo que es SQL estándar de lo que no lo es. Los dos últimos capítulos cambian la pregunta de "¿cómo escribo esto?" a "¿cómo trabajo?": el capítulo 15 convierte todo lo anterior en un método, y el capítulo 16 aplica ese método a una base de datos que diseñó otra persona.

La tabla da la aportación de cada capítulo. La primera columna enlaza el archivo, la segunda da el título del capítulo, y la tercera dice qué añade el capítulo a lo que ya sabías hacer.

| Archivo | Capítulo | Qué añade |
|---|---|---|
| [01-tipos-de-datos.md](01-tipos-de-datos.md) | Tipos de datos | Qué es un valor individual: texto, números, fechas y booleanos, cómo se convierte un valor de un tipo a otro y qué se mantiene exacto en un cálculo |
| [02-relaciones.md](02-relaciones.md) | Definir un esquema — tablas, relaciones, claves y restricciones | Las tablas que guardan esos valores, las claves que identifican filas y conectan tablas, y las restricciones que mantienen válidos los datos |
| [03-select.md](03-select.md) | SELECT, expresiones y texto | La forma de un resultado: qué columnas, columnas calculadas, nombres para ellas y las funciones que transforman texto |
| [04-where.md](04-where.md) | Filtrado y manejo de NULL | Qué filas cumplen la condición: las condiciones, y cómo se comporta NULL dentro de ellas |
| [05-order-by-limit.md](05-order-by-limit.md) | Ordenación, paginación y operaciones de conjuntos | Un orden indicado, un número limitado de filas, páginas, y dos resultados apilados en uno |
| [06-joins.md](06-joins.md) | JOINs | Filas de varias tablas leídas juntas, y cuántas filas produce la combinación |
| [07-agregados.md](07-agregados.md) | Agregados y agrupación | Recuentos, totales y medias, con una fila por grupo |
| [08-dml.md](08-dml.md) | DML — modificar datos | Insertar, cambiar y borrar filas, limitándote a las filas que quieres. DML (_Data Manipulation Language_) es el nombre de esas sentencias |
| [09-transacciones.md](09-transacciones.md) | Transacciones | Varios cambios que triunfan o fallan como uno solo |
| [10-subconsultas.md](10-subconsultas.md) | Subconsultas y comprobaciones de existencia | Una consulta dentro de otra consulta: usada como valor, como tabla o como comprobación de que existe una fila coincidente |
| [11-ctes-y-vistas.md](11-ctes-y-vistas.md) | CTEs y vistas | Un nombre para una consulta: dentro de una sola sentencia, que es un CTE (_common table expression_), o guardado en la base de datos, que es una vista (_view_) |
| [12-funciones-de-ventana.md](12-funciones-de-ventana.md) | Funciones de ventana | Un cálculo sobre un grupo de filas que conserva todas las filas, usado sobre todo para rankings |
| [13-indices.md](13-indices.md) | Fundamentos de rendimiento | Índices y `EXPLAIN`: qué cuesta una consulta, y la evidencia de ello |
| [14-particularidades-de-postgresql.md](14-particularidades-de-postgresql.md) | Particularidades de PostgreSQL | Las funciones de fecha de PostgreSQL, y la frontera entre el SQL estándar y las extensiones de PostgreSQL |
| [15-flujo-de-trabajo-y-revision-de-sql.md](15-flujo-de-trabajo-y-revision-de-sql.md) | Flujo de trabajo de consultas y revisión de SQL | Un método para construir una consulta a partir de una pregunta de negocio, comprobar sus totales y revisar SQL buscando sus errores típicos |
| [16-trabajar-con-una-base-de-datos-existente.md](16-trabajar-con-una-base-de-datos-existente.md) | Trabajar con una base de datos existente | Inspeccionar una base de datos que no diseñaste, leer sus errores y reconocer sus permisos y el código almacenado dentro de ella |

Ahora tienes lo que el capítulo 01 da por supuesto: una base de datos de práctica, un cliente donde ejecutar sentencias, la forma corta de `SELECT` que evalúa una expresión, las dos partes de la definición de una columna y NULL como el marcador de un valor ausente. El archivo siguiente, [01-tipos-de-datos.md](01-tipos-de-datos.md), parte de la segunda de las dos partes de la definición de una columna, el tipo de dato. El tipo decide qué puede contener una columna, cómo se comparan dos valores y qué devuelve un cálculo, y cada tabla, filtro e informe del resto de la ruta se construye sobre esos valores.
