# Preguntas de Entrevista — Java

## Variables y tipos

**¿Cuál es la diferencia entre un tipo primitivo y un objeto en Java?**
Los primitivos (`int`, `boolean`, `double`) almacenan el valor directamente en memoria y son más rápidos. Los objetos almacenan una referencia a los datos en el heap. En Java, cada primitivo tiene su clase envolvente (`Integer`, `Boolean`, `Double`), que es necesaria para trabajar con colecciones — no puedes tener `List<int>`, solo `List<Integer>`.

**¿Qué es el autoboxing?**
El autoboxing es la conversión automática entre un primitivo y su clase envolvente. Java lo hace por ti — cuando escribes `List<Integer> list = new ArrayList<>(); list.add(5);`, el `5` se convierte automáticamente en `Integer.valueOf(5)`. Lo inverso (unboxing) ocurre cuando lees el valor.

**¿Qué pasa si comparas dos objetos `Integer` con `==`?**
Depende del valor. Java cachea objetos `Integer` de -128 a 127, así que `Integer a = 100; Integer b = 100; a == b` es `true` porque son el mismo objeto cacheado. Pero `Integer a = 200; Integer b = 200; a == b` es `false` — son objetos diferentes. Siempre usa `.equals()` para comparar valores Integer.

**¿Qué es `var` en Java?**
`var` es inferencia de tipo para variables locales, introducida en Java 10. El compilador deduce el tipo del lado derecho: `var name = "Victor"` es igual que `String name = "Victor"`. Solo funciona para variables locales — no para parámetros ni tipos de retorno. No hace Java dinámico; el tipo sigue siendo fijo en tiempo de compilación.

---

## Strings

**¿Por qué no se puede usar `==` para comparar Strings en Java?**
`==` comprueba si dos variables apuntan al mismo objeto en memoria. Dos Strings con el mismo contenido pueden ser objetos distintos, así que `==` puede devolver `false` aunque el contenido sea igual. Usa siempre `.equals()` o `.equalsIgnoreCase()`. Es el error más común de los principiantes en Java — los entrevistadores lo preguntan específicamente porque atrapa a quienes vienen de JavaScript, donde `==` sí compara el contenido.

**¿Qué es la inmutabilidad de String y por qué importa?**
Un String no puede modificarse una vez creado. Operaciones como `toUpperCase()` o `+` no cambian el original — devuelven un nuevo objeto String. Esto significa que los Strings son seguros para compartir entre hilos y la JVM puede cachearlos en el String pool. La consecuencia práctica: `String result = ""; for (...) result += name;` crea un nuevo objeto en cada iteración — por eso se usa `StringBuilder` dentro de los bucles.

**¿Cuándo deberías usar `StringBuilder` en lugar de la concatenación con `+`?**
Cuando construyes un String dentro de un bucle. Cada `+` asigna un nuevo objeto — en un bucle de 1000 iteraciones, eso son 1000 objetos String. `StringBuilder` añade a un único buffer: `sb.append(name).append(", ")`, y luego `sb.toString()` una sola vez al final. Para concatenaciones de una línea como `"Hola " + name`, el compilador lo optimiza automáticamente — solo necesitas `StringBuilder` explícitamente dentro de bucles.

---

## Control de flujo

**¿Cuál es la diferencia entre `==` y `.equals()` en Java?**
`==` compara referencias — comprueba si dos variables apuntan al mismo objeto en memoria. `.equals()` compara contenido — comprueba si dos objetos tienen el mismo valor. Para Strings, siempre usa `.equals()`. Para enums y primitivos, `==` es correcto.

**¿Qué es la expresión switch introducida en Java 14?**
El nuevo `switch` usa `->` en lugar de `case:` y `break`, y puede devolver un valor directamente. También hace que el compilador avise si te falta un caso. Ejemplo: `String result = switch (status) { case ACTIVE -> "Activo"; case INACTIVE -> "Desactivado"; };`. Este es el patrón que usas con enums en Spring Boot.

---

## Métodos

**¿Qué es la sobrecarga de métodos?**
La sobrecarga significa tener dos o más métodos con el mismo nombre pero parámetros distintos. El compilador elige el correcto según los argumentos que pasas. Ejemplo: `void log(String msg)` y `void log(String msg, int level)` — ambos son válidos en la misma clase.

