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

Cuando `methodB()` termina (ejecuta su `return`), se quita de la pila — desaparece el de arriba primero. Luego `methodA()` comienza a ejecutarse y cuando termina se quita del stack. Este proceso se repite para todos los métodos, siendo `main()` el último en ejecutarse. Este orden es lo que significa "salen en orden inverso a como entraron": el último que entró (`methodB()`) es el primero que sale. En inglés se llama LIFO (Last In, First Out).

El **stack trace** es la _foto_ de esa pila justo en el instante del error: el texto que ves impreso en la consola con la lista de métodos activos en ese momento. Como las excepciones son objetos normales en Java, llevan dentro tanto el mensaje de error como ese stack trace completo — así sabes exactamente dónde ocurrió el problema y por qué métodos pasó la excepción hasta llegar hasta ahí.

> La frase "se propaga hacia arriba de la pila" es la que verás en la documentación oficial, pero no te la imagines como una flecha subiendo en el diagrama de arriba. "Arriba" aquí significa "hacia el método que la llamó", que en el diagrama se dibuja hacia _abajo_ — el mismo camino que sigue un `return`, solo que interrumpido por un error en vez de un valor normal.

Con estos dos conceptos claros, así es como viaja una excepción. Java lanza un objeto que representa el error justo en el método donde ocurre el fallo — que siempre es el que está en la cima de la pila en ese instante, porque solo el método que se está ejecutando _ahora mismo_ puede fallar en ese momento. Desde ahí, el objeto se propaga **hacia el llamador** (el método que lo llamó), siguiendo el mismo camino LIFO de salida que un `return` normal seguiría, con una diferencia clave: en vez de devolver su valor normal, lo que le llega a cada llamador es el objeto de la excepción. Así, `methodB()` sale con la excepción en vez de con un valor de retorno; si `methodA()` no la captura con un `catch`, también sale hacia `main()`.

Si `main()` tampoco la captura, ahí se acaba el camino — `main()` es siempre el primer método de la pila, así que no hay ningún llamador a quien seguir propagando el error. La aplicación termina y Java imprime en consola el stack trace: la lista de los métodos que estaban activos cuando ocurrió el error (`methodB()`, `methodA()`, `main()`) y por los que la excepción se fue propagando sin que nadie la capturara.

---

## Excepciones comprobadas vs no comprobadas

> Docs: https://www.baeldung.com/java-exceptions → read: "Checked Exception" y "Unchecked Exception"

Java divide las excepciones en dos familias — comprobadas y no comprobadas — y lo que las diferencia no es el nombre, sino que el compilador vigila activamente a una de las dos: te obliga a declarar o capturar sus errores, mientras que a la otra la deja circular libremente sin pedirte nada.

Las **excepciones comprobadas** (_checked_) representan problemas que el llamador debería anticipar porque dependen de algo externo al propio código — un fichero que puede no existir, una conexión de red que puede caerse, una base de datos que puede estar caída. Son fallos que pueden pasar aunque tu lógica esté perfectamente escrita. Por eso el compilador te obliga a hacer algo con ellas: o las capturas con `try/catch`, o declaras en la firma del método que tu método puede lanzarlas con `throws` (esto se explica a fondo en la sección `throws` más abajo). Si no haces ninguna de las dos cosas, el código directamente no compila:

```java
public void readConfig() {
    Files.readString(Path.of("config.txt")); // ERROR de compilación
}
```

Java se niega a compilar precisamente porque ese fichero puede no existir en tiempo de ejecución, y el compilador no te deja ignorar esa posibilidad. El error que ves en ese caso no es una excepción en tiempo de ejecución (el programa ni siquiera llega a arrancar) — es un error de compilación con un mensaje característico: `unreported exception IOException; must be caught or declared to be thrown`. Solo cuando arreglas eso (con `try/catch` o con `throws`) el código compila.

