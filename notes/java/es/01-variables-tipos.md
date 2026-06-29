# Variables y tipos

> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

## Tipos primitivos

Java tiene 8 tipos primitivos. Almacenan valores directamente, no referencias a objetos.

| Tipo      | Tamaño  | Qué almacena                   | Ejemplo                  |
| --------- | ------- | ------------------------------ | ------------------------ |
| `int`     | 32 bit  | Números enteros (−2B a 2B)     | `int age = 31;`          |
| `long`    | 64 bit  | Enteros grandes                | `long id = 1234567890L;` |
| `double`  | 64 bit  | Números decimales              | `double price = 19.99;`  |
| `float`   | 32 bit  | Decimal, menos precisión       | `float tax = 0.21f;`     |
| `boolean` | 1 bit   | `true` o `false`               | `boolean active = true;` |
| `char`    | 16 bit  | Un carácter                    | `char grade = 'A';`      |
| `byte`    | 8 bit   | Números pequeños (−128 a 127)  | `byte level = 5;`        |
| `short`   | 16 bit  | Números medianos               | `short year = 2025;`     |

En la práctica usas `int`, `long`, `double` y `boolean` para casi todo. `float` y `byte` raramente se necesitan.

### Tipos por categoría

**Números enteros** — para contar, IDs, edades, cantidades:
- `int` — tu número entero de uso diario. Úsalo por defecto.
- `long` — cuando `int` no es suficientemente grande. Los IDs de base de datos suelen ser `Long` porque crecen mucho. Fíjate en el sufijo `L`: `1234567890L` — sin él Java trata el número como `int` y puede rechazarlo.
- `byte` y `short` — raramente usados en la práctica. Los verás en código antiguo o al trabajar con datos binarios.

**Números decimales** — para precios, porcentajes, tasas:
- `double` — la opción por defecto para decimales. Mayor precisión.
- `float` — la mitad de precisión que `double`. Úsalo solo si la memoria es crítica (casi nunca en desarrollo web). Fíjate en el sufijo `f`: `0.21f`.

> **Dinero en Spring Boot:** nunca uses `double` o `float` para valores financieros. Usa `BigDecimal` — evita los errores de redondeo que producen los tipos de punto flotante. `double` no puede representar 0.1 exactamente en binario — después de pocas operaciones obtienes `0.09999999...`. `BigDecimal` hace aritmética exacta.

**Boolean** — para indicadores y condiciones:
- `boolean` — solo almacena `true` o `false`. Usado para `isActive`, `hasRole`, `isEmpty`.

**Carácter** — para caracteres individuales:
- `char` — un carácter, entre comillas simples: `'A'`. Raramente usado en desarrollo web.

---

## Variables

```java
int age = 31;           // declarar y asignar
int count;              // solo declarar (debes asignar antes de usar)
count = 0;              // asignar después

final int MAX = 100;    // constante — no se puede reasignar (como const en JS)
```

`final` es el equivalente en Java del `const` de JavaScript.

---

## Conversión de tipos (casting)

### Widening (automático)

Tipo más pequeño → tipo más grande. Sin pérdida de datos. Java lo hace automáticamente:

```java
int x = 42;
long y = x;        // int → long — automático
double z = x;      // int → double — automático
```

### Narrowing (manual)

Tipo más grande → tipo más pequeño. Debes indicarle a Java explícitamente que aceptas la posible pérdida de datos. La sintaxis es `(tipoDestino) valor` — pones el tipo destino entre paréntesis antes del valor:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — la parte decimal se descarta, no se redondea

