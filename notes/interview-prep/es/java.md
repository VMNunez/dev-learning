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

**¿Qué es el String pool y cómo se relaciona con la inmutabilidad?**
La JVM mantiene un pool de literales String. Cuando escribes `String a = "hello"; String b = "hello";`, ambas variables apuntan al mismo objeto del pool — Java lo reutiliza porque los Strings son inmutables y seguros para compartir. Por eso `==` puede devolver `true` para literales pero `false` para `new String("hello")`, que omite el pool y crea un objeto separado. Usa siempre `.equals()` — no dependas del pool.

> **Consejo de entrevista:** Menciona el pool para demostrar que entiendes POR QUÉ importa la inmutabilidad en Java, no solo QUÉ significa.

Respuesta que falla: "Los Strings son inmutables porque Java lo decidió así" — sin explicar qué habilita la inmutabilidad.

---

## Control de flujo

**¿Cuál es la diferencia entre `==` y `.equals()` en Java?**
`==` compara referencias — comprueba si dos variables apuntan al mismo objeto en memoria. `.equals()` compara contenido — comprueba si dos objetos tienen el mismo valor. Para Strings, siempre usa `.equals()`. Para enums y primitivos, `==` es correcto.

**¿Qué es la expresión switch introducida en Java 14?**
El nuevo `switch` usa `->` en lugar de `case:` y `break`, y puede devolver un valor directamente. También hace que el compilador avise si te falta un caso. Ejemplo: `String result = switch (status) { case ACTIVE -> "Activo"; case INACTIVE -> "Desactivado"; };`. Este es el patrón que usas con enums en Spring Boot.

**¿Cuándo usarías una expresión switch sobre un enum en lugar de if-else?**
Cuando tienes un conjunto fijo de valores conocidos y necesitas tratar cada uno de forma diferente. La expresión switch hace que el compilador avise si añades una nueva constante al enum y olvidas manejarla — eso es imposible con if-else. En Spring Boot este es el patrón estándar para campos de estado o rol: `switch(employee.getStatus()) { case ACTIVE -> ...; case INACTIVE -> ...; }`.

> **Consejo de entrevista:** Di "el compilador me avisa si me falta un caso" — eso muestra que entiendes la ventaja de seguridad de tipos, no solo la sintaxis.

Respuesta que falla: "Prefiero switch porque es más corto" — se pierde por completo la ventaja de seguridad.

---

## Métodos

**¿Qué es la sobrecarga de métodos?**
La sobrecarga significa tener dos o más métodos con el mismo nombre pero parámetros distintos. El compilador elige el correcto según los argumentos que pasas. Ejemplo: `void log(String msg)` y `void log(String msg, int level)` — ambos son válidos en la misma clase.

**¿Cuál es la diferencia entre métodos `static` y de instancia?**
Un método `static` pertenece a la clase y puede llamarse sin crear un objeto: `Math.max(a, b)`. Un método de instancia pertenece a un objeto y necesita una instancia para ejecutarse. En Spring Boot, los métodos de servicio son de instancia llamados mediante inyección de dependencias — nunca se llaman de forma estática.

**¿Cuál es la diferencia entre un constructor y un método normal?**
Un constructor no tiene tipo de retorno, tiene el mismo nombre que la clase, y se ejecuta exactamente una vez cuando se crea el objeto. Un método normal puede llamarse cualquier número de veces. Los constructores inicializan los campos del objeto — después de `new Employee("Victor")` el objeto está en un estado válido. En Spring Boot, las entidades JPA necesitan un constructor sin argumentos porque Hibernate crea el objeto con `new` y luego establece los campos mediante reflexión.

> **Consejo de entrevista:** Menciona que Hibernate necesita el constructor sin argumentos — eso muestra la conexión entre Java básico y el comportamiento de Spring Boot.

Respuesta que falla: "Un constructor es solo un método especial" — verdadero pero incompleto; no explica por qué JPA lo requiere.

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

