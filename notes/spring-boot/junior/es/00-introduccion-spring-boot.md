# Introducción a Spring Boot

Docs: [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → lee las secciones "Spring Boot" y "Auto Configuration"

---

## Spring vs Spring Boot — el framework y el atajo

Docs: https://www.baeldung.com/spring-vs-spring-boot → lee: las secciones "Spring" y "Spring Boot" (sáltate la parte de Spring MVC por ahora — la ves en `02`)

**Spring** (el framework) siempre ha podido hacer todo lo que hace Spring Boot — inyección de dependencias, una capa web, acceso a base de datos, seguridad. El problema nunca fue la *capacidad*, fue la *configuración*. Para poner online una app web de Spring puro, tenías tres tareas encima:

1. **Listar cada bean a mano** en un fichero XML (o, más adelante, en una clase Java `@Configuration`). Un bloque por clase, con sus dependencias conectadas explícitamente.
2. **Instalar un contenedor de servlets** — un programa aparte que descargas en la máquina (Tomcat, JBoss, WebSphere) cuyo único trabajo es quedarse escuchando en un puerto de red, aceptar los requests HTTP que llegan, y entregar cada uno a una clase Java que sepa responderlo. Tu código Java no puede escuchar un puerto por sí solo; el contenedor es la pieza que sí puede. "Servlet" es simplemente el nombre antiguo de Java para *una clase que gestiona un request HTTP* — el contenedor es lo que los contiene y los ejecuta.
3. **Desplegar tu app dentro de él** como un fichero `.war` — un **W**eb **A**pplication A**R**chive: un zip de tus clases compiladas con una estructura interna fija que el contenedor sabe descomprimir. Copiabas el `.war` en la carpeta `webapps/` de Tomcat y Tomcat lo ejecutaba. Tu app era un *invitado* dentro de un servidor que había instalado otra persona.

**Spring Boot** no es un framework diferente — es Spring más una capa que elimina esas tres tareas. La auto-configuración elimina la tarea 1; el servidor embebido elimina las tareas 2 y 3, porque ahora Tomcat viaja *dentro* de tu `.jar` y `java -jar app.jar` lo arranca desde dentro de tu propio `main()`. El servidor pasó a ser el invitado y tu app pasó a ser el anfitrión.

> **Esto es el mapa, no el mecanismo.** Acabas de ver *qué* eliminó Spring Boot y *por qué existía ese dolor*. **Cómo** lo elimina — el classpath, `@ConditionalOnClass`, los starters, el fat jar — se traza paso a paso en [01-basicos.md](01-basicos.md), y esa es la versión que un entrevistador realmente pone a prueba. El trabajo de este archivo es entregarte el vocabulario (`bean`, `contenedor`, `classpath`, `starter`) para que ese archivo se lea como una explicación en vez de como un glosario.

> Si te quedas con una sola frase de este archivo: **Spring Boot no eliminó ninguna de las ideas de Spring — eliminó el cableado manual alrededor de ellas.** Todo lo de abajo (beans, el contenedor IoC, anotaciones) sigue siendo Spring por debajo. Por eso, si un entrevistador pregunta "¿qué es Spring Boot?", no basta con responder "un framework" — la respuesta honesta es "Spring, con la configuración automatizada".

---

## El contenedor IoC — la única idea de la que dependen todas las demás

Docs: https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring → lee: "What Is Inversion of Control?" y "What Is Dependency Injection?" (párate antes de los ejemplos en XML — Spring Boot usa anotaciones en su lugar)

El concepto central de Spring es la **Inversión de Control (IoC)**: en lugar de que tu código cree los objetos de los que depende (`new TransactionRepository()`), declaras lo que necesitas y un contenedor los crea y te los entrega. Ese contenedor se llama **ApplicationContext**, y los objetos que gestiona se llaman **beans** — explicación completa con el "por qué" en [18-inyeccion-dependencias.md](18-inyeccion-dependencias.md).

La palabra "inversión" está haciendo trabajo real ahí, así que vamos a concretarla. **Piensa en la cocina de un restaurante.** Sin IoC, cada cocinero sale a comprar sus propios tomates: decide el proveedor, carga la caja él mismo, y si el proveedor cambia, hay que reentrenar a cada cocinero por separado. Con IoC hay un *encargado de almacén*: dejas una nota diciendo "necesito tomates" y una caja aparece en tu mesa de trabajo cuando llegas. El cocinero ya no *controla* de dónde vienen los tomates; ese control se **invirtió** y pasó al encargado. Cambiar de proveedor ahora es un solo cambio en un solo sitio, y nadie en la cocina se entera. El ApplicationContext de Spring es ese encargado de almacén, tus clases `@Service` son los cocineros, y el parámetro del constructor es la nota.

```java
// ❌ MAL — sin IoC: la clase controla la creación
class TransactionService {
    private TransactionRepository repository = new TransactionRepository();
    // soldada a esta clase concreta para siempre; un test no puede colar un fake
}

// ✅ BIEN — con IoC: el contenedor controla la creación
class TransactionService {
    private final TransactionRepository repository;   // te lo entregan
    TransactionService(TransactionRepository repository) {   // "necesito uno de estos"
        this.repository = repository;
    }
}
```

> **Por qué la versión con `new` está realmente mal, no solo anticuada.** Hay dos consecuencias, y las dos muerden. Primero, `TransactionService` queda soldado a esa única clase concreta — si alguna vez necesitas una implementación distinta (una cacheada, un mock, una variante Postgres frente a H2) tienes que editar el propio servicio. Segundo, y este es el que aparece en [09-testing.md](09-testing.md): un test unitario no puede sustituir el repositorio por un fake, porque el objeto se crea *dentro* de la clase, donde ningún test puede alcanzarlo. La inyección por constructor convierte la dependencia en una **entrada**, y cualquier cosa que sea una entrada se puede sustituir — por Spring en producción, por Mockito en un test.

> **Por qué esto importa antes que nada más.** Una vez entiendes que el trabajo de Spring es "encontrar cada clase anotada como bean, crear una instancia de cada una, y conectarlas entre sí emparejando los parámetros del constructor con los tipos de bean", casi todas las anotaciones de este tema (`@Service`, `@Repository`, `@Bean`, `@Autowired`) dejan de parecer magia separada y se convierten en un solo mecanismo aplicado en sitios distintos.

---

## Las anotaciones reemplazan la configuración — el patrón que se repite

Docs: https://www.baeldung.com/spring-component-scanning → lee: "@ComponentScan Without Arguments", y luego la parte de Spring Boot donde `@SpringBootApplication` aporta el scan (ese es el mecanismo que se traza abajo)

Antes de Spring Boot (e incluso en el Spring temprano), conectabas los beans entre sí en XML: `<bean id="transactionService" class="..."><constructor-arg ref="transactionRepository"/></bean>`. Cada clase necesitaba un bloque XML correspondiente, y olvidar uno producía un fallo en tiempo de ejecución al arrancar — el contenedor simplemente no sabía que la clase existía.

La convención de Spring Boot es la opuesta: pones una anotación en la clase, y el contenedor la descubre automáticamente. "Automáticamente" es la palabra que esconde el mecanismo, así que vamos a trazarlo.

### Cómo encuentra `@ComponentScan` tus clases en realidad

`@SpringBootApplication` (en `TimetrackApplication`) trae `@ComponentScan` incluido dentro. Esa anotación no recibe argumentos aquí, y *ese* es todo el truco: sin un paquete explícito que escanear, por defecto toma **el paquete de la clase en la que está escrita** — `com.victor.timetrack` — y cada subpaquete debajo de él. Luego, al arrancar:

```
1. SpringApplication.run(TimetrackApplication.class, args)
        → lee @ComponentScan en TimetrackApplication
        → paquete base = com.victor.timetrack  (el propio paquete de la clase)
2. Spring recorre el CLASSPATH buscando cada fichero .class bajo ese árbol de paquetes:
        com/victor/timetrack/controller/TimeEntryController.class
        com/victor/timetrack/service/TimeEntryService.class
        com/victor/timetrack/repository/TimeEntryRepository.class
3. Para cada uno, lee las ANOTACIONES de la clase sin instanciarla
        (inspección de bytecode — todavía no se ejecuta ningún constructor)
4. Anotada con @Component, o con algo meta-anotado como @Component
        (@Service, @Repository, @RestController lo son)  → registra una definición de bean
        No anotada (un DTO, un enum, un helper plano)    → se ignora por completo
5. Solo ahora las instancia, resolviendo cada parámetro del constructor
        emparejando su TIPO con las definiciones de bean ya registradas
```

> **Cómo lee el paso 3 una anotación sin ejecutar la clase.** Un fichero `.class` no es una caja negra — es un formato binario documentado, y una anotación que escribiste en el código fuente queda *guardada dentro de él* como un registro de datos plano (una entrada `RuntimeVisibleAnnotations` que nombra `@Service`). Así que Spring nunca necesita cargar la clase para ver la anotación: abre los bytes del fichero y lee ese registro, igual que puedes leer los ingredientes de una lata sin abrirla. Eso es lo que significa aquí "inspección de bytecode". Importa por una razón práctica — cargar una clase ejecuta sus inicializadores estáticos, y Spring no está dispuesto a ejecutar *tu* código solo para averiguar si es candidata. Primero mira, luego decide, luego construye.

Dos consecuencias salen directamente de ahí, y las dos son preguntas de examen. **¿Por qué `TimetrackApplication` tiene que estar en el paquete raíz?** Porque el scan empieza *en su paquete* — si la aparcas en `com.victor.timetrack.config`, el paquete base del scan pasa a ser `...config`, así que tus paquetes `controller` y `service` quedan *fuera* del árbol y nunca se ven. La app arranca, y cada endpoint devuelve 404. **¿Y por qué el paso 3 lee anotaciones sin crear objetos?** Porque crear un bean significa resolver sus dependencias, y Spring no puede resolverlas hasta que conoce la lista completa de candidatos — así que el descubrimiento tiene que terminar antes de que empiece la construcción.

> **Una "definición de bean" no es el bean.** El paso 4 no crea nada — archiva una *receta*: esta clase, este constructor, estos tipos de parámetro. El objeto en sí solo se construye en el paso 5. Esa división en dos fases (**definir todo, luego construir todo**) es lo que permite que dos beans dependan el uno del otro en cualquier orden — para cuando empieza la construcción, cada receta ya está sobre la mesa, así que nunca importa a qué clase llegó primero el scanner. También es la razón por la que un bean que falta rompe en **el arranque**, no en el primer request: Spring ya sabe, antes de servir nada, que algún constructor pide un tipo que ninguna receta produce (`Parameter 0 of constructor in ...TimeEntryService required a bean of type '...TimeEntryRepository' that could not be found`).

> **El paso 5 construye los *singletons*, y la inmensa mayoría de tus beans lo son.** Por defecto un bean es un **singleton** — una sola instancia para toda la app, creada de forma anticipada (_eager_) al arrancar. Es el defecto porque tus clases `@Service` y `@Repository` no tienen estado: no guardan datos por usuario, así que una única instancia compartida puede atender cada request y construirla una sola vez sale gratis. Las excepciones son los beans marcados `@Lazy` (se construyen en el primer uso) o con un scope distinto de singleton, y esos simplemente no se construyen en el paso 5 — su receta espera. Los scopes se cubren en profundidad en [18-inyeccion-dependencias.md](18-inyeccion-dependencias.md); por ahora, lee "Spring los instancia" como "Spring instancia los singletons", que en TimeTrack es cada bean que escribes.

> **`@Service`, `@Repository` y `@RestController` son todos `@Component` por debajo.** Abre su código fuente y cada uno lleva `@Component` como *meta-anotación* — una anotación sobre la anotación. Así que el scanner del paso 4 solo busca una cosa en realidad. Los nombres extra existen para **ti** (documentan la capa de un vistazo) y para un poco de comportamiento extra del framework encima. `@Repository` es el caso más claro: además activa la **traducción de excepciones**, así que el error específico del proveedor que lanza tu driver de base de datos (una `SQLException` de Postgres con un código de error como `23505`) se captura y se relanza como una de las propias excepciones de Spring (`DataIntegrityViolationException`). El beneficio es que tu servicio captura la *misma* excepción tanto si corre contra Postgres en producción como contra H2 en un test — el driver deja de filtrarse dentro de tu código. No son cuatro mecanismos distintos; son un solo mecanismo con cuatro etiquetas y un poco de cableado extra cada una.

| Anotación | Qué marca | Cubierta a fondo |
|---|---|---|
| `@Component` | Cualquier clase gestionada por Spring (genérico) | [18-inyeccion-dependencias.md](18-inyeccion-dependencias.md) |
| `@Service` | Capa de lógica de negocio | [18-inyeccion-dependencias.md](18-inyeccion-dependencias.md) · reglas dentro: [11-logica-de-negocio-modelado-dominio.md](11-logica-de-negocio-modelado-dominio.md) |
| `@Repository` | Capa de acceso a datos | [03-spring-data-jpa.md](03-spring-data-jpa.md) |
| `@RestController` | Capa web — gestiona HTTP | [02-controladores-rest.md](02-controladores-rest.md) |
| `@Configuration` + `@Bean` | Un bean que no puedes anotar directamente (una clase de librería) | [18-inyeccion-dependencias.md](18-inyeccion-dependencias.md) · muy usado en [06-seguridad-jwt.md](06-seguridad-jwt.md) |

Lee la tercera columna como una promesa, no como una nota al pie: nada en este archivo se explica al nivel que vas a necesitar — cada fila es el archivo que te debe el mecanismo completo, el código real de TimeTrack, y la respuesta de entrevista. Este archivo solo te da la *forma* para que esos archivos tengan algo donde engancharse.

Por eso leer una clase de Spring Boot es sobre todo leer sus anotaciones primero — te dicen *qué rol* juega la clase antes de que leas un solo método.

---

## El ciclo de vida del request — cómo se conectan las capas

Docs: https://www.baeldung.com/spring-dispatcherservlet → lee: "Front Controller" y "Request Processing" (el `DispatcherServlet` es la caja que decide *a qué* método de controller pertenece una URL)

Cada request HTTP que llega a un endpoint de TimeTrack recorre el mismo camino fijo. Este es el mapa mental que hay que tener antes de meterse en el archivo de cualquier capa concreta:

```
Request HTTP  →  [Tomcat embebido, puerto 8080]
     ↓
[Filter chain de seguridad]   ← valida el JWT, rechaza si no está autenticado  (06-seguridad-jwt.md)
     ↓
[DispatcherServlet]           ← empareja la URL+verbo con un método de controller  (02-controladores-rest.md)
     ↓
[Controller]                  ← valida el body, devuelve una respuesta           (02, 07-validacion.md)
     ↓
[Service]                     ← reglas de negocio + límite de @Transactional     (08-transacciones.md, 11-logica-de-negocio-modelado-dominio.md)
     ↓
[Repository]                  ← habla con la base de datos vía Spring Data JPA   (03-spring-data-jpa.md)
     ↓
Base de datos

   ⟳ cualquier capa puede lanzar  →  [@RestControllerAdvice] → error JSON limpio  (05-manejo-excepciones.md)
   ⟳ cada capa puede escribir     →  [el log]                                       (13-logging-observabilidad.md)
```

Lee las dos líneas `⟳` como *transversales*: no son un paso en la cadena, cuelgan de **todas** las cajas de ella. Una excepción lanzada en cualquier sitio — seguridad, controller, service, repository — se desenrolla fuera de la cadena y se captura en un único sitio central, por eso el archivo 05 no tiene un hueco fijo en la pila vertical. El logging tiene la misma forma: cualquier capa puede escribir una línea, y el archivo 13 es el que dice *qué* líneas merecen escribirse. Y ese log es la única razón por la que el archivo 12 (depuración en producción) tiene algo con lo que trabajar: cuando la app está en un servidor al que no puedes conectar un depurador, este diagrama más el log son todo el panorama que tienes.

Cada archivo numerado de esta carpeta hace zoom en un eslabón de esa cadena. Cuando algo en un archivo concreto parezca desconectado, vuelve a este diagrama — casi siempre encaja en una de estas cajas.

---

## Dónde encaja TimeTrack — esta carpeta corresponde a un proyecto real

Todo en `01`–`13` se enseña usando el **proyecto 07 (TimeTrack)** — una app real de Spring Boot + Angular + PostgreSQL, no ejemplos de juguete. `layer-reference.md` en esta carpeta tiene la versión de referencia rápida de la estructura por capas (usando un ejemplo `Transaction`); `coverage.md` lista cada concepto que una consultora española espera que un junior pueda explicar con un ejemplo real del proyecto.

**La ruta, y por qué corre en este orden.** Los archivos no son un menú — son una construcción, y cada uno existe porque el anterior dejó un hueco. Empiezas por conseguir que una app arranque (`01` setup) y por exponerla vía HTTP (`02` controllers); esas dos solo funcionan porque un contenedor está conectando tus objetos entre sí, así que `03` (DI/beans) se detiene y explica el mecanismo que ha estado sosteniendo en silencio `01` y `02`. Una app que responde requests pero se olvida de todo es inútil, así que `04` le da una base de datos — y en el momento en que una base de datos puede decir "no", necesitas algún sitio donde aterricen los fallos, que es `05` (excepciones). Ahora la app funciona y falla de forma limpia, así que merece la pena protegerla: `06` (seguridad/JWT) la blinda, y `07` (validación) rechaza la basura antes de que llegue nunca a tu lógica. Con varias escrituras ocurriendo ya por request, `08` (transacciones) las hace todo-o-nada. En ese punto la app es *correcta*, así que `09` lo demuestra con tests y `10` la despliega (Docker, Flyway). Los tres últimos son el paso de "funciona en mi portátil" a "funciona en producción, y puedo defenderlo en una entrevista": `11` pone las reglas de negocio donde deben estar (el workflow `DRAFT → SUBMITTED → APPROVED`), `12` te enseña a leer la evidencia cuando ese workflow se rompe en un servidor que no puedes depurar, y `13` cierra el círculo mostrando que la evidencia de `12` solo existe porque alguien escribió antes la línea de log.

**Orden de lectura:** `01` (setup) → `02` (controllers) → `03` (DI/beans) → `04` (persistencia) → `05` (excepciones) → `06` (seguridad) → `07` (validación) → `08` (transacciones) → `09` (testing) → `10` (tooling) → `11` (lógica de negocio y modelado de dominio) → `12` (depuración en producción) → `13` (logging y observabilidad). La Sección 0 / Sección 15 del `PLANNING.md` del proyecto dice qué paso está activo ahora mismo — eso es lo que decide qué archivo leer a continuación en una sesión en vivo.

> **Los archivos `11`–`13` son los que separan a un junior que "hizo un tutorial" de uno que construyó algo.** Cualquiera puede conectar un controller con un repository. Muchos menos pueden responder *"¿dónde viven las reglas de negocio, y por qué no en el controller?"*, *"la app no arranca en producción — ¿qué miras primero?"*, o *"una fila está en un estado que debería ser inalcanzable — ¿cómo averiguas quién la puso ahí?"*. Esas tres preguntas son los archivos 11, 12 y 13, y se preguntan en screenings reales españoles.
