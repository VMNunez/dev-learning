# Lógica de negocio y modelado de dominio

Docs: [Baeldung — The Anemic Domain Model](https://www.baeldung.com/java-anemic-vs-rich-domain-objects) → leer: "Anemic Domain Model" y "Rich Domain Model"

[08-transacciones.md](08-transacciones.md) te dio el límite: una operación de negocio se ejecuta dentro de un único método `@Transactional`, así que o bien todos los cambios llegan a la base de datos, o ninguno lo hace. [05-manejo-excepciones.md](05-manejo-excepciones.md) te dio la puerta de salida: cuando se rompe una regla, haces `throw` de una excepción propia (`BusinessRuleViolationException`) y `@RestControllerAdvice` la convierte en un cuerpo JSON limpio con 409/400.

Lo que ninguno de esos dos archivos respondió es la pregunta que queda en medio: **las reglas en sí mismas — ¿dónde viven?** Un límite transaccional protege reglas que nunca lee. Un manejador de excepciones informa de una regla que nunca comprueba. Las reglas siguen flotando en algún lugar de tu código, y *dónde las coloques* es de lo que trata este archivo.

Esto no es académico. Es la pregunta que un entrevistador usa para separar a un junior que copió un tutorial de uno que pensó en el diseño, y en TimeTrack tiene un nombre: el workflow `DRAFT → SUBMITTED → APPROVED/REJECTED` que estás escribiendo ahora mismo en `TimeEntryService`.

---

## La regla que no tiene hogar — el workflow de TimeTrack

Propósito: entender el problema de negocio concreto antes de mirar ningún patrón — el workflow es el ejemplo que recorre todo el archivo.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/EntryStatus.java`
Docs: [Baeldung — Java Enums](https://www.baeldung.com/a-guide-to-java-enums) → leer: "Fields, Methods and Constructors in Enums" (un enum es una clase real — puede tener comportamiento, no solo nombres)

Un `TimeEntry` en TimeTrack no es una fila estática. Tiene una **vida**: un empleado lo crea, lo edita mientras sigue siendo privado, lo envía a un manager, y el manager lo aprueba o lo devuelve. Esa vida se expresa como cuatro valores en un enum:

```java
public enum EntryStatus {
    DRAFT, SUBMITTED, APPROVED, REJECTED;
}
```

Esos cuatro nombres son la parte fácil. La parte difícil son las reglas invisibles *entre* ellos:

```
        submit()               approve()
DRAFT ───────────► SUBMITTED ───────────► APPROVED
                       │
                       │  reject()
                       └─────────────────► REJECTED

Legal:   DRAFT→SUBMITTED, SUBMITTED→APPROVED, SUBMITTED→REJECTED
Ilegal:  DRAFT→APPROVED   (nadie lo aprobó — te saltaste al manager)
         APPROVED→DRAFT   (nóminas ya pagó esas horas)
         REJECTED→APPROVED(un manager dijo que no; nadie puede cambiarlo en silencio)
         APPROVED→APPROVED(una doble aprobación, normalmente un bug o un doble clic)
```

Lee el diagrama como una **máquina de estados**: las cajas son los estados en los que puede estar una entrada, las flechas son los únicos movimientos que el negocio permite, y cada flecha se dispara por una acción. Cualquier cosa que no esté dibujada como flecha es ilegal — y "ilegal" aquí no significa "feo", significa **que una entrada podría pagarse sin que un manager la haya visto nunca**.

> **¿Por qué se llama "máquina de estados" y no simplemente "unos cuantos if"?** Porque el conjunto de movimientos legales depende solo del estado en el que estás ahora mismo, nunca de cómo llegaste a él. Una entrada que está en `SUBMITTED` se puede aprobar o rechazar — punto. No importa si se envió hace un segundo o si se editó quince veces antes de eso. Esa propiedad es lo que te permite escribir las reglas como una tabla pequeña en lugar de un montón creciente de condiciones, y es exactamente la propiedad que los `if` sueltos destruyen.

Los estados en sí están garantizados por el sistema de tipos — `status` es un `EntryStatus`, así que nadie puede ponerlo a `"BANANA"`. Las **transiciones** no las garantiza nadie. `TimeEntry` está anotado con `@Data` de Lombok, que genera un `setStatus(EntryStatus)` público. Eso significa que esta línea compila, se ejecuta y paga en silencio a un empleado:

```java
entry.setStatus(EntryStatus.APPROVED);   // desde cualquier clase, desde cualquier estado, sin comprobación
```

Esa única línea es todo el problema. Todo lo que viene a continuación es una respuesta a ella.

---

## Modelo de dominio anémico vs rico

Propósito: nombrar las dos formas en que una base de código Spring puede repartir la lógica de negocio, para poder defender en una entrevista la que elegiste.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`
Docs: [Baeldung — Anemic vs Rich Domain Objects](https://www.baeldung.com/java-anemic-vs-rich-domain-objects) → leer: "Anemic Domain Model" — usa el mismo tipo de ejemplo (una entidad con solo getters/setters y un servicio que guarda las reglas)

Tu `TimeEntry` hoy es una entidad **anémica** de libro de texto — datos y nada más:

```java
@Data
@Entity
@Table(name = "time_entries")
public class TimeEntry {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false) private LocalDate date;
    @Column(nullable = false) private BigDecimal hours;
    @Column(nullable = false) private String description;

    @Enumerated(EnumType.STRING)
    private EntryStatus status = EntryStatus.DRAFT;

    private String rejectionNote;
    // + timestamps
}
```

"Anémica" (una palabra que Martin Fowler eligió a propósito — *anaemic*, sin sangre, drenada de vida) significa que el objeto lleva estado pero **no tiene comportamiento propio**. No puede *hacer* nada; las cosas se le hacen *a él*. Todo el conocimiento sobre lo que un `TimeEntry` puede o no puede hacer está una capa por encima, en `TimeEntryService`, en forma de comprobaciones `if`.

Lo contrario es un **modelo de dominio rico**: la entidad es dueña de las reglas que protegen sus propios datos. En una versión rica, nadie pone el status desde fuera — le pides a la entrada que se envíe a sí misma, y ella decide:

```java
// versión rica — la regla vive DENTRO de la entidad
public void submit() {
    if (this.status != EntryStatus.DRAFT) {
        throw new BusinessRuleViolationException("Employee can only submit DRAFT entries");
    }
    this.status = EntryStatus.SUBMITTED;
}
```

La diferencia no es estilística. Se trata de **qué es alcanzable**. En la versión anémica la regla es una comprobación que el llamador *elige* ejecutar; en la versión rica es un muro que el llamador *no puede rodear*, porque no hay otra puerta de entrada.

| | Entidad anémica + servicio gordo | Modelo de dominio rico |
|---|---|---|
| Dónde vive la regla | `TimeEntryService.submit()` | `TimeEntry.submit()` |
| Cómo cambia el status | `entry.setStatus(SUBMITTED)` | `entry.submit()` |
| ¿Se puede saltar la regla? | Sí — cualquier clase puede llamar al setter | No — el setter es privado/no existe |
| ¿Necesita beans de Spring (repos)? | Sí, libremente | No — la entidad no tiene dependencias |
| Necesidad de test unitario | Mocks de Mockito para los repos | `new TimeEntry()` y una aserción |
| Lo que realmente entregan los equipos de Spring | Esto, ~90% de las veces | Poco frecuente fuera de shops DDD |

Cómo leer esa tabla: la fila que decide el argumento es **"¿Se puede saltar la regla?"** — cada otra fila es un trade-off con el que puedes vivir de cualquiera de las dos formas, pero esa es una propiedad de corrección. Y la fila que explica por qué el estilo anémico sigue dominando es **"¿Necesita beans de Spring?"**: una entidad la crea Hibernate, no el contenedor de Spring, así que no se le puede inyectar un repositorio. En el momento en que una regla necesita *preguntarle algo a la base de datos* ("¿este usuario ya tiene 8 horas registradas ese día?"), físicamente no puede vivir dentro de la entidad. Esa regla pertenece al servicio, y punto.

> **Por eso la respuesta honesta es "las dos", no "rico es mejor".** Reparte las reglas según lo que necesiten. Una regla que solo lee los campos propios de la entidad (`status`, `hours`, `date`) es un **invariante** — algo que debe cumplirse en *este objeto* en todo momento — y pertenece a la entidad. Una regla que necesita otras filas, el usuario autenticado o un repositorio es una **regla de caso de uso** y pertenece al servicio. Con ese reparto, la comprobación de status de `submit()` va en la entidad (solo lee `this.status`), mientras que "solo puedes enviar tus propias entradas" se queda en el servicio (necesita el `User` autenticado).

> **¿Por qué Spring no te empuja hacia modelos ricos?** Porque todo el framework está construido alrededor de beans singleton sin estado: `@Service`, `@Repository` y `@Controller` son objetos que Spring crea una vez y comparte, y el lugar natural para poner lógica en esa arquitectura es un bean — una entidad es solo lo que JPA carga y guarda. Añade `@Data` encima (Lombok te da un setter público para cada campo, sin preguntas) y el estilo anémico es el camino de menor resistencia. Saber *por qué* es la norma — y que es un default, no una ley — es la diferencia entre "hice lo que hacía el tutorial" y "elegí esto".

**La pregunta de entrevista, literal:** *"¿Qué impide que alguien llame a `setStatus(APPROVED)` desde cualquier parte de tu código?"* En tu código actual, la respuesta honesta es: **nada**. Eso está bien — siempre que la sigas con lo que harías al respecto, que es la siguiente sección.

---

## Proteger la máquina de estados en UN solo sitio — `canTransitionTo()`

Propósito: sustituir las comprobaciones de status repartidas entre `submit()`, `approve()`, `reject()`, `update()` y `delete()` por una única definición revisable de qué transiciones son legales.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java`
Docs: [Baeldung — Java Enums](https://www.baeldung.com/a-guide-to-java-enums) → leer: "Fields, Methods and Constructors in Enums" — el mecanismo detrás de poner `canTransitionTo()` en el propio `EntryStatus`

### Primero el dolor — dónde viven las reglas ahora mismo

Las reglas del workflow en `TimeEntryService` son reales y correctas, pero están **repartidas en cinco métodos**, cada uno con un fragmento del diagrama:

```java
// submit()
if (timeEntry.getStatus() != EntryStatus.DRAFT) {
    throw new BusinessRuleViolationException("Employee can only submit DRAFT entries");
}
timeEntry.setStatus(EntryStatus.SUBMITTED);

// approve()
if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
    throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
}
timeEntry.setStatus(EntryStatus.APPROVED);

// reject()
if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
    throw new BusinessRuleViolationException("Manager can only reject SUBMITTED entries");
}
timeEntry.setStatus(EntryStatus.REJECTED);