**¿Qué es la clase `Object` y por qué todas las clases Java la extienden?**
`Object` es la raíz de la jerarquía de clases de Java. Todas las clases la extienden implícitamente, lo que significa que cualquier objeto ya tiene `toString()`, `equals()` y `hashCode()` de serie. Por eso puedes imprimir cualquier objeto con `System.out.println()` y las colecciones como `HashMap` pueden trabajar con cualquier tipo. Cuando sobreescribes `equals()` en tu propia clase, estás reemplazando la implementación por defecto de `Object`.

> **Consejo de entrevista:** Conéctalo con las colecciones — "sobreescribo `equals()` y `hashCode()` para que `HashSet` sepa cuándo dos objetos Employee son el mismo."

Respuesta que falla: "He oído hablar de la clase Object" — sin conexión con por qué importa en el código del día a día.

---

## Interfaces y clases abstractas

**¿Cuál es la diferencia entre una interfaz y una clase abstracta?**
Una interfaz es un contrato — define qué debe hacer una clase, no cómo. Una clase abstracta es una implementación parcial — puede tener métodos abstractos (sin cuerpo) y métodos concretos (con cuerpo). Una clase puede implementar múltiples interfaces pero solo extender una clase abstracta. En Spring Boot, los repositorios extienden `JpaRepository` (una interfaz) y Spring genera la implementación automáticamente.

**¿Qué es una interfaz funcional?**
Una interfaz funcional tiene exactamente un método abstracto. Puede usarse con una lambda. Ejemplos comunes: `Predicate<T>` (recibe T, devuelve boolean), `Function<T, R>` (recibe T, devuelve R), `Consumer<T>` (recibe T, no devuelve nada). El Stream API las usa — `filter()` recibe un `Predicate`, `map()` recibe una `Function`.

**¿Qué es un método `default` en una interfaz y por qué existe?**
Un método `default` tiene cuerpo dentro de la interfaz. Las clases que la implementan pueden usarlo tal cual o sobreescribirlo. Se añadió en Java 8 para permitir que las interfaces existentes ganaran nuevos métodos sin romper todas las clases que ya las implementaban. En la práctica los verás principalmente en la librería estándar — `List.sort()` es un método `default` en la interfaz `List`.

> **Consejo de entrevista:** Esta es la historia de "Java 8 lo añadió para no romper la compatibilidad con código anterior" — los entrevistadores aprecian que entiendas el POR QUÉ detrás de las características del lenguaje.

Respuesta que falla: "Un método default es un método que usa la palabra clave default" — circular, no explica nada.

**¿Cuándo elegirías una clase abstracta en lugar de una interfaz?**
Cuando varias clases relacionadas comparten implementación real — no solo un contrato. Si `AdminService` y `EmployeeService` necesitan la misma lógica `validatePermissions()`, puedes poner ese método en un `BaseService` abstracto y hacer que ambas lo extiendan. Usa una interfaz cuando solo necesitas definir el contrato. En Spring Boot casi siempre usas interfaces — `JpaRepository`, `UserDetailsService` — porque Spring provee la implementación.

> **Consejo de entrevista:** "Interfaz para el contrato, clase abstracta para lógica compartida" — esa es la frase que hay que recordar.

Respuesta que falla: "Siempre uso interfaces" — muestra que conoces la regla pero no cuándo la excepción tiene sentido.

---

## Herencia y polimorfismo

**¿Qué es el polimorfismo en Java?**
El polimorfismo significa que una referencia puede comportarse de forma diferente según el objeto real al que apunta. Si `Dog` y `Cat` extienden `Animal` y sobreescriben `speak()`, entonces una `List<Animal>` puede contener ambos, y llamar a `speak()` en cada uno da resultados distintos. En el proyecto 06 (HR Portal), `AuthService implements UserDetailsService` — cuando Spring Security llama a `loadUserByUsername()`, solo sabe que tiene un `UserDetailsService`. No le importa que sea específicamente un `AuthService`.

