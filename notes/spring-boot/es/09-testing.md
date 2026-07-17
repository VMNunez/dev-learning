# Testing en Spring Boot

> 📖 [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing)
> 📖 [Spring Boot Testing Reference](https://docs.spring.io/spring-boot/reference/testing/)

## Retomando el hilo — los fallos que no puedes ver

[08-transacciones.md](./08-transacciones.md) terminó con un hecho incómodo: **todos los fallos de esa nota son silenciosos.** Una excepción tragada hace commit. Una self-call se ejecuta sin transacción. `readOnly = true` se traga tu update. En los tres casos no hay excepción, no hay línea de log, no hay texto en rojo — y el código fuente de la versión rota es indistinguible del de la versión que funciona, porque la anotación está ahí en los dos casos.

Esa es exactamente la forma del problema que resuelve esta nota, y no se limita a las transacciones. Mira lo que ya has construido y pregúntate cómo lo *sabrías*:

```
@Transactional en approve()   → ¿de verdad la entrada se quedó en SUBMITTED cuando la escritura de auditoría reventó?
@PreAuthorize("hasRole(...)") → ¿de verdad un token EMPLOYEE recibe 403, o el prefijo ROLE_ se descolocó?
@Valid en el body del request → ¿de verdad hours: null produce un 400, o llega hasta PostgreSQL?
@Enumerated(EnumType.STRING)  → ¿DRAFT se guarda como la palabra, o como el ordinal 0?
```

Leer el código no demuestra ninguna de estas cosas. Cada una es una afirmación sobre lo que pasa **en tiempo de ejecución**, dentro de un proxy o un filtro o Hibernate — maquinaria que no escribiste tú y que no puedes ver. Solo hay una forma de convertir una afirmación en un hecho: hacer que la cosa falle a propósito, y comprobar qué salió. Eso es un test, y por eso esta nota llega ahora, justo después de las tres notas (06 seguridad, 07 validación, 08 transacciones) que llenaron TimeTrack de promesas invisibles.

> **El giro que 08 ya te avisó — `@Transactional` en un método de *test* es un animal distinto.** En un método de service significa "envuelve esto en una transacción y haz rollback si algo unchecked se escapa". En un método de test, el framework de test de Spring lo lee como **"envuelve este test en una transacción y haz rollback al final, siempre — incluso cuando el test pasa"**, así que las escrituras nunca llegan a la base de datos y el siguiente test arranca desde cero. Misma anotación, intención opuesta: una hace rollback ante un fallo, la otra hace rollback a propósito. `@DataJpaTest` la activa por ti, por eso un test de repositorio que "guarda" una fila no deja nada detrás — y por eso puede pasar por el motivo equivocado. La sección de `@DataJpaTest` más abajo es donde esto muerde de verdad.

**Dónde está realmente el proyecto.** TimeTrack tiene **un** test hoy — `src/test/java/com/victor/timetrack/TimetrackApplicationTests.java`, el `contextLoads()` vacío que genera Spring Initializr:

```java
// src/test/java/com/victor/timetrack/TimetrackApplicationTests.java — el fichero real, completo
@SpringBootTest
class TimetrackApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

Ese test no es inútil — un cuerpo vacío igualmente arranca todo el contexto de la aplicación, así que falla si un bean no se puede inyectar o falta una propiedad. Pero no afirma nada sobre tu lógica. **Todos los demás bloques de código de esta nota son un test que todavía no has escrito**, propuestos contra las clases reales de TimeTrack. Trátalos como el plan, no como una cita del repositorio.

---

## El problema sin tests

Sin tests, encuentras los bugs en producción — o peor, el entrevistador los encuentra cuando haces la demo de tu proyecto. Más importante aún: las consultoras españolas en 2026 preguntan explícitamente si los candidatos saben escribir tests. Un proyecto sin tests es una señal de alarma.

El testing en Spring Boot no es una sola herramienta — son cuatro herramientas (`@WebMvcTest`, JUnit 5 + Mockito, `@DataJpaTest`, `@SpringBootTest`) con una regla clara sobre cuándo usar cada una.

---

## La estrategia de testing por capas — una herramienta por capa

Propósito: elegir el tipo de test correcto antes de escribir una línea, para que un fallo señale a una sola capa en vez de a toda la app.
Archivo: ningún fichero del proyecto — esta es la estrategia que siguen los tests propuestos más abajo; `src/test/` de TimeTrack solo tiene hoy `TimetrackApplicationTests.java`.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: la visión general de "Test Slices" al principio, antes de las secciones de anotaciones

```
Capa           Herramienta               Qué carga Spring
─────────────────────────────────────────────────────────────
Controlador    @WebMvcTest               Solo capa web — sin BD
Service        JUnit 5 + Mockito         Nada — Java puro, más rápido
Repositorio    @DataJpaTest              JPA + H2 en memoria
Flujo completo @SpringBootTest           Todo — más lento
```

**La regla:** testea cada capa de forma aislada. Un test de service no debería arrancar un servidor web. Un test de controlador no debería conectarse a una base de datos. Usar la herramienta incorrecta desperdicia tiempo y hace que los fallos sean difíciles de localizar.

---

## JUnit 5 — el test runner

Propósito: el framework que encuentra tus métodos de test, ejecuta cada uno y reporta si pasa o falla; todas las demás herramientas de esta nota se conectan a él.
Archivo: `projects/07-timetrack/backend/timetrack/pom.xml` — JUnit 5 llega a través de los dos starters con `scope` de `test`; ninguna clase de test usa todavía estas anotaciones más allá de `contextLoads()`.
Docs: [Baeldung — A Guide to JUnit 5](https://www.baeldung.com/junit-5) → read: "Annotations" y "Test Lifecycle" — muestra una clase completa por anotación, algo que la tabla de referencia de JUnit no hace

JUnit 5 es el framework de test Java estándar. Nunca lo añades a mano: Spring Initializr lo pone en el `pom.xml` por ti, dentro de los starters de test.

**Qué starter, en Boot 4.** Los tutoriales antiguos — y la mayoría de internet — te dicen que JUnit llega a través de un único `spring-boot-starter-test`. En **Boot 4 esa dependencia no existe**: se dividió por slice de test. El `pom.xml` real de TimeTrack tiene dos:

```xml
<!-- projects/07-timetrack/backend/timetrack/pom.xml — el fichero real -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc-test</artifactId>
    <scope>test</scope>
</dependency>
```

Las mismas herramientas debajo — JUnit 5, Mockito, AssertJ, `MockMvc` — solo que llegan en dos paquetes emparejados con las capas que uses ([01-basicos.md](./01-basicos.md) cubre la división y la regla de `<scope>test</scope>` que los mantiene fuera del jar de producción). Si copias una línea `spring-boot-starter-test` de un tutorial de 2023 en este proyecto, Maven falla al resolverla: `Could not find artifact org.springframework.boot:spring-boot-starter-test:jar` — el nombre simplemente ya no existe.

El esqueleto de toda clase de test que vas a escribir se ve así — una clase Java normal, sin Spring por ningún lado:

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class TimeEntryServiceTest {

    @BeforeEach
    void setUp() {
        // se ejecuta antes de cada @Test — resetea el estado aquí
    }

    @Test
    void shouldApproveEntry_whenSubmitted() {
        // código del test aquí
    }

    @Test
    void shouldThrow_whenEntryNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            service.approve(999L);
        });
    }
}
```

**Anotaciones de ciclo de vida clave:**

| Anotación | Cuándo se ejecuta |
|---|---|
| `@Test` | Marca un método como test |
| `@BeforeEach` | Antes de cada test — resetea mocks, prepara datos |
| `@AfterEach` | Después de cada test — limpieza |
| `@BeforeAll` | Una vez antes de todos los tests de la clase (debe ser `static`) |

Cómo leerla: la columna **"Cuándo se ejecuta"** en realidad te está diciendo *con qué frecuencia*, y eso es lo único que tienes que decidir. `@BeforeEach` se ejecuta N veces para N tests, así que es donde va todo lo que tiene que estar **fresco** (mocks nuevos, un contador reseteado). `@BeforeAll` se ejecuta exactamente una vez para toda la clase, así que es para cosas caras y **compartidas** (arrancar un contenedor, cargar un fichero de fixtures). Pon setup fresco en `@BeforeAll` y el test 2 hereda lo que el test 1 le hizo; pon setup caro en `@BeforeEach` y tu suite se arrastra.

> **Por qué `@BeforeAll` tiene que ser `static` — el mecanismo, y de paso explica `@BeforeEach`.** Por defecto **JUnit construye una instancia nueva de tu clase de test antes de cada `@Test`.** Diez métodos de test significan diez llamadas a `new TimeEntryServiceTest()`. Eso es deliberado: los campos no pueden filtrarse de un test a otro, porque no hay ningún objeto compartido por el que puedan filtrarse — cada test recibe campos vírgenes, que es lo que hace que los tests puedan ejecutarse en cualquier orden.
>
> Ahora sigue la línea temporal. `@BeforeAll` se define como "una vez, **antes de todos los tests**" — antes del *primer* test, lo que significa antes de que se construya la primera instancia:
>
> ```
> [ JUnit encuentra la clase ]
>        ↓
> se ejecuta @BeforeAll     ← todavía no existe ninguna instancia. No hay nada sobre lo que llamar a un método normal.
>        ↓
> new TimeEntryServiceTest()  →  @BeforeEach  →  @Test #1  →  @AfterEach
>        ↓
> new TimeEntryServiceTest()  →  @BeforeEach  →  @Test #2  →  @AfterEach   ← un objeto distinto
>        ↓
> se ejecuta @AfterAll
> ```
>
> Un método de instancia solo se puede invocar *sobre un objeto*, y en el momento en que `@BeforeAll` tiene que ejecutarse no existe ningún objeto. Un método `static` pertenece a la **clase** en lugar de a cualquier instancia, así que existe desde el momento en que se carga la clase — es el único tipo de método que se puede llamar en ese punto de la línea temporal. Esto no es una regla de JUnit inventada por estilo; se deriva directamente del diseño de una instancia por test. Olvídalo y JUnit se niega a ejecutar la clase directamente:
>
> `org.junit.platform.commons.JUnitException: @BeforeAll method 'void TimeEntryServiceTest.setUp()' must be static unless the test class is annotated with @TestInstance(Lifecycle.PER_CLASS).`
>
> El propio error nombra su vía de escape: `@TestInstance(Lifecycle.PER_CLASS)` en la clase le dice a JUnit que cree **una** instancia y la reutilice para cada test. Ahora sí existe un objeto antes del primer test, así que un `@BeforeAll` no estático se vuelve legal — al precio de perder la garantía de aislamiento, porque entonces todos los tests comparten esos campos. Quédate con `static`.

**Aserciones comunes:**

```java
assertEquals(expected, actual);        // los valores son iguales
assertNotNull(result);                 // el resultado no es null
assertTrue(result.isPresent());        // la condición es verdadera
assertFalse(result.isEmpty());         // la condición es falsa
assertThrows(SomeException.class, () -> { /* llamada que lanza */ });
```

---

## Testear un service — JUnit 5 + Mockito (sin Spring)

Propósito: demostrar la lógica de negocio de una sola clase de service en aislamiento, sin base de datos y sin contexto de Spring — el test que más escribes y el que se ejecuta en milisegundos.
Archivo: todavía ningún fichero del proyecto — el hogar propuesto es `src/test/java/com/victor/timetrack/service/TimeEntryServiceTest.java`, mockeando `TimeEntryRepository` para testear `submit()` y `approve()`.
Docs: [Baeldung — Mockito Annotations](https://www.baeldung.com/mockito-annotations) → read: las secciones de `@Mock` e `@InjectMocks`

Este es el test más rápido que escribes. No cargas Spring en absoluto — creas el service con repositorios mock pasados por el constructor, igual que funciona la inyección por constructor en producción. `TimeEntryService.approve()` es el método más limpio para empezar, porque no lee `SecurityContextHolder` — solo toca el repositorio de entradas, así que todo el test es `findById` → cambiar el estado → `save`.

```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)    // activa las anotaciones de Mockito
class TimeEntryServiceTest {

    @Mock
    TimeEntryRepository timeEntryRepository;  // Mockito crea un falso — devuelve null por defecto
    @Mock
    ProjectRepository projectRepository;      // el service necesita los tres argumentos del constructor…
    @Mock
    UserRepository userRepository;            // …aunque approve() solo use el primero

    @InjectMocks
    TimeEntryService service;        // service real, con los tres mocks inyectados

    @Test
    void approve_setsStatusToApproved_whenSubmitted() {
        // Arrange — construye una entrada SUBMITTED y dile al mock qué devolver.
        // toResponse() lee user.getName() y project.getName(), así que ambos deben estar seteados.
        User user = new User();
        user.setName("Alice");
        Project project = new Project();
        project.setName("Internal");

        TimeEntry entry = new TimeEntry();
        entry.setId(1L);
        entry.setUser(user);
        entry.setProject(project);
        entry.setStatus(EntryStatus.SUBMITTED);

        when(timeEntryRepository.findById(1L)).thenReturn(Optional.of(entry));
        when(timeEntryRepository.save(entry)).thenReturn(entry);

        // Act
        TimeEntryResponse result = service.approve(1L);

        // Assert
        assertEquals(EntryStatus.APPROVED, result.getStatus());
        verify(timeEntryRepository).save(entry);
    }

    @Test
    void approve_throwsNotFound_whenEntryMissing() {
        when(timeEntryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.approve(999L));
    }

    @Test
    void approve_throwsBusinessRule_whenNotSubmitted() {
        TimeEntry draft = new TimeEntry();
        draft.setStatus(EntryStatus.DRAFT);   // approve() solo acepta SUBMITTED
        when(timeEntryRepository.findById(1L)).thenReturn(Optional.of(draft));

        assertThrows(BusinessRuleViolationException.class, () -> service.approve(1L));
    }
}
```

> **Qué hace realmente `@ExtendWith(MockitoExtension.class)`.** JUnit 5 no sabe por sí solo qué significan `@Mock` o `@InjectMocks` — son anotaciones de Mockito, no de JUnit. `@ExtendWith` conecta una *extensión* de JUnit 5 al ciclo de vida del test; `MockitoExtension` es ese conector para Mockito. Antes de que se ejecute cada test, recorre la clase en busca de campos `@Mock` y crea un falso para cada uno, luego busca `@InjectMocks` y construye ese objeto, pasándole los falsos que acaba de crear — la misma inyección por constructor que usa Spring en producción, solo que aquí la monta Mockito en lugar de Spring. El constructor de `TimeEntryService` recibe tres repositorios, así que los tres campos `@Mock` existen aunque `approve()` nunca llame a dos de ellos. Sin `@ExtendWith(MockitoExtension.class)`, cada campo `@Mock` se queda en `null` y el test falla con una `NullPointerException` en la primera llamada.

**Arrange / Act / Assert** — estructura siempre los tests así:
- **Arrange** — configura los datos de test y el comportamiento del mock
- **Act** — llama al método que estás testeando
- **Assert** — comprueba el resultado

**¿Por qué no llamar a `timeEntryRepository.findById()` en un test de service sin mocking?** Porque el repositorio es un bean generado por Spring — solo existe cuando Spring está ejecutándose. Sin un mock, el test fallaría con una `NullPointerException` antes de llegar siquiera a tu código.

---

## Mockito — los métodos más útiles

Propósito: las cinco llamadas que cubren casi todos los mocks que vas a escribir — hacer que devuelva algo, hacer que lance, y demostrar que se llamó.
Archivo: todavía ningún fichero del proyecto — son las llamadas que usa el `TimeEntryServiceTest` propuesto contra un `TimeEntryRepository` mockeado.
Docs: [Baeldung — Mockito's Mock Methods](https://www.baeldung.com/mockito-behavior) → read: las secciones de `when()`/`thenReturn()` y `verify()`

```java
// Hacer que el mock devuelva algo
when(timeEntryRepository.findById(1L)).thenReturn(Optional.of(entry));
when(timeEntryRepository.findAll()).thenReturn(List.of(e1, e2));

// Hacer que el mock lance una excepción (ResourceNotFoundException recibe un único String de mensaje)
when(timeEntryRepository.findById(999L)).thenThrow(new ResourceNotFoundException("Entry not found with id 999"));

// Hacer que un método void lance una excepción — when().thenThrow() no funciona aquí, no hay valor de retorno al que encadenar
doThrow(new ResourceNotFoundException("Entry not found with id 999")).when(timeEntryRepository).deleteById(999L);

// Verificar que se llamó a un método
verify(timeEntryRepository).save(any(TimeEntry.class));
verify(timeEntryRepository, times(1)).deleteById(1L);
verify(timeEntryRepository, never()).delete(any());

// Matchers — cuando no te importa el valor exacto
when(timeEntryRepository.findById(anyLong())).thenReturn(Optional.empty());
```

> **`any()` y `anyLong()` son matchers de Mockito.** Coinciden con cualquier argumento del tipo dado. Úsalos cuando el valor exacto no importa para lo que estás testeando.

---

## @WebMvcTest — solo capa de controlador

Propósito: demostrar el contrato HTTP — routing, códigos de estado, forma del JSON y `@Valid` — sin ninguna base de datos cerca del test.
Archivo: todavía ningún fichero del proyecto — el hogar propuesto es `src/test/java/com/victor/timetrack/controller/TimeEntryControllerTest.java`, cubriendo `GET /api/entries` y un `POST /api/entries` inválido.
Docs: [Baeldung — Using MockMvc With @SpringBootTest vs. @WebMvcTest](https://www.baeldung.com/spring-mockmvc-vs-webmvctest) → read: la sección de `@WebMvcTest` — contrasta las dos configuraciones lado a lado, que es la distinción sobre la que gira la siguiente sección

Carga solo la capa web: controladores, filtros y `@ControllerAdvice`. Los services y repositorios no se cargan — los reemplazas con `@MockitoBean`.

```java
@WebMvcTest(TimeEntryController.class)
class TimeEntryControllerTest {

    @Autowired
    MockMvc mockMvc;               // simula requests HTTP sin un servidor real

    @MockitoBean
    TimeEntryService service;      // reemplaza el service real en el contexto en slice

    @Test
    @WithMockUser                  // TimeTrack asegura todos los endpoints — ver el callout de abajo
    void findByFilter_returns200_withList() throws Exception {
        TimeEntryResponse dto = new TimeEntryResponse();
        dto.setId(1L);
        dto.setProjectName("Internal");
        dto.setHours(new BigDecimal("7.5"));
        dto.setStatus(EntryStatus.SUBMITTED);
        when(service.findByFilter(null, null, null, null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/entries"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].projectName").value("Internal"))
            .andExpect(jsonPath("$[0].hours").value(7.5));
    }

    @Test
    @WithMockUser
    void create_returns400_whenDescriptionBlank() throws Exception {
        // description es @NotBlank en CreateTimeEntryRequest — envíalo vacío
        mockMvc.perform(post("/api/entries")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"projectId": 1, "date": "2026-07-17", "hours": 7.5, "description": ""}
            """))
            .andExpect(status().isBadRequest());
    }
}
```

> **`@MockitoBean`, no `@MockBean` — el nombre cambió en Boot 3.4 / 4.** Todos los tutoriales escritos antes de 2025 usan `@MockBean` (de `org.springframework.boot.test.mock.mockito`). En Boot 3.4+ esa anotación está **deprecada** y la reemplaza `@MockitoBean` (de `org.springframework.test.context.bean.override.mockito`) — el mismo trabajo, paquete nuevo, ascendida de Boot al núcleo de Spring test. Si copias `@MockBean` de un artículo antiguo, sigue compilando con un aviso de deprecación; escribe `@MockitoBean` en código nuevo y reconoce el nombre antiguo cuando lo leas.

> **Por qué `@WithMockUser` está en todos los tests aquí.** El `SecurityConfig` de TimeTrack termina en `.anyRequest().authenticated()`, y `@WebMvcTest` carga la cadena de filtros de seguridad como parte del slice web — así que sin un usuario autenticado toda request corta directamente a **401** antes de que tu controlador se ejecute, y `status().isOk()` falla. `@WithMockUser` (de `spring-security-test`) pone un principal autenticado falso en el `SecurityContext` durante el test, sustituyendo al JWT real que enviarías en Postman ([06-seguridad-jwt.md](./06-seguridad-jwt.md) es donde se construyó esa cadena). También necesitarás dejar fuera del slice los beans del JWT (`JwtFilter`, `JwtUtil`) o proporcionarlos — un `@MockitoBean JwtFilter` es el movimiento habitual.

**Qué testear con @WebMvcTest:**
- Códigos de estado HTTP correctos (200, 201, 400, 404)
- Forma del JSON de respuesta (`jsonPath("$.field").value(...)`)
- La validación rechaza input inválido (devuelve 400)
- `@ControllerAdvice` mapea excepciones al código de estado correcto

> **¿Por qué no llamar al método del controlador directamente?** Porque el comportamiento del controlador depende del mapping de requests de Spring, la serialización de Jackson y `@ControllerAdvice`. Llamar al método evita todo eso. `MockMvc` testea el stack HTTP completo sin un servidor real.

**@MockitoBean vs @Mock:**

| | Dónde | Qué hace |
|---|---|---|
| `@Mock` | JUnit + Mockito puro (sin Spring) | Crea un falso de Mockito |
| `@MockitoBean` | Dentro de `@WebMvcTest` o `@SpringBootTest` | Crea un falso de Mockito Y reemplaza el bean de Spring |

Cómo leerla: la división es "¿está corriendo Spring?" — usa `@MockitoBean` siempre que haya un contexto de Spring cargado (cualquier slice o `@SpringBootTest`), porque tiene que *sustituir* el bean real en ese contexto, no solo crear un falso. Usa `@Mock` para tests de service puros donde no existe ningún contexto y no hay ningún bean que reemplazar. (`@MockitoBean` es el sucesor en Boot 3.4+ del antiguo `@MockBean` — ver el callout de arriba.)

---

## @SpringBootTest — test de integración completo

Propósito: demostrar que todas las capas ensambladas juntas realmente hacen el trabajo — el único tipo de test que puede detectar un `@Transactional` que falta o una configuración de seguridad rota.
Archivo: `projects/07-timetrack/backend/timetrack/src/test/java/com/victor/timetrack/TimetrackApplicationTests.java` — el fichero real, y el único test de TimeTrack; usa `@SpringBootTest` con un cuerpo vacío para demostrar que el contexto arranca. La clase de abajo es propuesta, no está escrita.
Docs: [Baeldung — Integration Testing in Spring](https://www.baeldung.com/integration-testing-in-spring) → read: "@SpringBootTest" y la configuración de `@AutoConfigureMockMvc` justo después

Carga todo el contexto de la aplicación: todos los beans, auto-configuración y una conexión real a la base de datos. Úsalo para los flujos críticos — verificar que un POST request realmente escribe una fila en la base de datos.

```java
@SpringBootTest
@AutoConfigureMockMvc
class TimeEntryIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    TimeEntryRepository repository;

    @Test
    @WithMockUser(username = "alice@timetrack.com", roles = "EMPLOYEE")
    void createEntry_savesToDatabase() throws Exception {
        // create() busca al que llama por email y el proyecto por id antes de guardar,
        // así que un User con este email y un Project activo con id=1 deben existir ya.
        mockMvc.perform(post("/api/entries")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"projectId": 1, "date": "2026-07-17", "hours": 7.5, "description": "Backend work"}
            """))
            .andExpect(status().isCreated());

        assertEquals(1, repository.count());
    }
}
```

> **De dónde tiene que salir el `alice@timetrack.com` de `@WithMockUser`.** `TimeEntryService.create()` hace `SecurityContextHolder.getContext().getAuthentication().getName()` y luego `userRepository.findByEmail(name)` — así que el username en `@WithMockUser` tiene que coincidir con una **fila real** en la base de datos de test, o `create()` lanza `ResourceNotFoundException` y obtienes un 404 en vez del 201 que afirmaste. `@WithMockUser` falsea la *autenticación* (sustituye al JWT), nunca los *datos*: siembra primero el usuario y un proyecto activo (un script `@Sql` o un `save()` en `@BeforeEach`), y entonces este test es honesto.

> **Qué está haciendo ahí `@AutoConfigureMockMvc`, y por qué `@SpringBootTest` solo no basta.** Las dos anotaciones responden a dos preguntas distintas. `@SpringBootTest` dice *"construye todo el contexto de la aplicación"* — cada bean, el service real, el repositorio real, una conexión real a la base de datos. No dice nada sobre **cómo envías una request** dentro de él, porque por defecto no arranca ningún servidor web ni ningún `MockMvc`: te entrega un contexto lleno de beans y espera que los llames como objetos Java. `@Autowired MockMvc mockMvc` en esa clase fallaría al arrancar con `No qualifying bean of type 'org.springframework.test.web.servlet.MockMvc' available`, porque nadie creó uno.
>
> `@AutoConfigureMockMvc` es la anotación que lo crea. Dispara la auto-configuración que construye un bean `MockMvc` conectado al `DispatcherServlet` real, a los controladores reales y a la cadena de filtros de seguridad real del contexto que acabas de arrancar — y luego lo pone en el contexto para que `@Autowired` lo encuentre. Ese es todo el trabajo: **`@SpringBootTest` proporciona la aplicación, `@AutoConfigureMockMvc` proporciona la puerta hacia ella.**
>
> No la necesitaste en el `@WebMvcTest` de arriba porque `@WebMvcTest` es una anotación de *slice* — configurar `MockMvc` es parte de la definición del slice, así que ya viene activado. `@SpringBootTest` no es un slice; no asume nada sobre la capa web, así que pides la puerta explícitamente. Y fíjate en lo que "mock" **no** significa aquí: nada de tu app está falseado. No hay Tomcat ni socket TCP — `MockMvc` llama al `DispatcherServlet` directamente en la misma JVM — pero el routing, el binding de Jackson, la comprobación de `@Valid`, los filtros y tu service real corren todos de verdad. Por eso la aserción de abajo puede comprobar la fila real de la base de datos después.

**Cuándo usarlo:** solo para los flujos críticos — login, registro, escrituras clave. No para cada método.

> **Lento pero real.** @SpringBootTest arranca la aplicación completa. Captura bugs que los tests unitarios no detectan — SQL incorrecto, `@Transactional` que falta, seguridad mal configurada. Úsalo con moderación porque es 10–100× más lento que un @WebMvcTest.

---

## @DataJpaTest — solo capa de repositorio

Propósito: demostrar que una derived query o un `@Query` devuelven las filas correctas, contra un stack JPA real pero sin controladores ni services.
Archivo: todavía ningún fichero del proyecto — el hogar propuesto es `src/test/java/com/victor/timetrack/repository/TimeEntryRepositoryTest.java`, cubriendo la query de filtros detrás de `GET /api/entries`.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: la sección de `@DataJpaTest`

Carga solo entidades JPA, repositorios y una base de datos H2 en memoria. No carga controladores ni services.

```java
@DataJpaTest
class TimeEntryRepositoryTest {

    @Autowired
    TimeEntryRepository repository;

    @Autowired
    TestEntityManager em;   // persiste el User + Project que las columnas FK NOT NULL exigen

    @Test
    void findByFilters_returnsOnlySubmitted_whenFilteringByStatus() {
        User user = new User();
        user.setName("Alice");
        user.setEmail("alice@timetrack.com");
        user.setPassword("x");
        user.setRole(Role.EMPLOYEE);
        em.persist(user);

        Project project = new Project();
        project.setName("Internal");
        em.persist(project);

        repository.save(entry(user, project, EntryStatus.SUBMITTED));
        repository.save(entry(user, project, EntryStatus.DRAFT));

        // el @Query detrás de GET /api/entries: los filtros null significan "sin filtro en esa columna"
        List<TimeEntry> result = repository.findByFilters(null, null, EntryStatus.SUBMITTED, null, null);

        assertEquals(1, result.size());
        assertEquals(EntryStatus.SUBMITTED, result.get(0).getStatus());
    }

    private TimeEntry entry(User user, Project project, EntryStatus status) {
        TimeEntry e = new TimeEntry();
        e.setUser(user);
        e.setProject(project);
        e.setDate(LocalDate.now());
        e.setHours(new BigDecimal("7.5"));
        e.setDescription("Backend work");   // las tres son @Column(nullable = false)
        e.setStatus(status);
        return e;
    }
}
```

> **Por qué el `TimeEntry` necesita primero un `User` y un `Project` persistidos.** `time_entries.user_id` y `project_id` son `@JoinColumn(nullable = false)` — la fila no puede existir sin las dos foreign keys apuntando a filas reales. Así que persistes un `User` y un `Project` a través de `TestEntityManager` antes de guardar cualquier entrada, o el insert falla una restricción NOT NULL / FK. Esta es la diferencia con una entidad de una sola tabla: un `@DataJpaTest` igualmente tiene que satisfacer todo el grafo relacional, en memoria, exactamente como lo haría PostgreSQL.

**Cuándo usarlo:** para verificar que los derived query methods y los métodos `@Query` devuelven los datos correctos.

> **`@DataJpaTest` es `@Transactional` — y este es el giro para el que [08](./08-transacciones.md) te mandó aquí.** `@DataJpaTest` pone silenciosamente `@Transactional` en tu clase de test, y en un *test* esa anotación significa "haz rollback de todo cuando el método termine, pase o falle". Por eso las llamadas a `save()` de arriba no dejan nada detrás y el siguiente test arranca limpio — sin sentencias `DELETE`, sin juegos de orden.

> El matiz está en lo que "rollback" implica sobre el SQL que nunca se ejecutó. Hibernate no inserta en `save()`; encola el insert y lo vuelca al hacer **commit** — y aquí nunca hay commit. La mayoría de las veces te salvas por casualidad: un `findByFilters()` en la misma transacción fuerza un flush antes, así que las filas existen cuando llega la query. Pero escribe un test que afirme que una restricción `UNIQUE` o `NOT NULL` *rechaza* una fila mala y pasará en verde mientras el `INSERT` nunca se llegó a enviar a la base de datos — la restricción que estás testeando nunca tuvo la oportunidad de dispararse. La solución es forzar el SQL tú mismo con `saveAndFlush()` en vez de `save()`, o con `TestEntityManager.flush()`. Un test que no demuestra nada es peor que ningún test, porque cuenta como cobertura.

> **H2 no es PostgreSQL.** `@DataJpaTest` usa H2 (en memoria) por defecto — es rápido pero no idéntico a PostgreSQL. Si tu query usa sintaxis específica de PostgreSQL (como `RETURNING` o SQL nativo), el test puede pasar en H2 pero fallar en la base de datos real. Para queries que te importan, ejecuta un test de integración contra PostgreSQL real.

---

## Qué detecta cada tipo de test

Propósito: elegir en qué capas se puede esconder un bug dado, para saber qué test merece la pena escribir para detectarlo.
Archivo: ningún fichero del proyecto — esta es la tabla de decisión detrás de "El mínimo para el proyecto 07" de más abajo.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: la introducción — explica por qué existen los slices en vez de un solo tipo de test para todo

| Qué salió mal | @WebMvcTest | JUnit+Mockito | @DataJpaTest | @SpringBootTest |
|---|:---:|:---:|:---:|:---:|
| Mapeo de URL incorrecto | ✓ | | | ✓ |
| Código de estado HTTP incorrecto | ✓ | | | ✓ |
| Regla de validación incorrecta | ✓ | | | ✓ |
| Lógica de negocio incorrecta | | ✓ | | ✓ |
| Query SQL incorrecta | | | ✓ | ✓ |
| @Transactional que falta | | | | ✓ |
| Seguridad mal configurada | | | | ✓ |

Lee un ✓ como "este tipo de test realmente falla si se introduce este bug" — una celda vacía no significa que esa capa esté a salvo del bug, significa que ese tipo de test no tiene forma de detectarlo aunque esté presente (por ejemplo, un test de service `JUnit+Mockito` no puede detectar un mapeo de URL incorrecto, porque nunca toca la capa web).

Por eso se necesitan tanto tests unitarios como de integración — detectan diferentes tipos de bugs. Un @WebMvcTest que pasa no garantiza que la lógica de negocio sea correcta.

---

## El mínimo para el proyecto 07

Propósito: el conjunto más pequeño de tests que se lee como "este candidato testea su backend" en vez de "este candidato ha oído hablar de JUnit".
Archivo: todavía ningún fichero del proyecto — `src/test/` solo tiene hoy `TimetrackApplicationTests.java`, así que los tres de abajo están todavía por escribir.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: el artículo completo una vez, de principio a fin, antes de escribir el primero de los tres

1. Un test de service `@ExtendWith(MockitoExtension.class)` — al menos el happy path de `approve()` y el caso not-found
2. Un test de controlador `@WebMvcTest` — al menos `GET /api/entries` (200) y un `POST /api/entries` inválido (400)
3. Un test de integración `@SpringBootTest` — al menos un flujo create completo (POST → fila en BD)

Esto es lo que se espera que entregue un desarrollador junior. Tests en tres capas, un test por caso crítico por capa.

---

## Ejercitando la API — Postman y fallos HTTP

Propósito: manejar tus propios endpoints a mano — para hacer la demo en una entrevista, y para ver los bytes exactos que va a recibir el cliente de un revisor.
Archivo: ningún fichero del proyecto — Postman vive fuera del repositorio, en la colección `07 - TimeTrack`. Los endpoints ejercitados abajo son los reales de `controller/TimeEntryController.java` y `controller/UserController.java`.
Docs: [Baeldung — Testing Web APIs with Postman Collections](https://www.baeldung.com/postman-testing-collections) → read: "Creating a Collection" y la parte del encadenado de requests · [Baeldung — A Guide to Variables in Postman](https://www.baeldung.com/java-postman-variables) → read: "Environment Variables"

Todo lo anterior a esta línea automatiza una prueba: escribes la aserción una vez y una máquina la vuelve a comprobar para siempre. Entonces, ¿por qué una sección entera termina la nota haciendo clic en botones de una GUI?

Porque las dos responden a preguntas distintas. **Un test demuestra que el código es correcto; Postman muestra lo que el cliente realmente recibe.** Eso se separa constantemente — un `ErrorResponse` donde falta `fieldErrors` porque `@JsonInclude(NON_NULL)` lo eliminó, una `LocalDate` serializada en una forma que Angular no puede parsear, un 403 donde jurabas que escribiste 401. Un `jsonPath("$.status").value(400)` en verde no dice nada de los otros seis campos de ese body. Y está la razón más simple: cuando un entrevistador dice *"enséñame tu API"*, no le ejecutas `mvn test` delante. Abres una colección y disparas requests de verdad mientras mira. Los tests son para ti; Postman es para la sala.

> **Este es también el bucle que ya viviste.** [06-seguridad-jwt.md](./06-seguridad-jwt.md) te hizo testear el Flow 1 en Postman después del paso 7, y el Flow 2 después del paso 10 — mucho antes de que existiera una sola clase JUnit. Eso no era un parche provisional hasta que llegaran los tests "de verdad". Postman es cómo descubres el contrato; JUnit es cómo lo congelas una vez que te gusta. Vas a seguir haciendo las dos cosas en un trabajo.

### Las cuatro cosas que necesita toda request

Una request en Postman son exactamente las cuatro piezas de una request HTTP, y el `POST /api/entries` de TimeTrack necesita las cuatro:

```
Method   POST
URL      http://localhost:8080/api/entries
Headers  Content-Type: application/json          ← lo que estás enviando
         Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...   ← quién eres
Body     raw → JSON:
         {
           "projectId": 1,
           "date": "2026-07-17",
           "hours": 7.5,
           "description": "Backend work"
         }
```

Cada campo ahí lo obliga código que tú escribiste. Las cuatro claves del body son los cuatro campos de `CreateTimeEntryRequest`, cada una con `@NotNull`/`@NotBlank` — así que omite `description` y te devuelves a ti mismo un 400. El header `Authorization` existe porque `SecurityConfig` termina en `.anyRequest().authenticated()`, así que solo `/api/auth/**` es alcanzable sin él. Y `Content-Type` es lo que le dice a Spring qué converter convierte esos bytes en tu DTO. Omítelo y obtienes un 415 — el primero de los tres fallos de abajo.

> **La pestaña `Body` tiene un desplegable `raw`, y elegir `JSON` no es cosmético.** Seleccionar `JSON` ahí hace que Postman ponga `Content-Type: application/json` en la request por ti. Dejarlo en `Text` envía los mismos bytes con `Content-Type: text/plain` — mismo body, misma URL, y un 415. Esta es la razón número uno de "el mismo request le funciona a mi compañero y a mí no".

### Environments y variables — por qué una colección plana parece amateur

Siguiendo la convención de Victor, la colección de TimeTrack es `07 - TimeTrack`, con carpetas por recurso:

```
07 - TimeTrack                  (colección)
├── auth        → POST {{baseUrl}}/api/auth/login
├── entries     → GET/POST {{baseUrl}}/api/entries, PATCH .../{id}/submit, .../{id}/approve
├── projects    → GET/POST/PUT/DELETE {{baseUrl}}/api/projects
├── users       → GET {{baseUrl}}/api/users
└── reports     → GET {{baseUrl}}/api/reports/by-project?month=2026-07
```

`{{baseUrl}}` es una **variable**, y viene de un **environment** — una bolsa nombrada de pares clave/valor que cambias con un desplegable. Crea uno llamado `TimeTrack local` con `baseUrl = http://localhost:8080`. La ventaja se nota el día que ejecutes la misma colección contra Docker en otro puerto, o una URL desplegada: cambias un valor en un solo sitio en vez de editar veinte requests.

La variable que se gana el puesto es `{{token}}`. Tu JWT vive 24 horas (`app.jwt.expiration=86400000`) y luego cada request devuelve 401, así que el bucle manual es: iniciar sesión, seleccionar el token de la respuesta, copiarlo, pegarlo en el header `Authorization` de cada request. En su lugar, pon esto en la pestaña **Tests** de la request de login — un pequeño script que Postman ejecuta *después* de que llega la respuesta:

```javascript
// auth → POST {{baseUrl}}/api/auth/login — pestaña Tests
pm.environment.set("token", pm.response.json().token);
```

Lee el campo `token` de `AuthResponse` y lo escribe en el environment. Cada otra request pone su header a `Bearer {{token}}` una sola vez, para siempre. Iniciar sesión lo vuelve a rellenar para toda la colección.

> **Por qué esto vale diez minutos de tu vida.** Es la diferencia entre entregarle a un revisor una colección donde pulsa *login* y luego todo funciona, y entregarle veinte requests con un token muerto puesto a mano en cada uno. Mismos endpoints; uno de los dos dice que ya has hecho esto antes. Postman también tiene variables dinámicas al estilo `{{$timestamp}}` y variables por colección — el environment es el que de verdad necesitas.

### 415 vs 405 vs 404 — tres momentos de "esto no funciona", distinguidos en cinco segundos

Estos tres llegan sin stack trace y sin línea de log, y los juniors los leen todos como "el endpoint está roto". Ni siquiera son el mismo *tipo* de problema, y el código de estado por sí solo te dice cuál es. Fíjate primero en *dónde* se deciden: ninguno de tu código se ejecuta en ninguno de los tres. `DispatcherServlet` rechaza la request antes de que tu método de controlador se llegue a invocar, y el propio `DefaultHandlerExceptionResolver` de Spring fija el estado y reenvía al body por defecto de `/error` — **tu `GlobalExceptionHandler` nunca los ve.** No asumas que es por checked-vs-unchecked: 405 (`HttpRequestMethodNotSupportedException`) y 404 (`NoResourceFoundException`) sí extienden `ServletException`, así que el catch-all `@ExceptionHandler(RuntimeException.class)` de todas formas nunca podría coincidir con ellas — pero 415 (`HttpMediaTypeNotSupportedException`) *sí* es una `RuntimeException`, y aun así se salta el catch-all. La razón es de precedencia, no de tipo: estas excepciones de MVC del framework se lanzan durante el mapping de la request, y `DefaultHandlerExceptionResolver` las reclama antes de que se consulte tu `@ControllerAdvice`. Las tres aterrizan en el `/error` por defecto:

| Estado | Qué te está diciendo Spring | La forma TimeTrack de provocarlo |
|---|---|---|
| **415** Unsupported Media Type | La ruta y el verbo son correctos; no puedo **leer el body que enviaste** | `POST /api/entries` con JSON válido pero la pestaña Body dejada en `Text` |
| **405** Method Not Allowed | La ruta existe — con un **verbo distinto** | `POST /api/users` (la ruta solo mapea `@GetMapping`) |
| **404** Not Found | Ningún mapping coincide con esa **ruta** en absoluto | `GET /api/entrys` (typo — ahí no hay nada mapeado) |

Cómo leerla: las tres filas son un embudo, y leerlas en orden es el diagnóstico. **404 = Spring nunca encontró tu endpoint. 405 = lo encontró pero llamaste con el verbo equivocado. 415 = encontró el método exacto y rechazó el formato del body.** Cada fila significa que llegaste un paso más adentro, así que la solución vive en un sitio distinto: 404 → revisa la cadena de la URL; 405 → revisa la anotación de mapping; 415 → revisa un *header*, no el código.

**415 — la clásica humillación en un live coding.** `POST /api/entries`, body correcto, sin `Content-Type: application/json`:

```json
{
  "timestamp": "2026-07-17T09:14:22.318+00:00",
  "status": 415,
  "error": "Unsupported Media Type",
  "message": "",
  "path": "/api/entries"
}
```

El mecanismo: `@RequestBody CreateTimeEntryRequest` es una petición de **conversión**, y Spring elige el converter por el header `Content-Type`, nunca mirando el body. Con `application/json` selecciona `MappingJackson2HttpMessageConverter` y Jackson parsea tu DTO. Con `text/plain` — o nada, donde la mayoría de los clientes por defecto usan `application/x-www-form-urlencoded` — busca entre sus converters, no encuentra ninguno que pueda convertir esos bytes en un `CreateTimeEntryRequest`, y lanza `HttpMediaTypeNotSupportedException` antes de que tu método exista. El body es JSON perfecto. Spring nunca lo miró.

> **415 vs 400 — el par que se confunde, porque los dos huelen a "body malo".** Se deciden en momentos distintos. **415 = ni siquiera intentaría leerlo** (`Content-Type` equivocado; Jackson nunca se ejecutó). **400 = lo leí y está mal** — o Jackson se atragantó con JSON malformado (`HttpMessageNotReadableException`, que tu `GlobalExceptionHandler` *sí* captura → `"Request body is missing or invalid"`), o parseó bien y `@Valid` rechazó un campo (`MethodArgumentNotValidException` → `"Validation failed"` más `fieldErrors`, ver [07-validacion.md](./07-validacion.md)). Así que el detalle delator es el propio body: un 400 que tú escribiste vuelve con tu propio mensaje; un 415 vuelve con el vacío de Spring. Lo cual nos lleva al campo con el que todo el mundo tropieza a continuación.

> **`"message": ""` no es un bug.** Desde Boot 3, el body por defecto de `/error` deja el mensaje de la excepción en blanco a menos que actives `server.error.include-message=always` — porque ese texto puede filtrar detalles internos a quien sea que esté llamando. Así que la respuesta por defecto te dice el estado y nada más, a propósito. En local lo activas; en producción lo dejas apagado y lees el log del servidor en su lugar ([12-depuracion-en-produccion.md](./12-depuracion-en-produccion.md) cubre ese interruptor y el bucle de lectura de logs).

**405 — la ruta existe, usaste el verbo equivocado.** `POST /api/users`, donde `UserController` solo mapea `@GetMapping`:

```json
{
  "timestamp": "2026-07-17T09:16:03.771+00:00",
  "status": 405,
  "error": "Method Not Allowed",
  "message": "",
  "path": "/api/users"
}
```

405 es *buenas noticias disfrazadas de error*: es la prueba de que tu controlador fue encontrado y registrado. Spring mapeó `/api/users` a `UserController`, vio que el único mapping que hay es GET, y se detuvo. El valor real está en lo que descarta — la URL es correcta, la app está corriendo, la seguridad te dejó pasar. Mira la anotación, no la dirección. En TimeTrack, la forma honesta de provocar esto son los endpoints de flujo de trabajo: `submit`, `approve` y `reject` son todos `@PatchMapping`, así que `POST /api/entries/1/submit` devuelve 405 mientras que `PATCH /api/entries/1/submit` funciona. Postman pone GET por defecto en las requests nuevas, y un `PATCH` dejado como `GET` es un 405 que te vas a provocar tú mismo.

**404 — no hay nada mapeado ahí.** `GET /api/entrys`:

```json
{
  "timestamp": "2026-07-17T09:17:41.209+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "",
  "path": "/api/entrys"
}
```

> **Dos 404 completamente distintos, y solo el body los distingue.** El de arriba es de *routing*: ningún `@RequestMapping` coincide con `/api/entrys`, así que Spring nunca llegó a tu código. Pero `GET /api/projects/9999` — una ruta que mapea perfectamente — también devuelve 404, desde `ProjectService` lanzando `ResourceNotFoundException`, capturada por tu `GlobalExceptionHandler`. Mismo estado, significado opuesto: "este endpoint no existe" frente a "este endpoint existe y esa fila no". Los distingues al instante porque el tuyo lleva **tu** mensaje y no tiene campo `path`:
>
> ```json
> { "timestamp": "...", "status": 404, "error": "Not Found", "message": "Project not found with id: 9999" }
> ```
>
> `path` presente y `message` vacío → el `/error` por defecto de Spring, tu código nunca se ejecutó. Un mensaje real y sin `path` → tu advice, tu código se ejecutó y decidió. Eso es lo primero que hay que mirar ante cualquier respuesta confusa de esta API.

### El 201 que miente — verifica la escritura, no la respuesta

`POST /api/entries` vuelve con `201 Created` y un body. Conclusión tentadora: se guardó. **El 201 demuestra que tu controlador devolvió algo, no que PostgreSQL guardó nada.** `ResponseEntity.status(201)` es un número que codificaste a mano en `TimeEntryController`; la fila la escribe Hibernate en el commit, que ocurre *después* de que tu método de service devuelva — así que un rollback disparado al salir es perfectamente compatible con el 201 que acabas de admirar. Es el mismo silencio con el que terminó 08, con una medalla verde puesta.

Así que confirma la fila, de dos formas:

- **En pgAdmin** — `SELECT * FROM time_entries ORDER BY id DESC LIMIT 5;` y mírala. Esta es la versión que detecta lo que una respuesta de API estructuralmente no puede mostrarte: `status` guardado como `0` en vez de `'DRAFT'` (un `@Enumerated` roto), `hours` truncado a `7` en vez de `7.5` (`precision`/`scale` mal), un `user_id` que es `NULL`. Tu DTO de respuesta felizmente renderizaría los tres como si estuviera todo bien.
- **Con un `GET` de seguimiento** — `GET /api/entries?userId=1` en la colección justo después del POST. Más débil (puede servirse desde la misma transacción o la misma sesión) pero instantáneo, y es lo que haces en vivo delante de un entrevistador.

> **Esta es exactamente la pregunta que hacen.** *"¿Cómo sabes que la entrada realmente se guardó?"* — "Recibí un 201" es la respuesta de un junior. "Compruebo la fila en pgAdmin, o la vuelvo a leer con un GET" es la respuesta de alguien a quien ya le pasó. Y es el mismo instinto que el `@SpringBootTest` de arriba, que afirma `repository.count()` en vez de fiarse del estado: **nunca dejes que lo que se está probando sea lo que informa sobre sí mismo.**

### curl — cuando no hay GUI

En el momento en que la app está en un servidor o dentro de un contenedor, no hay Postman. La misma request, en una línea:

```bash
# iniciar sesión y obtener el token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@timetrack.com","password":"<la contraseña que sembraste>"}'

# llamar a un endpoint protegido con él
curl -X GET "http://localhost:8080/api/entries?status=SUBMITTED" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# ver el código de estado y los headers de respuesta, no solo el body
curl -i -X POST http://localhost:8080/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{"projectId":1,"date":"2026-07-17","hours":7.5,"description":"Backend work"}'
```

Los flags son las mismas cuatro piezas de antes: `-X` el método, `-H` un header (repítelo por cada header), `-d` el body, y `-i` para imprimir la línea de estado y los headers de respuesta — sin `-i` curl solo muestra el body, y un 415 con un body vacío parece que no pasó nada.

> **`-d` sin `-H "Content-Type: application/json"` es otra vez la trampa del 415, y curl la fija por ti.** Dale a curl `-d` sin content type y por defecto usa `application/x-www-form-urlencoded` — la codificación de formulario que usa un navegador. Spring no encuentra ningún converter para tu DTO y responde 415, con el JSON ahí mismo en la request. Es el *mismo* error que el desplegable `raw → Text` de Postman, y ese es el punto: la herramienta nunca importó, el header siempre importó.

Docs: [Baeldung — Test a REST API with curl](https://www.baeldung.com/curl-rest) → read: "Testing POST" y las secciones de `-d`/`-H`

---

## A dónde te deja esto — y qué viene después

Lo invisible ahora es visible. Un `@Transactional` que nunca se dispara, un `@PreAuthorize` que no protege nada, una regla de validación que deja pasar `null` — cada uno tiene ahora algo que se pone en rojo cuando se rompe: JUnit y Mockito para la lógica, `@WebMvcTest` para el contrato, `@DataJpaTest` para las queries, `@SpringBootTest` para el cableado, y Postman para los bytes exactos que va a ver un humano. TimeTrack tiene un `contextLoads()` vacío y tres tests que todavía debe; "El mínimo para el proyecto 07" de arriba es esa deuda escrita en papel.

Lo que todo esto tiene en común es que se ejecuta **en tu máquina, contra tu PostgreSQL, con tu `DB_PASSWORD` en la configuración de ejecución de IntelliJ**. Que esté en verde aquí significa "funciona donde lo construí" — que es precisamente la afirmación que siempre ha hecho "en mi máquina funciona". [10-herramientas.md](./10-herramientas.md) es donde esa afirmación deja de ser suficiente: Docker empaqueta la app y su runtime de Java 25 para que la misma imagen se ejecute en el portátil de un revisor y en un servidor, y Flyway hace lo mismo para el esquema, sustituyendo `ddl-auto=update` por scripts SQL versionados que se pueden revisar en git. Testing demuestra que tu código es correcto; tooling es lo que hace que sea correcto en algún sitio que no sea aquí.