// update()  → if (!status.equals(DRAFT)) throw …
// delete()  → if (!status.equals(DRAFT)) throw …
```

Nada de esto está *mal*. El problema es que la máquina de estados — el diagrama del principio de este archivo — **no existe en ningún sitio del código**. Solo existe en tu cabeza, proyectada sobre cinco `if` separados sentados en cinco métodos separados. De ahí se siguen tres consecuencias, y cada una de ellas es un bug real esperando a ocurrir:

1. **Nadie puede revisarla.** Para responder "¿qué transiciones son legales?" un revisor tiene que leer cada método del servicio y reconstruir el diagrama mentalmente. Si falta una rama, no hay nada contra lo que compararla.
2. **Se desvía en cuanto aparece un sexto método.** Añade `reopen()` el próximo sprint y la comprobación se copia y pega una sexta vez — o, mucho más probable, el autor escribe `entry.setStatus(DRAFT)` y se olvida por completo de la guarda. Nada en el código lo impide: el compilador está encantado, los tests de los otros cinco métodos siguen pasando, y una entrada `APPROVED` vuelve a `DRAFT` en silencio.
3. **La condición también se desvía.** Fíjate en que ya escribiste la misma comprobación de dos formas — `!=` en `submit()`, `.equals()` en `approve()`. Ambas funcionan sobre enums (ver el callout de abajo), pero es la huella dactilar del copy-paste, y el copy-paste es cómo se pierde un `!`.

> **`!=` o `.equals()` para enums — ¿cuál usar?** Las dos son correctas y `==`/`!=` es la opción idiomática. Una constante de enum es un **singleton**: la JVM crea exactamente un objeto `EntryStatus.DRAFT` para toda la aplicación y cada referencia apunta a ese mismo objeto, así que la comparación por referencia (`==`) y la comparación por valor (`.equals()`) nunca pueden discrepar. `==` es además **null-safe** — `status == DRAFT` con un status nulo es simplemente `false`, mientras que `status.equals(DRAFT)` lanza `NullPointerException`. Elige `==`/`!=` y úsalo en todas partes; el valor de la consistencia aquí es que un lector deja de tener que comprobar si la diferencia *significaba* algo.

### La solución — escribir el diagrama, una sola vez

La regla que buscas es una frase del tamaño de Victor: **la máquina de estados tiene que existir como un único artefacto en el código, no como un patrón repartido por los métodos que lo usan.** El sitio más limpio para ella es el propio `EntryStatus`, porque un enum de Java es una clase real — puede tener campos y métodos, no solo nombres de constantes.

```java
public enum EntryStatus {
    DRAFT, SUBMITTED, APPROVED, REJECTED;

