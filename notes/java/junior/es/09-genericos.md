# Generics y Optional

> 📖 [Baeldung — Generics in Java](https://www.baeldung.com/java-generics)
> 📖 [Baeldung — Guide to Optional](https://www.baeldung.com/java-optional)
> 📖 [Oracle Docs — Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)

En `12-streams-lambdas.md` aprendiste a transformar datos de forma fluida — `map`, `filter`, `collect` remodelando una colección en una sola cadena. Pero cada una de esas operaciones ya sabía con qué tipo estaba trabajando: un `Stream<Employee>`, una `List<String>`. Hasta ahora nada te ha dejado escribir una clase o un método que trabaje con *cualquier* tipo de forma segura — una `Box` que hoy guarda un `String` y mañana un `Integer`, con el compilador comprobando cada uso. Eso es exactamente lo que añaden los generics, y es la razón por la que la API de streams que acabas de conocer está construida sobre ellos de arriba abajo.

## Generics

Antes de que existieran los generics, una `List` podía contener cualquier cosa — metías un `String` y recibías un `Object`. Para usar el valor tenías que hacer un cast manual, y si habías metido el tipo equivocado, el cast fallaba en runtime con una `ClassCastException`. No tenías ninguna protección en tiempo de compilación.

Los generics resuelven esto permitiéndote declarar con qué tipo trabaja una clase o un método. Especificas el tipo cuando usas la clase, no cuando la escribes — así que `List<String>` es una lista que solo acepta strings, y el compilador lo fuerza. El cast desaparece porque el compilador ya sabe el tipo.

```java
// Sin generics — hay que hacer cast y puede causar ClassCastException
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);   // cast obligatorio — falla en runtime si el elemento no es un String

// Con generics — el tipo está fijo, no se necesita cast
List<String> list = new ArrayList<>();
list.add("hello");
String s = list.get(0);   // sin cast — el compilador sabe que es un String
```

Entonces, ¿la `List<String>` *sabe* realmente, mientras el programa se ejecuta, que contiene strings? No — y esto sorprende a todo el mundo la primera vez. Los generics son una comprobación **solo en tiempo de compilación**. El compilador usa `<String>` para verificar cada `add` y cada `get` mientras compila tu código, y luego **borra** el tipo: descarta la información `<String>` e inserta los casts por ti. Esto se llama *type erasure* (borrado de tipos).

```
Lo que TÚ escribes:        Lo que produce el COMPILADOR (tras el erasure):

List<String> list;         List list;                    ← el <String> ha desaparecido
list.add("hi");            list.add("hi");
String s = list.get(0);    String s = (String) list.get(0);  ← el cast se inserta por ti
```

El cast nunca desapareció — el compilador simplemente lo escribe para que tú no tengas que hacerlo, después de haber demostrado que el cast es seguro. En runtime solo hay una `List` normal de referencias a `Object`.

> **Los generics viven solo en tiempo de compilación.** `List<String>` y `List<Integer>` son la *misma* clase `List` una vez que el programa se ejecuta — la parte `<...>` se borra. Por eso no puedes preguntarle a una lista en runtime "¿qué tipo contienes?", y por eso no puedes escribir `new T[]` ni `if (x instanceof List<String>)` — el argumento de tipo sencillamente ya no está ahí. Hizo todo su trabajo mientras compilaba.

---

## Clase genérica

Escribes el parámetro de tipo `<T>` después del nombre de la clase. `T` es un marcador de posición — cuando alguien crea una instancia, reemplaza `T` con el tipo real que necesita:

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

Lee la tabla así: la `Letra` es solo un nombre — el compilador las trata a todas de forma idéntica, así que `Box<T>` y `Box<E>` se comportan exactamente igual. La columna `Uso común` es pura convención: ver `E` señala "esto es un elemento de colección", ver `K, V` señala "esto es un map". Seguirla hace que tu código genérico sea instantáneamente legible para cualquier desarrollador de Java.

---

## Método genérico

Un método también puede tener su propio parámetro de tipo, independiente de la clase. Se declara antes del tipo de retorno: `<T> TipoRetorno nombreMetodo(...)`.

```java
public static <T> T getFirst(List<T> list) {
    if (list.isEmpty()) return null;
    return list.get(0);
}

String first = getFirst(List.of("a", "b", "c"));   // "a"
Integer num  = getFirst(List.of(1, 2, 3));          // 1
```

La razón por la que `<T>` va *antes* del tipo de retorno es que el compilador lee el método de izquierda a derecha, y necesita saber que `T` es un parámetro de tipo antes de llegar al primer sitio donde lo usas. En `<T> T getFirst(List<T> list)`, el siguiente token justo después de la declaración — el tipo de retorno `T` — ya es `T`. Si no hubieras declarado `<T>` primero, el compilador llegaría a ese `T` y no tendría ni idea de qué es: ¿una clase real que olvidaste importar? ¿Una errata? Declarar `<T>` por delante le dice "las letras que siguen en esta firma son marcadores de posición que estoy introduciendo ahora mismo", para que pueda resolver cada `T` posterior contra esa declaración.

> **El `<T>` inicial es una declaración, no decoración.** Es el momento en el que `T` *nace* para este método. Todo lo que viene después — el tipo de retorno, los parámetros, el cuerpo — puede entonces referirse a `T`. Esta es la misma razón por la que una *clase* genérica escribe `class Box<T>`: el `<T>` debe introducirse antes de que cualquier miembro pueda usarlo.

---

## Parámetros de tipo acotados

A veces necesitas que un método genérico funcione con varios tipos pero no con cualquiera — por ejemplo, un método que suma una lista de números tiene que poder llamar a `.doubleValue()` en cada elemento, lo que solo tiene sentido para tipos numéricos. Restringes qué tipos se aceptan usando `extends`. El parámetro de tipo `<T extends Number>` significa "T puede ser cualquier tipo, siempre que sea una subclase de `Number`" — lo que incluye `Integer`, `Double`, `Long` y todos los demás wrappers numéricos.

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

Esa última línea no compila, y el mensaje nombra el bound exactamente:

```
type argument String is not within bounds of type-variable T
```

(IntelliJ formula la misma regla como `required: T; T extends Number; found: String`.) Reconocer ese texto más adelante te dice al instante que pasaste un tipo que cae fuera de un bound genérico — no un desajuste de tipos normal.

---

## `Optional<T>`

`Optional<T>` es un contenedor que puede tener un valor o estar vacío. Te obliga a gestionar el caso "sin valor" de forma explícita, en lugar de devolver `null` y esperar que quien lo use se acuerde de comprobarlo.

```java
// Devolver null — es fácil olvidar comprobarlo y llevarse una NullPointerException
public Employee findById(Long id) {
    return database.get(id);   // podría devolver null
}

// Devolver Optional — quien lo use tiene que manejar el caso vacío
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

> **Evita `.get()`.** No te da nada que los métodos más seguros no den, y lanza `NoSuchElementException` en el momento en que el Optional está vacío — lo que echa por tierra todo el sentido de usar un Optional, ya que vuelves a un crash sin comprobar exactamente igual que una `NullPointerException`. Cada vez que recurres a `.get()`, alguno de `orElse`, `orElseGet`, `orElseThrow` o `ifPresent` expresa mejor la intención y no puede reventar de forma inesperada. Trata `.get()` como un code smell.

> **`orElse` vs `orElseGet` — eager vs lazy.** Parecen intercambiables pero difieren en *cuándo* se construye el valor por defecto. `orElse(new Employee(...))` evalúa su argumento **siempre** — el `new Employee(...)` se ejecuta incluso cuando el Optional tiene un valor y el resultado se descarta. `orElseGet(() -> new Employee(...))` toma un supplier (una lambda) y solo lo ejecuta **cuando el Optional está vacío**. Para un valor por defecto barato da igual; pero si el valor por defecto es caro — una llamada a base de datos, un objeto `new` que preferirías no asignar — `orElseGet` es la opción correcta porque es *lazy*: el código dentro de la lambda no se ejecuta a menos que sea realmente necesario.

### Optional.map() vs Stream.map()

Mismo concepto — transformar el valor dentro — pero funcionan sobre cosas distintas:

| | Trabaja sobre | Devuelve |
|---|---|---|
| `Stream.map()` | cada elemento en un stream | un nuevo `Stream` |
| `Optional.map()` | el valor dentro del Optional, si está presente | un nuevo `Optional` |

Lee la tabla como un par de "contenedor entra → contenedor sale": cada `map()` abre su propio contenedor (un `Stream` para la primera fila, un `Optional` para la segunda), transforma lo que hay dentro y te devuelve el *mismo tipo* de contenedor — nunca un valor pelado. Por eso la columna de retorno siempre coincide con el contenedor de la columna "Trabaja sobre".

No necesitas `.stream()` antes de `.map()` cuando trabajas con un Optional.

### Encadenar map() + orElseThrow() — ejemplo de proyecto real

Este es el `ProjectService.getById()` exacto del proyecto 07 (`backend/.../service/ProjectService.java`):

```java
// projectRepository.findById(id) devuelve Optional<Project>
public ProjectResponse getById(Long id) {
    return projectRepository.findById(id)
        .map(this::toResponse)                   // Optional<Project> → Optional<ProjectResponse>
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        // Optional<ProjectResponse> → ProjectResponse  (lanza si está vacío)
}
```

`this::toResponse` es una *referencia a método* (cubierta en detalle en `12-streams-lambdas.md` — léela como "llama al método `toResponse` de `this` sobre cada valor"). Apunta a un pequeño helper en el mismo servicio que copia un `Project` en un `ProjectResponse` campo a campo:

```java
private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    response.setDescription(project.getDescription());
    response.setActive(project.getActive());
    response.setCreatedAt(project.getCreatedAt());
    return response;
}
```

Extraer el mapeo a `toResponse` es la razón por la que `getById` sigue siendo una cadena limpia de tres líneas — y por la que el mismo `.map(this::toResponse)` se reutiliza en todos los demás métodos del servicio. `ResourceNotFoundException` es una subclase personalizada de `RuntimeException` (ver `11-excepciones.md`) que Spring mapea a un HTTP 404.

Paso a paso:
1. `findById(id)` → `Optional<Project>` — presente si se encuentra, vacío si no
2. `.map(this::toResponse)` → `Optional<ProjectResponse>` — transforma el valor dentro, sigue vacío si lo estaba
3. `.orElseThrow(...)` → `ProjectResponse` — desenvuelve el valor, o lanza si está vacío

### El patrón más común en Spring Boot

> **Vista previa — Spring Boot:** El `repository` y el `JpaRepository` de abajo son piezas de Spring Boot que aún no has estudiado. Céntrate en el manejo del *Optional* — cómo `findById` devuelve un `Optional` y `orElseThrow` lo desenvuelve. La sección completa "## Generics en Spring Boot", justo después de esta, explica dónde aparece `<T>` a lo largo de la API de Spring.

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

> **Vista previa — Spring Boot:** Los ejemplos a continuación usan `JpaRepository`, `ResponseEntity` y operaciones con streams — conceptos de Spring Boot y Java que puede que aún no hayas estudiado. Léelo para ver cómo `<T>` aparece por todas partes en la API de Spring Boot. Tendrá mucho más sentido una vez que estés en las notas de Spring Boot.

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

---

Los generics dejan un tipo *abierto* — una `Box` funciona con cualquier tipo que le enchufes. El siguiente archivo, `14-enums.md`, trata de la necesidad opuesta: un tipo deliberadamente *cerrado*, que restringe sus propios valores a un pequeño conjunto fijo que defines por adelantado (un estado que solo puede ser `ACTIVE`, `PENDING` o `CLOSED`, nunca nada más). Donde los generics ensanchan lo que un tipo acepta, los enums lo estrechan — y esa es exactamente la garantía que quieres para un campo con un puñado de estados válidos.