> **Cuándo usar `throws` y cuándo `try/catch`.** Se usan los dos, pero en sitios distintos, no como alternativas intercambiables. Usa `try/catch` cuando el método donde estás _puede_ hacer algo razonable con el fallo ahí mismo — mostrar un mensaje, usar un valor por defecto, reintentar. Usa `throws` cuando ese método no es el lugar adecuado para decidir qué hacer — por ejemplo, un método de bajo nivel que solo lee un fichero no sabe si hay que mostrarle un error al usuario o reintentar la operación; esa decisión le corresponde a quien lo llama, que tiene más contexto. En una aplicación real la cadena típica es varios métodos declarando `throws` y pasándose la excepción unos a otros, hasta que un método que sí sabe qué hacer con ella (normalmente cerca de la interfaz de usuario, o en Spring Boot el `@RestControllerAdvice` que verás más abajo) la captura por fin con `try/catch`.

Aquí tienes las dos formas de arreglar el ejemplo de arriba:

```java
// Arreglada con throws — la decisión de qué hacer pasa al llamador de readConfig()
public void readConfig() throws IOException {
    Files.readString(Path.of("config.txt"));
}
```

```java
// Arreglada con try/catch — la gestionas aquí mismo; nadie fuera de este método se entera de que pasó
public void readConfig() {
    try {
        Files.readString(Path.of("config.txt"));
    } catch (IOException e) {
        System.out.println("No se pudo leer el fichero: " + e.getMessage());
    }
}
```

> **Por qué `throws` y `try/catch` no dan el mismo resultado en tiempo de ejecución.** El error de _compilación_ desaparece en los dos casos — eso es lo único que `throws` y `try/catch` tienen en común. Pero en tiempo de ejecución no son lo mismo. Con `try/catch`, si el fichero no existe, tu propio bloque `catch` recibe el objeto `IOException` (o su subclase más específica, `FileNotFoundException`) y decide qué hacer con él — aquí, imprimir un mensaje — y el programa sigue funcionando con normalidad después. Con `throws`, en cambio, no capturas nada dentro de `readConfig()`: la excepción sale de ese método sin gestionar y sigue el mismo camino LIFO que viste al principio de la nota — si quien llama a `readConfig()` tampoco la captura, sigue subiendo hasta que alguien la gestione o hasta `main()`, y ahí verías exactamente el mismo stack trace sin gestionar que verías si `readConfig()` nunca hubiera tenido ningún `try/catch`.

Estas son las excepciones comprobadas más típicas que te vas a encontrar, junto con el escenario exacto que las dispara:

- `IOException` — falla una operación de entrada/salida: leer o escribir un fichero que no existe o al que no tienes permiso, o que se corta a mitad de la lectura. `Files.readString(Path.of("config.txt"))` la lanza si `config.txt` no está en esa ruta.
- `SQLException` — falla algo al hablar con la base de datos: la conexión se cae, la query tiene un error de sintaxis, o la base de datos rechaza la operación (por ejemplo, una clave única duplicada). La lanza cualquier método de JDBC — la API estándar de Java para conectar con bases de datos relacionales y ejecutar SQL desde código Java — que ejecute una consulta; Spring Boot usa JDBC por debajo aunque tú trabajes casi siempre con una capa más alta como JPA.

Ambas están en la tabla de aquí abajo.

Las **excepciones no comprobadas** (_unchecked_, subclases de `RuntimeException`) representan errores de programación — un `null` que no debería serlo, un índice que se sale del array, un argumento que no tiene sentido. La frase "subclases de `RuntimeException`" quiere decir que son tipos de error distintos entre sí, pero todos heredan de la misma clase padre, `RuntimeException` — es exactamente esa herencia común la que el compilador usa para decidir que no hace falta declararlas (lo verás dibujado en el diagrama de "Jerarquía de excepciones" más abajo). Las excepciones no comprobadas son bugs, no eventos externos (algo fuera de tu control, que puede pasar aunque el código esté perfectamente escrito), sino que son fallos que ocurren _solo_ porque tu propio código tiene un error. Si tu código estuviera bien escrito, nunca deberían fallar. Por eso el compilador no exige nada — no tendría sentido obligarte a declarar en la firma de cada método todos los bugs posibles que podrías llegar a cometer. Estas excepciones se propagan libremente hacia el llamador (el mismo camino LIFO que ya conoces de la sección anterior) hasta que algo las captura o la aplicación se rompe.

