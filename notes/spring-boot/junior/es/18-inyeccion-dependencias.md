# Inyección de dependencias y beans de Spring

> 📖 [Baeldung — Intro to Inversion of Control and DI with Spring](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring)
> 📖 [Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)

---

[02-controladores-rest.md](./02-controladores-rest.md) te dejó con una pregunta que dejó sin responder a propósito. Todos los controllers de ese archivo empiezan con una línea como `private final ProjectService projectService`, rellenada por un constructor que escribiste pero que **nunca llamaste**. Escribiste `new` exactamente una vez en todo el backend — sobre una entidad `Project` dentro de un service — y aun así `ProjectController`, `ProjectService` y `ProjectRepository` existen en tiempo de ejecución, cada uno con la instancia correcta de la capa de abajo. ¿Quién llamó entonces al constructor?

La respuesta es el **contenedor IoC**, y este archivo es donde deja de ser magia: qué es realmente un bean, dónde lo guarda Spring, cómo `@Service`/`@Repository`/`@RestController` registran uno, cómo Spring elige un constructor y empareja cada parámetro con un bean, y por qué la separación en tres capas del archivo 02 solo *se mantiene* desacoplada porque algo fuera de esas tres capas hace el ensamblaje.

---

## Por qué existe la inyección de dependencias

Propósito: el problema que resuelve DI — una clase que construye sus propios colaboradores nunca puede testearse ni sustituirse, que es exactamente lo que el patrón `@Service` + constructor existe para evitar.

Archivo: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — los campos `private final` de los repositorios son la forma final del ejemplo ✅ de abajo (el `TransactionService` aquí es un sustituto genérico deliberado, no una clase de TimeTrack)

Docs: https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring → leer: las secciones iniciales que contrastan una clase que crea su propia dependencia con una que la recibe

Empieza por el dolor. Sin DI, una clase crea lo que necesita, con `new`, dentro de sí misma:

```java
// ❌ MAL — TransactionService crea su propio repositorio
public class TransactionService {
    private TransactionRepository repository = new TransactionRepository();
}
```

Nada de esto falla al compilar, y el código funciona. El daño aparece en el momento en que quieres hacer cualquier cosa *que no sea* ejecutarlo en producción:

- **No puedes testearlo.** Un test unitario quiere pasarle al service un repositorio falso que devuelva tres filas predefinidas sin tocar PostgreSQL. No hay forma de entrar: el `new` está fijado dentro del cuerpo de la clase, así que el test recibe el repositorio real, que necesita una conexión real a la base de datos. El test se ha convertido en un test de integración, lo quisieras o no.
- **No puedes sustituirlo.** `TransactionService` ahora está soldado a esa única clase concreta. Cambiar a otra implementación (un repositorio con caché, uno en memoria) implica editar el service — una clase que no tiene nada que ver con la persistencia.

Con DI, el service **declara lo que necesita y lo recibe desde fuera**:

```java
// ✅ BIEN — Spring inyecta el repositorio; un test puede inyectar un mock en su lugar
@Service
public class TransactionService {
    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

La clase pasó de *"yo construyo mi dependencia"* a *"dame mi dependencia"*. Ese giro es la **Inversión de Control (IoC)**: el control sobre *quién crea qué* se ha invertido — se ha sacado de tu clase y se le ha dado al framework. La inyección de dependencias es la técnica concreta que implementa IoC (Spring entrega el objeto a través del constructor); IoC es el principio al que sirve. Los entrevistadores usan ambos términos casi como sinónimos, pero esa es la distinción si te piden separarlos.

> **El restaurante, otra vez.** El archivo 02 llamaba "la cocina" al service. Una cocina que se construye su propio horno cada mañana, desde cero, soldado al suelo, es la versión con `new`. Una cocina que llega con un enchufe en la pared y usa *cualquier horno que esté enchufado* es la versión con DI — y el día del test enchufas un horno falso que solo dice "el plato está listo" sin cocinar nada. Spring es el electricista que cablea los enchufes antes de que empiece el servicio.

> **¿Por qué el campo es `final`?** Porque, una vez que el constructor termina, esa referencia no debe cambiar nunca más. `final` es el `const` de Java — el compilador rechaza cualquier reasignación posterior. No es decoración: es lo que hace que el objeto sea *inmutable en su cableado*, y solo es posible porque el valor llega en el constructor (un campo que anotas con `@Autowired` no puede ser `final` — ver el contraste más abajo).

Este es el patrón que se repite bajo todo Spring Boot: **tú declaras, Spring provee.** Una vez que lo has visto en el service, lo reconocerás en todas partes — `JwtFilter` recibiendo un `JwtUtil`, `SecurityConfig` recibiendo un `JwtFilter`, un `@RestController` recibiendo un service. El mismo movimiento, en distinta capa.

---

## Beans de Spring — lo que Spring gestiona

Propósito: el vocabulario para todo lo que sigue — un bean es la unidad que Spring crea, almacena e inyecta, y su tiempo de vida por defecto (una instancia para toda la aplicación) es lo que hace que la regla de ausencia de estado no sea negociable.

Archivo: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — cada variable dentro de `create()` es una local, y eso no es una elección de estilo (más abajo)

Docs: https://www.baeldung.com/spring-bean → leer: "What Is a Bean?" y la sección sobre cómo se registra un bean

Un **bean** es cualquier objeto que Spring crea y gestiona por ti. Nada más exótico que eso: `ProjectService` se convierte en un bean en el momento en que le escribes `@Service` encima. Spring guarda todos los beans en un contenedor llamado **ApplicationContext** — piénsalo como un `Map<String, Object>` que vive mientras vive la aplicación: la clave es el nombre del bean, el valor es la instancia única. Cuando otra clase pide un `ProjectService`, Spring busca en ese mapa y entrega lo que encuentra.

```
ApplicationContext  (creado una vez, al arrancar, y nunca se vacía)
┌──────────────────────────────────────────────────────┐
│ "userRepository"     → UserRepository$Proxy@1a2b     │
│ "userService"        → UserService@3c4d              │
│ "projectService"     → ProjectService@5e6f           │
│ "timeEntryService"   → TimeEntryService@7a8b         │
│ "passwordEncoder"    → BCryptPasswordEncoder@9c0d    │
└──────────────────────────────────────────────────────┘
```

**Por defecto, todo bean es un singleton** — Spring crea *una* instancia y le da ese mismo objeto a cada clase que lo pida. `ProjectController`, y cualquier otra clase que necesite un `ProjectService`, sostienen todas una referencia al mismísimo `ProjectService@5e6f` de arriba.

Esa sola frase es la razón de una regla que oirás repetir en todas partes: **un service debe ser stateless (sin estado) — sin campos de instancia mutables.** La regla normalmente se enuncia y se deja ahí, que es justo por lo que nadie la recuerda. Traza el mecanismo y se vuelve obvia:

Tomcat no atiende las peticiones una detrás de otra. Mantiene un **pool de threads**, y cada petición HTTP entrante la recoge el hilo que esté libre. Dos usuarios llamando a `POST /api/entries` en el mismo instante son dos *threads distintos* corriendo *concurrentemente* — y ambos ejecutan `timeEntryService.create(...)` sobre **la misma instancia singleton**, porque solo hay una en el mapa.

```
Thread http-nio-8080-exec-1   ─┐
  (petición de Ana)            ├──▶  el ÚNICO TimeEntryService@7a8b  ──▶ PostgreSQL
