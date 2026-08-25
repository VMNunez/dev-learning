# Cadenas de texto (Strings)

> 📖 [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basics" y "String Basic Manipulations" para el catálogo de métodos
> 📖 [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → la lista completa de métodos, para cuando necesites la firma exacta

[01-variables-tipos.md](01-variables-tipos.md) le hizo la misma pregunta a cada valor: *¿cómo está representado, y qué obliga esa representación?* Para los números, la respuesta iba de bits — un `int` guarda 32 de ellos, por eso se desborda, y un `double` almacena una fracción binaria, por eso no puede contener `0.1`. Ahora esa misma pregunta va dirigida al tipo de valor que tocas literalmente en cada petición que llega a una aplicación web: un nombre de usuario, un cuerpo JSON, una ruta de URL, una línea de log, una consulta SQL. Todo eso es texto, y en Java todo eso es `String`.

La respuesta tiene una forma completamente distinta. Un `String` no es un primitivo y no es un patrón de bits sobre el que puedas razonar directamente — es un **objeto**, y un objeto que **no se puede cambiar después de creado**. Ese único hecho es el capítulo entero. Explica por qué `name.toUpperCase()` parece no hacer nada, por qué pegar texto dentro de un bucle es el clásico error de rendimiento del junior, por qué tiene que existir siquiera una clase llamada `StringBuilder` — y, más adelante, en [06-poo-clases.md](06-poo-clases.md), por qué `==` termina comparando algo completamente distinto de lo que crees.

Esta es la ruta que sigue el archivo. Empieza por la **inmutabilidad**, porque cada sección posterior es una consecuencia de ella. Luego el **catálogo de métodos del día a día**, para que puedas leer código Java normal, seguido de los dos sitios en los que ese catálogo te engaña sin avisar: la diferencia entre **vacío y en blanco**, y la diferencia entre `trim()` y `strip()`. Después las dos formas de **meter valores dentro de texto** — `+` y `.formatted()` — y la única forma de **acumular** texto sin generar basura, `StringBuilder`. Luego los **bloques de texto**, la forma moderna de incrustar un trozo de JSON o SQL. Después el viaje de ida y vuelta **entre texto y números**, que es donde nacen la mayoría de los errores 500 en una API REST junior. Y cierra con la operación que este capítulo se niega deliberadamente a explicar: comparar dos Strings.

**Un mismo ejemplo recorre todo el archivo.** Estás construyendo una línea para un informe de horas: un `Employee` tiene un `name`, un `role`, y un número de `hours` registradas esta semana, y quieres convertir eso en texto legible y viceversa. `Employee` es el mismo pequeño mundo que usan [03-flujo-de-control.md](03-flujo-de-control.md), [06-poo-clases.md](06-poo-clases.md) y [10-colecciones.md](10-colecciones.md), así que solo tienes que fijarte en lo que añade la operación *nueva*.

---

## Inmutabilidad — el hecho del que sale todo lo demás en esta página

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basics" — y fíjate en la palabra *immutable* en el primer párrafo; el resto de esta sección es lo que esa palabra realmente te cuesta.

Empieza por el código que pilla a todo el mundo al menos una vez. Tienes un nombre en minúsculas y quieres pasarlo a mayúsculas:

```java
String name = "ana";
name.toUpperCase();
System.out.println(name);   // imprime: ana
```

No pasó nada. No hay error, no hay warning, ningún subrayado rojo en IntelliJ — la línea se ejecutó, hizo su trabajo, y el trabajo no fue a ninguna parte. Eso no es un bug de Java, es la definición del tipo: **un objeto `String` nunca puede modificarse después de creado.** `toUpperCase()` no editó `name`; construyó un *segundo* `String` que contenía `"ANA"` y lo devolvió, y como nadie recogió el valor de retorno, ese segundo objeto se creó y se descartó inmediatamente.

El arreglo es recoger lo que el método devuelve:

```java
String name = "ana";
name = name.toUpperCase();      // BIEN — reasigna la variable al nuevo String
System.out.println(name);       // imprime: ANA
```

Ya te has encontrado exactamente esta forma una vez. [01-variables-tipos.md](01-variables-tipos.md) mostró `total.add(...)` calculando una suma y tirándola, porque `BigDecimal` también es inmutable y `add` solo puede entregarte un objeto nuevo. Es la misma regla, y va a aparecer una tercera vez en [14-fechas.md](14-fechas.md), donde `date.plusDays(1)` devuelve una fecha distinta en lugar de mover la que tenías. **Clase inmutable, método que parece una edición, resultado que tienes que recoger** — una vez que reconoces el patrón, lo aciertas en cada clase que lo sigue.

> **Esta es la regla para toda la clase, no una rareza de `toUpperCase()`.** Todo método de `String` que parece cambiar algo — `toUpperCase`, `toLowerCase`, `trim`, `strip`, `replace`, `substring`, `concat`, `repeat` — devuelve un `String` **nuevo** y deja el original exactamente como estaba. Si el resultado de una llamada no se asigna a algo, no se guarda en ningún sitio, ni se pasa a otro lado, la llamada no hizo nada observable. Cada vez que una operación sobre un String "no funciona", comprueba esto primero: casi seguro que se te olvidó el `=`.

### Lo que pasa realmente en memoria

El diagrama de [01-variables-tipos.md](01-variables-tipos.md) es el que hay que retener: una variable `String` no contiene los caracteres, contiene una **dirección** — una flecha que apunta a un objeto que vive en otro sitio de la memoria. Reasignar la variable mueve la flecha; nunca edita lo que la flecha apuntaba antes.

Sigue `name = name.toUpperCase()` paso a paso:

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
                                    │ "ANA" │  ← un objeto nuevecito
                                    └───────┘
```

El objeto `"ana"` nunca se tocó. Se reservó un segundo objeto, se rellenó con los caracteres en mayúscula, y la variable se volvió a apuntar hacia él. El primer objeto es ahora **inalcanzable** — ninguna variable guarda su dirección — lo cual en Java significa que es basura, y el runtime reclamará su memoria en algún momento sin que se lo pidas. Ese proceso de reclamación es la recolección de basura (*garbage collection*), y es el tema de [05-modelo-de-memoria.md](05-modelo-de-memoria.md); aquí solo necesitas saber que los Strings descartados no son gratis, porque ese coste es todo el argumento a favor de `StringBuilder` más adelante.

> **¿Por qué querría un diseñador de lenguajes hacer esto a propósito?** La inmutabilidad suena a puro inconveniente hasta que miras lo que compra. Tres cosas. Primero, **compartir con seguridad**: si pasas un `String` a un método, sabes con certeza que ese método no puede alterar tu copia, porque nada puede alterar ningún `String` — así que nunca hace falta copia defensiva. Segundo, **reutilización segura**: como dos literales idénticos nunca pueden divergir, Java es libre de guardar una única copia compartida de `"ANA"` y entregársela a todo el que escriba ese literal, lo cual ahorra bastante memoria en una aplicación real. Tercero, **un hash code estable**: un `String` es el tipo de clave más habitual en un `HashMap`, y una clave cuyo contenido pudiera cambiar tras insertarla se perdería dentro del mapa ([10-colecciones.md](10-colecciones.md) explica por qué). Ninguna de las tres sobrevive a un `String` mutable. El coste es exactamente uno solo — cada edición reserva memoria — y el resto de este archivo trata de saber cuándo ese coste importa.

> **"Inmutable" habla del objeto, no de la variable.** `name` es una variable normal y puedes reasignarla tantas veces como quieras; lo que no puede cambiar es el objeto al que apunta. Las dos ideas son independientes, y Java tiene una palabra clave aparte para bloquear la *variable*: `final`, que viste brevemente en [01-variables-tipos.md](01-variables-tipos.md). `final String name = "ana";` te da las dos cosas — una variable que no se puede volver a apuntar, apuntando a un objeto que no se puede editar. También significa que `name = name.toUpperCase()` deja de compilar, porque esa línea reasigna la variable.

---

## El catálogo de métodos del día a día — y qué devuelve cada llamada

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basic Manipulations" — los mismos métodos con un ejemplo ejecutable cada uno.

Estas son las llamadas que necesitas para *leer* Java normal, que es la mayor parte de lo que haces al principio: abres un archivo de un proyecto real y cada tercera línea le hace algo a un `String`. El ejemplo es el registro de un empleado llegando como una línea de texto.

```java
String record = "  Ana Ruiz,DEVELOPER,38.5  ";

record.length()                    // 27  → int, el número de caracteres (contando los espacios)
record.strip()                     // "Ana Ruiz,DEVELOPER,38.5" → String, sin espacios al principio/final
record.isEmpty()                   // false → boolean, true solo para exactamente ""
record.isBlank()                   // false → boolean, true para "" y para texto solo de espacios en blanco
record.contains("DEVELOPER")       // true  → boolean, ¿está esta secuencia en algún sitio dentro?
record.startsWith("  Ana")         // true  → boolean, y endsWith() pregunta lo mismo por el otro extremo
record.indexOf(",")                // 10    → int, posición de la primera coincidencia, o -1 si no hay ninguna
record.toUpperCase()               // "  ANA RUIZ,DEVELOPER,38.5  " → String
record.replace(",", " | ")         // "  Ana Ruiz | DEVELOPER | 38.5  " → String, TODAS las ocurrencias
record.strip().substring(0, 8)     // "Ana Ruiz" → String, caracteres 0 a 7
record.strip().split(",")          // ["Ana Ruiz", "DEVELOPER", "38.5"] → String[], un array
"Ana".equals("ana")                // false → boolean, comparación exacta de contenido
"Ana".equalsIgnoreCase("ana")      // true  → boolean, comparación de contenido ignorando mayúsculas/minúsculas
String.join(" - ", "Ana", "Ruiz")  // "Ana - Ruiz" → String, lo opuesto de split
"-".repeat(20)                     // "--------------------" → String, útil para separadores de consola
```

Lee la `→` de cada comentario como "el tipo que devuelve esta llamada". Esa columna es lo que hay que memorizar, porque decide si puedes o no encadenar otra llamada al final. Todo lo que devuelve `String` se puede encadenar (`record.strip().toUpperCase().substring(0, 3)`); `length()` e `indexOf()` devuelven un `int` y terminan la cadena; `contains()`, `startsWith()`, `isBlank()` y `equals()` devuelven un `boolean`, que es exactamente el tipo que necesita un `if (...)`, así que son los que pones dentro de una condición.

> **`length()` cuenta unidades de código, no los caracteres que ve una persona.** Para cada nombre, email y rol que vayas a manejar, los dos números coinciden, así que léelo como "cuántos caracteres" y sigue adelante. La excepción es la misma que [01-variables-tipos.md](01-variables-tipos.md) ya te mostró con `char`: un emoji ocupa dos unidades de código, así que `"😀".length()` es `2`. Es el mismo hecho llegándote a través de `String` en vez de a través de `char`, y también es por lo que `substring` puede cortar un emoji por la mitad.

> **Solo tres de estas leen el string sin producir uno nuevo.** `length()`, `indexOf()` y las comprobaciones booleanas *interrogan* el objeto existente y no reservan nada. Todo lo demás de la lista — `strip`, `replace`, `substring`, `toUpperCase`, `split`, `join`, `repeat` — construye algo nuevo, exactamente como describió la sección anterior. Por eso vas a ver llamadas encadenadas en lugar de repetidas sobre la misma variable: cada eslabón de la cadena trabaja sobre el objeto fresco que devolvió el eslabón anterior.

### `substring` — el segundo índice queda excluido, y pasarte del final lanza excepción

`substring(begin, end)` toma los caracteres desde `begin` hasta **sin incluir** `end`. Así que la aritmética es más amigable de lo que parece: la longitud del resultado siempre es `end - begin`.

```java
String name = "Victor";

name.substring(0, 3)     // "Vic"    — índices 0, 1, 2. Tres caracteres: 3 - 0.
name.substring(3)        // "tor"    — un solo argumento significa "desde aquí hasta el final"
name.substring(0, 6)     // "Victor" — un índice final igual a length() es legal
name.substring(0, 10)    // 💥 lanza excepción
```

Esa última línea no devuelve un string vacío ni uno truncado. Falla en tiempo de ejecución con un mensaje que te da los dos números:

```
java.lang.StringIndexOutOfBoundsException: Range [0, 10) out of bounds for length 6
```

Lee la notación literalmente — `[0, 10)` es exactamente la regla "inicio incluido, final excluido" escrita en notación matemática, y `length 6` es el string que realmente tenías. Este es el error que obtienes siempre que cortas texto cuya longitud diste por hecha en vez de comprobarla: un código que normalmente tiene 8 caracteres llegando con 6, un campo de nombre que alguien dejó corto. En cualquier sitio donde hagas `substring` sobre un input que vino de fuera de tu programa, la longitud es algo que hay que verificar, no dar por bueno.

### `split` — recibe una expresión regular, no un separador plano

`split` es el único método del catálogo cuya firma te miente. Parece que recibe un carácter separador; recibe una **expresión regular** — un pequeño lenguaje de patrones donde ciertos caracteres tienen un significado especial en lugar de representarse a sí mismos. `.` es el más ruidoso de todos: en una regex significa "cualquier carácter, el que sea".

```java
"38.5".split(",")     // ["38.5"]  → no se encontró ninguna coma, así que te devuelve el string entero en un array de 1 elemento
"a.b.c".split(".")    // []        → MAL: '.' coincidió con TODOS los caracteres, así que cada trozo quedó vacío
"a.b.c".split("\\.")  // ["a","b","c"] → BIEN: la barra invertida lo convierte en un punto literal
```

La línea del medio es la trampa: no lanza excepción, devuelve un array de **longitud 0**, y el bucle que escribiste para recorrer los trozos simplemente no se ejecuta nunca. Nada en el output dice por qué. Los caracteres que necesitan escaparse así son `. | ( ) [ ] { } ^ $ * + ? \` — y `|` pilla a la gente casi tanto como `.`, porque una barra vertical tiene toda la pinta de separador natural en un archivo de texto. El escape se escribe `"\\."` con dos barras invertidas porque la primera es el propio escape de string de Java, así que el motor de regex recibe una sola `\.`.

> **Dónde se enseñan las expresiones regulares como es debido.** Son un tema propio y no forman parte del alcance junior de Java; lo que necesitas aquí es la conciencia de que `split` y `replaceAll` hablan regex mientras que `replace` no. `record.replace(".", "-")` trata el punto como un punto literal y funciona bien; `record.replaceAll(".", "-")` reemplaza cada carácter del string entero. En caso de duda usa `replace`, y recurre a la versión `All` solo cuando de verdad quieras un patrón.

> **`split` también descarta los trozos vacíos finales, en silencio.** `"a,b,,c,,".split(",")` devuelve `["a", "b", "", "c"]` — el hueco vacío del medio sobrevive, los dos huecos vacíos del final no. Eso es deliberado (es lo que quieres al parsear una línea CSV con una coma final) y es una fuente real de bugs cuando dependes de que la longitud del array coincida con un número fijo de columnas. Si necesitas los espacios en blanco finales, `split(",", -1)` los conserva.

---

## Vacío, en blanco, y el espacio en blanco que no puedes ver

> 📖 Docs: [Baeldung — Java Strip Methods](https://www.baeldung.com/java-string-strip-methods) → leer: "Comparing the Strip Methods vs the trim() Method" — y su subsección "The strip() Method vs the trim() Method".

Dos de las llamadas del catálogo de arriba parecen intercambiables y no lo son, y la diferencia decide si tu validación valida algo de verdad.

**`isEmpty()` es true para exactamente un valor: `""`, un String de longitud cero.** Nada más. **`isBlank()` es true para `""` *y* para cualquier string hecho solo de espacios en blanco** — espacios, tabuladores, saltos de línea. La distinción completa:

```java
"".isEmpty()      // true       ""     está vacío
"".isBlank()      // true       ""     también está en blanco — todo string vacío está en blanco
"   ".isEmpty()   // false  ←   "   "  tiene longitud 3, así que NO está vacío
"   ".isBlank()   // true   ←   "   "  está en blanco
"\t".isEmpty()    // false      un tabulador es un carácter como cualquier otro
"\t".isBlank()    // true
"Ana".isBlank()   // false
```

La relación va en una sola dirección y merece decirse con claridad: **todo string vacío está en blanco, y la mayoría de los strings en blanco no están vacíos.** Así que `isBlank()` es la comprobación más amplia, y casi siempre es la que querías hacer.

Cuál produce un campo de formulario es todo el punto práctico. Un usuario que deja un campo sin tocar envía `""` — vacío, y `isEmpty()` lo detecta. Un usuario que toca el campo, pulsa la barra espaciadora dos veces y sigue adelante envía `"  "`, y lo mismo hace cualquiera que pegue un valor con un tabulador perdido, o cuyo teclado del móvil añada un espacio tras el autocompletado. Ese valor tiene longitud 2, así que `isEmpty()` devuelve `false` y tu validación lo deja pasar — y acabas de guardar un empleado cuyo nombre son dos espacios. **En código de validación, recurre a `isBlank()`; `isEmpty()` es para el caso concreto en el que te importa específicamente que la longitud sea cero**, como comprobar si un string construido a partir de una lista produjo contenido en absoluto.

> **Adelanto — Spring Boot:** vas a encontrarte este mismo par otra vez, como anotaciones en lugar de llamadas a método. `@NotEmpty` sobre un campo de un request rechaza `""` y deja pasar `"  "`; `@NotBlank` rechaza los dos. Son las mismas dos reglas con los mismos nombres, aplicadas automáticamente en el borde de tu API en lugar de a mano dentro de un método. Qué anotación va en qué campo es una pregunta de las notas de Spring Boot — lo que se traslada desde aquí es *por qué* existen las dos y cuál es la opción segura por defecto.

### `strip()` frente a `trim()` — usa `strip()`

El catálogo lista `strip()`, pero todo tutorial escrito antes de 2018 enseña `trim()`, así que te vas a encontrar los dos. Hacen el mismo trabajo — quitar espacios en blanco al principio y al final — y discrepan sobre qué *es* un espacio en blanco, porque las dos definiciones vienen de épocas distintas.

`trim()` es anterior al soporte de Unicode en Java: elimina todo carácter cuyo code point sea menor o igual que `U+0020` (el espacio normal). Es una regla numérica cruda — resulta que atrapa espacios, tabuladores y saltos de línea, y también atrapa algunos caracteres de control que no son espacios en blanco en absoluto. `strip()`, añadido en Java 11, pregunta en cambio a `Character.isWhitespace()`, que consulta las tablas reales de Unicode:

```java
String em = " Ana ";      // U+2003 EM SPACE — espacio en blanco Unicode de verdad

em.length()          // 5
em.trim().length()   // 5  ← MAL: trim lo dejó tal cual, porque U+2003 > U+0020
em.strip().length()  // 3  ← BIEN: strip sabe que U+2003 es espacio en blanco
```

Para input ASCII normal los dos son idénticos — `"   Ana   "` vuelve como `"Ana"` con ambos. La diferencia solo aparece con texto que vino de algún sitio real: un documento de Word, un PDF, un copia-pega sacado de una página web, un formulario rellenado desde el móvil. Ese texto suele traer espacios em, espacios ideográficos (`U+3000`, estándar en texto chino y japonés) y espacios de no separación, y `trim()` deja cada uno de ellos exactamente donde estaba — así que un nombre que llegó como `"Ana "` falla una comprobación de igualdad contra `"Ana"`, y te sale "usuario no encontrado" para un nombre que se ve perfectamente correcto en pantalla. Ese es todo el argumento: `strip()` no cuesta nada extra de escribir y elimina una clase de bug que no puedes ver.

> **El único caso en el que `strip()` también deja el carácter ahí.** El espacio de no separación de Unicode `U+00A0` — el carácter que produce un `&nbsp;` de HTML, y el causante invisible de problemas más común en input web — *no* es espacio en blanco según `Character.isWhitespace()`, porque está definido deliberadamente como "no separador". Ni `trim()` ni `strip()` lo eliminan. Si estás limpiando input que vino a través de un navegador, necesitas `input.replace(' ', ' ').strip()`. Nadie descubre esto leyendo la documentación; lo descubre mirando fijamente dos strings que se imprimen idénticos y comparan `false`.

> **`isBlank()` usa la misma regla moderna que `strip()`.** Las dos preguntan a `Character.isWhitespace()`, así que están de acuerdo entre sí y las dos discrepan de `trim()`. Esa coherencia no es casualidad — `isBlank()` y `strip()` llegaron juntos en Java 11 precisamente para reemplazar la pareja pre-Unicode. Trátalas como una sola actualización: `trim()`/`isEmpty()` es la pareja vieja, `strip()`/`isBlank()` es la que hay que escribir.

---

## Metiendo valores dentro de texto — `+` y `.formatted()`

> 📖 Docs: [Oracle Docs — `java.util.Formatter`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html) → leer: "Format String Syntax" y la tabla "Conversions" — la lista completa de qué puede ir después de un `%`.

Tienes un `Employee` y quieres sacar de ahí una línea legible. La forma obvia es `+`, que pega texto y, cuando un lado no es texto, lo convierte primero:

```java
String name = "Ana";
int hours = 38;

String line = name + " logged " + hours + " hours";   // "Ana logged 38 hours"
```

Eso funciona y es perfectamente idiomático para una expresión corta como esta. Deja de ser agradable en cuanto la frase tiene cuatro o cinco huecos, porque las comillas y los signos `+` empiezan a superar en número a las palabras de verdad. `.formatted()` es la alternativa: escribes la frase de una vez, de una sola pieza, con **marcadores de posición** señalando dónde van los valores, y entregas los valores después.

```java
String line = "%s logged %d hours".formatted(name, hours);   // "Ana logged 38 hours"
```

Un marcador de posición es un `%` seguido de una letra que dice *qué tipo de valor va aquí*. Los tres que vas a usar:

- **`%s`** — aquí va un string. Acepta literalmente cualquier cosa, porque todo lo que hace es llamar a `toString()` sobre el valor, y todo objeto en Java tiene un `toString()` ([06-poo-clases.md](06-poo-clases.md) es donde escribes el tuyo propio).
- **`%d`** — aquí va un número entero (`int`, `long`, y sus tipos wrapper). Rechaza cualquier otra cosa.
- **`%f`** — aquí va un número decimal, y casi siempre quieres decir cuántos decimales: `%.2f` significa dos. `"Total: %.2f h".formatted(38.5)` da `"Total: 38,50 h"` o `"Total: 38.50 h"` según la configuración regional de la máquina, un detalle que merece la pena saber que existe pero no perseguir a este nivel.

**Los valores se emparejan con los marcadores de izquierda a derecha, por posición — nada se empareja por nombre.** Ese es todo el mecanismo, y también es todo el problema, porque nada comprueba que hayas puesto el orden correcto.

> **`.formatted()` es lo más parecido que tiene Java a un template literal de JavaScript.** `` `${name} logged ${hours} hours` `` y `"%s logged %d hours".formatted(name, hours)` hacen el mismo trabajo. La única diferencia real es que JS pone la variable *dentro* del texto y Java pone un marcador ahí y las variables después — que es exactamente por qué la versión JS no puede equivocarse de orden y la versión Java sí.

### Por qué una cadena de formato rota sigue compilando

Intercambia los dos argumentos y el compilador no dice absolutamente nada:

```java
"%s logged %d hours".formatted(name, hours);    // BIEN — "Ana logged 38 hours"
"%s logged %d hours".formatted(hours, name);    // MAL  — compila, y luego explota en tiempo de ejecución
```

La razón está en la firma del método. `formatted` está declarado como `formatted(Object... args)` — acepta **cualquier número de argumentos de cualquier tipo**. Desde el punto de vista del compilador, las dos líneas de arriba son la misma llamada legal: un String, sobre el que invocas un método que recibe una lista de objetos, pasándole dos objetos. No tiene ningún motivo para objetar, porque la cadena de formato `"%s logged %d hours"` es, para el compilador, solo un trozo de texto como cualquier otro. Nada lee lo que hay dentro hasta que el programa se ejecuta y el valor realmente se necesita.

Así que la comprobación pasa a tiempo de ejecución, y la segunda línea falla con:

```
java.util.IllegalFormatConversionException: d != java.lang.String
```

Léelo como "a `%d` le entregaron un `java.lang.String`". Fíjate en *qué* marcador se quejó: `%s` se tragó el número `38` sin rechistar, porque `%s` solo llama a `toString()` y un `Integer` tiene uno. Solo `%d` es quisquilloso, porque tiene que producir dígitos. Así que un par intercambiado siempre falla en el marcador *numérico* — el error apunta a la segunda mitad de tu cadena de formato mientras el error está en la primera mitad.

Ese mismo retraso se aplica a un especificador que directamente no existe, y a un valor de menos:

```java
"Total: %z".formatted(5);
// java.util.UnknownFormatConversionException: Conversion = 'z'

"%s and %s".formatted("only");
// java.util.MissingFormatArgumentException: Format specifier '%s'
```

Los dos son erratas que un compilador podría en principio detectar — y no lo hace, por la misma razón: la cadena de formato es datos, examinados solo cuando la línea se ejecuta. Esa es la lección general, y es más grande que `formatted`. **Una regla que impone el compilador falla en cada ejecución, a gritos, antes de que la publiques; una regla que se impone en tiempo de ejecución falla solo en la ejecución que llega a esa línea.** Un `%d` dentro de un mensaje de error que solo construyes cuando un request está mal formado va a estar ahí compilando limpiamente durante meses y luego explota la primera vez que un usuario toca esa ruta. Cualquier cadena de formato en una rama poco transitada merece ejecutarse una vez a propósito.

> **Por eso `%s` es la opción segura por defecto.** Acepta cualquier cosa, así que nunca puede producir un `IllegalFormatConversionException`. Usa `%d` y `%f` cuando de verdad necesites el comportamiento numérico — separadores de miles, un número fijo de decimales — y `%s` en todo lo demás. Y mantén las cadenas de formato cortas: cuanto más larga sea la frase, más marcadores hay que contar, y contar marcadores a ojo es exactamente la tarea que este fallo castiga.

---

## Acumulando texto — cuándo `+` se convierte en la herramienta equivocada

> 📖 Docs: [Baeldung — StringBuilder and StringBuffer in Java](https://www.baeldung.com/java-string-builder-string-buffer) → leer: "Similarities" y "Differences" (con su subsección "Performance")
> 📖 [Oracle Docs — `java.lang.StringBuilder`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html) → lee la descripción de la clase: "no guarantee of synchronization"

`a + b` sobre dos Strings está bien. Lo que no está bien es `+=` dentro de un bucle, y la razón es la inmutabilidad, ahora con un coste asociado.

> **Tres piezas de sintaxis de los ejemplos de abajo están prestadas de archivos posteriores.** Léelas, no las estudies. `for (Employee e : employees)` es un **bucle**: ejecuta el bloque una vez por cada elemento de `employees`, con `e` guardando el actual — se explica en detalle en [03-flujo-de-control.md](03-flujo-de-control.md). `List<Employee>` es una **lista de empleados**, la forma normal en la que Java guarda muchos valores de un tipo, y los corchetes angulares dicen qué tipo hay dentro — [09-genericos.md](09-genericos.md) explica los corchetes y [10-colecciones.md](10-colecciones.md) la lista. Y `e.getName()` es una **llamada a un método sobre un objeto**: le pide a ese empleado concreto su nombre, que es [06-poo-clases.md](06-poo-clases.md). Ninguna de las tres es lo que enseña esta sección; son solo la forma más corta de escribir "mil nombres, uno detrás de otro", que es la situación de la que trata la sección.

Tienes una lista de empleados y quieres una línea por empleado. El primer intento natural:

```java
// MAL — un objeto String nuevo por cada iteración
String report = "";
for (Employee e : employees) {          // supón que la lista tiene 1000 entradas
    report += e.getName() + "\n";
}
```

`report += ...` no puede editar `report`, porque ningún `String` se puede editar. Así que en cada iteración Java **reserva un objeto `String` nuevo** que contiene todo lo acumulado hasta ahora *más* la línea nueva, copia todos esos caracteres dentro, y vuelve a apuntar `report` hacia él. El objeto anterior queda abandonado:

```
iteración 1:   "Ana\n"                        ← abandonado tras la iteración 2
iteración 2:   "Ana\nBeto\n"                  ← abandonado tras la iteración 3
iteración 3:   "Ana\nBeto\nCarla\n"           ← abandonado tras la iteración 4
    ...        (996 objetos abandonados más)
iteración 1000: el único que te quedas
```

De ese cuadro salen dos costes, y el segundo es el que la gente pasa por alto. El primero son **999 objetos desechables**, cada uno de los cuales el recolector de basura tiene que reclamar. El segundo es la **copia**: la iteración 500 no copia un nombre, copia el informe entero de 499 líneas construido hasta el momento, y luego la iteración 501 copia 500 líneas, y así sucesivamente. El trabajo total crece con el *cuadrado* del número de líneas — duplica los empleados y cuadriplicas la copia. Eso es lo que convierte una ineficiencia invisible con diez elementos en un endpoint visiblemente lento con diez mil.

`StringBuilder` es la respuesta, y su modelo mental es una pizarra: una única superficie sobre la que sigues escribiendo, en lugar de una hoja nueva copiada desde cero por cada palabra. Guarda un **buffer mutable** — un bloque de memoria que tienes permiso de modificar en el sitio — y `.append()` escribe dentro de él. Cuando terminas, `.toString()` produce el `String` final de una vez.

```java
// BIEN — un solo objeto, se va añadiendo en el sitio
StringBuilder sb = new StringBuilder();
for (Employee e : employees) {
    sb.append(e.getName()).append("\n");   // append devuelve el propio builder, así que las llamadas se encadenan
}
String report = sb.toString();             // exactamente un String creado, al final
```

> **¿Por qué `.append()` y no `+=`?** Porque `StringBuilder` es mutable, y Java no deja que una clase defina qué significa `+=`. Esa es la regla de **no hay sobrecarga de operadores** que [01-variables-tipos.md](01-variables-tipos.md) ya nombró cuando resultó que `BigDecimal` necesitaba `add()` en lugar de `+`: una clase nunca puede enseñarle a un operador a funcionar sobre ella. `+` sobre Strings es la única excepción, incorporada al propio lenguaje y no disponible para nadie más — por eso `String` tiene un operador y `StringBuilder` tiene un método. Así que `StringBuilder` expone `append()` en su lugar, y el nombre del método te hace un favor: `append` se lee como "modifica este objeto", donde `+=` se lee como "calcula un valor nuevo". La diferencia entre los dos es todo el punto de la sección.

> **Cuando el buffer se llena, crece — y eso sigue siendo barato.** Un `StringBuilder` empieza con sitio para un número fijo de caracteres y, cuando le añades más allá de eso, reserva un buffer más grande y copia el contenido dentro. Así que no son literalmente cero copias. La diferencia está en *con qué frecuencia*: el buffer más o menos se duplica cada vez, así que mil `append` disparan un puñado de realojos en vez de mil. Si por casualidad conoces el tamaño final de antemano puedes evitar incluso esos con `new StringBuilder(4096)`, que está bien saberlo pero casi nunca merece la pena hacerlo.

### La regla, dicha para que la puedas aplicar

**Usa `+` para una expresión única. Usa `StringBuilder` cuando la acumulación se repite.** Son situaciones genuinamente distintas y el compilador las trata de forma distinta:

```java
String label = name + " (" + role + ")";   // BIEN — una expresión, una sentencia, usa +
```

Para esa línea el propio compilador construye el resultado de forma eficiente en un solo paso; escribir un `StringBuilder` a mano para esto sería más largo, más feo y no más rápido. En el momento en que la acumulación se reparte a lo largo de **iteraciones de un bucle**, el compilador ya no puede ayudarte — no puede ver que las mil sentencias separadas son una sola operación lógica — y la elección pasa a ser tuya.

> **No salgas a buscar `+` para reemplazar.** Esta optimización importa en bucles sobre colecciones que pueden crecer. Pegar tres campos en un `toString()`, o construir un mensaje de log de dos piezas, reserva un objeto extra y no merece ni notarse. Recurrir a `StringBuilder` en todas partes hace el código más difícil de leer a cambio de nada, lo cual es un intercambio peor que el que intentabas evitar. Y cuando lo que estás uniendo es una colección con un separador entre los elementos, hay una herramienta más legible que las dos: `String.join(", ", names)` para una colección ya construida, y `Collectors.joining(", ")` para un stream — la versión de stream está en [12-streams-lambdas.md](12-streams-lambdas.md).

### `String`, `StringBuilder`, `StringBuffer`

Hay un tercer tipo en esta familia, y te lo vas a encontrar en código antiguo. Lee esta tabla eligiendo tus dos restricciones — ¿necesita el objeto ser modificable?, ¿lo toca más de un hilo? — y la última columna nombra el tipo que encaja:

|                 | ¿Modificable? | ¿Thread-safe? | Cuándo usarlo                              |
| --------------- | ----------- | ------------ | ---------------------------------------- |
| `String`        | No          | Sí          | La mayoría de los casos — leer, pasar, comparar  |
| `StringBuilder` | Sí         | No           | Construir texto en un bucle (la opción rápida) |
| `StringBuffer`  | Sí         | Sí          | Construcción multihilo (raro)            |

`String` es thread-safe *porque* es inmutable — no hay nada que corromper si nada puede cambiar. `StringBuffer` es el builder más antiguo y thread-safe; paga esa seguridad con bloqueo (*locking*) en cada llamada, y como el caso abrumadoramente habitual es un builder creado y terminado dentro de un único método, `StringBuilder` (Java 5) existe como la misma clase sin los bloqueos. **Escribe `StringBuilder`; reconoce `StringBuffer` cuando lo veas en código de 2004.**

> **Qué significa "thread-safe", y por qué importa en una API de Spring Boot.** Un **hilo** (*thread*) es una tarea que se ejecuta en paralelo con otras dentro del mismo programa. Una API REST atiende cada petición HTTP entrante en su propio hilo — así es como sirve a varios usuarios a la vez en lugar de ponerlos en cola. La regla práctica que sigue de esto: un `StringBuilder` declarado como **variable local dentro de un método** se crea de cero en cada llamada, así que pertenece exactamente a un hilo y la pregunta ni siquiera se plantea. Un `StringBuilder` guardado como **campo de un objeto compartido** es un bug real esperando a tu segundo usuario concurrente.

> **Adelanto — Spring Boot:** el fragmento de abajo está anotado con `@Service`, que todavía no has estudiado. Marca una clase que Spring crea **una sola vez** al arrancar y entrega a todo el que la necesite — un *singleton*, una instancia compartida para toda la aplicación. Esa única palabra es lo que hace peligroso el ejemplo: un objeto, y cada hilo de cada petición escribiendo en él. Vas a implementar `@Service` en las notas de Spring Boot; aquí solo prepara el terreno.

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

La versión `MAL` no falla en pruebas. Con un solo usuario a la vez se comporta perfectamente; solo produce basura entrelazada bajo tráfico concurrente real, que es el peor calendario de fallo posible. El hábito que lo evita del todo: **un builder es una variable local, siempre.**

> **La mitad de la historia sobre la recolección de basura llega más tarde.** [05-modelo-de-memoria.md](05-modelo-de-memoria.md) retoma este mismo bucle una vez que el heap y el recolector de basura están sobre la mesa, y muestra en detalle qué le cuesta al runtime "999 objetos abandonados". Todo lo que necesitas para tomar la decisión correcta está en esta página; ese archivo explica qué hace la máquina con la decisión equivocada.

---

## Bloques de texto — texto multilínea sin el escapado

> 📖 Docs: [Baeldung — Java Text Blocks](https://www.baeldung.com/java-text-blocks) → leer: "Usage" para la sintaxis y "Indentation" para la regla del espacio en blanco incidental.

Incrustar un trozo de JSON o SQL en código fuente Java solía ser genuinamente doloroso, porque cada comilla dentro del contenido había que escaparla con una barra invertida y cada salto de línea había que escribirlo como `\n`:

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

Dos reglas de sintaxis que impone el compilador. El `"""` de apertura tiene que ir seguido de un **salto de línea** — el contenido no puede empezar en la misma línea — y probarlo te da un mensaje que nombra la regla directamente:

```java
String s = """hello""";   // MAL — error: illegal text block open delimiter sequence, missing line terminator
```

El `"""` de cierre es más libre: puede ir al final de la última línea de contenido (como en el JSON de arriba) o en una línea propia. Esa elección no es cosmética — mira el callout.

> **¿Dónde se fue la indentación?** El bloque de arriba está indentado ocho espacios para alinearse con el código que lo rodea, y aun así el string resultante empieza en la columna cero. El compilador elimina lo que la especificación llama **espacio en blanco incidental**: mira cada línea no vacía *más la línea que contiene el `"""` de cierre*, encuentra la indentación más pequeña entre todas ellas, y quita exactamente esa cantidad de cada línea. Así que la indentación que añadiste para mantener el código fuente legible no cuesta nada, y la indentación que añadiste *a propósito* — los dos espacios antes de `"name"` — sobrevive, porque es mayor que el mínimo.
>
> La consecuencia que hay que recordar: **mover el `"""` de cierre cambia el string.** Ponlo en una línea propia en la columna cero y la indentación mínima pasa a ser cero, así que los ocho espacios reaparecen de golpe dentro de tu JSON. Esa es la única sorpresa de los bloques de texto que merece la pena saber antes de que ocurra.

**El tipo sigue siendo `String`.** Un bloque de texto es una forma distinta de *escribir* un literal, no un tipo de valor nuevo — así que cada método del catálogo funciona sobre él, `.formatted()` funciona sobre él, y un método que recibe un `String` no puede saber cómo se escribió el literal. Nada sobre la inmutabilidad cambia tampoco.

Dónde recurres realmente a uno: un fixture JSON en un test, una plantilla de email en HTML, y sobre todo una consulta SQL o JPQL multilínea. Esta última es código real en el proyecto 07 — `TimeEntryRepository` escribe cada consulta de informe como un bloque de texto, que es la única razón por la que un `SELECT` de cinco líneas es legible dentro de una interfaz Java:

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

> **Adelanto — Spring Boot:** `@Query` y `@Param` pertenecen a Spring Data JPA y se cubren en las notas de Spring Boot. Aquí lo único que hacen es entregar ese texto a la capa de base de datos. Lee el fragmento por el *literal*: es un `String` normal, escrito a lo largo de cinco líneas sin ningún `\n` ni comillas escapadas, que es la funcionalidad entera. Escrita a la manera pre-Java-15, esa consulta sería una única línea ilegible de barras invertidas — y la consulta es justo la parte que necesitas poder revisar a simple vista.

---

## Entre texto y números

> 📖 Docs: [Oracle Docs — Converting Between Numbers and Strings](https://docs.oracle.com/javase/tutorial/java/data/converting.html) → leer las dos mitades: "Converting Strings to Numbers" y "Converting Numbers to Strings".

Todo lo que llega desde fuera de tu programa es texto. Una variable de ruta de URL, un campo de formulario, una columna de un CSV, un argumento de línea de comandos, un claim de un JWT — todo `String`, incluso cuando el contenido es obviamente un número. Así que las dos direcciones de esta conversión pasan constantemente.

### Texto → número

Ya te has encontrado estas dos llamadas una vez, en [01-variables-tipos.md](01-variables-tipos.md), desde el otro lado de la frontera: ahí la pregunta era *qué tipo sale*, primitivo o wrapper. Aquí la pregunta es *qué entra* — texto que no escribiste tú, llegando de algún sitio que no controlas — y eso cambia qué detalles importan.

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

### `NumberFormatException` es *unchecked* — y qué significa eso hoy

`NumberFormatException` es una excepción **unchecked**, y la consecuencia práctica es corta: **el compilador no te obliga a manejarla, y no te obliga a declarar que tu método puede lanzarla.** La línea `Integer.parseInt(input)` compila limpiamente por sí sola, sin `try`, sin warning, y sin nada en IntelliJ que sugiera que puede fallar. Compáralo con leer un archivo, que Java *sí* te obliga a manejar antes de dejarte compilar — viste ese contraste en [00-intro-java.md](00-intro-java.md).

Así que la responsabilidad es enteramente tuya. Siempre que el texto venga de fuera de tu programa, esta llamada necesita o un `try/catch` alrededor o validación por delante. Sin eso, un usuario escribiendo `id=abc` en una URL se convierte en una excepción no capturada y una respuesta 500 — que es la forma más habitual con diferencia en la que se rompe un endpoint REST junior.

> **Por qué el modelo completo espera a [11-excepciones.md](11-excepciones.md).** "Unchecked" es una mitad de una regla sobre *dos* tipos de excepción, y la regla solo tiene sentido una vez que sabes cómo viaja una excepción, dónde se puede capturar, y qué pinta tiene la jerarquía de clases debajo de `Exception` — porque checked frente a unchecked es literalmente una pregunta de en qué rama de esa jerarquía se sienta una clase. La entrada 11 construye todo eso y luego resuelve el par en un solo sitio. Lo que necesitas aquí es el hecho operativo: nada te va a recordar que `parseInt` puede fallar, así que tienes que recordarlo tú.

### Número → texto

La dirección inversa tiene tres formas de escribirse, y una de ellas es más segura que las otras:

```java
int hours = 38;

String a = String.valueOf(hours);      // "38" — funciona para cualquier tipo, incluidos objetos y null
String b = Integer.toString(hours);    // "38" — la propia conversión del número
String c = "" + hours;                 // "38" — funciona, pero no dice nada sobre la intención
```

`String.valueOf(x)` es la que hay que usar por defecto, y la razón es `null`. `valueOf` es un método **estático** de `String` — lo llamas sobre la clase, y el valor entra como argumento — así que un argumento nulo es solo un valor que inspecciona, y te devuelve el string de cuatro caracteres `"null"`. `x.toString()` es un método de **instancia**: llamarlo significa pedirle al objeto *en* `x` que se describa a sí mismo, y si `x` es null no hay ningún objeto ahí al que preguntarle:

```java
Employee e = null;

String s1 = String.valueOf(e);   // "null" — sin fallo; valueOf comprueba null internamente
String s2 = e.toString();        // 💥 NullPointerException — no hay nada ahí sobre lo que llamar a un método
```

Ese es todo el argumento. Cuando el valor con certeza no es null — un `int` primitivo no puede serlo — los dos son equivalentes y es cuestión de gusto. Cuando podría serlo, `String.valueOf` degrada a un output legible mientras `toString()` tumba el request. En una línea de log o un mensaje de error, donde que el valor sea null es exactamente el caso que estás intentando diagnosticar, `valueOf` es la única opción sensata.

> **El único sitio donde `String.valueOf` te muerde de vuelta.** Escribir `String.valueOf(null)` con un literal `null` a secas **no** devuelve `"null"` — lanza una `NullPointerException`. La causa es que `String.valueOf` está sobrecargado muchas veces (`Object`, `char[]`, `int`, `boolean`…), y cuando el argumento es un `null` a secas el compilador elige la sobrecarga más específica que encaja, que es `char[]` — y esa sobrecarga lee inmediatamente la longitud del array. El mensaje de error incluso lo dice así: `Cannot read the array length because "value" is null`. Solo pasa con un `null` literal escrito en el código fuente, nunca con una variable *nula*, cuyo tipo declarado resuelve la sobrecarga correctamente. Si alguna vez lo necesitas de verdad, `String.valueOf((Object) null)` te da `"null"`.

El proyecto 07 recorre este viaje de ida y vuelta en las dos direcciones, en `JwtUtil`. El claim `subject` de un JWT está definido como texto, así que el id del usuario tiene que renderizarse al salir y parsearse al volver a entrar:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/JwtUtil.java
.subject(String.valueOf(userId))                          // Long → String, cuando se emite el token

return Long.valueOf(parseClaims(token).getSubject());     // String → Long, cuando se lee el token
```

Esa segunda línea es territorio de `NumberFormatException` por diseño: un token cuyo subject no es un número — un token antiguo de antes de que el claim guardara un id, o uno que alguien manipuló — falla ahí en lugar de aceptarse en silencio. Lo cual es el comportamiento correcto, y un buen ejemplo de una conversión que *también* es una validación.

---

## Comparar dos Strings — y la única pregunta que este capítulo se niega a responder

> 📖 Docs: [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → leer: las entradas `equals(Object)` y `equalsIgnoreCase(String)` en la lista de métodos — las dos se definen en términos de *la secuencia de caracteres*, nunca del objeto que los contiene.

Para comparar contenido, la regla es corta y puedes aplicarla hoy mismo:

```java
name.equals("Ana")                  // BIEN — compara los caracteres reales
name.equalsIgnoreCase("ana")        // BIEN — lo mismo, ignorando mayúsculas/minúsculas
name == "Ana"                       // MAL — nunca uses == para comparar texto
```

`equals()` compara carácter a carácter y responde la pregunta que querías hacer. `equalsIgnoreCase()` hace lo mismo tratando `'A'` y `'a'` como idénticos, que es lo que quieres para un email, un nombre de usuario, o un nombre de rol que llega desde un formulario. **Usa `equals` para contenido, siempre; `equalsIgnoreCase` cuando las mayúsculas no formen parte de la identidad.**

> **Por qué la explicación de `==` espera a [06-poo-clases.md](06-poo-clases.md).** Ya sabes por el diagrama del principio de este archivo que una variable `String` guarda una dirección, así que `==` compara dos direcciones en lugar de dos trozos de texto — pero saber *eso* no es lo mismo que entenderlo, y el entendimiento necesita una maquinaria que este capítulo no tiene. Necesita el modelo de objetos: qué *es* realmente `equals` (un método que toda clase hereda), qué hace su versión heredada, y cómo una clase la reemplaza para comparar contenido en vez de direcciones. También necesita la razón por la que `==` sobre dos Strings a veces devuelve `true` y te engaña, que es un hecho sobre cómo Java almacena los literales y no sobre el texto en absoluto. La entrada 06 construye las clases primero, luego define igualdad de identidad frente a igualdad de valor una vez, y resuelve juntos `String ==`, `==` de wrappers y `Objects.equals` — donde se explican unos a otros. Memorizar la regla aquí y encontrarte el mecanismo allí es el orden correcto; al revés te deja sosteniendo una regla sin nada debajo, que es el tipo de conocimiento que se derrumba en la primera pregunta de seguimiento de una entrevista.

---

## Lo que esto desbloquea

Ya puedes manejar las dos cosas de las que está hecho todo valor en un programa Java: los números, cuya representación decide su aritmética, y el texto, cuya inmutabilidad decide todo lo demás. Puedes leer la API cotidiana de `String`, validar input que llega en blanco en vez de vacío, construir una línea de informe sin generar mil objetos desechables, incrustar una consulta sin escaparla, y mover un valor a través de la frontera texto/número en las dos direcciones sabiendo exactamente dónde puede fallar.

Lo que todavía no puedes hacer es decidir nada por ti mismo. Aparte de los dos bucles que este archivo tomó prestados para construir el argumento de `StringBuilder` — y prestado es la palabra correcta, porque nada aquí los explicó — cada línea hasta ahora se ejecuta exactamente una vez, de principio a fin, en el orden en que está escrita: un programa que evalúa expresiones pero nunca *elige* entre ellas, y que repite un bloque solo donde alguien te entregó el bucle. [03-flujo-de-control.md](03-flujo-de-control.md) es donde eso cambia: `if` para elegir qué líneas se ejecutan según un valor, `for` y `while` para ejecutar un bloque tantas veces como pida el dato. Retoma el mismo `Employee` y las mismas horas semanales, y empieza a hacerles preguntas.
