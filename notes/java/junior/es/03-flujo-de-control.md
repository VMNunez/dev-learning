## Índice de esta nota

- [Flujo de control](#flujo-de-control)
- [1. if / else](#if--else)
  - [Los valores imposibles van al principio de la cadena](#los-valores-imposibles-van-al-principio-de-la-cadena)
  - [Operador ternario](#operador-ternario)
- [2. switch](#switch)
  - [Qué acepta `switch` — el alcance exacto](#qué-acepta-switch--el-alcance-exacto)
  - [switch clásico (sentencia)](#switch-clásico-sentencia)
  - [Switch expression (Java 14+) — usa esta forma](#switch-expression-java-14--usa-esta-forma)
- [3. Bucles for](#bucles-for)
  - [for clásico](#for-clásico)
  - [Enhanced for (for-each) — úsalo para colecciones y arrays](#enhanced-for-for-each--úsalo-para-colecciones-y-arrays)
- [4. while y do-while](#while-y-do-while)
  - [Elegir entre las cuatro formas de bucle](#elegir-entre-las-cuatro-formas-de-bucle)
- [5. break, continue y return](#break-continue-y-return)
  - [`return` — sale del método, no del bucle](#return--sale-del-método-no-del-bucle)
  - [Break y continue etiquetados — escapar de bucles anidados](#break-y-continue-etiquetados--escapar-de-bucles-anidados)
- [6. Guardas de null](#guardas-de-null)

# Flujo de control

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → leer: "If/Else/Else If", "Switch" y "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

En [01-variables-tipos.md](01-variables-tipos.md) aprendiste a declarar y guardar valores tipados, y en [02-cadenas-de-texto.md](02-cadenas-de-texto.md) a construir, inspeccionar y comparar el texto en que esos valores se convierten. Ambos capítulos te dejaron con la misma limitación, y esa es la razón de que este llegue ahora: cada línea que escribiste se ejecutó exactamente una vez, de arriba a abajo, en el orden en que la escribiste. La única excepción fueron los bucles `for` de la sección de `StringBuilder` de `02-cadenas-de-texto.md`, que leíste allí sin explicación; este capítulo te la da. Un programa que solo guarda valores y da formato a texto no hace nada interesante — arranca, evalúa, y termina. El control de flujo es lo que permite a un programa *tomar decisiones* sobre esos valores (ejecutar este bloque, saltarse aquel) y *repetir* trabajo (recorrer una lista). Es la diferencia entre un guion fijo y un programa que reacciona a sus datos.

Las sentencias de control de flujo deciden qué código se ejecuta y cuántas veces. Java usa las mismas estructuras que JavaScript — la sintaxis es casi idéntica, así que la mayoría te resultará familiar.

**Un mismo ejemplo recorre todo este archivo: un parte de horas semanal.** Es el mismo parte de horas que usó `02-cadenas-de-texto.md`. Tienes un `Employee`, un `day` de la semana, y las `hours` que ese empleado registró ese día. Cada sección de abajo trabaja sobre ese mismo pequeño mundo — decidir si un día cuenta como horas extra, dar nombre al turno de un día, recorrer la semana, recorrer la lista de empleados, y detener ese recorrido antes de tiempo. Mantener un solo dominio significa que nunca tienes que reorientarte con un bloque de código nuevo — solo tienes que fijarte en lo que la *nueva* estructura añade. [04-metodos.md](04-metodos.md), el siguiente capítulo, también sigue usando `Employee`, así que merece la pena familiarizarse con él aquí.

```java
// El mundo de todo este archivo
int hours;                        // horas registradas en un día
String day;                       // "MONDAY", "SATURDAY"...
List<Employee> employees;         // el equipo
```

> **Dos de esas tres líneas usan cosas que todavía no se te han enseñado, y es deliberado.** `Employee` es una **clase** — un tipo que escribes tú mismo, que agrupa datos (un nombre, horas) con los métodos que los leen; cómo declarar una es el tema de [06-poo-clases.md](06-poo-clases.md). `List<Employee>` es una **lista de objetos `Employee`** — una secuencia ordenada y de tamaño variable, y el `<Employee>` entre corchetes angulares es lo que le dice al compilador qué contiene; la lista en sí es [10-colecciones.md](10-colecciones.md) y la notación con corchetes angulares es [09-genericos.md](09-genericos.md). Para este capítulo no necesitas nada de eso. Lee `Employee` como "un empleado": le preguntas su nombre con `emp.getName()`, las horas que registró esta semana con `emp.getHours()`, y si sigue activo con `emp.isActive()`, y le cambias las horas con `emp.setHours(...)`. Lee `List<Employee>` como "varios de ellos, en orden". Toda estructura de esta página trata de *qué líneas se ejecutan*, no de los valores sobre los que esas líneas trabajan.

---

## if / else

> 📖 Docs: [Baeldung — If-Else Statement in Java](https://www.baeldung.com/java-if-else) → leer: "Syntax of If-Else" y "Example of If-Else If-Else" — la condición booleana y la forma en cadena.

La herramienta de decisión básica. Java evalúa las condiciones de arriba a abajo y ejecuta el primer bloque cuya condición sea verdadera, y luego se salta todos los demás — aunque una condición posterior también fuese cierta. Si ninguna condición coincide y escribiste un `else`, ese bloque se ejecuta como opción por defecto.

```java
if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
```

> **Por qué importa que "gane el primer bloque verdadero".** El orden es parte de la lógica, no una cuestión de estilo. Si intercambias las dos primeras ramas — poniendo `hours > 0` primero — un empleado con 10 horas coincide con `hours > 0`, imprime `"Worked"`, y la rama de horas extra nunca se alcanza, porque Java se detiene en la primera coincidencia. La regla para cualquier cadena `if/else if`: pon primero la condición **más estrecha** y ve ampliando conforme bajas.

> **La condición tiene que ser un `boolean` de verdad.** Este es el único punto donde Java se aparta de JavaScript aquí, y [01-variables-tipos.md](01-variables-tipos.md) ya mostró por qué: Java no tiene valores truthy o falsy, así que `if (name)` falla con `incompatible types: String cannot be converted to boolean`. Para comprobar que una cadena tiene contenido lo escribes entero: `if (name != null && !name.isEmpty())`. Lo que este capítulo añade es el alcance de esa regla: se aplica a toda condición de esta página, así que la comprobación dentro de `while`, dentro de `do-while` y antes del `?` del ternario también tiene que ser un `boolean`.

### Los valores imposibles van al principio de la cadena

El aviso **Por qué importa que "gane el primer bloque verdadero"**, justo arriba, puso los dos casos normales en el orden correcto: horas extra antes que trabajado. Esa misma regla también decide dónde va un valor que nunca debería ocurrir. Un **caso excepcional** es una entrada para la que las ramas normales de la cadena no se escribieron. En un parte de horas, eso significa horas por debajo de cero, o más de las 24 que tiene un día. Un valor así suele llegar por un error de tecleo en un formulario o un bug en lo que sea que lo produjo.

Aquí está de nuevo la cadena del principio de la sección if / else, sin cambios. Dale dos valores imposibles y responde sin quejarse:

```java
// ❌ MAL — las ramas amplias se tragan los valores imposibles
if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
// hours = -3  imprime: Absent
// hours = 30  imprime: Overtime
```

Traza `hours = 30`. La primera comprobación es `30 > 8`. Es `true`, así que Java ejecuta el primer bloque, imprime `Overtime` y se salta todas las ramas de abajo. Ahora traza `-3`. `-3 > 8` es `false` y `-3 > 0` es `false`, así que se ejecuta el `else` e imprime `Absent`. Ninguna de las dos respuestas es un error: el programa sigue adelante y trata un error de tecleo como si fuera un día real de horas extra o una ausencia real. Ese es el bug oculto. Las ramas amplias (`> 8`, y el `else` que recoge todo lo que sobra) se escribieron para días reales, y también cubren los valores imposibles.

El arreglo es comprobar el caso excepcional **primero**, para que ninguna rama más amplia tenga ocasión de quedárselo:

```java
// ✅ BIEN — los valores imposibles se atrapan antes que cualquier rama normal
if (hours < 0 || hours > 24) {
    System.out.println("Invalid entry");
} else if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
// hours = -3  imprime: Invalid entry
// hours = 30  imprime: Invalid entry
// hours = 10  imprime: Overtime
// hours = 0   imprime: Absent
```

`hours < 0 || hours > 24` es `true` para los dos valores imposibles, así que se detienen en la primera rama. Un valor real hace que esa comprobación sea `false` y sigue a las mismas tres ramas de antes, que ahora solo ven horas entre 0 y 24. Así que toda la regla de orden para una cadena `if / else if` es: **los valores imposibles primero, luego el caso real más estrecho, ampliando conforme bajas, y el `else` al final para lo que quede.**

> **¿Por qué no añadir la comprobación al `else` del final?** Porque Java nunca llega al final con `30`: la rama `hours > 8` ya se lo ha quedado. Una comprobación solo puede atrapar un valor que llegue hasta ella, y en una cadena un valor se detiene en la primera comprobación que sea `true`. Solo la parte de arriba de la cadena ve todos los valores.

### Operador ternario

> 📖 Docs: [Baeldung — Ternary Operator in Java](https://www.baeldung.com/java-ternary-operator) → leer: la sección de sintaxis y la de anidamiento — incluyendo por qué anidar dos ternarios suele ser un error.

Es un atajo de una línea para un `if/else` simple cuando solo necesitas elegir un valor. La misma sintaxis que en JavaScript:

```java
String label = hours > 8 ? "Overtime" : "Normal";
// condición ? valorSiTrue : valorSiFalse
```

Úsalo solo cuando ambos valores sean cortos y la condición sea fácil de leer. Si la línea se vuelve difícil de seguir de un vistazo, usa un `if/else` normal.

> **¿Por qué un ternario y no un `if/else` aquí?** Porque `if` es una **sentencia** (statement) y el ternario es una **expresión** (expression). Una sentencia *hace* algo; una expresión *produce un valor*. Solo una expresión puede colocarse a la derecha de un `=`, y por eso `String label = if (...)` directamente no es Java válido. Esta distinción entre sentencia y expresión es exactamente la misma que separa las dos formas de `switch` de más abajo — merece la pena fijarla ahora en la cabeza, porque vuelve a aparecer en la siguiente sección.

Esta es la misma elección escrita con `if/else`, para que veas lo que te ahorra la expresión:

```java
String label;                 // declarada, todavía sin asignar
if (hours > 8) {
    label = "Overtime";
} else {
    label = "Normal";
}
```

El `if/else` no produce ningún valor, así que la única forma de sacar uno de él es declarar `label` primero, sin nada dentro, y asignarla por separado en cada rama. Eso deja hueco para un error que el ternario no puede cometer. Quita el `else` y el compilador rechaza la siguiente lectura de `label` con `error: variable label might not have been initialized`. Esa es la regla de [01-variables-tipos.md](01-variables-tipos.md) que prohíbe leer una variable local antes de que todos los caminos la hayan asignado. El ternario no tiene ese hueco, porque no tiene mitad opcional: `hours > 8 ? "Overtime"` por sí solo no compila (`error: : expected`). Una expresión siempre produce un valor, así que hay que escribir los dos valores, y `label` queda declarada y asignada en la misma línea.

---

## switch

> 📖 Docs: [Baeldung — Java Switch Statement](https://www.baeldung.com/java-switch) → leer de principio a fin; recorre primero la sentencia clásica y luego la switch expression con `->`.
> 📖 Docs: [Baeldung — Guide to the `yield` Keyword in Java](https://www.baeldung.com/java-yield-switch) → leer para el caso de rama con varias sentencias: `yield` es lo que devuelve un valor desde dentro de un bloque `{ }`.

Usa `switch` cuando tienes muchos posibles valores para **una** variable. Una cadena de `if/else if` repitiendo `day.equals(...)` para cada día de la semana se vuelve difícil de leer — `switch` da a cada valor su propio caso y es más fácil de leer de un vistazo.

### Qué acepta `switch` — el alcance exacto

`switch` es mucho más exigente con su selector (el valor entre paréntesis) de lo que `if` lo es con su condición, y los límites no son intuitivos. En Java 25 puedes hacer switch sobre:

| Tipo del selector | ¿Permitido? | Nota |
|---|---|---|
| `byte`, `short`, `char`, `int` | ✅ | la familia clásica de tipo entero |
| `Byte`, `Short`, `Character`, `Integer` | ✅ | los wrappers objeto de esos cuatro |
| `String` | ✅ | desde Java 7 |
| un `enum` | ✅ | el mejor caso — ver abajo |
| `long`, `float`, `double`, `boolean` | ❌ | el compilador los rechaza |
| cualquier otro objeto (`Employee`, `Object`…) | ✅ *solo* con type patterns (Java 21+) | `case Employee e ->` — no con etiquetas constantes |

Cómo leer esta tabla: la columna "¿Permitido?" habla del valor dentro de `switch (...)`, y las dos últimas filas son las que sorprenden. Hacer switch sobre un `long` primitivo no compila, ni siquiera con un valor tan pequeño como `3`:

```java
long x = 3L;
switch (x) {                      // ❌
    case 3 -> System.out.println("three");
}
// error: primitive patterns are a preview feature and are disabled by default.
// error: constant label of type int is not compatible with switch selector type long
```

En Java 25 el compilador responde con **dos** errores a la vez. La primera línea es la que confunde. Hacer switch sobre `long`, `double` o `boolean` es parte de una funcionalidad del lenguaje que todavía no se ha publicado, así que el compilador asume que ibas buscando esa funcionalidad y te dice que está desactivada. La segunda línea nombra el fallo real: la etiqueta `3` es una constante `int`, y no se puede comparar contra un selector `long`. Si sigues leyendo tras la primera línea, la segunda te cuenta qué pasó de verdad.

Un selector de tipo objeto solo se permite en la forma con patrones (`case String s ->`), nunca con etiquetas constantes. `Long id = 5L; switch (id) { case 5: ... }` falla con `incompatible types: int cannot be converted to Long`.

> **Esa última fila nombra una forma que todavía no vas a escribir.** `case Employee e ->` es un **type pattern** (patrón de tipo): en vez de comparar el selector con una constante, el case pregunta "¿este valor es un `Employee`?" y, si lo es, te lo entrega ya tipado como tal. Es Java real y por eso la fila dice ✅, pero pertenece a una etapa posterior del lenguaje — este capítulo, y cada switch en él, usa solo etiquetas constantes (un número, un `String`, una constante de `enum`). Lee la fila así: *con etiquetas constantes normales, un objeto arbitrario no es un selector legal.* La misma comprobación escrita como un `if` normal, con `instanceof` y una variable de patrón, llega en [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md).

> **¿Por qué está prohibido `boolean` si parece el caso más fácil de todos?** Porque un `boolean` tiene exactamente dos valores, así que un `switch` sobre él nunca podría hacer nada que un `if/else` no diga ya con más claridad. El lenguaje publicado nunca ha aceptado un selector `boolean`. Permitirlo forma parte de la funcionalidad preview nombrada en el primer error de arriba ([JEP 507](https://openjdk.org/jeps/507)), y en Java 25 esa funcionalidad permanece desactivada a menos que la actives tú. La regla general que se sigue de esto: recurre a `switch` a partir de tres o más valores posibles, y a `if/else` por debajo de eso.

> **`enum` es el selector para el que se hizo `switch`.** Un `enum` es un tipo con una lista fija de valores con nombre, y [14-enums.md](14-enums.md) lo enseña. Con un `enum` el compilador conoce el conjunto completo de valores posibles, así que en una **switch expression** (la forma de dos secciones más abajo) comprueba que los manejaste todos — algo que nunca puede hacer con un `String`, cuyo conjunto es infinito. Esa comprobación no se aplica en un `switch` clásico como **sentencia**: déjate una constante sin poner ahí y el código compila igualmente, y ese valor simplemente no ejecuta ningún caso. Cuando más adelante llegues a `14-enums.md`, este es el premio que hay que recordar.

### switch clásico (sentencia)

La forma clásica ejecuta el código del caso que coincide. Debes escribir `break` al final de cada caso — sin él, la ejecución cae al caso siguiente y ejecuta ese código también, **aunque no coincida**. Este comportamiento tiene nombre: **fall-through** (literalmente "caer a través") — el control "cae" de un caso al siguiente sin detenerse.

Merece la pena decir el mecanismo con claridad, porque explica todo lo demás: una etiqueta `case` no es el inicio de un bloque independiente, es solo un **punto de salto** (jump target). Java salta a la etiqueta que coincide y luego sigue ejecutando en línea recta hacia abajo por todo lo que viene después, etiquetas incluidas, hasta que algo lo detiene. `break` es ese algo.

Aquí tienes el bug que produce ese mecanismo:

```java
// ❌ MAL — sin break: un Saturday imprime DOS líneas
switch (day) {
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend shift");
    default:
        System.out.println("Unknown day");
}
// day = "SATURDAY" imprime:
// Weekend shift
// Unknown day
```

Y este es el camino que sigue la ejecución por ese código cuando `day` es `"SATURDAY"`:

```
switch (day) coincide con "SATURDAY"
       │
       ▼
  case "SATURDAY":  ◀── la ejecución aterriza aquí
  case "SUNDAY":        solo una etiqueta, nada que ejecutar → sigue cayendo
      println("Weekend shift");     ← se ejecuta
                          │ sin break → sigue cayendo
                          ▼
  default:
      println("Unknown day");       ← ¡esto también se ejecuta!
```

El arreglo pone un `break` al final de cada grupo de casos:

```java
// ✅ BIEN — break detiene la caída
switch (day) {
    case "MONDAY":
    case "TUESDAY":
    case "WEDNESDAY":
    case "THURSDAY":
    case "FRIDAY":
        System.out.println("Weekday shift");
        break;        // sin esto, la ejecución cae al caso siguiente
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend shift");
        break;
    default:
        System.out.println("Unknown day");
}
```

Fíjate en que el arreglo también usa fall-through *a propósito*: `case "MONDAY":` hasta `case "THURSDAY":` no tienen código entre medias, así que los cinco días laborables caen en el mismo bloque. Ese es el único uso legítimo — apilar etiquetas que comparten comportamiento. El bug es el fall-through que no querías; el patrón es el fall-through sin nada en medio.

El bloque `default` no es obligatorio, pero inclúyelo: es tu red de seguridad para un valor que nadie anticipó (una errata, un día nuevo añadido más tarde), y sin él un valor que no coincide con nada simplemente no hace nada — en silencio.

> **Hacer switch sobre un `String` que es `null` lanza excepción.** `switch (day)` cuando `day` es `null` no cae en `default` — falla con una `NullPointerException` antes incluso de comparar ningún caso. En Java 25 el mensaje es `Cannot invoke "String.hashCode()" because "<local2>" is null`. Dos cosas ahí parecen raras y ambas tienen explicación. `hashCode()` aparece porque un `switch` sobre `String` se compila como una búsqueda por hash. Un **código hash** (hash code) es un `int` que `String.hashCode()` calcula a partir de los caracteres del texto, y dos textos iguales siempre obtienen el mismo. El compilador convierte tus casos en una tabla indexada por esos números: en tiempo de ejecución una comparación de números elige el caso candidato y un único `equals()` lo confirma, lo cual es más rápido de ejecutar que una cadena de llamadas a `equals()`. Llamar a `hashCode()` sobre un selector `null` es lo que lanza la excepción. Y `<localN>` aparece en lugar del nombre de tu variable porque el selector primero se copia en una variable temporal oculta que no tiene nombre en tu código fuente — el número es solo el índice de slot de esa temporal en la JVM, así que espera que cambie de `<local1>` a `<local2>` y siga subiendo según cuántas variables ya haya declarado el método. Dónde debería atajarse un `null` como este en un programa, antes de que llegue siquiera al `switch`, se enseña en [04-metodos.md](04-metodos.md).

### Switch expression (Java 14+) — usa esta forma

El switch clásico es una **sentencia**: ejecuta código y no devuelve nada. El switch **expression** produce un valor, así que puedes asignarlo directamente a una variable — la misma distinción entre sentencia y expresión que encontraste con el ternario más arriba.

También elimina el fall-through: cada rama usa `->` y ejecuta exactamente una cosa, así que no existe `break` ni hace falta.

```java
String shift = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
```

**La exhaustividad se exige, y es un error, no un aviso.** Un switch expression tiene que producir un valor para *cualquier* entrada posible — no existe algo como "ninguna rama coincidió, así que la variable se queda sin asignar". Así que el compilador comprueba que las ramas cubren todo y se niega a compilar si no es así:

```java
// ❌ MAL — sin default, y String tiene infinitos valores posibles
String shift = switch (day) {
    case "MONDAY" -> "Weekday";
};
// error: the switch expression does not cover all possible input values
```

Por eso `default` es efectivamente obligatorio — con una excepción: cuando el selector es un `enum` y tus ramas nombran todas las constantes, el compilador ya sabe que el conjunto está completo y te deja omitir `default` del todo. (Un `switch` clásico como **sentencia** no tiene este problema, porque una sentencia no produce nada, así que "nada coincidió" es un resultado legal.)

**`yield` — cuando una rama necesita más de una línea.** Una rama con flecha normalmente termina en una única expresión, que pasa a ser el valor. Si necesitas varias sentencias, envuélvelas en `{ }` — y entonces hay que decirle a Java qué valor devolver, porque un bloque no tiene una regla de "última expresión". Esa palabra clave es `yield`:

```java
int dailyLimit = switch (day) {
    case "SATURDAY", "SUNDAY" -> 0;
    default -> {
        int base = 8;
        System.out.println("Working day: " + day);
        yield base;                 // este es el valor de la rama
    }
};
```

> **`yield` no es `return`.** `return` sale del *método* entero. `yield` solo sale de la rama del switch y entrega su valor al switch expression, y la ejecución sigue por la siguiente línea del mismo método. Escribir `return base;` dentro de un switch expression directamente no compila (`attempt to return out of a switch expression`) — las dos palabras parecen intercambiables y no lo son.

Usa la forma de switch expression para todo el código nuevo — es más limpia, más segura, y la comprobación de exhaustividad convierte toda una categoría de bugs silenciosos en errores de compilación.

---

## Bucles for

> 📖 Docs: [Baeldung — Java For Loop](https://www.baeldung.com/java-for-loop) → leer primero el `for` clásico de tres partes, luego la forma mejorada (for-each) al final.
> 📖 Docs: [Baeldung — A Guide to Java Loops](https://www.baeldung.com/java-loops) → leer para ver los tres tipos de bucle uno al lado del otro, y cuándo encaja cada uno.

Las dos formas de `for` de abajo recorren un **array** (la mejorada también recorre una `List`), y un array es lo único de esta página que todavía no has visto. Necesitas muy poco de él aquí, así que tómalo ahora en vez de tropezar con `week.length` a mitad de ejemplo.

> **Un array, en un párrafo.** Un array es una fila de tamaño fijo de huecos (slots), todos del mismo tipo, colocados uno junto a otro en memoria. Lo creas o bien listando su contenido — `String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};` — o bien pidiendo un tamaño y rellenándolo después — `String[] week = new String[3];`, cuyos tres huecos empiezan valiendo `null` (un `new int[3]` empezaría con tres ceros en su lugar, porque un `int` no puede ser `null`; esa división entre primitivo y referencia es de [01-variables-tipos.md](01-variables-tipos.md)). Accedes a un hueco por su **índice** entre corchetes, `week[0]`, y el conteo empieza en **cero**, así que una fila de tres tiene los índices 0, 1 y 2 — nunca 3. Preguntas cuántos huecos hay con `week.length`: un **campo** (field), que se escribe sin paréntesis, a diferencia de `String.length()` y `List.size()`, que son métodos. Y "tamaño fijo" es literal — no hay `add()`, no hay `remove()`, y no hay forma de hacer crecer un `String[3]` hasta un `String[4]`. Ese es todo el vocabulario de arrays que usa este capítulo.

> **Por qué se te da solo esto.** La pregunta interesante sobre los arrays no es su sintaxis, es *cuándo una fila fija de huecos sigue siendo la estructura correcta y cuándo una `List` redimensionable la sustituye* — y esa pregunta no se puede responder hasta que tengas las APIs de colecciones con las que compararla. [10-colecciones.md](10-colecciones.md) la responde por completo, y ahí es también donde se enseña como es debido la propia `List` — la `List<Employee>` del código al principio de este archivo. Aquí el array es un andamiaje deliberado: lo más simple y concreto que un bucle puede recorrer, para que el bucle siga siendo el protagonista.

### for clásico

La forma más explícita — controlas tú mismo el inicio, el final y el paso. Tres partes, separadas por puntos y coma: `(inicio; condición; paso)`. Úsalo cuando necesitas el número de índice.

> **¿Qué es el "paso"?** Es cuánto avanza el contador en cada iteración. `i++` es el paso más habitual: incrementa `i` en 1. Pero podrías usar `i += 2` para ir de dos en dos, o `i--` para contar hacia atrás.

```java
String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};

for (int i = 0; i < week.length; i++) {
    System.out.println(i + ": " + week[i]);
}
// 0: MONDAY
// 1: TUESDAY
// 2: WEDNESDAY
```

- `int i = 0` — empieza en el índice 0
- `i < week.length` — continúa mientras esto sea verdadero
- `i++` — incrementa i en 1 tras cada iteración

El orden en que las tres partes se ejecutan de verdad es lo que la gente suele malinterpretar, así que trázalo una vez: `init` se ejecuta **una sola vez**, antes que nada más. Luego, antes de cada iteración, se comprueba `condition`; si es falsa el bucle termina de inmediato y el cuerpo no vuelve a ejecutarse. El cuerpo se ejecuta. *Después* se ejecuta `step` — al **final** de la iteración, no al principio. Y de vuelta a `condition`. Por eso el cuerpo ve `i = 0` en la primera pasada, no `i = 1`.

> **`i` muere con el bucle.** Como `int i` se declara dentro de los paréntesis del `for`, su alcance (scope) es el bucle y nada más — en cuanto el bucle termina, el nombre desaparece. Leerlo después falla en tiempo de compilación con `cannot find symbol / symbol: variable i`. Esto es deliberado: un contador es contabilidad interna del bucle, no información para el resto del método. Si de verdad necesitas el valor final tras el bucle (raro — normalmente significa que querías un `while`), declara la variable *antes* del bucle: `int i = 0; for (; i < week.length; i++) { ... }`. El scope en general se cubre en [01-variables-tipos.md](01-variables-tipos.md) — la misma regla, aplicada a la cabecera del bucle.

**El error off-by-one, y la excepción que produce.** La cabecera de tres partes es potente precisamente porque escribes los límites tú mismo, lo cual significa que también puedes escribirlos mal. El desliz clásico es `<=` donde querías `<`:

```java
int[] weekHours = {8, 8, 6};   // longitud 3, índices válidos 0, 1, 2

// ❌ MAL
for (int i = 0; i <= weekHours.length; i++) {   // i llega a 3
    System.out.println(weekHours[i]);
}
// imprime 8, 8, 6 y luego falla:
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3

// ✅ BIEN
for (int i = 0; i < weekHours.length; i++) {
    System.out.println(weekHours[i]);
}
```

Lee el mensaje al pie de la letra y te lo cuenta todo: `Index 3` es el valor que tenía `i`, `length 3` es el tamaño, y un array de longitud 3 tiene su último hueco en el índice 2. A esto se le llama **error off-by-one** — estar mal por exactamente una posición. Fíjate en *cuándo* falla: no en tiempo de compilación, sino en runtime, y solo después de que tres líneas correctas ya se hayan impreso. Es la mitad ruidosa de la división compile-time/runtime que viste en [00-intro-java.md](00-intro-java.md).

> **¿Por qué empieza a contar en 0?** Un array es un único bloque contiguo de memoria, y el índice no es un número de posición — es un **desplazamiento** (offset) desde la dirección donde empieza el bloque. El primer elemento está en el inicio, así que su offset es cero. En cuanto lees `i` como "a qué distancia del principio", que `length - 1` sea el último índice deja de ser una regla arbitraria.

### Enhanced for (for-each) — úsalo para colecciones y arrays

> 📖 Docs: [Baeldung — The for-each Loop in Java](https://www.baeldung.com/java-for-each-loop) → leer: "Working" y "Pros and Cons" — las desventajas que se listan ahí son los límites que se explican abajo.
> 📖 Docs: [JLS §14.14.2 — The enhanced for statement](https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.14.2) → leer: las dos expansiones, una para un `Iterable` y otra para un array — la fuente del diagrama de reescritura de abajo.

El bucle clásico con índice tiene dos problemas frecuentes: es más largo de escribir, y — como acabas de ver — los límites son tuyos y puedes equivocarte al ponerlos. El `for` mejorado elimina el índice por completo y te entrega cada elemento directamente, así que el error off-by-one se vuelve literalmente imposible de escribir. Piensa en él como la versión Java del `for...of` de JavaScript.

Sintaxis: `for (Tipo variable : colección)` — se lee como "para cada elemento de este tipo en esta colección".

```java
String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};
for (String day : week) {
    System.out.println(day);
}

List<Employee> employees = getEmployees();
for (Employee emp : employees) {
    System.out.println(emp.getName());
}
```

**A qué se compila en realidad — esto explica cada uno de sus límites.** El `for` mejorado es puro azúcar sintáctico (syntax sugar): `javac` lo reescribe en uno de dos bucles más antiguos antes de generar bytecode, y *cuál de los dos* depende de sobre qué estés iterando.

```
for (String day : week)          →   for (int i = 0; i < week.length; i++) {
   (un ARRAY)                            String day = week[i];
                                         ...
                                     }

for (Employee e : employees)     →   Iterator<Employee> it = employees.iterator();
   (cualquier Iterable, p.ej. List)  while (it.hasNext()) {
                                         Employee e = it.next();
                                         ...
                                     }
```

Puedes comprobarlo tú mismo: compila una clase con ambos bucles y ejecuta `javap -c` sobre ella — la versión con array muestra `arraylength` e `iinc` (un contador de índice), la versión con lista muestra `invokeinterface ... Iterator.hasNext` e `Iterator.next`. De esas dos reescrituras se siguen directamente tres consecuencias:

**1. No puedes conseguir el índice.** En la reescritura con lista no hay ningún contador por ninguna parte — el iterador simplemente entrega "el siguiente" sin idea de qué número es. Así que si necesitas la posición, el `for` mejorado no puede dártela y vuelves al `for` clásico. (Los streams ofrecen otra vía, `IntStream.range`. Los streams son el tema de [13-streams-colectores.md](13-streams-colectores.md), un archivo que todavía no está escrito.)

**2. No puedes hacer `remove()` de la colección dentro de él.** El iterador recuerda cuántos cambios estructurales tenía la lista cuando empezó; llamar a `employees.remove(e)` cambia la lista por detrás, los dos números dejan de coincidir, y la siguiente `it.next()` lanza `ConcurrentModificationException`. No es una regla inventada para fastidiarte — es el iterador negándose a seguir recorriendo una lista cuyas posiciones pueden haberse movido bajo sus pies.

En concreto: llamar a `employees.remove(e)` dentro de un `for (Employee e : employees)` compila sin problema y luego muere en la siguiente iteración con `Exception in thread "main" java.util.ConcurrentModificationException` — un mensaje escueto sin ninguna cláusula "because", así que la traza de pila apuntando a `ArrayList$Itr.checkForComodification` es tu única pista. El arreglo de una línea es `employees.removeIf(e -> !e.isActive())`, que ejecuta la misma eliminación a través de un iterador correctamente gestionado. (`e -> !e.isActive()` es una lambda — léela por ahora como "para cada empleado `e`, esta condición"; tratamiento completo en [12-streams-lambdas.md](12-streams-lambdas.md).)

> **Aplazado a propósito — esto es un tema de colecciones, no de bucles.** La razón por la que aparece aquí siquiera es que es una *consecuencia de la reescritura con iterador* que acabas de leer, y si no, no tendrías ni idea de por qué un bucle de aspecto inocente explota. Cómo funciona ese contador de cambios estructurales, y las formas seguras de eliminar mientras iteras, `removeIf` y el `remove` propio del iterador, pertenecen a [10-colecciones.md](10-colecciones.md), donde se cubren por completo — abre ese archivo cuando de verdad te topes con esto. Deliberadamente no se repite aquí, para que exista una única explicación canónica en lugar de dos que puedan desalinearse.

**3. Asignar a la variable del bucle no cambia nada.** Mira la reescritura con array: `String day = week[i]` **copia** el hueco en una variable local nueva en cada pasada. Reasignar esa local solo hace que la copia apunte a otro sitio; el hueco del array queda intacto.

```java
// ❌ MAL — week queda sin cambios después
for (String day : week) {
    day = day.toLowerCase();
}

// ✅ BIEN — escribe de vuelta a través del índice
for (int i = 0; i < week.length; i++) {
    week[i] = week[i].toLowerCase();
}
```

> **Esta es la idea de valor frente a referencia de [01-variables-tipos.md](01-variables-tipos.md), en versión bucle.** Lo que se copia es la *referencia*, no el objeto. Así que reasignar `day` es invisible para el array — pero llamar a un método que muta el objeto al que apunta (`emp.setHours(0)`) **sí** es visible, porque tanto la copia como el hueco del array apuntan al mismo `Employee`. Reasignar = sin efecto; mutar = con efecto.

Usa el for mejorado siempre que solo necesites los elementos y no el índice. En Spring Boot, esto es lo que escribirás la mayor parte del tiempo — aunque los streams (cubiertos en [13-streams-colectores.md](13-streams-colectores.md), todavía no escrito) son incluso más concisos para transformar colecciones.

---

## while y do-while

> 📖 Docs: [Baeldung — Java While Loop](https://www.baeldung.com/java-while-loop) → leer para la sintaxis y el orden "comprueba antes que el cuerpo".
> 📖 Docs: [Baeldung — Java Do-While Loop](https://www.baeldung.com/java-do-while-loop) → leer para el contraste con `while`: primero el cuerpo, luego la condición, siempre al menos una ejecución.

Usa `while` y `do-while` cuando no sabes de antemano cuántas iteraciones necesitas. Un bucle `for` es mejor cuando conoces el rango: la cabecera del `for` mantiene init, condición y paso juntos en una línea precisamente *porque* conoces los tres de antemano. Cuando no los conoces — estás leyendo un fichero hasta que se acaba, reintentando una llamada hasta que tenga éxito, preguntando a una cola por el siguiente elemento hasta que esté vacía — esa cabecera no tiene nada que sujetar, y `while` es la forma honesta.

**`while`** comprueba la condición primero. Si la condición es falsa desde el inicio, el cuerpo nunca se ejecuta — cero veces es un resultado perfectamente normal.

**`do-while`** ejecuta el cuerpo primero, y comprueba la condición después. Esto garantiza al menos una ejecución — útil cuando tienes que hacer algo antes de poder siquiera saber si continuar: no puedes preguntar "¿estaba vacía esa página?" hasta que la has descargado.

```java
// while — comprueba primero, puede no ejecutarse nunca
int i = 0;
while (i < week.length) {
    System.out.println(week[i]);
    i++;                              // ← el paso es responsabilidad TUYA aquí
}

// do-while — se ejecuta al menos una vez, luego comprueba
int page = 0;
List<Employee> batch;                 // declarada FUERA del bucle — ver más abajo
do {
    batch = loadPage(page);           // hay que descargar antes de poder comprobar
    process(batch);
    page++;
} while (!batch.isEmpty());           // ← fíjate en el punto y coma
```

En el `do-while`, `loadPage(page)` devuelve los empleados de una página de resultados y `process(batch)` los procesa. Ninguno de los dos es un método real aquí; léelos como "descargar una página" y "procesarla". El bucle se detiene en la primera página que vuelve vacía. `batch` se declara antes del `do`, no dentro del cuerpo, por la regla de scope de [01-variables-tipos.md](01-variables-tipos.md): una variable declarada dentro de las `{ }` muere en la llave de cierre, y la comprobación `while (...)` está justo después de esa llave. Declara `batch` dentro del cuerpo y la comprobación falla con `cannot find symbol`.

> **El bucle infinito — el verdadero peligro de `while`.** La cabecera de un `for` pone el paso justo al lado de la condición, así que olvidarlo es difícil. En un `while`, el paso es una línea corriente enterrada en algún lugar del cuerpo, y si lo olvidas — o un `continue` prematuro lo salta — la condición nunca cambia y el bucle se ejecuta para siempre. No hay error, ni excepción, ni traza de pila: el programa simplemente deja de responder y la CPU se queda al 100%. El ejemplo de abajo imprime `MONDAY` una y otra vez hasta que lo paras; un bucle sin ninguna salida por pantalla simplemente parece congelado.
> ```java
> // ❌ MAL — i nunca se incrementa; esto no termina nunca
> int i = 0;
> while (i < week.length) {
>     System.out.println(week[i]);
> }
> ```
> El hábito que lo evita: cuando escribas la condición del `while`, escribe de inmediato la línea que en algún momento la hará falsa, *antes* de escribir cualquier otra cosa en el cuerpo.

> **`do-while` termina en punto y coma — y solo `do-while` lo hace.** `} while (!batch.isEmpty());` — quita ese `;` y obtienes `error: ';' expected`. La razón es que este `while` es la *cola* de una sentencia en lugar de la cabecera de un bloque, así que termina como cualquier otra sentencia. Ningún otro bucle en Java necesita un punto y coma de cierre, y por eso este es tan fácil de olvidar.

`do-while` es realmente poco frecuente — recurre a él solo cuando la garantía "ejecutar al menos una vez" es el punto clave (paginación, prompts de menú, reintentar-y-luego-comprobar). En Spring Boot usarás sobre todo bucles for-each y streams; `while` aparece en algoritmos y al consumir algo hasta agotarlo, como leer un fichero línea a línea.

### Elegir entre las cuatro formas de bucle

Ya has visto las cuatro, así que aquí están como una única decisión. La pregunta que elige la forma nunca es "qué bucle me gusta más" — es **qué promete la repetición**, y cada forma hace una promesa distinta:

| Qué es la repetición | Forma | El contrato que hace |
|---|---|---|
| **Contada** — un número conocido de pasadas, y necesitas el número de posición | `for` clásico | escribes tú mismo init, condición y paso, así que el conteo es explícito y tuyo si te equivocas |
| **Recorrido de elementos** — visitar cada elemento, la posición es irrelevante | `for` mejorado | el bucle te entrega cada elemento por turno; no hay índice que escribir, así que no hay off-by-one que cometer |
| **Comprobada antes** — repite mientras algo se cumpla, posiblemente cero veces | `while` | la condición se comprueba *antes* del cuerpo, así que cero ejecuciones es un resultado legal y normal |
| **Comprobada después** — repite mientras algo se cumpla, pero al menos una vez | `do-while` | el cuerpo se ejecuta *antes* de la primera comprobación, así que una ejecución está garantizada |

Cómo leer la tabla: la columna del **medio** es la respuesta, la columna de la **izquierda** es lo que debes poder decir sobre tu propio problema antes de poder elegirla, y la columna de la derecha es la comprobación — si el contrato de esa fila no es lo que tu código realmente promete, elegiste mal. Merece la pena insistir en dos filas. La fila de `while` y la del `for` clásico son ambas "comprobadas antes" en su mecánica (un `for` también comprueba antes de cada pasada, incluida la primera); lo que las separa es *quién es dueño del contador* — la cabecera del `for` mantiene init, condición y paso juntos porque conoces los tres de antemano, y `while` es la forma honesta cuando no los conoces. Y la fila del `for` mejorado es la única en la que es el bucle, no tú, quien proporciona los valores, y por eso es la opción por defecto para arrays y colecciones, y por eso no puede darte un índice.

> **Todo bucle se puede convertir en cualquier otro — eso no es lo importante.** Puedes escribir un bucle contado como un `while`, y un `for` mejorado como un `for` clásico; el compilador literalmente hace lo segundo por ti. Elegir la forma correcta no va de capacidad, va de qué puede asumir el siguiente lector sin leer el cuerpo. Ver `for (Employee emp : employees)` le dice "cada empleado, exactamente una vez, en orden" antes de leer una sola línea de dentro. Ver `while (…)` le dice "esto puede ejecutarse cero veces y la condición de salida está en algún sitio de abajo" — lo cual es información verdadera, y engañosa cuando el bucle en realidad solo estaba contando.

---

## break, continue y return

> 📖 Docs: [Baeldung — The Java `continue` and `break` Keywords](https://www.baeldung.com/java-continue-and-break) → leer primero las formas sin etiqueta, luego las etiquetadas al final.
> 📖 Docs: [Baeldung — Labeled Breaks in Java: Useful Tool or Code Smell?](https://www.baeldung.com/java-labeled-break) → leer para el argumento de legibilidad — cuándo extraer un método en su lugar.

Tres sentencias cortan la ejecución en seco, y se confunden constantemente entre sí porque las tres "detienen" algo — la pregunta útil siempre es *detener qué, exactamente*. Dos de ellas son instrucciones de bucle: `break` y `continue` funcionan en `for`, `while` y `do-while`, los tres tipos de bucle que has visto, y `break` además aparece en un `switch` clásico como sentencia para detener el fall-through (como viste antes). `continue` no hace nada por sí solo dentro de un `switch`: escrito dentro de un `switch` que está dentro de un bucle, continúa ese bucle. La tercera, `return`, no es una instrucción de bucle — pertenece al método — y esa diferencia es de lo que trata la segunda mitad de esta sección.

- **`break`** sale del bucle entero de inmediato — no ocurren más iteraciones después de él.
- **`continue`** salta el resto de la iteración actual y va directamente a la siguiente.
- **`return`** sale del **método** entero. El bucle termina como efecto secundario, y también todo lo que iba a ejecutarse después del bucle.

```java
for (Employee emp : employees) {
    if (!emp.isActive()) continue;          // sáltate este, sigue adelante
    if (emp.getHours() > 40) {
        System.out.println("Overtime: " + emp.getName());
        break;                              // primer infractor encontrado — deja de buscar
    }
}
```

Piensa en `break` como la salida de emergencia y en `continue` como el botón de saltar — y en `return`, que viene a continuación, como abandonar el edificio por completo.

> **`continue` en un `while` es la causa más frecuente de un bucle infinito.** `continue` salta a la *comprobación de la condición*, saltándose todo lo que queda en el cuerpo — incluido tu `i++` si está debajo del `continue`. En un `for` clásico esto es inofensivo, porque el paso vive en la cabecera y se ejecuta igualmente. En un `while` cuelga el programa. Pon el incremento por encima de cualquier `continue`, o usa un `for`.

### `return` — sale del método, no del bucle

`break` y `continue` están acotados por el bucle que los contiene: solo se pueden escribir dentro de uno, y lo máximo que cualquiera de los dos puede terminar es ese bucle. `return` es una sentencia de otra clase. Pertenece al **método**, es legal en casi cualquier parte dentro de uno — en un bucle, en un `if`, en la primerísima línea, en un método sin ningún bucle — y cuando se ejecuta, el método termina. (El único sitio donde *no* es legal es dentro de la rama de un switch expression, y ya sabes por qué: una rama tiene que producir un valor para el switch, no salir del método. Para eso está `yield`.)

La forma de distinguir las tres es preguntarse, de cada una, exactamente *qué deja atrás* y *dónde aterriza la ejecución después*:

| Sentencia | Qué deja atrás | Dónde aterriza la ejecución después | Dónde es legal |
|---|---|---|---|
| `continue` | el resto de la iteración actual | la siguiente comprobación de condición del bucle — en un `for` clásico, después de que se ejecute el paso (`i++`) | solo dentro de un bucle |
| `break` | el bucle entero — el más interno que lo contiene | la primera línea después de ese bucle, en el mismo método | dentro de un bucle, o de un `switch` clásico como sentencia |
| `return` | el **método** entero, bucle incluido | la línea después de la **llamada**, de vuelta en el método que llamó a este | en cualquier parte de un método, excepto dentro de la rama de un switch expression |

Lee la tercera columna como "adónde va el cursor": para `continue` y `break` va a otro sitio dentro del *mismo* método, unas líneas más allá, y el método sigue adelante. Para `return` va a un método *distinto* — el que llamó a este — y este método no vuelve a ejecutarse. Esa es la diferencia de fondo, y merece la pena decirla en una línea: **`break` y `continue` te reposicionan dentro del trabajo actual; `return` termina el trabajo actual y devuelve el control a quien lo pidió.**

Las tres, sobre el mismo parte de horas, en un solo método:

```java
String firstOvertimeName(List<Employee> employees) {
    for (Employee emp : employees) {
        if (!emp.isActive()) {
            continue;                  // este empleado no cuenta; pasa al siguiente
        }
        if (emp.getHours() > 40) {
            return emp.getName();      // lo encontró: sale del bucle Y del método, con un valor
        }
        if (emp.getHours() == 0) {
            break;                     // lista ordenada: nada después de esto puede tener horas extra
        }
    }
    return "none";                     // se alcanza si el bucle termina con normalidad, o tras el break
}
```

Traza las tres salidas. El `continue` devuelve el control a la cabecera del `for`, que produce el siguiente `emp` — el bucle queda intacto y sigue corriendo. El `break` envía el control a la primera línea *después* del bucle, que aquí es `return "none";` — el bucle terminó, el método no. Y `return emp.getName()` no hace ninguna de las dos cosas: el método se detiene en esa línea, `return "none";` no se alcanza en absoluto, y el valor viaja de vuelta a quien escribió `String who = firstOvertimeName(team);`.

> **Por qué un método no sobrevive a su propio `return`.** Cada llamada recibe un espacio de trabajo privado: sus parámetros, sus variables locales, y una nota de la instrucción exacta a la que volver en quien llamó. `break` y `continue` nunca tocan ese espacio de trabajo — solo mueven el puntero de instrucción dentro de él, por eso el método sigue adelante. `return` descarta el espacio de trabajo y salta al punto de retorno anotado. No queda nada con lo que seguir, así que "hacer return y luego seguir en el bucle" no es algo que el lenguaje pudiera ofrecer aunque quisiera. Qué es físicamente ese espacio de trabajo, dónde vive, y por qué se llama pila de llamadas (call stack) es el tema de [05-modelo-de-memoria.md](05-modelo-de-memoria.md); por ahora basta con "el espacio de trabajo privado del método, descartado al hacer return".

> **`return;` sin nada detrás sigue siendo un `return`.** Un método declarado `void` — uno que promete no devolver nada — igualmente puede cortarse a sí mismo con un `return;` a secas. Salir de un método antes de tiempo, a propósito, antes de su trabajo principal, es un patrón con nombre propio, y [04-metodos.md](04-metodos.md) lo enseña. El compilador exige la promesa en ambas direcciones: escribir `return algo;` en un método `void` falla con `error: incompatible types: unexpected return value`, y llegar al final de un método que prometía un valor sin devolver ninguno falla con `error: missing return statement`. *Qué* promete un método — su tipo de retorno, sus parámetros, su signature — es el tema de [04-metodos.md](04-metodos.md), y es el siguiente capítulo precisamente porque acabas de conocer la sentencia que termina uno.

> **Cualquier cosa escrita después de `break`, `continue` o `return` en el mismo bloque no compila.** No es un aviso, ni código muerto que la JVM se salte en silencio: `error: unreachable statement`, y la compilación se detiene. Java se niega a conservar líneas que demostrablemente nunca pueden ejecutarse. Trátalo como un accidente útil más que como una molestia — cuando aparece mientras estás moviendo código de sitio, te está diciendo que la salida ocurre antes de lo que pensabas.

### Break y continue etiquetados — escapar de bucles anidados

Un `break` normal solo sale de **un** bucle: el más interno que lo contiene. Así que la pregunta obvia — "¿cómo salgo de ambos bucles a la vez?" — tiene su propia sintaxis. Pones una **etiqueta** (cualquier nombre, seguido de `:`) justo antes del bucle exterior, y luego dices a cuál te refieres: `break outer;`.

El parte de horas da un caso natural: una rejilla de empleados × días, y quieres detener toda la búsqueda en cuanto encuentres cualquier entrada sin aprobar.

```java
outer:
for (Employee emp : employees) {
    for (String day : week) {
        if (!isApproved(emp, day)) {
            System.out.println("Blocked by " + emp.getName() + " on " + day);
            break outer;          // sale de AMBOS bucles
        }
    }
}
System.out.println("Done");       // la ejecución continúa aquí
```

```
outer:  for (emp : employees)  ◀──────────────┐
            for (day : week)                  │  break outer;
                if (...) ─────────────────────┘  (salta más allá del bucle EXTERIOR)
        println("Done");   ◀── aterriza aquí

        (un break normal aterrizaría en la llave de cierre del bucle INTERIOR,
         y el bucle exterior seguiría con el siguiente empleado)
```

`continue outer;` funciona igual pero salta a la siguiente iteración del bucle exterior en vez de abandonarlo — "este empleado es un caso perdido, pasa al siguiente empleado" en vez de "el siguiente día":

```java
int total = 0;
outer:
for (Employee emp : employees) {
    for (String day : week) {
        if (!isApproved(emp, day)) continue outer;   // siguiente empleado
        total += hoursOf(emp, day);
    }
}
```

> **Una etiqueta no es un `goto`.** Un `goto`, en lenguajes más antiguos como C, es una sentencia que salta a cualquier línea etiquetada del programa, hacia adelante o hacia atrás. Una etiqueta de Java solo nombra un bucle para que `break`/`continue` puedan apuntar a él, y el control solo puede moverse *fuera de* o *hacia adelante en* ese bucle — no puedes saltar hacia atrás ni hacia dentro de un bloque, así que ninguno de los líos que permite un `goto` real es posible aquí. A los entrevistadores les gusta preguntar por esto precisamente porque la gente asume lo peor.

> **`break` frente a hacer return desde un método.** En los servicios de Spring Boot, es más habitual devolver (return) desde un método antes de tiempo que usar `break`. Si estás comprobando una condición dentro de un bucle y quieres detener todo el trabajo, `return` suele quedar más limpio — y es la alternativa estándar a un break etiquetado: extrae los bucles anidados a su propio método y haz `return` desde él, lo cual sale de todos los bucles a la vez sin necesitar ninguna etiqueta. Esta es la búsqueda con `break outer` de arriba, escrita de esa forma:
>
> ```java
> String firstBlocked(List<Employee> employees, String[] week) {
>     for (Employee emp : employees) {
>         for (String day : week) {
>             if (!isApproved(emp, day)) {
>                 return emp.getName() + " on " + day;   // sale de ambos bucles y del método
>             }
>         }
>     }
>     return "none";                                      // todas las entradas estaban aprobadas
> }
> ```

---

## Guardas de null

> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → leer: "What Is NullPointerException?" — solo como avance; el capítulo que lo enseña es [04-metodos.md](04-metodos.md).

**Las guardas de null se enseñan en el siguiente capítulo, [04-metodos.md](04-metodos.md), y no en esta página.** Dos sitios de esta página detendrían el programa con una `NullPointerException` si un valor fuera `null`. El primero es una condición que llama a un método sobre una referencia que contiene `null`: `name.isEmpty()` con `name` valiendo `null`. El segundo es un `switch` cuyo selector es `null`, como mostró el aviso **Hacer switch sobre un `String` que es `null` lanza excepción** en la sección del switch clásico. Qué significa `null`, por qué usarlo falla solo mientras el programa se ejecuta, y dónde debería rechazarse un valor que falta son preguntas sobre el contrato entre un método y quien lo llama. Ese contrato es lo que introduce `04-metodos.md`, así que las respuestas se escriben allí una sola vez.

La única comprobación de este tipo que este capítulo ya ha usado, `if (name != null && !name.isEmpty())` en la sección `if / else`, no necesita nada nuevo que leer. `&&` nunca evalúa su lado derecho cuando su lado izquierdo es `false`, así que `name.isEmpty()` nunca se ejecuta cuando `name` es `null`. Esa es la regla de cortocircuito de [01-variables-tipos.md](01-variables-tipos.md).

---

Hasta ahora todos los bucles y condiciones han vivido dentro de un mismo bloque de código. Pero los programas reales no son un único bloque largo — se dividen en piezas reutilizables y con nombre que puedes invocar por su nombre, cada una tomando entradas y devolviendo un resultado. Esas piezas son los **métodos**, y el `if`, el `for` y el `switch` que acabas de aprender son los ladrillos que van dentro de ellos. Fíjate en cuántas veces este archivo ya ha necesitado uno: `isApproved(emp, day)`, `loadPage(page)`, y el consejo de "extrae los bucles anidados y haz `return`" — todos asumen que puedes nombrar una pieza de lógica y llamarla. Ahí es donde arranca [04-metodos.md](04-metodos.md).
