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

Cuando `methodB()` termina (ejecuta su `return`), se quita de la cima de la pila — desaparece el de arriba primero. Luego `methodA()` termina y se quita. Por último, `main()`. Este orden es lo que significa "salir en orden inverso": el último que entró es el primero que sale. Dicho de otro modo, LIFO (Last In, First Out).

El **stack trace** es la _foto_ de esa pila justo en el instante del error: el texto que ves impreso en la consola con la lista de métodos activos en ese momento. La `pila de llamadas` es la estructura dinámica que cambia constantemente mientras el programa corre; el `stack trace` es la copia impresa de esa estructura en un instante concreto. Como las excepciones son objetos normales en Java, llevan dentro tanto el mensaje de error como ese stack trace completo — así sabes exactamente dónde ocurrió el problema y por qué métodos pasó la excepción hasta llegar hasta ahí.

Con estos dos conceptos claros, así es como viaja una excepción. Java lanza un objeto que representa el error justo en el método donde ocurre el fallo — que siempre es el que está en la cima de la pila en ese instante, porque solo el método que se está ejecutando _ahora mismo_ puede fallar en ese momento. Desde ahí, el objeto se propaga **hacia el llamador** (el método que lo llamó), siguiendo el mismo camino LIFO de salida que un `return` normal seguiría, con una diferencia clave: en vez de devolver su valor normal, lo que le llega a cada llamador es el objeto de la excepción. Así, `methodB()` sale con la excepción en vez de con un valor de retorno; si `methodA()` no la captura con un `catch`, también sale hacia `main()`.

Si `main()` tampoco la captura, ahí se acaba el camino — `main()` es siempre el primer método de la pila, así que no hay ningún llamador a quien seguir propagando el error. La aplicación termina y Java imprime en consola el stack trace: la lista de los métodos que estaban activos cuando ocurrió el error (`methodB()`, `methodA()`, `main()`) y por los que la excepción se fue propagando sin que nadie la capturara.

> La frase "se propaga hacia arriba de la pila" es la que verás en la documentación oficial, pero no te la imagines como una flecha subiendo en el diagrama de arriba. "Arriba" aquí significa "hacia el método que la llamó", que en el diagrama se dibuja hacia _abajo_ — el mismo camino que sigue un `return`, solo que interrumpido por un error en vez de un valor normal.

---

## Jerarquía de excepciones

> Docs: https://www.baeldung.com/java-exceptions → read: "Exception Hierarchy"
> 📖 Oracle Docs (Javadoc de `Throwable`): https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html → mira el apartado "All Known Subclasses" para ver la jerarquía completa documentada por Oracle

La JVM (_Java Virtual Machine_) es el programa que realmente ejecuta tu código Java — cuando compilas, Java no genera código máquina directo para tu ordenador, genera bytecode, y es la JVM la que lo interpreta y lo ejecuta, reservando y gestionando ella misma la memoria que tu programa necesita (donde viven tus objetos, la propia pila de llamadas que viste al principio de la nota, etc.). Un fallo "a nivel JVM" es un fallo que ocurre en ese motor de ejecución mismo, no en la lógica de tu programa: por ejemplo, si tu programa crea tantos objetos que la memoria que la JVM tiene reservada se agota por completo, la JVM ya no tiene dónde seguir creando cosas y lanza `OutOfMemoryError`; si una cadena de llamadas a métodos es tan profunda (por ejemplo, una recursión sin condición de parada) que la pila de llamadas se queda sin espacio físico para seguir apilando métodos, la JVM lanza `StackOverflowError`. En los dos casos el problema no es "tu código tiene un bug de lógica" (como sí pasa con `RuntimeException`) — es que el propio entorno donde se ejecuta tu programa se ha quedado sin recursos para seguir funcionando, algo que normalmente no puedes arreglar desde un `catch`.

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

Esta jerarquía es la base de todo lo que viene a continuación: la distinción entre comprobadas y no comprobadas que ves justo debajo depende exactamente de qué rama de este árbol extiende cada excepción — `Exception` (comprobada) o `RuntimeException` (no comprobada).

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

Las **excepciones no comprobadas** (_unchecked_, subclases de `RuntimeException`) representan errores de programación — un `null` que no debería serlo, un índice que se sale del array, un argumento que no tiene sentido. La frase "subclases de `RuntimeException`" quiere decir que son tipos de error distintos entre sí, pero todos heredan de la misma clase padre, `RuntimeException` — es exactamente esa herencia común la que el compilador usa para decidir que no hace falta declararlas (lo verás dibujado en el diagrama de "Jerarquía de excepciones" más abajo). Son bugs, no eventos externos: aquí "evento externo" es lo contrario de lo que viste con las comprobadas — no es "el fichero no existe" (algo fuera de tu control, que puede pasar aunque el código esté perfectamente escrito), sino un fallo que ocurre _solo_ porque tu propio código tiene un bug. Si tu código estuviera bien escrito, nunca deberían fallar. Por eso el compilador no exige nada — no tendría sentido obligarte a declarar en la firma de cada método todos los bugs posibles que podrías llegar a cometer. Estas excepciones se propagan libremente hacia el llamador (el mismo camino LIFO que ya conoces de la sección anterior) hasta que algo las captura o la aplicación se rompe.

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

