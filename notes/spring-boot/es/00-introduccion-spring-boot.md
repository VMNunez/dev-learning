# Introducción a Spring Boot

Docs: [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → lee las secciones "Spring Boot" y "Auto Configuration"

---

## Spring vs Spring Boot — el framework y el atajo

**Spring** (el framework) siempre ha podido hacer todo lo que hace Spring Boot — inyección de dependencias, una capa web, acceso a base de datos, seguridad. El problema nunca fue la *capacidad*, fue la *configuración*: para ejecutar una app web de Spring puro, configurabas un fichero XML (o una clase Java `@Configuration`) listando cada bean a mano, descargabas e instalabas un contenedor de servlets como Tomcat tú mismo, y desplegabas tu app dentro como un fichero `.war`.

**Spring Boot** no es un framework diferente — es Spring más una capa que elimina esa configuración. Lo hace con dos ideas, ambas explicadas en profundidad en [01-basicos.md](01-basicos.md):

- **Auto-configuración** — Spring Boot mira qué hay en tu classpath (qué dependencias añadiste a `pom.xml`) y configura los beans correspondientes por ti. Añade `spring-boot-starter-data-jpa` y conecta la conexión a la base de datos, el `EntityManager`, y el soporte de transacciones sin que escribas ni una línea de config.
- **Servidor embebido** — Tomcat viaja *dentro* de tu `.jar`. `java -jar app.jar` arranca el servidor él mismo; no hay nada que instalar por separado.

> Si te quedas con una sola frase de este archivo: **Spring Boot no eliminó ninguna de las ideas de Spring — eliminó el cableado manual alrededor de ellas.** Todo lo de abajo (beans, el contenedor IoC, anotaciones) sigue siendo Spring por debajo.

---

## El contenedor IoC — la única idea de la que dependen todas las demás

El concepto central de Spring es la **Inversión de Control (IoC)**: en lugar de que tu código cree los objetos de los que depende (`new TransactionRepository()`), declaras lo que necesitas y un contenedor los crea y te los entrega. Ese contenedor se llama **ApplicationContext**, y los objetos que gestiona se llaman **beans** — explicación completa con el "por qué" en [03-inyeccion-dependencias.md](03-inyeccion-dependencias.md).

```
Sin IoC (tú controlas la creación):
  TransactionService {
      private TransactionRepository repository = new TransactionRepository();
  }

Con IoC (el contenedor controla la creación):
  TransactionService {
      private final TransactionRepository repository;   // te lo entregan
      TransactionService(TransactionRepository repository) { this.repository = repository; }
  }
```

> **Por qué esto importa antes que nada más.** Una vez entiendes que el trabajo de Spring es "encontrar cada clase anotada como bean, crear una instancia de cada una, y conectarlas entre sí emparejando los parámetros del constructor con los tipos de bean", casi todas las anotaciones de este topic (`@Service`, `@Repository`, `@Bean`, `@Autowired`) dejan de parecer magia separada y se convierten en un solo mecanismo aplicado en sitios distintos.

---

## Las anotaciones reemplazan la configuración — el patrón que se repite

Antes de Spring Boot (e incluso en el Spring temprano), conectabas los beans entre sí en XML: `<bean id="transactionService" class="..."><constructor-arg ref="transactionRepository"/></bean>`. Cada clase necesitaba un bloque XML correspondiente.

La convención de Spring Boot es la opuesta: pon una anotación en la clase, y el contenedor la descubre automáticamente escaneando el paquete.

| Anotación | Qué marca |
|---|---|
| `@Component` | Cualquier clase gestionada por Spring (genérico) |
| `@Service` | Capa de lógica de negocio |
| `@Repository` | Capa de acceso a datos |
| `@RestController` | Capa web — gestiona HTTP |
| `@Configuration` + `@Bean` | Un bean que no puedes anotar directamente (una clase de librería) |

Por eso leer una clase de Spring Boot es sobre todo leer sus anotaciones primero — te dicen *qué rol* juega la clase antes de que leas un solo método.

---

## El ciclo de vida del request — cómo se conectan las capas

Cada request HTTP que llega a un endpoint de TimeTrack recorre el mismo camino fijo. Este es el mapa mental que hay que tener antes de meterse en el archivo de cualquier capa concreta:

```
Request HTTP
     ↓
[Filter chain de seguridad]   ← valida el JWT, rechaza si no está autenticado (06-security-jwt.md)
     ↓
[Controller]                  ← lee el request, devuelve una respuesta (02-rest-controllers.md)
     ↓
[Service]                     ← lógica de negocio, límite de @Transactional (08-transactions.md)
     ↓
[Repository]                  ← habla con la base de datos vía Spring Data JPA (04-spring-data-jpa.md)
     ↓
Base de datos
```

Cada archivo numerado de esta carpeta hace zoom en un eslabón de esa cadena. Cuando algo en un archivo concreto se sienta desconectado, vuelve a este diagrama — casi siempre encaja en una de estas cajas.

---

## Dónde encaja TimeTrack — esta carpeta mapea a un proyecto real

Todo en `01`–`10` se enseña contra el **proyecto 07 (TimeTrack)** — una app real de Spring Boot + Angular + PostgreSQL, no ejemplos de juguete. `layer-reference.md` en esta carpeta tiene la versión de referencia rápida de la estructura por capas (usando un ejemplo `Transaction`); `coverage.md` lista cada concepto que una consultora española espera que un junior pueda explicar con un ejemplo real del proyecto.

**Orden de lectura para esta carpeta:** `01` (setup) → `02` (controllers) → `03` (DI/beans — el mecanismo detrás de `01` y `02`) → `04` (persistencia) → `05` (excepciones) → `06` (seguridad) → `07` (validación) → `08` (transacciones) → `09` (testing) → `10` (tooling). La Sección 0 / Sección 15 del `PLANNING.md` del proyecto dice qué paso está activo ahora mismo — eso es lo que decide qué archivo leer a continuación en una sesión en vivo.