    public boolean canTransitionTo(EntryStatus target) {
        return switch (this) {
            case DRAFT     -> target == SUBMITTED;
            case SUBMITTED -> target == APPROVED || target == REJECTED;
            case APPROVED, REJECTED -> false;   // estados terminales — sin salida
        };
    }
}
```

Ese método **es** el diagrama. Léelo de arriba abajo y obtienes exactamente las flechas dibujadas al principio de este archivo: `DRAFT` solo va a `SUBMITTED`; `SUBMITTED` se bifurca a `APPROVED` o `REJECTED`; `APPROVED` y `REJECTED` son **terminales** — ninguna flecha sale de ellos, así que cualquier destino devuelve `false`. Un revisor responde "¿qué transiciones son legales?" leyendo cuatro líneas, y no se puede añadir un estado nuevo (`REOPENED`) sin que el compilador te obligue a decir a dónde puede ir — un `switch` exhaustivo sobre un enum falla al compilar cuando queda una constante sin manejar:

```
error: the switch expression does not cover all possible input values
```

> **¿Por qué el enum y no la entidad o el servicio?** Tres pruebas. ¿Necesita la regla la base de datos? No — solo lee el status actual y el destino, así que no pertenece al servicio. ¿Necesita algún otro campo de la entrada (`hours`, `user`)? No — así que ni siquiera necesita `TimeEntry`. ¿Pertenece al *concepto de status*? Sí, por completo. La regla vive en la cosa más pequeña que la conoce por entero, y aquí eso es `EntryStatus`. Como bonus obtienes el test más barato posible — sin Spring, sin Mockito, sin base de datos: `assertFalse(EntryStatus.APPROVED.canTransitionTo(EntryStatus.DRAFT))`.

> **¿Y un *mapa* de transiciones en lugar de un `switch`?** Misma idea, forma distinta: un `Map<EntryStatus, Set<EntryStatus>>` que guarda los destinos legales por estado. Es la versión a la que recurres cuando las transiciones se convierten en datos (cargadas desde configuración, distintas por cliente) o cuando necesitas *preguntarle* a la máquina qué es posible — por ejemplo, para decirle a Angular qué botones habilitar. Para cuatro estados fijos, el `switch` lo comprueba el compilador de forma exhaustiva y el mapa no, así que gana el `switch`. Nombra el mapa igualmente en la entrevista; saber cuándo compensa cada forma es la señal real.

### Conectarlo a la entidad, para que no se pueda saltar

`canTransitionTo()` solo *responde* a una pregunta. Alguien tiene que *hacerla* todavía — y si preguntar se deja en manos del servicio, vuelves a tener cinco puntos de llamada que un sexto método puede olvidar. Así que haces que la entidad pregunte, dándole a `TimeEntry` el único método al que se le permite tocar el status:

```java
// en TimeEntry — la única puerta por la que debe pasar todo cambio de status
public void transitionTo(EntryStatus target) {
    if (!this.status.canTransitionTo(target)) {
        throw new BusinessRuleViolationException(
            "Cannot transition from " + this.status + " to " + target);
    }
    this.status = target;
}
```

Y los métodos del servicio pierden sus bloques `if` por completo:

```java
// ❌ ANTES — la regla está aquí, y en otros cuatro métodos
if (timeEntry.getStatus() != EntryStatus.DRAFT) {
    throw new BusinessRuleViolationException("Employee can only submit DRAFT entries");
}
timeEntry.setStatus(EntryStatus.SUBMITTED);