**¿Cuál es la diferencia entre métodos `static` y de instancia?**
Un método `static` pertenece a la clase y puede llamarse sin crear un objeto: `Math.max(a, b)`. Un método de instancia pertenece a un objeto y necesita una instancia para ejecutarse. En Spring Boot, los métodos de servicio son de instancia llamados mediante inyección de dependencias — nunca se llaman de forma estática.

---

## Modificadores de acceso

**¿Cuáles son los cuatro modificadores de acceso en Java?**
`private` — solo accesible dentro de la misma clase. Package-private (sin palabra clave) — accesible dentro del mismo paquete. `protected` — accesible dentro del mismo paquete y en subclases. `public` — accesible desde cualquier lugar. En Spring Boot: los campos son siempre `private`, las clases de servicio y repositorio son `public`, y los métodos auxiliares internos son `private`.

**¿Por qué hacer los campos privados si vas a escribir getters públicos de todas formas?**
Porque el getter te da control sobre el acceso de lectura, y el setter te da control sobre el acceso de escritura. Si el campo fuera `public`, cualquier código podría cambiarlo directamente — saltándose la validación. Con `private` y un setter puedes añadir reglas: `if (age < 0) throw new IllegalArgumentException(...)`. JPA también necesita los getters para mapear la entidad a JSON. La encapsulación no consiste en ocultar — consiste en tener control.

---

## POO y clases

**¿Qué es la encapsulación y por qué importa?**
La encapsulación significa ocultar el estado interno de un objeto y exponerlo solo a través de métodos. Los campos son `private`; el acceso se hace mediante `getters` y `setters`. Esto te permite cambiar la lógica interna sin romper el código que usa la clase. Cada entidad JPA en Spring Boot sigue este patrón.

**¿Qué significa `final` en Java?**
Significa que algo no puede cambiarse tras su primera asignación. En un campo: `private final String name` — no puede reasignarse después de que el constructor lo establezca. En un método: no puede sobreescribirse en una subclase. En una clase: no puede extenderse — `String` es `final`. En Spring Boot, `final` en un campo señala inmutabilidad y es la misma idea que `const` en JavaScript.

**¿Qué es un record en Java?**
Un record (Java 16+) es una clase donde todos los campos se definen en el encabezado y Java genera automáticamente el constructor, getters, `equals`, `hashCode` y `toString`. Los records son inmutables — no puedes cambiar los campos después de crearlos. Son perfectos para DTOs: `public record EmployeeDTO(String name, String email) {}`.

**¿Por qué usar un record para un DTO en lugar de una clase normal?**
Una clase normal necesita constructor, getters y `equals`/`hashCode` — mucho código repetitivo para un simple transportador de datos. Un record te da todo eso en una línea. También hace explícita la inmutabilidad — un DTO no debería modificarse después de crearse.

---

## Interfaces y clases abstractas

**¿Cuál es la diferencia entre una interfaz y una clase abstracta?**
Una interfaz es un contrato — define qué debe hacer una clase, no cómo. Una clase abstracta es una implementación parcial — puede tener métodos abstractos (sin cuerpo) y métodos concretos (con cuerpo). Una clase puede implementar múltiples interfaces pero solo extender una clase abstracta. En Spring Boot, los repositorios extienden `JpaRepository` (una interfaz) y Spring genera la implementación automáticamente.

**¿Qué es una interfaz funcional?**
Una interfaz funcional tiene exactamente un método abstracto. Puede usarse con una lambda. Ejemplos comunes: `Predicate<T>` (recibe T, devuelve boolean), `Function<T, R>` (recibe T, devuelve R), `Consumer<T>` (recibe T, no devuelve nada). El Stream API las usa — `filter()` recibe un `Predicate`, `map()` recibe una `Function`.

---

## Herencia y polimorfismo

**¿Qué es el polimorfismo en Java?**
El polimorfismo significa que una referencia puede comportarse de forma diferente según el objeto real al que apunta. Si `Dog` y `Cat` extienden `Animal` y sobreescriben `speak()`, entonces una `List<Animal>` puede contener ambos, y llamar a `speak()` en cada uno da resultados distintos. En Spring Boot, esto ocurre cuando tienes múltiples implementaciones de una interfaz — Spring inyecta la correcta en tiempo de ejecución.