> Aquí es fácil caer en la misma trampa de antes: "se propaga hacia arriba" es la frase estándar en la documentación de Java, pero como ya viste, "arriba" significa "hacia el método que la llamó", no "arriba en el diagrama de la pila" — que en realidad se dibuja hacia abajo. La pila de la sección anterior está bien dibujada; es la palabra "arriba" la que engaña si te la tomas al pie de la letra. De aquí en adelante verás las dos formas en la documentación real (*"se propaga hacia arriba de la pila"*) — cuando la veas, tradúcela mentalmente como "hacia el llamador".

|                           | Comprobadas (checked)                                                                                                             | No comprobadas (unchecked)                                                                                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clase padre (`extends`)   | `Exception`                                                                                                                       | `RuntimeException`                                                                                                                                                                                                                                 |
| ¿Hay que declararlas?     | Sí — `throws` o `try/catch`                                                                                                       | No                                                                                                                                                                                                                                                 |
| Representan               | Problemas externos esperables — el fichero no existe, la conexión a la base de datos se cae, el timeout de una llamada a otra API | Errores de programación — bugs que no deberían ocurrir si el código está bien escrito                                                                                                                                                              |
| Ejemplos (situación real) | `IOException` (leyendo un fichero que no existe), `SQLException` (la base de datos rechaza la query o se cae la conexión)         | `NullPointerException` (llamas a un método sobre algo que es `null`), `IllegalArgumentException` (pasas un valor que no tiene sentido, como una edad negativa), `IndexOutOfBoundsException` (accedes a la posición 10 de una lista de 3 elementos) |

La fila "Clase padre" indica de qué clase hereda cada tipo de excepción — es lo que determina si el compilador la trata como comprobada o no: toda excepción que extienda `Exception` es comprobada; toda excepción que extienda `RuntimeException` es no comprobada. La jerarquía completa se explica más abajo en "Jerarquía de excepciones".

En Spring Boot casi siempre trabajas con excepciones no comprobadas — incluso cuando el problema real es "externo" en el mismo sentido que viste arriba (un empleado que no existe en la base de datos es justo el tipo de fallo esperable que, en teoría, encajaría como comprobada). La razón para no hacerlo así es de arquitectura, no del tipo de error en sí: una API REST típica tiene varias capas apiladas (`repository` → `service` → `controller`), y si `EmployeeNotFoundException` fuera comprobada, cada una de esas capas tendría que declarar `throws EmployeeNotFoundException` o envolverla en su propio `try/catch` — repitiendo el mismo boilerplate en cada controller que llama a ese servicio, solo para poder compilar. Con una excepción no comprobada, en cambio, no hay ninguna obligación del compilador: el objeto se propaga libremente hacia arriba (el mismo camino LIFO de siempre) sin que ninguna capa intermedia tenga que tocarlo, hasta que llega a un único punto centralizado — la clase `@RestControllerAdvice` que ves más abajo — que lo captura y decide qué código HTTP devolver. Por eso la convención en Spring Boot es lanzar una excepción no comprobada propia (como `EmployeeNotFoundException` más abajo) y dejar que ese `@RestControllerAdvice` la gestione en un solo sitio, en lugar de forzar a cada controller a declarar `throws` y llenar el código de `try/catch` repetidos.

Para lanzar una excepción propia, lo primero es definir la clase que la representa — extiende `RuntimeException` (no comprobada, como ya sabes) y le das un constructor:

```java
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

Extiende `RuntimeException` directamente — por eso es no comprobada desde el mismo momento en que la escribes, sin depender de si hay o no una excepción comprobada más abajo en la pila. El constructor recibe el `id` que no se encontró y llama a `super(...)`, el constructor de `RuntimeException`, pasándole el mensaje ya formado; ese mensaje es justo lo que `e.getMessage()` te devuelve más tarde dentro de un `@ExceptionHandler` (lo verás más abajo). Que el dato que falta sea "externo" — una fila que no existe en la base de datos — no obliga a envolver nada: envolver solo hace falta cuando estás llamando a un método ajeno que el compilador ya trata como comprobado, como `Files.readString()` en el ejemplo de más abajo. Aquí no hay ningún método externo lanzando una excepción comprobada de por medio — tú mismo decides crear `EmployeeNotFoundException` desde cero como no comprobada, así que no hay ninguna excepción comprobada previa que convertir. Vuelves a ver esta misma clase, con más contexto todavía, en la sección "Excepciones personalizadas" más abajo.

Con la clase ya definida, lanzarla es tan simple como cualquier otro `throw` — no hace falta declarar nada en la firma del método, precisamente porque es no comprobada:

```java
public void setManager(Employee employee) {
    if (employee == null) {
        throw new EmployeeNotFoundException(-1L);
    }
    // ...
}
```

Este es el caso general — un `throw new EmployeeNotFoundException(...)` normal, en medio de cualquier método, sin nada especial alrededor. En el proyecto, sin embargo, la vas a lanzar casi siempre desde un método que devuelve un `Optional`, como `repository.findById(id)` (un método de Spring Boot que verás más adelante). `Optional` es el tipo que usa Spring Data para decir "puede que haya un valor, puede que no" en vez de devolver directamente `null`, y su método `orElseThrow()` hace justo eso: si el `Optional` tiene un valor dentro, lo devuelve; si está vacío, ejecuta la función que le pasas y lanza lo que esa función devuelva. Por eso ves este patrón tan a menudo:

```java
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