Thread http-nio-8080-exec-2   ─┘
  (petición de Luis, 3ms después)
```

Ahora pon un campo mutable en ese service y observa cómo se rompe:

```java
// ❌ MAL — un campo mutable en un singleton es compartido por todas las peticiones concurrentes
@Service
public class TimeEntryService {
    private User currentUser;          // ← UN campo, compartido por TODOS los threads

    public TimeEntryResponse create(CreateTimeEntryRequest request) {
        this.currentUser = loadUserFromToken();   // Ana escribe aquí...
        // ...el thread de Luis ejecuta la misma línea 1ms después y LO SOBREESCRIBE...
        TimeEntry entry = new TimeEntry();
        entry.setUser(this.currentUser);          // la entrada de Ana se guarda ahora bajo LUIS
        ...
    }
}
```

El thread de Ana escribió su usuario en el campo, fue interrumpido por el planificador, y para cuando se reanudó, el thread de Luis ya había sobreescrito el *mismo hueco de memoria*. La entrada de tiempo de Ana se persiste contra la cuenta de Luis. El bug es invisible en un test de un solo usuario y solo aparece bajo carga real — el peor tipo.

```java
// ✅ BIEN — el usuario vive en una variable LOCAL: una copia por llamada al método, por thread
@Service
public class TimeEntryService {
    private final TimeEntryRepository timeEntryRepository;   // final, fijado una vez al arrancar — seguro
    // ... constructor ...

