# Transacciones — @Transactional

> 📖 [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring)
> 📖 [Baeldung — Transaction Propagation and Isolation in Spring @Transactional](https://www.baeldung.com/spring-transactional-propagation-isolation)
> 📖 [Spring Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction.html) (secundaria — el manual de referencia, no un tutorial)

[07-validacion.md](./07-validacion.md) selló la puerta de entrada. Una petición que llega a `TimeEntryService.create()` no puede traer una descripción en blanco ni un `projectId` nulo, porque `@Valid` la rechazó en el controller y `GlobalExceptionHandler` ya le respondió al cliente con un `400` señalando el campo. Todo valor que pasa esa puerta llega limpio.

Y es justo ahí donde aparece un tipo nuevo de dato inválido — uno que ningún `@NotBlank` del mundo puede detener, porque **es tu propio código el que lo produce**. La validación garantiza que cada *valor* de entrada sea correcto. No garantiza absolutamente nada sobre cómo queda la base de datos cuando un método que hace *tres* escrituras lanza una excepción en la segunda. La primera escritura ya está dentro. La tercera nunca llegó a ocurrir. La fila que sobrevive es una que ninguna petición válida podría haber producido jamás, y ninguna anotación sobre un DTO puede evitarlo — el input era perfecto.

Ese es el hueco que cierra este archivo: **una vez que el input está limpio, ¿qué pasa cuando una sola petición tiene que cambiar más de una fila?** La respuesta no es una característica de Java. Es una garantía de la base de datos que Spring te deja pedir con una sola anotación.

---

## Qué es una transacción — la unidad de todo o nada

Propósito: entender la garantía que compra `@Transactional` antes de usar la anotación, porque la anotación es trivial y la garantía no lo es.
Archivo: ningún archivo del proyecto — esta sección es el concepto; el código de TimeTrack empieza en la siguiente sección.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → leer: "Configuring Transactions" y la introducción — explica el límite antes de mostrar ninguna anotación

Piensa en una transferencia bancaria. Mover 100€ de tu cuenta a la mía son dos operaciones: restar 100 de una fila, sumar 100 a otra. No existe un estado del mundo en el que "el dinero salió de mi cuenta" sea un punto de parada aceptable. O pasan las dos cosas o no pasa ninguna — una transferencia que se detiene a medias no es una transferencia lenta, es **dinero destruido**. El banco no resuelve esto escribiendo Java con mucho cuidado. Lo resuelve diciéndole a la base de datos: trata estas dos escrituras como una unidad indivisible.

Esa unidad es una **transacción**: un grupo de operaciones de base de datos que o surten efecto todas o ninguna. La propia base de datos la impone — mantiene tus cambios en un estado pendiente, y solo cuando dices `COMMIT` se vuelven reales y visibles para cualquier otro. Di `ROLLBACK` en su lugar (o se cae la conexión, o se cuelga el proceso) y la base de datos descarta todo lo que hiciste como si la conversación entera nunca hubiera pasado.

Así es el fallo sin una transacción, en términos de TimeTrack:

```
approve() sin transacción — dos escrituras, ninguna unidad

1. entry.setStatus(APPROVED) → save()   ✓ COMMITTED — la fila ya es APPROVED, para siempre
2. auditRepository.save(auditRow)       ✗ lanza excepción — la fila de auditoría nunca se escribe
→ Una entrada quedó aprobada y NADA registró quién la aprobó ni cuándo.
  El paso 1 no se puede deshacer: quedó committed en el instante en que se ejecutó.
```

El daño no es que el paso 2 haya fallado. Los fallos son normales — la red se cae, una constraint rechaza una fila. El daño es que **el paso 1 sobrevivió solo**, y ahora tu base de datos contiene un estado que tus reglas de negocio dicen que es imposible: una entrada aprobada sin ningún rastro de auditoría. Nadie va a ver nunca un error sobre esto. La excepción llegó al cliente como un `500`, el manager hizo clic otra vez, y la fila equivocada se queda ahí en silencio.

`@Transactional` sobre el método envuelve ambas escrituras en una sola unidad. Ahora la excepción del paso 2 hace rollback del paso 1 — automáticamente, por la base de datos — y la fila vuelve a `SUBMITTED` como si `approve()` nunca se hubiera llamado.

Aquí está el ciclo de vida completo, los dos finales posibles, en una sola imagen. Esta es la forma de la que cada sección posterior de esta página es una variación — las trampas son siempre sobre *la flecha que no se dispara*:

```
                        ┌──────────────────────────────────────┐
   llega la petición    │  BEGIN            (autoCommit=false) │
        │               │  la BD abre un espacio de trabajo    │
        ↓               │  privado                              │
   el proxy intercepta ─┴──────────────────┬───────────────────┘
                                           ↓
                              ┌─ escritura 1: UPDATE time_entry ─┐   pendiente —
                              │  escritura 2: INSERT audit       │   visible SOLO
                              └──────────────┬───────────────────┘   para esta tx
                                             │
                       ┌─────────────────────┴─────────────────────┐
        el método      │                                           │ el método lanza
        retorna        ↓                                           ↓  (unchecked)
        normalmente
                   ┌────────┐                                 ┌──────────┐
                   │ COMMIT │                                 │ ROLLBACK │
                   └───┬────┘                                 └────┬─────┘
                       ↓                                           ↓
        ambas escrituras se vuelven reales           ambas escrituras se descartan — la BD
        y visibles para cualquier otra conexión,     nunca las hizo permanentes, así que
        a la vez                                     no hay nada que "deshacer"
```

Cómo leerlo: los dos finales no cuestan lo mismo. `COMMIT` publica un trabajo que la base de datos ya escribió en disco; `ROLLBACK` descarta un trabajo que nadie más podía ver. Fíjate también en que **tu código nunca aparece en este diagrama** — tú no escribes ni `BEGIN` ni `COMMIT`. El proxy emite ambos, y lo único que tu método controla es cuál de las dos flechas toma: retornar normalmente, o lanzar una excepción.

> **¿Por qué no puedes simplemente hacer esto tú mismo en Java — comprobar el fallo y deshacerlo?** Porque "deshacerlo" es otra escritura, y esa escritura también puede fallar. Tendrías que capturar la excepción, emitir un `setStatus(SUBMITTED)` compensatorio, guardarlo — y si *ese* guardado lanza una excepción, o el JVM muere por el sistema operativo entre las dos operaciones, acabas en el mismo estado corrupto, ahora con más código. La transacción funciona porque el "deshacer" no vive en tu proceso en absoluto: la base de datos nunca hizo permanente el cambio, así que "deshacer" es solo *descartar un cambio pendiente*, algo que no puede fallar a medias. Esa es la razón entera de que esto sea una garantía de la base de datos y no una de Java — ninguna cantidad de `try/catch` puede darte atomicidad, porque tu propio bloque `catch` también es falible.

> **¿Qué significa "pendiente" exactamente — dónde viven los cambios antes del commit?** Son reales, pero privados. En el momento en que tu transacción emite un `UPDATE`, la base de datos lo escribe en disco (en Postgres, como una nueva versión de fila etiquetada con el id de tu transacción) y toma un lock sobre esa fila — pero cualquier *otra* conexión que lea esa fila sigue viendo la versión antigua, porque el id de tu transacción todavía no está committed. `COMMIT` no copia datos a ningún sitio; simplemente invierte una bandera que dice "la transacción 4711 está committed", y en ese instante cualquier otra conexión empieza a ver tu versión. `ROLLBACK` invierte la bandera en el sentido contrario, y la versión de fila que escribiste se convierte en basura que nadie va a leer jamás. Por eso un commit es rápido y por eso un rollback no es "deshacer tu trabajo" — no había nada que deshacer.

---

## Dónde poner @Transactional

Propósito: poner la anotación en la capa que es dueña de la operación de negocio, para que el límite de la transacción coincida con la unidad de trabajo que un usuario realmente pidió.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — **nota: ningún método de este archivo está anotado hoy**; el código de abajo es propuesto.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → leer: "@Transactional" y "Potential Pitfalls" — argumenta directamente a favor de ponerlo en la capa de service

Va en los **métodos de service**. No en los controllers — no tocan la base de datos, traducen HTTP a llamadas a métodos. No en los métodos de repositorio — Spring Data JPA ya envuelve cada llamada al repositorio en su propia transacción diminuta, así que anotarlos no aporta nada y esconde el límite real.

La razón por la que el service es la capa correcta es que es la única que sabe qué significa "una operación". El repositorio sabe `save()`. El controller sabe `POST /api/entries/1/approve`. Solo `TimeEntryService.approve()` sabe que aprobar una entrada *significa* cambiar un estado **y** registrar quién lo hizo — y la transacción debe envolver exactamente eso, ni más ni menos.

> **Sé honesto con tu propio código: `@Transactional` no aparece en ningún sitio del backend de TimeTrack.** Búscalo con grep — `create()`, `submit()`, `approve()`, `reject()`, `update()` y `delete()` en `TimeEntryService` son todos métodos `public` a secas. Hoy se salvan por una razón muy concreta: **cada uno hace exactamente una escritura.** `submit()` lee una entrada, la comprueba, y llama a `save()` una sola vez, y Spring Data envuelve ese `save()` único en su propia transacción — así que la única escritura o llega a buen puerto o no llega. No hay una segunda escritura que se quede a medias. Eso no es buen diseño, es una coincidencia del conjunto de funcionalidades actual, y caduca la primera vez que un método escriba dos veces. [11-logica-de-negocio-modelado-dominio.md](./11-logica-de-negocio-modelado-dominio.md) hace el mismo punto desde el lado de las reglas. La respuesta correcta en una entrevista no es "usé transacciones" — es *"los métodos de una sola escritura son implícitamente transaccionales gracias a Spring Data, así que hoy no hay nada roto; el día que añada la fila de auditoría, la anotación pasa a ser obligatoria, y esta es exactamente la razón"*.

Así es `approve()` tal como existe ahora, junto a la versión que añade la segunda escritura:

```java
// ❌ HOY — código real en TimeEntryService. Una sola escritura, así que sobrevive sin la anotación.
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

// ✅ PROPUESTO — el día que approve() también registre quién lo aprobó, dos escrituras necesitan una unidad
@Transactional
public TimeEntryResponse approve(Long id) {
    TimeEntry timeEntry = timeEntryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

    if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
        throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
    }

    timeEntry.setStatus(EntryStatus.APPROVED);          // escritura 1
    auditRepository.save(new AuditEntry(id, currentManager(), Instant.now()));  // escritura 2

    // Si la escritura 2 lanza excepción, la escritura 1 hace rollback — nunca hay una entrada aprobada sin su fila de auditoría
    return toResponse(timeEntry);
}
```

- **`@Transactional`** — Spring abre una transacción antes de que se ejecute el cuerpo del método y la hace commit cuando el método retorna normalmente. Lanza una excepción unchecked en su lugar, y hace rollback (cuáles excepciones exactamente es la última sección de este archivo — la respuesta es más estrecha de lo que parece).
- **`timeEntryRepository.save(timeEntry)` desaparece en la versión propuesta.** No es un descuido. Dentro de una transacción, `findById()` devuelve una entidad **gestionada** (managed): Hibernate la mantiene en su contexto de persistencia junto con una foto (snapshot) de sus valores de campo originales. En el momento del commit, compara la entidad con ese snapshot — **dirty checking** — ve que `status` cambió, y emite el `UPDATE` por sí mismo. Llamar a `save()` sobre una entidad que Hibernate ya gestiona es un no-op que muchos desarrolladores escriben por costumbre. Puedes dejarlo si te resulta más claro; solo hay que saber que no es lo que provoca la escritura.

> **¿Dónde empieza en realidad la transacción, si no es en tu método?** No es en el cuerpo del método — para cuando se ejecuta tu primera línea, la transacción ya está abierta. Spring envuelve tu bean en un **proxy** (la siguiente sección va enteramente sobre esto), y la versión del proxy de `approve()` es la que hace el trabajo real: le pide al `PlatformTransactionManager` una transacción, este saca una `Connection` JDBC del pool, llama a `setAutoCommit(false)` sobre ella, y la vincula al **hilo actual** — literalmente guardándola en un `ThreadLocal` dentro de `TransactionSynchronizationManager`. Solo entonces llama a tu código. Cada llamada a un repositorio que hagas después busca esa misma conexión vinculada al hilo en lugar de tomar una nueva, y por *eso* dos repositorios distintos en el mismo método acaban en una sola transacción sin que tú pases nada entre ellos. Cuando tu método retorna, el proxy hace commit y desvincula la conexión. El hilo es el cable invisible que conecta todo — y merece la pena recordarlo, porque en el momento en que el trabajo salta a otro hilo (`@Async`, un `Thread` nuevo), aterriza en un hilo sin nada vinculado, y la transacción no lo sigue.

---

## Transacciones de solo lectura — @Transactional(readOnly = true)

Propósito: marcar los métodos de consulta para que Hibernate se salte un trabajo de dirty-checking que no puede necesitar en absoluto — y conocer el daño silencioso de marcar el método equivocado.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — `findByFilter()` es el método de lectura que lo llevaría; hoy **no** está anotado.
Docs: [Baeldung — Using Transactions for Read-Only Operations](https://www.baeldung.com/spring-transactions-read-only) → leer: "Read-Only Transactions" y "Are Read-Only Transactions Useful?" — es el artículo dedicado a esta bandera, y es explícito en que el efecto depende del proveedor

Un método que solo lee no tiene nada que hacer commit. Decirle esto a Spring desbloquea una optimización real:

```java
// propuesto — findByFilter() en TimeEntryService no lleva anotación hoy
@Transactional(readOnly = true)
public List<TimeEntryResponse> findByFilter(Long userId, Long projectId, EntryStatus status, YearMonth month) {
    // …
    return timeEntryRepository.findByFilters(userId, projectId, status, start, end)
            .stream()
            .map(this::toResponse)
            .toList();
}
```

La ganancia es el **dirty checking**, el mecanismo de la sección anterior. Normalmente Hibernate mantiene un snapshot de cada entidad que carga y, en el commit, recorre todas comparándolas campo a campo contra el snapshot para averiguar qué cambió. Carga 500 entradas en un informe y eso son 500 snapshots guardados en memoria más 500 comparaciones al final — desperdicio puro, porque un método de lectura no cambia nada. `readOnly = true` elimina las dos mitades de ese desperdicio, y merece la pena saber que son **dos interruptores separados**, porque fallan de forma distinta:

| Interruptor que activa Spring | Qué hace | Qué ahorras |
|---|---|---|
| `session.setHibernateFlushMode(FlushMode.MANUAL)` | No hay flush automático en el commit, así que la comparación de dirty-check nunca se *ejecuta* | CPU — las 500 comparaciones |
| `session.setDefaultReadOnly(true)` | Las entidades se cargan sin conservar en absoluto su snapshot (el "estado hidratado") | Memoria — los 500 snapshots |

Cómo leer esa tabla: la segunda columna es el mecanismo, y las dos filas no son lo mismo dicho dos veces — `MANUAL` por sí solo seguiría guardando cada snapshot en memoria, simplemente nunca los miraría. Spring solo empezó a activar el segundo interruptor en la **5.1**; antes de eso, `readOnly = true` solo tocaba el flush y el ahorro de memoria no existía. Tú estás en Spring 6 (Boot 3.x), así que tienes los dos — pero por eso los posts de blog antiguos no se ponen de acuerdo sobre qué compra realmente la bandera.

> **Los dos interruptores son cosa del *transaction manager*, no de la anotación — por eso el efecto depende del proveedor.** `@Transactional(readOnly = true)` no hace nada por sí misma; fija un booleano en el `TransactionDefinition`, y cada `PlatformTransactionManager` decide qué hacer con él. `JpaTransactionManager` con Hibernate debajo activa los dos interruptores de arriba. Un proveedor distinto podría no activar ninguno e ignorar la bandera por completo. Baeldung lo dice sin rodeos, y esto importa para la trampa de abajo: **no puedes razonar sobre `readOnly = true` solo a partir de la anotación** — el comportamiento vive en el transaction manager y en el driver JDBC, una y dos capas más abajo.

Buena práctica: anotar todos los métodos de service. Las escrituras llevan `@Transactional`, las lecturas llevan `@Transactional(readOnly = true)`.

> **Marca un método que ESCRIBE como `readOnly = true` y la escritura desaparece en silencio — sin excepción, sin línea de log.** Este es el error más peligroso de esta página, y se deriva directamente de la tabla de arriba. Escribe `entry.setStatus(APPROVED)` dentro de un método `readOnly = true` y *los dos* interruptores conspiran contra ti: no hay ningún snapshot con el que comparar, y no hay flush que fuera a ejecutar esa comparación de todos modos. Así que Hibernate nunca se entera del cambio y **nunca genera un `UPDATE`**. Tu método retorna un `TimeEntryResponse` con `status: "APPROVED"` dentro, el cliente ve un `200 OK`, todo parece perfecto — y la fila en la base de datos sigue siendo `SUBMITTED`. La mentira solo se descubre en el siguiente refresco de la página. Lee la bandera por su verdadero nombre: no "este método no debe escribir" sino **"no te molestes en comprobar si algo cambió"** — y si algo cambió, esa comprobación era lo único que lo habría salvado.

> **Entonces, ¿por qué a veces sí ves `ERROR: cannot execute UPDATE in a read-only transaction`? Porque hay dos capas distintas diciendo "solo lectura", y cada una atrapa cosas distintas.** Estos dos hechos parecen una contradicción — si Postgres rechaza el update, la pérdida no es silenciosa — y resolverla es todo el sentido de esta sección. Además de los interruptores de Hibernate, Spring también llama a `Connection.setReadOnly(true)`, que el driver de Postgres convierte en `SET TRANSACTION READ ONLY` sobre la sesión real de base de datos. Postgres rechaza entonces cualquier sentencia de escritura que reciba:
>
> ```
> ERROR: cannot execute UPDATE in a read-only transaction
> ```
>
> Las palabras clave son **"cualquier sentencia de escritura que reciba"**. Ahí está la resolución: las dos afirmaciones nunca se aplican a la misma sentencia, porque están en lados opuestos del flush.
>
> ```
>   entry.setStatus(APPROVED)          @Modifying @Query("UPDATE …")
>   (entidad gestionada, dirty check)  (JPQL en bloque / query nativa)
>            │                                    │
>   flush de Hibernate ──✗ MANUAL                 │ executeUpdate() — se ejecuta ya,
>   sin snapshot, sin comparación                 │ el flush mode es irrelevante
>            │                                    │
>            ↓                                    ↓
>   nunca se genera ninguna sentencia      la sentencia llega a la conexión
>            │                                    │
>            ↓                                    ↓
>   ✗ SILENCIOSO — Postgres nunca         ✗ RUIDOSO — Postgres la rechaza
>     ve nada que rechazar                  ERROR 25006
> ```
>
> Hibernate es la primera puerta y Postgres es la segunda, así que **una sentencia que Hibernate nunca genera no puede ser rechazada por Postgres** — el silencio no es Postgres fallando en atraparla, es Postgres nunca siendo avisado. El camino ruidoso solo existe para escrituras que se saltan el flush y van directas a la conexión: JPQL en bloque con `@Modifying`, queries nativas, un `flush()` explícito, o un insert generado con `IDENTITY` (que Hibernate debe ejecutar de inmediato para obtener la clave).
>
> Fíjate en lo que *no* está en la lista ruidosa, porque la intuición se equivoca aquí: **`deleteById()` sobre un método `readOnly = true` también desaparece en silencio**, y también lo hace `save()` de un `TimeEntry` nuevo. `remove()` y `persist()` solo encolan trabajo para un flush que nunca llega — y `TimeEntry` declara un `@GeneratedValue` a secas, que en Postgres se resuelve como una *secuencia*, no como `IDENTITY`, así que ni siquiera el insert se ve forzado a salir antes de tiempo. El fallo ruidoso es el caso con suerte, y tú no eliges cuál te toca. Nunca recurras a `readOnly = true` como decoración en un método que no has leído hasta el final.

---

## @Transactional no funciona en métodos privados

Propósito: reconocer las dos formas en que un `@Transactional` correctamente escrito no hace absolutamente nada en silencio, y saber por qué el arreglo es estructural y no una palabra clave.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — todos los métodos aquí son `public`, así que la trampa de visibilidad no está viva hoy; `toResponse()` es el único método `private` y no hace ninguna escritura.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → leer: "Potential Pitfalls" — las trampas de auto-invocación y visibilidad están cubiertas ahí junto con la explicación del proxy

`@Transactional` no es una palabra clave que entienda el compilador. Funciona a través de un **proxy** — un objeto que Spring envuelve alrededor de tu bean y que intercepta cada llamada, abre la transacción, llama a tu método real, y hace commit. Sin interceptación, no hay transacción. Y un método privado no se puede interceptar, así que la anotación se ignora en silencio — sin error, sin advertencia, sin transacción:

```java
// ❌ MAL — @Transactional sobre un método privado no tiene ningún efecto
@Transactional
private void approveAndAudit(TimeEntry t) { ... }

// ✅ BIEN — public, así que el proxy puede interceptarlo
@Transactional
public void approveAndAudit(TimeEntry t) { ... }
```

> **El proxy es un recepcionista, y este es todo el modelo mental.** Imagina tu `TimeEntryService` como una oficina. Spring no le entrega la oficina directamente a nadie — pone un **mostrador de recepción** delante de ella. Cada visitante que llega desde fuera se detiene en recepción, y la recepcionista abre un expediente (arranca la transacción), lo hace pasar, y cierra el expediente cuando sale (hace commit). Eso es el proxy. Ahora los dos fallos de esta página son la misma frase: **un método privado es una puerta trasera sin mostrador de recepción delante**, y una auto-llamada es **caminar entre dos salas dentro de la oficina** — ya habías pasado por recepción, así que nadie sella nada en el camino. La recepcionista no está *dentro* del edificio; está en la puerta principal, y solo ve a quienes la cruzan.

> **Misma causa raíz, forma más traicionera — llamarlo desde dentro de la misma clase.** Incluso un método `public @Transactional` pierde su transacción si lo llamas *desde otro método de la misma clase* en lugar de pasar por Spring:
>
> ```java
> @Service
> public class TimeEntryService {
>
>     public void approveAll(List<Long> ids) {
>         ids.forEach(this::approve);   // ← auto-llamada: se salta el proxy, @Transactional en approve() nunca se ejecuta
>     }
>
>     @Transactional
>     public TimeEntryResponse approve(Long id) { ... }
> }
> ```
>
> La razón: cuando Spring crea el bean `TimeEntryService`, lo que realmente se inyecta en otras clases no es tu clase tal cual — es un **proxy**, una subclase generada (o un proxy dinámico de JDK) que envuelve tu clase y añade la lógica de transacción alrededor de cada llamada a un método. Las llamadas que llegan *desde fuera* del bean (por ejemplo, `TimeEntryController` llamando a `timeEntryService.approve(...)`) pasan primero por ese proxy, así que la lógica de transacción se ejecuta. Pero `this::approve` de arriba se llama como `this.approve(id)` desde *dentro* del mismo objeto — `this` es la instancia cruda, no el proxy que la envuelve, así que Java resuelve la llamada directamente contra la clase real y el proxy nunca entra en el camino. Sin proxy no hay transacción, exactamente igual que en el caso del método privado, solo que más difícil de detectar porque el método en sí es `public` y parece correctamente anotado. No hay forma de arreglar esto desde dentro de la misma clase — la solución estándar es mover `approve()` a un `@Service` distinto e inyectar ese bean, para forzar que la llamada salga del objeto y vuelva a pasar por un proxy.

> **¿Por qué Spring no te avisa directamente?** Porque en el momento en que construye el proxy no tiene ni idea de qué llamadas serán auto-llamadas — eso se decide en tiempo de ejecución, por tu código, dentro de un cuerpo de método que Spring nunca lee. Lo único que puede ver es la anotación, y la anotación es legal. Este es el precio de todo el modelo de proxy: es completamente transparente cuando funciona, y completamente invisible cuando no. Por eso también el fallo nunca es una excepción — desde el punto de vista de la JVM no ha pasado nada malo en absoluto, tu método simplemente se ejecutó sin ninguna transacción alrededor.

---

## LazyInitializationException — el error de JPA más común

Propósito: conectar el límite de la transacción con el límite de la sesión de Hibernate, porque son la misma línea y esta excepción es lo que pasa cuando la cruzas.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — `toResponse()` lee `timeEntry.getUser().getName()` y `getProject().getName()`, que es exactamente el acceso del que trata esta sección.
Docs: [Baeldung — Hibernate could not initialize proxy – no Session](https://www.baeldung.com/hibernate-initialize-proxy-exception) → leer: "The Problem" y "Solutions" — la solución con JOIN FETCH es la que importa aquí

El límite de la transacción es también el límite de la **sesión de Hibernate**: la sesión se abre con la transacción y se cierra con ella. Y una relación `FetchType.LAZY` no es un dato cargado — es un **proxy** (el mismo truco de la sección anterior, una capa más abajo): una subclase generada de `User` que solo guarda un id y una referencia a la sesión abierta, y que dispara su `SELECT` la primera vez que llamas a un getter sobre ella. Lo cual significa que el getter solo funciona mientras la sesión está viva. Tócalo después y el proxy sigue ahí sentado, pero la sesión a la que iba a preguntar ya no existe:

```
org.hibernate.LazyInitializationException: could not initialize proxy
    [com.victor.timetrack.model.User#3] - no Session
```

El `[com.victor.timetrack.model.User#3]` entre corchetes es la parte que te salva: Hibernate nombra la entidad exacta y el id para el que todavía sostenía un placeholder, así que te dice *qué* campo tocaste demasiado tarde — aquí, `User` con id 3. ([04-spring-data-jpa.md](./04-spring-data-jpa.md) cubre el mecanismo de LAZY/EAGER en sí; este archivo es donde se traza el límite.)

```java
// ❌ MAL — el service devuelve la entidad, así que el acceso ocurre después de que la sesión se cerró
@Transactional(readOnly = true)
public TimeEntry getById(Long id) {
    return timeEntryRepository.findById(id).orElseThrow(...);
}   // ← la sesión se cierra AQUÍ, al salir

// Controller — ya fuera de la transacción
TimeEntry t = service.getById(1L);
t.getUser().getName();   // LazyInitializationException — el proxy no tiene a quién preguntar
```

> **TimeTrack no lanza esta excepción hoy — y la razón es un bug, no un arreglo.** `TimeEntry` declara `@ManyToOne` sin ningún atributo `fetch` en `user` y en `project`, y el valor por defecto de `@ManyToOne` es **EAGER**. Así que Hibernate carga el `User` y el `Project` por adelantado, cada vez, y nunca queda un proxy que pueda romperse. Que `toResponse()` lea `timeEntry.getUser().getName()` de forma segura es cosa del azar. No leas esto como "TimeTrack lo hizo bien": significa que cada `findByFilter()` que devuelve 40 entradas arrastra en silencio 40 usuarios y 40 proyectos, los quiera o no quien llamó. El planteamiento honesto es que TimeTrack cambió una `LazyInitializationException` por un problema de rendimiento — y el día que cambies esos campos a `FetchType.LAZY` (lo cual deberías hacer), esta excepción pasa a estar viva y los arreglos de abajo se vuelven obligatorios.

**Arreglo 1 — convertir a DTO dentro de la transacción** (el enfoque correcto, y lo que TimeTrack ya hace):

```java
// ✅ BIEN — cada getter se llama mientras la sesión sigue abierta
@Transactional(readOnly = true)
public TimeEntryResponse getById(Long id) {
    TimeEntry t = timeEntryRepository.findById(id).orElseThrow(...);
    return toResponse(t);   // lee getUser().getName() AQUÍ — la sesión sigue abierta
}
```

Por esto devolver DTOs no es solo higiene de capas. `toResponse()` se ejecuta *dentro* del método, por tanto dentro de la transacción, por tanto dentro de la sesión — así que cada getter lazy que llama sigue teniendo a quién preguntar. El controller entonces recibe un `TimeEntryResponse` hecho de `String`s y `BigDecimal`s planos: no quedan proxies dentro, así que no hay nada que *pueda* fallar más tarde. El patrón DTO vuelve inalcanzable toda esta clase de bug sin querer (véase [02-controladores-rest.md](./02-controladores-rest.md)).

**Arreglo 2 — usar JOIN FETCH** cuando quieres que la relación se cargue con la propia query:

```java
@Query("SELECT t FROM TimeEntry t JOIN FETCH t.user WHERE t.id = :id")
Optional<TimeEntry> findByIdWithUser(@Param("id") Long id);
```

`JOIN FETCH` le dice a Hibernate que cargue la entrada y su usuario en **un solo** `SELECT`, así que nunca se crea un proxy para `user` y no queda nada que inicializar después. Recurre a esto cuando necesites la asociación de forma eager *solo para esta query concreta* — que es justo el punto: es una decisión por query, a diferencia del valor por defecto EAGER, que es una decisión por campo de la que no puedes escapar.

> **¿Por qué no hacer todo EAGER y borrar el problema?** Porque no estás borrando el problema, lo estás reubicando en un sitio sin ninguna excepción que te avise — precisamente el intercambio que hizo TimeTrack más arriba. EAGER significa que *cada* query sobre un `TimeEntry` también consulta su `User` y su `Project`, para siempre, incluido el informe que solo quería `hours`. La excepción es molesta; cargar tres tablas para renderizar un número es un incidente de producción que nunca lanza nada. LAZY + `JOIN FETCH` donde haga falta te da la opción por query. EAGER te quita la opción y esconde el coste.

---

## Propagación de transacciones — REQUIRED, REQUIRES_NEW, NESTED, SUPPORTS

Propósito: decidir qué pasa cuando un método `@Transactional` llama a otro — unirse a la unidad de la llamada, o abrir una genuinamente independiente.
Archivo: ningún archivo del proyecto — TimeTrack no tiene ningún `@Transactional`, así que no tiene propagación configurada en ningún sitio; todo lo de abajo es propuesto.
Docs: [Baeldung — Transaction Propagation and Isolation in Spring @Transactional](https://www.baeldung.com/spring-transactional-propagation-isolation) → leer: "Transaction Propagations" — recorre `REQUIRED`, `REQUIRES_NEW` y `NESTED` con la mecánica de suspender/reanudar

La propagación responde a una pregunta: cuando un método `@Transactional` llama a otro método `@Transactional`, ¿es una transacción o son dos?

| Propagación | Comportamiento |
|-----------|----------|
| `REQUIRED` (por defecto) | Unirse a la transacción de quien llama si existe; crear una nueva si no |
| `REQUIRES_NEW` | Siempre arrancar una transacción nueva; suspender la de quien llama hasta que termine |
| `NESTED` | Unirse a la transacción de quien llama, pero marcando antes un savepoint |
| `SUPPORTS` | Unirse si existe una; ejecutarse sin ninguna transacción si no |

Cómo leer esa tabla: la palabra que hace todo el trabajo es **"unirse"**, y pesa más de lo que parece. Unirse **no** significa "correr en paralelo" — significa que las escrituras del método interior pasan a formar parte de la única unidad de commit de quien llama y dejan de poder hacerse commit por su cuenta. De ahí se derivan tres consecuencias, y son toda la razón de que `REQUIRED` sea el valor por defecto sensato. El `@Transactional` del método interior no abre nada — simplemente encuentra ya vinculada al hilo la conexión de quien llama, y la usa. Que el método interior retorne normalmente no hace commit de **nada** — el commit ocurre una sola vez, cuando retorna el método *más externo*. Y una excepción en cualquier punto de la cadena hace rollback de **todo**, incluido un trabajo que el método interior había terminado con éxito diez líneas antes. Una unidad, un destino. `REQUIRES_NEW` es la única fila que rompe eso: es la única propagación cuyas escrituras pueden sobrevivir al rollback de quien llama.

En la práctica nunca fijas la propagación. `REQUIRED` es correcto para prácticamente cualquier método de negocio, y es correcto precisamente *por* ese comportamiento de unirse — "aprobar la entrada y escribir la fila de auditoría" debe tener un solo destino, y `REQUIRED` te lo da sin una sola línea de configuración, sin importar por cuántos services pase la llamada.

El único caso de uso real de `REQUIRES_NEW` es el log de auditoría al revés: quieres que el registro sobreviva **incluso cuando la operación de negocio falla**. Si la escritura de auditoría se uniera a la transacción principal, el rollback que deshace la aprobación fallida también borraría la evidencia de que alguien lo intentó — justo la fila que más querías conservar.

> **¿Por qué una transacción suspendida-y-luego-reanudada es genuinamente una unidad de commit separada?** Porque "suspender" no es una pausa — es un **intercambio de conexiones físicas de base de datos**, y ese es todo el mecanismo. Recuerda que Spring vincula la `Connection` JDBC de la transacción al hilo actual en un `ThreadLocal`. Cuando el proxy ve `REQUIRES_NEW`, *desvincula* la conexión exterior y guarda el objeto entero a un lado, luego toma una **segunda `Connection` completamente distinta** del pool, llama a `setAutoCommit(false)` sobre ella, y vincula *esa* al hilo. Tu método interior ahora corre contra una conexión que la base de datos ve como una sesión de cliente sin relación con la otra — hasta donde le importa a Postgres, hay dos usuarios distintos conectados. El método interior retorna, y el proxy envía un `COMMIT` real **sobre esa segunda conexión**. En ese instante la escritura queda durable y visible para todos: la base de datos ha terminado con ella y no guarda memoria de quién la pidió. Solo entonces el proxy devuelve la segunda conexión al pool y revincula la exterior al hilo.
>
> Así que cuando la transacción exterior más tarde hace rollback, emite `ROLLBACK` sobre **su propia** conexión — y un rollback solo puede descartar los cambios pendientes de *esa* conexión. La escritura interior no está pendiente en ella. No está pendiente en ningún sitio; fue commiteada por una sesión distinta y ya es permanente. No hay ningún vínculo entre las dos conexiones que la base de datos pueda seguir, y por eso funciona `REQUIRES_NEW`: la independencia no es una política que Spring imponga, es una consecuencia física de que la escritura ya ocurrió en otro sitio y ya está hecha.
>
> Una consecuencia a tener en cuenta, porque muerde: bajo JPA el intercambio no es solo de conexión, es un **segundo `EntityManager`** con su propio contexto de persistencia vacío. Así que una entidad que cargaste en el método exterior *no* está gestionada dentro del método `REQUIRES_NEW` — ahí es un objeto ajeno, y los cambios que le hagas no serán detectados por dirty-checking en la transacción interior. Pasa ids a través de ese límite, nunca entidades.
>
> ```
> conexión vinculada al hilo a lo largo del tiempo:
>
>   [tx exterior]  conn-A  BEGIN ──── escrituras ─────────────── ROLLBACK   ← deshace solo el trabajo de conn-A
>                          │                                 ▲
>              suspende ───┘                                 └─── reanuda
>                          ↓                                 ↑
>   [tx interior]        conn-B  BEGIN ── escritura ── COMMIT ┘   ← ya permanente, en otra sesión
> ```

> **`REQUIRES_NEW` frente a `NESTED` — el par que todo el mundo confunde.** Parecen sinónimos y se comportan como opuestos. `REQUIRES_NEW` son **dos conexiones, dos transacciones**: la interior hace commit de verdad y el rollback de la exterior no puede tocarla. `NESTED` es **una conexión, una transacción** con un `SAVEPOINT` marcado antes del trabajo interior: el "rollback" interior rebobina hasta ese savepoint, pero el trabajo interior sigue sin estar committed y pertenece a la transacción exterior — así que si la exterior hace rollback, el trabajo interior muere con ella. Usa `REQUIRES_NEW` cuando el trabajo interior deba sobrevivir al fallo de la exterior (el log de auditoría). Usa `NESTED` cuando quieras abandonar un paso opcional y seguir adelante, mientras al final haces commit de todo como una sola unidad. Si quieres que la fila de auditoría sobreviva, `NESTED` es exactamente la respuesta equivocada.

> **Y en TimeTrack, `NESTED` ni siquiera arrancaría — lanza una excepción en el acto.** Vale la pena saberlo antes de recurrir a esto alguna vez, porque el fallo ocurre al arrancar la llamada, no como un bug sutil de datos. Spring Data JPA te da un `JpaTransactionManager`, cuya bandera `nestedTransactionAllowed` viene por defecto en **`false`**, así que `@Transactional(propagation = NESTED)` falla de inmediato:
>
> ```
> org.springframework.transaction.NestedTransactionNotSupportedException:
> Transaction manager does not allow nested transactions by default -
> specify 'nestedTransactionAllowed' property with value 'true'
> ```
>
> La razón es honesta, no arbitraria: un savepoint es un concepto **JDBC**, así que hacer rollback hasta uno rebobina la *base de datos*, mientras que el contexto de persistencia de Hibernate — las entidades en memoria y sus snapshots — no sabe nada de eso y conserva lo que tenía. Te quedarías con una sesión cuyos objetos en caché afirman cosas que la base de datos acaba de desdecir. Spring se niega por defecto en lugar de entregarte eso. Así que `NESTED` es una respuesta real de entrevista y una característica JDBC real, pero en una app de Spring Data JPA está efectivamente apagada — lo cual deja a `REQUIRED` y `REQUIRES_NEW` como las dos únicas propagaciones entre las que realmente vas a elegir.

> **El interbloqueo de `REQUIRES_NEW`, en una frase — porque dos conexiones significan dos dueños de locks.** Si la transacción exterior ya escribió una fila (sosteniendo un lock sobre ella) y la transacción interior `REQUIRES_NEW` intenta escribir **esa misma fila**, la interior espera por un lock que la exterior solo va a liberar en su commit — y la exterior no puede llegar a su commit porque está bloqueada esperando a que la interior retorne. Ninguno de los dos puede avanzar. No es un caso extremo raro; es el resultado ordinario de apuntar `REQUIRES_NEW` a la misma tabla que ya está tocando quien llama, y es la razón principal por la que "simplemente añade `REQUIRES_NEW`" es mal consejo. También cuesta una segunda conexión del pool durante toda su duración — con suficientes llamadas `REQUIRES_NEW` concurrentes el pool se agota por peticiones esperándose a sí mismas.

---

## Niveles de aislamiento — qué puede ver otra transacción mientras la tuya corre

Propósito: responder la pregunta de seguimiento que siempre llega después de propagación, y saber por qué nunca has tenido que configurar esto.
Archivo: ningún archivo del proyecto — TimeTrack no fija ningún aislamiento en ningún sitio, así que cada transacción corre con el valor por defecto de PostgreSQL. Todo lo de abajo es contexto, no código propuesto.
Docs: [Baeldung — Transaction Propagation and Isolation in Spring @Transactional](https://www.baeldung.com/spring-transactional-propagation-isolation) → leer: "Transaction Isolations" — define cada anomalía con un ejemplo concreto de dos transacciones

La propagación era sobre que *tus* transacciones chocaran entre sí. El aislamiento es sobre **las de los demás**. Dos managers pulsan `approve()` sobre la misma entrada en el mismo instante; un informe corre `findByFilter()` durante tres segundos mientras se están enviando entradas por debajo. ¿Qué puede ver cada uno del trabajo sin terminar del otro? Eso es el aislamiento, y los niveles llevan el nombre de las anomalías que prohíben:

| Nivel | Prohíbe | La anomalía, en concreto |
|---|---|---|
| `READ_UNCOMMITTED` | nada | **Lectura sucia (dirty read)** — ves la escritura de otra transacción *antes* de que haga commit, y puede que aún haga rollback. Lees un dato que nunca existió. |
| `READ_COMMITTED` | lecturas sucias | **Lectura no repetible (non-repeatable read)** — lees la misma fila dos veces en tu transacción y obtienes dos respuestas distintas, porque alguien hizo commit entre medias. |
| `REPEATABLE_READ` | + lecturas no repetibles | **Lectura fantasma (phantom read)** — vuelves a ejecutar la misma *query* y aparece una fila extra que alguien más insertó y committeó. |
| `SERIALIZABLE` | + lecturas fantasma | Nada — el resultado es como si las transacciones se hubieran ejecutado una detrás de otra. |

Cómo leerla: los niveles son **acumulativos** — cada fila prohíbe todo lo de la fila de arriba más una anomalía adicional — así que leer la tabla hacia abajo es leer un deslizador de "rápido y relajado" a "lento y seguro". La columna "Prohíbe" es lo que compras; el precio siempre es la misma moneda, la **concurrencia**: los niveles más estrictos sostienen más locks durante más tiempo, así que más transacciones esperan, y en `SERIALIZABLE` algunas simplemente se abortan y hay que reintentarlas.

Tú nunca has fijado esto, y eso es lo correcto. `@Transactional` viene por defecto con `Isolation.DEFAULT`, que significa *"lo que sea que la propia base de datos tenga por defecto"* — Spring no pasa nada y el driver lo deja tal cual. Para PostgreSQL ese valor por defecto es **`READ_COMMITTED`**, y es la respuesta correcta para prácticamente cualquier aplicación CRUD, TimeTrack incluida: garantiza que nunca leas un dato que nunca llegó a hacer commit, y las dos anomalías que permite solo importan cuando una transacción lee lo mismo dos veces y *actúa* sobre la diferencia — algo que `approve()` no hace.

> **Dos hechos específicos de Postgres que hacen mentir a la tabla estándar, y merece la pena conocerlos cuando la cites.** Primero, PostgreSQL no implementa `READ_UNCOMMITTED` en absoluto — pídelo y en silencio obtienes `READ_COMMITTED`. Las lecturas sucias simplemente no son posibles en Postgres, con ninguna configuración. Segundo, el `REPEATABLE_READ` de Postgres también evita las **lecturas fantasma**, algo que la tabla de arriba dice que solo hace `SERIALIZABLE` — porque está implementado como aislamiento por snapshot, así que toda tu transacción ve una única foto congelada de la base de datos. La tabla es el **estándar** SQL, que define el mínimo que cada nivel debe prohibir, no el máximo; una base de datos es libre de ser más estricta. Así que la respuesta honesta en una entrevista es "estos son los cuatro niveles estándar y las anomalías que prohíben — aunque Postgres, que es lo que usé, en realidad solo tiene dos de ellos, y su `REPEATABLE_READ` es más fuerte de lo que exige el estándar."

---

## Error común — capturar la excepción dentro del método

Propósito: entender qué excepciones disparan realmente un rollback, para no escribir un `catch` que apague la atomicidad sin darte cuenta.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — el service no captura nada y deja que `BusinessRuleViolationException` se propague, que es la forma correcta; mantenlo así.
Docs: [Baeldung — Transactions with Spring and JPA](https://www.baeldung.com/transaction-configuration-with-jpa-and-spring) → leer: "Rollbacks" — cubre el valor por defecto de solo-unchecked y `rollbackFor`

Por defecto `@Transactional` hace rollback solo con excepciones **unchecked** — cualquiera que extienda `RuntimeException` o `Error`. **No** hace rollback con excepciones checked. Y solo puede reaccionar a las excepciones que realmente ve, que son las que escapan de tu método. Captura una y quédate en silencio, y el proxy ve un método que retornó perfectamente normal — así que hace commit:

```java
// ❌ MAL — el catch engulle la excepción, el proxy ve un éxito, todo hace commit
@Transactional
public void approve(Long id) {
    TimeEntry t = timeEntryRepository.findById(id).orElseThrow(...);
    t.setStatus(EntryStatus.APPROVED);
    try {
        auditRepository.save(new AuditEntry(id, currentManager(), Instant.now()));
    } catch (Exception e) {
        log.error("Audit write failed", e);   // engullida — sin rollback, la entrada se queda APPROVED
    }
}

// ✅ BIEN — dejar que se propague para que el proxy pueda hacer rollback
@Transactional
public void approve(Long id) {
    TimeEntry t = timeEntryRepository.findById(id).orElseThrow(...);
    t.setStatus(EntryStatus.APPROVED);
    auditRepository.save(new AuditEntry(id, currentManager(), Instant.now()));
    // la excepción se propaga → el proxy hace rollback → @RestControllerAdvice la mapea → respuesta de error limpia
}
```

La versión `MAL` es peor que no tener ninguna transacción, porque *parece* protegida. `@Transactional` está ahí mismo arriba del método, y no hace nada — lo desactivaste cuatro líneas más abajo con un `catch` que parecía responsable. Loguear un error no es gestionarlo.

> **¿Por qué solo unchecked — de dónde viene esa regla?** Es Spring copiando la vieja convención de EJB, y el razonamiento se sostiene: una excepción checked es una que el autor de la API te *obligó* a pensar (`throws IOException`), así que se trata como un resultado previsto, del día a día, que se espera que gestiones y del que continúes. Una excepción unchecked es por definición imprevista — nadie la declaró, así que nadie la planeó, así que la suposición más segura es que la operación está rota y su trabajo no debería quedarse en pie. La convención es discutible pero el valor por defecto no lo es: si necesitas que una excepción checked haga rollback, dilo explícitamente con `@Transactional(rollbackFor = IOException.class)`. Este valor por defecto es también la razón de que tu propia `BusinessRuleViolationException` funcione correctamente sin ninguna configuración — extiende `RuntimeException` ([05-manejo-excepciones.md](./05-manejo-excepciones.md)), así que es unchecked, así que hace rollback.

> **Puedes capturarla y aun así hacer rollback — pero tienes que decirlo explícitamente.** Si de verdad necesitas loguear o limpiar y aun así abortar, o bien relanza después del `catch`, o marca la transacción como rollback-only desde dentro:
>
> ```java
> } catch (Exception e) {
>     log.error("Audit write failed", e);
>     TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();   // el commit ya es imposible
> }
> ```
>
> `setRollbackOnly()` invierte una bandera sobre la transacción actual; el proxy la comprueba antes de hacer commit y hace rollback en su lugar, aunque no se haya lanzado nada. Relanzar es más claro y debería ser tu opción por defecto — recurre a esto solo cuando debas engullir la excepción por una razón que puedas defender en voz alta.

---

## Dónde te deja esto — y qué viene después

El cuadro de los últimos tres archivos ya está cerrado. La seguridad dice **quién** ([06](./06-seguridad-jwt.md)), la validación dice **qué** ([07](./07-validacion.md)), y la transacción dice **todo o nada** — así que una regla de negocio rota lanzada desde lo más profundo de `approve()` deja la base de datos exactamente como estaba antes de que llegara la petición. [11-logica-de-negocio-modelado-dominio.md](./11-logica-de-negocio-modelado-dominio.md) completa el trío desde el lado de las reglas: la entidad *detecta*, la transacción *deshace*, el `@RestControllerAdvice` *informa*.

Y ahora mira hacia atrás a lo que este archivo te ha prometido en realidad, y quién te lo prometió. Que el rollback ocurrió. Que `readOnly = true` no se comió tu update. Que la anotación de ese método está en el camino del proxy y no se salta por una auto-llamada. **Cada fallo de esta página es invisible** — sin excepción, sin línea de log, sin texto en rojo. Una excepción engullida hace commit en silencio. Una auto-llamada corre sin transacción en silencio. Una escritura en modo solo-lectura desaparece en silencio. No puedes leer esta corrección en el código, porque el código se ve idéntico tanto en el caso que funciona como en el que está roto: la anotación está ahí de cualquiera de las dos formas.

Lo cual deja exactamente una forma de saberlo: hacer que falle a propósito y observar la fila. Escribe un test que lance una excepción dentro del método y luego afirme que la entrada *sigue* siendo `SUBMITTED` — esa aserción es lo único que se interpone entre tú y un `@Transactional` que lleva sin hacer absolutamente nada desde el día en que lo añadiste. [09-testing.md](./09-testing.md) es donde aprendes a escribirlo: JUnit 5 y Mockito para la lógica del service, `@DataJpaTest` para la capa donde las transacciones realmente viven, y el pequeño giro que sorprende a todo el mundo al principio — `@Transactional` en un método de *test* significa algo distinto, porque Spring hace rollback de las escrituras de tu test a propósito para mantener la base de datos limpia entre tests.
