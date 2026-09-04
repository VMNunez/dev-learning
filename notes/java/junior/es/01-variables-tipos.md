# Variables y tipos

> 📖 [Baeldung — Java primitives](https://www.baeldung.com/java-primitives) → leer: "Overview" y "Primitive Data Types"
> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

El [00-intro-java.md](00-intro-java.md) te dejó con la idea central de que Java es de **tipado estático**: cada variable tiene un tipo fijado en tiempo de compilación, y ese tipo nunca cambia. Eso lleva directamente a la siguiente pregunta — _¿cuáles son esos tipos?_ Este archivo la responde. Antes de escribir una sola clase, un bucle o un método, necesitas la materia prima: el conjunto exacto de tipos que Java te da para guardar un número, un valor de verdadero/falso, un trozo de texto, y cómo se comportan en memoria. Todo lo que viene a partir de aquí — cada campo de cada entidad de Spring Boot, cada parámetro de un método — se construye a partir de los tipos de esta página.

## Tipos primitivos

> 📖 Docs: [Baeldung — Introduction to Java Primitives](https://www.baeldung.com/java-primitives) → leer: "Primitive Data Types" — los ocho tipos con sus rangos exactos, una subsección cada uno, más "Overflow".

En Java hay dos formas de guardar datos en memoria. La primera es almacenar el **valor directamente**: el dato en sí vive dentro de la propia variable, en el sitio de memoria que ocupa esa variable. La segunda es guardar una **referencia** — en lugar del dato en sí, la variable contiene una dirección de memoria que apunta a dónde está el objeto real, como un enlace. Los **tipos primitivos** usan la primera forma: almacenan el valor directamente, sin referencias. Los **objetos** (como `String`, `User`, o cualquier clase) usan la segunda.

Esta distinción — guardar el valor o guardar una dirección — es la base de la que sale casi todo lo que verás en el resto de la página, así que merece la pena dibujarla. Las dos declaraciones de abajo se escriben casi igual, pero dejan la memoria de dos formas distintas: una guarda el valor y la otra guarda una dirección.

```java
int number = 42;
String name = "Victor";
```

```
        int number = 42                  String name = "Victor"

   ┌──────────────────────┐         ┌──────────────────────┐
   │  number │    42      │         │  name   │  0x7f3a20  │  ← una dirección, no el texto
   └──────────────────────┘         └────────────┬─────────┘
     el valor ESTÁ aquí                          │ apunta a
                                                 ▼
                                    ┌──────────────────────────┐
                                    │  objeto String "Victor"  │
                                    └──────────────────────────┘
                                       el valor vive AQUÍ
```

Todo lo que más adelante en esta página parece contradictorio sale del esquema anterior, es decir, de cómo se guarda cada dato en memoria. Por ejemplo: `==` sobre dos `String` compara las dos direcciones de memoria que guardan las variables, no el texto al que esas direcciones apuntan. Por eso el texto se compara con `equals()` en su lugar; los métodos que sí sirven para comparar `String` — `equals()`, `equalsIgnoreCase()`, `compareTo()` — están en [02-cadenas-de-texto.md](02-cadenas-de-texto.md), y qué está preguntando realmente `equals()` se explica en [06-poo-clases.md](06-poo-clases.md).

Otra particularidad que sale de lo mismo: un `int` nunca puede ser `null`, porque en su hueco de memoria solo cabe un número y no existe ningún número que signifique «vacío». Un `Integer` sí puede serlo, porque en su hueco no hay un número sino una dirección, y una dirección sí admite el valor especial «no apunto a ningún objeto» — eso es exactamente lo que significa `null`.

Lo que el dibujo todavía no cuenta es _dónde_ están esos dos huecos dentro de la memoria del programa: la variable vive en una zona (el _stack_, o pila) y el objeto al que apunta vive en otra (el _heap_, o montón). Dicho con los dos casos del dibujo: cuando declaras un primitivo, la variable y su valor no son dos cosas guardadas en dos sitios — la variable **es** el hueco reservado en el stack, y el valor está escrito directamente dentro de ese hueco; cuando declaras un objeto, en el stack está solo la variable, y lo que hay escrito dentro de ella no es el objeto sino la dirección de memoria del heap donde ese objeto está; el objeto entero está en el heap. La regla es: **toda variable local vive en el stack y todo objeto vive en el heap** — y los campos de un objeto no son variables locales, así que viajan dentro de su objeto. Esa segunda mitad del esquema es el tema de [05-modelo-de-memoria.md](05-modelo-de-memoria.md), que retoma este mismo diagrama en detalle.

Java tiene 8 tipos primitivos. Cada uno tiene un tamaño fijo y un rango de valores posibles. Los rangos son útiles para saber cuándo cambiar de tipo: por ejemplo, si un contador puede superar los 2.1 mil millones, `int` se queda corto y necesitas `long`.

| Tipo      | Tamaño               | Rango aproximado                         | Uso habitual                                                                                               | Ejemplo                  |
| --------- | -------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------ |
| `byte`    | 8 bits               | ±1.27 × 10²                              | Casi nunca suelto: aparece como `byte[]` al leer un archivo o el cuerpo de una petición                    | `byte level = 5;`        |
| `short`   | 16 bits              | ±3.27 × 10⁴                              | Prácticamente nunca en backend; solo para ahorrar memoria en arrays enormes                                | `short year = 2025;`     |
| `int`     | 32 bits              | ±2.14 × 10⁹                              | El entero por defecto: contadores, índices de bucle, edades, cantidades                                    | `int age = 31;`          |
| `long`    | 64 bits              | ±9.2 × 10¹⁸                              | Ids de base de datos y marcas de tiempo en milisegundos (`System.currentTimeMillis()`)                     | `long id = 1234567890L;` |
| `float`   | 32 bits              | ±3.4 × 10³⁸ (~7 cifras significativas)   | Casi nunca: gráficos o datos científicos donde sobra precisión y falta memoria                             | `float tax = 0.21f;`     |
| `double`  | 64 bits              | ±1.7 × 10³⁰⁸ (~15 cifras significativas) | Medidas y cálculos científicos (pesos, distancias, porcentajes). **Nunca dinero** — para eso, `BigDecimal` | `double price = 19.99;`  |
| `boolean` | 1 bit de información | `true` o `false`                         | Estados de sí/no y el resultado de una condición: `isActive`, `hasPermission`                              | `boolean active = true;` |
| `char`    | 16 bits              | Una unidad de código UTF-16 (0 a 65,535) | Un único carácter suelto: una inicial, un separador, una nota de examen                                    | `char grade = 'A';`      |

La columna `Uso habitual` es la que contesta a "¿y cuál elijo yo?": en el día a día vas a escribir `int`, `long`, `boolean` y `double`, y los otros cuatro los vas a **leer** en código ajeno mucho más de lo que los vas a escribir.

La columna `Tamaño` merece una lectura más cuidadosa, porque en realidad responde a dos preguntas distintas que casi siempre dan el mismo número:

- **Cuánta información distinta cabe en el tipo** — cuántos valores diferentes puede representar.
- **Cuántos bits de memoria le reserva la JVM** — lo que ocupa de verdad en la RAM.

Para los siete tipos numéricos las dos respuestas coinciden: un `int` guarda 32 bits de información y ocupa 32 bits. Por eso puedes leer esa columna sin pensarlo.

`boolean` es la única fila donde se separan. De información transporta exactamente un bit: solo tiene dos valores posibles, `true` y `false`, y para distinguir dos valores basta un bit. De memoria ocupa mucho más, porque la especificación de la JVM no define ninguna forma de guardar un bit suelto — una variable o un campo `boolean` se queda con una ranura entera, que en la práctica es el espacio de un `int`. La única excepción es cuando están en fila dentro de un `boolean[]`: ahí sí se compactan, a un byte por elemento.

> **Qué te está diciendo entonces el `1 bit` de esa fila.** Te dice que el tipo tiene dos valores posibles, no que te cueste un bit de RAM. Es la diferencia entre "este dato solo necesita un bit para expresarse" y "este dato ocupa un bit en memoria" — lo primero es cierto, lo segundo no. En la práctica esto no cambia ni una línea del código que escribas; está aquí para que la fila no te deje una idea falsa de lo que cuesta un `boolean`.

Un **carácter Unicode** es cualquier símbolo de cualquier sistema de escritura del mundo: letras latinas, chino, árabe, emojis, símbolos matemáticos. El estándar Unicode asigna un número único (un _code point_) a cada símbolo — y `char` almacena una porción de 16 bits de esa numeración, de 0 a 65,535.

> **Alcance exacto: un `char` no almacena "cualquier carácter Unicode".** Lo que guarda un `char` es un número de 16 bits, de 0 a 65,535, y ese número es el code point del símbolo: su posición en la tabla de Unicode. El problema es que esa tabla tiene muchos más símbolos que 65,536 — llega hasta la posición 1,114,111 — así que un `char` solo alcanza a los símbolos que caen dentro de sus primeras 65,536 posiciones. Eso es lo que significa "hasta U+FFFF": `U+FFFF` es la manera habitual de escribir el número 65,535 en hexadecimal, y marca el último símbolo al que llega un `char`. Ahí dentro caben las letras latinas, el griego, el cirílico, el árabe y la mayor parte del chino. Todo lo que está por encima de ese número — emojis, muchas escrituras históricas, la mayoría de los alfanuméricos matemáticos — no cabe en 16 bits, y Java lo guarda partido en **dos** `char` que solo significan algo juntos (un _par sustituto_ o _surrogate pair_). Por eso no existe ningún `char` que valga "😀": no es que no quepa por poco, es que hacen falta dos `char` para almacenarlo. Pruébalo y el compilador te detiene antes de que el programa llegue a ejecutarse:
>
> ```java
> char c = '😀';   // MAL — error: character literal contains more than one UTF-16 code unit
> ```
>
> Ese reparto en uno o dos `char` no se queda dentro del tipo `char`: lo arrastra también `String`, que no es más que una secuencia de `char`. Por eso `"😀".length()` devuelve **2**, no 1: `length()` no cuenta símbolos, cuenta cuántos `char` tiene el `String`, y el emoji ocupa dos de ellos. Si lo que quieres es contar los símbolos tal y como los ve una persona al leerlos — el emoji cuenta como uno, aunque por dentro ocupe dos `char` —, ese conteo te lo da `"😀".codePointCount(0, 2)`, que devuelve **1**. Este es el mecanismo detrás de todo bug de "mi substring cortó un emoji por la mitad". En desarrollo web rara vez tocas `char` directamente — el texto completo va en `String` — pero la sorpresa de la longitud te llega igualmente a través de `String`.

En la práctica usas `int`, `long`, `double` y `boolean` para casi todo. `float` y `byte` raramente se necesitan.

### Variables de referencia y `null`

```java
int number;      // declarado, todavía sin asignar
String name;     // declarado, todavía sin asignar
```

En el código de arriba, `name` plantea una pregunta que `number` no puede plantear: los dos están declarados y a ninguno se le ha asignado nada todavía, así que ¿qué tiene escrito `name` dentro?

`number` es un hueco de 32 bits en el que siempre hay un número escrito. Un campo `int` de una clase que declaras y nunca asignas arranca valiendo `0` — sí, exactamente eso: se declara sin valor y empieza en `0`, porque Java rellena esos 32 bits con ceros al crear el objeto. (La variable local es el caso aparte: ahí Java no rellena nada, y el compilador te obliga a asignarla antes de leerla.) Y no hay forma de dejar ese hueco «vacío»: las 32 posiciones están siempre ocupadas por ceros y unos, y todas las combinaciones posibles de esos bits ya están cogidas — cada una significa un número concreto. No queda ninguna libre a la que darle el significado «aquí no hay nada».

`name` no guarda el texto: guarda la dirección de memoria donde está el objeto `String`. Con las direcciones sí queda sitio libre, porque hay valores que no corresponden a ningún objeto real. Java aparta uno de esos valores — no un objeto ni un bit, sino uno de los patrones de bits que caben en el hueco de la dirección y que no corresponden a la posición de ningún objeto real — y le da un solo significado — «esta variable no apunta a ningún objeto» — y ese valor es **`null`**. Por eso `name` puede contestar a la pregunta de arriba y `number` no: `null` es una dirección más de las que caben en el hueco, que existe precisamente para decir que ahí no hay nada.

```java
String name = null;      // BIEN — la caja existe y contiene "apunta a nada"
int number = null;       // MAL — error: incompatible types: <null> cannot be converted to int
```

Esa es toda la división primitivo-frente-a-referencia que necesitas para esta página: una variable primitiva apunta a su valor — o más exactamente, _es_ su valor —, mientras que una variable de referencia apunta a un objeto y puede no apuntar a ninguno.

> **Qué queda por explicar de `null`, y en qué archivo está cada parte.** Poder leer `null` en los ejemplos que quedan de este mismo archivo — la comprobación `user != null` de la sección de operadores, el `Long id` que empieza valiendo `null`, el `null` que devuelve un mapa cuando la clave no existe — es todo lo que este archivo te pide. Quedan tres preguntas abiertas, y ninguna se puede contestar aquí porque cada una necesita algo que todavía no has estudiado.
>
> La primera: qué hay escrito exactamente dentro de una variable de referencia, y por qué el programa revienta en la línea en la que usas una referencia que vale `null` y no antes. Eso lo tienes en [05-modelo-de-memoria.md](05-modelo-de-memoria.md).
>
> La segunda: en qué punto del código se comprueba si un valor es `null`. Lo normal es comprobarlo en la primera línea del método que lo recibe: si el valor que llega es `null`, el método corta ahí mismo y ni siquiera empieza a trabajar con él, de modo que un valor inservible no llega a las líneas de más abajo ni a los métodos que esas líneas llaman. A esa comprobación de la primera línea se le llama _cláusula de guarda_ (en inglés, _guard clause_ — es el nombre con el que la vas a encontrar en el código y en cualquier revisión). Para escribirla te hace falta saber antes qué es un parámetro y qué es un valor de retorno que está en [04-metodos.md](04-metodos.md).
>
> La tercera: qué es un objeto — eso a lo que apunta la referencia cuando no vale `null` — y cómo se compara un objeto con otro. Eso está en [06-poo-clases.md](06-poo-clases.md).

### Tipos por categoría

La tabla de arriba te dio los 8 primitivos completos, con su tamaño y su rango. Esta sección los reagrupa según para qué sirven y se detiene solo en los que vas a escribir de verdad en el día a día, con las trampas que traen consigo.

**Números enteros** — para contar, IDs, edades, cantidades:

- `byte` y `short` — números enteros igual que `int` y `long`, solo que con un rango mucho más pequeño. No pueden almacenar decimales. En la práctica los verás en código antiguo o al trabajar con datos binarios.
- `int` — tu número entero de uso diario. Úsalo por defecto.
- `long` — cuando `int` no es suficientemente grande. Los IDs de base de datos suelen ser `Long` porque crecen mucho. Fíjate en el sufijo `L`: `1234567890L`.

> **Por qué el sufijo `L` no es opcional.** Un **literal** es un valor escrito tal cual en el código fuente: el `1234567890123` del ejemplo de abajo, o el `0.21` que verás en el siguiente apartado — el número en sí, no la variable que lo guarda ni el resultado de una operación. Y un literal numérico **entero** a secas en el código fuente de Java es un `int`, siempre — solo el entero: un literal con parte decimal como `0.21` es un `double` por defecto, nunca un `float`, y de eso va el sufijo `f` del apartado siguiente. El compilador decide el tipo del literal _antes_ de mirar la variable a la que lo estás asignando. Así que en `long id = 1234567890123;` el compilador lee `1234567890123` como un literal `int`, comprueba que no cabe en 32 bits, y se detiene ahí mismo:
>
> ```java
> long id = 1234567890123;    // MAL — error: integer number too large
> long id = 1234567890123L;   // BIEN — la L convierte el literal en long desde el principio
> ```
>
> Fíjate en dónde apunta el error: al literal, no a la asignación. El `long` de la izquierda no llega a ayudar, porque el literal ya era ilegal por sí solo. El sufijo es lo que cambia el tipo del literal. La `l` minúscula también funciona, pero nadie la usa — es indistinguible de un `1` en la mayoría de las fuentes tipográficas.

**Números decimales** — para precios, porcentajes, tasas:

- `float` — la mitad de precisión que `double`: solo ~7 cifras significativas. Si necesitas `3.141592653589793`, un `float` lo almacena como `3.1415927` — pierdes dígitos. Úsalo solo si la memoria es crítica (casi nunca en desarrollo web). Fíjate en el sufijo `f`: `0.21f`.

  > **El sufijo `f` tiene el mismo mecanismo que `L`, en dirección contraria.** Un literal decimal a secas es siempre un `double`. Así que `float tax = 0.21;` le pide al compilador que meta un `double` de 64 bits en un `float` de 32 bits, lo cual puede perder dígitos — y Java nunca hace una conversión con pérdida en tu nombre sin que lo pidas explícitamente:
  >
  > ```java
  > float tax = 0.21;    // MAL — error: incompatible types: possible lossy conversion from double to float
  > float tax = 0.21f;   // BIEN — la f convierte el literal en float, no hace falta conversión
  > ```
  >
  > Lee el mensaje literalmente: _posible_ pérdida, no _segura_ pérdida. El compilador no está afirmando que este número concreto vaya a perder precisión; rechaza toda la dirección `double` → `float` por principio, porque no puede demostrar en general que sea segura. Esa palabra "possible" es la firma del compilador para cualquier narrowing que bloquea, y la volverás a ver en la sección _Narrowing_ más abajo.

- `double` — la opción por defecto para decimales. Mayor precisión: hasta ~15 cifras significativas. `3.141592653589793`, por ejemplo, cabe cómodamente en un `double`.

> **Dinero — nunca `double` ni `float`.** Para valores financieros usa `BigDecimal`: una clase de Java pura, del paquete `java.math`, que hace aritmética exacta. `double` no puede representar 0.1 exactamente en binario porque los ordenadores expresan los números como sumas de potencias de 2 (1/2, 1/4, 1/8…), y 0.1 no se puede expresar como una suma finita de esas potencias — igual que 1/3 no se puede escribir exactamente en decimal (0.333…). El procesador guarda la aproximación más cercana que puede construir, y ese pequeño error se va acumulando entre operaciones hasta que obtienes `0.09999999...` en vez de `0.1`. `BigDecimal` evita esto operando sobre las cifras reales, sin el error de representación.

**Boolean** — para flags y condiciones. Un _flag_ (bandera) es una variable cuyo único trabajo es responder sí o no a una pregunta sobre el estado de algo: `isActive` ("¿esta cuenta sigue activa?"), `hasRole` ("¿este usuario tiene este rol?"), `emailVerified` ("¿ya confirmó el correo?"). No guarda un dato del dominio, guarda una decisión ya tomada, para que el código que viene después pueda preguntar por ella con un `if` en vez de recalcularla:

- `boolean` — solo almacena `true` o `false`. Usado para `isActive`, `hasRole`, `isEmpty`.

**Carácter** — para caracteres individuales:

- `char` — un carácter, entre comillas simples: `'A'`. Raramente usado en desarrollo web.

### `int` o `long` — cómo elegir, y cuándo el literal necesita la `L`

La tabla te da los rangos exactos, pero no hace falta que te los aprendas: para decidir entre `int` y `long` te basta con un solo número de referencia, los 2.1 mil millones del techo del `int`. **Por defecto usa `int`, y recurre a `long` solo cuando el valor pueda razonablemente superar los 2.1 mil millones.** En trabajo de backend eso es una lista corta y predecible: identificadores de base de datos (una tabla rara vez tiene dos mil millones de filas, pero los ids vienen de una secuencia que nunca reutiliza un número, así que acaban superando el conteo de filas), timestamps en milisegundos desde 1970 (`System.currentTimeMillis()` devuelve un `long`, y los milisegundos superaron el rango de `int` a los 25 días de empezar 1970), y medidas de tiempo en nanosegundos (`System.nanoTime()`, que se usa para cronometrar cuánto tarda un método: un `int` de nanosegundos se agota a los 2.1 segundos). Edades, tamaños de lista, números de página, códigos de estado HTTP y contadores de bucle se quedan en `int` para siempre.

> **Elegir el tipo y escribir el sufijo son dos decisiones separadas.** La `L` pertenece al _literal_, no a la variable, así que una variable `long` no necesita una `L` automáticamente. Lo que hace que la primera línea de abajo funcione es que ahí hay un literal `int` guardándose en un `long`, y esa dirección — de un tipo pequeño a uno más grande — es precisamente la que Java permite sin pedirte permiso: tiene nombre propio, **widening**, y la hace sola, en silencio. La contraria, meter un valor grande en un tipo más pequeño, es **narrowing**, y esa te la exige por escrito. Las dos tienen su sección más abajo; por ahora quédate con que el sufijo no tiene nada que ver con el tipo de la variable, sino con si el literal cabe o no en un `int`:
>
> ```java
> long smallId = 5;               // BIEN — no hace falta sufijo
> long bigId   = 1234567890123L;  // aquí la L es obligatoria
> ```
>
> La primera línea está bien porque `5` es un literal `int` perfectamente legal y `int` → `long` es una conversión de widening, que Java hace en silencio. La segunda necesita el sufijo porque el literal en sí no cabe en 32 bits, y el compilador juzga el literal antes de mirar siquiera la variable. Así que la regla es: **pon el sufijo al literal solo cuando el literal por sí solo sea demasiado grande para un `int`**. Escribir `5L` no está mal, es solo ruido.

Hay un tercer lugar donde la `L` decide el resultado, y no tiene nada que ver con el tipo declarado de la variable: la aritmética. `1000 * 60 * 60 * 24 * 30` se desborda incluso cuando guardas el resultado en un `long`, porque la multiplicación se ejecuta en `int` antes de que se considere siquiera la asignación. Eso último es el punto que hay que entender bien, porque es contraintuitivo: el compilador resuelve la expresión de la derecha **entera y por su cuenta**, sin mirar ni una vez a qué variable va a parar. Y el tipo de una operación aritmética lo deciden sus operandos, nunca su destino: `int * int` da `int`, siempre. La traza es esta:

> 1. `1000 * 60` → los dos operandos son literales `int`, así que el resultado es un `int`: `60000`.
> 2. `60000 * 60` → sigue siendo `int * int`: `3600000`.
> 3. `3600000 * 24` → `int`: `86400000`.
> 4. `86400000 * 30` → `int` otra vez, pero el resultado real, 2.592.000.000, no cabe en un `int`. Se desborda **aquí**, en el paso 4, y lo que queda es un número negativo.
> 5. **Solo ahora** entra en juego la asignación: se coge ese `int` ya roto y se convierte a `long` (widening). La conversión funciona perfectamente — está convirtiendo la basura con total fidelidad.
>
> Declarar la variable como `long` llega tarde: el daño ya está hecho en el paso 4. Lo que arregla el cálculo es forzar a que la aritmética misma sea `long`, poniendo la `L` en el primer literal (`1000L * 60 * 60 * 24 * 30`): a partir de ahí cada paso es `long * int`, Java promueve el `int` a `long` y toda la cadena se calcula con 64 bits.

Eso es la sección _Overflow_ de más abajo — y es el caso en el que una `L` que falta produce un número equivocado en vez de un error de compilación.

### Construyendo un `BigDecimal` — nunca `new BigDecimal(0.1)`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → leer: "BigDecimal" — los constructores y por qué el de `String` es la opción segura por defecto.

La sección anterior te dijo que uses `BigDecimal` en lugar de `double` para dinero. Hay una trampa un paso más allá: `BigDecimal` tiene un constructor que recibe un `double`, y usarlo te devuelve exactamente el problema del `double`, solo que ahora congelado dentro de un objeto que dice ser exacto.

Mira lo que produce realmente cada una de las tres formas de construir "0.1". Esto es output real:

```java
new BigDecimal(0.1)        // 0.1000000000000000055511151231257827021181583404541015625   ← MAL
BigDecimal.valueOf(0.1)    // 0.1                                                          ← BIEN
new BigDecimal("0.1")      // 0.1                                                          ← BIEN
```

El mecanismo es el mismo que ya describió la sección _Tipos por categoría_, más arriba en este archivo, en su aviso **Dinero — nunca `double` ni `float`**. Para cuando `new BigDecimal(0.1)` se ejecuta, el literal `0.1` _ya_ se ha convertido en un `double`, y un `double` no puede contener 0.1 — contiene el valor binario más cercano que puede construir a partir de mitades, cuartos y octavos, que es ese número de 55 dígitos. `BigDecimal` a partir de ahí hace su trabajo perfectamente: registra con fidelidad el valor exacto que recibió. El error no lo introdujo `BigDecimal`; ya venía incorporado en el argumento antes incluso de llamar al constructor, y `BigDecimal` es simplemente la primera herramienta lo bastante precisa como para mostrártelo.

Las dos formas seguras evitan por completo que el valor exista alguna vez como `double`:

- **`new BigDecimal("0.1")`** — el constructor de `String` lee los dígitos que escribiste literalmente, carácter a carácter. No ocurre ninguna aproximación binaria porque nunca interviene un `double`. Recurre a esto cuando el valor viene de un archivo de configuración, un cuerpo JSON, o un literal que escribiste tú.
- **`BigDecimal.valueOf(0.1)`** — recibe un `double`, pero internamente lo pasa primero por `Double.toString()` y luego parsea _ese_ texto. `Double.toString()` imprime el decimal más corto que, al volver a convertirse, reproduce el mismo `double` — que para `0.1` es la cadena `"0.1"` — así que acabas exactamente en el mismo valor que te habría dado el constructor de `String`. Recurre a esto cuando el valor ya está en una variable `double` y no puedes volver atrás a cambiar de dónde viene.

> **Entonces, ¿para qué existe el constructor con `double`?** Porque es el único que dice la verdad sobre un `double`. Si estás depurando _por qué_ un cálculo se desvió, `new BigDecimal(unDouble)` es la herramienta que te enseña el valor realmente almacenado, en lugar del número redondeado y amigable. Es un instrumento de diagnóstico, no una forma de crear valores que almacenan dinero. En el código que llega a producción, trata `new BigDecimal(` aplicado a un `double` o `float` como un bug — es exactamente lo que marca un revisor en un pull request. (Pasar un `int` o un `long` es inofensivo, ya que esos guardan sus valores con exactitud; solo los tipos de coma flotante llegan ya equivocados.)

En el backend de TimeTrack, `TimeEntry.hours` está declarado como `private BigDecimal hours;` precisamente por esto (`projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`) — las horas se suman en los informes, y un `double` iría desviándose a medida que se acumularan suficientes entradas.

### Comparando `BigDecimal` — `compareTo()` en vez de `<`, `>` o `equals()`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → leer: "Operations on BigDecimal" — `compareTo()` y por qué no es `equals()`.

Imagina que un servicio necesita validar que las horas trabajadas estén entre 0.5 y 24 (exactamente el caso de `TimeEntry.hours` ). Si `hours` es `BigDecimal`, escribir `hours < new BigDecimal("24")` ni siquiera compila:

```
error: bad operand types for binary operator '<'
  first type:  BigDecimal
  second type: BigDecimal
```

La primera línea del error nombra el fallo — `bad operand types for binary operator '<'`, es decir, que los operandos que le has dado a `<` no son de un tipo que ese operador acepte. Las dos líneas adicionales son el compilador diciéndote qué encontró a cada lado del operador, para que puedas ver que ninguno de los dos es un número que sepa comparar. `<` y `>` están integrados en el lenguaje solo para primitivos, y `BigDecimal` es un objeto, así que no hay nada sobre lo que esa instrucción pueda actuar. Java no tiene **sobrecarga de operadores**: no te deja redefinir qué significan `+`, `<` o `==` cuando los aplicas a tus propias clases. El significado de cada símbolo está fijado dentro del lenguaje y ninguna clase puede cambiarlo. (En otros lenguajes sí se puede — en C++ o en Python una clase puede declarar qué hace `<` sobre sus objetos.)

La clase `BigDecimal` no tiene ninguna forma de decir "cuando alguien escriba `<` sobre mí, haz esto". Lo que una clase sí puede ofrecerte son **métodos** — nombres a los que llamas explícitamente con un punto: en lugar de un símbolo reservado por el lenguaje, `BigDecimal` te ofrece el método `compareTo()`.

```java
BigDecimal a = new BigDecimal("0.5");
BigDecimal b = new BigDecimal("24");

a < b;              // MAL  — no compila: `<` no existe para objetos
a.compareTo(b) < 0; // BIEN — un método de la clase, y el `<` ya compara dos int
```

Otra opción para comparar dos `BigDecimal` suele ser pensar en usar `.equals()`, pero ahí hay una trampa: `.equals()` en `BigDecimal` también compara la **escala** (cuántos decimales tiene representados internamente el número), no solo el valor matemático. Por eso `new BigDecimal("24.0").equals(new BigDecimal("24"))` devuelve `false` — para Java, "24.0" y "24" son objetos con escalas distintas (una cifra decimal frente a ninguna), aunque matemáticamente sean el mismo número.

La forma correcta de comparar dos `BigDecimal` es usando `compareTo()`. `BigDecimal` implementa la interfaz `Comparable<BigDecimal>`, que aporta el método `compareTo(BigDecimal other)`. Una **interfaz** aquí es solo un contrato que una clase firma diciendo "yo ofrezco estos métodos" — qué son las interfaces y cómo escribir las tuyas propias está en [07-interfaces-abstractas.md](07-interfaces-abstractas.md), y el `<BigDecimal>` entre corchetes angulares es un _argumento de tipo genérico_, léelo por ahora como "comparable específicamente contra otros `BigDecimal`" y se cubre en detalle en [09-genericos.md](09-genericos.md). Ninguno de los dos es algo que necesites hoy; solo necesitas saber de dónde viene `compareTo`. Este método sí compara el valor matemático real de los dos `BigDecimal` que intervienen — el objeto sobre el que lo llamas (`this`) y el que le pasas como argumento (`other`) —, ignorando la escala, y devuelve un `int`:

- negativo si `this` es menor que `other`
- `0` si son matemáticamente iguales
- positivo si `this` es mayor que `other`

`this` es el `BigDecimal` que está a la izquierda del punto, y `other` el que va entre paréntesis:

```java
new BigDecimal("10").compareTo(new BigDecimal("24"));   // negativo → this (10) es menor que other (24)
new BigDecimal("24").compareTo(new BigDecimal("24.0")); // 0        → mismo valor matemático, escalas distintas
new BigDecimal("30").compareTo(new BigDecimal("24"));   // positivo → this (30) es mayor que other (24)
```

> **Fíjate solo en el signo, nunca en el número exacto.** El javadoc de `compareTo` promete un `int` negativo, cero o positivo, y nada más: no garantiza que sea `-1` o `1`. Por eso el patrón correcto es siempre `... compareTo(...) < 0`, y nunca `... compareTo(...) == -1`.

El patrón siempre es el mismo: llamas a `compareTo()`, y comparas ese `int` resultante con `0` usando los operadores normales (`<`, `>`, `==`) — porque ahora sí estás comparando dos primitivos `int`, no dos objetos `BigDecimal`.

```java
BigDecimal hours = request.getHours();

if (hours.compareTo(new BigDecimal("0.5")) < 0 || hours.compareTo(new BigDecimal("24")) > 0) {
    throw new RuntimeException("Hours must be between 0.5 and 24");
}
```

(`throw new RuntimeException(...)` es **lanzar una excepción**: el método se detiene en esa línea y, en vez de devolver un valor, entrega un objeto de error a quien lo llamó. Quién recoge ese error después, y cómo se maneja, es [11-excepciones.md](11-excepciones.md).)

Léelo así: "si `hours` comparado con 0.5 da negativo (es decir, `hours` es menor que 0.5) O `hours` comparado con 24 da positivo (`hours` es mayor que 24), lanza la excepción".

> **`compareTo() == 0` para igualdad, nunca `equals()` — como ya vimos antes.** Si alguna vez necesitas comprobar igualdad de valor entre dos `BigDecimal` (por ejemplo, "¿el total facturado es exactamente 100?"), usa `total.compareTo(new BigDecimal("100")) == 0`, no `total.equals(new BigDecimal("100"))` — porque si `total` llegó como `"100.00"` (con dos decimales, algo habitual cuando viene de una columna `DECIMAL(10,2)` de la base de datos), `.equals()` devolvería `false` aunque el valor sea idéntico.

//TODO: MANTENEMOS ESTE TODO PORQUE HE REVISADO HASTA ESTA PARTE DEL ARCHIVO Y DEBO SEGUIR REVISANDO MAS ADELANTE

### Aritmética de `BigDecimal` — cada operación devuelve un objeto nuevo, y la división exige una escala

> 📖 Docs: [Java SE 25 API — `java.math.BigDecimal`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html) → leer: la descripción de la clase ("immutable, arbitrary-precision signed decimal numbers") y las entradas de `divide` y `setScale`.

`BigDecimal` es **inmutable**: ningún método sobre él cambia jamás el objeto sobre el que lo llamaste. Todo método aritmético construye y devuelve un `BigDecimal` _nuevo_ y deja el original exactamente como estaba. Ese es, con diferencia, el error más común con `BigDecimal`, y falla en silencio — el código compila, se ejecuta, y reporta el número viejo:

```java
BigDecimal total = new BigDecimal("10.00");
total.add(new BigDecimal("5.00"));          // MAL — el resultado se calcula y se descarta
System.out.println(total);                  // 10.00

total = total.add(new BigDecimal("5.00"));  // BIEN — reasigna para conservar el resultado
System.out.println(total);                  // 15.00
```

No hay error de compilación, porque la primera llamada es una expresión legal cuyo valor decidiste ignorar — exactamente igual que escribir `list.size();` en una línea suelta. El mecanismo merece decirse sin rodeos: `add` no tiene forma de cambiar `total`, porque el objeto al que apunta `total` no expone nada que altere sus dígitos; todo lo que `add` puede hacer es calcular la suma, envolverla en un objeto nuevo, y entregarte la dirección de ese objeto nuevo. Si nadie guarda esa dirección, es basura un instante después.

Las cuatro operaciones son métodos con nombre, por la misma razón que dio la sección de `compareTo`: Java no tiene sobrecarga de operadores, así que una clase nunca puede enseñarle a `+` a funcionar sobre ella.

```java
BigDecimal net  = new BigDecimal("100.00");
BigDecimal rate = new BigDecimal("0.21");

BigDecimal vat   = net.multiply(rate);   // 21.0000   ← cuatro decimales, no dos
BigDecimal gross = net.add(vat);         // 121.0000
BigDecimal diff  = gross.subtract(net);  // 21.0000
```

**La escala es el número de dígitos que se conservan tras el punto decimal, y es parte del objeto, no un ajuste de presentación.** `multiply` suma las dos escalas — dos decimales por dos decimales da cuatro — y por eso sale `21.0000` donde esperabas `21.00`. Lo corriges cuando estás listo para guardar o mostrar el valor, con `setScale`, que recibe la escala que quieres más un `RoundingMode` que dice qué hacer con los dígitos que descarta:

```java
BigDecimal vatToStore = vat.setScale(2, RoundingMode.HALF_UP);   // 21.00
```

`RoundingMode.HALF_UP` es la regla de redondeo que se enseña en el colegio — un medio redondea alejándose de cero, así que `0.125` se convierte en `0.13` — y es normalmente lo que quiere la facturación. `HALF_EVEN` (redondeo bancario) es la otra que te vas a encontrar en código financiero: envía un medio al dígito _par_ más cercano, así que una larga serie de redondeos no va derivando hacia arriba.

> **La división es la única operación que se niega a ejecutarse hasta que le dices cómo redondear.** `divide` con un solo argumento calcula el cociente _exacto_, y cuando el cociente exacto no termina nunca no hay ningún valor correcto que pudiera devolver — así que lanza una excepción en lugar de inventarse uno en silencio:
>
> ```java
> new BigDecimal("10").divide(new BigDecimal("3"));
> // java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
> ```
>
> Ningún otro tipo numérico tiene este problema, porque ningún otro tipo numérico es exacto. `10.0 / 3` en `double` devuelve `3.3333333333333335` sin protestar — una respuesta que ya es ligeramente incorrecta, que es precisamente el comportamiento que `BigDecimal` existe para rechazar. El arreglo es indicar la escala y el redondeo que aceptas, en la misma llamada:
>
> ```java
> new BigDecimal("10").divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);   // 3.33
> ```
>
> Trata el `divide` de un solo argumento como un defecto en código de aplicación: funciona para `10 / 4` y lanza excepción para `10 / 3`, así que es un bug esperando el input adecuado — la misma forma de trampa que una comparación que solo funciona para números pequeños.

> **Un `BigDecimal` usado como clave de un mapa es el único sitio donde `equals` es el método que realmente se ejecuta.** La sección de arriba te dijo que compares dinero con `compareTo`, pero un `HashMap` nunca pregunta qué comparación preferirías: llama a `equals` y a `hashCode` sobre la propia clave, y ambos incluyen la escala. Así que `map.put(new BigDecimal("1.0"), x)` seguido de `map.get(new BigDecimal("1.00"))` te da `null` — dos claves, matemáticamente idénticas, archivadas por separado. La documentación de la API avisa del mismo desajuste desde el otro lado para `SortedMap` y `SortedSet`: esos ordenan por `compareTo`, así que tratan las dos como _una sola_ clave mientras `equals` insiste en que son dos, y el javadoc llama a ese orden natural "inconsistent with equals". La regla práctica es evitar claves `BigDecimal`, o normalizar cada clave con `setScale(2, RoundingMode.HALF_UP)` antes de meterla. Los mapas llegan en [10-colecciones.md](10-colecciones.md); por qué `equals` y `hashCode` los gobiernan es [06-poo-clases.md](06-poo-clases.md).

---

## Variables

> 📖 Docs: [Oracle Docs — Primitive Data Types](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html) → leer: "Default Values" — qué contiene un campo antes de que le asignes nada, y por qué una variable local es distinta.

Una variable es un espacio con nombre en memoria donde guardas un dato — una de las cajas del diagrama del principio de este archivo. En Java siempre escribes el tipo antes del nombre, porque el compilador necesita saber cuán grande es esa caja y qué puede entrar legalmente en ella antes de que el programa se ejecute siquiera. Puedes declarar y asignar en la misma línea, o declarar primero y asignar después:

```java
int age = 31;           // declaración + asignación en una línea
int count;              // solo declaración — la caja existe, aún no hay nada dentro
count = 0;              // asignación — ahora sí contiene algo
```

### El compilador no te deja leer una variable local que nunca asignaste

Separar la declaración de la asignación es legal, pero lleva una regla asociada, y se verifica en tiempo de compilación en lugar de dejarla estallar en tiempo de ejecución. Todo camino posible del código tiene que asignar la variable antes de que nada la lea:

```java
int count;
System.out.println(count);   // MAL — error: variable count might not have been initialized
```

El compilador ejecuta un análisis llamado **asignación definida** (_definite assignment_): recorre todas las rutas posibles que podría tomar la ejecución desde la declaración hasta esta línea y se pregunta "¿hay alguna ruta que llegue aquí sin pasar por una asignación?" Si existe aunque sea una sola de esas rutas, se niega a compilar. Por eso el mensaje dice "_might_ not have been initialized" ("podría no haberse inicializado") en lugar de "no se inicializó" — el compilador no está afirmando que esta ejecución concreta vaya a fallar; está diciendo que no puede demostrar lo contrario para todas las ejecuciones posibles.

> **Entonces, ¿por qué esto sí compila para un campo?** Porque la regla se aplica solo a **variables locales** — las declaradas dentro de un método. Un **campo** (declarado directamente en el cuerpo de la clase, fuera de cualquier método) no está cubierto por la asignación definida: la JVM le da a todo campo un valor por defecto automático en cuanto se crea el objeto. Los campos numéricos empiezan en `0` (`0.0` para `double`/`float`), los campos `boolean` en `false`, y todo campo de tipo objeto — `String`, `Integer`, `User` — en `null`.
>
> ```java
> public class User {
>     private String name;       // empieza en null   — una referencia que apunta a nada
>     private boolean active;    // empieza en false
>     private Long id;           // empieza en null   — Integer/Long son objetos, así que null, no 0
> }
> ```
>
> La razón de esta diferencia está en dónde vive cada uno. Un campo pertenece a un objeto en el heap, y la JVM pone a cero todo ese bloque de memoria mientras lo reserva, así que un valor por defecto sale gratis. Una variable local vive en el stack frame del método, que es memoria reutilizada de lo que se ejecutara antes en ese mismo sitio — así que una local sin asignar contendría basura sobrante, y en lugar de poner a cero cada frame, el lenguaje simplemente prohíbe leer una así. Es una consecuencia directa de la separación stack/heap que cubre [05-modelo-de-memoria.md](05-modelo-de-memoria.md).
>
> Este es también el mecanismo detrás de algo que ya conociste: el `Long id` de una entidad JPA es `null` antes de que se guarde la fila, y eso no es Hibernate poniéndolo a `null` — es el valor por defecto del campo, que nada ha sobrescrito todavía.

### Scope — dónde es visible el nombre

Una variable existe solo dentro del bloque `{ }` en el que se declaró, y desaparece al llegar a la llave de cierre. Ese bloque se llama su **scope** (alcance):

```java
if (age > 18) {
    String message = "adult";
}
System.out.println(message);   // MAL — cannot find symbol: variable message
```

La variable no está "vacía" aquí fuera — el nombre directamente no existe, por eso el error es `cannot find symbol` en lugar de una queja sobre null. La consecuencia práctica es que si necesitas un valor después de un bloque, lo declaras _antes_ del bloque y lo asignas dentro. Esto es el mismo scoping por bloques que `let` y `const` en JavaScript; Java simplemente no tiene equivalente del viejo `var` con scope de función.

Esa única regla — _un nombre vive dentro de las llaves en las que se declaró_ — es todo el scope, y produce los cuatro tipos de variable que te vas a encontrar, cada uno con una vida distinta:

```
class TimeEntry {                       ┐
    private BigDecimal hours;           │  CAMPO (FIELD) — visible en todos los
                                        │  métodos de la clase, vive lo que vive el objeto
    void validate(int maxHours) {       ┤
                                        │  PARÁMETRO — una variable local que rellena
        int extra = 0;                  │  quien llama; visible solo en este método,
                                        │  desaparece al terminar el método
        if (maxHours > 8) {             ┤
            String warning = "long";    │  LOCAL — visible desde su declaración
        }                               │  hasta el final del método
    }                                   │
}                                       │  LOCAL DE BLOQUE — `warning` muere en la `}`
                                        ┘  del if, tres líneas antes que `extra`
```

Léelo como un solo anidamiento: las llaves del campo son la clase, así que sobrevive a cada llamada; las llaves del parámetro y de las locales son el método, así que se crean de nuevo en cada llamada y se descartan cuando termina; y una variable declarada dentro de una `{ }` interior se descarta en esa llave interior. Un **parámetro** no es una categoría especial — es una variable local cuya asignación inicial la hace quien llama, y por eso siempre está definitivamente asignado y nunca necesita la regla de la sección anterior. Los campos, y dónde vive el objeto que los contiene, están en [06-poo-clases.md](06-poo-clases.md) y [05-modelo-de-memoria.md](05-modelo-de-memoria.md); los parámetros como mecanismo — cómo entra el valor de quien llama — están en [04-metodos.md](04-metodos.md). Aquí solo necesitas poder decir dónde es visible cada nombre.

### Convenciones de nombres

No las impone el compilador, pero todo código base en Java y todo revisor las espera, y Spring en sí mismo depende de la tercera:

- **`camelCase` para variables, campos y métodos** — `totalHours`, `isActive`, `findByEmail`. Primera palabra en minúscula, cada palabra siguiente con la inicial en mayúscula.
- **`UPPER_SNAKE_CASE` para constantes** — `MAX_HOURS`, `DEFAULT_ROLE`. Reservado para valores `static final`; verlo le dice al lector "esto nunca cambia" antes incluso de que lea los modificadores.
- **`PascalCase` para nombres de clase** — `TimeEntry`, `UserRepository`. Fíjate en que así es como distingues `Integer` (una clase) de `int` (un primitivo) de un vistazo.
- Los nombres se escriben completos, no abreviados. `numberOfEmployees`, no `numEmp`. El código Java es verboso por cultura, y una revisión de código en una consultora te va a señalar los nombres cortos.

### `final` — lo justo que necesitas aquí

`final` en una variable significa que puede asignarse exactamente una vez; una asignación posterior es un error de compilación (`cannot assign a value to final variable MAX_HOURS`). Con eso basta para leer las constantes `static final` nombradas arriba y los campos `private final` que aparecen en toda clase de servicio de Spring. Lo que `final` _no_ hace — congelar el objeto al que apunta una referencia — es una afirmación sobre objetos y no sobre valores, así que se responde en [06-poo-clases.md](06-poo-clases.md), junto con la inmutabilidad, los records, y la diferencia entre congelar un nombre y congelar lo que ese nombre nombra.

---

## Operadores — los cuatro grupos, y los dos que pueden saltarse su operando derecho

> 📖 Docs: [Oracle Java Tutorials — Operators](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html) → leer: "Assignment, Arithmetic, and Unary Operators" y "Equality, Relational, and Conditional Operators". La tabla de precedencia de la página padre merece un vistazo, no memorizarla.

Todo lo visto hasta ahora trataba sobre qué _contiene_ una variable. Los operadores son cómo combinas lo que contienen dos variables en un valor nuevo, y el conjunto habitual de Java es lo bastante pequeño como para exponerlo todo junto. Cuatro grupos cubren esencialmente todo el código de backend:

- **Aritméticos** — `+` `-` `*` `/` `%` — toman números, producen un número. `%` es el resto: `7 % 2` es `1`.
- **Comparación** (relacionales `<` `>` `<=` `>=` e igualdad `==` `!=`) — toman dos valores, producen un `boolean`.
- **Lógicos** — `&&` (y), `||` (o), `!` (no) — toman booleanos, producen un `boolean`.
- **Asignación** — `=` más las formas compuestas `+=` `-=` `*=` `/=` `%=` — guardan un valor en una variable, y la propia expresión produce el valor que se guardó.

Lo que produce cada grupo es lo que decide dónde puede aparecer, y esa es la parte donde los hábitos de JavaScript fallan. Un `if (...)` necesita un `boolean`, así que solo las expresiones de comparación y lógicas pueden ir directamente dentro de uno; una expresión aritmética tiene que compararse antes contra algo. Java no tiene valores truthy en absoluto — ningún string no vacío ni ningún número distinto de cero cuenta como "verdadero" — así que `if (name)` e `if (count)` no compilan, y el compilador lo dice exactamente en esos términos:

```java
if (name) { ... }    // MAL — error: incompatible types: String cannot be converted to boolean
```

Dos más que verás constantemente: `++` y `--` suman o restan uno en el sitio (`count++`), y el operador condicional de tres partes `condition ? a : b` elige entre dos valores. Ese último pertenece a [03-flujo-de-control.md](03-flujo-de-control.md), donde elegir es el tema.

> **`+=` esconde un cast, y eso es la definición del lenguaje, no una rareza.** Una asignación compuesta no es simplemente `a = a + b`: la especificación define `a += b` como `a = (T) (a + b)`, donde `T` es el tipo del lado izquierdo. Por tanto realiza, de forma invisible, la conversión de narrowing que un `=` normal se negaría a hacer sin un cast explícito:
>
> ```java
> int i = 5;
> i = i + 3.5;    // MAL — error: incompatible types: possible lossy conversion from double to int
> i += 3.5;       // ✅ compila — y i vale 8, porque 8.5 se truncó de vuelta a int
> ```
>
> Aquí no hay nada que arreglar en tu propia aritmética. El punto es reconocer `+=` como el único sitio donde ocurre una conversión de narrowing sin ningún cast visible, así que una asignación compuesta que compila nunca es prueba de que los dos tipos realmente coincidan.

### `=` cuando querías decir `==`

Escribir un signo igual en vez de dos es el desliz clásico de la familia C, y Java lo detecta — por la regla de tipos de arriba, no porque adivine tu intención. `if (count = 5)` asigna `5` a `count` y luego le entrega al `if` el _valor asignado_, un `int`, cuando necesita un `boolean`:

```java
if (count = 5) { ... }   // MAL — error: incompatible types: int cannot be converted to boolean
```

Eso es un error de compilación siempre — para todos los tipos excepto uno. Si la variable es `boolean`, la asignación produce un `boolean`, el `if` queda perfectamente satisfecho, y el código compila y se ejecuta haciendo algo que nunca quisiste:

```java
boolean active = false;
if (active = true) {     // ✅ compila — asigna true, y entra en la rama siempre
    ...
}
```

Nada te avisa en tiempo de compilación; IntelliJ lo marca como una inspección, y ese subrayado es lo único que hay entre tú y una rama que se ejecuta incondicionalmente. Es también la razón por la que una condición booleana se escribe `if (active)` y nunca `if (active == true)` — la forma corta no tiene ningún `=` que perder.

### Evaluación short-circuit — por qué `&&` y `||` pueden no mirar jamás su operando derecho

`&&` y `||` no evalúan los dos lados y luego combinan las dos respuestas. Evalúan el lado **izquierdo**, y luego preguntan si el lado derecho podría todavía cambiar el resultado:

- `A && B` — si `A` es `false`, el resultado es `false` sea lo que sea `B`, así que `B` nunca se evalúa.
- `A || B` — si `A` es `true`, el resultado es `true` sea lo que sea `B`, así que `B` nunca se evalúa.

Eso es **short-circuiting**, y no es una optimización que puede o no darse: es una garantía escrita en el lenguaje, y código real se construye sobre ella. El patrón que vas a escribir cien veces es una comprobación de null haciendo guardia delante de la llamada que fallaría:

```java
if (user != null && user.getName().isBlank()) { ... }
```

Cuando `user` es `null`, el lado izquierdo es `false`, el lado derecho nunca se evalúa, `user.getName()` nunca se llama, y no hay `NullPointerException`. Intercambia los dos operandos y la guarda no vale nada, porque la llamada ocurre antes que la comprobación que se suponía que la protegía:

```java
if (user.getName().isBlank() && user != null) { ... }   // MAL — NPE cada vez que user es null
```

El orden de los operandos está haciendo trabajo real aquí. Eso es inusual — `a + b` y `b + a` son la misma expresión — y es la consecuencia práctica más importante del short-circuiting.

> **"Nunca se evalúa" significa que nunca empieza, no que se deshace.** El código compilado comprueba el operando izquierdo y salta directamente por encima del bytecode del derecho, así que cualquier llamada a método, cualquier incremento y cualquier excepción que vivieran ahí simplemente no ocurren. Por eso poner trabajo con efectos secundarios dentro del operando derecho es una fuente fiable de bugs de "¿por qué esta línea nunca se ejecutó?": `if (isValid() && log(request))` no va a registrar ni una sola petición inválida.

> **Java también tiene `&` y `|`, que no hacen short-circuit.** Sobre dos booleanos producen la misma respuesta que `&&` y `||`, pero siempre evalúan los dos lados — así que la comprobación de null de arriba lanzaría excepción. Hay una razón honesta para quererlo así: cuando el operando derecho tiene un efecto secundario que debe ocurrir de todas formas, como `if (checkA() & checkB())` donde las dos comprobaciones tienen que registrar su resultado. Es lo bastante raro que un revisor va a leer un `&` suelto entre booleanos como una errata de `&&`, así que escribe `&&` y `||` salvo que puedas explicar por qué no. (Entre dos enteros los mismos dos símbolos significan algo completamente distinto — AND y OR a nivel de bit, trabajando bit a bit — que no vas a necesitar en código web de backend.)

---

## Conversión de tipos (casting)

> 📖 Docs: [Baeldung — Java Primitives Type Casting](https://www.baeldung.com/java-primitive-conversions) → leer: "Widening Primitive Conversions" y "Narrowing Primitive Conversion" — la tabla completa de conversiones y en qué dirección hace falta un cast.

### Widening (automático)

Cuando conviertes un tipo más pequeño a uno más grande, el valor siempre cabe, así que Java hace la conversión por ti sin ninguna sintaxis adicional:

```java
int x = 42;
long y = x;        // int → long — automático
double z = x;      // int → double — automático
```

Java permite esto en silencio porque el rango del tipo destino contiene por completo el rango del tipo origen — no existe ningún valor de `int` que un `long` no pueda representar, así que nada puede salir mal.

> **Alcance exacto: "widening" no siempre significa "sin pérdida de datos".** Dos de las conversiones de widening sí tienen pérdida, y Java las realiza automáticamente de todos modos. `int` → `float` y `long` → `double` se mueven ambas a un tipo _más ancho_ que, sin embargo, tiene _menos_ cifras significativas, porque un tipo de coma flotante gasta parte de sus bits en el exponente en lugar de en los dígitos. Un `float` tiene 32 bits como un `int`, pero solo unos 24 de ellos transportan dígitos:
>
> ```java
> int precise = 16777217;      // 2^24 + 1
> float widened = precise;     // automático — sin cast, sin aviso
> System.out.println(widened); // 1.6777216E7  ← 16777216, no 16777217. El 1 desapareció.
> ```
>
> Lo mismo pasa con `long` → `double` a partir de 2⁵³. Nada te avisa, porque la regla que impone el compilador es _rango_, no _precisión_: el rango de `float` (±3.4 × 10³⁸) contiene cómodamente cualquier `int`, así que la conversión es legal, y el dígito perdido es un daño colateral que el lenguaje acepta. La afirmación fiable es entonces "el widening nunca desborda", no "el widening nunca pierde datos". Para cada conversión de narrowing más abajo, el compilador sí te detiene y exige un cast — que es exactamente por qué estos dos widenings con pérdida son los peligrosos: son las pérdidas que nadie está vigilando.

### Narrowing (manual)

Cuando conviertes un tipo más grande a uno más pequeño, puede haber pérdida de datos — Java te obliga a decirlo explícitamente escribiendo el tipo destino entre paréntesis antes del valor:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — la parte decimal se descarta, no se redondea

long bigNumber = 1234567890123L;
int smaller = (int) bigNumber;  // 1912276171 — no "aproximadamente 1234567890123", un número completamente distinto
```

El `(int)` antes de la variable es el cast. Java no lo hace automáticamente porque podrías perder datos — tienes que escribirlo explícitamente para señalar que aceptas esa posible pérdida.

Ese segundo resultado merece desmenuzarse, porque "puede desbordarse" esconde lo violento que es realmente el resultado. Un `long` tiene 64 bits y un `int` 32, así que el cast conserva los **32 bits bajos y descarta los 32 bits altos** — sin redondeo, sin recortar al `Integer.MAX_VALUE`, sin excepción. Es un par de tijeras, no una conversión:

```
1234567890123L en binario (41 bits):

  100011111 01110001111110110000010011001011
  └───────┘ └──────────────────────────────┘
   9 bits      los 32 bits bajos que sobreviven
   altos —
   DESCARTADOS

  los 32 bits que sobreviven, leídos como int  →  1912276171
```

Nueve bits se caen por delante y el resto se reinterpreta como un `int` nuevo. El resultado, 1912276171, no guarda ninguna relación útil con el original 1234567890123 — no es "aproximadamente correcto", es un número completamente distinto. Y como los bits descartados incluían todo lo que hacía grande al valor, un número que era demasiado grande puede muy bien volver **negativo**: si el bit 32 que sobrevive resulta ser un 1, ese bit es el bit de signo en un `int`, y el resultado es negativo. Es el mismo efecto cuentakilómetros descrito a continuación, visto a nivel de bit.

> **Wraparound silencioso:** cuando un número no cabe en el tipo destino, Java no lanza un error — simplemente "da la vuelta". Imagina un cuentakilómetros que llega a 999,999 y vuelve a 000,000: exactamente eso pasa con los enteros. El valor máximo de `int` es 2,147,483,647; súmale 1 y obtienes −2,147,483,648, el mínimo. El contador se sale por el extremo superior y reaparece por abajo. Por eso el narrowing (y el overflow de enteros en general) puede producir resultados incorrectos en silencio, sin ninguna excepción que te avise.

---

## Aritmética de enteros — dos trampas silenciosas

> 📖 Docs: [Baeldung — Overflow and Underflow in Java](https://www.baeldung.com/java-overflow-underflow) → leer: "Overflow and Underflow" y "Handling Underflow and Overflow of Integer Data Types" — incluida la familia `Math.addExact`.

El callout del wraparound de arriba describió qué pasa cuando un valor no cabe. El cast no es la única forma de llegar ahí: `+` y `*` normales sobre `int` alcanzan el mismo precipicio, y `/` también, aunque de otra manera. Estas dos trampas son la razón por la que un informe puede mostrar en silencio el total equivocado en producción, sin nada en los logs.

### La división entera trunca — no redondea

Cuando **ambos** operandos son de tipo entero, `/` realiza división entera: descarta la parte fraccionaria en lugar de redondearla. Esto sorprende porque el resultado parece redondeado, y la mitad de las veces la respuesta redondeada coincide por casualidad:

```java
7 / 2      // 3    — no 3.5, y tampoco 4. El .5 se descarta.
-7 / 2     // -3   — el truncamiento va hacia cero, así que tampoco es "redondear hacia abajo"
7 % 2      // 1    — el resto que se desechó
```

La trampa es que nada en la expresión te dice qué tipo de división vas a obtener — depende por completo de los _tipos de los operandos_, que pueden estar a varias llamadas a método de distancia:

```java
int totalHours = 7;
int entries = 2;

// MAL — el promedio es 3, en silencio. Sin aviso, sin error, informe equivocado.
double average = totalHours / entries;

// BIEN — fuerza a double UNO de los operandos ANTES de que ocurra la división
double average = (double) totalHours / entries;   // 3.5
```

La razón por la que la primera línea falla merece rastrearse, porque parece que debería funcionar: el `double` de la izquierda no tiene ninguna influencia sobre la división. Java evalúa primero el lado derecho, por completo bajo sus propios términos — dos `int`, así que división entera, así que `3`. Solo _después_ ensancha ese `3` a `3.0` y lo guarda. El `double` llega un paso demasiado tarde; la información ya se había perdido. El cast de la versión corregida funciona porque cambia un operando _antes_ de que se ejecute el `/`, lo cual convierte toda la expresión en división de coma flotante.

> **El `(double)` va sobre uno de los operandos, no sobre el resultado.** `(double) (totalHours / entries)` sigue siendo incorrecto — los paréntesis hacen que la división entera ocurra primero y luego ensanchan el `3` ya truncado. Solo necesitas convertir uno de los dos operandos; Java entonces ensancha automáticamente al otro para que coincida, y la división se hace en `double`. Esta es la forma más común de "arreglar" este bug sin arreglarlo en realidad.

Y hay un operando que no tolerará: `7 / 0` con enteros lanza `ArithmeticException: / by zero`. La coma flotante no — `7.0 / 0` produce `Infinity` y `0.0 / 0.0` produce `NaN`, sin ninguna excepción. Así que la misma división, con la misma pinta, o bien revienta o bien devuelve un valor sin sentido según los tipos de los operandos.

### El overflow es silencioso, y muerde cuando se multiplican valores

El callout del cuentakilómetros usó `Integer.MAX_VALUE + 1` como ejemplo, lo cual suena a caso límite artificial. En la práctica te topas con el overflow a través de la multiplicación, donde tres números perfectamente normales se combinan en algo que ya no cabe:

```java
// MAL — ¿cuántos milisegundos hay en 30 días?
int ms = 1000 * 60 * 60 * 24 * 30;    // -1702967296   ← milisegundos negativos
```

Cada uno de esos literales es un `int` pequeño y sensato. Pero `int * int` produce un `int` en Java — el tipo de una expresión aritmética lo deciden sus operandos, nunca a dónde va a parar el resultado — y la respuesta real, 2,592,000,000, está por encima de `Integer.MAX_VALUE` (2,147,483,647). Da la vuelta hacia territorio negativo, y el programa sigue adelante tan tranquilo con una duración negativa. Declarar la variable como `long` tampoco te salva, exactamente por la misma razón por la que la división entera ignoró al `double`: la multiplicación ya se realizó en `int` antes de que se considere siquiera la asignación.

```java
// BIEN — haz que el PRIMER operando sea long, para que toda la cadena se calcule en long
long ms = 1000L * 60 * 60 * 24 * 30;   // 2592000000
```

Con una sola `L` en el primer literal basta. Java evalúa la cadena de izquierda a derecha, y en cuanto uno de los operandos es `long`, el otro se ensancha a `long` y el resultado se mantiene `long` durante el resto de la cadena — así que el valor nunca pasa por una caja de 32 bits en su camino.

> **Cuando necesitas que te _avisen_ de un overflow, pídelo.** Java 8 añadió la familia `Math.*Exact` — `addExact`, `multiplyExact`, `subtractExact` — que hacen la misma aritmética pero lanzan una excepción en vez de dar la vuelta:
>
> ```java
> Math.addExact(Integer.MAX_VALUE, 1);   // lanza ArithmeticException: integer overflow
> ```
>
> Úsalas donde un número equivocado sea peor que un crash: totales de una factura, cantidades en un sistema de inventario, cualquier cosa sobre la que una persona vaya a actuar. Para un contador de bucle, el `+` normal está bien. Saber nombrar esta familia en una entrevista es una forma barata de demostrar que sabes que el overflow es silencioso por defecto, en lugar de simplemente haberlo oído mencionar.

---

## Coma flotante — por qué un `double` no puede contener `0.1`, y por qué no puedes fiarte de `==` sobre uno

> 📖 Docs: [Java Language Specification (SE 25) — §4.2.3 Floating-Point Types, Formats, and Values](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.2.3) → leer: los párrafos sobre infinity y sobre NaN — de ahí sale "`x != x` es `true` si y solo si `x` es NaN".

El callout del dinero cerca del principio de este archivo lo dijo de pasada: un `double` no puede representar `0.1` exactamente. La aritmética de enteros ya te enseñó un tipo de fallo de representación — un número fijo de bits que se agota — y este es el otro tipo, el más insidioso, porque nada se desborda y no falta ningún dígito de forma visible. Aquí está haciendo daño en el programa más corto que puede:

```java
System.out.println(0.1 + 0.2);          // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);   // false
```

El mecanismo es un problema de base numérica, no un problema de Java. Un `double` guarda un número como una suma de potencias de dos — 1/2, 1/4, 1/8, 1/16 y así sucesivamente. Pídele `0.5` y la respuesta es exacta, porque 0.5 _es_ 1/2. Pídele `0.1` y ningún conjunto finito de esas fracciones suma exactamente eso, así que el hardware guarda la aproximación de 64 bits más cercana que puede construir y sigue adelante. Es la misma limitación que tiene la notación decimal con un tercio: escribir `0.3333` con tantos treses como papel tengas nunca cae exactamente en 1/3. Todo lenguaje que use coma flotante IEEE 754 se comporta igual — `0.1 + 0.2` imprime esas mismas cifras en JavaScript — así que este es uno de los pocos sitios donde tus instintos actuales se trasladan sin ajuste.

De ahí se siguen dos cosas, y es la segunda la que muerde.

- **El error es diminuto.** Se sitúa alrededor del decimoséptimo dígito significativo. Para una temperatura, un porcentaje, una ratio o un cálculo de física es irrelevante.
- **El error no es estable.** Dos cálculos matemáticamente idénticos pueden acabar en dos aproximaciones _distintas_, porque redondearon en pasos intermedios distintos. `0.1 + 0.2` y `0.3` son simplemente dos valores `double` diferentes. Así que `==` entre dos `double` calculados está preguntando si dos aproximaciones acabaron por casualidad en el mismo patrón de bits — una pregunta sobre historial de redondeo, no sobre los números que querías decir.

Ese es todo el caso en contra de `==` en coma flotante: no responde a la pregunta que estabas haciendo. Es también la segunda mitad del caso en contra de `double` para dinero — la deriva es irrelevante en una temperatura e inaceptable en una factura, donde el mismo total tiene que salir idéntico cada vez que se calcula. `BigDecimal` (las secciones del principio de este archivo) es el arreglo cuando hace falta exactitud; las dos secciones de abajo son qué hacer cuando de todas formas estás atrapado con un `double`.

### `NaN` — el valor que no es igual a sí mismo

Algunas operaciones de coma flotante no tienen ninguna respuesta numérica: `0.0 / 0.0`, la raíz cuadrada de un número negativo, `Infinity - Infinity`. En vez de lanzar una excepción, producen **`NaN`** — "not a number", un valor `double` legal que significa "este cálculo no tiene un resultado con sentido". Después se propaga, porque cualquier operación aritmética que involucre `NaN` produce `NaN`: un paso malo al principio de un pipeline envenena todos los números que vienen después, y te encuentras un `NaN` impreso al final de un informe sin nada que señale por dónde entró.

`NaN` tiene una propiedad que sorprende a todo el mundo, y es deliberada:

```java
double nan = 0.0 / 0.0;

nan == nan            // false  ← la misma variable, comparada consigo misma
Double.isNaN(nan)     // true   ← la comprobación correcta
```

`NaN` significa "ningún valor con sentido", y dos resultados sin sentido no son el _mismo_ resultado sin sentido, así que IEEE 754 define `==`, `<`, `>`, `<=` y `>=` como `false` siempre que cualquiera de los dos lados sea `NaN` — `nan == nan` incluido. `!=` es la única excepción, y no es una inconsistencia: `!=` se define como "los operandos no son iguales", y como `NaN` no es igual a absolutamente nada, eso es `true`. La especificación enuncia la regla desde ese lado, que es la versión que merece la pena recordar: `x != x` es `true` si y solo si `x` es `NaN`. La consecuencia para tu código es que nunca puedes detectar un `NaN` comparando, y tienes que llamar a `Double.isNaN(value)` (o `Float.isNaN`).

> **El wrapper discrepa a propósito con el operador.** `Double.equals` y `Double.compare` tratan `NaN` como igual a sí mismo, deliberadamente, para que el ordenamiento y las colecciones se sigan comportando con sensatez cuando un `NaN` se cuela en una `List<Double>`. Así que `Double.valueOf(nan).equals(nan)` da `true` mientras que `nan == nan` da `false` — los mismos dos valores, dos respuestas distintas, según le preguntes al objeto o al primitivo. No lo leas como "el wrapper lo arregló": solo significa que una colección no se va a comportar mal. Tu propia aritmética sigue produciendo `NaN` en silencio y sigue sin poder detectarlo con `==`, así que compruébalo con `Double.isNaN` en el punto donde el valor se produce, no río abajo donde ya se ha propagado.

### Comparar dos `double` — una tolerancia, o el tipo correcto

Cuando los valores genuinamente tienen que ser `double`, compáralos con una **tolerancia**: decide cuánta cercanía cuenta como igualdad, y comprueba el tamaño de la diferencia en vez de exigir identidad.

```java
// MAL — pregunta si dos aproximaciones cayeron en los mismos bits
if (measured == expected) { ... }

// BIEN — pregunta si coinciden dentro de la precisión que realmente te importa
double epsilon = 1e-9;
if (Math.abs(measured - expected) < epsilon) { ... }
```

`Math.abs` da la distancia entre los dos valores sin importarle cuál es mayor, así que una sola comprobación cubre las dos direcciones. `1e-9` es la notación científica de Java para 0.000000001 — mucho mayor que el error de representación y mucho menor que cualquier diferencia que importe. Elige la tolerancia según el dominio, no por costumbre: nueve decimales para una ratio calculada, dos para cualquier cosa que una persona lea en pantalla.

> **El arreglo de verdad suele ser el tipo, no la tolerancia.** Recurres a una tolerancia cuando _heredas_ un `double` — una lectura de un sensor, un campo de una API de terceros, una columna heredada de base de datos. Cuando la decisión es tuya, pregúntate qué es el número. Dinero, o cualquier cantidad que tenga que cuadrar exactamente: `BigDecimal`. Un valor con una escala fija pequeña que tú controlas, como horas con dos decimales: `BigDecimal` de nuevo, que es exactamente por qué `TimeEntry.hours` es uno. Una medición que ya es una aproximación en el mundo real antes de llegar siquiera a Java: `double`, comparado con una tolerancia. En ninguno de los tres casos `==` entre dos `double` calculados es la comprobación correcta.

---

## División por cero — la misma expresión, o revienta o devuelve `Infinity` en silencio

> 📖 Docs: [Java Language Specification (SE 25) — §4.2.3 Floating-Point Types, Formats, and Values](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.2.3) → leer: la frase "1.0/0.0 has the value positive infinity" y el párrafo alrededor sobre infinity y NaN.

Una línea sobre esto pasó de refilón en la sección de división entera; merece su propio espacio, porque es el ejemplo más afilado de la página de la idea que todo el capítulo lleva rondando — _los tipos de los operandos deciden lo que el operador realmente hace_. Dividir por cero no es un solo comportamiento en Java. Son dos, y cuál te toca no depende de nada que puedas ver en el punto de la llamada:

```java
int a = 7, b = 0;
a / b;          // lanza java.lang.ArithmeticException: / by zero

double x = 7.0, y = 0.0;
x / y;          // Infinity — sin excepción, la ejecución continúa
0.0 / 0.0;      // NaN      — sin excepción, la ejecución continúa
```

La división viene de lo que cada tipo tiene sitio para decir. Un `int` son 32 bits, y cada uno de esos 4.3 mil millones de patrones de bits ya está reservado para un número entero normal — no queda ningún patrón libre para significar "infinito", así que lo único honesto que puede hacer la JVM es negarse, y lanza una excepción. Un `double` reserva patrones exactamente para este caso: `Infinity`, `-Infinity` y `NaN` son valores `double` legales con una representación definida, así que la operación tiene algo verdadero que devolver y lo devuelve. (`%` sigue a `/` en ambas direcciones: `7 % 0` lanza la misma `ArithmeticException`, y `7.0 % 0.0` es `NaN`.)

Cuál de los dos es más peligroso no es el que la gente asume:

```
   int     7 / 0    →  ArithmeticException  →  ruidoso, se detiene aquí, nombra la línea
   double  7.0 / 0  →  Infinity             →  silencioso, sigue adelante, envenena todo río abajo
```

La excepción es el caso _útil_. Termina la petición, produce un stack trace que apunta a la línea exacta, y lo arreglas en diez minutos. El `Infinity` fluye hacia la siguiente multiplicación, el siguiente promedio, la respuesta JSON y el informe que lee un cliente — y para cuando alguien nota un `Infinity` donde debería haber una tarifa horaria media, la línea que dividió por cero ya no aparece por ningún lado en la evidencia.

> **La guarda es la misma en los dos casos, y no es un `try/catch`.** Comprueba el divisor antes de dividir:
>
> ```java
> // MAL — se apoya en la excepción, y no hace nada en absoluto en el caso double
> double average = (double) totalHours / entryCount;
>
> // BIEN — el caso vacío es un caso de negocio real, así que respóndelo explícitamente
> double average = entryCount == 0 ? 0.0 : (double) totalHours / entryCount;
> ```
>
> Un divisor de cero casi siempre significa "la colección estaba vacía", que es un estado normal del mundo y no un error: un usuario sin entradas de tiempo este mes, un proyecto sin tareas. Decidir cuál _es_ la respuesta en ese caso — cero, `null`, "sin datos" — es una decisión de negocio, y tomarla en la propia división cuesta menos que capturar una excepción más tarde o explicarle un `Infinity` a un cliente. (`?:` es el operador condicional nombrado en la sección de operadores; [03-flujo-de-control.md](03-flujo-de-control.md) lo cubre bien.)

---

## Clases wrapper — objetos para primitivos

> 📖 Docs: [Baeldung — Wrapper Classes in Java](https://www.baeldung.com/java-wrapper-classes) → leer: "Autoboxing and Unboxing" — la conversión que inserta el compilador por ti, y las llamadas `valueOf()` / `intValue()` que hay detrás.

Cada tipo primitivo tiene una clase wrapper correspondiente. Usas clases wrapper cuando un método requiere un **objeto** en lugar de un primitivo.

**El caso más común:** las colecciones de Java (`List`, `Map`, `Set`) solo funcionan con objetos, no con primitivos. `List<int>` no compila, y el compilador es directo sobre por qué:

```
error: unexpected type
  required: reference
  found:    int
```

"Reference" es la palabra del diagrama del principio de este archivo — un tipo cuya variable contiene una dirección. Un argumento de tipo genérico siempre tiene que serlo, porque una colección guarda direcciones en sus ranuras; no hay sitio dentro de ella para meter un valor crudo de 32 bits. Así que usas `List<Integer>` en su lugar. La regla en sí misma — que un tipo escrito entre corchetes angulares siempre tiene que ser un tipo de referencia, y por qué el lenguaje se construyó así — son los _genéricos_, explicados en detalle en [09-genericos.md](09-genericos.md); las colecciones que los usan están en [10-colecciones.md](10-colecciones.md). De momento, quédate con que son las estructuras de datos principales de Java y todas exigen tipos objeto.

**Otro caso:** las clases wrapper pueden ser `null`. Un `int` primitivo no puede ser null, pero `Integer` sí. En Spring Boot, los IDs de base de datos se suelen declarar como `Long` (no `long`) porque Hibernate los establece a `null` hasta que la entidad se guarda por primera vez.

### Cuándo usar cada uno — la regla práctica

> **Adelanto — Spring Boot:** el fragmento de abajo usa `@Id`, `@GeneratedValue` y `@Value`, anotaciones de Spring Boot y JPA que aún no has estudiado. `@Id` y `@GeneratedValue` marcan el campo que se mapea a la clave primaria de la tabla y le dicen a la base de datos que la genere; `@Value` inyecta un valor desde el archivo de configuración. Están aquí solo para mostrar _dónde_ se toma realmente la decisión primitivo-vs-wrapper en un backend real — implementarás las tres en las notas de Spring Boot.

Usa el **wrapper** en dos situaciones: (1) cuando `null` es un valor con significado — el ID de una entidad JPA es `null` hasta que se guarda por primera vez, así que el campo va como `Long`, no como `long`; (2) cuando usas colecciones, porque `List<int>` no existe en Java y debes escribir `List<Integer>`. En cualquier otro caso, usa el **primitivo** — el valor siempre está presente y nunca es null.

Las dos mitades de esta decisión están presentes en el backend de TimeTrack:

```java
// Long (wrapper) — porque el id no existe hasta que JPA guarda la entidad
// File: .../com/victor/timetrack/model/User.java
@Id
@GeneratedValue
private Long id;

// long (primitivo) — porque la expiración siempre está configurada, nunca es null
// File: .../com/victor/timetrack/security/JwtUtil.java
@Value("${app.jwt.expiration}")
private long expiration;
```

(Rutas completas: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/User.java` y `.../com/victor/timetrack/security/JwtUtil.java`.)

| Primitivo | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |

Lee cada fila como una pareja: la columna izquierda es el primitivo que usas cuando el valor siempre está presente, la columna derecha es la forma objeto a la que cambias cuando necesitas `null` o una colección. El nombre no es arbitrario — el wrapper es la palabra completa en mayúscula inicial (`int` → `Integer`, `char` → `Character`), que además es cómo identificas de un vistazo cuál de los dos está usando un campo.

### Autoboxing y unboxing

El autoboxing ocurre cada vez que añades un `int` a un `List<Integer>` o asignas un `int` a una variable `Integer` — situaciones que aparecen constantemente en código real. Antes de Java 5, el compilador rechazaba eso y tenías que hacer la conversión a mano: `list.add(Integer.valueOf(42))`. Desde Java 5 en adelante, Java hace esa conversión automáticamente. Esto se llama **autoboxing** (de primitivo a wrapper) y **unboxing** (de wrapper a primitivo).

En la práctica, casi nunca piensas en ello. Java simplemente lo gestiona:

```java
Integer a = 42;           // autoboxing — Java convierte int 42 a Integer automáticamente
int b = a;                // unboxing — Integer de vuelta a int automáticamente

List<Integer> ids = new ArrayList<>();
ids.add(42);              // autoboxing — pasas un int, Java lo envuelve como Integer
int first = ids.get(0);   // unboxing — Java lo desenvuelve de vuelta a int
```

**El mecanismo no es magia — es el compilador escribiendo por ti el código antiguo.** El autoboxing es una característica puramente de _tiempo de compilación_: el compilador ve un primitivo donde se requiere un objeto (o al revés), y literalmente inserta la llamada de conversión en el bytecode. La JVM en tiempo de ejecución no tiene ni idea de que el autoboxing existe; solo ve las llamadas explícitas. Lo que escribes y lo que realmente se compila son estas dos columnas:

| Tú escribes           | Lo que emite el compilador         |
| --------------------- | ---------------------------------- |
| `Integer a = 42;`     | `Integer a = Integer.valueOf(42);` |
| `int b = a;`          | `int b = a.intValue();`            |
| `ids.add(42);`        | `ids.add(Integer.valueOf(42));`    |
| `int f = ids.get(0);` | `int f = ids.get(0).intValue();`   |

Lee la columna de la derecha como "el código que habrías tenido que escribir a mano antes de Java 5". Nada más cambia — las mismas llamadas a método, los mismos objetos, el mismo coste. Merece la pena saberlo por dos razones: explica por qué el boxing tiene un coste de rendimiento real en un bucle exigente (cada `valueOf` puede reservar un objeto), y explica la trampa de abajo, que si no sería inexplicable.

> **Hacer unboxing de `null` lanza un `NullPointerException` en una línea sin ninguna llamada a método visible.** Este es el único comportamiento del autoboxing que genuinamente te va a confundir, y el mecanismo de arriba es toda la explicación:
>
> ```java
> Map<String, Integer> scores = new HashMap<>();
> int score = scores.get("missing");   // NullPointerException — ¿pero dónde?
> ```
>
> `get()` devuelve `null` para una clave que no existe, lo cual es un `Integer` legal. El problema está en la asignación a `int`: un `int` no tiene dónde meter `null`, así que el compilador ha añadido en silencio un `.intValue()`, y estás llamando a un método sobre `null`. El mensaje de Java desde la versión 14 lo explica exactamente así, nombrando un método que tú nunca escribiste:
>
> ```
> java.lang.NullPointerException: Cannot invoke "java.lang.Integer.intValue()"
> because the return value of "java.util.Map.get(Object)" is null
> ```
>
> El arreglo es recibirlo como el wrapper — `Integer score = scores.get("missing");` — y comprobar `null` antes de usarlo, o pedir un valor de respaldo con `scores.getOrDefault("missing", 0)`. La regla general: cualquier asignación de un wrapper a un primitivo es un `NullPointerException` escondido esperando un `null`, y eso incluye campos, argumentos de métodos y sentencias `return`, no solo variables locales.

### `==` entre wrappers — la única comparación que este capítulo se niega a explicar

El autoboxing hace que `Integer` e `int` parezcan intercambiables, y hay exactamente un sitio donde esa ilusión se vuelve peligrosa: la comparación. `==` entre dos variables `Integer` no compara los dos números. Compara las dos _direcciones_ del diagrama del principio de este archivo — pregunta "¿estas dos variables apuntan al mismo objeto?" — y esa es una pregunta distinta, una que da la respuesta correcta justo las veces suficientes como para sobrevivir a tus pruebas:

```java
Integer a = 127, b = 127;
a == b            // true

Integer c = 128, d = 128;
c == d            // false   ← el mismo código, un número más alto
```

Nada distingue a 127 de 128 como _valor_. La regla que necesitas hoy es corta: **nunca compares wrappers con `==`.** Usa `a.equals(b)`, o desenvuelve los dos lados a primitivos primero (`a.intValue() == b.intValue()`), donde `==` compara valores y es correcto por definición. Entre dos primitivos — `int == int` — `==` siempre es correcto y siempre es lo que querías decir.

> **Por qué la explicación espera a [06-poo-clases.md](06-poo-clases.md), y por qué la comparación de `String` espera con ella.** El resultado de arriba tiene una causa concreta, y comparar dos `String` con `==` tiene otra, pero no son dos hechos que memorizar por separado — son la _misma_ pregunta con dos disfraces: cuándo dos referencias identifican a un solo objeto, y qué significa que dos objetos sean iguales en vez de idénticos. Responder eso necesita el propio modelo de objetos — qué es `equals`, que toda clase hereda una versión por defecto que compara direcciones, y cómo una clase la sobreescribe para comparar contenido. Nada de eso existe todavía. La entrada 06 construye las clases primero, luego define identidad frente a igualdad de valor, y resuelve `==` entre wrappers, `==` entre `String` y `Objects.equals` en un solo sitio donde se explican unos a otros. Aprender aquí los rangos de la caché, antes de saber qué es un objeto, te dejaría con una regla sin nada debajo — exactamente el tipo de conocimiento que se derrumba en la primera pregunta de seguimiento de una entrevista.

### Métodos útiles de wrapper

Los **métodos estáticos** pertenecen a la clase en sí, no a ningún objeto concreto — por eso los llamas sobre el nombre de la clase (`Integer.parseInt("42")`) sin crear un objeto con `new`. Los métodos estáticos se cubren en detalle en [04-metodos.md](04-metodos.md).

Estos métodos estáticos son genuinamente útiles en el código del día a día:

```java
Integer.parseInt("42");     // String → int (primitivo)
Integer.valueOf("42");      // String → Integer (objeto, posiblemente de la caché de arriba)
Integer.MAX_VALUE;          // 2147483647 — el mayor valor int posible
Integer.MIN_VALUE;          // -2147483648
```

(Para ir en el otro sentido, `String.valueOf(42)` convierte un `int` en `"42"` — fíjate en que ese es un método de `String`, no de `Integer`, así que se cubre junto con el resto del manejo de texto en [02-cadenas-de-texto.md](02-cadenas-de-texto.md).)

**`parseInt` frente a `valueOf` — el par confundible.** Reciben el mismo argumento y parecen intercambiables, y la diferencia está solo en el tipo de retorno: `parseInt` devuelve un `int` primitivo, `valueOf` devuelve un objeto `Integer`. De hecho `valueOf` está implementado llamando a `parseInt` y luego haciendo boxing del resultado — lo que significa que comparar dos de sus resultados con `==` cae directo en la trampa que la sección anterior se negó a explicar — compáralos también ahí con `.equals()`. Elige según lo que necesites a continuación: `parseInt` cuando el valor va directo a una operación aritmética o a una variable `int`, `valueOf` cuando va a una colección o a un campo que puede ser `null`. Elegir el equivocado es inofensivo — el autoboxing lo convierte —, pero saber nombrar la diferencia es una pregunta estándar de entrevista junior.

> **Los dos lanzan excepción cuando el texto no es un número, y el mensaje nombra al culpable.** Este es el camino de fallo que te vas a encontrar la primera vez que un usuario escriba algo inesperado en un formulario:
>
> ```java
> Integer.parseInt("abc");
> // java.lang.NumberFormatException: For input string: "abc"
> ```
>
> `NumberFormatException` es **unchecked**, así que el compilador no te obliga a manejarla — nada en tu IDE te va a recordar que esta línea puede estallar. Fíjate en qué cuenta como "no es un número": `"42 "` con un espacio al final también falla (a diferencia de `Double.parseDouble`, `parseInt` no recorta espacios), igual que `""` y `null`. Cualquier vez que el string venga de fuera de tu programa — un campo de formulario, una variable de ruta de una URL, una fila de un CSV — esta llamada necesita o un `try/catch` o validación por delante. El manejo de excepciones se cubre en [11-excepciones.md](11-excepciones.md); de momento, solo registra que este método concreto es una fuente habitual de errores 500.

---

## Valores de texto — `String` tiene su propio capítulo

El texto no se deriva de nada de esta página. Un `String` es un objeto, y además inmutable, así que toda pregunta sobre él — el catálogo de métodos, `strip()` frente a `trim()`, los text blocks, construir texto en un bucle con `StringBuilder`, y por qué `==` es la forma equivocada de comparar dos de ellos — depende de hechos sobre objetos y no sobre representación numérica. Todo eso está en [02-cadenas-de-texto.md](02-cadenas-de-texto.md), el siguiente archivo de este tema. Lo único que necesitas mientras lees esta página es lo que el diagrama del principio ya te enseñó: una variable `String` contiene una dirección, no los caracteres.

---

## `var` — inferencia de tipo local (Java 10+)

> 📖 Docs: [Baeldung — Guide to var in Java](https://www.baeldung.com/java-10-local-variable-type-inference) → leer: "Introduction" y "Illegal Use of var" — los casos donde el compilador se niega a inferir.

Normalmente escribes el tipo en el lado izquierdo: `List<Employee> employees = new ArrayList<>()`. Con `var`, Java infiere el tipo del lado derecho — no tienes que escribirlo:

```java
var name = "Victor";                    // Java infiere: String
var age = 31;                           // Java infiere: int
var employees = new ArrayList<Employee>();  // Java infiere: ArrayList<Employee>
```

Esto **no** hace que Java sea dinámico como el `var` de JavaScript. En JavaScript, una variable puede cambiar de tipo mientras el programa corre (`var x = 1; x = "hello"` funciona sin problemas). En Java eso no es posible.

Dos conceptos ayudan aquí: **compile time** (tiempo de compilación) es cuando Java traduce tu código fuente a bytecode — antes de que el programa se ejecute. **Runtime** (tiempo de ejecución) es cuando el programa ya está corriendo de verdad. Con `var`, Java averigua el tipo durante la compilación: ve `"Victor"` en el lado derecho y decide que el tipo es `String`. Ese tipo queda fijado en el bytecode y nunca cambia — exactamente igual que si hubieras escrito `String name = "Victor"` tú mismo.

Solo funciona para variables locales (dentro de métodos). No se puede usar para campos, parámetros de métodos ni tipos de retorno.

> **`var` necesita algo de lo que inferir, y lo dice claramente cuando no hay nada.** El tipo viene por completo del lado derecho, así que las dos formas de dejar ese lado sin información son ambas errores de compilación:
>
> ```java
> var x;           // MAL — error: cannot infer type for local variable x
>                  //         (cannot use 'var' on variable without initializer)
> var y = null;    // MAL — error: cannot infer type for local variable y
>                  //         (variable initializer is 'null')
> ```
>
> La segunda línea, entre paréntesis, es el compilador diciéndote _cuál_ de los dos casos te ha tocado. El primero es la declaración separada que viste en la sección Variables — perfectamente legal con un tipo explícito (`int count;`), imposible con `var`, porque no hay nada de lo que leer el tipo. El segundo falla porque `null` es un valor legal de _todo_ tipo de referencia, así que no restringe nada; si de verdad quieres una variable inicializada a null tienes que nombrar tú mismo el tipo (`String y = null;`).
>
> Esta es también la razón por la que `var` no se puede usar en un campo o un parámetro de método: el valor de un parámetro solo llega cuando se llama al método, mucho después de que el compilador necesitara fijar el tipo.

Útil cuando el tipo es largo y obvio por el lado derecho: `var employees = employeeRepository.findAll()` es más limpio que `List<Employee> employees = employeeRepository.findAll()`.

---

Ahora tienes el modelo de valores de Java de principio a fin: los ocho primitivos y los objetos wrapper a su lado, las conversiones que el compilador hace por ti y las que te obliga a escribir tú, `BigDecimal` para valores que tienen que ser exactos, los operadores que combinan todo eso, y `var`, que cambia cómo _escribes_ un tipo y nunca lo que ese tipo _es_.

Una idea atraviesa toda la página. **La representación de un valor decide lo que los operadores realmente le hacen.** Treinta y dos bits sin patrones de sobra es por lo que un `int` se desborda hacia un número negativo y por lo que `7 / 0` no tiene más remedio que lanzar una excepción. Sumas de potencias de dos es por lo que `0.1 + 0.2` no llega a `0.3`, por lo que `NaN` no es igual a sí mismo, y por lo que `7.0 / 0` puede permitirse devolver `Infinity` en vez de fallar. Una escala guardada es por lo que `1.10` y `1.1` son un solo número bajo `compareTo` y dos bajo `equals`. Y el tipo a la izquierda del `=` nunca rescata una expresión que ya se calculó en la representación equivocada — la división entera asignada a un `double`, una multiplicación que se desborda asignada a un `long`, y `new BigDecimal(0.1)` son tres caras de esa misma idea.

Un segundo hilo trata sobre Java más que sobre números: **falla en dos momentos distintos.** Algunos errores el compilador los rechaza directamente — `integer number too large`, `possible lossy conversion`, `int cannot be converted to boolean`, `cannot infer type`. Otros los deja pasar para que fallen en tiempo de ejecución, o bien ruidosamente (`ArithmeticException: / by zero`, un `NullPointerException` al hacer unboxing de un `null`) o bien en silencio (overflow, división truncada, un `Infinity` escondido en un informe). Aprender a distinguir cuál es cuál es la mayor parte de lo que hace que leer código Java sea rápido.

Lo que todavía no puedes hacer es nada con texto — y cada línea de una aplicación web maneja texto: el cuerpo de una petición, un nombre de usuario, un campo JSON, un mensaje de log. [02-cadenas-de-texto.md](02-cadenas-de-texto.md) retoma la pregunta que este capítulo lleva haciendo — cómo está representado este valor, y qué obliga eso — y se la plantea a `String`. La respuesta tiene una forma distinta: el texto en Java es un objeto, y además inmutable, así que toda operación que parece editar un `String` en realidad construye uno nuevo en silencio.