    public TimeEntryResponse create(CreateTimeEntryRequest request) {
        String email = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)         // local — nadie más puede verla
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        ...
    }
}
```

Este es el `TimeEntryService.create()` real de TimeTrack, y por eso cada variable dentro de él es **local**. El mecanismo es la disposición de la memoria, y ya lo tienes: **cada thread recibe su propia pila de llamadas** (la misma pila LIFO de frames de método de [java/08-excepciones.md](../../../java/junior/es/08-excepciones.md), detallada en [java/15-modelo-de-memoria.md](../../../java/junior/es/15-modelo-de-memoria.md) — las locales viven en el frame, los objetos viven en el heap compartido). `email`, `user`, `project` y `timeEntry` son locales: existen en el frame de *esta* invocación, en la pila de *este* thread, y desaparecen cuando el método retorna. El thread de Ana y el de Luis están ejecutando el mismo método sobre el mismo objeto, pero cada uno tiene su propio frame con su propio hueco de `user` — ninguno puede alcanzar el del otro. Un campo de instancia es lo contrario: hay un único hueco, en el heap, dentro del único objeto compartido, y cualquier thread puede leerlo y escribirlo.

> **Así que el objeto se comparte, pero la llamada al método no.** Eso suena contradictorio hasta que separas las dos cosas. El singleton es *un objeto en el heap* — una dirección, un único conjunto de campos. Llamar a un método sobre él no copia el objeto; apila un frame nuevo en la pila **del que llama**, y ese frame es donde viven los parámetros y las locales. Diez threads llamando a `create()` sobre el mismo singleton significan un objeto y diez frames independientes. Por eso las locales son thread-safe y los campos no lo son — y por eso "singleton sin estado" no es una contradicción en los términos.

> **Entonces, ¿por qué se permiten los campos `private final` de los repositorios?** Porque se escriben **una vez**, por Spring, al arrancar — antes de que exista ningún thread de petición — y después nunca se modifican. "Stateless" no significa "sin campos": significa **sin campos que cambien mientras la app está sirviendo peticiones**. Una dependencia `final` es configuración fija; un `currentUser` es un dato por petición que no tiene nada que hacer viviendo en un objeto compartido.

> **¿Se puede cambiar el scope?** Sí — `@Scope("prototype")` hace que Spring cree una instancia nueva en cada inyección, y `@Scope("request")` una por petición HTTP. En la práctica casi nunca lo haces, y no deberías recurrir a ello para tapar un bug de estado: la solución es mover el estado a una variable local, no multiplicar los beans. Docs: https://www.baeldung.com/spring-bean-scopes.

---

## Anotaciones de beans — cuál usar

Propósito: las cuatro anotaciones que registran una clase como bean durante el escaneo de componentes, y la única que en realidad se comporta de forma distinta.

Archivo: `src/main/java/com/victor/timetrack/service/ProjectService.java` (`@Service`), `.../repository/ProjectRepository.java` (implícito), `.../controller/ProjectController.java` (`@RestController`), `.../security/JwtUtil.java` (`@Component`)

Docs: https://www.baeldung.com/spring-component-repository-service → leer: las secciones sobre `@Component`, `@Service` y `@Repository`

Las cuatro registran la clase como un bean de Spring. `@ComponentScan` (de [01-basicos.md](./01-basicos.md)) recorre los paquetes bajo `com.victor.timetrack`, encuentra cualquier clase que lleve una de ellas, y coloca una instancia en el ApplicationContext:

```java
@Component        // bean genérico — úsala cuando no encaja ninguna anotación más específica (JwtUtil, JwtFilter)
@Service          // capa de lógica de negocio (igual que @Component, mejor intención)
@Repository       // capa de acceso a datos (igual que @Component + traducción de excepciones)
@RestController   // capa web — gestiona peticiones HTTP y devuelve JSON
```

Lee esa lista como *una anotación por cada capa del archivo 02*, no como cuatro mecanismos distintos. `@Service`, `@Repository` y `@RestController` están todas **meta-anotadas con `@Component`** — por dentro *son* `@Component`, con una etiqueta pegada encima. Así que la diferencia es sobre todo semántica: le dice al siguiente desarrollador (y a ti mismo, dentro de seis meses) a qué capa pertenece una clase, de un vistazo, sin leer su cuerpo.

`@Repository` es la única excepción con comportamiento real: además **traduce las excepciones de persistencia**. Hibernate lanza sus propios tipos de excepción (`ConstraintViolationException`, `LazyInitializationException`); `@Repository` las captura y las relanza como la jerarquía `DataAccessException` de Spring. El beneficio es que tu capa de *service* nunca tiene que importar una clase de Hibernate para capturar un error — solo ve los tipos consistentes de Spring, así que cambiar Hibernate por otro proveedor JPA no se propagaría hacia arriba.

> **¿Dónde está `@Repository` en TimeTrack, entonces?** En ningún sitio — y eso es correcto. `UserRepository`, `ProjectRepository` y `TimeEntryRepository` son *interfaces* que extienden `JpaRepository`, y Spring Data las detecta y las registra por sí solo, aplicando la traducción de excepciones sin necesidad de la anotación. Escribes `@Repository` a mano solo en una clase de repositorio que hayas implementado tú mismo. El mecanismo completo está en [03-spring-data-jpa.md](./03-spring-data-jpa.md).

---

## Inyección por constructor — la forma correcta

Propósito: la única forma de inyección que deberías escribir en código nuevo, y los fallos concretos de las otras dos.

Archivo: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — el constructor de 3 argumentos es el patrón en su forma más típica

Docs: https://www.baeldung.com/constructor-injection-in-spring → leer: la comparación entre inyección por constructor, por setter y por campo

Hay tres formas de meter una dependencia en un bean. Solo una pertenece al código que escribes hoy:

```java
// ❌ MAL — 1. Inyección de campo. Compila, funciona, y esconde todo lo que importa.
@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;   // Spring lo asigna por reflexión, después de la construcción
}

// ❌ MAL — 2. Inyección por setter. Rara, sobre todo código legacy de la era XML.
@Service
public class TransactionService {
    private TransactionRepository repository;

    @Autowired
    public void setRepository(TransactionRepository repository) {
        this.repository = repository;
    }
}

// ✅ BIEN — 3. Inyección por constructor. La dependencia es un parámetro; el campo puede ser final.
@Service
public class TransactionService {
    private final TransactionRepository repository;

    // @Autowired es opcional desde Spring 4.3 — con un único constructor, Spring lo usa
    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

**Por qué gana la inyección por constructor — los cuatro argumentos, en el orden en que un entrevistador los quiere:**

1. **`final` funciona.** Un campo que Spring asigna por reflexión *no puede* ser `final`, porque el objeto ya está construido para cuando Spring escribe en él — así que la inyección de campo renuncia a la inmutabilidad. La inyección por constructor la obtiene gratis.
2. **Las dependencias son visibles.** La firma del constructor es la lista de la compra honesta de la clase. El constructor de `TimeEntryService` recibe **tres** repositorios, y puedes verlos los tres sin hacer scroll:

   ```java
   public TimeEntryService(
           TimeEntryRepository timeEntryRepository,
           ProjectRepository projectRepository,
           UserRepository userRepository) {
       this.timeEntryRepository = timeEntryRepository;
       this.projectRepository = projectRepository;
       this.userRepository = userRepository;
   }
   ```

   Con inyección de campo, esos tres campos `@Autowired` pueden estar esparcidos en cualquier parte de la clase, y nada impide que se conviertan en ocho. Un constructor con ocho parámetros *parece* estar mal — y esa fealdad es una característica: es la clase diciéndote que hace demasiado.
3. **Se testea sin Spring en absoluto.** `new TimeEntryService(mockEntries, mockProjects, mockUsers)` — Java puro, sin contexto que arrancar, milisegundos. Con inyección de campo no hay forma de fijar un campo `private` desde un test salvo por reflexión o por un contexto de test de Spring, que es exactamente por lo que la inyección de campo hace que los tests sean lentos y torpes ([09-testing.md](./09-testing.md)).
4. **Las dependencias circulares son imposibles de pasar por alto.** Si `AService` necesita `BService` y `BService` necesita `AService`, ninguno de los dos constructores puede ejecutarse primero — Spring no puede construir ninguno de los dos, porque construir cualquiera de ellos requiere que el otro ya exista. Lo avisa antes de que la app arranque:

   ```
   ***************************
   APPLICATION FAILED TO START
   ***************************

   Description:

   The dependencies of some of the beans in the application context form a cycle:

   ┌─────┐
   |  aService defined in file [...AService.class]
   ↑     ↓
   |  bService defined in file [...BService.class]
   └─────┘

   Action:

   Relying upon circular references is discouraged and they are prohibited by default.
   Update your application to remove the dependency cycle between beans.
   ```

   El ciclo no es un bug de Spring que se rodea — es un síntoma de diseño en *tus* clases: dos services que se necesitan mutuamente en realidad son una única responsabilidad partida por la mitad, o una tercera clase esperando a ser extraída.