Estas son las subclases de `RuntimeException` más típicas que te vas a encontrar constantemente en Java (y en entrevistas técnicas), junto con el escenario exacto que dispara cada una:

- `NullPointerException` — llamas a un método o accedes a un campo sobre una variable que vale `null`: `String s = null; s.length();` revienta porque no hay ningún objeto real detrás de `s` sobre el que ejecutar `length()`.
- `IllegalArgumentException` — un método recibe un valor que, aunque tiene el tipo correcto, no tiene sentido para lo que ese método hace: pasar `-5` a `setAge(int age)` compila perfectamente (es un `int` válido), pero una edad negativa no es un valor lógico.
- `IndexOutOfBoundsException` — accedes a una posición de una lista o array que no existe: `list.get(10)` cuando `list` solo tiene 3 elementos, porque las posiciones válidas van de `0` a `2`.

A estas tres se suma `ArithmeticException`, la que ves justo debajo en el ejemplo de `divide()` — las cuatro juntas son las que más te vas a encontrar en la práctica.

Aquí tienes un ejemplo de código real:

```java
// UNCHECKED — nada te obliga a declararla, es un bug si ocurre
public int divide(int a, int b) {
    return a / b; // si b es 0, lanza ArithmeticException sin ningún aviso — nada exige declararla
}
```

Si la llamas con `divide(10, 0)` y nadie captura el error, la consola imprime algo así:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at ExceptionDemo.divide(ExceptionDemo.java:6)
    at ExceptionDemo.main(ExceptionDemo.java:2)
