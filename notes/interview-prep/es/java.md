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

## POO y clases

**¿Qué es la encapsulación y por qué importa?**
La encapsulación significa ocultar el estado interno de un objeto y exponerlo solo a través de métodos. Los campos son `private`; el acceso se hace mediante `getters` y `setters`. Esto te permite cambiar la lógica interna sin romper el código que usa la clase. Cada entidad JPA en Spring Boot sigue este patrón.

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

**¿Cuál es la diferencia entre `HashMap`, `LinkedHashMap` y `TreeMap`?**
`HashMap` no garantiza ningún orden — el más rápido para búsquedas. `LinkedHashMap` mantiene el orden de inserción — úsalo cuando el orden importa. `TreeMap` ordena las claves alfabéticamente o por un comparador — úsalo cuando necesitas salida ordenada. En la mayoría del código Spring Boot usas `HashMap` a menos que necesites un orden específico.

**¿Cuándo usarías `getOrDefault()` en un `Map`?**
Cuando no estás seguro de si existe una clave y quieres un valor por defecto en lugar de `null`. Ejemplo: `map.getOrDefault(userId, "Desconocido")`. Esto evita un `NullPointerException` y deja clara la intención.

---

## Excepciones

**¿Cuál es la diferencia entre excepciones checked y unchecked?**
Las excepciones checked extienden `Exception` y deben declararse con `throws` o capturarse — ejemplos: `IOException`, `SQLException`. Las unchecked extienden `RuntimeException` y no necesitan declararse — ejemplos: `NullPointerException`, `IllegalArgumentException`. En Spring Boot casi siempre usas excepciones unchecked y dejas que `@ControllerAdvice` las gestione de forma centralizada.

**¿Cómo gestionas las excepciones globalmente en Spring Boot?**
Con `@ControllerAdvice` y `@ExceptionHandler`. Creas una clase que captura tipos específicos de excepción y devuelve el estado HTTP correcto. Ejemplo: capturar `EmployeeNotFoundException` y devolver una respuesta 404. Esto mantiene los controladores y servicios limpios — solo lanzan la excepción y el handler hace el resto.

**¿Por qué crear una excepción personalizada en lugar de usar `IllegalArgumentException`?**
Una excepción personalizada como `EmployeeNotFoundException` da un nombre claro al error. Al leer el código, sabes inmediatamente qué salió mal sin leer el mensaje. También permite gestionarla por separado en `@ControllerAdvice` — puedes devolver 404 para `EmployeeNotFoundException` y 400 para `IllegalArgumentException` con handlers distintos.

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
