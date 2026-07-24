# Variables y tipos

> 📖 [Baeldung — Java primitives](https://www.baeldung.com/java-primitives) → leer: "Overview" y "Primitive Data Types"
> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

La [introducción](00-intro-java.md) te dejó con la idea central de que Java es de **tipado estático**: cada variable tiene un tipo fijado en tiempo de compilación, y ese tipo nunca cambia. Eso lleva directamente a la siguiente pregunta — *¿cuáles son esos tipos?* Este archivo la responde. Antes de escribir una sola clase, un bucle o un método, necesitas la materia prima: el conjunto exacto de tipos que Java te da para guardar un número, un flag, un trozo de texto, y cómo se comportan en memoria. Todo lo que viene a partir de aquí — cada campo de cada entidad de Spring Boot, cada parámetro de método — se construye a partir de los tipos de esta página.

## Tipos primitivos

> 📖 Docs: [Baeldung — Introduction to Java Primitives](https://www.baeldung.com/java-primitives) → leer: "Primitive Data Types" — los ocho tipos con sus rangos exactos, una subsección cada uno, más "Overflow".

En Java hay dos formas de guardar datos en memoria. La primera es almacenar el **valor directamente** — el número 42 o el booleano `true` se guardan exactamente en el sitio donde vive la variable. La segunda es guardar una **referencia** — en lugar del dato en sí, la variable contiene una dirección de memoria que apunta a donde está el objeto real, como un enlace. Los **tipos primitivos** usan la primera forma: almacenan el valor directamente, sin referencias. Los **objetos** (como `String`, `User`, o cualquier clase) usan la segunda.

Esta es la idea más estructural de toda la página, así que merece la pena dibujarla. Dos declaraciones que parecen casi idénticas producen dos disposiciones de memoria completamente distintas:

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

Todo lo sorprendente que aparece más adelante en esta página sale de ese dibujo. `==` sobre dos `String` compara las dos direcciones de las cajas de la izquierda, no el texto de la caja de la derecha — que es exactamente por qué existe `equals()` (la sección *Comparación de Strings* más abajo). Un `int` nunca puede ser `null` porque no hay ninguna dirección que dejar vacía; un `Integer` sí puede, porque el hueco de la dirección puede contener "apunta a nada". Y dónde viven físicamente esas cajas — la pila (*stack*) para la variable, el montón (*heap*) para el objeto — es el tema de [15-modelo-de-memoria.md](15-modelo-de-memoria.md), que retoma este mismo diagrama en detalle.

Java tiene 8 tipos primitivos. Cada uno tiene un tamaño fijo y un rango de valores posibles. Los rangos son útiles para saber cuándo cambiar de tipo: si un contador puede superar los 2.1 mil millones, `int` se queda corto y necesitas `long`.

| Tipo      | Tamaño  | Rango aproximado                           | Ejemplo                  |
| --------- | ------- | ------------------------------------------- | ------------------------ |
| `byte`    | 8 bits  | ±1.27 × 10²                                | `byte level = 5;`        |
| `short`   | 16 bits | ±3.27 × 10⁴                                | `short year = 2025;`     |
| `int`     | 32 bits | ±2.14 × 10⁹                                | `int age = 31;`          |
| `long`    | 64 bits | ±9.2 × 10¹⁸                                | `long id = 1234567890L;` |
| `float`   | 32 bits | ±3.4 × 10³⁸ (~7 cifras significativas)     | `float tax = 0.21f;`     |
| `double`  | 64 bits | ±1.7 × 10³⁰⁸ (~15 cifras significativas)   | `double price = 19.99;`  |
| `boolean` | 1 bit de información | `true` o `false`             | `boolean active = true;` |
| `char`    | 16 bits | Una unidad de código UTF-16 (0 a 65,535)   | `char grade = 'A';`      |

Lee la columna `Tamaño` como "cuánta información puede guardar el tipo", no siempre como "cuántos bits le reserva la JVM". Para los siete tipos numéricos, ambas cosas coinciden. `boolean` es la excepción: transporta exactamente un bit de *significado*, pero la especificación de la JVM no define una forma de almacenamiento de un solo bit — una variable local o un campo `boolean` ocupa una ranura completa (en la práctica, el espacio de un `int`), y solo dentro de un `boolean[]` se empaqueta a razón de un byte por elemento. Así que la fila te dice que el tipo tiene dos valores posibles; no te dice que cueste un bit de RAM.

Un **carácter Unicode** es cualquier símbolo de cualquier sistema de escritura del mundo: letras latinas, chino, árabe, emojis, símbolos matemáticos. El estándar Unicode asigna un número único (un *code point*) a cada símbolo — y `char` almacena una porción de 16 bits de esa numeración, de 0 a 65,535.

> **Alcance exacto: un `char` no almacena "cualquier carácter Unicode".** Almacena una **unidad de código UTF-16**, que cubre los code points hasta U+FFFF. Todo lo que está por encima de eso — emojis, muchas escrituras históricas, la mayoría de los alfanuméricos matemáticos — se almacena como **dos** `char` (un *par sustituto* o *surrogate pair*), así que no cabe en un único `char` en absoluto. Pruébalo y el compilador te detiene antes de que el programa llegue a ejecutarse:
>
> ```java
> char c = '😀';   // MAL — error: character literal contains more than one UTF-16 code unit
> ```
>
> La misma división se filtra hasta `String`, que no es más que una secuencia de `char`: `"😀".length()` devuelve **2**, no 1, porque cuenta unidades de código y el emoji ocupa dos de ellas. Si alguna vez necesitas el conteo "humano", `"😀".codePointCount(0, 2)` devuelve 1. Este es el mecanismo detrás de todo bug de "mi substring cortó un emoji por la mitad". En desarrollo web rara vez tocas `char` directamente — el texto completo va en `String` — pero la sorpresa de la longitud te llega igualmente a través de `String`.

En la práctica usas `int`, `long`, `double` y `boolean` para casi todo. `float` y `byte` raramente se necesitan.

### Tipos por categoría

**Números enteros** — para contar, IDs, edades, cantidades:
- `byte` y `short` — números enteros igual que `int` y `long`, solo que con un rango mucho más pequeño. No pueden almacenar decimales. En la práctica los verás en código antiguo o al trabajar con datos binarios.
- `int` — tu número entero de uso diario. Úsalo por defecto.
- `long` — cuando `int` no es suficientemente grande. Los IDs de base de datos suelen ser `Long` porque crecen mucho. Fíjate en el sufijo `L`: `1234567890L`.

> **Por qué el sufijo `L` no es opcional.** Un literal numérico a secas en el código fuente de Java es un `int`, siempre — el compilador decide el tipo del literal *antes* de mirar la variable a la que lo estás asignando. Así que en `long id = 1234567890123;` el compilador lee `1234567890123` como un literal `int`, comprueba que no cabe en 32 bits, y se detiene ahí mismo:
>
> ```java
> long id = 1234567890123;    // MAL — error: integer number too large
> long id = 1234567890123L;   // BIEN — la L convierte el literal en long desde el principio
> ```
>
> Fíjate en dónde apunta el error: al literal, no a la asignación. El `long` de la izquierda nunca llega a ayudar, porque el literal ya era ilegal por sí solo. El sufijo es lo que cambia el tipo del literal. La `l` minúscula también funciona, pero nadie la usa — es indistinguible de un `1` en la mayoría de las fuentes tipográficas.

**Números decimales** — para precios, porcentajes, tasas:
- `float` — la mitad de precisión que `double`: solo ~7 cifras significativas. Si necesitas `3.141592653589793`, un `float` lo almacena como `3.1415927` — pierdes dígitos. Úsalo solo si la memoria es crítica (casi nunca en desarrollo web). Fíjate en el sufijo `f`: `0.21f`.

  > **El sufijo `f` tiene el mismo mecanismo que `L`, en dirección contraria.** Un literal decimal a secas es siempre un `double`. Así que `float tax = 0.21;` le pide al compilador que meta un `double` de 64 bits en un `float` de 32 bits, lo cual puede perder dígitos — y Java nunca hace una conversión con pérdida en tu nombre sin que lo pidas explícitamente:
  >
  > ```java
  > float tax = 0.21;    // MAL — error: incompatible types: possible lossy conversion from double to float
  > float tax = 0.21f;   // BIEN — la f convierte el literal en float, no hace falta conversión
  > ```
  >
  > Lee el mensaje literalmente: *posible* pérdida, no *segura* pérdida. El compilador no está afirmando que este número concreto vaya a perder precisión; rechaza toda la dirección `double` → `float` por principio, porque no puede demostrar en general que sea segura. Esa palabra "possible" es la firma del compilador para cualquier narrowing que bloquea, y la volverás a ver en la sección *Narrowing* más abajo.
- `double` — la opción por defecto para decimales. Mayor precisión: hasta ~15 cifras significativas. `3.141592653589793`, por ejemplo, cabe cómodamente en un `double`.

> **Dinero en Spring Boot:** nunca uses `double` ni `float` para valores financieros. Usa `BigDecimal` — es una clase de Java pura (paquete `java.math`, no de Spring Boot) que hace aritmética exacta. `double` no puede representar 0.1 exactamente en binario porque los ordenadores expresan los números como sumas de potencias de 2 (1/2, 1/4, 1/8…), y 0.1 no se puede expresar como una suma finita de esas potencias — igual que 1/3 no se puede escribir exactamente en decimal (0.333…). El procesador guarda la aproximación más cercana que puede construir, y ese pequeño error se va acumulando entre operaciones hasta que obtienes `0.09999999...` en vez de `0.1`. `BigDecimal` evita esto operando sobre las cifras reales, sin el error de representación.

**Boolean** — para flags y condiciones:
- `boolean` — solo almacena `true` o `false`. Usado para `isActive`, `hasRole`, `isEmpty`.

**Carácter** — para caracteres individuales:
- `char` — un carácter, entre comillas simples: `'A'`. Raramente usado en desarrollo web.

### Construyendo un `BigDecimal` — nunca `new BigDecimal(0.1)`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → leer: "BigDecimal" — los constructores y por qué el de `String` es la opción segura por defecto.

El callout anterior te dijo que uses `BigDecimal` en lugar de `double` para dinero. Hay una trampa un paso más allá: `BigDecimal` tiene un constructor que recibe un `double`, y usarlo te devuelve exactamente el problema del `double`, solo que ahora congelado dentro de un objeto que dice ser exacto.

Mira lo que produce realmente cada una de las tres formas de construir "0.1". Esto es output real, no una ilustración:

```java
new BigDecimal(0.1)        // 0.1000000000000000055511151231257827021181583404541015625   ← MAL
BigDecimal.valueOf(0.1)    // 0.1                                                          ← BIEN
new BigDecimal("0.1")      // 0.1                                                          ← BIEN
```

El mecanismo es el mismo que describió el callout del dinero, atrapado en pleno acto. Para cuando `new BigDecimal(0.1)` se ejecuta, el literal `0.1` *ya* se ha convertido en un `double`, y un `double` no puede contener 0.1 — contiene el valor binario más cercano que puede construir a partir de mitades, cuartos y octavos, que es ese número de 55 dígitos. `BigDecimal` a partir de ahí hace su trabajo perfectamente: registra con fidelidad el valor exacto que recibió. El error no lo introdujo `BigDecimal`; ya venía incorporado en el argumento antes incluso de llamar al constructor, y `BigDecimal` es simplemente la primera herramienta lo bastante precisa como para mostrártelo.

Las dos formas seguras evitan por completo que el valor exista alguna vez como `double`:

- **`new BigDecimal("0.1")`** — el constructor de `String` lee los dígitos que escribiste literalmente, carácter a carácter. No ocurre ninguna aproximación binaria porque nunca interviene un `double`. Recurre a esto cuando el valor viene de un archivo de configuración, un cuerpo JSON, o un literal que escribiste tú.
- **`BigDecimal.valueOf(0.1)`** — recibe un `double`, pero internamente lo pasa primero por `Double.toString()` y luego parsea *ese* texto. `Double.toString()` imprime el decimal más corto que, al volver a convertirse, reproduce el mismo `double` — que para `0.1` es la cadena `"0.1"` — así que acabas exactamente en el mismo valor que te habría dado el constructor de `String`. Recurre a esto cuando el valor ya está en una variable `double` y no puedes volver atrás a cambiar de dónde viene.

> **Entonces, ¿para qué existe el constructor con `double`?** Porque es el único que dice la verdad sobre un `double`. Si estás depurando *por qué* un cálculo se desvió, `new BigDecimal(unDouble)` es la herramienta que te enseña el valor realmente almacenado, en lugar del texto redondeado y amigable. Es un instrumento de diagnóstico, no una forma de crear dinero. En código de aplicación, trata `new BigDecimal(` aplicado a un `double` o `float` como un bug — es exactamente lo que marca un revisor en un pull request. (Pasar un `int` o un `long` es inofensivo, ya que esos guardan sus valores con exactitud; solo los tipos de coma flotante llegan ya equivocados.)

En el backend de TimeTrack, `TimeEntry.hours` está declarado como `private BigDecimal hours;` precisamente por esto (`projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`) — las horas se suman en los informes, y un `double` iría desviándose una fracción de hora a medida que se acumularan suficientes entradas.

### Comparando `BigDecimal` — `compareTo()` en vez de `<`, `>` o `equals()`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → leer: "Operations on BigDecimal" — `compareTo()` y por qué no es `equals()`.

Imagina que un servicio necesita validar que las horas trabajadas estén entre 0.5 y 24 (exactamente el caso de `TimeEntry.hours` en un timesheet). Si `hours` es `BigDecimal`, escribir `hours < new BigDecimal("24")` ni siquiera compila:

```
error: bad operand types for binary operator '<'
  first type:  BigDecimal
  second type: BigDecimal
```

Lee las dos líneas adicionales como el compilador mostrando su razonamiento: nombra lo que encontró a cada lado del operador, para que puedas ver que ninguno de los dos es un número que sepa comparar. `<` y `>` están integrados en el lenguaje solo para primitivos — se compilan a una única instrucción de CPU sobre un valor numérico — y `BigDecimal` es un objeto, así que no hay nada sobre lo que esa instrucción pueda actuar. Java no tiene sobrecarga de operadores, así que una clase nunca puede enseñarle a `<` a funcionar sobre ella; una clase solo puede ofrecer un *método*.

El instinto siguiente suele ser `.equals()`, pero ahí hay una trampa: `.equals()` en `BigDecimal` también compara la **escala** (cuántos decimales tiene representados internamente el número), no solo el valor matemático. Por eso `new BigDecimal("24.0").equals(new BigDecimal("24"))` devuelve `false` — para Java, "24.0" y "24" son objetos con escalas distintas (una cifra decimal frente a ninguna), aunque matemáticamente sean el mismo número.

`BigDecimal` implementa la interfaz `Comparable<BigDecimal>`, que aporta el método `compareTo(BigDecimal other)`. Este método sí compara el valor matemático real, ignorando la escala, y devuelve un `int`:

- negativo si `this` es menor que `other`
- `0` si son matemáticamente iguales
- positivo si `this` es mayor que `other`

El patrón siempre es el mismo: llamas a `compareTo()`, y comparas ese `int` resultante con `0` usando los operadores normales (`<`, `>`, `==`) — porque ahora sí estás comparando dos primitivos `int`, no dos objetos `BigDecimal`.

```java
BigDecimal hours = request.getHours();

if (hours.compareTo(new BigDecimal("0.5")) < 0 || hours.compareTo(new BigDecimal("24")) > 0) {
    throw new RuntimeException("Hours must be between 0.5 and 24");
}
```

Léelo así: "si `hours` comparado con 0.5 da negativo (es decir, `hours` es menor que 0.5) O `hours` comparado con 24 da positivo (`hours` es mayor que 24), lanza la excepción".

> **`compareTo() == 0` para igualdad, nunca `equals()`.** Si alguna vez necesitas comprobar igualdad de valor entre dos `BigDecimal` (por ejemplo, "¿el total facturado es exactamente 100?"), usa `total.compareTo(new BigDecimal("100")) == 0`, no `total.equals(new BigDecimal("100"))` — porque si `total` llegó como `"100.00"` (con dos decimales, algo habitual cuando viene de una columna `DECIMAL(10,2)` de la base de datos), `.equals()` devolvería `false` aunque el valor sea idéntico.

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

El compilador ejecuta un análisis llamado **asignación definida** (*definite assignment*): recorre todas las rutas posibles que podría tomar la ejecución desde la declaración hasta esta línea y se pregunta "¿hay alguna ruta que llegue aquí sin pasar por una asignación?" Si existe aunque sea una sola de esas rutas, se niega a compilar. Por eso el mensaje dice "*might* not have been initialized" ("podría no haberse inicializado") en lugar de "no se inicializó" — el compilador no está afirmando que esta ejecución concreta vaya a fallar; está diciendo que no puede demostrar lo contrario para todas las ejecuciones posibles.

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
> La razón de esta diferencia está en dónde vive cada uno. Un campo pertenece a un objeto en el heap, y la JVM pone a cero todo ese bloque de memoria mientras lo reserva, así que un valor por defecto sale gratis. Una variable local vive en el stack frame del método, que es memoria reutilizada de lo que se ejecutara antes en ese mismo sitio — así que una local sin asignar contendría basura sobrante, y en lugar de poner a cero cada frame, el lenguaje simplemente prohíbe leer una así. Es una consecuencia directa de la separación stack/heap que cubre [15-modelo-de-memoria.md](15-modelo-de-memoria.md).
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

La variable no está "vacía" aquí fuera — el nombre directamente no existe, por eso el error es `cannot find symbol` en lugar de una queja sobre null. La consecuencia práctica es que si necesitas un valor después de un bloque, lo declaras *antes* del bloque y lo asignas dentro. Esto es el mismo scoping por bloques que `let` y `const` en JavaScript; Java simplemente no tiene equivalente del viejo `var` con scope de función.

### Convenciones de nombres

No las impone el compilador, pero todo código base en Java y todo revisor las espera, y Spring en sí mismo depende de la tercera:

- **`camelCase` para variables, campos y métodos** — `totalHours`, `isActive`, `findByEmail`. Primera palabra en minúscula, cada palabra siguiente con la inicial en mayúscula.
- **`UPPER_SNAKE_CASE` para constantes** — `MAX_HOURS`, `DEFAULT_ROLE`. Reservado para valores `static final`; verlo le dice al lector "esto nunca cambia" antes incluso de que lea los modificadores.
- **`PascalCase` para nombres de clase** — `TimeEntry`, `UserRepository`. Fíjate en que así es como distingues `Integer` (una clase) de `int` (un primitivo) de un vistazo.
- Los nombres se escriben completos, no abreviados. `numberOfEmployees`, no `numEmp`. El código Java es verboso por cultura, y una revisión de código en una consultora te va a señalar los nombres cortos.

### `final` — y la media verdad de que "es `const`"

`final` en una variable significa que puede asignarse exactamente una vez; cualquier asignación posterior es un error de compilación:

```java
final int MAX_HOURS = 24;
MAX_HOURS = 30;    // MAL — error: cannot assign a value to final variable MAX_HOURS
```

Compararlo con el `const` de JavaScript es un anclaje genuinamente directo — ambos se comportan igual, incluida la parte que la gente hace mal en los dos lenguajes. `final` congela la **variable**, lo cual para un objeto significa que congela la *referencia*: la dirección dentro de la caja. No dice absolutamente nada sobre el objeto al que apunta esa dirección.

Vuelve al diagrama del principio del archivo y la regla se vuelve obvia. `final` pone un candado en la caja de la izquierda. El objeto de la caja de la derecha queda intacto, y cualquiera que tenga esa dirección puede seguir modificándolo:

```java
// MAL — pensar que final hacía la lista de solo lectura
final List<String> names = new ArrayList<>();
names.add("Victor");        // ✅ compila y funciona — la lista queda mutada
names.add("Ana");           // ✅ sigue bien — nunca reasignaste la variable
names = new ArrayList<>();  // ❌ error: cannot assign a value to final variable names

// BIEN — si quieres el contenido congelado, congela el contenido
final List<String> names = List.of("Victor", "Ana");
names.add("Luis");          // ❌ lanza UnsupportedOperationException en tiempo de ejecución
```

Lee los dos errores uno junto al otro, porque son toda la lección: reasignar la variable falla en **tiempo de compilación** (`cannot assign a value to final variable names`), mientras que mutar una lista inmutable falla en **tiempo de ejecución** (`UnsupportedOperationException`). `final` es una promesa sobre el nombre, impuesta por el compilador; la inmutabilidad es una promesa que el objeto hace sobre sí mismo. Necesitas las dos cosas para conseguir "esto de verdad no puede cambiar", y las impone dos mecanismos distintos en dos momentos distintos.

> **Por qué `final` aparece por todas partes en el código de Spring Boot.** Las clases de servicio y de controlador declaran sus colaboradores como `private final UserRepository userRepository;`. El `final` documenta que, una vez que Spring inyecta el repositorio a través del constructor, nada puede cambiarlo después — las dependencias de un bean son fijas durante toda la vida de la aplicación. También permite que el compilador detecte un constructor que se olvida de asignar alguna de ellas. La inyección por constructor y este patrón se cubren en las notas de Spring Boot; aquí basta con reconocer `final` como el marcador de "se asigna una vez, nunca más".

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

> **Alcance exacto: "widening" no siempre significa "sin pérdida de datos".** Dos de las conversiones de widening sí tienen pérdida, y Java las realiza automáticamente de todos modos. `int` → `float` y `long` → `double` se mueven ambas a un tipo *más ancho* que, sin embargo, tiene *menos* cifras significativas, porque un tipo de coma flotante gasta parte de sus bits en el exponente en lugar de en los dígitos. Un `float` tiene 32 bits como un `int`, pero solo unos 24 de ellos transportan dígitos:
>
> ```java
> int precise = 16777217;      // 2^24 + 1
> float widened = precise;     // automático — sin cast, sin aviso
> System.out.println(widened); // 1.6777216E7  ← 16777216, no 16777217. El 1 desapareció.
> ```
>
> Lo mismo pasa con `long` → `double` a partir de 2⁵³. Nada te avisa, porque la regla que impone el compilador es *rango*, no *precisión*: el rango de `float` (±3.4 × 10³⁸) contiene cómodamente cualquier `int`, así que la conversión es legal, y el dígito perdido es un daño colateral que el lenguaje acepta. La afirmación fiable es entonces "el widening nunca desborda", no "el widening nunca pierde datos". Para cada conversión de narrowing más abajo, el compilador sí te detiene y exige un cast — que es exactamente por qué estos dos widenings con pérdida son los peligrosos: son las pérdidas que nadie está vigilando.

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

La trampa es que nada en la expresión te dice qué tipo de división vas a obtener — depende por completo de los *tipos de los operandos*, que pueden estar a varias llamadas a método de distancia:

```java
int totalHours = 7;
int entries = 2;

// MAL — el promedio es 3, en silencio. Sin aviso, sin error, informe equivocado.
double average = totalHours / entries;

// BIEN — fuerza a double UNO de los operandos ANTES de que ocurra la división
double average = (double) totalHours / entries;   // 3.5
```

La razón por la que la primera línea falla merece rastrearse, porque parece que debería funcionar: el `double` de la izquierda no tiene ninguna influencia sobre la división. Java evalúa primero el lado derecho, por completo bajo sus propios términos — dos `int`, así que división entera, así que `3`. Solo *después* ensancha ese `3` a `3.0` y lo guarda. El `double` llega un paso demasiado tarde; la información ya se había perdido. El cast de la versión corregida funciona porque cambia un operando *antes* de que se ejecute el `/`, lo cual convierte toda la expresión en división de coma flotante.

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

> **Cuando necesitas que te *avisen* de un overflow, pídelo.** Java 8 añadió la familia `Math.*Exact` — `addExact`, `multiplyExact`, `subtractExact` — que hacen la misma aritmética pero lanzan una excepción en vez de dar la vuelta:
>
> ```java
> Math.addExact(Integer.MAX_VALUE, 1);   // lanza ArithmeticException: integer overflow
> ```
>
> Úsalas donde un número equivocado sea peor que un crash: totales de una factura, cantidades en un sistema de inventario, cualquier cosa sobre la que una persona vaya a actuar. Para un contador de bucle, el `+` normal está bien. Saber nombrar esta familia en una entrevista es una forma barata de demostrar que sabes que el overflow es silencioso por defecto, en lugar de simplemente haberlo oído mencionar.

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

"Reference" es la palabra del diagrama del principio de este archivo — un tipo cuya variable contiene una dirección. Un argumento de tipo genérico siempre tiene que serlo, porque una colección guarda direcciones en sus ranuras; no hay sitio dentro de ella para meter un valor crudo de 32 bits. Así que usas `List<Integer>` en su lugar. Las colecciones se cubren en detalle en [07-colecciones.md](07-colecciones.md) — de momento, quédate con que son las estructuras de datos principales de Java y todas exigen tipos objeto.

**Otro caso:** las clases wrapper pueden ser `null`. Un `int` primitivo no puede ser null, pero `Integer` sí. En Spring Boot, los IDs de base de datos se suelen declarar como `Long` (no `long`) porque Hibernate los establece a `null` hasta que la entidad se guarda por primera vez.

### Cuándo usar cada uno — la regla práctica

> **Adelanto — Spring Boot:** el fragmento de abajo usa `@Id`, `@GeneratedValue` y `@Value`, anotaciones de Spring Boot y JPA que aún no has estudiado. `@Id` y `@GeneratedValue` marcan el campo que se mapea a la clave primaria de la tabla y le dicen a la base de datos que la genere; `@Value` inyecta un valor desde el archivo de configuración. Están aquí solo para mostrar *dónde* se toma realmente la decisión primitivo-vs-wrapper en un backend real — implementarás las tres en las notas de Spring Boot.

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

**El mecanismo no es magia — es el compilador escribiendo por ti el código antiguo.** El autoboxing es una característica puramente de *tiempo de compilación*: el compilador ve un primitivo donde se requiere un objeto (o al revés), y literalmente inserta la llamada de conversión en el bytecode. La JVM en tiempo de ejecución no tiene ni idea de que el autoboxing existe; solo ve las llamadas explícitas. Lo que escribes y lo que realmente se compila son estas dos columnas:

| Tú escribes           | Lo que emite el compilador          |
| -------------------- | -------------------------------- |
| `Integer a = 42;`    | `Integer a = Integer.valueOf(42);` |
| `int b = a;`         | `int b = a.intValue();`          |
| `ids.add(42);`       | `ids.add(Integer.valueOf(42));`  |
| `int f = ids.get(0);`| `int f = ids.get(0).intValue();` |

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

### La caché de `Integer` — por qué `==` funciona por accidente con números pequeños

Ya sabes por la sección de String que `==` sobre objetos compara direcciones, así que comparar dos `Integer` con `==` debería estar mal. Ejecútalo y obtienes un resultado que no tiene ningún sentido:

```java
Integer a = 127, b = 127;
a == b            // true  ← ???

Integer c = 128, d = 128;
c == d            // false ← el mismo código, un número más alto
```

No hay nada distinto entre 127 y 128 como *valores*. La diferencia está en la llamada a `Integer.valueOf()` que el compilador insertó por ti hace un momento. Ese método no construye un objeto nuevo cada vez: mantiene un array precargado de objetos `Integer` para el rango **−128 a 127**, y para cualquier valor dentro de ese rango devuelve el *mismo objeto en caché* en lugar de reservar uno nuevo. Dos variables que contienen 127 apuntan por tanto de verdad al mismo objeto, y `==` sobre las dos direcciones da `true`. En 128 la caché se agota, `valueOf` reserva un objeto nuevo cada vez, las dos direcciones difieren, y `==` vuelve a estar mal.

```
Integer a = 127 ─┐                 Integer c = 128 ──→ [ Integer 128 ]  (objeto nuevo)
                 ├──→ [ Integer 127 en caché ]
Integer b = 127 ─┘                 Integer d = 128 ──→ [ Integer 128 ]  (otro objeto nuevo)

     un solo objeto, así que a == b es true          dos objetos, así que c == d es false
```

> **¿Por qué existe esta caché siquiera?** Los enteros pequeños son, con mucha diferencia, los más comunes — contadores de bucle, tamaños de lista, códigos de estado, edades. Hacer boxing de ellos millones de veces reservaría millones de objetos idénticos para que el recolector de basura los limpiara, así que la JVM precarga los más comunes una sola vez al arrancar y los reutiliza. Es una optimización de memoria que nunca estuvo pensada para ser visible; que `==` devuelva `true` es un efecto colateral que se filtra hacia fuera. La caché es segura precisamente porque `Integer` es inmutable — compartir un objeto entre trozos de código no relacionados no puede causar ningún problema cuando nadie puede cambiarlo.

La lección no es "recuerda el rango". Es que **`==` sobre wrappers es un bug que pasa sus propios tests**: lo escribes, lo pruebas con números pequeños, funciona, sale a producción, y falla la primera vez que un ID real supera 127. Usa siempre `.equals()` para comparar wrappers, o desenvuelve ambos lados a primitivos primero (`a.intValue() == b.intValue()`), donde `==` compara valores y es correcto por definición. La misma caché existe para `Long`, `Short` y `Byte` en el mismo rango de −128 a 127 (y para `Character` en el rango de 0 a 127, ya que un `char` no tiene negativos) — que es exactamente por qué un `Long id` comparado con `==` es un bug de producción tan fiable: se comporta bien durante el desarrollo, donde los datos de prueba tienen ids 1, 2 y 3, y se rompe con datos reales.

### Métodos útiles de wrapper

Los **métodos estáticos** pertenecen a la clase en sí, no a ningún objeto concreto — por eso los llamas sobre el nombre de la clase (`Integer.parseInt("42")`) sin crear un objeto con `new`. Los métodos estáticos se cubren en detalle en [03-metodos.md](03-metodos.md).

Estos métodos estáticos son genuinamente útiles en el código del día a día:

```java
Integer.parseInt("42");     // String → int (primitivo)
Integer.valueOf("42");      // String → Integer (objeto, posiblemente de la caché de arriba)
Integer.MAX_VALUE;          // 2147483647 — el mayor valor int posible
Integer.MIN_VALUE;          // -2147483648
```

(Para ir en el otro sentido, `String.valueOf(42)` convierte un `int` en `"42"` — fíjate en que ese es un método de `String`, no de `Integer`, así que pertenece a la sección de String más que a esta.)

**`parseInt` frente a `valueOf` — el par confundible.** Reciben el mismo argumento y parecen intercambiables, y la diferencia está solo en el tipo de retorno: `parseInt` devuelve un `int` primitivo, `valueOf` devuelve un objeto `Integer`. De hecho `valueOf` está implementado llamando a `parseInt` y luego haciendo boxing del resultado — lo que significa que también pasa por la caché, así que `Integer.valueOf("42") == Integer.valueOf("42")` da `true` mientras que `Integer.valueOf("1000") == Integer.valueOf("1000")` da `false`. Elige según lo que necesites a continuación: `parseInt` cuando el valor va directo a una operación aritmética o a una variable `int`, `valueOf` cuando va a una colección o a un campo que puede ser `null`. Elegir el equivocado es inofensivo — el autoboxing lo convierte —, pero saber nombrar la diferencia es una pregunta estándar de entrevista junior.

> **Los dos lanzan excepción cuando el texto no es un número, y el mensaje nombra al culpable.** Este es el camino de fallo que te vas a encontrar la primera vez que un usuario escriba algo inesperado en un formulario:
>
> ```java
> Integer.parseInt("abc");
> // java.lang.NumberFormatException: For input string: "abc"
> ```
>
> `NumberFormatException` es **unchecked**, así que el compilador no te obliga a manejarla — nada en tu IDE te va a recordar que esta línea puede estallar. Fíjate en qué cuenta como "no es un número": `"42 "` con un espacio al final también falla (a diferencia de `Double.parseDouble`, `parseInt` no recorta espacios), igual que `""` y `null`. Cualquier vez que el string venga de fuera de tu programa — un campo de formulario, una variable de ruta de una URL, una fila de un CSV — esta llamada necesita o un `try/catch` o validación por delante. El manejo de excepciones se cubre en [08-excepciones.md](08-excepciones.md); de momento, solo registra que este método concreto es una fuente habitual de errores 500.

---

## String

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → leer: "String Basics" y "String Basic Manipulations" para el catálogo de métodos, luego [Guide to Java String Pool](https://www.baeldung.com/java-string-pool) → "String Interning" para entender por qué `==` a veces parece funcionar.

`String` no es un primitivo — es una clase. Pero Java lo trata como un primitivo en muchos aspectos (puedes asignar con `=`, no necesitas `new`).

```java
String name = "Victor";
String greeting = "Hello, " + name;                   // concatenación con +
String greeting2 = "Hello, %s".formatted(name);       // sustitución de plantilla — Java 15+
```

El método `.formatted()` reemplaza marcadores de posición en el string. `%s` significa "aquí va un string", `%d` significa "aquí va un entero". Es la misma idea que los template literals de JavaScript — `` `Hello, ${name}` `` — pero con marcadores posicionales. El orden importa: los valores se emparejan con los marcadores de izquierda a derecha, en el orden en que aparecen en el string.

```java
"User %s has %d points".formatted("Victor", 100);  // "User Victor has 100 points"
"User %s has %d points".formatted(100, "Victor");  // MAL — argumentos intercambiados
```

Intercambiarlos no falla en tiempo de compilación — `formatted` recibe `Object...`, así que cualquier argumento en cualquier orden es una llamada legal en lo que al compilador respecta. Estalla cuando la línea realmente se ejecuta:

```
java.util.IllegalFormatConversionException: d != java.lang.String
```

Lee ese mensaje como "a `%d` se le entregó un `java.lang.String`". Fíjate en *cuál* marcador se queja: `%s` se tragó el `100` sin protestar, porque `%s` simplemente llama a `toString()` sobre lo que reciba y todo objeto tiene uno. Solo `%d` es exigente, porque tiene que producir dígitos. Así que un par intercambiado falla en el marcador *numérico*, nunca en el `%s` — algo que conviene saber, porque el error apunta a la segunda mitad del string mientras que el error está en la primera.

Para decimales, usa `%f`. Puedes controlar cuántos decimales mostrar con `.Nf` (N = número de dígitos): `"Price is %.2f euros".formatted(19.99)` → `"Price is 19.99 euros"`.

### Métodos comunes

```java
name.length()                     // 6 — cuántos caracteres
name.toUpperCase()                // "VICTOR" — todo en mayúsculas
name.toLowerCase()                // "victor" — todo en minúsculas
name.contains("ict")              // true — ¿contiene el string esta secuencia?
name.startsWith("Vi")             // true — ¿empieza por esto?
name.replace("Victor", "World")   // "World" — reemplaza todas las ocurrencias de una subcadena
name.trim()                       // elimina espacios al inicio y al final — pero prefiere strip(), ver la siguiente sección
name.isEmpty()                    // false — true solo si el string es exactamente ""
name.isBlank()                    // false — true si está vacío O contiene solo espacios
name.substring(0, 3)              // "Vic" — caracteres del índice 0 al 2 (el índice final se excluye)
name.split(",")                   // divide por coma — devuelve String[]
name.equals("Victor")             // true — usa siempre esto para comparar contenido (ver abajo)
name.equalsIgnoreCase("victor")   // true — igual pero ignora mayúsculas/minúsculas
```

Dos entradas de esa lista están ahí porque las verás en todos los tutoriales, no porque debas recurrir a ellas: `trim()` está superado por `strip()`, y `isEmpty()` suele ser la comprobación equivocada cuando `isBlank()` está disponible. La siguiente sección trata exactamente sobre ese par — léela antes de usar cualquiera de los dos.

### `strip()` frente a `trim()` — usa `strip()`

> 📖 Docs: [Baeldung — Java Strip Methods](https://www.baeldung.com/java-string-strip-methods) → leer: "Comparing the Strip Methods vs the trim() Method" — y su subsección "The strip() Method vs the trim() Method".

La lista de métodos de arriba incluye `trim()`, y es el que enseña cualquier tutorial escrito antes de 2018. Java 11 añadió `strip()`, que hace el mismo trabajo correctamente, y `strip()` es al que debes recurrir de ahora en adelante.

Los dos se diferencian en *qué consideran espacio en blanco*, y las definiciones son de épocas distintas. `trim()` es anterior al soporte de Unicode en Java: elimina todo carácter cuyo code point sea menor o igual que `U+0020` (el espacio normal). Es una regla numérica tosca — resulta que atrapa espacios, tabuladores y saltos de línea, y también atrapa unos pocos caracteres de control que no son espacio en blanco en absoluto. `strip()` en cambio consulta `Character.isWhitespace()`, que revisa las tablas reales de Unicode:

```java
String em = "\u2003Victor\u2003";   // U+2003 EM SPACE — espacio en blanco Unicode real

em.length()          // 8
em.trim().length()   // 8  ← MAL: trim lo dejó tal cual, porque U+2003 > U+0020
em.strip().length()  // 6  ← BIEN: strip sabe que U+2003 es espacio en blanco
```

Para input ASCII puro, los dos son idénticos — `"   Victor   "` vuelve como `"Victor"` en ambos casos. La diferencia solo aparece con texto que viene de algún sitio real: un documento de Word, un PDF, un copiar-pegar de una página web, un formulario rellenado desde el teclado de un móvil. Esos suelen traer espacios em, espacios ideográficos (`U+3000`, estándar en textos chino y japonés) y espacios de no separación, y `trim()` deja todos y cada uno de ellos en su sitio — así que un nombre que llegó como `"Victor\u2003"` falla una comprobación de igualdad contra `"Victor"` y obtienes un "usuario no encontrado" para un nombre que en pantalla se ve perfectamente correcto. Ese es todo el argumento a favor de `strip()`: no cuesta nada de escribir y elimina una clase de bug que no puedes ver.

> **El único caso donde `strip()` también deja el carácter intacto.** El espacio de no separación de Unicode `U+00A0` — el carácter que produce un `&nbsp;` de HTML, y el causante invisible más común en input web — *no* es espacio en blanco según `Character.isWhitespace()`, porque está definido deliberadamente como "no separador". Ni `trim()` ni `strip()` lo eliminan. Si estás limpiando input que llegó a través de un navegador, necesitas `input.replace('\u00A0', ' ').strip()`. Nadie descubre esto leyendo la documentación; lo descubre mirando fijamente dos strings que se imprimen idénticos y comparan `false`.

El mismo salto de calidad aplica a las comprobaciones de vacío de la lista de arriba: `isEmpty()` es `true` solo para `""`, mientras que `isBlank()` (también de Java 11) es `true` para `""` *y* para cualquier string formado solo por espacios en blanco — usando la misma regla `Character.isWhitespace()` que `strip()`. En código de validación, `isBlank()` es casi siempre la comprobación que en realidad querías, porque `"   "` tampoco es un nombre real.

### Text blocks — strings multilínea sin el escapado (Java 15+)

> 📖 Docs: [Baeldung — Java Text Blocks](https://www.baeldung.com/java-text-blocks) → leer: "Usage" para la sintaxis y "Indentation" para la regla de la indentación incidental.

Incrustar un trozo de JSON o SQL en código fuente de Java solía ser genuinamente doloroso, porque había que escapar cada comilla del contenido y deletrear cada salto de línea:

```java
// MAL — esto es lo que escribías antes de Java 15
String json = "{\n  \"name\": \"Victor\",\n  \"role\": \"EMPLOYEE\"\n}";
```

Eso no se puede leer, no se puede pegar en Postman para comprobarlo, y una sola barra invertida que falte es un error de compilación. Un **text block** es un literal de string delimitado por tres comillas dobles, y dentro de él las comillas y los saltos de línea son simplemente ellos mismos:

```java
// BIEN — un text block
String json = """
        {
          "name": "Victor",
          "role": "EMPLOYEE"
        }""";
```

Dos reglas de sintaxis que impone el compilador. El `"""` de apertura debe ir seguido de un **salto de línea** — el contenido no puede empezar en la misma línea, y si lo intentas obtienes un mensaje que nombra la regla directamente:

```java
String s = """hello""";   // MAL — error: illegal text block open delimiter sequence, missing line terminator
```

El `"""` de cierre es más libre: puede ir al final de la última línea de contenido (como en el JSON de arriba) o en su propia línea. Esa elección no es cosmética, sin embargo — ver el callout de abajo.

> **¿A dónde se fue la indentación?** El bloque de arriba está indentado ocho espacios para alinearse con el código que lo rodea, y aun así el string resultante empieza en la columna cero. El compilador elimina lo que la especificación llama **espacio en blanco incidental**: mira cada línea no vacía *más la línea que contiene el `"""` de cierre*, encuentra la menor indentación entre todas ellas, y la quita de cada línea. Así que la indentación que añadiste para mantener el código fuente legible no cuesta nada, y la indentación que añadiste *a propósito* — los dos espacios antes de `"name"` — sobrevive, porque es mayor que el mínimo.
>
> La consecuencia a recordar: **mover el `"""` de cierre cambia el string.** Ponlo en su propia línea en la columna cero y la indentación mínima pasa a ser cero, así que los ocho espacios reaparecen de golpe dentro de tu JSON. Es la única sorpresa de los text blocks que merece la pena conocer antes de que ocurra.

El tipo sigue siendo `String` — un text block es una forma distinta de *escribir* un literal, no un tipo nuevo, así que todos los métodos de la lista de arriba funcionan sobre él, y `.formatted()` también funciona. Dónde realmente vas a recurrir a uno: un fixture JSON en un test, una consulta SQL multilínea en un repositorio, o una plantilla de email en HTML.

### Comparación de Strings — usa siempre `equals()`

En Java, `==` compara **direcciones de memoria** (referencias), no el contenido. Dos variables `String` pueden contener exactamente los mismos caracteres y aun así vivir en dos direcciones distintas — y `==` compara las direcciones, así que devuelve `false` aunque el texto sea idéntico.

`.equals()` siempre compara los caracteres reales — eso es lo que casi siempre quieres:

```java
String a = new String("hello");
String b = new String("hello");

a == b        // false — dos objetos separados, direcciones distintas
a.equals(b)   // true — mismos caracteres, que es lo que querías comparar
```

> **Cuidado — los literales de string son una trampa aquí.** Si escribes `String a = "hello"; String b = "hello";` (literales normales, sin `new`), entonces `a == b` sí devuelve `true` — porque Java mantiene una única copia compartida de cada literal en una caché llamada **string pool**, así que ambas variables acaban apuntando al mismísimo objeto. Eso hace que `==` *parezca* que funciona. Se rompe en cuanto uno de los strings viene de otro sitio — input del usuario, una fila de la base de datos, `new String(...)`, o un valor construido por concatenación en tiempo de ejecución — y entonces `==` devuelve `false` en silencio. El pool es exactamente la razón por la que nunca debes fiarte de `==` para comparar contenido: funciona justo lo suficiente como para engañarte. El pool en sí se explica en [15-modelo-de-memoria.md](15-modelo-de-memoria.md).

> **¿Por qué existe `==` para Strings, entonces?** Para los objetos (incluido `String`), `==` comprueba si dos variables apuntan al **mismo objeto en memoria** — no solo al mismo valor. Esto importa en algunos casos (por ejemplo, comprobar si dos entradas de una lista son literalmente el mismo objeto), pero para Strings casi nunca quieres eso.

### `String`, `StringBuilder`, `StringBuffer`

> 📖 Docs: [Baeldung — StringBuilder and StringBuffer in Java](https://www.baeldung.com/java-string-builder-string-buffer) → leer: "Similarities" y "Differences" (con su subsección "Performance") — la diferencia de sincronización y cuándo te cuesta caro.

El problema: `String` es **inmutable** — una vez creado, no puede modificarse. Cada vez que haces `str += something`, Java no modifica el string original. Crea un objeto `String` completamente nuevo con el contenido combinado. En un bucle de 1000 iteraciones, creas 1000 objetos — lento y costoso. ("Costoso" son en realidad dos gastos separados, reservar cada objeto y luego limpiarlo; [15-modelo-de-memoria.md](15-modelo-de-memoria.md) retoma exactamente este bucle en cuanto entra en juego el garbage collection. De momento: un objeto por iteración, todos menos el último desechados.)

`StringBuilder` usa un **buffer** para resolver esto — un espacio en memoria donde va acumulando los trozos del string mientras los construyes, como una pizarra en la que sigues escribiendo hasta tener el resultado final. Lo modificas en el sitio sin crear objetos nuevos, y cuando terminas llamas a `.toString()` para obtener el string acabado.

El concepto de **thread-safety** aparece aquí porque `StringBuilder` no es thread-safe — y en Spring Boot esto importa porque cada petición HTTP llega en un hilo distinto. Si declararas un `StringBuilder` como campo compartido de un bean de Spring (que es un singleton), varios hilos podrían escribir en él a la vez y corromper el resultado.

> **Adelanto — Spring Boot:** el fragmento de abajo está anotado con `@Service`, que aún no has estudiado. Marca una clase que Spring debe crear **una sola vez** al arrancar y entregar a quien la necesite — un *singleton*, una única instancia compartida para toda la aplicación. Esa sola palabra es toda la razón por la que el ejemplo es peligroso: un objeto, todos los hilos de petición escribiendo en él. Implementarás `@Service` en las notas de Spring Boot; aquí solo prepara el terreno.

```java
// MAL — compartido entre todos los hilos (nunca hagas esto con StringBuilder)
@Service
public class ReportService {
    private StringBuilder sharedBuilder = new StringBuilder();  // ← todos los hilos lo comparten
}

// BIEN — local al método, solo existe durante esa petición
public String buildReport(List<String> lines) {
    StringBuilder sb = new StringBuilder();  // ← solo este hilo lo ve
    for (String line : lines) sb.append(line).append("\n");
    return sb.toString();
}
```

> **¿Qué significa thread-safe?** Un **thread** (hilo) es una tarea que corre en paralelo con otras dentro del mismo programa. En una API REST, Spring Boot asigna un hilo distinto a cada petición HTTP entrante — así es como sirve varias a la vez sin esperar a que termine la primera. **Thread-safe** significa que varios hilos pueden usar el mismo objeto al mismo tiempo sin que uno corrompa el trabajo del otro. `String` y `StringBuffer` son thread-safe; `StringBuilder` no lo es. En la práctica el riesgo directamente no existe si creas el `StringBuilder` como variable local dentro de un método — ese objeto es tuyo y ningún otro hilo lo toca.

Lee la tabla eligiendo tus dos restricciones — ¿necesitas que el objeto sea modificable, y lo toca más de un hilo — y la última columna te da el tipo que encaja. Casi siempre acabas en `String` (inmutable, seguro) para valores del día a día y en `StringBuilder` (mutable, un solo hilo) para bucles.

|                 | ¿Inmutable? | ¿Thread-safe? | Cuándo usar                             |
| --------------- | ---------- | ------------ | ---------------------------------------- |
| `String`        | Sí         | Sí           | La mayoría de casos — leer, pasar, comparar |
| `StringBuilder` | No         | No           | Construir strings en un bucle (rápido)   |
| `StringBuffer`  | No         | Sí           | Construcción de strings multi-hilo (raro) |

```java
// Ineficiente — crea un nuevo objeto String en cada iteración
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;
}

// Eficiente — muta el mismo objeto
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);   // modifica el StringBuilder en lugar de crear uno nuevo
}
String result = sb.toString();
```

> **¿Por qué `.append()` y no `+=`?** Porque `StringBuilder` es mutable — `.append()` modifica el objeto existente sin crear nada nuevo. `+=` sobre un `String` crea un objeto completamente nuevo cada vez (por eso es lento). `StringBuilder` no sobrecarga el operador `+=`, así que expone su propio método `.append()` para dejar explícito que estás mutando el objeto en el sitio.

En Spring Boot trabajarás sobre todo con `String`. Usa `StringBuilder` cuando estés construyendo un string largo uniendo muchas piezas — por ejemplo, generando una lista separada por comas o ensamblando un fragmento SQL en un método de un servicio.

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
> La segunda línea, entre paréntesis, es el compilador diciéndote *cuál* de los dos casos te ha tocado. El primero es la declaración separada que viste en la sección Variables — perfectamente legal con un tipo explícito (`int count;`), imposible con `var`, porque no hay nada de lo que leer el tipo. El segundo falla porque `null` es un valor legal de *todo* tipo de referencia, así que no restringe nada; si de verdad quieres una variable inicializada a null tienes que nombrar tú mismo el tipo (`String y = null;`).
>
> Esta es también la razón por la que `var` no se puede usar en un campo o un parámetro de método: el valor de un parámetro solo llega cuando se llama al método, mucho después de que el compilador necesitara fijar el tipo.

Útil cuando el tipo es largo y obvio por el lado derecho: `var employees = employeeRepository.findAll()` es más limpio que `List<Employee> employees = employeeRepository.findAll()`.

---

Ya tienes la materia prima: los ocho primitivos, sus objetos wrapper, `String` con sus comodidades `strip()`/text blocks, el casting entre tipos, y `var`. Dos hilos atraviesan toda esta página y ambos continúan en el siguiente archivo. El primero es **valor frente a referencia** — el diagrama del principio explica `==` sobre Strings, `final` sobre una `List`, la caché de `Integer`, y el unboxing de null, y es la idea que [15-modelo-de-memoria.md](15-modelo-de-memoria.md) acaba terminando de explicar. El segundo es que **Java falla en dos momentos distintos**: algunos errores el compilador los rechaza directamente (`integer number too large`, `possible lossy conversion`, `cannot infer type`), y otros los deja pasar para que estallen o se equivoquen en silencio en tiempo de ejecución (overflow, división truncada, `NumberFormatException`). Aprender a distinguir cuál es cuál *es* aprender Java.

Pero una variable que simplemente se queda ahí guardando un valor no hace nada por sí sola — un programa tiene que *decidir* y *repetir*: ejecutar este bloque solo si la edad es mayor de 18, recorrer cada entrada de la lista. Eso es el control de flujo, y es lo que cubre a continuación [02-flujo-de-control.md](02-flujo-de-control.md) — `if`/`else`, `switch`, y los bucles que ponen a trabajar estos tipos. Fíjate en la misma división silencioso-contra-ruidoso ahí: hacer un `switch` sobre un String `null` y salirse un índice más allá del final de un array son ambos fallos en tiempo de ejecución, y ambos son consecuencias de lo que acabas de leer aquí.