```

Ese es el stack trace del que hablábamos al principio de la nota: la primera línea (`Exception in thread "main" ...`) te da el tipo de excepción y el mensaje; las líneas `at ...` son la foto de la pila en el instante del fallo — el método donde se lanzó (`divide`, línea 6) y el método por el que pasó antes de llegar, sin que nadie la capturara, hasta `main` (línea 2).

> **Por qué no hace falta ningún `try/catch` ni `throw` para "arreglar" esto.** A diferencia de las comprobadas, el compilador nunca te obliga a nada aquí: `divide()` compila perfectamente tal como está, aunque `b` pueda llegar a valer `0` en tiempo de ejecución. Añadir gestión de este error es una decisión de diseño tuya, no una exigencia del compilador — puedes envolver la llamada en un `try/catch` para capturar el fallo después de que ocurra, o comprobar la condición antes con un `if (b == 0) throw new IllegalArgumentException("b no puede ser 0")` para detectarlo tú mismo con un mensaje más claro antes de que Java lance su propio `ArithmeticException`. Ninguna de las dos es obligatoria; `IOException` sí lo era porque el compilador la vigila, `ArithmeticException` no porque nadie la vigila salvo tú.

|                           | Comprobadas (checked)                                                                                                             | No comprobadas (unchecked)                                                                                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clase padre (`extends`)   | `Exception`                                                                                                                       | `RuntimeException`                                                                                                                                                                                                                                 |
| ¿Hay que declararlas?     | Sí — `throws` o `try/catch`                                                                                                       | No                                                                                                                                                                                                                                                 |
| Representan               | Problemas externos esperables — el fichero no existe, la conexión a la base de datos se cae, el timeout de una llamada a otra API | Errores de programación — bugs que no deberían ocurrir si el código está bien escrito                                                                                                                                                              |
| Ejemplos (situación real) | `IOException` (leyendo un fichero que no existe), `SQLException` (la base de datos rechaza la query o se cae la conexión)         | `NullPointerException` (llamas a un método sobre algo que es `null`), `IllegalArgumentException` (pasas un valor que no tiene sentido, como una edad negativa), `IndexOutOfBoundsException` (accedes a la posición 10 de una lista de 3 elementos) |

La fila "Clase padre" indica de qué clase hereda cada tipo de excepción — es lo que determina si el compilador la trata como comprobada o no: toda excepción que extienda `Exception` es comprobada; toda excepción que extienda `RuntimeException` es no comprobada. La jerarquía completa se explica más abajo en "Jerarquía de excepciones".

En Spring Boot casi siempre trabajas con excepciones no comprobadas — incluso cuando el problema real es "externo" en el mismo sentido que viste arriba (un empleado que no existe en la base de datos es justo el tipo de fallo esperable que, en teoría, encajaría como comprobada). La razón para no hacerlo así es de arquitectura, no del tipo de error en sí: una API REST típica tiene varias capas apiladas (`repository` → `service` → `controller`), y si `EmployeeNotFoundException` fuera comprobada, cada una de esas capas tendría que declarar `throws EmployeeNotFoundException` o envolverla en su propio `try/catch` — repitiendo el mismo boilerplate en cada controller que llama a ese servicio, solo para poder compilar. Con una excepción no comprobada, en cambio, no hay ninguna obligación del compilador: el objeto se propaga libremente hacia arriba (el mismo camino LIFO de siempre) sin que ninguna capa intermedia tenga que tocarlo, hasta que llega a un único punto centralizado — la clase `@RestControllerAdvice` que ves más abajo — que lo captura y decide qué código HTTP devolver. Por eso la convención en Spring Boot es lanzar una excepción no comprobada propia (como `EmployeeNotFoundException` más abajo) y dejar que ese `@RestControllerAdvice` la gestione en un solo sitio, en lugar de forzar a cada controller a declarar `throws` y llenar el código de `try/catch` repetidos.

El patrón de "envolver" (_wrap_) sirve para relanzar una excepción que de verdad es comprobada — como `IOException` o `SQLException` — convirtiéndola en no comprobada. No es el mismo caso que `EmployeeNotFoundException` de más arriba: esa la defines tú mismo extendiendo `RuntimeException` directamente, así que nunca pasa por comprobada y nunca necesita este paso. El ejemplo siguiente usa `Files.readString()`, que sí lanza `IOException` comprobada, para mostrar el patrón en la práctica:

```java
public String loadFile(String path) {
    try {
        return Files.readString(Path.of(path));
    } catch (IOException e) {
        // "envuelves" la excepción comprobada dentro de una no comprobada
        throw new RuntimeException("No se pudo leer el fichero: " + path, e);
        //                                                                 ^ el segundo argumento
        //                          es la "cause" — la excepción original queda guardada dentro
    }
}
```

`RuntimeException` (igual que casi todas las excepciones de Java) tiene un constructor que acepta un `Throwable` como segundo argumento. Ojo con la palabra "envolver": no relanzas la misma excepción `IOException` — creas un objeto completamente nuevo, de tipo `RuntimeException`, y le pasas la excepción original (`e`) como segundo argumento de su constructor; ese objeto original queda guardado dentro del nuevo como su **cause**, accesible después con `nuevaExcepcion.getCause()`. Esto es importante: no pierdes información, el stack trace de la excepción original sigue disponible dentro de la nueva (verás algo como `Caused by: java.io.IOException...` al final del stack trace impreso). La ventaja es que `loadFile()` ya no necesita `throws IOException` en su firma — el llamador ya no está obligado por el compilador a manejarla, aunque sigue pudiendo hacerlo si quiere con `catch (RuntimeException e)`.

> **Cuidado con "envolver" una excepción comprobada.** Es un patrón válido y muy común en Spring Boot, pero pierde la garantía del compilador — a partir de ahí, nadie te obliga a acordarte de gestionarla. Hazlo con intención (normalmente porque quieres simplificar la firma de tus métodos y dejar que un `@RestControllerAdvice` maneje el error de forma centralizada), no por evitar escribir `throws` sin pensarlo. Tienes el código completo de ese `@RestControllerAdvice` en acción más abajo, en la sección "Conexión con Spring Boot".

---

## try / catch / finally

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html → read: "Catching and Handling Exceptions"

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

> **¿Por qué importa el orden de los `catch`? ¿Qué pasa si me equivoco?** Java comprueba los bloques `catch` de arriba a abajo y ejecuta el _primero_ cuyo tipo coincida con la excepción lanzada — nunca sigue comprobando, aunque un bloque posterior también encajaría. Si las dos excepciones no tienen relación (como `IOException` y `NumberFormatException` arriba), el orden es solo cuestión de estilo. Pero si una es superclase de la otra — por ejemplo `Exception` e `IOException` — y pones la superclase (`Exception`) primero, el código directamente no compila: `catch (IOException e)` se queda inalcanzable, porque cualquier `IOException` ya coincide con el `catch (Exception e)` de encima. El error exacto es `exception IOException has already been caught`. Por eso la regla es "la más específica primero": no es una preferencia de estilo, es lo único que hace que ambos bloques sean alcanzables.

> **¿Se ejecuta `finally` aunque el bloque `try` tenga un `return`?** Sí — es el gotcha clásico de entrevista de Java. `finally` se ejecuta _antes_ de que el método devuelva de verdad, incluso si `try` ya llegó a un `return`:
>
> ```java
> public int test() {
>     try {
>         return 1;
>     } finally {
>         System.out.println("finally se ejecuta primero"); // se imprime antes de que el método devuelva
>     }
> }
> // test() sigue devolviendo 1 — pero solo después de imprimir "finally se ejecuta primero"
> ```
>
> La trampa que hay que evitar: si `finally` _también_ tiene un `return`, sobreescribe en silencio el valor que venía de `try` — el `return 1` del bloque `try` se descarta y se reemplaza. Se considera mala práctica precisamente por eso, porque esconde un cambio de valor de retorno dentro del código de limpieza; nunca pongas un `return` dentro de `finally`.

### Capturar múltiples excepciones en un solo bloque

```java
try {
    // ...
} catch (IOException | SQLException e) {
    System.out.println("Data error: " + e.getMessage());
}
```

> El multi-catch solo acepta tipos de excepción que no tengan relación padre-hijo entre sí. `IOException | SQLException` funciona porque ninguna extiende a la otra. `IOException | FileNotFoundException` no compilaría, porque `FileNotFoundException` ya extiende `IOException` — el compilador lo rechaza por redundante, ya que capturar `IOException` sola ya la cubre.

---

## throw — lanzar una excepción manualmente

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/throwing.html → read: "Throwing Exceptions"

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

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/declaring.html → read: "Specifying the Exceptions Thrown by a Method"

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

> Docs: https://www.baeldung.com/java-exceptions → read: "Custom Exception"

Crea tu propia clase de excepción para dar nombres significativos a los errores:

```java
// No comprobada — extiende RuntimeException (la más común en Spring Boot)
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