**¿Qué hace `@Override`?**
Le dice al compilador que el método sobreescribe intencionalmente un método de una clase padre o interfaz. Si cometes un error tipográfico en el nombre del método, el compilador da un error en lugar de crear silenciosamente un método nuevo. Usa siempre `@Override` al sobreescribir.

**¿Cuál es la diferencia entre sobreescribir y sobrecargar?**
Sobreescribir reemplaza el método del padre en una subclase — mismo nombre, mismos parámetros, clase distinta. Sobrecargar añade un método con el mismo nombre pero parámetros distintos en la misma clase. Sobreescribir es una decisión en tiempo de ejecución; sobrecargar es una decisión en tiempo de compilación.

**¿Cuándo elegirías composición sobre herencia?**
Cuando la relación es "tiene un" en lugar de "es un". Un `EmployeeService` tiene un repositorio — no es un tipo de repositorio. La herencia es para relaciones "es un". Abusar de la herencia crea acoplamiento fuerte — un cambio en el padre puede romper todas las subclases. En Spring Boot, la composición mediante inyección de dependencias es el estándar: los servicios reciben repositorios a través del constructor, no los extienden.

> **Consejo de entrevista:** "Favorece la composición sobre la herencia" es un principio de diseño clásico. Decirlo con un ejemplo concreto muestra que piensas en diseño, no solo en sintaxis.

Respuesta que falla: "Uso herencia cuando necesito reutilizar código" — esa es la razón incorrecta; usa composición para reutilizar.

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

**¿Cuál es la diferencia entre `List.of()` y `new ArrayList<>()`?**
`List.of()` crea una lista inmutable — no puedes añadir, eliminar ni cambiar elementos después de crearla. Es perfecta para datos fijos como listas de valores permitidos o constantes. `new ArrayList<>()` crea una lista mutable. Un error común es llamar `.add()` sobre un `List.of()` y obtener `UnsupportedOperationException`. Si necesitas una lista mutable con valores conocidos, usa `new ArrayList<>(List.of("a", "b", "c"))`.

> **Consejo de entrevista:** Menciona `UnsupportedOperationException` por su nombre — demuestra que conoces este error y sabes cómo evitarlo.

Respuesta que falla: "List.of es más corto de escribir" — se pierde completamente la inmutabilidad.

**¿Por qué hay que sobreescribir `equals()` y `hashCode()` juntos?**
Porque `HashMap` y `HashSet` usan los dos en secuencia — primero `hashCode()` para encontrar el bucket correcto, luego `equals()` para confirmar la coincidencia. Si sobreescribes `equals()` pero no `hashCode()`, dos objetos que son iguales por tu lógica pueden tener hash codes distintos y acabar en buckets diferentes, así que `set.contains(employee)` devuelve `false` aunque el empleado esté en el set. El contrato de Java es: si `a.equals(b)` es `true`, entonces `a.hashCode()` debe ser igual a `b.hashCode()`.

> **Consejo de entrevista:** "hashCode encuentra el bucket, equals confirma la coincidencia — son una pareja."

Respuesta que falla: "Siempre sobreescribo los dos para mayor seguridad" — hay que explicar POR QUÉ deben coincidir, no solo que se hace.

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

**¿Cuál es la diferencia entre `Error` y `Exception`?**
Ambas extienden `Throwable`, pero sirven para propósitos distintos. `Error` señala un problema grave a nivel de JVM — `OutOfMemoryError`, `StackOverflowError` — del que tu código no debería intentar recuperarse. `Exception` es un problema recuperable que tu código puede gestionar. La regla es simple: nunca captures `Error`. En Spring Boot solo trabajas con `Exception` y sus subclases.

> **Consejo de entrevista:** "Nunca captures Error" es la regla que los entrevistadores comprueban. Dila clara y simplemente.

