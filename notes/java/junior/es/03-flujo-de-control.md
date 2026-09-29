## Índice de esta nota

- [Flujo de control](#flujo-de-control)
- [1. if / else](#if--else)
  - [Los valores imposibles van al principio de la cadena](#los-valores-imposibles-van-al-principio-de-la-cadena)
  - [Operador ternario](#operador-ternario)
- [2. switch](#switch)
  - [Qué acepta `switch` — el alcance exacto](#qué-acepta-switch--el-alcance-exacto)
  - [switch clásico (sentencia)](#switch-clásico-sentencia)
  - [Expresión `switch` (Java 14+) — usa esta forma](#expresión-switch-java-14--usa-esta-forma)
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

En [01-variables-tipos.md](01-variables-tipos.md) aprendiste a guardar un valor en una variable y a calcular valores nuevos con expresiones. Una **expresión** es un trozo de código que Java ejecuta para obtener un valor: si `hours` vale `10`, la expresión `hours * 2` da `20`, y la expresión `hours > 8` da `true`. Ese segundo tipo, la expresión que da un `boolean`, es el que usa este capítulo para tomar decisiones. En [02-cadenas-de-texto.md](02-cadenas-de-texto.md) trabajaste con texto: convertiste los datos de un empleado —su nombre, su rol y sus horas trabajadas en una semana— en una línea de texto legible, y recuperaste esos mismos datos a partir de una línea de un CSV. Allí también apareció un bucle `for`, pero solo para explicar por qué unir texto muchas veces seguidas es costoso; cómo funciona el bucle se explica en este capítulo.

Este capítulo sigue con los mismos empleados, pero ahora mira sus horas día a día, en un **parte de horas**: el registro donde cada empleado apunta cuántas horas ha trabajado cada día de la semana. Cada anotación del parte tiene tres datos: quién (un empleado), qué día (por ejemplo, `"SATURDAY"`) y cuántas horas (por ejemplo, `10`). Con ese registro, la empresa sabe quién ha hecho horas extra y quién ha faltado. Imagina que una anotación dice que una empleada trabajó 10 horas un sábado. Guardar `10` y `"SATURDAY"` no basta: el programa debe decidir si imprime `Overtime`, qué turno asigna y cuándo pasa a la siguiente persona. El **flujo de control** determina qué sentencias se ejecutan, en qué orden y cuántas veces.

Seguiremos con ese parte. Primero, `if / else` elige qué instrucciones ejecutar y el ternario elige un **valor**. Después, `switch` elige entre varios días; verás por qué la forma clásica puede continuar en el caso siguiente y cómo la expresión evita ese problema. Los bucles repetirán el trabajo para varios días o empleados. Al final, `break`, `continue` y `return` mostrarán tres formas distintas de salir antes de tiempo. En cada ejemplo, sigue esta pregunta: **¿qué línea se ejecuta después?**

Para seguir los ejemplos, lee `hours` como un `int` —por ejemplo, `10`— y `day` como un `String` —por ejemplo, `"SATURDAY"`. También aparecerán `Employee`, un objeto que representa a un empleado, y `List<Employee>`, una lista ordenada de empleados. `emp.getName()` y `emp.getHours()` consultan su nombre y sus horas; `emp.isActive()` comprueba si sigue activo, y `emp.setHours(0)` cambia sus horas a cero. Aquí solo necesitas entender qué hacen esas llamadas. Aprenderás a escribir métodos en [04-metodos.md](04-metodos.md), a construir la clase `Employee` en [06-poo-clases.md](06-poo-clases.md), a leer `<Employee>` en [09-genericos.md](09-genericos.md) y a distinguir las colecciones en [10-colecciones.md](10-colecciones.md). Algunas listas pueden crecer y otras no; ningún ejemplo de este capítulo exige que `employees` cambie de tamaño.

---

## if / else

> 📖 Docs: [Baeldung — If-Else Statement in Java](https://www.baeldung.com/java-if-else) → leer: "Syntax of If-Else" y "Example of If-Else If-Else" — la condición booleana y la forma en cadena.

Un parte con 10 horas debe indicar horas extra; uno con 4, una jornada normal. Si imprimes las dos etiquetas seguidas, aparecerán ambas. `if / else if` permite elegir: Java comprueba las condiciones de arriba abajo, ejecuta el primer bloque cuya condición sea `true` y omite los demás. Si ninguna es verdadera, ejecuta el bloque `else`, siempre que exista.

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

> **La condición tiene que ser un `boolean`.** [01-variables-tipos.md](01-variables-tipos.md) explicó que Java no usa valores truthy o falsy: `if (hours)` falla con `incompatible types: int cannot be converted to boolean`, mientras que `if (hours > 0)` comprueba un `boolean`. La misma regla se aplica a `while`, `do-while` y a la condición anterior al `?` de un ternario. Cómo comprobar si falta un valor se enseña en [04-metodos.md](04-metodos.md); aquí céntrate en la rama que elige una condición válida.

### Los valores imposibles van al principio de la cadena

Acabas de ver por qué la condición de horas extra debe ir antes que la de cualquier jornada trabajada. La misma regla afecta a los valores que no deberían aceptarse: menos de 0 horas o más de 24 en un día. Pueden llegar por un error al rellenar el formulario o por un bug anterior. Si las ramas normales los aceptan, el parte mostrará un resultado incorrecto.

Prueba la primera cadena `if / else` con esos dos valores. Responde como si fueran válidos:

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

Comprueba los valores inválidos **primero**, antes de que una rama más amplia los acepte:

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

`hours < 0 || hours > 24` es `true` para ambos valores inválidos, así que Java ejecuta la primera rama y no llega a las demás. Una cifra entre 0 y 24 continúa por las tres ramas normales. En una cadena `if / else if`, pon **primero los valores inválidos; después, los casos válidos del más específico al más general; y al final, el `else` para lo que quede.**

> **¿Por qué no añadir la comprobación al `else` del final?** Porque Java nunca llega al final con `30`: la rama `hours > 8` ya se lo ha quedado. Una comprobación solo puede atrapar un valor que llegue hasta ella, y en una cadena un valor se detiene en la primera comprobación que sea `true`. Solo la parte de arriba de la cadena ve todos los valores.

### Operador ternario

> 📖 Docs: [Baeldung — Ternary Operator in Java](https://www.baeldung.com/java-ternary-operator) → leer: la sección de sintaxis y la de anidamiento — incluyendo por qué anidar dos ternarios suele ser un error.

Los ejemplos anteriores imprimen una etiqueta, pero a veces necesitas **guardar** la etiqueta elegida para usarla después. Si eliges entre dos valores breves, una expresión ternaria coloca el valor directamente a la derecha del `=`. Su sintaxis es igual que en JavaScript:

```java
String label = hours > 8 ? "Overtime" : "Normal";
// condición ? valorSiTrue : valorSiFalse
```

Úsalo solo cuando ambos valores sean cortos y la condición sea fácil de leer. Si la línea se vuelve difícil de seguir de un vistazo, usa un `if/else` normal.

> **¿Por qué un ternario y no un `if/else` aquí?** Porque `if` es una **sentencia** (statement) y el ternario es una **expresión** (expression). Una sentencia _hace_ algo; una expresión _produce un valor_. Solo una expresión puede colocarse a la derecha de un `=`, y por eso `String label = if (...)` directamente no es Java válido. Esta distinción entre sentencia y expresión es exactamente la misma que separa las dos formas de `switch` de más abajo — merece la pena fijarla ahora en la cabeza, porque vuelve a aparecer en la siguiente sección.

Esta es la misma elección escrita con `if/else`, para que veas lo que te ahorra la expresión:

```java
String label;                 // declarada, todavía sin asignar
if (hours > 8) {
    label = "Overtime";
} else {
    label = "Normal";
}
```

El `if/else` no produce un valor que puedas asignar directamente. Por eso declaras `label` y la asignas en cada rama. Si quitas el `else`, la siguiente lectura de `label` falla con `error: variable label might not have been initialized`: [01-variables-tipos.md](01-variables-tipos.md) explicó que una variable local debe recibir un valor en todos los caminos posibles antes de leerla. El ternario exige las dos alternativas; `hours > 8 ? "Overtime"` no compila (`error: : expected`). Así, la expresión siempre produce un valor y puedes declarar y asignar `label` en una sola línea.

---

## switch

> 📖 Docs: [Baeldung — Java Switch Statement](https://www.baeldung.com/java-switch) → leer de principio a fin; recorre primero la sentencia clásica y luego la switch expression con `->`.
> 📖 Docs: [Baeldung — Guide to the `yield` Keyword in Java](https://www.baeldung.com/java-yield-switch) → leer para el caso de rama con varias sentencias: `yield` es lo que devuelve un valor desde dentro de un bloque `{ }`.

Usa `switch` cuando comparas **una** variable con varios valores posibles. Repetir `day.equals(...)` en una cadena de `if/else if` para cada día de la semana dificulta la lectura. Con `switch`, cada valor tiene su propio caso.

### Qué acepta `switch` — el alcance exacto

El valor entre paréntesis de `switch` se llama **selector**. A diferencia de una condición de `if`, que solo necesita producir un `boolean`, el selector debe tener uno de los tipos admitidos. En Java 25 son estos:

| Tipo del selector                             | ¿Permitido?                            | Nota                                               |
| --------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| `byte`, `short`, `char`, `int`                | ✅                                     | la familia clásica de tipo entero                  |
| `Byte`, `Short`, `Character`, `Integer`       | ✅                                     | los wrappers objeto de esos cuatro                 |
| `String`                                      | ✅                                     | desde Java 7                                       |
| un `enum`                                     | ✅                                     | el mejor caso — ver abajo                          |
| `long`, `float`, `double`, `boolean`          | ❌                                     | el compilador los rechaza                          |
| cualquier otro objeto (`Employee`, `Object`…) | ✅ _solo_ con type patterns (Java 21+) | `case Employee e ->` — no con etiquetas constantes |

Cómo leer esta tabla: la columna "¿Permitido?" habla del valor dentro de `switch (...)`, y las dos últimas filas son las que sorprenden. Hacer switch sobre un `long` primitivo no compila, ni siquiera con un valor tan pequeño como `3`:

```java
long x = 3L;
switch (x) {                      // ❌
    case 3 -> System.out.println("three");
}
// error: primitive patterns are a preview feature and are disabled by default.
// error: constant label of type int is not compatible with switch selector type long
```

En Java 25 el compilador muestra **dos** errores. El primero menciona los patrones para tipos primitivos, una funcionalidad aún en preview y desactivada por defecto. El segundo señala el problema concreto del ejemplo: `case 3` es una constante `int` y no es compatible con el selector `long`. Lee ambos mensajes antes de corregir el código.

Un selector de tipo objeto solo se permite en la forma con patrones (`case String s ->`), nunca con etiquetas constantes. `Long id = 5L; switch (id) { case 5: ... }` falla con `incompatible types: int cannot be converted to Long`.

> **La última fila adelanta una forma que aún no necesitas escribir.** `case Employee e ->` es un **type pattern** (patrón de tipo): pregunta si el selector es un `Employee` y, si lo es, permite usarlo como tal dentro del caso. Los ejemplos de este capítulo usan etiquetas constantes: un número, un `String` o una constante de `enum`. Con esas etiquetas, un objeto arbitrario no sirve como selector. [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md) enseñará una comprobación parecida con `instanceof` dentro de un `if`.

> **Un selector `boolean` no forma parte del Java 25 habitual.** Un `if/else` ya permite elegir entre sus dos valores. Los tipos primitivos como `boolean` y `long` se están explorando para el pattern matching en [JEP 507](https://openjdk.org/jeps/507), pero esa funcionalidad solo está disponible como preview en Java 25. En este capítulo, usa `if/else` para elegir según un booleano y `switch` cuando un selector permitido tenga varios casos con nombre.

> **Un `enum` permite comprobar que no falta ningún caso en una expresión `switch`.** Un `enum` es un tipo con una lista fija de valores con nombre; [14-enums.md](14-enums.md) lo enseñará. El compilador conoce todos esos valores y comprueba que una **expresión `switch`** los cubra. No puede hacer lo mismo con un `String`, que admite cualquier texto. En un `switch` clásico como **sentencia**, esa comprobación no se exige: puedes omitir una constante, el código compila y ese valor no ejecuta ningún caso.

### switch clásico (sentencia)

La forma clásica empieza a ejecutar en el caso que coincide. Si ese caso tiene instrucciones y no termina con `break`, Java sigue con las instrucciones del siguiente caso, **aunque su etiqueta no coincida**. Ese comportamiento se llama **fall-through**: la ejecución continúa de un caso al siguiente sin una nueva comparación.

Una etiqueta `case` no inicia un bloque independiente: indica **dónde empieza** la ejecución cuando hay una coincidencia. Desde ahí Java sigue con las sentencias siguientes, aunque encuentre otra etiqueta `case`. En estos ejemplos, un `break` detiene ese recorrido; de otro modo, continúa hasta el final del `switch`.

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

El ejemplo corregido conserva un fall-through intencionado: entre `case "MONDAY":` y `case "FRIDAY":` no hay instrucciones. Los cinco días comparten el mismo código y un solo `break` al final. El problema aparece cuando una rama con instrucciones continúa en otra por haber olvidado ese `break`.

El bloque `default` no es obligatorio en esta sentencia, pero permite manejar un valor no previsto, como un día mal escrito. Sin él, un valor que no coincide con ningún caso deja el `switch` sin ejecutar ninguna rama.

> **Un selector `null` no llega a `default`.** Este `switch (day)` no tiene `case null`, así que un día ausente lanza `NullPointerException` antes de ejecutar cualquier caso normal. Es un anticipo de [04-metodos.md](04-metodos.md), que explica dónde debe rechazarse un argumento ausente. No hace falta añadir una guarda de `null` a cada ejemplo de `switch` de este capítulo.

### Expresión `switch` (Java 14+) — usa esta forma

El `switch` clásico es una **sentencia**: ejecuta código y no produce ningún valor. La **expresión `switch`** sí produce un valor, así que puedes asignarlo directamente a una variable. Es la misma distinción entre sentencia y expresión que viste antes con el ternario.

También elimina el fall-through: cada rama usa `->` y ejecuta exactamente una cosa, así que no existe `break` ni hace falta.

```java
String shift = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
```

**Una expresión `switch` debe cubrir todas las entradas posibles.** Cada ejecución tiene que producir un valor para la variable que recibe el resultado. Por eso el compilador rechaza una expresión en la que algún valor del selector no coincidiría con ninguna rama:

```java
// ❌ MAL — sin default, y String tiene infinitos valores posibles
String shift = switch (day) {
    case "MONDAY" -> "Weekday";
};
// error: the switch expression does not cover all possible input values
```

Con un selector `String`, necesitas `default` para cubrir cualquier texto no enumerado. Si el selector es un `enum` y nombras todas sus constantes, puedes omitir `default`: el compilador sabe que no queda ningún valor sin cubrir. Una sentencia `switch` clásica no tiene que producir un valor y puede terminar sin que coincida ningún caso.

> **Exhaustivo no significa que admita `null`.** La comprobación del compilador cubre los valores normales del tipo del selector. Igual que en el `switch` clásico anterior, si `day` es `null` se lanza `NullPointerException`, salvo que escribas `case null`; `default` por sí solo no lo maneja. [04-metodos.md](04-metodos.md) enseñará dónde rechazar un argumento ausente antes de que llegue a esta expresión.

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

> **`yield` no es `return`.** `return` sale del _método_ entero. `yield` solo sale de la rama y entrega su valor a la expresión `switch`; después se ejecuta la siguiente línea del mismo método. Escribir `return base;` dentro de una expresión `switch` no compila (`attempt to return out of a switch expression`): las dos palabras no son intercambiables.

Cuando necesites **producir un valor** a partir de varios casos, prefiere la expresión `switch`: el compilador comprueba que cubra todas las entradas posibles. Cuando solo necesites realizar una acción, una sentencia `switch` también encaja; las dos formas responden a necesidades distintas.

---

## Bucles for

> 📖 Docs: [Baeldung — Java For Loop](https://www.baeldung.com/java-for-loop) → leer primero el `for` clásico de tres partes, luego la forma mejorada (for-each) al final.
> 📖 Docs: [Baeldung — A Guide to Java Loops](https://www.baeldung.com/java-loops) → leer para ver los tres tipos de bucle uno al lado del otro, y cuándo encaja cada uno.

Sin un bucle tendrías que escribir una instrucción de impresión por cada día. `for` repite la misma instrucción para los elementos que quieres recorrer. Las dos formas que verás usan un **array** y la forma mejorada también puede recorrer una `List`. Antes del código, necesitas saber cómo se leen las posiciones y la longitud de un array.

> **Un array, en un párrafo.** Un array es una secuencia de tamaño fijo cuyos elementos tienen el mismo tipo y se localizan mediante índices numéricos. Aquí no necesitas conocer cómo los dispone la JVM en memoria. Puedes crearlo indicando su contenido — `String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};` — o pidiendo un tamaño para rellenarlo después — `String[] week = new String[3];`. Sus tres posiciones empiezan con `null`; las de `new int[3]` empezarían con cero, porque un `int` no puede ser `null` (la diferencia entre primitivos y referencias se explica en [01-variables-tipos.md](01-variables-tipos.md)). Accedes a un elemento por su **índice**, entre corchetes: `week[0]`. El primer índice es **cero**, así que un array de tres elementos tiene índices 0, 1 y 2, nunca 3. `week.length` indica cuántas posiciones tiene; es un **campo**, sin paréntesis, a diferencia de los métodos `String.length()` y `List.size()`. «Tamaño fijo» significa que no tiene `add()` ni `remove()`, ni puedes convertir un `String[3]` en un `String[4]`. Ese es todo el vocabulario de arrays que necesita este capítulo.

> **Por qué basta con esto ahora.** La pregunta interesante es _cuándo conviene usar un array de tamaño fijo y cuándo una `List` que puede cambiar de tamaño_. Para responderla necesitas conocer las APIs de colecciones. [10-colecciones.md](10-colecciones.md) hace la comparación y enseña `List`, incluida la `List<Employee>` mencionada antes. Aquí el array sirve como ejemplo sencillo para recorrer con un bucle; el tema principal sigue siendo el bucle.

### for clásico

Si el informe debe imprimir la **posición** de cada día junto a su nombre, necesitas un número que avance desde el primer elemento hasta el último. El `for` clásico te da ese contador. Su cabecera tiene tres partes separadas por puntos y coma, `(inicio; condición; paso)`, y tú controlas dónde empieza, dónde se detiene y cómo avanza.

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

Traza el orden de la cabecera: `int i = 0` se ejecuta **una sola vez**. Antes de cada pasada, Java comprueba `i < week.length`; si es falso, el bucle termina. Si es verdadero, ejecuta el cuerpo y _después_ `i++`. Luego vuelve a comprobar la condición. Por eso el cuerpo ve `i = 0` en la primera pasada, no `i = 1`.

> **`i` solo existe dentro del bucle.** Como `int i` se declara en la cabecera del `for`, su alcance (scope) termina al cerrar el bucle. Intentar leerla después falla al compilar con `cannot find symbol / symbol: variable i`. Si necesitas conservar el valor final, declara `i` antes: `int i = 0; for (; i < week.length; i++) { ... }`. [01-variables-tipos.md](01-variables-tipos.md) explica la misma regla de alcance para otras variables locales.

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

El mensaje da los datos necesarios: `Index 3` es el valor de `i`, `length 3` es la longitud del array y la última posición válida tiene índice 2. Este es un **error off-by-one**: el límite se ha pasado por una posición. Ocurre en runtime, después de que el programa haya impreso tres líneas correctas; [00-intro-java.md](00-intro-java.md) distinguió estos fallos de los que detecta el compilador.

> **¿Por qué se empieza a contar en cero?** En el modelo de arrays de Java, el índice numera las posiciones desde cero: la primera es `week[0]` y cada posición siguiente aumenta el índice en uno. Si el array tiene `length` posiciones, la última es `length - 1`. Puedes leer `i` como «cuántas posiciones hay desde la primera» sin suponer ninguna dirección o disposición concreta de memoria.

### Enhanced for (for-each) — úsalo para colecciones y arrays

> 📖 Docs: [Baeldung — The for-each Loop in Java](https://www.baeldung.com/java-for-each-loop) → leer: "Working" y "Pros and Cons" — las desventajas que se listan ahí son los límites que se explican abajo.
> 📖 Docs: [JLS §14.14.2 — The enhanced for statement](https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.14.2) → leer: las dos expansiones, una para un `Iterable` y otra para un array — la fuente del diagrama de reescritura de abajo.

El `for` clásico obliga a escribir y controlar un índice. Si solo quieres visitar cada elemento, ese índice sobra y puede causar el error off-by-one que acabas de ver. El `for` mejorado entrega los elementos directamente, sin un límite numérico que tengas que calcular. Equivale al `for...of` de JavaScript para este recorrido.

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

`getEmployees()` representa un método que proporciona la lista de empleados; [04-metodos.md](04-metodos.md) explicará cómo una llamada proporciona un valor. El primer bucle imprime los tres días en el orden del array. El segundo imprime un nombre por empleado, en el orden de la lista.

**La traducción que hace el compilador explica sus límites.** El `for` mejorado es una abreviatura: `javac` lo convierte en un bucle con índice si recorre un array. Si recorre un `Iterable` —un objeto que proporciona un iterador, como una `List`— usa un **iterador**, que entrega el siguiente elemento cada vez que se lo pides. Después genera el bytecode que ejecutará la JVM.

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

De estas dos traducciones se desprenden tres consecuencias:

**1. La variable del bucle no te da el índice.** La traducción del array lleva un contador oculto, pero el `for` mejorado no lo pone a disposición del cuerpo. La traducción con iterador entrega el elemento siguiente sin índice alguno. Si necesitas la posición, usa un `for` clásico sobre un array o sobre una `List` que permita el acceso por índice. [10-colecciones.md](10-colecciones.md) explica qué colecciones tienen posiciones; ese capítulo aún está pendiente.

**2. Este bucle sirve para visitar elementos, no para cambiar la estructura de la colección.** La versión con `List` pide el elemento siguiente al iterador en cada pasada. Si eliminas directamente un empleado de ciertas listas mientras se usa ese iterador, una pasada posterior puede fallar. El fallo concreto y las formas seguras de eliminar elementos se explican en [10-colecciones.md](10-colecciones.md), que aún está pendiente. Por ahora, elige este bucle cuando solo necesites visitar a los empleados.

**3. Reasignar la variable del bucle no cambia el array.** En la reescritura, `String day = week[i]` copia la referencia del elemento a una variable local nueva en cada pasada. Si reasignas `day`, solo cambia esa variable; `week[i]` conserva su referencia anterior.

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

> **El bucle copia la referencia, no el objeto.** Es la misma regla de valores y referencias de [01-variables-tipos.md](01-variables-tipos.md). Reasignar `day` no modifica el array. En cambio, `emp.setHours(0)` sí modifica el objeto `Employee`: la variable local y el elemento de la lista siguen apuntando al mismo objeto. Distingue entre cambiar una referencia local y modificar el objeto compartido.

Usa el `for` mejorado cuando necesites los elementos pero no su posición. También lo encontrarás en código Spring Boot. Para transformar colecciones verás los streams en [13-streams-colectores.md](13-streams-colectores.md), un capítulo todavía pendiente.

---

## while y do-while

> 📖 Docs: [Baeldung — Java While Loop](https://www.baeldung.com/java-while-loop) → leer para la sintaxis y el orden "comprueba antes que el cuerpo".
> 📖 Docs: [Baeldung — Java Do-While Loop](https://www.baeldung.com/java-do-while-loop) → leer para el contraste con `while`: primero el cuerpo, luego la condición, siempre al menos una ejecución.

Usa `while` o `do-while` cuando la condición de salida depende de lo que ocurra en cada pasada y no sabes cuántas harán falta. Puede ser una lectura hasta el final de un fichero, una llamada que se reintenta o una cola que se vacía. En esos casos, un `for` con contador no expresa bien cuándo debe terminar el trabajo.

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
    if (!batch.isEmpty()) {
        process(batch);               // procesa solo páginas con empleados
    }
    page++;
} while (!batch.isEmpty());           // ← fíjate en el punto y coma
```

En el `do-while`, `loadPage(page)` representa la descarga de una página de empleados y `process(batch)` representa su procesamiento; son métodos de ejemplo, no llamadas definidas en este capítulo. En la primera pasada se descarga la página 0, se procesa solo si contiene empleados, se incrementa `page` a 1 y después se comprueba si la página descargada estaba vacía. Cuando llega una página vacía, no se procesa ningún empleado y el bucle termina tras esa pasada. `batch` se declara antes del `do`, no dentro del cuerpo, por la regla de alcance de [01-variables-tipos.md](01-variables-tipos.md): una variable declarada dentro de `{ }` deja de estar disponible al cerrar la llave, y la condición `while (...)` está después. Si declaras `batch` dentro del cuerpo, la condición falla con `cannot find symbol`.

> **Un `while` sin avance puede ejecutarse sin fin.** En un `for` clásico, el incremento está en la cabecera; en un `while`, debes escribirlo dentro del cuerpo. Si lo olvidas o un `continue` lo salta, `i` no cambia y la condición sigue siendo verdadera. El ejemplo imprime `MONDAY` una y otra vez hasta que detengas el programa. No aparece un error de compilación ni una excepción.
>
> ```java
> // ❌ MAL — i nunca se incrementa; esto no termina nunca
> int i = 0;
> while (i < week.length) {
>     System.out.println(week[i]);
> }
> ```
>
> El hábito que lo evita: cuando escribas la condición del `while`, escribe de inmediato la línea que en algún momento la hará falsa, _antes_ de escribir cualquier otra cosa en el cuerpo.

> **`do-while` necesita un punto y coma final.** En `} while (!batch.isEmpty());`, el `while (...)` cierra la sentencia que empezó con `do`; por eso lleva `;`. Si lo omites, el compilador muestra `error: ';' expected`. Los otros bucles no llevan ese punto y coma después de la llave de cierre.

Elige `do-while` cuando el cuerpo deba ejecutarse al menos una vez, por ejemplo para descargar la primera página antes de comprobar si quedan resultados. Para leer un fichero hasta agotarlo, `while` suele expresar mejor la condición de salida.

### Elegir entre las cuatro formas de bucle

Ya has visto las cuatro formas. Elige según **qué controla la repetición**: un contador, los elementos que recorres o una condición que se comprueba antes o después.

| Qué es la repetición                                                           | Forma          | El contrato que hace                                                                                           |
| ------------------------------------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------- |
| **Contada** — un número conocido de pasadas, y necesitas el número de posición | `for` clásico  | escribes tú mismo init, condición y paso, así que el conteo es explícito y tuyo si te equivocas                |
| **Recorrido de elementos** — visitar cada elemento, la posición es irrelevante | `for` mejorado | el bucle te entrega cada elemento por turno; no hay índice que escribir, así que no hay off-by-one que cometer |
| **Comprobada antes** — repite mientras algo se cumpla, posiblemente cero veces | `while`        | la condición se comprueba _antes_ del cuerpo, así que cero ejecuciones es un resultado legal y normal          |
| **Comprobada después** — repite mientras algo se cumpla, pero al menos una vez | `do-while`     | el cuerpo se ejecuta _antes_ de la primera comprobación, así que una ejecución está garantizada                |

Lee primero la columna izquierda: describe la necesidad. La central indica el bucle que encaja y la derecha explica qué garantiza. Tanto el `while` como el `for` clásico comprueban la condición antes de cada pasada, incluida la primera. Elige el `for` cuando conoces y controlas un contador; usa `while` cuando esperas a que cambie una condición durante el trabajo. En el `for` mejorado, el bucle te entrega los elementos y no te da un índice.

> **La forma del bucle comunica cómo vas a repetir el trabajo.** Puedes escribir un recorrido con índice como `while` o como `for`, pero quien lea el código entenderá antes tu intención si eliges la forma adecuada. `for (Employee emp : employees)` anuncia que recorrerás los elementos de la lista sin usar su posición; el cuerpo aún podría salir antes con `break` o `return`. `while (…)` anuncia que comprobarás una condición antes de cada pasada y que quizá no se ejecute ninguna.

---

## break, continue y return

> 📖 Docs: [Baeldung — The Java `continue` and `break` Keywords](https://www.baeldung.com/java-continue-and-break) → leer primero las formas sin etiqueta, luego las etiquetadas al final.
> 📖 Docs: [Baeldung — Labeled Breaks in Java: Useful Tool or Code Smell?](https://www.baeldung.com/java-labeled-break) → leer para el argumento de legibilidad — cuándo extraer un método en su lugar.

`break`, `continue` y `return` interrumpen el recorrido normal del código, pero cada uno lleva la ejecución a un lugar distinto. `break` y `continue` funcionan en las cuatro formas de bucle que has visto. `break` también termina una sentencia `switch` clásica. Si escribes `continue` dentro de un `switch` que está en un bucle, continúas ese bucle. `return` termina el método completo.

- **`break`** sale del bucle más interno o del `switch` clásico que lo contiene. Si sale de un bucle, ese bucle no tiene más iteraciones.
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

En el ejemplo, `continue` omite al empleado inactivo y sigue con el siguiente. `break` termina la búsqueda en cuanto encuentra el primer caso de horas extra. `return`, que verás ahora, terminaría además el método que contiene el bucle.

> **`continue` puede impedir que un `while` avance.** Salta a la comprobación de la condición y omite el resto del cuerpo, incluido `i++` si está después. Si la condición depende de `i`, puede repetirse sin fin. En un `for` clásico, el paso de la cabecera sí se ejecuta antes de la siguiente comprobación. En un `while`, coloca el incremento antes de cualquier `continue` que pudiera saltárselo.

### `return` — sale del método, no del bucle

`continue` solo afecta a su bucle. `break` termina su bucle o la sentencia `switch` que lo contiene. Ninguno termina el método. `return` sí lo termina, tanto si está dentro de un bucle como si aparece en un `if` o al principio del método. Una rama de una expresión `switch` debe entregar su valor con `yield` cuando usa un bloque; no puede usar `return` para salir del método.

Para distinguirlas, comprueba qué parte del código abandonan y cuál es la siguiente instrucción que se ejecuta:

| Sentencia  | Qué deja atrás                                             | Dónde aterriza la ejecución después                                                                               | Dónde es legal                                                                     |
| ---------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `continue` | el resto de la iteración actual                            | la siguiente comprobación de condición del bucle — en un `for` clásico, después de que se ejecute el paso (`i++`) | solo dentro de un bucle                                                            |
| `break`    | el bucle más interno o el `switch` clásico que lo contiene | la primera línea después de ese bucle o `switch`, en el mismo método                                              | dentro de un bucle, o de un `switch` clásico como sentencia                        |
| `return`   | el **método** entero, bucle incluido                       | la línea después de la **llamada**, de vuelta en el método que llamó a este                                       | en cualquier parte de un método, excepto dentro de la rama de un switch expression |

La tercera columna indica la siguiente instrucción que se ejecuta. Tras `continue` o `break`, el método actual sigue desde otro punto. Tras `return`, termina y la ejecución vuelve al método que lo llamó. **`break` y `continue` cambian el recorrido dentro del método actual; `return` sale de él.**

Las tres aparecen en el mismo parte de horas y en un solo método. La lista llega ordenada por horas semanales, de mayor a menor: cuando aparece un empleado con `0` horas, todos los siguientes también tienen `0`.

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

Traza las tres salidas. El `continue` devuelve el control a la cabecera del `for`, que produce el siguiente `emp` — el bucle queda intacto y sigue corriendo. El `break` envía el control a la primera línea _después_ del bucle, que aquí es `return "none";` — el bucle terminó, el método no. Y `return emp.getName()` no hace ninguna de las dos cosas: el método se detiene en esa línea, `return "none";` no se alcanza en absoluto, y el valor viaja de vuelta a quien escribió `String who = firstOvertimeName(team);`.

> **`return` termina la llamada actual.** Cada llamada tiene sus parámetros, sus variables locales y la posición a la que debe volver en el método que la hizo. `break` y `continue` cambian la siguiente instrucción dentro de esa misma llamada. `return` termina la llamada y devuelve la ejecución al punto guardado. Por eso no puede continuar después dentro de su bucle. [05-modelo-de-memoria.md](05-modelo-de-memoria.md) explicará cómo se organiza ese estado en la pila de llamadas (call stack).

> **`return;` sin nada detrás sigue siendo un `return`.** Un método declarado `void` — uno que promete no devolver nada — igualmente puede cortarse a sí mismo con un `return;` a secas. Salir de un método antes de tiempo, a propósito, antes de su trabajo principal, es un patrón con nombre propio, y [04-metodos.md](04-metodos.md) lo enseña. El compilador exige la promesa en ambas direcciones: escribir `return algo;` en un método `void` falla con `error: incompatible types: unexpected return value`, y llegar al final de un método que prometía un valor sin devolver ninguno falla con `error: missing return statement`. _Qué_ promete un método — su tipo de retorno, sus parámetros, su signature — es el tema de [04-metodos.md](04-metodos.md), y es el siguiente capítulo precisamente porque acabas de conocer la sentencia que termina uno.

> **Cualquier cosa escrita después de `break`, `continue` o `return` en el mismo bloque no compila.** No es un aviso, ni código muerto que la JVM se salte en silencio: `error: unreachable statement`, y la compilación se detiene. Java se niega a conservar líneas que demostrablemente nunca pueden ejecutarse. Trátalo como un accidente útil más que como una molestia — cuando aparece mientras estás moviendo código de sitio, te está diciendo que la salida ocurre antes de lo que pensabas.

### Break y continue etiquetados — escapar de bucles anidados

Un `break` sin etiqueta sale del bucle más interno. Para salir de dos bucles anidados, escribe una **etiqueta** —un nombre seguido de `:`— antes del bucle exterior y úsala en `break outer;`.

El parte de horas da un caso natural: una rejilla de empleados × días, y quieres detener toda la búsqueda en cuanto encuentres cualquier entrada sin aprobar. `isApproved(emp, day)` es una llamada de ejemplo que devuelve `true` cuando la entrada de ese empleado para ese día está aprobada.

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

`continue outer;` no abandona el bucle exterior: pasa a su siguiente iteración. En este ejemplo, salta al siguiente empleado en cuanto encuentra un día sin aprobar, en vez de seguir revisando los días de ese empleado:

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

> **Una etiqueta no es un `goto`.** En lenguajes antiguos como C, `goto` permite saltar a una línea etiquetada en cualquier dirección. En Java, una etiqueta puede nombrar una sentencia: `break label;` sale de la sentencia etiquetada, mientras que `continue label;` exige que la etiqueta nombre un bucle y empieza su siguiente iteración. Ninguno permite saltar hacia atrás ni entrar en un bloque, así que no son saltos arbitrarios como `goto`. Los entrevistadores preguntan por ello precisamente porque suele suponerse lo contrario.

> **Un método pequeño puede evitar un `break` etiquetado.** Si la búsqueda debe terminar al encontrar un resultado, puedes poner los bucles en un método y devolver ese resultado con `return`. Así sales de ambos bucles y del método a la vez. La búsqueda anterior también se puede escribir así:
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

> **Referencia futura — la entrada 04 enseña las guardas de `null`.** Este capítulo sigue qué sentencias se ejecutan cuando una condición recibe un valor utilizable. [04-metodos.md](04-metodos.md) explica dónde debe rechazar un método un argumento ausente para que sus `if`, bucles y `switch` puedan usarlo con seguridad. Aquí recuerda solo que el `switch (day)` clásico anterior lanza una excepción si `day` es `null` y no hay un `case null` que lo maneje.

---

Ya puedes seguir la ejecución de un parte de horas: las condiciones eligen ramas, los bucles repiten instrucciones y las salidas anticipadas cambian el punto en que continúa el programa. Has leído llamadas como `loadPage(page)`, `isApproved(emp, day)` y `firstOvertimeName(...)` sin tener que escribirlas. En [04-metodos.md](04-metodos.md) aprenderás a definir y llamar esos **métodos**, con los valores que reciben y devuelven.