No es una sintaxis distinta para lanzar excepciones — es el mismo `throw new EmployeeNotFoundException(id)` de arriba, solo que envuelto en la lambda `() -> ...` que `orElseThrow()` espera recibir, para poder ejecutarla únicamente si de verdad hace falta.

Tienes razón en la intuición: en un proyecto Spring Boot normal vas a crear muchas más excepciones propias (como `EmployeeNotFoundException`) que envolturas — el wrap es la excepción, no la norma. Los casos reales en los que lo usarás son pocos y concretos: leer o escribir ficheros con las clases de `java.io`/`java.nio` (`Files.readString()`, `FileReader`, todas comprobadas), parsear fechas con las clases antiguas de fecha (`java.text.SimpleDateFormat` lanza `ParseException`, comprobada), o al implementar un método de una interfaz ajena que no te deja añadir `throws` en tu propia firma porque el método de la interfaz no lo declara. `SQLException` es comprobada en JDBC puro, pero en Spring Boot casi nunca la ves directamente — Spring Data ya la envuelve por ti en su propia jerarquía de excepciones no comprobadas (`DataAccessException` y subclases) antes de que te llegue, así que tampoco tendrás que envolverla tú mismo. El patrón de "envolver" (_wrap_) sirve para relanzar una excepción que es comprobada — como `IOException` o `SQLException` — convirtiéndola en no comprobada. No es el mismo caso que `EmployeeNotFoundException` de más arriba, aunque las dos representen un problema "externo" en el sentido de depender de un dato que puede faltar: `EmployeeNotFoundException` nunca ha sido una excepción comprobada — la defines tú mismo extendiendo `RuntimeException` directamente desde el principio, así que el compilador jamás la trató como comprobada y no hay nada que envolver. El wrap solo hace falta cuando el compilador sí exige `throws` o `try/catch` porque la excepción original — como `IOException` — extiende `Exception` y no `RuntimeException`. El ejemplo siguiente usa `Files.readString()`, que sí lanza `IOException` comprobada, para mostrar el patrón en la práctica:

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

`Throwable` es la clase raíz de toda la jerarquía de excepciones en Java — literalmente "lo que se puede lanzar" (_throw-able_): cualquier objeto que quieras pasarle a `throw` tiene que ser, en algún punto de su árbol de herencia, un `Throwable`. Que "toda excepción hereda de `Throwable`" significa que `Exception`, `RuntimeException`, `IOException`, y hasta tu propia `EmployeeNotFoundException`, son todas — directa o indirectamente — subtipos de esa misma clase raíz (lo verás dibujado completo en el diagrama de "Jerarquía de excepciones" al final de la nota). Esto es precisamente lo que hace posible el constructor que ves aquí: como todo lo que puedes lanzar en Java es un `Throwable`, un constructor que acepta un `Throwable` como parámetro puede recibir _cualquier_ tipo de excepción como argumento — no hay que sobrecargarlo un método distinto por cada tipo posible.

`RuntimeException` (igual que casi todas las excepciones de Java) tiene un constructor que acepta un `Throwable` como segundo argumento. Ojo con la palabra "envolver": no relanzas la misma excepción `IOException` — creas un objeto completamente nuevo, de tipo `RuntimeException`, y le pasas la excepción original (`e`) como segundo argumento de su constructor; ese objeto original queda guardado dentro del nuevo como su **cause** para enlazarla con la excepción que la originó de verdad, de forma que la traza del fallo real nunca se pierde. Si más adelante alguien captura esta nueva `RuntimeException` (por ejemplo con `catch (RuntimeException e)`), puede recuperar la excepción original llamando a `e.getCause()` sobre ese mismo objeto capturado — no hace falta ningún nombre especial de variable, es el `e` normal de cualquier bloque `catch`. Esto es importante: no pierdes información, el stack trace de la excepción original sigue disponible dentro de la nueva (verás algo como `Caused by: java.io.IOException...` al final del stack trace impreso). La ventaja es que `loadFile()` ya no necesita `throws IOException` en su firma — el llamador ya no está obligado por el compilador a manejarla, aunque sigue pudiendo hacerlo si quiere con `catch (RuntimeException e)`. En un proyecto Spring Boot real lo habitual es no capturarla manualmente en ningún punto intermedio: la dejas subir sin gestionar, igual que con `EmployeeNotFoundException`, hasta que el `@RestControllerAdvice` la atrapa en un solo sitio y decide el código HTTP — el `catch (RuntimeException e)` de aquí es solo la alternativa manual, para cuando de verdad quieres gestionarla tú mismo en ese momento en vez de centralizarla.