Respuesta que falla: "Error y Exception son ambos tipos de excepciones" — se pierde la diferencia crítica de intención.

**¿Qué es try-with-resources y cuándo se usa?**
Try-with-resources cierra automáticamente un recurso cuando el bloque termina — no hace falta `finally`. El recurso debe implementar `AutoCloseable`. Se usa para ficheros, streams y conexiones de base de datos. En Spring Boot, las conexiones de base de datos las gestiona el framework, así que raramente lo escribes tú, pero lo verás en operaciones con ficheros y en código escrito antes del Spring moderno.

> **Consejo de entrevista:** "Spring Boot gestiona las conexiones por ti, pero necesitas conocer esto para ficheros y para leer código legado."

Respuesta que falla: "Lo uso en lugar de try-catch" — confunde gestión de recursos con manejo de excepciones.

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

**¿Qué es una referencia a método y cuándo la usarías en lugar de una lambda?**
Una referencia a método es un atajo para una lambda que llama a un único método existente. `employees.stream().map(Employee::getName)` es lo mismo que `.map(e -> e.getName())` — solo más corto. Usa referencias a métodos cuando la lambda no hace nada más que delegar a un método. Si hay lógica adicional (`e -> e.getName().toUpperCase()`), mantén la lambda — una referencia a método no ayudaría ahí.

> **Consejo de entrevista:** "La referencia a método es solo una lambda más corta — la uso cuando la lambda no hace nada más que llamar a un método."

Respuesta que falla: "Las referencias a método son más eficientes" — no hay diferencia de rendimiento; es solo una elección de legibilidad.

**¿Qué hace `flatMap()` y cuándo lo usarías?**
`map()` transforma cada elemento en un valor. `flatMap()` transforma cada elemento en un stream y luego aplana todos esos streams en uno. Úsalo cuando cada elemento se expande en una lista. Ejemplo: una `List<Department>` donde cada departamento tiene una `List<Employee>` — `departments.stream().flatMap(d -> d.getEmployees().stream())` te da todos los empleados en un stream plano.

> **Consejo de entrevista:** "flatMap es map + aplanar — lo uso cuando un elemento produce muchos elementos."

Respuesta que falla: Confundir `flatMap` con `map` o no saber que existe — demuestra falta de práctica con streams.

**¿Para qué sirve `Collectors.groupingBy()` y cuándo es útil?**
`groupingBy` recoge elementos de un stream en un `Map` agrupados por una clave. `employees.stream().collect(Collectors.groupingBy(Employee::getDepartment))` devuelve `Map<String, List<Employee>>` — una lista por departamento. En Spring Boot es útil cuando necesitas agregar datos en la capa de servicio en lugar de escribir una consulta GROUP BY, por ejemplo al construir una vista de resumen o rellenar un informe.

> **Consejo de entrevista:** "groupingBy es el equivalente en streams del GROUP BY de SQL — úsalo cuando necesitas organizar una lista plana por categoría."

Respuesta que falla: "Escribiría un GROUP BY en SQL" — demuestra que no conoce cuándo la capa de servicio gestiona la agrupación.

---

## Genéricos

**¿Qué son los genéricos y por qué existen?**
Los genéricos permiten escribir una clase o método que funcione con cualquier tipo manteniendo la seguridad de tipos. Sin genéricos, una `List` almacena `Object` y necesitas hacer cast. Con `List<Employee>`, el compilador conoce el tipo y evita que añadas el tipo incorrecto. Los ves en todas partes en Spring Boot: `JpaRepository<Employee, Long>`, `ResponseEntity<Employee>`, `Optional<Employee>`.

**¿Qué es `Optional<T>` y por qué es mejor que devolver `null`?**
`Optional<T>` es un contenedor que o bien tiene un valor o bien está vacío. Cuando un método devuelve `Optional`, el que lo llama está obligado a gestionar el caso "no encontrado" explícitamente — no puede olvidarse. El patrón más común en Spring Boot: `repository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id))`.

