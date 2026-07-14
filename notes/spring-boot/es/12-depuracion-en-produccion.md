# Depuración en producción — leer la evidencia

Docs: [Baeldung — Spring Boot Startup Failures](https://www.baeldung.com/spring-boot-failure-analyzer) → leer: "FailureAnalyzer" (el mecanismo que imprime el bloque `Description:` / `Action:` que estás a punto de aprender a leer)

[11-logica-de-negocio-modelado-dominio.md](11-logica-de-negocio-modelado-dominio.md) terminó un lunes por la mañana: un manager te dice que hay una entry en estado `APPROVED` que nadie envió nunca. Piensa en lo que tienes literalmente entre manos en ese momento. Ninguna exception. Ningún test que falle. Ninguna línea roja en la consola. **Solo una fila incorrecta.**

Esa es la forma de casi cualquier problema real en producción, y es la razón por la que depurar en producción es una habilidad distinta a depurar en el IDE. En tu portátil la evidencia viene a ti — la exception aparece en la ventana de ejecución, pones un breakpoint dos líneas antes y observas cómo cambia el valor. En producción no hay ventana de ejecución, muchas veces no tienes permiso para conectar un debugger, y el fallo ocurrió hace cuarenta minutos en una máquina donde no estás sentado. Lo que te queda en su lugar es **evidencia dejada atrás**: un log de arranque, un stack trace, un status code, una respuesta lenta, una fila en un estado que debería ser inalcanzable.

Así que la habilidad no es "arreglar bugs". Es **leer la evidencia que tienes delante y saber qué descarta y qué no descarta cada pieza de evidencia.** Esa habilidad tiene dos momentos, y este archivo está dividido siguiendo esa línea:

```
                    Does the app start?
                            │
              ┌─────────────┴──────────────┐
             NO                            YES
              │                             │
   "APPLICATION FAILED TO START"   The process is alive, but…
   the context never came up:      …an endpoint 500s
   a bean, a port, a datasource,   …an endpoint takes 8 seconds
   a schema mismatch               …a row is in the wrong state
              │                             │
      PART 1 of this file           PART 2 of this file
   (evidence = the startup log)   (evidence = logs + metrics + SQL)
```

La división importa porque las dos mitades tienen primeros movimientos completamente distintos. Un fallo de arranque te entrega un párrafo que literalmente te dice la solución, y todo el trabajo consiste en leerlo en vez de pasar de largo. Un fallo en tiempo de ejecución no te entrega nada, y todo el trabajo consiste en *ir a buscar* la evidencia — activar el logging de SQL, llamar a Actuator, leer el log alrededor de la request que falla.

> **¿Por qué merece "la app no arranca" media nota completa?** Porque es donde vas a pasar la mayor parte de tu primera semana en cualquier proyecto real, y porque es la pregunta de apertura más habitual en una entrevista técnica española: *"la aplicación no arranca — ¿qué haces primero?"*. El entrevistador no está comprobando si memorizaste un mensaje de error. Está comprobando si **lees** o si **adivinas** — un junior que lee el bloque de fallo lo resuelve en veinte segundos; un junior que adivina empieza a relanzar Maven al azar, a borrar `target/` y a reiniciar el IDE.

---

# PARTE 1 — La app no arranca

## Leer el bloque `APPLICATION FAILED TO START`

Propósito: extraer la solución del párrafo que Spring Boot escribe específicamente para ti, antes de leer una sola línea del stack trace que hay encima.
Archivo: la consola de IntelliJ, o `docker compose logs -f app` cuando la app corre en un contenedor
Docs: [Baeldung — Spring Boot FailureAnalyzer](https://www.baeldung.com/spring-boot-failure-analyzer) → leer: "Custom FailureAnalyzer" — muestra la clase que usa Spring para convertir una exception en ese bloque

Cuando una app de Spring Boot muere durante el arranque te encuentras con un muro de texto: cincuenta o cien líneas de stack trace, la mayoría dentro de clases `org.springframework.*` que nunca has abierto. El instinto es leerlo de arriba a abajo, perderte hacia la línea doce y empezar a cambiar cosas al azar.

No leas el stack trace primero. **Ve al final.** Spring Boot imprime esto justo al final:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this
application to listen on another port.
```

Ese bloque no forma parte del stack trace. Lo escribe un **`FailureAnalyzer`** — una clase de Spring Boot cuyo único trabajo es reconocer una exception de arranque conocida y traducirla a dos frases sobre las que un humano puede actuar. Por dentro, cuando el context falla al refrescarse, Boot captura la exception, recorre una lista de analyzers registrados, le pregunta a cada uno "¿reconoces este tipo de exception?", y el primero que responde que sí produce el `Description:` (qué pasó) y el `Action:` (qué hacer al respecto). Ese es el mecanismo: no es la JVM siendo amable, es un componente de Spring escrito por alguien que se cansó de que los juniors pegaran stack traces en Slack.

> **Entonces, ¿por qué sigue existiendo el stack trace?** Porque no todo fallo tiene un analyzer. Spring incluye analyzers para los casos comunes — puerto en uso, url de datasource ausente, ciclos entre beans, dependencias no satisfechas — y para todo lo demás caes de nuevo en el trace. La regla de lectura para ese caso de respaldo viene de [Excepciones en Java](../../java/es/08-excepciones.md): lee **de abajo hacia arriba a través de la cadena de `Caused by:`** hasta la última (esa es la causa raíz), y luego encuentra el primer frame de la cadena que pertenezca a *tu* paquete (`com.victor.timetrack.…`). Los frames del framework te dicen *dónde* explotó; tu frame te dice *por qué lo causaste tú*.

Dos hábitos, y son toda la sección:

1. **`Ctrl+End` en la consola de IntelliJ** salta al final de la salida, que es donde vive el bloque de fallo. (`Ctrl+F` buscando `FAILED TO START` también funciona, y funciona en la salida de `docker compose logs`, donde haces scroll por un archivo, no por una ventana.)
2. **Lee la línea `Action:` en voz alta antes de tocar nada.** Acierta con la frecuencia suficiente como para que ignorarla sea indefendible en una entrevista.

> **La pregunta real del entrevistador, textual:** *"The app will not start. What is your first move?"* La respuesta esperada es "leer la línea `Action:` del bloque de fallo" — no "revisar el pom", no "reiniciar IntelliJ", no "clean and rebuild". Los juniors pasan de largo el único párrafo escrito para ellos, y el entrevistador ha visto a treinta candidatos hacer exactamente eso.

---

## `Port 8080 was already in use`

Propósito: reconocer el fallo más común en la primera ejecución en tres segundos y conocer las dos salidas.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties`
Docs: [Baeldung — Change the Spring Boot Port](https://www.baeldung.com/spring-boot-change-port) → leer: "Using Property Files"

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.
```

El Tomcat embebido dentro de tu fat jar ([01-basicos.md](01-basicos.md)) le pide al sistema operativo el puerto TCP 8080, y el SO se niega porque **otro proceso ya lo tiene ocupado**. Un puerto es exclusivo: solo un proceso puede escuchar en él a la vez. Eso no es una regla de Spring, es una regla del kernel, y por eso ninguna cantidad de configuración de Spring hará que dos apps compartan el 8080.

Nueve de cada diez veces el proceso que lo ocupa es **la misma app que arrancaste hace cinco minutos y creías haber parado** — una ventana de ejecución que cerraste sin detener, o un stack de `docker compose` que sigue levantado en segundo plano. Así que la primera comprobación no es la línea de comandos, es la pestaña Run de IntelliJ y `docker ps`.

Las dos soluciones reales:

```properties
# option A — move your app off 8080 (application.properties)
server.port=8081
```

```bash
# option B — find and kill whoever holds the port
netstat -ano | findstr :8080     # Windows → last column is the PID
taskkill /PID 12345 /F           # Windows

lsof -i :8080                    # macOS / Linux
kill -9 12345
```

> **¿Cuál quieres realmente?** Si el ocupante es tu propio proceso zombi, mátalo — moverte al 8081 solo deja una app obsoleta corriendo y te vuelve a confundir mañana. Si el ocupante es algo que necesitas legítimamente (otro servicio en el stack del equipo), mueve tu app y avisa al `environment.ts` de Angular del nuevo puerto. Elegir `server.port=0` es la tercera opción que merece conocerse: significa "cualquier puerto libre", que es lo que hacen los tests de integración (`@SpringBootTest(webEnvironment = RANDOM_PORT)`) precisamente para que una suite de tests nunca choque con tu app de desarrollo en ejecución.

---

## `UnsatisfiedDependencyException` — "no qualifying bean of type…"

Propósito: leer un fallo de conexión de beans y nombrar cuál de las tres causas es, sin abrir la clase.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java`
Docs: [Baeldung — NoSuchBeanDefinitionException](https://www.baeldung.com/spring-nosuchbeandefinitionexception) → leer: "The Cause: No Qualifying Bean of Type"

Este es el que más vas a encontrar en cuanto la app crezca más allá de un tutorial, y el mensaje suena como una acusación:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.victor.timetrack.service.TimeEntryService required
a bean of type 'com.victor.timetrack.repository.TimeEntryRepository' that could not be found.

Action:

Consider defining a bean of type 'com.victor.timetrack.repository.TimeEntryRepository'
in your configuration.
```

Y encima, en el trace:

```
org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name
'timeEntryService': Unsatisfied dependency expressed through constructor parameter 0
	...
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of
type 'com.victor.timetrack.repository.TimeEntryRepository' available
```

Lee los dos nombres de exception como una sola frase, porque son las dos mitades de una misma historia. **`UnsatisfiedDependencyException`** es el fallo *exterior*: Spring intentó construir `TimeEntryService`, y para construirlo debe llamar a tu constructor:

```java
public TimeEntryService(
        TimeEntryRepository timeEntryRepository,   // ← "parameter 0"
        ProjectRepository projectRepository,
        UserRepository userRepository) { … }
```

Para llamar a ese constructor necesita un objeto para cada parámetro, y se lo pide a su propio registro — el **`ApplicationContext`**. **`NoSuchBeanDefinitionException`** es el fallo *interior*: el registro no tenía nada bajo ese tipo. Así que el mensaje es literal. No dice que tu código esté mal; dice **"miré en la caja de objetos que creé, y no había ningún `TimeEntryRepository` dentro"**.

Ese replanteamiento te da las tres — y solo tres — causas:

| Causa | Por qué la caja está vacía | Solución |
|---|---|---|
| La clase no tiene anotación de estereotipo | El component scanning solo registra clases marcadas con `@Service` / `@Repository` / `@Component` / `@Controller`. Una clase sin anotar es una clase Java normal que Spring nunca instancia. | Añadir la anotación |
| La clase está **fuera** del paquete raíz | `@SpringBootApplication` escanea su propio paquete *hacia abajo*. Una clase en `com.other.stuff` ni siquiera se mira — sin error, simplemente no existe en lo que a Spring respecta. | Moverla bajo `com.victor.timetrack` |
| Inyectaste una **interfaz** sin implementación | Spring necesita un objeto concreto. Una interfaz sin ningún `@Service` que la implemente no registra nada. | Aportar una implementación (o, para un repository, extender `JpaRepository` para que Spring Data genere una) |

Cómo leer esa tabla: la fila del medio es la que atrapa a la gente, porque produce **exactamente el mismo mensaje** que una anotación ausente mientras la anotación está ahí mismo, en el archivo. La clase parece perfecta; solo está en el código postal equivocado. Revisa la declaración del paquete antes de revisar la anotación.

> **¿Por qué funciona `TimeEntryRepository` si es una interfaz sin `@Repository` y sin implementación?** Porque Spring Data JPA escribe la implementación por ti al arrancar. Busca interfaces que extiendan `JpaRepository`, genera una clase proxy que implementa cada método derivado (`findByUser`, `save`, `findById`) a partir de los nombres de los métodos, y registra *ese* proxy como el bean. Es el mismo mecanismo de proxy detrás de `@Transactional` ([08-transacciones.md](08-transacciones.md)) — Spring casi nunca te entrega el objeto que escribiste; te entrega un wrapper generado alrededor de él. Y es exactamente por eso que existe la tercera fila de la tabla: el día que inyectes tu *propia* interfaz, nadie está generando nada, y Spring te pide una implementación a ti.

> **Fallo relacionado, a una palabra de distancia — `BeanDefinitionOverrideException`.** El problema opuesto: no cero beans, sino dos bajo el mismo nombre. `Invalid bean definition ... bean definition ... already defined` al arrancar suele significar que un método `@Bean` choca con un `@Component` escaneado del mismo nombre. La solución es renombrar o borrar uno de los dos. **Nunca** es `spring.main.allow-bean-definition-overriding=true` — ese flag no resuelve la ambigüedad, solo elige un ganador en silencio, y un entrevistador que lo vea en tu configuración sabe que convertiste un error en una moneda al aire.

---

## El datasource: configurado vs. alcanzable

Propósito: distinguir "Spring no tiene configuración de base de datos" de "Spring tiene la configuración y la base de datos la rechazó" — dos fallos cuyas soluciones viven en lugares completamente distintos.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties`
Docs: [Baeldung — Configuring a DataSource in Spring Boot](https://www.baeldung.com/spring-boot-configure-data-source-programmatic) → leer: "DataSource Configuration"

Ambos fallos matan el arranque y ambos mencionan la base de datos. No son el mismo problema, y un entrevistador te dará uno y te preguntará cuál es.

**Fallo A — Spring no tiene ninguna configuración:**

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource
could be configured.

Reason: Failed to determine a suitable driver class

Action:

Consider the following:
	If you want an embedded database (H2, HSQL or Derby), please put it on the classpath.
	If you have database settings to be loaded from a particular profile you may need to
	activate it (no profiles are currently active).
```

Léelo como la prueba de que la auto-configuración es **condicional, no mágica**. `spring-boot-starter-data-jpa` está en tu classpath, así que la auto-configuración de Boot dice "hay JPA aquí, por lo tanto esta app quiere un `DataSource`", y se pone a buscar `spring.datasource.url` para construir uno. No encuentra nada y se detiene. Las causas, por orden de frecuencia:

- `application.properties` no está en el classpath. Debe estar en `src/main/resources` — esa carpeta es lo que Maven empaqueta en el classpath. Un archivo de propiedades junto a tu clase principal, o en la raíz del proyecto, simplemente nunca se lee, y la app arranca (o, en este caso, muere) como si no existiera.
- La propiedad está mal escrita. `spring.datasource.urls`, `spring.datasoure.url` — Spring no avisa de claves desconocidas, simplemente nunca ve la que querías decir.
- El profile que contiene la configuración no está activo. Fíjate en que el bloque `Action:` lo deja claro: *"no profiles are currently active"*. Tu `application-dev.properties` tiene una url perfecta y nadie pidió `dev`.

**Fallo B — la configuración está bien y la base de datos dijo que no:**

```
com.zaxxer.hikari.pool.HikariPool : HikariPool-1 - Exception during pool initialization.
org.postgresql.util.PSQLException: Connection to localhost:5432 refused. Check that the hostname
and port are correct and that the postmaster is accepting TCP/IP connections.
```

**Hikari** es el connection pool que Spring Boot incluye por defecto. Un pool abre un puñado de conexiones a la base de datos *al arrancar* y las reparte entre las requests, porque abrir una conexión TCP y autenticar por cada request sería demasiado lento. `Exception during pool initialization` significa por tanto: Spring leyó tu url, intentó abrir esa primera conexión, y la red o Postgres respondieron con un rechazo. Tres mensajes distintos, tres soluciones distintas:

| La línea que ves | Qué significa | Dónde está la solución |
|---|---|---|
| `Connection to localhost:5432 refused` | Nada está escuchando en ese host:puerto — Postgres no está corriendo, o está en otro puerto, o (en Docker) `localhost` es directamente el host equivocado | Arrancar Postgres / corregir el host |
| `FATAL: password authentication failed for user "postgres"` | Postgres está corriendo y respondió — simplemente rechazó las credenciales | `spring.datasource.password`, o la variable de entorno `DB_PASSWORD` que la rellena |
| `FATAL: database "timetrack" does not exist` | Postgres está corriendo, las credenciales están bien, esa base de datos nunca se creó | Crearla en pgAdmin |

Cómo leer esa tabla: las tres filas son una escalera, y cada peldaño demuestra que el peldaño de abajo funcionó. "Refused" significa que nunca llegaste a Postgres. "Authentication failed" demuestra que llegaste. "Database does not exist" demuestra que llegaste *y* que iniciaste sesión. Saber en qué peldaño estás te dice exactamente qué no perder el tiempo comprobando.

> **Hibernate crea *tablas*, nunca la *base de datos*.** `ddl-auto=update` lee tus clases `@Entity` y ejecuta `CREATE TABLE` — pero antes debe estar ya conectado a algo para poder hacerlo, y no puedes conectarte a una base de datos que no existe. Esa es toda la razón por la que `FATAL: database "timetrack" does not exist` es un fallo de arranque y no algo que Spring arregle silenciosamente. En TimeTrack creas la base de datos `timetrack` una sola vez, a mano, en pgAdmin; todo lo que hay dentro, lo construye Hibernate.

> **El tercer miembro de la familia — `Cannot load driver class: org.postgresql.Driver`.** Spring conoce la url, sabe que es una url `jdbc:postgresql:`, y no encuentra la clase que habla el protocolo wire de PostgreSQL. El driver falta en el `pom.xml` (o tiene un scope que lo deja fuera en tiempo de ejecución). La lección de fondo: **JPA no es una conexión a base de datos.** `spring-boot-starter-data-jpa` te da Hibernate y el `EntityManager`; el *driver* es una dependencia aparte, una por base de datos, y cambiar Postgres por MySQL significa cambiar ese jar.

---

## `localhost` dentro de un contenedor es el propio contenedor

Propósito: entender el fallo más común de "funciona en mi máquina, muere en Docker" y por qué la solución es una palabra dentro de una url.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties` (la propiedad) — el archivo Compose que la sobrescribe se propone en [10-herramientas.md](10-herramientas.md), aún no está en el repo
Docs: [Docker — Networking in Compose](https://docs.docker.com/compose/how-tos/networking/) → leer: los párrafos iniciales sobre los nombres de servicio como hostnames

Tu configuración de TimeTrack hoy dice:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
```

En tu portátil eso es correcto y funciona. Pon exactamente el mismo jar dentro de un contenedor, ejecuta `docker compose up`, y muere con el `Connection to localhost:5432 refused` de la sección anterior — mientras Postgres está corriendo de forma demostrable, en el contenedor justo al lado.

El mecanismo es toda la lección. **`localhost` no es un lugar, es una palabra que significa "yo mismo".** Resuelve a la dirección de loopback `127.0.0.1`, que cada máquina interpreta como *ella misma*. Un contenedor es (a efectos de red) su propia máquina con su propio loopback. Así que dentro del contenedor `app`, `localhost:5432` significa "el puerto 5432 **del contenedor app**" — donde nadie escucha, porque Postgres es un contenedor *distinto*.

```
   YOUR LAPTOP                          DOCKER COMPOSE
   ───────────                          ──────────────
                                   ┌──────────────────────┐
   ┌─────────┐                     │ app container        │
   │  app    │ ──localhost:5432──► │  localhost = itself  │──►  ✗ nothing here
   │         │        │            │                      │
   └─────────┘        ▼            └──────────┬───────────┘
                 ┌─────────┐                  │ db:5432
                 │ Postgres│                  ▼
                 │  :5432  │            ┌──────────────┐
                 └─────────┘            │ db container │
                                        │  Postgres    │
   localhost is correct here            └──────────────┘
                                  the SERVICE NAME is the hostname here
```

Compose crea una red privada para el stack y registra **cada servicio bajo su propio nombre** como un hostname de DNS. Tu `docker-compose.yml` llama `db` al servicio de la base de datos, así que `db` es el hostname, y la url se convierte en:

```
jdbc:postgresql://db:5432/timetrack
```

> **No editas `application.properties` para arreglar esto — ese es justamente el punto.** El mismo jar debe correr en tu portátil *y* en Compose ([01-basicos.md](01-basicos.md), "build once, configure per environment"). Sobrescribes la propiedad desde el entorno, lo cual funciona gracias al **relaxed binding** de Spring: la variable de entorno `SPRING_DATASOURCE_URL` se mapea sobre la propiedad `spring.datasource.url` (mayúsculas, puntos → guiones bajos), y una variable de entorno gana a un archivo de propiedades en el orden de precedencia. Eso es exactamente el bloque `environment:` del archivo Compose en [10-herramientas.md](10-herramientas.md) — el archivo mantiene `localhost` para tu portátil, Compose inyecta `db` para el contenedor, nadie reconstruye nada.

> **Su gemelo malvado: la app arranca antes de que Postgres esté listo.** `depends_on: [db]` suena a "espera a la base de datos", pero solo espera a que el **contenedor arranque**, no a que Postgres dentro de él termine de inicializarse y acepte conexiones. Postgres tarda un par de segundos en estar listo; tu app se conecta en menos de uno; Hikari recibe `Connection refused` en el primer arranque y — dependiendo de tu configuración de Compose — el contenedor de la app se cierra. Lo vuelves a ejecutar y funciona, que es exactamente el tipo de bug "intermitente, ignóralo" que llega a producción. La solución honesta es un `healthcheck` de Compose en `db` más `condition: service_healthy` en el `depends_on` de la app, para que Compose espere de verdad hasta que Postgres responda. Los entrevistadores preguntan esto para comprobar que sabes distinguir **"contenedor arriba"** de **"servicio listo"** — una distinción que deja de importar solo cuando nunca has operado nada.

---

## Schema drift bajo `ddl-auto=validate`

Propósito: leer el error que significa "tu entity y tu tabla real están en desacuerdo" y saber por qué la solución nunca es `update`.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`
Docs: [Baeldung — Loading Initial Data with Spring Boot](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql) → leer: "Controlling Database Creation Using Hibernate" (la sección que explica cada valor de `ddl-auto`)

TimeTrack corre hoy con `spring.jpa.hibernate.ddl-auto=update` (abre `application.properties` — es la línea 5), que es el ajuste de aprendizaje: Hibernate compara tus entities con las tablas reales al arrancar y **altera el schema** para que encajen. Cómodo — y la razón por la que está prohibido en producción es que añadirá alegremente una columna a una tabla en vivo sin que nadie lo revise, y nunca elimina ni renombra nada, así que el schema va acumulando poco a poco los fantasmas de cada campo que borraste.

Producción corre el emparejamiento opuesto: **Flyway es dueño del schema** (la configuración de migraciones descrita en [10-herramientas.md](10-herramientas.md) — TimeTrack todavía no tiene Flyway, así que todo lo de abajo es el estado objetivo, no tu configuración actual) e Hibernate queda degradado a comprobador:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

`validate` significa: lee las entities, lee las tablas reales, y si están en desacuerdo **rechaza arrancar**. Cuando están en desacuerdo, este es el mensaje — y fíjate en su forma, porque *no* es el amigable bloque `APPLICATION FAILED TO START`:

```
org.springframework.beans.factory.BeanCreationException: Error creating bean with name
'entityManagerFactory' defined in class path resource
[org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]:
[PersistenceUnit: default] Unable to build Hibernate SessionFactory
	...
Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation:
missing column [rejection_note] in table [public.time_entries]
```

> **Este es el caso de respaldo de la primera sección, en vivo.** Spring no incluye ningún `FailureAnalyzer` para `SchemaManagementException`, así que no hay párrafo `Description:` / `Action:` que leer — recibes el trace en crudo y aplicas la regla: ir **de abajo hacia arriba a través de `Caused by:`** hasta el último. El último `Caused by:` es toda la respuesta; el `BeanCreationException` de encima solo te dice *qué bean* murió mientras ocurría (`entityManagerFactory` — el arranque de JPA, que es donde corre la validación).

Rastrea lo que esa última línea realmente demuestra, porque es más precisa de lo que parece. Hibernate no está adivinando. Consultó el catálogo propio de la base de datos para conocer las columnas reales de `time_entries`, mapeó tu entity `TimeEntry` sobre las columnas que *espera*, y encontró una que necesita y que no está. `rejectionNote` es un campo de tu entity ([`TimeEntry.java`](../../../projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java) lo declara); la **estrategia de nombrado implícita** de Hibernate convierte camelCase en snake_case, así que espera una columna llamada literalmente `rejection_note`; la tabla no la tiene. Alguien añadió el campo a la entity y nunca escribió la migración. (El nombre de la tabla se imprime cualificado con el schema — `public.time_entries` — porque `public` es el schema por defecto de Postgres.)

La solución es un nuevo script de migración — `V4__add_rejection_note_to_time_entries.sql` — y jamás, nunca, volver a `update`. Volver a `update` "lo arregla" dejando que Hibernate haga un `ALTER TABLE` silencioso sobre tu base de datos de producción, que es exactamente lo que `validate` existe para impedir. Sería como apagar la alarma de humo porque hace ruido.

> **`missing column` es solo la mitad de la familia.** La otra mitad es `wrong column type`, p. ej. `found [varchar (Types#VARCHAR)], but expecting [numeric(38,2) (Types#NUMERIC)]` — la columna existe pero la migración la creó como texto mientras tu entity declara un `BigDecimal`. Misma causa raíz (entity y migración escritas por manos distintas en momentos distintos), misma solución (una migración), misma no-solución (`update` ni siquiera lo repararía — Hibernate no cambia el tipo de columnas existentes).

> **Este es el fallo para el que existe `validate`.** Es fácil leer un fallo de arranque como "la herramienta se me pone en medio". Dale la vuelta: sin `validate`, ese desajuste no habría fallado al arrancar — habría fallado a las 3 de la tarde, dentro de una transacción, en la primera request que tocara `rejectionNote`, como un 500 para un usuario real. `validate` convierte un bug de datos en tiempo de ejecución en un fallo de build en tiempo de deploy, que es el lugar más barato posible donde un bug puede vivir. Los entrevistadores preguntan "¿qué evita que tu entity y tu tabla estén en desacuerdo?" y esta es toda la respuesta: Flyway escribe el schema, `validate` demuestra que las entities todavía coinciden con él.

---

## "Ayer funcionaba y no he cambiado nada"

Propósito: recorrer el checklist del entorno en vez de releer código que no ha cambiado.
Docs: [Baeldung — Spring Boot Property Precedence](https://www.baeldung.com/properties-with-spring) → leer: "Properties Precedence"

Cuando el código es idéntico byte a byte al de ayer y la app ya no arranca, la causa no está en el código. Está en el **entorno** — todo lo que el jar lee desde *fuera* de sí mismo. Recorre la lista en este orden, porque está ordenada por frecuencia con la que cada punto es el culpable:

1. **Una variable de entorno ausente.** El `application.properties` de TimeTrack contiene `${DB_PASSWORD}` y `${JWT_SECRET}` — placeholders sin valor por defecto. Si la configuración de ejecución de IntelliJ que usas hoy no es aquella en la que definiste esas variables (una nueva, la de un compañero, una ejecución de Compose), el context falla de inmediato con `Could not resolve placeholder 'DB_PASSWORD' in value "${DB_PASSWORD}"`. Esto es una *funcionalidad*: la app falla al arrancar, ruidosamente, en vez de conectarse con una contraseña vacía y fallar misteriosamente más tarde.
2. **El profile activo equivocado.** `spring.profiles.active` está vacío, o puesto a `test`, así que un archivo entero de propiedades del que dependes nunca se cargó. Revisa el log de arranque — Boot imprime `The following 1 profile is active: "dev"`, o `No active profile set, falling back to 1 default profile: "default"`.
3. **Una base de datos inalcanzable.** Postgres no está corriendo (reiniciar el portátil detiene el servicio), o el contenedor se eliminó, o el puerto cambió. Esta es la escalera de Hikari de dos secciones atrás.
4. **Un secreto expirado o rotado.** El secreto de JWT cambió, así que todos los tokens emitidos previamente ahora fallan la verificación de firma — la app arranca perfectamente y todos los usuarios se desconectan de golpe. (No es un fallo de arranque, pero pertenece al mismo checklist, porque es la misma clase de causa.)

> **El valor de la lista es el reflejo, no los puntos.** El instinto cuando algo se rompe es releer tu propio código, porque es lo que controlas. Pero la *evidencia* — "no ha cambiado ningún código" — ya ha descartado el código. Razonar a partir de lo que cambió en vez de a partir de lo que te resulta familiar es lo que los entrevistadores están sondeando cuando preguntan esto. También es, en la práctica, por qué la primera pregunta en cualquier canal de incidente real es "¿qué se desplegó?" y la segunda es "¿qué configuración cambió?".

---

# PARTE 2 — La app corre, pero está mal o va lenta

El proceso está vivo. Nada falló al arrancar. Y aun así un endpoint devuelve un 500, o tarda ocho segundos, o escribe una fila que debería haber sido imposible.

La evidencia que se te entregó en la Parte 1 — el bloque de fallo — no existe aquí. **Nada se ofrece voluntariamente.** Así que cada sección de abajo trata realmente sobre el mismo movimiento: saber *qué interruptor encender* para que el sistema te cuente qué está haciendo.

---

## La Whitelabel Error Page y el 500 desnudo

Propósito: saber exactamente qué te dice un 500 (y qué no te dice), y a dónde se fue el mensaje real.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`
Docs: [Baeldung — Spring Boot Whitelabel Error Page](https://www.baeldung.com/spring-boot-custom-error-page) → leer: "The Whitelabel Error Page"

Una exception se escapa de tu controller y nada la maneja. Desde un navegador obtienes la página por defecto de Spring Boot:

```
Whitelabel Error Page

This application has no explicit mapping for /error, so you are seeing this as a fallback.

Wed Jul 13 10:41:07 CEST 2026
There was an unexpected error (type=Internal Server Error, status=500).
```

Desde Postman, ese mismo respaldo vuelve como JSON con la misma nada dentro:

```json
{
  "timestamp": "2026-07-13T10:41:07.512+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/entries"
}
```

> **En TimeTrack rara vez verás la whitelabel page — y ese es justamente el sentido del consejo que escribiste tú.** Tu `GlobalExceptionHandler` termina con un `@ExceptionHandler(RuntimeException.class)` catch-all ([05-manejo-excepciones.md](05-manejo-excepciones.md)), así que cualquier runtime exception que se escape de un service se captura ahí y se devuelve como tu propio JSON `ErrorResponse` con `"message": "Internal server error"` — un cuerpo deliberado, que no filtra información. El respaldo whitelabel es lo que ocurre cuando **nada** en el advice coincide (una exception fuera de la rama `RuntimeException`, o un fallo lanzado antes de que el advice pueda ejecutarse, como los rechazos de la cadena de filtros de dos secciones más abajo). En cualquier caso el diagnóstico es idéntico: el cuerpo es un placeholder, la verdad está en el log.

Lee lo que realmente significa un 500, porque los juniors lo leen como "un error" y es mucho más concreto que eso: **la request llegó a tu código y tu código lanzó algo que nadie manejó.** Esa sola frase descarta una cantidad enorme de cosas. No es un problema de routing (un 404 lo diría). No es un verbo equivocado (405). No es un `Content-Type` ausente (415). No es autenticación (401) ni autorización (403). La request llegó, `DispatcherServlet` encontró tu método de controller, lo invocó — y una exception se escapó, ningún `@ExceptionHandler` de tu `GlobalExceptionHandler` coincidió con su tipo, y Spring cayó de nuevo en el manejo por defecto de `/error`.

Por eso la respuesta a "¿qué me dice el cuerpo de la respuesta?" es: **nada, y nunca lo hará.** Deja de leerlo. La exception — el nombre de la clase, el mensaje, la línea en `TimeEntryService` — se escribió en el **log del servidor**, y ahí es a donde vas. En IntelliJ es la ventana de ejecución. En Docker es `docker compose logs -f app`.

> **"Pero el mensaje que lancé ni siquiera está ahí."** El cuerpo de error por defecto omite la clave `message` por completo a menos que la pidas explícitamente — por eso no hay ningún campo `"message"` en el JSON de arriba, ni siquiera vacío. Es una decisión de seguridad — `e.getMessage()` de una exception de base de datos puede contener nombres de tabla, fragmentos de SQL o datos de usuario, y enviar eso a un navegador es un informe de reconocimiento gratis para un atacante. En local puedes volver a activarlo:
> ```properties
> server.error.include-message=always
> server.error.include-stacktrace=on_param   # then call /api/entries?trace=true
> ```
> Ambos permanecen **desactivados** en producción, y la razón por la que puedes permitírtelo es precisamente el párrafo anterior: el cliente no necesita el detalle, porque el detalle está en el log donde solo tú puedes leerlo.

> **Un 500 siempre es tu bug.** La familia 4xx significa "el cliente envió algo mal"; la familia 5xx significa "el servidor se rompió". Un fallo de validación no es un 500 — eso es un 400 que el advice produce a propósito ([07-validacion.md](07-validacion.md)). Una entry ausente no es un 500 — eso es un 404 que produce tu handler de `ResourceNotFoundException`. Si estás viendo un 500, algún camino en tu código lanza una exception que no anticipaste, y la lectura honesta es: *mi manejo de errores tiene un agujero*. El catch-all `@ExceptionHandler(Exception.class)` cierra el agujero en la *respuesta* (un 500 limpio en JSON en vez de una whitelabel page), pero no lo cierra en el *código* — igualmente vas y lees el log.

---

## Diagnosticar un endpoint lento — el checklist ordenado

Propósito: convertir "este endpoint tarda 8 segundos" en una causa medida, en el orden que la encuentra más rápido.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` (`getAll()`)
Docs: [Baeldung — Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators) → leer: "Metrics" — el meter `http.server.requests` es el que importa aquí

*"Un endpoint tarda ocho segundos. ¿Qué revisas primero?"* Se pregunta constantemente, y la trampa está incorporada: la mayoría de candidatos empiezan a proponer soluciones — "añadiría un índice", "añadiría caching", "quizá `JOIN FETCH`". **Cada una de esas es una respuesta equivocada, porque ninguna es una medición.** Proponer una optimización antes de medir es justo lo que la pregunta está diseñada para atrapar.

El checklist, en orden:

**Paso 0 — mide, para saber a dónde van realmente los ocho segundos.** El `pom.xml` de TimeTrack todavía no tiene Actuator — añadir `spring-boot-starter-actuator` es una dependencia y ningún código, y es lo que te da el timing propio del endpoint:

```
GET /actuator/metrics/http.server.requests?tag=uri:/api/entries
```
```json
{
  "name": "http.server.requests",
  "measurements": [
    { "statistic": "COUNT",   "value": 42 },
    { "statistic": "TOTAL_TIME", "value": 336.7 },
    { "statistic": "MAX",     "value": 8.9 }
  ]
}
```

Actuator registra cada request a través de la misma pipeline que la sirve, así que `COUNT` (cuántas), `TOTAL_TIME` (segundos gastados en todas ellas) y `MAX` (la más lenta de todas) son hechos, no conjeturas. `336.7 / 42 ≈ 8s` de media — la lentitud es el comportamiento normal del endpoint, no una request desafortunada aislada. Esa distinción por sí sola redirige toda la investigación: un mal *promedio* es un problema de diseño en la ruta de código; un mal *máximo* con un promedio correcto es contención, una caché fría, o una fila patológica.

**Paso 1 — cuenta las queries SQL.** Esta es la comprobación de mayor rendimiento con diferencia, y TimeTrack ya tiene el interruptor encendido:

```properties
spring.jpa.show-sql=true                       # already in your application.properties
logging.level.org.hibernate.SQL=DEBUG          # the same thing, through the logging system
```

Llama al endpoint una vez y cuenta las líneas `select`. Si un endpoint de listado que devuelve 200 filas imprimió 401 queries, ya lo encontraste y tiene nombre — **N+1** ([04-spring-data-jpa.md](04-spring-data-jpa.md), "El problema N+1"): una query para cargar la lista, y luego una query extra *por cada fila* para cargar las relaciones de esa fila.

Y esto no es hipotético en TimeTrack. Mira lo que hace `getAll()` hoy:

```java
// TimeEntryService.getAll() — the manager branch loads every entry in the system
return isManager
        ? timeEntryRepository.findAll().stream().map(this::toResponse).toList()
        : timeEntryRepository.findByUser(user).stream().map(this::toResponse).toList();
```
```java
// toResponse() — reaches into TWO relations per entry
response.setUserName(timeEntry.getUser().getName());
response.setProjectName(timeEntry.getProject().getName());
```

`findAll()` es una query. Luego, para cada entry, `toResponse()` toca `user` y `project`. Tu `TimeEntry` los declara como `@ManyToOne` simples sin fetch type, y — la trampa por la que pregunta todo entrevistador — **`@ManyToOne` por defecto es `EAGER`**, así que Hibernate resuelve cada asociación a medida que materializa cada fila. Doscientas entries se convierten en cientos de idas y vueltas a Postgres, cada una un salto de red de unos pocos milisegundos, y unos pocos milisegundos × varios cientos *es* tu ocho segundos. La solución es cargarlas en una sola query:

```java
// TimeEntryRepository — proposed, not written yet
@Query("SELECT e FROM TimeEntry e JOIN FETCH e.user JOIN FETCH e.project")
List<TimeEntry> findAllWithUserAndProject();
```

**Paso 2 — revisa el índice.** Si el número de queries es razonable y una query concreta es lenta, la base de datos está escaneando filas a las que debería poder saltar directamente. Un filtro sobre `user_id` y `date` recorre toda la tabla `time_entries` hasta que existe un índice sobre esas columnas. Añádelo en una migración (`CREATE INDEX idx_entries_user_date ON time_entries (user_id, date);`) y recuerda el trade-off, porque es la mitad que los entrevistadores escuchan: cada índice hace las lecturas más rápidas y **las escrituras más lentas** (cada `INSERT` debe actualizar también el índice) y cuesta almacenamiento. Un índice es una decisión, no un regalo.

**Paso 3 — comprueba si el endpoint no tiene límite.** ¿Devuelve `findAll()` sobre una tabla que algún día tendrá 100.000 filas? Entonces ningún índice te salva — estás enviando 100.000 filas por cable y construyendo 100.000 DTOs en memoria. La solución es `Pageable` ([04-spring-data-jpa.md](04-spring-data-jpa.md)), y es también la solución para el `OutOfMemoryError` de la siguiente sección.

**Paso 4 — mide otra vez.** Vuelve a leer la misma métrica de Actuator. Si el número no se movió, tu teoría estaba equivocada y vuelves al paso 1 — con el ciclo cerrado por datos, no por "se siente más rápido ahora".

> **¿Por qué "medir primero" es una regla dura y no solo buenos modales?** Porque la intuición sobre dónde se va el tiempo se equivoca de forma fiable, y una optimización sin medir es infalsable — no puedes distinguir una solución de un placebo. También hay una razón con forma de carrera profesional: un índice que no hace nada sigue gravando permanentemente cada escritura en la tabla. Habrás hecho el sistema más lento y le habrás dicho a todo el mundo que lo hiciste más rápido.

> **La query parece correcta pero no devuelve nada.** `show-sql` imprime el SQL con `?` donde van los valores, lo cual es inútil exactamente cuando más lo necesitas. Activa el log de binding de parámetros y ves los valores que realmente se enviaron:
> ```properties
> logging.level.org.hibernate.orm.jdbc.bind=TRACE
> ```
> ```
> binding parameter (1:BIGINT) <- [7]
> binding parameter (2:VARCHAR) <- [SUBMITTED]
> ```
> Nueve de cada diez veces la respuesta está justo ahí: el id que creías que era 7 es null, o el enum que creías que era `SUBMITTED` llegó como `DRAFT`.

---

## El 403 con el log vacío, y el CORS que solo falla desde el navegador

Propósito: saber en qué punto de la pipeline puede morir una request *antes* de llegar a tu controller — porque ahí es donde tus herramientas de depuración habituales están ciegas.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/SecurityConfig.java`
Docs: [Baeldung — Spring Security CORS](https://www.baeldung.com/spring-security-cors-preflight) → leer: "CORS With Spring Security" (por qué el preflight se rechaza antes de que corra ningún controller)

Dos síntomas, una causa raíz, y la causa raíz es un *lugar*:

```
Angular ──► [ CORS filter ] ──► [ JwtFilter ] ──► [ auth rules ] ──► DispatcherServlet ──► YOUR CONTROLLER
                     └──────── the security filter chain ────────┘         │                      │
                                                                            │              @RestControllerAdvice
                            a request rejected HERE never reaches ──────────┘              only sees things that
                            your code, your log lines, or your advice                      got this far
```

**Síntoma 1 — un 403 y nada en el log.** Tu endpoint deniega la request, añades un `log.info` al principio del método del controller para ver qué pasa, y nunca se imprime. Eso no es un misterio: **la request nunca llegó al método.** Se rechazó dentro de la filter chain, que corre *antes* de que `DispatcherServlet` elija un controller. Es el mismo hecho estructural detrás de una regla que ya conoces de [05-manejo-excepciones.md](05-manejo-excepciones.md) — las exceptions lanzadas dentro de un filter se saltan por completo `@RestControllerAdvice`, porque el advice vive al otro lado del servlet.

Como tu propio código no está corriendo, haces que hable el código de **Spring Security**:

```properties
logging.level.org.springframework.security=DEBUG
```

Ahora la cadena se narra a sí misma, y puedes ver exactamente qué filter dijo que no:

```
o.s.s.w.FilterChainProxy                 : Securing GET /api/entries/42
o.s.s.w.a.AuthorizationFilter            : Authorizing GET /api/entries/42
o.s.s.w.a.AuthorizationFilter            : Failed to authorize GET /api/entries/42 with
  authorization manager org.springframework.security.config.annotation.web.configurers.
  AuthorizeHttpRequestsConfigurer$... and decision AuthorizationDecision [granted=false]
o.s.s.w.access.AccessDeniedHandlerImpl   : Responding with 403 status code
```

> **El nombre de clase en ese log delata la versión.** `AuthorizationFilter` es el moderno (Spring Security 6+, que es lo que usan Spring Boot 3 y tu proyecto en Boot 4). Los tutoriales antiguos y las respuestas de Stack Overflow muestran en su lugar `FilterSecurityInterceptor` — el mismo trabajo, eliminado en Security 6. Si pegas una línea de log en Google y todos los resultados son de 2019, ese desajuste es la razón.

> **"Añadiría un print statement en el controller" es una respuesta descalificadora aquí** — y los entrevistadores hacen exactamente esta pregunta ("tu endpoint devuelve 403 y el log está vacío — ¿qué haces ahora?") para escucharla. Demuestra que el candidato no tiene ningún modelo mental de *dónde* está la request, solo de lo que dice el código. El primer movimiento correcto — activar el log de seguridad y leer qué filter denegó — es una propiedad y treinta segundos.

**Síntoma 2 — funciona en Postman y falla desde Angular con un error de CORS.** La consola del navegador dice:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/entries' from origin 'http://localhost:4200'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

La razón por la que Postman está contento y Chrome no: **CORS es una regla del navegador, no una regla del servidor.** Postman no envía ninguna cabecera `Origin` y por tanto no dispara ningún preflight — simplemente lanza la request. Un navegador, antes de dejar que JavaScript envíe una request cross-origin que lleve cabeceras personalizadas (como `Authorization: Bearer …`), primero envía una request `OPTIONS` pidiendo permiso:

```
OPTIONS /api/entries HTTP/1.1
Origin: http://localhost:4200
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

Esa request `OPTIONS` no lleva **ningún JWT** — el navegador no adjunta tu token a un preflight. Así que si la cadena de seguridad está configurada para autenticar cada request, rechaza el preflight con un 401/403, el navegador no ve cabeceras `Access-Control-Allow-*` en la respuesta, y bloquea la request *real* antes de que llegue a enviarse siquiera. Desde Angular nunca ves fallar a tu endpoint; ves al navegador negarse a llamarlo.

Por eso CORS se configura **dentro de la cadena de seguridad**, no con `@CrossOrigin` en un controller — para cuando una anotación de controller pudiera surtir efecto, la request ya fue rechazada aguas arriba. Tu `SecurityConfig` hace exactamente eso, y la línea `.cors(...)` está haciendo trabajo real:

```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))   // inserts Spring's CorsFilter
```
```java
config.setAllowedOrigins(List.of("http://localhost:4200"));          // Angular's dev server
config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));  // OPTIONS included
config.setAllowCredentials(true);
```

El `CorsFilter` de Spring corre pronto en la cadena y responde el preflight él mismo con las cabeceras de permiso, así que nunca llega a los filters de autenticación.

> **`allowedOrigins("*")` con `allowCredentials(true)` el navegador lo rechaza** — la especificación prohíbe la combinación, porque "cualquier sitio puede llamarme" más "y enviar credenciales" es una puerta abierta. Chrome te lo dirá en la consola en vez de obedecer en silencio. Al desplegar, la solución es listar el origen real del frontend, no ensanchar el wildcard.

---

## `OutOfMemoryError: Java heap space`

Propósito: reconocer el error de Java que casi nunca tiene que ver con la configuración de memoria, y saber por qué subir `-Xmx` es el instinto equivocado.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` (`getAll()`)
Docs: [Baeldung — Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap) → leer: "Heap Space in Java" (qué contiene el heap y por qué tiene un máximo fijo)

```
java.lang.OutOfMemoryError: Java heap space
	at java.base/java.util.Arrays.copyOf(Arrays.java:3512)
	at java.base/java.lang.AbstractStringBuilder.ensureCapacity(AbstractStringBuilder.java:237)
	...
	at com.victor.timetrack.service.TimeEntryService.getAll(TimeEntryService.java:140)
```

El **heap** es la región de memoria donde vive cada objeto que creas. Tiene un tamaño máximo fijo, establecido cuando arranca la JVM (`-Xmx`). `OutOfMemoryError` significa: el garbage collector corrió, no encontró nada que tuviera permiso para borrar, y aun así no había suficiente espacio para el siguiente objeto. Fíjate en el tipo — es un `Error`, no una `Exception`. No es algo que capturas y de lo que te recuperas; para cuando se lanza, la JVM ya está en un estado inutilizable.

El instinto es darle más memoria. **No lo hagas.** En una aplicación Spring hay esencialmente una sola causa y siempre tiene la misma forma: **cargaste un número no acotado de filas en memoria de una vez.** `findAll()` sobre una tabla con un millón de entries hidrata un millón de objetos `TimeEntry`, cada uno con un `User` y un `Project` colgando de él, y luego `.map(this::toResponse)` construye un millón de DTOs *encima de eso* — dos copias completas de la tabla en el heap antes de que un solo byte llegue al cliente.

Doblar `-Xmx` no arregla eso, lo pospone: la app ahora sobrevive a un millón de filas y muere en dos millones, habiendo además tardado el doble en cada request recolectando basura mientras tanto. Has convertido un error en una app lenta, cara, y aun así condenada.

La solución es dejar de cargarlo todo:

```java
// ❌ MAL — unbounded: the table's size decides your memory usage
public List<TimeEntryResponse> getAll() {
    return timeEntryRepository.findAll().stream().map(this::toResponse).toList();
}

// ✅ BIEN — bounded: the client asks for a page, you load a page
public Page<TimeEntryResponse> getAll(Pageable pageable) {
    return timeEntryRepository.findAll(pageable).map(this::toResponse);
}
```

> **Es el mismo bug que el del endpoint lento de una sección más arriba — simplemente ha crecido.** Que `getAll()` devuelva cada fila es lento con 200 entries, doloroso con 20.000, y fatal con 2.000.000. La lista sin límite es un único defecto de diseño con tres síntomas distintos según cuántos datos se hayan acumulado, que es exactamente por qué los entrevistadores preguntan *"¿qué pasa si llamas a `findAll()` sobre una tabla con 100.000 filas?"* como pregunta de diseño y no de rendimiento. Y es por lo que `getAll()` en tu service de TimeTrack — que hoy devuelve cada entry del sistema a un manager — es un ítem real en el backlog del proyecto, no una preocupación teórica.

> **`.map(this::toResponse)` sobre un `Page` no es la misma llamada que sobre un `List`.** `Page<T>` tiene su propio `map()` que transforma el *contenido* y preserva los metadatos de paginación (total de elementos, total de páginas), que es lo que el cliente Angular necesita para dibujar los controles de paginación. Si haces `.stream()` sobre un `Page` tiras esos metadatos.

---

## `NullPointerException` en un service — las dos causas aburridas

Propósito: nombrar la causa probable a partir del stack trace solo, antes de abrir el archivo.
Archivo: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java`
Docs: [Baeldung — Optional](https://www.baeldung.com/java-optional) → leer: "Optional.orElseThrow()"

Un `NullPointerException` dentro de un service de Spring casi nunca es misterioso. Las JVM modernas incluso te dicen *qué* referencia era null (los mensajes útiles de NPE, activados por defecto desde Java 15):

```
java.lang.NullPointerException: Cannot invoke "com.victor.timetrack.model.Project.getName()"
because the return value of "com.victor.timetrack.model.TimeEntry.getProject()" is null
	at com.victor.timetrack.service.TimeEntryService.toResponse(TimeEntryService.java:209)
```

Lee ese mensaje con atención — nombra *dos* cosas, y la segunda es la que importa. `Cannot invoke "…Project.getName()"` es dónde explotó; `because the return value of "…TimeEntry.getProject()" is null` es **por qué**. Así que no estás buscando un bug en `Project`; estás buscando una fila `TimeEntry` cuyo `project` es null. Ese es todo el diagnóstico, solo a partir del mensaje, sin abrir el archivo.

Dos causas cubren casi todos los casos:

1. **Una relación o un `Optional` que asumiste poblado.** Spring Data devuelve `Optional<T>` desde `findById()` / `findByEmail()` precisamente para que no puedas olvidar el caso de no-encontrado: llamar a `.get()` sobre uno vacío lanza donde querías un 404 limpio. Tu código ya hace lo correcto en todas partes — `.orElseThrow(() -> new ResourceNotFoundException(...))` — y eso no es decoración: convierte un 500 en el 404 que promete el contrato de la API. El trace de arriba es la versión hermana del mismo error, un nivel más adentro: `toResponse()` recorre `timeEntry.getUser()` y `timeEntry.getProject()` sin ninguna comprobación null, así que cualquier fila que alguna vez llegara a la tabla sin un project (un `INSERT` manual defectuoso, una migración, un fixture de test) se convierte en un NPE la primera vez que un manager lista entries.
2. **Una dependencia que es null porque el objeto se creó con `new`.** Spring inyecta dependencias solo en beans que *él* construye. Escribe `new TimeEntryService(...)` tú mismo — o, de forma más sutil, `new` una clase helper que tiene un campo `@Autowired` — y Spring nunca toca ese objeto, así que el campo se queda en null y obtienes un NPE en el primer uso. El mismo mecanismo explica por qué ese objeto también pierde silenciosamente `@Transactional` y `@PreAuthorize`: esas viven en el *proxy* que Spring envuelve alrededor de un bean, y un objeto que construiste con `new` no tiene proxy ([03-inyeccion-dependencias.md](03-inyeccion-dependencias.md)).

> **Por eso el entrevistador puede nombrar la causa sin ver tu código.** Ante un trace de NPE de un service de Spring, adivinará una de esas dos, y acertará la mayoría de las veces. Eso no es un truco de fiesta — es lo que "conocer el framework" realmente significa: el framework restringe las formas en que las cosas pueden ser null, así que el espacio de causas es pequeño.

---

## `/actuator/health` — la comprobación antes que todas las demás

Propósito: distinguir "la app está caída" de "la app está arriba pero no puede alcanzar la base de datos" en una sola request, antes de leer ningún log.
Archivo: `projects/07-timetrack/backend/timetrack/pom.xml` (necesita `spring-boot-starter-actuator` — todavía no añadido)
Docs: [Baeldung — Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators) → leer: "Health Indicators"

Antes de leer un log, responde dos preguntas con una sola llamada HTTP:

```
GET /actuator/health
```
```json
{
  "status": "UP",
  "components": {
    "db":        { "status": "UP", "details": { "database": "PostgreSQL" } },
    "diskSpace": { "status": "UP" },
    "ping":      { "status": "UP" }
  }
}
```

El `status` de nivel superior responde *¿el proceso está vivo y sirviendo HTTP?* El componente `db` responde *¿puede realmente alcanzar Postgres?* — el `DataSourceHealthIndicator` de Actuator ejecuta una query trivial de validación a través del pool de Hikari para averiguarlo, así que `"db": "DOWN"` es un hecho en vivo, no uno cacheado del arranque. Una conexión rechazada entre ambos se ve así:

```json
{
  "status": "DOWN",
  "components": {
    "db": { "status": "DOWN", "details": {
      "error": "org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain
                JDBC Connection" } }
  }
}
```

Esos dos hechos hacen el triaje de todo el incidente. Sin ninguna respuesta → el proceso está muerto o el contenedor se está reiniciando; ve a leer `docker compose logs`. `UP` con `db: DOWN` → tu código está bien y la base de datos o la red no lo están; nada en tu capa de service lo va a explicar. `UP` en todas partes y los usuarios siguen quejándose → es un problema de código o de datos, y la Parte 2 de este archivo empieza de verdad.

> **Así es también como comprueba la propia *máquina*.** Un orquestador de contenedores no lee logs; sondea `/actuator/health` según un calendario y reinicia o da de baja un contenedor que deja de responder `UP`. Esa es la razón real por la que existe el endpoint, y la razón por la que `management.endpoints.web.exposure.include=*` es peligroso: publica `/actuator/env`, `/actuator/beans` y `/actuator/heapdump` junto a él — y `/env` imprime tus propiedades resueltas, `JWT_SECRET` incluido, a quien lo pida. Expón `health` e `info`, asegura el resto. Qué endpoints exponer, y cómo loggear sin filtrar información, es donde continúa [13-logging-observabilidad.md](13-logging-observabilidad.md).

---

## Cómo se ve esto en una entrevista

Propósito: convertir los dos flujos de diagnóstico en las respuestas por las que criba una consultora española.
Docs: relee el bloque `Action:` de la primera sección de este archivo — es la respuesta a la primera pregunta de abajo

- **"The app will not start. What is your first move?"** → Leer el bloque `APPLICATION FAILED TO START` al *final* de la salida: `Description:` dice qué se rompió, `Action:` dice qué hacer. Solo si no hay analyzer para ello caes de nuevo en leer el stack trace de abajo hacia arriba a través de `Caused by:` hasta el primer frame en tu propio paquete.
- **"No qualifying bean of type X — what does that actually mean?"** → El registro de Spring no tiene ningún objeto de ese tipo: la clase no tiene anotación de estereotipo, o está fuera del paquete raíz así que el scanning nunca la alcanzó, o inyectaste una interfaz sin implementación. Di "el component scanning empieza en el paquete de `@SpringBootApplication` y va hacia abajo" — esa frase es lo que están escuchando.
- **"It works on your machine and dies in Docker Compose. Why?"** → `localhost` dentro de un contenedor significa el contenedor mismo. El host del datasource debe ser el **nombre de servicio** de Compose (`db`), inyectado como `SPRING_DATASOURCE_URL` para que el mismo jar corra en ambos sitios. Sigue con que `depends_on` espera al contenedor, no a que Postgres esté listo.
- **"This endpoint takes 8 seconds. What do you check first?"** → Medir primero (`/actuator/metrics/http.server.requests`), luego contar las queries con logging SQL (N+1 es el veredicto habitual), luego revisar el índice sobre las columnas filtradas, luego comprobar si la lista no tiene límite — y medir otra vez. Ofrecer un índice antes de medir hace fallar la pregunta.
- **"Your endpoint returns 403 and the log is empty. What now?"** → La request nunca llegó al controller; murió en la security filter chain, que corre antes de `DispatcherServlet`. Activa `logging.level.org.springframework.security=DEBUG` y lee qué filter la denegó.
- **"It works in Postman but the browser says CORS."** → Postman no envía `Origin` ni ningún preflight. El preflight `OPTIONS` del navegador no lleva ningún JWT y es rechazado por la cadena de seguridad antes de que corra ningún controller — por eso CORS se configura en `SecurityFilterChain`, no con `@CrossOrigin`.
- **"You get `OutOfMemoryError`. Do you raise `-Xmx`?"** → No. Es un `findAll()` sin límite; la solución es paginación. Subir el heap pospone el crash y hace la app más lenta por el camino.

---

## A dónde va esto ahora

Cada técnica de este archivo tiene la misma precondición, y merece decirse en voz alta: **solo puedes leer evidencia que se registró.** El bloque de arranque existe porque Spring lo escribe. El N+1 fue visible porque `show-sql` estaba activado. El 403 soltó su secreto porque subiste el logger de seguridad a `DEBUG`. Actuator respondió porque el starter estaba en el classpath.

Dale la vuelta y obtienes la versión incómoda: **un fallo que no instrumentaste es un fallo que no puedes diagnosticar.** La fila corrupta en `APPROVED` de [11-logica-de-negocio-modelado-dominio.md](11-logica-de-negocio-modelado-dominio.md) — la que abrió este archivo — es exactamente ese caso. Ninguna exception, ningún stack trace, ninguna query lenta; solo una fila. Lo único que podría decirte alguna vez *quién* llamó a `setStatus`, sobre qué entry, a qué hora, desde qué request, es una línea de log que alguien tuvo la disciplina de escribir *antes* de que existiera el bug.

Ese es el tema de [13-logging-observabilidad.md](13-logging-observabilidad.md): qué loggear y a qué nivel, por qué `log.error("failed", e)` y `log.error(e.getMessage())` son mundos aparte, qué nunca debes poner en una línea de log (contraseñas, JWTs en crudo, cuerpos de request completos), y cómo Actuator convierte una app en ejecución en algo que una máquina puede vigilar. Depurar es leer la evidencia. Loggear es asegurarse de que exista alguna.

> **Referencia futura:** `13-logging-observabilidad.md` todavía no está escrito. Cuando lo esté, este es el hilo que retoma: este archivo te enseñó a leer la evidencia; ese te enseña a dejarla atrás.
