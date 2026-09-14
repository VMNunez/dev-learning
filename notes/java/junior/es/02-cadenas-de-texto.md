## Índice de esta nota

- [Cadenas de texto (Strings)](#cadenas-de-texto-strings)
- [Inmutabilidad — el hecho del que sale todo lo demás en esta página](#inmutabilidad--el-hecho-del-que-sale-todo-lo-demás-en-esta-página)
  - [Lo que pasa realmente en memoria](#lo-que-pasa-realmente-en-memoria)
- [El catálogo de métodos del día a día — y qué devuelve cada llamada](#el-catálogo-de-métodos-del-día-a-día--y-qué-devuelve-cada-llamada)
  - [`substring` — el segundo índice queda excluido, y pasarte del final lanza excepción](#substring--el-segundo-índice-queda-excluido-y-pasarte-del-final-lanza-excepción)
  - [`split` — recibe una expresión regular, no un separador plano](#split--recibe-una-expresión-regular-no-un-separador-plano)
- [`isEmpty()` e `isBlank()` — vacío y en blanco](#isempty-e-isblank--vacío-y-en-blanco)
  - [`strip()` frente a `trim()` — usa `strip()`](#strip-frente-a-trim--usa-strip)
- [Metiendo valores dentro de texto — `+` y `.formatted()`](#metiendo-valores-dentro-de-texto---y-formatted)
  - [Por qué una cadena de formato rota sigue compilando](#por-qué-una-cadena-de-formato-rota-sigue-compilando)
- [Acumulando texto — cuándo `+` se convierte en la herramienta equivocada](#acumulando-texto--cuándo--se-convierte-en-la-herramienta-equivocada)
  - [Regla de cuándo usar `+` y cuándo `StringBuilder`](#regla-de-cuándo-usar--y-cuándo-stringbuilder)
  - [`String`, `StringBuilder`, `StringBuffer`](#string-stringbuilder-stringbuffer)
- [Bloques de texto — texto multilínea sin el escapado](#bloques-de-texto--texto-multilínea-sin-el-escapado)
- [Conversión de texto a número y de número a texto](#conversión-de-texto-a-número-y-de-número-a-texto)
  - [Texto → número](#texto--número)
  - [`NumberFormatException` es _unchecked_ — y qué significa eso hoy](#numberformatexception-es-unchecked--y-qué-significa-eso-hoy)
  - [Número → texto](#número--texto)
- [Comparar dos Strings — y la única pregunta que este capítulo se niega a responder](#comparar-dos-strings--y-la-única-pregunta-que-este-capítulo-se-niega-a-responder)
- [Lo que esto desbloquea](#lo-que-esto-desbloquea)

# Cadenas de texto (Strings)

> 📖 [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basics" y "String Basic Manipulations" para el catálogo de métodos
> 📖 [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → la lista completa de métodos, para cuando necesites la firma exacta

[01-variables-tipos.md](01-variables-tipos.md) explicó cada valor a partir de cómo lo guarda Java en memoria, porque esa forma de guardarlo decide lo que puedes hacer con él. Para los números la respuesta estaba en los bits: un `int` guarda 32 de ellos, y por eso se desborda al superar su valor máximo; un `double` almacena un número decimal de 64 bits, y esto explica parte de su comportamiento: solo le caben unas 15 cifras significativas, así que a partir de ahí deja de guardar dígitos. Ahora esa misma pregunta va dirigida a otro tipo de valor: el `String`. Un `String` puede ser un nombre de usuario, un JSON, una URL, un log para depurar errores, una consulta SQL,etc. Todo eso es texto, y en Java todo el texto es un `String`.

La respuesta es completamente distinta a la que viste para los primitivos en [01-variables-tipos.md](01-variables-tipos.md). Un `String` no es un primitivo, y su valor no cabe en un número fijo de bits — es un **objeto**, y un objeto que **no se puede cambiar después de ser creado**. Ese único hecho explica las características de los `String` en las que se basa este capítulo: por qué `name.toUpperCase()` parece no hacer nada cuando no guardas lo que devuelve, ya que el `String` nuevo se pierde; por qué concatenar texto dentro de un bucle crea un objeto nuevo en cada vuelta y acaba costando rendimiento; por qué tiene que existir una clase llamada `StringBuilder` — y, más adelante, en [06-poo-clases.md](06-poo-clases.md), por qué `==` termina comparando algo completamente distinto de lo que crees.

Este archivo empieza por explicar la **inmutabilidad**, porque cada sección posterior es una consecuencia de ella. A continuación se ve el **catálogo de métodos del día a día**, el conjunto de llamadas que vas a usar constantemente, para que puedas leer código Java correctamente. Tras ello se ven los dos lugares donde esos métodos te engañan: la diferencia entre **vacío y en blanco** (_empty_ y _blank_), y la diferencia entre `trim()` y `strip()`. Después se ven las dos formas posibles de introducir valores dentro de un texto: concatenar con `+`, o usar el método `.formatted()`. Le sigue la única forma de **acumular** texto —ir añadiendo trozos dentro de un bucle— sin dejar por el camino un montón de objetos que ya no usa nadie: `StringBuilder`. Más adelante se ven los **bloques de texto** (_text blocks_), la forma moderna de escribir un trozo de JSON o de SQL dentro del propio código fuente Java. Ya al final se ven las conversiones de **texto a número y de número a texto**, que es donde nacen la mayoría de los errores 500 en una API REST junior. Y cierra con la comparación de dos Strings, la única operación que este capítulo no explica: su explicación completa se ve en [06-poo-clases.md](06-poo-clases.md).

**Se usa un mismo ejemplo para todo el archivo.** En el ejemplo se construye una línea de un informe de horas: un `Employee` tiene un `name`, un `role`, y un número de `hours` registradas esta semana. A partir de ahí se recorren dos direcciones. La de ida convierte los datos de un empleado que ya tienes en memoria —normalmente porque los acabas de leer de la base de datos— en una línea de texto legible, que es lo que acaba impreso en el informe. La de vuelta hace lo contrario: recibe los datos de un CSV que te pasan o de un formulario que alguien rellena, y hay que recuperar el `name`, el `role` y las `hours`, a partir de las cuales podremos hacer cálculos. `Employee` es el mismo ejemplo que se usa en [03-flujo-de-control.md](03-flujo-de-control.md), [06-poo-clases.md](06-poo-clases.md) y [10-colecciones.md](10-colecciones.md), así que no tienes que aprender un ejemplo distinto en cada archivo: solo lo que cada archivo añade nuevo.

---

## Inmutabilidad — el hecho del que sale todo lo demás en esta página

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basics" — y fíjate en la palabra _immutable_ en el primer párrafo; el resto de esta sección es lo que esa palabra realmente te cuesta.

Empieza por un fallo que casi todo el mundo comete al menos una vez. Tienes un nombre en minúsculas y quieres pasarlo a mayúsculas:

```java
String name = "ana";
name.toUpperCase();
System.out.println(name);   // imprime: ana
```

El nombre sigue en minúsculas. No hay error, no hay warning, ningún subrayado rojo en IntelliJ — la línea se ejecutó, hizo su trabajo, y el trabajo no fue a ninguna parte. Eso no es un bug de Java, sino cómo funciona `String` por diseño: **un objeto `String` nunca puede modificarse después de ser creado.** `toUpperCase()` no editó `name`; construyó un segundo objeto `String` que contenía `"ANA"` y lo devolvió, y como ese objeto no se almacenó en ninguna variable, se creó y se descartó inmediatamente.

El arreglo es guardar en una variable lo que el método devuelve:

```java
String name = "ana";
name = name.toUpperCase();      // BIEN — reasigna la variable al nuevo String
System.out.println(name);       // imprime: ANA
```

> **La variable no se crea otra vez: lo que cambia es la dirección que guarda.** La variable `name` ya existía, y como `String` es un objeto, esa variable no guarda los caracteres sino una **dirección** de memoria: la del objeto `"ana"`. La línea `name = name.toUpperCase()` no toca ese objeto. Construye uno nuevo que contiene `"ANA"` y escribe **su nueva dirección en la memoria** dentro de `name`, así que a partir de ese momento la variable apunta al objeto nuevo y el viejo se queda sin nadie que lo apunte. Reutilizar el mismo nombre de variable es justo lo que hace que la línea parezca una edición del objeto anterior cuando no lo es. La sección _Lo que pasa realmente en memoria_, aquí abajo, lo dibuja paso a paso.

Este patrón ya lo viste una vez. En [01-variables-tipos.md](01-variables-tipos.md) se usó `total.add(...)` para calcular una suma que después se perdía sin llegar a guardarse, porque `BigDecimal` también es inmutable y `add` solo puede entregarte un objeto nuevo. Es la misma regla, y va a aparecer una tercera vez en [15-fechas.md](15-fechas.md), donde `date.plusDays(1)` crea un objeto fecha nuevo en vez de modificar el anterior. El patrón es siempre el mismo: si la clase es inmutable, el método que parece editar el objeto devuelve uno nuevo, y tienes que guardarlo en una variable.

> **La inmutabilidad afecta a toda la clase `String`, no solo al método `toUpperCase()`.** Todo método de `String` que parece cambiar algo — `toUpperCase`, `toLowerCase`, `trim`, `strip`, `replace`, `substring`, `concat`, `repeat` — devuelve un `String` **nuevo** y deja el original exactamente como estaba. Si el resultado de una llamada no se asigna a algo, no se guarda en ningún sitio, ni se pasa a otro lado, la llamada no hizo nada observable. Cada vez que una operación sobre un String "no funciona", comprueba esto primero: casi seguro que se te olvidó la asignación, el `=`.

### Lo que pasa realmente en memoria

El diagrama de [01-variables-tipos.md](01-variables-tipos.md) es el que hay que tener presente: una variable `String` no contiene el texto en sí, contiene una **dirección en la memoria** que apunta a un objeto que vive en otro sitio, en el heap (la zona de memoria donde viven todos los objetos). Reasignar la variable cambia la dirección a la que apunta, pero no modifica el objeto al que estaba apuntando antes.

El diagrama de abajo muestra el estado de la memoria antes y después de ejecutar `name = name.toUpperCase()`:

```
ANTES                                DESPUÉS
─────────────────────────           ────────────────────────────────
                                    ┌──────────┐
┌──────────┐    ┌───────┐           │ name     │      ┌───────┐
│ name     │───▶│ "ana" │           │ (movida) │  ┌──▶│ "ana" │  ← sigue ahí,
│ (dirección)   └───────┘           └────┬─────┘  │   └───────┘    ahora inalcanzable
└──────────┘                             │        │
                                         │        └── nada apunta ya aquí
                                         ▼
                                    ┌───────┐
                                    │ "ANA" │  ← un objeto nuevo
                                    └───────┘
```

El objeto `"ana"` nunca se tocó. Lo que ocurrió va en tres pasos: primero se reservó en el heap la memoria para un segundo objeto, después se rellenó con los caracteres en mayúscula, y por último la variable pasó a apuntar a él. El primer objeto es ahora **inalcanzable**: ninguna variable apunta ya a él, ninguna guarda su dirección. En Java eso significa que es basura, y en tiempo de ejecución la JVM reclamará su memoria en algún momento sin que se lo pidas. Ese proceso de reclamación de memoria es la recolección de basura (_garbage collection_), y es el tema de [05-modelo-de-memoria.md](05-modelo-de-memoria.md). Lo que importa aquí es lo que cuesta cada `String` descartado: ocupa sitio en el heap hasta que alguien lo libere, y liberarlo cuesta tiempo de CPU, porque el recolector de basura tiene que ejecutarse para localizarlo y reclamar su memoria. Un objeto descartado suelto no se nota; mil creados dentro de un bucle sí, y ese es el motivo por el que más adelante hace falta `StringBuilder`.

> **¿Por qué querría James Gosling, el creador de Java, hacer esto a propósito?** La inmutabilidad parece solo un inconveniente hasta que ves las tres ventajas que tiene. Primero, **compartir un `String` con seguridad**: si pasas un `String` a un método, sabes con certeza que ese método no puede alterar tu copia, porque nada puede alterar ningún `String` — así que nunca hace falta entregarle una copia aparte por si acaso lo modifica. Segundo, **reutilización segura**: un **literal de String** es el texto que escribes entre comillas en el código, como `"ANA"`; en la práctica se dice solo _literal_. Si en dos sitios distintos de tu programa escribes `String a = "ANA";` y `String b = "ANA";`, Java no crea dos objetos: crea uno solo, y tanto la variable `a` como la variable `b` guardan la dirección en la memoria de ese único objeto, el que contiene `"ANA"`. Puede permitírselo precisamente porque nadie puede modificar ese objeto — si `a` pudiera cambiar su contenido, `b` cambiaría con él sin haberlo pedido. Eso ahorra bastante memoria en una aplicación real, donde el mismo literal aparece cientos de veces. Tercero, **un hash code estable**: un `String` es el tipo de clave más habitual en un `HashMap`, y una clave cuyo contenido pudiera cambiar tras insertarla dejaría de encontrarse. Un `HashMap` decide dónde guarda cada entrada a partir del **hash** de la clave: un número que el método `hashCode()` calcula a partir del contenido de esa clave, y que el mapa usa para elegir en qué posición la deja. Si el contenido de la clave cambia, su hash cambia, así que `get()` va a mirar a otra posición y no encuentra la clave ([10-colecciones.md](10-colecciones.md) explica por qué). Las tres ventajas desaparecen si un `String` se pudiera modificar. A cambio hay un coste: cada edición reserva memoria para un objeto nuevo. El resto de este archivo trata de saber cuándo ese coste importa de verdad.

> **"Inmutable" habla del objeto, no de la variable.** `name` es una variable normal y puedes reasignarla tantas veces como quieras; lo que no puede cambiar es el objeto al que apunta. Las dos ideas son independientes, y Java tiene una palabra clave aparte para bloquear la _variable_: `final`, que viste brevemente en [01-variables-tipos.md](01-variables-tipos.md). `final String name = "ana";` te da las dos cosas — una variable cuya dirección en la memoria ya no se puede cambiar, apuntando a un objeto que no se puede editar. También significa que `name = name.toUpperCase()` deja de compilar, porque esa línea reasigna la variable.

---

## El catálogo de métodos del día a día — y qué devuelve cada llamada

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basic Manipulations" — los mismos métodos con un ejemplo ejecutable cada uno.

Estos son los métodos que necesitas para leer código Java correctamente, que es la mayor parte de lo que haces al principio: abres un archivo de un proyecto real y te encuentras operaciones sobre `String` por todas partes. En el ejemplo, la **ficha** de un empleado — sus datos de alta: nombre, rol y horas semanales — llega como una única línea de texto. A una línea así se le llama _registro_ (en inglés _record_): una fila de datos sobre una misma cosa, con los campos separados por comas, tal y como sale de un CSV o de un fichero exportado.

Aquí tienes cada método por separado, para tenerlo como referencia. De cada uno importan tres cosas: qué hace, para qué lo usas de verdad, y qué tipo devuelve. Ese tipo es el que decide si puedes encadenar otra llamada al final: si el método devuelve `String`, sí se puede encadenar; si devuelve `int` o `boolean`, no se puede encadenar y ahí se acaba la cadena.

- **`length()`** → `int`. Devuelve cuántos caracteres tiene el texto, contando también los espacios.

  ```java
  "Ana Ruiz".length()     // 8  → la 'A', las siete siguientes… y el espacio del medio también cuenta
  "28001".length() == 5   // true → así compruebas que un código postal tiene los cinco dígitos
  ```

- **`strip()`** → `String`. Devuelve el texto sin espacios en blanco al principio ni al final. Si tiene espacios en blanco en medio, no los toca. Es el primer método que aplicas sobre cualquier texto que venga de un formulario o de un fichero, porque casi siempre trae espacios que nadie escribió a propósito.

  ```java
  "  Ana Ruiz  ".strip()   // "Ana Ruiz"     → se van los dos de delante y los dos de detrás
  "  Ana  Ruiz  ".strip()  // "Ana  Ruiz"    → los dos espacios de en medio siguen ahí
  ```

- **`isEmpty()`** → `boolean`. Devuelve `true` solo cuando el texto no tiene ningún carácter, es decir `""`. Un texto con un espacio ya no está vacío, y por tanto daría `false`.

  ```java
  "".isEmpty()     // true
  " ".isEmpty()    // false → tiene un carácter, el espacio
  "Ana".isEmpty()  // false
  ```

- **`isBlank()`** → `boolean`. Devuelve `true` para `""` y también para cualquier texto hecho solo de espacios, tabuladores o saltos de línea — por ejemplo `" "`.

  ```java
  "".isBlank()      // true
  " ".isBlank()     // true → solo tiene espacios
  "\t\n".isBlank()  // true → un tabulador y un salto de línea también son espacio en blanco
  "Ana".isBlank()   // false
  ```

- **`contains(...)`** → `boolean`. Responde si esa secuencia aparece en algún sitio dentro del texto, distinguiendo mayúsculas de minúsculas: busca la secuencia tal cual se la pasas. No te dice dónde, solo si está. Se usa para búsquedas y filtros simples.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.contains("DEVELOPER")  // true
  record.contains("MANAGER")    // false
  record.contains("developer")  // false → el texto lo lleva en mayúsculas
  ```

- **`startsWith(...)`** → `boolean`. Se usa para saber si un `String` empieza exactamente con la secuencia que le pasas. **`endsWith(...)`** → `boolean` se usa para saber si un `String` acaba exactamente con esa secuencia. La palabra importante en los dos es _exactamente_: cuentan cada carácter, los espacios incluidos, y distinguen mayúsculas de minúsculas igual que `contains`.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.startsWith("  Ana")  // true  → el texto empieza por dos espacios y luego "Ana"
  record.startsWith("Ana")    // false → empieza por un espacio, no por la 'A'
  record.startsWith("  ana")  // false → la caja también cuenta
  "informe.pdf".endsWith(".pdf")  // true → así se comprueba la extensión de un fichero
  ```

- **`indexOf(...)`** → `int`. Devuelve la posición del primer sitio donde aparece la secuencia, contando desde 0, o `-1` si no aparece en ninguna parte. Ese `-1` es la señal de "no encontrado", y hay que comprobarla antes de usar ese número, sea para lo que sea: cortar el texto, salir de un bucle o cualquier otra cosa.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.indexOf(",")   // 10 → la primera coma está en la posición 10
  record.indexOf(";")   // -1 → no hay ningún punto y coma en el texto
  ```

- **`toUpperCase()`** → `String`. Devuelve un `String` nuevo con todas las letras en mayúscula; **`toLowerCase()`** hace lo mismo, pero devuelve el texto en minúsculas. El texto original no cambia, como todo en esta clase. Se usa sobre todo para normalizar antes de comparar o de guardar.

  ```java
  "Ana Ruiz".toUpperCase()  // "ANA RUIZ"
  "Ana Ruiz".toLowerCase()  // "ana ruiz"
  ```

- **`replace(a, b)`** → `String`. Devuelve una copia con **todas** las apariciones de `a` cambiadas por `b`, no solo la primera.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.replace(",", " | ")   // "  Ana Ruiz | DEVELOPER | 38.5  " → cambia las dos comas por " | ", no solo la primera
  ```

- **`substring(inicio, fin)`** → `String`. Devuelve el trozo de texto que hay entre esas dos posiciones. Es el método con más trampa de todos y tiene su propia subsección aquí abajo para explicarlo.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.strip().substring(0, 8)  // "Ana Ruiz" → desde la posición 0 hasta la 7
  ```

- **`split(separador)`** → `String[]`. Parte el texto por el separador y devuelve un array con los trozos. Es lo que usas para partir una línea de un CSV. Un **CSV** (_comma-separated values_) es un fichero de texto donde cada línea es un registro y los valores van separados por comas, exactamente como el `record` del ejemplo: `split(",")` te devuelve esos valores sueltos, uno en cada posición del array, para que puedas trabajar con ellos por separado. También tiene su propia subsección aquí abajo, porque el separador no es lo que parece.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.strip().split(",")  // ["Ana Ruiz", "DEVELOPER", "38.5"] → los tres campos del registro
  ```

- **`equals(...)`** → `boolean`. Compara el **contenido** de dos textos, carácter a carácter y distinguiendo mayúsculas de minúsculas. Este es el que se usa para comparar textos en Java, siempre.

  ```java
  "Ana".equals("Ana")  // true
  "Ana".equals("ana")  // false → la 'A' mayúscula y la 'a' minúscula son caracteres distintos
  ```

- **`equalsIgnoreCase(...)`** → `boolean`. Lo mismo, pero tratando `A` y `a` como iguales, es decir, sin diferenciar mayúsculas de minúsculas. Lo usamos para comprobar emails, nombres de usuario y cualquier otro dato donde nadie escribe las mayúsculas de forma consistente.

  ```java
  "Ana@Mail.com".equalsIgnoreCase("ana@mail.com")  // true
  ```

- **`String.join(separador, ...)`** → `String`. Pega varios textos con el separador que le digas. Es la operación contraria a `split`: uno parte una línea en campos, el otro forma el `String` a partir de los textos que le pasemos. Fíjate en que el método se llama sobre la clase `String` y no sobre una variable, porque no opera sobre un texto concreto: los recibe todos como argumentos. Puedes pasarle los argumentos que quieras, no solo dos.

  ```java
  String.join(" - ", "Ana", "Ruiz")             // "Ana - Ruiz"
  String.join(",", "Ana Ruiz", "DEVELOPER", "38.5")  // "Ana Ruiz,DEVELOPER,38.5" → tres textos, y así se vuelve a montar la línea de CSV entera
  ```

- **`repeat(n)`** → `String`. Devuelve el texto repetido `n` veces. Sirve sobre todo para pintar separadores en consola sin escribir veinte guiones a mano.

  ```java
  "-".repeat(20)  // "--------------------"
  ```

El tipo que devuelve cada uno es lo que conviene memorizar, porque es lo que decide qué puedes hacer con el resultado. Devuelven `String` — y por eso se pueden encadenar, porque cada llamada entrega otro texto sobre el que volver a llamar — `strip()`, `toUpperCase()`, `toLowerCase()`, `replace()`, `substring()`, `repeat()` y `join()`: de ahí que puedas escribir `record.strip().toUpperCase().substring(0, 3)`. Devuelven `int` `length()` e `indexOf()`, y ahí termina la cadena: el resultado es un número, y un número no tiene detrás ningún método de `String` al que llamar. Devuelven `boolean` `isEmpty()`, `isBlank()`, `contains()`, `startsWith()`, `endsWith()`, `equals()` y `equalsIgnoreCase()`, que son los que sueles poner dentro de un condicional, porque `if (...)` necesita exactamente ese tipo. Y `split()` es el único que se sale de los tres: devuelve un array (`String[]`), así que lo que encadenes detrás ya son operaciones de array, no de texto.

> **`length()` cuenta unidades de código, no los caracteres que ve una persona.** Para cada nombre, email y rol que vayas a manejar, el número de unidades de código y el número de caracteres coinciden, así que puedes leer `length()` como "cuántos caracteres tiene el texto" y seguir adelante. La excepción es la misma que [01-variables-tipos.md](01-variables-tipos.md) ya te mostró con `char`: un emoji ocupa dos unidades de código, así que `"😀".length()` es `2`. Es el mismo hecho llegándote a través de `String` en vez de a través de `char`, y también es por lo que `substring` puede cortar un emoji por la mitad.

> **Nueve de estos métodos leen el `String` sin producir uno nuevo.** `length()`, `indexOf()` y las siete comprobaciones booleanas — `isEmpty()`, `isBlank()`, `contains()`, `startsWith()`, `endsWith()`, `equals()` y `equalsIgnoreCase()` — solo consultan el objeto que ya existe: recorren sus caracteres para responder una pregunta y devuelven un número o un `true`/`false`, sin reservar memoria para ningún objeto nuevo. Todos los métodos restantes — `strip`, `replace`, `substring`, `toUpperCase`, `toLowerCase`, `split`, `join`, `repeat` — construyen un objeto `String` nuevo, exactamente como describió la sección anterior. Esa es la razón de que las llamadas se escriban encadenadas: cada eslabón de la cadena trabaja sobre el objeto nuevo que devolvió el eslabón anterior.

### `substring` — el segundo índice queda excluido, y pasarte del final lanza excepción

`substring(begin, end)` toma los caracteres desde `begin` hasta `end`, **sin incluir** `end`. Por eso la longitud del substring que se genera siempre es `end - begin`. La clave para entender hasta dónde puede llegar `end` es que `end` no es una posición que se vaya a leer, sino el punto donde el recorte se detiene: `substring` copia los caracteres desde `begin` y para justo antes de `end`, así que el carácter que haya en `end` no se toca nunca. Por eso `end` puede valer 6 en `"Victor"`, que tiene 6 caracteres y cuyos índices van del 0 al 5, sin que exista ningún carácter en la posición 6: `substring(0, 6)` significa "para al llegar al final del texto", no "lee el carácter 6". Lo que sí falla es `substring(0, 7)`, porque ahí le pides que pare más allá del final, y esa es exactamente la comprobación que `substring` hace antes de copiar nada. `begin`, en cambio, sí es una posición que se lee — salvo cuando vale lo mismo que `end`, porque entonces no hay nada que copiar y el resultado es el string vacío `""`.

```java
String name = "Victor";

name.substring(0, 3)     // "Vic"    — índices 0, 1, 2. Tres caracteres: 3 - 0.
name.substring(3)        // "tor"    — un solo argumento significa "desde aquí hasta el final"
name.substring(6)        // ""       — empezar justo en length() es legal: no queda texto detrás, así que el resultado es un substring vacío
name.substring(3, name.length())  // "tor" — lo mismo escrito entero: length() es el valor máximo que puede tomar end
name.substring(0, 6)     // "Victor" — un índice final igual a length() es legal
name.substring(3, 3)     // ""       — begin y end iguales: no hay nada que copiar, sale el string vacío
name.substring(3, 1)     // 💥 lanza excepción — end queda por detrás de begin
name.substring(0, 10)    // 💥 lanza excepción — end se pasa del final del texto
```

Esa última línea no devuelve un string vacío ni uno truncado: lanza una excepción. En JavaScript esto no pasa, porque allí, si `end` supera la longitud del texto, `slice` y `substring` no lanzan nada: simplemente cortan hasta el final. `"Victor".slice(0, 10)` devuelve `"Victor"`. Java no hace eso: un índice que no es válido se rechaza, no se ajusta. Esta es la excepción que lanza, y su mensaje te dice dos cosas: el rango que pediste y la longitud que el texto tenía en realidad, que es además el valor máximo que podrías haberle pasado a `end`.

```
java.lang.StringIndexOutOfBoundsException: Range [0, 10) out of bounds for length 6
```

Estos son todos los casos en los que `substring` lanza esa excepción, sobre el mismo `"Victor"` de 6 caracteres:

| Llamada                              | Resultado | Por qué                                                                                                                       |
| ------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `substring(-1)` / `substring(-1, 3)` | 💥        | `begin` negativo: no hay ninguna posición antes de la 0                                                                       |
| `substring(7)` / `substring(0, 7)`   | 💥        | el índice se pasa de `length()`, que es el máximo permitido                                                                   |
| `substring(3, 1)`                    | 💥        | `end` queda por detrás de `begin`, así que la longitud saldría negativa                                                       |
| `substring(6)` / `substring(3, 3)`   | `""`      | está permitido y no lanza excepción: devuelve un string vacío, porque el rango está vacío, que no es lo mismo que estar fuera |

Las tres primeras filas lanzan `StringIndexOutOfBoundsException`. La cuarta no lanza nada, y está en la tabla porque es la que más se confunde con un error: pedir un rango vacío es legal. De las tres que sí fallan, lo único que hay que recordar es que ninguna se corrige sola: si el índice sale de `0..length()`, o el rango va hacia atrás, la llamada revienta en tiempo de ejecución.

### `split` — el separador que le pasas es una expresión regular

`split` es el método del catálogo cuya firma más confunde, y puede llegar a mentirte. Parece que recibe un carácter que se va a usar para separar el `String`, pero en realidad recibe una **expresión regular**: un carácter, o un conjunto de caracteres, con un significado concreto, que Java lee como un patrón y no como texto literal. El que hay que vigilar es el punto: dentro de una expresión regular `.` significa "cualquier carácter, el que sea". Para partir por un punto de verdad hay que escaparlo, y en el código Java se escribe con dos barras invertidas, `"\\."`.

```java
"38.5".split(",")     // ["38.5"]  → no se encontró ninguna coma, así que te devuelve el string entero en un array de 1 elemento
"a.b.c".split(".")    // []        → MAL: '.' coincidió con TODOS los caracteres, así que cada trozo quedó vacío
"a.b.c".split("\\.")  // ["a","b","c"] → BIEN: la barra invertida lo convierte en un punto literal
```

La línea del medio es la trampa: no lanza excepción, devuelve un array vacío, de **longitud 0**. Los caracteres que necesitan escaparse así son `. | ( ) [ ] { } ^ $ * + ? \` — y `|` pilla a la gente casi tanto como `.`, porque una barra vertical tiene toda la pinta de separador natural en un archivo de texto.

> **¿Dónde se aprenden las expresiones regulares como es debido?** Son un tema propio y no forman parte del alcance junior de Java; lo que necesitas aquí es saber que `split` y `replaceAll` reciben como argumento una expresión regular, mientras que `replace` no. `replaceAll` es la hermana de `replace` que sí interpreta patrones, y ahí está la diferencia: `record.replace(".", "-")` trata el punto como un punto literal y funciona bien; `record.replaceAll(".", "-")` reemplaza todos los caracteres del string, porque para el motor de expresiones regulares el punto los representa a todos. En caso de duda usa `replace`, y recurre a `replaceAll` solo cuando de verdad quieras un patrón.

> **`split` también descarta, en silencio, los trozos vacíos que quedan al final.** `"a,b,,c,,".split(",")` devuelve `["a", "b", "", "c"]`, y no `["a", "b", "", "c", "", ""]`. Si partes por cada una de las comas salen seis trozos: `"a"`, `"b"`, `""`, `"c"`, `""` y `""` — el `""` del medio es el hueco que dejan las dos comas seguidas, y los dos últimos son los que dejan las dos comas finales: uno es el hueco que hay entre esas dos comas, y el otro va desde la última coma hasta el final del texto, donde ya no queda nada. Java te devuelve solo las cuatro primeras posiciones: el hueco del medio sobrevive y los dos del final desaparecen. Eso es deliberado, y es lo que quieres al parsear una línea CSV con una coma final — parsear es leer un texto que tiene una estructura conocida y sacar de él los datos que lleva dentro, y en un CSV eso empieza por dividir la línea en campos, que son las columnas que forman el fichero. Pero también es una fuente real de bugs: si esperas seis columnas y la línea acaba con dos campos vacíos, el array te llega con cuatro columnas, y la primera línea de código que lea `campos[4]` revienta con `ArrayIndexOutOfBoundsException` sin que nada te haya avisado de que faltaban trozos. Para que el número de campos coincida siempre con el número de columnas hay que usar `split(",", -1)`: ese segundo argumento se llama `limit`, dice cuántos trozos quieres como máximo, y cualquier número negativo significa "sin límite, y no me quites nada del final" — no tiene por qué ser `-1`, es solo el que se escribe por costumbre. Llamar a `split` con un solo argumento equivale a `limit = 0`, que es "sin límite, pero quítame los vacíos finales": de ahí el comportamiento por defecto.

---

## `isEmpty()` e `isBlank()` — vacío y en blanco

> 📖 Docs: [Baeldung — Java Strip Methods](https://www.baeldung.com/java-string-strip-methods) → leer: "Comparing the Strip Methods vs the trim() Method" — y su subsección "The strip() Method vs the trim() Method".

Dos de los métodos que has visto arriba parecen intercambiables y no lo son: elegir uno u otro cambia **qué** estás validando. Con uno rechazas solo el campo que llega totalmente vacío; con el otro rechazas además el que llega con espacios. Son dos validaciones distintas, no dos formas de escribir la misma.

**`isEmpty()` es true para exactamente un valor: `""`, un String de longitud cero — una cadena de texto vacía, sin ningún carácter dentro, ni siquiera un espacio.**

**`isBlank()` es true para `""` _y_ para cualquier string hecho solo de espacios en blanco, como por ejemplo `"   "`** — espacios, tabuladores, saltos de línea.

```java
"".isEmpty()      // true       ""     está vacío
"".isBlank()      // true       ""     también está en blanco — todo string vacío está en blanco
"   ".isEmpty()   // false  ←   "   "  tiene longitud 3, así que NO está vacío
"   ".isBlank()   // true   ←   "   "  está en blanco
"\t".isEmpty()    // false      un tabulador es un carácter como cualquier otro
"\t".isBlank()    // true
"Ana".isBlank()   // false
```

El caso más habitual lo vas a ver en los campos de un formulario. Un usuario que deja un campo sin tocar envía `""` — vacío, y `isEmpty()` lo detecta. Un usuario que toca el campo, pulsa la barra espaciadora dos veces y sigue adelante envía `"  "`, y lo mismo hace cualquiera que pegue un valor con un tabulador perdido, o cuyo teclado del móvil añada un espacio tras el autocompletado. Ese valor tiene longitud 2 — o la longitud que sea, según cuántos espacios haya; lo que importa es que su longitud **no es cero** —, así que `isEmpty()` devuelve `false` y tu validación lo deja pasar. Resumido en una frase: si el campo llega vacío del todo, `isEmpty()` lo detecta; si llega con espacios que el usuario dejó sin querer, `isEmpty()` **no** lo detecta y el que hay que usar es `isBlank()`. **En código de validación, recurre a `isBlank()`; `isEmpty()` es para el caso concreto en el que te importa específicamente que la longitud sea cero**, como comprobar si un string construido a partir de una lista produjo algo de contenido, es decir, si produjo un texto o se quedó en nada.

> **Adelanto — Spring Boot:** vas a encontrarte este mismo par otra vez, como anotaciones en lugar de llamadas a método. `@NotEmpty` sobre un campo de un request rechaza `""` y deja pasar `"  "`; `@NotBlank` rechaza los dos. Son las mismas dos reglas con los mismos nombres, aplicadas automáticamente por Spring en cuanto llega la petición, sin que tú escribas ningún `if`. Qué anotación va en qué campo es una pregunta que se responde en las notas de Spring Boot.

### `strip()` frente a `trim()`

Entre los métodos de arriba se encuentra `strip()`, pero en tutoriales y en código antiguo vas a ver `trim()` haciendo lo mismo, así que te vas a encontrar los dos. Hacen el mismo trabajo — quitar espacios en blanco al principio y al final — y se diferencian en qué consideran _un espacio en blanco_, porque las dos definiciones vienen de épocas distintas.

`trim()` viene de las primeras versiones de Java, de cuando el lenguaje todavía no consultaba las tablas de Unicode para decidir qué cuenta como espacio en blanco. Números sí ha tenido siempre: cada carácter de un `String` se guarda como un número, el que le asigna Unicode — el estándar que asigna un número único a cada carácter que existe, letras, símbolos y emojis. Ese reparto está hecho de antemano, no es algo que el programa consulte al ejecutarse: el número **es** el carácter. Ese número es el **code point** del carácter, se escribe en hexadecimal con el prefijo `U+`, y el espacio normal, el de la barra espaciadora, es el `U+0020`.

Esa es justo la diferencia entre los dos métodos: `trim()` solo sabe comparar ese número, y `strip()` sí consulta la tabla. La regla de `trim()` es puramente numérica: quita del principio y del final todo carácter cuyo número sea menor o igual que `U+0020`, sin preguntarle a Unicode si ese carácter es de verdad un espacio en blanco. El tabulador y el salto de línea tienen números más bajos(QUE U+0020), así que los quita — pero por debajo de `U+0020` también hay caracteres de control que no son espacios en blanco, y esos también se los lleva. Y al revés: cualquier espacio cuyo número sea más alto que `U+0020` no lo toca, aunque en pantalla se vea exactamente igual que un espacio. `strip()`, añadido en Java 11, pregunta en cambio a `Character.isWhitespace()`, que consulta las tablas reales de Unicode:

```java
String em = " Ana ";      // U+2003 EM SPACE — espacio en blanco Unicode de verdad

em.length()          // 5
em.trim().length()   // 5  ← MAL: trim lo dejó tal cual, porque U+2003 > U+0020
em.strip().length()  // 3  ← BIEN: strip sabe que U+2003 es espacio en blanco
```

ASCII es el grupo de caracteres más básico que existe: las letras del alfabeto inglés sin acentos, los números y los signos de puntuación corrientes. Ocupan los primeros 128 números de Unicode, y ahí dentro está el espacio normal. Mientras el texto solo lleve caracteres de ese grupo, los dos métodos hacen exactamente lo mismo: `"   Ana   "` vuelve como `"Ana"` con cualquiera de ellos. La diferencia solo aparece con texto que vino de algún sitio real: un documento de Word, un PDF, un copia-pega sacado de una página web, un formulario rellenado desde el móvil. Ese texto suele traer espacios que no son el `U+0020` y que en pantalla se ven igual que uno normal:

- el **espacio em** (`U+2003`), un espacio que ocupa más ancho que el normal — tanto como la letra M, de ahí el nombre — y que usan Word y los PDF; es el mismo del ejemplo de arriba;
- el **espacio ideográfico** (`U+3000`), el que se usa al escribir en chino o japonés;
- el **espacio de no separación** (`U+00A0`), el que mete una página web entre dos palabras cuando no quiere que se partan en dos líneas distintas; con este ni siquiera `strip()` puede, y el aviso de más abajo explica por qué.

Sobre ninguno de los tres actúa `trim()`, porque los tres tienen un número más alto que `U+0020`. Ese es el motivo por el que se recomienda `strip()`: no cuesta nada extra de escribir y elimina una clase de bug que no puedes ver.

> **El único caso en el que `strip()` tampoco quita el espacio.** Hay un carácter que se escapa de los dos métodos: el espacio de no separación, `U+00A0`. Es el que genera un `&nbsp;` en HTML: un espacio en blanco escrito en el código de la página, con la particularidad de que el navegador no puede partir la línea por ahí. Cuando alguien copia un trozo de una página web y lo pega en un formulario, o cuando el propio navegador envía ese texto a tu backend, ese `&nbsp;` viaja como el carácter `U+00A0` y acaba dentro del `String` que recibe tu código Java. Sobre él, `Character.isWhitespace()` responde `false`, y no es un despiste: Unicode lo define como un espacio que **no** separa — su trabajo es justo el contrario, mantener dos palabras pegadas en la misma línea — y `isWhitespace()` solo dice que sí a los caracteres que separan. El resultado es que ni `trim()` ni `strip()` lo tocan, y tienes que quitarlo tú antes de limpiar: `input.replace(' ', ' ').strip()` cambia cada uno de esos espacios por un espacio normal, y ya el `strip()` se lo lleva.

> **`isBlank()` usa la misma regla moderna que `strip()`.** Las dos preguntan a `Character.isWhitespace()`, así que tienen exactamente el mismo comportamiento — incluido el `&nbsp;`: `" ".isBlank()` devuelve `false`, igual que `strip()` no lo quita — y las dos se comportan distinto de `trim()`. Esa coherencia no es casualidad — `isBlank()` y `strip()` llegaron juntos en Java 11 precisamente para reemplazar la pareja pre-Unicode. Trátalas como una sola actualización: `trim()`/`isEmpty()` es la pareja vieja, `strip()`/`isBlank()` es la que hay que escribir.

---

## Metiendo valores dentro de texto — `+` y `.formatted()`

> 📖 Docs: [Oracle Docs — `java.util.Formatter`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html) → leer: "Format String Syntax" y la tabla "Conversions" — la lista completa de qué puede ir después de un `%`.

Tienes un `Employee` con un campo `name` y otro `hours`, y quieres formar a partir de ahí una frase legible. La forma obvia es `+`, que pega texto y, cuando un lado no es texto, lo convierte :

```java
String name = "Ana";
int hours = 38;

String line = name + " logged " + hours + " hours";   // "Ana logged 38 hours"
```

Eso funciona y es lo normal para una expresión corta como esta. Deja de ser recomendable en cuanto la frase tiene cuatro o cinco huecos, porque las comillas y los signos `+` acaban superando al número de palabras que lleva la frase. `.formatted()` es la alternativa: escribes la frase de una vez, de una sola pieza, con **marcadores de posición** señalando dónde van los valores, y entregas los valores después.

```java
String line = "%s logged %d hours".formatted(name, hours);   // "Ana logged 38 hours"
```

Un marcador de posición es un `%` seguido de una letra que dice _qué tipo de valor va aquí_. Los tres que vas a usar:

- **`%s`** — aquí va un string. Acepta literalmente cualquier cosa, porque todo lo que hace es llamar a `toString()` sobre el valor, y todo objeto en Java tiene un `toString()` ([06-poo-clases.md](06-poo-clases.md) es donde escribes el tuyo propio).
- **`%d`** — aquí va un número entero (`int`, `long`, y sus tipos wrapper). Rechaza cualquier otra cosa.
- **`%f`** — aquí va un número decimal, y casi siempre quieres decir cuántos decimales: `%.2f` significa dos. `"Total: %.2f h".formatted(38.5)` da `"Total: 38,50 h"` o `"Total: 38.50 h"` según la configuración regional del ordenador.

**Los marcadores se asignan por posición: el primer valor va al primer marcador, el segundo al segundo, y así de izquierda a derecha. Ninguno se asigna por nombre.** Ese es todo el mecanismo, y también es todo el problema, porque nada comprueba que hayas puesto el orden correcto.

> **`.formatted()` es lo más parecido que tiene Java a un template literal de JavaScript.** `` `${name} logged ${hours} hours` `` y `"%s logged %d hours".formatted(name, hours)` hacen el mismo trabajo. La única diferencia real es que JS pone la variable _dentro_ del texto y Java pone un marcador ahí y las variables después.

### Por qué una cadena de formato rota sigue compilando

Intercambia los dos argumentos y el compilador no dice absolutamente nada:

```java
"%s logged %d hours".formatted(name, hours);    // BIEN — "Ana logged 38 hours"
"%s logged %d hours".formatted(hours, name);    // MAL  — compila, y luego explota en tiempo de ejecución
```

La razón está en la firma del método. `formatted` está declarado como `formatted(Object... args)` — acepta **cualquier número de argumentos de cualquier tipo**. Desde el punto de vista del compilador, las dos líneas de arriba son la misma llamada legal: un String, sobre el que invocas un método que recibe una lista de objetos, pasándole dos objetos. No tiene ningún motivo para objetar, porque la cadena de formato `"%s logged %d hours"` es, para el compilador, solo un trozo de texto como cualquier otro. Nada lee lo que hay dentro hasta que el programa se ejecuta: es ahí donde el formateador recorre la cadena, se encuentra el `%d`, coge el valor real que le pasaste en esa posición y descubre que no es un número.

Así que la comprobación pasa a tiempo de ejecución, y la segunda línea falla con:

```
java.util.IllegalFormatConversionException: d != java.lang.String
```

Léelo como "a `%d` le entregaron un `java.lang.String`". Fíjate en _qué_ marcador se quejó: `%s` se tragó el número `38` sin rechistar, porque `%s` solo llama a `toString()`, y un `Integer` tiene uno: si a un `%s` le llega un número, la conversión de número a texto se hace con ese `toString()` y por eso no falla nunca. El que da problemas es `%d`, porque tendría que hacer la conversión contraria — convertir en dígitos lo que le llega — y la conversión de un `String` a números no es posible. Así que un par intercambiado siempre revienta en el marcador _numérico_. El intercambio sí afecta a los dos marcadores — al `%s` le llegó el nombre cambiado por el número y al `%d` al revés —, pero solo uno de los dos protesta: `%s` acepta cualquier cosa en silencio, así que el mensaje de error te señala únicamente el `%d`.

Ese mismo comportamiento — que el fallo no aparezca hasta la ejecución — se repite con un especificador que directamente no existe, y cuando le pasas a `formatted()` un argumento menos de los que pide la cadena:

```java
"Total: %z".formatted(5);
// java.util.UnknownFormatConversionException: Conversion = 'z'

"%s and %s".formatted("only");
// java.util.MissingFormatArgumentException: Format specifier '%s'
```

Los dos son erratas que un compilador podría en principio detectar — y no lo hace, por la misma razón: la cadena de formato es un dato, y solo se examina cuando la línea se ejecuta. El compilador ve un `String` y una llamada a un método que acepta argumentos, comprueba que eso es legal, y no mira nada más: no entra a leer qué pone dentro de las comillas. Por eso el fallo aparece más tarde. Esa es la lección general, y no se aplica solo a `formatted()`. **Si una regla la comprueba el compilador, el error salta al compilar, siempre, antes de que publiques nada. Si la regla se comprueba en tiempo de ejecución, el error solo salta el día en que el programa pasa por esa línea.**

> **Por eso `%s` es la opción segura por defecto.** Acepta cualquier cosa, así que nunca puede producir un `IllegalFormatConversionException`. Usa `%d` y `%f` cuando de verdad necesites el comportamiento numérico y `%s` en todo lo demás. Y mantén las cadenas de formato cortas: cuanto más larga sea la frase, más marcadores hay que contar, y contar marcadores a ojo aumenta las probabilidades de equivocarte.

---

## Acumulando texto — cuándo `+` se convierte en la herramienta equivocada

> 📖 Docs: [Baeldung — StringBuilder and StringBuffer in Java](https://www.baeldung.com/java-string-builder-string-buffer) → leer: "Similarities" y "Differences" (con su subsección "Performance")
> 📖 [Oracle Docs — `java.lang.StringBuilder`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html) → lee la descripción de la clase: "no guarantee of synchronization"

`a + b` sobre dos Strings está bien. Lo que no está bien es `+=` dentro de un bucle, y la razón es la inmutabilidad: como un `String` no se puede modificar, cada iteración del bucle crea un objeto `String` nuevo en lugar de ampliar el que ya tenías.

> **Los tres fragmentos de código que se muestran en los ejemplos de abajo pertenecen a archivos posteriores.** `for (Employee e : employees)` es un **bucle**: ejecuta el bloque una vez por cada elemento de `employees`, con `e` guardando el actual — se explica en detalle en [03-flujo-de-control.md](03-flujo-de-control.md). `List<Employee>` es una **lista de empleados**, la forma normal en la que Java guarda muchos valores de un tipo, y los corchetes angulares dicen qué tipo hay dentro — [09-genericos.md](09-genericos.md) explica los corchetes y [10-colecciones.md](10-colecciones.md) la lista. Y `e.getName()` es una **llamada a un método sobre un objeto**: le pide a ese empleado concreto su nombre, que es [06-poo-clases.md](06-poo-clases.md). Ninguno de estos tres conceptos es objeto de estudio en esta sección, pero los necesitas para entender el problema que plantea la inmutabilidad al ir creando Strings dentro de un bucle.

Tienes una lista de empleados y quieres un `String` que muestre cada empleado en una línea. El primer intento natural:

```java
// MAL — un objeto String nuevo por cada iteración
String report = "";
for (Employee e : employees) {          // supón que la lista tiene 1000 entradas
    report += e.getName() + "\n";
}
```

`report += ...` no puede editar `report`, porque ningún `String` se puede editar. Así que en cada iteración Java **reserva un objeto `String` nuevo** que contiene todo lo acumulado hasta ahora _más_ la línea nueva, copia todos esos caracteres dentro, y vuelve a apuntar `report` hacia él. El objeto anterior queda abandonado:

```
iteración 1:   "Ana\n"                        ← abandonado tras la iteración 2
iteración 2:   "Ana\nBeto\n"                  ← abandonado tras la iteración 3
iteración 3:   "Ana\nBeto\nCarla\n"           ← abandonado tras la iteración 4
    ...        (996 objetos abandonados más)
iteración 1000: el único que te quedas
```

En este ejemplo se ven los dos problemas. El primero es la creación de **999 objetos desechables**, cada uno de los cuales el recolector de basura tiene que reclamar.

El segundo es la **copia del contenido del objeto anterior dentro del nuevo**, y es el que se pasa por alto. Recuerda qué hace exactamente cada iteración: no añade la línea nueva al objeto que ya existe — no puede, es inmutable —, sino que reserva un objeto nuevo y escribe dentro **todo lo que había en el objeto anterior**, y a continuación le suma los caracteres de la línea nueva. Así que la iteración 500 no copia un nombre: copia las 499 líneas ya acumuladas y luego añade la 500. La 501 copia 500 líneas. La 502 copia 501.

```
iteración   2 → copia    1 línea
iteración   3 → copia    2 líneas
iteración 500 → copia  499 líneas
iteración 1000 → copia 999 líneas
                 ───────────────────
     total       ≈ 500.000 líneas copiadas para producir 1.000
```

Ese total crece con el _cuadrado_ del número de elementos sobre los que iteras: si duplicas los empleados, el trabajo de copia se multiplica por cuatro. Con diez elementos no se nota nada; con diez mil tienes un endpoint visiblemente lento.

`StringBuilder` es la respuesta: un objeto que sí se puede modificar, sobre el que vas añadiendo texto sin crear un objeto nuevo en cada vuelta. Guarda un **buffer mutable** — un bloque de memoria que tienes permiso de modificar — y `.append()` escribe dentro de él. Funciona como una pizarra sobre la que sigues escribiendo, en lugar de una hoja nueva copiada desde cero por cada palabra. Cuando terminas, `.toString()` produce el `String` final.

```java
// BIEN — un solo objeto, se va añadiendo en el sitio
StringBuilder sb = new StringBuilder();
for (Employee e : employees) {
    sb.append(e.getName()).append("\n");   // append devuelve el propio builder, así que las llamadas se encadenan
}
String report = sb.toString();             // exactamente un String creado, al final
```

> **El buffer tiene un tamaño fijo, y cuando se llena hay que reservar otro más grande.** Al crear un `StringBuilder`, Java reserva un sitio en la memoria con capacidad para un número fijo de caracteres. Cuando le añades más de los que caben ahí, reserva un sitio nuevo más grande y copia dentro el contenido que ya tenía. Así que copias hay: no son literalmente cero. La diferencia con `+=` está en cuántas veces pasa: cada buffer nuevo tiene aproximadamente el doble de capacidad que el anterior, así que mil `append` provocan unos pocos cambios de buffer en lugar de mil copias. Si sabes de antemano cuántos caracteres va a tener el texto final puedes evitar la creación de esos buffers intermedios pasándole ese número como argumento al crearlo. Ese argumento se llama **capacidad inicial** y se cuenta en caracteres, no en bytes: `new StringBuilder(4096)` reserva de golpe sitio para 4096 caracteres. No es un límite — si te pasas, el buffer crece igual que antes —, solo evita los buffers intermedios. No se suele aplicar.

### Regla de cuándo usar `+` y cuándo `StringBuilder`

**Usa `+` para una expresión única. Usa `StringBuilder` cuando la acumulación se repite.** La diferencia entre las dos no es de estilo: en una el compilador optimiza el trabajo por ti y en la otra no puede:

```java
String label = name + " (" + role + ")";   // BIEN — una expresión, una sentencia, usa +
```

Para esa línea el propio compilador construye el resultado de forma eficiente en un solo paso; escribir un `StringBuilder` para esto sería más largo, más feo y no más rápido. En el momento en que la acumulación se reparte a lo largo de **iteraciones de un bucle**, el compilador ya no puede ayudarte — no puede ver que las mil sentencias separadas son una sola operación lógica — y la elección pasa a ser tuya.

> **No vayas a cambiar todos los `+` que ya tengas escritos.** Esta optimización importa en bucles sobre colecciones que pueden crecer. Unir con `+` los tres campos de un objeto para devolverlos como una sola frase desde su `toString()`, o juntar un texto fijo con un valor para escribir una línea de log, reserva un objeto extra, pero no afecta al rendimiento y no lo vas a notar. Recurrir a `StringBuilder` en todas partes hace el código más difícil de leer a cambio de nada. Y cuando lo que estás uniendo es un conjunto de elementos con un separador entre ellos, hay herramientas mejores que `+` y que `StringBuilder`: `String.join(", ", names)` cuando ya tienes la colección creada — una `List`, un `Set` —, y `Collectors.joining(", ")` para un stream — la versión de stream está en [12-streams-lambdas.md](12-streams-lambdas.md).

### `String`, `StringBuilder`, `StringBuffer`

Hay un tercer tipo en esta familia, `StringBuffer`, y te lo vas a encontrar en código antiguo. La tabla compara los tres con las dos preguntas que deciden cuál toca usar: si el objeto se puede modificar, y si se puede usar sin riesgo desde varios hilos a la vez — lo que se llama ser _thread-safe_, que al final de la sección se explica. La última columna dice para qué se usa cada uno:

|                 | ¿Modificable? | ¿Thread-safe? | Cuándo usarlo                                   |
| --------------- | ------------- | ------------- | ----------------------------------------------- |
| `String`        | No            | Sí            | La mayoría de los casos — leer, pasar, comparar |
| `StringBuilder` | Sí            | No            | Construir texto en un bucle (la opción rápida)  |
| `StringBuffer`  | Sí            | Sí            | Construcción multihilo (raro)                   |

`String` es thread-safe _porque_ es inmutable: no hay nada que corromper si nada puede cambiar.

`StringBuffer` es el builder antiguo, y es thread-safe porque se protege con **bloqueos** (_locking_): en cada llamada a `append` bloquea el objeto, hace el cambio y lo vuelve a desbloquear, de forma que mientras un hilo está escribiendo ningún otro puede tocarlo. Eso es justo lo que impide que dos hilos escriban a la vez y dejen el buffer a medias — pero el bloqueo se paga en **todas** las llamadas, también cuando no hay ningún otro hilo.

`StringBuilder` (Java 5) es esa misma clase sin los bloqueos: por eso es más rápido, y no es thread-safe. Y es el que quieres, porque el caso normal es un builder creado y terminado dentro de un mismo método, donde solo un hilo lo toca. **Escribe `StringBuilder`; reconoce `StringBuffer` cuando lo veas en código antiguo.**

> **Qué significa "thread-safe", y por qué importa en una API de Spring Boot.** Un **hilo** (_thread_) es una tarea que se ejecuta en paralelo a otras dentro del mismo programa. Una API REST atiende cada petición HTTP entrante en su propio hilo — por eso pueden usarla varios usuarios a la vez, en lugar de tener que ponerlos en cola. La regla es: un `StringBuilder` declarado como **variable local dentro de un método** se crea de cero en cada llamada, así que pertenece exactamente a un hilo, y no hace falta pensar en bloqueos porque existe dentro de un único hilo. Un `StringBuilder` guardado como **campo de un objeto compartido** sí es un problema: en cuanto lleguen dos peticiones a la vez, los dos hilos escribirán sobre el mismo buffer y el texto saldrá mezclado.

> **Adelanto — Spring Boot:** el fragmento de abajo está anotado con `@Service`, que todavía no has estudiado. Marca una clase como un servicio que Spring crea **una sola vez** al arrancar y deja disponible para cualquier parte de la aplicación donde se necesite — un _singleton_, una instancia compartida para toda la aplicación. Eso hace peligroso el ejemplo: existe un solo objeto, y cada hilo de cada petición escribe en él. Vas a implementar `@Service` en las notas de Spring Boot; aquí solo prepara el terreno.

```java
// MAL — un builder compartido por cada hilo de petición
@Service
public class ReportService {
    private StringBuilder sharedBuilder = new StringBuilder();   // ← todos los hilos escriben aquí
}

// BIEN — local al método, solo existe para esta llamada
public String buildReport(List<Employee> employees) {
    StringBuilder sb = new StringBuilder();                      // ← solo este hilo lo ve
    for (Employee e : employees) {
        sb.append(e.getName()).append("\n");
    }
    return sb.toString();
}
```

La versión `MAL` se comporta bien con un solo usuario, así que no falla en pruebas: solo produce texto mezclado cuando llegan peticiones a la vez, es decir, en producción. El hábito que evita el problema: **un builder es siempre una variable local, nunca un campo de una clase.**

> **La otra mitad de esta historia, la de la recolección de basura, se ve más adelante.** [05-modelo-de-memoria.md](05-modelo-de-memoria.md) vuelve a este mismo bucle una vez explicados el heap y el recolector de basura, y detalla lo que le cuesta al programa dejar "999 objetos abandonados".

---

## Bloques de texto — texto multilínea sin el escapado

> 📖 Docs: [Baeldung — Java Text Blocks](https://www.baeldung.com/java-text-blocks) → leer: "Usage" para la sintaxis y "Indentation" para la regla del espacio en blanco incidental.

Incrustar un trozo de JSON o SQL en código fuente Java solía ser doloroso, porque cada comilla dentro del contenido había que escaparla con una barra invertida y cada salto de línea había que escribirlo como `\n`:

```java
// MAL — esto es lo que escribías antes de Java 15
String json = "{\n  \"name\": \"Ana\",\n  \"role\": \"DEVELOPER\"\n}";
```

Eso no se puede leer, no se puede pegar en Postman para comprobarlo, y una sola barra invertida que falte es un error de compilación. Un **bloque de texto** es un literal String delimitado por tres comillas dobles, y dentro las comillas y los saltos de línea son simplemente ellos mismos:

```java
// BIEN — un bloque de texto
String json = """
        {
          "name": "Ana",
          "role": "DEVELOPER"
        }""";
```

Dos reglas de sintaxis que impone el compilador. El `"""` de apertura tiene que ir seguido de un **salto de línea** — el contenido no puede empezar en la misma línea — y si haces la prueba te sale este error, que nombra la regla directamente:

```java
String s = """hello""";   // MAL — error: illegal text block open delimiter sequence, missing line terminator
```

El `"""` de cierre admite dos posiciones: al final de la última línea de contenido, como en el JSON de Ana, o en una línea propia. La posición que elijas decide cuántos espacios de indentación acaban dentro del string, y el siguiente bloque explica por qué.

> **¿Qué pasa con los espacios de indentación del código?** En el JSON de Ana, cada línea del bloque empieza con ocho espacios: están ahí solo para que el texto quede alineado con el resto del código del método. Esos ocho espacios no llegan al string. Si imprimes `json`, la `{` sale pegada al margen izquierdo (la columna cero), no desplazada ocho posiciones:
>
> ```
> {
>   "name": "Ana",
>   "role": "DEVELOPER"
> }
> ```
>
> Ocurre porque el compilador elimina lo que la especificación llama **espacio en blanco incidental** (_incidental whitespace_), en tres pasos:
>
> 1. Mira cada línea no vacía del bloque _más la línea que contiene el `"""` de cierre_.
> 2. Cuenta los espacios iniciales de cada una y se queda con el menor. Aquí `{` y `}"""` tienen ocho, y las líneas de `"name"` y `"role"` tienen diez, así que el mínimo es ocho.
> 3. Quita exactamente esos ocho espacios del principio de cada línea.
>
> Así, la indentación que añadiste para que el código fuente se lea bien desaparece, y la que añadiste _a propósito_ — los dos espacios extra antes de `"name"` — sobrevive, porque va más allá del mínimo.
>
> La consecuencia que hay que recordar: **mover el `"""` de cierre cambia el string.** Ponlo en una línea propia en la columna cero y la indentación mínima pasa a ser cero, así que los ocho espacios reaparecen de golpe dentro de tu JSON. Esa es la única sorpresa de los bloques de texto que merece la pena saber.
>
> Compara las dos versiones. Solo cambia dónde está el `"""` de cierre:
>
> ```java
> // A — cierre al final de la última línea: la línea mínima tiene 8 espacios
> String jsonA = """
>         {
>           "name": "Ana",
>           "role": "DEVELOPER"
>         }""";
>
> // B — cierre en una línea propia, en la columna cero: la línea mínima tiene 0 espacios
> String jsonB = """
>         {
>           "name": "Ana",
>           "role": "DEVELOPER"
>         }
> """;
> ```
>
> Y esto es lo que guarda cada variable (los `·` marcan los espacios que quedan dentro del string):
>
> ```
> jsonA:                  jsonB:
> {                       ········{
> ··"name": "Ana",        ··········"name": "Ana",
> ··"role": "DEVELOPER"   ··········"role": "DEVELOPER"
> }                       ········}
>                         (salto de línea final)
> ```
>
> En A se quitan ocho espacios de cada línea y el string termina justo en `}`. En B el mínimo es cero, así que no se quita nada: cada línea conserva sus ocho o diez espacios, y además el string termina con un salto de línea después de `}`, porque el `"""` ya no está en la misma línea que la llave.

**El tipo sigue siendo `String`.** Un bloque de texto es una forma distinta de _escribir_ un literal, no un tipo de valor nuevo — así que cada método funciona sobre él. Nada sobre la inmutabilidad cambia tampoco.

Dónde recurres realmente a uno: el JSON de ejemplo que un test envía como body de una petición para comprobar un endpoint, una plantilla de email en HTML, y sobre todo una consulta SQL o JPQL multilínea. Esta última es código real en el proyecto 07 — `TimeEntryRepository` escribe como bloque de texto cada consulta que genera los informes de horas, y es la única razón por la que un `SELECT` de cinco líneas es legible dentro de una interfaz Java:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java
@Query("""
        SELECT te.project.id AS projectId, te.project.name AS projectName, round(SUM(te.hours), 2) AS totalHours, te.project.active AS active
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.id, te.project.name, te.project.active
        ORDER BY SUM(te.hours) DESC, te.project.name ASC
        """)
List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);
```

> **Adelanto — Spring Boot:** `@Query` y `@Param` pertenecen a Spring Data JPA y se cubren en las notas de Spring Boot. Aquí lo único que hacen es entregar ese texto a la capa de base de datos. La intención del fragmento es ver el uso de un bloque de texto como literal: el texto de la consulta es un `String` normal, escrito a lo largo de cinco líneas sin ningún `\n` ni comillas escapadas. Escrita a la manera pre-Java-15, esa consulta sería una única línea ilegible, repleta de barras invertidas

---

## Conversión de texto a número y de número a texto

> 📖 Docs: [Oracle Docs — Converting Between Numbers and Strings](https://docs.oracle.com/javase/tutorial/java/data/converting.html) → leer las dos mitades: "Converting Strings to Numbers" y "Converting Numbers to Strings".

Todo dato que tu programa no escribe él mismo, sino que recibe de otro sitio (el navegador, un archivo, la terminal, otro servidor), llega como texto. Estos son los casos que te vas a encontrar:

- **Una variable de ruta de URL** (_path variable_): la parte de la URL que cambia de una petición a otra para identificar un recurso concreto. En `GET /projects/42`, el `42` es una variable de ruta, y llega a tu controlador como el texto `"42"`.
- **Un campo de un formulario**: lo que el usuario escribe en un `<input>`, aunque sea su edad.
- **Una columna de un CSV**: cada valor de un archivo de texto separado por comas, como `Ana,38.5`.
- **Un argumento de línea de comandos**: lo que escribes detrás del nombre del programa al lanzarlo desde la terminal. En `java Main 10`, el `10` le llega a `main(String[] args)` como `args[0]`, que es el texto `"10"`.
- **Un claim de un JWT**: cada dato que viaja dentro del token de autenticación, como el id del usuario o su rol. El token es texto, así que sus claims también lo son.

Todos son `String`, incluso cuando el contenido parece ser un número. Así que la conversión de texto a número y de número a texto ocurre con mucha frecuencia.

### Texto → número

Ya te has encontrado con esta conversión en [01-variables-tipos.md](01-variables-tipos.md), con `Integer.parseInt` y `Integer.valueOf`. Ahí lo que importaba era el tipo que devuelve cada método: un `int` primitivo o un objeto `Integer`. Aquí lo que importa es el texto que les pasas. Ese texto no lo has escrito tú: llega de una petición, un formulario o un archivo, así que puede venir vacío, con espacios o con letras. Por eso esta sección se centra en qué pasa cuando el texto no es un número válido.

Cada tipo numérico tiene su clase wrapper, y esa clase ofrece dos métodos estáticos para pasar de texto a número:

- **`parseXxx(String)`** — devuelve el primitivo: `Integer.parseInt`, `Long.parseLong`, `Double.parseDouble`.
- **`valueOf(String)`** — devuelve el objeto wrapper: `Integer.valueOf`, `Long.valueOf`, `Double.valueOf`.

```java
int hours   = Integer.parseInt("38");     // 38  → un int, el primitivo
Integer h2  = Integer.valueOf("38");      // 38  → un Integer, el objeto
long userId = Long.parseLong("1042");     // el mismo par existe para long, double, boolean...
```

La diferencia entre `parseInt` y `valueOf` es solo el tipo de retorno — primitivo frente a objeto wrapper — que es la distinción que trazó [01-variables-tipos.md](01-variables-tipos.md): un primitivo guarda el valor directamente y nunca puede ser `null`, un wrapper es un objeto y por tanto puede ser `null` y puede vivir dentro de una `List` o un `Map`. Recurre a `parseInt` cuando quieras un número con el que calcular, y a `valueOf` cuando el valor tenga que ser anulable o vivir en una colección.

Los dos lanzan lo mismo cuando el texto no es un número:

```java
Integer.parseInt("abc");
// java.lang.NumberFormatException: For input string: "abc"
```

Lo que cuenta como "no es un número" es más estricto de lo que imaginarías. `"abc"` obviamente. Pero también `""`, también `null`, también `"38.5"` (eso es un decimal, no un `int`), y también **`"38 "` con un espacio al final** — `parseInt` no hace ningún trimming en absoluto:

```java
Integer.parseInt("38 ");
// java.lang.NumberFormatException: For input string: "38 "
```

Lo cual cierra el círculo con la sección anterior: a cualquier número que venga del usuario hay que aplicarle `strip()` antes de parsearlo, porque el espacio que añadió un teclado de móvil es invisible en el log y fatal para el parseo.

### `NumberFormatException` es _unchecked_ — y qué significa eso hoy

`NumberFormatException` es una excepción **unchecked**, y la consecuencia práctica es corta: **el compilador no te obliga a manejarla, y no te obliga a declarar que tu método puede lanzarla.** La línea `Integer.parseInt(input)` compila limpiamente por sí sola, sin `try`, sin warning, y sin nada en IntelliJ que sugiera que puede fallar. Compáralo con leer un archivo, que Java _sí_ te obliga a manejar antes de dejarte compilar — viste ese contraste en [00-intro-java.md](00-intro-java.md).

Así que la responsabilidad es enteramente tuya. Siempre que el texto venga de fuera de tu programa, esta llamada necesita o un `try/catch` alrededor o validación por delante. Sin eso, un usuario escribiendo `id=abc` en una URL se convierte en una excepción no capturada y una respuesta 500 — que es la forma más habitual con diferencia en la que se rompe un endpoint REST junior.

> **Por qué el modelo completo espera a [11-excepciones.md](11-excepciones.md).** "Unchecked" es una mitad de una regla sobre _dos_ tipos de excepción, y la regla solo tiene sentido una vez que sabes cómo viaja una excepción, dónde se puede capturar, y qué pinta tiene la jerarquía de clases debajo de `Exception` — porque checked frente a unchecked es literalmente una pregunta de en qué rama de esa jerarquía se sienta una clase. La entrada 11 construye todo eso y luego resuelve el par en un solo sitio. Lo que necesitas aquí es el hecho operativo: nada te va a recordar que `parseInt` puede fallar, así que tienes que recordarlo tú.

### Número → texto

La dirección inversa tiene tres formas de escribirse, y una de ellas es más segura que las otras:

```java
int hours = 38;

String a = String.valueOf(hours);      // "38" — funciona para cualquier tipo, incluidos objetos y null
String b = Integer.toString(hours);    // "38" — la propia conversión del número
String c = "" + hours;                 // "38" — funciona, pero no dice nada sobre la intención
```

`String.valueOf(x)` es la que hay que usar por defecto, y la razón es `null`. `valueOf` es un método **estático** de `String` — lo llamas sobre la clase, y el valor entra como argumento — así que un argumento nulo es solo un valor que inspecciona, y te devuelve el string de cuatro caracteres `"null"`. `x.toString()` es un método de **instancia**: llamarlo significa pedirle al objeto _en_ `x` que se describa a sí mismo, y si `x` es null no hay ningún objeto ahí al que preguntarle:

```java
Employee e = null;

String s1 = String.valueOf(e);   // "null" — sin fallo; valueOf comprueba null internamente
String s2 = e.toString();        // 💥 NullPointerException — no hay nada ahí sobre lo que llamar a un método
```

Ese es todo el argumento. Cuando el valor con certeza no es null — un `int` primitivo no puede serlo — los dos son equivalentes y es cuestión de gusto. Cuando podría serlo, `String.valueOf` degrada a un output legible mientras `toString()` tumba el request. En una línea de log o un mensaje de error, donde que el valor sea null es exactamente el caso que estás intentando diagnosticar, `valueOf` es la única opción sensata.

> **El único sitio donde `String.valueOf` te muerde de vuelta.** Escribir `String.valueOf(null)` con un literal `null` a secas **no** devuelve `"null"` — lanza una `NullPointerException`. La causa es que `String.valueOf` está sobrecargado muchas veces (`Object`, `char[]`, `int`, `boolean`…), y cuando el argumento es un `null` a secas el compilador elige la sobrecarga más específica que encaja, que es `char[]` — y esa sobrecarga lee inmediatamente la longitud del array. El mensaje de error incluso lo dice así: `Cannot read the array length because "value" is null`. Solo pasa con un `null` literal escrito en el código fuente, nunca con una variable _nula_, cuyo tipo declarado resuelve la sobrecarga correctamente. Si alguna vez lo necesitas de verdad, `String.valueOf((Object) null)` te da `"null"`.

El proyecto 07 recorre este viaje de ida y vuelta en las dos direcciones, en `JwtUtil`. El claim `subject` de un JWT está definido como texto, así que el id del usuario tiene que renderizarse al salir y parsearse al volver a entrar:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/JwtUtil.java
.subject(String.valueOf(userId))                          // Long → String, cuando se emite el token

return Long.valueOf(parseClaims(token).getSubject());     // String → Long, cuando se lee el token
```

Esa segunda línea es territorio de `NumberFormatException` por diseño: un token cuyo subject no es un número — un token antiguo de antes de que el claim guardara un id, o uno que alguien manipuló — falla ahí en lugar de aceptarse en silencio. Lo cual es el comportamiento correcto, y un buen ejemplo de una conversión que _también_ es una validación.

---

## Comparar dos Strings — y la única pregunta que este capítulo se niega a responder

> 📖 Docs: [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → leer: las entradas `equals(Object)` y `equalsIgnoreCase(String)` en la lista de métodos — las dos se definen en términos de _la secuencia de caracteres_, nunca del objeto que los contiene.

Para comparar contenido, la regla es corta y puedes aplicarla hoy mismo:

```java
name.equals("Ana")                  // BIEN — compara los caracteres reales
name.equalsIgnoreCase("ana")        // BIEN — lo mismo, ignorando mayúsculas/minúsculas
name == "Ana"                       // MAL — nunca uses == para comparar texto
```

`equals()` compara carácter a carácter y responde la pregunta que querías hacer. `equalsIgnoreCase()` hace lo mismo tratando `'A'` y `'a'` como idénticos, que es lo que quieres para un email, un nombre de usuario, o un nombre de rol que llega desde un formulario. **Usa `equals` para contenido, siempre; `equalsIgnoreCase` cuando las mayúsculas no formen parte de la identidad.**

> **Por qué la explicación de `==` espera a [06-poo-clases.md](06-poo-clases.md).** Ya sabes por el diagrama del principio de este archivo que una variable `String` guarda una dirección, así que `==` compara dos direcciones en lugar de dos trozos de texto — pero saber _eso_ no es lo mismo que entenderlo, y el entendimiento necesita una maquinaria que este capítulo no tiene. Necesita el modelo de objetos: qué _es_ realmente `equals` (un método que toda clase hereda), qué hace su versión heredada, y cómo una clase la reemplaza para comparar contenido en vez de direcciones. También necesita la razón por la que `==` sobre dos Strings a veces devuelve `true` y te engaña, que es un hecho sobre cómo Java almacena los literales y no sobre el texto en absoluto. La entrada 06 construye las clases primero, luego define igualdad de identidad frente a igualdad de valor una vez, y resuelve juntos `String ==`, `==` de wrappers y `Objects.equals` — donde se explican unos a otros. Memorizar la regla aquí y encontrarte el mecanismo allí es el orden correcto; al revés te deja sosteniendo una regla sin nada debajo, que es el tipo de conocimiento que se derrumba en la primera pregunta de seguimiento de una entrevista.

---

## Lo que esto desbloquea

Ya puedes manejar las dos cosas de las que está hecho todo valor en un programa Java: los números, cuya representación decide su aritmética, y el texto, cuya inmutabilidad decide todo lo demás. Puedes leer la API cotidiana de `String`, validar input que llega en blanco en vez de vacío, construir una línea de informe sin generar mil objetos desechables, incrustar una consulta sin escaparla, y mover un valor a través de la frontera texto/número en las dos direcciones sabiendo exactamente dónde puede fallar.

Lo que todavía no puedes hacer es decidir nada por ti mismo. Aparte de los dos bucles que este archivo tomó prestados para construir el argumento de `StringBuilder` — y prestado es la palabra correcta, porque nada aquí los explicó — cada línea hasta ahora se ejecuta exactamente una vez, de principio a fin, en el orden en que está escrita: un programa que evalúa expresiones pero nunca _elige_ entre ellas, y que repite un bloque solo donde alguien te entregó el bucle. [03-flujo-de-control.md](03-flujo-de-control.md) es donde eso cambia: `if` para elegir qué líneas se ejecutan según un valor, `for` y `while` para ejecutar un bloque tantas veces como pida el dato. Retoma el mismo `Employee` y las mismas horas semanales, y empieza a hacerles preguntas.