**¿Cuál es la diferencia entre `orElse()` y `orElseGet()`?**
`orElse(value)` siempre evalúa el valor — incluso si el Optional ya tiene resultado. `orElseGet(() -> value)` solo ejecuta la lambda si el Optional está vacío. Usa `orElseGet` cuando el valor por defecto es costoso de crear — por ejemplo, una llamada a la base de datos o un objeto complejo. Usa `orElse` para constantes simples como `""` o `0`. En el proyecto 06 siempre usé `orElseThrow`, pero si necesitara un valor por defecto en el proyecto 07 del finance tracker — como devolver una moneda por defecto — usaría `orElseGet(() -> currencyService.getDefault())` para evitar una llamada innecesaria a la base de datos.

> **Consejo de entrevista:** "orElse siempre se ejecuta; orElseGet solo cuando está vacío. Usa orElseGet cuando el valor por defecto es costoso."

Respuesta que falla: "Los dos devuelven un valor por defecto — uso el que sea" — demuestra no entender la evaluación perezosa.

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

**¿Qué es `ZonedDateTime` y cuándo lo necesitas en lugar de `LocalDateTime`?**
`ZonedDateTime` añade información de zona horaria a una fecha y hora. Úsalo cuando tu aplicación sirve a usuarios en zonas horarias distintas — por ejemplo, una reunión a las 10:00 en Madrid debe mostrarse a las 09:00 en Londres. Para la mayoría de datos de negocio (fechas de contratación, plazos, timestamps `createdAt` en una app de un solo país) `LocalDateTime` es suficiente. En la práctica, la mayoría de aplicaciones backend españolas se quedan con `LocalDateTime` y solo usan `ZonedDateTime` para integraciones internacionales o APIs externas con offset de zona horaria.

> **Consejo de entrevista:** "Empieza con LocalDateTime. Añade ZonedDateTime solo si importa la zona horaria — para la mayoría de apps españolas no es necesario."

Respuesta que falla: "Siempre uso ZonedDateTime para mayor seguridad" — complejidad innecesaria que la mayoría de proyectos no necesita.

---

## Anotaciones

**¿Qué es una anotación en Java y qué hace?**
Una anotación es metadatos añadidos al código — una etiqueta que da información extra al compilador o a un framework en tiempo de ejecución. `@Override` le dice al compilador que verifique que estás sobreescribiendo un método padre. Las anotaciones de Spring Boot como `@Service`, `@Repository` y `@Autowired` le dicen al framework cómo configurar la aplicación al arrancar. El punto clave: una anotación no ejecuta nada por sí sola — es una señal que algo más lee y procesa.

> **Consejo de entrevista:** "Una anotación es una señal. El compilador o el framework la lee y actúa — la anotación en sí no ejecuta nada."

Respuesta que falla: "Las anotaciones son como comentarios" — los comentarios se ignoran completamente; las anotaciones las procesa el compilador o el framework.

**¿Cuál es la diferencia entre `@Override` y una anotación de Spring como `@Service`?**
`@Override` es una anotación en tiempo de compilación — el compilador la lee durante la compilación y añade una verificación. Las anotaciones de Spring como `@Service` son anotaciones en tiempo de ejecución — Spring Boot las lee mediante reflexión cuando arranca la aplicación y registra la clase como un bean gestionado. Son el mismo mecanismo de Java, usado en momentos distintos por consumidores distintos.

> **Consejo de entrevista:** Menciona los tipos de retención para demostrar profundidad: "retención en tiempo de compilación vs tiempo de ejecución — Spring necesita RUNTIME para leer la anotación cuando arranca la app."

Respuesta que falla: "Las anotaciones de Spring son distintas de las anotaciones normales de Java" — son el mismo mecanismo, solo que se consumen en momentos diferentes.