> **Cuidado con "envolver" una excepción comprobada.** Es un patrón válido y muy común en Spring Boot, pero pierde la garantía del compilador — a partir de ahí, nadie te obliga a acordarte de gestionarla. Hazlo con intención (normalmente porque quieres simplificar la firma de tus métodos y dejar que un `@RestControllerAdvice` maneje el error de forma centralizada), no por evitar escribir `throws` sin pensarlo.

Las dos formas de acabar en una `RuntimeException` que viste en esta sección — una propia como `EmployeeNotFoundException` (la creas tú desde cero, no envuelve nada) y una envuelta como la de `loadFile()` (nace de una `IOException` capturada) — llegan igual de "no comprobadas" al compilador, así que el mismo `@RestControllerAdvice` las puede capturar juntas. Lo único que distingue a un `@ExceptionHandler` de otro es el tipo que declara — es decir, _a qué excepción responde cada uno_, no _cómo_ la gestiona: el "cómo" lo decides tú libremente dentro del cuerpo de cada método (aquí, un código HTTP distinto para cada caso), sin ninguna relación automática entre el tipo capturado y la lógica que escribes:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Captura la excepción propia — EmployeeNotFoundException, definida más arriba
    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EmployeeNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }

    // Captura la RuntimeException genérica que "envuelve" la IOException de loadFile()
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleWrapped(RuntimeException e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }
}
```

Dos detalles de sintaxis y estilo que valen para cualquier `@ExceptionHandler` que escribas, no solo para estos dos:

> **¿Siempre hay que poner `.class`?** Sí. `@ExceptionHandler` espera como argumento un objeto de tipo `Class` — la representación en tiempo de ejecución de una clase concreta, no una instancia de esa clase — y `.class` es la sintaxis que usa Java para obtener ese objeto a partir del nombre de un tipo (`EmployeeNotFoundException.class`, `RuntimeException.class`, etc.). Sin `.class` estarías intentando pasar el propio tipo como si fuera una variable, y eso no compila.

> **¿`handleNotFound` y `handleWrapped` son nombres obligatorios?** No — el nombre del método lo eliges tú, igual que con cualquier otro método de Java; no existe una convención de Spring que te obligue a llamarlo `handleAlgo`. Spring no mira el nombre del método para decidir qué excepción gestiona cada uno: mira el tipo declarado dentro de `@ExceptionHandler(...)` (y el tipo del parámetro del método, que debe coincidir). Podrías llamar a estos dos métodos `foo` y `bar` y seguirían funcionando exactamente igual — el nombre descriptivo es solo por claridad para quien lea el código después, empezando por ti mismo.

Esta es la clase `GlobalExceptionHandler` completa, con los dos manejadores juntos — el mismo código que vuelves a ver en la sección "Conexión con Spring Boot" más abajo, donde se explica el patrón `@RestControllerAdvice` desde cero.

---

## try / catch / finally

> Docs: https://www.baeldung.com/java-exceptions → read: "Try, Catch and Finally"
> 📖 Oracle Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html → read: "Catching and Handling Exceptions"

Envuelves el código que puede fallar en un bloque `try` y gestionas cada posible fallo en su propio bloque `catch`. `finally` se ejecuta siempre, pase lo que pase — úsalo para cerrar conexiones o liberar recursos incluso cuando se produce una excepción. La sintaxis te resultará familiar: `try`/`catch`/`finally` funciona igual en JavaScript — la diferencia en Java está en qué puedes capturar y qué te exige declarar el compilador (ver comprobadas vs no comprobadas más arriba):

```java
try {
    // código que podría lanzar una excepción
    String content = readFile("data.txt");
    int number = Integer.parseInt(content);
} catch (IOException e) {
    System.out.println("File error: " + e.getMessage());
    e.printStackTrace(); // imprime el stack trace completo en la consola de errores
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} finally {
    System.out.println("Esto siempre se ejecuta — limpia recursos aquí");
}
```

- `catch` recibe el objeto de excepción — usa `e.getMessage()` cuando solo necesitas el texto del error, `e.printStackTrace()` cuando además quieres ver la traza completa de por dónde pasó la excepción (útil mientras depuras; en el `catch (IOException e)` de arriba se ha añadido como ejemplo de uso)
- Los bloques `catch` múltiples se comprueban de arriba a abajo, y Java ejecuta el primero cuyo tipo coincida con la excepción lanzada: si algo falla, mira el tipo real del error y lo compara con el primer `catch`; si no coincide (por ejemplo, el error es un `NumberFormatException` y el primer bloque espera `IOException`), pasa a comprobar el siguiente `catch`, y así sucesivamente hasta encontrar uno que encaje. Por eso pon las excepciones más específicas antes que las más generales — lo verás explicado a fondo en el callout de más abajo
- `finally` siempre se ejecuta — usado para cerrar ficheros, conexiones de base de datos, etc.

> **¿Por qué no dejar un bloque `catch` vacío?** Un `catch` vacío se traga el error en silencio — el programa sigue como si nada y pierdes tanto el mensaje como el stack trace, así que el bug se vuelve invisible. Como mínimo registra la excepción; nunca escribas `catch (Exception e) {}`.

> **¿Por qué importa el orden de los `catch`? ¿Qué pasa si me equivoco?** Java comprueba los bloques `catch` de arriba a abajo y ejecuta el _primero_ cuyo tipo coincida con la excepción lanzada. En el momento en que uno coincide y se ejecuta, Java deja de comprobar el resto — nunca llega a mirar los bloques `catch` que vienen después, aunque alguno de ellos también encajaría con esa excepción. Si las dos excepciones no tienen relación (como `IOException` y `NumberFormatException` arriba), el orden es solo cuestión de estilo. Pero si una es superclase de la otra — por ejemplo `Exception` e `IOException` — y pones la superclase (`Exception`) primero, el código directamente no compila: `catch (IOException e)` se queda inalcanzable, porque cualquier `IOException` ya coincide con el `catch (Exception e)` de encima. El error exacto es `exception IOException has already been caught`. Por eso la regla general es ordenar los `catch` de más específico a más genérico — las subclases más concretas primero, y la superclase (si la captura alguna) siempre al final; no es una preferencia de estilo, es lo único que hace que todos los bloques sean alcanzables.

> **¿Se ejecuta `finally` aunque el bloque `try` tenga un `return`?** Sí — es el "gotcha" clásico de entrevista de Java. Un "gotcha" (palabra inglesa informal, de "got you" — "te pillé") es el nombre que se le da en programación a un comportamiento que técnicamente es correcto y está bien documentado, pero que sorprende a casi todo el mundo la primera vez porque no es lo que la sintaxis parece indicar a simple vista; se llaman así porque son el tipo de detalle que "te pilla" si solo conoces la superficie del lenguaje, y por eso son una pregunta favorita en entrevistas técnicas — revelan si de verdad entiendes el mecanismo por debajo, no solo la sintaxis. Aquí el mecanismo es este: cuando el flujo llega al `return` dentro de `try`, Java calcula el valor a devolver (`1`) pero todavía no sale del método — antes de que la llamada realmente termine y ese valor llegue a quien invocó el método, Java ejecuta primero el bloque `finally` completo. Solo cuando `finally` termina, el método devuelve de verdad el valor que había calculado:
>
> ```java
> public int test() {
>     try {
>         return 1;
>     } finally {
>         System.out.println("finally se ejecuta primero"); // se imprime antes de que test() devuelva el 1 a quien lo llamó
>     }
> }
> // test() sigue devolviendo 1 — pero solo después de imprimir "finally se ejecuta primero"
> ```
>
> La trampa que hay que evitar: si el propio `finally` tiene _otro_ `return`, ese nuevo valor gana y sustituye en silencio al que venía de `try` — es decir, el `1` que `try` ya había calculado se descarta sin ningún aviso ni error, y el método devuelve lo que diga el `return` de `finally` en su lugar. Por ejemplo, si aquí el bloque `finally` tuviera `return 2;`, `test()` devolvería `2`, no `1` — el `return 1` de `try` nunca llegaría a salir del método. Es mala práctica precisamente por lo silencioso del cambio: nadie que lea rápido el código esperaría que el valor de retorno se decidiera dentro del bloque de limpieza; por eso la regla es tajante — nunca pongas un `return` dentro de `finally`.

### Capturar múltiples excepciones en un solo bloque

```java
try {
    // ...
} catch (IOException | SQLException e) {
    System.out.println("Data error: " + e.getMessage());
}
```

> El multi-catch — el nombre que recibe justamente esta sintaxis, `catch (TipoA | TipoB e)`, con las dos excepciones dentro del _mismo_ bloque `catch` separadas por `|` — es un mecanismo distinto de encadenar varios bloques `catch` separados, y por eso tiene su propia regla, no la de "más específico primero". La regla de ordenar de más específico a más genérico que viste arriba (la de `Exception`/`IOException`) solo aplica cuando tienes **bloques `catch` separados, cada uno con su propia llave `{ }`** — ahí sí puedes y debes poner `catch (FileNotFoundException e) { ... }` antes que `catch (IOException e) { ... }`, porque Java los recorre en orden y cada uno es una comprobación independiente. El multi-catch es harina de otro costal: al escribir `catch (IOException | SQLException e)` no estás creando dos comprobaciones en secuencia, sino un único bloque `catch` que reacciona igual (con el mismo cuerpo de código) ante cualquiera de los dos tipos — no hay "primero" ni "segundo" dentro de esa lista, así que el concepto de orden no pinta nada. Por eso la regla aquí es otra: como los tipos conviven en la misma línea sin jerarquía entre ellos, el compilador exige que ninguno sea ya un subtipo de otro — si lo fuera (como `FileNotFoundException` respecto a `IOException`), incluirlos juntos sería redundante, porque capturar `IOException` sola ya cubriría también a `FileNotFoundException`.

---

## throw — lanzar una excepción manualmente

> Docs: https://www.baeldung.com/java-exceptions → read: "Throwing an Exception"
> 📖 Oracle Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/throwing.html → read: "Throwing Exceptions"

Ya viste un `throw` en acción más arriba, en el ejemplo de `EmployeeNotFoundException`: ahí lo usabas para lanzar una excepción propia. `throw` no es exclusivo de las excepciones que tú defines — es la palabra clave general para lanzar cualquier excepción, propia o de Java, justo en el punto del código donde detectas que algo no está bien.

La usas sobre todo para dos cosas: validar que los datos que recibe un método tienen sentido antes de seguir adelante — lo que se conoce como _fail fast_ ("fallar pronto"): cortar la ejecución en el momento exacto en que detectas el dato inválido, con un mensaje claro, en vez de dejar que ese dato siga circulando por el programa y provoque un error confuso mucho más adelante, lejos de donde realmente se originó — o para señalar que el estado interno de un objeto no permite la operación que se le está pidiendo. El caso típico de uso es validar un parámetro nada más entrar en el método, como aquí con `setAge`:

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative: " + age);
    }
    this.age = age;
}
```

