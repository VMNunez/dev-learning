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
  - [`break` y `continue` con etiqueta: salir de un bucle que está dentro de otro](#break-y-continue-con-etiqueta-salir-de-un-bucle-que-está-dentro-de-otro)
- [6. Guardas de null](#guardas-de-null)

# Flujo de control

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → leer: "If/Else/Else If", "Switch" y "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

En [01-variables-tipos.md](01-variables-tipos.md) aprendiste a guardar un valor en una variable y a calcular valores nuevos con expresiones. Una **expresión** es un trozo de código que Java ejecuta para obtener un valor: si `hours` vale `10`, la expresión `hours * 2` da `20`, y la expresión `hours > 8` da `true`. Ese segundo tipo, la expresión que da un `boolean`, es el que usa este capítulo para tomar decisiones. En [02-cadenas-de-texto.md](02-cadenas-de-texto.md) trabajaste con texto: convertiste los datos de un empleado —su nombre, su rol y sus horas trabajadas en una semana— en una línea de texto legible, y recuperaste esos mismos datos a partir de una línea de un CSV: partiste de un texto y lo transformaste en datos con los que poder trabajar, como las horas convertidas en un número con el que hacer cálculos. Allí apareció un bucle `for`, en la sección de `StringBuilder`, pero solo para explicar por qué unir texto con `+` muchas veces seguidas es costoso; cómo funciona el bucle se explica en este capítulo.

Este capítulo sigue con el mismo ejemplo de los empleados para explicar las condiciones y los bucles. La diferencia está en cómo se cuentan las horas. En [02-cadenas-de-texto.md](02-cadenas-de-texto.md) cada empleado tenía un solo número: las horas totales trabajadas en una semana. Aquí las horas se separan por días, en un **registro de horas** (en inglés, _timesheet_): la lista donde cada empleado apunta cuántas horas ha trabajado cada día de la semana. Cada anotación del registro tiene tres datos: quién ha trabajado (un empleado), qué día ha trabajado (por ejemplo, `"SATURDAY"`) y cuántas horas (por ejemplo, `10`). Con ese registro, la empresa sabe quién ha hecho horas extra y quién ha faltado. Imagina que una anotación dice que una empleada trabajó 10 horas un sábado. Guardar `10` y `"SATURDAY"` no basta: el programa tiene que decidir tres cosas. Primero, si imprime `Overtime` («horas extra»), porque 10 horas superan una jornada normal de 8. Después, si ese día es laborable o de fin de semana, como este sábado. Por último, cuándo termina con esta anotación y pasa a revisar la del siguiente empleado. El **flujo de control** determina qué sentencias se ejecutan, en qué orden y cuántas veces.

Primero verás `if / else`, que ejecuta un bloque de código u otro según se cumpla o no una condición: por ejemplo, imprime `Overtime` solo cuando `hours > 8` es `true`. Junto a él verás el operador ternario, una versión corta de `if / else` pensada para elegir un **valor**, no un bloque de código: comprueba la condición y devuelve el valor que va antes de los dos puntos si se cumple, o el que va después si no se cumple. Así, `String label = hours > 8 ? "Overtime" : "Normal";` guarda `"Overtime"` en `label` cuando `hours > 8` es `true`, y `"Normal"` cuando es `false`. Después verás `switch`, que compara el valor de una variable con una lista de valores posibles y ejecuta el código del caso que coincide: por ejemplo, según el valor de `day`, clasifica el día como laborable o de fin de semana. Se puede escribir de dos formas. En la forma clásica, si olvidas escribir `break` al final de un caso, Java no se detiene ahí: sigue ejecutando el código de todos los casos que vienen detrás, hasta encontrar un `break` o llegar al final del `switch`. Esa ejecución de más lleva a errores: por ejemplo, con un sábado el `switch` imprime `Weekend shift` («turno de fin de semana»), que es lo correcto, y como falta el `break`, sigue hasta el caso siguiente e imprime también `Unknown day` («día desconocido»), que es falso. La segunda forma de escribir un `switch` es la forma moderna, la expresión `switch`. En ella, Java ejecuta únicamente el caso que coincide, sin pasar nunca a los siguientes, y el resultado de ese caso se guarda directamente en una variable: con `String shift = switch (day) { … };`, si `day` vale `"SATURDAY"`, `shift` pasa a valer `"Weekend"`. Hasta aquí, cada decisión se toma sobre una sola anotación del registro de horas. Pero el registro tiene muchas anotaciones: una por empleado y día. Para no escribir el mismo `if` una vez por cada anotación, verás los **bucles**, que repiten un bloque de código tantas veces como haga falta: por ejemplo, una vez por cada empleado de la lista. Java tiene cuatro tipos de bucles —el `for` clásico, el _for-each_, `while` y `do-while`— y cada uno decide de una manera distinta cuándo salir del bucle: el `for` clásico sale cuando su condición deja de cumplirse, normalmente cuando un contador llega a un límite; el _for-each_, cuando ya no quedan elementos en la lista; `while` comprueba su condición antes de cada repetición y sale cuando es `false`; y `do-while` hace lo mismo, pero la comprueba después, así que siempre se ejecuta al menos una vez. A veces no hace falta esperar a que el bucle termine por su regla normal: por ejemplo, si buscas el primer empleado con horas extra, en cuanto lo encuentras ya no tiene sentido revisar a los demás. Para esos casos, al final del capítulo verás `break`, `continue` y `return`, tres instrucciones que interrumpen el bucle antes de tiempo, cada una de una forma distinta: `continue` se salta lo que queda de la repetición actual y pasa a la siguiente, `break` sale del bucle y `return` sale del método entero.

Para seguir los ejemplos, lee `hours` como un `int` —por ejemplo, `10`— y `day` como un `String` —por ejemplo, `"SATURDAY"`. También aparecerán `Employee` y `List<Employee>`. `Employee` es un objeto que representa a un empleado y guarda tres datos, que se llaman sus **campos**: `name` (su nombre), `hours` (las horas totales que ha trabajado en la semana) y `active` (si sigue activo en la empresa: `true` o `false`). `List<Employee>` es una lista ordenada de empleados. `emp.getName()` y `emp.getHours()` consultan su nombre y sus horas; `emp.isActive()` comprueba si sigue activo, y `emp.setHours(0)` cambia sus horas a cero. Aquí solo necesitas entender qué hacen esas llamadas. Aprenderás a escribir métodos en [04-metodos.md](04-metodos.md), a construir la clase `Employee` en [06-poo-clases.md](06-poo-clases.md), a leer `<Employee>` en [09-genericos.md](09-genericos.md) y a distinguir las colecciones en [10-colecciones.md](10-colecciones.md).

---

## if / else

> 📖 Docs: [Baeldung — If-Else Statement in Java](https://www.baeldung.com/java-if-else) → leer: "Syntax of If-Else" y "Example of If-Else If-Else" — la condición booleana y la forma en cadena.

Cada anotación del registro necesita una etiqueta según sus horas: si son más de 8, el programa debe imprimir `Overtime` (horas extra); si están entre 1 y 8, `Worked` (una jornada normal); y si son 0, `Absent` (ausente).

Lo que necesitas es que el programa sepa qué etiqueta mostrar según el valor de `hours`. Eso es lo que hace `if / else if`: Java comprueba las condiciones de arriba abajo, ejecuta el primer bloque cuya condición sea `true` y omite los demás. Si ninguna es verdadera, ejecuta el bloque `else`, siempre que exista.

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

> **La condición tiene que ser un `boolean`.** [01-variables-tipos.md](01-variables-tipos.md) explicó que Java no usa valores truthy o falsy: `if (hours)` falla con `incompatible types: int cannot be converted to boolean`, mientras que `if (hours > 0)` comprueba un `boolean`. La misma regla se aplica a `while`, `do-while` y a los ternarios: la condición que va antes del `?` también tiene que ser un `boolean`. Esto también afecta a una costumbre de JavaScript: comprobar si una variable no tiene valor escribiendo solo su nombre dentro del `if`. En JavaScript, `if (name) { … }` entra en el bloque solo cuando `name` tiene un valor, y se lo salta cuando `name` es `null`, `undefined` o un texto vacío. En Java, una variable de un tipo de objeto, como `String`, vale `null` cuando no guarda la dirección de ningún objeto, como explicó [01-variables-tipos.md](01-variables-tipos.md) en _Variables de referencia y `null`_. Pero `null` no es un `boolean`, así que tienes que escribir tú la comparación:
>
> ```java
> if (name) { ... }          // ❌ MAL — no compila: incompatible types: String cannot be converted to boolean
> if (name != null) { ... }  // ✅ BIEN — name != null da true o false
> ```
>
> Cuándo hace falta esta comprobación lo verás en [04-metodos.md](04-metodos.md).

### Los valores imposibles van al principio de la cadena

Acabas de ver por qué la condición de horas extra debe ir antes que la de cualquier jornada trabajada. La misma regla afecta a los valores que no deberían aceptarse: menos de 0 horas o más de 24 en un día. Pueden llegar por un error al rellenar el formulario o por un bug anterior. Si las ramas normales los aceptan, el registro mostrará un resultado incorrecto.

Esta es la misma cadena `if / else` del principio de la sección, sin cambios, probada con uno de esos valores imposibles: `hours` vale `-3`. Va a mostrar `Absent`, porque `-3` no es mayor que 8 ni mayor que 0: ninguna de las dos primeras condiciones se cumple, así que Java ejecuta el `else`:

```java
// ❌ MAL — las ramas amplias se tragan los valores imposibles
int hours = -3;   // imposible: menos de 0 horas

if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
// hours = -3  imprime: Absent
```

Si `hours`, en vez de valer `-3`, pasa a valer `30`, la primera comprobación es `30 > 8`. Es `true`, así que Java ejecuta el primer bloque, imprime `Overtime` y se salta todas las ramas de abajo. Ni el ejemplo del `-3` ni el del `30` dan un error: el programa sigue adelante y trata un error como si fuera una ausencia real (`-3`) o un día real de horas extra (`30`). Ese es el bug oculto. La condición `hours > 8` se escribió pensando en días con horas extra, pero se cumple con cualquier número mayor que 8: también con `30`, `100` o `1000`. El `else` se escribió para los días de ausencia, con 0 horas, pero recoge todo lo que no ha entrado en las ramas anteriores: también `-3` o `-100`. Ninguna de las dos ramas comprueba que las horas sean un valor válido, es decir, un número entre 0 y 24, porque un día real no puede tener menos de 0 horas ni más de 24.

La solución a este problema es comprobar los valores inválidos **primero**, en su propia rama al principio de la cadena, antes de que una rama más amplia los acepte:

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

`hours < 0 || hours > 24` es `true` para los dos valores inválidos: tanto si `hours` es menor que 0 como si es mayor que 24. Así que Java ejecuta la primera rama y no llega a las demás. Una cifra entre 0 y 24 continúa por las tres ramas normales. En una cadena `if / else if`, pon **primero los valores inválidos; después, los casos válidos del más específico al más general; y al final, el `else` para lo que quede.**

### Operador ternario

> 📖 Docs: [Baeldung — Ternary Operator in Java](https://www.baeldung.com/java-ternary-operator) → leer: la sección de sintaxis y la de anidamiento — incluyendo por qué anidar dos ternarios suele ser un error.

Los ejemplos anteriores imprimen una etiqueta. El operador ternario se usa en otro caso: cuando tienes que elegir entre dos valores y quieres **guardar** el elegido en una variable para usarlo después. Por ejemplo, guardar en `label` la etiqueta `"Overtime"` o la etiqueta `"Normal"`, según las horas. El ternario hace la elección y deja el valor elegido directamente a la derecha del `=`. Su sintaxis es igual que en JavaScript:

```java
String label = hours > 8 ? "Overtime" : "Normal";
// condición ? valorSiTrue : valorSiFalse
```

Úsalo solo cuando ambos valores sean cortos y la condición sea fácil de leer. Si la línea se vuelve difícil de seguir de un vistazo, usa un `if/else` normal.

> **¿Por qué un ternario y no un `if/else` aquí?** Porque `if` es una **sentencia** (statement) y el ternario es una **expresión** (expression). Una sentencia _hace_ algo: la usas para ejecutar bloques de código, como el `if/else`, que ejecuta un bloque u otro. Una expresión _produce un valor_: la usas, por ejemplo, para asignar ese valor a una variable. El ternario es una expresión que asigna un valor de forma condicional: elige uno de dos valores según la condición. Solo una expresión puede colocarse a la derecha del operador de asignación `=`, y por eso `String label = if (...)` no es Java válido: produce el error de compilación `illegal start of expression`. Esta distinción entre sentencia y expresión es exactamente la misma que separa las dos formas de `switch` de más abajo.

El siguiente fragmento hace exactamente lo mismo que el ternario de arriba, pero escrito con `if/else`. Así puedes comparar cuánto código te ahorra el ternario:

```java
String label;                 // declarada, todavía sin asignar
if (hours > 8) {
    label = "Overtime";
} else {
    label = "Normal";
}
```

El `if/else` no produce un valor que puedas asignar directamente. Por eso declaras `label` antes del bloque `if/else` y la asignas en cada rama. Si quitas el `else` del bloque de arriba, cuando `hours` no sea mayor que 8 no se ejecuta ninguna asignación y `label` se queda sin valor. El compilador lo detecta antes de que el programa llegue a ejecutarse: la primera línea que use `label` después del `if` no compila y da el error `variable label might not have been initialized`. [01-variables-tipos.md](01-variables-tipos.md) explicó que una variable local debe recibir un valor en todos los caminos posibles antes de leerla. El ternario exige las dos alternativas; `hours > 8 ? "Overtime"` no compila (`error: : expected`). Así, la expresión siempre produce un valor y puedes declarar y asignar `label` en una sola línea.

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

```java
long x = 3L;
switch (x) {                      // ❌
    case 3 -> System.out.println("three");
}
// error: primitive patterns are a preview feature and are disabled by default.
// error: constant label of type int is not compatible with switch selector type long
```

En Java 25 el compilador muestra **dos** errores. El primero dice que usar un `long` como selector solo funcionaría con una funcionalidad nueva de Java que en la versión 25 todavía está a prueba (lo que Java llama _preview_) y viene desactivada. En la práctica significa que un `long` no sirve como selector. El segundo dice que `case 3` es una constante `int` y no es compatible con un selector `long`. No necesitas saber más de esa funcionalidad nueva: los dos errores desaparecen con la misma corrección, que es usar un selector de un tipo marcado con ✅ en la tabla de tipos del selector, justo antes de este ejemplo, como `int`.

La última fila de la tabla se refiere a los objetos que no aparecen en las filas de arriba. Los objetos que sí pueden ser selectores con constantes normales son estos: `String`, `Byte`, `Short`, `Character`, `Integer` y cualquier `enum`. Si el selector es cualquier otro objeto, no puedes escribir un valor fijo detrás de `case`, como `case 5` o `case "MONDAY"`: el compilador lo rechaza, aunque el valor parezca encajar. Eso incluye a `Long`, el wrapper de `long`:

```java
Long id = 5L;
switch (id) {                     // ❌
    case 5 -> System.out.println("five");
}
// error: incompatible types: int cannot be converted to Long
```

Con esos objetos, `switch` solo funciona si escribes otro tipo de `case`, llamado **patrón de tipo** (_type pattern_). Por ejemplo, `case Employee e ->` significa «si el selector es un `Employee`, entra en este caso y llámalo `e`». No necesitas escribirlo todavía, porque en este capítulo todos los `case` usan constantes. Cómo comprobar el tipo de un objeto dentro de un `if`, con `instanceof`, se enseña en [08-herencia-polimorfismo.md](08-herencia-polimorfismo.md).

> **Un `boolean` no puede ser el selector de un `switch`.** Para elegir entre `true` y `false`, usa `if/else`.

> **Con un selector `enum`, usa la expresión `switch`: el compilador te avisa si falta un caso.** Un `enum` es un tipo con una lista fija de valores con nombre; [14-enums.md](14-enums.md) lo enseñará. Por ejemplo, `enum Shift { MORNING, AFTERNOON, NIGHT }` define un tipo `Shift` con solo tres valores posibles. Un `switch` se puede escribir de dos formas, y las dos secciones siguientes las enseñan en detalle.
>
> La primera forma de escribirlo es el **`switch` clásico** (_switch statement_), que se escribe con `case X:`. Es una **sentencia**, igual que el `if/else`: todo el bloque, desde `switch` hasta su última llave, ejecuta código pero no produce ningún valor que puedas guardar en una variable. Que dentro tenga otras sentencias, como los `println` de cada caso, no cambia eso: el `switch` completo cuenta como una sola sentencia. Si en un `switch` clásico olvidas un valor del `enum`, el compilador no avisa: el código compila, y cuando llega ese valor no se ejecuta ningún caso.
>
> ```java
> Shift shift = Shift.NIGHT;
>
> // compila: falta NIGHT, pero una sentencia no tiene que producir ningún valor
> switch (shift) {
>     case MORNING:
>         System.out.println("Starts at 06:00");
>         break;
>     case AFTERNOON:
>         System.out.println("Starts at 14:00");
>         break;
> }
> // con shift = NIGHT no imprime nada
> ```
>
> La segunda forma de escribir un `switch` es la **expresión `switch`** (_switch expression_), que se escribe con `->`. Esta sí produce un valor, que guardas en una variable, así que el compilador exige que haya un caso para cada valor posible del `enum`. Como conoce los tres valores de `Shift`, si falta `NIGHT` no compila:
>
> ```java
> Shift shift = Shift.NIGHT;
>
> // ❌ expresión switch: falta NIGHT
> String start = switch (shift) {
>     case MORNING -> "06:00";
>     case AFTERNOON -> "14:00";
> };
> // error: the switch expression does not cover all possible input values
> ```
>
> Por eso, cuando el selector es un `enum`, es mejor usar la expresión `switch`. Si olvidas un valor, o si más adelante alguien añade uno nuevo al `enum`, el código no compila hasta que añades el caso que falta. Con un `String` el compilador no puede hacer esta comprobación, porque un `String` admite cualquier texto.

### switch clásico (sentencia)

La forma clásica empieza a ejecutar en el caso cuya etiqueta coincide con el valor del selector. Si ese caso tiene instrucciones y no termina con `break`, Java sigue con las instrucciones del siguiente caso, **aunque su etiqueta no coincida**. Ese comportamiento se llama **fall-through**: la ejecución cae de un caso al siguiente sin una nueva comparación.

Una etiqueta `case` no inicia un bloque independiente: indica **dónde empieza** la ejecución cuando hay una coincidencia. Desde ahí Java sigue con las sentencias siguientes, aunque encuentre otra etiqueta `case`. En estos ejemplos, un `break` detiene ese recorrido; de otro modo, continúa hasta el final del `switch`.

Aquí tienes el bug que produce ese mecanismo:

```java
// ❌ MAL — sin break: un Saturday imprime DOS líneas
String day = "SATURDAY";

switch (day) {
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend shift");
    default:
        System.out.println("Unknown day");
}
// imprime:
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

El arreglo consiste en poner un `break` al final de cada grupo de casos:

```java
// ✅ BIEN — break detiene la caída
String day = "SATURDAY";

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
// imprime:
// Weekend shift
```

**Varios `case` pueden compartir el mismo código.** Si escribes varias etiquetas seguidas sin instrucciones entre ellas, todas llevan al mismo bloque. Es lo que hace el ejemplo corregido: entre `case "MONDAY":` y `case "FRIDAY":` no hay instrucciones, así que los cinco días llegan al mismo `println` y comparten un solo `break`. Esta agrupación es un fall-through intencionado, y es el único uso correcto de ese comportamiento. El bug aparece cuando una rama que sí tiene instrucciones continúa en la siguiente porque se olvidó el `break`. En la sección siguiente, donde se explica la expresión `switch` (_switch expression_), la forma de agrupar varios `case` es escribirlos en una sola línea, con las etiquetas separadas por comas: `case "SATURDAY", "SUNDAY" ->`.

> **Detrás de `case X:` puedes escribir tantas sentencias como quieras, sin llaves.** Se ejecutan en orden hasta llegar a un `break` o al final del `switch`. La sangría no cuenta para Java: solo sirve para que tú leas el código, igual que en el resto del lenguaje. También puedes abrir un bloque con llaves después de los dos puntos, y hace falta cuando dos casos declaran una variable con el mismo nombre. Sin llaves, todas las sentencias de los casos están en el mismo bloque, el del `switch`, así que la segunda declaración choca con la primera:
>
> ```java
> String day = "SATURDAY";
>
> // ❌ MAL — sin llaves, las dos variables hours están en el mismo bloque
> switch (day) {
>     case "MONDAY":
>         int hours = 8;
>         System.out.println(hours);
>         break;
>     case "SATURDAY":
>         int hours = 4;
>         System.out.println(hours);
>         break;
> }
> // error: variable hours is already defined in method main(String[])
>
> // ✅ BIEN — cada caso tiene su propio bloque
> switch (day) {
>     case "MONDAY": {
>         int hours = 8;
>         System.out.println(hours);
>         break;
>     }
>     case "SATURDAY": {
>         int hours = 4;
>         System.out.println(hours);
>         break;
>     }
> }
> // imprime:
> // 4
> ```

El bloque `default` no es obligatorio en esta sentencia, pero permite manejar un valor no previsto, como un día mal escrito. Sin él, un valor que no coincide con ningún caso deja el `switch` sin ejecutar ninguna rama.

> **Un selector `null` no llega a `default`.** Este `switch (day)` no tiene `case null`, así que un día ausente lanza `NullPointerException` antes de ejecutar cualquier caso normal. Es un anticipo de [04-metodos.md](04-metodos.md), que explica dónde debe rechazarse un argumento ausente.

### Expresión `switch` (Java 14+) — usa esta forma

El `switch` clásico es una **sentencia**: ejecuta código y no produce ningún valor. La **expresión `switch`** (_switch expression_) sí produce un valor, así que puedes asignarlo directamente a una variable.

También elimina el fall-through: cada rama usa `->` y ejecuta exactamente una cosa, así que no existe `break` ni hace falta.

La forma de escribirla es declarar una variable y asignarle el `switch` entero, igual que le asignarías cualquier otro valor:

1. `String shift =` declara la variable que recibe el resultado.
2. `switch (day) { ... }` elige una rama según el valor de `day`.
3. Cada rama se escribe `case etiqueta -> valor;`. A la izquierda de la flecha va la etiqueta, o varias separadas por comas. A la derecha va el valor que recibe `shift` si esa rama coincide.
4. El `switch` termina con `};`: la llave cierra el `switch` y el punto y coma cierra la asignación, igual que en `String name = "Ana";`.

```java
String day = "SATURDAY";

String shift = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
// shift vale "Weekend"
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

**`yield` — cuando una rama necesita más de una línea.** Una rama con flecha normalmente termina en una única expresión, que pasa a ser el valor. Si necesitas varias sentencias, envuélvelas en `{ }`. Dentro de ese bloque, Java no sabe cuál es el valor que debe devolver la rama, así que tienes que indicarlo tú con la palabra clave `yield`:

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
>
> La diferencia se ve en la línea que va después del `switch`. Con `yield`, esa línea se ejecuta. Con `return`, el método termina y esa línea nunca llega a ejecutarse:
>
> ```java
> void printLimit(String day) {
>     int dailyLimit = switch (day) {
>         case "SATURDAY", "SUNDAY" -> 0;
>         default -> {
>             int base = 8;
>             yield base;                        // sale solo de la rama: dailyLimit vale 8
>         }
>     };
>     System.out.println("Limit: " + dailyLimit);   // se ejecuta
> }
>
> void printShift(String day) {
>     switch (day) {
>         case "SATURDAY":
>             System.out.println("Weekend");
>             return;                            // sale del método printShift entero
>         default:
>             System.out.println("Weekday");
>     }
>     System.out.println("Shift checked");       // con "SATURDAY" no se ejecuta: el return ya salió de printShift
> }
>
> // printLimit("MONDAY") imprime:
> // Limit: 8
>
> // printShift("SATURDAY") imprime:
> // Weekend
> ```

Cuando necesites **producir un valor** a partir de varios casos, o cuando el selector sea un `enum`, elige la expresión `switch` (_switch expression_). Cuando solo necesites realizar una acción, una sentencia `switch` (_switch statement_) también encaja; las dos formas responden a necesidades distintas.

---

## Bucles for

> 📖 Docs: [Baeldung — Java For Loop](https://www.baeldung.com/java-for-loop) → leer primero el `for` clásico de tres partes, luego la forma mejorada (for-each) al final.
> 📖 Docs: [Baeldung — A Guide to Java Loops](https://www.baeldung.com/java-loops) → leer para ver los tres tipos de bucle uno al lado del otro, y cuándo encaja cada uno.

Imagina que tienes los nombres de los días de la semana guardados en una sola variable, `week`, y quieres imprimir cada uno de ellos en una línea. Esa variable es un **array**, una lista de valores de tamaño fijo. Sin un bucle tendrías que escribir un `System.out.println` por cada día, siete líneas casi iguales, y cien si el array tuviera cien elementos. `for` repite la misma instrucción para cada elemento que quieres recorrer. En esta sección verás dos formas de escribir un `for`: el `for` clásico y el `for` mejorado (_enhanced for_ o _for-each_). Las dos pueden recorrer un array, y el _for-each_ también puede recorrer una `List`, una lista que sí puede cambiar de tamaño. Antes del código, necesitas saber cómo se leen las posiciones y la longitud de un array.

> **Introducción a los arrays: lo mínimo que debes conocer para recorrerlos con un bucle.** Un array guarda varios valores del mismo tipo en un número fijo de posiciones, y cada posición se localiza por un número. Puedes crearlo de dos formas:
>
> ```java
> String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};   // 1. con sus valores
> int[] weekHours = {8, 8, 6};                           // 1. con sus valores
>
> String[] names = new String[3];                        // 2. solo con su tamaño: null, null, null
> int[] totals = new int[3];                             // 2. solo con su tamaño: 0, 0, 0
> ```
>
> Los corchetes de `String[]` e `int[]` indican que la variable es un array de `String` o de `int`. La primera forma escribe sus valores entre llaves, separados por comas. La segunda indica solo cuántas posiciones tiene, con `new` y el tamaño entre corchetes, para rellenarlas después. Con `new String[3]`, un array de `String`, sus tres posiciones empiezan con `null`. Con `new int[3]`, un array de `int`, empezarían con `0`, porque un `int` no puede ser `null`. Es lo que viste en [01-variables-tipos.md](01-variables-tipos.md), en la sección _Variables de referencia y `null`_: una variable de tipo primitivo, como un `int`, guarda el valor directamente, mientras que una variable de un objeto, como un `String`, guarda una referencia a la dirección de memoria donde está ese objeto. `null` significa que esa referencia todavía no apunta a ningún objeto.
>
> Una vez creado el array, necesitas dos cosas para recorrerlo con un bucle: leer un elemento concreto, escribiendo su posición entre corchetes detrás del nombre del array, y saber cuántas posiciones tiene, con `.length`:
>
> ```java
> System.out.println(week[0]);       // MONDAY
> System.out.println(week.length);   // 3
> ```
>
> Accedes a un elemento por su **índice**, entre corchetes: `week[0]`. El primer índice es **cero**, así que un array de tres elementos tiene índices 0, 1 y 2, nunca 3. `week.length` indica cuántas posiciones tiene; es un **campo**, sin paréntesis, a diferencia de los métodos `String.length()` y `List.size()`. Que un array sea de tamaño fijo significa que, una vez creado, no puedes agregar ni eliminar elementos: no tiene métodos como `add()` o `remove()`. Lo que sí puedes hacer es cambiar el valor de una posición que ya existe, por ejemplo `week[0] = "SUNDAY";`.

> **Por qué basta con esto ahora.** La pregunta interesante es _cuándo conviene usar un array de tamaño fijo y cuándo una `List` que puede cambiar de tamaño_. Para responderla necesitas conocer las colecciones. [10-colecciones.md](10-colecciones.md) hace la comparación y enseña `List`, incluida la `List<Employee>` mencionada antes. Aquí el array sirve como ejemplo sencillo para recorrer con un bucle.

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

- `int i = 0` — empieza en el índice 0, es decir, en el primer elemento del array
- `i < week.length` — continúa mientras esto sea verdadero, es decir, hasta el último elemento del array, el de índice `week.length - 1`
- `i++` — incrementa i en 1 tras cada iteración

El `for` ejecuta las tres partes de su cabecera en este orden:

1. `int i = 0` fija la posición de inicio. Se ejecuta una sola vez, al entrar en el bucle.
2. Comprueba la condición `i < week.length`. Si es falsa, el bucle se acaba.
3. Si la condición `i < week.length` es verdadera, ejecuta el cuerpo del `for`.
4. Al acabar el cuerpo, ejecuta el paso, `i++`, y vuelve al punto 2. Los pasos 2, 3 y 4 se siguen repitiendo hasta que la condición sea falsa.

Así se ejecuta el bucle de arriba con `week` de tres elementos, fragmento a fragmento:

```
int i = 0;                                  // paso 1: i vale 0 (solo esta vez)

i < week.length  →  0 < 3  →  true         // paso 2
System.out.println(i + ": " + week[i]);     // paso 3: imprime "0: MONDAY"
i++;                                        // paso 4: i vale 1

i < week.length  →  1 < 3  →  true         // paso 2
System.out.println(i + ": " + week[i]);     // paso 3: imprime "1: TUESDAY"
i++;                                        // paso 4: i vale 2

i < week.length  →  2 < 3  →  true         // paso 2
System.out.println(i + ": " + week[i]);     // paso 3: imprime "2: WEDNESDAY"
i++;                                        // paso 4: i vale 3

i < week.length  →  3 < 3  →  false        // paso 2: el bucle termina
```

Por eso la primera vez que se ejecuta el cuerpo `i` vale `0`, no `1`: el paso `i++` solo se ejecuta después del cuerpo.

> **`i` solo existe dentro del bucle.** Como `int i` se declara en la cabecera del `for`, su alcance (scope) termina al cerrar el bucle. Intentar leerla después falla al compilar con `cannot find symbol / symbol: variable i`. Casi nunca necesitarás el valor de `i` después del bucle. Si alguna vez lo necesitas, declara `i` antes del `for`: `int i = 0; for (; i < week.length; i++) { ... }`. Es una forma poco habitual: cuando te pasa, normalmente es señal de que te encaja mejor un bucle `while`, que se ve más abajo en este capítulo. [01-variables-tipos.md](01-variables-tipos.md) explica la misma regla de alcance para otras variables locales.

**El error off-by-one, y la excepción que produce.** La cabecera de tres partes es potente precisamente porque escribes los límites tú mismo, lo cual significa que también puedes escribirlos mal. El desliz clásico es escribir `<=` donde querías `<`. Con `<=`, el bucle da una vuelta de más e intenta acceder a una posición que no existe:

```java
int[] weekHours = {8, 8, 6};   // longitud 3, índices válidos 0, 1, 2

// ❌ MAL
for (int i = 0; i <= weekHours.length; i++) {   // i llega a 3
    System.out.println(weekHours[i]);           // con i = 3 falla: weekHours[3] no existe
}
// imprime 8, 8, 6 y luego falla:
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3

// ✅ BIEN
for (int i = 0; i < weekHours.length; i++) {
    System.out.println(weekHours[i]);
}
```

El mensaje de error te dice exactamente qué ha pasado: `Index 3` es el valor de `i`, `length 3` es la longitud del array y la última posición válida tiene índice 2. Este es un **error off-by-one**: el límite se ha pasado por una posición. Ocurre en runtime, después de que el programa haya impreso tres líneas correctas; [00-intro-java.md](00-intro-java.md) distinguió estos fallos de los que detecta el compilador.

> **Los índices empiezan en cero, así que el último es `length - 1`.** En el modelo de arrays de Java, el índice numera las posiciones desde cero: la primera es `week[0]` y cada posición siguiente aumenta el índice en uno. Si el array tiene `length` posiciones, la última es `length - 1`.

### Enhanced for (for-each) — úsalo para colecciones y arrays

> 📖 Docs: [Baeldung — The for-each Loop in Java](https://www.baeldung.com/java-for-each-loop) → leer: "Working" y "Pros and Cons" — las desventajas que se listan ahí son los límites que se explican abajo.
> 📖 Docs: [JLS §14.14.2 — The enhanced for statement](https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.14.2) → leer: las dos expansiones, una para un `Iterable` y otra para un array — la fuente del diagrama de reescritura de abajo.

En el `for` clásico estás obligado a escribir tú mismo el índice: su valor inicial (`int i = 0`), la condición que lo detiene (`i < week.length`) y el paso que lo hace avanzar (`i++`). Si solo quieres recorrer cada elemento, ese índice sobra y puede causar el error off-by-one que acabas de ver. El _for-each_ te da cada elemento directamente, uno detrás de otro, sin que tengas que escribir un índice ni calcular dónde acaba el array. Equivale al `for...of` de JavaScript.

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

**El compilador convierte el _for-each_ en otro bucle, y eso explica sus límites.** El _for-each_ es una abreviatura: antes de traducirlo a bytecode, `javac` (el compilador de Java, el programa que traduce tu código fuente a bytecode, como viste en [00-intro-java.md](00-intro-java.md)) reescribe el _for-each_ como otro bucle. El bucle que escribe en su lugar depende de lo que recorra el _for-each_. Si recorre un array, lo convierte en un `for` clásico con índice, como el de la sección anterior. Si recorre una `List`, lo convierte en un bucle que usa un **iterador**.

Un **iterador** es un objeto que recorre una colección de principio a fin, un elemento cada vez, y recuerda por dónde va. Tiene dos métodos: `hasNext()` devuelve `true` si todavía quedan elementos por recorrer, y `next()` te da el siguiente elemento y avanza una posición. Funciona como un marcapáginas: siempre marca por dónde vas, y cada `next()` pasa a la página siguiente. Una lista te da su iterador cuando llamas a su método `iterator()`; en el diagrama de abajo es `employees.iterator()`. Con él, el bucle pregunta `hasNext()` antes de cada iteración, y mientras la respuesta sea `true`, `next()` le da el siguiente empleado. Cuando ya no quedan, `hasNext()` devuelve `false` y el bucle termina. Ese bucle es un `while`, que repite su cuerpo mientras la condición sea verdadera y se explica más abajo en este capítulo.

Java llama **`Iterable`** («que se puede recorrer») a cualquier tipo que tenga ese método `iterator()`, es decir, a cualquier tipo capaz de darte un iterador. `List` es `Iterable`, y también lo es `Set` (un conjunto: una colección que no admite elementos repetidos ni garantiza ningún orden), porque en Java toda colección es `Iterable`. Un array no lo es, y por eso el compilador lo traduce a un `for` clásico que usa un índice. `Iterable` es una **interfaz**, una lista de métodos que un tipo se compromete a tener; las interfaces se explican en [07-interfaces-abstractas.md](07-interfaces-abstractas.md). Para este capítulo te basta con saber que el _for-each_ recorre un array o cualquier tipo que sea `Iterable`.

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

**1. La variable del bucle no te da el índice.** La traducción del array lleva un contador oculto, pero el _for-each_ no lo pone a disposición del cuerpo. La traducción con iterador entrega el elemento siguiente sin índice alguno. Si necesitas la posición, usa un `for` clásico sobre un array o sobre una `List` que permita el acceso por índice. [10-colecciones.md](10-colecciones.md) explica qué colecciones tienen posiciones.

**2. Este bucle sirve para recorrer elementos, no para cambiar la estructura de la colección.** La versión con `List` pide el elemento siguiente al iterador en cada iteración. Si eliminas directamente un empleado de ciertas listas mientras se usa ese iterador, una iteración posterior puede fallar. El fallo concreto y las formas seguras de eliminar elementos se explican en [10-colecciones.md](10-colecciones.md). Por ahora, elige este bucle cuando solo necesites recorrer un array o una colección, sin añadir ni eliminar elementos.

**3. Reasignar la variable del bucle no cambia el array.** Si das un valor nuevo a la variable del _for-each_, el array no cambia. El motivo es que esa variable, `day` en el ejemplo de abajo, es una variable aparte del array: en cada iteración, Java copia en `day` lo que hay en una posición del array. Pasa lo mismo que cuando copias una variable en otra:

```java
int a = 5;
int b = a;   // b recibe una copia de lo que hay en a
b = 10;      // cambia b; a sigue valiendo 5
```

Si después cambias `day`, cambias la copia, y la posición del array sigue guardando lo que tenía. Con un `for` clásico sí puedes cambiarlo, porque asignas el valor nuevo directamente a una posición del array, con `week[i] = ...`. Por ejemplo, este bucle intenta pasar a minúsculas los días de `week`, y no lo consigue:

```java
// ❌ MAL — week queda sin cambios después
for (String day : week) {
    day = day.toLowerCase();
}
```

El bucle ❌ falla por la traducción que viste arriba. `javac` lo reescribe como el `for` clásico de abajo, en el que `day` es una variable local distinta de `week[i]`: `day` guarda una copia de la referencia que hay en `week[i]`. En `week[i]` hay una referencia porque `week` es un array de `String`, y `String` es un objeto: cada posición de un array de objetos guarda una referencia que apunta al objeto, no el objeto en sí. En un array de `int`, cada posición guardaría el número directamente. Así que al cambiar `day`, que es una variable local, no estás cambiando el array, como viste con `a` y `b` en el código de arriba.

```java
for (int i = 0; i < week.length; i++) {
    String day = week[i];        // day recibe una copia de la referencia que guarda week[i]
    day = day.toLowerCase();     // day pasa a apuntar a otro String; week[i] no cambia
}
```

Esto es lo que ocurre en la primera iteración, con `week[0]` apuntando a `"MONDAY"`:

1. `String day = week[0]` copia en `day` la referencia que guarda `week[0]`. Ahora las dos variables guardan la misma referencia, que apunta al mismo `"MONDAY"`.
2. `day.toLowerCase()` no modifica `"MONDAY"`, porque un `String` no se puede cambiar una vez creado. Crea un `String` nuevo, `"monday"`, y devuelve una referencia nueva, que apunta a ese objeto nuevo. [02-cadenas-de-texto.md](02-cadenas-de-texto.md) explica por qué en su sección _Inmutabilidad_.
3. `day = ...` guarda en `day` la referencia a `"monday"`. Solo cambia `day`; `week[0]` sigue apuntando a `"MONDAY"`.
4. Al terminar la iteración, `day` deja de existir, y `"monday"` se pierde con ella.

Lo mismo pasa con `week[1]` y `week[2]`, así que al acabar el bucle `week` sigue siendo `{"MONDAY", "TUESDAY", "WEDNESDAY"}`.

Este otro bucle sí lo consigue, porque guarda el resultado en la propia posición del array, con `week[i] = ...`, y no en una copia:

```java
// ✅ BIEN — escribe de vuelta a través del índice
for (int i = 0; i < week.length; i++) {
    week[i] = week[i].toLowerCase();
}
```

Usa el _for-each_ cuando necesites los elementos pero no su posición. También lo encontrarás en código Spring Boot. Para transformar colecciones verás los streams en [13-streams-colectores.md](13-streams-colectores.md).

---

## while y do-while

> 📖 Docs: [Baeldung — Java While Loop](https://www.baeldung.com/java-while-loop) → leer para la sintaxis y el orden "comprueba antes que el cuerpo".
> 📖 Docs: [Baeldung — Java Do-While Loop](https://www.baeldung.com/java-do-while-loop) → leer para el contraste con `while`: primero el cuerpo, luego la condición, siempre al menos una ejecución.

Usa `while` o `do-while` cuando la condición de salida depende de lo que ocurra en cada iteración y no sabes cuántas iteraciones harán falta. Por ejemplo: pedir las horas de un día hasta que el usuario escriba un número válido, entre 0 y 24, sin saber cuántas veces se va a equivocar; descargar los empleados página a página hasta que llegue una página vacía, que es el ejemplo del `do-while` de más abajo; o volver a llamar a un servicio que no responde hasta que responda. En esos casos, un `for` con contador no expresa bien cuándo debe terminar el trabajo.

**`while`** comprueba la condición antes de ejecutar el cuerpo. Si la condición es falsa desde el principio, el cuerpo no se ejecuta ninguna vez, así que es posible que un `while` se ejecute 0 veces.

**`do-while`** ejecuta primero el cuerpo y después comprueba la condición, así que el cuerpo se ejecuta al menos una vez. Te sirve cuando tienes que hacer algo antes de saber si hay que seguir. Por ejemplo, para saber si una página de empleados está vacía, primero tienes que descargarla: la descarga va en el cuerpo y la comprobación va en la condición.

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

En el `do-while`, `loadPage(page)` representa la descarga de una página de empleados y `process(batch)` representa su procesamiento; son métodos de ejemplo, no llamadas definidas en este capítulo. En la primera pasada se descarga la página 0, se procesa solo si contiene empleados, se incrementa `page` a 1 y después se comprueba si la página descargada estaba vacía. Cuando llega una página vacía, no se procesa ningún empleado y el bucle termina tras esa pasada. `batch` se declara antes del `do`, no dentro del cuerpo, por la regla de alcance de [01-variables-tipos.md](01-variables-tipos.md): una variable declarada dentro de `{ }` deja de estar disponible al cerrar la llave, porque ahí termina su alcance (_scope_), y la condición `while (...)` está después. Si declaras `batch` dentro del cuerpo, la condición falla con `cannot find symbol`.

> **Un `while` sin avance se convierte en un bucle infinito.** En un `for` clásico, el incremento está en la cabecera; en un `while`, debes escribirlo dentro del cuerpo. Si lo olvidas o un `continue` lo salta, `i` no cambia y la condición sigue siendo verdadera siempre, por lo que el bucle no termina nunca. El ejemplo imprime `MONDAY` una y otra vez hasta que detengas el programa. No aparece un error de compilación ni una excepción.
>
> ```java
> // ❌ MAL — i nunca se incrementa; esto no termina nunca
> int i = 0;
> while (i < week.length) {
>     System.out.println(week[i]);
> }
> ```
>
> Para evitar un bucle infinito, cuando escribas la condición del `while`, escribe de inmediato la línea que en algún momento la hará falsa, _antes_ de escribir cualquier otra cosa en el cuerpo.

> **`do-while` necesita un punto y coma final.** En `} while (!batch.isEmpty());`, el `while (...)` cierra la sentencia que empezó con `do`; por eso lleva `;`. Si lo omites, el compilador muestra `error: ';' expected`. Los otros bucles no llevan ese punto y coma después de la llave de cierre.

Elige `do-while` cuando el cuerpo deba ejecutarse al menos una vez, por ejemplo para descargar la primera página antes de comprobar si quedan resultados. Usa `while` para repetir algo mientras se cumpla una condición que puede ser falsa desde el principio; en ese caso, el cuerpo puede no ejecutarse ni una vez. Por ejemplo, para leer un fichero línea a línea hasta el final: si el fichero está vacío, no hay ninguna línea que leer.

### Elegir entre las cuatro formas de bucle

Ya has visto las cuatro formas de bucle. Para elegir entre ellas, pregúntate **qué decide cuántas veces se repite el bucle**, es decir, qué hace que el bucle termine. Hay tres respuestas posibles: un contador que llega a un límite, que ya no queden elementos por recorrer, o una condición que deja de cumplirse y que se comprueba antes o después de cada iteración.

| Qué decide cuántas veces se repite                                                                                                        | Forma         | Qué te garantiza                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Con contador** — sabes cuántas iteraciones hacen falta y necesitas el índice de cada elemento                                           | `for` clásico | escribes tú mismo el valor inicial, la condición y el paso, así que controlas cuántas iteraciones hace el bucle y qué índice usa en cada una |
| **Con los elementos** — quieres recorrer todos los elementos de un array o de una colección y no necesitas su índice                      | _for-each_    | el bucle te da cada elemento, uno detrás de otro, sin que escribas ningún índice, así que no puedes cometer un error off-by-one              |
| **Con una condición comprobada antes** — no sabes cuántas iteraciones hacen falta, y puede que no haga falta ninguna                      | `while`       | comprueba la condición antes de ejecutar el cuerpo, así que, si es falsa desde el principio, el cuerpo no se ejecuta ninguna vez             |
| **Con una condición comprobada después** — no sabes cuántas iteraciones hacen falta, pero el cuerpo tiene que ejecutarse al menos una vez | `do-while`    | ejecuta el cuerpo antes de comprobar la condición, así que el cuerpo se ejecuta al menos una vez                                             |

> **Elige el bucle que mejor transmite tu intención.** Casi siempre puedes hacer lo mismo con varios tipos de bucle: por ejemplo, un recorrido con índice se puede escribir con un `for` clásico o con un `while`. Pero cada tipo le dice algo distinto a quien lea tu código, antes de que lea el cuerpo:
>
> - `for (Employee emp : employees)` dice: «voy a recorrer los empleados de la lista y no necesito su índice».
> - `for (int i = 0; i < week.length; i++)` dice: «voy a repetir esto un número conocido de veces, usando el índice `i`».
> - `while (...)` dice: «voy a repetir esto mientras se cumpla una condición, y puede que no se ejecute ninguna vez».
>
> Por eso, aunque un `while` pueda hacer lo mismo que un `for`, elige el bucle que describe lo que quieres hacer: quien lea tu código entenderá tu intención sin tener que leer el cuerpo entero.

---

## break, continue y return

> 📖 Docs: [Baeldung — The Java `continue` and `break` Keywords](https://www.baeldung.com/java-continue-and-break) → leer primero las formas sin etiqueta, luego las etiquetadas al final.
> 📖 Docs: [Baeldung — Labeled Breaks in Java: Useful Tool or Code Smell?](https://www.baeldung.com/java-labeled-break) → leer para el argumento de legibilidad — cuándo extraer un método en su lugar.

A veces no quieres esperar a que un bucle termine por su regla normal. Por ejemplo, si buscas el primer empleado con horas extra, cuando lo encuentras ya no tiene sentido revisar al resto. Para esos casos, Java tiene tres sentencias que cortan la ejecución antes de tiempo: `break`, `continue` y `return`. Las tres «paran» algo, y por eso se confunden a menudo: la diferencia está en qué paran y en qué línea se ejecuta después. Esto es lo que para cada una:

**`break`** sale del bucle más interno o del `switch` clásico que lo contiene. Si sale de un bucle, ese bucle no tiene más iteraciones, y la ejecución sigue en la primera línea que hay después del bucle. En este ejemplo, el bucle revisa las horas de cada día y se detiene en el primer día con horas extra:

```java
int[] weekHours = {8, 6, 10, 7};
for (int hours : weekHours) {
    if (hours > 8) {
        System.out.println("Overtime: " + hours);
        break;                    // sale del bucle: el 7 ya no se revisa
    }
    System.out.println("Normal: " + hours);
}
System.out.println("End");
// Normal: 8
// Normal: 6
// Overtime: 10
// End
```

El `7` no se revisa porque `break` sale del bucle en el `10`. `End` sí se imprime, porque está después del bucle y `break` solo sale del bucle.

`break` también sirve para salir de un `switch` clásico. Cuando se ejecuta, el `switch` termina, y la ejecución sigue en la primera línea que hay después del `switch`. Es el `break` que viste en la sección _switch clásico_:

```java
String day = "SATURDAY";
switch (day) {
    case "SATURDAY":
        System.out.println("Weekend shift");
        break;                    // sale del switch: el caso siguiente no se ejecuta
    default:
        System.out.println("Unknown day");
}
System.out.println("End");
// Weekend shift
// End
```

Sin ese `break`, la ejecución seguiría en el caso siguiente e imprimiría también `Unknown day`. Con él, sale del `switch` y continúa en `System.out.println("End")`.

**`continue`** salta el resto de la iteración actual y va directamente a la siguiente. En este ejemplo, los días con `0` horas no se imprimen:

```java
int[] weekHours = {8, 0, 10, 6};
for (int hours : weekHours) {
    if (hours == 0) {
        continue;                 // con el 0: se salta el resto de esta iteración y continúa con la iteración del 10
    }
    System.out.println("Worked " + hours + " hours");
}
// Worked 8 hours
// Worked 10 hours
// Worked 6 hours
```

Con el `0`, `continue` se salta el `println` y el bucle pasa al `10`. El bucle no se detiene: sigue hasta el último día.

**`return`** sale del **método** entero. El bucle termina como efecto secundario, y también todo lo que iba a ejecutarse después del bucle. Este es el mismo bucle del ejemplo de `break`, dentro de un método y con `return` en lugar de `break`:

```java
void printUntilOvertime(int[] weekHours) {
    for (int hours : weekHours) {
        if (hours > 8) {
            System.out.println("Overtime: " + hours);
            return;               // "End" no se imprime porque ya ha salido del método printUntilOvertime
        }
        System.out.println("Normal: " + hours);
    }
    System.out.println("End");
}

printUntilOvertime(new int[] {8, 6, 10, 7});
// Normal: 8
// Normal: 6
// Overtime: 10
```

A diferencia del ejemplo de `break`, `End` no se imprime: `return` sale del método entero, así que la línea que hay después del bucle no llega a ejecutarse.

Las tres pueden aparecer juntas en el mismo bucle:

```java
for (Employee emp : employees) {
    if (!emp.isActive()) continue;          // sáltate este, sigue adelante
    if (emp.getHours() > 40) {
        System.out.println("Overtime: " + emp.getName());
        break;                              // ya ha encontrado al primer empleado con horas extra: deja de buscar
    }
}
```

En el ejemplo, `continue` omite al empleado inactivo y sigue con el siguiente. `break` termina la búsqueda en cuanto encuentra el primer caso de horas extra.

> **`continue` puede impedir que un `while` avance.** En un `while`, el `i++` es una línea más del cuerpo. `continue` se salta el resto del cuerpo y vuelve directamente a comprobar la condición, así que, si el `i++` está después del `continue`, también se lo salta. Entonces `i` no cambia, la condición sigue siendo verdadera y el bucle no termina nunca: has creado un bucle infinito. Por ejemplo, este bucle intenta imprimir las horas de cada día, saltándose los días con `0`:
>
> ```java
> int[] weekHours = {8, 0, 10};
>
> // ❌ MAL — con el 0, continue se salta el i++ y el bucle no termina nunca
> int i = 0;
> while (i < weekHours.length) {
>     if (weekHours[i] == 0) {
>         continue;             // vuelve a la condición sin pasar por el i++
>     }
>     System.out.println(weekHours[i]);
>     i++;
> }
> // 8
> // (no imprime nada más, pero el programa sigue ejecutándose)
> ```
>
> Esto es lo que ocurre, iteración a iteración:
>
> 1. Con `i = 0`, `weekHours[0]` vale `8`: imprime `8` y el `i++` deja `i` en `1`.
> 2. Con `i = 1`, `weekHours[1]` vale `0`: como `weekHours[1] == 0` es `true`, entra en el `if` y se ejecuta `continue`, que vuelve a la condición sin pasar por el `i++`. `i` sigue valiendo `1`.
> 3. `1 < 3` sigue siendo `true`, `weekHours[1]` sigue valiendo `0` y se vuelve a ejecutar `continue`. El paso 3 se repite sin fin.
>
> El arreglo es poner el `i++` antes de cualquier `continue` que pueda saltárselo:
>
> ```java
> // ✅ BIEN — i++ se ejecuta antes de que continue pueda saltárselo
> int i = 0;
> while (i < weekHours.length) {
>     int hours = weekHours[i];
>     i++;
>     if (hours == 0) {
>         continue;
>     }
>     System.out.println(hours);
> }
> // 8
> // 10
> ```
>
> En un `do-while` pasa lo mismo. `continue` salta a la comprobación de la condición, que en un `do-while` está al final.
>
> ```java
> // ❌ MAL — el mismo problema en un do-while
> int i = 0;
> do {
>     if (weekHours[i] == 0) {
>         continue;             // salta al while (...) del final sin pasar por el i++
>     }
>     System.out.println(weekHours[i]);
>     i++;
> } while (i < weekHours.length);
> // 8
> // (no imprime nada más, pero el programa sigue ejecutándose)
> ```
>
> El arreglo es el mismo que en el `while`: pon el `i++` antes del `continue`.
>
> Con un `for` clásico este problema no existe: el `i++` está en la cabecera, y el `for` lo ejecuta siempre antes de la siguiente comprobación, también después de un `continue`:
>
> ```java
> for (int i = 0; i < weekHours.length; i++) {
>     if (weekHours[i] == 0) {
>         continue;             // el for ejecuta el i++ igualmente
>     }
>     System.out.println(weekHours[i]);
> }
> // 8
> // 10
> ```

Esta tabla resume las tres sentencias: qué parte del código deja de ejecutarse con cada una y qué línea se ejecuta justo después.

| Sentencia  | Qué deja atrás                                             | Dónde aterriza la ejecución después                                                                               | Dónde es legal                                                                     |
| ---------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `continue` | el resto de la iteración actual                            | la siguiente comprobación de condición del bucle — en un `for` clásico, después de que se ejecute el paso (`i++`) | solo dentro de un bucle                                                            |
| `break`    | el bucle más interno o el `switch` clásico que lo contiene | la primera línea después de ese bucle o `switch`, en el mismo método                                              | dentro de un bucle, o de un `switch` clásico                                       |
| `return`   | el **método** entero, bucle incluido                       | sale del método y se ejecuta la línea que va justo después de la **llamada** a ese método                         | en cualquier parte de un método, excepto dentro de la rama de un switch expression |

Para ver las tres juntas en un mismo método, tenemos un ejemplo en el que el método busca en el registro de horas el nombre del primer empleado activo con horas extra. La lista de empleados llega ordenada por horas semanales, de mayor a menor. Por eso, en cuanto aparece un empleado con `0` horas, todos los que vienen detrás también tienen `0`, y ya no hace falta seguir buscando:

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

Traza las tres salidas. El `continue` devuelve el control a la cabecera del `for`, que produce el siguiente `emp` — el bucle queda intacto y sigue corriendo. El `break` envía el control a la primera línea _después_ del bucle, que aquí es `return "none";` — el bucle terminó, el método no. Y `return emp.getName()` no hace ninguna de las dos cosas: el método se detiene en esa línea, `return "none";` no se alcanza, y el valor viaja de vuelta a quien escribió `String who = firstOvertimeName(team);`.

> **`return;` sin nada detrás sigue siendo un `return`.** Un método declarado `void` — uno que promete no devolver nada — igualmente puede cortarse a sí mismo con un `return;` a secas. Salir de un método antes de tiempo, a propósito, antes de que haga su trabajo principal, es un patrón con nombre propio, y [04-metodos.md](04-metodos.md) lo enseña. El compilador exige la promesa en ambas direcciones: escribir `return algo;` en un método `void` falla con `error: incompatible types: unexpected return value`, y llegar al final de un método que prometía un valor sin devolver ninguno falla con `error: missing return statement`. _Qué_ promete un método — su tipo de retorno, sus parámetros, su signature — es el tema de [04-metodos.md](04-metodos.md).

> **El código escrito justo después de `break`, `continue` o `return`, en el mismo bloque, no compila.** Esa línea nunca podría ejecutarse, porque la ejecución siempre sale antes de llegar a ella. A una línea así se le llama **código muerto** (_dead code_), y Java no se limita a avisarte: lo trata como un error y la compilación se detiene. Por ejemplo:
>
> ```java
> for (int hours : weekHours) {
>     if (hours > 8) {
>         return;
>         System.out.println("Overtime");   // ❌ nunca se ejecutaría
>     }
> }
> ```
>
> El compilador rechaza la línea del `println` con `error: unreachable statement` («sentencia inalcanzable»). Si te aparece este error mientras mueves código de sitio, te está diciendo que el `break`, `continue` o `return` está antes de lo que pensabas: la ejecución sale del bloque antes de llegar a esa línea.

### `break` y `continue` con etiqueta: salir de un bucle que está dentro de otro

Cuando un bucle está dentro de otro, un `break` normal solo sale del bucle en el que está escrito, el bucle más interno, y el bucle exterior sigue con su siguiente iteración. Para salir de los dos a la vez, primero tienes que ponerle un nombre al bucle exterior. Ese nombre se llama **etiqueta**, y se escribe en la línea anterior al bucle, seguido de dos puntos, por ejemplo `outer:`.

```java
outer:                               // la etiqueta: el nombre outer seguido de dos puntos
for (Employee emp : employees) {     // el bucle exterior, que ahora se llama outer
    for (String day : week) {        // el bucle más interno
        // ...
    }
}
```

Después, dentro del bucle más interno, `break outer;` sale del bucle que lleva esa etiqueta, y con él también del bucle más interno.

El registro de horas da un caso real. Quieres comprobar que todas las anotaciones están aprobadas, así que recorres los empleados y, para cada empleado, recorres los días de la semana. En cuanto encuentres una anotación sin aprobar, quieres detener toda la búsqueda, no solo la del empleado actual. `isApproved(emp, day)` es una llamada de ejemplo que devuelve `true` cuando la anotación de ese empleado para ese día está aprobada.

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

> **Las etiquetas se usan poco en el código real.** Una etiqueta funciona igual con tres o más bucles, uno dentro de otro: `break outer;` sale de todos ellos hasta llegar al bucle etiquetado. Pero ya es raro encontrar una etiqueta con dos bucles, y con tres o más lo es todavía más: tantos niveles de bucles dentro de bucles hacen el código difícil de leer, y en un proyecto normal se reorganiza antes. Lo habitual es sacar los bucles a un método y salir con `return`, como explica el último aviso de esta sección. Aun así, conviene que sepas leer una etiqueta, porque puede aparecer en código antiguo y en preguntas de entrevista.

> **Una etiqueta no es un `goto`.** En lenguajes como C existe la sentencia `goto`, que salta a cualquier línea del programa que tenga una etiqueta, esté antes o después. Java no tiene `goto`, y sus etiquetas son mucho más limitadas: en la práctica, solo sirven para decir de qué bucle salen `break` y `continue`.
>
> - `break outer;` sale del bucle que lleva la etiqueta `outer`, y la ejecución sigue en la primera línea que hay después de ese bucle.
> - `continue outer;` pasa a la siguiente iteración del bucle que lleva la etiqueta `outer`.
>
> Ninguno de los dos puede saltar hacia atrás a una línea cualquiera ni meterse dentro de otro bloque. Por eso no son saltos arbitrarios como los de `goto` en C.

> **Un método pequeño puede evitar un `break` etiquetado.** Esto se suele usar para búsquedas: recorres varios bucles para encontrar un elemento y, en cuanto lo encuentras, ya no necesitas seguir. Es la forma más habitual de resolver este caso en el código real, mucho más que un `break` con etiqueta; en los servicios de Spring Boot, por ejemplo, lo normal es salir del método con `return` en cuanto se tiene el resultado. Si la búsqueda debe terminar al encontrar un resultado, puedes poner los bucles en un método y devolver ese resultado con `return`. Así sales de ambos bucles y del método a la vez. La búsqueda anterior también se puede escribir así:
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

Ya puedes seguir la ejecución de un registro de horas: las condiciones eligen ramas, los bucles repiten instrucciones y las salidas anticipadas cambian el punto en que continúa el programa. Has leído llamadas como `loadPage(page)`, `isApproved(emp, day)` y `firstOvertimeName(...)` sin tener que escribirlas. En [04-metodos.md](04-metodos.md) aprenderás a definir y llamar esos **métodos**, con los valores que reciben y devuelven.