**¿Por qué Spring Boot usa anotaciones tan intensamente en lugar de configuración XML?**
Las anotaciones permiten configurar el comportamiento de forma declarativa dentro del propio código. `@Service` marca una clase como un bean de Spring. `@Transactional` envuelve un método en una transacción de base de datos. `@GetMapping("/employees")` mapea una URL a un método. Antes de Spring Boot, todo esto necesitaba ficheros XML. Las anotaciones hacen el código autodocumentado — puedes leer qué hace una clase simplemente viendo sus anotaciones. Spring Boot fue más lejos configurando valores sensatos por defecto, así que casi no necesitas ninguna configuración manual.

> **Consejo de entrevista:** "Las anotaciones reemplazaron la configuración XML — esa es toda la historia de Spring Boot frente al Spring antiguo."

Respuesta que falla: "Spring Boot usa anotaciones porque es la forma de Java" — sin entender qué reemplazaron ni por qué.

---

## Maven

**¿Qué es Maven y qué hace?**
Maven es la herramienta de construcción y gestión de dependencias estándar para proyectos Java. Lee el `pom.xml`, descarga las librerías listadas de Maven Central, compila el código, ejecuta los tests y empaqueta todo en un `.jar`. El equivalente en JavaScript es `npm` — `pom.xml` es `package.json`, Maven Central es el registro de npm.

> **Consejo de entrevista:** "Maven es npm para Java — dilo así y cualquier entrevistador que conozca JavaScript lo entenderá inmediatamente."

Respuesta que falla: "Maven compila código Java" — verdadero pero incompleto; la gestión de dependencias es la parte más importante.

**¿Cuál es la estructura de un `pom.xml` y qué hace el bloque parent?**
Los tres campos obligatorios son `groupId` (tu organización), `artifactId` (el nombre del proyecto) y `version`. El bloque `<dependencies>` lista las librerías que usa el proyecto. El bloque `<parent>` hereda de `spring-boot-starter-parent`, que gestiona todas las versiones de librerías de Spring — por eso la mayoría de dependencias de Spring no necesitan etiqueta `<version>`. El parent es lo que hace que Spring Boot "funcione sin configurar" de serie.

> **Consejo de entrevista:** "El parent es la razón por la que no especificas versiones para las librerías de Spring — ya sabe qué versiones son compatibles."

Respuesta que falla: "Uso Spring Initializr así que no necesito entender el pom.xml" — siempre necesitarás añadir dependencias manualmente en algún momento.

**¿Cómo añades una nueva dependencia a un proyecto Spring Boot?**
Busca la librería en `mvnrepository.com`, copia el bloque `<dependency>` y pégalo dentro de `<dependencies>` en el `pom.xml`. Para librerías de Spring, omite el `<version>` — el parent lo gestiona. Para otras librerías como JWT, incluye la versión. IntelliJ detecta el cambio y descarga la dependencia automáticamente. Si hace falta, ejecuta `mvn install` manualmente.

> **Consejo de entrevista:** "Copia siempre de mvnrepository.com — nunca escribas un bloque de dependencia a mano. Un error en el groupId o artifactId rompe la construcción de forma silenciosa."

Respuesta que falla: "Descargaría el jar y lo añadiría al proyecto manualmente" — ese es el método anterior a Maven; elimina completamente su propósito.

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

**Un compañero argumenta que devolver `null` es más simple que usar `Optional`. ¿Cómo respondes?**
Entiendo el argumento — `Optional` añade un envoltorio. Pero el problema con `null` es que es invisible. Cuando un método devuelve `null`, nada en el código le dice al que lo llama que necesita comprobarlo. Con `Optional`, la propia firma comunica que el valor puede no estar — el que llama no puede olvidarse porque tiene que llamar a `orElse` u `orElseThrow` para obtener el valor. En Spring Boot, `JpaRepository.findById()` devuelve `Optional<T>` exactamente por esta razón. El envoltorio extra vale la pena por la seguridad.
