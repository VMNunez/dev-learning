# Spring Boot — Fundamentos

> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

---

## Por qué existe Spring Boot

Antes de entrar en Spring Boot, tres términos que verás constantemente:

- **Tomcat** — un servidor web. Es un programa que escucha en un puerto de red (como el 8080) y recibe peticiones HTTP de navegadores o clientes. Sin un servidor web, tu código Java no tiene forma de aceptar conexiones HTTP. Antes de Spring Boot, tenías que descargar Tomcat por separado, instalarlo, configurarlo y desplegar tu app en él.
- **`.jar`** — una aplicación Java empaquetada. Es básicamente un archivo zip que contiene todo tu código compilado y puede ejecutarse directamente con `java -jar app.jar`. Cuando construyes un proyecto Spring Boot, Maven produce un único `.jar` que contiene tu código y todo lo que necesita (incluido Tomcat).
- **Bean** — un objeto que Spring crea y gestiona por ti. En lugar de que escribas `new UserService()` en todas partes, Spring crea una instancia de `UserService`, la almacena y la proporciona automáticamente a cualquier clase que la necesite. Solo tienes que anotar una clase con `@Service` y Spring se encarga del resto.
- **Jackson** — la librería que Spring Boot usa para convertir entre objetos Java y JSON. Cuando un controlador devuelve un objeto Java, Jackson lo convierte en el JSON que recibe el cliente; cuando llega un request con un body JSON, Jackson lo convierte de vuelta en un objeto Java. Funciona automáticamente — lee tus getters públicos (o los que genera Lombok) para decidir qué campos incluir. Nunca lo llamas directamente; Spring Boot lo conecta solo.

---

El Spring básico requiere mucha configuración manual y un servidor instalado por separado. Spring Boot se creó para eliminar esa fricción. Lo hace con dos ideas fundamentales:

1. **Auto-configuración** — Spring Boot lee tus dependencias y configura beans automáticamente. Añade `spring-boot-starter-data-jpa` al pom.xml y Spring Boot configura la conexión a la base de datos, el EntityManager y el soporte de transacciones sin ningún código extra.
2. **Servidor embebido** — Spring Boot incluye Tomcat dentro del `.jar`. Ejecutas `java -jar app.jar` y el servidor arranca. Sin instalación de servidor por separado.

El patrón que se repite: **las anotaciones reemplazan la configuración**. Antes de Spring Boot, escribías XML para conectar beans. Ahora, anotas una clase con `@Service` y Spring Boot se encarga de crear y conectar los objetos por ti.

---

## Spring Initializr — iniciar un proyecto