No siempre hace falta crear tu propia clase de excepción para esto — Java ya trae varias excepciones no comprobadas genéricas pensadas justo para estos casos: `IllegalArgumentException` (un argumento con el tipo correcto pero un valor que no tiene sentido, como aquí), `IllegalStateException` (el objeto está en un estado desde el que esa operación no se puede realizar), o `NullPointerException` (aunque esta normalmente la lanza Java por ti al acceder a un `null`, no tú a mano). Solo merece la pena crear una clase propia como `EmployeeNotFoundException` cuando quieres un nombre de dominio específico que documente mejor el problema, o cuando necesitas que un `@ExceptionHandler` distinga ese caso concreto de cualquier otro `IllegalArgumentException` genérico.

Lanza siempre con un mensaje que explique qué salió mal y qué valor lo causó — eso es justo lo que hace `"Age cannot be negative: " + age` en el ejemplo: no basta con lanzar el tipo de excepción correcto, ese mensaje es lo que va a leer quien mire el stack trace o llame a `e.getMessage()` en un `@ExceptionHandler`, así que tiene que decir exactamente qué pasó. No hace falta que captures ni adjuntes tú mismo el stack trace: Java lo construye automáticamente en el instante en que el objeto de excepción se crea con `new`, antes incluso de que se ejecute el `throw` — por eso, cuando la excepción llega a la consola o a un bloque `catch`, el stack trace ya está completo y refleja la pila de llamadas exactamente como estaba en el momento de ese `new IllegalArgumentException(...)`, sin que tengas que hacer nada extra para capturarlo.

