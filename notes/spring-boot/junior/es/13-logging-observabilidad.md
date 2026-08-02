# Logging y Observabilidad

Docs: [Baeldung — Logging in Spring Boot](https://www.baeldung.com/spring-boot-logging) → read: "Zero Configuration Logging" y "Logback Configuration Logging"

[12-depuracion-en-produccion.md](12-depuracion-en-produccion.md) te enseñó a leer la evidencia: el bloque `APPLICATION FAILED TO START`, la cadena de `Caused by:`, el conteo de queries SQL, el filtro de seguridad que denegó una request. Cada una de esas técnicas tiene una precondición que nadie dice en voz alta — **la evidencia tenía que existir**. Spring escribió el bloque de arranque. Hibernate imprimió el SQL porque una property estaba activada. Spring Security narró la cadena de filtros porque subiste su nivel a `DEBUG`.

Ahora vuelve a la fila que abrió aquel archivo: una entry que está en `APPROVED` y que nadie envió nunca ([11-logica-de-negocio-modelado-dominio.md](11-logica-de-negocio-modelado-dominio.md)). Hazte la única pregunta que importa — *¿quién la aprobó, y cuándo?* — y abre tu `TimeEntryService`:

```java
public TimeEntryResponse approve(Long id) {
    TimeEntry timeEntry = timeEntryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

    if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
        throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
    }

    timeEntry.setStatus(EntryStatus.APPROVED);
    TimeEntry saved = timeEntryRepository.save(timeEntry);
    return toResponse(saved);
}
```

No hay respuesta. Ese método **no registra nada**. Cambia el campo más importante del dominio — el que convierte un draft en un timesheet facturable y aprobado — y deja atrás exactamente un artefacto: la fila en sí. Quién lo hizo, cuándo lo hizo, desde qué request, ha desaparecido. Y esto no es un supuesto sobre un codebase cualquiera: **haz un grep de TimeTrack hoy y no hay ni una sola llamada a `log.` en todo el backend.** Ni en los servicios, ni en el exception handler, ni en el filtro de seguridad.

Eso es lo que este archivo arregla. Depurar es leer la evidencia; **hacer logging es decidir, de antemano, qué evidencia va a existir.** La decisión se toma cuando escribes el método — meses antes del incidente — y precisamente por eso los juniors se equivocan: como todavía no ha pasado nada malo, parece trabajo de relleno.

Cinco preguntas, y son las secciones de abajo:

```
   ¿DE DÓNDE sale el logger?              ──► @Slf4j  (Lombok + SLF4J + Logback)
   ¿QUÉ escribo, y con qué volumen?        ──► los cinco niveles, y log.info("... {}", id)
   ¿QUÉ hago dentro de un catch?           ──► log.error(msg, e)   ← el que más importa
   ¿QUÉ no debe aparecer jamás en un log?  ──► contraseñas, JWTs en crudo, request bodies enteros
   ¿QUIÉN vigila la app en ejecución?      ──► Actuator — y el endpoint que no debes exponer
```

---

## `@Slf4j` — de dónde sale el objeto `log`

Propósito: meter un logger en un bean de Spring con una sola anotación, y entender el stack de tres capas (Lombok → SLF4J → Logback) que hace que `log.info(...)` imprima algo de verdad.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — **propuesto: TimeTrack no tiene `@Slf4j` en ninguna clase hoy**
Docs: [Baeldung — Introduction to SLF4J](https://www.baeldung.com/slf4j-with-log4j2-logback) → read: "Why SLF4J?" (el argumento de la fachada) y "Logback Setup"

La forma ingenua de hacer que un programa hable es `System.out.println("approved " + id)`. Funciona, imprime, y está mal por razones que solo se vuelven obvias en producción — sin timestamp, sin severidad, sin thread, sin nombre de clase, y sin manera de apagarlo sin editar y redesplegar el código. Un framework de logging existe precisamente para añadir esas cosas.

En una app Spring Boot nunca lo montas a mano. `spring-boot-starter-webmvc` ya arrastra `spring-boot-starter-logging`, que trae **SLF4J** y **Logback** — así que ahora mismo, en TimeTrack, tienes un logger en el classpath, sin usar. Solo necesitas una referencia a él en la clase:

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j                      // ← Lombok genera el campo del logger
@Service
public class TimeEntryService {

    public TimeEntryResponse approve(Long id) {
        log.info("Approving entry {}", id);      // ← `log` existe, y nunca lo declaraste
        ...
    }
}
```

`@Slf4j` es una anotación de **Lombok**, y Lombok es un procesador de anotaciones en tiempo de compilación ([01-basicos.md](01-basicos.md)) — no hace nada en tiempo de ejecución, *escribe código dentro del `.class`* durante la compilación. La línea exacta que escribe es esta:

```java
// lo que @Slf4j genera de verdad — podrías teclearlo tú mismo y obtendrías el resultado idéntico
private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(TimeEntryService.class);
```

Lee esa línea generada palabra por palabra, porque cada parte es una decisión:

- **`private`** — el logger pertenece a esta clase; nadie lo inyecta ni lo pasa de un lado a otro.
- **`static`** — un logger por *clase*, no por instancia. Un logger no guarda ningún estado por request, así que una segunda copia sería puro desperdicio. (Esta es también la razón por la que el logger no es un bean de Spring y no se inyecta por constructor: no tiene nada que ver con el contenedor.)
- **`final`** — se crea una sola vez, al cargar la clase, y nunca se reasigna.
- **`LoggerFactory.getLogger(TimeEntryService.class)`** — el objeto de clase es lo que **nombra** al logger: `com.victor.timetrack.service.TimeEntryService`. Ese nombre es lo que aparece en cada línea que imprime, y — la parte que importa más adelante — es contra lo que comparas cuando activas y desactivas niveles por paquete.

> **Entonces, ¿qué son SLF4J y Logback, y por qué hay dos?** **SLF4J** es una *fachada*: nada más que interfaces (`Logger`, `LoggerFactory`) sin capacidad de escribir ni un solo carácter en un fichero. **Logback** es una *implementación*: el código que formatea la línea, decide si se imprime, y empuja los bytes a la consola. Tu código solo importa SLF4J. Al arrancar, SLF4J mira el classpath, encuentra Logback, y se conecta a él. La ganancia es que un equipo puede arrancar Logback, meter Log4j2, y **no cambia ni una línea de tu servicio** — nunca nombraste la implementación. Es exactamente la misma forma que JPA (la spec) frente a Hibernate (la implementación) de [03-spring-data-jpa.md](03-spring-data-jpa.md): programas contra la interfaz, el framework conecta el motor.

> **¿Por qué se llama `@Slf4j` y no `@Logback`?** Porque la anotación genera un campo del tipo de la *fachada*, que es todo el punto. Lombok trae `@Log4j2`, `@CommonsLog` y otras precisamente para equipos atados a una fachada distinta — pero en un codebase Spring Boot, `@Slf4j` es el que verás, siempre.

Cada línea que produce tiene una anatomía fija, y deberías poder nombrar cada columna a simple vista:

```
2026-07-13T10:41:07.512+02:00  INFO 18244 --- [timetrack] [nio-8080-exec-3] c.v.t.service.TimeEntryService : Approving entry 42
└────────── timestamp ───────┘ └lvl┘ └PID┘      └app name┘ └── thread ────┘ └──── logger (clase) ────┘  └── mensaje ──┘
```

- **timestamp** — *cuándo*, al milisegundo. Sin él no puedes cuadrar una línea con la queja del usuario ("se rompió sobre las once").
- **level** — *qué tan grave*. La siguiente sección va enteramente sobre esta columna.
- **thread** (`nio-8080-exec-3`) — *qué request*. Tomcat sirve requests concurrentes con un pool de threads, así que las líneas de dos usuarios simultáneos quedan **entrelazadas** en el fichero. El nombre del thread es lo que te permite reconstruir las líneas de una sola request en medio de ese lío. (Es también la razón por la que existen los correlation ids — ver el final de este archivo.)
- **logger** — *qué clase*, abreviada (`c.v.t.service.TimeEntryService`) para que la columna sea más estrecha. Este es el nombre que `@Slf4j` derivó de `TimeEntryService.class`.

> **`System.out.println` no te da ninguna de esas cinco columnas.** Ese es el argumento honesto en contra — ni estilo, ni pureza. Un `println` va a stdout sin nivel (así que nunca se puede filtrar), sin timestamp (así que nunca se puede correlacionar), y sin nombre de logger (así que nunca se puede rastrear hasta una clase en un codebase de cien mil líneas). También es invisible para cualquier agregador de logs que use una empresa, porque esas herramientas leen la salida del framework de logging, no el stdout crudo. En una PR, un `println` en un servicio es un comentario bloqueante.

---

## Los cinco niveles — y qué registrarías de verdad en `approve()`

Propósito: elegir el nivel correcto para cada línea, de modo que producción pueda correr en `INFO` y aun así contarte qué pasó.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` (`approve()`) — **propuesto: ninguna de estas líneas existe hoy en el archivo**
Docs: [Baeldung — Logging in Spring Boot](https://www.baeldung.com/spring-boot-logging) → read: "Logging Levels" — y fíjate en la *jerarquía* de niveles, no solo en los nombres

Un nivel no es un estado de ánimo. Es un **umbral de filtrado**, y ese es el mecanismo sobre el que descansa todo el sistema: configuras un nivel (digamos `INFO`), y el framework imprime cada mensaje en ese nivel **o más grave**, y descarta en silencio todo lo que quede por debajo. El orden es fijo:

```
   TRACE  <  DEBUG  <  INFO  <  WARN  <  ERROR
   ────────────────────►  aumenta la severidad  ────────────────────►

   nivel = INFO   ⇒  TRACE ✗   DEBUG ✗   INFO ✓   WARN ✓   ERROR ✓
   nivel = DEBUG  ⇒  TRACE ✗   DEBUG ✓   INFO ✓   WARN ✓   ERROR ✓
```

Así que el nivel que le asignas a una línea es en realidad una promesa sobre **cuándo esa línea merece existir**: `DEBUG` significa "solo cuando alguien está investigando"; `INFO` significa "siempre, incluso a las 3am de un domingo tranquilo, en producción".

| Nivel | Qué significa | El test que aplicar |
|---|---|---|
| `ERROR` | Algo se rompió y un humano necesita saberlo | ¿Estarías cómodo con que esto haga saltar una alerta a alguien de noche? |
| `WARN` | Sospechoso o recuperado — no roto, pero merece atención | Nada falló, pero *casi* falla, o alguien está haciendo algo que no debería |
| `INFO` | Ocurrió de verdad un hito de negocio | ¿Le importaría esto a alguien no developer (un manager, un auditor)? |
| `DEBUG` | Detalle de desarrollador — valores, ramas, estado intermedio | Útil cuando estás cazando un bug, ruido en cualquier otro caso. **Apagado en producción** |
| `TRACE` | Manguera abierta — cada paso, cada parámetro | Prácticamente nunca escribirás uno; los frameworks sí (`org.hibernate.orm.jdbc.bind=TRACE`) |

Cómo leer esa tabla: la columna de la derecha es la única que necesitas en el momento de escribir la línea. Las *definiciones* son fáciles de aceptar e inútiles bajo presión — el **test** es lo que toma la decisión por ti. Y fíjate en lo que descarta el test de `INFO`: `log.info("entering approve method")` no es un hito de negocio, es a lo sumo una línea `DEBUG`, y en realidad es una línea que no debería existir en absoluto, porque un stack trace ya te dice qué se ejecutó.

> **"Un candidato que responde `log.info` en cada línea nunca ha operado un servicio."** Ese es el filtro real detrás de esa pregunta, y es un argumento de volumen, no de gusto. Un servicio en producción atiende millones de requests. Si cada método registra su entrada, su salida y sus parámetros en `INFO`, produces gigabytes de ruido al día — y luego, cuando algo real se rompe, la línea `ERROR` queda enterrada entre doscientas mil líneas de `entering approve method` y nadie la encuentra. Registrarlo todo y no registrar nada fallan de la misma manera: **la señal se vuelve inalcanzable.**

### La respuesta concreta: qué pertenece a `approve()`

Aquí tienes tu `approve()` real con el logging que debería tener. Cada línea de abajo está justificada contra los tests de la tabla — nada es decorativo:

```java
@Slf4j
@Service
public class TimeEntryService {

    public TimeEntryResponse approve(Long id) {
        String manager = SecurityContextHolder.getContext().getAuthentication().getName();

        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
            // WARN: nada está roto — la regla funcionó. Pero alguien intentó una transición ilegal,
            // y si esto salta cincuenta veces al día significa que la UI de Angular muestra un botón que no debería.
            log.warn("Rejected approval of entry {} by {}: status was {}, expected SUBMITTED",
                     id, manager, timeEntry.getStatus());
            throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
        }

        timeEntry.setStatus(EntryStatus.APPROVED);
        TimeEntry saved = timeEntryRepository.save(timeEntry);

        // INFO: este es EL hito de negocio de todo el workflow.
        // Es la línea que responde "¿quién aprobó esto, y cuándo?" — la pregunta que la fila corrupta no pudo responder.
        log.info("Entry {} approved by {} (owner {}, {} hours on {})",
                 id, manager, saved.getUser().getEmail(), saved.getHours(), saved.getDate());

        return toResponse(saved);
    }
}
```

Recorre las tres decisiones, porque cada una es una respuesta defendible en una entrevista:

- **La línea de éxito es `INFO`, y es el único `INFO` del método.** Una aprobación es un cambio de estado con dinero de por medio — a un auditor le importa, a un manager le importa, y dentro de seis meses la disputa de nómina se resuelve con esta línea o con nada. Lleva los cuatro datos que la hacen útil *sin abrir la base de datos*: **qué** entry, **quién** lo hizo, **de quién** era la entry, y **qué** se aprobó. Un `log.info("Approved")` a secas no vale nada — solo demuestra que una aprobación pasó en algún sitio, a alguien, cosa que ya sabías por la fila.
- **La línea de transición ilegal es `WARN`, no `ERROR`.** Nada falló: tu guard hizo exactamente su trabajo y el cliente recibió un 400 limpio. `ERROR` se reserva para "el sistema está roto y un humano tiene que actuar". Pero tampoco es nada — un frontend legítimo nunca debería enviar esa request, así que un flujo de estos `WARN` es una señal real (una UI desactualizada, un cliente saltándose la API, alguien probando). Esa distinción — *"una request rechazada no es un error de servidor"* — es la misma que hay detrás de 4xx frente a 5xx en [05-manejo-excepciones.md](05-manejo-excepciones.md).
- **No se registra nada al principio del método.** `log.info("approve called")` añade una línea a cada aprobación y no responde ninguna pregunta que la línea de éxito no responda ya mejor. Registra **resultados**, no entradas.

> **¿Y la `ResourceNotFoundException` de la línea de arriba — debería registrarse?** No, y este es el error que produce spam de logs duplicado. Esa exception sube hasta `GlobalExceptionHandler`, que la convierte en un 404 limpio ([05-manejo-excepciones.md](05-manejo-excepciones.md)). **El sitio que maneja un fallo es el sitio que lo registra** — registrarlo aquí *y* allí te da dos líneas para un solo evento, y en cuanto cada servicio hace eso, una sola request fallida produce cinco entradas idénticas y ya no puedes contar nada. La regla que hay que sostener: **registra donde manejas, lanza donde fallas.**

> **¿Por qué `approve()` no registra el estado *anterior* en el éxito?** En un contexto de auditoría real debería hacerlo — `"entry {} moved from {} to APPROVED by {}"` es estrictamente mejor, porque el trabajo de una línea de log es dejarte reconstruir la transición sin la fila. Aquí `SUBMITTED` está garantizado por el guard tres líneas más arriba, así que queda implícito. En el momento en que exista un segundo camino legal hacia `APPROVED`, la línea de log debe llevar el estado anterior explícitamente — si no, deja de ser un rastro de auditoría y se convierte en un rumor.

---

## Logging parametrizado — por qué `{}` y no `+`

Propósito: entender el mecanismo que hace que `log.debug("value {}", x)` sea gratis cuando `DEBUG` está apagado — y que hace que la versión con `+` sea costosa incluso cuando no se imprime nada.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — **propuesto**
Docs: [Baeldung — A Guide to Logback](https://www.baeldung.com/logback) → read: la sección sobre mensajes parametrizados (placeholders `{}`) — TODO: confirm the exact sub-section heading on the page

Dos líneas que imprimen un resultado idéntico:

```java
log.debug("Approving entry " + id + " for user " + user.getEmail());   // ❌ MAL — concatenación
log.debug("Approving entry {} for user {}", id, user.getEmail());      // ✅ BIEN — placeholders
```

Cualquier revisor de código marcará la primera, y la razón *no* es legibilidad. Es que las dos líneas se comportan de forma distinta **cuando `DEBUG` está apagado** — que, en producción, siempre lo está.

Sigue el rastro de lo que hace la JVM con la primera línea. Java evalúa los argumentos **antes** de llamar al método — eso no es una regla de logging, es cómo funciona el lenguaje. Así que antes de que `debug(...)` siquiera se ejecute:

1. Se invoca `user.getEmail()`.
2. Se crea un `StringBuilder`, se añaden los fragmentos (cada argumento que no es `String`, como el `Long id`, se convierte a texto con `String.valueOf()` al añadirse).
3. `toString()` reserva el `String` final en el heap.
4. *Entonces* se llama a `debug(String)` — y su primer acto es comprobar el nivel, ver que `DEBUG` está desactivado, y **tirar la cadena a la basura.**

Pagaste el coste completo de construir un mensaje que nadie va a leer. Una vez. Que no es nada. Ahora pon esa línea dentro de `toResponse()`, que corre una vez por fila, en un endpoint que devuelve doscientas entries, llamado por cincuenta usuarios por minuto — y estás reservando y descartando al instante decenas de miles de strings, dándole al garbage collector trabajo real que hacer para que produzca exactamente cero output.

La segunda línea invierte el orden. Lo que se le pasa a SLF4J es la **plantilla** (una cadena constante, ya en memoria, coste cero) y los **argumentos**, sin formatear. El formateo pasa *dentro* del método — y solo después de que se supere la comprobación del nivel:

```java
// lo que hace Logback, en esencia:
public void debug(String format, Object... args) {
    if (!isDebugEnabled()) return;              // ← ¿desactivado? nos vamos. Nada se llegó a construir.
    String msg = MessageFormatter.format(format, args);   // ← la sustitución pasa SOLO aquí
    write(msg);
}
```

Ese es el mecanismo entero, y es la respuesta a la pregunta de entrevista: **la forma con placeholder difiere la construcción del string hasta después de la comprobación del nivel; la concatenación la ejecuta antes.** Con `DEBUG` apagado, la versión con `{}` hace una comparación de nivel y vuelve.

> **El pseudocódigo de arriba es la forma, no la fuente literal.** El `Logger.debug(String, Object...)` de Logback no llama a `isDebugEnabled()`; compara el *nivel efectivo* del logger (el heredado a lo largo de la jerarquía de nombres — última sección de este archivo) con el nivel de la llamada, más cualquier turbo filter, y vuelve inmediatamente si el mensaje no está habilitado. Y la sustitución se difiere incluso más allá de lo que sugiere el esbozo: cuando el mensaje *sí* está habilitado, Logback empaqueta la plantilla y los argumentos en crudo en un `LoggingEvent` y solo los formatea cuando un appender de verdad pide el texto. La garantía en la que confías no cambia, y es la que merece la pena recordar: **con el nivel apagado, jamás se construye ningún string de mensaje.**

> **¿Qué reemplaza de verdad al `{}`?** Logback llama a `String.valueOf()` sobre cada argumento, que llama a su `toString()`. Así que `{}` funciona con cualquier cosa — un `Long`, un `BigDecimal`, un enum, una entidad — y, crucialmente, `toString()` *también* se difiere, que es donde esto deja de ser una micro-optimización. Si el argumento es una entidad JPA con un `@ToString` sobre una relación lazy, llamar a `toString()` sobre ella puede disparar queries SQL extra ([03-spring-data-jpa.md](03-spring-data-jpa.md)). Con placeholders y `DEBUG` apagado, eso nunca pasa. Con `+`, pasa en cada llamada, siempre, para producir un string que se descarta.

> **Los argumentos deben cuadrar con el número de `{}`, y nada te avisa si no cuadran.** Dos placeholders y tres argumentos imprime los dos primeros y descarta el tercero en silencio; tres placeholders y dos argumentos imprime un `{}` literal en tu log. No es un error de compilación ni una excepción en tiempo de ejecución — es simplemente una línea de log equivocada, descubierta en el peor momento posible. Cuéntalos.

> **La única excepción a la regla.** El último argumento puede ser un `Throwable` *sin* un `{}` correspondiente — SLF4J lo reconoce por tipo e imprime su stack trace en vez de sustituirlo. No es una rareza que memorizar; es todo el tema de la siguiente sección, y es la línea más importante de este archivo.

---

## `log.error("msg", e)` vs `log.error(e.getMessage())`

Propósito: conservar el stack trace. Este es el hábito de mayor valor de todo el archivo, y el que más se equivocan los juniors.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java` — **propuesto: el handler hoy no registra nada en absoluto — verificado, no hay ni una llamada a `log.` en él**
Docs: [Baeldung — A Guide to Logback](https://www.baeldung.com/logback) → read: la sección sobre registrar un `Throwable` como último argumento — TODO: confirm the exact sub-section heading on the page

Algo explota en las profundidades de tu código. Lo capturas — o lo captura tu `@RestControllerAdvice` — y escribes una línea de log. Hay dos formas de hacerlo y no son variantes de lo mismo; **una de ellas destruye la evidencia.**

```java
// ❌ MAL — el objeto exception nunca se le da al logger
log.error("Failed to approve entry: " + e.getMessage());
```
```
2026-07-13T11:02:44.891+02:00 ERROR 18244 --- [nio-8080-exec-3] c.v.t.e.GlobalExceptionHandler :
Failed to approve entry: Cannot invoke "com.victor.timetrack.model.Project.getName()" because the return value of "com.victor.timetrack.model.TimeEntry.getProject()" is null
```

Esa es la entrada de log entera. Una frase, y luego silencio. Sabes *qué* era `null`; no sabes **dónde** — ni qué clase, ni qué línea, ni qué cadena de llamadas llegó ahí, ni cuál fue la causa subyacente. `getMessage()` devolvió un `String` y nada más: el stack trace nunca se imprimió, así que el bug está en producción, no puedes reproducirlo, y te quedas haciendo grep sobre cien mil líneas de código fuente buscando una llamada a `getProject()`.

> **Y ese mensaje es el caso *bueno*.** Desde Java 14 la JVM construye por ti esos mensajes de NPE "útiles" (`Cannot invoke … because … is null`), que es por lo que la línea de arriba al menos se lee bien. La mayoría de las demás exceptions no son tan amables: una exception construida con `new SomeException()` y sin mensaje devuelve `null` en `getMessage()`, y entonces la entrada de log entera es la palabra **`null`** — una línea `ERROR` que dice que algo se rompió y se niega a decir qué. En cualquier caso la conclusión es idéntica, porque no depende del mensaje en absoluto: **`getMessage()` no puede llevar un stack trace.**

```java
// ✅ BIEN — el objeto exception se pasa como último argumento
log.error("Failed to approve entry {}", id, e);
```
```
2026-07-13T11:02:44.891+02:00 ERROR 18244 --- [nio-8080-exec-3] c.v.t.e.GlobalExceptionHandler :
Failed to approve entry 42
java.lang.NullPointerException: Cannot invoke "com.victor.timetrack.model.Project.getName()"
because the return value of "com.victor.timetrack.model.TimeEntry.getProject()" is null
	at com.victor.timetrack.service.TimeEntryService.toResponse(TimeEntryService.java:209)
	at com.victor.timetrack.service.TimeEntryService.approve(TimeEntryService.java:110)
	at com.victor.timetrack.controller.TimeEntryController.approve(TimeEntryController.java:41)
	...
Caused by: ...
```

El mismo fallo. El mismo instante. Uno de ellos es un diagnóstico — la clase, la línea, la referencia null, la cadena de llamadas, la cadena `Caused by:` que [12-depuracion-en-produccion.md](12-depuracion-en-produccion.md) te enseñó a leer de abajo hacia arriba. El otro es la palabra `null`.

**El mecanismo.** `getMessage()` devuelve *un solo campo* del objeto exception: un `String` que el autor de la exception eligió escribir, que puede estar vacío, puede ser `null`, y nunca puede contener un stack trace porque un stack trace no es un string — es un **array de objetos `StackTraceElement`** que la JVM capturó en el instante en que se construyó `new SomeException()` (ver [Excepciones en Java](../../../java/junior/es/08-excepciones.md)). Vive en la instancia de la exception, junto al mensaje y a la `cause`. Cuando llamas a `e.getMessage()` extraes el mensaje y **dejas atrás el array, y toda la cadena de `cause`** — y en el momento en que el bloque `catch` termina, ese objeto es basura y el array desaparece para siempre.

Pasar `e` en sí le entrega el *objeto entero* al logger, que recorre el array frame por frame y lo imprime, y luego sigue `e.getCause()` e imprime ese también, hasta el final. Eso es lo que es `Caused by:`: el logger recorriendo la cadena.

```
   EL OBJETO EXCEPTION                          qué conserva cada llamada
   ┌────────────────────────────┐
   │ message : "…" o null       │ ◄──── e.getMessage()  ⇒ solo esta línea. El resto se descarta.
   │ cause   : ──► otra exc.    │
   │ stackTrace : [ toResponse  │ ◄──── log.error(msg, e)  ⇒ el objeto entero: mensaje,
   │               , approve    │                             cada frame, y toda la cadena de cause.
   │               , controller │
   │               , … ]        │
   └────────────────────────────┘
```

> **¿Por qué la exception no es un placeholder `{}`?** Mira otra vez la llamada correcta: `log.error("Failed to approve entry {}", id, e)` — un placeholder, dos argumentos. Eso parece el bug de conteo de la sección anterior, y no lo es. SLF4J sustituye los argumentos en los huecos `{}` en orden, y si sobra el argumento **último** *y* es un `Throwable`, lo trata como la exception a renderizar en vez de como un valor a sustituir. Es una regla deliberada y documentada, y por eso nunca escribes `log.error("failed {}", e)` — eso consumiría `e` como valor de placeholder, imprimiría su `toString()` (una línea), y el stack trace se perdería otra vez, esta vez *pareciendo* que lo hiciste bien.

> **La variante que engaña a los revisores: `log.error(e.getMessage(), e)`.** La exception *sí* se pasa, así que el stack trace sí sobrevive — pero la línea de mensaje ahora es lo que sea que la exception dijera, que puede ser `null`, y para una exception de base de datos puede ser un fragmento de SQL en crudo. Has tirado tu única oportunidad de decir algo que un humano pueda buscar con grep. Escribe tu propio mensaje, con los ids que identifican *esta* request, y pasa la exception al lado: `log.error("Failed to approve entry {}", id, e)`.

### Lo que esto significa para el `GlobalExceptionHandler` de TimeTrack

Tu advice termina con el catch-all:

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}
```

La respuesta es correcta y deliberadamente no dice nada — esa es la regla de no filtrar información de [05-manejo-excepciones.md](05-manejo-excepciones.md) y deberías mantenerla. Pero ahora mira qué le pasa a `e`. Es un **parámetro que nunca se usa**. El método retorna, el objeto exception queda fuera de scope, el garbage collector lo recupera, y el stack trace — la única descripción que existió jamás de lo que realmente se rompió — queda destruido.

Y aquí está la parte que sorprende: **Spring no registra el stack trace por ti.** Una exception que llega a un `@ExceptionHandler` está, por definición, *manejada* — el resolver de excepciones de Spring ve que tu advice devolvió una respuesta, y la request se completa con normalidad. El estruendoso stack trace que estás acostumbrado a ver en la consola pertenece a las excepciones **no** manejadas: las que caen hasta el contenedor, producen un 500 que construye el framework, y se registran con su traza completa al salir. Al escribir un advice catch-all tomaste posesión de cada excepción en tiempo de ejecución de la aplicación, y esa posesión incluye el logging.

> **"No se registra en absoluto" se queda un pelín corto — aquí va la versión precisa.** El `DispatcherServlet` de Spring sí emite una línea cuando una excepción se resuelve, pero en nivel **`DEBUG`** y más o menos como `Resolved [java.lang.RuntimeException: ...]` — una línea, sin stack trace. Tu log de producción corre en `INFO`, así que esa línea ni siquiera aparece; e incluso en `DEBUG` no te daría la clase, la línea, ni la cadena de `cause`. Así que la verdad práctica se mantiene, y es la frase que hay que decir en una entrevista: **en cuanto tu advice maneja la excepción, el único stack trace que alguien verá jamás es el que tú mismo registres.**

Ahora mismo TimeTrack responde a un 500 de verdad con un JSON limpio y **no deja rastro utilizable de él en ningún sitio.** Eso es peor que la propia página de error del framework: al menos esa venía con un stack trace en la consola.

```java
// ✅ el catch-all, corregido — propuesto, todavía no está en tu archivo
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
        log.error("Unhandled exception", e);       // ← lado servidor: el stack trace completo
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
    }
}
```

> **Dos audiencias, dos mensajes — este es todo el diseño de un camino de error.** El *cliente* recibe `"Internal server error"`: sin nombres de clase, sin SQL, sin `e.getMessage()`, nada con lo que un atacante pueda mapear el interior. El *log* recibe todo: clase, línea, cadena de cause, valores. La regla no es "esconde el error"; es **"el detalle va donde solo tú puedes leerlo."** Un candidato que dice esa frase en una entrevista ha respondido la pregunta de seguridad y la de observabilidad en un solo aliento.

> **¿Y los demás handlers — debería registrar también `handleResourceNotFound`?** No, o como mucho en `DEBUG`. Un 404 no es un fallo de tu sistema; es el sistema diciéndole correctamente a un cliente que pidió algo que no existe, y va a pasar miles de veces al día por enlaces desactualizados. Reserva `ERROR` para el catch-all y para roturas genuinas. Si cada 404 escribiera una línea `ERROR`, tu log de errores se convertiría en un log de tráfico — y el día que algo se rompa de verdad, nadie se daría cuenta.

---

## Los dos rechazos automáticos de PR: `printStackTrace()` y el `catch` silencioso

Propósito: reconocer los dos patrones de bloque `catch` que un revisor bloquea a la vista, y poder decir *por qué* en vez de "es mala práctica".
Archivo: un bloque `catch` genérico — **ninguno de los dos patrones existe hoy en TimeTrack** (el codebase no tiene `try/catch` en la capa de servicio; lanza y deja que el advice lo maneje, que es el diseño correcto)
Docs: [Baeldung — Java Exceptions Best Practices](https://www.baeldung.com/java-exceptions) → read: las secciones sobre tragarse excepciones y sobre `printStackTrace()` — TODO: confirm the exact sub-section headings on the page

```java
// ❌ MAL — número uno
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

`printStackTrace()` imprime en **`System.err`**, el stream de error crudo de la JVM. No pasa por SLF4J en absoluto, lo que significa que no tiene **nivel** (no puedes filtrarlo, ni silenciarlo, ni subirlo), **ni timestamp**, **ni nombre de thread**, **ni nombre de logger** — ninguna de las cinco columnas de la primera sección. Peor aún, en producción nadie lee una terminal: los logs se envían a un agregador que lee la salida del framework de logging, así que un `printStackTrace()` en un servidor real se escribe en un stream que muchas veces ni siquiera se captura. Ejecutaste el ritual de registrar un error y produjiste **nada que nadie vaya a ver jamás.**

```java
// ❌ MAL — número dos, y este es peor
try {
    return timeEntryRepository.save(entry);
} catch (Exception e) {
    return null;                 // el fallo ha dejado de existir
}
```

Este es el patrón más oscuro del archivo. La exception se creó, llevaba una descripción completa de lo que salió mal — y la borraste. Sin log, sin relanzar, sin traza. El método devuelve `null` como si no hubiera pasado nada, quien lo llama sigue adelante con un `null` que no esperaba, y el crash real aparece **tres capas más allá** como una NPE que señala a código que es completamente inocente. Convertiste un fallo claro en un *resultado erróneo silencioso*, que es el tipo de bug más caro que existe: una exception es ruidosa y para; un resultado erróneo es silencioso y se propaga.

> **Hay un tercer miembro de esta familia, y ya lo conoces: el rollback tragado.** Capturar una `RuntimeException` dentro de un método `@Transactional` y no relanzarla significa que Spring nunca ve una exception, así que **hace commit** ([08-transacciones.md](08-transacciones.md)). El `catch` vacío no solo esconde un fallo — puede *persistir* el trabajo a medias que el fallo debía deshacer. Por eso "tragarse" es la palabra: los datos ya se han ido para abajo.

La regla que reemplaza a los dos, y cabe en una línea: **un bloque `catch` o maneja el fallo o lo relanza — y en cualquier caso lo registra con el objeto exception.**

```java
// ✅ BIEN — manejado: no puedes recuperarte, así que lo traduces a tu dominio y conservas la causa
try {
    externalPayroll.send(entry);
} catch (PayrollTimeoutException e) {
    log.error("Payroll sync failed for entry {}", entry.getId(), e);   // la evidencia sobrevive
    throw new BusinessRuleViolationException("Could not sync with payroll", e);  // ← 2 args: la causa queda encadenada
}
```

> **`new BusinessRuleViolationException(msg, e)` — el segundo argumento no es decoración opcional.** La versión de un argumento (`new BusinessRuleViolationException(e.getMessage())`) crea una exception *nueva* cuyo stack trace empieza **en el relanzamiento**, en tu bloque `catch`. Los frames originales — los que nombran la línea que de verdad falló — desaparecen, y el log apuntará con confianza al sitio equivocado. El constructor de dos argumentos fija la `cause`, así que el logger imprime tu exception *y luego* `Caused by: PayrollTimeoutException…` con la traza real debajo. Misma lección que la sección anterior, un nivel más arriba: **nunca dejes que una exception muera sin pasarla.**

---

## Lo que nunca debes registrar

Propósito: conocer las cuatro cosas que convierten una línea de log útil en un incidente de seguridad — y por qué la más peligrosa parece completamente inocente.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/dto/request/LoginRequest.java` (un DTO `@Data` real que guarda una contraseña en crudo)
Docs: [OWASP — Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) → read: "Data to exclude"

Un fichero de log no es un cuaderno privado. Se copia a un agregador, se retiene durante meses o años, lo puede leer cualquier developer del equipo, ops, contratistas, y cualquiera que comprometa alguna de esas máquinas. **Lo que sea que escribas en un log, lo has publicado a una audiencia mucho más amplia de la que tuvo jamás la base de datos** — y a diferencia de la base de datos, nadie lo cifró y nadie audita quién lo leyó. Cuatro categorías nunca entran:

| Nunca registrar | Por qué |
|---|---|
| **Contraseñas** — en crudo o hasheadas | Una contraseña en crudo en un log es un almacén de credenciales en texto plano que no sabías que tenías, y los usuarios reutilizan contraseñas entre sitios. Hashear en la base de datos no sirve de nada si el texto plano está en el log de al lado |
| **JWTs / tokens / API keys en crudo** | Un token es una credencial al portador: quien tenga el string *es* el usuario hasta que expire. Una línea de log con un JWT completo es una sesión funcional que cualquiera con acceso al log puede reproducir |
| **Request bodies enteros con datos personales** | Nombres, emails, direcciones, salario, horas — datos relevantes para el RGPD con un periodo de retención indefinido y sin control de acceso. En España esto no es solo mala práctica, es exposición legal |
| **Números de tarjeta, DNI/NIE, datos médicos** | Categorías reguladas. No existe la defensa de "pero era útil para depurar" |

Cómo leer esa tabla: la columna de la derecha no son cuatro reglas, es una sola regla vista desde cuatro ángulos — **un log es una copia de baja seguridad de lo que sea que metas en él.** La pregunta a hacerse antes de cada línea de log no es "¿esto es útil?" sino "¿estoy cómodo con que este string esté sentado en un fichero de texto durante dos años?"

### La trampa: `log.info("login request {}", request)`

Esta es la línea que atrapa a la gente, porque parece cuidadosa. Registra *un objeto*, no una contraseña. Aquí está el `LoginRequest` real de TimeTrack:

```java
@Data                       // ← Lombok genera toString() sobre CADA campo
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;      // ← la contraseña en crudo, antes de que BCrypt la vea
}
```

Ahora sigue el mecanismo, porque es toda la lección. Sección tres: el placeholder `{}` se rellena llamando a `String.valueOf(arg)`, que llama a **`toString()`**. Y `@Data` ([01-basicos.md](01-basicos.md)) genera un `toString()` que concatena *todos los campos de la clase*. Así que la línea imprime:

```
2026-07-13T09:15:02.104+02:00  INFO 18244 --- [nio-8080-exec-1] c.v.t.controller.AuthController :
login request LoginRequest(email=victor@timetrack.com, password=MyRealPassword123)
```

Nunca escribiste `password` en ningún sitio. Ni siquiera miraste el campo. Lombok escribió el getter, Lombok escribió el `toString()`, SLF4J lo llamó, y la credencial en texto plano de un usuario real está ahora en un fichero de log que se va a enviar, indexar, y retener. **Esta es la forma más común de que las contraseñas se filtren desde un codebase de Spring**, y pasa porque el DTO está haciendo exactamente lo que le dijiste que hiciera.

Dos formas de cerrarla, y deberías conocer las dos:

```java
// ✅ Opción A — registra solo los campos que elijas, uno por uno. Explícito, y no puede regresionar.
log.info("Login attempt for {}", request.getEmail());
```
```java
// ✅ Opción B — haz que el propio DTO sea incapaz de filtrar, con la exclusión a nivel de campo de Lombok
@Data                               // (anotaciones de validación omitidas aquí para no distraer del fix)
public class LoginRequest {
    private String email;

    @ToString.Exclude               // ← el campo queda FUERA del toString() generado
    private String password;
}
```

`@ToString.Exclude` no enmascara el valor, y no imprime `password=***`: el campo simplemente **no aparece** en el `toString()` generado en absoluto. El mismo objeto, registrado ahora, imprime `LoginRequest(email=victor@timetrack.com)` — la contraseña no está escondida detrás de asteriscos, nunca se llegó a escribir. (Lombok no tiene una función de enmascarado; si quieres un marcador `***` tienes que escribir el `toString()` a mano.)

> **La opción B es la que sobrevive a un equipo.** La opción A depende de que cada developer, para siempre, recuerde no registrar el objeto — y un descuidado `log.debug("request {}", request)` en una mala tarde lo deshace. `@ToString.Exclude` mueve la garantía a la *clase*, así que el campo no se puede imprimir por accidente desde ningún sitio. Es el mismo principio que el setter de la entidad en [11-logica-de-negocio-modelado-dominio.md](11-logica-de-negocio-modelado-dominio.md): **no dependas de la disciplina para algo que un constructo de tiempo de compilación puede garantizar.**

> **La misma trampa, un nivel más arriba: el JWT.** `log.debug("Authorizing with header {}", authHeader)` en tu `JwtFilter` imprimiría `Bearer eyJhbGciOi…` — el token entero, válido durante las próximas 24 horas (`app.jwt.expiration=86400000` en tu `application.properties`). Cualquiera con acceso al log puede pegarlo en Postman y *ser ese usuario*. Si necesitas registrar algo sobre el token, registra un *hecho* sobre él, nunca el token: `log.debug("JWT rejected for {}: expired at {}", email, exp)`. Fíjate en que incluso el email es una decisión de criterio — es dato personal, y en `DEBUG` (apagado en producción) es defendible; en `INFO`, en cada request, es una conversación sobre RGPD.

> **Y la misma trampa, un nivel más abajo: `spring.jpa.show-sql=true`.** Está activada en tu `application.properties` ahora mismo, lo cual es correcto para aprender, e imprime cada sentencia que ejecuta Hibernate — incluido el `INSERT` en `users`, con los valores de los parámetros si además activaste el bind logger ([12-depuracion-en-produccion.md](12-depuracion-en-produccion.md)). Eso es tu dato entrando al log por una vía en la que no pensabas como "logging". Es un switch de **desarrollo**. No tiene nada que hacer activado en producción, y no solo por el ruido.

---

## Activar y desactivar niveles sin redesplegar

Propósito: cambiar lo que te cuenta la app en ejecución editando configuración, no código — que es la razón por la que existen los niveles.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties` — **propuesto: tu archivo hoy no tiene ninguna clave `logging.level.*`; la única línea con pinta de logging es `spring.jpa.show-sql=true`**
Docs: [Baeldung — Logging in Spring Boot](https://www.baeldung.com/spring-boot-logging) → read: "Application Properties" (las claves `logging.level.*`)

Recuerda lo que generó `@Slf4j`: un logger **nombrado según la clase** (`com.victor.timetrack.service.TimeEntryService`). Ese nombre no es decoración — es una dirección jerárquica, y es contra lo que apuntas una clave de configuración:

```properties
# un paquete entero: cada logger bajo com.victor.timetrack
logging.level.com.victor.timetrack=DEBUG

# una clase, con precisión
logging.level.com.victor.timetrack.service.TimeEntryService=DEBUG

# el código de otra persona — el mismo mecanismo, así conseguiste los switches del archivo 12
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# el suelo para todo lo que no está nombrado arriba
logging.level.root=INFO
```

Logback resuelve el nivel de un logger subiendo por su **nombre con puntos** hasta encontrar uno configurado: `com.victor.timetrack.service.TimeEntryService` → `…service` → `…timetrack` → `com.victor` → `com` → `root`. Gana el primer ancestro configurado. Esa herencia es toda la razón por la que una sola línea puede activar el debug de un paquete entero, y por qué `root` es el fondo de saco.

> **Por esto escribes líneas `log.debug(...)` que nunca ves.** Una línea `DEBUG` no es código muerto — es un switch que está *apagado ahora mismo*. Cuando un endpoint se comporta mal en staging, subes ese paquete concreto a `DEBUG`, reproduces, lees, y lo devuelves a su sitio — **sin cambio de código, sin rebuild, sin redespliegue**. Ese es el retorno de haber elegido los niveles con cuidado desde el principio, y por eso el debate de "qué nivel es esta línea" no es pedantería: el nivel *es* la API de tu log.

> **De dónde salieron esos dos switches de Spring/Hibernate de [12-depuracion-en-produccion.md](12-depuracion-en-produccion.md).** `logging.level.org.springframework.security=DEBUG` no es una función especial que trae Spring Security. Es este mismo mecanismo apuntado a *sus* loggers — las propias clases de Spring llaman a `log.debug(...)` por toda la cadena de filtros, y cada una de esas líneas ha estado ahí, apagada, desde tu primera ejecución. No estás añadiendo logging; lo estás desmuteando.

---

## Spring Boot Actuator — y la property que filtra tu secreto JWT

Propósito: darle a ops (y a un orquestador de contenedores) una forma de preguntarle a la app en ejecución "¿estás viva, y puedes llegar a la base de datos?" — sin abrir ni una sola línea de log — y saber exactamente qué endpoints nunca deben ser públicos.
Archivo: `projects/07-timetrack/backend/timetrack/pom.xml` — **propuesto: TimeTrack NO tiene la dependencia de Actuator hoy. Todo en esta sección es el estado objetivo, no tu configuración actual.**
Docs: [Baeldung — Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators) → read: "Predefined Endpoints" y "Security" (la sección sobre exposición es la que importa)

Los logs responden *qué pasó*. Actuator responde *qué está pasando ahora mismo*, y se lo responde a una **máquina**. Una dependencia, cero código:

```xml
<!-- propuesto para TimeTrack — todavía no está en el pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Por defecto eso expone dos endpoints por HTTP — `/actuator/health` y `/actuator/info` — y `health` es el que se gana la dependencia:

```json
GET /actuator/health
{
  "status": "UP",
  "components": {
    "db":        { "status": "UP", "details": { "database": "PostgreSQL" } },
    "diskSpace": { "status": "UP" }
  }
}
```

Conociste este endpoint en [12-depuracion-en-produccion.md](12-depuracion-en-produccion.md) como *tu* primer chequeo de triaje. Su propósito real es que **nadie humano lo está leyendo.** Un orquestador de contenedores (el `healthcheck` de Docker, el liveness probe de Kubernetes) lo consulta cada pocos segundos y actúa según la respuesta: deja de enrutar tráfico a un contenedor que deja de decir `UP`, reinicia uno que deja de responder por completo. Esa es la respuesta de entrevista a *"¿cómo sabe ops que tu app está arriba?"* — no "revisan los logs", sino "la plataforma consulta un health endpoint, y Spring Boot trae uno de serie".

El componente `db` está haciendo trabajo real, no repitiendo un dato de arranque: el `DataSourceHealthIndicator` de Actuator toma prestada una conexión del pool de Hikari y ejecuta una query de validación trivial, ahí mismo. Así que `"db": "DOWN"` significa que Postgres es inalcanzable **ahora**, que es precisamente la distinción entre "la app está caída" y "la app está arriba y la base de datos no".

### La línea peligrosa

Actuator tiene alrededor de quince endpoints más, desactivados por HTTP por defecto. Cada tutorial, cada respuesta de Stack Overflow, y cada developer impaciente los activa todos con la misma línea:

```properties
# ❌ MAL — nunca escribas esto. Es la línea más peligrosa que puede haber en un archivo properties de Spring Boot.
management.endpoints.web.exposure.include=*
```

Ese wildcard publica, sin autenticación si tu cadena de seguridad lo permite en `/actuator/**`:

| Endpoint | Qué consigue un atacante |
|---|---|
| `/actuator/env` | **La lista completa de properties resueltas — cada clave, cada fuente, incluyendo `app.jwt.secret`.** Los valores están enmascarados por defecto en Boot 3/4 (ver el callout de abajo), pero una property `show-values` puesta a la ligera convierte la lista en los valores mismos — y con tu secreto de firma un atacante forja un token para cualquier usuario, con cualquier rol, y toda tu capa `@PreAuthorize` es decoración |
| `/actuator/heapdump` | Un volcado binario de la memoria de la JVM: entidades, DTOs, contraseñas en tránsito, tokens vivos. Descargable, y luego se abre offline con calma |
| `/actuator/beans`, `/mappings` | El mapa interno completo de tu app — cada clase, cada ruta, incluidas las que pensabas que estaban sin documentar |
| `/actuator/loggers` | Escribible en tiempo de ejecución — un atacante puede activar `DEBUG` para que la app filtre más, o desactivarlo para dejarte ciego mientras actúa |
| `/actuator/shutdown` | Detiene la aplicación. (Desactivado por defecto incluso bajo `*`, lo cual te dice cómo califican los maintainers al resto de la lista.) |

Cómo leer esa tabla: léela como un solo argumento visto cinco veces — *cada fila le entrega a un extraño algo que la aplicación se construyó para mantener dentro*. Tu `application.properties` dice `app.jwt.secret=${JWT_SECRET}`, y el valor se mantiene fuera de git precisamente para que nunca se filtre ([01-basicos.md](01-basicos.md)). Esa precaución protege al *repositorio*. No hace nada respecto a un proceso en ejecución al que le has dicho que publique sus propios internos por HTTP: `/env` le nombra la property al mundo, `/heapdump` envía la memoria del proceso donde está sentado el secreto resuelto, y `/loggers` deja que el atacante suba o baje el ruido mientras trabaja.

```properties
# ✅ BIEN — expón exactamente lo que la plataforma necesita, nada más
management.endpoints.web.exposure.include=health,info
```

> **"Pero `/env` enmascara los secretos, ¿no?"** En Spring Boot 3 y 4 — las versiones en las que está TimeTrack — sí, por defecto: `management.endpoint.env.show-values` viene en `never`, así que **todos** los valores de property vuelven como `******`, no solo los de nombre sospechoso. (Ese default es más nuevo que la mayor parte de internet: Boot 2 enmascaraba con una heurística por *coincidencia de nombre* — `password`, `secret`, `key`, `token` — que dejaba pasar en texto plano una property llamada `app.jwt.signing-material`. La mitad de las respuestas de Stack Overflow que encontrarás todavía describen ese comportamiento antiguo.) Dos razones para no relajarlo: el enmascarado está a **una property de distancia de estar apagado** — cada tutorial de "¿cómo veo mi config?" te dice que pongas `show-values=always`, y lo pone el mismo developer que escribió `include=*` — y enmascarar `/env` no hace absolutamente nada por `/heapdump`, que entrega la memoria en crudo donde vive el secreto sin enmascarar. Así que la postura no es "confía en el enmascarado": es **no expongas el endpoint**, y además exige autenticación sobre `/actuator/**` en tu `SecurityFilterChain` ([06-seguridad-jwt.md](06-seguridad-jwt.md)) para que ni siquiera `health` quede libre para internet.

> **Cómo llega esto a una entrevista.** No te van a pedir que recites la lista de endpoints. Te van a enseñar un archivo properties con `exposure.include=*` y te van a preguntar *"¿qué endpoints expone esto, y están asegurados?"* — y la respuesta esperada, dicha en una frase, es: **"`/env` imprime el secreto JWT resuelto, así que esta línea le da a cualquiera la capacidad de forjar tokens."** Ese es todo el test, y por eso este punto está en el archivo de coverage justo al lado de los de logging: filtrar un secreto a través de la config es el mismo fallo que filtrarlo a través de una línea de log, solo que por una tubería distinta.

---

## Cómo se ve esto en una entrevista

Propósito: convertir el archivo en las cuatro respuestas que una consultora española de verdad examina en una ronda de code review.
Docs: relee el ejemplo de `approve()` en la sección dos — es la respuesta a la primera pregunta de abajo

- **"¿Qué registrarías en el endpoint approve?"** → Un `INFO` en el éxito que lleve *quién, qué, de quién y cuándo* (`"Entry {} approved by {} (owner {}, {} hours on {})"`), porque una aprobación es un hito de negocio con dinero de por medio y la línea de log debe dejarte reconstruirlo sin la base de datos. Un `WARN` en la transición ilegal, porque el guard funcionó y nada se rompió — pero un cliente legítimo nunca debería haber enviado esa request. Nada al entrar al método. Y dilo en voz alta como regla: **registra resultados, no entradas.**
- **"¿Qué tiene de malo `log.error(e.getMessage())`?"** → Extrae un solo campo y descarta el stack trace, el número de línea y toda la cadena de `cause` — y para una NPE `getMessage()` es `null`, así que la entrada de log dice `null`. Pasa la exception como último argumento (`log.error("Failed to approve entry {}", id, e)`) y SLF4J imprime la traza completa. Esta es la línea de mayor valor de todo el archivo; es lo que los entrevistadores buscan en tus bloques `catch`.
- **"¿Por qué `log.info("x {}", id)` en vez de `log.info("x " + id)`?"** → Java evalúa los argumentos antes de la llamada, así que la concatenación construye el string *antes* de que el logger pueda comprobar siquiera si el nivel está activado — pagas por un mensaje que nadie lee. La forma con placeholder pasa una plantilla constante más los argumentos en crudo y formatea **solo después** de que la comprobación del nivel pase. Con `DEBUG` apagado, es un test booleano y un return.
- **"¿Qué no debe aparecer nunca en un log?"** → Contraseñas, JWTs en crudo, request bodies enteros con datos personales. Luego nombra el mecanismo, porque eso es lo que demuestra que lo entiendes: `log.info("login request {}", request)` sobre un DTO `@Data` imprime la contraseña en crudo, porque `{}` llama a `toString()` y el `toString()` de Lombok incluye cada campo. Arréglalo con `@ToString.Exclude` en el campo, para que la clase no pueda filtrarlo desde ningún sitio.
- **"¿Qué endpoints de Actuator expones?"** → `health` e `info`, y `/actuator/**` está detrás de autenticación. Nunca `exposure.include=*`: publica `/env` (que nombra cada property, y también imprime los valores en cuanto alguien pone `show-values=always`), `/heapdump` (la memoria cruda de la JVM donde está sentado el `app.jwt.secret` resuelto), y `/loggers` (escribible en tiempo de ejecución). Con ese secreto de firma un atacante forja un token para cualquier usuario con cualquier rol, y toda la capa de seguridad es decoración.

---

## Hacia dónde va esto

Este archivo cierra la secuencia numerada de Spring Boot, así que merece la pena decir en qué se resumieron los doce archivos anteriores. Puedes construir la app (01), exponerla por HTTP (02–03), persistirla (04), fallar limpiamente (05), asegurarla (06), validarla (07), mantenerla consistente (08), testearla (09), desplegarla (10), y poner las reglas de negocio donde pertenecen (11). Luego el 12 te enseñó a leer la evidencia que deja atrás un sistema roto — y este archivo te enseñó que la evidencia solo existe porque alguien, meses antes, decidió que existiría.

Vuelve una última vez a la fila corrupta en `APPROVED`. Con la línea `INFO` de la sección dos en su sitio, la investigación que era imposible se convierte en treinta segundos de trabajo: haz grep del log buscando `Entry 42 approved`, lee el email del manager y el timestamp, y ya tienes el *quién* y el *cuándo*. Ese es el retorno completo de este archivo.

Pero fíjate en lo que todavía no tienes, y es el límite honesto de dónde estás: no puedes seguir **una sola request de un usuario** a lo largo del log, porque Tomcat entrelaza requests concurrentes y lo único que une las líneas es un nombre de thread que se recicla. No puedes buscar en un millón de líneas por campo, porque una línea de log es prosa. Y todavía no puedes explicar una ralentización que venga del connection pool en vez de de tu código.

Esas tres brechas tienen nombre. Dos de ellas — los correlation ids y el connection pool — ya están aparcadas en [`notes/spring-boot/future-learning.md`](../../coverage/senior.md); la tercera va justo al lado:

- **Correlation ids (MDC)** — estampar un id generado en cada línea de log de una request, para que la llamada fallida de un usuario mapee exactamente a las líneas que produjo, a través de cada clase que tocó.
- **Logging estructurado / JSON** — emitir cada línea como un objeto JSON con campos tipados (`entryId`, `userEmail`, `level`) en vez de una frase, para que un agregador pueda *consultar* tus logs (`entryId = 42 AND level = ERROR`) en vez de hacerles grep.
- **Ajuste del pool de HikariCP** — `Connection is not available, request timed out`: el fallo que aparece cuando las conexiones se retienen demasiado tiempo (una query lenta, o una llamada HTTP dentro de un bloque `@Transactional`), y por qué subir `maximum-pool-size` esconde la fuga en vez de arreglarla.

Ninguno de los tres es un filtro de junior, y ninguno hace falta para la entrevista que estás preparando. Son las tres primeras cosas que encontrarás el día que de verdad operes un servicio — que es, no por casualidad, el día en que todo lo de este archivo deja de ser un tema de estudio y pasa a ser la razón por la que puedes irte a casa a las seis.
