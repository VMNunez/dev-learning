# Generics y Optional

> 📖 [Baeldung — Generics in Java](https://www.baeldung.com/java-generics)
> 📖 [Baeldung — Guide to Optional](https://www.baeldung.com/java-optional)
> 📖 [Oracle Docs — Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)

## Generics

Los generics te permiten escribir una clase o método que funcione con cualquier tipo, manteniendo la seguridad de tipos. El tipo se especifica cuando usas la clase, no cuando la escribes.

```java
// Sin generics — hay que hacer cast y puede causar ClassCastException
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);   // cast obligatorio

// Con generics — el tipo está fijo, no se necesita cast
List<String> list = new ArrayList<>();
list.add("hello");
String s = list.get(0);   // sin cast — el compilador conoce el tipo
```

---

## Clase genérica

```java
public class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

Box<String> nameBox = new Box<>("Victor");
Box<Integer> ageBox = new Box<>(31);

nameBox.getValue();   // "Victor" — String
ageBox.getValue();    // 31 — Integer
```

`T` es un parámetro de tipo — se reemplaza por el tipo real cuando creas una instancia. Puedes usar cualquier letra (`T`, `E`, `K`, `V`) pero estas convenciones son estándar:

| Letra | Significado | Uso común |
|-------|-------------|-----------|
| `T` | Type (tipo) | Clase o método genérico |
| `E` | Element (elemento) | Colecciones (`List<E>`) |
| `K` | Key (clave) | Maps (`Map<K, V>`) |
| `V` | Value (valor) | Maps (`Map<K, V>`) |
| `R` | Return (retorno) | Funciones |

---

## Método genérico

```java
public static <T> T getFirst(List<T> list) {
    if (list.isEmpty()) return null;
    return list.get(0);
}

String first = getFirst(List.of("a", "b", "c"));   // "a"
Integer num  = getFirst(List.of(1, 2, 3));          // 1
```

---

## Parámetros de tipo acotados

Restringe qué tipos están permitidos con `extends`:

```java
// Solo acepta Number y sus subclases (Integer, Double, Long...)
public static <T extends Number> double sum(List<T> list) {
    double total = 0;
    for (T item : list) {
        total += item.doubleValue();
    }
    return total;
}

sum(List.of(1, 2, 3));         // funciona — Integer extiende Number
sum(List.of(1.5, 2.5));        // funciona — Double extiende Number
// sum(List.of("a", "b"));     // error de compilación — String no extiende Number
```

---

## `Optional<T>`

`Optional<T>` es un contenedor que o bien tiene un valor o está vacío. Te obliga a manejar el caso "sin valor" explícitamente, en lugar de devolver `null` y esperar que el llamador lo compruebe.

```java
// Devolver null — el llamador podría olvidar comprobarlo
public Employee findById(Long id) {
    return database.get(id);   // podría devolver null
}

// Devolver Optional — el llamador debe manejar el caso vacío
public Optional<Employee> findById(Long id) {
    Employee emp = database.get(id);
    return Optional.ofNullable(emp);
}
```

### Crear un Optional

```java
Optional<String> withValue = Optional.of("Victor");          // tiene un valor
Optional<String> empty     = Optional.empty();               // sin valor
Optional<String> nullable  = Optional.ofNullable(getName()); // valor o vacío, dependiendo de null
```

### Usar un Optional

```java
Optional<Employee> result = repository.findById(id);

// Comprobar si está presente
result.isPresent();   // true si tiene valor
result.isEmpty();     // true si está vacío

// Obtener el valor (lanza NoSuchElementException si está vacío — evítalo)
result.get();

// Obtener con valor por defecto
result.orElse(new Employee("Unknown", ""));
result.orElseGet(() -> new Employee("Unknown", ""));

// Lanzar excepción personalizada si está vacío
result.orElseThrow(() -> new EmployeeNotFoundException(id));

// Ejecutar acción si está presente
result.ifPresent(emp -> System.out.println(emp.getName()));

// Transformar si está presente — Optional.map() transforma el valor dentro del Optional
// si está presente, y devuelve un nuevo Optional. Si está vacío, sigue vacío.
Optional<String> name = result.map(Employee::getName);
// Optional<Employee>  →  Optional<String>
```

### Optional.map() vs Stream.map()

Mismo concepto — transformar el valor dentro — pero funcionan sobre cosas distintas:

| | Trabaja sobre | Devuelve |
|---|---|---|
| `Stream.map()` | cada elemento en un stream | un nuevo `Stream` |
| `Optional.map()` | el valor dentro del Optional, si está presente | un nuevo `Optional` |

No necesitas `.stream()` antes de `.map()` cuando trabajas con un Optional.

### Encadenar map() + orElseThrow() — ejemplo de proyecto real

Este es el patrón estándar en `ProjectService.getById()`:

```java
// repository.findById(id) devuelve Optional<Project>
public ProjectResponse getById(Long id) {
    return projectRepository.findById(id)
        .map(project -> {                        // Optional<Project> → Optional<ProjectResponse>
            ProjectResponse response = new ProjectResponse();
            response.setId(project.getId());
            response.setName(project.getName());
            response.setDescription(project.getDescription());
            response.setActive(project.getActive());
            response.setCreatedAt(project.getCreatedAt());
            return response;
        })
        .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        // Optional<ProjectResponse> → ProjectResponse  (lanza si está vacío)
}
```

Paso a paso:
1. `findById(id)` → `Optional<Project>` — presente si se encuentra, vacío si no
2. `.map(...)` → `Optional<ProjectResponse>` — transforma el valor dentro, sigue vacío si lo estaba
3. `.orElseThrow(...)` → `ProjectResponse` — desenvuelve el valor, o lanza si está vacío

### El patrón más común en Spring Boot

```java
// En el repositorio (Spring Data lo genera automáticamente)
Optional<Employee> findById(Long id);

// En el servicio
public Employee getEmployee(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

---

## Generics en Spring Boot

Verás y usarás generics constantemente:

```java
// JpaRepository<Entity, ID>
public interface EmployeeRepository extends JpaRepository<Employee, Long> {}

// ResponseEntity<T>
public ResponseEntity<Employee> getEmployee(Long id) {
    Employee emp = service.findById(id);
    return ResponseEntity.ok(emp);
}

// List<T>
public List<Employee> getAllEmployees() {
    return repository.findAll();
}

// Optional<T>
Optional<Employee> employee = repository.findById(id);

// Las operaciones de stream usan generics internamente
employees.stream()
    .map(Employee::getName)      // Stream<String>
    .collect(Collectors.toList()); // List<String>
```

Entender qué significa `<T>` hace que la API de Spring Boot sea mucho más fácil de leer.