`throw` es la misma palabra clave que ya conoces de JavaScript — la diferencia está en qué puedes lanzar. JS te deja lanzar cualquier valor (un string, un número, un objeto cualquiera); Java exige que el objeto que lanzas sea, en algún punto de su árbol de herencia, un `Throwable` — no necesariamente una subclase de `Exception` en concreto, sino cualquier clase que descienda de `Throwable` (lo que en la práctica siempre será `Exception`, `RuntimeException`, o una subclase de cualquiera de las dos, ya que `Error` es la otra rama y no la lanzas tú a mano). Por eso, a diferencia de JS, no puedes lanzar un simple string o un número: el compilador rechaza cualquier cosa que no cumpla esa condición.

---

## throws — declarar excepciones comprobadas

> Docs: https://www.baeldung.com/java-exceptions → read: "Throws Keyword"
> 📖 Oracle Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/declaring.html → read: "Specifying the Exceptions Thrown by a Method"

A diferencia de `throw` — que usas para lanzar tú mismo una excepción propia o genérica en el momento en que detectas un problema (visto en la sección anterior) — `throws` no lanza nada: solo declara en la firma del método que, dentro de él, puede llegar a producirse una excepción comprobada que no se ha capturado ahí mismo. Lo usas cuando llamas a un método que a su vez ya declara `throws` para una excepción comprobada (o cuando tú mismo detectas y lanzas una comprobada con `throw`, algo raro en la práctica) y decides no capturarla en ese punto, sino dejar que el llamador decida qué hacer — la misma idea de "quién tiene más contexto para decidir" que viste en el callout de "cuándo usar `throws` y cuándo `try/catch`" más arriba.

```java
public String readFile(String path) throws IOException {
    // si esto lanza IOException, el llamador debe manejarla
    return Files.readString(Path.of(path));
}
```

Aquí es donde entra la pregunta de qué métodos lanzan excepciones comprobadas "por defecto" — es decir, sin que tú hagas nada, solo por llamarlos. `Files.readString()` es uno de ellos: su propia firma en el JDK ya declara `throws IOException`, así que en el momento en que lo llamas dentro de `readFile()`, el compilador te obliga a elegir entre capturarla ahí mismo o repetir el `throws IOException` en tu propio método, como se hace arriba — es exactamente la misma regla de "captúrala o decláralo" que viste al principio de la nota, solo que aquí la excepción no nace en tu código, nace dentro de un método de la librería estándar que tú te limitas a llamar. Otros métodos habituales que hacen lo mismo: casi toda la familia `java.io`/`java.nio` (`FileReader`, `BufferedReader.readLine()`), `Class.forName()` (lanza `ClassNotFoundException` si la clase no existe en el classpath), y `Thread.sleep()` (lanza `InterruptedException`, comprobada, aunque no tenga nada que ver con ficheros o red).

