# Streams y Lambdas

> 📖 [Baeldung — Java 8 Streams](https://www.baeldung.com/java-8-streams)
> 📖 [Baeldung — Lambda Expressions](https://www.baeldung.com/java-8-lambda-expressions-tips)

---

## Por qué este tema importa en Spring Boot

Abre cualquier servicio de Spring Boot y encontrarás streams y lambdas en los primeros métodos. No son un tema avanzado que alcanzas después — son la forma por defecto de trabajar con datos en Java. Considera lo que hace un método de servicio típico:

- obtener una lista de entidades del repositorio
- filtrar las que no cumplen una condición
- convertir cada entidad en un DTO antes de enviarla al controlador
- o encontrar una entidad específica por id y lanzar una excepción si no existe

Cada uno de esos pasos se escribe con un pipeline de stream y una lambda. Sin entender esta sintaxis, no puedes leer ni escribir un servicio real de Spring Boot. El objetivo de este archivo es construir esa comprensión desde cero, empezando por *por qué existen las lambdas* antes de tocar los streams.

---

## El problema que resuelven las lambdas

Antes de Java 8, si querías pasarle una operación concreta a un método — por ejemplo, "ordena esta lista por nombre" — tenías que crear una clase entera o una clase anónima solo para albergar esa lógica. Era verboso y difícil de leer.

```java
// Forma antigua — clase anónima para encapsular una única operación
List<String> names = Arrays.asList("Luis", "Ana", "Victor");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});
```

Java 8 introdujo las **expresiones lambda**: una función anónima y concisa que puedes pasar como si fuera un valor. El mismo sort se convierte en una línea:

```java
Collections.sort(names, (a, b) -> a.compareTo(b));
```

La flecha `->` separa los parámetros de la izquierda del cuerpo de la derecha. No necesitas nombrar la función, declarar una clase ni escribir `@Override`. Java infiere los tipos del contexto.

---

## Interfaces funcionales — la regla que hace funcionar las lambdas

Una lambda solo se puede usar donde Java espera una **interfaz funcional**: una interfaz que tiene exactamente un método abstracto. `Comparator<T>` es un ejemplo — tiene un método abstracto (`compare`). `Runnable` es otro — tiene `run`. Como solo hay un método, Java sabe exactamente qué método está implementando la lambda.

Raramente necesitas preocuparte directamente por esta regla. Lo que importa en la práctica es: siempre que un método de Spring Boot o una operación de stream pida un `Predicate`, una `Function`, un `Consumer` o un `Comparator`, pasas una lambda. El compilador gestiona el resto.

---

## Sintaxis de lambdas

```java
// Sin parámetros
() -> System.out.println("Hello")

// Un parámetro — los paréntesis son opcionales
name -> name.toUpperCase()

// Múltiples parámetros
(a, b) -> a + b

// Cuerpo con múltiples líneas — llaves obligatorias, y debes escribir return explícitamente
(a, b) -> {
    int sum = a + b;
    return sum * 2;
}
```

Los tipos de los parámetros casi siempre se omiten — Java los infiere. Solo los añades cuando el compilador no puede deducirlos, lo cual es raro.

---

## Method references — una lambda aún más corta

Si una lambda no hace nada más que llamar a un método existente y pasar el argumento directamente, puedes reemplazarla por una **referencia a método** usando `::`.

```java
// Lambda
list.forEach(name -> System.out.println(name));

// Method reference — comportamiento idéntico, más corto
list.forEach(System.out::println);
```

La regla es simple: usa una referencia a método solo cuando el cuerpo de la lambda es una única llamada a método y el argumento entra directamente sin ninguna transformación.

```java
// Puede usar method reference — el argumento entra directamente
.map(project -> toResponse(project))   // lambda
.map(this::toResponse)                 // method reference — lo mismo

// No puede usar method reference — la lambda hace algo extra antes
.map(project -> toResponse(project.getName()))
```

Las cuatro formas que verás con más frecuencia:

| Forma                                | Sintaxis              | Ejemplo               |
| ------------------------------------ | --------------------- | --------------------- |
| Método estático                      | `Clase::método`       | `Integer::parseInt`   |
| Método de instancia (objeto conocido) | `objeto::método`     | `System.out::println` |
| Método de instancia (en cada elemento) | `Clase::método`    | `String::toUpperCase` |
| Constructor                          | `Clase::new`          | `Employee::new`       |

En Spring Boot verás frecuentemente `this::toResponse` en métodos de servicio — llama al método de mapeo privado en la instancia del servicio actual.

---

## Qué es un stream

Un **stream** no es una estructura de datos — no almacena nada. Es un pipeline que describe una secuencia de operaciones a aplicar a datos de una fuente (normalmente una `List`). Encadenas operaciones y Java las ejecuta todas en un único paso cuando pides un resultado.

```
fuente → [operaciones intermedias] → operación terminal → resultado
```

Piensa en ello como una línea de producción: la materia prima (tu lista) entra por un extremo, cada estación la transforma o filtra, y un producto terminado sale por el otro extremo.

```java
List<Employee> employees = getEmployees();

List<String> activeNames = employees
    .stream()                              // abre el pipeline
    .filter(e -> e.isActive())            // estación 1: mantén solo los empleados activos
    .map(e -> e.getName())                // estación 2: toma el nombre de cada uno
    .sorted()                             // estación 3: ordena alfabéticamente
    .collect(Collectors.toList());        // cierra el pipeline, recoge el resultado
```

El resultado es una nueva `List<String>`. La lista original `employees` nunca se modifica.

---

## Operaciones intermedias vs terminales

**Operaciones intermedias** — cada una devuelve un nuevo stream, así que puedes encadenarlas. También son **lazy**: no se ejecutan hasta que una operación terminal las activa. Java espera a tener el pipeline completo antes de hacer cualquier trabajo.

| Operación                         | Qué hace                                                         |
| --------------------------------- | ---------------------------------------------------------------- |
| `filter(predicate)`               | Mantiene solo los elementos donde la condición es verdadera      |
| `map(function)`                   | Transforma cada elemento en otra cosa                            |
| `sorted()` / `sorted(comparator)` | Ordena los elementos                                             |
| `distinct()`                      | Elimina elementos duplicados                                     |
| `limit(n)`                        | Mantiene solo los primeros `n` elementos                         |
| `peek(consumer)`                  | Inspecciona cada elemento sin cambiarlo — útil para depuración   |

**Operaciones terminales** — estas disparan el pipeline y producen un resultado. Una vez que se ejecuta una operación terminal, el stream se consume y no puede reutilizarse.

| Operación                             | Qué produce                                           |
| ------------------------------------- | ----------------------------------------------------- |
| `collect(collector)`                  | Agrupa elementos en una colección (List, Set, Map…)   |
| `forEach(consumer)`                   | Ejecuta una acción en cada elemento, no devuelve nada |
| `count()`                             | Devuelve el número de elementos como `long`           |
| `findFirst()`                         | Devuelve el primer elemento envuelto en `Optional<T>` |
| `anyMatch(predicate)`                 | Devuelve `true` si al menos un elemento coincide      |
| `allMatch(predicate)`                 | Devuelve `true` si todos los elementos coinciden      |
| `noneMatch(predicate)`                | Devuelve `true` si ningún elemento coincide           |
| `min(comparator)` / `max(comparator)` | Encuentra el elemento más pequeño o más grande        |
| `reduce(identity, accumulator)`       | Pliega todos los elementos en un único valor          |

---

## Optional — qué devuelve findFirst y por qué

`findFirst()` no devuelve `T` directamente — devuelve `Optional<T>`. Un `Optional` es un contenedor que puede tener un valor o estar vacío. Te obliga a gestionar el caso en que no se encontró nada, en lugar de llevarte una `NullPointerException`.

```java
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Formas seguras de extraer el valor
found.isPresent();                     // true si hay un valor
found.get();                           // obtiene el valor — lanza si está vacío, úsalo con cuidado
found.orElse(null);                    // devuelve null si está vacío
found.orElseThrow(() -> new RuntimeException("Not found"));  // lanza si está vacío
```

En los servicios de Spring Boot verás `.orElseThrow()` constantemente — es el patrón estándar para "buscar por id o lanzar una excepción 404".

---

## Patrones comunes que escribirás cada día

```java
List<Employee> employees = getEmployees();

// Filtrar y recoger
List<Employee> active = employees.stream()
    .filter(Employee::isActive)
    .collect(Collectors.toList());

// Transformar a un tipo distinto
List<String> emails = employees.stream()
    .map(Employee::getEmail)
    .collect(Collectors.toList());

// Contar coincidencias
long adminCount = employees.stream()
    .filter(e -> e.getRole().equals("admin"))
    .count();

// Comprobar si alguno coincide
boolean hasAdmin = employees.stream()
    .anyMatch(e -> e.getRole().equals("admin"));

// Encontrar uno por id
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Ordenar por un campo
List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .collect(Collectors.toList());

// Sumar un campo numérico
int totalAge = employees.stream()
    .mapToInt(Employee::getAge)
    .sum();

// Agrupar elementos por un campo
Map<String, List<Employee>> byDepartment = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// Unir strings con un separador
String names = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.joining(", "));
// resultado: "Victor, Ana, Luis"
```

---

## Mapeo de entidad a DTO — el patrón que usarás en cada servicio

En Spring Boot, un método de servicio nunca debe devolver la entidad cruda de la base de datos — devuelve un DTO (Data Transfer Object) que solo expone los campos que necesita la API. La forma estándar de convertir una lista de entidades en una lista de DTOs es un pipeline de stream:

```java
// ProjectService — getAll()
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(project -> {
            ProjectResponse response = new ProjectResponse();
            response.setId(project.getId());
            response.setName(project.getName());
            response.setDescription(project.getDescription());
            response.setActive(project.getActive());
            response.setCreatedAt(project.getCreatedAt());
            return response;
        })
        .toList();
}
```

`.toList()` (Java 16+) es una alternativa más corta a `.collect(Collectors.toList())`. Ambas funcionan en Java 25. La diferencia: `.toList()` devuelve una lista **inmutable** — no puedes añadir ni eliminar elementos del resultado. Usa `.collect(Collectors.toList())` solo cuando necesites modificar la lista resultado a continuación, lo cual es raro.

A medida que la lógica de mapeo crece, típicamente la extraes a un método privado y usas una referencia a método:

```java
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(this::toResponse)
        .toList();
}

private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    // ...
    return response;
}
```

---

## Stream vs bucle for — cuándo usar cada uno

Los streams hacen que la _intención_ del código sea clara — filtrar, transformar, ordenar — de una forma que un bucle for no hace. Pero un bucle for es a veces la herramienta correcta.

```java
// Bucle for
List<String> result = new ArrayList<>();
for (Employee e : employees) {
    if (e.isActive()) {
        result.add(e.getName().toUpperCase());
    }
}

// Stream — mismo resultado, la intención es inmediatamente visible
List<String> result = employees.stream()
    .filter(Employee::isActive)
    .map(e -> e.getName().toUpperCase())
    .collect(Collectors.toList());
```

Usa un stream cuando el pipeline es claro y cada paso cabe en una o dos líneas. Usa un bucle for cuando:

- la lógica interna es compleja y ocupa muchas líneas
- necesitas salir del bucle antes con `break`
- estás actualizando una variable externa dentro del bucle (los streams desaconsejan los efectos secundarios)

---

## Referencia rápida de Collectors

`Collectors` es una clase de utilidad con las implementaciones más habituales listas para usar en la operación terminal `collect()`.

```java
// Recoger en una List
.collect(Collectors.toList())

// Recoger en un Set (duplicados eliminados automáticamente)
.collect(Collectors.toSet())

// Recoger en un Map
.collect(Collectors.toMap(
    Employee::getId,    // cada elemento se convierte en una clave
    Employee::getName   // cada elemento se convierte en un valor
))

// Unir strings
.collect(Collectors.joining(", "))             // "a, b, c"
.collect(Collectors.joining(", ", "[", "]"))   // "[a, b, c]"

// Agrupar en Map<clave, List<elemento>>
.collect(Collectors.groupingBy(Employee::getDepartment))
// resultado: Map<String, List<Employee>>

// Contar por grupo
.collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()))
// resultado: Map<String, Long>
```