long bigNumber = 1234567890123L;
int smaller = (int) bigNumber;  // puede desbordarse si el número es demasiado grande para int
```

El `(int)` antes de la variable es el cast. Java no lo hace automáticamente porque podrías perder datos — tienes que optar por ello. Si el número no cabe, Java no lanza un error — simplemente hace un wraparound silencioso, razón por la que el narrowing puede producir resultados inesperados.

---

## Clases wrapper — objetos para primitivos

Cada tipo primitivo tiene una clase wrapper correspondiente. Las usas cuando un método requiere un **objeto** en lugar de un primitivo.

**El caso más común:** las colecciones de Java (`List`, `Map`, `Set`) solo funcionan con objetos, no con primitivos. Así que `List<int>` no compila — usas `List<Integer>` en su lugar.

**Otro caso:** las clases wrapper pueden ser `null`. Un `int` primitivo no puede ser null, pero `Integer` sí. En Spring Boot, los IDs de base de datos suelen tipificarse como `Long` (no `long`) porque Hibernate los establece a `null` hasta que la entidad se guarda por primera vez.

### Cuándo usar cada uno — la regla práctica

Usa la **clase wrapper** cuando `null` es un valor con significado.
Usa el **primitivo** cuando el valor siempre está presente.

```java
// Long (wrapper) — porque el id no existe hasta que JPA guarda la entidad
@Id
@GeneratedValue
private Long id;

// long (primitivo) — porque la expiración es siempre 86400000, nunca null
@Value("${app.jwt.expiration}")
private long expiration;
```

En la práctica: IDs de entidades JPA → siempre `Long`. Valores de configuración, contadores, cálculos → siempre `long`.

| Primitivo | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |

### Autoboxing y unboxing

Normalmente, convertir entre `int` e `Integer` requeriría una llamada explícita como `Integer.valueOf(42)`. Java hace esta conversión automáticamente cuando lo necesita — esto se llama **autoboxing** (primitivo → wrapper) y **unboxing** (wrapper → primitivo).

En la práctica, casi nunca piensas en ello. Java lo gestiona:

```java
Integer a = 42;           // autoboxing — Java convierte int 42 a Integer automáticamente
int b = a;                // unboxing — Integer de vuelta a int automáticamente

List<Integer> ids = new ArrayList<>();
ids.add(42);              // autoboxing — pasas un int, Java lo envuelve como Integer
int first = ids.get(0);   // unboxing — Java lo desenvuelve de vuelta a int
```

### Métodos útiles de wrapper

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

El método `.formatted()` reemplaza marcadores de posición en el string. `%s` significa "aquí va un string", `%d` significa "aquí va un entero". Es la misma idea que los template literals de JavaScript — `` `Hello, ${name}` `` — pero con `%s` como marcador. Puedes encadenarlo directamente en el literal de string.

```java
"User %s has %d points".formatted("Victor", 100);  // "User Victor has 100 points"
```

### Métodos comunes

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

`StringBuilder` resuelve esto. Es un buffer mutable que modificas in situ. Cuando terminas de construir el string, llamas a `.toString()` para obtener el resultado final.

|                 | ¿Inmutable? | ¿Thread-safe? | Cuándo usar                              |
| --------------- | ----------- | ------------- | ---------------------------------------- |
| `String`        | Sí          | Sí            | La mayoría de casos — leer, pasar, comparar |
| `StringBuilder` | No          | No            | Construir strings en un bucle (rápido)   |
| `StringBuffer`  | No          | Sí            | Construcción de strings multi-hilo (raro) |

```java
// Ineficiente — crea un nuevo objeto String en cada iteración
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;
}

// Eficiente — muta el mismo objeto
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

En Spring Boot trabajarás principalmente con `String`. Usa `StringBuilder` cuando construyas un string largo uniendo muchas piezas — por ejemplo, generando una lista separada por comas o ensamblando un fragmento SQL en un método de servicio.

---

## `var` — inferencia de tipo local (Java 10+)

Normalmente escribes el tipo en el lado izquierdo: `List<Employee> employees = new ArrayList<>()`. Con `var`, Java infiere el tipo del lado derecho — no tienes que escribirlo:

```java
var name = "Victor";                    // Java infiere: String
var age = 31;                           // Java infiere: int
var employees = new ArrayList<Employee>();  // Java infiere: ArrayList<Employee>
```

Esto **no** hace que Java sea dinámico como el `var` de JavaScript. El tipo sigue siendo fijo en tiempo de compilación — Java simplemente lo deduce para que no tengas que escribirlo dos veces.

Solo funciona para variables locales (dentro de métodos). No se puede usar para campos, parámetros de métodos ni tipos de retorno.

Útil cuando el tipo es largo y obvio por el lado derecho: `var employees = employeeRepository.findAll()` es más limpio que `List<Employee> employees = employeeRepository.findAll()`.