En un proyecto Spring Boot típico, sin embargo, vas a escribir `throws` bastante menos de lo que esta lista sugeriría. La razón es la misma que viste en la sección del patrón "envolver": Spring ya se encarga de convertir la mayoría de estas excepciones comprobadas de bajo nivel en excepciones no comprobadas antes de que lleguen a tu código de servicio — por ejemplo, `SQLException` (comprobada en JDBC puro) llega a ti ya convertida en `DataAccessException` (no comprobada) cuando usas Spring Data. Donde de verdad te vas a encontrar escribiendo `throws` a mano es en el trabajo directo con ficheros o red (`Files.readString()`, `URL.openConnection()`) cuando no pasa por ninguna capa de Spring que te lo envuelva primero.

---

## Excepciones personalizadas

> Docs: https://www.baeldung.com/java-exceptions → read: "Custom Exception"
> 📖 Oracle Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/creating.html → read: "Creating Exception Classes"

Creas tu propia clase de excepción cuando quieres darle un nombre de dominio a un error, en vez de lanzar una excepción genérica de Java como `IllegalArgumentException`. Merece la pena cuando quieres documentar mejor el problema, o cuando necesitas que un `@ExceptionHandler` distinga ese caso concreto de cualquier otro. Aquí tienes la receta paso a paso, ya generalizada para cualquier excepción propia que quieras escribir, no solo para `EmployeeNotFoundException`:

1. **Extiende la clase padre correcta.** Casi siempre `RuntimeException`, para que sea no comprobada — es la convención en Spring Boot que ya viste más arriba. Si alguna vez quisieras una excepción comprobada propia extenderías `Exception` en su lugar, pero es un caso raro en un proyecto Spring Boot típico, donde casi todo se modela como no comprobado.
2. **Dale un constructor que reciba lo que necesites para construir un buen mensaje de error.** No hay una firma fija — la decides tú según qué datos tengas disponibles en el momento en que la vayas a lanzar. Aquí es el `id` que no se encontró; en otra excepción podría ser un nombre de fichero, un código de error, o varios valores a la vez.
3. **Llama a `super(...)` con el mensaje ya construido.** Es el mismo `super()` que ya usas para invocar el constructor de la clase padre en cualquier subclase — aquí el padre es simplemente `RuntimeException`, y su constructor que recibe un `String` es el que guarda ese mensaje dentro del objeto de excepción.

```java
// No comprobada — extiende RuntimeException (la más común en Spring Boot)
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

Ya viste esta misma clase con el mismo nivel de detalle en la sección de `throw` más arriba — aquí la tienes de nuevo, esta vez como plantilla general del patrón completo: extender, definir el constructor, llamar a `super(...)`. El mensaje que guarda `super(...)` es lo que devuelve `e.getMessage()` más tarde, tanto en un bloque `catch` normal como en un `@ExceptionHandler` de Spring Boot — es el mismo mensaje viajando por los dos caminos posibles de captura.

Una vez definida, la usas exactamente igual que cualquier otra excepción no comprobada: un `throw new EmployeeNotFoundException(...)` en el punto del código donde detectas el problema, sin necesidad de declarar nada en la firma del método:

```java
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

En Spring Boot, el destino habitual de esta excepción es el mismo que ya viste con el patrón de envolver: la dejas propagarse sin capturarla en ningún punto intermedio, hasta que un único `@RestControllerAdvice` la atrapa y decide qué código HTTP devolver.

---

## try-with-resources

> Docs: https://www.baeldung.com/java-try-with-resources → read: "Try-With-Resources"
> 📖 Oracle Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html → read: "The try-with-resources Statement"

Antes de que existiera esta sintaxis, cerrar un recurso como un fichero abierto significaba escribir tú mismo un bloque `finally` que llamara a `reader.close()` — y ese `close()` en sí mismo puede lanzar una excepción, así que el `finally` "correcto" acababa necesitando su propio `try/catch` anidado dentro:

```java
// MAL — funciona, pero es ruidoso y fácil de hacer mal
BufferedReader reader = new BufferedReader(new FileReader("data.txt"));
try {
    String line = reader.readLine();
    System.out.println(line);
} finally {
    try {
        reader.close();
    } catch (IOException e) {
        System.out.println("Error cerrando el fichero: " + e.getMessage());
    }
}
```

`try-with-resources` es la sintaxis que automatiza justo ese patrón. Declaras el recurso dentro de paréntesis después de `try`, y Java se encarga de llamar a su `close()` por ti cuando el bloque termina — tanto si termina con normalidad como si termina por una excepción:

```java
// BIEN — Java llama a reader.close() por ti, pase lo que pase
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}
// reader se cierra automáticamente aquí, incluso si ocurrió una excepción
```