`super("Employee not found with id: " + id)` llama al propio constructor de `RuntimeException` — el que guarda un mensaje — pasándole el string que construyes aquí. Es el mismo `super()` que ya usas para invocar el constructor de la clase padre en cualquier subclase; esta vez el padre simplemente es `RuntimeException`. Ese mensaje es lo que devuelve `e.getMessage()` más tarde, tanto en un bloque `catch` como en un `@ExceptionHandler`.

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

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html → read: "The try-with-resources Statement"

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

> Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: "Using @ControllerAdvice" y "The Handler Methods"

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

> Docs: https://www.baeldung.com/java-exceptions → read: "Exception Hierarchy"

Toda excepción en Java extiende `Throwable`. Las dos subclases directas son `Error` (fallos a nivel JVM que nunca debes capturar — memoria agotada, stack overflow) y `Exception` (problemas que tu aplicación puede manejar). `RuntimeException` es la rama no comprobada bajo `Exception`. Tus excepciones personalizadas siempre extienden `RuntimeException` en Spring Boot — van en ese grupo inferior.

> **¿Por qué no capturar `Error`?** Cuando se lanza un `Error` como `OutOfMemoryError` o `StackOverflowError`, la JVM ya está en un estado roto — no queda memoria libre para ejecutar tu bloque `catch` de forma fiable, o la propia pila de llamadas acaba de desbordarse. Capturarlo no arregla nada; solo retrasa un crash que va a pasar de todas formas, y puede esconder el problema real en vez de dejar que la aplicación falle rápido y de forma visible.

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
