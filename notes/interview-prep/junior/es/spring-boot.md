# Spring Boot — Preguntas de entrevista

Coverage SHA-256: b7cb1dbcde90bef75bb05fb7fe680d9ec762b6d627b0c4340eed48e174e4285c

<a id="study-index"></a>

## Índice de estudio

Empieza por la primera vuelta. Dentro de cada vuelta, sigue los temas de arriba abajo y trabaja un grupo pequeño de preguntas cada vez. Si una pregunta requiere un concepto de otra vuelta, consulta esa pregunta y vuelve al punto donde estabas.

| Vuelta | Prioridad | Preguntas |
|---|---|---:|
| [1. Imprescindibles](#study-pass-1) | ⭐⭐⭐ | 28 |
| [2. Profundización](#study-pass-2) | ⭐⭐ | 61 |
| [3. Detalles](#study-pass-3) | ⭐ | 10 |

Lee la pregunta, intenta responder sin mirar, contrasta tu respuesta con la escrita y vuelve a explicarla con tus palabras. En el siguiente bloque, recupera alguna pregunta anterior sin consultar la respuesta.

Los enlaces llevan a las preguntas originales. Los números son sus identificadores, no el orden de estudio. Este índice sirve para estudiar por tu cuenta. Registra aquí tu progreso: ✅ y la fecha al final de la línea de cada pregunta que hayas trabajado, y después · PASS y la fecha cuando la superes en un examen de repaso.

<a id="study-pass-1"></a>

### Primera vuelta — Imprescindibles — ⭐⭐⭐

**Spring Boot básico**

- [001 — Qué es Spring Boot y por qué se usa](#SB-J-001)
- [002 — Qué es la auto-configuración](#SB-J-002)
- [003 — Inyección por constructor frente a @Autowired en campo](#SB-J-003)
- [004 — @Transactional y dónde se pone](#SB-J-004)
- [006 — Qué hace @SpringBootApplication](#SB-J-006)

**REST controllers**

- [014 — @Controller frente a @RestController](#SB-J-014)
- [015 — @PathVariable frente a @RequestParam](#SB-J-015)
- [016 — Arquitectura en capas de Spring Boot](#SB-J-016)
- [017 — DTOs frente a devolver entidades JPA](#SB-J-017)
- [018 — CORS y el error CORS desde Angular](#SB-J-018)
- [019 — Por qué devolver ResponseEntity](#SB-J-019)
- [024 — Anotaciones de Bean Validation y @Valid](#SB-J-024)

**Spring Data JPA**

- [027 — JPA frente a Hibernate](#SB-J-027)
- [028 — Qué te da JpaRepository](#SB-J-028)
- [029 — FetchType.LAZY frente a FetchType.EAGER](#SB-J-029)
- [030 — El problema N+1](#SB-J-030)
- [032 — Qué es un derived query method](#SB-J-032)
- [035 — @OneToMany frente a @ManyToOne](#SB-J-035)

**Seguridad y JWT**

- [042 — Cómo funciona la autenticación JWT](#SB-J-042)
- [043 — SecurityFilterChain y qué se configura en él](#SB-J-043)
- [044 — Autenticación frente a autorización](#SB-J-044)
- [045 — BCryptPasswordEncoder y las contraseñas en texto plano](#SB-J-045)
- [046 — JWT frente a sesiones del lado del servidor](#SB-J-046)

**Gestión de excepciones**

- [056 — @ControllerAdvice y cuándo usarlo](#SB-J-056)

**Testing**

- [063 — @SpringBootTest y cuándo usarlo](#SB-J-063)
- [064 — Mockito y @MockBean](#SB-J-064)
- [093 — Test unitario de un servicio con Mockito](#SB-J-093)

**Tooling**

- [069 — Containerizar una aplicación Spring Boot](#SB-J-069)

<a id="study-pass-2"></a>

### Segunda vuelta — Profundización — ⭐⭐

**Spring Boot básico**

- [005 — @Data de Lombok y la anotación del servicio](#SB-J-005)
- [007 — Para qué sirve application.properties](#SB-J-007)
- [008 — Opciones de ddl-auto por entorno](#SB-J-008)
- [009 — Por qué Spring Boot en el proyecto 07](#SB-J-009)
- [010 — Relación LAZY fuera de una transacción](#SB-J-010)
- [011 — Métodos @Bean en una clase @Configuration](#SB-J-011)
- [012 — Configuración distinta para desarrollo y producción](#SB-J-012)
- [071 — Starters de Spring Boot y el starter web](#SB-J-071)
- [073 — Interfaz de servicio más clase Impl](#SB-J-073)

**REST controllers**

- [020 — @RequestBody y cómo funciona](#SB-J-020)
- [021 — @Service y @Repository frente a @Component](#SB-J-021)
- [022 — @PatchMapping frente a @PutMapping](#SB-J-022)
- [023 — Convertir una entidad en un DTO](#SB-J-023)
- [025 — Mantener el hash de la contraseña fuera del JSON](#SB-J-025)
- [074 — Construir un CRUD para un recurso](#SB-J-074)
- [075 — El recorrido de una petición hasta el JSON](#SB-J-075)
- [076 — Recursión infinita en relaciones bidireccionales](#SB-J-076)

**Spring Data JPA**

- [031 — Mapear un enum con @Enumerated(EnumType.STRING)](#SB-J-031)
- [033 — Derived query method frente a @Query](#SB-J-033)
- [034 — Cómo decide save() entre insertar o actualizar](#SB-J-034)
- [036 — Anotaciones mínimas de una entidad JPA](#SB-J-036)
- [037 — Cientos de SELECT para una sola lista](#SB-J-037)
- [038 — Pageable y cuándo usarlo](#SB-J-038)
- [040 — CascadeType.ALL frente a orphanRemoval](#SB-J-040)
- [041 — Soft delete frente a borrar la fila](#SB-J-041)
- [078 — Conectar Spring Boot con PostgreSQL](#SB-J-078)
- [079 — findById y el 404](#SB-J-079)
- [080 — Cambios guardados sin llamar a save](#SB-J-080)
- [081 — Muchos a muchos y la entidad intermedia](#SB-J-081)
- [082 — @Data de Lombok en una entidad JPA](#SB-J-082)

**Seguridad y JWT**

- [047 — Deshabilitar CSRF en una API REST](#SB-J-047)
- [048 — @PreAuthorize y cuándo usarlo](#SB-J-048)
- [049 — Dónde se guarda el secreto JWT](#SB-J-049)
- [050 — Qué contiene un JWT y generateToken()](#SB-J-050)
- [051 — 401 Unauthorized frente a 403 Forbidden](#SB-J-051)
- [052 — UserDetailsService y por qué implementarlo](#SB-J-052)
- [053 — Gestión de sesión sin estado (stateless)](#SB-J-053)
- [054 — Invalidar un JWT antes de que caduque](#SB-J-054)
- [084 — Dónde se valida el JWT](#SB-J-084)
- [085 — Obtener el usuario autenticado](#SB-J-085)

**Gestión de excepciones**

- [057 — Extender RuntimeException frente a Exception](#SB-J-057)
- [087 — Errores por campo cuando falla @Valid](#SB-J-087)
- [088 — @ControllerAdvice frente a @RestControllerAdvice](#SB-J-088)
- [089 — @ResponseStatus frente a @ExceptionHandler](#SB-J-089)
- [090 — Email duplicado que devuelve un 500](#SB-J-090)
- [091 — Handler genérico que filtra detalles del error](#SB-J-091)

**Transacciones**

- [060 — @Transactional(readOnly = true) en métodos de lectura](#SB-J-060)
- [061 — @Transactional en métodos privados](#SB-J-061)
- [062 — Capturar una RuntimeException dentro de @Transactional](#SB-J-062)
- [092 — Por qué los servicios necesitan @Transactional](#SB-J-092)

**Testing**

- [065 — Qué es @WebMvcTest](#SB-J-065)
- [067 — @DataJpaTest y cuándo usarlo](#SB-J-067)
- [094 — Endpoints protegidos en @WebMvcTest](#SB-J-094)
- [095 — Un test que siempre pasa](#SB-J-095)

**Tooling**

- [070 — Flyway frente a ddl-auto=update](#SB-J-070)
- [096 — Construir y ejecutar el jar ejecutable](#SB-J-096)
- [097 — Puerto del servidor y precedencia de propiedades](#SB-J-097)
- [098 — @Value frente a @ConfigurationProperties](#SB-J-098)
- [099 — Logs y niveles por paquete](#SB-J-099)
- [100 — Documentar la API con OpenAPI](#SB-J-100)
- [101 — De javax a jakarta y cambios de Boot 3](#SB-J-101)

<a id="study-pass-3"></a>

### Tercera vuelta — Detalles — ⭐

**Spring Boot básico**

- [013 — Failed to configure a DataSource al arrancar](#SB-J-013)
- [072 — Ejecutar código una vez al arrancar](#SB-J-072)

**REST controllers**

- [026 — POST que devuelve 200 en lugar de 201](#SB-J-026)
- [077 — RestTemplate, RestClient o WebClient](#SB-J-077)

**Spring Data JPA**

- [039 — Por qué la entidad User necesita @Table](#SB-J-039)
- [083 — UPDATE en @Query necesita @Modifying](#SB-J-083)

**Seguridad y JWT**

- [055 — Filtro JWT que rechaza tokens válidos](#SB-J-055)
- [086 — hasRole y el prefijo ROLE_](#SB-J-086)

**Gestión de excepciones**

- [059 — MethodArgumentNotValidException frente a ConstraintViolationException](#SB-J-059)

**Tooling**

- [102 — Endpoints de Actuator en producción](#SB-J-102)

---

## Spring Boot básico

<a id="SB-J-001"></a>

**[SB-J-001] ¿Qué es Spring Boot y qué te aporta frente a Spring a secas o frente a Java puro?** ⭐⭐⭐

Spring es el framework y me da cosas como la inyección de dependencias o las transacciones. Spring Boot va por encima y me ahorra casi toda la configuración: añado un starter, por ejemplo el de web o el de JPA, y Boot configura solo lo que hace falta. Además trae un Tomcat dentro, así que la aplicación arranca sin instalar ningún servidor. Con Java puro tendría que montar todo eso yo a mano. En TimeTrack, por ejemplo, solo añadí los starters de web, JPA, seguridad y validación.

> **Consejo de entrevista:** separa las dos capas en voz alta — "Spring es el framework; Boot, la capa que trae las decisiones de configuración ya tomadas" — y luego nombra las tres cosas que añade Boot: auto-configuración, starters y servidor embebido.

---

<a id="SB-J-002"></a>

**[SB-J-002] ¿Qué es la auto-configuración y cómo decide Spring Boot qué configurarte?** ⭐⭐⭐

Al arrancar, Boot evalúa un conjunto de clases de configuración condicionales, y cada una crea sus beans solo si se cumplen sus condiciones: que una librería esté en el classpath, que una propiedad tenga valor y que no se haya declarado ya un bean de ese tipo. En el proyecto 07 basta con el starter de JPA y un `spring.datasource.url` para que Boot monte el `DataSource` de HikariCP, el `EntityManagerFactory` y el gestor de transacciones sin una línea de código mía; y como declaro mi propio bean `SecurityFilterChain` en `SecurityConfig`, la cadena por defecto de Boot — todos los endpoints detrás de un login — se retira.

> **Consejo de entrevista:** da las tres condiciones (classpath, propiedades, beans ya existentes) y un ejemplo real de cómo Boot se retira. Si te preguntan cómo comprobarías qué ha configurado, di que arrancas la aplicación con `--debug` y lees el informe de evaluación de condiciones.

---

<a id="SB-J-003"></a>

**[SB-J-003] ¿Inyección por campo con `@Autowired` o inyección por constructor? ¿Cuál usas y por qué?** ⭐⭐⭐

Por constructor. Las dependencias pasan a ser campos `private final` que no pueden cambiar después de construir el objeto, se ven en la firma del constructor y un test unitario puede pasarle los mocks directamente al constructor sin levantar un contexto de Spring; con inyección por campo las dependencias quedan ocultas y el objeto puede existir a medio construir. En el proyecto 07 no hay ni un solo `@Autowired`: `TimeEntryService` recibe `TimeEntryRepository`, `ProjectRepository` y `AuthenticatedUserProvider` por su único constructor, y desde Spring 4.3 un constructor único se usa para inyectar sin necesidad de la anotación.

Respuesta de alerta: "Pongo `@Autowired` en los campos porque es más corto." — Oculta lo que la clase necesita, y ya no se puede construir la clase en un test sin Spring o sin reflexión.

---

<a id="SB-J-004"></a>

**[SB-J-004] ¿Qué es `@Transactional` y dónde lo pones?** ⭐⭐⭐

Envuelve un método en una única transacción de base de datos: todo lo que escribe el método se confirma junto, o una excepción no comprobada que se escape de él lo revierte todo. Va en el método público del servicio que representa una operación de negocio, no en el controlador ni alrededor de cada llamada al repositorio, que ya se ejecuta en su propia transacción corta. En el proyecto 07 todos los métodos de escritura de los servicios llevan `@Transactional` y las lecturas `@Transactional(readOnly = true)`; `TimeEntryService.submit`, por ejemplo, carga la entrada, comprueba que sigue en DRAFT y que su proyecto está activo, y cambia su estado dentro de una sola transacción.

> **Consejo de entrevista:** el límite lo marca la operación de negocio, no el número de escrituras: "un caso de uso, una transacción, en el servicio". Añade que una excepción comprobada no hace rollback salvo que lo configures.

Respuesta de alerta: "Lo pongo en el controlador." — El controlador se ocupa de HTTP; la transacción pertenece al método de servicio que contiene la lógica de negocio, que es además donde la recibe cualquier otro que llame a esa lógica.

---

<a id="SB-J-006"></a>

**[SB-J-006] ¿Qué hace `@SpringBootApplication`?** ⭐⭐⭐

Combina tres anotaciones: `@SpringBootConfiguration` (un `@Configuration`, así que la clase puede declarar beans), `@EnableAutoConfiguration` (activa la auto-configuración) y `@ComponentScan` (busca componentes en el paquete de esta clase y en todos los que cuelgan de él). Se pone en la clase principal, la que llama a `SpringApplication.run`; en el proyecto 07 es `TimetrackApplication`, en `com.victor.timetrack`, y `controller`, `service`, `repository` y `security` cuelgan todos de ese paquete, por eso se encuentran todos los componentes sin configurar nada más.

> **Consejo de entrevista:** la mayoría de candidatos solo dice "arranca la aplicación"; nombrar las tres anotaciones es lo que demuestra comprensión real. Añade la regla del paquete: un `@Service` que queda fuera del árbol de paquetes de la clase principal no se escanea nunca, así que lo que lo inyecta falla al arrancar porque no existe ningún bean de ese tipo.

---

<a id="SB-J-005"></a>

**[SB-J-005] ¿Qué genera `@Data` de Lombok y qué anotaciones de Lombok usas en las entidades y en los servicios?** ⭐⭐

`@Data` genera getters, setters, `toString()`, `equals()`, `hashCode()` y un constructor para los campos obligatorios, así que en el proyecto 07 lo uso en los DTOs de petición y de respuesta. Las entidades no lo llevan: tienen `@Getter`/`@Setter` y `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con solo el `id` incluido. En los servicios escribo yo el constructor; `@RequiredArgsConstructor` generaría exactamente ese constructor a partir de los campos `private final`, y es lo que usan muchos equipos para la inyección por constructor.

> **Consejo de entrevista:** la trampa es `@Data` en una entidad JPA: el `equals()`, el `hashCode()` y el `toString()` generados usan todos los campos, incluidas las relaciones lazy, y eso puede lanzar consultas o una recursión infinita. Di "`@Data` para DTOs, `@Getter`/`@Setter` en entidades".

---

<a id="SB-J-007"></a>

**[SB-J-007] ¿Para qué sirve `application.properties`?** ⭐⭐

Es donde vive la configuración de la aplicación, fuera del código, y Boot lo lee al arrancar. En el proyecto 07 contiene la URL, el usuario y la contraseña del datasource, `ddl-auto`, `open-in-view=false`, el secreto y la caducidad del JWT y los orígenes permitidos de CORS; y todo valor sensible es un placeholder `${...}`: `${JWT_SECRET}` y `${DB_PASSWORD}` no tienen valor por defecto, así que los secretos solo viven en variables de entorno y nunca en git.

> **Consejo de entrevista:** la idea que tienes que transmitir es que el fichero se sube al repositorio y los secretos no; enséñalo con el placeholder `${VARIABLE}`, que además permite usar un mismo fichero en todos los entornos.

---

<a id="SB-J-008"></a>

**[SB-J-008] ¿Cuáles son las opciones de `spring.jpa.hibernate.ddl-auto` y cuál usas en cada entorno?** ⭐⭐

Los valores que hay que conocer son `create` (borra y vuelve a crear las tablas en cada arranque, así que se pierden todos los datos), `create-drop` (lo mismo, y además borra al apagar; es el valor por defecto con una base de datos embebida en memoria), `update` (añade las tablas y columnas que faltan y nunca borra nada), `validate` (comprueba que el esquema coincide con las entidades y, si no, la aplicación no arranca) y `none`. En el proyecto 07 uso `update` en todos los entornos, también en la demo desplegada, porque soy el único desarrollador, el esquema sigue cambiando y los datos de la demo se pueden volver a cargar; con un equipo, o con datos que tengan que sobrevivir a un cambio de esquema, pasaría a `validate` y dejaría el esquema en manos de una herramienta de migraciones como Flyway, porque `update` modifica una base de datos en uso sin nada que nadie pueda revisar.

Respuesta de alerta: "Siempre uso `create`, es más fácil para desarrollar." — Borra la base de datos en cada reinicio; usarlo fuera de un entorno desechable demuestra que no ves el riesgo de perder datos.

---

<a id="SB-J-009"></a>

**[SB-J-009] ¿Por qué elegiste Spring Boot en lugar de Spring a secas para el proyecto 07?** ⭐⭐

Sin Boot habría tenido que declarar yo el `DispatcherServlet`, el `DataSource`, el `EntityManagerFactory`, el gestor de transacciones y el cableado de los filtros de seguridad, elegir una versión compatible de cada librería y desplegar un WAR en un Tomcat instalado aparte. Con Boot generé el proyecto en start.spring.io con los starters que necesitaba y pude ponerme con los endpoints desde el principio, y el resultado es un único JAR que el Dockerfile arranca con `java -jar`. En un proyecto cuyo objetivo es la API y sus decisiones, y no el cableado de la infraestructura, era el trade-off correcto, y su precio — configuración que no he escrito yo — es algo que puedo inspeccionar cuando lo necesito.

Respuesta de alerta: "Porque el tutorial usaba Spring Boot." — Eso es seguir instrucciones, no tomar una decisión; el entrevistador quiere oír qué te quita Boot y qué te cuesta.

---

<a id="SB-J-010"></a>

**[SB-J-010] ¿Qué ocurre cuando accedes a una relación LAZY fuera de una transacción?** ⭐⭐

Salta una `LazyInitializationException`: el contexto de persistencia que cargó la entidad ya está cerrado, así que Hibernate no tiene dónde ejecutar la consulta que cargaría la relación. En el proyecto 07 desactivé `spring.jpa.open-in-view`, de modo que la sesión nunca sigue abierta al llegar al controlador; por eso los servicios convierten cada entidad en su DTO de respuesta antes de devolverla, dentro de sus propios métodos `@Transactional`.

Respuesta de alerta: "Pongo la relación en EAGER." — Eso tapa la excepción cargando la relación en cada consulta, aunque nadie la necesite, y cambia un error por un problema de rendimiento; la solución es convertir a DTO dentro de la transacción o traer la relación a propósito en la consulta.

---

<a id="SB-J-011"></a>

**[SB-J-011] ¿Qué es un método `@Bean` en una clase `@Configuration` y por qué necesitaste uno para `BCryptPasswordEncoder`?** ⭐⭐

`@Bean` registra como bean gestionado por Spring el objeto que devuelve un método, y es como registro una clase a la que no puedo ponerle `@Component` porque viene de una librería. `BCryptPasswordEncoder` es de Spring Security, así que en `SecurityConfig` un método `@Bean` devuelve `new BCryptPasswordEncoder()`, y Spring inyecta esa única instancia allí donde se pida un `PasswordEncoder`: en `UserService`, en el `DataInitializer` de desarrollo y en el propio Spring Security cuando comprueba una contraseña en el login. Publico el `AuthenticationManager` de la misma forma, porque Spring Security lo construye pero no lo expone para inyectarlo, y mi `AuthService` necesita llamarlo.

> **Consejo de entrevista:** la distinción es "`@Component` para tus clases, `@Bean` para clases de librería que no puedes editar". Esa frase responde la siguiente pregunta sin rodeos.

---

<a id="SB-J-012"></a>

**[SB-J-012] ¿Cómo mantienes configuración distinta para desarrollo y producción en Spring Boot?** ⭐⭐

Con perfiles (profiles) y variables de entorno. En el proyecto 07 `application.properties` es la base compartida, y `application-dev.properties` solo se carga cuando el perfil `dev` está activo: añade la configuración del manager inicial y `show-sql`, y el `DataInitializer` que crea esa cuenta lleva `@Profile("dev")`, así que en cualquier otro entorno ese bean ni siquiera existe. Todo lo que cambia de un entorno a otro — la URL y las credenciales de la base de datos, el secreto JWT — llega por variables de entorno, de modo que el mismo JAR corre en local con `docker compose` y `SPRING_PROFILES_ACTIVE=dev`, y en el entorno desplegado, sin ningún perfil.

> **Consejo de entrevista:** menciona el "fail fast": un `${JWT_SECRET}` sin valor por defecto detiene el arranque con un error de placeholder sin resolver si falta la variable, mucho mejor que descubrir un secreto null en el primer login.

---

<a id="SB-J-071"></a>

**[SB-J-071] ¿Qué es un starter de Spring Boot y qué mete `spring-boot-starter-web` en tu proyecto?** ⭐⭐

Un starter es una sola dependencia que trae un conjunto de librerías probadas y compatibles entre sí para una capacidad concreta, y es lo que la auto-configuración detecta después; no genera código propio. El starter web trae Spring MVC, Jackson para el JSON, un Tomcat embebido y el starter base de Boot con el logging; en Boot 4, que es el que usa el proyecto 07, se publica como `spring-boot-starter-webmvc`, y `spring-boot-starter-web` es el nombre que verás en proyectos con Boot 3. Ninguno de mis starters declara versión, porque las gestiona `spring-boot-starter-parent`; solo `jjwt`, que Boot no gestiona, lleva la suya.

```xml
<!-- projects/07-timetrack · pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
```

> **Consejo de entrevista:** di "un starter es un conjunto de dependencias seleccionadas, no código generado" y enumera lo que trae el web: MVC, Jackson y Tomcat embebido. Lo de las versiones (las gestiona el parent) es la repregunta que demuestra que te has leído tu propio pom.

---

<a id="SB-J-073"></a>

**[SB-J-073] Muchos proyectos tienen una interfaz `UserService` y una clase `UserServiceImpl`. ¿Hace falta la interfaz?** ⭐⭐

Técnicamente, no. Spring puede crear el proxy sobre la propia clase generando una subclase suya, y Spring Boot hace de ese proxy basado en clases el valor por defecto, así que `@Transactional` y las demás anotaciones basadas en proxies funcionan en un servicio concreto sin interfaz, que es como están escritos los servicios del proyecto 07; el único `Impl` que hay es `UserDetailsServiceImpl`, y solo porque implementa la interfaz `UserDetailsService` del propio Spring Security. La interfaz se gana su sitio cuando de verdad hay varias implementaciones, o cuando un equipo quiere separar el contrato del código para poder sustituirlo en los tests; en un código ya existente, sigo la convención que tenga.

Respuesta de alerta: "Spring necesita la interfaz para crear el proxy." — Solo la necesita un proxy dinámico de JDK; Spring crea el proxy de una clase concreta generando una subclase, que es lo que Boot usa por defecto, así que la separación es una convención y una decisión de diseño, no un requisito.

---

<a id="SB-J-013"></a>

**[SB-J-013] La aplicación falla al arrancar con "Failed to configure a DataSource" — ¿qué compruebas primero?** ⭐

Leo el análisis del fallo que Boot imprime bajo "APPLICATION FAILED TO START": ese mensaje significa que el starter de JPA está en el classpath pero Boot no ha encontrado ningún `spring.datasource.url` ni ninguna base de datos embebida, así que es un problema de configuración, no de la base de datos. Compruebo que la propiedad existe y está bien escrita, y que el perfil o la variable de entorno que debía darle valor está realmente activo. Si PostgreSQL simplemente estuviera caído, el error sería otro: el datasource sí se configura y lo que falla es la conexión con la base de datos.

Respuesta de alerta: "Reinicio PostgreSQL." — El mensaje habla de configuración que falta, así que reiniciar la base de datos no cambia nada; leer primero el análisis del fallo es lo que distingue un fallo de configuración de uno de conexión.

---

<a id="SB-J-072"></a>

**[SB-J-072] ¿Cómo ejecutas código una sola vez al arrancar la aplicación — por ejemplo, para crear un usuario administrador — y por qué no lo metes sin más en un constructor?** ⭐

Implemento `CommandLineRunner` en un bean: Boot llama a su método `run` cuando el contexto ya está construido del todo y todos los beans están disponibles, algo que un constructor no puede garantizar. En el proyecto 07 `DataInitializer` crea así la primera cuenta de manager; lleva `@Profile("dev")` y comprueba antes `existsByEmail`, porque se ejecuta en cada arranque y no debe crear el usuario dos veces.

```java
// projects/07-timetrack · DataInitializer.java
@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {
    @Override
    public void run(String... args) {
        String email = EmailNormalizer.normalize(adminEmail);
        if (userRepository.existsByEmail(email)) {
            return;
        }
        // ... crea el usuario MANAGER, codifica la contraseña y lo guarda
    }
}
```

Respuesta de alerta: "Lo meto en el constructor de un servicio." — El constructor se ejecuta mientras el contexto todavía se está construyendo, antes de que la aplicación esté lista, y sin una comprobación previa la carga inicial se repite en cada reinicio.

---
## REST controllers

<a id="SB-J-014"></a>

**[SB-J-014] ¿Cuál es la diferencia entre `@Controller` y `@RestController`?** ⭐⭐⭐

`@Controller` marca una clase cuyos métodos devuelven una vista para que un motor de plantillas la renderice como HTML; `@RestController` es `@Controller` más `@ResponseBody`, así que lo que devuelve cada método se escribe directamente en el cuerpo de la respuesta mediante un message converter — Jackson, en el caso del JSON. El backend del proyecto 07 es una API que consume Angular, así que sus cinco controladores — `AuthController`, `ProjectController`, `TimeEntryController`, `UserController` y `ReportController` — son `@RestController` y ninguno renderiza una página. Con un `@Controller` a secas tendría que poner `@ResponseBody` en cada método para conseguir lo mismo.

Respuesta de alerta: "`@RestController` es solo el nombre nuevo de `@Controller`." — No se comportan igual: sin `@ResponseBody`, lo que devuelve el método se resuelve como una vista — un `String` se toma como nombre de plantilla —, así que el endpoint se pone a buscar una página en lugar de responder con JSON.

---

<a id="SB-J-015"></a>

**[SB-J-015] ¿Cuándo usas `@PathVariable`, `@RequestParam` y `@RequestBody`?** ⭐⭐⭐

`@PathVariable` toma un valor de la ruta e identifica el recurso, `@RequestParam` lo toma de la query string para filtros y opciones, y `@RequestBody` convierte el cuerpo JSON en un objeto Java con los datos que se van a crear o modificar. En el proyecto 07 `PATCH /api/entries/{id}/reject` usa el primero y el último — el id de la entrada en la ruta y la nota de rechazo en el cuerpo —, mientras que el listado `GET /api/entries?projectId=3&status=SUBMITTED` recibe cada filtro como `@RequestParam(required = false)`, porque todos se pueden omitir.

```java
// projects/07-timetrack · TimeEntryController.java
@GetMapping
public ResponseEntity<Page<TimeEntryResponse>> findByFilter(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Long projectId,
        @RequestParam(required = false) EntryStatus status,
        // ... month y el Pageable
) {

@PatchMapping("/{id}/reject")
public ResponseEntity<TimeEntryResponse> reject(@PathVariable Long id, @Valid @RequestBody RejectRequest request) {
```

Respuesta de alerta: "Mando el id en el cuerpo y los filtros en la ruta." — Entonces la URL deja de nombrar el recurso, y los valores opcionales en la ruta obligan a tener una ruta por cada combinación. Además, `@RequestParam` es obligatorio por defecto, así que un filtro declarado sin `required = false` convierte en un 400 una petición que simplemente no lo manda.

---

<a id="SB-J-016"></a>

**[SB-J-016] ¿Qué es la arquitectura en capas de Spring Boot y por qué importa?** ⭐⭐⭐

Son tres capas, cada una con una sola responsabilidad: el controlador se ocupa de HTTP — el mapeo, el binding, la validación y el código de estado —, el servicio contiene las reglas de negocio y la transacción, y el repositorio habla con la base de datos; cada capa solo llama a la que tiene justo debajo. En el proyecto 07 `TimeEntryController` no toca nunca un repositorio: le pasa la petición a `TimeEntryService`, que comprueba, por ejemplo, que una entrada sigue en DRAFT antes de poder enviarla, y la guarda a través de `TimeEntryRepository`; así una regla como esa vive en un único sitio que comparten todos los endpoints.

> **Consejo de entrevista:** nombra las tres capas, di "separación de responsabilidades" y da la consecuencia: la lógica escrita en un controlador no la puede reutilizar otro endpoint ni se puede probar con un test unitario sin pasar por HTTP.

---

<a id="SB-J-017"></a>

**[SB-J-017] ¿Por qué usar DTOs en lugar de devolver entidades JPA directamente desde el controlador?** ⭐⭐⭐

Porque la entidad es mi modelo de base de datos y el DTO es el contrato de mi API, y no quiero que sean la misma cosa. En el proyecto 07 la entidad `User` guarda el hash BCrypt de la contraseña y `TimeEntry` tiene las asociaciones lazy `user` y `project`; `TimeEntryResponse`, en cambio, envía los campos planos que muestra Angular — `userId`, `userName`, `projectId`, `projectName` —, así que no se puede filtrar ningún hash, ninguna asociación lazy tiene que cargarse mientras se escribe el JSON y puedo cambiar el esquema sin romper el frontend. A la entrada, los DTOs de petición llevan la validación y solo los campos que el cliente puede fijar, así que nadie puede mandar su propio `id` o `status`.

Respuesta de alerta: "Devuelvo la entidad porque es menos código." — Ata la API al esquema y expone campos como el hash de la contraseña, y una asociación lazy o falla al serializarse cuando la sesión ya está cerrada o, en un mapeo bidireccional, entra en recursión hasta que la respuesta revienta.

---

<a id="SB-J-018"></a>

**[SB-J-018] ¿Qué es CORS y por qué tu aplicación Angular recibe un error CORS al llamar a la API Spring Boot?** ⭐⭐⭐

CORS es la regla del navegador por la que una página solo puede llamar a otro origen — esquema, host y puerto — si ese servidor lo permite con las cabeceras de respuesta `Access-Control-Allow-*`; el servidor de desarrollo de Angular en `localhost:4200` y la API en `localhost:8080` son orígenes distintos, así que sin ese permiso el navegador bloquea la llamada. En el proyecto 07 lo configuro una sola vez en `SecurityConfig`: un bean `CorsConfigurationSource` conectado a la cadena de seguridad con `.cors(...)`, cuyos orígenes permitidos salen de la propiedad `app.cors.allowed-origins`, de modo que el origen del frontend desplegado se fija con una variable de entorno y la propia cadena responde también a la petición preflight `OPTIONS` del navegador.

> **Consejo de entrevista:** di que el error vive en el navegador — Postman llama al mismo endpoint sin problema, porque solo los navegadores aplican CORS — y que la solución está en el servidor, permitiendo el origen. Si te preguntan por `@CrossOrigin`: sirve para la política local de un controlador, pero con Spring Security una configuración central mantiene una sola política para toda la API.

---

<a id="SB-J-019"></a>

**[SB-J-019] ¿Qué código de estado devuelves cuando creas un recurso, cuando no existe y cuando la entrada no es válida, y cómo lo fijas con `ResponseEntity`?** ⭐⭐⭐

201 Created cuando se crea algo, 404 Not Found cuando el id no existe y 400 Bad Request cuando la entrada incumple el contrato; además, 200 para una lectura o una actualización normal y 204 No Content para un borrado que no tiene nada que devolver. En el proyecto 07 los controladores fijan los estados de éxito con las factorías de `ResponseEntity` — `ok(...)`, `created(location).body(...)`, `noContent().build()` —, así que cada estado se lee como una constante con nombre, y los estados de error salen de `GlobalExceptionHandler`: el servicio lanza `ResourceNotFoundException`, que se convierte en un 404, y un `@Valid` que falla se convierte en un 400 con los errores listados por campo.

```java
// projects/07-timetrack · ProjectController.java
@PostMapping
public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest request){
    ProjectResponse created = projectService.create(request);
    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();
    return ResponseEntity.created(location).body(created);
}
```

> **Consejo de entrevista:** da primero los tres códigos y luego el "cómo": `ResponseEntity` cuando el estado o las cabeceras dependen del resultado, `@ResponseStatus` cuando el estado es siempre el mismo. Menciona que `created()` envía además la cabecera `Location` con la URL del recurso nuevo.

---

<a id="SB-J-024"></a>

**[SB-J-024] ¿Cómo validas el cuerpo de una petición en Spring Boot?** ⭐⭐⭐

Pongo restricciones de Bean Validation en los campos del DTO de petición y `@Valid` junto a `@RequestBody` en el controlador, así que Spring valida el objeto justo después de deserializarlo y, si una regla falla, lanza `MethodArgumentNotValidException` antes de que se ejecute mi método. En el proyecto 07 `CreateUserRequest` lleva `@NotBlank`, `@Email` y `@Size(max = 255)` en el email y `@NotNull` en el rol, `CreateTimeEntryRequest` acota las horas con `@DecimalMin("0.5")` y `@DecimalMax("24")`, y `GlobalExceptionHandler` convierte la excepción en un 400 con los mensajes agrupados por campo. Todo esto funciona solo porque `spring-boot-starter-validation` está en el classpath: sin un proveedor de validación, las anotaciones son metadatos que nadie comprueba.

```java
// projects/07-timetrack · CreateUserRequest.java y UserController.java
@NotBlank
@Email
@Size(max = 255)
private String email;
@NotNull
private Role role;

public ResponseEntity<CreateUserResponse> create(@Valid @RequestBody CreateUserRequest request){
```

> **Consejo de entrevista:** elige la restricción por lo que rechaza — `@NotNull` solo el null, `@NotEmpty` también el valor vacío, `@NotBlank` también el texto que solo tiene espacios —, así que `@NotBlank` para los strings y `@NotNull` para números, fechas y enums. Luego di por qué va en el DTO: una columna `nullable = false` solo frena el null en la base de datos, cuando la petición ya ha llegado al servicio, mientras que `@Valid` la rechaza en la entrada con un 400 que nombra el campo.

---

<a id="SB-J-020"></a>

**[SB-J-020] ¿Qué es `@RequestBody` y cómo funciona?** ⭐⭐

Le dice a Spring MVC que lea el cuerpo de la petición y lo convierta al tipo del parámetro mediante un message converter — para JSON es Jackson, que trae el starter web y configura Boot —, así que nunca parseo el contenido a mano. Spring elige el converter según el `Content-Type` de la petición, de modo que un cuerpo enviado sin `application/json` se rechaza con un 415 antes de que se ejecute mi método; después Jackson empareja por nombre las propiedades del JSON con las del DTO, y necesita una forma de construir el objeto: el constructor de un record, un creador anotado, o un constructor sin argumentos más los setters. En el proyecto 07 `POST /api/entries` recibe un `CreateTimeEntryRequest`, una clase con `@Data` de Lombok, así que Jackson usa el constructor sin argumentos y los setters que genera Lombok, y a un JSON mal formado le responde con un 400 el handler de `HttpMessageNotReadableException`.

> **Consejo de entrevista:** la repregunta habitual es "¿por qué me llegó el DTO con todos los campos a null?": los nombres del JSON no coincidían con las propiedades del DTO, o la clase no le daba a Jackson ninguna forma de asignarlos. Saber esa respuesta demuestra que entiendes lo que hace `@RequestBody` por debajo.

---

<a id="SB-J-021"></a>

**[SB-J-021] ¿Por qué usar `@Service` y `@Repository` en lugar de `@Component` para todo?** ⭐⭐

Las tres registran la clase como bean, así que en la mayoría de las clases el estereotipo indica la capa: en el proyecto 07 todos los servicios llevan `@Service`, mientras que los helpers pequeños como `AuthenticatedUserProvider` y `JwtUtil` se quedan en `@Component` a secas. La diferencia funcional es la traducción de excepciones de `@Repository` — los errores de persistencia llegan como la jerarquía `DataAccessException` de Spring —, y sin embargo mis repositorios no llevan `@Repository`: son interfaces de Spring Data que extienden `JpaRepository`, y Spring Data aplica esa traducción al repositorio que genera. Por eso `ProjectService.create` puede capturar un nombre duplicado como la `DataIntegrityViolationException` de Spring y no como una excepción de Hibernate; `@Repository` solo lo escribiría en una clase DAO que implementara yo.

Respuesta de alerta: "Todo repositorio necesita `@Repository` o Spring no lo encuentra." — Una interfaz de Spring Data se detecta porque extiende una interfaz de repositorio, y la traducción que añadiría la anotación ya se aplica al proxy generado; la anotación importa en una clase DAO escrita a mano.

---

<a id="SB-J-022"></a>

**[SB-J-022] ¿Cuál es la diferencia entre PUT y PATCH, y qué métodos HTTP son idempotentes?** ⭐⭐

PUT sustituye el recurso entero por la representación que envía el cliente, mientras que PATCH cambia solo una parte — unos pocos campos o, en mi caso, una transición de estado. En el proyecto 07 `PUT /api/entries/{id}` recibe el `UpdateTimeEntryRequest` completo — proyecto, fecha, horas y descripción, todos obligatorios —, mientras que los pasos del flujo son `PATCH /api/entries/{id}/submit`, `/approve`, `/reject` y `/reopen`, porque cada uno cambia solo el estado de la entrada. Idempotente significa que mandar la misma petición dos veces deja el servidor igual que mandarla una: GET, PUT y DELETE son idempotentes, POST no lo es y PATCH no tiene por qué serlo; por eso el reseteo de contraseña del manager en `UserController` es un POST: cada llamada genera una contraseña nueva.

Respuesta de alerta: "PATCH es un PUT más moderno, hacen lo mismo." — El cuerpo significa cosas distintas: un PUT que omite un campo está pidiendo que se vacíe, mientras que un PATCH lo deja como está; y mapear a PUT una operación no idempotente les dice a los clientes que pueden reintentarla sin riesgo cuando no es así.

---

<a id="SB-J-023"></a>

**[SB-J-023] ¿Cómo conviertes una entidad JPA en un DTO en la capa de servicio?** ⭐⭐

A mano, en un método privado `toResponse` de cada servicio, que se llama dentro de la transacción del servicio para que todas las asociaciones lazy que lee todavía se puedan cargar. En el proyecto 07 `TimeEntryService.toResponse` copia los campos propios de la entrada y aplana su `user` y su `project` en un id y un nombre cada uno, y todos los métodos del servicio que devuelven una entrada pasan por él, así que la conversión vive en un único sitio. En un proyecto más grande, un equipo puede generarla con MapStruct, un procesador de anotaciones cuya clase de implementación solo existe después de compilar; por eso, ahí, que falte el bean del mapper significa que el build está mal configurado, no que alguien olvidara escribir la clase.

```java
// projects/07-timetrack · TimeEntryService.java
private TimeEntryResponse toResponse(TimeEntry timeEntry) {
    TimeEntryResponse response = new TimeEntryResponse();
    response.setId(timeEntry.getId());
    response.setUserId(timeEntry.getUser().getId());
    response.setUserName(timeEntry.getUser().getName());
    response.setProjectId(timeEntry.getProject().getId());
    response.setProjectName(timeEntry.getProject().getName());
    // ... date, hours, description, status, rejectionNote
    return response;
}
```

> **Consejo de entrevista:** di por qué la conversión se hace dentro de la transacción: con open-in-view desactivado, convertir después de que el servicio haya devuelto la entidad lanzaría una `LazyInitializationException` en `getUser().getName()`. Presenta MapStruct como lo que esperas encontrarte en un equipo, no como algo que necesiten un puñado de DTOs.

---

<a id="SB-J-025"></a>

**[SB-J-025] ¿Cómo evitas que tu API devuelva alguna vez el hash de la contraseña en la respuesta JSON?** ⭐⭐

No dejando nunca que la entidad llegue a la respuesta: todos los endpoints del proyecto 07 devuelven un DTO de respuesta y ninguno tiene un campo para el hash — `UserResponse` lleva el id, el nombre, el email, el rol y el indicador de activo —, y la única contraseña que sale de la API es la contraseña de un solo uso que se genera en `CreateUserResponse` y `PasswordResetResponse`, a propósito, porque el manager tiene que hacérsela llegar al usuario. No pongo `@JsonIgnore` en `User.password`, porque ningún endpoint devuelve la entidad; y como red de seguridad tiene una trampa: oculta el campo en las dos direcciones, así que una clase anotada así tampoco podría leer una contraseña de una petición, salvo que se restrinja el acceso a solo escritura.

> **Consejo de entrevista:** empieza por el DTO como la frontera real y presenta `@JsonIgnore` como una regla local de Jackson, no como un sustituto de un tipo de respuesta. Que funcione en las dos direcciones es el detalle que se le escapa a la mayoría de candidatos.

---

<a id="SB-J-074"></a>

**[SB-J-074] Explícame cómo construyes un CRUD para un recurso. ¿Qué clases creas?** ⭐⭐

Tomando como ejemplo `Project` en el proyecto 07, de la base de datos hacia arriba: la entidad `Project`; `ProjectRepository`, una interfaz que extiende `JpaRepository<Project, Long>` y que implementa Spring Data; los DTOs de petición `CreateProjectRequest` y `UpdateProjectRequest`, que llevan la validación, y el DTO de respuesta `ProjectResponse`; `ProjectService`, que contiene las reglas — nada de nombres duplicados, un borrado que desactiva en lugar de eliminar — en métodos `@Transactional` y convierte cada entidad en la respuesta; y `ProjectController`, que mapea `GET`, `GET /{id}`, `POST`, `PUT /{id}` y `DELETE /{id}` bajo `/api/projects` y responde 200, 201 con la cabecera `Location`, y 204. Lo cierra la parte de errores: el servicio lanza `ResourceNotFoundException` o `DuplicateResourceException`, y el único `GlobalExceptionHandler` las convierte en 404 y 409 para todos los recursos.

> **Consejo de entrevista:** ve en orden y di qué puede hacer cada capa — el controlador solo se ocupa de HTTP, el servicio es dueño de las reglas y de la transacción, el repositorio solo persiste. Terminar con los códigos de estado y el mapeo de errores es lo que hace que suene a un endpoint que de verdad has puesto en marcha.

---

<a id="SB-J-075"></a>

**[SB-J-075] Explícame qué pasa desde que una petición HTTP llega a tu aplicación Spring Boot hasta que vuelve el JSON.** ⭐⭐

La recibe el Tomcat embebido, que pasa primero por los filtros de servlet; en el proyecto 07 entre ellos está la cadena de Spring Security, donde `JwtFilter` valida el token y guarda el usuario en el `SecurityContextHolder`, o bien `JwtAuthenticationEntryPoint` responde con un 401 sin que la petición llegue a ningún controlador. Después el `DispatcherServlet` pregunta a los handler mappings qué método de controlador encaja con el verbo y la ruta; los argument resolvers enlazan `@PathVariable`, `@RequestParam` y `@RequestBody` — con Jackson leyendo el JSON — y ejecutan `@Valid`; la seguridad de método comprueba el `@PreAuthorize`; y el controlador llama al servicio. A la vuelta, el mismo converter de Jackson escribe como JSON el cuerpo del `ResponseEntity`, y si algo lanza una excepción en el controlador o en el servicio, `GlobalExceptionHandler` construye la respuesta de error en su lugar.

> **Consejo de entrevista:** cuéntalo como un recorrido numerado — filtros, `DispatcherServlet`, handler mapping, binding y validación, controlador, servicio, converter — y añade la consecuencia para depurar: un error que salta en un filtro nunca llega al `@RestControllerAdvice`, y por eso el 401 tiene su propio entry point.

---

<a id="SB-J-076"></a>

**[SB-J-076] Devuelves una entidad con un `@OneToMany`/`@ManyToOne` bidireccional y la respuesta falla con una recursión infinita (`StackOverflowError`). ¿Por qué pasa y cómo lo arreglas?** ⭐⭐

Jackson serializa siguiendo los getters, y los dos lados se apuntan el uno al otro: la lista `entries` del usuario contiene entradas cuyo `user` vuelve a contener la misma lista, así que entra en recursión hasta que se desborda la pila, o hasta que el propio límite de profundidad de anidamiento de Jackson lo corta con un error. El arreglo que elegiría está en la frontera: devolver un DTO de respuesta que aplana el otro lado en un id y un nombre, de modo que no haya ningún ciclo que seguir. Así está construido el proyecto 07 — sus entidades solo mapean el lado `@ManyToOne`, y `TimeEntryResponse` lleva `userId` y `userName` en lugar del `User` —, así que ahí el ciclo no se puede formar.

```java
// illustrative — not from a project
@Entity
class User {
    @OneToMany(mappedBy = "user")
    private List<TimeEntry> entries;   // User → entries → el user de cada entrada → entries → ...
}

@Entity
class TimeEntry {
    @ManyToOne
    private User user;
}
```

Respuesta de alerta: "Le pongo `@JsonIgnore`, o `@JsonManagedReference` y `@JsonBackReference`, a la entidad." — Eso tapa el síntoma mientras la API sigue devolviendo el modelo de base de datos; el ciclo es la señal de que la entidad está cruzando la frontera, y un DTO de respuesta elimina la causa.

---

<a id="SB-J-026"></a>

**[SB-J-026] Un endpoint POST siempre devuelve 200 en lugar de 201 — ¿qué olvidaste?** ⭐

Fijar el estado: el controlador devuelve directamente el objeto creado, o lo envuelve en `ResponseEntity.ok(...)`, y las dos cosas dan el 200 por defecto. La solución está en el `return`: en el proyecto 07 todos los endpoints de creación terminan con `ResponseEntity.created(location).body(created)`, que envía el 201 junto con una cabecera `Location` que apunta al recurso nuevo, construida a partir de la petición actual con `ServletUriComponentsBuilder`.

Respuesta de alerta: "Spring devuelve 201 automáticamente en un POST." — El valor por defecto es 200 para todos los métodos; el estado hay que indicarlo, con `ResponseEntity` o con `@ResponseStatus(HttpStatus.CREATED)`.

---

<a id="SB-J-077"></a>

**[SB-J-077] Tu backend tiene que llamar a la API REST de otro equipo. ¿Usas `RestTemplate`, `RestClient` o `WebClient`, y cuál elegirías hoy?** ⭐

En una aplicación Spring MVC como el proyecto 07 elegiría `RestClient`: es el cliente síncrono que introdujo Spring Framework 6.1, con una API fluida — `get().uri(...).retrieve().body(...)` — y funciona con el mismo modelo bloqueante que el resto de la aplicación. `RestTemplate` hace el mismo trabajo con la API de plantilla, más antigua; el equipo de Spring lo ha dejado en modo mantenimiento y recomienda `RestClient` para el código nuevo, pero es lo que esperaría encontrarme en un proyecto ya existente, y ahí lo seguiría usando en lugar de mezclar dos clientes. `WebClient` es el cliente reactivo y no bloqueante de WebFlux, que se gana su sitio cuando la aplicación es reactiva o tiene que hacer muchas llamadas a la vez. El proyecto 07 todavía no llama a ninguna API externa, así que no he escrito ninguna de estas llamadas en él.

Respuesta de alerta: "`WebClient`, porque es el moderno." — Es el cliente reactivo: en una aplicación MVC bloqueante mete WebFlux y otro modelo de programación para una sola llamada, mientras que la respuesta síncrona actual es `RestClient`.

---
## Spring Data JPA

<a id="SB-J-027"></a>

**[SB-J-027] ¿Cuál es la diferencia entre JPA, Hibernate y Spring Data JPA?** ⭐⭐⭐

JPA — Jakarta Persistence — es la especificación: las anotaciones de mapeo como `@Entity`, `@Id` y `@ManyToOne` y la API del `EntityManager`, sin ningún código que se ejecute por sí solo. Hibernate es la implementación que hace el trabajo: lee esos mapeos, genera el SQL y lleva la cuenta de las entidades que ha cargado. Spring Data JPA va encima de los dos y elimina el código repetitivo de los repositorios: yo declaro una interfaz y él genera la implementación que llama al `EntityManager` por mí. En el proyecto 07 `spring-boot-starter-data-jpa` trae los tres: las entidades importan `jakarta.persistence.*`, Hibernate es el proveedor que configura Boot y `UserRepository` es solo una interfaz que extiende `JpaRepository<User, Long>`.

> **Consejo de entrevista:** da una línea por capa — "JPA es la especificación, Hibernate la implementa y Spring Data genera los repositorios encima" — y añade que las anotaciones de mapeo vienen de `jakarta.persistence`, y que una exclusiva de Hibernate como `@CreationTimestamp` ata esa entidad a Hibernate.

---

<a id="SB-J-028"></a>

**[SB-J-028] ¿Qué te da extender `JpaRepository` y en qué se diferencia de `CrudRepository`?** ⭐⭐⭐

Extender `JpaRepository<User, Long>` me da todo el contrato CRUD sin escribir ninguna implementación — `save`, `findById`, `findAll`, `existsById`, `count`, `delete`, `deleteById` —, porque Spring Data genera un proxy para la interfaz al arrancar. Las interfaces se apoyan unas en otras: `CrudRepository` tiene las operaciones básicas, la interfaz de paginación y ordenación añade `findAll(Sort)` y `findAll(Pageable)`, y `JpaRepository` reúne las dos y añade los extras propios de JPA: `saveAndFlush`, los borrados por lotes y resultados en `List` en lugar de `Iterable`. En el proyecto 07 extiendo `JpaRepository` porque uso esos extras: `ProjectService.create` llama a `saveAndFlush` para que un nombre duplicado falle dentro de su propio `try`, y `ProjectService.getAll` le pasa un `Sort` a `findAll`.

Respuesta de alerta: "Son lo mismo." — `JpaRepository` contiene todo lo que tiene `CrudRepository` más el flush, las operaciones por lotes, la paginación y la ordenación; conocer la jerarquía es lo que te dice, en un código que heredas, qué métodos puede llamar cada repositorio.

---

<a id="SB-J-032"></a>

**[SB-J-032] ¿Cómo funcionan los derived query methods como `findByEmail` en Spring Data JPA?** ⭐⭐⭐

Al arrancar, Spring Data analiza el nombre del método — el sujeto (`find`, `exists`, `count`), luego `By` y luego propiedades de la entidad unidas con `And` u `Or` y palabras clave como `IgnoreCase`, `True` o `Between` — y construye la consulta a partir de él, así que yo solo escribo la firma. En el proyecto 07 `UserRepository.findByEmail` devuelve un `Optional<User>` para la búsqueda del login, `existsByEmail` responde sí o no sin cargar el usuario, y `ProjectRepository.existsByNameIgnoreCase` comprueba si ya existe un proyecto con ese nombre sin distinguir mayúsculas. Como el nombre se refiere a propiedades de la entidad, una errata como `findByEmial` hace fallar la aplicación al arrancar, no en la primera petición; cuando un nombre deja de leerse con claridad, paso a `@Query`.

```java
// projects/07-timetrack · UserRepository.java y ProjectRepository.java
Optional<User> findByEmail(String email);
boolean existsByEmail(String email);

List<Project> findByActiveTrue(Sort sort);
boolean existsByNameIgnoreCase(String name);
```

> **Consejo de entrevista:** separa el nombre en sus tres partes — qué hace (`find`, `exists`, `count`), `By` y la propiedad — y di que se comprueba contra la entidad al arrancar la aplicación. Un `Sort` o un `Pageable` como último parámetro es la repregunta natural.

---

<a id="SB-J-035"></a>

**[SB-J-035] ¿Cómo mapeas una relación uno a muchos? ¿Qué lado es el propietario y qué hace `mappedBy`?** ⭐⭐⭐

El lado propietario es la entidad cuya tabla tiene la clave foránea, y se mapea con `@ManyToOne` y un `@JoinColumn` que nombra esa columna; el otro lado, si lo quiero, es `@OneToMany(mappedBy = "user")`, donde `mappedBy` nombra el campo propietario de la relación y le dice a Hibernate que este lado no escribe ninguna columna propia. En el proyecto 07 `time_entries` tiene `user_id` y `project_id`, así que `TimeEntry` lleva las dos asociaciones `@ManyToOne`; y el lado inverso ni siquiera lo he mapeado, porque toda lista de entradas sale de `TimeEntryRepository` con filtros y paginación, nunca de `user.getEntries()`. Un `@OneToMany` sin `mappedBy` ni `@JoinColumn` se interpreta como una relación aparte, y Hibernate espera una tabla intermedia que nadie pretendía crear.

```java
// projects/07-timetrack · TimeEntry.java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false)
private User user;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "project_id", nullable = false)
private Project project;
```

> **Consejo de entrevista:** empieza por la base de datos — "la tabla que tiene la clave foránea es la propietaria, y su entidad lleva `@ManyToOne`" — y añade que solo se escribe el lado propietario: cambiar únicamente `user.getEntries()` no escribe ninguna clave foránea; lo que la escribe es el `setUser(...)` de la entrada.

---

<a id="SB-J-029"></a>

**[SB-J-029] ¿Por qué usas `FetchType.LAZY` en lugar de `FetchType.EAGER`?** ⭐⭐⭐

LAZY carga la entidad asociada solo cuando el código la toca por primera vez, mientras que EAGER la carga junto con la entidad propietaria cada vez, la necesite el caso de uso o no. Los valores por defecto son asimétricos — `@ManyToOne` y `@OneToOne` son EAGER, las colecciones son LAZY —, así que en el proyecto 07 pongo `fetch = FetchType.LAZY` de forma explícita en los dos `@ManyToOne` de `TimeEntry`; si no, cada consulta que carga entradas cargaría también su usuario y su proyecto. Cuando un caso de uso sí los necesita, los traigo a propósito en esa consulta: el listado de entradas trae el usuario y el proyecto en la misma SELECT.

Respuesta de alerta: "EAGER es más sencillo: todo está siempre ahí." — EAGER queda fijado en el mapeo, así que cada consulta de esa entidad paga la asociación, muchas veces con SELECT extra, aunque nadie la lea; cuánto cargar se decide por caso de uso, en la consulta.

---

<a id="SB-J-030"></a>

**[SB-J-030] ¿Qué es el problema N+1 y cómo lo evitas?** ⭐⭐⭐

Es una consulta que carga una lista seguida de una consulta más por cada fila en cuanto el código toca una asociación lazy de cada elemento: 1 + N viajes a la base de datos para algo que debería ser uno. En el proyecto 07 el caso es el listado de entradas: `toResponse` lee el nombre del usuario y el del proyecto de cada entrada, así que una página de 20 entradas podría lanzar una SELECT por cada usuario y cada proyecto que aún no estuviera cargado. Lo evito con un fetch join: la specification `fetchUserAndProject` añade `user` y `project` a la misma SELECT, y se salta el join en la consulta de recuento que lanza la paginación, donde un fetch join no está permitido. En un `@Query` la misma solución es `JOIN FETCH`, y `@EntityGraph` es la forma de pedirlo con una anotación.

```java
// projects/07-timetrack · TimeEntrySpecifications.java
public static Specification<TimeEntry> fetchUserAndProject() {
    return (root, query, criteriaBuilder) -> {
        if (Long.class != query.getResultType() && long.class != query.getResultType()) {
            root.fetch("user", JoinType.LEFT);
            root.fetch("project", JoinType.LEFT);
        }
        return criteriaBuilder.conjunction();
    };
}
```

> **Consejo de entrevista:** descríbelo contando consultas — "una para la lista y luego una por fila" — y di cómo lo verías: con `show-sql` activado, la misma SELECT se repite con un id distinto. Después nombra las soluciones — `JOIN FETCH`, `@EntityGraph` o una consulta que devuelva un DTO — y di que cambiar la asociación a EAGER no es una de ellas.

---

<a id="SB-J-078"></a>

**[SB-J-078] ¿Cómo conectas Spring Boot con PostgreSQL? ¿Qué dependencias y propiedades necesitas?** ⭐⭐

Dos dependencias y tres propiedades. El starter de JPA trae Hibernate, Spring Data y el pool de conexiones HikariCP, y el driver JDBC de PostgreSQL entra con scope `runtime` porque solo lo necesita la aplicación en ejecución; luego `spring.datasource.url`, `username` y `password`, y Boot construye el `DataSource` a partir de ellas por su cuenta; hasta deduce la clase del driver a partir de la URL `jdbc:postgresql:`. En el proyecto 07 las tres son placeholders de variables de entorno: la URL y el usuario tienen valores por defecto para local y la contraseña no tiene ninguno, así que nunca está en git. HikariCP mantiene abierto un conjunto de conexiones y presta una a cada unidad de trabajo en lugar de abrir una conexión nueva por petición.

```properties
# projects/07-timetrack · application.properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/timetrack}
spring.datasource.username=${DB_USERNAME:timetrack_app}
spring.datasource.password=${DB_PASSWORD}
```

> **Consejo de entrevista:** responde en orden: dependencias, propiedades y lo que Boot construye con ellas (`DataSource`, `EntityManagerFactory` y gestor de transacciones). Si te aprietan con el pool, nombra HikariCP y di que su configuración va bajo `spring.datasource.hikari.*`.

---

<a id="SB-J-036"></a>

**[SB-J-036] ¿Qué anotaciones necesita una entidad JPA y qué estrategias de generación de ids conoces?** ⭐⭐

`@Entity` en la clase e `@Id` en la clave primaria son las únicas anotaciones obligatorias; además, la clase necesita un constructor sin argumentos y no puede ser `final`, porque Hibernate la instancia y crea subclases de ella para los proxies lazy, y `@GeneratedValue` deja que el id lo genere la base de datos. Las estrategias son `IDENTITY` (una columna identity o autoincremental, así que el id solo se conoce después del INSERT), `SEQUENCE` (una secuencia de la base de datos, que PostgreSQL tiene y que permite a Hibernate reservar ids por adelantado e insertar por lotes), `TABLE` (poco usada) y `AUTO`, la de por defecto, en la que decide el proveedor. En el proyecto 07 las entidades usan un `@GeneratedValue` sin más, así que es `AUTO`, que Hibernate resuelve como una secuencia en PostgreSQL; el constructor lo aporta `@NoArgsConstructor` de Lombok, y `@Table` y `@Column` están para nombrar la tabla y declarar restricciones, no porque JPA las exija.

```java
// projects/07-timetrack · User.java
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    // ...
}
```

> **Consejo de entrevista:** el mínimo son dos anotaciones, `@Entity` e `@Id`, y la repregunta es la estrategia: di qué hacen `IDENTITY` y `SEQUENCE` y que en PostgreSQL lo natural es una secuencia. Una clase sin `@Entity` no está mapeada en absoluto, así que un repositorio sobre ella hace fallar la aplicación al arrancar con "Not a managed type".

---

<a id="SB-J-038"></a>

**[SB-J-038] ¿Cómo paginas y ordenas resultados en Spring Data (`Pageable`, `Page`)?** ⭐⭐

El controlador recibe un parámetro `Pageable`, que Spring rellena a partir de los parámetros de consulta `page`, `size` y `sort`, y el método de repositorio que lo recibe devuelve un `Page<T>`: las filas de esa página más el total de elementos y de páginas, que Spring Data obtiene con una consulta de recuento adicional. En el proyecto 07 `GET /api/entries` declara `@PageableDefault(size = 20, sort = {"date", "id"}, direction = DESC)`, el servicio le pasa el `Pageable` a `findAll(spec, pageable)` y convierte la página en DTOs con `.map(this::toResponse)`, y `WebConfig` limita el tamaño a 100, así que un cliente no puede pedir la tabla entera de una vez. Cuando el cliente solo necesita saber si hay una página siguiente, un `Slice<T>` se ahorra la consulta de recuento.

```java
// projects/07-timetrack · TimeEntryController.java y TimeEntryService.java
@PageableDefault(size = 20, sort = {"date", "id"},
        direction = Sort.Direction.DESC) Pageable pageable

return timeEntryRepository.findAll(spec, pageable)
        .map(this::toResponse);
```

> **Consejo de entrevista:** nombra los tres parámetros de la petición y los dos tipos — `Pageable` de entrada, `Page<T>` de salida — y luego el coste: `Page` lanza una segunda consulta para contar y `Slice` no. Un límite al tamaño de página es el detalle que demuestra que has pensado en un cliente que lo pide todo.

---

<a id="SB-J-079"></a>

**[SB-J-079] ¿Qué devuelve `findById` y cómo conviertes un "no encontrado" en un 404?** ⭐⭐

Devuelve un `Optional<T>` — vacío cuando ninguna fila tiene ese id, nunca `null` —, así que el caso de ausencia hay que tratarlo donde se carga la entidad. En el proyecto 07 `ProjectService`, `TimeEntryService` y `UserService` lo desenvuelven con `orElseThrow` y una `ResourceNotFoundException` propia, y `GlobalExceptionHandler` convierte esa excepción en un 404 con el cuerpo de error de la API, así que ningún controlador comprueba la ausencia por su cuenta.

```java
// projects/07-timetrack · ProjectService.java
Project project = projectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
```

> **Consejo de entrevista:** di "un `Optional`, nunca `null`" y enseña el `orElseThrow`. La repregunta habitual es `getReferenceById`: devuelve un proxy sin lanzar ninguna consulta y solo falla cuando lo tocas, así que sirve para fijar una clave foránea, no para comprobar que una fila existe.

---

<a id="SB-J-033"></a>

**[SB-J-033] ¿Cuándo escribes una consulta con `@Query` y qué diferencia hay entre JPQL y una consulta nativa?** ⭐⭐

Uso `@Query` cuando el nombre del método deja de expresar la consulta — un agregado, una proyección, un join con condiciones — y por defecto la escribo en JPQL: consulta entidades y sus campos (`FROM TimeEntry te`, `te.project.name`), así que Hibernate la traduce al SQL de la base de datos y la comprueba contra los mapeos al arrancar. Una consulta nativa, con `nativeQuery = true`, es SQL puro contra tablas y columnas; solo la usaría para algo que JPQL no puede expresar, como una función propia de PostgreSQL, y lo pagaría en portabilidad y en esa comprobación al arrancar, porque Hibernate le pasa el SQL nativo a la base de datos sin leerlo. En el proyecto 07 las tres consultas de informes de `TimeEntryRepository` son agregados en JPQL — `SUM`, agrupado con `GROUP BY` en los informes por proyecto y por usuario — con alias que rellenan una proyección de interfaz, así que cada informe sale de una sola consulta en lugar de cargar todas las entradas; ninguna ha necesitado SQL nativo.

```java
// projects/07-timetrack · TimeEntryRepository.java
@Query("""
        SELECT te.project.id AS projectId, te.project.name AS projectName, round(SUM(te.hours), 2) AS totalHours, te.project.active AS active
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.id, te.project.name, te.project.active
        ORDER BY SUM(te.hours) DESC, te.project.name ASC
        """)
List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);
```

Respuesta de alerta: "Siempre escribo SQL nativo porque ya sé SQL." — Ata el repositorio a una base de datos concreta y a los nombres de tablas y columnas, y renuncia a la comprobación al arrancar que detecta un campo renombrado; el SQL nativo es la excepción que se justifica, no lo normal.

---

<a id="SB-J-034"></a>

**[SB-J-034] ¿Cómo sabe `save()` si tiene que insertar o actualizar?** ⭐⭐

Spring Data pregunta primero si la entidad es nueva — por defecto, si su `@Id` sigue siendo `null` — y llama a `persist` si lo es, que acaba en un INSERT, o a `merge` si ya tiene id, que acaba en un UPDATE; por eso `save()` no es un sinónimo de INSERT. En el proyecto 07 `TimeEntryService.create` guarda un `new TimeEntry()` con el id a null y obtiene un INSERT y un id generado, mientras que `submit` llama a `save` sobre una entrada que acaba de cargar con `findById`; esa entrada ya está gestionada, así que `merge` la devuelve tal cual y el UPDATE sale del dirty checking al hacer commit.

> **Consejo de entrevista:** "id null significa nueva: `persist`; cualquier otra cosa: `merge`". Luego añade la consecuencia: llamar a `save` con un id inventado no inserta una fila con ese id, sino que pasa por el camino de `merge`.

---

<a id="SB-J-080"></a>

**[SB-J-080] Dentro de un método `@Transactional` cargas una entidad, cambias un campo y no llamas nunca a `save()`. ¿Se guarda el cambio, y por qué?** ⭐⭐

Sí. Una entidad cargada dentro de la transacción la gestiona el contexto de persistencia, que guarda una copia de su estado; en el flush, justo antes del commit, Hibernate compara cada entidad gestionada con esa copia y escribe un UPDATE con lo que haya cambiado: eso es el dirty checking. En el proyecto 07 los métodos del flujo de aprobación siguen llamando a `save` después de cambiar el estado, como hace `submit` aquí abajo, pero con una entrada que ya está gestionada esa llamada sobra: el cambio llegaría a la base de datos sin ella. Solo se pierde si la entidad está desconectada (detached) — cargada fuera de la transacción o conservada después de que terminara — o si el método corre en una transacción `readOnly`, donde no se hace flush de nada.

```java
// projects/07-timetrack · TimeEntryService.java
@Transactional
public TimeEntryResponse submit(Long id) {
    User user = authenticatedUserProvider.currentUser();
    TimeEntry timeEntry = findOwnedEntry(id, user);
    // ... comprobaciones de DRAFT y de proyecto activo
    timeEntry.setStatus(EntryStatus.SUBMITTED);
    TimeEntry saved = timeEntryRepository.save(timeEntry);
    return toResponse(saved);
}
```

Respuesta de alerta: "No: sin `save()` no llega nada a la base de datos." — Demuestra que no conoces el contexto de persistencia: las entidades gestionadas se escriben en el flush, lo que también significa que un setter llamado por error dentro de una transacción se guarda igualmente.

---

<a id="SB-J-037"></a>

**[SB-J-037] Tu aplicación registra cientos de SELECT para una sola petición de lista — ¿qué ha pasado?** ⭐⭐

Casi seguro que es un N+1: la consulta de la lista se ejecutó una vez y luego se cargó una asociación lazy fila a fila. Lo confirmaría en el log — con `spring.jpa.show-sql=true`, que activa el perfil `dev` del proyecto 07, la misma SELECT sobre `users` o `projects` se repite con un id distinto por cada fila —, buscaría qué asociación toca el código dentro del bucle, normalmente en la conversión a DTO, y la traería en la propia consulta de la lista con un fetch join o un `@EntityGraph`, como hace el listado de entradas con el usuario y el proyecto. Después vuelvo a leer el log: una SELECT para la página y la consulta de recuento.

Respuesta de alerta: "Cambio la relación a EAGER." — EAGER no arregla el N+1: en una lista muchas veces sigue cargando cada asociación con su propia SELECT, y ahora lo hace en todas las consultas de esa entidad; la solución es traer la asociación en la consulta que la necesita.

---

<a id="SB-J-031"></a>

**[SB-J-031] ¿Cómo mapeas un campo enum a la base de datos y por qué `@Enumerated(EnumType.STRING)` es la opción segura?** ⭐⭐

Con `@Enumerated`, y la decisión es qué se guarda. El valor por defecto, `EnumType.ORDINAL`, guarda la posición de la constante (0, 1, 2), así que insertar o reordenar una constante más adelante cambia en silencio el significado de todas las filas ya guardadas; `EnumType.STRING` guarda el nombre, que sobrevive a eso. En el proyecto 07 `TimeEntry.status` y `User.role` llevan los dos `@Enumerated(EnumType.STRING)`, así que la tabla guarda `DRAFT` o `SUBMITTED`: se lee bien en pgAdmin y no pasa nada si algún día se añade un estado entre dos de los que ya existen. El coste son unos pocos bytes más por fila, y que renombrar una constante pasa a ser una migración de datos.

Respuesta de alerta: "Dejo el valor por defecto, funciona." — Funciona hasta que alguien reordena el enum; a partir de ahí las filas existentes apuntan a la constante equivocada sin ningún error, el tipo de corrupción que nadie nota hasta que los informes salen mal.

---

<a id="SB-J-040"></a>

**[SB-J-040] ¿Cuál es la diferencia entre `cascade = CascadeType.ALL` y `orphanRemoval = true`?** ⭐⭐

`cascade` propaga a los hijos las operaciones que hago sobre el padre — persist, merge, remove —, así que guardar o borrar un pedido guarda o borra también sus líneas; `orphanRemoval = true` borra un hijo en cuanto se saca de la colección del padre, aunque el padre no se borre. Las dos van en el `@OneToMany` del padre, y solo las combinaría cuando un hijo no tiene vida fuera de su padre, como las líneas de un pedido. El proyecto 07 no usa ninguna: sus entidades solo mapean el lado `@ManyToOne`, y una entrada de tiempo tiene que sobrevivir a su proyecto — borrar un proyecto solo lo desactiva —, así que propagar un borrado ahí eliminaría las horas ya registradas.

Respuesta de alerta: "Pongo `CascadeType.ALL` en todas las relaciones para no tener que guardar cada entidad." — En una relación donde el hijo tiene vida propia, un remove en cascada borra datos que querías conservar; una cascada afirma que el hijo pertenece al padre, y eso tiene que ser verdad.

---

<a id="SB-J-081"></a>

**[SB-J-081] ¿Cómo mapeas una relación muchos a muchos y por qué muchos equipos sustituyen `@ManyToMany` por una entidad intermedia explícita?** ⭐⭐

Con `@ManyToMany` en los dos lados: el lado propietario declara `@JoinTable` con la tabla intermedia y sus dos claves foráneas, y el otro lado apunta de vuelta con `mappedBy`, para que los dos campos describan una sola relación y no dos. Los equipos la sustituyen por una entidad propia en cuanto el vínculo lleva datos — una fecha, una cantidad, un estado —, porque una tabla intermedia simple solo guarda las dos claves, y el día que necesita una columna más tiene que convertirse en entidad de todas formas. El proyecto 07 es justo ese caso: usuarios y proyectos se relacionan muchos a muchos, y el vínculo es `TimeEntry`, una entidad con su propia fecha, sus horas y su estado y un `@ManyToOne` hacia cada lado.

```java
// illustrative — not from a project
@Entity
class Student {
    @ManyToMany
    @JoinTable(name = "student_course",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}

@Entity
class Course {
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

Respuesta de alerta: "Pongo `@ManyToMany` en las dos entidades y ya está." — Sin `mappedBy` en uno de los lados, Hibernate ve dos relaciones independientes y crea dos tablas intermedias, y un vínculo que más adelante necesita una columna te obliga a rehacer el mapeo.

---

<a id="SB-J-082"></a>

**[SB-J-082] ¿Tiene algún riesgo usar `@Data` de Lombok en una entidad JPA? ¿Qué usas en su lugar?** ⭐⭐

Sí, dos. Su `toString` incluye todos los campos, también las asociaciones, así que escribir una entidad en el log puede disparar la carga lazy o, con un mapeo bidireccional, entrar en recursión hasta desbordar la pila; y su `equals` y su `hashCode` usan todos los campos, así que cambian cada vez que cambia un campo y pueden cargar asociaciones lazy solo para comparar dos objetos. En el proyecto 07 las entidades llevan `@Getter`, `@Setter` y `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con solo el `id` incluido, y el `@ToString` de `TimeEntry` excluye `user` y `project`. La igualdad por id tiene su propia trampa: antes del primer guardado el id es `null`, así que dos entidades nuevas son iguales entre sí y el hash code cambia en cuanto se asigna el id; por eso una entidad sin guardar no debería ir a un `HashSet`.

```java
// projects/07-timetrack · TimeEntry.java
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user","project"})
// ...
@Entity
@Table(name = "time_entries")
public class TimeEntry {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;
```

Respuesta de alerta: "Pongo `@Data` en las entidades, ahorra código." — Es el error clásico de Lombok con JPA: una línea de log inocente puede lanzar consultas o un `StackOverflowError`, y un `HashSet` de entidades se comporta mal en cuanto cambia un campo.

---

<a id="SB-J-041"></a>

**[SB-J-041] ¿Qué es un soft delete y cuándo lo usarías en lugar de borrar la fila?** ⭐⭐

Un soft delete marca la fila como inactiva — `active = false` — en lugar de ejecutar un `DELETE`, así que la fila se queda y las consultas normales la filtran. Lo uso cuando los datos tienen un historial que debe sobrevivir: en el proyecto 07 borrar un proyecto solo lo desactiva, porque las entradas de tiempo ya registradas contra él siguen apuntándole a través de `project_id` y siguen contando en los informes, y un `DELETE` de verdad lo rechazaría esa clave foránea o, si saliera adelante, se llevaría el historial con él. El coste es que cada lectura tiene que acordarse del filtro: `ProjectRepository.findByActiveTrue` es la lista que ven los empleados, mientras que los managers siguen viendo los proyectos inactivos.

Respuesta de alerta: "Siempre llamo a `deleteById()`." — En una aplicación de negocio eso destruye el historial de auditoría o falla por las claves foráneas; el entrevistador quiere oír que has pensado en qué sigue apuntando a esa fila.

---

<a id="SB-J-039"></a>

**[SB-J-039] ¿Por qué tu entidad `User` necesita `@Table(name = "users")`?** ⭐

Porque `user` es una palabra reservada en PostgreSQL: por defecto la tabla tomaría el nombre de la entidad, `user`, y el `CREATE TABLE` y todas las consultas sobre ella fallarían con un error de sintaxis salvo que el nombre se escribiera entre comillas. `@Table(name = "users")` le da un nombre explícito, y en el proyecto 07 todas las tablas siguen la misma convención — en plural y en minúsculas: `users`, `projects`, `time_entries` —, que esquiva las palabras reservadas y se lee de forma coherente.

> **Consejo de entrevista:** preséntalo como una trampa propia de PostgreSQL — "`user` es reservada" — y menciona las dos alternativas que no elegiste: poner el identificador entre comillas o una estrategia de nombres global.

---

<a id="SB-J-083"></a>

**[SB-J-083] Tu `@Query` que ejecuta un `UPDATE` falla en tiempo de ejecución. ¿Qué falta?** ⭐

`@Modifying`: sin ella, Spring Data ejecuta la consulta como una lectura y espera filas de vuelta, así que un `UPDATE` o un `DELETE` falla; con ella, el método devuelve el número de filas modificadas. También necesita una transacción activa — `@Transactional` en el método de servicio que la llama —, o falla por no tenerla. Y la sentencia va directa a la base de datos, saltándose el contexto de persistencia, así que una entidad ya cargada en esa transacción conserva sus valores antiguos salvo que ponga `clearAutomatically = true`. El proyecto 07 todavía no tiene ninguna actualización masiva — cada cambio carga la entidad y deja que el dirty checking lo escriba —, así que no es algo que haya escrito ahí.

```java
// illustrative — not from a project
@Modifying(clearAutomatically = true)
@Query("UPDATE User u SET u.active = false WHERE u.id IN :ids")
int deactivateAll(@Param("ids") Collection<Long> ids);
```

Respuesta de alerta: "Le añado `nativeQuery = true`." — El lenguaje de la consulta no es el problema: JPQL o nativa, una consulta de escritura necesita `@Modifying` y una transacción, y una nativa además pierde la comprobación al arrancar.

---
## Seguridad y JWT

<a id="SB-J-042"></a>

**[SB-J-042] ¿Qué es un JWT y cómo funciona con él la autenticación sin estado en tu API Spring Boot?** ⭐⭐⭐

Un JWT es un token firmado en tres partes codificadas en Base64url — una cabecera, un payload con los claims y una firma — que el servidor emite en el login y que el cliente devuelve en cada petición, así que el servidor sabe quién llama sin guardar ninguna sesión. En el proyecto 07 la aplicación Angular envía el email y la contraseña a `POST /api/auth/login`, `AuthService` los comprueba a través del `AuthenticationManager` y responde con un token firmado con el secreto del servidor; a partir de ahí, el `authInterceptor` de Angular lo añade como `Authorization: Bearer <token>` a cada llamada, y en cada petición `JwtFilter` verifica la firma y la caducidad, carga el usuario que nombra el token y lo deja en el `SecurityContextHolder`, donde lo leen las reglas de URL y `@PreAuthorize`. El servidor no guarda nada del login entre una petición y otra: cada una trae su propia prueba.

> **Consejo de entrevista:** cuéntalo como un ciclo — "haces login una vez, recibes un token firmado, lo envías en cada petición, un filtro lo verifica y fija el usuario" — y añade que firmado no es cifrado: cualquiera puede decodificar el payload, así que nunca lleva nada secreto.

---

<a id="SB-J-043"></a>

**[SB-J-043] ¿Qué es Spring Security y cómo proteges una API REST con él?** ⭐⭐⭐

Spring Security es una cadena de filtros de servlet que se ejecuta antes que cualquier controlador y decide quién llama y si puede hacer esa petición; esa cadena la configuro declarando un bean `SecurityFilterChain`. En el `SecurityConfig` del proyecto 07 ese bean desactiva CSRF y la sesión porque la API no guarda estado, conecta la política de CORS, declara una sola regla pública — `POST /api/auth/login` — antes de `anyRequest().authenticated()`, manda las peticiones sin autenticar a mi `JwtAuthenticationEntryPoint` para que reciban un 401 en JSON y añade `JwtFilter` antes de `UsernamePasswordAuthenticationFilter`; las reglas por rol viven en los métodos de los controladores como `@PreAuthorize`, que activa `@EnableMethodSecurity`. No hay ningún endpoint público de registro — las cuentas las crea un manager con `POST /api/users` —, así que todo salvo el login necesita un token.

```java
// projects/07-timetrack · SecurityConfig.java
return http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        // ... .cors(...)
        .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .anyRequest().authenticated()
        )
        // ... .exceptionHandling(...) con el entry point del 401
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
```

> **Consejo de entrevista:** empieza por "una cadena de filtros delante de los controladores" y luego recorre el bean en orden: CSRF, sesión, CORS, reglas, entry point y tu filtro. Añade lo de denegar por defecto: el `authenticated()` final protege un endpoint que se añada mañana sin que nadie tenga que acordarse, y la regla pública nombra el método y la ruta exacta, así que no abre nada más.

---

<a id="SB-J-044"></a>

**[SB-J-044] ¿Cuál es la diferencia entre autenticación y autorización?** ⭐⭐⭐

La autenticación es demostrar quién eres; la autorización es decidir qué puede hacer esa identidad. En el proyecto 07 la autenticación ocurre de dos formas — el login comprueba el email y la contraseña una vez y, a partir de ahí, `JwtFilter` reconoce a quien llama por su token en cada petición —, y la autorización viene después: `@PreAuthorize("hasRole('MANAGER')")` hace que solo los managers puedan aprobar o rechazar entradas de tiempo, así que a un EMPLOYEE que lo intente se le rechaza. Una autenticación fallida es un 401; una autorización fallida, un 403.

> **Consejo de entrevista:** una línea para cada una — "autenticación: ¿quién eres? autorización: ¿puedes hacer esto?" — y luego un ejemplo real de cada una sacado de tu proyecto y el código de estado que devuelve cada fallo.

---

<a id="SB-J-045"></a>

**[SB-J-045] ¿Cómo guardas las contraseñas de los usuarios y por qué nunca en texto plano?** ⭐⭐⭐

Como un hash BCrypt, nunca la contraseña en sí: `SecurityConfig` publica un bean `PasswordEncoder` que es un `BCryptPasswordEncoder`, `UserService` guarda `passwordEncoder.encode(...)` cuando un manager crea una cuenta o resetea una contraseña, o cuando un usuario cambia la suya, y en el login Spring Security comprueba la contraseña recibida con `passwordEncoder.matches(...)`; nada compara los strings ni intenta revertir el hash. Si la tabla se filtra, una columna en texto plano entrega todas las cuentas de golpe; un hash BCrypt no se puede revertir, lleva su propia sal aleatoria, así que dos contraseñas iguales se guardan distintas, y es lento a propósito, así que probar contraseñas contra un hash robado sale caro.

```java
// projects/07-timetrack · SecurityConfig.java y UserService.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

newUser.setPassword(passwordEncoder.encode(generatedPassword));
```

Respuesta de alerta: "La hasheo con SHA-256, que es de un solo sentido." — Un hash rápido está pensado para calcularse miles de millones de veces por segundo, que es justo lo que necesita un ataque de fuerza bruta, y sin sal dos contraseñas iguales comparten hash; las contraseñas necesitan un algoritmo lento y con sal como BCrypt.

---

<a id="SB-J-046"></a>

**[SB-J-046] ¿Por qué elegiste JWT en lugar de sesiones del lado del servidor?** ⭐⭐⭐

Porque el proyecto 07 es una API REST que consume una aplicación Angular separada, y un JWT permite que cada petición lleve su propia prueba de identidad: el servidor no guarda ninguna sesión, así que cualquier instancia puede verificar el token solo con el secreto, y la API no depende de que una cookie viaje entre dos orígenes. Una sesión en el servidor es más fácil de cerrar — borrarla en el servidor desconecta al usuario al instante —, pero guarda estado en la memoria de la API, necesita un almacén compartido en cuanto hay dos instancias y, como viaja en una cookie, trae consigo el CSRF. El precio que acepté es la revocación: un token sigue siendo válido hasta que caduca, y por eso el mío dura una hora y el filtro comprueba en cada petición que la cuenta sigue activa.

Respuesta de alerta: "JWT es más moderno y más seguro." — Ninguna de las dos cosas es un motivo: el argumento es no guardar estado y tener un cliente separado, y un candidato que no menciona que un JWT no se puede revocar antes de que caduque no ha visto lo que cuesta la decisión.

---

<a id="SB-J-047"></a>

**[SB-J-047] ¿Por qué desactivas la protección CSRF en una API JWT sin estado?** ⭐⭐

Porque el CSRF se aprovecha de las credenciales que el navegador adjunta por su cuenta — una cookie de sesión viaja con cualquier petición al sitio, aunque la lance una página maliciosa — y mi API no tiene ninguna: el JWT va en la cabecera `Authorization`, que solo pone mi código Angular, así que una petición falsificada desde otro sitio llega sin él y se rechaza con un 401. Si la dejara activa, la protección CSRF exigiría un token CSRF en cada POST, PUT, PATCH y DELETE que mi aplicación Angular no envía, así que en el proyecto 07 `SecurityConfig` la desactiva con `.csrf(AbstractHttpConfigurer::disable)`. La decisión depende de por dónde viaja la credencial: si pasara el token a una cookie, la protección CSRF tendría que volver.

Respuesta de alerta: "La desactivé porque lo hacía el tutorial y mis POST devolvían 403." — Apagar una protección para que desaparezca un error, sin explicar por qué el ataque no aplica, es justo lo que evalúa la pregunta; el motivo es que ninguna credencial viaja en una cookie.

---

<a id="SB-J-048"></a>

**[SB-J-048] ¿Cómo restringes un endpoint a un rol: con una regla de URL o con `@PreAuthorize`?** ⭐⭐

Las dos funcionan. Una regla de URL en el `SecurityFilterChain` — `requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("MANAGER")` — rechaza la petición en la cadena de filtros antes de llegar a ningún controlador, mientras que `@PreAuthorize("hasRole('MANAGER')")` en el método del controlador lo comprueba la seguridad de métodos justo antes de ejecutarlo, y se ignora en silencio si `@EnableMethodSecurity` no está activado. En el proyecto 07 elegí `@PreAuthorize` para todas las reglas por rol — `DELETE /api/users/{id}` y aprobar o rechazar una entrada son solo para MANAGER; crear y enviar entradas, solo para EMPLOYEE — porque la regla queda junto al endpoint que protege, y la cadena se queda solo con la parte gruesa: el login público y todo lo demás autenticado. Las dos comprobaciones son independientes, así que una petición tiene que pasar ambas.

```java
// projects/07-timetrack · UserController.java
@PreAuthorize("hasRole('MANAGER')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
```

Respuesta de alerta: "Oculto el botón de borrar a los empleados en Angular." — Eso es experiencia de usuario, no seguridad: cualquiera puede llamar a la API con Postman, así que la comprobación del rol tiene que estar en el servidor, en cada endpoint protegido.

---

<a id="SB-J-049"></a>

**[SB-J-049] ¿Dónde guardas el secreto con el que firmas los JWT y por qué no en el código?** ⭐⭐

En una variable de entorno: el `application.properties` del proyecto 07, que sí se sube al repositorio, solo contiene `app.jwt.secret=${JWT_SECRET}`, sin valor por defecto, y `JwtUtil` recibe el valor con `@Value("${app.jwt.secret}")`. Quien tenga ese secreto puede firmar tokens que la API aceptará — un token que diga ser cualquier usuario, un manager incluido —, así que un secreto escrito en el código quedaría en el historial de git para cualquiera con acceso al repositorio. Sin valor por defecto, la aplicación se niega a arrancar si falta la variable en lugar de funcionar con una clave vacía, y el valor en sí tiene que ser largo y aleatorio: `Keys.hmacShaKeyFor` rechaza una clave de menos de 256 bits, y sacar del código una contraseña débil no la hace fuerte.

Respuesta de alerta: "Lo pongo en `application.properties`, así no está en el código." — Un fichero de propiedades que se sube al repositorio está en git igual que el código; y el peligro no es que alguien lea los tokens — cualquiera puede decodificarlos —, sino que pueda falsificarlos.

---

<a id="SB-J-050"></a>

**[SB-J-050] ¿Qué hay dentro de un JWT y cómo lo construye tu `generateToken()`?** ⭐⭐

Tres partes en Base64url separadas por puntos: una cabecera que nombra el algoritmo de firma, un payload con los claims y una firma sobre las dos. En el proyecto 07 el payload lleva tres claims estándar — `sub`, el id del usuario; `iat`, cuándo se emitió; y `exp`, una hora después, porque `app.jwt.expiration` vale 3600000 milisegundos —, y `JwtUtil.generateToken` los construye con jjwt y los firma con una clave HMAC derivada del secreto. El sujeto es el id y no el email a propósito, porque un manager puede cambiar el email de un usuario y el token tiene que seguir apuntando a la misma cuenta; y el rol no va en el token, porque el filtro carga el usuario en cada petición y saca el rol de la base de datos.

```java
// projects/07-timetrack · JwtUtil.java
public String generateToken(Long userId) {
    return Jwts.builder()
            .subject(String.valueOf(userId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
}
```

> **Consejo de entrevista:** nombra los tres claims y para qué sirve cada uno, y luego di que el payload solo está codificado, no cifrado — pegas un token en un decodificador y lo lees —, así que identifica al usuario pero nunca lleva una contraseña ni nada secreto.

---

<a id="SB-J-051"></a>

**[SB-J-051] ¿Cuál es la diferencia entre 401 Unauthorized y 403 Forbidden, y cuándo devuelve cada uno Spring Security?** ⭐⭐

El 401 significa que la API no sabe quién llama — no hay token, ha caducado o la firma no es válida — y el 403, que sabe perfectamente quién es y que ese usuario no puede hacer eso. En el proyecto 07 una petición sin un token válido la para el `anyRequest().authenticated()` de la cadena, y mi `JwtAuthenticationEntryPoint` le responde con un 401 en el formato de error JSON de la API; un EMPLOYEE que llama a `PATCH /api/entries/{id}/approve` está autenticado pero no pasa el `@PreAuthorize("hasRole('MANAGER')")`, y `GlobalExceptionHandler` convierte la `AccessDeniedException` resultante en un 403. Sin ese entry point, una API sin estado y sin formulario de login responde por defecto con un 403 a una petición sin token, y el interceptor de Angular, que cierra la sesión del usuario ante un 401, no podría distinguir una sesión caducada de una acción prohibida.

> **Consejo de entrevista:** "401: ¿quién eres? 403: sé quién eres, y la respuesta es no." Luego di dónde se produce cada uno — el entry point de la cadena de filtros para el 401, la seguridad de métodos o una regla de URL para el 403 —, porque es donde miras cuando te llega el que no esperabas.

---

<a id="SB-J-052"></a>

**[SB-J-052] ¿Qué es `UserDetailsService` y por qué lo implementas?** ⭐⭐

Es la interfaz de Spring Security con un solo método, `loadUserByUsername`, con la que el framework le pide un usuario a mi aplicación: yo la implemento y es Spring quien la llama, nunca yo. En el proyecto 07 `UserDetailsServiceImpl` busca el usuario por el email normalizado y devuelve un `UserDetails` con el email, el hash BCrypt, el rol a través de `.roles(...)` y `disabled` cuando la cuenta está inactiva; en el login, `AuthService` llama al `AuthenticationManager`, cuyo `DaoAuthenticationProvider` llama a mi método y después comprueba la contraseña con el `PasswordEncoder`. Añadí un segundo método, `loadUserById`, para `JwtFilter`, porque el token identifica al usuario por su id.

> **Consejo de entrevista:** di "yo lo implemento y Spring lo llama", y luego recorre el login: `AuthenticationManager` → provider → `loadUserByUsername` → `PasswordEncoder.matches`. El "username" es lo que identifique a tus usuarios; en el proyecto 07, el email.

---

<a id="SB-J-053"></a>

**[SB-J-053] ¿Qué hace `SessionCreationPolicy.STATELESS` en tu `SecurityFilterChain`?** ⭐⭐

Le dice a Spring Security que no cree nunca una `HttpSession` ni use una para recordar quién ha iniciado sesión, así que una autenticación solo existe para la petición en curso y cada petición tiene que volver a demostrarla. En el proyecto 07 esa prueba es el JWT: `JwtFilter` reconstruye la autenticación a partir del token en cada petición, y sin sesión no hay cookie `JSESSIONID`, ni estado por usuario en la memoria del servidor, ni nada que compartir si la API corriera en dos instancias. Sin ella, la política por defecto deja que el framework cree una sesión cuando la necesita — para guardar la petición que interrumpió un 401, por ejemplo —, así que aparecen cookies de sesión y estado por usuario en una API que no debería guardar ninguno.

> **Consejo de entrevista:** "sin estado significa que cada petición demuestra quién es"; júntalo con el filtro JWT, que es quien hace esa comprobación, y añade que sin sesión tampoco hay cookie de sesión, que es parte de por qué desactivar CSRF es seguro aquí.

---

<a id="SB-J-054"></a>

**[SB-J-054] Una vez que has emitido un JWT, ¿puedes invalidarlo antes de que caduque?** ⭐⭐

El token en sí, no: el servidor no guarda ningún registro de él, así que un token bien firmado pasa la verificación hasta su `exp`, y cerrar sesión en Angular solo borra la copia del navegador; cualquier otro que lo tenga puede seguir usándolo. Lo que sí puedo hacer es limitar el daño: en el proyecto 07 los tokens duran una hora, y `JwtFilter` carga el usuario en cada petición y ejecuta `AccountStatusUserDetailsChecker`, así que un manager que desactiva una cuenta corta el token que ese usuario ya tenía en su siguiente petición, sin esperar a que caduque. Revocar un token concreto exigiría estado en el servidor — una lista de ids de token revocados, o tokens de acceso cortos con refresh tokens —, lo que trae de vuelta lo que JWT evita, así que solo lo añadiría cuando el producto lo necesitara.

Respuesta de alerta: "Sí, cuando el usuario cierra sesión borro el token." — Eso borra una copia en un navegador; el token sigue siendo válido en el servidor hasta que caduca, que es el trade-off de los tokens sin estado que se espera que conozca un candidato.

---

<a id="SB-J-084"></a>

**[SB-J-084] ¿En qué punto del recorrido de la petición se valida el JWT y por qué tu filtro extiende `OncePerRequestFilter`?** ⭐⭐

En un filtro propio dentro de la cadena de Spring Security, antes de cualquier controlador: `SecurityConfig` añade `JwtFilter` antes de `UsernamePasswordAuthenticationFilter`, así que cuando se ejecutan las reglas de autorización el usuario ya está en el `SecurityContextHolder`. Extiende `OncePerRequestFilter` para que la comprobación se ejecute exactamente una vez por petición, aunque la petición se vuelva a despachar internamente por un error o un forward. Dentro, lee la cabecera `Bearer` y saca del token el id del usuario — al parsearlo con el secreto ya se comprueban la firma y la caducidad —; después carga ese usuario, comprueba que la cuenta sigue activa y guarda un `UsernamePasswordAuthenticationToken` de tres argumentos — el que lleva authorities, que significa autenticado —; si algo falla no guarda nada y deja seguir la petición, y el entry point responde con un 401.

```java
// projects/07-timetrack · JwtFilter.java
Long userId = jwtUtil.extractUserId(token);
if (SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsService.loadUserById(userId);
    if (jwtUtil.isValid(token, userId)) {
        accountStatusUserDetailsChecker.check(userDetails);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
```

> **Consejo de entrevista:** recórrelo en pasos numerados — cabecera, token, usuario, comprobaciones, contexto de seguridad, `filterChain.doFilter` — y recalca que el filtro nunca escribe el error él mismo: deja sin autenticar la petición mala y deja que la cadena la rechace, así que un token roto falla cerrado.

---

<a id="SB-J-085"></a>

**[SB-J-085] ¿Cómo obtienes el usuario autenticado dentro de un controlador o de un servicio?** ⭐⭐

Del `SecurityContextHolder`, donde el filtro JWT guardó la autenticación de esta petición: `getContext().getAuthentication()` me da el principal, y su nombre es el email del usuario. En el proyecto 07 lo envolví en un único componente, `AuthenticatedUserProvider`, cuyo `currentUser()` carga la entidad `User` por ese email y cuyo `isManager()` comprueba las authorities, así que servicios como `TimeEntryService` le preguntan a él quién llama. En un controlador, Spring también puede inyectar el principal como parámetro del método con `@AuthenticationPrincipal UserDetails user`, lo que evita meter la mano en el holder estático; no lo he usado en el proyecto 07, porque ahí quienes necesitan el usuario actual son los servicios, no los controladores.

```java
// projects/07-timetrack · AuthenticatedUserProvider.java
public User currentUser() {
    String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
    return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
}
```

> **Consejo de entrevista:** nombra las dos formas — el holder, que funciona en cualquier punto del hilo de la petición, y `@AuthenticationPrincipal` para un parámetro del controlador — y di por qué la identidad sale de ahí y no de la petición: un cliente puede mandar el id de usuario que quiera, pero no puede cambiar lo que verificó el filtro.

---

<a id="SB-J-055"></a>

**[SB-J-055] Tu filtro JWT rechaza tokens válidos — ¿qué compruebas primero?** ⭐

Lo primero, el código de estado: un 403 significa que el token se aceptó y el problema es el rol, mientras que un 401 apunta al filtro; y luego el log dice por qué, porque en el proyecto 07 `JwtFilter` captura las excepciones del parser y de la búsqueda del usuario y escribe `Authentication rejected:` con el mensaje: un token caducado, una firma que no coincide, un usuario desconocido, una cuenta desactivada. Después, las causas habituales: la cabecera tiene que ser exactamente `Bearer ` seguido del token, o el filtro la ignora sin escribir nada en el log y la petición llega como anónima; el token tiene que estar firmado con el mismo `JWT_SECRET` con el que corre ahora la API, así que un secreto distinto entre entornos invalida todos los tokens que emitió el otro; y no puede haber pasado su caducidad de una hora.

Respuesta de alerta: "Subo la caducidad a unos cuantos días." — Trata el síntoma sin leer por qué se rechazó el token — con un secreto equivocado o una cuenta desactivada seguiría fallando — y un token de larga duración amplía el tiempo durante el que se puede usar uno robado.

---

<a id="SB-J-086"></a>

**[SB-J-086] `@PreAuthorize("hasRole('MANAGER')")` devuelve 403 aunque el rol del usuario en la base de datos es `MANAGER`. ¿Qué está pasando?** ⭐

Casi seguro que es el prefijo: `hasRole('MANAGER')` no busca `MANAGER`, busca la authority `ROLE_MANAGER`, así que si el `UserDetails` se construyó con el nombre del rol a secas — `new SimpleGrantedAuthority("MANAGER")` — el usuario está autenticado y aun así no pasa la comprobación. En el proyecto 07 `UserDetailsServiceImpl` construye las authorities con el `.roles(user.getRole().name())` del builder, que añade `ROLE_` por mí, y el único sitio que compara el string a mano, `AuthenticatedUserProvider.isManager()`, lo compara con `"ROLE_" + Role.MANAGER.name()`. La solución es que lo que se guarda y lo que se comprueba coincidan: guardar `ROLE_MANAGER`, o comprobar con `hasAuthority('MANAGER')`, que compara el string literalmente.

```java
// projects/07-timetrack · UserDetailsServiceImpl.java
return org.springframework.security.core.userdetails.User
        .withUsername(user.getEmail())
        .password(user.getPassword())
        .roles(user.getRole().name())   // MANAGER → authority ROLE_MANAGER
        .disabled(!user.isActive())
        .build();
```

Respuesta de alerta: "El rol estará mal en la base de datos, así que cambiaría los datos del usuario." — Los datos están bien; el desajuste está entre cómo se construye la authority y cómo la compara `hasRole`, y ningún cambio en la fila del usuario arregla el código que construye las authorities.

---
## Gestión de excepciones

<a id="SB-J-056"></a>

**[SB-J-056] ¿Cómo gestionas las excepciones de forma global en una API REST con Spring Boot?** ⭐⭐⭐

Con una sola clase anotada con `@RestControllerAdvice` cuyos métodos `@ExceptionHandler` recogen cada uno un tipo de excepción y lo convierten en un código de estado y un cuerpo JSON, así que los controladores y los servicios solo lanzan. En el proyecto 07 esa clase es `GlobalExceptionHandler`: `ResourceNotFoundException` se convierte en un 404, `DuplicateResourceException` e `InvalidStateTransitionException` en un 409, un `@Valid` que falla en un 400 con los errores por campo, `AccessDeniedException` en un 403, y un último handler para `RuntimeException` responde 500 con un mensaje genérico; todos con el mismo cuerpo `ErrorResponse`: timestamp, status, error, message y los errores por campo cuando los hay. Cuando varios handlers podrían encajar, Spring elige aquel cuyo tipo declarado está más cerca de la excepción lanzada, así que los handlers específicos ganan al de `RuntimeException`.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildError(HttpStatus.NOT_FOUND, e.getMessage()));
    }
    // ... un handler por tipo de excepción, y uno para RuntimeException como respaldo del 500
}
```

> **Consejo de entrevista:** resúmelo como "los controladores lanzan y un único advice traduce", y luego da dos o tres mapeos reales con su código de estado y lo que ganas: ningún try/catch en los métodos de los controladores y un solo formato de error para toda la API. La repregunta habitual es qué handler gana cuando encajan varios: el del tipo de excepción más específico, no el orden de los métodos en la clase.

---

<a id="SB-J-087"></a>

**[SB-J-087] Cuando falla el `@Valid` del cuerpo de una petición, ¿qué recibe el cliente y cómo devuelves los errores por campo en un 400 limpio?** ⭐⭐

Spring lanza `MethodArgumentNotValidException` antes de que se ejecute mi método. Con el comportamiento por defecto del framework, el cliente recibe un 400, pero con el cuerpo de error genérico de Boot — timestamp, status, error y path — y sin ninguno de los mensajes por campo que Angular necesita para mostrarlos debajo de cada input. Por eso en el proyecto 07 lo gestiona `GlobalExceptionHandler`: lee los `FieldError` del `BindingResult` de la excepción, agrupa sus mensajes por nombre de campo y devuelve un 400 cuyo `fieldErrors` es, por ejemplo, `{"email": ["Must be a valid email address"]}`, dentro del mismo `ErrorResponse` que usan todos los demás errores.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
    Map<String, List<String>> errors = e.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.groupingBy(
                    FieldError::getField,
                    Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
            ));
    ErrorResponse errorResponse = buildError(HttpStatus.BAD_REQUEST, "Validation failed");
    errorResponse.setFieldErrors(errors);
    return ResponseEntity.badRequest().body(errorResponse);
}
```

> **Consejo de entrevista:** nombra primero la excepción y luego di qué le falta al cuerpo por defecto y qué añade el tuyo: una lista de mensajes por campo, para que el frontend pueda mostrar cada error junto a su input.

---

<a id="SB-J-057"></a>

**[SB-J-057] ¿Cómo diseñas las excepciones propias de tu API y por qué extienden `RuntimeException`?** ⭐⭐

Una excepción por cada tipo de fallo, con el nombre de lo que ha ido mal y no de un código de estado: en el proyecto 07 hay, entre otras, `ResourceNotFoundException`, `DuplicateResourceException`, `InvalidStateTransitionException`, `BusinessRuleViolationException` y `ForbiddenOperationException`, que `GlobalExceptionHandler` convierte en 404, 409, 409, 400 y 403; así el servicio dice qué ha pasado y el advice decide cómo lo cuenta HTTP. Extienden `RuntimeException` por dos motivos: ningún método entre el servicio y el advice tiene que declararlas con `throws`, y `@Transactional` solo hace rollback por defecto con las excepciones no comprobadas, así que una excepción de negocio comprobada dejaría que la transacción confirmara lo que ya había escrito. Cuando el mensaje corresponde a un input concreto, la excepción lleva el campo: `DuplicateResourceException("email", ...)` permite que un único handler coloque el mensaje en `fieldErrors.email`.

Respuesta de alerta: "Lanzo `new RuntimeException("not found")` en todas partes y miro el mensaje en el handler." — Entonces el handler solo puede distinguir los fallos analizando texto, así que todos acaban con el mismo código de estado, y cambiar la redacción de un mensaje rompe el mapeo sin que nadie se entere; un tipo propio es lo que da a cada fallo su código de estado.

---

<a id="SB-J-088"></a>

**[SB-J-088] ¿`@ControllerAdvice` o `@RestControllerAdvice`? ¿Cuál usas en una API REST y por qué?** ⭐⭐

`@RestControllerAdvice`, que es `@ControllerAdvice` más `@ResponseBody`: lo que devuelve un handler lo escribe Jackson como JSON, igual que hace `@RestController` con los controladores. Con un `@ControllerAdvice` a secas, un handler que devuelve un objeto como mi `ErrorResponse` haría que Spring buscara una vista que renderizar, salvo que el método lleve `@ResponseBody` o devuelva un `ResponseEntity`, cuyo cuerpo se escribe siempre. En el proyecto 07 `GlobalExceptionHandler` es un `@RestControllerAdvice` y todos sus handlers devuelven `ResponseEntity<ErrorResponse>`, así que funcionaría de las dos formas; mantengo la variante REST porque deja claro que este advice sirve a una API JSON, y un handler que se añada más adelante devolviendo un objeto a secas seguirá respondiendo con JSON.

Respuesta de alerta: "No hay diferencia, son intercambiables." — Solo mientras todos los handlers devuelvan un `ResponseEntity`; un handler que devuelve un objeto a secas dentro de un `@ControllerAdvice` pone a Spring a buscar una vista, y el cliente recibe un error en lugar del cuerpo JSON.

---

<a id="SB-J-089"></a>

**[SB-J-089] ¿Cuándo pondrías `@ResponseStatus` en una excepción propia en lugar de mapearla en un `@ExceptionHandler`?** ⭐⭐

Cuando lo único que necesito es el código de estado: `@ResponseStatus(HttpStatus.NOT_FOUND)` en la clase de la excepción hace que Spring responda con ese código cada vez que la excepción sale de un controlador, sin ningún handler; pero el cuerpo es el de error por defecto de Boot, que por defecto ni siquiera incluye el mensaje. En el proyecto 07 lo mapeé todo en `GlobalExceptionHandler`, porque la API promete un único formato `ErrorResponse` con el mensaje y, en algunos errores, `fieldErrors`, y Angular los lee. Mezclar las dos cosas ahí sería además una trampa: los métodos `@ExceptionHandler` se consultan antes que la anotación de la excepción, así que una excepción nueva que solo llevara `@ResponseStatus` la recogería mi handler de respaldo de `RuntimeException` y volvería como un 500. Para un código puntual en el sitio donde se lanza existe `ResponseStatusException`, que espero encontrarme en código ya existente; no he usado ninguna de las dos en el proyecto 07.

```java
// illustrative — not from a project
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProjectNotFoundException extends RuntimeException { /* ... */ }

throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
```

Respuesta de alerta: "Hacen lo mismo, así que pongo `@ResponseStatus` en todas las excepciones y me ahorro el advice." — Eso renuncia al cuerpo de error de la API: el cliente recibe el cuerpo genérico de Boot sin el mensaje ni los errores por campo, y si hay un handler genérico en un advice, la anotación ni siquiera llega a aplicarse.

---

<a id="SB-J-090"></a>

**[SB-J-090] Un manager crea un usuario con un email que ya existe y la API responde 500 con una `DataIntegrityViolationException` en el log. ¿Qué debería devolver y dónde lo gestionas?** ⭐⭐

Un 409 Conflict que nombre el campo — la petición es válida, pero choca con datos que ya existen —, y el sitio donde decidirlo es el servicio, que sabe qué significa ese choque. En el proyecto 07 `UserService.create`, detrás de `POST /api/users`, comprueba primero `existsByEmail` y lanza `DuplicateResourceException("email", "Email already in use")`, que `GlobalExceptionHandler` convierte en un 409 con `fieldErrors.email`. La comprobación sola no basta, porque dos peticiones pueden pasarla a la vez; entonces la restricción `unique` de la columna email frena la segunda, así que guardo con `saveAndFlush` dentro de un `try` — el INSERT se ejecuta ahí y no en el commit — y traduzco esa `DataIntegrityViolationException` a la misma excepción. El advice también convierte en 409 cualquier `DataIntegrityViolationException` que se escape, pero solo como red gruesa: respondería "A resource with this value already exists" también a una violación de not-null, así que el mensaje preciso tiene que salir del servicio.

```java
// projects/07-timetrack · UserService.java
if (userRepository.existsByEmail(email)) {
    throw new DuplicateResourceException("email", "Email already in use");
}
// ...
try {
    User saved = userRepository.saveAndFlush(newUser);
    // ... construye la respuesta con la contraseña generada
} catch (DataIntegrityViolationException e) {
    throw new DuplicateResourceException("email", "Email already in use");
}
```

Respuesta de alerta: "Compruebo `existsByEmail` antes de guardar, así que no puede pasar." — La comprobación y el INSERT son dos pasos separados, así que dos peticiones simultáneas pueden pasarla las dos; lo único definitivo es la restricción de la base de datos, y su excepción hay que traducirla a un 409 en lugar de dejar que acabe en un 500.

---

<a id="SB-J-091"></a>

**[SB-J-091] Tu handler genérico de excepciones le devuelve al cliente `e.getMessage()`, o la traza completa. ¿Qué tiene de malo y qué debería hacer en su lugar?** ⭐⭐

Al handler de respaldo llegan los fallos que nadie había previsto, y sus mensajes están escritos para desarrolladores: un error de SQL con nombres de tablas y restricciones, un nombre de clase, una ruta de fichero; detalles que le cuentan a un atacante cómo está construido el sistema y que al usuario no le sirven para nada. El respaldo debería escribir la excepción entera en el log del servidor y mandarle al cliente un cuerpo fijo y genérico. En el proyecto 07 es el último handler de `GlobalExceptionHandler`: recoge `RuntimeException`, la escribe en el log con `log.error`, traza incluida, y responde 500 con "Internal server error" en el `ErrorResponse` de siempre; las excepciones cuyo mensaje sí está escrito para el cliente, como `ResourceNotFoundException`, tienen sus propios handlers, que Spring prefiere porque su tipo es más específico. El propio `/error` de Boot toma la misma decisión: deja fuera el mensaje y la traza salvo que se activen las propiedades `server.error.include-*`.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    log.error("Unhandled exception", e);
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}
```

Respuesta de alerta: "Devolver el mensaje real ayuda al frontend a depurar." — La depuración va en el log del servidor, que guarda la traza completa; la respuesta le llega a cualquiera que llame, también a un atacante, y el mensaje crudo de una excepción puede dejar ver SQL, nombres de clases o datos.

---

<a id="SB-J-059"></a>

**[SB-J-059] ¿Cuál es la diferencia entre `MethodArgumentNotValidException` y `ConstraintViolationException`?** ⭐

Vienen de tipos de validación distintos. `MethodArgumentNotValidException` se lanza cuando falla un objeto `@Valid @RequestBody`, con un `FieldError` por cada propiedad del DTO que incumple una regla. Una restricción puesta directamente en un parámetro del método — `@RequestParam @Min(1) int page` — es validación de método: desde Spring 6.1, Spring MVC la ejecuta por su cuenta y lanza `HandlerMethodValidationException`, mientras que la forma antigua, `@Validated` en la clase del controlador, la ejecuta a través de un proxy y lanza `ConstraintViolationException`, que es lo que todavía gestionan muchos proyectos ya existentes. Cada una necesita su propio handler. El proyecto 07 solo valida cuerpos de petición — sus parámetros de consulta solo se comprueban por tipo, y un valor erróneo como `status=FOO` recibe un 400 del handler de `MethodArgumentTypeMismatchException` —, así que si añadiera restricciones en los parámetros añadiría también su handler, porque si no mi respaldo de `RuntimeException` convertiría sus fallos en un 500.

> **Consejo de entrevista:** relaciona cada excepción con dónde está la restricción — en los campos del DTO o en los parámetros del método — y di que cada una necesita su propio handler. Nombrar `HandlerMethodValidationException` demuestra que conoces el Spring actual, no solo los tutoriales antiguos.

---
## Transacciones

<a id="SB-J-092"></a>

**[SB-J-092] Los métodos de los repositorios de Spring Data ya son transaccionales. ¿Por qué sigues poniendo `@Transactional` en los métodos de tus servicios?** ⭐⭐

Porque un método del repositorio como `save` es transaccional, pero solo por su cuenta: cada llamada abre y confirma su propia transacción. Así que, si un método de servicio sin la anotación guarda dos veces, el primer guardado queda confirmado aunque falle el segundo, y, con `open-in-view` desactivado como en el proyecto 07, una entidad que carga ya está desconectada (detached) en la línea siguiente. En el método del servicio, `@Transactional` convierte todo el caso de uso en una sola transacción a la que se unen las llamadas al repositorio, así que se confirma o se revierte entero. En el proyecto 07 esto salió justo en una revisión de código, y desde entonces todos los métodos de escritura de los servicios lo llevan; `TimeEntryService.approve`, por ejemplo, carga la entrada, comprueba su dueño y su estado, la cambia y la convierte con `toResponse`, y esa conversión puede cargar el `user` y el `project` lazy solo porque la transacción sigue abierta.

Respuesta de alerta: "El repositorio ya es transaccional, así que el servicio no lo necesita." — Cada `save` hace commit por su cuenta, así que un caso de uso con dos escrituras no es atómico: un fallo a mitad deja la primera escritura en la base de datos.

---

<a id="SB-J-060"></a>

**[SB-J-060] ¿Qué hace `@Transactional(readOnly = true)` y por qué lo pones en tus métodos de lectura?** ⭐⭐

Declara que la transacción no va a escribir. Spring se lo pasa a Hibernate, que entonces no hace nunca flush de la sesión por su cuenta ni guarda una copia del estado de las entidades que carga, así que no hay dirty checking en el commit y cada petición gasta menos memoria; Spring también le pasa el indicador a la conexión JDBC, pero lo que haga la base de datos con él depende del driver, así que es una pista, no una garantía de que se rechace una escritura. En el proyecto 07 todos los métodos de servicio que solo leen — entre ellos `getAll` y `getById` de `ProjectService`, `TimeEntryService.findByFilter` y los tres informes de `ReportService` — llevan `@Transactional(readOnly = true)`, y todas las escrituras un `@Transactional` a secas. Las lecturas también se ejecutan dentro de una transacción porque `open-in-view` está desactivado: la conversión a DTOs de respuesta se hace dentro del servicio, con el contexto de persistencia abierto, así que cualquier asociación lazy que lea todavía se puede cargar.

> **Consejo de entrevista:** da la regla — lecturas con `readOnly = true`, escrituras con `@Transactional` a secas — y luego di qué te ahorra (ni flush ni dirty checking) y qué no es: una promesa de que la base de datos rechazará una escritura. Un cambio hecho dentro de una transacción de solo lectura simplemente no se escribe nunca, porque no hay flush.

---

<a id="SB-J-061"></a>

**[SB-J-061] Pones `@Transactional` en un método y no se abre ninguna transacción: el método es privado, o es público pero lo llama otro método de la misma clase. ¿Por qué?** ⭐⭐

Porque la anotación funciona a través de un proxy: los demás beans reciben una subclase generada de mi servicio que abre la transacción y después llama al método real, así que solo tiene transacción una llamada que pasa por ese proxy. Un método privado no lo puede sobrescribir la subclase, así que su anotación se ignora sin ningún error; desde Spring 6, los proxies basados en clases cubren también los métodos protected y los de paquete, pero nunca los privados. Una llamada desde otro método de la misma clase va a `this`, el objeto real, así que se salta el proxy aunque el método sea público. La solución es poner el límite en el método público al que se llama desde fuera, o mover el método interno a otro bean. En el proyecto 07 todos los `@Transactional` están en métodos públicos de servicio a los que llama otro bean — un controlador o la capa de seguridad —, y los pasos compartidos, como `findOwnedEntry`, `resolveProject` y `toResponse` en `TimeEntryService`, son helpers privados sin anotación que se ejecutan dentro de la transacción que ya abrió el método público.

```java
// illustrative — not from a project
@Service
public class ImportService {
    public void importAll(List<Row> rows) {
        rows.forEach(this::importRow);   // llamada sobre `this`: nunca pasa por el proxy
    }

    @Transactional
    public void importRow(Row row) { /* ... */ }
}
```

Respuesta de alerta: "Hago público el método y ya funciona." — Que sea público no basta cuando la llamada sale de la misma clase: sigue llegando a `this` y nunca al proxy, así que el límite tiene que estar en el método al que se llama desde fuera, o el método tiene que vivir en otro bean.

---

<a id="SB-J-062"></a>

**[SB-J-062] ¿`@Transactional` hace rollback con cualquier excepción? ¿Qué pasa con una excepción comprobada, o con una `RuntimeException` que capturas dentro del método?** ⭐⭐

No. Por defecto solo hace rollback cuando sale del método una excepción no comprobada: una `RuntimeException` o un `Error`. Si lo que sale es una excepción comprobada, la transacción confirma lo que ya se había escrito, salvo que la declare con `rollbackFor`; y una `RuntimeException` que capturo dentro del método sin volver a lanzarla, el proxy la ve como un retorno normal, así que también hace commit y el trabajo a medias queda guardado. Hay un caso distinto: si la excepción salió de un método del repositorio como `saveAndFlush`, el propio proxy transaccional de ese método ya ha marcado la transacción como rollback-only, así que tragársela acaba en una `UnexpectedRollbackException` al hacer commit. En el proyecto 07 todas las excepciones de dominio extienden `RuntimeException`, así que una regla que se incumple a mitad revierte la operación entera sin ningún `rollbackFor`; y todo `catch` dentro de un servicio vuelve a lanzar: la `DataIntegrityViolationException` de un nombre o un email duplicado en `ProjectService` y `UserService` se convierte en una `DuplicateResourceException`, así que del método sigue saliendo una excepción no comprobada y la transacción hace rollback.

```java
// illustrative — not from a project
@Transactional(rollbackFor = IOException.class)   // sin él, la IOException confirma el primer save
public void importEntries(Path file) throws IOException {
    repository.save(header);
    List<String> lines = Files.readAllLines(file);  // comprobada: puede lanzar IOException
}
```

Respuesta de alerta: "Sí, cualquier excepción la revierte." — Por defecto solo las no comprobadas: una excepción comprobada confirma lo que se había escrito, y lo mismo pasa con una `RuntimeException` que se traga dentro del método; así es como una operación fallida acaba guardada a medias.

---
## Testing

<a id="SB-J-063"></a>

**[SB-J-063] ¿Qué diferencia hay entre un test unitario normal, un test de slice y `@SpringBootTest`, y cuándo usas cada uno?** ⭐⭐⭐

`@SpringBootTest` arranca el contexto completo de la aplicación — todos los beans, la auto-configuración y el datasource real, salvo que el test configure otro —, así que demuestra el cableado y un flujo que cruza capas, a cambio de varios segundos por contexto y de la infraestructura que ese contexto necesite. Un slice carga una sola capa: `@WebMvcTest`, la parte MVC con los servicios sustituidos por mocks; `@DataJpaTest`, las entidades y los repositorios. Un test con JUnit y Mockito a secas no arranca nada de Spring, y es donde van las reglas de negocio: en el proyecto 07 viven en los servicios — `TimeEntryService.submit` rechazando todo lo que no sea un DRAFT, por ejemplo —, así que el Step 8, el siguiente paso del proyecto, las prueba con JUnit 5 y Mockito, una clase de test por servicio y sin ninguna base de datos en marcha. El único `@SpringBootTest` que tiene hoy el proyecto es el `contextLoads()` que genera Initializr: no comprueba nada y ni siquiera arranca sin un PostgreSQL en marcha y las variables `DB_PASSWORD` y `JWT_SECRET`, así que el Step 8 lo borra; los slices llegan en mi próximo proyecto.

Respuesta de alerta: "Uso `@SpringBootTest` para todo porque prueba lo de verdad." — Entonces cada regla paga un contexto completo y una base de datos, la suite se vuelve lenta y depende de la máquina en la que se ejecuta, y un fallo ya no dice qué capa se ha roto.

---

<a id="SB-J-064"></a>

**[SB-J-064] ¿Qué diferencia hay entre `@Mock` y `@MockitoBean` (antes `@MockBean`), y cuándo usas cada uno?** ⭐⭐⭐

`@Mock` es Mockito a secas: con `@ExtendWith(MockitoExtension.class)` crea un objeto falso de la clase, y `@InjectMocks` construye la clase que pruebo con esos mocks a través de su constructor, sin nada de Spring; es lo que uso para un servicio. `@MockitoBean` es de Spring: sustituye un bean dentro de un contexto de test de Spring por un mock de Mockito, así que solo lo necesito cuando el test arranca un contexto, por ejemplo un `@WebMvcTest` cuyo controlador necesita su servicio. `@MockBean` es la anotación antigua de Spring Boot para lo mismo: quedó deprecada en Boot 3.4 y ya no existe en Boot 4, que es el que usa el proyecto 07, pero todavía la verás en mucho código con Boot 3. En el proyecto 07 los servicios reciben todas sus dependencias por el constructor, así que `TimeEntryService` se puede construir en un test con tres `@Mock` y sin ningún contexto.

```java
// illustrative — not from a project
@ExtendWith(MockitoExtension.class)
class TimeEntryServiceTest {
    @Mock TimeEntryRepository timeEntryRepository;
    @Mock ProjectRepository projectRepository;
    @Mock AuthenticatedUserProvider authenticatedUserProvider;
    @InjectMocks TimeEntryService timeEntryService;   // se construye con los tres mocks
}

@WebMvcTest(TimeEntryController.class)
class TimeEntryControllerTest {
    @MockitoBean TimeEntryService timeEntryService;   // sustituye el bean en el contexto del slice
}
```

Respuesta de alerta: "Pongo `@MockBean` en todas las dependencias, también en los tests de servicio." — `@MockBean` solo funciona dentro de un contexto de Spring, así que un test de servicio que lo usa tiene que arrancar uno solo para conseguir sus mocks, y en Boot 4 la anotación ya no existe.

---

<a id="SB-J-093"></a>

**[SB-J-093] ¿Cómo harías un test unitario de un servicio con JUnit y Mockito? Explícamelo con uno de tus servicios.** ⭐⭐⭐

Pruebo el servicio por separado y simulo aquello de lo que depende: los repositorios y el componente que dice quién llama pasan a ser mocks de Mockito, así que el test no necesita ni base de datos ni Spring. Cada test sigue el esquema given/when/then: en el given preparo los mocks con `when(...).thenReturn(...)`; en el when llamo al método; en el then compruebo con aserciones lo que devolvió o lanzó, y uso `verify(...)` solo cuando la propia llamada es el resultado, por ejemplo para comprobar que no se guardó nada tras un rechazo. Los tests de los servicios del proyecto 07 son su siguiente paso, el Step 8, así que todavía no los he escrito; empezaría por `TimeEntryService.submit`, porque tiene una regla que un entrevistador puede comprobar: solo se puede enviar una entrada en DRAFT, y solo si su proyecto está activo.

```java
// projects/07-timetrack · TimeEntryService.java (el código que se prueba)
TimeEntry timeEntry = findOwnedEntry(id, user);
if (timeEntry.getStatus() != EntryStatus.DRAFT) {
    throw new InvalidStateTransitionException("Employee can only submit DRAFT entries");
}
```

```java
// illustrative — not from a project (el test que añadirá el Step 8)
@Test
void submit_throwsWhenEntryIsNotDraft() {
    when(authenticatedUserProvider.currentUser()).thenReturn(employee);   // given: la entrada es del empleado
    entry.setStatus(EntryStatus.SUBMITTED);
    when(timeEntryRepository.findById(10L)).thenReturn(Optional.of(entry));

    assertThatThrownBy(() -> timeEntryService.submit(10L))               // when + then
            .isInstanceOf(InvalidStateTransitionException.class);
    verify(timeEntryRepository, never()).save(any());
}
```

> **Consejo de entrevista:** di los tres pasos en voz alta — simular los colaboradores, llamar al método, comprobar el resultado — y añade la regla que hace que el test valga la pena: comprueba lo que el método devuelve o lanza, y deja `verify` para cuando la interacción es justo lo que importa. Un caso feliz más una regla incumplida por método es la respuesta honesta de un junior.

---

<a id="SB-J-065"></a>

**[SB-J-065] ¿Cómo pruebas un controlador sin arrancar el servidor, y qué carga `@WebMvcTest`?** ⭐⭐

`@WebMvcTest` arranca solo la parte MVC de la aplicación — controladores, `@ControllerAdvice`, filtros, converters y Jackson —, sin servicios ni repositorios, así que todo lo que llama el controlador hay que dárselo como `@MockitoBean`. Después `MockMvc` envía una petición a través del `DispatcherServlet` real sin abrir ningún puerto: el mapeo, el binding, `@Valid`, la conversión a JSON y el handler de excepciones se ejecutan igual que en producción. El código de estado lo compruebo con `status()` y los campos concretos del cuerpo con `jsonPath(...)`, en lugar de comparar el JSON entero como un string. El proyecto 07 no tiene tests de slice: su plan lo deja en el nivel unitario, y `@WebMvcTest` llega en mi próximo proyecto; en el 07, el primero que escribiría sería el de `PATCH /api/entries/{id}/submit` respondiendo 409 con el cuerpo de error de la API cuando la entrada no está en DRAFT.

```java
// projects/07-timetrack · TimeEntryController.java (el endpoint que se prueba)
@PreAuthorize("hasRole('EMPLOYEE')")
@PatchMapping("/{id}/submit")
public ResponseEntity<TimeEntryResponse> submit(@PathVariable Long id) {
    return ResponseEntity.ok(timeEntryService.submit(id));
}
```

```java
// illustrative — not from a project
when(timeEntryService.submit(10L))
        .thenThrow(new InvalidStateTransitionException("Employee can only submit DRAFT entries"));

mockMvc.perform(patch("/api/entries/10/submit"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.status").value(409))
        .andExpect(jsonPath("$.message").value("Employee can only submit DRAFT entries"));
```

> **Consejo de entrevista:** nombra lo que carga el slice y lo que deja fuera — la capa web dentro, los servicios con mocks — y luego `perform` → `andExpect(status())` → `andExpect(jsonPath(...))`. Menciona que, con Spring Security en el classpath, esta petición necesita un usuario autenticado; es la repregunta habitual.

---

<a id="SB-J-094"></a>

**[SB-J-094] Después de añadir Spring Security, todas las peticiones de tu `@WebMvcTest` vuelven con 401 o 403. ¿Por qué, y cómo pruebas los endpoints protegidos?** ⭐⭐

Porque el slice mantiene Spring Security: la petición llega a la cadena de filtros sin ningún usuario autenticado, así que se rechaza antes de llegar al controlador; un 401, o un 403 en un POST o un PATCH que la protección CSRF de la cadena por defecto rechaza antes. No desactivaría la seguridad: le doy a la petición un usuario con `@WithMockUser(roles = "EMPLOYEE")`, o con `.with(user(...))` en la propia petición, las dos del soporte de test de Spring Security. Un proyecto como el 07 tiene dos trampas más. El slice no escanea las clases `@Configuration`, así que mi `SecurityConfig` — la cadena con CSRF desactivado, el 401 en JSON y `@EnableMethodSecurity` — no se carga salvo que la importe con `@Import`, junto con el `JwtAuthenticationEntryPoint` que recibe en el constructor, y sin ella ningún `@PreAuthorize` está activo en el test. Y sí recoge `JwtFilter`, porque es un `Filter` de servlet, así que sus `JwtUtil` y `UserDetailsServiceImpl` hay que darlos como `@MockitoBean` o el contexto no arranca. Con todo eso en su sitio, el test que vale la pena es el del rol: un EMPLOYEE que llama a `PATCH /api/entries/{id}/approve` tiene que recibir un 403. El proyecto 07 todavía no tiene tests de slice, y su pom no incluye `spring-boot-starter-security-test`, que en Boot 4 es la dependencia que lleva al slice tanto la configuración de seguridad como `@WithMockUser`; su plan de testing deja para un `@WebMvcTest` de mi próximo proyecto la única regla de seguridad que ningún test de servicio alcanza: que el token, todavía válido, de un usuario desactivado se rechace en su siguiente petición.

Respuesta de alerta: "Excluyo la auto-configuración de seguridad en los tests para que pasen." — Entonces los tests ya no demuestran ninguna regla de acceso, y un endpoint que ha perdido su `@PreAuthorize` sigue en verde.

---

<a id="SB-J-067"></a>

**[SB-J-067] ¿Qué es `@DataJpaTest` y harías tus tests de repositorio sobre H2 o sobre PostgreSQL?** ⭐⭐

`@DataJpaTest` carga solo la capa de persistencia — las entidades, los repositorios de Spring Data y el `EntityManager` — y ejecuta cada test dentro de una transacción que se revierte al terminar, así que ningún test ve los datos de los demás. Por defecto, si hay una base de datos en memoria como H2 en el classpath, cambia el datasource por ella, lo que es rápido pero solo demuestra la consulta con el dialecto de H2: una función, una palabra reservada o una restricción pueden comportarse de otra manera en el PostgreSQL que corre en producción. Para una consulta que depende de la base de datos apuntaría el test al motor real con `@AutoConfigureTestDatabase(replace = Replace.NONE)` y arrancaría PostgreSQL en Docker con Testcontainers, para que el test corra sobre la misma base de datos que producción. En el proyecto 07 el candidato evidente es `getHoursByProject`, un agregado JPQL con `round(SUM(...), 2)` y `GROUP BY` que rellena una proyección de interfaz; pero los tests de repositorio no están en el plan de este proyecto — se queda en el nivel unitario, con los repositorios sustituidos por mocks — y los slices llegan en mi próximo proyecto.

Respuesta de alerta: "Con H2 basta, al fin y al cabo es SQL." — Cada base de datos tiene su dialecto, sus funciones y sus palabras reservadas; un test en verde sobre H2 puede esconder una consulta que falla, o que devuelve otra cosa, en PostgreSQL.

---

<a id="SB-J-095"></a>

**[SB-J-095] Este test siempre pasa: sustituye el repositorio por un mock y solo comprueba lo que devuelve el mock, o no comprueba nada. ¿Qué tiene de malo?** ⭐⭐

Que no puede fallar, así que no demuestra nada: la aserción comprueba el valor que yo mismo preparé una línea antes, no algo que el servicio hiciera con él, y un test sin aserciones pasa mientras no se escape ninguna excepción. Si borrara la regla de dentro del servicio, seguiría en verde. Un test útil comprueba lo que produce el propio método — el estado que fijó, la excepción que lanzó, el total que calculó — o, cuando el resultado es una llamada, verifica esa llamada con los argumentos correctos. El plan de testing del proyecto 07 lo convierte en una regla para el Step 8, los tests que escribo a continuación: cada test comprueba comportamiento real — el valor devuelto o el estado del objeto guardado —, nunca solo que se llamó a un mock. Y el único test de Spring que tiene hoy el proyecto es de los flojos: `contextLoads()` no comprueba nada y solo falla si el contexto no arranca; por eso el Step 8 lo borra.

```java
// illustrative — not from a project
@Test
void findById_returnsProject() {
    when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
    assertThat(projectRepository.findById(1L)).contains(project);   // comprueba el stub, no ProjectService
}
```

Respuesta de alerta: "Está bien, el informe de cobertura marca esas líneas como cubiertas." — La cobertura solo dice que las líneas se ejecutaron; sin una aserción sobre lo que produjeron, una regla rota sigue dejando el informe en verde.

---
## Tooling

<a id="SB-J-069"></a>

**[SB-J-069] ¿Cómo containerizas una aplicación Spring Boot y cómo ejecuta alguien tu proyecto sin instalar PostgreSQL?** ⭐⭐⭐

Meto el jar ejecutable en una imagen con un `Dockerfile` de dos etapas: la primera, sobre una imagen con JDK, construye el jar con el Maven wrapper, y la segunda parte de una imagen que solo lleva el JRE, copia únicamente ese jar y lo arranca con `java -jar` con un usuario sin privilegios de root; así, ni Maven ni el código fuente acaban en la imagen final. La configuración se queda fuera de la imagen: la URL y las credenciales de la base de datos y el secreto JWT llegan como variables de entorno, y por eso la misma imagen corre en local y como demo desplegada en Render. Para la base de datos, el `docker-compose.yml` del proyecto 07 define dos servicios: `db`, a partir de `postgres:17-alpine`, con un volumen y un healthcheck, y `api`, construido con ese Dockerfile, que solo arranca cuando la base de datos está sana y recibe un `DB_URL` que apunta a `db`, el perfil `dev` y los secretos de un `.env` que git ignora. Así, `docker compose up --build` levanta todo el backend, y lo único que hay que instalar es Docker.

```dockerfile
# projects/07-timetrack · backend/timetrack/Dockerfile
FROM eclipse-temurin:25-jdk AS build
# ... copia el wrapper, el pom y src
RUN ./mvnw -B package -DskipTests

FROM eclipse-temurin:25-jre
# ... crea el usuario spring sin privilegios y pasa a usarlo
COPY --from=build /app/target/timetrack-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

> **Consejo de entrevista:** separa los dos ficheros en voz alta — el Dockerfile construye una imagen; compose ejecuta varios contenedores juntos — y luego di por qué la imagen no lleva ninguna configuración dentro: la misma imagen corre en todos los entornos, y cada entorno le pasa sus propias variables.

---

<a id="SB-J-096"></a>

**[SB-J-096] ¿Cómo construyes tu aplicación Spring Boot y la ejecutas fuera del IDE? ¿Qué lleva dentro el jar para que `java -jar` arranque un servidor web?** ⭐⭐

Con Maven: `./mvnw clean package` — el wrapper que está en el repositorio, así que nadie necesita tener Maven instalado — borra `target/`, compila, ejecuta los tests y deja allí el jar, y después `java -jar target/timetrack-0.0.1-SNAPSHOT.jar` arranca la API; el Dockerfile del proyecto 07 ejecuta ese mismo `package`, y, para levantar la API sin Docker, el README del backend usa `./mvnw spring-boot:run`, que la arranca desde las clases compiladas sin empaquetar. Lo que hace ejecutable el jar es el Spring Boot Maven plugin: en la fase `package` reempaqueta el jar normal que generó Maven y lo convierte en uno ejecutable, con mis clases, el jar de cada dependencia de ejecución — entre ellos el Tomcat embebido que trae el starter web — y el lanzador propio de Boot, que el manifest declara como clase principal y que después llama al `main` de mi `TimetrackApplication`. En el proyecto 07 el plugin no lleva versión, porque la gestiona `spring-boot-starter-parent` igual que las de las dependencias, y su configuración deja Lombok fuera del jar, porque Lombok solo actúa al compilar.

```xml
<!-- projects/07-timetrack · pom.xml -->
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <excludes>
            <exclude>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </exclude>
        </excludes>
    </configuration>
</plugin>
```

> **Consejo de entrevista:** responde en dos mitades: los comandos (`package` y luego `java -jar`) y el motivo por el que funcionan (el plugin reempaqueta un jar que lleva su propio servidor). La repregunta habitual es "¿y sin el plugin?": un jar normal no tiene ni las dependencias ni una clase principal, así que `java -jar` lo rechaza con "no main manifest attribute".

---

<a id="SB-J-097"></a>

**[SB-J-097] ¿Cómo cambiarías el puerto en el que escucha tu API Spring Boot? Y si la misma propiedad está en `application.properties` y en una variable de entorno, ¿qué valor gana?** ⭐⭐

Con `server.port=8081` en `application.properties` — o `server:` con `port: 8081` anidado debajo en `application.yml`, que son las mismas claves escritas en YAML — y, sin tocar el fichero, con la variable de entorno `SERVER_PORT` o con el argumento `--server.port=8081` detrás de `java -jar`. Boot lee todas esas fuentes y gana la más específica: un argumento de línea de comandos se impone a una variable de entorno, esta a un fichero de perfil como `application-dev.properties`, y este a `application.properties`; así, el fichero guarda los valores por defecto y cada entorno sobrescribe solo lo que cambia. El proyecto 07 nunca fija el puerto, así que Tomcat escucha en su 8080 por defecto; en Render puse la variable propia de la plataforma, `PORT`, a 8080 para decirle al host adónde enrutar, en lugar de hacer que el código la leyera. La sobrescritura en la que sí me apoyo es la de CORS: el fichero dice `app.cors.allowed-origins=http://localhost:4200`, y en Render `APP_CORS_ALLOWEDORIGINS` la sustituye por los orígenes permitidos, el del frontend desplegado incluido — el nombre de la propiedad en mayúsculas, los puntos convertidos en guiones bajos y sin el guion —, sin ningún cambio en el backend.

> **Consejo de entrevista:** da primero la propiedad y luego el orden — línea de comandos, variable de entorno, fichero de perfil, `application.properties` — y una sobrescritura real. Decir que la variable de entorno gana al fichero que está en el repositorio es lo que demuestra que entiendes cómo un mismo jar corre en todos los entornos.

---

<a id="SB-J-070"></a>

**[SB-J-070] ¿Por qué un equipo usaría Flyway en lugar de `spring.jpa.hibernate.ddl-auto=update`?** ⭐⭐

Porque `update` cambia el esquema de la base de datos contra la que arranque la aplicación, a partir de las entidades y sin ningún fichero que nadie revise, y además solo añade: nunca borra, renombra ni cambia el tipo de una columna, ni modifica una que ya existe, así que esos cambios acaban siendo SQL que alguien ejecuta a mano. Flyway convierte cada cambio en un script SQL versionado en `src/main/resources/db/migration` — `V1__init.sql`, `V2__add_status.sql` — que se revisa en el PR y se aplica en orden al arrancar, y su tabla `flyway_schema_history` registra qué scripts tiene ya cada base de datos, de modo que todos los entornos acaban con el mismo esquema; Hibernate pasa entonces a `validate`. El proyecto 07 usa `update`, y me topé justo con esos límites: el `UNIQUE` que añadí a `email` cuando la columna ya existía nunca llegó a la tabla, así que ejecuté el `ALTER TABLE` a mano en pgAdmin, y la nueva columna `active`, con not-null, falló en una tabla que ya tenía filas hasta que le di un valor por defecto con `@ColumnDefault`. Flyway ya lo he usado, en las prácticas, sobre un esquema MySQL que corría en Docker — no con Spring Boot —, y escribí las notas de mantenimiento del equipo, `flyway repair` tras una migración fallida incluido.

Respuesta de alerta: "`ddl-auto=update` vale para producción: Hibernate mantiene el esquema sincronizado." — No lo mantiene: nunca borra, renombra ni cambia el tipo de una columna, así que la base de datos se va separando de las entidades sin ningún error, y cada cambio llega a los datos de producción sin que nadie lo haya revisado.

---

<a id="SB-J-098"></a>

**[SB-J-098] ¿Cómo lees tus propias propiedades desde el código: con `@Value` o con `@ConfigurationProperties`, y por qué?** ⭐⭐

`@Value("${...}")` inyecta un solo valor, y es lo que usa el proyecto 07: `JwtUtil` recibe `app.jwt.secret` y `app.jwt.expiration` por su constructor, y `SecurityConfig` recibe `app.cors.allowed-origins` como `List<String>`, que Boot parte por las comas por mí. `@ConfigurationProperties(prefix = "app.jwt")`, en cambio, enlaza un grupo entero con una clase o un record tipado: los valores viajan juntos, se pueden validar con restricciones, de modo que un valor vacío o inválido detiene el arranque con un mensaje que nombra la propiedad, y un test puede construir el objeto directamente. Uso `@Value` para un valor suelto y `@ConfigurationProperties` cuando varios valores pertenecen a una misma funcionalidad: `app.jwt.*` y los `app.admin.*` con los que se crea el manager de desarrollo son los dos grupos del proyecto 07 que pasaría a `@ConfigurationProperties` si crecieran. En los dos casos el valor sale de la configuración de Spring, así que los perfiles, las variables de entorno y los argumentos de línea de comandos pueden sobrescribirlo.

```java
// projects/07-timetrack · JwtUtil.java
public JwtUtil(@Value("${app.jwt.secret}") String secret,
               @Value("${app.jwt.expiration}") long expiration) {

// illustrative — not from a project (registrado con @ConfigurationPropertiesScan)
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(@NotBlank String secret, @Positive long expiration) {}
```

Respuesta de alerta: "Lo leo con `System.getenv("JWT_SECRET")` allí donde lo necesito." — Eso se salta la configuración de Spring: no hay valor por defecto en un fichero de propiedades, ni perfil, ni sobrescritura por línea de comandos, y la clase solo se puede probar fijando variables de entorno reales; inyectar el valor mantiene una única fuente de verdad.

---

<a id="SB-J-099"></a>

**[SB-J-099] ¿Cómo escribes logs en una aplicación Spring Boot y cómo activarías los logs DEBUG de un solo paquete sin cambiar el código?** ⭐⭐

Con SLF4J, la fachada de logging, y Logback por debajo, que es la implementación que trae por defecto cualquier starter de Spring Boot; así el código solo depende de la fachada. En el proyecto 07, `GlobalExceptionHandler` obtiene su logger con `LoggerFactory.getLogger` — el `@Slf4j` de Lombok genera ese mismo campo —, y su handler de respaldo llama a `log.error("Unhandled exception", e)`, pasando la excepción como último argumento para que la traza llegue al log. El nivel raíz es INFO por defecto, y el de cada paquete es configuración: `logging.level.org.springframework.security=DEBUG` en el fichero de propiedades de un perfil, o `LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=DEBUG` como variable de entorno del contenedor, que solo pide un reinicio, no un build nuevo. Por eso el `spring.jpa.show-sql=true` de mi perfil `dev` es la opción tosca: imprime el SQL directamente en la salida estándar, saltándose el sistema de logging, mientras que `logging.level.org.hibernate.SQL=DEBUG` manda las mismas sentencias a través del logger, con su fecha y su nivel.

```java
// projects/07-timetrack · GlobalExceptionHandler.java
private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
// ...
log.error("Unhandled exception", e);
```

```properties
# illustrative — not from a project
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

> **Consejo de entrevista:** "SLF4J es la API a la que llamo; Logback, lo que escribe". Luego, lo que ganas: el nivel es configuración, así que puedes subir un paquete a DEBUG en un entorno en marcha sin un build nuevo. Si te preguntan por qué no `System.out.println`, sé breve: no tiene niveles ni fecha, y no hay forma de apagarlo.

---

<a id="SB-J-100"></a>

**[SB-J-100] ¿Cómo documentas tu API REST para que el equipo de frontend pueda usarla? ¿Has usado Swagger/OpenAPI con springdoc?** ⭐⭐

En un proyecto, todavía no: en el proyecto 07 la documenté a mano, con una tabla por recurso en el README del backend que da el método, la URL, el rol y lo que hace cada endpoint. Para un solo desarrollador funciona, pero una tabla escrita a mano se desfasa la primera vez que alguien cambia un endpoint y se olvida del documento. En un equipo generaría el contrato a partir del código con springdoc: una dependencia, `springdoc-openapi-starter-webmvc-ui`, lee los controladores, sus mapeos y los DTOs — con restricciones de Bean Validation como `@NotBlank` incluidas — y publica el JSON de OpenAPI en `/v3/api-docs` y Swagger UI en `/swagger-ui.html`, donde el frontend o QA pueden leer cada endpoint y probarlo. Con Spring Security, como en el proyecto 07, hay que permitir en la cadena las rutas de la documentación, `/v3/api-docs/**` y `/swagger-ui/**`, y la interfaz necesita que se declare un esquema de bearer token para que su botón Authorize pueda enviar el JWT.

> **Consejo de entrevista:** separa el contrato de la página — OpenAPI es la descripción en JSON de la API; Swagger UI, la página que la muestra y te deja llamarla — y di que springdoc construye el contrato a partir del código que ya has escrito, así que no se puede desfasar respecto a él.

---

<a id="SB-J-101"></a>

**[SB-J-101] Un fragmento de un tutorial antiguo — o de un asistente de IA — importa `javax.persistence.Entity` y no compila en tu proyecto. ¿Por qué, y qué más cambió de Spring Boot 2 a 3?** ⭐⭐

Porque Spring Boot 3 pasó a Jakarta EE, cuyas APIs cambiaron de `javax.*` a `jakarta.*` cuando Java EE pasó a la Eclipse Foundation, que no pudo quedarse con el nombre `javax`: la persistencia, la validación y los servlets viven ahora en `jakarta.persistence`, `jakarta.validation` y `jakarta.servlet`, así que la clase antigua sencillamente no está en el classpath. La solución está en el import, no en el pom: en el proyecto 07, con Boot 4, las entidades importan `jakarta.persistence.*`, los DTOs `jakarta.validation.constraints.*` y `JwtFilter` `jakarta.servlet.*`, mientras que `JwtUtil` sigue importando `javax.crypto.SecretKey`, porque esa forma parte del JDK y nunca se movió. Añadir el jar antiguo de `javax.validation` para que compile es el arreglo peligroso: las anotaciones compilan, pero el validador solo lee las de `jakarta`, así que las restricciones se ignoran en silencio. Los otros cambios que buscaría en un proyecto con Boot 2 son Java 17 como versión mínima y Spring Security 6, donde `WebSecurityConfigurerAdapter` ya no existe y la configuración es un bean `SecurityFilterChain` con `requestMatchers` en lugar de `antMatchers`.

```java
// projects/07-timetrack · User.java y JwtUtil.java
import jakarta.persistence.*;    // se movió: Jakarta EE
import javax.crypto.SecretKey;   // no cambió: forma parte del JDK
```

Respuesta de alerta: "Vuelvo a añadir la dependencia de `javax` al pom para que compile." — Lo que cambió es el espacio de nombres, no que el jar exista: las anotaciones antiguas compilan pero nadie las lee — un `@Entity` de `javax` no se mapea y las restricciones de `javax` se saltan sin ningún error —; la solución es migrar los imports.

---

<a id="SB-J-102"></a>

**[SB-J-102] ¿Qué es Spring Boot Actuator y cuáles de sus endpoints expondrías en producción?** ⭐

Actuator es el starter que añade endpoints operativos bajo `/actuator`: `health` responde `{"status":"UP"}` — o un 503 cuando falla una comprobación, como la de la base de datos — y es lo que llama un balanceador, una sonda de Kubernetes o un healthcheck de Docker para saber si la instancia puede recibir tráfico; `info` da información de la aplicación, y `metrics`, a través de Micrometer, expone medidas como los tiempos de las peticiones o la memoria de la JVM, que el registro de Prometheus puede publicar para la monitorización. Por HTTP solo se expone `health` por defecto, y lo dejaría así, añadiendo `info` o `metrics` de forma explícita con `management.endpoints.web.exposure.include`, nunca con `*`: `heapdump` entrega la memoria del proceso, secretos como la clave JWT incluidos, y `env` y `beans` dibujan las tripas de la aplicación. El proyecto 07 no tiene Actuator: la API desplegada la verifiqué llamando a `GET /api/projects` sin token y esperando el 401, algo que sustituiría un `/actuator/health` de verdad; y con su `anyRequest().authenticated()` final, habría que permitir esa ruta de forma explícita.

Respuesta de alerta: "Pongo `management.endpoints.web.exposure.include=*` para tenerlo todo disponible." — Publica volcados de memoria, el entorno y el grafo de beans para cualquiera que llegue a la API; expón solo lo que necesita la monitorización y deja el resto apagado o detrás de autenticación.
