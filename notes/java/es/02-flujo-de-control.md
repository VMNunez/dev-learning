# Flujo de control

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → leer: "If-Else Statement", "Switch Statement" y "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

Las sentencias de control de flujo deciden qué código se ejecuta y cuántas veces. Java usa las mismas estructuras que JavaScript — la sintaxis es casi idéntica, así que la mayoría te resultará familiar.

---

## if / else

Ejecuta el bloque cuya condición sea verdadera y omite los demás. Si escribes varios `else if`, Java los evalúa de arriba a abajo y ejecuta el primero que se cumpla. Si ninguna condición se cumple y hay un `else`, ese bloque se ejecuta como opción por defecto.

```java
if (age >= 18) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teenager");
} else {
    System.out.println("Child");
}
```

### Operador ternario

Es un atajo de una línea para un `if/else` simple cuando solo necesitas elegir un valor. La misma sintaxis que en JavaScript:

```java
String label = age >= 18 ? "Adult" : "Minor";
// condición ? valorSiTrue : valorSiFalse
```

Úsalo solo cuando ambos valores sean cortos y la condición sea fácil de entender de un vistazo. Si la línea se vuelve complicada de leer, usa un `if/else` normal.

---

## switch

Usa `switch` cuando tienes muchos posibles valores para una variable. Una cadena larga de `if/else if` para cada valor se vuelve difícil de leer — `switch` da a cada valor su propio caso y el código queda más claro.

### switch clásico (sentencia)

La forma clásica ejecuta el código del caso que coincide. Debes escribir `break` al final de cada caso — sin él, la ejecución cae al caso siguiente y ejecuta ese código también, aunque no coincida. A esto se le llama **fall-through** (literalmente "caída hacia abajo"): el control "cae" de un caso al siguiente sin detenerse. Este es un bug común en código Java.

```java
switch (day) {
    case "MONDAY":
    case "TUESDAY":
        System.out.println("Weekday");
        break;        // sin break, la ejecución cae al caso siguiente
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Unknown");
}
```

Dos casos sin código entre ellos (como `MONDAY` y `TUESDAY`) es fall-through intencional — un patrón habitual para manejar varios valores del mismo modo. El bloque `default` no es obligatorio, pero es buena práctica incluirlo siempre: actúa como red de seguridad para los valores inesperados y evita bugs silenciosos cuando algún valor no coincide con ningún caso.

### Switch expression (Java 14+) — usa esta forma

El switch clásico era una **sentencia** — ejecutaba código pero no devolvía nada. El **switch expression** devuelve un valor directamente. Puedes asignarlo a una variable.

También elimina el fall-through: cada rama usa `->` y ejecuta exactamente una cosa. No se necesita `break`. El compilador también avisa si te olvidas un caso.

```java
String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
```

Usa la forma de switch expression para todo el código nuevo — es más limpia, segura y fácil de leer.

---

## Bucles for

### for clásico

La forma más explícita — controlas tú mismo el inicio, el final y el paso. Tres partes, separadas por puntos y coma: `(inicio; condición; paso)`. Úsalo cuando necesitas el número de índice.

> **¿Qué es el "paso"?** Es cuánto avanza el contador en cada iteración. `i++` es el paso más habitual: incrementa `i` en 1. Pero podrías usar `i += 2` para ir de 2 en 2, o `i--` para contar hacia atrás.

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);   // imprime: 0 1 2 3 4
}
```

- `int i = 0` — empieza en el índice 0
- `i < 5` — continúa mientras esto sea verdadero
- `i++` — incrementa i en 1 después de cada iteración

### Enhanced for (for-each) — úsalo para colecciones y arrays

El `for` clásico con índice tiene dos problemas frecuentes: es más largo de escribir, y es fácil cometer errores de rango — por ejemplo, poner `i <= names.length` en vez de `i < names.length` y salirse del array por uno (a esto se le llama error _off-by-one_, que viene a ser "pasarse por uno"). El `for` mejorado elimina el índice completamente y te da cada elemento directamente. Piensa en él como la versión Java del `for...of` de JavaScript.

Sintaxis: `for (Tipo variable : colección)` — se lee como "para cada elemento de este tipo en esta colección".

```java
String[] names = {"Ana", "Luis", "Maria"};
for (String name : names) {
    System.out.println(name);   // Ana, Luis, Maria
}

