# Excepciones

> 📖 [Baeldung — Exception Handling in Java](https://www.baeldung.com/java-exceptions)
> 📖 [Oracle Docs — Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

Sin excepciones, cada método tendría que devolver un valor especial (como `-1` o `null`) para señalar que algo salió mal — y cada llamador tendría que comprobar ese valor. Ese convenio se rompe rápido: los llamadores se olvidan de comprobarlo, la señal se pierde tras unas pocas llamadas y los errores se convierten en bugs silenciosos. Java usa excepciones en su lugar: cuando algo falla, el método *lanza* un objeto que sube por la pila de llamadas hasta que algo lo *captura*. La pila de llamadas — el rastro completo de cada método que estaba en ejecución cuando ocurrió el error — es lo que ves en la consola cuando la aplicación se rompe. Las excepciones son objetos en Java, así que llevan tanto el mensaje como el stack trace completo.

---

## Excepciones comprobadas vs no comprobadas

Java divide las excepciones en dos familias. Las **excepciones comprobadas** (_checked_) representan problemas que el llamador debería anticipar — como un fichero no encontrado o un timeout de red. El compilador te obliga a capturarlas o a declarar que tu método puede lanzarlas. Las **excepciones no comprobadas** (_unchecked_, subclases de `RuntimeException`) representan errores de programación — punteros nulos, índices incorrectos, argumentos inválidos. El compilador no exige nada; se propagan hacia arriba hasta que algo las captura o la aplicación se rompe.

| | Comprobadas (checked) | No comprobadas (unchecked) |
|---|---------|-----------|
| Extiende | `Exception` | `RuntimeException` |
| ¿Hay que declararlas? | Sí — `throws` o `try/catch` | No |
| Cuándo | Problemas esperados (fichero no encontrado, timeout de red) | Errores de programación (puntero nulo, índice fuera de rango) |
| Ejemplos | `IOException`, `SQLException` | `NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException` |

En Spring Boot casi siempre trabajas con excepciones no comprobadas — las lanzas cuando algo va mal y dejas que Spring las maneje con `@RestControllerAdvice`.

---

## try / catch / finally

Envuelves el código arriesgado en un bloque `try` y gestionas cada posible fallo en su propio bloque `catch`. `finally` se ejecuta siempre, pase lo que pase — úsalo para cerrar conexiones o liberar recursos incluso cuando se produce una excepción:

```java
try {
    // código que podría lanzar una excepción
    String content = readFile("data.txt");
    int number = Integer.parseInt(content);
} catch (IOException e) {
    System.out.println("File error: " + e.getMessage());
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} finally {
    System.out.println("Esto siempre se ejecuta — limpia recursos aquí");
}
```

- `catch` recibe el objeto de excepción — usa `e.getMessage()` para el mensaje, `e.printStackTrace()` para el trace completo
- Los bloques `catch` múltiples se comprueban de arriba a abajo — pon las excepciones más específicas antes que las más generales
- `finally` siempre se ejecuta — usado para cerrar ficheros, conexiones de base de datos, etc.

### Capturar múltiples excepciones en un solo bloque

```java
try {
    // ...
} catch (IOException | SQLException e) {
    System.out.println("Data error: " + e.getMessage());
}
```

---

## throw — lanzar una excepción manualmente

Usas `throw` cuando detectas un estado inválido en tu propio código y quieres detener la ejecución de inmediato con una explicación clara — por ejemplo, cuando el llamador pasa un valor que no tiene ningún sentido:

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative: " + age);
    }
    this.age = age;
}
```

Lanza siempre con un mensaje que explique qué salió mal y qué valor lo causó.

---

## throws — declarar excepciones comprobadas

Las excepciones comprobadas deben declararse en la firma del método para que el compilador obligue a cada llamador a decidir: gestionarla aquí o propagarla hacia arriba. Si un método puede lanzar una excepción comprobada y no la captura, debe declararla con `throws`:

```java
public String readFile(String path) throws IOException {
    // si esto lanza IOException, el llamador debe manejarla
    return Files.readString(Path.of(path));
}
```

---

## Excepciones personalizadas

Crea tu propia clase de excepción para dar nombres significativos a los errores:

```java
// No comprobada — extiende RuntimeException (la más común en Spring Boot)
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

El ejemplo de uso a continuación llama a `repository.findById(id)` — `repository` es un concepto de Spring Boot que aún no has estudiado. Léelo para ver por qué existen las excepciones personalizadas; escribirás exactamente este patrón en las notas de Spring Boot.

```java
// Uso
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

---

## try-with-resources

Cierra automáticamente los recursos (ficheros, conexiones de base de datos) cuando el bloque try termina — sin necesidad de `finally`:

```java
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}
// reader se cierra automáticamente aquí, incluso si ocurrió una excepción
```

El recurso debe implementar `AutoCloseable`. Las conexiones de base de datos en Spring Boot se gestionan automáticamente — no escribirás try-with-resources para trabajo con base de datos, pero lo verás en operaciones con ficheros y red.

---

## Conexión con Spring Boot

> **Vista previa — Spring Boot:** Esta sección usa `@RestControllerAdvice`, `@ExceptionHandler` y `ResponseEntity` — clases de Spring Boot que aún no has estudiado. Léela para ver cómo las excepciones Java se conectan a una API web. Construirás exactamente este patrón en las notas de Spring Boot.

El patrón estándar en Spring Boot:

```java
// 1. Lanzar una excepción personalizada en el servicio
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}

// 2. Capturarla globalmente y devolver una respuesta HTTP correcta
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EmployeeNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}
```

De este modo, el servicio lanza excepciones limpiamente y el controller advice gestiona los códigos de estado HTTP en un único lugar central.

---

## Jerarquía de excepciones

Toda excepción en Java extiende `Throwable`. Las dos subclases directas son `Error` (fallos a nivel JVM que nunca debes capturar — memoria agotada, stack overflow) y `Exception` (problemas que tu aplicación puede manejar). `RuntimeException` es la rama no comprobada bajo `Exception`. Tus excepciones personalizadas siempre extienden `RuntimeException` en Spring Boot — van en ese grupo inferior.

```
Throwable
├── Error (problemas a nivel JVM — OutOfMemoryError, StackOverflowError — no los captures)
└── Exception
    ├── IOException (checked)
    ├── SQLException (checked)
    └── RuntimeException (unchecked)
        ├── NullPointerException
        ├── IllegalArgumentException
        ├── IllegalStateException
        ├── IndexOutOfBoundsException
        └── tus subclases personalizadas de RuntimeException
```