**¿Qué hace `@Override`?**
Le dice al compilador que el método sobreescribe intencionalmente un método de una clase padre o interfaz. Si cometes un error tipográfico en el nombre del método, el compilador da un error en lugar de crear silenciosamente un método nuevo. Usa siempre `@Override` al sobreescribir.

**¿Cuál es la diferencia entre sobreescribir y sobrecargar?**
Sobreescribir reemplaza el método del padre en una subclase — mismo nombre, mismos parámetros, clase distinta. Sobrecargar añade un método con el mismo nombre pero parámetros distintos en la misma clase. Sobreescribir es una decisión en tiempo de ejecución; sobrecargar es una decisión en tiempo de compilación.

---

## Colecciones

**¿Cuál es la diferencia entre `List`, `Set` y `Map`?**
Un `List` es una colección ordenada que permite duplicados. Un `Set` es una colección sin orden y sin duplicados. Un `Map` almacena pares clave-valor — las claves son únicas, los valores pueden repetirse. En Spring Boot: `List<Employee>` para todos los empleados, `Set<String>` para roles únicos, `Map<Long, Employee>` para buscar por ID.

**¿Cuál es la diferencia entre `ArrayList` y `LinkedList`?**
`ArrayList` almacena los elementos en un array continuo — rápido para acceso aleatorio (`get(i)`) pero lento para inserciones en el medio. `LinkedList` almacena cada elemento como un nodo con un puntero al siguiente — rápido para inserciones al principio o en el medio pero lento para acceso aleatorio. En la práctica, usa `ArrayList` para casi todo. `LinkedList` raramente es la elección correcta en Java moderno.

**¿Cuál es la diferencia entre `HashMap`, `LinkedHashMap` y `TreeMap`?**
`HashMap` no garantiza ningún orden — el más rápido para búsquedas. `LinkedHashMap` mantiene el orden de inserción — úsalo cuando el orden importa. `TreeMap` ordena las claves alfabéticamente o por un comparador — úsalo cuando necesitas salida ordenada. En la mayoría del código Spring Boot usas `HashMap` a menos que necesites un orden específico.

**¿Cuándo usarías `getOrDefault()` en un `Map`?**
Cuando no estás seguro de si existe una clave y quieres un valor por defecto en lugar de `null`. Ejemplo: `map.getOrDefault(userId, "Desconocido")`. Esto evita un `NullPointerException` y deja clara la intención.

**¿Cuál es la diferencia entre `Comparable` y `Comparator`?**
`Comparable` lo implementa la propia clase — define el orden de clasificación natural: `class Employee implements Comparable<Employee>` con un método `compareTo()`. `Comparator` es externo — se lo pasas a `sorted()` sin modificar la clase: `Comparator.comparing(Employee::getName)`. Usa `Comparable` para el orden predeterminado. Usa `Comparator` cuando necesitas varias opciones de clasificación o cuando no puedes modificar la clase.

**¿Qué es una `ConcurrentModificationException` y cómo la corriges?**
Ocurre cuando eliminas elementos de una List dentro de un bucle for-each. El iterador rastrea la estructura de la lista y lanza la excepción cuando detecta un cambio estructural. La corrección es `removeIf()`: `employees.removeIf(e -> !e.isActive())` — una línea, seguro y legible. Como alternativa, recoge los elementos a eliminar primero y elimínalos después del bucle.

---

## Excepciones

**¿Cuál es la diferencia entre excepciones checked y unchecked?**
Las excepciones checked extienden `Exception` y deben declararse con `throws` o capturarse — ejemplos: `IOException`, `SQLException`. Las unchecked extienden `RuntimeException` y no necesitan declararse — ejemplos: `NullPointerException`, `IllegalArgumentException`. En Spring Boot casi siempre usas excepciones unchecked y dejas que `@ControllerAdvice` las gestione de forma centralizada.

**¿Cómo gestionas las excepciones globalmente en Spring Boot?**
Con `@ControllerAdvice` y `@ExceptionHandler`. Creas una clase que captura tipos específicos de excepción y devuelve el estado HTTP correcto. Ejemplo: capturar `EmployeeNotFoundException` y devolver una respuesta 404. Esto mantiene los controladores y servicios limpios — solo lanzan la excepción y el handler hace el resto.

**¿Por qué crear una excepción personalizada en lugar de usar `IllegalArgumentException`?**
Una excepción personalizada como `EmployeeNotFoundException` da un nombre claro al error. Al leer el código, sabes inmediatamente qué salió mal sin leer el mensaje. También permite gestionarla por separado en `@ControllerAdvice` — puedes devolver 404 para `EmployeeNotFoundException` y 400 para `IllegalArgumentException` con handlers distintos.

