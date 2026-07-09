# Variables y tipos

> 📖 [Baeldung — Java primitives](https://www.baeldung.com/java-primitives) → leer: "Overview" y "Primitive Data Types"
> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

## Tipos primitivos

En Java hay dos formas de almacenar datos en memoria. La primera es guardar el **valor directamente** — el número 42 o el booleano `true` se guardan en el sitio exacto donde está la variable. La segunda es guardar una **referencia** — en lugar del dato en sí, la variable guarda una dirección de memoria que apunta a donde está el objeto real, como un enlace. Los **tipos primitivos** usan la primera forma: almacenan el valor directamente, sin referencias. Los **objetos** (como `String`, `Employee`, o cualquier clase) usan la segunda.

Java tiene 8 tipos primitivos. Cada uno ocupa un tamaño fijo y tiene un rango de valores posibles.

Los rangos son útiles para saber cuándo necesitas cambiar de tipo: si un contador puede superar los 2.147 millones, esa es la señal de que `int` se queda corto y debes usar `long`.

| Tipo      | Tamaño  | Rango aproximado                         | Ejemplo                  |
| --------- | ------- | ---------------------------------------- | ------------------------ |
| `byte`    | 8 bits  | ±1.27 × 10²                              | `byte level = 5;`        |
| `short`   | 16 bits | ±3.27 × 10⁴                              | `short year = 2025;`     |
| `int`     | 32 bits | ±2.14 × 10⁹                              | `int age = 31;`          |
| `long`    | 64 bits | ±9.2 × 10¹⁸                              | `long id = 1234567890L;` |
| `float`   | 32 bits | ±3.4 × 10³⁸ (~7 cifras significativas)   | `float tax = 0.21f;`     |
| `double`  | 64 bits | ±1.7 × 10³⁰⁸ (~15 cifras significativas) | `double price = 19.99;`  |
| `boolean` | 1 bit   | `true` o `false`                         | `boolean active = true;` |
| `char`    | 16 bits | Cualquier carácter Unicode (0 a 65,535)  | `char grade = 'A';`      |

Un **carácter Unicode** es cualquier símbolo de cualquier escritura del mundo: letras latinas, chinas, árabes, emojis, signos matemáticos. El estándar Unicode asigna un número único a cada símbolo — `char` almacena ese número, que va del 0 al 65,535 (16 bits). En la práctica, en desarrollo web apenas usarás `char` directamente — los textos completos van en `String`.

En la práctica usas `int`, `long`, `double` y `boolean` para casi todo. `float` y `byte` raramente se necesitan.

### Tipos por categoría

**Números enteros** — para contar, IDs, edades, cantidades:

- `byte` y `short` — son enteros igual que `int` y `long`, solo que con un rango mucho más pequeño. No pueden almacenar decimales. En la práctica los verás en código antiguo o al trabajar con datos binarios.
- `int` — tu número entero de uso diario. Úsalo por defecto.
- `long` — cuando `int` no es suficientemente grande. Los IDs de base de datos suelen ser `Long` porque crecen mucho. Fíjate en el sufijo `L`: `1234567890L` — sin él Java trata el número como `int` y puede rechazarlo.

**Números decimales** — para precios, porcentajes, tasas:

- `float` — la mitad de precisión que `double`: solo ~7 cifras significativas. Si necesitas `3.141592653589793`, un `float` lo almacena como `3.1415927` — pierdes dígitos. Úsalo solo si la memoria es crítica (casi nunca en desarrollo web). Fíjate en el sufijo `f`: `0.21f`.
- `double` — la opción por defecto para decimales. Tiene más precisión: puede representar hasta ~15 cifras significativas. Por ejemplo, `3.141592653589793` cabe bien en un `double`.

> **Dinero en Spring Boot:** nunca uses `double` o `float` para valores financieros. Usa `BigDecimal` — es una clase de Java pura (del paquete `java.math`, no de Spring Boot) que hace aritmética exacta. `double` no puede representar 0.1 exactamente en binario porque los ordenadores expresan los números como sumas de potencias de 2, y el 0.1 decimal no puede escribirse como una suma finita de esas potencias — igual que 1/3 no puede escribirse exactamente en decimal (0.333…). El procesador guarda la aproximación más cercana posible, y ese pequeño error se acumula operación tras operación, hasta que obtienes `0.09999999...` donde esperabas `0.1`. `BigDecimal` evita esto operando con las cifras reales, sin error de representación.

**Boolean** — para indicadores y condiciones:

- `boolean` — solo almacena `true` o `false`. Usado para `isActive`, `hasRole`, `isEmpty`.

**Carácter** — para caracteres individuales:

- `char` — un carácter, entre comillas simples: `'A'`. Raramente usado en desarrollo web.

### Comparando `BigDecimal` — `compareTo()` en vez de `<`, `>` o `equals()`

Imagina que en un servicio necesitas validar que unas horas trabajadas estén entre 0.5 y 24 (exactamente el caso de `TimeEntry.hours` en un timesheet). Si `hours` es `BigDecimal`, escribir `request.getHours() < 24` ni siquiera compila — el error es `bad operand type BigDecimal for binary operator '<'`. La razón es la misma que con las clases wrapper: `<` y `>` solo existen para primitivos, y `BigDecimal` es un objeto.

El instinto siguiente suele ser `.equals()`, pero ahí hay una trampa: `.equals()` en `BigDecimal` compara también la **escala** (cuántos decimales tiene representados internamente el número), no solo el valor matemático. Por eso `new BigDecimal("24.0").equals(new BigDecimal("24"))` devuelve `false` — para Java, "24.0" y "24" son objetos con escalas distintas (una cifra decimal frente a ninguna), aunque matemáticamente sean el mismo número.

`BigDecimal` implementa la interfaz `Comparable<BigDecimal>`, que aporta el método `compareTo(BigDecimal other)`. Este método sí compara el valor matemático real, ignorando la escala, y devuelve un `int`:

- negativo si `this` es menor que `other`
- `0` si son matemáticamente iguales
- positivo si `this` es mayor que `other`

El patrón siempre es el mismo: llamas a `compareTo()`, y comparas ese `int` resultante contra `0` con los operadores normales (`<`, `>`, `==`) — porque ahora sí estás comparando dos primitivos `int`, no dos objetos `BigDecimal`.

```java
BigDecimal hours = request.getHours();

if (hours.compareTo(new BigDecimal("0.5")) < 0 || hours.compareTo(new BigDecimal("24")) > 0) {
    throw new RuntimeException("Hours must be between 0.5 and 24");
}
```

Léelo así: "si `hours` comparado con 0.5 da negativo (es decir, `hours` es menor que 0.5) O `hours` comparado con 24 da positivo (`hours` es mayor que 24), lanza la excepción".

> **`compareTo() == 0` para "igual", nunca `equals()`.** Si alguna vez necesitas comprobar igualdad de valor entre dos `BigDecimal` (por ejemplo, "¿el total facturado es exactamente 100?"), usa `total.compareTo(new BigDecimal("100")) == 0`, no `total.equals(new BigDecimal("100"))` — porque si `total` llegó como `"100.00"` (con dos decimales, algo habitual si viene de una columna `DECIMAL(10,2)` de la base de datos), `.equals()` devolvería `false` aunque el valor sea idéntico.

---

## Variables

Una variable es un espacio con nombre en memoria donde guardas un dato. En Java siempre tienes que declarar el tipo antes del nombre — el compilador necesita saber qué tipo de dato va a entrar ahí. Puedes declarar y asignar en la misma línea, o declarar primero y asignar después:

```java
int age = 31;           // declarar y asignar en la misma línea
int count;              // solo declarar (debes asignar antes de usar — el compilador lo exige)
count = 0;              // asignar después

final int MAX = 100;    // constante — no se puede reasignar (como const en JS)
```

`final` es el equivalente en Java del `const` de JavaScript.

---

## Conversión de tipos (casting)

### Widening (automático)

Cuando conviertes un tipo más pequeño a uno más grande, no hay pérdida de datos — Java lo hace solo, sin que tengas que escribir nada:

```java
int x = 42;
long y = x;        // int → long — automático
double z = x;      // int → double — automático
```

### Narrowing (manual)

Cuando conviertes un tipo más grande a uno más pequeño, puede haber pérdida de datos — Java te obliga a indicarlo explícitamente escribiendo el tipo destino entre paréntesis antes del valor:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — la parte decimal se descarta, no se redondea

long bigNumber = 1234567890123L;
int smaller = (int) bigNumber;  // puede desbordarse si el número es demasiado grande para int
```

El `(int)` antes de la variable es el cast. Java no lo hace automáticamente porque podrías perder datos — tienes que escribirlo explícitamente para dejar claro que aceptas esa posible pérdida. La pérdida ocurre concretamente cuando el número más grande no cabe en el tipo más pequeño: si el valor supera el rango del tipo destino, se produce un wraparound silencioso (descrito abajo) en lugar de un error.

> **Wraparound silencioso:** si el número no cabe en el tipo destino, Java no lanza un error — simplemente "da la vuelta". Imagina un cuentakilómetros que llega a 999,999 y vuelve a 000,000: exactamente eso pasa con los enteros. Si el valor máximo de `int` es 2,147,483,647 y le sumas 1, obtienes −2,147,483,648. Por eso el narrowing puede producir resultados inesperados y silenciosos.

---

## Clases wrapper — objetos para primitivos

Cada tipo primitivo tiene una clase wrapper correspondiente. Las usas cuando un método requiere un **objeto** en lugar de un primitivo.

**El caso más común:** las colecciones de Java (`List`, `Map`, `Set`) solo funcionan con objetos, no con primitivos. `List<int>` no compila — el compilador da un error de tipo: `Type argument int is not within bounds of type-variable E`. Usas `List<Integer>` en su lugar. Las colecciones (`List`, `Map`, `Set`) se explican en detalle en [07-collections.md](07-collections.md) — de momento quédate con que son las estructuras de datos principales de Java y todas exigen tipos objeto, no primitivos.

**Otro caso:** las clases wrapper pueden ser `null`. Un `int` primitivo no puede ser null, pero `Integer` sí. En Spring Boot, los IDs de base de datos suelen tipificarse como `Long` (no `long`) porque Hibernate los establece a `null` hasta que la entidad se guarda por primera vez.

### Cuándo usar cada uno — la regla práctica

Usa el **wrapper** en dos situaciones: (1) cuando `null` es un valor con significado — un ID de entidad JPA es `null` hasta que se guarda por primera vez, así que el campo va como `Long`, no como `long`; (2) cuando usas colecciones, porque `List<int>` no existe en Java y debes escribir `List<Integer>`. En cualquier otro caso, usa el **primitivo** — el valor siempre está presente y nunca puede ser null.

```java
// Long (wrapper) — porque el id no existe hasta que JPA guarda la entidad
@Id
@GeneratedValue
private Long id;

// long (primitivo) — porque la expiración es siempre 86400000, nunca null
@Value("${app.jwt.expiration}")
private long expiration;
```

| Primitivo | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |

### Autoboxing y unboxing

El autoboxing ocurre cada vez que añades un `int` a un `List<Integer>` o asignas un `int` a una variable `Integer` — situaciones que aparecen constantemente en el código real. Antes de Java 5, el compilador rechazaba eso y tenías que hacer la conversión a mano: `list.add(Integer.valueOf(42))`. Con Java 5 en adelante, Java hace esa conversión automáticamente. Esto se llama **autoboxing** (de primitivo a wrapper) y **unboxing** (de wrapper a primitivo).

En la práctica, casi nunca piensas en ello. Java lo gestiona:

```java
Integer a = 42;           // autoboxing — Java convierte int 42 a Integer automáticamente
int b = a;                // unboxing — Integer de vuelta a int automáticamente

List<Integer> ids = new ArrayList<>();
ids.add(42);              // autoboxing — pasas un int, Java lo envuelve como Integer
int first = ids.get(0);   // unboxing — Java lo desenvuelve de vuelta a int
```

### Métodos útiles de wrapper

Los **métodos estáticos** pertenecen a la clase en sí, no a ningún objeto concreto — por eso los llamas directamente sobre el nombre de la clase (`Integer.parseInt("42")`), sin crear ningún objeto con `new`. Se explican en detalle en [03-methods.md](03-methods.md).

Estos métodos estáticos son genuinamente útiles en el código del día a día:

```java
Integer.parseInt("42");   // convierte un String a int — muy común al leer inputs de formulario o parámetros de URL
String.valueOf(42);       // convierte int a String
Integer.MAX_VALUE;        // 2147483647 — el mayor valor int posible
Integer.MIN_VALUE;        // -2147483648
```

---

## String

`String` no es un primitivo — es una clase. Pero Java lo trata como un primitivo en muchos aspectos (puedes asignar con `=`, no necesitas `new`).

```java
String name = "Victor";
String greeting = "Hello, " + name;                   // concatenación con +
String greeting2 = "Hello, %s".formatted(name);       // sustitución de plantilla — Java 15+
```

El método `.formatted()` reemplaza marcadores de posición en el string. `%s` significa "aquí va un string", `%d` significa "aquí va un entero". Es la misma idea que los template literals de JavaScript — `` `Hello, ${name}` `` — pero con marcadores posicionales. El orden importa: los valores se asignan de izquierda a derecha según aparecen en el string.

```java
"User %s has %d points".formatted("Victor", 100);  // "User Victor has 100 points"
"User %s has %d points".formatted(100, "Victor");  // Error — 100 no es un String para %s
```

Para decimales usa `%f`. Puedes limitar el número de cifras con `.Nf` (N = cifras decimales): `"El precio es %.2f euros".formatted(19.99)` → `"El precio es 19.99 euros"`.

### Métodos comunes de String

```java
name.length()                     // 6 — cuántos caracteres
name.toUpperCase()                // "VICTOR" — todo en mayúsculas
name.toLowerCase()                // "victor" — todo en minúsculas
name.contains("ict")              // true — ¿contiene el string esta secuencia?
name.startsWith("Vi")             // true — ¿empieza por esto?
name.replace("Victor", "World")   // "World" — reemplaza todas las ocurrencias de una subcadena
name.trim()                       // elimina espacios al inicio y al final — útil para limpiar input del usuario
name.isEmpty()                    // false — true solo si el string es exactamente ""
name.isBlank()                    // false — true si está vacío O contiene solo espacios
name.substring(0, 3)              // "Vic" — caracteres del índice 0 al 2 (el índice final se excluye)
name.split(",")                   // divide por coma — devuelve String[]
name.equals("Victor")             // true — usa siempre esto para comparar contenido (ver abajo)
name.equalsIgnoreCase("victor")   // true — igual pero ignora mayúsculas/minúsculas
```

### Comparación de Strings — usa siempre `equals()`

En Java, `==` compara **direcciones de memoria** (referencias), no el contenido. Dos variables de tipo String con el mismo texto pueden estar almacenadas en ubicaciones de memoria distintas, por lo que `==` puede devolver `false` aunque el contenido parezca idéntico.

`.equals()` siempre compara los caracteres reales — eso es lo que casi siempre quieres:

```java
String a = "hello";
String b = "hello";

a == b        // poco fiable — compara direcciones de memoria, no contenido
a.equals(b)   // true — usa siempre esto para comparar Strings
```

> **¿Por qué existe `==` para Strings?** Para los objetos (incluyendo String), `==` comprueba si dos variables apuntan al **mismo objeto en memoria** — no solo al mismo valor. Esto importa en algunos casos (por ejemplo, comprobar si dos entradas de una lista son literalmente el mismo objeto), pero para Strings casi nunca quieres eso.

### `String`, `StringBuilder`, `StringBuffer`

El problema: `String` es **inmutable** — una vez creado, no puede modificarse. Cada vez que haces `str += something`, Java no modifica el string original. Crea un nuevo objeto `String` con el contenido combinado. En un bucle de 1000 iteraciones, creas 1000 objetos — lento y costoso.

`StringBuilder` usa un **buffer** para resolver esto — un espacio en memoria donde va acumulando los trozos del string mientras los construyes, como una pizarra donde escribes trozo a trozo hasta tener el resultado completo. Lo modificas en el sitio sin crear objetos nuevos, y cuando terminas llamas a `.toString()` para obtener el string definitivo.

El concepto de **thread-safe** aparece aquí porque `StringBuilder` no lo es — y en Spring Boot esto es relevante porque cada petición HTTP llega en un hilo distinto. Si declararas un `StringBuilder` como campo compartido de un bean de Spring (que es un singleton), varios hilos podrían escribir en él a la vez y corromper el resultado. Por ejemplo:

```java
// MAL — campo compartido entre todos los hilos (nunca hagas esto con StringBuilder)
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

> **¿Qué significa thread-safe?** Un **hilo** (thread) es una tarea que corre en paralelo con otras dentro del mismo programa. En una API REST, Spring Boot asigna un hilo distinto a cada petición HTTP que llega — así puede atender varias a la vez sin esperar a que termine la primera. **Thread-safe** significa que varios hilos pueden usar el mismo objeto simultáneamente sin que uno corrompa el trabajo del otro. `String` y `StringBuffer` son thread-safe; `StringBuilder` no. En la práctica, el riesgo no existe si creas el `StringBuilder` dentro de un método local — ese objeto es tuyo y ningún otro hilo lo toca.

|                 | ¿Inmutable? | ¿Thread-safe? | Cuándo usar                                 |
| --------------- | ----------- | ------------- | ------------------------------------------- |
| `String`        | Sí          | Sí            | La mayoría de casos — leer, pasar, comparar |
| `StringBuilder` | No          | No            | Construir strings en un bucle (rápido)      |
| `StringBuffer`  | No          | Sí            | Construcción de strings multi-hilo (raro)   |

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

> **¿Por qué `.append()` y no `+=`?** Porque `StringBuilder` es mutable — `.append()` modifica el objeto existente sin crear nada nuevo. `+=` sobre un `String` crea un objeto nuevo cada vez (por eso es lento). `StringBuilder` no tiene el operador `+=` sobrecargado, así que expone su propio método `.append()` para dejar claro que está mutando el objeto.

En Spring Boot trabajarás principalmente con `String`. Usa `StringBuilder` cuando construyas un string largo uniendo muchas piezas — por ejemplo, generando una lista separada por comas o ensamblando un fragmento SQL en un método de un servicio.

---

## `var` — inferencia de tipo local (Java 10+)

Normalmente escribes el tipo en el lado izquierdo: `List<Employee> employees = new ArrayList<>()`. Con `var`, Java infiere el tipo del lado derecho — no tienes que escribirlo:

```java
var name = "Victor";                        // Java infiere: String
var age = 31;                               // Java infiere: int
var employees = new ArrayList<Employee>();  // Java infiere: ArrayList<Employee>
```

Esto **no** hace que Java sea dinámico como el `var` de JavaScript. En JavaScript, una variable puede cambiar de tipo mientras el programa corre (`var x = 1; x = "hola"` funciona sin problemas). En Java eso no es posible.

Para entender por qué, necesitas dos conceptos: **compile time** (tiempo de compilación) es cuando Java traduce tu código fuente a bytecode — antes de que el programa se ejecute. **Runtime** (tiempo de ejecución) es cuando el programa ya está corriendo. Con `var`, Java deduce el tipo durante la compilación: ve `"Victor"` en el lado derecho y concluye que el tipo es `String`. Ese tipo queda grabado en el bytecode. No puede cambiar nunca — es igual de fijo que si hubieras escrito `String name = "Victor"` tú mismo.

Solo funciona para variables locales (dentro de métodos). No se puede usar para campos, parámetros de métodos ni tipos de retorno.

Útil cuando el tipo es largo y obvio por el lado derecho: `var employees = employeeRepository.findAll()` es más limpio que `List<Employee> employees = employeeRepository.findAll()`.
