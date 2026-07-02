# Excepciones

> 📖 [Baeldung — Exception Handling in Java](https://www.baeldung.com/java-exceptions)
> 📖 [Oracle Docs — Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

Sin excepciones, cada método tendría que devolver un valor especial (como `-1` o `null`) para avisar de que algo salió mal, y el código que llama a ese método tendría que comprobar ese valor cada vez. Ese sistema se rompe enseguida: es fácil olvidarse de la comprobación, la señal de error se pierde después de pasar por unas cuantas llamadas, y al final tienes bugs silenciosos que nadie detecta.

Un apunte sobre dos términos que se confunden con facilidad, antes de ver cómo viaja la excepción. La **pila de llamadas** (_call stack_) es la estructura viva que Java mantiene mientras el programa corre, como una pila de platos en una cocina. Cada vez que un método llama a otro, el método nuevo se coloca _encima_ del anterior — los métodos nuevos quedan más arriba en la pila y los viejos más abajo. Por ejemplo, si `main()` llama a `methodA()`, y `methodA()` llama a `methodB()`, la pila se ve así:

```
[top]    methodB()  ← el que se está ejecutando ahora
         methodA()
         main()
[bottom]
```

Cuando `methodB()` termina (ejecuta su `return`), se quita de la pila — desaparece el de arriba primero. Luego `methodA()` termina y se quita. Por último `main()`. Este orden es lo que significa "salen en orden inverso a como entraron": el último que entró (`methodB()`) es el primero que sale. En inglés se llama LIFO (Last In, First Out).

El **stack trace** es la _foto_ de esa pila justo en el instante del error: es el texto que ves impreso en la consola con la lista de métodos activos en ese momento. El `call stack` es la estructura dinámica que cambia constantemente mientras el programa corre — métodos que entran, métodos que salen. El `stack trace` es la copia impresa de esa estructura en un momento concreto (cuando ocurre el error) — y esa lista de métodos impresa es exactamente el camino que recorrió el objeto de la excepción sin ser capturado, como vas a ver ahora. Como las excepciones son objetos normales en Java, llevan dentro tanto el mensaje de error como ese stack trace completo — así sabes exactamente dónde ocurrió el problema y por qué camino de métodos llegó hasta ahí.

Con estos dos conceptos claros, así es como viaja una excepción. Java resuelve el problema de los errores silenciosos lanzando un objeto que representa el error justo en el método donde ocurre el fallo. Ese método donde ocurre el fallo siempre es el que está en la cima de la pila en ese instante — no porque `methodB()` tenga algo especial, sino porque solo el método que se está ejecutando *ahora mismo* puede fallar ahora mismo. Si en cambio el error ocurriera dentro de `methodA()`, sería porque `methodB()` ya habría terminado sin problemas y se habría quitado de la pila — en ese momento `methodA()` sería el que está en la cima. La cima de la pila siempre coincide con el punto exacto de ejecución del programa, así que el error siempre nace ahí.

Desde ese punto, el objeto de excepción no "sube" en el sentido físico del diagrama — se propaga **hacia el llamador** (el método que llamó al método donde falló todo, siguiendo la cadena hacia atrás). Sigue exactamente el mismo camino de salida que un `return` normal seguiría, con una diferencia clave: en vez de devolver el valor normal del `return`, lo que le llega a cada llamador es el objeto de la excepción. Así que `methodB()` no devuelve nada — sale con la excepción en la mano. `methodA()` la recibe; si no la captura con un `catch`, tampoco puede seguir ejecutando su propio código normal, así que también sale con la excepción hacia `main()`. Es el mismo recorrido LIFO que ya conoces — la excepción simplemente reemplaza el flujo normal de retorno en cada parada del camino.

Si `main()` tampoco la captura, ahí se acaba el camino — `main()` es siempre el primer método de la pila (el que arrancó el programa), así que no hay ningún llamador por encima de él a quien seguir propagando el error. Como no queda nadie que lo capture, la aplicación termina y Java imprime el stack trace en la consola: la lista completa de métodos (`methodB()`, `methodA()`, `main()`) por los que pasó la excepción sin que nadie la resolviera — el mismo camino LIFO, ahora convertido en texto.

---

## Excepciones comprobadas vs no comprobadas

Java divide las excepciones en dos familias. Las **excepciones comprobadas** (_checked_) representan problemas que el llamador debería anticipar — como un fichero no encontrado o un timeout de red. El compilador te obliga a capturarlas o a declarar que tu método puede lanzarlas. Las **excepciones no comprobadas** (_unchecked_, subclases de `RuntimeException`) representan errores de programación — punteros nulos, índices incorrectos, argumentos inválidos. El compilador no exige nada; se propagan hacia arriba hasta que algo las captura o la aplicación se rompe.

|                       | Comprobadas (checked)                                       | No comprobadas (unchecked)                                                      |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Extiende              | `Exception`                                                 | `RuntimeException`                                                              |
| ¿Hay que declararlas? | Sí — `throws` o `try/catch`                                 | No                                                                              |
| Cuándo                | Problemas esperados (fichero no encontrado, timeout de red) | Errores de programación (puntero nulo, índice fuera de rango)                   |
| Ejemplos              | `IOException`, `SQLException`                               | `NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException` |

En Spring Boot casi siempre trabajas con excepciones no comprobadas — las lanzas cuando algo va mal y dejas que Spring las maneje con `@RestControllerAdvice`.

JavaScript no tiene nada parecido a esta división — todo error en JS es, en la práctica, "no comprobado": no hay ningún compilador que te obligue a capturar o declarar nada. La distinción entre comprobadas y no comprobadas es específica de Java, y es justo el tipo de cosa con la que tropieza un desarrollador de JS la primera vez que el compilador se niega a compilar porque falta un `catch`.

---

## try / catch / finally

Envuelves el código arriesgado en un bloque `try` y gestionas cada posible fallo en su propio bloque `catch`. `finally` se ejecuta siempre, pase lo que pase — úsalo para cerrar conexiones o liberar recursos incluso cuando se produce una excepción. La sintaxis te resultará familiar: `try`/`catch`/`finally` funciona igual en JavaScript — la diferencia en Java está en qué puedes capturar y qué te exige declarar el compilador (ver comprobadas vs no comprobadas más arriba):

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

> **¿Por qué no dejar un bloque `catch` vacío?** Un `catch` vacío se traga el error en silencio — el programa sigue como si nada y pierdes tanto el mensaje como el stack trace, así que el bug se vuelve invisible. Como mínimo registra la excepción; nunca escribas `catch (Exception e) {}`.

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

`throw` es la misma palabra clave que ya conoces de JavaScript — la diferencia está en qué puedes lanzar. JS te deja lanzar cualquier valor (un string, un número, un objeto cualquiera); Java solo te deja lanzar un objeto cuya clase extienda `Throwable`, por eso todo lo que lanzas tiene que ser una clase de excepción de verdad.

---

## throws — declarar excepciones comprobadas

Las excepciones comprobadas deben declararse en la firma del método para que el compilador obligue a cada llamador a decidir: gestionarla aquí o propagarla hacia arriba. Si un método puede lanzar una excepción comprobada y no la captura, debe declararla con `throws`:

```java
public String readFile(String path) throws IOException {
    // si esto lanza IOException, el llamador debe manejarla
    return Files.readString(Path.of(path));
}
```

JavaScript no tiene nada equivalente a `throws` — no existe forma de declarar en la firma de una función que puede lanzar algo, y nada obliga al llamador a manejarlo. `throws` solo existe en Java para cumplir la regla de las excepciones comprobadas explicada arriba; nunca lo escribirás para una excepción no comprobada.

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

JavaScript te deja hacer algo que parece similar (`class NotFoundError extends Error {}`), pero no es el mismo mecanismo. En JS es una convención sin ninguna imposición — nada te impide lanzar un simple string en su lugar, y no hay ningún compilador comprobando el tipo. En Java, extender `RuntimeException` conecta la clase con la jerarquía de tipos real: `catch (EmployeeNotFoundException e)` solo coincide con ese tipo exacto (o sus subclases), y `@ExceptionHandler(EmployeeNotFoundException.class)` en Spring Boot se apoya en esa jerarquía para dirigir cada error al manejador correcto.

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

JavaScript no tiene un equivalente directo — lo más parecido que has hecho es cerrar un recurso manualmente dentro de un `finally`. `try-with-resources` automatiza justo esa limpieza basada en `finally` y garantiza que ocurre incluso si el bloque `try` lanza una excepción.

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