**¿Cómo evitas `NullPointerException` en Java?**
Tres patrones: usa `Optional<T>` en lugar de devolver `null` desde los métodos; usa `Objects.requireNonNull()` al inicio de los métodos para fallar rápido con un mensaje claro; comprueba con `str != null && !str.isEmpty()` antes de usar un String. En Spring Boot, la protección principal es `Optional` en los repositorios y la validación `@NotNull` en los DTOs de petición — cuando los datos llegan al servicio, ya están validados.

---

## Streams y lambdas

**¿Qué es una lambda en Java?**
Una lambda es una función anónima corta. En lugar de escribir una clase anónima completa, escribes la lógica directamente: `employees.stream().filter(e -> e.isActive())`. La parte `e -> e.isActive()` es una lambda — recibe un parámetro y devuelve un boolean.

**¿Qué es el Stream API?**
El Stream API permite procesar colecciones con un pipeline de operaciones. Empiezas con `.stream()`, encadenas operaciones intermedias (`filter`, `map`, `sorted`) y terminas con una operación terminal (`collect`, `count`, `forEach`). Es similar a los métodos de `Array.prototype` en JavaScript — `filter`, `map`, `reduce`.

**¿Cuál es la diferencia entre `map()` y `filter()` en un stream?**
`filter()` conserva los elementos que cumplen una condición — la salida tiene menos o igual número de elementos. `map()` transforma cada elemento en otra cosa — la salida tiene el mismo número de elementos pero de un tipo diferente. Ejemplo: `filter(e -> e.isActive())` da una lista más pequeña; `map(Employee::getName)` da una lista de strings.

**¿Qué hace `collect(Collectors.toList())`?**
Termina el pipeline del stream y recoge todos los resultados en una `List`. Sin una operación terminal, el stream no hace nada — es perezoso. `collect` es la operación terminal más común en Spring Boot porque la mayoría de métodos de servicio devuelven una `List`.

**¿Cuándo usarías un bucle for en lugar de un stream?**
Cuando la lógica es compleja, necesita salir antes (`break`), o modifica estado externo de varias formas. Los streams son mejores cuando el pipeline es lineal y legible. Si necesitas un `try/catch` dentro del bucle o estás construyendo varios resultados distintos a la vez, un bucle for es más claro. La regla: los streams hacen más cortos los pipelines simples; la lógica compleja es más fácil de leer como bucle.

---

## Genéricos

**¿Qué son los genéricos y por qué existen?**
Los genéricos permiten escribir una clase o método que funcione con cualquier tipo manteniendo la seguridad de tipos. Sin genéricos, una `List` almacena `Object` y necesitas hacer cast. Con `List<Employee>`, el compilador conoce el tipo y evita que añadas el tipo incorrecto. Los ves en todas partes en Spring Boot: `JpaRepository<Employee, Long>`, `ResponseEntity<Employee>`, `Optional<Employee>`.

**¿Qué es `Optional<T>` y por qué es mejor que devolver `null`?**
`Optional<T>` es un contenedor que o bien tiene un valor o bien está vacío. Cuando un método devuelve `Optional`, el que lo llama está obligado a gestionar el caso "no encontrado" explícitamente — no puede olvidarse. El patrón más común en Spring Boot: `repository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id))`.

**¿Cuál es la diferencia entre `orElse()` y `orElseGet()`?**
`orElse(value)` siempre evalúa el valor — incluso si el Optional tiene resultado. `orElseGet(() -> value)` solo ejecuta la lambda si el Optional está vacío. Usa `orElseGet` cuando el valor por defecto es costoso de crear (una llamada a base de datos, un objeto nuevo). Usa `orElse` para valores simples como strings.

---

## Enums

**¿Qué es un enum y por qué usarlo en lugar de una constante String?**
Un enum es un tipo con un conjunto fijo de constantes con nombre. Si usas `String` para un rol (`"ADMIN"`, `"EMPLOYEE"`), un error tipográfico compila y falla en silencio. Con `Role.ADMIN`, un error tipográfico es un error de compilación. Los enums también permiten añadir métodos y campos — un enum de Java es mucho más potente que uno de TypeScript.