   > **Cuidado con la versión antigua de este argumento.** Leerás por todas partes que "la inyección de campo deja pasar un ciclo, la inyección por constructor lo detecta". Eso *era* cierto: con campos `@Autowired` Spring podía construir ambos objetos vacíos y rellenarlos después, así que el ciclo sobrevivía hasta el runtime. **Desde Spring Boot 2.6 las referencias circulares están prohibidas por defecto** — el banner de arriba es lo que obtienes con inyección de campo también, a menos que alguien configure `spring.main.allow-circular-references=true`. Lo que sigue siendo cierto es el *mecanismo*: un ciclo por constructor es irrompible por construcción, mientras que un ciclo por campo solo falla porque el framework decidió rechazarlo. Da la versión más afinada en una entrevista y estarás por delante de la respuesta copiada y pegada. Docs: https://www.baeldung.com/circular-dependencies-in-spring.

> **¿Cuándo se volvió opcional `@Autowired`?** En Spring 4.3. Si una clase tiene exactamente **un** constructor, Spring lo usa — sin necesidad de anotación. Por eso ninguno de los constructores de TimeTrack lleva `@Autowired`. Vuelve a ser obligatoria en el momento en que una clase tiene *dos* constructores, porque entonces Spring no tiene forma de adivinar a cuál llamar, y tienes que anotar el que debería usar.

---

## @Bean — beans de clases de librería

Propósito: registrar un objeto como bean cuando no puedes anotar su clase — porque no la escribiste tú.

Archivo: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: https://www.baeldung.com/spring-bean → leer: la sección sobre configuración basada en Java con métodos `@Bean`

`@Component`, `@Service` y `@Repository` requieren todas lo mismo: que puedas abrir la clase y escribirle una anotación encima. Eso funciona para *tus* clases. No funciona para `BCryptPasswordEncoder` — esa clase vive dentro del jar de Spring Security, de solo lectura, y por mucho que quieras no vas a poder ponerle `@Component`.

La vía de escape es `@Bean`: escribes un **método** que devuelve el objeto, dentro de una clase `@Configuration`, y Spring llama a ese método al arrancar y guarda lo que devuelva en el ApplicationContext. No estás anotando la clase — le estás dando a Spring una receta para construir la instancia. El `SecurityConfig` de TimeTrack (en el paquete `security`, no en `config`) declara **cuatro** métodos `@Bean` — `securityFilterChain()`, `passwordEncoder()`, `authenticationManager()` y `corsConfigurationSource()`. Dos de ellos bastan para mostrar ambas formas; los otros dos pertenecen a [06-seguridad-jwt.md](./06-seguridad-jwt.md):

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();   // clase de librería — no le puedes añadir @Component
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

- **El nombre del método se convierte en el nombre del bean** — `passwordEncoder()` registra un bean llamado `"passwordEncoder"`. Esto importa en la sección de `@Qualifier` de abajo.
- **El tipo de retorno se convierte en el tipo del bean** — declarar `PasswordEncoder` (la interfaz) en lugar de `BCryptPasswordEncoder` (la clase) es deliberado: todo lo que la inyecte depende de la interfaz, así que cambiar el algoritmo de hashing más adelante implica editar este único método y nada más.
- **Un método `@Bean` puede él mismo recibir parámetros, y también se inyectan.** `authenticationManager(AuthenticationConfiguration config)` no construye el objeto en absoluto — le pide a Spring un bean que Spring Boot ya auto-configuró, y saca el manager de dentro. Spring ve el parámetro, encuentra un bean `AuthenticationConfiguration`, y lo pasa. La misma regla que un constructor, un nivel más abajo.

Después de que esto se ejecute, cualquier clase que tenga `PasswordEncoder` como parámetro de constructor recibe esa instancia de `BCryptPasswordEncoder` sin saber de dónde vino.

> **¿Quién lo inyecta realmente en TimeTrack? Nada que hayas escrito tú.** Busca en el proyecto y `PasswordEncoder` aparece en exactamente un archivo — `SecurityConfig`, donde se declara. El consumidor es la propia Spring Security: su proveedor de autenticación auto-configurado busca en el contexto un bean `PasswordEncoder` y lo usa para comparar la contraseña en texto plano de `/api/auth/login` contra el hash BCrypt guardado en `users.password`. Eso es `@Bean` en su forma más pura — no estás construyendo un objeto para *tu* código, estás dejando uno caer en el contenedor para que **código del framework que tú nunca llamas** lo recoja por tipo. Quita el método y el framework recae en su propio valor por defecto, que no es lo que quieres. El flujo completo está en [06-seguridad-jwt.md](./06-seguridad-jwt.md).

> **`@Component` vs `@Bean` — la regla en una línea.** `@Component` va sobre **una clase que posees**, y Spring la instancia por ti. `@Bean` va sobre **un método que escribes tú**, y *tú* instancias el objeto (o lo obtienes) — porque es una clase que no posees, o porque construirlo requiere lógica (argumentos, condiciones) que una anotación no puede expresar. Cada `@Bean` en el `SecurityConfig` de TimeTrack es uno de esos dos casos.

---

## Cómo Spring lo conecta todo al arrancar

Propósito: la secuencia real de arranque — qué pasa entre que se ejecuta `main()` y se sirve la primera petición HTTP.

Archivo: `src/main/java/com/victor/timetrack/TimetrackApplication.java` → `SpringApplication.run(...)` es la línea que dispara todo esto

Docs: https://www.baeldung.com/spring-application-context → leer: las secciones sobre qué hace el contenedor al arrancar y cómo las definiciones de bean se convierten en instancias

`SpringApplication.run()` hace dos cosas distintas, en orden: primero **encuentra** cada *definición* de bean (escaneando `@Component` y compañía, leyendo cada método `@Bean`) — en este punto no se instancia nada, Spring solo está construyendo una lista de "cosas que sé crear, y qué necesita cada una". Solo entonces las **crea**.

Así es el arranque real de TimeTrack, con las clases reales:

```
1. SCAN — construir las definiciones (nada existe todavía)
   com.victor.timetrack.*  →  JwtUtil, JwtFilter, JwtAuthenticationEntryPoint,
                              UserService, ProjectService, TimeEntryService, ReportService,
                              AuthService, UserDetailsServiceImpl,
                              UserController, ProjectController, TimeEntryController,
                              AuthController, ReportController,
                              SecurityConfig (+ sus 4 métodos @Bean)
        ↓
2. RESOLVE — para cada definición, leer el constructor y listar qué necesita
   TimeEntryService  necesita → TimeEntryRepository, ProjectRepository, UserRepository
   SecurityConfig    necesita → JwtFilter, JwtAuthenticationEntryPoint
   JwtFilter         necesita → JwtUtil, UserDetailsServiceImpl
   AuthService       necesita → AuthenticationManager (un @Bean, no un @Component), JwtUtil
   JwtUtil           necesita → nada (campos @Value, sin argumentos de constructor)
        ↓
3. INSTANTIATE en orden de dependencia — primero las hojas, luego lo que depende de ellas
   JwtUtil                → sin dependencias, se construye ya
   TimeEntryRepository    → Spring Data genera la implementación
   JwtFilter              → sus dependencias ya existen, se construye
   TimeEntryService       → sus 3 repositorios ya existen, se construye
   SecurityConfig         → su filter ya existe, se construye, y luego llama a sus métodos @Bean
   TimeEntryController    → su service ya existe, se construye
        ↓
4. Aplicación lista — todos los beans creados, todas las referencias conectadas
```

**Lo crítico que este diagrama te está mostrando: Spring no lee tu proyecto de arriba a abajo, ni alfabéticamente, ni en el orden en que creaste los archivos.** Construye un **grafo de dependencias** — un mapa de aristas "X necesita Y" a través de cada definición de bean — y luego instancia en el único orden que ese grafo permite: un bean se crea solo una vez que *todas* sus dependencias ya existen. Nada en tu código fuente dice "crea `JwtUtil` antes que `JwtFilter`"; Spring lo deriva del hecho de que el constructor de `JwtFilter` pide un `JwtUtil`. Es un ordenamiento topológico, no un script.

> **Por esto el orden de los archivos y de los paquetes es irrelevante.** Puedes crear `TimeEntryController` antes de que exista `TimeEntryService`, ponerlos en cualquier paquete, llamarlos como sea — siempre que el grafo no tenga ciclos, Spring encuentra un orden válido. Y cuando el grafo *sí* tiene un ciclo, no puede: no hay un "hojas primero" desde donde arrancar, que es exactamente el crash de dependencia circular de la sección anterior.

**Cuando el grafo tiene un agujero — el error que verás de verdad.** Olvida `@Service` en `TimeEntryService`, y ninguna definición suya entra nunca en el paso 1. Spring llega al paso 2 para `TimeEntryController`, ve que necesita un `TimeEntryService`, mira en el contexto, y no encuentra nada:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.victor.timetrack.controller.TimeEntryController required
a bean of type 'com.victor.timetrack.service.TimeEntryService' that could not be found.

Action:

Consider defining a bean of type 'com.victor.timetrack.service.TimeEntryService' in your configuration.
```

Debajo de ese reporte amigable hay una `NoSuchBeanDefinitionException`. Lee el mensaje literalmente y te dice exactamente dónde mirar: **"Parameter 0 of constructor in X"** es la clase que está *preguntando* (el controller — que está bien), y **"a bean of type Y"** es la clase que *falta* (el service — ahí está tu bug). El instinto es ir a mirar fijamente la clase nombrada primero; el arreglo casi siempre está en la clase nombrada segundo. Nueve de cada diez veces la causa es una anotación de estereotipo que falta, y la décima es una clase que quedó fuera del paquete raíz de `@ComponentScan`. Docs: https://www.baeldung.com/spring-nosuchbeandefinitionexception.

> **¿Por qué es un crash de *arranque* y no un `NullPointerException` en la primera petición?** Porque el grafo se resuelve *antes* de que Tomcat empiece a aceptar conexiones. Spring se niega a levantarse a medias. Es la misma jugada que ya viste con `@Value` y con las dependencias circulares, y es toda la filosofía del contenedor: **fallar al arrancar, no delante de un usuario.** Un backend que no arranca es un arreglo de cinco minutos; un backend que arranca y lanza NPE a las 3 de la madrugada no lo es.

---

## @Qualifier y @Primary — múltiples implementaciones

Propósito: desempatar cuando dos beans satisfacen el mismo parámetro de constructor — Spring empareja por *tipo*, así que dos implementaciones de una interfaz son ambiguas.

Docs: https://www.baeldung.com/spring-qualifier-annotation → leer: las secciones sobre `@Qualifier` y su interacción con `@Primary`

> **El ejemplo de abajo es genérico, no de TimeTrack.** No hay ningún `NotificationService` ni `AlertService` en el repositorio — el proyecto no tiene ninguna interfaz con dos implementaciones, así que no necesita ninguna de las dos anotaciones (el párrafo de cierre explica por qué eso es normal a este tamaño). Las clases de aquí son lo más pequeño que reproduce la ambigüedad; el paquete en el mensaje de error es `com.example.demo` justo por eso. No vayas a buscarlas en el backend.

Todo lo de arriba funcionaba porque el **tipo** de un parámetro de constructor identificaba exactamente un bean. Rompe esa suposición y Spring se detiene:

```java
public interface NotificationService { void send(String message); }

@Service
public class EmailNotificationService implements NotificationService { ... }

@Service
public class SmsNotificationService implements NotificationService { ... }

// ❌ MAL — ¿cuál? Spring no puede elegir, y se niega a adivinar.
@Service
public class AlertService {
    public AlertService(NotificationService ns) { ... }
}
```

La app no arranca. `NoUniqueBeanDefinitionException`:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.example.demo.service.AlertService required a single bean,
but 2 were found:
	- emailNotificationService: defined in file [.../EmailNotificationService.class]
	- smsNotificationService: defined in file [.../SmsNotificationService.class]

Action:

Consider marking one of the beans as @Primary, updating the consumer to accept multiple beans,
or using @Qualifier to identify the bean that should be consumed
```

Spring te está haciendo un favor al negarse: la alternativa sería elegir uno al azar, y un backend que envía SMS en silencio en lugar de un email es mucho peor que uno que no arranca. Fíjate en que la línea `Action:` te da las dos soluciones en bandeja — y ambas están abajo.

Dos anotaciones lo resuelven, y responden preguntas distintas:

```java
@Service
@Primary   // ✅ "cuando alguien simplemente pide un NotificationService, dale ESTE"
public class EmailNotificationService implements NotificationService { ... }

@Service
public class SmsNotificationService implements NotificationService { ... }

@Service
public class AlertService {
    // ✅ "...a menos que nombren un bean explícitamente, como aquí"
    public AlertService(@Qualifier("smsNotificationService") NotificationService ns) { ... }
}
```

- **`@Primary` fija el valor por defecto** — vive en el *bean*, y aplica a cada punto de inyección que no diga lo contrario. Un ganador para toda la app.
- **`@Qualifier` lo sobreescribe por punto de inyección** — vive en el *parámetro*, y nombra el bean concreto que quiere.

**¿De dónde sale el string `"smsNotificationService"`?** No está inventado, y no es el nombre de la clase — mira de cerca la `S` mayúscula. Cuando Spring registra un bean a partir de una anotación de estereotipo y no le das un nombre explícito, deriva uno a partir de **el nombre simple de la clase con la primera letra en minúscula**: `SmsNotificationService` → `"smsNotificationService"`, `ProjectService` → `"projectService"`, `JwtUtil` → `"jwtUtil"`. Es la misma convención que produjo cada clave del mapa del ApplicationContext dibujado antes en este archivo, y los mismos nombres que Spring imprime en el `NoUniqueBeanDefinitionException` de arriba — lo que convierte ese mensaje de error en una tabla de consulta gratis: lista los strings exactos que puedes pegar en un `@Qualifier`.

> **Dos formas de fijar el nombre de un bean explícitamente, si no quieres el derivado:** pásaselo al estereotipo — `@Service("sms")` — y luego cualifica con `@Qualifier("sms")`. Para un método `@Bean`, el **nombre del método** es el nombre del bean (por eso `passwordEncoder()` en `SecurityConfig` produce un bean llamado `"passwordEncoder"`), y lo sobreescribes con `@Bean(name = "...")`. Docs: https://www.baeldung.com/spring-bean-names.

> **Cuidado con la regla de la primera letra — hay un caso límite.** Spring usa `java.beans.Introspector.decapitalize()`, que deja el nombre **sin cambiar** cuando las dos primeras letras están en mayúscula: una clase llamada `JWTService` se registra como `"JWTService"`, no como `"jWTService"`. Casi nunca te toparás con esto, pero es exactamente el tipo de cosa que produce un fallo desconcertante de `@Qualifier`. (También es una buena razón para llamar a la clase `JwtService`, como hace TimeTrack con `JwtUtil`.)

En la práctica rara vez necesitas ninguna de las dos anotaciones en un proyecto de este tamaño — TimeTrack no tiene ninguna interfaz con dos implementaciones, así que no usa ninguna. Importan en bases de código más grandes (un `PaymentGateway` con una implementación de Stripe y otra de PayPal, un mailer real frente a uno de prueba por entorno) y son una pregunta de entrevista estándar precisamente porque es donde "Spring inyecta por tipo" se queda visiblemente sin camino.

---

## @Value — leyendo configuración en beans

Propósito: extraer un único valor de `application.properties` hacia un campo de un bean, para que los secretos y los ajustes específicos de cada entorno nunca vivan en el código fuente.

Archivo: `src/main/java/com/victor/timetrack/security/JwtUtil.java`

Docs: https://www.baeldung.com/spring-value-annotation → leer: las secciones sobre inyectar propiedades y sobre valores por defecto

Los beans no solo dependen de otros beans — dependen también de **configuración**. El `JwtUtil` de TimeTrack necesita el secreto de firma y la duración del token, y ninguno de los dos puede estar hardcodeado (escrito fijo en el código): el secreto no debe estar en git, y la duración difiere entre tu portátil y producción. `@Value` los inyecta desde `application.properties`:

```java
@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    ...
}
```

- **`${...}` es un placeholder de propiedad, no una expresión Java.** Al arrancar, Spring resuelve el texto entre las llaves contra cada fuente de propiedades que conoce (`application.properties`, variables de entorno, argumentos de línea de comandos) y escribe el resultado en el campo.
- **La conversión de tipo es gratis.** El archivo de propiedades solo guarda texto — `app.jwt.expiration=86400000` es el string `"86400000"`. El campo se declara `long`, así que Spring lo convierte antes de asignarlo. Declara el campo mal y obtienes un fallo de arranque, no un cero silencioso.
- **Una clave que falta es un crash de arranque, no un `null`.** Sin `app.jwt.secret` en ninguna fuente de propiedades, el contexto falla al construirse: `Could not resolve placeholder 'app.jwt.secret' in value "${app.jwt.secret}"`. Misma filosofía que el bean que falta más arriba — la app se niega a funcionar a medio configurar en lugar de lanzar un `NullPointerException` en el primer intento de login.

> **¿Cómo llega esto a un secreto real en producción?** `application.properties` tiene `app.jwt.secret=${JWT_SECRET}` — un placeholder que apunta a una **variable de entorno**, no al valor en sí. Spring resuelve las variables de entorno como una fuente de propiedades, así que el archivo que commiteas contiene solo el *nombre* del secreto, y los bytes reales viven en el entorno de despliegue (Docker, el runner de CI, el servidor). El archivo es seguro de subir; el secreto nunca estuvo en él.

> **¿Por qué `@Value` va en un campo aquí, cuando la inyección de campo se acaba de condenar?** Porque `@Value` no está inyectando un *bean* — está inyectando un *literal*. Ninguno de los cuatro argumentos a favor de la inyección por constructor aplica: un `String` de secreto no es algo que mockees, no crea ningún grafo de dependencias, y no hay ningún ciclo que detectar. Sigue siendo cierto que un parámetro `@Value` inyectado por constructor (o, mejor, la clase `@ConfigurationProperties` de abajo) es más testeable, que es exactamente por lo que existe la siguiente sección.

---

## @ConfigurationProperties — vincular configuración agrupada a una clase

Propósito: vincular un *grupo* entero de propiedades relacionadas a una única clase con tipo, en un solo paso, en lugar de esparcir un `@Value` por cada campo a través de los beans que lo necesitan.

Docs: https://www.baeldung.com/configuration-properties-in-spring-boot → leer: "Simple Properties" y "Nested Properties"

> **Esta sección es un refactor propuesto, no código que exista en TimeTrack.** El proyecto usa actualmente dos campos `@Value` en `JwtUtil` (la sección de arriba) — que es exactamente el punto en el que este patrón empieza a merecer la pena, y la razón por la que vale la pena conocerlo antes de que llegue la tercera propiedad. Todo lo de abajo es la forma que tomaría el refactor; no vayas a buscar `JwtProperties.java` en el repositorio.

`@Value` escala mal. Añade un issuer, una duración de refresh-token, una tolerancia de desfase de reloj, y el mismo prefijo `app.jwt.` queda ahora repetido a través de cinco anotaciones en tres clases distintas — y nada las conecta entre sí ni te dice que el conjunto existe. `@ConfigurationProperties` vincula todo el prefijo a una clase, de una vez:

```properties
# application.properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
app.jwt.issuer=timetrack-api
```

```java
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    private String issuer;
    // Lombok @Data genera los getters/setters — Spring necesita los SETTERS para el binding
}
```

```java
// Se habilita una vez — en la clase @Configuration o en la clase principal de la aplicación:
@EnableConfigurationProperties(JwtProperties.class)

// A partir de ahí es un bean normal, inyectado por constructor como cualquier otro:
@Component
public class JwtUtil {
    private final JwtProperties jwtProperties;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }
}
```

**El mecanismo de binding, paso a paso** — esto es *relaxed binding* (binding flexible), y es más permisivo de lo que parece: Spring toma el prefijo `app.jwt`, le añade el nombre de cada campo de la clase, y busca el resultado en las fuentes de propiedades. Campo `expiration` → clave `app.jwt.expiration`. Luego llama al **setter** (`setExpiration(86400000L)`), que es por lo que la clase necesita setters y un constructor sin argumentos, y por lo que `@Data` está haciendo trabajo real aquí y no solo ahorrando teclas. "Relaxed" significa que la clave no tiene que coincidir con el campo carácter a carácter: `app.jwt.refresh-expiration`, `app.jwt.refreshExpiration` y la variable de entorno `APP_JWT_REFRESHEXPIRATION` se vinculan todas a un campo llamado `refreshExpiration`. Eso es lo que permite que la misma clase lea de un archivo de propiedades en kebab-case *y* de variables de entorno en screaming-snake-case en Docker sin que tengas que escribir nada dos veces.

**`@Value` frente a `@ConfigurationProperties`:**

| | `@Value` | `@ConfigurationProperties` |
|---|---|---|
| Cuándo usar | Uno o dos valores aislados | Un grupo de valores relacionados |
| Seguridad de tipos | Por campo, sin agrupar | Sí — todo el prefijo es un objeto con tipo |
| Testabilidad | Necesita un contexto de Spring para rellenarse | Solo `new JwtProperties()` y fijar los campos |

Lee la tabla por su **última fila** — es la que decide el argumento. Las dos primeras filas son cuestión de orden; la testabilidad es sobre si la clase en la que inyectas se puede testear de forma unitaria en absoluto. Un `JwtUtil` con campos `@Value` no se puede construir en un test JUnit puro con un secreto utilizable (los campos son `private`, y nada los fija sin un contexto). Un `JwtUtil` que recibe un `JwtProperties` en su constructor sí: construyes el objeto de propiedades a mano, lo pasas, y vuelves a estar testeando Java puro — el mismo argumento exacto que hizo ganar a la inyección por constructor, aplicado a la configuración en lugar de a los beans.

> **Por qué lo preguntan los entrevistadores:** en cuanto tienes más de dos o tres inyecciones `@Value` compartiendo un prefijo, el código tiene un olor — el grupo es real pero nada en el código lo dice. `@ConfigurationProperties` es el patrón de producción, y "¿cómo gestionas la configuración agrupada?" es una pregunta con una respuesta esperada. Nombrar el patrón *y* la razón (seguridad de tipos + testabilidad, no solo prolijidad) es lo que separa una respuesta ensayada de una entendida.

---

## Dónde te deja esto — y qué viene después

La pregunta con la que terminaba el archivo 02 queda respondida. Nadie llama a `new ProjectService(...)` porque **Spring lo hace**: `@Service` coloca una definición en el ApplicationContext, los parámetros del constructor declaran lo que ese bean necesita, Spring resuelve el conjunto entero en un grafo de dependencias, instancia en un orden que el grafo dicta, e inyecta una única instancia singleton compartida en cada clase que pidió el tipo. La inyección por constructor es la forma que hace visibles las dependencias, `final` los campos, testeable la clase sin un contenedor, y un ciclo un crash de arranque en lugar de un fantasma en producción. Y cuando el grafo tiene un agujero, ahora conoces el mensaje exacto — `Parameter 0 of constructor in ... required a bean of type '...' that could not be found` — y cuál de los dos nombres de clase que aparecen ahí es el que tiene tu bug.

Un bean en cada diagrama de cableado de este archivo ha estado haciendo trampa en silencio, sin embargo. El constructor de `TimeEntryService` pide tres repositorios, y Spring encuentra los tres — pero nunca escribiste una sola línea del cuerpo de `TimeEntryRepository`. Es una *interfaz*. No hay ninguna clase que la implemente en ningún sitio del proyecto, ningún `@Repository` sobre ella, ningún `new` — y aun así, al arrancar, aparece un objeto real en el contexto y `findAll()` devuelve filas de PostgreSQL. Un contenedor que solo instancia clases que tú escribiste no puede explicar eso.

[03-spring-data-jpa.md](./03-spring-data-jpa.md) es donde eso se resuelve: cómo Spring Data *genera* la implementación de una interfaz de repositorio en tiempo de ejecución, cómo `@Entity` mapea una clase sobre una tabla, y cómo un método llamado `findByActiveTrue()` — sin cuerpo alguno — se convierte en un `SELECT`.