[start.spring.io](https://start.spring.io) genera un proyecto Spring Boot listo para ejecutar con el `pom.xml` correcto y la estructura de carpetas. Seleccionas las dependencias que necesitas y descargas un zip.

Todo proyecto Spring Boot empieza de la misma manera. Las únicas cosas que cambian son el nombre del artifact y las dependencias.

### Qué significa cada campo

| Campo | Qué es | ¿Siempre igual? |
|---|---|---|
| **Project: Maven** | Build tool — descarga librerías, compila y empaqueta tu código. Gradle hace el mismo trabajo pero Maven es más común en empresas españolas. | Sí, siempre Maven |
| **Language: Java** | El lenguaje de programación. Kotlin y Groovy también corren en la JVM pero la empresa española usa Java. | Sí, siempre Java |
| **Spring Boot version** | Elige la última versión estable — la que está en verde sin etiqueta SNAPSHOT ni RC. SNAPSHOT = sin terminar. RC = casi lista pero aún en pruebas. | Siempre la última estable |
| **Group** | Un namespace que identifica quién es el propietario del proyecto. Sigue la convención de dominio invertido: `capgemini.com` → `com.capgemini`. Para proyectos personales: `com.victor`. | Tu dominio invertido |
| **Artifact** | El nombre del proyecto. Se convierte en el nombre del archivo `.jar` final. Corto, en minúscula, sin espacios. | Cambia por proyecto |
| **Package name** | Generado automáticamente de Group + Artifact. El paquete Java raíz — toda clase vive dentro de él. Nunca lo cambies manualmente. | Auto-generado |
| **Packaging: Jar** | El formato del archivo de salida. Jar = autocontenido, incluye el servidor web dentro. War = formato antiguo, requiere un servidor externo. Siempre Jar. | Sí, siempre Jar |
| **Configuration: Properties** | Formato del archivo de config. Properties = `clave=valor` (más simple). YAML = formato indentado (más legible pero se rompe con mala indentación). | Properties es más seguro |
| **Java** | La versión de Java instalada en tu máquina. Debe coincidir con lo que tienes. Ejecuta `java -version` en el terminal para comprobarlo. | Coincidir con tu instalación |

### Configuración usada para el proyecto 07 (TimeTrack)

| Campo | Valor |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | 4.0.6 (última estable, mayo 2026) |
| Group | com.victor |
| Artifact | timetrack |
| Packaging | Jar |
| Java | 25 |

### Dependencias para un proyecto Spring Boot completo

Estas son todas las dependencias que necesita un proyecto Spring Boot completo. Algunas pueden seleccionarse en Spring Initializr al configurarlo; otras (marcadas con \*) deben añadirse manualmente al `pom.xml` porque no están en Spring Initializr.

| Dependencia | Qué te da |
|---|---|
| **Spring Web** | El servidor HTTP embebido (Tomcat) y las anotaciones para construir endpoints REST (`@RestController`, `@GetMapping`, etc.) |
| **Spring Data JPA** | Herramientas para hablar con la base de datos sin escribir SQL a mano. Defines clases Java y Spring genera las queries. |
| **PostgreSQL Driver** | El conector entre Java y PostgreSQL. Sin esto, Spring no puede abrir una conexión a la base de datos. |
| **Spring Security** | Autenticación y autorización. Bloquea todos los endpoints por defecto hasta que configuras qué rutas son públicas. |
| **Validation** (este es el nombre exacto en Initializr — artifact `spring-boot-starter-validation`) | Anotaciones de Bean Validation (`@NotBlank`, `@NotNull`, `@Email`, `@Min`) para validar los request bodies. |
| **Lombok** | Generación de código en tiempo de compilación — elimina el boilerplate de getters, setters y constructores de las clases entity. |
| **Spring Boot Starter Test** (no es un checkbox — Initializr siempre lo añade automáticamente) | JUnit 5 + Mockito + utilidades de test. Ya está en cada `pom.xml` generado; nunca lo añades a mano. |
| **JJWT\*** (manual) | Librería JWT para crear y validar tokens. Debe añadirse manualmente desde mvnrepository.com (tres artifacts). |

---

## Añadir dependencias después de crear el proyecto

Cuando necesitas una librería que no seleccionaste en Spring Initializr, la añades manualmente al `pom.xml`.

**Cómo encontrar el bloque de dependencia correcto:**

1. Ve a [start.spring.io](https://start.spring.io)
2. Establece la misma versión de Spring Boot y Java que tu proyecto
3. Haz clic en **Add dependencies** y busca la librería
4. Haz clic en **Explore** (abajo a la derecha) — esto muestra el `pom.xml` generado
5. Copia el bloque `<dependency>` de esa librería al `pom.xml` de tu proyecto

Si la librería no está en Spring Initializr, busca en [mvnrepository.com](https://mvnrepository.com) — pero en ese caso debes añadir el número de versión manualmente.

**¿Por qué no hay versión para las dependencias de Spring Boot?** El bloque `<parent>` en `pom.xml` apunta a `spring-boot-starter-parent`, que contiene un BOM (Bill of Materials) — una lista testeada de versiones compatibles. Cualquier dependencia en esa lista funciona sin etiqueta de versión.

**Paso crítico después de añadir cualquier dependencia: recargar Maven.**

Añadir un bloque `<dependency>` al `pom.xml` no descarga el jar automáticamente. IntelliJ necesita recargar el proyecto para disparar la descarga. Si te saltas esto, la dependencia está declarada pero no en el classpath — la app sigue arrancando pero la ignora silenciosamente, sin error.

Dos formas de recargar:

- Pulsar `Ctrl + Shift + O` (el atajo aparece como notificación cuando guardas `pom.xml`)
- O abrir el panel de Maven (lado derecho, icono "m") → clic derecho en el proyecto → **Reload project**

**Cómo verificar que una dependencia se descargó realmente:**

Comprueba que el jar existe en la caché local de Maven. Maven almacena cada librería descargada en `C:\Users\Victor\.m2\repository\`, organizado por group y artifact — sí, esta es la carpeta donde mirar:

Ejemplo para Spring Security:

```
C:\Users\Victor\.m2\repository\org\springframework\boot\spring-boot-starter-security\4.0.6\
```

Si la carpeta no existe, Maven nunca lo descargó. Recarga Maven y vuelve a intentarlo.

---

### Lombok — eliminar código boilerplate

Lombok es una librería Java usada en casi todos los proyectos Spring Boot. Genera getters, setters, constructores, `equals()`, `hashCode()` y `toString()` automáticamente — nunca los escribes a mano.

**Por qué se necesita:**

- JPA requiere un constructor sin argumentos para crear objetos entity al leer de la base de datos
- Jackson (el serializador JSON) requiere getters para convertir entidades a JSON
- Sin Lombok, una clase con 5 campos necesita más de 15 líneas extra de boilerplate

**Fuente:** [start.spring.io](https://start.spring.io) → Add dependencies → busca "Lombok" → Explore

**Paso 1 — Añadir la dependencia dentro de `<dependencies>` en `pom.xml`:**

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

`<optional>true</optional>` significa que Lombok no se incluye en el `.jar` final — solo se necesita en tiempo de compilación para generar el código.

**Paso 2 — Actualizar `spring-boot-maven-plugin` para excluir Lombok del jar empaquetado:**

```xml
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

**Paso 3 — Añadir `maven-compiler-plugin` para que Java 25 use Lombok como annotation processor:**

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

Este paso es obligatorio desde Java 21+ — el compilador necesita saber explícitamente que Lombok procesa anotaciones antes de compilar.

**Después de guardar `pom.xml`:** pulsa `Ctrl + Shift + O` para recargar Maven (o haz clic en la notificación que aparece).

Las tres anotaciones de Lombok que más usarás: **`@Data`** (getters, setters, `equals()`, `hashCode()`, `toString()`), **`@NoArgsConstructor`** (el constructor vacío que JPA necesita para construir una entidad desde una fila de base de datos), y **`@AllArgsConstructor`** (un constructor con todos los campos). Las pones en entidades y DTOs — ve un ejemplo en una entidad real en [04-spring-data-jpa.md](./04-spring-data-jpa.md) y [layer-reference.md](../layer-reference.md).

---

## Estructura del proyecto

Esto es lo que IntelliJ muestra después de abrir el proyecto. La carpeta `.idea/` la crea IntelliJ automáticamente cuando abres la carpeta — guarda la configuración de tu proyecto.

```
backend/
├── .idea/                               ← configuración del proyecto de IntelliJ — auto-generada, nunca la toques
└── timetrack/                           ← el proyecto Maven real (donde está pom.xml)
    ├── pom.xml                          ← config de Maven — lista dependencias (como package.json)
    ├── mvnw                             ← Maven wrapper para Mac/Linux
    ├── mvnw.cmd                         ← Maven wrapper para Windows — IntelliJ lo usa internamente
    ├── HELP.md                          ← docs generados, ignóralo
    ├── .gitignore                       ← ya incluye .idea, target/, etc.
    └── src/
        ├── main/
        │   ├── java/com/victor/timetrack/
        │   │   └── TimetrackApplication.java   ← punto de entrada — el único archivo Java generado
        │   └── resources/
        │       └── application.properties      ← archivo de config — como un .env
        └── test/
            └── java/com/victor/timetrack/
                └── TimetrackApplicationTests.java   ← una clase de test vacía generada
```

### Abrir el proyecto en IntelliJ por primera vez

Cuando abres la carpeta `backend` en IntelliJ, no reconoce automáticamente el proyecto Maven dentro de `timetrack/`. Tienes que indicárselo manualmente:

1. En el panel izquierdo, encuentra `timetrack/pom.xml`
2. Clic derecho → **Add as Maven Project**
3. Espera a que IntelliJ descargue las dependencias y termine de indexar

Después de este paso, IntelliJ reconoce `TimetrackApplication.java` como ejecutable y muestra una flecha verde en el margen izquierdo junto a `main()`.

**Para ejecutar la app:** clic derecho en `TimetrackApplication.java` → **Run 'TimetrackApplication.main()'**, o usa `Shift + F10` una vez que exista una run configuration.

---

### Archivo por archivo

**`.idea/`** — la propia carpeta de IntelliJ. Guarda qué archivos están abiertos, run configurations, configuración de estilo de código. Nunca la toques. Añádela a `.gitignore` para que no vaya a GitHub — cada desarrollador tiene su propia configuración.

**`pom.xml`** — el equivalente de Maven a `package.json`. Lista todas las dependencias y la versión de Java. Cuando añades una nueva dependencia (p.ej. Spring Security), añades un bloque `<dependency>` aquí e IntelliJ la descarga automáticamente.

**`mvnw` / `mvnw.cmd`** — scripts del Maven wrapper. Permiten que IntelliJ ejecute comandos Maven sin necesitar Maven instalado globalmente en tu máquina. No los ejecutas manualmente.

**`HELP.md`** — auto-generado por Spring Initializr con enlaces a docs. Puedes ignorarlo o borrarlo.

**`.gitignore`** — ya configurado con las entradas correctas: `.idea/`, `target/` (salida compilada), etc.

**`TimetrackApplication.java`** — el punto de entrada. Tiene el método `main()`. Nunca tocas este archivo.

**`application.properties`** — donde va toda la configuración: URL de base de datos, puerto, secret JWT, etc. Como un `.env` en Node. Ahora mismo solo tiene una línea — la sección "application.properties — configuración central" más abajo lo desarrolla completamente (conexión a base de datos, configuración JPA y variables de entorno).

**`TimetrackApplicationTests.java`** — una clase de test vacía. El punto de partida para tus tests.

---

## @SpringBootApplication — el punto de entrada (en `TimetrackApplication.java`)

Cada aplicación Spring Boot tiene exactamente una clase con `@SpringBootApplication`. Esto es lo que Spring Initializr generó para TimeTrack:

```java
package com.victor.timetrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TimetrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(TimetrackApplication.class, args);
    }

}
```

- `package com.victor.timetrack` — declara a qué paquete pertenece esta clase. Cada clase Java empieza con esto.
- `import` — trae clases de otros paquetes, igual que `import` en TypeScript.
- `@SpringBootApplication` — una anotación que hace tres cosas a la vez (ver tabla abajo).
- `main()` — el punto de entrada del programa. Cuando haces clic en Run en IntelliJ, Java empieza aquí.
- `SpringApplication.run(...)` — arranca todo el contexto de Spring: inicia Tomcat, conecta a la base de datos, registra todos los componentes.

**Nunca tocas este archivo.** Es la llave de encendido — solo necesita existir.

`@SpringBootApplication` combina tres anotaciones:

| Anotación | Qué hace |
|---|---|
| `@Configuration` | Marca esta clase como fuente de beans de Spring |
| `@EnableAutoConfiguration` | Activa la auto-configuración basada en el classpath |
| `@ComponentScan` | Escanea el paquete actual y todos los subpaquetes buscando `@Component`, `@Service`, `@Repository`, `@Controller` |

La clase debe estar en el paquete raíz para que `@ComponentScan` encuentre todos tus componentes automáticamente.

---

## application.properties — configuración central

`src/main/resources/application.properties` es donde va toda la configuración específica del entorno. Sin valores hardcodeados en el código Java. Piénsalo como un archivo `.env`.

Todas las propiedades siguen un patrón de namespace: `spring.[feature].[setting]`. Una vez que conoces el namespace, puedes encontrar cualquier propiedad en el [apéndice oficial](https://docs.spring.io/spring-boot/appendix/application-properties/index.html) o en la [guía de acceso a datos](https://docs.spring.io/spring-boot/reference/data/sql.html).

### Conexión a la base de datos — proyecto 07 (TimeTrack)

**Paso 1 — Crea la base de datos en pgAdmin.** Clic derecho en tu servidor → Create → Database. Nómbrala `timetrack`. Owner: `postgres`.

**Paso 2 — Configura `application.properties`:**

```properties
spring.application.name=timetrack

# Database connection
spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Docs: las claves de datasource (`spring.datasource.*`) y de JPA (`spring.jpa.*`) están listadas en el apéndice oficial → https://docs.spring.io/spring-boot/appendix/application-properties/index.html — leer: "Data Properties". Los valores de `ddl-auto` (`update`, `create`, `validate`, `none`) se explican en https://docs.spring.io/spring-boot/how-to/data-initialization.html → leer: "Initialize a Database Using Hibernate".

| Propiedad | Qué hace |
|---|---|
| `spring.datasource.url` | JDBC URL — protocolo + driver + host + puerto + nombre de base de datos |
| `spring.datasource.username` | Usuario de PostgreSQL |
| `spring.datasource.password` | Contraseña de PostgreSQL — nunca commitees el valor real a GitHub |
| `spring.jpa.hibernate.ddl-auto=update` | Crea tablas si no existen; las actualiza si cambia la entidad. Nunca uses `create` en producción (borra y recrea las tablas). |
| `spring.jpa.show-sql=true` | Imprime el SQL que genera Hibernate en la consola — útil mientras aprendes |

**Cómo verificar que la conexión funciona:** ejecuta `TimetrackApplication.java` en IntelliJ y busca esta línea en la consola:

```
HikariPool-1 - Start completed.
```

HikariPool es el connection pool que Spring Boot usa por defecto. Abre un conjunto de conexiones a la base de datos al arrancar y las reutiliza para cada request — más rápido que abrir una nueva conexión cada vez.

> **Formato de JDBC URL:** `jdbc:postgresql://localhost:5432/timetrack`
>
> - `jdbc` — el protocolo estándar de Java para conexiones a bases de datos
> - `postgresql` — el driver específico (coincide con la dependencia en `pom.xml`)
> - `localhost:5432` — host y puerto (5432 es el puerto por defecto de PostgreSQL)
> - `timetrack` — el nombre de la base de datos

---

### Variables de entorno en application.properties

Nunca commitees secretos reales (contraseñas, API keys, JWT secrets) a git. Usa variables de entorno en su lugar.

**Sintaxis:**

```properties
spring.datasource.password=${DB_PASSWORD}
```

Spring Boot lee el valor de `DB_PASSWORD` del entorno al arrancar. Si la variable no está establecida, la app falla al arrancar — lo que te obliga a establecerla siempre explícitamente.

**Con un valor por defecto:**

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:timetrack}
```

La sintaxis `${VARIABLE:default}` usa el valor por defecto si la variable no está establecida. Útil para valores que cambian entre entornos pero no son secretos — localmente los valores por defecto funcionan, en Docker los sobreescribes.

**Regla:** solo los secretos necesitan variables de entorno por seguridad. Otros valores (host, puerto, nombre de base de datos) usan valores por defecto para desarrollo local y se sobreescriben en producción.

**Cómo establecer variables de entorno en IntelliJ:**

1. Barra de herramientas superior → clic en el desplegable junto al botón Run → **Edit Configurations**
2. Haz clic en **Modify options** → **Environment variables**
3. Haz clic en **+** y añade `Name` / `Value`

Los valores se quedan en tu máquina — nunca se commitean.

**`application.properties` final para TimeTrack:**

```properties
spring.application.name=timetrack

spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

**Si accidentalmente commiteas un secreto:** cambiar el valor en un nuevo commit no es suficiente — el commit antiguo sigue siendo visible en el historial de git. La acción correcta es **invalidar la credencial inmediatamente** (cambiar la contraseña, revocar la API key) para que el valor filtrado quede inservible.

---

## Spring profiles — configuración por entorno

Purpose: los perfiles de Spring te permiten tener un archivo de config por entorno (local, staging, producción) sin cambiar el código. El archivo correcto se carga automáticamente según qué perfil está activo.

Docs: https://docs.spring.io/spring-boot/reference/features/profiles.html → leer: "Adding Active Profiles" y la convención de nombrado de archivos properties

File: `src/main/resources/`

Creas archivos de propiedades adicionales con el nombre `application-{profile}.properties`. El nombre del perfil en el nombre del archivo es la clave:

```
src/main/resources/
├── application.properties          ← configuración compartida (siempre se carga)
├── application-dev.properties      ← overrides solo de dev (base de datos local, show-sql)
└── application-prod.properties     ← overrides de producción (credenciales reales, sin show-sql)
```

Para activar el perfil dev en IntelliJ: Run → Edit Configurations → Environment variables → añade `SPRING_PROFILES_ACTIVE=dev`. Spring carga `application.properties` primero, luego superpone `application-dev.properties` encima. Los valores en el archivo de perfil ganan sobre el archivo base.

> **Por qué los entrevistadores preguntan esto:** "¿Cómo evitas enviar la configuración de desarrollo a producción?" — los perfiles son la respuesta estándar. Sin ellos o commiteas las credenciales de producción en el repositorio o editas manualmente la config antes de cada despliegue.

---

## @Slf4j — logging estructurado

Purpose: anotación de Lombok que genera un campo `log` en la clase. Usas `log.info()`, `log.warn()`, `log.error()` para escribir al log de la aplicación en lugar de `System.out.println()`.

Docs: https://www.baeldung.com/slf4j-with-log4j2-logback → leer: "SLF4J — a logging facade" y el ejemplo de `@Slf4j`

File: cualquier clase service o componente, p.ej. `src/main/java/com/victor/timetrack/service/ProjectService.java`

```java
@Slf4j
@Service
public class ProjectService {

    public ProjectResponse create(CreateProjectRequest request) {
        log.info("Creating project: {}", request.getName());  // {} es un placeholder para el valor
        // ...
        log.warn("Project name is very long: {}", request.getName());
        log.error("Failed to create project", e);  // el segundo argumento es la excepción — imprime el stack trace
    }
}
```

`@Slf4j` reemplaza este boilerplate: `private static final Logger log = LoggerFactory.getLogger(ProjectService.class)`. Verás `@Slf4j` en cada clase service en codebases reales — los entrevistadores preguntarán sobre ello en preguntas de code review.

**`.info()` vs `.warn()` vs `.error()`:**

| Método | Para qué |
|---|---|
| `log.info()` | Operaciones normales: "created resource X", "user logged in" |
| `log.warn()` | Inesperado pero recuperable: "retry attempt 2/3", "deprecated path called" |
| `log.error()` | Algo se rompió: pasa la excepción como segundo argumento para incluir el stack trace |

> El placeholder `{}` es el formato lazy de SLF4J — no construye el string a menos que el nivel de log esté activo, así que no tiene coste de rendimiento en niveles de log altos.

---

## data.sql — poblar la base de datos al arrancar

Purpose: Spring Boot ejecuta `data.sql` automáticamente después de crear el esquema. Se usa para insertar la primera cuenta de manager cuando no hay endpoint de registro para managers.

Docs: https://docs.spring.io/spring-boot/how-to/data-initialization.html → leer: "Initialize a Database"

File: `src/main/resources/data.sql`

```sql
-- Insert the first manager account — password is BCrypt hash of "admin123"
-- Generate the hash with: new BCryptPasswordEncoder().encode("admin123")
INSERT INTO users (email, password, name, role, active)
VALUES ('manager@timetrack.com',
        '$2a$10$example_bcrypt_hash_here',
        'Admin Manager',
        'MANAGER',
        true)
ON CONFLICT (email) DO NOTHING;
```

`ON CONFLICT (email) DO NOTHING` evita un error de clave duplicada si la app se reinicia — Spring Boot ejecuta `data.sql` cada vez que arranca la app, no solo la primera vez.

> **La pregunta de entrevista:** "¿Cómo creaste el primer manager si no hay endpoint de registro para managers?" — `data.sql` con una contraseña BCrypt pre-hasheada es la respuesta estándar. Generas el hash una vez (con un pequeño método `main` o una herramienta online) y lo commiteas. La contraseña en texto plano nunca está en el código fuente.