// ✅ DESPUÉS — el servicio dice QUÉ debe pasar; la entidad decide SI puede
timeEntry.transitionTo(EntryStatus.SUBMITTED);
```

Fíjate en qué se quedó el servicio y qué cedió. Cedió la regla de *transición* (estado puro, sin dependencias). Se quedó con la regla de *autorización*, porque esa necesita al usuario autenticado — algo a lo que una entidad no tiene acceso:

```java
// se queda en el servicio — necesita SecurityContextHolder y la fila User
if (!timeEntry.getUser().getId().equals(user.getId())) {
    throw new UnauthorizedException("You can only submit your own time entries");
}
timeEntry.transitionTo(EntryStatus.SUBMITTED);   // la entidad protege el resto
```

Ese es el reparto de la sección anterior hecho concreto: **invariantes en la entidad, reglas de caso de uso en el servicio.**

> **El setter sigue abierto — ciérralo.** `@Data` en `TimeEntry` genera un `setStatus()` público, así que `transitionTo()` ahora mismo es una puerta *educada* junto a una ventana abierta. El arreglo es una anotación: `@Setter(AccessLevel.NONE)` en el campo `status`, que le dice a Lombok que no genere setter para él. A Hibernate no le importa — escribe el campo por reflexión cuando carga una fila, no a través de tu setter — así que la persistencia sigue funcionando mientras el código de aplicación pierde el atajo. Ahora `entry.setStatus(APPROVED)` no compila, y "¿qué impide que alguien llame a `setStatus(APPROVED)`?" tiene respuesta: **el compilador.**

```java
@Enumerated(EnumType.STRING)
@Setter(AccessLevel.NONE)          // sin setter público — transitionTo() es la única entrada
private EntryStatus status = EntryStatus.DRAFT;
```

> **¿Por qué lanza la excepción desde dentro de la entidad — no es `throw` una cosa "de Spring"?** `BusinessRuleViolationException` es tuya, sin marcar ([05-manejo-excepciones.md](05-manejo-excepciones.md)) — una clase Java normal que extiende `RuntimeException`, sin dependencia de Spring. Viaja hacia arriba por la pila de llamadas, sale de la entidad, sale del servicio, sale del controlador, y `@RestControllerAdvice` la mapea al status HTTP que configuraste. La entidad *detecta*, el advice *informa* — y la pieza que falta es la que *deshace*.

> **Hueco abierto en tu código actual: `TimeEntryService` no tiene `@Transactional` en ningún método.** Ve a mirarlo — `create()`, `submit()`, `approve()`, `reject()`, `update()` y `delete()` son todos métodos `public` a secas. Hoy cada uno sobrevive a eso por casualidad porque hace un único `save()`, y Spring Data envuelve cada llamada al repositorio en su propia transacción pequeña, así que esa única escritura o llega o no llega. El día que un método haga *dos* escrituras (aprobar la entrada **y** añadir una fila a una tabla de auditoría), la primera puede confirmarse y la segunda explotar, y te quedas exactamente con el estado a medio escribir que [08-transacciones.md](08-transacciones.md) existe para evitar — la transacción es lo que hace que la operación completa sea todo-o-nada. Anota los métodos de escritura con `@Transactional` (y los de lectura con `@Transactional(readOnly = true)`), y entonces una transición ilegal lanzada desde dentro de la entidad revierte toda la operación, sin dejar **ningún** rastro en la base de datos. Ahí es cuando los tres archivos encajan por fin: la entidad *detecta*, la transacción *deshace*, el advice *informa*.

---

## Dónde se calcula un valor derivado — horas trabajadas

Propósito: decidir dónde se produce un valor que se *calcula a partir de otros datos* (un total mensual, una suma por proyecto), y entender qué se queda desactualizado en cada opción.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java`
Docs: [Baeldung — Spring Data JPA @Query](https://www.baeldung.com/spring-data-jpa-query) → leer: "JPQL" y los ejemplos de agregación

TimeTrack guarda `hours` por entrada como un `BigDecimal`. Pero la pantalla que un manager realmente quiere muestra **"Ana — 148,5h este mes"**. Ese número no está guardado en ningún sitio: se *deriva* de muchas filas. En el momento en que un valor es derivado, tienes que responder dónde se calcula — y cada respuesta cambia **frescura** por **coste de consulta**.

Hay tres sitios, y son los mismos tres en cualquier proyecto al que te unas:

| Dónde | Cómo se ve | ¿Siempre correcto? | ¿Puede SQL filtrar/ordenar por él? |
|---|---|---|---|
| Una columna persistida | `@Column private BigDecimal monthlyTotal;` | No — queda desactualizado en cuanto se edita una entrada | Sí |
| Un getter `@Transient` | `@Transient public BigDecimal getTotal()` | Sí — se recalcula en cada lectura | No |
| Un `SUM` en la consulta | `@Query("SELECT SUM(e.hours) …")` | Sí — la base de datos lo calcula ahora | Sí |

Cómo leer esa tabla: las dos columnas son todo el trade-off. **"¿Siempre correcto?"** pregunta si el valor puede llegar a discrepar de las filas de las que salió; **"¿Puede SQL filtrar/ordenar por él?"** pregunta si el valor existe en la base de datos, porque un valor que tu código Java calcula después de cargar los datos es invisible para `WHERE` y `ORDER BY` — no puedes pedirle a Postgres "empleados con más de 160h" si las 160h solo existen en la JVM.

**La columna persistida** es la tentadora y la trampa clásica de junior. Añades una columna `monthlyTotal`, la actualizas en `create()`, y al instante está mal: `update()` cambia las `hours` de una entrada y, a menos que recuerdes recalcular *también ahí*, y en `delete()`, y en cualquier método futuro que toque `hours`, el total guardado se aleja de la verdad. Este es exactamente el bug de la sección anterior, con otro disfraz — **una regla (el total debe ser igual a la suma) que se cumple en unos sitios y se olvida en otros.** Un valor derivado guardado es una máquina de estados con cien transiciones y sin `canTransitionTo()`. Acéptalo solo cuando el volumen de lectura lo exija de verdad, y entonces mantén el recálculo en un *único* sitio.

**El getter `@Transient`** pone el cálculo en el objeto, computado bajo demanda a partir de los datos ya cargados:

```java
@Transient   // calculado, nunca una columna — Hibernate no debe intentar persistirlo
public BigDecimal getDurationInMinutes() {
    return hours.multiply(new BigDecimal("60"));
}
```

`@Transient` es la anotación que le dice a JPA "ignora esto — no es una columna". Sin ella, Hibernate ve un getter llamado `getDurationInMinutes()`, infiere una propiedad, y falla al arrancar porque no existe tal columna en `time_entries`. Es la herramienta correcta para un valor derivado de **los propios campos de la entidad** y nunca puede quedar desactualizado — se recalcula en cada llamada. Lo que no puede hacer es agregar entre filas: calcular un total mensual así significa cargar en memoria cada entrada del mes y sumarlas en Java, lo cual está bien para 30 filas y es un desastre para 30.000.

**El `SUM` en la consulta** es el hogar correcto para cualquier cosa derivada entre filas. La base de datos está hecha exactamente para esto, lee las filas sin enviártelas a tu JVM, y el número es por definición actual:

Tu `TimeEntryRepository` hoy solo tiene una consulta derivada — `List<TimeEntry> findByUser(User user)` — y ningún total. El método de reporting de abajo es el que añadirías:

```java
// TimeEntryRepository — propuesto, todavía no escrito
@Query("SELECT SUM(e.hours) FROM TimeEntry e " +
       "WHERE e.user = :user AND e.date BETWEEN :from AND :to " +
       "AND e.status = com.victor.timetrack.model.EntryStatus.APPROVED")
BigDecimal totalApprovedHours(@Param("user") User user,
                              @Param("from") LocalDate from,
                              @Param("to") LocalDate to);
```

> **`SUM` sobre cero filas devuelve `null`, no `BigDecimal.ZERO`.** SQL está siendo literal: la suma de nada no está definida, no es cero. Así que el total de un empleado recién creado vuelve como `null` y la primera operación aritmética que hagas sobre él lanza `NullPointerException` — un 500 para un usuario que no ha hecho nada mal. Devuelve `Optional<BigDecimal>`, o envuélvelo (`COALESCE(SUM(e.hours), 0)`), y nunca asumas que un total es no-nulo. Este es el bug más común en un primer endpoint de reporting.

> **Fíjate en que la consulta filtra por `APPROVED`.** "Horas trabajadas" es una pregunta de negocio, no aritmética — una entrada `DRAFT` que el empleado ni siquiera ha enviado no es tiempo trabajado que nadie va a pagar. Qué statuses cuentan hacia un total es una regla de negocio exactamente igual que una regla de transición, y aplica el mismo principio: escríbela en **un** solo sitio (esta consulta, este nombre de método) para que un segundo endpoint de reporting no pueda elegir en silencio una definición distinta y producir un número distinto en una pantalla distinta.

> **¿Por qué `BigDecimal` y no `double` para las horas?** `double` es coma flotante binaria y no puede representar `0.1` exactamente — guarda la aproximación binaria más cercana, así que sumar muchas horas decimales acumula un error visible (el clásico `0.1 + 0.2 == 0.30000000000000004`). Las horas se convierten en dinero en una hoja de tiempos, y el dinero no puede desviarse. `BigDecimal` guarda los dígitos decimales y la escala de forma exacta. El precio que pagas es que `new BigDecimal("0.5")` es un objeto, no un primitivo — por eso la validación en tu `create()` se lee `request.getHours().compareTo(min) < 0` en lugar de `<`. `compareTo` devuelve un número negativo, cero o un número positivo, así que `< 0` significa "menor que". Y nunca compares un `BigDecimal` con `.equals()`: también compara la *escala*, así que `2.0` y `2.00` no son iguales — `compareTo(…) == 0` sí lo son.

---

## Cómo se ve esto en una entrevista

Propósito: convertir las tres decisiones de arriba en las respuestas que una consultora española realmente evalúa.
Docs: [Baeldung — Anemic vs Rich Domain Objects](https://www.baeldung.com/java-anemic-vs-rich-domain-objects) → leer la conclusión, y luego releer la tabla de trade-offs de este archivo

No te van a preguntar "define un modelo de dominio anémico". Te van a enseñar código — a menudo el tuyo propio — y te van a preguntar una de estas:

- **"¿Qué impide que alguien llame a `setStatus(APPROVED)` desde cualquier parte de tu código?"** La pregunta con más señal de todo este workflow. Una respuesta débil dice "nada, pero no hacemos eso". Una respuesta fuerte nombra el atajo, y luego lo cierra: sin setter público (`@Setter(AccessLevel.NONE)`), una única puerta `transitionTo()`, y los movimientos legales definidos una sola vez en `EntryStatus.canTransitionTo()`.
- **"¿Qué transiciones son ilegales, y dónde en tu código está eso escrito?"** Si la respuesta es "repartido entre cinco métodos del servicio", acabas de describir la deriva. Si es "un `switch` exhaustivo sobre el enum, y añadir un estado rompe la compilación hasta que lo manejo", has descrito un diseño.
- **"¿De dónde sale el total mensual, y qué pasa cuando una entrada cambia?"** Están sondeando la trampa de la columna desactualizada. Di `SUM` en la consulta, di por qué (no puede quedar desactualizado, la base de datos hace el trabajo, y `WHERE`/`ORDER BY` pueden usarlo), y menciona la mina del `null` con cero filas — ese último detalle es lo que dice que de verdad lo has ejecutado.
- **"¿Rico o anémico — cuál elegiste?"** Nunca respondas con una ideología. Responde con el reparto: los invariantes que solo leen el propio estado del objeto van en la entidad; las reglas que necesitan repositorios, otras filas o el usuario autenticado se quedan en el servicio, porque una entidad la construye Hibernate y no se le pueden inyectar beans.

---

## A dónde va esto después

Ahora tienes alineadas las tres capas de una operación de negocio: la **regla** vive en el objeto más pequeño que la conoce por completo, la **transacción** ([08-transacciones.md](08-transacciones.md)) hace que la operación entera sea todo-o-nada, y la **excepción** ([05-manejo-excepciones.md](05-manejo-excepciones.md)) lleva una regla rota hasta el cliente como una respuesta HTTP limpia.

Y luego lo despliegas — y un lunes por la mañana un manager te dice que hay una entrada `APPROVED` que nadie envió nunca. No se lanzó ninguna excepción, no falló ningún test, la fila simplemente está en un estado que tu diagrama dice que es inalcanzable. Una mala transición de estado es el bug de producción arquetípico: no deja stack trace, solo una fila equivocada, y encontrarlo significa razonar hacia atrás desde los datos hasta la ruta de código que podría haberla producido. Esa caza — logs, correlation ids, actuator, y cómo leer un sistema al que no puedes engancharle un debugger — es `12-production-debugging.md`.

> **Referencia futura:** `12-production-debugging.md` todavía no está escrito. Cuando lo esté, este es el hilo que recoge: un estado corrupto es *cómo* el fallo de diseño de este archivo se hace visible, semanas después, en producción.