Antes de seguir, vale la pena desmontar esa primera línea del `try`, porque en realidad son dos objetos anidados, no uno: `new FileReader("data.txt")` crea un `FileReader` — la clase más básica de Java para leer el contenido de un fichero de texto, carácter a carácter, a partir de la ruta que le pasas. Ese `FileReader` recién creado se pasa inmediatamente como argumento a `new BufferedReader(...)`, que es una clase que _envuelve_ a otro lector (aquí, el `FileReader`) para añadirle una capacidad que el `FileReader` no tiene por sí solo: un método `readLine()` que lee una línea completa de una vez, en lugar de tener que ir leyendo carácter a carácter tú mismo. Por eso ves dos `new` seguidos en la misma línea — es la misma idea que anidar llamadas a funciones en JavaScript (`f(g(x))`): primero se evalúa la llamada de más adentro (`new FileReader(...)`), y su resultado se pasa como argumento a la de más afuera (`new BufferedReader(...)`). Y sí, es una declaración de variable completa como cualquier otra: `BufferedReader reader = ...` declara una variable de tipo `BufferedReader` llamada `reader`, exactamente igual que si escribieras `int x = 5;` — lo único distinto es que aquí la declaración vive dentro de los paréntesis del `try`, lo que le dice a Java "cuando termines con `reader`, ciérralo por mí".

Para que un recurso pueda ir dentro de esos paréntesis, su clase tiene que implementar la interfaz `AutoCloseable` — es lo que garantiza que el objeto tenga un método `close()` que Java pueda llamar sin saber nada más sobre esa clase en concreto. `BufferedReader`, `FileReader`, y las conexiones de base de datos de JDBC (`Connection`, `Statement`, `ResultSet`) son ejemplos habituales que ya implementan esta interfaz.

Puedes declarar varios recursos separándolos con `;` dentro del mismo paréntesis, y Java los cierra en el orden inverso al que los declaraste — el mismo principio LIFO que ya conoces del _call stack_ al principio de esta nota: el último recurso en abrirse es el primero en cerrarse, porque normalmente es el que depende de los anteriores (por ejemplo, un `BufferedReader` que envuelve a un `FileReader` necesita que el `FileReader` siga abierto mientras él se cierra, así que se cierra primero el de fuera):

```java
try (FileReader fileReader = new FileReader("data.txt");
     BufferedReader reader = new BufferedReader(fileReader)) {
    System.out.println(reader.readLine());
}
// se cierra primero "reader", y después "fileReader" — orden inverso al de declaración
```

> **¿Qué pasa si tanto el código de dentro del `try` como el `close()` automático lanzan una excepción?** Es un detalle que suele salir en entrevistas. Java se queda con la excepción que lanzó el código de dentro del `try` — esa es la que ves como excepción principal — y la excepción que lanzó `close()` no se descarta, sino que se guarda dentro de la principal como **suprimida** (_suppressed exception_), recuperable con `excepcionPrincipal.getSuppressed()`. Es el mismo concepto que el de `cause` que viste en la sección de "envolver" — una excepción enlazada a otra sin perder información — pero aquí en dirección contraria: aquí la información extra viaja "adjunta" a la que ya tenías, en vez de ser la que envuelve a la original.

Las conexiones de base de datos en Spring Boot se gestionan automáticamente por el framework — no escribirás try-with-resources para trabajo con base de datos, pero lo verás en operaciones con ficheros y red, que es donde de verdad tienes que abrir y cerrar recursos tú mismo. Para el perfil que buscas — junior de Angular + Spring Boot en una consultoría española — este patrón concreto no es algo que vayas a escribir todos los días: la mayoría de proyectos CRUD típicos (que es justo el tipo de proyecto que vas a construir y que te van a preguntar en una entrevista) resuelven la persistencia con Spring Data, que ya gestiona conexiones y transacciones por ti sin que tengas que abrir ni cerrar nada a mano. Donde sí te lo vas a encontrar es en tareas más puntuales — leer un fichero de configuración, procesar un CSV subido por el usuario, o cualquier integración que toque el sistema de ficheros directamente. Aun así, es una pregunta clásica de entrevista técnica precisamente porque revela si entiendes la gestión de recursos y el `finally` que hay por debajo, así que merece la pena saber explicarlo aunque no lo uses todos los días.

---

## Conexión con Spring Boot

> Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: "Using @ControllerAdvice" y "The Handler Methods"
> 📖 Spring Docs: https://docs.spring.io/spring-framework/reference/web/webmvc-exceptionhandlers.html → read: "Exception Handling"

> **Vista previa — Spring Boot:** Esta sección usa `@RestControllerAdvice`, `@ExceptionHandler` y `ResponseEntity` — clases de Spring Boot que aún no has estudiado. Léela para ver cómo las excepciones Java se conectan a una API web. Construirás exactamente este patrón en las notas de Spring Boot.

El patrón estándar en Spring Boot:

```java
// 0. Declarar la excepción propia — la misma clase que ya viste en "Excepciones personalizadas"
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}

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