**¿Cómo se almacena un enum en la base de datos con JPA?**
Con `@Enumerated(EnumType.STRING)` en el campo. Esto almacena el nombre de la constante como string (`"ADMIN"`) en lugar de un número. Nunca uses `EnumType.ORDINAL` — si añades una nueva constante en medio del enum, todos los números cambian y los datos existentes quedan incorrectos.

**¿Cómo iteras todos los valores de un enum?**
Con `EnumName.values()`, que devuelve un array con todas las constantes. Ejemplo: `for (Role r : Role.values()) { ... }`. Es el mismo patrón que `Object.values()` en JavaScript — útil para rellenar un desplegable o una lista de selección.

---

## Fecha y hora

**¿Por qué usar `LocalDate` en lugar del antiguo `java.util.Date`?**
`LocalDate` es inmutable y legible — `date.plusDays(7)` devuelve una nueva fecha sin cambiar la original. La clase `Date` antigua es mutable y confusa (los meses empiezan en 0, los años son relativos a 1900). Spring Data JPA mapea `LocalDate` a una columna SQL `DATE` automáticamente, así que no hay razón para usar la API antigua en código nuevo.

**¿Cuál es la diferencia entre `LocalDate` y `LocalDateTime`?**
`LocalDate` solo tiene fecha — sin horas, minutos ni segundos. `LocalDateTime` tiene ambos. Usa `LocalDate` para fechas de nacimiento, fechas de contratación y plazos. Usa `LocalDateTime` para marcas de tiempo como `createdAt` y `updatedAt` en entidades JPA.

**¿Cómo se establece `createdAt` automáticamente al guardar en Spring Boot?**
Con `@PrePersist` — un método de ciclo de vida que se ejecuta justo antes de que la entidad se guarde por primera vez: `this.createdAt = LocalDateTime.now()`. Añade `updatable = false` en la anotación `@Column` para evitar que JPA lo cambie en actualizaciones posteriores.

---

## Presión

**Estás revisando el código de un compañero y encuentras un String que se construye con `+` dentro de un bucle que se ejecuta miles de veces. ¿Qué dices?**
Lo señalaría en la revisión de código y explicaría el problema — cada `+` crea un nuevo objeto String, así que un bucle de 10.000 iteraciones crea 10.000 objetos de vida corta que el recolector de basura tiene que limpiar. La solución es un `StringBuilder` antes del bucle y `sb.append()` en cada iteración. Explicaría el motivo y no solo el arreglo, para que el compañero entienda el patrón.

**Un junior de tu equipo recibe una `ConcurrentModificationException` pero no sabe por qué. ¿Cómo lo explicas?**
Explicaría que un bucle for-each usa un iterador internamente, y el iterador rastrea la estructura de la lista. Si llamas a `list.remove()` dentro del bucle, la estructura cambia y el iterador lo detecta como una violación — así que lanza la excepción. Luego mostraría la solución: `employees.removeIf(e -> !e.isActive())`. Una línea, seguro y legible. Sin necesidad de gestionar el iterador manualmente.

**Un entrevistador dice: "Java es muy verboso. ¿Por qué no usar Node.js para el backend?" ¿Cómo respondes?**
Java es verboso en algunas áreas, pero esa verbosidad te da cosas que importan a escala — tipado estático fuerte que detecta errores en tiempo de compilación, un ecosistema maduro para aplicaciones empresariales (Spring Boot, JPA, Spring Security), y el tipo de estabilidad a largo plazo que las grandes organizaciones necesitan. Las consultoras españolas usan Java porque sus clientes — bancos, aseguradoras, sector público — ejecutan sistemas durante 10 o 20 años. Node.js está bien para prototipos rápidos; Java es el estándar cuando el proyecto necesita ser mantenido por un equipo durante mucho tiempo.

**El entrevistador te pregunta: "¿Qué es lo más confuso de Java para alguien que viene de JavaScript?"**
Lo que más sorprende es que Java es paso por valor, pero para los objetos pasa una copia de la referencia — así que parece paso por referencia. Otro punto es que `==` comprueba identidad, no igualdad, lo que confunde a quienes están acostumbrados a la comparación laxa de JavaScript. Y el sistema de tipos es estricto — no puedes simplemente sumar un String y un número. Una vez que aceptas que Java es explícito respecto a tipos e inmutabilidad, la confusión desaparece y en realidad se siente más seguro.