List<Employee> employees = getEmployees();
for (Employee emp : employees) {
    System.out.println(emp.getName());
}
```

Usa el for mejorado siempre que solo necesites los elementos y no el índice. En Spring Boot, esto es lo que escribirás la mayor parte del tiempo — aunque los streams (cubiertos en `09-streams-lambdas.md`) son incluso más concisos para transformar colecciones.

---

## while y do-while

Usa `while` y `do-while` cuando no sabes de antemano cuántas iteraciones necesitas. Un bucle `for` es mejor cuando conoces el rango.

**`while`** comprueba la condición primero. Si la condición es falsa desde el inicio, el cuerpo nunca se ejecuta.

**`do-while`** ejecuta el cuerpo primero, luego comprueba la condición. Esto garantiza al menos una ejecución — útil cuando debes hacer algo antes de poder comprobar si continuar.

```java
// while — comprueba primero, puede no ejecutarse nunca
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while — se ejecuta al menos una vez, luego comprueba
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);
```

En Spring Boot usarás principalmente bucles for-each y streams. `while` aparece más en algoritmos y al leer flujos de datos (como parsear ficheros línea a línea).

---

## break y continue

Ambas palabras clave cambian el flujo dentro de un bucle. Son válidas en `for`, `while` y `do-while` — los tres tipos de bucle que has visto. En la práctica las verás más en bucles `for` y `while`. En `switch`, `break` también se usa para evitar el fall-through (como has visto arriba), pero `continue` no aplica ahí.

- **`break`** sale del bucle entero inmediatamente — no ocurren más iteraciones después de él.
- **`continue`** salta el resto de la iteración actual y pasa directamente a la siguiente.

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) break;        // detiene el bucle por completo cuando i llega a 5
    if (i % 2 == 0) continue; // salta los números pares (va a la siguiente iteración)
    System.out.println(i);    // imprime: 1, 3
}
```

Piensa en `break` como la salida de emergencia y en `continue` como el botón de saltar.

> **`break` en servicios de Spring Boot:** en la práctica, dentro de los métodos de un servicio es más habitual usar `return` para salir antes que usar `break`. Si encuentras la condición que buscabas dentro de un bucle y quieres detener todo el trabajo del método, `return` suele quedar más limpio.

---

## Comprobaciones de null

> **¿Qué es un error en runtime?** Es un error que no ocurre al compilar el código, sino cuando el programa ya está corriendo y llega a esa línea. El compilador no lo detecta de antemano — simplemente falla en el momento en que se ejecuta. (La explicación completa de compile time vs runtime está en la sección `var` de [01-variables-tipos.md](01-variables-tipos.md).)

`NullPointerException` es el error en runtime más común en Java. Ocurre cuando llamas a un método sobre una variable que es `null` — Java no puede encontrar el objeto en el que ejecutar el método. Solo los **objetos** tienen métodos: `String`, wrappers (`Integer`, `Long`…), y cualquier clase que definas. Los **primitivos** (`int`, `long`, `double`…) no son objetos y no tienen métodos — no pueden ser `null` y no puedes llamar `.algo()` sobre ellos. Por eso nunca verás una `NullPointerException` en una variable `int`. En [01-variables-tipos.md](01-variables-tipos.md) ya tienes los métodos útiles de los wrappers y de `String` — esas son las clases sobre las que sí puedes llamar métodos. La solución es simple: comprueba siempre si es `null` antes de llamar métodos sobre algo que podría no existir.

```java
// Riesgo de NullPointerException
String name = employee.getName();
System.out.println(name.toUpperCase());  // falla si name es null

// Comprobación segura
if (name != null) {
    System.out.println(name.toUpperCase());
}

// O usando Optional — el enfoque moderno (cubierto en 10-generics.md)
// No te preocupes si aún no entiendes esta sintaxis — lo verás en detalle más adelante
Optional.ofNullable(name)
    .ifPresent(n -> System.out.println(n.toUpperCase()));
```

En Spring Boot, muchos métodos devuelven `Optional<T>` en lugar de un objeto crudo que podría ser null. `repository.findById(id)` es un buen ejemplo — devuelve `Optional<Employee>` para que estés obligado a manejar el caso "no encontrado". Este patrón se cubre en detalle en `10-generics.md`.
